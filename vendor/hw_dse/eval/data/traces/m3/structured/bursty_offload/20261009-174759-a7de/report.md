# DSE run: bursty_offload

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec bursty_offload: Sin/cos offload for an 8-channel sensor front end: bursts of 8 requests arrive as a Poisson process, 2 requests/us on average; p99 request latency must be <= 0.4 us. Max error <= 2^-10. Minimise LUTs + FFs.
  constraint: throughput_msps >= 2
  constraint: max_abs_err <= 0.000976562
  constraint: sys_p99_latency_us <= 0.4
  objective: min luts_plus_ffs (HV ref 3000)
  objective: max accuracy_bits (HV ref 10)
  select: min luts_plus_ffs
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=1,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 654 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 203 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 5 | exact: schedule |
| latency_ns | 51.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0645 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000711 (2^-10.46) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 11.7 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.000214 (2^-12.19) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 3.51 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.5 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 5 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.9 dBc, SNR 70.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=1,rounding=round,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 0.1226 → 0.1453 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 0.1226 → 0.1453 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (39 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 654 | 203 | 97.8 | 5 | 0.0645 | 0.000711 (2^-10.46) | 10.46 |
| 1 | `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=1,rounding=round,m=4` | 688 | 205 | 97.8 | 5 | 0.0672 | 0.000703 (2^-10.47) | 10.47 |
| 2 | `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=1,rounding=round,m=4` | 700 | 208 | 97.8 | 5 | 0.0683 | 0.000624 (2^-10.65) | 10.65 |
| 3 | `pipelined_m:data_width=16,n_iter=13,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 713 | 260 | 97.8 | 6 | 0.0733 | 0.000498 (2^-10.97) | 10.97 |
| 4 | `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 739 | 268 | 97.8 | 6 | 0.0758 | 0.00046 (2^-11.09) | 11.09 |
| 5 | `pipelined_m:data_width=16,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 772 | 260 | 97.8 | 6 | 0.0777 | 0.000401 (2^-11.28) | 11.28 |
| 6 | `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=1,rounding=round,m=4` | 772 | 270 | 97.8 | 6 | 0.0785 | 0.000325 (2^-11.59) | 11.59 |
| 7 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 820 | 266 | 97.8 | 6 | 0.0817 | 0.000311 (2^-11.65) | 11.65 |
| 8 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 827 | 274 | 97.8 | 6 | 0.0829 | 0.00027 (2^-11.85) | 11.85 |
| 9 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` | 834 | 270 | 97.8 | 6 | 0.083 | 0.000209 (2^-12.22) | 12.22 |
| 10 | `pipelined_m:data_width=16,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc,m=7` | 920 | 217 | 56.8 | 5 | 0.0855 | 0.000187 (2^-12.39) | 12.39 |
| 11 | `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=3,rounding=trunc,m=5` | 950 | 242 | 77.0 | 5 | 0.0897 | 0.000145 (2^-12.75) | 12.75 |
| 12 | `pipelined_m:data_width=16,n_iter=15,angle_guard=4,frac_guard=3,rounding=round,m=7` | 983 | 225 | 56.8 | 5 | 0.0909 | 0.00011 (2^-13.15) | 13.15 |
| 13 | `pipelined_m:data_width=20,n_iter=15,angle_guard=1,frac_guard=2,rounding=round,m=8` | 1095 | 184 | 50.3 | 4 | 0.0962 | 6.89e-05 (2^-13.82) | 13.82 |
| 14 | `pipelined_m:data_width=20,n_iter=15,angle_guard=4,frac_guard=1,rounding=round,m=5` | 1110 | 261 | 73.7 | 5 | 0.103 | 6.68e-05 (2^-13.87) | 13.87 |
| 15 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc,m=6` | 1152 | 239 | 65.4 | 5 | 0.105 | 5.51e-05 (2^-14.15) | 14.15 |
| 16 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=4,rounding=trunc,m=5` | 1185 | 315 | 77.0 | 6 | 0.113 | 4.94e-05 (2^-14.31) | 14.31 |
| 17 | `pipelined_m:data_width=20,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 1257 | 243 | 50.3 | 5 | 0.113 | 4.53e-05 (2^-14.43) | 14.43 |
| 18 | `pipelined_m:data_width=18,n_iter=17,angle_guard=3,frac_guard=4,rounding=trunc,m=5` | 1202 | 319 | 77.0 | 6 | 0.114 | 3.81e-05 (2^-14.68) | 14.68 |
| 19 | `pipelined_m:data_width=21,n_iter=17,angle_guard=0,frac_guard=3,rounding=trunc,m=6` | 1270 | 266 | 62.5 | 5 | 0.116 | 2.64e-05 (2^-15.21) | 15.21 |
| 20 | `pipelined_m:data_width=21,n_iter=17,angle_guard=4,frac_guard=1,rounding=trunc,m=5` | 1270 | 347 | 73.7 | 6 | 0.122 | 2.28e-05 (2^-15.42) | 15.42 |
| 21 | `pipelined_m:data_width=25,n_iter=17,angle_guard=0,frac_guard=2,rounding=trunc,m=6` | 1438 | 307 | 59.9 | 5 | 0.131 | 1.57e-05 (2^-15.96) | 15.96 |
| 22 | `pipelined_m:data_width=24,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc,m=6` | 1455 | 306 | 59.9 | 5 | 0.132 | 1.57e-05 (2^-15.96) | 15.96 |
| 23 | `pipelined_m:data_width=26,n_iter=17,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 1489 | 320 | 45.9 | 5 | 0.136 | 1.54e-05 (2^-15.99) | 15.99 |
| 24 | `pipelined_m:data_width=26,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc,m=8` | 1556 | 328 | 45.9 | 5 | 0.142 | 1.53e-05 (2^-15.99) | 15.99 |
| 25 | `pipelined_m:data_width=26,n_iter=19,angle_guard=2,frac_guard=0,rounding=trunc,m=8` | 1636 | 316 | 45.9 | 5 | 0.147 | 4.16e-06 (2^-17.88) | 17.88 |
| 26 | `pipelined_m:data_width=26,n_iter=19,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 1674 | 320 | 45.9 | 5 | 0.15 | 3.98e-06 (2^-17.94) | 17.94 |
| 27 | `pipelined_m:data_width=22,n_iter=20,angle_guard=3,frac_guard=4,rounding=trunc,m=5` | 1667 | 375 | 73.7 | 6 | 0.154 | 3.36e-06 (2^-18.18) | 18.18 |
| 28 | `pipelined_m:data_width=24,n_iter=20,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1627 | 460 | 89.6 | 7 | 0.157 | 2.96e-06 (2^-18.37) | 18.37 |
| 29 | `pipelined_m:data_width=24,n_iter=23,angle_guard=0,frac_guard=1,rounding=trunc,m=7` | 1860 | 373 | 54.3 | 6 | 0.168 | 2.44e-06 (2^-18.64) | 18.64 |
| 30 | `pipelined_m:data_width=25,n_iter=20,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 1767 | 495 | 86.0 | 7 | 0.17 | 2.2e-06 (2^-18.79) | 18.79 |
| 31 | `pipelined_m:data_width=28,n_iter=20,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 1907 | 539 | 82.7 | 7 | 0.184 | 1.95e-06 (2^-18.97) | 18.97 |
| 32 | `pipelined_m:data_width=25,n_iter=24,angle_guard=2,frac_guard=4,rounding=round,m=8` | 2263 | 323 | 45.9 | 5 | 0.195 | 3.58e-07 (2^-21.41) | 21.41 |
| 33 | `pipelined_m:data_width=27,n_iter=23,angle_guard=2,frac_guard=2,rounding=round,m=4` | 2218 | 621 | 86.0 | 8 | 0.214 | 2.94e-07 (2^-21.70) | 21.70 |
| 34 | `pipelined_m:data_width=28,n_iter=26,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 2482 | 438 | 45.9 | 6 | 0.22 | 1.13e-07 (2^-23.08) | 23.08 |
| 35 | `pipelined_m:data_width=28,n_iter=25,angle_guard=1,frac_guard=4,rounding=round,m=8` | 2568 | 454 | 44.0 | 6 | 0.227 | 1.1e-07 (2^-23.12) | 23.12 |
| 36 | `pipelined_m:data_width=28,n_iter=25,angle_guard=2,frac_guard=4,rounding=round,m=6` | 2593 | 560 | 57.5 | 7 | 0.237 | 8.5e-08 (2^-23.49) | 23.49 |
| 37 | `pipelined_m:data_width=27,n_iter=26,angle_guard=3,frac_guard=3,rounding=round,m=2` | 2591 | 1323 | 152.6 | 15 | 0.294 | 7.41e-08 (2^-23.69) | 23.69 |
| 38 | `pipelined_m:data_width=28,n_iter=29,angle_guard=3,frac_guard=4,rounding=trunc,m=3` | 2985 | 1078 | 105.9 | 12 | 0.306 | 3.65e-08 (2^-24.71) | 24.71 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires throughput >= 2 Msps, max_abs_err <= 2^-10, and sys_p99_latency_us <= 0.4 us for bursty requests (bursts of 8, Poisson at 2 req/us). The key trade-off is between area (luts_plus_ffs) and the system latency constraint. pipelined_m is the primary candidate because it offers 1 result/cycle throughput with fewer registers than pipelined, and the m parameter allows tuning the latency/area trade-off. pipelined is included as a baseline for comparison. unrolled_k is included to explore the low-area region, though its burst latency may be problematic. All three families can meet the accuracy constraint with W=12..16, N=10..14, angle_guard=0..2, frac_guard=0..2. The budget is split 45/35/20 to focus on the most promising families while still mapping the trade-off space. iterative is excluded because its 1 result every N+3 cycles (13..17 cycles) would likely violate the p99 latency constraint for bursts of 8, and its throughput at reasonable Fmax may be marginal for the 2 Msps requirement.*)
- `pipelined_m` (45 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m is the primary candidate for the bursty system constraint. It offers 1 result/cycle throughput (meeting the 2 Msps constraint easily at reasonable Fmax) while using fewer registers than fully pipelined (m>1), reducing area. The m=2..4 range balances latency (ceil(N/m)+2 cycles) against area. With N=10..14 and m=2..4, latency is 5..9 cycles, which at ~100-200 MHz gives 25-90 ns per result. For a burst of 8, the last result arrives ~8 cycles after the first, so p99 latency is dominated by queueing. The analytic bound for sys_p99_latency_us <= 0.4 us should be satisfiable if Fmax is high enough and the queue doesn't build up excessively. Accuracy: with W=12..16, N=10..14, angle_guard=0..2, frac_guard=0..2, we can achieve max_abs_err <= 2^-10 = 0.000976562. The trade-off between area (luts_plus_ffs) and accuracy_bits is the key Pareto front here.
- `pipelined` (35 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined is the baseline for 1 result/cycle throughput. It has N+2 latency (12..16 cycles for N=10..14), which is longer than pipelined_m with m>1, but it has the simplest structure and potentially the highest Fmax due to shorter critical paths per stage. The area is larger than pipelined_m due to more registers, but it may achieve higher Fmax, which helps with the p99 latency constraint. This family serves as a comparison point to determine whether the register savings of pipelined_m outweigh the latency penalty.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* unrolled_k with k=2..4 can achieve 1 result every ceil(N/k) cycles. For N=10..14 and k=2..4, this is 3..7 cycles per result. At 100-200 MHz, this gives 15-70 ns per result, which may meet the 2 Msps throughput constraint (need <= 500 ns per result). However, the burst of 8 requests will take 8*ceil(N/k) cycles to complete, which is longer than pipelined/pipelined_m. The p99 latency constraint may be harder to meet because the queue builds up more during a burst. This family is included to check if the area savings from fewer pipeline stages outweigh the latency penalty, and to map the Pareto front in the low-area region.

**Result (code):** 100 evaluations this round, 100 total; 35 feasible; hypervolume 3061 (n/a).

**LLM decision:** `refine` — The current front is dominated by pipelined_m with best area 915. However, 58% of evaluations violated the accuracy constraint, and 20% violated the system latency constraint. This suggests that the current ranges are too broad and include many infeasible points. By narrowing the ranges to the proven feasible regions (data_width 15-16, n_iter 12-14, m 2-4 for pipelined_m; data_width 14-16, n_iter 12-14 for pipelined) and adding 'round' rounding, we can focus the budget on finding the true Pareto front. The system constraint (sys_p99_latency_us <= 0.4) is critical for the bursty scenario, so we need to ensure that the designs on the front can handle bursts of 8 requests with p99 latency <= 0.4 us. pipelined's higher throughput (282 MSPS) might be necessary to meet this constraint, so we keep it in the search. unrolled_k is given a small budget share to confirm if it can be feasible with tighter parameters.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3061 (gain this round: n/a (first round)).
Feasible designs: 35 of 100 evaluations (24 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 58% violate; best seen 0.000338 (2^-11.53)
- sys_p99_latency_us <= 0.4: 20% violate; best seen 0.0639

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=915, accuracy_bits=10.5, luts=654, ffs=260, throughput_msps=124, max_abs_err=0.000711 (2^-10.46), power_index=0.0688
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=944, accuracy_bits=10.5, luts=678, ffs=266, throughput_msps=124, max_abs_err=0.000703 (2^-10.47), power_index=0.071
- pipelined_m [data_width=15 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=995, accuracy_bits=10.7, luts=745, ffs=250, throughput_msps=97.8, max_abs_err=0.000594 (2^-10.72), power_index=0.0749
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1050, accuracy_bits=11.5, luts=786, ffs=264, throughput_msps=97.8, max_abs_err=0.000344 (2^-11.50), power_index=0.079
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1128, accuracy_bits=11.5, luts=800, ffs=328, throughput_msps=124, max_abs_err=0.000338 (2^-11.53), power_index=0.0848
Front coverage: luts_plus_ffs 915..1128 (HV reference 3000); accuracy_bits 10.5..11.5 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 10.35 bits
- pipelined: 35 evals, 8 feasible; max throughput seen 282 MSPS; best accuracy 10.75 bits; best feasible luts_plus_ffs=1384; feasible ranges: data_width 14..15, n_iter 13..13, angle_guard 2..2, frac_guard 0..2
- pipelined_m: 45 evals, 27 feasible; max throughput seen 171 MSPS; best accuracy 11.53 bits; best feasible luts_plus_ffs=915; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The current front is dominated by pipelined_m with best area 915. However, 58% of evaluations violated the accuracy constraint, and 20% violated the system latency constraint. This suggests that the current ranges are too broad and include many infeasible points. By narrowing the ranges to the proven feasible regions (data_width 15-16, n_iter 12-14, m 2-4 for pipelined_m; data_width 14-16, n_iter 12-14 for pipelined) and adding 'round' rounding, we can focus the budget on finding the true Pareto front. The system constraint (sys_p99_latency_us <= 0.4) is critical for the bursty scenario, so we need to ensure that the designs on the front can handle bursts of 8 requests with p99 latency <= 0.4 us. pipelined's higher throughput (282 MSPS) might be necessary to meet this constraint, so we keep it in the search. unrolled_k is given a small budget share to confirm if it can be feasible with tighter parameters.*)
- `pipelined_m` (50 evals): data_width=15..16, n_iter=12..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m dominates the current front (best area 915 vs 1384 for pipelined). Narrowing to the proven feasible region (data_width 15-16, n_iter 12-14, m 2-4) and adding 'round' rounding allows the optimizer to find cheaper or more accurate variants within the tightest bounds.
- `pipelined` (30 evals): data_width=14..16, n_iter=12..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined has higher throughput (282 MSPS) which helps with the bursty system constraint (sys_p99_latency_us <= 0.4). Although its area is higher (1384), it might offer a better trade-off if pipelined_m struggles with the system latency bound at L2. Focusing on the feasible range (data_width 14-16, n_iter 12-14) to find the minimum area point that still passes the system constraints.
- `unrolled_k` (20 evals): data_width=14..16, n_iter=12..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* unrolled_k had 0 feasible designs in Round 1, likely due to throughput or accuracy issues. However, with k=2-4 and higher n_iter/data_width, it might achieve the required accuracy (2^-10) while maintaining sufficient throughput for the bursty system. Worth a small budget share to confirm if it can contribute to the front.

**Result (code):** 100 evaluations this round, 200 total; 106 feasible; hypervolume 4450 (+45.4%).

**LLM decision:** `map_front` — The Pareto front is currently dominated by the `pipelined_m` family (specifically m=4, data_width=16), which has already satisfied all constraints with a significant margin on throughput (97.8 MSPS vs 2 MSPS required) and latency (best seen 0.0639 us vs 0.4 us limit). The `unrolled_k` family has proven infeasible for the throughput constraint (max 13.5 MSPS, but likely fails the bursty p99 latency or area targets compared to pipelined). The `iterative` family is not yet explored, but given that `pipelined_m` achieves 1 result/cycle with low area (857 LUTs+FFs), it is highly unlikely that `iterative` (1 result/N+3 cycles) will offer a better area/accuracy trade-off while meeting the strict p99 latency of 0.4 us for bursts of 8. The current front spans accuracy bits 10.5 to 12.2 and area 857 to 1104. Since the selection rule is `min luts_plus_ffs`, the current best design (857) is a strong candidate. However, to ensure we have mapped the *entire* feasible Pareto front and haven't missed a lower-area design with slightly lower accuracy (which might still be feasible) or a design that trades area for accuracy more efficiently, we should let the code map the front over the full ranges of the promising families (`pipelined` and `pipelined_m`). This will confirm if there are any designs with area < 857 that still meet the accuracy constraint (max_abs_err <= 2^-10). The `iterative` family can be skipped as it is structurally disadvantaged for this bursty, high-throughput requirement compared to the pipelined variants already found.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4450 (gain this round: +45.4%).
Feasible designs: 106 of 200 evaluations (68 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 36% violate; best seen 0.000209 (2^-12.22)
- sys_p99_latency_us <= 0.4: 20% violate; best seen 0.0639

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=857, accuracy_bits=10.5, luts=654, ffs=203, throughput_msps=97.8, max_abs_err=0.000711 (2^-10.46), power_index=0.0645
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=round m=4] luts_plus_ffs=893, accuracy_bits=10.5, luts=688, ffs=205, throughput_msps=97.8, max_abs_err=0.000703 (2^-10.47), power_index=0.0672
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=908, accuracy_bits=10.6, luts=700, ffs=208, throughput_msps=97.8, max_abs_err=0.000624 (2^-10.65), power_index=0.0683
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=974, accuracy_bits=11, luts=713, ffs=260, throughput_msps=97.8, max_abs_err=0.000498 (2^-10.97), power_index=0.0733
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1007, accuracy_bits=11.1, luts=739, ffs=268, throughput_msps=97.8, max_abs_err=0.00046 (2^-11.09), power_index=0.0758
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1033, accuracy_bits=11.3, luts=772, ffs=260, throughput_msps=97.8, max_abs_err=0.000401 (2^-11.28), power_index=0.0777
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1043, accuracy_bits=11.6, luts=772, ffs=270, throughput_msps=97.8, max_abs_err=0.000325 (2^-11.59), power_index=0.0785
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0817
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1102, accuracy_bits=11.9, luts=827, ffs=274, throughput_msps=97.8, max_abs_err=0.00027 (2^-11.85), power_index=0.0829
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=0.083
Front coverage: luts_plus_ffs 857..1104 (HV reference 3000); accuracy_bits 10.5..12.2 (HV reference 10); data_width on the front 16..16 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.65 bits
- pipelined: 65 evals, 33 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1277; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 95 evals, 73 feasible; max throughput seen 171 MSPS; best accuracy 12.22 bits; best feasible luts_plus_ffs=857; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=15..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (10 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 143 feasible; hypervolume 1.32e+04 (+196.6%).

**LLM decision:** `map_front` — The Pareto front is well-established and covers the full objective ranges of interest. The minimum area design (857 LUTs+FFs) meets all constraints (throughput 97.8 MSPS >= 2, error 2^-10.46 <= 2^-10, p99 latency 0.0639 us <= 0.4 us). The front extends to 23.1 accuracy bits and 2919 LUTs+FFs, which is close to the HV reference point of 3000. The pipelined_m family dominates the front, with pipelined contributing only one design (1277 LUTs+FFs) that is dominated by pipelined_m designs with similar or better accuracy at lower area. unrolled_k has 0 feasible designs due to throughput constraints (max 13.5 MSPS, but the bottleneck is likely latency/queueing for bursty traffic rather than raw throughput, as pipelined_m with 97.8 MSPS is feasible). The iterative family is not yet explored, but given that pipelined_m already achieves the minimum area (857) and the front is well-covered, adding iterative is unlikely to improve the front significantly. The remaining budget (160 evals) is best spent mapping the full front over the ranges of the families already on it (pipelined_m and pipelined) to ensure no gaps in the trade-off curve. The front coverage is good: luts_plus_ffs 857..2919 (HV ref 3000), accuracy_bits 10.5..23.1 (HV ref 10). No obvious gaps or tight ranges that need widening or narrowing.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.32e+04 (gain this round: +196.6%).
Feasible designs: 143 of 240 evaluations (101 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 31% violate; best seen 1.13e-07 (2^-23.08)
- sys_p99_latency_us <= 0.4: 17% violate; best seen 0.0639

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=857, accuracy_bits=10.5, luts=654, ffs=203, throughput_msps=97.8, max_abs_err=0.000711 (2^-10.46), power_index=0.0645
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=908, accuracy_bits=10.6, luts=700, ffs=208, throughput_msps=97.8, max_abs_err=0.000624 (2^-10.65), power_index=0.0683
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1033, accuracy_bits=11.3, luts=772, ffs=260, throughput_msps=97.8, max_abs_err=0.000401 (2^-11.28), power_index=0.0777
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0817
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=0.083
- pipelined_m [data_width=21 n_iter=17 angle_guard=0 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=1536, accuracy_bits=15.2, luts=1270, ffs=266, throughput_msps=62.5, max_abs_err=2.64e-05 (2^-15.21), power_index=0.116
- pipelined_m [data_width=24 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=1761, accuracy_bits=16, luts=1455, ffs=306, throughput_msps=59.9, max_abs_err=1.57e-05 (2^-15.96), power_index=0.132
- pipelined_m [data_width=26 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1884, accuracy_bits=16, luts=1556, ffs=328, throughput_msps=45.9, max_abs_err=1.53e-05 (2^-15.99), power_index=0.142
- pipelined_m [data_width=25 n_iter=20 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2263, accuracy_bits=18.8, luts=1767, ffs=495, throughput_msps=86, max_abs_err=2.2e-06 (2^-18.79), power_index=0.17
- pipelined_m [data_width=28 n_iter=26 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=2919, accuracy_bits=23.1, luts=2482, ffs=438, throughput_msps=45.9, max_abs_err=1.13e-07 (2^-23.08), power_index=0.22
Front coverage: luts_plus_ffs 857..2919 (HV reference 3000); accuracy_bits 10.5..23.1 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.65 bits
- pipelined: 65 evals, 33 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1277; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 135 evals, 110 feasible; max throughput seen 171 MSPS; best accuracy 23.08 bits; best feasible luts_plus_ffs=857; feasible ranges: data_width 14..28, n_iter 12..29, angle_guard -2..3, frac_guard 0..3, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=15..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (22 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 234 feasible; hypervolume 1.418e+04 (+7.4%).

**LLM decision:** `stop` — The Pareto front is well-mapped and feasible. The minimum area design (pipelined_m, 857 LUTs+FFs) meets all constraints: throughput 97.8 MSPS >= 2, max_abs_err 0.000711 <= 0.000977, and the system p99 latency bound is satisfied (best seen 0.0639 us <= 0.4 us, with pipelined_m designs having 1 result/cycle throughput far exceeding the 2 req/us arrival rate). The front covers the full trade-off space from 857 to 4063 LUTs+FFs and 10.5 to 24.7 accuracy bits, with 234 feasible designs found. The selection rule (min luts_plus_ffs) picks the 857-point design which is clearly feasible. No further exploration is needed as the budget is exhausted and the front is comprehensive.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.418e+04 (gain this round: +7.4%).
Feasible designs: 234 of 340 evaluations (186 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 24% violate; best seen 3.65e-08 (2^-24.71)
- sys_p99_latency_us <= 0.4: 12% violate; best seen 0.0639

Pareto front (feasible, 34 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=857, accuracy_bits=10.5, luts=654, ffs=203, throughput_msps=97.8, max_abs_err=0.000711 (2^-10.46), power_index=0.0645
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1007, accuracy_bits=11.1, luts=739, ffs=268, throughput_msps=97.8, max_abs_err=0.00046 (2^-11.09), power_index=0.0758
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0817
- pipelined_m [data_width=20 n_iter=14 angle_guard=2 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1256, accuracy_bits=12.8, luts=937, ffs=319, throughput_msps=93.6, max_abs_err=0.000141 (2^-12.79), power_index=0.0945
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=4 rounding=trunc m=5] luts_plus_ffs=1521, accuracy_bits=14.7, luts=1202, ffs=319, throughput_msps=77, max_abs_err=3.81e-05 (2^-14.68), power_index=0.114
- pipelined_m [data_width=25 n_iter=17 angle_guard=0 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=1745, accuracy_bits=16, luts=1438, ffs=307, throughput_msps=59.9, max_abs_err=1.57e-05 (2^-15.96), power_index=0.131
- pipelined_m [data_width=26 n_iter=19 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1994, accuracy_bits=17.9, luts=1674, ffs=320, throughput_msps=45.9, max_abs_err=3.98e-06 (2^-17.94), power_index=0.15
- pipelined_m [data_width=25 n_iter=20 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2263, accuracy_bits=18.8, luts=1767, ffs=495, throughput_msps=86, max_abs_err=2.2e-06 (2^-18.79), power_index=0.17
- pipelined_m [data_width=28 n_iter=26 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=2919, accuracy_bits=23.1, luts=2482, ffs=438, throughput_msps=45.9, max_abs_err=1.13e-07 (2^-23.08), power_index=0.22
- pipelined_m [data_width=28 n_iter=29 angle_guard=3 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=4063, accuracy_bits=24.7, luts=2985, ffs=1078, throughput_msps=106, max_abs_err=3.65e-08 (2^-24.71), power_index=0.306
Front coverage: luts_plus_ffs 857..4063 (HV reference 3000); accuracy_bits 10.5..24.7 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.65 bits
- pipelined: 65 evals, 33 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1277; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 235 evals, 201 feasible; max throughput seen 171 MSPS; best accuracy 24.71 bits; best feasible luts_plus_ffs=857; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=15..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (34 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 291 feasible; hypervolume 1.441e+04 (+1.7%).

**No LLM call** (code's front-mapping round): The Pareto front is well-mapped and feasible. The minimum area design (pipelined_m, 857 LUTs+FFs) meets all constraints: throughput 97.8 MSPS >= 2, max_abs_err 0.000711 <= 0.000977, and the system p99 latency bound is satisfied (best seen 0.0639 us <= 0.4 us, with pipelined_m designs having 1 result/cycle throughput far exceeding the 2 req/us arrival rate). The front covers the full trade-off space from 857 to 4063 LUTs+FFs and 10.5 to 24.7 accuracy bits, with 234 feasible designs found. The selection rule (min luts_plus_ffs) picks the 857-point design which is clearly feasible. No further exploration is needed as the budget is exhausted and the front is comprehensive.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.441e+04 (gain this round: +1.7%).
Feasible designs: 291 of 400 evaluations (237 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 22% violate; best seen 3.65e-08 (2^-24.71)
- sys_p99_latency_us <= 0.4: 10% violate; best seen 0.0639

Pareto front (feasible, 39 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=857, accuracy_bits=10.5, luts=654, ffs=203, throughput_msps=97.8, max_abs_err=0.000711 (2^-10.46), power_index=0.0645
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1007, accuracy_bits=11.1, luts=739, ffs=268, throughput_msps=97.8, max_abs_err=0.00046 (2^-11.09), power_index=0.0758
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1102, accuracy_bits=11.9, luts=827, ffs=274, throughput_msps=97.8, max_abs_err=0.00027 (2^-11.85), power_index=0.0829
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=8] luts_plus_ffs=1278, accuracy_bits=13.8, luts=1095, ffs=184, throughput_msps=50.3, max_abs_err=6.89e-05 (2^-13.82), power_index=0.0962
- pipelined_m [data_width=20 n_iter=19 angle_guard=0 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1500, accuracy_bits=14.4, luts=1257, ffs=243, throughput_msps=50.3, max_abs_err=4.53e-05 (2^-14.43), power_index=0.113
- pipelined_m [data_width=25 n_iter=17 angle_guard=0 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=1745, accuracy_bits=16, luts=1438, ffs=307, throughput_msps=59.9, max_abs_err=1.57e-05 (2^-15.96), power_index=0.131
- pipelined_m [data_width=26 n_iter=19 angle_guard=2 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1952, accuracy_bits=17.9, luts=1636, ffs=316, throughput_msps=45.9, max_abs_err=4.16e-06 (2^-17.88), power_index=0.147
- pipelined_m [data_width=25 n_iter=20 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2263, accuracy_bits=18.8, luts=1767, ffs=495, throughput_msps=86, max_abs_err=2.2e-06 (2^-18.79), power_index=0.17
- pipelined_m [data_width=28 n_iter=26 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=2919, accuracy_bits=23.1, luts=2482, ffs=438, throughput_msps=45.9, max_abs_err=1.13e-07 (2^-23.08), power_index=0.22
- pipelined_m [data_width=28 n_iter=29 angle_guard=3 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=4063, accuracy_bits=24.7, luts=2985, ffs=1078, throughput_msps=106, max_abs_err=3.65e-08 (2^-24.71), power_index=0.306
Front coverage: luts_plus_ffs 857..4063 (HV reference 3000); accuracy_bits 10.5..24.7 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.65 bits
- pipelined: 65 evals, 33 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1277; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 295 evals, 258 feasible; max throughput seen 171 MSPS; best accuracy 24.71 bits; best feasible luts_plus_ffs=857; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16015 in, 4702 out
- provider-reported cost: $0.0078
- full prompts and replies: `llm_trace.jsonl`

