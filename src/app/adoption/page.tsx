/**
 * /adoption ("For a hardware team"): would this be useful to a company that develops its own
 * hardware? Where it helps and where it does not, compared with a general-purpose agent, how it
 * would be deployed (a proposal, drawn and animated), and how it could be improved. Every claim
 * about this agent links to its evidence at the vendored commit; every number comes from the
 * site's data (checked against the repository) or the vendored write-up's facts. Proposals are
 * labelled as proposals. Server Component; the deployment animation is a lazy client widget.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import Link from "next/link";
import type { ReactNode } from "react";

import { Prov } from "@/components/dse/Badges";
import { DeploymentFlow } from "@/components/dse/lazy";
import { nextSteps } from "@/lib/adoption";
import { COMMIT, site } from "@/lib/dse/data";
import { V_ } from "@/lib/dse/values";
import { AGENT_REPO, agentFile } from "@/lib/site";
import { withShare } from "@/lib/share";

export const metadata = withShare("/adoption", {
  title: "For a hardware team",
  description:
    "Would an agent like this help a company that builds its own hardware? Where it helps (auditable numbers, verification at every level, open-weights models, measured cost, an honest A/B), where it does not (one IP block, a modest LLM contribution, estimate-grade models), how it compares with a general-purpose agent, a proposed deployment next to an EDA farm, and what it would need next.",
});

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";
const TH =
  "border-b border-neutral-300 px-2 py-1.5 text-left align-bottom font-semibold dark:border-neutral-700";
const TD =
  "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-800";

const VENDOR = path.join(process.cwd(), "vendor", "hw_dse");

/** A link to the evidence for a claim: a repository file at the vendored commit, or a page here. */
function Ev({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}): JSX.Element {
  const internal = to.startsWith("/");
  const href = internal ? to : agentFile(to, site.vendored.commit);
  return (
    <span className="whitespace-normal text-xs text-neutral-600 dark:text-neutral-400">
      {" "}
      (evidence:{" "}
      {internal ? (
        <Link href={href} className={A} data-evidence={to}>
          {children}
        </Link>
      ) : (
        <a href={href} className={A} data-evidence={to}>
          {children}
        </a>
      )}
      )
    </span>
  );
}

function Proposal(): JSX.Element {
  return (
    <span
      data-proposal
      className="ml-1 inline-block whitespace-nowrap rounded border border-dashed border-neutral-500 px-1 align-middle font-mono text-[0.65rem] uppercase leading-4 tracking-wide text-neutral-700 dark:border-neutral-400 dark:text-neutral-300"
    >
      proposal
    </span>
  );
}

/** Inline `code` in plain text from the vendored Markdown. */
function Inline({ text }: { text: string }): JSX.Element {
  const parts = text.split("`");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <code key={i} className="font-mono text-[0.9em]">
            {p}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

type Row = {
  aspect: string;
  graph: ReactNode;
  general: ReactNode;
  both: ReactNode;
};

export default function AdoptionPage(): JSX.Element {
  const facts = JSON.parse(
    readFileSync(path.join(VENDOR, "docs", "writeup_facts.json"), "utf-8"),
  ) as Record<string, number>;
  const steps = nextSteps(
    readFileSync(path.join(VENDOR, "docs", "WRITEUP.md"), "utf-8"),
  );
  const f1 = (k: string) => facts[k]!.toFixed(1);

  const rows: Row[] = [
    {
      aspect: "Scope",
      graph: (
        <>
          One IP block (CORDIC sin/cos), four architecture families from a fixed
          registry, two targets (Artix-7, sky130).
        </>
      ),
      general: (
        <>
          Any block and any language: it can read a datasheet, write new RTL and
          drive whatever tools it is given.
        </>
      ),
      both: (
        <>
          The general agent writes a new block&apos;s golden model, generator
          and cost model; the graph explores it.
        </>
      ),
    },
    {
      aspect: "Where numbers come from",
      graph: (
        <>
          Tested code, each number labelled exact, estimate, measured or
          simulated; the LLM&apos;s schemas have no field for one.
        </>
      ),
      general: (
        <>
          From the tools it chooses to run; its own text can restate, round or
          misremember them.
        </>
      ),
      both: <>Numbers about designs only ever come from the graph.</>,
    },
    {
      aspect: "Verification",
      graph: (
        <>
          At every level: golden model, two RTL simulators, formal proofs,
          gate-level simulation, measured back-annotation.
        </>
      ),
      general: <>As good as the tests it writes and runs, run by run.</>,
      both: <>The graph&apos;s checks gate whatever the agent generates.</>,
    },
    {
      aspect: "Evaluation",
      graph: (
        <>
          A/B against NSGA-II and random search, scored on the exhaustive ground
          truth, losses published.
        </>
      ),
      general: <>No built-in ground truth to score it against.</>,
      both: <>The same A/B decides whether the LLM earns its place.</>,
    },
    {
      aspect: "Cost and budget",
      graph: (
        <>
          Measured per run and per spec; evaluation budgets and round caps
          enforced in code.
        </>
      ),
      general: <>Open-ended sessions; cost depends on the task.</>,
      both: <>The agent calls a budgeted tool, not an open loop.</>,
    },
    {
      aspect: "Repeatability",
      graph: (
        <>
          Checkpointed and replayable: all {V_("m4.replay.m2", "int")} M2 runs
          replay identically.
        </>
      ),
      general: <>A free-form session is hard to replay exactly.</>,
      both: <>Replays and traces stay with the graph.</>,
    },
    {
      aspect: "A new kind of block",
      graph: (
        <>
          Real engineering per block: golden model, generator, cost model,
          calibration.
        </>
      ),
      general: <>Can start at once.</>,
      both: <>The agent does the per-block work; people review it.</>,
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /adoption
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        For a hardware team
      </h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Would this help a company that develops its own hardware? Where it
        helps, where it does not, how it would be deployed and what it would
        need next.
      </p>

      <section
        aria-labelledby="short-h"
        className="mt-8 rounded-lg border border-neutral-300 p-5 dark:border-neutral-700"
        data-testid="short-answer"
      >
        <h2 id="short-h" className="text-xl font-semibold tracking-tight">
          The short answer
        </h2>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">
          As it stands, this is a narrow, verified and budgeted tool for one
          kind of block, not a general hardware assistant. Its strongest parts
          for a team are the method around the LLM: numbers that come only from
          tested code, checks at every level of the ladder, and an evaluation
          that scores the agent against plain optimisers on the exact answer.
          The LLM&apos;s own measured contribution is modest. A general-purpose
          coding agent is far more flexible but gives none of those guarantees
          by itself. The pattern this page recommends is the two together, the
          general agent as the front end and this graph as a tool it calls: a
          proposal, not something built.
        </p>
      </section>

      <section aria-labelledby="pros-h" className="mt-10" data-testid="pros">
        <h2 id="pros-h" className="text-2xl font-semibold tracking-tight">
          Where it helps
        </h2>
        <ul className="ml-5 mt-3 list-disc space-y-3 text-neutral-700 dark:text-neutral-300">
          <li>
            <strong>Numbers come from code, and every one is labelled.</strong>{" "}
            The LLM chooses families and ranges and decides what to do next;
            deterministic code produces every number, labelled{" "}
            <Prov kind="exact" /> <Prov kind="estimate" />{" "}
            <Prov kind="measured" /> or <Prov kind="simulated" />. The
            LLM&apos;s structured-output schemas have no field where a number
            about a design could go. Results are therefore auditable and
            repeatable in a way that an agent&apos;s prose is not.
            <Ev to="README.md#the-design-principle">
              README, the design principle
            </Ev>
            <Ev to="src/hw_dse/agent/schemas.py">schemas.py</Ev>
          </li>
          <li>
            <strong>Verification is built in at every level.</strong> A
            bit-exact golden model; generated RTL checked against it in two
            simulators (Verilator and Icarus) and with formal proofs; gate-level
            simulation of the synthesised netlist; measured results fed back
            into the cost model.
            <Ev to="/how-it-works">how it works, the ladder</Ev>
          </li>
          <li>
            <strong>An open-weights model gave useful results.</strong>{" "}
            Qwen3.8-27B with reasoning off, in M2: selection regret{" "}
            {V_("m2.dds_250msps.qwen_off_regret", "pct")} on{" "}
            <code>dds_250msps</code> and{" "}
            {V_("m2.low_area_control.qwen_off_regret", "pct")} on{" "}
            <code>low_area_control</code> against NSGA-II&apos;s{" "}
            {V_("m2.dds_250msps.nsga2_regret", "pct")} and{" "}
            {V_("m2.low_area_control.nsga2_regret", "pct")}, though worse on{" "}
            <code>high_precision</code> (
            {V_("m2.high_precision.qwen_off_regret", "pct")} against{" "}
            {V_("m2.high_precision.nsga2_regret", "pct")}), at{" "}
            {V_("m2.cost.qwen_off.per_spec", "usd")} per spec. That makes a
            fully on-premises setup plausible, where RTL and specs never leave
            the company. What was actually run: the model through OpenRouter, a
            hosted API. On-premises would need the weights served locally; the
            code has an <code>ollama</code> provider for that, but no recorded
            run used it.
            <Ev to="/results">results, M2 tables</Ev>
            <Ev to="src/hw_dse/agent/llm.py">llm.py providers</Ev>
          </li>
          <li>
            <strong>Cost is low and measured.</strong> Per spec in M2:{" "}
            {V_("m2.cost.qwen_off.per_spec", "usd")} (Qwen, reasoning off) to{" "}
            {V_("m2.cost.sonnet.per_spec", "usd")} (Sonnet 5.5),
            provider-reported. At M4&apos;s measured rate, one Qwen graph
            running back to back would cover about{" "}
            {V_("m4.ab.proj.qwen_specs", "int")} specs a day for{" "}
            {V_("m4.ab.proj.qwen_cost", "usd")}: a <strong>projection</strong>{" "}
            from measured runs, not a run.
            <Ev to="/results#fleet">results, throughput</Ev>
          </li>
          <li>
            <strong>People stay in charge, and runs survive.</strong> Two{" "}
            <code>interrupt()</code> gates: an engineer confirms the spec and
            picks the design. Every step is checkpointed (SQLite), so a paused
            or crashed run resumes. A fleet of graphs runs unattended,
            coordinated by code, not by an LLM.
            <Ev to="src/hw_dse/agent/graph.py">graph.py</Ev>
            <Ev to="src/hw_dse/cli.py">cli.py, resume</Ev>
          </li>
          <li>
            <strong>An honest evaluation method a team can reuse.</strong> The
            agent is scored against NSGA-II and random search on the same
            budget, against the exhaustive ground truth, with paired tests and
            the losses published. The same method answers the question a team
            should ask first: does an LLM earn its place here at all?
            <Ev to="/writeup">the write-up</Ev>
          </li>
        </ul>
      </section>

      <section aria-labelledby="cons-h" className="mt-10" data-testid="cons">
        <h2 id="cons-h" className="text-2xl font-semibold tracking-tight">
          Where it does not, and its limits
        </h2>
        <ul className="ml-5 mt-3 list-disc space-y-3 text-neutral-700 dark:text-neutral-300">
          <li>
            <strong>The LLM&apos;s measured contribution is modest.</strong> It
            is a better selector, not a better mapper: in M2 it picked better
            designs than NSGA-II in {V_("glance.regret_beats", "int")} of{" "}
            {V_("glance.regret_cells", "int")} model/spec cells, but mapping the
            trade-off curve was fixed by code (a front-mapping reserve), not by
            the model. M3&apos;s free-form campaign agent gained nothing at{" "}
            {V_("m3.ab.cost_ratio_min", "f2")}–
            {V_("m3.ab.cost_ratio_max", "f2")}× the cost, and M4&apos;s fleet
            mapped less of the curve than one graph (higher hypervolume in{" "}
            {V_("m4.ab.pooled.higher", "int")} of{" "}
            {V_("m4.ab.pooled.pairs", "int")} pairs, p ={" "}
            {V_("m4.ab.pooled.p", "p")}).
            <Ev to="/results">results, losses first</Ev>
          </li>
          <li>
            <strong>Narrow.</strong> One IP block, four families from a fixed
            registry. A new block needs its own golden model, RTL generator,
            cost model and calibration: real engineering for each one.
            <Ev to="README.md#the-m1-design-space-cordic-sincos">
              README, the design space
            </Ev>
          </li>
          <li>
            <strong>The cost models are estimates, with stated errors.</strong>{" "}
            FPGA Fmax is off by up to {f1("fpga.fmax_err_vs_vivado_max")}%
            against Vivado; the ASIC model&apos;s Fmax is off by up to +
            {f1("asic.ho.fmax_err_max")}% on a held-out design. There is no ASIC
            place and route (everything is post-synthesis), and no model sees
            routing: the FPGA winner of <code>high_precision</code> loses{" "}
            {V_("v4.m6.route_loss", "pct0")} of its clock to it.
            <Ev to="/results#vivado">results, the Vivado runs</Ev>
          </li>
          <li>
            <strong>Open-source and single-vendor flows only.</strong>{" "}
            Yosys/nextpnr, Vivado on one machine, Yosys/OpenSTA on sky130. No
            commercial ASIC flow is wired in, and FPGA power is Vivado&apos;s
            vectorless estimate, not switching activity.
            <Ev to="README.md#limitations">README, limitations</Ev>
          </li>
          <li>
            <strong>Provider drift is real and measured.</strong> Qwen on{" "}
            <code>low_area_control</code>, through a graph that replays its M2
            runs identically, had {f1("drift.qwen.low_area.m2_regret")}% mean
            regret in M2 and {f1("drift.qwen.low_area.m4_regret")}% in an M4
            session. Arms are compared only within one session.
            <Ev to="/writeup#limitations">the write-up, limitations</Ev>
          </li>
        </ul>
      </section>

      <section aria-labelledby="vs-h" className="mt-10">
        <h2 id="vs-h" className="text-2xl font-semibold tracking-tight">
          Against a general-purpose agent
        </h2>
        <p className="mt-3 text-neutral-700 dark:text-neutral-300">
          It trades flexibility for trust. A general-purpose agent, such as a
          coding agent working across a repository and a toolchain, can write
          RTL and drive tools ad hoc on any block; this graph does one job with
          guarantees. The two are complements, described here by capability, not
          by benchmark.
        </p>
        <div
          role="region"
          aria-label="Comparison with a general-purpose agent"
          tabIndex={0}
          className="focus-ring relative my-4 max-w-full overflow-x-auto rounded"
        >
          <table
            className="w-full min-w-[40rem] text-sm"
            data-testid="compare-table"
          >
            <thead>
              <tr>
                <th className={TH}>Aspect</th>
                <th className={TH}>This graph</th>
                <th className={TH}>A general-purpose agent alone</th>
                <th className={TH}>
                  Both together <Proposal />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.aspect} data-aspect={r.aspect}>
                  <th scope="row" className={`${TD} text-left font-semibold`}>
                    {r.aspect}
                  </th>
                  <td className={TD}>{r.graph}</td>
                  <td className={TD}>{r.general}</td>
                  <td className={TD}>{r.both}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300">
          <strong>The recommended pattern</strong> <Proposal />: expose the
          graph as a tool, for example <code>run_dse(spec)</code> over the Model
          Context Protocol, with its budget, its gates and its labelled report.
          The general-purpose agent turns an engineer&apos;s request into a
          spec, calls the tool, reads the report, and writes the new families,
          generators and cost models the graph does not yet have, which the
          graph&apos;s checks then verify.
        </p>
      </section>

      <section
        aria-labelledby="deploy-h"
        className="mt-10"
        data-testid="deploy"
      >
        <h2 id="deploy-h" className="text-2xl font-semibold tracking-tight">
          How it would be deployed <Proposal />
        </h2>
        <p className="mt-3 text-neutral-700 dark:text-neutral-300">
          A container next to the company&apos;s EDA farm. Jobs go to the
          farm&apos;s existing scheduler (Slurm or LSF) and draw licences from
          its licence server. The LLM is an open-weights model on an on-prem
          server (vLLM or Ollama), or an enterprise API under the company&apos;s
          data terms. The step-through below marks what exists today.
        </p>
        <DeploymentFlow />
        <div
          role="region"
          aria-label="What exists and what is proposed"
          tabIndex={0}
          className="focus-ring relative my-4 max-w-full overflow-x-auto rounded"
        >
          <table className="w-full text-sm" data-testid="deploy-table">
            <thead>
              <tr>
                <th className={TH}>Part</th>
                <th className={TH}>In the repository today</th>
                <th className={TH}>Proposed for a team</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  [
                    "Triggering",
                    <>
                      the CLI, <code>hw-dse run</code> /{" "}
                      <code>hw-dse resume</code>
                    </>,
                    "a spec change on a pull request starts a run; the report lands on the PR",
                  ],
                  [
                    "Front end",
                    "none (the CLI)",
                    "a general-purpose agent calling run_dse as an MCP tool",
                  ],
                  [
                    "LLM",
                    "providers for hosted APIs and Ollama; recorded runs via OpenRouter",
                    "open weights on an on-prem server (vLLM or Ollama), or an enterprise API",
                  ],
                  [
                    "State",
                    "a SQLite checkpointer per run; an in-memory LangGraph Store for a fleet",
                    "Postgres for the checkpointer and a shared Store",
                  ],
                  [
                    "Human approval",
                    <>
                      two <code>interrupt()</code> gates, answered in the CLI
                    </>,
                    "the same gates in a web UI or chat",
                  ],
                  [
                    "Tools",
                    "Verilator, Icarus, SymbiYosys, Yosys, nextpnr, OpenSTA; Vivado on one machine",
                    "jobs on the farm's scheduler, licences from its licence server; commercial flows behind adapters",
                  ],
                  [
                    "Budgets and audit",
                    "evaluation budgets and round caps in code; the eval harness stops before a spend cap; every LLM call traced, keys redacted",
                    "secrets in a vault; trace logs in the company's log store",
                  ],
                  [
                    "Drift",
                    "measured, arms compared within a session",
                    "model snapshots pinned; a reference set re-run each session",
                  ],
                ] as [string, ReactNode, string][]
              ).map(([part, now, next]) => (
                <tr key={part} data-part={part}>
                  <th scope="row" className={`${TD} text-left font-semibold`}>
                    {part}
                  </th>
                  <td className={TD}>{now}</td>
                  <td className={TD}>{next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="next-h" className="mt-10" data-testid="improve">
        <h2 id="next-h" className="text-2xl font-semibold tracking-tight">
          How it could be improved
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div
            className="rounded-lg border border-neutral-300 p-4 dark:border-neutral-700"
            data-lane="done"
          >
            <h3 className="font-semibold">Done after M4</h3>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              The local Vivado run: <code>high_precision</code>&apos;s m=8
              misses 50 MSPS at its own 20 ns clock ({V_("v4.m8.synth", "f2")}{" "}
              post-synthesis, {V_("v4.m8.route", "f2")} post-route), so m=6
              stays; the per-family-class path factor was rejected by its
              pre-set rule; the first measured FPGA power (vectorless) ranks
              designs as the index does (Spearman{" "}
              {V_("v4.power.spearman_synth", "f3")}) but is off by{" "}
              {V_("v4.power.rms_synth", "f1")}% RMS.
              <Ev to="/results#vivado">results</Ev>
            </p>
          </div>
          <div
            className="rounded-lg border border-neutral-300 p-4 md:col-span-2 dark:border-neutral-700"
            data-lane="repo"
          >
            <h3 className="font-semibold">
              Next, in the repository&apos;s own words
            </h3>
            <ol className="ml-5 mt-2 list-decimal space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
              {steps.map((s) => (
                <li key={s.slice(0, 40)}>
                  <Inline text={s} />
                </li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              From{" "}
              <a
                href={agentFile("docs/WRITEUP.md", site.vendored.commit)}
                className={A}
              >
                docs/WRITEUP.md at {COMMIT}
              </a>
              , &ldquo;What I would do next&rdquo;. Plans, with no results.
            </p>
          </div>
        </div>
        <div
          className="mt-4 rounded-lg border border-dashed border-neutral-400 p-4 dark:border-neutral-600"
          data-lane="team"
        >
          <h3 className="font-semibold">
            What a hardware team would add <Proposal />
          </h3>
          <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
            <li>
              A plug-in registry API, so a team can add IP blocks (FIR, FFT,
              NTT, …) with their golden models, generators and cost models.
            </li>
            <li>
              Adapters for commercial flows behind the same measured-points
              schema, so their numbers carry the same provenance.
            </li>
            <li>
              Real place and route, and activity-based power from simulated
              switching (SAIF/VCD) instead of vectorless or toggle-rate power.
            </li>
            <li>
              Composition of several blocks into one system spec, explored
              together.
            </li>
            <li>
              Multi-fidelity or Bayesian search as a further baseline, so the
              LLM is measured against a stronger optimiser too.
            </li>
            <li>
              The graph as an MCP tool, <code>run_dse</code>, for a
              general-purpose agent to call.
            </li>
          </ul>
        </div>
      </section>

      <p className="mt-10 text-sm text-neutral-600 dark:text-neutral-400">
        Everything above about this agent is true of{" "}
        <a href={AGENT_REPO} className={A}>
          HW_Design_Space_Agent
        </a>{" "}
        at {COMMIT}; the deployment and the improvements are proposals. See the{" "}
        <Link href="/results" className={A}>
          results
        </Link>
        , the{" "}
        <Link href="/writeup" className={A}>
          write-up
        </Link>{" "}
        and the{" "}
        <Link href="/record" className={A}>
          project record
        </Link>
        .
      </p>
    </article>
  );
}
