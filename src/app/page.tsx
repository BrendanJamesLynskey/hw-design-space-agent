import Link from "next/link";

import { LevelBadge, Prov } from "@/components/dse/Badges";
import { LadderHero } from "@/components/dse/lazy";
import { CostTable, HeadlineTable } from "@/components/dse/Tables";
import { V } from "@/components/mdx/V";
import { COMMIT, site } from "@/lib/dse/data";
import { ladder } from "@/lib/dse/ladder";
import { AGENT_REPO, agentFile } from "@/lib/site";

const LINK =
  "focus-ring rounded underline decoration-accent/40 underline-offset-4 hover:decoration-accent";
const BTN =
  "focus-ring inline-flex min-h-11 items-center rounded border border-neutral-300 px-4 text-sm font-medium hover:border-accent dark:border-neutral-700 dark:hover:border-indigo-400";

/**
 * Landing page: the hero animation (one real run down the fidelity ladder), the two phrases,
 * the pitch, the honest headline results, the measured cost, and the ways in. Server
 * Component; the hero is a client widget loaded after the page.
 */
export default function HomePage(): JSX.Element {
  const commit = site.vendored.commit;
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        HW Design-Space Agent
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        An agent optimised for hardware development: trade-off exploration.
      </h1>
      <p className="mt-6 max-w-3xl text-lg text-neutral-600 dark:text-neutral-300">
        Give it one high-level spec. A LangGraph agent chooses which
        architectures to explore, a classic optimiser searches them on tested
        models, and the agent reads the results, decides what to try next, and
        picks the design. That one spec then goes down the fidelity ladder: RTL
        generated and simulated in two simulators, synthesis and place and
        route, gate-level simulation of the netlist, and back-annotation of the
        measurements into the cost model, each level offering its own power,
        performance and area view, with regression tests against the golden
        model at every level. System-level (SimPy) and cycle-level simulation
        come next; they are badged with the milestone that builds them.
      </p>

      <LadderHero
        hero={site.hero}
        ladder={site.ladder}
        spec={site.specs[site.hero.spec]!}
        worked={ladder.worked}
      />

      <section
        aria-label="Two principles"
        className="grid gap-4 sm:grid-cols-2"
      >
        <blockquote className="rounded-lg border-l-4 border-accent bg-neutral-50 p-5 text-xl font-semibold tracking-tight dark:border-indigo-300 dark:bg-neutral-900">
          An AI agent is the perfect environment for trade-off exploration.
        </blockquote>
        <blockquote className="rounded-lg border-l-4 border-emerald-600 bg-neutral-50 p-5 text-xl font-semibold tracking-tight dark:border-emerald-400 dark:bg-neutral-900">
          Avoid premature optimisation.{" "}
          <Link href="/why" className={`${LINK} text-base font-normal`}>
            Why
          </Link>
        </blockquote>
      </section>

      <section aria-labelledby="pitch" className="mt-12">
        <h2 id="pitch" className="text-2xl font-semibold tracking-tight">
          The pitch
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-neutral-700 dark:text-neutral-300">
          <li>
            <strong>Explore before you optimise.</strong> Exploration finds the
            critical 3% worth optimising: the right architecture for{" "}
            <em>this</em> spec, or the proof that none exists.
          </li>
          <li>
            <strong>The LLM never produces a number.</strong> It chooses
            families, ranges and next steps; deterministic code computes every
            figure, labelled <Prov kind="exact" /> (bit-accurate golden model),{" "}
            <Prov kind="estimate" /> (calibrated cost model) or{" "}
            <Prov kind="measured" />.
          </li>
          <li>
            <strong>Software and hardware, one engineer.</strong> Built with
            LangGraph, Python, TypeScript, tests and CI by an engineer with more
            than 25 years in hardware: FPGA and RTL, SoC, power, signal and
            power integrity, PCB and DSP.{" "}
            <Link href="/about" className={LINK}>
              About
            </Link>
          </li>
        </ol>
      </section>

      <section aria-labelledby="results" className="mt-12">
        <h2 id="results" className="text-2xl font-semibold tracking-tight">
          What the eval found, M1 → M2
        </h2>
        <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300">
          The CORDIC sin/cos case study has {<V of="designs" fmt="int" />}{" "}
          possible designs, few enough to score every one, so each run is graded
          against the exact answer. Milestone 1 ({<V of="m1.runs" fmt="int" />}{" "}
          runs with real models) found a split:{" "}
          <strong>the agent was the better selector</strong>, and{" "}
          <strong>NSGA-II the better front-mapper</strong>, because the agents
          dived at the spec&apos;s corner and stopped early. Milestone 2 (
          {<V of="m2.runs" fmt="int" />} runs, five seeds) gave the agent a way
          to map the whole trade-off curve, and <strong>closed the gap</strong>:
          every model now covers <V of="glance.hv_ratio_min" fmt="f2" />–
          <V of="glance.hv_ratio_max" fmt="f2" />× NSGA-II&apos;s hypervolume on
          every feasible spec (M1: as little as{" "}
          <V of="glance.m1_hv_ratio_min" fmt="f2" />
          ×), while still selecting a better design than NSGA-II in{" "}
          <V of="glance.regret_beats" fmt="int" /> of the{" "}
          <V of="glance.regret_cells" fmt="int" /> model-and-spec cells. It got
          worse in places: Qwen lost on{" "}
          <span className="font-mono">high_precision</span> (one bad seed),
          DeepSeek&apos;s selection slipped, and the agent now always spends the
          full budget.{" "}
          <Link href="/results" className={LINK}>
            The full results
          </Link>{" "}
          open with those.
        </p>
        <HeadlineTable />
        <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300">
          <strong>Measured, not just estimated.</strong> The ground truth&apos;s
          winners were generated as RTL, verified bit for bit in two simulators
          and at the gate level, and synthesised: the repository&apos;s
          open-source flow has <V of="l4.points" fmt="int" /> measured points
          and Vivado 2025.2 <V of="vivado.designs" fmt="int" /> designs.
          Refitting the cost model to them changes no spec&apos;s winner, and on{" "}
          <span className="font-mono">high_precision</span>, where the margin is
          thinnest, routed timing confirms the choice.{" "}
          <Link
            href="/case-study#estimates-against-measurements"
            className={LINK}
          >
            See the measurements
          </Link>
          .
        </p>
        <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300">
          <strong>The infeasible spec.</strong> Asked for 400 MSPS, every model
          on every seed of both milestones declared the spec infeasible itself
          and named throughput as the binding constraint. The exhaustive grid
          agrees: the fastest design anywhere reaches{" "}
          <V of="infeasible.best_msps" fmt="f1" /> MSPS
          <Prov kind="estimate" />.
        </p>
      </section>

      <section aria-labelledby="cost" className="mt-12">
        <h2 id="cost" className="text-2xl font-semibold tracking-tight">
          What it costs to run
        </h2>
        <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300">
          The price of the LLM is part of the result. In M2, a complete
          exploration of one spec cost between{" "}
          <V of="m2.cost.min_per_run" fmt="usd" /> and{" "}
          <V of="m2.cost.max_per_run" fmt="usd" /> per run depending on the
          model, and took <V of="m2.cost.min_wall_s" fmt="s" /> to{" "}
          <V of="m2.cost.max_wall_s" fmt="s" /> on average; all{" "}
          <V of="m2.runs" fmt="int" /> runs cost{" "}
          <V of="m2.total_usd" fmt="usd" /> provider-reported. In M1, turning
          Qwen3.8-27B&apos;s reasoning off made it about{" "}
          <V of="m1.cost.qwen.cheaper" fmt="x" /> cheaper per run and{" "}
          <V of="m1.cost.qwen.speedup" fmt="x" /> faster by wall-clock.
        </p>
        <CostTable ms="m2" />
        <p className="max-w-3xl text-neutral-700 dark:text-neutral-300">
          <strong>Labour-saving, round the clock.</strong> Each run is an
          independent, checkpointed LangGraph thread, so several agents can run
          24/7, each evaluating a real design decision; the M2 eval above is{" "}
          <V of="m2.runs" fmt="int" /> of them, up to{" "}
          <V of="m2.fleet.max" fmt="int" /> at once. That is what the
          architecture enables, not a measured round-the-clock fleet.{" "}
          <span data-projection>
            <em>Projection</em>, from the measured M2 means: one Sonnet 5.5
            agent running back to back for a day would finish about{" "}
            <V of="m2.proj.sonnet.runs_per_day" fmt="int" /> explorations for
            about <V of="m2.proj.sonnet.usd_per_day" fmt="usd" /> (ignoring rate
            limits).
          </span>
        </p>
      </section>

      <section aria-labelledby="ladder" className="mt-12">
        <h2 id="ladder" className="text-2xl font-semibold tracking-tight">
          The ladder, as of commit {COMMIT}
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {site.ladder.map((l) => (
            <li
              key={l.id}
              data-level={l.id}
              className={`rounded border px-3 py-2 text-sm ${l.status === "live" ? "border-neutral-300 dark:border-neutral-700" : "border-dashed border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"}`}
            >
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">
                  <span className="font-mono">{l.id}</span> {l.name}
                </span>
                <LevelBadge status={l.status} milestone={l.milestone} />
              </span>
              <span className="mt-1 block text-xs">
                {l.what}. Check: {l.check}.
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 max-w-3xl text-xs text-neutral-600 dark:text-neutral-400">
          Badges follow the roadmap in the repository&apos;s{" "}
          <a href={agentFile("README.md", commit)} className={LINK}>
            README at {COMMIT}
          </a>
          , where{" "}
          {site.milestones
            .filter((m) => m.status === "done")
            .map((m) => m.id)
            .join(" and ")}{" "}
          are done and{" "}
          {site.milestones
            .filter((m) => m.status !== "done")
            .map((m) => m.id)
            .join(" and ")}{" "}
          are planned. The README&apos;s L2 is &ldquo;cycle-level / system
          simulation&rdquo;; SimPy as its system-level engine is the
          project&apos;s plan.
        </p>
      </section>

      <nav aria-label="Next" className="mt-12 flex flex-wrap gap-3">
        <a href={AGENT_REPO} className={BTN}>
          The repository
        </a>
        <Link href="/results" className={BTN}>
          Full results
        </Link>
        <Link href="/how-it-works" className={BTN}>
          How it works
        </Link>
        <Link href="/case-study" className={BTN}>
          The CORDIC case study
        </Link>
        <Link href="/about" className={BTN}>
          About the author
        </Link>
      </nav>
    </main>
  );
}
