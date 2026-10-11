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

Winner check (1 of 39 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on

## Pareto front (39 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round` | 6860 | 100 | 9.4 | 15 | 0.144 | 0.000917 (2^-10.09) | 10.09 |
| 1 | `iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 6994 | 100 | 8.3 | 17 | 0.164 | 0.000632 (2^-10.63) | 10.63 |
| 2 | `iterative:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` | 7313 | 105 | 8.5 | 16 | 0.162 | 0.000417 (2^-11.23) | 11.23 |
| 3 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 7385 | 105 | 8.0 | 17 | 0.173 | 0.000342 (2^-11.51) | 11.51 |
| 4 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 7446 | 105 | 7.6 | 18 | 0.184 | 0.000301 (2^-11.70) | 11.70 |
| 5 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc` | 7860 | 111 | 7.7 | 17 | 0.183 | 0.00027 (2^-11.85) | 11.85 |
| 6 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 7933 | 111 | 7.3 | 18 | 0.195 | 0.000241 (2^-12.02) | 12.02 |
| 7 | `iterative:data_width=16,n_iter=23,angle_guard=3,frac_guard=2,rounding=trunc` | 8242 | 113 | 4.9 | 26 | 0.289 | 0.000228 (2^-12.10) | 12.10 |
| 8 | `iterative:data_width=17,n_iter=20,angle_guard=4,frac_guard=1,rounding=trunc` | 8412 | 117 | 5.1 | 23 | 0.264 | 0.000172 (2^-12.51) | 12.51 |
| 9 | `iterative:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 8497 | 120 | 7.4 | 17 | 0.199 | 0.000164 (2^-12.57) | 12.57 |
| 10 | `iterative:data_width=17,n_iter=18,angle_guard=3,frac_guard=2,rounding=trunc` | 8645 | 118 | 5.8 | 21 | 0.245 | 9.91e-05 (2^-13.30) | 13.30 |
| 11 | `iterative:data_width=18,n_iter=20,angle_guard=3,frac_guard=0,rounding=round` | 8686 | 119 | 5.1 | 23 | 0.27 | 7.75e-05 (2^-13.65) | 13.65 |
| 12 | `iterative:data_width=19,n_iter=22,angle_guard=3,frac_guard=0,rounding=round` | 9187 | 125 | 4.6 | 25 | 0.309 | 3.74e-05 (2^-14.71) | 14.71 |
| 13 | `iterative:data_width=21,n_iter=28,angle_guard=-1,frac_guard=0,rounding=round` | 9996 | 131 | 3.8 | 31 | 0.409 | 2.94e-05 (2^-15.06) | 15.06 |
| 14 | `iterative:data_width=20,n_iter=19,angle_guard=3,frac_guard=2,rounding=trunc` | 10038 | 135 | 5.0 | 22 | 0.295 | 1.63e-05 (2^-15.90) | 15.90 |
| 15 | `iterative:data_width=21,n_iter=28,angle_guard=4,frac_guard=0,rounding=round` | 10313 | 137 | 3.3 | 31 | 0.424 | 1.15e-05 (2^-16.41) | 16.41 |
| 16 | `iterative:data_width=23,n_iter=19,angle_guard=-1,frac_guard=0,rounding=trunc` | 10451 | 142 | 5.0 | 22 | 0.309 | 1.05e-05 (2^-16.54) | 16.54 |
| 17 | `iterative:data_width=23,n_iter=22,angle_guard=-1,frac_guard=0,rounding=trunc` | 10633 | 142 | 4.4 | 25 | 0.354 | 8.62e-06 (2^-16.82) | 16.82 |
| 18 | `iterative:data_width=23,n_iter=19,angle_guard=3,frac_guard=0,rounding=trunc` | 10705 | 147 | 4.6 | 22 | 0.318 | 7.63e-06 (2^-17.00) | 17.00 |
| 19 | `iterative:data_width=23,n_iter=24,angle_guard=2,frac_guard=0,rounding=trunc` | 10884 | 146 | 3.8 | 27 | 0.392 | 5.84e-06 (2^-17.39) | 17.39 |
| 20 | `iterative:data_width=24,n_iter=22,angle_guard=-1,frac_guard=0,rounding=trunc` | 11122 | 148 | 4.3 | 25 | 0.369 | 4.14e-06 (2^-17.88) | 17.88 |
| 21 | `iterative:data_width=23,n_iter=28,angle_guard=2,frac_guard=0,rounding=round` | 11224 | 146 | 3.3 | 31 | 0.456 | 2.9e-06 (2^-18.39) | 18.39 |
| 22 | `iterative:data_width=24,n_iter=24,angle_guard=0,frac_guard=0,rounding=round` | 11549 | 149 | 4.0 | 27 | 0.407 | 2.49e-06 (2^-18.62) | 18.62 |
| 23 | `iterative:data_width=25,n_iter=22,angle_guard=3,frac_guard=0,rounding=trunc` | 11864 | 158 | 3.8 | 25 | 0.394 | 1.53e-06 (2^-19.31) | 19.31 |
| 24 | `iterative:data_width=25,n_iter=22,angle_guard=3,frac_guard=0,rounding=round` | 12119 | 158 | 3.8 | 25 | 0.398 | 1.06e-06 (2^-19.85) | 19.85 |
| 25 | `iterative:data_width=26,n_iter=24,angle_guard=0,frac_guard=0,rounding=trunc` | 12296 | 160 | 3.7 | 27 | 0.435 | 9.44e-07 (2^-20.02) | 20.02 |
| 26 | `iterative:data_width=25,n_iter=24,angle_guard=3,frac_guard=1,rounding=trunc` | 12379 | 160 | 3.5 | 27 | 0.437 | 8.18e-07 (2^-20.22) | 20.22 |
| 27 | `iterative:data_width=27,n_iter=28,angle_guard=-1,frac_guard=0,rounding=trunc` | 12915 | 164 | 3.2 | 31 | 0.519 | 7.11e-07 (2^-20.42) | 20.42 |
| 28 | `iterative:data_width=26,n_iter=28,angle_guard=4,frac_guard=1,rounding=trunc` | 13125 | 166 | 2.9 | 31 | 0.526 | 4.11e-07 (2^-21.21) | 21.21 |
| 29 | `iterative:data_width=27,n_iter=29,angle_guard=4,frac_guard=0,rounding=trunc` | 13244 | 170 | 2.8 | 32 | 0.551 | 4.03e-07 (2^-21.24) | 21.24 |
| 30 | `iterative:data_width=25,n_iter=25,angle_guard=3,frac_guard=3,rounding=trunc` | 13263 | 164 | 3.4 | 28 | 0.474 | 3.42e-07 (2^-21.48) | 21.48 |
| 31 | `iterative:data_width=27,n_iter=25,angle_guard=0,frac_guard=1,rounding=trunc` | 13287 | 167 | 3.4 | 28 | 0.48 | 3.31e-07 (2^-21.53) | 21.53 |
| 32 | `iterative:data_width=26,n_iter=26,angle_guard=1,frac_guard=2,rounding=trunc` | 13304 | 165 | 3.3 | 29 | 0.494 | 3.25e-07 (2^-21.55) | 21.55 |
| 33 | `iterative:data_width=27,n_iter=26,angle_guard=1,frac_guard=2,rounding=trunc` | 13841 | 171 | 3.2 | 29 | 0.512 | 1.72e-07 (2^-22.47) | 22.47 |
| 34 | `iterative:data_width=27,n_iter=25,angle_guard=3,frac_guard=2,rounding=trunc` | 13895 | 173 | 3.2 | 28 | 0.498 | 1.44e-07 (2^-22.73) | 22.73 |
| 35 | `iterative:data_width=28,n_iter=26,angle_guard=3,frac_guard=0,rounding=round` | 13948 | 174 | 3.0 | 29 | 0.519 | 1.1e-07 (2^-23.12) | 23.12 |
| 36 | `iterative:data_width=27,n_iter=25,angle_guard=4,frac_guard=4,rounding=trunc` | 14795 | 178 | 3.1 | 28 | 0.522 | 1.05e-07 (2^-23.18) | 23.18 |
| 37 | `iterative:data_width=28,n_iter=26,angle_guard=3,frac_guard=3,rounding=trunc` | 14935 | 181 | 3.0 | 29 | 0.546 | 5.73e-08 (2^-24.06) | 24.06 |
| 38 | `iterative:data_width=27,n_iter=30,angle_guard=4,frac_guard=4,rounding=trunc` | 15159 | 178 | 2.7 | 33 | 0.622 | 5.53e-08 (2^-24.11) | 24.11 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec's only hard performance constraint is 1 MSPS, which every family meets comfortably (iterative at N+3 cycles/result still yields several MSPS at typical Fmax), so the real trade-off is area vs accuracy_bits and the front should be dominated by the smallest-datapath family, iterative. Accuracy is identical across families for the same (data_width, n_iter, angle_guard, frac_guard, rounding), and 10 accuracy bits requires roughly W>=12 (output LSB 2^-(W-2)) plus N>=12-14 to keep the CORDIC angle residual below 2^-10, so the search boxes centre on W 10-16, N 10-18 with small angle/frac guards and both rounding modes. Budget is weighted heavily to iterative (0.6) to map the area/accuracy knee, with smaller shares on unrolled_k (small k) and the pipelined variants to confirm they are dominated rather than assume it.*)
- `iterative` (60 evals): data_width=10..16, n_iter=10..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Smallest datapath (one shared adder + barrel shifters) so it should own the low-area end of the front; its N+3 cycles/result still gives several MSPS at typical Fmax, so the 1 MSPS constraint is not binding. Ranges bracket the accuracy boundary: W=12 gives a 2^-10 output LSB, so W 10-16 with N 10-18 and small guards should straddle the 10-bit accuracy limit.
- `unrolled_k` (20 evals): data_width=10..16, n_iter=10..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Same bit-exact accuracy as iterative for identical W/N/guards, but k chained rotations per cycle cost more area for throughput we do not need; small k (2-4) is the only region that could conceivably stay near the area front, so sample it to confirm or rule it out.
- `pipelined_m` (12 evals): data_width=10..16, n_iter=10..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Registering every m stages adds pipeline registers across the full datapath; with m 2-4 it is the least area-penalised pipelined variant, worth a small share to check whether any point reaches the front (it should be dominated given 1 MSPS is already met).
- `pipelined` (8 evals): data_width=10..16, n_iter=10..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* One register per micro-rotation is the largest-area family and its 1 result/cycle is far beyond the 1 MSPS requirement, so it is expected to be dominated; a minimal share is kept only to verify that no accuracy/area surprise exists.

**Result (code):** 100 evaluations this round, 100 total; 43 feasible; hypervolume 7.434e+04 (n/a).

**LLM decision:** `map_front` — The feasible front is entirely `iterative` and spans only data_width 15..16 (registry 8..28) and accuracy_bits 10.1..12.3, i.e. a small slice of both objective ranges; with HV reference at area 40000 and accuracy 10 there is large uncovered headroom. The min-area corner (6860 um2, 10.1 bits) sits right at the 2^-10 constraint, so the low-area end may extend to data_width=14, and the high-accuracy end is wide open at larger data_width. unrolled_k (best feasible area 9169) is dominated, and pipelined/pipelined_m (0 feasible, best accuracy 9.42/9.79) only add throughput, which is a constraint already met, so they cannot improve the area/accuracy front. A code-driven NSGA-II over the full ranges of the front family, seeded with the current front, is the right use of this round to map the whole trade-off curve.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7.434e+04 (gain this round: n/a (first round)).
Feasible designs: 43 of 100 evaluations (36 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 57% violate; best seen 0.0002 (2^-12.29)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=6994, accuracy_bits=10.6, ffs=100, throughput_msps=8.32, max_abs_err=0.000632 (2^-10.63), power_index=0.164
- iterative [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=7313, accuracy_bits=11.2, ffs=105, throughput_msps=8.5, max_abs_err=0.000417 (2^-11.23), power_index=0.162
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=7385, accuracy_bits=11.5, ffs=105, throughput_msps=8, max_abs_err=0.000342 (2^-11.51), power_index=0.173
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7446, accuracy_bits=11.7, ffs=105, throughput_msps=7.56, max_abs_err=0.000301 (2^-11.70), power_index=0.184
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=7860, accuracy_bits=11.9, ffs=111, throughput_msps=7.7, max_abs_err=0.00027 (2^-11.85), power_index=0.183
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=7933, accuracy_bits=12, ffs=111, throughput_msps=7.27, max_abs_err=0.000241 (2^-12.02), power_index=0.195
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round] area_um2=9064, accuracy_bits=12.2, ffs=108, throughput_msps=7.7, max_abs_err=0.000209 (2^-12.22), power_index=0.193
- iterative [data_width=16 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] area_um2=9566, accuracy_bits=12.3, ffs=111, throughput_msps=6.55, max_abs_err=0.0002 (2^-12.29), power_index=0.236
Front coverage: area_um2 6860..9566 (HV reference 40000); accuracy_bits 10.1..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 60 evals, 31 feasible; max throughput seen 14.4 MSPS; best accuracy 12.29 bits; best feasible area_um2=6860; feasible ranges: data_width 15..16, n_iter 12..18, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 20 evals, 12 feasible; max throughput seen 10.6 MSPS; best accuracy 11.40 bits; best feasible area_um2=9169; feasible ranges: data_width 13..16, n_iter 12..18, angle_guard 0..2, frac_guard 1..2, k 2..4
- pipelined: 8 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 12 evals, 0 feasible; max throughput seen 108 MSPS; best accuracy 9.79 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (9 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 137 feasible; hypervolume 4.078e+05 (+448.6%).

**LLM decision:** `map_front` — The feasible front is entirely one family (iterative, 26 designs); the other families cannot improve it: unrolled_k's best feasible area is 9169 > 6860, and pipelined/pipelined_m have 0 feasible designs (best accuracy 9.42/9.79 bits, below the 2^-10 requirement), so their high throughput (201/108 MSPS) is irrelevant given the throughput floor is only 1 MSPS. The front spans area 6860..14935 against the HV reference of 40000 — only ~17-37% of the area range — while accuracy already reaches 24.1 bits, near the achievable max (data_width=28). With 200 of 400 evals left, the best use of budget is to map the full iterative front (full registry ranges, seeded with the current front) to densify the low-area region and push HV toward its ceiling. Constraints are comfortably satisfied (min-area design 6860 um^2 at 10.1 bits > 10; throughput best 201 >> 1), so no infeasibility or family change is warranted.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4.078e+05 (gain this round: +448.6%).
Feasible designs: 137 of 200 evaluations (123 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 32% violate; best seen 5.73e-08 (2^-24.06)

Pareto front (feasible, 26 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=7385, accuracy_bits=11.5, ffs=105, throughput_msps=8, max_abs_err=0.000342 (2^-11.51), power_index=0.173
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=7933, accuracy_bits=12, ffs=111, throughput_msps=7.27, max_abs_err=0.000241 (2^-12.02), power_index=0.195
- iterative [data_width=16 n_iter=23 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=8993, accuracy_bits=13.1, ffs=117, throughput_msps=4.69, max_abs_err=0.000113 (2^-13.11), power_index=0.307
- iterative [data_width=23 n_iter=25 angle_guard=-2 frac_guard=0 rounding=trunc] area_um2=10642, accuracy_bits=16.1, ffs=141, throughput_msps=3.94, max_abs_err=1.44e-05 (2^-16.08), power_index=0.395
- iterative [data_width=24 n_iter=22 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=11122, accuracy_bits=17.9, ffs=148, throughput_msps=4.28, max_abs_err=4.14e-06 (2^-17.88), power_index=0.369
- iterative [data_width=25 n_iter=22 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=11864, accuracy_bits=19.3, ffs=158, throughput_msps=3.81, max_abs_err=1.53e-06 (2^-19.31), power_index=0.394
- iterative [data_width=25 n_iter=24 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=12379, accuracy_bits=20.2, ffs=160, throughput_msps=3.53, max_abs_err=8.18e-07 (2^-20.22), power_index=0.437
- iterative [data_width=27 n_iter=25 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=13895, accuracy_bits=22.7, ffs=173, throughput_msps=3.23, max_abs_err=1.44e-07 (2^-22.73), power_index=0.498
- iterative [data_width=28 n_iter=26 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=14935, accuracy_bits=24.1, ffs=181, throughput_msps=3.04, max_abs_err=5.73e-08 (2^-24.06), power_index=0.546
Front coverage: area_um2 6860..14935 (HV reference 40000); accuracy_bits 10.1..24.1 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 160 evals, 125 feasible; max throughput seen 14.4 MSPS; best accuracy 24.06 bits; best feasible area_um2=6860; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 20 evals, 12 feasible; max throughput seen 10.6 MSPS; best accuracy 11.40 bits; best feasible area_um2=9169; feasible ranges: data_width 13..16, n_iter 12..18, angle_guard 0..2, frac_guard 1..2, k 2..4
- pipelined: 8 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 12 evals, 0 feasible; max throughput seen 108 MSPS; best accuracy 9.79 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (26 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 226 feasible; hypervolume 4.092e+05 (+0.3%).

**LLM decision:** `map_front` — All 4 families have now been sampled, and the Pareto front is entirely `iterative`. The other families cannot beat it on the objectives: `pipelined`/`pipelined_m` produced 0 feasible designs in 20 evals (their trial W was too small to clear 2^-10, and their per-stage register cost only helps throughput, which is a constraint at 1 MSPS, not an objective), and `unrolled_k` best feasible area is 9169 um2 vs 6860 for iterative, so it is dominated. So the front to map is the `iterative` front.

The two edges of that front are unconverged in opposite directions, and both matter:
- Low-area corner (selection rule min area_um2): best is 6860 um2 at data_width=15 / n_iter=12 with 10.09 bits, only just above the 2^-10 constraint, while iterative feasibility is reported down to data_width=14 - that lower region is unmapped and could shave the selected design's area.
- High-accuracy end (HV): with area reference 40000, HV is dominated by the term ~(40000 - area)*accuracy span, so each extra accuracy bit at the top is worth roughly 25000 HV (~6%). The front tops out at 24.06 bits with n_iter=26, but the registry allows n_iter<=30 at data_width=28; since LSB at W=28 is 2^-26 and only 2^-24.06 was achieved, n_iter is the limiter and the whole 24-26 bit region is unexplored. Extending there is the single biggest remaining HV lever, far larger than the +0.3% seen this round.

Given this is the final round (300/400 evals used), the best use of the remaining 100 evals is a seeded NSGA-II over the full ranges of the `iterative` family (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, both roundings) so the front is extended at both the low-area/constraint corner and the high-accuracy end rather than re-sampling the already-dense middle.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 4.092e+05 (gain this round: +0.3%).
Feasible designs: 226 of 300 evaluations (205 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 25% violate; best seen 5.73e-08 (2^-24.06)

Pareto front (feasible, 32 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=7385, accuracy_bits=11.5, ffs=105, throughput_msps=8, max_abs_err=0.000342 (2^-11.51), power_index=0.173
- iterative [data_width=16 n_iter=23 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=8242, accuracy_bits=12.1, ffs=113, throughput_msps=4.85, max_abs_err=0.000228 (2^-12.10), power_index=0.289
- iterative [data_width=19 n_iter=22 angle_guard=3 frac_guard=0 rounding=round] area_um2=9187, accuracy_bits=14.7, ffs=125, throughput_msps=4.56, max_abs_err=3.74e-05 (2^-14.71), power_index=0.309
- iterative [data_width=23 n_iter=22 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=10633, accuracy_bits=16.8, ffs=142, throughput_msps=4.41, max_abs_err=8.62e-06 (2^-16.82), power_index=0.354
- iterative [data_width=24 n_iter=22 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=11122, accuracy_bits=17.9, ffs=148, throughput_msps=4.28, max_abs_err=4.14e-06 (2^-17.88), power_index=0.369
- iterative [data_width=25 n_iter=22 angle_guard=3 frac_guard=0 rounding=round] area_um2=12119, accuracy_bits=19.8, ffs=158, throughput_msps=3.81, max_abs_err=1.06e-06 (2^-19.85), power_index=0.398
- iterative [data_width=25 n_iter=25 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=13263, accuracy_bits=21.5, ffs=164, throughput_msps=3.4, max_abs_err=3.42e-07 (2^-21.48), power_index=0.474
- iterative [data_width=27 n_iter=25 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=13895, accuracy_bits=22.7, ffs=173, throughput_msps=3.23, max_abs_err=1.44e-07 (2^-22.73), power_index=0.498
- iterative [data_width=28 n_iter=26 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=14935, accuracy_bits=24.1, ffs=181, throughput_msps=3.04, max_abs_err=5.73e-08 (2^-24.06), power_index=0.546
Front coverage: area_um2 6860..14935 (HV reference 40000); accuracy_bits 10.1..24.1 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 260 evals, 214 feasible; max throughput seen 14.4 MSPS; best accuracy 24.06 bits; best feasible area_um2=6860; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 20 evals, 12 feasible; max throughput seen 10.6 MSPS; best accuracy 11.40 bits; best feasible area_um2=9169; feasible ranges: data_width 13..16, n_iter 12..18, angle_guard 0..2, frac_guard 1..2, k 2..4
- pipelined: 8 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 12 evals, 0 feasible; max throughput seen 108 MSPS; best accuracy 9.79 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `iterative` (100 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (32 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 315 feasible; hypervolume 4.11e+05 (+0.4%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the front is feasible and well-covered, so no further exploration is possible or useful. Feasibility is established: 315/400 evaluations meet both constraints (0% throughput violations, best 201 MSPS vs the 1 MSPS floor; 21% error violations, best 5.53e-08 = 2^-24.11 vs the 2^-10 limit). The Pareto front spans area_um2 6860..15159 against the HV reference 40000 and accuracy_bits 10.1..24.1 against the HV reference 10, i.e. it covers essentially the full useful accuracy range and a wide area range, and all four registry families have been explored (none remaining). The spec's selection rule (min area_um2) is already satisfied by the front's low-area corner: iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] at area_um2=6860, accuracy_bits=10.1 (max_abs_err=0.000917 <= 0.000976562), throughput 9.43 MSPS >= 1 MSPS — a design that meets both constraints with margin on throughput and error. Improvement has saturated: hypervolume gain this round was only +0.4%, and the pipelined/pipelined_m families (the only high-throughput options) produced 0 feasible designs in 20 combined evaluations, so they cannot improve the constrained front. No constraint is unreachable, so `infeasible` is not warranted.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.11e+05 (gain this round: +0.4%).
Feasible designs: 315 of 400 evaluations (285 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 21% violate; best seen 5.53e-08 (2^-24.11)

Pareto front (feasible, 39 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7446, accuracy_bits=11.7, ffs=105, throughput_msps=7.56, max_abs_err=0.000301 (2^-11.70), power_index=0.184
- iterative [data_width=17 n_iter=20 angle_guard=4 frac_guard=1 rounding=trunc] area_um2=8412, accuracy_bits=12.5, ffs=117, throughput_msps=5.12, max_abs_err=0.000172 (2^-12.51), power_index=0.264
- iterative [data_width=21 n_iter=28 angle_guard=-1 frac_guard=0 rounding=round] area_um2=9996, accuracy_bits=15.1, ffs=131, throughput_msps=3.8, max_abs_err=2.94e-05 (2^-15.06), power_index=0.409
- iterative [data_width=23 n_iter=22 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=10633, accuracy_bits=16.8, ffs=142, throughput_msps=4.41, max_abs_err=8.62e-06 (2^-16.82), power_index=0.354
- iterative [data_width=23 n_iter=28 angle_guard=2 frac_guard=0 rounding=round] area_um2=11224, accuracy_bits=18.4, ffs=146, throughput_msps=3.35, max_abs_err=2.9e-06 (2^-18.39), power_index=0.456
- iterative [data_width=26 n_iter=24 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=12296, accuracy_bits=20, ffs=160, throughput_msps=3.73, max_abs_err=9.44e-07 (2^-20.02), power_index=0.435
- iterative [data_width=25 n_iter=25 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=13263, accuracy_bits=21.5, ffs=164, throughput_msps=3.4, max_abs_err=3.42e-07 (2^-21.48), power_index=0.474
- iterative [data_width=27 n_iter=25 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=13895, accuracy_bits=22.7, ffs=173, throughput_msps=3.23, max_abs_err=1.44e-07 (2^-22.73), power_index=0.498
- iterative [data_width=27 n_iter=30 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=15159, accuracy_bits=24.1, ffs=178, throughput_msps=2.67, max_abs_err=5.53e-08 (2^-24.11), power_index=0.622
Front coverage: area_um2 6860..15159 (HV reference 40000); accuracy_bits 10.1..24.1 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 360 evals, 303 feasible; max throughput seen 14.4 MSPS; best accuracy 24.11 bits; best feasible area_um2=6860; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 20 evals, 12 feasible; max throughput seen 10.6 MSPS; best accuracy 11.40 bits; best feasible area_um2=9169; feasible ranges: data_width 13..16, n_iter 12..18, angle_guard 0..2, frac_guard 1..2, k 2..4
- pipelined: 8 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 9.42 bits
- pipelined_m: 12 evals, 0 feasible; max throughput seen 108 MSPS; best accuracy 9.79 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 14448 in, 21853 out
- provider-reported cost: $0.0204
- full prompts and replies: `llm_trace.jsonl`

