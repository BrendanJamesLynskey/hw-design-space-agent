# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`iterative:data_width=14,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 180 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 94 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 11 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 18 | exact: schedule |
| latency_ns | 90.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.185 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000513 (2^-10.93) | exact: bit-accurate model, exhaustive (16384 angles) |
| max_abs_err_lsb | 2.1 | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err | 0.000157 (2^-12.64) | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err_lsb | 0.643 | exact: bit-accurate model, exhaustive (16384 angles) |
| accuracy_bits | 10.9 | exact: bit-accurate model, exhaustive (16384 angles) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (39 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=14,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 180 | 94 | 11.0 | 18 | 0.185 | 0.000513 (2^-10.93) | 10.93 |
| 1 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc` | 183 | 100 | 11.7 | 17 | 0.181 | 0.000338 (2^-11.53) | 11.53 |
| 2 | `iterative:data_width=15,n_iter=16,angle_guard=4,frac_guard=3,rounding=trunc` | 195 | 101 | 10.2 | 19 | 0.211 | 0.000228 (2^-12.10) | 12.10 |
| 3 | `iterative:data_width=18,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 200 | 106 | 10.4 | 19 | 0.219 | 0.000121 (2^-13.02) | 13.02 |
| 4 | `iterative:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 206 | 110 | 10.2 | 19 | 0.226 | 8.82e-05 (2^-13.47) | 13.47 |
| 5 | `iterative:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 225 | 114 | 10.8 | 18 | 0.23 | 8.58e-05 (2^-13.51) | 13.51 |
| 6 | `iterative:data_width=19,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc` | 235 | 118 | 10.2 | 19 | 0.252 | 5.06e-05 (2^-14.27) | 14.27 |
| 7 | `iterative:data_width=19,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc` | 239 | 120 | 10.2 | 19 | 0.256 | 4.32e-05 (2^-14.50) | 14.50 |
| 8 | `iterative:data_width=19,n_iter=28,angle_guard=2,frac_guard=0,rounding=round` | 248 | 114 | 5.1 | 31 | 0.422 | 3.86e-05 (2^-14.66) | 14.66 |
| 9 | `iterative:data_width=20,n_iter=30,angle_guard=3,frac_guard=1,rounding=trunc` | 268 | 122 | 4.7 | 33 | 0.484 | 3.67e-05 (2^-14.73) | 14.73 |
| 10 | `iterative:data_width=19,n_iter=19,angle_guard=1,frac_guard=3,rounding=trunc` | 272 | 119 | 7.2 | 22 | 0.324 | 3.38e-05 (2^-14.85) | 14.85 |
| 11 | `iterative:data_width=24,n_iter=16,angle_guard=-1,frac_guard=0,rounding=trunc` | 260 | 135 | 10.0 | 19 | 0.282 | 3.23e-05 (2^-14.92) | 14.92 |
| 12 | `iterative:data_width=22,n_iter=20,angle_guard=-1,frac_guard=0,rounding=trunc` | 274 | 126 | 6.9 | 23 | 0.346 | 1.68e-05 (2^-15.86) | 15.86 |
| 13 | `iterative:data_width=19,n_iter=20,angle_guard=4,frac_guard=4,rounding=trunc` | 292 | 124 | 6.8 | 23 | 0.36 | 1.31e-05 (2^-16.22) | 16.22 |
| 14 | `iterative:data_width=22,n_iter=20,angle_guard=3,frac_guard=1,rounding=trunc` | 296 | 132 | 6.8 | 23 | 0.37 | 6.11e-06 (2^-17.32) | 17.32 |
| 15 | `iterative:data_width=22,n_iter=23,angle_guard=3,frac_guard=0,rounding=round` | 301 | 130 | 6.0 | 26 | 0.422 | 5.23e-06 (2^-17.54) | 17.54 |
| 16 | `iterative:data_width=22,n_iter=20,angle_guard=3,frac_guard=2,rounding=trunc` | 310 | 134 | 6.8 | 23 | 0.384 | 4.63e-06 (2^-17.72) | 17.72 |
| 17 | `iterative:data_width=23,n_iter=25,angle_guard=0,frac_guard=0,rounding=round` | 316 | 132 | 5.6 | 28 | 0.472 | 3.98e-06 (2^-17.94) | 17.94 |
| 18 | `iterative:data_width=23,n_iter=27,angle_guard=0,frac_guard=0,rounding=round` | 316 | 132 | 5.2 | 30 | 0.506 | 3.98e-06 (2^-17.94) | 17.94 |
| 19 | `iterative:data_width=23,n_iter=23,angle_guard=3,frac_guard=0,rounding=round` | 319 | 135 | 6.0 | 26 | 0.444 | 2.9e-06 (2^-18.39) | 18.39 |
| 20 | `iterative:data_width=23,n_iter=22,angle_guard=3,frac_guard=0,rounding=round` | 319 | 135 | 6.2 | 25 | 0.427 | 2.9e-06 (2^-18.39) | 18.39 |
| 21 | `iterative:data_width=24,n_iter=23,angle_guard=0,frac_guard=1,rounding=trunc` | 333 | 139 | 6.0 | 26 | 0.462 | 2.44e-06 (2^-18.64) | 18.64 |
| 22 | `iterative:data_width=24,n_iter=21,angle_guard=2,frac_guard=1,rounding=trunc` | 336 | 141 | 6.5 | 24 | 0.431 | 2.24e-06 (2^-18.77) | 18.77 |
| 23 | `iterative:data_width=23,n_iter=26,angle_guard=3,frac_guard=2,rounding=trunc` | 341 | 139 | 5.4 | 29 | 0.524 | 1.93e-06 (2^-18.98) | 18.98 |
| 24 | `iterative:data_width=25,n_iter=23,angle_guard=3,frac_guard=0,rounding=trunc` | 340 | 145 | 5.9 | 26 | 0.475 | 1.45e-06 (2^-19.40) | 19.40 |
| 25 | `iterative:data_width=24,n_iter=24,angle_guard=3,frac_guard=2,rounding=trunc` | 354 | 144 | 5.7 | 27 | 0.506 | 9.21e-07 (2^-20.05) | 20.05 |
| 26 | `iterative:data_width=26,n_iter=25,angle_guard=2,frac_guard=0,rounding=trunc` | 362 | 149 | 5.5 | 28 | 0.538 | 7.61e-07 (2^-20.32) | 20.32 |
| 27 | `iterative:data_width=27,n_iter=24,angle_guard=-1,frac_guard=0,rounding=trunc` | 368 | 151 | 5.7 | 27 | 0.527 | 6.81e-07 (2^-20.49) | 20.49 |
| 28 | `iterative:data_width=26,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 375 | 148 | 4.9 | 31 | 0.61 | 3.95e-07 (2^-21.27) | 21.27 |
| 29 | `iterative:data_width=27,n_iter=28,angle_guard=0,frac_guard=0,rounding=round` | 392 | 152 | 4.9 | 31 | 0.635 | 3.4e-07 (2^-21.49) | 21.49 |
| 30 | `iterative:data_width=27,n_iter=26,angle_guard=1,frac_guard=1,rounding=trunc` | 396 | 155 | 5.3 | 29 | 0.601 | 2.6e-07 (2^-21.88) | 21.88 |
| 31 | `iterative:data_width=27,n_iter=26,angle_guard=2,frac_guard=1,rounding=trunc` | 398 | 156 | 5.3 | 29 | 0.605 | 2.59e-07 (2^-21.88) | 21.88 |
| 32 | `iterative:data_width=28,n_iter=28,angle_guard=3,frac_guard=0,rounding=trunc` | 401 | 160 | 4.9 | 31 | 0.655 | 2.17e-07 (2^-22.13) | 22.13 |
| 33 | `iterative:data_width=28,n_iter=26,angle_guard=0,frac_guard=0,rounding=round` | 411 | 157 | 5.3 | 29 | 0.62 | 1.76e-07 (2^-22.44) | 22.44 |
| 34 | `iterative:data_width=27,n_iter=26,angle_guard=1,frac_guard=2,rounding=trunc` | 413 | 157 | 5.3 | 29 | 0.622 | 1.72e-07 (2^-22.47) | 22.47 |
| 35 | `iterative:data_width=28,n_iter=26,angle_guard=3,frac_guard=0,rounding=round` | 417 | 160 | 5.2 | 29 | 0.629 | 1.1e-07 (2^-23.12) | 23.12 |
| 36 | `iterative:data_width=27,n_iter=28,angle_guard=3,frac_guard=3,rounding=trunc` | 434 | 161 | 4.9 | 31 | 0.694 | 8.12e-08 (2^-23.55) | 23.55 |
| 37 | `iterative:data_width=27,n_iter=26,angle_guard=4,frac_guard=2,rounding=round` | 491 | 160 | 5.2 | 29 | 0.71 | 7.62e-08 (2^-23.65) | 23.65 |
| 38 | `iterative:data_width=27,n_iter=30,angle_guard=4,frac_guard=4,rounding=round` | 534 | 164 | 4.6 | 33 | 0.867 | 3.53e-08 (2^-24.76) | 24.76 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >=1 MSPS and max_abs_err <= 2^-10. The output LSB is 2^-(data_width-2), so data_width must be at least 12 to have any chance of meeting the error bound; n_iter >= 10 is needed for sufficient CORDIC accuracy. The iterative family shares its datapath and is the most area-efficient, so it receives the largest share. unrolled_k and pipelined_m use fixed shifts (no barrel shifters) and may trade area differently; pipelined_m with large m keeps 1/cycle throughput while limiting register count, making it a strong area competitor. Full pipelined is included with a small share to verify it is dominated. All ranges are within the registry and focus on the low-area, moderate-accuracy region where the Pareto front is expected.*)
- `iterative` (50 evals): data_width=12..20, n_iter=10..20, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Most area-efficient family: one shared datapath with barrel shifters. Throughput = Fmax/(N+3) MSPS; for N<=20 and typical Fmax > 23 MHz this easily meets the 1 MSPS constraint. Focus budget here to find the minimal data_width and n_iter that satisfy max_abs_err <= 2^-10.
- `unrolled_k` (20 evals): data_width=12..20, n_iter=10..20, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, k=2..4. *Why:* Small k (2-4) reduces cycles per result but adds parallel micro-rotation hardware. Since throughput is already satisfied by iterative, this family is likely dominated, but it uses fixed shifts (no barrel shifters) and may be area-competitive for small k. A modest share checks whether it can beat iterative on luts_plus_ffs.
- `pipelined_m` (25 evals): data_width=12..20, n_iter=10..20, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* Large m (4-8) registers every m stages, keeping pipeline register count low while providing 1 result/cycle. Uses fixed shifts (no barrel shifters), so it may be area-competitive with iterative. This family is a strong candidate for the area-optimal design if the register overhead is lower than the barrel-shifter cost.
- `pipelined` (5 evals): data_width=12..18, n_iter=10..16, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Full pipeline with one register per micro-rotation gives 1 result/cycle but has the highest register count and is likely the largest area. A small share confirms whether it is dominated and ensures the Pareto front is not missing an unexpected corner.

**Result (code):** 100 evaluations this round, 100 total; 81 feasible; hypervolume 6043 (n/a).

**LLM decision:** `map_front` — Round 1 found a feasible front (81/100 feasible, 12 Pareto designs) but it is narrow: luts_plus_ffs spans only 273..689 against the HV reference of 1500, and accuracy_bits tops out at 15.2 while the registry allows data_width up to 28 and n_iter up to 30, so the high-accuracy/large-area part of the trade-off curve is unmapped. The two front families are iterative (best area 273, accuracy 10.9..14.95) and unrolled_k (accuracy up to 15.21 at area 689); pipelined/pipelined_m feasible points (best 872 area, 13.86 bits) are dominated and only matter for the >=1 MSPS constraint, which iterative already meets at 11 MSPS. Spending this round on an NSGA-II coverage search over the full ranges of iterative and unrolled_k, seeded with the current front, should extend the curve toward both the low-area corner (data_width < 14 may still satisfy 2^-10) and the high-accuracy corner, raising hypervolume before the reserved final mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6043 (gain this round: n/a (first round)).
Feasible designs: 81 of 100 evaluations (69 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 19% violate; best seen 2.65e-05 (2^-15.21)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=273, accuracy_bits=10.9, luts=180, ffs=94, throughput_msps=11, max_abs_err=0.000513 (2^-10.93), power_index=0.185
- iterative [data_width=15 n_iter=16 angle_guard=4 frac_guard=2 rounding=trunc] luts_plus_ffs=284, accuracy_bits=11.5, luts=185, ffs=99, throughput_msps=10.2, max_abs_err=0.000344 (2^-11.50), power_index=0.203
- iterative [data_width=15 n_iter=16 angle_guard=4 frac_guard=3 rounding=trunc] luts_plus_ffs=296, accuracy_bits=12.1, luts=195, ffs=101, throughput_msps=10.2, max_abs_err=0.000228 (2^-12.10), power_index=0.211
- iterative [data_width=16 n_iter=17 angle_guard=4 frac_guard=3 rounding=trunc] luts_plus_ffs=337, accuracy_bits=12.9, luts=230, ffs=107, throughput_msps=7.95, max_abs_err=0.00013 (2^-12.91), power_index=0.253
- iterative [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=339, accuracy_bits=13.5, luts=225, ffs=114, throughput_msps=10.8, max_abs_err=8.58e-05 (2^-13.51), power_index=0.23
- iterative [data_width=19 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=353, accuracy_bits=14.3, luts=235, ffs=118, throughput_msps=10.2, max_abs_err=5.06e-05 (2^-14.27), power_index=0.252
- iterative [data_width=19 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=359, accuracy_bits=14.5, luts=239, ffs=120, throughput_msps=10.2, max_abs_err=4.32e-05 (2^-14.50), power_index=0.256
- iterative [data_width=19 n_iter=20 angle_guard=1 frac_guard=4 rounding=trunc] luts_plus_ffs=408, accuracy_bits=14.9, luts=287, ffs=121, throughput_msps=6.78, max_abs_err=3.16e-05 (2^-14.95), power_index=0.353
- unrolled_k [data_width=17 n_iter=19 angle_guard=4 frac_guard=4 rounding=round k=3] luts_plus_ffs=626, accuracy_bits=15.1, luts=514, ffs=112, throughput_msps=7, max_abs_err=2.86e-05 (2^-15.09), power_index=0.235
- unrolled_k [data_width=18 n_iter=19 angle_guard=4 frac_guard=4 rounding=trunc k=4] luts_plus_ffs=689, accuracy_bits=15.2, luts=572, ffs=117, throughput_msps=6.63, max_abs_err=2.65e-05 (2^-15.21), power_index=0.207
Front coverage: luts_plus_ffs 273..689 (HV reference 1500); accuracy_bits 10.9..15.2 (HV reference 10); data_width on the front 14..19 (registry 8..28).

Per family:
- iterative: 50 evals, 47 feasible; max throughput seen 15.3 MSPS; best accuracy 14.95 bits; best feasible luts_plus_ffs=273; feasible ranges: data_width 14..19, n_iter 12..20, angle_guard 0..4, frac_guard 0..4
- unrolled_k: 20 evals, 16 feasible; max throughput seen 13.1 MSPS; best accuracy 15.21 bits; best feasible luts_plus_ffs=376; feasible ranges: data_width 14..19, n_iter 12..20, angle_guard 1..4, frac_guard 1..4, k 2..4
- pipelined: 5 evals, 2 feasible; max throughput seen 273 MSPS; best accuracy 11.89 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..17, n_iter 14..14, angle_guard 0..0, frac_guard 1..1
- pipelined_m: 25 evals, 16 feasible; max throughput seen 97.8 MSPS; best accuracy 13.86 bits; best feasible luts_plus_ffs=872; feasible ranges: data_width 15..19, n_iter 12..18, angle_guard 1..4, frac_guard 0..4, m 4..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (84 evals): data_width=13..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (10 front designs; box front_anchored)
- `unrolled_k` (16 evals): data_width=16..28, n_iter=17..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* code: map the front of unrolled_k (2 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 174 feasible; hypervolume 1.448e+04 (+139.7%).

**LLM decision:** `map_front` — The feasible front is entirely iterative (27 designs, luts_plus_ffs 273..595, accuracy_bits 10.9..23.6); the other families are dominated on the two objectives — best unrolled_k area 374, pipelined_m 872, pipelined 1490, all worse than iterative's 273, and their high throughput (up to 273 MSPS) buys nothing because the throughput constraint is only >=1 MSPS and is met by every design (0% violations). The front already spans the full registry data_width range (14..28) and n_iter 12..30, so there is no obviously under-explored region to refine or widen. With the HV reference at (1500, 10), the dominant HV term is the rectangle above the highest-accuracy point (595, 23.6), so the remaining 200-eval budget is best spent letting NSGA-II map the whole iterative front (seeded with it) to sharpen the staircase and confirm the accuracy ceiling near data_width=28, rather than narrowing onto the min-area corner the selection rule would pick.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.448e+04 (gain this round: +139.7%).
Feasible designs: 174 of 200 evaluations (155 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 13% violate; best seen 8.12e-08 (2^-23.55)

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=273, accuracy_bits=10.9, luts=180, ffs=94, throughput_msps=11, max_abs_err=0.000513 (2^-10.93), power_index=0.185
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=4 rounding=trunc] luts_plus_ffs=335, accuracy_bits=12.5, luts=224, ffs=111, throughput_msps=11.4, max_abs_err=0.000172 (2^-12.50), power_index=0.214
- iterative [data_width=19 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=353, accuracy_bits=14.3, luts=235, ffs=118, throughput_msps=10.2, max_abs_err=5.06e-05 (2^-14.27), power_index=0.252
- iterative [data_width=20 n_iter=30 angle_guard=3 frac_guard=1 rounding=trunc] luts_plus_ffs=390, accuracy_bits=14.7, luts=268, ffs=122, throughput_msps=4.73, max_abs_err=3.67e-05 (2^-14.73), power_index=0.484
- iterative [data_width=22 n_iter=28 angle_guard=-1 frac_guard=0 rounding=trunc] luts_plus_ffs=406, accuracy_bits=15.6, luts=280, ffs=126, throughput_msps=5.13, max_abs_err=2.04e-05 (2^-15.58), power_index=0.474
- iterative [data_width=22 n_iter=23 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=431, accuracy_bits=17.5, luts=301, ffs=130, throughput_msps=6, max_abs_err=5.23e-06 (2^-17.54), power_index=0.422
- iterative [data_width=22 n_iter=22 angle_guard=4 frac_guard=3 rounding=trunc] luts_plus_ffs=474, accuracy_bits=18.6, luts=336, ffs=137, throughput_msps=6.24, max_abs_err=2.49e-06 (2^-18.61), power_index=0.445
- iterative [data_width=25 n_iter=23 angle_guard=3 frac_guard=0 rounding=trunc] luts_plus_ffs=485, accuracy_bits=19.4, luts=340, ffs=145, throughput_msps=5.89, max_abs_err=1.45e-06 (2^-19.40), power_index=0.475
- iterative [data_width=28 n_iter=28 angle_guard=3 frac_guard=0 rounding=trunc] luts_plus_ffs=562, accuracy_bits=22.1, luts=401, ffs=160, throughput_msps=4.86, max_abs_err=2.17e-07 (2^-22.13), power_index=0.655
- iterative [data_width=27 n_iter=28 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=595, accuracy_bits=23.6, luts=434, ffs=161, throughput_msps=4.94, max_abs_err=8.12e-08 (2^-23.55), power_index=0.694
Front coverage: luts_plus_ffs 273..595 (HV reference 1500); accuracy_bits 10.9..23.6 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 134 evals, 124 feasible; max throughput seen 15.3 MSPS; best accuracy 23.55 bits; best feasible luts_plus_ffs=273; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 36 evals, 32 feasible; max throughput seen 13.1 MSPS; best accuracy 21.87 bits; best feasible luts_plus_ffs=374; feasible ranges: data_width 14..28, n_iter 12..29, angle_guard -2..4, frac_guard 0..4, k 2..8
- pipelined: 5 evals, 2 feasible; max throughput seen 273 MSPS; best accuracy 11.89 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..17, n_iter 14..14, angle_guard 0..0, frac_guard 1..1
- pipelined_m: 25 evals, 16 feasible; max throughput seen 97.8 MSPS; best accuracy 13.86 bits; best feasible luts_plus_ffs=872; feasible ranges: data_width 15..19, n_iter 12..18, angle_guard 1..4, frac_guard 0..4, m 4..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=13..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (27 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 268 feasible; hypervolume 1.46e+04 (+0.8%).

**LLM decision:** `map_front` — The front is dominated by the iterative family (35 designs, luts_plus_ffs 273..651, accuracy 10.9..23.6 bits), but the low-area corner is thin: only one design sits near the 273-LUT/10.9-bit end, and the selection rule (min luts_plus_ffs) will pick from that corner, so the curve there needs denser coverage. Meanwhile the high-throughput families are barely mapped (pipelined: 5 evals, pipelined_m: 25 evals) and their feasible boxes are narrow (pipelined data_width 15..17, n_iter 14, angle_guard 0, frac_guard 1), so the throughput-vs-area trade-off is under-sampled. With 100 evals left and the front already at 1.46e4 HV (+0.8% this round), a code-driven NSGA-II coverage pass over the full ranges of the families on the front, seeded with the current front, is the best use of the final round to fill the low-area corner and the pipelined/pipelined_m region rather than narrowing further.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.46e+04 (gain this round: +0.8%).
Feasible designs: 268 of 300 evaluations (240 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 11% violate; best seen 7.62e-08 (2^-23.65)

Pareto front (feasible, 35 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=273, accuracy_bits=10.9, luts=180, ffs=94, throughput_msps=11, max_abs_err=0.000513 (2^-10.93), power_index=0.185
- iterative [data_width=16 n_iter=17 angle_guard=4 frac_guard=3 rounding=trunc] luts_plus_ffs=337, accuracy_bits=12.9, luts=230, ffs=107, throughput_msps=7.95, max_abs_err=0.00013 (2^-12.91), power_index=0.253
- iterative [data_width=20 n_iter=20 angle_guard=3 frac_guard=0 rounding=trunc] luts_plus_ffs=370, accuracy_bits=14.5, luts=249, ffs=120, throughput_msps=6.78, max_abs_err=4.23e-05 (2^-14.53), power_index=0.32
- iterative [data_width=19 n_iter=19 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=391, accuracy_bits=14.9, luts=272, ffs=119, throughput_msps=7.23, max_abs_err=3.38e-05 (2^-14.85), power_index=0.324
- iterative [data_width=22 n_iter=20 angle_guard=3 frac_guard=1 rounding=trunc] luts_plus_ffs=428, accuracy_bits=17.3, luts=296, ffs=132, throughput_msps=6.78, max_abs_err=6.11e-06 (2^-17.32), power_index=0.37
- iterative [data_width=23 n_iter=22 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=454, accuracy_bits=18.4, luts=319, ffs=135, throughput_msps=6.24, max_abs_err=2.9e-06 (2^-18.39), power_index=0.427
- iterative [data_width=24 n_iter=24 angle_guard=3 frac_guard=2 rounding=trunc] luts_plus_ffs=498, accuracy_bits=20, luts=354, ffs=144, throughput_msps=5.68, max_abs_err=9.21e-07 (2^-20.05), power_index=0.506
- iterative [data_width=27 n_iter=28 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=544, accuracy_bits=21.5, luts=392, ffs=152, throughput_msps=4.94, max_abs_err=3.4e-07 (2^-21.49), power_index=0.635
- iterative [data_width=28 n_iter=26 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=568, accuracy_bits=22.4, luts=411, ffs=157, throughput_msps=5.28, max_abs_err=1.76e-07 (2^-22.44), power_index=0.62
- iterative [data_width=27 n_iter=26 angle_guard=4 frac_guard=2 rounding=round] luts_plus_ffs=651, accuracy_bits=23.6, luts=491, ffs=160, throughput_msps=5.19, max_abs_err=7.62e-08 (2^-23.65), power_index=0.71
Front coverage: luts_plus_ffs 273..651 (HV reference 1500); accuracy_bits 10.9..23.6 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 234 evals, 218 feasible; max throughput seen 15.3 MSPS; best accuracy 23.65 bits; best feasible luts_plus_ffs=273; feasible ranges: data_width 13..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 36 evals, 32 feasible; max throughput seen 13.1 MSPS; best accuracy 21.87 bits; best feasible luts_plus_ffs=374; feasible ranges: data_width 14..28, n_iter 12..29, angle_guard -2..4, frac_guard 0..4, k 2..8
- pipelined: 5 evals, 2 feasible; max throughput seen 273 MSPS; best accuracy 11.89 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..17, n_iter 14..14, angle_guard 0..0, frac_guard 1..1
- pipelined_m: 25 evals, 16 feasible; max throughput seen 97.8 MSPS; best accuracy 13.86 bits; best feasible luts_plus_ffs=872; feasible ranges: data_width 15..19, n_iter 12..18, angle_guard 1..4, frac_guard 0..4, m 4..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=13..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (35 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 361 feasible; hypervolume 1.554e+04 (+6.4%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the front is already feasible and well covered: 361 of 400 evaluations feasible, 39 designs on the Pareto front spanning luts_plus_ffs 273..698 (HV ref 1500) and accuracy_bits 10.9..24.8 (HV ref 10), with hypervolume 1.554e+04 and a +6.4% gain this round. Both constraints are comfortably satisfiable — throughput best seen 273 MSPS vs the 1 MSPS requirement (0% violations) and max_abs_err best 3.53e-08 (2^-24.76) vs the 2^-10 limit, with only 10% of evaluations violating accuracy. The selection rule (min luts_plus_ffs) is served by the front's low-area corner: iterative [data_width=14 n_iter=15 angle_guard=2 frac_guard=3 trunc] at luts_plus_ffs=273, accuracy_bits=10.9 (max_abs_err 5.13e-04 <= 9.77e-04) and 11 MSPS >= 1 MSPS, so a valid design exists at the area minimum. All four registry families have been explored, so no further family can be added; stopping is appropriate.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.554e+04 (gain this round: +6.4%).
Feasible designs: 361 of 400 evaluations (325 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 10% violate; best seen 3.53e-08 (2^-24.76)

Pareto front (feasible, 39 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=273, accuracy_bits=10.9, luts=180, ffs=94, throughput_msps=11, max_abs_err=0.000513 (2^-10.93), power_index=0.185
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts_plus_ffs=316, accuracy_bits=13.5, luts=206, ffs=110, throughput_msps=10.2, max_abs_err=8.82e-05 (2^-13.47), power_index=0.226
- iterative [data_width=19 n_iter=28 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=362, accuracy_bits=14.7, luts=248, ffs=114, throughput_msps=5.13, max_abs_err=3.86e-05 (2^-14.66), power_index=0.422
- iterative [data_width=19 n_iter=20 angle_guard=4 frac_guard=4 rounding=trunc] luts_plus_ffs=416, accuracy_bits=16.2, luts=292, ffs=124, throughput_msps=6.78, max_abs_err=1.31e-05 (2^-16.22), power_index=0.36
- iterative [data_width=23 n_iter=25 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=448, accuracy_bits=17.9, luts=316, ffs=132, throughput_msps=5.57, max_abs_err=3.98e-06 (2^-17.94), power_index=0.472
- iterative [data_width=24 n_iter=23 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=472, accuracy_bits=18.6, luts=333, ffs=139, throughput_msps=6, max_abs_err=2.44e-06 (2^-18.64), power_index=0.462
- iterative [data_width=24 n_iter=24 angle_guard=3 frac_guard=2 rounding=trunc] luts_plus_ffs=498, accuracy_bits=20, luts=354, ffs=144, throughput_msps=5.68, max_abs_err=9.21e-07 (2^-20.05), power_index=0.506
- iterative [data_width=27 n_iter=26 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=551, accuracy_bits=21.9, luts=396, ffs=155, throughput_msps=5.28, max_abs_err=2.6e-07 (2^-21.88), power_index=0.601
- iterative [data_width=27 n_iter=26 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=571, accuracy_bits=22.5, luts=413, ffs=157, throughput_msps=5.28, max_abs_err=1.72e-07 (2^-22.47), power_index=0.622
- iterative [data_width=27 n_iter=30 angle_guard=4 frac_guard=4 rounding=round] luts_plus_ffs=698, accuracy_bits=24.8, luts=534, ffs=164, throughput_msps=4.56, max_abs_err=3.53e-08 (2^-24.76), power_index=0.867
Front coverage: luts_plus_ffs 273..698 (HV reference 1500); accuracy_bits 10.9..24.8 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 334 evals, 311 feasible; max throughput seen 15.3 MSPS; best accuracy 24.76 bits; best feasible luts_plus_ffs=273; feasible ranges: data_width 13..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 36 evals, 32 feasible; max throughput seen 13.1 MSPS; best accuracy 21.87 bits; best feasible luts_plus_ffs=374; feasible ranges: data_width 14..28, n_iter 12..29, angle_guard -2..4, frac_guard 0..4, k 2..8
- pipelined: 5 evals, 2 feasible; max throughput seen 273 MSPS; best accuracy 11.89 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..17, n_iter 14..14, angle_guard 0..0, frac_guard 1..1
- pipelined_m: 25 evals, 16 feasible; max throughput seen 97.8 MSPS; best accuracy 13.86 bits; best feasible luts_plus_ffs=872; feasible ranges: data_width 15..19, n_iter 12..18, angle_guard 1..4, frac_guard 0..4, m 4..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16221 in, 8018 out
- provider-reported cost: $0.0105
- full prompts and replies: `llm_trace.jsonl`

