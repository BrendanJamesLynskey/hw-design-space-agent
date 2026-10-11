"use client";

/**
 * The held-out sky130 check: nine ground-truth designs the ASIC model was never fitted to
 * (each spec's per-family optima, the FPGA twins' optima and the L1-bound pick), synthesised
 * with Yosys 0.33 and timed with OpenSTA 3.1.0, against the model's estimate. One design per
 * step: its area error and its Fmax error. Area stays within 5%; Fmax does not, and is
 * optimistic on most of them. Values from src/data/m4.json (scripts/export_m4.py re-evaluates
 * every estimate with the reference and asserts each row of results.md).
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { useSvgFont } from "@/components/viz/useSvgFont";
import {
  heldCaption,
  heldFrames,
  heldRole,
  shortKey,
  type AsicSpec,
  type HeldRow,
  type M4Data,
} from "@/lib/dse/m4";
import { signedPct, trim } from "@/lib/format";
import { FAMILY_COLOUR, OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 300;

function ErrPanel({
  rows,
  shown,
  metric,
}: {
  rows: HeldRow[];
  shown: number;
  metric: "area_err" | "fmax_err";
}): JSX.Element {
  const font = useSvgFont(W);
  const [lo, hi] = metric === "area_err" ? [-10, 10] : [-20, 45];
  const ticks = metric === "area_err" ? [-10, -5, 0, 5, 10] : [-20, 0, 20, 40];
  const rowH = 22;
  const M = { l: 22, r: 10, t: 26, b: 28 };
  const H = M.t + M.b + rows.length * rowH;
  const sx = (v: number) => M.l + ((v - lo) / (hi - lo)) * (W - M.l - M.r);
  return (
    <svg
      ref={font.ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      data-panel={metric}
      aria-label={`${metric === "area_err" ? "Area" : "Fmax"} error of the model against sky130 synthesis, ${shown} of ${rows.length} designs shown`}
    >
      <text
        x={0}
        y={14}
        fontSize={font.fs(11)}
        fontWeight={600}
        fill="currentColor"
      >
        {metric === "area_err"
          ? "Area: estimate vs measured"
          : "Fmax: estimate vs measured"}
      </text>
      {metric === "area_err" && (
        <rect
          x={sx(-5)}
          y={M.t}
          width={sx(5) - sx(-5)}
          height={H - M.t - M.b}
          fill={OKABE_ITO.green}
          fillOpacity={0.12}
          data-testid="band"
        />
      )}
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={sx(v)}
            x2={sx(v)}
            y1={M.t}
            y2={H - M.b}
            stroke="currentColor"
            strokeOpacity={v === 0 ? 0.6 : 0.12}
          />
          <text
            x={sx(v)}
            y={H - M.b + 14}
            textAnchor="middle"
            fontSize={font.fs(10)}
            fill="currentColor"
          >
            {v > 0 ? `+${v}` : v}%
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const on = i < shown;
        const v = r[metric] * 100;
        const y = M.t + i * rowH + rowH / 2;
        const optimistic = metric === "fmax_err" && r.fmax_err > 0.01;
        return (
          <g key={r.key} data-row={i + 1} opacity={on ? 1 : 0.12}>
            <text x={4} y={y + 4} fontSize={font.fs(10)} fill="currentColor">
              {i + 1}
            </text>
            <line
              x1={sx(0)}
              x2={sx(v)}
              y1={y}
              y2={y}
              stroke={FAMILY_COLOUR[r.family]}
              strokeWidth={2}
            />
            <circle
              cx={sx(v)}
              cy={y}
              r={5}
              fill={optimistic ? OKABE_ITO.vermillion : FAMILY_COLOUR[r.family]}
              stroke="currentColor"
              strokeWidth={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function HeldOut({
  held,
  specs,
}: {
  held: M4Data["held_out"];
  specs: AsicSpec[];
}): JSX.Element {
  const rows = held.rows;
  const frames = useMemo(() => heldFrames(rows), [rows]);
  const stepper = useStepper(frames.length, { stepMs: 2200 });
  const f = frames[stepper.step]!;
  return (
    <AnimationPanel
      title="The held-out check: where the ASIC model is wrong"
      summary={
        <>
          Nine designs the model never saw, synthesised on sky130{" "}
          <Prov kind="measured" /> against the model <Prov kind="estimate" />:
          error = estimate ÷ measured − 1, so right of zero is optimistic.
        </>
      }
      stepper={stepper}
      stepLabel="design"
      caption={heldCaption(f, rows, specs, held)}
      testId="held-widget"
      visual={
        <div className="min-w-0" data-summary={f.summary ? "true" : "false"}>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <ErrPanel rows={rows} shown={f.shown} metric="area_err" />
            <ErrPanel rows={rows} shown={f.shown} metric="fmax_err" />
          </div>
          <table className="mt-2 w-full text-xs" data-testid="held-table">
            <thead>
              <tr>
                <th className="text-left font-semibold">#</th>
                <th className="text-left font-semibold">Design (why)</th>
                <th className="text-left font-semibold">Area</th>
                <th className="text-left font-semibold">Fmax (MHz)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.key}
                  data-current={
                    !f.summary && i === f.shown - 1 ? "true" : "false"
                  }
                  className={
                    !f.summary && i === f.shown - 1
                      ? "bg-indigo-50 dark:bg-indigo-950/40"
                      : i < f.shown
                        ? ""
                        : "opacity-40"
                  }
                >
                  <td>{i + 1}</td>
                  <td>
                    <span className="font-mono">{shortKey(r.key)}</span>{" "}
                    <span className="text-neutral-600 dark:text-neutral-400">
                      ({heldRole(r, specs)})
                    </span>
                  </td>
                  <td>{signedPct(r.area_err, 1)}</td>
                  <td>
                    {trim(r.fmax_meas, 3)} vs {trim(r.fmax_est, 3)} (
                    {signedPct(r.fmax_err, 1)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            Shaded: within 5%. Red dots: Fmax estimate more than 1% above the
            measurement. Post-synthesis with a wire-load model (no place and
            route), typical corner.
          </p>
        </div>
      }
    />
  );
}
