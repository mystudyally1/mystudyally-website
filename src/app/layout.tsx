import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AttributionCapture } from "@/components/forms/AttributionCapture";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import {
  CONTACT_ADDRESS_PARTS,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_DISPLAY,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_LINKS,
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
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  // Inherited by every page unless it overrides a field. Without these a link
  // pasted into WhatsApp — the channel most families reach us on — renders as
  // a bare URL with no title, description or image.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_TAGLINE,
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_TAGLINE,
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

// EducationalOrganization rather than plain Organization: it is the type
// Google maps to the tutoring/education entity, and it accepts the address and
// service-area fields that a bare Organization ignores.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: `${SITE_NAME} Tutoring`,
  description: SITE_TAGLINE,
  url: SITE_URL,
  logo: `${SITE_URL}${OG_IMAGE_PATH}`,
  image: `${SITE_URL}${OG_IMAGE_PATH}`,
  email: CONTACT_EMAIL,
  telephone: CONTACT_WHATSAPP_DISPLAY,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT_ADDRESS_PARTS.street,
    addressLocality: CONTACT_ADDRESS_PARTS.locality,
    postalCode: CONTACT_ADDRESS_PARTS.postalCode,
    addressCountry: CONTACT_ADDRESS_PARTS.countryCode,
  },
  areaServed: "Worldwide",
  // Verified profiles only — sameAs is how search engines reconcile this entity
  // with its social presence, and a wrong URL here merges the wrong brand.
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.trustpilot],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="flex min-h-screen flex-col bg-surface font-sans text-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
      </body>
    </html>
  );
}
