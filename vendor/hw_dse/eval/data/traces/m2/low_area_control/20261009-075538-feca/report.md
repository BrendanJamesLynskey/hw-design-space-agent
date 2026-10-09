# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
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
`iterative:data_width=14,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 168 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 91 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 11.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 85.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.166 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000944 (2^-10.05) | exact: bit-accurate model, exhaustive (16384 angles) |
| max_abs_err_lsb | 3.87 | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err | 0.000229 (2^-12.09) | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err_lsb | 0.939 | exact: bit-accurate model, exhaustive (16384 angles) |
| accuracy_bits | 10 | exact: bit-accurate model, exhaustive (16384 angles) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=14,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc` | 168 | 91 | 11.7 | 17 | 0.166 | 0.000944 (2^-10.05) | 10.05 |
| 1 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=trunc` | 172 | 97 | 11.7 | 17 | 0.172 | 0.000643 (2^-10.60) | 10.60 |
| 2 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 179 | 97 | 11.0 | 18 | 0.187 | 0.000301 (2^-11.70) | 11.70 |
| 3 | `iterative:data_width=16,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 10.4 | 19 | 0.199 | 0.000285 (2^-11.78) | 11.78 |
| 4 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 191 | 99 | 10.4 | 19 | 0.207 | 0.000278 (2^-11.81) | 11.81 |
| 5 | `iterative:data_width=17,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 193 | 103 | 10.2 | 19 | 0.211 | 0.000139 (2^-12.81) | 12.81 |
| 6 | `iterative:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 204 | 108 | 10.2 | 19 | 0.223 | 8.35e-05 (2^-13.55) | 13.55 |
| 7 | `iterative:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 225 | 114 | 10.2 | 19 | 0.243 | 5.94e-05 (2^-14.04) | 14.04 |
| 8 | `iterative:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 227 | 118 | 10.2 | 19 | 0.247 | 4.12e-05 (2^-14.57) | 14.57 |
| 9 | `iterative:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 239 | 122 | 10.2 | 19 | 0.258 | 3.93e-05 (2^-14.63) | 14.63 |
| 10 | `iterative:data_width=20,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc` | 258 | 119 | 7.6 | 21 | 0.298 | 3.75e-05 (2^-14.70) | 14.70 |
| 11 | `iterative:data_width=20,n_iter=24,angle_guard=1,frac_guard=0,rounding=round` | 262 | 118 | 5.9 | 27 | 0.386 | 2.52e-05 (2^-15.28) | 15.28 |
| 12 | `iterative:data_width=21,n_iter=19,angle_guard=0,frac_guard=0,rounding=round` | 272 | 122 | 7.2 | 22 | 0.326 | 1.85e-05 (2^-15.72) | 15.72 |
| 13 | `iterative:data_width=20,n_iter=18,angle_guard=4,frac_guard=2,rounding=trunc` | 280 | 125 | 7.4 | 21 | 0.32 | 1.76e-05 (2^-15.79) | 15.79 |
| 14 | `iterative:data_width=22,n_iter=22,angle_guard=4,frac_guard=0,rounding=trunc` | 289 | 131 | 6.2 | 25 | 0.395 | 1.22e-05 (2^-16.32) | 16.32 |
| 15 | `iterative:data_width=20,n_iter=24,angle_guard=3,frac_guard=3,rounding=trunc` | 300 | 126 | 5.8 | 27 | 0.432 | 9.47e-06 (2^-16.69) | 16.69 |
| 16 | `iterative:data_width=22,n_iter=24,angle_guard=4,frac_guard=0,rounding=round` | 303 | 131 | 5.8 | 27 | 0.441 | 5.23e-06 (2^-17.54) | 17.54 |
| 17 | `iterative:data_width=23,n_iter=28,angle_guard=1,frac_guard=1,rounding=trunc` | 320 | 135 | 5.0 | 31 | 0.531 | 4.11e-06 (2^-17.89) | 17.89 |
| 18 | `iterative:data_width=24,n_iter=22,angle_guard=1,frac_guard=0,rounding=trunc` | 319 | 138 | 6.2 | 25 | 0.43 | 2.96e-06 (2^-18.37) | 18.37 |
| 19 | `iterative:data_width=23,n_iter=24,angle_guard=3,frac_guard=1,rounding=trunc` | 321 | 137 | 5.8 | 27 | 0.465 | 2.86e-06 (2^-18.42) | 18.42 |
| 20 | `iterative:data_width=22,n_iter=24,angle_guard=3,frac_guard=3,rounding=trunc` | 334 | 136 | 5.8 | 27 | 0.478 | 2.39e-06 (2^-18.67) | 18.67 |
| 21 | `iterative:data_width=24,n_iter=22,angle_guard=2,frac_guard=0,rounding=round` | 334 | 139 | 6.2 | 25 | 0.445 | 1.67e-06 (2^-19.19) | 19.19 |
| 22 | `iterative:data_width=26,n_iter=24,angle_guard=3,frac_guard=0,rounding=trunc` | 357 | 150 | 5.7 | 27 | 0.516 | 7.61e-07 (2^-20.32) | 20.32 |
| 23 | `iterative:data_width=26,n_iter=24,angle_guard=3,frac_guard=0,rounding=round` | 371 | 150 | 5.7 | 27 | 0.529 | 3.69e-07 (2^-21.37) | 21.37 |
| 24 | `iterative:data_width=28,n_iter=26,angle_guard=2,frac_guard=0,rounding=trunc` | 400 | 159 | 5.3 | 29 | 0.61 | 2.01e-07 (2^-22.24) | 22.24 |
| 25 | `iterative:data_width=28,n_iter=26,angle_guard=2,frac_guard=4,rounding=trunc` | 468 | 167 | 5.2 | 29 | 0.694 | 7.02e-08 (2^-23.76) | 23.76 |
| 26 | `iterative:data_width=28,n_iter=28,angle_guard=4,frac_guard=1,rounding=round` | 495 | 163 | 4.9 | 31 | 0.767 | 5.57e-08 (2^-24.10) | 24.10 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Both constraints are loose: 1 MSPS is easily met by an iterative core and 2^-10 error needs only about 11-12 bit data. Because the objective is area, the first round concentrates on the iterative family with narrow width and iteration ranges. Small shares go to unrolled_k and pipelined_m to test whether they undercut the iterative area, and to give the Pareto front a second point of view on accuracy_bits. The reserved budget will map the full front afterward.*)
- `iterative` (67 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* A shared datapath with one rotation per cycle has the smallest area. Throughput of 1 MSPS needs only a modest clock: N+3 cycles at roughly 100 MHz or more is far above 1 result/us. Width and iteration ranges are centred on what 2^-10 error requires (about 11-12 bit outputs, 10-14 iterations).
- `unrolled_k` (25 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* A small k cuts cycle count at the cost of extra shifters and adders, so it is unlikely to beat iterative on area. It is included as a cheap hedge in case the controller or LUT overhead makes a small k competitive.
- `pipelined_m` (8 evals): data_width=10..14, n_iter=8..14, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=4..8. *Why:* Fixed-shift stages avoid barrel shifters, so the area could be surprisingly competitive. Sparse registers (large m) keep the FF count low. A small probe share checks this.

**Result (code):** 100 evaluations this round, 100 total; 38 feasible; hypervolume 3677 (n/a).

**LLM decision:** `refine` — Only iterative designs are on the front (259..351 LUTs+FFs). The iterative family is the smallest at 259 and reaches 13.1 accuracy bits, and unrolled_k's best is 342. pipelined_m has 0 feasible designs, and its throughput of up to 103 MSPS is far above the 1 MSPS need, so it is wasted area. Throughput is ~11 MSPS against a 1 MSPS requirement, so there is slack. The feasible region is narrow: data_width 13..16, n_iter 12..15. The front's low-area end is not yet pinned down. Smaller widths such as 11..13 with more guard bits might hit 10 bits cheaply, and the high-accuracy end beyond 13 bits is sparse. I will concentrate the budget on iterative with tighter ranges, and keep a small unrolled_k share as a cross-check on the area minimum.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3677 (gain this round: n/a (first round)).
Feasible designs: 38 of 100 evaluations (23 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 62% violate; best seen 0.000117 (2^-13.06)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=259, accuracy_bits=10, luts=168, ffs=91, throughput_msps=11.7, max_abs_err=0.000944 (2^-10.05), power_index=0.166
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=269, accuracy_bits=10.6, luts=172, ffs=97, throughput_msps=11.7, max_abs_err=0.000643 (2^-10.60), power_index=0.172
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.7, luts=179, ffs=97, throughput_msps=11, max_abs_err=0.000301 (2^-11.70), power_index=0.187
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=304, accuracy_bits=12.1, luts=201, ffs=103, throughput_msps=10.8, max_abs_err=0.000227 (2^-12.10), power_index=0.206
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] luts_plus_ffs=327, accuracy_bits=12.5, luts=226, ffs=101, throughput_msps=10.8, max_abs_err=0.000174 (2^-12.49), power_index=0.222
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts_plus_ffs=351, accuracy_bits=13.1, luts=246, ffs=105, throughput_msps=10.8, max_abs_err=0.000117 (2^-13.06), power_index=0.237
Front coverage: luts_plus_ffs 259..351 (HV reference 1500); accuracy_bits 10..13.1 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- iterative: 67 evals, 32 feasible; max throughput seen 18 MSPS; best accuracy 13.06 bits; best feasible luts_plus_ffs=259; feasible ranges: data_width 13..16, n_iter 12..15, angle_guard 0..3, frac_guard 0..3
- unrolled_k: 25 evals, 6 feasible; max throughput seen 13.5 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 15..16, n_iter 13..14, angle_guard 0..2, frac_guard 1..3, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 9.19 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the iterative family in a region slightly wider than the observed feasible ranges. Drop pipelined_m and skip pipelined, since one result per cycle costs area that the 1 MSPS spec does not need.*)
- `iterative` (84 evals): data_width=11..18, n_iter=10..17, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Iterative holds the whole front and the smallest area. Refine around the feasible region with a slightly lower width to find the minimum-area design that reaches 2^-10, and extend upward in accuracy.
- `unrolled_k` (16 evals): data_width=12..17, n_iter=11..16, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..3. *Why:* Its best feasible area is 342, so it is behind iterative. Keep a small share to confirm it does not beat it at low k.

**Result (code):** 100 evaluations this round, 200 total; 108 feasible; hypervolume 5208 (+41.6%).

**LLM decision:** `map_front` — The front is all iterative, 10 designs spanning luts_plus_ffs 259..397 and accuracy_bits 10..14.3. HV gained +41.6% last round, so the front is still moving. Throughput is not binding (iterative reaches 10-18 MSPS against a 1 MSPS floor), and unrolled_k (best 342) and pipelined_m (0 feasible out of 8) are dominated on area. Pipelined would add a stage per iteration, so it cannot win on area. The data_width range explored (about 12..18) and the front's accuracy ceiling of 14.3 bits leave the upper accuracy range uncovered, and the front is thin around 259..300. Code-driven NSGA-II over the full iterative ranges, seeded with the front, is the best way to fill in the curve and find the minimum-area corner for selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 5208 (gain this round: +41.6%).
Feasible designs: 108 of 200 evaluations (80 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 46% violate; best seen 4.81e-05 (2^-14.34)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=259, accuracy_bits=10, luts=168, ffs=91, throughput_msps=11.7, max_abs_err=0.000944 (2^-10.05), power_index=0.166
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=269, accuracy_bits=10.6, luts=172, ffs=97, throughput_msps=11.7, max_abs_err=0.000643 (2^-10.60), power_index=0.172
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.7, luts=179, ffs=97, throughput_msps=11, max_abs_err=0.000301 (2^-11.70), power_index=0.187
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=10.4, max_abs_err=0.000285 (2^-11.78), power_index=0.199
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=290, accuracy_bits=11.8, luts=191, ffs=99, throughput_msps=10.4, max_abs_err=0.000278 (2^-11.81), power_index=0.207
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=296, accuracy_bits=12.8, luts=193, ffs=103, throughput_msps=10.2, max_abs_err=0.000139 (2^-12.81), power_index=0.211
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=312, accuracy_bits=13.5, luts=204, ffs=108, throughput_msps=10.2, max_abs_err=8.35e-05 (2^-13.55), power_index=0.223
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=339, accuracy_bits=14, luts=225, ffs=114, throughput_msps=10.2, max_abs_err=5.94e-05 (2^-14.04), power_index=0.243
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=4 rounding=trunc] luts_plus_ffs=351, accuracy_bits=14.1, luts=235, ffs=116, throughput_msps=10.2, max_abs_err=5.8e-05 (2^-14.07), power_index=0.251
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=4 rounding=round] luts_plus_ffs=397, accuracy_bits=14.3, luts=281, ffs=116, throughput_msps=10.2, max_abs_err=4.81e-05 (2^-14.34), power_index=0.283
Front coverage: luts_plus_ffs 259..397 (HV reference 1500); accuracy_bits 10..14.3 (HV reference 10); data_width on the front 14..18 (registry 8..28).

Per family:
- iterative: 151 evals, 88 feasible; max throughput seen 18 MSPS; best accuracy 14.34 bits; best feasible luts_plus_ffs=259; feasible ranges: data_width 12..18, n_iter 12..17, angle_guard 0..4, frac_guard 0..4
- unrolled_k: 41 evals, 20 feasible; max throughput seen 13.5 MSPS; best accuracy 13.23 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -1..4, frac_guard 0..4, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 9.19 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `iterative` (40 evals): data_width=13..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (10 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 147 feasible; hypervolume 1.459e+04 (+180.2%).

**LLM decision:** `map_front` — The front has 17 feasible designs, all iterative, spanning luts_plus_ffs 259..636 and accuracy_bits 10..23.8. The HV gain last round was +180%, so coverage is still improving. The selection rule picks min luts_plus_ffs, and 259 at 10.05 bits is already close to the accuracy floor. Unrolled_k is dominated (best feasible 342) and pipelined_m had 0 feasible of 8, with best accuracy 9.19 bits and much larger area. Throughput is not binding, since iterative reaches 5-12 MSPS against a 1 MSPS minimum. The remaining gains are filling in the iterative trade-off curve, and also nudging the low-area corner, which code can do by running NSGA-II over the full iterative ranges seeded with the current front. That is better than another hand-narrowed refinement.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.459e+04 (gain this round: +180.2%).
Feasible designs: 147 of 240 evaluations (117 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 39% violate; best seen 7.02e-08 (2^-23.76)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=259, accuracy_bits=10, luts=168, ffs=91, throughput_msps=11.7, max_abs_err=0.000944 (2^-10.05), power_index=0.166
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.7, luts=179, ffs=97, throughput_msps=11, max_abs_err=0.000301 (2^-11.70), power_index=0.187
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=290, accuracy_bits=11.8, luts=191, ffs=99, throughput_msps=10.4, max_abs_err=0.000278 (2^-11.81), power_index=0.207
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=296, accuracy_bits=12.8, luts=193, ffs=103, throughput_msps=10.2, max_abs_err=0.000139 (2^-12.81), power_index=0.211
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=339, accuracy_bits=14, luts=225, ffs=114, throughput_msps=10.2, max_abs_err=5.94e-05 (2^-14.04), power_index=0.243
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=4 rounding=round] luts_plus_ffs=397, accuracy_bits=14.3, luts=281, ffs=116, throughput_msps=10.2, max_abs_err=4.81e-05 (2^-14.34), power_index=0.283
- iterative [data_width=24 n_iter=22 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=457, accuracy_bits=18.4, luts=319, ffs=138, throughput_msps=6.24, max_abs_err=2.96e-06 (2^-18.37), power_index=0.43
- iterative [data_width=24 n_iter=22 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=473, accuracy_bits=19.2, luts=334, ffs=139, throughput_msps=6.24, max_abs_err=1.67e-06 (2^-19.19), power_index=0.445
- iterative [data_width=26 n_iter=24 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=521, accuracy_bits=21.4, luts=371, ffs=150, throughput_msps=5.68, max_abs_err=3.69e-07 (2^-21.37), power_index=0.529
- iterative [data_width=28 n_iter=26 angle_guard=2 frac_guard=4 rounding=trunc] luts_plus_ffs=636, accuracy_bits=23.8, luts=468, ffs=167, throughput_msps=5.19, max_abs_err=7.02e-08 (2^-23.76), power_index=0.694
Front coverage: luts_plus_ffs 259..636 (HV reference 1500); accuracy_bits 10..23.8 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 191 evals, 127 feasible; max throughput seen 18 MSPS; best accuracy 23.76 bits; best feasible luts_plus_ffs=259; feasible ranges: data_width 12..28, n_iter 12..27, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 41 evals, 20 feasible; max throughput seen 13.5 MSPS; best accuracy 13.23 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -1..4, frac_guard 0..4, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 9.19 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=13..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (17 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 239 feasible; hypervolume 1.498e+04 (+2.7%).

**LLM decision:** `stop` — This is the final round, so the choice is between stop and infeasible, and the constraints are clearly feasible. 239 of 340 evaluations were feasible. The front has 24 designs covering luts_plus_ffs 259..658 and accuracy_bits 10..24.1. The selection rule (min luts_plus_ffs) picks the iterative design with data_width=14, n_iter=14, angle_guard=1, frac_guard=2, rounding=trunc. It uses 259 LUTs+FFs, reaches 10 accuracy bits (max error 0.000944, within the 0.000977 limit) and delivers 11.7 MSPS, well above the 1 MSPS floor. The front is dominated by the iterative family. unrolled_k's best feasible area is 342, and pipelined_m has no feasible designs (best 9.19 bits). Pipelined and pipelined_m are structurally larger and can only add throughput the spec does not need. Hypervolume gain this round was only +2.7%, and the budget is nearly spent.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.498e+04 (gain this round: +2.7%).
Feasible designs: 239 of 340 evaluations (197 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 30% violate; best seen 5.57e-08 (2^-24.10)

Pareto front (feasible, 24 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=259, accuracy_bits=10, luts=168, ffs=91, throughput_msps=11.7, max_abs_err=0.000944 (2^-10.05), power_index=0.166
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=10.4, max_abs_err=0.000285 (2^-11.78), power_index=0.199
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=296, accuracy_bits=12.8, luts=193, ffs=103, throughput_msps=10.2, max_abs_err=0.000139 (2^-12.81), power_index=0.211
- iterative [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=345, accuracy_bits=14.6, luts=227, ffs=118, throughput_msps=10.2, max_abs_err=4.12e-05 (2^-14.57), power_index=0.247
- iterative [data_width=20 n_iter=24 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=380, accuracy_bits=15.3, luts=262, ffs=118, throughput_msps=5.89, max_abs_err=2.52e-05 (2^-15.28), power_index=0.386
- iterative [data_width=22 n_iter=24 angle_guard=4 frac_guard=0 rounding=round] luts_plus_ffs=434, accuracy_bits=17.5, luts=303, ffs=131, throughput_msps=5.78, max_abs_err=5.23e-06 (2^-17.54), power_index=0.441
- iterative [data_width=24 n_iter=22 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=457, accuracy_bits=18.4, luts=319, ffs=138, throughput_msps=6.24, max_abs_err=2.96e-06 (2^-18.37), power_index=0.43
- iterative [data_width=24 n_iter=22 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=473, accuracy_bits=19.2, luts=334, ffs=139, throughput_msps=6.24, max_abs_err=1.67e-06 (2^-19.19), power_index=0.445
- iterative [data_width=26 n_iter=24 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=521, accuracy_bits=21.4, luts=371, ffs=150, throughput_msps=5.68, max_abs_err=3.69e-07 (2^-21.37), power_index=0.529
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=658, accuracy_bits=24.1, luts=495, ffs=163, throughput_msps=4.86, max_abs_err=5.57e-08 (2^-24.10), power_index=0.767
Front coverage: luts_plus_ffs 259..658 (HV reference 1500); accuracy_bits 10..24.1 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 291 evals, 219 feasible; max throughput seen 18 MSPS; best accuracy 24.10 bits; best feasible luts_plus_ffs=259; feasible ranges: data_width 12..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 41 evals, 20 feasible; max throughput seen 13.5 MSPS; best accuracy 13.23 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -1..4, frac_guard 0..4, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 9.19 bits
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `iterative` (60 evals): data_width=13..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (24 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 296 feasible; hypervolume 1.499e+04 (+0.1%).

**No LLM call** (code's front-mapping round): This is the final round, so the choice is between stop and infeasible, and the constraints are clearly feasible. 239 of 340 evaluations were feasible. The front has 24 designs covering luts_plus_ffs 259..658 and accuracy_bits 10..24.1. The selection rule (min luts_plus_ffs) picks the iterative design with data_width=14, n_iter=14, angle_guard=1, frac_guard=2, rounding=trunc. It uses 259 LUTs+FFs, reaches 10 accuracy bits (max error 0.000944, within the 0.000977 limit) and delivers 11.7 MSPS, well above the 1 MSPS floor. The front is dominated by the iterative family. unrolled_k's best feasible area is 342, and pipelined_m has no feasible designs (best 9.19 bits). Pipelined and pipelined_m are structurally larger and can only add throughput the spec does not need. Hypervolume gain this round was only +2.7%, and the budget is nearly spent.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.499e+04 (gain this round: +0.1%).
Feasible designs: 296 of 400 evaluations (243 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 26% violate; best seen 5.57e-08 (2^-24.10)

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=259, accuracy_bits=10, luts=168, ffs=91, throughput_msps=11.7, max_abs_err=0.000944 (2^-10.05), power_index=0.166
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=10.4, max_abs_err=0.000285 (2^-11.78), power_index=0.199
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=312, accuracy_bits=13.5, luts=204, ffs=108, throughput_msps=10.2, max_abs_err=8.35e-05 (2^-13.55), power_index=0.223
- iterative [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=361, accuracy_bits=14.6, luts=239, ffs=122, throughput_msps=10.2, max_abs_err=3.93e-05 (2^-14.63), power_index=0.258
- iterative [data_width=21 n_iter=19 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=394, accuracy_bits=15.7, luts=272, ffs=122, throughput_msps=7.23, max_abs_err=1.85e-05 (2^-15.72), power_index=0.326
- iterative [data_width=22 n_iter=22 angle_guard=4 frac_guard=0 rounding=trunc] luts_plus_ffs=420, accuracy_bits=16.3, luts=289, ffs=131, throughput_msps=6.24, max_abs_err=1.22e-05 (2^-16.32), power_index=0.395
- iterative [data_width=23 n_iter=28 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=455, accuracy_bits=17.9, luts=320, ffs=135, throughput_msps=5.03, max_abs_err=4.11e-06 (2^-17.89), power_index=0.531
- iterative [data_width=22 n_iter=24 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=471, accuracy_bits=18.7, luts=334, ffs=136, throughput_msps=5.78, max_abs_err=2.39e-06 (2^-18.67), power_index=0.478
- iterative [data_width=26 n_iter=24 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=521, accuracy_bits=21.4, luts=371, ffs=150, throughput_msps=5.68, max_abs_err=3.69e-07 (2^-21.37), power_index=0.529
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=658, accuracy_bits=24.1, luts=495, ffs=163, throughput_msps=4.86, max_abs_err=5.57e-08 (2^-24.10), power_index=0.767
Front coverage: luts_plus_ffs 259..658 (HV reference 1500); accuracy_bits 10..24.1 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 351 evals, 276 feasible; max throughput seen 18 MSPS; best accuracy 24.10 bits; best feasible luts_plus_ffs=259; feasible ranges: data_width 12..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 41 evals, 20 feasible; max throughput seen 13.5 MSPS; best accuracy 13.23 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -1..4, frac_guard 0..4, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 9.19 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 25324 in, 2700 out
- provider-reported cost: $0.0776
- full prompts and replies: `llm_trace.jsonl`

