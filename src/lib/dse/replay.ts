/**
 * The Pareto replay (Results): one recorded run, round by round. Frame 0 is the plan; frame k
 * adds round k's evaluations, redraws the front found so far (the Python reference's Pareto
 * mask, exported per round) and quotes the LLM's decision on it; the last frame compares the
 * design the run selected with the exhaustive ground truth's choice.
 */
import type { GroundTruth } from "./data";
import type { RunData } from "./runs";

export type ReplayFrame = {
  phase: "plan" | "round" | "result";
  /** Rounds shown (0 .. rounds.length). */
  round: number;
  /** Evaluations shown. */
  shown: number;
  /** Evaluation indices on the found front. */
  front: number[];
  feasible: number;
  hvFrac: number | null;
};

export function replayFrames(run: RunData): ReplayFrame[] {
  const frames: ReplayFrame[] = [
    {
      phase: "plan",
      round: 0,
      shown: 0,
      front: [],
      feasible: 0,
      hvFrac: run.hv_frac === null ? null : 0,
    },
  ];
  for (const r of run.rounds)
    frames.push({
      phase: "round",
      round: r.round,
      shown: r.total,
      front: r.front,
      feasible: r.feasible_cum,
      hvFrac: r.hv_frac,
    });
  const last = frames[frames.length - 1]!;
  frames.push({ ...last, phase: "result" });
  return frames;
}

/** Which evaluations the frame draws, and which of them are this round's (highlighted). */
export function pointsOf(
  run: RunData,
  f: ReplayFrame,
): { i: number; current: boolean }[] {
  const out: { i: number; current: boolean }[] = [];
  for (let i = 0; i < f.shown; i++)
    out.push({
      i,
      current: f.phase === "round" && run.points.round[i] === f.round,
    });
  return out;
}

/** The plot's extent: every evaluation of the run and the true front, padded. */
export function extent(
  run: RunData,
  gt: GroundTruth,
): { x: [number, number]; y: [number, number] } {
  const [ax, ay] = run.axes;
  const xs = [
    ...run.points.x,
    ...gt.front.map((d) => d[ax as keyof typeof d] as number),
  ];
  const ys = [
    ...run.points.y,
    ...gt.front.map((d) => d[ay as keyof typeof d] as number),
  ];
  const pad = (lo: number, hi: number): [number, number] => {
    const span = hi - lo || Math.abs(hi) * 0.1 || 1;
    return [lo - span * 0.05, hi + span * 0.05];
  };
  return {
    x: pad(Math.min(...xs), Math.max(...xs)),
    y: pad(Math.min(...ys), Math.max(...ys)),
  };
}

/**
 * The front as a staircase, sorted along x (both objectives in their own direction). For a
 * minimised y the step goes down-right; for a maximised y, up-right.
 */
export function staircase(
  xs: number[],
  ys: number[],
): { x: number; y: number }[] {
  const pts = xs.map((x, i) => ({ x, y: ys[i]! })).sort((a, b) => a.x - b.x);
  const out: { x: number; y: number }[] = [];
  pts.forEach((p, i) => {
    if (i > 0) out.push({ x: p.x, y: pts[i - 1]!.y });
    out.push(p);
  });
  return out;
}
