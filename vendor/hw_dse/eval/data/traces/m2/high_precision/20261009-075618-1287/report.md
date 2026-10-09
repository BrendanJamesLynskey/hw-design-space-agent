# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec high_precision: Coherent demodulator for a precision instrument: max error <= 2^-20 at >= 50 MSPS. Minimise area (LUTs + FFs) and the relative power index.
  constraint: throughput_msps >= 50
  constraint: max_abs_err <= 9.53674e-07
  objective: min luts_plus_ffs (HV ref 8000)
  objective: min power_index (HV ref 20)
  select: min luts_plus_ffs
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=26,n_iter=22,angle_guard=0,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1864 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 395 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 96 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.25 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.22e-07 (2^-20.05) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 15.5 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.31e-07 (2^-22.04) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.88 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

| tool | LUTs est → meas | FFs est → meas | Fmax MHz est → meas |
|---|---|---|---|
| measured (yosys+nextpnr-xilinx yosys 0.68 (git 38e001a6f) + nextpnr-xilinx 0.8.2-81-g1743d0f4) | 1864 → 1827 (-2.0%) | 396 → 392 (-0.9%) | 62 → 36 (-42.9%) |

Winner check (1 of 1 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=0,frac_guard=0,rounding=round,m=6` | 1864 | 395 | 62.5 | 6 | 4.25 | 9.22e-07 (2^-20.05) | 20.05 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 50 MSPS throughput constraint eliminates iterative and unrolled_k (which produce 1 result every several cycles), so only pipelined and pipelined_m are feasible. The 2^-20 accuracy constraint forces data_width and n_iter into the upper part of their ranges (accuracy depends only on these plus guards/rounding). I focus the full first round on these two families to map the area/power trade-off curve, since the selection rule minimises luts_plus_ffs and the hypervolume rewards covering the whole front.*)
- `pipelined` (50 evals): data_width=20..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only pipelined and pipelined_m can meet the 50 MSPS throughput constraint; pipelined is the area/power baseline for 1 result/cycle.
- `pipelined_m` (50 evals): data_width=20..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* pipelined_m trades latency for area/power via m; it is the primary lever for the area/power objectives while keeping 1 result/cycle throughput.

**Result (code):** 100 evaluations this round, 100 total; 52 feasible; hypervolume 8.766e+04 (n/a).

**LLM decision:** `refine` — The current Pareto front is a single point (pipelined_m, 2364 LUT+FF, 4.45 power) with very low hypervolume (8.76e4). The feasible region for pipelined_m is broad (data_width 26-27, n_iter 22-30, m 2-7), but the search has only found one extreme. To maximize hypervolume, we need to map the trade-off curve between area and power. Reducing `m` (pipeline depth) generally reduces latency and potentially power (fewer registers/clock gating overhead) but may increase LUTs due to more frequent register updates or different critical paths, while increasing `m` reduces area but increases power. We should focus the next round on `pipelined_m` with a tighter range around the known feasible area to densely sample the trade-off, specifically varying `m` from 2 to 7 and `n_iter` from 22 to 25 (since higher n_iter increases area without significant accuracy gain beyond the 20-bit requirement). We will also keep `data_width` at 26-27 as required for accuracy.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.766e+04 (gain this round: n/a (first round)).
Feasible designs: 52 of 100 evaluations (44 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 6% violate; best seen 264
- max_abs_err <= 9.53674e-07: 43% violate; best seen 7.88e-08 (2^-23.60)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2364, power_index=4.45, luts=1953, ffs=412, throughput_msps=52, max_abs_err=9.34e-07 (2^-20.03)
Front coverage: luts_plus_ffs 2364..2364 (HV reference 8000); power_index 4.45..4.45 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- pipelined: 50 evals, 28 feasible; max throughput seen 264 MSPS; best accuracy 23.60 bits; best feasible luts_plus_ffs=4009; feasible ranges: data_width 26..27, n_iter 22..30, angle_guard -1..4, frac_guard 1..4
- pipelined_m: 50 evals, 24 feasible; max throughput seen 158 MSPS; best accuracy 23.58 bits; best feasible luts_plus_ffs=2364; feasible ranges: data_width 26..27, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The current front is a single point. Refining the search to densely sample the pipelined_m family's trade-off space (specifically m and n_iter) will reveal the full Pareto curve, increasing hypervolume. The accuracy constraint (20 bits) is met by n_iter >= 22 with data_width 26-27, so we can safely limit n_iter to 22-25 to save budget for exploring the m dimension which drives the area/power trade-off.*)
- `pipelined_m` (100 evals): data_width=26..27, n_iter=22..25, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, m=2..7. *Why:* Focus on pipelined_m to map the area-power trade-off curve by varying m and n_iter within the feasible accuracy/throughput envelope.

**Result (code):** 100 evaluations this round, 200 total; 140 feasible; hypervolume 9.041e+04 (+3.1%).

**LLM decision:** `map_front` — The current Pareto front consists of a single point (pipelined_m, luts_plus_ffs=2260, power_index=4.25). This is a very poor representation of the trade-off curve, resulting in a low hypervolume (9.041e+04). The feasible region for pipelined_m is well-explored (112 feasible points), but the front has not been fully mapped. Since the selection rule minimizes luts_plus_ffs and the current best is 2260, we need to ensure we haven't missed a design with lower area or a better power/area trade-off. The 'map_front' action will allow the code to use NSGA-II to exhaustively search the full parameter ranges of the families currently on the front (pipelined_m) to populate the Pareto front more densely. This is crucial for maximizing hypervolume before the final selection. We have 200 evaluations left, which is sufficient for a thorough front mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9.041e+04 (gain this round: +3.1%).
Feasible designs: 140 of 200 evaluations (119 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 3% violate; best seen 264
- max_abs_err <= 9.53674e-07: 28% violate; best seen 7.88e-08 (2^-23.60)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=0 frac_guard=0 rounding=round m=6] luts_plus_ffs=2260, power_index=4.25, luts=1864, ffs=395, throughput_msps=62.5, max_abs_err=9.22e-07 (2^-20.05)
Front coverage: luts_plus_ffs 2260..2260 (HV reference 8000); power_index 4.25..4.25 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- pipelined: 50 evals, 28 feasible; max throughput seen 264 MSPS; best accuracy 23.60 bits; best feasible luts_plus_ffs=4009; feasible ranges: data_width 26..27, n_iter 22..30, angle_guard -1..4, frac_guard 1..4
- pipelined_m: 150 evals, 112 feasible; max throughput seen 158 MSPS; best accuracy 23.58 bits; best feasible luts_plus_ffs=2260; feasible ranges: data_width 26..27, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 166 feasible; hypervolume 9.041e+04 (+0.0%).

**LLM decision:** `map_front` — The current Pareto front consists of a single point (pipelined_m, luts_plus_ffs=2260, power_index=4.25). The hypervolume gain in Round 3 was 0.0%, indicating stagnation. The feasible region for pipelined_m is broad (data_width 25..28, n_iter 22..30, m 2..7), but the search has converged to a single corner. To maximize hypervolume, we need to map the trade-off curve between area and power across the full feasible ranges of the families currently on the front (pipelined_m). The 'iterative' and 'unrolled_k' families are unlikely to improve the front significantly because they have lower throughput (1 result every N+3 or ceil(N/k)+3 cycles) compared to the pipelined families which already meet the 50 MSPS constraint with high margin (best seen 158-264 MSPS). Therefore, mapping the existing front is the most efficient use of the remaining budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9.041e+04 (gain this round: +0.0%).
Feasible designs: 166 of 240 evaluations (140 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 5% violate; best seen 264
- max_abs_err <= 9.53674e-07: 27% violate; best seen 3.75e-08 (2^-24.67)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=0 frac_guard=0 rounding=round m=6] luts_plus_ffs=2260, power_index=4.25, luts=1864, ffs=395, throughput_msps=62.5, max_abs_err=9.22e-07 (2^-20.05)
Front coverage: luts_plus_ffs 2260..2260 (HV reference 8000); power_index 4.25..4.25 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- pipelined: 50 evals, 28 feasible; max throughput seen 264 MSPS; best accuracy 23.60 bits; best feasible luts_plus_ffs=4009; feasible ranges: data_width 26..27, n_iter 22..30, angle_guard -1..4, frac_guard 1..4
- pipelined_m: 190 evals, 138 feasible; max throughput seen 158 MSPS; best accuracy 24.67 bits; best feasible luts_plus_ffs=2260; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 227 feasible; hypervolume 9.041e+04 (+0.0%).

**LLM decision:** `stop` — The run has reached the final round (Round 4) and the evaluation budget (340/400). The feasible Pareto front contains a single design: `pipelined_m` with `data_width=26, n_iter=22, angle_guard=0, frac_guard=0, rounding=round, m=6`. This design satisfies all constraints: `max_abs_err` is 9.22e-07 (which is <= 9.53674e-07) and `throughput_msps` is 62.5 (which is >= 50). It minimizes the selection objective `luts_plus_ffs` at 2260. Although the front is a single point, the hypervolume gain in the final round was 0.0%, indicating convergence. The `pipelined_m` family was heavily explored (290 evals) and provided the best feasible area (2260) compared to `pipelined` (best feasible 4009). The unexplored families (`iterative`, `unrolled_k`) are structurally unsuitable for the throughput constraint (>= 50 MSPS) because they produce one result every several cycles, whereas `pipelined_m` produces one result per cycle. Given the hard stop at the round/budget limit and the existence of a valid, optimized design on the front, the correct action is to stop.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 9.041e+04 (gain this round: +0.0%).
Feasible designs: 227 of 340 evaluations (195 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 6% violate; best seen 264
- max_abs_err <= 9.53674e-07: 28% violate; best seen 3.75e-08 (2^-24.67)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=0 frac_guard=0 rounding=round m=6] luts_plus_ffs=2260, power_index=4.25, luts=1864, ffs=395, throughput_msps=62.5, max_abs_err=9.22e-07 (2^-20.05)
Front coverage: luts_plus_ffs 2260..2260 (HV reference 8000); power_index 4.25..4.25 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- pipelined: 50 evals, 28 feasible; max throughput seen 264 MSPS; best accuracy 23.60 bits; best feasible luts_plus_ffs=4009; feasible ranges: data_width 26..27, n_iter 22..30, angle_guard -1..4, frac_guard 1..4
- pipelined_m: 290 evals, 199 feasible; max throughput seen 158 MSPS; best accuracy 24.67 bits; best feasible luts_plus_ffs=2260; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 267 feasible; hypervolume 9.041e+04 (+0.0%).

**No LLM call** (code's front-mapping round): The run has reached the final round (Round 4) and the evaluation budget (340/400). The feasible Pareto front contains a single design: `pipelined_m` with `data_width=26, n_iter=22, angle_guard=0, frac_guard=0, rounding=round, m=6`. This design satisfies all constraints: `max_abs_err` is 9.22e-07 (which is <= 9.53674e-07) and `throughput_msps` is 62.5 (which is >= 50). It minimizes the selection objective `luts_plus_ffs` at 2260. Although the front is a single point, the hypervolume gain in the final round was 0.0%, indicating convergence. The `pipelined_m` family was heavily explored (290 evals) and provided the best feasible area (2260) compared to `pipelined` (best feasible 4009). The unexplored families (`iterative`, `unrolled_k`) are structurally unsuitable for the throughput constraint (>= 50 MSPS) because they produce one result every several cycles, whereas `pipelined_m` produces one result per cycle. Given the hard stop at the round/budget limit and the existence of a valid, optimized design on the front, the correct action is to stop.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 9.041e+04 (gain this round: +0.0%).
Feasible designs: 267 of 400 evaluations (228 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 7% violate; best seen 264
- max_abs_err <= 9.53674e-07: 28% violate; best seen 3.75e-08 (2^-24.67)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=0 frac_guard=0 rounding=round m=6] luts_plus_ffs=2260, power_index=4.25, luts=1864, ffs=395, throughput_msps=62.5, max_abs_err=9.22e-07 (2^-20.05)
Front coverage: luts_plus_ffs 2260..2260 (HV reference 8000); power_index 4.25..4.25 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- pipelined: 50 evals, 28 feasible; max throughput seen 264 MSPS; best accuracy 23.60 bits; best feasible luts_plus_ffs=4009; feasible ranges: data_width 26..27, n_iter 22..30, angle_guard -1..4, frac_guard 1..4
- pipelined_m: 350 evals, 239 feasible; max throughput seen 158 MSPS; best accuracy 24.67 bits; best feasible luts_plus_ffs=2260; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 10563 in, 2296 out
- provider-reported cost: $0.0072
- full prompts and replies: `llm_trace.jsonl`

