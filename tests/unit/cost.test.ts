/**
 * The TS port of the Artix-7 cost model and the derived metrics against the Python reference
 * (tests/fixtures/cost.json): every family across the parameter space, every field, exactly
 * (no tolerance: the port keeps the Python float operation order). Also the two calibration
 * anchors, which the model must reproduce.
 */
import { describe, expect, it } from "vitest";

import fx from "../fixtures/cost.json";

import {
  CALIBRATION,
  estimate,
  metrics,
  muxLevels,
  muxTreeLuts,
  powerNorm,
  romLuts,
} from "@/lib/dse/cost";
import {
  arch,
  key,
  latencyCycles,
  resultsPerCycle,
  rotationsPerStep,
  steps,
  type Family,
  type Params,
} from "@/lib/dse/families";

describe("FPGA cost model: TS port = Python reference", () => {
  it("covers every family", () => {
    const fams = new Set(fx.rows.map((r) => r.family));
    expect([...fams].sort()).toEqual([
      "iterative",
      "pipelined",
      "pipelined_m",
      "unrolled_k",
    ]);
    expect(fx.rows.length).toBeGreaterThanOrEqual(100);
  });

  it("the power normalisation", () => {
    expect(powerNorm()).toBe(fx.power_norm);
  });

  for (const r of fx.rows) {
    it(r.key, () => {
      const a = arch(r.family as Family, r.params as Params);
      expect(key(a)).toBe(r.key);
      const e = estimate(a);
      expect(e.luts).toBe(r.luts);
      expect(e.ffs).toBe(r.ffs);
      expect(e.fmaxMhz).toBe(r.fmax_mhz);
      expect(e.criticalPathNs).toBe(r.critical_path_ns);
      expect({
        arith_bits: e.structure.arithBits,
        mux_luts: e.structure.muxLuts,
        reg_bits: e.structure.regBits,
        chain: e.structure.chain,
        mux_levels_per_stage: e.structure.nMuxLevels,
        adder_bits: e.structure.adderBits,
      }).toEqual(r.breakdown);
      expect(latencyCycles(a)).toBe(r.latency_cycles);
      expect(resultsPerCycle(a)).toBe(r.results_per_cycle);
      expect(steps(a)).toBe(r.steps);
      expect(rotationsPerStep(a)).toBe(r.rotations_per_step);
      const m = metrics(a);
      expect(m.throughputMsps).toBe(r.throughput_msps);
      expect(m.latencyNs).toBe(r.latency_ns);
      expect(m.powerIndex).toBe(r.power_index);
    });
  }

  it("reproduces the two Vivado anchors", () => {
    for (const an of CALIBRATION.anchors) {
      const e = estimate(arch(an.family as Family, an.params as Params));
      expect(Math.abs(e.luts - an.luts)).toBeLessThan(0.5);
      expect(Math.abs(e.fmaxMhz - an.fmax_mhz)).toBeLessThan(0.05);
      expect(Math.abs(e.ffs - an.ffs) / an.ffs).toBeLessThan(0.01);
    }
  });

  it("structural helpers", () => {
    expect(muxTreeLuts(1)).toBe(0);
    expect(muxTreeLuts(16)).toBe(5);
    expect(muxLevels(1)).toBe(0);
    expect(muxLevels(4)).toBe(1);
    expect(muxLevels(16)).toBe(2);
    expect(muxLevels(17)).toBe(3);
    expect(romLuts([3, 3])).toBe(0);
    expect(romLuts([1, 2, 3])).toBe(2);
  });

  it("a throughput requirement lowers the clock the power index is taken at", () => {
    const a = arch("pipelined", {
      data_width: 16,
      n_iter: 14,
      angle_guard: 0,
      frac_guard: 0,
      rounding: "trunc",
    });
    const free = metrics(a);
    const at50 = metrics(a, 50);
    expect(at50.fOpMhz).toBe(50);
    expect(at50.powerIndex).toBeLessThan(free.powerIndex);
  });
});
