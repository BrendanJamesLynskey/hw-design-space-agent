/**
 * Every number the pages quote in running prose, by name, computed from the site data (which
 * scripts/export_dse.py checks against the repo's results.md) and from the TS ports of the
 * models. Pages print them with <V of="…" />, so no number is typed into the prose by hand.
 */
import { climbGap } from "./climb";
import { accuracy, REFERENCE } from "./cordic";
import { estimate } from "./cost";
import { site, why } from "./data";
import { arch } from "./families";

export type Fmt =
  | "num"
  | "int"
  | "usd"
  | "pct"
  | "spct"
  | "x"
  | "s"
  | "f1"
  | "f3"
  | "str";

const gt = site.ground_truth;
const res = site.results;
const costs = site.costs;
const hero = site.hero;
const climb = why.hill_climb;
const gap = climbGap(climb, gt.dds_250msps!);

const modelBy = (label: string) => costs.models.find((m) => m.label === label)!;
const sonnet = modelBy("Sonnet 5.5");
const qwen = modelBy("Qwen3.8-27B");
const qwenOff = modelBy("Qwen3.8-27B, reasoning off");

const row = (spec: string, method: string) =>
  res[spec]!.find((r) => r.method === method)!;
const agentRows = (spec: string) => res[spec]!.filter((r) => r.agent);
const bestAgentRegret = (spec: string) =>
  Math.min(...agentRows(spec).map((r) => r.regret_mean!));
const bestAgentHv = (spec: string) =>
  Math.max(...agentRows(spec).map((r) => r.hv_frac_mean!));
const minAgentHv = (spec: string) =>
  Math.min(...agentRows(spec).map((r) => r.hv_frac_mean!));

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

export const VALUES: Record<string, number | string> = {
  commit: site.vendored.commit.slice(0, 7),
  designs: gt.dds_250msps!.n_designs,
  families: hero.n_families,
  runs: costs.runs,
  total_usd: costs.total_usd,
  trace_calls: site.trace_calls,
  // the infeasible spec
  "infeasible.best_msps": gt.infeasible_dds_400msps!.best_throughput_msps_any,
  "infeasible.llm_declared": agentRows("infeasible_dds_400msps").reduce(
    (a, r) => a + (r.declared_infeasible_by_llm ?? 0),
    0,
  ),
  "infeasible.llm_runs": agentRows("infeasible_dds_400msps").reduce(
    (a, r) => a + r.runs,
    0,
  ),
  // selection regret and hypervolume, per spec
  ...Object.fromEntries(
    ["dds_250msps", "high_precision", "low_area_control"].flatMap((s) => [
      [`${s}.nsga2_regret`, row(s, "nsga2").regret_mean!],
      [`${s}.random_regret`, row(s, "random").regret_mean!],
      [`${s}.best_agent_regret`, bestAgentRegret(s)],
      [`${s}.nsga2_hv`, row(s, "nsga2").hv_frac_mean!],
      [`${s}.best_agent_hv`, bestAgentHv(s)],
      [`${s}.min_agent_hv`, minAgentHv(s)],
      [`${s}.front`, gt[s]!.front.length],
      [`${s}.feasible`, gt[s]!.n_feasible],
    ]),
  ),
  "regret.agent_beats_nsga2": [
    "dds_250msps",
    "high_precision",
    "low_area_control",
  ]
    .map(
      (sp) =>
        agentRows(sp).filter(
          (r) => r.regret_mean! < row(sp, "nsga2").regret_mean!,
        ).length,
    )
    .reduce((a, b) => a + b, 0),
  "regret.agent_rows": ["dds_250msps", "high_precision", "low_area_control"]
    .map((sp) => agentRows(sp).length)
    .reduce((a, b) => a + b, 0),
  // costs (measured)
  "cost.sonnet.per_run": sonnet.cost_per_run,
  "cost.sonnet.wall_s": sonnet.wall_s_mean,
  "cost.qwen.per_run": qwen.cost_per_run,
  "cost.qwen_off.per_run": qwenOff.cost_per_run,
  "cost.qwen.speedup": qwen.wall_s_mean / qwenOff.wall_s_mean,
  "cost.qwen.cheaper": qwen.cost_per_run / qwenOff.cost_per_run,
  "cost.min_per_run": Math.min(...costs.models.map((m) => m.cost_per_run)),
  "cost.max_per_run": Math.max(...costs.models.map((m) => m.cost_per_run)),
  "cost.min_wall_s": Math.min(...costs.models.map((m) => m.wall_s_mean)),
  "cost.max_wall_s": Math.max(...costs.models.map((m) => m.wall_s_mean)),
  // projection from the measured means: one agent, back to back, for a day
  "proj.sonnet.runs_per_day": DAY_S / sonnet.wall_s_mean,
  "proj.sonnet.usd_per_day": (DAY_S / sonnet.wall_s_mean) * sonnet.cost_per_run,
  // hero run
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
    case "spct":
      return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
    case "x":
      return `${sig(v, 2)}×`;
    case "s":
      return `${sig(v, 3)} s`;
    case "f1":
      return v.toFixed(1);
    case "f3":
      return v.toFixed(3);
    default:
      return sig(v);
  }
}

export const V_ = (name: string, fmt: Fmt = "num"): string =>
  formatValue(lookup(name), fmt);
