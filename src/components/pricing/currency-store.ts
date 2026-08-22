"use client";

import { useSyncExternalStore } from "react";
import { BASE_CURRENCY, CURRENCIES } from "@/data/currencies";
import { currencyForCountry, getCurrency } from "@/lib/currency";
import { GEO_ENDPOINT } from "@/lib/constants";

/**
 * The site is a static export, so there is no request to read a country from
 * at render time. Detection is client-side against the forms Worker's /geo,
 * which is on Cloudflare and so is handed the country in CF-IPCountry — the
 * site's own infrastructure rather than a third-party geo API.
 *
 * Any failure — offline, Worker down, blocked — leaves prices in USD, which is
 * the currency the plans are actually charged in. There is no currency
 * selector, so the fallback has to be the honest number rather than a guess.
 *
 * Held outside React as a store rather than in a context so the lookup runs
 * once for the whole page however many prices are on it, and so the server
 * snapshot is unconditionally USD: prerendered HTML and the first client
 * render then agree, and a crawler only ever sees one price.
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

  fetch(GEO_ENDPOINT, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((body: { country?: string }) => {
      if (body.country) set(currencyForCountry(body.country));
    })
    .catch(() => {
      // Offline, blocked, or the Worker is unreachable — USD stands.
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  detect();
  return () => {
    listeners.delete(listener);
  };
}

export function useCurrency() {
  const code = useSyncExternalStore(
    subscribe,
    () => current,
    () => BASE_CURRENCY,
  );
  return getCurrency(code);
}
