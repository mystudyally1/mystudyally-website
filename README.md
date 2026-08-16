# MyStudyAlly — marketing website

Static-exported Next.js App Router site. No login, no database on the site, no
payments. Inquiry forms post to a Cloudflare Worker which writes to D1 and sends
email via SendGrid.

## Stack

- Next.js 16 (App Router, `output: 'export'`, Turbopack)
- TypeScript, Tailwind 3.4
- MDX blog via `next-mdx-remote` + `gray-matter`
- Deployed to Hostinger behind Cloudflare, via GitHub Actions

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

Both also run in CI before deploying.

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

See the launch checklist in the project notes. In short: legal entity name for
`/privacy/` and `/terms/`, SABIS subject verification (the page currently ships
`noindex`), and the cancellation/refund policy currently described as "being
finalised".
