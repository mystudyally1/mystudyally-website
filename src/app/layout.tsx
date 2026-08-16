import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AttributionCapture } from "@/components/forms/AttributionCapture";
import { ChatWidgetLazy } from "@/components/chat/ChatWidgetLazy";
import { CONTACT_EMAIL, CONTACT_WHATSAPP_DISPLAY, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

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
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  telephone: CONTACT_WHATSAPP_DISPLAY,
  sameAs: [] as string[],
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
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <ChatWidgetLazy />
      </body>
    </html>
  );
}
