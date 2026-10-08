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
    "Milestones M1 to M4: what each adds to the fidelity ladder (RTL, synthesis and gate-level simulation in M2, cycle-level and SimPy system-level simulation in M3), their status and their pull requests.",
};

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";

/** What each milestone brings, in the site's words (the README's own line is quoted too). */
const ADDS: Record<string, string> = {
  M1: "The agent itself: spec intake with a human in the loop, LLM-steered exploration over tested fast models, the exhaustive ground truth and the eval against NSGA-II and random search with real models. Everything on this site so far.",
  M2: "From estimates to measurements: a parametrised SystemVerilog design per family, simulated and checked against the golden model (with formal checks on small configurations); real synthesis for area, Fmax and power; gate-level simulation of the synthesised netlist, regression-tested against the golden model; and back-annotation, which recalibrates the cost model from the measured results and re-explores if the winner changes.",
  M3: "Behaviour in context: cycle-level simulation of the shortlisted candidates, and SimPy system-level simulation of a candidate inside a system model (traffic, queues, back-pressure), each regression-tested against the golden model.",
  M4: "Breadth: more functions and targets (for example an ASIC gate-equivalent cost model) and a richer family registry.",
};

/** Pull requests per milestone, in the agent's repository and this site's. */
const PRS: Record<string, { href: string; label: string }[]> = {
  M1: [
    {
      href: `${AGENT_REPO}/pull/1`,
      label: "HW_Design_Space_Agent #1 (merged)",
    },
    { href: `${GITHUB_URL}/pull/1`, label: "this site, part A (merged)" },
    { href: `${GITHUB_URL}/pulls?q=is%3Apr`, label: "this site's later parts" },
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
                      {l.plan_only ? " (project plan)" : ""}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                README: &ldquo;{m.levels}&rdquo; ({m.status})
              </p>
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
        Gate-level simulation of the netlist (M2) and SimPy system-level
        simulation (M3) are the project&apos;s plan for those milestones; the
        README at {COMMIT} does not list them yet. See also{" "}
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
