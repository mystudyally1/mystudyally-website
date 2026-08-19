import Link from "next/link";

/**
 * The standalone full-width CTA panel — flat green with two soft radial blobs,
 * centred text. Mirrors "website design/CtaBand.dc.html".
 * (The homepage / curriculum "Get started" block is a different component with
 * a video background — see GetStartedPanel.)
 */
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
    <section className="px-[clamp(20px,5vw,32px)] py-[64px]">
      <div className="relative mx-auto max-w-container overflow-hidden rounded-[32px] bg-primary px-[48px] py-[96px] text-center shadow-[0_2px_4px_rgba(60,60,60,0.06),0_4px_0_#49AD00]">
        <div className="pointer-events-none absolute -left-[120px] -top-[140px] h-[420px] w-[420px] rounded-pill bg-white/[0.18] blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-[160px] -right-[100px] h-[420px] w-[420px] rounded-pill bg-[rgba(63,156,2,0.45)] blur-[90px]" />
        <div className="relative">
          <span className="inline-block rounded-pill border border-white/30 bg-white/[0.16] px-[16px] py-[6px] text-10 font-bold tracking-[0.16em] text-white backdrop-blur-[8px]">
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-[20px] max-w-[680px] text-d42 font-extrabold tracking-[-0.01em] text-white [text-wrap:balance]">
            {headline}
          </h2>
          <p className="mx-auto mt-[14px] max-w-[520px] text-15 leading-[1.6] text-white/[0.88]">
            {sub}
          </p>
          <Link
            href={ctaHref}
            className="mt-[30px] inline-block rounded-[16px] bg-white px-[28px] py-[14px] text-14 font-extrabold text-link-hover shadow-[0_4px_0_rgba(0,0,0,0.22)] hover:bg-surface-alt hover:text-link-hover"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
