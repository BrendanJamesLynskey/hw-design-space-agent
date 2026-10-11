# DSE run: asic_low_area

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`iterative:data_width=15,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 7121 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1897 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 102 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 131 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 7.7 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 130 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.167 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000546 (2^-10.84) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 4.47 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000147 (2^-12.73) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.21 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.8 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 17 cycles, a new input every 17 cycle(s). DDS tone from its exact outputs: SFDR 83.9 dBc, SNR 74.0 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (39 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 7121 | 102 | 7.7 | 17 | 0.167 | 0.000546 (2^-10.84) | 10.84 |
| 1 | `iterative:data_width=15,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc` | 7638 | 105 | 6.5 | 21 | 0.217 | 0.00048 (2^-11.02) | 11.02 |
| 2 | `iterative:data_width=15,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc` | 7823 | 106 | 6.9 | 19 | 0.2 | 0.000436 (2^-11.16) | 11.16 |
| 3 | `iterative:data_width=17,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 7904 | 113 | 7.2 | 17 | 0.186 | 0.000192 (2^-12.35) | 12.35 |
| 4 | `iterative:data_width=17,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 8101 | 114 | 6.6 | 19 | 0.211 | 0.000174 (2^-12.49) | 12.49 |
| 5 | `iterative:data_width=17,n_iter=16,angle_guard=3,frac_guard=1,rounding=trunc` | 8164 | 115 | 6.4 | 19 | 0.213 | 0.00017 (2^-12.52) | 12.52 |
| 6 | `iterative:data_width=18,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 8326 | 116 | 6.6 | 19 | 0.216 | 0.000108 (2^-13.18) | 13.18 |
| 7 | `iterative:data_width=18,n_iter=22,angle_guard=1,frac_guard=0,rounding=round` | 8584 | 117 | 5.0 | 25 | 0.289 | 9.26e-05 (2^-13.40) | 13.40 |
| 8 | `iterative:data_width=18,n_iter=17,angle_guard=4,frac_guard=0,rounding=round` | 8640 | 120 | 5.7 | 20 | 0.236 | 7.75e-05 (2^-13.65) | 13.65 |
| 9 | `iterative:data_width=19,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 8942 | 124 | 5.9 | 20 | 0.243 | 4.23e-05 (2^-14.53) | 14.53 |
| 10 | `iterative:data_width=19,n_iter=26,angle_guard=2,frac_guard=0,rounding=round` | 9172 | 124 | 4.1 | 29 | 0.356 | 3.86e-05 (2^-14.66) | 14.66 |
| 11 | `iterative:data_width=19,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc` | 9453 | 129 | 5.7 | 20 | 0.255 | 3.38e-05 (2^-14.85) | 14.85 |
| 12 | `iterative:data_width=20,n_iter=28,angle_guard=0,frac_guard=0,rounding=round` | 9558 | 127 | 3.9 | 31 | 0.393 | 3.25e-05 (2^-14.91) | 14.91 |
| 13 | `iterative:data_width=20,n_iter=19,angle_guard=3,frac_guard=0,rounding=round` | 9566 | 130 | 5.0 | 22 | 0.283 | 2.17e-05 (2^-15.49) | 15.49 |
| 14 | `iterative:data_width=21,n_iter=17,angle_guard=4,frac_guard=0,rounding=round` | 9924 | 137 | 5.2 | 20 | 0.269 | 2.15e-05 (2^-15.50) | 15.50 |
| 15 | `iterative:data_width=21,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 9955 | 135 | 5.0 | 22 | 0.294 | 1.21e-05 (2^-16.33) | 16.33 |
| 16 | `iterative:data_width=21,n_iter=20,angle_guard=2,frac_guard=0,rounding=round` | 10016 | 135 | 4.8 | 23 | 0.308 | 1.15e-05 (2^-16.41) | 16.41 |
| 17 | `iterative:data_width=20,n_iter=27,angle_guard=3,frac_guard=3,rounding=trunc` | 10638 | 137 | 3.7 | 30 | 0.416 | 1.03e-05 (2^-16.56) | 16.56 |
| 18 | `iterative:data_width=22,n_iter=21,angle_guard=2,frac_guard=1,rounding=trunc` | 10668 | 142 | 4.5 | 24 | 0.341 | 6.11e-06 (2^-17.32) | 17.32 |
| 19 | `iterative:data_width=23,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 10860 | 146 | 4.7 | 22 | 0.319 | 6.01e-06 (2^-17.34) | 17.34 |
| 20 | `iterative:data_width=21,n_iter=25,angle_guard=3,frac_guard=3,rounding=trunc` | 11163 | 142 | 3.8 | 28 | 0.406 | 4.7e-06 (2^-17.70) | 17.70 |
| 21 | `iterative:data_width=23,n_iter=26,angle_guard=1,frac_guard=1,rounding=trunc` | 11263 | 147 | 3.7 | 29 | 0.429 | 3.63e-06 (2^-18.07) | 18.07 |
| 22 | `iterative:data_width=23,n_iter=27,angle_guard=4,frac_guard=0,rounding=round` | 11338 | 148 | 3.3 | 30 | 0.447 | 2.9e-06 (2^-18.39) | 18.39 |
| 23 | `iterative:data_width=24,n_iter=23,angle_guard=0,frac_guard=1,rounding=trunc` | 11627 | 151 | 4.0 | 26 | 0.396 | 2.44e-06 (2^-18.64) | 18.64 |
| 24 | `iterative:data_width=25,n_iter=22,angle_guard=2,frac_guard=0,rounding=round` | 12055 | 156 | 3.9 | 25 | 0.395 | 1.11e-06 (2^-19.78) | 19.78 |
| 25 | `iterative:data_width=25,n_iter=26,angle_guard=1,frac_guard=0,rounding=round` | 12210 | 155 | 3.5 | 29 | 0.459 | 1.05e-06 (2^-19.86) | 19.86 |
| 26 | `iterative:data_width=25,n_iter=22,angle_guard=3,frac_guard=1,rounding=trunc` | 12245 | 160 | 3.8 | 25 | 0.402 | 1e-06 (2^-19.93) | 19.93 |
| 27 | `iterative:data_width=25,n_iter=27,angle_guard=2,frac_guard=0,rounding=round` | 12298 | 156 | 3.3 | 30 | 0.478 | 8.15e-07 (2^-20.23) | 20.23 |
| 28 | `iterative:data_width=25,n_iter=25,angle_guard=4,frac_guard=0,rounding=round` | 12364 | 159 | 3.3 | 28 | 0.451 | 7.53e-07 (2^-20.34) | 20.34 |
| 29 | `iterative:data_width=27,n_iter=24,angle_guard=0,frac_guard=0,rounding=trunc` | 12809 | 165 | 3.6 | 27 | 0.452 | 4.67e-07 (2^-21.03) | 21.03 |
| 30 | `iterative:data_width=27,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc` | 12933 | 166 | 3.4 | 28 | 0.472 | 4.02e-07 (2^-21.25) | 21.25 |
| 31 | `iterative:data_width=27,n_iter=24,angle_guard=4,frac_guard=0,rounding=round` | 13341 | 170 | 3.3 | 27 | 0.467 | 2.65e-07 (2^-21.85) | 21.85 |
| 32 | `iterative:data_width=28,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc` | 13458 | 172 | 3.3 | 28 | 0.489 | 2.55e-07 (2^-21.91) | 21.91 |
| 33 | `iterative:data_width=28,n_iter=24,angle_guard=2,frac_guard=0,rounding=round` | 13727 | 173 | 3.3 | 27 | 0.478 | 1.98e-07 (2^-22.27) | 22.27 |
| 34 | `iterative:data_width=28,n_iter=25,angle_guard=2,frac_guard=0,rounding=round` | 13812 | 173 | 3.2 | 28 | 0.497 | 1.43e-07 (2^-22.73) | 22.73 |
| 35 | `iterative:data_width=26,n_iter=26,angle_guard=4,frac_guard=4,rounding=trunc` | 14355 | 173 | 3.1 | 29 | 0.524 | 1.21e-07 (2^-22.98) | 22.98 |
| 36 | `iterative:data_width=27,n_iter=29,angle_guard=2,frac_guard=3,rounding=trunc` | 14517 | 174 | 2.8 | 32 | 0.583 | 1.04e-07 (2^-23.20) | 23.20 |
| 37 | `iterative:data_width=28,n_iter=29,angle_guard=4,frac_guard=2,rounding=trunc` | 14751 | 179 | 2.7 | 32 | 0.597 | 6.03e-08 (2^-23.98) | 23.98 |
| 38 | `iterative:data_width=28,n_iter=26,angle_guard=4,frac_guard=4,rounding=round` | 18060 | 184 | 3.0 | 29 | 0.605 | 4.18e-08 (2^-24.51) | 24.51 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec is area-dominated: the only hard accuracy requirement is max_abs_err <= 2^-10, which needs roughly W >= 11 and N >= 11, while the 1 MSPS throughput floor is trivially met by every family (iterative needs only Fmax >= N+3 MHz). Since accuracy depends only on (data_width, n_iter, angle_guard, frac_guard, rounding), all families share one accuracy surface, so the Pareto front over (area, accuracy_bits) will be populated by whichever family has the smallest area for a given (W,N) - almost certainly `iterative`. Round 1 therefore gives `iterative` the bulk of the budget over a wide W/N box (8..24) that brackets the feasible boundary and extends toward the 40000 um^2 HV reference, with smaller shares on `unrolled_k`, `pipelined_m` and `pipelined` to confirm they are dominated and to catch any surprise in the area model.*)
- `iterative` (65 evals): data_width=8..24, n_iter=8..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Smallest area per (W,N): one shared adder/barrel-shifter datapath reused over N+3 cycles, and the 1 MSPS floor is easily met (only needs Fmax >= N+3 MHz). Majority of the budget to locate the min-area feasible corner and trace the area/accuracy front.
- `unrolled_k` (15 evals): data_width=8..20, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..4. *Why:* Same accuracy surface as iterative but k chained micro-rotations per cycle, so expected to be dominated on area; included to verify that and to catch any case where a shorter critical path changes the area ranking.
- `pipelined_m` (15 evals): data_width=8..20, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* Register-every-m variant gives 1 result/cycle but ceil(N/m) full-width pipeline registers, so likely dominated on area; small share to confirm and to cover the throughput-rich end of the front.
- `pipelined` (5 evals): data_width=8..20, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Fully pipelined: 1 result/cycle but N full-width register stages, the largest area of all families; tiny share only to confirm it is dominated (same accuracy, more area).

**Result (code):** 100 evaluations this round, 100 total; 65 feasible; hypervolume 2.178e+05 (n/a).

**LLM decision:** `refine` — The feasible front is entirely `iterative` (9 points, area 7650..12613 um2, accuracy 10.7..17 bits) — expected, since accuracy depends only on (W,N,guards,rounding) and `iterative` is the minimal-hardware datapath, so unrolled_k/pipelined/pipelined_m (best feasible areas 11634 / none / 28506) are Pareto-dominated and cannot help HV. The throughput constraint is non-binding (best seen 201 MSPS; iterative already 4-14 MSPS), so the only levers are the two objective axes. Decomposing the reported HV=2.178e5, the single top point (12613 um2, 17.0 bits) contributes ~1.92e5, i.e. ~88% of the hypervolume, because the reference area is 40000 and the front stops at 12613; adding a point (A,acc) with acc>17 gains (40000-A)*(acc-17), so a ~20-bit design at A~15000 would add ~7e4. Conversely the left end is nearly saturated: the 7650 um2 point already sits at 10.7 bits against the 2^-10 error limit, so extending left can only add a few hundred HV. Round 2 therefore refines `iterative` at both ends, weighted toward the high-accuracy extension.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2.178e+05 (gain this round: n/a (first round)).
Feasible designs: 65 of 100 evaluations (61 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 35% violate; best seen 7.37e-06 (2^-17.05)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=21 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7650, accuracy_bits=10.7, ffs=105, throughput_msps=5.67, max_abs_err=0.000584 (2^-10.74), power_index=0.248
- iterative [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=8105, accuracy_bits=12.3, ffs=115, throughput_msps=7.7, max_abs_err=0.0002 (2^-12.28), power_index=0.19
- iterative [data_width=18 n_iter=14 angle_guard=4 frac_guard=0 rounding=round] area_um2=8359, accuracy_bits=12.6, ffs=119, throughput_msps=6.7, max_abs_err=0.000159 (2^-12.62), power_index=0.196
- iterative [data_width=19 n_iter=21 angle_guard=0 frac_guard=0 rounding=round] area_um2=8985, accuracy_bits=13.9, ffs=121, throughput_msps=5.26, max_abs_err=6.48e-05 (2^-13.91), power_index=0.289
- iterative [data_width=20 n_iter=24 angle_guard=-1 frac_guard=0 rounding=round] area_um2=9446, accuracy_bits=14.2, ffs=126, throughput_msps=4.51, max_abs_err=5.39e-05 (2^-14.18), power_index=0.339
- iterative [data_width=20 n_iter=19 angle_guard=3 frac_guard=0 rounding=round] area_um2=9566, accuracy_bits=15.5, ffs=130, throughput_msps=5.01, max_abs_err=2.17e-05 (2^-15.49), power_index=0.283
- iterative [data_width=21 n_iter=20 angle_guard=2 frac_guard=0 rounding=round] area_um2=10016, accuracy_bits=16.4, ffs=135, throughput_msps=4.8, max_abs_err=1.15e-05 (2^-16.41), power_index=0.308
- iterative [data_width=21 n_iter=21 angle_guard=1 frac_guard=4 rounding=trunc] area_um2=11236, accuracy_bits=17, ffs=142, throughput_msps=4.32, max_abs_err=7.89e-06 (2^-16.95), power_index=0.349
- iterative [data_width=22 n_iter=21 angle_guard=0 frac_guard=1 rounding=round] area_um2=12613, accuracy_bits=17, ffs=140, throughput_msps=4.6, max_abs_err=7.37e-06 (2^-17.05), power_index=0.365
Front coverage: area_um2 7650..12613 (HV reference 40000); accuracy_bits 10.7..17 (HV reference 10); data_width on the front 15..22 (registry 8..28).

Per family:
- iterative: 65 evals, 51 feasible; max throughput seen 14 MSPS; best accuracy 17.05 bits; best feasible area_um2=7650; feasible ranges: data_width 14..23, n_iter 12..24, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 6 feasible; max throughput seen 9.25 MSPS; best accuracy 14.96 bits; best feasible area_um2=11634; feasible ranges: data_width 14..19, n_iter 16..20, angle_guard -1..3, frac_guard 1..4, k 2..4
- pipelined: 5 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 15 evals, 8 feasible; max throughput seen 72.3 MSPS; best accuracy 13.70 bits; best feasible area_um2=28506; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard -2..4, frac_guard 0..3, m 4..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine the only family on the front, `iterative`, splitting budget between the high-accuracy extension (dominant HV term) and the low-area corner (selection-rule winner). Other families are dominated on area at equal accuracy, so they are not worth budget.*)
- `iterative` (100 evals): data_width=20..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Extend the front upward in accuracy_bits: the top front point (12613 um2, 17.0 bits) alone carries ~88% of the hypervolume, and larger W/N at area still well under the 40000 reference should add (40000-A)*(acc-17) HV.
- clamped by code: dropped duplicate family iterative

**Result (code):** 100 evaluations this round, 200 total; 165 feasible; hypervolume 4.183e+05 (+92.1%).

**LLM decision:** `refine` — The feasible front is entirely `iterative` (28 designs, area 7650..18060 um2, accuracy 10.7..24.5 bits). Throughput is not binding: the smallest-area design already runs at 5.67 MSPS vs the 1 MSPS constraint, and every other family is strictly larger for identical accuracy bits (unrolled_k best feasible area 11634, pipelined_m 28506, pipelined 0 feasible), so they cannot enter this min-area/max-accuracy front. The remaining HV opportunity is therefore inside the iterative front itself: the staircase has a large step from (7650 um2, 10.7 bits) to (8985 um2, 13.9 bits) and the min-area corner sits at 7650 um2 with only 0.74 bits of margin over the 2^-10 error constraint, while the feasible data_width range reaches down to 14. Filling that low-area step and probing below 7650 improves both the hypervolume and the selection rule (min area_um2), which currently picks the 7650 um2 point. The high-accuracy end is already near the registry ceiling (24.5 bits vs data_width=28/n_iter=30 max), so budget is better spent at the low-area end; the reserved full-range front mapping can run in the final round.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4.183e+05 (gain this round: +92.1%).
Feasible designs: 165 of 200 evaluations (155 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 18% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 28 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=21 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7650, accuracy_bits=10.7, ffs=105, throughput_msps=5.67, max_abs_err=0.000584 (2^-10.74), power_index=0.248
- iterative [data_width=19 n_iter=21 angle_guard=0 frac_guard=0 rounding=round] area_um2=8985, accuracy_bits=13.9, ffs=121, throughput_msps=5.26, max_abs_err=6.48e-05 (2^-13.91), power_index=0.289
- iterative [data_width=20 n_iter=28 angle_guard=0 frac_guard=0 rounding=round] area_um2=9558, accuracy_bits=14.9, ffs=127, throughput_msps=3.93, max_abs_err=3.25e-05 (2^-14.91), power_index=0.393
- iterative [data_width=21 n_iter=20 angle_guard=2 frac_guard=0 rounding=round] area_um2=10016, accuracy_bits=16.4, ffs=135, throughput_msps=4.8, max_abs_err=1.15e-05 (2^-16.41), power_index=0.308
- iterative [data_width=23 n_iter=19 angle_guard=2 frac_guard=0 rounding=round] area_um2=10860, accuracy_bits=17.3, ffs=146, throughput_msps=4.72, max_abs_err=6.01e-06 (2^-17.34), power_index=0.319
- iterative [data_width=23 n_iter=27 angle_guard=4 frac_guard=0 rounding=round] area_um2=11338, accuracy_bits=18.4, ffs=148, throughput_msps=3.27, max_abs_err=2.9e-06 (2^-18.39), power_index=0.447
- iterative [data_width=25 n_iter=27 angle_guard=2 frac_guard=0 rounding=round] area_um2=12298, accuracy_bits=20.2, ffs=156, throughput_msps=3.27, max_abs_err=8.15e-07 (2^-20.23), power_index=0.478
- iterative [data_width=26 n_iter=28 angle_guard=4 frac_guard=1 rounding=trunc] area_um2=13125, accuracy_bits=21.2, ffs=166, throughput_msps=2.92, max_abs_err=4.11e-07 (2^-21.21), power_index=0.526
- iterative [data_width=28 n_iter=26 angle_guard=0 frac_guard=2 rounding=trunc] area_um2=14315, accuracy_bits=22.7, ffs=175, throughput_msps=3.12, max_abs_err=1.45e-07 (2^-22.72), power_index=0.527
- iterative [data_width=28 n_iter=26 angle_guard=4 frac_guard=4 rounding=round] area_um2=18060, accuracy_bits=24.5, ffs=184, throughput_msps=2.96, max_abs_err=4.18e-08 (2^-24.51), power_index=0.605
Front coverage: area_um2 7650..18060 (HV reference 40000); accuracy_bits 10.7..24.5 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 165 evals, 151 feasible; max throughput seen 14 MSPS; best accuracy 24.51 bits; best feasible area_um2=7650; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 6 feasible; max throughput seen 9.25 MSPS; best accuracy 14.96 bits; best feasible area_um2=11634; feasible ranges: data_width 14..19, n_iter 16..20, angle_guard -1..3, frac_guard 1..4, k 2..4
- pipelined: 5 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 15 evals, 8 feasible; max throughput seen 72.3 MSPS; best accuracy 13.70 bits; best feasible area_um2=28506; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard -2..4, frac_guard 0..3, m 4..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focus the round on the low-area / low-accuracy staircase where the front has its biggest gap and where the min-area selection rule lives.*)
- `iterative` (40 evals): data_width=13..18, n_iter=16..24, angle_guard=-2..2, frac_guard=0..3, rounding=trunc|round. *Why:* only family on the front; shared datapath gives the smallest area

**Result (code):** 40 evaluations this round, 240 total; 200 feasible; hypervolume 4.192e+05 (+0.2%).

**LLM decision:** `stop` — Final round, and the front is both feasible and saturated. The constraint set is satisfiable with margin: 200/240 evaluations feasible, 0% throughput violations (best 201 MSPS vs the 1 MSPS bound, min-area point still 7.45 MSPS) and the accuracy bound is met by 83% of designs. The min-area selection rule lands on iterative [W=15 N=16 A=1 FG=1 trunc]: area 7206 um^2 (vs HV ref 40000), 10.7 accuracy bits, max_abs_err 5.94e-04 (2^-10.72) <= 2^-10, throughput 7.45 MSPS >= 1 MSPS — so the spec is met, not infeasible. Hypervolume gain this round was only +0.2%, i.e. the front is no longer improving, and coverage is already broad (area 7206..18060, accuracy 10.7..24.5 bits, W 15..28) with the low-area corner firmly held by `iterative`. The other families add no low-area value: unrolled_k best feasible area 11634, pipelined_m 28506, pipelined 0/5 feasible (its throughput headroom is irrelevant here since iterative already clears the 1 MSPS constraint). Stopping preserves the 160 unused evals rather than chasing a flat front.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 4.192e+05 (gain this round: +0.2%).
Feasible designs: 200 of 240 evaluations (184 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 17% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 35 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=7206, accuracy_bits=10.7, ffs=102, throughput_msps=7.45, max_abs_err=0.000594 (2^-10.72), power_index=0.188
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=8101, accuracy_bits=12.5, ffs=114, throughput_msps=6.64, max_abs_err=0.000174 (2^-12.49), power_index=0.211
- iterative [data_width=18 n_iter=22 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=8762, accuracy_bits=13.3, ffs=120, throughput_msps=4.87, max_abs_err=0.000102 (2^-13.26), power_index=0.296
- iterative [data_width=18 n_iter=19 angle_guard=1 frac_guard=3 rounding=trunc] area_um2=9352, accuracy_bits=14.1, ffs=124, throughput_msps=5.35, max_abs_err=5.66e-05 (2^-14.11), power_index=0.272
- iterative [data_width=21 n_iter=19 angle_guard=2 frac_guard=0 rounding=round] area_um2=9955, accuracy_bits=16.3, ffs=135, throughput_msps=5.01, max_abs_err=1.21e-05 (2^-16.33), power_index=0.294
- iterative [data_width=23 n_iter=19 angle_guard=2 frac_guard=0 rounding=round] area_um2=10860, accuracy_bits=17.3, ffs=146, throughput_msps=4.72, max_abs_err=6.01e-06 (2^-17.34), power_index=0.319
- iterative [data_width=25 n_iter=22 angle_guard=2 frac_guard=0 rounding=round] area_um2=12055, accuracy_bits=19.8, ffs=156, throughput_msps=3.92, max_abs_err=1.11e-06 (2^-19.78), power_index=0.395
- iterative [data_width=25 n_iter=27 angle_guard=4 frac_guard=0 rounding=round] area_um2=12425, accuracy_bits=20.3, ffs=159, throughput_msps=3.09, max_abs_err=7.53e-07 (2^-20.34), power_index=0.484
- iterative [data_width=28 n_iter=24 angle_guard=2 frac_guard=0 rounding=round] area_um2=13727, accuracy_bits=22.3, ffs=173, throughput_msps=3.35, max_abs_err=1.98e-07 (2^-22.27), power_index=0.478
- iterative [data_width=28 n_iter=26 angle_guard=4 frac_guard=4 rounding=round] area_um2=18060, accuracy_bits=24.5, ffs=184, throughput_msps=2.96, max_abs_err=4.18e-08 (2^-24.51), power_index=0.605
Front coverage: area_um2 7206..18060 (HV reference 40000); accuracy_bits 10.7..24.5 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 205 evals, 186 feasible; max throughput seen 14 MSPS; best accuracy 24.51 bits; best feasible area_um2=7206; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 6 feasible; max throughput seen 9.25 MSPS; best accuracy 14.96 bits; best feasible area_um2=11634; feasible ranges: data_width 14..19, n_iter 16..20, angle_guard -1..3, frac_guard 1..4, k 2..4
- pipelined: 5 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 15 evals, 8 feasible; max throughput seen 72.3 MSPS; best accuracy 13.70 bits; best feasible area_um2=28506; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard -2..4, frac_guard 0..3, m 4..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=14..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (35 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 350 feasible; hypervolume 4.207e+05 (+0.3%).

**No LLM call** (code's front-mapping round): Final round, and the front is both feasible and saturated. The constraint set is satisfiable with margin: 200/240 evaluations feasible, 0% throughput violations (best 201 MSPS vs the 1 MSPS bound, min-area point still 7.45 MSPS) and the accuracy bound is met by 83% of designs. The min-area selection rule lands on iterative [W=15 N=16 A=1 FG=1 trunc]: area 7206 um^2 (vs HV ref 40000), 10.7 accuracy bits, max_abs_err 5.94e-04 (2^-10.72) <= 2^-10, throughput 7.45 MSPS >= 1 MSPS — so the spec is met, not infeasible. Hypervolume gain this round was only +0.2%, i.e. the front is no longer improving, and coverage is already broad (area 7206..18060, accuracy 10.7..24.5 bits, W 15..28) with the low-area corner firmly held by `iterative`. The other families add no low-area value: unrolled_k best feasible area 11634, pipelined_m 28506, pipelined 0/5 feasible (its throughput headroom is irrelevant here since iterative already clears the 1 MSPS constraint). Stopping preserves the 160 unused evals rather than chasing a flat front.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.207e+05 (gain this round: +0.3%).
Feasible designs: 350 of 400 evaluations (320 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 12% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 39 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=7121, accuracy_bits=10.8, ffs=102, throughput_msps=7.7, max_abs_err=0.000546 (2^-10.84), power_index=0.167
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=8101, accuracy_bits=12.5, ffs=114, throughput_msps=6.64, max_abs_err=0.000174 (2^-12.49), power_index=0.211
- iterative [data_width=18 n_iter=17 angle_guard=4 frac_guard=0 rounding=round] area_um2=8640, accuracy_bits=13.7, ffs=120, throughput_msps=5.7, max_abs_err=7.75e-05 (2^-13.65), power_index=0.236
- iterative [data_width=20 n_iter=19 angle_guard=3 frac_guard=0 rounding=round] area_um2=9566, accuracy_bits=15.5, ffs=130, throughput_msps=5.01, max_abs_err=2.17e-05 (2^-15.49), power_index=0.283
- iterative [data_width=20 n_iter=27 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=10638, accuracy_bits=16.6, ffs=137, throughput_msps=3.68, max_abs_err=1.03e-05 (2^-16.56), power_index=0.416
- iterative [data_width=23 n_iter=26 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=11263, accuracy_bits=18.1, ffs=147, throughput_msps=3.69, max_abs_err=3.63e-06 (2^-18.07), power_index=0.429
- iterative [data_width=25 n_iter=26 angle_guard=1 frac_guard=0 rounding=round] area_um2=12210, accuracy_bits=19.9, ffs=155, throughput_msps=3.48, max_abs_err=1.05e-06 (2^-19.86), power_index=0.459
- iterative [data_width=27 n_iter=25 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=12933, accuracy_bits=21.2, ffs=166, throughput_msps=3.4, max_abs_err=4.02e-07 (2^-21.25), power_index=0.472
- iterative [data_width=28 n_iter=25 angle_guard=2 frac_guard=0 rounding=round] area_um2=13812, accuracy_bits=22.7, ffs=173, throughput_msps=3.23, max_abs_err=1.43e-07 (2^-22.73), power_index=0.497
- iterative [data_width=28 n_iter=26 angle_guard=4 frac_guard=4 rounding=round] area_um2=18060, accuracy_bits=24.5, ffs=184, throughput_msps=2.96, max_abs_err=4.18e-08 (2^-24.51), power_index=0.605
Front coverage: area_um2 7121..18060 (HV reference 40000); accuracy_bits 10.8..24.5 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 365 evals, 336 feasible; max throughput seen 14 MSPS; best accuracy 24.51 bits; best feasible area_um2=7121; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 6 feasible; max throughput seen 9.25 MSPS; best accuracy 14.96 bits; best feasible area_um2=11634; feasible ranges: data_width 14..19, n_iter 16..20, angle_guard -1..3, frac_guard 1..4, k 2..4
- pipelined: 5 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 15 evals, 8 feasible; max throughput seen 72.3 MSPS; best accuracy 13.70 bits; best feasible area_um2=28506; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard -2..4, frac_guard 0..3, m 4..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 11736 in, 20966 out
- provider-reported cost: $0.0146
- full prompts and replies: `llm_trace.jsonl`

