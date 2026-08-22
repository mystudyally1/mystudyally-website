/**
 * Verifies the seo-audit guards actually fire on the conditions they claim to
 * catch. A gate that never fires is worse than no gate — it reads as proof.
 *
 * Each case corrupts `out/` in one specific way, runs the audit, restores the
 * file, and asserts the audit reported the expected problem. Cases marked
 * `expectNoFailure` assert the opposite: that a shape which *looks* suspicious
 * is correctly left alone, which is how a check earns the right to be loose.
 *
 * This exists because an edit to the audit once silently no-opped, leaving a
 * check that looked present in review but never ran.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");

/**
 * Runs the audit and captures stdout whether it passes or fails.
 *
 * The audit exits 0 on warnings and prints them to stdout, so a harness that
 * only read output on a non-zero exit could never test a warning-level check —
 * it would silently report every one of them as caught.
 */
function runAudit() {
  try {
    const output = execFileSync("node", ["scripts/seo-audit.mjs"], {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { failed: false, output };
  } catch (e) {
    return { failed: true, output: (e.stdout ?? "") + (e.stderr ?? "") };
  }
}

const cases = [
  {
    name: "blanket /*.txt$ disallow hides llms.txt",
    file: "robots.txt",
    corrupt: (s) => s.replace(/Disallow: \/\*index\.txt\$/g, "Disallow: /*.txt$"),
    expect: /disallows \/llms\.txt/,
  },
  {
    name: "AI crawler group missing a disallow from *",
    file: "robots.txt",
    corrupt: (s) =>
      s.replace(
        "User-Agent: GPTBot\nAllow: /\nDisallow: /thank-you/\n",
        "User-Agent: GPTBot\nAllow: /\n",
      ),
    expect: /does not repeat Disallow: \/thank-you\//,
  },
  {
    name: "llms.txt links to a page that does not exist",
    file: "llms.txt",
    corrupt: (s) => s.replace("https://mystudyally.com/pricing/", "https://mystudyally.com/gone/"),
    expect: /links to a page that does not exist/,
  },
  {
    name: "double-escaped entity rendered as visible text",
    file: "sat/index.html",
    corrupt: (s) => s.replace("Reading &amp; Writing", "Reading &amp;amp; Writing"),
    expect: /double-escaped entity/,
  },
  {
    name: "IndexNow key file contents do not match its name",
    file: "0c3837f00d087339ee3e6b0291ea3b1b.txt",
    corrupt: () => "wrong-key",
    expect: /IndexNow key file must contain exactly/,
  },
  {
    // The pixel measure replaced a character count that was producing a false
    // positive. A looser check that never fires would be the worse bug, so
    // prove it still catches a genuinely over-wide title: 61 capital W's are
    // the same length as the headline it stopped flagging, at twice the width.
    name: "title too wide for the SERP (pixel measure still fires)",
    file: "about/index.html",
    corrupt: (s) => s.replace(/<title>[^<]*<\/title>/, `<title>${"W".repeat(61)}</title>`),
    expect: /title renders ~\d+px wide/,
  },
  {
    // …and that a long-but-narrow title is NOT flagged, which is the whole
    // reason for measuring width instead of counting characters.
    name: "long narrow title stays unflagged (no false positive)",
    file: "about/index.html",
    corrupt: (s) => s.replace(/<title>[^<]*<\/title>/, `<title>${"l".repeat(61)}</title>`),
    expectNoFailure: true,
  },
  {
    name: "article with no author at all",
    file: "blog/digital-sat-what-changed/index.html",
    corrupt: (s) => s.replace(/"author":\{"@id":"[^"]*"\},/, ""),
    expect: /article has no author/,
  },
  {
    // The original bug: every page inherited the root layout's Twitter card
    // while its og: tags were correct, so a page shared to X showed the
    // homepage's title. Simulate the inherited value coming back.
    name: "twitter:title falls back to the site-wide default",
    file: "pricing/index.html",
    corrupt: (s) =>
      s.replace(
        /<meta name="twitter:title" content="[^"]*"\/>/,
        '<meta name="twitter:title" content="MyStudyAlly — Curriculum-matched tutoring, done properly"/>',
      ),
    expect: /twitter:title .* disagrees with og:title/,
  },
];

// Baseline: a clean tree must pass, or every result below is meaningless.
const baseline = runAudit();
if (baseline.failed) {
  console.error("BASELINE FAILED — audit does not pass on a clean build:\n" + baseline.output);
  process.exit(1);
}
console.log("baseline: audit passes on clean build\n");

let bad = 0;
for (const c of cases) {
  const file = path.join(OUT, c.file);
  const original = fs.readFileSync(file, "utf-8");
  const corrupted = c.corrupt(original);
  if (corrupted === original) {
    console.log(`  SKIP  ${c.name} (corruption was a no-op — test is stale)`);
    bad++;
    continue;
  }
  fs.writeFileSync(file, corrupted, "utf-8");
  const result = runAudit();
  fs.writeFileSync(file, original, "utf-8");

  if (c.expectNoFailure) {
    // Asserts the audit stayed quiet: no error, and nothing new in the warning
    // list. Proves the check is not simply flagging everything.
    const quiet = !result.failed && !/\bwarn\b/.test(result.output);
    console.log(`  ${quiet ? "correctly quiet" : "FALSE POSITIVE"}  ${c.name}`);
    if (!quiet) bad++;
    continue;
  }

  // `expect` may match a failure or a warning — both are the check firing.
  if (c.expect.test(result.output)) {
    console.log(`  caught  ${c.name}`);
  } else {
    console.log(`  MISSED  ${c.name}${result.failed ? " (failed, but wrong message)" : ""}`);
    bad++;
  }
}

// Restored tree must pass again, proving the harness cleaned up after itself.
const after = runAudit();
console.log(`\nafter restore: audit ${after.failed ? "FAILS (cleanup broken)" : "passes"}`);
if (after.failed) bad++;

process.exit(bad === 0 ? 0 : 1);
