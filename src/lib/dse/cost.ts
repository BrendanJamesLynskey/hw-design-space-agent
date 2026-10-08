/**
 * TypeScript port of HW_Design_Space_Agent's analytical Artix-7 cost model
 * (`src/hw_dse/models/cost_fpga.py`) and of the metrics `hw_dse.evaluate` derives from it,
 * statement for statement and in the same floating-point order, so the numbers are identical
 * (tests/unit/cost.test.ts compares every field of tests/fixtures/cost.json exactly).
 *
 * Every number it returns is an *estimate*: the model's five free constants are calibrated to
 * two real synthesis results (the reference iterative and pipelined CORDICs at W = 16,
 * N = 14, Vivado 2025.2, xc7a35t). Away from those two points, and for the two families with
 * no anchor (unrolled_k, pipelined_m), it is an extrapolation. The calibration constants are
 * read from src/data/calibration.json, which scripts/export_dse.py copies from the vendored
 * calibration_artix7.yaml.
 */
import CAL from "@/data/calibration.json";

import { atanLut, xyWidth, zWidth } from "./cordic";
import {
  arch,
  isPipelined,
  latencyCycles,
  resultsPerCycle,
  rotationsPerStep,
  steps,
  type Arch,
} from "./families";

export type Calibration = typeof CAL;
export const CALIBRATION: Calibration = CAL;

/** LUT6 count for an n:1 mux built from 4:1 mux LUTs (0 for n <= 1). */
export function muxTreeLuts(nInputs: number): number {
  if (nInputs <= 1) return 0;
  let total = 0;
  let level = nInputs;
  while (level > 1) {
    level = Math.ceil(level / 4);
    total += level;
  }
  return total;
}

/** Logic levels of that tree: ceil(log4(n)). */
export function muxLevels(nInputs: number): number {
  return nInputs <= 1 ? 0 : Math.ceil(Math.log(nInputs) / Math.log(4) - 1e-9);
}

/** LUTs for one `width`-bit arithmetic barrel shifter over a set of shift amounts. */
export function shifterLuts(width: number, shifts: number[]): number {
  let total = 0;
  for (let b = 0; b < width; b++) {
    const sources = new Set(shifts.map((s) => Math.min(b + s, width - 1)));
    total += muxTreeLuts(sources.size);
  }
  return total;
}

function bitLength(v: number): number {
  let n = 0;
  while (v > 0) {
    v = Math.floor(v / 2);
    n++;
  }
  return n;
}

const bit = (e: number, b: number): number => Math.floor(e / 2 ** b) % 2;

/** LUTs for a small constant ROM read by a counter: one LUT6 per non-constant bit per 64 entries. */
export function romLuts(entries: number[]): number {
  if (new Set(entries).size <= 1) return 0;
  const bits = bitLength(Math.max(...entries));
  let nonconst = 0;
  for (let b = 0; b < bits; b++)
    if (new Set(entries.map((e) => bit(e, b))).size > 1) nonconst += 1;
  return nonconst * Math.ceil(entries.length / 64);
}

export type Structure = {
  arithBits: number;
  muxLuts: number;
  regBits: number;
  nMuxLevels: number;
  chain: number;
  adderBits: number;
};

/** For the FSM families: the shift amounts each of the k chained stages must support. */
export function stageShiftSets(a: Arch): number[][] {
  const n = a.numerics.nIter;
  const k = rotationsPerStep(a);
  const out: number[][] = [];
  for (let j = 0; j < k; j++) {
    const s: number[] = [];
    for (let i = j; i < n; i += k) s.push(i);
    out.push(s);
  }
  return out;
}

export function structure(a: Arch): Structure {
  const num = a.numerics;
  const w = num.dataWidth;
  const n = num.nIter;
  const g = num.fracGuard;
  const wx = xyWidth(num);
  const wz = zWidth(num);
  const rnd = num.rounding === "round";
  const outRoundBits = rnd && g > 0 ? 2 * w : 0;
  const lut = atanLut(n, num.angleWidth);
  const rotBits = 2 * wx + wz;

  if (!isPipelined(a)) {
    const k = rotationsPerStep(a);
    const st = steps(a);
    const cbits = st > 1 ? Math.max(1, Math.ceil(Math.log2(st))) : 1;
    const arith = k * rotBits + (cbits + 6) + outRoundBits;
    let mux = 0;
    let nMux = 0;
    for (const shifts of stageShiftSets(a)) {
      let perShifter = shifterLuts(wx, shifts);
      if (rnd) perShifter += muxTreeLuts(shifts.length);
      mux += 2 * perShifter;
      mux += romLuts(shifts.map((i) => lut[i] as number));
      nMux = Math.max(nMux, muxLevels(shifts.length));
    }
    const regs = rotBits + cbits + 2 + 2 + 1 + 2 * w;
    return {
      arithBits: arith,
      muxLuts: mux,
      regBits: regs,
      nMuxLevels: nMux,
      chain: k,
      adderBits: Math.max(wx, wz),
    };
  }

  const m = rotationsPerStep(a);
  const stages = steps(a);
  let arith = n * rotBits - 2 * wx - wz;
  arith += 5;
  arith += outRoundBits;
  const outBits = w + (rnd && g > 0 ? 1 : 0);
  let regs = 2 + wz + 1;
  for (let r = 1; r <= stages; r++) {
    const last = r === stages;
    if (last) regs += 2 * outBits + 1;
    else if (r === 1 && m === 1) regs += 2 + 2 + wz + 1;
    else regs += 2 * wx + wz + 1;
  }
  regs += 2 * w + 1;
  return {
    arithBits: arith,
    muxLuts: 0,
    regBits: regs,
    nMuxLevels: 0,
    chain: m,
    adderBits: Math.max(wx, wz),
  };
}

type Src = Calibration["source_constants"];

export function carryDelay(bits: number, src: Src): number {
  const n4 = Math.max(1, Math.ceil(bits / 4));
  if (n4 === 1) return src.t_carry_first_ns;
  return (
    src.t_carry_first_ns + (n4 - 2) * src.t_carry_mid_ns + src.t_carry_last_ns
  );
}

/** Critical path as (fixed ns, LUT levels, mux levels). */
export function pathTerms(
  s: Structure,
  a: Arch,
  src: Src,
): [number, number, number] {
  const tOvh = src.t_clk2q_ns + src.t_clk_overhead_ns;
  const carry = carryDelay(s.adderBits, src);
  if (isPipelined(a)) return [tOvh + s.chain * carry, s.chain + 1, 0.0];
  return [tOvh + s.chain * carry, s.chain, s.chain * s.nMuxLevels];
}

export type Estimate = {
  luts: number;
  ffs: number;
  fmaxMhz: number;
  criticalPathNs: number;
  switching: number;
  structure: Structure;
};

function raw(a: Arch, cal: Calibration = CALIBRATION): Estimate {
  const s = structure(a);
  const fit = cal.fitted;
  const luts = fit.c_arith * s.arithBits + fit.c_mux * s.muxLuts;
  const ffs = fit.c_ff * s.regBits;
  const [fixed, nLogic, nMux] = pathTerms(s, a, cal.source_constants);
  const path = fixed + nLogic * fit.t_logic_ns + nMux * fit.t_mux_ns;
  return {
    luts,
    ffs,
    fmaxMhz: 1000.0 / path,
    criticalPathNs: path,
    switching: luts + ffs,
    structure: s,
  };
}

export const estimate = raw;

/** (LUTs + FFs) * f * activity of the reference design at its reference clock. */
export function powerNorm(cal: Calibration = CALIBRATION): number {
  const ref = cal.power_reference;
  const r = raw(arch(ref.family as Arch["family"], ref.params as never), cal);
  return (r.luts + r.ffs) * ref.f_mhz * cal.source_constants.activity_factor;
}

export type Metrics = {
  luts: number;
  ffs: number;
  lutsPlusFfs: number;
  fmaxMhz: number;
  throughputMsps: number;
  latencyCycles: number;
  latencyNs: number;
  powerIndex: number;
  fOpMhz: number;
};

/**
 * The cost-side metrics `hw_dse.evaluate` derives (accuracy comes from the golden model).
 * `minThroughputMsps` is the spec's requirement, if any: the power index is taken at the
 * clock the design actually needs (capped at Fmax), as in the repo.
 */
export function metrics(a: Arch, minThroughputMsps?: number): Metrics {
  const e = raw(a);
  const rpc = resultsPerCycle(a);
  const thr = e.fmaxMhz * rpc;
  const fOp =
    minThroughputMsps === undefined
      ? e.fmaxMhz
      : Math.min(e.fmaxMhz, minThroughputMsps / rpc);
  const lat = latencyCycles(a);
  return {
    luts: e.luts,
    ffs: e.ffs,
    lutsPlusFfs: e.luts + e.ffs,
    fmaxMhz: e.fmaxMhz,
    throughputMsps: thr,
    latencyCycles: lat,
    latencyNs: (lat * 1000.0) / e.fmaxMhz,
    powerIndex:
      (e.switching * fOp * CALIBRATION.source_constants.activity_factor) /
      powerNorm(),
    fOpMhz: fOp,
  };
}

export const PROVENANCE = CALIBRATION.provenance;
