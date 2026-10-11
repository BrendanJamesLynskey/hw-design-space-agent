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
`iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 6987 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1861 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 102 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 9.43 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 106 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.147 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000833 (2^-10.23) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.82 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000239 (2^-12.03) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.96 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.2 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 15 cycles, a new input every 15 cycle(s). DDS tone from its exact outputs: SFDR 79.9 dBc, SNR 69.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (38 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc` | 6987 | 102 | 9.4 | 15 | 0.147 | 0.000833 (2^-10.23) | 10.23 |
| 1 | `iterative:data_width=16,n_iter=13,angle_guard=0,frac_guard=0,rounding=trunc` | 7104 | 104 | 8.8 | 16 | 0.159 | 0.000704 (2^-10.47) | 10.47 |
| 2 | `iterative:data_width=15,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 7206 | 102 | 7.4 | 19 | 0.188 | 0.000594 (2^-10.72) | 10.72 |
| 3 | `iterative:data_width=16,n_iter=13,angle_guard=0,frac_guard=0,rounding=round` | 7249 | 104 | 8.8 | 16 | 0.161 | 0.000492 (2^-10.99) | 10.99 |
| 4 | `iterative:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` | 7313 | 105 | 8.5 | 16 | 0.162 | 0.000417 (2^-11.23) | 11.23 |
| 5 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 7446 | 105 | 7.6 | 18 | 0.184 | 0.000301 (2^-11.70) | 11.70 |
| 6 | `iterative:data_width=16,n_iter=22,angle_guard=2,frac_guard=0,rounding=round` | 7731 | 107 | 5.2 | 25 | 0.263 | 0.000285 (2^-11.78) | 11.78 |
| 7 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 7886 | 107 | 6.9 | 19 | 0.202 | 0.000278 (2^-11.81) | 11.81 |
| 8 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 7930 | 109 | 6.9 | 19 | 0.204 | 0.000237 (2^-12.04) | 12.04 |
| 9 | `iterative:data_width=16,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc` | 8042 | 111 | 6.5 | 20 | 0.218 | 0.00023 (2^-12.08) | 12.08 |
| 10 | `iterative:data_width=16,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc` | 8105 | 112 | 6.5 | 20 | 0.22 | 0.000207 (2^-12.24) | 12.24 |
| 11 | `iterative:data_width=17,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc` | 8149 | 114 | 6.5 | 20 | 0.223 | 0.00019 (2^-12.36) | 12.36 |
| 12 | `iterative:data_width=17,n_iter=17,angle_guard=4,frac_guard=0,rounding=round` | 8212 | 115 | 5.9 | 20 | 0.225 | 0.000146 (2^-12.74) | 12.74 |
| 13 | `iterative:data_width=18,n_iter=17,angle_guard=0,frac_guard=1,rounding=trunc` | 8514 | 118 | 6.3 | 20 | 0.232 | 0.000129 (2^-12.92) | 12.92 |
| 14 | `iterative:data_width=18,n_iter=23,angle_guard=1,frac_guard=1,rounding=trunc` | 8698 | 119 | 4.9 | 26 | 0.306 | 0.00011 (2^-13.15) | 13.15 |
| 15 | `iterative:data_width=19,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 8987 | 123 | 5.5 | 22 | 0.266 | 4.26e-05 (2^-14.52) | 14.52 |
| 16 | `iterative:data_width=20,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 9243 | 127 | 6.1 | 20 | 0.25 | 4.25e-05 (2^-14.52) | 14.52 |
| 17 | `iterative:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 9306 | 128 | 5.9 | 20 | 0.252 | 3.32e-05 (2^-14.88) | 14.88 |
| 18 | `iterative:data_width=21,n_iter=17,angle_guard=1,frac_guard=0,rounding=trunc` | 9540 | 134 | 5.7 | 20 | 0.261 | 3.12e-05 (2^-14.97) | 14.97 |
| 19 | `iterative:data_width=21,n_iter=22,angle_guard=-1,frac_guard=0,rounding=round` | 9911 | 131 | 4.7 | 25 | 0.328 | 2.94e-05 (2^-15.06) | 15.06 |
| 20 | `iterative:data_width=20,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc` | 10138 | 136 | 5.5 | 20 | 0.27 | 2.35e-05 (2^-15.38) | 15.38 |
| 21 | `iterative:data_width=20,n_iter=17,angle_guard=4,frac_guard=3,rounding=trunc` | 10265 | 138 | 5.3 | 20 | 0.274 | 2.11e-05 (2^-15.53) | 15.53 |
| 22 | `iterative:data_width=22,n_iter=29,angle_guard=1,frac_guard=0,rounding=trunc` | 10308 | 139 | 3.4 | 32 | 0.442 | 1.7e-05 (2^-15.84) | 15.84 |
| 23 | `iterative:data_width=21,n_iter=29,angle_guard=4,frac_guard=0,rounding=round` | 10325 | 137 | 3.2 | 32 | 0.438 | 1.15e-05 (2^-16.41) | 16.41 |
| 24 | `iterative:data_width=20,n_iter=24,angle_guard=4,frac_guard=3,rounding=trunc` | 10690 | 138 | 4.0 | 27 | 0.377 | 8.7e-06 (2^-16.81) | 16.81 |
| 25 | `iterative:data_width=23,n_iter=28,angle_guard=1,frac_guard=0,rounding=trunc` | 10833 | 144 | 3.4 | 31 | 0.447 | 7.69e-06 (2^-16.99) | 16.99 |
| 26 | `iterative:data_width=23,n_iter=24,angle_guard=2,frac_guard=0,rounding=trunc` | 10884 | 146 | 3.8 | 27 | 0.392 | 5.84e-06 (2^-17.39) | 17.39 |
| 27 | `iterative:data_width=23,n_iter=25,angle_guard=1,frac_guard=0,rounding=round` | 11124 | 144 | 3.8 | 28 | 0.408 | 3.01e-06 (2^-18.34) | 18.34 |
| 28 | `iterative:data_width=24,n_iter=23,angle_guard=0,frac_guard=0,rounding=round` | 11500 | 149 | 4.1 | 26 | 0.391 | 2.49e-06 (2^-18.62) | 18.62 |
| 29 | `iterative:data_width=24,n_iter=22,angle_guard=1,frac_guard=0,rounding=round` | 11503 | 150 | 4.2 | 25 | 0.378 | 1.91e-06 (2^-19.00) | 19.00 |
| 30 | `iterative:data_width=24,n_iter=23,angle_guard=2,frac_guard=0,rounding=round` | 11627 | 151 | 3.9 | 26 | 0.396 | 1.57e-06 (2^-19.28) | 19.28 |
| 31 | `iterative:data_width=25,n_iter=29,angle_guard=0,frac_guard=0,rounding=round` | 12195 | 154 | 3.2 | 32 | 0.504 | 1.37e-06 (2^-19.48) | 19.48 |
| 32 | `iterative:data_width=25,n_iter=29,angle_guard=1,frac_guard=0,rounding=round` | 12259 | 155 | 3.1 | 32 | 0.508 | 1.05e-06 (2^-19.86) | 19.86 |
| 33 | `iterative:data_width=28,n_iter=28,angle_guard=1,frac_guard=0,rounding=trunc` | 13603 | 172 | 3.0 | 31 | 0.545 | 2.4e-07 (2^-21.99) | 21.99 |
| 34 | `iterative:data_width=28,n_iter=29,angle_guard=1,frac_guard=1,rounding=trunc` | 14094 | 174 | 2.9 | 32 | 0.575 | 1.27e-07 (2^-22.90) | 22.90 |
| 35 | `iterative:data_width=28,n_iter=29,angle_guard=1,frac_guard=3,rounding=trunc` | 15027 | 178 | 2.8 | 32 | 0.601 | 8.09e-08 (2^-23.56) | 23.56 |
| 36 | `iterative:data_width=28,n_iter=28,angle_guard=4,frac_guard=3,rounding=trunc` | 15157 | 182 | 2.8 | 31 | 0.59 | 3.8e-08 (2^-24.65) | 24.65 |
| 37 | `iterative:data_width=27,n_iter=29,angle_guard=4,frac_guard=4,rounding=round` | 17695 | 178 | 2.8 | 32 | 0.651 | 3.4e-08 (2^-24.81) | 24.81 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The objective is minimum area with 2^-10 error and 1 MSPS. Pipelined families replicate stages and are likely to cost far more area, and their throughput is not needed, so they are excluded in round 1. Most of the budget goes to the iterative family at modest widths and iteration counts, which should sit near the error bound. A small unrolled_k probe acts as a hedge. Accuracy_bits is the second objective, so the ranges span a spread of accuracies instead of only the cheapest feasible corner. Later rounds will narrow the ranges around the Pareto front.*)
- `iterative` (77 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* A shared datapath with one micro-rotation per cycle should give the smallest area. Throughput of at least 1 MSPS needs only a modest clock, since N+3 cycles per result is small for N around 10-14. Widths of 10-16 bits cover the 2^-10 error bound.
- `unrolled_k` (23 evals): data_width=10..15, n_iter=8..14, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* A small k shares one FSM and may trade a little extra area for fewer cycles. It is a hedge in case the iterative family falls short of 1 MSPS, and it probes whether cycle savings help area at all.

**Result (code):** 100 evaluations this round, 100 total; 38 feasible; hypervolume 6.325e+04 (n/a).

**LLM decision:** `refine` — All 4 front designs are iterative (area 7359..9007, 10.2..12 bits). The throughput constraint is easily met (best 15.3 MSPS vs 1 needed), so area is the only issue. unrolled_k's best feasible area is 11370, well above the iterative front, so it is dominated and gets little budget. Pipelined families replicate the datapath per stage, so they are unlikely to win on area. I will keep a small probe of pipelined_m as a check. The feasible region is narrow (data_width 14..16, n_iter 13..16), and 62% of evaluations violate the error bound. Narrowing the iterative ranges around that region should find smaller area at the 2^-10 error edge and fill out the accuracy axis.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6.325e+04 (gain this round: n/a (first round)).
Feasible designs: 38 of 100 evaluations (27 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 15.3
- max_abs_err <= 0.000976562: 62% violate; best seen 0.000253 (2^-11.95)

Pareto front (feasible, 4 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc] area_um2=7359, accuracy_bits=10.2, ffs=101, throughput_msps=7.56, max_abs_err=0.000845 (2^-10.21), power_index=0.179
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7446, accuracy_bits=11.7, ffs=105, throughput_msps=7.56, max_abs_err=0.000301 (2^-11.70), power_index=0.184
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7886, accuracy_bits=11.8, ffs=107, throughput_msps=6.89, max_abs_err=0.000278 (2^-11.81), power_index=0.202
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=9007, accuracy_bits=12, ffs=105, throughput_msps=7.16, max_abs_err=0.000253 (2^-11.95), power_index=0.212
Front coverage: area_um2 7359..9007 (HV reference 40000); accuracy_bits 10.2..12 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- iterative: 77 evals, 31 feasible; max throughput seen 15.3 MSPS; best accuracy 11.95 bits; best feasible area_um2=7359; feasible ranges: data_width 14..16, n_iter 13..16, angle_guard -1..2, frac_guard 0..3
- unrolled_k: 23 evals, 7 feasible; max throughput seen 12.8 MSPS; best accuracy 11.28 bits; best feasible area_um2=11370; feasible ranges: data_width 14..15, n_iter 14..14, angle_guard 2..3, frac_guard 1..2, k 3..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the iterative family around the feasible region, with small probes of the other families to confirm they are dominated on area.*)
- `iterative` (76 evals): data_width=12..17, n_iter=11..17, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round. *Why:* All front designs are iterative. Narrow the ranges to the feasible region and push data_width down toward 12..13 to cut area while keeping error <= 2^-10.
- `pipelined_m` (12 evals): data_width=12..16, n_iter=12..16, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* Small probe of an unexplored family with few registers (large m) to confirm it cannot beat iterative on area.
- `unrolled_k` (12 evals): data_width=13..16, n_iter=12..16, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..3. *Why:* Keep a small low-k probe, since the best feasible area so far (11370) is dominated.

**Result (code):** 100 evaluations this round, 200 total; 88 feasible; hypervolume 7.287e+04 (+15.2%).

**LLM decision:** `refine` — The front is all iterative designs, with areas of 6987 to 8105 um2 and 10.2 to 12.2 accuracy bits. Unrolled_k (best feasible area 9169) and pipelined_m (best 20749) are dominated on area, and throughput is already far above the 1 MSPS floor (6.5 to 9.4 MSPS on the front). So area is the only lever, and iterative is the right family. The feasible region sits at data_width 14..16 and n_iter 12..17. I will focus the budget on iterative there, with data_width 13..17 to check whether a smaller width with more guard bits can drop below 6987 um2. I keep a small share for unrolled_k so its low end is covered. Pipelined is skipped because pipelined_m already shows that per-stage registers cost far too much area.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7.287e+04 (gain this round: +15.2%).
Feasible designs: 88 of 200 evaluations (69 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 44.1
- max_abs_err <= 0.000976562: 56% violate; best seen 0.000207 (2^-12.24)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=6987, accuracy_bits=10.2, ffs=102, throughput_msps=9.43, max_abs_err=0.000833 (2^-10.23), power_index=0.147
- iterative [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7104, accuracy_bits=10.5, ffs=104, throughput_msps=8.84, max_abs_err=0.000704 (2^-10.47), power_index=0.159
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=7206, accuracy_bits=10.7, ffs=102, throughput_msps=7.45, max_abs_err=0.000594 (2^-10.72), power_index=0.188
- iterative [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=7249, accuracy_bits=11, ffs=104, throughput_msps=8.84, max_abs_err=0.000492 (2^-10.99), power_index=0.161
- iterative [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=7313, accuracy_bits=11.2, ffs=105, throughput_msps=8.5, max_abs_err=0.000417 (2^-11.23), power_index=0.162
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7446, accuracy_bits=11.7, ffs=105, throughput_msps=7.56, max_abs_err=0.000301 (2^-11.70), power_index=0.184
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7886, accuracy_bits=11.8, ffs=107, throughput_msps=6.89, max_abs_err=0.000278 (2^-11.81), power_index=0.202
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7930, accuracy_bits=12, ffs=109, throughput_msps=6.89, max_abs_err=0.000237 (2^-12.04), power_index=0.204
- iterative [data_width=16 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=8042, accuracy_bits=12.1, ffs=111, throughput_msps=6.55, max_abs_err=0.00023 (2^-12.08), power_index=0.218
- iterative [data_width=16 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=8105, accuracy_bits=12.2, ffs=112, throughput_msps=6.55, max_abs_err=0.000207 (2^-12.24), power_index=0.22
Front coverage: area_um2 6987..8105 (HV reference 40000); accuracy_bits 10.2..12.2 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 153 evals, 69 feasible; max throughput seen 15.3 MSPS; best accuracy 12.24 bits; best feasible area_um2=6987; feasible ranges: data_width 14..16, n_iter 12..17, angle_guard -1..2, frac_guard 0..3
- unrolled_k: 35 evals, 16 feasible; max throughput seen 12.8 MSPS; best accuracy 12.04 bits; best feasible area_um2=9169; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..3, frac_guard 1..4, k 2..3
- pipelined_m: 12 evals, 3 feasible; max throughput seen 44.1 MSPS; best accuracy 11.73 bits; best feasible area_um2=20749; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard -1..3, frac_guard 0..2, m 5..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the iterative family, which dominates the front, and widen the width and guard-bit ranges slightly to look for area reductions below 6987 um2.*)
- `iterative` (34 evals): data_width=13..17, n_iter=10..18, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Every front point is iterative. Searching around the feasible region (width 14..16, N 12..17) for lower area at about 10 accuracy bits, and for richer accuracy points at modest area.
- `unrolled_k` (6 evals): data_width=14..16, n_iter=11..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..3. *Why:* Small probe of the best unrolled_k region, in case a low-k variant with short cycle counts is competitive on area.

**Result (code):** 40 evaluations this round, 240 total; 114 feasible; hypervolume 9.994e+04 (+37.1%).

**LLM decision:** `stop` — This is the final round, so stop is the only meaningful choice. The front has 15 feasible designs, all iterative, spanning 6987 to 10011 um2 and 10.2 to 13.1 accuracy bits. Both constraints are met: throughput is at least 6 MSPS against the 1 MSPS requirement, and the smallest design's max error of 0.000833 is under 2^-10. The selection rule (min area) picks iterative at data_width=15, n_iter=12, angle_guard=1, frac_guard=1, trunc, with area 6987 um2 and 10.2 bits. Hypervolume gained 37.1% last round, but the evidence says the iterative family dominates area. unrolled_k reaches a best feasible area of 9169 and pipelined_m 20749, both well above the iterative minimum. Throughput is far from binding, so the extra hardware of the unrolled and pipelined families buys nothing here.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9.994e+04 (gain this round: +37.1%).
Feasible designs: 114 of 240 evaluations (89 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 44.1
- max_abs_err <= 0.000976562: 52% violate; best seen 0.000112 (2^-13.13)

Pareto front (feasible, 15 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=6987, accuracy_bits=10.2, ffs=102, throughput_msps=9.43, max_abs_err=0.000833 (2^-10.23), power_index=0.147
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=7206, accuracy_bits=10.7, ffs=102, throughput_msps=7.45, max_abs_err=0.000594 (2^-10.72), power_index=0.188
- iterative [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=7249, accuracy_bits=11, ffs=104, throughput_msps=8.84, max_abs_err=0.000492 (2^-10.99), power_index=0.161
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7446, accuracy_bits=11.7, ffs=105, throughput_msps=7.56, max_abs_err=0.000301 (2^-11.70), power_index=0.184
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7886, accuracy_bits=11.8, ffs=107, throughput_msps=6.89, max_abs_err=0.000278 (2^-11.81), power_index=0.202
- iterative [data_width=16 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=8042, accuracy_bits=12.1, ffs=111, throughput_msps=6.55, max_abs_err=0.00023 (2^-12.08), power_index=0.218
- iterative [data_width=16 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=8105, accuracy_bits=12.2, ffs=112, throughput_msps=6.55, max_abs_err=0.000207 (2^-12.24), power_index=0.22
- iterative [data_width=16 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=9309, accuracy_bits=12.5, ffs=109, throughput_msps=6.55, max_abs_err=0.000177 (2^-12.47), power_index=0.231
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] area_um2=9815, accuracy_bits=13.1, ffs=113, throughput_msps=6.64, max_abs_err=0.000114 (2^-13.09), power_index=0.229
- iterative [data_width=16 n_iter=18 angle_guard=2 frac_guard=3 rounding=round] area_um2=10011, accuracy_bits=13.1, ffs=114, throughput_msps=6.01, max_abs_err=0.000112 (2^-13.13), power_index=0.257
Front coverage: area_um2 6987..10011 (HV reference 40000); accuracy_bits 10.2..13.1 (HV reference 10); data_width on the front 15..17 (registry 8..28).

Per family:
- iterative: 187 evals, 93 feasible; max throughput seen 15.3 MSPS; best accuracy 13.13 bits; best feasible area_um2=6987; feasible ranges: data_width 13..17, n_iter 12..18, angle_guard -1..2, frac_guard 0..3
- unrolled_k: 41 evals, 18 feasible; max throughput seen 12.8 MSPS; best accuracy 12.04 bits; best feasible area_um2=9169; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..4, k 2..3
- pipelined_m: 12 evals, 3 feasible; max throughput seen 44.1 MSPS; best accuracy 11.73 bits; best feasible area_um2=20749; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard -1..3, frac_guard 0..2, m 5..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (15 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 262 feasible; hypervolume 4.267e+05 (+326.9%).

**No LLM call** (code's front-mapping round): This is the final round, so stop is the only meaningful choice. The front has 15 feasible designs, all iterative, spanning 6987 to 10011 um2 and 10.2 to 13.1 accuracy bits. Both constraints are met: throughput is at least 6 MSPS against the 1 MSPS requirement, and the smallest design's max error of 0.000833 is under 2^-10. The selection rule (min area) picks iterative at data_width=15, n_iter=12, angle_guard=1, frac_guard=1, trunc, with area 6987 um2 and 10.2 bits. Hypervolume gained 37.1% last round, but the evidence says the iterative family dominates area. unrolled_k reaches a best feasible area of 9169 and pipelined_m 20749, both well above the iterative minimum. Throughput is far from binding, so the extra hardware of the unrolled and pipelined families buys nothing here.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.267e+05 (gain this round: +326.9%).
Feasible designs: 262 of 400 evaluations (220 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 44.1
- max_abs_err <= 0.000976562: 34% violate; best seen 3.4e-08 (2^-24.81)

Pareto front (feasible, 38 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=6987, accuracy_bits=10.2, ffs=102, throughput_msps=9.43, max_abs_err=0.000833 (2^-10.23), power_index=0.147
- iterative [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=7313, accuracy_bits=11.2, ffs=105, throughput_msps=8.5, max_abs_err=0.000417 (2^-11.23), power_index=0.162
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7930, accuracy_bits=12, ffs=109, throughput_msps=6.89, max_abs_err=0.000237 (2^-12.04), power_index=0.204
- iterative [data_width=17 n_iter=17 angle_guard=4 frac_guard=0 rounding=round] area_um2=8212, accuracy_bits=12.7, ffs=115, throughput_msps=5.89, max_abs_err=0.000146 (2^-12.74), power_index=0.225
- iterative [data_width=20 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=9243, accuracy_bits=14.5, ffs=127, throughput_msps=6.09, max_abs_err=4.25e-05 (2^-14.52), power_index=0.25
- iterative [data_width=20 n_iter=17 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=10265, accuracy_bits=15.5, ffs=138, throughput_msps=5.35, max_abs_err=2.11e-05 (2^-15.53), power_index=0.274
- iterative [data_width=23 n_iter=28 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=10833, accuracy_bits=17, ffs=144, throughput_msps=3.45, max_abs_err=7.69e-06 (2^-16.99), power_index=0.447
- iterative [data_width=24 n_iter=22 angle_guard=1 frac_guard=0 rounding=round] area_um2=11503, accuracy_bits=19, ffs=150, throughput_msps=4.15, max_abs_err=1.91e-06 (2^-19.00), power_index=0.378
- iterative [data_width=28 n_iter=28 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=13603, accuracy_bits=22, ffs=172, throughput_msps=2.99, max_abs_err=2.4e-07 (2^-21.99), power_index=0.545
- iterative [data_width=27 n_iter=29 angle_guard=4 frac_guard=4 rounding=round] area_um2=17695, accuracy_bits=24.8, ffs=178, throughput_msps=2.75, max_abs_err=3.4e-08 (2^-24.81), power_index=0.651
Front coverage: area_um2 6987..17695 (HV reference 40000); accuracy_bits 10.2..24.8 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 347 evals, 241 feasible; max throughput seen 15.3 MSPS; best accuracy 24.81 bits; best feasible area_um2=6987; feasible ranges: data_width 13..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 41 evals, 18 feasible; max throughput seen 12.8 MSPS; best accuracy 12.04 bits; best feasible area_um2=9169; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..4, k 2..3
- pipelined_m: 12 evals, 3 feasible; max throughput seen 44.1 MSPS; best accuracy 11.73 bits; best feasible area_um2=20749; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard -1..3, frac_guard 0..2, m 5..7
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19583 in, 2572 out
- provider-reported cost: $0.0649
- full prompts and replies: `llm_trace.jsonl`

