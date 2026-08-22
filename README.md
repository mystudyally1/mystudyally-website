# MyStudyAlly — marketing website

Static-exported Next.js App Router site. No login, no database on the site, no
payments. Inquiry forms post to a Cloudflare Worker which writes to D1 and sends
email via SendGrid.

## Stack

- Next.js 16 (App Router, `output: 'export'`, Turbopack)
- TypeScript, Tailwind 3.4
- MDX blog via `next-mdx-remote` + `gray-matter`
- Deployed to Vercel from `main`; DNS on Cloudflare (DNS-only, not proxied).
  Hostinger hosts the mailboxes only — nothing serves the website from there.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

`npm run build` produces the static site in `out/`.

## Verification

```bash
npm run verify
```

Runs lint, typecheck, build, then two content gates:

- `npm run audit:content` — fails on leaked design placeholders
  (`[POLICY PENDING]`, `[Confirm …]`, invented testimonial quotes), stale
  pricing figures, response-time conflicts, missing/duplicate page titles and
  descriptions, and malformed JSON-LD.
- `npm run audit:links` — fails on broken internal links in the built output.
- `npm run audit:css` — fails on Tailwind utility classes used in source that
  produced no CSS rule. These are silent: a wrong scale step like `h-55`
  emits nothing and the element collapses to zero height with no error.
  If a class shows up here, add the value to `tailwind.config.js` rather
  than rounding to a nearby step.
- `npm run audit:seo` — fails on missing or mismatched canonicals, an `og:url`
  that disagrees with the canonical, missing Open Graph or Twitter tags, a
  missing/duplicate `<h1>`, an `<img>` with no `alt`, JSON-LD that does not
  parse or references an `@id` nothing defines, a sitemap that omits an
  indexable page or lists a `noindex` one, and a sitemap where every entry
  shares one `lastmod`. Title and description lengths are reported as
  warnings, not failures — the limits are soft and an editorial headline is
  sometimes worth the truncation. **Title length is measured in pixels, not
  characters**: Google truncates a desktop result at roughly 600px of Arial
  20px, and a character count misjudges that badly in both directions. Counting
  characters flagged a 61-character headline that renders at 597px and fits,
  while a 60-character title in capitals would have passed and overflowed.

All of these run in CI before deploying.

### Browser audits

Two further audits drive a real browser, so they need a one-off install and are
kept out of `verify` (and out of CI):

```bash
npm install --no-save playwright-core
npm run audit:runtime     # every route x 3 widths, with the vercel.json CSP applied
npm run audit:behaviour   # keyboard, focus, reduced motion, blocked-challenge fallback
```

`playwright-core` ships no browser. Either let it find one, or point it at a
system Chrome — no extra download:

```bash
CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" npm run audit:runtime
```

`audit:runtime` serves `out/` with the same Content-Security-Policy
`vercel.json` sets, so a policy that would break the live site fails here first.
`audit:behaviour` asserts the interactive contracts: the skip link is the first
tab stop, the mobile drawer traps focus and restores it on close, the chat hands
focus back to its launcher, a blocked Turnstile offers WhatsApp instead of a
dead submit button, and `prefers-reduced-motion` downloads no video.

### Design-fidelity audits

```bash
npm run audit:mobile      # every route at 390px vs "<Page> Mobile.dc.html"
npm run audit:desktop     # every route at 1280px vs "<Page>.dc.html"
npm run audit:mobile igcse            # one route
npm run audit:sections "IGCSE Mobile" /igcse/     # section-by-section heights
node scripts/audit-mobile-strip.mjs "IGCSE Mobile" /igcse/ 0 900   # side-by-side image
```

These render the design file and the built page at the same width and report the
page-height delta, horizontal overflow and the heading sequence. A delta inside
a few percent is the expected steady state — the live Turnstile widget and real
font metrics account for most of it. A section that has drifted shows up as a
double-digit percentage, and `audit:sections` then says which one.

## SEO

Everything search-related is derived rather than hand-written per page, so a
copy or price change updates the markup with it.

- **`src/lib/seo.ts`** holds the site-wide entity graph — one
  `EducationalOrganization` and one `WebSite`, both with stable `@id`s — plus
  the builders for `BreadcrumbList` and the per-page `WebPage` node. The root
  layout emits the two site-wide nodes on every page; each page adds its own
  and points back by `@id`, so the whole domain resolves to one entity instead
  of a new one per URL.
- **`src/lib/metadata.ts`** builds a page's `openGraph` and `twitter`
  blocks from one `pageSocial()` call. Next replaces each top-level metadata
  field wholesale rather than merging into it, so a page that declares one and
  not the other silently inherits the root value for the other. That is how every
  page came to ship the homepage's Twitter card while its og: tags were
  correct. `audit:seo` now fails when twitter:title/description/image
  disagree with their og: counterparts.
- **`src/components/seo/JsonLd.tsx`** serialises a page's whole graph into a
  single `<script type="application/ld+json">`, escaping `<` so a `</script>`
  inside any string cannot close the tag early.
- **Per-page schema.** `/pricing/` carries every plan as a real `Offer` built
  from `PLANS` (with an `AggregateOffer` over them); `/[curriculum]/` carries
  `Course` + `CourseInstance` + the subject `ItemList` + `FAQPage`; `/tutors/`
  an `ItemList` of `Person`; `/blog/[slug]/` a `BlogPosting` with a counted
  `wordCount` and a `dateModified` from optional `updated:` frontmatter.
- **Titles and descriptions.** Curriculum pages get a short title built from
  the curriculum name and board tagline — the `<h1>` is a marketing headline
  and is too long for a result. Blog posts whose own title fills the line drop
  the ` — MyStudyAlly` suffix rather than let it truncate their words.
- **`src/app/sitemap.ts`** takes each entry's `lastmod` from the mtime of the
  source that renders it (posts use their frontmatter date). Every entry
  previously reported the build time, which teaches search engines to ignore
  the field for the whole site.
- **Canonical host.** `SITE_URL` is the apex (`https://mystudyally.com`) and
  every canonical, `og:url`, sitemap entry and schema `@id` is built from it.
  Vercel must therefore have the apex set as the **primary** domain, with
  `www` redirecting to it — Project → Settings → Domains. If that is set the
  other way round, every canonical on the site points at a URL that
  permanently redirects, and returning visitors whose browsers cached the old
  Hostinger `www`→apex 301 can bounce between the two hosts until a reload.
  http→https and the `www` redirect are both Vercel's; there is no rewrite
  config in the repo for them.
- **Search Console.** Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (and/or
  `NEXT_PUBLIC_BING_SITE_VERIFICATION`) to emit the ownership meta tag. Blank
  emits nothing.

### Authorship and E-E-A-T

The six blog bylines the design shipped with ("Daniel Whitfield",
"Sarah Mahmood", …) were generated from a `const authors = [...]` array in
`website design/Blog.dc.html`. No bio, credential, or profile existed for any
of them. Under Google's quality guidelines an article whose author is a bare
name is an anonymous article — and a byline naming a person nobody can verify is
worse than none, because inventing expertise signals is what the spam policies
call out directly.

So posts are attributed to the organisation. `author` in the `BlogPosting`
schema points at the `EducationalOrganization` node, which has a registered
address, a phone number, an email and a legal identity — a genuinely checkable
publisher. The byline reads "MyStudyAlly Academic Team", matching the wording
`/about/` already uses.

**To publish under a real person**, add them to `AUTHORS` in
[`src/data/authors.ts`](src/data/authors.ts) and set the post's `author:`
frontmatter to the same name. The named byline with credentials, the author bio
card under the article, and a full `Person` schema with `sameAs` all follow
automatically. Only add an entry when every field can be backed by something a
reader could go and check — that file is deliberately empty rather than seeded
with plausible-looking placeholders.

### AI search (GEO)

- **`src/app/robots.ts`** names the citation-capable AI crawlers (GPTBot,
  OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended) in their own groups.
  **robots.txt groups are not inherited** — a crawler obeys the single most
  specific group matching its token and ignores every other — so each group
  repeats the shared `Disallow` list. Getting this wrong hands a named crawler
  the pages `*` was meant to keep out. `audit:seo` fails on the mismatch.
- **`/llms.txt`** is generated by `scripts/gen-llms-txt.mjs` from the sitemap
  and the built pages, so it cannot list a page that no longer exists (the audit
  fails if it does). It is written to `public/llms.txt` and **committed** —
  `npm run build` refreshes it, and the change shows up in `git status`. Scope it honestly: Google states it ignores llms.txt for
  Search including its AI features, and that having one neither helps nor harms
  ranking. It is here for the non-Google assistants that read it, nothing more.
- **IndexNow.** `npm run indexnow` pushes recently-changed URLs to Bing,
  Yandex, Seznam and Naver — Google does not participate. Ownership is proved by
  the `<key>.txt` file in `public/`, whose contents must equal its filename;
  the audit checks that. Defaults to URLs whose sitemap `lastmod` falls inside
  the last 7 days (`--days N`, `--all`, `--dry-run`). Deliberately not part
  of `build` — a build is not a deploy, and announcing a URL that has not
  shipped is worse than announcing it late.
- **Freshness.** Posts render an "Updated" date when `updated:` frontmatter
  differs from `date:`, matching `dateModified` in the article schema. A
  freshness claim that appears only in markup and not on the page is the kind
  that gets discounted.
- **Not done: hreflang.** The site is one language on one URL set. It serves the
  UAE, UK, US, Canada and Pakistan, but with the same English pages, so there
  are no alternates to declare and `hreflang` would be noise. It becomes
  relevant only if localised URLs ever ship.

`npm run audit:seo` gates all of it against the built output, and
`npm run audit:seo:selftest` gates the gate — it corrupts `out/` one way per
check, confirms the audit fails with the expected message, then restores. It
exists because an edit to the audit once silently no-opped, leaving a check that
looked present in review but never ran.

## Mobile is a separate design, not the desktop reflowed

Every page ships a distinct mobile layout, taken from the `"<Page> Mobile.dc.html"`
exports. The differences are structural, not just tighter spacing:

| Where | Mobile | Desktop |
| --- | --- | --- |
| Homepage / curriculum tutors | horizontal snap rail (+ dots on the homepage) | grid |
| Homepage "how it works" | numbered pills, one ruled row each | columns with left rules |
| Curriculum "how matching works" | one continuous left rule | per-column rules |
| Curriculum subjects | stacked ruled list | card grid |
| Curriculum / tutors closing block | questions first, CTA card last | CTA and questions side by side |
| Pricing plans | swipe carousel | six-column table |
| FAQ categories | scrollable chip row under the search | sticky sidebar rail |
| Contact | details above the form | form left, details right |
| Quick inquiry form | bordered card, uppercase micro-labels, 48px fields | plain card, sentence-case labels |

The breakpoint is `md` (768px), matching the design shell's own
`@media (max-width:767px)` rule. Everything is written mobile-first with `md:`
carrying the desktop values, so both audits above must stay green after a change.

## Hosting config

`vercel.json` is read by Vercel at build time. A static export cannot emit
headers, so that file is the only place the cache lifetimes and the security
headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy`) can be set. **Adding a third-party script — analytics, a
chat vendor, a pixel — means adding its origin to the CSP there, or the
browser will block it.** Vercel serves the branded `404.html` from the export
and compresses responses itself, so neither needs configuring.

Speed Insights (`@vercel/speed-insights`) needs no CSP entry: it loads from
`/_vercel/speed-insights/script.js` and beacons to `/_vercel/speed-insights/vitals`,
both same-origin and so already covered by `'self'`. It reports data only
once Speed Insights is enabled for the project in the Vercel dashboard.

## What a post-build step can and cannot ship

Vercel serves a Next build from Next's own output plus `public/`. Anything a
post-build script writes into `out/` is never uploaded — it exists locally,
passes every local audit, and 404s in production. `llms.txt` was in exactly
that state, which is why `gen-llms-txt.mjs` now writes `public/llms.txt` and
that file is committed.

The same discovery retired `fix-segment-prefetch.mjs`. Next 16.3's client
asks for a route's prefetch payload with the segment path flattened onto one
filename (`/igcse/__next.$d$curriculum.__PAGE__.txt`) while `output: "export"`
writes it into a nested directory. That mismatch matters on a plain file host,
and the script papered over it — but its output was in `out/`, so it never
shipped, and those URLs still resolve on Vercel because Vercel routes segment
prefetch itself. It was doing nothing here and has been removed. Restore it
from git history if the site ever moves back to a plain file host.

## Brand assets

`src/app/{favicon.ico,icon.svg,apple-icon.png}` and `public/og.png` are
generated by `scripts/gen-brand-assets.mjs` (needs `playwright-core`, as above)
and committed. Re-run only if the mark or tagline changes.

## Content and data

Page copy lives in typed files under `src/data/`, extracted from the Claude
Design exports in `website design/` (untracked; `design-reference/` holds the
tracked copy). Files marked `// GENERATED` were produced from those exports —
edit the data file directly, and re-extraction scripts live in the scratchpad,
not the repo.

Single sources of truth worth knowing about:

| Thing | Lives in |
| --- | --- |
| Response-time SLA | `SLA_RESPONSE_TIME` in `src/lib/constants.ts` |
| Class duration | `CLASS_DURATION_MINUTES` in `src/data/pricing.ts` |
| Prices and plans | `src/data/pricing.ts` |
| Curricula and subjects | `src/data/curricula.ts` |
| Chat assistant answers | `src/data/chat.ts` |
| Pages excluded from search | `NOINDEX_CURRICULA` in `src/lib/constants.ts` |

Never hardcode a response time, price, or class length in a component — render
it from these.

## Blog

Posts are MDX files in `content/blog/`. Frontmatter is validated at build time
in `src/lib/blog.ts`; a malformed post fails the build rather than shipping
broken. Required: `title`, `description`, `date` (YYYY-MM-DD). Optional: `tags`,
`author`.

## Form pipeline

The form posts to the Cloudflare Worker in `../mystudyally-forms-worker`
(separate project). The Worker handles CORS, honeypot, Turnstile verification,
rate limiting, D1 persistence, and SendGrid delivery.

`src/lib/schemas/inquiry.ts` mirrors the Worker's Zod schema field for field —
if you change one, change both.

## Environment variables

Only `NEXT_PUBLIC_*` values belong here; they are bundled into the HTML and are
public by design. The SendGrid key and Turnstile **secret** key live only as
Worker secrets, never in this repo.

## Known gaps before launch

See the launch checklist in the project notes. In short:

- **Legal entity name.** `LEGAL_ENTITY_NAME` in `src/lib/constants.ts` is still
  just "MyStudyAlly". `/privacy/` renders it as the data controller and names a
  registered address; UK GDPR expects a controller the reader can identify
  before the form collects anything.
- **Cancellation and refund policy** is still described as "being finalised".
- **SABIS subject verification** — the page ships `noindex` and is out of the
  sitemap until its subjects are checked against the real tutor pool.
- **The student portal.** The header's "Sign in" renders as a disabled control
  with a "coming soon" tag (`SignInSoon` in
  `src/components/layout/SiteHeader.tsx`). When a portal URL exists, swap that
  component for a `<Link>` — both the desktop header and the mobile drawer read
  from it, so it is a single edit.
- **Colour contrast.** Several of the design's own greys fall below WCAG AA on
  white: `#777777` at 4.48:1 (needs 4.5), `#AFAFAF` at 2.19:1, and white on the
  brand green `#58CC02` at 2.09:1. These are palette decisions, not code
  defects, so they are left as designed — but they are the site's largest
  remaining accessibility gap. `#777777` -> `#6F6F6F` would clear AA on both
  white and `#F7F7F7` and is visually indistinguishable.
- **`NEXT_PUBLIC_GA4_ID`** is plumbed through `.env.example` and the deploy
  workflow but nothing reads it — there is no analytics on the site. Wire it up
  or drop the variable.
