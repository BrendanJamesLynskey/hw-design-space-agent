/**
 * Milestone 3, typed: src/data/m3.json (scripts/export_m3.py, every row checked against the
 * repo's results.md and README), and the states of its two animations as pure functions:
 *
 * - sysFrames: the multiaxis_control control loop, simulated by the repository's SimPy model
 *   for the three designs the three views pick (the MSPS-only m=7, the L1-bound m=5 and the
 *   simulated m=4): one tick's 32 requests, accepted one per clock edge, against the 0.44 µs
 *   deadline; then every tick of the run and its p99;
 * - cycleFrames: the cycle model's interface, edge by edge, for the stimulus the RTL check
 *   used (a window that walks along the trace), then the 48 recorded comparisons.
 */
import M3 from "@/data/m3.json";

import { fmtInt, trim } from "../format";

export type SysDesign = {
  key: string;
  family: string;
  params: Record<string, number | string>;
  luts: number;
  ffs: number;
  luts_plus_ffs: number;
  fmax_mhz: number;
  throughput_msps: number;
  accuracy_bits: number;
  max_abs_err: number;
  latency_cycles: number;
  /** The system metrics as L1 screening sees them: an optimistic analytic bound. */
  bound: Record<string, number>;
  /** The same metrics simulated (SimPy at the design's estimated Fmax). */
  simulated: Record<string, number>;
  feasible_simulated: boolean;
  feasible_bound: boolean;
};

export type SysSpec = {
  name: string;
  eval: boolean;
  system: string;
  kind: string;
  description: string;
  constraints: { metric: string; op: string; value: number }[];
  offered_rate_msps: number;
  n_designs: number;
  n_feasible: number;
  n_feasible_l1_bound: number;
  n_feasible_msps_only: number;
  winner_changes: boolean;
  true: SysDesign;
  bound: SysDesign;
  msps_only: SysDesign;
  peak_rate?: {
    requests: number;
    within_us: number;
    floor_msps: number;
    n_feasible: number;
    winner: string;
    winner_luts_plus_ffs: number;
  };
};

export type View = "msps_only" | "bound" | "true";

export type ReplayDesign = {
  view: View;
  key: string;
  m: number;
  luts_plus_ffs: number;
  fmax_mhz: number;
  period_ns: number;
  latency: number;
  ii: number;
  bound_us: number;
  p99_us: number;
  batch_min_us: number;
  batch_max_us: number;
  /** Every tick's batch latency (tick to its last result), ns. */
  batches_ns: number[];
  p99_tick: number;
  /** The p99 tick's requests: accepting edge and result time, ns after the tick. */
  accept_ns: number[];
  result_ns: number[];
  meets: boolean;
  bound_meets: boolean;
};

export type SystemReplay = {
  spec: string;
  tick_ns: number;
  requests: number;
  n_ticks: number;
  limit_us: number;
  designs: ReplayDesign[];
};

export type CycleRun = {
  simulator: string;
  version: string;
  seed: number;
  edges: number;
  accepts: number;
  results: number;
  ready_mismatches: number;
  valid_mismatches: number;
  data_mismatches: number;
};

export type CycleDesign = {
  key: string;
  family: string;
  latency: number;
  ii: number;
  seeds: { seed: number; edges: number }[];
  runs: CycleRun[];
};

export type Wave = {
  key: string;
  family: string;
  latency: number;
  ii: number;
  seed: number;
  edges_total: number;
  /** One character per clock edge from reset: "1" high. */
  valid_in: string;
  ready: string;
  accepted: string;
  valid_out: string;
};

export type Cycle = {
  traces: number;
  edges: number;
  simulators: string[];
  angles_per_trace: number;
  passed: number;
  designs: CycleDesign[];
  waves: Wave[];
};

export type M3Row = {
  method: string;
  label: string;
  agent: boolean;
  runs: number;
  hv: Stat;
  hv_text: string;
  regret: Stat;
  regret_text: string;
  optimal: number;
  evals_to_95_text: string;
  meets_spec: number;
  l2_changed: number | null;
  selected: { seed: number; key: string; regret: number }[];
};

export type Stat = { mean: number; std: number; n: number };

export type AbCell = {
  structured: Stat | null;
  campaign: Stat | null;
  structured_text: string;
  campaign_text: string;
};

export type AbCost = {
  model: string;
  label: string;
  specs: string[];
  /** [structured, campaign] */
  runs: [number, number];
  input_tokens: [Stat, Stat];
  output_tokens: [Stat, Stat];
  cost_usd: [Stat, Stat];
  wall_s: [Stat, Stat];
  failures: [number, number];
  cost_ratio: number;
  input_ratio: number;
};

export type CampaignRun = {
  model: string;
  spec: string;
  seed: number;
  ladder: string[];
  dse_evals: number[];
  failed: boolean;
  error: string | null;
  l2_changed: boolean;
  hv_frac: number | null;
  regret: number | null;
  model_calls: number;
  cost_usd: number;
};

export type Ab = {
  models: string[];
  labels: Record<string, string>;
  specs: string[];
  cells: Record<
    "hv_frac" | "select_regret" | "n_evals",
    Record<string, Record<string, AbCell>>
  >;
  costs: AbCost[];
  /** Mean of the per-spec means over the feasible specs the campaign arm ran. */
  pooled: Record<
    string,
    { specs: string[]; hv: [number, number]; regret: [number, number] }
  >;
  l2_reselect: {
    structured: [number, number];
    campaign: [number, number];
    campaign_runs: { model: string; spec: string; seed: number }[];
  };
  ladder: Record<string, number>;
  tools: Record<string, number>;
  single_run_dse: number;
  campaigns: number;
  runs: CampaignRun[];
};

export type MemoryRow = {
  model: string;
  spec: string;
  position: number;
  seeds: number[];
  /** [off, on] */
  hv_frac: [Stat, Stat];
  select_regret: [Stat, Stat];
  cost_usd: [Stat, Stat];
};

export type LeverRow = {
  driver: string;
  spec: string;
  runs: number;
  hv: [string, string];
  regret: [string, string];
  changed: number;
};

export type M3Spend = {
  ledger: { entry: string; runs: number; usd: number }[];
  ledger_total_usd: number;
  ledger_entries: number;
  structured_usd: number;
  campaign_usd: number;
  memory_on_usd: number;
  pilots_usd: number;
  key_start_usd: number;
  key_end_usd: number;
  key_start_ts: string;
  key_end_ts: string;
  key_usd: number;
  cap_usd: number;
  snapshots: { name: string; ts: string; usd: number }[];
  trace_usd: number;
  /** Ledger entries of runs interrupted or lost and re-run (not in the archived traces). */
  rerun_usd: number;
  rerun_entries: number;
  trace_calls: number;
  trace_runs: number;
  models_checked: { ts: string; models: string[] };
};

export type M3Data = {
  ground_truth: { specs: SysSpec[]; n_tuples: number };
  system_replay: SystemReplay;
  cycle: Cycle;
  structured: Record<string, M3Row[]>;
  ab: Ab;
  memory: {
    model: string;
    label: string;
    sequence: string[];
    rows: MemoryRow[];
    store_seeds: number;
  };
  levers: {
    "fix-all": LeverRow[];
    fix: LeverRow[];
    replay: { identical: number; runs: number; architect_inputs: number };
  };
  spend: M3Spend;
};

export const m3 = M3 as unknown as M3Data;

/** A system spec by name. */
export const sysSpec = (name: string): SysSpec =>
  m3.ground_truth.specs.find((s) => s.name === name)!;

export const VIEW_LABEL: Record<View, string> = {
  msps_only: "MSPS-only view",
  bound: "L1 bound",
  true: "simulated (L2)",
};

// ---------------------------------------------------------------------------
// The system replay: multiaxis_control, one tick, then every tick
// ---------------------------------------------------------------------------

export type SysPhase = "tick" | "drain" | "ticks" | "verdict";

export type SysFrame = {
  phase: SysPhase;
  /** ns after the tick (the time cursor), for "tick" and "drain". */
  t: number;
};

/** The time steps of the one-tick replay: every `step` ns until the slowest design is done. */
export function sysFrames(rep: SystemReplay, step = 40): SysFrame[] {
  const end = Math.max(...rep.designs.map((d) => d.result_ns.at(-1)!));
  const out: SysFrame[] = [{ phase: "tick", t: 0 }];
  for (let t = step; t < end + step; t += step)
    out.push({ phase: "drain", t: Math.min(t, Math.ceil(end)) });
  out.push({ phase: "ticks", t: Math.ceil(end) });
  out.push({ phase: "verdict", t: Math.ceil(end) });
  return out;
}

export type Lane = {
  /** Requests still waiting in the input FIFO (arrived at the tick, not yet accepted). */
  queued: number;
  /** Accepted, result not out yet. */
  inFlight: number;
  done: number;
  /** The batch is complete: every result is out. */
  complete: boolean;
  /** Time of the last result, ns after the tick. */
  finish: number;
};

/** One design's state t ns after the tick. */
export function laneAt(d: ReplayDesign, t: number): Lane {
  const accepted = d.accept_ns.filter((a) => a <= t).length;
  const done = d.result_ns.filter((r) => r <= t).length;
  return {
    queued: d.accept_ns.length - accepted,
    inFlight: accepted - done,
    done,
    complete: done === d.result_ns.length,
    finish: d.result_ns.at(-1)!,
  };
}

const us = (ns: number) => trim(ns / 1000, 4);

export function sysCaption(f: SysFrame, rep: SystemReplay): string {
  const by = (v: View) => rep.designs.find((d) => d.view === v)!;
  const [m7, m5, m4] = [by("msps_only"), by("bound"), by("true")];
  const lim = rep.limit_us;
  switch (f.phase) {
    case "tick":
      return `A control tick: ${rep.requests} sin/cos requests arrive at once, and all ${rep.requests} results must be back within ${lim} µs. Three candidates, one per view of the spec: m=${m7.m} (${fmtInt(m7.luts_plus_ffs)} LUT+FF, the MSPS-only winner), m=${m5.m} (${fmtInt(m5.luts_plus_ffs)}, the L1 bound's winner) and m=${m4.m} (${fmtInt(m4.luts_plus_ffs)}). Each runs on its own clock at its estimated Fmax.`;
    case "drain": {
      const parts = [m7, m5, m4].map((d) => {
        const l = laneAt(d, f.t);
        return l.complete
          ? `m=${d.m} done at ${us(l.finish)} µs`
          : `m=${d.m} ${l.done}/${rep.requests} out, ${l.queued} queued`;
      });
      return `${trim(f.t, 4)} ns after the tick: ${parts.join("; ")}. One request is accepted per clock edge (pipelined, initiation interval 1), so the last result comes (${rep.requests} − 1) + (latency − 1) edges after the first accept.`;
    }
    case "ticks":
      return `All ${rep.n_ticks} ticks of the simulation: the tick lands at a different point of each design's clock, so the batch latency varies by up to a cycle. The p99 is what the spec constrains: m=${m7.m} ${us(m7.p99_us * 1000)} µs, m=${m5.m} ${us(m5.p99_us * 1000)} µs, m=${m4.m} ${us(m4.p99_us * 1000)} µs (simulated).`;
    case "verdict":
      return `m=${m5.m} passes the L1 bound (${us(m5.bound_us * 1000)} µs, which assumes the tick lands on a clock edge) but the simulation misses ${lim} µs by ${((m5.p99_us / lim - 1) * 100).toFixed(1)}%: up to one cycle of clock-edge alignment the bound ignores. m=${m7.m} misses even the bound. So the spec's winner is m=${m4.m}, ${fmtInt(m4.luts_plus_ffs - m5.luts_plus_ffs)} LUT+FF larger than m=${m5.m}, which only the simulation can pick.`;
  }
}

// ---------------------------------------------------------------------------
// The cycle model against the RTL
// ---------------------------------------------------------------------------

export type CyclePhase = "window" | "table";

export type CycleFrame = { phase: CyclePhase; start: number; end: number };

/** A window of `size` edges walking along the exported waveform by `step`, then the table. */
export function cycleFrames(w: Wave, size = 32, step = 8): CycleFrame[] {
  const n = w.ready.length;
  const out: CycleFrame[] = [];
  for (let s = 0; s + size <= n; s += step)
    out.push({ phase: "window", start: s, end: s + size });
  out.push({ phase: "table", start: n - size, end: n });
  return out;
}

/** Count of "1"s in [start, end). */
export const ones = (bits: string, start: number, end: number): number =>
  [...bits.slice(start, end)].filter((c) => c === "1").length;

/** Edges in the window where an angle was offered but ready was low (back-pressure). */
export const waits = (w: Wave, start: number, end: number): number =>
  [...w.valid_in.slice(start, end)].filter(
    (c, i) => c === "1" && w.ready[start + i] === "0",
  ).length;

export function cycleCaption(f: CycleFrame, w: Wave, c: Cycle): string {
  if (f.phase === "table")
    return `Every trace, both simulators: ${c.passed}/${c.traces} identical to the cycle model on ready, valid_out and the output codes, ${fmtInt(c.edges)} clock edges in all (recorded by the repository's L2 validation). This trace runs to ${fmtInt(w.edges_total)} edges in the RTL log.`;
  const acc = ones(w.accepted, f.start, f.end);
  const res = ones(w.valid_out, f.start, f.end);
  const wait = waits(w, f.start, f.end);
  const contract =
    w.ii === 1
      ? `ready stays high, a new angle every edge; each result ${w.latency - 1} edges after its accept (latency ${w.latency}, both edges counted)`
      : `ready drops for ${w.ii - 1} edges after each accept, so the next angle waits; each result ${w.latency - 1} edges after its accept (latency ${w.latency}, both edges counted)`;
  return `Edges ${f.start}–${f.end - 1}: ${acc} angles accepted, ${res} results out, ${wait} edges with an angle held back by ready. ${w.family}: ${contract}. The RTL matched these signals on every edge.`;
}
