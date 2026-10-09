/**
 * The LangGraph graph as a trace replay (How it works): the nodes of the repository's graph
 * (src/hw_dse/agent/graph.py) light up in the order one recorded run went through them. Every
 * LLM node is one recorded call (llm_trace.jsonl), with its provider-reported tokens and cost
 * ticking into the counters; every explore step is one round's Send fan-out, one branch per
 * family, with the evaluations each branch made (report.md, checked against
 * evaluations.csv); code's hard rules are shown where the report records them. M2's graph adds
 * a back_annotate node after select (L5: the selected design's estimates against any measured
 * data); M1's graph had none, so M1 runs never visit it.
 */
import type { Call, Job, RunData } from "./runs";

export const NODES = [
  "intake",
  "confirm_spec",
  "propose",
  "explore_family",
  "analyse",
  "select",
  "back_annotate",
  "report",
] as const;
export type Node = (typeof NODES)[number];

export type TraceKind =
  | "intake"
  | "confirm"
  | "llm"
  | "explore"
  | "rule"
  | "select"
  | "annotate"
  | "report";

export type TraceFrame = {
  kind: TraceKind;
  node: Node;
  /** The round in progress (0 before the first exploration). */
  round: number;
  /** The LLM call shown (index into run.calls). */
  call: number | null;
  /** The Send fan-out of this round (explore frames). */
  jobs: Job[];
  /** Cumulative counters. */
  calls: number;
  failed: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  evaluated: number;
  feasible: number;
};

export function traceFrames(run: RunData): TraceFrame[] {
  const frames: TraceFrame[] = [];
  let f: TraceFrame = {
    kind: "intake",
    node: "intake",
    round: 0,
    call: null,
    jobs: [],
    calls: 0,
    failed: 0,
    inputTokens: 0,
    outputTokens: 0,
    costUsd: 0,
    evaluated: 0,
    feasible: 0,
  };
  const push = (patch: Partial<TraceFrame>) => {
    f = { ...f, call: null, jobs: [], ...patch };
    frames.push(f);
  };
  const callFrame = (c: Call, i: number) =>
    push({
      kind: "llm",
      node: c.node === "propose" ? "propose" : "analyse",
      call: i,
      calls: f.calls + 1,
      failed: f.failed + (c.ok ? 0 : 1),
      inputTokens: f.inputTokens + c.input_tokens,
      outputTokens: f.outputTokens + c.output_tokens,
      costUsd: f.costUsd + c.cost_usd,
    });
  push({});
  push({ kind: "confirm", node: "confirm_spec" });
  run.calls.forEach((c, i) => {
    if (c.node === "propose") callFrame(c, i);
  });
  for (const r of run.rounds) {
    push({
      kind: "explore",
      node: "explore_family",
      round: r.round,
      jobs: r.jobs,
      evaluated: r.total,
      feasible: r.feasible,
    });
    run.calls.forEach((c, i) => {
      if (c.node === "analyse" && c.round === r.round) callFrame(c, i);
    });
    if (r.rules.length > 0) push({ kind: "rule", node: "analyse" });
  }
  if (run.status !== "infeasible" && run.status !== "no_feasible") {
    push({ kind: "select", node: "select" });
    if (run.milestone === "m2")
      push({ kind: "annotate", node: "back_annotate" });
  }
  push({ kind: "report", node: "report" });
  return frames;
}

/** The node a frame lights, and the ones visited before it. */
export function visited(frames: TraceFrame[], step: number): Set<Node> {
  return new Set(frames.slice(0, step + 1).map((f) => f.node));
}
