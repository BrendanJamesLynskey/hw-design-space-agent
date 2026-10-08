/**
 * The home page's hero, "One spec, every level", as a sequence of states computed from one
 * real recorded run (the hero run in src/data/site.json: its evaluations, its LLM calls and
 * their provider-reported usage). Levels that are not built yet are never visited: the spec
 * card stops at the last live level, and the final frame only shows the planned levels,
 * ghosted, with their milestone.
 */
import type { Hero, Level } from "./data";

export type HeroPhase =
  | "spec"
  | "space"
  | "propose"
  | "round"
  | "analyse"
  | "select"
  | "check"
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
  /** The families the LLM has asked for so far. */
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

export function heroFrames(hero: Hero, ladder: Level[]): HeroFrame[] {
  const live = ladder.filter((l) => l.status === "live");
  const last = live[live.length - 1]!.id;
  const first = live[0]!.id;
  const frames: HeroFrame[] = [];
  let f: HeroFrame = {
    phase: "spec",
    level: first,
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
  push({ phase: "space", level: last, checked: [first] });
  push({ phase: "propose", ...takeCall(0) });
  hero.rounds.forEach((r, k) => {
    const seen = Object.keys(r.families);
    push({
      phase: "round",
      round: r.round,
      evaluated: r.cumulative_evals,
      feasible: r.cumulative_feasible,
      front: r.front_size,
      families: [...new Set([...f.families, ...seen])],
    });
    if (hero.decisions[k + 1]) push({ phase: "analyse", ...takeCall(k + 1) });
  });
  push({ phase: "select", selected: true });
  push({ phase: "check", checked: live.map((l) => l.id) });
  push({ phase: "planned", showPlanned: true });
  return frames;
}

/** Which round an evaluation (0-based) belongs to, from the per-round counts. */
export function roundOf(hero: Hero, index: number): number {
  for (const r of hero.rounds) if (index < r.cumulative_evals) return r.round;
  return hero.rounds.length;
}
