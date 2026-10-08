"""Turn HW_Design_Space_Agent's vendored results into this site's data and parity fixtures.

    python scripts/export_dse.py          # write src/data/*.json and tests/fixtures/*.json
    python scripts/export_dse.py --check  # fail if any of them is out of date (CI)

Inputs, all under vendor/hw_dse/ (copied byte for byte at a pinned commit by
`pnpm vendor:dse <commit>`; VENDORED.json holds the hashes):

- README.md            the roadmap table: which milestones are done (the ladder badges);
- eval/results.md      the repo's own results tables: every number exported here is
                       re-formatted the way the repo formats it and must match that text;
- eval/data/...        the exhaustive ground truth, the baselines, the 48 agent-run
                       summaries, the run traces and the exact accuracy table;
- specs/*.yaml         the four example specs.

The Python reference (`hw_dse`, installed from git at the same commit, pinned in
reference/requirements.txt) computes everything else: the hill-climb on the real grid
(Why page), the hero run's per-round counts (Home), and the parity fixtures the TS ports of
the bit-exact CORDIC model and the FPGA cost model must match exactly
(tests/unit/cordic.test.ts, tests/unit/cost.test.ts). This script refuses to run against
any other installed commit.

Nothing here calls a language model. The LLM's words on the site (decisions, rationales)
are read from the recorded traces; in those records `parsed` (and in some records `usage`
and `settings`) are Python-repr strings, so they are read with ast.literal_eval.
"""
from __future__ import annotations

import argparse
import ast
import csv
import gzip
import hashlib
import importlib.metadata
import json
import math
import re
import statistics
import sys
from pathlib import Path
from typing import Any

import numpy as np

from hw_dse import accuracy_table
from hw_dse.evaluate import evaluate, objective_vector
from hw_dse.families import COMMON_PARAMS, REGISTRY, ArchConfig
from hw_dse.models import cordic_bitexact as cb
from hw_dse.models.cost_fpga import FpgaCostModel, load_calibration
from hw_dse.pareto import pareto_mask
from hw_dse.spec import Spec, load_spec

ROOT = Path(__file__).resolve().parent.parent
V = ROOT / "vendor/hw_dse"
DATA = ROOT / "src/data"
FIX = ROOT / "tests/fixtures"
SPECS = ("dds_250msps", "high_precision", "infeasible_dds_400msps", "low_area_control")

# Provenance labels, as the repo uses them.
EXACT = "exact"
ESTIMATE = "estimate"
MEASURED = "measured"


def installed_commit() -> str:
    d = importlib.metadata.distribution("hw-dse")
    info = json.loads(d.read_text("direct_url.json") or "{}")
    return info.get("vcs_info", {}).get("commit_id", "")


def rnd(x: float | None, nd: int = 6) -> float | None:
    """Round floats for the site data (display only; parity fixtures keep full precision)."""
    if x is None:
        return None
    if isinstance(x, float) and (math.isnan(x) or math.isinf(x)):
        return None
    return float(f"{x:.{nd}g}")


def literal(v: Any) -> Any:
    """A trace field that may be a Python-repr string (usage, settings, parsed)."""
    if isinstance(v, str):
        try:
            return ast.literal_eval(v)
        except (ValueError, SyntaxError):
            return v
    return v


# ---------------------------------------------------------------------------
# Milestones and the fidelity ladder
# ---------------------------------------------------------------------------

def milestones() -> list[dict[str, str]]:
    """The README's roadmap table at the vendored commit: milestone -> status."""
    text = (V / "README.md").read_text()
    sec = text.split("## Roadmap", 1)[1].split("\n## ", 1)[0]
    out = []
    for line in sec.splitlines():
        m = re.match(r"^\|\s*\**(M\d)\**\s*\|(.*)\|\s*\**([a-z ]+?)\**\s*\|\s*$", line)
        if m:
            out.append({"id": m.group(1), "levels": re.sub(r"\*\*", "", m.group(2)).strip(), "status": m.group(3).strip()})
    assert [m["id"] for m in out] == ["M1", "M2", "M3", "M4"], out
    return out


# The site's ladder. `repo_level` is the README's level number where it has one; levels the
# README does not list yet are the project's plan for that milestone (`plan_only`), and the
# site says so.
LADDER = [
    {"id": "L0", "name": "Spec intake", "milestone": "M1", "repo_level": "L0",
     "what": "natural language or YAML in, a validated Spec out; a human confirms it",
     "ppa": "constraints and objectives (no PPA numbers yet)",
     "check": "the Spec schema validates it; interrupt() asks a human to approve, edit or reject"},
    {"id": "L1", "name": "Analytical exploration", "milestone": "M1", "repo_level": "L1",
     "what": "the LLM picks families and ranges; NSGA-II searches them on fast models",
     "ppa": "accuracy exact (bit-accurate model); LUTs, FFs, Fmax, power index estimate (calibrated cost model)",
     "check": "the golden model is bit-exact against the reference RTL on all 65,536 input angles (Icarus, in CI)"},
    {"id": "SYS", "name": "System-level simulation (SimPy)", "milestone": "M3", "repo_level": None,
     "what": "the candidate inside a system model: traffic, queues, back-pressure",
     "ppa": "throughput and latency under load",
     "check": "regression against the golden model"},
    {"id": "L2", "name": "Cycle-level simulation", "milestone": "M3", "repo_level": "L2",
     "what": "cycle-accurate models of the shortlisted candidates",
     "ppa": "cycles and stalls, cycle-exact",
     "check": "regression against the golden model"},
    {"id": "L3", "name": "RTL simulation", "milestone": "M2", "repo_level": "L3",
     "what": "parametrised SystemVerilog per family, simulated",
     "ppa": "function, bit for bit",
     "check": "regression against the golden model; formal checks on small configurations"},
    {"id": "L4", "name": "Synthesis", "milestone": "M2", "repo_level": "L4",
     "what": "real synthesis of the shortlist",
     "ppa": "area, Fmax and power measured",
     "check": "regression against the golden model"},
    {"id": "GL", "name": "Gate-level simulation of the netlist", "milestone": "M2", "repo_level": None,
     "what": "the synthesised netlist, simulated",
     "ppa": "function after synthesis",
     "check": "regression against the golden model"},
    {"id": "L5", "name": "Back-annotation", "milestone": "M2", "repo_level": "L5",
     "what": "compare against L1, recalibrate the cost model, re-explore if the winner changes",
     "ppa": "the cost model's error, measured",
     "check": "the L1 ranking is re-checked against measured data"},
]


def ladder(ms: list[dict[str, str]]) -> list[dict[str, Any]]:
    status = {m["id"]: m["status"] for m in ms}
    out = []
    for lv in LADDER:
        s = status[lv["milestone"]]
        badge = "live" if s == "done" else ("in progress" if s == "in progress" else "planned")
        out.append({**lv, "status": badge, "plan_only": lv["repo_level"] is None})
    return out


# ---------------------------------------------------------------------------
# Specs, ground truth, results
# ---------------------------------------------------------------------------

def load_specs() -> dict[str, Spec]:
    return {n: load_spec(V / "specs" / f"{n}.yaml") for n in SPECS}


def params_from_key(key: str) -> dict[str, Any]:
    """'pipelined:data_width=18,...,rounding=round' -> the parameter dict."""
    out: dict[str, Any] = {}
    for kv in key.split(":", 1)[1].split(","):
        k, v = kv.split("=")
        out[k] = v if k == "rounding" else int(v)
    return out


def design(rec: dict[str, Any]) -> dict[str, Any]:
    """The parts of an evaluated design the site shows. Slim records (the ground truth's) carry
    no parameter columns: those come from the design key, and the design is re-evaluated with
    the reference to check the record."""
    if "data_width" not in rec:
        p = params_from_key(rec["key"])
        again = evaluate(ArchConfig.from_params(rec["family"], p))
        for m in ("luts", "ffs", "fmax_mhz", "max_abs_err", "accuracy_bits"):
            assert math.isclose(again[m], float(rec[m]), rel_tol=1e-12), (rec["key"], m)
        rec = {**rec, **p}
    p: dict[str, Any] = {k: (str(rec[k]) if k == "rounding" else int(float(rec[k])))
                         for k in ("data_width", "n_iter", "angle_guard", "frac_guard", "rounding") if k in rec}
    for k in ("k", "m"):
        if k in rec and rec[k] not in (None, "") and not (isinstance(rec[k], float) and math.isnan(rec[k])):
            p[k] = int(float(rec[k]))
    return {
        "key": rec["key"],
        "family": rec["family"],
        "params": p,
        "luts": rnd(float(rec["luts"])),
        "ffs": rnd(float(rec["ffs"])),
        "luts_plus_ffs": rnd(float(rec["luts_plus_ffs"])),
        "fmax_mhz": rnd(float(rec["fmax_mhz"])),
        "throughput_msps": rnd(float(rec["throughput_msps"])),
        "latency_cycles": int(float(rec["latency_cycles"])),
        "power_index": rnd(float(rec["power_index"])),
        "max_abs_err": rnd(float(rec["max_abs_err"])),
        "accuracy_bits": rnd(float(rec["accuracy_bits"])),
    }


def spec_json(s: Spec) -> dict[str, Any]:
    return {
        "name": s.name,
        "description": " ".join(s.description.split()),
        "constraints": [{"metric": c.metric, "op": c.op, "value": c.value} for c in s.constraints],
        "objectives": [{"metric": o.metric, "direction": o.direction, "ref": o.ref} for o in s.objectives],
        "select_by": s.select_by,
        "select_direction": s.select_direction,
        "budget": s.budget.total_evals,
    }


def fmt_frac(xs: list[float | None]) -> str:
    xs = [x for x in xs if x is not None and not math.isnan(x)]
    if not xs:
        return "n/a"
    if len(xs) == 1:
        return f"{xs[0]:.3f}"
    return f"{statistics.mean(xs):.3f} ± {statistics.pstdev(xs):.3f}"


def fmt_evals(xs: list[int | None]) -> str:
    hit = [x for x in xs if x is not None]
    if not hit:
        return f"not reached (0/{len(xs)})"
    return f"{statistics.median(hit):.0f} ({len(hit)}/{len(xs)} reached)"


def fmt_regret(xs: list[float | None]) -> str:
    vals = [x for x in xs if x is not None]
    if not vals:
        return "n/a"
    hits = sum(1 for x in vals if x <= 1e-9)
    return f"{statistics.mean(vals) * 100:+.1f}% mean ({hits}/{len(xs)} optimal)"


MODEL_LABELS = {
    "anthropic/claude-sonnet-5.5": "Sonnet 5.5",
    "deepseek/deepseek-v4.1-flash": "DeepSeek V4.1 Flash",
    "qwen/qwen3.8-27b": "Qwen3.8-27B",
    "qwen/qwen3.8-27b, reasoning off": "Qwen3.8-27B, reasoning off",
}


def agent_rows() -> dict[str, list[dict[str, Any]]]:
    out: dict[str, list[dict[str, Any]]] = {}
    for p in sorted((V / "eval/data/agent").glob("*/*.json")):
        row = json.loads(p.read_text())
        label = row["model_requested"] + ("" if row["reasoning"] == "provider default" else f", reasoning {row['reasoning']}")
        out.setdefault(label, []).append(row)
    return out


def results(specs: dict[str, Spec], gts: dict[str, Any]) -> dict[str, Any]:
    """Per spec and method: the numbers of eval/results.md, checked against its text."""
    results_md = (V / "eval/results.md").read_text()
    base = list(json.loads((V / "eval/data/baselines.json").read_text()).values())
    agents = agent_rows()
    methods: list[tuple[str, str, str, list[dict[str, Any]]]] = [
        ("nsga2", "NSGA-II", "baseline (a): NSGA-II, union space", [r for r in base if r["method"] == "nsga2"]),
        ("random", "Random search", "baseline (b): random search", [r for r in base if r["method"] == "random"]),
    ]
    for model, rows in agents.items():
        methods.append((model, MODEL_LABELS[model], f"agent: `{model}`", rows))
    per_spec: dict[str, Any] = {}
    for name in SPECS:
        feasible_spec = gts[name]["feasible"]
        rows_out = []
        for mid, label, md_name, rows in methods:
            rs = [r for r in rows if r["spec"] == name]
            assert len(rs) == 3, (name, mid)
            evals_mean = statistics.mean(r["n_evals"] for r in rs)
            infeas_ok = sum(r["infeasibility_correct"] for r in rs)
            if not feasible_spec:
                none_sel = sum(r["selected_key"] is None for r in rs)
                line = (f"| {md_name} | {len(rs)} | {evals_mean:.0f} | n/a (infeasible) | n/a | n/a ({none_sel}/{len(rs)} selected nothing) | n/a | "
                        f"{infeas_ok}/{len(rs)} |")
                hv = None
            else:
                line = (f"| {md_name} | {len(rs)} | {evals_mean:.0f} | {fmt_frac([r['hv_frac'] for r in rs])} | {fmt_evals([r['evals_to_95'] for r in rs])} | "
                        f"{sum(r['selected_meets_spec'] for r in rs)}/{len(rs)} | {fmt_regret([r.get('select_regret') for r in rs])} | "
                        f"{infeas_ok}/{len(rs)} |")
                hv = statistics.mean(r["hv_frac"] for r in rs)
            assert line in results_md, f"results.md does not contain the exported row:\n{line}"
            regrets = [r.get("select_regret") for r in rs if r.get("select_regret") is not None]
            agent = mid not in ("nsga2", "random")
            rows_out.append({
                "method": mid,
                "label": label,
                "agent": agent,
                "runs": len(rs),
                "evals_mean": rnd(evals_mean),
                "hv_frac_mean": rnd(hv),
                "hv_frac_text": None if hv is None else fmt_frac([r["hv_frac"] for r in rs]),
                "evals_to_95_text": None if hv is None else fmt_evals([r["evals_to_95"] for r in rs]),
                "regret_mean": rnd(statistics.mean(regrets)) if regrets else None,
                "regret_text": None if not feasible_spec else fmt_regret([r.get("select_regret") for r in rs]),
                "meets_spec": sum(r["selected_meets_spec"] for r in rs),
                "infeasibility_correct": infeas_ok,
                "declared_infeasible_by_llm": sum(r.get("status") == "infeasible" for r in rs) if agent else None,
            })
        per_spec[name] = rows_out
    return per_spec


def ground_truth(specs: dict[str, Spec]) -> dict[str, Any]:
    gts = json.loads((V / "eval/data/ground_truth.json").read_text())
    out = {}
    for name in SPECS:
        g = gts[name]
        out[name] = {
            "n_designs": g["n_designs"],
            "n_feasible": g["n_feasible"],
            "feasible": g["feasible"],
            "hv_true": rnd(g["hv_true"]),
            "best_throughput_msps_any": rnd(g["best_throughput_msps_any"]),
            "selected": design(g["selected"]) if g["selected"] else None,
            "front": [design(r) for r in g["front"]],
        }
    return out, gts


# ---------------------------------------------------------------------------
# Costs: tokens, dollars, wall-clock (measured)
# ---------------------------------------------------------------------------

def traces() -> list[dict[str, Any]]:
    """Every recorded LLM call, with the Python-repr fields parsed."""
    out = []
    for p in sorted((V / "eval/data/traces").glob("*/*/llm_trace.jsonl")):
        for line in p.read_text().splitlines():
            if not line.strip():
                continue
            r = json.loads(line)
            for k in ("usage", "settings", "parsed"):
                if k in r:
                    r[k] = literal(r[k])
            r["_run"] = f"{p.parent.parent.name}/{p.parent.name}"
            out.append(r)
    return out


def costs(trace_records: list[dict[str, Any]]) -> dict[str, Any]:
    agents = agent_rows()
    results_md = (V / "eval/results.md").read_text()
    total_trace = math.fsum(float(r.get("cost_usd") or 0.0) for r in trace_records)
    total_rows = math.fsum(r["cost_usd"] for rows in agents.values() for r in rows)
    # the check the brief names: the traces' cost_usd sums to the results.md total
    assert f"**${total_rows:.4f}**" in results_md
    assert f"{total_trace:.4f}" == f"{total_rows:.4f}" == "1.7367", (total_trace, total_rows)
    models = []
    for model, rows in agents.items():
        served = sorted({m for r in rows for m in r["models_served"]})
        reas = sorted({r["reasoning"] for r in rows})
        cost = math.fsum(r["cost_usd"] for r in rows)
        evals = sum(r["n_evals"] for r in rows)
        line = (f"| `{model}` | {', '.join(f'`{m}`' for m in served)} | {', '.join(reas)} | {len(rows)} | "
                f"{sum(r['llm_calls'] for r in rows):.0f} | {sum(r['llm_failures'] for r in rows):.0f} | "
                f"{sum(r['input_tokens'] for r in rows):,.0f} | {sum(r['output_tokens'] for r in rows):,.0f} | "
                f"{cost:.4f} |")
        assert line in results_md, line
        dates = sorted({r["run_dir"].split("/")[-1][:8] for r in rows})
        models.append({
            "model": model,
            "label": MODEL_LABELS[model],
            "model_id": rows[0]["model_requested"],
            "reasoning": reas[0],
            "runs": len(rows),
            "llm_calls": int(sum(r["llm_calls"] for r in rows)),
            "failed_calls": int(sum(r["llm_failures"] for r in rows)),
            "input_tokens": int(sum(r["input_tokens"] for r in rows)),
            "output_tokens": int(sum(r["output_tokens"] for r in rows)),
            "cost_usd": round(cost, 6),
            "cost_per_run": round(cost / len(rows), 6),
            "cost_per_spec": round(cost / len({r["spec"] for r in rows}), 6),
            "evals": evals,
            "cost_per_eval": cost / evals,
            "wall_s_total": round(math.fsum(r["wall_s"] for r in rows), 1),
            "wall_s_mean": round(statistics.mean(r["wall_s"] for r in rows), 2),
            "wall_s_max": max(r["wall_s"] for r in rows),
            "dates": [f"{d[:4]}-{d[4:6]}-{d[6:]}" for d in dates],
        })
    return {
        "provenance": MEASURED,
        "source": "provider-reported (OpenRouter) usage and cost in each run's summary; wall-clock timed by the eval harness",
        "total_usd": round(total_rows, 4),
        "trace_total_usd": round(total_trace, 4),
        "key_usage_note": "about $2.5 of key usage in total: calls that failed inside the client carry no usage, so the provider-reported sum undercounts",
        "runs": sum(m["runs"] for m in models),
        "models": models,
    }


# ---------------------------------------------------------------------------
# The hero run: one real recorded run, round by round (Home)
# ---------------------------------------------------------------------------

HERO = ("high_precision", "20261008-130043-d1d3")


def read_evals(run: str) -> list[dict[str, Any]]:
    with gzip.open(V / "eval/data/traces" / run / "evaluations.csv.gz", "rt", newline="") as fh:
        return list(csv.DictReader(fh))


def hero_run(specs: dict[str, Spec], trace_records: list[dict[str, Any]]) -> dict[str, Any]:
    spec_name, stamp = HERO
    run = f"{spec_name}/{stamp}"
    spec = specs[spec_name]
    rows = read_evals(run)
    summary = next(
        json.loads(p.read_text()) for p in (V / "eval/data/agent").glob("*/*.json")
        if json.loads(p.read_text())["run_dir"].endswith(stamp)
    )
    calls = [r for r in trace_records if r["_run"] == run]
    rounds = sorted({int(r["round"]) for r in rows})
    seen: list[dict[str, Any]] = []
    out_rounds = []
    for k in rounds:
        rr = [r for r in rows if int(r["round"]) == k]
        seen += rr
        feas = [r for r in seen if r["feasible"] == "True"]
        if feas:
            pts = np.array([objective_vector({o.metric: float(r[o.metric]) for o in spec.objectives}, spec) for r in feas])
            front = int(pareto_mask(pts).sum())
        else:
            front = 0
        fams: dict[str, int] = {}
        for r in rr:
            fams[r["family"]] = fams.get(r["family"], 0) + 1
        out_rounds.append({
            "round": k,
            "evals": len(rr),
            "feasible": sum(r["feasible"] == "True" for r in rr),
            "cumulative_evals": len(seen),
            "cumulative_feasible": len(feas),
            "front_size": front,
            "families": fams,
        })
    decisions = []
    for c in calls:
        parsed = c["parsed"] if isinstance(c["parsed"], dict) else {}
        decisions.append({
            "node": c["node"],
            "decision": parsed.get("decision", "plan" if c["node"] == "propose" else None),
            "rationale": parsed.get("rationale", ""),
            "families": [f.get("family") for f in parsed.get("families", [])] if c["node"] == "propose" else None,
            "input_tokens": int(c["usage"]["input_tokens"]),
            "output_tokens": int(c["usage"]["output_tokens"]),
            "cost_usd": float(c["cost_usd"]),
            "latency_s": float(c["latency_s"]),
        })
    sel = next(r for r in rows if r["key"] == summary["selected_key"])
    sel_index = next(i for i, r in enumerate(rows) if r["key"] == summary["selected_key"])
    assert [int(r["eval_index"]) for r in rows] == list(range(len(rows)))
    return {
        "run": run,
        "spec": spec_name,
        "model": summary["model_requested"],
        "seed": summary["seed"],
        "status": summary["status"],
        "n_families": len(REGISTRY),
        "n_designs": 635040,
        "rounds": out_rounds,
        "feasible_bits": "".join("1" if r["feasible"] == "True" else "0" for r in rows),
        "selected_index": sel_index,
        "decisions": decisions,
        "selected": design({**sel, "luts_plus_ffs": sel["luts_plus_ffs"]}),
        "select_regret": rnd(summary["select_regret"]),
        "hv_frac": rnd(summary["hv_frac"]),
        "llm_calls": int(summary["llm_calls"]),
        "input_tokens": int(summary["input_tokens"]),
        "output_tokens": int(summary["output_tokens"]),
        "cost_usd": summary["cost_usd"],
        "wall_s": summary["wall_s"],
    }


# ---------------------------------------------------------------------------
# "Micro-optimise the default design": a hill-climb on the real grid (Why page)
# ---------------------------------------------------------------------------

def numeric_box() -> dict[str, tuple[int, int] | tuple[str, ...]]:
    return {p.name: p.full_range() for p in COMMON_PARAMS}


def hill_climb(spec: Spec) -> dict[str, Any]:
    """Start at the reference iterative CORDIC and improve it by local moves only.

    The family is fixed (that is the premature decision); each step moves one numeric knob
    by one (W, N, angle guard, guard bits) or flips the rounding, and takes the best
    neighbour by (accuracy-constraint violation, then highest throughput, then fewest LUTs),
    until no neighbour is better. Every number comes from hw_dse.evaluate.
    """
    err_max = next(c.value for c in spec.constraints if c.metric == "max_abs_err")
    box = numeric_box()

    def score(rec: dict[str, Any]) -> tuple[float, float, float, str]:
        return (max(0.0, rec["max_abs_err"] - err_max) / err_max, -rec["throughput_msps"], rec["luts"], rec["key"])

    def ev(params: dict[str, Any]) -> dict[str, Any]:
        return evaluate(ArchConfig.from_params("iterative", params), spec)

    cur = {"data_width": 16, "n_iter": 14, "angle_guard": 0, "frac_guard": 0, "rounding": "trunc"}
    rec = ev(cur)
    path = [{"move": "start: the reference iterative CORDIC (W=16, N=14)", **design(rec), "feasible": bool(rec["feasible"]),
             "meets_accuracy": rec["max_abs_err"] <= err_max}]
    while True:
        best = None
        for k in ("data_width", "n_iter", "angle_guard", "frac_guard"):
            lo, hi = box[k]  # type: ignore[misc]
            for d in (-1, 1):
                v = cur[k] + d
                if lo <= v <= hi:
                    cand = {**cur, k: v}
                    r = ev(cand)
                    if best is None or score(r) < score(best[1]):
                        best = (cand, r, f"{k} {cur[k]} → {v}")
        flip = {**cur, "rounding": "round" if cur["rounding"] == "trunc" else "trunc"}
        r = ev(flip)
        if best is None or score(r) < score(best[1]):
            best = (flip, r, f"rounding {cur['rounding']} → {flip['rounding']}")
        if score(best[1]) >= score(rec):
            break
        cur, rec = best[0], best[1]
        path.append({"move": best[2], **design(rec), "feasible": bool(rec["feasible"]),
                     "meets_accuracy": rec["max_abs_err"] <= err_max})
    # The ceiling: the best the iterative family can do at this accuracy, over every one of
    # its 39,690 designs (exhaustive): no amount of local tuning gets past it.
    best_any = None
    for w in range(box["data_width"][0], box["data_width"][1] + 1):  # type: ignore[index]
        for n in range(box["n_iter"][0], box["n_iter"][1] + 1):  # type: ignore[index]
            for ag in range(box["angle_guard"][0], box["angle_guard"][1] + 1):  # type: ignore[index]
                for g in range(box["frac_guard"][0], box["frac_guard"][1] + 1):  # type: ignore[index]
                    for rd in ("trunc", "round"):
                        r = ev({"data_width": w, "n_iter": n, "angle_guard": ag, "frac_guard": g, "rounding": rd})
                        if r["max_abs_err"] <= err_max and (best_any is None or (-r["throughput_msps"], r["luts"], r["key"]) < (-best_any["throughput_msps"], best_any["luts"], best_any["key"])):
                            best_any = r
    assert best_any is not None
    return {
        "spec": spec.name,
        "err_max": err_max,
        "accuracy_bits_min": -math.log2(err_max),
        "throughput_min": spec.min_throughput_msps,
        "path": path,
        "iterative_ceiling": design(best_any),
        "iterative_designs": 39690,
    }


# ---------------------------------------------------------------------------
# Parity fixtures for the TS ports
# ---------------------------------------------------------------------------

CORDIC_CONFIGS = [
    dict(data_width=16, n_iter=14),
    dict(data_width=8, n_iter=4),
    dict(data_width=12, n_iter=10, angle_width=14, frac_guard=2, rounding="round"),
    dict(data_width=15, n_iter=12, angle_width=16),
    dict(data_width=16, n_iter=20, angle_width=14, frac_guard=4, rounding="trunc"),
    dict(data_width=18, n_iter=15, angle_width=19, frac_guard=0, rounding="round"),
    dict(data_width=24, n_iter=24, angle_width=24, frac_guard=3, rounding="round"),
    dict(data_width=26, n_iter=22, angle_width=27, frac_guard=1, rounding="trunc"),
    dict(data_width=28, n_iter=30, angle_width=32, frac_guard=4, rounding="round"),
    dict(data_width=10, n_iter=30, angle_width=8, frac_guard=0, rounding="trunc"),
]


def numerics(c: dict[str, Any]) -> cb.CordicNumerics:
    return cb.CordicNumerics(**c)


def trace_rotation(theta: int, cfg: cb.CordicNumerics) -> dict[str, Any]:
    """The datapath of cordic_bitexact.cordic_sincos, one angle, every register after every
    step (the animation's states). Checked against cordic_sincos's own outputs below."""
    t = np.array([theta], dtype=np.int64)
    W, A, g = cfg.W, cfg.A, cfg.frac_guard
    wx, wz = cfg.xy_width, cfg.z_width
    z = t << np.int64(A - W) if A >= W else t >> np.int64(W - A)
    quadrant = (t >> np.int64(W - 2)) & np.int64(3)
    x = np.full(t.shape, cb.init_x(cfg.n_iter, W - 2 + g), dtype=np.int64)
    y = np.zeros(t.shape, dtype=np.int64)
    pi_code = np.int64(1) << np.int64(A - 1)
    q2, q3 = quadrant == 1, quadrant == 2
    x = np.where(q2 | q3, -x, x)
    z = np.where(q2, z - pi_code, np.where(q3, z + pi_code, z))
    x, z = cb.wrap(x, wx), cb.wrap(z, wz)
    states = [{"x": int(x[0]), "y": int(y[0]), "z": int(z[0]), "sigma": 0}]
    lut = cb.atan_lut(cfg.n_iter, A)
    for i in range(cfg.n_iter):
        pos = z >= 0
        sy, sx = cb._shift(y, i, cfg.rounding), cb._shift(x, i, cfg.rounding)
        a = np.int64(lut[i])
        xn = np.where(pos, x - sy, x + sy)
        yn = np.where(pos, y + sx, y - sx)
        zn = np.where(pos, z - a, z + a)
        x, y, z = cb.wrap(xn, wx), cb.wrap(yn, wx), cb.wrap(zn, wz)
        states.append({"x": int(x[0]), "y": int(y[0]), "z": int(z[0]), "sigma": 1 if bool(pos[0]) else -1})
    c_out = int(cb.wrap(cb._shift(x, g, cfg.rounding), W)[0])
    s_out = int(cb.wrap(cb._shift(y, g, cfg.rounding), W)[0])
    ref_c, ref_s = cb.cordic_sincos(t, cfg)
    assert (c_out, s_out) == (int(ref_c[0]), int(ref_s[0])), "trace disagrees with cordic_sincos"
    return {"theta": theta, "quadrant": int(quadrant[0]), "states": states, "cos": c_out, "sin": s_out}


def cordic_fixtures() -> dict[str, Any]:
    out: dict[str, Any] = {"configs": []}
    for c in CORDIC_CONFIGS:
        cfg = numerics(c)
        W = cfg.W
        lo, hi = -(1 << (W - 1)), 1 << (W - 1)
        codes = np.unique(np.concatenate([
            np.arange(lo, hi, max(1, (hi - lo) // 509), dtype=np.int64),
            np.array([lo, lo + 1, -1, 0, 1, hi - 1, hi // 2, hi // 2 - 1, -hi // 2, -hi // 2 - 1, hi // 4, -hi // 4], dtype=np.int64),
        ]))
        cos_c, sin_c = cb.cordic_sincos(codes, cfg)
        entry: dict[str, Any] = {
            "config": {"data_width": W, "n_iter": cfg.n_iter, "angle_width": cfg.A, "frac_guard": cfg.frac_guard, "rounding": cfg.rounding},
            "atan_lut": list(cb.atan_lut(cfg.n_iter, cfg.A)),
            "init_x": cb.init_x(cfg.n_iter, W - 2 + cfg.frac_guard),
            "codes": codes.tolist(),
            "cos": cos_c.tolist(),
            "sin": sin_c.tolist(),
            "traces": [trace_rotation(int(t), cfg) for t in (codes[len(codes) // 7], codes[len(codes) // 2 + 3], codes[-5])],
        }
        if W <= cb.EXHAUSTIVE_MAX_WIDTH:
            allc = np.arange(lo, hi, dtype=np.int64)
            ac, as_ = cb.cordic_sincos(allc, cfg)
            text = ";".join(f"{a},{b}" for a, b in zip(ac.tolist(), as_.tolist()))
            entry["exhaustive_sha256"] = hashlib.sha256(text.encode()).hexdigest()
            acc = cb._accuracy(cfg)
            entry["accuracy"] = {"max_abs_lsb": acc.max_abs_lsb, "rms_lsb": acc.rms_lsb, "accuracy_bits": acc.accuracy_bits,
                                 "n_angles": acc.n_angles}
        out["configs"].append(entry)
    out["gain"] = [{"n": n, "k": cb.cordic_gain(n)} for n in (1, 4, 14, 30)]
    return out


def cost_archs() -> list[ArchConfig]:
    archs = []
    for fam in REGISTRY:
        for w, n, ag, g, rd in [(16, 14, 0, 0, "trunc"), (8, 4, -2, 0, "round"), (12, 10, 2, 2, "round"), (18, 15, 1, 0, "round"),
                                 (20, 17, 0, 1, "trunc"), (24, 24, 0, 3, "round"), (26, 22, 1, 1, "trunc"), (28, 30, 4, 4, "round"),
                                 (15, 12, 1, 0, "round"), (10, 7, -1, 3, "trunc")]:
            p: dict[str, Any] = {"data_width": w, "n_iter": n, "angle_guard": ag, "frac_guard": g, "rounding": rd}
            extras = [None] if fam in ("iterative", "pipelined") else [2, 3, 5, 8]
            for e in extras:
                q = dict(p)
                if fam == "unrolled_k":
                    q["k"] = e
                if fam == "pipelined_m":
                    q["m"] = e
                archs.append(ArchConfig.from_params(fam, q))
    return archs


def cost_fixtures() -> dict[str, Any]:
    cm = FpgaCostModel()
    rows = []
    for a in cost_archs():
        est = cm.estimate(a)
        rec = evaluate(a)  # no spec: f_op = Fmax
        rows.append({
            "family": a.family,
            "params": a.params(),
            "key": a.key(),
            "luts": est.area["luts"],
            "ffs": est.area["ffs"],
            "fmax_mhz": est.fmax_mhz,
            "critical_path_ns": est.critical_path_ns,
            "breakdown": est.breakdown,
            "latency_cycles": a.latency_cycles,
            "results_per_cycle": a.results_per_cycle,
            "steps": a.steps,
            "rotations_per_step": a.rotations_per_step,
            "throughput_msps": rec["throughput_msps"],
            "latency_ns": rec["latency_ns"],
            "power_index": rec["power_index"],
        })
    return {"power_norm": cm.power_norm, "rows": rows}


def calibration() -> dict[str, Any]:
    cal = load_calibration()
    vend = __import__("yaml").safe_load((V / "src/hw_dse/models/calibration_artix7.yaml").read_text())
    assert cal == vend, "the installed calibration differs from the vendored one"
    return {
        "id": cal["id"],
        "device": cal["device"],
        "source_constants": cal["source_constants"],
        "fitted": cal["fitted"],
        "anchors": [{k: a[k] for k in ("family", "params", "luts", "ffs", "fmax_mhz")} for a in cal["anchors"]],
        "power_reference": cal["power_reference"],
        "provenance": f"estimate: cost_fpga ({cal['id']}, {len(cal['anchors'])} anchors)",
    }


# ---------------------------------------------------------------------------

def build() -> dict[Path, str]:
    vend = json.loads((V / "VENDORED.json").read_text())
    commit = installed_commit()
    if commit != vend["commit"]:
        sys.exit(f"installed hw-dse is at {commit[:7] or '?'}, the site vendors {vend['commit'][:7]}: "
                 "pip install -r reference/requirements.txt")
    for path, rec in vend["files"].items():
        assert hashlib.sha256((V / path).read_bytes()).hexdigest() == rec["sha256"], path
    accuracy_table.preload(V / "eval/data/accuracy_table.csv.gz")
    specs = load_specs()
    gt, gts_raw = ground_truth(specs)
    trace_records = traces()
    ms = milestones()
    site = {
        "vendored": {"repository": vend["repository"], "commit": vend["commit"], "committed": vend["committed"]},
        "milestones": ms,
        "ladder": ladder(ms),
        "specs": {n: spec_json(s) for n, s in specs.items()},
        "ground_truth": gt,
        "results": results(specs, gts_raw),
        "costs": costs(trace_records),
        "hero": hero_run(specs, trace_records),
        "trace_calls": len(trace_records),
        "trace_runs": len({r["_run"] for r in trace_records}),
    }
    why = {"hill_climb": hill_climb(specs["dds_250msps"])}
    dump = lambda o: json.dumps(o, ensure_ascii=False, indent=1) + "\n"  # noqa: E731
    compact = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":")) + "\n"  # noqa: E731
    return {
        DATA / "site.json": dump(site),
        DATA / "why.json": dump(why),
        DATA / "calibration.json": dump(calibration()),
        FIX / "cordic.json": compact(cordic_fixtures()),
        FIX / "cost.json": compact(cost_fixtures()),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    out = build()
    stale = []
    for path, text in out.items():
        if a.check:
            if not path.exists() or path.read_text() != text:
                stale.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
            print(f"wrote {path.relative_to(ROOT)} ({len(text):,} bytes)")
    if stale:
        sys.exit("out of date (run python scripts/export_dse.py): " + ", ".join(stale))
    if a.check:
        print("site data and fixtures are up to date")


if __name__ == "__main__":
    main()
