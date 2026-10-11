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
`iterative:data_width=17,n_iter=17,angle_guard=-1,frac_guard=0,rounding=trunc` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 7701 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 2052 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 109 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 136 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 6.8 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 20 | exact: schedule |
| latency_ns | 147 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.212 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000375 (2^-11.38) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 9.58e-05 (2^-13.35) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.14 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 11.4 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 20 cycles, a new input every 20 cycle(s). DDS tone from its exact outputs: SFDR 89.7 dBc, SNR 78.2 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (31 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=17,n_iter=17,angle_guard=-1,frac_guard=0,rounding=trunc` | 7701 | 109 | 6.8 | 20 | 0.212 | 0.000375 (2^-11.38) | 11.38 |
| 1 | `iterative:data_width=16,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 7721 | 108 | 6.3 | 20 | 0.211 | 0.000285 (2^-11.78) | 11.78 |
| 2 | `iterative:data_width=17,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 8149 | 114 | 6.1 | 20 | 0.223 | 0.000146 (2^-12.74) | 12.74 |
| 3 | `iterative:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 8317 | 117 | 6.8 | 18 | 0.205 | 0.000109 (2^-13.17) | 13.17 |
| 4 | `iterative:data_width=17,n_iter=20,angle_guard=3,frac_guard=2,rounding=trunc` | 8706 | 118 | 5.3 | 23 | 0.269 | 9.91e-05 (2^-13.30) | 13.30 |
| 5 | `iterative:data_width=18,n_iter=18,angle_guard=3,frac_guard=1,rounding=trunc` | 8752 | 121 | 5.6 | 21 | 0.25 | 8.72e-05 (2^-13.49) | 13.49 |
| 6 | `iterative:data_width=19,n_iter=18,angle_guard=3,frac_guard=0,rounding=trunc` | 8859 | 125 | 5.4 | 21 | 0.255 | 7.8e-05 (2^-13.65) | 13.65 |
| 7 | `iterative:data_width=19,n_iter=17,angle_guard=3,frac_guard=1,rounding=trunc` | 9132 | 127 | 5.7 | 20 | 0.249 | 4.85e-05 (2^-14.33) | 14.33 |
| 8 | `iterative:data_width=19,n_iter=30,angle_guard=3,frac_guard=0,rounding=round` | 9284 | 125 | 3.5 | 33 | 0.409 | 3.74e-05 (2^-14.71) | 14.71 |
| 9 | `iterative:data_width=18,n_iter=24,angle_guard=4,frac_guard=3,rounding=trunc` | 9664 | 127 | 4.2 | 27 | 0.344 | 3.67e-05 (2^-14.73) | 14.73 |
| 10 | `iterative:data_width=19,n_iter=22,angle_guard=3,frac_guard=2,rounding=trunc` | 9695 | 129 | 4.6 | 25 | 0.322 | 2.62e-05 (2^-15.22) | 15.22 |
| 11 | `iterative:data_width=19,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 9795 | 130 | 5.4 | 21 | 0.273 | 2.51e-05 (2^-15.28) | 15.28 |
| 12 | `iterative:data_width=21,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 9861 | 136 | 5.3 | 20 | 0.267 | 2.15e-05 (2^-15.50) | 15.50 |
| 13 | `iterative:data_width=21,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 9892 | 134 | 5.2 | 22 | 0.291 | 1.29e-05 (2^-16.24) | 16.24 |
| 14 | `iterative:data_width=21,n_iter=28,angle_guard=4,frac_guard=0,rounding=round` | 10313 | 137 | 3.3 | 31 | 0.424 | 1.15e-05 (2^-16.41) | 16.41 |
| 15 | `iterative:data_width=22,n_iter=18,angle_guard=3,frac_guard=1,rounding=trunc` | 10513 | 143 | 4.9 | 21 | 0.297 | 1.08e-05 (2^-16.50) | 16.50 |
| 16 | `iterative:data_width=21,n_iter=29,angle_guard=2,frac_guard=2,rounding=trunc` | 10682 | 139 | 3.4 | 32 | 0.449 | 9.78e-06 (2^-16.64) | 16.64 |
| 17 | `iterative:data_width=23,n_iter=22,angle_guard=1,frac_guard=0,rounding=trunc` | 10760 | 144 | 4.3 | 25 | 0.359 | 5.86e-06 (2^-17.38) | 17.38 |
| 18 | `iterative:data_width=22,n_iter=28,angle_guard=4,frac_guard=0,rounding=round` | 10825 | 142 | 3.3 | 31 | 0.443 | 5.23e-06 (2^-17.54) | 17.54 |
| 19 | `iterative:data_width=23,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc` | 11141 | 147 | 4.3 | 25 | 0.368 | 3.16e-06 (2^-18.27) | 18.27 |
| 20 | `iterative:data_width=23,n_iter=26,angle_guard=2,frac_guard=0,rounding=round` | 11199 | 146 | 3.6 | 29 | 0.426 | 2.9e-06 (2^-18.39) | 18.39 |
| 21 | `iterative:data_width=22,n_iter=22,angle_guard=3,frac_guard=3,rounding=trunc` | 11543 | 148 | 4.2 | 25 | 0.375 | 2.39e-06 (2^-18.67) | 18.67 |
| 22 | `iterative:data_width=25,n_iter=21,angle_guard=1,frac_guard=0,rounding=round` | 11907 | 155 | 4.2 | 24 | 0.376 | 1.73e-06 (2^-19.14) | 19.14 |
| 23 | `iterative:data_width=25,n_iter=24,angle_guard=3,frac_guard=0,rounding=trunc` | 11973 | 158 | 3.5 | 27 | 0.427 | 1.41e-06 (2^-19.43) | 19.43 |
| 24 | `iterative:data_width=26,n_iter=24,angle_guard=2,frac_guard=0,rounding=trunc` | 12423 | 162 | 3.5 | 27 | 0.441 | 7.61e-07 (2^-20.32) | 20.32 |
| 25 | `iterative:data_width=26,n_iter=24,angle_guard=2,frac_guard=0,rounding=round` | 12702 | 162 | 3.5 | 27 | 0.445 | 3.67e-07 (2^-21.38) | 21.38 |
| 26 | `iterative:data_width=27,n_iter=24,angle_guard=1,frac_guard=1,rounding=trunc` | 13278 | 169 | 3.5 | 27 | 0.464 | 3.19e-07 (2^-21.58) | 21.58 |
| 27 | `iterative:data_width=27,n_iter=30,angle_guard=1,frac_guard=0,rounding=round` | 13406 | 166 | 2.9 | 33 | 0.566 | 2.33e-07 (2^-22.03) | 22.03 |
| 28 | `iterative:data_width=28,n_iter=26,angle_guard=3,frac_guard=0,rounding=trunc` | 13645 | 174 | 3.0 | 29 | 0.514 | 2.04e-07 (2^-22.23) | 22.23 |
| 29 | `iterative:data_width=28,n_iter=27,angle_guard=2,frac_guard=0,rounding=round` | 13946 | 173 | 3.0 | 30 | 0.535 | 1.02e-07 (2^-23.23) | 23.23 |
| 30 | `iterative:data_width=28,n_iter=29,angle_guard=4,frac_guard=4,rounding=trunc` | 15684 | 184 | 2.7 | 32 | 0.623 | 2.74e-08 (2^-25.12) | 25.12 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec's only objective is cell area with a loose 1 MSPS throughput floor and a 2^-10 error ceiling, so the front should be dominated by the smallest-area family (iterative) at accuracies just above the threshold, with larger W/N buying accuracy at higher area. I give iterative the majority of round-1 budget over a box that brackets the accuracy threshold (W 10-22, N 8-26, both guard ranges, both rounding modes, since round can buy accuracy for free area-wise) and spend the remainder on the three parallel families at narrower boxes to verify they are dominated and to catch any surprise front member. Later rounds will re-allocate toward whichever family actually holds the front and toward the accuracy/area knee.*)
- `iterative` (60 evals): data_width=10..22, n_iter=8..26, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Area is the only objective and the 1 MSPS constraint is trivially met by a shared datapath (N+3 cycles at a few hundred MHz is still several MSPS), so the area-minimal family should own the front; the box spans the accuracy threshold (W>=12, N>=12) up to comfortably-above-2^-10 designs so the area/accuracy trade-off curve is covered.
- `unrolled_k` (15 evals): data_width=10..18, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* Replicates the datapath k-fold for throughput we do not need, so it should be area-dominated, but a small share checks whether any k gives a cheaper register/shifter mix at the same accuracy and keeps the front honest.
- `pipelined_m` (15 evals): data_width=10..18, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Large m approaches the iterative area while still giving 1 result/cycle; worth probing in case its higher Fmax lets a smaller W/N meet the error bound at lower area, and it is the most plausible non-iterative front member.
- `pipelined` (10 evals): data_width=10..16, n_iter=8..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* One full-width register per micro-rotation makes this the most area-expensive family; a small share confirms it is dominated and guards against an unexpected Fmax/area interaction.

**Result (code):** 100 evaluations this round, 100 total; 46 feasible; hypervolume 2.028e+05 (n/a).

**LLM decision:** `map_front` — All 10 Pareto points are `iterative`; the other families are strictly worse on the area axis (best feasible area: iterative 7806 um^2, unrolled_k 9607, pipelined_m 24396, pipelined 47147). Under a min-area objective with only a >=1 MSPS / <=2^-10 error constraint, the feasible throughput is met everywhere (best seen 201 MSPS) and the error constraint is met by the whole front (worst front point 2^-11.78), so both the min-area pick and the hypervolume live in the iterative family. The front is nevertheless only a thin slice of the trade-off: data_width spans 16..20 of the registry's 8..28, and accuracy_bits spans 11.8..16.6 against an HV accuracy reference of 10, so the staircase's top end is truncated at 16.6 bits while nothing below area 7806 was found feasible. Both the low-area end (smaller data_width with enough n_iter/guard bits, error floor of ~2^-(W-1) still leaves headroom to the 2^-10 limit) and the high-accuracy end (larger data_width/n_iter) are unexplored, and each end carries large HV weight because the area reference is 40000. A full-range NSGA-II over the on-front family, seeded with the current front, is therefore the highest-value use of this round; refinement around the current narrow band would only re-sample the same region.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2.028e+05 (gain this round: n/a (first round)).
Feasible designs: 46 of 100 evaluations (40 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 54% violate; best seen 1e-05 (2^-16.61)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=23 angle_guard=3 frac_guard=0 rounding=round] area_um2=7806, accuracy_bits=11.8, ffs=108, throughput_msps=4.85, max_abs_err=0.000285 (2^-11.78), power_index=0.276
- iterative [data_width=17 n_iter=25 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=8222, accuracy_bits=11.8, ffs=114, throughput_msps=4.68, max_abs_err=0.000281 (2^-11.80), power_index=0.313
- iterative [data_width=17 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=8643, accuracy_bits=13.1, ffs=117, throughput_msps=5.49, max_abs_err=0.000113 (2^-13.11), power_index=0.267
- iterative [data_width=17 n_iter=20 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=8706, accuracy_bits=13.3, ffs=118, throughput_msps=5.3, max_abs_err=9.91e-05 (2^-13.30), power_index=0.269
- iterative [data_width=17 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] area_um2=10202, accuracy_bits=13.7, ffs=117, throughput_msps=6.01, max_abs_err=7.61e-05 (2^-13.68), power_index=0.263
- iterative [data_width=19 n_iter=25 angle_guard=0 frac_guard=4 rounding=trunc] area_um2=10341, accuracy_bits=14.1, ffs=130, throughput_msps=3.94, max_abs_err=5.66e-05 (2^-14.11), power_index=0.373
- iterative [data_width=17 n_iter=23 angle_guard=3 frac_guard=2 rounding=round] area_um2=10398, accuracy_bits=14.2, ffs=118, throughput_msps=4.69, max_abs_err=5.36e-05 (2^-14.19), power_index=0.33
- iterative [data_width=19 n_iter=21 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=10410, accuracy_bits=16, ffs=134, throughput_msps=4.6, max_abs_err=1.54e-05 (2^-15.99), power_index=0.325
- iterative [data_width=19 n_iter=25 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=10595, accuracy_bits=16.2, ffs=135, throughput_msps=3.94, max_abs_err=1.32e-05 (2^-16.21), power_index=0.384
- iterative [data_width=20 n_iter=21 angle_guard=2 frac_guard=4 rounding=trunc] area_um2=10823, accuracy_bits=16.6, ffs=138, throughput_msps=4.46, max_abs_err=1e-05 (2^-16.61), power_index=0.337
Front coverage: area_um2 7806..10823 (HV reference 40000); accuracy_bits 11.8..16.6 (HV reference 10); data_width on the front 16..20 (registry 8..28).

Per family:
- iterative: 60 evals, 37 feasible; max throughput seen 13.4 MSPS; best accuracy 16.61 bits; best feasible area_um2=7806; feasible ranges: data_width 16..20, n_iter 12..26, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 5 feasible; max throughput seen 8.88 MSPS; best accuracy 12.17 bits; best feasible area_um2=9607; feasible ranges: data_width 13..16, n_iter 14..18, angle_guard -1..4, frac_guard 0..4, k 2..6
- pipelined: 10 evals, 1 feasible; max throughput seen 201 MSPS; best accuracy 12.35 bits; best feasible area_um2=47147; feasible ranges: data_width 15..15, n_iter 17..17, angle_guard 4..4, frac_guard 2..2
- pipelined_m: 15 evals, 3 feasible; max throughput seen 66.8 MSPS; best accuracy 10.48 bits; best feasible area_um2=24396; feasible ranges: data_width 16..17, n_iter 16..18, angle_guard -2..-1, frac_guard 0..1, m 5..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=15..28, n_iter=16..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (10 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 142 feasible; hypervolume 3.697e+05 (+82.3%).

**LLM decision:** `map_front` — The feasible front is 100% `iterative`: every other family's best feasible area (unrolled_k 9607, pipelined_m 24396, pipelined 47147) is worse than iterative's 7806 um^2, so none of them can sit on a min-area front and none can add hypervolume inside the (40000, 10) reference box. The front only spans area 7806..16778 against an HV reference of 40000 — i.e. it covers well under half of the area objective's range — and accuracy 11.8..22.6 bits with data_width only reaching 27 of the registry's 28. Both ends are still open: a smaller design that still clears 2^-10 (constraint is loose — best seen 2^-22.58) would extend the low-area end, and higher data_width/n_iter would extend the high-accuracy end toward the reference point. Constraints are not a risk (throughput best 201 vs >=1; error best 2^-22.58 vs 2^-10), so this is purely a front-coverage problem. With 200 of 400 evals left and 2 rounds, spend this round letting NSGA-II map the full iterative parameter ranges seeded with the current front, then use the last round to refine the min-area corner that the selection rule will pick.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3.697e+05 (gain this round: +82.3%).
Feasible designs: 142 of 200 evaluations (120 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 29% violate; best seen 1.59e-07 (2^-22.58)

Pareto front (feasible, 33 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=23 angle_guard=3 frac_guard=0 rounding=round] area_um2=7806, accuracy_bits=11.8, ffs=108, throughput_msps=4.85, max_abs_err=0.000285 (2^-11.78), power_index=0.276
- iterative [data_width=17 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=8643, accuracy_bits=13.1, ffs=117, throughput_msps=5.49, max_abs_err=0.000113 (2^-13.11), power_index=0.267
- iterative [data_width=19 n_iter=18 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=8859, accuracy_bits=13.6, ffs=125, throughput_msps=5.42, max_abs_err=7.8e-05 (2^-13.65), power_index=0.255
- iterative [data_width=18 n_iter=24 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=9664, accuracy_bits=14.7, ffs=127, throughput_msps=4.22, max_abs_err=3.67e-05 (2^-14.73), power_index=0.344
- iterative [data_width=20 n_iter=30 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=10094, accuracy_bits=15.5, ffs=132, throughput_msps=3.45, max_abs_err=2.15e-05 (2^-15.51), power_index=0.439
- iterative [data_width=20 n_iter=28 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=10702, accuracy_bits=16.5, ffs=138, throughput_msps=3.45, max_abs_err=1.05e-05 (2^-16.54), power_index=0.433
- iterative [data_width=22 n_iter=22 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=11161, accuracy_bits=18.1, ffs=146, throughput_msps=4.15, max_abs_err=3.51e-06 (2^-18.12), power_index=0.367
- iterative [data_width=26 n_iter=27 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=12532, accuracy_bits=20.1, ffs=162, throughput_msps=3.18, max_abs_err=8.79e-07 (2^-20.12), power_index=0.492
- iterative [data_width=26 n_iter=27 angle_guard=2 frac_guard=0 rounding=round] area_um2=12847, accuracy_bits=21.4, ffs=162, throughput_msps=3.18, max_abs_err=3.74e-07 (2^-21.35), power_index=0.497
- iterative [data_width=26 n_iter=27 angle_guard=2 frac_guard=4 rounding=round] area_um2=16778, accuracy_bits=22.6, ffs=171, throughput_msps=3.01, max_abs_err=1.59e-07 (2^-22.58), power_index=0.581
Front coverage: area_um2 7806..16778 (HV reference 40000); accuracy_bits 11.8..22.6 (HV reference 10); data_width on the front 16..27 (registry 8..28).

Per family:
- iterative: 160 evals, 133 feasible; max throughput seen 13.4 MSPS; best accuracy 22.58 bits; best feasible area_um2=7806; feasible ranges: data_width 16..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 5 feasible; max throughput seen 8.88 MSPS; best accuracy 12.17 bits; best feasible area_um2=9607; feasible ranges: data_width 13..16, n_iter 14..18, angle_guard -1..4, frac_guard 0..4, k 2..6
- pipelined: 10 evals, 1 feasible; max throughput seen 201 MSPS; best accuracy 12.35 bits; best feasible area_um2=47147; feasible ranges: data_width 15..15, n_iter 17..17, angle_guard 4..4, frac_guard 2..2
- pipelined_m: 15 evals, 3 feasible; max throughput seen 66.8 MSPS; best accuracy 10.48 bits; best feasible area_um2=24396; feasible ranges: data_width 16..17, n_iter 16..18, angle_guard -2..-1, frac_guard 0..1, m 5..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=15..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (33 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 238 feasible; hypervolume 4.026e+05 (+8.9%).

**LLM decision:** `map_front` — Spend the final 100-eval round mapping the front over the full ranges of the families on it. The spec selection rule is min area_um2, and every Pareto design is `iterative` (best feasible areas elsewhere are unrolled_k 9607, pipelined_m 24396, pipelined 47147, so the other families cannot win the area objective and need no further refinement). The front currently spans accuracy_bits 11.8..23.9, but the binding accuracy constraint is only 2^-10 (~10 bits) and the front's lowest-accuracy point is 11.8 bits — the mandatory region between 10 and 11.8 bits is entirely unmapped, and the feasible data_width range on the front (15..28, registry min 8) shows smaller/less-accurate designs than the current best (iterative dw=16 N=23, area 7806, 11.8 bits) are reachable, which is exactly how the area axis gets pushed below 7806 and the HV reference plane at area 40000 is better covered. The right end also has headroom (max accuracy seen 23.89 bits vs registry data_width up to 28). With HV still improving (+8.9% last round) and the front covering only part of the area/accuracy range, a seeded NSGA-II sweep over the full iterative (and, for completeness, the other feasible on-front) ranges is the highest-value use of the reserved budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 4.026e+05 (gain this round: +8.9%).
Feasible designs: 238 of 300 evaluations (204 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 21% violate; best seen 6.42e-08 (2^-23.89)

Pareto front (feasible, 36 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=23 angle_guard=3 frac_guard=0 rounding=round] area_um2=7806, accuracy_bits=11.8, ffs=108, throughput_msps=4.85, max_abs_err=0.000285 (2^-11.78), power_index=0.276
- iterative [data_width=17 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=8643, accuracy_bits=13.1, ffs=117, throughput_msps=5.49, max_abs_err=0.000113 (2^-13.11), power_index=0.267
- iterative [data_width=19 n_iter=17 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=9132, accuracy_bits=14.3, ffs=127, throughput_msps=5.7, max_abs_err=4.85e-05 (2^-14.33), power_index=0.249
- iterative [data_width=19 n_iter=22 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=9695, accuracy_bits=15.2, ffs=129, throughput_msps=4.56, max_abs_err=2.62e-05 (2^-15.22), power_index=0.322
- iterative [data_width=19 n_iter=21 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=10410, accuracy_bits=16, ffs=134, throughput_msps=4.6, max_abs_err=1.54e-05 (2^-15.99), power_index=0.325
- iterative [data_width=23 n_iter=22 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=10760, accuracy_bits=17.4, ffs=144, throughput_msps=4.28, max_abs_err=5.86e-06 (2^-17.38), power_index=0.359
- iterative [data_width=22 n_iter=22 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=11543, accuracy_bits=18.7, ffs=148, throughput_msps=4.15, max_abs_err=2.39e-06 (2^-18.67), power_index=0.375
- iterative [data_width=25 n_iter=22 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=12627, accuracy_bits=20.2, ffs=162, throughput_msps=3.81, max_abs_err=8.19e-07 (2^-20.22), power_index=0.411
- iterative [data_width=27 n_iter=24 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=13278, accuracy_bits=21.6, ffs=169, throughput_msps=3.53, max_abs_err=3.19e-07 (2^-21.58), power_index=0.464
- iterative [data_width=27 n_iter=29 angle_guard=4 frac_guard=2 rounding=round] area_um2=16762, accuracy_bits=23.9, ffs=174, throughput_msps=2.75, max_abs_err=6.42e-08 (2^-23.89), power_index=0.626
Front coverage: area_um2 7806..16762 (HV reference 40000); accuracy_bits 11.8..23.9 (HV reference 10); data_width on the front 16..27 (registry 8..28).

Per family:
- iterative: 260 evals, 229 feasible; max throughput seen 13.4 MSPS; best accuracy 23.89 bits; best feasible area_um2=7806; feasible ranges: data_width 15..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 5 feasible; max throughput seen 8.88 MSPS; best accuracy 12.17 bits; best feasible area_um2=9607; feasible ranges: data_width 13..16, n_iter 14..18, angle_guard -1..4, frac_guard 0..4, k 2..6
- pipelined: 10 evals, 1 feasible; max throughput seen 201 MSPS; best accuracy 12.35 bits; best feasible area_um2=47147; feasible ranges: data_width 15..15, n_iter 17..17, angle_guard 4..4, frac_guard 2..2
- pipelined_m: 15 evals, 3 feasible; max throughput seen 66.8 MSPS; best accuracy 10.48 bits; best feasible area_um2=24396; feasible ranges: data_width 16..17, n_iter 16..18, angle_guard -2..-1, frac_guard 0..1, m 5..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=15..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (36 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 336 feasible; hypervolume 4.356e+05 (+8.2%).

**LLM decision:** `stop` — Final round and the full 400-eval budget is spent, so the run ends here. The spec is feasible with margin: 0% of evaluations violate throughput (best seen 201 MSPS vs >= 1 required) and only 16% violate the error bound, with the best design at 2.74e-08 (2^-25.12) vs <= 2^-10. The feasible Pareto front has 31 designs covering the whole useful range: area_um2 7701..15684 against the HV reference 40000, and accuracy_bits 11.4..25.1 against the reference 10 (data_width 16..28 on the front, i.e. a broad slice of the 8..28 registry range). All four families were explored and the front is purely `iterative`; the faster families (pipelined 201 MSPS, pipelined_m 66.8 MSPS, unrolled_k 8.88 MSPS) are all far larger in area (best feasible 47147 / 24396 / 9607 um^2), so they are off the min-area front for this spec, and `map_front` is no longer available. Hypervolume did improve (+8.2% this round) but the budget is exhausted, so no further refinement is possible. The selection rule (min area_um2) picks iterative [data_width=17 n_iter=17 angle_guard=-1 frac_guard=0 rounding=trunc] at area 7701 um^2 with accuracy 11.4 bits (> 10 required) and 6.8 MSPS (> 1 required), which satisfies every constraint, so the outcome is `stop` rather than `infeasible`.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.356e+05 (gain this round: +8.2%).
Feasible designs: 336 of 400 evaluations (290 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 16% violate; best seen 2.74e-08 (2^-25.12)

Pareto front (feasible, 31 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=17 n_iter=17 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=7701, accuracy_bits=11.4, ffs=109, throughput_msps=6.8, max_abs_err=0.000375 (2^-11.38), power_index=0.212
- iterative [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=8317, accuracy_bits=13.2, ffs=117, throughput_msps=6.77, max_abs_err=0.000109 (2^-13.17), power_index=0.205
- iterative [data_width=19 n_iter=17 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=9132, accuracy_bits=14.3, ffs=127, throughput_msps=5.7, max_abs_err=4.85e-05 (2^-14.33), power_index=0.249
- iterative [data_width=19 n_iter=22 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=9695, accuracy_bits=15.2, ffs=129, throughput_msps=4.56, max_abs_err=2.62e-05 (2^-15.22), power_index=0.322
- iterative [data_width=21 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] area_um2=9892, accuracy_bits=16.2, ffs=134, throughput_msps=5.18, max_abs_err=1.29e-05 (2^-16.24), power_index=0.291
- iterative [data_width=23 n_iter=22 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=10760, accuracy_bits=17.4, ffs=144, throughput_msps=4.28, max_abs_err=5.86e-06 (2^-17.38), power_index=0.359
- iterative [data_width=23 n_iter=26 angle_guard=2 frac_guard=0 rounding=round] area_um2=11199, accuracy_bits=18.4, ffs=146, throughput_msps=3.58, max_abs_err=2.9e-06 (2^-18.39), power_index=0.426
- iterative [data_width=25 n_iter=24 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=11973, accuracy_bits=19.4, ffs=158, throughput_msps=3.53, max_abs_err=1.41e-06 (2^-19.43), power_index=0.427
- iterative [data_width=27 n_iter=30 angle_guard=1 frac_guard=0 rounding=round] area_um2=13406, accuracy_bits=22, ffs=166, throughput_msps=2.89, max_abs_err=2.33e-07 (2^-22.03), power_index=0.566
- iterative [data_width=28 n_iter=29 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=15684, accuracy_bits=25.1, ffs=184, throughput_msps=2.69, max_abs_err=2.74e-08 (2^-25.12), power_index=0.623
Front coverage: area_um2 7701..15684 (HV reference 40000); accuracy_bits 11.4..25.1 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 360 evals, 327 feasible; max throughput seen 13.4 MSPS; best accuracy 25.12 bits; best feasible area_um2=7701; feasible ranges: data_width 15..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 15 evals, 5 feasible; max throughput seen 8.88 MSPS; best accuracy 12.17 bits; best feasible area_um2=9607; feasible ranges: data_width 13..16, n_iter 14..18, angle_guard -1..4, frac_guard 0..4, k 2..6
- pipelined: 10 evals, 1 feasible; max throughput seen 201 MSPS; best accuracy 12.35 bits; best feasible area_um2=47147; feasible ranges: data_width 15..15, n_iter 17..17, angle_guard 4..4, frac_guard 2..2
- pipelined_m: 15 evals, 3 feasible; max throughput seen 66.8 MSPS; best accuracy 10.48 bits; best feasible area_um2=24396; feasible ranges: data_width 16..17, n_iter 16..18, angle_guard -2..-1, frac_guard 0..1, m 5..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 14031 in, 15117 out
- provider-reported cost: $0.0137
- full prompts and replies: `llm_trace.jsonl`

