/**
 * The TS port of the bit-exact CORDIC model against the Python reference at the vendored
 * commit (tests/fixtures/cordic.json, written by scripts/export_dse.py): the atan LUT, the
 * gain constant, the outputs on a strided sweep plus the edge codes, every register of three
 * full rotations per configuration, and, for every W <= 16, a SHA-256 over all 2^W outputs.
 * Integers must match exactly; the accuracy metrics (which take cos and sin of the angles)
 * to 1e-7 (the fixture stores them to 10 significant figures, since NumPy's cos and sin can differ in the last bit between CPUs), far below one output LSB.
 */
import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import fx from "../fixtures/cordic.json";

import {
  REFERENCE,
  accuracy,
  atanLut,
  cordicGain,
  initX,
  numerics,
  rotate,
  shift,
  sincos,
  wrap,
  type Numerics,
} from "@/lib/dse/cordic";

type Cfg = (typeof fx.configs)[number];

function cfgOf(c: Cfg["config"]): Numerics {
  return {
    dataWidth: c.data_width,
    nIter: c.n_iter,
    angleWidth: c.angle_width,
    fracGuard: c.frac_guard,
    rounding: c.rounding as Numerics["rounding"],
  };
}

describe("bit-exact CORDIC: TS port = Python reference", () => {
  it("covers the reference and wide configurations", () => {
    expect(fx.configs.length).toBeGreaterThanOrEqual(10);
    expect(fx.configs[0]!.config).toEqual({
      data_width: 16,
      n_iter: 14,
      angle_width: 16,
      frac_guard: 0,
      rounding: "trunc",
    });
    expect(fx.configs.some((c) => c.config.data_width === 28)).toBe(true);
  });

  for (const entry of fx.configs) {
    const c = cfgOf(entry.config);
    const name = JSON.stringify(entry.config);
    it(`${name}: atan LUT and gain constant`, () => {
      expect(atanLut(c.nIter, c.angleWidth)).toEqual(entry.atan_lut);
      expect(initX(c.nIter, c.dataWidth - 2 + c.fracGuard)).toBe(entry.init_x);
    });
    it(`${name}: outputs on ${entry.codes.length} angle codes`, () => {
      const cos: number[] = [];
      const sin: number[] = [];
      for (const t of entry.codes) {
        const [co, si] = sincos(t, c);
        cos.push(co);
        sin.push(si);
      }
      expect(cos).toEqual(entry.cos);
      expect(sin).toEqual(entry.sin);
    });
    it(`${name}: every register of every micro-rotation`, () => {
      for (const tr of entry.traces) {
        const r = rotate(tr.theta, c);
        expect(r.quadrant).toBe(tr.quadrant);
        expect(r.states).toEqual(tr.states);
        expect([r.cos, r.sin]).toEqual([tr.cos, tr.sin]);
      }
    });
    if ("exhaustive_sha256" in entry && entry.exhaustive_sha256) {
      it(`${name}: all 2^${c.dataWidth} outputs (SHA-256)`, () => {
        const lo = -(2 ** (c.dataWidth - 1));
        const hi = 2 ** (c.dataWidth - 1);
        const parts: string[] = [];
        for (let t = lo; t < hi; t++) {
          const [co, si] = sincos(t, c);
          parts.push(`${co},${si}`);
        }
        expect(createHash("sha256").update(parts.join(";")).digest("hex")).toBe(
          entry.exhaustive_sha256,
        );
      });
      it(`${name}: exhaustive accuracy`, () => {
        const a = accuracy(c);
        const want = entry.accuracy!;
        expect(a.nAngles).toBe(want.n_angles);
        expect(Math.abs(a.maxAbsLsb - want.max_abs_lsb)).toBeLessThan(1e-7);
        expect(Math.abs(a.rmsLsb - want.rms_lsb)).toBeLessThan(1e-7);
        expect(Math.abs(a.accuracyBits - want.accuracy_bits)).toBeLessThan(
          1e-7,
        );
      });
    }
  }

  it("the gain constant", () => {
    for (const g of fx.gain) expect(cordicGain(g.n)).toBe(g.k);
  });

  it("the reference: 10.5 LSB max error, as the repo's README says", () => {
    expect(accuracy(REFERENCE).maxAbsLsb).toBeCloseTo(10.5, 0);
  });

  it("helpers: wrap and shift behave like Verilog registers", () => {
    expect(wrap(2 ** 17, 18)).toBe(-(2 ** 17));
    expect(wrap(-(2 ** 17) - 1, 18)).toBe(2 ** 17 - 1);
    expect(shift(-5, 1, "trunc")).toBe(-3);
    expect(shift(-5, 1, "round")).toBe(-2);
    expect(shift(7, 0, "round")).toBe(7);
    expect(numerics(16, 14)).toEqual(REFERENCE);
    expect(() => rotate(2 ** 15, REFERENCE)).toThrow(RangeError);
    expect(() => accuracy(numerics(17, 14))).toThrow(RangeError);
  });
});
