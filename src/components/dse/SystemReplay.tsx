"use client";

/**
 * multiaxis_control in its system: the repository's SimPy control-loop model, run for the
 * design each view of the spec picks (MSPS-only m=7, L1 bound m=5, simulated m=4). First one
 * tick, the p99 tick of each design, drained request by request against the 0.44 µs deadline;
 * then all 400 ticks of the run, with the L1 bound and the simulated p99. Every time and count
 * comes from src/data/m3.json (scripts/export_m3.py: simulated with hw_dse.l2.system at the
 * vendored commit and checked against the committed ground truth).
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { useSvgFont } from "@/components/viz/useSvgFont";
import {
  VIEW_LABEL,
  laneAt,
  sysCaption,
  sysFrames,
  type SystemReplay as Replay,
} from "@/lib/dse/m3";
import { fmtInt, trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 600;
const COLOUR = [OKABE_ITO.sky, OKABE_ITO.orange, OKABE_ITO.blue];

export default function SystemReplay({ rep }: { rep: Replay }): JSX.Element {
  const frames = useMemo(() => sysFrames(rep), [rep]);
  const stepper = useStepper(frames.length, { stepMs: 1300 });
  const f = frames[stepper.step]!;
  const font = useSvgFont(W);
  const narrow = font.narrow;
  const strip = f.phase === "ticks" || f.phase === "verdict";
  const M = { l: narrow ? 10 : 190, r: 16, t: 26, b: 34 };
  const label = narrow ? 30 : 0;
  const laneH = narrow ? 52 : 46;
  const H = M.t + M.b + rep.designs.length * (laneH + label);
  const limit = rep.limit_us * 1000;
  const [lo, hi] = strip ? [340, 620] : [0, 640];
  const sx = (ns: number) =>
    M.l + ((Math.min(Math.max(ns, lo), hi) - lo) / (hi - lo)) * (W - M.l - M.r);
  const ticks = strip
    ? [360, 400, 440, 480, 520, 560, 600]
    : narrow
      ? [0, 200, 400, 600]
      : [0, 100, 200, 300, 400, 500, 600];

  return (
    <AnimationPanel
      title="multiaxis_control: why m=4"
      summary={
        <>
          A 1 µs control tick issues {rep.requests} requests at once; all{" "}
          {rep.requests} results must be back within {rep.limit_us} µs (p99 over{" "}
          {rep.n_ticks} ticks). The repository&apos;s SimPy model{" "}
          <Prov kind="simulated" />, run for the design each view of the spec
          picks.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={sysCaption(f, rep)}
      testId="system-widget"
      visual={
        <div className="min-w-0">
          <svg
            ref={font.ref}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            data-phase={f.phase}
            aria-label={
              strip
                ? `Batch latency of every tick for m=7, m=5 and m=4 against the ${rep.limit_us} µs limit`
                : `One tick, ${trim(f.t, 4)} ns in: results out per design against the ${rep.limit_us} µs limit`
            }
          >
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
                <text
                  x={sx(v)}
                  y={H - M.b + 14}
                  textAnchor="middle"
                  fontSize={font.fs(10)}
                  fill="currentColor"
                >
                  {v}
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
              {strip
                ? "batch latency, ns after the tick (one dot per tick)"
                : "ns after the tick"}
            </text>
            <line
              x1={sx(limit)}
              x2={sx(limit)}
              y1={M.t - 8}
              y2={H - M.b}
              stroke={OKABE_ITO.vermillion}
              strokeWidth={2}
            />
            <text
              x={sx(limit)}
              y={M.t - 11}
              textAnchor="middle"
              fontSize={font.fs(10)}
              fill={OKABE_ITO.vermillion}
            >
              {rep.limit_us} µs limit
            </text>
            {!strip && (
              <line
                x1={sx(f.t)}
                x2={sx(f.t)}
                y1={M.t}
                y2={H - M.b}
                stroke="currentColor"
                strokeDasharray="3 3"
                data-testid="cursor"
              />
            )}
            {rep.designs.map((d, i) => {
              const top = M.t + i * (laneH + label);
              const y0 = top + label;
              const c = COLOUR[i]!;
              const lane = laneAt(d, f.t);
              const name = `m=${d.m} · ${fmtInt(d.luts_plus_ffs)} LUT+FF · ${trim(d.fmax_mhz, 3)} MHz`;
              return (
                <g
                  key={d.view}
                  data-m={d.m}
                  data-view={d.view}
                  data-done={lane.done}
                  data-complete={lane.complete ? "true" : "false"}
                  data-meets={d.meets ? "true" : "false"}
                >
                  <text
                    x={narrow ? M.l : M.l - 8}
                    y={narrow ? top + 22 : y0 + 18}
                    textAnchor={narrow ? "start" : "end"}
                    fontSize={font.fs(11)}
                    fill="currentColor"
                    fontWeight={600}
                  >
                    {name}
                  </text>
                  {!narrow && (
                    <text
                      x={M.l - 8}
                      y={y0 + 33}
                      textAnchor="end"
                      fontSize={font.fs(10)}
                      fill="currentColor"
                    >
                      {VIEW_LABEL[d.view]} winner
                    </text>
                  )}
                  <rect
                    x={M.l}
                    y={y0 + 4}
                    width={W - M.l - M.r}
                    height={laneH - 8}
                    fill="currentColor"
                    fillOpacity={0.04}
                  />
                  {strip ? (
                    <>
                      {d.batches_ns.map((b, k) => (
                        <circle
                          key={k}
                          cx={sx(b)}
                          cy={y0 + 10 + ((k * 37) % 26)}
                          r={1.6}
                          fill={c}
                          fillOpacity={0.7}
                        />
                      ))}
                      <line
                        x1={sx(d.bound_us * 1000)}
                        x2={sx(d.bound_us * 1000)}
                        y1={y0 + 2}
                        y2={y0 + laneH - 2}
                        stroke="currentColor"
                        strokeDasharray="4 2"
                        data-testid="bound"
                      />
                      <line
                        x1={sx(d.p99_us * 1000)}
                        x2={sx(d.p99_us * 1000)}
                        y1={y0 + 2}
                        y2={y0 + laneH - 2}
                        stroke="currentColor"
                        strokeWidth={2.5}
                        data-testid="p99"
                      />
                      {f.phase === "verdict" && (
                        <text
                          x={W - M.r - 2}
                          y={y0 + 18}
                          textAnchor="end"
                          fontSize={font.fs(12)}
                          fontWeight={700}
                          fill={
                            d.meets ? OKABE_ITO.green : OKABE_ITO.vermillion
                          }
                        >
                          {d.meets ? "✓ meets" : "✗ misses"}
                        </text>
                      )}
                    </>
                  ) : (
                    <>
                      {d.accept_ns
                        .filter((a) => a <= f.t)
                        .map((a, k) => (
                          <line
                            key={`a${k}`}
                            x1={sx(a)}
                            x2={sx(a)}
                            y1={y0 + 8}
                            y2={y0 + 18}
                            stroke={c}
                            strokeOpacity={0.8}
                          />
                        ))}
                      {d.result_ns
                        .filter((r) => r <= f.t)
                        .map((r, k) => (
                          <rect
                            key={`r${k}`}
                            x={sx(r) - 1.5}
                            y={y0 + 24}
                            width={3}
                            height={12}
                            fill={c}
                          />
                        ))}
                      {lane.complete && (
                        <text
                          x={sx(lane.finish) + (lane.finish > 520 ? -4 : 4)}
                          y={y0 + 18}
                          textAnchor={lane.finish > 520 ? "end" : "start"}
                          fontSize={font.fs(10)}
                          fontWeight={700}
                          fill={
                            lane.finish <= limit
                              ? OKABE_ITO.green
                              : OKABE_ITO.vermillion
                          }
                        >
                          {trim(lane.finish, 3)} ns{" "}
                          {lane.finish <= limit ? "✓" : "✗"}
                        </text>
                      )}
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            {strip
              ? "Dashed line: the L1 analytic bound (estimate); thick line: the simulated p99 over all ticks."
              : "Thin marks: an accept at a clock edge; bars: a result out. Each design's p99 tick is shown."}{" "}
            Clocks are each design&apos;s estimated Fmax{" "}
            <Prov kind="estimate" />.
          </p>
          <table className="mt-2 w-full text-xs" data-testid="system-table">
            <thead>
              <tr>
                <th className="text-left font-semibold">Design</th>
                <th className="text-left font-semibold">L1 bound</th>
                <th className="text-left font-semibold">Simulated p99</th>
              </tr>
            </thead>
            <tbody>
              {rep.designs.map((d) => (
                <tr key={d.view}>
                  <td className="font-mono">pipelined_m m={d.m}</td>
                  <td>
                    {trim(d.bound_us, 4)} µs {d.bound_meets ? "✓" : "✗"}
                  </td>
                  <td>
                    {trim(d.p99_us, 4)} µs {d.meets ? "✓" : "✗"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    />
  );
}
