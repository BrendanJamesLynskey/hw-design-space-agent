"""The local Vivado runs after milestone 4 (the agent repository's 07V data and 07R compare/refit,
merged as one PR) for the site: high_precision at its own 20 ns clock, the first measured FPGA
power (Vivado report_power, vectorless), the vivado-2025.2-m4 refit, the per-family-class path
factor's pre-set rule and its outcome, the per-family power activity fit, and post-route /
post-synthesis Fmax per family.

Imported by scripts/export_dse.py, which writes the result to src/data/vivado_m4.json. As for
M1 to M4, every table row the site shows is re-made the way eval/m4.py's report_vivado_m4
formats it and asserted to appear literally in eval/results.md. Recomputed here rather than
read (the committed JSON must agree with each):

- the 20 ns MSPS from each row's WNS (1000 / (20 - WNS)), and every model column by evaluating
  the two designs under the M1 calibration and both refits;
- that the 20 ns post-synthesis rows duplicate the 10 ns ones (which is why the m4 refit counts
  them once and equals vivado-2025.2: same constants, same leave-one-out);
- the class factor's outcome from the rule's two conditions;
- post-route / post-synthesis Fmax for every Vivado design measured both ways, from the CSVs;
- the power index against measured core power (own ranks for Spearman, own RMS of the log
  ratio), and the per-family activity fit in-sample and leave-one-out (own geometric means).
"""
from __future__ import annotations

import csv
import json
import math
import re
from pathlib import Path
from typing import Any

from hw_dse.evaluate import evaluate
from hw_dse.families import ArchConfig
from hw_dse.models.cost_fpga import FpgaCostModel
from hw_dse.spec import load_spec
from hw_dse.synth import measured

V = Path(__file__).resolve().parent.parent / "vendor/hw_dse"
D = V / "eval/data"
MODELS = V / "src/hw_dse/models"
CALS = {
    "M1 (default)": None,
    "vivado-2025.2 refit": MODELS / "calibration_artix7_refit_vivado-2025.2.yaml",
    "vivado-2025.2-m4 refit": MODELS / "calibration_artix7_refit_vivado-2025.2-m4.yaml",
}
REFERENCE_KEY = "iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=trunc"
FAMILIES = ("iterative", "pipelined", "pipelined_m", "unrolled_k")
HEADING = "# 2026-10-11: the local Vivado runs"


def read_csv(p: Path) -> list[dict[str, str]]:
    with open(p, newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def section(md: str) -> str:
    """results.md's appended Vivado section (everything from its heading on)."""
    assert md.count(HEADING) == 1
    return md[md.index(HEADING):]


# ---------------------------------------------------------------------------
# high_precision at its own 20 ns clock
# ---------------------------------------------------------------------------

def at_20ns(sec: str, cmp: dict[str, Any]) -> dict[str, Any]:
    spec = load_spec(V / "specs/high_precision.yaml")
    need = spec.min_throughput_msps
    models = {n: (FpgaCostModel(str(p)) if p else FpgaCostModel()) for n, p in CALS.items()}
    pts = measured.load(D / "vivado_measured_20ns.csv")
    raw = read_csv(D / "vivado_measured_20ns.csv")
    assert len(pts) == len(raw) == 4
    rows = []
    for p, r, c in zip(pts, raw, cmp["high_precision_20ns"], strict=True):
        assert p.arch.key() == c["key"]
        wns = float(re.search(r"WNS (-?[\d.]+) ns at 20 ns", r["fmax_kind"]).group(1))
        stage = "post-route" if r["fmax_kind"].startswith("post-route") else "post-synthesis"
        assert round(1000.0 / (20.0 - wns), 2) == p.fmax_mhz == c["measured_msps"]
        est = {n: float(evaluate(p.arch, spec, m)["throughput_msps"]) for n, m in models.items()}
        assert est == c["estimates_msps"], (est, c["estimates_msps"])
        meets = p.fmax_mhz >= need
        assert meets == c["meets_50msps"]
        m = p.arch.params()["m"]
        line = (f"| m={m} | {stage} | {p.fmax_mhz:.2f} | {'yes' if meets else 'no'} | "
                + " | ".join(f"{v:.2f}" for v in est.values()) + " |")
        assert line in sec, line
        rows.append({"m": m, "stage": stage, "wns_ns": wns, "msps": p.fmax_mhz, "meets": meets,
                     "luts": int(float(r["luts"])), "ffs": int(float(r["ffs"])),
                     "estimates": {"m1": est["M1 (default)"], "refit": est["vivado-2025.2 refit"],
                                   "refit_m4": est["vivado-2025.2-m4 refit"]}})
    # the m4 refit is the vivado-2025.2 fit (the 20 ns rows are counted once)
    for r in rows:
        assert r["estimates"]["refit"] == r["estimates"]["refit_m4"]
    by = {(r["m"], r["stage"]): r for r in rows}
    assert by[(8, "post-synthesis")]["msps"] < need and by[(8, "post-route")]["msps"] < need
    assert by[(6, "post-synthesis")]["msps"] >= need and by[(6, "post-route")]["msps"] >= need
    return {"need_msps": need, "period_ns": 20.0, "part": raw[0]["part"], "rows": rows}


# ---------------------------------------------------------------------------
# The vivado-2025.2-m4 refit: the 20 ns rows counted once
# ---------------------------------------------------------------------------

def refit(sec: str) -> dict[str, Any]:
    m4 = json.loads((D / "l5_refit_vivado-2025.2-m4.json").read_text())
    base = json.loads((D / "l5_refit_vivado-2025.2.json").read_text())
    for k in ("constants_refit", "per_family", "tool_corrections", "n_fit_points", "loo_summary"):
        assert m4[k] == base[k], k
    assert m4["class_path_factor"] is False
    # the 20 ns post-synthesis rows are the 10 ns rows again (relaxing the constraint moved nothing)
    ten = {p.arch.key(): p for p in measured.load(D / "vivado_measured_2.csv")
           if p.extra.get("fmax_kind", "").startswith("post-synthesis")}
    twenty = [p for p in measured.load(D / "vivado_measured_20ns.csv")
              if p.extra.get("fmax_kind", "").startswith("post-synthesis")]
    assert len(twenty) == 2
    for p in twenty:
        q = ten[p.arch.key()]
        assert (p.luts, p.ffs, p.fmax_mhz) == (q.luts, q.ffs, q.fmax_mhz)
    # (the list also holds the M2 spot-check's twin of a batch-1 row, dropped as before)
    dd = [d for d in m4["duplicates_dropped"] if d["csv"] == "vivado_measured_20ns.csv"]
    assert len(dd) == 4 and len(m4["duplicates_dropped"]) == 5 and all(d["kept_from"] == "vivado_measured_2.csv" for d in dd)
    changed = [s for s, g in m4["ground_truth_impact"].items() if g["winner_changed"]]
    assert changed == []
    assert "Ground-truth winners changed under the m4 refit: none." in sec
    assert (f"The 20 ns rows are counted once ({len(dd)} rows dropped; each design is kept from its 10 ns row, "
            "whose post-synthesis figures are identical), so the m4 refit has the same points and constants as "
            "`vivado-2025.2`.") in sec
    loo = {}
    for name, js in (("vivado-2025.2", base), ("vivado-2025.2-m4", m4)):
        v = js["loo_summary"]["all vivado"]
        line = f"| `{name}` | {v['n']} | {v['luts_loo']:.1f} | {v['ffs_loo']:.1f} | {v['fmax_loo']:.1f} |"
        assert line in sec, line
        loo[name] = {"n": v["n"], "luts": v["luts_loo"], "ffs": v["ffs_loo"], "fmax": v["fmax_loo"]}
    allp = m4["loo_summary"]["all"]
    m1 = m4["summary_before"]["vivado (generated RTL)"]
    route_disagree = [{"m": ArchConfig.from_key(d["key"]).params()["m"], "stage": d["stage"],
                       "disagree_pct": d["disagree_pct"]} for d in dd if d["disagree_pct"]]
    return {"n_fit_points": m4["n_fit_points"], "dropped": len(dd), "route_disagree": route_disagree,
            "loo_vivado": loo, "loo_all": {"n": allp["n"], "luts": allp["luts_loo"], "ffs": allp["ffs_loo"],
                                           "fmax": allp["fmax_loo"]},
            "m1_vivado": {"n": m1["n"], "luts": m1["rms_luts_err_pct"], "ffs": m1["rms_ffs_err_pct"],
                          "fmax": m1["rms_fmax_err_pct"]},
            "winners_changed": changed, "specs": sorted(m4["ground_truth_impact"])}


# ---------------------------------------------------------------------------
# The per-family-class path factor: the rule, fixed beforehand, and its outcome
# ---------------------------------------------------------------------------

def class_factor(sec: str, hp20: dict[str, Any]) -> dict[str, Any]:
    js = json.loads((D / "l5_class_path_factor_m4.json").read_text())
    md = (D / "l5_class_path_factor_m4.md").read_text()
    need = hp20["need_msps"]
    a = js["vivado_fmax_loo_with"] < js["vivado_fmax_loo_without"]
    b = js["msps_with"]["m=8"] < need <= js["msps_with"]["m=6"]
    assert (a, b, a and b) == (js["a_loo_improves"], js["b_m8_infeasible_m6_feasible"], js["adopt"]) == (True, False, False)
    # without the factor = the m4 refit's own model throughput
    synth = {r["m"]: r for r in hp20["rows"] if r["stage"] == "post-synthesis"}
    for m in (6, 8):
        assert js["msps_without"][f"m={m}"] == round(synth[m]["estimates"]["refit_m4"], 3)
    line = (f"(a) Vivado Fmax leave-one-out {js['vivado_fmax_loo_without']:.1f}% → {js['vivado_fmax_loo_with']:.1f}%: "
            f"holds. (b) m=8 at {js['msps_with']['m=8']:.2f} MSPS, m=6 at {js['msps_with']['m=6']:.2f} "
            f"(needs m=8 < {need:g} ≤ m=6): fails. **Rejected.**")
    assert line in sec, line
    hist = re.search(r"^History: (.+)$", md, re.M).group(1)
    assert "printed ADOPTED" in hist and "the rule text was not changed" in hist
    tc = js["tool_corrections_with"]["yosys+nextpnr-xilinx"]
    gw = js["ground_truth_with"]["high_precision"]
    assert gw["winner_changed"] and gw["winner_refit"].endswith("m=8")
    allw, allo = js["loo_summary_with"]["all"], js["loo_summary_without"]["all"]
    return {"loo_without": js["vivado_fmax_loo_without"], "loo_with": js["vivado_fmax_loo_with"],
            "loo_all_without": allo["fmax_loo"], "loo_all_with": allw["fmax_loo"],
            "msps_with": {"6": js["msps_with"]["m=6"], "8": js["msps_with"]["m=8"]},
            "msps_without": {"6": js["msps_without"]["m=6"], "8": js["msps_without"]["m=8"]},
            "a": a, "b": b, "adopt": a and b,
            "factor_fsm": tc["path_fsm"], "factor_pipelined": tc["path_pipelined"],
            "winner_with": gw["winner_refit"], "history": hist}


# ---------------------------------------------------------------------------
# Post-route / post-synthesis Fmax, every Vivado design measured both ways
# ---------------------------------------------------------------------------

def post_route(sec: str, cmp: dict[str, Any]) -> dict[str, Any]:
    pairs: dict[tuple[str, float], dict[str, float]] = {}
    for name, period in (("vivado_measured.csv", 10.0), ("vivado_measured_2.csv", 10.0), ("vivado_measured_20ns.csv", 20.0)):
        for p in measured.load(D / name):
            if not p.fmax_mhz or p.rtl_source != "generated":
                continue
            stage = "route" if p.extra.get("fmax_kind", "").lower().startswith("post-route") else "synth"
            pairs.setdefault((p.arch.key(), period), {})[stage] = p.fmax_mhz
    designs = []
    for (k, period), v in sorted(pairs.items()):
        if "synth" in v and "route" in v:
            designs.append({"key": k, "family": ArchConfig.from_key(k).family, "period_ns": period,
                            "synth_mhz": v["synth"], "route_mhz": v["route"], "ratio": round(v["route"] / v["synth"], 4)})
    ref = cmp["post_route_over_post_synthesis"]
    assert [(d["key"], d["period_ns"], d["ratio"]) for d in designs] == \
           [(d["key"], d["period_ns"], d["ratio"]) for d in ref["designs"]]
    fams = {}
    for f in FAMILIES:
        r = [d["ratio"] for d in designs if d["family"] == f]
        fams[f] = {"n": len(r), "min": min(r), "max": max(r), "mean": round(sum(r) / len(r), 4)}
        assert fams[f] == ref["by_family"][f], f
        line = f"| {f} | {len(r)} | {fams[f]['min']:.3f} | {fams[f]['max']:.3f} | {fams[f]['mean']:.3f} |"
        assert line in sec, line
    lo = min(v["min"] for v in fams.values())
    hi = max(v["max"] for v in fams.values())
    return {"designs": designs, "by_family": fams, "min": lo, "max": hi}


# ---------------------------------------------------------------------------
# Power: the index against Vivado report_power (vectorless), and the per-family fit
# ---------------------------------------------------------------------------

def ranks(x: list[float], ties: bool = True) -> list[float]:
    """Ranks; with ties=True tied values share their mean rank (the usual convention), with
    ties=False they keep their order of appearance (what the repository's code does)."""
    order = sorted(range(len(x)), key=lambda i: x[i])
    r = [0.0] * len(x)
    i = 0
    while i < len(order):
        j = i
        while ties and j + 1 < len(order) and x[order[j + 1]] == x[order[i]]:
            j += 1
        for t in range(i, j + 1):
            r[order[t]] = (i + j) / 2
        i = j + 1
    return r


def spearman(a: list[float], b: list[float], ties: bool = True) -> float:
    ra, rb = ranks(a, ties), ranks(b, ties)
    n = len(a)
    ma, mb = sum(ra) / n, sum(rb) / n
    cov = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
    return cov / math.sqrt(sum((x - ma) ** 2 for x in ra) * sum((y - mb) ** 2 for y in rb))


def rms_log_pct(ratios: list[float]) -> float:
    return (math.exp(math.sqrt(sum(math.log(r) ** 2 for r in ratios) / len(ratios))) - 1) * 100


def gmean(xs: list[float]) -> float:
    return math.exp(sum(math.log(x) for x in xs) / len(xs))


def power(sec: str, cmp: dict[str, Any]) -> dict[str, Any]:
    rows = read_csv(D / "vivado_power.csv")
    assert len(rows) == 56 and {r["confidence"] for r in rows} == {"Low"}
    assert {r["toggle_rate_pct"] for r in rows} == {"12.5 (default)"}
    assert {r["tool_version"] for r in rows} == {"2025.2"}
    keys = sorted({r["design_key"] for r in rows})
    assert len(keys) == 14 and REFERENCE_KEY in keys
    index = {}
    for k in keys:
        rec = evaluate(ArchConfig.from_key(k))
        index[k] = rec["power_index"] * 100.0 / rec["f_op_mhz"]  # the index at 100 MHz
    stages = {}
    for stage in ("post-synthesis", "post-route"):
        # dynamic power is linear in f: the 1 ns (1 GHz) report, scaled to 100 MHz, for resolution
        mw = {r["design_key"]: float(r["core_w"]) * 1.0 / 10.0 * 1e3
              for r in rows if r["stage"] == stage and float(r["clock_ns"]) == 1.0}
        mw10 = {r["design_key"]: float(r["core_w"]) * 1e3
                for r in rows if r["stage"] == stage and float(r["clock_ns"]) == 10.0}
        assert sorted(mw) == sorted(mw10) == keys
        ref = mw[REFERENCE_KEY]
        des = [{"key": k, "family": ArchConfig.from_key(k).family, "index": index[k], "mw": mw[k], "mw_10ns": mw10[k],
                "ratio": index[k] / (mw[k] / ref)} for k in keys]
        # the repository's Spearman ranks tied values by order of appearance; two designs tie at
        # 22.0 mW post-synthesis, where averaging their ranks gives a slightly higher figure
        sp = spearman([d["index"] for d in des], [d["mw"] for d in des], ties=False)
        sp_tied = spearman([d["index"] for d in des], [d["mw"] for d in des])
        tied = sorted({d["mw"] for d in des if sum(e["mw"] == d["mw"] for e in des) > 1})
        rms = rms_log_pct([d["ratio"] for d in des if d["key"] != REFERENCE_KEY])
        c = cmp[f"power_{stage}"]
        assert math.isclose(sp, c["spearman"], abs_tol=1e-12) and math.isclose(rms, c["rms_log_ratio_pct"], abs_tol=1e-9)
        assert (tied == []) == (sp == sp_tied)
        for d, e in zip(des, c["designs"], strict=True):
            assert d["key"] == e["key"] and math.isclose(d["mw"], e["measured_core_mw_100mhz"], rel_tol=1e-12)
            assert math.isclose(d["ratio"], e["ratio_index_to_measured"], rel_tol=1e-12)
        line = f"| {stage} | {len(des)} | {sp:.3f} | {rms:.1f}% |"
        assert line in sec, line
        stages[stage] = {"n": len(des), "spearman": sp, "spearman_tied": sp_tied, "tied_mw": tied, "rms_pct": rms,
                         "designs": des}
    # the per-family activity fit (post-synthesis): measured mW ~ s_family x index
    d = stages["post-synthesis"]["designs"]
    s_f = {f: gmean([x["mw"] / x["index"] for x in d if x["family"] == f]) for f in FAMILIES}
    s_g = gmean([x["mw"] / x["index"] for x in d])
    loo_f, loo_g = [], []
    for j, x in enumerate(d):
        rest = d[:j] + d[j + 1:]
        loo_f.append(gmean([y["mw"] / y["index"] for y in rest if y["family"] == x["family"]]) * x["index"] / x["mw"])
        loo_g.append(gmean([y["mw"] / y["index"] for y in rest]) * x["index"] / x["mw"])
    fit = {"per_family_in": rms_log_pct([s_f[x["family"]] * x["index"] / x["mw"] for x in d]),
           "per_family_loo": rms_log_pct(loo_f),
           "global_in": rms_log_pct([s_g * x["index"] / x["mw"] for x in d]),
           "global_loo": rms_log_pct(loo_g)}
    act = cmp["power_activity_fit"]
    for mine, theirs in (("per_family_in", "per_family_in"), ("per_family_loo", "per_family_loo"),
                         ("global_in", "global_scale_in"), ("global_loo", "global_scale_loo")):
        assert math.isclose(fit[mine], act["rms_log_pct"][theirs], abs_tol=1e-9), mine
    ref_mw = next(x["mw"] for x in d if x["key"] == REFERENCE_KEY)
    implied = {f: round(act["default_activity"] * s_f[f] / ref_mw, 4) for f in FAMILIES}
    assert implied == act["implied_activity"]
    line = (f"Per-family activity factor ({len(FAMILIES)} parameters, post-synthesis; a separate calibration, not the "
            f"default): {fit['per_family_in']:.1f}% in-sample, {fit['per_family_loo']:.1f}% leave-one-out (one global "
            f"scale: {fit['global_in']:.1f}% / {fit['global_loo']:.1f}%).")
    assert line in sec, line
    for st in stages.values():  # per-family range of index / measured
        st["by_family"] = {f: [min(x["ratio"] for x in st["designs"] if x["family"] == f),
                               max(x["ratio"] for x in st["designs"] if x["family"] == f)] for f in FAMILIES}
    return {"stages": stages, "fit": fit, "implied_activity": implied, "default_activity": act["default_activity"],
            "parameters": len(FAMILIES), "reference_key": REFERENCE_KEY, "reference_mw": ref_mw,
            "toggle_pct": 12.5, "confidence": "Low"}


def build(readme: str) -> dict[str, Any]:
    md = (V / "eval/results.md").read_text()
    sec = section(md)
    assert "*measured (vivado 2025.2)*, xc7a35tcpg236-1; power is vectorless (12.5% default toggle, confidence Low)." in sec
    assert "No LLM call and no eval re-run: the default cost model and every ground truth above are unchanged." in sec
    cmp = json.loads((D / "vivado_m4_compare.json").read_text())
    hp20 = at_20ns(sec, cmp)
    # the README's verdict, as the site repeats it
    flat = re.sub(r"\s+", " ", readme)
    assert "**m=8 misses 50 MSPS at its own clock in both views**" in flat
    assert "**m=6 meets it in both** (65.39 post-synthesis, 53.96 post-route, +7.9%)" in flat
    assert "**every model throughput is an unrouted figure.**" in flat
    assert "per-family-class path factor decided (rejected by a rule fixed beforehand)" in flat
    return {
        "date": "2026-10-11",
        "tool": "Vivado 2025.2",
        "high_precision_20ns": hp20,
        "refit": refit(sec),
        "class_factor": class_factor(sec, hp20),
        "post_route": post_route(sec, cmp),
        "power": power(sec, cmp),
    }
