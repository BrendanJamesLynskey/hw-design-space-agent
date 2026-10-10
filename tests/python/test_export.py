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
M3 = json.loads((ROOT / "src/data/m3.json").read_text())


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
    """M3 is done (the README notes what the campaign agent did not achieve); M4 is planned.
    Every ladder level is live, SimPy and L2 (cycle level) since M3; ASIC and the fleet are M4's
    and stay on the roadmap."""
    status = {m["id"]: m["status"] for m in SITE["milestones"]}
    assert status == {"M1": "done", "M2": "done", "M3": "done", "M4": "planned"}
    m3 = next(m for m in SITE["milestones"] if m["id"] == "M3")
    assert m3["note"].startswith("see the A/B")
    for lv in SITE["ladder"]:
        assert (lv["status"] == "live") == (status[lv["milestone"]] == "done"), lv["id"]
    live = [lv["id"] for lv in SITE["ladder"] if lv["status"] == "live"]
    assert live == ["L0", "L1", "SYS", "L2", "L3", "L4", "GL", "L5"]
    m4 = next(m for m in SITE["milestones"] if m["id"] == "M4")
    assert "ASIC" in m4["levels"] and "fleet" in m4["levels"]


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


def test_m3_system_specs():
    """Feasible counts and winners of the three system specs; the peak-rate view gives
    bursty_offload's winner and feasible count, and stops at m=5 on multiaxis_control."""
    gt = {r["name"]: r for r in M3["ground_truth"]["specs"]}
    b, m, d = gt["bursty_offload"], gt["multiaxis_control"], gt["dds_sfdr"]
    assert (b["n_feasible"], m["n_feasible"], d["n_feasible"]) == (151528, 51244, 12334)
    assert m["n_feasible_l1_bound"] == 53667
    assert b["winner_changes"] and m["winner_changes"] and not d["winner_changes"]
    assert (m["true"]["params"]["m"], m["bound"]["params"]["m"], m["msps_only"]["params"]["m"]) == (4, 5, 7)
    assert round(m["true"]["luts_plus_ffs"]) == 1072 and round(b["true"]["luts_plus_ffs"]) == 745
    assert b["peak_rate"]["winner"] == b["true"]["key"] and b["peak_rate"]["n_feasible"] == b["n_feasible"]
    assert m["peak_rate"]["winner"] == m["bound"]["key"] and m["peak_rate"]["n_feasible"] == 66383
    # m=5 passes the L1 bound and misses the simulated deadline by 1.5%
    assert m["bound"]["bound"]["sys_p99_batch_us"] <= 0.44 < m["bound"]["simulated"]["sys_p99_batch_us"]


def test_m3_system_replay_matches_the_ground_truth():
    rep = M3["system_replay"]
    gt = {r["name"]: r for r in M3["ground_truth"]["specs"]}["multiaxis_control"]
    by = {d["view"]: d for d in rep["designs"]}
    assert [by[v]["meets"] for v in ("msps_only", "bound", "true")] == [False, False, True]
    assert by["bound"]["bound_meets"] and not by["msps_only"]["bound_meets"]
    for v in ("bound", "true"):
        d = by[v]
        assert math.isclose(d["p99_us"], gt[v]["simulated"]["sys_p99_batch_us"], rel_tol=1e-5)
        assert len(d["accept_ns"]) == len(d["result_ns"]) == rep["requests"] == 32
        assert math.isclose(max(d["result_ns"]) / 1000, d["p99_us"], rel_tol=1e-4)
        assert len(d["batches_ns"]) == rep["n_ticks"]


def test_m3_cycle_validation():
    """48/48 traces identical; the reconstructed stimulus takes exactly the RTL log's edges."""
    c = M3["cycle"]
    assert (c["passed"], c["traces"], c["edges"]) == (48, 48, 28424)
    assert len(c["designs"]) == 8 and {d["family"] for d in c["designs"]} == {"iterative", "unrolled_k", "pipelined", "pipelined_m"}
    for d in c["designs"]:
        assert len(d["runs"]) == 6
        assert all(r["ready_mismatches"] == r["valid_mismatches"] == r["data_mismatches"] == 0 for r in d["runs"])
    for w in c["waves"]:
        assert len(w["ready"]) == len(w["valid_out"]) == 96


def test_m3_structured_ab_memory_and_spend():
    s = M3["structured"]
    for spec in ("multiaxis_control", "bursty_offload"):
        rows = {r["method"]: r for r in s[spec]}
        assert all(r["meets_spec"] == 5 for r in rows.values())
        assert all(r["l2_changed"] == 0 for r in rows.values() if r["agent"])
        assert all(r["regret"]["mean"] < rows["nsga2"]["regret"]["mean"] for r in rows.values() if r["agent"])
    ab = M3["ab"]
    assert ab["single_run_dse"] == 52 and ab["campaigns"] == 65
    assert ab["l2_reselect"]["structured"] == [0, 30] and ab["l2_reselect"]["campaign"] == [4, 65]
    costs = {c["model"]: c for c in ab["costs"]}
    assert costs["anthropic/claude-sonnet-5.5"]["specs"] == ["multiaxis_control"]
    assert costs["qwen/qwen3.8-27b, reasoning off"]["failures"] == [0, 4]
    assert all(c["cost_ratio"] > 1 for c in costs.values())
    pooled = ab["pooled"]
    assert all(p["hv"][1] < p["hv"][0] and p["regret"][1] > p["regret"][0] for p in pooled.values())
    assert M3["levers"]["replay"] == {"identical": 60, "runs": 60, "architect_inputs": 60}
    sp = M3["spend"]
    assert (sp["ledger_total_usd"], sp["ledger_entries"], sp["trace_usd"]) == (3.4901, 114, 3.4519)
    assert round(sp["key_usd"], 4) == 3.5775 and sp["key_usd"] <= sp["cap_usd"]
