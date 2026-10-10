/**
 * Milestone 3's tables (Results, How it works). Server Components: every value comes from
 * src/data/m3.json, whose rows scripts/export_m3.py re-makes from the vendored summaries and
 * checks against the repo's results.md and README.
 */
import { m3, sysSpec, type Stat } from "@/lib/dse/m3";
import { designName, fmtInt, fmtUsd, signedPct, trim } from "@/lib/format";

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

const name = (key: string): string => {
  const [fam, rest] = key.split(":") as [string, string];
  const p = Object.fromEntries(rest.split(",").map((kv) => kv.split("=")));
  return designName(fam, p as Record<string, string>);
};

const f3 = (s: Stat | null): string =>
  s ? `${s.mean.toFixed(3)} ± ${s.std.toFixed(3)}` : "—";
const pctS = (s: Stat | null): string =>
  s ? `${signedPct(s.mean)} ± ${(s.std * 100).toFixed(1)}` : "—";
const arrow = (a: string, b: string) => (
  <>
    {a} → <strong>{b}</strong>
  </>
);

/** The system specs: three views of the exhaustive ground truth, plus the peak-rate view. */
export function SystemSpecsTable(): JSX.Element {
  return (
    <Scroll label="System specs: ground truth in four views">
      <table
        className="w-full min-w-[46rem] text-sm"
        data-testid="system-specs-table"
      >
        <thead>
          <tr>
            <th className={TH}>Spec and its system</th>
            <th className={TH}>
              Feasible designs: simulated / L1 bound / MSPS-only
            </th>
            <th className={TH}>Winner, simulated (LUT+FF)</th>
            <th className={TH}>L1-bound winner</th>
            <th className={TH}>MSPS-only winner (average rate)</th>
            <th className={TH}>Peak-rate floor</th>
          </tr>
        </thead>
        <tbody>
          {m3.ground_truth.specs.map((s) => (
            <tr key={s.name} data-spec={s.name}>
              <td className={TD}>
                <span className="font-mono">{s.name}</span>
                {!s.eval && " (ground truth only)"}
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  {s.system}
                </div>
              </td>
              <td className={TD}>
                {fmtInt(s.n_feasible)} / {fmtInt(s.n_feasible_l1_bound)} /{" "}
                {fmtInt(s.n_feasible_msps_only)}
              </td>
              <td className={TD}>
                <span className="font-mono text-xs">{name(s.true.key)}</span> (
                {fmtInt(s.true.luts_plus_ffs)})
                <Prov kind="simulated" />
              </td>
              <td className={TD}>
                <span className="font-mono text-xs">{name(s.bound.key)}</span> (
                {fmtInt(s.bound.luts_plus_ffs)})
              </td>
              <td className={TD}>
                <span className="font-mono text-xs">
                  {name(s.msps_only.key)}
                </span>{" "}
                ({fmtInt(s.msps_only.luts_plus_ffs)})
                {s.winner_changes ? (
                  <div className="text-xs font-semibold">winner changes</div>
                ) : (
                  <div className="text-xs">same winner</div>
                )}
              </td>
              <td className={TD}>
                {s.peak_rate ? (
                  <>
                    ≥ {trim(s.peak_rate.floor_msps, 3)} MSPS:{" "}
                    <span className="font-mono text-xs">
                      {name(s.peak_rate.winner)}
                    </span>{" "}
                    ({fmtInt(s.peak_rate.winner_luts_plus_ffs)}),{" "}
                    {fmtInt(s.peak_rate.n_feasible)} feasible
                    <div className="text-xs">
                      {s.peak_rate.winner === s.true.key
                        ? "= the simulated winner"
                        : "≠ the simulated winner"}
                    </div>
                  </>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The structured graph and the baselines on one system spec (5 seeds). */
export function M3StructuredTable({ spec }: { spec: string }): JSX.Element {
  const rows = m3.structured[spec]!;
  const gt = sysSpec(spec);
  return (
    <Scroll label={`${spec}: structured graph and baselines, 5 seeds`}>
      <table
        className="w-full min-w-[40rem] text-sm"
        data-testid={`m3-structured-${spec}`}
      >
        <caption className="mb-1 text-left text-sm font-semibold">
          <span className="font-mono">{spec}</span>: true winner{" "}
          <span className="font-mono">{name(gt.true.key)}</span> (
          {fmtInt(gt.true.luts_plus_ffs)} LUT+FF)
        </caption>
        <thead>
          <tr>
            <th className={TH}>Method</th>
            <th className={TH}>HV fraction</th>
            <th className={TH}>Selection regret (optimal)</th>
            <th className={TH}>Selected design meets the spec (simulated)</th>
            <th className={TH}>L2 changed the L1 pick</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.method} data-method={r.method}>
              <td className={TD}>
                {r.agent ? `structured: ${r.label}` : `${r.label} + L2 step`}
              </td>
              <td className={TD}>{r.hv_text}</td>
              <td className={TD}>{r.regret_text}</td>
              <td className={TD}>
                {r.meets_spec}/{r.runs}
              </td>
              <td className={TD}>
                {r.l2_changed === null ? "—" : `${r.l2_changed}/${r.runs}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The A/B per model: pooled HV and regret, cost, tokens, wall-clock and failures. */
export function AbTable(): JSX.Element {
  const ab = m3.ab;
  return (
    <Scroll label="A/B per model: structured graph against the campaign agent">
      <table className="w-full min-w-[52rem] text-sm" data-testid="ab-table">
        <thead>
          <tr>
            <th className={TH}>Model (specs in both arms)</th>
            <th className={TH}>Runs</th>
            <th className={TH}>HV, mean of the feasible specs</th>
            <th className={TH}>Regret, same</th>
            <th className={TH}>
              Cost / run <Prov kind="measured" />
            </th>
            <th className={TH}>Input tokens / run</th>
            <th className={TH}>Wall-clock / run</th>
            <th className={TH}>Failed campaigns</th>
          </tr>
        </thead>
        <tbody>
          {ab.costs.map((c) => {
            const p = ab.pooled[c.model]!;
            return (
              <tr key={c.model} data-model={c.model}>
                <td className={TD}>
                  {c.label}
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    {c.specs.length === 1
                      ? `${c.specs[0]} only`
                      : `all ${c.specs.length} specs`}
                  </div>
                </td>
                <td className={TD}>
                  {c.runs[0]} → {c.runs[1]}
                </td>
                <td className={TD}>
                  {arrow(p.hv[0].toFixed(3), p.hv[1].toFixed(3))}
                </td>
                <td className={TD}>
                  {arrow(signedPct(p.regret[0]), signedPct(p.regret[1]))}
                </td>
                <td className={TD}>
                  {arrow(
                    `$${c.cost_usd[0].mean.toFixed(4)}`,
                    `$${c.cost_usd[1].mean.toFixed(4)}`,
                  )}{" "}
                  ({trim(c.cost_ratio, 3)}×)
                </td>
                <td className={TD}>
                  {arrow(
                    fmtInt(c.input_tokens[0].mean),
                    fmtInt(c.input_tokens[1].mean),
                  )}{" "}
                  ({trim(c.input_ratio, 2)}×)
                </td>
                <td className={TD}>
                  {arrow(
                    `${trim(c.wall_s[0].mean, 3)} s`,
                    `${trim(c.wall_s[1].mean, 3)} s`,
                  )}
                </td>
                <td className={TD}>
                  {c.failures[0]}/{c.runs[0]} →{" "}
                  <strong>
                    {c.failures[1]}/{c.runs[1]}
                  </strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Scroll>
  );
}

const METRIC_TITLE = {
  hv_frac: "HV fraction",
  select_regret: "Selection regret",
  n_evals: "L1 evaluations used",
} as const;

/** The A/B per spec and model for one metric (structured → campaign). */
export function AbSpecTable({
  metric,
}: {
  metric: keyof typeof METRIC_TITLE;
}): JSX.Element {
  const ab = m3.ab;
  return (
    <Scroll label={`A/B per spec: ${METRIC_TITLE[metric]}`}>
      <table
        className="w-full min-w-[44rem] text-sm"
        data-testid={`ab-spec-${metric}`}
      >
        <caption className="mb-1 text-left text-sm font-semibold">
          {METRIC_TITLE[metric]}, structured → campaign (mean ± std over 5
          seeds)
        </caption>
        <thead>
          <tr>
            <th className={TH}>Spec</th>
            {ab.models.map((m) => (
              <th key={m} className={TH}>
                {ab.labels[m]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ab.specs.map((s) => (
            <tr key={s}>
              <td className={`${TD} font-mono`}>{s}</td>
              {ab.models.map((m) => {
                const c = ab.cells[metric][s]![m]!;
                return (
                  <td key={m} className={TD}>
                    {arrow(
                      metric === "select_regret"
                        ? pctS(c.structured)
                        : metric === "hv_frac"
                          ? c.structured
                            ? f3(c.structured)
                            : c.structured_text
                          : c.structured_text,
                      metric === "select_regret"
                        ? pctS(c.campaign)
                        : metric === "hv_frac"
                          ? c.campaign
                            ? f3(c.campaign)
                            : c.campaign_text
                          : c.campaign_text,
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** What the campaign agent did: its tool calls, and what the ladder's tools had to say. */
export function CampaignToolsTable(): JSX.Element {
  const ab = m3.ab;
  const n = ab.campaigns;
  const L = ab.ladder;
  const rows: [string, string][] = [
    [
      "one run_dse(400) call to the structured graph, nothing else at L1",
      `${ab.single_run_dse} of ${n}`,
    ],
    [
      "explore_family (its own NSGA-II study)",
      `${ab.tools.explore_family} of ${n}`,
    ],
    ["simulate_system (L2)", `${ab.tools.simulate_system} of ${n}`],
    [
      "verify_rtl (L3): a recorded L3 row / a fresh run / nothing to verify",
      `${L.verify_recorded} / ${L.verify_fresh} / ${L.verify_not} of ${L.verify_called}`,
    ],
    [
      "synthesize (L4, recorded data only): measurements found",
      `${L.synth_recorded} of ${L.synth_called}`,
    ],
    [
      "back_annotate (L5): compared with measured data",
      `${L.annotate_compared} of ${L.annotate_called}`,
    ],
    ["reexplore (the L5 loop)", `${ab.tools.reexplore} of ${n}`],
    [
      "L2 changed the selection (structured / campaign)",
      `${ab.l2_reselect.structured[0]}/${ab.l2_reselect.structured[1]} / ${ab.l2_reselect.campaign[0]}/${ab.l2_reselect.campaign[1]}`,
    ],
  ];
  return (
    <Scroll label="What the campaign agent did">
      <table className="w-full text-sm" data-testid="campaign-tools-table">
        <thead>
          <tr>
            <th className={TH}>In the {n} A/B campaigns</th>
            <th className={TH}>Campaigns</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td className={TD}>{k}</td>
              <td className={TD}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** Memory on vs off: one model, the fixed spec sequence, seeds 0–2. */
export function MemoryTable(): JSX.Element {
  const mem = m3.memory;
  return (
    <Scroll label="Memory on against off">
      <table
        className="w-full min-w-[40rem] text-sm"
        data-testid="memory-table"
      >
        <caption className="mb-1 text-left text-sm font-semibold">
          {mem.label}, seeds {mem.rows[0]!.seeds.join(", ")}: off → on
        </caption>
        <thead>
          <tr>
            <th className={TH}>Spec (position in the sequence)</th>
            <th className={TH}>HV fraction</th>
            <th className={TH}>Selection regret</th>
            <th className={TH}>Cost / run</th>
          </tr>
        </thead>
        <tbody>
          {mem.rows.map((r) => (
            <tr key={r.spec}>
              <td className={TD}>
                <span className="font-mono">{r.spec}</span> ({r.position}
                {r.position === 1 ? ", empty store in both" : ""})
              </td>
              <td className={TD}>
                {arrow(f3(r.hv_frac[0]), f3(r.hv_frac[1]))}
              </td>
              <td className={TD}>
                {arrow(pctS(r.select_regret[0]), pctS(r.select_regret[1]))}
              </td>
              <td className={TD}>
                {arrow(
                  `$${r.cost_usd[0].mean.toFixed(4)}`,
                  `$${r.cost_usd[1].mean.toFixed(4)}`,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The map_front fix, offline on the 60 recorded M2 decisions: gated and unconditional. */
export function LeversTable(): JSX.Element {
  const L = m3.levers;
  const llm = (rows: typeof L.fix) =>
    rows.filter((r) => r.driver.startsWith("LLM") && r.hv[0] !== "n/a");
  const all = llm(L["fix-all"]);
  return (
    <Scroll label="The map_front fix on the recorded M2 decisions">
      <table
        className="w-full min-w-[40rem] text-sm"
        data-testid="levers-table"
      >
        <caption className="mb-1 text-left text-sm font-semibold">
          LLM replays (3 models × 5 seeds), HV / regret
        </caption>
        <thead>
          <tr>
            <th className={TH}>Spec</th>
            <th className={TH}>M2 levers</th>
            <th className={TH}>Fix, unconditional</th>
            <th className={TH}>Fix, gated (LEVERS_M3)</th>
            <th className={TH}>Selections changed: unconditional / gated</th>
          </tr>
        </thead>
        <tbody>
          {llm(L.fix).map((r) => {
            const u = all.find((x) => x.spec === r.spec)!;
            return (
              <tr key={r.spec}>
                <td className={`${TD} font-mono`}>{r.spec}</td>
                <td className={TD}>
                  {r.hv[0]} / {r.regret[0]}
                </td>
                <td className={TD}>
                  {u.hv[1]} / {u.regret[1]}
                </td>
                <td className={TD}>
                  {r.hv[1]} / {r.regret[1]}
                </td>
                <td className={TD}>
                  {u.changed} / {r.changed} of {r.runs}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Scroll>
  );
}

/** What M3 cost: the key's readings, the ledger by arm and the traces. */
export function M3SpendTable(): JSX.Element {
  const s = m3.spend;
  return (
    <Scroll label="What M3 cost">
      <table className="w-full text-sm" data-testid="m3-spend-table">
        <thead>
          <tr>
            <th className={TH}>Ledger entry (provider-reported)</th>
            <th className={TH}>Runs</th>
            <th className={TH}>
              USD <Prov kind="measured" />
            </th>
          </tr>
        </thead>
        <tbody>
          {s.ledger.map((r) => (
            <tr key={r.entry}>
              <td className={TD}>{r.entry}</td>
              <td className={TD}>{r.runs}</td>
              <td className={TD}>{r.usd.toFixed(4)}</td>
            </tr>
          ))}
          <tr>
            <td className={`${TD} font-semibold`}>ledger total</td>
            <td className={TD}>{s.ledger_entries}</td>
            <td className={`${TD} font-semibold`}>
              {s.ledger_total_usd.toFixed(4)}
            </td>
          </tr>
          <tr>
            <td className={TD}>
              the archived traces&apos; per-call cost ({fmtInt(s.trace_calls)}{" "}
              calls in {s.trace_runs} runs; the ledger also has the{" "}
              {s.rerun_entries} interrupted or lost runs that were re-run,{" "}
              {fmtUsd(s.rerun_usd)})
            </td>
            <td className={TD}>—</td>
            <td className={TD}>{s.trace_usd.toFixed(4)}</td>
          </tr>
          <tr>
            <td className={`${TD} font-semibold`}>
              the key&apos;s usage, {s.key_start_ts.replace("T", " ")} →{" "}
              {s.key_end_ts.replace("T", " ")} (authoritative)
            </td>
            <td className={TD}>—</td>
            <td className={`${TD} font-semibold`}>{s.key_usd.toFixed(4)}</td>
          </tr>
        </tbody>
      </table>
    </Scroll>
  );
}
