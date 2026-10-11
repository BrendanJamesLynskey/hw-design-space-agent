"use client";

/**
 * FPGA against ASIC, from the exhaustive ground truth of milestone 4's three ASIC specs and
 * their FPGA twins (the same constraints with area in LUTs + FFs). First the family ranking on
 * asic_low_area (the same order on both targets, smaller gaps on sky130), then, on the two
 * pipelined specs, every pipelining depth m of each target's winner on both targets: the clock
 * (or the simulated batch latency) against the constraint, and which depth wins. Every value
 * comes from src/data/m4.json (scripts/export_m4.py: the reference's cost models at the vendored
 * commit, checked against the committed ground truth).
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { useSvgFont } from "@/components/viz/useSvgFont";
import {
  asicCaption,
  asicFrames,
  rankedFamilies,
  type AsicFrame,
  type AsicSpec,
  type SweepPoint,
} from "@/lib/dse/m4";
import { fmtInt, trim } from "@/lib/format";
import { FAMILY_COLOUR, OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 300;

type Target = "asic" | "fpga";

const TARGET: Record<Target, string> = {
  asic: "sky130 (sky130_fd_sc_hd)",
  fpga: "FPGA twin (Artix-7)",
};

function RankPanel({
  spec,
  target,
  shown,
}: {
  spec: AsicSpec;
  target: Target;
  shown: number;
}): JSX.Element {
  const font = useSvgFont(W);
  const rowH = 30;
  const M = { l: 92, r: 46, t: 24, b: 10 };
  const H = M.t + M.b + spec.families.length * rowH;
  const max = Math.max(
    ...spec.families.map((f) => Math.max(f.asic_ratio ?? 0, f.fpga_ratio ?? 0)),
  );
  const sx = (v: number) => M.l + (v / max) * (W - M.l - M.r);
  return (
    <svg
      ref={font.ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      data-panel={target}
      aria-label={`${TARGET[target]}: each family's best design as a multiple of the winner, ${shown} of ${spec.families.length} shown`}
    >
      <text
        x={0}
        y={14}
        fontSize={font.fs(11)}
        fontWeight={600}
        fill="currentColor"
      >
        {TARGET[target]}
      </text>
      <line
        x1={sx(1)}
        x2={sx(1)}
        y1={M.t - 2}
        y2={H - M.b}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeDasharray="3 3"
      />
      {rankedFamilies(spec).map((f, i) => {
        const r = target === "asic" ? f.asic_ratio : f.fpga_ratio;
        const on = i < shown;
        const y = M.t + i * rowH;
        return (
          <g key={f.family} data-family={f.family} opacity={on ? 1 : 0.15}>
            <text
              x={M.l - 6}
              y={y + rowH / 2 + 4}
              textAnchor="end"
              fontSize={font.fs(10)}
              fill="currentColor"
            >
              {f.family}
            </text>
            {r !== null && (
              <>
                <rect
                  x={M.l}
                  y={y + 6}
                  width={on ? sx(r) - M.l : 0}
                  height={rowH - 12}
                  fill={FAMILY_COLOUR[f.family]}
                />
                {on && (
                  <text
                    x={sx(r) + 4}
                    y={y + rowH / 2 + 4}
                    fontSize={font.fs(10)}
                    fill="currentColor"
                  >
                    {trim(r, 3)}×
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function SweepPanel({
  spec,
  target,
  f,
}: {
  spec: AsicSpec;
  target: Target;
  f: AsicFrame;
}): JSX.Element {
  const font = useSvgFont(W);
  const pts: SweepPoint[] = spec.sweeps![target];
  const sysLim = spec.constraints.find((c) => c.metric === "sys_p99_batch_us");
  const rateLim = spec.constraints.find((c) => c.metric === "throughput_msps")!;
  const latency = !!sysLim;
  // latency: p99 µs on a clipped axis; rate: MSPS (one result per cycle, so = Fmax)
  const hi = latency ? 1.2 : 180;
  const val = (p: SweepPoint) => (latency ? p.p99_us! : p.throughput_msps);
  const lim = latency ? sysLim!.value : rateLim.value;
  const rowH = 26;
  const M = { l: 40, r: 74, t: 30, b: 26 };
  const H = M.t + M.b + pts.length * rowH;
  const sx = (v: number) => M.l + (Math.min(v, hi) / hi) * (W - M.l - M.r);
  const win = target === "asic" ? spec.winner_m : spec.twin_m;
  const unit = target === "asic" ? "µm²" : "LUT+FF";
  return (
    <svg
      ref={font.ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      data-panel={target}
      aria-label={`${TARGET[target]}: ${latency ? "simulated p99 batch latency" : "throughput"} for m=2 to 8, ${f.shown} shown`}
    >
      <text
        x={0}
        y={14}
        fontSize={font.fs(11)}
        fontWeight={600}
        fill="currentColor"
      >
        {TARGET[target]}
      </text>
      <line
        x1={sx(lim)}
        x2={sx(lim)}
        y1={M.t - 6}
        y2={H - M.b}
        stroke={OKABE_ITO.vermillion}
        strokeWidth={2}
      />
      <text
        x={sx(lim)}
        y={H - M.b + 14}
        textAnchor="middle"
        fontSize={font.fs(10)}
        fill={OKABE_ITO.vermillion}
      >
        {latency ? `≤ ${lim} µs` : `≥ ${lim} MSPS`}
      </text>
      {pts.map((p, i) => {
        const on = i < f.shown;
        const y = M.t + i * rowH;
        const winner = f.phase !== "sweep" && p.m === win;
        const v = val(p);
        return (
          <g
            key={p.m}
            data-m={p.m}
            data-feasible={p.feasible ? "true" : "false"}
            data-winner={winner ? "true" : "false"}
            opacity={on ? 1 : 0.15}
          >
            <text
              x={M.l - 6}
              y={y + rowH / 2 + 4}
              textAnchor="end"
              fontSize={font.fs(10)}
              fill="currentColor"
              fontWeight={winner ? 700 : 400}
            >
              m={p.m}
            </text>
            <rect
              x={M.l}
              y={y + 5}
              width={on ? Math.max(1, sx(v) - M.l) : 0}
              height={rowH - 10}
              fill={p.feasible ? FAMILY_COLOUR.pipelined_m : "transparent"}
              stroke={winner ? "currentColor" : FAMILY_COLOUR.pipelined_m}
              strokeWidth={winner ? 2.5 : 1}
              strokeDasharray={p.feasible ? undefined : "3 2"}
            />
            {on && (
              <text
                x={W - M.r + 4}
                y={y + rowH / 2 + 4}
                fontSize={font.fs(9)}
                fill="currentColor"
              >
                {latency && v > hi ? `${trim(v, 3)} µs` : ""}
                {latency && v > hi ? " " : ""}
                {p.feasible ? "✓" : "✗"}{" "}
                {spec.select_by === "power_index"
                  ? trim(p.select, 3)
                  : fmtInt(p.select)}
                {winner ? " ★" : ""}
              </text>
            )}
          </g>
        );
      })}
      <text
        x={W - M.r + 4}
        y={M.t - 8}
        fontSize={font.fs(9)}
        fill="currentColor"
      >
        {spec.select_by === "power_index" ? "power idx" : unit}
      </text>
    </svg>
  );
}

export default function AsicTargets({
  specs,
}: {
  specs: AsicSpec[];
}): JSX.Element {
  const frames = useMemo(() => asicFrames(specs), [specs]);
  const stepper = useStepper(frames.length, { stepMs: 1600 });
  const f = frames[stepper.step]!;
  const spec = specs.find((s) => s.name === f.spec)!;
  const show: AsicSpec =
    f.phase === "summary" ? specs.find((s) => s.sweeps)! : spec;
  const latency = show.constraints.some((c) => c.metric === "sys_p99_batch_us");
  return (
    <AnimationPanel
      title="FPGA or ASIC: the same spec, two targets"
      summary={
        <>
          Three ASIC specs, each with an FPGA twin (the same constraints, area
          in LUT+FF), scored over all 635,040 designs by each target&apos;s cost
          model <Prov kind="estimate" />; the batch latency is simulated{" "}
          <Prov kind="simulated" />.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={asicCaption(f, specs)}
      testId="asic-widget"
      visual={
        <div className="min-w-0" data-spec={f.spec} data-phase={f.phase}>
          <p className="mb-2 font-mono text-xs" data-testid="asic-spec">
            {f.phase === "summary" ? "all three specs" : spec.name}
            {f.phase === "rank"
              ? ": each family's best design, × the winner"
              : f.phase === "summary"
                ? ""
                : latency
                  ? ": p99 batch latency at each depth m (axis clipped at 1.2 µs)"
                  : ": throughput at each depth m"}
          </p>
          {f.phase === "summary" ? (
            <table className="w-full text-xs" data-testid="asic-summary">
              <thead>
                <tr>
                  <th className="text-left font-semibold">Spec</th>
                  <th className="text-left font-semibold">Ranking (both)</th>
                  <th className="text-left font-semibold">sky130 winner</th>
                  <th className="text-left font-semibold">FPGA winner</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((s) => (
                  <tr key={s.name}>
                    <td className="font-mono">{s.name}</td>
                    <td>{s.ranking.join(" < ")}</td>
                    <td>
                      {s.winner_m ? `m=${s.winner_m}` : s.winner.split(":")[0]}
                    </td>
                    <td>
                      {s.twin_m ? `m=${s.twin_m}` : s.twin_winner.split(":")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              {(["asic", "fpga"] as Target[]).map((t) =>
                f.phase === "rank" ? (
                  <RankPanel key={t} spec={spec} target={t} shown={f.shown} />
                ) : (
                  <SweepPanel key={t} spec={spec} target={t} f={f} />
                ),
              )}
            </div>
          )}
          <p className="mt-2 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            Filled: meets the spec; dashed: does not; ★ the target&apos;s
            winner. Right-hand numbers: the spec&apos;s selection metric. The
            ASIC numbers are an open-PDK, post-synthesis estimate, not silicon.
          </p>
        </div>
      }
    />
  );
}
