/**
 * Cycle-by-cycle occupancy of the four CORDIC families' datapaths, for the case study's
 * datapath animation. The schedule is the one the repo's families.py describes: the FSM
 * families (iterative, unrolled_k) take one angle at a time through IDLE, PREROTATE,
 * ceil(N/k) iteration cycles and OUTPUT; the pipelined families accept a new angle every cycle
 * and pass it through a pre-rotation stage, ceil(N/m) rotation stages and an output register.
 * tests/unit/datapath.test.ts checks the first-result cycle and the steady-state rate against
 * the Python reference's latency_cycles and results_per_cycle for every fixture design.
 */
import {
  isPipelined,
  latencyCycles,
  rotationsPerStep,
  steps,
  type Arch,
} from "./families";

export type Token = {
  /** The angle's sequence number (0, 1, 2, ...). */
  id: number;
  /** Datapath slot: 0 = input / pre-rotation, 1..steps = rotation steps, steps+1 = output. */
  slot: number;
  /** For the FSM families: the IDLE cycle (slot -1 = waiting at the input). */
  idle: boolean;
  /** Micro-rotations this token has completed by the end of the cycle. */
  rotationsDone: number;
};

export type DatapathFrame = {
  cycle: number;
  tokens: Token[];
  /** Results delivered by the end of this cycle. */
  completed: number;
};

/** Cycles to animate: two results for the FSM families, a filled pipe and a few more for the pipelined ones. */
export function cyclesFor(a: Arch): number {
  const L = latencyCycles(a);
  return isPipelined(a) ? L + 6 : 2 * L + 1;
}

export function datapathFrame(a: Arch, t: number): DatapathFrame {
  const L = latencyCycles(a);
  const st = steps(a);
  const r = rotationsPerStep(a);
  const n = a.numerics.nIter;
  if (!isPipelined(a)) {
    const id = Math.floor(t / L);
    const p = t - id * L;
    // p = 0: IDLE (accept), 1: PREROTATE, 2..st+1: iterations, st+2 = L-1: OUTPUT
    const slot = p === 0 ? 0 : p === 1 ? 0 : p <= st + 1 ? p - 1 : st + 1;
    const rot = p <= 1 ? 0 : Math.min(n, (p - 1) * r);
    return {
      cycle: t,
      tokens: [{ id, slot, idle: p === 0, rotationsDone: rot }],
      completed: Math.floor((t + 1) / L),
    };
  }
  const tokens: Token[] = [];
  for (let id = Math.max(0, t - L + 1); id <= t; id++) {
    const s = t - id;
    tokens.push({
      id,
      slot: s,
      idle: false,
      rotationsDone: s === 0 ? 0 : Math.min(n, s * r),
    });
  }
  return { cycle: t, tokens, completed: Math.max(0, t - L + 2) };
}

export function datapathFrames(a: Arch): DatapathFrame[] {
  const out: DatapathFrame[] = [];
  for (let t = 0; t < cyclesFor(a); t++) out.push(datapathFrame(a, t));
  return out;
}

/** The cycle in which the first result is delivered (= latency - 1, 0-based). */
export function firstResultCycle(frames: DatapathFrame[]): number {
  return frames.findIndex((f) => f.completed >= 1);
}
