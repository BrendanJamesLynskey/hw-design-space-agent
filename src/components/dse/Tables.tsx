/**
 * The headline results and the measured LLM costs, as tables. Server Components: every value
 * comes from src/data/site.json, whose rows scripts/export_dse.py checks against the repo's
 * results.md.
 */
import { MS_LABEL, ev, runDate, site, type MsKey } from "@/lib/dse/data";
import { designName, fmtInt, signedPct, trim } from "@/lib/format";

import { Prov } from "./Badges";

const TH =
  "border-b border-neutral-300 px-2 py-1.5 text-left align-bottom font-semibold dark:border-neutral-700";
const TD =
  "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-800";

function Scroll({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
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

const FEASIBLE = ["dds_250msps", "low_area_control", "high_precision"] as const;

/** The headline per feasible spec: M2 (5 seeds), with M1 (3 seeds) beside it. */
export function HeadlineTable(): JSX.Element {
  const g = site.glance;
  return (
    <Scroll label="Headline results per spec, M1 and M2">
      <table
        className="w-full min-w-[44rem] text-sm"
        data-testid="headline-table"
      >
        <thead>
          <tr>
            <th className={TH}>Spec</th>
            <th className={TH}>True best design (exhaustive)</th>
            <th className={TH}>
              Selection regret, M2: best agent / NSGA-II (M1 best agent)
            </th>
            <th className={TH}>
              Front coverage, agent HV ÷ NSGA-II&apos;s: M1 → M2
            </th>
          </tr>
        </thead>
        <tbody>
          {FEASIBLE.map((s) => {
            const gt = site.ground_truth[s]!;
            const sel = gt.selected!;
            const m2 = ev("m2").results[s]!;
            const m1 = ev("m1").results[s]!;
            const best = (rows: typeof m2) =>
              rows
                .filter((r) => r.agent)
                .reduce((a, b) =>
                  (b.regret_mean ?? 9) < (a.regret_mean ?? 9) ? b : a,
                );
            const b2 = best(m2);
            const b1 = best(m1);
            const ns = m2.find((r) => r.method === "nsga2")!;
            const ratios = g.models.map(
              (m) => g.specs[s]![m]!.hv_vs_nsga2_text!,
            );
            const lo = (i: 0 | 1) =>
              Math.min(...ratios.map((r) => Number(r[i])));
            const hi = (i: 0 | 1) =>
              Math.max(...ratios.map((r) => Number(r[i])));
            return (
              <tr key={s} data-spec={s}>
                <td className={`${TD} font-mono`}>{s}</td>
                <td className={TD}>
                  <span className="font-mono">
                    {designName(sel.family, sel.params)}
                  </span>
                  <br />
                  {fmtInt(sel.luts)} LUTs, {trim(sel.throughput_msps)} MSPS
                  <Prov kind="estimate" />, {trim(sel.accuracy_bits, 4)} bits
                  <Prov kind="exact" />
                </td>
                <td className={TD}>
                  <strong>{signedPct(b2.regret_mean!)}</strong> ({b2.label}) /{" "}
                  {signedPct(ns.regret_mean!)}
                  <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                    M1: {signedPct(b1.regret_mean!)} ({b1.label})
                  </span>
                </td>
                <td className={TD}>
                  {lo(0).toFixed(2)}–{hi(0).toFixed(2)} →{" "}
                  <strong>
                    {lo(1).toFixed(2)}–{hi(1).toFixed(2)}
                  </strong>
                  <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                    1.00 = NSGA-II&apos;s hypervolume
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
        Means over seeds (M1: 3, M2: 5), 400 evaluations per run, scored against
        the exhaustive ground truth with the unchanged M1 cost model. Regret:
        how much worse the selected design is than the true optimum on the
        spec&apos;s selection metric (lower is better). Coverage: each of the
        three M2 models&apos; mean hypervolume over NSGA-II&apos;s on the same
        milestone&apos;s seeds (the range over models). Numbers are the
        repository&apos;s results.md rows.
      </p>
    </Scroll>
  );
}

export function CostTable({ ms = "m2" }: { ms?: MsKey }): JSX.Element {
  const costs = ev(ms).costs;
  return (
    <Scroll label={`Measured LLM cost per model, ${MS_LABEL[ms]}`}>
      <table
        className="w-full min-w-[40rem] text-sm"
        data-testid={`cost-table-${ms}`}
      >
        <thead>
          <tr>
            <th className={TH}>Model (OpenRouter ID)</th>
            <th className={TH}>Reasoning</th>
            <th className={TH}>Runs</th>
            <th className={TH}>Tokens in / out</th>
            <th className={TH}>$ per run</th>
            <th className={TH}>$ per spec</th>
            <th className={TH}>$ per evaluated design</th>
            <th className={TH}>Wall-clock per run</th>
          </tr>
        </thead>
        <tbody>
          {costs.models.map((m) => (
            <tr key={m.model} data-model={m.model}>
              <td className={`${TD} font-mono`}>{m.model_id}</td>
              <td className={TD}>{m.reasoning}</td>
              <td className={TD}>{m.runs}</td>
              <td className={TD}>
                {fmtInt(m.input_tokens)} / {fmtInt(m.output_tokens)}
              </td>
              <td className={TD}>
                ${m.cost_per_run.toFixed(4)}
                <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                  ± {m.cost_per_run_std.toFixed(4)}
                </span>
              </td>
              <td className={TD}>${m.cost_per_spec.toFixed(4)}</td>
              <td className={TD}>${m.cost_per_eval.toFixed(6)}</td>
              <td className={TD}>{trim(m.wall_s_mean)} s</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
        <Prov kind="measured" /> {MS_LABEL[ms]}: provider-reported usage and
        cost from OpenRouter, runs of {runDate(ms)}; {costs.runs} runs, $
        {costs.total_usd.toFixed(4)} in total.{" "}
        {ms === "m2"
          ? `The key's own usage rose by $${site.spend.m2.key_usd.toFixed(2)} between the readings taken before and after the M2 runs.`
          : `That undercounts: calls that failed inside the client carry no usage, and the key's usage was about $${site.spend.m1.key_usd_approx.toFixed(1)}.`}{" "}
        &ldquo;Per spec&rdquo; is {ev(ms).seeds} seeds of one spec; &ldquo;per
        evaluated design&rdquo; divides by every evaluation the runs made (every
        one scored by code, none by the LLM). ± is the population standard
        deviation over runs.
      </p>
    </Scroll>
  );
}
