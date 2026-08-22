import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";

/**
 * The dark closing CTA strip used on About, FAQ and the blog index.
 * Mirrors the `Closing CTA` section in those design files.
 */
export function DarkCtaSection({
  headline,
  sub,
  ctaLabel = "Submit an inquiry",
  ctaHref = "/contact/",
}: {
  headline: string;
  sub: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  // Mobile stacks the whole thing with a full-width button; desktop splits
  // headline and CTA across the row. Values from "Mobile Closing CTA".
  return (
    <section className="bg-surface-dark px-[20px] pb-[34px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:pb-[60px] md:pt-[56px]">
      <div className="mx-auto flex max-w-container flex-col md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-[48px]">
        <div className="max-w-[640px]">
          <h2 className="text-22 font-extrabold leading-[1.25] text-white [text-wrap:balance] md:text-d30 md:leading-[34px]">
            {headline}
          </h2>
          <p className="mt-[10px] text-14 leading-[1.65] text-muted-4 md:mt-[12px] md:text-15 md:leading-[1.7]">
            {sub}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-[14px] md:items-start md:gap-[12px]">
          <Link
            href={ctaHref}
            className="mt-[20px] flex min-h-[52px] items-center justify-center rounded-[16px] bg-primary px-[22px] text-14_5 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white md:mt-0 md:inline-block md:min-h-0 md:px-[26px] md:py-[14px] md:text-14"
          >
            {ctaLabel}
          </Link>
          <span className="text-12 text-muted-2">
            Or email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-4 underline hover:text-white">
              {CONTACT_EMAIL}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
