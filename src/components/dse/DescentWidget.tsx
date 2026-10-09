"use client";

/**
 * One design down the ladder: the repository's worked example (docs/worked_example_m2.md), the
 * exhaustive ground truth's winner for low_area_control, taken from its L1 estimate through
 * generated RTL, two simulators, the family's formal proof, synthesis and place-and-route, the
 * synthesised netlist simulated at the gate level, measured against estimated, and the L5 refit
 * and back-annotation verdict. Every number is exported from the vendored data and re-checked
 * against the tables and the Python reference (scripts/export_ladder.py).
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { descentCaption } from "@/lib/dse/captions";
import type { FormalRow, Worked } from "@/lib/dse/ladder";
import { descentBars, descentFrames } from "@/lib/dse/m2frames";
import { designName, fmtInt, pow2, signedPct, trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const RUNGS = [
  { id: "L1", name: "Analytical estimate" },
  { id: "L3", name: "RTL, simulated and proved" },
  { id: "L4", name: "Synthesis, place and route" },
  { id: "GL", name: "Gate-level netlist, simulated" },
  { id: "L5", name: "Back-annotation" },
] as const;

const NAME = { luts: "LUTs", ffs: "FFs", fmax_mhz: "Fmax (MHz)" } as const;
const W = 560;

function Bars({ w, refit }: { w: Worked; refit: boolean }): JSX.Element {
  const font = useSvgFont(W);
  const H = font.narrow ? 300 : 190;
  const M = {
    l: font.narrow ? 120 : 90,
    r: font.narrow ? 150 : 120,
    t: 10,
    b: 28,
  };
  const bars = descentBars(w);
  const max = Math.max(
    1.1,
    ...bars.map((b) => Math.max(b.est, b.refit) / b.meas),
  );
  const sx = (v: number) => M.l + (v / max) * (W - M.l - M.r);
  const band = (H - M.t - M.b) / bars.length;
  const series: {
    key: "est" | "meas" | "refit";
    label: string;
    colour: string;
    dash: string | undefined;
  }[] = [
    {
      key: "est",
      label: "L1 estimate",
      colour: OKABE_ITO.orange,
      dash: undefined,
    },
    { key: "meas", label: "measured", colour: OKABE_ITO.blue, dash: undefined },
    ...(refit
      ? [
          {
            key: "refit" as const,
            label: "L5 refit",
            colour: OKABE_ITO.orange,
            dash: "4 3",
          },
        ]
      : []),
  ];
  const bh = Math.min(16, (band - 8) / 3);
  return (
    <svg
      ref={font.ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Estimate, measurement and refit, relative to the measurement"
    >
      <line
        x1={sx(1)}
        x2={sx(1)}
        y1={M.t}
        y2={H - M.b}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeDasharray="3 3"
      />
      <text
        x={sx(1)}
        y={H - 8}
        textAnchor="middle"
        fontSize={font.fs(11)}
        fill="currentColor"
      >
        measured = 1
      </text>
      {bars.map((b, i) => {
        const y0 = M.t + i * band + 4;
        return (
          <g key={b.metric} data-bar={b.metric}>
            <text
              x={M.l - 6}
              y={y0 + band / 2}
              textAnchor="end"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              {NAME[b.metric]}
            </text>
            {series.map((s, j) => {
              const v = b[s.key] / b.meas;
              return (
                <g key={s.key}>
                  <rect
                    x={M.l}
                    y={y0 + j * (bh + 2)}
                    width={Math.max(1, sx(Math.min(v, max)) - M.l)}
                    height={bh}
                    fill={s.dash ? "none" : s.colour}
                    fillOpacity={0.85}
                    stroke={s.colour}
                    strokeWidth={s.dash ? 2 : 0}
                    strokeDasharray={s.dash}
                  />
                  <text
                    x={sx(Math.min(v, max)) + 4}
                    y={y0 + j * (bh + 2) + bh - 3}
                    fontSize={font.fs(10)}
                    fill="currentColor"
                  >
                    {trim(b[s.key], 4)}
                    {s.key === "meas" ? "" : ` (${signedPct(v - 1)})`}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <g>
        {series.map((s, j) => (
          <g key={s.key} transform={`translate(${M.l + j * 130}, ${H - 26})`}>
            <rect
              width={12}
              height={8}
              y={-7}
              fill={s.dash ? "none" : s.colour}
              stroke={s.colour}
              strokeDasharray={s.dash}
            />
            <text x={16} fontSize={font.fs(10)} fill="currentColor">
              {s.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function DescentWidget({
  worked,
  formal,
}: {
  worked: Worked;
  formal: FormalRow[];
}): JSX.Element {
  const w = worked;
  const frames = useMemo(() => descentFrames(w), [w]);
  const stepper = useStepper(frames.length, { stepMs: 2200 });
  const f = frames[stepper.step]!;
  const caption = descentCaption(f, w, formal);
  const at = RUNGS.findIndex((r) => r.id === f.level);
  const proofs = formal.filter((x) => x.family === w.family);
  const simsDone =
    f.phase === "sim"
      ? f.sim! + 1
      : at > 1 || f.phase === "formal"
        ? w.l3.length
        : 0;

  return (
    <AnimationPanel
      title="One design down the ladder"
      summary={
        <>
          The exhaustive grid&apos;s winner for {w.spec},{" "}
          <span className="font-mono">{designName(w.family, w.params)}</span>,
          taken through every live level by the repository&apos;s worked
          example. Each rung shows what was run and what it found.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={caption}
      testId="descent-widget"
      visual={
        <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,14rem)_1fr]">
          <ol aria-label="The live levels" className="min-w-0 space-y-1">
            {RUNGS.map((r, i) => {
              const here = i === at;
              const done = i < at;
              return (
                <li
                  key={r.id}
                  data-rung={r.id}
                  data-here={here ? "true" : "false"}
                  className={`rounded border px-2 py-1 text-xs ${
                    here
                      ? "border-accent bg-indigo-50 ring-2 ring-accent dark:border-indigo-300 dark:bg-indigo-950/40 dark:ring-indigo-300"
                      : done
                        ? "border-neutral-300 dark:border-neutral-700"
                        : "border-dashed border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  <span className="font-mono font-medium">{r.id}</span> {r.name}
                  {done && (
                    <span
                      className="ml-1 text-emerald-700 dark:text-emerald-300"
                      aria-label="passed"
                    >
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="min-w-0 space-y-3 text-xs">
            {f.phase === "l1" && (
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 rounded bg-white p-3 ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800">
                <dt>LUTs / FFs</dt>
                <dd>
                  {trim(w.l1.luts, 4)} / {trim(w.l1.ffs, 3)}
                  <Prov kind="estimate" />
                </dd>
                <dt>Fmax → throughput</dt>
                <dd>
                  {trim(w.l1.fmax_mhz, 4)} MHz → {trim(w.l1.throughput_msps)}{" "}
                  MSPS
                  <Prov kind="estimate" />
                </dd>
                <dt>Max error</dt>
                <dd>
                  {pow2(w.l1.max_abs_err)} ({trim(w.l1.accuracy_bits, 4)} bits)
                  <Prov kind="exact" />
                </dd>
                <dt>Latency</dt>
                <dd>
                  {w.l1.latency_cycles} cycles
                  <Prov kind="exact" />
                </dd>
              </dl>
            )}
            {(f.phase === "rtl" ||
              f.phase === "sim" ||
              f.phase === "formal") && (
              <pre
                tabIndex={0}
                data-testid="descent-rtl"
                className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-2 font-mono text-[0.7rem] ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800"
              >
                {w.rtl.header.join("\n")}
              </pre>
            )}
            {at >= 1 && (
              <ul className="space-y-1" aria-label="Simulators">
                {w.l3.map((r, i) => {
                  const done = i < simsDone;
                  return (
                    <li key={r.simulator} data-sim={r.simulator}>
                      <span className="font-medium">{r.version}</span>
                      <span className="mt-0.5 block h-3 overflow-hidden rounded bg-neutral-200 dark:bg-neutral-800">
                        <span
                          className="block h-3 rounded"
                          style={{
                            width: done ? "100%" : "0%",
                            background: OKABE_ITO.green,
                          }}
                        />
                      </span>
                      {done
                        ? `${fmtInt(r.n_angles)} of ${fmtInt(r.n_angles)} angles, ${r.mismatches} mismatches, latency ${r.latency}/${r.latency_expected}`
                        : "not yet run"}
                      {done && <Prov kind="exact" />}
                    </li>
                  );
                })}
              </ul>
            )}
            {(f.phase === "formal" || at >= 2) && (
              <p data-testid="descent-formal">
                Formal ({w.family}, W = 8):{" "}
                {proofs.map((x) => `${x.job} ${x.status}`).join(", ")}
                <Prov kind="exact" />
              </p>
            )}
            {f.measured && (
              <p>
                L4 on {w.l4.part}: {fmtInt(w.l4.luts)} LUTs, {fmtInt(w.l4.ffs)}{" "}
                FFs, {fmtInt(w.l4.carry4)} CARRY4; Fmax seeds{" "}
                {w.l4.fmax_seeds.map((x) => trim(x, 4)).join(" / ")} MHz
                <Prov kind="measured" />
                {at >= 3 && (
                  <span className="block">
                    Gate level: {w.gate.mismatches} mismatches on{" "}
                    {fmtInt(w.gate.n_angles)} angles, latency {w.gate.latency}
                    <Prov kind="exact" />
                  </span>
                )}
              </p>
            )}
            {f.measured && <Bars w={w} refit={f.refit} />}
          </div>
        </div>
      }
    />
  );
}
