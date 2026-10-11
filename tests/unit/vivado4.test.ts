/**
 * The local Vivado runs after M4 (src/data/vivado_m4.json): the values the prose quotes, checked
 * against the vendored README's and write-up's own wording of the same results, and the short
 * design labels the charts print.
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { ladder } from "@/lib/dse/ladder";
import { lookup } from "@/lib/dse/values";
import { FAMILIES4, hp20, shortKey, viv4 } from "@/lib/dse/vivado4";

const README = readFileSync("vendor/hw_dse/README.md", "utf-8").replace(
  /\s+/g,
  " ",
);
const WRITEUP = readFileSync("vendor/hw_dse/docs/WRITEUP.md", "utf-8").replace(
  /\s+/g,
  " ",
);
const f2 = (x: number) => x.toFixed(2);

describe("the local Vivado runs (PR #7)", () => {
  it("high_precision at 20 ns: the README's verdict, from the data", () => {
    const m8s = hp20(8, "post-synthesis");
    const m8r = hp20(8, "post-route");
    const m6s = hp20(6, "post-synthesis");
    const m6r = hp20(6, "post-route");
    expect([m8s.meets, m8r.meets, m6s.meets, m6r.meets]).toEqual([
      false,
      false,
      true,
      true,
    ]);
    expect(README).toContain(
      `${f2(m8s.msps)} MSPS post-synthesis (WNS −${(-m8s.wns_ns).toFixed(3)} ns, ${((1 - m8s.msps / 50) * 100).toFixed(2)}% short; relaxing the constraint did not move it) and ${f2(m8r.msps)} MSPS post-route (${((1 - m8r.msps / 50) * 100).toFixed(1)}% short)`,
    );
    expect(README).toContain(
      `(${f2(m6s.msps)} post-synthesis, ${f2(m6r.msps)} post-route, +${((m6r.msps / 50 - 1) * 100).toFixed(1)}%)`,
    );
    // the ladder's widget shows the same rows
    const [l6, l8] = ladder.high_precision.candidates;
    expect([l6.post_synth_20.msps, l6.post_route_20.msps]).toEqual([
      m6s.msps,
      m6r.msps,
    ]);
    expect([l8.post_synth_20.msps, l8.post_route_20.msps]).toEqual([
      m8s.msps,
      m8r.msps,
    ]);
    // the m4 refit is the vivado-2025.2 fit, so the two model columns agree
    for (const r of viv4.high_precision_20ns.rows)
      expect(r.estimates.refit_m4).toBe(r.estimates.refit);
    // m=6 loses 17% to routing; the models' unrouted margin is 25–27%
    expect(Math.round((lookup("v4.m6.route_loss") as number) * 100)).toBe(17);
    expect(WRITEUP).toContain(
      `The winner m=6 loses 17% to routing (${m6s.msps} → ${m6r.msps} MSPS)`,
    );
    expect(Math.round((lookup("v4.m6.model_margin_min") as number) * 100)).toBe(
      25,
    );
    expect(Math.round((lookup("v4.m6.model_margin_max") as number) * 100)).toBe(
      27,
    );
    expect(README).toContain(
      "not the 25–27% the models' unrouted 62.5–63.7 MSPS suggest",
    );
  });

  it("the class factor: the README's numbers and the rule's two halves", () => {
    const c = viv4.class_factor;
    expect(README).toContain(
      `Vivado Fmax leave-one-out **${c.loo_without.toFixed(1)}% → ${c.loo_with.toFixed(1)}%**`,
    );
    expect(README).toContain(
      `all 51 points ${c.loo_all_without.toFixed(1)} → ${c.loo_all_with.toFixed(1)}%`,
    );
    expect(README).toContain(
      `predicts **${c.msps_with["8"]!.toFixed(1)} MSPS for m=8** (+${((lookup("v4.cf.m8_err") as number) * 100).toFixed(1)}% against ${f2(hp20(8, "post-synthesis").msps)} measured)`,
    );
    expect(README).toContain(
      `(factors ×${c.factor_fsm.toFixed(2)} FSM, ×${c.factor_pipelined.toFixed(2)} pipelined;`,
    );
    expect([c.a, c.b, c.adopt]).toEqual([true, false, false]);
    expect(lookup("v4.cf.history")).not.toContain("`");
    expect(lookup("v4.cf.history")).toContain("the rule text was not changed");
  });

  it("the refit counted once, and post-route ratios per family", () => {
    const r = viv4.refit;
    expect(README).toContain(
      `Vivado leave-one-out is LUT ${r.loo_vivado["vivado-2025.2-m4"]!.luts.toFixed(1)}% / FF ${r.loo_vivado["vivado-2025.2-m4"]!.ffs.toFixed(1)}% / Fmax ${r.loo_vivado["vivado-2025.2-m4"]!.fmax.toFixed(1)}% on the 14 designs, against M1's ${r.m1_vivado.luts.toFixed(1)} / ${r.m1_vivado.ffs.toFixed(1)} / ${r.m1_vivado.fmax.toFixed(1)}%`,
    );
    expect(r.route_disagree.map((d) => d.m)).toEqual([6, 8]);
    const p = viv4.post_route.by_family;
    expect(README).toContain(
      `(ratio ${p.pipelined.min.toFixed(3)}–${p.pipelined.max.toFixed(3)})`,
    );
    for (const f of FAMILIES4) expect(p[f].n).toBeGreaterThanOrEqual(3);
    expect(
      viv4.post_route.designs.filter((d) => d.period_ns === 20),
    ).toHaveLength(2);
  });

  it("power: the README's ranges per family and the fit", () => {
    const ps = viv4.power.stages["post-synthesis"];
    const pr = viv4.power.stages["post-route"];
    const rng = (x: [number, number]) => `${f2(x[0])}–${f2(x[1])}`;
    expect(README).toContain(
      `reads \`unrolled_k\` low (${rng(ps.by_family.unrolled_k)}× measured post-synthesis, ${rng(pr.by_family.unrolled_k)}× post-route) and plain \`pipelined\` high (${rng(ps.by_family.pipelined)}× / ${rng(pr.by_family.pipelined)}×)`,
    );
    expect(README).toContain(
      `(Spearman ${ps.spearman.toFixed(3)} post-synthesis, ${pr.spearman.toFixed(3)} post-route), with an RMS error of ${ps.rms_pct.toFixed(1)}% / ${pr.rms_pct.toFixed(1)}%`,
    );
    const f = viv4.power.fit;
    expect(README).toContain(
      `cuts the error to ${f.per_family_in.toFixed(1)}% in-sample and **${f.per_family_loo.toFixed(1)}% leave-one-out** (one global scale: ${f.global_in.toFixed(1)} / ${f.global_loo.toFixed(1)}%)`,
    );
    expect(ps.spearman_tied).toBeGreaterThan(ps.spearman);
    expect(pr.spearman_tied).toBe(pr.spearman);
    expect(lookup("v4.power.tied_mw")).toBe(22);
    expect(lookup("v4.power.act_min")).toBe(
      viv4.power.implied_activity.pipelined,
    );
    expect(lookup("v4.power.act_max")).toBe(
      viv4.power.implied_activity.unrolled_k,
    );
  });

  it("short design labels", () => {
    expect(
      shortKey(
        "pipelined_m:data_width=26,n_iter=22,angle_guard=0,frac_guard=0,rounding=round,m=6",
      ),
    ).toBe("pipelined_m W26 N22 m=6");
    expect(
      shortKey(
        "unrolled_k:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=trunc,k=4",
      ),
    ).toBe("unrolled_k W16 k=4");
    expect(
      shortKey(
        "iterative:data_width=12,n_iter=14,angle_guard=0,frac_guard=0,rounding=trunc",
      ),
    ).toBe("iterative W12");
  });
});
