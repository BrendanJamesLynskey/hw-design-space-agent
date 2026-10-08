/**
 * The headline results and the measured LLM costs, as tables. Server Components: every value
 * comes from src/data/site.json, whose rows scripts/export_dse.py checks against the repo's
 * results.md.
 */
import { RUN_DATE, site } from "@/lib/dse/data";
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

export function HeadlineTable(): JSX.Element {
  return (
    <Scroll label="Headline results per spec">
      <table
        className="w-full min-w-[40rem] text-sm"
        data-testid="headline-table"
      >
        <thead>
          <tr>
            <th className={TH}>Spec</th>
            <th className={TH}>True best design (exhaustive)</th>
            <th className={TH}>
              Selection regret: best agent / NSGA-II / random
            </th>
            <th className={TH}>Front coverage (HV): best agent / NSGA-II</th>
          </tr>
        </thead>
        <tbody>
          {FEASIBLE.map((s) => {
            const g = site.ground_truth[s]!;
            const rows = site.results[s]!;
            const agents = rows.filter((r) => r.agent);
            const best = agents.reduce((a, b) =>
              (b.regret_mean ?? 9) < (a.regret_mean ?? 9) ? b : a,
            );
            const bestHv = agents.reduce((a, b) =>
              (b.hv_frac_mean ?? 0) > (a.hv_frac_mean ?? 0) ? b : a,
            );
            const ns = rows.find((r) => r.method === "nsga2")!;
            const rnd = rows.find((r) => r.method === "random")!;
            const sel = g.selected!;
            const agentWinsHv = bestHv.hv_frac_mean! > ns.hv_frac_mean!;
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
                  <strong>{signedPct(best.regret_mean!)}</strong> ({best.label})
                  {" / "}
                  {signedPct(ns.regret_mean!)} / {signedPct(rnd.regret_mean!)}
                </td>
                <td className={TD}>
                  {agentWinsHv ? (
                    <strong>{bestHv.hv_frac_mean!.toFixed(3)}</strong>
                  ) : (
                    bestHv.hv_frac_mean!.toFixed(3)
                  )}{" "}
                  ({bestHv.label}) /{" "}
                  {agentWinsHv ? (
                    ns.hv_frac_mean!.toFixed(3)
                  ) : (
                    <strong>{ns.hv_frac_mean!.toFixed(3)}</strong>
                  )}
                  {!agentWinsHv && (
                    <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                      NSGA-II maps this front better
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
        Mean of 3 seeds, 400 evaluations per run, scored against the exhaustive
        ground truth. Regret: how much worse the selected design is than the
        true optimum on the spec&apos;s selection metric (lower is better). HV:
        fraction of the true front&apos;s hypervolume reached (higher is
        better). Bold marks the better method.
      </p>
    </Scroll>
  );
}

export function CostTable(): JSX.Element {
  return (
    <Scroll label="Measured LLM cost per model">
      <table className="w-full min-w-[40rem] text-sm" data-testid="cost-table">
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
          {site.costs.models.map((m) => (
            <tr key={m.model} data-model={m.model}>
              <td className={`${TD} font-mono`}>{m.model_id}</td>
              <td className={TD}>{m.reasoning}</td>
              <td className={TD}>{m.runs}</td>
              <td className={TD}>
                {fmtInt(m.input_tokens)} / {fmtInt(m.output_tokens)}
              </td>
              <td className={TD}>${m.cost_per_run.toFixed(4)}</td>
              <td className={TD}>${m.cost_per_spec.toFixed(4)}</td>
              <td className={TD}>${m.cost_per_eval.toFixed(6)}</td>
              <td className={TD}>{trim(m.wall_s_mean)} s</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
        <Prov kind="measured" /> Provider-reported usage and cost from
        OpenRouter, runs of {RUN_DATE}; {site.costs.runs} runs, $
        {site.costs.total_usd.toFixed(4)} in total. That undercounts: calls that
        failed inside the client carry no usage, and the key&apos;s usage was
        about $2.5. &ldquo;Per spec&rdquo; is 3 seeds of one spec; &ldquo;per
        evaluated design&rdquo; divides by every evaluation the runs made (every
        one scored by code, none by the LLM).
      </p>
    </Scroll>
  );
}
