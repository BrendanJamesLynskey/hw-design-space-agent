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


def test_every_vendored_file_matches_its_hash():
    assert len(VENDORED["files"]) >= 200
    for path, rec in VENDORED["files"].items():
        assert hashlib.sha256((V / path).read_bytes()).hexdigest() == rec["sha256"], path


def test_installed_reference_is_the_vendored_commit():
    d = importlib.metadata.distribution("hw-dse")
    assert json.loads(d.read_text("direct_url.json"))["vcs_info"]["commit_id"] == VENDORED["commit"]
    assert SITE["vendored"]["commit"] == VENDORED["commit"]


def test_trace_costs_sum_to_the_results_total():
    """The brief's check: the 48 traces' cost_usd sums to $1.7367, as in results.md."""
    total, calls, runs = 0.0, 0, set()
    for p in sorted((V / "eval/data/traces").glob("*/*/llm_trace.jsonl")):
        for line in p.read_text().splitlines():
            if line.strip():
                r = json.loads(line)
                total += float(r.get("cost_usd") or 0.0)
                calls += 1
                runs.add(p.parent)
                parsed = r.get("parsed")
                if isinstance(parsed, str) and parsed:
                    ast.literal_eval(parsed)  # Python-repr strings, not JSON
    assert f"{total:.4f}" == "1.7367"
    assert "**$1.7367**" in (V / "eval/results.md").read_text()
    assert SITE["costs"]["total_usd"] == 1.7367
    assert SITE["trace_calls"] == calls
    assert SITE["trace_runs"] == len(runs)


def test_only_done_milestones_are_live():
    status = {m["id"]: m["status"] for m in SITE["milestones"]}
    assert status["M1"] == "done"
    for lv in SITE["ladder"]:
        assert (lv["status"] == "live") == (status[lv["milestone"]] == "done"), lv["id"]
    live = [lv["id"] for lv in SITE["ladder"] if lv["status"] == "live"]
    assert live == ["L0", "L1"]


def test_hero_run_is_a_recorded_run():
    h = SITE["hero"]
    assert (V / "eval/data/traces" / h["run"] / "llm_trace.jsonl").exists()
    assert sum(r["evals"] for r in h["rounds"]) == len(h["feasible_bits"]) == 400
    assert sum(int(c) for c in h["feasible_bits"]) == h["rounds"][-1]["cumulative_feasible"]
    assert len(h["decisions"]) == h["llm_calls"]
    assert math.isclose(sum(d["cost_usd"] for d in h["decisions"]), h["cost_usd"], rel_tol=1e-9)
    assert h["feasible_bits"][h["selected_index"]] == "1"


def test_infeasible_spec_called_by_every_llm_run():
    rows = [r for r in SITE["results"]["infeasible_dds_400msps"] if r["agent"]]
    assert sum(r["declared_infeasible_by_llm"] for r in rows) == sum(r["runs"] for r in rows) == 12
    assert SITE["ground_truth"]["infeasible_dds_400msps"]["best_throughput_msps_any"] < 400


def test_nsga2_wins_hypervolume_where_the_brief_says():
    """The site must not imply the agent beat NSGA-II on hypervolume where it did not."""
    for spec in ("dds_250msps", "low_area_control"):
        rows = SITE["results"][spec]
        ns = next(r for r in rows if r["method"] == "nsga2")
        assert all(r["hv_frac_mean"] < ns["hv_frac_mean"] for r in rows if r["agent"]), spec


def test_every_scored_run_is_exported_for_the_replays():
    """48 run files (one per scored run), each agreeing with its summary row."""
    runs = sorted((ROOT / "src/data/runs").glob("*.json"))
    assert len(runs) == 48 == len(SITE["runs"])
    for p in runs:
        r = json.loads(p.read_text())
        assert len(r["calls"]) == r["llm_calls"]
        assert sum(not c["ok"] for c in r["calls"]) == r["llm_failures"]
        assert len(r["points"]["x"]) == r["n_evals"] == (r["rounds"][-1]["total"] if r["rounds"] else 0)
        # failed calls report no cost: the provider-reported total undercounts
        assert all(c["cost_usd"] == 0 for c in r["calls"] if not c["ok"])


def test_race_ends_on_the_recorded_hv_fractions():
    race = json.loads((ROOT / "src/data/race.json").read_text())
    for name, spec in race["specs"].items():
        for m in spec["methods"]:
            for s in m["seeds"]:
                assert math.isclose(s["curve"][-1], s["hv_frac"], abs_tol=1e-5), (name, m["method"], s["seed"])
