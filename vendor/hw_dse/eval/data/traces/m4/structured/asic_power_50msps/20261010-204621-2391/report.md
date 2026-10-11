# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_power_50msps: A 50 MSPS sin/cos unit in sky130 standard cells for a battery-powered radio: max error <= 2^-12. Minimise the relative power index; accuracy is the trade-off.
  target: asic-sky130hd
  constraint: throughput_msps >= 50
  constraint: max_abs_err <= 0.000244141
  objective: min power_index (HV ref 40)
  objective: max accuracy_bits (HV ref 12)
  select: min power_index
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 26576 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7080 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 323 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 129 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.68 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000204 (2^-12.26) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.67 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 6.07e-05 (2^-14.01) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.99 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 94.9 dBc, SNR 81.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

| tool | area µm² est → meas | FFs est → meas | Fmax MHz est → meas |
|---|---|---|---|
| measured (yosys+opensta yosys 0.33 + OpenSTA 3.1.0, sky130_fd_sc_hd, tt_025C_1v80) | 26576 → 27096 (+2.0%) | 324 → 326 (+0.8%) | 54 → 54 (-0.7%) |

Winner check (1 of 22 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on

## Pareto front (22 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=3` | 26576 | 323 | 54.3 | 7 | 1.68 | 0.000204 (2^-12.26) | 12.26 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=3` | 27017 | 328 | 51.9 | 7 | 1.71 | 0.000194 (2^-12.33) | 12.33 |
| 2 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=round,m=3` | 29608 | 346 | 51.9 | 7 | 1.83 | 0.000169 (2^-12.53) | 12.53 |
| 3 | `pipelined_m:data_width=16,n_iter=15,angle_guard=2,frac_guard=3,rounding=round,m=3` | 30612 | 337 | 51.9 | 7 | 1.84 | 0.000153 (2^-12.67) | 12.67 |
| 4 | `pipelined_m:data_width=17,n_iter=16,angle_guard=1,frac_guard=0,rounding=round,m=3` | 30828 | 381 | 54.3 | 8 | 1.97 | 0.000149 (2^-12.71) | 12.71 |
| 5 | `pipelined_m:data_width=17,n_iter=17,angle_guard=2,frac_guard=0,rounding=round,m=3` | 32850 | 387 | 51.9 | 8 | 2.04 | 0.000139 (2^-12.81) | 12.81 |
| 6 | `pipelined_m:data_width=17,n_iter=17,angle_guard=2,frac_guard=1,rounding=round,m=3` | 34798 | 399 | 51.9 | 8 | 2.13 | 9.28e-05 (2^-13.40) | 13.40 |
| 7 | `pipelined_m:data_width=17,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=3` | 35834 | 409 | 51.9 | 8 | 2.19 | 7.36e-05 (2^-13.73) | 13.73 |
| 8 | `pipelined_m:data_width=21,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc,m=2` | 41902 | 621 | 64.3 | 10 | 2.96 | 3.79e-05 (2^-14.69) | 14.69 |
| 9 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=3,rounding=round,m=2` | 43395 | 625 | 64.3 | 10 | 3.02 | 3.49e-05 (2^-14.81) | 14.81 |
| 10 | `pipelined_m:data_width=21,n_iter=18,angle_guard=-1,frac_guard=1,rounding=trunc,m=2` | 45356 | 668 | 66.8 | 11 | 3.19 | 3.12e-05 (2^-14.97) | 14.97 |
| 11 | `pipelined_m:data_width=22,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round,m=2` | 46074 | 680 | 66.8 | 11 | 3.25 | 1.85e-05 (2^-15.72) | 15.72 |
| 12 | `pipelined_m:data_width=22,n_iter=18,angle_guard=-1,frac_guard=2,rounding=round,m=2` | 49678 | 714 | 62.0 | 11 | 3.45 | 1.78e-05 (2^-15.77) | 15.77 |
| 13 | `pipelined_m:data_width=22,n_iter=18,angle_guard=-1,frac_guard=3,rounding=trunc,m=2` | 49728 | 728 | 59.9 | 11 | 3.49 | 1.75e-05 (2^-15.80) | 15.80 |
| 14 | `pipelined_m:data_width=23,n_iter=18,angle_guard=2,frac_guard=0,rounding=round,m=2` | 49903 | 735 | 59.9 | 11 | 3.51 | 9.4e-06 (2^-16.70) | 16.70 |
| 15 | `pipelined_m:data_width=22,n_iter=18,angle_guard=3,frac_guard=2,rounding=round,m=2` | 52201 | 749 | 59.9 | 11 | 3.62 | 8.89e-06 (2^-16.78) | 16.78 |
| 16 | `pipelined_m:data_width=22,n_iter=18,angle_guard=3,frac_guard=3,rounding=round,m=2` | 53419 | 765 | 59.9 | 11 | 3.7 | 8.49e-06 (2^-16.85) | 16.85 |
| 17 | `pipelined_m:data_width=28,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round,m=2` | 57691 | 851 | 54.3 | 11 | 4.07 | 7.74e-06 (2^-16.98) | 16.98 |
| 18 | `pipelined_m:data_width=23,n_iter=22,angle_guard=4,frac_guard=4,rounding=round,m=2` | 69989 | 991 | 56.1 | 13 | 4.82 | 8.68e-07 (2^-20.14) | 20.14 |
| 19 | `pipelined_m:data_width=25,n_iter=24,angle_guard=2,frac_guard=4,rounding=trunc,m=2` | 78623 | 1127 | 52.7 | 14 | 5.45 | 4.24e-07 (2^-21.17) | 21.17 |
| 20 | `pipelined_m:data_width=28,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 83262 | 1231 | 52.7 | 15 | 5.87 | 2.55e-07 (2^-21.91) | 21.91 |
| 21 | `pipelined_m:data_width=28,n_iter=29,angle_guard=1,frac_guard=2,rounding=trunc,m=2` | 100664 | 1467 | 51.2 | 17 | 7.04 | 9.22e-08 (2^-23.37) | 23.37 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Max error <= 2^-12 means about 12 accuracy bits, so the width and N ranges are centred on 12 to 18 bits and 11 to 18 iterations. Narrower or shorter designs would fail the constraint. Power is the primary objective, so I weight the iterative and unrolled families, which have the smallest hardware, plus pipelined_m. The first round will show which family meets 50 MSPS at the lowest power, and I will narrow the ranges after that.*)
- `iterative` (34 evals): data_width=12..18, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest shared datapath and fewest registers, so likely low power, but it needs Fmax*1/(N+3) >= 50 MSPS. That requires a high clock with small N, so I search moderate N near the accuracy limit of 2^-12.
- `unrolled_k` (33 evals): data_width=12..18, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..6. *Why:* Several micro-rotations per cycle cut the cycles per result, so 50 MSPS is reachable at a lower clock. It also avoids the large pipeline register cost.
- `pipelined_m` (22 evals): data_width=12..18, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* One result per cycle meets 50 MSPS at a modest clock, but it has no barrel shifters and fewer registers than a full pipeline. It is a plausible low-power candidate at relaxed Fmax.
- `pipelined` (11 evals): data_width=12..16, n_iter=11..16, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round. *Why:* Full pipelining is the reference for one result per cycle. It is likely costly in registers and power, so it gets a small share as a check.

**Result (code):** 100 evaluations this round, 100 total; 1 feasible; hypervolume 13.71 (n/a).

**LLM decision:** `refine` — Only 1 of 100 evaluations is feasible, and it comes from pipelined_m (data_width 17, n_iter 17, m 3, 51.9 MSPS, power 2.13). Iterative and unrolled_k top out at 10.5 and 7.78 MSPS, far below the 50 MSPS constraint, so they are dead. Pipelined reaches 171 MSPS but its best accuracy is only 11.31 bits, below the 12-bit requirement at this sampling. The feasible region is the narrow zone where pipelined or pipelined_m has enough accuracy (about 12 bits or more, so data_width around 14-18 and n_iter around 13-17) and keeps Fmax at or above 50 MHz. Larger m lowers FFs and power but cuts Fmax, and 51.9 MSPS is close to the limit. I should concentrate on pipelined_m with m 2-4, and keep pipelined as a smaller secondary family. The ranges should be set to the minimum width and iteration count that meet 2^-12, with rounding on, since fewer bits and stages should reduce power. This refinement also covers the front's accuracy range, which is currently a single point.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 13.71 (gain this round: n/a (first round)).
Feasible designs: 1 of 100 evaluations (1 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 83% violate; best seen 171
- max_abs_err <= 0.000244141: 58% violate; best seen 4.98e-05 (2^-14.29)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=17 angle_guard=0 frac_guard=2 rounding=round m=3] power_index=2.13, accuracy_bits=12.4, area_um2=34754, ffs=397, throughput_msps=51.9, max_abs_err=0.00019 (2^-12.36)
Front coverage: power_index 2.13..2.13 (HV reference 40); accuracy_bits 12.4..12.4 (HV reference 12); data_width on the front 17..17 (registry 8..28).

Per family:
- iterative: 34 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 13.92 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 7.78 MSPS; best accuracy 14.17 bits
- pipelined: 11 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 11.31 bits
- pipelined_m: 22 evals, 1 feasible; max throughput seen 66.8 MSPS; best accuracy 14.29 bits; best feasible power_index=2.13; feasible ranges: data_width 17..17, n_iter 17..17, angle_guard 0..0, frac_guard 2..2, m 3..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The sequential families cannot reach 50 MSPS, so the budget goes to pipelined_m and pipelined, within the data_width and n_iter region that meets the 2^-12 error bound at minimum cost.*)
- `pipelined_m` (75 evals): data_width=13..18, n_iter=12..18, angle_guard=-1..2, frac_guard=0..3, rounding=round|trunc, m=2..4. *Why:* The only family with feasible designs; the search is concentrated near the feasible point with m kept low enough to hold throughput at or above 50 MSPS.
- `pipelined` (25 evals): data_width=13..18, n_iter=12..18, angle_guard=-1..2, frac_guard=0..3, rounding=round|trunc. *Why:* Throughput is ample at up to 171 MSPS; it needs to be tested with accuracy at or above 12 bits to see whether its power is competitive.

**Result (code):** 100 evaluations this round, 200 total; 40 feasible; hypervolume 65.72 (+379.2%).

**LLM decision:** `refine` — The front has 7 designs, all pipelined_m at data_width 17 with m=3, covering power_index 1.68..2.19 and accuracy 12.3..13.7 bits. The iterative and unrolled_k families are infeasible, with max throughput of 10.5 and 7.78 MSPS against the 50 MSPS requirement. Pipelined is feasible but dominated: its best power_index is 3.48 against 1.68 for pipelined_m. Pipelined_m designs are feasible at data_width 16..18 and m 2..3. The lowest-power point has throughput 54.3 MSPS, which is only slightly above the 50 MSPS limit. Power is likely to fall further with smaller width, fewer iterations, or lower guard bits. So I will refine pipelined_m around data_width 15..18, m 2..4 and n_iter 12..18. I will keep a small pipelined share to check whether any width beats the front. The code-driven map_front step can cover the full curve afterwards.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 65.72 (gain this round: +379.2%).
Feasible designs: 40 of 200 evaluations (30 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 48% violate; best seen 171
- max_abs_err <= 0.000244141: 55% violate; best seen 4.11e-05 (2^-14.57)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.68, accuracy_bits=12.3, area_um2=26576, ffs=323, throughput_msps=54.3, max_abs_err=0.000204 (2^-12.26)
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=3] power_index=1.71, accuracy_bits=12.3, area_um2=27017, ffs=328, throughput_msps=51.9, max_abs_err=0.000194 (2^-12.33)
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=1.83, accuracy_bits=12.5, area_um2=29608, ffs=346, throughput_msps=51.9, max_abs_err=0.000169 (2^-12.53)
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.97, accuracy_bits=12.7, area_um2=30828, ffs=381, throughput_msps=54.3, max_abs_err=0.000149 (2^-12.71)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=3] power_index=2.04, accuracy_bits=12.8, area_um2=32850, ffs=387, throughput_msps=51.9, max_abs_err=0.000139 (2^-12.81)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.13, accuracy_bits=13.4, area_um2=34798, ffs=399, throughput_msps=51.9, max_abs_err=9.28e-05 (2^-13.40)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.19, accuracy_bits=13.7, area_um2=35834, ffs=409, throughput_msps=51.9, max_abs_err=7.36e-05 (2^-13.73)
Front coverage: power_index 1.68..2.19 (HV reference 40); accuracy_bits 12.3..13.7 (HV reference 12); data_width on the front 17..17 (registry 8..28).

Per family:
- iterative: 34 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 13.92 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 7.78 MSPS; best accuracy 14.17 bits
- pipelined: 36 evals, 4 feasible; max throughput seen 171 MSPS; best accuracy 13.49 bits; best feasible power_index=3.48; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard 1..2, frac_guard 1..2
- pipelined_m: 97 evals, 36 feasible; max throughput seen 96.1 MSPS; best accuracy 14.57 bits; best feasible power_index=1.68; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 0..2, frac_guard 0..3, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the region that produced every front point and extend it toward lower-power settings.*)
- `pipelined_m` (32 evals): data_width=15..18, n_iter=12..18, angle_guard=0..2, frac_guard=0..3, rounding=round, m=2..4. *Why:* All 7 front designs and 36 of the 40 feasible designs are here. Probing narrower widths and m=4 targets lower power while keeping 50 MSPS and error <= 2^-12.
- `pipelined` (8 evals): data_width=15..18, n_iter=13..17, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Fully pipelined is feasible but dominated at 3.48 power_index. A small share confirms it cannot reach the front at the narrower widths.

**Result (code):** 40 evaluations this round, 240 total; 45 feasible; hypervolume 88.26 (+34.3%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is allowed. The constraints are clearly reachable: 45 of 240 evaluations are feasible, with 9 designs on the front. The front is dominated by pipelined_m (m=3, data_width 16..17, n_iter 14..17) and runs from power_index 1.68 at 12.3 bits to 2.19 at 13.7 bits, plus one pipelined point at 4.65 and 14.4 bits. The lowest-power feasible design is pipelined_m w=17, N=14, ag=1, fg=0, round, m=3, with power_index 1.68, 54.3 MSPS (meets the 50 MSPS floor) and max_abs_err 2.04e-4 (meets 2^-12). Iterative and unrolled_k never exceeded 10.5 MSPS and had no feasible designs, so no other family can improve on this region. The selection rule (min power_index) picks that design.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 88.26 (gain this round: +34.3%).
Feasible designs: 45 of 240 evaluations (34 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 49% violate; best seen 171
- max_abs_err <= 0.000244141: 57% violate; best seen 4.11e-05 (2^-14.57)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.68, accuracy_bits=12.3, area_um2=26576, ffs=323, throughput_msps=54.3, max_abs_err=0.000204 (2^-12.26)
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=3] power_index=1.71, accuracy_bits=12.3, area_um2=27017, ffs=328, throughput_msps=51.9, max_abs_err=0.000194 (2^-12.33)
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=1.83, accuracy_bits=12.5, area_um2=29608, ffs=346, throughput_msps=51.9, max_abs_err=0.000169 (2^-12.53)
- pipelined_m [data_width=16 n_iter=15 angle_guard=2 frac_guard=3 rounding=round m=3] power_index=1.84, accuracy_bits=12.7, area_um2=30612, ffs=337, throughput_msps=51.9, max_abs_err=0.000153 (2^-12.67)
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.97, accuracy_bits=12.7, area_um2=30828, ffs=381, throughput_msps=54.3, max_abs_err=0.000149 (2^-12.71)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=3] power_index=2.04, accuracy_bits=12.8, area_um2=32850, ffs=387, throughput_msps=51.9, max_abs_err=0.000139 (2^-12.81)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.13, accuracy_bits=13.4, area_um2=34798, ffs=399, throughput_msps=51.9, max_abs_err=9.28e-05 (2^-13.40)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.19, accuracy_bits=13.7, area_um2=35834, ffs=409, throughput_msps=51.9, max_abs_err=7.36e-05 (2^-13.73)
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] power_index=4.65, accuracy_bits=14.4, area_um2=52760, ffs=1114, throughput_msps=132, max_abs_err=4.73e-05 (2^-14.37)
Front coverage: power_index 1.68..4.65 (HV reference 40); accuracy_bits 12.3..14.4 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 34 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 13.92 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 7.78 MSPS; best accuracy 14.17 bits
- pipelined: 44 evals, 5 feasible; max throughput seen 171 MSPS; best accuracy 14.37 bits; best feasible power_index=3.48; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard 1..2, frac_guard 1..2
- pipelined_m: 129 evals, 40 feasible; max throughput seen 96.1 MSPS; best accuracy 14.57 bits; best feasible power_index=1.68; feasible ranges: data_width 15..18, n_iter 14..18, angle_guard 0..2, frac_guard 0..3, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (143 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (8 front designs; box front_anchored)
- `pipelined` (17 evals): data_width=17..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 116 feasible; hypervolume 405.2 (+359.2%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is allowed. The constraints are clearly reachable: 45 of 240 evaluations are feasible, with 9 designs on the front. The front is dominated by pipelined_m (m=3, data_width 16..17, n_iter 14..17) and runs from power_index 1.68 at 12.3 bits to 2.19 at 13.7 bits, plus one pipelined point at 4.65 and 14.4 bits. The lowest-power feasible design is pipelined_m w=17, N=14, ag=1, fg=0, round, m=3, with power_index 1.68, 54.3 MSPS (meets the 50 MSPS floor) and max_abs_err 2.04e-4 (meets 2^-12). Iterative and unrolled_k never exceeded 10.5 MSPS and had no feasible designs, so no other family can improve on this region. The selection rule (min power_index) picks that design.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 405.2 (gain this round: +359.2%).
Feasible designs: 116 of 400 evaluations (99 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 49% violate; best seen 171
- max_abs_err <= 0.000244141: 40% violate; best seen 9.22e-08 (2^-23.37)

Pareto front (feasible, 22 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.68, accuracy_bits=12.3, area_um2=26576, ffs=323, throughput_msps=54.3, max_abs_err=0.000204 (2^-12.26)
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=1.83, accuracy_bits=12.5, area_um2=29608, ffs=346, throughput_msps=51.9, max_abs_err=0.000169 (2^-12.53)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=3] power_index=2.04, accuracy_bits=12.8, area_um2=32850, ffs=387, throughput_msps=51.9, max_abs_err=0.000139 (2^-12.81)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.19, accuracy_bits=13.7, area_um2=35834, ffs=409, throughput_msps=51.9, max_abs_err=7.36e-05 (2^-13.73)
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=3.02, accuracy_bits=14.8, area_um2=43395, ffs=625, throughput_msps=64.3, max_abs_err=3.49e-05 (2^-14.81)
- pipelined_m [data_width=22 n_iter=18 angle_guard=-1 frac_guard=2 rounding=round m=2] power_index=3.45, accuracy_bits=15.8, area_um2=49678, ffs=714, throughput_msps=62, max_abs_err=1.78e-05 (2^-15.77)
- pipelined_m [data_width=23 n_iter=18 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=3.51, accuracy_bits=16.7, area_um2=49903, ffs=735, throughput_msps=59.9, max_abs_err=9.4e-06 (2^-16.70)
- pipelined_m [data_width=22 n_iter=18 angle_guard=3 frac_guard=3 rounding=round m=2] power_index=3.7, accuracy_bits=16.8, area_um2=53419, ffs=765, throughput_msps=59.9, max_abs_err=8.49e-06 (2^-16.85)
- pipelined_m [data_width=25 n_iter=24 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=5.45, accuracy_bits=21.2, area_um2=78623, ffs=1127, throughput_msps=52.7, max_abs_err=4.24e-07 (2^-21.17)
- pipelined_m [data_width=28 n_iter=29 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=7.04, accuracy_bits=23.4, area_um2=100664, ffs=1467, throughput_msps=51.2, max_abs_err=9.22e-08 (2^-23.37)
Front coverage: power_index 1.68..7.04 (HV reference 40); accuracy_bits 12.3..23.4 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 34 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 13.92 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 7.78 MSPS; best accuracy 14.17 bits
- pipelined: 61 evals, 21 feasible; max throughput seen 171 MSPS; best accuracy 21.29 bits; best feasible power_index=3.48; feasible ranges: data_width 16..25, n_iter 14..30, angle_guard -1..4, frac_guard 0..2
- pipelined_m: 272 evals, 95 feasible; max throughput seen 96.1 MSPS; best accuracy 23.37 bits; best feasible power_index=1.68; feasible ranges: data_width 15..28, n_iter 14..29, angle_guard -1..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 18995 in, 3577 out
- provider-reported cost: $0.0738
- full prompts and replies: `llm_trace.jsonl`

