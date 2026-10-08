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
`pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 905 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 938 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 17.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000119 (2^-13.04) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.79 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 3.06e-05 (2^-14.99) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 2.01 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (19 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 905 | 938 | 264.5 | 17 | 17.3 | 0.000119 (2^-13.04) | 13.04 |
| 1 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 964 | 987 | 264.5 | 17 | 18.3 | 0.000117 (2^-13.06) | 13.06 |
| 2 | `pipelined:data_width=18,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 969 | 1001 | 264.5 | 18 | 18.5 | 0.000108 (2^-13.18) | 13.18 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 973 | 967 | 264.5 | 17 | 18.2 | 0.000101 (2^-13.27) | 13.27 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 1008 | 1032 | 264.5 | 17 | 19.2 | 8.58e-05 (2^-13.51) | 13.51 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1017 | 1049 | 264.5 | 18 | 19.4 | 5.84e-05 (2^-14.06) | 14.06 |
| 6 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1033 | 1065 | 264.5 | 18 | 19.7 | 5.75e-05 (2^-14.09) | 14.09 |
| 7 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1086 | 1076 | 264.5 | 18 | 20.3 | 5.46e-05 (2^-14.16) | 14.16 |
| 8 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 1089 | 1080 | 264.5 | 18 | 20.4 | 5.25e-05 (2^-14.22) | 14.22 |
| 9 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=2,rounding=round` | 1120 | 1108 | 264.5 | 18 | 21 | 5.03e-05 (2^-14.28) | 14.28 |
| 10 | `pipelined:data_width=18,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 1156 | 1143 | 264.5 | 19 | 21.6 | 4.73e-05 (2^-14.37) | 14.37 |
| 11 | `pipelined:data_width=19,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 1158 | 1147 | 264.5 | 19 | 21.7 | 4.63e-05 (2^-14.40) | 14.40 |
| 12 | `pipelined:data_width=19,n_iter=18,angle_guard=2,frac_guard=0,rounding=round` | 1170 | 1199 | 264.5 | 20 | 22.3 | 3.86e-05 (2^-14.66) | 14.66 |
| 13 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 1183 | 1168 | 264.5 | 18 | 22.1 | 3.8e-05 (2^-14.68) | 14.68 |
| 14 | `pipelined:data_width=18,n_iter=17,angle_guard=3,frac_guard=3,rounding=round` | 1207 | 1191 | 264.5 | 19 | 22.5 | 3.11e-05 (2^-14.97) | 14.97 |
| 15 | `pipelined:data_width=19,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 1246 | 1233 | 264.5 | 20 | 23.3 | 3.09e-05 (2^-14.98) | 14.98 |
| 16 | `pipelined:data_width=19,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 1277 | 1295 | 264.5 | 20 | 24.2 | 2.51e-05 (2^-15.28) | 15.28 |
| 17 | `pipelined:data_width=18,n_iter=18,angle_guard=3,frac_guard=3,rounding=round` | 1279 | 1261 | 264.5 | 20 | 23.9 | 2.43e-05 (2^-15.33) | 15.33 |
| 18 | `pipelined:data_width=20,n_iter=20,angle_guard=2,frac_guard=1,rounding=round` | 1449 | 1431 | 264.5 | 22 | 27.1 | 1.37e-05 (2^-16.15) | 16.15 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec is throughput-bound: 250 MSPS with 1 result/cycle forces a fully pipelined architecture, so iterative and unrolled_k are excluded a priori (their cycles/result cannot be hidden at any realistic Artix-7 Fmax). I therefore split the first-round budget evenly between the two pipelined families, which are the only ones that can meet the constraint. The accuracy constraint (max_abs_err <= 2^-13) is met by data_width ~15-16 with n_iter ~14; I widen both ranges (W 12..20, N 10..20) so the search can discover whether a smaller/cheaper point still clears 2^-13, and include angle_guard/frac_guard/rounding as the fine-tuning knobs that buy error margin at low LUT cost. pipelined_m is included at equal share because its m parameter is the main lever on FF/LUT area for the min-LUTs objective, and it shares the exact same accuracy surface as pipelined, so the two families together map the feasible front efficiently. Round 1 is deliberately broad; later rounds should narrow around the feasible region and push m and W to their lower feasible limits.*)
- `pipelined` (50 evals): data_width=12..20, n_iter=10..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only the pipelined families can plausibly satisfy throughput_msps >= 250, since they emit 1 result/cycle and only need Fmax >= 250 MHz. The iterative and unrolled_k families emit 1 result every (ceil(N/k)+3) cycles, so even at k=8, N=30 they would need Fmax >= ~1.75 GHz, which is unreachable on Artix-7. Within pipelined, data_width 12..20 brackets the ~15-16 bits needed for 13 accuracy bits (output LSB = 2^-(W-2)), n_iter 10..20 brackets the ~14 micro-rotations needed for 2^-13 angle resolution, and the guard/rounding knobs let the search trade LUTs against the error margin.
- `pipelined_m` (50 evals): data_width=12..20, n_iter=10..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..6. *Why:* Same 1-result/cycle throughput as pipelined, but registering every m stages cuts FF count (and hence luts_plus_ffs) at the cost of a longer combinational path. m is capped at 6 so the critical path stays short enough to keep Fmax >= 250 MHz; m=2..6 lets the search find the register-density sweet spot for the min-LUTs objective while still meeting the throughput constraint. Accuracy is bit-identical to pipelined for the same (data_width, n_iter, angle_guard, frac_guard, rounding), so this family is a pure area/timing trade against the pipelined baseline.

**Result (code):** 100 evaluations this round, 100 total; 26 feasible; hypervolume 8605 (n/a).

**LLM decision:** `refine` — Round 1 shows pipelined is the only viable family: 26/50 feasible, throughput up to 282 MSPS, and the whole feasible Pareto front sits at data_width 17..20, n_iter 16..20, angle_guard 0..3, frac_guard 0..3. pipelined_m got 0/50 feasible (max 178 MSPS) because registering every m stages cannot reach 250 MSPS, so it is effectively dead. The spec selects min luts, and the front's cheapest point (1023 LUTs, 13.03 bits) is only just above the 2^-13 error bound, so the highest-value move is to densely refine the low-LUT corner of the pipelined box (small data_width, n_iter near 16-17, small guards) to find cheaper designs that still clear max_abs_err <= 1.22e-4, while keeping a little budget on the mid/high-accuracy region to preserve hypervolume. I will not spend budget on iterative/unrolled_k yet since they are multi-cycle and cannot meet 250 MSPS at 1 sample/clock.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8605 (gain this round: n/a (first round)).
Feasible designs: 26 of 100 evaluations (18 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 282
- max_abs_err <= 0.00012207: 47% violate; best seen 1.37e-05 (2^-16.15)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=round] luts=1023, accuracy_bits=13, ffs=1015, throughput_msps=264, max_abs_err=0.00012 (2^-13.03), power_index=19.2
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] luts=1067, accuracy_bits=13.1, ffs=1090, throughput_msps=264, max_abs_err=0.000113 (2^-13.11), power_index=20.3
- pipelined [data_width=18 n_iter=16 angle_guard=0 frac_guard=3 rounding=round] luts=1086, accuracy_bits=13.2, ffs=1071, throughput_msps=264, max_abs_err=0.000105 (2^-13.22), power_index=20.3
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] luts=1152, accuracy_bits=14.1, ffs=1171, throughput_msps=264, max_abs_err=5.51e-05 (2^-14.15), power_index=21.8
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5
- pipelined [data_width=20 n_iter=20 angle_guard=2 frac_guard=1 rounding=round] luts=1449, accuracy_bits=16.2, ffs=1431, throughput_msps=264, max_abs_err=1.37e-05 (2^-16.15), power_index=27.1

Per family:
- pipelined: 50 evals, 26 feasible; max throughput seen 282 MSPS; best accuracy 16.15 bits; best feasible luts=1023; feasible ranges: data_width 17..20, n_iter 16..20, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 15.42 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine the pipelined family only: it is the sole family with feasible designs and the only one whose throughput reaches the 250 MSPS floor. pipelined_m is dropped (0/50 feasible, max 178 MSPS). iterative and unrolled_k are not worth budget because they emit one result every several cycles and cannot hit 250 MSPS at 1 sample/clock. Focus 80% of the round on the low-LUT corner (data_width 16-19, n_iter 15-19, guards 0-3) to push LUTs below 1023 while satisfying max_abs_err <= 1.22e-4, and 20% on the high-accuracy tail to preserve front extent.*)
- `pipelined` (100 evals): data_width=16..19, n_iter=15..19, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* The feasible front lives entirely in this box; tightening around data_width 16-19 / n_iter 15-19 concentrates evals on the min-LUT corner where the 1023-LUT design barely clears the error bound, and on the 13-15 bit region that carries most of the hypervolume.
- clamped by code: dropped duplicate family pipelined

**Result (code):** 100 evaluations this round, 200 total; 92 feasible; hypervolume 8845 (+2.8%).

**LLM decision:** `refine` — The throughput constraint (>=250 MSPS) is only reachable by the pipelined family: it is the sole family seen at 1 result/cycle with Fmax ~264 MHz (best seen 282). pipelined_m is 1 result/cycle but its reduced register count caps Fmax at 178 MSPS (0/50 feasible). The two unexplored families are structurally unable to reach 250 MSPS: iterative needs N+3 cycles/result (>=7 even at N=4, i.e. ~40 MSPS at 282 MHz) and unrolled_k needs ceil(N/k)+3 (>=4 cycles/result even at N=4,k=8, ~70 MSPS). So adding them would burn budget on guaranteed-infeasible designs. The selection rule is min luts, and the current min-luts feasible point is 905 LUTs (data_width=18, n_iter=15, angle_guard=1, frac_guard=0, round) sitting right on the accuracy cliff (max_abs_err 2^-13.04 vs limit 2^-13). Feasible data_width spans 16..20, so the low-LUT corner (data_width 16..18) is where a smaller feasible design could still hide; the remaining 200 evals should be concentrated there rather than widening.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8845 (gain this round: +2.8%).
Feasible designs: 92 of 200 evaluations (69 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 282
- max_abs_err <= 0.00012207: 40% violate; best seen 1.37e-05 (2^-16.15)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=905, accuracy_bits=13, ffs=938, throughput_msps=264, max_abs_err=0.000119 (2^-13.04), power_index=17.3
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=969, accuracy_bits=13.2, ffs=1001, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.5
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] luts=1089, accuracy_bits=14.2, ffs=1080, throughput_msps=264, max_abs_err=5.25e-05 (2^-14.22), power_index=20.4
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts=1120, accuracy_bits=14.3, ffs=1108, throughput_msps=264, max_abs_err=5.03e-05 (2^-14.28), power_index=21
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1199, throughput_msps=264, max_abs_err=3.86e-05 (2^-14.66), power_index=22.3
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] luts=1277, accuracy_bits=15.3, ffs=1295, throughput_msps=264, max_abs_err=2.51e-05 (2^-15.28), power_index=24.2
- pipelined [data_width=20 n_iter=20 angle_guard=2 frac_guard=1 rounding=round] luts=1449, accuracy_bits=16.2, ffs=1431, throughput_msps=264, max_abs_err=1.37e-05 (2^-16.15), power_index=27.1

Per family:
- pipelined: 150 evals, 92 feasible; max throughput seen 282 MSPS; best accuracy 16.15 bits; best feasible luts=905; feasible ranges: data_width 16..20, n_iter 15..20, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 15.42 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine pipelined only, low-LUT corner; skip the three families that cannot meet the throughput constraint.*)
- `pipelined` (85 evals): data_width=16..18, n_iter=14..18, angle_guard=0..2, frac_guard=0..2, rounding=round|trunc. *Why:* Only pipelined can satisfy throughput>=250 MSPS; concentrate on the low-LUT corner (data_width 16..18, n_iter 14..18) to push min-luts below 905 while keeping max_abs_err <= 2^-13.
- `pipelined_m` (5 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* 0/50 feasible, max throughput 178 MSPS < 250; skip.
- `iterative` (5 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* N+3 cycles/result cannot reach 250 MSPS; skip.
- `unrolled_k` (5 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* ceil(N/k)+3 cycles/result cannot reach 250 MSPS; skip.

**Result (code):** 100 evaluations this round, 300 total; 142 feasible; hypervolume 8846 (+0.0%).

**LLM decision:** `refine` — Only `pipelined` is feasible: it alone reaches >=250 MSPS (best 282), while iterative/unrolled_k top out at ~13 MSPS and pipelined_m at 178 MSPS, so those families are structurally excluded by the throughput constraint. The feasible front is entirely pipelined with data_width 16..20, n_iter 15..20, angle_guard 0..3, frac_guard 0..3, and the selection rule is min LUTs, so the winning region is the low-LUT corner: data_width 18, n_iter 15-16, angle_guard 1, frac_guard 0, rounding=round (luts=905, accuracy_bits=13.0, err=2^-13.04, just inside the 2^-13 error bound). Hypervolume gain was +0.0% this round, so I will spend the last 100 evals densely around that corner to confirm the minimum-LUT feasible design and check whether a slightly cheaper point exists at data_width 17 or with trunc rounding.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 8846 (gain this round: +0.0%).
Feasible designs: 142 of 300 evaluations (84 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 22% violate; best seen 282
- max_abs_err <= 0.00012207: 43% violate; best seen 1.38e-06 (2^-19.47)

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=905, accuracy_bits=13, ffs=938, throughput_msps=264, max_abs_err=0.000119 (2^-13.04), power_index=17.3
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=969, accuracy_bits=13.2, ffs=1001, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=18.5
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] luts=1089, accuracy_bits=14.2, ffs=1080, throughput_msps=264, max_abs_err=5.25e-05 (2^-14.22), power_index=20.4
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1156, accuracy_bits=14.4, ffs=1143, throughput_msps=264, max_abs_err=4.73e-05 (2^-14.37), power_index=21.6
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1199, throughput_msps=264, max_abs_err=3.86e-05 (2^-14.66), power_index=22.3
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] luts=1277, accuracy_bits=15.3, ffs=1295, throughput_msps=264, max_abs_err=2.51e-05 (2^-15.28), power_index=24.2
- pipelined [data_width=20 n_iter=20 angle_guard=2 frac_guard=1 rounding=round] luts=1449, accuracy_bits=16.2, ffs=1431, throughput_msps=264, max_abs_err=1.37e-05 (2^-16.15), power_index=27.1

Per family:
- iterative: 5 evals, 0 feasible; max throughput seen 11.9 MSPS; best accuracy 19.47 bits
- unrolled_k: 5 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 17.35 bits
- pipelined: 235 evals, 142 feasible; max throughput seen 282 MSPS; best accuracy 16.15 bits; best feasible luts=905; feasible ranges: data_width 16..20, n_iter 15..20, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 55 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 15.42 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10353 in, 6014 out
- provider-reported cost: $0.0071
- full prompts and replies: `llm_trace.jsonl`

