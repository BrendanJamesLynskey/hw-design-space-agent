/**
 * One recorded agent run, as scripts/export_dse.py writes it to src/data/runs/<id>.json from
 * the vendored trace directory: every LLM call (from llm_trace.jsonl, with its
 * provider-reported usage), every round (from report.md: the plan, what code measured, the
 * LLM's decision and any hard rule code applied), and every evaluation (from
 * evaluations.csv: its round, family, the spec's two objectives and whether it met the
 * spec). The export checks each against the others and against the run's summary.
 *
 * The files are loaded on demand (src/components/dse/loadRun.ts, one chunk per run), so a
 * page only carries the run shown.
 */
import { site, type Design, type RunIndex } from "./data";

export const FAMILIES = [
  "iterative",
  "unrolled_k",
  "pipelined",
  "pipelined_m",
] as const;

export type Call = {
  node: "propose" | "analyse" | "intake";
  attempt: number;
  /** false: the call failed (no valid answer); it then carries no usage. */
  ok: boolean;
  decision: string | null;
  rationale: string;
  families: string[] | null;
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  cost_usd: number;
  latency_s: number;
  /** The error's type, for a failed call. */
  error: string | null;
  /** 0 for propose; k for the analyse call(s) that close round k. */
  round: number;
};

export type Job = {
  family: string;
  evals: number;
  ranges: string;
  why: string;
};

export type Round = {
  round: number;
  plan_rationale: string;
  jobs: Job[];
  evals: number;
  total: number;
  /** Feasible evaluations so far (cumulative). */
  feasible: number;
  hv_gain_text: string;
  llm_decision: string | null;
  /** Hard rules code applied on top of the LLM's decision. */
  rules: string[];
  decision: string | null;
  /** Indices of the evaluations on the feasible Pareto front after this round (Python). */
  front: number[];
  hv: number;
  hv_frac: number | null;
  feasible_cum: number;
};

export type RunData = {
  id: string;
  run: string;
  spec: string;
  model: string;
  model_id: string;
  label: string;
  reasoning: string;
  seed: number;
  status: string;
  verdict: string;
  intake: string;
  n_evals: number;
  budget: number;
  hv_frac: number | null;
  evals_to_95: number | null;
  select_regret: number | null;
  selected: Design | null;
  selected_meets_spec: boolean;
  llm_declared_infeasible: boolean;
  llm_calls: number;
  llm_failures: number;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  wall_s: number;
  axes: [string, string];
  calls: Call[];
  rounds: Round[];
  points: {
    round: number[];
    family: number[];
    x: number[];
    y: number[];
    /** One character per evaluation: "1" if it met the spec. */
    feasible: string;
  };
};

/** The models, in the cost table's order, with their short labels. */
export const MODELS = site.costs.models.map((m) => ({
  model: m.model,
  label: m.label,
}));

/** The run of a spec, model and seed. */
export function findRun(
  spec: string,
  model: string,
  seed: number,
): RunIndex | undefined {
  return site.runs.find(
    (r) => r.spec === spec && r.model === model && r.seed === seed,
  );
}
