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
`pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 994 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 1025 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 19 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.41e-05 (2^-13.38) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 12.3 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.62e-05 (2^-15.22) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.44 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.4 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (25 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 994 | 1025 | 264.5 | 17 | 19 | 9.41e-05 (2^-13.38) | 13.38 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 1034 | 1027 | 264.5 | 17 | 19.4 | 7.74e-05 (2^-13.66) | 13.66 |
| 2 | `pipelined:data_width=20,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 1038 | 1070 | 264.5 | 17 | 19.8 | 7.32e-05 (2^-13.74) | 13.74 |
| 3 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 1080 | 1102 | 264.5 | 18 | 20.5 | 5.94e-05 (2^-14.04) | 14.04 |
| 4 | `pipelined:data_width=21,n_iter=16,angle_guard=2,frac_guard=0,rounding=trunc` | 1128 | 1162 | 256.5 | 18 | 21.5 | 4.46e-05 (2^-14.45) | 14.45 |
| 5 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc` | 1159 | 1182 | 256.5 | 18 | 22 | 4.08e-05 (2^-14.58) | 14.58 |
| 6 | `pipelined:data_width=20,n_iter=18,angle_guard=0,frac_guard=0,rounding=round` | 1188 | 1217 | 264.5 | 20 | 22.6 | 3.54e-05 (2^-14.79) | 14.79 |
| 7 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1202 | 1235 | 256.5 | 19 | 22.9 | 2.18e-05 (2^-15.48) | 15.48 |
| 8 | `pipelined:data_width=24,n_iter=17,angle_guard=-2,frac_guard=0,rounding=trunc` | 1287 | 1321 | 256.5 | 19 | 24.5 | 1.98e-05 (2^-15.63) | 15.63 |
| 9 | `pipelined:data_width=24,n_iter=17,angle_guard=-2,frac_guard=0,rounding=round` | 1287 | 1321 | 256.5 | 19 | 24.5 | 1.98e-05 (2^-15.63) | 15.63 |
| 10 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 1314 | 1297 | 256.5 | 19 | 24.6 | 1.83e-05 (2^-15.73) | 15.73 |
| 11 | `pipelined:data_width=24,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 1320 | 1355 | 256.5 | 19 | 25.2 | 1.63e-05 (2^-15.90) | 15.90 |
| 12 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc` | 1331 | 1354 | 256.5 | 20 | 25.2 | 1.43e-05 (2^-16.10) | 16.10 |
| 13 | `pipelined:data_width=21,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 1333 | 1361 | 264.5 | 21 | 25.3 | 1.29e-05 (2^-16.24) | 16.24 |
| 14 | `pipelined:data_width=22,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 1409 | 1438 | 256.5 | 21 | 26.8 | 8.18e-06 (2^-16.90) | 16.90 |
| 15 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=1,rounding=round` | 1474 | 1455 | 256.5 | 21 | 27.5 | 7.47e-06 (2^-17.03) | 17.03 |
| 16 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=3,rounding=trunc` | 1504 | 1521 | 256.5 | 21 | 28.4 | 6.73e-06 (2^-17.18) | 17.18 |
| 17 | `pipelined:data_width=25,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc` | 1542 | 1572 | 256.5 | 21 | 29.3 | 4.71e-06 (2^-17.70) | 17.70 |
| 18 | `pipelined:data_width=25,n_iter=19,angle_guard=1,frac_guard=1,rounding=trunc` | 1599 | 1625 | 256.5 | 21 | 30.3 | 4.24e-06 (2^-17.85) | 17.85 |
| 19 | `pipelined:data_width=24,n_iter=20,angle_guard=0,frac_guard=1,rounding=trunc` | 1607 | 1630 | 256.5 | 22 | 30.4 | 3.91e-06 (2^-17.96) | 17.96 |
| 20 | `pipelined:data_width=25,n_iter=20,angle_guard=0,frac_guard=1,rounding=trunc` | 1667 | 1691 | 256.5 | 22 | 31.6 | 2.69e-06 (2^-18.50) | 18.50 |
| 21 | `pipelined:data_width=25,n_iter=20,angle_guard=0,frac_guard=1,rounding=round` | 1720 | 1693 | 256.5 | 22 | 32.1 | 2.49e-06 (2^-18.61) | 18.61 |
| 22 | `pipelined:data_width=24,n_iter=22,angle_guard=2,frac_guard=0,rounding=round` | 1776 | 1798 | 256.5 | 24 | 33.6 | 1.67e-06 (2^-19.19) | 19.19 |
| 23 | `pipelined:data_width=25,n_iter=22,angle_guard=0,frac_guard=0,rounding=round` | 1798 | 1820 | 256.5 | 24 | 34 | 1.51e-06 (2^-19.34) | 19.34 |
| 24 | `pipelined:data_width=25,n_iter=24,angle_guard=1,frac_guard=1,rounding=round` | 2094 | 2056 | 256.5 | 26 | 39 | 7.31e-07 (2^-20.38) | 20.38 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint is the binding one. iterative and low-k unrolled_k cannot reach 250 MSPS because they emit one result every several cycles, so the first round concentrates on the two families that emit one result per cycle: pipelined and pipelined_m. Both compute identical bits, so accuracy depends only on data_width, n_iter, angle_guard, frac_guard and rounding; the ranges 12..20 and 8..20 are chosen to straddle the 13-bit accuracy requirement so the search can locate the smallest W/N that still satisfies max_abs_err <= 2^-13, which is what min-LUT selection will pick. angle_guard and frac_guard are opened to their full registry ranges because they can buy accuracy bits cheaply without widening the whole datapath. A 10% probe on unrolled_k at k=6..8 tests the only remaining family that could in principle hit 250 MSPS, so we do not discard it without data. This split keeps ~90% of round-1 budget on the two families that can plausibly satisfy both constraints, while still giving the hypervolume search a chance to find low-LUT corners.*)
- `pipelined` (45 evals): data_width=12..20, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only the fully pipelined family gives 1 result/cycle, so it is the most likely to clear the 250 MSPS throughput floor: throughput = Fmax x 1. Its one-stage-per-register structure also gives the shortest combinational path and therefore the highest Fmax of the pipelined variants. The ranges bracket the accuracy requirement (W around 15-16 and N around 13-16 should reach 13 accuracy bits) while allowing the search to find the smallest W/N that still meets max_abs_err <= 2^-13, which is exactly what the min-LUT objective wants.
- `pipelined_m` (45 evals): data_width=12..20, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle, so it can meet 250 MSPS if Fmax is high enough. It uses fewer pipeline registers than plain pipelined (lower FF count, and possibly slightly lower LUT count from register merging), so it is a genuine area trade-off candidate. The m range 2..8 lets the search trade Fmax against register count; the accuracy parameters are identical to pipelined, so the same W/N window applies.
- `unrolled_k` (10 evals): data_width=12..20, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* A small probe at the highest k values. Throughput = Fmax / (ceil(N/k)+3), so even k=8 with N=16 needs Fmax around 1.25 GHz to reach 250 MSPS, which is almost certainly out of reach on Artix-7. This slice is a cheap falsification check: if any unrolled_k point clears the throughput constraint it becomes a useful low-LUT corner, and if none do we can drop the family from later rounds with evidence rather than assumption.

**Result (code):** 100 evaluations this round, 100 total; 11 feasible; hypervolume 5888 (n/a).

**LLM decision:** `map_front` — Only the pipelined family is feasible: 11/45 pipelined evals met both constraints, while unrolled_k (0/10, max throughput 9.76 MSPS) and pipelined_m (0/45, max throughput 171 MSPS) never reached the 250 MSPS floor. iterative is not worth a round either: it issues 1 result per N+3 cycles, so its throughput is at best Fmax/7, and unrolled_k — which is strictly faster per cycle for k>=2 — already tops out at 9.76 MSPS, so iterative cannot reach 250 MSPS. The feasible front is therefore pipelined-only and is still very sparse: just 5 designs spanning luts 1051..1240 against an HV reference of 4000, and accuracy 13.1..15.1 bits, even though the feasible pipelined box reaches data_width 20, n_iter 19 and angle_guard 0 (higher-accuracy, higher-LUT points that would extend the curve upward). With 300 evals left and the front covering only a small part of the LUT objective's range, the best use of this round is to let NSGA-II map the whole pipelined trade-off curve over its full ranges, seeded with the current front, rather than refining the already-dense low-LUT corner.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5888 (gain this round: n/a (first round)).
Feasible designs: 11 of 100 evaluations (10 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 55% violate; best seen 273
- max_abs_err <= 0.00012207: 60% violate; best seen 1.31e-05 (2^-16.22)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=4 rounding=round] luts=1051, accuracy_bits=13.1, ffs=1035, throughput_msps=264, max_abs_err=0.00011 (2^-13.15), power_index=19.6
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1080, accuracy_bits=14, ffs=1102, throughput_msps=264, max_abs_err=5.94e-05 (2^-14.04), power_index=20.5
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1139, accuracy_bits=14.3, ffs=1130, throughput_msps=264, max_abs_err=4.98e-05 (2^-14.29), power_index=21.3
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=4 rounding=round] luts=1240, accuracy_bits=15.1, ffs=1221, throughput_msps=264, max_abs_err=2.94e-05 (2^-15.05), power_index=23.1
Front coverage: luts 1051..1240 (HV reference 4000); accuracy_bits 13.1..15.1 (HV reference 13); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 9.76 MSPS; best accuracy 14.28 bits
- pipelined: 45 evals, 11 feasible; max throughput seen 273 MSPS; best accuracy 15.05 bits; best feasible luts=1051; feasible ranges: data_width 16..20, n_iter 16..19, angle_guard 0..3, frac_guard 1..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.22 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=15..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (5 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 69 feasible; hypervolume 1.739e+04 (+195.3%).

**LLM decision:** `map_front` — Only pipelined is feasible: unrolled_k (max 9.76 MSPS) and pipelined_m (max 171 MSPS) both fall short of the 250 MSPS constraint, and iterative (1 result per N+3 cycles) cannot reach 250 MSPS at any plausible Artix-7 Fmax, so it is not worth a round. The 17-design front is entirely pipelined, spanning luts 1051..2176 against the HV ref 4000 (only ~27% of the luts range covered) while accuracy_bits 13.1..19.9 already exceeds the ref 13. The min-luts corner (dw=16, n_iter=16, ag=2, fg=4, round -> 1051 LUTs, 13.1 bits) sits right on the 2^-13 accuracy boundary, so the low-lut region is under-explored. A code-driven NSGA-II coverage search over the full pipelined ranges, seeded with the current front, is the reserved step to map the whole trade-off curve and will also probe the min-luts corner that the selection rule targets.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.739e+04 (gain this round: +195.3%).
Feasible designs: 69 of 200 evaluations (64 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 38% violate; best seen 273
- max_abs_err <= 0.00012207: 40% violate; best seen 1.44e-07 (2^-22.73)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=4 rounding=round] luts=1051, accuracy_bits=13.1, ffs=1035, throughput_msps=264, max_abs_err=0.00011 (2^-13.15), power_index=19.6
- pipelined [data_width=21 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] luts=1128, accuracy_bits=14.5, ffs=1162, throughput_msps=257, max_abs_err=4.46e-05 (2^-14.45), power_index=21.5
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=4 rounding=round] luts=1240, accuracy_bits=15.1, ffs=1221, throughput_msps=264, max_abs_err=2.94e-05 (2^-15.05), power_index=23.1
- pipelined [data_width=24 n_iter=17 angle_guard=-2 frac_guard=0 rounding=trunc] luts=1287, accuracy_bits=15.6, ffs=1321, throughput_msps=257, max_abs_err=1.98e-05 (2^-15.63), power_index=24.5
- pipelined [data_width=24 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] luts=1320, accuracy_bits=15.9, ffs=1355, throughput_msps=257, max_abs_err=1.63e-05 (2^-15.90), power_index=25.2
- pipelined [data_width=21 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc] luts=1409, accuracy_bits=16.2, ffs=1434, throughput_msps=257, max_abs_err=1.33e-05 (2^-16.20), power_index=26.7
- pipelined [data_width=24 n_iter=20 angle_guard=0 frac_guard=1 rounding=trunc] luts=1607, accuracy_bits=18, ffs=1630, throughput_msps=257, max_abs_err=3.91e-06 (2^-17.96), power_index=30.4
- pipelined [data_width=25 n_iter=20 angle_guard=0 frac_guard=1 rounding=trunc] luts=1667, accuracy_bits=18.5, ffs=1691, throughput_msps=257, max_abs_err=2.69e-06 (2^-18.50), power_index=31.6
- pipelined [data_width=24 n_iter=23 angle_guard=2 frac_guard=0 rounding=round] luts=1860, accuracy_bits=19.3, ffs=1880, throughput_msps=257, max_abs_err=1.57e-06 (2^-19.28), power_index=35.2
- pipelined [data_width=22 n_iter=25 angle_guard=4 frac_guard=4 rounding=round] luts=2176, accuracy_bits=19.9, ffs=2130, throughput_msps=257, max_abs_err=1e-06 (2^-19.93), power_index=40.5
Front coverage: luts 1051..2176 (HV reference 4000); accuracy_bits 13.1..19.9 (HV reference 13); data_width on the front 16..25 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 9.76 MSPS; best accuracy 14.28 bits
- pipelined: 145 evals, 69 feasible; max throughput seen 273 MSPS; best accuracy 22.73 bits; best feasible luts=1051; feasible ranges: data_width 16..25, n_iter 16..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.22 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=15..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (17 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 131 feasible; hypervolume 1.763e+04 (+1.4%).

**LLM decision:** `map_front` — Only `pipelined` is feasible: unrolled_k (max 9.76 MSPS) and pipelined_m (max 171 MSPS) both fall short of the 250 MSPS constraint, and `iterative` (N+3 cycles/result) cannot reach 250 MSPS at any plausible Fmax, so it is not worth budget. The feasible front is entirely pipelined and already spans accuracy_bits 13.4..19.9 (well past the HV ref of 13) but only luts 1030..2176 against an HV ref of 4000 — i.e. the front covers barely half the LUT range, leaving a large uncovered HV region toward higher-area/higher-accuracy designs. With 100 evals left in the final round and only +1.4% gain last round, the best use of the reserved budget is to let NSGA-II map the full pipelined ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, rounding both) seeded with the current front, extending coverage toward the 4000-LUT reference while preserving the min-LUT corner (luts=1030, accuracy_bits=13.4) that the selection rule will pick.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.763e+04 (gain this round: +1.4%).
Feasible designs: 131 of 300 evaluations (117 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 35% violate; best seen 273
- max_abs_err <= 0.00012207: 30% violate; best seen 8.19e-08 (2^-23.54)

Pareto front (feasible, 21 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=4 rounding=round] luts=1030, accuracy_bits=13.4, ffs=1015, throughput_msps=264, max_abs_err=9.56e-05 (2^-13.35), power_index=19.2
- pipelined [data_width=21 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] luts=1128, accuracy_bits=14.5, ffs=1162, throughput_msps=257, max_abs_err=4.46e-05 (2^-14.45), power_index=21.5
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] luts=1188, accuracy_bits=14.8, ffs=1217, throughput_msps=264, max_abs_err=3.54e-05 (2^-14.79), power_index=22.6
- pipelined [data_width=24 n_iter=17 angle_guard=-2 frac_guard=0 rounding=round] luts=1287, accuracy_bits=15.6, ffs=1321, throughput_msps=257, max_abs_err=1.98e-05 (2^-15.63), power_index=24.5
- pipelined [data_width=21 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc] luts=1331, accuracy_bits=16.1, ffs=1354, throughput_msps=257, max_abs_err=1.43e-05 (2^-16.10), power_index=25.2
- pipelined [data_width=20 n_iter=19 angle_guard=3 frac_guard=3 rounding=trunc] luts=1428, accuracy_bits=16.5, ffs=1445, throughput_msps=257, max_abs_err=1.07e-05 (2^-16.51), power_index=27
- pipelined [data_width=25 n_iter=19 angle_guard=0 frac_guard=0 rounding=trunc] luts=1542, accuracy_bits=17.7, ffs=1572, throughput_msps=257, max_abs_err=4.71e-06 (2^-17.70), power_index=29.3
- pipelined [data_width=25 n_iter=20 angle_guard=0 frac_guard=1 rounding=round] luts=1720, accuracy_bits=18.6, ffs=1693, throughput_msps=257, max_abs_err=2.49e-06 (2^-18.61), power_index=32.1
- pipelined [data_width=25 n_iter=22 angle_guard=0 frac_guard=0 rounding=round] luts=1798, accuracy_bits=19.3, ffs=1820, throughput_msps=257, max_abs_err=1.51e-06 (2^-19.34), power_index=34
- pipelined [data_width=22 n_iter=25 angle_guard=4 frac_guard=4 rounding=round] luts=2176, accuracy_bits=19.9, ffs=2130, throughput_msps=257, max_abs_err=1e-06 (2^-19.93), power_index=40.5
Front coverage: luts 1030..2176 (HV reference 4000); accuracy_bits 13.4..19.9 (HV reference 13); data_width on the front 17..25 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 9.76 MSPS; best accuracy 14.28 bits
- pipelined: 245 evals, 131 feasible; max throughput seen 273 MSPS; best accuracy 23.54 bits; best feasible luts=1030; feasible ranges: data_width 16..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.22 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (21 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 195 feasible; hypervolume 1.863e+04 (+5.7%).

**LLM decision:** `stop` — Budget is exhausted (400/400 evals, final round) and the constraints are met: the front's min-LUT design pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] gives luts=994, throughput_msps=264 (>=250) and max_abs_err=9.41e-05 (2^-13.38, <=2^-13), so the spec is feasible and the min-luts selection rule is satisfied at the front's low-LUT corner. Hypervolume is still improving (+5.7% this round) and the front spans luts 994..2094 with accuracy_bits 13.4..20.4, but with no remaining budget no further exploration is possible; unrolled_k and pipelined_m yielded 0 feasible designs (max throughput 9.76 and 171 MSPS respectively) and iterative was never needed since pipelined already covers the throughput constraint. Stopping is therefore the correct final verdict.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.863e+04 (gain this round: +5.7%).
Feasible designs: 195 of 400 evaluations (170 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 31% violate; best seen 273
- max_abs_err <= 0.00012207: 27% violate; best seen 8.19e-08 (2^-23.54)

Pareto front (feasible, 25 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts=994, accuracy_bits=13.4, ffs=1025, throughput_msps=264, max_abs_err=9.41e-05 (2^-13.38), power_index=19
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1080, accuracy_bits=14, ffs=1102, throughput_msps=264, max_abs_err=5.94e-05 (2^-14.04), power_index=20.5
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc] luts=1159, accuracy_bits=14.6, ffs=1182, throughput_msps=257, max_abs_err=4.08e-05 (2^-14.58), power_index=22
- pipelined [data_width=24 n_iter=17 angle_guard=-2 frac_guard=0 rounding=trunc] luts=1287, accuracy_bits=15.6, ffs=1321, throughput_msps=257, max_abs_err=1.98e-05 (2^-15.63), power_index=24.5
- pipelined [data_width=24 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] luts=1320, accuracy_bits=15.9, ffs=1355, throughput_msps=257, max_abs_err=1.63e-05 (2^-15.90), power_index=25.2
- pipelined [data_width=21 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] luts=1333, accuracy_bits=16.2, ffs=1361, throughput_msps=264, max_abs_err=1.29e-05 (2^-16.24), power_index=25.3
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=3 rounding=trunc] luts=1504, accuracy_bits=17.2, ffs=1521, throughput_msps=257, max_abs_err=6.73e-06 (2^-17.18), power_index=28.4
- pipelined [data_width=24 n_iter=20 angle_guard=0 frac_guard=1 rounding=trunc] luts=1607, accuracy_bits=18, ffs=1630, throughput_msps=257, max_abs_err=3.91e-06 (2^-17.96), power_index=30.4
- pipelined [data_width=25 n_iter=20 angle_guard=0 frac_guard=1 rounding=round] luts=1720, accuracy_bits=18.6, ffs=1693, throughput_msps=257, max_abs_err=2.49e-06 (2^-18.61), power_index=32.1
- pipelined [data_width=25 n_iter=24 angle_guard=1 frac_guard=1 rounding=round] luts=2094, accuracy_bits=20.4, ffs=2056, throughput_msps=257, max_abs_err=7.31e-07 (2^-20.38), power_index=39
Front coverage: luts 994..2094 (HV reference 4000); accuracy_bits 13.4..20.4 (HV reference 13); data_width on the front 18..25 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 9.76 MSPS; best accuracy 14.28 bits
- pipelined: 345 evals, 195 feasible; max throughput seen 273 MSPS; best accuracy 23.54 bits; best feasible luts=994; feasible ranges: data_width 16..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.22 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 13799 in, 10979 out
- provider-reported cost: $0.0141
- full prompts and replies: `llm_trace.jsonl`

