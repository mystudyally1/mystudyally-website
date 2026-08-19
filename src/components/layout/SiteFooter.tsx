import Link from "next/link";
import { CURRICULA } from "@/data/curricula";
import { FooterVideo } from "@/components/layout/FooterVideo";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_LINK,
  SOCIAL_LINKS,
} from "@/lib/constants";

// Mirrors "website design/SiteFooter.dc.html".
const COMPANY_LINKS = [
  { label: "About Us", href: "/about/" },
  { label: "Blog", href: "/blog/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

const SOCIAL_ICONS = [
  {
    label: "WhatsApp",
    href: SOCIAL_LINKS.whatsapp,
    path: (
      <>
        <path d="M12.2 1.4a10.2 10.2 0 0 0-8.7 15.5l-1.5 5.6 5.8-1.5a10.2 10.2 0 1 0 4.4-19.6z" />
        <path
          transform="translate(-0.7 -0.9) scale(0.92) translate(1 1)"
          d="M9 8.1c.3-.1.7 0 .9.3l1 1.7c.2.3.1.7-.1.9l-.8.8c-.2.2-.2.4-.1.6a8 8 0 0 0 2.7 2.7c.2.1.4.1.6-.1l.8-.8c.2-.2.6-.3.9-.1l1.7 1c.3.2.4.5.3.9-.3 1-1.3 1.7-2.4 1.6a8.9 8.9 0 0 1-7.1-7.1c-.1-1.1.6-2.1 1.6-2.4z"
        />
      </>
    ),
  },
  {
    label: "Instagram",
    href: SOCIAL_LINKS.instagram,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Email",
    href: SOCIAL_LINKS.email,
    path: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="3" />
        <path d="M3.5 7.5l7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2" />
      </>
    ),
  },
  {
    label: "Trustpilot",
    href: SOCIAL_LINKS.trustpilot,
    path: <path d="M12 3.2l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 17l-5.3 2.9 1.1-6.1L3.4 9.6l6-.8z" />,
  },
];

const columnLink =
  "text-13 text-muted hover:text-ink";
const columnHeading = "mb-[4px] text-11 font-bold tracking-[0.12em] text-muted-3";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border bg-white px-[clamp(20px,5vw,32px)] pb-[32px] pt-[64px]">
      <div className="mx-auto max-w-container">
        <div className="flex flex-wrap gap-[40px]">
          {/* Brand */}
          <div className="min-w-0 max-w-[280px] flex-[1_1_190px]">
            <Link href="/" className="flex items-center gap-[9px] text-17 font-extrabold text-body">
              <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[9px] bg-primary text-14 font-extrabold text-white">
                M
              </span>
              MyStudyAlly
            </Link>
            <p className="mt-[14px] max-w-[220px] text-13 text-muted">
              Managed tutoring, done properly.
            </p>
            <div className="mt-[18px] flex gap-[10px]">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener" : undefined}
                  aria-label={s.label}
                  className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border-2 border-border bg-surface-alt text-muted hover:border-primary hover:bg-primary hover:text-white"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Curricula */}
          <div className="flex flex-[0_1_150px] flex-col gap-[10px]">
            <div className={columnHeading}>CURRICULA</div>
            {CURRICULA.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/`} className={columnLink}>
                {c.shortName}
              </Link>
            ))}
          </div>

          {/* Company / Legal / Offices + video */}
          <div className="flex min-w-0 flex-[3_1_420px] flex-col gap-[14px]">
            <div className="grid gap-x-[40px] gap-y-[30px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,140px),1fr))]">
              <div className="flex flex-col gap-[10px]">
                <div className={columnHeading}>COMPANY</div>
                {COMPANY_LINKS.map((l) => (
                  <Link key={l.label} href={l.href} className={columnLink}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className={columnHeading}>LEGAL</div>
                {LEGAL_LINKS.map((l) => (
                  <Link key={l.label} href={l.href} className={columnLink}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className={columnHeading}>OFFICES</div>
                <div className="text-13 leading-[1.6] text-muted">{CONTACT_ADDRESS}</div>
                <a href={`mailto:${CONTACT_EMAIL}`} className={columnLink}>
                  {CONTACT_EMAIL}
                </a>
                <a href={CONTACT_WHATSAPP_LINK} className={columnLink}>
                  {CONTACT_WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
            <FooterVideo />
          </div>
        </div>

        <div className="mt-[44px] flex flex-wrap justify-between gap-x-[24px] gap-y-[6px] border-t-2 border-border pt-[20px] text-12 leading-[1.6] text-muted-3">
          <span>© {new Date().getFullYear()} MyStudyAlly. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
