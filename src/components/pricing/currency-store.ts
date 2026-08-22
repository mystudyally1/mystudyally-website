"use client";

import { useSyncExternalStore } from "react";
import { BASE_CURRENCY, CURRENCIES, ZONE_COUNTRY } from "@/data/currencies";
import { currencyForCountry, getCurrency } from "@/lib/currency";
import { GEO_ENDPOINT } from "@/lib/constants";

/**
 * The site is a static export, so there is no request to read a country from
 * at render time. Region is worked out client-side, from two signals:
 *
 * 1. The browser's timezone, which needs no network and so applies on the
 *    first frame. Right for the great majority of visitors.
 * 2. The forms Worker's /geo, which is on Cloudflare and is handed the real
 *    country in CF-IPCountry. It arrives a moment later and wins, correcting
 *    the cases the timezone cannot resolve — chiefly the Gulf states, which
 *    share timezone identifiers.
 *
 * Neither is required. With both unavailable — no Worker, an unlisted zone,
 * offline — prices stay in USD, which is what the plans are actually charged
 * in. There is no currency selector, so the fallback has to be the honest
 * number rather than a guess.
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

  // Instant, offline, and good enough on its own for every market here except
  // telling the Gulf states apart.
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const country = zone ? ZONE_COUNTRY[zone] : undefined;
    if (country) set(currencyForCountry(country));
  } catch {
    // Intl missing or throwing — the lookup below is the other chance.
  }

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
