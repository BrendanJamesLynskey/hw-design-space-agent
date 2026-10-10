/**
 * The project record (/record): it parses into its nine sections and its decision log, it is
 * public-safe, and every number it states is checked here against the site's data (which is
 * checked against the vendored repository) or the vendored files themselves.
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { ev, site } from "@/lib/dse/data";
import { ladder } from "@/lib/dse/ladder";
import { m3, sysSpec } from "@/lib/dse/m3";
import { cells, deciders, decisions, parseRecord } from "@/lib/record";

const MD = readFileSync("content/record/project_record.md", "utf-8");
const rec = parseRecord(MD);
const flat = MD.replace(/\s+/g, " ");

describe("the record parses", () => {
  it("into its sections (7b: M3's review) and its decision log", () => {
    expect(rec.title).toBe("HW Design-Space Agent: project record");
    expect(rec.sections.map((s) => s.n)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "7b",
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
    has(`the key's usage rose by $${site.spend.m2.key_usd.toFixed(2)}`);
    has(
      `(provider-reported $${site.spend.m2.trace_usd.toFixed(2)} including the pilot;`,
    );
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
      `(LUT ${v.luts_loo}% vs ${m1.rms_luts_err_pct}%, Fmax ${v.fmax_loo}% vs ${m1.rms_fmax_err_pct}%)`,
    );
    has(
      `about ${Math.round(m1.rms_luts_err_pct)}% RMS on LUTs and ${Math.round(m1.rms_fmax_err_pct)}% on Fmax`,
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

describe("every M3 number in the record matches the vendored data", () => {
  const has = (x: string) => expect(flat, x).toContain(x);
  const ab = m3.ab;
  const pc = (x: number) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(1)}%`;
  const cost = (m: string) => ab.costs.find((c) => c.model === m)!;

  it("summary", () => {
    has("merged (a92fe65)");
    has("re-vendored at a92fe65");
    expect(site.vendored.commit.slice(0, 7)).toBe("a92fe65");
    has(`${m3.cycle.passed}/${m3.cycle.traces} traces identical to RTL`);
    const r = ab.costs.map((c) => c.cost_ratio);
    has(
      `at ${Math.min(...r).toFixed(1)}–${Math.max(...r).toFixed(2)}× the cost`,
    );
  });

  it("results (M3)", () => {
    const c = m3.cycle;
    has(
      `matched the RTL on ${c.passed}/${c.traces} traces (${c.edges.toLocaleString("en-GB")} clock edges, ${c.designs.length} designs × 3 seeds,`,
    );
    const rp = m3.levers.replay;
    expect(rp.identical).toBe(rp.runs);
    expect(rp.architect_inputs).toBe(rp.runs);
    has(`all ${rp.runs} M2 runs replay identically under M3 code`);
    const multi = sysSpec("multiaxis_control");
    expect(multi.true.params.m).toBe(4);
    expect(multi.msps_only.params.m).toBe(7);
    expect(multi.peak_rate!.winner).toBe(multi.bound.key);
    expect(multi.bound.params.m).toBe(5);
    has(
      `m=4 (${Math.round(multi.true.luts_plus_ffs).toLocaleString("en-GB")} LUT+FF), where the MSPS-only view picks m=7 and even peak-rate sizing picks m=5`,
    );
    const b = sysSpec("bursty_offload");
    expect(b.peak_rate!.winner).toBe(b.true.key);
    expect(sysSpec("dds_sfdr").winner_changes).toBe(false);
    // structured agents against NSGA-II on the system specs
    const SP = ["multiaxis_control", "bursty_offload"];
    const ag = SP.flatMap((x) => m3.structured[x]!.filter((r) => r.agent));
    const ns = SP.map(
      (x) => m3.structured[x]!.find((r) => r.method === "nsga2")!,
    );
    const f2 = (x: number) => x.toFixed(2);
    has(
      `HV ${f2(Math.min(...ag.map((r) => r.hv.mean)))}–${f2(Math.max(...ag.map((r) => r.hv.mean)))} against NSGA-II's ${f2(Math.min(...ns.map((r) => r.hv.mean)))}–${f2(Math.max(...ns.map((r) => r.hv.mean)))}`,
    );
    has(
      `regret ${pc(Math.min(...ag.map((r) => r.regret.mean)))} to ${pc(Math.max(...ag.map((r) => r.regret.mean)))} against NSGA-II's ${pc(ns[0]!.regret.mean)} / ${pc(ns[1]!.regret.mean)}`,
    );
    // the A/B, pooled (mean of the per-spec means; the site's figures, from the summaries)
    const p = (m: string) => ab.pooled[m]!;
    const ds = "deepseek/deepseek-v4.1-flash";
    const qw = "qwen/qwen3.8-27b, reasoning off";
    const so = "anthropic/claude-sonnet-5.5";
    has(
      `DeepSeek HV ${p(ds).hv[0].toFixed(3)} → ${p(ds).hv[1].toFixed(3)}, regret ${pc(p(ds).regret[0])} → ${pc(p(ds).regret[1])}, cost ${cost(ds).cost_ratio.toFixed(2)}×`,
    );
    has(
      `Qwen HV ${p(qw).hv[0].toFixed(3)} → ${p(qw).hv[1].toFixed(3)}, regret ${pc(p(qw).regret[0])} → ${pc(p(qw).regret[1])}, cost ${cost(qw).cost_ratio.toFixed(2)}×, ${cost(qw).failures[1]}/${cost(qw).runs[1]} campaigns failed by looping`,
    );
    has(
      `Sonnet (one spec) HV ${p(so).hv[0].toFixed(3)} → ${p(so).hv[1].toFixed(3)}, regret ${pc(p(so).regret[0])} → ${pc(p(so).regret[1])}, cost ${cost(so).cost_ratio.toFixed(2)}×`,
    );
    expect(cost(so).specs).toEqual(["multiaxis_control"]);
    has(
      `In ${ab.single_run_dse} of ${ab.campaigns} runs the campaign agent's plan came down to a single 400-evaluation call`,
    );
    const sp = m3.spend;
    has(
      `$${sp.key_usd.toFixed(2)} by the key's usage (ledger $${sp.ledger_total_usd.toFixed(2)}), under the $${sp.cap_usd.toFixed(0)} cap`,
    );
    // "the before reading preceded the first run": the session's first reading is earlier than
    // every ledger timestamp
    const ledger = readFileSync(
      "vendor/hw_dse/eval/data/spend_ledger.jsonl",
      "utf-8",
    )
      .split("\n")
      .filter((l) => l.includes('"m3"'))
      .map((l) => JSON.parse(l) as { ts: string });
    expect(ledger.every((r) => `${r.ts}Z` > sp.key_start_ts)).toBe(true);
  });

  it("the decision log and the review (M3)", () => {
    // the unconditional map_front fix on dds_250msps, and the gated fix on high_precision
    const llm = (fix: "fix" | "fix-all", spec: string) =>
      m3.levers[fix].find(
        (r) => r.driver.startsWith("LLM") && r.spec === spec,
      )!;
    has(
      `unconditional fix (dds HV ${llm("fix-all", "dds_250msps").hv[0]} → ${llm("fix-all", "dds_250msps").hv[1]})`,
    );
    has(
      `(${llm("fix", "high_precision").regret[0]} → ${llm("fix", "high_precision").regret[1]} regret)`,
    );
    // the note with a mis-scaled error figure
    const store = readFileSync(
      "vendor/hw_dse/eval/data/campaign_m3_memory_store.json",
      "utf-8",
    );
    expect(store).toContain("under-predicts LUTs ~19%");
    expect(store).toContain("216 LUT/107 FF vs est 159/92");
    expect(Math.round((216 / 159 - 1) * 100)).toBe(36);
    has("(~19% where the data implied +36%)");
    has(
      `Qwen loops in ${cost("qwen/qwen3.8-27b, reasoning off").failures[1]}/30 campaigns`,
    );
    const readme = readFileSync("vendor/hw_dse/README.md", "utf-8").replace(
      /\s+/g,
      " ",
    );
    expect(readme).toContain("a full Sonnet campaign arm (~$6.9) was skipped");
    has("the full Sonnet arm (~$6.9) is skipped");
    // review round 1 found these; the README states them
    expect(readme).toContain("4 of 65 campaign runs");
    has("L2 did re-select in 4/65 campaign runs");
    const m5 = sysSpec("multiaxis_control").bound.simulated.sys_p99_batch_us!;
    has(`by a ${((m5 / 0.44 - 1) * 100).toFixed(1)}% margin`);
  });
});
