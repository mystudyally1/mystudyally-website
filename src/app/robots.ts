import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Required for output: "export" — these are generated at build time.
export const dynamic = "force-static";

/**
 * Paths no crawler should index.
 *
 * Repeated into every user-agent group below, not just `*`. A robots.txt
 * consumer obeys exactly one group — the most specific one that matches its
 * token — and ignores the rest. So a bare `User-agent: GPTBot / Allow: /`
 * would not inherit these, and would hand the AI crawlers the one page we
 * deliberately keep out of the index.
 */
const DISALLOW = [
  // Conversion confirmation page. It is `noindex` too, but keeping crawlers
  // off it also keeps it out of analytics-referrer noise.
  "/thank-you/",
  // The Apache ErrorDocument target. Reachable directly, and a soft-404 in the
  // index is worse than no page at all.
  "/404.html",
  // Next's RSC flight payloads, emitted alongside the HTML by the static
  // export. They are the same content in a format no search engine renders —
  // crawling them wastes budget and risks duplicates.
  //
  // Matched by their two real shapes rather than a blanket "/*.txt$". That
  // broader rule also caught /llms.txt and the IndexNow key file, so the AI
  // crawlers named below were being handed an allow and a disallow for the one
  // file written for them.
  "/*index.txt$",
  "/*__next",
];

/**
 * AI crawlers that can cite the site back to a user.
 *
 * These are listed explicitly rather than left to inherit `User-agent: *`.
 * Two reasons: the intent is then readable in the file itself, and a future
 * tightening of the `*` group cannot silently cut off AI-search visibility
 * without someone also editing this list.
 *
 * Training-only crawlers (CCBot, anthropic-ai, Bytespider) are deliberately
 * not named. They fall through to the `*` group and are allowed. Blocking them
 * gains nothing here — the site publishes no proprietary content — but to
 * change that, add them with `disallow: "/"` rather than removing anything
 * below, or the citation crawlers lose access too.
 */
const AI_SEARCH_CRAWLERS = [
  "GPTBot", // OpenAI — ChatGPT web search
  "OAI-SearchBot", // OpenAI — search features
  "ChatGPT-User", // OpenAI — user-triggered browsing (ignores robots.txt, listed for intent)
  "ClaudeBot", // Anthropic — Claude web features
  "PerplexityBot", // Perplexity
  "Google-Extended", // Google — Gemini grounding; separate token from Googlebot
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // One group per crawler. A combined group would work, but Next emits
      // these in source order and a per-agent group is what every robots.txt
      // tester reports against.
      ...AI_SEARCH_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
      // Explicit Googlebot-Image allow: blog thumbnails and tutor photos should
      // stay eligible for image search.
      { userAgent: "Googlebot-Image", allow: ["/images/", "/og.png", "/icons/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Legacy directive, but Yandex and a few crawlers still read it, and it
    // costs one line to state which hostname is the real one.
    host: SITE_URL,
  };
}
