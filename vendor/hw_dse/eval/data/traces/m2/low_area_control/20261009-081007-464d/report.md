# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`iterative:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 162 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 94 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 13.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 75.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.145 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000803 (2^-10.28) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.58 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000238 (2^-12.04) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.95 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.3 | exact: bit-accurate model, exhaustive (32768 angles) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (25 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round` | 162 | 94 | 13.2 | 15 | 0.145 | 0.000803 (2^-10.28) | 10.28 |
| 1 | `iterative:data_width=15,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 12.4 | 16 | 0.156 | 0.000673 (2^-10.54) | 10.54 |
| 2 | `iterative:data_width=15,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.7 | 17 | 0.168 | 0.000599 (2^-10.71) | 10.71 |
| 3 | `iterative:data_width=15,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 172 | 94 | 11.0 | 18 | 0.18 | 0.000546 (2^-10.84) | 10.84 |
| 4 | `iterative:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` | 179 | 97 | 12.4 | 16 | 0.166 | 0.000417 (2^-11.23) | 11.23 |
| 5 | `iterative:data_width=16,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 10.4 | 19 | 0.199 | 0.000285 (2^-11.78) | 11.78 |
| 6 | `iterative:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 191 | 102 | 11.0 | 18 | 0.198 | 0.000168 (2^-12.54) | 12.54 |
| 7 | `iterative:data_width=18,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 202 | 107 | 10.2 | 19 | 0.221 | 0.000108 (2^-13.18) | 13.18 |
| 8 | `iterative:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 204 | 109 | 10.2 | 19 | 0.224 | 0.000104 (2^-13.23) | 13.23 |
| 9 | `iterative:data_width=18,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc` | 224 | 113 | 10.2 | 19 | 0.241 | 7.75e-05 (2^-13.65) | 13.65 |
| 10 | `iterative:data_width=18,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 228 | 109 | 7.2 | 22 | 0.279 | 7.75e-05 (2^-13.65) | 13.65 |
| 11 | `iterative:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=round` | 271 | 114 | 10.2 | 19 | 0.275 | 5.03e-05 (2^-14.28) | 14.28 |
| 12 | `iterative:data_width=18,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 280 | 111 | 7.6 | 21 | 0.309 | 5.02e-05 (2^-14.28) | 14.28 |
| 13 | `iterative:data_width=19,n_iter=30,angle_guard=1,frac_guard=3,rounding=trunc` | 278 | 119 | 4.8 | 33 | 0.493 | 3.97e-05 (2^-14.62) | 14.62 |
| 14 | `iterative:data_width=19,n_iter=22,angle_guard=2,frac_guard=3,rounding=trunc` | 280 | 120 | 6.4 | 25 | 0.376 | 2.18e-05 (2^-15.49) | 15.49 |
| 15 | `iterative:data_width=22,n_iter=20,angle_guard=1,frac_guard=1,rounding=trunc` | 292 | 130 | 6.8 | 23 | 0.365 | 6.93e-06 (2^-17.14) | 17.14 |
| 16 | `iterative:data_width=24,n_iter=25,angle_guard=0,frac_guard=0,rounding=trunc` | 320 | 137 | 5.6 | 28 | 0.482 | 3.3e-06 (2^-18.21) | 18.21 |
| 17 | `iterative:data_width=24,n_iter=27,angle_guard=2,frac_guard=1,rounding=trunc` | 341 | 141 | 5.2 | 30 | 0.544 | 1.78e-06 (2^-19.10) | 19.10 |
| 18 | `iterative:data_width=24,n_iter=27,angle_guard=2,frac_guard=2,rounding=trunc` | 358 | 143 | 5.2 | 30 | 0.566 | 1.14e-06 (2^-19.74) | 19.74 |
| 19 | `iterative:data_width=26,n_iter=22,angle_guard=2,frac_guard=0,rounding=trunc` | 356 | 149 | 6.1 | 25 | 0.475 | 1.09e-06 (2^-19.81) | 19.81 |
| 20 | `iterative:data_width=26,n_iter=26,angle_guard=0,frac_guard=0,rounding=trunc` | 358 | 147 | 5.4 | 29 | 0.551 | 9.44e-07 (2^-20.02) | 20.02 |
| 21 | `iterative:data_width=24,n_iter=25,angle_guard=3,frac_guard=3,rounding=trunc` | 377 | 146 | 5.5 | 28 | 0.551 | 6.59e-07 (2^-20.53) | 20.53 |
| 22 | `iterative:data_width=25,n_iter=30,angle_guard=4,frac_guard=1,rounding=round` | 433 | 148 | 4.6 | 33 | 0.721 | 3.9e-07 (2^-21.29) | 21.29 |
| 23 | `iterative:data_width=25,n_iter=25,angle_guard=2,frac_guard=4,rounding=round` | 479 | 152 | 5.5 | 28 | 0.665 | 2.85e-07 (2^-21.74) | 21.74 |
| 24 | `iterative:data_width=28,n_iter=25,angle_guard=1,frac_guard=4,rounding=trunc` | 467 | 166 | 5.4 | 28 | 0.667 | 1.15e-07 (2^-23.05) | 23.05 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec is area-dominated: minimise LUTs+FFs subject to a loose throughput floor (1 MSPS) and a moderate accuracy bound (max_abs_err <= 2^-10). Iterative is the only family that can plausibly achieve the minimum area because it time-multiplexes the datapath. Pipelined and pipelined_m replicate datapath elements per stage, and unrolled_k replicates them per micro-rotation per cycle; all have higher area for the same accuracy. The chosen parameter ranges bracket the feasibility boundary: data_width 11 is the smallest width that can theoretically meet 2^-10 with rounding (LSB = 2^-9, half-LSB = 2^-10), while 18 gives comfortable margin for mapping higher-accuracy Pareto points. n_iter 8..20 covers the range where angle residual error transitions from dominating to negligible. angle_guard -1..3 and frac_guard 0..3 explore the trade-off between extra internal precision and area. Both rounding modes are included because rounding can save one bit of width at the same error bound. All budget is allocated to iterative to densely sample the active constraint region and the Pareto front.*)
- `iterative` (100 evals): data_width=11..18, n_iter=8..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Iterative shares a single datapath (one adder/subtractor, one barrel shifter) across all micro-rotations, so for any given accuracy it has the smallest LUT+FF count. The throughput constraint (>=1 MSPS) is easily satisfied because Fmax/(N+3) is far above 1 MSPS for N <= 30. Accuracy depends only on data_width, n_iter, angle_guard, frac_guard and rounding, not on the family, so any design from another family with the same accuracy parameters will have larger area and be dominated. Therefore the feasible Pareto front is expected to be entirely from iterative.

**Result (code):** 100 evaluations this round, 100 total; 64 feasible; hypervolume 5030 (n/a).

**LLM decision:** `add_family` — Round 1 mapped only the `iterative` family, and the entire feasible front (13 designs, area 274..403, accuracy 10.5..14.3 bits) comes from it. Three registry families are still unexplored, so the front is a one-family slice and we cannot yet claim it is the true (area, accuracy) trade-off. Accuracy is family-independent (identical bits for the same data_width/n_iter/angle_guard/frac_guard/rounding), so the only open question is cost: whether another family reaches the same accuracy at lower luts_plus_ffs. This is plausible because the families differ structurally — `iterative` pays for barrel shifters (muxes) while `pipelined`/`pipelined_m` use fixed shifts (wiring) at the cost of more registers, so the LUT-vs-FF balance in the luts_plus_ffs proxy can flip. The constraint set is easy on throughput (best seen 18.5 MSPS vs >=1 required) and the binding constraint is accuracy (36% of evals violate 2^-10), so I focus the new families on the low-area region where the current best (274 luts_plus_ffs @ 10.5 bits) sits, plus a modest spread to keep extending the front toward the HV reference area of 1500.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5030 (gain this round: n/a (first round)).
Feasible designs: 64 of 100 evaluations (57 unique).
Families explored so far: iterative. Not yet explored: unrolled_k, pipelined, pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 18.5
- max_abs_err <= 0.000976562: 36% violate; best seen 5.1e-05 (2^-14.26)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=16 n_iter=13 angle_guard=3 frac_guard=0 rounding=trunc] luts_plus_ffs=274, accuracy_bits=10.5, luts=175, ffs=99, throughput_msps=12.1, max_abs_err=0.000704 (2^-10.47), power_index=0.165
- iterative [data_width=17 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts_plus_ffs=282, accuracy_bits=11.7, luts=181, ffs=101, throughput_msps=10.4, max_abs_err=0.000307 (2^-11.67), power_index=0.202
- iterative [data_width=16 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=295, accuracy_bits=11.8, luts=196, ffs=99, throughput_msps=7.71, max_abs_err=0.000285 (2^-11.78), power_index=0.233
- iterative [data_width=16 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=295, accuracy_bits=11.8, luts=196, ffs=99, throughput_msps=8.1, max_abs_err=0.000285 (2^-11.78), power_index=0.222
- iterative [data_width=18 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts_plus_ffs=299, accuracy_bits=12.4, luts=193, ffs=106, throughput_msps=10.4, max_abs_err=0.000182 (2^-12.43), power_index=0.214
- iterative [data_width=18 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=335, accuracy_bits=12.9, luts=226, ffs=109, throughput_msps=7.95, max_abs_err=0.000129 (2^-12.92), power_index=0.252
- iterative [data_width=18 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=337, accuracy_bits=13.3, luts=224, ffs=113, throughput_msps=10.8, max_abs_err=0.000102 (2^-13.26), power_index=0.228
- iterative [data_width=17 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc] luts_plus_ffs=339, accuracy_bits=13.3, luts=230, ffs=109, throughput_msps=7.95, max_abs_err=9.91e-05 (2^-13.30), power_index=0.255
- iterative [data_width=17 n_iter=20 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=400, accuracy_bits=14, luts=290, ffs=110, throughput_msps=6.91, max_abs_err=6.2e-05 (2^-13.98), power_index=0.346
- iterative [data_width=17 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts_plus_ffs=403, accuracy_bits=14.3, luts=292, ffs=111, throughput_msps=7.95, max_abs_err=5.1e-05 (2^-14.26), power_index=0.303
Front coverage: luts_plus_ffs 274..403 (HV reference 1500); accuracy_bits 10.5..14.3 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 100 evals, 64 feasible; max throughput seen 18.5 MSPS; best accuracy 14.26 bits; best feasible luts_plus_ffs=274; feasible ranges: data_width 14..18, n_iter 12..20, angle_guard -1..3, frac_guard 0..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Keep pipelined_m in reserve for a later round; two structurally distinct families are enough to test the cost hypothesis this round while leaving budget for a final full-range front map.*)
- `unrolled_k` (50 evals): data_width=14..20, n_iter=10..22, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..4. *Why:* Shares one datapath across k micro-rotations/cycle; test whether fewer cycles per result can be bought without the barrel-shifter cost of the iterative family, and whether it undercuts 274 luts_plus_ffs at >=10 bits.
- `pipelined` (50 evals): data_width=14..20, n_iter=10..22, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One registered stage per micro-rotation uses fixed shifts (no barrel muxes) but many FFs; directly tests the LUT/FF trade in the luts_plus_ffs proxy against iterative at the same accuracy.

**Result (code):** 100 evaluations this round, 200 total; 144 feasible; hypervolume 7706 (+53.2%).

**LLM decision:** `map_front` — The feasible front spans luts_plus_ffs 274..561, only ~37% of the HV reference 1500, and accuracy_bits tops out at 17 while the registry (data_width up to 28, n_iter up to 30) clearly supports more. The explored ranges were narrow (iterative data_width 14..18 / n_iter 12..20; unrolled_k data_width 15..20 / n_iter 12..22), so the high-accuracy / higher-area region that would fill HV toward the (1500,10) reference is essentially unmapped. The min-area corner the selection rule wants is already found and constraint-feasible (iterative dw=16 n_iter=13 ag=3 fg=0 trunc: 274 LUT+FF, 10.5 bits, 12.1 MSPS, err 2^-10.47), so refining it adds little HV. pipelined_m is not worth adding: the spec needs only >=1 MSPS and pipelined's best feasible area is already 1490 (near the reference), so its 1-result/cycle throughput is wasted for a min-area objective. Best use of the remaining budget is to let code map the whole front over the full ranges of the two families actually on it (iterative, unrolled_k), seeded with the current front, to extend accuracy_bits upward and cover the luts_plus_ffs range up to the reference.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7706 (gain this round: +53.2%).
Feasible designs: 144 of 200 evaluations (125 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 28% violate; best seen 7.75e-06 (2^-16.98)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=16 n_iter=13 angle_guard=3 frac_guard=0 rounding=trunc] luts_plus_ffs=274, accuracy_bits=10.5, luts=175, ffs=99, throughput_msps=12.1, max_abs_err=0.000704 (2^-10.47), power_index=0.165
- iterative [data_width=16 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=292, accuracy_bits=11.7, luts=194, ffs=98, throughput_msps=7.71, max_abs_err=0.000301 (2^-11.70), power_index=0.231
- iterative [data_width=16 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=295, accuracy_bits=11.8, luts=196, ffs=99, throughput_msps=8.1, max_abs_err=0.000285 (2^-11.78), power_index=0.222
- iterative [data_width=18 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts_plus_ffs=299, accuracy_bits=12.4, luts=193, ffs=106, throughput_msps=10.4, max_abs_err=0.000182 (2^-12.43), power_index=0.214
- iterative [data_width=18 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=335, accuracy_bits=12.9, luts=226, ffs=109, throughput_msps=7.95, max_abs_err=0.000129 (2^-12.92), power_index=0.252
- iterative [data_width=17 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc] luts_plus_ffs=339, accuracy_bits=13.3, luts=230, ffs=109, throughput_msps=7.95, max_abs_err=9.91e-05 (2^-13.30), power_index=0.255
- iterative [data_width=17 n_iter=20 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=400, accuracy_bits=14, luts=290, ffs=110, throughput_msps=6.91, max_abs_err=6.2e-05 (2^-13.98), power_index=0.346
- iterative [data_width=17 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts_plus_ffs=403, accuracy_bits=14.3, luts=292, ffs=111, throughput_msps=7.95, max_abs_err=5.1e-05 (2^-14.26), power_index=0.303
- unrolled_k [data_width=19 n_iter=22 angle_guard=2 frac_guard=3 rounding=trunc k=2] luts_plus_ffs=496, accuracy_bits=15.5, luts=377, ffs=119, throughput_msps=7.35, max_abs_err=2.18e-05 (2^-15.49), power_index=0.261
- unrolled_k [data_width=20 n_iter=22 angle_guard=3 frac_guard=2 rounding=round k=2] luts_plus_ffs=561, accuracy_bits=17, luts=438, ffs=123, throughput_msps=7.17, max_abs_err=7.75e-06 (2^-16.98), power_index=0.296
Front coverage: luts_plus_ffs 274..561 (HV reference 1500); accuracy_bits 10.5..17 (HV reference 10); data_width on the front 16..20 (registry 8..28).

Per family:
- iterative: 100 evals, 64 feasible; max throughput seen 18.5 MSPS; best accuracy 14.26 bits; best feasible luts_plus_ffs=274; feasible ranges: data_width 14..18, n_iter 12..20, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 50 evals, 44 feasible; max throughput seen 13.1 MSPS; best accuracy 16.98 bits; best feasible luts_plus_ffs=426; feasible ranges: data_width 15..20, n_iter 12..22, angle_guard -1..3, frac_guard 0..3, k 2..4
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 14.22 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..20, n_iter 12..21, angle_guard -1..2, frac_guard 0..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `iterative` (31 evals): data_width=15..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (13 front designs; box front_anchored)
- `unrolled_k` (9 evals): data_width=18..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* code: map the front of unrolled_k (4 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 181 feasible; hypervolume 1.369e+04 (+77.6%).

**LLM decision:** `refine` — The feasible front is entirely `iterative`: unrolled_k's best feasible area is 426 and pipelined's is 1490, both dominated by iterative's 274, and pipelined_m (1 result/cycle, registered stages) can only be larger still — so no new family can help a min-luts_plus_ffs spec where throughput is already 12x over the 1 MSPS constraint. Two things are worth the last 160 evals. (1) The selection rule is min luts_plus_ffs and the current winner is 274 (data_width=16, n_iter=13, acc 10.5 bits), sitting only ~0.5 bits above the 2^-10 constraint, so a smaller design may exist just above the constraint — the front's data_width starts at 16 while iterative is feasible down to 14. (2) HV is dominated by the sparse mid/high-accuracy points: the gaps 14→17.1 bits (area 400→422) and 18.1→21.3 bits (474→581) contribute ~6.3k of the ~13.7k HV, and each extra accuracy bit above 23 adds ~870. So I refine the low-area corner for the selection rule and fill/extend the accuracy gaps for HV.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.369e+04 (gain this round: +77.6%).
Feasible designs: 181 of 240 evaluations (159 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 25% violate; best seen 1.15e-07 (2^-23.05)

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=16 n_iter=13 angle_guard=3 frac_guard=0 rounding=trunc] luts_plus_ffs=274, accuracy_bits=10.5, luts=175, ffs=99, throughput_msps=12.1, max_abs_err=0.000704 (2^-10.47), power_index=0.165
- iterative [data_width=16 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=292, accuracy_bits=11.7, luts=194, ffs=98, throughput_msps=7.71, max_abs_err=0.000301 (2^-11.70), power_index=0.231
- iterative [data_width=16 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=295, accuracy_bits=11.8, luts=196, ffs=99, throughput_msps=8.1, max_abs_err=0.000285 (2^-11.78), power_index=0.222
- iterative [data_width=16 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=309, accuracy_bits=12.7, luts=204, ffs=105, throughput_msps=10.2, max_abs_err=0.000146 (2^-12.74), power_index=0.221
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=313, accuracy_bits=13.2, luts=204, ffs=109, throughput_msps=10.2, max_abs_err=0.000104 (2^-13.23), power_index=0.224
- iterative [data_width=17 n_iter=20 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=400, accuracy_bits=14, luts=290, ffs=110, throughput_msps=6.91, max_abs_err=6.2e-05 (2^-13.98), power_index=0.346
- iterative [data_width=22 n_iter=20 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=422, accuracy_bits=17.1, luts=292, ffs=130, throughput_msps=6.78, max_abs_err=6.93e-06 (2^-17.14), power_index=0.365
- iterative [data_width=24 n_iter=25 angle_guard=-1 frac_guard=1 rounding=trunc] luts_plus_ffs=474, accuracy_bits=18.1, luts=335, ffs=138, throughput_msps=5.57, max_abs_err=3.6e-06 (2^-18.09), power_index=0.499
- iterative [data_width=25 n_iter=30 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=581, accuracy_bits=21.3, luts=433, ffs=148, throughput_msps=4.64, max_abs_err=3.9e-07 (2^-21.29), power_index=0.721
- iterative [data_width=28 n_iter=25 angle_guard=1 frac_guard=4 rounding=trunc] luts_plus_ffs=633, accuracy_bits=23, luts=467, ffs=166, throughput_msps=5.38, max_abs_err=1.15e-07 (2^-23.05), power_index=0.667
Front coverage: luts_plus_ffs 274..633 (HV reference 1500); accuracy_bits 10.5..23 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 131 evals, 92 feasible; max throughput seen 18.5 MSPS; best accuracy 23.05 bits; best feasible luts_plus_ffs=274; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 59 evals, 53 feasible; max throughput seen 13.1 MSPS; best accuracy 21.79 bits; best feasible luts_plus_ffs=426; feasible ranges: data_width 15..27, n_iter 12..28, angle_guard -2..4, frac_guard 0..4, k 2..7
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 14.22 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..20, n_iter 12..21, angle_guard -1..2, frac_guard 0..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *Refine the single dominant family (iterative) in three bands: the low-area corner that the selection rule picks, the mid-accuracy gaps that carry most of the hypervolume, and the high-accuracy tail.*)
- `iterative` (100 evals): data_width=14..18, n_iter=11..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Push the min-area corner below 274 while keeping max_abs_err <= 2^-10; the winner is only 0.5 bits above the constraint and data_width 14-15 is feasible but absent from the front.
- clamped by code: dropped duplicate family iterative
- clamped by code: dropped duplicate family iterative

**Result (code):** 100 evaluations this round, 340 total; 255 feasible; hypervolume 1.373e+04 (+0.3%).

**LLM decision:** `stop` — Final round (round cap reached, 340/400 evals). The feasible front is well mapped: 255 feasible designs, 19 on the Pareto front, spanning luts_plus_ffs 256..633 and accuracy_bits 10.3..23, with hypervolume gain this round only +0.3% — the front has converged. Both constraints are comfortably satisfiable: throughput best seen 273 MSPS (0% violate, need >=1) and max_abs_err best 1.15e-07 (need <=2^-10). The selection rule (min luts_plus_ffs) is met by iterative [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round] at luts_plus_ffs=256, accuracy_bits=10.3 (max_abs_err 0.000803 <= 0.000976562), throughput 13.2 MSPS >= 1 — a valid, constraint-satisfying optimum. No further family exploration is warranted: pipelined_m is unexplored but pipelined already shows the per-cycle families cost >=1490 luts_plus_ffs, far above the 256 area optimum the spec selects for, so it cannot improve the selected design. Stopping.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.373e+04 (gain this round: +0.3%).
Feasible designs: 255 of 340 evaluations (223 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 25% violate; best seen 1.15e-07 (2^-23.05)

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=256, accuracy_bits=10.3, luts=162, ffs=94, throughput_msps=13.2, max_abs_err=0.000803 (2^-10.28), power_index=0.145
- iterative [data_width=15 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=265, accuracy_bits=10.8, luts=172, ffs=94, throughput_msps=11, max_abs_err=0.000546 (2^-10.84), power_index=0.18
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=10.4, max_abs_err=0.000285 (2^-11.78), power_index=0.199
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=309, accuracy_bits=13.2, luts=202, ffs=107, throughput_msps=10.2, max_abs_err=0.000108 (2^-13.18), power_index=0.221
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=337, accuracy_bits=13.7, luts=224, ffs=113, throughput_msps=10.2, max_abs_err=7.75e-05 (2^-13.65), power_index=0.241
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=385, accuracy_bits=14.3, luts=271, ffs=114, throughput_msps=10.2, max_abs_err=5.03e-05 (2^-14.28), power_index=0.275
- iterative [data_width=22 n_iter=20 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=422, accuracy_bits=17.1, luts=292, ffs=130, throughput_msps=6.78, max_abs_err=6.93e-06 (2^-17.14), power_index=0.365
- iterative [data_width=24 n_iter=25 angle_guard=-1 frac_guard=1 rounding=trunc] luts_plus_ffs=474, accuracy_bits=18.1, luts=335, ffs=138, throughput_msps=5.57, max_abs_err=3.6e-06 (2^-18.09), power_index=0.499
- iterative [data_width=25 n_iter=30 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=581, accuracy_bits=21.3, luts=433, ffs=148, throughput_msps=4.64, max_abs_err=3.9e-07 (2^-21.29), power_index=0.721
- iterative [data_width=28 n_iter=25 angle_guard=1 frac_guard=4 rounding=trunc] luts_plus_ffs=633, accuracy_bits=23, luts=467, ffs=166, throughput_msps=5.38, max_abs_err=1.15e-07 (2^-23.05), power_index=0.667
Front coverage: luts_plus_ffs 256..633 (HV reference 1500); accuracy_bits 10.3..23 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 231 evals, 166 feasible; max throughput seen 18.5 MSPS; best accuracy 23.05 bits; best feasible luts_plus_ffs=256; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 59 evals, 53 feasible; max throughput seen 13.1 MSPS; best accuracy 21.79 bits; best feasible luts_plus_ffs=426; feasible ranges: data_width 15..27, n_iter 12..28, angle_guard -2..4, frac_guard 0..4, k 2..7
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 14.22 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..20, n_iter 12..21, angle_guard -1..2, frac_guard 0..3
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `iterative` (60 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (19 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 307 feasible; hypervolume 1.389e+04 (+1.2%).

**No LLM call** (code's front-mapping round): Final round (round cap reached, 340/400 evals). The feasible front is well mapped: 255 feasible designs, 19 on the Pareto front, spanning luts_plus_ffs 256..633 and accuracy_bits 10.3..23, with hypervolume gain this round only +0.3% — the front has converged. Both constraints are comfortably satisfiable: throughput best seen 273 MSPS (0% violate, need >=1) and max_abs_err best 1.15e-07 (need <=2^-10). The selection rule (min luts_plus_ffs) is met by iterative [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round] at luts_plus_ffs=256, accuracy_bits=10.3 (max_abs_err 0.000803 <= 0.000976562), throughput 13.2 MSPS >= 1 — a valid, constraint-satisfying optimum. No further family exploration is warranted: pipelined_m is unexplored but pipelined already shows the per-cycle families cost >=1490 luts_plus_ffs, far above the 256 area optimum the spec selects for, so it cannot improve the selected design. Stopping.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.389e+04 (gain this round: +1.2%).
Feasible designs: 307 of 400 evaluations (266 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 23% violate; best seen 1.15e-07 (2^-23.05)

Pareto front (feasible, 25 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=256, accuracy_bits=10.3, luts=162, ffs=94, throughput_msps=13.2, max_abs_err=0.000803 (2^-10.28), power_index=0.145
- iterative [data_width=15 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=265, accuracy_bits=10.8, luts=172, ffs=94, throughput_msps=11, max_abs_err=0.000546 (2^-10.84), power_index=0.18
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=10.4, max_abs_err=0.000285 (2^-11.78), power_index=0.199
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=313, accuracy_bits=13.2, luts=204, ffs=109, throughput_msps=10.2, max_abs_err=0.000104 (2^-13.23), power_index=0.224
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=385, accuracy_bits=14.3, luts=271, ffs=114, throughput_msps=10.2, max_abs_err=5.03e-05 (2^-14.28), power_index=0.275
- iterative [data_width=19 n_iter=30 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=397, accuracy_bits=14.6, luts=278, ffs=119, throughput_msps=4.82, max_abs_err=3.97e-05 (2^-14.62), power_index=0.493
- iterative [data_width=24 n_iter=25 angle_guard=0 frac_guard=0 rounding=trunc] luts_plus_ffs=457, accuracy_bits=18.2, luts=320, ffs=137, throughput_msps=5.57, max_abs_err=3.3e-06 (2^-18.21), power_index=0.482
- iterative [data_width=26 n_iter=22 angle_guard=2 frac_guard=0 rounding=trunc] luts_plus_ffs=505, accuracy_bits=19.8, luts=356, ffs=149, throughput_msps=6.13, max_abs_err=1.09e-06 (2^-19.81), power_index=0.475
- iterative [data_width=24 n_iter=25 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=523, accuracy_bits=20.5, luts=377, ffs=146, throughput_msps=5.47, max_abs_err=6.59e-07 (2^-20.53), power_index=0.551
- iterative [data_width=28 n_iter=25 angle_guard=1 frac_guard=4 rounding=trunc] luts_plus_ffs=633, accuracy_bits=23, luts=467, ffs=166, throughput_msps=5.38, max_abs_err=1.15e-07 (2^-23.05), power_index=0.667
Front coverage: luts_plus_ffs 256..633 (HV reference 1500); accuracy_bits 10.3..23 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 291 evals, 218 feasible; max throughput seen 18.5 MSPS; best accuracy 23.05 bits; best feasible luts_plus_ffs=256; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 59 evals, 53 feasible; max throughput seen 13.1 MSPS; best accuracy 21.79 bits; best feasible luts_plus_ffs=426; feasible ranges: data_width 15..27, n_iter 12..28, angle_guard -2..4, frac_guard 0..4, k 2..7
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 14.22 bits; best feasible luts_plus_ffs=1490; feasible ranges: data_width 15..20, n_iter 12..21, angle_guard -1..2, frac_guard 0..3
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 13893 in, 21383 out
- provider-reported cost: $0.0243
- full prompts and replies: `llm_trace.jsonl`

