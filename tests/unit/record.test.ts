/**
 * The project record (/record): it parses into its nine sections and its decision log, it is
 * public-safe, and every number it states is checked here against the site's data (which is
 * checked against the vendored repository) or the vendored files themselves.
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { ev, site } from "@/lib/dse/data";
import { ladder } from "@/lib/dse/ladder";
import { cells, deciders, decisions, parseRecord } from "@/lib/record";

const MD = readFileSync("content/record/project_record.md", "utf-8");
const rec = parseRecord(MD);
const flat = MD.replace(/\s+/g, " ");

describe("the record parses", () => {
  it("into its nine sections and its decision log", () => {
    expect(rec.title).toBe("HW Design-Space Agent: project record");
    expect(rec.sections.map((s) => s.n)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    expect(rec.sections[4]!.title).toBe("Decision log");
    expect(rec.sections[0]!.id).toBe("summary");
    expect(rec.decisions.length).toBeGreaterThanOrEqual(20);
    // oldest first
    const dates = rec.decisions.map((d) => d.date);
    expect([...dates].sort()).toEqual(dates);
    expect(rec.lastUpdated).toMatch(/^2026-10-\d{2}/);
    expect(rec.repos).toContain("All MIT");
  });

  it("helpers", () => {
    expect(cells("| a | b |")).toEqual(["a", "b"]);
    expect(
      decisions("| date | x |\n|---|\n| 2026-01-01 | d | by | alt | why |"),
    ).toEqual([
      {
        date: "2026-01-01",
        decision: "d",
        by: "by",
        alternatives: "alt",
        why: "why",
      },
    ]);
    expect(deciders("planner, owner agreed")).toEqual(["owner", "planner"]);
    expect(
      deciders("cloud executor proposed, planner review agreed, owner yes"),
    ).toEqual(["owner", "planner", "executor"]);
  });

  it("is public-safe: no email address", () => {
    expect(MD).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });
});

describe("every number in the record matches the vendored data", () => {
  const g = site.glance;
  const has = (s: string) => expect(flat, s).toContain(s);

  it("summary and results (M1)", () => {
    has("merged (0082ccd)");
    has(
      `(${g.hv_ratio_m2[0].toFixed(2)}–${g.hv_ratio_m2[1].toFixed(2)}× NSGA-II hypervolume)`,
    );
    has(
      `selects better in ${g.regret_beats_nsga2_m2} of ${g.regret_cells} model/spec cells`,
    );
    has(
      `All ${ladder.l3.configs} RTL configurations match the golden model in 2 simulators`,
    );
    has(
      `${new Set(ladder.vivado.rows.filter((r) => r.batch > 0).map((r) => r.key)).size} generated designs measured in Vivado 2025.2`,
    );
    has(
      `${site.ground_truth.dds_250msps!.n_designs.toLocaleString("en-GB")} designs`,
    );
    const m1 = ev("m1").results;
    const best = (s: string) =>
      Math.min(...m1[s]!.filter((r) => r.agent).map((r) => r.regret_mean!));
    const ns = (s: string) =>
      m1[s]!.find((r) => r.method === "nsga2")!.regret_mean!;
    const pc = (x: number) => `+${(x * 100).toFixed(1)}%`;
    has(
      `best ${pc(best("dds_250msps"))} / ${pc(best("high_precision"))} / ${pc(best("low_area_control"))} against NSGA-II's ${pc(ns("dds_250msps"))} / ${pc(ns("high_precision"))} / ${pc(ns("low_area_control"))}`,
    );
    const hv = (s: string) =>
      m1[s]!.find((r) => r.method === "nsga2")!.hv_frac_mean!.toFixed(3);
    has(
      `(${hv("dds_250msps")} and ${hv("low_area_control")}, against the agents' 0.16–0.70)`,
    );
    const agentHv = ["dds_250msps", "low_area_control"].flatMap((s) =>
      m1[s]!.filter((r) => r.agent).map((r) => r.hv_frac_mean!),
    );
    expect(Math.min(...agentHv).toFixed(2)).toBe("0.16");
    expect(Math.max(...agentHv).toFixed(2)).toBe("0.70");
    has(
      `the true maximum is ${site.ground_truth.infeasible_dds_400msps!.best_throughput_msps_any.toFixed(1)} MSPS against 400`,
    );
    has(`$${site.spend.m1.provider_usd.toFixed(2)} provider-reported`);
  });

  it("results (M2) and spend", () => {
    const l3 = ladder.l3;
    has(
      `${l3.configs} configurations × 2 simulators (Verilator and Icarus) with zero mismatches, exhaustive up to ${l3.max_exhaustive_width} bits`,
    );
    has(
      `${ladder.formal.rows.length}/${ladder.formal.rows.length} formal proofs at 8 bits`,
    );
    has(
      `${l3.gate_runs} gate-level simulations of the synthesised netlist, zero mismatches`,
    );
    has(`${ladder.l4.rows.length} points through Yosys + nextpnr-xilinx`);
    // "0.97–1.09 on the two specs where M1 lost (M1: 0.18–0.87)"
    const two = ["dds_250msps", "low_area_control"].flatMap((s) =>
      g.models.map((m) => g.specs[s]![m]!.hv_vs_nsga2!),
    );
    const r = (i: 0 | 1, f: (...x: number[]) => number) =>
      f(...two.map((x) => x[i])).toFixed(2);
    has(
      `${r(1, Math.min)}–${r(1, Math.max)} on the two specs where M1 lost (M1: ${r(0, Math.min)}–${r(0, Math.max)})`,
    );
    const q =
      g.specs.high_precision!["qwen/qwen3.8-27b, reasoning off"]!
        .select_regret[1];
    const nsq = g.specs.high_precision!.nsga2!.select_regret[1];
    has(
      `(+${(q.mean * 100).toFixed(1)}% ± ${(q.std * 100).toFixed(1)} against +${(nsq.mean * 100).toFixed(1)}%, one bad seed)`,
    );
    const ds = (s: string) =>
      g.specs[s]!["deepseek/deepseek-v4.1-flash"]!.select_regret;
    const p1 = (x: number) => `${(x * 100).toFixed(1)}%`;
    has(
      `(${p1(ds("dds_250msps")[0].mean)} → ${p1(ds("dds_250msps")[1].mean)} and ${p1(ds("low_area_control")[0].mean)} → ${p1(ds("low_area_control")[1].mean)})`,
    );
    has(`$${site.spend.m2.key_usd.toFixed(2)} by the key's usage`);
    has(
      `Spend cap:** $${site.spend.m2.cap_usd.toFixed(0)} of LLM usage per milestone`,
    );
  });

  it("review findings and the decision log's numbers", () => {
    const viv = ladder.vivado.rows.find(
      (x) =>
        x.batch === 0 && x.key.startsWith("pipelined:data_width=16,n_iter=14"),
    )!;
    has(
      `${viv.luts} LUT / ${viv.ffs} FF / ${viv.fmax_mhz} MHz against the reference RTL's 745 / 784 / 272.9`,
    );
    const cal = readFileSync("src/data/calibration.json", "utf-8");
    expect(cal).toContain('"luts": 745');
    expect(cal).toContain('"ffs": 784');
    expect(cal).toContain('"fmax_mhz": 272.9');
    const v = ladder.l5.vivado.loo_summary["all vivado"]!;
    const m1 = ladder.l5.vivado.summary_before["vivado (generated RTL)"]!;
    has(
      `leave-one-out ${v.luts_loo}% LUT and ${v.fmax_loo}% Fmax for the refit, against ${m1.rms_luts_err_pct}% and ${m1.rms_fmax_err_pct}% for M1`,
    );
    const hp = ladder.high_precision;
    has(`measured margin (${(-hp.margin.post_synth["8"]! * 100).toFixed(2)}%)`);
    const readme = readFileSync("vendor/hw_dse/README.md", "utf-8").replace(
      /\s+/g,
      " ",
    );
    // the class factor's out-of-sample Fmax error on the Vivado points, as the README states it
    expect(readme).toContain("from **12.5% to 7.4%**");
    has(
      "(better average out-of-sample Fmax error: 7.4% against 12.5% on Vivado points)",
    );
    // the earlier per-family fit that overfitted
    expect(readme).toContain(
      "reached 9.0% LUT in-sample but 12.9% out of sample",
    );
    has("(leave-one-out error 12.9% against 9.0% in-sample on LUTs)");
    // M1's Qwen: reasoning off ≈15× faster and ≈8× cheaper
    const qw = ev("m1").costs.models;
    const on = qw.find((m) => m.label === "Qwen3.8-27B")!;
    const off = qw.find((m) => m.label === "Qwen3.8-27B, reasoning off")!;
    expect(Math.round(on.wall_s_mean / off.wall_s_mean)).toBe(15);
    expect(Math.round(on.cost_per_run / off.cost_per_run)).toBe(8);
    has("about 15× faster by wall-clock and 8× cheaper");
  });
});
