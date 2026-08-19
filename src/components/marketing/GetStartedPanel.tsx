import Link from "next/link";

/**
 * The half-width "Get started" panel used beside the FAQ block on the homepage
 * and curriculum pages: looping video background under a dark green gradient,
 * left-aligned text. Mirrors the `Get Started + FAQ` section in the design.
 */
export function GetStartedPanel({
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
    <div className="relative flex min-h-[clamp(360px,42vw,560px)] flex-col items-start justify-center overflow-hidden rounded-[32px] bg-primary px-[clamp(22px,4vw,44px)] py-[clamp(30px,5vw,56px)] shadow-[0_2px_4px_rgba(60,60,60,0.06)]">
      <video
        src="/video/cta.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,40,8,0.62) 0%, rgba(20,40,8,0.28) 70%, rgba(20,40,8,0.1) 100%)",
        }}
      />
      <div className="relative">
        <span className="inline-block rounded-pill border border-white/30 bg-white/[0.16] px-[16px] py-[6px] text-10 font-bold tracking-[0.16em] text-white backdrop-blur-[8px]">
          {eyebrow}
        </span>
        <h2 className="mt-[20px] max-w-[420px] text-d38 font-extrabold tracking-[-0.01em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] [text-wrap:balance]">
          {headline}
        </h2>
        <p className="mt-[14px] max-w-[420px] text-15 leading-[1.6] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
          {sub}
        </p>
        <Link
          href={ctaHref}
          className="mt-[30px] inline-block rounded-[16px] bg-white px-[28px] py-[14px] text-14 font-extrabold tracking-[0.03em] text-link-hover shadow-[0_4px_0_rgba(0,0,0,0.22)] hover:bg-surface-alt hover:text-link-hover"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
