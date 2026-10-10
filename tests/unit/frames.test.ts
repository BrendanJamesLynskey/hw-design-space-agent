/**
 * The animations' state sequences (visual standard §2): each is a pure function of the model or
 * the recorded data, and key frames are checked against the Python reference's numbers.
 */
import { describe, expect, it } from "vitest";

import costFx from "../fixtures/cost.json";
import cordicFx from "../fixtures/cordic.json";

import {
  climbCaption,
  datapathCaption,
  heroCaption,
  rotationCaption,
} from "@/lib/dse/captions";
import { climbFrames, climbGap } from "@/lib/dse/climb";
import { rotate, type Numerics } from "@/lib/dse/cordic";
import { site, why } from "@/lib/dse/data";
import {
  cyclesFor,
  datapathFrame,
  datapathFrames,
  firstResultCycle,
} from "@/lib/dse/datapath";
import { arch, type Family, type Params } from "@/lib/dse/families";
import { DESCENT, heroFrames, roundOf } from "@/lib/dse/hero";
import { ladder } from "@/lib/dse/ladder";

const hero = site.hero;
const spec = site.specs[hero.spec]!;
const w = ladder.worked;

describe("hero: one spec, every level", () => {
  const frames = heroFrames(hero, site.ladder);
  const live = site.ladder.filter((l) => l.status === "live").map((l) => l.id);

  it("never puts the spec card on a level that is not live", () => {
    for (const f of frames) expect(live).toContain(f.level);
    for (const f of frames)
      for (const c of f.checked) expect(live).toContain(c);
  });

  it("shows the planned levels only at the end, ghosted", () => {
    expect(frames.filter((f) => f.showPlanned).length).toBe(1);
    expect(frames[frames.length - 1]!.showPlanned).toBe(true);
  });

  it("key frames: the recorded run's counts and usage", () => {
    const round1 = frames.find((f) => f.phase === "round" && f.round === 1)!;
    expect(round1.evaluated).toBe(hero.rounds[0]!.cumulative_evals);
    expect(round1.feasible).toBe(hero.rounds[0]!.cumulative_feasible);
    const propose = frames.find((f) => f.phase === "propose")!;
    expect(propose.families).toEqual(hero.decisions[0]!.families);
    expect(propose.inputTokens).toBe(hero.decisions[0]!.input_tokens);
    const last = frames[frames.length - 1]!;
    expect(last.evaluated).toBe(400);
    expect(last.calls).toBe(hero.llm_calls);
    expect(last.inputTokens).toBe(hero.input_tokens);
    expect(last.outputTokens).toBe(hero.output_tokens);
    expect(last.costUsd).toBeCloseTo(hero.cost_usd, 9);
    expect(
      [...hero.feasible_bits.slice(0, last.evaluated)].filter((c) => c === "1")
        .length,
    ).toBe(last.feasible);
    // one analyse frame per LLM-decided round; code's last front-mapping round has none
    expect(frames.filter((f) => f.phase === "analyse")).toHaveLength(
      hero.rounds.filter((r) => r.llm_call).length,
    );
  });

  it("takes the selected design down the live levels only, in order", () => {
    expect(hero.selected.key).toBe(w.key);
    const down = frames.filter((f) => DESCENT.some((d) => d.phase === f.phase));
    expect(down.map((f) => f.level)).toEqual(["L3", "L4", "GL", "L5"]);
    expect(frames.some((f) => f.level === "SYS" || f.level === "L2")).toBe(
      false,
    );
    // the system and cycle levels are live, but this M2 run on a spec without a system
    // scenario did not use them: marked, never animated
    const sel = frames.find((f) => f.phase === "select")!;
    expect(sel.skipped).toEqual(["SYS", "L2"]);
    // a ladder whose lower levels are planned stops the descent there
    const m1ladder = site.ladder.map((l) =>
      l.milestone === "M2" ? { ...l, status: "planned" as const } : l,
    );
    expect(
      heroFrames(hero, m1ladder).filter((f) =>
        DESCENT.some((d) => d.phase === f.phase),
      ),
    ).toHaveLength(0);
  });

  it("every frame has a caption, from the run and the worked example", () => {
    for (const f of frames)
      expect(heroCaption(f, hero, spec, site.ladder, w).length).toBeGreaterThan(
        20,
      );
    const cap = (phase: string) =>
      heroCaption(
        frames.find((f) => f.phase === phase)!,
        hero,
        spec,
        site.ladder,
        w,
      );
    expect(
      heroCaption(frames[frames.length - 1]!, hero, spec, site.ladder, w),
    ).toMatch(/Every level of the ladder is live at this commit; milestone 4/);
    expect(cap("select")).toContain(
      "(SYS, L2, live since M3) have nothing to do here",
    );
    // with M3's levels planned (as at the previous commit), the old captions
    const m2ladder = site.ladder.map((l) =>
      l.milestone === "M3" ? { ...l, status: "planned" as const } : l,
    );
    const old = heroFrames(hero, m2ladder);
    expect(heroCaption(old[old.length - 1]!, hero, spec, m2ladder, w)).toMatch(
      /2 levels are planned \(M3\)/,
    );
    expect(
      heroCaption(
        old.find((f) => f.phase === "select")!,
        hero,
        spec,
        m2ladder,
        w,
      ),
    ).toContain("SimPy and cycle-level are not built yet");
    expect(heroCaption(frames[0]!, hero, spec, site.ladder, w)).toMatch(
      /max error ≤ 2\^-10/,
    );
    expect(cap("select")).toContain("the true optimum");
    expect(cap("rtl")).toContain(
      "Verilator 5.020 and Icarus Verilog 12.0 simulate all 32,768 input angles: 0 mismatches",
    );
    expect(cap("synth")).toContain("216 LUTs, 107 FFs, 150.7 MHz");
    expect(cap("gate")).toContain("0 mismatches, latency 15");
    expect(cap("annotate")).toContain("LUTs 159 → 216");
    expect(cap("annotate")).toContain("10 MSPS against ≥ 1");
    const code = frames.find(
      (f) => f.phase === "round" && hero.rounds[f.round - 1]!.by_code,
    )!;
    expect(heroCaption(code, hero, spec, site.ladder, w)).toContain(
      "front-mapping round",
    );
  });

  it("assigns evaluations to rounds", () => {
    expect(roundOf(hero, 0)).toBe(1);
    expect(roundOf(hero, hero.rounds[0]!.cumulative_evals)).toBe(2);
    expect(roundOf(hero, 399)).toBe(hero.rounds.length);
    expect(roundOf(hero, 400)).toBe(hero.rounds.length);
  });
});

describe("why: micro-optimise or explore", () => {
  const c = why.hill_climb;
  const gt = site.ground_truth.dds_250msps!;
  const frames = climbFrames(c);

  it("starts at the reference design and ends meeting the accuracy target", () => {
    expect(c.path[0]!.params).toEqual({
      data_width: 16,
      n_iter: 14,
      angle_guard: 0,
      frac_guard: 0,
      rounding: "trunc",
    });
    expect(c.path[0]!.meets_accuracy).toBe(false);
    expect(c.path[c.path.length - 1]!.meets_accuracy).toBe(true);
    for (const s of c.path) expect(s.family).toBe("iterative");
  });

  it("key frames: trail, ceiling, explored front, the spec's choice", () => {
    expect(frames.length).toBe(c.path.length + 3);
    expect(frames[0]!.pathShown).toBe(1);
    const ceil = frames.find((f) => f.phase === "ceiling")!;
    expect(ceil.showFront).toBe(false);
    expect(frames[frames.length - 1]!.showSelected).toBe(true);
    for (const f of frames)
      expect(climbCaption(f, c, gt).length).toBeGreaterThan(20);
    expect(climbCaption(ceil, c, gt)).toContain("39,690");
  });

  it("the gap is the ground truth's choice over the iterative ceiling", () => {
    const g = climbGap(c, gt);
    expect(g.ceiling.throughput_msps).toBeLessThan(c.throughput_min);
    expect(g.explored.throughput_msps).toBeGreaterThan(c.throughput_min);
    expect(g.throughputRatio).toBeGreaterThan(20);
    for (const s of c.path)
      if (s.meets_accuracy)
        expect(s.throughput_msps).toBeLessThanOrEqual(
          g.ceiling.throughput_msps,
        );
  });
});

describe("CORDIC rotation frames = the Python reference's registers", () => {
  for (const entry of cordicFx.configs.slice(0, 4)) {
    const c: Numerics = {
      dataWidth: entry.config.data_width,
      nIter: entry.config.n_iter,
      angleWidth: entry.config.angle_width,
      fracGuard: entry.config.frac_guard,
      rounding: entry.config.rounding as Numerics["rounding"],
    };
    it(`${JSON.stringify(entry.config)}: captions at key frames`, () => {
      const tr = entry.traces[0]!;
      const r = rotate(tr.theta, c);
      const n = r.states.length;
      for (const i of [0, 1, Math.floor(n / 2), n - 1]) {
        expect(r.states[i]).toEqual(tr.states[i]);
        expect(rotationCaption(r, c, i)).toMatch(
          i === 0 ? /^Input/ : new RegExp(`^Iteration ${i}:`),
        );
      }
    });
  }
  it("a quadrant-2 angle is pre-rotated by pi", () => {
    const c: Numerics = {
      dataWidth: 16,
      nIter: 14,
      angleWidth: 16,
      fracGuard: 0,
      rounding: "trunc",
    };
    const r = rotate(23666, c);
    expect(r.quadrant).toBe(1);
    expect(rotationCaption(r, c, 0)).toContain("pre-rotated by π");
    expect(rotationCaption(rotate(100, c), c, 0)).not.toContain("pre-rotated");
  });
});

describe("datapath schedule = the Python reference's latency and rate", () => {
  for (const r of costFx.rows) {
    it(r.key, () => {
      const a = arch(r.family as Family, r.params as Params);
      const frames = datapathFrames(a);
      expect(frames.length).toBe(cyclesFor(a));
      // the first result is delivered at the end of cycle latency - 1
      expect(firstResultCycle(frames)).toBe(r.latency_cycles - 1);
      // steady state: results per cycle
      const t0 = r.latency_cycles - 1;
      const t1 = frames.length - 1;
      const got = frames[t1]!.completed - frames[t0]!.completed;
      expect(got).toBe(Math.floor((t1 - t0) * r.results_per_cycle + 1e-9));
      // every token has done all N micro-rotations when it reaches the output slot
      const steps = r.steps;
      for (const f of frames)
        for (const t of f.tokens)
          if (t.slot === steps + 1)
            expect(t.rotationsDone).toBe(r.params.n_iter);
      expect(datapathCaption(frames[0]!, a, r.family)).toMatch(/^Cycle 0:/);
    });
  }
  it("captions: plural and singular forms, FSM phases", () => {
    const it16 = arch("iterative", {
      data_width: 16,
      n_iter: 14,
      angle_guard: 0,
      frac_guard: 0,
      rounding: "trunc",
    });
    expect(datapathCaption(datapathFrame(it16, 0), it16, "it")).toContain(
      "accepted (IDLE)",
    );
    expect(datapathCaption(datapathFrame(it16, 1), it16, "it")).toContain(
      "pre-rotated",
    );
    expect(datapathCaption(datapathFrame(it16, 16), it16, "it")).toContain(
      "output",
    );
    expect(datapathCaption(datapathFrame(it16, 5), it16, "it")).toContain(
      "rotation cycle 4/14: 4/14 micro-rotations done",
    );
    expect(datapathCaption(datapathFrame(it16, 16), it16, "it")).toContain(
      "1 result out",
    );
    const p = arch("pipelined", {
      data_width: 16,
      n_iter: 14,
      angle_guard: 0,
      frac_guard: 0,
      rounding: "trunc",
    });
    expect(datapathCaption(datapathFrame(p, 0), p, "p")).toContain(
      "1 angle in flight",
    );
    expect(datapathCaption(datapathFrame(p, 20), p, "p")).toContain(
      "results out",
    );
  });
});
