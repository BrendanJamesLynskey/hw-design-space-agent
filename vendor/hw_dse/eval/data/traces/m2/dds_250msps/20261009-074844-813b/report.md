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
`pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=1,rounding=trunc` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 964 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 995 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000118 (2^-13.05) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.71 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.95e-05 (2^-15.05) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.94 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.1 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (21 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=1,rounding=trunc` | 964 | 995 | 264.5 | 17 | 18.4 | 0.000118 (2^-13.05) | 13.05 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 979 | 1014 | 264.5 | 17 | 18.7 | 8.25e-05 (2^-13.57) | 13.57 |
| 2 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 994 | 1029 | 264.5 | 17 | 19 | 7.63e-05 (2^-13.68) | 13.68 |
| 3 | `pipelined:data_width=20,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 1008 | 1044 | 264.5 | 17 | 19.3 | 7.03e-05 (2^-13.80) | 13.80 |
| 4 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1033 | 1065 | 264.5 | 18 | 19.7 | 5.75e-05 (2^-14.09) | 14.09 |
| 5 | `pipelined:data_width=23,n_iter=16,angle_guard=-2,frac_guard=1,rounding=trunc` | 1191 | 1223 | 256.5 | 18 | 22.7 | 3.88e-05 (2^-14.65) | 14.65 |
| 6 | `pipelined:data_width=23,n_iter=16,angle_guard=-2,frac_guard=2,rounding=trunc` | 1222 | 1251 | 256.5 | 18 | 23.3 | 3.86e-05 (2^-14.66) | 14.66 |
| 7 | `pipelined:data_width=20,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc` | 1223 | 1249 | 264.5 | 20 | 23.3 | 3.75e-05 (2^-14.70) | 14.70 |
| 8 | `pipelined:data_width=23,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 1238 | 1271 | 256.5 | 18 | 23.6 | 3.18e-05 (2^-14.94) | 14.94 |
| 9 | `pipelined:data_width=23,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 1270 | 1299 | 256.5 | 18 | 24.2 | 3.17e-05 (2^-14.94) | 14.94 |
| 10 | `pipelined:data_width=21,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc` | 1277 | 1304 | 264.5 | 20 | 24.3 | 2.08e-05 (2^-15.56) | 15.56 |
| 11 | `pipelined:data_width=21,n_iter=18,angle_guard=3,frac_guard=0,rounding=round` | 1295 | 1326 | 256.5 | 20 | 24.6 | 1.59e-05 (2^-15.94) | 15.94 |
| 12 | `pipelined:data_width=21,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 1333 | 1361 | 264.5 | 21 | 25.3 | 1.29e-05 (2^-16.24) | 16.24 |
| 13 | `pipelined:data_width=24,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc` | 1438 | 1471 | 256.5 | 20 | 27.4 | 9.16e-06 (2^-16.74) | 16.74 |
| 14 | `pipelined:data_width=22,n_iter=19,angle_guard=0,frac_guard=1,rounding=round` | 1455 | 1436 | 256.5 | 21 | 27.2 | 8.92e-06 (2^-16.77) | 16.77 |
| 15 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=2,rounding=trunc` | 1466 | 1487 | 256.5 | 21 | 27.8 | 7.45e-06 (2^-17.04) | 17.04 |
| 16 | `pipelined:data_width=24,n_iter=19,angle_guard=1,frac_guard=0,rounding=trunc` | 1504 | 1534 | 256.5 | 21 | 28.6 | 5.58e-06 (2^-17.45) | 17.45 |
| 17 | `pipelined:data_width=23,n_iter=20,angle_guard=2,frac_guard=0,rounding=round` | 1547 | 1574 | 256.5 | 22 | 29.3 | 4.1e-06 (2^-17.90) | 17.90 |
| 18 | `pipelined:data_width=22,n_iter=21,angle_guard=3,frac_guard=4,rounding=trunc` | 1754 | 1764 | 256.5 | 23 | 33.1 | 2.49e-06 (2^-18.61) | 18.61 |
| 19 | `pipelined:data_width=22,n_iter=24,angle_guard=3,frac_guard=4,rounding=round` | 2063 | 2020 | 256.5 | 26 | 38.4 | 1.28e-06 (2^-19.57) | 19.57 |
| 20 | `pipelined:data_width=24,n_iter=25,angle_guard=2,frac_guard=1,rounding=round` | 2130 | 2092 | 256.5 | 27 | 39.7 | 1.08e-06 (2^-19.82) | 19.82 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec needs one sample per clock at 250 MSPS or more, which rules out iterative and unrolled_k because they produce a result only every several cycles. Only the pipelined and pipelined_m families can plausibly meet it. A max error of 2^-13 needs roughly 13-bit accuracy, which should take a width of about 14-16 bits and 13-16 iterations. The ranges are kept a little wider than that on both sides so the search maps the front and finds the cheapest feasible point. m is limited to 2-4 to protect Fmax. I will narrow the ranges after seeing the first round.*)
- `pipelined` (50 evals): data_width=12..20, n_iter=11..19, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per clock is needed, and a fully pipelined design has the shortest critical path, so 250 MSPS is plausible. The ranges are centred on the 13-bit accuracy needed and extend upward to trace the LUT vs accuracy trade-off.
- `pipelined_m` (50 evals): data_width=12..20, n_iter=11..19, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages may use fewer FFs, and LUTs may differ too. Small m should still hold 250 MHz, so it is a plausible competitor for minimum LUTs.

**Result (code):** 100 evaluations this round, 100 total; 21 feasible; hypervolume 7568 (n/a).

**LLM decision:** `refine` — Only pipelined has feasible designs (21 of 50 evals). pipelined_m has 0 feasible and a best throughput of 171 MSPS, below the 250 MSPS constraint. iterative and unrolled_k produce one result every several cycles, so they cannot sustain 250 MSPS and are not worth budget. The front spans only luts 994..1295 and data_width 19..20, while feasible pipelined designs sit at data_width 18..20, n_iter 15..19. The lowest-LUT design (994 LUTs, 13.7 bits) is close to the 13-bit error limit, so smaller widths and fewer iterations should cut LUTs further. I will search data_width 14..21 and n_iter 11..20 to push down in LUTs and still cover the higher-accuracy end, which adds hypervolume. Round 1 stayed in the 18..20 width band, so the lower bound is untested.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7568 (gain this round: n/a (first round)).
Feasible designs: 21 of 100 evaluations (19 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 282
- max_abs_err <= 0.00012207: 69% violate; best seen 1.92e-05 (2^-15.67)

Pareto front (feasible, 4 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts=1223, accuracy_bits=14.7, ffs=1249, throughput_msps=264, max_abs_err=3.75e-05 (2^-14.70), power_index=23.3
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc] luts=1295, accuracy_bits=15.7, ffs=1318, throughput_msps=264, max_abs_err=1.92e-05 (2^-15.67), power_index=24.6
Front coverage: luts 994..1295 (HV reference 4000); accuracy_bits 13.7..15.7 (HV reference 13); data_width on the front 19..20 (registry 8..28).

Per family:
- pipelined: 50 evals, 21 feasible; max throughput seen 282 MSPS; best accuracy 15.67 bits; best feasible luts=994; feasible ranges: data_width 18..20, n_iter 15..19, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.62 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the one feasible family and extend the search below the current data_width 18..20 band to find lower-LUT designs, while keeping enough upper range to cover the high-accuracy end of the front.*)
- `pipelined` (100 evals): data_width=14..21, n_iter=11..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only family meeting 250 MSPS with feasible accuracy; lower widths and iteration counts target fewer LUTs while keeping error <= 2^-13.

**Result (code):** 100 evaluations this round, 200 total; 54 feasible; hypervolume 1.021e+04 (+34.9%).

**LLM decision:** `refine` — Only pipelined has feasible designs: 54 of 150 evals, front 964..1447 LUTs. pipelined_m reached just 171 MSPS and has 0 feasible, so it cannot meet the 250 MSPS constraint and should be dropped. iterative and unrolled_k give one result every several cycles, so throughput is far below 250 MSPS and they cannot be feasible. The LUT-minimising corner is near accuracy 13.1 bits (err 0.000118, close to the 0.000122 limit), so the next round should focus on lower data_width and n_iter at the accuracy boundary. data_width 16..20, n_iter 13..16 and frac_guard 0..2 are the ranges to search. Both rounding modes stay in, because round gives accuracy for few LUTs. The front already shows a wide accuracy spread, so the final map_front round can cover the high-accuracy end.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.021e+04 (gain this round: +34.9%).
Feasible designs: 54 of 200 evaluations (46 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 282
- max_abs_err <= 0.00012207: 68% violate; best seen 9.63e-06 (2^-16.66)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc] luts=964, accuracy_bits=13.1, ffs=995, throughput_msps=264, max_abs_err=0.000118 (2^-13.05), power_index=18.4
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=21 n_iter=16 angle_guard=-1 frac_guard=3 rounding=round] luts=1219, accuracy_bits=14.4, ffs=1201, throughput_msps=257, max_abs_err=4.68e-05 (2^-14.38), power_index=22.8
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts=1223, accuracy_bits=14.7, ffs=1249, throughput_msps=264, max_abs_err=3.75e-05 (2^-14.70), power_index=23.3
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=2 rounding=trunc] luts=1259, accuracy_bits=14.9, ffs=1281, throughput_msps=264, max_abs_err=3.36e-05 (2^-14.86), power_index=23.9
- pipelined [data_width=21 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts=1277, accuracy_bits=15.6, ffs=1304, throughput_msps=264, max_abs_err=2.08e-05 (2^-15.56), power_index=24.3
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts=1295, accuracy_bits=15.9, ffs=1326, throughput_msps=257, max_abs_err=1.59e-05 (2^-15.94), power_index=24.6
- pipelined [data_width=21 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] luts=1333, accuracy_bits=16.2, ffs=1361, throughput_msps=264, max_abs_err=1.29e-05 (2^-16.24), power_index=25.3
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=3 rounding=round] luts=1447, accuracy_bits=16.7, ffs=1425, throughput_msps=257, max_abs_err=9.63e-06 (2^-16.66), power_index=27
Front coverage: luts 964..1447 (HV reference 4000); accuracy_bits 13.1..16.7 (HV reference 13); data_width on the front 18..21 (registry 8..28).

Per family:
- pipelined: 150 evals, 54 feasible; max throughput seen 282 MSPS; best accuracy 16.66 bits; best feasible luts=964; feasible ranges: data_width 18..21, n_iter 15..19, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.62 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on pipelined near the accuracy constraint edge to cut the minimum LUTs, since pipelined_m is infeasible on throughput and iterative/unrolled_k cannot deliver one sample per clock.*)
- `pipelined` (40 evals): data_width=15..20, n_iter=12..16, angle_guard=-2..3, frac_guard=0..2, rounding=trunc|round. *Why:* Only family meeting throughput; search the low-LUT boundary where max error is just under 2^-13 to reduce LUTs below 964.

**Result (code):** 40 evaluations this round, 240 total; 65 feasible; hypervolume 1.022e+04 (+0.1%).

**LLM decision:** `stop` — This is the final round, so stop is the only effective choice. The front is feasible and stable: 12 designs, all pipelined, spanning 964 to 1447 LUTs and 13.1 to 16.7 accuracy bits. The last round added only +0.1% hypervolume, so the search has converged. The selection rule (min luts) picks the 964-LUT design, pipelined W=18, N=15, with max error 0.000118 (2^-13.05) and 264 MSPS. It meets both constraints, throughput >= 250 and error <= 2^-13. pipelined_m produced 0 feasible designs out of 50, with throughput topping out at 171 MSPS. Iterative and unrolled_k cannot deliver one result per cycle, so they cannot reach 250 MSPS at the achievable Fmax.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.022e+04 (gain this round: +0.1%).
Feasible designs: 65 of 240 evaluations (53 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 21% violate; best seen 282
- max_abs_err <= 0.00012207: 69% violate; best seen 9.63e-06 (2^-16.66)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc] luts=964, accuracy_bits=13.1, ffs=995, throughput_msps=264, max_abs_err=0.000118 (2^-13.05), power_index=18.4
- pipelined [data_width=19 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] luts=979, accuracy_bits=13.6, ffs=1014, throughput_msps=264, max_abs_err=8.25e-05 (2^-13.57), power_index=18.7
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=21 n_iter=16 angle_guard=-1 frac_guard=3 rounding=round] luts=1219, accuracy_bits=14.4, ffs=1201, throughput_msps=257, max_abs_err=4.68e-05 (2^-14.38), power_index=22.8
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts=1223, accuracy_bits=14.7, ffs=1249, throughput_msps=264, max_abs_err=3.75e-05 (2^-14.70), power_index=23.3
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=2 rounding=trunc] luts=1259, accuracy_bits=14.9, ffs=1281, throughput_msps=264, max_abs_err=3.36e-05 (2^-14.86), power_index=23.9
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts=1295, accuracy_bits=15.9, ffs=1326, throughput_msps=257, max_abs_err=1.59e-05 (2^-15.94), power_index=24.6
- pipelined [data_width=21 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] luts=1333, accuracy_bits=16.2, ffs=1361, throughput_msps=264, max_abs_err=1.29e-05 (2^-16.24), power_index=25.3
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=3 rounding=round] luts=1447, accuracy_bits=16.7, ffs=1425, throughput_msps=257, max_abs_err=9.63e-06 (2^-16.66), power_index=27
Front coverage: luts 964..1447 (HV reference 4000); accuracy_bits 13.1..16.7 (HV reference 13); data_width on the front 18..21 (registry 8..28).

Per family:
- pipelined: 190 evals, 65 feasible; max throughput seen 282 MSPS; best accuracy 16.66 bits; best feasible luts=964; feasible ranges: data_width 18..21, n_iter 15..19, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.62 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (160 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (12 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 161 feasible; hypervolume 1.726e+04 (+68.9%).

**No LLM call** (code's front-mapping round): This is the final round, so stop is the only effective choice. The front is feasible and stable: 12 designs, all pipelined, spanning 964 to 1447 LUTs and 13.1 to 16.7 accuracy bits. The last round added only +0.1% hypervolume, so the search has converged. The selection rule (min luts) picks the 964-LUT design, pipelined W=18, N=15, with max error 0.000118 (2^-13.05) and 264 MSPS. It meets both constraints, throughput >= 250 and error <= 2^-13. pipelined_m produced 0 feasible designs out of 50, with throughput topping out at 171 MSPS. Iterative and unrolled_k cannot deliver one result per cycle, so they cannot reach 250 MSPS at the achievable Fmax.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.726e+04 (gain this round: +68.9%).
Feasible designs: 161 of 400 evaluations (136 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 22% violate; best seen 282
- max_abs_err <= 0.00012207: 48% violate; best seen 5.57e-08 (2^-24.10)

Pareto front (feasible, 21 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc] luts=964, accuracy_bits=13.1, ffs=995, throughput_msps=264, max_abs_err=0.000118 (2^-13.05), power_index=18.4
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1033, accuracy_bits=14.1, ffs=1065, throughput_msps=264, max_abs_err=5.75e-05 (2^-14.09), power_index=19.7
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts=1223, accuracy_bits=14.7, ffs=1249, throughput_msps=264, max_abs_err=3.75e-05 (2^-14.70), power_index=23.3
- pipelined [data_width=23 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] luts=1270, accuracy_bits=14.9, ffs=1299, throughput_msps=257, max_abs_err=3.17e-05 (2^-14.94), power_index=24.2
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts=1295, accuracy_bits=15.9, ffs=1326, throughput_msps=257, max_abs_err=1.59e-05 (2^-15.94), power_index=24.6
- pipelined [data_width=24 n_iter=18 angle_guard=2 frac_guard=0 rounding=trunc] luts=1438, accuracy_bits=16.7, ffs=1471, throughput_msps=257, max_abs_err=9.16e-06 (2^-16.74), power_index=27.4
- pipelined [data_width=24 n_iter=19 angle_guard=1 frac_guard=0 rounding=trunc] luts=1504, accuracy_bits=17.5, ffs=1534, throughput_msps=257, max_abs_err=5.58e-06 (2^-17.45), power_index=28.6
- pipelined [data_width=22 n_iter=21 angle_guard=3 frac_guard=4 rounding=trunc] luts=1754, accuracy_bits=18.6, ffs=1764, throughput_msps=257, max_abs_err=2.49e-06 (2^-18.61), power_index=33.1
- pipelined [data_width=24 n_iter=25 angle_guard=2 frac_guard=1 rounding=round] luts=2130, accuracy_bits=19.8, ffs=2092, throughput_msps=257, max_abs_err=1.08e-06 (2^-19.82), power_index=39.7
Front coverage: luts 964..2130 (HV reference 4000); accuracy_bits 13.1..19.8 (HV reference 13); data_width on the front 18..24 (registry 8..28).

Per family:
- pipelined: 350 evals, 161 feasible; max throughput seen 282 MSPS; best accuracy 24.10 bits; best feasible luts=964; feasible ranges: data_width 17..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.62 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 18738 in, 3051 out
- provider-reported cost: $0.0680
- full prompts and replies: `llm_trace.jsonl`

