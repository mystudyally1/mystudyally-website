import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/marketing/CtaBand";
import { formatDate, getAllPosts, getAllTags } from "@/lib/blog";
import { SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guidance on curricula, exam boards, test preparation, and choosing a tutor — written for parents and students.",
  alternates: { canonical: `${SITE_URL}/blog/` },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <Section className="pb-6 pt-14">
        <Container className="max-w-3xl">
          <div className="text-12 font-bold tracking-[0.14em] text-muted">BLOG</div>
          <h1 className="mt-4 text-d48 font-extrabold tracking-[-0.02em] text-ink">Guidance worth reading</h1>
          <p className="mt-4 text-16 leading-relaxed text-muted">
            Curricula, exam boards, and test preparation — explained properly, for parents and
            students making real decisions.
          </p>
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog/tag/${encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"))}/`}
                  className="rounded-pill border-2 border-border bg-white px-3.5 py-1.5 text-12 font-bold text-muted hover:border-link-light-3 hover:bg-link-light hover:text-link-hover"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section className="pt-4">
        <Container>
          {posts.length === 0 ? (
            <p className="text-15 text-muted">No posts yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <article
                  key={p.slug}
                  className="flex flex-col rounded-2xl border-2 border-border bg-white p-6 shadow-[0_2px_0_#E5E5E5] transition hover:-translate-y-1 hover:shadow-[0_4px_0_#E5E5E5]"
                >
                  <time dateTime={p.date} className="text-12 font-bold tracking-wide text-muted-3">
                    {formatDate(p.date).toUpperCase()}
                  </time>
                  <h2 className="mt-3 text-19 font-extrabold leading-tight text-ink">
                    <Link href={`/blog/${p.slug}/`} className="text-ink hover:text-link">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-13 leading-relaxed text-muted">{p.description}</p>
                  <Link
                    href={`/blog/${p.slug}/`}
                    className="mt-5 self-start border-b-2 border-primary pb-0.5 text-13 font-bold text-ink"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <CtaBand
            headline="Ready to get started?"
            sub={`Submit an inquiry and we'll match you with a tutor ${SLA_RESPONSE_TIME}.`}
          />
        </Container>
      </Section>
    </>
  );
}
