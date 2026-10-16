/**
 * /roadmap: milestones M1–M4 with their status from the repository's README at the vendored
 * commit, what each adds to the fidelity ladder, and the pull requests. Server Component.
 */
import Link from "next/link";

import { LevelBadge } from "@/components/dse/Badges";
import { COMMIT, site } from "@/lib/dse/data";
import { hp20, viv4 } from "@/lib/dse/vivado4";
import { AGENT_REPO, GITHUB_URL, agentFile } from "@/lib/site";
import { withShare } from "@/lib/share";

export const metadata = withShare("/roadmap", {
  title: "Roadmap",
  description:
    "Milestones M1 to M4, all done: what each adds to the fidelity ladder (RTL, synthesis, gate-level simulation and back-annotation in M2; cycle-level and SimPy system-level simulation and an experimental campaign layer in M3; an ASIC target on sky130, a code-orchestrated fleet and L2 → L1 feedback in M4), their pull requests, and what is planned after M4.",
});

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";

/** What each milestone brings, in the site's words (the README's own line is quoted too). */
const ADDS: Record<string, string> = {
  M1: "The agent itself: spec intake with a human in the loop, LLM-steered exploration over tested fast models, the exhaustive ground truth and the eval against NSGA-II and random search with real models.",
  M2: "From estimates to measurements, and the whole trade-off curve: one generator of SystemVerilog for every family, verified against the golden model in Verilator and Icarus and with SymbiYosys proofs; open-source synthesis and place-and-route (Yosys + nextpnr-xilinx) and gate-level simulation of the netlist; back-annotation that refits the cost model per tool and flags a winner change; front-mapping levers for the agent, and a five-seed eval. Then a follow-up pull request: Vivado 2025.2 on 14 generated designs and the vivado-2025.2 refit (no spec's winner changed; the default cost model stays M1's).",
  M3: "The design in its system: a cycle-accurate model of every family's interface, checked against the generated RTL cycle for cycle, and SimPy models of three systems (a DDS feeding a mixer, a control loop, a bursty request stream); system-level specs, screened at L1 by optimistic bounds and re-selected at L2 on simulated numbers; an L5 loop that re-explores under the refit when a measurement changes the winner; a gated fix for M2's front-mapping blind spot; and a campaign agent on LangChain Deep Agents with cross-run memory, measured in an A/B against the structured graph. The A/B found no gain at a higher cost, so the campaign agent stays experimental, off by default.",
  M4: "A second target and a fleet: the same generated RTL synthesised on the open sky130 PDK (Yosys + OpenSTA, post-synthesis only, no place and route), an ASIC cost model fitted to 57 measured designs and checked on 9 held-out ones, three ASIC specs with exhaustive ground truth and FPGA twins; a fleet of structured graphs orchestrated by code around a shared LangGraph Store, in a paired A/B against the single graph; L2 → L1 feedback that corrects the system bound when the simulation rejects every candidate; the exports for a local Vivado run (run after M4, below); and the final write-up. The fleet mapped the front worse and, with Qwen, selected better; the ASIC model's winner misses its deadline when measured. Both are stated plainly on the results page.",
};

/** What a milestone's site text says is the project's plan rather than the README's. */
const PLAN_NOTE: Record<string, string> = {};

/** After M4: the project record's plan (§9), with no results. */
const AFTER_M4: string[] = [
  "An ASIC measure-and-re-explore loop: synthesise the selected designs, re-select under the measured numbers, as the FPGA path's L5 loop does. The nine held-out points stay held out.",
  "OpenROAD place and route on sky130, from OpenROAD's own pinned release binaries (or a digest-pinned image), never from a commercial package channel.",
];

/** Done after M4: the local Vivado run (PR #7), with its outcome (src/data/vivado_m4.json). */
const VIV_DONE = `The local Vivado run (2025.2, no LLM call): high_precision's m=8 and m=6 synthesised and routed at their own ${viv4.high_precision_20ns.period_ns} ns clock, and report_power on the ${viv4.power.stages["post-synthesis"].n} measured designs. m=8 misses ${viv4.high_precision_20ns.need_msps} MSPS in both views (${hp20(8, "post-synthesis").msps.toFixed(2)} post-synthesis, ${hp20(8, "post-route").msps.toFixed(2)} post-route), so m=6 stays the winner; the per-family-class path factor was rejected by its pre-set rule; the first measured FPGA power (vectorless) ranks the designs as the power index does (Spearman ${viv4.power.stages["post-synthesis"].spearman.toFixed(3)}) but is off by ${viv4.power.stages["post-synthesis"].rms_pct.toFixed(1)}% RMS.`;

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
  M4: [
    {
      href: `${AGENT_REPO}/pull/6`,
      label: "HW_Design_Space_Agent #6: M4 (merged)",
    },
    {
      href: `${AGENT_REPO}/pull/7`,
      label: "HW_Design_Space_Agent #7: the local Vivado runs (merged)",
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
      <section
        data-testid="after-m4-done"
        className="mt-8 rounded-lg border border-neutral-300 p-5 dark:border-neutral-700"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Done after M4
          </h2>
          <LevelBadge status="live" milestone="done, PR #7" />
        </div>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          {VIV_DONE}{" "}
          <Link href="/results#vivado" className={A}>
            The numbers, losses first
          </Link>
          ;{" "}
          <a href={`${AGENT_REPO}/pull/7`} className={A}>
            HW_Design_Space_Agent #7
          </a>
          .
        </p>
      </section>
      <section
        data-testid="after-m4"
        className="mt-8 rounded-lg border border-dashed border-neutral-300 p-5 dark:border-neutral-700"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight">After M4</h2>
          <LevelBadge status="planned" milestone="plan" />
        </div>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          All four planned milestones are done, and so is the local Vivado run.
          What comes next is the project&apos;s plan, from the{" "}
          <Link href="/record#what-s-next" className={A}>
            project record
          </Link>
          ; none of it has run, so there are no results:
        </p>
        <ol className="ml-5 mt-2 list-decimal space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
          {AFTER_M4.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </section>
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
          results
        </Link>
        , and the{" "}
        <Link href="/writeup" className={A}>
          final write-up
        </Link>
        .
      </p>
    </main>
  );
}
