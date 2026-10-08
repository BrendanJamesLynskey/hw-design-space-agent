/**
 * The live caption of every animation (one line per step, also sent to an aria-live region).
 * Pure functions of the model's state, so the e2e frame tests can rebuild the expected text
 * from the same data and compare it with the page.
 */
import {
  designName,
  fmtInt,
  fmtUsd,
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
