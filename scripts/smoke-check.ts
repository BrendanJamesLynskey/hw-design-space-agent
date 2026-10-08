/**
 * scripts/smoke-check.ts
 *
 * Post-deploy smoke check, adapted from the agent sites'. Fetches every page and exits non-zero
 * if any fails:
 *
 *     pnpm smoke https://hw-design-space-agent.vercel.app
 *
 * With no argument it checks http://localhost:3000. For a protected preview deployment, pass the
 * bypass token as VERCEL_BYPASS (sent as the `x-vercel-protection-bypass` header; never printed).
 *
 * Fails when a page is not a 200 (redirects count as failures) or lacks the content that proves
 * it rendered from the vendored data: the vendored commit in the footer on every page, the
 * Knuth DOI on /why, the widget placeholders, and the about page's contact links.
 */
import { site } from "@/lib/dse/data";

const headers: Record<string, string> = process.env.VERCEL_BYPASS
  ? { "x-vercel-protection-bypass": process.env.VERCEL_BYPASS }
  : {};

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const commit = site.vendored.commit.slice(0, 7);

const PAGES: [string, string[]][] = [
  [
    "/",
    [
      commit,
      "The ladder, as of commit",
      "trade-off exploration",
      "data-pending-widget",
    ],
  ],
  ["/why", [commit, "doi.org/10.1145/356635.356640", "critical 3%"]],
  ["/case-study", [commit, "bit-exact", "data-pending-widget"]],
  [
    "/about",
    [commit, "linkedin.com/in/brendan-lynskey-a891705", "BrendanJamesLynskey"],
  ],
];

async function main(): Promise<void> {
  let bad = 0;
  for (const [path, must] of PAGES) {
    let detail = "200";
    try {
      const res = await fetch(base + path, { redirect: "manual", headers });
      if (res.status !== 200) detail = String(res.status);
      else {
        const html = await res.text();
        const missing = must.filter((m) => !html.includes(m));
        if (missing.length) detail = `200 but missing ${missing.join(", ")}`;
        if (/mailto:/.test(html)) detail = "contains a mailto: link";
      }
    } catch (err) {
      detail = (err as Error).message;
    }
    const ok = detail === "200";
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"} ${path}  ${detail}`);
  }
  console.log(`${PAGES.length - bad}/${PAGES.length} passed`);
  process.exit(bad ? 1 : 0);
}

void main();
