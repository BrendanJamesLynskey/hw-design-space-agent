"use client";

/**
 * The L2 cycle model against the generated RTL. The waveform is the cycle model
 * (hw_dse.l2.cycle) driven, closed loop, by the stimulus the repository's L2 validation fed the
 * RTL (the L3 harness with +gaps=: angles offered after random idle gaps and held until ready);
 * the export checks that it takes exactly as many edges, accepts and results as the RTL log.
 * The table is the recorded comparison: 48 traces, Icarus and Verilator, every edge identical.
 */
import { useMemo, useState } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Segmented } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { cycleCaption, cycleFrames, type Cycle, type Wave } from "@/lib/dse/m3";
import { designName, fmtInt } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 600;
const SIGNALS: { key: keyof Wave; label: string }[] = [
  { key: "valid_in", label: "valid_in" },
  { key: "ready", label: "ready" },
  { key: "accepted", label: "accept" },
  { key: "valid_out", label: "valid_out" },
];

function shortName(w: Wave): string {
  const p = Object.fromEntries(
    w.key
      .split(":")[1]!
      .split(",")
      .map((kv) => kv.split("=")),
  ) as Record<string, string>;
  return designName(w.family, {
    data_width: Number(p.data_width),
    n_iter: Number(p.n_iter),
    ...(p.m ? { m: Number(p.m) } : {}),
    ...(p.k ? { k: Number(p.k) } : {}),
  });
}

export default function CycleRtl({ cycle }: { cycle: Cycle }): JSX.Element {
  const [which, setWhich] = useState(0);
  const w = cycle.waves[which]!;
  const frames = useMemo(() => cycleFrames(w), [w]);
  const stepper = useStepper(frames.length, {
    stepMs: 1400,
    resetKey: String(which),
  });
  const f = frames[stepper.step]!;
  const font = useSvgFont(W);
  const narrow = font.narrow;
  const M = { l: narrow ? 150 : 84, r: 10, t: 20, b: 30 };
  const rowH = narrow ? 46 : 30;
  const H = M.t + M.b + SIGNALS.length * rowH;
  const n = f.end - f.start;
  const cw = (W - M.l - M.r) / n;
  const x = (i: number) => M.l + (i - f.start) * cw;

  return (
    <AnimationPanel
      title="The cycle model against the RTL"
      summary={
        <>
          The interface contract, edge by edge: the cycle model{" "}
          <Prov kind="exact" /> driven by the same bursty stimulus the
          repository fed the generated RTL in Icarus and Verilator, which
          matched it on every edge.
        </>
      }
      stepper={stepper}
      stepLabel="window"
      caption={cycleCaption(f, w, cycle)}
      testId="cycle-widget"
      visual={
        <div className="min-w-0">
          <svg
            ref={font.ref}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            data-phase={f.phase}
            data-start={f.start}
            aria-label={`Waveform of ${shortName(w)}, clock edges ${f.start} to ${f.end - 1}`}
          >
            {Array.from({ length: n + 1 }, (_, i) => f.start + i)
              .filter((e) => e % 8 === 0)
              .map((e) => (
                <g key={e}>
                  <line
                    x1={x(e)}
                    x2={x(e)}
                    y1={M.t - 4}
                    y2={H - M.b}
                    stroke="currentColor"
                    strokeOpacity={0.12}
                  />
                  <text
                    x={x(e)}
                    y={H - M.b + 14}
                    textAnchor="middle"
                    fontSize={font.fs(10)}
                    fill="currentColor"
                  >
                    {e}
                  </text>
                </g>
              ))}
            {SIGNALS.map((s, r) => {
              const bits = (w[s.key] as string).slice(f.start, f.end);
              const y0 = M.t + r * rowH;
              const hiY = y0 + 4;
              const loY = y0 + rowH - 8;
              let d = "";
              [...bits].forEach((b, i) => {
                const y = b === "1" ? hiY : loY;
                d += `${i === 0 ? "M" : "L"}${x(f.start + i)},${y}L${x(f.start + i + 1)},${y}`;
              });
              const colour =
                s.key === "accepted"
                  ? OKABE_ITO.blue
                  : s.key === "valid_out"
                    ? OKABE_ITO.green
                    : s.key === "ready"
                      ? OKABE_ITO.orange
                      : "currentColor";
              return (
                <g key={s.key} data-signal={s.key}>
                  <text
                    x={M.l - 6}
                    y={y0 + rowH / 2 + 2}
                    textAnchor="end"
                    fontSize={font.fs(10)}
                    fill="currentColor"
                    fontFamily="ui-monospace, monospace"
                  >
                    {s.label}
                  </text>
                  {[...bits].map((b, i) =>
                    b === "1" &&
                    (s.key === "accepted" || s.key === "valid_out") ? (
                      <rect
                        key={i}
                        x={x(f.start + i)}
                        y={hiY}
                        width={cw}
                        height={loY - hiY}
                        fill={colour}
                        fillOpacity={0.25}
                      />
                    ) : null,
                  )}
                  <path d={d} fill="none" stroke={colour} strokeWidth={2} />
                </g>
              );
            })}
          </svg>
          <p className="mt-1 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            {shortName(w)}, seed {w.seed}: the first {w.ready.length} of{" "}
            {fmtInt(w.edges_total)} logged edges. Shaded columns: an accept
            (valid_in and ready at the edge) and a result on valid_out.
          </p>
          <table
            className="mt-3 w-full text-xs"
            data-testid="cycle-table"
            data-highlight={f.phase === "table" ? "true" : "false"}
          >
            <caption className="text-left font-semibold">
              Recorded comparison: {cycle.passed}/{cycle.traces} traces
              identical
            </caption>
            <thead>
              <tr>
                <th className="px-1 text-left font-semibold">Design</th>
                <th className="px-1 text-left font-semibold">ii</th>
                <th className="px-1 text-left font-semibold">
                  Edges (3 seeds, each simulator)
                </th>
                <th className="px-1 text-left font-semibold">Mismatches</th>
              </tr>
            </thead>
            <tbody>
              {cycle.designs.map((d) => {
                const mm = d.runs.reduce(
                  (a, r) =>
                    a +
                    r.ready_mismatches +
                    r.valid_mismatches +
                    r.data_mismatches,
                  0,
                );
                return (
                  <tr key={d.key}>
                    <td className="px-1 font-mono">
                      {d.key.split(":")[0]}{" "}
                      {d.key
                        .split(":")[1]!
                        .replace(
                          /,angle_guard=0|,frac_guard=0|,rounding=trunc/g,
                          "",
                        )
                        .replace(/data_width=/, "W=")
                        .replace(/n_iter=/, "N=")
                        .replace(/angle_guard=/, "ag=")
                        .replace(/frac_guard=/, "g=")
                        .replace(/rounding=round/, "round")
                        .replace(/,/g, " ")}
                    </td>
                    <td className="px-1">{d.ii}</td>
                    <td className="px-1">
                      {d.seeds.map((s) => fmtInt(s.edges)).join(" / ")}
                    </td>
                    <td className="px-1">{mm}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
      params={
        <Segmented
          label="Design"
          value={String(which)}
          options={cycle.waves.map((v, i) => ({
            value: String(i),
            label: shortName(v),
          }))}
          onChange={(v) => setWhich(Number(v))}
        />
      }
    />
  );
}
