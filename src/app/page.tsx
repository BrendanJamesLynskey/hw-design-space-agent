import Link from "next/link";

import { LevelBadge, Prov } from "@/components/dse/Badges";
import { LadderHero } from "@/components/dse/lazy";
import { CostTable, HeadlineTable } from "@/components/dse/Tables";
import { V } from "@/components/mdx/V";
import { COMMIT, site } from "@/lib/dse/data";
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
  const planOnly = site.ladder.filter((l) => l.plan_only);
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
        picks the design. The plan is to take that one spec down the whole
        fidelity ladder: system-level simulation, cycle-level simulation, RTL,
        synthesis and gate-level simulation of the netlist, each offering its
        own power, performance and area trade-offs, with regression tests
        against the golden model at every level. Today the first two levels are
        live; the rest are badged with the milestone that builds them.
      </p>

      <LadderHero
        hero={site.hero}
        ladder={site.ladder}
        spec={site.specs[site.hero.spec]!}
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
          What milestone 1 found
        </h2>
        <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300">
          The CORDIC sin/cos case study has {<V of="designs" fmt="int" />}{" "}
          possible designs, few enough to score every one, so each run is graded
          against the exact answer. On {<V of="runs" fmt="int" />} recorded runs
          with real models, the honest result is a split:{" "}
          <strong>the agent is the better selector</strong>, and{" "}
          <strong>NSGA-II is the better front-mapper</strong>. On every feasible
          spec an LLM agent picked a design closer to the true optimum than
          either baseline, and <V of="regret.agent_beats_nsga2" fmt="int" /> of
          the <V of="regret.agent_rows" fmt="int" /> model-and-spec pairs beat
          NSGA-II&apos;s mean regret. But on two of the three, the agents dive
          at the spec&apos;s corner and stop once it stops improving, so plain
          NSGA-II maps the whole trade-off curve far better (hypervolume{" "}
          <V of="dds_250msps.nsga2_hv" fmt="f3" /> against at most{" "}
          <V of="dds_250msps.best_agent_hv" fmt="f3" /> on dds_250msps, and{" "}
          <V of="low_area_control.nsga2_hv" fmt="f3" /> against at most{" "}
          <V of="low_area_control.best_agent_hv" fmt="f3" /> on
          low_area_control). That is the division of labour the design intends:
          the agent finds the critical 3% cheaply, and exhaustive front-mapping
          stays the job of a classic optimiser, which the agent drives.
        </p>
        <HeadlineTable />
        <p className="max-w-3xl text-neutral-700 dark:text-neutral-300">
          <strong>The infeasible spec.</strong> Asked for 400 MSPS, every model
          on every seed ({<V of="infeasible.llm_declared" fmt="int" />} of{" "}
          {<V of="infeasible.llm_runs" fmt="int" />} runs) declared the spec
          infeasible itself and named throughput as the binding constraint. The
          exhaustive grid agrees: the fastest design anywhere reaches{" "}
          <V of="infeasible.best_msps" fmt="f1" /> MSPS
          <Prov kind="estimate" />.
        </p>
      </section>

      <section aria-labelledby="cost" className="mt-12">
        <h2 id="cost" className="text-2xl font-semibold tracking-tight">
          What it costs to run
        </h2>
        <p className="mt-4 max-w-3xl text-neutral-700 dark:text-neutral-300">
          The price of the LLM is part of the result. A complete exploration of
          one spec cost between <V of="cost.min_per_run" fmt="usd" /> and{" "}
          <V of="cost.max_per_run" fmt="usd" /> per run depending on the model,
          and took <V of="cost.min_wall_s" fmt="s" /> to{" "}
          <V of="cost.max_wall_s" fmt="s" /> on average. With reasoning turned
          off, Qwen3.8-27B was about <V of="cost.qwen.cheaper" fmt="x" />{" "}
          cheaper per run and finished in <V of="cost.qwen.speedup" fmt="x" />{" "}
          less wall-clock time than with its default reasoning.
        </p>
        <CostTable />
        <p className="max-w-3xl text-neutral-700 dark:text-neutral-300">
          <strong>Labour-saving, round the clock.</strong> Each run is an
          independent, checkpointed LangGraph thread, so several agents can run
          24/7, each evaluating a real design decision; the eval above is 48 of
          them. That is what the architecture enables, not a measured fleet.{" "}
          <span data-projection>
            <em>Projection</em>, from the measured means: one Sonnet 5.5 agent
            running back to back for a day would finish about{" "}
            <V of="proj.sonnet.runs_per_day" fmt="int" /> explorations for about{" "}
            <V of="proj.sonnet.usd_per_day" fmt="usd" /> (ignoring rate limits).
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
          , where M1 is done and M2–M4 are planned.{" "}
          {planOnly.map((l) => l.name).join(" and ")} are the project&apos;s
          plan for{" "}
          {[...new Set(planOnly.map((l) => l.milestone))].join(" and ")} and are
          not yet listed in that README.
        </p>
      </section>

      <nav aria-label="Next" className="mt-12 flex flex-wrap gap-3">
        <a href={AGENT_REPO} className={BTN}>
          The repository
        </a>
        <a href={agentFile("eval/results.md", commit)} className={BTN}>
          Full results
        </a>
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
