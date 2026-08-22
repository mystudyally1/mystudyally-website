import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AttributionCapture } from "@/components/forms/AttributionCapture";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import {
  BING_SITE_VERIFICATION,
  GOOGLE_SITE_VERIFICATION,
  OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  // Site-wide crawl defaults. `max-image-preview: large` is the switch that
  // lets Google use the full-width thumbnail in results and Discover instead of
  // a postage stamp; `max-snippet: -1` lifts the snippet length cap. Neither is
  // on by default. Pages that need to stay out of the index (thank-you, 404,
  // unverified curricula) set their own `robots` block, which replaces this one.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Phone numbers are already marked up as WhatsApp links; leaving iOS to
  // auto-detect them wraps stray digits (prices, dates) in tel: links too.
  formatDetection: { telephone: false, address: false, email: false },
  ...(GOOGLE_SITE_VERIFICATION || BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
          ...(BING_SITE_VERIFICATION ? { other: { "msvalidate.01": BING_SITE_VERIFICATION } } : {}),
        },
      }
    : {}),
  manifest: "/site.webmanifest",
  // Inherited by every page unless it overrides a field. Without these a link
  // pasted into WhatsApp — the channel most families reach us on — renders as
  // a bare URL with no title, description or image.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

/**
 * The design is a light-only palette. Without an explicit declaration the page
 * reports `color-scheme: normal`, which lets Chrome/Edge auto-dark-mode apply
 * its own inversion — it reads as a grey tint over the whole site.
 */
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="flex min-h-screen flex-col bg-surface font-sans text-body antialiased">
        {/* The two site-wide entity nodes. Every page's own schema points at
            these by @id, so the whole domain resolves to one organisation and
            one site rather than a fresh entity per URL. */}
        <JsonLd nodes={[organizationJsonLd, websiteJsonLd]} />
        <AttributionCapture />
        {/* Every page opens with a sticky header and, on Curricula, a 10-item
            mega menu. Without this a keyboard or screen-reader user re-walks
            the whole nav on every navigation before reaching the content. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-[16px] focus:top-[12px] focus:z-[200] focus:rounded-[12px] focus:bg-ink focus:px-[18px] focus:py-[12px] focus:text-14 focus:font-extrabold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        {/* Explicit background, not inherited from body. Browser auto-dark and
            dark-mode extensions repaint surfaces they consider undeclared while
            leaving explicit ones alone, which tinted this wrapper but not the
            footer (which sets bg-white) — a visible seam at the footer edge. */}
        <main id="main" className="flex-1 bg-surface">
          {children}
        </main>
        <SiteFooter />
        <ChatWidgetLazy />
        {/* Real-user Core Web Vitals, reported to Vercel Speed Insights. The
            beacon is same-origin (/_vercel/speed-insights/*), so it needs no
            third-party origin — but it does need Speed Insights enabled on the
            Vercel project, and any CSP added later must allow those paths. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
