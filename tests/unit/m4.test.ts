/**
 * Milestone 4's animations as pure state functions (src/lib/dse/m4.ts), their key frames and
 * captions against the exported data (src/data/m4.json, checked by scripts/export_m4.py against
 * the repo), the values the pages quote, and the write-up's parser (src/lib/writeup.ts).
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { sysFrames, type SystemReplay } from "@/lib/dse/m3";
import {
  abRows,
  asicCaption,
  asicFrames,
  asicSpec,
  deadlineCaption,
  feasibleIn,
  fleetCaption,
  fleetFrames,
  heldCaption,
  heldFrames,
  heldRole,
  laneName,
  m4,
  pFmt,
  shortKey,
  written,
  type AsicSpec,
} from "@/lib/dse/m4";
import { formatValue, lookup } from "@/lib/dse/values";
import {
  blocks,
  factValue,
  parseFlow,
  parseWriteup,
  slug,
} from "@/lib/writeup";

const specs = m4.ground_truth.specs;

describe("FPGA against ASIC", () => {
  const frames = asicFrames(specs);
  it("ranks the four families on asic_low_area, then sweeps m on the two pipelined specs", () => {
    const rank = frames.filter((f) => f.phase === "rank");
    expect(rank.map((f) => f.shown)).toEqual([1, 2, 3, 4]);
    expect(rank.every((f) => f.spec === "asic_low_area")).toBe(true);
    const sweeps = frames.filter((f) => f.phase === "sweep");
    expect(sweeps).toHaveLength(14);
    expect(frames.filter((f) => f.phase === "pick").map((f) => f.spec)).toEqual(
      ["asic_power_50msps", "asic_multiaxis_control"],
    );
    expect(frames.at(-1)!.phase).toBe("summary");
  });
  it("key frames: same ranking, shallower pipelining on sky130", () => {
    const la = asicSpec("asic_low_area");
    expect(la.ranking).toEqual(la.twin_ranking);
    const cap4 = asicCaption(frames[3]!, specs);
    expect(cap4).toContain("pipelined: 4.17× on sky130, 4.99× on the FPGA");
    expect(cap4).toContain("Same order on both");
    expect(asicCaption(frames[0]!, specs)).toContain("iterative: 1× on sky130");
    const pick = frames.find(
      (f) => f.phase === "pick" && f.spec === "asic_power_50msps",
    )!;
    const cp = asicCaption(pick, specs);
    expect(cp).toContain("m=3 on sky130");
    expect(cp).toContain("against m=7 on the FPGA");
    // the FPGA twin's m=8 ties m=7 on power; the ground truth keeps m=7
    expect(cp).toContain(
      "m=8 ties on power index and the ground truth keeps m=7",
    );
    const mpick = frames.find(
      (f) => f.phase === "pick" && f.spec === "asic_multiaxis_control",
    )!;
    const cm = asicCaption(mpick, specs);
    expect(cm).toContain("m=2 on sky130");
    expect(cm).toContain("m=5 on the FPGA");
    expect(cm).toContain("Each sweep keeps its own winner's other knobs");
    const sw = frames.find(
      (f) => f.phase === "sweep" && f.spec === "asic_multiaxis_control",
    )!;
    expect(asicCaption(sw, specs)).toMatch(/p99 0\.497 µs ✓/);
    expect(asicCaption(sw, specs)).toContain(
      "(p99 batch latency ≤ 0.5 µs (simulated))",
    );
    const sp = frames.find(
      (f) => f.phase === "sweep" && f.spec === "asic_power_50msps",
    )!;
    expect(asicCaption(sp, specs)).toMatch(/≥ 50 MSPS/);
    expect(asicCaption(frames.at(-1)!, specs)).toMatch(
      /m=3 on sky130 where the FPGA picks m=7, and m=2 where it picks m=5/,
    );
  });
  it("every sweep's best feasible m is the ground truth's winner", () => {
    for (const s of specs.filter((x) => x.sweeps)) {
      for (const [t, m] of [
        ["asic", s.winner_m],
        ["fpga", s.twin_m],
      ] as const) {
        const feas = s.sweeps![t].filter((p) => p.feasible);
        const best = feas.reduce((a, b) => (b.select < a.select ? b : a));
        expect(best.m).toBe(m);
      }
    }
  });
  it("a family with nothing feasible says so", () => {
    const la = asicSpec("asic_low_area");
    const fake: AsicSpec = {
      ...la,
      ranking: la.ranking.slice(1),
      families: [
        { ...la.families[0]!, asic_ratio: null, fpga_ratio: null },
        ...la.families.slice(1),
      ],
    };
    expect(
      asicCaption({ spec: la.name, phase: "rank", shown: 4 }, [fake]),
    ).toContain("none feasible on sky130, none feasible on the FPGA");
  });
});

describe("the held-out check", () => {
  const rows = m4.held_out.rows;
  const frames = heldFrames(rows);
  it("one design per step, then the summary", () => {
    expect(frames).toHaveLength(10);
    expect(frames[0]).toEqual({ shown: 1, summary: false });
    expect(frames.at(-1)).toEqual({ shown: 9, summary: true });
  });
  it("key frames: unrolled_k optimistic by 39.6%, the power winner at +0.7%, the summary", () => {
    const c1 = heldCaption(frames[0]!, rows, specs, m4.held_out);
    expect(c1).toContain("unrolled_k W=15 N=13 k=2");
    expect(c1).toContain("+39.6%, optimistic");
    expect(c1).toContain("best unrolled_k for asic_low_area");
    const i = rows.findIndex(
      (r) => r.key === asicSpec("asic_power_50msps").winner,
    );
    const c5 = heldCaption(frames[i]!, rows, specs, m4.held_out);
    expect(c5).toContain("asic_power_50msps winner");
    expect(c5).toContain("(+0.7%)");
    expect(c5).not.toContain("optimistic");
    const s = heldCaption(frames.at(-1)!, rows, specs, m4.held_out);
    expect(s).toContain("area within 5% on 9 of 9");
    expect(s).toContain("from −14.9% to +39.6%");
    expect(s).toContain("on 5 of 9 by +8.8% or more, and on a sixth by +0.7%");
  });
  it("names why each design was synthesised", () => {
    const mx = asicSpec("asic_multiaxis_control");
    const w = rows.find((r) => r.key === mx.winner)!;
    expect(heldRole(w, specs)).toBe("asic_multiaxis_control winner");
    const b = rows.find((r) => r.key === mx.l1_bound_winner)!;
    expect(heldRole(b, specs)).toContain(
      "asic_multiaxis_control L1-bound pick",
    );
    const t = rows.find((r) => r.key === mx.twin_winner)!;
    expect(heldRole(t, specs)).toContain("FPGA twin's winner");
    const none = { ...w, key: "iterative:data_width=8,n_iter=4" };
    expect(heldRole(none, specs)).toBe("");
    // a design that meets none of the specs with its measured numbers
    const unk = rows.find((r) => r.family === "unrolled_k")!;
    expect(
      heldCaption(
        { shown: 1, summary: false },
        [{ ...unk, meets: {} }],
        specs,
        m4.held_out,
      ),
    ).toContain("it meets none of the three specs");
  });
});

describe("the deadline miss", () => {
  const rep = m4.deadline;
  const frames = sysFrames(rep as unknown as SystemReplay);
  it("the estimate meets, the measurement misses, plain pipelined meets", () => {
    const [est, meas, plain] = rep.designs;
    expect(est!.meets && !meas!.meets && plain!.meets).toBe(true);
    expect(est!.key).toBe(meas!.key);
    expect(meas!.fmax_mhz).toBeLessThan(est!.fmax_mhz);
  });
  it("key frames: the tick, the drain, every tick, the verdict", () => {
    const c0 = deadlineCaption(frames[0]! as never, rep);
    expect(c0).toContain("pipelined_m W=17 N=16 m=2");
    expect(c0).toContain("82.5 MHz");
    expect(c0).toContain("72.2 MHz");
    const mid = frames.find((f) => f.phase === "drain" && f.t >= 450)!;
    expect(deadlineCaption(mid as never, rep)).toMatch(/done at 0\.39\d* µs/);
    expect(deadlineCaption(mid as never, rep)).toMatch(
      /m=2 at 72\.2 MHz \(measured\) \d+\/32 out/,
    );
    expect(deadlineCaption(frames.at(-2)! as never, rep)).toContain(
      "0.5673 µs at the measured one",
    );
    const v = deadlineCaption(frames.at(-1)! as never, rep);
    expect(v).toContain("misses by 13.5%");
    expect(v).toContain("meets 0.5 µs by 0.6%");
  });
  it("lane names fall back to the family", () => {
    expect(laneName(rep.designs[2]!)).toBe("pipelined at 119 MHz (measured)");
    expect(laneName({ ...rep.designs[2]!, family: undefined })).toBe(
      " at 119 MHz (measured)",
    );
  });
});

describe("the fleet", () => {
  const run = m4.fleet_run;
  const frames = fleetFrames(run);
  it("phase 1 in ten steps, the coordinator's three steps, phase 2, merge, the A/B", () => {
    const ph = frames.map((f) => f.phase);
    expect(ph[0]).toBe("start");
    expect(ph.filter((p) => p === "p1")).toHaveLength(10);
    expect(ph.filter((p) => p === "p2")).toHaveLength(10);
    expect(ph.slice(11, 14)).toEqual(["lessons", "split", "seed"]);
    expect(ph.slice(-3)).toEqual(["merge", "ab-hv", "ab-regret"]);
    expect(written(frames.at(-1)!)).toBe(run.budget);
    expect(written(frames.find((f) => f.phase === "lessons")!)).toBe(
      run.budget / 2,
    );
  });
  it("key frames from the run's records", () => {
    const end1 = frames.filter((f) => f.phase === "p1").at(-1)!;
    const c = fleetCaption(end1, run);
    expect(c).toContain("fsm: 100 evaluated, 0 meet the spec");
    expect(c).toContain("declared its families infeasible");
    expect(feasibleIn(run, 1, 100)).toBe(
      run.lessons.pipelined!.feasible + run.lessons.pipelined_m!.feasible,
    );
    const firstP1 = fleetCaption(frames[1]!, run);
    expect(firstP1).not.toContain("declared");
    expect(fleetCaption(frames[0]!, run)).toContain(
      "member fsm (iterative, unrolled_k)",
    );
    expect(fleetCaption(frames[11]!, run)).toContain(
      `${run.distinct_after_p1} distinct designs`,
    );
    expect(fleetCaption(frames[12]!, run)).toContain("fsm 0, pipelined 200");
    expect(fleetCaption(frames[13]!, run)).toContain(
      "12 pipelined and 3 pipelined_m",
    );
    expect(fleetCaption(frames[14]!, run)).toContain("20 of 200 evaluations");
    const merge = fleetCaption(frames.find((f) => f.phase === "merge")!, run);
    expect(merge).toContain("regret +3.6%");
    expect(merge).toContain(`${run.front_size} on the front`);
    expect(fleetCaption(frames.at(-2)!, run)).toContain(
      "higher in 18 of 55 pairs (sign test p = 0.014)",
    );
    expect(fleetCaption(frames.at(-1)!, run)).toContain(
      "picked better in 22 of 25 pairs (p = 0.0002, mean -8.6 points)",
    );
  });
  it("phase 2 with no funded member", () => {
    const solo = {
      ...run,
      members: run.members.filter((m) => m.phase === 1),
      lanes: run.lanes.filter((l) => l.phase === 1),
    };
    const fr = fleetFrames(solo);
    expect(fleetCaption(fr.find((f) => f.phase === "p2")!, solo)).toContain(
      "0 of 0 evaluations (decisions: none)",
    );
  });
  it("the paired A/B rows and p-values", () => {
    const rows = abRows();
    expect(rows.map((r) => r.key)).toEqual([
      "qwen.fleet",
      "qwen.fleet_v2",
      "deepseek.fleet",
      "sonnet.fleet",
    ]);
    for (const r of rows)
      expect(m4.ab.pairs[r.key]!.hv_frac.length).toBe(r.test.hv_frac.n + 0);
    expect(pFmt(0.000157)).toBe("0.0002");
    expect(pFmt(0.01447)).toBe("0.014");
    expect(pFmt(0.0059)).toBe("0.006");
    expect(pFmt(0.424)).toBe("0.42");
  });
});

describe("milestone 4's values and helpers", () => {
  it("the numbers the pages quote", () => {
    expect(lookup("m4.cal.points")).toBe(57);
    expect(lookup("m4.cal.loo_fmax")).toBe(10.55);
    expect(lookup("m4.ho.optimistic")).toBe(5);
    expect(lookup("m4.ho.optimistic_any")).toBe(6);
    expect(lookup("m4.eval.meets")).toBe(45);
    expect(lookup("m4.ab.pooled.higher")).toBe(18);
    expect(lookup("m4.ab.qwen2.better")).toBe(22);
    expect((lookup("m4.spend.key") as number).toFixed(2)).toBe("4.15");
    expect(lookup("m4.fb.recorded")).toBe(92);
    expect(lookup("m4.replay.m3")).toBe(30);
    expect(lookup("m4.gt.power.m")).toBe(3);
    // p-values: four decimals below 0.001, three below 0.1, else two
    expect(formatValue(lookup("m4.ab.qwen2.regret_p"), "p")).toBe("0.0002");
    expect(formatValue(lookup("m4.ab.pooled.p"), "p")).toBe("0.014");
    expect(formatValue(lookup("m4.ab.qwen.p"), "p")).toBe("0.42");
  });
  it("short design names", () => {
    expect(shortKey("unrolled_k:data_width=15,n_iter=13,k=2")).toBe(
      "unrolled_k W=15 N=13 k=2",
    );
    expect(shortKey("pipelined:data_width=17,n_iter=14")).toBe(
      "pipelined W=17 N=14",
    );
  });
});

describe("the write-up", () => {
  const md = readFileSync("vendor/hw_dse/docs/WRITEUP.md", "utf-8");
  const w = parseWriteup(md);
  it("splits into its sections, facts and the ladder diagram, text untouched", () => {
    expect(w.title).toBe(
      "HW Design Space Agent: final technical report (M1–M4)",
    );
    expect(w.sections.map((s) => s.title)).toContain("Limitations");
    expect(w.sections[0]!.id).toBe("the-question");
    const facts = w.sections
      .flatMap((s) => s.blocks)
      .filter((b) => b.kind === "facts");
    expect(facts).toHaveLength(13);
    const flow = w.sections
      .flatMap((s) => s.blocks)
      .find((b) => b.kind === "flow");
    expect(
      flow && flow.kind === "flow" && flow.flow.nodes.map((n) => n.id),
    ).toEqual(["L0", "L1", "L2", "L3", "L4", "L5"]);
    // the dollar amounts survive as text
    const text = w.sections
      .flatMap((s) => s.blocks)
      .filter((b) => b.kind === "md")
      .map((b) => (b as { text: string }).text)
      .join("\n");
    expect(text).toContain("$0.0090");
    expect(text).toContain("$13.64");
    expect(text).not.toContain("<!--");
    // every named fact exists in writeup_facts.json
    const known = JSON.parse(
      readFileSync("vendor/hw_dse/docs/writeup_facts.json", "utf-8"),
    ) as Record<string, unknown>;
    for (const f of facts)
      for (const n of (f as { names: string[] }).names)
        expect(known).toHaveProperty([n]);
  });
  it("parses Mermaid edges, solid and dashed", () => {
    const f = parseFlow(
      'flowchart LR\n    A["a<br/>one"] --> B\n    B["b"] --> C\n    C -. "back<br/>loop" .-> A\n    D',
    );
    expect(f.direction).toBe("LR");
    expect(f.nodes.map((n) => [n.id, n.lines])).toEqual([
      ["A", ["a", "one"]],
      ["B", ["b"]],
      ["C", ["C"]],
    ]);
    expect(f.edges).toEqual([
      { from: "A", to: "B", dashed: false, label: [] },
      { from: "B", to: "C", dashed: false, label: [] },
      { from: "C", to: "A", dashed: true, label: ["back", "loop"] },
    ]);
    expect(parseFlow("").direction).toBe("TD");
  });
  it("helpers", () => {
    expect(blocks("<!-- a note -->\ntext")).toEqual([
      { kind: "md", text: "text" },
    ]);
    expect(parseWriteup("# T\n").sections).toEqual([]);
    expect(slug("L2 → L1 feedback")).toBe("l2-l1-feedback");
    expect(factValue(635040)).toBe("635,040");
    expect(factValue(0.1234567)).toBe("0.123457");
    expect(factValue("3.1.0")).toBe("3.1.0");
  });
});
