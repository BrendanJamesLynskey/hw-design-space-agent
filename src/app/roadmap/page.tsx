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
    "Milestones M1 to M4: what each adds to the fidelity ladder (RTL, synthesis, gate-level simulation and back-annotation in M2; cycle-level and SimPy system-level simulation and an experimental campaign layer in M3, both done; an ASIC cost model and a fleet in M4, planned), their status and their pull requests.",
};

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";

/** What each milestone brings, in the site's words (the README's own line is quoted too). */
const ADDS: Record<string, string> = {
  M1: "The agent itself: spec intake with a human in the loop, LLM-steered exploration over tested fast models, the exhaustive ground truth and the eval against NSGA-II and random search with real models.",
  M2: "From estimates to measurements, and the whole trade-off curve: one generator of SystemVerilog for every family, verified against the golden model in Verilator and Icarus and with SymbiYosys proofs; open-source synthesis and place-and-route (Yosys + nextpnr-xilinx) and gate-level simulation of the netlist; back-annotation that refits the cost model per tool and flags a winner change; front-mapping levers for the agent, and a five-seed eval. Then a follow-up pull request: Vivado 2025.2 on 14 generated designs and the vivado-2025.2 refit (no spec's winner changed; the default cost model stays M1's).",
  M3: "The design in its system: a cycle-accurate model of every family's interface, checked against the generated RTL cycle for cycle, and SimPy models of three systems (a DDS feeding a mixer, a control loop, a bursty request stream); system-level specs, screened at L1 by optimistic bounds and re-selected at L2 on simulated numbers; an L5 loop that re-explores under the refit when a measurement changes the winner; a gated fix for M2's front-mapping blind spot; and a campaign agent on LangChain Deep Agents with cross-run memory, measured in an A/B against the structured graph. The A/B found no gain at a higher cost, so the campaign agent stays experimental, off by default.",
  M4: "Breadth and feedback: an ASIC cost model on an open PDK, a fleet of agents, L2 results fed back into L1, more measured data (high_precision's m=8 synthesised at its own 20 ns clock), a richer family registry and the write-up. Planned; no results yet.",
};

/** What a milestone's site text says is the project's plan rather than the README's. */
const PLAN_NOTE: Record<string, string> = {
  M4: "The README lists more functions and targets (an ASIC gate-equivalent cost model), a fleet of agents, a richer registry and the write-up for M4; the open PDK, L2 → L1 feedback and the extra measurements are the project's plan.",
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
  M3: [
    {
      href: `${AGENT_REPO}/pull/5`,
      label: "HW_Design_Space_Agent #5: M3 (merged)",
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
                README: &ldquo;{m.levels.replace(/`/g, "")}&rdquo; ({m.status}
                {m.note ? `: ${m.note}` : ""})
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
                    {r.levels.replace(/`/g, "")}&rdquo; ({r.status}
                    {r.note ? `: ${r.note}` : ""})
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
