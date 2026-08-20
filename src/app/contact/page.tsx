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
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what your child needs and we'll match them with a tutor. Every inquiry is read by a person — we reply within 24 hours.",
  alternates: { canonical: `${SITE_URL}/contact/` },
};

const DETAILS: { label: string; value: string; href?: string }[] = [
  { label: "EMAIL", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "WHATSAPP", value: CONTACT_WHATSAPP_DISPLAY, href: CONTACT_WHATSAPP_LINK },
  { label: "RESPONSE", value: "Within 24 hours, every day" },
  { label: "HOURS", value: "09:00–18:00 GST · 09:00–18:00 GMT" },
  { label: "OFFICES", value: CONTACT_ADDRESS },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-[20px] pb-[22px] pt-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[8px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-12 font-bold tracking-[0.14em] text-muted">CONTACT</div>
            <h1 className="mt-[16px] text-d48 font-extrabold leading-[52px] tracking-[-0.02em]">
              Get in touch
            </h1>
            <p className="mt-[16px] text-16 leading-[26px] text-muted [text-wrap:pretty]">
              Tell us what your child needs and we&#39;ll match them with a tutor. Or ask us
              anything first — same team either way.
            </p>
            <p className="mt-[20px] text-13 font-bold leading-[22px] text-body">
              Every inquiry is read by a person, not routed to a queue. We reply{" "}
              {SLA_RESPONSE_TIME}.
            </p>
          </div>
        </div>
      </section>

      {/* Form + details */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-[48px]">
        <div className="mx-auto grid max-w-container items-start gap-[clamp(36px,5vw,80px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <div>
            <InquiryFormLazy variant="full" showIntent />
          </div>

          <div className="pt-[6px]">
            {DETAILS.map((d, i) => (
              <div
                key={d.label}
                className={
                  "grid gap-x-[20px] gap-y-[6px] border-t border-border py-[16px] [grid-template-columns:minmax(84px,96px)_minmax(0,1fr)] " +
                  (i === DETAILS.length - 1 ? "border-b" : "")
                }
              >
                <span className="pt-[2px] text-12 font-bold tracking-[0.08em] text-muted-3">
                  {d.label}
                </span>
                {d.href ? (
                  <a
                    href={d.href}
                    className="text-14 font-bold text-body underline decoration-border underline-offset-[3px] hover:decoration-body"
                  >
                    {d.value}
                  </a>
                ) : (
                  <span className="text-14 leading-[1.6] text-body">{d.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deflection FAQ — left-aligned to the container, per the design */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[80px] pt-[24px]">
        <div className="mr-auto max-w-[720px] [margin-left:max(32px,calc((100%-1280px)/2))]">
          <div className="text-12 font-bold tracking-[0.14em] text-muted">BEFORE YOU WRITE IN</div>
          <h2 className="mb-[8px] mt-[14px] text-d28 font-extrabold tracking-[-0.01em]">
            Quick answers
          </h2>
          <ContactFaq />
          <Link
            href="/faq/"
            className="mt-[24px] inline-block border-b-2 border-primary pb-[2px] text-13 font-bold text-body"
          >
            Read the full FAQ →
          </Link>
        </div>
      </section>

      {/* Closing note */}
      <section className="bg-surface-dark px-[clamp(20px,5vw,32px)] py-[44px]">
        <div className="mx-auto flex max-w-container items-center justify-between gap-[48px]">
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
