"use client";

/**
 * The code-orchestrated fleet (milestone 4), from one real run's records: Qwen3.8-27B (reasoning
 * off) on asic_power_50msps, after the review fix. Two members, each an unchanged structured
 * graph restricted to one contract class, evaluate in parallel and write every evaluation to a
 * shared LangGraph Store; between the phases code computes per-family lessons, splits the rest
 * of the budget by share of the merged front, and warm-starts each phase-2 study from the
 * Store's front designs of its family; then code merges and selects. Each cell is one recorded
 * evaluation (the members' archived evaluations.csv.gz, rebuilt and checked by
 * scripts/export_m4.py). The last two steps show the paired A/B against the single graph, one
 * dot per (spec, seed) pair.
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Stat } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import {
  FAMILIES,
  abRows,
  fleetCaption,
  fleetFrames,
  m4,
  pFmt,
  written,
  type FleetFrame,
  type FleetRun as Run,
} from "@/lib/dse/m4";
import { fmtInt, trim } from "@/lib/format";
import { FAMILY_COLOUR, OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";

const W = 600;
const COLS = 50;

function Lanes({ run, f }: { run: Run; f: FleetFrame }): JSX.Element {
  const font = useSvgFont(W);
  const narrow = font.narrow;
  const L = narrow ? 0 : 120;
  const cell = (W - L) / COLS;
  const label = narrow ? 18 : 0;
  const gap = 10;
  const heights = run.lanes.map((l) => Math.ceil(l.evals.length / COLS) * cell);
  const tops: number[] = [];
  let y = 4;
  for (const h of heights) {
    tops.push(y + label);
    y += label + h + gap;
  }
  const H = y;
  const merge = f.phase === "merge";
  return (
    <svg
      ref={font.ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={`Fleet members' evaluations: ${f.done.join(", ")} shown`}
    >
      {run.lanes.map((lane, i) => {
        const top = tops[i]!;
        const m = run.members.find(
          (x) => x.member === lane.member && x.phase === lane.phase,
        )!;
        return (
          <g
            key={`${lane.member}-${lane.phase}`}
            data-lane={`${lane.member}-p${lane.phase}`}
            data-done={f.done[i]}
          >
            <text
              x={narrow ? 0 : L - 8}
              y={narrow ? top - 5 : top + 10}
              textAnchor={narrow ? "start" : "end"}
              fontSize={font.fs(11)}
              fontWeight={600}
              fill="currentColor"
            >
              {lane.member}, phase {lane.phase}
            </text>
            {!narrow && (
              <text
                x={L - 8}
                y={top + 24}
                textAnchor="end"
                fontSize={font.fs(9)}
                fill="currentColor"
              >
                {m.budget} evals
                {m.llm_declared_infeasible ? ", infeasible" : ""}
              </text>
            )}
            {lane.evals.map((e, j) => {
              const on = j < f.done[i]!;
              const x = L + (j % COLS) * cell;
              const yy = top + Math.floor(j / COLS) * cell;
              const fam = FAMILIES[e[0]]!;
              const front = merge && e[3] === 1;
              return (
                <rect
                  key={j}
                  x={x + 1}
                  y={yy + 1}
                  width={cell - 2}
                  height={cell - 2}
                  rx={1.5}
                  fill={on && e[1] ? FAMILY_COLOUR[fam] : "transparent"}
                  stroke={
                    front ? "currentColor" : on ? FAMILY_COLOUR[fam] : "#d4d4d4"
                  }
                  strokeWidth={front ? 2 : 0.8}
                  strokeDasharray={on ? undefined : "2 2"}
                  data-front={front ? "true" : undefined}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function PairDots({
  metric,
}: {
  metric: "hv_frac" | "select_regret";
}): JSX.Element {
  const font = useSvgFont(W);
  const narrow = font.narrow;
  const rows = abRows();
  const L = narrow ? 8 : 190;
  const R = narrow ? 8 : 130;
  const rowH = narrow ? 50 : 34;
  const label = narrow ? 16 : 0;
  const M = { t: 10, b: 30 };
  const H = M.t + M.b + rows.length * (rowH + label);
  const [lo, hi] = metric === "hv_frac" ? [-0.4, 0.2] : [-1, 1];
  const sx = (v: number) =>
    L + ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * (W - L - R);
  const ticks =
    metric === "hv_frac" ? [-0.4, -0.2, 0, 0.2] : [-1, -0.5, 0, 0.5, 1];
  return (
    <svg
      ref={font.ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      data-metric={metric}
      aria-label={`Paired differences, fleet minus single graph, ${metric === "hv_frac" ? "hypervolume fraction" : "selection regret"}`}
    >
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={sx(v)}
            x2={sx(v)}
            y1={M.t}
            y2={H - M.b}
            stroke="currentColor"
            strokeOpacity={v === 0 ? 0.7 : 0.12}
          />
          <text
            x={sx(v)}
            y={H - M.b + 14}
            textAnchor="middle"
            fontSize={font.fs(10)}
            fill="currentColor"
          >
            {metric === "hv_frac" ? v : `${v * 100}`}
          </text>
        </g>
      ))}
      <text
        x={(L + W - R) / 2}
        y={H - 2}
        textAnchor="middle"
        fontSize={font.fs(10)}
        fill="currentColor"
      >
        {metric === "hv_frac"
          ? "fleet − single, HV fraction (left: fleet maps less)"
          : "fleet − single, regret in points (left: fleet picks better)"}
      </text>
      {rows.map((r, i) => {
        const top = M.t + i * (rowH + label);
        const y0 = top + label;
        const pairs = m4.ab.pairs[r.key]![metric];
        const t = r.test[metric];
        const better = metric === "hv_frac" ? t.pos : t.neg;
        const word = metric === "hv_frac" ? "higher" : "better";
        return (
          <g key={r.key} data-row={r.key} data-n={pairs.length}>
            <text
              x={narrow ? L : L - 8}
              y={narrow ? top + 12 : y0 + rowH / 2 + 4}
              textAnchor={narrow ? "start" : "end"}
              fontSize={font.fs(10)}
              fill="currentColor"
            >
              {r.label}
              {narrow
                ? `: ${better}/${t.n} ${word}, p = ${pFmt(t.sign_p)}`
                : ""}
            </text>
            {pairs.map((p, k) => (
              <circle
                key={k}
                cx={sx(p.d)}
                cy={y0 + 6 + ((k * 7) % (rowH - 12))}
                r={3.2}
                fill={
                  (metric === "hv_frac" ? p.d > 0 : p.d < 0)
                    ? OKABE_ITO.green
                    : p.d === 0
                      ? "#8c8c8c"
                      : OKABE_ITO.vermillion
                }
                fillOpacity={0.85}
              />
            ))}
            {!narrow && (
              <text
                x={W - R + 6}
                y={y0 + rowH / 2 + 4}
                fontSize={font.fs(10)}
                fill="currentColor"
              >
                {better}/{t.n} {word}, p = {pFmt(t.sign_p)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function FleetRun({ run }: { run: Run }): JSX.Element {
  const frames = useMemo(() => fleetFrames(run), [run]);
  const stepper = useStepper(frames.length, { stepMs: 1300 });
  const f = frames[stepper.step]!;
  const ab = f.phase === "ab-hv" || f.phase === "ab-regret";
  const after = ["lessons", "split", "seed", "p2", "merge"].includes(f.phase);
  return (
    <AnimationPanel
      title="The fleet: two graphs, one Store, code in between"
      summary={
        <>
          A real fleet run ({run.model}, {run.spec}, seed {run.seed}), from its
          members&apos; recorded evaluations; then the paired A/B against the
          single graph. Filled cells met the spec <Prov kind="estimate" />; LLM
          cost <Prov kind="measured" />.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={fleetCaption(f, run)}
      testId="fleet-widget"
      visual={
        <div className="min-w-0" data-phase={f.phase}>
          {ab ? (
            <PairDots
              metric={f.phase === "ab-hv" ? "hv_frac" : "select_regret"}
            />
          ) : (
            <>
              <div
                className="mb-2 flex flex-wrap gap-2 text-[0.7rem]"
                aria-label="Families"
              >
                {FAMILIES.map((fam) => (
                  <span key={fam} className="inline-flex items-center gap-1">
                    <span
                      aria-hidden
                      className="inline-block size-3 rounded-sm"
                      style={{ background: FAMILY_COLOUR[fam] }}
                    />
                    <span className="font-mono">{fam}</span>
                  </span>
                ))}
              </div>
              <Lanes run={run} f={f} />
              {after && (
                <table
                  className="mt-2 w-full text-xs"
                  data-testid="fleet-lessons"
                >
                  <caption className="text-left text-[0.7rem] text-neutral-600 dark:text-neutral-400">
                    Lessons, written by code to the Store after phase 1
                  </caption>
                  <thead>
                    <tr>
                      <th className="text-left font-semibold">Family</th>
                      <th className="text-left font-semibold">Evaluated</th>
                      <th className="text-left font-semibold">Feasible</th>
                      <th className="text-left font-semibold">On the front</th>
                      <th className="text-left font-semibold">Phase-2 seeds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(run.lessons).map(([fam, v]) => (
                      <tr key={fam}>
                        <td className="font-mono">{fam}</td>
                        <td>{v.evaluations}</td>
                        <td>{v.feasible}</td>
                        <td>
                          {v.on_merged_front}/{v.merged_front_size}
                        </td>
                        <td>
                          {["seed", "p2", "merge"].includes(f.phase)
                            ? (run.seeds[fam]?.length ?? 0)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      }
      stats={
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Written to the Store" value={fmtInt(written(f))} />
          <Stat
            label="Phase-2 split"
            value={
              ["start", "p1", "lessons"].includes(f.phase)
                ? "—"
                : Object.entries(run.phase2_budgets)
                    .map(([m, v]) => `${m} ${v}`)
                    .join(" · ")
            }
          />
          <Stat
            label="Selected"
            value={
              f.phase === "merge" || ab
                ? `PI ${trim(run.selected_value, 3)} (+${(run.regret * 100).toFixed(1)}%)`
                : "—"
            }
            hint="regret vs the true winner"
          />
          <Stat
            label="LLM cost, this run"
            value={`$${run.cost_usd.toFixed(4)}`}
            hint="measured, provider-reported"
          />
        </div>
      }
    />
  );
}
