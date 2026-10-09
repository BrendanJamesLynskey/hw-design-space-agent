# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (30 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 935 | 969 | 264.5 | 17 | 17.9 | 0.000119 (2^-13.04) | 13.04 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 949 | 984 | 264.5 | 17 | 18.2 | 8.66e-05 (2^-13.50) | 13.50 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 1008 | 1032 | 264.5 | 17 | 19.2 | 8.58e-05 (2^-13.51) | 13.51 |
| 3 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 1019 | 1012 | 264.5 | 17 | 19.1 | 7.94e-05 (2^-13.62) | 13.62 |
| 4 | `pipelined:data_width=19,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc` | 1033 | 1061 | 264.5 | 18 | 19.7 | 7.43e-05 (2^-13.72) | 13.72 |
| 5 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=3,rounding=round` | 1061 | 1049 | 264.5 | 17 | 19.8 | 7.32e-05 (2^-13.74) | 13.74 |
| 6 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 1064 | 1094 | 264.5 | 18 | 20.3 | 6.35e-05 (2^-13.94) | 13.94 |
| 7 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1080 | 1114 | 264.5 | 18 | 20.6 | 4.12e-05 (2^-14.57) | 14.57 |
| 8 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 1175 | 1164 | 264.5 | 19 | 22 | 3.42e-05 (2^-14.83) | 14.83 |
| 9 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=1,rounding=round` | 1192 | 1181 | 264.5 | 19 | 22.3 | 3.23e-05 (2^-14.92) | 14.92 |
| 10 | `pipelined:data_width=20,n_iter=17,angle_guard=3,frac_guard=1,rounding=trunc` | 1202 | 1231 | 256.5 | 19 | 22.9 | 3.13e-05 (2^-14.96) | 14.96 |
| 11 | `pipelined:data_width=18,n_iter=17,angle_guard=3,frac_guard=3,rounding=round` | 1207 | 1191 | 264.5 | 19 | 22.5 | 3.11e-05 (2^-14.97) | 14.97 |
| 12 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=2,rounding=round` | 1226 | 1212 | 264.5 | 19 | 22.9 | 2.76e-05 (2^-15.14) | 15.14 |
| 13 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=3,rounding=trunc` | 1236 | 1257 | 256.5 | 19 | 23.4 | 2.56e-05 (2^-15.25) | 15.25 |
| 14 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=3,rounding=round` | 1242 | 1225 | 264.5 | 19 | 23.2 | 2.52e-05 (2^-15.28) | 15.28 |
| 15 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc` | 1253 | 1274 | 256.5 | 19 | 23.8 | 2.35e-05 (2^-15.38) | 15.38 |
| 16 | `pipelined:data_width=19,n_iter=18,angle_guard=2,frac_guard=2,rounding=round` | 1281 | 1265 | 264.5 | 20 | 23.9 | 2.34e-05 (2^-15.38) | 15.38 |
| 17 | `pipelined:data_width=20,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 1295 | 1323 | 264.5 | 21 | 24.6 | 2.17e-05 (2^-15.49) | 15.49 |
| 18 | `pipelined:data_width=22,n_iter=17,angle_guard=3,frac_guard=1,rounding=trunc` | 1303 | 1334 | 256.5 | 19 | 24.8 | 1.84e-05 (2^-15.73) | 15.73 |
| 19 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=2,rounding=round` | 1337 | 1320 | 264.5 | 20 | 25 | 1.51e-05 (2^-16.01) | 16.01 |
| 20 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=3,rounding=round` | 1373 | 1352 | 256.5 | 20 | 25.6 | 1.32e-05 (2^-16.21) | 16.21 |
| 21 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 1385 | 1404 | 256.5 | 20 | 26.2 | 1.12e-05 (2^-16.44) | 16.44 |
| 22 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=4,rounding=trunc` | 1420 | 1437 | 256.5 | 20 | 26.9 | 1.11e-05 (2^-16.46) | 16.46 |
| 23 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=4,rounding=round` | 1465 | 1439 | 256.5 | 20 | 27.3 | 1.05e-05 (2^-16.55) | 16.55 |
| 24 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=2,rounding=trunc` | 1587 | 1606 | 256.5 | 22 | 30 | 4.63e-06 (2^-17.72) | 17.72 |
| 25 | `pipelined:data_width=22,n_iter=20,angle_guard=1,frac_guard=3,rounding=round` | 1633 | 1604 | 256.5 | 22 | 30.4 | 4.49e-06 (2^-17.77) | 17.77 |
| 26 | `pipelined:data_width=23,n_iter=20,angle_guard=1,frac_guard=3,rounding=round` | 1695 | 1665 | 256.5 | 22 | 31.6 | 3.39e-06 (2^-18.17) | 18.17 |
| 27 | `pipelined:data_width=22,n_iter=21,angle_guard=3,frac_guard=4,rounding=trunc` | 1754 | 1764 | 256.5 | 23 | 33.1 | 2.49e-06 (2^-18.61) | 18.61 |
| 28 | `pipelined:data_width=21,n_iter=24,angle_guard=4,frac_guard=4,rounding=round` | 2013 | 1971 | 256.5 | 26 | 37.5 | 2.06e-06 (2^-18.89) | 18.89 |
| 29 | `pipelined:data_width=22,n_iter=24,angle_guard=4,frac_guard=4,rounding=round` | 2087 | 2044 | 256.5 | 26 | 38.9 | 9.85e-07 (2^-19.95) | 19.95 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec needs one sample per clock at >=250 MSPS, so only pipelined and pipelined_m can qualify. The iterative and unrolled_k families produce a result only every several cycles. The error bound of 2^-13 needs an output LSB (2^-(W-2)) and an n_iter that are both fine enough, so I search data_width 13..20 and n_iter 10..18 with small guard-bit ranges. The two objectives are LUTs and accuracy bits, so this range also covers the trade-off above and below the 13-bit accuracy reference. Split the budget evenly this round, then narrow toward whichever family dominates the front.*)
- `pipelined` (50 evals): data_width=13..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle is guaranteed, so the 250 MSPS constraint depends only on Fmax. Narrow ranges around the 2^-13 error bound should keep LUTs low.
- `pipelined_m` (50 evals): data_width=13..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages can cut FFs and may change LUTs. Small m keeps Fmax plausible for 250 MSPS, so this is worth testing against the fully pipelined family.

**Result (code):** 100 evaluations this round, 100 total; 24 feasible; hypervolume 6540 (n/a).

**LLM decision:** `refine` — Only pipelined has feasible designs (24 of 50 evals), with a front of 968..1242 LUTs and 13.1..15.3 accuracy bits. pipelined_m has 0 feasible out of 50 (max throughput 171 MSPS, below the 250 constraint), so it should be dropped. The tight accuracy margin at the low-LUT end (max error 0.000117 vs the 0.000122 limit) means the cheapest designs sit near the data_width 16..19, n_iter 14..17 boundary. Fewer LUTs probably need smaller data_width, fewer iterations and less guard, so I will concentrate budget there. Iterative and unrolled_k produce one result every several cycles, so they cannot reach 250 MSPS at about 264 MHz Fmax and are excluded. The remaining budget goes to refining pipelined around the low-LUT corner while keeping some range up toward 15+ bits to hold front coverage.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6540 (gain this round: n/a (first round)).
Feasible designs: 24 of 100 evaluations (15 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 282
- max_abs_err <= 0.00012207: 52% violate; best seen 2.52e-05 (2^-15.28)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts=968, accuracy_bits=13.1, ffs=958, throughput_msps=264, max_abs_err=0.000117 (2^-13.06), power_index=18.1
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=973, accuracy_bits=13.3, ffs=967, throughput_msps=264, max_abs_err=0.000101 (2^-13.27), power_index=18.2
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts=987, accuracy_bits=13.4, ffs=982, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=18.5
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=1019, accuracy_bits=13.6, ffs=1012, throughput_msps=264, max_abs_err=7.94e-05 (2^-13.62), power_index=19.1
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts=1034, accuracy_bits=13.7, ffs=1027, throughput_msps=264, max_abs_err=7.74e-05 (2^-13.66), power_index=19.4
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1175, accuracy_bits=14.8, ffs=1164, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1192, accuracy_bits=14.9, ffs=1181, throughput_msps=264, max_abs_err=3.23e-05 (2^-14.92), power_index=22.3
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] luts=1202, accuracy_bits=14.9, ffs=1223, throughput_msps=264, max_abs_err=3.2e-05 (2^-14.93), power_index=22.8
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] luts=1226, accuracy_bits=15.1, ffs=1212, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.9
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] luts=1242, accuracy_bits=15.3, ffs=1225, throughput_msps=264, max_abs_err=2.52e-05 (2^-15.28), power_index=23.2
Front coverage: luts 968..1242 (HV reference 4000); accuracy_bits 13.1..15.3 (HV reference 13); data_width on the front 16..19 (registry 8..28).

Per family:
- pipelined: 50 evals, 24 feasible; max throughput seen 282 MSPS; best accuracy 15.28 bits; best feasible luts=968; feasible ranges: data_width 16..19, n_iter 15..17, angle_guard -1..3, frac_guard 1..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.10 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *pipelined is the only family meeting both throughput and error constraints. pipelined_m reached only 171 MSPS and iterative and unrolled_k cannot deliver one result per clock, so the whole budget goes to the pipelined sweet spot.*)
- `pipelined` (100 evals): data_width=15..20, n_iter=13..18, angle_guard=0..3, frac_guard=0..3, rounding=round|trunc. *Why:* All feasible and Pareto points are pipelined with data_width 16..19 and n_iter 15..17; this range covers that region plus one step below it to probe cheaper designs that still meet 2^-13.

**Result (code):** 100 evaluations this round, 200 total; 79 feasible; hypervolume 8611 (+31.7%).

**LLM decision:** `refine` — Only pipelined designs are feasible: 79 of its 150 evals pass. pipelined_m has 0 feasible out of 50 and tops out at 171 MSPS against the 250 floor. The spec needs one sample per clock at >=250 MSPS, which iterative and unrolled_k cannot deliver, since they produce a result only every several cycles. The cheapest feasible design is 935 LUTs at 13.0 bits, sitting right on the error limit (1.19e-4 vs 1.22e-4). The front covers luts 935..1337 and accuracy 13..16. Feasible designs cluster at data_width 16..20 and n_iter 15..18. The objective is min LUTs, so the next round should probe the low-LUT edge: slightly narrower widths and fewer iterations, with the guard bits and rounding mode that keep error under 2^-13. It should also keep densifying the front up to about 16 bits.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8611 (gain this round: +31.7%).
Feasible designs: 79 of 200 evaluations (51 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 282
- max_abs_err <= 0.00012207: 48% violate; best seen 1.51e-05 (2^-16.01)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts=935, accuracy_bits=13, ffs=969, throughput_msps=264, max_abs_err=0.000119 (2^-13.04), power_index=17.9
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts=1034, accuracy_bits=13.7, ffs=1027, throughput_msps=264, max_abs_err=7.74e-05 (2^-13.66), power_index=19.4
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=1065, accuracy_bits=13.8, ffs=1057, throughput_msps=264, max_abs_err=7.02e-05 (2^-13.80), power_index=20
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1175, accuracy_bits=14.8, ffs=1164, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts=1192, accuracy_bits=14.9, ffs=1181, throughput_msps=264, max_abs_err=3.23e-05 (2^-14.92), power_index=22.3
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=3 rounding=trunc] luts=1236, accuracy_bits=15.3, ffs=1257, throughput_msps=257, max_abs_err=2.56e-05 (2^-15.25), power_index=23.4
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] luts=1253, accuracy_bits=15.4, ffs=1274, throughput_msps=257, max_abs_err=2.35e-05 (2^-15.38), power_index=23.8
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] luts=1337, accuracy_bits=16, ffs=1320, throughput_msps=264, max_abs_err=1.51e-05 (2^-16.01), power_index=25
Front coverage: luts 935..1337 (HV reference 4000); accuracy_bits 13..16 (HV reference 13); data_width on the front 18..20 (registry 8..28).

Per family:
- pipelined: 150 evals, 79 feasible; max throughput seen 282 MSPS; best accuracy 16.01 bits; best feasible luts=935; feasible ranges: data_width 16..20, n_iter 15..18, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.10 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on pipelined around the feasible region, pushing toward lower LUT counts at accuracy >=13 bits. Drop pipelined_m, which was infeasible on throughput, and the multi-cycle families, which cannot reach one sample per clock.*)
- `pipelined` (40 evals): data_width=15..20, n_iter=13..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only family meeting both throughput and error constraints. The ranges extend slightly below the current feasible region to look for cheaper designs near 13 bits, while keeping the upper region for front coverage.

**Result (code):** 40 evaluations this round, 240 total; 105 feasible; hypervolume 9128 (+6.0%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible are valid. The constraints are met: 105 of 240 evaluations are feasible, and the front has 20 designs. The selection rule (min luts) picks the pipelined design at 935 LUTs, with 13.04 accuracy bits, 264 MSPS and max error 0.000119 against the 0.00012207 limit. The front spans 935..1373 LUTs and 13..16.2 accuracy bits, and hypervolume is 9128. The last round added +6.0%, which is a gain but leaves no rounds in which to use it. Only pipelined designs are feasible. pipelined_m had 0 feasible designs out of 50, with throughput capped at 171 MSPS. Iterative and unrolled_k deliver one result every several cycles, so they cannot reach 250 MSPS with one sample per clock.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9128 (gain this round: +6.0%).
Feasible designs: 105 of 240 evaluations (72 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 21% violate; best seen 282
- max_abs_err <= 0.00012207: 46% violate; best seen 1.32e-05 (2^-16.21)

Pareto front (feasible, 20 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts=935, accuracy_bits=13, ffs=969, throughput_msps=264, max_abs_err=0.000119 (2^-13.04), power_index=17.9
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1008, accuracy_bits=13.5, ffs=1032, throughput_msps=264, max_abs_err=8.58e-05 (2^-13.51), power_index=19.2
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] luts=1033, accuracy_bits=13.7, ffs=1061, throughput_msps=264, max_abs_err=7.43e-05 (2^-13.72), power_index=19.7
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts=1064, accuracy_bits=13.9, ffs=1094, throughput_msps=264, max_abs_err=6.35e-05 (2^-13.94), power_index=20.3
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1175, accuracy_bits=14.8, ffs=1164, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] luts=1207, accuracy_bits=15, ffs=1191, throughput_msps=264, max_abs_err=3.11e-05 (2^-14.97), power_index=22.5
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=3 rounding=trunc] luts=1236, accuracy_bits=15.3, ffs=1257, throughput_msps=257, max_abs_err=2.56e-05 (2^-15.25), power_index=23.4
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] luts=1253, accuracy_bits=15.4, ffs=1274, throughput_msps=257, max_abs_err=2.35e-05 (2^-15.38), power_index=23.8
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=3 rounding=round] luts=1317, accuracy_bits=15.5, ffs=1297, throughput_msps=264, max_abs_err=2.1e-05 (2^-15.54), power_index=24.6
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=round] luts=1373, accuracy_bits=16.2, ffs=1352, throughput_msps=257, max_abs_err=1.32e-05 (2^-16.21), power_index=25.6
Front coverage: luts 935..1373 (HV reference 4000); accuracy_bits 13..16.2 (HV reference 13); data_width on the front 18..20 (registry 8..28).

Per family:
- pipelined: 190 evals, 105 feasible; max throughput seen 282 MSPS; best accuracy 16.21 bits; best feasible luts=935; feasible ranges: data_width 16..20, n_iter 15..18, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.10 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (160 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (20 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 206 feasible; hypervolume 1.746e+04 (+91.3%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible are valid. The constraints are met: 105 of 240 evaluations are feasible, and the front has 20 designs. The selection rule (min luts) picks the pipelined design at 935 LUTs, with 13.04 accuracy bits, 264 MSPS and max error 0.000119 against the 0.00012207 limit. The front spans 935..1373 LUTs and 13..16.2 accuracy bits, and hypervolume is 9128. The last round added +6.0%, which is a gain but leaves no rounds in which to use it. Only pipelined designs are feasible. pipelined_m had 0 feasible designs out of 50, with throughput capped at 171 MSPS. Iterative and unrolled_k deliver one result every several cycles, so they cannot reach 250 MSPS with one sample per clock.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.746e+04 (gain this round: +91.3%).
Feasible designs: 206 of 400 evaluations (160 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 23% violate; best seen 282
- max_abs_err <= 0.00012207: 32% violate; best seen 4.98e-08 (2^-24.26)

Pareto front (feasible, 30 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts=935, accuracy_bits=13, ffs=969, throughput_msps=264, max_abs_err=0.000119 (2^-13.04), power_index=17.9
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts=1019, accuracy_bits=13.6, ffs=1012, throughput_msps=264, max_abs_err=7.94e-05 (2^-13.62), power_index=19.1
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts=1064, accuracy_bits=13.9, ffs=1094, throughput_msps=264, max_abs_err=6.35e-05 (2^-13.94), power_index=20.3
- pipelined [data_width=20 n_iter=17 angle_guard=3 frac_guard=1 rounding=trunc] luts=1202, accuracy_bits=15, ffs=1231, throughput_msps=257, max_abs_err=3.13e-05 (2^-14.96), power_index=22.9
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=3 rounding=trunc] luts=1236, accuracy_bits=15.3, ffs=1257, throughput_msps=257, max_abs_err=2.56e-05 (2^-15.25), power_index=23.4
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] luts=1281, accuracy_bits=15.4, ffs=1265, throughput_msps=264, max_abs_err=2.34e-05 (2^-15.38), power_index=23.9
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] luts=1337, accuracy_bits=16, ffs=1320, throughput_msps=264, max_abs_err=1.51e-05 (2^-16.01), power_index=25
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=4 rounding=round] luts=1465, accuracy_bits=16.5, ffs=1439, throughput_msps=257, max_abs_err=1.05e-05 (2^-16.55), power_index=27.3
- pipelined [data_width=23 n_iter=20 angle_guard=1 frac_guard=3 rounding=round] luts=1695, accuracy_bits=18.2, ffs=1665, throughput_msps=257, max_abs_err=3.39e-06 (2^-18.17), power_index=31.6
- pipelined [data_width=22 n_iter=24 angle_guard=4 frac_guard=4 rounding=round] luts=2087, accuracy_bits=20, ffs=2044, throughput_msps=257, max_abs_err=9.85e-07 (2^-19.95), power_index=38.9
Front coverage: luts 935..2087 (HV reference 4000); accuracy_bits 13..20 (HV reference 13); data_width on the front 18..23 (registry 8..28).

Per family:
- pipelined: 350 evals, 206 feasible; max throughput seen 282 MSPS; best accuracy 24.26 bits; best feasible luts=935; feasible ranges: data_width 16..23, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.10 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19336 in, 3191 out
- provider-reported cost: $0.0706
- full prompts and replies: `llm_trace.jsonl`

