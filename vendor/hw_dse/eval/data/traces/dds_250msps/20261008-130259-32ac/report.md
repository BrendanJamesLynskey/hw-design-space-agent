# DSE run: dds_250msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 300 of 400 budgeted, over 3 round(s).  
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
`pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 935 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 969 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 17.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000119 (2^-13.04) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.77 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 3.01e-05 (2^-15.02) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.97 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (22 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 935 | 969 | 264.5 | 17 | 17.9 | 0.000119 (2^-13.04) | 13.04 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 964 | 999 | 264.5 | 17 | 18.5 | 8.33e-05 (2^-13.55) | 13.55 |
| 2 | `pipelined:data_width=19,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc` | 1033 | 1061 | 264.5 | 18 | 19.7 | 7.43e-05 (2^-13.72) | 13.72 |
| 3 | `pipelined:data_width=20,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 1038 | 1070 | 264.5 | 17 | 19.8 | 7.32e-05 (2^-13.74) | 13.74 |
| 4 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 1063 | 1053 | 264.5 | 17 | 19.9 | 7.18e-05 (2^-13.77) | 13.77 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 1080 | 1106 | 264.5 | 18 | 20.6 | 5.43e-05 (2^-14.17) | 14.17 |
| 6 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1101 | 1132 | 264.5 | 19 | 21 | 4.23e-05 (2^-14.53) | 14.53 |
| 7 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1152 | 1183 | 264.5 | 19 | 22 | 2.85e-05 (2^-15.10) | 15.10 |
| 8 | `pipelined:data_width=19,n_iter=17,angle_guard=4,frac_guard=3,rounding=trunc` | 1236 | 1257 | 256.5 | 19 | 23.4 | 2.82e-05 (2^-15.11) | 15.11 |
| 9 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=4,rounding=trunc` | 1253 | 1270 | 256.5 | 19 | 23.7 | 2.62e-05 (2^-15.22) | 15.22 |
| 10 | `pipelined:data_width=19,n_iter=17,angle_guard=4,frac_guard=4,rounding=trunc` | 1270 | 1287 | 256.5 | 19 | 24 | 2.49e-05 (2^-15.29) | 15.29 |
| 11 | `pipelined:data_width=19,n_iter=17,angle_guard=4,frac_guard=3,rounding=round` | 1276 | 1259 | 256.5 | 19 | 23.8 | 2.19e-05 (2^-15.48) | 15.48 |
| 12 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=1,rounding=round` | 1297 | 1284 | 256.5 | 19 | 24.3 | 1.95e-05 (2^-15.64) | 15.64 |
| 13 | `pipelined:data_width=19,n_iter=18,angle_guard=3,frac_guard=4,rounding=trunc` | 1331 | 1346 | 256.5 | 20 | 25.2 | 1.92e-05 (2^-15.67) | 15.67 |
| 14 | `pipelined:data_width=19,n_iter=18,angle_guard=3,frac_guard=3,rounding=round` | 1335 | 1316 | 264.5 | 20 | 24.9 | 1.78e-05 (2^-15.78) | 15.78 |
| 15 | `pipelined:data_width=20,n_iter=20,angle_guard=2,frac_guard=2,rounding=trunc` | 1447 | 1465 | 264.5 | 22 | 27.4 | 1.54e-05 (2^-15.99) | 15.99 |
| 16 | `pipelined:data_width=20,n_iter=20,angle_guard=4,frac_guard=2,rounding=trunc` | 1487 | 1505 | 256.5 | 22 | 28.1 | 1.38e-05 (2^-16.14) | 16.14 |
| 17 | `pipelined:data_width=20,n_iter=20,angle_guard=2,frac_guard=3,rounding=round` | 1529 | 1503 | 256.5 | 22 | 28.5 | 9e-06 (2^-16.76) | 16.76 |
| 18 | `pipelined:data_width=21,n_iter=20,angle_guard=4,frac_guard=3,rounding=trunc` | 1587 | 1602 | 256.5 | 22 | 30 | 5.58e-06 (2^-17.45) | 17.45 |
| 19 | `pipelined:data_width=21,n_iter=22,angle_guard=3,frac_guard=3,rounding=trunc` | 1731 | 1741 | 256.5 | 24 | 32.7 | 4.43e-06 (2^-17.78) | 17.78 |
| 20 | `pipelined:data_width=21,n_iter=22,angle_guard=3,frac_guard=3,rounding=round` | 1776 | 1743 | 256.5 | 24 | 33.1 | 3.05e-06 (2^-18.32) | 18.32 |
| 21 | `pipelined:data_width=21,n_iter=22,angle_guard=3,frac_guard=4,rounding=round` | 1820 | 1784 | 256.5 | 24 | 33.9 | 2.8e-06 (2^-18.45) | 18.45 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=250 MSPS) is the binding architectural filter. iterative needs Fmax/(N+3) >= 250, i.e. >=1750 MHz even at N=4, so it is excluded outright. unrolled_k needs ceil(N/k)+3 cycles; with k<=8 and N>=12 for accuracy this still demands >1 GHz, so it gets only a small confirmation budget. pipelined and pipelined_m both deliver 1 result/cycle, so 250 MSPS only requires Fmax >= 250 MHz, which is easily achievable, and they are where the real min-LUT vs accuracy trade-off lives. Accuracy depends only on W, N, angle_guard, frac_guard, rounding, so the ranges are set around the plausible 13-bit region (W 14-22, N 12-22) with the guard/rounding knobs left wide since they are cheap to explore. Budget is weighted toward pipelined (most likely min-LUT winner), then pipelined_m (main alternative), with a thin unrolled_k probe.*)
- `pipelined` (50 evals): data_width=14..22, n_iter=12..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only 1 result/cycle families can reach 250 MSPS without heroic Fmax. Pipelined is the canonical 1/cycle CORDIC: throughput = Fmax, so 250 MSPS is easy on Artix-7. LUTs scale with N (one micro-rotation stage each) and W, so this family directly exposes the min-LUT vs accuracy trade-off. W>=14 and N>=12 bracket the region where 2^-13 error is plausible (output LSB 2^-(W-2), CORDIC angle error ~2^-N), with headroom above.
- `pipelined_m` (35 evals): data_width=14..22, n_iter=12..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..6. *Why:* Same 1 result/cycle throughput as pipelined, so it can also meet 250 MSPS, but registering every m stages trades Fmax for FF count. Since the objective is min LUTs (not FFs), it may not beat pipelined, but it is the main alternative architecture and worth exploring in case a coarser pipeline reduces register/LUT overhead at the same accuracy. m capped at 6 to keep the combinational path short enough that Fmax stays comfortably above 250 MHz.
- `unrolled_k` (15 evals): data_width=14..22, n_iter=12..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* Small probe to confirm/deny feasibility. Throughput = Fmax / (ceil(N/k)+3); even at the best case k=8, N=12 this needs ceil(12/8)+3 = 5 cycles, i.e. Fmax >= 1250 MHz, which is implausible on Artix-7. Included only to let the cost model verify this rather than assume it, and to catch any edge case where a very small N still meets accuracy.

**Result (code):** 100 evaluations this round, 100 total; 40 feasible; hypervolume 1.414e+04 (n/a).

**LLM decision:** `refine` — Only `pipelined` can satisfy the 250 MSPS constraint: it is the sole family with feasible designs (40/50 evals, max throughput 273 MSPS), whereas `unrolled_k` tops out at 9.13 MSPS and `pipelined_m` at 171 MSPS (both 0 feasible), and `iterative` is schedule-limited to Fmax/(N+3) <= ~300/7 ~= 43 MSPS for N>=4, so it is infeasible by construction and needs no budget. The min-LUTs selection winner is pipelined [W=17, N=15, angle_guard=2, frac_guard=3, round] at 1000 LUTs / 13.32 accuracy bits / 264 MSPS, i.e. only ~0.3 bits of margin over the 2^-13 error limit, so the cheapest region is worth a focused second pass: smaller data_width (15-16) and fewer iterations (12-14) may still clear 2^-13 and cut LUTs further, while the current feasible data_width floor of 17 may simply be an artefact of the round-1 sampling. Accuracy is exact and depends only on (W, N, angle_guard, frac_guard, rounding), so this box directly targets the min-LUTs objective.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.414e+04 (gain this round: n/a (first round)).
Feasible designs: 40 of 100 evaluations (33 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 33% violate; best seen 2.8e-06 (2^-18.45)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts=1000, accuracy_bits=13.3, ffs=989, throughput_msps=264, max_abs_err=9.76e-05 (2^-13.32), power_index=18.7
- pipelined [data_width=21 n_iter=15 angle_guard=4 frac_guard=0 rounding=round] luts=1082, accuracy_bits=13.9, ffs=1120, throughput_msps=257, max_abs_err=6.66e-05 (2^-13.87), power_index=20.7
- pipelined [data_width=19 n_iter=15 angle_guard=3 frac_guard=4 rounding=round] luts=1137, accuracy_bits=13.9, ffs=1121, throughput_msps=257, max_abs_err=6.6e-05 (2^-13.89), power_index=21.2
- pipelined [data_width=21 n_iter=16 angle_guard=-1 frac_guard=1 rounding=round] luts=1156, accuracy_bits=14.4, ffs=1144, throughput_msps=264, max_abs_err=4.72e-05 (2^-14.37), power_index=21.6
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=4 rounding=round] luts=1249, accuracy_bits=14.8, ffs=1229, throughput_msps=257, max_abs_err=3.61e-05 (2^-14.76), power_index=23.3
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1297, accuracy_bits=15.6, ffs=1284, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=24.3
- pipelined [data_width=20 n_iter=20 angle_guard=4 frac_guard=2 rounding=trunc] luts=1487, accuracy_bits=16.1, ffs=1505, throughput_msps=257, max_abs_err=1.38e-05 (2^-16.14), power_index=28.1
- pipelined [data_width=21 n_iter=20 angle_guard=4 frac_guard=3 rounding=trunc] luts=1587, accuracy_bits=17.5, ffs=1602, throughput_msps=257, max_abs_err=5.58e-06 (2^-17.45), power_index=30
- pipelined [data_width=21 n_iter=22 angle_guard=3 frac_guard=3 rounding=trunc] luts=1731, accuracy_bits=17.8, ffs=1741, throughput_msps=257, max_abs_err=4.43e-06 (2^-17.78), power_index=32.7
- pipelined [data_width=21 n_iter=22 angle_guard=3 frac_guard=4 rounding=round] luts=1820, accuracy_bits=18.4, ffs=1784, throughput_msps=257, max_abs_err=2.8e-06 (2^-18.45), power_index=33.9

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 9.13 MSPS; best accuracy 16.72 bits
- pipelined: 50 evals, 40 feasible; max throughput seen 273 MSPS; best accuracy 18.45 bits; best feasible luts=1000; feasible ranges: data_width 17..22, n_iter 15..22, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 35 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 17.78 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the round on the only throughput-feasible family and on the low-LUT corner of its design space, since the selection rule is min LUTs and the current winner has only 0.3 bits of accuracy margin.*)
- `pipelined` (85 evals): data_width=15..20, n_iter=12..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Sole family that reaches >=250 MSPS; box around the 1000-LUT winner, probing lower data_width (15-16) and lower n_iter (12-14) to see if the error limit is still met with fewer LUTs, and keeping angle_guard/frac_guard/rounding free since they trade accuracy against cost.
- `pipelined_m` (15 evals): data_width=17..21, n_iter=14..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..2. *Why:* Small probe at m=2 (the shortest combinational path, hence highest Fmax of this family) to confirm whether any pipelined_m point can reach 250 MSPS; round-1's 171 MSPS ceiling may have come from larger m, and m=2 would share the same datapath LUTs as pipelined.

**Result (code):** 100 evaluations this round, 200 total; 85 feasible; hypervolume 1.43e+04 (+1.1%).

**LLM decision:** `refine` — Every one of the 85 feasible designs is `pipelined`; the other explored families cannot reach the 250 MSPS floor (unrolled_k max throughput 9.13 MSPS, pipelined_m max 171 MSPS, both < 250), and `iterative` is structurally worse still (1 result per N+3 cycles, so even at a generous Fmax it lands far below 250 MSPS) — so spending budget on add_family would be wasted. The binding constraint is throughput (32% violate, best seen only 273 MSPS), which only `pipelined` clears, and the selection rule is min LUTs. The current min-LUT feasible point is data_width=17/n_iter=15 at luts=1000, accuracy_bits=13.3 — only 0.3 bits of margin over the 2^-13 error limit. That thin margin is exactly where a cheaper design could hide: a smaller data_width raises Fmax (more throughput headroom) and cuts LUTs, and the front shows accuracy is jointly set by data_width and n_iter (17→20 bits of width buys only ~0.8 accuracy bits), so n_iter/guard/rounding trades may recover the lost bit. Refining tightly around the low-LUT corner is the highest-value use of the remaining 200 evals.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.43e+04 (gain this round: +1.1%).
Feasible designs: 85 of 200 evaluations (62 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 32% violate; best seen 273
- max_abs_err <= 0.00012207: 42% violate; best seen 2.8e-06 (2^-18.45)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts=1000, accuracy_bits=13.3, ffs=989, throughput_msps=264, max_abs_err=9.76e-05 (2^-13.32), power_index=18.7
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] luts=1033, accuracy_bits=13.7, ffs=1061, throughput_msps=264, max_abs_err=7.43e-05 (2^-13.72), power_index=19.7
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] luts=1080, accuracy_bits=14.1, ffs=1110, throughput_msps=264, max_abs_err=5.62e-05 (2^-14.12), power_index=20.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=round] luts=1276, accuracy_bits=15.5, ffs=1259, throughput_msps=257, max_abs_err=2.19e-05 (2^-15.48), power_index=23.8
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1297, accuracy_bits=15.6, ffs=1284, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=24.3
- pipelined [data_width=20 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc] luts=1447, accuracy_bits=16, ffs=1465, throughput_msps=264, max_abs_err=1.54e-05 (2^-15.99), power_index=27.4
- pipelined [data_width=20 n_iter=20 angle_guard=2 frac_guard=3 rounding=round] luts=1529, accuracy_bits=16.8, ffs=1503, throughput_msps=257, max_abs_err=9e-06 (2^-16.76), power_index=28.5
- pipelined [data_width=21 n_iter=22 angle_guard=3 frac_guard=3 rounding=trunc] luts=1731, accuracy_bits=17.8, ffs=1741, throughput_msps=257, max_abs_err=4.43e-06 (2^-17.78), power_index=32.7
- pipelined [data_width=21 n_iter=22 angle_guard=3 frac_guard=4 rounding=round] luts=1820, accuracy_bits=18.4, ffs=1784, throughput_msps=257, max_abs_err=2.8e-06 (2^-18.45), power_index=33.9

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 9.13 MSPS; best accuracy 16.72 bits
- pipelined: 135 evals, 85 feasible; max throughput seen 273 MSPS; best accuracy 18.45 bits; best feasible luts=1000; feasible ranges: data_width 17..22, n_iter 15..22, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 17.78 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine pipelined around the low-LUT corner; do not add iterative/unrolled_k (throughput structurally unreachable).*)
- `pipelined` (95 evals): data_width=16..19, n_iter=14..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Push the min-LUT end of the front below 1000 LUTs while keeping throughput >= 250 and max_abs_err <= 2^-13; data_width 16-18 and n_iter 14-16 are the untested cheaper neighbours of the current winner (17/15).
- `pipelined_m` (5 evals): data_width=16..18, n_iter=14..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..3. *Why:* Only a token probe to confirm the 171 MSPS ceiling is not beaten by m=2 at small width; expected infeasible.

**Result (code):** 100 evaluations this round, 300 total; 133 feasible; hypervolume 1.434e+04 (+0.2%).

**LLM decision:** `refine` — Feasible front is entirely pipelined (133 feasible, best luts=935 at W=18/N=15 with accuracy_bits=13.04, throughput=264). unrolled_k and pipelined_m produced 0 feasible designs (throughput ceilings 9.13 and 171 MSPS), and iterative cannot help: at 1 micro-rotation/cycle it yields Fmax/(N+3) results/cycle, i.e. <=Fmax/7 for N>=4, structurally below the 250 MSPS constraint regardless of configuration. With a 0.2% round gain and selection = min luts, the remaining 100 evals are best spent refining the low-LUT corner of pipelined rather than adding an infeasible family.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.25% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.434e+04 (gain this round: +0.2%).
Feasible designs: 133 of 300 evaluations (101 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 23% violate; best seen 273
- max_abs_err <= 0.00012207: 45% violate; best seen 2.8e-06 (2^-18.45)

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts=935, accuracy_bits=13, ffs=969, throughput_msps=264, max_abs_err=0.000119 (2^-13.04), power_index=17.9
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] luts=1033, accuracy_bits=13.7, ffs=1061, throughput_msps=264, max_abs_err=7.43e-05 (2^-13.72), power_index=19.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] luts=1080, accuracy_bits=14.2, ffs=1106, throughput_msps=264, max_abs_err=5.43e-05 (2^-14.17), power_index=20.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=4 rounding=trunc] luts=1253, accuracy_bits=15.2, ffs=1270, throughput_msps=257, max_abs_err=2.62e-05 (2^-15.22), power_index=23.7
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1297, accuracy_bits=15.6, ffs=1284, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=24.3
- pipelined [data_width=19 n_iter=18 angle_guard=3 frac_guard=3 rounding=round] luts=1335, accuracy_bits=15.8, ffs=1316, throughput_msps=264, max_abs_err=1.78e-05 (2^-15.78), power_index=24.9
- pipelined [data_width=20 n_iter=20 angle_guard=4 frac_guard=2 rounding=trunc] luts=1487, accuracy_bits=16.1, ffs=1505, throughput_msps=257, max_abs_err=1.38e-05 (2^-16.14), power_index=28.1
- pipelined [data_width=21 n_iter=22 angle_guard=3 frac_guard=3 rounding=trunc] luts=1731, accuracy_bits=17.8, ffs=1741, throughput_msps=257, max_abs_err=4.43e-06 (2^-17.78), power_index=32.7
- pipelined [data_width=21 n_iter=22 angle_guard=3 frac_guard=4 rounding=round] luts=1820, accuracy_bits=18.4, ffs=1784, throughput_msps=257, max_abs_err=2.8e-06 (2^-18.45), power_index=33.9

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 9.13 MSPS; best accuracy 16.72 bits
- pipelined: 230 evals, 133 feasible; max throughput seen 273 MSPS; best accuracy 18.45 bits; best feasible luts=935; feasible ranges: data_width 16..22, n_iter 15..22, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 55 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 17.78 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 1)
- tokens: 9932 in, 12865 out
- provider-reported cost: $0.0141
- full prompts and replies: `llm_trace.jsonl`

