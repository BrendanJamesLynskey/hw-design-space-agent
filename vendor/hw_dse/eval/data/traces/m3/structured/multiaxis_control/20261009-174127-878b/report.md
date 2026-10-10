# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec multiaxis_control: Shared sin/cos unit for a 16-axis motor-control loop: a 1 MHz control tick issues 32 requests at once (Park + inverse Park per axis); all 32 results must be back within 0.44 us of the tick (p99 over ticks). Max error <= 2^-12. Minimise LUTs + FFs.
  constraint: throughput_msps >= 32
  constraint: max_abs_err <= 0.000244141
  constraint: sys_p99_batch_us <= 0.44
  objective: min luts_plus_ffs (HV ref 4000)
  objective: max accuracy_bits (HV ref 12)
  select: min luts_plus_ffs
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average)
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 861 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 332 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 124 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 124 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 56.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.44 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000168 (2^-12.54) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 5.49 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 4.52e-05 (2^-14.43) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.48 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 99.8 dBc, SNR 84.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 0.2973 → 0.3052 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=3` | 0.3103 → 0.3186 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=1,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 861 | 332 | 124.5 | 7 | 1.44 | 0.000168 (2^-12.54) | 12.54 |
| 1 | `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round,m=4` | 935 | 295 | 93.6 | 6 | 1.48 | 0.000119 (2^-13.04) | 13.04 |
| 2 | `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=3` | 920 | 354 | 119.3 | 7 | 1.53 | 0.000109 (2^-13.17) | 13.17 |
| 3 | `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=1,rounding=round,m=4` | 1002 | 303 | 93.6 | 6 | 1.57 | 8.97e-05 (2^-13.44) | 13.44 |
| 4 | `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1032 | 309 | 93.6 | 6 | 1.61 | 8.22e-05 (2^-13.57) | 13.57 |
| 5 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1048 | 303 | 93.6 | 6 | 1.63 | 6.86e-05 (2^-13.83) | 13.83 |
| 6 | `pipelined_m:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=round,m=4` | 1071 | 303 | 93.6 | 6 | 1.65 | 6.51e-05 (2^-13.91) | 13.91 |
| 7 | `pipelined_m:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1102 | 309 | 93.6 | 6 | 1.7 | 5.17e-05 (2^-14.24) | 14.24 |
| 8 | `pipelined_m:data_width=18,n_iter=17,angle_guard=3,frac_guard=1,rounding=round,m=4` | 1139 | 369 | 93.6 | 7 | 1.82 | 4.98e-05 (2^-14.29) | 14.29 |
| 9 | `pipelined_m:data_width=18,n_iter=17,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1173 | 377 | 93.6 | 7 | 1.87 | 3.68e-05 (2^-14.73) | 14.73 |
| 10 | `pipelined_m:data_width=20,n_iter=17,angle_guard=0,frac_guard=2,rounding=round,m=3` | 1228 | 468 | 119.3 | 8 | 2.04 | 3.43e-05 (2^-14.83) | 14.83 |
| 11 | `pipelined_m:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=3` | 1261 | 480 | 119.3 | 8 | 2.1 | 2.23e-05 (2^-15.45) | 15.45 |
| 12 | `pipelined_m:data_width=23,n_iter=18,angle_guard=2,frac_guard=3,rounding=round,m=4` | 1541 | 466 | 89.6 | 7 | 2.42 | 8.11e-06 (2^-16.91) | 16.91 |
| 13 | `pipelined_m:data_width=25,n_iter=20,angle_guard=-2,frac_guard=1,rounding=trunc,m=4` | 1627 | 462 | 89.6 | 7 | 2.51 | 4.51e-06 (2^-17.76) | 17.76 |
| 14 | `pipelined_m:data_width=25,n_iter=20,angle_guard=-2,frac_guard=1,rounding=round,m=4` | 1680 | 464 | 89.6 | 7 | 2.58 | 4.28e-06 (2^-17.84) | 17.84 |
| 15 | `pipelined_m:data_width=23,n_iter=21,angle_guard=2,frac_guard=2,rounding=round,m=3` | 1761 | 624 | 114.5 | 9 | 2.87 | 2.11e-06 (2^-18.86) | 18.86 |
| 16 | `pipelined_m:data_width=24,n_iter=22,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1915 | 561 | 89.6 | 8 | 2.98 | 1.01e-06 (2^-19.91) | 19.91 |
| 17 | `pipelined_m:data_width=26,n_iter=22,angle_guard=4,frac_guard=0,rounding=trunc,m=3` | 1953 | 771 | 110.0 | 10 | 3.28 | 1e-06 (2^-19.93) | 19.93 |
| 18 | `pipelined_m:data_width=27,n_iter=21,angle_guard=2,frac_guard=3,rounding=round,m=3` | 2064 | 728 | 110.0 | 9 | 3.36 | 9.97e-07 (2^-19.94) | 19.94 |
| 19 | `pipelined_m:data_width=28,n_iter=24,angle_guard=-1,frac_guard=2,rounding=trunc,m=3` | 2259 | 811 | 110.0 | 10 | 3.7 | 3.04e-07 (2^-21.65) | 21.65 |
| 20 | `pipelined_m:data_width=28,n_iter=28,angle_guard=4,frac_guard=1,rounding=round,m=3` | 2796 | 1035 | 105.9 | 12 | 4.61 | 5.57e-08 (2^-24.10) | 24.10 |
| 21 | `pipelined_m:data_width=28,n_iter=28,angle_guard=2,frac_guard=3,rounding=trunc,m=3` | 2793 | 1049 | 105.9 | 12 | 4.63 | 5.37e-08 (2^-24.15) | 24.15 |
| 22 | `pipelined_m:data_width=28,n_iter=28,angle_guard=4,frac_guard=4,rounding=trunc,m=3` | 2907 | 1088 | 105.9 | 12 | 4.81 | 3e-08 (2^-24.99) | 24.99 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires 32 results within 0.44us of a 1us tick, meaning the CORDIC must sustain >=32 Msps throughput AND complete a batch of 32 within 440ns. This eliminates iterative (1 result/15-19 cycles) and makes unrolled_k borderline (1 result/5-7 cycles, 32 results in 800-1120ns at 200MHz). Only pipelined and pipelined_m (1 result/cycle) can reliably meet both constraints. Accuracy constraint (max_abs_err <= 2^-12) requires n_iter >= 12 and data_width >= 14. I focus the search on the minimal feasible region (W=14-16, N=12-16) to minimize luts_plus_ffs, which is the primary objective. The angle_guard and frac_guard ranges are kept tight (0-2) since higher values increase area without improving accuracy beyond the constraint. Rounding is explored as it affects both accuracy and area. The budget is split 50/30/15/5 across pipelined, pipelined_m, unrolled_k, and iterative respectively, reflecting their likelihood of meeting constraints and contributing to the Pareto front.*)
- `pipelined` (25 evals): data_width=14..16, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* The system constraint (32 results in 0.44us) and throughput constraint (>=32 Msps) require 1 result/cycle. Only pipelined and pipelined_m provide this. Pipelined is the most area-efficient 1-result/cycle architecture (no extra registers for m>1). Accuracy constraint (<=2^-12) requires n_iter >= 12 and data_width >= 14. Focusing on the minimal feasible region (W=14-16, N=12-16) minimizes luts_plus_ffs while meeting accuracy.
- `pipelined_m` (25 evals): data_width=14..16, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Pipelined_m with m>1 reduces register count vs full pipelined, potentially lowering FFs and area. However, it has higher latency (ceil(N/m)+2 vs N+2). For N=12-16, m=2-4, latency is 8-10 cycles. At Fmax ~200MHz, that's 40-50ns, well within 440ns budget. Worth exploring for area savings. The m parameter trades area (fewer registers) against latency (still well within budget).
- `unrolled_k` (25 evals): data_width=14..16, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Unrolled_k with k=4-8 processes 4-8 micro-rotations per cycle. For N=12-16, this gives ceil(N/k)+3 = 5-7 cycles per result. At Fmax ~200MHz, that's 25-35ns per result. 32 results take 800-1120ns, which EXCEEDS the 440ns budget. So unrolled_k likely CANNOT meet the sys_p99_batch_us constraint. However, if Fmax is higher or k is larger, it might be borderline. Including it with high k (4-8) to check if any configuration passes. If it fails, it will be pruned.
- `iterative` (25 evals): data_width=14..16, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Iterative produces 1 result every N+3 = 15-19 cycles. At Fmax ~200MHz, that's 75-95ns per result. 32 results take 2400-3040ns, far exceeding 440ns. This family CANNOT meet the throughput or batch latency constraints. Including it only to confirm infeasibility and establish the lower bound of the Pareto front for reference. It will likely be pruned immediately.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 1 feasible; hypervolume 1293 (n/a).

**LLM decision:** `refine` — Round 1 found exactly 1 feasible design out of 100 evals. The throughput constraint (>=32 MSPS) immediately eliminates iterative (max 13.2) and unrolled_k (max 12), leaving only pipelined and pipelined_m. Pipelined_m found a feasible point at 1226 LUT+FF / 12.5 bits. Pipelined has much higher throughput headroom but failed accuracy by a small margin (11.83 vs 12.0 bits required). The current front is a single point, so we need to map the trade-off curve. I am refining both pipelined and pipelined_m around the feasible region (data_width 14-18, n_iter 14-18) to find cheaper or more accurate variants. I am dropping iterative and unrolled_k as they cannot meet the throughput constraint. The m parameter for pipelined_m is widened to 2-8 to explore the area/latency trade-off within the family.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1293 (gain this round: n/a (first round)).
Feasible designs: 1 of 100 evaluations (1 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 50% violate; best seen 282
- max_abs_err <= 0.000244141: 94% violate; best seen 0.000134 (2^-12.86)
- sys_p99_batch_us <= 0.44: 50% violate; best seen 0.161

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.5, luts=956, ffs=270, throughput_msps=97.8, max_abs_err=0.000177 (2^-12.47), power_index=1.48
Front coverage: luts_plus_ffs 1226..1226 (HV reference 4000); accuracy_bits 12.5..12.5 (HV reference 12); data_width on the front 16..16 (registry 8..28).

Per family:
- iterative: 25 evals, 0 feasible; max throughput seen 13.2 MSPS; best accuracy 12.86 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.26 bits
- pipelined: 25 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 11.83 bits
- pipelined_m: 25 evals, 1 feasible; max throughput seen 171 MSPS; best accuracy 12.47 bits; best feasible luts_plus_ffs=1226; feasible ranges: data_width 16..16, n_iter 16..16, angle_guard 2..2, frac_guard 1..1, m 4..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Round 1 found exactly 1 feasible design out of 100 evals. The throughput constraint (>=32 MSPS) immediately eliminates iterative (max 13.2) and unrolled_k (max 12), leaving only pipelined and pipelined_m. Pipelined_m found a feasible point at 1226 LUT+FF / 12.5 bits. Pipelined has much higher throughput headroom but failed accuracy by a small margin (11.83 vs 12.0 bits required). The current front is a single point, so we need to map the trade-off curve. I am refining both pipelined and pipelined_m around the feasible region (data_width 14-18, n_iter 14-18) to find cheaper or more accurate variants. I am dropping iterative and unrolled_k as they cannot meet the throughput constraint. The m parameter for pipelined_m is widened to 2-8 to explore the area/latency trade-off within the family.*)
- `pipelined_m` (50 evals): data_width=14..18, n_iter=14..18, angle_guard=1..3, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Only pipelined_m found a feasible design (1226 LUT+FF, 12.5 bits). Narrowing around this point (data_width 14-18, n_iter 14-18, m 2-8) allows the optimizer to find cheaper variants with slightly lower accuracy or higher accuracy with similar cost, mapping the local Pareto front more densely.
- `pipelined` (50 evals): data_width=14..18, n_iter=14..18, angle_guard=1..3, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined achieved max throughput (282 MSPS) but failed accuracy (best 11.83 bits < 12 required). It is the only other family with sufficient throughput. Exploring slightly wider data_width/n_iter (14-18) with tighter guards may push accuracy over the 12-bit threshold while keeping area competitive with pipelined_m. Pipelined has no m parameter, so it is structurally different and may offer a cheaper area point on the front.

**Result (code):** 100 evaluations this round, 200 total; 73 feasible; hypervolume 5878 (+354.6%).

**LLM decision:** `refine` — The `pipelined_m` family dominates the current Pareto front, achieving the minimum area (1193 LUTs+FFs) and covering the accuracy range up to 14.2 bits, whereas `pipelined` is strictly inferior in area (min 1661) for similar accuracy. The `iterative` and `unrolled_k` families are infeasible due to throughput constraints (max ~13 MSPs vs required 32 MSPs). The current front is clustered in a narrow region (data_width 17-18, n_iter 15-18). To maximize hypervolume and ensure the selection rule (min area) picks a robust design, we should refine the search to focus exclusively on `pipelined_m` with tighter bounds around the known feasible region. Specifically, data_width 16-18, n_iter 14-18, angle_guard 1-3, frac_guard 0-2, and m 2-4. This focuses the remaining budget on optimizing the trade-off curve within the viable family, potentially finding a design with slightly lower area or higher accuracy than the current best (1193, 12.5 bits).

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 5878 (gain this round: +354.6%).
Feasible designs: 73 of 200 evaluations (52 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 25% violate; best seen 282
- max_abs_err <= 0.000244141: 58% violate; best seen 3.49e-05 (2^-14.81)
- sys_p99_batch_us <= 0.44: 29% violate; best seen 0.161

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1193, accuracy_bits=12.5, luts=861, ffs=332, throughput_msps=124, max_abs_err=0.000168 (2^-12.54), power_index=1.44
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1242, accuracy_bits=12.9, luts=949, ffs=293, throughput_msps=93.6, max_abs_err=0.00013 (2^-12.91), power_index=1.5
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1274, accuracy_bits=13.2, luts=920, ffs=354, throughput_msps=119, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1351, accuracy_bits=13.8, luts=1048, ffs=303, throughput_msps=93.6, max_abs_err=6.86e-05 (2^-13.83), power_index=1.63
- pipelined_m [data_width=18 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1535, accuracy_bits=13.9, luts=1170, ffs=365, throughput_msps=93.6, max_abs_err=6.72e-05 (2^-13.86), power_index=1.85
- pipelined_m [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1581, accuracy_bits=14.2, luts=1205, ffs=375, throughput_msps=93.6, max_abs_err=5.33e-05 (2^-14.20), power_index=1.9
Front coverage: luts_plus_ffs 1193..1581 (HV reference 4000); accuracy_bits 12.5..14.2 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- iterative: 25 evals, 0 feasible; max throughput seen 13.2 MSPS; best accuracy 12.86 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.26 bits
- pipelined: 75 evals, 40 feasible; max throughput seen 282 MSPS; best accuracy 14.04 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 1..3, frac_guard 0..2
- pipelined_m: 75 evals, 33 feasible; max throughput seen 171 MSPS; best accuracy 14.81 bits; best feasible luts_plus_ffs=1193; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 1..3, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *The `pipelined_m` family dominates the current Pareto front, achieving the minimum area (1193 LUTs+FFs) and covering the accuracy range up to 14.2 bits, whereas `pipelined` is strictly inferior in area (min 1661) for similar accuracy. The `iterative` and `unrolled_k` families are infeasible due to throughput constraints (max ~13 MSPs vs required 32 MSPs). The current front is clustered in a narrow region (data_width 17-18, n_iter 15-18). To maximize hypervolume and ensure the selection rule (min area) picks a robust design, we should refine the search to focus exclusively on `pipelined_m` with tighter bounds around the known feasible region. Specifically, data_width 16-18, n_iter 14-18, angle_guard 1-3, frac_guard 0-2, and m 2-4. This focuses the remaining budget on optimizing the trade-off curve within the viable family, potentially finding a design with slightly lower area or higher accuracy than the current best (1193, 12.5 bits).*)
- `pipelined_m` (40 evals): data_width=16..18, n_iter=14..18, angle_guard=1..3, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Focus remaining budget on the dominant `pipelined_m` family within the proven feasible region to refine the Pareto front and minimize area.

**Result (code):** 40 evaluations this round, 240 total; 110 feasible; hypervolume 7283 (+23.9%).

**LLM decision:** `stop` — The Pareto front is well-established and feasible. The cheapest design (pipelined_m, 1193 LUTs+FFs) meets all constraints: throughput 124 MSPS (>=32), max_abs_err 0.000168 (<=0.000244), and sys_p99_batch_us 0.161 (<=0.44). The front covers a reasonable range of accuracy (12.5 to 14.7 bits) and area (1193 to 1550 LUTs+FFs). Since this is the final round, we stop and let the selection rule pick the minimum area design from the front.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7283 (gain this round: +23.9%).
Feasible designs: 110 of 240 evaluations (81 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 21% violate; best seen 282
- max_abs_err <= 0.000244141: 50% violate; best seen 3.49e-05 (2^-14.81)
- sys_p99_batch_us <= 0.44: 24% violate; best seen 0.161

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1193, accuracy_bits=12.5, luts=861, ffs=332, throughput_msps=124, max_abs_err=0.000168 (2^-12.54), power_index=1.44
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1229, accuracy_bits=13, luts=935, ffs=295, throughput_msps=93.6, max_abs_err=0.000119 (2^-13.04), power_index=1.48
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1274, accuracy_bits=13.2, luts=920, ffs=354, throughput_msps=119, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1305, accuracy_bits=13.4, luts=1002, ffs=303, throughput_msps=93.6, max_abs_err=8.97e-05 (2^-13.44), power_index=1.57
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1340, accuracy_bits=13.6, luts=1032, ffs=309, throughput_msps=93.6, max_abs_err=8.22e-05 (2^-13.57), power_index=1.61
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1351, accuracy_bits=13.8, luts=1048, ffs=303, throughput_msps=93.6, max_abs_err=6.86e-05 (2^-13.83), power_index=1.63
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1373, accuracy_bits=13.9, luts=1071, ffs=303, throughput_msps=93.6, max_abs_err=6.51e-05 (2^-13.91), power_index=1.65
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1411, accuracy_bits=14.2, luts=1102, ffs=309, throughput_msps=93.6, max_abs_err=5.17e-05 (2^-14.24), power_index=1.7
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1508, accuracy_bits=14.3, luts=1139, ffs=369, throughput_msps=93.6, max_abs_err=4.98e-05 (2^-14.29), power_index=1.82
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1550, accuracy_bits=14.7, luts=1173, ffs=377, throughput_msps=93.6, max_abs_err=3.68e-05 (2^-14.73), power_index=1.87
Front coverage: luts_plus_ffs 1193..1550 (HV reference 4000); accuracy_bits 12.5..14.7 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- iterative: 25 evals, 0 feasible; max throughput seen 13.2 MSPS; best accuracy 12.86 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.26 bits
- pipelined: 75 evals, 40 feasible; max throughput seen 282 MSPS; best accuracy 14.04 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 1..3, frac_guard 0..2
- pipelined_m: 115 evals, 70 feasible; max throughput seen 171 MSPS; best accuracy 14.81 bits; best feasible luts_plus_ffs=1193; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 1..3, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (10 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 191 feasible; hypervolume 1.89e+04 (+159.5%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established and feasible. The cheapest design (pipelined_m, 1193 LUTs+FFs) meets all constraints: throughput 124 MSPS (>=32), max_abs_err 0.000168 (<=0.000244), and sys_p99_batch_us 0.161 (<=0.44). The front covers a reasonable range of accuracy (12.5 to 14.7 bits) and area (1193 to 1550 LUTs+FFs). Since this is the final round, we stop and let the selection rule pick the minimum area design from the front.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.89e+04 (gain this round: +159.5%).
Feasible designs: 191 of 400 evaluations (153 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 12% violate; best seen 282
- max_abs_err <= 0.000244141: 35% violate; best seen 3e-08 (2^-24.99)
- sys_p99_batch_us <= 0.44: 32% violate; best seen 0.161

Pareto front (feasible, 23 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1193, accuracy_bits=12.5, luts=861, ffs=332, throughput_msps=124, max_abs_err=0.000168 (2^-12.54), power_index=1.44
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1274, accuracy_bits=13.2, luts=920, ffs=354, throughput_msps=119, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1351, accuracy_bits=13.8, luts=1048, ffs=303, throughput_msps=93.6, max_abs_err=6.86e-05 (2^-13.83), power_index=1.63
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1411, accuracy_bits=14.2, luts=1102, ffs=309, throughput_msps=93.6, max_abs_err=5.17e-05 (2^-14.24), power_index=1.7
- pipelined_m [data_width=20 n_iter=17 angle_guard=0 frac_guard=2 rounding=round m=3] luts_plus_ffs=1696, accuracy_bits=14.8, luts=1228, ffs=468, throughput_msps=119, max_abs_err=3.43e-05 (2^-14.83), power_index=2.04
- pipelined_m [data_width=23 n_iter=18 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=2007, accuracy_bits=16.9, luts=1541, ffs=466, throughput_msps=89.6, max_abs_err=8.11e-06 (2^-16.91), power_index=2.42
- pipelined_m [data_width=23 n_iter=21 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=2384, accuracy_bits=18.9, luts=1761, ffs=624, throughput_msps=114, max_abs_err=2.11e-06 (2^-18.86), power_index=2.87
- pipelined_m [data_width=26 n_iter=22 angle_guard=4 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=2723, accuracy_bits=19.9, luts=1953, ffs=771, throughput_msps=110, max_abs_err=1e-06 (2^-19.93), power_index=3.28
- pipelined_m [data_width=28 n_iter=28 angle_guard=4 frac_guard=1 rounding=round m=3] luts_plus_ffs=3831, accuracy_bits=24.1, luts=2796, ffs=1035, throughput_msps=106, max_abs_err=5.57e-08 (2^-24.10), power_index=4.61
- pipelined_m [data_width=28 n_iter=28 angle_guard=4 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=3995, accuracy_bits=25, luts=2907, ffs=1088, throughput_msps=106, max_abs_err=3e-08 (2^-24.99), power_index=4.81
Front coverage: luts_plus_ffs 1193..3995 (HV reference 4000); accuracy_bits 12.5..25 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- iterative: 25 evals, 0 feasible; max throughput seen 13.2 MSPS; best accuracy 12.86 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.26 bits
- pipelined: 75 evals, 40 feasible; max throughput seen 282 MSPS; best accuracy 14.04 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 1..3, frac_guard 0..2
- pipelined_m: 275 evals, 151 feasible; max throughput seen 171 MSPS; best accuracy 24.99 bits; best feasible luts_plus_ffs=1193; feasible ranges: data_width 16..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 11635 in, 4262 out
- provider-reported cost: $0.0097
- full prompts and replies: `llm_trace.jsonl`

