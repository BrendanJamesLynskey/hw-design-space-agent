# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined:data_width=20,n_iter=15,angle_guard=-1,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 964 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 999 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.65e-05 (2^-13.34) | exact: bit-accurate model, dense (125151 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 25.3 | exact: bit-accurate model, dense (125151 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.67e-05 (2^-15.19) | exact: bit-accurate model, dense (125151 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 6.99 | exact: bit-accurate model, dense (125151 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.3 | exact: bit-accurate model, dense (125151 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=20,n_iter=15,angle_guard=-1,frac_guard=0,rounding=round` | 964 | 999 | 264.5 | 17 | 18.5 | 9.65e-05 (2^-13.34) | 13.34 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 994 | 1025 | 264.5 | 17 | 19 | 9.41e-05 (2^-13.38) | 13.38 |
| 2 | `pipelined:data_width=20,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 1008 | 1044 | 264.5 | 17 | 19.3 | 7.03e-05 (2^-13.80) | 13.80 |
| 3 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 1065 | 1057 | 264.5 | 17 | 20 | 7.02e-05 (2^-13.80) | 13.80 |
| 4 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=1,rounding=trunc` | 1080 | 1110 | 264.5 | 18 | 20.6 | 5.64e-05 (2^-14.11) | 14.11 |
| 5 | `pipelined:data_width=21,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1096 | 1130 | 264.5 | 18 | 20.9 | 4.14e-05 (2^-14.56) | 14.56 |
| 6 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=4,rounding=trunc` | 1175 | 1195 | 256.5 | 18 | 22.3 | 4.04e-05 (2^-14.59) | 14.59 |
| 7 | `pipelined:data_width=22,n_iter=16,angle_guard=3,frac_guard=0,rounding=trunc` | 1191 | 1227 | 256.5 | 18 | 22.7 | 3.7e-05 (2^-14.72) | 14.72 |
| 8 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc` | 1202 | 1227 | 264.5 | 19 | 22.8 | 2.8e-05 (2^-15.12) | 15.12 |
| 9 | `pipelined:data_width=20,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc` | 1236 | 1261 | 256.5 | 19 | 23.5 | 2.37e-05 (2^-15.36) | 15.36 |
| 10 | `pipelined:data_width=20,n_iter=17,angle_guard=3,frac_guard=2,rounding=round` | 1278 | 1263 | 256.5 | 19 | 23.9 | 2.01e-05 (2^-15.61) | 15.61 |
| 11 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc` | 1287 | 1313 | 256.5 | 19 | 24.4 | 1.97e-05 (2^-15.63) | 15.63 |
| 12 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 1331 | 1350 | 256.5 | 20 | 25.2 | 1.59e-05 (2^-15.94) | 15.94 |
| 13 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 1357 | 1342 | 256.5 | 20 | 25.4 | 1.24e-05 (2^-16.30) | 16.30 |
| 14 | `pipelined:data_width=22,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc` | 1367 | 1394 | 256.5 | 20 | 26 | 1.15e-05 (2^-16.41) | 16.41 |
| 15 | `pipelined:data_width=22,n_iter=18,angle_guard=3,frac_guard=1,rounding=trunc` | 1385 | 1412 | 256.5 | 20 | 26.3 | 1.08e-05 (2^-16.50) | 16.50 |
| 16 | `pipelined:data_width=20,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc` | 1428 | 1445 | 256.5 | 21 | 27 | 1.07e-05 (2^-16.51) | 16.51 |
| 17 | `pipelined:data_width=21,n_iter=18,angle_guard=3,frac_guard=4,rounding=trunc` | 1438 | 1455 | 256.5 | 20 | 27.2 | 1.05e-05 (2^-16.55) | 16.55 |
| 18 | `pipelined:data_width=21,n_iter=19,angle_guard=3,frac_guard=1,rounding=round` | 1453 | 1436 | 256.5 | 21 | 27.2 | 8.82e-06 (2^-16.79) | 16.79 |
| 19 | `pipelined:data_width=21,n_iter=19,angle_guard=2,frac_guard=2,rounding=round` | 1472 | 1451 | 256.5 | 21 | 27.5 | 7.33e-06 (2^-17.06) | 17.06 |
| 20 | `pipelined:data_width=21,n_iter=20,angle_guard=2,frac_guard=2,rounding=round` | 1551 | 1528 | 256.5 | 22 | 29 | 5.43e-06 (2^-17.49) | 17.49 |
| 21 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=1,rounding=round` | 1593 | 1572 | 256.5 | 22 | 29.8 | 4.05e-06 (2^-17.91) | 17.91 |
| 22 | `pipelined:data_width=24,n_iter=21,angle_guard=0,frac_guard=0,rounding=round` | 1649 | 1674 | 256.5 | 23 | 31.2 | 2.68e-06 (2^-18.51) | 18.51 |
| 23 | `pipelined:data_width=21,n_iter=21,angle_guard=4,frac_guard=4,rounding=round` | 1757 | 1723 | 256.5 | 23 | 32.7 | 2.61e-06 (2^-18.55) | 18.55 |
| 24 | `pipelined:data_width=25,n_iter=22,angle_guard=0,frac_guard=1,rounding=round` | 1895 | 1862 | 256.5 | 24 | 35.3 | 1.26e-06 (2^-19.60) | 19.60 |
| 25 | `pipelined:data_width=23,n_iter=25,angle_guard=3,frac_guard=3,rounding=trunc` | 2130 | 2132 | 256.5 | 27 | 40.1 | 1.17e-06 (2^-19.71) | 19.71 |
| 26 | `pipelined:data_width=25,n_iter=25,angle_guard=0,frac_guard=1,rounding=round` | 2157 | 2117 | 256.5 | 27 | 40.2 | 9.91e-07 (2^-19.94) | 19.94 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec is a hard-throughput NCO: >=250 MSPS with 1 sample/clock. On Artix-7 only the fully/partially pipelined families produce 1 result/cycle; iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) would require Fmax in the GHz range and are therefore excluded from the first round rather than wasting budget on provably infeasible designs. Accuracy depends only on the shared bit-level parameters, so both pipelined families are searched over the same W/N/guard/rounding box that brackets the 2^-13 error requirement (W around 15-16 with rounding, N around 14-16), letting the optimiser find the smallest LUT count that still meets error. The 60/40 split favours full pipelining (best Fmax, most likely feasible corner) while reserving enough budget for pipelined_m to map the lower-area/lower-Fmax part of the front. Ranges are deliberately wider than the expected optimum so round 1 reveals the feasible region and the trade-off shape; later rounds can narrow onto the front and spend the reserved budget mapping it over the full parameter ranges.*)
- `pipelined` (60 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only the pipelined families can deliver 1 result/cycle, which is the sole way to reach >=250 MSPS on an Artix-7 (iterative needs Fmax ~ N+3 times the target, unrolled_k still needs several hundred MHz to GHz). Full pipelining (m=1) gives the shortest combinational path and hence the highest Fmax, so it is the most likely family to satisfy the throughput constraint at the smallest data_width/n_iter, which is exactly where LUTs are minimised. Ranges cover the accuracy-feasible region (W>=12 gives LSB 2^-10, so W>=15-16 with rounding is needed for 2^-13) and let the search trade n_iter against data_width for LUTs.
- `pipelined_m` (40 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle, so it can meet the 250 MSPS constraint, but registering every m stages cuts FF count and can reduce area at the cost of a longer combinational path (lower Fmax). Since the objective is min LUTs (not FFs), this family is a genuine trade-off partner: it may reach lower LUTs at a still-adequate Fmax, and it is needed to cover the Pareto front's area/throughput corner. m is swept 2..8 to expose the Fmax-vs-area knee.

**Result (code):** 100 evaluations this round, 100 total; 30 feasible; hypervolume 5797 (n/a).

**LLM decision:** `map_front` — Only `pipelined` can satisfy the hard throughput constraint: `pipelined_m` (also 1 result/cycle) topped out at 171 MSPS < 250, and `iterative`/`unrolled_k` emit <1 result/cycle (N+3 and ceil(N/k)+3 cycles), so their throughput is far below 250 — spending budget on them is wasted. The feasible front spans luts 994..1411 against an HV reference of 4000 and accuracy 13.4..15 bits against a reference of 13, i.e. it covers only a small slice of both objective ranges. The registry allows data_width up to 28 and n_iter up to 30, so much higher-accuracy (and higher-lut, still <4000) pipelined designs are unexplored and would add substantial HV area, while lower-lut designs near the 2^-13 accuracy limit are also worth probing. This is exactly the trigger for a coverage search, so hand this round to NSGA-II over the full pipelined parameter ranges seeded with the current front.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5797 (gain this round: n/a (first round)).
Feasible designs: 30 of 100 evaluations (22 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 40% violate; best seen 282
- max_abs_err <= 0.00012207: 53% violate; best seen 8.07e-06 (2^-16.92)

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts=994, accuracy_bits=13.4, ffs=1025, throughput_msps=264, max_abs_err=9.41e-05 (2^-13.38), power_index=19
- pipelined [data_width=20 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=1008, accuracy_bits=13.8, ffs=1044, throughput_msps=264, max_abs_err=7.03e-05 (2^-13.80), power_index=19.3
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1128, accuracy_bits=14.4, ffs=1150, throughput_msps=264, max_abs_err=4.57e-05 (2^-14.42), power_index=21.4
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts=1143, accuracy_bits=14.5, ffs=1166, throughput_msps=264, max_abs_err=4.32e-05 (2^-14.50), power_index=21.7
- pipelined [data_width=19 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] luts=1287, accuracy_bits=14.5, ffs=1312, throughput_msps=264, max_abs_err=4.26e-05 (2^-14.52), power_index=24.4
- pipelined [data_width=19 n_iter=20 angle_guard=1 frac_guard=2 rounding=trunc] luts=1367, accuracy_bits=14.6, ffs=1384, throughput_msps=264, max_abs_err=3.93e-05 (2^-14.64), power_index=25.9
- pipelined [data_width=19 n_iter=20 angle_guard=1 frac_guard=2 rounding=round] luts=1407, accuracy_bits=15, ffs=1386, throughput_msps=264, max_abs_err=3.12e-05 (2^-14.97), power_index=26.3
- pipelined [data_width=19 n_iter=19 angle_guard=1 frac_guard=4 rounding=round] luts=1411, accuracy_bits=15, ffs=1385, throughput_msps=257, max_abs_err=2.98e-05 (2^-15.03), power_index=26.3
Front coverage: luts 994..1411 (HV reference 4000); accuracy_bits 13.4..15 (HV reference 13); data_width on the front 19..20 (registry 8..28).

Per family:
- pipelined: 60 evals, 30 feasible; max throughput seen 282 MSPS; best accuracy 15.03 bits; best feasible luts=994; feasible ranges: data_width 18..20, n_iter 15..20, angle_guard 0..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.92 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=18..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (8 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 95 feasible; hypervolume 1.686e+04 (+190.8%).

**LLM decision:** `refine` — The feasible front is entirely `pipelined`: `pipelined_m` is 0/40 feasible (max 171 MSPS, below the 250 MSPS floor), and `iterative`/`unrolled_k` produce one result every N+3 / ceil(N/k)+3 cycles, so they would need Fmax well above the 282 MSPS best seen for `pipelined` to reach 250 MSPS — `pipelined` (1 result/cycle) is effectively the only family that can satisfy the throughput constraint. The selection rule is min LUTs, and the min-LUT front point is 994 LUTs at only 13.4 accuracy bits (err 9.41e-5 vs the 2^-13=1.22e-4 limit), i.e. it sits right on the accuracy boundary — so the low-LUT corner (data_width 18-22, n_iter 14-20) is where both the selection pick and the hypervolume gains live. I refine there and spend a small share probing `unrolled_k` to close out the unexplored family.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.686e+04 (gain this round: +190.8%).
Feasible designs: 95 of 200 evaluations (83 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 36% violate; best seen 282
- max_abs_err <= 0.00012207: 29% violate; best seen 5.72e-08 (2^-24.06)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts=994, accuracy_bits=13.4, ffs=1025, throughput_msps=264, max_abs_err=9.41e-05 (2^-13.38), power_index=19
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1128, accuracy_bits=14.4, ffs=1150, throughput_msps=264, max_abs_err=4.57e-05 (2^-14.42), power_index=21.4
- pipelined [data_width=23 n_iter=16 angle_guard=-2 frac_guard=1 rounding=round] luts=1239, accuracy_bits=14.6, ffs=1225, throughput_msps=257, max_abs_err=3.9e-05 (2^-14.65), power_index=23.2
- pipelined [data_width=23 n_iter=16 angle_guard=-1 frac_guard=3 rounding=trunc] luts=1270, accuracy_bits=14.8, ffs=1295, throughput_msps=257, max_abs_err=3.42e-05 (2^-14.84), power_index=24.1
- pipelined [data_width=25 n_iter=17 angle_guard=-1 frac_guard=0 rounding=trunc] luts=1354, accuracy_bits=15.9, ffs=1389, throughput_msps=257, max_abs_err=1.67e-05 (2^-15.87), power_index=25.8
- pipelined [data_width=21 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] luts=1472, accuracy_bits=17.1, ffs=1451, throughput_msps=257, max_abs_err=7.33e-06 (2^-17.06), power_index=27.5
- pipelined [data_width=24 n_iter=22 angle_guard=0 frac_guard=0 rounding=trunc] luts=1731, accuracy_bits=18.3, ffs=1754, throughput_msps=257, max_abs_err=3.11e-06 (2^-18.30), power_index=32.8
- pipelined [data_width=22 n_iter=24 angle_guard=2 frac_guard=3 rounding=trunc] luts=1944, accuracy_bits=18.4, ffs=1949, throughput_msps=257, max_abs_err=2.92e-06 (2^-18.39), power_index=36.6
- pipelined [data_width=22 n_iter=24 angle_guard=2 frac_guard=4 rounding=round] luts=2039, accuracy_bits=18.6, ffs=1996, throughput_msps=257, max_abs_err=2.55e-06 (2^-18.58), power_index=37.9
- pipelined [data_width=24 n_iter=28 angle_guard=1 frac_guard=2 rounding=round] luts=2417, accuracy_bits=19.8, ffs=2367, throughput_msps=257, max_abs_err=1.06e-06 (2^-19.84), power_index=45
Front coverage: luts 994..2417 (HV reference 4000); accuracy_bits 13.4..19.8 (HV reference 13); data_width on the front 19..25 (registry 8..28).

Per family:
- pipelined: 160 evals, 95 feasible; max throughput seen 282 MSPS; best accuracy 24.06 bits; best feasible luts=994; feasible ranges: data_width 18..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.92 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine the pipelined low-LUT corner (data_width 18-22, n_iter 14-20) where the selection rule and HV both concentrate, with a small unrolled_k probe to close the last unexplored family.*)
- `pipelined` (80 evals): data_width=18..22, n_iter=14..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Sharpen the min-LUT corner: the 994-LUT design (data_width=19, n_iter=15) is only 0.4 bits above the 2^-13 limit, so finer sampling of small data_width / small n_iter is where a cheaper feasible design and HV gain would appear.
- `unrolled_k` (20 evals): data_width=18..24, n_iter=12..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* Unexplored family; even at k=8 it needs ceil(N/k)+3 cycles/result, so it must beat pipelined's 282 MSPS Fmax to be feasible — a small probe confirms or rules it out cheaply.

**Result (code):** 100 evaluations this round, 300 total; 161 feasible; hypervolume 1.712e+04 (+1.5%).

**LLM decision:** `map_front` — Only `pipelined` is feasible: unrolled_k (max 8.85 MSPS) and pipelined_m (max 171 MSPS) both fall far short of the 250 MSPS constraint, and iterative is strictly slower than unrolled_k, so it cannot help. The feasible front is therefore confined to pipelined, and it is already well-populated (30 designs, 161 feasible evals). However, the front only spans luts 964..2417 against the HV reference of 4000, while best-seen accuracy is 24.06 bits versus only 19.8 bits on the front — so the high-luts/high-accuracy end of the trade-off curve is unmapped and is leaving hypervolume on the table. With 100 evals left in the final round, the reserved budget is best spent letting NSGA-II map the whole pipelined front over its full feasible ranges (data_width 18..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4, both roundings), seeded with the current front, to extend coverage toward the 4000-lut reference and higher accuracy_bits. The min-luts selection corner (964 luts, 13.3 bits) is already captured, so no refinement is needed there.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.712e+04 (gain this round: +1.5%).
Feasible designs: 161 of 300 evaluations (141 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 30% violate; best seen 282
- max_abs_err <= 0.00012207: 28% violate; best seen 5.72e-08 (2^-24.06)

Pareto front (feasible, 30 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=round] luts=964, accuracy_bits=13.3, ffs=999, throughput_msps=264, max_abs_err=9.65e-05 (2^-13.34), power_index=18.5
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=1065, accuracy_bits=13.8, ffs=1057, throughput_msps=264, max_abs_err=7.02e-05 (2^-13.80), power_index=20
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1128, accuracy_bits=14.4, ffs=1150, throughput_msps=264, max_abs_err=4.57e-05 (2^-14.42), power_index=21.4
- pipelined [data_width=22 n_iter=16 angle_guard=3 frac_guard=0 rounding=trunc] luts=1191, accuracy_bits=14.7, ffs=1227, throughput_msps=257, max_abs_err=3.7e-05 (2^-14.72), power_index=22.7
- pipelined [data_width=20 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] luts=1278, accuracy_bits=15.6, ffs=1263, throughput_msps=257, max_abs_err=2.01e-05 (2^-15.61), power_index=23.9
- pipelined [data_width=22 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] luts=1367, accuracy_bits=16.4, ffs=1394, throughput_msps=257, max_abs_err=1.15e-05 (2^-16.41), power_index=26
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=4 rounding=trunc] luts=1438, accuracy_bits=16.5, ffs=1455, throughput_msps=257, max_abs_err=1.05e-05 (2^-16.55), power_index=27.2
- pipelined [data_width=22 n_iter=20 angle_guard=3 frac_guard=1 rounding=round] luts=1593, accuracy_bits=17.9, ffs=1572, throughput_msps=257, max_abs_err=4.05e-06 (2^-17.91), power_index=29.8
- pipelined [data_width=21 n_iter=25 angle_guard=3 frac_guard=3 rounding=round] luts=2022, accuracy_bits=18.4, ffs=1983, throughput_msps=257, max_abs_err=2.88e-06 (2^-18.41), power_index=37.7
- pipelined [data_width=24 n_iter=28 angle_guard=1 frac_guard=2 rounding=round] luts=2417, accuracy_bits=19.8, ffs=2367, throughput_msps=257, max_abs_err=1.06e-06 (2^-19.84), power_index=45
Front coverage: luts 964..2417 (HV reference 4000); accuracy_bits 13.3..19.8 (HV reference 13); data_width on the front 18..24 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.85 MSPS; best accuracy 14.13 bits
- pipelined: 240 evals, 161 feasible; max throughput seen 282 MSPS; best accuracy 24.06 bits; best feasible luts=964; feasible ranges: data_width 18..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.92 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (30 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 208 feasible; hypervolume 1.773e+04 (+3.5%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the front is feasible and healthy: 208 feasible designs (178 unique), HV 1.773e+04 with a +3.5% gain this round. The selection rule (min luts) is satisfied by pipelined [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=round] at luts=964, accuracy_bits=13.3 (max_abs_err 9.65e-05 <= 1.22e-04) and throughput 264 MSPS >= 250, so no constraint is unreachable and `infeasible` is not warranted. The front spans luts 964..2157 and accuracy_bits 13.3..19.9, covering the HV reference points (4000 LUTs, 13 bits) well, and the remaining unexplored family (iterative) cannot help: its throughput is bounded by 1 result per N+3 cycles, and the only non-pipelined family measured (unrolled_k) topped out at 8.85 MSPS, far below the 250 MSPS constraint. Further refinement is not possible within the budget, so stopping is the correct verdict.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.773e+04 (gain this round: +3.5%).
Feasible designs: 208 of 400 evaluations (178 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 34% violate; best seen 282
- max_abs_err <= 0.00012207: 24% violate; best seen 5.72e-08 (2^-24.06)

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=round] luts=964, accuracy_bits=13.3, ffs=999, throughput_msps=264, max_abs_err=9.65e-05 (2^-13.34), power_index=18.5
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=1065, accuracy_bits=13.8, ffs=1057, throughput_msps=264, max_abs_err=7.02e-05 (2^-13.80), power_index=20
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=4 rounding=trunc] luts=1175, accuracy_bits=14.6, ffs=1195, throughput_msps=257, max_abs_err=4.04e-05 (2^-14.59), power_index=22.3
- pipelined [data_width=20 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc] luts=1236, accuracy_bits=15.4, ffs=1261, throughput_msps=257, max_abs_err=2.37e-05 (2^-15.36), power_index=23.5
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] luts=1331, accuracy_bits=15.9, ffs=1350, throughput_msps=257, max_abs_err=1.59e-05 (2^-15.94), power_index=25.2
- pipelined [data_width=22 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] luts=1367, accuracy_bits=16.4, ffs=1394, throughput_msps=257, max_abs_err=1.15e-05 (2^-16.41), power_index=26
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=4 rounding=trunc] luts=1438, accuracy_bits=16.5, ffs=1455, throughput_msps=257, max_abs_err=1.05e-05 (2^-16.55), power_index=27.2
- pipelined [data_width=21 n_iter=20 angle_guard=2 frac_guard=2 rounding=round] luts=1551, accuracy_bits=17.5, ffs=1528, throughput_msps=257, max_abs_err=5.43e-06 (2^-17.49), power_index=29
- pipelined [data_width=21 n_iter=21 angle_guard=4 frac_guard=4 rounding=round] luts=1757, accuracy_bits=18.5, ffs=1723, throughput_msps=257, max_abs_err=2.61e-06 (2^-18.55), power_index=32.7
- pipelined [data_width=25 n_iter=25 angle_guard=0 frac_guard=1 rounding=round] luts=2157, accuracy_bits=19.9, ffs=2117, throughput_msps=257, max_abs_err=9.91e-07 (2^-19.94), power_index=40.2
Front coverage: luts 964..2157 (HV reference 4000); accuracy_bits 13.3..19.9 (HV reference 13); data_width on the front 19..25 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.85 MSPS; best accuracy 14.13 bits
- pipelined: 340 evals, 208 feasible; max throughput seen 282 MSPS; best accuracy 24.06 bits; best feasible luts=964; feasible ranges: data_width 17..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.92 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 14871 in, 15591 out
- provider-reported cost: $0.0112
- full prompts and replies: `llm_trace.jsonl`

