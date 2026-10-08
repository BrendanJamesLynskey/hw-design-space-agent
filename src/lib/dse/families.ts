/**
 * TypeScript port of the architecture registry's design point (`ArchConfig` in
 * `src/hw_dse/families.py` at the vendored commit): a family plus every parameter value, and
 * the schedule that maps N micro-rotations onto clock cycles. tests/unit/cost.test.ts checks
 * the schedule (steps, latency, results per cycle) against the Python reference.
 */
import { numerics, type Numerics, type Rounding } from "./cordic";

export const FAMILIES = [
  "iterative",
  "unrolled_k",
  "pipelined",
  "pipelined_m",
] as const;
export type Family = (typeof FAMILIES)[number];

export const FAMILY_SUMMARY: Record<Family, string> = {
  iterative:
    "1 micro-rotation per cycle on one shared datapath with barrel shifters; N+3 cycles per result (reference RTL)",
  unrolled_k:
    "k chained micro-rotations per cycle, same FSM; ceil(N/k)+3 cycles per result",
  pipelined:
    "one registered stage per micro-rotation; 1 result per cycle, N+2 latency (reference RTL)",
  pipelined_m:
    "a register every m stages; 1 result per cycle, ceil(N/m)+2 latency",
};

/** The registry's parameter ranges (families.py COMMON_PARAMS plus k and m). */
export const RANGES = {
  data_width: [8, 28],
  n_iter: [4, 30],
  angle_guard: [-2, 4],
  frac_guard: [0, 4],
  k: [2, 8],
  m: [2, 8],
} as const;

export type Params = {
  data_width: number;
  n_iter: number;
  angle_guard: number;
  frac_guard: number;
  rounding: Rounding;
  k?: number;
  m?: number;
};

export type Arch = {
  family: Family;
  numerics: Numerics;
  k: number;
  m: number;
};

export function arch(family: Family, p: Params): Arch {
  return {
    family,
    numerics: numerics(
      p.data_width,
      p.n_iter,
      p.angle_guard,
      p.frac_guard,
      p.rounding,
    ),
    k: family === "unrolled_k" ? (p.k ?? 1) : 1,
    m: family === "pipelined_m" ? (p.m ?? 1) : 1,
  };
}

export function params(a: Arch): Params {
  const n = a.numerics;
  const out: Params = {
    data_width: n.dataWidth,
    n_iter: n.nIter,
    angle_guard: n.angleWidth - n.dataWidth,
    frac_guard: n.fracGuard,
    rounding: n.rounding,
  };
  if (a.family === "unrolled_k") out.k = a.k;
  if (a.family === "pipelined_m") out.m = a.m;
  return out;
}

/** The repo's design key, e.g. "pipelined:data_width=18,n_iter=15,...". */
export function key(a: Arch): string {
  return (
    a.family +
    ":" +
    Object.entries(params(a))
      .map(([k, v]) => `${k}=${v}`)
      .join(",")
  );
}

export const isPipelined = (a: Arch): boolean =>
  a.family === "pipelined" || a.family === "pipelined_m";

/** k for the FSM families, m for the pipelined ones (capped at N). */
export function rotationsPerStep(a: Arch): number {
  return Math.min(isPipelined(a) ? a.m : a.k, a.numerics.nIter);
}

/** Iteration cycles (FSM families) or register stages (pipelined). */
export function steps(a: Arch): number {
  return Math.ceil(a.numerics.nIter / rotationsPerStep(a));
}

/** iterative: IDLE + PREROTATE + N iterations + OUTPUT; pipelined: pre-rotation + stages + output. */
export function latencyCycles(a: Arch): number {
  return steps(a) + (isPipelined(a) ? 2 : 3);
}

export function resultsPerCycle(a: Arch): number {
  return isPipelined(a) ? 1.0 : 1.0 / latencyCycles(a);
}
