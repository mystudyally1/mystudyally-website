import Link from "next/link";

export function CtaBand({
  eyebrow = "GET STARTED",
  headline,
  sub,
  ctaLabel = "Submit an inquiry",
  ctaHref = "/contact/",
}: {
  eyebrow?: string;
  headline: string;
  sub: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center shadow-[0_2px_4px_rgba(60,60,60,0.06),0_4px_0_#49AD00] sm:px-10 sm:py-24">
      <div className="pointer-events-none absolute -left-28 -top-36 h-[420px] w-[420px] rounded-pill bg-white/20 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-pill bg-primary-shadow/45 blur-[90px]" />
      <div className="relative">
        <span className="inline-block rounded-pill border border-white/30 bg-white/15 px-4 py-1.5 text-eyebrow text-white backdrop-blur-sm">
          {eyebrow}
        </span>
        <h2 className="mx-auto mt-5 max-w-xl text-d-2xl text-white">{headline}</h2>
        <p className="mx-auto mt-3.5 max-w-lg text-md text-white/90">{sub}</p>
        <Link
          href={ctaHref}
          className="mt-7 inline-block rounded-lg bg-white px-7 py-3.5 text-sm font-extrabold text-link-hover shadow-press-white hover:bg-surface-alt"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
