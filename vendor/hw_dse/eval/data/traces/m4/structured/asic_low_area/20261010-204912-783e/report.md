# DSE run: asic_low_area

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_low_area: Motor-control sin/cos in sky130 standard cells: >= 1 MSPS, max error <= 2^-10. Area is everything: minimise cell area.
  target: asic-sky130hd
  constraint: throughput_msps >= 1
  constraint: max_abs_err <= 0.000976562
  objective: min area_um2 (HV ref 40000)
  objective: max accuracy_bits (HV ref 10)
  select: min area_um2
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`iterative:data_width=15,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 6933 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1847 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 100 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 8.84 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 113 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.154 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000673 (2^-10.54) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 5.51 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000177 (2^-12.46) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.45 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.5 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 16 cycle(s). DDS tone from its exact outputs: SFDR 83.9 dBc, SNR 72.4 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (38 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` | 6933 | 100 | 8.8 | 16 | 0.154 | 0.000673 (2^-10.54) | 10.54 |
| 1 | `iterative:data_width=15,n_iter=13,angle_guard=2,frac_guard=0,rounding=round` | 6997 | 101 | 8.5 | 16 | 0.155 | 0.000642 (2^-10.61) | 10.61 |
| 2 | `iterative:data_width=15,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 7206 | 102 | 7.4 | 19 | 0.188 | 0.000594 (2^-10.72) | 10.72 |
| 3 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 7269 | 103 | 7.2 | 19 | 0.19 | 0.000567 (2^-10.78) | 10.78 |
| 4 | `iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc` | 7405 | 104 | 8.0 | 17 | 0.172 | 0.000462 (2^-11.08) | 11.08 |
| 5 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc` | 7576 | 108 | 7.7 | 17 | 0.178 | 0.000338 (2^-11.53) | 11.53 |
| 6 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc` | 7860 | 111 | 7.7 | 17 | 0.183 | 0.00027 (2^-11.85) | 11.85 |
| 7 | `iterative:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc` | 7904 | 113 | 7.7 | 17 | 0.186 | 0.000248 (2^-11.98) | 11.98 |
| 8 | `iterative:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc` | 7967 | 114 | 7.4 | 17 | 0.187 | 0.000235 (2^-12.06) | 12.06 |
| 9 | `iterative:data_width=16,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc` | 8042 | 111 | 6.5 | 20 | 0.218 | 0.00023 (2^-12.08) | 12.08 |
| 10 | `iterative:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=trunc` | 8147 | 117 | 6.8 | 18 | 0.204 | 0.000194 (2^-12.33) | 12.33 |
| 11 | `iterative:data_width=16,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 8302 | 113 | 6.6 | 19 | 0.212 | 0.000175 (2^-12.48) | 12.48 |
| 12 | `iterative:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 8317 | 117 | 6.8 | 18 | 0.205 | 0.000109 (2^-13.17) | 13.17 |
| 13 | `iterative:data_width=18,n_iter=18,angle_guard=2,frac_guard=0,rounding=round` | 8562 | 118 | 5.8 | 21 | 0.244 | 7.75e-05 (2^-13.65) | 13.65 |
| 14 | `iterative:data_width=19,n_iter=25,angle_guard=3,frac_guard=0,rounding=round` | 9223 | 125 | 4.1 | 28 | 0.346 | 3.74e-05 (2^-14.71) | 14.71 |
| 15 | `iterative:data_width=21,n_iter=23,angle_guard=2,frac_guard=0,rounding=trunc` | 9858 | 135 | 4.2 | 26 | 0.346 | 2.36e-05 (2^-15.37) | 15.37 |
| 16 | `iterative:data_width=19,n_iter=23,angle_guard=2,frac_guard=3,rounding=trunc` | 10038 | 130 | 4.4 | 26 | 0.342 | 2.18e-05 (2^-15.49) | 15.49 |
| 17 | `iterative:data_width=21,n_iter=26,angle_guard=1,frac_guard=0,rounding=round` | 10098 | 134 | 3.9 | 29 | 0.388 | 1.21e-05 (2^-16.34) | 16.34 |
| 18 | `iterative:data_width=21,n_iter=20,angle_guard=1,frac_guard=2,rounding=trunc` | 10437 | 138 | 4.8 | 23 | 0.318 | 9.95e-06 (2^-16.62) | 16.62 |
| 19 | `iterative:data_width=20,n_iter=20,angle_guard=3,frac_guard=3,rounding=trunc` | 10456 | 137 | 4.8 | 23 | 0.317 | 9.41e-06 (2^-16.70) | 16.70 |
| 20 | `iterative:data_width=20,n_iter=20,angle_guard=3,frac_guard=4,rounding=trunc` | 10814 | 139 | 4.6 | 23 | 0.324 | 8.14e-06 (2^-16.91) | 16.91 |
| 21 | `iterative:data_width=20,n_iter=23,angle_guard=3,frac_guard=4,rounding=trunc` | 10996 | 139 | 4.1 | 26 | 0.369 | 7.39e-06 (2^-17.05) | 17.05 |
| 22 | `iterative:data_width=21,n_iter=27,angle_guard=3,frac_guard=3,rounding=trunc` | 11175 | 142 | 3.6 | 30 | 0.435 | 5.44e-06 (2^-17.49) | 17.49 |
| 23 | `iterative:data_width=21,n_iter=22,angle_guard=2,frac_guard=4,rounding=trunc` | 11372 | 143 | 4.2 | 25 | 0.367 | 4.92e-06 (2^-17.63) | 17.63 |
| 24 | `iterative:data_width=25,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 11701 | 155 | 4.6 | 22 | 0.342 | 4.46e-06 (2^-17.77) | 17.77 |
| 25 | `iterative:data_width=24,n_iter=28,angle_guard=3,frac_guard=0,rounding=round` | 11824 | 152 | 3.2 | 31 | 0.478 | 1.62e-06 (2^-19.24) | 19.24 |
| 26 | `iterative:data_width=25,n_iter=22,angle_guard=4,frac_guard=0,rounding=trunc` | 11927 | 159 | 3.7 | 25 | 0.396 | 1.51e-06 (2^-19.34) | 19.34 |
| 27 | `iterative:data_width=25,n_iter=23,angle_guard=3,frac_guard=1,rounding=trunc` | 12318 | 160 | 3.7 | 26 | 0.42 | 8.19e-07 (2^-20.22) | 20.22 |
| 28 | `iterative:data_width=25,n_iter=23,angle_guard=4,frac_guard=1,rounding=trunc` | 12382 | 161 | 3.6 | 26 | 0.422 | 7.81e-07 (2^-20.29) | 20.29 |
| 29 | `iterative:data_width=26,n_iter=24,angle_guard=3,frac_guard=1,rounding=trunc` | 12892 | 165 | 3.4 | 27 | 0.453 | 4.63e-07 (2^-21.04) | 21.04 |
| 30 | `iterative:data_width=27,n_iter=24,angle_guard=3,frac_guard=1,rounding=trunc` | 13405 | 171 | 3.3 | 27 | 0.469 | 2.74e-07 (2^-21.80) | 21.80 |
| 31 | `iterative:data_width=26,n_iter=24,angle_guard=2,frac_guard=3,rounding=trunc` | 13640 | 169 | 3.4 | 27 | 0.47 | 2.59e-07 (2^-21.88) | 21.88 |
| 32 | `iterative:data_width=26,n_iter=24,angle_guard=3,frac_guard=3,rounding=trunc` | 13703 | 170 | 3.4 | 27 | 0.473 | 2.48e-07 (2^-21.94) | 21.94 |
| 33 | `iterative:data_width=28,n_iter=24,angle_guard=2,frac_guard=1,rounding=trunc` | 13854 | 175 | 3.3 | 27 | 0.483 | 1.87e-07 (2^-22.35) | 22.35 |
| 34 | `iterative:data_width=28,n_iter=26,angle_guard=2,frac_guard=0,rounding=round` | 13885 | 173 | 3.1 | 29 | 0.516 | 1.17e-07 (2^-23.03) | 23.03 |
| 35 | `iterative:data_width=27,n_iter=28,angle_guard=3,frac_guard=3,rounding=trunc` | 14532 | 175 | 2.9 | 31 | 0.567 | 8.12e-08 (2^-23.55) | 23.55 |
| 36 | `iterative:data_width=27,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc` | 14986 | 177 | 2.8 | 31 | 0.579 | 6.51e-08 (2^-23.87) | 23.87 |
| 37 | `iterative:data_width=28,n_iter=28,angle_guard=3,frac_guard=3,rounding=trunc` | 15093 | 181 | 2.8 | 31 | 0.587 | 4.18e-08 (2^-24.51) | 24.51 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Area is the main objective and only 1 MSPS is required, so the iterative family is the most likely to win and gets most of the budget. Unrolled_k and a small pipelined_m share serve as hedges and give a view of the front at higher accuracy. Ranges are narrowed to data widths 10-16 and 8-16 iterations, the region that can reach max error <= 2^-10 without wasting evaluations. Later rounds will narrow the ranges around whichever family wins on the results.*)
- `iterative` (63 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* A shared single datapath should give the smallest area, and one result per N+3 cycles should still clear 1 MSPS at a modest clock. Error <= 2^-10 needs roughly 11-12 bit outputs and about 10-12 iterations, so I focus the ranges there.
- `unrolled_k` (25 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* A small k adds datapath area but cuts the cycle count. It is a secondary candidate in case the iterative design has trouble meeting throughput, and it also covers the higher-accuracy side of the front.
- `pipelined_m` (12 evals): data_width=10..14, n_iter=8..14, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=4..8. *Why:* A coarse-grained pipeline has fewer registers than a full pipeline, so it is a low-cost probe of whether it can compete on area. Its throughput is far above what the spec needs, so it is unlikely to win but worth a small sample.

**Result (code):** 100 evaluations this round, 100 total; 26 feasible; hypervolume 5.899e+04 (n/a).

**LLM decision:** `refine` — The front is all iterative at data_width=15, area 6933..7886 um2, accuracy 10.5..11.8 bits. Throughput is not binding (best feasible is about 7-9 MSPS against a 1 MSPS limit). Area is the objective, so the iterative family with a small data_width and the minimum n_iter that still meets 2^-10 is the target. Feasible iterative designs reach data_width 13..15, so 12..16 is worth testing. Unrolled_k (10318 um2 best) is dominated and pipelined_m had no feasible designs, so both get dropped. Pipelined needs one stage per iteration, which is more area, so it is unlikely to help. A small share of budget goes to unrolled_k as a sanity check. Later rounds can map the accuracy end of the front.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5.899e+04 (gain this round: n/a (first round)).
Feasible designs: 26 of 100 evaluations (21 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 47
- max_abs_err <= 0.000976562: 74% violate; best seen 0.000278 (2^-11.81)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=6933, accuracy_bits=10.5, ffs=100, throughput_msps=8.84, max_abs_err=0.000673 (2^-10.54), power_index=0.154
- iterative [data_width=15 n_iter=13 angle_guard=2 frac_guard=0 rounding=round] area_um2=6997, accuracy_bits=10.6, ffs=101, throughput_msps=8.5, max_abs_err=0.000642 (2^-10.61), power_index=0.155
- iterative [data_width=15 n_iter=13 angle_guard=1 frac_guard=3 rounding=trunc] area_um2=7605, accuracy_bits=11, ffs=106, throughput_msps=8.18, max_abs_err=0.000503 (2^-10.96), power_index=0.166
- iterative [data_width=15 n_iter=13 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7668, accuracy_bits=11.2, ffs=107, throughput_msps=8.18, max_abs_err=0.000426 (2^-11.20), power_index=0.168
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7886, accuracy_bits=11.8, ffs=107, throughput_msps=6.89, max_abs_err=0.000278 (2^-11.81), power_index=0.202
Front coverage: area_um2 6933..7886 (HV reference 40000); accuracy_bits 10.5..11.8 (HV reference 10); data_width on the front 15..15 (registry 8..28).

Per family:
- iterative: 63 evals, 20 feasible; max throughput seen 14.6 MSPS; best accuracy 11.81 bits; best feasible area_um2=6933; feasible ranges: data_width 13..15, n_iter 13..16, angle_guard 0..3, frac_guard 0..3
- unrolled_k: 25 evals, 6 feasible; max throughput seen 10.7 MSPS; best accuracy 11.38 bits; best feasible area_um2=10318; feasible ranges: data_width 14..15, n_iter 12..15, angle_guard 2..3, frac_guard 1..3, k 2..3
- pipelined_m: 12 evals, 0 feasible; max throughput seen 47 MSPS; best accuracy 7.84 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the iterative family near its feasible region with slightly wider data_width and n_iter bounds, and keep a minimal unrolled_k probe.*)
- `iterative` (84 evals): data_width=12..16, n_iter=10..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* All 5 front points are iterative at W=15. Probing W=12..16 and n_iter 10..17 looks for lower-area designs that still meet 2^-10 and for higher-accuracy points.
- `unrolled_k` (16 evals): data_width=13..16, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* Best feasible area is 10318 um2, well above iterative. This is a small check that it stays dominated.

**Result (code):** 100 evaluations this round, 200 total; 85 feasible; hypervolume 1.116e+05 (+89.3%).

**LLM decision:** `refine` — The front has 10 feasible designs, all iterative, with area 6933..10014 um2 and accuracy 10.5..13.5 bits. Throughput is not binding: the best feasible design reaches 8.84 MSPS against a 1 MSPS requirement. Error is the binding constraint, with 57% of evaluations violating it. The feasible region sits at data_width 13..16 and n_iter 12..17, and the front's minimum-area end is data_width 15, n_iter 13. unrolled_k is dominated, with a best area of 10276 against 6933 for iterative. pipelined_m had 0 feasible designs, and pipelined would be larger still with no throughput benefit, so neither is worth further budget. The next round should concentrate on iterative around the low-area, low-accuracy corner (data_width 12..17, n_iter 10..18), and try frac_guard and angle_guard variants and rounding trunc against round. The goal is to find a smaller area at about 10 bits, and to fill the front between 10.5 and 13.5 bits. A small share goes to unrolled_k to confirm it is dominated.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.116e+05 (gain this round: +89.3%).
Feasible designs: 85 of 200 evaluations (66 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 47
- max_abs_err <= 0.000976562: 57% violate; best seen 8.59e-05 (2^-13.51)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=6933, accuracy_bits=10.5, ffs=100, throughput_msps=8.84, max_abs_err=0.000673 (2^-10.54), power_index=0.154
- iterative [data_width=15 n_iter=13 angle_guard=2 frac_guard=0 rounding=round] area_um2=6997, accuracy_bits=10.6, ffs=101, throughput_msps=8.5, max_abs_err=0.000642 (2^-10.61), power_index=0.155
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=7576, accuracy_bits=11.5, ffs=108, throughput_msps=7.7, max_abs_err=0.000338 (2^-11.53), power_index=0.178
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=7860, accuracy_bits=11.9, ffs=111, throughput_msps=7.7, max_abs_err=0.00027 (2^-11.85), power_index=0.183
- iterative [data_width=16 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=8042, accuracy_bits=12.1, ffs=111, throughput_msps=6.55, max_abs_err=0.00023 (2^-12.08), power_index=0.218
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=8302, accuracy_bits=12.5, ffs=113, throughput_msps=6.64, max_abs_err=0.000175 (2^-12.48), power_index=0.212
- iterative [data_width=16 n_iter=17 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8490, accuracy_bits=12.8, ffs=115, throughput_msps=6.31, max_abs_err=0.000142 (2^-12.78), power_index=0.228
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=9506, accuracy_bits=12.9, ffs=111, throughput_msps=6.89, max_abs_err=0.000134 (2^-12.86), power_index=0.223
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] area_um2=9815, accuracy_bits=13.1, ffs=113, throughput_msps=6.64, max_abs_err=0.000114 (2^-13.09), power_index=0.229
- iterative [data_width=16 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] area_um2=10014, accuracy_bits=13.5, ffs=115, throughput_msps=6.31, max_abs_err=8.59e-05 (2^-13.51), power_index=0.246
Front coverage: area_um2 6933..10014 (HV reference 40000); accuracy_bits 10.5..13.5 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 147 evals, 74 feasible; max throughput seen 14.6 MSPS; best accuracy 13.51 bits; best feasible area_um2=6933; feasible ranges: data_width 13..16, n_iter 12..17, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 41 evals, 11 feasible; max throughput seen 10.7 MSPS; best accuracy 11.38 bits; best feasible area_um2=10276; feasible ranges: data_width 13..15, n_iter 12..15, angle_guard 0..3, frac_guard 1..3, k 2..3
- pipelined_m: 12 evals, 0 feasible; max throughput seen 47 MSPS; best accuracy 7.84 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Exploit the iterative family near the error constraint boundary to push minimum area down. Keep a small probe of unrolled_k only to confirm it stays dominated.*)
- `iterative` (34 evals): data_width=12..17, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* All front designs are iterative. Searching around the 2^-10 error boundary at lower data_width and n_iter should reduce area and fill in the front.
- `unrolled_k` (6 evals): data_width=13..16, n_iter=12..16, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..3. *Why:* A small probe on the feasible region of unrolled_k to check whether it can ever beat iterative on area.

**Result (code):** 40 evaluations this round, 240 total; 116 feasible; hypervolume 1.118e+05 (+0.2%).

**LLM decision:** `stop` — This is the final round, and the front has stopped improving: hypervolume gained only +0.2% in round 3. The front has 17 feasible designs, all iterative, spanning area 6933..10014 um2 and accuracy 10.5..13.5 bits. The area-minimising pick is iterative at data_width=15, n_iter=13, round, with area 6933 um2, 10.5 accuracy bits (max error 0.000673, inside the 0.000977 limit) and 8.84 MSPS against the 1 MSPS requirement. Both constraints are met with wide margin on throughput. unrolled_k (best feasible area 9064) and pipelined_m (0 of 12 feasible, best accuracy 7.84 bits) cannot beat the iterative family on area, because their extra datapath and registers cost more. Pipelined would be larger still, so the unexplored family is not a worthwhile risk. Stopping.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.118e+05 (gain this round: +0.2%).
Feasible designs: 116 of 240 evaluations (91 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 47
- max_abs_err <= 0.000976562: 52% violate; best seen 8.59e-05 (2^-13.51)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=6933, accuracy_bits=10.5, ffs=100, throughput_msps=8.84, max_abs_err=0.000673 (2^-10.54), power_index=0.154
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=7206, accuracy_bits=10.7, ffs=102, throughput_msps=7.45, max_abs_err=0.000594 (2^-10.72), power_index=0.188
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7405, accuracy_bits=11.1, ffs=104, throughput_msps=8, max_abs_err=0.000462 (2^-11.08), power_index=0.172
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=7576, accuracy_bits=11.5, ffs=108, throughput_msps=7.7, max_abs_err=0.000338 (2^-11.53), power_index=0.178
- iterative [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=7904, accuracy_bits=12, ffs=113, throughput_msps=7.7, max_abs_err=0.000248 (2^-11.98), power_index=0.186
- iterative [data_width=16 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=8042, accuracy_bits=12.1, ffs=111, throughput_msps=6.55, max_abs_err=0.00023 (2^-12.08), power_index=0.218
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=8302, accuracy_bits=12.5, ffs=113, throughput_msps=6.64, max_abs_err=0.000175 (2^-12.48), power_index=0.212
- iterative [data_width=16 n_iter=17 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8490, accuracy_bits=12.8, ffs=115, throughput_msps=6.31, max_abs_err=0.000142 (2^-12.78), power_index=0.228
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] area_um2=9815, accuracy_bits=13.1, ffs=113, throughput_msps=6.64, max_abs_err=0.000114 (2^-13.09), power_index=0.229
- iterative [data_width=16 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] area_um2=10014, accuracy_bits=13.5, ffs=115, throughput_msps=6.31, max_abs_err=8.59e-05 (2^-13.51), power_index=0.246
Front coverage: area_um2 6933..10014 (HV reference 40000); accuracy_bits 10.5..13.5 (HV reference 10); data_width on the front 15..17 (registry 8..28).

Per family:
- iterative: 181 evals, 101 feasible; max throughput seen 14.6 MSPS; best accuracy 13.51 bits; best feasible area_um2=6933; feasible ranges: data_width 13..17, n_iter 12..18, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 47 evals, 15 feasible; max throughput seen 10.7 MSPS; best accuracy 12.10 bits; best feasible area_um2=9064; feasible ranges: data_width 13..16, n_iter 12..15, angle_guard 0..4, frac_guard 0..4, k 2..3
- pipelined_m: 12 evals, 0 feasible; max throughput seen 47 MSPS; best accuracy 7.84 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=14..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (17 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 263 feasible; hypervolume 4.209e+05 (+276.4%).

**No LLM call** (code's front-mapping round): This is the final round, and the front has stopped improving: hypervolume gained only +0.2% in round 3. The front has 17 feasible designs, all iterative, spanning area 6933..10014 um2 and accuracy 10.5..13.5 bits. The area-minimising pick is iterative at data_width=15, n_iter=13, round, with area 6933 um2, 10.5 accuracy bits (max error 0.000673, inside the 0.000977 limit) and 8.84 MSPS against the 1 MSPS requirement. Both constraints are met with wide margin on throughput. unrolled_k (best feasible area 9064) and pipelined_m (0 of 12 feasible, best accuracy 7.84 bits) cannot beat the iterative family on area, because their extra datapath and registers cost more. Pipelined would be larger still, so the unexplored family is not a worthwhile risk. Stopping.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.209e+05 (gain this round: +276.4%).
Feasible designs: 263 of 400 evaluations (219 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 47
- max_abs_err <= 0.000976562: 34% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 38 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=6933, accuracy_bits=10.5, ffs=100, throughput_msps=8.84, max_abs_err=0.000673 (2^-10.54), power_index=0.154
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7405, accuracy_bits=11.1, ffs=104, throughput_msps=8, max_abs_err=0.000462 (2^-11.08), power_index=0.172
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=7967, accuracy_bits=12.1, ffs=114, throughput_msps=7.42, max_abs_err=0.000235 (2^-12.06), power_index=0.187
- iterative [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=8317, accuracy_bits=13.2, ffs=117, throughput_msps=6.77, max_abs_err=0.000109 (2^-13.17), power_index=0.205
- iterative [data_width=19 n_iter=23 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=10038, accuracy_bits=15.5, ffs=130, throughput_msps=4.38, max_abs_err=2.18e-05 (2^-15.49), power_index=0.342
- iterative [data_width=20 n_iter=23 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=10996, accuracy_bits=17, ffs=139, throughput_msps=4.11, max_abs_err=7.39e-06 (2^-17.05), power_index=0.369
- iterative [data_width=24 n_iter=28 angle_guard=3 frac_guard=0 rounding=round] area_um2=11824, accuracy_bits=19.2, ffs=152, throughput_msps=3.16, max_abs_err=1.62e-06 (2^-19.24), power_index=0.478
- iterative [data_width=26 n_iter=24 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=12892, accuracy_bits=21, ffs=165, throughput_msps=3.44, max_abs_err=4.63e-07 (2^-21.04), power_index=0.453
- iterative [data_width=28 n_iter=24 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=13854, accuracy_bits=22.3, ffs=175, throughput_msps=3.35, max_abs_err=1.87e-07 (2^-22.35), power_index=0.483
- iterative [data_width=28 n_iter=28 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=15093, accuracy_bits=24.5, ffs=181, throughput_msps=2.84, max_abs_err=4.18e-08 (2^-24.51), power_index=0.587
Front coverage: area_um2 6933..15093 (HV reference 40000); accuracy_bits 10.5..24.5 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 341 evals, 248 feasible; max throughput seen 14.6 MSPS; best accuracy 24.51 bits; best feasible area_um2=6933; feasible ranges: data_width 13..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 47 evals, 15 feasible; max throughput seen 10.7 MSPS; best accuracy 12.10 bits; best feasible area_um2=9064; feasible ranges: data_width 13..16, n_iter 12..15, angle_guard 0..4, frac_guard 0..4, k 2..3
- pipelined_m: 12 evals, 0 feasible; max throughput seen 47 MSPS; best accuracy 7.84 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19616 in, 2786 out
- provider-reported cost: $0.0671
- full prompts and replies: `llm_trace.jsonl`

