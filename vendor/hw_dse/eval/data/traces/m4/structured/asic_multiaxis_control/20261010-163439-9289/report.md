# DSE run: asic_multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
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
`pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 40192 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10708 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 870 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 119 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.31 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000168 (2^-12.54) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 5.49 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 4.52e-05 (2^-14.43) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.48 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 17 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 99.8 dBc, SNR 84.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (110) was simulated at its estimated Fmax (SimPy); 107 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 0.3282 → 0.3352 | yes |
| `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 0.3282 → 0.3352 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=18,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 0.3282 → 0.3352 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 0.3475 → 0.355 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 40192 | 870 | 143.2 | 17 | 2.31 | 0.000168 (2^-12.54) | 12.54 |
| 1 | `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round` | 41487 | 879 | 137.6 | 16 | 2.35 | 0.00016 (2^-12.61) | 12.61 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 41562 | 900 | 143.2 | 17 | 2.38 | 0.000145 (2^-12.75) | 12.75 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 42248 | 914 | 137.6 | 17 | 2.42 | 0.000119 (2^-13.04) | 13.04 |
| 4 | `pipelined:data_width=19,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 43618 | 944 | 137.6 | 17 | 2.5 | 0.000108 (2^-13.18) | 13.18 |
| 5 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 44303 | 959 | 132.4 | 17 | 2.54 | 8.66e-05 (2^-13.50) | 13.50 |
| 6 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 45892 | 991 | 132.4 | 18 | 2.63 | 8.35e-05 (2^-13.55) | 13.55 |
| 7 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 46358 | 1003 | 127.5 | 17 | 2.66 | 7.63e-05 (2^-13.68) | 13.68 |
| 8 | `pipelined:data_width=20,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 47043 | 1018 | 123.1 | 17 | 2.7 | 7.03e-05 (2^-13.80) | 13.80 |
| 9 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 47357 | 1022 | 132.4 | 18 | 2.71 | 5.84e-05 (2^-14.06) | 14.06 |
| 10 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 48089 | 1038 | 127.5 | 18 | 2.75 | 5.75e-05 (2^-14.09) | 14.09 |
| 11 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 49749 | 1052 | 132.4 | 18 | 2.81 | 5.25e-05 (2^-14.22) | 14.22 |
| 12 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 50482 | 1068 | 127.5 | 18 | 2.85 | 4.95e-05 (2^-14.30) | 14.30 |
| 13 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 51191 | 1103 | 127.5 | 19 | 2.93 | 4.23e-05 (2^-14.53) | 14.53 |
| 14 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 52751 | 1137 | 127.5 | 19 | 3.02 | 3.32e-05 (2^-14.88) | 14.88 |
| 15 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 53531 | 1153 | 123.1 | 19 | 3.06 | 2.85e-05 (2^-15.10) | 15.10 |
| 16 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 55289 | 1168 | 127.5 | 19 | 3.12 | 2.58e-05 (2^-15.24) | 15.24 |
| 17 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 56069 | 1185 | 123.1 | 19 | 3.16 | 2.38e-05 (2^-15.36) | 15.36 |
| 18 | `pipelined:data_width=22,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 56650 | 1220 | 123.1 | 19 | 3.24 | 2.12e-05 (2^-15.52) | 15.52 |
| 19 | `pipelined:data_width=22,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 57430 | 1237 | 118.9 | 19 | 3.28 | 1.95e-05 (2^-15.64) | 15.64 |
| 20 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 58429 | 1256 | 123.1 | 20 | 3.34 | 1.68e-05 (2^-15.87) | 15.87 |
| 21 | `pipelined:data_width=22,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 60850 | 1285 | 115.0 | 19 | 3.43 | 1.67e-05 (2^-15.87) | 15.87 |
| 22 | `pipelined:data_width=21,n_iter=20,angle_guard=1,frac_guard=1,rounding=round` | 67979 | 1433 | 123.1 | 22 | 3.83 | 9.8e-06 (2^-16.64) | 16.64 |
| 23 | `pipelined:data_width=24,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 69539 | 1467 | 107.9 | 20 | 3.92 | 8.13e-06 (2^-16.91) | 16.91 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraint is the system scenario: 32 requests arrive simultaneously every 1us and all must return within 0.5us. This rules out iterative (1 result per N+3 cycles, far too slow). The three remaining families all produce >=1 result/cycle. pipelined is the safest bet for meeting the latency bound but uses the most flip-flops. pipelined_m reduces area by sharing registers across m stages at the cost of higher latency. unrolled_k with high k can clear the burst in very few cycles, potentially allowing a smaller, faster datapath. I allocate 40% to pipelined (most likely to satisfy all constraints), 35% to pipelined_m (area trade-off), and 25% to unrolled_k (aggressive area reduction). data_width is bounded 14-24 because max_abs_err <= 2^-12 requires at least ~14 bits of accuracy, and going above 24 adds area without meaningful accuracy gain for this spec. n_iter 12-20 covers the accuracy requirement with margin. angle_guard and frac_guard are kept small (0-2) since the accuracy target is modest and extra guard bits add area.*)
- `pipelined` (40 evals): data_width=14..24, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* The system requires 32 results within 0.5us of a 1us tick. Only pipelined families accept 1 request/cycle, so they are the only ones that can avoid queueing the 32-burst. With N+2 latency and 1 result/cycle, a pipelined unit running at >=32 MHz can clear the 32-deep burst in 1us, leaving 0.5us slack for the p99 batch constraint. This is the primary candidate for the area-minimising selection rule.
- `pipelined_m` (35 evals): data_width=14..24, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m registers every m stages, trading latency (ceil(N/m)+2) for fewer flip-flops and potentially smaller area than full pipelined. Since the selection rule is min area, this family may find cheaper designs that still meet the 32 req/us throughput and 0.5us p99 batch bound, especially at moderate N where the latency penalty of m>1 is small.
- `unrolled_k` (25 evals): data_width=14..24, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k with k=8 produces 8 results/cycle, so it needs only 4 cycles to clear a 32-burst. If Fmax is high enough, the 0.5us p99 batch constraint can be met with a much smaller datapath (fewer stages, less area) than pipelined. However, the k-way parallel datapath increases combinational depth, which may cap Fmax. Worth exploring to see if the area savings outweigh the Fmax penalty.

**Result (code):** 100 evaluations this round, 100 total; 30 feasible; hypervolume 2.241e+05 (n/a).

**LLM decision:** `refine` — Round 1 established that pipelined is the only family producing feasible designs (30/40 feasible, best area 43618 um2, throughput up to 163 MSPS). The Pareto front spans area 43618..69539 um2 and accuracy 13.2..16.9 bits. The selection rule is min area, so the low-area corner (data_width 17-20, n_iter 15-18) is most important for the final design, but the hypervolume objective rewards covering the full trade-off curve. pipelined_m and unrolled_k had 0 feasible designs in round 1, but pipelined_m's infeasibility may be due to m values that reduce throughput below 32 MSPS. Refining all three families with narrowed ranges around the promising region (data_width 17-20, n_iter 15-18) will: (1) focus pipelined on the low-area corner while maintaining accuracy coverage, (2) test whether pipelined_m with m=2 can be feasible, and (3) confirm unrolled_k's structural infeasibility with k=8. This uses the remaining 300 evals efficiently across 3 rounds to map the front more densely in the region that matters for both the selection rule and hypervolume.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2.241e+05 (gain this round: n/a (first round)).
Feasible designs: 30 of 100 evaluations (24 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 28% violate; best seen 163
- max_abs_err <= 0.000244141: 37% violate; best seen 4.15e-06 (2^-17.88)
- sys_p99_batch_us <= 0.5: 50% violate; best seen 0.27

Pareto front (feasible, 12 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=43618, accuracy_bits=13.2, ffs=944, throughput_msps=138, max_abs_err=0.000108 (2^-13.18), power_index=2.5
- pipelined [data_width=18 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=48071, accuracy_bits=13.4, ffs=1036, throughput_msps=138, max_abs_err=9.26e-05 (2^-13.40), power_index=2.75
- pipelined [data_width=20 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=51971, accuracy_bits=14.5, ffs=1120, throughput_msps=132, max_abs_err=4.25e-05 (2^-14.52), power_index=2.97
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=53531, accuracy_bits=15.1, ffs=1153, throughput_msps=123, max_abs_err=2.85e-05 (2^-15.10), power_index=3.06
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=55289, accuracy_bits=15.2, ffs=1168, throughput_msps=128, max_abs_err=2.58e-05 (2^-15.24), power_index=3.12
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=56069, accuracy_bits=15.4, ffs=1185, throughput_msps=123, max_abs_err=2.38e-05 (2^-15.36), power_index=3.16
- pipelined [data_width=22 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=56650, accuracy_bits=15.5, ffs=1220, throughput_msps=123, max_abs_err=2.12e-05 (2^-15.52), power_index=3.24
- pipelined [data_width=22 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] area_um2=62323, accuracy_bits=15.9, ffs=1314, throughput_msps=115, max_abs_err=1.67e-05 (2^-15.87), power_index=3.51
- pipelined [data_width=21 n_iter=20 angle_guard=1 frac_guard=1 rounding=round] area_um2=67979, accuracy_bits=16.6, ffs=1433, throughput_msps=123, max_abs_err=9.8e-06 (2^-16.64), power_index=3.83
- pipelined [data_width=24 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=69539, accuracy_bits=16.9, ffs=1467, throughput_msps=108, max_abs_err=8.13e-06 (2^-16.91), power_index=3.92
Front coverage: area_um2 43618..69539 (HV reference 100000); accuracy_bits 13.2..16.9 (HV reference 12); data_width on the front 18..24 (registry 8..28).

Per family:
- unrolled_k: 25 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 16.34 bits
- pipelined: 40 evals, 30 feasible; max throughput seen 163 MSPS; best accuracy 16.91 bits; best feasible area_um2=43618; feasible ranges: data_width 16..24, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 35 evals, 0 feasible; max throughput seen 86.6 MSPS; best accuracy 17.88 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Round 1 established that pipelined is the dominant feasible family (30/40 feasible, best area 43618 um2, throughput up to 163 MSPS). The Pareto front spans area 43618..69539 um2 and accuracy 13.2..16.9 bits. The selection rule is min area, so the low-area corner (data_width 17-20, n_iter 15-18) is most important for the final design, but the hypervolume objective rewards covering the full trade-off curve. pipelined_m and unrolled_k had 0 feasible designs in round 1, but pipelined_m's infeasibility may be due to m values that reduce throughput below 32 MSPS. Refining all three families with narrowed ranges around the promising region (data_width 17-20, n_iter 15-18) will: (1) focus pipelined on the low-area corner while maintaining accuracy coverage, (2) test whether pipelined_m with m=2 can be feasible, and (3) confirm unrolled_k's structural infeasibility with k=8. This uses the remaining 300 evals efficiently across 3 rounds to map the front more densely in the region that matters for both the selection rule and hypervolume.*)
- `pipelined` (50 evals): data_width=17..20, n_iter=15..18, angle_guard=0..2, frac_guard=0..1, rounding=trunc|round. *Why:* pipelined is the only family producing feasible designs (30/40 feasible, best area 43618 um2). The current front spans data_width 18..24 and n_iter 15..20. Narrowing to data_width 17..20 and n_iter 15..18 focuses on the low-area corner of the front where the selection rule (min area) will pick, while keeping enough range to capture the accuracy trade-off. angle_guard 0..2 and frac_guard 0..1 cover the feasible region seen in round 1.
- `pipelined_m` (30 evals): data_width=17..20, n_iter=15..18, angle_guard=0..2, frac_guard=0..1, rounding=trunc|round, m=2..2. *Why:* pipelined_m had 0 feasible designs in round 1, but its max throughput was 86.6 MSPS (vs 163 for pipelined) and best accuracy 17.88 bits. The infeasibility is likely due to throughput or sys_p99_batch_us constraints at higher m values. Restricting m=2 (closest to pipelined) with the same data_width/n_iter ranges as the pipelined refinement gives pipelined_m a fair chance to produce feasible designs that might have lower area due to fewer pipeline registers. If m=2 pipelined_m is still infeasible, it confirms the family cannot meet the 32 MSPS throughput constraint.
- `unrolled_k` (20 evals): data_width=17..20, n_iter=15..18, angle_guard=0..2, frac_guard=0..1, rounding=trunc|round, k=8..8. *Why:* unrolled_k had 0 feasible designs with max throughput only 5.84 MSPS, far below the 32 MSPS constraint. Even with k=8 (max unrolling), the throughput is likely still insufficient because unrolled_k produces one result every ceil(N/k)+3 cycles. For N=15, k=8: ceil(15/8)+3 = 2+3 = 5 cycles/result. At ~130 MHz, that's ~26 MSPS, still below 32. This family appears structurally unable to meet the throughput constraint. Including it with k=8 and the same data_width/n_iter ranges is a final check to confirm infeasibility before excluding it from future rounds.

**Result (code):** 100 evaluations this round, 200 total; 77 feasible; hypervolume 2.318e+05 (+3.4%).

**LLM decision:** `refine` — The `pipelined` family is the only one producing feasible designs, with a clear Pareto front starting at 40,192 um^2. `unrolled_k` and `pipelined_m` have failed to produce any feasible designs (0 feasible out of 45 and 65 evals respectively), likely due to throughput or latency bottlenecks in their specific architectures for this bursty 32-request/1us system. The current front covers area 40k-70k um^2 and accuracy 12.5-16.9 bits. To maximize hypervolume and find the true minimum area, I should focus the remaining budget on refining the `pipelined` family around the known feasible region (data_width 16-20, n_iter 15-17) to tighten the lower bound of the area objective and potentially uncover better accuracy/area trade-offs near the constraint boundary.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.318e+05 (gain this round: +3.4%).
Feasible designs: 77 of 200 evaluations (52 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 24% violate; best seen 163
- max_abs_err <= 0.000244141: 24% violate; best seen 4.15e-06 (2^-17.88)
- sys_p99_batch_us <= 0.5: 48% violate; best seen 0.27

Pareto front (feasible, 19 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=40192, accuracy_bits=12.5, ffs=870, throughput_msps=143, max_abs_err=0.000168 (2^-12.54), power_index=2.31
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=42248, accuracy_bits=13, ffs=914, throughput_msps=138, max_abs_err=0.000119 (2^-13.04), power_index=2.42
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=44303, accuracy_bits=13.5, ffs=959, throughput_msps=132, max_abs_err=8.66e-05 (2^-13.50), power_index=2.54
- pipelined [data_width=20 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=47043, accuracy_bits=13.8, ffs=1018, throughput_msps=123, max_abs_err=7.03e-05 (2^-13.80), power_index=2.7
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] area_um2=49749, accuracy_bits=14.2, ffs=1052, throughput_msps=132, max_abs_err=5.25e-05 (2^-14.22), power_index=2.81
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=52751, accuracy_bits=14.9, ffs=1137, throughput_msps=128, max_abs_err=3.32e-05 (2^-14.88), power_index=3.02
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=55289, accuracy_bits=15.2, ffs=1168, throughput_msps=128, max_abs_err=2.58e-05 (2^-15.24), power_index=3.12
- pipelined [data_width=22 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=56650, accuracy_bits=15.5, ffs=1220, throughput_msps=123, max_abs_err=2.12e-05 (2^-15.52), power_index=3.24
- pipelined [data_width=22 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] area_um2=62323, accuracy_bits=15.9, ffs=1314, throughput_msps=115, max_abs_err=1.67e-05 (2^-15.87), power_index=3.51
- pipelined [data_width=24 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=69539, accuracy_bits=16.9, ffs=1467, throughput_msps=108, max_abs_err=8.13e-06 (2^-16.91), power_index=3.92
Front coverage: area_um2 40192..69539 (HV reference 100000); accuracy_bits 12.5..16.9 (HV reference 12); data_width on the front 17..24 (registry 8..28).

Per family:
- unrolled_k: 45 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 16.34 bits
- pipelined: 90 evals, 77 feasible; max throughput seen 163 MSPS; best accuracy 16.91 bits; best feasible area_um2=40192; feasible ranges: data_width 16..24, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 65 evals, 0 feasible; max throughput seen 86.6 MSPS; best accuracy 17.88 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate remaining budget on refining the pipelined family's feasible region to minimize area and maximize hypervolume.*)
- `pipelined` (40 evals): data_width=16..20, n_iter=14..18, angle_guard=0..2, frac_guard=0..1, rounding=round. *Why:* Focus on the only feasible family to refine the Pareto front, specifically targeting the lower area bound and ensuring robustness of the accuracy constraint near the 12-bit limit.

**Result (code):** 40 evaluations this round, 240 total; 113 feasible; hypervolume 2.319e+05 (+0.1%).

**LLM decision:** `stop` — The Pareto front is well-established with 113 feasible designs, dominated by the `pipelined` family which uniquely satisfies the strict throughput (>= 32 MSPS) and system latency (p99 batch <= 0.5 us) constraints. The `unrolled_k` and `pipelined_m` families failed to produce any feasible designs due to throughput bottlenecks (max 5.84 and 86.6 MSPS respectively, but likely failing the system-level batch latency or throughput constraints in combination). The current front covers the area range 40192..69539 um^2 and accuracy 12.5..16.9 bits, which is sufficient for the selection rule (min area). The best feasible design is `pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round]` with area 40192 um^2 and accuracy 12.5 bits (max_abs_err 2^-12.54), which meets the max_abs_err <= 2^-12 constraint. Since this is the final round and the front is stable (HV gain +0.1%), stopping is the correct action.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 2.319e+05 (gain this round: +0.1%).
Feasible designs: 113 of 240 evaluations (70 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 163
- max_abs_err <= 0.000244141: 21% violate; best seen 4.15e-06 (2^-17.88)
- sys_p99_batch_us <= 0.5: 40% violate; best seen 0.27

Pareto front (feasible, 23 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=40192, accuracy_bits=12.5, ffs=870, throughput_msps=143, max_abs_err=0.000168 (2^-12.54), power_index=2.31
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] area_um2=41562, accuracy_bits=12.8, ffs=900, throughput_msps=143, max_abs_err=0.000145 (2^-12.75), power_index=2.38
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=44303, accuracy_bits=13.5, ffs=959, throughput_msps=132, max_abs_err=8.66e-05 (2^-13.50), power_index=2.54
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=46358, accuracy_bits=13.7, ffs=1003, throughput_msps=128, max_abs_err=7.63e-05 (2^-13.68), power_index=2.66
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=48089, accuracy_bits=14.1, ffs=1038, throughput_msps=128, max_abs_err=5.75e-05 (2^-14.09), power_index=2.75
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] area_um2=50482, accuracy_bits=14.3, ffs=1068, throughput_msps=128, max_abs_err=4.95e-05 (2^-14.30), power_index=2.85
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=53531, accuracy_bits=15.1, ffs=1153, throughput_msps=123, max_abs_err=2.85e-05 (2^-15.10), power_index=3.06
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=56069, accuracy_bits=15.4, ffs=1185, throughput_msps=123, max_abs_err=2.38e-05 (2^-15.36), power_index=3.16
- pipelined [data_width=22 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] area_um2=62323, accuracy_bits=15.9, ffs=1314, throughput_msps=115, max_abs_err=1.67e-05 (2^-15.87), power_index=3.51
- pipelined [data_width=24 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=69539, accuracy_bits=16.9, ffs=1467, throughput_msps=108, max_abs_err=8.13e-06 (2^-16.91), power_index=3.92
Front coverage: area_um2 40192..69539 (HV reference 100000); accuracy_bits 12.5..16.9 (HV reference 12); data_width on the front 17..24 (registry 8..28).

Per family:
- unrolled_k: 45 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 16.34 bits
- pipelined: 130 evals, 113 feasible; max throughput seen 163 MSPS; best accuracy 16.91 bits; best feasible area_um2=40192; feasible ranges: data_width 16..24, n_iter 14..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 65 evals, 0 feasible; max throughput seen 86.6 MSPS; best accuracy 17.88 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (23 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 170 feasible; hypervolume 2.328e+05 (+0.4%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established with 113 feasible designs, dominated by the `pipelined` family which uniquely satisfies the strict throughput (>= 32 MSPS) and system latency (p99 batch <= 0.5 us) constraints. The `unrolled_k` and `pipelined_m` families failed to produce any feasible designs due to throughput bottlenecks (max 5.84 and 86.6 MSPS respectively, but likely failing the system-level batch latency or throughput constraints in combination). The current front covers the area range 40192..69539 um^2 and accuracy 12.5..16.9 bits, which is sufficient for the selection rule (min area). The best feasible design is `pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round]` with area 40192 um^2 and accuracy 12.5 bits (max_abs_err 2^-12.54), which meets the max_abs_err <= 2^-12 constraint. Since this is the final round and the front is stable (HV gain +0.1%), stopping is the correct action.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.328e+05 (gain this round: +0.4%).
Feasible designs: 170 of 400 evaluations (110 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 26% violate; best seen 163
- max_abs_err <= 0.000244141: 22% violate; best seen 6.51e-08 (2^-23.87)
- sys_p99_batch_us <= 0.5: 47% violate; best seen 0.27

Pareto front (feasible, 24 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=40192, accuracy_bits=12.5, ffs=870, throughput_msps=143, max_abs_err=0.000168 (2^-12.54), power_index=2.31
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=42248, accuracy_bits=13, ffs=914, throughput_msps=138, max_abs_err=0.000119 (2^-13.04), power_index=2.42
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=44303, accuracy_bits=13.5, ffs=959, throughput_msps=132, max_abs_err=8.66e-05 (2^-13.50), power_index=2.54
- pipelined [data_width=20 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=47043, accuracy_bits=13.8, ffs=1018, throughput_msps=123, max_abs_err=7.03e-05 (2^-13.80), power_index=2.7
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=48089, accuracy_bits=14.1, ffs=1038, throughput_msps=128, max_abs_err=5.75e-05 (2^-14.09), power_index=2.75
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=51191, accuracy_bits=14.5, ffs=1103, throughput_msps=128, max_abs_err=4.23e-05 (2^-14.53), power_index=2.93
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=53531, accuracy_bits=15.1, ffs=1153, throughput_msps=123, max_abs_err=2.85e-05 (2^-15.10), power_index=3.06
- pipelined [data_width=22 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=56650, accuracy_bits=15.5, ffs=1220, throughput_msps=123, max_abs_err=2.12e-05 (2^-15.52), power_index=3.24
- pipelined [data_width=21 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] area_um2=58429, accuracy_bits=15.9, ffs=1256, throughput_msps=123, max_abs_err=1.68e-05 (2^-15.87), power_index=3.34
- pipelined [data_width=24 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=69539, accuracy_bits=16.9, ffs=1467, throughput_msps=108, max_abs_err=8.13e-06 (2^-16.91), power_index=3.92
Front coverage: area_um2 40192..69539 (HV reference 100000); accuracy_bits 12.5..16.9 (HV reference 12); data_width on the front 17..24 (registry 8..28).

Per family:
- unrolled_k: 45 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 16.34 bits
- pipelined: 210 evals, 170 feasible; max throughput seen 163 MSPS; best accuracy 20.84 bits; best feasible area_um2=40192; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 145 evals, 0 feasible; max throughput seen 102 MSPS; best accuracy 23.87 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 12595 in, 4575 out
- provider-reported cost: $0.0079
- full prompts and replies: `llm_trace.jsonl`

