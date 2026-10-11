# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_power_50msps: A 50 MSPS sin/cos unit in sky130 standard cells for a battery-powered radio: max error <= 2^-12. Minimise the relative power index; accuracy is the trade-off.
  target: asic-sky130hd
  constraint: throughput_msps >= 50
  constraint: max_abs_err <= 0.000244141
  objective: min power_index (HV ref 40)
  objective: max accuracy_bits (HV ref 12)
  select: min power_index
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 28327 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7547 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 333 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 129 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.76 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000192 (2^-12.35) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.29 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.46e-05 (2^-14.16) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.79 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 95.0 dBc, SNR 82.3 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (17 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=3` | 28327 | 333 | 54.3 | 7 | 1.76 | 0.000192 (2^-12.35) | 12.35 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=3` | 28769 | 338 | 51.9 | 7 | 1.79 | 0.000191 (2^-12.36) | 12.36 |
| 2 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=2` | 30650 | 462 | 75.4 | 9 | 2.19 | 0.000175 (2^-12.48) | 12.48 |
| 3 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 32987 | 493 | 72.3 | 9 | 2.34 | 0.000156 (2^-12.65) | 12.65 |
| 4 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=4,rounding=trunc,m=2` | 34840 | 516 | 66.8 | 9 | 2.46 | 0.000144 (2^-12.76) | 12.76 |
| 5 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round,m=2` | 35678 | 531 | 72.3 | 10 | 2.53 | 8.35e-05 (2^-13.55) | 13.55 |
| 6 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=2` | 38786 | 560 | 72.3 | 10 | 2.7 | 5.46e-05 (2^-14.16) | 14.16 |
| 7 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 40272 | 600 | 66.8 | 10 | 2.85 | 4.46e-05 (2^-14.45) | 14.45 |
| 8 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=2` | 42461 | 615 | 66.8 | 10 | 2.96 | 3.61e-05 (2^-14.76) | 14.76 |
| 9 | `pipelined_m:data_width=20,n_iter=16,angle_guard=3,frac_guard=2,rounding=round,m=2` | 42881 | 619 | 64.3 | 10 | 2.98 | 3.51e-05 (2^-14.80) | 14.80 |
| 10 | `pipelined_m:data_width=22,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc,m=2` | 47804 | 729 | 62.0 | 11 | 3.44 | 1.82e-05 (2^-15.75) | 15.75 |
| 11 | `pipelined_m:data_width=22,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=2` | 51571 | 740 | 62.0 | 11 | 3.58 | 9.56e-06 (2^-16.67) | 16.67 |
| 12 | `pipelined_m:data_width=20,n_iter=22,angle_guard=4,frac_guard=4,rounding=round,m=2` | 62715 | 888 | 62.0 | 13 | 4.32 | 4.1e-06 (2^-17.89) | 17.89 |
| 13 | `pipelined_m:data_width=27,n_iter=19,angle_guard=0,frac_guard=2,rounding=trunc,m=2` | 63155 | 954 | 52.7 | 12 | 4.51 | 3.94e-06 (2^-17.96) | 17.96 |
| 14 | `pipelined_m:data_width=26,n_iter=22,angle_guard=-1,frac_guard=0,rounding=trunc,m=2` | 65969 | 960 | 57.9 | 13 | 4.61 | 1.32e-06 (2^-19.53) | 19.53 |
| 15 | `pipelined_m:data_width=24,n_iter=22,angle_guard=4,frac_guard=2,rounding=round,m=2` | 69395 | 986 | 54.3 | 13 | 4.79 | 7.9e-07 (2^-20.27) | 20.27 |
| 16 | `pipelined_m:data_width=25,n_iter=26,angle_guard=2,frac_guard=4,rounding=trunc,m=2` | 85282 | 1217 | 52.7 | 15 | 5.9 | 3.7e-07 (2^-21.37) | 21.37 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The constraint is max_abs_err <= 2^-12 and 50 MSPS, with power as the objective, so small and narrow designs are preferred. Accuracy bits must be at least 12, so widths of 12-18 and 10-16 iterations cover the feasible boundary and some higher-accuracy points for hypervolume. Most budget goes to iterative and unrolled_k, which likely have the lowest power, and a smaller share to pipelined_m and pipelined to check if the high-throughput low-clock approach wins. Later rounds will narrow in on the families and widths that survive.*)
- `iterative` (38 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest datapath and likely lowest power, but it needs Fmax x 1/(N+3) >= 50 MSPS, so the search covers the narrow widths and iteration counts that could meet this. The error bound of 2^-12 needs W>=14 or so, so the range covers the boundary.
- `unrolled_k` (38 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..4. *Why:* Several micro-rotations per cycle raise the throughput at a low clock rate without the area of full pipelining. Small k keeps power low and still meets 50 MSPS where the iterative design cannot.
- `pipelined_m` (18 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* Registering every few stages gives 1 result/cycle at a modest clock and fewer FFs than a full pipeline, so it is a plausible low-power competitor that meets the throughput constraint easily.
- `pipelined` (6 evals): data_width=13..16, n_iter=11..15, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Full pipeline is a low-weight baseline for comparison; it meets throughput trivially but has the most FFs, so it is probably higher power.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — No feasible design yet, but the constraints look reachable. Pipelined reaches 171 MSPS and pipelined_m reaches 59.9 MSPS, so both clear the 50 MSPS floor. Iterative and unrolled_k top out at 12.4 and 8.97 MSPS, so they cannot meet throughput and should be dropped. The accuracy requirement of 12 bits is met by designs with enough iterations. Iterative designs with W=18, N=14 reach 12.65 bits, and some designs reach 14 bits. The pipelined families have only reached 10.27 and 11.45 bits, probably because they were sampled at small widths or iteration counts. Accuracy depends only on width, iterations and guard bits, so pipelined designs with data_width around 14-18 and n_iter 13-16 should reach 12+ bits. For low power the targets are minimum width and iterations, moderate guard bits, and a larger m to cut register count and clock load. Pipelined_m gets most of the budget, since fewer registers likely mean lower power while still meeting 50 MSPS; pipelined gets a smaller share as the safe high-throughput option.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 92% violate; best seen 171
- max_abs_err <= 0.000244141: 66% violate; best seen 5.94e-05 (2^-14.04)

No feasible design found yet. Least-violating designs:
- iterative [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=7.17, max_abs_err=0.000156 (2^-12.65); throughput_msps >= 50 violated by 85.7%
- iterative [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=round]: throughput=7.17, max_abs_err=0.000144 (2^-12.76); throughput_msps >= 50 violated by 85.7%
- iterative [data_width=18 n_iter=14 angle_guard=-1 frac_guard=2 rounding=round]: throughput=7.17, max_abs_err=0.00024 (2^-12.03); throughput_msps >= 50 violated by 85.7%
- iterative [data_width=18 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=7.17, max_abs_err=0.000163 (2^-12.58); throughput_msps >= 50 violated by 85.7%
- iterative [data_width=18 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc]: throughput=7.17, max_abs_err=0.000166 (2^-12.55); throughput_msps >= 50 violated by 85.7%

Per family:
- iterative: 38 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 14.04 bits
- unrolled_k: 38 evals, 0 feasible; max throughput seen 8.97 MSPS; best accuracy 13.79 bits
- pipelined: 6 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 10.27 bits
- pipelined_m: 18 evals, 0 feasible; max throughput seen 59.9 MSPS; best accuracy 11.45 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Drop iterative and unrolled_k because they cannot reach 50 MSPS. Focus on pipelined and pipelined_m at widths and iteration counts that reach 12+ bits.*)
- `pipelined_m` (58 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round, m=2..5. *Why:* It reached 59.9 MSPS, so it clears the throughput floor. It uses fewer registers than the fully pipelined design, which should help power. Ranges are aimed at the 12-bit accuracy threshold and a small m keeps Fmax high enough.
- `pipelined` (42 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round. *Why:* It has 171 MSPS of headroom, but only 6 evals so far and best accuracy 10.27 bits. Widths and iteration counts are raised to reach the 2^-12 error bound.

**Result (code):** 100 evaluations this round, 200 total; 20 feasible; hypervolume 80.98 (+inf).

**LLM decision:** `refine` — The front has only 3 designs, all pipelined_m with data_width=18 and m=2. They span power_index 2.19..2.7 and accuracy_bits 12.5..14.2. Iterative and unrolled_k have 0 feasible designs: their best throughput is 12.4 and 8.97 MSPS, against the 50 MSPS requirement. I will drop them. Only pipelined and pipelined_m are feasible. Pipelined has 12 feasible designs at data_width 16..17, with best power 3.65, so it is dominated. The lowest power came from the smallest feasible pipelined_m design, so narrower widths (13..17) and fewer iterations (11..16) are untested and may lower power while still meeting 2^-12. The best pipelined_m throughput seen is 91 MSPS, so m=3..4 may still reach 50 MSPS and use fewer pipeline registers. I will concentrate the budget on pipelined_m and keep a smaller probe of pipelined.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 80.98 (gain this round: +inf (first feasible designs)).
Feasible designs: 20 of 200 evaluations (16 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 56% violate; best seen 171
- max_abs_err <= 0.000244141: 70% violate; best seen 5.46e-05 (2^-14.16)

Pareto front (feasible, 3 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.19, accuracy_bits=12.5, area_um2=30650, ffs=462, throughput_msps=75.4, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=2.53, accuracy_bits=13.5, area_um2=35678, ffs=531, throughput_msps=72.3, max_abs_err=8.35e-05 (2^-13.55)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.7, accuracy_bits=14.2, area_um2=38786, ffs=560, throughput_msps=72.3, max_abs_err=5.46e-05 (2^-14.16)
Front coverage: power_index 2.19..2.7 (HV reference 40); accuracy_bits 12.5..14.2 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- iterative: 38 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 14.04 bits
- unrolled_k: 38 evals, 0 feasible; max throughput seen 8.97 MSPS; best accuracy 13.79 bits
- pipelined: 48 evals, 12 feasible; max throughput seen 171 MSPS; best accuracy 13.23 bits; best feasible power_index=3.65; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard 0..2, frac_guard 1..3
- pipelined_m: 76 evals, 8 feasible; max throughput seen 91.1 MSPS; best accuracy 14.16 bits; best feasible power_index=2.19; feasible ranges: data_width 18..18, n_iter 14..16, angle_guard 1..2, frac_guard 0..3, m 2..2
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the pipelined families, whose feasible region is narrow. Search smaller widths, fewer iterations and larger m to extend the front toward lower power.*)
- `pipelined_m` (30 evals): data_width=13..18, n_iter=11..16, angle_guard=0..2, frac_guard=0..2, rounding=round|trunc, m=2..4. *Why:* All 3 front points are pipelined_m with m=2 at width 18. Smaller widths, fewer iterations and m up to 4 are the most likely way to lower power while keeping error <= 2^-12 and throughput >= 50.
- `pipelined` (10 evals): data_width=13..17, n_iter=11..16, angle_guard=0..2, frac_guard=0..3, rounding=round. *Why:* It is feasible at widths 16..17, so a small probe at smaller widths and lower frac_guard checks whether it can reach the front.

**Result (code):** 40 evaluations this round, 240 total; 22 feasible; hypervolume 81.13 (+0.2%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is allowed, and the constraints are clearly feasible. The front has 5 feasible designs, all pipelined_m, with power_index 1.76..2.7 and accuracy_bits 12.3..14.2. The best design, selected by min power_index, is data_width=17, n_iter=14, angle_guard=1, frac_guard=1, round, m=3. It meets throughput at 54.3 MSPS (>=50) and error at 0.000192 (<=2^-12). Hypervolume gain last round was only +0.2%, well under the 0.01 epsilon threshold, so the front is no longer improving. The iterative and unrolled_k families were dead ends, with 0 feasible designs and at most 12.4 MSPS.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 81.13 (gain this round: +0.2%).
Feasible designs: 22 of 240 evaluations (18 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 53% violate; best seen 171
- max_abs_err <= 0.000244141: 71% violate; best seen 5.46e-05 (2^-14.16)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.76, accuracy_bits=12.3, area_um2=28327, ffs=333, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=1.79, accuracy_bits=12.4, area_um2=28769, ffs=338, throughput_msps=51.9, max_abs_err=0.000191 (2^-12.36)
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.19, accuracy_bits=12.5, area_um2=30650, ffs=462, throughput_msps=75.4, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=2.53, accuracy_bits=13.5, area_um2=35678, ffs=531, throughput_msps=72.3, max_abs_err=8.35e-05 (2^-13.55)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.7, accuracy_bits=14.2, area_um2=38786, ffs=560, throughput_msps=72.3, max_abs_err=5.46e-05 (2^-14.16)
Front coverage: power_index 1.76..2.7 (HV reference 40); accuracy_bits 12.3..14.2 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- iterative: 38 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 14.04 bits
- unrolled_k: 38 evals, 0 feasible; max throughput seen 8.97 MSPS; best accuracy 13.79 bits
- pipelined: 58 evals, 12 feasible; max throughput seen 171 MSPS; best accuracy 13.23 bits; best feasible power_index=3.65; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard 0..2, frac_guard 1..3
- pipelined_m: 106 evals, 10 feasible; max throughput seen 91.1 MSPS; best accuracy 14.16 bits; best feasible power_index=1.76; feasible ranges: data_width 17..18, n_iter 14..16, angle_guard 1..2, frac_guard 0..3, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (5 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 76 feasible; hypervolume 338.2 (+316.8%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is allowed, and the constraints are clearly feasible. The front has 5 feasible designs, all pipelined_m, with power_index 1.76..2.7 and accuracy_bits 12.3..14.2. The best design, selected by min power_index, is data_width=17, n_iter=14, angle_guard=1, frac_guard=1, round, m=3. It meets throughput at 54.3 MSPS (>=50) and error at 0.000192 (<=2^-12). Hypervolume gain last round was only +0.2%, well under the 0.01 epsilon threshold, so the front is no longer improving. The iterative and unrolled_k families were dead ends, with 0 feasible designs and at most 12.4 MSPS.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 338.2 (gain this round: +316.8%).
Feasible designs: 76 of 400 evaluations (68 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 57% violate; best seen 171
- max_abs_err <= 0.000244141: 49% violate; best seen 8.12e-08 (2^-23.55)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.76, accuracy_bits=12.3, area_um2=28327, ffs=333, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.19, accuracy_bits=12.5, area_um2=30650, ffs=462, throughput_msps=75.4, max_abs_err=0.000175 (2^-12.48)
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=2.46, accuracy_bits=12.8, area_um2=34840, ffs=516, throughput_msps=66.8, max_abs_err=0.000144 (2^-12.76)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=2.53, accuracy_bits=13.5, area_um2=35678, ffs=531, throughput_msps=72.3, max_abs_err=8.35e-05 (2^-13.55)
- pipelined_m [data_width=21 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc m=2] power_index=2.85, accuracy_bits=14.5, area_um2=40272, ffs=600, throughput_msps=66.8, max_abs_err=4.46e-05 (2^-14.45)
- pipelined_m [data_width=20 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=2.98, accuracy_bits=14.8, area_um2=42881, ffs=619, throughput_msps=64.3, max_abs_err=3.51e-05 (2^-14.80)
- pipelined_m [data_width=22 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=3.58, accuracy_bits=16.7, area_um2=51571, ffs=740, throughput_msps=62, max_abs_err=9.56e-06 (2^-16.67)
- pipelined_m [data_width=20 n_iter=22 angle_guard=4 frac_guard=4 rounding=round m=2] power_index=4.32, accuracy_bits=17.9, area_um2=62715, ffs=888, throughput_msps=62, max_abs_err=4.1e-06 (2^-17.89)
- pipelined_m [data_width=26 n_iter=22 angle_guard=-1 frac_guard=0 rounding=trunc m=2] power_index=4.61, accuracy_bits=19.5, area_um2=65969, ffs=960, throughput_msps=57.9, max_abs_err=1.32e-06 (2^-19.53)
- pipelined_m [data_width=25 n_iter=26 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=5.9, accuracy_bits=21.4, area_um2=85282, ffs=1217, throughput_msps=52.7, max_abs_err=3.7e-07 (2^-21.37)
Front coverage: power_index 1.76..5.9 (HV reference 40); accuracy_bits 12.3..21.4 (HV reference 12); data_width on the front 17..27 (registry 8..28).

Per family:
- iterative: 38 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 14.04 bits
- unrolled_k: 38 evals, 0 feasible; max throughput seen 8.97 MSPS; best accuracy 13.79 bits
- pipelined: 58 evals, 12 feasible; max throughput seen 171 MSPS; best accuracy 13.23 bits; best feasible power_index=3.65; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard 0..2, frac_guard 1..3
- pipelined_m: 266 evals, 64 feasible; max throughput seen 91.1 MSPS; best accuracy 23.55 bits; best feasible power_index=1.76; feasible ranges: data_width 16..27, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 18292 in, 3660 out
- provider-reported cost: $0.0732
- full prompts and replies: `llm_trace.jsonl`

