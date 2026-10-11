# DSE run: asic_power_50msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=15,n_iter=15,angle_guard=2,frac_guard=3,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 29117 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7757 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 321 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 129 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.75 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000242 (2^-12.01) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 1.98 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 5.58e-05 (2^-14.13) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 0.458 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 12 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 97.1 dBc, SNR 82.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (25 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=15,angle_guard=2,frac_guard=3,rounding=round,m=3` | 29117 | 321 | 54.3 | 7 | 1.75 | 0.000242 (2^-12.01) | 12.01 |
| 1 | `pipelined_m:data_width=15,n_iter=15,angle_guard=3,frac_guard=3,rounding=round,m=3` | 29584 | 325 | 54.3 | 7 | 1.78 | 0.000188 (2^-12.38) | 12.38 |
| 2 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=2,rounding=round,m=2` | 31916 | 465 | 75.4 | 9 | 2.23 | 0.000171 (2^-12.51) | 12.51 |
| 3 | `pipelined_m:data_width=17,n_iter=14,angle_guard=3,frac_guard=3,rounding=round,m=2` | 33812 | 491 | 72.3 | 9 | 2.36 | 0.000148 (2^-12.73) | 12.73 |
| 4 | `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc,m=2` | 34001 | 508 | 69.4 | 9 | 2.41 | 0.000141 (2^-12.80) | 12.80 |
| 5 | `pipelined_m:data_width=18,n_iter=20,angle_guard=0,frac_guard=0,rounding=round,m=3` | 39364 | 455 | 54.3 | 9 | 2.43 | 0.000114 (2^-13.10) | 13.10 |
| 6 | `pipelined_m:data_width=19,n_iter=20,angle_guard=0,frac_guard=0,rounding=round,m=3` | 41323 | 478 | 51.9 | 9 | 2.55 | 6.48e-05 (2^-13.91) | 13.91 |
| 7 | `pipelined_m:data_width=17,n_iter=17,angle_guard=3,frac_guard=2,rounding=round,m=2` | 40630 | 607 | 72.3 | 11 | 2.88 | 5.72e-05 (2^-14.09) | 14.09 |
| 8 | `pipelined_m:data_width=19,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=2` | 41527 | 612 | 72.3 | 11 | 2.93 | 4.26e-05 (2^-14.52) | 14.52 |
| 9 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=4,rounding=round,m=2` | 42699 | 613 | 64.3 | 10 | 2.96 | 4.03e-05 (2^-14.60) | 14.60 |
| 10 | `pipelined_m:data_width=17,n_iter=17,angle_guard=4,frac_guard=4,rounding=round,m=2` | 43569 | 647 | 69.4 | 11 | 3.08 | 3.68e-05 (2^-14.73) | 14.73 |
| 11 | `pipelined_m:data_width=19,n_iter=17,angle_guard=4,frac_guard=3,rounding=round,m=2` | 46223 | 688 | 64.3 | 11 | 3.27 | 2.19e-05 (2^-15.48) | 15.48 |
| 12 | `pipelined_m:data_width=22,n_iter=18,angle_guard=-1,frac_guard=3,rounding=round,m=2` | 50896 | 729 | 59.9 | 11 | 3.53 | 1.78e-05 (2^-15.78) | 15.78 |
| 13 | `pipelined_m:data_width=19,n_iter=19,angle_guard=2,frac_guard=4,rounding=round,m=2` | 51525 | 759 | 64.3 | 12 | 3.63 | 1.65e-05 (2^-15.88) | 15.88 |
| 14 | `pipelined_m:data_width=22,n_iter=18,angle_guard=4,frac_guard=3,rounding=round,m=2` | 54050 | 774 | 57.9 | 11 | 3.74 | 8.49e-06 (2^-16.85) | 16.85 |
| 15 | `pipelined_m:data_width=28,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=2` | 58953 | 869 | 52.7 | 11 | 4.15 | 7.66e-06 (2^-17.00) | 17.00 |
| 16 | `pipelined_m:data_width=21,n_iter=22,angle_guard=4,frac_guard=2,rounding=round,m=2` | 62120 | 883 | 59.9 | 13 | 4.28 | 3.61e-06 (2^-18.08) | 18.08 |
| 17 | `pipelined_m:data_width=24,n_iter=22,angle_guard=4,frac_guard=0,rounding=trunc,m=2` | 65105 | 945 | 54.3 | 13 | 4.54 | 2.96e-06 (2^-18.37) | 18.37 |
| 18 | `pipelined_m:data_width=26,n_iter=21,angle_guard=0,frac_guard=2,rounding=trunc,m=2` | 67517 | 1010 | 54.3 | 13 | 4.8 | 1.44e-06 (2^-19.40) | 19.40 |
| 19 | `pipelined_m:data_width=26,n_iter=21,angle_guard=0,frac_guard=3,rounding=trunc,m=2` | 68975 | 1029 | 52.7 | 13 | 4.89 | 1.41e-06 (2^-19.44) | 19.44 |
| 20 | `pipelined_m:data_width=28,n_iter=21,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 69945 | 1050 | 52.7 | 13 | 4.98 | 1.09e-06 (2^-19.81) | 19.81 |
| 21 | `pipelined_m:data_width=28,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 83262 | 1231 | 52.7 | 15 | 5.87 | 2.55e-07 (2^-21.91) | 21.91 |
| 22 | `pipelined_m:data_width=28,n_iter=28,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 92246 | 1321 | 52.7 | 16 | 6.39 | 2.4e-07 (2^-21.99) | 21.99 |
| 23 | `pipelined_m:data_width=26,n_iter=30,angle_guard=2,frac_guard=3,rounding=trunc,m=2` | 99755 | 1417 | 52.7 | 17 | 6.88 | 1.89e-07 (2^-22.33) | 22.33 |
| 24 | `pipelined_m:data_width=27,n_iter=30,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 100911 | 1435 | 52.7 | 17 | 6.96 | 1.42e-07 (2^-22.74) | 22.74 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Only pipelined/pipelined_m and (with a high enough clock) unrolled_k can plausibly hit 50 MSPS at >=12-bit accuracy; iterative almost certainly cannot and gets only a token share to prove it. Accuracy needs only ~2^-12, so the useful data_width/n_iter region is modest, but because the HV objective rewards accuracy above the 12-bit reference the widths/iterations are allowed up to ~20 to map the upper part of the front. Round 1 is intentionally broad over all four families and wide parameter ranges (especially the k and m axes and the guards, which are the main power/accuracy levers), weighting the three feasible families equally so the NSGA-II sees the whole trade-off curve before later rounds zoom in on the surviving families.*)
- `pipelined_m` (30 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Pipelined/pipelined_m issue 1 result/cycle, so 50 MSPS only needs ~50 MHz clock — the easiest way to satisfy the throughput constraint while staying at accuracy. pipelined_m lets the FSM trade FFs for combinational depth via m, which is the most likely lever on power_index; searching m over its full 2..8 range here is essential because the lowest-power point will almost certainly sit on this axis.
- `unrolled_k` (30 evals): data_width=12..20, n_iter=10..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* Uses a shared datapath (no per-stage pipeline registers), so it can be much smaller than a full pipeline, but it must run fast enough that Fmax/(ceil(N/k)+3) >= 50. The k vs N/k trade-off decides both the required clock and the depth, so I want the whole k=2..8 sweep plus a wide N range to find the low-power/high-accuracy corner.
- `pipelined` (30 evals): data_width=12..20, n_iter=10..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* The clean full-pipeline reference: guaranteed 1 result/cycle (so throughput is trivially met), maximal Fmax and lowest latency, at the cost of N stages of registers. It anchors the power/accuracy front and gives the m=1 baseline that pipelined_m must beat; keeping a full share here guarantees coverage of the low-latency / high-accuracy end.
- `iterative` (10 evals): data_width=12..20, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* The reference topology and per-cycle-parsimonious datapath; its throughput is Fmax/(N+3), so reaching 50 MSPS needs ~50*(N+3) MHz which is implausible at the typical corner for the N>=12 accuracy needs — I expect it to be infeasible. A small share is worth spending to empirically confirm it (or catch a lucky high-Fmax point) before excluding it, since if feasible it would likely be the power winner.

**Result (code):** 100 evaluations this round, 100 total; 24 feasible; hypervolume 129.1 (n/a).

**LLM decision:** `map_front` — The front is real but covers only a sliver of one objective's range, and the HV maths says that sliver is where the remaining gains are. Evidence: (1) Only two families can ever be feasible — iterative topped out at 11 MSPS and unrolled_k at 7.14 MSPS against the hard 50 MSPS constraint, so 0/10 and 0/30 feasible respectively; the front is entirely pipelined + pipelined_m. (2) The front has 4 unique points spanning power_index 2.85..5.42 against an HV reference of 40, and accuracy_bits 13.4..15.5 against a reference of 12, while round 1 already saw 16.22 bits anywhere and the registry permits data_width=28 / n_iter=30. (3) Decomposing HV at ref (40,12): the band p=5.42..40 at a=15.55 alone contributes ~(40-5.42)*(15.55-12)=122.8 of the 129.1 total, so ~95% of the score is the 'high-accuracy tail' — every extra accuracy bit is worth ~34 HV, while squeezing power below 2.85 (e.g. to 2.0 at 13.4 bits) is worth <2 HV. (4) Refining around 2.85 would mostly re-find the point the selection rule already picks; the untapped budget is in accuracy/power combinations that round 1's 30-eval-per-family sampling never visited (pipelined feasible ranges were only data_width 17..20, pipelined_m only m=2). Therefore let code run NSGA-II over the FULL registry ranges of the two feasible families (pipelined, pipelined_m), seeded with the current front, to fill the accuracy_bits 15.5..~20 and power_index 2.5..20 region before the reserved end-of-run mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 129.1 (gain this round: n/a (first round)).
Feasible designs: 24 of 100 evaluations (23 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 59% violate; best seen 163
- max_abs_err <= 0.000244141: 50% violate; best seen 1.31e-05 (2^-16.22)

Pareto front (feasible, 4 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=18 angle_guard=3 frac_guard=1 rounding=round m=2] power_index=2.85, accuracy_bits=13.4, area_um2=41047, ffs=591, throughput_msps=72.3, max_abs_err=9.28e-05 (2^-13.40)
- pipelined_m [data_width=19 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.93, accuracy_bits=14.5, area_um2=41527, ffs=612, throughput_msps=72.3, max_abs_err=4.26e-05 (2^-14.52)
- pipelined [data_width=18 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] power_index=4.93, accuracy_bits=14.7, area_um2=55909, ffs=1180, throughput_msps=132, max_abs_err=3.81e-05 (2^-14.68)
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=4 rounding=round] power_index=5.42, accuracy_bits=15.5, area_um2=61576, ffs=1296, throughput_msps=119, max_abs_err=2.09e-05 (2^-15.55)
Front coverage: power_index 2.85..5.42 (HV reference 40); accuracy_bits 13.4..15.5 (HV reference 12); data_width on the front 17..19 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.19 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.14 MSPS; best accuracy 16.22 bits
- pipelined: 30 evals, 19 feasible; max throughput seen 163 MSPS; best accuracy 15.55 bits; best feasible power_index=3.93; feasible ranges: data_width 17..20, n_iter 14..22, angle_guard -2..2, frac_guard 0..4
- pipelined_m: 30 evals, 5 feasible; max throughput seen 91.1 MSPS; best accuracy 15.25 bits; best feasible power_index=2.85; feasible ranges: data_width 17..19, n_iter 17..20, angle_guard -1..3, frac_guard 0..1, m 2..2
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (50 evals): data_width=16..28, n_iter=16..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (2 front designs; box front_anchored)
- `pipelined` (50 evals): data_width=17..28, n_iter=16..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (2 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 89 feasible; hypervolume 378.1 (+192.8%).

**LLM decision:** `refine` — All four families are now explored, so the choice is where to spend the remaining 200 evals. Evidence: (1) iterative (0/10 feasible, max 11 MSPS) and unrolled_k (0/30 feasible, max 7.14 MSPS) cannot reach the 50 MSPS constraint at all — they are dead ends and should get no more budget. (2) The entire 10-point front is pipelined_m with m=2; pipelined's best feasible power_index (3.93) is worse than pipelined_m's (2.85) and its best accuracy (20.80) is below pipelined_m's (22.84), so pipelined_m dominates and is the family to refine. (3) The front's low end stops at accuracy_bits=13.4 (power 2.85), but the spec only requires max_abs_err <= 2^-12, i.e. 12 bits — the whole 12.0..13.4 accuracy band is unmapped. Because the HV reference power is 40, each accuracy bit added near power~2.5-2.85 is worth ~(40-2.85)≈37 of HV, so filling this low-power/low-accuracy corner is the single largest HV opportunity. (4) The high end stops at 22.7 bits (power 6.96) while the registry allows data_width up to 28 and n_iter up to 30, so a modest extension is possible. (5) m is only 2 on the front even though m=2 still leaves throughput headroom (72.3 MSPS at data_width=17 vs the 50 MSPS floor), so m=3 is worth probing for extra power savings. This is a targeted refine; the reserved final round can then map the full pipelined_m ranges.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 378.1 (gain this round: +192.8%).
Feasible designs: 89 of 200 evaluations (78 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 46% violate; best seen 163
- max_abs_err <= 0.000244141: 27% violate; best seen 1.33e-07 (2^-22.84)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=18 angle_guard=3 frac_guard=1 rounding=round m=2] power_index=2.85, accuracy_bits=13.4, area_um2=41047, ffs=591, throughput_msps=72.3, max_abs_err=9.28e-05 (2^-13.40)
- pipelined_m [data_width=19 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.93, accuracy_bits=14.5, area_um2=41527, ffs=612, throughput_msps=72.3, max_abs_err=4.26e-05 (2^-14.52)
- pipelined_m [data_width=26 n_iter=17 angle_guard=0 frac_guard=3 rounding=trunc m=2] power_index=4.01, accuracy_bits=16, area_um2=55804, ffs=850, throughput_msps=52.7, max_abs_err=1.56e-05 (2^-15.97)
- pipelined_m [data_width=26 n_iter=18 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=4.21, accuracy_bits=17, area_um2=60738, ffs=870, throughput_msps=52.7, max_abs_err=7.69e-06 (2^-16.99)
- pipelined_m [data_width=26 n_iter=21 angle_guard=0 frac_guard=2 rounding=trunc m=2] power_index=4.8, accuracy_bits=19.4, area_um2=67517, ffs=1010, throughput_msps=54.3, max_abs_err=1.44e-06 (2^-19.40)
- pipelined_m [data_width=26 n_iter=21 angle_guard=0 frac_guard=3 rounding=trunc m=2] power_index=4.89, accuracy_bits=19.4, area_um2=68975, ffs=1029, throughput_msps=52.7, max_abs_err=1.41e-06 (2^-19.44)
- pipelined_m [data_width=26 n_iter=30 angle_guard=-1 frac_guard=3 rounding=trunc m=2] power_index=6.66, accuracy_bits=19.9, area_um2=96550, ffs=1372, throughput_msps=52.7, max_abs_err=1.02e-06 (2^-19.90)
- pipelined_m [data_width=26 n_iter=30 angle_guard=0 frac_guard=3 rounding=trunc m=2] power_index=6.73, accuracy_bits=20.6, area_um2=97618, ffs=1387, throughput_msps=52.7, max_abs_err=6.15e-07 (2^-20.63)
- pipelined_m [data_width=26 n_iter=30 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=6.88, accuracy_bits=22.3, area_um2=99755, ffs=1417, throughput_msps=52.7, max_abs_err=1.89e-07 (2^-22.33)
- pipelined_m [data_width=27 n_iter=30 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=6.96, accuracy_bits=22.7, area_um2=100911, ffs=1435, throughput_msps=52.7, max_abs_err=1.42e-07 (2^-22.74)
Front coverage: power_index 2.85..6.96 (HV reference 40); accuracy_bits 13.4..22.7 (HV reference 12); data_width on the front 17..27 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.19 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.14 MSPS; best accuracy 16.22 bits
- pipelined: 80 evals, 68 feasible; max throughput seen 163 MSPS; best accuracy 20.80 bits; best feasible power_index=3.93; feasible ranges: data_width 17..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 80 evals, 21 feasible; max throughput seen 91.1 MSPS; best accuracy 22.84 bits; best feasible power_index=2.85; feasible ranges: data_width 17..28, n_iter 17..30, angle_guard -2..3, frac_guard 0..3, m 2..2
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Fill the unmapped 12..13.4-bit low-power corner, probe m=3, and lightly extend the high-accuracy end. Drop iterative/unrolled_k (cannot meet 50 MSPS).*)
- `pipelined_m` (86 evals): data_width=14..19, n_iter=14..20, angle_guard=0..4, frac_guard=0..4, rounding=round, m=2..3. *Why:* low-power / low-accuracy corner: push data_width and n_iter down toward the 2^-12 error floor to extend the front below power_index 2.85
- `pipelined` (14 evals): data_width=15..19, n_iter=14..20, angle_guard=0..4, frac_guard=0..4, rounding=round. *Why:* cheap control probe: confirm m=1 cannot beat pipelined_m m=2 at the low-power corner
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 100 evaluations this round, 300 total; 156 feasible; hypervolume 380 (+0.5%).

**LLM decision:** `refine` — See above.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.52% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 100 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 380 (gain this round: +0.5%).
Feasible designs: 156 of 300 evaluations (127 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 35% violate; best seen 163
- max_abs_err <= 0.000244141: 25% violate; best seen 1.33e-07 (2^-22.84)

Pareto front (feasible, 21 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=15 n_iter=15 angle_guard=2 frac_guard=3 rounding=round m=3] power_index=1.75, accuracy_bits=12, area_um2=29117, ffs=321, throughput_msps=54.3, max_abs_err=0.000242 (2^-12.01)
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=2.23, accuracy_bits=12.5, area_um2=31916, ffs=465, throughput_msps=75.4, max_abs_err=0.000171 (2^-12.51)
- pipelined_m [data_width=17 n_iter=14 angle_guard=3 frac_guard=4 rounding=round m=2] power_index=2.42, accuracy_bits=12.7, area_um2=34739, ffs=502, throughput_msps=69.4, max_abs_err=0.000145 (2^-12.75)
- pipelined_m [data_width=17 n_iter=17 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=2.88, accuracy_bits=14.1, area_um2=40630, ffs=607, throughput_msps=72.3, max_abs_err=5.72e-05 (2^-14.09)
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=4 rounding=round m=2] power_index=2.96, accuracy_bits=14.6, area_um2=42699, ffs=613, throughput_msps=64.3, max_abs_err=4.03e-05 (2^-14.60)
- pipelined_m [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=round m=2] power_index=3.27, accuracy_bits=15.5, area_um2=46223, ffs=688, throughput_msps=64.3, max_abs_err=2.19e-05 (2^-15.48)
- pipelined_m [data_width=26 n_iter=17 angle_guard=0 frac_guard=3 rounding=trunc m=2] power_index=4.01, accuracy_bits=16, area_um2=55804, ffs=850, throughput_msps=52.7, max_abs_err=1.56e-05 (2^-15.97)
- pipelined_m [data_width=26 n_iter=21 angle_guard=0 frac_guard=3 rounding=trunc m=2] power_index=4.89, accuracy_bits=19.4, area_um2=68975, ffs=1029, throughput_msps=52.7, max_abs_err=1.41e-06 (2^-19.44)
- pipelined_m [data_width=26 n_iter=30 angle_guard=0 frac_guard=3 rounding=trunc m=2] power_index=6.73, accuracy_bits=20.6, area_um2=97618, ffs=1387, throughput_msps=52.7, max_abs_err=6.15e-07 (2^-20.63)
- pipelined_m [data_width=27 n_iter=30 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=6.96, accuracy_bits=22.7, area_um2=100911, ffs=1435, throughput_msps=52.7, max_abs_err=1.42e-07 (2^-22.74)
Front coverage: power_index 1.75..6.96 (HV reference 40); accuracy_bits 12..22.7 (HV reference 12); data_width on the front 15..27 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.19 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.14 MSPS; best accuracy 16.22 bits
- pipelined: 94 evals, 80 feasible; max throughput seen 163 MSPS; best accuracy 20.80 bits; best feasible power_index=3.36; feasible ranges: data_width 16..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 166 evals, 76 feasible; max throughput seen 91.1 MSPS; best accuracy 22.84 bits; best feasible power_index=1.75; feasible ranges: data_width 15..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=14..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (21 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 191 feasible; hypervolume 383.8 (+1.0%).

**No LLM call** (code's front-mapping round): See above.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 383.8 (gain this round: +1.0%).
Feasible designs: 191 of 400 evaluations (156 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 40% violate; best seen 163
- max_abs_err <= 0.000244141: 22% violate; best seen 1.33e-07 (2^-22.84)

Pareto front (feasible, 25 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=15 n_iter=15 angle_guard=2 frac_guard=3 rounding=round m=3] power_index=1.75, accuracy_bits=12, area_um2=29117, ffs=321, throughput_msps=54.3, max_abs_err=0.000242 (2^-12.01)
- pipelined_m [data_width=17 n_iter=14 angle_guard=3 frac_guard=3 rounding=round m=2] power_index=2.36, accuracy_bits=12.7, area_um2=33812, ffs=491, throughput_msps=72.3, max_abs_err=0.000148 (2^-12.73)
- pipelined_m [data_width=18 n_iter=20 angle_guard=0 frac_guard=0 rounding=round m=3] power_index=2.43, accuracy_bits=13.1, area_um2=39364, ffs=455, throughput_msps=54.3, max_abs_err=0.000114 (2^-13.10)
- pipelined_m [data_width=19 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.93, accuracy_bits=14.5, area_um2=41527, ffs=612, throughput_msps=72.3, max_abs_err=4.26e-05 (2^-14.52)
- pipelined_m [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=round m=2] power_index=3.27, accuracy_bits=15.5, area_um2=46223, ffs=688, throughput_msps=64.3, max_abs_err=2.19e-05 (2^-15.48)
- pipelined_m [data_width=19 n_iter=19 angle_guard=2 frac_guard=4 rounding=round m=2] power_index=3.63, accuracy_bits=15.9, area_um2=51525, ffs=759, throughput_msps=64.3, max_abs_err=1.65e-05 (2^-15.88)
- pipelined_m [data_width=21 n_iter=22 angle_guard=4 frac_guard=2 rounding=round m=2] power_index=4.28, accuracy_bits=18.1, area_um2=62120, ffs=883, throughput_msps=59.9, max_abs_err=3.61e-06 (2^-18.08)
- pipelined_m [data_width=26 n_iter=21 angle_guard=0 frac_guard=3 rounding=trunc m=2] power_index=4.89, accuracy_bits=19.4, area_um2=68975, ffs=1029, throughput_msps=52.7, max_abs_err=1.41e-06 (2^-19.44)
- pipelined_m [data_width=28 n_iter=25 angle_guard=1 frac_guard=0 rounding=trunc m=2] power_index=5.87, accuracy_bits=21.9, area_um2=83262, ffs=1231, throughput_msps=52.7, max_abs_err=2.55e-07 (2^-21.91)
- pipelined_m [data_width=27 n_iter=30 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=6.96, accuracy_bits=22.7, area_um2=100911, ffs=1435, throughput_msps=52.7, max_abs_err=1.42e-07 (2^-22.74)
Front coverage: power_index 1.75..6.96 (HV reference 40); accuracy_bits 12..22.7 (HV reference 12); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.19 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.14 MSPS; best accuracy 16.22 bits
- pipelined: 94 evals, 80 feasible; max throughput seen 163 MSPS; best accuracy 20.80 bits; best feasible power_index=3.36; feasible ranges: data_width 16..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 266 evals, 111 feasible; max throughput seen 91.1 MSPS; best accuracy 22.84 bits; best feasible power_index=1.75; feasible ranges: data_width 14..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 9786 in, 26914 out
- provider-reported cost: $0.0179
- full prompts and replies: `llm_trace.jsonl`

