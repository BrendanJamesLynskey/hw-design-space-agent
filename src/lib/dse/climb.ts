/**
 * The Why page's animation: "micro-optimise the default design" against "explore first", as
 * states over the real data. The hill-climb path and the iterative family's ceiling were
 * computed by scripts/export_dse.py with the repo's own evaluate() on every design of the
 * iterative family; the explored designs are the exhaustive ground truth's Pareto front for
 * the same spec. Nothing here is drawn by hand.
 */
import type { Design, GroundTruth, HillClimb } from "./data";

export type ClimbPhase = "climb" | "ceiling" | "explore" | "select";

export type ClimbFrame = {
  phase: ClimbPhase;
  /** How many hill-climb steps are drawn (the trail). */
  pathShown: number;
  showCeiling: boolean;
  showFront: boolean;
  showSelected: boolean;
  /** The equation term to highlight. */
  hl: string;
};

export function climbFrames(c: HillClimb): ClimbFrame[] {
  const out: ClimbFrame[] = c.path.map((_, i) => ({
    phase: "climb",
    pathShown: i + 1,
    showCeiling: false,
    showFront: false,
    showSelected: false,
    hl: i === 0 ? "iter" : "n",
  }));
  const n = c.path.length;
  out.push({
    phase: "ceiling",
    pathShown: n,
    showCeiling: true,
    showFront: false,
    showSelected: false,
    hl: "iter",
  });
  out.push({
    phase: "explore",
    pathShown: n,
    showCeiling: true,
    showFront: true,
    showSelected: false,
    hl: "pipe",
  });
  out.push({
    phase: "select",
    pathShown: n,
    showCeiling: true,
    showFront: true,
    showSelected: true,
    hl: "pipe",
  });
  return out;
}

/** The headline numbers of the comparison. */
export function climbGap(c: HillClimb, gt: GroundTruth) {
  const end = c.path[c.path.length - 1]!;
  const sel = gt.selected as Design;
  return {
    climbed: end,
    ceiling: c.iterative_ceiling,
    explored: sel,
    /** Throughput of the explored design over the best the iterative family can do. */
    throughputRatio: sel.throughput_msps / c.iterative_ceiling.throughput_msps,
    /** Throughput the spec asks for over the iterative ceiling. */
    shortfall: c.throughput_min / c.iterative_ceiling.throughput_msps,
  };
}
