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
`iterative:data_width=15,n_iter=13,angle_guard=0,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 6870 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1830 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 98 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 147 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 9.22 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 108 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.152 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000879 (2^-10.15) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 7.2 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.00022 (2^-12.15) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.8 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.2 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 16 cycle(s). DDS tone from its exact outputs: SFDR 83.5 dBc, SNR 70.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (43 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=13,angle_guard=0,frac_guard=0,rounding=round` | 6870 | 98 | 9.2 | 16 | 0.152 | 0.000879 (2^-10.15) | 10.15 |
| 1 | `iterative:data_width=15,n_iter=13,angle_guard=2,frac_guard=0,rounding=round` | 6997 | 101 | 8.5 | 16 | 0.155 | 0.000642 (2^-10.61) | 10.61 |
| 2 | `iterative:data_width=15,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 7206 | 102 | 7.4 | 19 | 0.188 | 0.000594 (2^-10.72) | 10.72 |
| 3 | `iterative:data_width=15,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 7293 | 103 | 6.5 | 20 | 0.2 | 0.000546 (2^-10.84) | 10.84 |
| 4 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 7322 | 104 | 8.3 | 17 | 0.172 | 0.0004 (2^-11.29) | 11.29 |
| 5 | `iterative:data_width=16,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 7383 | 104 | 7.9 | 18 | 0.182 | 0.000373 (2^-11.39) | 11.39 |
| 6 | `iterative:data_width=15,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 7529 | 105 | 7.6 | 18 | 0.185 | 0.000344 (2^-11.51) | 11.51 |
| 7 | `iterative:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=trunc` | 7639 | 109 | 7.4 | 17 | 0.18 | 0.000338 (2^-11.53) | 11.53 |
| 8 | `iterative:data_width=16,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 7740 | 106 | 4.4 | 31 | 0.324 | 0.000301 (2^-11.70) | 11.70 |
| 9 | `iterative:data_width=16,n_iter=28,angle_guard=2,frac_guard=0,rounding=round` | 7803 | 107 | 4.2 | 31 | 0.327 | 0.000285 (2^-11.78) | 11.78 |
| 10 | `iterative:data_width=17,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 7847 | 109 | 7.2 | 19 | 0.203 | 0.000244 (2^-12.00) | 12.00 |
| 11 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 7933 | 111 | 7.3 | 18 | 0.195 | 0.000241 (2^-12.02) | 12.02 |
| 12 | `iterative:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc` | 7967 | 114 | 7.4 | 17 | 0.187 | 0.000235 (2^-12.06) | 12.06 |
| 13 | `iterative:data_width=17,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 7974 | 112 | 6.6 | 19 | 0.207 | 0.000139 (2^-12.81) | 12.81 |
| 14 | `iterative:data_width=17,n_iter=15,angle_guard=3,frac_guard=2,rounding=trunc` | 8400 | 117 | 6.8 | 18 | 0.206 | 0.00013 (2^-12.91) | 12.91 |
| 15 | `iterative:data_width=19,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 8615 | 119 | 6.6 | 19 | 0.222 | 0.000102 (2^-13.26) | 13.26 |
| 16 | `iterative:data_width=18,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 8656 | 117 | 4.1 | 31 | 0.36 | 9.26e-05 (2^-13.40) | 13.40 |
| 17 | `iterative:data_width=18,n_iter=18,angle_guard=4,frac_guard=1,rounding=trunc` | 8816 | 123 | 5.4 | 21 | 0.252 | 8.72e-05 (2^-13.49) | 13.49 |
| 18 | `iterative:data_width=19,n_iter=19,angle_guard=4,frac_guard=0,rounding=trunc` | 8959 | 126 | 5.0 | 22 | 0.27 | 7.8e-05 (2^-13.65) | 13.65 |
| 19 | `iterative:data_width=20,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 9031 | 125 | 6.4 | 19 | 0.233 | 6.98e-05 (2^-13.81) | 13.81 |
| 20 | `iterative:data_width=20,n_iter=16,angle_guard=4,frac_guard=0,rounding=trunc` | 9166 | 130 | 5.6 | 19 | 0.24 | 5.76e-05 (2^-14.08) | 14.08 |
| 21 | `iterative:data_width=18,n_iter=19,angle_guard=4,frac_guard=2,rounding=trunc` | 9197 | 125 | 5.2 | 22 | 0.272 | 4.84e-05 (2^-14.33) | 14.33 |
| 22 | `iterative:data_width=20,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc` | 9236 | 129 | 5.4 | 21 | 0.265 | 4.23e-05 (2^-14.53) | 14.53 |
| 23 | `iterative:data_width=20,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc` | 9442 | 129 | 5.6 | 21 | 0.268 | 3.75e-05 (2^-14.70) | 14.70 |
| 24 | `iterative:data_width=20,n_iter=18,angle_guard=4,frac_guard=1,rounding=trunc` | 9696 | 134 | 5.1 | 21 | 0.276 | 2.4e-05 (2^-15.35) | 15.35 |
| 25 | `iterative:data_width=19,n_iter=21,angle_guard=2,frac_guard=3,rounding=trunc` | 9977 | 130 | 4.7 | 24 | 0.315 | 2.18e-05 (2^-15.49) | 15.49 |
| 26 | `iterative:data_width=21,n_iter=28,angle_guard=0,frac_guard=0,rounding=round` | 10059 | 132 | 3.8 | 31 | 0.412 | 1.79e-05 (2^-15.77) | 15.77 |
| 27 | `iterative:data_width=20,n_iter=22,angle_guard=1,frac_guard=3,rounding=trunc` | 10439 | 135 | 4.4 | 25 | 0.341 | 1.68e-05 (2^-15.86) | 15.86 |
| 28 | `iterative:data_width=20,n_iter=25,angle_guard=3,frac_guard=3,rounding=trunc` | 10638 | 137 | 3.9 | 28 | 0.388 | 1e-05 (2^-16.61) | 16.61 |
| 29 | `iterative:data_width=23,n_iter=21,angle_guard=4,frac_guard=0,rounding=trunc` | 10902 | 148 | 4.1 | 24 | 0.351 | 5.84e-06 (2^-17.39) | 17.39 |
| 30 | `iterative:data_width=21,n_iter=20,angle_guard=4,frac_guard=3,rounding=trunc` | 10984 | 143 | 4.5 | 23 | 0.332 | 5.58e-06 (2^-17.45) | 17.45 |
| 31 | `iterative:data_width=22,n_iter=21,angle_guard=2,frac_guard=2,rounding=trunc` | 11037 | 144 | 4.5 | 24 | 0.349 | 3.8e-06 (2^-18.01) | 18.01 |
| 32 | `iterative:data_width=23,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc` | 11141 | 147 | 4.3 | 25 | 0.368 | 3.16e-06 (2^-18.27) | 18.27 |
| 33 | `iterative:data_width=25,n_iter=25,angle_guard=-1,frac_guard=0,rounding=trunc` | 11756 | 153 | 3.7 | 28 | 0.432 | 2.56e-06 (2^-18.57) | 18.57 |
| 34 | `iterative:data_width=23,n_iter=23,angle_guard=4,frac_guard=3,rounding=trunc` | 12168 | 154 | 3.8 | 26 | 0.409 | 1.17e-06 (2^-19.70) | 19.70 |
| 35 | `iterative:data_width=26,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 12808 | 161 | 3.2 | 31 | 0.511 | 3.95e-07 (2^-21.27) | 21.27 |
| 36 | `iterative:data_width=26,n_iter=25,angle_guard=3,frac_guard=2,rounding=trunc` | 13370 | 167 | 3.3 | 28 | 0.481 | 2.63e-07 (2^-21.86) | 21.86 |
| 37 | `iterative:data_width=28,n_iter=28,angle_guard=1,frac_guard=0,rounding=trunc` | 13603 | 172 | 3.0 | 31 | 0.545 | 2.4e-07 (2^-21.99) | 21.99 |
| 38 | `iterative:data_width=28,n_iter=28,angle_guard=3,frac_guard=0,rounding=trunc` | 13730 | 174 | 2.8 | 31 | 0.551 | 2.17e-07 (2^-22.13) | 22.13 |
| 39 | `iterative:data_width=28,n_iter=28,angle_guard=0,frac_guard=0,rounding=round` | 13867 | 171 | 3.1 | 31 | 0.547 | 1.65e-07 (2^-22.53) | 22.53 |
| 40 | `iterative:data_width=28,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 13931 | 172 | 3.0 | 31 | 0.551 | 1.32e-07 (2^-22.85) | 22.85 |
| 41 | `iterative:data_width=28,n_iter=27,angle_guard=1,frac_guard=4,rounding=trunc` | 15336 | 181 | 2.9 | 30 | 0.572 | 8.28e-08 (2^-23.53) | 23.53 |
| 42 | `iterative:data_width=28,n_iter=28,angle_guard=4,frac_guard=4,rounding=trunc` | 15611 | 184 | 2.8 | 31 | 0.602 | 3e-08 (2^-24.99) | 24.99 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec only needs >=1 MSPS and <=2^-10 error, so throughput is nearly free and cell area dominates. Accuracy depends only on (data_width, n_iter, angle_guard, frac_guard, rounding), identical across families, so the Pareto front is essentially area vs accuracy_bits: the shared-datapath iterative family should own it, with pipelined_m/unrolled_k/pipelined only checked for dominance. Round 1 therefore puts 70% of the 100 evals on iterative over the plausible accuracy band (W 11-20, N 10-20, full guard/rounding freedom) and spends the rest on the other three families to confirm they do not undercut it before later rounds concentrate the budget on the front.*)
- `iterative` (70 evals): data_width=11..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Shared-datapath iterative is the area-minimal family, and the 1 MSPS constraint is trivially met (Fmax/(N+3) >= 1 MHz needs only ~23 MHz at N=20), so this is where the area-vs-accuracy Pareto front should live. Ranges bracket the feasible accuracy boundary (W~12, N~10-12 for 2^-10) up to ~19-20 accuracy bits, with full guard/rounding freedom to trade angle-path width against datapath width.
- `pipelined_m` (15 evals): data_width=11..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* Large m keeps register count low while still giving 1 result/cycle; it is the only non-iterative family that could plausibly approach iterative area, so a modest share checks whether it ever undercuts the front at the required accuracy.
- `unrolled_k` (10 evals): data_width=11..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* High k gives near-pipelined throughput with fewer registers than full pipelining; included at low share to confirm it is area-dominated by iterative for this 1 MSPS spec and to catch any surprise on the front.
- `pipelined` (5 evals): data_width=11..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Full pipelining has N adders plus N register stages, so it should be strictly area-dominated here; a small share verifies that claim rather than assuming it, since the front must be mapped, not guessed.

**Result (code):** 100 evaluations this round, 100 total; 68 feasible; hypervolume 1.854e+05 (n/a).

**LLM decision:** `map_front` — The 13-design front is entirely `iterative` and spans only area_um2 6997..11565 against the HV reference of 40000 (≈14% of the area span) and data_width 14..20 against the registry's 8..28, so the low-area end and the high-accuracy end of the trade-off curve are essentially unmapped. The lowest-accuracy front point is 10.6 bits while the constraint allows down to 10 bits, so smaller-area designs (data_width 13-14, n_iter 12-13) plausibly exist just above the error limit and would add large HV rectangles near the reference point. The other families cannot help the two objectives: their best feasible areas (unrolled_k 15498, pipelined_m 24267, pipelined 45821) are all dominated by iterative's 6997, and throughput is only a constraint (best seen 163 MSPS vs required 1), so they contribute nothing to the area/accuracy hypervolume. Handing this round to a seeded NSGA-II coverage search over the full iterative ranges is therefore the best use of the remaining budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.854e+05 (gain this round: n/a (first round)).
Feasible designs: 68 of 100 evaluations (63 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 163
- max_abs_err <= 0.000976562: 32% violate; best seen 1.59e-05 (2^-15.94)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=2 frac_guard=0 rounding=round] area_um2=6997, accuracy_bits=10.6, ffs=101, throughput_msps=8.5, max_abs_err=0.000642 (2^-10.61), power_index=0.155
- iterative [data_width=14 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7471, accuracy_bits=10.9, ffs=102, throughput_msps=7.16, max_abs_err=0.000533 (2^-10.87), power_index=0.191
- iterative [data_width=16 n_iter=18 angle_guard=4 frac_guard=1 rounding=trunc] area_um2=7936, accuracy_bits=11.6, ffs=112, throughput_msps=5.8, max_abs_err=0.000313 (2^-11.64), power_index=0.228
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=7967, accuracy_bits=12.1, ffs=114, throughput_msps=7.42, max_abs_err=0.000235 (2^-12.06), power_index=0.187
- iterative [data_width=18 n_iter=19 angle_guard=-1 frac_guard=1 rounding=trunc] area_um2=8535, accuracy_bits=12.3, ffs=117, throughput_msps=5.74, max_abs_err=0.000194 (2^-12.33), power_index=0.254
- iterative [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=8740, accuracy_bits=13.4, ffs=121, throughput_msps=6.77, max_abs_err=9.49e-05 (2^-13.36), power_index=0.214
- iterative [data_width=18 n_iter=18 angle_guard=4 frac_guard=1 rounding=trunc] area_um2=8816, accuracy_bits=13.5, ffs=123, throughput_msps=5.42, max_abs_err=8.72e-05 (2^-13.49), power_index=0.252
- iterative [data_width=18 n_iter=19 angle_guard=4 frac_guard=2 rounding=trunc] area_um2=9197, accuracy_bits=14.3, ffs=125, throughput_msps=5.18, max_abs_err=4.84e-05 (2^-14.33), power_index=0.272
- iterative [data_width=20 n_iter=18 angle_guard=4 frac_guard=1 rounding=trunc] area_um2=9696, accuracy_bits=15.3, ffs=134, throughput_msps=5.09, max_abs_err=2.4e-05 (2^-15.35), power_index=0.276
- iterative [data_width=20 n_iter=18 angle_guard=4 frac_guard=1 rounding=round] area_um2=11565, accuracy_bits=15.9, ffs=134, throughput_msps=5.09, max_abs_err=1.59e-05 (2^-15.94), power_index=0.299
Front coverage: area_um2 6997..11565 (HV reference 40000); accuracy_bits 10.6..15.9 (HV reference 10); data_width on the front 14..20 (registry 8..28).

Per family:
- iterative: 70 evals, 50 feasible; max throughput seen 9.72 MSPS; best accuracy 15.94 bits; best feasible area_um2=6997; feasible ranges: data_width 14..20, n_iter 12..20, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 10 evals, 6 feasible; max throughput seen 6.24 MSPS; best accuracy 14.07 bits; best feasible area_um2=15498; feasible ranges: data_width 15..19, n_iter 12..16, angle_guard -1..3, frac_guard 1..4, k 4..7
- pipelined: 5 evals, 3 feasible; max throughput seen 163 MSPS; best accuracy 13.81 bits; best feasible area_um2=45821; feasible ranges: data_width 14..18, n_iter 19..20, angle_guard 1..1, frac_guard 1..3
- pipelined_m: 15 evals, 9 feasible; max throughput seen 45.8 MSPS; best accuracy 14.75 bits; best feasible area_um2=24267; feasible ranges: data_width 13..19, n_iter 13..17, angle_guard 0..3, frac_guard 1..4, m 4..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=13..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (13 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 162 feasible; hypervolume 4.274e+05 (+130.5%).

**LLM decision:** `refine` — Round 2 gave +130.5% HV and a 32-point front spanning accuracy 10.6..25 bits vs an HV reference of 10 and a spec limit of 2^-10 — the accuracy axis is effectively saturated at 25 bits (W=28,N=28, area 15611). All non-iterative families bottom out at 15498 (unrolled_k), 24267 (pipelined_m) and 45821 (pipelined) um2, i.e. 2-6x the cheapest iterative point, so they cannot contribute to a min-area front or to the 'select: min area_um2' rule; throughput is a non-constraint (0% violations, best 163 vs 1 MSPS needed). The remaining HV width and the final pick both lie on the low-area side of the iterative front, where the cheapest feasible design (6997 um2, 10.61 bits) is only 0.61 bits above the constraint boundary and data_width 13-14 is entirely absent from the front. Refine there, then spend the reserved round 4 mapping the full iterative ranges.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4.274e+05 (gain this round: +130.5%).
Feasible designs: 162 of 200 evaluations (147 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 163
- max_abs_err <= 0.000976562: 19% violate; best seen 3e-08 (2^-24.99)

Pareto front (feasible, 32 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=2 frac_guard=0 rounding=round] area_um2=6997, accuracy_bits=10.6, ffs=101, throughput_msps=8.5, max_abs_err=0.000642 (2^-10.61), power_index=0.155
- iterative [data_width=14 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7471, accuracy_bits=10.9, ffs=102, throughput_msps=7.16, max_abs_err=0.000533 (2^-10.87), power_index=0.191
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=7967, accuracy_bits=12.1, ffs=114, throughput_msps=7.42, max_abs_err=0.000235 (2^-12.06), power_index=0.187
- iterative [data_width=17 n_iter=15 angle_guard=4 frac_guard=2 rounding=trunc] area_um2=8463, accuracy_bits=12.9, ffs=118, throughput_msps=6.54, max_abs_err=0.00013 (2^-12.91), power_index=0.208
- iterative [data_width=19 n_iter=19 angle_guard=4 frac_guard=0 rounding=trunc] area_um2=8959, accuracy_bits=13.6, ffs=126, throughput_msps=5.01, max_abs_err=7.8e-05 (2^-13.65), power_index=0.27
- iterative [data_width=18 n_iter=19 angle_guard=4 frac_guard=2 rounding=trunc] area_um2=9197, accuracy_bits=14.3, ffs=125, throughput_msps=5.18, max_abs_err=4.84e-05 (2^-14.33), power_index=0.272
- iterative [data_width=20 n_iter=28 angle_guard=1 frac_guard=4 rounding=trunc] area_um2=10942, accuracy_bits=15.9, ffs=137, throughput_msps=3.45, max_abs_err=1.68e-05 (2^-15.86), power_index=0.436
- iterative [data_width=26 n_iter=20 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=12401, accuracy_bits=18.8, ffs=163, throughput_msps=4.26, max_abs_err=2.15e-06 (2^-18.82), power_index=0.377
- iterative [data_width=28 n_iter=28 angle_guard=0 frac_guard=0 rounding=round] area_um2=13867, accuracy_bits=22.5, ffs=171, throughput_msps=3.07, max_abs_err=1.65e-07 (2^-22.53), power_index=0.547
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=15611, accuracy_bits=25, ffs=184, throughput_msps=2.77, max_abs_err=3e-08 (2^-24.99), power_index=0.602
Front coverage: area_um2 6997..15611 (HV reference 40000); accuracy_bits 10.6..25 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 170 evals, 144 feasible; max throughput seen 9.72 MSPS; best accuracy 24.99 bits; best feasible area_um2=6997; feasible ranges: data_width 14..28, n_iter 11..29, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 10 evals, 6 feasible; max throughput seen 6.24 MSPS; best accuracy 14.07 bits; best feasible area_um2=15498; feasible ranges: data_width 15..19, n_iter 12..16, angle_guard -1..3, frac_guard 1..4, k 4..7
- pipelined: 5 evals, 3 feasible; max throughput seen 163 MSPS; best accuracy 13.81 bits; best feasible area_um2=45821; feasible ranges: data_width 14..18, n_iter 19..20, angle_guard 1..1, frac_guard 1..3
- pipelined_m: 15 evals, 9 feasible; max throughput seen 45.8 MSPS; best accuracy 14.75 bits; best feasible area_um2=24267; feasible ranges: data_width 13..19, n_iter 13..17, angle_guard 0..3, frac_guard 1..4, m 4..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *The front is saturated on accuracy: it reaches 25 bits (W=28,N=28) against an HV reference of only 10 and a spec limit of 2^-10, so extra accuracy adds no HV. Area is the untouched axis: cheapest point is 6997 um2 and the front stops at 15611 um2, i.e. the whole high-throughput side (pipelined best feasible 45821, pipelined_m 24267, unrolled_k 15498) is 2-6x larger and can never appear on a min-area front or be picked by 'select: min area_um2'. Throughput is a non-issue (0% violations, best 163 MSPS, constraint 1 MSPS). So the only place both HV and the selection pick can still improve is the low-area feasibility boundary around data_width 13-17 / n_iter 10-16, which the coarse round-2 sweep only bracketed at 6997/10.61 bits. Reserve round 4 for map_front over the full iterative ranges (plus whatever low-area unrolled_k survives).*)
- `iterative` (85 evals): data_width=13..17, n_iter=10..16, angle_guard=-2..3, frac_guard=0..2, rounding=trunc|round. *Why:* only family on the low-area end of the front; cheapest feasible is 6997 um2 @ 10.61 bits (W=15,N=13,AG=2,FG=0,round), only 0.61 bits above the 2^-10 constraint, so the feasibility boundary is unexplored
- `unrolled_k` (15 evals): data_width=13..15, n_iter=10..14, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..3. *Why:* cheap probe: chaining 2-3 micro-rotations at low N is the only untested way a shared datapath could undercut the 16-cycle iterative schedule in area; throughput constraint (1 MSPS) is met with huge margin either way (iterative already 8.5 MSPS)

**Result (code):** 100 evaluations this round, 300 total; 224 feasible; hypervolume 4.278e+05 (+0.1%).

**LLM decision:** `map_front` — Round 3 gain was only +0.1% and the feasible front is essentially iterative-only (best area 6870 um^2 vs unrolled_k 9994, pipelined_m 24267, pipelined 45821), so the family choice is settled and the remaining work is coverage, not family search. The front already spans accuracy 10.2..25 bits (registry max ~25 at data_width=28) but its area span is 6870..15611 against an HV reference of 40000, and the min-area corner (iterative 15/13/0/0/round, 6870 um^2, 10.15 bits) sits right on the 2^-10 constraint boundary — a slightly smaller data_width could still be feasible and would move the selection-rule corner. With 100 evals left in the final round, the reserved budget should be spent running NSGA-II over the full registry ranges of the families on the front (iterative, plus unrolled_k/pipelined_m as cheap alternatives), seeded with the current 35-design front, to both close the low-area end and confirm the high-accuracy end before stopping.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 4.278e+05 (gain this round: +0.1%).
Feasible designs: 224 of 300 evaluations (193 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 163
- max_abs_err <= 0.000976562: 25% violate; best seen 3e-08 (2^-24.99)

Pareto front (feasible, 35 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=6870, accuracy_bits=10.2, ffs=98, throughput_msps=9.22, max_abs_err=0.000879 (2^-10.15), power_index=0.152
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=7383, accuracy_bits=11.4, ffs=104, throughput_msps=7.86, max_abs_err=0.000373 (2^-11.39), power_index=0.182
- iterative [data_width=16 n_iter=28 angle_guard=2 frac_guard=0 rounding=round] area_um2=7803, accuracy_bits=11.8, ffs=107, throughput_msps=4.22, max_abs_err=0.000285 (2^-11.78), power_index=0.327
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=7967, accuracy_bits=12.1, ffs=114, throughput_msps=7.42, max_abs_err=0.000235 (2^-12.06), power_index=0.187
- iterative [data_width=18 n_iter=28 angle_guard=1 frac_guard=0 rounding=round] area_um2=8656, accuracy_bits=13.4, ffs=117, throughput_msps=4.07, max_abs_err=9.26e-05 (2^-13.40), power_index=0.36
- iterative [data_width=20 n_iter=16 angle_guard=4 frac_guard=0 rounding=trunc] area_um2=9166, accuracy_bits=14.1, ffs=130, throughput_msps=5.63, max_abs_err=5.76e-05 (2^-14.08), power_index=0.24
- iterative [data_width=21 n_iter=28 angle_guard=0 frac_guard=0 rounding=round] area_um2=10059, accuracy_bits=15.8, ffs=132, throughput_msps=3.8, max_abs_err=1.79e-05 (2^-15.77), power_index=0.412
- iterative [data_width=21 n_iter=19 angle_guard=1 frac_guard=2 rounding=round] area_um2=12328, accuracy_bits=16.6, ffs=138, throughput_msps=5.01, max_abs_err=9.84e-06 (2^-16.63), power_index=0.328
- iterative [data_width=28 n_iter=28 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=13730, accuracy_bits=22.1, ffs=174, throughput_msps=2.84, max_abs_err=2.17e-07 (2^-22.13), power_index=0.551
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=15611, accuracy_bits=25, ffs=184, throughput_msps=2.77, max_abs_err=3e-08 (2^-24.99), power_index=0.602
Front coverage: area_um2 6870..15611 (HV reference 40000); accuracy_bits 10.2..25 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 255 evals, 201 feasible; max throughput seen 11 MSPS; best accuracy 24.99 bits; best feasible area_um2=6870; feasible ranges: data_width 14..28, n_iter 11..29, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 25 evals, 11 feasible; max throughput seen 9.72 MSPS; best accuracy 14.07 bits; best feasible area_um2=9994; feasible ranges: data_width 14..19, n_iter 12..16, angle_guard -1..3, frac_guard 1..4, k 2..7
- pipelined: 5 evals, 3 feasible; max throughput seen 163 MSPS; best accuracy 13.81 bits; best feasible area_um2=45821; feasible ranges: data_width 14..18, n_iter 19..20, angle_guard 1..1, frac_guard 1..3
- pipelined_m: 15 evals, 9 feasible; max throughput seen 45.8 MSPS; best accuracy 14.75 bits; best feasible area_um2=24267; feasible ranges: data_width 13..19, n_iter 13..17, angle_guard 0..3, frac_guard 1..4, m 4..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=14..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (35 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 318 feasible; hypervolume 4.317e+05 (+0.9%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the front is feasible and well covered, so no further exploration is possible or needed. Evidence: 318 of 400 evaluations are feasible (277 unique) and all four registry families have been explored, so there is no unexplored family to add. Both constraints are comfortably met by many designs — 0% of evaluations violate throughput_msps >= 1 (best seen 163 MSPS) and the best max_abs_err is 3e-08 (2^-24.99), far below the 2^-10 limit. The Pareto front spans area_um2 6870..15611 against the HV reference of 40000 and accuracy_bits 10.2..25 against the reference of 10, i.e. it already covers the objective ranges rather than a single corner, and hypervolume is still only gaining +0.9% in the final round. The selection rule (min area_um2) is served by the front's low-area end: iterative [data_width=15 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] at area_um2=6870, accuracy_bits=10.2 (max_abs_err=0.000879 <= 0.000976562) and throughput_msps=9.22 >= 1, which satisfies every constraint. Nothing in the summaries indicates an unreachable constraint, so infeasible is not warranted; stopping with the mapped front is the correct final action.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.317e+05 (gain this round: +0.9%).
Feasible designs: 318 of 400 evaluations (277 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 163
- max_abs_err <= 0.000976562: 20% violate; best seen 3e-08 (2^-24.99)

Pareto front (feasible, 43 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=6870, accuracy_bits=10.2, ffs=98, throughput_msps=9.22, max_abs_err=0.000879 (2^-10.15), power_index=0.152
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=7383, accuracy_bits=11.4, ffs=104, throughput_msps=7.86, max_abs_err=0.000373 (2^-11.39), power_index=0.182
- iterative [data_width=16 n_iter=28 angle_guard=2 frac_guard=0 rounding=round] area_um2=7803, accuracy_bits=11.8, ffs=107, throughput_msps=4.22, max_abs_err=0.000285 (2^-11.78), power_index=0.327
- iterative [data_width=17 n_iter=15 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=8400, accuracy_bits=12.9, ffs=117, throughput_msps=6.77, max_abs_err=0.00013 (2^-12.91), power_index=0.206
- iterative [data_width=20 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round] area_um2=9031, accuracy_bits=13.8, ffs=125, throughput_msps=6.41, max_abs_err=6.98e-05 (2^-13.81), power_index=0.233
- iterative [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=9442, accuracy_bits=14.7, ffs=129, throughput_msps=5.61, max_abs_err=3.75e-05 (2^-14.70), power_index=0.268
- iterative [data_width=20 n_iter=25 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=10638, accuracy_bits=16.6, ffs=137, throughput_msps=3.94, max_abs_err=1e-05 (2^-16.61), power_index=0.388
- iterative [data_width=25 n_iter=25 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=11756, accuracy_bits=18.6, ffs=153, throughput_msps=3.71, max_abs_err=2.56e-06 (2^-18.57), power_index=0.432
- iterative [data_width=28 n_iter=28 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=13603, accuracy_bits=22, ffs=172, throughput_msps=2.99, max_abs_err=2.4e-07 (2^-21.99), power_index=0.545
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=15611, accuracy_bits=25, ffs=184, throughput_msps=2.77, max_abs_err=3e-08 (2^-24.99), power_index=0.602
Front coverage: area_um2 6870..15611 (HV reference 40000); accuracy_bits 10.2..25 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 355 evals, 295 feasible; max throughput seen 11 MSPS; best accuracy 24.99 bits; best feasible area_um2=6870; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 25 evals, 11 feasible; max throughput seen 9.72 MSPS; best accuracy 14.07 bits; best feasible area_um2=9994; feasible ranges: data_width 14..19, n_iter 12..16, angle_guard -1..3, frac_guard 1..4, k 2..7
- pipelined: 5 evals, 3 feasible; max throughput seen 163 MSPS; best accuracy 13.81 bits; best feasible area_um2=45821; feasible ranges: data_width 14..18, n_iter 19..20, angle_guard 1..1, frac_guard 1..3
- pipelined_m: 15 evals, 9 feasible; max throughput seen 45.8 MSPS; best accuracy 14.75 bits; best feasible area_um2=24267; feasible ranges: data_width 13..19, n_iter 13..17, angle_guard 0..3, frac_guard 1..4, m 4..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 14893 in, 11610 out
- provider-reported cost: $0.0121
- full prompts and replies: `llm_trace.jsonl`

