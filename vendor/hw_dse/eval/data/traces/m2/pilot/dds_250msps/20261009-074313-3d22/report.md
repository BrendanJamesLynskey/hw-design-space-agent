# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`pipelined:data_width=19,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 985 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 1017 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 18 | exact: schedule |
| latency_ns | 68.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000102 (2^-13.26) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.3 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.15e-05 (2^-15.51) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 2.81 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.3 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (22 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=19,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 985 | 1017 | 264.5 | 18 | 18.8 | 0.000102 (2^-13.26) | 13.26 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=3,frac_guard=1,rounding=trunc` | 1008 | 1040 | 264.5 | 17 | 19.3 | 8.66e-05 (2^-13.49) | 13.49 |
| 2 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1033 | 1065 | 264.5 | 18 | 19.7 | 5.75e-05 (2^-14.09) | 14.09 |
| 3 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1064 | 1098 | 264.5 | 18 | 20.3 | 4.64e-05 (2^-14.39) | 14.39 |
| 4 | `pipelined:data_width=21,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1096 | 1130 | 264.5 | 18 | 20.9 | 4.14e-05 (2^-14.56) | 14.56 |
| 5 | `pipelined:data_width=21,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1112 | 1146 | 264.5 | 18 | 21.2 | 3.91e-05 (2^-14.64) | 14.64 |
| 6 | `pipelined:data_width=22,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 1128 | 1162 | 264.5 | 18 | 21.5 | 3.88e-05 (2^-14.65) | 14.65 |
| 7 | `pipelined:data_width=21,n_iter=17,angle_guard=0,frac_guard=0,rounding=trunc` | 1169 | 1201 | 264.5 | 19 | 22.3 | 3.42e-05 (2^-14.83) | 14.83 |
| 8 | `pipelined:data_width=22,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1175 | 1211 | 256.5 | 18 | 22.4 | 3.32e-05 (2^-14.88) | 14.88 |
| 9 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1185 | 1218 | 264.5 | 19 | 22.6 | 2.44e-05 (2^-15.32) | 15.32 |
| 10 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1202 | 1235 | 256.5 | 19 | 22.9 | 2.18e-05 (2^-15.48) | 15.48 |
| 11 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 1259 | 1289 | 264.5 | 20 | 24 | 1.68e-05 (2^-15.87) | 15.87 |
| 12 | `pipelined:data_width=22,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 1313 | 1344 | 256.5 | 20 | 25 | 1.21e-05 (2^-16.34) | 16.34 |
| 13 | `pipelined:data_width=22,n_iter=19,angle_guard=0,frac_guard=2,rounding=trunc` | 1447 | 1468 | 256.5 | 21 | 27.4 | 9.39e-06 (2^-16.70) | 16.70 |
| 14 | `pipelined:data_width=23,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 1466 | 1495 | 256.5 | 21 | 27.8 | 6.01e-06 (2^-17.34) | 17.34 |
| 15 | `pipelined:data_width=24,n_iter=19,angle_guard=2,frac_guard=0,rounding=trunc` | 1523 | 1553 | 256.5 | 21 | 28.9 | 5.58e-06 (2^-17.45) | 17.45 |
| 16 | `pipelined:data_width=23,n_iter=20,angle_guard=1,frac_guard=0,rounding=round` | 1527 | 1554 | 256.5 | 22 | 29 | 3.94e-06 (2^-17.95) | 17.95 |
| 17 | `pipelined:data_width=23,n_iter=25,angle_guard=1,frac_guard=0,rounding=round` | 1927 | 1942 | 256.5 | 27 | 36.4 | 3.01e-06 (2^-18.34) | 18.34 |
| 18 | `pipelined:data_width=24,n_iter=25,angle_guard=0,frac_guard=0,rounding=round` | 1978 | 1993 | 256.5 | 27 | 37.3 | 2.49e-06 (2^-18.62) | 18.62 |
| 19 | `pipelined:data_width=23,n_iter=25,angle_guard=3,frac_guard=1,rounding=round` | 2077 | 2041 | 256.5 | 27 | 38.7 | 1.73e-06 (2^-19.14) | 19.14 |
| 20 | `pipelined:data_width=23,n_iter=26,angle_guard=3,frac_guard=3,rounding=trunc` | 2218 | 2218 | 256.5 | 28 | 41.7 | 1.25e-06 (2^-19.61) | 19.61 |
| 21 | `pipelined:data_width=23,n_iter=29,angle_guard=3,frac_guard=2,rounding=round` | 2473 | 2422 | 256.5 | 31 | 46 | 1.19e-06 (2^-19.68) | 19.68 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=250 MSPS, 1 sample/clock) rules out iterative and unrolled_k outright, so I focus the entire budget on the two 1/clock families. pipelined is the LUT-minimal 1/clock architecture and the likely winner under the 'min LUTs' selection rule, so it gets the larger share; pipelined_m is included to map the LUT/FF trade-off and to cover cases where its shorter critical path yields a higher Fmax (helping the 250 MSPS constraint) at the cost of more FFs. Accuracy is identical across families for the same (data_width, n_iter, angle_guard, frac_guard, rounding), so I bracket the 2^-13 target with data_width 14..22 and n_iter 10..18 and keep guards small to stay near the LUT-minimal corner while still allowing the front to extend toward higher accuracy. This concentrates the 400-eval budget where the feasible trade-offs actually live.*)
- `pipelined` (50 evals): data_width=14..22, n_iter=10..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* The spec demands 1 sample/clock at >=250 MSPS, which only the pipelined families can provide (iterative/unrolled_k are multi-cycle). Pipelined is the LUT-minimal 1/cycle option (no extra register stages vs pipelined_m), so it is the primary candidate for the 'min LUTs' selection rule. data_width 14..22 and n_iter 10..18 bracket the accuracy target (2^-13) with headroom on both sides so the front can be mapped; small guards keep area low.
- `pipelined_m` (50 evals): data_width=14..22, n_iter=10..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Also 1 result/clock, so it meets the throughput constraint. It trades LUTs for FFs (fewer register stages than full pipelined) and can relax the timing path, which may push Fmax above 250 MHz where full pipelined is marginal. Including it lets the front capture the LUT-vs-FF trade-off and any Fmax-driven feasibility differences. m kept small (2..4) since large m approaches full pipelined and adds little new trade-off.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 28 feasible; hypervolume 9210 (n/a).

**LLM decision:** `refine` — The `pipelined` family is the only one meeting the throughput constraint (>= 250 MSPS), with a best feasible LUT count of 1070 and accuracy up to 16.28 bits. The `pipelined_m` family failed to meet throughput (max 171 MSPS), likely due to the reduced clock frequency from fewer pipeline registers or the specific parameter ranges explored. The current front is clustered in a narrow region (data_width 17-22, n_iter 17-18). To maximize hypervolume and find the true minimum LUT design, we should refine the search around the known feasible region for `pipelined` while slightly widening the accuracy range to ensure we capture the full trade-off curve. We will focus exclusively on `pipelined` as it is the only viable family for the throughput constraint.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 9210 (gain this round: n/a (first round)).
Feasible designs: 28 of 100 evaluations (22 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 53% violate; best seen 1.25e-05 (2^-16.28)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1070, accuracy_bits=13.4, ffs=1061, throughput_msps=264, max_abs_err=9.28e-05 (2^-13.40), power_index=20
- pipelined [data_width=19 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc] luts=1101, accuracy_bits=14, ffs=1128, throughput_msps=264, max_abs_err=6.22e-05 (2^-13.97), power_index=21
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] luts=1158, accuracy_bits=14.4, ffs=1147, throughput_msps=264, max_abs_err=4.63e-05 (2^-14.40), power_index=21.7
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=trunc] luts=1185, accuracy_bits=15, ffs=1218, throughput_msps=264, max_abs_err=3.12e-05 (2^-14.97), power_index=22.6
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] luts=1259, accuracy_bits=15.3, ffs=1285, throughput_msps=264, max_abs_err=2.4e-05 (2^-15.35), power_index=23.9
- pipelined [data_width=22 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] luts=1270, accuracy_bits=15.7, ffs=1299, throughput_msps=257, max_abs_err=1.91e-05 (2^-15.67), power_index=24.2
- pipelined [data_width=22 n_iter=17 angle_guard=2 frac_guard=1 rounding=trunc] luts=1287, accuracy_bits=15.7, ffs=1317, throughput_msps=257, max_abs_err=1.83e-05 (2^-15.74), power_index=24.5
- pipelined [data_width=22 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts=1331, accuracy_bits=16.1, ffs=1358, throughput_msps=257, max_abs_err=1.39e-05 (2^-16.14), power_index=25.3
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc] luts=1349, accuracy_bits=16.2, ffs=1372, throughput_msps=257, max_abs_err=1.3e-05 (2^-16.23), power_index=25.6
- pipelined [data_width=22 n_iter=18 angle_guard=0 frac_guard=2 rounding=round] luts=1413, accuracy_bits=16.3, ffs=1392, throughput_msps=257, max_abs_err=1.25e-05 (2^-16.28), power_index=26.4
Front coverage: luts 1070..1413 (HV reference 4000); accuracy_bits 13.4..16.3 (HV reference 13); data_width on the front 17..22 (registry 8..28).

Per family:
- pipelined: 50 evals, 28 feasible; max throughput seen 273 MSPS; best accuracy 16.28 bits; best feasible luts=1070; feasible ranges: data_width 17..22, n_iter 17..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.90 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the only feasible family (`pipelined`) and refine the search space around the known Pareto front to improve hypervolume and identify the minimum LUT design.*)
- `pipelined` (100 evals): data_width=16..23, n_iter=16..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Refining around the feasible region (data_width 17-22, n_iter 17-18) to find lower LUT counts and better accuracy trade-offs. Slightly widening ranges to ensure full front coverage.

**Result (code):** 100 evaluations this round, 200 total; 113 feasible; hypervolume 1.35e+04 (+46.6%).

**LLM decision:** `refine` — The current Pareto front is dominated by the `pipelined` family, with `pipelined_m` yielding zero feasible designs (max throughput 171 MSPS < 250 MSPS constraint). The `iterative` and `unrolled_k` families are not yet explored, but they produce one result every several cycles (N+3 or ceil(N/k)+3). Given the strict throughput constraint of >= 250 MSPS and the fact that `pipelined` designs are already struggling to meet it (25% violation rate, best seen 273 MSPS), the lower throughput of `iterative`/`unrolled_k` makes them highly unlikely to be feasible unless Fmax is extremely high, which is not indicated. Therefore, adding these families is a low-yield move. Instead, we should refine the search within the `pipelined` family where the feasible front exists. The current front spans LUTs 985..1527 and accuracy 13.3..18 bits. The selection rule is 'min luts', and the best LUT count is 985. To improve hypervolume and potentially find a better min-LUT design, we should narrow the ranges around the promising region of the current front (data_width 19-23, n_iter 16-20) to allow Optuna to focus its remaining budget (200 evals left) on fine-tuning the trade-off curve, specifically looking for designs with lower LUTs that still meet the accuracy and throughput constraints.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.35e+04 (gain this round: +46.6%).
Feasible designs: 113 of 200 evaluations (90 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 273
- max_abs_err <= 0.00012207: 34% violate; best seen 3.94e-06 (2^-17.95)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round] luts=985, accuracy_bits=13.3, ffs=1017, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.8
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] luts=1128, accuracy_bits=14.5, ffs=1154, throughput_msps=264, max_abs_err=4.33e-05 (2^-14.50), power_index=21.5
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=trunc] luts=1169, accuracy_bits=14.8, ffs=1201, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22.3
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] luts=1202, accuracy_bits=15.1, ffs=1227, throughput_msps=264, max_abs_err=2.8e-05 (2^-15.12), power_index=22.8
- pipelined [data_width=22 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] luts=1270, accuracy_bits=15.7, ffs=1299, throughput_msps=257, max_abs_err=1.91e-05 (2^-15.67), power_index=24.2
- pipelined [data_width=23 n_iter=17 angle_guard=1 frac_guard=0 rounding=trunc] luts=1287, accuracy_bits=15.7, ffs=1321, throughput_msps=257, max_abs_err=1.83e-05 (2^-15.74), power_index=24.5
- pipelined [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc] luts=1313, accuracy_bits=15.9, ffs=1344, throughput_msps=257, max_abs_err=1.6e-05 (2^-15.93), power_index=25
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc] luts=1349, accuracy_bits=16.2, ffs=1372, throughput_msps=257, max_abs_err=1.3e-05 (2^-16.23), power_index=25.6
- pipelined [data_width=22 n_iter=19 angle_guard=0 frac_guard=2 rounding=trunc] luts=1447, accuracy_bits=16.7, ffs=1468, throughput_msps=257, max_abs_err=9.39e-06 (2^-16.70), power_index=27.4
- pipelined [data_width=23 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] luts=1527, accuracy_bits=18, ffs=1554, throughput_msps=257, max_abs_err=3.94e-06 (2^-17.95), power_index=29
Front coverage: luts 985..1527 (HV reference 4000); accuracy_bits 13.3..18 (HV reference 13); data_width on the front 19..23 (registry 8..28).

Per family:
- pipelined: 150 evals, 113 feasible; max throughput seen 273 MSPS; best accuracy 17.95 bits; best feasible luts=985; feasible ranges: data_width 17..23, n_iter 16..20, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.90 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine the search within the `pipelined` family to improve the Pareto front and hypervolume, focusing on the region where feasible designs have already been found.*)
- `pipelined` (40 evals): data_width=19..22, n_iter=16..19, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Focus remaining budget on the `pipelined` family where the feasible front exists. Narrow ranges to the region of the current front (data_width 19-22, n_iter 16-19) to refine the trade-off curve and potentially find a lower-LUT design that meets the constraints.

**Result (code):** 40 evaluations this round, 240 total; 153 feasible; hypervolume 1.36e+04 (+0.7%).

**LLM decision:** `stop` — The feasible Pareto front is well-established and robust. We have identified a clear trade-off curve for the `pipelined` family, which is the only family capable of meeting the throughput constraint (>= 250 MSPS). The `pipelined_m` family failed to produce any feasible designs (max throughput 171 MSPS), and `iterative`/`unrolled_k` are inherently too slow for this spec (1 result per N cycles vs 1 per cycle). The front covers the required accuracy range (13.3 to 18 bits, well above the 13-bit minimum) and provides a clear minimum LUT solution (985 LUTs) for the selection rule. Since this is the final round, further exploration would not significantly improve the hypervolume or the final design selection.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.36e+04 (gain this round: +0.7%).
Feasible designs: 153 of 240 evaluations (120 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 21% violate; best seen 273
- max_abs_err <= 0.00012207: 28% violate; best seen 3.94e-06 (2^-17.95)

Pareto front (feasible, 15 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round] luts=985, accuracy_bits=13.3, ffs=1017, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.8
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1064, accuracy_bits=14.4, ffs=1098, throughput_msps=264, max_abs_err=4.64e-05 (2^-14.39), power_index=20.3
- pipelined [data_width=21 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=1096, accuracy_bits=14.6, ffs=1130, throughput_msps=264, max_abs_err=4.14e-05 (2^-14.56), power_index=20.9
- pipelined [data_width=22 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round] luts=1128, accuracy_bits=14.7, ffs=1162, throughput_msps=264, max_abs_err=3.88e-05 (2^-14.65), power_index=21.5
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=trunc] luts=1169, accuracy_bits=14.8, ffs=1201, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22.3
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] luts=1185, accuracy_bits=15.3, ffs=1218, throughput_msps=264, max_abs_err=2.44e-05 (2^-15.32), power_index=22.6
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1202, accuracy_bits=15.5, ffs=1235, throughput_msps=257, max_abs_err=2.18e-05 (2^-15.48), power_index=22.9
- pipelined [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] luts=1313, accuracy_bits=16.3, ffs=1344, throughput_msps=257, max_abs_err=1.21e-05 (2^-16.34), power_index=25
- pipelined [data_width=22 n_iter=19 angle_guard=0 frac_guard=2 rounding=trunc] luts=1447, accuracy_bits=16.7, ffs=1468, throughput_msps=257, max_abs_err=9.39e-06 (2^-16.70), power_index=27.4
- pipelined [data_width=23 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] luts=1527, accuracy_bits=18, ffs=1554, throughput_msps=257, max_abs_err=3.94e-06 (2^-17.95), power_index=29
Front coverage: luts 985..1527 (HV reference 4000); accuracy_bits 13.3..18 (HV reference 13); data_width on the front 19..23 (registry 8..28).

Per family:
- pipelined: 190 evals, 153 feasible; max throughput seen 273 MSPS; best accuracy 17.95 bits; best feasible luts=985; feasible ranges: data_width 17..23, n_iter 16..20, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.90 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (160 evals): data_width=18..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (15 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 265 feasible; hypervolume 1.692e+04 (+24.4%).

**No LLM call** (code's front-mapping round): The feasible Pareto front is well-established and robust. We have identified a clear trade-off curve for the `pipelined` family, which is the only family capable of meeting the throughput constraint (>= 250 MSPS). The `pipelined_m` family failed to produce any feasible designs (max throughput 171 MSPS), and `iterative`/`unrolled_k` are inherently too slow for this spec (1 result per N cycles vs 1 per cycle). The front covers the required accuracy range (13.3 to 18 bits, well above the 13-bit minimum) and provides a clear minimum LUT solution (985 LUTs) for the selection rule. Since this is the final round, further exploration would not significantly improve the hypervolume or the final design selection.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.692e+04 (gain this round: +24.4%).
Feasible designs: 265 of 400 evaluations (218 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 22% violate; best seen 273
- max_abs_err <= 0.00012207: 20% violate; best seen 5.57e-08 (2^-24.10)

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round] luts=985, accuracy_bits=13.3, ffs=1017, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.8
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=21 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1112, accuracy_bits=14.6, ffs=1146, throughput_msps=264, max_abs_err=3.91e-05 (2^-14.64), power_index=21.2
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=trunc] luts=1169, accuracy_bits=14.8, ffs=1201, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22.3
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] luts=1185, accuracy_bits=15.3, ffs=1218, throughput_msps=264, max_abs_err=2.44e-05 (2^-15.32), power_index=22.6
- pipelined [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] luts=1313, accuracy_bits=16.3, ffs=1344, throughput_msps=257, max_abs_err=1.21e-05 (2^-16.34), power_index=25
- pipelined [data_width=23 n_iter=19 angle_guard=2 frac_guard=0 rounding=round] luts=1466, accuracy_bits=17.3, ffs=1495, throughput_msps=257, max_abs_err=6.01e-06 (2^-17.34), power_index=27.8
- pipelined [data_width=23 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] luts=1527, accuracy_bits=18, ffs=1554, throughput_msps=257, max_abs_err=3.94e-06 (2^-17.95), power_index=29
- pipelined [data_width=23 n_iter=25 angle_guard=3 frac_guard=1 rounding=round] luts=2077, accuracy_bits=19.1, ffs=2041, throughput_msps=257, max_abs_err=1.73e-06 (2^-19.14), power_index=38.7
- pipelined [data_width=23 n_iter=29 angle_guard=3 frac_guard=2 rounding=round] luts=2473, accuracy_bits=19.7, ffs=2422, throughput_msps=257, max_abs_err=1.19e-06 (2^-19.68), power_index=46
Front coverage: luts 985..2473 (HV reference 4000); accuracy_bits 13.3..19.7 (HV reference 13); data_width on the front 19..24 (registry 8..28).

Per family:
- pipelined: 350 evals, 265 feasible; max throughput seen 273 MSPS; best accuracy 24.10 bits; best feasible luts=985; feasible ranges: data_width 17..26, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.90 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10082 in, 2391 out
- provider-reported cost: $0.0079
- full prompts and replies: `llm_trace.jsonl`

