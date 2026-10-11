"""Milestone 4's data for the site: the ASIC target on sky130 (the calibration, the exhaustive
ground truth of the three ASIC specs against their FPGA twins, the held-out check), the
structured graph on the ASIC specs, the A/B of a single graph against the code-orchestrated
fleet, the L2 -> L1 feedback and the M4 spend.

Imported by scripts/export_dse.py, which writes the result to src/data/m4.json. As for M1 to
M3, every table row the site shows is re-made from the vendored summaries the way
eval/m4.py's report_m4 formats it and asserted to appear literally in eval/results.md; the
sentences of docs/WRITEUP.md and the README the site repeats are asserted too. Recomputed with
the Python reference at the vendored commit rather than read:

- the ASIC fit: hw_dse.models.cost_asic.calibrate re-run on the 57 committed points must
  reproduce the committed in-sample and leave-one-out tables;
- the held-out check: each of the 9 held-out designs re-evaluated (estimate) and, for the
  system spec, simulated at its measured clock (hw_dse.l2);
- the deadline miss: the asic_multiaxis_control winner's control loop simulated at its
  estimated clock and at its measured one (and the one held-out design that meets the spec);
- FPGA against ASIC: the pipelining-depth sweep of each target's winner (every m, the same
  numerics) on both targets, whose best feasible m must be the ground truth's winner;
- the paired tests of the A/B: an independent exact sign test and paired t (own t tail by
  numerical integration), which must agree with the repository's table and the write-up;
- one fleet run (Qwen, after the fix): its members' evaluations from the archived traces, the
  Store's contents, the code-written lessons and the phase-2 warm-start seeds, rebuilt with
  hw_dse.fleet and checked against the run's summary.
"""
from __future__ import annotations

import csv
import gzip
import hashlib
import json
import math
import re
import statistics
from pathlib import Path
from typing import Any

import numpy as np

from export_m3 import MODEL_LABELS, arch_of, flat, label_of, ms_fmt, params_from_key, r6, stat
from hw_dse.agent.backannotate import _MeasuredAsicCost
from hw_dse.agent.summary import merged_front
from hw_dse.benchmark import select_design
from hw_dse.evaluate import evaluate
from hw_dse.families import ArchConfig
from hw_dse.fleet import coordinator as fco
from hw_dse.fleet import store as fstore
from hw_dse.l2.cycle import Contract
from hw_dse.l2.node import simulate_record
from hw_dse.l2.system import metrics, simulate
from hw_dse.models.cost_asic import calibrate
from hw_dse.spec import Spec, load_spec
from hw_dse.synth.asic import load_csv

V = Path(__file__).resolve().parent.parent / "vendor/hw_dse"
D = V / "eval/data"

ASIC_SPECS = ("asic_low_area", "asic_power_50msps", "asic_multiaxis_control")
FPGA_AB_SPECS = ("low_area_control", "multiaxis_control")
FLEET_ARMS = ("fleet", "fleet_v2")
ARM_LABEL = {"single": "single", "fleet": "fleet before_fix", "fleet_v2": "fleet after fix",
             "fix_effect": "after fix vs before_fix"}
SHORT = {"anthropic/claude-sonnet-5.5": "sonnet", "deepseek/deepseek-v4.1-flash": "deepseek",
         "qwen/qwen3.8-27b, reasoning off": "qwen", "pooled": "pooled"}
METRICS = ("area_um2", "ffs", "fmax_mhz", "power_mw")
# results.md and the ledger at a92fe65 (the vendored M1-M3 commit before this one): M4 only
# appended to them, so everything before the M4 section is what the site showed for M1-M3.
RESULTS_A92FE65 = (54420, "1f6dfd65a0e262d00475c7fe6044ed1beb86a3a9f9d927ee31d2a3d314129984")
LEDGER_A92FE65 = (225, "295c63d009ab440cbb704bacda9031820c56717f9bfff6ceedeb71155c0f5341")
# The fleet run the How-it-works animation replays (Qwen, after the fix): the fsm member proves
# its families cannot make 50 MSPS, so phase 2 goes to the pipelined member, warm-started.
FLEET_RUN = ("fleet_v2", "qwen__qwen3.8-27b__reasoning-off", "asic_power_50msps", 2)


def asic_spec(name: str) -> Spec:
    return load_spec(V / "specs/asic" / f"{name}.yaml")


def any_spec(name: str) -> Spec:
    if name.startswith("asic_"):
        return asic_spec(name)
    p = V / "specs/system" / f"{name}.yaml"
    return load_spec(p if p.exists() else V / "specs" / f"{name}.yaml")


def rows4(d: Path) -> dict[str, list[dict[str, Any]]]:
    """eval/m4.py's _rows: every summary under d/<model>/, by model label, sorted paths."""
    out: dict[str, list[dict[str, Any]]] = {}
    for p in sorted(d.glob("*/*.json")) if d.exists() else []:
        r = json.loads(p.read_text())
        out.setdefault(label_of(r), []).append(r)
    return out


def pct(xs: list[float | None]) -> str:
    return ms_fmt(xs, pct=True, signed=True)


def sha(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()


# ---------------------------------------------------------------------------
# The ASIC model: fit and leave-one-out, re-run
# ---------------------------------------------------------------------------

def calibration(md: str) -> dict[str, Any]:
    cal = json.loads((D / "asic_calibration.json").read_text())
    again = calibrate(D / "asic_synthesis.csv")
    for view in ("in_sample", "leave_one_out"):
        for fam, v in cal["summary"][view].items():
            for m in METRICS:
                assert again["summary"][view][fam][m] == v[m], (view, fam, m)
    assert again["calibration"]["fitted"] == cal["calibration"]["fitted"]
    n_points = cal["calibration"]["n_points"]
    assert f"{n_points} synthesised designs over all four families" in md
    ins, loo = cal["summary"]["in_sample"], cal["summary"]["leave_one_out"]
    rows = []
    for fam in ("all", "iterative", "unrolled_k", "pipelined", "pipelined_m"):
        n = loo[fam].get("n", n_points)
        line = f"| {fam} | {n} | " + " | ".join(f"{ins[fam][m]:.1f} / {loo[fam][m]:.1f}" for m in METRICS) + " |"
        assert line in md, line
        rows.append({"family": fam, "n": n, "in": {m: ins[fam][m] for m in METRICS},
                     "loo": {m: loo[fam][m] for m in METRICS}})
    pts = load_csv(D / "asic_synthesis.csv")
    per_family = {f: sum(p.arch.family == f for p in pts) for f in ("iterative", "unrolled_k", "pipelined", "pipelined_m")}
    tools = sorted({p.row["tool_version"] for p in pts})
    libs = sorted({p.row["library"] for p in pts})
    corners = sorted({p.row["corner"] for p in pts})
    clocks = sorted({p.row["clock_ns"] for p in pts})
    assert len(tools) == 1 and libs == ["sky130_fd_sc_hd"] and corners == ["tt_025C_1v80"] and clocks == ["10"], (tools, clocks)
    return {"id": cal["calibration"]["id"], "n_points": n_points, "per_family": per_family, "rows": rows,
            "tool": tools[0], "library": libs[0], "corner": corners[0], "clock_ns": float(clocks[0]),
            "t_bit_ns": r6(cal["calibration"]["fitted"]["t_bit"]) if "t_bit" in cal["calibration"]["fitted"] else None,
            "alternatives": {k: r6(v) for k, v in cal.get("alternatives", {}).items()}}


# ---------------------------------------------------------------------------
# Ground truth: the three ASIC specs and their FPGA twins
# ---------------------------------------------------------------------------

def twin_spec(g: dict[str, Any]) -> Spec:
    return Spec.model_validate(g["fpga_twin"]["spec"])


def m_sweep(key: str, s: Spec) -> list[dict[str, Any]]:
    """Every pipelining depth m = 2..8 of a pipelined_m design, the other knobs fixed: the
    selection metric, the clock and (system spec) the simulated batch latency."""
    p = params_from_key(key)
    out = []
    for m in range(2, 9):
        a = ArchConfig.from_params("pipelined_m", {**p, "m": m})
        rec = evaluate(a, s)
        if s.system is not None:
            rec = simulate_record(rec, s)
        out.append({"m": m, "key": a.key(), "select": r6(rec[s.select_by]), "fmax_mhz": r6(rec["fmax_mhz"]),
                    "throughput_msps": r6(rec["throughput_msps"]),
                    **({"p99_us": r6(rec["sys_p99_batch_us"])} if s.system is not None else {}),
                    "feasible": bool(rec["feasible"])})
    return out


def ground_truth(md: str, writeup: str, readme: str) -> dict[str, Any]:
    gt = json.loads((D / "ground_truth_m4.json").read_text())
    specs = []
    for name in ASIC_SPECS:
        g, s = gt[name], asic_spec(name)
        tw = twin_spec(g)
        line = (f"| {name} | {g['n_feasible']:,} | `{g['selected']['key']}` ({s.select_by} {g['selected'][s.select_by]:.4g}) | "
                f"{' < '.join(g['family_ranking'])} | {' < '.join(g['fpga_twin']['family_ranking'])} | "
                f"{'yes' if g['ranking_differs'] else 'no'} | `{g['fpga_twin']['selected']['key']}` |")
        assert line in md, line
        wa, wf = g["selected"][s.select_by], g["fpga_twin"]["selected"][tw.select_by]
        fams = []
        for fam, b in g["family_bests"].items():
            bf = g["fpga_twin"]["family_bests"][fam]
            if not b and not bf:
                continue
            ca = f"`{b['key']}` {b[s.select_by]:.4g}" if b else "none"
            ra = f"{b[s.select_by] / wa:.2f}" if b else "—"
            cf = f"`{bf['key']}` {bf[tw.select_by]:.4g}" if bf else "none"
            rf = f"{bf[tw.select_by] / wf:.2f}" if bf else "—"
            line = f"| {name} | {fam} | {ca} | {ra} | {cf} | {rf} |"
            assert line in md, line
            fams.append({"family": fam, "asic_key": b["key"] if b else None, "asic": r6(b[s.select_by]) if b else None,
                         "asic_ratio": round(b[s.select_by] / wa, 4) if b else None,
                         "fpga_key": bf["key"] if bf else None, "fpga": r6(bf[tw.select_by]) if bf else None,
                         "fpga_ratio": round(bf[tw.select_by] / wf, 4) if bf else None})
        # the winners, re-evaluated with the reference (system metrics simulated)
        for rec, sp in ((g["selected"], s), (g["fpga_twin"]["selected"], tw)):
            again = evaluate(arch_of(rec["key"]), sp)
            if sp.system is not None:
                again = simulate_record(again, sp)
            assert math.isclose(again[sp.select_by], rec[sp.select_by], rel_tol=1e-9), (name, rec["key"])
            assert again["feasible"]
        # the depth story: on the pipelined specs, sweep m at each target's winning numerics
        sweeps = None
        if g["selected"]["family"] == "pipelined_m":
            sa, sf = m_sweep(g["selected"]["key"], s), m_sweep(g["fpga_twin"]["selected"]["key"], tw)
            for sw, win in ((sa, g["selected"]), (sf, g["fpga_twin"]["selected"])):
                feas = [x for x in sw if x["feasible"]]
                best = min(feas, key=lambda x: x["select"])
                assert best["key"] == win["key"], (name, best["key"], win["key"])
            sweeps = {"asic": sa, "fpga": sf}
        specs.append({
            "name": name, "description": flat(s.description), "select_by": s.select_by, "twin_select_by": tw.select_by,
            "constraints": [{"metric": c.metric, "op": c.op, "value": c.value} for c in s.constraints],
            "n_designs": g["n_designs"], "n_feasible": g["n_feasible"], "twin_n_feasible": g["fpga_twin"]["n_feasible"],
            "winner": g["selected"]["key"], "winner_value": r6(wa), "winner_m": g["selected"].get("m"),
            "twin_winner": g["fpga_twin"]["selected"]["key"], "twin_value": r6(wf), "twin_m": g["fpga_twin"]["selected"].get("m"),
            "ranking": g["family_ranking"], "twin_ranking": g["fpga_twin"]["family_ranking"],
            "ranking_differs": g["ranking_differs"], "families": fams, "sweeps": sweeps,
        })
    by = {x["name"]: x for x in specs}
    gm = gt["asic_multiaxis_control"]
    line = (f"`asic_multiaxis_control`: {gm['n_feasible_l1_bound']:,} designs pass the L1 bound and {gm['n_feasible']:,} the "
            f"simulation; the bound's winner `{gm['l1_bound_selected']['key']}` ({gm['l1_bound_selected']['area_um2']:.0f} um2) "
            f"misses the deadline in simulation, so L2 changes the winner to `{gm['selected']['key']}` "
            f"({gm['selected']['area_um2']:.0f} um2): {'yes' if gm['l2_changes_winner'] else 'no'}.")
    assert line in md, line
    by["asic_multiaxis_control"]["l1_bound_feasible"] = gm["n_feasible_l1_bound"]
    by["asic_multiaxis_control"]["l1_bound_winner"] = gm["l1_bound_selected"]["key"]
    by["asic_multiaxis_control"]["l1_bound_value"] = r6(gm["l1_bound_selected"]["area_um2"])
    # the depth claims, as the write-up words them
    pw, mx = by["asic_power_50msps"], by["asic_multiaxis_control"]
    assert (pw["winner_m"], pw["twin_m"], mx["winner_m"], mx["twin_m"]) == (3, 7, 2, 5)
    wu = flat(writeup)
    assert ("At 50 MSPS the ASIC winner is `pipelined_m` with m=3 where the FPGA twin's is m=7; under the 0.5 µs batch "
            "deadline of `asic_multiaxis_control` it is m=2 where the FPGA's is m=5.") in wu
    assert "rank the families in the same order on both targets" in wu and not any(x["ranking_differs"] for x in specs)
    assert ("Only `asic_low_area` ranks all four families; on the other two only the pipelined families meet the rate, so "
            "each is a single pairwise comparison") in wu
    la = {f["family"]: f for f in by["asic_low_area"]["families"]}
    assert f"{la['pipelined']['asic_ratio']:.2f}" == "4.17" and f"{la['pipelined']['fpga_ratio']:.2f}" == "4.99"
    assert "`pipelined` costs 4.17× the `iterative` winner's area on `asic_low_area` and 4.99× its LUT+FF on the FPGA twin" in wu
    rd = flat(readme)
    assert "**Does the family ranking differ between FPGA and ASIC? No.**" in rd
    return {"cost_model": gt["cost_model"], "fpga_cost_model": gt["fpga_cost_model"], "specs": specs}


# ---------------------------------------------------------------------------
# The held-out check and the deadline miss
# ---------------------------------------------------------------------------

def held_out(md: str, writeup: str) -> dict[str, Any]:
    pts = load_csv(D / "asic_validation.csv")
    sys_cols = [(n, c) for n in ASIC_SPECS for c in asic_spec(n).system_constraints]
    rows = []
    for p in pts:
        e = evaluate(p.arch, asic_spec(ASIC_SPECS[0]))
        meets, sysv, sysx = [], [], {}
        for name in ASIC_SPECS:
            sp = asic_spec(name)
            r = evaluate(p.arch, sp, cost_model=_MeasuredAsicCost(p))  # type: ignore[arg-type]
            if sp.system is not None:
                r = simulate_record(r, sp)
                sysv += [f"{float(r[c.metric]):.3f}" for c in sp.system_constraints]
                sysx = {c.metric: r6(r[c.metric]) for c in sp.system_constraints}
            meets.append(bool(r["feasible"]))
        area_err = e["area_um2"] / p.area_um2 - 1
        fmax_err = e["fmax_mhz"] / p.fmax_mhz - 1
        line = (f"| `{p.arch.key()}` | {p.area_um2:.0f} / {e['area_um2']:.0f} ({area_err * 100:+.1f}%) | "
                f"{p.fmax_mhz:.1f} / {e['fmax_mhz']:.1f} ({fmax_err * 100:+.1f}%) | "
                f"{p.power_mw:.3f} | {' / '.join('yes' if x else 'no' for x in meets)} | " + " | ".join(sysv) + " |")
        assert line in md, line
        rows.append({"key": p.arch.key(), "family": p.arch.family, "m": params_from_key(p.arch.key()).get("m"),
                     "area_meas": r6(p.area_um2), "area_est": r6(e["area_um2"]), "area_err": round(area_err, 6),
                     "fmax_meas": r6(p.fmax_mhz), "fmax_est": r6(e["fmax_mhz"]), "fmax_err": round(fmax_err, 6),
                     "power_mw": r6(p.power_mw), "meets": dict(zip(ASIC_SPECS, meets)),
                     "p99_measured_clock_us": sysx.get("sys_p99_batch_us")})
    assert len(rows) == 9 and len(sys_cols) == 1
    area_ok = sum(abs(r["area_err"]) <= 0.05 for r in rows)
    opt = sorted(r["fmax_err"] for r in rows if r["fmax_err"] > 0)
    lo, hi = min(r["fmax_err"] for r in rows), max(r["fmax_err"] for r in rows)
    assert area_ok == 9 and f"{lo:+.1%}" == "-14.9%" and f"{hi:+.1%}" == "+39.6%"
    # optimistic (estimate above measurement) on 6 of 9; by more than 1% on 5 of them (the
    # review's and the record's "5 of 9"), the sixth is the power winner at +0.7%
    assert len(opt) == 6 and sum(x > 0.01 for x in opt) == 5 and f"{opt[0]:+.1%}" == "+0.7%"
    wu = flat(writeup)
    assert "Area is within 5% on all nine; Fmax is not, from −14.9% to +39.6%, the worst an `unrolled_k` design." in wu
    worst = max(rows, key=lambda r: r["fmax_err"])
    assert worst["family"] == "unrolled_k"
    return {"rows": rows, "area_within_5": area_ok, "fmax_err_min": round(lo, 6), "fmax_err_max": round(hi, 6),
            "optimistic": len(opt), "optimistic_over_1pct": sum(x > 0.01 for x in opt),
            "optimistic_min_over_1pct": round(min(x for x in opt if x > 0.01), 6)}


def replay_design(key: str, s: Spec, fmax_mhz: float, label: str, clock: str) -> dict[str, Any]:
    """One design's control loop simulated at a given clock (hw_dse.l2.system), as export_m3's
    system replay: every tick's batch latency, and the p99 tick request by request."""
    scn = s.system
    tick_ns = 1000.0 / float(scn.loop_rate_mhz)
    a = arch_of(key)
    c = Contract.of(a)
    r = simulate(scn, c, float(fmax_mhz))
    m = metrics(scn, r)
    last = np.full(scn.n_ticks, -np.inf)
    np.maximum.at(last, r.group, r.result_ns)
    batch = last - np.arange(scn.n_ticks) * tick_ns
    order = np.argsort(batch, kind="stable")
    p99_tick = int(order[max(0, math.ceil(0.99 * batch.size) - 1)])
    assert math.isclose(batch[p99_tick] / 1000.0, m["sys_p99_batch_us"], rel_tol=1e-9)
    idx = np.flatnonzero(r.group == p99_tick)
    t0 = p99_tick * tick_ns
    acc = r.accept_edge[idx] * r.period_ns - t0
    res = r.result_ns[idx] - t0
    lim = s.constraint_for("sys_p99_batch_us", "<=").value
    rec = evaluate(a, s)
    return {"view": label, "clock": clock, "key": key, "family": a.family, "m": params_from_key(key).get("m"),
            "area_um2": r6(rec["area_um2"]), "fmax_mhz": r6(fmax_mhz), "period_ns": round(r.period_ns, 6),
            "latency": c.latency, "ii": c.ii, "bound_us": r6(rec["sys_p99_batch_us"]),
            "p99_us": round(m["sys_p99_batch_us"], 6), "batches_ns": [round(float(x), 2) for x in batch],
            "p99_tick": p99_tick, "accept_ns": [round(float(x), 3) for x in acc],
            "result_ns": [round(float(x), 3) for x in res], "meets": bool(m["sys_p99_batch_us"] <= lim),
            "bound_meets": bool(rec["sys_p99_batch_us"] <= lim)}


def deadline_miss(gt: dict[str, Any], ho: dict[str, Any], writeup: str) -> dict[str, Any]:
    s = asic_spec("asic_multiaxis_control")
    w = next(x for x in gt["specs"] if x["name"] == "asic_multiaxis_control")
    meas = {r["key"]: r for r in ho["rows"]}
    win = meas[w["winner"]]
    plain = [r for r in ho["rows"] if r["meets"]["asic_multiaxis_control"]]
    assert len(plain) == 1 and plain[0]["family"] == "pipelined"
    est = evaluate(arch_of(w["winner"]), s)
    designs = [replay_design(w["winner"], s, float(est["fmax_mhz"]), "winner", "estimated"),
               replay_design(w["winner"], s, float(win["fmax_meas"]), "winner", "measured"),
               replay_design(plain[0]["key"], s, float(plain[0]["fmax_meas"]), "pipelined", "measured")]
    # the estimate's p99 is the committed ground truth's; the measured clock's is the held-out table's
    gtw = json.loads((D / "ground_truth_m4.json").read_text())["asic_multiaxis_control"]["selected"]
    assert math.isclose(designs[0]["p99_us"], gtw["sys_p99_batch_us"], rel_tol=1e-6)
    assert f"{designs[1]['p99_us']:.3f}" == "0.567" and f"{designs[2]['p99_us']:.3f}" == f"{plain[0]['p99_measured_clock_us']:.3f}"
    assert designs[0]["meets"] and not designs[1]["meets"] and designs[2]["meets"]
    assert f"{win['fmax_meas']:.1f}" == "72.2" and f"{float(est['fmax_mhz']):.1f}" == "82.5"
    wu = flat(writeup)
    assert ("the model's winner for `asic_multiaxis_control` measures 72.2 MHz against an estimate of 82.5, and at that clock "
            "its simulated p99 batch latency is 0.567 µs against the 0.5 µs deadline") in wu
    scn = s.system
    return {"spec": "asic_multiaxis_control", "tick_ns": 1000.0 / float(scn.loop_rate_mhz), "requests": int(scn.requests_per_tick),
            "n_ticks": scn.n_ticks, "limit_us": s.constraint_for("sys_p99_batch_us", "<=").value, "designs": designs}


# ---------------------------------------------------------------------------
# The structured graph on the ASIC specs
# ---------------------------------------------------------------------------

def asic_eval(md: str, readme: str, writeup: str) -> dict[str, Any]:
    base = list(json.loads((D / "baselines_m4.json").read_text()).values())
    agents = rows4(D / "agent_m4")
    cells: dict[str, Any] = {}
    for metric, title in (("hv_frac", "HV fraction"), ("select_regret", "Selection regret")):
        assert f"**{title}**\n\n| spec | NSGA-II | random | " + " | ".join(f"`{m}`" for m in agents) + " |" in md
        cells[metric] = {}
        f = pct if metric == "select_regret" else ms_fmt
        for name in ASIC_SPECS:
            groups = [("nsga2", [r for r in base if r["spec"] == name and r["method"] == "nsga2"]),
                      ("random", [r for r in base if r["spec"] == name and r["method"] == "random"])]
            groups += [(m, [r for r in agents[m] if r["spec"] == name]) for m in agents]
            texts = []
            cells[metric][name] = {}
            for k, rs in groups:
                assert len(rs) == 5, (name, k)
                t = f([r[metric] for r in rs])
                texts.append(t)
                cells[metric][name][k] = {"text": t, **(stat([r[metric] for r in rs]) or {})}
            line = f"| {name} | " + " | ".join(texts) + " |"
            assert line in md, line
    models = []
    for m, rs in agents.items():
        line = (f"| `{m}` | {len(rs)} | {sum(r['selected_meets_spec'] for r in rs)}/{len(rs)} | "
                f"{sum(r['l2_winner_changed'] for r in rs)} | {sum(r['back_annotation_winner_changed'] for r in rs)} | "
                f"${statistics.mean(r['cost_usd'] for r in rs):.4f} | {ms_fmt([r['wall_s'] for r in rs], digits=0)} |")
        assert line in md, line
        models.append({"model": m, "label": MODEL_LABELS[m], "runs": len(rs), "meets": sum(r["selected_meets_spec"] for r in rs),
                       "l2_changed": sum(r["l2_winner_changed"] for r in rs),
                       "ba_flags": sum(r["back_annotation_winner_changed"] for r in rs),
                       "cost_usd": round(statistics.mean(r["cost_usd"] for r in rs), 6),
                       "wall_s": stat([r["wall_s"] for r in rs]),
                       "input_tokens": stat([r["input_tokens"] for r in rs]),
                       "calls": sum(int(r["llm_calls"]) for r in rs)})
    meets = sum(x["meets"] for x in models)
    runs = sum(x["runs"] for x in models)
    # the record's "45/45 selections meet spec", checked against the summaries
    assert (meets, runs) == (45, 45)
    assert "Every selected design met its spec (45/45)." in flat(readme)
    assert "Every selected design met its spec (15/15 per model)." in flat(writeup)
    return {"cells": cells, "models": models, "meets": meets, "runs": runs,
            "baselines_meet": sum(r["selected_meets_spec"] for r in base), "baseline_runs": len(base)}


# ---------------------------------------------------------------------------
# The A/B: single graph against the fleet
# ---------------------------------------------------------------------------

def ab_arms() -> dict[str, dict[str, list[dict[str, Any]]]]:
    single = rows4(D / "agent_m4")
    for k, v in rows4(D / "fleet_m4/single").items():
        single.setdefault(k, []).extend(v)
    fleets = {a: rows4(D / "fleet_m4" / a) for a in FLEET_ARMS}
    out = {}
    for m in fleets["fleet"]:
        fx = {a: fleets[a].get(m, []) for a in FLEET_ARMS}
        pairs = {(r["spec"], r["seed"]) for rs in fx.values() for r in rs}
        out[m] = {"single": [r for r in single.get(m, []) if (r["spec"], r["seed"]) in pairs], **fx}
    return out


def paired(a: list[dict[str, Any]], b: list[dict[str, Any]], metric: str) -> list[tuple[str, int, float]]:
    """b - a per (spec, seed) both ran, sorted by spec and seed."""
    s = {(r["spec"], r["seed"]): r for r in a}
    out = []
    for r in sorted(b, key=lambda r: (r["spec"], r["seed"])):
        x = s.get((r["spec"], r["seed"]))
        if x is not None and r.get(metric) is not None and x.get(metric) is not None:
            out.append((r["spec"], int(r["seed"]), float(r[metric]) - float(x[metric])))
    return out


def sign_p(d: list[float]) -> tuple[int, int, float]:
    pos, neg = sum(x > 0 for x in d), sum(x < 0 for x in d)
    n = pos + neg
    if n == 0:
        return 0, 0, 1.0
    k = min(pos, neg)
    return pos, neg, min(1.0, 2 * sum(math.comb(n, i) for i in range(k + 1)) / 2 ** n)


def t_test(d: list[float]) -> tuple[float, float, float]:
    """Paired t (two-sided); the tail by integrating Student's t density numerically."""
    n = len(d)
    mean = statistics.fmean(d)
    t = mean / (statistics.stdev(d) / math.sqrt(n))
    df = n - 1
    c = math.exp(math.lgamma((df + 1) / 2) - math.lgamma(df / 2)) / math.sqrt(df * math.pi)
    x = np.linspace(abs(t), abs(t) + 400.0, 4_000_001)
    y = c * (1 + x * x / df) ** (-(df + 1) / 2)
    tail = float(np.sum((y[1:] + y[:-1]) * np.diff(x)) / 2)
    return mean, t, min(1.0, 2 * tail)


def pfmt(p: float) -> str:
    return "<0.001" if p < 0.001 else format(p, ".3f")


def ab(md: str, readme: str, writeup: str) -> dict[str, Any]:
    arms = ab_arms()
    wu, rd = flat(writeup), flat(readme)
    rows = []
    for m, a in arms.items():
        for arm in ("single",) + FLEET_ARMS:
            rs = a[arm]
            if not rs:
                continue
            fails = sum(1 for r in rs if not r["selected_meets_spec"] and not r.get("declared_infeasible"))
            line = (f"| `{m}` | {ARM_LABEL[arm]} | {len(rs)} | {ms_fmt([r['hv_frac'] for r in rs])} | "
                    f"{pct([r['select_regret'] for r in rs])} | {ms_fmt([float(r['n_evals']) for r in rs], digits=0)} | "
                    f"{ms_fmt([r['input_tokens'] for r in rs], digits=0)} | {ms_fmt([r['output_tokens'] for r in rs], digits=0)} | "
                    f"{ms_fmt([r['cost_usd'] for r in rs], digits=4)} | {fails}/{len(rs)} | "
                    f"{sum(int(r['llm_failures']) for r in rs)} | {ms_fmt([r['wall_s'] for r in rs], digits=0)} |")
            assert line in md, line
            dph = sum(r["n_evals"] for r in rs) / sum(r["wall_s"] for r in rs) * 3600
            cps = statistics.mean(r["cost_usd"] for r in rs)
            sph = 3600 / statistics.mean(r["wall_s"] for r in rs)
            tline = (f"| `{m}` | {ARM_LABEL[arm]} | {dph:,.0f} | {cps:.4f} | {dph * 24:,.0f} | {sph * 24:.0f} | "
                     f"{cps * sph * 24:.2f} |")
            assert tline in md, tline
            rows.append({"model": m, "label": MODEL_LABELS[m], "arm": arm, "runs": len(rs),
                         "specs": sorted({r["spec"] for r in rs}, key=(ASIC_SPECS + FPGA_AB_SPECS).index),
                         "hv": stat([r["hv_frac"] for r in rs]), "regret": stat([r["select_regret"] for r in rs]),
                         "evals_min": min(int(r["n_evals"]) for r in rs),
                         "input_tokens": stat([r["input_tokens"] for r in rs]),
                         "output_tokens": stat([r["output_tokens"] for r in rs]),
                         "cost_usd": stat([r["cost_usd"] for r in rs]), "wall_s": stat([r["wall_s"] for r in rs]),
                         "failures": fails, "failed_calls": sum(int(r["llm_failures"]) for r in rs),
                         "designs_per_hour": round(dph, 2), "cost_per_spec": round(cps, 6),
                         "proj_designs_day": round(dph * 24), "proj_specs_day": round(sph * 24),
                         "proj_cost_day": round(cps * sph * 24, 4)})
    assert sum(r["failures"] for r in rows) == 0
    # the paired tests, recomputed independently and compared with the repository's table
    tests = []
    pairs_out: dict[str, Any] = {}
    plan = [(m, "fleet") for m in arms] + [("pooled", "fleet")] + [(m, "fleet_v2") for m in arms if arms[m]["fleet_v2"]] \
        + [(m, "fix_effect") for m in arms if arms[m]["fleet_v2"]]
    for m, arm in plan:
        res: dict[str, Any] = {}
        for met in ("hv_frac", "select_regret"):
            if m == "pooled":
                pr = [x for mm in arms for x in paired(arms[mm]["single"], arms[mm]["fleet"], met)]
            elif arm == "fix_effect":
                pr = paired(arms[m]["fleet"], arms[m]["fleet_v2"], met)
            else:
                pr = paired(arms[m]["single"], arms[m][arm], met)
            d = [x[2] for x in pr]
            pos, neg, sp = sign_p(d)
            mean, t, tp = t_test(d)
            res[met] = {"n": len(d), "pos": pos, "neg": neg, "sign_p": sp, "mean": mean, "t": t, "t_p": tp}
            if m != "pooled":
                pairs_out.setdefault(f"{SHORT[m]}.{arm}", {})[met] = [{"spec": s_, "seed": k, "d": round(v, 6)} for s_, k, v in pr]
        h, g = res["hv_frac"], res["select_regret"]
        line = (f"| `{m}` | {ARM_LABEL[arm]} | {h['n']} | {h['pos']} / {h['neg']} | {pfmt(h['sign_p'])} | {h['mean']:+.3f} | "
                f"{h['t']:.2f} | {pfmt(h['t_p'])} | {g['neg']} / {g['pos']} | {pfmt(g['sign_p'])} | {g['mean'] * 100:+.1f} | "
                f"{g['t']:.2f} | {pfmt(g['t_p'])} |")
        assert line in md, line
        tests.append({"model": m, "label": MODEL_LABELS.get(m, "pooled"), "arm": arm,
                      **{k: {kk: (round(vv, 6) if isinstance(vv, float) else vv) for kk, vv in v.items()} for k, v in res.items()}})
    by = {(t["model"], t["arm"]): t for t in tests}
    pooled = by[("pooled", "fleet")]["hv_frac"]
    q2 = by[("qwen/qwen3.8-27b, reasoning off", "fleet_v2")]["select_regret"]
    ds = by[("deepseek/deepseek-v4.1-flash", "fleet")]["hv_frac"]
    # the write-up's wording of the two headline tests
    assert (pooled["pos"], pooled["n"], f"{pooled['sign_p']:.3f}") == (18, 55, "0.014")
    assert (f"Pooled over the three models, the first fleet had the higher HV in {pooled['pos']} of {pooled['n']} pairs "
            f"(sign test p = {pooled['sign_p']:.3f}). DeepSeek alone: {ds['pos']} of {ds['n']} (p = {ds['sign_p']:.3f}; paired "
            f"t = {ds['t']:.2f}, p = {ds['t_p']:.3f}).").replace("t = -", "t = −") in wu
    assert (q2["neg"], q2["n"], f"{q2['sign_p']:.4f}", f"{q2['mean'] * 100:.1f}") == (22, 25, "0.0002", "-8.6")
    assert "the fixed fleet in 22 of 25 (p = 0.0002), with a mean paired difference of −8.6 points" in wu
    assert "The cold restart did not explain the HV loss." in wu
    # per spec (single → fleet)
    cols = [(m, fa) for m, a in arms.items() for fa in FLEET_ARMS if a.get(fa)]
    per_spec = []
    for name in ASIC_SPECS + FPGA_AB_SPECS:
        cells = []
        for m, fa in cols:
            sx = [r for r in arms[m]["single"] if r["spec"] == name]
            fx = [r for r in arms[m][fa] if r["spec"] == name]
            cells.append(f"{ms_fmt([r['hv_frac'] for r in sx])} → {ms_fmt([r['hv_frac'] for r in fx])}; "
                         f"{pct([r['select_regret'] for r in sx])} → {pct([r['select_regret'] for r in fx])}")
            per_spec.append({"spec": name, "model": m, "arm": fa, "hv": [stat([r["hv_frac"] for r in x]) for x in (sx, fx)],
                             "regret": [stat([r["select_regret"] for r in x]) for x in (sx, fx)]})
        line = f"| {name} | " + " | ".join(cells) + " |"
        assert line in md, line
    # what the fleet did, from the run records
    behaviour = []
    for m, a in arms.items():
        for farm in FLEET_ARMS:
            fx = a[farm]
            if not fx:
                continue
            to_pipe = sum(1 for r in fx if r["phase2_budgets"].get("fsm", 0) == 0)
            fsm_inf = sum(1 for r in fx for mm in r["members"] if mm["member"] == "fsm" and mm["llm_declared_infeasible"])
            line = (f"- `{m}`, {ARM_LABEL[farm]}: phase 2 went entirely to the pipelined member in {to_pipe} of {len(fx)} runs; "
                    f"the fsm member's architect declared its families infeasible {fsm_inf} times; distinct designs in the store "
                    f"per run {ms_fmt([float(r['store_distinct_designs']) for r in fx], digits=0)}.")
            assert line in md, line
            behaviour.append({"model": m, "arm": farm, "phase2_all_pipelined": to_pipe, "runs": len(fx),
                              "fsm_declared_infeasible": fsm_inf, "store_distinct": stat([r["store_distinct_designs"] for r in fx])})
    # cost ratios and throughput as the write-up words them
    ratio = {}
    for m in arms:
        s1 = next(r for r in rows if r["model"] == m and r["arm"] == "single")["cost_usd"]["mean"]
        f1 = next(r for r in rows if r["model"] == m and r["arm"] == "fleet")["cost_usd"]["mean"]
        ratio[SHORT[m]] = round(f1 / s1, 4)
    assert (f"The fleet costs {ratio['qwen']:.2f} (Qwen), {ratio['deepseek']:.2f} (DeepSeek) and {ratio['sonnet']:.2f} (Sonnet) "
            "times as much per spec.") in wu
    dph = {f"{SHORT[r['model']]}.{r['arm']}": r["designs_per_hour"] for r in rows}
    assert (f"single {dph['qwen.single']:,.0f} (Qwen), {dph['deepseek.single']:,.0f} (DeepSeek), {dph['sonnet.single']:,.0f} "
            f"(Sonnet, one spec); first fleet {dph['qwen.fleet']:,.0f}, {dph['deepseek.fleet']:,.0f} and {dph['sonnet.fleet']:,.0f}; "
            f"fixed Qwen fleet {dph['qwen.fleet_v2']:,.0f}.") in wu
    assert "Sonnet's fleet arm on `asic_multiaxis_control` only, for the spend cap" in wu
    sonnet_specs = next(r for r in rows if r["model"].startswith("anthropic/") and r["arm"] == "fleet")["specs"]
    assert sonnet_specs == ["asic_multiaxis_control"]
    assert "The fixed fleet ran hours after the single arm it is paired with" in wu
    # when each arm ran: the single Qwen arm and the fixed fleet (the confound)
    def span(rs: list[dict[str, Any]]) -> list[str]:
        st = sorted(re.search(r"(\d{8}-\d{6})", r["run_dir"]).group(1) for r in rs)  # type: ignore[union-attr]
        return [st[0], st[-1]]
    q = arms["qwen/qwen3.8-27b, reasoning off"]
    when = {"qwen.single": span(q["single"]), "qwen.fleet_v2": span(q["fleet_v2"]), "qwen.fleet": span(q["fleet"])}
    return {"specs": list(ASIC_SPECS + FPGA_AB_SPECS), "rows": rows, "tests": tests, "pairs": pairs_out, "per_spec": per_spec,
            "behaviour": behaviour, "cost_ratio": ratio, "when": when,
            "sonnet_specs": sonnet_specs}


# ---------------------------------------------------------------------------
# One fleet run, rebuilt from its members' archived evaluations
# ---------------------------------------------------------------------------

NUM_INT = ("data_width", "n_iter", "angle_guard", "frac_guard", "k", "m", "latency_cycles")


def read_evals(p: Path) -> list[dict[str, Any]]:
    out = []
    with gzip.open(p, "rt", newline="", encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            rec: dict[str, Any] = {}
            for k, v in r.items():
                if k in ("family", "rounding", "key") or k.startswith("provenance"):
                    rec[k] = v
                elif k == "feasible":
                    rec[k] = v == "True"
                elif k in NUM_INT:
                    if v not in ("", None):
                        rec[k] = int(float(v))
                elif k in ("eval_index", "round"):
                    rec[k] = int(v)
                else:
                    rec[k] = float(v) if v not in ("", None) else float("nan")
            out.append(rec)
    return out


def fleet_run(md: str) -> dict[str, Any]:
    arm, model_dir, spec_name, seed = FLEET_RUN
    summ = json.loads((D / "fleet_m4" / arm / model_dir / f"{spec_name}_seed{seed}.json").read_text())
    s = asic_spec(spec_name)
    run = Path(summ["run_dir"]).name
    tdir = D / "traces/m4" / arm / spec_name / run
    members = []
    recs_by: dict[tuple[str, int], list[dict[str, Any]]] = {}
    for mm in summ["members"]:
        ev = read_evals(tdir / f"{mm['member']}-p{mm['phase']}" / "evaluations.csv.gz")
        assert len(ev) == mm["n_evals"] == mm["budget"], (mm["member"], len(ev))
        recs_by[(mm["member"], mm["phase"])] = ev
        members.append({k: mm[k] for k in ("member", "families", "phase", "budget", "status", "rounds", "decisions",
                                           "llm_declared_infeasible", "n_evals", "wall_s")} | {"cost_usd": r6(mm["cost_usd"])})
    order = [(m, f) for m, f in fco.SPLIT_BY_CLASS]
    p1 = [recs_by[(m, 1)] for m, _ in order]
    recs1 = fco.interleave(p1)
    les = fco.compute_lessons(recs1, s, fco.SPLIT_BY_CLASS)
    for fam, v in summ["lessons"].items():
        for k, x in v.items():
            y = les[fam][k]
            assert (x == y) if not isinstance(x, float) else math.isclose(x, y, rel_tol=1e-9), (fam, k, x, y)
    # the phase-2 split: the merged front's share per member
    front1 = merged_front(recs1, s)
    weights = [float(sum(r["family"] in fams for r in front1)) for _, fams in order]
    remaining = s.budget.total_evals - len(recs1)
    p2b = fco.split(remaining, weights if sum(weights) else [1.0] * len(order))
    assert dict(zip([m for m, _ in order], p2b)) == summ["phase2_budgets"]
    # the Store after phase 1, and the warm-start seeds a phase-2 study of each family reads
    st = fstore.new_store()
    for (m, ph), ev in recs_by.items():
        if ph == 1:
            fstore.put_evaluations(st, s.name, m, ev)
    seeds = {fam: [ArchConfig.from_params(fam, p).key() for p in fstore.front_designs(st, s, fam)]
             for _, fams in order for fam in fams}
    p2 = [recs_by[(m, 2)] for m, _ in order if (m, 2) in recs_by]
    allrecs = recs1 + fco.interleave(p2)
    keys = {r["key"] for r in allrecs}
    assert len(keys) == summ["store_distinct_designs"]
    counts: dict[str, int] = {}
    for (m, _), ev in recs_by.items():
        counts[m] = counts.get(m, 0) + len(ev)
    assert counts == summ["store_evaluations_by_member"]
    front = merged_front(allrecs, s)
    sel = select_design(front, s)
    assert sel["key"] == summ["selected_key"] and math.isclose(summ["n_evals"], len(allrecs))
    front_keys = {r["key"] for r in front}
    sel_by = s.select_by

    def lane(ev: list[dict[str, Any]]) -> list[list[Any]]:
        # family index, feasible, the selection metric (feasible designs), on the final merged front
        fams = ["iterative", "unrolled_k", "pipelined", "pipelined_m"]
        return [[fams.index(r["family"]), int(bool(r["feasible"])), r6(r[sel_by]) if r["feasible"] else None,
                 int(r["key"] in front_keys)] for r in ev]
    lanes = [{"member": m, "phase": ph, "evals": lane(ev)} for (m, ph), ev in recs_by.items()]
    distinct_after_p1 = len({r["key"] for r in recs1})
    gt = json.loads((D / "ground_truth_m4.json").read_text())[spec_name]
    return {"arm": arm, "model": label_of(summ), "spec": spec_name, "seed": seed, "select_by": sel_by,
            "budget": s.budget.total_evals, "members": members, "lanes": lanes,
            "lessons": {f: {k: (r6(v) if isinstance(v, float) else v) for k, v in x.items()} for f, x in les.items()},
            "phase2_budgets": summ["phase2_budgets"], "front1_share": dict(zip([m for m, _ in order], weights)),
            "seeds": seeds, "distinct_after_p1": distinct_after_p1, "distinct": len(keys),
            "front_size": len(front), "selected": sel["key"], "selected_value": r6(sel[sel_by]),
            "true_winner": gt["selected"]["key"], "true_value": r6(gt["selected"][sel_by]),
            "regret": r6(summ["select_regret"]), "hv_frac": r6(summ["hv_frac"]), "cost_usd": r6(summ["cost_usd"]),
            "wall_s": summ["wall_s"], "llm_calls": int(summ["llm_calls"])}


# ---------------------------------------------------------------------------
# L2 -> L1 feedback, spend, and what M4 left untouched
# ---------------------------------------------------------------------------

def feedback(md: str, writeup: str) -> dict[str, Any]:
    fb = json.loads((D / "l2_feedback_m4.json").read_text())
    v1 = json.loads((D / "l2_feedback_m4_v1_floor1.json").read_text())
    assert "## L2 -> L1 feedback\n\n" + fb["summary_md"] in md
    text = flat(fb["summary_md"])
    m = re.search(r"\*\*fires in (\d+) of (\d+) recorded searches and (\d+) of (\d+) live M4 runs\*\*", text)
    assert m, text[:200]
    rec_f, rec_n, live_f, live_n = map(int, m.groups())
    m2 = re.search(r"(\d[\d,]*) designs pass the L1 bound, (\d+) the simulation", text)
    m3 = re.search(r"it fires in \*\*(\d+) of (\d+)\*\* searches", text)
    m4 = re.search(r"recovers a passing design in \*\*(\d+) of (\d+)\*\* \(regret ([+\-\d.]+)% ± ([\d.]+)\)", text)
    m5 = re.search(r"recovers in \*\*(\d+) of (\d+)\*\*", text)
    assert m2 and m3 and m4 and m5
    assert (rec_f, rec_n, live_f, live_n) == (0, 92, 0, 60)
    fired, searches = int(m3.group(1)), int(m3.group(2))
    rc, rn = int(m4.group(1)), int(m4.group(2))
    uc, un = int(m5.group(1)), int(m5.group(2))
    assert (fired, searches, rc, rn, uc, un) == (3, 15, 3, 3, 1, 3)
    table = []
    for line in fb["summary_md"].splitlines():
        if line.startswith("| ") and not line.startswith("| search") and "---" not in line:
            c = [x.strip() for x in line.strip("|").split("|")]
            table.append({"search": c[0], "l1_feasible": int(c[1]), "pass_l2": int(c[2]), "fires": c[3] == "yes",
                          "corrected": c[4], "uncorrected": c[5]})
    assert len(table) == searches and sum(r["fires"] for r in table) == fired
    v1t = flat(v1["summary_md"])
    v1m = re.search(r"it fires in \*\*(\d+) of (\d+)\*\* searches", v1t)
    assert v1m and (int(v1m.group(1)), int(v1m.group(2))) == (6, 15)
    wu = flat(writeup)
    assert "It never fires on the committed specs: 0 of 92 recorded searches" in wu
    assert "recovered, in 1 of 3" not in wu and "recovered in 1 of 3" in wu
    return {"recorded": [rec_f, rec_n], "live": [live_f, live_n], "l1_bound_feasible": int(m2.group(1).replace(",", "")),
            "sim_feasible": int(m2.group(2)), "fired": [fired, searches], "recovered": [rc, rn],
            "regret": [float(m4.group(3)) / 100, float(m4.group(4)) / 100], "uncorrected": [uc, un], "table": table,
            "v1": {"fired": [int(v1m.group(1)), int(v1m.group(2))], "floor_msps": 1}, "burst": 32, "rate_msps": 130,
            "floor_msps": 130, "p99_us": 0.4, "rounds": 3, "evals_per_round": 60}


def spend(md: str, readme: str) -> dict[str, Any]:
    rows = [json.loads(x) for x in (D / "spend_ledger.jsonl").read_text().splitlines() if x.strip()]
    rows = [r for r in rows if r.get("milestone", "m1") == "m4"]
    by: dict[str, float] = {}
    n: dict[str, int] = {}
    for r in rows:
        k = f"{r['model']} / {r.get('arm')}" + (f" ({r['note']})" if r.get("note") else "")
        by[k] = by.get(k, 0.0) + float(r.get("cost_usd") or 0)
        n[k] = n.get(k, 0) + 1
    for k in sorted(by):
        assert f"| {k} | {n[k]} | {by[k]:.4f} |" in md, k
    total = sum(by.values())
    assert f"| **total** | {len(rows)} | **{total:.4f}** |" in md
    ku = json.loads((D / "key_usage_m4.json").read_text())
    snaps = ku["snapshots"]
    line = "Key usage snapshots (authoritative; `eval/data/key_usage_m4.json`): " + "; ".join(
        f"{k} {v['ts']} ${v['usage_usd']:.4f}" for k, v in snaps.items()) + "."
    assert line in md, line
    start = snaps["session_start_before_any_m4_call"]["usage_usd"]
    first = snaps["after_eval_final"]["usage_usd"]
    rerun0, rerun1 = snaps["before_fleet_v2_qwen"]["usage_usd"], snaps["after_fleet_v2_qwen"]["usage_usd"]
    key_total = rerun1 - start
    assert key_total <= ku["m4_spend_cap_usd"]
    assert f"{key_total:.2f}" == "4.15" and f"{first - start:.2f}" == "3.83" and f"{rerun1 - rerun0:.2f}" == "0.32"
    assert math.isclose(first - start + rerun1 - rerun0, key_total, abs_tol=1e-9)  # nothing spent between the two
    rd = flat(readme)
    assert (f"(2026-10-10T23:07:37Z) after the post-review Qwen fleet re-run (${rerun1 - rerun0:.4f} by the key): "
            f"**${key_total:.2f} for M4**, under the ${ku['m4_spend_cap_usd']:.0f} cap. Provider-reported ledger: "
            f"${total:.4f} over {len(rows)} runs") in rd
    # the archived traces' provider-reported cost is INDEX.md's figure
    tr, calls, runs = 0.0, 0, 0
    for p in sorted((D / "traces/m4").glob("**/llm_trace.jsonl")):
        runs += 1
        for x in p.read_text().splitlines():
            if x.strip():
                tr += float(json.loads(x).get("cost_usd") or 0.0)
                calls += 1
    assert f"Provider-reported cost of these runs: ${tr:.4f}." in (D / "traces/m4/INDEX.md").read_text()
    # the summaries' costs agree with the ledger, arm by arm
    sums = {"structured": math.fsum(r["cost_usd"] for rs in rows4(D / "agent_m4").values() for r in rs),
            "single": math.fsum(r["cost_usd"] for rs in rows4(D / "fleet_m4/single").values() for r in rs),
            "fleet": math.fsum(r["cost_usd"] for rs in rows4(D / "fleet_m4/fleet").values() for r in rs),
            "fleet_v2": math.fsum(r["cost_usd"] for rs in rows4(D / "fleet_m4/fleet_v2").values() for r in rs)}
    led = {"structured": sum(v for k, v in by.items() if k.endswith("(structured)")),
           "single": sum(v for k, v in by.items() if k.endswith("(single)")),
           "fleet": sum(v for k, v in by.items() if k.endswith("/ fleet")),
           "fleet_v2": sum(v for k, v in by.items() if k.endswith("(v2)"))}
    for k in sums:
        assert f"{sums[k]:.4f}" == f"{led[k]:.4f}", (k, sums[k], led[k])
    pilots = sum(v for k, v in by.items() if "(pilot)" in k)
    mc = json.loads((D / "models_check_m4.json").read_text())
    assert all(v["listed"] and v["tools"] and v["structured_outputs"] for v in mc["models"].values())
    assert mc["ts"] < snaps["session_start_before_any_m4_call"]["ts"]
    return {"ledger": [{"entry": k, "runs": n[k], "usd": round(by[k], 4)} for k in sorted(by)],
            "ledger_total_usd": round(total, 4), "ledger_entries": len(rows),
            "key_start_usd": round(start, 6), "key_first_usd": round(first, 6), "key_end_usd": round(rerun1, 6),
            "key_first_pass_usd": round(first - start, 6), "key_rerun_usd": round(rerun1 - rerun0, 6),
            "key_usd": round(key_total, 6), "cap_usd": ku["m4_spend_cap_usd"],
            "limit_usd": snaps["after_fleet_v2_qwen"]["limit_usd"],
            "snapshots": [{"name": k, "ts": v["ts"], "usd": round(v["usage_usd"], 6)} for k, v in snaps.items()],
            "by_arm": {k: round(v, 4) for k, v in led.items()}, "pilots_usd": round(pilots, 4),
            "trace_usd": round(tr, 4), "trace_calls": calls, "trace_runs": runs,
            "models_checked": {"ts": mc["ts"], "listed": mc["n_models_listed"], "models": sorted(mc["models"])}}


def untouched(md: str) -> dict[str, Any]:
    """M4 left the FPGA path's committed record as it was: results.md and the ledger only grew
    (their a92fe65 contents are an exact prefix), and the M2 replay record is unchanged."""
    head = md.split("# Milestone 4:", 1)[0]
    assert (len(head), sha(head)) == RESULTS_A92FE65
    led = (D / "spend_ledger.jsonl").read_text()
    old = "".join(led.splitlines(keepends=True)[:LEDGER_A92FE65[0]])
    assert sha(old) == LEDGER_A92FE65[1]
    rp = json.loads((D / "m2_replay.json").read_text())
    assert rp["n_identical"] == rp["n_runs"] == 60
    m3 = sum(1 for _ in (D / "agent_m3").glob("*/*.json"))
    assert m3 == 30
    return {"results_prefix_sha256": RESULTS_A92FE65[1], "ledger_prefix_entries": LEDGER_A92FE65[0],
            "m2_replays": rp["n_runs"], "m3_structured_runs": m3}


def build(readme: str) -> dict[str, Any]:
    md = (V / "eval/results.md").read_text()
    writeup = (V / "docs/WRITEUP.md").read_text()
    gt = ground_truth(md, writeup, readme)
    ho = held_out(md, writeup)
    return {
        "calibration": calibration(md),
        "ground_truth": gt,
        "held_out": ho,
        "deadline": deadline_miss(gt, ho, writeup),
        "asic_eval": asic_eval(md, readme, writeup),
        "ab": ab(md, readme, writeup),
        "fleet_run": fleet_run(md),
        "feedback": feedback(md, writeup),
        "spend": spend(md, readme),
        "untouched": untouched(md),
        "writeup": {"words": len(re.sub(r"```.*?```|<!--.*?-->", " ", writeup, flags=re.S).split()),
                    "sha256": sha(writeup)},
    }
