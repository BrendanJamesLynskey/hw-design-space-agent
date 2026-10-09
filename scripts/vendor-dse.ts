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
 * - the exhaustive ground truth, the M1 and M2 baselines and every agent-run summary
 *   (eval/data/agent for M1, agent_m2 and agent_m2_pilot for M2);
 * - the precomputed exact accuracy table (eval/data/accuracy_table.csv.gz);
 * - every recorded run trace (eval/data/traces, M2's under traces/m2: llm_trace.jsonl,
 *   evaluations.csv.gz, report.md, INDEX.md);
 * - M2's ladder data: the L3 verification table (RTL and gate level), the formal results, the
 *   L4 synthesis table, the Vivado measurements (both batches and the spot-check), the L5
 *   refit reports, the key usage before and after the M2 runs and the spend ledger;
 * - the worked example of one design up the ladder (docs/worked_example_m2.md);
 * - the example specs, the cost model's calibration file and the two refit calibrations.
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
  "src/hw_dse/models/calibration_artix7_refit_vivado-2025.2.yaml",
  "src/hw_dse/models/calibration_artix7_refit_yosys-nextpnr.yaml",
  "docs/worked_example_m2.md",
  "eval/data/README.md",
  "eval/data/baselines_m2.json",
  "eval/data/key_usage_m2.json",
  "eval/data/spend_ledger.jsonl",
  "eval/data/l3_verification.csv",
  "eval/data/formal_results.csv",
  "eval/data/l4_synthesis.csv",
  "eval/data/vivado_measured.csv",
  "eval/data/vivado_measured_2.csv",
  "eval/data/vivado_spotcheck.csv",
  "eval/data/l5_refit_vivado-2025.2.json",
  "eval/data/l5_refit_vivado-2025.2.md",
  "eval/data/l5_refit_yosys-nextpnr.json",
  "eval/data/l5_refit_yosys-nextpnr.md",
  ...tree("eval/data/agent").filter((p) => p.endsWith(".json")),
  ...tree("eval/data/agent_m2").filter((p) => p.endsWith(".json")),
  ...tree("eval/data/agent_m2_pilot").filter((p) => p.endsWith(".json")),
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
