"use client";

import { useSyncExternalStore } from "react";
import { BASE_CURRENCY, CURRENCIES } from "@/data/currencies";
import { currencyForCountry, getCurrency } from "@/lib/currency";

const STORAGE_KEY = "msa_currency";

/**
 * The site is a static export, so there is no request to read a country from
 * at render time. Detection is client-side against Cloudflare's own
 * /cdn-cgi/trace, which is served from the edge on this origin — no third
 * party, no API key, nothing to configure. It is absent in dev and in the
 * audit's local file server; that path simply leaves prices in USD.
 *
 * Held outside React as a store rather than in a context so the lookup runs
 * once for the whole page however many prices are on it, and so the server
 * snapshot is unconditionally USD: prerendered HTML and the first client
 * render then agree, and a crawler only ever sees the currency the plans are
 * actually charged in.
 */
let current = BASE_CURRENCY;
let started = false;
const listeners = new Set<() => void>();

function set(code: string) {
  if (!CURRENCIES[code] || code === current) return;
  current = code;
  for (const listener of listeners) listener();
}

/** Runs on first subscribe — i.e. after mount, never during render. */
function detect() {
  if (started) return;
  started = true;

  // An explicit choice always wins over geo: someone who switched to GBP while
  // travelling meant it.
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (Safari private mode, locked-down profiles). Detection
    // still works, it just is not remembered.
  }
  if (stored && CURRENCIES[stored]) {
    set(stored);
    return;
  }

  fetch("/cdn-cgi/trace", { cache: "no-store" })
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
    .then((text) => {
      const loc = /^loc=([A-Z]{2})$/m.exec(text);
      if (loc) set(currencyForCountry(loc[1]!));
    })
    .catch(() => {
      // Offline, blocked, or not behind Cloudflare — USD stands.
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  detect();
  return () => {
    listeners.delete(listener);
  };
}

export function setCurrency(code: string) {
  set(code);
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Not remembered across pages; the switch still applies to this one.
  }
}

export function useCurrency() {
  const code = useSyncExternalStore(
    subscribe,
    () => current,
    () => BASE_CURRENCY,
  );
  return getCurrency(code);
}
