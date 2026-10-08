# DSE run: low_area_control

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 300 of 400 budgeted, over 3 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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

## Pareto front (18 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` | 161 | 93 | 13.2 | 15 | 0.143 | 0.000835 (2^-10.23) | 10.23 |
| 1 | `iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc` | 161 | 94 | 13.2 | 15 | 0.144 | 0.000833 (2^-10.23) | 10.23 |
| 2 | `iterative:data_width=15,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 166 | 91 | 11.0 | 18 | 0.174 | 0.00081 (2^-10.27) | 10.27 |
| 3 | `iterative:data_width=15,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 166 | 91 | 11.7 | 17 | 0.164 | 0.00081 (2^-10.27) | 10.27 |
| 4 | `iterative:data_width=15,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 11.0 | 18 | 0.176 | 0.000632 (2^-10.63) | 10.63 |
| 5 | `iterative:data_width=15,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 10.4 | 19 | 0.186 | 0.000632 (2^-10.63) | 10.63 |
| 6 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 10.4 | 19 | 0.188 | 0.000599 (2^-10.71) | 10.71 |
| 7 | `iterative:data_width=15,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.0 | 18 | 0.178 | 0.000599 (2^-10.71) | 10.71 |
| 8 | `iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc` | 170 | 94 | 11.7 | 17 | 0.169 | 0.000594 (2^-10.72) | 10.72 |
| 9 | `iterative:data_width=15,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 172 | 95 | 11.0 | 18 | 0.181 | 0.000567 (2^-10.78) | 10.78 |
| 10 | `iterative:data_width=15,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc` | 172 | 95 | 11.7 | 17 | 0.171 | 0.000567 (2^-10.78) | 10.78 |
| 11 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 178 | 96 | 11.7 | 17 | 0.175 | 0.0004 (2^-11.29) | 11.29 |
| 12 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 11.0 | 18 | 0.189 | 0.000285 (2^-11.78) | 11.78 |
| 13 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 193 | 102 | 11.0 | 18 | 0.2 | 0.000241 (2^-12.02) | 12.02 |
| 14 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=round` | 232 | 101 | 10.4 | 19 | 0.238 | 0.000214 (2^-12.19) | 12.19 |
| 15 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 234 | 102 | 11.0 | 18 | 0.228 | 0.000176 (2^-12.48) | 12.48 |
| 16 | `pipelined:data_width=17,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 983 | 1012 | 272.9 | 19 | 0.075 | 0.000149 (2^-12.71) | 12.71 |
| 17 | `pipelined:data_width=17,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1000 | 1029 | 264.5 | 19 | 0.0763 | 0.000139 (2^-12.81) | 12.81 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Accuracy depends only on data_width, n_iter, angle_guard, frac_guard and rounding, not on the architecture family. The iterative family has the lowest hardware cost per micro-rotation, so it should dominate the min-area Pareto front for the required accuracy. The throughput requirement (>=1 MSPS) is easily met by iterative for N up to 16, so there is no need to spend budget on area-heavier families (unrolled_k, pipelined, pipelined_m) in the first round. The proposed parameter ranges are chosen to cover the feasible accuracy boundary while keeping the search space focused: W from 12 to 16 (W<12 cannot meet the 2^-10 error bound, W>16 is likely unnecessary area), N from 8 to 16 (N<8 likely insufficient convergence, N>16 adds area without need), angle_guard -1..2, frac_guard 0..2, and both rounding modes. All 100 evaluations of round 1 are allocated to iterative to map the area-accuracy trade-off efficiently.*)
- `iterative` (100 evals): data_width=12..16, n_iter=8..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Iterative uses a single shared micro-rotation datapath, so for any given accuracy it should have the smallest LUT+FF count. The throughput constraint is only 1 MSPS; with N <= 16 the result rate is Fmax/(N+3), which exceeds 1 MSPS even at modest Fmax (e.g. 20 MHz gives >1 MSPS). Therefore it is the most promising family for the min-area objective. The ranges bracket the feasible accuracy region: W >= 12 is required because the output LSB is 2^-(W-2) and max_abs_err <= 2^-10; N >= 8 is a lower bound for CORDIC angle convergence; angle_guard >= -1 allows a small angle-path reduction while still permitting enough precision; frac_guard 0..2 covers internal precision needs; both rounding modes are included because rounding can improve accuracy at negligible area cost.

**Result (code):** 100 evaluations this round, 100 total; 40 feasible; hypervolume 2757 (n/a).

**LLM decision:** `refine` — Round 1 is entirely iterative and already exposes the whole binding structure: the throughput constraint is non-binding (0% violations, best 18.5 MSPS vs the 1 MSPS floor), while the error constraint is the only real one (60% violations, best 2^-12.26 vs 2^-10). The whole Pareto front sits at data_width 15-16.3 bits near the low-area corner, and the area proxy is the scored objective, so this is a pure min-luts_plus_ffs search where accuracy just has to clear 10 bits. The evidence says: (a) the cheapest feasible point is data_width=15, n_iter=14-15, angle_guard=0, frac_guard=0, rounding=round at 257 (10.3 bits) - i.e. guard bits and frac bits are almost free in accuracy but cost area, so the corner is where area is won; (b) data_width=14 is in the feasible envelope but no 14-bit design reached the front, which means the round-1 sampling never paired it with enough n_iter - that is exactly the region a focused refinement should attack, since dropping a width bit is the biggest area lever; (c) 300 of 400 evals remain, so I can afford to concentrate ~70% of round 2 into the corner and probe the unexplored families with the rest to confirm they do not undercut it (accuracy is family-independent, so any family only wins on cost, and higher-parallelism families are unlikely to beat a 1-micro-rotation/cycle datapath when only 1 MSPS is needed).

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2757 (gain this round: n/a (first round)).
Feasible designs: 40 of 100 evaluations (29 unique).
Families explored so far: iterative. Not yet explored: unrolled_k, pipelined, pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 18.5
- max_abs_err <= 0.000976562: 60% violate; best seen 0.000204 (2^-12.26)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=11, max_abs_err=0.00081 (2^-10.27), power_index=0.174
- iterative [data_width=15 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=11.7, max_abs_err=0.00081 (2^-10.27), power_index=0.164
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=11, max_abs_err=0.000632 (2^-10.63), power_index=0.176
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=10.4, max_abs_err=0.000632 (2^-10.63), power_index=0.186
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=10.4, max_abs_err=0.000599 (2^-10.71), power_index=0.188
- iterative [data_width=15 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=278, accuracy_bits=11.3, luts=181, ffs=97, throughput_msps=11.7, max_abs_err=0.000405 (2^-11.27), power_index=0.178
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.7, luts=181, ffs=98, throughput_msps=11.7, max_abs_err=0.000294 (2^-11.73), power_index=0.178
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=295, accuracy_bits=12, luts=193, ffs=102, throughput_msps=11, max_abs_err=0.000241 (2^-12.02), power_index=0.2
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts_plus_ffs=333, accuracy_bits=12.2, luts=232, ffs=101, throughput_msps=10.4, max_abs_err=0.000214 (2^-12.19), power_index=0.238
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.3, luts=234, ffs=102, throughput_msps=11.7, max_abs_err=0.000204 (2^-12.26), power_index=0.215

Per family:
- iterative: 100 evals, 40 feasible; max throughput seen 18.5 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=257; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Attack the 13-15 width corner where the area objective actually moves, keep guard bits minimal, and spend a small slice confirming the higher-throughput families cannot undercut the 257-point front. Accuracy is family-independent, so any non-iterative win can only be a cost-model win on luts_plus_ffs.*)
- `iterative` (60 evals): data_width=13..16, n_iter=10..17, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* Concentrate on the low-area corner. Force the width down to 13-14 against higher n_iter to see if a narrower datapath clears 2^-10 at lower luts_plus_ffs than 257; keep angle_guard/frac_guard small (0-1) since they add area without lifting the accuracy objective above the 10-bit floor.
- `unrolled_k` (20 evals): data_width=13..15, n_iter=12..16, angle_guard=-1..2, frac_guard=0..1, rounding=round, k=2..3. *Why:* Only k=2..3: throughput is already 10x over the 1 MSPS floor, so smallest unroll is the only variant that could conceivably beat iterative on area; larger k is dominated by construction.
- `pipelined_m` (20 evals): data_width=13..15, n_iter=12..16, angle_guard=-1..2, frac_guard=0..1, rounding=round, m=6..8. *Why:* m=6..8 (fewest registers) is the only pipelined variant plausibly competitive on luts_plus_ffs; use it as a dominance check that 1 result/cycle buys nothing we need.

**Result (code):** 100 evaluations this round, 200 total; 91 feasible; hypervolume 3010 (+9.2%).

**LLM decision:** `widen` — Throughput is non-binding (constraint >=1 MSPS, best seen 72 MSPS), so area/accuracy alone drive the front, and every one of the 16 Pareto points is `iterative` (best luts_plus_ffs=253 at 10.2 bits). The front's accuracy end stops at 12.5 bits only because the iterative box capped data_width at 16; since area scales roughly with W*N (253 at 15x12, 336 at 16x15), high-accuracy iterative designs (e.g. W~24,N~24) should still land well under the HV reference area of 1500, so widening data_width/n_iter should extend the front upward and add large hypervolume. I keep a focused low-area slice to chase the min-luts_plus_ffs selection target, and give `pipelined` a small share to confirm it cannot extend the front (pipelined_m, which has fewer registers, already bottoms out at 759).

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3010 (gain this round: +9.2%).
Feasible designs: 91 of 200 evaluations (62 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 72
- max_abs_err <= 0.000976562: 55% violate; best seen 0.000176 (2^-12.48)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=11, max_abs_err=0.00081 (2^-10.27), power_index=0.174
- iterative [data_width=15 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=11.7, max_abs_err=0.00081 (2^-10.27), power_index=0.164
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=10.4, max_abs_err=0.000632 (2^-10.63), power_index=0.186
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=11, max_abs_err=0.000599 (2^-10.71), power_index=0.178
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts_plus_ffs=267, accuracy_bits=10.8, luts=172, ffs=95, throughput_msps=11, max_abs_err=0.000567 (2^-10.78), power_index=0.181
- iterative [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.2, luts=179, ffs=97, throughput_msps=12.4, max_abs_err=0.000417 (2^-11.23), power_index=0.166
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=11, max_abs_err=0.000285 (2^-11.78), power_index=0.189
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=295, accuracy_bits=12, luts=193, ffs=102, throughput_msps=11, max_abs_err=0.000241 (2^-12.02), power_index=0.2
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.5, luts=234, ffs=102, throughput_msps=11, max_abs_err=0.000176 (2^-12.48), power_index=0.228

Per family:
- iterative: 160 evals, 71 feasible; max throughput seen 18.5 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..16, n_iter 12..17, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 20 evals, 10 feasible; max throughput seen 14 MSPS; best accuracy 11.28 bits; best feasible luts_plus_ffs=344; feasible ranges: data_width 14..15, n_iter 12..14, angle_guard 0..2, frac_guard 0..1, k 2..3
- pipelined_m: 20 evals, 10 feasible; max throughput seen 72 MSPS; best accuracy 11.28 bits; best feasible luts_plus_ffs=759; feasible ranges: data_width 14..15, n_iter 12..16, angle_guard 0..2, frac_guard 0..1, m 6..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Widen iterative's data_width/n_iter to push the accuracy end of the front (big HV gain under ref 1500), keep a narrow low-area slice for the min-area selection rule, and cheaply probe pipelined for completeness.*)
- `iterative` (67 evals): data_width=14..16, n_iter=11..15, angle_guard=-1..2, frac_guard=0..1, rounding=trunc|round. *Why:* Refine the low-area corner (current best 253 at W=15,N=12) to try to beat the min-luts_plus_ffs selection target while staying above 2^-10 error.
- `pipelined` (33 evals): data_width=14..18, n_iter=12..18, angle_guard=0..2, frac_guard=0..1, rounding=trunc|round. *Why:* Only unexplored family; small share to verify it cannot extend the front, since pipelined_m (fewer registers) already has best feasible area 759 vs iterative's 253.
- clamped by code: dropped duplicate family iterative

**Result (code):** 100 evaluations this round, 300 total; 155 feasible; hypervolume 3012 (+0.1%).

**LLM decision:** `refine` — The front has essentially converged (HV 3012, only +0.1% this round, 0% throughput violations and every feasible design is trivially >=1 MSPS since the best minimal corner already runs at 11-13 MSPS). The binding constraint is accuracy (48% of evals violate it), and the selection rule is min luts_plus_ffs, so the decisive edge is the low-area corner: iterative @ 253 luts+ffs (data_width=15, n_iter=12, angle_guard=2, frac_guard=0, round, 10.23 bits). All other families are far heavier on area (unrolled_k 344, pipelined_m 759, pipelined 1297) and the 2029-luts pipelined point even sits beyond the HV reference (1500), so it cannot extend hypervolume. That means the only way to gain HV or improve the eventual selection is to push the low-area corner below 253 luts+ffs while still clearing 2^-10 — i.e. probe data_width=14 and shorter n_iter at the accuracy frontier. One 100-eval round is enough to scan that small box.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.05% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 3012 (gain this round: +0.1%).
Feasible designs: 155 of 300 evaluations (98 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 48% violate; best seen 0.000139 (2^-12.81)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=11, max_abs_err=0.00081 (2^-10.27), power_index=0.174
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=11, max_abs_err=0.000632 (2^-10.63), power_index=0.176
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=10.4, max_abs_err=0.000599 (2^-10.71), power_index=0.188
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=264, accuracy_bits=10.7, luts=170, ffs=94, throughput_msps=11.7, max_abs_err=0.000594 (2^-10.72), power_index=0.169
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts_plus_ffs=267, accuracy_bits=10.8, luts=172, ffs=95, throughput_msps=11, max_abs_err=0.000567 (2^-10.78), power_index=0.181
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=273, accuracy_bits=11.3, luts=178, ffs=96, throughput_msps=11.7, max_abs_err=0.0004 (2^-11.29), power_index=0.175
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=295, accuracy_bits=12, luts=193, ffs=102, throughput_msps=11, max_abs_err=0.000241 (2^-12.02), power_index=0.2
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.5, luts=234, ffs=102, throughput_msps=11, max_abs_err=0.000176 (2^-12.48), power_index=0.228
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=2029, accuracy_bits=12.8, luts=1000, ffs=1029, throughput_msps=264, max_abs_err=0.000139 (2^-12.81), power_index=0.0763

Per family:
- iterative: 227 evals, 108 feasible; max throughput seen 18.5 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..16, n_iter 12..17, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 20 evals, 10 feasible; max throughput seen 14 MSPS; best accuracy 11.28 bits; best feasible luts_plus_ffs=344; feasible ranges: data_width 14..15, n_iter 12..14, angle_guard 0..2, frac_guard 0..1, k 2..3
- pipelined: 33 evals, 27 feasible; max throughput seen 282 MSPS; best accuracy 12.81 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 15..17, n_iter 12..18, angle_guard 0..2, frac_guard 0..1
- pipelined_m: 20 evals, 10 feasible; max throughput seen 72 MSPS; best accuracy 11.28 bits; best feasible luts_plus_ffs=759; feasible ranges: data_width 14..15, n_iter 12..16, angle_guard 0..2, frac_guard 0..1, m 6..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10349 in, 16458 out
- provider-reported cost: $0.0151
- full prompts and replies: `llm_trace.jsonl`

