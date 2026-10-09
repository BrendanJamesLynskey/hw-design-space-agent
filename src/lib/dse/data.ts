/**
 * The site's data, typed: everything scripts/export_dse.py writes from the vendored results
 * of HW_Design_Space_Agent (and checks against the repo's own results.md).
 */
import SITE from "@/data/site.json";
import WHY from "@/data/why.json";

export type Prov = "exact" | "estimate" | "measured";

export type Design = {
  key: string;
  family: string;
  params: Record<string, number | string>;
  luts: number;
  ffs: number;
  luts_plus_ffs: number;
  fmax_mhz: number;
  throughput_msps: number;
  latency_cycles: number;
  power_index: number;
  max_abs_err: number;
  accuracy_bits: number;
};

export type Level = {
  id: string;
  name: string;
  milestone: string;
  repo_level: string | null;
  what: string;
  ppa: string;
  check: string;
  status: "live" | "in progress" | "planned";
  plan_only: boolean;
};

export type HeroRound = {
  round: number;
  evals: number;
  feasible: number;
  cumulative_evals: number;
  cumulative_feasible: number;
  front_size: number;
  families: Record<string, number>;
  /** An M2 front-mapping round: code planned it (NSGA-II over the front families' ranges). */
  by_code: boolean;
  /** Whether the LLM was asked about this round (code's final front-mapping round: no). */
  llm_call: boolean;
};

export type Decision = {
  node: string;
  decision: string | null;
  rationale: string;
  families: string[] | null;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  latency_s: number;
  /** 0 for propose; k for the analyse call that closes round k. */
  round: number;
};

/** The run's own L5 node (M2 reports): estimate → measured, and its winner check. */
export type BackAnnotation = {
  compared: boolean;
  tool?: string;
  /** [estimate, measured, error %] */
  luts?: [number, number, number];
  ffs?: [number, number, number];
  fmax_mhz?: [number, number, number];
  measured_front?: number;
  front?: number;
  verdict?: string;
  note?: string;
};

export type Hero = {
  run: string;
  id: string;
  milestone: MsKey;
  spec: string;
  /** The OpenRouter model ID. */
  model: string;
  label: string;
  seed: number;
  status: string;
  n_families: number;
  n_designs: number;
  rounds: HeroRound[];
  /** One character per evaluation, in order: "1" if the design met the spec. */
  feasible_bits: string;
  /** The evaluation that produced the selected design. */
  selected_index: number;
  decisions: Decision[];
  selected: Design;
  select_regret: number;
  hv_frac: number;
  llm_calls: number;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  wall_s: number;
  back_annotation: BackAnnotation;
  min_msps: number;
};

export type MsKey = "m1" | "m2";

export type ResultRow = {
  method: string;
  label: string;
  agent: boolean;
  runs: number;
  evals_mean: number;
  evals_text: string;
  hv_frac_mean: number | null;
  hv_frac_std: number | null;
  hv_frac_text: string | null;
  evals_to_95_text: string | null;
  regret_mean: number | null;
  regret_std: number | null;
  regret_text: string | null;
  optimal: number;
  meets_spec: number;
  infeasibility_correct: number;
  declared_infeasible_by_llm: number | null;
  /** M2: mean front-mapping rounds per run. */
  coverage_rounds_mean: number | null;
};

export type ModelCost = {
  model: string;
  label: string;
  model_id: string;
  /** The model IDs the provider reported serving. */
  served: string[];
  reasoning: string;
  runs: number;
  llm_calls: number;
  calls_per_run_text: string;
  failed_calls: number;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  cost_per_run: number;
  cost_per_run_std: number;
  cost_per_spec: number;
  evals: number;
  cost_per_eval: number;
  wall_s_total: number;
  wall_s_mean: number;
  wall_s_max: number;
  dates: string[];
};

export type SpecInfo = {
  name: string;
  description: string;
  constraints: { metric: string; op: string; value: number }[];
  objectives: { metric: string; direction: string; ref: number }[];
  select_by: string;
  select_direction: string;
  budget: number;
};

export type GroundTruth = {
  n_designs: number;
  n_feasible: number;
  feasible: boolean;
  hv_true: number;
  best_throughput_msps_any: number;
  selected: Design | null;
  front: Design[];
};

/** One run in the picker and on the fleet timeline (measured start and wall-clock). */
export type RunIndex = {
  id: string;
  milestone: MsKey;
  spec: string;
  model: string;
  label: string;
  seed: number;
  status: string;
  /** Seconds after its milestone's first run started (the run directories' UTC timestamps). */
  start_s: number;
  wall_s: number;
  start_utc: string;
  cost_usd: number;
  n_evals: number;
};

export type Selection = {
  seed: number;
  key: string | null;
  family: string | null;
  params: Record<string, number | string> | null;
  regret: number | null;
};

export type SpecTableRow = {
  selected: Selection[];
  input_tokens?: number;
  output_tokens?: number;
  cost_usd?: number;
  cost_per_run?: number;
  evals?: number;
  cost_per_eval?: number;
  wall_s_mean?: number;
  llm_calls?: number;
  failed_calls?: number;
};

export type Costs = {
  provenance: Prov;
  source: string;
  total_usd: number;
  runs: number;
  seeds: number;
  models: ModelCost[];
};

/** One milestone's eval: its results.md rows, costs, failures and per-spec tables. */
export type Eval = {
  seeds: number;
  results: Record<string, ResultRow[]>;
  costs: Costs;
  /** Failed LLM calls per model, by error type. */
  failures: Record<string, Record<string, number>>;
  /** spec -> method (nsga2, random, or the agent's model) -> its row. */
  spec_tables: Record<string, Record<string, SpecTableRow>>;
  trace_calls: number;
  trace_runs: number;
  /** The runs' UTC dates, YYYYMMDD. */
  dates: string[];
};

export type Stat = { mean: number; std: number; n: number };

/** results.md's "M1 vs M2 at a glance", per feasible spec and method: [M1, M2]. */
export type GlanceRow = {
  hv_frac: [Stat, Stat];
  select_regret: [Stat, Stat];
  n_evals: [Stat, Stat];
  hv_vs_nsga2?: [number, number];
  hv_vs_nsga2_text?: [string, string];
};

export type Glance = {
  models: string[];
  specs: Record<string, Record<string, GlanceRow>>;
  hv_ratio_m2: [number, number];
  regret_beats_nsga2_m2: number;
  regret_cells: number;
  regret_losses_m2: { spec: string; model: string }[];
  /** M2: [runs where the LLM chose map_front, feasible-spec runs], per model. */
  map_front_runs: Record<string, [number, number]>;
  infeasible: Record<
    string,
    { correct: number; runs: number; evals_text: string }[]
  >;
};

export type Spend = {
  provenance: Prov;
  m1: { provider_usd: number; trace_usd: number; key_usd_approx: number };
  m2: {
    provider_usd: number;
    pilot_usd: number;
    trace_usd: number;
    runs: number;
    pilot_runs: number;
    key_before_usd: number;
    key_after_usd: number;
    key_usd: number;
    key_before_ts: string;
    key_after_ts: string;
    cap_usd: number;
  };
  key_usage_note: string;
};

export type Site = {
  vendored: { repository: string; commit: string; committed: string };
  milestones: { id: string; levels: string; status: string }[];
  /** Every row of the README's roadmap table (follow-up rows included). */
  roadmap: { id: string; levels: string; status: string }[];
  ladder: Level[];
  specs: Record<string, SpecInfo>;
  ground_truth: Record<string, GroundTruth>;
  evals: Record<MsKey, Eval>;
  glance: Glance;
  spend: Spend;
  hero: Hero;
  runs: RunIndex[];
  division_of_labour: string;
  trace_calls: number;
};

export type ClimbStep = Design & {
  move: string;
  feasible: boolean;
  meets_accuracy: boolean;
};

export type HillClimb = {
  spec: string;
  err_max: number;
  accuracy_bits_min: number;
  throughput_min: number;
  path: ClimbStep[];
  iterative_ceiling: Design;
  iterative_designs: number;
};

export const site = SITE as unknown as Site;
export const why = WHY as unknown as { hill_climb: HillClimb };

export const SPEC_ORDER = [
  "dds_250msps",
  "low_area_control",
  "high_precision",
  "infeasible_dds_400msps",
] as const;

/** The vendored commit, short. */
export const COMMIT = site.vendored.commit.slice(0, 7);

export const MILESTONES = ["m2", "m1"] as const;
export const MS_LABEL: Record<MsKey, string> = { m1: "M1", m2: "M2" };

/** A milestone's eval. */
export const ev = (ms: MsKey): Eval => site.evals[ms];

/** The evaluation date of a milestone's recorded runs (every model's runs share it). */
export const runDate = (ms: MsKey): string =>
  site.evals[ms].costs.models[0]!.dates[0]!;

/** The runs of one milestone. */
export const runsOf = (ms: MsKey): RunIndex[] =>
  site.runs.filter((r) => r.milestone === ms);
