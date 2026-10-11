# DSE run: asic_low_area

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
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
`iterative:data_width=16,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 7349 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1958 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 105 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 6.43 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 22 | exact: schedule |
| latency_ns | 155 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.224 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000721 (2^-10.44) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 11.8 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.00021 (2^-12.22) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 3.44 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.4 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 22 cycles, a new input every 22 cycle(s). DDS tone from its exact outputs: SFDR 76.4 dBc, SNR 72.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (39 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=16,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc` | 7349 | 105 | 6.4 | 22 | 0.224 | 0.000721 (2^-10.44) | 10.44 |
| 1 | `iterative:data_width=16,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 7431 | 104 | 7.4 | 19 | 0.193 | 0.000373 (2^-11.39) | 11.39 |
| 2 | `iterative:data_width=17,n_iter=14,angle_guard=0,frac_guard=0,rounding=trunc` | 7556 | 109 | 8.0 | 17 | 0.179 | 0.000338 (2^-11.53) | 11.53 |
| 3 | `iterative:data_width=17,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 7714 | 109 | 8.0 | 17 | 0.181 | 0.000301 (2^-11.70) | 11.70 |
| 4 | `iterative:data_width=16,n_iter=23,angle_guard=2,frac_guard=0,rounding=round` | 7743 | 107 | 5.0 | 26 | 0.274 | 0.000285 (2^-11.78) | 11.78 |
| 5 | `iterative:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=trunc` | 7947 | 115 | 7.7 | 17 | 0.188 | 0.000251 (2^-11.96) | 11.96 |
| 6 | `iterative:data_width=18,n_iter=16,angle_guard=-1,frac_guard=0,rounding=trunc` | 8017 | 114 | 6.9 | 19 | 0.21 | 0.000207 (2^-12.24) | 12.24 |
| 7 | `iterative:data_width=17,n_iter=21,angle_guard=3,frac_guard=0,rounding=round` | 8234 | 114 | 5.1 | 24 | 0.268 | 0.000146 (2^-12.74) | 12.74 |
| 8 | `iterative:data_width=18,n_iter=17,angle_guard=0,frac_guard=1,rounding=trunc` | 8514 | 118 | 6.3 | 20 | 0.232 | 0.000129 (2^-12.92) | 12.92 |
| 9 | `iterative:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=trunc` | 8623 | 123 | 6.2 | 19 | 0.226 | 8.56e-05 (2^-13.51) | 13.51 |
| 10 | `iterative:data_width=17,n_iter=22,angle_guard=2,frac_guard=3,rounding=trunc` | 9036 | 119 | 4.9 | 25 | 0.299 | 8.24e-05 (2^-13.57) | 13.57 |
| 11 | `iterative:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=trunc` | 9112 | 128 | 5.9 | 20 | 0.25 | 4.89e-05 (2^-14.32) | 14.32 |
| 12 | `iterative:data_width=18,n_iter=20,angle_guard=2,frac_guard=3,rounding=trunc` | 9464 | 125 | 5.1 | 23 | 0.288 | 4.69e-05 (2^-14.38) | 14.38 |
| 13 | `iterative:data_width=20,n_iter=23,angle_guard=4,frac_guard=0,rounding=trunc` | 9484 | 131 | 4.1 | 26 | 0.335 | 4.53e-05 (2^-14.43) | 14.43 |
| 14 | `iterative:data_width=21,n_iter=17,angle_guard=1,frac_guard=0,rounding=trunc` | 9540 | 134 | 5.7 | 20 | 0.261 | 3.12e-05 (2^-14.97) | 14.97 |
| 15 | `iterative:data_width=19,n_iter=21,angle_guard=2,frac_guard=2,rounding=trunc` | 9608 | 128 | 4.9 | 24 | 0.307 | 3.04e-05 (2^-15.00) | 15.00 |
| 16 | `iterative:data_width=21,n_iter=18,angle_guard=1,frac_guard=0,rounding=trunc` | 9613 | 134 | 5.4 | 21 | 0.275 | 2.55e-05 (2^-15.26) | 15.26 |
| 17 | `iterative:data_width=21,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 9861 | 136 | 5.3 | 20 | 0.267 | 2.15e-05 (2^-15.50) | 15.50 |
| 18 | `iterative:data_width=21,n_iter=19,angle_guard=0,frac_guard=1,rounding=trunc` | 9955 | 135 | 5.2 | 22 | 0.294 | 1.88e-05 (2^-15.70) | 15.70 |
| 19 | `iterative:data_width=21,n_iter=23,angle_guard=0,frac_guard=0,rounding=round` | 9998 | 132 | 4.5 | 26 | 0.345 | 1.79e-05 (2^-15.77) | 15.77 |
| 20 | `iterative:data_width=21,n_iter=20,angle_guard=2,frac_guard=1,rounding=trunc` | 10143 | 137 | 4.8 | 23 | 0.312 | 1.31e-05 (2^-16.21) | 16.21 |
| 21 | `iterative:data_width=21,n_iter=23,angle_guard=3,frac_guard=0,rounding=round` | 10188 | 136 | 4.1 | 26 | 0.352 | 1.15e-05 (2^-16.41) | 16.41 |
| 22 | `iterative:data_width=22,n_iter=23,angle_guard=3,frac_guard=0,rounding=round` | 10689 | 141 | 4.0 | 26 | 0.368 | 5.23e-06 (2^-17.54) | 17.54 |
| 23 | `iterative:data_width=24,n_iter=21,angle_guard=-1,frac_guard=0,rounding=round` | 11304 | 148 | 4.5 | 24 | 0.357 | 3.92e-06 (2^-17.96) | 17.96 |
| 24 | `iterative:data_width=24,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc` | 11358 | 150 | 3.7 | 28 | 0.421 | 2.96e-06 (2^-18.37) | 18.37 |
| 25 | `iterative:data_width=22,n_iter=23,angle_guard=3,frac_guard=3,rounding=trunc` | 11603 | 148 | 4.0 | 26 | 0.391 | 2.39e-06 (2^-18.67) | 18.67 |
| 26 | `iterative:data_width=24,n_iter=29,angle_guard=1,frac_guard=1,rounding=trunc` | 11812 | 152 | 3.2 | 32 | 0.493 | 2.02e-06 (2^-18.92) | 18.92 |
| 27 | `iterative:data_width=26,n_iter=23,angle_guard=3,frac_guard=0,rounding=trunc` | 12425 | 163 | 3.6 | 26 | 0.426 | 8.51e-07 (2^-20.16) | 20.16 |
| 28 | `iterative:data_width=25,n_iter=27,angle_guard=3,frac_guard=1,rounding=trunc` | 12488 | 160 | 3.2 | 30 | 0.487 | 8.2e-07 (2^-20.22) | 20.22 |
| 29 | `iterative:data_width=26,n_iter=30,angle_guard=0,frac_guard=0,rounding=round` | 12769 | 160 | 3.1 | 33 | 0.541 | 6.06e-07 (2^-20.65) | 20.65 |
| 30 | `iterative:data_width=25,n_iter=27,angle_guard=3,frac_guard=2,rounding=trunc` | 12930 | 162 | 3.2 | 30 | 0.499 | 4.7e-07 (2^-21.02) | 21.02 |
| 31 | `iterative:data_width=26,n_iter=28,angle_guard=2,frac_guard=1,rounding=trunc` | 12998 | 164 | 3.1 | 31 | 0.52 | 4.11e-07 (2^-21.21) | 21.21 |
| 32 | `iterative:data_width=27,n_iter=25,angle_guard=4,frac_guard=0,rounding=trunc` | 13123 | 170 | 3.1 | 28 | 0.481 | 3.81e-07 (2^-21.32) | 21.32 |
| 33 | `iterative:data_width=27,n_iter=30,angle_guard=0,frac_guard=0,rounding=round` | 13342 | 165 | 3.0 | 33 | 0.563 | 3.4e-07 (2^-21.49) | 21.49 |
| 34 | `iterative:data_width=26,n_iter=28,angle_guard=2,frac_guard=2,rounding=trunc` | 13453 | 166 | 3.1 | 31 | 0.532 | 2.9e-07 (2^-21.72) | 21.72 |
| 35 | `iterative:data_width=27,n_iter=27,angle_guard=1,frac_guard=1,rounding=trunc` | 13460 | 169 | 3.2 | 30 | 0.519 | 2.6e-07 (2^-21.88) | 21.88 |
| 36 | `iterative:data_width=28,n_iter=28,angle_guard=3,frac_guard=0,rounding=trunc` | 13730 | 174 | 2.8 | 31 | 0.551 | 2.17e-07 (2^-22.13) | 22.13 |
| 37 | `iterative:data_width=28,n_iter=26,angle_guard=0,frac_guard=0,rounding=round` | 13758 | 171 | 3.3 | 29 | 0.51 | 1.76e-07 (2^-22.44) | 22.44 |
| 38 | `iterative:data_width=27,n_iter=27,angle_guard=4,frac_guard=4,rounding=trunc` | 14977 | 178 | 2.9 | 30 | 0.562 | 6.28e-08 (2^-23.92) | 23.92 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=1 MSPS) is non-binding: even iterative with N=24 runs at >1 MSPS at typical Fmax, and pipelined families exceed it by orders of magnitude. Thus area is the only real objective, and accuracy depends only on the shared parameters (W, N, guards, rounding), not on the family. The iterative family shares one micro-rotation datapath and should be the smallest, so it gets the largest share. unrolled_k and pipelined_m are included to test whether they can beat iterative at any accuracy point (e.g., if barrel shifters dominate), and pipelined gets a small share to confirm it is dominated. Ranges focus on W 10-24 and N 8-24, the plausible region where accuracy_bits crosses 10 and area spans the region below the 40000 reference; later rounds can widen or refine based on the observed front.*)
- `iterative` (60 evals): data_width=10..24, n_iter=8..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Shared datapath gives the smallest area; throughput is easily met (N+3 cycles at ~100+ MHz >> 1 MSPS). Focus on W 10-24, N 8-24 where accuracy_bits crosses 10 and area spans the region below the 40000 reference.
- `unrolled_k` (20 evals): data_width=10..24, n_iter=8..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..4. *Why:* Check whether a small unroll factor (k=2-4) can reduce area versus iterative at the same accuracy, e.g. if barrel-shifter cost dominates; still meets the 1 MSPS constraint easily.
- `pipelined_m` (10 evals): data_width=10..24, n_iter=8..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* Large m reduces register count; verify whether it can ever beat iterative on area for high-accuracy points, though 1 result/cycle throughput is not needed here.
- `pipelined` (10 evals): data_width=10..24, n_iter=8..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Fully pipelined is expected to be dominated on area (N register stages), but a small share confirms this and guards against a surprising cost-model result.

**Result (code):** 100 evaluations this round, 100 total; 71 feasible; hypervolume 2.643e+05 (n/a).

**LLM decision:** `refine` — Round 1 shows the feasible front is essentially an iterative-family curve: the 9 lowest-area front points are all `iterative` (area 7714..11603, accuracy 11.3..18.7 bits), and the selection rule is min area_um2, so the winning corner is the low-area iterative region. Two clear gaps remain: (1) the front's *lowest* accuracy is 11.3 bits while the constraint allows down to 10 bits (max_abs_err <= 2^-10), so there is unexplored room to shrink area further by trading accuracy toward the constraint — this is exactly where the min-area winner will live; (2) the front jumps from area 11603 straight to 95283, leaving the whole 11603..40000 band empty even though the HV reference is 40000, so mid-area families (unrolled_k best feasible area 16019, pipelined_m best 25822, pipelined best 35318) can fill HV that is currently unclaimed. I therefore narrow the search onto the low-area iterative corner plus the mid-area band, rather than spending a round on a full map_front while the selection-relevant corner is still unrefined.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2.643e+05 (gain this round: n/a (first round)).
Feasible designs: 71 of 100 evaluations (61 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 180
- max_abs_err <= 0.000976562: 29% violate; best seen 5.06e-07 (2^-20.92)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=19 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=7714, accuracy_bits=11.3, ffs=106, throughput_msps=6.18, max_abs_err=0.000387 (2^-11.34), power_index=0.23
- iterative [data_width=15 n_iter=19 angle_guard=4 frac_guard=2 rounding=trunc] area_um2=7841, accuracy_bits=11.5, ffs=108, throughput_msps=5.74, max_abs_err=0.000354 (2^-11.46), power_index=0.234
- iterative [data_width=18 n_iter=16 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=8017, accuracy_bits=12.2, ffs=114, throughput_msps=6.89, max_abs_err=0.000207 (2^-12.24), power_index=0.21
- iterative [data_width=18 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=8514, accuracy_bits=12.9, ffs=118, throughput_msps=6.31, max_abs_err=0.000129 (2^-12.92), power_index=0.232
- iterative [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=8623, accuracy_bits=13.5, ffs=123, throughput_msps=6.2, max_abs_err=8.56e-05 (2^-13.51), power_index=0.226
- iterative [data_width=19 n_iter=18 angle_guard=2 frac_guard=4 rounding=trunc] area_um2=10128, accuracy_bits=15.3, ffs=132, throughput_msps=5.25, max_abs_err=2.42e-05 (2^-15.34), power_index=0.28
- iterative [data_width=19 n_iter=19 angle_guard=2 frac_guard=4 rounding=trunc] area_um2=10213, accuracy_bits=15.5, ffs=132, throughput_msps=5.01, max_abs_err=2.1e-05 (2^-15.54), power_index=0.294
- iterative [data_width=23 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round] area_um2=10572, accuracy_bits=16.3, ffs=142, throughput_msps=5.25, max_abs_err=1.21e-05 (2^-16.33), power_index=0.297
- iterative [data_width=22 n_iter=23 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=11603, accuracy_bits=18.7, ffs=148, throughput_msps=3.99, max_abs_err=2.39e-06 (2^-18.67), power_index=0.391
- pipelined [data_width=24 n_iter=23 angle_guard=4 frac_guard=3 rounding=round] area_um2=95283, accuracy_bits=20.9, ffs=2003, throughput_msps=102, max_abs_err=5.06e-07 (2^-20.92), power_index=0.167
Front coverage: area_um2 7714..95283 (HV reference 40000); accuracy_bits 11.3..20.9 (HV reference 10); data_width on the front 15..24 (registry 8..28).

Per family:
- iterative: 60 evals, 46 feasible; max throughput seen 14 MSPS; best accuracy 18.67 bits; best feasible area_um2=7714; feasible ranges: data_width 13..24, n_iter 12..23, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 20 evals, 13 feasible; max throughput seen 9.72 MSPS; best accuracy 18.67 bits; best feasible area_um2=16019; feasible ranges: data_width 20..24, n_iter 12..24, angle_guard -1..3, frac_guard 0..4, k 3..4
- pipelined: 10 evals, 5 feasible; max throughput seen 180 MSPS; best accuracy 20.92 bits; best feasible area_um2=35318; feasible ranges: data_width 13..24, n_iter 14..23, angle_guard -1..4, frac_guard 0..3
- pipelined_m: 10 evals, 7 feasible; max throughput seen 41.5 MSPS; best accuracy 16.15 bits; best feasible area_um2=25822; feasible ranges: data_width 17..23, n_iter 13..24, angle_guard -2..4, frac_guard 1..4, m 4..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Round 1 shows the feasible front is essentially an iterative-family curve: the 9 lowest-area front points are all `iterative` (area 7714..11603, accuracy 11.3..18.7 bits), and the selection rule is min area_um2, so the winning corner is the low-area iterative region. Two clear gaps remain: (1) the front's *lowest* accuracy is 11.3 bits while the constraint allows down to 10 bits (max_abs_err <= 2^-10), so there is unexplored room to shrink area further by trading accuracy toward the constraint — this is exactly where the min-area winner will live; (2) the front jumps from area 11603 straight to 95283, leaving the whole 11603..40000 band empty even though the HV reference is 40000, so mid-area families (unrolled_k best feasible area 16019, pipelined_m best 25822, pipelined best 35318) can fill HV that is currently unclaimed. I therefore narrow the search onto the low-area iterative corner plus the mid-area band, rather than spending a round on a full map_front while the selection-relevant corner is still unrefined.*)
- `iterative` (50 evals): data_width=13..18, n_iter=14..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* lowest-area front points; push data_width down toward the 10-bit constraint to find the min-area winner
- `unrolled_k` (25 evals): data_width=18..24, n_iter=14..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..6. *Why:* best feasible area 16019 sits in the empty 11603..40000 HV band
- `pipelined_m` (25 evals): data_width=17..24, n_iter=14..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=3..8. *Why:* best feasible area 25822 fills the upper part of the empty HV band below the 40000 reference

**Result (code):** 100 evaluations this round, 200 total; 158 feasible; hypervolume 2.651e+05 (+0.3%).

**LLM decision:** `refine` — Round 2 gained only +0.3% HV, so the front is near-converged and the remaining 200 evals are best spent refining the region that actually produced it rather than widening or adding families (all four families are already on the front). The selection rule is min area_um2, and the current winner is iterative [W=16 N=19 ag=0 fg=0 trunc] at 7349 um^2 with 10.44 accuracy bits — only 0.44 bits of margin over the 2^-10 constraint — so the low-area iterative corner (W=15..17, N=14..22) is the only place a smaller feasible design could hide. For HV, the reference area is 40000, so only the sub-40000 part of the front counts; there the front is dense below 11603 (iterative) but has a wide hole between 11603 and unrolled_k's best 14263, and again between 14263 and pipelined_m's 23840, with pipelined only at 35318. Refining unrolled_k / pipelined_m / pipelined in the mid-area band (W=17..22, N=14..24) is the cheapest way to raise the curve inside the HV box. Guards are left at their full feasible spans (-2..4, 0..4) because the front itself uses ag up to 4 and fg up to 4, so narrowing them would risk excluding front points.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.31% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.651e+05 (gain this round: +0.3%).
Feasible designs: 158 of 200 evaluations (139 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 180
- max_abs_err <= 0.000976562: 21% violate; best seen 5.06e-07 (2^-20.92)

Pareto front (feasible, 19 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=19 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7349, accuracy_bits=10.4, ffs=105, throughput_msps=6.43, max_abs_err=0.000721 (2^-10.44), power_index=0.224
- iterative [data_width=17 n_iter=14 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7556, accuracy_bits=11.5, ffs=109, throughput_msps=8, max_abs_err=0.000338 (2^-11.53), power_index=0.179
- iterative [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7947, accuracy_bits=12, ffs=115, throughput_msps=7.7, max_abs_err=0.000251 (2^-11.96), power_index=0.188
- iterative [data_width=17 n_iter=21 angle_guard=3 frac_guard=0 rounding=round] area_um2=8234, accuracy_bits=12.7, ffs=114, throughput_msps=5.08, max_abs_err=0.000146 (2^-12.74), power_index=0.268
- iterative [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=8623, accuracy_bits=13.5, ffs=123, throughput_msps=6.2, max_abs_err=8.56e-05 (2^-13.51), power_index=0.226
- iterative [data_width=18 n_iter=20 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=9464, accuracy_bits=14.4, ffs=125, throughput_msps=5.12, max_abs_err=4.69e-05 (2^-14.38), power_index=0.288
- iterative [data_width=19 n_iter=18 angle_guard=2 frac_guard=4 rounding=trunc] area_um2=10128, accuracy_bits=15.3, ffs=132, throughput_msps=5.25, max_abs_err=2.42e-05 (2^-15.34), power_index=0.28
- iterative [data_width=23 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round] area_um2=10572, accuracy_bits=16.3, ffs=142, throughput_msps=5.25, max_abs_err=1.21e-05 (2^-16.33), power_index=0.297
- iterative [data_width=22 n_iter=23 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=11603, accuracy_bits=18.7, ffs=148, throughput_msps=3.99, max_abs_err=2.39e-06 (2^-18.67), power_index=0.391
- pipelined [data_width=24 n_iter=23 angle_guard=4 frac_guard=3 rounding=round] area_um2=95283, accuracy_bits=20.9, ffs=2003, throughput_msps=102, max_abs_err=5.06e-07 (2^-20.92), power_index=0.167
Front coverage: area_um2 7349..95283 (HV reference 40000); accuracy_bits 10.4..20.9 (HV reference 10); data_width on the front 16..24 (registry 8..28).

Per family:
- iterative: 110 evals, 83 feasible; max throughput seen 14 MSPS; best accuracy 18.67 bits; best feasible area_um2=7349; feasible ranges: data_width 13..24, n_iter 12..23, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 45 evals, 38 feasible; max throughput seen 9.72 MSPS; best accuracy 18.67 bits; best feasible area_um2=14263; feasible ranges: data_width 18..24, n_iter 12..24, angle_guard -2..3, frac_guard 0..4, k 2..6
- pipelined: 10 evals, 5 feasible; max throughput seen 180 MSPS; best accuracy 20.92 bits; best feasible area_um2=35318; feasible ranges: data_width 13..24, n_iter 14..23, angle_guard -1..4, frac_guard 0..3
- pipelined_m: 35 evals, 32 feasible; max throughput seen 41.5 MSPS; best accuracy 19.78 bits; best feasible area_um2=23840; feasible ranges: data_width 17..24, n_iter 13..24, angle_guard -2..4, frac_guard 0..4, m 4..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `iterative` (179 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (17 front designs; box front_anchored)
- `pipelined_m` (11 evals): data_width=23..28, n_iter=22..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)
- `pipelined` (10 evals): data_width=23..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 354 feasible; hypervolume 4.057e+05 (+53.0%).

**No LLM call** (code's front-mapping round): Round 2 gained only +0.3% HV, so the front is near-converged and the remaining 200 evals are best spent refining the region that actually produced it rather than widening or adding families (all four families are already on the front). The selection rule is min area_um2, and the current winner is iterative [W=16 N=19 ag=0 fg=0 trunc] at 7349 um^2 with 10.44 accuracy bits — only 0.44 bits of margin over the 2^-10 constraint — so the low-area iterative corner (W=15..17, N=14..22) is the only place a smaller feasible design could hide. For HV, the reference area is 40000, so only the sub-40000 part of the front counts; there the front is dense below 11603 (iterative) but has a wide hole between 11603 and unrolled_k's best 14263, and again between 14263 and pipelined_m's 23840, with pipelined only at 35318. Refining unrolled_k / pipelined_m / pipelined in the mid-area band (W=17..22, N=14..24) is the cheapest way to raise the curve inside the HV box. Guards are left at their full feasible spans (-2..4, 0..4) because the front itself uses ag up to 4 and fg up to 4, so narrowing them would risk excluding front points.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.057e+05 (gain this round: +53.0%).
Feasible designs: 354 of 400 evaluations (313 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 180
- max_abs_err <= 0.000976562: 12% violate; best seen 6.28e-08 (2^-23.92)

Pareto front (feasible, 39 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=19 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=7349, accuracy_bits=10.4, ffs=105, throughput_msps=6.43, max_abs_err=0.000721 (2^-10.44), power_index=0.224
- iterative [data_width=16 n_iter=23 angle_guard=2 frac_guard=0 rounding=round] area_um2=7743, accuracy_bits=11.8, ffs=107, throughput_msps=5.04, max_abs_err=0.000285 (2^-11.78), power_index=0.274
- iterative [data_width=18 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=8514, accuracy_bits=12.9, ffs=118, throughput_msps=6.31, max_abs_err=0.000129 (2^-12.92), power_index=0.232
- iterative [data_width=20 n_iter=23 angle_guard=4 frac_guard=0 rounding=trunc] area_um2=9484, accuracy_bits=14.4, ffs=131, throughput_msps=4.11, max_abs_err=4.53e-05 (2^-14.43), power_index=0.335
- iterative [data_width=21 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] area_um2=9861, accuracy_bits=15.5, ffs=136, throughput_msps=5.35, max_abs_err=2.15e-05 (2^-15.50), power_index=0.267
- iterative [data_width=21 n_iter=23 angle_guard=3 frac_guard=0 rounding=round] area_um2=10188, accuracy_bits=16.4, ffs=136, throughput_msps=4.11, max_abs_err=1.15e-05 (2^-16.41), power_index=0.352
- iterative [data_width=22 n_iter=23 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=11603, accuracy_bits=18.7, ffs=148, throughput_msps=3.99, max_abs_err=2.39e-06 (2^-18.67), power_index=0.391
- iterative [data_width=25 n_iter=27 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=12930, accuracy_bits=21, ffs=162, throughput_msps=3.18, max_abs_err=4.7e-07 (2^-21.02), power_index=0.499
- iterative [data_width=26 n_iter=28 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=13453, accuracy_bits=21.7, ffs=166, throughput_msps=3.07, max_abs_err=2.9e-07 (2^-21.72), power_index=0.532
- iterative [data_width=27 n_iter=27 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=14977, accuracy_bits=23.9, ffs=178, throughput_msps=2.94, max_abs_err=6.28e-08 (2^-23.92), power_index=0.562
Front coverage: area_um2 7349..14977 (HV reference 40000); accuracy_bits 10.4..23.9 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 289 evals, 258 feasible; max throughput seen 14 MSPS; best accuracy 23.92 bits; best feasible area_um2=7349; feasible ranges: data_width 13..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 45 evals, 38 feasible; max throughput seen 9.72 MSPS; best accuracy 18.67 bits; best feasible area_um2=14263; feasible ranges: data_width 18..24, n_iter 12..24, angle_guard -2..3, frac_guard 0..4, k 2..6
- pipelined: 20 evals, 15 feasible; max throughput seen 180 MSPS; best accuracy 22.72 bits; best feasible area_um2=35318; feasible ranges: data_width 13..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 46 evals, 43 feasible; max throughput seen 56.1 MSPS; best accuracy 21.85 bits; best feasible area_um2=23840; feasible ranges: data_width 17..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 8039 in, 27256 out
- provider-reported cost: $0.0184
- full prompts and replies: `llm_trace.jsonl`

