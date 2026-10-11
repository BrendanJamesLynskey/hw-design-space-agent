# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
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
`pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 28058 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7475 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 323 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 129 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.73 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000168 (2^-12.54) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 5.49 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 4.52e-05 (2^-14.43) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.48 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 99.8 dBc, SNR 84.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 28058 | 323 | 54.3 | 7 | 1.73 | 0.000168 (2^-12.54) | 12.54 |
| 1 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=3` | 29860 | 333 | 54.3 | 7 | 1.81 | 0.000158 (2^-12.63) | 12.63 |
| 2 | `pipelined_m:data_width=18,n_iter=18,angle_guard=0,frac_guard=1,rounding=round,m=3` | 37017 | 407 | 51.9 | 8 | 2.22 | 0.000104 (2^-13.22) | 13.22 |
| 3 | `pipelined_m:data_width=20,n_iter=15,angle_guard=0,frac_guard=0,rounding=trunc,m=2` | 36311 | 566 | 72.3 | 10 | 2.64 | 8.73e-05 (2^-13.48) | 13.48 |
| 4 | `pipelined_m:data_width=20,n_iter=17,angle_guard=0,frac_guard=0,rounding=trunc,m=2` | 41146 | 632 | 72.3 | 11 | 2.97 | 4.91e-05 (2^-14.31) | 14.31 |
| 5 | `pipelined_m:data_width=20,n_iter=17,angle_guard=2,frac_guard=0,rounding=round,m=2` | 42356 | 650 | 66.8 | 11 | 3.05 | 2.85e-05 (2^-15.10) | 15.10 |
| 6 | `pipelined_m:data_width=20,n_iter=20,angle_guard=1,frac_guard=0,rounding=round,m=2` | 48372 | 708 | 69.4 | 12 | 3.39 | 2.52e-05 (2^-15.28) | 15.28 |
| 7 | `pipelined_m:data_width=25,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round,m=2` | 51882 | 766 | 59.9 | 11 | 3.66 | 8.98e-06 (2^-16.76) | 16.76 |
| 8 | `pipelined_m:data_width=26,n_iter=18,angle_guard=-1,frac_guard=0,rounding=trunc,m=2` | 53819 | 794 | 57.9 | 11 | 3.79 | 8.13e-06 (2^-16.91) | 16.91 |
| 9 | `pipelined_m:data_width=26,n_iter=18,angle_guard=0,frac_guard=0,rounding=round,m=2` | 54449 | 803 | 57.9 | 11 | 3.84 | 7.95e-06 (2^-16.94) | 16.94 |
| 10 | `pipelined_m:data_width=27,n_iter=18,angle_guard=-1,frac_guard=0,rounding=trunc,m=2` | 55755 | 823 | 56.1 | 11 | 3.93 | 7.95e-06 (2^-16.94) | 16.94 |
| 11 | `pipelined_m:data_width=26,n_iter=18,angle_guard=3,frac_guard=0,rounding=trunc,m=2` | 56342 | 830 | 52.7 | 11 | 3.97 | 7.87e-06 (2^-16.96) | 16.96 |
| 12 | `pipelined_m:data_width=27,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc,m=2` | 57647 | 849 | 52.7 | 11 | 4.06 | 7.79e-06 (2^-16.97) | 16.97 |
| 13 | `pipelined_m:data_width=28,n_iter=18,angle_guard=-1,frac_guard=0,rounding=trunc,m=2` | 57691 | 851 | 54.3 | 11 | 4.07 | 7.78e-06 (2^-16.97) | 16.97 |
| 14 | `pipelined_m:data_width=27,n_iter=18,angle_guard=3,frac_guard=0,rounding=round,m=2` | 58278 | 858 | 51.2 | 11 | 4.1 | 7.7e-06 (2^-16.99) | 16.99 |
| 15 | `pipelined_m:data_width=22,n_iter=21,angle_guard=0,frac_guard=2,rounding=round,m=2` | 59496 | 874 | 62.0 | 13 | 4.18 | 6.73e-06 (2^-17.18) | 17.18 |
| 16 | `pipelined_m:data_width=23,n_iter=21,angle_guard=1,frac_guard=1,rounding=trunc,m=2` | 59918 | 898 | 62.0 | 13 | 4.26 | 3.47e-06 (2^-18.14) | 18.14 |
| 17 | `pipelined_m:data_width=25,n_iter=21,angle_guard=0,frac_guard=0,rounding=round,m=2` | 62302 | 936 | 59.9 | 13 | 4.44 | 1.99e-06 (2^-18.94) | 18.94 |
| 18 | `pipelined_m:data_width=25,n_iter=22,angle_guard=-1,frac_guard=1,rounding=round,m=2` | 66426 | 947 | 57.9 | 13 | 4.59 | 1.96e-06 (2^-18.96) | 18.96 |
| 19 | `pipelined_m:data_width=25,n_iter=22,angle_guard=2,frac_guard=0,rounding=trunc,m=2` | 65925 | 958 | 56.1 | 13 | 4.6 | 1.53e-06 (2^-19.31) | 19.31 |
| 20 | `pipelined_m:data_width=25,n_iter=22,angle_guard=2,frac_guard=1,rounding=trunc,m=2` | 67435 | 977 | 56.1 | 13 | 4.7 | 1.02e-06 (2^-19.91) | 19.91 |
| 21 | `pipelined_m:data_width=25,n_iter=22,angle_guard=2,frac_guard=3,rounding=trunc,m=2` | 70455 | 1017 | 54.3 | 13 | 4.9 | 7.28e-07 (2^-20.39) | 20.39 |
| 22 | `pipelined_m:data_width=26,n_iter=22,angle_guard=2,frac_guard=1,rounding=round,m=2` | 71181 | 1014 | 54.3 | 13 | 4.91 | 6.47e-07 (2^-20.56) | 20.56 |
| 23 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=0,rounding=trunc,m=2` | 77186 | 1115 | 52.7 | 14 | 5.37 | 4.68e-07 (2^-21.03) | 21.03 |
| 24 | `pipelined_m:data_width=25,n_iter=25,angle_guard=2,frac_guard=3,rounding=trunc,m=2` | 81206 | 1194 | 54.3 | 15 | 5.71 | 4.08e-07 (2^-21.23) | 21.23 |
| 25 | `pipelined_m:data_width=25,n_iter=26,angle_guard=2,frac_guard=3,rounding=trunc,m=2` | 83480 | 1194 | 54.3 | 15 | 5.78 | 3.7e-07 (2^-21.37) | 21.37 |
| 26 | `pipelined_m:data_width=26,n_iter=28,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 91076 | 1300 | 54.3 | 16 | 6.3 | 2.9e-07 (2^-21.72) | 21.72 |
| 27 | `pipelined_m:data_width=28,n_iter=27,angle_guard=0,frac_guard=1,rounding=round,m=2` | 92322 | 1335 | 52.7 | 16 | 6.43 | 1.51e-07 (2^-22.66) | 22.66 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are throughput >= 50 MSPS and max_abs_err <= 2^-12; power is minimised subject to those, and the front is scored on power vs accuracy_bits. Accuracy depends only on data_width/n_iter/angle_guard/frac_guard/rounding, so all four families share the same accuracy box: output LSB is 2^-(W-2), meaning 2^-12 max error forces W around 14+ (13 is the boundary case) and N around 14-16, hence data_width 13..18 and n_iter 13..20 centred on the wall rather than on generous accuracy. Rounding is left open (trunc vs round) because round buys a bit of accuracy for free where it lets W drop by one. Throughput separates the families: pipelined and pipelined_m give 1 result/cycle and clear 50 MSPS trivially, unrolled_k needs k large enough that ceil(N/k)+3 cycles still hits 50 MSPS, and iterative needs an implausible ~800 MHz for the N required, so it is only a small probe. Budget is weighted to pipelined_m and unrolled_k because they are the plausible low-power feasible designs (fewer pipeline registers; time-multiplexed datapath), with pipelined retained to anchor the high-power end of the trade-off curve that hypervolume needs, and iterative kept minimal to either confirm infeasibility or catch an edge case. This first round deliberately spans the full m/k sweeps so the reserved later budget can map the front over the ranges of whichever family ends up carrying it.*)
- `pipelined_m` (32 evals): data_width=13..18, n_iter=13..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* 1 result/cycle with Fmax in the low-100s of MHz comfortably clears 50 MSPS, so the throughput constraint is never the binding limit; power then hinges on register count, which m directly controls (large m = fewer pipeline FFs, longer combinational chain). This is the most likely home of the min-power feasible design, so it gets the largest share. m spans 2..8 to trace the FF-power vs Fmax/area trade-off; data_width 13..18 and n_iter 13..20 bracket the 2^-12 error wall (output LSB 2^-(W-2)) so the search can sit right at the accuracy constraint instead of overshooting it.
- `unrolled_k` (30 evals): data_width=13..18, n_iter=13..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..8. *Why:* Time-multiplexes the datapath (shared shifter/adder), so its cell area can be much lower than a fully registered pipeline — the strongest candidate for a low-power feasible point if it can still reach rate. Rate is ceil(N/k)+3 cycles/result, so k must be large enough to reach 50 MSPS at the attainable Fmax; k 2..8 lets the search find the minimum k (cheapest shifter/mux logic) that still clears the throughput bar. Accuracy ranges mirror the other families since the computed bits are identical.
- `pipelined` (28 evals): data_width=13..18, n_iter=13..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Reference high-throughput family: 1 result/cycle, so 50 MSPS is met even near the bottom of its Fmax range. It is the register-heaviest option (one stage per micro-rotation) and therefore defines the upper edge of the power/area trade curve, which hypervolume needs. Same accuracy parameterization as the others so the three families are directly comparable on the power-vs-accuracy plane.
- `iterative` (10 evals): data_width=13..18, n_iter=13..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest datapath (1 shared micro-rotation) and thus the theoretical low-power corner, but it yields one result every N+3 cycles: reaching 50 MSPS with N>=13 (required for 2^-12) would need Fmax >= 800 MHz, which is not plausible in sky130 typical. Kept at a small probe share so the search can either find a genuine exception at the low-N/low-W edge or confirm the family is infeasible for this spec — useful information for the infeasibility call, without burning budget that belongs to the families that can actually meet the rate.

**Result (code):** 100 evaluations this round, 100 total; 15 feasible; hypervolume 57.6 (n/a).

**LLM decision:** `refine` — iterative and unrolled_k are dead ends for this spec (0 feasible in 40 evals, best throughputs 8.84 and 7.02 MSPS vs the 50 MSPS requirement). The feasible front lives entirely in pipelined (accuracy tail, power 3.69..4.53) and pipelined_m (power corner 2.78), and pipelined_m was mapped only in a single tiny corner (data_width=18, n_iter=18..19, angle_guard=-1, frac_guard=0..1, m=2; 2 feasible/32 evals). With min power_index as the selection rule and HV reference power 40, the highest-value move is to widen those two families around the low-power corner to find power_index < 2.78 and to fill the accuracy band, before spending a later round on full map_front.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 57.6 (gain this round: n/a (first round)).
Feasible designs: 15 of 100 evaluations (12 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 67% violate; best seen 163
- max_abs_err <= 0.000244141: 50% violate; best seen 4.73e-05 (2^-14.37)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=18 angle_guard=-1 frac_guard=1 rounding=trunc m=2] power_index=2.78, accuracy_bits=12.4, area_um2=39547, ffs=582, throughput_msps=75.4, max_abs_err=0.00018 (2^-12.44)
- pipelined [data_width=17 n_iter=14 angle_guard=1 frac_guard=3 rounding=round] power_index=3.69, accuracy_bits=12.5, area_um2=41899, ffs=885, throughput_msps=132, max_abs_err=0.000168 (2^-12.54)
- pipelined [data_width=17 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] power_index=3.75, accuracy_bits=12.6, area_um2=42537, ffs=899, throughput_msps=132, max_abs_err=0.000157 (2^-12.64)
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] power_index=4.16, accuracy_bits=12.8, area_um2=46512, ffs=1003, throughput_msps=138, max_abs_err=0.000139 (2^-12.81)
- pipelined [data_width=17 n_iter=17 angle_guard=1 frac_guard=3 rounding=trunc] power_index=4.46, accuracy_bits=13, area_um2=50149, ffs=1075, throughput_msps=132, max_abs_err=0.000125 (2^-12.97)
- pipelined [data_width=17 n_iter=17 angle_guard=1 frac_guard=3 rounding=round] power_index=4.5, accuracy_bits=13.2, area_um2=51062, ffs=1077, throughput_msps=132, max_abs_err=0.000108 (2^-13.17)
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] power_index=4.53, accuracy_bits=13.6, area_um2=50929, ffs=1091, throughput_msps=132, max_abs_err=8.08e-05 (2^-13.60)
Front coverage: power_index 2.78..4.53 (HV reference 40); accuracy_bits 12.4..13.6 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 8.84 MSPS; best accuracy 12.94 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.02 MSPS; best accuracy 14.37 bits
- pipelined: 28 evals, 13 feasible; max throughput seen 163 MSPS; best accuracy 13.60 bits; best feasible power_index=3.66; feasible ranges: data_width 17..17, n_iter 14..19, angle_guard 0..2, frac_guard 0..3
- pipelined_m: 32 evals, 2 feasible; max throughput seen 86.6 MSPS; best accuracy 13.66 bits; best feasible power_index=2.78; feasible ranges: data_width 18..18, n_iter 18..19, angle_guard -1..-1, frac_guard 0..1, m 2..2
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Funnel the round into the two families that actually reach the throughput wall. iterative (max 8.84 MSPS) and unrolled_k (max 7.02 MSPS) both produced 0 feasible designs across 40 evals, so they are structurally incapable of the 50 MSPS constraint and should not receive further budget. The feasible front is held solely by pipelined (accuracy extreme, power_index 3.69..4.53, accuracy_bits 12.5..13.6) and pipelined_m (power extreme, 2.78, at data_width=18). Since the selection rule is min power_index and the HV reference power is 40, hypervolume is dominated by how low the power end of the front can be pushed, so the round targets lowering power_index from 2.78 by broadening the barely-mapped pipelined_m region and letting pipelined test cheaper-but-still-accurate points. map_front is deferred to a later round once these ranges are better located.*)
- `pipelined_m` (60 evals): data_width=16..20, n_iter=14..24, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Holds the min-power corner (power_index 2.78) but its feasible ranges are the narrowest of any family (data_width=18, n_iter=18..19, angle_guard=-1, frac_guard=0..1, m=2) from only 2 feasible of 32 evals, so it is almost certainly under-explored. Widening data_width, n_iter, angle_guard, frac_guard and m while sampling around that corner is the most direct way to push power_index below 2.78 (the selection rule's objective). m is kept low because pipelined_m throughput collapses with depth (m=1 -> 132 MSPS for pipelined vs m=2 -> 75.4 MSPS), so m must stay small to keep >=50 MSPS.
- `pipelined` (40 evals): data_width=16..20, n_iter=12..22, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Supplies all six high-accuracy front points (up to 13.6 bits) and the widest feasible band (data_width=17, n_iter=14..19, angle_guard=0..2, frac_guard=0..3). Widening slightly downward in data_width/n_iter tests whether a cheaper point can still clear max_abs_err<=2^-12, filling the low-power end of the accuracy trade-off, while keeping the existing accuracy tail.

**Result (code):** 100 evaluations this round, 200 total; 67 feasible; hypervolume 139.3 (+141.8%).

**LLM decision:** `map_front` — Only pipelined and pipelined_m can meet the 50 MSPS constraint (iterative/unrolled_k top out at 8.84/7.02 MSPS, 0 feasible), so the front is correctly restricted to those two families. But the front is very narrow on both objectives: it spans only data_width 17..20 (accuracy 12.5..15.8 bits) while the registry allows data_width up to 28, and power_index only 1.73..5.85 against the HV reference of 40. The HV (139.3, ref (40,12)) is dominated by the accuracy span — each extra accuracy bit adds ~(40-power)≈35 HV, whereas each unit of power adds only ~(accuracy span)≈3.8 HV — so the unmapped high-accuracy region (data_width 21..28, which the pipelined family should still reach at >50 MSPS given 123 MSPS at W=20) is by far the largest HV gap. A full-range NSGA-II over pipelined/pipelined_m seeded with the current front will extend coverage into that region while preserving the low-power corner (1.73) that the min-power selection rule picks, and leaves round 4 free to refine around that corner.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 139.3 (gain this round: +141.8%).
Feasible designs: 67 of 200 evaluations (57 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 46% violate; best seen 163
- max_abs_err <= 0.000244141: 36% violate; best seen 1.79e-05 (2^-15.77)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.73, accuracy_bits=12.5, area_um2=28058, ffs=323, throughput_msps=54.3, max_abs_err=0.000168 (2^-12.54)
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.81, accuracy_bits=12.6, area_um2=29860, ffs=333, throughput_msps=54.3, max_abs_err=0.000158 (2^-12.63)
- pipelined_m [data_width=18 n_iter=18 angle_guard=0 frac_guard=1 rounding=round m=3] power_index=2.22, accuracy_bits=13.2, area_um2=37017, ffs=407, throughput_msps=51.9, max_abs_err=0.000104 (2^-13.22)
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc m=2] power_index=2.64, accuracy_bits=13.5, area_um2=36311, ffs=566, throughput_msps=72.3, max_abs_err=8.73e-05 (2^-13.48)
- pipelined_m [data_width=20 n_iter=17 angle_guard=0 frac_guard=0 rounding=trunc m=2] power_index=2.97, accuracy_bits=14.3, area_um2=41146, ffs=632, throughput_msps=72.3, max_abs_err=4.91e-05 (2^-14.31)
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=3.05, accuracy_bits=15.1, area_um2=42356, ffs=650, throughput_msps=66.8, max_abs_err=2.85e-05 (2^-15.10)
- pipelined_m [data_width=20 n_iter=20 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=3.39, accuracy_bits=15.3, area_um2=48372, ffs=708, throughput_msps=69.4, max_abs_err=2.52e-05 (2^-15.28)
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] power_index=5, accuracy_bits=15.4, area_um2=56761, ffs=1197, throughput_msps=123, max_abs_err=2.32e-05 (2^-15.40)
- pipelined [data_width=20 n_iter=20 angle_guard=1 frac_guard=2 rounding=trunc] power_index=5.85, accuracy_bits=15.8, area_um2=65853, ffs=1408, throughput_msps=123, max_abs_err=1.79e-05 (2^-15.77)
Front coverage: power_index 1.73..5.85 (HV reference 40); accuracy_bits 12.5..15.8 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 8.84 MSPS; best accuracy 12.94 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.02 MSPS; best accuracy 14.37 bits
- pipelined: 68 evals, 45 feasible; max throughput seen 163 MSPS; best accuracy 15.77 bits; best feasible power_index=3.66; feasible ranges: data_width 16..20, n_iter 14..22, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 92 evals, 22 feasible; max throughput seen 86.6 MSPS; best accuracy 15.49 bits; best feasible power_index=1.73; feasible ranges: data_width 16..20, n_iter 15..23, angle_guard -1..3, frac_guard 0..2, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (32 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (7 front designs; box front_anchored)
- `pipelined` (8 evals): data_width=19..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (2 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 96 feasible; hypervolume 337.3 (+142.1%).

**LLM decision:** `map_front` — Round 3 is complete with 240/400 evals used and only one round (round 4) left, so this is the point to spend the reserved budget mapping the front. Evidence: the feasible front (15 designs, 96 feasible/83 unique) is entirely pipelined_m, spanning power_index 1.73..5.78 against HV ref 40 and accuracy_bits 12.5..21.4 against HV ref 12. The min-power corner (1.73, pipelined_m m=3, W=17 N=15) is far better than pipelined's best feasible power_index=3.66, and iterative/unrolled_k are dead ends (0 feasible; max throughput 8.84 and 7.02 MSPS, both far under the 50 MSPS constraint). The front covers only a small slice of the power range (1.73..5.78 of ref 40), so widening/refining a narrow region risks leaving HV on the table; a full-range NSGA-II pass over the families actually on the front (pipelined_m, with pipelined as the near neighbour) seeded with the current front is the best use of the remaining 160 evals to both improve HV coverage and confirm the min-power selection corner.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 337.3 (gain this round: +142.1%).
Feasible designs: 96 of 240 evaluations (83 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 42% violate; best seen 163
- max_abs_err <= 0.000244141: 32% violate; best seen 7.02e-08 (2^-23.76)

Pareto front (feasible, 15 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.73, accuracy_bits=12.5, area_um2=28058, ffs=323, throughput_msps=54.3, max_abs_err=0.000168 (2^-12.54)
- pipelined_m [data_width=18 n_iter=18 angle_guard=0 frac_guard=1 rounding=round m=3] power_index=2.22, accuracy_bits=13.2, area_um2=37017, ffs=407, throughput_msps=51.9, max_abs_err=0.000104 (2^-13.22)
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc m=2] power_index=2.64, accuracy_bits=13.5, area_um2=36311, ffs=566, throughput_msps=72.3, max_abs_err=8.73e-05 (2^-13.48)
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=3.05, accuracy_bits=15.1, area_um2=42356, ffs=650, throughput_msps=66.8, max_abs_err=2.85e-05 (2^-15.10)
- pipelined_m [data_width=20 n_iter=20 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=3.39, accuracy_bits=15.3, area_um2=48372, ffs=708, throughput_msps=69.4, max_abs_err=2.52e-05 (2^-15.28)
- pipelined_m [data_width=25 n_iter=22 angle_guard=-1 frac_guard=1 rounding=round m=2] power_index=4.59, accuracy_bits=19, area_um2=66426, ffs=947, throughput_msps=57.9, max_abs_err=1.96e-06 (2^-18.96)
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=0 rounding=trunc m=2] power_index=4.6, accuracy_bits=19.3, area_um2=65925, ffs=958, throughput_msps=56.1, max_abs_err=1.53e-06 (2^-19.31)
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=4.9, accuracy_bits=20.4, area_um2=70455, ffs=1017, throughput_msps=54.3, max_abs_err=7.28e-07 (2^-20.39)
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=4.91, accuracy_bits=20.6, area_um2=71181, ffs=1014, throughput_msps=54.3, max_abs_err=6.47e-07 (2^-20.56)
- pipelined_m [data_width=25 n_iter=26 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=5.78, accuracy_bits=21.4, area_um2=83480, ffs=1194, throughput_msps=54.3, max_abs_err=3.7e-07 (2^-21.37)
Front coverage: power_index 1.73..5.78 (HV reference 40); accuracy_bits 12.5..21.4 (HV reference 12); data_width on the front 17..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 8.84 MSPS; best accuracy 12.94 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.02 MSPS; best accuracy 14.37 bits
- pipelined: 76 evals, 53 feasible; max throughput seen 163 MSPS; best accuracy 19.88 bits; best feasible power_index=3.66; feasible ranges: data_width 16..25, n_iter 14..29, angle_guard -2..4, frac_guard 0..3
- pipelined_m: 124 evals, 43 feasible; max throughput seen 86.6 MSPS; best accuracy 23.76 bits; best feasible power_index=1.73; feasible ranges: data_width 16..26, n_iter 13..29, angle_guard -2..3, frac_guard 0..4, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (15 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 109 feasible; hypervolume 338.3 (+0.3%).

**LLM decision:** `stop` — Final round (round 4 of 4). The front is feasible and well populated: 109 feasible designs (94 unique), 19 on the Pareto front, hypervolume 338.3 with only +0.3% gain this round — diminishing returns. Both constraints are met by front members: throughput_msps >= 50 (e.g. 54.3) and max_abs_err <= 2^-12 (e.g. 2^-12.54). The selection rule (min power_index) is satisfied by pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] at power_index=1.73, accuracy_bits=12.5, throughput 54.3 MSPS, max_abs_err 2^-12.54. The front spans power_index 1.73..5.78 and accuracy_bits 12.5..21.4, so it is not a degenerate corner. All four families were explored; iterative and unrolled_k produced 0 feasible designs (max throughput 8.84 and 7.02 MSPS respectively, far below 50), so they cannot contribute. No constraint is unreachable, so infeasible is not warranted. Stop.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 338.3 (gain this round: +0.3%).
Feasible designs: 109 of 340 evaluations (94 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 55% violate; best seen 163
- max_abs_err <= 0.000244141: 24% violate; best seen 7.02e-08 (2^-23.76)

Pareto front (feasible, 19 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.73, accuracy_bits=12.5, area_um2=28058, ffs=323, throughput_msps=54.3, max_abs_err=0.000168 (2^-12.54)
- pipelined_m [data_width=18 n_iter=18 angle_guard=0 frac_guard=1 rounding=round m=3] power_index=2.22, accuracy_bits=13.2, area_um2=37017, ffs=407, throughput_msps=51.9, max_abs_err=0.000104 (2^-13.22)
- pipelined_m [data_width=20 n_iter=17 angle_guard=0 frac_guard=0 rounding=trunc m=2] power_index=2.97, accuracy_bits=14.3, area_um2=41146, ffs=632, throughput_msps=72.3, max_abs_err=4.91e-05 (2^-14.31)
- pipelined_m [data_width=20 n_iter=20 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=3.39, accuracy_bits=15.3, area_um2=48372, ffs=708, throughput_msps=69.4, max_abs_err=2.52e-05 (2^-15.28)
- pipelined_m [data_width=23 n_iter=21 angle_guard=-2 frac_guard=0 rounding=round m=2] power_index=4.01, accuracy_bits=16.2, area_um2=56206, ffs=845, throughput_msps=64.3, max_abs_err=1.37e-05 (2^-16.16)
- pipelined_m [data_width=22 n_iter=21 angle_guard=0 frac_guard=2 rounding=round m=2] power_index=4.18, accuracy_bits=17.2, area_um2=59496, ffs=874, throughput_msps=62, max_abs_err=6.73e-06 (2^-17.18)
- pipelined_m [data_width=25 n_iter=22 angle_guard=-1 frac_guard=1 rounding=round m=2] power_index=4.59, accuracy_bits=19, area_um2=66426, ffs=947, throughput_msps=57.9, max_abs_err=1.96e-06 (2^-18.96)
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=1 rounding=trunc m=2] power_index=4.7, accuracy_bits=19.9, area_um2=67435, ffs=977, throughput_msps=56.1, max_abs_err=1.02e-06 (2^-19.91)
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=4.91, accuracy_bits=20.6, area_um2=71181, ffs=1014, throughput_msps=54.3, max_abs_err=6.47e-07 (2^-20.56)
- pipelined_m [data_width=25 n_iter=26 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=5.78, accuracy_bits=21.4, area_um2=83480, ffs=1194, throughput_msps=54.3, max_abs_err=3.7e-07 (2^-21.37)
Front coverage: power_index 1.73..5.78 (HV reference 40); accuracy_bits 12.5..21.4 (HV reference 12); data_width on the front 17..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 8.84 MSPS; best accuracy 12.94 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.02 MSPS; best accuracy 14.37 bits
- pipelined: 76 evals, 53 feasible; max throughput seen 163 MSPS; best accuracy 19.88 bits; best feasible power_index=3.66; feasible ranges: data_width 16..25, n_iter 14..29, angle_guard -2..4, frac_guard 0..3
- pipelined_m: 224 evals, 56 feasible; max throughput seen 86.6 MSPS; best accuracy 23.76 bits; best feasible power_index=1.73; feasible ranges: data_width 16..26, n_iter 13..29, angle_guard -2..3, frac_guard 0..4, m 2..3
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (19 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 139 feasible; hypervolume 382.7 (+13.1%).

**No LLM call** (code's front-mapping round): Final round (round 4 of 4). The front is feasible and well populated: 109 feasible designs (94 unique), 19 on the Pareto front, hypervolume 338.3 with only +0.3% gain this round — diminishing returns. Both constraints are met by front members: throughput_msps >= 50 (e.g. 54.3) and max_abs_err <= 2^-12 (e.g. 2^-12.54). The selection rule (min power_index) is satisfied by pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] at power_index=1.73, accuracy_bits=12.5, throughput 54.3 MSPS, max_abs_err 2^-12.54. The front spans power_index 1.73..5.78 and accuracy_bits 12.5..21.4, so it is not a degenerate corner. All four families were explored; iterative and unrolled_k produced 0 feasible designs (max throughput 8.84 and 7.02 MSPS respectively, far below 50), so they cannot contribute. No constraint is unreachable, so infeasible is not warranted. Stop.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 382.7 (gain this round: +13.1%).
Feasible designs: 139 of 400 evaluations (121 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 54% violate; best seen 163
- max_abs_err <= 0.000244141: 20% violate; best seen 7.02e-08 (2^-23.76)

Pareto front (feasible, 28 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.73, accuracy_bits=12.5, area_um2=28058, ffs=323, throughput_msps=54.3, max_abs_err=0.000168 (2^-12.54)
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc m=2] power_index=2.64, accuracy_bits=13.5, area_um2=36311, ffs=566, throughput_msps=72.3, max_abs_err=8.73e-05 (2^-13.48)
- pipelined_m [data_width=20 n_iter=20 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=3.39, accuracy_bits=15.3, area_um2=48372, ffs=708, throughput_msps=69.4, max_abs_err=2.52e-05 (2^-15.28)
- pipelined_m [data_width=26 n_iter=18 angle_guard=0 frac_guard=0 rounding=round m=2] power_index=3.84, accuracy_bits=16.9, area_um2=54449, ffs=803, throughput_msps=57.9, max_abs_err=7.95e-06 (2^-16.94)
- pipelined_m [data_width=27 n_iter=18 angle_guard=2 frac_guard=0 rounding=trunc m=2] power_index=4.06, accuracy_bits=17, area_um2=57647, ffs=849, throughput_msps=52.7, max_abs_err=7.79e-06 (2^-16.97)
- pipelined_m [data_width=22 n_iter=21 angle_guard=0 frac_guard=2 rounding=round m=2] power_index=4.18, accuracy_bits=17.2, area_um2=59496, ffs=874, throughput_msps=62, max_abs_err=6.73e-06 (2^-17.18)
- pipelined_m [data_width=25 n_iter=22 angle_guard=-1 frac_guard=1 rounding=round m=2] power_index=4.59, accuracy_bits=19, area_um2=66426, ffs=947, throughput_msps=57.9, max_abs_err=1.96e-06 (2^-18.96)
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=4.9, accuracy_bits=20.4, area_um2=70455, ffs=1017, throughput_msps=54.3, max_abs_err=7.28e-07 (2^-20.39)
- pipelined_m [data_width=25 n_iter=25 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=5.71, accuracy_bits=21.2, area_um2=81206, ffs=1194, throughput_msps=54.3, max_abs_err=4.08e-07 (2^-21.23)
- pipelined_m [data_width=28 n_iter=27 angle_guard=0 frac_guard=1 rounding=round m=2] power_index=6.43, accuracy_bits=22.7, area_um2=92322, ffs=1335, throughput_msps=52.7, max_abs_err=1.51e-07 (2^-22.66)
Front coverage: power_index 1.73..6.43 (HV reference 40); accuracy_bits 12.5..22.7 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 8.84 MSPS; best accuracy 12.94 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.02 MSPS; best accuracy 14.37 bits
- pipelined: 76 evals, 53 feasible; max throughput seen 163 MSPS; best accuracy 19.88 bits; best feasible power_index=3.66; feasible ranges: data_width 16..25, n_iter 14..29, angle_guard -2..4, frac_guard 0..3
- pipelined_m: 284 evals, 86 feasible; max throughput seen 86.6 MSPS; best accuracy 23.76 bits; best feasible power_index=1.73; feasible ranges: data_width 16..28, n_iter 13..29, angle_guard -2..3, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 12886 in, 21634 out
- provider-reported cost: $0.0199
- full prompts and replies: `llm_trace.jsonl`

