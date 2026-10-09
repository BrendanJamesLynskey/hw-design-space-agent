/**
 * Milestone 2's ladder data, typed: everything scripts/export_ladder.py writes to
 * src/data/ladder.json from the vendored tables (L3 verification at RTL and gate level, the
 * formal proofs, L4 synthesis, the Vivado measurements, the L5 refits, the worked example of
 * one design up the ladder, and the `high_precision` m=6 against m=8 measurements). The export
 * checks each summary against the repository's own text and recomputes the estimates with the
 * Python reference.
 */
import LADDER from "@/data/ladder.json";

export type L3Row = {
  level: "rtl" | "gate";
  simulator: string;
  key: string;
  family: string;
  data_width: number;
  exhaustive: boolean;
  n_angles: number;
  mismatches: number;
  latency: number;
  latency_expected: number;
};

export type FormalRow = {
  job: string;
  kind: "equivalence" | "latency";
  key: string;
  family: string;
  mode: string;
  depth: number;
  status: string;
  seconds: number;
};

export type Est = { luts: number; ffs: number; fmax_mhz: number };

export type L4Row = {
  key: string;
  family: string;
  rtl: "generated" | "reference";
  luts: number;
  ffs: number;
  carry4: number;
  fmax_mhz: number;
  fmax_seeds: number[];
  est: Est;
};

export type VivadoRow = {
  /** 1 and 2: the two batches; 0: the review's spot-check. */
  batch: 0 | 1 | 2;
  key: string;
  family: string;
  kind: "post-synthesis" | "post-route";
  luts: number;
  ffs: number;
  carry4: number;
  fmax_mhz: number;
  wns_ns: number;
  period_ns: number;
  est: Est;
};

export type RmsRow = {
  n: number;
  rms_luts_err_pct: number;
  rms_ffs_err_pct: number;
  rms_fmax_err_pct: number;
};

export type LooRow = {
  n: number;
  luts_in: number;
  ffs_in: number;
  fmax_in: number;
  luts_loo: number;
  ffs_loo: number;
  fmax_loo: number;
};

export type Refit = {
  name: string;
  calibration_file: string;
  base: string;
  n_fit_points: number;
  tool_corrections: Record<string, { luts: number; ffs: number; path: number }>;
  summary_before: Record<string, RmsRow>;
  summary_after: Record<string, RmsRow>;
  loo_summary: Record<string, LooRow>;
  ground_truth_impact: Record<
    string,
    {
      winner_m1: string | null;
      winner_refit: string | null;
      winner_changed: boolean;
      feasible_m1: number;
      feasible_refit: number;
    }
  >;
  any_winner_changed: boolean;
};

/** One measured point of the vivado-2025.2 refit: measured, M1 estimate, refit prediction. */
export type ScatterPoint = {
  tool: "vivado" | "vivado post-route" | "yosys+nextpnr-xilinx";
  rtl: "generated" | "reference";
  key: string;
  family: string;
  fitted: boolean;
  luts_meas: number;
  ffs_meas: number;
  fmax_meas: number;
  luts_m1: number;
  ffs_m1: number;
  fmax_m1: number;
  luts_refit: number;
  ffs_refit: number;
  fmax_refit: number;
};

export type Worked = {
  key: string;
  family: string;
  params: Record<string, number | string>;
  spec: string;
  l1: {
    luts: number;
    ffs: number;
    fmax_mhz: number;
    throughput_msps: number;
    latency_cycles: number;
    max_abs_err: number;
    accuracy_bits: number;
    n_angles: number;
    calibration: string;
  };
  rtl: { module: string; lines: number; header: string[] };
  l3: {
    simulator: string;
    version: string;
    n_angles: number;
    mismatches: number;
    latency: number;
    latency_expected: number;
  }[];
  gate: {
    netlist: string;
    luts: number;
    ffs: number;
    carry4: number;
    simulator: string;
    n_angles: number;
    mismatches: number;
    latency: number;
    latency_expected: number;
  };
  l4: {
    tool_version: string;
    part: string;
    luts: number;
    ffs: number;
    fmax_mhz: number;
    fmax_seeds: number[];
    carry4: number;
    err_pct: Est;
  };
  l5: {
    calibration: string;
    vivado_scale: Est;
    tool_scaled: Est;
    err_pct: Est;
    status: string;
    measured_front: number;
    front: number;
    winner_changed: boolean;
    throughput_msps: number;
    cycles: number;
    min_msps: number;
    verdict: string;
  };
};

export type HpCandidate = {
  m: number;
  key: string;
  params: Record<string, number | string>;
  m1: { luts_plus_ffs: number; msps: number; feasible: boolean };
  refit: { luts_plus_ffs: number; msps: number };
  post_synth: { luts: number; ffs: number; msps: number; wns_ns: number };
  post_route: { luts: number; ffs: number; msps: number; wns_ns: number };
  accuracy_bits: number;
  max_abs_err: number;
};

export type HighPrecision = {
  spec: string;
  min_msps: number;
  candidates: [HpCandidate, HpCandidate];
  /** view -> m -> throughput / min - 1. */
  margin: Record<
    "m1" | "refit" | "post_synth" | "post_route",
    Record<string, number>
  >;
  constraint_note: string;
};

export type Ladder = {
  l3: {
    provenance: string;
    simulators: string[];
    configs: number;
    rtl_runs: number;
    gate_runs: number;
    rtl_angles: number;
    gate_angles: number;
    exhaustive_configs: number;
    max_exhaustive_width: number;
    per_family: Record<string, { configs: number; gate_runs: number }>;
    gate_netlist: string[];
    rows: L3Row[];
  };
  formal: { provenance: string; tools: string[]; rows: FormalRow[] };
  l4: {
    provenance: string;
    tool: string;
    tool_version: string;
    part: string;
    target_mhz: number;
    rows: L4Row[];
  };
  vivado: { provenance: string; part: string; rows: VivadoRow[] };
  l5: { vivado: Refit; yosys: Refit };
  scatter: ScatterPoint[];
  worked: Worked;
  high_precision: HighPrecision;
};

export const ladder = LADDER as unknown as Ladder;

/** Relative error of an estimate against a measurement, as a fraction. */
export const relErr = (est: number, meas: number): number => est / meas - 1;

/** The Vivado designs (two batches), with their post-synthesis and post-route rows. */
export function vivadoDesigns(): {
  key: string;
  family: string;
  batch: number;
  synth: VivadoRow;
  route: VivadoRow;
}[] {
  const rows = ladder.vivado.rows.filter((r) => r.batch > 0);
  const keys = [...new Set(rows.map((r) => `${r.batch}|${r.key}`))];
  return keys.map((k) => {
    const [b, key] = k.split("|") as [string, string];
    const of = (kind: VivadoRow["kind"]) =>
      rows.find(
        (r) => r.key === key && String(r.batch) === b && r.kind === kind,
      )!;
    const synth = of("post-synthesis");
    return {
      key,
      family: synth.family,
      batch: Number(b),
      synth,
      route: of("post-route"),
    };
  });
}
