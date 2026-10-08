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
import type { HillClimb, GroundTruth, Hero, Level, SpecInfo } from "./data";
import type { DatapathFrame } from "./datapath";
import { isPipelined, latencyCycles, steps, type Arch } from "./families";
import type { HeroFrame } from "./hero";
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

export function heroCaption(
  f: HeroFrame,
  hero: Hero,
  spec: SpecInfo,
  ladder: Level[],
): string {
  const planned = ladder.filter((l) => l.status !== "live");
  switch (f.phase) {
    case "spec":
      return `L0 spec intake: ${spec.name}, ${constraintText(spec)}. The spec validates; a human would confirm it here (the eval runs auto-approve).`;
    case "space":
      return `L1 analytical exploration: ${hero.n_families} architecture families, ${fmtInt(hero.n_designs)} possible designs. Code scores every one it is asked about; the LLM never produces a number.`;
    case "propose": {
      const d = hero.decisions[f.call!]!;
      return `The LLM (${hero.model}) plans: explore ${(d.families ?? []).join(" and ")}, fanned out with Send. ${fmtInt(d.input_tokens + d.output_tokens)} tokens, ${fmtUsd(d.cost_usd)}.`;
    }
    case "round": {
      const r = hero.rounds[f.round - 1]!;
      const fams = Object.entries(r.families)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ");
      return `Round ${r.round}: NSGA-II evaluates ${r.evals} designs (${fams}); ${r.feasible} meet the spec. ${fmtInt(f.feasible)} feasible so far, Pareto front ${f.front}.`;
    }
    case "analyse": {
      const d = hero.decisions[f.call!]!;
      return `The LLM reads the summary and decides: ${d.decision}. ${fmtInt(d.input_tokens + d.output_tokens)} tokens, ${fmtUsd(d.cost_usd)}.`;
    }
    case "select": {
      const s = hero.selected;
      return `Selected: ${designName(s.family, s.params)}, ${fmtInt(s.luts_plus_ffs)} LUTs+FFs and ${trim(s.throughput_msps)} MSPS (estimates), max error ${pow2(s.max_abs_err)} (exact): ${signedPct(hero.select_regret)} from the true optimum.`;
    }
    case "check":
      return `Checked at each live level: L0's spec is schema-validated; L1's accuracy numbers come from a golden model that is bit-exact against the reference RTL on all 65,536 input angles.`;
    case "planned":
      return `Not run: ${planned.length} levels are planned (${[...new Set(planned.map((l) => l.milestone))].sort().join(", ")}), shown ghosted. Whole run: ${hero.llm_calls} LLM calls, ${fmtUsd(hero.cost_usd)}, ${trim(hero.wall_s)} s.`;
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
    case "explore":
      return `Round ${f.round}, Send fan-out: ${f.jobs.map((j) => `${j.family} ${j.evals}`).join(", ")} evaluations in parallel branches (NSGA-II inside each family). ${fmtInt(f.evaluated)} evaluated so far, ${fmtInt(f.feasible)} met the spec.`;
    case "rule": {
      const r = run.rounds[f.round - 1]!;
      return `Hard rule (code, not the LLM): ${r.rules.join("; ")}. Effective decision: ${r.decision}.`;
    }
    case "select": {
      const s = run.selected!;
      return `select: the spec's rule (${spec.select_direction} ${spec.select_by}) picks ${designName(s.family, s.params)}, ${signedPct(run.select_regret!)} from the true optimum.`;
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
    return `Plan (${run.label}, seed ${run.seed}): ${r.jobs.map((j) => `${j.family} ${j.evals}`).join(", ")} evaluations. "${clip(r.plan_rationale, 140)}"`;
  }
  if (f.phase === "round") {
    const r = run.rounds[f.round - 1]!;
    const hv =
      f.hvFrac === null ? "" : `, ${pct(f.hvFrac, 1)} of the true hypervolume`;
    const ruled =
      r.decision !== r.llm_decision
        ? `; code overrode it to ${r.decision}`
        : "";
    return `Round ${r.round}: ${r.evals} designs evaluated, ${fmtInt(f.feasible)} feasible so far, ${f.front.length} on the front found${hv}. The LLM decided ${r.llm_decision ?? "nothing (no valid answer)"}${ruled}.`;
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
): string {
  if (e === 0)
    return `${specName}: every method starts with nothing. The true front's hypervolume is 1.0.`;
  const parts = spec.methods.map(
    (m) =>
      `${m.label} ${methodAt(m, e).toFixed(3)}${m.agent && stoppedBy(m) <= e ? " (stopped)" : ""}`,
  );
  return `After ${e} evaluations: ${parts.join(", ")}. Leading: ${leader(spec, e).label}.`;
}
