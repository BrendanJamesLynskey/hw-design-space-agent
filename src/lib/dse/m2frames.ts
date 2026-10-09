/**
 * The states of milestone 2's animations, as pure functions of the exported data
 * (src/data/ladder.json and src/data/site.json):
 *
 * - descentFrames: one design down the ladder (the repository's worked example): the L1
 *   estimate, the generated RTL, both simulators, the family's formal proof, the gate-level
 *   netlist, synthesis and place-and-route, measured against estimated, the refit, and the
 *   back-annotation verdict;
 * - scatterFrames: every measured design against the M1 estimate, tool by tool, then against
 *   the refit's prediction;
 * - hpFrames: the high_precision winner (m=6) and its smaller neighbour (m=8) against the
 *   50 MSPS constraint, from the M1 estimate to Vivado's routed timing;
 * - shiftFrames: each agent's M1 → M2 change, relative to NSGA-II, spec by spec.
 */
import type { Glance } from "./data";
import type { HighPrecision, ScatterPoint, Worked } from "./ladder";

// ---------------------------------------------------------------------------
// One design down the ladder
// ---------------------------------------------------------------------------

export type DescentPhase =
  | "l1"
  | "rtl"
  | "sim"
  | "formal"
  | "synth"
  | "gate"
  | "compare"
  | "refit"
  | "verdict";

export type DescentStep = {
  phase: DescentPhase;
  /** The ladder rung the design is on. */
  level: "L1" | "L3" | "L4" | "GL" | "L5";
  /** Index into worked.l3 for the "sim" steps. */
  sim: number | null;
  /** What has been measured so far (the bars appear from "synth" on). */
  measured: boolean;
  refit: boolean;
};

export function descentFrames(w: Worked): DescentStep[] {
  const base = { sim: null, measured: false, refit: false };
  return [
    { phase: "l1", level: "L1", ...base },
    { phase: "rtl", level: "L3", ...base },
    ...w.l3.map((_, i) => ({
      phase: "sim" as const,
      level: "L3" as const,
      ...base,
      sim: i,
    })),
    { phase: "formal", level: "L3", ...base },
    { phase: "synth", level: "L4", ...base, measured: true },
    { phase: "gate", level: "GL", ...base, measured: true },
    { phase: "compare", level: "L5", ...base, measured: true },
    { phase: "refit", level: "L5", ...base, measured: true, refit: true },
    { phase: "verdict", level: "L5", ...base, measured: true, refit: true },
  ];
}

/** The three metrics a design is measured on, with their L1 estimate, L4 measurement and refit. */
export function descentBars(w: Worked): {
  metric: "luts" | "ffs" | "fmax_mhz";
  est: number;
  meas: number;
  refit: number;
}[] {
  return (["luts", "ffs", "fmax_mhz"] as const).map((metric) => ({
    metric,
    est: w.l1[metric],
    meas: w.l4[metric],
    refit: w.l5.tool_scaled[metric],
  }));
}

// ---------------------------------------------------------------------------
// Measured against estimated
// ---------------------------------------------------------------------------

export type Metric = "luts" | "ffs" | "fmax";
export type ScatterTool = ScatterPoint["tool"];

/** The order the tools' points arrive in. */
export const SCATTER_TOOLS: ScatterTool[] = [
  "yosys+nextpnr-xilinx",
  "vivado",
  "vivado post-route",
];

export type ScatterFrame = {
  /** Tools whose points are drawn. */
  tools: ScatterTool[];
  /** x is the refit's prediction instead of the M1 estimate. */
  refit: boolean;
};

export function scatterFrames(): ScatterFrame[] {
  const out: ScatterFrame[] = [{ tools: [], refit: false }];
  for (let i = 1; i <= SCATTER_TOOLS.length; i++)
    out.push({ tools: SCATTER_TOOLS.slice(0, i), refit: false });
  out.push({ tools: [...SCATTER_TOOLS], refit: true });
  return out;
}

/** The generated-RTL points the scatter draws (the reference-RTL anchors are left out). */
export function scatterPoints(all: ScatterPoint[]): ScatterPoint[] {
  return all.filter((p) => p.rtl === "generated");
}

/** A point's (estimate, measured) pair for a metric, before or after the refit. */
export function xy(
  p: ScatterPoint,
  m: Metric,
  refit: boolean,
): { x: number; y: number } {
  return {
    x: refit ? p[`${m}_refit`] : p[`${m}_m1`],
    y: p[`${m}_meas`],
  };
}

/** RMS relative error of the estimate against the measurement over some points, in %. */
export function rmsPct(pts: ScatterPoint[], m: Metric, refit: boolean): number {
  if (pts.length === 0) return 0;
  const s = pts.reduce((a, p) => {
    const { x, y } = xy(p, m, refit);
    return a + (x / y - 1) ** 2;
  }, 0);
  return Math.sqrt(s / pts.length) * 100;
}

/** The scatter's axis range for a metric (log scale), over every point in both views. */
export function scatterExtent(
  pts: ScatterPoint[],
  m: Metric,
): [number, number] {
  const vs = pts.flatMap((p) => [
    p[`${m}_meas`],
    p[`${m}_m1`],
    p[`${m}_refit`],
  ]);
  return [Math.min(...vs) / 1.15, Math.max(...vs) * 1.15];
}

// ---------------------------------------------------------------------------
// high_precision: m=6 against m=8
// ---------------------------------------------------------------------------

export type HpView = "m1" | "refit" | "post_synth" | "post_route";
export const HP_VIEWS: HpView[] = ["m1", "refit", "post_synth", "post_route"];

export type HpFrame = { phase: "spec" | HpView | "verdict"; views: HpView[] };

export function hpFrames(): HpFrame[] {
  const out: HpFrame[] = [{ phase: "spec", views: [] }];
  HP_VIEWS.forEach((v, i) =>
    out.push({ phase: v, views: HP_VIEWS.slice(0, i + 1) }),
  );
  out.push({ phase: "verdict", views: [...HP_VIEWS] });
  return out;
}

/** A candidate's throughput (MSPS) under one view. */
export function hpMsps(hp: HighPrecision, m: number, v: HpView): number {
  const c = hp.candidates.find((x) => x.m === m)!;
  return c[v].msps;
}

/** Whether a candidate meets the throughput constraint under one view. */
export function hpMeets(hp: HighPrecision, m: number, v: HpView): boolean {
  return hpMsps(hp, m, v) >= hp.min_msps;
}

// ---------------------------------------------------------------------------
// M1 → M2, relative to NSGA-II
// ---------------------------------------------------------------------------

export type ShiftMetric = "hv" | "regret";
export type ShiftFrame = { moved: string[] };

/** Frame 0: every agent at its M1 value; then one spec at a time moves to M2. */
export function shiftFrames(specs: string[]): ShiftFrame[] {
  return [
    { moved: [] },
    ...specs.map((_, i) => ({ moved: specs.slice(0, i + 1) })),
  ];
}

/**
 * One agent's value on a spec, M1 and M2: its hypervolume relative to NSGA-II's (1 = parity),
 * or its mean selection regret minus NSGA-II's (below 0 = better than NSGA-II).
 */
export function shiftValue(
  g: Glance,
  spec: string,
  model: string,
  metric: ShiftMetric,
): [number, number] {
  const row = g.specs[spec]![model]!;
  if (metric === "hv") return row.hv_vs_nsga2!;
  const ns = g.specs[spec]!.nsga2!.select_regret;
  return [
    row.select_regret[0].mean - ns[0].mean,
    row.select_regret[1].mean - ns[1].mean,
  ];
}
