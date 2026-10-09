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
`pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 964 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 999 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000109 (2^-13.17) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 14.2 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.9e-05 (2^-15.07) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.8 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.2 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=trunc` | 964 | 999 | 264.5 | 17 | 18.5 | 0.000109 (2^-13.17) | 13.17 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 973 | 967 | 264.5 | 17 | 18.2 | 0.000101 (2^-13.27) | 13.27 |
| 2 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 979 | 1010 | 264.5 | 17 | 18.7 | 9.41e-05 (2^-13.38) | 13.38 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 987 | 982 | 264.5 | 17 | 18.5 | 9.31e-05 (2^-13.39) | 13.39 |
| 4 | `pipelined:data_width=17,n_iter=15,angle_guard=3,frac_guard=3,rounding=round` | 1015 | 1004 | 264.5 | 17 | 19 | 8.99e-05 (2^-13.44) | 13.44 |
| 5 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 1017 | 1045 | 264.5 | 18 | 19.4 | 8.82e-05 (2^-13.47) | 13.47 |
| 6 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=trunc` | 1033 | 1061 | 264.5 | 18 | 19.7 | 8.72e-05 (2^-13.49) | 13.49 |
| 7 | `pipelined:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1037 | 1027 | 264.5 | 18 | 19.4 | 8.59e-05 (2^-13.51) | 13.51 |
| 8 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc` | 1048 | 1069 | 264.5 | 18 | 19.9 | 8.14e-05 (2^-13.58) | 13.58 |
| 9 | `pipelined:data_width=22,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc` | 1053 | 1090 | 264.5 | 17 | 20.1 | 7.06e-05 (2^-13.79) | 13.79 |
| 10 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 1055 | 1047 | 264.5 | 18 | 19.8 | 6.45e-05 (2^-13.92) | 13.92 |
| 11 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1084 | 1071 | 264.5 | 18 | 20.3 | 6.42e-05 (2^-13.93) | 13.93 |
| 12 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1086 | 1076 | 264.5 | 18 | 20.3 | 5.46e-05 (2^-14.16) | 14.16 |
| 13 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1134 | 1120 | 264.5 | 18 | 21.2 | 4.52e-05 (2^-14.43) | 14.43 |
| 14 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc` | 1143 | 1166 | 264.5 | 18 | 21.7 | 4.32e-05 (2^-14.50) | 14.50 |
| 15 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1183 | 1168 | 264.5 | 18 | 22.1 | 3.8e-05 (2^-14.68) | 14.68 |
| 16 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 1211 | 1199 | 264.5 | 19 | 22.7 | 2.58e-05 (2^-15.24) | 15.24 |
| 17 | `pipelined:data_width=21,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 1333 | 1361 | 264.5 | 21 | 25.3 | 1.29e-05 (2^-16.24) | 16.24 |
| 18 | `pipelined:data_width=21,n_iter=19,angle_guard=1,frac_guard=1,rounding=round` | 1415 | 1397 | 264.5 | 21 | 26.4 | 1.06e-05 (2^-16.52) | 16.52 |
| 19 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=1,rounding=trunc` | 1428 | 1453 | 256.5 | 21 | 27.1 | 8.63e-06 (2^-16.82) | 16.82 |
| 20 | `pipelined:data_width=20,n_iter=19,angle_guard=3,frac_guard=4,rounding=round` | 1508 | 1481 | 256.5 | 21 | 28.1 | 8.2e-06 (2^-16.90) | 16.90 |
| 21 | `pipelined:data_width=25,n_iter=19,angle_guard=-2,frac_guard=1,rounding=trunc` | 1542 | 1568 | 256.5 | 21 | 29.2 | 5.98e-06 (2^-17.35) | 17.35 |
| 22 | `pipelined:data_width=24,n_iter=22,angle_guard=0,frac_guard=1,rounding=trunc` | 1776 | 1794 | 256.5 | 24 | 33.6 | 2.68e-06 (2^-18.51) | 18.51 |
| 23 | `pipelined:data_width=24,n_iter=24,angle_guard=1,frac_guard=0,rounding=round` | 1920 | 1937 | 256.5 | 26 | 36.3 | 1.76e-06 (2^-19.12) | 19.12 |
| 24 | `pipelined:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=round` | 2005 | 1970 | 256.5 | 25 | 37.4 | 7.53e-07 (2^-20.34) | 20.34 |
| 25 | `pipelined:data_width=25,n_iter=24,angle_guard=1,frac_guard=1,rounding=round` | 2094 | 2056 | 256.5 | 26 | 39 | 7.31e-07 (2^-20.38) | 20.38 |
| 26 | `pipelined:data_width=25,n_iter=28,angle_guard=1,frac_guard=1,rounding=round` | 2448 | 2399 | 256.5 | 30 | 45.6 | 6.42e-07 (2^-20.57) | 20.57 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Iterative and unrolled_k produce a result only every several cycles, so they cannot reach 250 MSPS at one sample per clock. That leaves pipelined and pipelined_m. A max error of 2^-13 needs about 13 accuracy bits, so data_width starts at 14 and n_iter at around 11. Both families use narrow ranges around the error boundary, because the lowest LUT count will sit near the minimum width and iteration count that still meets the limit. The upper ends of the ranges give some higher-accuracy points to improve hypervolume. Later rounds can narrow in on the front or widen if the constraints turn out too tight.*)
- `pipelined` (50 evals): data_width=14..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle is required, and a fully registered pipeline has the highest Fmax, so it should clear 250 MSPS easily. Widths of 14-18 bits and 11-17 iterations cover the region around the 2^-13 error limit.
- `pipelined_m` (50 evals): data_width=14..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering only every m stages also gives one result per cycle and may use fewer LUTs or FFs. Keeping m at 2-4 should leave Fmax above 250 MHz, and the search will show whether it beats the fully pipelined design.

**Result (code):** 100 evaluations this round, 100 total; 15 feasible; hypervolume 3258 (n/a).

**LLM decision:** `refine` — Only pipelined has feasible designs (15 of 50 evals, 4 on the front). pipelined_m is 0/50 feasible with max throughput 171 MSPS, below the 250 floor, so it should be dropped. iterative and unrolled_k produce one result every several cycles, so they cannot reach 250 MSPS at one sample per clock and are not worth testing. The front only covers luts 1015..1122 and data_width 17..18. The error limit of 2^-13 needs about 13+ accuracy bits, and the best front point (1015 LUTs) is already 13.44 bits. The remaining gain is LUT reduction at the 13-bit accuracy boundary, so I will focus on pipelined with data_width 14..18, n_iter 12..17 and guard bits at the low end. Rounding stays open to both choices. Narrower width and fewer iterations should cut area while staying near 13 bits.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3258 (gain this round: n/a (first round)).
Feasible designs: 15 of 100 evaluations (7 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 64% violate; best seen 4.98e-05 (2^-14.29)

Pareto front (feasible, 4 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=1015, accuracy_bits=13.4, ffs=1004, throughput_msps=264, max_abs_err=8.99e-05 (2^-13.44), power_index=19
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] luts=1101, accuracy_bits=13.6, ffs=1120, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=20.9
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1103, accuracy_bits=13.7, ffs=1092, throughput_msps=264, max_abs_err=7.36e-05 (2^-13.73), power_index=20.6
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1122, accuracy_bits=14.1, ffs=1113, throughput_msps=264, max_abs_err=5.64e-05 (2^-14.11), power_index=21
Front coverage: luts 1015..1122 (HV reference 4000); accuracy_bits 13.4..14.1 (HV reference 13); data_width on the front 17..18 (registry 8..28).

Per family:
- pipelined: 50 evals, 15 feasible; max throughput seen 273 MSPS; best accuracy 14.11 bits; best feasible luts=1015; feasible ranges: data_width 17..18, n_iter 15..17, angle_guard 1..3, frac_guard 1..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.29 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the one feasible family and push toward lower LUT counts near the 2^-13 accuracy limit, while keeping a bit of range above for accuracy coverage.*)
- `pipelined` (100 evals): data_width=14..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only family meeting both throughput and error constraints; search around and below the current 17-18 bit region to find smaller-LUT designs that still reach about 13 bits.

**Result (code):** 100 evaluations this round, 200 total; 37 feasible; hypervolume 4225 (+29.7%).

**LLM decision:** `refine` — Only pipelined is feasible: 37 of 150 evals were feasible, and the best front design reaches 264 MSPS. pipelined_m had 0 feasible in 50 evals (max 171 MSPS, below the 250 floor). Iterative and unrolled_k deliver less than one result per cycle, so they cannot reach 250 MSPS at these Fmax levels, and I will not spend budget on them. The front spans luts 964..1134 at data_width 17..18, n_iter 15..17 and accuracy 13.1..14.4 bits. The selection rule is min luts, and the lowest-LUT design sits right at the error limit (2^-13.05). Cheaper designs may exist at data_width 15..17 with n_iter 13..16 and smaller guard bits, so I will narrow to that corner. Because rounding='round' lifts accuracy at little LUT cost, I keep both rounding choices.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4225 (gain this round: +29.7%).
Feasible designs: 37 of 200 evaluations (22 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 273
- max_abs_err <= 0.00012207: 71% violate; best seen 4.52e-05 (2^-14.43)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc] luts=964, accuracy_bits=13.1, ffs=995, throughput_msps=264, max_abs_err=0.000118 (2^-13.05), power_index=18.4
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=973, accuracy_bits=13.3, ffs=967, throughput_msps=264, max_abs_err=0.000101 (2^-13.27), power_index=18.2
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts=987, accuracy_bits=13.4, ffs=982, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=18.5
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=1015, accuracy_bits=13.4, ffs=1004, throughput_msps=264, max_abs_err=8.99e-05 (2^-13.44), power_index=19
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts=1017, accuracy_bits=13.5, ffs=1045, throughput_msps=264, max_abs_err=8.82e-05 (2^-13.47), power_index=19.4
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1048, accuracy_bits=13.6, ffs=1069, throughput_msps=264, max_abs_err=8.14e-05 (2^-13.58), power_index=19.9
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1055, accuracy_bits=13.9, ffs=1047, throughput_msps=264, max_abs_err=6.45e-05 (2^-13.92), power_index=19.8
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1084, accuracy_bits=13.9, ffs=1071, throughput_msps=264, max_abs_err=6.42e-05 (2^-13.93), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1086, accuracy_bits=14.2, ffs=1076, throughput_msps=264, max_abs_err=5.46e-05 (2^-14.16), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1134, accuracy_bits=14.4, ffs=1120, throughput_msps=264, max_abs_err=4.52e-05 (2^-14.43), power_index=21.2
Front coverage: luts 964..1134 (HV reference 4000); accuracy_bits 13.1..14.4 (HV reference 13); data_width on the front 17..18 (registry 8..28).

Per family:
- pipelined: 150 evals, 37 feasible; max throughput seen 273 MSPS; best accuracy 14.43 bits; best feasible luts=964; feasible ranges: data_width 17..18, n_iter 15..17, angle_guard 1..3, frac_guard 1..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.29 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the pipelined low-width, low-iteration region to lower the minimum LUTs while keeping max_abs_err <= 2^-13, and to fill the front toward the accuracy limit.*)
- `pipelined` (40 evals): data_width=15..18, n_iter=13..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only family meeting throughput >= 250; the low-LUT region around the 2^-13 error limit is not yet explored for data_width < 17 or fewer iterations.

**Result (code):** 40 evaluations this round, 240 total; 50 feasible; hypervolume 4277 (+1.2%).

**LLM decision:** `stop` — This is the final round, so stop is the only meaningful choice. The front has 13 feasible designs, all pipelined, with min LUTs of 964 at 13.1 accuracy bits, which meets both constraints (throughput 264 >= 250 MSPS, max_abs_err 0.000118 <= 0.00012207). Hypervolume gained only +1.2% last round, so it is close to saturated. pipelined_m had 0 feasible designs out of 50 (max 171 MSPS). iterative and unrolled_k produce one result every several cycles, so they cannot reach 250 MSPS at one sample per clock. The selection rule (min luts) picks the 964-LUT pipelined design with data_width=18, n_iter=15, angle_guard=3, frac_guard=1, rounding=trunc.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 4277 (gain this round: +1.2%).
Feasible designs: 50 of 240 evaluations (33 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 21% violate; best seen 273
- max_abs_err <= 0.00012207: 70% violate; best seen 4.47e-05 (2^-14.45)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc] luts=964, accuracy_bits=13.1, ffs=995, throughput_msps=264, max_abs_err=0.000118 (2^-13.05), power_index=18.4
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=973, accuracy_bits=13.3, ffs=967, throughput_msps=264, max_abs_err=0.000101 (2^-13.27), power_index=18.2
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=1015, accuracy_bits=13.4, ffs=1004, throughput_msps=264, max_abs_err=8.99e-05 (2^-13.44), power_index=19
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts=1017, accuracy_bits=13.5, ffs=1045, throughput_msps=264, max_abs_err=8.82e-05 (2^-13.47), power_index=19.4
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] luts=1033, accuracy_bits=13.5, ffs=1061, throughput_msps=264, max_abs_err=8.72e-05 (2^-13.49), power_index=19.7
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1048, accuracy_bits=13.6, ffs=1069, throughput_msps=264, max_abs_err=8.14e-05 (2^-13.58), power_index=19.9
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1055, accuracy_bits=13.9, ffs=1047, throughput_msps=264, max_abs_err=6.45e-05 (2^-13.92), power_index=19.8
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1084, accuracy_bits=13.9, ffs=1071, throughput_msps=264, max_abs_err=6.42e-05 (2^-13.93), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1134, accuracy_bits=14.4, ffs=1120, throughput_msps=264, max_abs_err=4.52e-05 (2^-14.43), power_index=21.2
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=trunc] luts=1169, accuracy_bits=14.5, ffs=1189, throughput_msps=264, max_abs_err=4.47e-05 (2^-14.45), power_index=22.2
Front coverage: luts 964..1169 (HV reference 4000); accuracy_bits 13.1..14.5 (HV reference 13); data_width on the front 17..18 (registry 8..28).

Per family:
- pipelined: 190 evals, 50 feasible; max throughput seen 273 MSPS; best accuracy 14.45 bits; best feasible luts=964; feasible ranges: data_width 16..18, n_iter 15..17, angle_guard 0..3, frac_guard 1..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.29 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (160 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (13 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 163 feasible; hypervolume 1.862e+04 (+335.2%).

**No LLM call** (code's front-mapping round): This is the final round, so stop is the only meaningful choice. The front has 13 feasible designs, all pipelined, with min LUTs of 964 at 13.1 accuracy bits, which meets both constraints (throughput 264 >= 250 MSPS, max_abs_err 0.000118 <= 0.00012207). Hypervolume gained only +1.2% last round, so it is close to saturated. pipelined_m had 0 feasible designs out of 50 (max 171 MSPS). iterative and unrolled_k produce one result every several cycles, so they cannot reach 250 MSPS at one sample per clock. The selection rule (min luts) picks the 964-LUT pipelined design with data_width=18, n_iter=15, angle_guard=3, frac_guard=1, rounding=trunc.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.862e+04 (gain this round: +335.2%).
Feasible designs: 163 of 400 evaluations (125 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 20% violate; best seen 273
- max_abs_err <= 0.00012207: 47% violate; best seen 8.09e-08 (2^-23.56)

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=trunc] luts=964, accuracy_bits=13.2, ffs=999, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=18.5
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts=987, accuracy_bits=13.4, ffs=982, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=18.5
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] luts=1033, accuracy_bits=13.5, ffs=1061, throughput_msps=264, max_abs_err=8.72e-05 (2^-13.49), power_index=19.7
- pipelined [data_width=22 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc] luts=1053, accuracy_bits=13.8, ffs=1090, throughput_msps=264, max_abs_err=7.06e-05 (2^-13.79), power_index=20.1
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1086, accuracy_bits=14.2, ffs=1076, throughput_msps=264, max_abs_err=5.46e-05 (2^-14.16), power_index=20.3
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1143, accuracy_bits=14.5, ffs=1166, throughput_msps=264, max_abs_err=4.32e-05 (2^-14.50), power_index=21.7
- pipelined [data_width=21 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] luts=1333, accuracy_bits=16.2, ffs=1361, throughput_msps=264, max_abs_err=1.29e-05 (2^-16.24), power_index=25.3
- pipelined [data_width=20 n_iter=19 angle_guard=3 frac_guard=4 rounding=round] luts=1508, accuracy_bits=16.9, ffs=1481, throughput_msps=257, max_abs_err=8.2e-06 (2^-16.90), power_index=28.1
- pipelined [data_width=24 n_iter=24 angle_guard=1 frac_guard=0 rounding=round] luts=1920, accuracy_bits=19.1, ffs=1937, throughput_msps=257, max_abs_err=1.76e-06 (2^-19.12), power_index=36.3
- pipelined [data_width=25 n_iter=28 angle_guard=1 frac_guard=1 rounding=round] luts=2448, accuracy_bits=20.6, ffs=2399, throughput_msps=257, max_abs_err=6.42e-07 (2^-20.57), power_index=45.6
Front coverage: luts 964..2448 (HV reference 4000); accuracy_bits 13.2..20.6 (HV reference 13); data_width on the front 17..25 (registry 8..28).

Per family:
- pipelined: 350 evals, 163 feasible; max throughput seen 273 MSPS; best accuracy 23.56 bits; best feasible luts=964; feasible ranges: data_width 16..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.29 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 18726 in, 3080 out
- provider-reported cost: $0.0683
- full prompts and replies: `llm_trace.jsonl`

