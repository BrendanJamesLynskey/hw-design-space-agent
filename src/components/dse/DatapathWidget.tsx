"use client";

/**
 * The four CORDIC families as datapaths, cycle by cycle: angles (numbered tokens) flow through
 * the pre-rotation, the rotation hardware and the output register. The FSM families (iterative,
 * unrolled_k) loop one angle at a time through shared rotation hardware; the pipelined families
 * take a new angle every cycle. Throughput, latency, LUTs, FFs and Fmax come from the TS port of
 * the repo's cost model (estimates; identical to the Python reference, tests/unit/cost.test.ts);
 * cycles come from the schedule (exact).
 */
import { useMemo, useState, type ReactNode } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Segmented, Slider, Stat } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { datapathCaption } from "@/lib/dse/captions";
import { metrics } from "@/lib/dse/cost";
import { datapathFrames } from "@/lib/dse/datapath";
import {
  arch,
  isPipelined,
  latencyCycles,
  rotationsPerStep,
  steps,
  type Family,
} from "@/lib/dse/families";
import { fmtInt, trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

const VW = 640;
const VH = 190;

const FAMILY_OPTIONS = [
  { value: "iterative", label: "iterative" },
  { value: "unrolled_k", label: "unrolled_k" },
  { value: "pipelined", label: "pipelined" },
  { value: "pipelined_m", label: "pipelined_m" },
] as const;

const TOKEN_COLOURS = [
  OKABE_ITO.orange,
  OKABE_ITO.sky,
  OKABE_ITO.green,
  OKABE_ITO.yellow,
  OKABE_ITO.purple,
];

export default function DatapathWidget({
  children,
}: {
  children?: ReactNode;
}): JSX.Element {
  const [family, setFamily] = useState<Family>("iterative");
  const [N, setN] = useState(14);
  const [W, setW] = useState(16);
  const [km, setKm] = useState(2);
  const a = useMemo(
    () =>
      arch(family, {
        data_width: W,
        n_iter: N,
        angle_guard: 0,
        frac_guard: 0,
        rounding: "trunc",
        k: km,
        m: km,
      }),
    [family, N, W, km],
  );
  const frames = useMemo(() => datapathFrames(a), [a]);
  const stepper = useStepper(frames.length, {
    stepMs: 450,
    resetKey: `${family}|${N}|${W}|${km}`,
  });
  const f = frames[stepper.step]!;
  const m = metrics(a);
  const font = useSvgFont(VW);
  const [hover, setHover] = useState<string | null>(null);
  const pipe = isPipelined(a);
  const st = steps(a);
  const r = rotationsPerStep(a);
  const L = latencyCycles(a);
  const name =
    family === "unrolled_k"
      ? `unrolled_k (k=${km})`
      : family === "pipelined_m"
        ? `pipelined_m (m=${km})`
        : family;

  // slots drawn left to right: pre-rotation, rotation hardware, output
  const nSlots = pipe ? st + 2 : 3;
  const gap = 6;
  const bw = (VW - 20 - gap * (nSlots - 1)) / nSlots;
  const slotX = (s: number) => 10 + s * (bw + gap);
  const boxY = 60;
  const boxH = 70;
  const drawSlot = (tokSlot: number) =>
    pipe ? tokSlot : tokSlot === 0 ? 0 : tokSlot <= st ? 1 : 2;
  const hl = hover ?? (pipe ? "pipe" : "fsm");

  return (
    <AnimationPanel
      title="The families as datapaths"
      summary={
        <>
          Angles flow through the hardware cycle by cycle. Cycles are exact (the
          schedule); LUTs, FFs, Fmax and MSPS are cost-model estimates.
        </>
      }
      stepper={stepper}
      stepLabel="cycle"
      countFrom={0}
      caption={datapathCaption(f, a, name)}
      testId="datapath-widget"
      equation={children}
      hl={hl}
      onEquationHover={setHover}
      visual={
        <svg
          ref={font.ref}
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full"
          role="img"
          aria-label={`${name} at cycle ${f.cycle}: ${f.tokens.length} angle(s) in the datapath, ${f.completed} result(s) out`}
        >
          {Array.from({ length: nSlots }, (_, s) => {
            const label =
              s === 0
                ? "pre-rotate"
                : s === nSlots - 1
                  ? "output"
                  : pipe
                    ? font.narrow && nSlots > 8
                      ? ""
                      : `${r}×`
                    : `${r} rot/cycle`;
            return (
              <g key={s} data-slot={s}>
                <rect
                  x={slotX(s)}
                  y={boxY}
                  width={bw}
                  height={boxH}
                  rx={4}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.5}
                />
                {label &&
                  (nSlots <= 8 ||
                    s === 0 ||
                    s === nSlots - 1 ||
                    !font.narrow) &&
                  bw * font.scale > 30 && (
                    <text
                      x={slotX(s) + bw / 2}
                      y={boxY + boxH + 18}
                      textAnchor="middle"
                      fontSize={font.fs(11)}
                      fill="currentColor"
                    >
                      {label}
                    </text>
                  )}
              </g>
            );
          })}
          {!pipe && (
            <path
              data-mark="loop"
              d={`M ${slotX(1) + bw * 0.8} ${boxY} C ${slotX(1) + bw * 0.8} ${boxY - 34}, ${slotX(1) + bw * 0.2} ${boxY - 34}, ${slotX(1) + bw * 0.2} ${boxY}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.6}
              strokeWidth={2}
              markerEnd="url(#dp-arrow)"
            />
          )}
          <defs>
            <marker
              id="dp-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {f.tokens.map((t) => {
            const s = drawSlot(t.slot);
            const cxp = slotX(s) + bw / 2;
            const rad = Math.min(16, bw / 2 - 2);
            return (
              <g key={t.id} data-token={t.id}>
                <circle
                  cx={cxp}
                  cy={boxY + boxH / 2}
                  r={rad}
                  fill={TOKEN_COLOURS[t.id % TOKEN_COLOURS.length]}
                  stroke={t.idle ? "currentColor" : "none"}
                  strokeDasharray="3 2"
                />
                {rad * font.scale >= 9 && (
                  <text
                    x={cxp}
                    y={boxY + boxH / 2 + 4}
                    textAnchor="middle"
                    fontSize={font.fs(11)}
                    fill="#000"
                  >
                    {t.id}
                  </text>
                )}
              </g>
            );
          })}
          <text x={10} y={22} fontSize={font.fs(12)} fill="currentColor">
            cycle {f.cycle} · results out: {f.completed}
          </text>
          {!pipe && (
            <text
              x={VW - 10}
              y={22}
              textAnchor="end"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              {st} iteration cycles per angle
            </text>
          )}
        </svg>
      }
      stats={
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Stat
            label="Throughput"
            value={`${trim(m.throughputMsps)} MSPS`}
            hint="estimate"
          />
          <Stat
            label="Latency"
            value={`${L} cycles`}
            hint={`${trim(m.latencyNs)} ns, estimate`}
          />
          <Stat label="LUTs" value={fmtInt(m.luts)} hint="estimate" />
          <Stat label="FFs" value={fmtInt(m.ffs)} hint="estimate" />
          <Stat label="Fmax" value={`${trim(m.fmaxMhz)} MHz`} hint="estimate" />
        </div>
      }
      params={
        <>
          <Segmented
            label="Family"
            value={family}
            options={FAMILY_OPTIONS}
            onChange={(v) => setFamily(v as Family)}
          />
          <Slider
            label="Iterations N"
            value={N}
            min={4}
            max={24}
            onChange={setN}
          />
          <Slider
            label="Data width W"
            value={W}
            min={8}
            max={28}
            onChange={setW}
            format={(v) => `${v} bits`}
          />
          <Slider
            label={
              family === "pipelined_m"
                ? "m: rotations per register"
                : "k: rotations per cycle"
            }
            value={km}
            min={2}
            max={8}
            onChange={setKm}
            format={(v) =>
              family === "unrolled_k" || family === "pipelined_m"
                ? String(v)
                : `${v} (unused by ${family})`
            }
          />
        </>
      }
    />
  );
}
