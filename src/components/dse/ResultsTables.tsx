/**
 * Results page tables and the fleet timeline. Server Components: every value comes from
 * src/data/site.json, whose rows scripts/export_dse.py checks against the repository's
 * results.md (and whose per-spec costs it checks add up to the per-model totals).
 */
import { RUN_DATE, site, type Selection } from "@/lib/dse/data";
import { fleetSpan, maxConcurrent } from "@/lib/dse/fleet";
import { designName, fmtInt, signedPct, trim } from "@/lib/format";

import { Prov } from "./Badges";

const TH =
  "border-b border-neutral-300 px-2 py-1.5 text-left align-bottom font-semibold dark:border-neutral-700";
const TD =
  "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-800";

function Sel({ s, best }: { s: Selection; best: string | null }): JSX.Element {
  if (!s.key) return <span>seed {s.seed}: none</span>;
  return (
    <span className="block whitespace-nowrap">
      {s.seed}:{" "}
      <span className="font-mono">{designName(s.family!, s.params!)}</span>
      {s.key === best ? (
        <strong> (optimum)</strong>
      ) : s.regret !== null ? (
        ` ${signedPct(s.regret)}`
      ) : (
        ""
      )}
    </span>
  );
}

export function SpecResultsTable({ spec }: { spec: string }): JSX.Element {
  const rows = site.results[spec]!;
  const tables = site.spec_tables[spec]!;
  const gt = site.ground_truth[spec]!;
  const s = site.specs[spec]!;
  const feasible = gt.feasible;
  const best = gt.selected?.key ?? null;
  return (
    <>
      <p className="mt-6 text-sm" data-testid={`results-caption-${spec}`}>
        <span className="font-mono font-semibold">{spec}</span>: {s.description}{" "}
        {feasible ? (
          <>
            True optimum on {s.select_by}:{" "}
            <span className="font-mono">
              {designName(gt.selected!.family, gt.selected!.params)}
            </span>
            .
          </>
        ) : (
          <>
            No design meets it: the fastest of {fmtInt(gt.n_designs)} reaches{" "}
            {trim(gt.best_throughput_msps_any)} MSPS
            <Prov kind="estimate" />.
          </>
        )}
      </p>
      <div
        role="region"
        aria-label={`Results for ${spec}`}
        tabIndex={0}
        className="focus-ring relative my-4 max-w-full overflow-x-auto rounded"
      >
        <table
          className="w-full min-w-[56rem] text-sm"
          data-testid={`results-${spec}`}
        >
          <thead>
            <tr>
              <th className={TH}>Method</th>
              <th className={TH}>Selected design, by seed (regret)</th>
              <th className={TH}>Meets spec</th>
              <th className={TH}>
                {feasible ? "Mean regret" : "Infeasible called"}
              </th>
              <th className={TH}>HV at end</th>
              <th className={TH}>Evals to 95% HV</th>
              <th className={TH}>Evals used</th>
              <th className={TH}>Tokens in / out</th>
              <th className={TH}>$ per run</th>
              <th className={TH}>$ per evaluated design</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const t = tables[r.method]!;
              const ns = rows.find((x) => x.method === "nsga2")!;
              const lostHv =
                feasible &&
                r.agent &&
                (r.hv_frac_mean ?? 0) < (ns.hv_frac_mean ?? 0);
              return (
                <tr key={r.method} data-method={r.method}>
                  <td className={TD}>
                    {r.label}
                    {r.agent ? (
                      <span className="block font-mono text-[0.7rem] text-neutral-600 dark:text-neutral-400">
                        agent
                      </span>
                    ) : (
                      <span className="block font-mono text-[0.7rem] text-neutral-600 dark:text-neutral-400">
                        baseline
                      </span>
                    )}
                  </td>
                  <td className={`${TD} text-xs`}>
                    {feasible
                      ? t.selected.map((x) => (
                          <Sel key={x.seed} s={x} best={best} />
                        ))
                      : "none (correct)"}
                  </td>
                  <td className={TD}>
                    {feasible ? `${r.meets_spec}/${r.runs}` : "n/a"}
                  </td>
                  <td className={TD}>
                    {feasible
                      ? r.regret_text
                      : `${r.infeasibility_correct}/${r.runs}${r.agent ? ` (the LLM declared it: ${r.declared_infeasible_by_llm}/${r.runs})` : " (found nothing feasible)"}`}
                  </td>
                  <td className={TD}>
                    {r.hv_frac_text ?? "n/a"}
                    {lostHv && (
                      <span className="block text-xs font-medium text-orange-800 dark:text-orange-300">
                        below NSGA-II
                      </span>
                    )}
                  </td>
                  <td className={TD}>{r.evals_to_95_text ?? "n/a"}</td>
                  <td className={TD}>{fmtInt(r.evals_mean)}</td>
                  <td className={TD}>
                    {r.agent
                      ? `${fmtInt(t.input_tokens!)} / ${fmtInt(t.output_tokens!)}`
                      : "no LLM"}
                  </td>
                  <td className={TD}>
                    {r.agent ? `$${t.cost_per_run!.toFixed(4)}` : "$0"}
                  </td>
                  <td className={TD}>
                    {r.agent ? `$${t.cost_per_eval!.toFixed(6)}` : "$0"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          3 seeds per method. Regret, HV and evaluations to 95% are the
          repository&apos;s results.md rows; tokens and dollars are this
          spec&apos;s 3 runs, <Prov kind="measured" /> provider-reported
          (OpenRouter, {RUN_DATE}).
        </p>
      </div>
    </>
  );
}

const MODEL_COLOUR: Record<string, string> = {
  "anthropic/claude-sonnet-5.5": "#E69F00",
  "deepseek/deepseek-v4.1-flash": "#0072B2",
  "qwen/qwen3.8-27b": "#009E73",
  "qwen/qwen3.8-27b, reasoning off": "#CC79A7",
};

/** The eval's 48 runs on a timeline: four fleets of agents running at once. */
export function FleetTimeline(): JSX.Element {
  const runs = site.runs;
  const end = fleetSpan(runs);
  const models = site.costs.models;
  const first = runs[0]!.start_utc;
  return (
    <figure
      data-testid="fleet"
      className="my-8 min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <figcaption>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          Measured · the eval of {RUN_DATE}
        </p>
        <p className="mt-1 font-semibold">A fleet of runs</p>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Each bar is one of the {runs.length} scored runs: when it started (its
          run directory&apos;s UTC timestamp, from {first}) and how long it took
          (timed by the eval harness). The harness ran several runs side by
          side: up to {maxConcurrent(runs)} at once. Each run is an independent,
          checkpointed graph, so nothing stops a longer queue running round the
          clock.
        </p>
      </figcaption>
      <div className="mt-3 space-y-3">
        {models.map((m) => {
          const mine = runs.filter((r) => r.model === m.model);
          return (
            <div key={m.model} data-fleet={m.model}>
              <p className="text-xs font-medium">
                {m.label}{" "}
                <span className="font-mono text-neutral-600 dark:text-neutral-400">
                  ({mine.length} runs, {trim(m.wall_s_total / 60)} min of
                  wall-clock)
                </span>
              </p>
              <div className="relative mt-1 h-6 rounded bg-white ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800">
                {mine.map((r) => (
                  <span
                    key={r.id}
                    title={`${r.spec} seed ${r.seed}: ${r.status}, ${trim(r.wall_s)} s, $${r.cost_usd.toFixed(4)}`}
                    className="absolute top-1 h-4 rounded-sm border border-white dark:border-neutral-950"
                    style={{
                      left: `${(r.start_s / end) * 100}%`,
                      width: `${Math.max(0.4, (r.wall_s / end) * 100)}%`,
                      background: MODEL_COLOUR[r.model],
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
        <p className="flex justify-between font-mono text-[0.7rem] text-neutral-600 dark:text-neutral-400">
          <span>0 min</span>
          <span>{trim(end / 120)} min</span>
          <span>{trim(end / 60)} min</span>
        </p>
      </div>
    </figure>
  );
}
