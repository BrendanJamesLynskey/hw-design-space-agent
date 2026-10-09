/**
 * The home page's hero, "One spec, every level", as a sequence of states computed from one
 * real recorded M2 run (the hero run in src/data/site.json: its evaluations, its LLM calls and
 * their provider-reported usage, and its own back-annotation node) and from the repository's
 * worked example, which takes the design that run selected through RTL simulation, synthesis
 * and gate-level simulation (src/data/ladder.json).
 *
 * Levels that are not built yet are never visited: the spec card goes from L1 straight to L3,
 * and the final frame only shows the planned levels, ghosted, with their milestone.
 */
import type { Hero, Level } from "./data";

export type HeroPhase =
  | "spec"
  | "space"
  | "propose"
  | "round"
  | "analyse"
  | "select"
  | "rtl"
  | "synth"
  | "gate"
  | "annotate"
  | "planned";

export type HeroFrame = {
  phase: HeroPhase;
  /** The ladder level the spec card is on (always a live level). */
  level: string;
  /** Rounds of evaluation done. */
  round: number;
  /** Evaluations done so far (cells lit in the grid). */
  evaluated: number;
  feasible: number;
  front: number;
  /** The families explored so far. */
  families: string[];
  /** The LLM call shown on this frame (index into hero.decisions), if any. */
  call: number | null;
  /** Cumulative LLM usage up to and including this frame. */
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  selected: boolean;
  /** Live levels whose check has been shown. */
  checked: string[];
  showPlanned: boolean;
};

/** The levels the selected design goes down after L1, in order, and the phase of each. */
export const DESCENT: { level: string; phase: HeroPhase }[] = [
  { level: "L3", phase: "rtl" },
  { level: "L4", phase: "synth" },
  { level: "GL", phase: "gate" },
  { level: "L5", phase: "annotate" },
];

export function heroFrames(hero: Hero, ladder: Level[]): HeroFrame[] {
  const live = new Set(
    ladder.filter((l) => l.status === "live").map((l) => l.id),
  );
  const frames: HeroFrame[] = [];
  let f: HeroFrame = {
    phase: "spec",
    level: "L0",
    round: 0,
    evaluated: 0,
    feasible: 0,
    front: 0,
    families: [],
    call: null,
    calls: 0,
    inputTokens: 0,
    outputTokens: 0,
    costUsd: 0,
    selected: false,
    checked: [],
    showPlanned: false,
  };
  const push = (patch: Partial<HeroFrame>) => {
    f = { ...f, call: null, ...patch };
    frames.push(f);
  };
  const takeCall = (i: number): Partial<HeroFrame> => {
    const d = hero.decisions[i]!;
    const fams =
      d.families !== null
        ? [...new Set([...f.families, ...d.families])]
        : f.families;
    return {
      call: i,
      calls: f.calls + 1,
      inputTokens: f.inputTokens + d.input_tokens,
      outputTokens: f.outputTokens + d.output_tokens,
      costUsd: f.costUsd + d.cost_usd,
      families: fams,
    };
  };
  push({});
  push({ phase: "space", level: "L1", checked: ["L0"] });
  push({ phase: "propose", ...takeCall(0) });
  for (const r of hero.rounds) {
    push({
      phase: "round",
      round: r.round,
      evaluated: r.cumulative_evals,
      feasible: r.cumulative_feasible,
      front: r.front_size,
      families: [...new Set([...f.families, ...Object.keys(r.families)])],
    });
    const i = hero.decisions.findIndex(
      (d) => d.node === "analyse" && d.round === r.round,
    );
    if (i >= 0) push({ phase: "analyse", ...takeCall(i) });
  }
  push({ phase: "select", selected: true, checked: ["L0", "L1"] });
  for (const d of DESCENT) {
    if (!live.has(d.level)) break; // never animate a level that is not built
    push({ phase: d.phase, level: d.level, checked: [...f.checked, d.level] });
  }
  push({ phase: "planned", showPlanned: true });
  return frames;
}

/** Which round an evaluation (0-based) belongs to, from the per-round counts. */
export function roundOf(hero: Hero, index: number): number {
  for (const r of hero.rounds) if (index < r.cumulative_evals) return r.round;
  return hero.rounds.length;
}
