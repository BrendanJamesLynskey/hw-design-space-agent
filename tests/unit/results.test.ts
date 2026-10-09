/**
 * Part B's models of the recorded runs: the trace replay, the Pareto replay, the hypervolume
 * race, the calculator and the fleet. Key frames are checked against the Python reference's
 * exported values (each run's summary totals, the per-round Pareto masks, the results.md HV
 * means), so no animation can drift from the data it claims to show.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { calculate, parseEntry } from "@/lib/dse/calc";
import { raceCaption, replayCaption, traceCaption } from "@/lib/dse/captions";
import { ev, runsOf, site, type MsKey } from "@/lib/dse/data";
import { fleetSpan, maxConcurrent } from "@/lib/dse/fleet";
import {
  leader,
  methodAt,
  race,
  races,
  raceSteps,
  seedAt,
  stoppedBy,
} from "@/lib/dse/race";
import { extent, pointsOf, replayFrames, staircase } from "@/lib/dse/replay";
import { loadRun } from "@/components/dse/loadRun";
import {
  findRun,
  modelsOf,
  seedsOf,
  switchMilestone,
  type RunData,
} from "@/lib/dse/runs";
import { traceFrames, visited } from "@/lib/dse/trace";
import { lookup } from "@/lib/dse/values";

const DIR = path.resolve(__dirname, "../../src/data/runs");
const RUNS: RunData[] = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(path.join(DIR, f), "utf-8")) as RunData);

const close = (a: number, b: number, eps = 1e-9) =>
  expect(Math.abs(a - b)).toBeLessThan(eps);

const MS: MsKey[] = ["m1", "m2"];

describe("the recorded runs", () => {
  it("are all 108 (48 in M1, 60 in M2), one per milestone, spec, model and seed", () => {
    expect(RUNS).toHaveLength(108);
    expect(site.runs).toHaveLength(108);
    expect(runsOf("m1")).toHaveLength(48);
    expect(runsOf("m2")).toHaveLength(60);
    for (const r of RUNS)
      expect(findRun(r.milestone, r.spec, r.model, r.seed)!.id).toBe(r.id);
    for (const ms of MS)
      expect(modelsOf(ms).map((m) => m.label)).toEqual(
        ev(ms).costs.models.map((m) => m.label),
      );
    expect(seedsOf("m1")).toEqual([0, 1, 2]);
    expect(seedsOf("m2")).toEqual([0, 1, 2, 3, 4]);
  });

  it("switching milestone keeps what the other milestone has", () => {
    const a = switchMilestone(
      {
        ms: "m2",
        spec: "high_precision",
        model: "deepseek/deepseek-v4.1-flash",
        seed: 4,
      },
      "m1",
    );
    expect(a).toEqual({
      ms: "m1",
      spec: "high_precision",
      model: "deepseek/deepseek-v4.1-flash",
      seed: 0,
    });
    const b = switchMilestone(
      { ms: "m1", spec: "dds_250msps", model: "qwen/qwen3.8-27b", seed: 2 },
      "m2",
    );
    expect(b.model).toBe(modelsOf("m2")[0]!.model);
    expect(b.seed).toBe(2);
  });

  it("load on demand", async () => {
    const id = site.runs[0]!.id;
    const r = await loadRun(id);
    expect(r.id).toBe(id);
  });

  it("add up to the cost table's totals per model (results.md)", () => {
    for (const ms of MS)
      for (const m of ev(ms).costs.models) {
        const mine = RUNS.filter(
          (r) => r.milestone === ms && r.model === m.model,
        );
        close(
          mine.reduce((a, r) => a + r.cost_usd, 0),
          m.cost_usd,
          1e-6,
        );
        expect(mine.reduce((a, r) => a + r.input_tokens, 0)).toBe(
          m.input_tokens,
        );
        expect(mine.reduce((a, r) => a + r.llm_calls, 0)).toBe(m.llm_calls);
      }
  });
});

describe("trace replay", () => {
  it("ends on every run's recorded totals, call by call", () => {
    for (const r of RUNS) {
      const fr = traceFrames(r);
      const last = fr[fr.length - 1]!;
      expect(last.kind).toBe("report");
      expect(last.calls).toBe(r.llm_calls);
      expect(last.failed).toBe(r.llm_failures);
      expect(last.inputTokens).toBe(r.input_tokens);
      expect(last.outputTokens).toBe(r.output_tokens);
      close(last.costUsd, r.cost_usd, 1e-9);
      expect(last.evaluated).toBe(r.n_evals);
      // the graph's order: intake, confirm, then propose before any exploration
      expect(fr[0]!.node).toBe("intake");
      expect(fr[1]!.node).toBe("confirm_spec");
      expect(fr.findIndex((f) => f.node === "propose")).toBeLessThan(
        fr.findIndex((f) => f.node === "explore_family"),
      );
      // an infeasible verdict goes straight to report; anything else selects first,
      // and M2's graph then back-annotates
      expect(fr.some((f) => f.kind === "select")).toBe(
        r.status !== "infeasible",
      );
      expect(fr.some((f) => f.kind === "annotate")).toBe(
        r.status !== "infeasible" && r.milestone === "m2",
      );
      // one explore frame per round, with its Send fan-out
      const ex = fr.filter((f) => f.kind === "explore");
      expect(ex.map((f) => f.round)).toEqual(r.rounds.map((x) => x.round));
      ex.forEach((f, k) =>
        expect(f.jobs.reduce((a, j) => a + j.evals, 0)).toBe(
          r.rounds[k]!.evals,
        ),
      );
      expect(fr.filter((f) => f.kind === "rule")).toHaveLength(
        r.rounds.filter((x) => x.rules.length > 0).length,
      );
      const spec = site.specs[r.spec]!;
      for (const f of fr)
        expect(traceCaption(f, r, spec).length).toBeGreaterThan(20);
    }
  });

  it("captions the hero run's key frames from its trace", () => {
    const r = RUNS.find((x) => x.run === site.hero.run)!;
    const fr = traceFrames(r);
    const spec = site.specs[r.spec]!;
    expect(traceCaption(fr[0]!, r, spec)).toContain(
      "is given as a validated Spec; no LLM call is needed",
    );
    expect(traceCaption(fr[1]!, r, spec)).toContain("interrupt()");
    const p = fr[2]!;
    const c0 = r.calls[0]!;
    expect(traceCaption(p, r, spec)).toBe(
      `propose (LLM, Sonnet 5.5): explore ${c0.families!.join(" and ")}. ${(
        c0.input_tokens + c0.output_tokens
      ).toLocaleString(
        "en-GB",
      )} tokens, $${Number(c0.cost_usd.toPrecision(3))}, ${Number(c0.latency_s.toPrecision(3))} s.`,
    );
    expect(traceCaption(fr[3]!, r, spec)).toContain(
      `Round 1, Send fan-out: ${r.rounds[0]!.jobs.map((j) => `${j.family} ${j.evals}`).join(", ")}`,
    );
    expect(traceCaption(fr[fr.length - 3]!, r, spec)).toContain(
      "select: the spec's rule (min luts_plus_ffs)",
    );
    expect(traceCaption(fr[fr.length - 2]!, r, spec)).toContain(
      "back_annotate (L5, code): the selected design was synthesised in L4. LUTs 159 → 216",
    );
    const code = fr.find(
      (f) => f.kind === "explore" && !r.rounds[f.round - 1]!.llm_call,
    )!;
    expect(traceCaption(code, r, spec)).toContain(
      "a front-mapping round planned by code",
    );
    expect(traceCaption(code, r, spec)).toContain("No LLM call follows");
    const v = visited(fr, 3);
    expect([...v]).toEqual([
      "intake",
      "confirm_spec",
      "propose",
      "explore_family",
    ]);
  });

  it("back-annotation with nothing measured says so", () => {
    const r = RUNS.find(
      (x) =>
        x.milestone === "m2" &&
        x.back_annotation &&
        !x.back_annotation.compared,
    )!;
    const f = traceFrames(r).find((x) => x.kind === "annotate")!;
    expect(traceCaption(f, r, site.specs[r.spec]!)).toContain(
      "no measured data for the selected design",
    );
  });

  it("shows failed calls and the hard rules code applied", () => {
    const failed = RUNS.find((r) => r.calls.some((c) => !c.ok))!;
    const fr = traceFrames(failed);
    const spec = site.specs[failed.spec]!;
    const f = fr.find((x) => x.call !== null && !failed.calls[x.call]!.ok)!;
    expect(traceCaption(f, failed, spec)).toContain("the call failed");
    expect(traceCaption(f, failed, spec)).toContain("no usage was reported");
    const odd = RUNS.find((r) =>
      r.calls.some((c) => !c.ok && c.input_tokens > 0),
    )!;
    const of = traceFrames(odd).find(
      (x) =>
        x.call !== null &&
        !odd.calls[x.call]!.ok &&
        odd.calls[x.call]!.input_tokens > 0,
    )!;
    expect(traceCaption(of, odd, site.specs[odd.spec]!)).toContain(
      "it reported 11,044 tokens and $0.",
    );
    const ruled = RUNS.find((r) => r.rounds.some((x) => x.rules.length))!;
    const rf = traceFrames(ruled).find((x) => x.kind === "rule")!;
    expect(traceCaption(rf, ruled, site.specs[ruled.spec]!)).toMatch(
      /^Hard rule \(code, not the LLM\): .+\. Effective decision: \w+\.$/,
    );
    const err = { ...failed.calls.find((c) => !c.ok)!, error: null };
    const run2 = { ...failed, calls: [err] };
    expect(traceCaption({ ...f, call: 0 }, run2, spec)).toContain("(error)");
  });
});

describe("Pareto replay", () => {
  it("draws the Python reference's front after every round", () => {
    for (const r of RUNS) {
      const fr = replayFrames(r);
      expect(fr).toHaveLength(r.rounds.length + 2);
      expect(fr[0]!.phase).toBe("plan");
      expect(fr[fr.length - 1]!.phase).toBe("result");
      r.rounds.forEach((x, k) => {
        const f = fr[k + 1]!;
        expect(f.front).toEqual(x.front);
        expect(f.shown).toBe(x.total);
        // every front point met the spec, and none is dominated by another shown point
        for (const i of f.front) expect(r.points.feasible[i]).toBe("1");
        const pts = pointsOf(r, f);
        expect(pts).toHaveLength(x.total);
        expect(pts.filter((p) => p.current)).toHaveLength(x.evals);
      });
      const gt = site.ground_truth[r.spec]!;
      const ex = extent(r, gt);
      expect(ex.x[0]).toBeLessThan(ex.x[1]);
      for (const f of fr)
        expect(replayCaption(f, r, gt).length).toBeGreaterThan(20);
    }
  });

  it("ends on the run's recorded hypervolume and selection", () => {
    for (const r of RUNS.filter((x) => x.hv_frac !== null)) {
      const fr = replayFrames(r);
      close(fr[fr.length - 1]!.hvFrac!, r.hv_frac!, 1e-5);
    }
    const opt = RUNS.find((r) => r.select_regret === 0)!;
    const gt = site.ground_truth[opt.spec]!;
    const fo = replayFrames(opt);
    expect(replayCaption(fo[fo.length - 1]!, opt, gt)).toContain(
      "the true optimum.",
    );
    const off = RUNS.find((r) => (r.select_regret ?? 0) > 0)!;
    const fx = replayFrames(off);
    expect(
      replayCaption(fx[fx.length - 1]!, off, site.ground_truth[off.spec]!),
    ).toMatch(/from the true optimum, /);
    const inf = RUNS.find((r) => r.llm_declared_infeasible)!;
    const fi = replayFrames(inf);
    expect(fi[0]!.hvFrac).toBeNull();
    expect(
      replayCaption(fi[fi.length - 1]!, inf, site.ground_truth[inf.spec]!),
    ).toContain("declared the spec infeasible");
    expect(
      replayCaption(fi[1]!, inf, site.ground_truth[inf.spec]!),
    ).not.toContain("hypervolume");
  });

  it("captions code's front-mapping rounds", () => {
    const r = RUNS.find((x) => x.rounds.some((y) => !y.llm_call))!;
    const k = r.rounds.findIndex((y) => !y.llm_call);
    expect(
      replayCaption(replayFrames(r)[k + 1]!, r, site.ground_truth[r.spec]!),
    ).toContain("code's final front-mapping round");
    const m = RUNS.find((x) =>
      x.rounds.some((y) => y.plan_by_code && y.llm_call),
    )!;
    const j = m.rounds.findIndex((y) => y.plan_by_code && y.llm_call);
    expect(
      replayCaption(replayFrames(m)[j + 1]!, m, site.ground_truth[m.spec]!),
    ).toContain("(front-mapping, planned by code)");
  });

  it("captions a round the LLM failed to answer and one code overrode", () => {
    const r = RUNS.find((x) =>
      x.rounds.some((y) => y.llm_call && y.llm_decision === null),
    );
    const o = RUNS.find((x) =>
      x.rounds.some(
        (y) => y.llm_decision !== null && y.decision !== y.llm_decision,
      ),
    )!;
    const k = o.rounds.findIndex((y) => y.decision !== y.llm_decision);
    expect(
      replayCaption(replayFrames(o)[k + 1]!, o, site.ground_truth[o.spec]!),
    ).toContain("code overrode it to");
    if (r) {
      const j = r.rounds.findIndex(
        (y) => y.llm_call && y.llm_decision === null,
      );
      expect(
        replayCaption(replayFrames(r)[j + 1]!, r, site.ground_truth[r.spec]!),
      ).toContain("nothing (no valid answer)");
    }
  });

  it("draws a front as a staircase", () => {
    expect(staircase([3, 1, 2], [1, 3, 2])).toEqual([
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
    ]);
  });

  it("pads a degenerate extent", () => {
    const r = RUNS[0]!;
    const one = {
      ...r,
      points: { ...r.points, x: [5], y: [5] },
    };
    const ex = extent(one, { ...site.ground_truth[r.spec]!, front: [] });
    expect(ex.x[0]).toBeLessThan(5);
    const zero = { ...r, points: { ...r.points, x: [0], y: [0] } };
    const ez = extent(zero, { ...site.ground_truth[r.spec]!, front: [] });
    expect(ez.x).toEqual([-0.05, 0.05]);
  });
});

describe("hypervolume race", () => {
  it("ends on results.md's mean HV fraction for every method, spec and milestone", () => {
    for (const ms of MS)
      for (const [name, spec] of Object.entries(races[ms].specs)) {
        for (const m of spec.methods) {
          expect(m.seeds).toHaveLength(races[ms].seeds);
          const row = ev(ms).results[name]!.find((r) => r.method === m.method)!;
          expect(methodAt(m, spec.budget).toFixed(3)).toBe(
            row.hv_frac_mean!.toFixed(3),
          );
          // each seed's final value is its recorded HV fraction
          for (const s of m.seeds) close(seedAt(s, s.n), s.hv_frac!, 1e-5);
        }
      }
    expect(race).toBe(races.m2);
  });

  it("evaluations to 95% match the recorded runs", () => {
    for (const ms of MS)
      for (const spec of Object.values(races[ms].specs))
        for (const m of spec.methods)
          for (const s of m.seeds) {
            if (s.evals_to_95 === null)
              expect(seedAt(s, s.n)).toBeLessThan(0.95);
            else
              expect(
                seedAt(s, Math.ceil(s.evals_to_95 / 5) * 5),
              ).toBeGreaterThanOrEqual(0.95);
          }
  });

  it("M1 key frames: nothing at 0, agents flat after they stop, NSGA-II leads dds", () => {
    const spec = races.m1.specs.dds_250msps!;
    expect(raceSteps(spec)).toHaveLength(41);
    for (const m of spec.methods) expect(methodAt(m, 0)).toBe(0);
    const ns = spec.methods.find((m) => m.method === "nsga2")!;
    expect(seedAt(ns.seeds[0]!, 3)).toBe(0);
    for (const m of spec.methods.filter((x) => x.agent)) {
      const stop = stoppedBy(m);
      expect(methodAt(m, stop)).toBe(methodAt(m, spec.budget));
    }
    expect(leader(spec, 400).method).toBe("nsga2");
    expect(raceCaption(0, spec, "dds_250msps", "M1")).toContain(
      "M1, dds_250msps: every method starts with nothing",
    );
    const c = raceCaption(400, spec, "dds_250msps", "M1");
    expect(c).toContain("NSGA-II 0.800");
    expect(c).toContain("(stopped)");
    expect(c).toContain("Leading: NSGA-II.");
    expect(leader(races.m1.specs.high_precision!, 400).agent).toBe(true);
  });

  it("M2 key frames: agents use the whole budget and lead at the end on every spec", () => {
    for (const [name, spec] of Object.entries(races.m2.specs)) {
      for (const m of spec.methods) expect(stoppedBy(m)).toBe(spec.budget);
      expect(leader(spec, 400).agent, name).toBe(true);
    }
    expect(
      raceCaption(400, races.m2.specs.dds_250msps!, "dds_250msps"),
    ).not.toContain("(stopped)");
  });
});

describe("calculator", () => {
  const models = ev("m2").costs.models;
  const base = {
    specs: 10,
    runsPerSpec: 3,
    parallel: 4,
    models: [models[0]!.model],
    hourlyRate: null,
    hoursPerStudy: null,
  };

  it("projects from the measured means only", () => {
    const m = models[0]!;
    const o = calculate(base, models);
    expect(o.runs).toBe(30);
    close(o.llmUsd, 30 * m.cost_per_run);
    close(o.evaluations, 30 * (m.evals / m.runs));
    close(o.usdPerDesign, o.llmUsd / o.evaluations);
    close(o.agentHoursSerial, (30 * m.wall_s_mean) / 3600);
    close(o.agentHoursParallel, o.agentHoursSerial / 4);
    expect(o.manualHours).toBeNull();
    expect(o.manualUsd).toBeNull();
  });

  it("prices manual work only with the reader's own figures", () => {
    const h = calculate({ ...base, hoursPerStudy: 8 }, models);
    expect(h.manualHours).toBe(80);
    expect(h.manualUsd).toBeNull();
    const both = calculate(
      { ...base, hoursPerStudy: 8, hourlyRate: 50 },
      models,
    );
    expect(both.manualUsd).toBe(4000);
    const none = calculate({ ...base, models: [], parallel: 0 }, models);
    expect(none.usdPerDesign).toBe(0);
    expect(none.agentHoursParallel).toBe(0);
  });

  it("reads entries: empty or invalid is not entered", () => {
    expect(parseEntry("")).toBeNull();
    expect(parseEntry(" 12.5 ")).toBe(12.5);
    expect(parseEntry("-3")).toBeNull();
    expect(parseEntry("abc")).toBeNull();
  });
});

describe("fleet", () => {
  it("measures each eval's concurrency", () => {
    expect(maxConcurrent(runsOf("m1"))).toBe(6);
    expect(fleetSpan(runsOf("m1"))).toBeGreaterThan(100 * 60);
    expect(lookup("m1.fleet.max")).toBe(6);
    expect(lookup("m2.fleet.max")).toBe(maxConcurrent(runsOf("m2")));
    expect(maxConcurrent(runsOf("m2"))).toBeGreaterThan(1);
  });
});

describe("quoted values on the results page", () => {
  it("M1: random search beat every agent on HV where NSGA-II did", () => {
    for (const s of ["dds_250msps", "low_area_control"]) {
      const rows = ev("m1").results[s]!;
      const rnd = rows.find((r) => r.method === "random")!.hv_frac_mean!;
      for (const r of rows.filter((x) => x.agent))
        expect(r.hv_frac_mean!).toBeLessThan(rnd);
    }
  });

  it("M1: names the one pair that lost to NSGA-II on regret", () => {
    expect(lookup("m1.regret.agent_beats_nsga2")).toBe(11);
    expect(lookup("m1.low_area_control.qwen_off_regret")).toBeGreaterThan(
      lookup("m1.low_area_control.nsga2_regret") as number,
    );
    expect(lookup("m1.calls.qwen_length")).toBe(17);
  });

  it("M2: what got worse, as the repository states it", () => {
    expect(lookup("glance.qwen_hp_worst_seed")).toBeCloseTo(0.71654, 5);
    expect((lookup("glance.qwen_hp_median") as number).toFixed(3)).toBe(
      "0.056",
    );
    expect(lookup("glance.mf_deepseek")).toBe(13);
    expect(lookup("glance.mf_qwen")).toBe(7);
    expect(lookup("glance.mf_sonnet")).toBe(4);
    expect(lookup("glance.mf_runs")).toBe(15);
    expect(
      (lookup("glance.ds_dds_regret_m1") as number) <
        (lookup("glance.ds_dds_regret_m2") as number),
    ).toBe(true);
    expect(
      (lookup("glance.ds_low_regret_m1") as number) <
        (lookup("glance.ds_low_regret_m2") as number),
    ).toBe(true);
  });
});
