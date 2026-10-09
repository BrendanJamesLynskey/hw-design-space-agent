# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec dds_250msps: NCO / DDS sin-cos generator for a digital up-converter. One sample per clock at >= 250 MSPS, max error <= 2^-13. Minimise LUTs.
  constraint: throughput_msps >= 250
  constraint: max_abs_err <= 0.00012207
  objective: min luts (HV ref 4000)
  objective: max accuracy_bits (HV ref 13)
  select: min luts
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 964 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 991 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000102 (2^-13.26) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.67 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.79e-05 (2^-15.13) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.83 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.3 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (34 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` | 964 | 991 | 264.5 | 17 | 18.4 | 0.000102 (2^-13.26) | 13.26 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 973 | 967 | 264.5 | 17 | 18.2 | 0.000101 (2^-13.27) | 13.27 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 987 | 982 | 264.5 | 17 | 18.5 | 9.31e-05 (2^-13.39) | 13.39 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=1,rounding=round` | 1002 | 997 | 264.5 | 17 | 18.8 | 8.97e-05 (2^-13.44) | 13.44 |
| 4 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 1019 | 1012 | 264.5 | 17 | 19.1 | 7.94e-05 (2^-13.62) | 13.62 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=0,rounding=round` | 1048 | 1082 | 264.5 | 18 | 20 | 5.41e-05 (2^-14.17) | 14.17 |
| 6 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 1096 | 1122 | 264.5 | 18 | 20.9 | 4.81e-05 (2^-14.34) | 14.34 |
| 7 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc` | 1112 | 1138 | 264.5 | 18 | 21.2 | 4.67e-05 (2^-14.39) | 14.39 |
| 8 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 1118 | 1149 | 264.5 | 19 | 21.3 | 4.23e-05 (2^-14.53) | 14.53 |
| 9 | `pipelined:data_width=19,n_iter=16,angle_guard=4,frac_guard=3,rounding=trunc` | 1159 | 1182 | 256.5 | 18 | 22 | 4.13e-05 (2^-14.56) | 14.56 |
| 10 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=2,rounding=round` | 1170 | 1156 | 264.5 | 18 | 21.9 | 3.84e-05 (2^-14.67) | 14.67 |
| 11 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc` | 1185 | 1210 | 264.5 | 19 | 22.5 | 3.38e-05 (2^-14.85) | 14.85 |
| 12 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=1,rounding=round` | 1192 | 1181 | 264.5 | 19 | 22.3 | 3.23e-05 (2^-14.92) | 14.92 |
| 13 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 1209 | 1195 | 264.5 | 19 | 22.6 | 2.76e-05 (2^-15.14) | 15.14 |
| 14 | `pipelined:data_width=19,n_iter=18,angle_guard=3,frac_guard=1,rounding=round` | 1263 | 1251 | 264.5 | 20 | 23.6 | 2.57e-05 (2^-15.25) | 15.25 |
| 15 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=3,rounding=round` | 1295 | 1276 | 256.5 | 19 | 24.2 | 2.07e-05 (2^-15.56) | 15.56 |
| 16 | `pipelined:data_width=19,n_iter=18,angle_guard=3,frac_guard=2,rounding=round` | 1299 | 1283 | 264.5 | 20 | 24.3 | 2e-05 (2^-15.61) | 15.61 |
| 17 | `pipelined:data_width=21,n_iter=18,angle_guard=0,frac_guard=1,rounding=round` | 1321 | 1306 | 264.5 | 20 | 24.7 | 1.88e-05 (2^-15.70) | 15.70 |
| 18 | `pipelined:data_width=23,n_iter=17,angle_guard=2,frac_guard=1,rounding=trunc` | 1337 | 1368 | 256.5 | 19 | 25.4 | 1.66e-05 (2^-15.88) | 15.88 |
| 19 | `pipelined:data_width=23,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 1386 | 1370 | 256.5 | 19 | 25.9 | 1.61e-05 (2^-15.92) | 15.92 |
| 20 | `pipelined:data_width=20,n_iter=19,angle_guard=3,frac_guard=1,rounding=round` | 1394 | 1378 | 256.5 | 21 | 26.1 | 1.31e-05 (2^-16.22) | 16.22 |
| 21 | `pipelined:data_width=22,n_iter=18,angle_guard=1,frac_guard=3,rounding=trunc` | 1420 | 1441 | 256.5 | 20 | 26.9 | 1.04e-05 (2^-16.56) | 16.56 |
| 22 | `pipelined:data_width=21,n_iter=19,angle_guard=3,frac_guard=1,rounding=round` | 1453 | 1436 | 256.5 | 21 | 27.2 | 8.82e-06 (2^-16.79) | 16.79 |
| 23 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=2,rounding=trunc` | 1466 | 1487 | 256.5 | 21 | 27.8 | 7.45e-06 (2^-17.04) | 17.04 |
| 24 | `pipelined:data_width=22,n_iter=19,angle_guard=3,frac_guard=2,rounding=trunc` | 1504 | 1525 | 256.5 | 21 | 28.5 | 6.37e-06 (2^-17.26) | 17.26 |
| 25 | `pipelined:data_width=23,n_iter=19,angle_guard=3,frac_guard=2,rounding=trunc` | 1561 | 1583 | 256.5 | 21 | 29.6 | 4.81e-06 (2^-17.66) | 17.66 |
| 26 | `pipelined:data_width=22,n_iter=20,angle_guard=1,frac_guard=2,rounding=round` | 1593 | 1568 | 256.5 | 22 | 29.7 | 4.59e-06 (2^-17.73) | 17.73 |
| 27 | `pipelined:data_width=22,n_iter=21,angle_guard=3,frac_guard=2,rounding=trunc` | 1670 | 1687 | 256.5 | 23 | 31.6 | 3.67e-06 (2^-18.05) | 18.05 |
| 28 | `pipelined:data_width=22,n_iter=21,angle_guard=3,frac_guard=3,rounding=trunc` | 1712 | 1725 | 256.5 | 23 | 32.3 | 2.72e-06 (2^-18.49) | 18.49 |
| 29 | `pipelined:data_width=23,n_iter=20,angle_guard=2,frac_guard=3,rounding=round` | 1716 | 1685 | 256.5 | 22 | 32 | 2.65e-06 (2^-18.53) | 18.53 |
| 30 | `pipelined:data_width=22,n_iter=21,angle_guard=3,frac_guard=4,rounding=trunc` | 1754 | 1764 | 256.5 | 23 | 33.1 | 2.49e-06 (2^-18.61) | 18.61 |
| 31 | `pipelined:data_width=22,n_iter=21,angle_guard=3,frac_guard=4,rounding=round` | 1801 | 1766 | 256.5 | 23 | 33.5 | 1.95e-06 (2^-18.97) | 18.97 |
| 32 | `pipelined:data_width=22,n_iter=21,angle_guard=4,frac_guard=4,rounding=round` | 1822 | 1787 | 256.5 | 23 | 33.9 | 1.84e-06 (2^-19.05) | 19.05 |
| 33 | `pipelined:data_width=23,n_iter=28,angle_guard=3,frac_guard=1,rounding=round` | 2330 | 2286 | 256.5 | 30 | 43.4 | 1.73e-06 (2^-19.14) | 19.14 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 250 MSPS constraint rules out iterative and unrolled_k: their multi-cycle-per-result schedules would need Fmax in the GHz range, which is not attainable. Only pipelined and pipelined_m deliver one result per cycle, so round 1 spends the whole budget on those two families. Accuracy depends only on W, N, angle_guard, frac_guard and rounding, so both families are given the same accuracy box (W 13-20, N 10-20, guards -2..4 / 0..4, both rounding modes) to locate the feasible accuracy boundary cheaply; pipelined_m additionally sweeps m 2-8 to expose the FF/Fmax trade-off. Later rounds will narrow around the feasible frontier and, if a family proves infeasible, drop it.*)
- `pipelined` (55 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only fully-pipelined families can sustain 1 result/cycle at >=250 MHz; the plain pipelined variant has the shortest logic depth per stage and thus the best chance of high Fmax, and its constant per-stage shifts keep LUTs low. Ranges bracket the accuracy threshold (W>=~14-15, N>=~13) while allowing the search to find the cheapest point that still meets 2^-13.
- `pipelined_m` (45 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle, but registering every m stages trades FFs (and possibly Fmax) for area; with min-LUTs as the objective it may reach a lower LUT/FF point than the fully-registered pipeline, so it must be mapped on the same accuracy box.

**Result (code):** 100 evaluations this round, 100 total; 27 feasible; hypervolume 7350 (n/a).

**LLM decision:** `map_front` — The feasible front is real but confined to a thin corner near the constraint floor: all 8 front points are `pipelined`, spanning luts 969..1295 (HV ref is 4000) and accuracy_bits 13.2..15.6 (HV ref is 13). So the luts axis is covered only over ~8% of its reference range, and the accuracy axis is only ~26% of the way from the ref to the best accuracy the bit model already proves is reachable (2^-16.27 seen, and data_width on the front is only 17..20 out of registry 8..28). Hypervolume is dominated by extending the front toward higher accuracy at larger-but-still-<4000 LUTs, which full-range NSGA-II over the front's family will find. Family choice is already settled by the throughput constraint: every `pipelined_m` eval was infeasible (max throughput 171 < 250), and `iterative`/`unrolled_k` are structurally disqualified (N+3 / ceil(N/k)+3 cycles per result cannot approach 250 MSPS at Artix-7 clock rates), so spending this round on them would burn budget on guaranteed-infeasible designs. Hence mapping the whole pipelined front over full ranges is the highest-HV action.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7350 (gain this round: n/a (first round)).
Feasible designs: 27 of 100 evaluations (25 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 45% violate; best seen 282
- max_abs_err <= 0.00012207: 53% violate; best seen 1.27e-05 (2^-16.27)

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=969, accuracy_bits=13.2, ffs=1001, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.5
- pipelined [data_width=17 n_iter=16 angle_guard=4 frac_guard=1 rounding=round] luts=1037, accuracy_bits=13.3, ffs=1031, throughput_msps=264, max_abs_err=9.87e-05 (2^-13.31), power_index=19.4
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=0 rounding=round] luts=1048, accuracy_bits=14.2, ffs=1082, throughput_msps=264, max_abs_err=5.41e-05 (2^-14.17), power_index=20
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1118, accuracy_bits=14.5, ffs=1149, throughput_msps=264, max_abs_err=4.23e-05 (2^-14.53), power_index=21.3
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1156, throughput_msps=264, max_abs_err=3.84e-05 (2^-14.67), power_index=21.9
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc] luts=1185, accuracy_bits=14.9, ffs=1210, throughput_msps=264, max_abs_err=3.38e-05 (2^-14.85), power_index=22.5
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1209, accuracy_bits=15.1, ffs=1195, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] luts=1295, accuracy_bits=15.6, ffs=1276, throughput_msps=257, max_abs_err=2.07e-05 (2^-15.56), power_index=24.2
Front coverage: luts 969..1295 (HV reference 4000); accuracy_bits 13.2..15.6 (HV reference 13); data_width on the front 17..20 (registry 8..28).

Per family:
- pipelined: 55 evals, 27 feasible; max throughput seen 282 MSPS; best accuracy 15.56 bits; best feasible luts=969; feasible ranges: data_width 16..20, n_iter 16..19, angle_guard -1..4, frac_guard 0..3
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.27 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=16..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (8 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 100 feasible; hypervolume 1.585e+04 (+115.7%).

**LLM decision:** `refine` — Only `pipelined` is feasible: `pipelined_m` had 0/45 feasible with max throughput 171 MSPS (< 250), and `iterative`/`unrolled_k` are strictly worse on throughput (N+3 and ceil(N/k)+3 cycles/result), so adding them cannot satisfy the 250 MSPS constraint. The front already spans accuracy 13.2..19.1 bits (well past the HV ref of 13) but its min-LUT corner is 969 LUTs at accuracy 13.2, only just above the 2^-13 constraint. Since the selection rule is min LUTs, the highest-value move is to probe whether a smaller `data_width` (15..18) with a slightly larger `n_iter` can still clear max_abs_err <= 1.22e-4 at fewer than 969 LUTs, while keeping the low-LUT end of the front dense. Full-range front mapping is deferred to the final round.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.585e+04 (gain this round: +115.7%).
Feasible designs: 100 of 200 evaluations (85 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 32% violate; best seen 282
- max_abs_err <= 0.00012207: 31% violate; best seen 8.4e-08 (2^-23.51)

Pareto front (feasible, 21 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=969, accuracy_bits=13.2, ffs=1001, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.5
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=0 rounding=round] luts=1048, accuracy_bits=14.2, ffs=1082, throughput_msps=264, max_abs_err=5.41e-05 (2^-14.17), power_index=20
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1118, accuracy_bits=14.5, ffs=1149, throughput_msps=264, max_abs_err=4.23e-05 (2^-14.53), power_index=21.3
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc] luts=1185, accuracy_bits=14.9, ffs=1210, throughput_msps=264, max_abs_err=3.38e-05 (2^-14.85), power_index=22.5
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] luts=1295, accuracy_bits=15.6, ffs=1276, throughput_msps=257, max_abs_err=2.07e-05 (2^-15.56), power_index=24.2
- pipelined [data_width=21 n_iter=19 angle_guard=3 frac_guard=1 rounding=round] luts=1453, accuracy_bits=16.8, ffs=1436, throughput_msps=257, max_abs_err=8.82e-06 (2^-16.79), power_index=27.2
- pipelined [data_width=22 n_iter=19 angle_guard=3 frac_guard=2 rounding=trunc] luts=1504, accuracy_bits=17.3, ffs=1525, throughput_msps=257, max_abs_err=6.37e-06 (2^-17.26), power_index=28.5
- pipelined [data_width=22 n_iter=21 angle_guard=3 frac_guard=2 rounding=trunc] luts=1670, accuracy_bits=18.1, ffs=1687, throughput_msps=257, max_abs_err=3.67e-06 (2^-18.05), power_index=31.6
- pipelined [data_width=22 n_iter=21 angle_guard=3 frac_guard=4 rounding=trunc] luts=1754, accuracy_bits=18.6, ffs=1764, throughput_msps=257, max_abs_err=2.49e-06 (2^-18.61), power_index=33.1
- pipelined [data_width=22 n_iter=21 angle_guard=4 frac_guard=4 rounding=round] luts=1822, accuracy_bits=19.1, ffs=1787, throughput_msps=257, max_abs_err=1.84e-06 (2^-19.05), power_index=33.9
Front coverage: luts 969..1822 (HV reference 4000); accuracy_bits 13.2..19.1 (HV reference 13); data_width on the front 17..23 (registry 8..28).

Per family:
- pipelined: 155 evals, 100 feasible; max throughput seen 282 MSPS; best accuracy 23.51 bits; best feasible luts=969; feasible ranges: data_width 16..23, n_iter 16..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.27 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Only `pipelined` is feasible: `pipelined_m` had 0/45 feasible with max throughput 171 MSPS (< 250), and `iterative`/`unrolled_k` are strictly worse on throughput (N+3 and ceil(N/k)+3 cycles/result), so adding them cannot satisfy the 250 MSPS constraint. The front already spans accuracy 13.2..19.1 bits (well past the HV ref of 13) but its min-LUT corner is 969 LUTs at accuracy 13.2, only just above the 2^-13 constraint. Since the selection rule is min LUTs, the highest-value move is to probe whether a smaller `data_width` (15..18) with a slightly larger `n_iter` can still clear max_abs_err <= 1.22e-4 at fewer than 969 LUTs, while keeping the low-LUT end of the front dense. Full-range front mapping is deferred to the final round.*)
- `pipelined` (100 evals): data_width=15..19, n_iter=14..22, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* Focus the remaining budget on the min-LUT corner of the only feasible family.

**Result (code):** 100 evaluations this round, 300 total; 163 feasible; hypervolume 1.588e+04 (+0.2%).

**LLM decision:** `map_front` — Only `pipelined` can satisfy the throughput constraint: it is the sole family with 1 result/cycle, and every feasible design on the front is pipelined. `pipelined_m` produced 0 feasible designs in 45 evals (max throughput 171 MSPS), and the two unexplored families are structurally unable to reach 250 MSPS (iterative = Fmax/(N+3), unrolled_k = Fmax/(ceil(N/k)+3), both >= 4 cycles/result), so add_family would waste budget. The front is well-formed but narrow in the LUT objective: it spans luts 964..1822 against an HV reference of 4000, i.e. it covers only ~22% of that objective's range, while accuracy_bits 13.3..19.1 already sits well above the 13-bit reference. With 100 evals left and the reserved mapping step pending, the best use of the final round is to let NSGA-II map the full pipelined ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, rounding) seeded with the current front, extending the high-accuracy/high-LUT end of the curve to grow hypervolume. The min-LUT corner (964 LUTs, 2^-13.26 error) is already just under the 2^-13 constraint, so the selection rule's pick is unlikely to move much; the remaining gain is in front coverage.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.588e+04 (gain this round: +0.2%).
Feasible designs: 163 of 300 evaluations (131 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 21% violate; best seen 282
- max_abs_err <= 0.00012207: 33% violate; best seen 8.4e-08 (2^-23.51)

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=991, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.4
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=1019, accuracy_bits=13.6, ffs=1012, throughput_msps=264, max_abs_err=7.94e-05 (2^-13.62), power_index=19.1
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc] luts=1112, accuracy_bits=14.4, ffs=1138, throughput_msps=264, max_abs_err=4.67e-05 (2^-14.39), power_index=21.2
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1156, throughput_msps=264, max_abs_err=3.84e-05 (2^-14.67), power_index=21.9
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1209, accuracy_bits=15.1, ffs=1195, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] luts=1295, accuracy_bits=15.6, ffs=1276, throughput_msps=257, max_abs_err=2.07e-05 (2^-15.56), power_index=24.2
- pipelined [data_width=21 n_iter=19 angle_guard=3 frac_guard=1 rounding=round] luts=1453, accuracy_bits=16.8, ffs=1436, throughput_msps=257, max_abs_err=8.82e-06 (2^-16.79), power_index=27.2
- pipelined [data_width=23 n_iter=19 angle_guard=3 frac_guard=2 rounding=trunc] luts=1561, accuracy_bits=17.7, ffs=1583, throughput_msps=257, max_abs_err=4.81e-06 (2^-17.66), power_index=29.6
- pipelined [data_width=22 n_iter=21 angle_guard=3 frac_guard=3 rounding=trunc] luts=1712, accuracy_bits=18.5, ffs=1725, throughput_msps=257, max_abs_err=2.72e-06 (2^-18.49), power_index=32.3
- pipelined [data_width=22 n_iter=21 angle_guard=4 frac_guard=4 rounding=round] luts=1822, accuracy_bits=19.1, ffs=1787, throughput_msps=257, max_abs_err=1.84e-06 (2^-19.05), power_index=33.9
Front coverage: luts 964..1822 (HV reference 4000); accuracy_bits 13.3..19.1 (HV reference 13); data_width on the front 18..23 (registry 8..28).

Per family:
- pipelined: 255 evals, 163 feasible; max throughput seen 282 MSPS; best accuracy 23.51 bits; best feasible luts=964; feasible ranges: data_width 16..23, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.27 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (27 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 229 feasible; hypervolume 1.607e+04 (+1.1%).

**LLM decision:** `stop` — Budget is exhausted (400/400 evals, round 4 of 4) and the front is feasible and constraint-satisfying: 229 feasible designs, 34 on the Pareto front, with throughput up to 282 MSPS (>= 250) and best max_abs_err 4.98e-08 (well under 2^-13). The selection rule (min luts) is already served by pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 trunc] at luts=964, accuracy_bits=13.3, throughput=264 MSPS, and the front spans luts 964..2330 and accuracy 13.3..19.1 bits, so the trade-off curve is covered rather than a single corner. Hypervolume gain this round was only +1.1%, and pipelined_m produced 0 feasible designs in 45 evals (max 171 MSPS), so the unexplored iterative/unrolled_k families cannot be evaluated within the remaining budget. No further improvement is expected; stop.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.607e+04 (gain this round: +1.1%).
Feasible designs: 229 of 400 evaluations (184 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 22% violate; best seen 282
- max_abs_err <= 0.00012207: 27% violate; best seen 4.98e-08 (2^-24.26)

Pareto front (feasible, 34 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=991, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.4
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=1019, accuracy_bits=13.6, ffs=1012, throughput_msps=264, max_abs_err=7.94e-05 (2^-13.62), power_index=19.1
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc] luts=1112, accuracy_bits=14.4, ffs=1138, throughput_msps=264, max_abs_err=4.67e-05 (2^-14.39), power_index=21.2
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc] luts=1185, accuracy_bits=14.9, ffs=1210, throughput_msps=264, max_abs_err=3.38e-05 (2^-14.85), power_index=22.5
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] luts=1295, accuracy_bits=15.6, ffs=1276, throughput_msps=257, max_abs_err=2.07e-05 (2^-15.56), power_index=24.2
- pipelined [data_width=23 n_iter=17 angle_guard=2 frac_guard=1 rounding=trunc] luts=1337, accuracy_bits=15.9, ffs=1368, throughput_msps=257, max_abs_err=1.66e-05 (2^-15.88), power_index=25.4
- pipelined [data_width=21 n_iter=19 angle_guard=3 frac_guard=1 rounding=round] luts=1453, accuracy_bits=16.8, ffs=1436, throughput_msps=257, max_abs_err=8.82e-06 (2^-16.79), power_index=27.2
- pipelined [data_width=22 n_iter=20 angle_guard=1 frac_guard=2 rounding=round] luts=1593, accuracy_bits=17.7, ffs=1568, throughput_msps=257, max_abs_err=4.59e-06 (2^-17.73), power_index=29.7
- pipelined [data_width=23 n_iter=20 angle_guard=2 frac_guard=3 rounding=round] luts=1716, accuracy_bits=18.5, ffs=1685, throughput_msps=257, max_abs_err=2.65e-06 (2^-18.53), power_index=32
- pipelined [data_width=23 n_iter=28 angle_guard=3 frac_guard=1 rounding=round] luts=2330, accuracy_bits=19.1, ffs=2286, throughput_msps=257, max_abs_err=1.73e-06 (2^-19.14), power_index=43.4
Front coverage: luts 964..2330 (HV reference 4000); accuracy_bits 13.3..19.1 (HV reference 13); data_width on the front 18..23 (registry 8..28).

Per family:
- pipelined: 355 evals, 229 feasible; max throughput seen 282 MSPS; best accuracy 24.26 bits; best feasible luts=964; feasible ranges: data_width 16..23, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.27 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 13611 in, 9073 out
- provider-reported cost: $0.0129
- full prompts and replies: `llm_trace.jsonl`

