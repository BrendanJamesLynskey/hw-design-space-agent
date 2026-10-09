"use client";

/**
 * M1 → M2, relative to NSGA-II: for each feasible spec and each M2 model, where the agent was
 * in M1 (3 seeds) and where it is in M2 (5 seeds), spec by spec. Two views: hypervolume as a
 * fraction of NSGA-II's (1 = parity; the front-mapping gap M2 set out to close), and mean
 * selection regret minus NSGA-II's (below 0 = the agent picked closer to the true optimum).
 * Every value is results.md's "at a glance" table, checked at export.
 */
import { useMemo, useState } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Segmented } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { shiftCaption } from "@/lib/dse/captions";
import type { Glance } from "@/lib/dse/data";
import { shiftFrames, shiftValue, type ShiftMetric } from "@/lib/dse/m2frames";
import { signedPct } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

const W = 600;
const COLOUR: Record<string, string> = {
  "anthropic/claude-sonnet-5.5": OKABE_ITO.orange,
  "deepseek/deepseek-v4.1-flash": OKABE_ITO.blue,
  "qwen/qwen3.8-27b, reasoning off": OKABE_ITO.purple,
};
const SPECS = ["dds_250msps", "low_area_control", "high_precision"];

export default function M1M2Shift({
  glance,
  labels,
}: {
  glance: Glance;
  labels: Record<string, string>;
}): JSX.Element {
  const [metric, setMetric] = useState<ShiftMetric>("hv");
  const frames = useMemo(() => shiftFrames(SPECS), []);
  const stepper = useStepper(frames.length, { stepMs: 2400, resetKey: metric });
  const f = frames[stepper.step]!;
  const font = useSvgFont(W);
  const narrow = font.narrow;
  const M = { l: narrow ? 150 : 130, r: 20, t: 16, b: 40 };
  const rowH = narrow ? 30 : 20;
  const H = M.t + M.b + SPECS.length * (glance.models.length * rowH + 14);
  const [lo, hi, ref] = metric === "hv" ? [0, 1.2, 1] : [-0.15, 0.15, 0];
  const sx = (v: number) =>
    M.l + ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (W - M.l - M.r);
  const ticks =
    metric === "hv"
      ? [0, 0.25, 0.5, 0.75, 1]
      : [-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15];

  return (
    <AnimationPanel
      title="M1 → M2, against NSGA-II"
      summary={
        <>
          Each agent&apos;s mean on each spec, M1 (3 seeds, hollow) moving to M2
          (5 seeds, filled), relative to NSGA-II on the same milestone&apos;s
          seeds. From results.md&apos;s M1-against-M2 tables.
        </>
      }
      stepper={stepper}
      stepLabel="spec"
      countFrom={0}
      caption={shiftCaption(f, glance, metric, labels)}
      testId="shift-widget"
      visual={
        <div className="min-w-0">
          <svg
            ref={font.ref}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={`${metric === "hv" ? "Hypervolume relative to NSGA-II" : "Selection regret minus NSGA-II's"}, M1 and M2, ${f.moved.length} specs moved`}
          >
            {ticks.map((v) => (
              <g key={v}>
                <line
                  x1={sx(v)}
                  x2={sx(v)}
                  y1={M.t}
                  y2={H - M.b}
                  stroke="currentColor"
                  strokeOpacity={v === ref ? 0.6 : 0.1}
                  strokeDasharray={v === ref ? "4 3" : undefined}
                />
                <text
                  x={sx(v)}
                  y={H - M.b + 14}
                  textAnchor="middle"
                  fontSize={font.fs(10)}
                  fill="currentColor"
                >
                  {metric === "hv" ? v : signedPct(v, 0)}
                </text>
              </g>
            ))}
            <text
              x={(M.l + W - M.r) / 2}
              y={H - 4}
              textAnchor="middle"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              {metric === "hv"
                ? "agent HV ÷ NSGA-II HV (right is better; 1 = parity)"
                : "agent regret − NSGA-II regret (left is better)"}
            </text>
            {SPECS.map((s, i) => {
              const y0 = M.t + i * (glance.models.length * rowH + 14);
              const moved = f.moved.includes(s);
              return (
                <g key={s} data-spec={s} data-moved={moved ? "true" : "false"}>
                  <text
                    x={4}
                    y={y0 + (glance.models.length * rowH) / 2 + 4}
                    fontSize={font.fs(11)}
                    fill="currentColor"
                    fontFamily="monospace"
                  >
                    {narrow
                      ? s.replace("_control", "").replace("_250msps", "")
                      : s}
                  </text>
                  {glance.models.map((m, j) => {
                    const [a, b] = shiftValue(glance, s, m, metric);
                    const y = y0 + j * rowH + rowH / 2;
                    const c = COLOUR[m]!;
                    return (
                      <g key={m} data-model={m}>
                        {moved && (
                          <line
                            x1={sx(a)}
                            x2={sx(b)}
                            y1={y}
                            y2={y}
                            stroke={c}
                            strokeWidth={2}
                          />
                        )}
                        <circle
                          cx={sx(a)}
                          cy={y}
                          r={5}
                          fill="none"
                          stroke={c}
                          strokeWidth={2}
                        />
                        {moved && <circle cx={sx(b)} cy={y} r={5.5} fill={c} />}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {glance.models.map((m) => (
              <li key={m} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block size-3 rounded-full"
                  style={{ background: COLOUR[m] }}
                />
                {labels[m]}
              </li>
            ))}
          </ul>
        </div>
      }
      params={
        <Segmented
          label="Measure"
          value={metric}
          options={[
            { value: "hv", label: "Front coverage (HV)" },
            { value: "regret", label: "Selection regret" },
          ]}
          onChange={(m) => setMetric(m as ShiftMetric)}
        />
      }
    />
  );
}
