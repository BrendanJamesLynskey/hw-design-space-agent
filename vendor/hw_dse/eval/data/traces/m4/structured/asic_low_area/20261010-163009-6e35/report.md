# DSE run: asic_low_area

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`iterative:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 7031 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1873 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 104 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 9.43 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 106 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.149 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000887 (2^-10.14) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 14.5 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.00023 (2^-12.08) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 3.77 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.1 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 15 cycles, a new input every 15 cycle(s). DDS tone from its exact outputs: SFDR 79.9 dBc, SNR 69.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (37 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc` | 7031 | 104 | 9.4 | 15 | 0.149 | 0.000887 (2^-10.14) | 10.14 |
| 1 | `iterative:data_width=16,n_iter=12,angle_guard=-1,frac_guard=0,rounding=round` | 7101 | 103 | 9.4 | 15 | 0.149 | 0.000878 (2^-10.15) | 10.15 |
| 2 | `iterative:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=round` | 7164 | 104 | 9.4 | 15 | 0.15 | 0.000712 (2^-10.46) | 10.46 |
| 3 | `iterative:data_width=16,n_iter=15,angle_guard=0,frac_guard=0,rounding=trunc` | 7213 | 104 | 7.9 | 18 | 0.181 | 0.000643 (2^-10.60) | 10.60 |
| 4 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 7322 | 104 | 8.3 | 17 | 0.172 | 0.0004 (2^-11.29) | 11.29 |
| 5 | `iterative:data_width=16,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 7383 | 104 | 7.9 | 18 | 0.182 | 0.000373 (2^-11.39) | 11.39 |
| 6 | `iterative:data_width=17,n_iter=15,angle_guard=0,frac_guard=0,rounding=trunc` | 7616 | 109 | 7.6 | 18 | 0.19 | 0.000307 (2^-11.67) | 11.67 |
| 7 | `iterative:data_width=17,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 7786 | 109 | 7.6 | 18 | 0.192 | 0.000251 (2^-11.96) | 11.96 |
| 8 | `iterative:data_width=17,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc` | 7913 | 112 | 7.3 | 18 | 0.196 | 0.000239 (2^-12.03) | 12.03 |
| 9 | `iterative:data_width=18,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc` | 7957 | 114 | 7.3 | 18 | 0.198 | 0.000211 (2^-12.21) | 12.21 |
| 10 | `iterative:data_width=18,n_iter=15,angle_guard=0,frac_guard=0,rounding=trunc` | 8020 | 115 | 7.3 | 18 | 0.2 | 0.000206 (2^-12.25) | 12.25 |
| 11 | `iterative:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 8105 | 115 | 7.7 | 17 | 0.19 | 0.0002 (2^-12.28) | 12.28 |
| 12 | `iterative:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 8168 | 116 | 7.4 | 17 | 0.191 | 0.000175 (2^-12.48) | 12.48 |
| 13 | `iterative:data_width=18,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 8190 | 115 | 7.3 | 18 | 0.202 | 0.000145 (2^-12.75) | 12.75 |
| 14 | `iterative:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc` | 8560 | 121 | 6.4 | 19 | 0.224 | 8.56e-05 (2^-13.51) | 13.51 |
| 15 | `iterative:data_width=18,n_iter=24,angle_guard=2,frac_guard=0,rounding=round` | 8671 | 118 | 4.5 | 27 | 0.315 | 7.75e-05 (2^-13.65) | 13.65 |
| 16 | `iterative:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=trunc` | 9039 | 128 | 6.0 | 19 | 0.236 | 5.76e-05 (2^-14.08) | 14.08 |
| 17 | `iterative:data_width=20,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc` | 9158 | 127 | 5.5 | 22 | 0.274 | 4.53e-05 (2^-14.43) | 14.43 |
| 18 | `iterative:data_width=20,n_iter=19,angle_guard=0,frac_guard=1,rounding=trunc` | 9503 | 129 | 5.4 | 22 | 0.281 | 3.54e-05 (2^-14.78) | 14.78 |
| 19 | `iterative:data_width=20,n_iter=28,angle_guard=2,frac_guard=1,rounding=trunc` | 9751 | 131 | 3.7 | 31 | 0.404 | 3.35e-05 (2^-14.87) | 14.87 |
| 20 | `iterative:data_width=18,n_iter=23,angle_guard=3,frac_guard=4,rounding=trunc` | 9994 | 128 | 4.4 | 26 | 0.338 | 2.94e-05 (2^-15.05) | 15.05 |
| 21 | `iterative:data_width=20,n_iter=28,angle_guard=2,frac_guard=2,rounding=trunc` | 10157 | 134 | 3.7 | 31 | 0.416 | 1.86e-05 (2^-15.71) | 15.71 |
| 22 | `iterative:data_width=21,n_iter=23,angle_guard=4,frac_guard=1,rounding=trunc` | 10379 | 139 | 4.0 | 26 | 0.36 | 1.31e-05 (2^-16.21) | 16.21 |
| 23 | `iterative:data_width=22,n_iter=23,angle_guard=0,frac_guard=1,rounding=trunc` | 10626 | 140 | 4.2 | 26 | 0.365 | 9.12e-06 (2^-16.74) | 16.74 |
| 24 | `iterative:data_width=22,n_iter=24,angle_guard=1,frac_guard=1,rounding=trunc` | 10713 | 141 | 4.1 | 27 | 0.382 | 6.73e-06 (2^-17.18) | 17.18 |
| 25 | `iterative:data_width=22,n_iter=22,angle_guard=1,frac_guard=3,rounding=trunc` | 11416 | 146 | 4.2 | 25 | 0.37 | 4e-06 (2^-17.93) | 17.93 |
| 26 | `iterative:data_width=25,n_iter=24,angle_guard=-1,frac_guard=0,rounding=trunc` | 11719 | 153 | 3.8 | 27 | 0.416 | 2.44e-06 (2^-18.64) | 18.64 |
| 27 | `iterative:data_width=25,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc` | 11883 | 155 | 3.6 | 28 | 0.438 | 1.47e-06 (2^-19.37) | 19.37 |
| 28 | `iterative:data_width=25,n_iter=25,angle_guard=1,frac_guard=0,rounding=round` | 12174 | 155 | 3.6 | 28 | 0.443 | 1.05e-06 (2^-19.86) | 19.86 |
| 29 | `iterative:data_width=27,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc` | 12872 | 166 | 3.5 | 27 | 0.454 | 4.31e-07 (2^-21.14) | 21.14 |
| 30 | `iterative:data_width=28,n_iter=23,angle_guard=1,frac_guard=0,rounding=trunc` | 13300 | 172 | 3.6 | 26 | 0.452 | 4.04e-07 (2^-21.24) | 21.24 |
| 31 | `iterative:data_width=28,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc` | 13385 | 172 | 3.4 | 27 | 0.471 | 2.99e-07 (2^-21.67) | 21.67 |
| 32 | `iterative:data_width=28,n_iter=24,angle_guard=1,frac_guard=0,rounding=round` | 13664 | 172 | 3.4 | 27 | 0.475 | 2.07e-07 (2^-22.20) | 22.20 |
| 33 | `iterative:data_width=28,n_iter=24,angle_guard=2,frac_guard=0,rounding=round` | 13727 | 173 | 3.3 | 27 | 0.478 | 1.98e-07 (2^-22.27) | 22.27 |
| 34 | `iterative:data_width=28,n_iter=24,angle_guard=3,frac_guard=0,rounding=round` | 13791 | 174 | 3.3 | 27 | 0.481 | 1.86e-07 (2^-22.36) | 22.36 |
| 35 | `iterative:data_width=28,n_iter=26,angle_guard=1,frac_guard=0,rounding=round` | 13822 | 172 | 3.2 | 29 | 0.513 | 1.47e-07 (2^-22.70) | 22.70 |
| 36 | `iterative:data_width=28,n_iter=24,angle_guard=2,frac_guard=3,rounding=round` | 17273 | 179 | 3.3 | 27 | 0.544 | 1.45e-07 (2^-22.72) | 22.72 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >=1 MSPS throughput and <=2^-10 max error, minimizing area. pipelined_m and unrolled_k are the most promising families: both can achieve >=1 MSPS at modest clock frequencies while keeping area low. pipelined_m uses fewer registers than fully pipelined, and unrolled_k shares datapath with modest unroll factor. Both are searched over narrow ranges centered on the accuracy constraint boundary (n_iter ~10-16, data_width ~12-18) to focus budget on the feasible region where area is minimized. iterative is excluded because its low throughput (1 result per N+3 cycles) would require very high Fmax to meet >=1 MSPS, likely increasing area/power without benefit. Fully pipelined is excluded because its many registers would increase area compared to pipelined_m.*)
- `pipelined_m` (60 evals): data_width=12..18, n_iter=10..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* pipelined_m offers the best area/throughput trade-off: 1 result/cycle (meets >=1 MSPS easily at modest Fmax) with fewer registers than fully pipelined (lower area). m=2..4 balances pipeline depth vs register count. n_iter 10-16 and data_width 12-18 target the <=2^-10 error constraint with minimal overhead. angle_guard -2..0 and frac_guard 0..1 keep datapath narrow to minimize area.
- `unrolled_k` (40 evals): data_width=12..18, n_iter=10..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round, k=2..4. *Why:* unrolled_k with k=2..4 can achieve >=1 MSPS at lower Fmax than iterative, with less area than pipelined_m due to shared datapath and fewer pipeline registers. Same accuracy-focused ranges as pipelined_m to explore the area/accuracy trade-off curve. k=2..4 keeps combinational depth manageable for reasonable Fmax.

**Result (code):** 100 evaluations this round, 100 total; 64 feasible; hypervolume 6.877e+04 (n/a).

**LLM decision:** `add_family` — The current Pareto front is dominated by `unrolled_k` with a minimum area of ~9.6k um^2. However, `pipelined_m` achieved a much higher throughput (102 MSPS) but with a larger area (~19.6k um^2). The `iterative` family has not been explored yet. Given the objective is to minimize area and the constraint is only >= 1 MSPS, a highly optimized `iterative` design (likely with smaller data_width and fewer iterations) could potentially offer a significantly smaller area than the current best, while still meeting the throughput requirement. Exploring `iterative` is necessary to see if it provides a better area-accuracy trade-off.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6.877e+04 (gain this round: n/a (first round)).
Feasible designs: 64 of 100 evaluations (44 unique).
Families explored so far: unrolled_k, pipelined_m. Not yet explored: iterative, pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 102
- max_abs_err <= 0.000976562: 36% violate; best seen 0.0002 (2^-12.28)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- unrolled_k [data_width=17 n_iter=14 angle_guard=-2 frac_guard=0 rounding=trunc k=2] area_um2=9579, accuracy_bits=10.5, ffs=106, throughput_msps=7.45, max_abs_err=0.000707 (2^-10.47), power_index=0.115
- unrolled_k [data_width=17 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc k=2] area_um2=9607, accuracy_bits=10.6, ffs=108, throughput_msps=8.27, max_abs_err=0.000643 (2^-10.60), power_index=0.105
- unrolled_k [data_width=17 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc k=2] area_um2=9684, accuracy_bits=11.4, ffs=107, throughput_msps=7.45, max_abs_err=0.000375 (2^-11.38), power_index=0.117
- unrolled_k [data_width=18 n_iter=14 angle_guard=-2 frac_guard=0 rounding=trunc k=2] area_um2=10083, accuracy_bits=11.4, ffs=112, throughput_msps=7.14, max_abs_err=0.000368 (2^-11.41), power_index=0.121
- unrolled_k [data_width=18 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc k=2] area_um2=10188, accuracy_bits=11.9, ffs=113, throughput_msps=7.14, max_abs_err=0.000265 (2^-11.88), power_index=0.123
- unrolled_k [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=trunc k=2] area_um2=10293, accuracy_bits=12, ffs=114, throughput_msps=7.14, max_abs_err=0.000251 (2^-11.96), power_index=0.124
- unrolled_k [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=2] area_um2=10439, accuracy_bits=12.3, ffs=114, throughput_msps=7.14, max_abs_err=0.0002 (2^-12.28), power_index=0.125
Front coverage: area_um2 9579..10439 (HV reference 40000); accuracy_bits 10.5..12.3 (HV reference 10); data_width on the front 17..18 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 26 feasible; max throughput seen 8.97 MSPS; best accuracy 12.28 bits; best feasible area_um2=9579; feasible ranges: data_width 17..18, n_iter 12..14, angle_guard -2..0, frac_guard 0..1, k 2..4
- pipelined_m: 60 evals, 38 feasible; max throughput seen 102 MSPS; best accuracy 12.24 bits; best feasible area_um2=19606; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -2..0, frac_guard 0..1, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Adding iterative family to explore for potentially smaller area.*)
- `iterative` (100 evals): data_width=12..18, n_iter=10..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round. *Why:* Explore iterative family to check for potentially smaller area solutions that still meet throughput >= 1 MSPS.

**Result (code):** 100 evaluations this round, 200 total; 121 feasible; hypervolume 9.076e+04 (+32.0%).

**LLM decision:** `add_family` — The current Pareto front is dominated by the `iterative` family (best area 7031 um^2), which is the most area-efficient but has lower throughput (~7-9 MSPS). The `pipelined_m` family offers much higher throughput (up to 102 MSPS) but at a significantly higher area cost (best feasible 19606 um^2). The `pipelined` family (m=1) has not been explored yet. Given the objective is to minimize area while maintaining >= 1 MSPS throughput, it is crucial to explore `pipelined` to see if it offers a better area/throughput trade-off than `pipelined_m` or if it can bridge the gap between `iterative` and `pipelined_m`. Since `pipelined` has the highest latency (N+2) but potentially different area characteristics due to full pipelining, it might reveal new Pareto-optimal points, especially in the mid-range of accuracy/area. Additionally, the `unrolled_k` family showed higher area than `iterative` for similar accuracy, suggesting `iterative` is the area king, but `pipelined` might offer a different trade-off curve. Exploring `pipelined` will help map the full front and ensure we haven't missed a better area/throughput point.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9.076e+04 (gain this round: +32.0%).
Feasible designs: 121 of 200 evaluations (75 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 102
- max_abs_err <= 0.000976562: 40% violate; best seen 0.00014 (2^-12.80)

Pareto front (feasible, 14 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7031, accuracy_bits=10.1, ffs=104, throughput_msps=9.43, max_abs_err=0.000887 (2^-10.14), power_index=0.149
- iterative [data_width=16 n_iter=12 angle_guard=-1 frac_guard=0 rounding=round] area_um2=7101, accuracy_bits=10.2, ffs=103, throughput_msps=9.43, max_abs_err=0.000878 (2^-10.15), power_index=0.149
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7213, accuracy_bits=10.6, ffs=104, throughput_msps=7.86, max_abs_err=0.000643 (2^-10.60), power_index=0.181
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=7322, accuracy_bits=11.3, ffs=104, throughput_msps=8.32, max_abs_err=0.0004 (2^-11.29), power_index=0.172
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7616, accuracy_bits=11.7, ffs=109, throughput_msps=7.56, max_abs_err=0.000307 (2^-11.67), power_index=0.19
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=7786, accuracy_bits=12, ffs=109, throughput_msps=7.56, max_abs_err=0.000251 (2^-11.96), power_index=0.192
- iterative [data_width=18 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=7957, accuracy_bits=12.2, ffs=114, throughput_msps=7.27, max_abs_err=0.000211 (2^-12.21), power_index=0.198
- iterative [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=8020, accuracy_bits=12.2, ffs=115, throughput_msps=7.27, max_abs_err=0.000206 (2^-12.25), power_index=0.2
- iterative [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=8190, accuracy_bits=12.8, ffs=115, throughput_msps=7.27, max_abs_err=0.000145 (2^-12.75), power_index=0.202
- iterative [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=round] area_um2=9983, accuracy_bits=12.8, ffs=117, throughput_msps=7.01, max_abs_err=0.00014 (2^-12.80), power_index=0.223
Front coverage: area_um2 7031..9983 (HV reference 40000); accuracy_bits 10.1..12.8 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 100 evals, 57 feasible; max throughput seen 11.3 MSPS; best accuracy 12.80 bits; best feasible area_um2=7031; feasible ranges: data_width 16..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
- unrolled_k: 40 evals, 26 feasible; max throughput seen 8.97 MSPS; best accuracy 12.28 bits; best feasible area_um2=9579; feasible ranges: data_width 17..18, n_iter 12..14, angle_guard -2..0, frac_guard 0..1, k 2..4
- pipelined_m: 60 evals, 38 feasible; max throughput seen 102 MSPS; best accuracy 12.24 bits; best feasible area_um2=19606; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -2..0, frac_guard 0..1, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *The `pipelined` family is the only one not yet explored. Given the area objective and the throughput constraint, it is essential to evaluate its performance. The ranges are chosen to cover the accuracy/area region where feasible designs have been found in other families, ensuring that the search is focused on the relevant part of the design space.*)
- `pipelined` (40 evals): data_width=14..18, n_iter=10..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round. *Why:* Explore the unexplored `pipelined` family to map its area/throughput/accuracy trade-offs. Ranges are centered around the feasible regions found in `iterative` and `pipelined_m` (data_width 14-18, n_iter 10-16) to focus on the relevant accuracy/area region. This will help determine if `pipelined` offers better area efficiency than `pipelined_m` for high throughput or if it provides new Pareto points.

**Result (code):** 40 evaluations this round, 240 total; 148 feasible; hypervolume 9.076e+04 (+0.0%).

**LLM decision:** `stop` — The Pareto front is well-established and stable (hypervolume gain in Round 3 was 0.0%). The minimum area design (iterative, 7031 um^2) comfortably meets the throughput constraint (9.43 MSPS >= 1 MSPS) and the accuracy constraint (10.1 bits >= 10 bits). The front spans a reasonable range of accuracy (10.1 to 12.8 bits) and area (7031 to 9983 um^2) for the iterative family, which dominates the low-area end. Pipelined families offer higher throughput but at significantly higher area costs (19k-30k um^2), which are dominated by the iterative designs for the primary objective of minimizing area. Since this is the final round and the front covers the relevant trade-off space for the spec's objectives, stopping is the appropriate action.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9.076e+04 (gain this round: +0.0%).
Feasible designs: 148 of 240 evaluations (91 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 38% violate; best seen 0.00014 (2^-12.80)

Pareto front (feasible, 14 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7031, accuracy_bits=10.1, ffs=104, throughput_msps=9.43, max_abs_err=0.000887 (2^-10.14), power_index=0.149
- iterative [data_width=16 n_iter=12 angle_guard=-1 frac_guard=0 rounding=round] area_um2=7101, accuracy_bits=10.2, ffs=103, throughput_msps=9.43, max_abs_err=0.000878 (2^-10.15), power_index=0.149
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7213, accuracy_bits=10.6, ffs=104, throughput_msps=7.86, max_abs_err=0.000643 (2^-10.60), power_index=0.181
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=7322, accuracy_bits=11.3, ffs=104, throughput_msps=8.32, max_abs_err=0.0004 (2^-11.29), power_index=0.172
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7616, accuracy_bits=11.7, ffs=109, throughput_msps=7.56, max_abs_err=0.000307 (2^-11.67), power_index=0.19
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=7786, accuracy_bits=12, ffs=109, throughput_msps=7.56, max_abs_err=0.000251 (2^-11.96), power_index=0.192
- iterative [data_width=18 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=7957, accuracy_bits=12.2, ffs=114, throughput_msps=7.27, max_abs_err=0.000211 (2^-12.21), power_index=0.198
- iterative [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=8020, accuracy_bits=12.2, ffs=115, throughput_msps=7.27, max_abs_err=0.000206 (2^-12.25), power_index=0.2
- iterative [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=8190, accuracy_bits=12.8, ffs=115, throughput_msps=7.27, max_abs_err=0.000145 (2^-12.75), power_index=0.202
- iterative [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=round] area_um2=9983, accuracy_bits=12.8, ffs=117, throughput_msps=7.01, max_abs_err=0.00014 (2^-12.80), power_index=0.223
Front coverage: area_um2 7031..9983 (HV reference 40000); accuracy_bits 10.1..12.8 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 100 evals, 57 feasible; max throughput seen 11.3 MSPS; best accuracy 12.80 bits; best feasible area_um2=7031; feasible ranges: data_width 16..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
- unrolled_k: 40 evals, 26 feasible; max throughput seen 8.97 MSPS; best accuracy 12.28 bits; best feasible area_um2=9579; feasible ranges: data_width 17..18, n_iter 12..14, angle_guard -2..0, frac_guard 0..1, k 2..4
- pipelined: 40 evals, 27 feasible; max throughput seen 171 MSPS; best accuracy 12.25 bits; best feasible area_um2=30254; feasible ranges: data_width 16..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
- pipelined_m: 60 evals, 38 feasible; max throughput seen 102 MSPS; best accuracy 12.24 bits; best feasible area_um2=19606; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -2..0, frac_guard 0..1, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=15..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (14 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 295 feasible; hypervolume 3.753e+05 (+313.4%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established and stable (hypervolume gain in Round 3 was 0.0%). The minimum area design (iterative, 7031 um^2) comfortably meets the throughput constraint (9.43 MSPS >= 1 MSPS) and the accuracy constraint (10.1 bits >= 10 bits). The front spans a reasonable range of accuracy (10.1 to 12.8 bits) and area (7031 to 9983 um^2) for the iterative family, which dominates the low-area end. Pipelined families offer higher throughput but at significantly higher area costs (19k-30k um^2), which are dominated by the iterative designs for the primary objective of minimizing area. Since this is the final round and the front covers the relevant trade-off space for the spec's objectives, stopping is the appropriate action.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 3.753e+05 (gain this round: +313.4%).
Feasible designs: 295 of 400 evaluations (224 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 26% violate; best seen 1.45e-07 (2^-22.72)

Pareto front (feasible, 37 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7031, accuracy_bits=10.1, ffs=104, throughput_msps=9.43, max_abs_err=0.000887 (2^-10.14), power_index=0.149
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=7322, accuracy_bits=11.3, ffs=104, throughput_msps=8.32, max_abs_err=0.0004 (2^-11.29), power_index=0.172
- iterative [data_width=17 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=7913, accuracy_bits=12, ffs=112, throughput_msps=7.27, max_abs_err=0.000239 (2^-12.03), power_index=0.196
- iterative [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=8168, accuracy_bits=12.5, ffs=116, throughput_msps=7.42, max_abs_err=0.000175 (2^-12.48), power_index=0.191
- iterative [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=9039, accuracy_bits=14.1, ffs=128, throughput_msps=5.99, max_abs_err=5.76e-05 (2^-14.08), power_index=0.236
- iterative [data_width=18 n_iter=23 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=9994, accuracy_bits=15.1, ffs=128, throughput_msps=4.38, max_abs_err=2.94e-05 (2^-15.05), power_index=0.338
- iterative [data_width=22 n_iter=24 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=10713, accuracy_bits=17.2, ffs=141, throughput_msps=4.09, max_abs_err=6.73e-06 (2^-17.18), power_index=0.382
- iterative [data_width=25 n_iter=25 angle_guard=1 frac_guard=0 rounding=round] area_um2=12174, accuracy_bits=19.9, ffs=155, throughput_msps=3.6, max_abs_err=1.05e-06 (2^-19.86), power_index=0.443
- iterative [data_width=28 n_iter=24 angle_guard=1 frac_guard=0 rounding=round] area_um2=13664, accuracy_bits=22.2, ffs=172, throughput_msps=3.44, max_abs_err=2.07e-07 (2^-22.20), power_index=0.475
- iterative [data_width=28 n_iter=24 angle_guard=2 frac_guard=3 rounding=round] area_um2=17273, accuracy_bits=22.7, ffs=179, throughput_msps=3.26, max_abs_err=1.45e-07 (2^-22.72), power_index=0.544
Front coverage: area_um2 7031..17273 (HV reference 40000); accuracy_bits 10.1..22.7 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 260 evals, 204 feasible; max throughput seen 11.3 MSPS; best accuracy 22.72 bits; best feasible area_um2=7031; feasible ranges: data_width 15..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 40 evals, 26 feasible; max throughput seen 8.97 MSPS; best accuracy 12.28 bits; best feasible area_um2=9579; feasible ranges: data_width 17..18, n_iter 12..14, angle_guard -2..0, frac_guard 0..1, k 2..4
- pipelined: 40 evals, 27 feasible; max throughput seen 171 MSPS; best accuracy 12.25 bits; best feasible area_um2=30254; feasible ranges: data_width 16..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
- pipelined_m: 60 evals, 38 feasible; max throughput seen 102 MSPS; best accuracy 12.24 bits; best feasible area_um2=19606; feasible ranges: data_width 15..17, n_iter 12..16, angle_guard -2..0, frac_guard 0..1, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10516 in, 2456 out
- provider-reported cost: $0.0099
- full prompts and replies: `llm_trace.jsonl`

