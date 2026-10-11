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
`iterative:data_width=16,n_iter=14,angle_guard=-1,frac_guard=0,rounding=trunc` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 7101 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1892 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 103 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 8.32 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 120 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.168 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000865 (2^-10.18) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 14.2 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.000193 (2^-12.34) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 3.16 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.2 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 17 cycles, a new input every 17 cycle(s). DDS tone from its exact outputs: SFDR 85.7 dBc, SNR 71.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (36 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=16,n_iter=14,angle_guard=-1,frac_guard=0,rounding=trunc` | 7101 | 103 | 8.3 | 17 | 0.168 | 0.000865 (2^-10.18) | 10.18 |
| 1 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 7322 | 104 | 8.3 | 17 | 0.172 | 0.0004 (2^-11.29) | 11.29 |
| 2 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 7495 | 105 | 7.2 | 19 | 0.195 | 0.000301 (2^-11.70) | 11.70 |
| 3 | `iterative:data_width=16,n_iter=18,angle_guard=3,frac_guard=0,rounding=round` | 7745 | 108 | 6.0 | 21 | 0.222 | 0.000285 (2^-11.78) | 11.78 |
| 4 | `iterative:data_width=17,n_iter=22,angle_guard=1,frac_guard=0,rounding=round` | 8119 | 112 | 5.2 | 25 | 0.275 | 0.000149 (2^-12.71) | 12.71 |
| 5 | `iterative:data_width=17,n_iter=22,angle_guard=3,frac_guard=0,rounding=round` | 8246 | 114 | 4.9 | 25 | 0.28 | 0.000146 (2^-12.74) | 12.74 |
| 6 | `iterative:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 8253 | 116 | 7.0 | 18 | 0.204 | 0.000119 (2^-13.04) | 13.04 |
| 7 | `iterative:data_width=18,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 8326 | 116 | 6.6 | 19 | 0.216 | 0.000108 (2^-13.18) | 13.18 |
| 8 | `iterative:data_width=18,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc` | 8626 | 119 | 6.0 | 21 | 0.246 | 9.61e-05 (2^-13.35) | 13.35 |
| 9 | `iterative:data_width=18,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc` | 8898 | 121 | 6.1 | 20 | 0.24 | 6.92e-05 (2^-13.82) | 13.82 |
| 10 | `iterative:data_width=18,n_iter=20,angle_guard=3,frac_guard=2,rounding=trunc` | 9170 | 124 | 5.1 | 23 | 0.282 | 5.33e-05 (2^-14.20) | 14.20 |
| 11 | `iterative:data_width=20,n_iter=25,angle_guard=4,frac_guard=0,rounding=trunc` | 9484 | 131 | 3.8 | 28 | 0.361 | 5.2e-05 (2^-14.23) | 14.23 |
| 12 | `iterative:data_width=19,n_iter=20,angle_guard=1,frac_guard=2,rounding=trunc` | 9508 | 127 | 5.1 | 23 | 0.291 | 3.93e-05 (2^-14.64) | 14.64 |
| 13 | `iterative:data_width=19,n_iter=20,angle_guard=3,frac_guard=2,rounding=trunc` | 9635 | 129 | 5.0 | 23 | 0.296 | 2.62e-05 (2^-15.22) | 15.22 |
| 14 | `iterative:data_width=21,n_iter=21,angle_guard=1,frac_guard=0,rounding=trunc` | 9758 | 134 | 4.7 | 24 | 0.316 | 2.36e-05 (2^-15.37) | 15.37 |
| 15 | `iterative:data_width=21,n_iter=22,angle_guard=1,frac_guard=0,rounding=round` | 10037 | 134 | 4.6 | 25 | 0.333 | 1.21e-05 (2^-16.34) | 16.34 |
| 16 | `iterative:data_width=21,n_iter=23,angle_guard=3,frac_guard=0,rounding=round` | 10188 | 136 | 4.1 | 26 | 0.352 | 1.15e-05 (2^-16.41) | 16.41 |
| 17 | `iterative:data_width=20,n_iter=28,angle_guard=3,frac_guard=3,rounding=trunc` | 10638 | 137 | 3.6 | 31 | 0.43 | 1.13e-05 (2^-16.43) | 16.43 |
| 18 | `iterative:data_width=23,n_iter=20,angle_guard=3,frac_guard=0,rounding=trunc` | 10777 | 147 | 4.4 | 23 | 0.334 | 6.2e-06 (2^-17.30) | 17.30 |
| 19 | `iterative:data_width=23,n_iter=24,angle_guard=3,frac_guard=0,rounding=trunc` | 10947 | 147 | 3.7 | 27 | 0.394 | 5.84e-06 (2^-17.39) | 17.39 |
| 20 | `iterative:data_width=23,n_iter=27,angle_guard=0,frac_guard=0,rounding=round` | 11085 | 143 | 3.7 | 30 | 0.435 | 3.98e-06 (2^-17.94) | 17.94 |
| 21 | `iterative:data_width=23,n_iter=22,angle_guard=2,frac_guard=2,rounding=trunc` | 11586 | 150 | 4.2 | 25 | 0.379 | 1.98e-06 (2^-18.94) | 18.94 |
| 22 | `iterative:data_width=24,n_iter=23,angle_guard=3,frac_guard=0,rounding=round` | 11691 | 152 | 3.8 | 26 | 0.399 | 1.62e-06 (2^-19.24) | 19.24 |
| 23 | `iterative:data_width=24,n_iter=22,angle_guard=1,frac_guard=2,rounding=trunc` | 12012 | 154 | 4.0 | 25 | 0.391 | 1.47e-06 (2^-19.37) | 19.37 |
| 24 | `iterative:data_width=26,n_iter=24,angle_guard=0,frac_guard=0,rounding=trunc` | 12296 | 160 | 3.7 | 27 | 0.435 | 9.44e-07 (2^-20.02) | 20.02 |
| 25 | `iterative:data_width=26,n_iter=28,angle_guard=3,frac_guard=0,rounding=trunc` | 12607 | 163 | 3.0 | 31 | 0.511 | 8.28e-07 (2^-20.20) | 20.20 |
| 26 | `iterative:data_width=24,n_iter=25,angle_guard=2,frac_guard=3,rounding=trunc` | 12675 | 158 | 3.5 | 28 | 0.454 | 7.46e-07 (2^-20.35) | 20.35 |
| 27 | `iterative:data_width=27,n_iter=24,angle_guard=2,frac_guard=0,rounding=trunc` | 12935 | 167 | 3.4 | 27 | 0.457 | 4.68e-07 (2^-21.03) | 21.03 |
| 28 | `iterative:data_width=27,n_iter=24,angle_guard=4,frac_guard=0,rounding=trunc` | 13062 | 170 | 3.3 | 27 | 0.462 | 4.11e-07 (2^-21.22) | 21.22 |
| 29 | `iterative:data_width=25,n_iter=25,angle_guard=2,frac_guard=3,rounding=trunc` | 13200 | 163 | 3.4 | 28 | 0.472 | 4.08e-07 (2^-21.23) | 21.23 |
| 30 | `iterative:data_width=27,n_iter=24,angle_guard=1,frac_guard=1,rounding=trunc` | 13278 | 169 | 3.5 | 27 | 0.464 | 3.19e-07 (2^-21.58) | 21.58 |
| 31 | `iterative:data_width=28,n_iter=27,angle_guard=2,frac_guard=0,rounding=trunc` | 13630 | 173 | 3.0 | 30 | 0.529 | 2.02e-07 (2^-22.24) | 22.24 |
| 32 | `iterative:data_width=27,n_iter=25,angle_guard=1,frac_guard=3,rounding=trunc` | 14187 | 173 | 3.2 | 28 | 0.503 | 1.89e-07 (2^-22.33) | 22.33 |
| 33 | `iterative:data_width=27,n_iter=28,angle_guard=3,frac_guard=3,rounding=trunc` | 14532 | 175 | 2.9 | 31 | 0.567 | 8.12e-08 (2^-23.55) | 23.55 |
| 34 | `iterative:data_width=28,n_iter=28,angle_guard=2,frac_guard=3,rounding=trunc` | 15030 | 179 | 2.8 | 31 | 0.584 | 5.37e-08 (2^-24.15) | 24.15 |
| 35 | `iterative:data_width=28,n_iter=28,angle_guard=4,frac_guard=2,rounding=round` | 17358 | 179 | 2.8 | 31 | 0.626 | 3.55e-08 (2^-24.75) | 24.75 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >= 1 MSPS throughput and max_abs_err <= 2^-10, minimizing area. pipelined is the strongest candidate: 1 result/cycle means throughput = Fmax, easily >= 1 MSPS at reasonable Fmax, and area scales with n_iter * data_width. We focus budget here with low n_iter (10-16) to keep area small while meeting accuracy. unrolled_k with high k may also meet throughput if Fmax is high, and could have competitive area. iterative has smallest area but likely fails throughput; included with small share to verify. All families share identical accuracy, so ranges are tuned to accuracy_bits >= 10 with minimal guard bits to reduce area.*)
- `pipelined` (50 evals): data_width=12..18, n_iter=10..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round. *Why:* pipelined achieves 1 result/cycle, easily meeting the >= 1 MSPS throughput constraint with high Fmax margin. Area is dominated by the number of pipeline registers (proportional to n_iter * data_width). We search low n_iter (10-16) to minimize area while maintaining accuracy_bits >= 10 (max_abs_err <= 2^-10). data_width 12-18 balances output precision against register count. angle_guard and frac_guard kept minimal to reduce datapath width and area.
- `unrolled_k` (30 evals): data_width=12..18, n_iter=10..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round, k=4..8. *Why:* unrolled_k with high k (4-8) processes multiple micro-rotations per cycle, reducing latency and potentially allowing higher Fmax. With n_iter ~12 and k=6, latency is ~5 cycles, giving throughput ~0.2 MSPS at 1 GHz—wait, that's below 1 MSPS. Let me reconsider: at k=8, n_iter=12, cycles=ceil(12/8)+3=5, so throughput = Fmax/5. For >= 1 MSPS, need Fmax >= 5 GHz, which is unlikely. So unrolled_k may struggle with throughput unless k is very high or Fmax is very high. Still worth exploring at high k to see if area is competitive.
- `iterative` (20 evals): data_width=12..18, n_iter=10..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round. *Why:* iterative has minimal area (single datapath, no pipeline registers) but throughput = Fmax/(n_iter+3). For n_iter=12, cycles=15, so need Fmax >= 15 GHz for 1 MSPS—unlikely. However, if Fmax is high enough, area could be very small. Worth a small budget share to check if any corner meets constraints.

**Result (code):** 100 evaluations this round, 100 total; 58 feasible; hypervolume 7.063e+04 (n/a).

**LLM decision:** `add_family` — The current Pareto front is dominated by the `iterative` family for low area (7101 um^2) but lacks high-throughput, low-area options. The `pipelined` family achieves high throughput (up to 180 MSPS) but at a significant area penalty (min 32426 um^2 on the front, 42845 um^2 for the highest accuracy point). The `unrolled_k` family sits in between but is generally larger than `iterative` for similar accuracy. The `pipelined_m` family is unexplored. By registering every `m` stages instead of every stage, it can potentially reduce the flip-flop count and area compared to `pipelined` while maintaining 1 result/cycle throughput. This could fill the gap between the low-area/low-throughput `iterative` designs and the high-area/high-throughput `pipelined` designs, potentially improving the hypervolume by finding a better trade-off point (e.g., lower area than `pipelined` for the same throughput, or higher throughput than `iterative` for the same area).

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7.063e+04 (gain this round: n/a (first round)).
Feasible designs: 58 of 100 evaluations (47 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 180
- max_abs_err <= 0.000976562: 42% violate; best seen 0.00016 (2^-12.61)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=7101, accuracy_bits=10.2, ffs=103, throughput_msps=8.32, max_abs_err=0.000865 (2^-10.18), power_index=0.168
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=7322, accuracy_bits=11.3, ffs=104, throughput_msps=8.32, max_abs_err=0.0004 (2^-11.29), power_index=0.172
- unrolled_k [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=4] area_um2=15134, accuracy_bits=12.3, ffs=113, throughput_msps=5.34, max_abs_err=0.0002 (2^-12.28), power_index=0.106
- unrolled_k [data_width=18 n_iter=14 angle_guard=0 frac_guard=1 rounding=round k=4] area_um2=17128, accuracy_bits=12.4, ffs=115, throughput_msps=5.13, max_abs_err=0.000179 (2^-12.45), power_index=0.115
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=42845, accuracy_bits=12.6, ffs=925, throughput_msps=138, max_abs_err=0.00016 (2^-12.61), power_index=0.0767
Front coverage: area_um2 7101..42845 (HV reference 40000); accuracy_bits 10.2..12.6 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 20 evals, 12 feasible; max throughput seen 11.8 MSPS; best accuracy 11.29 bits; best feasible area_um2=7101; feasible ranges: data_width 15..17, n_iter 14..16, angle_guard -2..0, frac_guard 0..1
- unrolled_k: 30 evals, 17 feasible; max throughput seen 7.52 MSPS; best accuracy 12.45 bits; best feasible area_um2=15134; feasible ranges: data_width 16..18, n_iter 12..14, angle_guard -1..0, frac_guard 0..1, k 4..8
- pipelined: 50 evals, 29 feasible; max throughput seen 180 MSPS; best accuracy 12.61 bits; best feasible area_um2=32426; feasible ranges: data_width 15..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
```
</details>

### Round 2

**Plan explored** (LLM rationale: *pipelined_m is the only unexplored family. It offers a potential area/throughput trade-off not covered by the current front. Focusing the entire round's budget on this family allows for a thorough exploration of its parameter space, particularly the `m` parameter which controls the area/latency trade-off.*)
- `pipelined_m` (100 evals): data_width=14..18, n_iter=12..16, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round, m=2..8. *Why:* Explore pipelined_m to find lower-area high-throughput designs that may improve the Pareto front between iterative and pipelined.

**Result (code):** 100 evaluations this round, 200 total; 136 feasible; hypervolume 7.672e+04 (+8.6%).

**LLM decision:** `refine` — The current Pareto front is dominated by the `iterative` family at the low-area end (7101 um^2) and `pipelined_m` at the high-accuracy/high-throughput end. The `iterative` family is the only one achieving the minimum area constraint effectively (7101 um^2 vs 15134+ for others). However, the `iterative` family's feasible range was explored with only 20 evals, and its best accuracy is limited to ~11.3 bits. To maximize hypervolume, we need to push the `iterative` family further into the accuracy domain without sacrificing its area advantage, and simultaneously tighten the `pipelined_m` search to find lower-area points at high accuracy. The `unrolled_k` family appears inferior in area compared to `iterative` for similar accuracy, so it can be deprioritized. We will focus the next round on refining `iterative` (allowing slightly higher n_iter or angle_guard to boost accuracy while keeping area low) and `pipelined_m` (searching for lower m or different n_iter to reduce area at high accuracy).

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7.672e+04 (gain this round: +8.6%).
Feasible designs: 136 of 200 evaluations (108 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 180
- max_abs_err <= 0.000976562: 32% violate; best seen 0.00012 (2^-13.03)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=7101, accuracy_bits=10.2, ffs=103, throughput_msps=8.32, max_abs_err=0.000865 (2^-10.18), power_index=0.168
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=7322, accuracy_bits=11.3, ffs=104, throughput_msps=8.32, max_abs_err=0.0004 (2^-11.29), power_index=0.172
- unrolled_k [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=4] area_um2=15134, accuracy_bits=12.3, ffs=113, throughput_msps=5.34, max_abs_err=0.0002 (2^-12.28), power_index=0.106
- unrolled_k [data_width=18 n_iter=14 angle_guard=0 frac_guard=1 rounding=round k=4] area_um2=17128, accuracy_bits=12.4, ffs=115, throughput_msps=5.13, max_abs_err=0.000179 (2^-12.45), power_index=0.115
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc m=6] area_um2=28760, accuracy_bits=12.8, ffs=219, throughput_msps=26.8, max_abs_err=0.000136 (2^-12.84), power_index=0.0291
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=5] area_um2=31098, accuracy_bits=13, ffs=283, throughput_msps=32, max_abs_err=0.00012 (2^-13.03), power_index=0.0341
Front coverage: area_um2 7101..31098 (HV reference 40000); accuracy_bits 10.2..13 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 20 evals, 12 feasible; max throughput seen 11.8 MSPS; best accuracy 11.29 bits; best feasible area_um2=7101; feasible ranges: data_width 15..17, n_iter 14..16, angle_guard -2..0, frac_guard 0..1
- unrolled_k: 30 evals, 17 feasible; max throughput seen 7.52 MSPS; best accuracy 12.45 bits; best feasible area_um2=15134; feasible ranges: data_width 16..18, n_iter 12..14, angle_guard -1..0, frac_guard 0..1, k 4..8
- pipelined: 50 evals, 29 feasible; max throughput seen 180 MSPS; best accuracy 12.61 bits; best feasible area_um2=32426; feasible ranges: data_width 15..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
- pipelined_m: 100 evals, 78 feasible; max throughput seen 91.1 MSPS; best accuracy 13.03 bits; best feasible area_um2=19348; feasible ranges: data_width 15..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focusing on the two families that define the current front's extremes. Iterative needs to extend its accuracy reach; Pipelined_m needs to reduce its area penalty. Unrolled_k is dominated by Iterative in area and Pipelined_m in throughput/accuracy, so it is excluded to save budget.*)
- `iterative` (20 evals): data_width=16..18, n_iter=14..18, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round. *Why:* Iterative is the area champion. We need to explore if increasing n_iter or guards can push accuracy bits higher (towards 12-13) while keeping area under 10k um^2, filling the gap between 11.3 and 12.3 bits on the front.
- `pipelined_m` (20 evals): data_width=16..18, n_iter=14..18, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, m=2..6. *Why:* Pipelined_m has the best accuracy (13 bits) but high area (19k-31k). We need to find if lower m or specific n_iter/guard combinations can reduce area significantly while maintaining >12 bits accuracy, potentially creating a better trade-off point than the current 28k+ um^2 designs.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 40 evaluations this round, 240 total; 176 feasible; hypervolume 1.224e+05 (+59.5%).

**LLM decision:** `stop` — The Pareto front is well-mapped and dominated by the iterative family, which provides the minimum area (7101 um^2) while satisfying the throughput constraint (8.32 MSPS >= 1) and the accuracy constraint (max_abs_err 0.000865 <= 0.000976562). The front spans a reasonable range of accuracy bits (10.2 to 13.8) and area (7101 to 8898 um^2). Other families (unrolled_k, pipelined, pipelined_m) have significantly higher areas (15134, 32426, 19348 um^2 respectively) and do not offer better trade-offs for the 'min area' objective. Since this is the final round and the iterative family clearly dominates the feasible space for the primary objective of minimizing area, no further exploration is needed.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.224e+05 (gain this round: +59.5%).
Feasible designs: 176 of 240 evaluations (144 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 180
- max_abs_err <= 0.000976562: 27% violate; best seen 6.92e-05 (2^-13.82)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=7101, accuracy_bits=10.2, ffs=103, throughput_msps=8.32, max_abs_err=0.000865 (2^-10.18), power_index=0.168
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=7322, accuracy_bits=11.3, ffs=104, throughput_msps=8.32, max_abs_err=0.0004 (2^-11.29), power_index=0.172
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=7495, accuracy_bits=11.7, ffs=105, throughput_msps=7.16, max_abs_err=0.000301 (2^-11.70), power_index=0.195
- iterative [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=8168, accuracy_bits=12.5, ffs=116, throughput_msps=7.42, max_abs_err=0.000175 (2^-12.48), power_index=0.191
- iterative [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=8253, accuracy_bits=13, ffs=116, throughput_msps=7.01, max_abs_err=0.000119 (2^-13.04), power_index=0.204
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=8326, accuracy_bits=13.2, ffs=116, throughput_msps=6.64, max_abs_err=0.000108 (2^-13.18), power_index=0.216
- iterative [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=8898, accuracy_bits=13.8, ffs=121, throughput_msps=6.09, max_abs_err=6.92e-05 (2^-13.82), power_index=0.24
Front coverage: area_um2 7101..8898 (HV reference 40000); accuracy_bits 10.2..13.8 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 40 evals, 32 feasible; max throughput seen 11.8 MSPS; best accuracy 13.82 bits; best feasible area_um2=7101; feasible ranges: data_width 15..18, n_iter 14..18, angle_guard -2..1, frac_guard 0..2
- unrolled_k: 30 evals, 17 feasible; max throughput seen 7.52 MSPS; best accuracy 12.45 bits; best feasible area_um2=15134; feasible ranges: data_width 16..18, n_iter 12..14, angle_guard -1..0, frac_guard 0..1, k 4..8
- pipelined: 50 evals, 29 feasible; max throughput seen 180 MSPS; best accuracy 12.61 bits; best feasible area_um2=32426; feasible ranges: data_width 15..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
- pipelined_m: 120 evals, 98 feasible; max throughput seen 91.1 MSPS; best accuracy 13.54 bits; best feasible area_um2=19348; feasible ranges: data_width 15..18, n_iter 12..18, angle_guard -2..1, frac_guard 0..2, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (7 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 335 feasible; hypervolume 4.256e+05 (+247.7%).

**No LLM call** (code's front-mapping round): The Pareto front is well-mapped and dominated by the iterative family, which provides the minimum area (7101 um^2) while satisfying the throughput constraint (8.32 MSPS >= 1) and the accuracy constraint (max_abs_err 0.000865 <= 0.000976562). The front spans a reasonable range of accuracy bits (10.2 to 13.8) and area (7101 to 8898 um^2). Other families (unrolled_k, pipelined, pipelined_m) have significantly higher areas (15134, 32426, 19348 um^2 respectively) and do not offer better trade-offs for the 'min area' objective. Since this is the final round and the iterative family clearly dominates the feasible space for the primary objective of minimizing area, no further exploration is needed.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.256e+05 (gain this round: +247.7%).
Feasible designs: 335 of 400 evaluations (288 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 180
- max_abs_err <= 0.000976562: 16% violate; best seen 3.55e-08 (2^-24.75)

Pareto front (feasible, 36 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=7101, accuracy_bits=10.2, ffs=103, throughput_msps=8.32, max_abs_err=0.000865 (2^-10.18), power_index=0.168
- iterative [data_width=17 n_iter=22 angle_guard=1 frac_guard=0 rounding=round] area_um2=8119, accuracy_bits=12.7, ffs=112, throughput_msps=5.24, max_abs_err=0.000149 (2^-12.71), power_index=0.275
- iterative [data_width=18 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=8626, accuracy_bits=13.3, ffs=119, throughput_msps=6.01, max_abs_err=9.61e-05 (2^-13.35), power_index=0.246
- iterative [data_width=19 n_iter=20 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=9508, accuracy_bits=14.6, ffs=127, throughput_msps=5.12, max_abs_err=3.93e-05 (2^-14.64), power_index=0.291
- iterative [data_width=21 n_iter=23 angle_guard=3 frac_guard=0 rounding=round] area_um2=10188, accuracy_bits=16.4, ffs=136, throughput_msps=4.11, max_abs_err=1.15e-05 (2^-16.41), power_index=0.352
- iterative [data_width=23 n_iter=24 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=10947, accuracy_bits=17.4, ffs=147, throughput_msps=3.73, max_abs_err=5.84e-06 (2^-17.39), power_index=0.394
- iterative [data_width=24 n_iter=22 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=12012, accuracy_bits=19.4, ffs=154, throughput_msps=4.03, max_abs_err=1.47e-06 (2^-19.37), power_index=0.391
- iterative [data_width=27 n_iter=24 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=12935, accuracy_bits=21, ffs=167, throughput_msps=3.44, max_abs_err=4.68e-07 (2^-21.03), power_index=0.457
- iterative [data_width=28 n_iter=27 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=13630, accuracy_bits=22.2, ffs=173, throughput_msps=3.01, max_abs_err=2.02e-07 (2^-22.24), power_index=0.529
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=2 rounding=round] area_um2=17358, accuracy_bits=24.7, ffs=179, throughput_msps=2.77, max_abs_err=3.55e-08 (2^-24.75), power_index=0.626
Front coverage: area_um2 7101..17358 (HV reference 40000); accuracy_bits 10.2..24.7 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 200 evals, 191 feasible; max throughput seen 11.8 MSPS; best accuracy 24.75 bits; best feasible area_um2=7101; feasible ranges: data_width 15..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 30 evals, 17 feasible; max throughput seen 7.52 MSPS; best accuracy 12.45 bits; best feasible area_um2=15134; feasible ranges: data_width 16..18, n_iter 12..14, angle_guard -1..0, frac_guard 0..1, k 4..8
- pipelined: 50 evals, 29 feasible; max throughput seen 180 MSPS; best accuracy 12.61 bits; best feasible area_um2=32426; feasible ranges: data_width 15..18, n_iter 12..16, angle_guard -2..0, frac_guard 0..1
- pipelined_m: 120 evals, 98 feasible; max throughput seen 91.1 MSPS; best accuracy 13.54 bits; best feasible area_um2=19348; feasible ranges: data_width 15..18, n_iter 12..18, angle_guard -2..1, frac_guard 0..2, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 9884 in, 3341 out
- provider-reported cost: $0.0128
- full prompts and replies: `llm_trace.jsonl`

