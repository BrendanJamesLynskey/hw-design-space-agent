# DSE run: asic_multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_multiaxis_control: Shared sin/cos unit in sky130 standard cells for a 16-axis motor-control loop: a 1 MHz control tick issues 32 requests at once; all 32 results must be back within 0.5 us of the tick (p99 over ticks). Max error <= 2^-12. Minimise area.
  target: asic-sky130hd
  constraint: throughput_msps >= 32
  constraint: max_abs_err <= 0.000244141
  constraint: sys_p99_batch_us <= 0.5
  objective: min area_um2 (HV ref 100000)
  objective: max accuracy_bits (HV ref 12)
  select: min area_um2
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average)
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined:data_width=16,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 39472 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10516 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 838 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 121 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.23 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000203 (2^-12.26) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.33 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.39e-05 (2^-13.93) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.05 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.3 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 93.3 dBc, SNR 81.2 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (92) was simulated at its estimated Fmax (SimPy); 89 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=16,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=16,n_iter=14,angle_guard=4,frac_guard=2,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=18,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 0.3282 → 0.3352 | yes |
| `pipelined:data_width=16,n_iter=15,angle_guard=1,frac_guard=2,rounding=round` | 0.3282 → 0.3352 | yes |
| `pipelined:data_width=16,n_iter=14,angle_guard=4,frac_guard=3,rounding=round` | 0.3475 → 0.355 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=16,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` | 39472 | 838 | 132.4 | 16 | 2.23 | 0.000203 (2^-12.26) | 12.26 |
| 1 | `pipelined:data_width=16,n_iter=14,angle_guard=4,frac_guard=2,rounding=round` | 40660 | 861 | 132.4 | 16 | 2.3 | 0.000185 (2^-12.40) | 12.40 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 41562 | 900 | 143.2 | 17 | 2.38 | 0.000145 (2^-12.75) | 12.75 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 42933 | 929 | 132.4 | 17 | 2.46 | 0.000109 (2^-13.17) | 13.17 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=round` | 45777 | 967 | 132.4 | 17 | 2.58 | 9.56e-05 (2^-13.35) | 13.35 |
| 5 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 45892 | 991 | 132.4 | 18 | 2.63 | 8.35e-05 (2^-13.55) | 13.55 |
| 6 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 46462 | 982 | 132.4 | 17 | 2.62 | 8.26e-05 (2^-13.56) | 13.56 |
| 7 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round` | 47147 | 997 | 127.5 | 17 | 2.66 | 8.22e-05 (2^-13.57) | 13.57 |
| 8 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 48095 | 1017 | 132.4 | 18 | 2.71 | 6.9e-05 (2^-13.82) | 13.82 |
| 9 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 48233 | 1020 | 132.4 | 18 | 2.72 | 6.45e-05 (2^-13.92) | 13.92 |
| 10 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=trunc` | 50287 | 1085 | 123.1 | 18 | 2.88 | 5.76e-05 (2^-14.08) | 14.08 |
| 11 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 50343 | 1064 | 127.5 | 18 | 2.84 | 5.17e-05 (2^-14.24) | 14.24 |
| 12 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 51998 | 1099 | 127.5 | 18 | 2.94 | 4.05e-05 (2^-14.59) | 14.59 |
| 13 | `pipelined:data_width=18,n_iter=17,angle_guard=3,frac_guard=2,rounding=round` | 53540 | 1131 | 127.5 | 19 | 3.02 | 3.68e-05 (2^-14.73) | 14.73 |
| 14 | `pipelined:data_width=18,n_iter=18,angle_guard=3,frac_guard=2,rounding=round` | 56736 | 1197 | 127.5 | 20 | 3.2 | 3.49e-05 (2^-14.81) | 14.81 |
| 15 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=4,rounding=trunc` | 58640 | 1254 | 115.0 | 19 | 3.34 | 2.56e-05 (2^-15.25) | 15.25 |
| 16 | `pipelined:data_width=22,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 60910 | 1310 | 118.9 | 20 | 3.48 | 1.21e-05 (2^-16.34) | 16.34 |
| 17 | `pipelined:data_width=21,n_iter=18,angle_guard=3,frac_guard=2,rounding=round` | 64334 | 1357 | 115.0 | 20 | 3.63 | 9.93e-06 (2^-16.62) | 16.62 |
| 18 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 64391 | 1382 | 118.9 | 21 | 3.67 | 8.35e-06 (2^-16.87) | 16.87 |
| 19 | `pipelined:data_width=21,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc` | 68502 | 1464 | 115.0 | 21 | 3.9 | 7.43e-06 (2^-17.04) | 17.04 |
| 20 | `pipelined:data_width=21,n_iter=19,angle_guard=4,frac_guard=2,rounding=round` | 68832 | 1451 | 111.3 | 21 | 3.88 | 6.19e-06 (2^-17.30) | 17.30 |
| 21 | `pipelined:data_width=21,n_iter=19,angle_guard=4,frac_guard=3,rounding=round` | 70494 | 1485 | 111.3 | 21 | 3.97 | 5.7e-06 (2^-17.42) | 17.42 |
| 22 | `pipelined:data_width=25,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc` | 71388 | 1532 | 111.3 | 21 | 4.07 | 4.71e-06 (2^-17.70) | 17.70 |
| 23 | `pipelined:data_width=22,n_iter=19,angle_guard=4,frac_guard=4,rounding=round` | 74831 | 1574 | 107.9 | 21 | 4.21 | 4.49e-06 (2^-17.76) | 17.76 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are the burst deadline (32 results within 0.5 us of a 1 MHz tick) and max_abs_err <= 2^-12. Iterative is excluded analytically: 32*(N+3) cycles with N>=13 needs >1 GHz, and unrolled_k is only marginally better, so the front must come from the 1-result/cycle families. Accuracy needs roughly W>=14 (output LSB 2^-(W-2)) and N>=13 (residual angle ~2^-N), so I centre the boxes on W 13..18, N 12..18 with small guard ranges, and let the exact model find the true accuracy boundary. Area is the objective, so pipelined_m (fewer register stages) gets the largest share, with pipelined as the high-Fmax anchor and a small unrolled_k probe in case a shared datapath can still make the deadline. Later rounds should widen W/N upward for accuracy_bits > 12 (hypervolume) and map the full m/k ranges of whichever families survive.*)
- `pipelined_m` (50 evals): data_width=13..18, n_iter=12..18, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Only 1 result/cycle families can feed a 32-request burst inside 0.5 us; pipelined_m additionally cuts the number of register stages (ceil(N/m)+2) so it is the most likely area winner. The m sweep exposes the area-vs-Fmax trade-off: large m saves FFs but lengthens the combinational chain and the latency, which the batch bound punishes.
- `pipelined` (35 evals): data_width=13..18, n_iter=12..18, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round. *Why:* The full-register pipeline is the safest way to satisfy the burst deadline (latency N+2, one result/cycle, shortest combinational path so highest Fmax). It anchors the fast/high-margin end of the front and gives the accuracy/area boundary a reference point against pipelined_m.
- `unrolled_k` (15 evals): data_width=13..18, n_iter=12..18, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round, k=6..8. *Why:* A shared datapath would be far cheaper in area than any registered pipeline, so it is worth a cheap probe: with k=8 and N~13 it needs 32*(ceil(N/k)+3) ~ 160 cycles in 0.5 us, i.e. ~320 MHz, which is probably out of reach, but if it passes it dominates on area. Small share because the cycle count makes it a long shot.

**Result (code):** 100 evaluations this round, 100 total; 7 feasible; hypervolume 1.085e+05 (n/a).

**LLM decision:** `refine` — Only `pipelined` produced feasible designs (7/35 evals); `unrolled_k` (0/15) and `pipelined_m` (0/50) produced none, and `iterative` is strictly slower than `unrolled_k` (whose best throughput was only 4.78 MSPS vs the 32 MSPS floor), so the feasible front lives in the pipelined family. The front's cheapest design (46768 um2) already has 13.03 bits, ~1 bit above the 2^-12 = 0.000244 requirement, so accuracy has margin to trade for area. Yet the front's accuracy range (13..14.2) never reaches the 12-bit floor and its area range (46768..54203) is far from the HV reference (100000): the low-area end of the curve is unmapped, and that is exactly the end the selection rule (min area_um2) picks. Lower data_width/n_iter should cut area while keeping max_abs_err <= 2^-12; lower n_iter also shortens latency and raises throughput, so the sys_p99_batch bound (best seen 0.257 vs 0.5) will not bind. Keep pipelined_m in the mix because it also yields 1 result/cycle and its best accuracy (13.92 bits) and throughput (86.6 MSPS) are individually adequate, so a single config may yet satisfy all three constraints.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.085e+05 (gain this round: n/a (first round)).
Feasible designs: 7 of 100 evaluations (7 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 32% violate; best seen 171
- max_abs_err <= 0.000244141: 78% violate; best seen 5.36e-05 (2^-14.19)
- sys_p99_batch_us <= 0.5: 53% violate; best seen 0.257

Pareto front (feasible, 4 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=round] area_um2=46768, accuracy_bits=13, ffs=989, throughput_msps=138, max_abs_err=0.00012 (2^-13.03), power_index=2.64
- pipelined [data_width=16 n_iter=18 angle_guard=3 frac_guard=2 rounding=round] area_um2=51670, accuracy_bits=13.1, ffs=1091, throughput_msps=138, max_abs_err=0.000112 (2^-13.12), power_index=2.92
- pipelined [data_width=17 n_iter=18 angle_guard=3 frac_guard=1 rounding=round] area_um2=52636, accuracy_bits=13.4, ffs=1113, throughput_msps=132, max_abs_err=9.28e-05 (2^-13.40), power_index=2.97
- pipelined [data_width=17 n_iter=18 angle_guard=3 frac_guard=2 rounding=round] area_um2=54203, accuracy_bits=14.2, ffs=1144, throughput_msps=132, max_abs_err=5.36e-05 (2^-14.19), power_index=3.06
Front coverage: area_um2 46768..54203 (HV reference 100000); accuracy_bits 13..14.2 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 4.78 MSPS; best accuracy 12.76 bits
- pipelined: 35 evals, 7 feasible; max throughput seen 171 MSPS; best accuracy 14.19 bits; best feasible area_um2=46768; feasible ranges: data_width 16..18, n_iter 16..18, angle_guard 0..3, frac_guard 1..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 86.6 MSPS; best accuracy 13.92 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus the round on the low-area end of the pipelined front, where accuracy margin (13.03 vs 12 bits) can be spent on area, while giving pipelined_m a smaller share to test whether any single config clears all three constraints.*)
- `pipelined` (75 evals): data_width=14..18, n_iter=12..18, angle_guard=0..3, frac_guard=0..2, rounding=round. *Why:* sole feasible family; extend downward in data_width/n_iter to reach the 2^-12 accuracy floor and the min-area corner
- `pipelined_m` (25 evals): data_width=14..18, n_iter=12..18, angle_guard=0..3, frac_guard=0..2, rounding=round, m=2..4. *Why:* 1 result/cycle like pipelined; best accuracy 13.92 and throughput 86.6 are individually adequate, so a single config may pass all three constraints and add front points

**Result (code):** 100 evaluations this round, 200 total; 53 feasible; hypervolume 1.497e+05 (+37.9%).

**LLM decision:** `map_front` — The feasible front is entirely one family (pipelined, 12 designs) and covers only a small part of both objective ranges: area_um2 41562..56736 against the HV reference 100000 (so the high-area/high-accuracy end is empty), and accuracy_bits 12.8..14.8 while the registry allows data_width up to 28 / n_iter up to 30 (far higher accuracy). Because the HV reference point is (area=100000, accuracy=12), the hypervolume is dominated by high-accuracy points — e.g. a feasible point near (70000, 20) would add ~2.4e5 of box area versus the current total 1.497e5 — so extending the front upward in accuracy at moderate area is the single biggest HV lever, and the current front does not reach it. The low-area end is also not proven: data_width 16 was feasible for pipelined yet no data_width-16 design is on the front, and pipelined_m (fewer registers, same 1 result/cycle) had 0 feasible in 75 evals but was never mapped in the region that works for pipelined. unrolled_k (max 4.78 MSPS) and iterative (1 result per N+3 cycles) are structurally unable to reach the 32 MSPS throughput constraint, so they are not worth budget. Therefore let code spend this round running NSGA-II over the full registry ranges of the families on the front (pipelined, plus pipelined_m as a near-front family that could lower area), seeded with the current front, to fill in the missing high-accuracy and low-area ends before the final refinement round.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.497e+05 (gain this round: +37.9%).
Feasible designs: 53 of 200 evaluations (35 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 16% violate; best seen 171
- max_abs_err <= 0.000244141: 57% violate; best seen 3.49e-05 (2^-14.81)
- sys_p99_batch_us <= 0.5: 38% violate; best seen 0.257

Pareto front (feasible, 12 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=41562, accuracy_bits=12.8, ffs=900, throughput_msps=143, max_abs_err=0.000145 (2^-12.75), power_index=2.38
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=42933, accuracy_bits=13.2, ffs=929, throughput_msps=132, max_abs_err=0.000109 (2^-13.17), power_index=2.46
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=45777, accuracy_bits=13.4, ffs=967, throughput_msps=132, max_abs_err=9.56e-05 (2^-13.35), power_index=2.58
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] area_um2=46462, accuracy_bits=13.6, ffs=982, throughput_msps=132, max_abs_err=8.26e-05 (2^-13.56), power_index=2.62
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] area_um2=47147, accuracy_bits=13.6, ffs=997, throughput_msps=128, max_abs_err=8.22e-05 (2^-13.57), power_index=2.66
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=48095, accuracy_bits=13.8, ffs=1017, throughput_msps=132, max_abs_err=6.9e-05 (2^-13.82), power_index=2.71
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] area_um2=48233, accuracy_bits=13.9, ffs=1020, throughput_msps=132, max_abs_err=6.45e-05 (2^-13.92), power_index=2.72
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] area_um2=52067, accuracy_bits=14.3, ffs=1101, throughput_msps=128, max_abs_err=4.98e-05 (2^-14.29), power_index=2.94
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] area_um2=53540, accuracy_bits=14.7, ffs=1131, throughput_msps=128, max_abs_err=3.68e-05 (2^-14.73), power_index=3.02
- pipelined [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round] area_um2=56736, accuracy_bits=14.8, ffs=1197, throughput_msps=128, max_abs_err=3.49e-05 (2^-14.81), power_index=3.2
Front coverage: area_um2 41562..56736 (HV reference 100000); accuracy_bits 12.8..14.8 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 4.78 MSPS; best accuracy 12.76 bits
- pipelined: 110 evals, 53 feasible; max throughput seen 171 MSPS; best accuracy 14.81 bits; best feasible area_um2=41562; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 75 evals, 0 feasible; max throughput seen 86.6 MSPS; best accuracy 13.92 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined` (20 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (12 front designs; box front_anchored)
- `pipelined_m` (20 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 40 evaluations this round, 240 total; 68 feasible; hypervolume 2.177e+05 (+45.4%).

**LLM decision:** `map_front` — Only the `pipelined` family is feasible: 68/240 feasible evals are all pipelined, while `unrolled_k` (0 feasible, max 4.78 MSPS) and `pipelined_m` (0 feasible, max 86.6 MSPS) never clear the sys_p99_batch/throughput screen. The unexplored `iterative` family cannot help either — at N+3 cycles/result even its best case (~130 MHz / 7 cycles ≈ 18 MSPS) is below the 32 MSPS constraint, so adding it would waste budget. The feasible front is therefore entirely pipelined and spans area 41562..73319 (HV ref 100000) and accuracy 12.8..17 bits (HV ref 12), with data_width 17..27. The selection rule (min area) picks the 41562 um^2 / 12.8-bit design, but the front's low-area end sits at 12.8 bits while the constraint only needs 12, so there is unexplored room below 41562 and the accuracy range is only partially mapped. With 160 evals left and one round, the right move is to spend the reserved budget mapping the full front over pipelined's full ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, rounding both), seeded with the current 16-design front, to fill gaps and extend both the cheap-area corner and the high-accuracy tail.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 2.177e+05 (gain this round: +45.4%).
Feasible designs: 68 of 240 evaluations (49 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 18% violate; best seen 171
- max_abs_err <= 0.000244141: 53% violate; best seen 7.02e-08 (2^-23.76)
- sys_p99_batch_us <= 0.5: 42% violate; best seen 0.257

Pareto front (feasible, 16 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=41562, accuracy_bits=12.8, ffs=900, throughput_msps=143, max_abs_err=0.000145 (2^-12.75), power_index=2.38
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=45777, accuracy_bits=13.4, ffs=967, throughput_msps=132, max_abs_err=9.56e-05 (2^-13.35), power_index=2.58
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=45892, accuracy_bits=13.5, ffs=991, throughput_msps=132, max_abs_err=8.35e-05 (2^-13.55), power_index=2.63
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] area_um2=47147, accuracy_bits=13.6, ffs=997, throughput_msps=128, max_abs_err=8.22e-05 (2^-13.57), power_index=2.66
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] area_um2=48233, accuracy_bits=13.9, ffs=1020, throughput_msps=132, max_abs_err=6.45e-05 (2^-13.92), power_index=2.72
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=50343, accuracy_bits=14.2, ffs=1064, throughput_msps=128, max_abs_err=5.17e-05 (2^-14.24), power_index=2.84
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] area_um2=53540, accuracy_bits=14.7, ffs=1131, throughput_msps=128, max_abs_err=3.68e-05 (2^-14.73), power_index=3.02
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=4 rounding=trunc] area_um2=58640, accuracy_bits=15.3, ffs=1254, throughput_msps=115, max_abs_err=2.56e-05 (2^-15.25), power_index=3.34
- pipelined [data_width=18 n_iter=22 angle_guard=3 frac_guard=3 rounding=round] area_um2=71467, accuracy_bits=15.4, ffs=1504, throughput_msps=128, max_abs_err=2.32e-05 (2^-15.40), power_index=4.02
- pipelined [data_width=27 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=73319, accuracy_bits=17, ffs=1575, throughput_msps=102, max_abs_err=7.74e-06 (2^-16.98), power_index=4.18
Front coverage: area_um2 41562..73319 (HV reference 100000); accuracy_bits 12.8..17 (HV reference 12); data_width on the front 17..27 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 4.78 MSPS; best accuracy 12.76 bits
- pipelined: 130 evals, 68 feasible; max throughput seen 171 MSPS; best accuracy 23.76 bits; best feasible area_um2=41562; feasible ranges: data_width 16..28, n_iter 13..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 95 evals, 0 feasible; max throughput seen 86.6 MSPS; best accuracy 19.99 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (50 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (16 front designs; box front_anchored)
- `pipelined_m` (50 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 100 evaluations this round, 340 total; 102 feasible; hypervolume 2.553e+05 (+17.3%).

**LLM decision:** `stop` — Round cap reached (round 4 of 4, 340/400 evals) and the front is both feasible and still improving (+17.3% hypervolume this round, HV 2.553e5), so there is no basis for declaring infeasibility: every constraint is met with margin by existing designs — throughput best 171 MSPS vs the 32 MSPS requirement, max_abs_err best 2^-23.76 vs the 2^-12 limit, sys_p99_batch_us best 0.257 vs the 0.5 us limit. 102 of 340 evaluations are feasible (77 unique) and 18 sit on the Pareto front, spanning area 41562..74831 um^2 and accuracy 12.8..17.8 bits with data_width 17..25, i.e. the trade-off curve is covered well inside the HV reference box (area ref 100000, accuracy ref 12). The spec's selection rule (min area_um2) picks the front's cheapest design, pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round]: area 41562 um^2, 900 FFs, 143 MSPS, max_abs_err 2^-12.75 (0.75 bit of margin over the 2^-12 requirement) and 4.5x the required throughput, which leaves headroom for the L2 system re-selection among the shortlist. unrolled_k and pipelined_m produced 0 feasible designs in 160 evaluations (max throughput 4.78 and 91.1 MSPS respectively, the latter failing the batch bound), and the unexplored iterative family cannot reach 32 MSPS at 1 result per N+3 cycles, so no further family can improve the front within the remaining budget.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 2.553e+05 (gain this round: +17.3%).
Feasible designs: 102 of 340 evaluations (77 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 19% violate; best seen 171
- max_abs_err <= 0.000244141: 46% violate; best seen 7.02e-08 (2^-23.76)
- sys_p99_batch_us <= 0.5: 46% violate; best seen 0.257

Pareto front (feasible, 18 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=41562, accuracy_bits=12.8, ffs=900, throughput_msps=143, max_abs_err=0.000145 (2^-12.75), power_index=2.38
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=45777, accuracy_bits=13.4, ffs=967, throughput_msps=132, max_abs_err=9.56e-05 (2^-13.35), power_index=2.58
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] area_um2=46462, accuracy_bits=13.6, ffs=982, throughput_msps=132, max_abs_err=8.26e-05 (2^-13.56), power_index=2.62
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=48095, accuracy_bits=13.8, ffs=1017, throughput_msps=132, max_abs_err=6.9e-05 (2^-13.82), power_index=2.71
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=50287, accuracy_bits=14.1, ffs=1085, throughput_msps=123, max_abs_err=5.76e-05 (2^-14.08), power_index=2.88
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=50343, accuracy_bits=14.2, ffs=1064, throughput_msps=128, max_abs_err=5.17e-05 (2^-14.24), power_index=2.84
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] area_um2=53540, accuracy_bits=14.7, ffs=1131, throughput_msps=128, max_abs_err=3.68e-05 (2^-14.73), power_index=3.02
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=4 rounding=trunc] area_um2=58640, accuracy_bits=15.3, ffs=1254, throughput_msps=115, max_abs_err=2.56e-05 (2^-15.25), power_index=3.34
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] area_um2=64391, accuracy_bits=16.9, ffs=1382, throughput_msps=119, max_abs_err=8.35e-06 (2^-16.87), power_index=3.67
- pipelined [data_width=22 n_iter=19 angle_guard=4 frac_guard=4 rounding=round] area_um2=74831, accuracy_bits=17.8, ffs=1574, throughput_msps=108, max_abs_err=4.49e-06 (2^-17.76), power_index=4.21
Front coverage: area_um2 41562..74831 (HV reference 100000); accuracy_bits 12.8..17.8 (HV reference 12); data_width on the front 17..25 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 4.78 MSPS; best accuracy 12.76 bits
- pipelined: 180 evals, 102 feasible; max throughput seen 171 MSPS; best accuracy 23.76 bits; best feasible area_um2=41562; feasible ranges: data_width 16..28, n_iter 13..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 145 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 22.23 bits
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined` (30 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (18 front designs; box front_anchored)
- `pipelined_m` (30 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 60 evaluations this round, 400 total; 122 feasible; hypervolume 2.572e+05 (+0.8%).

**No LLM call** (code's front-mapping round): Round cap reached (round 4 of 4, 340/400 evals) and the front is both feasible and still improving (+17.3% hypervolume this round, HV 2.553e5), so there is no basis for declaring infeasibility: every constraint is met with margin by existing designs — throughput best 171 MSPS vs the 32 MSPS requirement, max_abs_err best 2^-23.76 vs the 2^-12 limit, sys_p99_batch_us best 0.257 vs the 0.5 us limit. 102 of 340 evaluations are feasible (77 unique) and 18 sit on the Pareto front, spanning area 41562..74831 um^2 and accuracy 12.8..17.8 bits with data_width 17..25, i.e. the trade-off curve is covered well inside the HV reference box (area ref 100000, accuracy ref 12). The spec's selection rule (min area_um2) picks the front's cheapest design, pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round]: area 41562 um^2, 900 FFs, 143 MSPS, max_abs_err 2^-12.75 (0.75 bit of margin over the 2^-12 requirement) and 4.5x the required throughput, which leaves headroom for the L2 system re-selection among the shortlist. unrolled_k and pipelined_m produced 0 feasible designs in 160 evaluations (max throughput 4.78 and 91.1 MSPS respectively, the latter failing the batch bound), and the unexplored iterative family cannot reach 32 MSPS at 1 result per N+3 cycles, so no further family can improve the front within the remaining budget.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.572e+05 (gain this round: +0.8%).
Feasible designs: 122 of 400 evaluations (92 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 19% violate; best seen 171
- max_abs_err <= 0.000244141: 41% violate; best seen 7.02e-08 (2^-23.76)
- sys_p99_batch_us <= 0.5: 47% violate; best seen 0.257

Pareto front (feasible, 24 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=4 frac_guard=1 rounding=round] area_um2=39472, accuracy_bits=12.3, ffs=838, throughput_msps=132, max_abs_err=0.000203 (2^-12.26), power_index=2.23
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=42933, accuracy_bits=13.2, ffs=929, throughput_msps=132, max_abs_err=0.000109 (2^-13.17), power_index=2.46
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=45892, accuracy_bits=13.5, ffs=991, throughput_msps=132, max_abs_err=8.35e-05 (2^-13.55), power_index=2.63
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=48095, accuracy_bits=13.8, ffs=1017, throughput_msps=132, max_abs_err=6.9e-05 (2^-13.82), power_index=2.71
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=50287, accuracy_bits=14.1, ffs=1085, throughput_msps=123, max_abs_err=5.76e-05 (2^-14.08), power_index=2.88
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] area_um2=53540, accuracy_bits=14.7, ffs=1131, throughput_msps=128, max_abs_err=3.68e-05 (2^-14.73), power_index=3.02
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=4 rounding=trunc] area_um2=58640, accuracy_bits=15.3, ffs=1254, throughput_msps=115, max_abs_err=2.56e-05 (2^-15.25), power_index=3.34
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] area_um2=64391, accuracy_bits=16.9, ffs=1382, throughput_msps=119, max_abs_err=8.35e-06 (2^-16.87), power_index=3.67
- pipelined [data_width=21 n_iter=19 angle_guard=4 frac_guard=2 rounding=round] area_um2=68832, accuracy_bits=17.3, ffs=1451, throughput_msps=111, max_abs_err=6.19e-06 (2^-17.30), power_index=3.88
- pipelined [data_width=22 n_iter=19 angle_guard=4 frac_guard=4 rounding=round] area_um2=74831, accuracy_bits=17.8, ffs=1574, throughput_msps=108, max_abs_err=4.49e-06 (2^-17.76), power_index=4.21
Front coverage: area_um2 39472..74831 (HV reference 100000); accuracy_bits 12.3..17.8 (HV reference 12); data_width on the front 16..25 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 4.78 MSPS; best accuracy 12.76 bits
- pipelined: 210 evals, 122 feasible; max throughput seen 171 MSPS; best accuracy 23.76 bits; best feasible area_um2=39472; feasible ranges: data_width 16..28, n_iter 13..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 175 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 23.30 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16382 in, 26661 out
- provider-reported cost: $0.0232
- full prompts and replies: `llm_trace.jsonl`

