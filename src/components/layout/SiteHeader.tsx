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

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
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
              <div className="absolute left-0 top-[48px] grid w-[min(860px,calc(100vw-48px))] grid-cols-[minmax(190px,250px)_1fr] overflow-hidden rounded-[20px] border-2 border-border bg-white/97 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-[20px]">
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
            <a href="#" className="whitespace-nowrap text-13 font-bold text-body hover:text-ink">
              Sign in
            </a>
            <Link
              href="/contact/"
              className="whitespace-nowrap rounded-[14px] bg-primary px-[18px] py-[10px] text-13 font-extrabold tracking-[0.03em] text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white hover:shadow-[0_4px_0_#49AD00]"
            >
              Submit an inquiry
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
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
        <div className="fixed inset-0 z-[120] flex flex-col bg-white lg:hidden">
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
            <a href="#" className="self-start text-14 font-bold text-body">
              Sign in
            </a>
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
