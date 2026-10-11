/**
 * Milestone 4's tables (Results, How it works). Server Components: every value comes from
 * src/data/m4.json, whose rows scripts/export_m4.py re-makes from the vendored summaries and
 * checks against the repo's results.md, the write-up and the README.
 */
import { m4, pFmt, shortKey } from "@/lib/dse/m4";
import { fmtInt, signedPct, trim } from "@/lib/format";

import { Prov } from "./Badges";

const TH =
  "border-b border-neutral-300 px-2 py-1.5 text-left align-bottom font-semibold dark:border-neutral-700";
const TD =
  "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-800";

type Stat = { mean: number; std: number; n: number };

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

const f3 = (s: Stat | null | undefined): string =>
  s ? `${s.mean.toFixed(3)} ± ${s.std.toFixed(3)}` : "—";
const pctS = (s: Stat | null | undefined): string =>
  s ? `${signedPct(s.mean)} ± ${(s.std * 100).toFixed(1)}` : "—";
const SHORT: Record<string, string> = {
  "anthropic/claude-sonnet-5.5": "Sonnet 5.5",
  "deepseek/deepseek-v4.1-flash": "DeepSeek V4.1 Flash",
  "qwen/qwen3.8-27b, reasoning off": "Qwen3.8-27B (off)",
};
const ARM: Record<string, string> = {
  single: "single graph",
  fleet: "fleet, before the fix",
  fleet_v2: "fleet, after the fix",
  fix_effect: "after the fix vs before",
};

/** The sky130 cost model: RMS error in-sample and leave-one-out, per family. */
export function AsicCalibrationTable(): JSX.Element {
  const c = m4.calibration;
  return (
    <Scroll label="ASIC cost model: fit and leave-one-out">
      <table className="w-full text-sm" data-testid="asic-cal-table">
        <caption className="pb-1 text-left text-xs text-neutral-600 dark:text-neutral-400">
          RMS error, %: in-sample / leave-one-out (power against OpenSTA)
        </caption>
        <thead>
          <tr>
            <th className={TH}>Family</th>
            <th className={TH}>Points</th>
            <th className={TH}>Area</th>
            <th className={TH}>FFs</th>
            <th className={TH}>Fmax</th>
            <th className={TH}>Power</th>
          </tr>
        </thead>
        <tbody>
          {c.rows.map((r) => (
            <tr key={r.family} data-family={r.family}>
              <td className={`${TD} font-mono`}>{r.family}</td>
              <td className={TD}>{r.n}</td>
              {["area_um2", "ffs", "fmax_mhz", "power_mw"].map((m) => (
                <td key={m} className={TD}>
                  {r.in[m]!.toFixed(1)} / {r.loo[m]!.toFixed(1)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The three ASIC specs: ground truth, the family ranking on both targets, the winners. */
export function AsicSpecsTable(): JSX.Element {
  return (
    <Scroll label="ASIC specs: ground truth on both targets">
      <table className="w-full text-sm" data-testid="asic-specs-table">
        <thead>
          <tr>
            <th className={TH}>Spec</th>
            <th className={TH}>Feasible (of 635,040)</th>
            <th className={TH}>sky130 winner</th>
            <th className={TH}>FPGA twin&apos;s winner</th>
            <th className={TH}>Family ranking (both targets)</th>
          </tr>
        </thead>
        <tbody>
          {m4.ground_truth.specs.map((s) => (
            <tr key={s.name} data-spec={s.name}>
              <td className={TD}>
                <span className="font-mono">{s.name}</span>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  {s.constraints
                    .map(
                      (c) =>
                        `${c.metric} ${c.op} ${c.metric === "max_abs_err" ? `2^${Math.round(Math.log2(c.value))}` : c.value}`,
                    )
                    .join(", ")}
                  ; min {s.select_by}
                </div>
              </td>
              <td className={TD}>
                {fmtInt(s.n_feasible)}
                {s.l1_bound_feasible !== undefined && (
                  <div className="text-xs">
                    {fmtInt(s.l1_bound_feasible)} pass the L1 bound
                  </div>
                )}
              </td>
              <td className={TD}>
                <span className="font-mono text-xs">{shortKey(s.winner)}</span>{" "}
                (
                {s.select_by === "power_index"
                  ? trim(s.winner_value, 3)
                  : `${fmtInt(s.winner_value)} µm²`}
                )
                <Prov kind="estimate" />
              </td>
              <td className={TD}>
                <span className="font-mono text-xs">
                  {shortKey(s.twin_winner)}
                </span>{" "}
                (
                {s.twin_select_by === "power_index"
                  ? trim(s.twin_value, 3)
                  : `${fmtInt(s.twin_value)} LUT+FF`}
                )
              </td>
              <td className={TD}>
                {s.ranking.join(" < ")}
                <div className="text-xs">
                  {s.ranking_differs ? "differs" : "same on both"}
                  {s.ranking.length === 2 ? " (one pairwise comparison)" : ""}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The structured graph on the ASIC specs against NSGA-II and random: regret and HV. */
export function AsicEvalTable(): JSX.Element {
  const e = m4.asic_eval;
  const cols = [
    { k: "nsga2", label: "NSGA-II" },
    { k: "random", label: "random" },
    ...e.models.map((m) => ({ k: m.model, label: SHORT[m.model] ?? m.label })),
  ];
  return (
    <Scroll label="ASIC specs: structured graph against the baselines">
      <table className="w-full text-sm" data-testid="asic-eval-table">
        <thead>
          <tr>
            <th className={TH}>Spec</th>
            <th className={TH}>Metric</th>
            {cols.map((c) => (
              <th key={c.k} className={TH}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(e.cells.select_regret!).flatMap((spec) =>
            (["select_regret", "hv_frac"] as const).map((met) => (
              <tr key={`${spec}-${met}`} data-spec={spec} data-metric={met}>
                {met === "select_regret" && (
                  <td className={`${TD} font-mono`} rowSpan={2}>
                    {spec}
                  </td>
                )}
                <td className={TD}>
                  {met === "select_regret" ? "regret" : "HV fraction"}
                </td>
                {cols.map((c) => (
                  <td key={c.k} className={TD}>
                    {e.cells[met]![spec]![c.k]!.text}
                  </td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
      <table className="mt-3 w-full text-sm" data-testid="asic-models-table">
        <thead>
          <tr>
            <th className={TH}>Model</th>
            <th className={TH}>Runs</th>
            <th className={TH}>Selected design meets the spec</th>
            <th className={TH}>L2 changed the L1 pick</th>
            <th className={TH}>Cost / run</th>
            <th className={TH}>Wall-clock / run</th>
          </tr>
        </thead>
        <tbody>
          {e.models.map((m) => (
            <tr key={m.model}>
              <td className={`${TD} font-mono text-xs`}>{m.model}</td>
              <td className={TD}>{m.runs}</td>
              <td className={TD}>
                {m.meets}/{m.runs}
              </td>
              <td className={TD}>{m.l2_changed}</td>
              <td className={TD}>
                ${m.cost_usd.toFixed(4)}
                <Prov kind="measured" />
              </td>
              <td className={TD}>
                {Math.round(m.wall_s.mean)} ± {Math.round(m.wall_s.std)} s
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The A/B: single graph against the fleet (before and after the fix), per model. */
export function FleetAbTable(): JSX.Element {
  return (
    <Scroll label="A/B: single graph against the fleet">
      <table className="w-full text-sm" data-testid="fleet-ab-table">
        <thead>
          <tr>
            <th className={TH}>Model</th>
            <th className={TH}>Arm</th>
            <th className={TH}>Runs</th>
            <th className={TH}>HV fraction</th>
            <th className={TH}>Regret</th>
            <th className={TH}>Cost / run</th>
            <th className={TH}>Input tokens / run</th>
            <th className={TH}>Failed LLM calls</th>
            <th className={TH}>Wall-clock / run</th>
          </tr>
        </thead>
        <tbody>
          {m4.ab.rows.map((r) => (
            <tr
              key={`${r.model}-${r.arm}`}
              data-model={r.model}
              data-arm={r.arm}
            >
              <td className={TD}>{SHORT[r.model] ?? r.label}</td>
              <td className={TD}>{ARM[r.arm]}</td>
              <td className={TD}>{r.runs}</td>
              <td className={TD}>{f3(r.hv)}</td>
              <td className={TD}>{pctS(r.regret)}</td>
              <td className={TD}>
                ${r.cost_usd.mean.toFixed(4)}
                <Prov kind="measured" />
              </td>
              <td className={TD}>{fmtInt(r.input_tokens.mean)}</td>
              <td className={TD}>{r.failed_calls}</td>
              <td className={TD}>
                {Math.round(r.wall_s.mean)} ± {Math.round(r.wall_s.std)} s
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The paired tests (same spec and seed): exact sign test and paired t. */
export function PairedTestsTable(): JSX.Element {
  return (
    <Scroll label="A/B: paired tests">
      <table className="w-full text-sm" data-testid="paired-table">
        <thead>
          <tr>
            <th className={TH}>Model</th>
            <th className={TH}>Comparison</th>
            <th className={TH}>Pairs</th>
            <th className={TH}>HV: fleet higher / lower (sign p)</th>
            <th className={TH}>HV mean diff (t p)</th>
            <th className={TH}>Regret: fleet better / worse (sign p)</th>
            <th className={TH}>Regret mean diff, points (t p)</th>
          </tr>
        </thead>
        <tbody>
          {m4.ab.tests.map((t) => (
            <tr
              key={`${t.model}-${t.arm}`}
              data-model={t.model}
              data-arm={t.arm}
            >
              <td className={TD}>{SHORT[t.model] ?? "pooled (3 models)"}</td>
              <td className={TD}>
                {t.arm === "fix_effect"
                  ? ARM.fix_effect
                  : `single vs ${ARM[t.arm]}`}
              </td>
              <td className={TD}>{t.hv_frac.n}</td>
              <td className={TD}>
                {t.hv_frac.pos} / {t.hv_frac.neg} ({pFmt(t.hv_frac.sign_p)})
              </td>
              <td className={TD}>
                {t.hv_frac.mean >= 0 ? "+" : "−"}
                {Math.abs(t.hv_frac.mean).toFixed(3)} ({pFmt(t.hv_frac.t_p)})
              </td>
              <td className={TD}>
                {t.select_regret.neg} / {t.select_regret.pos} (
                {pFmt(t.select_regret.sign_p)})
              </td>
              <td className={TD}>
                {t.select_regret.mean >= 0 ? "+" : "−"}
                {Math.abs(t.select_regret.mean * 100).toFixed(1)} (
                {pFmt(t.select_regret.t_p)})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** Throughput, measured, and the 24-hour projections built from it. */
export function FleetThroughputTable(): JSX.Element {
  return (
    <Scroll label="Throughput, measured, and projections">
      <table className="w-full text-sm" data-testid="throughput-table">
        <thead>
          <tr>
            <th className={TH}>Model</th>
            <th className={TH}>Arm</th>
            <th className={TH}>Designs evaluated / hour (measured)</th>
            <th className={TH}>Cost per spec (measured)</th>
            <th className={TH}>
              <em>Projection</em>: designs / 24 h
            </th>
            <th className={TH}>
              <em>Projection</em>: specs / 24 h
            </th>
            <th className={TH}>
              <em>Projection</em>: cost / 24 h
            </th>
          </tr>
        </thead>
        <tbody>
          {m4.ab.rows.map((r) => (
            <tr key={`${r.model}-${r.arm}`}>
              <td className={TD}>{SHORT[r.model] ?? r.label}</td>
              <td className={TD}>{ARM[r.arm]}</td>
              <td className={TD}>{fmtInt(r.designs_per_hour)}</td>
              <td className={TD}>${r.cost_per_spec.toFixed(4)}</td>
              <td className={TD}>{fmtInt(r.proj_designs_day)}</td>
              <td className={TD}>{fmtInt(r.proj_specs_day)}</td>
              <td className={TD}>${r.proj_cost_day.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** L2 -> L1 feedback on the constructed spec: the 15 searches. */
export function FeedbackTable(): JSX.Element {
  return (
    <Scroll label="L2 to L1 feedback on the constructed spec">
      <table className="w-full text-sm" data-testid="feedback-table">
        <thead>
          <tr>
            <th className={TH}>Search (400 evaluations)</th>
            <th className={TH}>Pass the L1 bound</th>
            <th className={TH}>Pass L2</th>
            <th className={TH}>Feedback fires</th>
            <th className={TH}>Corrected bound: outcome, evals, regret</th>
            <th className={TH}>Uncorrected bound</th>
          </tr>
        </thead>
        <tbody>
          {m4.feedback.table.map((r) => (
            <tr key={r.search} data-fires={r.fires ? "true" : "false"}>
              <td className={TD}>{r.search}</td>
              <td className={TD}>{r.l1_feasible}</td>
              <td className={TD}>{r.pass_l2}</td>
              <td className={TD}>{r.fires ? <strong>yes</strong> : "no"}</td>
              <td className={TD}>{r.corrected}</td>
              <td className={TD}>{r.uncorrected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** What M4 cost: the key readings and the ledger. */
export function M4SpendTable(): JSX.Element {
  const s = m4.spend;
  return (
    <Scroll label="What M4 cost">
      <table className="w-full text-sm" data-testid="m4-spend-table">
        <thead>
          <tr>
            <th className={TH}>Ledger entry (model / arm)</th>
            <th className={TH}>Runs</th>
            <th className={TH}>Provider-reported USD</th>
          </tr>
        </thead>
        <tbody>
          {s.ledger.map((r) => (
            <tr key={r.entry}>
              <td className={`${TD} font-mono text-xs`}>{r.entry}</td>
              <td className={TD}>{r.runs}</td>
              <td className={TD}>{r.usd.toFixed(4)}</td>
            </tr>
          ))}
          <tr>
            <td className={`${TD} font-semibold`}>total</td>
            <td className={TD}>{s.ledger_entries}</td>
            <td className={`${TD} font-semibold`}>
              {s.ledger_total_usd.toFixed(4)}
            </td>
          </tr>
        </tbody>
      </table>
    </Scroll>
  );
}
