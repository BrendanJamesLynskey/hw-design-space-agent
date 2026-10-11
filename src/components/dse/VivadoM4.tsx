/**
 * The local Vivado runs after milestone 4 (Results): high_precision at its own 20 ns clock, the
 * refit counted once, the class path factor's rule, post-route / post-synthesis Fmax per family,
 * and the first measured FPGA power against the power index. Server Components; every value
 * comes from src/data/vivado_m4.json, whose rows scripts/export_vivado_m4.py re-makes and checks
 * against the repo's results.md. The two charts are HTML (rows of text with a marker track), so
 * their labels stay legible at phone width and every value is printed, not only drawn.
 */
import { signedPct, trim } from "@/lib/format";
import { FAMILY_COLOUR } from "@/lib/viz/palette";
import { FAMILIES4, shortKey, viv4 } from "@/lib/dse/vivado4";

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

/** high_precision at the spec's own 20 ns clock: measured against the three models. */
export function Hp20Table(): JSX.Element {
  const h = viv4.high_precision_20ns;
  return (
    <Scroll label="high_precision at its own 20 ns clock">
      <table className="w-full text-sm" data-testid="hp20-table">
        <caption className="pb-1 text-left text-xs text-neutral-600 dark:text-neutral-400">
          pipelined_m W=26 N=22, {h.part}, {h.period_ns} ns constraint; needs ≥{" "}
          {h.need_msps} MSPS. Model columns are unrouted (post-synthesis scale).
        </caption>
        <thead>
          <tr>
            <th className={TH}>Design</th>
            <th className={TH}>Flow</th>
            <th className={TH}>WNS, ns</th>
            <th className={TH}>
              MSPS <Prov kind="measured" />
            </th>
            <th className={TH}>Meets?</th>
            <th className={TH}>
              M1 <Prov kind="estimate" />
            </th>
            <th className={TH}>
              Refit (vivado-2025.2 = -m4) <Prov kind="estimate" />
            </th>
          </tr>
        </thead>
        <tbody>
          {h.rows.map((r) => (
            <tr
              key={`${r.m}-${r.stage}`}
              data-m={r.m}
              data-stage={r.stage}
              data-meets={r.meets ? "true" : "false"}
            >
              <td className={`${TD} font-mono`}>m={r.m}</td>
              <td className={TD}>{r.stage}</td>
              <td className={TD}>{r.wns_ns.toFixed(3)}</td>
              <td className={`${TD} font-semibold`}>{r.msps.toFixed(2)}</td>
              <td className={TD}>
                {r.meets ? "yes" : "no"} (
                {signedPct(r.msps / h.need_msps - 1, r.meets ? 1 : 2)})
              </td>
              <td className={TD}>{r.estimates.m1.toFixed(2)}</td>
              <td className={TD}>{r.estimates.refit_m4.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** The per-family-class path factor: the rule fixed before the fit, and how each half came out. */
export function ClassFactorTable(): JSX.Element {
  const c = viv4.class_factor;
  const m8 = viv4.high_precision_20ns.rows.find(
    (r) => r.m === 8 && r.stage === "post-synthesis",
  )!;
  const m6 = viv4.high_precision_20ns.rows.find(
    (r) => r.m === 6 && r.stage === "post-synthesis",
  )!;
  return (
    <Scroll label="The class path factor's rule and outcome">
      <table className="w-full text-sm" data-testid="class-factor-table">
        <caption className="pb-1 text-left text-xs text-neutral-600 dark:text-neutral-400">
          Adopt only if (a) and (b) both hold. Outcome:{" "}
          <strong>{c.adopt ? "adopted" : "rejected"}</strong>.
        </caption>
        <thead>
          <tr>
            <th className={TH}>Check</th>
            <th className={TH}>Without the factor</th>
            <th className={TH}>With it</th>
            <th className={TH}>Holds?</th>
          </tr>
        </thead>
        <tbody>
          <tr data-check="a">
            <td className={TD}>(a) Vivado Fmax leave-one-out RMS</td>
            <td className={TD}>{c.loo_without.toFixed(1)}%</td>
            <td className={TD}>{c.loo_with.toFixed(1)}%</td>
            <td className={TD}>{c.a ? "yes" : "no"}</td>
          </tr>
          <tr data-check="b">
            <td className={TD}>
              (b) m=8 model MSPS (measured {m8.msps.toFixed(2)}, infeasible)
            </td>
            <td className={TD}>{c.msps_without["8"]!.toFixed(2)}</td>
            <td className={TD}>{c.msps_with["8"]!.toFixed(2)}</td>
            <td className={TD}>
              <strong>{c.b ? "yes" : "no"}</strong>
            </td>
          </tr>
          <tr>
            <td className={TD}>
              (b) m=6 model MSPS (measured {m6.msps.toFixed(2)})
            </td>
            <td className={TD}>{c.msps_without["6"]!.toFixed(2)}</td>
            <td className={TD}>{c.msps_with["6"]!.toFixed(2)}</td>
            <td className={TD} />
          </tr>
        </tbody>
      </table>
    </Scroll>
  );
}

/** The vivado-2025.2-m4 refit counted once: leave-one-out on the Vivado designs. */
export function RefitM4Table(): JSX.Element {
  const r = viv4.refit;
  const rows: [
    string,
    { n: number; luts: number; ffs: number; fmax: number },
    string,
  ][] = [
    ["M1 (default)", r.m1_vivado, "error (never fitted to these)"],
    ["vivado-2025.2", r.loo_vivado["vivado-2025.2"]!, "leave-one-out"],
    ["vivado-2025.2-m4", r.loo_vivado["vivado-2025.2-m4"]!, "leave-one-out"],
  ];
  return (
    <Scroll label="Refit leave-one-out on the Vivado designs">
      <table className="w-full text-sm" data-testid="refit-m4-table">
        <caption className="pb-1 text-left text-xs text-neutral-600 dark:text-neutral-400">
          RMS error on the {r.loo_vivado["vivado-2025.2-m4"]!.n} measured Vivado
          designs, %
        </caption>
        <thead>
          <tr>
            <th className={TH}>Model</th>
            <th className={TH}>Kind</th>
            <th className={TH}>LUT</th>
            <th className={TH}>FF</th>
            <th className={TH}>Fmax</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, v, kind]) => (
            <tr key={name}>
              <td className={`${TD} font-mono`}>{name}</td>
              <td className={TD}>{kind}</td>
              <td className={TD}>{v.luts.toFixed(1)}</td>
              <td className={TD}>{v.ffs.toFixed(1)}</td>
              <td className={TD}>{v.fmax.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroll>
  );
}

/** A marker track: position on a scale, with the value 1 marked. */
function pos(v: number, lo: number, hi: number, log: boolean): number {
  const f = log
    ? (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))
    : (v - lo) / (hi - lo);
  return Math.max(0, Math.min(1, f)) * 100;
}

function Legend({
  items,
}: {
  items: [string, React.ReactNode][];
}): JSX.Element {
  return (
    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
      {items.map(([k, v]) => (
        <span key={k} className="inline-flex items-center gap-1">
          {v}
          {k}
        </span>
      ))}
    </p>
  );
}

const Dot = ({ c, hollow = false }: { c: string; hollow?: boolean }) => (
  <span
    aria-hidden="true"
    className="inline-block size-2.5 rounded-full border-2"
    style={{ borderColor: c, background: hollow ? "transparent" : c }}
  />
);

/** Post-route / post-synthesis Fmax: every Vivado design measured both ways, by family. */
export function RouteRatioChart(): JSX.Element {
  const p = viv4.post_route;
  const lo = 0.6;
  const hi = 1.1;
  return (
    <figure className="my-4" data-testid="route-chart">
      <figcaption className="text-xs text-neutral-600 dark:text-neutral-400">
        Post-route Fmax as a fraction of post-synthesis Fmax, Vivado 2025.2{" "}
        <Prov kind="measured" />: one dot per design and constraint (
        {p.designs.length}), the bar spans each family. Left of the 1.0 line,
        routing costs clock speed.
      </figcaption>
      <div className="mt-2 space-y-2">
        {FAMILIES4.map((f) => {
          const b = p.by_family[f];
          const ds = p.designs.filter((d) => d.family === f);
          return (
            <div
              key={f}
              data-family={f}
              className="grid grid-cols-[6.5rem_1fr] items-center gap-2 text-xs sm:grid-cols-[8rem_1fr_9rem]"
            >
              <span className="font-mono">{f}</span>
              <div
                className="relative h-5 rounded bg-neutral-100 dark:bg-neutral-800"
                aria-hidden="true"
              >
                <span
                  className="absolute inset-y-0 w-px bg-neutral-500"
                  style={{ left: `${pos(1, lo, hi, false)}%` }}
                />
                <span
                  className="absolute top-1.5 h-2 rounded opacity-40"
                  style={{
                    left: `${pos(b.min, lo, hi, false)}%`,
                    width: `${pos(b.max, lo, hi, false) - pos(b.min, lo, hi, false)}%`,
                    background: FAMILY_COLOUR[f],
                  }}
                />
                {ds.map((d) => (
                  <span
                    key={`${d.key}-${d.period_ns}`}
                    className="absolute top-1 size-3 -translate-x-1/2 rounded-full border border-white dark:border-neutral-900"
                    style={{
                      left: `${pos(d.ratio, lo, hi, false)}%`,
                      background: FAMILY_COLOUR[f],
                    }}
                  />
                ))}
              </div>
              <span className="col-start-2 sm:col-start-auto">
                {b.min.toFixed(3)}–{b.max.toFixed(3)} (mean {b.mean.toFixed(3)},{" "}
                {b.n} designs)
              </span>
            </div>
          );
        })}
        <div className="grid grid-cols-[6.5rem_1fr] gap-2 text-[0.7rem] text-neutral-600 sm:grid-cols-[8rem_1fr_9rem] dark:text-neutral-400">
          <span />
          <div className="relative h-4" aria-hidden="true">
            {[0.6, 0.7, 0.8, 0.9, 1, 1.1].map((t) => (
              <span
                key={t}
                className="absolute -translate-x-1/2"
                style={{ left: `${pos(t, lo, hi, false)}%` }}
              >
                {t.toFixed(1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/** The power index against Vivado's core power, design by design, after synthesis and after routing. */
export function PowerRatioChart(): JSX.Element {
  const ps = viv4.power.stages["post-synthesis"];
  const pr = viv4.power.stages["post-route"];
  const lo = 0.4;
  const hi = 1.5;
  const rows = ps.designs
    .map((d) => ({
      d,
      r: pr.designs.find((x) => x.key === d.key)!,
    }))
    .sort(
      (a, b) =>
        FAMILIES4.indexOf(a.d.family) - FAMILIES4.indexOf(b.d.family) ||
        a.d.index - b.d.index,
    );
  return (
    <figure className="my-4" data-testid="power-chart">
      <figcaption className="text-xs text-neutral-600 dark:text-neutral-400">
        The power index <Prov kind="estimate" /> divided by Vivado&apos;s core
        power <Prov kind="measured" /> (vectorless, {viv4.power.toggle_pct}%
        default toggle, confidence {viv4.power.confidence}), both relative to
        the reference iterative W16 design, at 100 MHz. 1.0 means the index is
        right; left of it the index reads low. Log scale.
      </figcaption>
      <div className="mt-2 space-y-1">
        {rows.map(({ d, r }) => (
          <div
            key={d.key}
            data-key={d.key}
            className="grid grid-cols-[9rem_1fr] items-center gap-2 text-xs sm:grid-cols-[12rem_1fr_8rem]"
          >
            <span className="break-words font-mono" title={d.key}>
              {shortKey(d.key)}
            </span>
            <div
              className="relative h-4 rounded bg-neutral-100 dark:bg-neutral-800"
              aria-hidden="true"
            >
              <span
                className="absolute inset-y-0 w-px bg-neutral-500"
                style={{ left: `${pos(1, lo, hi, true)}%` }}
              />
              <span
                className="absolute top-0.5 size-3 -translate-x-1/2 rounded-full border-2"
                style={{
                  left: `${pos(r.ratio, lo, hi, true)}%`,
                  borderColor: FAMILY_COLOUR[d.family],
                }}
              />
              <span
                className="absolute top-0.5 size-3 -translate-x-1/2 rounded-full"
                style={{
                  left: `${pos(d.ratio, lo, hi, true)}%`,
                  background: FAMILY_COLOUR[d.family],
                }}
              />
            </div>
            <span className="col-start-2 tabular-nums sm:col-start-auto">
              {d.ratio.toFixed(2)} / {r.ratio.toFixed(2)}
            </span>
          </div>
        ))}
        <div className="grid grid-cols-[9rem_1fr] gap-2 text-[0.7rem] text-neutral-600 sm:grid-cols-[12rem_1fr_8rem] dark:text-neutral-400">
          <span />
          <div className="relative h-4" aria-hidden="true">
            {[0.5, 1, 1.5].map((t) => (
              <span
                key={t}
                className="absolute -translate-x-1/2"
                style={{ left: `${pos(t, lo, hi, true)}%` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Legend
        items={[
          ["post-synthesis (first number)", <Dot key="s" c="#737373" />],
          ["post-route (second)", <Dot key="r" c="#737373" hollow />],
          ...FAMILIES4.map(
            (f) =>
              [f, <Dot key={f} c={FAMILY_COLOUR[f]!} />] as [
                string,
                React.ReactNode,
              ],
          ),
        ]}
      />
    </figure>
  );
}

/** The power models against Vivado's core power: none, one global scale, one per family. */
export function PowerFitTable(): JSX.Element {
  const p = viv4.power;
  const ps = p.stages["post-synthesis"];
  return (
    <Scroll label="Power index fits">
      <table className="w-full text-sm" data-testid="power-fit-table">
        <caption className="pb-1 text-left text-xs text-neutral-600 dark:text-neutral-400">
          RMS log error against Vivado core power, post-synthesis, {ps.n}{" "}
          designs, %
        </caption>
        <thead>
          <tr>
            <th className={TH}>Power model</th>
            <th className={TH}>Parameters</th>
            <th className={TH}>In-sample</th>
            <th className={TH}>Leave-one-out</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>default index, normalised to the reference</td>
            <td className={TD}>0</td>
            <td className={TD}>{ps.rms_pct.toFixed(1)}</td>
            <td className={TD}>—</td>
          </tr>
          <tr>
            <td className={TD}>default index × one fitted scale</td>
            <td className={TD}>1</td>
            <td className={TD}>{p.fit.global_in.toFixed(1)}</td>
            <td className={TD}>{p.fit.global_loo.toFixed(1)}</td>
          </tr>
          <tr>
            <td className={TD}>per-family activity (not the default)</td>
            <td className={TD}>{p.parameters}</td>
            <td className={TD}>{p.fit.per_family_in.toFixed(1)}</td>
            <td className={TD}>{p.fit.per_family_loo.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        Implied activity per family against the default {p.default_activity}:{" "}
        {FAMILIES4.map((f) => `${f} ${trim(p.implied_activity[f], 4)}`).join(
          ", ",
        )}
        .
      </p>
    </Scroll>
  );
}
