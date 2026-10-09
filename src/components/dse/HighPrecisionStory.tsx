"use client";

/**
 * high_precision's winner under measurement: the exhaustive grid's choice (pipelined_m
 * W=26 N=22 m=6) against its 4% smaller neighbour (m=8), on the spec's 50 MSPS constraint,
 * view by view: the M1 estimate, the vivado-2025.2 refit, Vivado post-synthesis and Vivado
 * post-route. Both are one result per cycle, so throughput (MSPS) is Fmax (MHz). The margins
 * are computed from the exported numbers; the verdict states how thin the post-synthesis one is.
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { hpCaption } from "@/lib/dse/captions";
import type { HighPrecision } from "@/lib/dse/ladder";
import {
  HP_VIEWS,
  hpFrames,
  hpMeets,
  hpMsps,
  type HpView,
} from "@/lib/dse/m2frames";
import { fmtInt, signedPct, trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 600;
const VIEW: Record<HpView, { label: string; prov: "estimate" | "measured" }> = {
  m1: { label: "M1 estimate", prov: "estimate" },
  refit: { label: "refit (vivado-2025.2)", prov: "estimate" },
  post_synth: { label: "Vivado post-synthesis", prov: "measured" },
  post_route: { label: "Vivado post-route", prov: "measured" },
};

export default function HighPrecisionStory({
  hp,
}: {
  hp: HighPrecision;
}): JSX.Element {
  const frames = useMemo(() => hpFrames(), []);
  const stepper = useStepper(frames.length, { stepMs: 2600 });
  const f = frames[stepper.step]!;
  const font = useSvgFont(W);
  const narrow = font.narrow;
  // phones: each view's name sits above its bars, which take the full width
  const M = { l: narrow ? 8 : 170, r: narrow ? 175 : 110, t: 28, b: 40 };
  const rowH = narrow ? 34 : 22;
  const label = narrow ? 26 : 0;
  const gap = narrow ? 14 : 10;
  const H = M.t + M.b + HP_VIEWS.length * (label + 2 * rowH + gap);
  const lo = 40;
  const hi = 70;
  const sx = (v: number) => M.l + ((v - lo) / (hi - lo)) * (W - M.l - M.r);

  return (
    <AnimationPanel
      title="high_precision: m=6 or m=8?"
      summary={
        <>
          The spec needs ≥ {trim(hp.min_msps)} MSPS and the smallest LUT+FF. Two
          candidates one notch apart, through four views of the same designs:
          the models <Prov kind="estimate" /> and Vivado 2025.2{" "}
          <Prov kind="measured" />.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={hpCaption(f, hp)}
      testId="hp-widget"
      visual={
        <div className="min-w-0">
          <svg
            ref={font.ref}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={`Throughput of m=6 and m=8 against the ${hp.min_msps} MSPS constraint, ${f.views.length} views shown`}
          >
            {(narrow ? [40, 50, 60, 70] : [40, 45, 50, 55, 60, 65, 70]).map(
              (v) => (
                <g key={v}>
                  <line
                    x1={sx(v)}
                    x2={sx(v)}
                    y1={M.t}
                    y2={H - M.b}
                    stroke="currentColor"
                    strokeOpacity={v === hp.min_msps ? 0 : 0.1}
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
              ),
            )}
            <text
              x={(M.l + W - M.r) / 2}
              y={H - 4}
              textAnchor="middle"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              MSPS (= Fmax in MHz: one result per cycle)
            </text>
            <line
              x1={sx(hp.min_msps)}
              x2={sx(hp.min_msps)}
              y1={M.t - 8}
              y2={H - M.b}
              stroke={OKABE_ITO.vermillion}
              strokeWidth={2}
            />
            <text
              x={sx(hp.min_msps)}
              y={M.t - 10}
              textAnchor="middle"
              fontSize={font.fs(10)}
              fill={OKABE_ITO.vermillion}
            >
              ≥ {trim(hp.min_msps)} MSPS
            </text>
            {HP_VIEWS.map((v, i) => {
              const on = f.views.includes(v);
              const top = M.t + i * (label + 2 * rowH + gap);
              const y0 = top + label;
              return (
                <g key={v} data-view={v} opacity={on ? 1 : 0.15}>
                  <text
                    x={narrow ? M.l : M.l - 8}
                    y={narrow ? top + label - 8 : y0 + rowH - 4}
                    textAnchor={narrow ? "start" : "end"}
                    fontSize={font.fs(11)}
                    fill="currentColor"
                  >
                    {VIEW[v].label}
                  </text>
                  {hp.candidates.map((c, j) => {
                    const val = hpMsps(hp, c.m, v);
                    const ok = hpMeets(hp, c.m, v);
                    const y = y0 + j * rowH;
                    return (
                      <g
                        key={c.m}
                        data-m={c.m}
                        data-meets={ok ? "true" : "false"}
                      >
                        <rect
                          x={sx(lo)}
                          y={y + 3}
                          width={
                            on ? Math.max(1, sx(Math.min(val, hi)) - sx(lo)) : 0
                          }
                          height={rowH - 6}
                          fill={j === 0 ? OKABE_ITO.blue : OKABE_ITO.sky}
                          fillOpacity={VIEW[v].prov === "estimate" ? 0.45 : 0.9}
                          stroke={j === 0 ? OKABE_ITO.blue : OKABE_ITO.sky}
                          strokeDasharray={
                            VIEW[v].prov === "estimate" ? "4 2" : undefined
                          }
                        />
                        <text
                          x={sx(lo) + 4}
                          y={y + rowH - 8}
                          fontSize={font.fs(10)}
                          fill={j === 0 ? "#fff" : "#000"}
                        >
                          m={c.m}
                        </text>
                        {on && (
                          <text
                            x={
                              Math.max(sx(Math.min(val, hi)), sx(hp.min_msps)) +
                              4
                            }
                            y={y + rowH - 8}
                            fontSize={font.fs(10)}
                            fill="currentColor"
                          >
                            {trim(val, 4)} (
                            {signedPct(hp.margin[v][String(c.m)]!, ok ? 1 : 2)})
                            {ok ? " ✓" : " ✗"}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
          <table className="mt-3 w-full text-xs" data-testid="hp-area">
            <thead>
              <tr>
                <th className="text-left font-semibold">
                  Design (W=26 N=22 round)
                </th>
                <th className="text-left font-semibold">
                  LUT + FF, Vivado post-synthesis
                </th>
                <th className="text-left font-semibold">M1 estimate</th>
              </tr>
            </thead>
            <tbody>
              {hp.candidates.map((c) => (
                <tr key={c.m}>
                  <td className="font-mono">pipelined_m m={c.m}</td>
                  <td>
                    {fmtInt(c.post_synth.luts + c.post_synth.ffs)}
                    <Prov kind="measured" />
                  </td>
                  <td>
                    {fmtInt(c.m1.luts_plus_ffs)}
                    <Prov kind="estimate" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            Dashed bars are model estimates; solid bars are Vivado 2025.2 on
            xc7a35tcpg236-1. {hp.constraint_note}
          </p>
        </div>
      }
    />
  );
}
