# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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
`pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 964 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 987 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000117 (2^-13.06) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 3.84 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 3.15e-05 (2^-14.96) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.03 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.1 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (13 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 964 | 987 | 264.5 | 17 | 18.3 | 0.000117 (2^-13.06) | 13.06 |
| 1 | `pipelined:data_width=16,n_iter=15,angle_guard=3,frac_guard=3,rounding=round` | 968 | 958 | 264.5 | 17 | 18.1 | 0.000117 (2^-13.06) | 13.06 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 1008 | 1032 | 264.5 | 17 | 19.2 | 8.58e-05 (2^-13.51) | 13.51 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=round` | 1046 | 1034 | 264.5 | 17 | 19.6 | 8.08e-05 (2^-13.60) | 13.60 |
| 4 | `pipelined:data_width=18,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1051 | 1081 | 264.5 | 19 | 20 | 7.75e-05 (2^-13.65) | 13.65 |
| 5 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 1055 | 1047 | 264.5 | 18 | 19.8 | 6.45e-05 (2^-13.92) | 13.92 |
| 6 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 1080 | 1102 | 264.5 | 18 | 20.5 | 5.94e-05 (2^-14.04) | 14.04 |
| 7 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc` | 1096 | 1118 | 264.5 | 18 | 20.8 | 5.44e-05 (2^-14.17) | 14.17 |
| 8 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 1102 | 1092 | 264.5 | 18 | 20.6 | 5.17e-05 (2^-14.24) | 14.24 |
| 9 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=round` | 1118 | 1104 | 264.5 | 18 | 20.9 | 5.03e-05 (2^-14.28) | 14.28 |
| 10 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1134 | 1120 | 264.5 | 18 | 21.2 | 4.52e-05 (2^-14.43) | 14.43 |
| 11 | `pipelined:data_width=18,n_iter=17,angle_guard=2,frac_guard=3,rounding=round` | 1190 | 1173 | 264.5 | 19 | 22.2 | 4.11e-05 (2^-14.57) | 14.57 |
| 12 | `pipelined:data_width=18,n_iter=17,angle_guard=3,frac_guard=3,rounding=round` | 1207 | 1191 | 264.5 | 19 | 22.5 | 3.11e-05 (2^-14.97) | 14.97 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires one sample per clock at >=250 MSPS, so only the pipelined families can meet the throughput constraint. The iterative and unrolled_k families produce one result every several cycles and would need an unrealistically high clock, so they are excluded. The max error of 2^-13 needs roughly 14 or more bits of accuracy at the output, so the ranges for width and iterations sit around that point and leave room for guard bits and rounding. The first round maps the LUT vs accuracy trade-off and shows whether pipelined_m with a small m is viable. Later rounds can narrow the ranges based on what the front shows.*)
- `pipelined` (58 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle is needed for 250 MSPS, and the plain pipelined form with registers at every stage is the most likely to reach the Fmax needed. Width 13-18 and 11-16 iterations cover the 2^-13 error target with a margin for guard bits.
- `pipelined_m` (42 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages cuts FFs and so LUTs plus FFs, and may still reach 250 MHz. A small m keeps the Fmax risk low while this family is checked for area savings.

**Result (code):** 100 evaluations this round, 100 total; 8 feasible; hypervolume 2329 (n/a).

**LLM decision:** `refine` — Only pipelined has produced feasible designs (8 of 58 evals, 5 unique). The best has 1003 LUTs at 13.1 accuracy bits. These all sit in a tight region: data_width 16..18, n_iter 16, angle_guard 1..3, frac_guard 2..3, rounding=round, throughput 264 MSPS against the 250 floor. pipelined_m reached only 171 MSPS across 42 evals with none feasible, so it is probably not worth much budget. iterative and unrolled_k yield one result every several cycles, so they cannot reach 250 MSPS at one sample per clock, and their Fmax would have to exceed the pipelined values to compensate. That makes them unpromising. The best seen error (5.46e-05) shows accuracy slack, so narrower data widths and fewer iterations may cut LUTs while still meeting 2^-13. The next round concentrates on pipelined with data_width 14..18, n_iter 13..17, small guard bits and round, and keeps a small pipelined_m share with m=2..3 to check whether its Fmax can reach 250 MSPS.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2329 (gain this round: n/a (first round)).
Feasible designs: 8 of 100 evaluations (5 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 42% violate; best seen 273
- max_abs_err <= 0.00012207: 72% violate; best seen 5.46e-05 (2^-14.16)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1003, accuracy_bits=13.1, ffs=995, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.8
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1021, accuracy_bits=13.2, ffs=1011, throughput_msps=264, max_abs_err=0.000109 (2^-13.16), power_index=19.1
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=3 rounding=round] luts=1053, accuracy_bits=13.2, ffs=1039, throughput_msps=264, max_abs_err=0.000104 (2^-13.23), power_index=19.7
- pipelined [data_width=17 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] luts=1069, accuracy_bits=13.6, ffs=1055, throughput_msps=264, max_abs_err=8.09e-05 (2^-13.59), power_index=20
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=round] luts=1102, accuracy_bits=13.8, ffs=1088, throughput_msps=264, max_abs_err=7.04e-05 (2^-13.79), power_index=20.6

Per family:
- pipelined: 58 evals, 8 feasible; max throughput seen 273 MSPS; best accuracy 13.79 bits; best feasible luts=1003; feasible ranges: data_width 16..18, n_iter 16..16, angle_guard 1..3, frac_guard 2..3
- pipelined_m: 42 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.16 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the pipelined region that produced feasible designs and probe smaller widths and iteration counts to reduce LUTs. Keep a minimal pipelined_m probe with small m only.*)
- `pipelined` (80 evals): data_width=14..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..3, rounding=round|trunc. *Why:* All feasible designs are here. Fewer iterations and narrower widths may lower LUTs while the error stays under 2^-13, given the accuracy slack.
- `pipelined_m` (20 evals): data_width=14..18, n_iter=13..17, angle_guard=0..3, frac_guard=0..3, rounding=round, m=2..3. *Why:* Fewer registers could reduce FFs, but it only helps if Fmax stays at or above 250 MSPS. Small m is the only plausible case, so it gets a small probing share.

**Result (code):** 100 evaluations this round, 200 total; 29 feasible; hypervolume 3292 (+41.3%).

**LLM decision:** `refine` — Only pipelined has produced feasible designs: 29 of 138 evals, with the best at luts=1003 and 13.1 bits. The front is concentrated at data_width 16..18, n_iter 16..17, and the hypervolume gain of +41.3% last round shows it is still improving. pipelined_m has 0 feasible designs out of 62, with max throughput 171 MSPS against the 250 requirement, so it should be dropped. iterative and unrolled_k produce one result every several cycles, so they cannot reach 1 result/cycle at 250 MSPS and are not worth budget. The error constraint is the hard one (74% violate). The next step is to refine around the feasible region, probing slightly lower widths and iteration counts (data_width 14..18, n_iter 14..17) to cut LUTs while holding error <= 2^-13. A small pipelined_m share is kept for m=2 at the same ranges, as a check that it cannot reach 250 MSPS.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3292 (gain this round: +41.3%).
Feasible designs: 29 of 200 evaluations (19 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 31% violate; best seen 273
- max_abs_err <= 0.00012207: 74% violate; best seen 5.17e-05 (2^-14.24)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1003, accuracy_bits=13.1, ffs=995, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.8
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts=1017, accuracy_bits=13.5, ffs=1045, throughput_msps=264, max_abs_err=8.82e-05 (2^-13.47), power_index=19.4
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1048, accuracy_bits=13.6, ffs=1069, throughput_msps=264, max_abs_err=8.14e-05 (2^-13.58), power_index=19.9
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1051, accuracy_bits=13.7, ffs=1081, throughput_msps=264, max_abs_err=7.75e-05 (2^-13.65), power_index=20
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1055, accuracy_bits=13.9, ffs=1047, throughput_msps=264, max_abs_err=6.45e-05 (2^-13.92), power_index=19.8
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1080, accuracy_bits=14, ffs=1102, throughput_msps=264, max_abs_err=5.94e-05 (2^-14.04), power_index=20.5
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1122, accuracy_bits=14.1, ffs=1113, throughput_msps=264, max_abs_err=5.64e-05 (2^-14.11), power_index=21

Per family:
- pipelined: 138 evals, 29 feasible; max throughput seen 273 MSPS; best accuracy 14.11 bits; best feasible luts=1003; feasible ranges: data_width 16..18, n_iter 16..17, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 62 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the pipelined region that yields feasible designs and extend it slightly downward in width and iterations to reduce LUTs. Keep a minimal probe of pipelined_m.*)
- `pipelined` (90 evals): data_width=14..18, n_iter=13..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* All feasible designs are here. Probing just below the current minimum (width 16, 16 iterations) may find cheaper designs that still meet 2^-13 error.
- `pipelined_m` (10 evals): data_width=15..18, n_iter=14..17, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..2. *Why:* m=2 is the lowest-latency setting and the most likely to hit 250 MSPS, so this tests whether it can; it was infeasible at up to 171 MSPS so far.

**Result (code):** 100 evaluations this round, 300 total; 65 feasible; hypervolume 5728 (+74.0%).

**LLM decision:** `refine` — Hypervolume rose +74% last round and the front is still moving, so the search should continue. Only pipelined has produced feasible designs: 65 feasible, 12 on the front, with the lowest LUTs at 964 (data_width 16-17, n_iter 15, frac_guard 3). pipelined_m has 0 feasible in 72 evals, with max throughput 171 MSPS, so it can't reach 250 MSPS and should be dropped. iterative and unrolled_k produce one result every several cycles, so their throughput is below Fmax and cannot reach 250 MSPS; I will not spend budget on them. The error constraint is violated by 71% of evals, so ranges should be tightened around the feasible region: data_width 15..18, n_iter 13..17, angle_guard 0..3, frac_guard 0..3. The designs near the 2^-13 boundary are the cheapest, so a slightly lower data_width and n_iter, with round, may reduce LUTs further. The remaining 100 evals go to pipelined in this region.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 5728 (gain this round: +74.0%).
Feasible designs: 65 of 300 evaluations (37 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 24% violate; best seen 273
- max_abs_err <= 0.00012207: 71% violate; best seen 3.11e-05 (2^-14.97)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=964, accuracy_bits=13.1, ffs=987, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.3
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=968, accuracy_bits=13.1, ffs=958, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.1
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1051, accuracy_bits=13.7, ffs=1081, throughput_msps=264, max_abs_err=7.75e-05 (2^-13.65), power_index=20
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1055, accuracy_bits=13.9, ffs=1047, throughput_msps=264, max_abs_err=6.45e-05 (2^-13.92), power_index=19.8
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1080, accuracy_bits=14, ffs=1102, throughput_msps=264, max_abs_err=5.94e-05 (2^-14.04), power_index=20.5
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1096, accuracy_bits=14.2, ffs=1118, throughput_msps=264, max_abs_err=5.44e-05 (2^-14.17), power_index=20.8
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1134, accuracy_bits=14.4, ffs=1120, throughput_msps=264, max_abs_err=4.52e-05 (2^-14.43), power_index=21.2
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] luts=1190, accuracy_bits=14.6, ffs=1173, throughput_msps=264, max_abs_err=4.11e-05 (2^-14.57), power_index=22.2
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5

Per family:
- pipelined: 228 evals, 65 feasible; max throughput seen 273 MSPS; best accuracy 14.97 bits; best feasible luts=964; feasible ranges: data_width 16..18, n_iter 15..17, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 72 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *pipelined_m is infeasible on throughput (max 171 MSPS) and iterative/unrolled_k cannot deliver one result per clock. Concentrate the final round on the pipelined feasible region to push the min-LUT and accuracy front.*)
- `pipelined` (100 evals): data_width=15..18, n_iter=13..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only family meeting throughput >= 250 MSPS and error <= 2^-13; narrowing around the feasible region (W 16-18, N 15-17) with slight extension downward to find lower-LUT designs at the accuracy boundary.

**Result (code):** 100 evaluations this round, 400 total; 116 feasible; hypervolume 5729 (+0.0%).

**LLM decision:** `stop` — Budget is exhausted (400 of 400 evaluations, round 4 of 4) and the final round gained +0.0% hypervolume, so the front has converged. The feasible front has 13 designs, all pipelined, spanning 964 to 1207 LUTs and 13.1 to 15 accuracy bits. The cheapest feasible design meets both constraints: pipelined W=17, N=15, angle_guard=2, frac_guard=3, trunc gives 964 LUTs, 264 MSPS (>=250) and max error 0.000117 (<=0.00012207). Under the select rule (min LUTs) it is the pick. The pipelined_m designs reached only 171 MSPS across 72 evals with none feasible. Iterative and unrolled_k produce one result every several cycles, so they cannot reach one sample per clock at 250 MSPS. The problem is feasible, so `infeasible` does not apply.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 5729 (gain this round: +0.0%).
Feasible designs: 116 of 400 evaluations (46 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 18% violate; best seen 273
- max_abs_err <= 0.00012207: 65% violate; best seen 3.11e-05 (2^-14.97)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=964, accuracy_bits=13.1, ffs=987, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.3
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=968, accuracy_bits=13.1, ffs=958, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.1
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts=1046, accuracy_bits=13.6, ffs=1034, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=19.6
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1051, accuracy_bits=13.7, ffs=1081, throughput_msps=264, max_abs_err=7.75e-05 (2^-13.65), power_index=20
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1055, accuracy_bits=13.9, ffs=1047, throughput_msps=264, max_abs_err=6.45e-05 (2^-13.92), power_index=19.8
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1096, accuracy_bits=14.2, ffs=1118, throughput_msps=264, max_abs_err=5.44e-05 (2^-14.17), power_index=20.8
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1102, accuracy_bits=14.2, ffs=1092, throughput_msps=264, max_abs_err=5.17e-05 (2^-14.24), power_index=20.6
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] luts=1118, accuracy_bits=14.3, ffs=1104, throughput_msps=264, max_abs_err=5.03e-05 (2^-14.28), power_index=20.9
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] luts=1190, accuracy_bits=14.6, ffs=1173, throughput_msps=264, max_abs_err=4.11e-05 (2^-14.57), power_index=22.2
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5

Per family:
- pipelined: 328 evals, 116 feasible; max throughput seen 273 MSPS; best accuracy 14.97 bits; best feasible luts=964; feasible ranges: data_width 16..18, n_iter 15..17, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 72 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 22568 in, 3449 out
- provider-reported cost: $0.0796
- full prompts and replies: `llm_trace.jsonl`

