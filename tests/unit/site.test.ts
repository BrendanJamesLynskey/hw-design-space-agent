/**
 * The site data, the quoted values, the formatting and the vendored files.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import VENDORED from "../../vendor/hw_dse/VENDORED.json";

import { COMMIT, ev, runDate, site } from "@/lib/dse/data";
import { VALUES, formatValue, lookup, V_ } from "@/lib/dse/values";
import {
  clip,
  designName,
  fmtInt,
  fmtMs,
  fmtTokens,
  fmtUsd,
  pct,
  pow2,
  signedPct,
  trim,
} from "@/lib/format";
import { agentFile, ownerRepo } from "@/lib/site";

describe("vendored data", () => {
  it("every vendored file matches its recorded hash", () => {
    const files = Object.entries(VENDORED.files);
    expect(files.length).toBeGreaterThanOrEqual(200);
    for (const [p, rec] of files)
      expect(
        createHash("sha256")
          .update(readFileSync(`vendor/hw_dse/${p}`))
          .digest("hex"),
        p,
      ).toBe(rec.sha256);
  });
  it("the site data is from the vendored commit", () => {
    expect(site.vendored.commit).toBe(VENDORED.commit);
    expect(COMMIT).toBe(VENDORED.commit.slice(0, 7));
    expect(runDate("m1")).toBe("2026-10-08");
    expect(runDate("m2")).toBe("2026-10-09");
  });
});

describe("honesty", () => {
  it("only the done milestones' levels are live; planned levels say when", () => {
    const done = site.milestones.filter((m) => m.status === "done");
    expect(done.map((m) => m.id)).toEqual(["M1", "M2"]);
    expect(
      site.ladder.filter((l) => l.status === "live").map((l) => l.id),
    ).toEqual(["L0", "L1", "L3", "L4", "GL", "L5"]);
    expect(
      site.ladder
        .filter((l) => l.status !== "live")
        .map((l) => `${l.id} ${l.status} ${l.milestone}`),
    ).toEqual(["SYS planned M3", "L2 planned M3"]);
  });
  it("M1: NSGA-II beat every agent on hypervolume on two specs", () => {
    for (const s of ["dds_250msps", "low_area_control"]) {
      expect(lookup(`m1.${s}.nsga2_hv`)).toBeGreaterThan(
        lookup(`m1.${s}.best_agent_hv`) as number,
      );
    }
    expect(lookup("m1.high_precision.best_agent_hv")).toBeGreaterThan(
      lookup("m1.high_precision.nsga2_hv") as number,
    );
  });
  it("M2: the gap closed (0.96–1.09× NSGA-II) and 8 of 9 cells beat its regret", () => {
    expect(lookup("glance.hv_ratio_min")).toBe(0.96);
    expect(lookup("glance.hv_ratio_max")).toBe(1.09);
    expect(lookup("glance.regret_beats")).toBe(8);
    expect(lookup("glance.regret_cells")).toBe(9);
    expect(lookup("m2.regret.agent_beats_nsga2")).toBe(8);
    expect(site.glance.regret_losses_m2).toEqual([
      { spec: "high_precision", model: "qwen/qwen3.8-27b, reasoning off" },
    ]);
    expect(lookup("glance.qwen_hp_regret_m2")).toBeGreaterThan(
      lookup("m2.high_precision.nsga2_regret") as number,
    );
  });
  it("an agent beats both baselines on selection regret on every feasible spec, both milestones", () => {
    for (const ms of ["m1", "m2"])
      for (const s of ["dds_250msps", "low_area_control", "high_precision"]) {
        const best = lookup(`${ms}.${s}.best_agent_regret`) as number;
        expect(best).toBeLessThan(lookup(`${ms}.${s}.nsga2_regret`) as number);
        expect(best).toBeLessThan(lookup(`${ms}.${s}.random_regret`) as number);
      }
  });
  it("every model, every seed, called the infeasible spec", () => {
    expect(lookup("m1.infeasible.llm_declared")).toBe(12);
    expect(lookup("m1.infeasible.llm_runs")).toBe(12);
    expect(lookup("m2.infeasible.llm_declared")).toBe(15);
    expect(lookup("m2.infeasible.llm_runs")).toBe(15);
    expect(lookup("infeasible.best_msps") as number).toBeLessThan(400);
  });
  it("cost totals", () => {
    expect(lookup("m1.total_usd")).toBe(1.7367);
    expect(lookup("m1.runs")).toBe(48);
    expect(lookup("m2.total_usd")).toBe(1.6488);
    expect(lookup("m2.runs")).toBe(60);
    for (const [ms, t] of [
      ["m1", 1.7367],
      ["m2", 1.6488],
    ] as const) {
      const sum = ev(ms).costs.models.reduce((a, m) => a + m.cost_usd, 0);
      expect(sum).toBeCloseTo(t, 4);
    }
    expect(lookup("spend.m2_traces")).toBe(1.6654);
    expect(
      (lookup("spend.m2") as number) + (lookup("spend.m2_pilot") as number),
    ).toBeCloseTo(1.6654, 4);
    expect(lookup("spend.m2_key")).toBe(1.657747);
  });
});

describe("values and formatting", () => {
  it("every value is defined and formats", () => {
    for (const [k, v] of Object.entries(VALUES)) {
      expect(v, k).toBeDefined();
      for (const f of [
        "num",
        "int",
        "usd",
        "pct",
        "pct0",
        "pct2",
        "spct",
        "x",
        "s",
        "f1",
        "f2",
        "f3",
        "str",
      ] as const)
        expect(formatValue(v, f)).toBeTypeOf("string");
    }
    expect(() => lookup("nope")).toThrow();
    expect(V_("commit", "str")).toBe(COMMIT);
    expect(formatValue(0.0595, "usd")).toBe("$0.059");
    expect(formatValue(0.5, "usd")).toBe("$0.50");
    expect(formatValue(-0.02, "spct")).toBe("-2.0%");
    expect(formatValue(1234.5, "int")).toBe("1,235");
  });
  it("format helpers", () => {
    expect(trim(0)).toBe("0");
    expect(trim(12345.678)).toBe("12,300");
    expect(fmtMs(0)).toBe("0 s");
    expect(fmtMs(500)).toBe("500 ms");
    expect(fmtMs(1500)).toBe("1.5 s");
    expect(fmtMs(125_000)).toBe("2 min 5 s");
    expect(fmtMs(119_700)).toBe("2 min 0 s");
    expect(fmtUsd(0)).toBe("$0");
    expect(fmtUsd(0.0123)).toBe("$0.0123");
    expect(fmtUsd(1.5)).toBe("$1.50");
    expect(fmtTokens(1234)).toBe("1,234 tokens");
    expect(fmtInt(1234.4)).toBe("1,234");
    expect(pct(0.5)).toBe("50%");
    expect(signedPct(0.034)).toBe("+3.4%");
    expect(signedPct(-0.01)).toBe("-1.0%");
    expect(pow2(2 ** -13, 0)).toBe("2^-13");
    expect(designName("unrolled_k", { data_width: 8, n_iter: 4, k: 2 })).toBe(
      "unrolled_k W=8 N=4 k=2",
    );
    expect(designName("pipelined_m", { data_width: 8, n_iter: 4, m: 3 })).toBe(
      "pipelined_m W=8 N=4 m=3",
    );
    expect(clip("short")).toBe("short");
    expect(clip("a ".repeat(40), 20).endsWith("…")).toBe(true);
    expect(clip("x".repeat(60), 20).length).toBe(20);
  });
  it("links", () => {
    expect(agentFile("README.md", "abc")).toBe(
      "https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent/blob/abc/README.md",
    );
    expect(ownerRepo("CORDIC")).toBe(
      "https://github.com/BrendanJamesLynskey/CORDIC",
    );
  });
});
