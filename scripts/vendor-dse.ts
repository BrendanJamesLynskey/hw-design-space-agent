/**
 * scripts/vendor-dse.ts
 *
 * Vendor HW_Design_Space_Agent's recorded results at a pinned commit, and record which one:
 *
 *     pnpm vendor:dse <commit> [path/to/HW_Design_Space_Agent]
 *
 * Copies, byte for byte from `git show <commit>:<path>` (never the working tree, so local
 * edits can't leak in), into `vendor/hw_dse/<same path>`:
 *
 * - README.md (the roadmap table the ladder badges are read from) and eval/results.md;
 * - the exhaustive ground truth, the baselines and the 48 agent-run summaries (eval/data);
 * - the precomputed exact accuracy table (eval/data/accuracy_table.csv.gz);
 * - every recorded run trace (eval/data/traces: llm_trace.jsonl, evaluations.csv.gz, report.md);
 * - the example specs and the cost model's calibration file.
 *
 * `vendor/hw_dse/VENDORED.json` records the repository, the full commit hash and each file's
 * SHA-256; the commit must already be on the repository's `origin`. tests/unit/vendor.test.ts
 * and tests/python/test_export.py fail if a copy and its recorded hash disagree, and the CI's
 * Python job checks that `scripts/export_dse.py`, run with the reference installed from git at
 * that commit, regenerates this site's data and parity fixtures exactly.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ref = process.argv[2];
if (!ref) {
  console.error(
    "usage: pnpm vendor:dse <commit> [path/to/HW_Design_Space_Agent]",
  );
  process.exit(2);
}
const repo = resolve(
  process.argv[3] ?? join(process.cwd(), "..", "HW_Design_Space_Agent"),
);
const git = (...args: string[]): string =>
  execFileSync("git", ["-C", repo, ...args], {
    encoding: "utf-8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim();

const commit = git("rev-parse", "--verify", `${ref}^{commit}`);
if (!/origin\//.test(git("branch", "-r", "--contains", commit))) {
  console.error(`${commit} is not on origin: push it before vendoring.`);
  process.exit(1);
}
const tree = (dir: string) =>
  git("ls-tree", "-r", "--name-only", commit, `${dir}/`)
    .split("\n")
    .filter(Boolean);

const paths = [
  "README.md",
  "eval/results.md",
  "eval/data/ground_truth.json",
  "eval/data/baselines.json",
  "eval/data/accuracy_table.csv.gz",
  "src/hw_dse/models/calibration_artix7.yaml",
  ...tree("eval/data/agent").filter((p) => p.endsWith(".json")),
  ...tree("eval/data/traces").filter((p) =>
    /(INDEX\.md|llm_trace\.jsonl|evaluations\.csv\.gz|report\.md)$/.test(p),
  ),
  ...tree("specs").filter((p) => p.endsWith(".yaml")),
];

const OUT = "vendor/hw_dse";
rmSync(OUT, { recursive: true, force: true });
const files: Record<string, { sha256: string }> = {};
for (const p of paths) {
  const buf = execFileSync("git", ["-C", repo, "show", `${commit}:${p}`], {
    maxBuffer: 64 * 1024 * 1024,
  });
  const to = join(OUT, p);
  mkdirSync(dirname(to), { recursive: true });
  writeFileSync(to, buf);
  files[p] = { sha256: createHash("sha256").update(buf).digest("hex") };
}
const record = {
  repository: "https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent",
  commit,
  committed: git("show", "-s", "--format=%cI", commit),
  files,
};
writeFileSync(
  join(OUT, "VENDORED.json"),
  JSON.stringify(record, null, 2) + "\n",
);
console.log(`vendored ${paths.length} files @ ${commit.slice(0, 7)}`);
