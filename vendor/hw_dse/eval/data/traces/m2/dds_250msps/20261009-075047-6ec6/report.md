# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
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

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (18 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 920 | 953 | 264.5 | 17 | 17.6 | 0.000109 (2^-13.17) | 13.17 |
| 1 | `pipelined:data_width=20,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc` | 964 | 999 | 264.5 | 17 | 18.5 | 9.65e-05 (2^-13.34) | 13.34 |
| 2 | `pipelined:data_width=20,n_iter=15,angle_guard=0,frac_guard=0,rounding=trunc` | 979 | 1014 | 264.5 | 17 | 18.7 | 8.73e-05 (2^-13.48) | 13.48 |
| 3 | `pipelined:data_width=19,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1001 | 1033 | 264.5 | 18 | 19.1 | 7.72e-05 (2^-13.66) | 13.66 |
| 4 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1017 | 1049 | 264.5 | 18 | 19.4 | 5.84e-05 (2^-14.06) | 14.06 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1033 | 1065 | 264.5 | 18 | 19.7 | 5.75e-05 (2^-14.09) | 14.09 |
| 6 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1064 | 1098 | 264.5 | 18 | 20.3 | 4.64e-05 (2^-14.39) | 14.39 |
| 7 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1136 | 1124 | 264.5 | 18 | 21.3 | 4.29e-05 (2^-14.51) | 14.51 |
| 8 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 1143 | 1170 | 264.5 | 18 | 21.8 | 3.93e-05 (2^-14.63) | 14.63 |
| 9 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1152 | 1183 | 264.5 | 19 | 22 | 2.85e-05 (2^-15.10) | 15.10 |
| 10 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 1211 | 1199 | 264.5 | 19 | 22.7 | 2.58e-05 (2^-15.24) | 15.24 |
| 11 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc` | 1219 | 1244 | 264.5 | 19 | 23.2 | 2.57e-05 (2^-15.25) | 15.25 |
| 12 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=round` | 1244 | 1229 | 264.5 | 19 | 23.3 | 2.32e-05 (2^-15.40) | 15.40 |
| 13 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 1261 | 1246 | 264.5 | 19 | 23.6 | 2.23e-05 (2^-15.45) | 15.45 |
| 14 | `pipelined:data_width=22,n_iter=20,angle_guard=-1,frac_guard=0,rounding=round` | 1427 | 1453 | 264.5 | 22 | 27.1 | 1.61e-05 (2^-15.92) | 15.92 |
| 15 | `pipelined:data_width=21,n_iter=20,angle_guard=4,frac_guard=4,rounding=trunc` | 1627 | 1638 | 256.5 | 22 | 30.7 | 4.41e-06 (2^-17.79) | 17.79 |
| 16 | `pipelined:data_width=26,n_iter=20,angle_guard=-1,frac_guard=0,rounding=round` | 1667 | 1695 | 256.5 | 22 | 31.6 | 2.55e-06 (2^-18.58) | 18.58 |
| 17 | `pipelined:data_width=22,n_iter=23,angle_guard=2,frac_guard=2,rounding=round` | 1860 | 1827 | 256.5 | 25 | 34.7 | 2.55e-06 (2^-18.58) | 18.58 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec needs one sample per clock at 250 MSPS or more. Iterative and unrolled_k deliver one result every several cycles, so reaching 250 MSPS would need an Fmax well above anything plausible for them. I exclude them and search only pipelined and pipelined_m. The error bound of 2^-13 means the output LSB must be fine enough, so data_width starts at 14. Fewer iterations and narrower guard bits reduce LUTs, so the ranges are centred on the minimum that meets accuracy. They extend upward so the front also covers the accuracy_bits objective. Pipelined_m gets a slightly larger share because it is the more likely LUT-minimal option. Later rounds will narrow the ranges around whichever family survives on the front.*)
- `pipelined` (46 evals): data_width=14..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per clock is guaranteed, so the throughput constraint depends only on Fmax. The width and iteration ranges bracket the 2^-13 error target, with room above it for the accuracy_bits objective.
- `pipelined_m` (54 evals): data_width=14..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages should reduce flip-flops and possibly LUTs while still giving one result per cycle. I limit m to 2..4 because longer combinational chains risk dropping Fmax below the 250 MHz requirement.

**Result (code):** 100 evaluations this round, 100 total; 23 feasible; hypervolume 5189 (n/a).

**LLM decision:** `refine` — Throughput >= 250 MSPS needs one result per cycle, so iterative and unrolled_k are ruled out and only pipelined and pipelined_m can qualify. Pipelined has 23 feasible designs; its front sits at data_width 20 with 964..1188 LUTs and 13.3..14.8 accuracy bits. Feasible designs only appear at data_width 18..20 and n_iter 15..18. Smaller widths and iteration counts should cut LUTs, but this round never reached the 2^-13 accuracy floor at those sizes, so rounding='round' and small guard bits are worth trying there. Pipelined_m has 0 feasible designs in 54 evals (max 178 MSPS), so it only gets a small probe at m=2, the setting most likely to approach 250 MSPS. Mapping the full front is premature while the lowest-LUT corner is still unexplored.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5189 (gain this round: n/a (first round)).
Feasible designs: 23 of 100 evaluations (20 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 54% violate; best seen 273
- max_abs_err <= 0.00012207: 51% violate; best seen 1.32e-05 (2^-16.21)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=999, throughput_msps=264, max_abs_err=9.65e-05 (2^-13.34), power_index=18.5
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] luts=979, accuracy_bits=13.5, ffs=1014, throughput_msps=264, max_abs_err=8.73e-05 (2^-13.48), power_index=18.7
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] luts=1008, accuracy_bits=13.6, ffs=1040, throughput_msps=264, max_abs_err=7.97e-05 (2^-13.61), power_index=19.3
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts=1023, accuracy_bits=13.7, ffs=1055, throughput_msps=264, max_abs_err=7.76e-05 (2^-13.65), power_index=19.5
- pipelined [data_width=20 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts=1067, accuracy_bits=13.8, ffs=1097, throughput_msps=264, max_abs_err=6.78e-05 (2^-13.85), power_index=20.4
- pipelined [data_width=20 n_iter=18 angle_guard=-1 frac_guard=0 rounding=trunc] luts=1170, accuracy_bits=14.1, ffs=1199, throughput_msps=264, max_abs_err=5.72e-05 (2^-14.09), power_index=22.3
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] luts=1188, accuracy_bits=14.8, ffs=1217, throughput_msps=264, max_abs_err=3.54e-05 (2^-14.79), power_index=22.6
Front coverage: luts 964..1188 (HV reference 4000); accuracy_bits 13.3..14.8 (HV reference 13); data_width on the front 20..20 (registry 8..28).

Per family:
- pipelined: 46 evals, 23 feasible; max throughput seen 273 MSPS; best accuracy 14.79 bits; best feasible luts=964; feasible ranges: data_width 18..20, n_iter 15..18, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 54 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 16.21 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Shift the search toward smaller data_width and n_iter, where fewer LUTs should be possible, while the 2^-13 error and 250 MSPS constraints are still met.*)
- `pipelined` (80 evals): data_width=15..20, n_iter=12..17, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* This is the only family with feasible points. Lower width and iteration count with round and small guards should lower LUTs while staying under 2^-13 error.
- `pipelined_m` (20 evals): data_width=15..20, n_iter=12..17, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..2. *Why:* Probe m=2 only, to check whether this family can reach 250 MSPS, since all 54 earlier evals fell short at 178 MSPS or below.

**Result (code):** 100 evaluations this round, 200 total; 67 feasible; hypervolume 7136 (+37.5%).

**LLM decision:** `map_front` — Only pipelined has feasible designs (67/200 feasible, 13 on the front). pipelined_m has 0 feasible: its best throughput is 178 MSPS, below the 250 floor, so it can be dropped. iterative and unrolled_k produce one result every several cycles (N+3 for iterative, ceil(N/k)+3 for unrolled_k), so they cannot reach 250 MSPS at one sample per clock and are not worth exploring. The front covers luts 949..1261 and accuracy_bits 13.1..15.5, with data_width only 18..20 out of 8..28. Throughput is 264 MSPS, so the margin over 250 is thin. A coverage search with NSGA-II over the full pipelined ranges, seeded with the front, should fill out the trade-off curve better than hand-narrowed ranges. The hypervolume gain was +37.5% last round and the front is still growing.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7136 (gain this round: +37.5%).
Feasible designs: 67 of 200 evaluations (50 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 37% violate; best seen 273
- max_abs_err <= 0.00012207: 49% violate; best seen 1.32e-05 (2^-16.21)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts=949, accuracy_bits=13.1, ffs=980, throughput_msps=264, max_abs_err=0.000118 (2^-13.05), power_index=18.1
- pipelined [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc] luts=964, accuracy_bits=13.3, ffs=999, throughput_msps=264, max_abs_err=9.65e-05 (2^-13.34), power_index=18.5
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=1001, accuracy_bits=13.7, ffs=1033, throughput_msps=264, max_abs_err=7.72e-05 (2^-13.66), power_index=19.1
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts=1063, accuracy_bits=13.8, ffs=1053, throughput_msps=264, max_abs_err=7.18e-05 (2^-13.77), power_index=19.9
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1064, accuracy_bits=14.4, ffs=1098, throughput_msps=264, max_abs_err=4.64e-05 (2^-14.39), power_index=20.3
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts=1143, accuracy_bits=14.6, ffs=1170, throughput_msps=264, max_abs_err=3.93e-05 (2^-14.63), power_index=21.8
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] luts=1211, accuracy_bits=15.2, ffs=1199, throughput_msps=264, max_abs_err=2.58e-05 (2^-15.24), power_index=22.7
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] luts=1244, accuracy_bits=15.4, ffs=1229, throughput_msps=264, max_abs_err=2.32e-05 (2^-15.40), power_index=23.3
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1261, accuracy_bits=15.5, ffs=1246, throughput_msps=264, max_abs_err=2.23e-05 (2^-15.45), power_index=23.6
Front coverage: luts 949..1261 (HV reference 4000); accuracy_bits 13.1..15.5 (HV reference 13); data_width on the front 18..20 (registry 8..28).

Per family:
- pipelined: 126 evals, 67 feasible; max throughput seen 273 MSPS; best accuracy 15.45 bits; best feasible luts=949; feasible ranges: data_width 17..20, n_iter 15..18, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 74 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 16.21 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined` (40 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (13 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 96 feasible; hypervolume 1.289e+04 (+80.6%).

**LLM decision:** `refine` — Only pipelined is feasible: 96 feasible designs, front luts 949..2113, best accuracy 17.9 bits. pipelined_m has 0 feasible out of 74 evals (max 178 MSPS), so it is dropped. Iterative and unrolled_k produce one result every several cycles, so they cannot reach 250 MSPS at one sample per clock. The selection rule picks min luts, and the cheapest point (949 LUTs, 13.1 bits) sits near the 13-bit accuracy floor. The remaining gain is at the low-LUT corner: data_width 16..20, n_iter 13..17, small guards, both rounding modes. A smaller share goes to higher-accuracy points to keep covering the front. Final-round code mapping will cover the full range.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.289e+04 (gain this round: +80.6%).
Feasible designs: 96 of 240 evaluations (74 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 34% violate; best seen 273
- max_abs_err <= 0.00012207: 42% violate; best seen 1.7e-07 (2^-22.49)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts=949, accuracy_bits=13.1, ffs=980, throughput_msps=264, max_abs_err=0.000118 (2^-13.05), power_index=18.1
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] luts=979, accuracy_bits=13.5, ffs=1014, throughput_msps=264, max_abs_err=8.73e-05 (2^-13.48), power_index=18.7
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=1001, accuracy_bits=13.7, ffs=1033, throughput_msps=264, max_abs_err=7.72e-05 (2^-13.66), power_index=19.1
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1064, accuracy_bits=14.4, ffs=1098, throughput_msps=264, max_abs_err=4.64e-05 (2^-14.39), power_index=20.3
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts=1143, accuracy_bits=14.6, ffs=1170, throughput_msps=264, max_abs_err=3.93e-05 (2^-14.63), power_index=21.8
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] luts=1219, accuracy_bits=15.2, ffs=1244, throughput_msps=264, max_abs_err=2.57e-05 (2^-15.25), power_index=23.2
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1261, accuracy_bits=15.5, ffs=1246, throughput_msps=264, max_abs_err=2.23e-05 (2^-15.45), power_index=23.6
- pipelined [data_width=19 n_iter=20 angle_guard=4 frac_guard=3 rounding=trunc] luts=1467, accuracy_bits=15.8, ffs=1481, throughput_msps=257, max_abs_err=1.76e-05 (2^-15.79), power_index=27.7
- pipelined [data_width=21 n_iter=26 angle_guard=3 frac_guard=4 rounding=trunc] luts=2113, accuracy_bits=17.9, ffs=2109, throughput_msps=257, max_abs_err=4.18e-06 (2^-17.87), power_index=39.7
Front coverage: luts 949..2113 (HV reference 4000); accuracy_bits 13.1..17.9 (HV reference 13); data_width on the front 18..21 (registry 8..28).

Per family:
- pipelined: 166 evals, 96 feasible; max throughput seen 273 MSPS; best accuracy 22.49 bits; best feasible luts=949; feasible ranges: data_width 17..21, n_iter 15..29, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 74 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 16.21 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *Concentrate on cheap pipelined designs that just meet the error bound, with a minor share for high-accuracy coverage.*)
- `pipelined` (100 evals): data_width=15..20, n_iter=13..18, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* Focus on the low-LUT corner near the accuracy limit of 13 bits. The front starts at 949 LUTs with data_width 18..20 and n_iter 15..16. Smaller widths, fewer iterations and fewer guard bits may cut LUTs further while keeping error <= 2^-13.
- clamped by code: dropped duplicate family pipelined

**Result (code):** 100 evaluations this round, 340 total; 161 feasible; hypervolume 1.291e+04 (+0.2%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible are valid. The spec is feasible: 161 of 340 evaluations meet both constraints. The front has 17 designs, all pipelined. The selection rule (min luts) picks pipelined W=18, N=15, angle_guard=2, frac_guard=0, round, which gives 920 LUTs, 13.2 accuracy bits (max error 1.09e-4, within the 1.22e-4 limit) and 264 MSPS. The last round added only +0.2% hypervolume, so the front has stopped improving. The front spans 920..2113 LUTs and 13.2..17.9 bits. iterative and unrolled_k produce one result every several cycles, so they cannot reach 250 MSPS at one sample per clock. pipelined_m reached only 178 MSPS in 74 evaluations, with no feasible design.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.291e+04 (gain this round: +0.2%).
Feasible designs: 161 of 340 evaluations (112 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 24% violate; best seen 273
- max_abs_err <= 0.00012207: 40% violate; best seen 1.7e-07 (2^-22.49)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=920, accuracy_bits=13.2, ffs=953, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=17.6
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] luts=979, accuracy_bits=13.5, ffs=1014, throughput_msps=264, max_abs_err=8.73e-05 (2^-13.48), power_index=18.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1017, accuracy_bits=14.1, ffs=1049, throughput_msps=264, max_abs_err=5.84e-05 (2^-14.06), power_index=19.4
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts=1136, accuracy_bits=14.5, ffs=1124, throughput_msps=264, max_abs_err=4.29e-05 (2^-14.51), power_index=21.3
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] luts=1219, accuracy_bits=15.2, ffs=1244, throughput_msps=264, max_abs_err=2.57e-05 (2^-15.25), power_index=23.2
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] luts=1244, accuracy_bits=15.4, ffs=1229, throughput_msps=264, max_abs_err=2.32e-05 (2^-15.40), power_index=23.3
- pipelined [data_width=19 n_iter=20 angle_guard=4 frac_guard=3 rounding=trunc] luts=1467, accuracy_bits=15.8, ffs=1481, throughput_msps=257, max_abs_err=1.76e-05 (2^-15.79), power_index=27.7
- pipelined [data_width=21 n_iter=26 angle_guard=3 frac_guard=4 rounding=trunc] luts=2113, accuracy_bits=17.9, ffs=2109, throughput_msps=257, max_abs_err=4.18e-06 (2^-17.87), power_index=39.7
Front coverage: luts 920..2113 (HV reference 4000); accuracy_bits 13.2..17.9 (HV reference 13); data_width on the front 18..21 (registry 8..28).

Per family:
- pipelined: 266 evals, 161 feasible; max throughput seen 273 MSPS; best accuracy 22.49 bits; best feasible luts=920; feasible ranges: data_width 17..21, n_iter 15..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 74 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 16.21 bits
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined` (60 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (17 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 194 feasible; hypervolume 1.465e+04 (+13.5%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible are valid. The spec is feasible: 161 of 340 evaluations meet both constraints. The front has 17 designs, all pipelined. The selection rule (min luts) picks pipelined W=18, N=15, angle_guard=2, frac_guard=0, round, which gives 920 LUTs, 13.2 accuracy bits (max error 1.09e-4, within the 1.22e-4 limit) and 264 MSPS. The last round added only +0.2% hypervolume, so the front has stopped improving. The front spans 920..2113 LUTs and 13.2..17.9 bits. iterative and unrolled_k produce one result every several cycles, so they cannot reach 250 MSPS at one sample per clock. pipelined_m reached only 178 MSPS in 74 evaluations, with no feasible design.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.465e+04 (gain this round: +13.5%).
Feasible designs: 194 of 400 evaluations (137 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 273
- max_abs_err <= 0.00012207: 36% violate; best seen 1.7e-07 (2^-22.49)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=920, accuracy_bits=13.2, ffs=953, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=17.6
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] luts=979, accuracy_bits=13.5, ffs=1014, throughput_msps=264, max_abs_err=8.73e-05 (2^-13.48), power_index=18.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1017, accuracy_bits=14.1, ffs=1049, throughput_msps=264, max_abs_err=5.84e-05 (2^-14.06), power_index=19.4
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1064, accuracy_bits=14.4, ffs=1098, throughput_msps=264, max_abs_err=4.64e-05 (2^-14.39), power_index=20.3
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts=1143, accuracy_bits=14.6, ffs=1170, throughput_msps=264, max_abs_err=3.93e-05 (2^-14.63), power_index=21.8
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] luts=1219, accuracy_bits=15.2, ffs=1244, throughput_msps=264, max_abs_err=2.57e-05 (2^-15.25), power_index=23.2
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1261, accuracy_bits=15.5, ffs=1246, throughput_msps=264, max_abs_err=2.23e-05 (2^-15.45), power_index=23.6
- pipelined [data_width=21 n_iter=20 angle_guard=4 frac_guard=4 rounding=trunc] luts=1627, accuracy_bits=17.8, ffs=1638, throughput_msps=257, max_abs_err=4.41e-06 (2^-17.79), power_index=30.7
- pipelined [data_width=22 n_iter=23 angle_guard=2 frac_guard=2 rounding=round] luts=1860, accuracy_bits=18.6, ffs=1827, throughput_msps=257, max_abs_err=2.55e-06 (2^-18.58), power_index=34.7
Front coverage: luts 920..1860 (HV reference 4000); accuracy_bits 13.2..18.6 (HV reference 13); data_width on the front 18..26 (registry 8..28).

Per family:
- pipelined: 326 evals, 194 feasible; max throughput seen 273 MSPS; best accuracy 22.49 bits; best feasible luts=920; feasible ranges: data_width 17..26, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 74 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 16.21 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 24450 in, 3853 out
- provider-reported cost: $0.0874
- full prompts and replies: `llm_trace.jsonl`

