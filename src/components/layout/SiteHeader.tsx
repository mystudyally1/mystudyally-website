"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { CURRICULA, EXAM_BOARD_CURRICULA, TEST_PREP_CURRICULA } from "@/data/curricula";

// Structure and every value below mirror "website design/SiteHeader.dc.html".
const NAV_LINKS = [
  { key: "tutors", label: "Tutors", href: "/tutors/" },
  { key: "pricing", label: "Pricing", href: "/pricing/" },
  { key: "about", label: "About", href: "/about/" },
  { key: "contact", label: "Contact", href: "/contact/" },
];

const CURRICULUM_SLUGS = new Set(CURRICULA.map((c) => c.slug));

/**
 * The design's header carries a "Sign in", but the student portal does not
 * exist yet. Shipping it as a real link meant an anchor that visibly did
 * nothing; shipping nothing lost the signal that an account is coming. So it
 * renders as a disabled control with a status tag.
 *
 * `disabled` (not `aria-disabled`) is deliberate: there is nothing to activate,
 * so it should leave the tab order rather than trap a keyboard user on a dead
 * stop. The accessible name folds the tag in, because the badge itself is
 * decorative once the name says it.
 */
function SignInSoon({
  labelClass,
  badgeLabel,
  className,
}: {
  labelClass: string;
  badgeLabel: string;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-[7px]", className)}>
      <button
        type="button"
        disabled
        aria-label="Sign in — coming soon"
        className={cn("cursor-not-allowed whitespace-nowrap bg-transparent p-0", labelClass)}
      >
        Sign in
      </button>
      <span
        aria-hidden="true"
        className="whitespace-nowrap rounded-pill border border-border bg-surface-alt px-[7px] py-[2px] text-10 font-extrabold uppercase tracking-[0.06em] text-muted-3"
      >
        {badgeLabel}
      </span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const active = useMemo(() => {
    const segment = pathname.split("/").filter(Boolean)[0] ?? "";
    if (segment === "") return "home";
    if (CURRICULUM_SLUGS.has(segment)) return "subjects";
    const navMatch = NAV_LINKS.find((l) => l.key === segment);
    if (navMatch) return navMatch.key;
    if (segment === "subjects") return "subjects";
    return "";
  }, [pathname]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [curriculaOpen, setCurriculaOpen] = useState(true);
  const [tab, setTab] = useState(CURRICULA[0].slug);
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (navRef.current?.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  /**
   * The drawer covers the viewport, so it has to behave like a modal: lock the
   * page behind it, close on Escape, and keep Tab inside it. Without the trap
   * the focus ring walks off into the hidden page and the visitor is typing
   * into links they cannot see.
   */
  useEffect(() => {
    if (!mobileOpen) return;

    const opener = hamburgerRef.current;
    document.body.style.overflow = "hidden";
    // The chat launcher is fixed at z-900, well above this drawer, so without
    // a signal it floats over the menu and covers the "Submit an inquiry" CTA.
    document.body.dataset.drawerOpen = "true";
    drawerCloseRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      delete document.body.dataset.drawerOpen;
      // Return focus where it came from, so closing the menu does not dump the
      // visitor back at the top of the document.
      opener?.focus();
    };
  }, [mobileOpen]);

  const current = CURRICULA.find((c) => c.slug === tab) ?? CURRICULA[0];

  const railButton = (slug: string, label: string) => (
    <button
      key={slug}
      type="button"
      onMouseEnter={() => setTab(slug)}
      onClick={() => setTab(slug)}
      className={cn(
        "cursor-pointer rounded-[12px] px-[12px] py-[9px] text-left text-13_5 font-bold",
        tab === slug ? "bg-link-light text-link-hover" : "bg-transparent text-body",
      )}
    >
      {label}
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-[80] border-b-2 border-border bg-white/90 backdrop-blur-[18px]">
        <div className="mx-auto flex min-h-[56px] max-w-container items-center justify-between gap-[16px] px-[clamp(16px,4vw,32px)] py-[10px]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-[9px] whitespace-nowrap text-17 font-extrabold text-body"
          >
            <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[9px] bg-primary text-14 font-extrabold text-white shadow-[0_2px_0_#58A700]">
              M
            </span>
            MyStudyAlly
          </Link>

          {/* Desktop: one nav holding Curricula + the section links, gap 2px */}
          <nav
            ref={navRef}
            className="relative hidden items-center gap-[2px] lg:flex"
            aria-label="Primary"
          >
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-controls="curricula-menu"
              className={cn(
                "cursor-pointer whitespace-nowrap rounded-pill px-[14px] py-[8px] text-13 font-bold hover:text-link",
                active === "subjects" ? "bg-link-light text-link-hover" : "bg-transparent text-muted",
              )}
            >
              Curricula {menuOpen ? "▴" : "▾"}
            </button>

            {NAV_LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={cn(
                  "whitespace-nowrap rounded-pill px-[14px] py-[8px] text-13 font-bold hover:text-link",
                  active === l.key ? "bg-link-light text-link-hover" : "bg-transparent text-muted",
                )}
              >
                {l.label}
              </Link>
            ))}

            {menuOpen && (
              <div
                id="curricula-menu"
                className="absolute left-0 top-[48px] grid w-[min(860px,calc(100vw-48px))] grid-cols-[minmax(190px,250px)_1fr] overflow-hidden rounded-[20px] border-2 border-border bg-white/97 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-[20px]"
              >
                <div className="flex flex-col gap-[2px] border-r-2 border-border bg-surface-alt px-[12px] py-[16px]">
                  <div className="px-[12px] pb-[8px] pt-[4px] text-11 font-bold tracking-[0.1em] text-muted-3">
                    EXAM BOARD CURRICULA
                  </div>
                  {EXAM_BOARD_CURRICULA.map((c) => railButton(c.slug, c.shortName))}
                  <div className="px-[12px] pb-[8px] pt-[12px] text-11 font-bold tracking-[0.1em] text-muted-3">
                    TEST PREP
                  </div>
                  {TEST_PREP_CURRICULA.map((c) => railButton(c.slug, c.shortName))}
                </div>

                <div className="flex flex-col px-[26px] py-[22px]">
                  <div className="mb-[14px] text-11 font-bold tracking-[0.1em] text-muted-3">
                    {current.shortName.toUpperCase()} SUBJECTS
                  </div>
                  <div className="grid flex-1 content-start gap-x-[18px] gap-y-[6px] [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
                    {current.subjects.map((s) => (
                      <Link
                        key={s}
                        href={`/${current.slug}/`}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-[10px] px-[8px] py-[6px] text-13_5 font-semibold text-body hover:bg-link-light hover:text-link-hover"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-[18px] border-t-2 border-border pt-[14px]">
                    <Link
                      href={`/${current.slug}/`}
                      onClick={() => setMenuOpen(false)}
                      className="text-13 font-extrabold text-link hover:text-link-hover"
                    >
                      View all {current.shortName} tutoring ↗
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>

          <div className="hidden shrink-0 items-center gap-[14px] lg:flex">
            {/* Short badge here — the header row is tightest at the lg
                breakpoint, where the nav, this and the CTA all have to fit. */}
            <SignInSoon labelClass="text-13 font-bold text-muted-3" badgeLabel="Soon" />
            <Link
              href="/contact/"
              className="whitespace-nowrap rounded-[14px] bg-primary px-[18px] py-[10px] text-13 font-extrabold tracking-[0.03em] text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white hover:shadow-[0_4px_0_#49AD00]"
            >
              Submit an inquiry
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex h-[44px] w-[44px] cursor-pointer flex-col items-end justify-center gap-[5px] p-0 lg:hidden"
          >
            <span className="block h-[2.5px] w-[22px] rounded-[2px] bg-body" />
            <span className="block h-[2.5px] w-[22px] rounded-[2px] bg-body" />
            <span className="block h-[2.5px] w-[15px] rounded-[2px] bg-body" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[120] flex flex-col bg-white lg:hidden"
        >
          <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-border px-[clamp(16px,4vw,20px)]">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-[9px] text-16 font-extrabold text-body"
            >
              <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-primary text-13 font-extrabold text-white">
                M
              </span>
              MyStudyAlly
            </Link>
            <button
              ref={drawerCloseRef}
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="h-[44px] w-[44px] cursor-pointer text-22 text-body"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-[clamp(16px,4vw,20px)] pb-[20px]">
            <button
              type="button"
              onClick={() => setCurriculaOpen((v) => !v)}
              aria-expanded={curriculaOpen}
              className="flex min-h-[56px] w-full cursor-pointer items-center justify-between border-b border-border p-0 text-16 font-bold text-body"
            >
              Curricula
              <span className="text-13 text-muted">{curriculaOpen ? "▴" : "▾"}</span>
            </button>
            {curriculaOpen && (
              <div className="flex flex-col border-b border-border bg-surface-alt">
                {CURRICULA.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[48px] items-center border-b border-border-2 px-[14px] text-15 font-semibold text-body"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
            {NAV_LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[56px] items-center border-b border-border text-16 font-bold text-body"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-[18px] pt-[20px]">
              <Link
                href="/blog/"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center text-12 font-bold uppercase tracking-[0.02em] text-muted"
              >
                Blog
              </Link>
              <Link
                href="/faq/"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center text-12 font-bold uppercase tracking-[0.02em] text-muted"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-[12px] border-t border-border px-[clamp(16px,4vw,20px)] pb-[18px] pt-[14px]">
            <SignInSoon
              labelClass="text-14 font-bold text-muted-3"
              badgeLabel="Coming soon"
              className="self-start"
            />
            <Link
              href="/contact/"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[52px] items-center justify-center rounded-[14px] bg-primary text-15 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white"
            >
              Submit an inquiry
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
