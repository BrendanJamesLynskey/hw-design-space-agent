/**
 * Every number the pages quote in running prose, by name, computed from the site data (which
 * scripts/export_dse.py checks against the repo's results.md) and from the TS ports of the
 * models. Pages print them with <V of="…" />, so no number is typed into the prose by hand.
 */
import { climbGap } from "./climb";
import { accuracy, REFERENCE } from "./cordic";
import { estimate } from "./cost";
import { runDate, runsOf, site, why, type MsKey } from "./data";
import { arch } from "./families";
import { fleetSpan, maxConcurrent } from "./fleet";
import { ladder, vivadoDesigns } from "./ladder";
import { m3, sysSpec } from "./m3";

export type Fmt =
  | "num"
  | "int"
  | "usd"
  | "pct"
  | "pct0"
  | "pct2"
  | "spct"
  | "x"
  | "s"
  | "f1"
  | "f2"
  | "f3"
  | "str";

const gt = site.ground_truth;
const hero = site.hero;
const climb = why.hill_climb;
const gap = climbGap(climb, gt.dds_250msps!);
const glance = site.glance;
const spend = site.spend;
const lad = ladder;
const FEAS = ["dds_250msps", "high_precision", "low_area_control"];

/** Every per-milestone value, under "<ms>." (m1: 3 seeds, archived; m2: 5 seeds). */
function msValues(ms: MsKey): Record<string, number | string> {
  const e = site.evals[ms];
  const res = e.results;
  const costs = e.costs;
  const modelBy = (label: string) =>
    costs.models.find((m) => m.label === label);
  const row = (spec: string, method: string) =>
    res[spec]!.find((r) => r.method === method)!;
  const agentRows = (spec: string) => res[spec]!.filter((r) => r.agent);
  const out: Record<string, number | string> = {
    runs: costs.runs,
    seeds: e.seeds,
    total_usd: costs.total_usd,
    date: runDate(ms),
    trace_calls: e.trace_calls,
    trace_runs: e.trace_runs,
    models: costs.models.length,
    "calls.total": costs.models.reduce((a, m) => a + m.llm_calls, 0),
    "calls.failed": costs.models.reduce((a, m) => a + m.failed_calls, 0),
    "cost.min_per_run": Math.min(...costs.models.map((m) => m.cost_per_run)),
    "cost.max_per_run": Math.max(...costs.models.map((m) => m.cost_per_run)),
    "cost.min_wall_s": Math.min(...costs.models.map((m) => m.wall_s_mean)),
    "cost.max_wall_s": Math.max(...costs.models.map((m) => m.wall_s_mean)),
    "fleet.max": maxConcurrent(runsOf(ms)),
    "fleet.minutes": fleetSpan(runsOf(ms)) / 60,
    "infeasible.llm_declared": agentRows("infeasible_dds_400msps").reduce(
      (a, r) => a + (r.declared_infeasible_by_llm ?? 0),
      0,
    ),
    "infeasible.llm_runs": agentRows("infeasible_dds_400msps").reduce(
      (a, r) => a + r.runs,
      0,
    ),
    "regret.agent_beats_nsga2": FEAS.map(
      (sp) =>
        agentRows(sp).filter(
          (r) => r.regret_mean! < row(sp, "nsga2").regret_mean!,
        ).length,
    ).reduce((a, b) => a + b, 0),
    "regret.agent_rows": FEAS.map((sp) => agentRows(sp).length).reduce(
      (a, b) => a + b,
      0,
    ),
  };
  for (const m of costs.models) {
    const k =
      m.label === "Sonnet 5.5"
        ? "sonnet"
        : m.label === "DeepSeek V4.1 Flash"
          ? "deepseek"
          : m.label === "Qwen3.8-27B"
            ? "qwen"
            : "qwen_off";
    out[`cost.${k}.per_run`] = m.cost_per_run;
    out[`cost.${k}.per_spec`] = m.cost_per_spec;
    out[`cost.${k}.wall_s`] = m.wall_s_mean;
    out[`calls.${k}`] = m.llm_calls;
    out[`calls.${k}_failed`] = m.failed_calls;
  }
  const qwen = modelBy("Qwen3.8-27B");
  const qwenOff = modelBy("Qwen3.8-27B, reasoning off");
  if (qwen && qwenOff) {
    out["cost.qwen.speedup"] = qwen.wall_s_mean / qwenOff.wall_s_mean;
    out["cost.qwen.cheaper"] = qwen.cost_per_run / qwenOff.cost_per_run;
    out["calls.qwen_length"] = e.failures[qwen.model]!.LengthFinishReasonError!;
  }
  const sonnet = modelBy("Sonnet 5.5")!;
  out["proj.sonnet.runs_per_day"] = DAY_S / sonnet.wall_s_mean;
  out["proj.sonnet.usd_per_day"] =
    (DAY_S / sonnet.wall_s_mean) * sonnet.cost_per_run;
  for (const s of FEAS) {
    const ag = agentRows(s);
    out[`${s}.nsga2_regret`] = row(s, "nsga2").regret_mean!;
    out[`${s}.random_regret`] = row(s, "random").regret_mean!;
    out[`${s}.best_agent_regret`] = Math.min(...ag.map((r) => r.regret_mean!));
    out[`${s}.worst_agent_regret`] = Math.max(...ag.map((r) => r.regret_mean!));
    out[`${s}.nsga2_hv`] = row(s, "nsga2").hv_frac_mean!;
    out[`${s}.random_hv`] = row(s, "random").hv_frac_mean!;
    out[`${s}.best_agent_hv`] = Math.max(...ag.map((r) => r.hv_frac_mean!));
    out[`${s}.min_agent_hv`] = Math.min(...ag.map((r) => r.hv_frac_mean!));
    out[`${s}.nsga2_e95`] = row(s, "nsga2").evals_to_95_text!;
    for (const r of ag) {
      const k =
        r.label === "Sonnet 5.5"
          ? "sonnet"
          : r.label === "DeepSeek V4.1 Flash"
            ? "deepseek"
            : r.label === "Qwen3.8-27B"
              ? "qwen"
              : "qwen_off";
      out[`${s}.${k}_hv`] = r.hv_frac_mean!;
      out[`${s}.${k}_regret`] = r.regret_mean!;
      out[`${s}.${k}_regret_std`] = r.regret_std!;
      out[`${s}.${k}_e95`] = r.evals_to_95_text!;
    }
  }
  return Object.fromEntries(
    Object.entries(out).map(([k, v]) => [`${ms}.${k}`, v]),
  );
}

const refAcc = accuracy(REFERENCE);
const refIter = estimate(
  arch("iterative", {
    data_width: 16,
    n_iter: 14,
    angle_guard: 0,
    frac_guard: 0,
    rounding: "trunc",
  }),
);
const refPipe = estimate(
  arch("pipelined", {
    data_width: 16,
    n_iter: 14,
    angle_guard: 0,
    frac_guard: 0,
    rounding: "trunc",
  }),
);

const DAY_S = 86_400;

const glanceAgent = (spec: string, model: string) =>
  glance.specs[spec]![model]!;
const hp = lad.high_precision;
const shortPath = vivadoDesigns().filter(
  (d) => d.family === "pipelined" || d.key.endsWith(",m=2"),
);
const qwenHpRegret = glanceAgent(
  "high_precision",
  "qwen/qwen3.8-27b, reasoning off",
).select_regret;
const qwenHpSeeds = site.evals.m2.spec_tables.high_precision![
  "qwen/qwen3.8-27b, reasoning off"
]!.selected.map((x) => x.regret!);
function median(xs: number[]): number {
  const v = [...xs].sort((a, b) => a - b);
  const k = Math.floor(v.length / 2);
  return v.length % 2 ? v[k]! : (v[k - 1]! + v[k]!) / 2;
}
const ds = (s: string) =>
  glanceAgent(s, "deepseek/deepseek-v4.1-flash").select_regret;

/** Milestone 3's values, under "m3." (src/data/m3.json, checked against results.md and the README). */
function m3Values(): Record<string, number | string> {
  const multi = sysSpec("multiaxis_control");
  const bursty = sysSpec("bursty_offload");
  const dds = sysSpec("dds_sfdr");
  const ab = m3.ab;
  const st = m3.structured;
  const SPECS = ["multiaxis_control", "bursty_offload"];
  const agents = SPECS.flatMap((x) => st[x]!.filter((r) => r.agent));
  const base = (method: string) =>
    SPECS.map((x) => st[x]!.find((r) => r.method === method)!);
  const KEY: Record<string, string> = {
    "anthropic/claude-sonnet-5.5": "sonnet",
    "deepseek/deepseek-v4.1-flash": "deepseek",
    "qwen/qwen3.8-27b, reasoning off": "qwen",
  };
  const cost = (m: string) => ab.costs.find((c) => c.model === m)!;
  const outlier = ab.runs
    .filter((r) => r.spec === "low_area_control" && r.seed === 0)
    .reduce((a, b) => ((a.hv_frac ?? 1) < (b.hv_frac ?? 1) ? a : b));
  const loops = ab.runs.filter((r) => r.failed);
  const mem = m3.memory.rows;
  const hpFix = m3.levers.fix.find(
    (r) => r.driver.startsWith("LLM") && r.spec === "high_precision",
  )!;
  const out: Record<string, number | string> = {
    "l2.traces": m3.cycle.traces,
    "l2.passed": m3.cycle.passed,
    "l2.edges": m3.cycle.edges,
    "l2.designs": m3.cycle.designs.length,
    "gt.tuples": m3.ground_truth.n_tuples,
    "multi.feasible": multi.n_feasible,
    "multi.feasible_bound": multi.n_feasible_l1_bound,
    "multi.feasible_msps": multi.n_feasible_msps_only,
    "multi.true_lf": multi.true.luts_plus_ffs,
    "multi.bound_lf": multi.bound.luts_plus_ffs,
    "multi.msps_lf": multi.msps_only.luts_plus_ffs,
    "multi.true_p99": multi.true.simulated.sys_p99_batch_us!,
    "multi.bound_p99": multi.bound.simulated.sys_p99_batch_us!,
    "multi.bound_bound": multi.bound.bound.sys_p99_batch_us!,
    "multi.miss": multi.bound.simulated.sys_p99_batch_us! / 0.44 - 1,
    "multi.peak_floor": multi.peak_rate!.floor_msps,
    "multi.peak_feasible": multi.peak_rate!.n_feasible,
    "bursty.feasible": bursty.n_feasible,
    "bursty.feasible_msps": bursty.n_feasible_msps_only,
    "bursty.true_lf": bursty.true.luts_plus_ffs,
    "bursty.msps_lf": bursty.msps_only.luts_plus_ffs,
    "bursty.true_p99": bursty.true.simulated.sys_p99_latency_us!,
    "bursty.msps_p99": bursty.msps_only.simulated.sys_p99_latency_us!,
    "bursty.msps_bound": bursty.msps_only.bound.sys_p99_latency_us!,
    "bursty.msps_ratio":
      bursty.msps_only.simulated.sys_p99_latency_us! /
      bursty.msps_only.bound.sys_p99_latency_us!,
    "bursty.area_ratio":
      bursty.true.luts_plus_ffs / bursty.msps_only.luts_plus_ffs,
    "bursty.peak_floor": bursty.peak_rate!.floor_msps,
    "dds.feasible": dds.n_feasible,
    "dds.sfdr": dds.true.simulated.sys_sfdr_dbc!,
    "struct.runs": agents.reduce((a, r) => a + r.runs, 0),
    "struct.l2_changed": agents.reduce((a, r) => a + (r.l2_changed ?? 0), 0),
    "struct.hv_min": Math.min(...agents.map((r) => r.hv.mean)),
    "struct.hv_max": Math.max(...agents.map((r) => r.hv.mean)),
    "struct.regret_min": Math.min(...agents.map((r) => r.regret.mean)),
    "struct.regret_max": Math.max(...agents.map((r) => r.regret.mean)),
    "struct.nsga2_hv_min": Math.min(...base("nsga2").map((r) => r.hv.mean)),
    "struct.nsga2_hv_max": Math.max(...base("nsga2").map((r) => r.hv.mean)),
    "struct.nsga2_regret_multi": base("nsga2")[0]!.regret.mean,
    "struct.nsga2_regret_bursty": base("nsga2")[1]!.regret.mean,
    "struct.random_regret_min": Math.min(
      ...base("random").map((r) => r.regret.mean),
    ),
    "struct.random_regret_max": Math.max(
      ...base("random").map((r) => r.regret.mean),
    ),
    "ab.campaigns": ab.campaigns,
    "ab.single": ab.single_run_dse,
    "ab.explore": ab.tools.explore_family!,
    "ab.simulate": ab.tools.simulate_system!,
    "ab.verify": ab.tools.verify_rtl!,
    "ab.annotate": ab.tools.back_annotate!,
    "ab.reexplore": ab.tools.reexplore!,
    "ab.verify_recorded": ab.ladder.verify_recorded!,
    "ab.verify_called": ab.ladder.verify_called!,
    "ab.synth_recorded": ab.ladder.synth_recorded!,
    "ab.synth_called": ab.ladder.synth_called!,
    "ab.annotate_compared": ab.ladder.annotate_compared!,
    "ab.annotate_called": ab.ladder.annotate_called!,
    "ab.l2_campaign": ab.l2_reselect.campaign[0],
    "ab.loops": loops.length,
    "ab.loop_cap": 40,
    "ab.outlier_hv": outlier.hv_frac!,
    "ab.outlier_regret": outlier.regret!,
    "ab.outlier_model": ab.labels[outlier.model]!,
    "ab.input_ratio_min": Math.min(...ab.costs.map((c) => c.input_ratio)),
    "ab.input_ratio_max": Math.max(...ab.costs.map((c) => c.input_ratio)),
    "ab.cost_ratio_min": Math.min(...ab.costs.map((c) => c.cost_ratio)),
    "ab.cost_ratio_max": Math.max(...ab.costs.map((c) => c.cost_ratio)),
    memory_label: m3.memory.label,
    "bursty.msps_ii": bursty.msps_only.latency_cycles,
    "mem.seeds": mem[0]!.seeds.length,
    "mem.first_hv_off": mem[0]!.hv_frac[0].mean,
    "mem.first_hv_on": mem[0]!.hv_frac[1].mean,
    "levers.hp_regret_m2": hpFix.regret[0],
    "levers.hp_regret_fix": hpFix.regret[1],
    "levers.replay_identical": m3.levers.replay.identical,
    "levers.replay_runs": m3.levers.replay.runs,
    "spend.key": m3.spend.key_usd,
    "spend.cap": m3.spend.cap_usd,
    "spend.ledger": m3.spend.ledger_total_usd,
    "spend.entries": m3.spend.ledger_entries,
    "spend.structured": m3.spend.structured_usd,
    "spend.campaign": m3.spend.campaign_usd,
    "spend.trace": m3.spend.trace_usd,
  };
  for (const m of ab.models) {
    const k = KEY[m]!;
    const p = ab.pooled[m]!;
    out[`ab.${k}.hv_s`] = p.hv[0];
    out[`ab.${k}.hv_c`] = p.hv[1];
    out[`ab.${k}.regret_s`] = p.regret[0];
    out[`ab.${k}.regret_c`] = p.regret[1];
    out[`ab.${k}.cost_ratio`] = cost(m).cost_ratio;
    out[`ab.${k}.cost_s`] = cost(m).cost_usd[0].mean;
    out[`ab.${k}.cost_c`] = cost(m).cost_usd[1].mean;
    out[`ab.${k}.runs`] = cost(m).runs[1];
    out[`ab.${k}.failed`] = cost(m).failures[1];
    for (const x of SPECS) {
      const r = st[x]!.find((y) => y.method === m)!;
      out[`struct.${x}.${k}_regret`] = r.regret.mean;
      out[`struct.${x}.${k}_hv`] = r.hv.mean;
    }
  }
  return Object.fromEntries(
    Object.entries(out).map(([k, v]) => [`m3.${k}`, v]),
  );
}

export const VALUES: Record<string, number | string> = {
  commit: site.vendored.commit.slice(0, 7),
  designs: gt.dds_250msps!.n_designs,
  families: hero.n_families,
  trace_calls: site.trace_calls,
  "infeasible.best_msps": gt.infeasible_dds_400msps!.best_throughput_msps_any,
  ...Object.fromEntries(
    FEAS.flatMap((s) => [
      [`${s}.front`, gt[s]!.front.length],
      [`${s}.feasible`, gt[s]!.n_feasible],
    ]),
  ),
  ...msValues("m1"),
  ...msValues("m2"),
  ...m3Values(),
  // M1 → M2 (results.md's "at a glance", checked against it at export)
  "glance.hv_ratio_min": glance.hv_ratio_m2[0],
  "glance.hv_ratio_max": glance.hv_ratio_m2[1],
  "glance.regret_beats": glance.regret_beats_nsga2_m2,
  "glance.regret_cells": glance.regret_cells,
  "glance.qwen_hp_regret_m1": qwenHpRegret[0].mean,
  "glance.qwen_hp_regret_m2": qwenHpRegret[1].mean,
  "glance.qwen_hp_regret_m2_std": qwenHpRegret[1].std,
  "glance.ds_dds_regret_m1": ds("dds_250msps")[0].mean,
  "glance.ds_dds_regret_m2": ds("dds_250msps")[1].mean,
  "glance.ds_low_regret_m1": ds("low_area_control")[0].mean,
  "glance.ds_low_regret_m2": ds("low_area_control")[1].mean,
  "glance.m1_hv_ratio_min": Math.min(
    ...FEAS.filter((s) => s !== "high_precision").flatMap((s) =>
      glance.models.map((m) => glanceAgent(s, m).hv_vs_nsga2![0]),
    ),
  ),
  "glance.m1_hv_ratio_max": Math.max(
    ...FEAS.filter((s) => s !== "high_precision").flatMap((s) =>
      glance.models.map((m) => glanceAgent(s, m).hv_vs_nsga2![0]),
    ),
  ),
  "glance.mf_deepseek":
    glance.map_front_runs["deepseek/deepseek-v4.1-flash"]![0],
  "glance.mf_qwen":
    glance.map_front_runs["qwen/qwen3.8-27b, reasoning off"]![0],
  "glance.mf_sonnet": glance.map_front_runs["anthropic/claude-sonnet-5.5"]![0],
  "glance.mf_runs": glance.map_front_runs["anthropic/claude-sonnet-5.5"]![1],
  "glance.qwen_hp_worst_seed": Math.max(...qwenHpSeeds),
  "glance.qwen_hp_median": median(qwenHpSeeds),
  // what the runs cost (measured)
  "spend.m1": spend.m1.provider_usd,
  "spend.m2": spend.m2.provider_usd,
  "spend.m2_pilot": spend.m2.pilot_usd,
  "spend.m2_traces": spend.m2.trace_usd,
  "spend.m2_key": spend.m2.key_usd,
  "spend.m2_cap": spend.m2.cap_usd,
  "spend.m2_runs": spend.m2.runs,
  "spend.m2_pilot_runs": spend.m2.pilot_runs,
  // the ladder (M2): counts from the vendored tables
  "l3.configs": lad.l3.configs,
  "l3.rtl_runs": lad.l3.rtl_runs,
  "l3.gate_runs": lad.l3.gate_runs,
  "l3.rtl_angles": lad.l3.rtl_angles,
  "l3.max_exhaustive_width": lad.l3.max_exhaustive_width,
  "formal.proofs": lad.formal.rows.length,
  "l4.points": lad.l4.rows.length,
  "vivado.designs": new Set(
    lad.vivado.rows
      .filter((r) => r.batch > 0)
      .map((r) => `${r.batch}|${r.key}`),
  ).size,
  // Vivado: routed against post-synthesis Fmax on the short-path designs (pipelined, and
  // pipelined_m with a register every 2 stages)
  "vivado.route_drop_min": Math.min(
    ...shortPath.map((d) => 1 - d.route.fmax_mhz / d.synth.fmax_mhz),
  ),
  "vivado.route_drop_max": Math.max(
    ...shortPath.map((d) => 1 - d.route.fmax_mhz / d.synth.fmax_mhz),
  ),
  "l5.fit_points": lad.l5.vivado.n_fit_points,
  "l5.loo_vivado_luts": lad.l5.vivado.loo_summary["all vivado"]!.luts_loo,
  "l5.loo_vivado_fmax": lad.l5.vivado.loo_summary["all vivado"]!.fmax_loo,
  "l5.m1_vivado_luts":
    lad.l5.vivado.summary_before["vivado (generated RTL)"]!.rms_luts_err_pct,
  "l5.m1_vivado_fmax":
    lad.l5.vivado.summary_before["vivado (generated RTL)"]!.rms_fmax_err_pct,
  "hp.m6_route": hp.candidates[0].post_route.msps,
  "hp.m8_route": hp.candidates[1].post_route.msps,
  "hp.m6_synth": hp.candidates[0].post_synth.msps,
  "hp.m8_synth": hp.candidates[1].post_synth.msps,
  "hp.m8_synth_margin": hp.margin.post_synth["8"]!,
  "hp.m8_synth_shortfall": -hp.margin.post_synth["8"]!,
  "hp.m8_route_margin": hp.margin.post_route["8"]!,
  "hp.m6_route_margin": hp.margin.post_route["6"]!,
  // hero run (M2)
  "hero.cost": hero.cost_usd,
  "hero.wall_s": hero.wall_s,
  "hero.calls": hero.llm_calls,
  "hero.regret": hero.select_regret,
  "hero.evals": hero.rounds[hero.rounds.length - 1]!.cumulative_evals,
  // the Why page's hill-climb
  "climb.steps": climb.path.length - 1,
  "climb.end_msps": gap.climbed.throughput_msps,
  "climb.end_luts": gap.climbed.luts,
  "climb.ceiling_msps": gap.ceiling.throughput_msps,
  "climb.explored_msps": gap.explored.throughput_msps,
  "climb.explored_luts": gap.explored.luts,
  "climb.ratio": gap.throughputRatio,
  "climb.shortfall": gap.shortfall,
  "climb.iterative_designs": climb.iterative_designs,
  // the reference design (TS ports)
  "ref.max_lsb": refAcc.maxAbsLsb,
  "ref.rms_lsb": refAcc.rmsLsb,
  "ref.bits": refAcc.accuracyBits,
  "ref.iter.luts": refIter.luts,
  "ref.iter.fmax": refIter.fmaxMhz,
  "ref.pipe.luts": refPipe.luts,
  "ref.pipe.fmax": refPipe.fmaxMhz,
};

export function lookup(name: string): number | string {
  const v = VALUES[name];
  if (v === undefined) throw new Error(`unknown value ${name}`);
  return v;
}

function sig(v: number, d = 3): string {
  return Number(v.toPrecision(d)).toLocaleString("en-GB", {
    maximumFractionDigits: 6,
  });
}

export function formatValue(v: number | string, fmt: Fmt = "num"): string {
  if (typeof v === "string" || fmt === "str") return String(v);
  switch (fmt) {
    case "int":
      return Math.round(v).toLocaleString("en-GB");
    case "usd":
      return v >= 0.1 ? `$${v.toFixed(2)}` : `$${sig(v, 2)}`;
    case "pct":
      return `${(v * 100).toFixed(1)}%`;
    case "pct0":
      return `${(v * 100).toFixed(0)}%`;
    case "pct2":
      return `${(v * 100).toFixed(2)}%`;
    case "spct":
      return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
    case "x":
      return `${sig(v, 2)}×`;
    case "s":
      return `${sig(v, 3)} s`;
    case "f1":
      return v.toFixed(1);
    case "f2":
      return v.toFixed(2);
    case "f3":
      return v.toFixed(3);
    default:
      return sig(v);
  }
}

export const V_ = (name: string, fmt: Fmt = "num"): string =>
  formatValue(lookup(name), fmt);
