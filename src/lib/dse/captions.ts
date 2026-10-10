/**
 * The live caption of every animation (one line per step, also sent to an aria-live region).
 * Pure functions of the model's state, so the e2e frame tests can rebuild the expected text
 * from the same data and compare it with the page.
 */
import {
  clip,
  designName,
  fmtInt,
  fmtUsd,
  pct,
  pow2,
  signedPct,
  trim,
} from "@/lib/format";

import type { Rotation, Numerics } from "./cordic";
import { codeToRad, xyToReal, zToRad, atanLut } from "./cordic";
import type { ClimbFrame } from "./climb";
import type {
  Glance,
  HillClimb,
  GroundTruth,
  Hero,
  Level,
  SpecInfo,
} from "./data";
import type { DatapathFrame } from "./datapath";
import { isPipelined, latencyCycles, steps, type Arch } from "./families";
import type { HeroFrame } from "./hero";
import type { FormalRow, HighPrecision, ScatterPoint, Worked } from "./ladder";
import {
  descentBars,
  hpMeets,
  hpMsps,
  rmsPct,
  scatterPoints,
  shiftValue,
  type DescentStep,
  type HpFrame,
  type HpView,
  type Metric,
  type ScatterFrame,
  type ShiftFrame,
  type ShiftMetric,
} from "./m2frames";
import { leader, methodAt, stoppedBy, type RaceSpec } from "./race";
import type { ReplayFrame } from "./replay";
import type { Call, RunData } from "./runs";
import type { TraceFrame } from "./trace";

const deg = (rad: number): string => `${trim((rad * 180) / Math.PI, 4)}°`;

function constraintText(s: SpecInfo): string {
  return s.constraints
    .map((c) =>
      c.metric === "max_abs_err"
        ? `max error ≤ ${pow2(c.value, 0)}`
        : `≥ ${trim(c.value)} MSPS`,
    )
    .join(", ");
}

const MODEL_ERR = (est: number, meas: number) => signedPct(est / meas - 1);

export function heroCaption(
  f: HeroFrame,
  hero: Hero,
  spec: SpecInfo,
  ladder: Level[],
  w: Worked,
): string {
  const planned = ladder.filter((l) => l.status !== "live");
  const ba = hero.back_annotation;
  switch (f.phase) {
    case "spec":
      return `L0 spec intake: ${spec.name}, ${constraintText(spec)}. The spec validates; a human would confirm it here (the eval runs auto-approve).`;
    case "space":
      return `L1 analytical exploration: ${hero.n_families} architecture families, ${fmtInt(hero.n_designs)} possible designs. Code scores every one it is asked about; the LLM never produces a number.`;
    case "propose": {
      const d = hero.decisions[f.call!]!;
      return `The LLM (${hero.label}) plans: explore ${(d.families ?? []).join(" and ")}, fanned out with Send. ${fmtInt(d.input_tokens + d.output_tokens)} tokens, ${fmtUsd(d.cost_usd)}.`;
    }
    case "round": {
      const r = hero.rounds[f.round - 1]!;
      const fams = Object.entries(r.families)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ");
      const who = r.by_code
        ? "a front-mapping round (code's NSGA-II over the front families' ranges)"
        : "NSGA-II inside the LLM's boxes";
      return `Round ${r.round}, ${who}: ${r.evals} designs (${fams}); ${r.feasible} meet the spec. ${fmtInt(f.feasible)} feasible so far, Pareto front ${f.front}.`;
    }
    case "analyse": {
      const d = hero.decisions[f.call!]!;
      return `The LLM reads the summary and decides: ${d.decision}. ${fmtInt(d.input_tokens + d.output_tokens)} tokens, ${fmtUsd(d.cost_usd)}.`;
    }
    case "select": {
      const s = hero.selected;
      return `Selected: ${designName(s.family, s.params)}, ${fmtInt(s.luts_plus_ffs)} LUTs+FFs and ${trim(s.throughput_msps)} MSPS (estimates), max error ${pow2(s.max_abs_err)} (exact): the true optimum. Next: down the ladder.${f.skipped.length ? ` The system and cycle levels (${f.skipped.join(", ")}, live since M3) have nothing to do here: this spec has no system scenario, and this M2 run's graph had no L2 node.` : " (SimPy and cycle-level are not built yet, so it skips them.)"}`;
    }
    case "rtl":
      return `L3: the generator emits ${w.rtl.module} (${w.rtl.lines} lines of SystemVerilog); ${w.l3.map((r) => r.version.split(" 20")[0]).join(" and ")} simulate all ${fmtInt(w.l3[0]!.n_angles)} input angles: ${w.l3.reduce((a, r) => a + r.mismatches, 0)} mismatches against the golden model, latency ${w.l3[0]!.latency} cycles as documented (exact).`;
    case "synth":
      return `L4: Yosys + nextpnr-xilinx on ${w.l4.part}: ${fmtInt(w.l4.luts)} LUTs, ${fmtInt(w.l4.ffs)} FFs, ${trim(w.l4.fmax_mhz, 4)} MHz after place-and-route (measured). L1 estimated ${trim(w.l1.luts, 4)} / ${trim(w.l1.ffs, 3)} / ${trim(w.l1.fmax_mhz, 4)}.`;
    case "gate":
      return `Gate level: the synthesised netlist (${w.gate.luts} LUT, ${w.gate.ffs} FF, ${w.gate.carry4} CARRY4 cells), simulated on all ${fmtInt(w.gate.n_angles)} angles: ${w.gate.mismatches} mismatches, latency ${w.gate.latency} (exact).`;
    case "annotate":
      return `L5, the run's own back-annotation node: LUTs ${ba.luts![0]} → ${ba.luts![1]}, Fmax ${ba.fmax_mhz![0]} → ${ba.fmax_mhz![1]} MHz (${signedPct(ba.fmax_mhz![2] / 100)}); ${ba.verdict!.replace(/\.$/, "")}. At the measured clock it still delivers ${trim(w.l5.throughput_msps)} MSPS against ≥ ${trim(hero.min_msps)}.`;
    case "planned":
      return `${planned.length ? `Not run: ${planned.length} levels are planned (${[...new Set(planned.map((l) => l.milestone))].sort().join(", ")}), shown ghosted.` : "Every level of the ladder is live at this commit; milestone 4 (an ASIC cost model, a fleet of agents) is planned and has no results."} Whole run: ${hero.llm_calls} LLM calls, ${fmtUsd(hero.cost_usd)}, ${trim(hero.wall_s)} s.`;
  }
}

export function climbCaption(
  f: ClimbFrame,
  c: HillClimb,
  gt: GroundTruth,
): string {
  if (f.phase === "climb") {
    const s = c.path[f.pathShown - 1]!;
    const head =
      f.pathShown === 1
        ? "Start from the reference design, iterative W=16 N=14"
        : `Step ${f.pathShown - 1}: ${s.move}`;
    return `${head}: ${fmtInt(s.luts)} LUTs, ${trim(s.throughput_msps)} MSPS, ${trim(s.accuracy_bits, 4)} accuracy bits${s.meets_accuracy ? " (meets 2^-13)" : ""}.`;
  }
  const ceil = c.iterative_ceiling;
  if (f.phase === "ceiling")
    return `No neighbour is better. The best any of the ${fmtInt(c.iterative_designs)} iterative designs can do at this accuracy is ${trim(ceil.throughput_msps)} MSPS: the spec asks for ${trim(c.throughput_min)}.`;
  const sel = gt.selected!;
  if (f.phase === "explore")
    return `Explore first: the true Pareto front across all four families has ${gt.front.length} designs, every one above ${trim(c.throughput_min)} MSPS.`;
  return `The spec's choice: ${designName(sel.family, sel.params)}, ${fmtInt(sel.luts)} LUTs at ${trim(sel.throughput_msps)} MSPS, ${trim(sel.throughput_msps / ceil.throughput_msps, 3)}× the iterative ceiling.`;
}

export function rotationCaption(r: Rotation, c: Numerics, i: number): string {
  const s = r.states[i]!;
  const z = zToRad(s.z, c.angleWidth);
  if (i === 0)
    return `Input ${deg(codeToRad(r.theta, c.dataWidth))} (code ${r.theta}): quadrant ${r.quadrant}${r.quadrant === 1 || r.quadrant === 2 ? ", pre-rotated by π" : ""}; x starts at K·1, residual angle z = ${deg(z)}.`;
  const a = atanLut(c.nIter, c.angleWidth)[i - 1]!;
  const theta = codeToRad(r.theta, c.dataWidth);
  const ex = Math.abs(xyToReal(s.x, c) - Math.cos(theta));
  const ey = Math.abs(xyToReal(s.y, c) - Math.sin(theta));
  const lsb = 2 ** -(c.dataWidth - 2);
  return `Iteration ${i}: z was ${s.sigma > 0 ? "≥ 0" : "< 0"}, so rotate by ${s.sigma > 0 ? "−" : "+"}atan(2^-${i - 1}) (LUT ${a}); residual ${deg(z)}, error ${trim(Math.max(ex, ey) / lsb)} LSB.`;
}

export function datapathCaption(
  f: DatapathFrame,
  a: Arch,
  name: string,
): string {
  const L = latencyCycles(a);
  const st = steps(a);
  if (!isPipelined(a)) {
    const t = f.tokens[0]!;
    const where = t.idle
      ? "accepted (IDLE)"
      : t.slot === 0
        ? "pre-rotated"
        : t.slot <= st
          ? `rotation cycle ${t.slot}/${st}: ${t.rotationsDone}/${a.numerics.nIter} micro-rotations done`
          : "output";
    return `Cycle ${f.cycle}: ${name}, angle ${t.id} ${where}. One angle at a time; ${f.completed} result${f.completed === 1 ? "" : "s"} out (one every ${L} cycles).`;
  }
  const n = f.tokens.length;
  return `Cycle ${f.cycle}: ${name}, ${n} angle${n === 1 ? "" : "s"} in flight across ${st + 2} stages; ${f.completed} result${f.completed === 1 ? "" : "s"} out (first after ${L} cycles, then one per cycle).`;
}

const tokens = (i: number, o: number) => `${fmtInt(i + o)} tokens`;

function callText(c: Call, model: string): string {
  if (!c.ok)
    return `${c.node} (LLM, ${model}), attempt ${c.attempt}: the call failed (${c.error ?? "error"}) after ${trim(c.latency_s)} s; ${
      c.input_tokens + c.output_tokens > 0
        ? `it reported ${tokens(c.input_tokens, c.output_tokens)} and ${fmtUsd(c.cost_usd)}.`
        : "no usage was reported."
    }`;
  const usage = `${tokens(c.input_tokens, c.output_tokens)}, ${fmtUsd(c.cost_usd)}, ${trim(c.latency_s)} s.`;
  if (c.node === "propose")
    return `propose (LLM, ${model}): explore ${(c.families ?? []).join(" and ")}. ${usage}`;
  return `analyse, round ${c.round} (LLM, ${model}): code has computed the front and its hypervolume; the LLM decides ${c.decision}. ${usage}`;
}

export function traceCaption(
  f: TraceFrame,
  run: RunData,
  spec: SpecInfo,
): string {
  switch (f.kind) {
    case "intake":
      return `intake: the ${spec.name} spec (${constraintText(spec)}) is ${run.intake.replace(/;.*$/, "").replace(/^provided/, "given")}; no LLM call is needed.`;
    case "confirm":
      return `confirm_spec: interrupt() would stop here for a human to approve, edit or reject the spec; the eval runs auto-approve it.`;
    case "llm":
      return callText(run.calls[f.call!]!, run.label);
    case "explore": {
      const r = run.rounds[f.round - 1]!;
      const head = r.plan_by_code
        ? `Round ${f.round}, a front-mapping round planned by code (NSGA-II over the front families' ranges): `
        : `Round ${f.round}, Send fan-out: `;
      return `${head}${f.jobs.map((j) => `${j.family} ${j.evals}`).join(", ")} evaluations in parallel branches. ${fmtInt(f.evaluated)} evaluated so far, ${fmtInt(f.feasible)} met the spec.${r.llm_call ? "" : " No LLM call follows: code spent the remaining budget mapping the front before stopping."}`;
    }
    case "rule": {
      const r = run.rounds[f.round - 1]!;
      return `Hard rule (code, not the LLM): ${r.rules.join("; ")}. Effective decision: ${r.decision}.`;
    }
    case "select": {
      const s = run.selected!;
      return `select: the spec's rule (${spec.select_direction} ${spec.select_by}) picks ${designName(s.family, s.params)}, ${signedPct(run.select_regret!)} from the true optimum.`;
    }
    case "annotate": {
      const b = run.back_annotation!;
      if (!b.compared)
        return `back_annotate (L5, code): no measured data for the selected design in the L4 table, so there is nothing to compare; the winner stands as estimated.`;
      return `back_annotate (L5, code): the selected design was synthesised in L4. LUTs ${b.luts![0]} → ${b.luts![1]}, FFs ${b.ffs![0]} → ${b.ffs![1]}, Fmax ${b.fmax_mhz![0]} → ${b.fmax_mhz![1]} MHz (estimate → measured, ${b.tool!.split(" ")[0]}); ${b.verdict!.replace(/\.$/, "")}.`;
    }
    case "report":
      return `report: ${run.verdict.replace(/\.$/, "")}. ${f.calls} LLM call${f.calls === 1 ? "" : "s"} (${f.failed} failed), ${tokens(f.inputTokens, f.outputTokens)}, ${fmtUsd(f.costUsd)}; ${trim(run.wall_s)} s wall-clock.`;
  }
}

export function replayCaption(
  f: ReplayFrame,
  run: RunData,
  gt: GroundTruth,
): string {
  if (f.phase === "plan") {
    const r = run.rounds[0]!;
    return `Plan (${run.label}, ${run.milestone.toUpperCase()} seed ${run.seed}): ${r.jobs.map((j) => `${j.family} ${j.evals}`).join(", ")} evaluations. "${clip(r.plan_rationale, 140)}"`;
  }
  if (f.phase === "round") {
    const r = run.rounds[f.round - 1]!;
    const hv =
      f.hvFrac === null ? "" : `, ${pct(f.hvFrac, 1)} of the true hypervolume`;
    const ruled =
      r.decision !== r.llm_decision
        ? `; code overrode it to ${r.decision}`
        : "";
    if (!r.llm_call)
      return `Round ${r.round}: code's final front-mapping round, ${r.evals} designs evaluated, ${fmtInt(f.feasible)} feasible so far, ${f.front.length} on the front found${hv}. No LLM call: the run then stops, as decided before it.`;
    return `Round ${r.round}${r.plan_by_code ? " (front-mapping, planned by code)" : ""}: ${r.evals} designs evaluated, ${fmtInt(f.feasible)} feasible so far, ${f.front.length} on the front found${hv}. The LLM decided ${r.llm_decision ?? "nothing (no valid answer)"}${ruled}.`;
  }
  if (run.llm_declared_infeasible)
    return `The LLM declared the spec infeasible after ${fmtInt(run.n_evals)} evaluations, naming its binding constraint. The exhaustive grid agrees: the fastest of all ${fmtInt(gt.n_designs)} designs reaches ${trim(gt.best_throughput_msps_any)} MSPS.`;
  const s = run.selected!;
  const t = gt.selected!;
  const same = s.key === t.key;
  return `Selected ${designName(s.family, s.params)}: ${same ? "the true optimum" : `${signedPct(run.select_regret!)} from the true optimum, ${designName(t.family, t.params)}`}. The front found covers ${pct(run.hv_frac ?? 0, 1)} of the true hypervolume.`;
}

export function raceCaption(
  e: number,
  spec: RaceSpec,
  specName: string,
  ms = "M2",
): string {
  if (e === 0)
    return `${ms}, ${specName}: every method starts with nothing. The true front's hypervolume is 1.0.`;
  const parts = spec.methods.map(
    (m) =>
      `${m.label} ${methodAt(m, e).toFixed(3)}${m.agent && stoppedBy(m) <= e && stoppedBy(m) < spec.budget ? " (stopped)" : ""}`,
  );
  return `After ${e} evaluations: ${parts.join(", ")}. Leading: ${leader(spec, e).label}.`;
}

// ---------------------------------------------------------------------------
// Milestone 2's animations
// ---------------------------------------------------------------------------

const METRIC_NAME = { luts: "LUTs", ffs: "FFs", fmax_mhz: "Fmax" } as const;

export function descentCaption(
  f: DescentStep,
  w: Worked,
  formalRows: FormalRow[],
): string {
  const name = designName(w.family, w.params);
  switch (f.phase) {
    case "l1":
      return `L1 (${w.spec}'s true optimum, ${name}): ${trim(w.l1.luts, 4)} LUTs, ${trim(w.l1.ffs, 3)} FFs, ${trim(w.l1.fmax_mhz, 4)} MHz → ${trim(w.l1.throughput_msps)} MSPS (estimate, M1 calibration); max error ${pow2(w.l1.max_abs_err)} over all ${fmtInt(w.l1.n_angles)} angles (exact).`;
    case "rtl":
      return `L3: the generator emits ${w.rtl.module}, ${w.rtl.lines} lines of SystemVerilog; its atan table and gain constant come from the golden model's own functions, not a second copy.`;
    case "sim": {
      const r = w.l3[f.sim!]!;
      return `${r.version}: all ${fmtInt(r.n_angles)} input angles, every cos and sin code compared with the golden model: ${r.mismatches} mismatches; latency ${r.latency} cycles, documented ${r.latency_expected} (exact).`;
    }
    case "formal": {
      const mine = formalRows.filter((x) => x.family === w.family);
      return `Formal: SymbiYosys proves the ${w.family} family's ${mine.map((x) => x.kind).join(" and ")} properties by k-induction (${mine.map((x) => `${x.job}, depth ${x.depth}: ${x.status}`).join("; ")}). Proofs run at W = 8; wider designs are simulated.`;
    }
    case "synth":
      return `L4: synthesised, placed and routed on ${w.l4.part} (Yosys + nextpnr-xilinx): ${fmtInt(w.l4.luts)} LUTs, ${fmtInt(w.l4.ffs)} FFs; Fmax ${w.l4.fmax_seeds.map((x) => trim(x, 4)).join(" / ")} MHz over three placement seeds, median ${trim(w.l4.fmax_mhz, 4)} (measured).`;
    case "gate":
      return `Gate level: the Yosys netlist (${w.gate.luts} LUT, ${w.gate.ffs} FF, ${w.gate.carry4} CARRY4 cells) simulated with the vendor's cell models, zero-delay: ${w.gate.mismatches} mismatches on ${fmtInt(w.gate.n_angles)} angles, latency ${w.gate.latency} (exact).`;
    case "compare":
      return `Measured against estimated: ${descentBars(w)
        .map((b) => `${METRIC_NAME[b.metric]} ${MODEL_ERR(b.est, b.meas)}`)
        .join(
          ", ",
        )}. L1's model, calibrated on two Vivado designs, is off by tens of percent against this tool.`;
    case "refit":
      return `L5 refit (${w.l5.calibration}, times the fitted tool factors): ${descentBars(
        w,
      )
        .map(
          (b) =>
            `${METRIC_NAME[b.metric]} ${trim(b.refit, 4)} (${MODEL_ERR(b.refit, b.meas)})`,
        )
        .join(", ")}. The errors shrink; it is an estimate still.`;
    case "verdict":
      return `back_annotate: ${w.l5.measured_front} of ${w.l5.front} front designs measured, winner changed: ${w.l5.winner_changed ? "yes" : "no"}. At the measured clock, ${trim(w.l4.fmax_mhz, 4)} MHz / ${w.l5.cycles} cycles = ${trim(w.l5.throughput_msps)} MSPS against ≥ ${trim(w.l5.min_msps)}: ${w.l5.verdict}.`;
  }
}

const TOOL_NAME: Record<string, string> = {
  "yosys+nextpnr-xilinx": "Yosys + nextpnr-xilinx",
  vivado: "Vivado 2025.2 post-synthesis",
  "vivado post-route": "Vivado 2025.2 post-route",
};
const SCATTER_METRIC: Record<Metric, string> = {
  luts: "LUTs",
  ffs: "FFs",
  fmax: "Fmax",
};

export function scatterCaption(
  f: ScatterFrame,
  all: ScatterPoint[],
  nFit: number,
  m: Metric,
): string {
  const pts = scatterPoints(all);
  if (f.tools.length === 0)
    return `${SCATTER_METRIC[m]}: estimate across, measurement up, log scales. On the diagonal the model is right; the band is ±20%.`;
  const tool = f.tools[f.tools.length - 1]!;
  const mine = (t: string) => pts.filter((p) => p.tool === t);
  if (!f.refit)
    return `+ ${mine(tool).length} ${TOOL_NAME[tool]} designs${tool === "vivado post-route" ? " (reported, not fitted)" : ""}: the M1 model's ${SCATTER_METRIC[m]} is off by ${trim(rmsPct(mine(tool), m, false), 3)}% RMS.`;
  return `After the vivado-2025.2 refit (${nFit} fitted points, one factor per tool): ${f.tools
    .map(
      (t) =>
        `${TOOL_NAME[t]} ${trim(rmsPct(mine(t), m, false), 3)} → ${trim(rmsPct(mine(t), m, true), 3)}%`,
    )
    .join("; ")} RMS.`;
}

const HP_VIEW_NAME: Record<HpView, string> = {
  m1: "M1 estimate",
  refit: "vivado-2025.2 refit",
  post_synth: "Vivado post-synthesis",
  post_route: "Vivado post-route",
};

export function hpCaption(f: HpFrame, hp: HighPrecision): string {
  const [a, b] = hp.candidates;
  const line = (v: HpView) =>
    `m=${a.m} ${trim(hpMsps(hp, a.m, v), 4)} (${signedPct(hp.margin[v][String(a.m)]!)}), m=${b.m} ${trim(hpMsps(hp, b.m, v), 4)} MSPS (${signedPct(hp.margin[v][String(b.m)]!, 2)})`;
  switch (f.phase) {
    case "spec":
      return `${hp.spec}: ≥ ${trim(hp.min_msps)} MSPS at max error ≤ 2^-20, smallest LUT+FF wins. Two candidates, pipelined_m W=26 N=22: m=${a.m} (the exhaustive grid's winner) and m=${b.m}, ${trim((1 - (b.post_synth.luts + b.post_synth.ffs) / (a.post_synth.luts + a.post_synth.ffs)) * 100, 2)}% smaller in Vivado.`;
    case "verdict":
      return `Verdict: m=${a.m} stays the winner; m=${b.m} misses ${trim(hp.min_msps)} MSPS after routing. The post-synthesis margin (${signedPct(hp.margin.post_synth[String(b.m)]!, 2)}) is thinner than any model's error, and both were synthesised at 10 ns, not the 20 ns the spec needs: only the routed figure settles it.`;
    default: {
      const v = f.phase;
      const meets = (m: number) => (hpMeets(hp, m, v) ? "meets" : "misses");
      return `${HP_VIEW_NAME[v]}: ${line(v)}. m=${a.m} ${meets(a.m)}, m=${b.m} ${meets(b.m)} the constraint.`;
    }
  }
}

export function shiftCaption(
  f: ShiftFrame,
  g: Glance,
  metric: ShiftMetric,
  labels: Record<string, string>,
): string {
  if (f.moved.length === 0)
    return metric === "hv"
      ? `M1 (3 seeds): each agent's front coverage as a fraction of NSGA-II's. Below 1, NSGA-II mapped more of the trade-off curve.`
      : `M1 (3 seeds): each agent's mean selection regret minus NSGA-II's. Below 0, the agent picked a design closer to the true optimum.`;
  const spec = f.moved[f.moved.length - 1]!;
  const parts = g.models.map((m) => {
    const [a, b] = shiftValue(g, spec, m, metric);
    return metric === "hv"
      ? `${labels[m]} ${a.toFixed(2)} → ${b.toFixed(2)}×`
      : `${labels[m]} ${signedPct(a)} → ${signedPct(b)}`;
  });
  return `${spec}, M1 → M2 (5 seeds): ${parts.join(", ")}.`;
}
