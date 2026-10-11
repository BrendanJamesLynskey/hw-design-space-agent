# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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

Winner check (1 of 18 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on

## Pareto front (18 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=3` | 26576 | 323 | 54.3 | 7 | 1.68 | 0.000204 (2^-12.26) | 12.26 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=3` | 27017 | 328 | 51.9 | 7 | 1.71 | 0.000194 (2^-12.33) | 12.33 |
| 2 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 28058 | 323 | 54.3 | 7 | 1.73 | 0.000168 (2^-12.54) | 12.54 |
| 3 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=3` | 28525 | 328 | 51.9 | 7 | 1.75 | 0.000148 (2^-12.72) | 12.72 |
| 4 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=3` | 30327 | 338 | 51.9 | 7 | 1.83 | 0.00013 (2^-12.91) | 12.91 |
| 5 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 30392 | 348 | 51.9 | 7 | 1.86 | 0.000127 (2^-12.95) | 12.95 |
| 6 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=3` | 31356 | 350 | 51.9 | 7 | 1.9 | 0.000101 (2^-13.27) | 13.27 |
| 7 | `pipelined_m:data_width=18,n_iter=18,angle_guard=1,frac_guard=1,rounding=round,m=3` | 37582 | 413 | 51.9 | 8 | 2.26 | 6.95e-05 (2^-13.81) | 13.81 |
| 8 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=2` | 37714 | 547 | 72.3 | 10 | 2.63 | 6.45e-05 (2^-13.92) | 13.92 |
| 9 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=2` | 37910 | 562 | 72.3 | 10 | 2.68 | 6.44e-05 (2^-13.92) | 13.92 |
| 10 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=2` | 38925 | 564 | 72.3 | 10 | 2.72 | 5.25e-05 (2^-14.22) | 14.22 |
| 11 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=0,rounding=round,m=2` | 40272 | 600 | 66.8 | 10 | 2.85 | 3.91e-05 (2^-14.64) | 14.64 |
| 12 | `pipelined_m:data_width=24,n_iter=20,angle_guard=-2,frac_guard=2,rounding=trunc,m=2` | 57608 | 840 | 57.9 | 12 | 4.03 | 7.2e-06 (2^-17.08) | 17.08 |
| 13 | `pipelined_m:data_width=22,n_iter=26,angle_guard=4,frac_guard=2,rounding=trunc,m=2` | 75090 | 1075 | 57.9 | 15 | 5.2 | 3.45e-06 (2^-18.15) | 18.15 |
| 14 | `pipelined_m:data_width=25,n_iter=25,angle_guard=1,frac_guard=0,rounding=round,m=2` | 75058 | 1110 | 57.9 | 15 | 5.3 | 1.05e-06 (2^-19.86) | 19.86 |
| 15 | `pipelined_m:data_width=26,n_iter=26,angle_guard=0,frac_guard=1,rounding=round,m=2` | 82216 | 1163 | 56.1 | 15 | 5.65 | 6.05e-07 (2^-20.66) | 20.66 |
| 16 | `pipelined_m:data_width=24,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc,m=2` | 89906 | 1278 | 54.3 | 16 | 6.2 | 4.77e-07 (2^-21.00) | 21.00 |
| 17 | `pipelined_m:data_width=25,n_iter=27,angle_guard=2,frac_guard=4,rounding=trunc,m=2` | 89615 | 1308 | 52.7 | 16 | 6.27 | 3.45e-07 (2^-21.47) | 21.47 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Register, not throughput, is what we can afford here: the spec only needs 50 MSPS, and both pipelined and pipelined_m deliver 1 result/cycle, so any sky130 clock above ~50 MHz satisfies the throughput constraint and the search should spend its budget on the real trade-off, power_index vs accuracy_bits. The accuracy side is pinned by W and N (max_abs_err <= 2^-12 means W >= 14 is needed before anything else, since the output LSB is 2^-(W-2)); n_iter, angle_guard, frac_guard and rounding are all exposed because code computes the exact error and will find the cheapest combination that clears 2^-12. iterative is deliberately excluded: it needs ~N>=13 micro-rotations and N+3 cycles/result, so reaching 50 MSPS would demand a clock an order of magnitude beyond what these cells give, and no accuracy-feasible point exists in that branch. unrolled_k is kept only as a small high-k probe because its Fmax/(ceil(N/k)+3) throughput is borderline. Round 1 therefore weights pipelined_m highest (its m knob directly attacks min power_index), keeps pipelined as the guaranteed-feasible anchor, and leaves a small slice to test whether unrolled_k ever reaches the 50 MSPS floor. Ranges are kept moderately wide (W 13..20, N 10..20, guards -2..3 / 0..3) so the first round maps where the constraint boundaries actually fall before later rounds exploit them.*)
- `pipelined_m` (50 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Best power/accuracy lever for this spec: it still yields 1 result/cycle so throughput = Fmax and the 50 MSPS floor is essentially free in sky130, while the register-every-m-stages schedule lets the search trade Fmax (which we have plenty of headroom in) for far fewer flip-flops, which is exactly where the min power_index objective lives. m is given the full 2..8 range so the search can find the minimum-register point that still clears 50 MSPS.
- `pipelined` (30 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Safe reference family: one register per micro-rotation gives a very short critical path, so 50 MSPS is met with large margin, and it defines the fully-registered anchor of the area/power vs accuracy curve. Included so the front is not under-covered if the m>1 variants lose too much Fmax or do not actually save power.
- `unrolled_k` (20 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Only non-1-result/cycle family that could plausibly reach 50 MSPS: throughput = Fmax/(ceil(N/k)+3), so it needs a high Fmax with k=4..8 chained micro-rotations. It reuses one datapath so its area/FF count is low, which could be attractive for power if the long combinational path still clears 50 MSPS. Given the Fmax risk it gets the smallest share and k is restricted to the high end.

**Result (code):** 100 evaluations this round, 100 total; 21 feasible; hypervolume 80.28 (n/a).

**LLM decision:** `map_front` — The feasible front is real but narrow: 5 designs, all at data_width=18, spanning power_index 2.09..4.74 and accuracy_bits 12.8..14.1. Against the HV reference point (40, 12) this means the front covers only a small slice of both objective ranges — the power axis is empty from 4.74 up to 40, and accuracy is empty above 14.1 even though pipelined_m alone already reached 14.51 bits and data_width is free up to 28. Since HV is dominated by the top of the accuracy axis (power already reaches the reference), the biggest HV gain is extending accuracy upward while keeping power low, which requires exploring data_width > 18 — exactly the region the front never touched. The per-family feasible ranges (pipelined_m: data_width 16..19, n_iter 15..20, angle_guard -2..2, frac_guard 1..2, m 2..3; pipelined: data_width 17..18, n_iter 17, angle_guard 2, frac_guard 0..3) show the search so far clustered tightly, so a seeded NSGA-II over the full ranges of the two families already on the front is the right way to fill the curve. iterative is not worth adding: unrolled_k, which is strictly faster per result, topped out at 4.72 MSPS, so iterative (1 micro-rotation/cycle) cannot reach the 50 MSPS constraint. No infeasibility: 21 feasible designs exist and the 50 MSPS / 2^-12 constraints are both met, so the front is worth mapping rather than declaring infeasible.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 80.28 (gain this round: n/a (first round)).
Feasible designs: 21 of 100 evaluations (16 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 53% violate; best seen 180
- max_abs_err <= 0.000244141: 67% violate; best seen 4.27e-05 (2^-14.51)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc m=3] power_index=2.09, accuracy_bits=12.8, area_um2=32885, ffs=405, throughput_msps=51.9, max_abs_err=0.000136 (2^-12.84)
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=3] power_index=2.13, accuracy_bits=13, area_um2=33848, ffs=407, throughput_msps=51.9, max_abs_err=0.00012 (2^-13.03)
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=2 rounding=round m=2] power_index=2.62, accuracy_bits=13.3, area_um2=37670, ffs=545, throughput_msps=72.3, max_abs_err=0.000102 (2^-13.25)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=2.63, accuracy_bits=13.9, area_um2=37714, ffs=547, throughput_msps=72.3, max_abs_err=6.45e-05 (2^-13.92)
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] power_index=4.74, accuracy_bits=14.1, area_um2=53269, ffs=1141, throughput_msps=128, max_abs_err=5.51e-05 (2^-14.15)
Front coverage: power_index 2.09..4.74 (HV reference 40); accuracy_bits 12.8..14.1 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 4.72 MSPS; best accuracy 12.42 bits
- pipelined: 30 evals, 8 feasible; max throughput seen 180 MSPS; best accuracy 14.15 bits; best feasible power_index=4.37; feasible ranges: data_width 17..18, n_iter 17..17, angle_guard 2..2, frac_guard 0..3
- pipelined_m: 50 evals, 13 feasible; max throughput seen 82.5 MSPS; best accuracy 14.51 bits; best feasible power_index=2.09; feasible ranges: data_width 16..19, n_iter 15..20, angle_guard -2..2, frac_guard 1..2, m 2..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (80 evals): data_width=17..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (4 front designs; box front_anchored)
- `pipelined` (20 evals): data_width=17..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 69 feasible; hypervolume 335.7 (+318.2%).

**LLM decision:** `refine` — Round 2 leaves 200 evals. The feasible front is entirely pipelined_m and its low-power end (power_index 2.09, data_width=18, n_iter=16, m=3, throughput 51.9 MSPS, 12.8 bits) is both the selection target (min power_index) and the biggest HV contributor, since the HV reference power is 40 and every step to lower power adds a large dominated strip. The front also has gaps (2.63→4.03→6.01) and the low end sits at data_width=18 even though pipelined_m was feasible down to data_width=16, so the true low-power corner is likely under-sampled: smaller data_width / n_iter with minimal guards should trade accuracy down toward the 2^-12 floor while cutting power. iterative is almost certainly throughput-infeasible (1 result per N+3 cycles ⇒ needs ~950 MHz at N=16 for 50 MSPS), unrolled_k already showed 0 feasible (max 4.72 MSPS), and pipelined's best feasible power_index is 4.17 — none of these can beat 2.09, so no family change is warranted. Refining the low-power corner now, then reserving the final round for full-range front mapping, is the best use of the remaining budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 335.7 (gain this round: +318.2%).
Feasible designs: 69 of 200 evaluations (57 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 51% violate; best seen 180
- max_abs_err <= 0.000244141: 35% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc m=3] power_index=2.09, accuracy_bits=12.8, area_um2=32885, ffs=405, throughput_msps=51.9, max_abs_err=0.000136 (2^-12.84)
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=3] power_index=2.13, accuracy_bits=13, area_um2=33848, ffs=407, throughput_msps=51.9, max_abs_err=0.00012 (2^-13.03)
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=2 rounding=round m=2] power_index=2.62, accuracy_bits=13.3, area_um2=37670, ffs=545, throughput_msps=72.3, max_abs_err=0.000102 (2^-13.25)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=2.63, accuracy_bits=13.9, area_um2=37714, ffs=547, throughput_msps=72.3, max_abs_err=6.45e-05 (2^-13.92)
- pipelined_m [data_width=24 n_iter=20 angle_guard=-2 frac_guard=2 rounding=trunc m=2] power_index=4.03, accuracy_bits=17.1, area_um2=57608, ffs=840, throughput_msps=57.9, max_abs_err=7.2e-06 (2^-17.08)
- pipelined_m [data_width=24 n_iter=28 angle_guard=4 frac_guard=2 rounding=trunc m=2] power_index=6.01, accuracy_bits=19.8, area_um2=87007, ffs=1241, throughput_msps=54.3, max_abs_err=1.06e-06 (2^-19.85)
- pipelined_m [data_width=26 n_iter=27 angle_guard=-1 frac_guard=2 rounding=trunc m=2] power_index=6.03, accuracy_bits=19.9, area_um2=85866, ffs=1258, throughput_msps=54.3, max_abs_err=1.02e-06 (2^-19.90)
- pipelined_m [data_width=24 n_iter=27 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=6.07, accuracy_bits=20.4, area_um2=86662, ffs=1264, throughput_msps=54.3, max_abs_err=7.46e-07 (2^-20.35)
- pipelined_m [data_width=24 n_iter=28 angle_guard=3 frac_guard=4 rounding=trunc m=2] power_index=6.2, accuracy_bits=21, area_um2=89906, ffs=1278, throughput_msps=54.3, max_abs_err=4.77e-07 (2^-21.00)
- pipelined_m [data_width=25 n_iter=27 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=6.27, accuracy_bits=21.5, area_um2=89615, ffs=1308, throughput_msps=52.7, max_abs_err=3.45e-07 (2^-21.47)
Front coverage: power_index 2.09..6.27 (HV reference 40); accuracy_bits 12.8..21.5 (HV reference 12); data_width on the front 18..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 4.72 MSPS; best accuracy 12.42 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 180 MSPS; best accuracy 16.99 bits; best feasible power_index=4.17; feasible ranges: data_width 17..28, n_iter 16..26, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 130 evals, 42 feasible; max throughput seen 82.5 MSPS; best accuracy 24.51 bits; best feasible power_index=2.09; feasible ranges: data_width 16..26, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Target data_width 16..19 and n_iter 14..18 with minimal guards to find lower-power designs that still clear 12 accuracy bits; keep m in {2,3} because m=3 is already at the 50 MSPS edge and m>=4 would drop throughput below the constraint.*)
- `pipelined_m` (100 evals): data_width=16..19, n_iter=14..18, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=2..3. *Why:* Push the min-power corner below 2.09 while keeping max_abs_err <= 2^-12 and throughput >= 50 MSPS; m=3 is the throughput-limiting choice (51.9 MSPS) so keep m=2 as the higher-Fmax fallback.

**Result (code):** 100 evaluations this round, 300 total; 140 feasible; hypervolume 336.9 (+0.3%).

**LLM decision:** `map_front` — The front is entirely pipelined_m and is converging (+0.3% HV this round), but it is under-mapped at the high-accuracy end: accuracy_bits on the front span 12.3..21.5 while the best accuracy seen anywhere is 24.51 bits, and data_width on the front is 17..26 against a registry range of 8..28. Because the HV reference point is (power 40, accuracy 12), the hypervolume is dominated by the last staircase term (40 - p_max)*(a_max - 12) ≈ (40-6.27)*(21.5-12) ≈ 320 of the 336.9 total, so pushing a_max upward is by far the highest-leverage move; the low-power end (1.68) is already pinned against the 2^-12 accuracy constraint (12.3 bits) and contributes almost nothing to HV. Adding the unexplored `iterative` family is not warranted: it is strictly slower per result than `unrolled_k`, which over 20 evals produced 0 feasible designs and topped out at 4.72 MSPS, far below the 50 MSPS constraint. So the right use of the final 100-eval round is to map the whole front over the full ranges of the two families that actually reach it (pipelined, pipelined_m), seeded with the current front, to try to close the 21.5→24.5 accuracy gap with feasible designs and confirm whether the front is otherwise complete.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 336.9 (gain this round: +0.3%).
Feasible designs: 140 of 300 evaluations (110 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 38% violate; best seen 180
- max_abs_err <= 0.000244141: 29% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 19 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.68, accuracy_bits=12.3, area_um2=26576, ffs=323, throughput_msps=54.3, max_abs_err=0.000204 (2^-12.26)
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.73, accuracy_bits=12.5, area_um2=28058, ffs=323, throughput_msps=54.3, max_abs_err=0.000168 (2^-12.54)
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=1.83, accuracy_bits=12.9, area_um2=30327, ffs=338, throughput_msps=51.9, max_abs_err=0.00013 (2^-12.91)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.9, accuracy_bits=13.3, area_um2=31356, ffs=350, throughput_msps=51.9, max_abs_err=0.000101 (2^-13.27)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=2.63, accuracy_bits=13.9, area_um2=37714, ffs=547, throughput_msps=72.3, max_abs_err=6.45e-05 (2^-13.92)
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=2.9, accuracy_bits=14.1, area_um2=40768, ffs=611, throughput_msps=72.3, max_abs_err=5.64e-05 (2^-14.11)
- pipelined_m [data_width=24 n_iter=20 angle_guard=-2 frac_guard=2 rounding=trunc m=2] power_index=4.03, accuracy_bits=17.1, area_um2=57608, ffs=840, throughput_msps=57.9, max_abs_err=7.2e-06 (2^-17.08)
- pipelined_m [data_width=24 n_iter=28 angle_guard=4 frac_guard=2 rounding=trunc m=2] power_index=6.01, accuracy_bits=19.8, area_um2=87007, ffs=1241, throughput_msps=54.3, max_abs_err=1.06e-06 (2^-19.85)
- pipelined_m [data_width=24 n_iter=27 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=6.07, accuracy_bits=20.4, area_um2=86662, ffs=1264, throughput_msps=54.3, max_abs_err=7.46e-07 (2^-20.35)
- pipelined_m [data_width=25 n_iter=27 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=6.27, accuracy_bits=21.5, area_um2=89615, ffs=1308, throughput_msps=52.7, max_abs_err=3.45e-07 (2^-21.47)
Front coverage: power_index 1.68..6.27 (HV reference 40); accuracy_bits 12.3..21.5 (HV reference 12); data_width on the front 17..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 4.72 MSPS; best accuracy 12.42 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 180 MSPS; best accuracy 16.99 bits; best feasible power_index=4.17; feasible ranges: data_width 17..28, n_iter 16..26, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 230 evals, 113 feasible; max throughput seen 82.5 MSPS; best accuracy 24.51 bits; best feasible power_index=1.68; feasible ranges: data_width 16..26, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (19 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 179 feasible; hypervolume 338.9 (+0.6%).

**LLM decision:** `stop` — Budget is exhausted (400/400 evals, round 4 of 4), so no further exploration is possible. The run is feasible and the front is well mapped: 179 feasible designs (143 unique), 18 on the Pareto front, hypervolume 338.9 with only +0.6% gain this round (below the 0.01 eps threshold), i.e. converged. The selection rule (min power_index) is satisfied by pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] at power_index=1.68, accuracy_bits=12.3, throughput 54.3 MSPS >= 50 and max_abs_err 2.04e-4 <= 2.44e-4, so both constraints are met with margin. The front spans power_index 1.68..6.27 and accuracy_bits 12.3..21.5, covering the trade-off curve from the low-power corner to high accuracy, so no family (including the unexplored iterative, which cannot reach 50 MSPS at 1 result per N+3 cycles) is needed to improve the result.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 338.9 (gain this round: +0.6%).
Feasible designs: 179 of 400 evaluations (143 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 43% violate; best seen 180
- max_abs_err <= 0.000244141: 24% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.68, accuracy_bits=12.3, area_um2=26576, ffs=323, throughput_msps=54.3, max_abs_err=0.000204 (2^-12.26)
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.73, accuracy_bits=12.5, area_um2=28058, ffs=323, throughput_msps=54.3, max_abs_err=0.000168 (2^-12.54)
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=1.83, accuracy_bits=12.9, area_um2=30327, ffs=338, throughput_msps=51.9, max_abs_err=0.00013 (2^-12.91)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.9, accuracy_bits=13.3, area_um2=31356, ffs=350, throughput_msps=51.9, max_abs_err=0.000101 (2^-13.27)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=2.63, accuracy_bits=13.9, area_um2=37714, ffs=547, throughput_msps=72.3, max_abs_err=6.45e-05 (2^-13.92)
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=2] power_index=2.68, accuracy_bits=13.9, area_um2=37910, ffs=562, throughput_msps=72.3, max_abs_err=6.44e-05 (2^-13.92)
- pipelined_m [data_width=21 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.85, accuracy_bits=14.6, area_um2=40272, ffs=600, throughput_msps=66.8, max_abs_err=3.91e-05 (2^-14.64)
- pipelined_m [data_width=22 n_iter=26 angle_guard=4 frac_guard=2 rounding=trunc m=2] power_index=5.2, accuracy_bits=18.1, area_um2=75090, ffs=1075, throughput_msps=57.9, max_abs_err=3.45e-06 (2^-18.15)
- pipelined_m [data_width=26 n_iter=26 angle_guard=0 frac_guard=1 rounding=round m=2] power_index=5.65, accuracy_bits=20.7, area_um2=82216, ffs=1163, throughput_msps=56.1, max_abs_err=6.05e-07 (2^-20.66)
- pipelined_m [data_width=25 n_iter=27 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=6.27, accuracy_bits=21.5, area_um2=89615, ffs=1308, throughput_msps=52.7, max_abs_err=3.45e-07 (2^-21.47)
Front coverage: power_index 1.68..6.27 (HV reference 40); accuracy_bits 12.3..21.5 (HV reference 12); data_width on the front 17..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 4.72 MSPS; best accuracy 12.42 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 180 MSPS; best accuracy 16.99 bits; best feasible power_index=4.17; feasible ranges: data_width 17..28, n_iter 16..26, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 330 evals, 152 feasible; max throughput seen 82.5 MSPS; best accuracy 24.51 bits; best feasible power_index=1.68; feasible ranges: data_width 16..26, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 13601 in, 24085 out
- provider-reported cost: $0.0176
- full prompts and replies: `llm_trace.jsonl`

