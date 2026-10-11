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
`iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 6860 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1828 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 100 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 9.43 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 106 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.144 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000917 (2^-10.09) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 7.51 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000249 (2^-11.97) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 2.04 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.1 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 15 cycles, a new input every 15 cycle(s). DDS tone from its exact outputs: SFDR 79.8 dBc, SNR 69.5 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

| tool | area µm² est → meas | FFs est → meas | Fmax MHz est → meas |
|---|---|---|---|
| measured (yosys+opensta yosys 0.33 + OpenSTA 3.1.0, sky130_fd_sc_hd, tt_025C_1v80) | 6860 → 7217 (+5.2%) | 100 → 107 (+7.5%) | 142 → 161 (+13.6%) |

Winner check (1 of 34 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on

## Pareto front (34 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round` | 6860 | 100 | 9.4 | 15 | 0.144 | 0.000917 (2^-10.09) | 10.09 |
| 1 | `iterative:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round` | 6987 | 102 | 8.7 | 15 | 0.147 | 0.000803 (2^-10.28) | 10.28 |
| 2 | `iterative:data_width=15,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 7042 | 100 | 7.9 | 18 | 0.174 | 0.000632 (2^-10.63) | 10.63 |
| 3 | `iterative:data_width=15,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 7169 | 102 | 7.3 | 18 | 0.178 | 0.000546 (2^-10.84) | 10.84 |
| 4 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc` | 7449 | 106 | 8.0 | 17 | 0.175 | 0.000401 (2^-11.28) | 11.28 |
| 5 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 7573 | 107 | 7.6 | 18 | 0.188 | 0.000323 (2^-11.60) | 11.60 |
| 6 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc` | 7797 | 109 | 7.7 | 17 | 0.182 | 0.000311 (2^-11.65) | 11.65 |
| 7 | `iterative:data_width=15,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 7826 | 107 | 7.3 | 18 | 0.19 | 0.000302 (2^-11.69) | 11.69 |
| 8 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=3,rounding=trunc` | 8081 | 112 | 7.4 | 17 | 0.186 | 0.000288 (2^-11.76) | 11.76 |
| 9 | `iterative:data_width=16,n_iter=19,angle_guard=1,frac_guard=2,rounding=trunc` | 8103 | 111 | 6.0 | 22 | 0.24 | 0.00023 (2^-12.08) | 12.08 |
| 10 | `iterative:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 8168 | 116 | 7.4 | 17 | 0.191 | 0.000175 (2^-12.48) | 12.48 |
| 11 | `iterative:data_width=17,n_iter=24,angle_guard=2,frac_guard=0,rounding=round` | 8207 | 113 | 4.7 | 27 | 0.3 | 0.000139 (2^-12.81) | 12.81 |
| 12 | `iterative:data_width=18,n_iter=24,angle_guard=1,frac_guard=0,rounding=round` | 8608 | 117 | 4.7 | 27 | 0.313 | 9.26e-05 (2^-13.40) | 13.40 |
| 13 | `iterative:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=trunc` | 8623 | 123 | 6.2 | 19 | 0.226 | 8.56e-05 (2^-13.51) | 13.51 |
| 14 | `iterative:data_width=18,n_iter=21,angle_guard=1,frac_guard=2,rounding=trunc` | 9068 | 121 | 5.1 | 24 | 0.29 | 6.55e-05 (2^-13.90) | 13.90 |
| 15 | `iterative:data_width=21,n_iter=21,angle_guard=-2,frac_guard=0,rounding=trunc` | 9568 | 130 | 4.9 | 24 | 0.309 | 5.61e-05 (2^-14.12) | 14.12 |
| 16 | `iterative:data_width=18,n_iter=29,angle_guard=3,frac_guard=3,rounding=trunc` | 9600 | 126 | 3.7 | 32 | 0.405 | 4.65e-05 (2^-14.39) | 14.39 |
| 17 | `iterative:data_width=21,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 9700 | 135 | 6.0 | 19 | 0.251 | 3.85e-05 (2^-14.67) | 14.67 |
| 18 | `iterative:data_width=21,n_iter=16,angle_guard=4,frac_guard=0,rounding=round` | 9764 | 136 | 5.5 | 19 | 0.253 | 3.63e-05 (2^-14.75) | 14.75 |
| 19 | `iterative:data_width=18,n_iter=30,angle_guard=3,frac_guard=4,rounding=trunc` | 10006 | 128 | 3.5 | 33 | 0.429 | 3.29e-05 (2^-14.89) | 14.89 |
| 20 | `iterative:data_width=18,n_iter=30,angle_guard=4,frac_guard=4,rounding=trunc` | 10070 | 129 | 3.5 | 33 | 0.433 | 3.28e-05 (2^-14.90) | 14.90 |
| 21 | `iterative:data_width=21,n_iter=23,angle_guard=0,frac_guard=1,rounding=trunc` | 10125 | 135 | 4.4 | 26 | 0.35 | 1.69e-05 (2^-15.85) | 15.85 |
| 22 | `iterative:data_width=21,n_iter=24,angle_guard=1,frac_guard=1,rounding=trunc` | 10201 | 136 | 4.2 | 27 | 0.366 | 1.38e-05 (2^-16.15) | 16.15 |
| 23 | `iterative:data_width=21,n_iter=23,angle_guard=4,frac_guard=1,rounding=trunc` | 10379 | 139 | 4.0 | 26 | 0.36 | 1.31e-05 (2^-16.21) | 16.21 |
| 24 | `iterative:data_width=23,n_iter=18,angle_guard=1,frac_guard=3,rounding=trunc` | 11492 | 151 | 4.8 | 21 | 0.318 | 9.08e-06 (2^-16.75) | 16.75 |
| 25 | `iterative:data_width=23,n_iter=25,angle_guard=0,frac_guard=2,rounding=trunc` | 11605 | 148 | 3.7 | 28 | 0.421 | 3.72e-06 (2^-18.04) | 18.04 |
| 26 | `iterative:data_width=25,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc` | 11846 | 155 | 3.7 | 27 | 0.422 | 1.48e-06 (2^-19.36) | 19.36 |
| 27 | `iterative:data_width=25,n_iter=25,angle_guard=3,frac_guard=0,rounding=trunc` | 12009 | 158 | 3.4 | 28 | 0.443 | 1.43e-06 (2^-19.41) | 19.41 |
| 28 | `iterative:data_width=25,n_iter=25,angle_guard=1,frac_guard=0,rounding=round` | 12174 | 155 | 3.6 | 28 | 0.443 | 1.05e-06 (2^-19.86) | 19.86 |
| 29 | `iterative:data_width=27,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc` | 12933 | 166 | 3.4 | 28 | 0.472 | 4.02e-07 (2^-21.25) | 21.25 |
| 30 | `iterative:data_width=27,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 13369 | 166 | 3.1 | 31 | 0.531 | 2.33e-07 (2^-22.03) | 22.03 |
| 31 | `iterative:data_width=28,n_iter=24,angle_guard=3,frac_guard=0,rounding=round` | 13791 | 174 | 3.3 | 27 | 0.481 | 1.86e-07 (2^-22.36) | 22.36 |
| 32 | `iterative:data_width=28,n_iter=30,angle_guard=2,frac_guard=1,rounding=trunc` | 14182 | 175 | 2.7 | 33 | 0.597 | 1.02e-07 (2^-23.22) | 23.22 |
| 33 | `iterative:data_width=28,n_iter=30,angle_guard=2,frac_guard=3,rounding=round` | 17819 | 179 | 2.7 | 33 | 0.676 | 4.14e-08 (2^-24.53) | 24.53 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Area is the key objective and the throughput floor is only 1 MSPS, so the iterative family is the most likely winner and gets most of the budget. Accuracy of 2^-10 needs roughly 11-14 output bits plus guard bits and about 10-12 iterations, so the ranges are centred there and still leave room to trade accuracy bits against area. Unrolled_k and a coarse pipelined_m are kept as small probes to cover the front and catch surprises. After round 1, the plan is to narrow to whichever family dominates.*)
- `iterative` (73 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* A shared datapath with one micro-rotation per cycle should give the smallest area. Throughput only needs to reach 1 MSPS, and N+3 cycles per result is probably achievable at a moderate clock. Widths near the 2^-10 error limit (about 10-16 bits) are the useful range.
- `unrolled_k` (18 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* A small k cuts cycles per result and removes some FSM overhead. It is a hedge in case the iterative design is short of throughput at its Fmax, and it also fills out the front at slightly higher area.
- `pipelined_m` (9 evals): data_width=10..14, n_iter=8..14, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=4..8. *Why:* A coarse pipeline has fewer registers and no barrel shifters. It is a probe to check whether it can compete on area. It is unlikely to beat iterative, but it is cheap to test.

**Result (code):** 100 evaluations this round, 100 total; 42 feasible; hypervolume 7.636e+04 (n/a).

**LLM decision:** `refine` — Every front point is iterative (area 6860..9633 um2, 10.1..12.4 bits). Throughput is not binding: the best iterative design reaches 14.6 MSPS against a 1 MSPS floor, so the shared-datapath family stays the right choice for area. The only active constraint is max_abs_err <= 2^-10, which 58% of designs violated. The smallest-area point sits at the accuracy edge (10.1 bits, data_width=15, n_iter=12, angle_guard=1, frac_guard=0, round). Feasible designs span data_width 13..16 but the front only reaches 15..16, so a narrower width with guard bits and round might meet 10 bits for less area. I will search data_width 11..15 and n_iter 10..16 with the guard bits and rounding free, and give unrolled_k a small share. unrolled_k's best feasible area is 9556, and pipelined_m had 0 feasible designs out of 9 (best 9.04 bits), while pipelined costs more FFs and area. I will skip both of those unless this round gives a reason to revisit them.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7.636e+04 (gain this round: n/a (first round)).
Feasible designs: 42 of 100 evaluations (32 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 66.8
- max_abs_err <= 0.000976562: 58% violate; best seen 0.000187 (2^-12.38)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7042, accuracy_bits=10.6, ffs=100, throughput_msps=7.86, max_abs_err=0.000632 (2^-10.63), power_index=0.174
- iterative [data_width=15 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=7468, accuracy_bits=11.3, ffs=105, throughput_msps=8, max_abs_err=0.000405 (2^-11.27), power_index=0.174
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7826, accuracy_bits=11.7, ffs=107, throughput_msps=7.27, max_abs_err=0.000302 (2^-11.69), power_index=0.19
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] area_um2=9316, accuracy_bits=12, ffs=107, throughput_msps=6.89, max_abs_err=0.000253 (2^-11.95), power_index=0.218
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] area_um2=9348, accuracy_bits=12.3, ffs=111, throughput_msps=7.7, max_abs_err=0.000204 (2^-12.26), power_index=0.198
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=9633, accuracy_bits=12.4, ffs=113, throughput_msps=7.42, max_abs_err=0.000187 (2^-12.38), power_index=0.203
Front coverage: area_um2 6860..9633 (HV reference 40000); accuracy_bits 10.1..12.4 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 73 evals, 35 feasible; max throughput seen 14.6 MSPS; best accuracy 12.38 bits; best feasible area_um2=6860; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 18 evals, 7 feasible; max throughput seen 11.1 MSPS; best accuracy 12.23 bits; best feasible area_um2=9556; feasible ranges: data_width 13..16, n_iter 13..16, angle_guard 0..3, frac_guard 0..3, k 2..3
- pipelined_m: 9 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 9.04 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on narrower-width iterative designs close to the error limit to push the minimum area down while keeping some accuracy spread.*)
- `iterative` (84 evals): data_width=11..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Every front point is iterative, and the minimum-area selection rule favours narrower widths near the 2^-10 error boundary, so this range goes below 15 bits.
- `unrolled_k` (16 evals): data_width=12..16, n_iter=11..16, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..3. *Why:* Seven feasible designs but none on the front (best area 9556); a small share checks whether it can match iterative at the low-area end.

**Result (code):** 100 evaluations this round, 200 total; 96 feasible; hypervolume 8.1e+04 (+6.1%).

**LLM decision:** `refine` — The front is iterative-only, with areas of 6860..9696 um2 and 10.1..12.5 accuracy bits. Throughput is not binding: 7-9 MSPS against a floor of 1 MSPS. Unrolled_k reaches 9556 um2 at best and is dominated, and pipelined_m has 0 of 9 feasible. Because area is the objective, the extra registers and stages of the pipelined families will cost more area than they save. The accuracy limit binds: 52% of evaluations violate it, and the cheapest feasible design sits at 10.09 bits, close to the 10-bit limit. The best remaining gain is lower area near that boundary, using data_width 12..16 with fewer iterations, little guard, and rounding trunc or round, while still covering the higher-accuracy end of the front. I am dropping unrolled_k and pipelined_m and concentrating the budget on iterative. Code will map the full front in the reserved final round.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.1e+04 (gain this round: +6.1%).
Feasible designs: 96 of 200 evaluations (70 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 66.8
- max_abs_err <= 0.000976562: 52% violate; best seen 0.000171 (2^-12.51)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7042, accuracy_bits=10.6, ffs=100, throughput_msps=7.86, max_abs_err=0.000632 (2^-10.63), power_index=0.174
- iterative [data_width=15 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] area_um2=7169, accuracy_bits=10.8, ffs=102, throughput_msps=7.27, max_abs_err=0.000546 (2^-10.84), power_index=0.178
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=7449, accuracy_bits=11.3, ffs=106, throughput_msps=8, max_abs_err=0.000401 (2^-11.28), power_index=0.175
- iterative [data_width=16 n_iter=13 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7712, accuracy_bits=11.3, ffs=109, throughput_msps=8.18, max_abs_err=0.000384 (2^-11.35), power_index=0.17
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7826, accuracy_bits=11.7, ffs=107, throughput_msps=7.27, max_abs_err=0.000302 (2^-11.69), power_index=0.19
- iterative [data_width=16 n_iter=14 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8208, accuracy_bits=12.2, ffs=114, throughput_msps=7.42, max_abs_err=0.000209 (2^-12.23), power_index=0.19
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] area_um2=9348, accuracy_bits=12.3, ffs=111, throughput_msps=7.7, max_abs_err=0.000204 (2^-12.26), power_index=0.198
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=9633, accuracy_bits=12.4, ffs=113, throughput_msps=7.42, max_abs_err=0.000187 (2^-12.38), power_index=0.203
- iterative [data_width=16 n_iter=14 angle_guard=3 frac_guard=3 rounding=round] area_um2=9696, accuracy_bits=12.5, ffs=114, throughput_msps=7.42, max_abs_err=0.000171 (2^-12.51), power_index=0.205
Front coverage: area_um2 6860..9696 (HV reference 40000); accuracy_bits 10.1..12.5 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 157 evals, 84 feasible; max throughput seen 14.6 MSPS; best accuracy 12.51 bits; best feasible area_um2=6860; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 34 evals, 12 feasible; max throughput seen 11.1 MSPS; best accuracy 12.23 bits; best feasible area_um2=9556; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard 0..3, frac_guard 0..3, k 2..3
- pipelined_m: 9 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 9.04 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate evaluations on the iterative region near the accuracy constraint boundary to push area below 6860 um2, with a small probe of unrolled_k as a check.*)
- `iterative` (32 evals): data_width=12..16, n_iter=10..15, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Iterative holds the whole front and area is the objective. The ranges cover the low-area boundary near 10 bits of accuracy and extend to the high-accuracy end.
- `unrolled_k` (8 evals): data_width=13..16, n_iter=11..15, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..2. *Why:* A small probe to confirm that unrolling at k=2 cannot beat the iterative area.

**Result (code):** 40 evaluations this round, 240 total; 110 feasible; hypervolume 8.107e+04 (+0.1%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible are valid. The constraints are clearly feasible: 110 of 240 evaluations are feasible, and the front has 12 designs. The front runs from area 6860 um2 at 10.1 bits to 9696 um2 at 12.5 bits, and every design clears the 1 MSPS throughput constraint (7.3 to 9.4 MSPS). The hypervolume gain this round was only +0.1%, below the 0.01 epsilon, so the search has converged. The selection rule (min area) picks the iterative design with data_width=15, n_iter=12, angle_guard=1, frac_guard=0, round, at 6860 um2 and max_abs_err 0.000917, which meets the 2^-10 bound. The pipelined and pipelined_m families are unlikely to beat it on area. pipelined_m had 0 feasible designs out of 9, with a best accuracy of 9.04 bits. Their per-stage registers would raise area, and the throughput they add is not needed.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8.107e+04 (gain this round: +0.1%).
Feasible designs: 110 of 240 evaluations (78 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 66.8
- max_abs_err <= 0.000976562: 54% violate; best seen 0.000171 (2^-12.51)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7042, accuracy_bits=10.6, ffs=100, throughput_msps=7.86, max_abs_err=0.000632 (2^-10.63), power_index=0.174
- iterative [data_width=15 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] area_um2=7169, accuracy_bits=10.8, ffs=102, throughput_msps=7.27, max_abs_err=0.000546 (2^-10.84), power_index=0.178
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=7573, accuracy_bits=11.6, ffs=107, throughput_msps=7.56, max_abs_err=0.000323 (2^-11.60), power_index=0.188
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7797, accuracy_bits=11.7, ffs=109, throughput_msps=7.7, max_abs_err=0.000311 (2^-11.65), power_index=0.182
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7826, accuracy_bits=11.7, ffs=107, throughput_msps=7.27, max_abs_err=0.000302 (2^-11.69), power_index=0.19
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=3 rounding=trunc] area_um2=8081, accuracy_bits=11.8, ffs=112, throughput_msps=7.42, max_abs_err=0.000288 (2^-11.76), power_index=0.186
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] area_um2=9348, accuracy_bits=12.3, ffs=111, throughput_msps=7.7, max_abs_err=0.000204 (2^-12.26), power_index=0.198
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=9633, accuracy_bits=12.4, ffs=113, throughput_msps=7.42, max_abs_err=0.000187 (2^-12.38), power_index=0.203
- iterative [data_width=16 n_iter=14 angle_guard=3 frac_guard=3 rounding=round] area_um2=9696, accuracy_bits=12.5, ffs=114, throughput_msps=7.42, max_abs_err=0.000171 (2^-12.51), power_index=0.205
Front coverage: area_um2 6860..9696 (HV reference 40000); accuracy_bits 10.1..12.5 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 189 evals, 97 feasible; max throughput seen 14.6 MSPS; best accuracy 12.51 bits; best feasible area_um2=6860; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 42 evals, 13 feasible; max throughput seen 11.1 MSPS; best accuracy 12.23 bits; best feasible area_um2=9556; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard 0..3, frac_guard 0..4, k 2..3
- pipelined_m: 9 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 9.04 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (12 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 253 feasible; hypervolume 4.157e+05 (+412.7%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible are valid. The constraints are clearly feasible: 110 of 240 evaluations are feasible, and the front has 12 designs. The front runs from area 6860 um2 at 10.1 bits to 9696 um2 at 12.5 bits, and every design clears the 1 MSPS throughput constraint (7.3 to 9.4 MSPS). The hypervolume gain this round was only +0.1%, below the 0.01 epsilon, so the search has converged. The selection rule (min area) picks the iterative design with data_width=15, n_iter=12, angle_guard=1, frac_guard=0, round, at 6860 um2 and max_abs_err 0.000917, which meets the 2^-10 bound. The pipelined and pipelined_m families are unlikely to beat it on area. pipelined_m had 0 feasible designs out of 9, with a best accuracy of 9.04 bits. Their per-stage registers would raise area, and the throughput they add is not needed.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.157e+05 (gain this round: +412.7%).
Feasible designs: 253 of 400 evaluations (208 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 66.8
- max_abs_err <= 0.000976562: 37% violate; best seen 4.14e-08 (2^-24.53)

Pareto front (feasible, 34 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=7449, accuracy_bits=11.3, ffs=106, throughput_msps=8, max_abs_err=0.000401 (2^-11.28), power_index=0.175
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7826, accuracy_bits=11.7, ffs=107, throughput_msps=7.27, max_abs_err=0.000302 (2^-11.69), power_index=0.19
- iterative [data_width=17 n_iter=24 angle_guard=2 frac_guard=0 rounding=round] area_um2=8207, accuracy_bits=12.8, ffs=113, throughput_msps=4.67, max_abs_err=0.000139 (2^-12.81), power_index=0.3
- iterative [data_width=21 n_iter=21 angle_guard=-2 frac_guard=0 rounding=trunc] area_um2=9568, accuracy_bits=14.1, ffs=130, throughput_msps=4.91, max_abs_err=5.61e-05 (2^-14.12), power_index=0.309
- iterative [data_width=21 n_iter=16 angle_guard=4 frac_guard=0 rounding=round] area_um2=9764, accuracy_bits=14.7, ffs=136, throughput_msps=5.46, max_abs_err=3.63e-05 (2^-14.75), power_index=0.253
- iterative [data_width=21 n_iter=24 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=10201, accuracy_bits=16.1, ffs=136, throughput_msps=4.22, max_abs_err=1.38e-05 (2^-16.15), power_index=0.366
- iterative [data_width=25 n_iter=24 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=11846, accuracy_bits=19.4, ffs=155, throughput_msps=3.73, max_abs_err=1.48e-06 (2^-19.36), power_index=0.422
- iterative [data_width=27 n_iter=25 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=12933, accuracy_bits=21.2, ffs=166, throughput_msps=3.4, max_abs_err=4.02e-07 (2^-21.25), power_index=0.472
- iterative [data_width=28 n_iter=30 angle_guard=2 frac_guard=3 rounding=round] area_um2=17819, accuracy_bits=24.5, ffs=179, throughput_msps=2.67, max_abs_err=4.14e-08 (2^-24.53), power_index=0.676
Front coverage: area_um2 6860..17819 (HV reference 40000); accuracy_bits 10.1..24.5 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 349 evals, 240 feasible; max throughput seen 14.6 MSPS; best accuracy 24.53 bits; best feasible area_um2=6860; feasible ranges: data_width 13..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 42 evals, 13 feasible; max throughput seen 11.1 MSPS; best accuracy 12.23 bits; best feasible area_um2=9556; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard 0..3, frac_guard 0..4, k 2..3
- pipelined_m: 9 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 9.04 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19820 in, 3146 out
- provider-reported cost: $0.0711
- full prompts and replies: `llm_trace.jsonl`

