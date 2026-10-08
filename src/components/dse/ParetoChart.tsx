"use client";

/**
 * The true Pareto front of each feasible spec, from the exhaustive ground truth (635,040
 * designs scored by the repo's models), with a readout for any point: hover it, or step
 * through the front with the slider (keyboard). The spec's own choice is ringed.
 */
import { useId, useMemo, useState } from "react";

import { Segmented } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import type { Design, GroundTruth, SpecInfo } from "@/lib/dse/data";
import { designName, fmtInt, pow2, trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 640;
const H = 300;
const M = { l: 60, r: 16, t: 16, b: 44 };

const AXIS: Record<string, string> = {
  luts: "LUTs",
  luts_plus_ffs: "LUTs + FFs",
  accuracy_bits: "accuracy bits",
  power_index: "power index",
};

export default function ParetoChart({
  specs,
  truths,
  names,
}: {
  specs: Record<string, SpecInfo>;
  truths: Record<string, GroundTruth>;
  names: string[];
}): JSX.Element {
  const [spec, setSpec] = useState(names[0]!);
  const s = specs[spec]!;
  const gt = truths[spec]!;
  const [ox, oy] = s.objectives.map((o) => o.metric) as [string, string];
  const pts = useMemo(
    () =>
      [...gt.front].sort(
        (a, b) =>
          (a[ox as keyof Design] as number) - (b[ox as keyof Design] as number),
      ),
    [gt, ox],
  );
  const [pick, setPick] = useState(0);
  const idx = Math.min(pick, pts.length - 1);
  const d = pts[idx]!;
  const font = useSvgFont(W);
  const sliderId = useId();
  const val = (p: Design, k: string) => p[k as keyof Design] as number;
  const xs = pts.map((p) => val(p, ox));
  const ys = pts.map((p) => val(p, oy));
  const pad = (lo: number, hi: number) => {
    const span = hi - lo || Math.abs(hi) * 0.1 || 1;
    return [lo - span * 0.08, hi + span * 0.08] as const;
  };
  const [x0, x1] = pad(Math.min(...xs), Math.max(...xs));
  const [y0, y1] = pad(Math.min(...ys), Math.max(...ys));
  const sx = (v: number) => M.l + ((v - x0) / (x1 - x0)) * (W - M.l - M.r);
  const sy = (v: number) => M.t + (1 - (v - y0) / (y1 - y0)) * (H - M.t - M.b);
  const sel = gt.selected!;
  const ticks = (a: number, b: number) =>
    [0, 0.25, 0.5, 0.75, 1].map((t) => a + (b - a) * t);

  return (
    <figure
      data-testid="pareto-chart"
      className="my-8 min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <figcaption>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          Interactive · exhaustive ground truth
        </p>
        <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">
          The true Pareto front
        </p>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Every design on the front of {fmtInt(gt.n_designs)}, for the {s.name}{" "}
          spec ({fmtInt(gt.n_feasible)} feasible). Hover a point or use the
          slider; the ringed point is the spec&apos;s own choice.
        </p>
      </figcaption>
      <div className="mt-3">
        <Segmented
          label="Spec"
          value={spec}
          options={names.map((n) => ({ value: n, label: n }))}
          onChange={(v) => {
            setSpec(v);
            setPick(0);
          }}
        />
      </div>
      <svg
        ref={font.ref}
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full"
        role="img"
        aria-label={`${pts.length} Pareto-optimal designs for ${s.name}: ${AXIS[ox]} against ${AXIS[oy]}`}
      >
        {ticks(x0, x1).map((v, i) => (
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
        {ticks(y0, y1).map((v, i) => (
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
          {AXIS[ox]} ({s.objectives[0]!.direction})
        </text>
        <text
          x={14}
          y={(M.t + H - M.b) / 2}
          textAnchor="middle"
          fontSize={font.fs(11)}
          fill="currentColor"
          transform={`rotate(-90 14 ${(M.t + H - M.b) / 2})`}
        >
          {AXIS[oy]} ({s.objectives[1]!.direction})
        </text>
        {pts.map((p, i) => (
          <circle
            key={p.key}
            data-point={i}
            cx={sx(val(p, ox))}
            cy={sy(val(p, oy))}
            r={i === idx ? 7 : 4}
            fill={i === idx ? OKABE_ITO.orange : OKABE_ITO.blue}
            onMouseEnter={() => setPick(i)}
            className="cursor-pointer"
          />
        ))}
        <circle
          data-mark="selected"
          cx={sx(val(sel, ox))}
          cy={sy(val(sel, oy))}
          r={11}
          fill="none"
          stroke={OKABE_ITO.green}
          strokeWidth={2.5}
          pointerEvents="none"
        />
      </svg>
      <div className="mt-2 flex items-center gap-3">
        <label
          htmlFor={sliderId}
          className="shrink-0 font-mono text-xs text-neutral-600 dark:text-neutral-400"
        >
          design {idx + 1}/{pts.length}
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={pts.length - 1}
          value={idx}
          onChange={(e) => setPick(Number(e.target.value))}
          className="focus-ring h-11 w-full min-w-0 accent-indigo-600"
          aria-label="Choose a design on the front"
          data-testid="pareto-slider"
        />
      </div>
      <p
        aria-live="polite"
        data-testid="pareto-readout"
        className="mt-2 rounded bg-white px-3 py-2 text-sm text-neutral-800 ring-1 ring-neutral-200 dark:bg-neutral-950 dark:text-neutral-200 dark:ring-neutral-800"
      >
        <span className="font-mono">{designName(d.family, d.params)}</span>
        {d.key === sel.key ? " (the spec's choice)" : ""}: {fmtInt(d.luts)}{" "}
        LUTs, {fmtInt(d.ffs)} FFs, {trim(d.throughput_msps)} MSPS, power index{" "}
        {trim(d.power_index)}
        <Prov kind="estimate" />; max error {pow2(d.max_abs_err)} ={" "}
        {trim(d.accuracy_bits, 4)} bits
        <Prov kind="exact" />; latency {d.latency_cycles} cycles
        <Prov kind="exact" />.
      </p>
    </figure>
  );
}
