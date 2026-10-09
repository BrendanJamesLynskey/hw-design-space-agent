/**
 * /roadmap: milestones M1–M4 with their status from the repository's README at the vendored
 * commit, what each adds to the fidelity ladder, and the pull requests. Server Component.
 */
import Link from "next/link";

import { LevelBadge } from "@/components/dse/Badges";
import { COMMIT, site } from "@/lib/dse/data";
import { AGENT_REPO, GITHUB_URL, agentFile } from "@/lib/site";

export const metadata = {
  title: "Roadmap",
  description:
    "Milestones M1 to M4: what each adds to the fidelity ladder (RTL, synthesis, gate-level simulation and back-annotation in M2, done; cycle-level and SimPy system-level simulation and a campaign layer in M3, planned), their status and their pull requests.",
};

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";

/** What each milestone brings, in the site's words (the README's own line is quoted too). */
const ADDS: Record<string, string> = {
  M1: "The agent itself: spec intake with a human in the loop, LLM-steered exploration over tested fast models, the exhaustive ground truth and the eval against NSGA-II and random search with real models.",
  M2: "From estimates to measurements, and the whole trade-off curve: one generator of SystemVerilog for every family, verified against the golden model in Verilator and Icarus and with SymbiYosys proofs; open-source synthesis and place-and-route (Yosys + nextpnr-xilinx) and gate-level simulation of the netlist; back-annotation that refits the cost model per tool and flags a winner change; front-mapping levers for the agent, and a five-seed eval. Then a follow-up pull request: Vivado 2025.2 on 14 generated designs and the vivado-2025.2 refit (no spec's winner changed; the default cost model stays M1's).",
  M3: "Behaviour in context: cycle-level simulation of the shortlisted candidates and SimPy system-level simulation of a candidate inside a system model (traffic, queues, back-pressure), each regression-tested against the golden model. And a campaign layer: a Deep Agents harness over the existing graph for long-horizon campaigns with memory across runs, measured in an A/B against the structured graph alone. All planned; no results yet.",
  M4: "Breadth: more functions and targets (for example an ASIC gate-equivalent cost model), a richer family registry, a fleet of agents and the write-up. Planned.",
};

/** What a milestone's site text says is the project's plan rather than the README's. */
const PLAN_NOTE: Record<string, string> = {
  M3: "The README lists L2 (cycle-level simulation) for M3. SimPy as the system-level engine and the Deep Agents campaign layer with its A/B are the project's plan (owner decision, 2026-10-09).",
  M4: "The README lists more functions and targets and a richer registry for M4; the fleet and the write-up are the project's plan.",
};

/** Pull requests per milestone, in the agent's repository and this site's. */
const PRS: Record<string, { href: string; label: string }[]> = {
  M1: [
    {
      href: `${AGENT_REPO}/pull/1`,
      label: "HW_Design_Space_Agent #1 (merged)",
    },
    { href: `${GITHUB_URL}/pull/1`, label: "this site, part A (merged)" },
    { href: `${GITHUB_URL}/pull/2`, label: "this site, part B (merged)" },
  ],
  M2: [
    {
      href: `${AGENT_REPO}/pull/3`,
      label: "HW_Design_Space_Agent #3: M2 (merged)",
    },
    {
      href: `${AGENT_REPO}/pull/4`,
      label: "HW_Design_Space_Agent #4: L5 with Vivado 2025.2 (merged)",
    },
    {
      href: `${GITHUB_URL}/pulls?q=is%3Apr`,
      label: "this site's pull requests",
    },
  ],
};

export default function RoadmapPage(): JSX.Element {
  const commit = site.vendored.commit;
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /roadmap
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Roadmap</h1>
      <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300">
        Each milestone takes the same spec one rung further down the fidelity
        ladder. Status comes from the roadmap in the repository&apos;s{" "}
        <a href={agentFile("README.md", commit)} className={A}>
          README at {COMMIT}
        </a>
        ; as each milestone merges, this site re-vendors the repository, flips
        the badges and animates the new levels from real runs.
      </p>
      <ol className="mt-8 space-y-6">
        {site.milestones.map((m) => {
          const levels = site.ladder.filter((l) => l.milestone === m.id);
          const status =
            m.status === "done"
              ? "live"
              : m.status === "in progress"
                ? "in progress"
                : "planned";
          return (
            <li
              key={m.id}
              data-milestone={m.id}
              data-status={m.status}
              className={`rounded-lg border p-5 ${status === "live" ? "border-neutral-300 dark:border-neutral-700" : "border-dashed border-neutral-300 dark:border-neutral-700"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold tracking-tight">{m.id}</h2>
                <LevelBadge status={status} milestone={m.id} />
              </div>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                {ADDS[m.id]}
              </p>
              {levels.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2 text-xs">
                  {levels.map((l) => (
                    <li
                      key={l.id}
                      data-level={l.id}
                      className="rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700"
                    >
                      <span className="font-mono">{l.id}</span> {l.name}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                README: &ldquo;{m.levels.replace(/`/g, "")}&rdquo; ({m.status})
              </p>
              {site.roadmap
                .filter((r, i, all) => {
                  // follow-up rows sit under their milestone in the README's table
                  const k = all.findIndex((x) => x.id === m.id);
                  const next = all.findIndex(
                    (x, j) => j > k && /^M\d$/.test(x.id),
                  );
                  return i > k && (next < 0 || i < next);
                })
                .map((r) => (
                  <p
                    key={r.levels}
                    data-followup={r.status}
                    className="mt-1 text-xs text-neutral-600 dark:text-neutral-400"
                  >
                    README{r.id ? `, ${r.id}` : ""}: &ldquo;
                    {r.levels.replace(/`/g, "")}&rdquo; ({r.status})
                  </p>
                ))}
              {PLAN_NOTE[m.id] && (
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  {PLAN_NOTE[m.id]}
                </p>
              )}
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {(PRS[m.id] ?? []).length > 0 ? (
                  PRS[m.id]!.map((p) => (
                    <a key={p.href} href={p.href} className={A}>
                      {p.label}
                    </a>
                  ))
                ) : (
                  <span className="text-neutral-600 dark:text-neutral-400">
                    No pull request yet.
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="mt-8 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
        How each milestone was planned, verified and decided is in the{" "}
        <Link href="/record" className={A}>
          project record
        </Link>
        . See also{" "}
        <Link href="/how-it-works" className={A}>
          how it works
        </Link>{" "}
        and the{" "}
        <Link href="/results" className={A}>
          results so far
        </Link>
        .
      </p>
    </main>
  );
}
