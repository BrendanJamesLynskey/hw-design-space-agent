/**
 * Milestone 2's animations and tables: one design down the ladder, measured against estimated,
 * high_precision's m=6 against m=8, and M1 → M2 against NSGA-II. Key frames are checked against
 * the exported data (which the export checks against the repository's own tables and text), and
 * the scatter's error figures are re-derived from its points and compared with the repository's
 * L5 report.
 */
import { describe, expect, it } from "vitest";

import {
  descentCaption,
  hpCaption,
  scatterCaption,
  shiftCaption,
} from "@/lib/dse/captions";
import { ev, site } from "@/lib/dse/data";
import { ladder, relErr, vivadoDesigns } from "@/lib/dse/ladder";
import {
  HP_VIEWS,
  SCATTER_TOOLS,
  descentBars,
  descentFrames,
  hpFrames,
  hpMeets,
  hpMsps,
  rmsPct,
  scatterExtent,
  scatterFrames,
  scatterPoints,
  shiftFrames,
  shiftValue,
  xy,
  type Metric,
} from "@/lib/dse/m2frames";

const w = ladder.worked;
const proofs = ladder.formal.rows.filter((r) => r.family === w.family);

describe("one design down the ladder (the worked example)", () => {
  const frames = descentFrames(w);

  it("visits the live levels in order, one step per simulator", () => {
    expect(frames.map((f) => f.phase)).toEqual([
      "l1",
      "rtl",
      "sim",
      "sim",
      "formal",
      "synth",
      "gate",
      "compare",
      "refit",
      "verdict",
    ]);
    expect([...new Set(frames.map((f) => f.level))]).toEqual([
      "L1",
      "L3",
      "L4",
      "GL",
      "L5",
    ]);
    expect(frames.filter((f) => f.measured)[0]!.phase).toBe("synth");
    expect(frames.filter((f) => f.refit)[0]!.phase).toBe("refit");
  });

  it("key frames carry the repository's numbers", () => {
    const cap = (i: number) => descentCaption(frames[i]!, w, proofs);
    expect(cap(0)).toContain("158.8 LUTs, 91.8 FFs, 198.3 MHz → 13.2 MSPS");
    expect(cap(0)).toContain("all 32,768 angles (exact)");
    expect(cap(1)).toContain(
      "cordic_iterative_w15_n12_ap1_g0_round, 106 lines",
    );
    expect(cap(2)).toContain(
      "Verilator 5.020 2024-01-01: all 32,768 input angles",
    );
    expect(cap(2)).toContain("0 mismatches; latency 15 cycles, documented 15");
    expect(cap(3)).toContain("Icarus Verilog 12.0");
    expect(cap(4)).toContain("latency_iterative, depth 26: PASS");
    expect(cap(5)).toContain(
      "216 LUTs, 107 FFs; Fmax 144.7 / 150.7 / 156.2 MHz",
    );
    expect(cap(6)).toContain("216 LUT, 107 FF, 22 CARRY4 cells");
    expect(cap(7)).toContain("LUTs -26.5%, FFs -14.2%, Fmax +31.6%");
    expect(cap(8)).toContain(
      "LUTs 185.8 (-14.0%), FFs 98.49 (-8.0%), Fmax 142.2 (-5.6%)",
    );
    expect(cap(9)).toContain(
      "1 of 139 front designs measured, winner changed: no",
    );
    expect(cap(9)).toContain("150.7 MHz / 15 cycles = 10 MSPS against ≥ 1");
  });

  it("the bars are the L1 estimate, the L4 measurement and the refit", () => {
    const b = descentBars(w);
    expect(b.map((x) => x.metric)).toEqual(["luts", "ffs", "fmax_mhz"]);
    for (const x of b) {
      expect(x.est).toBe(w.l1[x.metric]);
      expect(x.meas).toBe(w.l4[x.metric]);
      expect(x.refit).toBe(w.l5.tool_scaled[x.metric]);
      // the worked example's own error column
      expect(((x.est / x.meas - 1) * 100).toFixed(1)).toBe(
        w.l4.err_pct[x.metric] > 0
          ? w.l4.err_pct[x.metric].toFixed(1)
          : w.l4.err_pct[x.metric].toFixed(1),
      );
    }
  });
});

describe("measured against estimated", () => {
  const pts = scatterPoints(ladder.scatter);
  const frames = scatterFrames();

  it("draws the generated designs, tool by tool, then the refit", () => {
    expect(pts).toHaveLength(37 + 14 + 14);
    expect(frames.map((f) => f.tools.length)).toEqual([0, 1, 2, 3, 3]);
    expect(frames.map((f) => f.refit)).toEqual([
      false,
      false,
      false,
      false,
      true,
    ]);
    for (const t of SCATTER_TOOLS)
      expect(pts.filter((p) => p.tool === t).length).toBeGreaterThan(0);
  });

  it("its RMS errors are the repository's L5 report's, per tool and metric", () => {
    const rep = ladder.l5.vivado;
    const name: Record<string, string> = {
      vivado: "vivado (generated RTL)",
      "vivado post-route": "vivado post-route (generated RTL)",
      "yosys+nextpnr-xilinx": "yosys+nextpnr-xilinx (generated RTL)",
    };
    const key = { luts: "luts", ffs: "ffs", fmax: "fmax" } as const;
    for (const t of SCATTER_TOOLS)
      for (const m of ["luts", "ffs", "fmax"] as Metric[]) {
        const mine = pts.filter((p) => p.tool === t);
        const before = rep.summary_before[name[t]!]!;
        const after = rep.summary_after[name[t]!]!;
        expect(
          Math.abs(
            rmsPct(mine, m, false) -
              before[`rms_${key[m]}_err_pct` as keyof typeof before],
          ),
          `${t} ${m} before`,
        ).toBeLessThan(0.2);
        expect(
          Math.abs(
            rmsPct(mine, m, true) -
              after[`rms_${key[m]}_err_pct` as keyof typeof after],
          ),
          `${t} ${m} after`,
        ).toBeLessThan(0.2);
      }
    expect(rmsPct([], "luts", false)).toBe(0);
  });

  it("key frames: captions, extent and coordinates", () => {
    const p = pts[0]!;
    expect(xy(p, "luts", false)).toEqual({ x: p.luts_m1, y: p.luts_meas });
    expect(xy(p, "fmax", true)).toEqual({ x: p.fmax_refit, y: p.fmax_meas });
    const [lo, hi] = scatterExtent(pts, "fmax");
    for (const q of pts) {
      expect(q.fmax_meas).toBeGreaterThan(lo);
      expect(q.fmax_meas).toBeLessThan(hi);
    }
    const n = ladder.l5.vivado.n_fit_points;
    expect(scatterCaption(frames[0]!, ladder.scatter, n, "luts")).toContain(
      "LUTs: estimate across",
    );
    expect(scatterCaption(frames[1]!, ladder.scatter, n, "fmax")).toContain(
      "+ 37 Yosys + nextpnr-xilinx designs: the M1 model's Fmax is off by 43.5% RMS",
    );
    expect(scatterCaption(frames[3]!, ladder.scatter, n, "fmax")).toContain(
      "(reported, not fitted)",
    );
    expect(scatterCaption(frames[4]!, ladder.scatter, n, "fmax")).toContain(
      "After the vivado-2025.2 refit (51 fitted points",
    );
  });
});

describe("high_precision: m=6 against m=8", () => {
  const hp = ladder.high_precision;
  const frames = hpFrames();

  it("adds one view per step, the measurements last", () => {
    expect(frames.map((f) => f.phase)).toEqual([
      "spec",
      ...HP_VIEWS,
      "verdict",
    ]);
    expect(frames[frames.length - 1]!.views).toEqual(HP_VIEWS);
  });

  it("m=6 meets 50 MSPS in every view; m=8 in none", () => {
    for (const v of HP_VIEWS) {
      expect(hpMeets(hp, 6, v), v).toBe(true);
      expect(hpMeets(hp, 8, v), v).toBe(false);
    }
    expect(hpMsps(hp, 8, "post_synth")).toBe(49.88);
    expect(hpMsps(hp, 8, "post_route")).toBe(46.46);
    expect(hpMsps(hp, 6, "post_route")).toBe(60.76);
    expect(hp.margin.post_synth["8"]).toBeCloseTo(-0.0024, 6);
  });

  it("key frames: the captions state the margins, including the thin one", () => {
    expect(hpCaption(frames[0]!, hp)).toContain("m=8, 4% smaller in Vivado");
    expect(hpCaption(frames[1]!, hp)).toContain(
      "M1 estimate: m=6 62.52 (+25.0%), m=8 48 MSPS (-4.00%). m=6 meets, m=8 misses",
    );
    expect(hpCaption(frames[3]!, hp)).toContain(
      "Vivado post-synthesis: m=6 65.39 (+30.8%), m=8 49.88 MSPS (-0.24%)",
    );
    expect(hpCaption(frames[4]!, hp)).toContain(
      "Vivado post-route: m=6 60.76 (+21.5%), m=8 46.46 MSPS (-7.08%)",
    );
    expect(hpCaption(frames[5]!, hp)).toContain(
      "only the routed figure settles it",
    );
  });
});

describe("M1 → M2 against NSGA-II", () => {
  const g = site.glance;
  const labels = Object.fromEntries(
    ev("m2").costs.models.map((m) => [m.model, m.label]),
  );
  const specs = ["dds_250msps", "low_area_control", "high_precision"];

  it("moves one spec per step", () => {
    const fr = shiftFrames(specs);
    expect(fr.map((f) => f.moved.length)).toEqual([0, 1, 2, 3]);
  });

  it("values are results.md's ratios and regret differences", () => {
    expect(
      shiftValue(g, "dds_250msps", "anthropic/claude-sonnet-5.5", "hv").map(
        (x) => x.toFixed(2),
      ),
    ).toEqual(["0.32", "1.02"]);
    const [a, b] = shiftValue(
      g,
      "high_precision",
      "qwen/qwen3.8-27b, reasoning off",
      "regret",
    );
    expect(a).toBeLessThan(0);
    expect(b).toBeGreaterThan(0);
  });

  it("key frames: captions", () => {
    const fr = shiftFrames(specs);
    expect(shiftCaption(fr[0]!, g, "hv", labels)).toContain("M1 (3 seeds)");
    expect(shiftCaption(fr[0]!, g, "regret", labels)).toContain(
      "minus NSGA-II's",
    );
    expect(shiftCaption(fr[1]!, g, "hv", labels)).toBe(
      "dds_250msps, M1 → M2 (5 seeds): Sonnet 5.5 0.32 → 1.02×, DeepSeek V4.1 Flash 0.87 → 1.08×, Qwen3.8-27B, reasoning off 0.46 → 1.09×.",
    );
    expect(shiftCaption(fr[3]!, g, "regret", labels)).toContain(
      "Qwen3.8-27B, reasoning off -4.9% → +7.2%",
    );
  });
});

describe("the ladder data", () => {
  it("pairs each Vivado design's two views", () => {
    const d = vivadoDesigns();
    expect(d).toHaveLength(14);
    for (const x of d) {
      expect(x.synth.kind).toBe("post-synthesis");
      expect(x.route.kind).toBe("post-route");
    }
    expect(relErr(110, 100)).toBeCloseTo(0.1, 12);
  });
});
