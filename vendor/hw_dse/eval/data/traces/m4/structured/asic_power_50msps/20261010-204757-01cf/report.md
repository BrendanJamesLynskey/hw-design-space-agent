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
`pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=trunc,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 28166 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7504 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 335 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 135 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.76 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000217 (2^-12.17) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.56 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.18e-05 (2^-13.98) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.01 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.2 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 88.6 dBc, SNR 81.2 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (20 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=trunc,m=3` | 28166 | 335 | 51.9 | 7 | 1.76 | 0.000217 (2^-12.17) | 12.17 |
| 1 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=3,rounding=trunc,m=3` | 28608 | 340 | 51.9 | 7 | 1.79 | 0.000209 (2^-12.23) | 12.23 |
| 2 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc,m=3` | 29502 | 340 | 51.9 | 7 | 1.81 | 0.000194 (2^-12.33) | 12.33 |
| 3 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 30305 | 344 | 51.9 | 7 | 1.85 | 0.000143 (2^-12.77) | 12.77 |
| 4 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round,m=3` | 31217 | 346 | 51.9 | 7 | 1.88 | 0.000108 (2^-13.18) | 13.18 |
| 5 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=3` | 34224 | 409 | 51.9 | 8 | 2.15 | 8.59e-05 (2^-13.51) | 13.51 |
| 6 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 37823 | 558 | 72.3 | 10 | 2.67 | 6.86e-05 (2^-13.83) | 13.83 |
| 7 | `pipelined_m:data_width=17,n_iter=16,angle_guard=4,frac_guard=3,rounding=round,m=2` | 39206 | 564 | 69.4 | 10 | 2.72 | 6.17e-05 (2^-13.98) | 13.98 |
| 8 | `pipelined_m:data_width=20,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 38555 | 574 | 69.4 | 10 | 2.73 | 6.04e-05 (2^-14.02) | 14.02 |
| 9 | `pipelined_m:data_width=21,n_iter=16,angle_guard=4,frac_guard=0,rounding=round,m=2` | 41946 | 623 | 59.9 | 10 | 2.97 | 3.63e-05 (2^-14.75) | 14.75 |
| 10 | `pipelined_m:data_width=20,n_iter=19,angle_guard=2,frac_guard=0,rounding=round,m=2` | 47338 | 718 | 66.8 | 12 | 3.39 | 2.17e-05 (2^-15.49) | 15.49 |
| 11 | `pipelined_m:data_width=20,n_iter=19,angle_guard=2,frac_guard=1,rounding=round,m=2` | 49716 | 737 | 66.8 | 12 | 3.51 | 1.51e-05 (2^-16.01) | 16.01 |
| 12 | `pipelined_m:data_width=26,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=2` | 55080 | 812 | 56.1 | 11 | 3.88 | 7.78e-06 (2^-16.97) | 16.97 |
| 13 | `pipelined_m:data_width=26,n_iter=18,angle_guard=3,frac_guard=2,rounding=trunc,m=2` | 58778 | 861 | 52.7 | 11 | 4.13 | 7.69e-06 (2^-16.99) | 16.99 |
| 14 | `pipelined_m:data_width=28,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=2` | 58953 | 869 | 52.7 | 11 | 4.15 | 7.66e-06 (2^-17.00) | 17.00 |
| 15 | `pipelined_m:data_width=23,n_iter=21,angle_guard=2,frac_guard=1,rounding=round,m=2` | 61888 | 910 | 59.9 | 13 | 4.35 | 2.63e-06 (2^-18.54) | 18.54 |
| 16 | `pipelined_m:data_width=28,n_iter=21,angle_guard=-2,frac_guard=0,rounding=round,m=2` | 67691 | 1018 | 54.3 | 13 | 4.82 | 1.4e-06 (2^-19.45) | 19.45 |
| 17 | `pipelined_m:data_width=28,n_iter=22,angle_guard=1,frac_guard=0,rounding=round,m=2` | 72270 | 1050 | 52.7 | 13 | 5.05 | 5.62e-07 (2^-20.76) | 20.76 |
| 18 | `pipelined_m:data_width=28,n_iter=27,angle_guard=1,frac_guard=0,rounding=round,m=2` | 89921 | 1321 | 52.7 | 16 | 6.32 | 1.32e-07 (2^-22.85) | 22.85 |
| 19 | `pipelined:data_width=28,n_iter=24,angle_guard=4,frac_guard=4,rounding=round` | 115153 | 2417 | 91.1 | 26 | 10.1 | 1.3e-07 (2^-22.87) | 22.87 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Constraints require error <= 2^-12 (about 12 accuracy bits) and 50 MSPS. Only the accuracy-bits objective can trade against power, so I search the minimum feasible widths and iteration counts and give the larger budget share to the iterative and unrolled families, which should have the lowest power. The fully pipelined family is left out for now because its many registers will probably cost more power. pipelined_m gets a small share as a check on that assumption. Later rounds can narrow ranges once the results are in.*)
- `iterative` (43 evals): data_width=12..18, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest shared datapath and fewest FFs, so likely low power, but it needs a clock of at least 50*(N+3) MHz, which may not be reachable at higher N. Ranges cover widths and iterations that can reach 2^-12 error with margin.
- `unrolled_k` (43 evals): data_width=12..18, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..4. *Why:* Unrolling by k cuts cycles per result, so 50 MSPS needs a lower clock than the iterative family. Power may drop despite more logic per cycle, so this is a plausible competitor to the iterative family.
- `pipelined_m` (14 evals): data_width=12..16, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* One result per cycle lets the clock be very low (50 MHz), with fewer registers than a full pipeline. Included as a probe of whether the lower clock offsets the area and power cost.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `add_family` — No feasible design yet. Throughput is the binding constraint: 96% of evaluations violate it. Iterative and unrolled_k peak at 11 and 9 MSPS, far below 50, because they need several cycles per result. Only pipelined_m reached 59.9 MSPS, and its best accuracy of 12.37 bits is already near the 2^-12 limit. Pipelined has not been explored and gives 1 result/cycle at full Fmax, so it is the natural candidate. Pipelined_m should be kept and focused on small m, since m=7 gave 23.1 MSPS and fewer stages between registers should raise Fmax. Iterative and unrolled_k are dropped because they cannot reach 50 MSPS. Accuracy needs at least 12 bits, so n_iter should be about 13-16 and data_width about 14-18, with moderate guard bits to hold power down.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 96% violate; best seen 59.9
- max_abs_err <= 0.000244141: 60% violate; best seen 3.81e-05 (2^-14.68)

No feasible design found yet. Least-violating designs:
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=round m=7]: throughput=23.1, max_abs_err=0.000189 (2^-12.37); throughput_msps >= 50 violated by 53.7%
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round]: throughput=7.27, max_abs_err=0.000176 (2^-12.48); throughput_msps >= 50 violated by 85.5%
- iterative [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round]: throughput=6.89, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 50 violated by 86.2%
- iterative [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round]: throughput=6.77, max_abs_err=9.56e-05 (2^-13.35); throughput_msps >= 50 violated by 86.5%
- iterative [data_width=18 n_iter=16 angle_guard=0 frac_guard=2 rounding=round]: throughput=6.41, max_abs_err=0.000102 (2^-13.25); throughput_msps >= 50 violated by 87.2%

Per family:
- iterative: 43 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.13 bits
- unrolled_k: 43 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 14.68 bits
- pipelined_m: 14 evals, 0 feasible; max throughput seen 59.9 MSPS; best accuracy 12.37 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Throughput is the blocker, so only the 1 result/cycle families are kept. Width and iteration ranges are centred on the region where max error falls just under 2^-12.*)
- `pipelined` (40 evals): data_width=14..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Unexplored family with 1 result/cycle and the shortest stage depth, so it is the most likely to clear 50 MSPS. The ranges target the 2^-12 accuracy threshold at low width.
- `pipelined_m` (60 evals): data_width=14..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Only family that has reached over 50 MSPS (59.9). Small m shortens the critical path and registers fewer stages than full pipelining, which may lower power.

**Result (code):** 100 evaluations this round, 200 total; 36 feasible; hypervolume 75.63 (+inf).

**LLM decision:** `refine` — The iterative and unrolled_k families are infeasible: 0 feasible designs in 86 evals, and their best throughput is 11 MSPS against the 50 MSPS requirement. The front is dominated by pipelined_m. At m=3 it reaches 51.9 MSPS, just above the throughput limit, with power_index 1.76..1.85. At m=2 it reaches 69 MSPS at higher power. Plain pipelined covers only the high-accuracy, high-power end (power_index 4.26..4.46). The best pipelined_m designs sit at data_width 16..18 and n_iter 14..15, and the lowest-power designs use trunc rounding. I will concentrate the budget on pipelined_m around those values, allowing m up to 4 to probe the throughput edge and data_width 15 to look for lower power. I will keep a small share for pipelined to fill the high-accuracy end and drop the two infeasible families.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 75.63 (gain this round: +inf (first feasible designs)).
Feasible designs: 36 of 200 evaluations (28 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 59% violate; best seen 163
- max_abs_err <= 0.000244141: 58% violate; best seen 3.81e-05 (2^-14.68)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc m=3] power_index=1.76, accuracy_bits=12.2, area_um2=28166, ffs=335, throughput_msps=51.9, max_abs_err=0.000217 (2^-12.17)
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=3 rounding=trunc m=3] power_index=1.79, accuracy_bits=12.2, area_um2=28608, ffs=340, throughput_msps=51.9, max_abs_err=0.000209 (2^-12.23)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc m=3] power_index=1.81, accuracy_bits=12.3, area_um2=29502, ffs=340, throughput_msps=51.9, max_abs_err=0.000194 (2^-12.33)
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=3] power_index=1.85, accuracy_bits=12.8, area_um2=30305, ffs=344, throughput_msps=51.9, max_abs_err=0.000143 (2^-12.77)
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=2.41, accuracy_bits=12.8, area_um2=34436, ffs=501, throughput_msps=69.4, max_abs_err=0.000143 (2^-12.77)
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=3 rounding=round m=2] power_index=2.47, accuracy_bits=12.9, area_um2=35362, ffs=513, throughput_msps=69.4, max_abs_err=0.000134 (2^-12.86)
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=2.62, accuracy_bits=13.4, area_um2=36136, ffs=558, throughput_msps=72.3, max_abs_err=9.49e-05 (2^-13.36)
- pipelined [data_width=17 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] power_index=4.26, accuracy_bits=13.4, area_um2=47828, ffs=1026, throughput_msps=132, max_abs_err=9.12e-05 (2^-13.42)
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] power_index=4.46, accuracy_bits=14, area_um2=50025, ffs=1074, throughput_msps=128, max_abs_err=5.94e-05 (2^-14.04)
Front coverage: power_index 1.76..4.46 (HV reference 40); accuracy_bits 12.2..14 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 43 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.13 bits
- unrolled_k: 43 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 14.68 bits
- pipelined: 40 evals, 19 feasible; max throughput seen 163 MSPS; best accuracy 14.04 bits; best feasible power_index=3.55; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 2..3, frac_guard 0..3
- pipelined_m: 74 evals, 17 feasible; max throughput seen 86.6 MSPS; best accuracy 13.54 bits; best feasible power_index=1.76; feasible ranges: data_width 16..18, n_iter 14..15, angle_guard 0..3, frac_guard 0..3, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate evaluations on pipelined_m, which dominates the low-power end, and keep a small pipelined share to fill out the accuracy axis.*)
- `pipelined_m` (32 evals): data_width=15..18, n_iter=13..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Holds all the low-power front points (1.76..2.62); m=3 is near the 50 MSPS limit, so m=4 and data_width 15 test whether power can drop further.
- `pipelined` (8 evals): data_width=16..19, n_iter=14..17, angle_guard=1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Supplies the high-accuracy end of the front (13.4..14 bits); its feasible designs sit at data_width 16..18, n_iter 14..16.

**Result (code):** 40 evaluations this round, 240 total; 61 feasible; hypervolume 108.4 (+43.3%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is allowed. The constraints are clearly feasible: 61 of 240 evaluations are feasible, and the front has 11 designs. It spans power_index 1.76 to 4.95 and accuracy_bits 12.2 to 14.9. The selection rule (min power_index) picks pipelined_m with data_width=16, n_iter=14, angle_guard=2, frac_guard=3, trunc, m=3. That design has power_index 1.76, throughput 51.9 MSPS (just above the 50 floor) and max_abs_err 2.17e-4 (below 2.44e-4). The iterative and unrolled_k families never exceeded 11 MSPS, so they cannot meet the throughput constraint. Hypervolume gained 43.3% last round, but the remaining budget is reserved for code-driven front mapping.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 108.4 (gain this round: +43.3%).
Feasible designs: 61 of 240 evaluations (46 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 52% violate; best seen 163
- max_abs_err <= 0.000244141: 52% violate; best seen 3.2e-05 (2^-14.93)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc m=3] power_index=1.76, accuracy_bits=12.2, area_um2=28166, ffs=335, throughput_msps=51.9, max_abs_err=0.000217 (2^-12.17)
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=3 rounding=trunc m=3] power_index=1.79, accuracy_bits=12.2, area_um2=28608, ffs=340, throughput_msps=51.9, max_abs_err=0.000209 (2^-12.23)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc m=3] power_index=1.81, accuracy_bits=12.3, area_um2=29502, ffs=340, throughput_msps=51.9, max_abs_err=0.000194 (2^-12.33)
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=3] power_index=1.85, accuracy_bits=12.8, area_um2=30305, ffs=344, throughput_msps=51.9, max_abs_err=0.000143 (2^-12.77)
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=1.88, accuracy_bits=13.2, area_um2=31217, ffs=346, throughput_msps=51.9, max_abs_err=0.000108 (2^-13.18)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=2.67, accuracy_bits=13.8, area_um2=37823, ffs=558, throughput_msps=72.3, max_abs_err=6.86e-05 (2^-13.83)
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] power_index=4.46, accuracy_bits=14, area_um2=50025, ffs=1074, throughput_msps=128, max_abs_err=5.94e-05 (2^-14.04)
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] power_index=4.5, accuracy_bits=14.3, area_um2=50411, ffs=1086, throughput_msps=132, max_abs_err=5.02e-05 (2^-14.28)
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=3 rounding=round] power_index=4.92, accuracy_bits=14.7, area_um2=55843, ffs=1177, throughput_msps=123, max_abs_err=3.78e-05 (2^-14.69)
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] power_index=4.95, accuracy_bits=14.9, area_um2=55608, ffs=1192, throughput_msps=123, max_abs_err=3.2e-05 (2^-14.93)
Front coverage: power_index 1.76..4.95 (HV reference 40); accuracy_bits 12.2..14.9 (HV reference 12); data_width on the front 16..19 (registry 8..28).

Per family:
- iterative: 43 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.13 bits
- unrolled_k: 43 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 14.68 bits
- pipelined: 48 evals, 26 feasible; max throughput seen 163 MSPS; best accuracy 14.93 bits; best feasible power_index=3.53; feasible ranges: data_width 16..19, n_iter 14..17, angle_guard 1..3, frac_guard 0..3
- pipelined_m: 106 evals, 35 feasible; max throughput seen 86.6 MSPS; best accuracy 13.83 bits; best feasible power_index=1.76; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..3, frac_guard 0..3, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (102 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (7 front designs; box front_anchored)
- `pipelined` (58 evals): data_width=17..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (4 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 150 feasible; hypervolume 389.1 (+259.1%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is allowed. The constraints are clearly feasible: 61 of 240 evaluations are feasible, and the front has 11 designs. It spans power_index 1.76 to 4.95 and accuracy_bits 12.2 to 14.9. The selection rule (min power_index) picks pipelined_m with data_width=16, n_iter=14, angle_guard=2, frac_guard=3, trunc, m=3. That design has power_index 1.76, throughput 51.9 MSPS (just above the 50 floor) and max_abs_err 2.17e-4 (below 2.44e-4). The iterative and unrolled_k families never exceeded 11 MSPS, so they cannot meet the throughput constraint. Hypervolume gained 43.3% last round, but the remaining budget is reserved for code-driven front mapping.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 389.1 (gain this round: +259.1%).
Feasible designs: 150 of 400 evaluations (126 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 48% violate; best seen 163
- max_abs_err <= 0.000244141: 36% violate; best seen 3.42e-08 (2^-24.80)

Pareto front (feasible, 20 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc m=3] power_index=1.76, accuracy_bits=12.2, area_um2=28166, ffs=335, throughput_msps=51.9, max_abs_err=0.000217 (2^-12.17)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc m=3] power_index=1.81, accuracy_bits=12.3, area_um2=29502, ffs=340, throughput_msps=51.9, max_abs_err=0.000194 (2^-12.33)
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=1.88, accuracy_bits=13.2, area_um2=31217, ffs=346, throughput_msps=51.9, max_abs_err=0.000108 (2^-13.18)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=2.67, accuracy_bits=13.8, area_um2=37823, ffs=558, throughput_msps=72.3, max_abs_err=6.86e-05 (2^-13.83)
- pipelined_m [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc m=2] power_index=2.73, accuracy_bits=14, area_um2=38555, ffs=574, throughput_msps=69.4, max_abs_err=6.04e-05 (2^-14.02)
- pipelined_m [data_width=20 n_iter=19 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=3.51, accuracy_bits=16, area_um2=49716, ffs=737, throughput_msps=66.8, max_abs_err=1.51e-05 (2^-16.01)
- pipelined_m [data_width=26 n_iter=18 angle_guard=3 frac_guard=2 rounding=trunc m=2] power_index=4.13, accuracy_bits=17, area_um2=58778, ffs=861, throughput_msps=52.7, max_abs_err=7.69e-06 (2^-16.99)
- pipelined_m [data_width=23 n_iter=21 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=4.35, accuracy_bits=18.5, area_um2=61888, ffs=910, throughput_msps=59.9, max_abs_err=2.63e-06 (2^-18.54)
- pipelined_m [data_width=28 n_iter=22 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=5.05, accuracy_bits=20.8, area_um2=72270, ffs=1050, throughput_msps=52.7, max_abs_err=5.62e-07 (2^-20.76)
- pipelined [data_width=28 n_iter=24 angle_guard=4 frac_guard=4 rounding=round] power_index=10.1, accuracy_bits=22.9, area_um2=115153, ffs=2417, throughput_msps=91.1, max_abs_err=1.3e-07 (2^-22.87)
Front coverage: power_index 1.76..10.1 (HV reference 40); accuracy_bits 12.2..22.9 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 43 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.13 bits
- unrolled_k: 43 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 14.68 bits
- pipelined: 106 evals, 84 feasible; max throughput seen 163 MSPS; best accuracy 22.87 bits; best feasible power_index=3.53; feasible ranges: data_width 16..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 208 evals, 66 feasible; max throughput seen 86.6 MSPS; best accuracy 24.80 bits; best feasible power_index=1.76; feasible ranges: data_width 16..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19467 in, 3182 out
- provider-reported cost: $0.0708
- full prompts and replies: `llm_trace.jsonl`

