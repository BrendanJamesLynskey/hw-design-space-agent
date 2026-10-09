# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec low_area_control: Field-oriented motor-control loop needing sin/cos of the rotor angle at >= 1 MSPS with max error <= 2^-10. Area is everything: minimise LUTs + FFs.
  constraint: throughput_msps >= 1
  constraint: max_abs_err <= 0.000976562
  objective: min luts_plus_ffs (HV ref 1500)
  objective: max accuracy_bits (HV ref 10)
  select: min luts_plus_ffs
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`iterative:data_width=15,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 168 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 92 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 12.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 80.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.156 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000673 (2^-10.54) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 5.51 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000177 (2^-12.46) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.45 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.5 | exact: bit-accurate model, exhaustive (32768 angles) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (26 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 12.4 | 16 | 0.156 | 0.000673 (2^-10.54) | 10.54 |
| 1 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=trunc` | 170 | 96 | 11.7 | 17 | 0.17 | 0.000643 (2^-10.60) | 10.60 |
| 2 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 178 | 96 | 11.7 | 17 | 0.175 | 0.0004 (2^-11.29) | 11.29 |
| 3 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 179 | 97 | 11.7 | 17 | 0.177 | 0.000342 (2^-11.51) | 11.51 |
| 4 | `iterative:data_width=19,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 217 | 114 | 10.8 | 18 | 0.224 | 8.25e-05 (2^-13.57) | 13.57 |
| 5 | `iterative:data_width=19,n_iter=21,angle_guard=2,frac_guard=0,rounding=round` | 247 | 114 | 6.6 | 24 | 0.326 | 3.86e-05 (2^-14.66) | 14.66 |
| 6 | `iterative:data_width=22,n_iter=19,angle_guard=0,frac_guard=1,rounding=trunc` | 290 | 129 | 7.1 | 22 | 0.347 | 1.1e-05 (2^-16.47) | 16.47 |
| 7 | `iterative:data_width=22,n_iter=28,angle_guard=0,frac_guard=1,rounding=trunc` | 299 | 129 | 5.0 | 31 | 0.499 | 1.09e-05 (2^-16.49) | 16.49 |
| 8 | `iterative:data_width=22,n_iter=19,angle_guard=0,frac_guard=2,rounding=trunc` | 304 | 131 | 7.1 | 22 | 0.36 | 9.39e-06 (2^-16.70) | 16.70 |
| 9 | `iterative:data_width=23,n_iter=28,angle_guard=1,frac_guard=0,rounding=trunc` | 303 | 133 | 5.0 | 31 | 0.508 | 7.69e-06 (2^-16.99) | 16.99 |
| 10 | `iterative:data_width=23,n_iter=27,angle_guard=3,frac_guard=0,rounding=trunc` | 306 | 135 | 5.2 | 30 | 0.498 | 6.58e-06 (2^-17.21) | 17.21 |
| 11 | `iterative:data_width=23,n_iter=27,angle_guard=3,frac_guard=0,rounding=round` | 322 | 135 | 5.2 | 30 | 0.515 | 2.9e-06 (2^-18.39) | 18.39 |
| 12 | `iterative:data_width=24,n_iter=25,angle_guard=0,frac_guard=0,rounding=round` | 335 | 137 | 5.6 | 28 | 0.497 | 2.49e-06 (2^-18.62) | 18.62 |
| 13 | `iterative:data_width=22,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc` | 356 | 138 | 5.0 | 31 | 0.577 | 2.06e-06 (2^-18.89) | 18.89 |
| 14 | `iterative:data_width=22,n_iter=28,angle_guard=4,frac_guard=4,rounding=trunc` | 358 | 139 | 5.0 | 31 | 0.58 | 1.79e-06 (2^-19.09) | 19.09 |
| 15 | `iterative:data_width=25,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 356 | 143 | 5.0 | 31 | 0.582 | 1.05e-06 (2^-19.86) | 19.86 |
| 16 | `iterative:data_width=26,n_iter=27,angle_guard=0,frac_guard=0,rounding=trunc` | 358 | 147 | 5.2 | 30 | 0.57 | 1e-06 (2^-19.93) | 19.93 |
| 17 | `iterative:data_width=26,n_iter=28,angle_guard=4,frac_guard=0,rounding=trunc` | 365 | 151 | 4.9 | 31 | 0.602 | 9.39e-07 (2^-20.02) | 20.02 |
| 18 | `iterative:data_width=27,n_iter=30,angle_guard=-1,frac_guard=0,rounding=trunc` | 377 | 151 | 4.6 | 33 | 0.655 | 7.7e-07 (2^-20.31) | 20.31 |
| 19 | `iterative:data_width=27,n_iter=30,angle_guard=1,frac_guard=0,rounding=trunc` | 380 | 153 | 4.6 | 33 | 0.662 | 4.7e-07 (2^-21.02) | 21.02 |
| 20 | `iterative:data_width=28,n_iter=27,angle_guard=-1,frac_guard=0,rounding=round` | 409 | 156 | 5.1 | 30 | 0.638 | 2.86e-07 (2^-21.74) | 21.74 |
| 21 | `iterative:data_width=26,n_iter=26,angle_guard=3,frac_guard=3,rounding=trunc` | 415 | 156 | 5.3 | 29 | 0.623 | 1.72e-07 (2^-22.47) | 22.47 |
| 22 | `iterative:data_width=28,n_iter=28,angle_guard=1,frac_guard=1,rounding=trunc` | 415 | 160 | 4.9 | 31 | 0.671 | 1.27e-07 (2^-22.90) | 22.90 |
| 23 | `iterative:data_width=28,n_iter=28,angle_guard=4,frac_guard=0,rounding=round` | 418 | 161 | 4.9 | 31 | 0.676 | 1.03e-07 (2^-23.22) | 23.22 |
| 24 | `iterative:data_width=28,n_iter=27,angle_guard=1,frac_guard=1,rounding=round` | 489 | 160 | 5.1 | 30 | 0.733 | 8.92e-08 (2^-23.42) | 23.42 |
| 25 | `unrolled_k:data_width=27,n_iter=30,angle_guard=4,frac_guard=2,rounding=round,k=3` | 789 | 159 | 5.0 | 13 | 0.464 | 6.42e-08 (2^-23.89) | 23.89 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=1 MSPS) rules out iterative (1 result/cycle at low Fmax) and makes pipelined/pipelined_m the primary candidates. unrolled_k is the area floor but may not hit 1 MSPS; I give it a small share to check. Accuracy <= 2^-10 requires roughly N >= 10 and W >= 12; I bound the search to W=12-16 and N=10-14 to focus budget on the feasible region. Rounding=round is strictly better for accuracy, so I fix it. angle_guard and frac_guard are kept narrow (-1..1, 0..1) since they add area with little accuracy benefit at this precision. The budget is split 50/30/20 to prioritize the pipelined family (best area among throughput-feasible) while mapping the pipelined_m Fmax trade-off and probing unrolled_k feasibility.*)
- `pipelined` (50 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..1, frac_guard=0..1, rounding=round. *Why:* Only pipelined/pipelined_m can hit 1 MSPS throughput; pipelined is the area floor of the two. W=12-16 and N=10-14 cover the accuracy constraint (2^-10) with margin while keeping area low; rounding=round is strictly better for accuracy.
- `pipelined_m` (30 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..1, frac_guard=0..1, rounding=round, m=2..4. *Why:* pipelined_m trades some area for higher Fmax (fewer registers per stage); if pipelined's Fmax is too low to hit 1 MSPS, m=2-4 can recover throughput at modest area cost, mapping the area-vs-Fmax trade-off.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..1, frac_guard=0..1, rounding=round, k=4..8. *Why:* unrolled_k is the smallest-area family; if its Fmax is high enough, k=4-8 can reach 1 MSPS with far less area than pipelined, potentially dominating the front. Worth a small share to confirm feasibility.

**Result (code):** 100 evaluations this round, 100 total; 43 feasible; hypervolume 1127 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `unrolled_k` (best area 480) and `pipelined_m` (best accuracy 11.7 bits). The `pipelined` family, despite having 25 feasible points, has a minimum area of 1297, which is significantly worse than the current best of 480, making it irrelevant for the 'min luts_plus_ffs' objective. To maximize hypervolume, we need to tighten the trade-off curve. We should focus the search on the `unrolled_k` and `pipelined_m` families. Specifically, we should narrow the `data_width` to 14-16 (as 15-16 are already proven best for area/accuracy balance) and `n_iter` to 11-14 to explore the boundary where accuracy meets the 2^-10 constraint with minimal area. We should also explicitly exclude `pipelined` from the next search to save budget, as it is clearly outperformed in area by the other two families for the required throughput.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1127 (gain this round: n/a (first round)).
Feasible designs: 43 of 100 evaluations (26 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 57% violate; best seen 0.000311 (2^-11.65)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=round k=4] luts_plus_ffs=480, accuracy_bits=10.3, luts=388, ffs=92, throughput_msps=12, max_abs_err=0.000773 (2^-10.34), power_index=0.108
- unrolled_k [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=round k=4] luts_plus_ffs=501, accuracy_bits=10.5, luts=405, ffs=96, throughput_msps=12, max_abs_err=0.000703 (2^-10.47), power_index=0.113
- unrolled_k [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round k=7] luts_plus_ffs=710, accuracy_bits=10.6, luts=615, ffs=96, throughput_msps=8.4, max_abs_err=0.000624 (2^-10.65), power_index=0.134
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=959, accuracy_bits=11.2, luts=701, ffs=258, throughput_msps=97.8, max_abs_err=0.000417 (2^-11.23), power_index=0.0361
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1017, accuracy_bits=11.5, luts=759, ffs=258, throughput_msps=97.8, max_abs_err=0.000342 (2^-11.51), power_index=0.0383
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0409
Front coverage: luts_plus_ffs 480..1086 (HV reference 1500); accuracy_bits 10.3..11.7 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 3 feasible; max throughput seen 12.1 MSPS; best accuracy 10.65 bits; best feasible luts_plus_ffs=480; feasible ranges: data_width 15..16, n_iter 12..12, angle_guard 0..1, frac_guard 1..1, k 4..7
- pipelined: 50 evals, 25 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 14..16, n_iter 12..13, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 30 evals, 15 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=845; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the two families that currently dominate the Pareto front. Exclude 'pipelined' as it is strictly worse in area. Narrow ranges to the proven feasible regions to maximize the number of unique, high-quality points found in the remaining budget.*)
- `unrolled_k` (50 evals): data_width=14..16, n_iter=11..14, angle_guard=-1..1, frac_guard=0..1, rounding=trunc|round, k=2..8. *Why:* Current best area (480) and good throughput. Need to explore lower n_iter (11) and different k values to see if we can reduce area further while maintaining accuracy >= 10 bits.
- `pipelined_m` (50 evals): data_width=14..16, n_iter=11..14, angle_guard=-1..1, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* Current best accuracy (11.7 bits) and competitive area (845 min). Need to explore lower n_iter (11) and m=2 to see if we can get better accuracy/area trade-off than unrolled_k.

**Result (code):** 100 evaluations this round, 200 total; 103 feasible; hypervolume 1621 (+43.9%).

**LLM decision:** `refine` — The current Pareto front is dominated by `unrolled_k` designs with `data_width=16`, achieving the minimum area (393 LUTs+FFs) and satisfying the throughput constraint (>= 1 MSPS) with a large margin (8.97 MSPS). The `pipelined` and `pipelined_m` families are significantly more expensive (1000+ LUTs+FFs) and do not offer a better trade-off for this 'low_area' spec, as the throughput requirement is low. The `iterative` family is not yet explored, but `unrolled_k` with k=2 or 3 already provides sufficient throughput while being more area-efficient than a fully pipelined design. To maximize hypervolume and find the true minimum area point, we should refine the search around the promising `unrolled_k` region. Specifically, we should narrow `data_width` to 15-16 (since 16 is on the front and 15 was feasible), `n_iter` to 12-14, `angle_guard` to 0-1, `frac_guard` to 0-1, and `k` to 2-4 (higher k increases area without significant throughput benefit for this spec). We will also include `iterative` in the next round to ensure we haven't missed a lower-area solution, as it has the lowest latency overhead per result but might be area-competitive if `n_iter` is small.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1621 (gain this round: +43.9%).
Feasible designs: 103 of 200 evaluations (66 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 48% violate; best seen 0.000311 (2^-11.65)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=trunc k=3] luts_plus_ffs=393, accuracy_bits=10.5, luts=299, ffs=95, throughput_msps=8.97, max_abs_err=0.000704 (2^-10.47), power_index=0.118
- unrolled_k [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round k=3] luts_plus_ffs=401, accuracy_bits=11, luts=306, ffs=95, throughput_msps=8.97, max_abs_err=0.000492 (2^-10.99), power_index=0.121
- unrolled_k [data_width=16 n_iter=13 angle_guard=0 frac_guard=1 rounding=round k=2] luts_plus_ffs=406, accuracy_bits=11, luts=309, ffs=97, throughput_msps=10.5, max_abs_err=0.000472 (2^-11.05), power_index=0.153
- unrolled_k [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=3] luts_plus_ffs=425, accuracy_bits=11.3, luts=330, ffs=95, throughput_msps=8.97, max_abs_err=0.0004 (2^-11.29), power_index=0.128
- unrolled_k [data_width=16 n_iter=13 angle_guard=1 frac_guard=1 rounding=round k=3] luts_plus_ffs=457, accuracy_bits=11.4, luts=359, ffs=98, throughput_msps=8.97, max_abs_err=0.00038 (2^-11.36), power_index=0.138
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1017, accuracy_bits=11.5, luts=759, ffs=258, throughput_msps=97.8, max_abs_err=0.000342 (2^-11.51), power_index=0.0383
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0409
Front coverage: luts_plus_ffs 393..1086 (HV reference 1500); accuracy_bits 10.5..11.7 (HV reference 10); data_width on the front 16..16 (registry 8..28).

Per family:
- unrolled_k: 70 evals, 31 feasible; max throughput seen 13.5 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=393; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1, k 2..8
- pipelined: 50 evals, 25 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 14..16, n_iter 12..13, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 80 evals, 47 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=815; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focus on the most promising `unrolled_k` region and check `iterative` for potential area savings.*)
- `unrolled_k` (20 evals): data_width=15..16, n_iter=12..14, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, k=2..4. *Why:* Refine around the current best feasible region to find the absolute minimum area design.
- `iterative` (20 evals): data_width=15..16, n_iter=12..14, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round. *Why:* Explore the unexplored `iterative` family to ensure no lower-area solution exists, as it has the simplest datapath.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 40 evaluations this round, 240 total; 136 feasible; hypervolume 2002 (+23.5%).

**LLM decision:** `stop` — The feasible Pareto front is well-established and the selection objective (min luts_plus_ffs) is satisfied by the iterative design at 260 LUTs+FFs, which is significantly below the hypervolume reference of 1500. This design meets the throughput constraint (12.4 MSPS >= 1) and the accuracy constraint (10.5 bits > 10 bits required). While pipelined families offer higher throughput, they incur a large area penalty (815-1297 LUTs+FFs) that is unnecessary for the 1 MSPS requirement. The front covers the relevant trade-off space for the spec's low-area goal, and further exploration would not improve the selected design or the hypervolume significantly given the final round constraint.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 2002 (gain this round: +23.5%).
Feasible designs: 136 of 240 evaluations (86 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 43% violate; best seen 0.000311 (2^-11.65)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.5, luts=168, ffs=92, throughput_msps=12.4, max_abs_err=0.000673 (2^-10.54), power_index=0.156
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=trunc] luts_plus_ffs=266, accuracy_bits=10.6, luts=170, ffs=96, throughput_msps=11.7, max_abs_err=0.000643 (2^-10.60), power_index=0.17
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=273, accuracy_bits=11.3, luts=178, ffs=96, throughput_msps=11.7, max_abs_err=0.0004 (2^-11.29), power_index=0.175
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.5, luts=179, ffs=97, throughput_msps=11.7, max_abs_err=0.000342 (2^-11.51), power_index=0.177
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round k=4] luts_plus_ffs=510, accuracy_bits=11.7, luts=413, ffs=97, throughput_msps=10.3, max_abs_err=0.000311 (2^-11.65), power_index=0.134
Front coverage: luts_plus_ffs 260..510 (HV reference 1500); accuracy_bits 10.5..11.7 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 20 evals, 16 feasible; max throughput seen 13.2 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=260; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1
- unrolled_k: 90 evals, 48 feasible; max throughput seen 13.5 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=346; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1, k 2..8
- pipelined: 50 evals, 25 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 14..16, n_iter 12..13, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 80 evals, 47 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=815; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (128 evals): data_width=14..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (4 front designs; box front_anchored)
- `unrolled_k` (32 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* code: map the front of unrolled_k (1 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 286 feasible; hypervolume 1.456e+04 (+627.4%).

**No LLM call** (code's front-mapping round): The feasible Pareto front is well-established and the selection objective (min luts_plus_ffs) is satisfied by the iterative design at 260 LUTs+FFs, which is significantly below the hypervolume reference of 1500. This design meets the throughput constraint (12.4 MSPS >= 1) and the accuracy constraint (10.5 bits > 10 bits required). While pipelined families offer higher throughput, they incur a large area penalty (815-1297 LUTs+FFs) that is unnecessary for the 1 MSPS requirement. The front covers the relevant trade-off space for the spec's low-area goal, and further exploration would not improve the selected design or the hypervolume significantly given the final round constraint.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.456e+04 (gain this round: +627.4%).
Feasible designs: 286 of 400 evaluations (228 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 28% violate; best seen 6.42e-08 (2^-23.89)

Pareto front (feasible, 26 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.5, luts=168, ffs=92, throughput_msps=12.4, max_abs_err=0.000673 (2^-10.54), power_index=0.156
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.5, luts=179, ffs=97, throughput_msps=11.7, max_abs_err=0.000342 (2^-11.51), power_index=0.177
- iterative [data_width=22 n_iter=19 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=419, accuracy_bits=16.5, luts=290, ffs=129, throughput_msps=7.09, max_abs_err=1.1e-05 (2^-16.47), power_index=0.347
- iterative [data_width=22 n_iter=19 angle_guard=0 frac_guard=2 rounding=trunc] luts_plus_ffs=435, accuracy_bits=16.7, luts=304, ffs=131, throughput_msps=7.09, max_abs_err=9.39e-06 (2^-16.70), power_index=0.36
- iterative [data_width=23 n_iter=27 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=457, accuracy_bits=18.4, luts=322, ffs=135, throughput_msps=5.2, max_abs_err=2.9e-06 (2^-18.39), power_index=0.515
- iterative [data_width=22 n_iter=28 angle_guard=4 frac_guard=4 rounding=trunc] luts_plus_ffs=497, accuracy_bits=19.1, luts=358, ffs=139, throughput_msps=5.03, max_abs_err=1.79e-06 (2^-19.09), power_index=0.58
- iterative [data_width=26 n_iter=28 angle_guard=4 frac_guard=0 rounding=trunc] luts_plus_ffs=517, accuracy_bits=20, luts=365, ffs=151, throughput_msps=4.94, max_abs_err=9.39e-07 (2^-20.02), power_index=0.602
- iterative [data_width=27 n_iter=30 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=534, accuracy_bits=21, luts=380, ffs=153, throughput_msps=4.64, max_abs_err=4.7e-07 (2^-21.02), power_index=0.662
- iterative [data_width=28 n_iter=28 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=575, accuracy_bits=22.9, luts=415, ffs=160, throughput_msps=4.94, max_abs_err=1.27e-07 (2^-22.90), power_index=0.671
- unrolled_k [data_width=27 n_iter=30 angle_guard=4 frac_guard=2 rounding=round k=3] luts_plus_ffs=949, accuracy_bits=23.9, luts=789, ffs=159, throughput_msps=5.01, max_abs_err=6.42e-08 (2^-23.89), power_index=0.464
Front coverage: luts_plus_ffs 260..949 (HV reference 1500); accuracy_bits 10.5..23.9 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 148 evals, 136 feasible; max throughput seen 14.2 MSPS; best accuracy 23.42 bits; best feasible luts_plus_ffs=260; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 122 evals, 78 feasible; max throughput seen 13.5 MSPS; best accuracy 23.89 bits; best feasible luts_plus_ffs=346; feasible ranges: data_width 15..27, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, k 2..8
- pipelined: 50 evals, 25 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 14..16, n_iter 12..13, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 80 evals, 47 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=815; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10229 in, 3434 out
- provider-reported cost: $0.0092
- full prompts and replies: `llm_trace.jsonl`

