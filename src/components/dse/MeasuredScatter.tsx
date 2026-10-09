"use client";

/**
 * Measured against estimated: every generated design the repository has synthesised, one dot
 * per tool and design, with the estimate across and the measurement up (log scales). The tools'
 * points arrive one by one (Yosys + nextpnr-xilinx, Vivado post-synthesis, Vivado post-route),
 * then the estimates move from the M1 cost model to the vivado-2025.2 refit's predictions. The
 * measured values, the M1 estimates and the refit's predictions are the repository's L5 report,
 * re-checked against the CSVs and the Python reference at export.
 */
import { useMemo, useState } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Segmented } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { scatterCaption } from "@/lib/dse/captions";
import type { ScatterPoint } from "@/lib/dse/ladder";
import {
  SCATTER_TOOLS,
  scatterExtent,
  scatterFrames,
  scatterPoints,
  xy,
  type Metric,
} from "@/lib/dse/m2frames";
import { trim } from "@/lib/format";
import { FAMILY_COLOUR } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 560;
const TOOL_SHAPE: Record<
  string,
  { label: string; shape: "circle" | "square" | "diamond" }
> = {
  "yosys+nextpnr-xilinx": {
    label: "Yosys + nextpnr (routed)",
    shape: "circle",
  },
  vivado: { label: "Vivado post-synthesis", shape: "square" },
  "vivado post-route": {
    label: "Vivado post-route (not fitted)",
    shape: "diamond",
  },
};
const METRIC_LABEL: Record<Metric, string> = {
  luts: "LUTs",
  ffs: "flip-flops",
  fmax: "Fmax (MHz)",
};

function Mark({
  shape,
  x,
  y,
  r,
  colour,
}: {
  shape: "circle" | "square" | "diamond";
  x: number;
  y: number;
  r: number;
  colour: string;
}): JSX.Element {
  if (shape === "circle")
    return <circle cx={x} cy={y} r={r} fill={colour} fillOpacity={0.75} />;
  if (shape === "square")
    return (
      <rect
        x={x - r}
        y={y - r}
        width={2 * r}
        height={2 * r}
        fill="none"
        stroke={colour}
        strokeWidth={2}
      />
    );
  return (
    <path
      d={`M${x},${y - r * 1.3} L${x + r * 1.3},${y} L${x},${y + r * 1.3} L${x - r * 1.3},${y} Z`}
      fill="none"
      stroke={colour}
      strokeWidth={1.5}
    />
  );
}

export default function MeasuredScatter({
  scatter,
  nFit,
}: {
  scatter: ScatterPoint[];
  /** Points the vivado-2025.2 refit was fitted on. */
  nFit: number;
}): JSX.Element {
  const [metric, setMetric] = useState<Metric>("fmax");
  const frames = useMemo(() => scatterFrames(), []);
  const stepper = useStepper(frames.length, { stepMs: 2400, resetKey: metric });
  const f = frames[stepper.step]!;
  const pts = useMemo(() => scatterPoints(scatter), [scatter]);
  const font = useSvgFont(W);
  const H = font.narrow ? 560 : 420;
  const M = {
    l: font.narrow ? 70 : 56,
    r: 14,
    t: 12,
    b: font.narrow ? 64 : 46,
  };
  const [lo, hi] = scatterExtent(pts, metric);
  const lx = (v: number) => Math.log10(v);
  const sx = (v: number) =>
    M.l + ((lx(v) - lx(lo)) / (lx(hi) - lx(lo))) * (W - M.l - M.r);
  const sy = (v: number) =>
    M.t + (1 - (lx(v) - lx(lo)) / (lx(hi) - lx(lo))) * (H - M.t - M.b);
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (const d of [1, 2, 5]) {
      for (let e = 0; e <= 4; e++) {
        const v = d * 10 ** e;
        if (v >= lo && v <= hi) out.push(v);
      }
    }
    return out.sort((a, b) => a - b);
  }, [lo, hi]);
  const shown = pts.filter((p) => f.tools.includes(p.tool));

  return (
    <AnimationPanel
      title="Measured against estimated"
      summary={
        <>
          Every generated design synthesised so far: {pts.length} measurements
          from two tools. Across: the estimate (<Prov kind="estimate" />, the M1
          cost model, then the vivado-2025.2 refit); up: the measurement (
          <Prov kind="measured" />, tool and version named). Log scales; the
          dashed lines are ±20%.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={scatterCaption(f, scatter, nFit, metric)}
      testId="scatter-widget"
      visual={
        <div className="min-w-0">
          <svg
            ref={font.ref}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={`${METRIC_LABEL[metric]}: ${shown.length} measured designs against their ${f.refit ? "refit" : "M1"} estimates`}
          >
            <defs>
              <clipPath id="scatter-clip">
                <rect
                  x={M.l}
                  y={M.t}
                  width={W - M.l - M.r}
                  height={H - M.t - M.b}
                />
              </clipPath>
            </defs>
            {ticks.map((v) => (
              <g key={v}>
                <line
                  x1={sx(v)}
                  x2={sx(v)}
                  y1={M.t}
                  y2={H - M.b}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <line
                  x1={M.l}
                  x2={W - M.r}
                  y1={sy(v)}
                  y2={sy(v)}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text
                  x={sx(v)}
                  y={H - M.b + 14}
                  textAnchor="middle"
                  fontSize={font.fs(10)}
                  fill="currentColor"
                >
                  {trim(v)}
                </text>
                <text
                  x={M.l - 4}
                  y={sy(v) + 3}
                  textAnchor="end"
                  fontSize={font.fs(10)}
                  fill="currentColor"
                >
                  {trim(v)}
                </text>
              </g>
            ))}
            <g clipPath="url(#scatter-clip)">
              {[1, 1.2, 1 / 1.2].map((k) => (
                <line
                  key={k}
                  data-diag={k}
                  x1={sx(lo)}
                  y1={sy(lo * k)}
                  x2={sx(hi)}
                  y2={sy(hi * k)}
                  stroke="currentColor"
                  strokeOpacity={k === 1 ? 0.6 : 0.35}
                  strokeDasharray={k === 1 ? undefined : "4 4"}
                />
              ))}
              {shown.map((p) => {
                const { x, y } = xy(p, metric, f.refit);
                const s = TOOL_SHAPE[p.tool]!;
                return (
                  <g
                    key={`${p.tool}|${p.key}`}
                    data-point={p.tool}
                    style={{ transition: "transform 600ms ease" }}
                  >
                    <title>{`${p.key} (${p.tool}): measured ${trim(y, 4)}, ${f.refit ? "refit" : "M1"} estimate ${trim(x, 4)}`}</title>
                    <Mark
                      shape={s.shape}
                      x={sx(x)}
                      y={sy(y)}
                      r={font.narrow ? 6 : 4.5}
                      colour={FAMILY_COLOUR[p.family]!}
                    />
                  </g>
                );
              })}
            </g>
            <text
              x={(M.l + W - M.r) / 2}
              y={H - 6}
              textAnchor="middle"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              {f.refit ? "refit" : "M1"} estimate, {METRIC_LABEL[metric]}
            </text>
            <text
              x={12}
              y={(M.t + H - M.b) / 2}
              textAnchor="middle"
              fontSize={font.fs(11)}
              fill="currentColor"
              transform={`rotate(-90 12 ${(M.t + H - M.b) / 2})`}
            >
              measured
            </text>
          </svg>
          <ul className="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
            {SCATTER_TOOLS.map((t) => (
              <li
                key={t}
                className={`flex items-center gap-2 ${f.tools.includes(t) ? "font-semibold" : ""}`}
              >
                <svg width="16" height="16" aria-hidden="true">
                  <Mark
                    shape={TOOL_SHAPE[t]!.shape}
                    x={8}
                    y={8}
                    r={5}
                    colour="currentColor"
                  />
                </svg>
                {TOOL_SHAPE[t]!.label}
              </li>
            ))}
            {Object.entries(FAMILY_COLOUR).map(([fam, c]) => (
              <li key={fam} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block size-3 rounded-full"
                  style={{ background: c }}
                />
                <span className="font-mono">{fam}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            Colour is the family; the shape is the tool. Hover a point for its
            design. Reference-RTL anchors are left out (the M1 model is fitted
            to two of them).
          </p>
        </div>
      }
      params={
        <Segmented
          label="Metric"
          value={metric}
          options={(["fmax", "luts", "ffs"] as const).map((m) => ({
            value: m,
            label: METRIC_LABEL[m],
          }))}
          onChange={(m) => setMetric(m as Metric)}
        />
      }
    />
  );
}
