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
`pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 964 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 991 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000102 (2^-13.26) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.67 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.79e-05 (2^-15.13) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.83 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.3 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (16 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` | 964 | 991 | 264.5 | 17 | 18.4 | 0.000102 (2^-13.26) | 13.26 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 973 | 967 | 264.5 | 17 | 18.2 | 0.000101 (2^-13.27) | 13.27 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 979 | 1006 | 264.5 | 17 | 18.7 | 9.49e-05 (2^-13.36) | 13.36 |
| 3 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 985 | 1017 | 264.5 | 18 | 18.8 | 8.35e-05 (2^-13.55) | 13.55 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round` | 1032 | 1023 | 264.5 | 17 | 19.3 | 8.22e-05 (2^-13.57) | 13.57 |
| 5 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=round` | 1046 | 1034 | 264.5 | 17 | 19.6 | 8.08e-05 (2^-13.60) | 13.60 |
| 6 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 1053 | 1043 | 264.5 | 18 | 19.7 | 6.9e-05 (2^-13.82) | 13.82 |
| 7 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc` | 1064 | 1090 | 264.5 | 18 | 20.3 | 6.86e-05 (2^-13.83) | 13.83 |
| 8 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=round` | 1071 | 1063 | 264.5 | 18 | 20.1 | 6.51e-05 (2^-13.91) | 13.91 |
| 9 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 1080 | 1102 | 264.5 | 18 | 20.5 | 5.94e-05 (2^-14.04) | 14.04 |
| 10 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1086 | 1076 | 264.5 | 18 | 20.3 | 5.46e-05 (2^-14.16) | 14.16 |
| 11 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 1102 | 1092 | 264.5 | 18 | 20.6 | 5.17e-05 (2^-14.24) | 14.24 |
| 12 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=round` | 1118 | 1104 | 264.5 | 18 | 20.9 | 5.03e-05 (2^-14.28) | 14.28 |
| 13 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1134 | 1120 | 264.5 | 18 | 21.2 | 4.52e-05 (2^-14.43) | 14.43 |
| 14 | `pipelined:data_width=18,n_iter=17,angle_guard=3,frac_guard=3,rounding=trunc` | 1169 | 1189 | 264.5 | 19 | 22.2 | 4.47e-05 (2^-14.45) | 14.45 |
| 15 | `pipelined:data_width=18,n_iter=17,angle_guard=3,frac_guard=3,rounding=round` | 1207 | 1191 | 264.5 | 19 | 22.5 | 3.11e-05 (2^-14.97) | 14.97 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 250 MSPS throughput constraint needs one result per cycle, so the iterative and unrolled_k families are excluded: they deliver a result only every several cycles, which gives less than 250 MSPS at any plausible Fmax. The search is therefore split between pipelined and pipelined_m. The error bound of 2^-13 means roughly 14 or more accuracy bits, so data_width is searched at 13-18 and n_iter at 11-16 to keep LUTs low. Guard bits and rounding are left open because they trade accuracy against LUTs. Later rounds can narrow the ranges once the numbers show where the feasible front lies.*)
- `pipelined` (50 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle is needed for 250 MSPS. Per-stage registers should give high Fmax, so this is the main candidate. Ranges target error <= 2^-13 with the fewest bits and iterations.
- `pipelined_m` (50 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages cuts FFs and may lower LUTs while still giving one result per cycle. A small m keeps Fmax at or above 250 MHz, so it is worth testing for fewer LUTs.

**Result (code):** 100 evaluations this round, 100 total; 16 feasible; hypervolume 2209 (n/a).

**LLM decision:** `refine` — Only pipelined has produced feasible designs (16 of 50 evals, 6 on the front), with LUTs from 968 to 1061 at 264 MSPS. pipelined_m found 0 feasible designs, with a maximum of 171 MSPS, so it is well below the 250 MSPS target. iterative and unrolled_k produce one result every several cycles (N+3 and ceil(N/k)+3), so they cannot reach 1 sample per clock at 250 MSPS and are not worth budget. The feasible region is narrow (data_width 16..18, n_iter 15..16, angle_guard 1..3, frac_guard 2..3). The best LUT count of 968 sits right at the error limit (2^-13.06), so the remaining gain is in the corners of that region. Next I will focus on pipelined with narrower ranges: n_iter 13..16 to cut stages and LUTs, data_width 15..18, and both rounding modes. I will keep a small share for pipelined_m with m=2, since it could save registers if Fmax holds.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2209 (gain this round: n/a (first round)).
Feasible designs: 16 of 100 evaluations (10 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 71% violate; best seen 5.94e-05 (2^-14.04)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=968, accuracy_bits=13.1, ffs=958, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.1
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=971, accuracy_bits=13.2, ffs=963, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.2
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts=979, accuracy_bits=13.4, ffs=1006, throughput_msps=264, max_abs_err=9.49e-05 (2^-13.36), power_index=18.7
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts=1046, accuracy_bits=13.6, ffs=1034, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=19.6
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=1061, accuracy_bits=13.7, ffs=1049, throughput_msps=264, max_abs_err=7.32e-05 (2^-13.74), power_index=19.8

Per family:
- pipelined: 50 evals, 16 feasible; max throughput seen 273 MSPS; best accuracy 13.74 bits; best feasible luts=968; feasible ranges: data_width 16..18, n_iter 15..16, angle_guard 1..3, frac_guard 2..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.04 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the one family that is feasible and push the LUT minimum down around the error boundary.*)
- `pipelined` (80 evals): data_width=15..18, n_iter=13..16, angle_guard=0..3, frac_guard=1..3, rounding=trunc|round. *Why:* Only family meeting throughput and error. Probing fewer iterations, narrower widths and lower guard bits to find lower-LUT designs that still reach 2^-13.
- `pipelined_m` (20 evals): data_width=15..18, n_iter=13..16, angle_guard=0..3, frac_guard=1..3, rounding=trunc|round, m=2..2. *Why:* Fmax was 171 MSPS at best in round 1, so only the smallest m has any chance of meeting 250 MSPS. Small probe to confirm.

**Result (code):** 100 evaluations this round, 200 total; 44 feasible; hypervolume 3667 (+66.1%).

**LLM decision:** `refine` — Only pipelined designs are feasible so far (44 of 130 evals), and the front is 964 to 1102 LUTs at 13.3 to 14.24 bits. pipelined_m reached only 171 MSPS with 0 feasible out of 70, so it is dropped. The iterative and unrolled_k families produce a result only every several cycles, so they cannot reach 250 MSPS and are not worth budget. The hypervolume gain was +66.1%, which is well above eps, so searching should continue. The feasible region is data_width 16..18, n_iter 15..16, angle_guard 1..3, frac_guard 1..3. The cheapest point sits right at the accuracy limit (13.26 bits against the 13 needed), so the next round should look for cheaper designs just inside it: data_width 15..17 with n_iter 14..15 and smaller guards, using round to recover accuracy. It should also cover the high-accuracy end (n_iter 16..17) to extend the front.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3667 (gain this round: +66.1%).
Feasible designs: 44 of 200 evaluations (21 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 35% violate; best seen 273
- max_abs_err <= 0.00012207: 70% violate; best seen 5.17e-05 (2^-14.24)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=991, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.4
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts=979, accuracy_bits=13.4, ffs=1006, throughput_msps=264, max_abs_err=9.49e-05 (2^-13.36), power_index=18.7
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] luts=985, accuracy_bits=13.4, ffs=978, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=18.5
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] luts=1002, accuracy_bits=13.4, ffs=997, throughput_msps=264, max_abs_err=8.97e-05 (2^-13.44), power_index=18.8
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] luts=1032, accuracy_bits=13.6, ffs=1023, throughput_msps=264, max_abs_err=8.22e-05 (2^-13.57), power_index=19.3
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts=1046, accuracy_bits=13.6, ffs=1034, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=19.6
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=1061, accuracy_bits=13.7, ffs=1049, throughput_msps=264, max_abs_err=7.32e-05 (2^-13.74), power_index=19.8
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1102, accuracy_bits=14.2, ffs=1092, throughput_msps=264, max_abs_err=5.17e-05 (2^-14.24), power_index=20.6

Per family:
- pipelined: 130 evals, 44 feasible; max throughput seen 273 MSPS; best accuracy 14.24 bits; best feasible luts=964; feasible ranges: data_width 16..18, n_iter 15..16, angle_guard 1..3, frac_guard 1..3
- pipelined_m: 70 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate nearly all of the budget on pipelined, around the cheapest feasible points, and keep a minimal check on pipelined_m at m=2.*)
- `pipelined` (90 evals): data_width=15..18, n_iter=13..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* All feasible designs come from this family. Probing smaller widths and iteration counts with guard bits and rounding may find fewer LUTs while keeping error at or below 2^-13.
- `pipelined_m` (10 evals): data_width=15..18, n_iter=13..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..2. *Why:* A small probe with m=2 (the lowest register spacing, so the highest Fmax) to confirm whether it can ever reach 250 MSPS, since it might save flip-flops.

**Result (code):** 100 evaluations this round, 300 total; 73 feasible; hypervolume 4043 (+10.2%).

**LLM decision:** `refine` — Only pipelined has produced feasible designs: 73 of 220 evals, with best luts=964 at 13.3 bits. Hypervolume rose 10.2% last round, so the front is still improving. pipelined_m gave 0 feasible in 80 evals, with max throughput 171 MSPS, below the 250 requirement. iterative and unrolled_k emit one result every several cycles, so they cannot reach 250 MSPS at one sample per clock, and I am not spending budget on them. The feasible region is data_width 16..18, n_iter 15..17, angle_guard 0..3, frac_guard 0..3. I will focus the last 100 evals there and lean on lower data_width, lower n_iter and cheap guard settings to reduce LUTs while keeping error <= 2^-13. A small share goes to data_width 15 to check that the lower edge is not too tight.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 4043 (gain this round: +10.2%).
Feasible designs: 73 of 300 evaluations (38 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 27% violate; best seen 273
- max_abs_err <= 0.00012207: 70% violate; best seen 4.73e-05 (2^-14.37)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=991, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.4
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts=979, accuracy_bits=13.4, ffs=1006, throughput_msps=264, max_abs_err=9.49e-05 (2^-13.36), power_index=18.7
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=985, accuracy_bits=13.5, ffs=1017, throughput_msps=264, max_abs_err=8.35e-05 (2^-13.55), power_index=18.8
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] luts=1032, accuracy_bits=13.6, ffs=1023, throughput_msps=264, max_abs_err=8.22e-05 (2^-13.57), power_index=19.3
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts=1046, accuracy_bits=13.6, ffs=1034, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=19.6
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1053, accuracy_bits=13.8, ffs=1043, throughput_msps=264, max_abs_err=6.9e-05 (2^-13.82), power_index=19.7
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc] luts=1064, accuracy_bits=13.8, ffs=1090, throughput_msps=264, max_abs_err=6.86e-05 (2^-13.83), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1080, accuracy_bits=14, ffs=1102, throughput_msps=264, max_abs_err=5.94e-05 (2^-14.04), power_index=20.5
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1102, accuracy_bits=14.2, ffs=1092, throughput_msps=264, max_abs_err=5.17e-05 (2^-14.24), power_index=20.6
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1156, accuracy_bits=14.4, ffs=1143, throughput_msps=264, max_abs_err=4.73e-05 (2^-14.37), power_index=21.6

Per family:
- pipelined: 220 evals, 73 feasible; max throughput seen 273 MSPS; best accuracy 14.37 bits; best feasible luts=964; feasible ranges: data_width 16..18, n_iter 15..17, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 80 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *Concentrate the remaining budget on the pipelined region where all feasible points lie. Drop pipelined_m (0 feasible, max 171 MSPS) and the multi-cycle families (cannot deliver 1 sample/clock).*)
- `pipelined` (100 evals): data_width=15..18, n_iter=14..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* It is the only family meeting 250 MSPS and the error bound. Searching the neighbourhood of the current front, including data_width 15 and n_iter 14, may lower LUTs and fill the accuracy range between 13 and 14.4 bits.

**Result (code):** 100 evaluations this round, 400 total; 112 feasible; hypervolume 5745 (+42.1%).

**LLM decision:** `stop` — The budget is spent (400 of 400 evaluations, round 4 of 4), so only stop or infeasible is allowed. The spec is feasible: 112 of 400 evaluations are feasible, and the front has 16 designs. Every design on it is pipelined with throughput 264 MSPS (>= 250) and max error from 3.11e-05 to 0.000102 (<= 0.000122). The selection rule is min LUTs, and the lowest-LUT feasible design is pipelined data_width=18 n_iter=15 angle_guard=1 frac_guard=2 trunc, at 964 LUTs and 13.3 accuracy bits. The cheapest feasible LUTs found are also on the front. Iterative and unrolled_k were never explored, but they produce a result only every several cycles, so they cannot reach one sample per clock at 250 MSPS. pipelined_m had 0 feasible designs out of 80 and a best throughput of 171 MSPS. Stopping and selecting the 964-LUT design is justified.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 5745 (gain this round: +42.1%).
Feasible designs: 112 of 400 evaluations (52 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 20% violate; best seen 273
- max_abs_err <= 0.00012207: 68% violate; best seen 3.11e-05 (2^-14.97)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=991, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.4
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts=979, accuracy_bits=13.4, ffs=1006, throughput_msps=264, max_abs_err=9.49e-05 (2^-13.36), power_index=18.7
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=985, accuracy_bits=13.5, ffs=1017, throughput_msps=264, max_abs_err=8.35e-05 (2^-13.55), power_index=18.8
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts=1046, accuracy_bits=13.6, ffs=1034, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=19.6
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc] luts=1064, accuracy_bits=13.8, ffs=1090, throughput_msps=264, max_abs_err=6.86e-05 (2^-13.83), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=round] luts=1071, accuracy_bits=13.9, ffs=1063, throughput_msps=264, max_abs_err=6.51e-05 (2^-13.91), power_index=20.1
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1086, accuracy_bits=14.2, ffs=1076, throughput_msps=264, max_abs_err=5.46e-05 (2^-14.16), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] luts=1118, accuracy_bits=14.3, ffs=1104, throughput_msps=264, max_abs_err=5.03e-05 (2^-14.28), power_index=20.9
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1134, accuracy_bits=14.4, ffs=1120, throughput_msps=264, max_abs_err=4.52e-05 (2^-14.43), power_index=21.2
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5

Per family:
- pipelined: 320 evals, 112 feasible; max throughput seen 273 MSPS; best accuracy 14.97 bits; best feasible luts=964; feasible ranges: data_width 16..18, n_iter 15..17, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 80 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 22898 in, 3383 out
- provider-reported cost: $0.0796
- full prompts and replies: `llm_trace.jsonl`

