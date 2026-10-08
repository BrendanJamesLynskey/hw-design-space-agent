# DSE run: dds_250msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
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
`pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 920 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 953 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 17.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000109 (2^-13.17) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.12 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 3e-05 (2^-15.02) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.97 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.2 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 920 | 953 | 264.5 | 17 | 17.6 | 0.000109 (2^-13.17) | 13.17 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 949 | 984 | 264.5 | 17 | 18.2 | 8.66e-05 (2^-13.50) | 13.50 |
| 2 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 964 | 999 | 264.5 | 17 | 18.5 | 8.33e-05 (2^-13.55) | 13.55 |
| 3 | `pipelined:data_width=20,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 979 | 1014 | 264.5 | 17 | 18.7 | 8.24e-05 (2^-13.57) | 13.57 |
| 4 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 994 | 1029 | 264.5 | 17 | 19 | 7.63e-05 (2^-13.68) | 13.68 |
| 5 | `pipelined:data_width=20,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 1008 | 1044 | 264.5 | 17 | 19.3 | 7.03e-05 (2^-13.80) | 13.80 |
| 6 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1017 | 1049 | 264.5 | 18 | 19.4 | 5.84e-05 (2^-14.06) | 14.06 |
| 7 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1033 | 1065 | 264.5 | 18 | 19.7 | 5.75e-05 (2^-14.09) | 14.09 |
| 8 | `pipelined:data_width=20,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1048 | 1082 | 264.5 | 18 | 20 | 5.27e-05 (2^-14.21) | 14.21 |
| 9 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1064 | 1098 | 264.5 | 18 | 20.3 | 4.64e-05 (2^-14.39) | 14.39 |
| 10 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1080 | 1114 | 264.5 | 18 | 20.6 | 4.12e-05 (2^-14.57) | 14.57 |
| 11 | `pipelined:data_width=21,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1112 | 1146 | 264.5 | 18 | 21.2 | 3.91e-05 (2^-14.64) | 14.64 |
| 12 | `pipelined:data_width=21,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1128 | 1162 | 256.5 | 18 | 21.5 | 3.65e-05 (2^-14.74) | 14.74 |
| 13 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1135 | 1166 | 264.5 | 19 | 21.6 | 3.32e-05 (2^-14.88) | 14.88 |
| 14 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1152 | 1183 | 264.5 | 19 | 22 | 2.85e-05 (2^-15.10) | 15.10 |
| 15 | `pipelined:data_width=21,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 1169 | 1201 | 264.5 | 19 | 22.3 | 2.7e-05 (2^-15.18) | 15.18 |
| 16 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1185 | 1218 | 264.5 | 19 | 22.6 | 2.44e-05 (2^-15.32) | 15.32 |
| 17 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1202 | 1235 | 256.5 | 19 | 22.9 | 2.18e-05 (2^-15.48) | 15.48 |
| 18 | `pipelined:data_width=22,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1236 | 1269 | 256.5 | 19 | 23.6 | 1.95e-05 (2^-15.64) | 15.64 |
| 19 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=0,rounding=round` | 1277 | 1308 | 256.5 | 20 | 24.3 | 1.59e-05 (2^-15.94) | 15.94 |
| 20 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=1,rounding=round` | 1339 | 1324 | 264.5 | 20 | 25 | 1.44e-05 (2^-16.08) | 16.08 |
| 21 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 1357 | 1342 | 256.5 | 20 | 25.4 | 1.24e-05 (2^-16.30) | 16.30 |
| 22 | `pipelined:data_width=22,n_iter=20,angle_guard=1,frac_guard=0,rounding=round` | 1467 | 1493 | 256.5 | 22 | 27.8 | 6.49e-06 (2^-17.23) | 17.23 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires 1 sample/cycle at >= 250 MSPS, which immediately eliminates 'iterative' and 'unrolled_k' families as they cannot meet the throughput constraint. We focus exclusively on 'pipelined' and 'pipelined_m'. The accuracy constraint (<= 2^-13) and the objective (min LUTs) suggest we need to find the sweet spot where data_width and n_iter are just sufficient to meet accuracy without excessive area. We use 'round' rounding to maximize accuracy per bit, allowing potentially smaller widths. We split the budget evenly between the two viable families to map the Pareto front of area vs accuracy.*)
- `pipelined` (50 evals): data_width=16..24, n_iter=14..20, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Only pipelined and pipelined_m can meet the 250 MSPS throughput constraint. Pipelined is the baseline for area; we search for the minimum LUTs that satisfy the 13-bit accuracy constraint.
- `pipelined_m` (50 evals): data_width=16..24, n_iter=14..20, angle_guard=0..2, frac_guard=0..2, rounding=round, m=2..8. *Why:* Pipelined_m can trade latency for area by reducing register count. Since the spec only constrains throughput and accuracy, a higher m might yield fewer LUTs/FFs if the critical path allows, potentially beating the fully pipelined version on the LUT objective.

**Result (code):** 100 evaluations this round, 100 total; 41 feasible; hypervolume 1.176e+04 (n/a).

**LLM decision:** `refine` — The `pipelined` family is the only one currently meeting the throughput constraint (>= 250 MSPS), achieving up to 273 MSPS. The `pipelined_m` family failed completely on throughput (max 171 MSPS), likely due to the reduced clock frequency from fewer pipeline registers or the specific parameter ranges explored. The current Pareto front shows a clear trade-off: the minimum LUT design (949 LUTs) provides 13.5 bits of accuracy, which satisfies the constraint (<= 2^-13) but leaves little margin. To maximize hypervolume, we need to explore the region just above the accuracy constraint to see if we can gain accuracy bits without a significant LUT penalty, or if we can reduce LUTs further by lowering `data_width` or `n_iter` slightly while maintaining feasibility. The current best feasible design is at `data_width=19, n_iter=15`. We should narrow the search around this sweet spot to refine the front, specifically testing if `data_width=18` or `n_iter=14` can yield lower LUTs while staying feasible, and if `n_iter=16` or `angle_guard=2` can push accuracy higher for the same LUT count. We will not add `iterative` or `unrolled_k` yet because they produce one result every several cycles, making it difficult to hit 250 MSPS unless Fmax is very high, which is less likely than the pipelined approach given the current evidence.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.176e+04 (gain this round: n/a (first round)).
Feasible designs: 41 of 100 evaluations (26 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 24% violate; best seen 3.1e-06 (2^-18.30)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=949, accuracy_bits=13.5, ffs=984, throughput_msps=264, max_abs_err=8.66e-05 (2^-13.50), power_index=18.2
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=20 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=1008, accuracy_bits=13.8, ffs=1044, throughput_msps=264, max_abs_err=7.03e-05 (2^-13.80), power_index=19.3
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] luts=1084, accuracy_bits=14.3, ffs=1115, throughput_msps=264, max_abs_err=5.02e-05 (2^-14.28), power_index=20.7
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] luts=1135, accuracy_bits=14.9, ffs=1166, throughput_msps=264, max_abs_err=3.32e-05 (2^-14.88), power_index=21.6
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] luts=1185, accuracy_bits=15.3, ffs=1218, throughput_msps=264, max_abs_err=2.44e-05 (2^-15.32), power_index=22.6
- pipelined [data_width=22 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] luts=1236, accuracy_bits=15.6, ffs=1269, throughput_msps=257, max_abs_err=1.95e-05 (2^-15.64), power_index=23.6
- pipelined [data_width=22 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] luts=1350, accuracy_bits=15.8, ffs=1332, throughput_msps=257, max_abs_err=1.73e-05 (2^-15.82), power_index=25.2
- pipelined [data_width=22 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] luts=1467, accuracy_bits=17.2, ffs=1493, throughput_msps=257, max_abs_err=6.49e-06 (2^-17.23), power_index=27.8

Per family:
- pipelined: 50 evals, 41 feasible; max throughput seen 273 MSPS; best accuracy 17.23 bits; best feasible luts=949; feasible ranges: data_width 17..24, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 18.30 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine the pipelined family around the current best feasible designs to tighten the Pareto front and maximize hypervolume within the remaining budget.*)
- `pipelined` (100 evals): data_width=18..21, n_iter=14..18, angle_guard=0..2, frac_guard=0..1, rounding=round. *Why:* Focus on the proven feasible region of the pipelined family. Narrow data_width to 18-21 to find the absolute minimum LUTs that still meet accuracy and throughput. Narrow n_iter to 14-18 to balance accuracy and area. Restrict rounding to 'round' as it generally provides better accuracy for the same bit width, allowing potentially lower data_width. Exclude pipelined_m as it failed throughput constraints in Round 1.

**Result (code):** 100 evaluations this round, 200 total; 128 feasible; hypervolume 1.187e+04 (+1.0%).

**LLM decision:** `refine` — The `pipelined` family is the only one meeting the throughput constraint (>=250 MSPS), with a best feasible LUT count of 920. The `pipelined_m` family failed to meet throughput (max 171 MSPS), and `iterative`/`unrolled_k` are structurally incapable of meeting the 250 MSPS throughput requirement as they produce one result every several cycles (latency > 1 cycle), resulting in throughput < Fmax. Since Fmax is typically < 250 MHz for these widths on Artix-7, non-pipelined families are infeasible for this spec. The current Pareto front shows a clear trade-off between LUTs and accuracy. The minimum LUT design (920 LUTs) has 13.2 bits of accuracy, which barely meets the 13-bit constraint. To improve the hypervolume and potentially find a design with lower LUTs or better accuracy, we should refine the search around the current best region. Specifically, we should focus on `pipelined` with `data_width` 17-20, `n_iter` 14-16, and `angle_guard` 0-2. We can also try `rounding=trunc` to see if it reduces LUTs slightly, though it may hurt accuracy. We will narrow the ranges to focus the remaining 200 evaluations on the promising region.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.96% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.187e+04 (gain this round: +1.0%).
Feasible designs: 128 of 200 evaluations (64 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 273
- max_abs_err <= 0.00012207: 18% violate; best seen 3.1e-06 (2^-18.30)

Pareto front (feasible, 23 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=920, accuracy_bits=13.2, ffs=953, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=17.6
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=964, accuracy_bits=13.6, ffs=999, throughput_msps=264, max_abs_err=8.33e-05 (2^-13.55), power_index=18.5
- pipelined [data_width=20 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=1008, accuracy_bits=13.8, ffs=1044, throughput_msps=264, max_abs_err=7.03e-05 (2^-13.80), power_index=19.3
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1080, accuracy_bits=14.6, ffs=1114, throughput_msps=264, max_abs_err=4.12e-05 (2^-14.57), power_index=20.6
- pipelined [data_width=21 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1128, accuracy_bits=14.7, ffs=1162, throughput_msps=257, max_abs_err=3.65e-05 (2^-14.74), power_index=21.5
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] luts=1169, accuracy_bits=15.2, ffs=1201, throughput_msps=264, max_abs_err=2.7e-05 (2^-15.18), power_index=22.3
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1202, accuracy_bits=15.5, ffs=1235, throughput_msps=257, max_abs_err=2.18e-05 (2^-15.48), power_index=22.9
- pipelined [data_width=21 n_iter=18 angle_guard=1 frac_guard=1 rounding=round] luts=1339, accuracy_bits=16.1, ffs=1324, throughput_msps=264, max_abs_err=1.44e-05 (2^-16.08), power_index=25
- pipelined [data_width=22 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] luts=1467, accuracy_bits=17.2, ffs=1493, throughput_msps=257, max_abs_err=6.49e-06 (2^-17.23), power_index=27.8

Per family:
- pipelined: 150 evals, 128 feasible; max throughput seen 273 MSPS; best accuracy 17.23 bits; best feasible luts=920; feasible ranges: data_width 17..24, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 18.30 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7248 in, 2231 out
- provider-reported cost: $0.0058
- full prompts and replies: `llm_trace.jsonl`

