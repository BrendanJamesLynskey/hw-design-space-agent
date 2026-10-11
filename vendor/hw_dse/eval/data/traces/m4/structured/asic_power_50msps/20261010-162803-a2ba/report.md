# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 27943 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7444 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 340 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 135 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.77 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000175 (2^-12.48) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.5 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.28e-05 (2^-14.21) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.46 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.2 dBc, SNR 82.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=3` | 27943 | 340 | 51.9 | 7 | 1.77 | 0.000175 (2^-12.48) | 12.48 |
| 1 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=3` | 29838 | 339 | 51.9 | 7 | 1.82 | 0.000175 (2^-12.48) | 12.48 |
| 2 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=3` | 29746 | 350 | 51.9 | 7 | 1.85 | 0.00016 (2^-12.61) | 12.61 |
| 3 | `pipelined_m:data_width=17,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=3` | 33792 | 381 | 54.3 | 8 | 2.06 | 0.000149 (2^-12.71) | 12.71 |
| 4 | `pipelined_m:data_width=17,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc,m=3` | 32797 | 401 | 51.9 | 8 | 2.08 | 0.000145 (2^-12.76) | 12.76 |
| 5 | `pipelined_m:data_width=17,n_iter=17,angle_guard=1,frac_guard=1,rounding=round,m=3` | 34258 | 393 | 54.3 | 8 | 2.1 | 0.000128 (2^-12.94) | 12.94 |
| 6 | `pipelined_m:data_width=17,n_iter=17,angle_guard=2,frac_guard=1,rounding=round,m=3` | 34798 | 399 | 51.9 | 8 | 2.13 | 9.28e-05 (2^-13.40) | 13.40 |
| 7 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=0,rounding=round,m=3` | 33486 | 415 | 51.9 | 8 | 2.14 | 7.72e-05 (2^-13.66) | 13.66 |
| 8 | `pipelined_m:data_width=17,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=3` | 35834 | 409 | 51.9 | 8 | 2.19 | 7.36e-05 (2^-13.73) | 13.73 |
| 9 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=3,rounding=round,m=2` | 40511 | 584 | 66.8 | 10 | 2.82 | 6.71e-05 (2^-13.86) | 13.86 |
| 10 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc,m=2` | 40054 | 590 | 66.8 | 10 | 2.82 | 5.06e-05 (2^-14.27) | 14.27 |
| 11 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=2` | 41935 | 626 | 72.3 | 11 | 2.98 | 4.73e-05 (2^-14.37) | 14.37 |
| 12 | `pipelined_m:data_width=21,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc,m=2` | 44778 | 685 | 66.8 | 11 | 3.22 | 2.41e-05 (2^-15.34) | 15.34 |
| 13 | `pipelined_m:data_width=20,n_iter=20,angle_guard=2,frac_guard=3,rounding=trunc,m=2` | 53167 | 771 | 64.3 | 12 | 3.71 | 1.16e-05 (2^-16.40) | 16.40 |
| 14 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=1,rounding=trunc,m=2` | 54045 | 788 | 64.3 | 12 | 3.78 | 6.93e-06 (2^-17.14) | 17.14 |
| 15 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=1,rounding=round,m=2` | 55213 | 790 | 64.3 | 12 | 3.82 | 5.57e-06 (2^-17.45) | 17.45 |
| 16 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=2,rounding=round,m=2` | 56577 | 808 | 62.0 | 12 | 3.91 | 4.59e-06 (2^-17.73) | 17.73 |
| 17 | `pipelined_m:data_width=24,n_iter=23,angle_guard=-1,frac_guard=1,rounding=trunc,m=2` | 66496 | 989 | 59.9 | 14 | 4.71 | 3.58e-06 (2^-18.09) | 18.09 |
| 18 | `pipelined_m:data_width=23,n_iter=24,angle_guard=2,frac_guard=1,rounding=trunc,m=2` | 68471 | 987 | 59.9 | 14 | 4.76 | 3.08e-06 (2^-18.31) | 18.31 |
| 19 | `pipelined_m:data_width=24,n_iter=24,angle_guard=0,frac_guard=1,rounding=round,m=2` | 70635 | 1003 | 59.9 | 14 | 4.87 | 2.24e-06 (2^-18.77) | 18.77 |
| 20 | `pipelined_m:data_width=24,n_iter=24,angle_guard=1,frac_guard=1,rounding=round,m=2` | 71484 | 1015 | 59.9 | 14 | 4.93 | 1.29e-06 (2^-19.57) | 19.57 |
| 21 | `pipelined_m:data_width=23,n_iter=24,angle_guard=2,frac_guard=3,rounding=round,m=2` | 73002 | 1032 | 57.9 | 14 | 5.02 | 1.08e-06 (2^-19.82) | 19.82 |
| 22 | `pipelined_m:data_width=23,n_iter=24,angle_guard=4,frac_guard=3,rounding=round,m=2` | 74701 | 1056 | 56.1 | 14 | 5.14 | 6.14e-07 (2^-20.64) | 20.64 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraint is throughput_msps >= 50, which forces 1 result/cycle (pipelined or pipelined_m) or a very high-Fmax unrolled_k. iterative is excluded because its 1-result-per-(N+3)-cycles throughput cannot plausibly reach 50 MSPS. The accuracy constraint max_abs_err <= 2^-12 is met by the accuracy-determining parameters (data_width, n_iter, angle_guard, frac_guard, rounding), which are identical across families, so I bound them to the 2^-12-feasible band (data_width 14-20, n_iter 12-20) to focus budget on the real trade-off: power_index vs accuracy_bits. The objective is min power_index with accuracy as the trade-off, and the selection rule is min power_index, so the front is dominated by the power axis; pipelined (best Fmax/latency) and pipelined_m (FF/power reduction) carry the most budget, with unrolled_k as a smaller probe for a potentially lower-power feasible point. Rounding is kept as a 2-choice factor since it shifts accuracy at no structural cost.*)
- `pipelined` (45 evals): data_width=14..20, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so they are the only families that can plausibly hit throughput_msps >= 50 at a reasonable Fmax. Full pipelining has the best Fmax (shortest combinational depth per stage) and the lowest latency, so it is the strongest candidate for the min-power corner once throughput is met. I bound data_width/n_iter to the region where max_abs_err <= 2^-12 is achievable without wasting budget on over-accurate or under-accurate corners.
- `pipelined_m` (35 evals): data_width=14..20, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m also gives 1 result/cycle (meets throughput) but registers every m stages, cutting FF count and area/power at the cost of a longer combinational path (lower Fmax) and higher latency. This is the key power-vs-Fmax trade-off family: for a battery design, a modest m may drop power_index below full pipelining while still clearing 50 MSPS. m capped at 4 to keep Fmax high enough for the throughput constraint.
- `unrolled_k` (20 evals): data_width=14..20, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k produces one result every ceil(N/k)+3 cycles, so it can only reach 50 MSPS if Fmax is very high (k*Fmax >= 50e6). It is a lower-FF, lower-area datapath than pipelined, so it may win on power_index if the Fmax headroom exists. I include it with a small share to confirm whether it is feasible at all and to capture any low-power point on the front; k is pushed high (4-8) to maximise results/cycle.

**Result (code):** 100 evaluations this round, 100 total; 54 feasible; hypervolume 158.1 (n/a).

**LLM decision:** `refine` — The current front is dominated by `pipelined_m` at the low-power end (1.77) and `pipelined` at the high-accuracy end (16.4 bits). `unrolled_k` is infeasible for throughput (max 5.34 MSPS). `iterative` is likely infeasible for throughput as well (1 result/cycle, low Fmax), so it is not worth exploring. The `pipelined` family shows a steep power penalty for accuracy (power jumps from ~4.3 to ~5.7 as accuracy goes from 14.1 to 16.4 bits), while `pipelined_m` is much more power-efficient but seems capped at lower accuracy/throughput. To improve hypervolume, we need to fill the gap between the `pipelined_m` and `pipelined` fronts, specifically in the region where `pipelined_m` might achieve higher accuracy (13-15 bits) or where `pipelined` might achieve lower power (by reducing data_width/n_iter while maintaining throughput). We will refine the search to focus on `pipelined_m` with slightly higher `n_iter`/`data_width` to push accuracy up, and `pipelined` with lower `data_width`/`n_iter` to push power down, ensuring we cover the middle of the trade-off curve better.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 158.1 (gain this round: n/a (first round)).
Feasible designs: 54 of 100 evaluations (46 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 30% violate; best seen 171
- max_abs_err <= 0.000244141: 26% violate; best seen 1.17e-05 (2^-16.38)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.77, accuracy_bits=12.5, area_um2=27943, ffs=340, throughput_msps=51.9, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=1.82, accuracy_bits=12.5, area_um2=29838, ffs=339, throughput_msps=51.9, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=17 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=2.06, accuracy_bits=12.7, area_um2=33792, ffs=381, throughput_msps=54.3, max_abs_err=0.000149 (2^-12.71)
- pipelined_m [data_width=18 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=2.95, accuracy_bits=13.9, area_um2=42027, ffs=615, throughput_msps=72.3, max_abs_err=6.72e-05 (2^-13.86)
- pipelined_m [data_width=18 n_iter=18 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=2.98, accuracy_bits=14, area_um2=42991, ffs=617, throughput_msps=72.3, max_abs_err=5.94e-05 (2^-14.04)
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] power_index=4.3, accuracy_bits=14.1, area_um2=48089, ffs=1038, throughput_msps=128, max_abs_err=5.75e-05 (2^-14.09)
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] power_index=4.45, accuracy_bits=14.3, area_um2=50482, ffs=1068, throughput_msps=128, max_abs_err=4.95e-05 (2^-14.30)
- pipelined [data_width=20 n_iter=19 angle_guard=1 frac_guard=1 rounding=trunc] power_index=5.41, accuracy_bits=15.1, area_um2=60805, ffs=1304, throughput_msps=128, max_abs_err=2.8e-05 (2^-15.12)
- pipelined [data_width=20 n_iter=19 angle_guard=1 frac_guard=2 rounding=round] power_index=5.59, accuracy_bits=16, area_um2=63533, ffs=1339, throughput_msps=123, max_abs_err=1.57e-05 (2^-15.96)
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] power_index=5.67, accuracy_bits=16.4, area_um2=64407, ffs=1358, throughput_msps=123, max_abs_err=1.17e-05 (2^-16.38)
Front coverage: power_index 1.77..5.67 (HV reference 40); accuracy_bits 12.5..16.4 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.34 MSPS; best accuracy 13.82 bits
- pipelined: 45 evals, 33 feasible; max throughput seen 171 MSPS; best accuracy 16.38 bits; best feasible power_index=3.38; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 35 evals, 21 feasible; max throughput seen 91.1 MSPS; best accuracy 15.36 bits; best feasible power_index=1.77; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 0..1, frac_guard 0..2, m 2..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine to fill the gap in the Pareto front between the efficient pipelined_m and the high-accuracy pipelined designs.*)
- `pipelined_m` (50 evals): data_width=17..20, n_iter=14..22, angle_guard=0..2, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Expand pipelined_m to higher accuracy (up to 15+ bits) by increasing n_iter and data_width, and test m=4 to see if it helps power/throughput trade-off.
- `pipelined` (50 evals): data_width=14..19, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Explore lower power region of pipelined by reducing data_width and n_iter, ensuring throughput >= 50 MSPS is still met.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 200 total; 119 feasible; hypervolume 159.7 (+1.0%).

**LLM decision:** `refine` — The `unrolled_k` family is definitively infeasible for the throughput constraint (max 5.34 MSPS vs 50 MSPS required) and should be excluded. The `iterative` family is also infeasible for throughput (1 result per cycle max ~100-200 MHz = 100-200 MSPS, but typically lower Fmax due to long combinational paths, and usually lower throughput than pipelined for same accuracy/area trade-offs, plus it was not explored but `pipelined`/`pipelined_m` already dominate the feasible space with much better power indices). The current Pareto front is dominated by `pipelined_m` (best power 1.77) and `pipelined` (best accuracy 16.4 bits). The front currently spans power_index 1.77..5.67 and accuracy_bits 12.5..16.4. To maximize hypervolume, we need to fill the gap between the low-power/low-accuracy corner and the high-accuracy/high-power corner, and potentially push accuracy higher if power allows, or power lower if accuracy allows. The `pipelined_m` family with m=2 or 3 seems most efficient. We should focus the search on `pipelined_m` and `pipelined` with tighter ranges around the observed feasible regions to densify the front. Specifically, `pipelined_m` with m=3 gave the best power (1.77) at 12.5 bits. `pipelined` gave the best accuracy (16.4 bits) at 5.67 power. We need to explore the intermediate trade-offs more densely. I will narrow the ranges for `pipelined_m` and `pipelined` to focus on the transition zone and ensure we capture the full curve.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 159.7 (gain this round: +1.0%).
Feasible designs: 119 of 200 evaluations (86 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 26% violate; best seen 171
- max_abs_err <= 0.000244141: 20% violate; best seen 1.17e-05 (2^-16.38)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.77, accuracy_bits=12.5, area_um2=27943, ffs=340, throughput_msps=51.9, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.85, accuracy_bits=12.6, area_um2=29746, ffs=350, throughput_msps=51.9, max_abs_err=0.00016 (2^-12.61)
- pipelined_m [data_width=17 n_iter=17 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.1, accuracy_bits=12.9, area_um2=34258, ffs=393, throughput_msps=54.3, max_abs_err=0.000128 (2^-12.94)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.13, accuracy_bits=13.4, area_um2=34798, ffs=399, throughput_msps=51.9, max_abs_err=9.28e-05 (2^-13.40)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.19, accuracy_bits=13.7, area_um2=35834, ffs=409, throughput_msps=51.9, max_abs_err=7.36e-05 (2^-13.73)
- pipelined_m [data_width=18 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=2.95, accuracy_bits=13.9, area_um2=42027, ffs=615, throughput_msps=72.3, max_abs_err=6.72e-05 (2^-13.86)
- pipelined_m [data_width=19 n_iter=21 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=3.64, accuracy_bits=14.8, area_um2=51744, ffs=762, throughput_msps=72.3, max_abs_err=3.6e-05 (2^-14.76)
- pipelined_m [data_width=19 n_iter=21 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=3.7, accuracy_bits=14.8, area_um2=52188, ffs=780, throughput_msps=69.4, max_abs_err=3.5e-05 (2^-14.80)
- pipelined [data_width=20 n_iter=19 angle_guard=1 frac_guard=1 rounding=trunc] power_index=5.41, accuracy_bits=15.1, area_um2=60805, ffs=1304, throughput_msps=128, max_abs_err=2.8e-05 (2^-15.12)
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] power_index=5.67, accuracy_bits=16.4, area_um2=64407, ffs=1358, throughput_msps=123, max_abs_err=1.17e-05 (2^-16.38)
Front coverage: power_index 1.77..5.67 (HV reference 40); accuracy_bits 12.5..16.4 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.34 MSPS; best accuracy 13.82 bits
- pipelined: 95 evals, 71 feasible; max throughput seen 171 MSPS; best accuracy 16.38 bits; best feasible power_index=3.38; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 85 evals, 48 feasible; max throughput seen 91.1 MSPS; best accuracy 15.86 bits; best feasible power_index=1.77; feasible ranges: data_width 16..20, n_iter 14..21, angle_guard 0..2, frac_guard 0..3, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focus on the two feasible families to densify the Pareto front between the low-power and high-accuracy extremes. Exclude infeasible families.*)
- `pipelined_m` (24 evals): data_width=16..20, n_iter=14..22, angle_guard=0..2, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Dominates the low-power end of the front (1.77). m=2..4 covers the latency/throughput trade-off. Tightening ranges focuses budget on the feasible region.
- `pipelined` (16 evals): data_width=16..22, n_iter=14..22, angle_guard=0..2, frac_guard=0..3, rounding=trunc|round. *Why:* Dominates the high-accuracy end of the front (16.4 bits). Extending data_width/n_iter slightly to see if higher accuracy is possible without excessive power increase.

**Result (code):** 40 evaluations this round, 240 total; 148 feasible; hypervolume 163.1 (+2.1%).

**LLM decision:** `stop` — The Pareto front is well-established and feasible. The minimum power_index achieved is 1.77 (pipelined_m, data_width=18, n_iter=14, m=3), which comfortably satisfies the throughput constraint (51.9 MSPS >= 50) and the accuracy constraint (12.5 bits > 12 bits required). The front spans a wide range of accuracy (12.5 to 16.4 bits) and power (1.77 to 3.71), covering the trade-off space effectively. Since this is the final round, and the front already contains the design that minimizes power_index (the selection rule), further exploration would not change the final selection. The 'iterative' family was not explored, but it is known to have low throughput (1 result every N+3 cycles), making it impossible to meet the 50 MSPS constraint without extremely high Fmax or very small N, which would likely violate accuracy or result in higher power due to the need for wider datapaths or higher clock speeds. Thus, the current front is sufficient and optimal for the selection rule.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 163.1 (gain this round: +2.1%).
Feasible designs: 148 of 240 evaluations (110 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 24% violate; best seen 171
- max_abs_err <= 0.000244141: 19% violate; best seen 1.16e-05 (2^-16.40)

Pareto front (feasible, 14 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.77, accuracy_bits=12.5, area_um2=27943, ffs=340, throughput_msps=51.9, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=1.82, accuracy_bits=12.5, area_um2=29838, ffs=339, throughput_msps=51.9, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=17 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=2.06, accuracy_bits=12.7, area_um2=33792, ffs=381, throughput_msps=54.3, max_abs_err=0.000149 (2^-12.71)
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=2.08, accuracy_bits=12.8, area_um2=32797, ffs=401, throughput_msps=51.9, max_abs_err=0.000145 (2^-12.76)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.13, accuracy_bits=13.4, area_um2=34798, ffs=399, throughput_msps=51.9, max_abs_err=9.28e-05 (2^-13.40)
- pipelined_m [data_width=19 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=3] power_index=2.14, accuracy_bits=13.7, area_um2=33486, ffs=415, throughput_msps=51.9, max_abs_err=7.72e-05 (2^-13.66)
- pipelined_m [data_width=19 n_iter=16 angle_guard=0 frac_guard=3 rounding=round m=2] power_index=2.82, accuracy_bits=13.9, area_um2=40511, ffs=584, throughput_msps=66.8, max_abs_err=6.71e-05 (2^-13.86)
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc m=2] power_index=2.82, accuracy_bits=14.3, area_um2=40054, ffs=590, throughput_msps=66.8, max_abs_err=5.06e-05 (2^-14.27)
- pipelined_m [data_width=19 n_iter=20 angle_guard=1 frac_guard=3 rounding=trunc m=2] power_index=3.51, accuracy_bits=14.9, area_um2=50308, ffs=729, throughput_msps=66.8, max_abs_err=3.21e-05 (2^-14.93)
- pipelined_m [data_width=20 n_iter=20 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=3.71, accuracy_bits=16.4, area_um2=53167, ffs=771, throughput_msps=64.3, max_abs_err=1.16e-05 (2^-16.40)
Front coverage: power_index 1.77..3.71 (HV reference 40); accuracy_bits 12.5..16.4 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.34 MSPS; best accuracy 13.82 bits
- pipelined: 111 evals, 83 feasible; max throughput seen 171 MSPS; best accuracy 16.38 bits; best feasible power_index=3.38; feasible ranges: data_width 16..20, n_iter 14..22, angle_guard 0..2, frac_guard 0..3
- pipelined_m: 109 evals, 65 feasible; max throughput seen 91.1 MSPS; best accuracy 16.40 bits; best feasible power_index=1.77; feasible ranges: data_width 16..20, n_iter 14..22, angle_guard 0..2, frac_guard 0..3, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (14 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 205 feasible; hypervolume 313.6 (+92.3%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established and feasible. The minimum power_index achieved is 1.77 (pipelined_m, data_width=18, n_iter=14, m=3), which comfortably satisfies the throughput constraint (51.9 MSPS >= 50) and the accuracy constraint (12.5 bits > 12 bits required). The front spans a wide range of accuracy (12.5 to 16.4 bits) and power (1.77 to 3.71), covering the trade-off space effectively. Since this is the final round, and the front already contains the design that minimizes power_index (the selection rule), further exploration would not change the final selection. The 'iterative' family was not explored, but it is known to have low throughput (1 result every N+3 cycles), making it impossible to meet the 50 MSPS constraint without extremely high Fmax or very small N, which would likely violate accuracy or result in higher power due to the need for wider datapaths or higher clock speeds. Thus, the current front is sufficient and optimal for the selection rule.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 313.6 (gain this round: +92.3%).
Feasible designs: 205 of 400 evaluations (164 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 39% violate; best seen 171
- max_abs_err <= 0.000244141: 15% violate; best seen 3.07e-08 (2^-24.96)

Pareto front (feasible, 23 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.77, accuracy_bits=12.5, area_um2=27943, ffs=340, throughput_msps=51.9, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.85, accuracy_bits=12.6, area_um2=29746, ffs=350, throughput_msps=51.9, max_abs_err=0.00016 (2^-12.61)
- pipelined_m [data_width=17 n_iter=17 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.1, accuracy_bits=12.9, area_um2=34258, ffs=393, throughput_msps=54.3, max_abs_err=0.000128 (2^-12.94)
- pipelined_m [data_width=19 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=3] power_index=2.14, accuracy_bits=13.7, area_um2=33486, ffs=415, throughput_msps=51.9, max_abs_err=7.72e-05 (2^-13.66)
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc m=2] power_index=2.82, accuracy_bits=14.3, area_um2=40054, ffs=590, throughput_msps=66.8, max_abs_err=5.06e-05 (2^-14.27)
- pipelined_m [data_width=21 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc m=2] power_index=3.22, accuracy_bits=15.3, area_um2=44778, ffs=685, throughput_msps=66.8, max_abs_err=2.41e-05 (2^-15.34)
- pipelined_m [data_width=22 n_iter=20 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=3.82, accuracy_bits=17.5, area_um2=55213, ffs=790, throughput_msps=64.3, max_abs_err=5.57e-06 (2^-17.45)
- pipelined_m [data_width=24 n_iter=23 angle_guard=-1 frac_guard=1 rounding=trunc m=2] power_index=4.71, accuracy_bits=18.1, area_um2=66496, ffs=989, throughput_msps=59.9, max_abs_err=3.58e-06 (2^-18.09)
- pipelined_m [data_width=24 n_iter=24 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=4.93, accuracy_bits=19.6, area_um2=71484, ffs=1015, throughput_msps=59.9, max_abs_err=1.29e-06 (2^-19.57)
- pipelined_m [data_width=23 n_iter=24 angle_guard=4 frac_guard=3 rounding=round m=2] power_index=5.14, accuracy_bits=20.6, area_um2=74701, ffs=1056, throughput_msps=56.1, max_abs_err=6.14e-07 (2^-20.64)
Front coverage: power_index 1.77..5.14 (HV reference 40); accuracy_bits 12.5..20.6 (HV reference 12); data_width on the front 17..24 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.34 MSPS; best accuracy 13.82 bits
- pipelined: 111 evals, 83 feasible; max throughput seen 171 MSPS; best accuracy 16.38 bits; best feasible power_index=3.38; feasible ranges: data_width 16..20, n_iter 14..22, angle_guard 0..2, frac_guard 0..3
- pipelined_m: 269 evals, 122 feasible; max throughput seen 91.1 MSPS; best accuracy 24.96 bits; best feasible power_index=1.77; feasible ranges: data_width 16..25, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10779 in, 3672 out
- provider-reported cost: $0.0101
- full prompts and replies: `llm_trace.jsonl`

