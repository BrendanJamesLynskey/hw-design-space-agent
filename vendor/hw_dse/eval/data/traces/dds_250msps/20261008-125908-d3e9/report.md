# DSE run: dds_250msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined:data_width=18,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 954 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 985 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 273 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 273 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 18 | exact: schedule |
| latency_ns | 66 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000121 (2^-13.02) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.9 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.65e-05 (2^-15.20) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.74 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (11 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 954 | 985 | 272.9 | 18 | 18.2 | 0.000121 (2^-13.02) | 13.02 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` | 964 | 991 | 264.5 | 17 | 18.4 | 0.000102 (2^-13.26) | 13.26 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 979 | 1006 | 264.5 | 17 | 18.7 | 9.49e-05 (2^-13.36) | 13.36 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=trunc` | 994 | 1021 | 264.5 | 17 | 18.9 | 9.41e-05 (2^-13.38) | 13.38 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 1008 | 1032 | 264.5 | 17 | 19.2 | 8.58e-05 (2^-13.51) | 13.51 |
| 5 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 1017 | 1008 | 264.5 | 17 | 19 | 8.26e-05 (2^-13.56) | 13.56 |
| 6 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round` | 1032 | 1023 | 264.5 | 17 | 19.3 | 8.22e-05 (2^-13.57) | 13.57 |
| 7 | `pipelined:data_width=18,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 1033 | 1057 | 264.5 | 18 | 19.7 | 8.08e-05 (2^-13.60) | 13.60 |
| 8 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 1053 | 1043 | 264.5 | 18 | 19.7 | 6.9e-05 (2^-13.82) | 13.82 |
| 9 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=round` | 1071 | 1063 | 264.5 | 18 | 20.1 | 6.51e-05 (2^-13.91) | 13.91 |
| 10 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 1102 | 1092 | 264.5 | 18 | 20.6 | 5.17e-05 (2^-14.24) | 14.24 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec needs one sample per clock at >= 250 MSPS, so only the pipelined families can reach 250 MSPS. Iterative and unrolled_k deliver one result every several cycles, so they would need an implausible Fmax to reach 250 MSPS and are excluded. The accuracy limit of 2^-13 means roughly 14-16 bit data width and about 13-15 iterations, so I narrow the ranges to that region. Narrow ranges focus the 100-eval rounds on the trade-off between LUTs and accuracy_bits. Later rounds can tighten around the feasible minimum-LUT region once I see which candidates meet the error and throughput constraints.*)
- `pipelined` (50 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Pipelined gives 1 result/cycle, so it meets 250 MSPS only if Fmax is >= 250 MHz. It has a register on every stage, so Fmax is likely highest. Width and iteration ranges are centered on what a 2^-13 error needs, which is roughly 14-16 bit outputs and about 13-15 iterations.
- `pipelined_m` (50 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages cuts FFs and so LUTs+FFs, and may reduce LUT use if registers pack with logic. Small m keeps Fmax at or above 250 MHz. This is the most likely family to give the minimum-LUT feasible design.

**Result (code):** 100 evaluations this round, 100 total; 12 feasible; hypervolume 3663 (n/a).

**LLM decision:** `refine` — Throughput >= 250 MSPS at one sample per clock needs one result per cycle, so only pipelined and pipelined_m can qualify. iterative and unrolled_k deliver fewer than one result per cycle and cannot reach 250 MSPS, so I will not add them. pipelined produced all 12 feasible designs. Its best feasible point is 954 LUTs at 13.0 bits, and its feasible region is tight: data_width 17..18, n_iter 15..16, angle_guard 0..3, frac_guard 0..3. pipelined_m had 0 feasible designs in 50 evals, with throughput capped at 171 MSPS, so it is probably Fmax-limited. Only a small probe remains for its smallest m. The next round narrows pipelined around the feasible region and extends slightly below it, to data_width 15..18 and n_iter 12..16, to look for lower-LUT designs. Throughput dropped from 273 to 264 MSPS as guard bits grew, so I keep frac_guard and angle_guard low to hold Fmax and LUTs down. The 954-LUT design only just meets the error bound (2^-13.02), so little margin remains for shrinking width or iterations without losing feasibility.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3663 (gain this round: n/a (first round)).
Feasible designs: 12 of 100 evaluations (10 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 88% violate; best seen 5.17e-05 (2^-14.24)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=954, accuracy_bits=13, ffs=985, throughput_msps=273, max_abs_err=0.000121 (2^-13.02), power_index=18.2
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc] luts=994, accuracy_bits=13.3, ffs=1017, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.9
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=1017, accuracy_bits=13.6, ffs=1008, throughput_msps=264, max_abs_err=8.26e-05 (2^-13.56), power_index=19
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1053, accuracy_bits=13.8, ffs=1043, throughput_msps=264, max_abs_err=6.9e-05 (2^-13.82), power_index=19.7
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=round] luts=1071, accuracy_bits=13.9, ffs=1063, throughput_msps=264, max_abs_err=6.51e-05 (2^-13.91), power_index=20.1
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1102, accuracy_bits=14.2, ffs=1092, throughput_msps=264, max_abs_err=5.17e-05 (2^-14.24), power_index=20.6

Per family:
- pipelined: 50 evals, 12 feasible; max throughput seen 273 MSPS; best accuracy 14.24 bits; best feasible luts=954; feasible ranges: data_width 17..18, n_iter 15..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 12.91 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the only family that has met throughput and accuracy together, and push toward lower LUT counts near the accuracy boundary.*)
- `pipelined` (90 evals): data_width=15..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* All feasible designs so far came from this family. This range explores slightly narrower widths and fewer iterations to cut LUTs while staying under 2^-13 error and above 250 MSPS.
- `pipelined_m` (10 evals): data_width=15..18, n_iter=13..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..2. *Why:* Small probe at m=2 only. Larger m lowers Fmax, and no pipelined_m design has exceeded 171 MSPS yet.

**Result (code):** 100 evaluations this round, 200 total; 28 feasible; hypervolume 3676 (+0.4%).

**LLM decision:** `refine` — Hypervolume gain is only +0.4% and the pipelined front is stable at data_width 17..18, n_iter 15..16. Only pipelined meets throughput >= 250 MSPS (best 273). pipelined_m reached at most 171 MSPS with 0 feasible designs in 60 evals. Iterative and unrolled_k deliver one result every several cycles, so their throughput is Fmax/(N+3) or lower, far below 250 MSPS; they are structurally infeasible for this spec. The remaining gain is in the low-LUT corner: the cheapest feasible design is 954 LUTs at exactly 13.0 bits, with data_width 16 not yet seen feasible. I will refine around data_width 15..18, n_iter 13..16 with small guard values. I'll drop pipelined_m to a small probe, since pipelined_m with m=2 might offer fewer LUTs at some Fmax, but its observed Fmax is too low.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.36% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3676 (gain this round: +0.4%).
Feasible designs: 28 of 200 evaluations (20 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 30% violate; best seen 273
- max_abs_err <= 0.00012207: 86% violate; best seen 5.17e-05 (2^-14.24)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=954, accuracy_bits=13, ffs=985, throughput_msps=273, max_abs_err=0.000121 (2^-13.02), power_index=18.2
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=991, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=18.4
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts=979, accuracy_bits=13.4, ffs=1006, throughput_msps=264, max_abs_err=9.49e-05 (2^-13.36), power_index=18.7
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=trunc] luts=994, accuracy_bits=13.4, ffs=1021, throughput_msps=264, max_abs_err=9.41e-05 (2^-13.38), power_index=18.9
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] luts=1032, accuracy_bits=13.6, ffs=1023, throughput_msps=264, max_abs_err=8.22e-05 (2^-13.57), power_index=19.3
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] luts=1033, accuracy_bits=13.6, ffs=1057, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=19.7
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1053, accuracy_bits=13.8, ffs=1043, throughput_msps=264, max_abs_err=6.9e-05 (2^-13.82), power_index=19.7
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=round] luts=1071, accuracy_bits=13.9, ffs=1063, throughput_msps=264, max_abs_err=6.51e-05 (2^-13.91), power_index=20.1
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] luts=1102, accuracy_bits=14.2, ffs=1092, throughput_msps=264, max_abs_err=5.17e-05 (2^-14.24), power_index=20.6

Per family:
- pipelined: 140 evals, 28 feasible; max throughput seen 273 MSPS; best accuracy 14.24 bits; best feasible luts=954; feasible ranges: data_width 17..18, n_iter 15..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 60 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 12.91 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 12804 in, 3040 out
- provider-reported cost: $0.0560
- full prompts and replies: `llm_trace.jsonl`

