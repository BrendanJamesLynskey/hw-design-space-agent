"use client";

/**
 * The LangGraph graph as a trace replay: the repository's nodes light up in the order one
 * recorded run went through them, the LLM's structured decisions are quoted as they were
 * returned, and the token and dollar counters tick from the provider-reported usage of each
 * call. Every state comes from traceFrames() over the run's exported file.
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Stat } from "@/components/ui/Controls";
import { traceCaption } from "@/lib/dse/captions";
import { site } from "@/lib/dse/data";
import { traceFrames, visited, type Node } from "@/lib/dse/trace";
import { fmtInt, fmtUsd } from "@/lib/format";

import { useRun } from "./useRun";

const NODE_INFO: Record<Node, { who: "code" | "LLM" | "human"; what: string }> =
  {
    intake: { who: "code", what: "YAML → validated Spec (LLM only for prose)" },
    confirm_spec: { who: "human", what: "interrupt(): approve, edit, reject" },
    propose: { who: "LLM", what: "families and ranges (ExplorationPlan)" },
    explore_family: {
      who: "code",
      what: "Send: one NSGA-II study per family, in parallel",
    },
    analyse: {
      who: "LLM",
      what: "code: front, HV, hard rules; LLM: next step (AnalysisDecision)",
    },
    select: { who: "human", what: "interrupt(), or the spec's rule" },
    back_annotate: {
      who: "code",
      what: "L5 (M2 graph): estimate against measured, winner check",
    },
    report: { who: "code", what: "report.md, evaluations.csv, trace" },
  };

const ORDER: Node[] = [
  "intake",
  "confirm_spec",
  "propose",
  "explore_family",
  "analyse",
  "select",
  "back_annotate",
  "report",
];

const WHO_CLS = {
  code: "border-sky-700 text-sky-800 dark:border-sky-400 dark:text-sky-300",
  LLM: "border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-300",
  human:
    "border-purple-700 text-purple-800 dark:border-purple-300 dark:text-purple-300",
};

export default function TraceReplay(): JSX.Element {
  const hero = site.hero;
  const heroIndex = site.runs.find((r) => r.id === hero.id)!;
  const { run, controls } = useRun({
    ms: heroIndex.milestone,
    spec: heroIndex.spec,
    model: heroIndex.model,
    seed: heroIndex.seed,
  });
  const frames = useMemo(() => (run ? traceFrames(run) : []), [run]);
  const stepper = useStepper(Math.max(1, frames.length), {
    stepMs: 1600,
    resetKey: run?.id ?? "loading",
  });
  const f = frames[stepper.step];
  const spec = run ? site.specs[run.spec]! : null;
  const caption =
    run && f && spec ? traceCaption(f, run, spec) : "Loading the run…";
  const seen = f ? visited(frames, stepper.step) : new Set<Node>();
  const call = run && f && f.call !== null ? run.calls[f.call]! : null;
  const jobs =
    f && f.kind === "explore"
      ? f.jobs
      : run && f && f.round > 0
        ? run.rounds[f.round - 1]!.jobs
        : [];

  return (
    <AnimationPanel
      title="The graph, replayed from a recorded trace"
      summary={
        <>
          {run
            ? `${run.label} (${run.model_id}, reasoning: ${run.reasoning}) on ${run.spec}, ${run.milestone.toUpperCase()} seed ${run.seed}: ${run.calls.length} LLM calls from its llm_trace.jsonl.`
            : "Loading…"}{" "}
          Each LLM node is one recorded call; the counters add up its
          provider-reported usage.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={caption}
      testId="trace-widget"
      visual={
        <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,19rem)_1fr]">
          <ol aria-label="The LangGraph nodes" className="min-w-0 space-y-1.5">
            {ORDER.map((n) => {
              const active = f?.node === n;
              const done = !active && seen.has(n);
              const info = NODE_INFO[n];
              return (
                <li
                  key={n}
                  data-node={n}
                  data-active={active ? "true" : "false"}
                  className={`min-w-0 rounded border px-2 py-1 text-xs ${
                    active
                      ? "border-accent bg-indigo-50 ring-2 ring-accent dark:border-indigo-300 dark:bg-indigo-950/40 dark:ring-indigo-300"
                      : done
                        ? "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                        : "border-dashed border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  <span className="flex min-w-0 flex-wrap items-center justify-between gap-1">
                    <span className="font-mono font-medium">{n}</span>
                    <span
                      className={`rounded border px-1 font-mono text-[0.65rem] uppercase ${WHO_CLS[info.who]}`}
                    >
                      {info.who}
                    </span>
                  </span>
                  <span className="block">{info.what}</span>
                  {n === "explore_family" && jobs.length > 0 && (
                    <span
                      className="mt-1 flex flex-wrap gap-1"
                      aria-label="Send fan-out"
                    >
                      {jobs.map((j) => (
                        <span
                          key={j.family}
                          data-lane={j.family}
                          className={`rounded border px-1 font-mono ${active ? "border-accent bg-accent text-accent-fg" : "border-neutral-400"}`}
                        >
                          {j.family} ×{j.evals}
                        </span>
                      ))}
                    </span>
                  )}
                  {n === "analyse" && (
                    <span className="mt-0.5 block text-[0.7rem] text-neutral-600 dark:text-neutral-400">
                      ↺ refine / widen / add_family / map_front (M2): Send again
                      · stop: select · infeasible: report
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="min-w-0 space-y-2">
            {call ? (
              <blockquote
                data-testid="trace-call"
                tabIndex={0}
                className={`max-h-56 overflow-y-auto rounded border-l-4 bg-white px-3 py-2 text-xs text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 ${call.ok ? "border-amber-500" : "border-orange-700 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(213,94,0,0.08)_6px,rgba(213,94,0,0.08)_12px)]"}`}
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                  {call.node} · attempt {call.attempt} ·{" "}
                  {call.ok ? `decision: ${call.decision}` : "failed"}
                </span>
                <br />
                {call.ok
                  ? call.rationale ||
                    `families: ${(call.families ?? []).join(", ")}`
                  : `${call.error}: no valid answer${call.input_tokens + call.output_tokens > 0 ? "" : ", no usage reported"}.`}
              </blockquote>
            ) : f?.kind === "rule" && run ? (
              <p
                data-testid="trace-rule"
                className="rounded border-l-4 border-sky-600 bg-white px-3 py-2 text-xs dark:bg-neutral-950"
              >
                {run.rounds[f.round - 1]!.rules.join(" · ")}
              </p>
            ) : (
              <p className="rounded bg-white px-3 py-2 text-xs text-neutral-600 ring-1 ring-neutral-200 dark:bg-neutral-950 dark:text-neutral-400 dark:ring-neutral-800">
                No LLM call on this step: code (or a human) does it.
              </p>
            )}
            {run &&
              f &&
              f.round > 0 &&
              (run.rounds[f.round - 1]!.plan_by_code ? (
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Round {f.round} was planned by code, not the LLM: &ldquo;
                  {run.rounds[f.round - 1]!.plan_rationale}&rdquo;
                </p>
              ) : (
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Round {f.round} plan, in the LLM&apos;s words: &ldquo;
                  {run.rounds[f.round - 1]!.plan_rationale}&rdquo;
                </p>
              ))}
          </div>
        </div>
      }
      stats={
        f && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              label="LLM calls"
              value={`${f.calls}${f.failed ? ` (${f.failed} failed)` : ""}`}
            />
            <Stat
              label="Tokens in / out"
              value={`${fmtInt(f.inputTokens)} / ${fmtInt(f.outputTokens)}`}
              hint="measured"
            />
            <Stat
              label="LLM cost"
              value={fmtUsd(f.costUsd)}
              hint="measured, provider-reported"
            />
            <Stat
              label="Evaluated / met spec"
              value={`${fmtInt(f.evaluated)} / ${fmtInt(f.feasible)}`}
            />
          </div>
        )
      }
      params={controls}
    />
  );
}
