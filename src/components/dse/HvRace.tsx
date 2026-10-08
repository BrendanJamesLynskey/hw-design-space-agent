"use client";

/**
 * The hypervolume race: the fraction of the true front's hypervolume each method has covered
 * after e evaluations, for one feasible spec. NSGA-II and random search are the repository's
 * baselines re-run at the vendored commit (each reproduces its recorded result exactly); the
 * agents are their recorded runs. Each line is the mean of three seeds; an agent's line goes flat
 * once its runs have stopped (they spent no more of the budget). The true front is 1.0.
 */
import { useMemo, useState } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Segmented } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { raceCaption } from "@/lib/dse/captions";
import {
  methodAt,
  race,
  raceSteps,
  stoppedBy,
  type RaceMethod,
} from "@/lib/dse/race";
import { OKABE_ITO } from "@/lib/viz/palette";

const W = 640;
const WIDE = { h: 300, m: { l: 44, r: 14, t: 12, b: 40 } };
/** Phones: a taller picture and wider margins for the (enlarged) labels. */
const NARROW = { h: 520, m: { l: 84, r: 14, t: 34, b: 70 } };

const STYLE: Record<string, { colour: string; dash?: string }> = {
  nsga2: { colour: "#404040", dash: "7 4" },
  random: { colour: "#8c8c8c", dash: "2 3" },
  "anthropic/claude-sonnet-5.5": { colour: OKABE_ITO.orange },
  "deepseek/deepseek-v4.1-flash": { colour: OKABE_ITO.blue },
  "qwen/qwen3.8-27b": { colour: OKABE_ITO.green },
  "qwen/qwen3.8-27b, reasoning off": {
    colour: OKABE_ITO.purple,
    dash: "10 3 2 3",
  },
};

const SPECS = ["dds_250msps", "low_area_control", "high_precision"] as const;

export default function HvRace(): JSX.Element {
  const [specName, setSpec] = useState<string>(SPECS[0]);
  const spec = race.specs[specName]!;
  const steps = useMemo(() => raceSteps(spec), [spec]);
  const stepper = useStepper(steps.length, { stepMs: 260, resetKey: specName });
  const e = steps[stepper.step]!;
  const font = useSvgFont(W);
  const { h: H, m: M } = font.narrow ? NARROW : WIDE;
  const sx = (v: number) => M.l + (v / spec.budget) * (W - M.l - M.r);
  const sy = (v: number) => M.t + (1 - v) * (H - M.t - M.b);
  const line = (m: RaceMethod) =>
    steps
      .filter((x) => x <= e)
      .map(
        (x, i) =>
          `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(methodAt(m, x)).toFixed(1)}`,
      )
      .join(" ");

  return (
    <AnimationPanel
      title="The hypervolume race"
      summary={
        <>
          Fraction of the true front&apos;s hypervolume covered after each
          evaluation, mean of 3 seeds, {spec.budget} evaluations per run.
          Baselines are re-run with the repository&apos;s code at the vendored
          commit and reproduce the recorded results exactly; agents are their
          recorded runs.
        </>
      }
      stepper={stepper}
      stepLabel="evaluations"
      countFrom={0}
      caption={raceCaption(e, spec, specName)}
      testId="race-widget"
      visual={
        <div className="min-w-0">
          <svg
            ref={font.ref}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={`Hypervolume fraction against evaluations for ${specName}, after ${e} evaluations`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line
                  x1={M.l}
                  x2={W - M.r}
                  y1={sy(v)}
                  y2={sy(v)}
                  stroke="currentColor"
                  strokeOpacity={v === 1 ? 0.6 : 0.12}
                  strokeDasharray={v === 1 ? "4 3" : undefined}
                />
                <text
                  x={M.l - 6}
                  y={sy(v) + 4}
                  textAnchor="end"
                  fontSize={font.fs(11)}
                  fill="currentColor"
                >
                  {v}
                </text>
              </g>
            ))}
            {[0, 100, 200, 300, 400]
              .filter((x) => x <= spec.budget)
              .map((x) => (
                <text
                  key={x}
                  x={sx(x)}
                  y={H - M.b + 16}
                  textAnchor={x === spec.budget ? "end" : "middle"}
                  fontSize={font.fs(11)}
                  fill="currentColor"
                >
                  {x}
                </text>
              ))}
            <text
              x={(M.l + W - M.r) / 2}
              y={H - 4}
              textAnchor="middle"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              evaluations
            </text>
            <text
              x={W - M.r}
              y={sy(1) - 4}
              textAnchor="end"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              true front
            </text>
            {spec.methods.map((m) => {
              const st = STYLE[m.method]!;
              const stop = stoppedBy(m);
              return (
                <g key={m.method} data-method={m.method}>
                  <path
                    d={line(m)}
                    fill="none"
                    stroke={st.colour}
                    strokeWidth={m.agent ? 2.5 : 2}
                    strokeDasharray={st.dash}
                  />
                  {m.agent && stop <= e && stop < spec.budget && (
                    <circle
                      data-stop={stop}
                      cx={sx(stop)}
                      cy={sy(methodAt(m, stop))}
                      r={4}
                      fill={st.colour}
                    />
                  )}
                </g>
              );
            })}
            <line
              x1={sx(e)}
              x2={sx(e)}
              y1={M.t}
              y2={H - M.b}
              stroke="currentColor"
              strokeOpacity={0.3}
            />
          </svg>
          <ul className="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
            {spec.methods.map((m) => {
              const st = STYLE[m.method]!;
              return (
                <li key={m.method} className="flex items-center gap-2">
                  <svg width="28" height="10" aria-hidden="true">
                    <line
                      x1="0"
                      x2="28"
                      y1="5"
                      y2="5"
                      stroke={st.colour}
                      strokeWidth={m.agent ? 2.5 : 2}
                      strokeDasharray={st.dash}
                    />
                  </svg>
                  <span>
                    {m.label}
                    {m.agent ? "" : " (baseline)"}:{" "}
                    <span className="font-mono">
                      {methodAt(m, e).toFixed(3)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-1 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            ● where every seed of an agent had stopped (the 1% hypervolume-gain
            rule or the LLM&apos;s own stop).
          </p>
        </div>
      }
      params={
        <Segmented
          label="Spec"
          value={specName}
          options={SPECS.map((s) => ({ value: s, label: s }))}
          onChange={setSpec}
        />
      }
    />
  );
}
