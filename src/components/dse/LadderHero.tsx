"use client";

/**
 * "One spec, every level": the home page's hero. A spec card enters the fidelity ladder and
 * stops at the last live level; at L1 the candidates fan out across the families and are
 * evaluated round by round (one cell per real evaluation of the recorded run, filled when the
 * design met the spec), the LLM's decisions and its token and dollar counters tick from the
 * recorded trace, and the selected design is marked. The levels that are not built yet are
 * never animated: they stay ghosted with their milestone badge.
 *
 * Every state comes from heroFrames() over src/data/site.json (the recorded run).
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Stat } from "@/components/ui/Controls";
import { heroCaption } from "@/lib/dse/captions";
import type { Hero, Level, SpecInfo } from "@/lib/dse/data";
import { heroFrames, roundOf } from "@/lib/dse/hero";
import { fmtInt, fmtUsd } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { LevelBadge } from "./Badges";

const COLS = 20;
const CELL = 14;

const FAMILY_ORDER = ["iterative", "unrolled_k", "pipelined", "pipelined_m"];

export default function LadderHero({
  hero,
  ladder,
  spec,
}: {
  hero: Hero;
  ladder: Level[];
  spec: SpecInfo;
}): JSX.Element {
  const frames = useMemo(() => heroFrames(hero, ladder), [hero, ladder]);
  const stepper = useStepper(frames.length, { stepMs: 1500 });
  const f = frames[stepper.step]!;
  const caption = heroCaption(f, hero, spec, ladder);
  const total = hero.rounds[hero.rounds.length - 1]!.cumulative_evals;
  const rows = Math.ceil(total / COLS);
  const call = f.call !== null ? hero.decisions[f.call] : null;

  return (
    <AnimationPanel
      title="One spec, every level"
      summary={
        <>
          A real recorded run: {hero.model} on the {hero.spec} spec (seed{" "}
          {hero.seed}). Each cell is one evaluated design; filled cells met the
          spec. Planned levels stay ghosted.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={caption}
      testId="hero-widget"
      visual={
        <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,15rem)_1fr]">
          <ol aria-label="The fidelity ladder" className="min-w-0 space-y-1">
            {ladder.map((l) => {
              const here = f.level === l.id;
              const live = l.status === "live";
              const checked = f.checked.includes(l.id);
              const ghost = !live;
              return (
                <li
                  key={l.id}
                  data-level={l.id}
                  data-status={l.status}
                  data-here={here ? "true" : "false"}
                  className={`flex min-w-0 items-center justify-between gap-2 rounded border px-2 py-1 text-xs ${
                    here
                      ? "border-accent bg-indigo-50 ring-2 ring-accent dark:border-indigo-300 dark:bg-indigo-950/40 dark:ring-indigo-300"
                      : ghost
                        ? `border-dashed text-neutral-600 dark:text-neutral-400 ${f.showPlanned ? "border-neutral-500 bg-neutral-100 dark:border-neutral-400 dark:bg-neutral-800/60" : "border-neutral-300 dark:border-neutral-700"}`
                        : "border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="font-mono">{l.id}</span>{" "}
                    <span className={ghost ? "" : "font-medium"}>{l.name}</span>
                    {checked && (
                      <span
                        className="ml-1 text-emerald-700 dark:text-emerald-300"
                        aria-label="checked"
                      >
                        ✓
                      </span>
                    )}
                  </span>
                  <LevelBadge status={l.status} milestone={l.milestone} />
                </li>
              );
            })}
          </ol>
          <div className="min-w-0">
            <div
              className="flex flex-wrap gap-1 text-[0.7rem]"
              aria-label="Architecture families"
            >
              {FAMILY_ORDER.map((fam) => {
                const on = f.families.includes(fam);
                return (
                  <span
                    key={fam}
                    data-family={fam}
                    data-on={on ? "true" : "false"}
                    className={`rounded border px-1.5 py-0.5 font-mono ${
                      on
                        ? "border-accent bg-accent text-accent-fg dark:border-indigo-300"
                        : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                    }`}
                  >
                    {on ? "✓ " : ""}
                    {fam}
                  </span>
                );
              })}
            </div>
            <svg
              viewBox={`0 0 ${COLS * CELL} ${rows * CELL}`}
              className="mt-2 w-full max-w-md"
              role="img"
              aria-label={`${f.evaluated} of ${total} evaluations done, ${f.feasible} met the spec`}
            >
              {Array.from({ length: total }, (_, i) => {
                const done = i < f.evaluated;
                const ok = hero.feasible_bits[i] === "1";
                const sel = f.selected && i === hero.selected_index;
                const x = (i % COLS) * CELL;
                const y = Math.floor(i / COLS) * CELL;
                return (
                  <rect
                    key={i}
                    data-cell={i}
                    data-round={roundOf(hero, i)}
                    x={x + 1.5}
                    y={y + 1.5}
                    width={CELL - 3}
                    height={CELL - 3}
                    rx={2}
                    fill={
                      sel
                        ? OKABE_ITO.vermillion
                        : done && ok
                          ? OKABE_ITO.green
                          : "transparent"
                    }
                    stroke={
                      sel
                        ? OKABE_ITO.vermillion
                        : done
                          ? ok
                            ? OKABE_ITO.green
                            : "#8c8c8c"
                          : "#d4d4d4"
                    }
                    strokeWidth={sel ? 3 : 1}
                    strokeDasharray={done ? undefined : "2 2"}
                  />
                );
              })}
            </svg>
            <p className="mt-1 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
              <span className="text-emerald-800 dark:text-emerald-300">■</span>{" "}
              met the spec · <span>□</span> did not ·{" "}
              <span className="text-orange-800 dark:text-orange-300">■</span>{" "}
              selected
            </p>
            {call && (
              <blockquote
                data-testid="llm-rationale"
                className="mt-2 max-h-28 overflow-y-auto rounded border-l-4 border-amber-500 bg-white px-3 py-1 text-xs text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
                tabIndex={0}
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  LLM, {call.node}: {call.decision}
                </span>
                <br />
                {call.rationale}
              </blockquote>
            )}
          </div>
        </div>
      }
      stats={
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Evaluated" value={`${f.evaluated} / ${total}`} />
          <Stat label="Met the spec" value={fmtInt(f.feasible)} />
          <Stat
            label="LLM tokens"
            value={fmtInt(f.inputTokens + f.outputTokens)}
            hint="measured"
          />
          <Stat
            label="LLM cost"
            value={fmtUsd(f.costUsd)}
            hint="measured, provider-reported"
          />
        </div>
      }
    />
  );
}
