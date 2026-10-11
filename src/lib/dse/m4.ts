/**
 * Milestone 4, typed: src/data/m4.json (scripts/export_m4.py; every row checked against the
 * repo's results.md, the write-up and the README), and the states of its animations as pure
 * functions:
 *
 * - asicFrames: FPGA against ASIC on the three ASIC specs and their FPGA twins, from the
 *   exhaustive ground truth: the family ranking (the same on both targets), then the
 *   pipelining-depth sweep of each target's winner (every m, the same numerics), whose best
 *   feasible m is the ground truth's winner (m=3 vs m=7; m=2 vs m=5);
 * - heldFrames: the 9 held-out sky130 designs, measured against the model's estimate;
 * - deadlineCaption: the asic_multiaxis_control winner's control loop at its estimated and its
 *   measured clock (the frames are m3's sysFrames: the same system-replay animation);
 * - fleetFrames: one real fleet run (members, the shared Store, the lessons, the phase-2 split
 *   and warm start, the merge), then the paired A/B, pair by pair.
 */
import M4 from "@/data/m4.json";

import { fmtInt, fmtUsd, trim } from "../format";

type Stat = { mean: number; std: number; n: number };

export type CalRow = {
  family: string;
  n: number;
  in: Record<string, number>;
  loo: Record<string, number>;
};

export type SweepPoint = {
  m: number;
  key: string;
  select: number;
  fmax_mhz: number;
  throughput_msps: number;
  p99_us?: number;
  feasible: boolean;
};

export type FamilyBest = {
  family: string;
  asic_key: string | null;
  asic: number | null;
  asic_ratio: number | null;
  fpga_key: string | null;
  fpga: number | null;
  fpga_ratio: number | null;
};

export type AsicSpec = {
  name: string;
  description: string;
  select_by: string;
  twin_select_by: string;
  constraints: { metric: string; op: string; value: number }[];
  n_designs: number;
  n_feasible: number;
  twin_n_feasible: number;
  winner: string;
  winner_value: number;
  winner_m: number | null;
  twin_winner: string;
  twin_value: number;
  twin_m: number | null;
  ranking: string[];
  twin_ranking: string[];
  ranking_differs: boolean;
  families: FamilyBest[];
  sweeps: { asic: SweepPoint[]; fpga: SweepPoint[] } | null;
  l1_bound_feasible?: number;
  l1_bound_winner?: string;
  l1_bound_value?: number;
};

export type HeldRow = {
  key: string;
  family: string;
  m: number | null;
  area_meas: number;
  area_est: number;
  area_err: number;
  fmax_meas: number;
  fmax_est: number;
  fmax_err: number;
  power_mw: number;
  meets: Record<string, boolean>;
  p99_measured_clock_us: number | null;
};

export type TickDesign = {
  view: string;
  clock?: string;
  key: string;
  family?: string;
  m: number | null;
  area_um2?: number;
  luts_plus_ffs?: number;
  fmax_mhz: number;
  period_ns: number;
  latency: number;
  ii: number;
  bound_us: number;
  p99_us: number;
  batches_ns: number[];
  p99_tick: number;
  accept_ns: number[];
  result_ns: number[];
  meets: boolean;
  bound_meets: boolean;
};

export type Deadline = {
  spec: string;
  tick_ns: number;
  requests: number;
  n_ticks: number;
  limit_us: number;
  designs: TickDesign[];
};

export type AbRow = {
  model: string;
  label: string;
  arm: "single" | "fleet" | "fleet_v2";
  runs: number;
  specs: string[];
  hv: Stat;
  regret: Stat;
  evals_min: number;
  input_tokens: Stat;
  output_tokens: Stat;
  cost_usd: Stat;
  wall_s: Stat;
  failures: number;
  failed_calls: number;
  designs_per_hour: number;
  cost_per_spec: number;
  proj_designs_day: number;
  proj_specs_day: number;
  proj_cost_day: number;
};

export type Test = {
  n: number;
  pos: number;
  neg: number;
  sign_p: number;
  mean: number;
  t: number;
  t_p: number;
};

export type AbTest = {
  model: string;
  label: string;
  arm: "fleet" | "fleet_v2" | "fix_effect";
  hv_frac: Test;
  select_regret: Test;
};

export type Pair = { spec: string; seed: number; d: number };

export type FleetMember = {
  member: string;
  families: string[];
  phase: number;
  budget: number;
  status: string;
  rounds: number;
  decisions: string[];
  llm_declared_infeasible: boolean;
  n_evals: number;
  wall_s: number;
  cost_usd: number;
};

/** One evaluation: [family index, feasible 0/1, selection metric or null, on the final front 0/1]. */
export type FleetEval = [number, number, number | null, number];

export type FleetRun = {
  arm: string;
  model: string;
  spec: string;
  seed: number;
  select_by: string;
  budget: number;
  members: FleetMember[];
  lanes: { member: string; phase: number; evals: FleetEval[] }[];
  lessons: Record<
    string,
    {
      member: string;
      evaluations: number;
      feasible: number;
      on_merged_front: number;
      merged_front_size: number;
      [k: string]: number | string | null;
    }
  >;
  phase2_budgets: Record<string, number>;
  front1_share: Record<string, number>;
  seeds: Record<string, string[]>;
  distinct_after_p1: number;
  distinct: number;
  front_size: number;
  selected: string;
  selected_value: number;
  true_winner: string;
  true_value: number;
  regret: number;
  hv_frac: number;
  cost_usd: number;
  wall_s: number;
  llm_calls: number;
};

export type Feedback = {
  recorded: [number, number];
  live: [number, number];
  l1_bound_feasible: number;
  sim_feasible: number;
  fired: [number, number];
  recovered: [number, number];
  regret: [number, number];
  uncorrected: [number, number];
  table: {
    search: string;
    l1_feasible: number;
    pass_l2: number;
    fires: boolean;
    corrected: string;
    uncorrected: string;
  }[];
  v1: { fired: [number, number]; floor_msps: number };
  burst: number;
  rate_msps: number;
  floor_msps: number;
  p99_us: number;
  rounds: number;
  evals_per_round: number;
};

export type M4Data = {
  calibration: {
    id: string;
    n_points: number;
    per_family: Record<string, number>;
    rows: CalRow[];
    tool: string;
    library: string;
    corner: string;
    clock_ns: number;
    t_bit_ns: number | null;
    alternatives: Record<string, number>;
  };
  ground_truth: {
    cost_model: string;
    fpga_cost_model: string;
    specs: AsicSpec[];
  };
  held_out: {
    rows: HeldRow[];
    area_within_5: number;
    fmax_err_min: number;
    fmax_err_max: number;
    optimistic: number;
    optimistic_over_1pct: number;
    optimistic_min_over_1pct: number;
  };
  deadline: Deadline;
  asic_eval: {
    cells: Record<
      string,
      Record<string, Record<string, Partial<Stat> & { text: string }>>
    >;
    models: {
      model: string;
      label: string;
      runs: number;
      meets: number;
      l2_changed: number;
      ba_flags: number;
      cost_usd: number;
      wall_s: Stat;
      input_tokens: Stat;
      calls: number;
    }[];
    meets: number;
    runs: number;
    baselines_meet: number;
    baseline_runs: number;
  };
  ab: {
    specs: string[];
    rows: AbRow[];
    tests: AbTest[];
    pairs: Record<string, { hv_frac: Pair[]; select_regret: Pair[] }>;
    per_spec: {
      spec: string;
      model: string;
      arm: string;
      hv: (Stat | null)[];
      regret: (Stat | null)[];
    }[];
    behaviour: {
      model: string;
      arm: string;
      phase2_all_pipelined: number;
      runs: number;
      fsm_declared_infeasible: number;
      store_distinct: Stat;
    }[];
    cost_ratio: Record<string, number>;
    when: Record<string, [string, string]>;
    sonnet_specs: string[];
  };
  fleet_run: FleetRun;
  feedback: Feedback;
  spend: {
    ledger: { entry: string; runs: number; usd: number }[];
    ledger_total_usd: number;
    ledger_entries: number;
    key_start_usd: number;
    key_first_usd: number;
    key_end_usd: number;
    key_first_pass_usd: number;
    key_rerun_usd: number;
    key_usd: number;
    cap_usd: number;
    limit_usd: number;
    snapshots: { name: string; ts: string; usd: number }[];
    by_arm: Record<string, number>;
    pilots_usd: number;
    trace_usd: number;
    trace_calls: number;
    trace_runs: number;
    models_checked: { ts: string; listed: number; models: string[] };
  };
  untouched: {
    results_prefix_sha256: string;
    ledger_prefix_entries: number;
    m2_replays: number;
    m3_structured_runs: number;
  };
  writeup: { words: number; sha256: string };
};

export const m4 = M4 as unknown as M4Data;

export const FAMILIES = ["iterative", "unrolled_k", "pipelined", "pipelined_m"];

export const asicSpec = (name: string): AsicSpec =>
  m4.ground_truth.specs.find((s) => s.name === name)!;

/** A spec's families in its ASIC ranking order (best first), then any with nothing feasible. */
export const rankedFamilies = (s: AsicSpec): FamilyBest[] => [
  ...s.ranking.map((f) => s.families.find((x) => x.family === f)!),
  ...s.families.filter((x) => !s.ranking.includes(x.family)),
];

/** "pipelined_m:data_width=17,n_iter=14,…,m=3" → "pipelined_m W=17 N=14 m=3". */
export function shortKey(key: string): string {
  const [fam, rest = ""] = key.split(":");
  const p = Object.fromEntries(rest.split(",").map((kv) => kv.split("=")));
  const parts = [`W=${p.data_width}`, `N=${p.n_iter}`];
  if (p.k) parts.push(`k=${p.k}`);
  if (p.m) parts.push(`m=${p.m}`);
  return `${fam} ${parts.join(" ")}`;
}

const pct1 = (x: number) =>
  `${x >= 0 ? "+" : "−"}${Math.abs(x * 100).toFixed(1)}%`;

// ---------------------------------------------------------------------------
// FPGA against ASIC: the ranking, then the pipelining depth
// ---------------------------------------------------------------------------

export type AsicPhase = "rank" | "sweep" | "pick" | "summary";

export type AsicFrame = {
  spec: string;
  phase: AsicPhase;
  /** Families (rank) or depths (sweep) shown so far. */
  shown: number;
};

export function asicFrames(specs: AsicSpec[]): AsicFrame[] {
  const out: AsicFrame[] = [];
  for (const s of specs) {
    if (!s.sweeps) {
      const n = s.families.length;
      for (let k = 1; k <= n; k++)
        out.push({ spec: s.name, phase: "rank", shown: k });
      continue;
    }
    const n = s.sweeps.asic.length;
    for (let k = 1; k <= n; k++)
      out.push({ spec: s.name, phase: "sweep", shown: k });
    out.push({ spec: s.name, phase: "pick", shown: n });
  }
  out.push({ spec: specs.at(-1)!.name, phase: "summary", shown: 0 });
  return out;
}

const METRIC_UNIT: Record<string, string> = {
  area_um2: "µm²",
  luts_plus_ffs: "LUT+FF",
  power_index: "power index",
};

function sweepWord(s: AsicSpec, p: SweepPoint): string {
  return s.sweeps && p.p99_us !== undefined
    ? `p99 ${trim(p.p99_us, 3)} µs`
    : `${trim(p.throughput_msps, 3)} MSPS`;
}

export function asicCaption(f: AsicFrame, specs: AsicSpec[]): string {
  const s = specs.find((x) => x.name === f.spec)!;
  if (f.phase === "summary") {
    const pw = specs.find((x) => x.name === "asic_power_50msps")!;
    const mx = specs.find((x) => x.name === "asic_multiaxis_control")!;
    return `On all three specs the families rank in the same order on both targets (on two of them only the two pipelined families can meet the rate, so that is one pairwise comparison each). What moves is the depth inside pipelined_m: m=${pw.winner_m} on sky130 where the FPGA picks m=${pw.twin_m}, and m=${mx.winner_m} where it picks m=${mx.twin_m}. Every number here is an estimate from each target's cost model over the exhaustive ground truth.`;
  }
  if (f.phase === "rank") {
    const fam = rankedFamilies(s)[f.shown - 1]!;
    const head = `${s.name}: the cheapest feasible design of each family, as a multiple of the winner's ${METRIC_UNIT[s.select_by] ?? s.select_by} (sky130) and LUT+FF (the FPGA twin).`;
    return `${head} ${fam.family}: ${fam.asic_ratio !== null ? `${trim(fam.asic_ratio, 3)}×` : "none feasible"} on sky130, ${fam.fpga_ratio !== null ? `${trim(fam.fpga_ratio, 3)}×` : "none feasible"} on the FPGA.${f.shown === s.families.length ? ` Same order on both: ${s.ranking.join(" < ")}; the gaps are smaller on the ASIC.` : ""}`;
  }
  const sw = s.sweeps!;
  const lim =
    s.constraints.find((c) => c.metric === "sys_p99_batch_us") ??
    s.constraints.find((c) => c.metric === "throughput_msps")!;
  const limText =
    lim.metric === "sys_p99_batch_us"
      ? `p99 batch latency ≤ ${lim.value} µs (simulated)`
      : `≥ ${lim.value} MSPS`;
  if (f.phase === "sweep") {
    const a = sw.asic[f.shown - 1]!;
    const b = sw.fpga[f.shown - 1]!;
    return `${s.name} (${limText}): m=${a.m}, a pipeline register every ${a.m} rotation stages. sky130: ${trim(a.fmax_mhz, 3)} MHz, ${sweepWord(s, a)} ${a.feasible ? "✓" : "✗"}. FPGA twin: ${trim(b.fmax_mhz, 3)} MHz, ${sweepWord(s, b)} ${b.feasible ? "✓" : "✗"}. Deeper m means fewer registers but a longer combinational path.`;
  }
  const ta = sw.asic.find((p) => p.m === s.winner_m)!;
  const tf = sw.fpga.find((p) => p.m === s.twin_m)!;
  const ties = sw.fpga.filter(
    (p) => p.feasible && p.m !== s.twin_m && p.select === tf.select,
  );
  const same =
    sw.asic[0]!.key.replace(/,m=\d+$/, "") ===
    sw.fpga[0]!.key.replace(/,m=\d+$/, "");
  const what = s.select_by === "power_index" ? "power index" : "area";
  return `Of the depths that meet ${limText}, the lowest ${what} wins: m=${s.winner_m} on sky130 (${trim(ta.fmax_mhz, 3)} MHz) against m=${s.twin_m} on the FPGA (${trim(tf.fmax_mhz, 3)} MHz${ties.length ? `; m=${ties.map((p) => p.m).join(", ")} ties on ${what} and the ground truth keeps m=${s.twin_m}` : ""}). Ripple-carry adders make every rotation stage slower on sky130, so it needs a register more often.${same ? "" : ` (Each sweep keeps its own winner's other knobs: ${shortKey(s.winner).replace(/ m=\d+/, "")} on sky130, ${shortKey(s.twin_winner).replace(/ m=\d+/, "")} on the FPGA.)`}`;
}

// ---------------------------------------------------------------------------
// The held-out check
// ---------------------------------------------------------------------------

export type HeldFrame = { shown: number; summary: boolean };

export function heldFrames(rows: HeldRow[]): HeldFrame[] {
  return [
    ...rows.map((_, i) => ({ shown: i + 1, summary: false })),
    { shown: rows.length, summary: true },
  ];
}

/** Why a held-out design was synthesised: which spec's optimum it is, on which target. */
export function heldRole(row: HeldRow, specs: AsicSpec[]): string {
  const roles: string[] = [];
  for (const s of specs) {
    if (s.winner === row.key) roles.push(`${s.name} winner`);
    if (s.twin_winner === row.key) roles.push(`${s.name} FPGA twin's winner`);
    if (s.l1_bound_winner === row.key) roles.push(`${s.name} L1-bound pick`);
  }
  if (!roles.length)
    for (const s of specs)
      for (const f of s.families)
        if (f.asic_key === row.key)
          roles.push(`best ${f.family} for ${s.name}`);
  return roles.join("; ");
}

export function heldCaption(
  f: HeldFrame,
  rows: HeldRow[],
  specs: AsicSpec[],
  h: M4Data["held_out"],
): string {
  if (f.summary)
    return `All nine: area within 5% on ${h.area_within_5} of ${rows.length}; Fmax from ${pct1(h.fmax_err_min)} to ${pct1(h.fmax_err_max)}. The model is optimistic (estimate above measurement) on ${h.optimistic_over_1pct} of 9 by ${pct1(h.optimistic_min_over_1pct)} or more, and on a sixth by ${pct1(Math.min(...rows.filter((r) => r.fmax_err > 0).map((r) => r.fmax_err)))}. These nine were never fitted: the scored model stays as it is, so they remain a test.`;
  const r = rows[f.shown - 1]!;
  const meets = Object.entries(r.meets)
    .filter(([, v]) => v)
    .map(([k]) => k);
  return `${shortKey(r.key)} (${heldRole(r, specs)}): area ${fmtInt(r.area_meas)} µm² measured, ${fmtInt(r.area_est)} estimated (${pct1(r.area_err)}); Fmax ${trim(r.fmax_meas, 3)} MHz measured, ${trim(r.fmax_est, 3)} estimated (${pct1(r.fmax_err)}${r.fmax_err > 0.01 ? ", optimistic" : ""}). With the measured numbers it meets ${meets.length ? meets.join(", ") : "none of the three specs"}.`;
}

// ---------------------------------------------------------------------------
// The deadline miss (frames: m3's sysFrames over these designs)
// ---------------------------------------------------------------------------

export type ReplayFrame = {
  phase: "tick" | "drain" | "ticks" | "verdict";
  t: number;
};

export function laneName(d: TickDesign): string {
  return `${d.m ? `m=${d.m}` : (d.family ?? "")} at ${trim(d.fmax_mhz, 3)} MHz (${d.clock})`;
}

export function deadlineCaption(f: ReplayFrame, rep: Deadline): string {
  const [est, meas, plain] = rep.designs as [
    TickDesign,
    TickDesign,
    TickDesign,
  ];
  const lim = rep.limit_us;
  const us = (ns: number) => trim(ns / 1000, 4);
  switch (f.phase) {
    case "tick":
      return `asic_multiaxis_control: ${rep.requests} requests per 1 µs tick, all back within ${lim} µs (p99). The model's winner, ${shortKey(est.key)}, simulated twice: at its estimated clock (${trim(est.fmax_mhz, 3)} MHz) and at the clock sky130 synthesis measured (${trim(meas.fmax_mhz, 3)} MHz). Third lane: plain ${shortKey(plain.key)} at its measured ${trim(plain.fmax_mhz, 4)} MHz.`;
    case "drain": {
      const parts = rep.designs.map((d) => {
        const done = d.result_ns.filter((x) => x <= f.t).length;
        return done === d.result_ns.length
          ? `${laneName(d)} done at ${us(d.result_ns.at(-1)!)} µs`
          : `${laneName(d)} ${done}/${rep.requests} out`;
      });
      return `${trim(f.t, 4)} ns after the tick: ${parts.join("; ")}. The same design, a slower clock: every edge comes later, so the batch ends later.`;
    }
    case "ticks":
      return `All ${rep.n_ticks} ticks: the p99 batch latency is ${us(est.p99_us * 1000)} µs at the estimated clock and ${us(meas.p99_us * 1000)} µs at the measured one; plain pipelined ${us(plain.p99_us * 1000)} µs (simulated).`;
    case "verdict":
      return `At its estimated clock the winner meets ${lim} µs by ${((1 - est.p99_us / lim) * 100).toFixed(1)}%, less than the model's Fmax error; at the measured ${trim(meas.fmax_mhz, 3)} MHz it misses by ${((meas.p99_us / lim - 1) * 100).toFixed(1)}%. Of the nine held-out designs only plain pipelined meets the spec with measured numbers. The ASIC back-annotation flags this case; there is no ASIC re-exploration loop yet.`;
  }
}

// ---------------------------------------------------------------------------
// The fleet: one real run, then the paired A/B
// ---------------------------------------------------------------------------

export type FleetPhase =
  | "start"
  | "p1"
  | "lessons"
  | "split"
  | "seed"
  | "p2"
  | "merge"
  | "ab-hv"
  | "ab-regret";

export type FleetFrame = {
  phase: FleetPhase;
  /** Evaluations shown in each lane (index into run.lanes). */
  done: number[];
};

export function fleetFrames(run: FleetRun, steps = 10): FleetFrame[] {
  const n = run.lanes.map((l) => l.evals.length);
  const p1 = run.lanes.map((l) => l.phase === 1);
  const out: FleetFrame[] = [{ phase: "start", done: n.map(() => 0) }];
  const p1len = Math.max(...n.filter((_, i) => p1[i]));
  for (let k = 1; k <= steps; k++) {
    const upto = Math.round((p1len * k) / steps);
    out.push({
      phase: "p1",
      done: n.map((x, i) => (p1[i] ? Math.min(x, upto) : 0)),
    });
  }
  const afterP1 = n.map((x, i) => (p1[i] ? x : 0));
  out.push({ phase: "lessons", done: afterP1 });
  out.push({ phase: "split", done: afterP1 });
  out.push({ phase: "seed", done: afterP1 });
  const p2len = Math.max(0, ...n.filter((_, i) => !p1[i]));
  for (let k = 1; k <= steps; k++) {
    const upto = Math.round((p2len * k) / steps);
    out.push({
      phase: "p2",
      done: n.map((x, i) => (p1[i] ? x : Math.min(x, upto))),
    });
  }
  out.push({ phase: "merge", done: n });
  out.push({ phase: "ab-hv", done: n });
  out.push({ phase: "ab-regret", done: n });
  return out;
}

/** Evaluations written to the Store so far (every evaluation, repeats included). */
export const written = (f: FleetFrame): number =>
  f.done.reduce((a, b) => a + b, 0);

/** Feasible evaluations among those shown in one lane. */
export const feasibleIn = (run: FleetRun, lane: number, upto: number): number =>
  run.lanes[lane]!.evals.slice(0, upto).filter((e) => e[1] === 1).length;

/** The A/B rows the paired panel shows, in order: label, the pairs key, the test. */
export function abRows(): { label: string; key: string; test: AbTest }[] {
  const t = (model: string, arm: string) =>
    m4.ab.tests.find((x) => x.model === model && x.arm === arm)!;
  const Q = "qwen/qwen3.8-27b, reasoning off";
  const DS = "deepseek/deepseek-v4.1-flash";
  const S = "anthropic/claude-sonnet-5.5";
  return [
    { label: "Qwen, first fleet", key: "qwen.fleet", test: t(Q, "fleet") },
    {
      label: "Qwen, fixed fleet",
      key: "qwen.fleet_v2",
      test: t(Q, "fleet_v2"),
    },
    {
      label: "DeepSeek, first fleet",
      key: "deepseek.fleet",
      test: t(DS, "fleet"),
    },
    {
      label: "Sonnet, first fleet (1 spec)",
      key: "sonnet.fleet",
      test: t(S, "fleet"),
    },
  ];
}

export const pFmt = (p: number): string =>
  p < 0.001
    ? p.toFixed(4)
    : p < 0.01
      ? p.toFixed(3)
      : p.toFixed(p < 0.1 ? 3 : 2);

export function fleetCaption(f: FleetFrame, run: FleetRun): string {
  const fsm = run.members.find((m) => m.member === "fsm" && m.phase === 1)!;
  const pipe = run.members.find(
    (m) => m.member === "pipelined" && m.phase === 1,
  )!;
  const p2 = run.members.find((m) => m.phase === 2);
  switch (f.phase) {
    case "start":
      return `A real fleet run: ${run.model}, ${run.spec}, seed ${run.seed}, after the review fix. Code splits the families by contract class: member fsm (${fsm.families.join(", ")}) and member pipelined (${pipe.families.join(", ")}), each an unchanged structured graph with its own LLM architect. Phase 1: half the ${run.budget} evaluations, ${fsm.budget} each, in parallel.`;
    case "p1": {
      const w = written(f);
      return `Phase 1: every evaluation is written to the shared LangGraph Store as it finishes (${w} so far). fsm: ${f.done[0]} evaluated, ${feasibleIn(run, 0, f.done[0]!)} meet the spec; pipelined: ${f.done[1]} evaluated, ${feasibleIn(run, 1, f.done[1]!)} meet it.${f.done[0] === fsm.n_evals && fsm.llm_declared_infeasible ? ` The fsm member's architect declared its families infeasible (decisions: ${fsm.decisions.join(" → ")}): no FSM design reaches 50 MSPS.` : ""}`;
    }
    case "lessons": {
      const l = Object.entries(run.lessons)
        .map(
          ([fam, v]) =>
            `${fam} ${v.feasible}/${v.evaluations} feasible, ${v.on_merged_front} on the front`,
        )
        .join("; ");
      return `Between the phases, code (not an LLM) reads the Store: ${run.distinct_after_p1} distinct designs. It computes per-family lessons: ${l}. They are code-written facts; nothing an LLM wrote reaches the Store.`;
    }
    case "split": {
      const sh = Object.entries(run.front1_share)
        .map(([m, v]) => `${m} ${v}`)
        .join(", ");
      const b = Object.entries(run.phase2_budgets)
        .map(([m, v]) => `${m} ${v}`)
        .join(", ");
      return `Phase 2: the other ${run.budget / 2} evaluations go by share of the merged Pareto front (${sh} designs): ${b}. A member whose families add nothing to the front gets nothing.`;
    }
    case "seed": {
      const s = Object.entries(run.seeds)
        .filter(([, v]) => v.length)
        .map(([fam, v]) => `${v.length} ${fam}`)
        .join(" and ");
      return `The fix: each phase-2 study is warm-started from the Store, seeded with the stored front designs of its family (${s} after phase 1). Seeds are not new evaluations. Before the fix, phase 2 started cold.`;
    }
    case "p2":
      return `Phase 2: the pipelined member, warm-started, ${f.done[2] ?? 0} of ${p2?.budget ?? 0} evaluations (decisions: ${p2?.decisions.join(" → ") ?? "none"}). Everything still goes to the Store.`;
    case "merge":
      return `Merge: code takes one front over all ${run.budget} evaluations (${run.distinct} distinct designs, ${run.front_size} on the front) and the spec's rule picks ${shortKey(run.selected)}: power index ${trim(run.selected_value, 3)} against the true winner's ${trim(run.true_value, 3)}, regret +${(run.regret * 100).toFixed(1)}%, HV fraction ${trim(run.hv_frac, 3)}. ${run.llm_calls} LLM calls, ${fmtUsd(run.cost_usd)} (measured).`;
    case "ab-hv": {
      const p = m4.ab.tests.find((x) => x.model === "pooled")!.hv_frac;
      return `The A/B, pair by pair (same spec and seed, fleet − single graph). Hypervolume: dots left of zero are pairs where the fleet mapped less of the front. Pooled over the first fleets, the fleet was higher in ${p.pos} of ${p.n} pairs (sign test p = ${p.sign_p.toFixed(3)}): the single graph maps more of the front. The fix did not change that.`;
    }
    case "ab-regret": {
      const q = abRows()[1]!.test.select_regret;
      return `Regret: dots left of zero are pairs where the fleet picked the better design. The fixed Qwen fleet picked better in ${q.neg} of ${q.n} pairs (p = ${pFmt(q.sign_p)}, mean ${(q.mean * 100).toFixed(1)} points). It ran hours after the single arm, so provider drift is not ruled out; DeepSeek and Sonnet show no difference.`;
    }
  }
}
