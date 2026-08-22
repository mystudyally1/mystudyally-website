import type { Metadata } from "next";
import Link from "next/link";
import { InquiryFormLazy } from "@/components/forms/InquiryFormLazy";
import { ContactFaq } from "@/components/marketing/ContactFaq";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_LINK,
  SITE_URL,
  SLA_RESPONSE_TIME,
  SUPPORT_HOURS,
} from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_ID, breadcrumbJsonLd, homeCrumb, webPageJsonLd } from "@/lib/seo";
import { pageSocial } from "@/lib/metadata";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Tell us what your child needs and we'll match them with a tutor. Every inquiry is read by a person — we reply within 24 hours.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact/` },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/contact/" }),
};

const CRUMBS = [homeCrumb, { name: "Contact", path: "/contact/" }];

const DETAILS: { label: string; value: string; href?: string }[] = [
  { label: "EMAIL", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "WHATSAPP", value: CONTACT_WHATSAPP_DISPLAY, href: CONTACT_WHATSAPP_LINK },
  { label: "RESPONSE", value: "Within 24 hours, every day" },
  { label: "HOURS", value: SUPPORT_HOURS.display },
  { label: "OFFICES", value: CONTACT_ADDRESS },
];

export default function ContactPage() {
  // The published opening hours, marked up so they can surface in a business
  // panel. `GST` and `GMT` in the visible copy are two overlapping windows;
  // schema wants one, so this states the union both teams are reachable in.
  const contactPointJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "@id": `${SITE_URL}/contact/#contactpoint`,
    contactType: "customer support",
    email: CONTACT_EMAIL,
    telephone: CONTACT_WHATSAPP_DISPLAY,
    url: CONTACT_WHATSAPP_LINK,
    availableLanguage: ["English"],
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...SUPPORT_HOURS.days],
      opens: SUPPORT_HOURS.opens,
      closes: SUPPORT_HOURS.closes,
    },
  };

  return (
    <>
      <JsonLd
        nodes={[
          {
            ...webPageJsonLd({
              type: "ContactPage",
              title: TITLE,
              description: DESCRIPTION,
              path: "/contact/",
              crumbs: CRUMBS,
            }),
            mainEntity: { "@id": ORGANIZATION_ID },
          },
          breadcrumbJsonLd(CRUMBS),
          contactPointJsonLd,
        ]}
      />

      {/* Hero */}
      <section className="px-[20px] pb-[22px] pt-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[8px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-11 font-extrabold tracking-[0.14em] text-muted md:text-12 md:font-bold">
              CONTACT
            </div>
            <h1 className="mt-[12px] text-30 font-extrabold leading-[1.14] tracking-[-0.02em] md:mt-[16px] md:text-d48 md:leading-[52px]">
              Get in touch
            </h1>
            <p className="mt-[12px] text-14 leading-[1.65] text-muted [text-wrap:pretty] md:mt-[16px] md:text-16 md:leading-[26px]">
              Tell us what your child needs and we&#39;ll match them with a tutor. Or ask us
              anything first — same team either way.
            </p>
            <p className="mt-[16px] text-13_5 font-bold leading-[1.6] text-ink md:mt-[20px] md:text-13 md:leading-[22px] md:text-body">
              Every inquiry is read by a person, not routed to a queue. We reply{" "}
              {SLA_RESPONSE_TIME}.
            </p>
          </div>
        </div>
      </section>

      {/* Form + details */}
      <section className="px-[20px] pb-[32px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[72px] md:pt-[48px]">
        <div className="mx-auto flex max-w-container flex-col-reverse gap-[28px] md:grid md:items-start md:gap-[clamp(36px,5vw,80px)] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <div>
            <InquiryFormLazy variant="full" showIntent />
          </div>

          <div className="md:pt-[6px]">
            {DETAILS.map((d, i) => (
              <div
                key={d.label}
                className={
                  "flex flex-col gap-[3px] border-t border-border py-[14px] md:grid md:gap-x-[20px] md:gap-y-[6px] md:py-[16px] md:[grid-template-columns:minmax(84px,96px)_minmax(0,1fr)] " +
                  (i === DETAILS.length - 1 ? "border-b" : "")
                }
              >
                <span className="text-11 font-extrabold tracking-[0.1em] text-muted-3 md:pt-[2px] md:text-12 md:font-bold md:tracking-[0.08em]">
                  {d.label}
                </span>
                {d.href ? (
                  <a
                    href={d.href}
                    className="flex min-h-[28px] items-center text-15 font-bold text-ink underline decoration-[#D6DADC] underline-offset-[3px] hover:decoration-body md:min-h-0 md:text-14 md:text-body md:decoration-border"
                  >
                    {d.value}
                  </a>
                ) : (
                  <span className="text-14 leading-[1.55] text-ink md:leading-[1.6] md:text-body">
                    {d.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deflection FAQ — left-aligned to the container, per the design */}
      <section className="px-[20px] pb-[32px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[80px] md:pt-[24px]">
        <div className="mr-auto max-w-[720px] md:[margin-left:max(32px,calc((100%-1280px)/2))]">
          <div className="text-11 font-extrabold tracking-[0.14em] text-muted md:text-12 md:font-bold">
            BEFORE YOU WRITE IN
          </div>
          <h2 className="mb-[6px] mt-[12px] text-21 font-extrabold tracking-[-0.01em] md:mb-[8px] md:mt-[14px] md:text-d28">
            Quick answers
          </h2>
          <ContactFaq />
          <Link
            href="/faq/"
            className="mt-[14px] flex min-h-[44px] w-fit items-center border-b-2 border-primary text-13 font-extrabold text-ink md:mt-[24px] md:inline-block md:min-h-0 md:pb-[2px] md:font-bold md:text-body"
          >
            Read the full FAQ →
          </Link>
        </div>
      </section>

      {/* Closing note */}
      <section className="bg-surface-dark px-[20px] pb-[34px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:py-[44px]">
        <div className="mx-auto flex max-w-container items-center justify-between md:gap-[48px]">
          <p className="max-w-[640px] text-15 leading-[1.7] text-muted-4">
            Prefer to just write an email?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline hover:text-white">
              {CONTACT_EMAIL}
            </a>{" "}
            — read by a person, answered {SLA_RESPONSE_TIME}.
          </p>
        </div>
      </section>
    </>
  );
}
