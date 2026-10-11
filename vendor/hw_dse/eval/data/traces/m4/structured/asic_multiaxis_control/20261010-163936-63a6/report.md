# DSE run: asic_multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_multiaxis_control: Shared sin/cos unit in sky130 standard cells for a 16-axis motor-control loop: a 1 MHz control tick issues 32 requests at once; all 32 results must be back within 0.5 us of the tick (p99 over ticks). Max error <= 2^-12. Minimise area.
  target: asic-sky130hd
  constraint: throughput_msps >= 32
  constraint: max_abs_err <= 0.000244141
  constraint: sys_p99_batch_us <= 0.5
  objective: min area_um2 (HV ref 100000)
  objective: max accuracy_bits (HV ref 12)
  select: min area_um2
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average)
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 39336 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10479 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 853 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 138 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 138 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 116 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.26 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000175 (2^-12.48) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.5 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.28e-05 (2^-14.21) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.46 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.2 dBc, SNR 82.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (135) was simulated at its estimated Fmax (SimPy); 135 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 0.3417 → 0.3488 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=round` | 0.3344 → 0.3416 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 39336 | 853 | 137.6 | 16 | 2.26 | 0.000175 (2^-12.48) | 12.48 |
| 1 | `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc` | 40524 | 877 | 137.6 | 16 | 2.32 | 0.000172 (2^-12.50) | 12.50 |
| 2 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 40877 | 885 | 137.6 | 17 | 2.34 | 0.000148 (2^-12.72) | 12.72 |
| 3 | `pipelined:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 41887 | 908 | 127.5 | 16 | 2.41 | 0.000142 (2^-12.78) | 12.78 |
| 4 | `pipelined:data_width=19,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 43618 | 944 | 137.6 | 17 | 2.5 | 0.000108 (2^-13.18) | 13.18 |
| 5 | `pipelined:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc` | 44901 | 969 | 132.4 | 17 | 2.57 | 0.000101 (2^-13.27) | 13.27 |
| 6 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 44988 | 973 | 127.5 | 17 | 2.58 | 8.33e-05 (2^-13.55) | 13.55 |
| 7 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 46358 | 1003 | 127.5 | 17 | 2.66 | 7.63e-05 (2^-13.68) | 13.68 |
| 8 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 47357 | 1022 | 132.4 | 18 | 2.71 | 5.84e-05 (2^-14.06) | 14.06 |
| 9 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 48089 | 1038 | 127.5 | 18 | 2.75 | 5.75e-05 (2^-14.09) | 14.09 |
| 10 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 49749 | 1052 | 132.4 | 18 | 2.81 | 5.25e-05 (2^-14.22) | 14.22 |
| 11 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 50482 | 1068 | 127.5 | 18 | 2.85 | 4.95e-05 (2^-14.30) | 14.30 |
| 12 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 50932 | 1097 | 127.5 | 18 | 2.91 | 4.71e-05 (2^-14.37) | 14.37 |
| 13 | `pipelined:data_width=21,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc` | 51752 | 1117 | 123.1 | 18 | 2.96 | 4.46e-05 (2^-14.45) | 14.45 |
| 14 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 51998 | 1099 | 127.5 | 18 | 2.94 | 4.05e-05 (2^-14.59) | 14.59 |
| 15 | `pipelined:data_width=22,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 52484 | 1133 | 123.1 | 18 | 3 | 3.88e-05 (2^-14.65) | 14.65 |
| 16 | `pipelined:data_width=22,n_iter=16,angle_guard=0,frac_guard=0,rounding=trunc` | 53217 | 1148 | 123.1 | 18 | 3.05 | 3.87e-05 (2^-14.66) | 14.66 |
| 17 | `pipelined:data_width=22,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 54682 | 1180 | 115.0 | 18 | 3.13 | 3.32e-05 (2^-14.88) | 14.88 |
| 18 | `pipelined:data_width=20,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 55947 | 1203 | 127.5 | 20 | 3.2 | 2.9e-05 (2^-15.07) | 15.07 |
| 19 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 59407 | 1254 | 123.1 | 20 | 3.35 | 1.89e-05 (2^-15.69) | 15.69 |
| 20 | `pipelined:data_width=22,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc` | 62627 | 1342 | 111.3 | 19 | 3.57 | 1.71e-05 (2^-15.84) | 15.84 |
| 21 | `pipelined:data_width=23,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc` | 64132 | 1376 | 115.0 | 20 | 3.66 | 1.03e-05 (2^-16.57) | 16.57 |
| 22 | `pipelined:data_width=23,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc` | 64959 | 1394 | 115.0 | 20 | 3.7 | 9.89e-06 (2^-16.63) | 16.63 |
| 23 | `pipelined:data_width=23,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 67006 | 1414 | 111.3 | 20 | 3.78 | 8.58e-06 (2^-16.83) | 16.83 |
| 24 | `pipelined:data_width=24,n_iter=19,angle_guard=-1,frac_guard=0,rounding=round` | 67889 | 1457 | 115.0 | 21 | 3.87 | 6.3e-06 (2^-17.28) | 17.28 |
| 25 | `pipelined:data_width=24,n_iter=19,angle_guard=-1,frac_guard=1,rounding=trunc` | 69551 | 1490 | 111.3 | 21 | 3.96 | 6.25e-06 (2^-17.29) | 17.29 |
| 26 | `pipelined:data_width=21,n_iter=20,angle_guard=2,frac_guard=3,rounding=round` | 72414 | 1524 | 115.0 | 22 | 4.08 | 5.18e-06 (2^-17.56) | 17.56 |
| 27 | `pipelined:data_width=22,n_iter=20,angle_guard=2,frac_guard=3,rounding=trunc` | 74063 | 1581 | 111.3 | 22 | 4.21 | 4.33e-06 (2^-17.82) | 17.82 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are (1) throughput_msps >= 32 and (2) sys_p99_batch_us <= 0.5 us for a 32-request burst every 1 us tick. Constraint (2) is the hard one: a 32-deep burst must be fully drained within 0.5 us, which effectively requires 1 result/cycle sustained throughput (32 results in <= 0.5 us => >= 64 results/us peak, i.e. the unit must accept and emit one result per cycle at a clock that lets 32 cycles fit in 0.5 us). The iterative and unrolled_k families accept one request every several cycles, so they queue the burst and are expected to violate the batch-latency bound; I keep unrolled_k at a small share only to confirm that and to probe the low-area end. The feasible front therefore lives in the 1-result/cycle families: pipelined_m (area-efficient, register every m stages) and pipelined (full pipeline, area-heavy). I allocate the largest share to pipelined_m because the selection rule is min area and the min-area feasible corner is most likely there, and a meaningful share to pipelined to map the full area/accuracy trade-off curve for hypervolume. Accuracy ranges (data_width 14..24, n_iter 12..20, angle_guard -1..2, frac_guard 0..2, both roundings) are set to bracket the max_abs_err <= 2^-12 constraint with headroom so the accuracy_bits objective (HV ref 12) is also explored. This split spends the budget where the real trade-offs are: area vs accuracy within the 1-result/cycle families, plus a cheap infeasibility check on the low-area families.*)
- `pipelined_m` (55 evals): data_width=14..24, n_iter=12..20, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* The spec demands 32 results/us (1 result/cycle at >=32 MHz) AND a 32-deep burst back within 0.5 us of the tick. Only the 1-result/cycle families (pipelined, pipelined_m) can plausibly satisfy the system batch-latency bound; iterative/unrolled_k accept one request every several cycles and will queue the burst, failing sys_p99_batch_us. pipelined_m is the area-efficient member of the 1-result/cycle family: registering every m stages cuts flip-flops/area versus full pipelining while keeping 1 result/cycle, so it is where the min-area corner of the feasible front lives. data_width 14..24 and n_iter 12..20 bracket the accuracy constraint (max_abs_err <= 2^-12, accuracy_bits >= 12) with headroom for the accuracy objective; angle_guard -1..2 and frac_guard 0..2 cover the accuracy-relevant guard bits; m 2..8 spans the area/latency trade-off. This is the primary trade-off region, so it gets the largest share.
- `pipelined` (30 evals): data_width=14..24, n_iter=12..20, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Full pipelining is the other 1-result/cycle family and is needed to map the full area/accuracy trade-off curve (hypervolume rewards covering the whole front, not just the min-area corner). It is the area-heavy extreme of the 1-result/cycle family (a register per stage), so it anchors the high-area/high-Fmax end of the feasible front and lets the reserved front-mapping phase see the complete trade-off. Same accuracy-relevant ranges as pipelined_m so the two families are directly comparable on the accuracy objective.
- `unrolled_k` (15 evals): data_width=14..24, n_iter=12..20, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..8. *Why:* unrolled_k is the smallest-area family (shared datapath, few registers) and can meet the raw throughput_msps >= 32 constraint at high k and high Fmax, but it accepts one request every ceil(N/k)+3 cycles, so it will queue the 32-deep burst and is expected to fail the sys_p99_batch_us <= 0.5 us bound. I include it with a small share to (a) confirm infeasibility of the system batch constraint for the low-area families, and (b) capture any point that does clear the L1 bound so the front is not missing the low-area end. If it proves infeasible, the reserved front-mapping phase will concentrate on the 1-result/cycle families.

**Result (code):** 100 evaluations this round, 100 total; 25 feasible; hypervolume 2.35e+05 (n/a).

**LLM decision:** `refine` — The `pipelined` family is the only one yielding feasible designs (25/30 evals), while `unrolled_k` and `pipelined_m` failed to meet the throughput constraint (max 7.32 and 91.1 MSPS respectively, but likely with high latency or area penalties that made them infeasible in the specific search space, or simply didn't find the right config). The current Pareto front is dominated by `pipelined` designs with `data_width` 20-24 and `n_iter` 14-20. The minimum area feasible design is 43162 um^2. To improve hypervolume and find a potentially smaller area design, we should focus the search tightly on the `pipelined` family in the region where feasible designs were found, specifically narrowing `data_width` to 18-22 and `n_iter` to 12-16 to explore the lower area/accuracy trade-off more densely. The `iterative` family is not yet explored, but given the strict throughput constraint (>=32 MSPS) and the bursty nature (32 requests in 0.5us), `iterative` (1 result/cycle) would likely struggle to meet the batch latency unless Fmax is very high, which increases area. `pipelined` is clearly the winner. We will refine the `pipelined` search space.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2.35e+05 (gain this round: n/a (first round)).
Feasible designs: 25 of 100 evaluations (21 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 35% violate; best seen 163
- max_abs_err <= 0.000244141: 20% violate; best seen 4.14e-06 (2^-17.88)
- sys_p99_batch_us <= 0.5: 67% violate; best seen 0.301

Pareto front (feasible, 11 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=20 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=43162, accuracy_bits=12.8, ffs=936, throughput_msps=128, max_abs_err=0.000144 (2^-12.76), power_index=2.48
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=46358, accuracy_bits=13.7, ffs=1003, throughput_msps=128, max_abs_err=7.63e-05 (2^-13.68), power_index=2.66
- pipelined [data_width=23 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=54492, accuracy_bits=14, ffs=1176, throughput_msps=111, max_abs_err=6.18e-05 (2^-13.98), power_index=3.12
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] area_um2=55120, accuracy_bits=14.8, ffs=1186, throughput_msps=132, max_abs_err=3.54e-05 (2^-14.79), power_index=3.15
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] area_um2=55947, accuracy_bits=15.1, ffs=1203, throughput_msps=128, max_abs_err=2.9e-05 (2^-15.07), power_index=3.2
- pipelined [data_width=23 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=64132, accuracy_bits=16.6, ffs=1376, throughput_msps=115, max_abs_err=1.03e-05 (2^-16.57), power_index=3.66
- pipelined [data_width=23 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=64959, accuracy_bits=16.6, ffs=1394, throughput_msps=115, max_abs_err=9.89e-06 (2^-16.63), power_index=3.7
- pipelined [data_width=23 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=67006, accuracy_bits=16.8, ffs=1414, throughput_msps=111, max_abs_err=8.58e-06 (2^-16.83), power_index=3.78
- pipelined [data_width=24 n_iter=19 angle_guard=-1 frac_guard=0 rounding=round] area_um2=67889, accuracy_bits=17.3, ffs=1457, throughput_msps=115, max_abs_err=6.3e-06 (2^-17.28), power_index=3.87
- pipelined [data_width=24 n_iter=19 angle_guard=-1 frac_guard=1 rounding=trunc] area_um2=69551, accuracy_bits=17.3, ffs=1490, throughput_msps=111, max_abs_err=6.25e-06 (2^-17.29), power_index=3.96
Front coverage: area_um2 43162..69551 (HV reference 100000); accuracy_bits 12.8..17.3 (HV reference 12); data_width on the front 20..24 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 7.32 MSPS; best accuracy 15.70 bits
- pipelined: 30 evals, 25 feasible; max throughput seen 163 MSPS; best accuracy 17.29 bits; best feasible area_um2=43162; feasible ranges: data_width 20..24, n_iter 14..20, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 55 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 17.88 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine pipelined family to find smaller area designs.*)
- `pipelined` (100 evals): data_width=18..22, n_iter=12..16, angle_guard=-1..2, frac_guard=0..1, rounding=trunc|round. *Why:* Focus on the proven feasible family and narrow the parameter space around the current Pareto front to find smaller area designs or better accuracy/area trade-offs.

**Result (code):** 100 evaluations this round, 200 total; 111 feasible; hypervolume 2.442e+05 (+4.0%).

**LLM decision:** `refine` — The `pipelined` family is the only one yielding feasible designs (111 feasible vs 0 for `unrolled_k` and `pipelined_m`). The current Pareto front is dominated by `pipelined` designs with areas ranging from 39,336 to 69,551 um^2. The minimum area design (39,336 um^2) has 12.5 accuracy bits, which satisfies the max_abs_err constraint (2^-12.48 <= 2^-12). However, the front extends to much higher areas for marginal accuracy gains. Since the selection rule is `min area_um2`, the primary goal is to find the absolute minimum area feasible design. The current best is 39,336 um^2. To ensure we haven't missed a slightly smaller design or a design with better accuracy at a similar area (which might be preferred if the selection rule had a tie-breaker, though it doesn't), we should refine the search around the current best region. Specifically, we should focus on `pipelined` with `data_width` 18-20, `n_iter` 14-16, `angle_guard` 0-1, and `frac_guard` 0-1. This narrows the search space significantly, allowing Optuna to spend more evaluations in the promising low-area region. We should also consider if `iterative` could be feasible, but its throughput is typically lower (1 result every N+3 cycles), making it hard to meet the 32 MSPS throughput constraint unless N is very small, which would hurt accuracy. Given `pipelined`'s success, it's safer to refine it.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.442e+05 (gain this round: +4.0%).
Feasible designs: 111 of 200 evaluations (83 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 18% violate; best seen 163
- max_abs_err <= 0.000244141: 17% violate; best seen 4.14e-06 (2^-17.88)
- sys_p99_batch_us <= 0.5: 34% violate; best seen 0.301

Pareto front (feasible, 22 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=39336, accuracy_bits=12.5, ffs=853, throughput_msps=138, max_abs_err=0.000175 (2^-12.48), power_index=2.26
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=43618, accuracy_bits=13.2, ffs=944, throughput_msps=138, max_abs_err=0.000108 (2^-13.18), power_index=2.5
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=47357, accuracy_bits=14.1, ffs=1022, throughput_msps=132, max_abs_err=5.84e-05 (2^-14.06), power_index=2.71
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] area_um2=49749, accuracy_bits=14.2, ffs=1052, throughput_msps=132, max_abs_err=5.25e-05 (2^-14.22), power_index=2.81
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=50932, accuracy_bits=14.4, ffs=1097, throughput_msps=128, max_abs_err=4.71e-05 (2^-14.37), power_index=2.91
- pipelined [data_width=22 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round] area_um2=52484, accuracy_bits=14.7, ffs=1133, throughput_msps=123, max_abs_err=3.88e-05 (2^-14.65), power_index=3
- pipelined [data_width=22 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=54682, accuracy_bits=14.9, ffs=1180, throughput_msps=115, max_abs_err=3.32e-05 (2^-14.88), power_index=3.13
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=59407, accuracy_bits=15.7, ffs=1254, throughput_msps=123, max_abs_err=1.89e-05 (2^-15.69), power_index=3.35
- pipelined [data_width=23 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=67006, accuracy_bits=16.8, ffs=1414, throughput_msps=111, max_abs_err=8.58e-06 (2^-16.83), power_index=3.78
- pipelined [data_width=24 n_iter=19 angle_guard=-1 frac_guard=1 rounding=trunc] area_um2=69551, accuracy_bits=17.3, ffs=1490, throughput_msps=111, max_abs_err=6.25e-06 (2^-17.29), power_index=3.96
Front coverage: area_um2 39336..69551 (HV reference 100000); accuracy_bits 12.5..17.3 (HV reference 12); data_width on the front 18..24 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 7.32 MSPS; best accuracy 15.70 bits
- pipelined: 130 evals, 111 feasible; max throughput seen 163 MSPS; best accuracy 17.29 bits; best feasible area_um2=39336; feasible ranges: data_width 18..24, n_iter 14..20, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 55 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 17.88 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine the search around the promising low-area region of the pipelined family to ensure the minimum area feasible design is found.*)
- `pipelined` (40 evals): data_width=18..20, n_iter=14..16, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round. *Why:* Focus on the low-area region of the pipelined family where the best feasible designs are found. Narrowing the ranges allows for a denser search around the current Pareto front's minimum area point.

**Result (code):** 40 evaluations this round, 240 total; 149 feasible; hypervolume 2.443e+05 (+0.0%).

**LLM decision:** `stop` — The exploration has converged on a robust Pareto front dominated by the `pipelined` family, which is the only architecture capable of meeting the strict system constraints (throughput >= 32 MSPS and sys_p99_batch_us <= 0.5 us). The `unrolled_k` and `pipelined_m` families were explored and found infeasible for this specific high-throughput, low-latency burst scenario (max throughput 7.32 and 91.1 MSPS respectively, but failing the batch latency or throughput constraints in combination). The current front covers the area range from 39,336 um^2 to 69,551 um^2 and accuracy from 12.5 to 17.3 bits. The minimum area feasible design (39,336 um^2) comfortably meets the max_abs_err <= 2^-12 constraint (achieving 12.5 bits) and the system constraints. Since this is the final round and the front is well-mapped with no other families showing potential to improve the hypervolume or the minimum area corner, stopping is the correct action. The selection rule (min area) will pick the 39,336 um^2 pipelined design.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 2.443e+05 (gain this round: +0.0%).
Feasible designs: 149 of 240 evaluations (98 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 15% violate; best seen 163
- max_abs_err <= 0.000244141: 15% violate; best seen 4.14e-06 (2^-17.88)
- sys_p99_batch_us <= 0.5: 28% violate; best seen 0.301

Pareto front (feasible, 24 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=39336, accuracy_bits=12.5, ffs=853, throughput_msps=138, max_abs_err=0.000175 (2^-12.48), power_index=2.26
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=43618, accuracy_bits=13.2, ffs=944, throughput_msps=138, max_abs_err=0.000108 (2^-13.18), power_index=2.5
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=44988, accuracy_bits=13.6, ffs=973, throughput_msps=128, max_abs_err=8.33e-05 (2^-13.55), power_index=2.58
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=48089, accuracy_bits=14.1, ffs=1038, throughput_msps=128, max_abs_err=5.75e-05 (2^-14.09), power_index=2.75
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] area_um2=50482, accuracy_bits=14.3, ffs=1068, throughput_msps=128, max_abs_err=4.95e-05 (2^-14.30), power_index=2.85
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] area_um2=51998, accuracy_bits=14.6, ffs=1099, throughput_msps=128, max_abs_err=4.05e-05 (2^-14.59), power_index=2.94
- pipelined [data_width=22 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=53217, accuracy_bits=14.7, ffs=1148, throughput_msps=123, max_abs_err=3.87e-05 (2^-14.66), power_index=3.05
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=59407, accuracy_bits=15.7, ffs=1254, throughput_msps=123, max_abs_err=1.89e-05 (2^-15.69), power_index=3.35
- pipelined [data_width=23 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=64959, accuracy_bits=16.6, ffs=1394, throughput_msps=115, max_abs_err=9.89e-06 (2^-16.63), power_index=3.7
- pipelined [data_width=24 n_iter=19 angle_guard=-1 frac_guard=1 rounding=trunc] area_um2=69551, accuracy_bits=17.3, ffs=1490, throughput_msps=111, max_abs_err=6.25e-06 (2^-17.29), power_index=3.96
Front coverage: area_um2 39336..69551 (HV reference 100000); accuracy_bits 12.5..17.3 (HV reference 12); data_width on the front 18..24 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 7.32 MSPS; best accuracy 15.70 bits
- pipelined: 170 evals, 149 feasible; max throughput seen 163 MSPS; best accuracy 17.29 bits; best feasible area_um2=39336; feasible ranges: data_width 18..24, n_iter 14..20, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 55 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 17.88 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=17..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (24 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 194 feasible; hypervolume 2.589e+05 (+6.0%).

**No LLM call** (code's front-mapping round): The exploration has converged on a robust Pareto front dominated by the `pipelined` family, which is the only architecture capable of meeting the strict system constraints (throughput >= 32 MSPS and sys_p99_batch_us <= 0.5 us). The `unrolled_k` and `pipelined_m` families were explored and found infeasible for this specific high-throughput, low-latency burst scenario (max throughput 7.32 and 91.1 MSPS respectively, but failing the batch latency or throughput constraints in combination). The current front covers the area range from 39,336 um^2 to 69,551 um^2 and accuracy from 12.5 to 17.3 bits. The minimum area feasible design (39,336 um^2) comfortably meets the max_abs_err <= 2^-12 constraint (achieving 12.5 bits) and the system constraints. Since this is the final round and the front is well-mapped with no other families showing potential to improve the hypervolume or the minimum area corner, stopping is the correct action. The selection rule (min area) will pick the 39,336 um^2 pipelined design.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.589e+05 (gain this round: +6.0%).
Feasible designs: 194 of 400 evaluations (135 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 163
- max_abs_err <= 0.000244141: 18% violate; best seen 6.73e-08 (2^-23.82)
- sys_p99_batch_us <= 0.5: 44% violate; best seen 0.301

Pareto front (feasible, 28 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=39336, accuracy_bits=12.5, ffs=853, throughput_msps=138, max_abs_err=0.000175 (2^-12.48), power_index=2.26
- pipelined [data_width=19 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] area_um2=41887, accuracy_bits=12.8, ffs=908, throughput_msps=128, max_abs_err=0.000142 (2^-12.78), power_index=2.41
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=44988, accuracy_bits=13.6, ffs=973, throughput_msps=128, max_abs_err=8.33e-05 (2^-13.55), power_index=2.58
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=48089, accuracy_bits=14.1, ffs=1038, throughput_msps=128, max_abs_err=5.75e-05 (2^-14.09), power_index=2.75
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=50932, accuracy_bits=14.4, ffs=1097, throughput_msps=128, max_abs_err=4.71e-05 (2^-14.37), power_index=2.91
- pipelined [data_width=22 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round] area_um2=52484, accuracy_bits=14.7, ffs=1133, throughput_msps=123, max_abs_err=3.88e-05 (2^-14.65), power_index=3
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] area_um2=55947, accuracy_bits=15.1, ffs=1203, throughput_msps=128, max_abs_err=2.9e-05 (2^-15.07), power_index=3.2
- pipelined [data_width=23 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=64132, accuracy_bits=16.6, ffs=1376, throughput_msps=115, max_abs_err=1.03e-05 (2^-16.57), power_index=3.66
- pipelined [data_width=24 n_iter=19 angle_guard=-1 frac_guard=0 rounding=round] area_um2=67889, accuracy_bits=17.3, ffs=1457, throughput_msps=115, max_abs_err=6.3e-06 (2^-17.28), power_index=3.87
- pipelined [data_width=22 n_iter=20 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=74063, accuracy_bits=17.8, ffs=1581, throughput_msps=111, max_abs_err=4.33e-06 (2^-17.82), power_index=4.21
Front coverage: area_um2 39336..74063 (HV reference 100000); accuracy_bits 12.5..17.8 (HV reference 12); data_width on the front 17..24 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 7.32 MSPS; best accuracy 15.70 bits
- pipelined: 250 evals, 194 feasible; max throughput seen 163 MSPS; best accuracy 21.89 bits; best feasible area_um2=39336; feasible ranges: data_width 17..27, n_iter 14..28, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 135 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 23.82 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 12604 in, 3831 out
- provider-reported cost: $0.0078
- full prompts and replies: `llm_trace.jsonl`

