/**
 * The hypervolume race (Results): how much of the true front's hypervolume each method has
 * covered after e evaluations, per feasible spec. The curves are exported by
 * scripts/export_dse.py: NSGA-II and random search re-run with the repository's own code at the
 * vendored commit (each re-run reproduces the recorded result exactly), the agents from their
 * recorded evaluations. Each method's line is the mean of its three seeds; a run that stopped
 * early keeps its final value (it spent no more evaluations).
 */
import RACE from "@/data/race.json";

export type RaceSeed = {
  seed: number;
  n: number;
  evals_to_95: number | null;
  hv_frac: number | null;
  /** HV fraction after every `step` evaluations, and after the last. */
  curve: number[];
  run?: string;
};

export type RaceMethod = {
  method: string;
  label: string;
  agent: boolean;
  seeds: RaceSeed[];
};

export type RaceSpec = {
  hv_true: number;
  budget: number;
  methods: RaceMethod[];
};

export type Race = { step: number; specs: Record<string, RaceSpec> };

export const race = RACE as unknown as Race;

/** One seed's HV fraction after `e` evaluations (its final value once it has stopped). */
export function seedAt(s: RaceSeed, e: number, step = race.step): number {
  if (e <= 0) return 0;
  if (e >= s.n) return s.curve[s.curve.length - 1]!;
  const k = Math.floor(e / step);
  if (k === 0) return 0;
  return s.curve[k - 1]!;
}

/** A method's mean over its seeds after `e` evaluations. */
export function methodAt(m: RaceMethod, e: number): number {
  return m.seeds.reduce((a, s) => a + seedAt(s, e), 0) / m.seeds.length;
}

/** The evaluation count by which every seed of a method had stopped. */
export function stoppedBy(m: RaceMethod): number {
  return Math.max(...m.seeds.map((s) => s.n));
}

/** The race's frames: every RACE_FRAME evaluations from 0 to the budget. */
export const RACE_FRAME = 10;
export function raceSteps(spec: RaceSpec): number[] {
  const out: number[] = [];
  for (let e = 0; e <= spec.budget; e += RACE_FRAME) out.push(e);
  return out;
}

/** Who leads after `e` evaluations. */
export function leader(spec: RaceSpec, e: number): RaceMethod {
  return spec.methods.reduce((a, b) =>
    methodAt(b, e) > methodAt(a, e) ? b : a,
  );
}
