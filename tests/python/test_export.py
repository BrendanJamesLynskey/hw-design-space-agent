"""The vendored data is the agent repository's data at the pinned commit, and the site's data says
only what that data supports."""
from __future__ import annotations

import ast
import hashlib
import importlib.metadata
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
V = ROOT / "vendor/hw_dse"
VENDORED = json.loads((V / "VENDORED.json").read_text())
SITE = json.loads((ROOT / "src/data/site.json").read_text())
LADDER = json.loads((ROOT / "src/data/ladder.json").read_text())


def test_every_vendored_file_matches_its_hash():
    assert len(VENDORED["files"]) >= 400
    for path, rec in VENDORED["files"].items():
        assert hashlib.sha256((V / path).read_bytes()).hexdigest() == rec["sha256"], path


def test_installed_reference_is_the_vendored_commit():
    d = importlib.metadata.distribution("hw-dse")
    assert json.loads(d.read_text("direct_url.json"))["vcs_info"]["commit_id"] == VENDORED["commit"]
    assert SITE["vendored"]["commit"] == VENDORED["commit"]


def _trace_sum(pattern: str) -> tuple[float, int, set[Path]]:
    total, calls, runs = 0.0, 0, set()
    for p in sorted((V / "eval/data/traces").glob(pattern)):
        for line in p.read_text().splitlines():
            if line.strip():
                r = json.loads(line)
                total += float(r.get("cost_usd") or 0.0)
                calls += 1
                runs.add(p.parent)
                parsed = r.get("parsed")
                if isinstance(parsed, str) and parsed:
                    ast.literal_eval(parsed)  # Python-repr strings, not JSON
    return total, calls, runs


def test_trace_costs_sum_to_the_results_totals():
    """M1: the 48 traces' cost_usd sums to $1.7367, as in results.md. M2: the agent summaries
    ($1.6488) plus the pilot ($0.0166) equal the traces ($1.6654); the key's usage rose by
    $1.657747."""
    md = (V / "eval/results.md").read_text()
    t1, c1, r1 = _trace_sum("*/*/llm_trace.jsonl")
    assert f"{t1:.4f}" == "1.7367" and "M1 **$1.7367**" in md
    t2, c2, r2 = _trace_sum("m2/**/llm_trace.jsonl")
    assert f"{t2:.4f}" == "1.6654"
    assert "M2 **$1.6488** (+ M2 pilot $0.0166)" in md
    sp = SITE["spend"]
    assert sp["m1"]["provider_usd"] == 1.7367 and sp["m2"]["provider_usd"] == 1.6488
    assert sp["m2"]["pilot_usd"] == 0.0166 and sp["m2"]["trace_usd"] == 1.6654
    key = json.loads((V / "eval/data/key_usage_m2.json").read_text())
    assert round(key["after_m2"]["usage_usd"] - key["before_m2"]["usage_usd"], 6) == sp["m2"]["key_usd"] == 1.657747
    assert SITE["evals"]["m1"]["costs"]["total_usd"] == 1.7367
    assert SITE["evals"]["m2"]["costs"]["total_usd"] == 1.6488
    assert SITE["trace_calls"] == c1 + c2
    assert SITE["evals"]["m1"]["trace_runs"] == len(r1)
    assert SITE["evals"]["m2"]["trace_runs"] + sp["m2"]["pilot_runs"] == len(r2)


def test_only_done_milestones_are_live():
    status = {m["id"]: m["status"] for m in SITE["milestones"]}
    assert status == {"M1": "done", "M2": "done", "M3": "planned", "M4": "planned"}
    for lv in SITE["ladder"]:
        assert (lv["status"] == "live") == (status[lv["milestone"]] == "done"), lv["id"]
    live = [lv["id"] for lv in SITE["ladder"] if lv["status"] == "live"]
    assert live == ["L0", "L1", "L3", "L4", "GL", "L5"]
    planned = {lv["id"]: lv["milestone"] for lv in SITE["ladder"] if lv["status"] == "planned"}
    assert planned == {"SYS": "M3", "L2": "M3"}


def test_hero_run_is_a_recorded_m2_run_down_the_ladder():
    h = SITE["hero"]
    assert h["milestone"] == "m2"
    assert (V / "eval/data/traces" / h["run"] / "llm_trace.jsonl").exists()
    assert sum(r["evals"] for r in h["rounds"]) == len(h["feasible_bits"]) == 400
    assert sum(int(c) for c in h["feasible_bits"]) == h["rounds"][-1]["cumulative_feasible"]
    assert len(h["decisions"]) == h["llm_calls"]
    assert math.isclose(sum(d["cost_usd"] for d in h["decisions"]), h["cost_usd"], rel_tol=1e-9)
    assert h["feasible_bits"][h["selected_index"]] == "1"
    # it selected the worked example's design, which has L3, gate-level and L4 data
    w = LADDER["worked"]
    assert h["selected"]["key"] == w["key"] and h["select_regret"] == 0
    assert all(r["mismatches"] == 0 for r in w["l3"]) and w["gate"]["mismatches"] == 0
    assert h["back_annotation"]["luts"][1] == w["l4"]["luts"]


def test_infeasible_spec_called_by_every_llm_run():
    for ms, n in (("m1", 12), ("m2", 15)):
        rows = [r for r in SITE["evals"][ms]["results"]["infeasible_dds_400msps"] if r["agent"]]
        assert sum(r["declared_infeasible_by_llm"] for r in rows) == sum(r["runs"] for r in rows) == n
    assert SITE["ground_truth"]["infeasible_dds_400msps"]["best_throughput_msps_any"] < 400


def test_m1_nsga2_wins_hypervolume_where_the_brief_says():
    """The site must not imply M1's agent beat NSGA-II on hypervolume where it did not."""
    for spec in ("dds_250msps", "low_area_control"):
        rows = SITE["evals"]["m1"]["results"][spec]
        ns = next(r for r in rows if r["method"] == "nsga2")
        assert all(r["hv_frac_mean"] < ns["hv_frac_mean"] for r in rows if r["agent"]), spec


def test_m2_headline():
    """HV 0.96–1.09× NSGA-II; regret below NSGA-II's in 8 of 9 cells, the loss Qwen on high_precision."""
    g = SITE["glance"]
    assert g["hv_ratio_m2"] == [0.96, 1.09]
    assert (g["regret_beats_nsga2_m2"], g["regret_cells"]) == (8, 9)
    assert g["regret_losses_m2"] == [{"spec": "high_precision", "model": "qwen/qwen3.8-27b, reasoning off"}]


def test_every_scored_run_is_exported_for_the_replays():
    """108 run files (48 M1, 60 M2), each agreeing with its summary row."""
    runs = sorted((ROOT / "src/data/runs").glob("*.json"))
    assert len(runs) == 108 == len(SITE["runs"])
    for p in runs:
        r = json.loads(p.read_text())
        assert len(r["calls"]) == r["llm_calls"]
        assert sum(not c["ok"] for c in r["calls"]) == r["llm_failures"]
        assert len(r["points"]["x"]) == r["n_evals"] == (r["rounds"][-1]["total"] if r["rounds"] else 0)
        # failed calls report no cost
        assert all(c["cost_usd"] == 0 for c in r["calls"] if not c["ok"])
        # code's front-mapping rounds (M2) are marked, and the last of them has no LLM call
        if r["milestone"] == "m1":
            assert not any(x["plan_by_code"] for x in r["rounds"])
        assert all(x["llm_call"] or x["plan_by_code"] for x in r["rounds"])


def test_race_ends_on_the_recorded_hv_fractions():
    race = json.loads((ROOT / "src/data/race.json").read_text())
    for ms, n in (("m1", 3), ("m2", 5)):
        for name, spec in race[ms]["specs"].items():
            for m in spec["methods"]:
                assert len(m["seeds"]) == n
                for s in m["seeds"]:
                    assert math.isclose(s["curve"][-1], s["hv_frac"], abs_tol=1e-5), (ms, name, m["method"], s["seed"])


def test_ladder_data():
    """L3: 47 configurations × 2 simulators and 22 gate runs, 0 mismatches; 7/7 proofs; 39 L4
    points; 14 Vivado designs with both views; no refit changes a winner."""
    l3 = LADDER["l3"]
    assert (l3["configs"], l3["rtl_runs"], l3["gate_runs"]) == (47, 94, 22)
    assert all(r["mismatches"] == 0 for r in l3["rows"])
    assert [r["status"] for r in LADDER["formal"]["rows"]] == ["PASS"] * 7
    assert len(LADDER["l4"]["rows"]) == 39
    designs = {(r["batch"], r["key"]) for r in LADDER["vivado"]["rows"] if r["batch"] > 0}
    assert len(designs) == 14
    assert not LADDER["l5"]["vivado"]["any_winner_changed"] and not LADDER["l5"]["yosys"]["any_winner_changed"]
    hp = LADDER["high_precision"]
    m6, m8 = hp["candidates"]
    assert m6["post_route"]["msps"] >= hp["min_msps"] > m8["post_route"]["msps"]
    assert m8["post_synth"]["msps"] < hp["min_msps"]
