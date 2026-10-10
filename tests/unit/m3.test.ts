/**
 * Milestone 3: the system replay and the cycle-model panel are pure functions of
 * src/data/m3.json (three key frames each, at least), and the values the pages quote say what
 * the repository's results.md and README say.
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  cycleCaption,
  cycleFrames,
  laneAt,
  m3,
  ones,
  sysCaption,
  sysFrames,
  sysSpec,
  waits,
} from "@/lib/dse/m3";
import { formatValue, lookup } from "@/lib/dse/values";

const rep = m3.system_replay;
const by = (v: string) => rep.designs.find((d) => d.view === v)!;
const results = readFileSync("vendor/hw_dse/eval/results.md", "utf-8");
const readme = readFileSync("vendor/hw_dse/README.md", "utf-8").replace(
  /\s+/g,
  " ",
);

describe("system replay: multiaxis_control, m=7 / m=5 / m=4", () => {
  const frames = sysFrames(rep);

  it("three designs, the three views' winners, with the right verdicts", () => {
    expect(rep.designs.map((d) => [d.view, d.m])).toEqual([
      ["msps_only", 7],
      ["bound", 5],
      ["true", 4],
    ]);
    expect(rep.designs.map((d) => d.meets)).toEqual([false, false, true]);
    // m=5 passes the bound and misses the simulated deadline
    expect(by("bound").bound_meets).toBe(true);
    expect(by("bound").p99_us).toBeGreaterThan(rep.limit_us);
    expect(by("true").p99_us).toBeLessThan(rep.limit_us);
    // the simulated p99 is the ground truth's
    const gt = sysSpec("multiaxis_control");
    expect(by("true").p99_us).toBeCloseTo(
      gt.true.simulated.sys_p99_batch_us!,
      5,
    );
    expect(by("bound").p99_us).toBeCloseTo(
      gt.bound.simulated.sys_p99_batch_us!,
      5,
    );
  });

  it("key frames: the tick, the drain, every tick, the verdict", () => {
    expect(frames[0]).toEqual({ phase: "tick", t: 0 });
    expect(frames.at(-2)!.phase).toBe("ticks");
    expect(frames.at(-1)!.phase).toBe("verdict");
    // at the tick nothing is out; at the end every batch is complete
    for (const d of rep.designs) {
      const a = laneAt(d, 0);
      expect(a.done).toBe(0);
      expect(a.queued + a.inFlight).toBe(rep.requests);
      expect(laneAt(d, frames.at(-1)!.t).complete).toBe(true);
    }
    // 400 ns in: m=4 is done, m=5 and m=7 are not
    const f400 = frames.find((f) => f.phase === "drain" && f.t === 400)!;
    expect(laneAt(by("true"), f400.t).complete).toBe(true);
    expect(laneAt(by("bound"), f400.t).complete).toBe(false);
    expect(laneAt(by("msps_only"), f400.t).complete).toBe(false);
    // drain frames advance in time
    const drain = frames.filter((f) => f.phase === "drain").map((f) => f.t);
    expect([...drain].sort((a, b) => a - b)).toEqual(drain);
  });

  it("captions from the data", () => {
    for (const f of frames)
      expect(sysCaption(f, rep).length).toBeGreaterThan(40);
    expect(sysCaption(frames[0]!, rep)).toContain("32 sin/cos requests");
    const f400 = frames.find((f) => f.phase === "drain" && f.t === 400)!;
    expect(sysCaption(f400, rep)).toMatch(/m=4 done at 0\.378/);
    expect(sysCaption(frames.at(-2)!, rep)).toContain("m=5 0.4465 µs");
    expect(sysCaption(frames.at(-1)!, rep)).toContain("misses 0.44 µs by 1.5%");
  });
});

describe("the cycle model against the RTL", () => {
  const c = m3.cycle;

  it("48/48 traces, every family, both simulators", () => {
    expect([c.passed, c.traces, c.edges]).toEqual([48, 48, 28424]);
    expect(results).toContain(
      `${c.traces} short bursty traces (8 designs covering every family and both rounding modes x 3 seeds x ${c.simulators.join(", ")}), ${c.edges.toLocaleString("en-US")} clock edges: **${c.passed}/${c.traces} identical**`,
    );
  });

  for (const w of c.waves) {
    it(`${w.family}: windows walk along the trace, then the table`, () => {
      const frames = cycleFrames(w);
      expect(frames[0]).toEqual({ phase: "window", start: 0, end: 32 });
      expect(frames[1]!.start).toBe(8);
      expect(frames.at(-1)!.phase).toBe("table");
      // every accept is valid_in and ready on the same edge
      for (let i = 0; i < w.ready.length; i++)
        expect(w.accepted[i]).toBe(
          w.valid_in[i] === "1" && w.ready[i] === "1" ? "1" : "0",
        );
      // each result comes latency - 1 edges after its accept
      const acc = [...w.accepted].flatMap((b, i) => (b === "1" ? [i] : []));
      const out = [...w.valid_out].flatMap((b, i) => (b === "1" ? [i] : []));
      out.forEach((e, k) => expect(e - acc[k]!).toBe(w.latency - 1));
      for (const f of frames)
        expect(cycleCaption(f, w, c).length).toBeGreaterThan(40);
      const mid = frames[2]!;
      expect(cycleCaption(mid, w, c)).toContain(
        `${ones(w.accepted, mid.start, mid.end)} angles accepted`,
      );
      expect(cycleCaption(frames.at(-1)!, w, c)).toContain("48/48 identical");
    });
  }

  it("the FSM design holds angles back; the pipelined one never does", () => {
    const [fsm, pipe] = c.waves as [(typeof c.waves)[0], (typeof c.waves)[0]];
    expect(fsm.ii).toBeGreaterThan(1);
    expect(waits(fsm, 0, fsm.ready.length)).toBeGreaterThan(0);
    expect(cycleCaption(cycleFrames(fsm)[3]!, fsm, c)).toContain("ready drops");
    expect(pipe.ii).toBe(1);
    expect(waits(pipe, 0, pipe.ready.length)).toBe(0);
    expect(cycleCaption(cycleFrames(pipe)[3]!, pipe, c)).toContain(
      "ready stays high",
    );
  });
});

describe("the values the pages quote match the repository", () => {
  const v = (name: string, fmt: Parameters<typeof formatValue>[1]) =>
    formatValue(lookup(name), fmt);

  it("system specs", () => {
    expect(v("m3.multi.feasible", "int")).toBe("51,244");
    expect(v("m3.multi.feasible_bound", "int")).toBe("53,667");
    expect(v("m3.multi.miss", "pct")).toBe("1.5%");
    expect(v("m3.multi.peak_floor", "f1")).toBe("72.7");
    expect(v("m3.bursty.feasible", "int")).toBe("151,528");
    expect(v("m3.bursty.msps_p99", "f2")).toBe("1.18");
    expect(v("m3.bursty.msps_ratio", "x")).toBe("2×");
    expect(v("m3.bursty.msps_ii", "int")).toBe("15");
    expect(v("m3.bursty.area_ratio", "x")).toBe("3×");
    expect(v("m3.dds.sfdr", "f1")).toBe("100.3");
    // the README says so too
    expect(readme).toContain(
      "its simulated p99 is 1.18 µs, 2.0× even the isolated-burst bound",
    );
    expect(readme).toContain("the winner is a `pipelined_m` at 3× the area");
    expect(readme).toContain("takes one request every 15 cycles");
    expect(readme).toContain("already has 100.3 dBc SFDR");
  });

  it("the structured graph and the A/B", () => {
    expect(v("m3.struct.l2_changed", "int")).toBe("0");
    expect(v("m3.struct.runs", "int")).toBe("30");
    expect(v("m3.struct.hv_min", "f3")).toBe("0.838");
    expect(v("m3.struct.nsga2_hv_max", "f3")).toBe("0.840");
    expect(v("m3.struct.regret_min", "spct")).toBe("+3.2%");
    expect(v("m3.struct.regret_max", "spct")).toBe("+15.8%");
    expect(v("m3.ab.single", "int")).toBe("52");
    expect(v("m3.ab.campaigns", "int")).toBe("65");
    expect(v("m3.ab.loops", "int")).toBe("4");
    expect(v("m3.ab.cost_ratio_min", "f2")).toBe("1.44");
    expect(v("m3.ab.cost_ratio_max", "f2")).toBe("2.25");
    expect(v("m3.ab.outlier_hv", "f3")).toBe("0.097");
    expect(v("m3.ab.outlier_regret", "spct")).toBe("+224.5%");
    expect(readme).toContain("the run ended at HV 0.097, +224% regret");
    expect(v("m3.ab.deepseek.hv_s", "f3")).toBe("0.905");
    expect(v("m3.ab.deepseek.hv_c", "f3")).toBe("0.893");
    expect(v("m3.ab.qwen.regret_c", "spct")).toBe("+19.0%");
    expect(v("m3.ab.sonnet.regret_c", "spct")).toBe("+5.7%");
    expect(v("m3.ab.input_ratio_min", "x")).toBe("3.5×");
    expect(v("m3.ab.input_ratio_max", "x")).toBe("8.9×");
    expect(readme).toContain("with 3.5–9× the input tokens");
    expect(v("m3.levers.hp_regret_m2", "str")).toBe("+8.0%");
    expect(v("m3.levers.hp_regret_fix", "str")).toBe("+4.0%");
    expect(v("m3.memory_label", "str")).toBe("Qwen3.8-27B, reasoning off");
  });

  it("spend", () => {
    expect(v("m3.spend.key", "usd")).toBe("$3.58");
    expect(v("m3.spend.ledger", "usd")).toBe("$3.49");
    expect(v("m3.spend.structured", "usd")).toBe("$1.19");
    expect(v("m3.spend.campaign", "usd")).toBe("$2.30");
    expect(m3.spend.trace_usd + m3.spend.rerun_usd).toBeCloseTo(
      m3.spend.ledger_total_usd,
      4,
    );
  });
});
