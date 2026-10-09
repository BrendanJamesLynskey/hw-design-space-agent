"use client";

/**
 * "One spec, every level": the home page's hero. A spec card enters the fidelity ladder; at L1
 * the candidates fan out across the families and are evaluated round by round (one cell per
 * real evaluation of the recorded M2 run, filled when the design met the spec), the LLM's
 * decisions and its token and dollar counters tick from the recorded trace, and the selected
 * design is marked. The selected design then goes down the live levels: RTL simulation in two
 * simulators, synthesis, gate-level simulation of the netlist (the repository's worked example
 * of this design) and the run's own back-annotation node. The levels that are not built yet are
 * never animated: they stay ghosted with their milestone badge.
 *
 * Every state comes from heroFrames() over src/data/site.json (the recorded run) and the worked
 * example in src/data/ladder.json.
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Stat } from "@/components/ui/Controls";
import { heroCaption } from "@/lib/dse/captions";
import type { Hero, Level, SpecInfo } from "@/lib/dse/data";
import type { Worked } from "@/lib/dse/ladder";
import { heroFrames, roundOf } from "@/lib/dse/hero";
import { fmtInt, fmtUsd, signedPct, trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { LevelBadge, Prov } from "./Badges";

const COLS = 20;
const CELL = 14;

const FAMILY_ORDER = ["iterative", "unrolled_k", "pipelined", "pipelined_m"];

const DOWN = ["L3", "L4", "GL", "L5"];

/** The selected design's card on the way down: one row per level it has passed. */
function DesignCard({
  w,
  hero,
  passed,
}: {
  w: Worked;
  hero: Hero;
  passed: string[];
}): JSX.Element {
  const ba = hero.back_annotation;
  const rows: { level: string; text: JSX.Element }[] = [
    {
      level: "L1",
      text: (
        <>
          {trim(w.l1.luts, 4)} LUTs, {trim(w.l1.ffs, 3)} FFs,{" "}
          {trim(w.l1.fmax_mhz, 4)} MHz
          <Prov kind="estimate" />
        </>
      ),
    },
    {
      level: "L3",
      text: (
        <>
          {w.l3.map((r) => r.version.split(" ")[0]).join(" + ")}:{" "}
          {w.l3.reduce((a, r) => a + r.mismatches, 0)} mismatches on{" "}
          {fmtInt(w.l3[0]!.n_angles)} angles
          <Prov kind="exact" />
        </>
      ),
    },
    {
      level: "L4",
      text: (
        <>
          {fmtInt(w.l4.luts)} LUTs, {fmtInt(w.l4.ffs)} FFs,{" "}
          {trim(w.l4.fmax_mhz, 4)} MHz routed
          <Prov kind="measured" />
        </>
      ),
    },
    {
      level: "GL",
      text: (
        <>
          netlist: {w.gate.mismatches} mismatches on {fmtInt(w.gate.n_angles)}{" "}
          angles
          <Prov kind="exact" />
        </>
      ),
    },
    {
      level: "L5",
      text: (
        <>
          estimate off by {signedPct(-ba.luts![2] / (100 + ba.luts![2]))} LUTs,{" "}
          {signedPct(-ba.fmax_mhz![2] / (100 + ba.fmax_mhz![2]))} Fmax; winner
          unchanged
        </>
      ),
    },
  ];
  return (
    <ol
      data-testid="design-card"
      aria-label="The selected design, level by level"
      className="mt-2 space-y-1 rounded border border-neutral-300 bg-white p-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
    >
      <li className="font-mono text-[0.7rem] text-neutral-600 dark:text-neutral-400">
        {w.rtl.module}
      </li>
      {rows
        .filter((r) => r.level === "L1" || passed.includes(r.level))
        .map((r) => (
          <li key={r.level} data-card-level={r.level}>
            <span className="font-mono font-medium">{r.level}</span> {r.text}
          </li>
        ))}
    </ol>
  );
}

export default function LadderHero({
  hero,
  ladder,
  spec,
  worked,
}: {
  hero: Hero;
  ladder: Level[];
  spec: SpecInfo;
  worked: Worked;
}): JSX.Element {
  const frames = useMemo(() => heroFrames(hero, ladder), [hero, ladder]);
  const stepper = useStepper(frames.length, { stepMs: 1500 });
  const f = frames[stepper.step]!;
  const caption = heroCaption(f, hero, spec, ladder, worked);
  const passed = f.checked.filter((l) => DOWN.includes(l));
  const total = hero.rounds[hero.rounds.length - 1]!.cumulative_evals;
  const rows = Math.ceil(total / COLS);
  const call = f.call !== null ? hero.decisions[f.call] : null;

  return (
    <AnimationPanel
      title="One spec, every level"
      summary={
        <>
          A real recorded M2 run: {hero.label} ({hero.model}) on the {hero.spec}{" "}
          spec (seed {hero.seed}). Each cell is one evaluated design; filled
          cells met the spec. The design it selected then goes down the live
          levels (the repository&apos;s worked example of that design, and the
          run&apos;s own back-annotation). Planned levels stay ghosted.
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
            {f.selected && (
              <DesignCard w={worked} hero={hero} passed={passed} />
            )}
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
