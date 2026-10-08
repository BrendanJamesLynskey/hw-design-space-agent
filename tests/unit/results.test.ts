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
import { site } from "@/lib/dse/data";
import { fleetSpan, maxConcurrent } from "@/lib/dse/fleet";
import {
  leader,
  methodAt,
  race,
  raceSteps,
  seedAt,
  stoppedBy,
} from "@/lib/dse/race";
import { extent, pointsOf, replayFrames, staircase } from "@/lib/dse/replay";
import { loadRun } from "@/components/dse/loadRun";
import { findRun, MODELS, type RunData } from "@/lib/dse/runs";
import { traceFrames, visited } from "@/lib/dse/trace";
import { lookup } from "@/lib/dse/values";

const DIR = path.resolve(__dirname, "../../src/data/runs");
const RUNS: RunData[] = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(path.join(DIR, f), "utf-8")) as RunData);

const close = (a: number, b: number, eps = 1e-9) =>
  expect(Math.abs(a - b)).toBeLessThan(eps);

describe("the recorded runs", () => {
  it("are all 48, one per spec, model and seed, in the index", () => {
    expect(RUNS).toHaveLength(48);
    expect(site.runs).toHaveLength(48);
    for (const r of RUNS)
      expect(findRun(r.spec, r.model, r.seed)!.id).toBe(r.id);
    expect(MODELS.map((m) => m.label)).toEqual(
      site.costs.models.map((m) => m.label),
    );
  });

  it("load on demand", async () => {
    const id = site.runs[0]!.id;
    const r = await loadRun(id);
    expect(r.id).toBe(id);
  });

  it("add up to the cost table's totals per model (results.md)", () => {
    for (const m of site.costs.models) {
      const mine = RUNS.filter((r) => r.model === m.model);
      close(
        mine.reduce((a, r) => a + r.cost_usd, 0),
        m.cost_usd,
        1e-6,
      );
      expect(mine.reduce((a, r) => a + r.input_tokens, 0)).toBe(m.input_tokens);
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
      // an infeasible verdict goes straight to report; anything else selects first
      expect(fr.some((f) => f.kind === "select")).toBe(
        r.status !== "infeasible",
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
    expect(traceCaption(p, r, spec)).toBe(
      `propose (LLM, Sonnet 5.5): explore pipelined_m and pipelined. ${(
        r.calls[0]!.input_tokens + r.calls[0]!.output_tokens
      ).toLocaleString("en-GB")} tokens, $0.0194, 11.9 s.`,
    );
    expect(traceCaption(fr[3]!, r, spec)).toContain(
      "Round 1, Send fan-out: pipelined_m 67, pipelined 33",
    );
    expect(traceCaption(fr[fr.length - 2]!, r, spec)).toContain(
      "select: the spec's rule (min luts_plus_ffs)",
    );
    const v = visited(fr, 3);
    expect([...v]).toEqual([
      "intake",
      "confirm_spec",
      "propose",
      "explore_family",
    ]);
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

  it("captions a round the LLM failed to answer and one code overrode", () => {
    const r = RUNS.find((x) => x.rounds.some((y) => y.llm_decision === null));
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
      const j = r.rounds.findIndex((y) => y.llm_decision === null);
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
  it("ends on results.md's mean HV fraction for every method and spec", () => {
    for (const [name, spec] of Object.entries(race.specs)) {
      for (const m of spec.methods) {
        const row = site.results[name]!.find((r) => r.method === m.method)!;
        expect(methodAt(m, spec.budget).toFixed(3)).toBe(
          row.hv_frac_mean!.toFixed(3),
        );
        // each seed's final value is its recorded HV fraction
        for (const s of m.seeds) close(seedAt(s, s.n), s.hv_frac!, 1e-5);
      }
    }
  });

  it("evaluations to 95% match the recorded runs", () => {
    for (const spec of Object.values(race.specs))
      for (const m of spec.methods)
        for (const s of m.seeds) {
          if (s.evals_to_95 === null) expect(seedAt(s, s.n)).toBeLessThan(0.95);
          else
            expect(
              seedAt(s, Math.ceil(s.evals_to_95 / 5) * 5),
            ).toBeGreaterThanOrEqual(0.95);
        }
  });

  it("has key frames: nothing at 0, agents flat after they stop", () => {
    const spec = race.specs.dds_250msps!;
    expect(raceSteps(spec)).toHaveLength(41);
    for (const m of spec.methods) expect(methodAt(m, 0)).toBe(0);
    const ns = spec.methods.find((m) => m.method === "nsga2")!;
    expect(seedAt(ns.seeds[0]!, 3)).toBe(0);
    for (const m of spec.methods.filter((x) => x.agent)) {
      const stop = stoppedBy(m);
      expect(methodAt(m, stop)).toBe(methodAt(m, spec.budget));
    }
    expect(leader(spec, 400).method).toBe("nsga2");
    expect(raceCaption(0, spec, "dds_250msps")).toContain(
      "starts with nothing",
    );
    const c = raceCaption(400, spec, "dds_250msps");
    expect(c).toContain("NSGA-II 0.800");
    expect(c).toContain("(stopped)");
    expect(c).toContain("Leading: NSGA-II.");
    expect(leader(race.specs.high_precision!, 400).agent).toBe(true);
  });
});

describe("calculator", () => {
  const models = site.costs.models;
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
  it("measures the eval's concurrency", () => {
    expect(maxConcurrent(site.runs)).toBe(6);
    expect(fleetSpan(site.runs)).toBeGreaterThan(100 * 60);
    expect(lookup("fleet.max")).toBe(6);
  });
});

describe("quoted values on the results page", () => {
  it("random search beats every agent on HV where NSGA-II does", () => {
    for (const s of ["dds_250msps", "low_area_control"]) {
      const rows = site.results[s]!;
      const rnd = rows.find((r) => r.method === "random")!.hv_frac_mean!;
      for (const r of rows.filter((x) => x.agent))
        expect(r.hv_frac_mean!).toBeLessThan(rnd);
    }
  });

  it("names the one pair that lost to NSGA-II on regret", () => {
    expect(lookup("regret.agent_beats_nsga2")).toBe(11);
    expect(lookup("low_area_control.qwen_off_regret")).toBeGreaterThan(
      lookup("low_area_control.nsga2_regret") as number,
    );
    expect(lookup("calls.qwen_length")).toBe(17);
  });
});
