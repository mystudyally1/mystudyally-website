"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { CURRICULA, EXAM_BOARD_CURRICULA, TEST_PREP_CURRICULA } from "@/data/curricula";
import { Button } from "@/components/ui/Button";

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
    if (CURRICULUM_SLUGS.has(segment)) return "curriculum";
    const navMatch = NAV_LINKS.find((l) => l.key === segment);
    if (navMatch) return navMatch.key;
    if (segment === "subjects") return "subjects";
    return "";
  }, [pathname]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [curriculaOpen, setCurriculaOpen] = useState(true);
  const [tab, setTab] = useState(CURRICULA[0].slug);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && navRef.current.contains(e.target as Node)) return;
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

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  const currentTab = CURRICULA.find((c) => c.slug === tab) ?? CURRICULA[0];

  return (
    <>
      <header className="sticky top-0 z-[80] border-b-2 border-border bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex min-h-14 max-w-container items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 whitespace-nowrap text-[17px] font-extrabold text-ink"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-extrabold text-white shadow-[0_2px_0_#58A700]">
              M
            </span>
            MyStudyAlly
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 lg:flex">
            <div ref={navRef} className="relative flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className={cn(
                  "whitespace-nowrap rounded-pill px-3.5 py-2 text-sm font-bold hover:text-link",
                  active === "curriculum"
                    ? "bg-link-light text-link-hover"
                    : "bg-transparent text-muted",
                )}
              >
                Curricula {menuOpen ? "▴" : "▾"}
              </button>
              {NAV_LINKS.filter((l) => l.key === "tutors" || l.key === "pricing").map(
                () => null,
              )}
              {menuOpen && (
                <div className="absolute left-0 top-12 grid w-[min(860px,calc(100vw-48px))] grid-cols-[minmax(190px,250px)_1fr] overflow-hidden rounded-xl border-2 border-border bg-white/97 shadow-panel backdrop-blur-xl">
                  <div className="flex flex-col gap-0.5 border-r-2 border-border bg-surface-alt p-3">
                    <div className="px-3 pb-2 pt-1 text-eyebrow text-muted-3">
                      EXAM BOARD CURRICULA
                    </div>
                    {EXAM_BOARD_CURRICULA.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onMouseEnter={() => setTab(c.slug)}
                        onClick={() => setTab(c.slug)}
                        className={cn(
                          "rounded-md px-3 py-2.5 text-left text-[13.5px] font-bold",
                          tab === c.slug
                            ? "bg-link-light text-link-hover"
                            : "bg-transparent text-ink",
                        )}
                      >
                        {c.shortName}
                      </button>
                    ))}
                    <div className="px-3 pb-2 pt-3 text-eyebrow text-muted-3">
                      TEST PREP
                    </div>
                    {TEST_PREP_CURRICULA.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onMouseEnter={() => setTab(c.slug)}
                        onClick={() => setTab(c.slug)}
                        className={cn(
                          "rounded-md px-3 py-2.5 text-left text-[13.5px] font-bold",
                          tab === c.slug
                            ? "bg-link-light text-link-hover"
                            : "bg-transparent text-ink",
                        )}
                      >
                        {c.shortName}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col p-6">
                    <div className="mb-3.5 text-eyebrow text-muted-3">
                      {currentTab.shortName.toUpperCase()} SUBJECTS
                    </div>
                    <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] content-start gap-x-4.5 gap-y-1.5">
                      {currentTab.subjects.map((s) => (
                        <Link
                          key={s}
                          href={`/${currentTab.slug}/`}
                          className="rounded-md px-2 py-1.5 text-[13.5px] font-semibold text-ink hover:bg-link-light hover:text-link-hover"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4.5 border-t-2 border-border pt-3.5">
                      <Link
                        href={`/${currentTab.slug}/`}
                        className="text-sm font-extrabold text-link hover:text-link-hover"
                      >
                        View all {currentTab.shortName} tutoring ↗
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={cn(
                  "whitespace-nowrap rounded-pill px-3.5 py-2 text-sm font-bold hover:text-link",
                  active === l.key ? "bg-link-light text-link-hover" : "text-muted",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3.5">
              <a href="#" className="whitespace-nowrap text-sm font-bold text-ink hover:text-ink">
                Sign in
              </a>
              <Button as={Link} href="/contact/" size="sm" className="rounded-md">
                Submit an inquiry
              </Button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 flex-col items-end justify-center gap-1.5 lg:hidden"
          >
            <span className="block h-[2.5px] w-[22px] rounded bg-ink" />
            <span className="block h-[2.5px] w-[22px] rounded bg-ink" />
            <span className="block h-[2.5px] w-[15px] rounded bg-ink" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-white lg:hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[16px] font-extrabold text-ink"
              onClick={() => setMobileOpen(false)}
            >
              <span className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-md bg-primary text-[13px] font-extrabold text-white">
                M
              </span>
              MyStudyAlly
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-xl text-ink"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-5">
            <button
              type="button"
              onClick={() => setCurriculaOpen((v) => !v)}
              className="flex min-h-14 w-full items-center justify-between border-b border-border text-md font-bold text-ink"
            >
              Curricula
              <span className="text-sm text-muted">{curriculaOpen ? "▴" : "▾"}</span>
            </button>
            {curriculaOpen && (
              <div className="flex flex-col border-b border-border bg-surface-alt">
                {CURRICULA.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-12 items-center border-b border-border-2 px-3.5 text-[15px] font-semibold text-ink"
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
                className="flex min-h-14 items-center border-b border-border text-md font-bold text-ink"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-4.5 pt-5">
              <Link
                href="/blog/"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center text-xs font-bold uppercase tracking-wide text-muted"
              >
                Blog
              </Link>
              <Link
                href="/faq/"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center text-xs font-bold uppercase tracking-wide text-muted"
              >
                FAQ
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 border-t border-border px-4 py-4.5">
            <a href="#" className="self-start text-sm font-bold text-ink">
              Sign in
            </a>
            <Button
              as={Link}
              href="/contact/"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-13 items-center justify-center rounded-md text-[15px]"
            >
              Submit an inquiry
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
