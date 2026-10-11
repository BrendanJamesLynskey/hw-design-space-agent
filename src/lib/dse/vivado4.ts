/**
 * The local Vivado runs after milestone 4, typed: src/data/vivado_m4.json
 * (scripts/export_vivado_m4.py; every row checked against the appended section of the repo's
 * results.md, and the statistics recomputed at export): high_precision at its own 20 ns clock,
 * the vivado-2025.2-m4 refit (counted once, the vivado-2025.2 fit), the per-family-class path
 * factor's rule and outcome, post-route / post-synthesis Fmax per family, and the first measured
 * FPGA power (Vivado report_power, vectorless) against the cost model's power index.
 */
import VIV from "@/data/vivado_m4.json";

export const FAMILIES4 = [
  "iterative",
  "pipelined",
  "pipelined_m",
  "unrolled_k",
] as const;
export type Family4 = (typeof FAMILIES4)[number];

export type Hp20Row = {
  m: number;
  stage: "post-synthesis" | "post-route";
  wns_ns: number;
  msps: number;
  meets: boolean;
  luts: number;
  ffs: number;
  estimates: { m1: number; refit: number; refit_m4: number };
};

export type Loo = { n: number; luts: number; ffs: number; fmax: number };

export type RouteDesign = {
  key: string;
  family: Family4;
  period_ns: number;
  synth_mhz: number;
  route_mhz: number;
  ratio: number;
};

export type PowerDesign = {
  key: string;
  family: Family4;
  /** The cost model's power index at 100 MHz (estimate). */
  index: number;
  /** Vivado core power at 100 MHz, mW (from the 1 ns report, scaled; vectorless). */
  mw: number;
  /** The same from the 10 ns report (printed to 3 decimal places in watts). */
  mw_10ns: number;
  /** index / (measured relative to the reference design). */
  ratio: number;
};

export type PowerStage = {
  n: number;
  spearman: number;
  /** Spearman with tied values given their mean rank (the repository breaks ties by order). */
  spearman_tied: number;
  tied_mw: number[];
  rms_pct: number;
  designs: PowerDesign[];
  by_family: Record<Family4, [number, number]>;
};

export type Vivado4 = {
  date: string;
  tool: string;
  high_precision_20ns: {
    need_msps: number;
    period_ns: number;
    part: string;
    rows: Hp20Row[];
  };
  refit: {
    n_fit_points: number;
    dropped: number;
    route_disagree: {
      m: number;
      stage: string;
      disagree_pct: Record<string, number>;
    }[];
    loo_vivado: Record<string, Loo>;
    loo_all: Loo;
    m1_vivado: Loo;
    winners_changed: string[];
    specs: string[];
  };
  class_factor: {
    loo_without: number;
    loo_with: number;
    loo_all_without: number;
    loo_all_with: number;
    msps_with: Record<string, number>;
    msps_without: Record<string, number>;
    a: boolean;
    b: boolean;
    adopt: boolean;
    factor_fsm: number;
    factor_pipelined: number;
    winner_with: string;
    history: string;
  };
  post_route: {
    designs: RouteDesign[];
    by_family: Record<
      Family4,
      { n: number; min: number; max: number; mean: number }
    >;
    min: number;
    max: number;
  };
  power: {
    stages: Record<"post-synthesis" | "post-route", PowerStage>;
    fit: {
      per_family_in: number;
      per_family_loo: number;
      global_in: number;
      global_loo: number;
    };
    implied_activity: Record<Family4, number>;
    default_activity: number;
    parameters: number;
    reference_key: string;
    reference_mw: number;
    toggle_pct: number;
    confidence: string;
  };
};

export const viv4 = VIV as unknown as Vivado4;

/** A short label for a design key: "pipelined_m W26 N22 m=6", "unrolled_k W16 k=4". */
export function shortKey(key: string): string {
  const [fam, rest = ""] = key.split(":");
  const p = Object.fromEntries(
    rest.split(",").map((kv) => kv.split("=") as [string, string]),
  );
  const parts = [fam, `W${p.data_width}`];
  if (p.n_iter !== "14") parts.push(`N${p.n_iter}`);
  if (p.m) parts.push(`m=${p.m}`);
  if (p.k) parts.push(`k=${p.k}`);
  return parts.join(" ");
}

/** The 20 ns row of one design and stage. */
export function hp20(m: number, stage: Hp20Row["stage"]): Hp20Row {
  return viv4.high_precision_20ns.rows.find(
    (r) => r.m === m && r.stage === stage,
  )!;
}

/** Values the prose quotes, under "v4.". */
export function viv4Values(): Record<string, number | string> {
  const cf = viv4.class_factor;
  const ps = viv4.power.stages["post-synthesis"];
  const pr = viv4.power.stages["post-route"];
  const pf = viv4.post_route.by_family;
  const rf = viv4.refit;
  const out: Record<string, number | string> = {
    date: viv4.date,
    need: viv4.high_precision_20ns.need_msps,
    "m8.synth": hp20(8, "post-synthesis").msps,
    "m8.route": hp20(8, "post-route").msps,
    "m6.synth": hp20(6, "post-synthesis").msps,
    "m6.route": hp20(6, "post-route").msps,
    "m8.wns_synth": hp20(8, "post-synthesis").wns_ns,
    "m8.wns_route": hp20(8, "post-route").wns_ns,
    "m8.synth_short":
      1 - hp20(8, "post-synthesis").msps / viv4.high_precision_20ns.need_msps,
    "m8.route_short":
      1 - hp20(8, "post-route").msps / viv4.high_precision_20ns.need_msps,
    "m6.route_margin":
      hp20(6, "post-route").msps / viv4.high_precision_20ns.need_msps - 1,
    "m6.route_loss":
      1 - hp20(6, "post-route").msps / hp20(6, "post-synthesis").msps,
    "m6.m1": hp20(6, "post-synthesis").estimates.m1,
    "m6.refit": hp20(6, "post-synthesis").estimates.refit,
    "m8.m1": hp20(8, "post-synthesis").estimates.m1,
    "m8.refit": hp20(8, "post-synthesis").estimates.refit,
    "m6.model_margin_min":
      hp20(6, "post-synthesis").estimates.m1 /
        viv4.high_precision_20ns.need_msps -
      1,
    "m6.model_margin_max":
      hp20(6, "post-synthesis").estimates.refit /
        viv4.high_precision_20ns.need_msps -
      1,
    "cf.loo_without": cf.loo_without,
    "cf.loo_with": cf.loo_with,
    "cf.loo_all_without": cf.loo_all_without,
    "cf.loo_all_with": cf.loo_all_with,
    "cf.m8": cf.msps_with["8"]!,
    "cf.m6": cf.msps_with["6"]!,
    "cf.m8_err": cf.msps_with["8"]! / hp20(8, "post-synthesis").msps - 1,
    "cf.fsm": cf.factor_fsm,
    "cf.pipelined": cf.factor_pipelined,
    "cf.history": cf.history.replace(/`/g, ""),
    "refit.points": rf.n_fit_points,
    "refit.dropped": rf.dropped,
    "refit.loo_luts": rf.loo_vivado["vivado-2025.2-m4"]!.luts,
    "refit.loo_ffs": rf.loo_vivado["vivado-2025.2-m4"]!.ffs,
    "refit.loo_fmax": rf.loo_vivado["vivado-2025.2-m4"]!.fmax,
    "refit.loo_n": rf.loo_vivado["vivado-2025.2-m4"]!.n,
    "refit.m1_luts": rf.m1_vivado.luts,
    "refit.m1_ffs": rf.m1_vivado.ffs,
    "refit.m1_fmax": rf.m1_vivado.fmax,
    "route.min": viv4.post_route.min,
    "route.max": viv4.post_route.max,
    "route.pipelined_min": pf.pipelined.min,
    "route.pipelined_max": pf.pipelined.max,
    "route.unrolled_min": pf.unrolled_k.min,
    "route.unrolled_max": pf.unrolled_k.max,
    "route.designs": viv4.post_route.designs.length,
    "power.n": ps.n,
    "power.spearman_synth": ps.spearman,
    "power.spearman_synth_tied": ps.spearman_tied,
    "power.spearman_route": pr.spearman,
    "power.rms_synth": ps.rms_pct,
    "power.rms_route": pr.rms_pct,
    "power.tied_mw": ps.tied_mw[0] ?? 0,
    "power.unrolled_synth_min": ps.by_family.unrolled_k[0],
    "power.unrolled_synth_max": ps.by_family.unrolled_k[1],
    "power.unrolled_route_min": pr.by_family.unrolled_k[0],
    "power.unrolled_route_max": pr.by_family.unrolled_k[1],
    "power.pipelined_synth_min": ps.by_family.pipelined[0],
    "power.pipelined_synth_max": ps.by_family.pipelined[1],
    "power.pipelined_route_min": pr.by_family.pipelined[0],
    "power.pipelined_route_max": pr.by_family.pipelined[1],
    "power.fit_in": viv4.power.fit.per_family_in,
    "power.fit_loo": viv4.power.fit.per_family_loo,
    "power.global_in": viv4.power.fit.global_in,
    "power.global_loo": viv4.power.fit.global_loo,
    "power.act_min": Math.min(...Object.values(viv4.power.implied_activity)),
    "power.act_max": Math.max(...Object.values(viv4.power.implied_activity)),
    "power.act_default": viv4.power.default_activity,
    "power.toggle": viv4.power.toggle_pct,
  };
  return Object.fromEntries(
    Object.entries(out).map(([k, v]) => [`v4.${k}`, v]),
  );
}
