# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined:data_width=21,n_iter=15,angle_guard=-2,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 994 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 1029 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 19 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.08e-05 (2^-13.43) | exact: bit-accurate model, dense (128030 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 47.6 | exact: bit-accurate model, dense (128030 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.62e-05 (2^-15.22) | exact: bit-accurate model, dense (128030 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 13.8 | exact: bit-accurate model, dense (128030 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.4 | exact: bit-accurate model, dense (128030 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (22 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=21,n_iter=15,angle_guard=-2,frac_guard=0,rounding=round` | 994 | 1029 | 264.5 | 17 | 19 | 9.08e-05 (2^-13.43) | 13.43 |
| 1 | `pipelined:data_width=20,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 1023 | 1059 | 256.5 | 17 | 19.6 | 7.16e-05 (2^-13.77) | 13.77 |
| 2 | `pipelined:data_width=20,n_iter=16,angle_guard=0,frac_guard=0,rounding=trunc` | 1048 | 1082 | 264.5 | 18 | 20 | 6.06e-05 (2^-14.01) | 14.01 |
| 3 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 1104 | 1096 | 264.5 | 18 | 20.7 | 4.95e-05 (2^-14.30) | 14.30 |
| 4 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 1118 | 1149 | 264.5 | 19 | 21.3 | 4.23e-05 (2^-14.53) | 14.53 |
| 5 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1135 | 1166 | 264.5 | 19 | 21.6 | 3.32e-05 (2^-14.88) | 14.88 |
| 6 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1185 | 1218 | 264.5 | 19 | 22.6 | 2.44e-05 (2^-15.32) | 15.32 |
| 7 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 1219 | 1252 | 256.5 | 19 | 23.2 | 2.15e-05 (2^-15.50) | 15.50 |
| 8 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc` | 1287 | 1313 | 256.5 | 19 | 24.4 | 1.97e-05 (2^-15.63) | 15.63 |
| 9 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=1,rounding=round` | 1297 | 1284 | 256.5 | 19 | 24.3 | 1.95e-05 (2^-15.64) | 15.64 |
| 10 | `pipelined:data_width=20,n_iter=17,angle_guard=3,frac_guard=3,rounding=round` | 1312 | 1293 | 256.5 | 19 | 24.5 | 1.95e-05 (2^-15.64) | 15.64 |
| 11 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc` | 1313 | 1340 | 256.5 | 20 | 24.9 | 1.7e-05 (2^-15.85) | 15.85 |
| 12 | `pipelined:data_width=22,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc` | 1331 | 1362 | 256.5 | 20 | 25.3 | 1.6e-05 (2^-15.93) | 15.93 |
| 13 | `pipelined:data_width=22,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc` | 1367 | 1394 | 256.5 | 20 | 26 | 1.15e-05 (2^-16.41) | 16.41 |
| 14 | `pipelined:data_width=23,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc` | 1385 | 1417 | 256.5 | 20 | 26.3 | 1.07e-05 (2^-16.51) | 16.51 |
| 15 | `pipelined:data_width=22,n_iter=20,angle_guard=0,frac_guard=2,rounding=round` | 1573 | 1548 | 256.5 | 22 | 29.3 | 7.68e-06 (2^-16.99) | 16.99 |
| 16 | `pipelined:data_width=20,n_iter=20,angle_guard=3,frac_guard=4,rounding=round` | 1589 | 1560 | 256.5 | 22 | 29.6 | 5.85e-06 (2^-17.38) | 17.38 |
| 17 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=1,rounding=round` | 1593 | 1572 | 256.5 | 22 | 29.8 | 4.05e-06 (2^-17.91) | 17.91 |
| 18 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=2,rounding=round` | 1633 | 1608 | 256.5 | 22 | 30.5 | 3.33e-06 (2^-18.20) | 18.20 |
| 19 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=3,rounding=round` | 1673 | 1645 | 256.5 | 22 | 31.2 | 3.04e-06 (2^-18.33) | 18.33 |
| 20 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=4,rounding=round` | 1713 | 1681 | 256.5 | 22 | 31.9 | 2.9e-06 (2^-18.40) | 18.40 |
| 21 | `pipelined:data_width=23,n_iter=24,angle_guard=1,frac_guard=1,rounding=round` | 1944 | 1911 | 256.5 | 26 | 36.3 | 2.53e-06 (2^-18.59) | 18.59 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Throughput of at least 250 MSPS means one result per cycle at about 250 MHz or more. Iterative and unrolled_k give less than 1 result per cycle, so they would need an Fmax of 1 GHz or more and are excluded. Only the two pipelined families remain. An error of at most 2^-13 needs about 14 or more fractional output bits, so I search data_width 12-20 and n_iter 10-18, with the guard bits and rounding left open for the search to trade accuracy against LUTs. The first round splits the budget evenly and will show which family and m give the fewest LUTs, so later rounds can narrow.*)
- `pipelined` (50 evals): data_width=12..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle is guaranteed. Fmax should be comfortable at 250 MHz with one stage per rotation, so it is the safest family for the throughput constraint. Ranges cover the accuracy threshold of about 13 bits and a little above it for front coverage.
- `pipelined_m` (50 evals): data_width=12..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages can save flip-flops and may lower LUTs, since the registers are smaller. It still gives 1 result per cycle. Small m (2-4) keeps Fmax plausibly at or above 250 MHz.

**Result (code):** 100 evaluations this round, 100 total; 23 feasible; hypervolume 7821 (n/a).

**LLM decision:** `refine` — The throughput constraint of 250 MSPS at one sample per clock needs a family that delivers 1 result/cycle, so iterative and unrolled_k are ruled out. pipelined_m had 0 feasible designs out of 50, with a best throughput of only 171 MSPS, so only pipelined is viable. The pipelined front is feasible and spans luts 1017..1335 and accuracy_bits 13.2..15.8. The feasible designs sit in data_width 17..20 and n_iter 16..18, but 52% of evaluations violate the error limit and 50% violate throughput. I will narrow the search to that region, and stretch it slightly downward in width and iteration count to find cheaper designs near the 13-bit accuracy edge, and upward to extend the high-accuracy end. Wider datapaths start to lose Fmax: 257 MSPS at W=20 is close to the 250 limit.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7821 (gain this round: n/a (first round)).
Feasible designs: 23 of 100 evaluations (16 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 282
- max_abs_err <= 0.00012207: 52% violate; best seen 1.78e-05 (2^-15.78)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=16 angle_guard=-1 frac_guard=1 rounding=trunc] luts=1017, accuracy_bits=13.2, ffs=1045, throughput_msps=264, max_abs_err=0.000105 (2^-13.21), power_index=19.4
- pipelined [data_width=19 n_iter=16 angle_guard=-1 frac_guard=1 rounding=round] luts=1057, accuracy_bits=13.3, ffs=1047, throughput_msps=264, max_abs_err=0.000101 (2^-13.28), power_index=19.8
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1103, accuracy_bits=13.7, ffs=1092, throughput_msps=264, max_abs_err=7.36e-05 (2^-13.73), power_index=20.6
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1104, accuracy_bits=14.3, ffs=1096, throughput_msps=264, max_abs_err=4.95e-05 (2^-14.30), power_index=20.7
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1156, accuracy_bits=14.4, ffs=1143, throughput_msps=264, max_abs_err=4.73e-05 (2^-14.37), power_index=21.6
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1199, throughput_msps=264, max_abs_err=3.86e-05 (2^-14.66), power_index=22.3
- pipelined [data_width=19 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts=1188, accuracy_bits=14.7, ffs=1217, throughput_msps=264, max_abs_err=3.74e-05 (2^-14.71), power_index=22.6
- pipelined [data_width=20 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1312, accuracy_bits=15.6, ffs=1293, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=24.5
- pipelined [data_width=19 n_iter=18 angle_guard=3 frac_guard=3 rounding=round] luts=1335, accuracy_bits=15.8, ffs=1316, throughput_msps=264, max_abs_err=1.78e-05 (2^-15.78), power_index=24.9
Front coverage: luts 1017..1335 (HV reference 4000); accuracy_bits 13.2..15.8 (HV reference 13); data_width on the front 17..20 (registry 8..28).

Per family:
- pipelined: 50 evals, 23 feasible; max throughput seen 282 MSPS; best accuracy 15.78 bits; best feasible luts=1017; feasible ranges: data_width 17..20, n_iter 16..18, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.67 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the only feasible family around its feasible region, and probe lower-LUT corners that still reach at least 13 accuracy bits.*)
- `pipelined` (100 evals): data_width=15..21, n_iter=12..19, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only pipelined has met both constraints. Shrinking W and N slightly below the current feasible box may reduce LUTs while keeping error at or below 2^-13, and the upper edge extends the accuracy end of the front.

**Result (code):** 100 evaluations this round, 200 total; 67 feasible; hypervolume 9692 (+23.9%).

**LLM decision:** `refine` — Only pipelined is feasible: 67 of its 150 evals pass, and the front has 13 designs. pipelined_m has 0 feasible out of 50 and tops out at 171 MSPS against the 250 MSPS constraint. iterative and unrolled_k issue one result every several cycles, so they cannot reach 250 MSPS at one sample per clock. The front is still improving (+23.9% HV last round). It covers only luts 1017..1385 and accuracy_bits 13.2..16.4. The cheapest point (data_width 19, n_iter 16, 1017 LUTs, 13.2 bits) sits just above the 13-bit error limit, so a slightly lower data_width and n_iter may cut LUTs further. The next plan searches pipelined around the feasible region (data_width 16..22, n_iter 13..19) and extends upward to cover the high-accuracy end of the curve.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9692 (gain this round: +23.9%).
Feasible designs: 67 of 200 evaluations (43 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 282
- max_abs_err <= 0.00012207: 54% violate; best seen 1.12e-05 (2^-16.44)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=16 angle_guard=-1 frac_guard=1 rounding=trunc] luts=1017, accuracy_bits=13.2, ffs=1045, throughput_msps=264, max_abs_err=0.000105 (2^-13.21), power_index=19.4
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts=1048, accuracy_bits=14, ffs=1082, throughput_msps=264, max_abs_err=6.06e-05 (2^-14.01), power_index=20
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1118, accuracy_bits=14.5, ffs=1149, throughput_msps=264, max_abs_err=4.23e-05 (2^-14.53), power_index=21.3
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1199, throughput_msps=264, max_abs_err=3.86e-05 (2^-14.66), power_index=22.3
- pipelined [data_width=19 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts=1188, accuracy_bits=14.7, ffs=1217, throughput_msps=264, max_abs_err=3.74e-05 (2^-14.71), power_index=22.6
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc] luts=1202, accuracy_bits=15.1, ffs=1231, throughput_msps=264, max_abs_err=2.83e-05 (2^-15.11), power_index=22.9
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1219, accuracy_bits=15.5, ffs=1252, throughput_msps=257, max_abs_err=2.15e-05 (2^-15.50), power_index=23.2
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1297, accuracy_bits=15.6, ffs=1284, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=24.3
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] luts=1313, accuracy_bits=15.8, ffs=1340, throughput_msps=257, max_abs_err=1.7e-05 (2^-15.85), power_index=24.9
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] luts=1385, accuracy_bits=16.4, ffs=1404, throughput_msps=257, max_abs_err=1.12e-05 (2^-16.44), power_index=26.2
Front coverage: luts 1017..1385 (HV reference 4000); accuracy_bits 13.2..16.4 (HV reference 13); data_width on the front 19..21 (registry 8..28).

Per family:
- pipelined: 150 evals, 67 feasible; max throughput seen 282 MSPS; best accuracy 16.44 bits; best feasible luts=1017; feasible ranges: data_width 17..21, n_iter 16..18, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.67 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Throughput feasibility rules out the other families on the evidence so far. Focusing the whole budget on pipelined around its feasible region should lower the minimum LUTs and fill in the front.*)
- `pipelined` (40 evals): data_width=16..22, n_iter=13..19, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* It is the only family meeting 250 MSPS. The slightly lower data_width and n_iter bounds probe for cheaper designs near the 2^-13 error limit, and the upper bounds keep the high-accuracy end of the front covered.

**Result (code):** 40 evaluations this round, 240 total; 93 feasible; hypervolume 9865 (+1.8%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is allowed. The spec is feasible: 93 of 240 evaluations meet both constraints, and the front has 14 designs. The selected design (min luts) is pipelined with data_width=21, n_iter=15, angle_guard=-2, frac_guard=0 and rounding=round. It uses 994 LUTs, reaches 13.4 accuracy bits (max error 9.08e-05, inside the 1.22e-04 limit) and delivers 264 MSPS against the 250 requirement. The last round's hypervolume gain was only +1.8%, which is below diminishing-returns territory for the remaining budget. pipelined_m produced 0 feasible designs, with throughput capped at 171 MSPS. iterative and unrolled_k produce one result every several cycles, so they cannot meet one sample per clock at 250 MSPS.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9865 (gain this round: +1.8%).
Feasible designs: 93 of 240 evaluations (61 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 21% violate; best seen 282
- max_abs_err <= 0.00012207: 51% violate; best seen 1.08e-05 (2^-16.50)

Pareto front (feasible, 14 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=21 n_iter=15 angle_guard=-2 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.4, ffs=1029, throughput_msps=264, max_abs_err=9.08e-05 (2^-13.43), power_index=19
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts=1048, accuracy_bits=14, ffs=1082, throughput_msps=264, max_abs_err=6.06e-05 (2^-14.01), power_index=20
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1118, accuracy_bits=14.5, ffs=1149, throughput_msps=264, max_abs_err=4.23e-05 (2^-14.53), power_index=21.3
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1199, throughput_msps=264, max_abs_err=3.86e-05 (2^-14.66), power_index=22.3
- pipelined [data_width=20 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1191, accuracy_bits=14.8, ffs=1215, throughput_msps=257, max_abs_err=3.59e-05 (2^-14.77), power_index=22.6
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1192, accuracy_bits=14.9, ffs=1181, throughput_msps=264, max_abs_err=3.23e-05 (2^-14.92), power_index=22.3
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1219, accuracy_bits=15.5, ffs=1252, throughput_msps=257, max_abs_err=2.15e-05 (2^-15.50), power_index=23.2
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1297, accuracy_bits=15.6, ffs=1284, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=24.3
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] luts=1313, accuracy_bits=15.8, ffs=1340, throughput_msps=257, max_abs_err=1.7e-05 (2^-15.85), power_index=24.9
- pipelined [data_width=22 n_iter=18 angle_guard=3 frac_guard=1 rounding=trunc] luts=1385, accuracy_bits=16.5, ffs=1412, throughput_msps=257, max_abs_err=1.08e-05 (2^-16.50), power_index=26.3
Front coverage: luts 994..1385 (HV reference 4000); accuracy_bits 13.4..16.5 (HV reference 13); data_width on the front 19..22 (registry 8..28).

Per family:
- pipelined: 190 evals, 93 feasible; max throughput seen 282 MSPS; best accuracy 16.50 bits; best feasible luts=994; feasible ranges: data_width 17..22, n_iter 15..19, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.67 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (160 evals): data_width=18..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (14 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 199 feasible; hypervolume 1.486e+04 (+50.6%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is allowed. The spec is feasible: 93 of 240 evaluations meet both constraints, and the front has 14 designs. The selected design (min luts) is pipelined with data_width=21, n_iter=15, angle_guard=-2, frac_guard=0 and rounding=round. It uses 994 LUTs, reaches 13.4 accuracy bits (max error 9.08e-05, inside the 1.22e-04 limit) and delivers 264 MSPS against the 250 requirement. The last round's hypervolume gain was only +1.8%, which is below diminishing-returns territory for the remaining budget. pipelined_m produced 0 feasible designs, with throughput capped at 171 MSPS. iterative and unrolled_k produce one result every several cycles, so they cannot meet one sample per clock at 250 MSPS.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.486e+04 (gain this round: +50.6%).
Feasible designs: 199 of 400 evaluations (149 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 22% violate; best seen 282
- max_abs_err <= 0.00012207: 36% violate; best seen 8.54e-08 (2^-23.48)

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=21 n_iter=15 angle_guard=-2 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.4, ffs=1029, throughput_msps=264, max_abs_err=9.08e-05 (2^-13.43), power_index=19
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts=1048, accuracy_bits=14, ffs=1082, throughput_msps=264, max_abs_err=6.06e-05 (2^-14.01), power_index=20
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] luts=1135, accuracy_bits=14.9, ffs=1166, throughput_msps=264, max_abs_err=3.32e-05 (2^-14.88), power_index=21.6
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1219, accuracy_bits=15.5, ffs=1252, throughput_msps=257, max_abs_err=2.15e-05 (2^-15.50), power_index=23.2
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1297, accuracy_bits=15.6, ffs=1284, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=24.3
- pipelined [data_width=22 n_iter=18 angle_guard=2 frac_guard=0 rounding=trunc] luts=1331, accuracy_bits=15.9, ffs=1362, throughput_msps=257, max_abs_err=1.6e-05 (2^-15.93), power_index=25.3
- pipelined [data_width=23 n_iter=18 angle_guard=2 frac_guard=0 rounding=trunc] luts=1385, accuracy_bits=16.5, ffs=1417, throughput_msps=257, max_abs_err=1.07e-05 (2^-16.51), power_index=26.3
- pipelined [data_width=20 n_iter=20 angle_guard=3 frac_guard=4 rounding=round] luts=1589, accuracy_bits=17.4, ffs=1560, throughput_msps=257, max_abs_err=5.85e-06 (2^-17.38), power_index=29.6
- pipelined [data_width=22 n_iter=20 angle_guard=3 frac_guard=3 rounding=round] luts=1673, accuracy_bits=18.3, ffs=1645, throughput_msps=257, max_abs_err=3.04e-06 (2^-18.33), power_index=31.2
- pipelined [data_width=23 n_iter=24 angle_guard=1 frac_guard=1 rounding=round] luts=1944, accuracy_bits=18.6, ffs=1911, throughput_msps=257, max_abs_err=2.53e-06 (2^-18.59), power_index=36.3
Front coverage: luts 994..1944 (HV reference 4000); accuracy_bits 13.4..18.6 (HV reference 13); data_width on the front 19..23 (registry 8..28).

Per family:
- pipelined: 350 evals, 199 feasible; max throughput seen 282 MSPS; best accuracy 23.48 bits; best feasible luts=994; feasible ranges: data_width 17..26, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.67 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19268 in, 3843 out
- provider-reported cost: $0.0770
- full prompts and replies: `llm_trace.jsonl`

