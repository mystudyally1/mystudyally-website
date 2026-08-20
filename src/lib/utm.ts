const STORAGE_KEY = "msa_attribution";

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer_url?: string;
  page_path?: string;
}

/**
 * Captures UTM params + referrer + landing page from the URL that first
 * brought the visitor in, once, into sessionStorage. Later page views
 * (including client-side navigations that drop the query string) must not
 * overwrite it, or the form loses attribution the moment someone clicks
 * to a second page.
 */
export function captureAttributionOnce(): void {
  if (typeof window === "undefined") return;

  // Storage access throws outright when cookies/site data are blocked — Safari
  // private mode and locked-down enterprise profiles both do this. Attribution
  // is a nice-to-have; it must never take the page down with it.
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const attribution: Attribution = {
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      referrer_url: document.referrer || undefined,
      page_path: window.location.pathname,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Storage unavailable — the inquiry still submits, just without attribution.
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
