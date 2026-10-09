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
`pipelined:data_width=19,n_iter=15,angle_guard=3,frac_guard=0,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 979 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 1014 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000109 (2^-13.17) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 14.2 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.9e-05 (2^-15.07) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.8 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.2 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=19,n_iter=15,angle_guard=3,frac_guard=0,rounding=trunc` | 979 | 1014 | 264.5 | 17 | 18.7 | 0.000109 (2^-13.17) | 13.17 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 1017 | 1008 | 264.5 | 17 | 19 | 8.26e-05 (2^-13.56) | 13.56 |
| 2 | `pipelined:data_width=19,n_iter=15,angle_guard=4,frac_guard=1,rounding=round` | 1063 | 1057 | 256.5 | 17 | 19.9 | 7.38e-05 (2^-13.73) | 13.73 |
| 3 | `pipelined:data_width=19,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 1067 | 1098 | 264.5 | 19 | 20.4 | 6.32e-05 (2^-13.95) | 13.95 |
| 4 | `pipelined:data_width=21,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 1080 | 1114 | 264.5 | 18 | 20.6 | 4.91e-05 (2^-14.31) | 14.31 |
| 5 | `pipelined:data_width=21,n_iter=16,angle_guard=-1,frac_guard=1,rounding=round` | 1156 | 1144 | 264.5 | 18 | 21.6 | 4.72e-05 (2^-14.37) | 14.37 |
| 6 | `pipelined:data_width=21,n_iter=16,angle_guard=0,frac_guard=1,rounding=round` | 1172 | 1160 | 264.5 | 18 | 21.9 | 4e-05 (2^-14.61) | 14.61 |
| 7 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 1175 | 1164 | 264.5 | 19 | 22 | 3.42e-05 (2^-14.83) | 14.83 |
| 8 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=1,rounding=trunc` | 1185 | 1214 | 264.5 | 19 | 22.6 | 3.13e-05 (2^-14.96) | 14.96 |
| 9 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc` | 1253 | 1274 | 256.5 | 19 | 23.8 | 2.35e-05 (2^-15.38) | 15.38 |
| 10 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc` | 1270 | 1295 | 256.5 | 19 | 24.1 | 1.95e-05 (2^-15.65) | 15.65 |
| 11 | `pipelined:data_width=22,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round` | 1277 | 1308 | 264.5 | 20 | 24.3 | 1.85e-05 (2^-15.72) | 15.72 |
| 12 | `pipelined:data_width=23,n_iter=17,angle_guard=1,frac_guard=0,rounding=trunc` | 1287 | 1321 | 256.5 | 19 | 24.5 | 1.83e-05 (2^-15.74) | 15.74 |
| 13 | `pipelined:data_width=22,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc` | 1331 | 1362 | 256.5 | 20 | 25.3 | 1.6e-05 (2^-15.93) | 15.93 |
| 14 | `pipelined:data_width=21,n_iter=18,angle_guard=3,frac_guard=1,rounding=round` | 1375 | 1360 | 256.5 | 20 | 25.7 | 1.19e-05 (2^-16.36) | 16.36 |
| 15 | `pipelined:data_width=22,n_iter=18,angle_guard=4,frac_guard=1,rounding=trunc` | 1403 | 1431 | 256.5 | 20 | 26.6 | 1.08e-05 (2^-16.49) | 16.49 |
| 16 | `pipelined:data_width=23,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 1447 | 1476 | 256.5 | 21 | 27.5 | 5.76e-06 (2^-17.41) | 17.41 |
| 17 | `pipelined:data_width=25,n_iter=19,angle_guard=-1,frac_guard=1,rounding=trunc` | 1561 | 1587 | 256.5 | 21 | 29.6 | 5.1e-06 (2^-17.58) | 17.58 |
| 18 | `pipelined:data_width=23,n_iter=20,angle_guard=2,frac_guard=1,rounding=trunc` | 1587 | 1610 | 256.5 | 22 | 30.1 | 4.15e-06 (2^-17.88) | 17.88 |
| 19 | `pipelined:data_width=23,n_iter=21,angle_guard=1,frac_guard=0,rounding=round` | 1607 | 1631 | 256.5 | 23 | 30.5 | 3.03e-06 (2^-18.33) | 18.33 |
| 20 | `pipelined:data_width=25,n_iter=21,angle_guard=1,frac_guard=0,rounding=trunc` | 1733 | 1759 | 256.5 | 23 | 32.8 | 2.11e-06 (2^-18.86) | 18.86 |
| 21 | `pipelined:data_width=21,n_iter=25,angle_guard=4,frac_guard=4,rounding=round` | 2098 | 2054 | 256.5 | 27 | 39 | 2.06e-06 (2^-18.89) | 18.89 |
| 22 | `pipelined:data_width=24,n_iter=25,angle_guard=1,frac_guard=1,rounding=round` | 2104 | 2066 | 256.5 | 27 | 39.2 | 1.29e-06 (2^-19.57) | 19.57 |
| 23 | `pipelined:data_width=24,n_iter=25,angle_guard=1,frac_guard=2,rounding=round` | 2155 | 2113 | 256.5 | 27 | 40.1 | 1.06e-06 (2^-19.84) | 19.84 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Throughput >= 250 MSPS is the binding architectural constraint: iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) would need Fmax in the GHz range even at their most aggressive settings, which is not attainable on Artix-7, so they are excluded from the first round rather than wasting budget confirming infeasibility. That leaves the two 1-result/cycle families, pipelined and pipelined_m, which are the only ones that can plausibly satisfy the throughput constraint. Accuracy (max_abs_err <= 2^-13) depends only on data_width, n_iter, angle_guard, frac_guard and rounding, so both families are given identical accuracy-parameter ranges wide enough to bracket the 13-bit threshold from below (small W/N, cheap) to comfortably above (larger W/N, safe). The 50/50 split lets round 1 compare the two register-scheduling strategies head-to-head; subsequent rounds can reallocate toward whichever family actually populates the feasible front and can extend ranges if the front sits at a boundary.*)
- `pipelined` (50 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only a 1-result/cycle family can plausibly reach 250 MSPS on Artix-7; pipelined is the canonical such architecture. Its N+2 latency and one-register-per-rotation structure give the cleanest area/accuracy trade-off. Ranges cover the accuracy threshold (W and N large enough for ~13 bits) down to the smallest W/N that might still pass, so the low-LUT corner is reachable.
- `pipelined_m` (50 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle, so it can meet 250 MSPS, but registers every m stages instead of every stage. This trades Fmax (longer combinational path) against FF count, and is the most likely source of a lower-LUT / lower-area design on the front. The extra m dimension is worth half the budget because it can shift the Pareto front in ways pipelined cannot.

**Result (code):** 100 evaluations this round, 100 total; 26 feasible; hypervolume 1.017e+04 (n/a).

**LLM decision:** `map_front` — The throughput constraint (>=250 MSPS) effectively forces a 1-result/cycle architecture: pipelined is the only family that reached it (max 282 MSPS, 26/50 feasible), while pipelined_m topped out at 171 MSPS (0/50 feasible) because registering only every m stages lengthens the combinational path and drops Fmax. The two unexplored families are structurally multi-cycle (iterative = N+3 cycles/result, unrolled_k = ceil(N/k)+3), so even at the smallest N=4 they would need Fmax of ~1.0-1.75 GHz to hit 250 MSPS - unreachable on Artix-7 - and are therefore not worth budget. So the feasible front lives entirely in pipelined, and it currently spans only luts 1017..1527 and data_width 18..20, i.e. a small slice of the objective range (HV ref 4000) and not even the full feasible data_width range (17..20). Since the selection rule is min luts, the highest-value work is to map the whole pipelined front (seeded with the current 10 points) to expose the true min-LUT corner and fill the accuracy/luts trade-off curve before the reserved end-of-run mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.017e+04 (gain this round: n/a (first round)).
Feasible designs: 26 of 100 evaluations (23 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 282
- max_abs_err <= 0.00012207: 61% violate; best seen 9.41e-06 (2^-16.70)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=1017, accuracy_bits=13.6, ffs=1008, throughput_msps=264, max_abs_err=8.26e-05 (2^-13.56), power_index=19
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=1 rounding=trunc] luts=1169, accuracy_bits=14.3, ffs=1197, throughput_msps=257, max_abs_err=4.85e-05 (2^-14.33), power_index=22.2
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1175, accuracy_bits=14.8, ffs=1164, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=1 rounding=trunc] luts=1185, accuracy_bits=15, ffs=1214, throughput_msps=264, max_abs_err=3.13e-05 (2^-14.96), power_index=22.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] luts=1253, accuracy_bits=15.4, ffs=1274, throughput_msps=257, max_abs_err=2.35e-05 (2^-15.38), power_index=23.8
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=round] luts=1276, accuracy_bits=15.5, ffs=1259, throughput_msps=257, max_abs_err=2.19e-05 (2^-15.48), power_index=23.8
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] luts=1301, accuracy_bits=15.7, ffs=1287, throughput_msps=264, max_abs_err=1.89e-05 (2^-15.69), power_index=24.3
- pipelined [data_width=19 n_iter=19 angle_guard=4 frac_guard=2 rounding=round] luts=1392, accuracy_bits=16, ffs=1374, throughput_msps=257, max_abs_err=1.5e-05 (2^-16.03), power_index=26
- pipelined [data_width=19 n_iter=19 angle_guard=4 frac_guard=4 rounding=trunc] luts=1428, accuracy_bits=16.1, ffs=1441, throughput_msps=257, max_abs_err=1.46e-05 (2^-16.07), power_index=27
- pipelined [data_width=20 n_iter=20 angle_guard=4 frac_guard=3 rounding=trunc] luts=1527, accuracy_bits=16.7, ffs=1542, throughput_msps=257, max_abs_err=9.41e-06 (2^-16.70), power_index=28.9
Front coverage: luts 1017..1527 (HV reference 4000); accuracy_bits 13.6..16.7 (HV reference 13); data_width on the front 18..20 (registry 8..28).

Per family:
- pipelined: 50 evals, 26 feasible; max throughput seen 282 MSPS; best accuracy 16.70 bits; best feasible luts=1017; feasible ranges: data_width 17..20, n_iter 15..20, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.75 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (10 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 106 feasible; hypervolume 1.534e+04 (+50.9%).

**LLM decision:** `map_front` — The feasible front is pipelined-only, and that is structural, not a sampling artefact: pipelined/pipelined_m are the only 1-result/cycle families, and pipelined_m already shows 0 feasible with max throughput 171 < 250. iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) would need Fmax of ~1000+ MHz to reach 250 MSPS, so adding them would burn budget on families that cannot satisfy the throughput constraint. Meanwhile the current front is under-mapped on both objective axes relative to the HV reference: luts only reach 2098 vs ref 4000, and accuracy_bits top out at 18.9 while pipelined has already demonstrated 22.76 bits. That leaves a large unclaimed HV region at higher luts/higher accuracy. Spend this round letting NSGA-II map the full pipelined ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, both roundings) seeded with the current 22-design front, so the whole trade-off curve — including the high-accuracy end and any lower-LUT corner near the 250 MSPS / 2^-13 boundary — is covered before the final min-luts selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.534e+04 (gain this round: +50.9%).
Feasible designs: 106 of 200 evaluations (93 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 32% violate; best seen 282
- max_abs_err <= 0.00012207: 34% violate; best seen 1.41e-07 (2^-22.76)

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=3 frac_guard=0 rounding=trunc] luts=979, accuracy_bits=13.2, ffs=1014, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=18.7
- pipelined [data_width=19 n_iter=15 angle_guard=4 frac_guard=1 rounding=round] luts=1063, accuracy_bits=13.7, ffs=1057, throughput_msps=257, max_abs_err=7.38e-05 (2^-13.73), power_index=19.9
- pipelined [data_width=21 n_iter=16 angle_guard=-1 frac_guard=1 rounding=round] luts=1156, accuracy_bits=14.4, ffs=1144, throughput_msps=264, max_abs_err=4.72e-05 (2^-14.37), power_index=21.6
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1175, accuracy_bits=14.8, ffs=1164, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] luts=1253, accuracy_bits=15.4, ffs=1274, throughput_msps=257, max_abs_err=2.35e-05 (2^-15.38), power_index=23.8
- pipelined [data_width=23 n_iter=17 angle_guard=1 frac_guard=0 rounding=trunc] luts=1287, accuracy_bits=15.7, ffs=1321, throughput_msps=257, max_abs_err=1.83e-05 (2^-15.74), power_index=24.5
- pipelined [data_width=19 n_iter=18 angle_guard=4 frac_guard=4 rounding=round] luts=1389, accuracy_bits=16.2, ffs=1366, throughput_msps=257, max_abs_err=1.35e-05 (2^-16.17), power_index=25.9
- pipelined [data_width=23 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] luts=1447, accuracy_bits=17.4, ffs=1476, throughput_msps=257, max_abs_err=5.76e-06 (2^-17.41), power_index=27.5
- pipelined [data_width=23 n_iter=25 angle_guard=1 frac_guard=0 rounding=round] luts=1927, accuracy_bits=18.3, ffs=1942, throughput_msps=257, max_abs_err=3.01e-06 (2^-18.34), power_index=36.4
- pipelined [data_width=21 n_iter=25 angle_guard=4 frac_guard=4 rounding=round] luts=2098, accuracy_bits=18.9, ffs=2054, throughput_msps=257, max_abs_err=2.06e-06 (2^-18.89), power_index=39
Front coverage: luts 979..2098 (HV reference 4000); accuracy_bits 13.2..18.9 (HV reference 13); data_width on the front 18..23 (registry 8..28).

Per family:
- pipelined: 150 evals, 106 feasible; max throughput seen 282 MSPS; best accuracy 22.76 bits; best feasible luts=979; feasible ranges: data_width 17..23, n_iter 15..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.75 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (22 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 167 feasible; hypervolume 1.741e+04 (+13.5%).

**LLM decision:** `map_front` — Only `pipelined` can satisfy the 250 MSPS constraint: `pipelined_m` peaked at 171 MSPS with 0 feasible designs, and `iterative`/`unrolled_k` are inherently multi-cycle (N+3 and ceil(N/k)+3 cycles/result), so they cannot reach 250 MSPS at any realistic Fmax — adding them would waste the last 100 evals. The feasible front is entirely on `pipelined` and still leaves trade-off space uncovered: luts span 979..2155 against the HV reference 4000, and accuracy_bits span 13.2..19.8 against the best accuracy seen anywhere of 23.76 bits, so the high-accuracy/higher-lut region (2155..4000 luts, 19.8..23.76 bits) is empty and would add hypervolume. With one round and 100 evals left, the prescribed final move is to let code map the whole `pipelined` front over its full ranges, seeded with the current front, rather than narrowing around the min-luts corner (979 luts, 13.2 bits) which the selection rule already has.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.741e+04 (gain this round: +13.5%).
Feasible designs: 167 of 300 evaluations (146 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 33% violate; best seen 282
- max_abs_err <= 0.00012207: 25% violate; best seen 7.02e-08 (2^-23.76)

Pareto front (feasible, 23 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=3 frac_guard=0 rounding=trunc] luts=979, accuracy_bits=13.2, ffs=1014, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=18.7
- pipelined [data_width=19 n_iter=15 angle_guard=4 frac_guard=1 rounding=round] luts=1063, accuracy_bits=13.7, ffs=1057, throughput_msps=257, max_abs_err=7.38e-05 (2^-13.73), power_index=19.9
- pipelined [data_width=21 n_iter=16 angle_guard=-1 frac_guard=1 rounding=round] luts=1156, accuracy_bits=14.4, ffs=1144, throughput_msps=264, max_abs_err=4.72e-05 (2^-14.37), power_index=21.6
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1175, accuracy_bits=14.8, ffs=1164, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=round] luts=1276, accuracy_bits=15.5, ffs=1259, throughput_msps=257, max_abs_err=2.19e-05 (2^-15.48), power_index=23.8
- pipelined [data_width=23 n_iter=17 angle_guard=1 frac_guard=0 rounding=trunc] luts=1287, accuracy_bits=15.7, ffs=1321, throughput_msps=257, max_abs_err=1.83e-05 (2^-15.74), power_index=24.5
- pipelined [data_width=22 n_iter=18 angle_guard=4 frac_guard=1 rounding=trunc] luts=1403, accuracy_bits=16.5, ffs=1431, throughput_msps=257, max_abs_err=1.08e-05 (2^-16.49), power_index=26.6
- pipelined [data_width=23 n_iter=20 angle_guard=0 frac_guard=1 rounding=round] luts=1595, accuracy_bits=17.7, ffs=1572, throughput_msps=257, max_abs_err=4.67e-06 (2^-17.71), power_index=29.8
- pipelined [data_width=21 n_iter=25 angle_guard=4 frac_guard=4 rounding=round] luts=2098, accuracy_bits=18.9, ffs=2054, throughput_msps=257, max_abs_err=2.06e-06 (2^-18.89), power_index=39
- pipelined [data_width=24 n_iter=25 angle_guard=1 frac_guard=2 rounding=round] luts=2155, accuracy_bits=19.8, ffs=2113, throughput_msps=257, max_abs_err=1.06e-06 (2^-19.84), power_index=40.1
Front coverage: luts 979..2155 (HV reference 4000); accuracy_bits 13.2..19.8 (HV reference 13); data_width on the front 18..25 (registry 8..28).

Per family:
- pipelined: 250 evals, 167 feasible; max throughput seen 282 MSPS; best accuracy 23.76 bits; best feasible luts=979; feasible ranges: data_width 17..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.75 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (23 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 238 feasible; hypervolume 1.743e+04 (+0.1%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the front is already feasible and non-improving: 238 feasible designs, 24 on the Pareto front, hypervolume 1.743e+04 with only +0.1% gain this round. The spec's selection rule (min luts) is satisfiable on the front: pipelined [data_width=19 n_iter=15 angle_guard=3 frac_guard=0 rounding=trunc] gives luts=979 with accuracy_bits=13.2 (max_abs_err=1.09e-04 <= 1.2207e-04) and throughput_msps=264 >= 250, so the design is valid on both constraints. The front spans luts 979..2155 and accuracy_bits 13.2..19.8, covering the accuracy objective's useful range above the 13-bit requirement, so coverage is adequate. The unexplored families cannot help the binding constraint: iterative/unrolled_k emit one result every N+3 or ceil(N/k)+3 cycles, so at any plausible Fmax their throughput falls far below the 250 MSPS requirement that already limits pipelined to 264 MSPS, and pipelined_m was measured infeasible (0/50 feasible, max throughput 171 MSPS). No further exploration is warranted.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.743e+04 (gain this round: +0.1%).
Feasible designs: 238 of 400 evaluations (205 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 29% violate; best seen 282
- max_abs_err <= 0.00012207: 22% violate; best seen 5.57e-08 (2^-24.10)

Pareto front (feasible, 24 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=3 frac_guard=0 rounding=trunc] luts=979, accuracy_bits=13.2, ffs=1014, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=18.7
- pipelined [data_width=19 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] luts=1067, accuracy_bits=13.9, ffs=1098, throughput_msps=264, max_abs_err=6.32e-05 (2^-13.95), power_index=20.4
- pipelined [data_width=21 n_iter=16 angle_guard=-1 frac_guard=1 rounding=round] luts=1156, accuracy_bits=14.4, ffs=1144, throughput_msps=264, max_abs_err=4.72e-05 (2^-14.37), power_index=21.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=1 rounding=trunc] luts=1185, accuracy_bits=15, ffs=1214, throughput_msps=264, max_abs_err=3.13e-05 (2^-14.96), power_index=22.6
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] luts=1270, accuracy_bits=15.6, ffs=1295, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.65), power_index=24.1
- pipelined [data_width=22 n_iter=18 angle_guard=2 frac_guard=0 rounding=trunc] luts=1331, accuracy_bits=15.9, ffs=1362, throughput_msps=257, max_abs_err=1.6e-05 (2^-15.93), power_index=25.3
- pipelined [data_width=22 n_iter=18 angle_guard=4 frac_guard=1 rounding=trunc] luts=1403, accuracy_bits=16.5, ffs=1431, throughput_msps=257, max_abs_err=1.08e-05 (2^-16.49), power_index=26.6
- pipelined [data_width=23 n_iter=20 angle_guard=2 frac_guard=1 rounding=trunc] luts=1587, accuracy_bits=17.9, ffs=1610, throughput_msps=257, max_abs_err=4.15e-06 (2^-17.88), power_index=30.1
- pipelined [data_width=25 n_iter=21 angle_guard=1 frac_guard=0 rounding=trunc] luts=1733, accuracy_bits=18.9, ffs=1759, throughput_msps=257, max_abs_err=2.11e-06 (2^-18.86), power_index=32.8
- pipelined [data_width=24 n_iter=25 angle_guard=1 frac_guard=2 rounding=round] luts=2155, accuracy_bits=19.8, ffs=2113, throughput_msps=257, max_abs_err=1.06e-06 (2^-19.84), power_index=40.1
Front coverage: luts 979..2155 (HV reference 4000); accuracy_bits 13.2..19.8 (HV reference 13); data_width on the front 18..25 (registry 8..28).

Per family:
- pipelined: 350 evals, 238 feasible; max throughput seen 282 MSPS; best accuracy 24.10 bits; best feasible luts=979; feasible ranges: data_width 17..26, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.75 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 14061 in, 8225 out
- provider-reported cost: $0.0113
- full prompts and replies: `llm_trace.jsonl`

