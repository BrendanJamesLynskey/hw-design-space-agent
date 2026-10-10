# eval/data: what each file is and how it was made

Every number in these files comes from code or from a named tool. None comes
from an LLM. Provenance labels: *exact* (bit-accurate simulation),
*estimate* (cost model + calibration id), *measured (tool, version)*.

## L3: RTL verification

| file | what | regenerate |
|---|---|---|
| `l3_verification.csv` | one row per (configuration, simulator, level). `level=rtl`: generated SystemVerilog; `level=gate`: Yosys-mapped netlist simulated with that Yosys's `xilinx/cells_sim.v` (zero-delay). `mismatches` counts angles whose (cos, sin) codes differ from `cordic_sincos()`; `latency_ok` checks every result's latency against the documented one. Exhaustive sweep for W ≤ 16, dense (131,072-angle) sweep above. | `python scripts/run_l3_sweep.py` (rtl rows) and `python scripts/run_gate_sim.py` (gate rows) |
| `formal_results.csv` | SymbiYosys k-induction proofs (W = 8): `pipelined_m` ≡ `pipelined` after latency alignment, and valid/ready/latency properties per family. Jobs are in `formal/`. | `python -m hw_dse.rtl.formal` |

Simulators used for the committed rows: Verilator 5.020, Icarus Verilog 12.0
(Ubuntu 24.04 packages). Formal: Yosys 0.33, SBY (git), z3 4.8.12.

## L4: open-source synthesis (measured)

`l4_synthesis.csv` follows the measured-points schema of
`src/hw_dse/synth/measured.py` (the same schema the Vivado points will use).

* **Tools**: Yosys 0.68 (git 38e001a6f) and nextpnr-xilinx 0.8.2-81-g1743d0f4
  (openXC7), run from the `regymm/openxc7` container image (digest
  `sha256:35c910739e3a4b40850b85de31ebc8954985a66e982009f09123b70dbb0e75da`).
  Chip database built from the image's prjxray-db with `scripts/build_chipdb.sh`.
* **Part**: xc7a35tcpg236-1 (the Vivado anchors' part). Clock on pin W5, every
  other port bit on a user I/O pin (LVCMOS33); 100 MHz target (`--freq 100`), the
  anchors' 10 ns constraint.
* **Command** (per design; exact strings in the `command` column):

  ```
  yosys -p 'read_verilog -sv <top>.sv; synth_xilinx -flatten -abc9 -arch xc7 -top <top>;
            tee -o stat.txt stat; write_json <top>.json; write_verilog -noattr <top>_netlist.v'
  nextpnr-xilinx --chipdb xc7a35t.bin --xdc <top>.xdc --json <top>.json --write <top>_routed.json
                 --freq 100 --seed <1|2|3> --timing-allow-fail -l pnr.log
  ```
* **Columns**: `luts` = Yosys LUT1–LUT6 + INV (a LUT1 on 7-series) + LUT shift
  registers; `ffs` = FDRE/FDSE/FDCE/FDPE; `carry4`; `fmax_mhz` = median over
  nextpnr seeds 1, 2, 3 of the **post-route** "Max frequency for clock" figure
  (all three in `fmax_kind`). `notes` keeps nextpnr's SLICE_LUTX count, which
  counts LUT *bels* including route-throughs and is not comparable to Vivado's
  Slice LUTs.
* **Logs**: `l4_logs/<rtl_source>_<top>.log.gz` holds the Yosys `stat` output
  and the full nextpnr log of every seed.
* **Points**: the two Vivado anchors twice (vendored reference RTL and the
  generated equivalent), the six points also measured in Vivado (`unrolled_k`
  k=2/4, `pipelined_m` m=2/4, `pipelined` W=12/24; all N=14), the three
  ground-truth winners and a spread over every family (see
  `src/hw_dse/synth/sweep.py`).
* **Not comparable to Vivado one-to-one**: different mapper (ABC9 vs Vivado
  synthesis), different LUT accounting, and nextpnr's post-route timing model
  vs the anchors' Vivado post-synthesis estimates. `l5_refit_yosys-nextpnr.md`
  quantifies this with per-tool correction factors.

Regenerate: `HW_DSE_CHIPDB_DIR=<dir with xc7a35t.bin> python scripts/run_l4_sweep.py`
(about 10 minutes on 4 cores; `--yosys-only` for counts without place-and-route).

## L5: back-annotation

| file | what |
|---|---|
| `vivado_spotcheck.csv` | one Vivado 2025.2 measurement in the measured-points schema: the *generated* `pipelined` W=16 N=14 (720 LUT, 751 FF, 190 CARRY4, 327.4 MHz = 1000/(10 − 6.946 ns), `synth_design` only on xc7a35tcpg236-1), run by the maintainer with `scripts/vivado_points.py` while reviewing PR #3. Reports are not committed. |
| `l5_refit_yosys-nextpnr.md` / `.json` | the cost model refitted to the 37 generated-RTL L4 points, the Vivado spot-check and the remaining reference-RTL Vivado anchor (`iterative`; the `pipelined` one is superseded by the spot-check), each tool carrying equal total weight, with one correction factor per tool and metric (Vivado = 1); residuals at every measured point before (M1 calibration) and after; leave-one-out RMS; the ground truth recomputed under the refit. Writes `src/hw_dse/models/calibration_artix7_refit_yosys-nextpnr.yaml`, which is **not** the default. |

| `vivado_measured.csv` | Vivado 2025.2 on the eight designs `scripts/vivado_points.py export --route` writes (`unrolled_k` k=2/4, `pipelined_m` m=2/4, `pipelined` W=12/24, and the *generated* `iterative` / `pipelined` anchors; W=16 N=14 unless noted), xc7a35tcpg236-1, 10 ns clock, `set_param general.maxThreads 2`, run on the maintainer's machine. Two rows per design: **post-synthesis** (`synth_design`, the anchors' flow; Fmax = 1000/(10 − WNS)) and **post-route** (`opt_design; place_design; route_design`, same formula), told apart by `fmax_kind`. |
| `vivado_logs/<design>/` | the reports those rows were parsed from: `utilization.rpt`, `timing.rpt` (post-synthesis), `utilization_routed.rpt`, `timing_routed.rpt`, plus `design_key.txt`. The `Host` header lines are redacted. `python scripts/vivado_points.py collect --dir eval/data/vivado_logs --out eval/data/vivado_measured.csv` re-creates the CSV byte for byte. No checkpoints or project files. |
| `vivado_measured_2.csv`, `vivado_logs_2/<design>/` | batch 2, same flow, layout and redaction: `pipelined_m` W=26 N=22 round m=6 / m=8 (the `high_precision` winner and its neighbour), `iterative` W=12 / W=24 N=14, `unrolled_k` k=3 / k=8 (W=16 N=14). Exported with `vivado_points.py` (`vp.POINTS` set to these six before `vp.export(..., route=True)`); 12 rows. |
| `l5_refit_vivado-2025.2.md` / `.json` | the refit on the 14 Vivado post-synthesis rows (both batches) and the 37 generated-RTL L4 rows (the spot-check is counted once: it duplicates batch 1's `pipelined` W=16 N=14 row and agrees within 0.5%; the post-route rows and the reference-RTL anchors are reported, not fitted). Same method and report as below, plus a leave-one-out breakdown per tool. Writes `src/hw_dse/models/calibration_artix7_refit_vivado-2025.2.yaml`, which is **not** the default. |

Regenerate:

```bash
python -m hw_dse.synth.recalibrate --measured eval/data/vivado_measured.csv --measured eval/data/vivado_measured_2.csv \
       --measured eval/data/l4_synthesis.csv --measured eval/data/vivado_spotcheck.csv --name vivado-2025.2
python -m hw_dse.synth.recalibrate --measured eval/data/l4_synthesis.csv --measured eval/data/vivado_spotcheck.csv --name yosys-nextpnr
```

## The eval

| file | what |
|---|---|
| `ground_truth.json` | exhaustive grid (635,040 designs) under the default (M1, 2-anchor Vivado) calibration: true front, true HV, the spec-selected design. Unchanged in M2. |
| `baselines.json` | M1 baselines (NSGA-II, random), 3 seeds. |
| `baselines_m2.json` | M2 baselines, 5 seeds. |
| `agent/` | M1 live agent runs (untouched). |
| `agent_m2/` | M2 live agent runs. |
| `spend_ledger.jsonl` | append-only provider-reported cost per live run (M1 and M2). |
| `key_usage_m2.json` | OpenRouter key usage before and after the M2 runs. |
| `levers_offline.json`, `levers_offline_round2.json` | offline tuning of the whole-curve levers by replaying the recorded M1 LLM decisions (`eval/tune_levers.py`). |
| `traces/` | M1 live-run traces; `traces/m2/` the M2 ones (`INDEX.md` in each). |
| `accuracy_table.csv.gz` | exact accuracy of every numeric configuration (golden model). |

## Milestone 3

| file / directory | what | written by |
|---|---|---|
| `ground_truth_m3.json` | system specs: exhaustive truth (system metrics simulated), the L1-bound view, the MSPS-only view | `eval/run_eval.py ground-truth-m3` |
| `l2_cycle_validation.csv` | L2 cycle model vs generated RTL, per-edge comparison on bursty traces (Verilator, Icarus) | `python -m hw_dse.l2.validate` |
| `m2_replay.json` | the 60 M2 runs replayed through the M3 graph, field by field | `eval/m3_offline.py replay` |
| `m3_mapfront_fix.json` | the map_front fix (unconditional and gated) on the M2 specs, replayed decisions + heuristic architect | `eval/m3_offline.py mapfront` |
| `baselines_m3.json` | NSGA-II / random on the system specs, + the L2 shortlist step, scored on simulated feasibility | `eval/run_eval.py baselines-m3` |
| `agent_m3/` | structured graph, live, system specs, 5 seeds × 3 models | `eval/run_eval.py agent-m3` |
| `campaign_m3/` | campaign agent (Deep Agents), live, memory off, all six specs | `eval/run_eval.py campaign-m3` |
| `campaign_m3_memory/`, `campaign_m3_memory_store.json` | campaign agent with memory on over a fixed sequence; the Store's contents after the eval (one store per seed; every entry carries its run IDs) | `eval/run_eval.py memory-m3` |
| `m3_pilot/` | the live pilots, including the failed first campaign pilot (`*_attempt1.json`) | `--pilot` |
| `key_usage_m3.json` | key usage snapshots (free endpoint; the key is never recorded) | `eval/run_eval.py key-usage --tag ...` |
| `spend_ledger.jsonl` | every live run's provider-reported cost; M3 rows carry `milestone: m3` and an `arm` | the live commands |
| `traces/m3/` | every M3 live run's LLM trace (+ tool log, inner reports, evaluations), with `INDEX.md`; campaigns also `pool_keys.json.gz` (the L1 pool, so every campaign can be re-scored) | `scripts/archive_traces_m3.py`, then `eval/m3_rescore.py` |
| (rows with `before_b1`) | M3 rows re-scored after the L2 fix (selection over every L1-feasible design); the old values are kept | `eval/m3_rescore.py` |
