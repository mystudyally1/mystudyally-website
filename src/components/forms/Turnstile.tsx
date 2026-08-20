"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/constants";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (code?: string) => void;
          "timeout-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/** challenges.cloudflare.com is on several blocklists and behind some corporate
 *  proxies. Without a ceiling a hung request leaves the form permanently
 *  un-submittable with a spinner and no explanation. */
const LOAD_TIMEOUT_MS = 12_000;

/** Ceiling on the challenge itself, armed once the widget has been rendered.
 *
 *  Turnstile solves its challenge against a rotating
 *  <random>.challenges.cloudflare.com host, and Cloudflare publishes those
 *  subdomains AAAA-only — only the apex has an A record. A client with no
 *  working IPv6 therefore cannot execute the challenge at all. That usually
 *  surfaces as error 600010 via error-callback, but not reliably: the widget
 *  can equally sit there forever without invoking any callback. Nothing else
 *  reports that state, so without this watchdog the visitor is left with a
 *  permanently disabled submit button and no explanation. */
const VERIFY_TIMEOUT_MS = 25_000;

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window !== "undefined" && window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    const timer = setTimeout(() => reject(new Error("Turnstile timed out")), LOAD_TIMEOUT_MS);

    script.addEventListener("load", () => {
      clearTimeout(timer);
      resolve();
    });
    script.addEventListener("error", () => {
      clearTimeout(timer);
      reject(new Error("Turnstile failed to load"));
    });

    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((err) => {
    // Drop the cached promise so a later mount (or the visitor disabling their
    // blocker and reopening the form) gets a fresh attempt instead of
    // replaying the rejection forever.
    scriptPromise = null;
    throw err;
  });

  return scriptPromise;
}

export type TurnstileStatus = "loading" | "ready" | "unavailable";

export interface TurnstileHandle {
  /** Re-challenge. A token is single-use: after the Worker rejects one, the
   *  same value can never succeed, so a retry must start from a new widget. */
  reset: () => void;
}

export const Turnstile = forwardRef<
  TurnstileHandle,
  {
    onVerify: (token: string) => void;
    onExpire: () => void;
    onStatusChange?: (status: TurnstileStatus) => void;
  }
>(function Turnstile({ onVerify, onExpire, onStatusChange }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [status, setStatus] = useState<TurnstileStatus>("loading");

  // Callbacks are held in refs so re-renders of the parent form never tear down
  // and re-render the widget, which would drop a token the visitor already has.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onStatusRef = useRef(onStatusChange);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;
  onStatusRef.current = onStatusChange;

  const apply = useCallback((next: TurnstileStatus) => {
    setStatus(next);
    onStatusRef.current?.(next);
  }, []);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current !== undefined) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = undefined;
    }
  }, []);

  const armWatchdog = useCallback(() => {
    clearWatchdog();
    watchdogRef.current = setTimeout(() => apply("unavailable"), VERIFY_TIMEOUT_MS);
  }, [apply, clearWatchdog]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        // A fresh challenge is now running, so the ceiling starts over.
        armWatchdog();
      }
    },
  }));

  useEffect(() => {
    let cancelled = false;

    if (!TURNSTILE_SITE_KEY) {
      apply("unavailable");
      return;
    }

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => {
            clearWatchdog();
            apply("ready");
            onVerifyRef.current(token);
          },
          "expired-callback": () => {
            // Turnstile re-challenges on its own after expiry; re-arm so a
            // challenge that now fails still lands on the fallback.
            armWatchdog();
            onExpireRef.current();
          },
          // A render error is not recoverable by waiting — the site key may be
          // scoped to another hostname, the challenge may be blocked, or the
          // client may be unable to execute it at all (600010).
          "error-callback": (code) => {
            clearWatchdog();
            if (process.env.NODE_ENV !== "production") {
              console.warn(`Turnstile error-callback: ${code ?? "unknown"}`);
            }
            onExpireRef.current();
            apply("unavailable");
          },
          "timeout-callback": () => {
            armWatchdog();
            onExpireRef.current();
          },
        });
        armWatchdog();
      })
      .catch(() => {
        if (!cancelled) apply("unavailable");
      });

    return () => {
      cancelled = true;
      clearWatchdog();
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [apply, armWatchdog, clearWatchdog]);

  return (
    <div>
      <div ref={containerRef} />
      {status === "unavailable" && (
        <p role="status" className="text-12 leading-[1.6] text-muted">
          The verification challenge could not load — an ad blocker, browser extension or
          network filter is usually the cause. Allow{" "}
          <span className="font-bold">challenges.cloudflare.com</span> and reload, or send
          your details straight to us instead.
        </p>
      )}
    </div>
  );
});
