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
  return (
    <section className="bg-surface-dark px-[clamp(20px,5vw,32px)] pb-[60px] pt-[56px]">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-[48px]">
        <div className="max-w-[640px]">
          <h2 className="text-d30 font-extrabold leading-[34px] text-white [text-wrap:balance]">
            {headline}
          </h2>
          <p className="mt-[12px] text-15 leading-[1.7] text-muted-4">{sub}</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-[12px]">
          <Link
            href={ctaHref}
            className="inline-block rounded-[16px] bg-primary px-[26px] py-[14px] text-14 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white"
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
