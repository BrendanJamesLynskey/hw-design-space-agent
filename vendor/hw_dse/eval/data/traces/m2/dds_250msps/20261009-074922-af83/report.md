# DSE run: dds_250msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
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
`pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 971 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 963 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000108 (2^-13.18) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 3.54 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.87e-05 (2^-15.09) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 0.94 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.2 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (31 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 971 | 963 | 264.5 | 17 | 18.2 | 0.000108 (2^-13.18) | 13.18 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 973 | 967 | 264.5 | 17 | 18.2 | 0.000101 (2^-13.27) | 13.27 |
| 2 | `pipelined:data_width=17,n_iter=15,angle_guard=3,frac_guard=2,rounding=round` | 985 | 978 | 264.5 | 17 | 18.5 | 9.31e-05 (2^-13.39) | 13.39 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 987 | 982 | 264.5 | 17 | 18.5 | 9.31e-05 (2^-13.39) | 13.39 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=1,rounding=round` | 1002 | 997 | 264.5 | 17 | 18.8 | 8.97e-05 (2^-13.44) | 13.44 |
| 5 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 1017 | 1008 | 264.5 | 17 | 19 | 8.26e-05 (2^-13.56) | 13.56 |
| 6 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 1063 | 1053 | 264.5 | 17 | 19.9 | 7.18e-05 (2^-13.77) | 13.77 |
| 7 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=round` | 1071 | 1063 | 264.5 | 18 | 20.1 | 6.51e-05 (2^-13.91) | 13.91 |
| 8 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1084 | 1071 | 264.5 | 18 | 20.3 | 6.42e-05 (2^-13.93) | 13.93 |
| 9 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1086 | 1076 | 264.5 | 18 | 20.3 | 5.46e-05 (2^-14.16) | 14.16 |
| 10 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=2,rounding=round` | 1120 | 1108 | 264.5 | 18 | 21 | 5.03e-05 (2^-14.28) | 14.28 |
| 11 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1134 | 1120 | 264.5 | 18 | 21.2 | 4.52e-05 (2^-14.43) | 14.43 |
| 12 | `pipelined:data_width=21,n_iter=16,angle_guard=3,frac_guard=0,rounding=round` | 1143 | 1178 | 256.5 | 18 | 21.8 | 3.65e-05 (2^-14.74) | 14.74 |
| 13 | `pipelined:data_width=21,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 1203 | 1193 | 256.5 | 18 | 22.5 | 3.39e-05 (2^-14.85) | 14.85 |
| 14 | `pipelined:data_width=23,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc` | 1222 | 1255 | 256.5 | 18 | 23.3 | 3.23e-05 (2^-14.92) | 14.92 |
| 15 | `pipelined:data_width=24,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1238 | 1275 | 256.5 | 18 | 23.6 | 3.16e-05 (2^-14.95) | 14.95 |
| 16 | `pipelined:data_width=24,n_iter=16,angle_guard=0,frac_guard=2,rounding=trunc` | 1301 | 1332 | 256.5 | 18 | 24.8 | 3.12e-05 (2^-14.97) | 14.97 |
| 17 | `pipelined:data_width=20,n_iter=18,angle_guard=1,frac_guard=2,rounding=round` | 1319 | 1302 | 264.5 | 20 | 24.6 | 1.92e-05 (2^-15.67) | 15.67 |
| 18 | `pipelined:data_width=24,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 1320 | 1355 | 256.5 | 19 | 25.2 | 1.63e-05 (2^-15.90) | 15.90 |
| 19 | `pipelined:data_width=23,n_iter=17,angle_guard=3,frac_guard=1,rounding=round` | 1403 | 1387 | 256.5 | 19 | 26.2 | 1.61e-05 (2^-15.92) | 15.92 |
| 20 | `pipelined:data_width=20,n_iter=19,angle_guard=2,frac_guard=2,rounding=round` | 1413 | 1393 | 264.5 | 21 | 26.4 | 1.17e-05 (2^-16.38) | 16.38 |
| 21 | `pipelined:data_width=23,n_iter=19,angle_guard=0,frac_guard=0,rounding=round` | 1428 | 1457 | 256.5 | 21 | 27.1 | 7.05e-06 (2^-17.11) | 17.11 |
| 22 | `pipelined:data_width=24,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc` | 1485 | 1514 | 256.5 | 21 | 28.2 | 6.02e-06 (2^-17.34) | 17.34 |
| 23 | `pipelined:data_width=25,n_iter=19,angle_guard=-2,frac_guard=0,rounding=round` | 1504 | 1534 | 256.5 | 21 | 28.6 | 5.96e-06 (2^-17.36) | 17.36 |
| 24 | `pipelined:data_width=23,n_iter=19,angle_guard=1,frac_guard=1,rounding=round` | 1533 | 1512 | 256.5 | 21 | 28.6 | 5.75e-06 (2^-17.41) | 17.41 |
| 25 | `pipelined:data_width=23,n_iter=20,angle_guard=3,frac_guard=0,rounding=round` | 1567 | 1594 | 256.5 | 22 | 29.7 | 3.56e-06 (2^-18.10) | 18.10 |
| 26 | `pipelined:data_width=24,n_iter=21,angle_guard=0,frac_guard=0,rounding=trunc` | 1649 | 1674 | 256.5 | 23 | 31.2 | 3.35e-06 (2^-18.19) | 18.19 |
| 27 | `pipelined:data_width=22,n_iter=21,angle_guard=3,frac_guard=3,rounding=round` | 1759 | 1727 | 256.5 | 23 | 32.8 | 2.17e-06 (2^-18.81) | 18.81 |
| 28 | `pipelined:data_width=25,n_iter=22,angle_guard=0,frac_guard=1,rounding=trunc` | 1842 | 1860 | 256.5 | 24 | 34.8 | 1.38e-06 (2^-19.47) | 19.47 |
| 29 | `pipelined:data_width=25,n_iter=25,angle_guard=1,frac_guard=0,rounding=round` | 2079 | 2094 | 256.5 | 27 | 39.2 | 1.05e-06 (2^-19.86) | 19.86 |
| 30 | `pipelined:data_width=25,n_iter=28,angle_guard=1,frac_guard=1,rounding=round` | 2448 | 2399 | 256.5 | 30 | 45.6 | 6.42e-07 (2^-20.57) | 20.57 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec is throughput-bound: >= 250 MSPS with one sample per clock. iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) cannot reach 250 MSPS at any plausible Artix-7 Fmax, so they are excluded from round 1 and would only be revisited if the pipelined families prove infeasible. Both pipelined families emit 1 result/cycle, so the throughput constraint reduces to Fmax >= 250 MHz, and the accuracy constraint (max_abs_err <= 2^-13) is met by choosing data_width/n_iter/guards. Round 1 therefore spends the whole 100-eval budget on pipelined (60%) and pipelined_m (40%), with data_width 14-20 and n_iter 12-22 to bracket the error floor, small guard ranges, and both rounding modes. This should reveal whether the feasible front is a single corner (min-LUT design at the accuracy/throughput edge) or a genuine trade-off curve, which then drives the range refinement in later rounds.*)
- `pipelined` (60 evals): data_width=14..20, n_iter=12..22, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only a fully-pipelined family can plausibly satisfy throughput_msps >= 250: it emits 1 result/cycle so throughput == Fmax, and a one-stage-per-micro-rotation schedule has the shortest logic depth per stage, giving the best chance of Fmax >= 250 MHz on Artix-7. It is also the natural accuracy reference (identical bit behaviour to all other families). Ranges: data_width 14-20 brackets the 2^-13 error floor (LSB = 2^-(W-2)); n_iter 12-22 covers the angle-resolution requirement for those widths; small positive angle_guard/frac_guard are allowed to buy accuracy without much area; both rounding modes are searched since rounding can shave a bit of error for free.
- `pipelined_m` (40 evals): data_width=14..20, n_iter=12..22, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Same 1-result/cycle throughput as pipelined, but registering every m stages trades logic depth (hence Fmax) against register count. Since the objective is min LUTs (not FFs), this family may reach a lower-LUT point on the front if the extra combinational depth still clears 250 MHz; m is kept small (2-4) because larger m risks dropping below the 250 MSPS constraint. Same accuracy ranges as pipelined because accuracy is family-independent.

**Result (code):** 100 evaluations this round, 100 total; 37 feasible; hypervolume 9374 (n/a).

**LLM decision:** `widen` — Only `pipelined` can satisfy throughput >= 250 MSPS: it is the sole family with 1 result/cycle, and its front designs sit at 264 MSPS. `pipelined_m` produced 0 feasible designs (max 171 MSPS), and `iterative`/`unrolled_k` need >=4 cycles/result (ceil(N/k)+3 >= 4), so they cannot reach 250 MSPS at any Fmax and are not worth budget. The front's HV is overwhelmingly dominated by its high-accuracy tail: the segment from luts 1413 to the 4000 reference at 16.38 bits contributes ~8744 of the 9374 total, so pushing accuracy upward is by far the largest HV lever, while the min-luts corner (971) drives the min-luts selection rule. The front only spans data_width 17..20 (registry 8..28) and n_iter 15..22 (registry 4..30), so the search box is too tight in both directions and should be widened.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 9374 (gain this round: n/a (first round)).
Feasible designs: 37 of 100 evaluations (31 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 40% violate; best seen 273
- max_abs_err <= 0.00012207: 37% violate; best seen 1.17e-05 (2^-16.38)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=971, accuracy_bits=13.2, ffs=963, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.2
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=1063, accuracy_bits=13.8, ffs=1053, throughput_msps=264, max_abs_err=7.18e-05 (2^-13.77), power_index=19.9
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1120, accuracy_bits=14.3, ffs=1108, throughput_msps=264, max_abs_err=5.03e-05 (2^-14.28), power_index=21
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1156, throughput_msps=264, max_abs_err=3.84e-05 (2^-14.67), power_index=21.9
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=round] luts=1319, accuracy_bits=15.7, ffs=1302, throughput_msps=264, max_abs_err=1.92e-05 (2^-15.67), power_index=24.6
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] luts=1413, accuracy_bits=16.4, ffs=1393, throughput_msps=264, max_abs_err=1.17e-05 (2^-16.38), power_index=26.4
Front coverage: luts 971..1413 (HV reference 4000); accuracy_bits 13.2..16.4 (HV reference 13); data_width on the front 17..20 (registry 8..28).

Per family:
- pipelined: 60 evals, 37 feasible; max throughput seen 273 MSPS; best accuracy 16.38 bits; best feasible luts=971; feasible ranges: data_width 17..20, n_iter 15..22, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.49 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Widen pipelined in both directions: lower data_width to chase the min-luts selection corner, higher data_width/n_iter to grow the accuracy tail that carries almost all of the hypervolume. Skip iterative/unrolled_k (throughput-proven infeasible) and pipelined_m (0 feasible, max 171 MSPS).*)
- `pipelined` (100 evals): data_width=14..18, n_iter=14..22, angle_guard=0..3, frac_guard=1..3, rounding=round. *Why:* Push the min-luts corner below 971 (best feasible so far) by trying smaller data_width with compensating n_iter/guards, since the selection rule is min luts.
- clamped by code: dropped duplicate family pipelined

**Result (code):** 100 evaluations this round, 200 total; 102 feasible; hypervolume 9422 (+0.5%).

**LLM decision:** `add_family` — Only `pipelined` can satisfy the 250 MSPS constraint: it is the sole feasible family (max throughput 273 MSPS), while `pipelined_m` is 0/40 feasible with max throughput 171 MSPS — registering every m stages lengthens the combinational path and drops Fmax below the target. The two unexplored families are structurally throughput-limited: `iterative` needs N+3 cycles/result (N=15 → ~15 MSPS even at pipelined's 273 MHz), and `unrolled_k` needs ceil(N/k)+3 cycles/result (best case N≤k → 4 cycles → needs Fmax ≥ 1000 MHz, far above the 273 MHz pipelined achieves, and chaining k rotations per cycle lowers Fmax further). They are therefore very likely infeasible, but they are the only untested families and a shared-datapath family could in principle beat pipelined's 971 LUTs — which matters because the selection rule is min luts. Spend this round confirming that, then use the final round to map the pipelined front over its full ranges.
- **rule applied by code:** 'add_family' overridden to stop: HV gain 0.51% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9422 (gain this round: +0.5%).
Feasible designs: 102 of 200 evaluations (73 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 20% violate; best seen 273
- max_abs_err <= 0.00012207: 36% violate; best seen 1.17e-05 (2^-16.38)

Pareto front (feasible, 15 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=971, accuracy_bits=13.2, ffs=963, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.2
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] luts=985, accuracy_bits=13.4, ffs=978, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=18.5
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts=987, accuracy_bits=13.4, ffs=982, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=18.5
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=1017, accuracy_bits=13.6, ffs=1008, throughput_msps=264, max_abs_err=8.26e-05 (2^-13.56), power_index=19
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=1063, accuracy_bits=13.8, ffs=1053, throughput_msps=264, max_abs_err=7.18e-05 (2^-13.77), power_index=19.9
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1084, accuracy_bits=13.9, ffs=1071, throughput_msps=264, max_abs_err=6.42e-05 (2^-13.93), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1086, accuracy_bits=14.2, ffs=1076, throughput_msps=264, max_abs_err=5.46e-05 (2^-14.16), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] luts=1134, accuracy_bits=14.4, ffs=1120, throughput_msps=264, max_abs_err=4.52e-05 (2^-14.43), power_index=21.2
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1156, throughput_msps=264, max_abs_err=3.84e-05 (2^-14.67), power_index=21.9
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] luts=1413, accuracy_bits=16.4, ffs=1393, throughput_msps=264, max_abs_err=1.17e-05 (2^-16.38), power_index=26.4
Front coverage: luts 971..1413 (HV reference 4000); accuracy_bits 13.2..16.4 (HV reference 13); data_width on the front 17..20 (registry 8..28).

Per family:
- pipelined: 160 evals, 102 feasible; max throughput seen 273 MSPS; best accuracy 16.38 bits; best feasible luts=971; feasible ranges: data_width 16..20, n_iter 15..22, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.49 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined` (200 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (15 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 222 feasible; hypervolume 1.866e+04 (+98.1%).

**No LLM call** (code's front-mapping round): Only `pipelined` can satisfy the 250 MSPS constraint: it is the sole feasible family (max throughput 273 MSPS), while `pipelined_m` is 0/40 feasible with max throughput 171 MSPS — registering every m stages lengthens the combinational path and drops Fmax below the target. The two unexplored families are structurally throughput-limited: `iterative` needs N+3 cycles/result (N=15 → ~15 MSPS even at pipelined's 273 MHz), and `unrolled_k` needs ceil(N/k)+3 cycles/result (best case N≤k → 4 cycles → needs Fmax ≥ 1000 MHz, far above the 273 MHz pipelined achieves, and chaining k rotations per cycle lowers Fmax further). They are therefore very likely infeasible, but they are the only untested families and a shared-datapath family could in principle beat pipelined's 971 LUTs — which matters because the selection rule is min luts. Spend this round confirming that, then use the final round to map the pipelined front over its full ranges.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.866e+04 (gain this round: +98.1%).
Feasible designs: 222 of 400 evaluations (176 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 23% violate; best seen 273
- max_abs_err <= 0.00012207: 26% violate; best seen 9.63e-08 (2^-23.31)

Pareto front (feasible, 31 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=971, accuracy_bits=13.2, ffs=963, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.2
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts=987, accuracy_bits=13.4, ffs=982, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=18.5
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=round] luts=1071, accuracy_bits=13.9, ffs=1063, throughput_msps=264, max_abs_err=6.51e-05 (2^-13.91), power_index=20.1
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1120, accuracy_bits=14.3, ffs=1108, throughput_msps=264, max_abs_err=5.03e-05 (2^-14.28), power_index=21
- pipelined [data_width=21 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1203, accuracy_bits=14.9, ffs=1193, throughput_msps=257, max_abs_err=3.39e-05 (2^-14.85), power_index=22.5
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=round] luts=1319, accuracy_bits=15.7, ffs=1302, throughput_msps=264, max_abs_err=1.92e-05 (2^-15.67), power_index=24.6
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] luts=1413, accuracy_bits=16.4, ffs=1393, throughput_msps=264, max_abs_err=1.17e-05 (2^-16.38), power_index=26.4
- pipelined [data_width=25 n_iter=19 angle_guard=-2 frac_guard=0 rounding=round] luts=1504, accuracy_bits=17.4, ffs=1534, throughput_msps=257, max_abs_err=5.96e-06 (2^-17.36), power_index=28.6
- pipelined [data_width=22 n_iter=21 angle_guard=3 frac_guard=3 rounding=round] luts=1759, accuracy_bits=18.8, ffs=1727, throughput_msps=257, max_abs_err=2.17e-06 (2^-18.81), power_index=32.8
- pipelined [data_width=25 n_iter=28 angle_guard=1 frac_guard=1 rounding=round] luts=2448, accuracy_bits=20.6, ffs=2399, throughput_msps=257, max_abs_err=6.42e-07 (2^-20.57), power_index=45.6
Front coverage: luts 971..2448 (HV reference 4000); accuracy_bits 13.2..20.6 (HV reference 13); data_width on the front 17..25 (registry 8..28).

Per family:
- pipelined: 360 evals, 222 feasible; max throughput seen 273 MSPS; best accuracy 23.31 bits; best feasible luts=971; feasible ranges: data_width 16..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.49 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7403 in, 14506 out
- provider-reported cost: $0.0091
- full prompts and replies: `llm_trace.jsonl`

