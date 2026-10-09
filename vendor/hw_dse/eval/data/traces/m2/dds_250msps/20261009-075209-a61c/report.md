# DSE run: dds_250msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
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
`pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 979 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 1006 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.49e-05 (2^-13.36) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.22 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.73e-05 (2^-15.16) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.79 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.4 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 979 | 1006 | 264.5 | 17 | 18.7 | 9.49e-05 (2^-13.36) | 13.36 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 994 | 1025 | 264.5 | 17 | 19 | 9.41e-05 (2^-13.38) | 13.38 |
| 2 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 1023 | 1055 | 264.5 | 17 | 19.5 | 7.76e-05 (2^-13.65) | 13.65 |
| 3 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1033 | 1065 | 264.5 | 18 | 19.7 | 5.75e-05 (2^-14.09) | 14.09 |
| 4 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=2,rounding=round` | 1120 | 1108 | 264.5 | 18 | 21 | 5.03e-05 (2^-14.28) | 14.28 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1136 | 1124 | 264.5 | 18 | 21.3 | 4.29e-05 (2^-14.51) | 14.51 |
| 6 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc` | 1169 | 1197 | 264.5 | 19 | 22.2 | 3.57e-05 (2^-14.78) | 14.78 |
| 7 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc` | 1202 | 1227 | 264.5 | 19 | 22.8 | 2.8e-05 (2^-15.12) | 15.12 |
| 8 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 1209 | 1195 | 264.5 | 19 | 22.6 | 2.76e-05 (2^-15.14) | 15.14 |
| 9 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc` | 1219 | 1244 | 264.5 | 19 | 23.2 | 2.57e-05 (2^-15.25) | 15.25 |
| 10 | `pipelined:data_width=22,n_iter=17,angle_guard=-1,frac_guard=1,rounding=trunc` | 1236 | 1265 | 256.5 | 19 | 23.5 | 2.39e-05 (2^-15.36) | 15.36 |
| 11 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=round` | 1244 | 1229 | 264.5 | 19 | 23.3 | 2.32e-05 (2^-15.40) | 15.40 |
| 12 | `pipelined:data_width=22,n_iter=18,angle_guard=3,frac_guard=0,rounding=round` | 1349 | 1380 | 256.5 | 20 | 25.7 | 1.1e-05 (2^-16.47) | 16.47 |
| 13 | `pipelined:data_width=23,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc` | 1385 | 1412 | 256.5 | 20 | 26.3 | 1.03e-05 (2^-16.57) | 16.57 |
| 14 | `pipelined:data_width=22,n_iter=18,angle_guard=3,frac_guard=2,rounding=trunc` | 1420 | 1445 | 256.5 | 20 | 26.9 | 9.83e-06 (2^-16.63) | 16.63 |
| 15 | `pipelined:data_width=24,n_iter=19,angle_guard=-1,frac_guard=0,rounding=trunc` | 1466 | 1495 | 256.5 | 21 | 27.8 | 6.73e-06 (2^-17.18) | 17.18 |
| 16 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=0,rounding=round` | 1507 | 1534 | 256.5 | 22 | 28.6 | 5.85e-06 (2^-17.38) | 17.38 |
| 17 | `pipelined:data_width=26,n_iter=19,angle_guard=-1,frac_guard=0,rounding=trunc` | 1580 | 1610 | 256.5 | 21 | 30 | 4.39e-06 (2^-17.80) | 17.80 |
| 18 | `pipelined:data_width=25,n_iter=20,angle_guard=-1,frac_guard=0,rounding=round` | 1607 | 1634 | 256.5 | 22 | 30.5 | 3.51e-06 (2^-18.12) | 18.12 |
| 19 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=2,rounding=round` | 1633 | 1608 | 256.5 | 22 | 30.5 | 3.33e-06 (2^-18.20) | 18.20 |
| 20 | `pipelined:data_width=25,n_iter=20,angle_guard=1,frac_guard=0,rounding=round` | 1647 | 1675 | 256.5 | 22 | 31.2 | 2.69e-06 (2^-18.50) | 18.50 |
| 21 | `pipelined:data_width=25,n_iter=23,angle_guard=-1,frac_guard=0,rounding=round` | 1860 | 1880 | 256.5 | 25 | 35.2 | 2e-06 (2^-18.93) | 18.93 |
| 22 | `pipelined:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=trunc` | 1953 | 1968 | 256.5 | 25 | 36.9 | 9.48e-07 (2^-20.01) | 20.01 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=250 MSPS) eliminates iterative and unrolled_k families, which produce one result every several cycles. Only pipelined and pipelined_m achieve 1 result/cycle. For accuracy <= 2^-13, N=12-20 iterations with W=14-20 should suffice (CORDIC error ~2^-(N+1) for the rotation part, plus quantization). I focus budget on these two families: pipelined as the baseline, and pipelined_m to explore FF reduction and potential Fmax gains that could enable smaller data_width or fewer iterations while staying within area. The trade-off space is primarily LUTs (driven by W and N) vs accuracy_bits (driven by N, W, guards, rounding). angle_guard and frac_guard are kept small (0-2) to minimize area while preserving accuracy margin. Rounding is included as a discrete choice since it affects both accuracy and LUT count (rounding logic adds area).*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Mandatory for >=250 MSPS (1 result/cycle). N=12-20 covers the accuracy requirement (2^-13) with margin; W=14-20 balances area vs accuracy. This is the primary feasible family.
- `pipelined_m` (50 evals): data_width=14..20, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Also 1 result/cycle, so meets throughput. Registering every m stages reduces FF count and may improve Fmax vs fully pipelined, potentially lowering LUTs+FFs area proxy. m=2-4 keeps latency reasonable while cutting register overhead.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 27 feasible; hypervolume 7664 (n/a).

**LLM decision:** `add_family` — The current front is dominated by `pipelined` designs, which are constrained by the throughput requirement (>= 250 MSPS) to a narrow region of data_width 19-20 and n_iter 15-20. The `pipelined_m` family failed to meet the throughput constraint (max 171 MSPS), likely due to the reduced clock frequency from the wider datapaths required for higher accuracy. However, `iterative` and `unrolled_k` have not been explored. While `iterative` has a throughput of 1 result per N+3 cycles, it might achieve a much higher Fmax due to its simpler, shared datapath and lower area, potentially satisfying the 250 MSPS constraint with a much smaller area (lower LUTs) than the pipelined versions. Similarly, `unrolled_k` with a high k (e.g., 8) might offer a throughput of 1 result per ~4-5 cycles, which could also meet the constraint if the Fmax is high enough. Exploring these families is necessary to find the true Pareto front, especially in the low-LUT region where pipelined designs are currently expensive.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7664 (gain this round: n/a (first round)).
Feasible designs: 27 of 100 evaluations (22 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 46% violate; best seen 1.11e-05 (2^-16.46)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts=994, accuracy_bits=13.4, ffs=1025, throughput_msps=264, max_abs_err=9.41e-05 (2^-13.38), power_index=19
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts=1023, accuracy_bits=13.7, ffs=1055, throughput_msps=264, max_abs_err=7.76e-05 (2^-13.65), power_index=19.5
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1120, accuracy_bits=14.3, ffs=1108, throughput_msps=264, max_abs_err=5.03e-05 (2^-14.28), power_index=21
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1136, accuracy_bits=14.5, ffs=1124, throughput_msps=264, max_abs_err=4.29e-05 (2^-14.51), power_index=21.3
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] luts=1202, accuracy_bits=15.1, ffs=1227, throughput_msps=264, max_abs_err=2.8e-05 (2^-15.12), power_index=22.8
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1209, accuracy_bits=15.1, ffs=1195, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] luts=1219, accuracy_bits=15.2, ffs=1244, throughput_msps=264, max_abs_err=2.57e-05 (2^-15.25), power_index=23.2
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] luts=1244, accuracy_bits=15.4, ffs=1229, throughput_msps=264, max_abs_err=2.32e-05 (2^-15.40), power_index=23.3
- pipelined [data_width=19 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] luts=1354, accuracy_bits=15.7, ffs=1336, throughput_msps=264, max_abs_err=1.92e-05 (2^-15.67), power_index=25.3
Front coverage: luts 994..1354 (HV reference 4000); accuracy_bits 13.4..15.7 (HV reference 13); data_width on the front 19..20 (registry 8..28).

Per family:
- pipelined: 50 evals, 27 feasible; max throughput seen 273 MSPS; best accuracy 15.67 bits; best feasible luts=994; feasible ranges: data_width 18..20, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.46 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The current front is limited to pipelined designs. Iterative and unrolled_k are unexplored and may offer better area/throughput trade-offs due to their simpler or more parallel structures, potentially finding designs with lower LUT counts that still meet the 250 MSPS constraint.*)
- `iterative` (50 evals): data_width=18..22, n_iter=14..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Iterative has a simple shared datapath, likely leading to a much higher Fmax and lower area than pipelined. It may meet the 250 MSPS throughput constraint with fewer LUTs, potentially dominating the current front in the low-area region.
- `unrolled_k` (50 evals): data_width=18..22, n_iter=14..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Unrolled_k with high k (4-8) reduces the latency to ~4-5 cycles, which might allow a high enough Fmax to meet the 250 MSPS throughput constraint while offering a different area/accuracy trade-off than pipelined.

**Result (code):** 100 evaluations this round, 200 total; 27 feasible; hypervolume 7664 (+0.0%).

**LLM decision:** `refine` — The `pipelined` family is the only one meeting the throughput constraint (>= 250 MSPS), with a best observed throughput of 273 MSPS. The `pipelined_m` family failed to meet throughput (max 171 MSPS), and `iterative`/`unrolled_k` are far below the requirement. The current Pareto front is dominated by `pipelined` designs with `data_width` 19-20 and `n_iter` 15-20. To maximize hypervolume and find the true minimum LUT design, we should narrow the search space to the proven feasible region of the `pipelined` family. Specifically, we focus on `data_width` 18-20 (to capture potential LUT savings at lower widths while maintaining accuracy) and `n_iter` 14-18 (to balance accuracy and area). We will also tighten `angle_guard` and `frac_guard` to the ranges that yielded feasible results (0-2) to avoid wasting evaluations on configurations that likely violate accuracy or add unnecessary area.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7664 (gain this round: +0.0%).
Feasible designs: 27 of 200 evaluations (22 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 75% violate; best seen 273
- max_abs_err <= 0.00012207: 28% violate; best seen 4.46e-06 (2^-17.77)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts=994, accuracy_bits=13.4, ffs=1025, throughput_msps=264, max_abs_err=9.41e-05 (2^-13.38), power_index=19
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts=1023, accuracy_bits=13.7, ffs=1055, throughput_msps=264, max_abs_err=7.76e-05 (2^-13.65), power_index=19.5
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1120, accuracy_bits=14.3, ffs=1108, throughput_msps=264, max_abs_err=5.03e-05 (2^-14.28), power_index=21
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1136, accuracy_bits=14.5, ffs=1124, throughput_msps=264, max_abs_err=4.29e-05 (2^-14.51), power_index=21.3
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] luts=1202, accuracy_bits=15.1, ffs=1227, throughput_msps=264, max_abs_err=2.8e-05 (2^-15.12), power_index=22.8
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1209, accuracy_bits=15.1, ffs=1195, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] luts=1219, accuracy_bits=15.2, ffs=1244, throughput_msps=264, max_abs_err=2.57e-05 (2^-15.25), power_index=23.2
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] luts=1244, accuracy_bits=15.4, ffs=1229, throughput_msps=264, max_abs_err=2.32e-05 (2^-15.40), power_index=23.3
- pipelined [data_width=19 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] luts=1354, accuracy_bits=15.7, ffs=1336, throughput_msps=264, max_abs_err=1.92e-05 (2^-15.67), power_index=25.3
Front coverage: luts 994..1354 (HV reference 4000); accuracy_bits 13.4..15.7 (HV reference 13); data_width on the front 19..20 (registry 8..28).

Per family:
- iterative: 50 evals, 0 feasible; max throughput seen 11.1 MSPS; best accuracy 17.33 bits
- unrolled_k: 50 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 17.77 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 273 MSPS; best accuracy 15.67 bits; best feasible luts=994; feasible ranges: data_width 18..20, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.46 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined` (200 evals): data_width=18..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (11 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 157 feasible; hypervolume 1.791e+04 (+133.7%).

**No LLM call** (code's front-mapping round): The `pipelined` family is the only one meeting the throughput constraint (>= 250 MSPS), with a best observed throughput of 273 MSPS. The `pipelined_m` family failed to meet throughput (max 171 MSPS), and `iterative`/`unrolled_k` are far below the requirement. The current Pareto front is dominated by `pipelined` designs with `data_width` 19-20 and `n_iter` 15-20. To maximize hypervolume and find the true minimum LUT design, we should narrow the search space to the proven feasible region of the `pipelined` family. Specifically, we focus on `data_width` 18-20 (to capture potential LUT savings at lower widths while maintaining accuracy) and `n_iter` 14-18 (to balance accuracy and area). We will also tighten `angle_guard` and `frac_guard` to the ranges that yielded feasible results (0-2) to avoid wasting evaluations on configurations that likely violate accuracy or add unnecessary area.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.791e+04 (gain this round: +133.7%).
Feasible designs: 157 of 400 evaluations (135 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 51% violate; best seen 273
- max_abs_err <= 0.00012207: 18% violate; best seen 5.51e-08 (2^-24.11)

Pareto front (feasible, 23 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts=979, accuracy_bits=13.4, ffs=1006, throughput_msps=264, max_abs_err=9.49e-05 (2^-13.36), power_index=18.7
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts=1023, accuracy_bits=13.7, ffs=1055, throughput_msps=264, max_abs_err=7.76e-05 (2^-13.65), power_index=19.5
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1136, accuracy_bits=14.5, ffs=1124, throughput_msps=264, max_abs_err=4.29e-05 (2^-14.51), power_index=21.3
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] luts=1202, accuracy_bits=15.1, ffs=1227, throughput_msps=264, max_abs_err=2.8e-05 (2^-15.12), power_index=22.8
- pipelined [data_width=22 n_iter=17 angle_guard=-1 frac_guard=1 rounding=trunc] luts=1236, accuracy_bits=15.4, ffs=1265, throughput_msps=257, max_abs_err=2.39e-05 (2^-15.36), power_index=23.5
- pipelined [data_width=22 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts=1349, accuracy_bits=16.5, ffs=1380, throughput_msps=257, max_abs_err=1.1e-05 (2^-16.47), power_index=25.7
- pipelined [data_width=24 n_iter=19 angle_guard=-1 frac_guard=0 rounding=trunc] luts=1466, accuracy_bits=17.2, ffs=1495, throughput_msps=257, max_abs_err=6.73e-06 (2^-17.18), power_index=27.8
- pipelined [data_width=26 n_iter=19 angle_guard=-1 frac_guard=0 rounding=trunc] luts=1580, accuracy_bits=17.8, ffs=1610, throughput_msps=257, max_abs_err=4.39e-06 (2^-17.80), power_index=30
- pipelined [data_width=25 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] luts=1647, accuracy_bits=18.5, ffs=1675, throughput_msps=257, max_abs_err=2.69e-06 (2^-18.50), power_index=31.2
- pipelined [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc] luts=1953, accuracy_bits=20, ffs=1968, throughput_msps=257, max_abs_err=9.48e-07 (2^-20.01), power_index=36.9
Front coverage: luts 979..1953 (HV reference 4000); accuracy_bits 13.4..20 (HV reference 13); data_width on the front 18..26 (registry 8..28).

Per family:
- iterative: 50 evals, 0 feasible; max throughput seen 11.1 MSPS; best accuracy 17.33 bits
- unrolled_k: 50 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 17.77 bits
- pipelined: 250 evals, 157 feasible; max throughput seen 273 MSPS; best accuracy 24.11 bits; best feasible luts=979; feasible ranges: data_width 18..26, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.46 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7969 in, 2530 out
- provider-reported cost: $0.0077
- full prompts and replies: `llm_trace.jsonl`

