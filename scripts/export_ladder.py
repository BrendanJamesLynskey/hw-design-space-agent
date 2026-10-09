"""Milestone 2's ladder data for the site: L3 verification (RTL and gate level), the formal
proofs, L4 synthesis, the Vivado measurements, the L5 refits, the worked example of one design
up the ladder and the `high_precision` m=6 against m=8 story.

Imported by scripts/export_dse.py, which writes the result to src/data/ladder.json. Every row
comes from a vendored CSV or JSON file; every summary number the site quotes is either
computed here from those rows and asserted to appear, as the repository formats it, in the
README, eval/data/README.md, an L5 report or the worked example, or recomputed with the
Python reference at the vendored commit (the M1 cost model's estimate of each measured design,
the refit calibrations' predictions) and compared with the repository's own numbers.
"""
from __future__ import annotations

import csv
import json
import math
import re
import statistics
from pathlib import Path
from typing import Any

from hw_dse.evaluate import evaluate
from hw_dse.families import ArchConfig
from hw_dse.models.cost_fpga import FpgaCostModel
from hw_dse.spec import Spec

V = Path(__file__).resolve().parent.parent / "vendor/hw_dse"
D = V / "eval/data"

FAMILIES = ("iterative", "unrolled_k", "pipelined", "pipelined_m")
REFIT_VIVADO = V / "src/hw_dse/models/calibration_artix7_refit_vivado-2025.2.yaml"
REFIT_YOSYS = V / "src/hw_dse/models/calibration_artix7_refit_yosys-nextpnr.yaml"


def read_csv(name: str) -> list[dict[str, str]]:
    with open(D / name, newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def text(path: str) -> str:
    return (V / path).read_text(encoding="utf-8")


def r1(x: float) -> float:
    return round(float(x), 1)


def key_of(row: dict[str, str]) -> str:
    """The design key of a measured-points row (the schema has no key column)."""
    p: dict[str, Any] = {"data_width": int(row["data_width"]), "n_iter": int(row["n_iter"]),
                         "angle_guard": int(row["angle_guard"]), "frac_guard": int(row["frac_guard"]),
                         "rounding": row["rounding"]}
    if row["family"] == "unrolled_k":
        p["k"] = int(row["k"])
    if row["family"] == "pipelined_m":
        p["m"] = int(row["m"])
    return ArchConfig.from_params(row["family"], p).key()


def arch_of(key: str) -> ArchConfig:
    fam, rest = key.split(":", 1)
    p: dict[str, Any] = {}
    for kv in rest.split(","):
        k, v = kv.split("=")
        p[k] = v if k == "rounding" else int(v)
    return ArchConfig.from_params(fam, p)


def params_of(key: str) -> dict[str, Any]:
    return arch_of(key).params()


def m1_estimate(key: str) -> dict[str, float]:
    """The default (M1, two-anchor Vivado) cost model's estimate: what L1 predicted."""
    rec = evaluate(arch_of(key))
    return {"luts": rec["luts"], "ffs": rec["ffs"], "fmax_mhz": rec["fmax_mhz"]}


# ---------------------------------------------------------------------------
# L3: RTL and gate-level simulation against the golden model; formal proofs
# ---------------------------------------------------------------------------

def l3(readme: str) -> dict[str, Any]:
    rows = read_csv("l3_verification.csv")
    assert all(r["passed"] == "True" and r["mismatches"] == "0" and r["latency_ok"] == "True" for r in rows)
    rtl = [r for r in rows if r["level"] == "rtl"]
    gate = [r for r in rows if r["level"] == "gate"]
    configs = sorted({r["key"] for r in rtl})
    sims = sorted({r["simulator_version"] for r in rows})
    # the README's own summary of these rows
    assert f"| generated RTL, Verilator + Icarus | {len(configs)} " in readme
    assert f"**0 mismatches** in {len(rtl)} runs" in readme
    assert f"**0 mismatches** in {len(gate)} runs" in readme
    assert all(sum(r["key"] == k for r in rtl) == 2 for k in configs), "each RTL config runs in both simulators"
    angles_rtl = sum(int(r["n_angles"]) for r in rtl)
    angles_gate = sum(int(r["n_angles"]) for r in gate)
    slim = [{
        "level": r["level"], "simulator": r["simulator"], "key": r["key"], "family": r["family"],
        "data_width": int(r["data_width"]), "exhaustive": r["sweep"].startswith("exhaustive"),
        "n_angles": int(r["n_angles"]), "mismatches": int(r["mismatches"]),
        "latency": int(r["latency_measured"]), "latency_expected": int(r["latency_expected"]),
    } for r in rows]
    return {
        "provenance": "exact",
        "simulators": sims,
        "configs": len(configs),
        "rtl_runs": len(rtl),
        "gate_runs": len(gate),
        "rtl_angles": angles_rtl,
        "gate_angles": angles_gate,
        "exhaustive_configs": len({r["key"] for r in rtl if r["sweep"].startswith("exhaustive")}),
        "max_exhaustive_width": max(int(r["data_width"]) for r in rtl if r["sweep"].startswith("exhaustive")),
        "per_family": {f: {"configs": len({r["key"] for r in rtl if r["family"] == f}),
                           "gate_runs": sum(r["family"] == f for r in gate)} for f in FAMILIES},
        # the netlist flow (each row also names its own cell counts, which differ by design)
        "gate_netlist": sorted({r["netlist"].split("; ")[0] for r in gate}),
        "rows": slim,
    }


def formal(readme: str) -> dict[str, Any]:
    rows = read_csv("formal_results.csv")
    assert all(r["status"] == "PASS" for r in rows)
    assert f"**{len(rows)}/{len(rows)} proved**" in readme
    return {
        "provenance": "exact",
        "tools": sorted({f"{r['yosys']}; {r['sby']}; {r['solver'].replace('z3 Z3 version', 'z3')}" for r in rows}),
        "rows": [{"job": r["job"], "kind": r["kind"], "key": r["key"], "family": r["key"].split(":")[0],
                  "mode": r["mode"], "depth": int(r["depth"]), "status": r["status"],
                  "seconds": float(r["seconds"])} for r in rows],
    }


# ---------------------------------------------------------------------------
# L4: synthesis and place-and-route (measured), against the M1 estimate
# ---------------------------------------------------------------------------

def l4(readme: str) -> dict[str, Any]:
    rows = read_csv("l4_synthesis.csv")
    assert f"\n{len(rows)} points:" in readme or f"{len(rows)} points" in readme
    out = []
    for r in rows:
        k = key_of(r)
        est = m1_estimate(k)
        seeds = [float(x) for x in r["fmax_kind"].split(":")[-1].strip().split(";")]
        assert math.isclose(statistics.median(seeds), float(r["fmax_mhz"]), abs_tol=0.005), k
        out.append({
            "key": k, "family": r["family"], "rtl": r["rtl_source"],
            "luts": float(r["luts"]), "ffs": float(r["ffs"]), "carry4": float(r["carry4"]),
            "fmax_mhz": float(r["fmax_mhz"]), "fmax_seeds": seeds,
            "est": {m: round(v, 4) for m, v in est.items()},
        })
    tools = sorted({r["tool_version"] for r in rows})
    assert len(tools) == 1
    return {"provenance": f"measured ({tools[0]})", "tool": rows[0]["tool"], "tool_version": tools[0],
            "part": rows[0]["part"], "target_mhz": float(rows[0]["target_mhz"]), "rows": out}


# ---------------------------------------------------------------------------
# Vivado 2025.2: two batches and the spot-check, post-synthesis and post-route
# ---------------------------------------------------------------------------

WNS_RE = re.compile(r"WNS (-?[\d.]+) ns at ([\d.]+) ns")


def vivado(readme: str) -> dict[str, Any]:
    out = []
    for batch, name in ((1, "vivado_measured.csv"), (2, "vivado_measured_2.csv"), (0, "vivado_spotcheck.csv")):
        for r in read_csv(name):
            assert r["tool"] == "vivado" and r["tool_version"] == "2025.2" and r["rtl_source"] == "generated"
            kind = "post-route" if r["fmax_kind"].startswith("post-route") else "post-synthesis"
            wns, period = (float(x) for x in WNS_RE.search(r["fmax_kind"]).groups())  # type: ignore[union-attr]
            fmax = float(r["fmax_mhz"])
            # the batches store Fmax to 2 decimals, the spot-check to 1
            assert math.isclose(1000.0 / (period - wns), fmax, abs_tol=0.006 if batch else 0.051), (name, fmax)
            k = key_of(r)
            out.append({"batch": batch, "key": k, "family": r["family"], "kind": kind,
                        "luts": float(r["luts"]), "ffs": float(r["ffs"]), "carry4": float(r["carry4"]),
                        "fmax_mhz": fmax, "wns_ns": wns, "period_ns": period,
                        "est": {m: round(v, 4) for m, v in m1_estimate(k).items()}})
    designs = {(o["batch"], o["key"]) for o in out if o["batch"] > 0}
    assert len(designs) == 14 and "Fourteen generated designs" in readme
    for b in (1, 2):
        for k in {o["key"] for o in out if o["batch"] == b}:
            assert sorted(o["kind"] for o in out if o["batch"] == b and o["key"] == k) == ["post-route", "post-synthesis"]
    return {"provenance": "measured (Vivado 2025.2)", "part": "xc7a35tcpg236-1", "rows": out}


# ---------------------------------------------------------------------------
# L5: the refits, checked against their reports
# ---------------------------------------------------------------------------

def _pct(x: float) -> str:
    return f"{x:.1f}%"


def l5(name: str) -> dict[str, Any]:
    js = json.loads((D / f"l5_refit_{name}.json").read_text())
    md = (D / f"l5_refit_{name}.md").read_text()
    # the RMS-by-tool table, row by row, as the report prints it
    for tool, b in js["summary_before"].items():
        a = js["summary_after"][tool]
        line = (f"| {tool} | {b['n']} | {_pct(b['rms_luts_err_pct'])} | {_pct(a['rms_luts_err_pct'])} | "
                f"{_pct(b['rms_ffs_err_pct'])} | {_pct(a['rms_ffs_err_pct'])} | {_pct(b['rms_fmax_err_pct'])} | "
                f"{_pct(a['rms_fmax_err_pct'])} |")
        assert line in md, line
    for fam, s in js["loo_summary"].items():
        line = (f"| {fam} | {s['n']} | {s['luts_in']:.1f} → {s['luts_loo']:.1f}% | {s['ffs_in']:.1f} → {s['ffs_loo']:.1f}% | "
                f"{s['fmax_in']:.1f} → {s['fmax_loo']:.1f}% |")
        assert line in md, line
    for spec, g in js["ground_truth_impact"].items():
        assert f"| {spec} | `{g['winner_m1']}` | `{g['winner_refit']}` | {'yes' if g['winner_changed'] else 'no'} |" in md
    return {
        "name": js["name"], "calibration_file": js["calibration_file"], "base": js["base"],
        "n_fit_points": js["n_fit_points"], "tool_corrections": js["tool_corrections"],
        "constants_m1": js["constants_m1"], "constants_refit": js["constants_refit"],
        "per_family": js["per_family"], "summary_before": js["summary_before"],
        "summary_after": js["summary_after"], "loo_summary": js["loo_summary"],
        "ground_truth_impact": js["ground_truth_impact"],
        "any_winner_changed": any(g["winner_changed"] for g in js["ground_truth_impact"].values()),
        "residuals_before": js["residuals_before"], "residuals_after": js["residuals_after"],
    }


def scatter(refit: dict[str, Any], l4d: dict[str, Any], viv: dict[str, Any]) -> list[dict[str, Any]]:
    """Every measured point of the vivado-2025.2 refit report: measured against the M1 estimate
    and against the refit's prediction (on the point's own tool scale). Measured values and
    the M1 estimates are re-checked against the CSVs and the reference."""
    after = {(r["tool"], r["rtl_source"], r["key"]): r for r in refit["residuals_after"]}
    meas: dict[tuple[str, str, str], dict[str, float]] = {}
    for r in l4d["rows"]:
        meas[("yosys+nextpnr-xilinx", r["rtl"], r["key"])] = r
    for r in viv["rows"]:
        if r["batch"] > 0:
            meas[("vivado" if r["kind"] == "post-synthesis" else "vivado post-route", "generated", r["key"])] = r
    out = []
    for b in refit["residuals_before"]:
        k = (b["tool"], b["rtl_source"], b["key"])
        a = after[k]
        if b["rtl_source"] == "generated":
            m = meas[k]
            for met in ("luts", "ffs", "fmax"):
                mv = m["fmax_mhz"] if met == "fmax" else m[met]
                assert math.isclose(b[f"{met}_meas"], mv, abs_tol=0.051), (k, met)
                ev = m["est"]["fmax_mhz" if met == "fmax" else met]
                assert math.isclose(b[f"{met}_model"], ev, abs_tol=0.051), (k, met, b[f"{met}_model"], ev)
        out.append({
            "tool": b["tool"], "rtl": b["rtl_source"], "key": b["key"], "family": b["key"].split(":")[0],
            "fitted": b["tool"] != "vivado post-route" and not (b["tool"] == "vivado" and b["rtl_source"] == "reference"),
            **{f"{met}_meas": b[f"{met}_meas"] for met in ("luts", "ffs", "fmax")},
            **{f"{met}_m1": b[f"{met}_model"] for met in ("luts", "ffs", "fmax")},
            **{f"{met}_refit": a[f"{met}_model"] for met in ("luts", "ffs", "fmax")},
        })
    return out


# ---------------------------------------------------------------------------
# The worked example: one design up the ladder (docs/worked_example_m2.md)
# ---------------------------------------------------------------------------

def _table(md: str, header: str) -> list[list[str]]:
    """The rows of the Markdown table whose header line starts with `header`."""
    lines = md.splitlines()
    i = next(i for i, l in enumerate(lines) if l.startswith(header))
    rows = []
    for l in lines[i + 2:]:
        if not l.startswith("|"):
            break
        rows.append([c.strip() for c in l.strip().strip("|").split("|")])
    return rows


def worked(l3d: dict[str, Any], l4d: dict[str, Any]) -> dict[str, Any]:
    md = text("docs/worked_example_m2.md")
    key = re.search(r"^Design: `([^`]+)`", md, re.M).group(1)  # type: ignore[union-attr]
    arch = arch_of(key)
    ev = evaluate(arch)
    # L1
    l1 = {r[0]: {"value": r[1], "provenance": r[2]} for r in _table(md, "| metric | value | provenance |")}
    assert l1["luts"]["value"] == f"{ev['luts']:.4g}" and l1["fmax_mhz"]["value"] == f"{ev['fmax_mhz']:.4g}"
    assert l1["accuracy_bits"]["value"] == f"{ev['accuracy_bits']:.4g}"
    # L3: the README's rows for this design, both simulators
    sims = _table(md, "| simulator | angles |")
    rtl = [r for r in l3d["rows"] if r["key"] == key and r["level"] == "rtl"]
    assert len(rtl) == len(sims) == 2 and all(r["mismatches"] == 0 for r in rtl)
    for s in sims:
        assert s[2] == "0" and s[3] == f"{rtl[0]['latency']} / {rtl[0]['latency_expected']}"
    module = re.search(r"emits `(\w+)` \((\d+) lines\)", md)  # type: ignore[union-attr]
    header = md.split("```systemverilog\n", 1)[1].split("`default_nettype", 1)[0].strip().splitlines()
    # gate level (the worked example's own run; zero-delay netlist simulation)
    g = re.search(r"Netlist: (.*?); zero-delay; (\d+) LUT, (\d+) FF, (\d+) CARRY4 cells\.", md)
    gm = re.search(r"Verilator on exhaustive \((\d+) angles\): \*\*(\d+) mismatches\*\*, latency (\d+) \(documented (\d+)\)", md)
    assert g and gm and gm.group(2) == "0"
    # L4
    row = next(r for r in l4d["rows"] if r["key"] == key and r["rtl"] == "generated")
    l4t = {r[0]: r for r in _table(md, "| metric | L1 estimate (M1 calibration) | measured | estimate error |")}
    for met, v in (("luts", row["luts"]), ("ffs", row["ffs"]), ("fmax_mhz", row["fmax_mhz"])):
        assert l4t[met][2] == f"{v:.1f}", (met, l4t[met])
    seeds = re.search(r"median of seeds 1,2,3: ([\d.;]+)\.", md).group(1)  # type: ignore[union-attr]
    assert [float(x) for x in seeds.split(";")] == row["fmax_seeds"]
    # L5: recompute the (superseded) open-source refit the worked example uses
    cal = re.search(r"Refit calibration `([^`]+)`", md).group(1)  # type: ignore[union-attr]
    js = json.loads((D / "l5_refit_yosys-nextpnr.json").read_text())
    tau = js["tool_corrections"]["yosys+nextpnr-xilinx"]
    est = FpgaCostModel(str(REFIT_YOSYS)).estimate(arch)
    pred = {"luts": est.area["luts"], "ffs": est.area["ffs"], "fmax_mhz": est.fmax_mhz}
    scaled = {"luts": est.area["luts"] * tau["luts"], "ffs": est.area["ffs"] * tau["ffs"],
              "fmax_mhz": 1000.0 / (est.critical_path_ns * tau["path"])}
    l5t = {r[0]: r for r in _table(md, "| metric | refit (Vivado scale) | refit × tool factor | measured | error |")}
    for met in ("luts", "ffs", "fmax_mhz"):
        assert l5t[met][1] == f"{pred[met]:.1f}" and l5t[met][2] == f"{scaled[met]:.1f}", (met, l5t[met], pred, scaled)
    ba = re.search(r"- status: `(\w+)`; (\d+) of (\d+) front designs have measurements;", md)
    changed = re.search(r"- winner changed: \*\*(\w+)\*\*", md).group(1)  # type: ignore[union-attr]
    thr = re.search(r"Throughput check with the measured clock: ([\d.]+) MHz / (\d+) cycles per result = ([\d.]+) MSPS against the spec's ≥ (\d+) MSPS: (.*)\.", md)
    assert ba and thr and changed == "False"
    assert thr.group(1) == f"{row['fmax_mhz']:.1f}" and thr.group(3) == f"{row['fmax_mhz'] / int(thr.group(2)):.1f}"
    return {
        "key": key, "family": arch.family, "params": arch.params(), "spec": "low_area_control",
        "l1": {"luts": ev["luts"], "ffs": ev["ffs"], "fmax_mhz": ev["fmax_mhz"], "throughput_msps": ev["throughput_msps"],
               "latency_cycles": ev["latency_cycles"], "max_abs_err": ev["max_abs_err"], "accuracy_bits": ev["accuracy_bits"],
               "n_angles": 2 ** arch.numerics.W, "calibration": l1["luts"]["provenance"]},
        "rtl": {"module": module.group(1), "lines": int(module.group(2)), "header": header[:5]},
        "l3": [{"simulator": r["simulator"], "version": next(s[0] for s in sims if s[0].lower().startswith(r["simulator"])),
                "n_angles": r["n_angles"], "mismatches": r["mismatches"], "latency": r["latency"],
                "latency_expected": r["latency_expected"]} for r in rtl],
        "gate": {"netlist": g.group(1), "luts": int(g.group(2)), "ffs": int(g.group(3)), "carry4": int(g.group(4)),
                 "simulator": "verilator", "n_angles": int(gm.group(1)), "mismatches": int(gm.group(2)),
                 "latency": int(gm.group(3)), "latency_expected": int(gm.group(4))},
        "l4": {"tool_version": l4d["tool_version"], "part": l4d["part"], "luts": row["luts"], "ffs": row["ffs"],
               "fmax_mhz": row["fmax_mhz"], "fmax_seeds": row["fmax_seeds"], "carry4": row["carry4"],
               "err_pct": {met: float(l4t[met][3].rstrip("%")) for met in ("luts", "ffs", "fmax_mhz")}},
        "l5": {"calibration": cal, "vivado_scale": {m: round(v, 4) for m, v in pred.items()},
               "tool_scaled": {m: round(v, 4) for m, v in scaled.items()},
               "err_pct": {met: float(l5t[met][4].rstrip("%")) for met in ("luts", "ffs", "fmax_mhz")},
               "status": ba.group(1), "measured_front": int(ba.group(2)), "front": int(ba.group(3)),
               "winner_changed": changed == "True",
               "throughput_msps": float(thr.group(3)), "cycles": int(thr.group(2)), "min_msps": float(thr.group(4)),
               "verdict": thr.group(5)},
    }


# ---------------------------------------------------------------------------
# high_precision: m=6 (the ground truth's winner) against m=8, estimate and measurement
# ---------------------------------------------------------------------------

def high_precision(spec: Spec, viv: dict[str, Any], refit: dict[str, Any], readme: str) -> dict[str, Any]:
    min_msps = spec.min_throughput_msps
    cm = FpgaCostModel(str(REFIT_VIVADO))
    out = []
    for m in (6, 8):
        key = f"pipelined_m:data_width=26,n_iter=22,angle_guard=0,frac_guard=0,rounding=round,m={m}"
        arch = arch_of(key)
        assert arch.results_per_cycle == 1  # throughput (MSPS) = Fmax (MHz)
        ev = evaluate(arch, spec)
        r = cm.estimate(arch)
        after = next(x for x in refit["residuals_after"] if x["key"] == key and x["tool"] == "vivado")
        assert math.isclose(after["fmax_model"], r.fmax_mhz, abs_tol=0.051)
        ps = next(x for x in viv["rows"] if x["key"] == key and x["kind"] == "post-synthesis")
        pr = next(x for x in viv["rows"] if x["key"] == key and x["kind"] == "post-route")
        out.append({
            "m": m, "key": key, "params": arch.params(),
            "m1": {"luts_plus_ffs": ev["luts_plus_ffs"], "msps": ev["throughput_msps"], "feasible": bool(ev["feasible"])},
            "refit": {"luts_plus_ffs": r.area["luts"] + r.area["ffs"], "msps": r.fmax_mhz},
            "post_synth": {"luts": ps["luts"], "ffs": ps["ffs"], "msps": ps["fmax_mhz"], "wns_ns": ps["wns_ns"]},
            "post_route": {"luts": pr["luts"], "ffs": pr["ffs"], "msps": pr["fmax_mhz"], "wns_ns": pr["wns_ns"]},
            "accuracy_bits": ev["accuracy_bits"], "max_abs_err": ev["max_abs_err"],
        })
    m6, m8 = out
    margin = {k: {str(o["m"]): (o[k]["msps"] / min_msps - 1) for o in out} for k in ("m1", "refit", "post_synth", "post_route")}
    # the README's statement of the verdict, checked against the numbers
    assert f"**{m6['post_route']['msps']:.2f} MHz (+{margin['post_route']['6'] * 100:.1f}%)**" in readme
    # (the README prints a negative margin with a typographic minus)
    assert f"**{m8['post_route']['msps']:.2f} MHz (−{-margin['post_route']['8'] * 100:.1f}%)**" in readme
    assert f"**{m8['post_synth']['msps']:.2f} MSPS, {-margin['post_synth']['8'] * 100:.2f}% short**" in readme
    area = {str(o["m"]): o["post_synth"]["luts"] + o["post_synth"]["ffs"] for o in out}
    assert f"({area['8']:,.0f} vs {area['6']:,.0f} LUT+FF" in readme
    return {"spec": spec.name, "min_msps": min_msps, "candidates": out, "margin": margin,
            "constraint_note": "Vivado synthesised both at the anchors' 10 ns clock, not the 20 ns that 50 MSPS needs."}


def build(readme: str, specs: dict[str, Spec]) -> dict[str, Any]:
    l3d = l3(readme)
    l4d = l4(readme)
    viv = vivado(readme)
    rv = l5("vivado-2025.2")
    ry = l5("yosys-nextpnr")
    return {
        "l3": l3d,
        "formal": formal(readme),
        "l4": l4d,
        "vivado": viv,
        "l5": {"vivado": {k: v for k, v in rv.items() if not k.startswith("residuals")},
               "yosys": {k: v for k, v in ry.items() if not k.startswith("residuals")}},
        "scatter": scatter(rv, l4d, viv),
        "worked": worked(l3d, l4d),
        "high_precision": high_precision(specs["high_precision"], viv, rv, readme),
    }
