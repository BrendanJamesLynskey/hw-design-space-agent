# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 161 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 93 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 13.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 75.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.143 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000835 (2^-10.23) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.84 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.00024 (2^-12.02) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.97 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.2 | exact: bit-accurate model, exhaustive (32768 angles) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (29 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` | 161 | 93 | 13.2 | 15 | 0.143 | 0.000835 (2^-10.23) | 10.23 |
| 1 | `iterative:data_width=15,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 166 | 91 | 10.4 | 19 | 0.184 | 0.00081 (2^-10.27) | 10.27 |
| 2 | `iterative:data_width=15,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.7 | 17 | 0.168 | 0.000599 (2^-10.71) | 10.71 |
| 3 | `iterative:data_width=15,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 172 | 94 | 11.7 | 17 | 0.17 | 0.000546 (2^-10.84) | 10.84 |
| 4 | `iterative:data_width=14,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 180 | 94 | 10.4 | 19 | 0.195 | 0.000533 (2^-10.87) | 10.87 |
| 5 | `iterative:data_width=16,n_iter=13,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 12.4 | 16 | 0.168 | 0.00041 (2^-11.25) | 11.25 |
| 6 | `iterative:data_width=17,n_iter=14,angle_guard=-1,frac_guard=0,rounding=trunc` | 180 | 100 | 11.7 | 17 | 0.179 | 0.000375 (2^-11.38) | 11.38 |
| 7 | `iterative:data_width=17,n_iter=14,angle_guard=-1,frac_guard=0,rounding=round` | 187 | 100 | 11.7 | 17 | 0.184 | 0.000369 (2^-11.40) | 11.40 |
| 8 | `iterative:data_width=17,n_iter=14,angle_guard=2,frac_guard=0,rounding=trunc` | 185 | 103 | 11.4 | 17 | 0.184 | 0.000338 (2^-11.53) | 11.53 |
| 9 | `iterative:data_width=17,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 189 | 101 | 11.0 | 18 | 0.196 | 0.000251 (2^-11.96) | 11.96 |
| 10 | `iterative:data_width=17,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 193 | 103 | 10.2 | 19 | 0.211 | 0.000139 (2^-12.81) | 12.81 |
| 11 | `iterative:data_width=17,n_iter=16,angle_guard=2,frac_guard=4,rounding=trunc` | 224 | 111 | 10.2 | 19 | 0.239 | 8.91e-05 (2^-13.45) | 13.45 |
| 12 | `iterative:data_width=20,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 229 | 119 | 10.5 | 18 | 0.236 | 7.16e-05 (2^-13.77) | 13.77 |
| 13 | `iterative:data_width=19,n_iter=19,angle_guard=4,frac_guard=0,rounding=round` | 247 | 116 | 7.1 | 22 | 0.301 | 3.74e-05 (2^-14.71) | 14.71 |
| 14 | `iterative:data_width=20,n_iter=28,angle_guard=1,frac_guard=1,rounding=trunc` | 265 | 120 | 5.1 | 31 | 0.448 | 3.45e-05 (2^-14.82) | 14.82 |
| 15 | `iterative:data_width=23,n_iter=24,angle_guard=0,frac_guard=0,rounding=trunc` | 300 | 132 | 5.8 | 27 | 0.438 | 6.55e-06 (2^-17.22) | 17.22 |
| 16 | `iterative:data_width=22,n_iter=21,angle_guard=1,frac_guard=2,rounding=trunc` | 315 | 132 | 6.5 | 24 | 0.404 | 5.09e-06 (2^-17.58) | 17.58 |
| 17 | `iterative:data_width=23,n_iter=27,angle_guard=3,frac_guard=0,rounding=round` | 322 | 135 | 5.2 | 30 | 0.515 | 2.9e-06 (2^-18.39) | 18.39 |
| 18 | `iterative:data_width=24,n_iter=24,angle_guard=0,frac_guard=0,rounding=round` | 331 | 137 | 5.8 | 27 | 0.475 | 2.49e-06 (2^-18.62) | 18.62 |
| 19 | `iterative:data_width=25,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc` | 336 | 143 | 5.8 | 27 | 0.487 | 1.48e-06 (2^-19.36) | 19.36 |
| 20 | `iterative:data_width=25,n_iter=24,angle_guard=0,frac_guard=1,rounding=trunc` | 350 | 144 | 5.8 | 27 | 0.502 | 1.14e-06 (2^-19.74) | 19.74 |
| 21 | `iterative:data_width=25,n_iter=24,angle_guard=3,frac_guard=1,rounding=trunc` | 356 | 147 | 5.7 | 27 | 0.511 | 8.18e-07 (2^-20.22) | 20.22 |
| 22 | `iterative:data_width=26,n_iter=27,angle_guard=0,frac_guard=1,rounding=trunc` | 375 | 149 | 5.1 | 30 | 0.592 | 6.7e-07 (2^-20.51) | 20.51 |
| 23 | `iterative:data_width=24,n_iter=24,angle_guard=4,frac_guard=4,rounding=trunc` | 387 | 149 | 5.7 | 27 | 0.545 | 5.28e-07 (2^-20.85) | 20.85 |
| 24 | `iterative:data_width=26,n_iter=27,angle_guard=3,frac_guard=2,rounding=trunc` | 398 | 154 | 5.1 | 30 | 0.623 | 2.62e-07 (2^-21.86) | 21.86 |
| 25 | `iterative:data_width=28,n_iter=24,angle_guard=0,frac_guard=1,rounding=trunc` | 403 | 159 | 5.7 | 27 | 0.571 | 2.35e-07 (2^-22.02) | 22.02 |
| 26 | `iterative:data_width=28,n_iter=28,angle_guard=1,frac_guard=1,rounding=trunc` | 415 | 160 | 4.9 | 31 | 0.671 | 1.27e-07 (2^-22.90) | 22.90 |
| 27 | `iterative:data_width=28,n_iter=28,angle_guard=2,frac_guard=1,rounding=round` | 491 | 161 | 4.9 | 31 | 0.761 | 6.73e-08 (2^-23.82) | 23.82 |
| 28 | `iterative:data_width=28,n_iter=28,angle_guard=4,frac_guard=1,rounding=round` | 495 | 163 | 4.9 | 31 | 0.767 | 5.57e-08 (2^-24.10) | 24.10 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec needs only 1 MSPS, so throughput is not the bottleneck and area dominates. Iterative designs are the main candidate, with most of the budget going there. Narrowing data_width to 10-16 and n_iter to 8-16 focuses the search on designs near the 2^-10 error limit, where accuracy_bits and area trade off. Unrolled_k and pipelined_m get small probes to confirm they are dominated.*)
- `iterative` (67 evals): data_width=10..16, n_iter=8..16, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* A shared single-datapath design should minimise LUTs+FFs. At N+3 cycles per result it needs only modest Fmax to reach 1 MSPS, so it is the most plausible area winner. Ranges cover the width and iteration counts needed for 2^-10 error, i.e. about 10-bit accuracy plus guard bits.
- `unrolled_k` (25 evals): data_width=10..16, n_iter=8..16, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* A small k cuts cycle count and the FSM overhead might offset the extra shifters. It may land on the low-area front at higher accuracy, so it is worth a smaller probe.
- `pipelined_m` (8 evals): data_width=10..14, n_iter=8..14, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=4..8. *Why:* Few pipeline registers with a large m is a low-FF pipelined option, but it likely costs more area than iterative. I'm using a small share to check that assumption.

**Result (code):** 100 evaluations this round, 100 total; 33 feasible; hypervolume 3006 (n/a).

**LLM decision:** `refine` — Only the iterative family is on the front (5 designs, luts_plus_ffs 253..306, accuracy 10.2..12.5 bits). unrolled_k's best feasible area is 378, which the iterative front dominates. pipelined_m had 0 feasible designs out of 8 and its throughput of 103 MSPS far exceeds the 1 MSPS need, so it only costs area. Iterative reaches 10-19 MSPS, well above the constraint. The feasible region is data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..3. I will concentrate the budget on the iterative family around this region to push the area minimum below 253 and extend accuracy higher at low cost. Wider data_width and n_iter are kept to leave room on both sides. A small share goes to unrolled_k as a check.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3006 (gain this round: n/a (first round)).
Feasible designs: 33 of 100 evaluations (21 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 67% violate; best seen 0.000175 (2^-12.48)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=16 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts_plus_ffs=266, accuracy_bits=10.6, luts=170, ffs=96, throughput_msps=10.4, max_abs_err=0.000643 (2^-10.60), power_index=0.19
- iterative [data_width=16 n_iter=13 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.3, luts=181, ffs=98, throughput_msps=12.4, max_abs_err=0.00041 (2^-11.25), power_index=0.168
- iterative [data_width=16 n_iter=16 angle_guard=0 frac_guard=2 rounding=trunc] luts_plus_ffs=289, accuracy_bits=11.4, luts=189, ffs=100, throughput_msps=10.4, max_abs_err=0.000375 (2^-11.38), power_index=0.207
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=306, accuracy_bits=12.5, luts=203, ffs=104, throughput_msps=10.2, max_abs_err=0.000175 (2^-12.48), power_index=0.219
Front coverage: luts_plus_ffs 253..306 (HV reference 1500); accuracy_bits 10.2..12.5 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 67 evals, 21 feasible; max throughput seen 18.9 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..3
- unrolled_k: 25 evals, 12 feasible; max throughput seen 15.8 MSPS; best accuracy 10.82 bits; best feasible luts_plus_ffs=378; feasible ranges: data_width 13..15, n_iter 12..16, angle_guard 0..3, frac_guard 1..3, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 7.75 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on iterative, which dominates the front. Keep a small probe of unrolled_k, and drop the pipelined families because their area is too high for a spec that needs only 1 MSPS.*)
- `iterative` (84 evals): data_width=12..17, n_iter=10..16, angle_guard=-2..3, frac_guard=0..4, rounding=trunc|round. *Why:* The iterative family holds the whole front and has the smallest area. Searching slightly wider than the feasible box may find smaller designs near the 2^-10 error limit, plus higher-accuracy points.
- `unrolled_k` (16 evals): data_width=12..16, n_iter=10..16, angle_guard=-2..4, frac_guard=0..3, rounding=trunc|round, k=2..2. *Why:* This is a small check with k=2 for any low-area unrolled design. Its best area so far (378) is worse than the iterative front.

**Result (code):** 100 evaluations this round, 200 total; 92 feasible; hypervolume 4178 (+39.0%).

**LLM decision:** `refine` — The front is all iterative, with luts_plus_ffs 253..335 and accuracy 10.2..13.5 bits. Throughput of 10-13 MSPS is far above the 1 MSPS floor, so iterative has slack. Unrolled_k is dominated (best feasible 342) and pipelined_m has 0 feasible out of 8, so both would only add area. The front already reaches 13.5 bits, but the low-area end (data_width 13-15, n_iter 11-13) is thinly sampled. The cheapest design (253) sits right at the 10.2-bit edge, so the next gain is shaving area while holding error <= 2^-10, plus filling the accuracy range between 11 and 14 bits. I will concentrate on iterative around data_width 12..18 and n_iter 10..18, with all guard and rounding options. A small unrolled_k share keeps a check on k=2 at narrow widths.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4178 (gain this round: +39.0%).
Feasible designs: 92 of 200 evaluations (70 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 54% violate; best seen 8.91e-05 (2^-13.45)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=11.7, max_abs_err=0.000599 (2^-10.71), power_index=0.168
- iterative [data_width=15 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=265, accuracy_bits=10.8, luts=172, ffs=94, throughput_msps=11.7, max_abs_err=0.000546 (2^-10.84), power_index=0.17
- iterative [data_width=16 n_iter=13 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.3, luts=181, ffs=98, throughput_msps=12.4, max_abs_err=0.00041 (2^-11.25), power_index=0.168
- iterative [data_width=17 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc] luts_plus_ffs=280, accuracy_bits=11.4, luts=180, ffs=100, throughput_msps=11.7, max_abs_err=0.000375 (2^-11.38), power_index=0.179
- iterative [data_width=17 n_iter=14 angle_guard=-1 frac_guard=0 rounding=round] luts_plus_ffs=287, accuracy_bits=11.4, luts=187, ffs=100, throughput_msps=11.7, max_abs_err=0.000369 (2^-11.40), power_index=0.184
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=trunc] luts_plus_ffs=288, accuracy_bits=11.5, luts=185, ffs=103, throughput_msps=11.4, max_abs_err=0.000338 (2^-11.53), power_index=0.184
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=290, accuracy_bits=12, luts=189, ffs=101, throughput_msps=11, max_abs_err=0.000251 (2^-11.96), power_index=0.196
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=296, accuracy_bits=12.8, luts=193, ffs=103, throughput_msps=10.2, max_abs_err=0.000139 (2^-12.81), power_index=0.211
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=4 rounding=trunc] luts_plus_ffs=335, accuracy_bits=13.5, luts=224, ffs=111, throughput_msps=10.2, max_abs_err=8.91e-05 (2^-13.45), power_index=0.239
Front coverage: luts_plus_ffs 253..335 (HV reference 1500); accuracy_bits 10.2..13.5 (HV reference 10); data_width on the front 15..17 (registry 8..28).

Per family:
- iterative: 151 evals, 74 feasible; max throughput seen 18.9 MSPS; best accuracy 13.45 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 13..17, n_iter 12..16, angle_guard -2..3, frac_guard 0..4
- unrolled_k: 41 evals, 18 feasible; max throughput seen 15.8 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 13..15, n_iter 12..16, angle_guard 0..4, frac_guard 0..3, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 7.75 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the iterative family near the low-area, near-limit-accuracy region, with a minimal unrolled_k probe.*)
- `iterative` (34 evals): data_width=12..18, n_iter=10..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* All front points are iterative, so spend most of the budget around the feasible region (data_width 13..17, n_iter 12..16) and extend it slightly to find cheaper designs near the 2^-10 error limit and higher-accuracy designs.
- `unrolled_k` (6 evals): data_width=13..16, n_iter=11..15, angle_guard=-2..4, frac_guard=0..2, rounding=trunc|round, k=2..2. *Why:* Best feasible unrolled_k is 342, worse than the iterative 253. A small probe at k=2 and narrow widths checks that it is dominated.

**Result (code):** 40 evaluations this round, 240 total; 115 feasible; hypervolume 4178 (+0.0%).

**LLM decision:** `stop` — This is the final round and the front has stopped improving: the hypervolume gain this round was +0.0% at 4178. The front has 10 feasible designs, all iterative, from luts_plus_ffs 253 (10.2 bits) to 335 (13.5 bits). The selected design under min luts_plus_ffs is iterative W=15, N=12, angle_guard=2, frac_guard=0, round. It has 253 LUTs+FFs, 13.2 MSPS against the 1 MSPS floor, and error 0.000835, which is inside the 2^-10 limit (0.000977). Throughput is not binding, since every design has 0% violation and the best seen is 103 MSPS. Area is the driver, and the one-rotation-per-cycle iterative datapath is the smallest in the registry. unrolled_k reached only 342 at best, which the iterative front already dominates. pipelined_m got 0 feasible designs in 8 evals, with best accuracy 7.75 bits, and pipelined stages would add far more area, so neither can compete on this spec.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 4178 (gain this round: +0.0%).
Feasible designs: 115 of 240 evaluations (87 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 52% violate; best seen 8.91e-05 (2^-13.45)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=11.7, max_abs_err=0.000599 (2^-10.71), power_index=0.168
- iterative [data_width=15 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=265, accuracy_bits=10.8, luts=172, ffs=94, throughput_msps=11.7, max_abs_err=0.000546 (2^-10.84), power_index=0.17
- iterative [data_width=16 n_iter=13 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.3, luts=181, ffs=98, throughput_msps=12.4, max_abs_err=0.00041 (2^-11.25), power_index=0.168
- iterative [data_width=17 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc] luts_plus_ffs=280, accuracy_bits=11.4, luts=180, ffs=100, throughput_msps=11.7, max_abs_err=0.000375 (2^-11.38), power_index=0.179
- iterative [data_width=17 n_iter=14 angle_guard=-1 frac_guard=0 rounding=round] luts_plus_ffs=287, accuracy_bits=11.4, luts=187, ffs=100, throughput_msps=11.7, max_abs_err=0.000369 (2^-11.40), power_index=0.184
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=trunc] luts_plus_ffs=288, accuracy_bits=11.5, luts=185, ffs=103, throughput_msps=11.4, max_abs_err=0.000338 (2^-11.53), power_index=0.184
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=290, accuracy_bits=12, luts=189, ffs=101, throughput_msps=11, max_abs_err=0.000251 (2^-11.96), power_index=0.196
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=296, accuracy_bits=12.8, luts=193, ffs=103, throughput_msps=10.2, max_abs_err=0.000139 (2^-12.81), power_index=0.211
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=4 rounding=trunc] luts_plus_ffs=335, accuracy_bits=13.5, luts=224, ffs=111, throughput_msps=10.2, max_abs_err=8.91e-05 (2^-13.45), power_index=0.239
Front coverage: luts_plus_ffs 253..335 (HV reference 1500); accuracy_bits 10.2..13.5 (HV reference 10); data_width on the front 15..17 (registry 8..28).

Per family:
- iterative: 185 evals, 97 feasible; max throughput seen 18.9 MSPS; best accuracy 13.45 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 13..18, n_iter 12..17, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 47 evals, 18 feasible; max throughput seen 15.8 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 13..15, n_iter 12..16, angle_guard 0..4, frac_guard 0..3, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 7.75 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (10 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 258 feasible; hypervolume 1.492e+04 (+257.1%).

**No LLM call** (code's front-mapping round): This is the final round and the front has stopped improving: the hypervolume gain this round was +0.0% at 4178. The front has 10 feasible designs, all iterative, from luts_plus_ffs 253 (10.2 bits) to 335 (13.5 bits). The selected design under min luts_plus_ffs is iterative W=15, N=12, angle_guard=2, frac_guard=0, round. It has 253 LUTs+FFs, 13.2 MSPS against the 1 MSPS floor, and error 0.000835, which is inside the 2^-10 limit (0.000977). Throughput is not binding, since every design has 0% violation and the best seen is 103 MSPS. Area is the driver, and the one-rotation-per-cycle iterative datapath is the smallest in the registry. unrolled_k reached only 342 at best, which the iterative front already dominates. pipelined_m got 0 feasible designs in 8 evals, with best accuracy 7.75 bits, and pipelined stages would add far more area, so neither can compete on this spec.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.492e+04 (gain this round: +257.1%).
Feasible designs: 258 of 400 evaluations (216 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 103
- max_abs_err <= 0.000976562: 36% violate; best seen 5.57e-08 (2^-24.10)

Pareto front (feasible, 29 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=265, accuracy_bits=10.8, luts=172, ffs=94, throughput_msps=11.7, max_abs_err=0.000546 (2^-10.84), power_index=0.17
- iterative [data_width=17 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc] luts_plus_ffs=280, accuracy_bits=11.4, luts=180, ffs=100, throughput_msps=11.7, max_abs_err=0.000375 (2^-11.38), power_index=0.179
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=290, accuracy_bits=12, luts=189, ffs=101, throughput_msps=11, max_abs_err=0.000251 (2^-11.96), power_index=0.196
- iterative [data_width=20 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=348, accuracy_bits=13.8, luts=229, ffs=119, throughput_msps=10.5, max_abs_err=7.16e-05 (2^-13.77), power_index=0.236
- iterative [data_width=22 n_iter=21 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=447, accuracy_bits=17.6, luts=315, ffs=132, throughput_msps=6.5, max_abs_err=5.09e-06 (2^-17.58), power_index=0.404
- iterative [data_width=25 n_iter=24 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=480, accuracy_bits=19.4, luts=336, ffs=143, throughput_msps=5.78, max_abs_err=1.48e-06 (2^-19.36), power_index=0.487
- iterative [data_width=26 n_iter=27 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=525, accuracy_bits=20.5, luts=375, ffs=149, throughput_msps=5.11, max_abs_err=6.7e-07 (2^-20.51), power_index=0.592
- iterative [data_width=28 n_iter=24 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=562, accuracy_bits=22, luts=403, ffs=159, throughput_msps=5.68, max_abs_err=2.35e-07 (2^-22.02), power_index=0.571
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=658, accuracy_bits=24.1, luts=495, ffs=163, throughput_msps=4.86, max_abs_err=5.57e-08 (2^-24.10), power_index=0.767
Front coverage: luts_plus_ffs 253..658 (HV reference 1500); accuracy_bits 10.2..24.1 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 345 evals, 240 feasible; max throughput seen 18.9 MSPS; best accuracy 24.10 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 13..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 47 evals, 18 feasible; max throughput seen 15.8 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 13..15, n_iter 12..16, angle_guard 0..4, frac_guard 0..3, k 2..3
- pipelined_m: 8 evals, 0 feasible; max throughput seen 103 MSPS; best accuracy 7.75 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19565 in, 2841 out
- provider-reported cost: $0.0675
- full prompts and replies: `llm_trace.jsonl`

