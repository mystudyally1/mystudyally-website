import Link from "next/link";
import { LoopingVideo } from "@/components/ui/LoopingVideo";

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
    <div className="relative flex min-h-[300px] flex-col items-start justify-end overflow-hidden rounded-[20px] bg-primary px-[22px] py-[32px] shadow-[0_4px_0_#49AD00] md:min-h-[clamp(360px,42vw,560px)] md:justify-center md:rounded-[32px] md:px-[clamp(22px,4vw,44px)] md:py-[clamp(30px,5vw,56px)] md:shadow-[0_2px_4px_rgba(60,60,60,0.06)]">
      <div className="pointer-events-none absolute inset-0">
        <LoopingVideo src="/video/cta.mp4" poster="/video/cta-poster.webp" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,40,8,0.2) 0%, rgba(20,40,8,0.55) 55%, rgba(20,40,8,0.8) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,40,8,0.62) 0%, rgba(20,40,8,0.28) 70%, rgba(20,40,8,0.1) 100%)",
        }}
      />
      <div className="relative w-full">
        <span className="inline-block rounded-pill border border-white/30 bg-white/[0.16] px-[12px] py-[5px] text-9 font-bold tracking-[0.16em] text-white backdrop-blur-[8px] md:px-[16px] md:py-[6px] md:text-10">
          {eyebrow}
        </span>
        <h2 className="mt-[14px] max-w-[420px] text-26 font-extrabold tracking-[-0.01em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] [text-wrap:balance] md:mt-[20px] md:text-d38">
          {headline}
        </h2>
        <p className="mt-[8px] max-w-[420px] text-13 leading-[1.6] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] md:mt-[14px] md:text-15">
          {sub}
        </p>
        <Link
          href={ctaHref}
          className="mt-[20px] block rounded-[14px] bg-white py-[13px] text-center text-13_5 font-extrabold tracking-[0.02em] text-link-hover shadow-[0_4px_0_rgba(0,0,0,0.22)] hover:bg-surface-alt hover:text-link-hover md:mt-[30px] md:inline-block md:rounded-[16px] md:px-[28px] md:py-[14px] md:text-14 md:tracking-[0.03em]"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
