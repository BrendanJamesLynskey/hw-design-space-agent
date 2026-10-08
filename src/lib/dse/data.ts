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
};

export type Hero = {
  run: string;
  spec: string;
  model: string;
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
};

export type ResultRow = {
  method: string;
  label: string;
  agent: boolean;
  runs: number;
  evals_mean: number;
  hv_frac_mean: number | null;
  hv_frac_text: string | null;
  evals_to_95_text: string | null;
  regret_mean: number | null;
  regret_text: string | null;
  meets_spec: number;
  infeasibility_correct: number;
  declared_infeasible_by_llm: number | null;
};

export type ModelCost = {
  model: string;
  label: string;
  model_id: string;
  reasoning: string;
  runs: number;
  llm_calls: number;
  failed_calls: number;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  cost_per_run: number;
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
  spec: string;
  model: string;
  label: string;
  seed: number;
  status: string;
  /** Seconds after the first run started (from the run directories' UTC timestamps). */
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

export type Site = {
  vendored: { repository: string; commit: string; committed: string };
  milestones: { id: string; levels: string; status: string }[];
  ladder: Level[];
  specs: Record<string, SpecInfo>;
  ground_truth: Record<string, GroundTruth>;
  results: Record<string, ResultRow[]>;
  costs: {
    provenance: Prov;
    source: string;
    total_usd: number;
    trace_total_usd: number;
    key_usage_note: string;
    runs: number;
    models: ModelCost[];
  };
  hero: Hero;
  trace_calls: number;
  trace_runs: number;
  runs: RunIndex[];
  division_of_labour: string;
  /** Failed LLM calls per model, by error type. */
  failures: Record<string, Record<string, number>>;
  /** spec -> method (nsga2, random, or the agent's model) -> its row. */
  spec_tables: Record<string, Record<string, SpecTableRow>>;
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

/** The evaluation date of the recorded runs (every model's runs share it). */
export const RUN_DATE = site.costs.models[0]!.dates[0]!;
