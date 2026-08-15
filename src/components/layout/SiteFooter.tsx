import Link from "next/link";
import { CURRICULA } from "@/data/curricula";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_LINK,
  SOCIAL_LINKS,
} from "@/lib/constants";

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

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border bg-white px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-container">
        <div className="flex flex-wrap gap-10">
          <div className="min-w-0 max-w-[280px] flex-[1_1_190px]">
            <Link href="/" className="flex items-center gap-2 text-[17px] font-extrabold text-ink">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-extrabold text-white">
                M
              </span>
              MyStudyAlly
            </Link>
            <p className="mt-3.5 max-w-[220px] text-sm text-muted">
              Managed tutoring, done properly.
            </p>
            <div className="mt-4.5 flex gap-2.5">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener" : undefined}
                  aria-label={s.label}
                  className="flex h-9.5 w-9.5 items-center justify-center rounded-md border-2 border-border bg-surface-alt text-muted hover:border-primary hover:bg-primary hover:text-white"
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

          <div className="flex flex-[0_1_150px] flex-col gap-2.5">
            <div className="mb-1 text-eyebrow text-muted-3">CURRICULA</div>
            {CURRICULA.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="text-sm text-muted hover:text-ink"
              >
                {c.shortName}
              </Link>
            ))}
          </div>

          <div className="grid min-w-0 flex-[3_1_420px] grid-cols-[repeat(auto-fit,minmax(min(100%,140px),1fr))] gap-x-10 gap-y-7">
            <div className="flex flex-col gap-2.5">
              <div className="mb-1 text-eyebrow text-muted-3">COMPANY</div>
              {COMPANY_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="text-sm text-muted hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="mb-1 text-eyebrow text-muted-3">LEGAL</div>
              {LEGAL_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="text-sm text-muted hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="mb-1 text-eyebrow text-muted-3">OFFICES</div>
              <div className="text-sm leading-relaxed text-muted">{CONTACT_ADDRESS}</div>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-muted hover:text-ink">
                {CONTACT_EMAIL}
              </a>
              <a href={CONTACT_WHATSAPP_LINK} className="text-sm text-muted hover:text-ink">
                {CONTACT_WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap justify-between gap-1.5 border-t-2 border-border pt-5 text-xs leading-relaxed text-muted-3">
          <span>© {new Date().getFullYear()} MyStudyAlly. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
