/**
 * Milestone 2's tables: verification per family (RTL in two simulators, gate level, formal),
 * the Vivado measurements against the M1 estimate and the open-source flow, the refit's errors,
 * results.md's "M1 vs M2 at a glance", and what the runs cost three ways. Server Components:
 * every value comes from src/data/ladder.json or src/data/site.json, which scripts/export_dse.py
 * checks against the repository's own tables and text.
 */
import type { ReactNode } from "react";

import { MS_LABEL, ev, runDate, site } from "@/lib/dse/data";
import { ladder, vivadoDesigns } from "@/lib/dse/ladder";
import { designName, fmtInt, signedPct, trim } from "@/lib/format";

import { Prov } from "./Badges";

const TH =
  "border-b border-neutral-300 px-2 py-1.5 text-left align-bottom font-semibold dark:border-neutral-700";
const TD =
  "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-800";
const NOTE = "mt-2 text-xs text-neutral-600 dark:text-neutral-400";

function Scroll({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="focus-ring relative my-4 max-w-full overflow-x-auto rounded"
    >
      {children}
    </div>
  );
}

const FAMILIES = ["iterative", "unrolled_k", "pipelined", "pipelined_m"];

function nameOf(key: string): string {
  const [fam, rest] = key.split(":") as [string, string];
  const p = Object.fromEntries(rest.split(",").map((kv) => kv.split("=")));
  return designName(fam, p);
}

export function VerificationTable(): JSX.Element {
  const l3 = ladder.l3;
  const fm = ladder.formal.rows;
  return (
    <Scroll label="Verification per family">
      <table
        className="w-full min-w-[40rem] text-sm"
        data-testid="verification-table"
      >
        <thead>
          <tr>
            <th className={TH}>Family</th>
            <th className={TH}>RTL configurations (× 2 simulators)</th>
            <th className={TH}>Gate-level runs</th>
            <th className={TH}>Formal proofs (W = 8)</th>
            <th className={TH}>Mismatches</th>
          </tr>
        </thead>
        <tbody>
          {FAMILIES.map((f) => {
            const rows = l3.rows.filter((r) => r.family === f);
            return (
              <tr key={f} data-family={f}>
                <td className={`${TD} font-mono`}>{f}</td>
                <td className={TD}>{l3.per_family[f]!.configs}</td>
                <td className={TD}>{l3.per_family[f]!.gate_runs}</td>
                <td className={TD}>
                  {(["equivalence", "latency"] as const)
                    .map((k) => {
                      const mine = fm.filter(
                        (x) => x.family === f && x.kind === k,
                      );
                      return mine.length
                        ? `${mine.length} ${k}: ${mine.every((x) => x.status === "PASS") ? "PASS" : "FAIL"}`
                        : "";
                    })
                    .filter(Boolean)
                    .join("; ")}
                </td>
                <td className={TD}>
                  {rows.reduce((a, r) => a + r.mismatches, 0)}
                  <Prov kind="exact" />
                </td>
              </tr>
            );
          })}
          <tr className="font-semibold">
            <td className={TD}>all</td>
            <td className={TD}>
              {l3.configs} ({l3.rtl_runs} runs, {fmtInt(l3.rtl_angles)} angles)
            </td>
            <td className={TD}>
              {l3.gate_runs} ({fmtInt(l3.gate_angles)} angles)
            </td>
            <td className={TD}>
              {fm.length}/{fm.length} proved
            </td>
            <td className={TD}>0</td>
          </tr>
        </tbody>
      </table>
      <p className={NOTE}>
        Simulators: {l3.simulators.join(", ")}. Every output code compared with
        the golden model: all 2<sup>W</sup> angles up to W ={" "}
        {l3.max_exhaustive_width}, a dense deduplicated set (up to 131,072
        angles) above. Gate level: {l3.gate_netlist.join("; ")}, zero-delay, not
        the post-route netlist. Formal: {ladder.formal.tools[0]}; equivalence
        proofs show <span className="font-mono">pipelined_m</span> ≡{" "}
        <span className="font-mono">pipelined</span> after latency alignment.
      </p>
    </Scroll>
  );
}

/** A relative error as a whole signed percentage, with no "-0%". */
const err0 = (v: number): string =>
  Math.round(v * 100) === 0 ? "0%" : signedPct(v, 0);

export function VivadoTable(): JSX.Element {
  const l4 = ladder.l4.rows.filter((r) => r.rtl === "generated");
  return (
    <Scroll label="Vivado 2025.2 measurements">
      <table
        className="w-full min-w-[42rem] text-sm"
        data-testid="vivado-table"
      >
        <thead>
          <tr>
            <th className={TH}>Design (generated RTL)</th>
            <th className={TH}>LUT / FF</th>
            <th className={TH}>Fmax MHz: synthesis → route</th>
            <th className={TH}>M1 estimate and its error</th>
            <th className={TH}>Yosys LUT / nextpnr Fmax</th>
          </tr>
        </thead>
        <tbody>
          {vivadoDesigns().map((d) => {
            const e = d.synth.est;
            const y = l4.find((r) => r.key === d.key);
            return (
              <tr key={`${d.batch}|${d.key}`} data-key={d.key}>
                <td className={`${TD} font-mono text-xs`}>
                  {nameOf(d.key)}
                  <span className="block font-sans text-neutral-600 dark:text-neutral-400">
                    batch {d.batch}
                  </span>
                </td>
                <td className={TD}>
                  {fmtInt(d.synth.luts)} / {fmtInt(d.synth.ffs)}
                </td>
                <td className={TD}>
                  {trim(d.synth.fmax_mhz, 4)} → {trim(d.route.fmax_mhz, 4)}
                </td>
                <td className={TD}>
                  {fmtInt(e.luts)} / {fmtInt(e.ffs)} / {trim(e.fmax_mhz, 4)}
                  <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                    {err0(e.luts / d.synth.luts - 1)} /{" "}
                    {err0(e.ffs / d.synth.ffs - 1)} /{" "}
                    {err0(e.fmax_mhz / d.synth.fmax_mhz - 1)}
                  </span>
                </td>
                <td className={TD}>
                  {y ? `${fmtInt(y.luts)} / ${trim(y.fmax_mhz, 4)}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={NOTE}>
        <Prov kind="measured" /> Vivado 2025.2, {ladder.vivado.part}, 10 ns
        clock, Fmax = 1000 / (10 − WNS): post-synthesis (the anchors&apos; flow,
        and so the cost model&apos;s timing scale) and after{" "}
        <span className="font-mono">
          opt_design; place_design; route_design
        </span>
        . W=16 N=14 unless named. M1 estimate <Prov kind="estimate" />: the
        default two-anchor calibration, recomputed with the Python reference;
        its error is estimate ÷ post-synthesis measurement − 1 (LUT / FF /
        Fmax). The Yosys/nextpnr column is the open-source L4 row for the same
        design (post-route, median of three seeds), where one exists.
      </p>
    </Scroll>
  );
}

const TOOL_ROWS = [
  "vivado (generated RTL)",
  "vivado post-route (generated RTL)",
  "yosys+nextpnr-xilinx (generated RTL)",
];

export function RefitTable(): JSX.Element {
  const r = ladder.l5.vivado;
  const pair = (a: number, b: number) => `${a.toFixed(1)} → ${b.toFixed(1)}%`;
  return (
    <Scroll label="Cost-model error before and after the refit">
      <table className="w-full min-w-[40rem] text-sm" data-testid="refit-table">
        <thead>
          <tr>
            <th className={TH}>Tool (points)</th>
            <th className={TH}>LUT RMS error, M1 → refit</th>
            <th className={TH}>FF</th>
            <th className={TH}>Fmax</th>
          </tr>
        </thead>
        <tbody>
          {TOOL_ROWS.map((t) => {
            const b = r.summary_before[t]!;
            const a = r.summary_after[t]!;
            return (
              <tr key={t} data-tool={t}>
                <td className={TD}>
                  {t.replace(" (generated RTL)", "")} ({b.n})
                  {t.includes("post-route") && (
                    <span className="block text-xs">reported, not fitted</span>
                  )}
                </td>
                <td className={TD}>
                  {pair(b.rms_luts_err_pct, a.rms_luts_err_pct)}
                </td>
                <td className={TD}>
                  {pair(b.rms_ffs_err_pct, a.rms_ffs_err_pct)}
                </td>
                <td className={TD}>
                  {pair(b.rms_fmax_err_pct, a.rms_fmax_err_pct)}
                </td>
              </tr>
            );
          })}
          <tr data-tool="loo-vivado">
            <td className={TD}>
              leave-one-out, Vivado ({r.loo_summary["all vivado"]!.n})
            </td>
            <td className={TD}>
              {pair(
                r.loo_summary["all vivado"]!.luts_in,
                r.loo_summary["all vivado"]!.luts_loo,
              )}
            </td>
            <td className={TD}>
              {pair(
                r.loo_summary["all vivado"]!.ffs_in,
                r.loo_summary["all vivado"]!.ffs_loo,
              )}
            </td>
            <td className={TD}>
              {pair(
                r.loo_summary["all vivado"]!.fmax_in,
                r.loo_summary["all vivado"]!.fmax_loo,
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <p className={NOTE}>
        From the repository&apos;s L5 report for the{" "}
        <span className="font-mono">{r.name}</span> refit ({r.n_fit_points}{" "}
        fitted points; one correction factor per tool and metric, Vivado = 1).
        The leave-one-out row is in-sample → out-of-sample on the Vivado points.
        Under the refit, no spec&apos;s ground-truth winner changes, so the
        default cost model stays M1&apos;s and the eval was not re-run.
      </p>
    </Scroll>
  );
}

const SPECS = ["dds_250msps", "low_area_control", "high_precision"];

/** results.md's "M1 vs M2 at a glance": one metric, every method, M1 → M2. */
export function GlanceTable({
  metric,
}: {
  metric: "hv_frac" | "select_regret";
}): JSX.Element {
  const g = site.glance;
  const methods = [
    { id: "nsga2", label: "NSGA-II" },
    { id: "random", label: "Random" },
    ...ev("m2").costs.models.map((m) => ({ id: m.model, label: m.label })),
  ];
  const fmt = (s: { mean: number; std: number }) =>
    metric === "hv_frac"
      ? `${s.mean.toFixed(3)} ± ${s.std.toFixed(3)}`
      : `${signedPct(s.mean)} ± ${(s.std * 100).toFixed(1)}`;
  return (
    <Scroll
      label={`${metric === "hv_frac" ? "Hypervolume" : "Selection regret"}, M1 → M2`}
    >
      <table
        className="w-full min-w-[52rem] text-sm"
        data-testid={`glance-${metric}`}
      >
        <thead>
          <tr>
            <th className={TH}>Spec</th>
            {methods.map((m) => (
              <th key={m.id} className={TH}>
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SPECS.map((s) => (
            <tr key={s} data-spec={s}>
              <td className={`${TD} font-mono`}>{s}</td>
              {methods.map((m) => {
                const [a, b] = g.specs[s]![m.id]![metric];
                return (
                  <td key={m.id} className={TD}>
                    <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                      M1 {fmt(a)}
                    </span>
                    <strong>{fmt(b)}</strong>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={NOTE}>
        Mean ± population standard deviation over seeds ({MS_LABEL.m1}: 3,{" "}
        {MS_LABEL.m2}: 5, in bold), 400 evaluations per run, scored against the
        exhaustive ground truth with the unchanged M1 cost model.{" "}
        {metric === "hv_frac"
          ? "Hypervolume: fraction of the true front's hypervolume the run's feasible designs cover (higher is better)."
          : "Selection regret: how much worse the selected design is than the true optimum on the spec's selection metric (lower is better)."}{" "}
        The repository&apos;s results.md, row for row.
      </p>
    </Scroll>
  );
}

export function SpendTable(): JSX.Element {
  const sp = site.spend;
  return (
    <Scroll label="What the runs cost">
      <table className="w-full min-w-[36rem] text-sm" data-testid="spend-table">
        <thead>
          <tr>
            <th className={TH}>Milestone</th>
            <th className={TH}>Runs</th>
            <th className={TH}>Provider-reported (summaries)</th>
            <th className={TH}>Per-call traces</th>
            <th className={TH}>The key&apos;s usage</th>
          </tr>
        </thead>
        <tbody>
          <tr data-ms="m1">
            <td className={TD}>M1 ({runDate("m1")})</td>
            <td className={TD}>{ev("m1").costs.runs}</td>
            <td className={TD}>${sp.m1.provider_usd.toFixed(4)}</td>
            <td className={TD}>${sp.m1.trace_usd.toFixed(4)}</td>
            <td className={TD}>about ${sp.m1.key_usd_approx.toFixed(1)}</td>
          </tr>
          <tr data-ms="m2">
            <td className={TD}>M2 ({runDate("m2")})</td>
            <td className={TD}>
              {sp.m2.runs} + {sp.m2.pilot_runs} pilot
            </td>
            <td className={TD}>
              ${sp.m2.provider_usd.toFixed(4)} + ${sp.m2.pilot_usd.toFixed(4)}
            </td>
            <td className={TD}>${sp.m2.trace_usd.toFixed(4)}</td>
            <td className={TD}>
              ${sp.m2.key_usd.toFixed(4)} (${sp.m2.key_before_usd.toFixed(4)} →
              ${sp.m2.key_after_usd.toFixed(4)})
            </td>
          </tr>
        </tbody>
      </table>
      <p className={NOTE}>
        <Prov kind="measured" /> OpenRouter. The summaries and the per-call
        traces agree (M1 ${sp.m1.trace_usd.toFixed(4)}; M2 $
        {sp.m2.provider_usd.toFixed(4)} + ${sp.m2.pilot_usd.toFixed(4)} = $
        {sp.m2.trace_usd.toFixed(4)}). In M1, calls that failed inside the
        client reported no usage, so the provider-reported sum undercounts the
        key. M2&apos;s key figure is the difference between two readings of the
        key&apos;s usage recorded before and after the runs (
        <span className="font-mono">key_usage_m2.json</span>); against a spend
        cap of ${sp.m2.cap_usd.toFixed(0)}.
      </p>
    </Scroll>
  );
}
