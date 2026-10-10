"""Milestone 3's data for the site: L2 (the cycle model and the SimPy system models), the
system-level specs, the structured graph on them, the A/B against the campaign agent, memory on
and off, the gated `map_front` fix, the M2 replay proof and the M3 spend.

Imported by scripts/export_dse.py, which writes the result to src/data/m3.json. As for M1 and
M2, every table row the site shows is re-made here from the vendored summaries, formatted the
way eval/run_eval.py formats it, and asserted to appear literally in eval/results.md; the
README's prose figures the site repeats are recomputed and asserted too. Three things are
recomputed with the Python reference at the vendored commit rather than read:

- the system replay (How it works): the `multiaxis_control` control loop simulated by
  hw_dse.l2.system for the true winner (m=4), the L1-bound winner (m=5) and the MSPS-only winner
  (m=7); the simulated p99 batch latencies must equal the committed ground truth;
- the cycle-model waveforms: the L3 harness's bursty stimulus (hw_dse.l2.validate's traces)
  replayed into hw_dse.l2.cycle's model, closed loop, edge by edge; every one of the 24 traces
  must take exactly as many edges, accepts and results as the RTL log recorded in
  eval/data/l2_cycle_validation.csv;
- the peak-rate view of the two system specs (the README's comparison: the MSPS-only spec with
  its floor at the burst's or the tick's peak rate), over the exhaustive grid.
"""
from __future__ import annotations

import csv
import json
import math
import re
import statistics
from pathlib import Path
from typing import Any

import numpy as np

from hw_dse.benchmark import build_grid, ground_truth
from hw_dse.evaluate import evaluate
from hw_dse.families import ArchConfig
from hw_dse.l2.cycle import Contract, CycleModel
from hw_dse.l2.node import simulate_record
from hw_dse.l2.system import metrics, simulate
from hw_dse.l2.validate import CYCLE_CHECK_DESIGNS, bursty_trace
from hw_dse.spec import Constraint, Spec, load_spec

V = Path(__file__).resolve().parent.parent / "vendor/hw_dse"
D = V / "eval/data"

M2_SPECS = ("dds_250msps", "high_precision", "infeasible_dds_400msps", "low_area_control")
EVAL_SPECS = ("multiaxis_control", "bursty_offload")
MEMORY_SEQUENCE = ("low_area_control", "bursty_offload", "dds_250msps", "multiaxis_control")
SYS_METRICS = ("sys_p99_batch_us", "sys_p99_latency_us", "sys_p50_latency_us", "sys_stall_frac", "sys_sfdr_dbc",
               "sys_throughput_msps", "sys_max_queue", "sys_utilisation")

MODEL_LABELS = {
    "anthropic/claude-sonnet-5.5": "Sonnet 5.5",
    "deepseek/deepseek-v4.1-flash": "DeepSeek V4.1 Flash",
    "qwen/qwen3.8-27b, reasoning off": "Qwen3.8-27B, reasoning off",
}


# ---------------------------------------------------------------------------
# eval/run_eval.py's formatting, character for character (as in export_dse.py)
# ---------------------------------------------------------------------------

def ms_fmt(xs: list[float | None], pct: bool = False, signed: bool = False, digits: int = 3) -> str:
    v = [x for x in xs if x is not None and not (isinstance(x, float) and math.isnan(x))]
    if not v:
        return "n/a"
    k = 100.0 if pct else 1.0
    d = 1 if pct else digits
    m = f"{statistics.mean(v) * k:{'+' if signed else ''}.{d}f}" + ("%" if pct else "")
    if len(v) == 1:
        return m
    return f"{m} ± {statistics.pstdev(v) * k:.{d}f}"


def evals_fmt(xs: list[int | None]) -> str:
    hit = [x for x in xs if x is not None]
    if not xs:
        return "n/a"
    if not hit:
        return f"not reached (0/{len(xs)})"
    return f"{statistics.median(hit):.0f} ({len(hit)}/{len(xs)} reached)"


def optimal_fmt(xs: list[float | None]) -> str:
    return f"{sum(1 for x in xs if x is not None and x <= 1e-9)}/{len(xs)}"


def stat(xs: list[float | None]) -> dict[str, Any] | None:
    v = [float(x) for x in xs if x is not None]
    if not v:
        return None
    return {"mean": round(statistics.mean(v), 6), "std": round(statistics.pstdev(v), 6), "n": len(v)}


def label_of(row: dict[str, Any]) -> str:
    return row["model_requested"] + ("" if row["reasoning"] == "provider default" else f", reasoning {row['reasoning']}")


def load_rows(d: Path) -> dict[str, list[dict[str, Any]]]:
    """run_eval.py's _load_rows: summaries by model, sorted paths, failed pilot attempts skipped."""
    out: dict[str, list[dict[str, Any]]] = {}
    for p in sorted(d.glob("*/*.json")):
        row = json.loads(p.read_text())
        if "attempt" in row:
            continue
        out.setdefault(label_of(row), []).append(row)
    return out


def flat(text: str) -> str:
    return " ".join(text.split())


def sys_spec(name: str) -> Spec:
    return load_spec(V / "specs/system" / f"{name}.yaml")


def params_from_key(key: str) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for kv in key.split(":", 1)[1].split(","):
        k, v = kv.split("=")
        out[k] = v if k == "rounding" else int(v)
    return out


def arch_of(key: str) -> ArchConfig:
    return ArchConfig.from_params(key.split(":")[0], params_from_key(key))


def r6(x: float) -> float:
    return float(f"{float(x):.6g}")


# ---------------------------------------------------------------------------
# System specs: ground truth, three views, plus the peak-rate view
# ---------------------------------------------------------------------------

def sys_design(key: str, s: Spec) -> dict[str, Any]:
    """A design under a system spec: L1 numbers, the L1 bound of each system metric and the
    simulated value (the reference, at the vendored commit)."""
    rec = evaluate(arch_of(key), s)
    sim = simulate_record(rec, s)
    out: dict[str, Any] = {
        "key": key, "family": rec["family"], "params": params_from_key(key),
        **{k: r6(rec[k]) for k in ("luts", "ffs", "luts_plus_ffs", "fmax_mhz", "throughput_msps", "accuracy_bits",
                                   "max_abs_err")},
        "latency_cycles": int(rec["latency_cycles"]),
        "bound": {}, "simulated": {}, "feasible_simulated": bool(sim["feasible"]), "feasible_bound": bool(rec["feasible"]),
    }
    for c in s.system_constraints:
        out["bound"][c.metric] = r6(rec[c.metric])
        out["simulated"][c.metric] = r6(sim[c.metric])
    return out


def system_ground_truth(md: str, readme: str) -> dict[str, Any]:
    gt3 = json.loads((D / "ground_truth_m3.json").read_text())
    rows = []
    for name, g in gt3.items():
        s = sys_spec(name)
        sel, bsel, msel = g["selected"], g["l1_bound_selected"], g["msps_only"]["selected"]

        def k(r: dict[str, Any] | None) -> str:
            return f"`{r['key']}` ({r[s.select_by]:.0f})" if r else "none"
        line = (f"| {name}{'' if g['eval'] else ' (ground truth only)'} | {s.system.describe() if s.system else ''} | "
                f"{g['n_feasible']:,} / {g['n_feasible_l1_bound']:,} / {g['msps_only']['n_feasible']:,} | {k(sel)} | "
                f"{k(bsel)} | {k(msel)} | {'**yes**' if g['winner_changes_vs_msps_only'] else 'no'} |")
        assert line in md, line
        sysv = ", ".join(f"{c.metric} = {sel[c.metric]:.4g} (limit {c.value:g})" for c in s.system_constraints)
        bullet = (f"- `{name}` true winner: {sel['luts']:.0f} LUTs / {sel['ffs']:.0f} FFs, {sel['throughput_msps']:.1f} MSPS, "
                  f"{sel['accuracy_bits']:.2f} bits; {sysv} (simulated).")
        assert bullet in md, bullet
        true = sys_design(sel["key"], s)
        bound = sys_design(bsel["key"], s)
        msps = sys_design(msel["key"], s)
        # the committed ground truth's metrics are what the reference computes today: the true
        # winner's simulated, the L1-bound winner's as L1 screening saw them (the bound)
        for c in s.system_constraints:
            assert math.isclose(true["simulated"][c.metric], sel[c.metric], rel_tol=1e-5), (name, c.metric)
            assert math.isclose(bound["bound"][c.metric], bsel[c.metric], rel_tol=1e-5), (name, c.metric)
        assert true["feasible_simulated"] and true["feasible_bound"]
        rows.append({
            "name": name, "eval": g["eval"], "system": s.system.describe(), "kind": s.system.kind,
            "description": flat(s.description),
            "constraints": [{"metric": c.metric, "op": c.op, "value": c.value} for c in s.constraints],
            "offered_rate_msps": s.system.offered_rate_msps,
            "n_designs": g["n_designs"], "n_feasible": g["n_feasible"], "n_feasible_l1_bound": g["n_feasible_l1_bound"],
            "n_feasible_msps_only": g["msps_only"]["n_feasible"], "winner_changes": g["winner_changes_vs_msps_only"],
            "true": true, "bound": bound, "msps_only": msps,
        })
    by = {r["name"]: r for r in rows}
    # The README's peak-rate comparison, recomputed over the exhaustive grid: the MSPS-only view
    # with the throughput floor at the peak rate the system needs (a burst, or a tick's batch,
    # inside the latency limit) instead of the average rate.
    grid = build_grid()
    peaks = {}
    for name in EVAL_SPECS:
        s = sys_spec(name)
        if s.system.kind == "control_loop":
            n, lim = int(s.system.requests_per_tick), s.constraint_for("sys_p99_batch_us", "<=").value
        else:
            n, lim = int(s.system.burst_size), s.constraint_for("sys_p99_latency_us", "<=").value
        alt = s.without_system()
        cons = [c if c.metric != "throughput_msps" else Constraint(metric="throughput_msps", op=">=", value=n / lim)
                for c in alt.constraints]
        g = ground_truth(grid, alt.model_copy(update={"constraints": cons, "name": f"{name}__peak_rate"}))
        peaks[name] = {"requests": n, "within_us": lim, "floor_msps": round(n / lim, 4), "n_feasible": g["n_feasible"],
                       "winner": g["selected"]["key"], "winner_luts_plus_ffs": r6(g["selected"]["luts_plus_ffs"])}
        by[name]["peak_rate"] = peaks[name]
    rd = flat(readme)
    b, m = peaks["bursty_offload"], peaks["multiaxis_control"]
    assert b["winner"] == by["bursty_offload"]["true"]["key"] and b["n_feasible"] == by["bursty_offload"]["n_feasible"]
    assert ("sizing for the burst (8 requests in 0.4 µs = 20 MSPS) instead of the average rate gives the same winner "
            "and the identical feasible set") in rd
    assert m["winner"] == by["multiaxis_control"]["bound"]["key"] and m["n_feasible"] > by["multiaxis_control"]["n_feasible"]
    assert "A peak-rate floor (32 / 0.44 µs = 72.7 MSPS) stops at m=5, the bound's winner; only the simulation gets to m=4." in rd
    assert f"{m['floor_msps']:.1f}" == "72.7" and f"{b['floor_msps']:g}" == "20"
    # the bound's winner misses the deadline by 1.5% in the simulation
    mb = by["multiaxis_control"]["bound"]
    miss = mb["simulated"]["sys_p99_batch_us"] / 0.44 - 1
    assert f"{miss:.1%}" == "1.5%" and "(m=5, simulated 0.4465 µs) misses the deadline by 1.5%" in rd
    return {"specs": rows, "n_tuples": 1092}


# ---------------------------------------------------------------------------
# L2: the system replay (multiaxis_control) and the cycle model against the RTL
# ---------------------------------------------------------------------------

def system_replay(gt: dict[str, Any]) -> dict[str, Any]:
    """The control loop, simulated for the three winners: per tick, the batch latency (tick to
    the 32nd result); for the p99 tick, every request's accepting edge and result time."""
    s = sys_spec("multiaxis_control")
    scn = s.system
    tick_ns = 1000.0 / float(scn.loop_rate_mhz)
    row = next(r for r in gt["specs"] if r["name"] == "multiaxis_control")
    out = []
    for view in ("msps_only", "bound", "true"):
        d = row[view]
        a = arch_of(d["key"])
        c = Contract.of(a)
        r = simulate(scn, c, float(evaluate(a, s)["fmax_mhz"]))
        m = metrics(scn, r)
        assert math.isclose(m["sys_p99_batch_us"], d["simulated"]["sys_p99_batch_us"], rel_tol=1e-5)
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
        assert np.allclose(res - acc, (c.latency - 1) * r.period_ns)
        assert np.allclose(np.diff(acc), c.ii * r.period_ns)  # back to back, one per edge
        out.append({
            "view": view, "key": d["key"], "m": d["params"].get("m"), "luts_plus_ffs": d["luts_plus_ffs"],
            "fmax_mhz": d["fmax_mhz"], "period_ns": round(r.period_ns, 6), "latency": c.latency, "ii": c.ii,
            "bound_us": d["bound"]["sys_p99_batch_us"], "p99_us": round(m["sys_p99_batch_us"], 6),
            "batch_min_us": round(float(batch.min()) / 1000, 6), "batch_max_us": round(float(batch.max()) / 1000, 6),
            "batches_ns": [round(float(x), 2) for x in batch],
            "p99_tick": p99_tick,
            "accept_ns": [round(float(x), 3) for x in acc], "result_ns": [round(float(x), 3) for x in res],
            "meets": bool(m["sys_p99_batch_us"] <= 0.44), "bound_meets": bool(d["bound"]["sys_p99_batch_us"] <= 0.44),
        })
    return {"spec": "multiaxis_control", "tick_ns": tick_ns, "requests": int(scn.requests_per_tick), "n_ticks": scn.n_ticks,
            "limit_us": s.constraint_for("sys_p99_batch_us", "<=").value, "designs": out}


def harness_trace(a: ArchConfig, seed: int, n: int = 60) -> dict[str, np.ndarray]:
    """The L3 harness's L2 stimulus (tb_generated.sv with +gaps=), replayed into the cycle model:
    angle i is offered after gaps[i] idle edges and held on valid_in until accepted; the run ends
    on the edge that produces the last result. Closed loop, so the model's ready decides."""
    u, gaps = bursty_trace(n, seed)
    w = a.numerics.data_width
    angles = (np.floor(u * (1 << w)) - (1 << (w - 1))).astype(np.int64)
    vin: list[bool] = []
    th: list[int] = []
    n_acc, gap = 0, int(gaps[0])
    model = CycleModel(a)
    while True:
        if n_acc < n and gap > 0:
            vin.append(False)
            gap -= 1
        else:
            vin.append(n_acc < n)
        th.append(int(angles[min(n_acc, n - 1)]))
        tr = model.run(np.array(vin), np.array(th))
        if tr.accepted[-1]:
            n_acc += 1
            if n_acc < n:
                gap = int(gaps[n_acc])
        if int(tr.valid_out.sum()) >= n:
            return {"valid_in": tr.valid_in, "ready": tr.ready, "accepted": tr.accepted, "valid_out": tr.valid_out}


def cycle_validation(md: str) -> dict[str, Any]:
    rows = list(csv.DictReader(open(D / "l2_cycle_validation.csv", newline="", encoding="utf-8")))
    sims = sorted({r["simulator_version"] for r in rows})
    line = (f"{len(rows)} short bursty traces (8 designs covering every family and both rounding modes x 3 seeds x "
            f"{', '.join(sims)}), {sum(int(r['n_edges']) for r in rows):,} clock edges: **"
            f"{sum(r['passed'] == 'True' for r in rows)}/{len(rows)} identical** on ready, valid_out and the output codes "
            f"(ready mismatches {sum(int(r['ready_mismatches']) for r in rows)}, valid {sum(int(r['valid_mismatches']) for r in rows)}, "
            f"data {sum(int(r['data_mismatches']) for r in rows)}). Source: `eval/data/l2_cycle_validation.csv`.")
    assert line in md, line
    assert len(rows) == 48 and all(r["passed"] == "True" for r in rows)
    designs = []
    waves = {}
    for a in CYCLE_CHECK_DESIGNS:
        c = Contract.of(a)
        mine = [r for r in rows if r["key"] == a.key()]
        assert len(mine) == 6
        seeds = []
        for seed in (1, 2, 3):
            t = harness_trace(a, seed)
            for r in (x for x in mine if x["seed"] == str(seed)):
                # the RTL log has one row more than the model's edges (the last result is
                # logged on the edge after the one that produced it)
                assert int(r["n_edges"]) == len(t["ready"]) + 1, (a.key(), seed, r["simulator"])
                assert int(r["n_accepts"]) == int(t["accepted"].sum()) == int(r["n_angles"])
                assert int(r["n_results"]) == int(t["valid_out"].sum())
            seeds.append({"seed": seed, "edges": int(mine[[x["seed"] for x in mine].index(str(seed))]["n_edges"])})
            if seed == 1 and a.key() in (CYCLE_CHECK_DESIGNS[0].key(), CYCLE_CHECK_DESIGNS[6].key()):
                N = 96
                bits = lambda x: "".join("1" if b else "0" for b in x[:N])  # noqa: E731
                waves[a.key()] = {"key": a.key(), "family": a.family, "latency": c.latency, "ii": c.ii, "seed": seed,
                                  "edges_total": len(t["ready"]) + 1, "valid_in": bits(t["valid_in"]),
                                  "ready": bits(t["ready"]), "accepted": bits(t["accepted"]),
                                  "valid_out": bits(t["valid_out"])}
        designs.append({
            "key": a.key(), "family": a.family, "latency": c.latency, "ii": c.ii,
            "seeds": seeds,
            "runs": [{"simulator": r["simulator"], "version": r["simulator_version"], "seed": int(r["seed"]),
                      "edges": int(r["n_edges"]), "accepts": int(r["n_accepts"]), "results": int(r["n_results"]),
                      "ready_mismatches": int(r["ready_mismatches"]), "valid_mismatches": int(r["valid_mismatches"]),
                      "data_mismatches": int(r["data_mismatches"])} for r in mine],
        })
    return {"traces": len(rows), "edges": sum(int(r["n_edges"]) for r in rows), "simulators": sims,
            "angles_per_trace": int(rows[0]["n_angles"]), "passed": sum(r["passed"] == "True" for r in rows),
            "designs": designs, "waves": [waves[CYCLE_CHECK_DESIGNS[0].key()], waves[CYCLE_CHECK_DESIGNS[6].key()]]}


# ---------------------------------------------------------------------------
# The eval: the structured graph on the system specs, the A/B, memory, the levers
# ---------------------------------------------------------------------------

def structured(md: str) -> dict[str, Any]:
    base3 = list(json.loads((D / "baselines_m3.json").read_text()).values())
    ag3 = load_rows(D / "agent_m3")
    gt3 = json.loads((D / "ground_truth_m3.json").read_text())
    methods = [("nsga2", "NSGA-II", "baseline (a): NSGA-II + L2 shortlist", [r for r in base3 if r["method"] == "nsga2"]),
               ("random", "Random search", "baseline (b): random + L2 shortlist", [r for r in base3 if r["method"] == "random"])]
    methods += [(m, MODEL_LABELS[m], f"structured: `{m}`", rows) for m, rows in ag3.items()]
    out: dict[str, Any] = {}
    for name in EVAL_SPECS:
        s = sys_spec(name)
        assert gt3[name]["feasible"]
        rows_out = []
        for mid, label, md_name, rows in methods:
            rs = [r for r in rows if r["spec"] == name]
            assert len(rs) == 5, (name, mid)
            regrets = [r.get("select_regret") for r in rs]
            line = (f"| {md_name} | {len(rs)} | {ms_fmt([float(r['n_evals']) for r in rs], digits=0)} | {ms_fmt([r['hv_frac'] for r in rs])} | "
                    f"{evals_fmt([r['evals_to_95'] for r in rs])} | {sum(r['selected_meets_spec'] for r in rs)}/{len(rs)} | "
                    f"{ms_fmt(regrets, pct=True, signed=True)} ({optimal_fmt(regrets)}) | "
                    f"{sum(r['infeasibility_correct'] for r in rs)}/{len(rs)} |")
            assert line in md, line
            agent = mid not in ("nsga2", "random")
            rows_out.append({
                "method": mid, "label": label, "agent": agent, "runs": len(rs),
                "hv": stat([r["hv_frac"] for r in rs]), "hv_text": ms_fmt([r["hv_frac"] for r in rs]),
                "regret": stat(regrets), "regret_text": f"{ms_fmt(regrets, pct=True, signed=True)} ({optimal_fmt(regrets)} optimal)",
                "optimal": sum(1 for x in regrets if x is not None and x <= 1e-9),
                "evals_to_95_text": evals_fmt([r["evals_to_95"] for r in rs]),
                "meets_spec": sum(r["selected_meets_spec"] for r in rs),
                "l2_changed": sum(bool(r.get("l2_winner_changed")) for r in rs) if agent else None,
                "selected": [{"seed": int(r["seed"]), "key": r["selected_key"], "regret": r6(r["select_regret"])}
                             for r in sorted(rs, key=lambda r: int(r["seed"]))],
            })
        ch = [(m, sum(bool(r.get("l2_winner_changed", False)) for r in rows if r["spec"] == name),
               len([r for r in rows if r["spec"] == name])) for m, rows in ag3.items()]
        line = "L2 changed the L1 selection in: " + "; ".join(f"`{m}` {a}/{b}" for m, a, b in ch) + " runs."
        assert line in md, line
        out[name] = rows_out
    return out


def ab(md: str, readme: str) -> dict[str, Any]:
    ag2 = load_rows(D / "agent_m2")
    ag3 = load_rows(D / "agent_m3")
    cp3 = load_rows(D / "campaign_m3")
    models = list(dict.fromkeys(list(ag2) + list(ag3) + list(cp3)))
    all_specs = list(M2_SPECS) + list(EVAL_SPECS)
    cells: dict[str, Any] = {}
    for metric, title, pct in (("hv_frac", "HV fraction", False), ("select_regret", "selection regret", True),
                               ("n_evals", "L1 evaluations used", False)):
        assert f"**{title}** (structured → campaign)" in md
        cells[metric] = {}
        for name in all_specs:
            texts = []
            cells[metric][name] = {}
            for m in models:
                st = [r for r in (ag2.get(m, []) + ag3.get(m, [])) if r["spec"] == name]
                cp = [r for r in cp3.get(m, []) if r["spec"] == name]

                def f(rows: list[dict[str, Any]]) -> str:
                    return ms_fmt([float(r[metric]) if r.get(metric) is not None else None for r in rows], pct=pct,
                                  signed=pct, digits=0 if metric == "n_evals" else 3) if rows else "—"
                texts.append(f"{f(st)} → **{f(cp)}**")
                vals = lambda rows: [float(r[metric]) if r.get(metric) is not None else None for r in rows]  # noqa: E731
                cells[metric][name][m] = {"structured": stat(vals(st)) if st else None,
                                          "campaign": stat(vals(cp)) if cp else None,
                                          "structured_text": f(st), "campaign_text": f(cp)}
            line = f"| {name} | " + " | ".join(texts) + " |"
            assert line in md, line
    # cost, tokens, time and failures per run, over the specs both arms ran for that model
    costs = []
    for m in models:
        cp = cp3.get(m, [])
        cp_specs = {r["spec"] for r in cp} or set(all_specs)
        st = [r for r in (ag2.get(m, []) + ag3.get(m, [])) if r["spec"] in all_specs and r["spec"] in cp_specs]

        def pair(key: str, digits: int = 0) -> str:
            return " → ".join(ms_fmt([float(r[key]) for r in rows], digits=digits) if rows else "—" for rows in (st, cp))

        def fail(rows: list[dict[str, Any]]) -> str:
            return f"{sum(bool(r.get('failed')) for r in rows)}/{len(rows)}"
        line = (f"| `{m}` | {len(st)} → {len(cp)} | {pair('input_tokens')} | {pair('output_tokens')} | {pair('cost_usd', 4)} | "
                f"{pair('wall_s')} | {fail(st)} → {fail(cp)} |")
        assert line in md, line
        mean = lambda rows, k: statistics.mean(float(r[k]) for r in rows)  # noqa: E731
        costs.append({
            "model": m, "label": MODEL_LABELS[m], "specs": sorted(cp_specs, key=all_specs.index),
            "runs": [len(st), len(cp)],
            **{k: [stat([float(r[k]) for r in rows]) for rows in (st, cp)]
               for k in ("input_tokens", "output_tokens", "cost_usd", "wall_s")},
            "failures": [sum(bool(r.get("failed")) for r in rows) for rows in (st, cp)],
            "cost_ratio": round(mean(cp, "cost_usd") / mean(st, "cost_usd"), 4),
            "input_ratio": round(mean(cp, "input_tokens") / mean(st, "input_tokens"), 4),
            "text": line,
        })
    # pooled over the feasible specs each model's campaign arm ran (the README's summary table):
    # the mean of the per-spec means
    pooled = {}
    for m in models:
        specs = [s for s in all_specs if s != "infeasible_dds_400msps" and cells["hv_frac"][s][m]["campaign"]]
        pm = lambda metric, arm: statistics.mean(cells[metric][s][m][arm]["mean"] for s in specs)  # noqa: E731
        pooled[m] = {"specs": specs, "hv": [round(pm("hv_frac", a), 6) for a in ("structured", "campaign")],
                     "regret": [round(pm("select_regret", a), 6) for a in ("structured", "campaign")]}
    rd = flat(readme)
    for m, lab in (("deepseek/deepseek-v4.1-flash", "DeepSeek V4.1 Flash"), ("qwen/qwen3.8-27b, reasoning off", "Qwen3.8-27B, reasoning off"),
                   ("anthropic/claude-sonnet-5.5", "Sonnet 5.5")):
        p = pooled[m]
        hv = f"{p['hv'][0]:.3f} → {p['hv'][1]:.3f}"
        assert hv in rd, (m, hv)
        p["readme_regret_text"] = re.search(re.escape(hv) + r" \| (\+[\d.]+% → \+[\d.]+%) \|", rd).group(1)  # type: ignore[union-attr]
        p["regret_text"] = f"{p['regret'][0]:+.1%} → {p['regret'][1]:+.1%}"
    # what the campaign agent did
    allc = [r for rows in cp3.values() for r in rows]
    l2c = [r for r in allc if (r.get("l2") or {}).get("winner_changed")]
    l2s = [r for rows in ag3.values() for r in rows if r.get("l2_winner_changed")]
    n_st = sum(len(rows) for rows in ag3.values())
    which = ", ".join(sorted(label_of(r) + " " + r["spec"] + " seed " + str(r["seed"]) for r in l2c)) or "none"
    line = (f"**L2 re-selections in the live runs.** Structured arm: {len(l2s)}/{n_st}. Campaign arm: {len(l2c)}/{len(allc)} "
            f"({which}).")
    assert line in md, line

    def cnt(pred: Any) -> int:
        return sum(1 for r in allc if pred(r))
    ladder = {
        "verify_recorded": cnt(lambda r: str(r.get("l3") or "").startswith("exact, recorded")),
        "verify_fresh": cnt(lambda r: str(r.get("l3") or "").startswith("exact, fresh")),
        "verify_not": cnt(lambda r: str(r.get("l3") or "").startswith("not verified")),
        "verify_called": cnt(lambda r: r.get("l3")),
        "synth_recorded": cnt(lambda r: r.get("l4") and not str(r["l4"]).startswith("no recorded")),
        "synth_called": cnt(lambda r: r.get("l4")),
        "annotate_compared": cnt(lambda r: (r.get("back_annotation") or {}).get("status") == "compared"),
        "annotate_called": cnt(lambda r: r.get("back_annotation")),
    }
    line = (f"`verify_rtl`: recorded L3 row {ladder['verify_recorded']}, fresh run {ladder['verify_fresh']}, not verified "
            f"{ladder['verify_not']} (of {ladder['verify_called']} runs that called it); `synthesize`: recorded measurements "
            f"{ladder['synth_recorded']} of {ladder['synth_called']}; `back_annotate`: compared {ladder['annotate_compared']} of "
            f"{ladder['annotate_called']}.")
    assert line in md, line
    tools = {t: cnt(lambda r, t=t: t in r.get("ladder", [])) for t in
             ("explore_family", "simulate_system", "verify_rtl", "back_annotate", "reexplore")}
    single = cnt(lambda r: [d["evals"] for d in r.get("dse_runs", [])] == [400])
    assert (f"In {single} of {len(allc)} campaigns the agent spent its whole budget on one `run_dse(400)`") in rd
    assert (f"it called `explore_family` in {tools['explore_family']}, `simulate_system` in {tools['simulate_system']}, "
            f"L3 in {tools['verify_rtl']}, `back_annotate` in {tools['back_annotate']} and `reexplore` "
            f"{'once' if tools['reexplore'] == 1 else tools['reexplore']}") in rd
    runs = []
    for m, rows in cp3.items():
        for r in sorted(rows, key=lambda r: (r["spec"], r["seed"])):
            dse = ", ".join(f"run_dse({d['evals']})" for d in r.get("dse_runs", []))
            line = (f"- {r['spec']} seed {r['seed']}: {' → '.join(r.get('ladder', [])) or '—'} [{dse}]"
                    + (f"; **failed**: {r['error'][:160]}" if r.get("failed") else "")
                    + (f"; L5 re-explore → `{r['l5'].get('selected_key')}`" if r.get("l5") else ""))
            assert line in md, line
            runs.append({"model": m, "spec": r["spec"], "seed": int(r["seed"]), "ladder": r.get("ladder", []),
                         "dse_evals": [int(d["evals"]) for d in r.get("dse_runs", [])], "failed": bool(r.get("failed")),
                         "error": (r.get("error") or "")[:80] if r.get("failed") else None,
                         "l2_changed": bool((r.get("l2") or {}).get("winner_changed")),
                         "hv_frac": r6(r["hv_frac"]) if r.get("hv_frac") is not None else None,
                         "regret": r6(r["select_regret"]) if r.get("select_regret") is not None else None,
                         "model_calls": int(r["campaign_model_calls"]), "cost_usd": r6(r["cost_usd"])})
    looped = [r for r in runs if r["failed"]]
    assert len(looped) == 4 and all(r["model"].startswith("qwen/") and "call limit (40)" in r["error"] for r in looped)
    return {
        "models": models, "labels": {m: MODEL_LABELS[m] for m in models}, "specs": all_specs, "cells": cells,
        "costs": costs, "pooled": pooled,
        "l2_reselect": {"structured": [len(l2s), n_st], "campaign": [len(l2c), len(allc)],
                        "campaign_runs": [{"model": label_of(r), "spec": r["spec"], "seed": int(r["seed"])} for r in l2c]},
        "ladder": ladder, "tools": tools, "single_run_dse": single, "campaigns": len(allc), "runs": runs,
    }


def memory(md: str, readme: str) -> dict[str, Any]:
    cp3 = load_rows(D / "campaign_m3")
    mem = load_rows(D / "campaign_m3_memory")
    assert f"Sequence: {' → '.join(MEMORY_SEQUENCE)}." in md
    out = []
    for m, rows in mem.items():
        for i, name in enumerate(MEMORY_SEQUENCE):
            on = [r for r in rows if r["spec"] == name]
            off = [r for r in cp3.get(m, []) if r["spec"] == name and r["seed"] in {x["seed"] for x in on}]

            def c(key: str, pct: bool = False, digits: int = 3) -> str:
                return " → ".join(ms_fmt([float(r[key]) if r.get(key) is not None else None for r in rows_], pct=pct,
                                         signed=pct, digits=digits) if rows_ else "—" for rows_ in (off, on))
            line = (f"| `{m}` | {name} ({i + 1}) | {c('hv_frac')} | {c('select_regret', True)} | {c('n_evals', digits=0)} | "
                    f"{c('cost_usd', digits=4)} |")
            assert line in md, line
            out.append({"model": m, "spec": name, "position": i + 1, "seeds": sorted(int(r["seed"]) for r in on),
                        **{k: [stat([r.get(k) for r in x]) for x in (off, on)] for k in ("hv_frac", "select_regret", "cost_usd")}})
    store = json.loads((D / "campaign_m3_memory_store.json").read_text())
    text = json.dumps(store, ensure_ascii=False)
    # the review's example of a garbled LLM note: "~19%" next to a raw pair implying +36%
    assert "under-predicts LUTs ~19%" in text and "216 LUT/107 FF vs est 159/92" in text
    assert f"{216 / 159 - 1:+.0%}" == "+36%"
    assert "`unrolled_k`: explored in 3 spec(s) (63 evaluations), on the front in 0; never reached a front on this device so far" in text
    return {"model": next(iter(mem)), "label": MODEL_LABELS[next(iter(mem))], "sequence": list(MEMORY_SEQUENCE), "rows": out,
            "store_seeds": len(store)}


def levers(md: str) -> dict[str, Any]:
    rows = json.loads((D / "m3_mapfront_fix.json").read_text())["rows"]

    def _m(xs: list[float | None], pct: bool = False) -> str:
        v = [x for x in xs if x is not None]
        if not v:
            return "n/a"
        return f"{statistics.mean(v) * 100:+.1f}%" if pct else f"{statistics.mean(v):.3f}"
    out: dict[str, Any] = {}
    for fix in ("fix-all", "fix"):
        assert f"| driver | spec | runs | HV M2 levers → {fix} | regret M2 levers → {fix} | runs whose selection changed |" in md
        table = []
        for gname, pred in (("LLM replays (3 models x 5 seeds)", lambda d: not d.startswith("heuristic")),
                            ("heuristic architect (fake)", lambda d: d.startswith("heuristic"))):
            for s in M2_SPECS:
                a = sorted([r for r in rows if r["variant"] == "m2" and pred(r["driver"]) and r["spec"] == s],
                           key=lambda r: (r["driver"], r["seed"]))
                b = sorted([r for r in rows if r["variant"] == fix and pred(r["driver"]) and r["spec"] == s],
                           key=lambda r: (r["driver"], r["seed"]))
                changed = sum(x["selected_key"] != y["selected_key"] for x, y in zip(a, b))
                hv = [_m([r["hv_frac"] for r in a]), _m([r["hv_frac"] for r in b])]
                rg = [_m([r["select_regret"] for r in a], True), _m([r["select_regret"] for r in b], True)]
                line = f"| {gname} | {s} | {len(a)} | {hv[0]} → {hv[1]} | {rg[0]} → {rg[1]} | {changed} |"
                assert line in md, line
                table.append({"driver": gname, "spec": s, "runs": len(a), "hv": hv, "regret": rg, "changed": changed})
        out[fix] = table
    rp = json.loads((D / "m2_replay.json").read_text())
    line = (f"**{rp['n_identical']}/{rp['n_runs']} identical**: same decisions, status, rounds, front-mapping rounds, every "
            "evaluated design key in order, HV fraction, selection regret and selected design")
    assert line in md, line
    # identical down to the architect's inputs (the recorded prompts), every recorded call consumed
    assert all(all(r["checks"].values()) for r in rp["rows"]) and len(rp["rows"]) == rp["n_runs"]
    out["replay"] = {"identical": rp["n_identical"], "runs": rp["n_runs"],
                     "architect_inputs": sum(bool(r["checks"]["architect_inputs"]) for r in rp["rows"])}
    return out


def spend(md: str, readme: str) -> dict[str, Any]:
    rows = [json.loads(x) for x in (D / "spend_ledger.jsonl").read_text().splitlines() if x.strip()]
    rows = [r for r in rows if r.get("milestone", "m1") == "m3"]
    by: dict[str, float] = {}
    n: dict[str, int] = {}
    for r in rows:
        k = f"{r.get('arm', '?')}{' (' + r['note'] + ')' if r.get('note') else ''}"
        by[k] = by.get(k, 0.0) + float(r.get("cost_usd") or 0)
        n[k] = n.get(k, 0) + 1
    for k in sorted(by):
        assert f"| {k} | {n[k]} | {by[k]:.4f} |" in md, k
    total = sum(by.values())
    assert f"| **total** | {len(rows)} | **{total:.4f}** |" in md
    ku = json.loads((D / "key_usage_m3.json").read_text())
    snaps = ku["snapshots"]
    line = "Key usage snapshots (authoritative; `eval/data/key_usage_m3.json`): " + "; ".join(
        f"{k} {v['ts']} ${v['usage_usd']:.4f}" for k, v in snaps.items()) + "."
    assert line in md
    start, end = snaps["session_start"], snaps["after_eval"]
    key = end["usage_usd"] - start["usage_usd"]
    assert key <= ku["m3_spend_cap_usd"]
    # the provider-reported cost in the run summaries agrees with the ledger, arm by arm
    sums = {d: math.fsum(r["cost_usd"] for rs in load_rows(D / d).values() for r in rs)
            for d in ("agent_m3", "campaign_m3", "campaign_m3_memory")}
    assert f"{sums['agent_m3']:.4f}" == f"{by['structured']:.4f}"
    assert f"{sums['campaign_m3']:.4f}" == f"{by['campaign']:.4f}"
    assert f"{sums['campaign_m3_memory']:.4f}" == f"{by['campaign (memory-on)']:.4f}"
    structured = sum(v for k, v in by.items() if k.startswith("structured"))
    campaign = sum(v for k, v in by.items() if k.startswith("campaign"))
    mem_on = sum(v for k, v in by.items() if "memory-on" in k)
    pilots = sum(v for k, v in by.items() if k.startswith("campaign (pilot"))
    rd = flat(readme)
    assert (f"from **${start['usage_usd']:.4f}** (session start, {start['ts']}) to **${end['usage_usd']:.4f}** ({end['ts']}): "
            f"**${key:.2f} for M3**, under the ${ku['m3_spend_cap_usd']:.0f} cap") in rd
    assert (f"Provider-reported ledger: ${total:.2f} over {len(rows)} entries (structured ${structured:.2f}, campaign "
            f"${campaign:.2f} incl. memory-on ${mem_on:.2f} and pilots ${pilots:.2f})") in rd
    # every recorded M3 call: the traces' cost sums to INDEX.md's figure
    tr, calls = 0.0, 0
    for p in sorted((D / "traces/m3").glob("**/llm_trace.jsonl")):
        for x in p.read_text().splitlines():
            if x.strip():
                tr += float(json.loads(x).get("cost_usd") or 0.0)
                calls += 1
    assert f"Provider-reported cost of these runs: ${tr:.4f}." in (D / "traces/m3/INDEX.md").read_text()
    # the difference is the runs that were interrupted or lost and re-run: in the ledger, not archived
    rerun = sum(v for k, v in by.items() if "re-run" in k)
    assert f"{tr:.4f}" == f"{total - rerun:.4f}", (tr, total, rerun)
    # the model check (listed, with tools and structured outputs; no substitution) was recorded
    # at the session's start
    checked = ku["models_checked"]
    assert all(v["listed"] and v["tools"] and v["structured_outputs"] for v in checked["models"].values())
    assert checked["ts"].startswith("2026-10-09")
    return {
        "ledger": [{"entry": k, "runs": n[k], "usd": round(by[k], 4)} for k in sorted(by)],
        "ledger_total_usd": round(total, 4), "ledger_entries": len(rows),
        "structured_usd": round(structured, 4), "campaign_usd": round(campaign, 4), "memory_on_usd": round(mem_on, 4),
        "pilots_usd": round(pilots, 4),
        "key_start_usd": round(start["usage_usd"], 6), "key_end_usd": round(end["usage_usd"], 6),
        "key_start_ts": start["ts"], "key_end_ts": end["ts"], "key_usd": round(key, 6), "cap_usd": ku["m3_spend_cap_usd"],
        "snapshots": [{"name": k, "ts": v["ts"], "usd": round(v["usage_usd"], 6)} for k, v in snaps.items()],
        "trace_usd": round(tr, 4), "rerun_usd": round(rerun, 4), "rerun_entries": sum(n[k] for k in by if "re-run" in k), "trace_calls": calls, "trace_runs": len(list((D / "traces/m3").glob("**/llm_trace.jsonl"))),
        "models_checked": {"ts": checked["ts"], "models": sorted(checked["models"])},
    }


def build(readme: str) -> dict[str, Any]:
    md = (V / "eval/results.md").read_text()
    gt = system_ground_truth(md, readme)
    return {
        "ground_truth": gt,
        "system_replay": system_replay(gt),
        "cycle": cycle_validation(md),
        "structured": structured(md),
        "ab": ab(md, readme),
        "memory": memory(md, readme),
        "levers": levers(md),
        "spend": spend(md, readme),
    }
