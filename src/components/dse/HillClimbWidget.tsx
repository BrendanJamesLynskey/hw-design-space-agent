"use client";

/**
 * "Micro-optimise the default design" against "explore first", on the real grid. The trail is
 * a hill-climb from the reference iterative CORDIC by single-knob moves (W, N, guard bits,
 * rounding), each scored by the repo's own evaluate(); the ceiling is the best of all 39,690
 * iterative designs at the spec's accuracy; the explored points are the exhaustive ground
 * truth's Pareto front across all four families. Throughput is on a log scale.
 */
import { useMemo, useState, type ReactNode } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Stat } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { climbCaption } from "@/lib/dse/captions";
import { climbFrames, climbGap } from "@/lib/dse/climb";
import type { GroundTruth, HillClimb } from "@/lib/dse/data";
import { fmtInt, trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

const W = 640;
const M = { l: 56, r: 16, t: 16, b: 44 };
const X_MAX = 2200;
const Y_MIN = 5;
const Y_MAX = 400;

const sx = (luts: number) => M.l + (luts / X_MAX) * (W - M.l - M.r);

export default function HillClimbWidget({
  climb,
  gt,
  children,
}: {
  climb: HillClimb;
  gt: GroundTruth;
  children?: ReactNode;
}): JSX.Element {
  const frames = useMemo(() => climbFrames(climb), [climb]);
  const stepper = useStepper(frames.length, { stepMs: 1300 });
  const f = frames[stepper.step]!;
  const font = useSvgFont(W);
  // taller on a phone, so the log axis keeps its labels apart
  const H = font.narrow ? 520 : 300;
  const sy = (msps: number) =>
    M.t +
    (1 - Math.log(msps / Y_MIN) / Math.log(Y_MAX / Y_MIN)) * (H - M.t - M.b);
  const gap = climbGap(climb, gt);
  const [hover, setHover] = useState<string | null>(null);
  const trail = climb.path.slice(0, f.pathShown);
  const cur = trail[trail.length - 1]!;
  const sel = gt.selected!;
  const hl = hover ?? f.hl;

  return (
    <AnimationPanel
      title="Micro-optimise the default, or explore first"
      summary={
        <>
          Spec dds_250msps (≥ {trim(climb.throughput_min)} MSPS, max error ≤
          2^-13). LUTs and throughput are cost-model estimates; accuracy is
          exact. Every point is a real evaluation.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={climbCaption(f, climb, gt)}
      testId="climb-widget"
      equation={children}
      hl={hl}
      onEquationHover={setHover}
      visual={
        <svg
          ref={font.ref}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Throughput against LUTs: the hill-climb trail, the iterative ceiling and the explored front"
        >
          {[5, 10, 25, 50, 100, 250].map((v) => (
            <g key={v}>
              <line
                x1={M.l}
                x2={W - M.r}
                y1={sy(v)}
                y2={sy(v)}
                stroke="currentColor"
                strokeOpacity={v === 250 ? 0.6 : 0.12}
                strokeDasharray={v === 250 ? "6 4" : undefined}
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
          <text
            x={W - M.r}
            y={sy(250) - 6}
            textAnchor="end"
            fontSize={font.fs(11)}
            fill="currentColor"
          >
            spec: ≥ 250 MSPS
          </text>
          {[0, 500, 1000, 1500, 2000].map((v) => (
            <text
              key={v}
              x={sx(v)}
              y={H - M.b + 16}
              textAnchor="middle"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              {v}
            </text>
          ))}
          <text
            x={(M.l + W - M.r) / 2}
            y={H - 6}
            textAnchor="middle"
            fontSize={font.fs(11)}
            fill="currentColor"
          >
            LUTs (estimate)
          </text>
          <text
            x={14}
            y={(M.t + H - M.b) / 2}
            textAnchor="middle"
            fontSize={font.fs(11)}
            fill="currentColor"
            transform={`rotate(-90 14 ${(M.t + H - M.b) / 2})`}
          >
            MSPS (log)
          </text>
          {f.showCeiling && (
            <line
              data-mark="ceiling"
              x1={M.l}
              x2={W - M.r}
              y1={sy(gap.ceiling.throughput_msps)}
              y2={sy(gap.ceiling.throughput_msps)}
              stroke={OKABE_ITO.vermillion}
              strokeWidth={2}
              strokeDasharray="2 3"
            />
          )}
          {f.showCeiling && !font.narrow && (
            <text
              x={W - M.r}
              y={sy(gap.ceiling.throughput_msps) - 6}
              textAnchor="end"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              iterative ceiling {trim(gap.ceiling.throughput_msps)} MSPS
            </text>
          )}
          <polyline
            data-mark="trail"
            points={trail
              .map((s) => `${sx(s.luts)},${sy(s.throughput_msps)}`)
              .join(" ")}
            fill="none"
            stroke={OKABE_ITO.orange}
            strokeWidth={2}
          />
          {trail.map((s, i) => (
            <circle
              key={i}
              data-mark="climb"
              cx={sx(s.luts)}
              cy={sy(s.throughput_msps)}
              r={i === trail.length - 1 ? 6 : 3.5}
              fill={s.meets_accuracy ? OKABE_ITO.orange : "none"}
              stroke={OKABE_ITO.orange}
              strokeWidth={2}
            />
          ))}
          {f.showFront &&
            gt.front.map((d) => (
              <circle
                key={d.key}
                data-mark="front"
                cx={sx(d.luts)}
                cy={sy(d.throughput_msps)}
                r={3}
                fill={OKABE_ITO.blue}
                opacity={0.75}
              />
            ))}
          {f.showSelected && (
            <circle
              data-mark="selected"
              cx={sx(sel.luts)}
              cy={sy(sel.throughput_msps)}
              r={8}
              fill="none"
              stroke={OKABE_ITO.green}
              strokeWidth={3}
            />
          )}
        </svg>
      }
      stats={
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            label="Hill-climbed design"
            value={`${trim(cur.throughput_msps)} MSPS`}
            hint={`${fmtInt(cur.luts)} LUTs, ${trim(cur.accuracy_bits, 4)} bits`}
          />
          <Stat
            label="Iterative ceiling"
            value={
              f.showCeiling ? `${trim(gap.ceiling.throughput_msps)} MSPS` : "—"
            }
            hint="best of 39,690 at ≥ 13 bits"
          />
          <Stat
            label="Explored choice"
            value={f.showSelected ? `${trim(sel.throughput_msps)} MSPS` : "—"}
            hint={
              f.showSelected
                ? `${fmtInt(sel.luts)} LUTs, ${sel.family}`
                : "explore first"
            }
          />
          <Stat
            label="Gap"
            value={f.showSelected ? `${trim(gap.throughputRatio, 3)}×` : "—"}
            hint="throughput, at equal accuracy"
          />
        </div>
      }
    />
  );
}
