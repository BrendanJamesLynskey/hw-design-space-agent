/**
 * TypeScript port of HW_Design_Space_Agent's bit-accurate CORDIC golden model
 * (`src/hw_dse/models/cordic_bitexact.py` at the vendored commit), statement for statement.
 *
 * The Python model is the source of truth for accuracy: for the reference configuration
 * (W = 16, N = 14) it is bit-exact against the reference RTL on all 65,536 input angles.
 * This port must produce the same integer outputs exactly; tests/unit/cordic.test.ts checks
 * every configuration in tests/fixtures/cordic.json (written by scripts/export_dse.py from the
 * installed Python reference), including a SHA-256 over all 2^W outputs for every W <= 16.
 *
 * Integers are JavaScript numbers: the widest register is W + 2 + g <= 34 bits for the
 * registry (W <= 28, g <= 4), far inside 2^53, so every addition and power-of-two division is
 * exact. Bitwise operators are 32-bit in JavaScript, so wrapping and shifting use arithmetic.
 */

export type Rounding = "trunc" | "round";

export type Numerics = {
  /** W: input angle and output width; output format Q1.(W-2). */
  dataWidth: number;
  /** N: micro-rotations. */
  nIter: number;
  /** A: angle path / atan-LUT width (W in the reference). */
  angleWidth: number;
  /** g: extra fractional bits on x and y. */
  fracGuard: number;
  rounding: Rounding;
};

/** MSB headroom on x, y and z, as in the reference (`[DATA_WIDTH+1:0]`). */
export const HEADROOM_BITS = 2;
/** Widths up to this are swept exhaustively (all 2^W angles). */
export const EXHAUSTIVE_MAX_WIDTH = 16;

export const REFERENCE: Numerics = {
  dataWidth: 16,
  nIter: 14,
  angleWidth: 16,
  fracGuard: 0,
  rounding: "trunc",
};

export function numerics(
  dataWidth: number,
  nIter: number,
  angleGuard = 0,
  fracGuard = 0,
  rounding: Rounding = "trunc",
): Numerics {
  return {
    dataWidth,
    nIter,
    angleWidth: dataWidth + angleGuard,
    fracGuard,
    rounding,
  };
}

export const xyWidth = (c: Numerics): number =>
  c.dataWidth + HEADROOM_BITS + c.fracGuard;
export const zWidth = (c: Numerics): number => c.angleWidth + HEADROOM_BITS;
/** Weight of one output LSB: 2^-(W-2). */
export const outLsb = (c: Numerics): number => 2 ** -(c.dataWidth - 2);

function roundHalfUp(v: number): number {
  return Math.floor(v + 0.5);
}

/** atan(2^-i) for i < N, quantised so that 2^(A-1) == pi. */
export function atanLut(nIter: number, angleWidth: number): number[] {
  const scale = 2 ** (angleWidth - 1);
  const out: number[] = [];
  for (let i = 0; i < nIter; i++)
    out.push(roundHalfUp((Math.atan(2 ** -i) / Math.PI) * scale));
  return out;
}

/** K_N = prod_{i<N} 1/sqrt(1 + 2^-2i). */
export function cordicGain(nIter: number): number {
  let k = 1.0;
  for (let i = 0; i < nIter; i++) k /= Math.sqrt(1.0 + 2.0 ** (-2 * i));
  return k;
}

/** Gain pre-compensation: round(K_N * 2^fracBits). */
export function initX(nIter: number, fracBits: number): number {
  return roundHalfUp(cordicGain(nIter) * 2 ** fracBits);
}

/** Two's-complement wrap to a `bits`-wide register (what a Verilog assignment does). */
export function wrap(v: number, bits: number): number {
  const m = 2 ** bits;
  const half = 2 ** (bits - 1);
  let r = (v + half) % m;
  if (r < 0) r += m;
  return r - half;
}

/** Arithmetic right shift (floor), or round-half-up. */
export function shift(v: number, s: number, rounding: Rounding): number {
  if (s === 0) return v;
  if (rounding === "round") return Math.floor((v + 2 ** (s - 1)) / 2 ** s);
  return Math.floor(v / 2 ** s);
}

/** The registers after pre-rotation and after each micro-rotation. */
export type RotState = {
  x: number;
  y: number;
  z: number;
  /** +1 if z >= 0 before this micro-rotation (rotate one way), -1 the other; 0 for pre-rotation. */
  sigma: number;
};

export type Rotation = {
  theta: number;
  quadrant: number;
  states: RotState[];
  cos: number;
  sin: number;
};

/** The datapath for one input angle code, keeping every intermediate state. */
export function rotate(theta: number, c: Numerics): Rotation {
  const W = c.dataWidth;
  const A = c.angleWidth;
  const g = c.fracGuard;
  const wx = xyWidth(c);
  const wz = zWidth(c);
  if (theta < -(2 ** (W - 1)) || theta >= 2 ** (W - 1))
    throw new RangeError("theta code out of range for data_width");
  let z = A >= W ? theta * 2 ** (A - W) : Math.floor(theta / 2 ** (W - A));
  const quadrant = (((Math.floor(theta / 2 ** (W - 2)) % 4) + 4) % 4) as number;
  let x = initX(c.nIter, W - 2 + g);
  let y = 0;
  const piCode = 2 ** (A - 1);
  if (quadrant === 1 || quadrant === 2) x = -x;
  if (quadrant === 1) z = z - piCode;
  else if (quadrant === 2) z = z + piCode;
  x = wrap(x, wx);
  z = wrap(z, wz);
  const states: RotState[] = [{ x, y, z, sigma: 0 }];
  const lut = atanLut(c.nIter, A);
  for (let i = 0; i < c.nIter; i++) {
    const pos = z >= 0;
    const sy = shift(y, i, c.rounding);
    const sx = shift(x, i, c.rounding);
    const a = lut[i] as number;
    const xn = pos ? x - sy : x + sy;
    const yn = pos ? y + sx : y - sx;
    const zn = pos ? z - a : z + a;
    x = wrap(xn, wx);
    y = wrap(yn, wx);
    z = wrap(zn, wz);
    states.push({ x, y, z, sigma: pos ? 1 : -1 });
  }
  return {
    theta,
    quadrant,
    states,
    cos: wrap(shift(x, g, c.rounding), W),
    sin: wrap(shift(y, g, c.rounding), W),
  };
}

/** COS_OUT and SIN_OUT for one angle code. */
export function sincos(theta: number, c: Numerics): [number, number] {
  const r = rotate(theta, c);
  return [r.cos, r.sin];
}

export type Accuracy = {
  maxAbsLsb: number;
  rmsLsb: number;
  maxAbs: number;
  accuracyBits: number;
  nAngles: number;
};

/**
 * Exact accuracy over the exhaustive sweep (every one of the 2^W angle codes), against the
 * unquantised cos and sin, over both outputs jointly: the repo's `accuracy()` for W <= 16.
 * (Above 16 bits the repo uses a dense sweep with seeded random angles; the site reads those
 * values from the repo's precomputed table instead of recomputing them.)
 */
export function accuracy(c: Numerics): Accuracy {
  const W = c.dataWidth;
  if (W > EXHAUSTIVE_MAX_WIDTH)
    throw new RangeError("live accuracy is exhaustive: W <= 16 only");
  const lo = -(2 ** (W - 1));
  const hi = 2 ** (W - 1);
  const k = Math.PI / 2 ** (W - 1);
  const scale = 2 ** (W - 2);
  let max = 0;
  let sq = 0;
  for (let t = lo; t < hi; t++) {
    const [co, si] = sincos(t, c);
    const phi = t * k;
    const ec = co - Math.cos(phi) * scale;
    const es = si - Math.sin(phi) * scale;
    max = Math.max(max, Math.abs(ec), Math.abs(es));
    sq += ec * ec + es * es;
  }
  const n = hi - lo;
  const maxAbs = max * outLsb(c);
  return {
    maxAbsLsb: max,
    rmsLsb: Math.sqrt(sq / (2 * n)),
    maxAbs,
    accuracyBits: maxAbs > 0 ? -Math.log2(maxAbs) : Infinity,
    nAngles: n,
  };
}

/** A code's angle in radians. */
export const codeToRad = (theta: number, W: number): number =>
  (theta * Math.PI) / 2 ** (W - 1);
/** The residual angle z in radians (z format: 2^(A-1) == pi). */
export const zToRad = (z: number, A: number): number =>
  (z * Math.PI) / 2 ** (A - 1);
/** An x or y register value as a real number (guard bits included). */
export const xyToReal = (v: number, c: Numerics): number =>
  v / 2 ** (c.dataWidth - 2 + c.fracGuard);
