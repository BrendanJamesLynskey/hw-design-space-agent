# DSE run: asic_low_area

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 7313 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1948 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 105 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 136 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 7.16 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 19 | exact: schedule |
| latency_ns | 140 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.193 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000643 (2^-10.60) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 10.5 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.000131 (2^-12.89) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 2.15 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.6 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 19 cycles, a new input every 19 cycle(s). DDS tone from its exact outputs: SFDR 91.6 dBc, SNR 74.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc` | 7313 | 105 | 7.2 | 19 | 0.193 | 0.000643 (2^-10.60) | 10.60 |
| 1 | `iterative:data_width=17,n_iter=12,angle_guard=1,frac_guard=0,rounding=round` | 7595 | 111 | 8.7 | 15 | 0.159 | 0.000568 (2^-10.78) | 10.78 |
| 2 | `iterative:data_width=17,n_iter=13,angle_guard=0,frac_guard=0,rounding=round` | 7629 | 109 | 8.5 | 16 | 0.169 | 0.000418 (2^-11.23) | 11.23 |
| 3 | `iterative:data_width=15,n_iter=18,angle_guard=4,frac_guard=2,rounding=trunc` | 7829 | 108 | 6.0 | 21 | 0.223 | 0.000344 (2^-11.50) | 11.50 |
| 4 | `iterative:data_width=17,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 7910 | 111 | 6.9 | 19 | 0.205 | 0.000149 (2^-12.71) | 12.71 |
| 5 | `iterative:data_width=18,n_iter=28,angle_guard=3,frac_guard=1,rounding=trunc` | 8825 | 121 | 3.8 | 31 | 0.371 | 0.000141 (2^-12.79) | 12.79 |
| 6 | `iterative:data_width=17,n_iter=19,angle_guard=4,frac_guard=3,rounding=trunc` | 9090 | 121 | 5.4 | 22 | 0.266 | 6.86e-05 (2^-13.83) | 13.83 |
| 7 | `iterative:data_width=19,n_iter=28,angle_guard=2,frac_guard=0,rounding=round` | 9196 | 124 | 3.8 | 31 | 0.381 | 3.86e-05 (2^-14.66) | 14.66 |
| 8 | `iterative:data_width=21,n_iter=22,angle_guard=2,frac_guard=0,rounding=trunc` | 9846 | 135 | 4.4 | 25 | 0.332 | 2.36e-05 (2^-15.37) | 15.37 |
| 9 | `iterative:data_width=22,n_iter=29,angle_guard=2,frac_guard=0,rounding=trunc` | 10371 | 140 | 3.3 | 32 | 0.445 | 1.67e-05 (2^-15.87) | 15.87 |
| 10 | `iterative:data_width=22,n_iter=22,angle_guard=4,frac_guard=0,rounding=trunc` | 10461 | 142 | 4.0 | 25 | 0.352 | 1.22e-05 (2^-16.32) | 16.32 |
| 11 | `iterative:data_width=22,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 10635 | 139 | 3.6 | 31 | 0.434 | 6.76e-06 (2^-17.17) | 17.17 |
| 12 | `iterative:data_width=23,n_iter=19,angle_guard=3,frac_guard=2,rounding=trunc` | 11395 | 151 | 4.6 | 22 | 0.332 | 4.81e-06 (2^-17.66) | 17.66 |
| 13 | `iterative:data_width=25,n_iter=28,angle_guard=-1,frac_guard=0,rounding=trunc` | 11792 | 153 | 3.3 | 31 | 0.479 | 2.92e-06 (2^-18.39) | 18.39 |
| 14 | `iterative:data_width=24,n_iter=28,angle_guard=3,frac_guard=0,rounding=round` | 11824 | 152 | 3.2 | 31 | 0.478 | 1.62e-06 (2^-19.24) | 19.24 |
| 15 | `iterative:data_width=25,n_iter=22,angle_guard=3,frac_guard=0,rounding=trunc` | 11864 | 158 | 3.8 | 25 | 0.394 | 1.53e-06 (2^-19.31) | 19.31 |
| 16 | `iterative:data_width=25,n_iter=25,angle_guard=2,frac_guard=0,rounding=trunc` | 11946 | 156 | 3.5 | 28 | 0.441 | 1.47e-06 (2^-19.37) | 19.37 |
| 17 | `iterative:data_width=25,n_iter=21,angle_guard=4,frac_guard=1,rounding=trunc` | 12224 | 161 | 3.9 | 24 | 0.387 | 1.36e-06 (2^-19.49) | 19.49 |
| 18 | `iterative:data_width=25,n_iter=22,angle_guard=4,frac_guard=1,rounding=trunc` | 12309 | 161 | 3.7 | 25 | 0.405 | 1e-06 (2^-19.93) | 19.93 |
| 19 | `iterative:data_width=25,n_iter=22,angle_guard=3,frac_guard=3,rounding=trunc` | 13009 | 164 | 3.8 | 25 | 0.42 | 7e-07 (2^-20.45) | 20.45 |
| 20 | `iterative:data_width=28,n_iter=28,angle_guard=0,frac_guard=0,rounding=trunc` | 13540 | 171 | 3.1 | 31 | 0.542 | 2.45e-07 (2^-21.96) | 21.96 |
| 21 | `iterative:data_width=28,n_iter=28,angle_guard=3,frac_guard=0,rounding=trunc` | 13730 | 174 | 2.8 | 31 | 0.551 | 2.17e-07 (2^-22.13) | 22.13 |
| 22 | `iterative:data_width=28,n_iter=28,angle_guard=4,frac_guard=0,rounding=round` | 14121 | 175 | 2.8 | 31 | 0.56 | 1.03e-07 (2^-23.22) | 23.22 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec demands >=1 MSPS throughput and max_abs_err <= 2^-10, minimizing area. pipelined_m is the primary candidate: 1 result/cycle guarantees throughput at modest Fmax, and m=2-4 keeps register count low for small area. unrolled_k is secondary: k=2-4 gives >=1 MSPS at lower Fmax with potentially competitive area. iterative is tertiary: smallest area but requires higher Fmax to meet throughput; included to explore the extreme low-area corner. data_width 12-18 and n_iter 10-16 are chosen to satisfy the error constraint with margin while keeping widths small for area minimization. angle_guard -1..1 and frac_guard 0..2 cover reasonable guard-bit ranges without excessive width inflation.*)
- `pipelined_m` (50 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m offers the best area/throughput trade-off: 1 result/cycle (meets >=1 MSPS easily at modest Fmax) with fewer registers than fully pipelined (m>1), keeping area low while maintaining high throughput. data_width 12-18 and n_iter 10-16 should satisfy max_abs_err <= 2^-10 with margin; smaller widths minimize area. m=2-4 balances register count vs latency.
- `unrolled_k` (30 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* unrolled_k with k=2-4 can achieve >=1 MSPS at lower Fmax than iterative, with shared datapath keeping area competitive. Fewer pipeline registers than pipelined_m variants may yield smaller area for similar throughput. Same accuracy ranges as pipelined_m.
- `iterative` (20 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round. *Why:* iterative has minimal area (single datapath, fewest FFs) but only 1 result every N+3 cycles. At N=10-16, throughput = Fmax/(13-19). To meet >=1 MSPS, needs Fmax >= 13-19 MHz, which is easily achievable. Likely smallest-area feasible point; included to anchor the low-area end of the Pareto front.

**Result (code):** 100 evaluations this round, 100 total; 69 feasible; hypervolume 9.658e+04 (n/a).

**LLM decision:** `add_family` — The current front is dominated by the `iterative` family at the low-area end (7313 um^2), but `iterative` is a single-result-per-cycle architecture that is inherently area-inefficient compared to pipelined designs for high throughput. The `pipelined` family (1 result/cycle, N+2 latency) has not been explored yet. Given the constraint `throughput_msps >= 1` and the objective `min area_um2`, `pipelined` is the strongest candidate to beat the current best area of 7313 um^2. Pipelined architectures typically have lower area than unrolled or iterative designs for the same accuracy because they avoid the complex FSM/multiplexing of iterative/unrolled designs and can use simpler datapaths. The `pipelined_m` family (register every m stages) is already on the front but at much higher areas (25k-31k um^2), suggesting that full pipelining (`pipelined`, m=1 effectively) might offer a better area/accuracy trade-off if the datapath is optimized. We should explore `pipelined` to see if it can push the area below 7313 um^2 while maintaining accuracy >= 10 bits and throughput >= 1 MSPS.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 9.658e+04 (gain this round: n/a (first round)).
Feasible designs: 69 of 100 evaluations (58 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 102
- max_abs_err <= 0.000976562: 31% violate; best seen 8.08e-05 (2^-13.60)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=7313, accuracy_bits=10.6, ffs=105, throughput_msps=7.16, max_abs_err=0.000643 (2^-10.60), power_index=0.193
- iterative [data_width=17 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=7595, accuracy_bits=10.8, ffs=111, throughput_msps=8.73, max_abs_err=0.000568 (2^-10.78), power_index=0.159
- iterative [data_width=17 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=7629, accuracy_bits=11.2, ffs=109, throughput_msps=8.5, max_abs_err=0.000418 (2^-11.23), power_index=0.169
- iterative [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=7910, accuracy_bits=12.7, ffs=111, throughput_msps=6.89, max_abs_err=0.000149 (2^-12.71), power_index=0.205
- unrolled_k [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=4] area_um2=15697, accuracy_bits=12.8, ffs=113, throughput_msps=5.13, max_abs_err=0.000145 (2^-12.76), power_index=0.109
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=4] area_um2=29842, accuracy_bits=13.3, ffs=291, throughput_msps=37.9, max_abs_err=0.000102 (2^-13.26), power_index=0.0338
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=4] area_um2=31503, accuracy_bits=13.6, ffs=291, throughput_msps=37.9, max_abs_err=8.08e-05 (2^-13.60), power_index=0.0347
Front coverage: area_um2 7313..31503 (HV reference 40000); accuracy_bits 10.6..13.6 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 20 evals, 8 feasible; max throughput seen 11.8 MSPS; best accuracy 12.71 bits; best feasible area_um2=7313; feasible ranges: data_width 16..18, n_iter 12..16, angle_guard 0..1, frac_guard 0..1
- unrolled_k: 30 evals, 23 feasible; max throughput seen 9.46 MSPS; best accuracy 12.76 bits; best feasible area_um2=9939; feasible ranges: data_width 14..17, n_iter 12..16, angle_guard 0..1, frac_guard 1..2, k 2..4
- pipelined_m: 50 evals, 38 feasible; max throughput seen 102 MSPS; best accuracy 13.60 bits; best feasible area_um2=25260; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard -1..1, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The `pipelined` family is the only one not yet explored and is likely to offer the best area efficiency for the given constraints. The ranges are chosen to cover the region where other families have found feasible designs, ensuring that the search is focused on the relevant part of the design space.*)
- `pipelined` (100 evals): data_width=14..18, n_iter=12..16, angle_guard=0..1, frac_guard=0..2, rounding=trunc|round. *Why:* Explore the unexplored `pipelined` family to find lower-area designs than the current best of 7313 um^2 from `iterative`. Ranges are set based on the feasible regions of other families (data_width 14-18, n_iter 12-16) to focus on the accuracy/throughput sweet spot.

**Result (code):** 100 evaluations this round, 200 total; 163 feasible; hypervolume 9.658e+04 (+0.0%).

**LLM decision:** `refine` — The front spans area 7313-31503 um2 and accuracy 10.6-13.6 bits, but the middle region (accuracy 11-13 bits, area 8k-25k um2) is sparsely covered. iterative dominates the low-area corner and pipelined_m the high-accuracy corner; unrolled_k and pipelined are dominated on area for their accuracy. Refining iterative and pipelined_m in their proven feasible boxes will fill the gap and improve hypervolume. 200 evals remain, enough for one focused round.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9.658e+04 (gain this round: +0.0%).
Feasible designs: 163 of 200 evaluations (125 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 18% violate; best seen 8.08e-05 (2^-13.60)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=7313, accuracy_bits=10.6, ffs=105, throughput_msps=7.16, max_abs_err=0.000643 (2^-10.60), power_index=0.193
- iterative [data_width=17 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=7595, accuracy_bits=10.8, ffs=111, throughput_msps=8.73, max_abs_err=0.000568 (2^-10.78), power_index=0.159
- iterative [data_width=17 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=7629, accuracy_bits=11.2, ffs=109, throughput_msps=8.5, max_abs_err=0.000418 (2^-11.23), power_index=0.169
- iterative [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=7910, accuracy_bits=12.7, ffs=111, throughput_msps=6.89, max_abs_err=0.000149 (2^-12.71), power_index=0.205
- unrolled_k [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=4] area_um2=15697, accuracy_bits=12.8, ffs=113, throughput_msps=5.13, max_abs_err=0.000145 (2^-12.76), power_index=0.109
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=4] area_um2=29842, accuracy_bits=13.3, ffs=291, throughput_msps=37.9, max_abs_err=0.000102 (2^-13.26), power_index=0.0338
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=4] area_um2=31503, accuracy_bits=13.6, ffs=291, throughput_msps=37.9, max_abs_err=8.08e-05 (2^-13.60), power_index=0.0347
Front coverage: area_um2 7313..31503 (HV reference 40000); accuracy_bits 10.6..13.6 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 20 evals, 8 feasible; max throughput seen 11.8 MSPS; best accuracy 12.71 bits; best feasible area_um2=7313; feasible ranges: data_width 16..18, n_iter 12..16, angle_guard 0..1, frac_guard 0..1
- unrolled_k: 30 evals, 23 feasible; max throughput seen 9.46 MSPS; best accuracy 12.76 bits; best feasible area_um2=9939; feasible ranges: data_width 14..17, n_iter 12..16, angle_guard 0..1, frac_guard 1..2, k 2..4
- pipelined: 100 evals, 94 feasible; max throughput seen 171 MSPS; best accuracy 13.35 bits; best feasible area_um2=29624; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard 0..1, frac_guard 0..2
- pipelined_m: 50 evals, 38 feasible; max throughput seen 102 MSPS; best accuracy 13.60 bits; best feasible area_um2=25260; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard -1..1, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `iterative` (115 evals): data_width=15..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (4 front designs; box front_anchored)
- `unrolled_k` (28 evals): data_width=16..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* code: map the front of unrolled_k (1 front designs; box front_anchored)
- `pipelined_m` (57 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (2 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 360 feasible; hypervolume 3.865e+05 (+300.2%).

**No LLM call** (code's front-mapping round): The front spans area 7313-31503 um2 and accuracy 10.6-13.6 bits, but the middle region (accuracy 11-13 bits, area 8k-25k um2) is sparsely covered. iterative dominates the low-area corner and pipelined_m the high-accuracy corner; unrolled_k and pipelined are dominated on area for their accuracy. Refining iterative and pipelined_m in their proven feasible boxes will fill the gap and improve hypervolume. 200 evals remain, enough for one focused round.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 3.865e+05 (gain this round: +300.2%).
Feasible designs: 360 of 400 evaluations (309 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 10% violate; best seen 1.03e-07 (2^-23.22)

Pareto front (feasible, 23 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=7313, accuracy_bits=10.6, ffs=105, throughput_msps=7.16, max_abs_err=0.000643 (2^-10.60), power_index=0.193
- iterative [data_width=17 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=7629, accuracy_bits=11.2, ffs=109, throughput_msps=8.5, max_abs_err=0.000418 (2^-11.23), power_index=0.169
- iterative [data_width=18 n_iter=28 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=8825, accuracy_bits=12.8, ffs=121, throughput_msps=3.8, max_abs_err=0.000141 (2^-12.79), power_index=0.371
- iterative [data_width=19 n_iter=28 angle_guard=2 frac_guard=0 rounding=round] area_um2=9196, accuracy_bits=14.7, ffs=124, throughput_msps=3.8, max_abs_err=3.86e-05 (2^-14.66), power_index=0.381
- iterative [data_width=22 n_iter=22 angle_guard=4 frac_guard=0 rounding=trunc] area_um2=10461, accuracy_bits=16.3, ffs=142, throughput_msps=4.03, max_abs_err=1.22e-05 (2^-16.32), power_index=0.352
- iterative [data_width=23 n_iter=19 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=11395, accuracy_bits=17.7, ffs=151, throughput_msps=4.58, max_abs_err=4.81e-06 (2^-17.66), power_index=0.332
- iterative [data_width=25 n_iter=22 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=11864, accuracy_bits=19.3, ffs=158, throughput_msps=3.81, max_abs_err=1.53e-06 (2^-19.31), power_index=0.394
- iterative [data_width=25 n_iter=21 angle_guard=4 frac_guard=1 rounding=trunc] area_um2=12224, accuracy_bits=19.5, ffs=161, throughput_msps=3.87, max_abs_err=1.36e-06 (2^-19.49), power_index=0.387
- iterative [data_width=28 n_iter=28 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=13540, accuracy_bits=22, ffs=171, throughput_msps=3.07, max_abs_err=2.45e-07 (2^-21.96), power_index=0.542
- iterative [data_width=28 n_iter=28 angle_guard=4 frac_guard=0 rounding=round] area_um2=14121, accuracy_bits=23.2, ffs=175, throughput_msps=2.77, max_abs_err=1.03e-07 (2^-23.22), power_index=0.56
Front coverage: area_um2 7313..14121 (HV reference 40000); accuracy_bits 10.6..23.2 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 135 evals, 120 feasible; max throughput seen 11.8 MSPS; best accuracy 23.22 bits; best feasible area_um2=7313; feasible ranges: data_width 15..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 58 evals, 51 feasible; max throughput seen 9.46 MSPS; best accuracy 22.33 bits; best feasible area_um2=9939; feasible ranges: data_width 14..28, n_iter 12..26, angle_guard -2..4, frac_guard 0..4, k 2..8
- pipelined: 100 evals, 94 feasible; max throughput seen 171 MSPS; best accuracy 13.35 bits; best feasible area_um2=29624; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard 0..1, frac_guard 0..2
- pipelined_m: 107 evals, 95 feasible; max throughput seen 102 MSPS; best accuracy 22.97 bits; best feasible area_um2=25260; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7247 in, 3059 out
- provider-reported cost: $0.0087
- full prompts and replies: `llm_trace.jsonl`

