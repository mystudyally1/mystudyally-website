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

// Desktop layout mirrors "SiteFooter.dc.html"; below md it follows
// "SiteFooter Mobile.dc.html" — stacked sections, two-column link grids and
// 34px minimum row height so the links are actually tappable on a phone.
// /subjects/ and /tutors/ were reachable only from the header. Both are
// indexed pages that every other page should link to — a section the footer
// omits gets fewer internal links than its siblings, and internal links are
// how a crawler works out which pages a site considers important.
const COMPANY_LINKS = [
  { label: "About Us", href: "/about/" },
  { label: "Subjects", href: "/subjects/" },
  { label: "Our Tutors", href: "/tutors/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Blog", href: "/blog/" },
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
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4.5" />
        <circle cx="7.9" cy="8" r="0.7" fill="currentColor" stroke="none" />
        <path d="M7.9 10.9v6.2" />
        <path d="M11.6 17.1v-6.2m0 2.7a2.4 2.4 0 0 1 4.8 0v3.5" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: SOCIAL_LINKS.facebook,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4.5" />
        <path d="M14.8 7.8h-1.3a2.2 2.2 0 0 0-2.2 2.2v10.2M9.7 12.6h4.8" />
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

/** 34px rows on mobile (per the mobile design), compact on desktop. */
const columnLink =
  "flex min-h-[34px] items-center text-13_5 text-muted hover:text-ink md:block md:min-h-0 md:text-13";
const columnHeading =
  "text-11 font-extrabold tracking-[0.12em] text-muted-3 md:mb-[4px] md:font-bold";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border bg-white px-[20px] pb-[20px] pt-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[32px] md:pt-[64px]">
      <div className="mx-auto max-w-container">
        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-[40px]">
          {/* Brand */}
          <div className="min-w-0 md:max-w-[280px] md:flex-[1_1_190px]">
            <Link
              href="/"
              className="flex min-h-[44px] items-center gap-[9px] text-17 font-extrabold text-body md:min-h-0"
            >
              <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[9px] bg-primary text-14 font-extrabold text-white">
                M
              </span>
              MyStudyAlly
            </Link>
            <p className="mt-[8px] max-w-[220px] text-13 text-muted md:mt-[14px]">
              Managed tutoring, done properly.
            </p>
            <div className="mt-[18px] flex gap-[12px] md:gap-[10px]">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener" : undefined}
                  aria-label={s.label}
                  className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] border-2 border-border bg-surface-alt text-muted hover:border-primary hover:bg-primary hover:text-white md:h-[38px] md:w-[38px]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="md:h-[19px] md:w-[19px]"
                  >
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Curricula — two columns on mobile, one on desktop */}
          <div className="mt-[20px] border-t border-border pt-[14px] md:mt-0 md:flex md:flex-[0_1_150px] md:flex-col md:gap-[10px] md:border-t-0 md:pt-0">
            <div className={columnHeading}>CURRICULA</div>
            <div className="mt-[4px] grid grid-cols-2 gap-x-[16px] gap-y-[2px] md:mt-0 md:grid-cols-1 md:gap-y-[10px]">
              {CURRICULA.map((c) => (
                <Link key={c.slug} href={`/${c.slug}/`} className={columnLink}>
                  {c.shortName}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:flex md:min-w-0 md:flex-[3_1_420px] md:flex-col md:gap-[14px]">
            <div className="md:grid md:gap-x-[40px] md:gap-y-[30px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,140px),1fr))]">
              {/* Company */}
              <div className="mt-[14px] border-t border-border pt-[14px] md:mt-0 md:flex md:flex-col md:gap-[10px] md:border-t-0 md:pt-0">
                <div className={columnHeading}>COMPANY</div>
                <div className="mt-[4px] grid grid-cols-2 gap-x-[16px] gap-y-[2px] md:mt-0 md:grid-cols-1 md:gap-y-[10px]">
                  {COMPANY_LINKS.map((l) => (
                    <Link key={l.label} href={l.href} className={columnLink}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div className="mt-[14px] border-t border-border pt-[14px] md:mt-0 md:flex md:flex-col md:gap-[10px] md:border-t-0 md:pt-0">
                <div className={columnHeading}>LEGAL</div>
                <div className="mt-[2px] flex items-center gap-[10px] md:mt-0 md:flex-col md:items-start md:gap-[10px]">
                  {LEGAL_LINKS.map((l) => (
                    <Link key={l.label} href={l.href} className={columnLink}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Offices */}
              <div className="mt-[14px] border-t border-border pt-[14px] md:mt-0 md:flex md:flex-col md:gap-[10px] md:border-t-0 md:pt-0">
                <div className={columnHeading}>OFFICES</div>
                <div className="mt-[4px] flex flex-col md:mt-0 md:gap-[10px]">
                  <div className="py-[4px] text-13 leading-[1.6] text-muted md:py-0">
                    {CONTACT_ADDRESS}
                  </div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex min-h-[40px] items-center text-13_5 text-muted hover:text-ink md:block md:min-h-0 md:text-13"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href={CONTACT_WHATSAPP_LINK}
                    className="flex min-h-[40px] items-center text-13_5 text-muted hover:text-ink md:block md:min-h-0 md:text-13"
                  >
                    {CONTACT_WHATSAPP_DISPLAY}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-[18px] md:mt-0">
              <FooterVideo />
            </div>
          </div>
        </div>

        <div className="mt-[18px] flex flex-wrap justify-between gap-x-[24px] gap-y-[6px] border-t-2 border-border pt-[14px] text-12 leading-[1.6] text-muted-3 md:mt-[44px] md:pt-[20px]">
          <span>© {new Date().getFullYear()} MyStudyAlly. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
