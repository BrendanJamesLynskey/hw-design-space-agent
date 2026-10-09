"use client";

/**
 * The Pareto replay: one recorded run, round by round, in the spec's objective space. Each
 * round's evaluations appear (filled if they met the spec, coloured by family), the front found
 * so far is redrawn (the Python reference's Pareto mask, exported per round), the true front
 * from the exhaustive grid stays behind it as a dashed line, and the LLM's decision on the round
 * is quoted from the trace. The last frame rings the design the run selected and the true
 * optimum.
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Stat } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { replayCaption } from "@/lib/dse/captions";
import { site, type Design } from "@/lib/dse/data";
import { extent, pointsOf, replayFrames, staircase } from "@/lib/dse/replay";
import { FAMILIES } from "@/lib/dse/runs";
import { fmtInt, pct, trim } from "@/lib/format";
import { FAMILY_COLOUR, OKABE_ITO } from "@/lib/viz/palette";

import { useRun } from "./useRun";

const W = 640;
const WIDE = { h: 320, m: { l: 58, r: 14, t: 14, b: 46 } };
/** Phones: a taller picture and wider margins for the (enlarged) labels. */
const NARROW = { h: 560, m: { l: 92, r: 14, t: 14, b: 70 } };

const AXIS: Record<string, string> = {
  luts: "LUTs",
  luts_plus_ffs: "LUTs + FFs",
  accuracy_bits: "accuracy bits",
  power_index: "power index",
};

export default function ParetoReplay(): JSX.Element {
  const { run, controls } = useRun({
    ms: "m2",
    spec: "dds_250msps",
    model: "deepseek/deepseek-v4.1-flash",
    seed: 0,
  });
  const frames = useMemo(() => (run ? replayFrames(run) : []), [run]);
  const stepper = useStepper(Math.max(1, frames.length), {
    stepMs: 2200,
    resetKey: run?.id ?? "loading",
  });
  const font = useSvgFont(W);
  const { h: H, m: M } = font.narrow ? NARROW : WIDE;
  const f = frames[stepper.step];
  const gt = run ? site.ground_truth[run.spec]! : null;
  const caption =
    run && f && gt ? replayCaption(f, run, gt) : "Loading the run…";

  let plot: JSX.Element | null = null;
  if (run && f && gt) {
    const [ax, ay] = run.axes;
    const ex = extent(run, gt);
    const sx = (v: number) =>
      M.l + ((v - ex.x[0]) / (ex.x[1] - ex.x[0])) * (W - M.l - M.r);
    const sy = (v: number) =>
      M.t + (1 - (v - ex.y[0]) / (ex.y[1] - ex.y[0])) * (H - M.t - M.b);
    const val = (d: Design, k: string) => d[k as keyof Design] as number;
    const truth = staircase(
      gt.front.map((d) => val(d, ax)),
      gt.front.map((d) => val(d, ay)),
    );
    const found = staircase(
      f.front.map((i) => run.points.x[i]!),
      f.front.map((i) => run.points.y[i]!),
    );
    const path = (pts: { x: number; y: number }[]) =>
      pts
        .map(
          (p, i) =>
            `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`,
        )
        .join(" ");
    const ticks = (a: number, b: number) =>
      [0.05, 0.3, 0.55, 0.8].map((t) => a + (b - a) * t);
    const sel = f.phase === "result" ? run.selected : null;
    const best = f.phase === "result" ? gt.selected : null;
    plot = (
      <svg
        ref={font.ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`${f.shown} evaluations of ${run.spec}: ${AXIS[ax]} against ${AXIS[ay]}; ${f.front.length} on the front found, ${gt.front.length} on the true front`}
      >
        <defs>
          <clipPath id="replay-clip">
            <rect
              x={M.l}
              y={M.t}
              width={W - M.l - M.r}
              height={H - M.t - M.b}
            />
          </clipPath>
        </defs>
        {ticks(ex.x[0], ex.x[1]).map((v, i) => (
          <text
            key={`x${i}`}
            x={sx(v)}
            y={H - M.b + 16}
            textAnchor="middle"
            fontSize={font.fs(11)}
            fill="currentColor"
          >
            {trim(v, 3)}
          </text>
        ))}
        {ticks(ex.y[0], ex.y[1]).map((v, i) => (
          <g key={`y${i}`}>
            <line
              x1={M.l}
              x2={W - M.r}
              y1={sy(v)}
              y2={sy(v)}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
            <text
              x={M.l - 6}
              y={sy(v) + 4}
              textAnchor="end"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              {trim(v, 3)}
            </text>
          </g>
        ))}
        <text
          x={(M.l + W - M.r) / 2}
          y={H - 6}
          textAnchor="middle"
          fontSize={font.fs(11)}
          fill="currentColor"
        >
          {AXIS[ax]} (estimate)
        </text>
        <text
          x={13}
          y={(M.t + H - M.b) / 2}
          textAnchor="middle"
          fontSize={font.fs(11)}
          fill="currentColor"
          transform={`rotate(-90 13 ${(M.t + H - M.b) / 2})`}
        >
          {AXIS[ay]} ({ay === "accuracy_bits" ? "exact" : "estimate"})
        </text>
        <g clipPath="url(#replay-clip)">
          {truth.length > 0 && (
            <path
              d={path(truth)}
              data-mark="true-front"
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.55}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          )}
          {pointsOf(run, f).map(({ i, current }) => {
            const ok = run.points.feasible[i] === "1";
            const fam = FAMILIES[run.points.family[i]!]!;
            return (
              <circle
                key={i}
                data-eval={i}
                data-current={current ? "true" : "false"}
                cx={sx(run.points.x[i]!)}
                cy={sy(run.points.y[i]!)}
                r={current ? 4 : 2.6}
                fill={ok ? FAMILY_COLOUR[fam] : "none"}
                fillOpacity={current ? 0.95 : 0.45}
                stroke={ok ? FAMILY_COLOUR[fam] : "#8c8c8c"}
                strokeOpacity={current ? 1 : 0.6}
                strokeWidth={1}
              />
            );
          })}
          {found.length > 0 && (
            <path
              d={path(found)}
              data-mark="found-front"
              fill="none"
              stroke={OKABE_ITO.orange}
              strokeWidth={2.5}
            />
          )}
          {best && (
            <circle
              data-mark="true-optimum"
              cx={sx(val(best, ax))}
              cy={sy(val(best, ay))}
              r={11}
              fill="none"
              stroke={OKABE_ITO.green}
              strokeWidth={2.5}
              strokeDasharray="3 2"
            />
          )}
          {sel && (
            <circle
              data-mark="selected"
              cx={sx(val(sel, ax))}
              cy={sy(val(sel, ay))}
              r={8}
              fill="none"
              stroke={OKABE_ITO.vermillion}
              strokeWidth={3}
            />
          )}
        </g>
      </svg>
    );
  }
  const r = run && f && f.round > 0 ? run.rounds[f.round - 1]! : null;
  const decision =
    run && r
      ? run.calls
          .filter((c) => c.node === "analyse" && c.round === r.round && c.ok)
          .pop()
      : null;

  return (
    <AnimationPanel
      title="Pareto replay: a recorded run, round by round"
      summary={
        <>
          {run
            ? `${run.label} on ${run.spec}, seed ${run.seed}: ${run.n_evals} evaluations in ${run.rounds.length} rounds.`
            : "Loading…"}{" "}
          Dashed: the true front (exhaustive grid). Orange: the front this run
          had found.
        </>
      }
      stepper={stepper}
      stepLabel="round"
      countFrom={0}
      caption={caption}
      testId="replay-widget"
      visual={
        <div className="min-w-0">
          {plot}
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            {FAMILIES.map((fam) => (
              <span key={fam}>
                <span style={{ color: FAMILY_COLOUR[fam] }}>●</span>{" "}
                <span className="font-mono">{fam}</span>
              </span>
            ))}
            <span>○ did not meet the spec</span>
            <span>
              <span style={{ color: OKABE_ITO.vermillion }}>◯</span> selected ·{" "}
              <span style={{ color: OKABE_ITO.green }}>◯</span> true optimum
              (dashed)
            </span>
          </p>
          {decision && (
            <blockquote
              data-testid="replay-rationale"
              tabIndex={0}
              className="mt-2 max-h-36 overflow-y-auto rounded border-l-4 border-amber-500 bg-white px-3 py-1 text-xs text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
            >
              <span className="font-mono text-[0.65rem] uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                LLM, after round {r!.round}: {decision.decision}
              </span>
              <br />
              {decision.rationale}
            </blockquote>
          )}
        </div>
      }
      stats={
        f &&
        gt && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Evaluated" value={`${f.shown} / ${run!.budget}`} />
            <Stat label="Met the spec" value={fmtInt(f.feasible)} />
            <Stat
              label="Front found / true"
              value={`${f.front.length} / ${gt.front.length}`}
            />
            <Stat
              label="HV of true front"
              value={f.hvFrac === null ? "n/a (infeasible)" : pct(f.hvFrac, 1)}
            />
          </div>
        )
      }
      params={controls}
    />
  );
}
