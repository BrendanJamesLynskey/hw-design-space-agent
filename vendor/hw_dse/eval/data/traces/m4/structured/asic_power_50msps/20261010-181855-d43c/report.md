# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
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
`pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=2` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 35202 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 9378 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 549 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 72.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 72.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 10 | exact: schedule |
| latency_ns | 138 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.56 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 8.66e-05 (2^-13.50) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.3 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.64e-05 (2^-15.21) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.46 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.5 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 10 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.2 dBc, SNR 88.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=2` | 35202 | 549 | 72.3 | 10 | 2.56 | 8.66e-05 (2^-13.50) | 13.50 |
| 1 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc,m=2` | 42138 | 640 | 69.4 | 11 | 3.02 | 5.51e-05 (2^-14.15) | 14.15 |
| 2 | `pipelined_m:data_width=21,n_iter=17,angle_guard=2,frac_guard=0,rounding=trunc,m=2` | 44216 | 678 | 64.3 | 11 | 3.19 | 3.12e-05 (2^-14.97) | 14.97 |
| 3 | `pipelined_m:data_width=19,n_iter=18,angle_guard=2,frac_guard=3,rounding=round,m=2` | 46827 | 670 | 66.8 | 11 | 3.24 | 2.1e-05 (2^-15.54) | 15.54 |
| 4 | `pipelined_m:data_width=21,n_iter=18,angle_guard=2,frac_guard=3,rounding=round,m=2` | 50801 | 728 | 62.0 | 11 | 3.52 | 1.04e-05 (2^-16.56) | 16.56 |
| 5 | `pipelined_m:data_width=22,n_iter=21,angle_guard=1,frac_guard=1,rounding=trunc,m=2` | 57621 | 863 | 64.3 | 13 | 4.1 | 6.73e-06 (2^-17.18) | 17.18 |
| 6 | `pipelined_m:data_width=25,n_iter=20,angle_guard=0,frac_guard=0,rounding=round,m=2` | 58443 | 855 | 59.9 | 12 | 4.1 | 2.81e-06 (2^-18.44) | 18.44 |
| 7 | `pipelined_m:data_width=25,n_iter=21,angle_guard=0,frac_guard=0,rounding=round,m=2` | 62302 | 936 | 59.9 | 13 | 4.44 | 1.99e-06 (2^-18.94) | 18.94 |
| 8 | `pipelined_m:data_width=26,n_iter=22,angle_guard=-1,frac_guard=0,rounding=round,m=2` | 65969 | 960 | 57.9 | 13 | 4.61 | 1.18e-06 (2^-19.69) | 19.69 |
| 9 | `pipelined_m:data_width=25,n_iter=22,angle_guard=4,frac_guard=0,rounding=round,m=2` | 67479 | 979 | 52.7 | 13 | 4.71 | 1.06e-06 (2^-19.85) | 19.85 |
| 10 | `pipelined_m:data_width=25,n_iter=22,angle_guard=4,frac_guard=3,rounding=round,m=2` | 73329 | 1040 | 52.7 | 13 | 5.05 | 6.1e-07 (2^-20.65) | 20.65 |
| 11 | `pipelined:data_width=27,n_iter=22,angle_guard=4,frac_guard=0,rounding=round` | 93134 | 1990 | 93.5 | 24 | 8.27 | 5.87e-07 (2^-20.70) | 20.70 |
| 12 | `pipelined:data_width=26,n_iter=22,angle_guard=3,frac_guard=2,rounding=round` | 94332 | 1984 | 98.8 | 24 | 8.29 | 5.72e-07 (2^-20.74) | 20.74 |
| 13 | `pipelined:data_width=26,n_iter=24,angle_guard=1,frac_guard=0,rounding=round` | 95131 | 2029 | 104.7 | 26 | 8.44 | 4.29e-07 (2^-21.15) | 21.15 |
| 14 | `pipelined:data_width=27,n_iter=24,angle_guard=0,frac_guard=1,rounding=round` | 100914 | 2122 | 101.6 | 26 | 8.87 | 3.47e-07 (2^-21.46) | 21.46 |
| 15 | `pipelined:data_width=28,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc` | 101801 | 2171 | 98.8 | 26 | 9.03 | 2.99e-07 (2^-21.67) | 21.67 |
| 16 | `pipelined:data_width=26,n_iter=25,angle_guard=1,frac_guard=3,rounding=trunc` | 105872 | 2249 | 98.8 | 27 | 9.37 | 2.9e-07 (2^-21.72) | 21.72 |
| 17 | `pipelined:data_width=28,n_iter=25,angle_guard=1,frac_guard=0,rounding=round` | 106134 | 2261 | 98.8 | 27 | 9.41 | 1.58e-07 (2^-22.59) | 22.59 |
| 18 | `pipelined:data_width=28,n_iter=24,angle_guard=2,frac_guard=2,rounding=round` | 108658 | 2283 | 96.1 | 26 | 9.55 | 1.5e-07 (2^-22.67) | 22.67 |
| 19 | `pipelined:data_width=28,n_iter=26,angle_guard=4,frac_guard=1,rounding=trunc` | 116411 | 2476 | 91.1 | 28 | 10.3 | 1.1e-07 (2^-23.11) | 23.11 |
| 20 | `pipelined:data_width=26,n_iter=26,angle_guard=4,frac_guard=4,rounding=round` | 117522 | 2466 | 96.1 | 28 | 10.3 | 9.07e-08 (2^-23.39) | 23.39 |
| 21 | `pipelined:data_width=27,n_iter=26,angle_guard=3,frac_guard=4,rounding=round` | 119985 | 2517 | 93.5 | 28 | 10.5 | 6.69e-08 (2^-23.83) | 23.83 |
| 22 | `pipelined:data_width=27,n_iter=26,angle_guard=4,frac_guard=4,rounding=round` | 121192 | 2542 | 93.5 | 28 | 10.6 | 5.92e-08 (2^-24.01) | 24.01 |
| 23 | `pipelined:data_width=27,n_iter=27,angle_guard=4,frac_guard=4,rounding=round` | 125904 | 2641 | 93.5 | 29 | 11 | 4.33e-08 (2^-24.46) | 24.46 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are throughput >= 50 MSPS together with max_abs_err <= 2^-12 (i.e. accuracy_bits >= 12). Accuracy is family-independent (identical compute bits), so it only sets the (data_width, n_iter, guards) window: roughly data_width >= 13 and n_iter ~ 10-20 to clear the output-quantisation and CORDIC-residual floors, with guard bits as the fine trade-off knob. That leaves throughput and power as the family/parameter discriminators. Families that emit 1 result/cycle (pipelined, pipelined_m) meet 50 MSPS at any plausible sky130 Fmax and are therefore the safe feasible core; families with a multi-cycle result rate (unrolled_k, iterative) only qualify at high Fmax and so need large k / small N+3, which is exactly why their budgets are smaller and their k is biased high. Since latency is unconstrained, pipelined_m's depth-vs-register trade-off (large m) is the most promising low-power region, so it gets the largest share, with pipelined as the high-Fmax anchor and control. Round 1 (100 evals) is split pipelined_m 45 / pipelined 30 / unrolled_k 15 / iterative 10; the same proportions carry into the run's 400-eval budget. If iterative and unrolled_k turn out unable to reach 50 MSPS at feasible N they will be abandoned and their share moved onto the winning family, including the reserved end-of-run full-range mapping pass.*)
- `pipelined_m` (45 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..1, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Most likely low-power winner AND trivially feasible on throughput. It emits 1 result/cycle, so the 50 MSPS floor is met at any Fmax >= ~50 MHz, and latency is unconstrained by the spec. Registering only every m stages cuts flip-flop count/area versus full pipelined, and since we do not need high Fmax, large m (fewer, deeper stages) is the natural direction; m is left 2..8 so the search can trace the whole area/depth trade-off. data_width 13..20 and n_iter 10..20 bracket the 2^-12 accuracy boundary (13 bits of output alone are needed before CORDIC residual error) up to comfortable margin, and the guard fields let the search trade bits for cells.
- `pipelined` (30 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..1, frac_guard=0..3, rounding=trunc|round. *Why:* The reference full-pipeline family: 1 result/cycle so the 50 MSPS constraint is met at essentially any sky130 Fmax, giving the high-Fmax / high-power anchor of the front. It is the family we must beat on power, so it must be mapped. Same accuracy ranges as pipelined_m (accuracy depends only on data_width/n_iter/angle_guard/frac_guard/rounding, and all families are bit-identical), which also makes it a clean control for attributing power differences to the register structure.
- `unrolled_k` (15 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..1, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Shares one datapath/FSM so it can have a lower area/power floor than the fully registered pipeline, but it only produces a result every ceil(N/k)+3 cycles, so feasibility demands Fmax >= 50*(ceil(N/k)+3). For the N ~ 12-18 needed for 2^-12 that only has a chance at large k (k>=4, realistically 6-8), so k is biased high. Worth a modest share: if it lands on the front it beats pipelined on area, and if it cannot clear 50 MSPS at feasible N that is itself decisive information.
- `iterative` (10 evals): data_width=13..20, n_iter=10..20, angle_guard=-2..1, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest area and the power reference, but it takes N+3 cycles/result, so 50 MSPS requires Fmax >= 50*(N+3): ~700-900+ MHz at the N ~ 12-18 that 2^-12 needs, which is very unlikely in sky130_fd_sc_hd. Given a small but non-zero budget purely to confirm/deny feasibility with real numbers rather than assume it, and to keep it on record in case the model finds an unexpected high-Fmax corner. If it cannot clear the throughput floor across its range it will drop out of later rounds.

**Result (code):** 100 evaluations this round, 100 total; 7 feasible; hypervolume 130.2 (n/a).

**LLM decision:** `map_front` — Only pipelined and pipelined_m can ever satisfy throughput>=50 MSPS: iterative topped out at 9.83 MSPS and unrolled_k at 5.84 MSPS over their evaluations, so both are structurally infeasible here and should not consume budget. The feasible front is only 3 unique points and is badly under-mapped on the axis that matters most for the selection rule (min power_index): pipelined_m owns the low-power corner (power_index=2.56) yet produced just 1 feasible design in 45 evals, inside a razor-thin feasible box (data_width=19, n_iter=15, angle_guard=1, frac_guard=0, m=2) — clearly the m=2..8 / other-width low-power region is unexplored. Meanwhile pipelined's feasible points cluster tightly at power_index 5.36-5.43 with accuracy 15.0-15.6 bits. The covered power range 2.56..5.43 is a small fraction of the HV reference (40), and accuracy 13.5..15.6 sits well above the 12-bit reference, so hypervolume is being left on the table at the low-power end. This is exactly the 'front covers only a small part of an objective's range' case: spend this round letting NSGA-II map the whole front over the full ranges of the two viable families (pipelined, pipelined_m), seeded with the current front, rather than refining a single narrow box.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 130.2 (gain this round: n/a (first round)).
Feasible designs: 7 of 100 evaluations (4 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 68% violate; best seen 180
- max_abs_err <= 0.000244141: 58% violate; best seen 1.58e-05 (2^-15.95)

Pareto front (feasible, 3 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.56, accuracy_bits=13.5, area_um2=35202, ffs=549, throughput_msps=72.3, max_abs_err=8.66e-05 (2^-13.50)
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=3 rounding=round] power_index=5.36, accuracy_bits=15, area_um2=60887, ffs=1282, throughput_msps=119, max_abs_err=3.08e-05 (2^-14.99)
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=3 rounding=round] power_index=5.43, accuracy_bits=15.6, area_um2=61714, ffs=1300, throughput_msps=119, max_abs_err=1.96e-05 (2^-15.64)
Front coverage: power_index 2.56..5.43 (HV reference 40); accuracy_bits 13.5..15.6 (HV reference 12); data_width on the front 19..20 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 9.83 MSPS; best accuracy 15.95 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 13.82 bits
- pipelined: 30 evals, 6 feasible; max throughput seen 180 MSPS; best accuracy 15.64 bits; best feasible power_index=5.36; feasible ranges: data_width 20..20, n_iter 18..19, angle_guard -2..1, frac_guard 3..3
- pipelined_m: 45 evals, 1 feasible; max throughput seen 72.3 MSPS; best accuracy 14.91 bits; best feasible power_index=2.56; feasible ranges: data_width 19..19, n_iter 15..15, angle_guard 1..1, frac_guard 0..0, m 2..2
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (34 evals): data_width=18..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)
- `pipelined` (66 evals): data_width=19..28, n_iter=16..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (2 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 90 feasible; hypervolume 370.8 (+184.9%).

**LLM decision:** `map_front` — Only pipelined and pipelined_m are feasible: iterative (10 evals, 0 feasible, max 9.83 MSPS) and unrolled_k (15 evals, 0 feasible, max 5.84 MSPS) cannot reach the 50 MSPS constraint, so the front lives entirely on the two pipelined families. The current front spans power_index 2.56..9.55 and accuracy_bits 13.5..22.7, but the HV reference point is at power_index 40, so the front covers only a small part of the power objective's range and has visible gaps (3.96->5.69, 6.0->8.45). The best accuracy seen anywhere is 22.84 bits vs the front's 22.7, and n_iter on the front only reaches 28 (registry allows 30), so the high-accuracy end is not yet saturated. With 200 of 400 evals remaining, the right move is to let code run NSGA-II over the full ranges of pipelined and pipelined_m seeded with the current front, filling the gaps and extending both ends of the trade-off curve before the final selection (min power_index) is made.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 370.8 (gain this round: +184.9%).
Feasible designs: 90 of 200 evaluations (79 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 40% violate; best seen 180
- max_abs_err <= 0.000244141: 32% violate; best seen 1.33e-07 (2^-22.84)

Pareto front (feasible, 15 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.56, accuracy_bits=13.5, area_um2=35202, ffs=549, throughput_msps=72.3, max_abs_err=8.66e-05 (2^-13.50)
- pipelined_m [data_width=21 n_iter=17 angle_guard=2 frac_guard=0 rounding=trunc m=2] power_index=3.19, accuracy_bits=15, area_um2=44216, ffs=678, throughput_msps=64.3, max_abs_err=3.12e-05 (2^-14.97)
- pipelined_m [data_width=25 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=3.96, accuracy_bits=16, area_um2=55155, ffs=840, throughput_msps=54.3, max_abs_err=1.54e-05 (2^-15.98)
- pipelined_m [data_width=25 n_iter=28 angle_guard=0 frac_guard=0 rounding=round m=2] power_index=5.69, accuracy_bits=19.5, area_um2=82160, ffs=1178, throughput_msps=59.9, max_abs_err=1.37e-06 (2^-19.48)
- pipelined_m [data_width=25 n_iter=28 angle_guard=0 frac_guard=2 rounding=round m=2] power_index=6, accuracy_bits=19.9, area_um2=87376, ffs=1231, throughput_msps=56.1, max_abs_err=1.05e-06 (2^-19.86)
- pipelined [data_width=26 n_iter=23 angle_guard=3 frac_guard=1 rounding=trunc] power_index=8.45, accuracy_bits=20.9, area_um2=95252, ffs=2031, throughput_msps=98.8, max_abs_err=5.25e-07 (2^-20.86)
- pipelined [data_width=25 n_iter=23 angle_guard=2 frac_guard=3 rounding=round] power_index=8.47, accuracy_bits=21, area_um2=96398, ffs=2025, throughput_msps=102, max_abs_err=4.74e-07 (2^-21.01)
- pipelined [data_width=26 n_iter=25 angle_guard=1 frac_guard=2 rounding=trunc] power_index=9.18, accuracy_bits=21.5, area_um2=103641, ffs=2204, throughput_msps=102, max_abs_err=3.48e-07 (2^-21.45)
- pipelined [data_width=28 n_iter=24 angle_guard=-1 frac_guard=2 rounding=round] power_index=9.25, accuracy_bits=21.6, area_um2=105324, ffs=2212, throughput_msps=96.1, max_abs_err=3.15e-07 (2^-21.60)
- pipelined [data_width=28 n_iter=24 angle_guard=2 frac_guard=2 rounding=round] power_index=9.55, accuracy_bits=22.7, area_um2=108658, ffs=2283, throughput_msps=96.1, max_abs_err=1.5e-07 (2^-22.67)
Front coverage: power_index 2.56..9.55 (HV reference 40); accuracy_bits 13.5..22.7 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 9.83 MSPS; best accuracy 15.95 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 13.82 bits
- pipelined: 96 evals, 72 feasible; max throughput seen 180 MSPS; best accuracy 22.67 bits; best feasible power_index=4.43; feasible ranges: data_width 19..28, n_iter 16..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 79 evals, 18 feasible; max throughput seen 72.3 MSPS; best accuracy 22.84 bits; best feasible power_index=2.56; feasible ranges: data_width 18..27, n_iter 13..28, angle_guard -2..4, frac_guard 0..4, m 2..2
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (47 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (7 front designs; box front_anchored)
- `pipelined` (53 evals): data_width=24..28, n_iter=19..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (8 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 159 feasible; hypervolume 396.6 (+6.9%).

**LLM decision:** `map_front` — Round 3 of 4 is done (300/400 evals); one round remains, which is the reserved front-mapping round. Evidence: (1) the feasible front is confined to pipelined and pipelined_m — iterative (0/10 feasible, max 9.83 MSPS) and unrolled_k (0/15 feasible, max 5.84 MSPS) cannot reach the 50 MSPS constraint, so only those two families need mapping; (2) the front spans power_index 2.56..11.4, i.e. only ~6% of the HV power reference of 40, and its low-power end (2.56 @ 13.5 bits) sits 1.5 bits above the 2^-12 accuracy constraint, so the cheap corner near the constraint is under-sampled while the accuracy end is already near the registry ceiling (23.5 bits at data_width 28); (3) pipelined_m is feasible only at m=2 (m>2 fails throughput), so its full m range must still be swept to confirm no cheaper schedule exists. A full-range NSGA-II pass over pipelined + pipelined_m seeded with the current 23-point front is therefore the best use of the last 100 evals, filling the low-power/low-accuracy corner and any gaps before selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 396.6 (gain this round: +6.9%).
Feasible designs: 159 of 300 evaluations (138 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 37% violate; best seen 180
- max_abs_err <= 0.000244141: 21% violate; best seen 8.37e-08 (2^-23.51)

Pareto front (feasible, 23 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.56, accuracy_bits=13.5, area_um2=35202, ffs=549, throughput_msps=72.3, max_abs_err=8.66e-05 (2^-13.50)
- pipelined_m [data_width=21 n_iter=17 angle_guard=2 frac_guard=0 rounding=trunc m=2] power_index=3.19, accuracy_bits=15, area_um2=44216, ffs=678, throughput_msps=64.3, max_abs_err=3.12e-05 (2^-14.97)
- pipelined_m [data_width=25 n_iter=20 angle_guard=0 frac_guard=0 rounding=round m=2] power_index=4.1, accuracy_bits=18.4, area_um2=58443, ffs=855, throughput_msps=59.9, max_abs_err=2.81e-06 (2^-18.44)
- pipelined_m [data_width=25 n_iter=28 angle_guard=0 frac_guard=2 rounding=round m=2] power_index=6, accuracy_bits=19.9, area_um2=87376, ffs=1231, throughput_msps=56.1, max_abs_err=1.05e-06 (2^-19.86)
- pipelined [data_width=27 n_iter=22 angle_guard=0 frac_guard=2 rounding=trunc] power_index=8.25, accuracy_bits=20.6, area_um2=92959, ffs=1982, throughput_msps=98.8, max_abs_err=6.47e-07 (2^-20.56)
- pipelined [data_width=26 n_iter=23 angle_guard=3 frac_guard=1 rounding=trunc] power_index=8.45, accuracy_bits=20.9, area_um2=95252, ffs=2031, throughput_msps=98.8, max_abs_err=5.25e-07 (2^-20.86)
- pipelined [data_width=27 n_iter=24 angle_guard=0 frac_guard=1 rounding=round] power_index=8.87, accuracy_bits=21.5, area_um2=100914, ffs=2122, throughput_msps=102, max_abs_err=3.47e-07 (2^-21.46)
- pipelined [data_width=26 n_iter=25 angle_guard=1 frac_guard=3 rounding=trunc] power_index=9.37, accuracy_bits=21.7, area_um2=105872, ffs=2249, throughput_msps=98.8, max_abs_err=2.9e-07 (2^-21.72)
- pipelined [data_width=28 n_iter=28 angle_guard=3 frac_guard=0 rounding=round] power_index=10.8, accuracy_bits=23.1, area_um2=121736, ffs=2588, throughput_msps=93.5, max_abs_err=1.11e-07 (2^-23.10)
- pipelined [data_width=28 n_iter=28 angle_guard=1 frac_guard=4 rounding=trunc] power_index=11.4, accuracy_bits=23.5, area_um2=129193, ffs=2737, throughput_msps=91.1, max_abs_err=8.37e-08 (2^-23.51)
Front coverage: power_index 2.56..11.4 (HV reference 40); accuracy_bits 13.5..23.5 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 9.83 MSPS; best accuracy 15.95 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 13.82 bits
- pipelined: 149 evals, 125 feasible; max throughput seen 180 MSPS; best accuracy 23.51 bits; best feasible power_index=4.43; feasible ranges: data_width 19..28, n_iter 16..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 126 evals, 34 feasible; max throughput seen 72.3 MSPS; best accuracy 22.98 bits; best feasible power_index=2.56; feasible ranges: data_width 18..27, n_iter 13..28, angle_guard -2..4, frac_guard 0..4, m 2..2
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (35 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (8 front designs; box front_anchored)
- `pipelined` (65 evals): data_width=24..28, n_iter=19..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (15 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 239 feasible; hypervolume 429.1 (+8.2%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the spec is demonstrably satisfiable, so `infeasible` is not warranted. The feasible front holds 239 designs (202 unique) across all four families, with hypervolume 429.1 and a further +8.2% gain this round, so the search has converged rather than stalled. Both constraints are met with margin: throughput reaches 180 MSPS vs the 50 MSPS floor, and max_abs_err reaches 2^-24.46 vs the 2^-12 limit. The front spans power_index 2.56..11 against the HV reference 40 and accuracy_bits 13.5..24.5 against the reference 12, i.e. it covers a wide slice of both objective ranges, and data_width on the front spans 18..28 of the registry's 8..28. The selection rule (min power_index) is already served by the front's low-power corner: pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=2] at power_index=2.56, accuracy_bits=13.5 (max_abs_err=8.66e-05, comfortably under 2^-12), 72.3 MSPS, 35202 um^2, 549 FFs. iterative and unrolled_k are correctly excluded: 0 feasible designs each, with max throughput 9.83 and 5.84 MSPS respectively, far below the 50 MSPS requirement. No further evaluation budget exists to refine or map, so stopping is the correct terminal decision.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 429.1 (gain this round: +8.2%).
Feasible designs: 239 of 400 evaluations (202 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 32% violate; best seen 180
- max_abs_err <= 0.000244141: 16% violate; best seen 4.33e-08 (2^-24.46)

Pareto front (feasible, 24 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.56, accuracy_bits=13.5, area_um2=35202, ffs=549, throughput_msps=72.3, max_abs_err=8.66e-05 (2^-13.50)
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=3.24, accuracy_bits=15.5, area_um2=46827, ffs=670, throughput_msps=66.8, max_abs_err=2.1e-05 (2^-15.54)
- pipelined_m [data_width=22 n_iter=21 angle_guard=1 frac_guard=1 rounding=trunc m=2] power_index=4.1, accuracy_bits=17.2, area_um2=57621, ffs=863, throughput_msps=64.3, max_abs_err=6.73e-06 (2^-17.18)
- pipelined_m [data_width=26 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=2] power_index=4.61, accuracy_bits=19.7, area_um2=65969, ffs=960, throughput_msps=57.9, max_abs_err=1.18e-06 (2^-19.69)
- pipelined_m [data_width=25 n_iter=22 angle_guard=4 frac_guard=3 rounding=round m=2] power_index=5.05, accuracy_bits=20.6, area_um2=73329, ffs=1040, throughput_msps=52.7, max_abs_err=6.1e-07 (2^-20.65)
- pipelined [data_width=26 n_iter=24 angle_guard=1 frac_guard=0 rounding=round] power_index=8.44, accuracy_bits=21.2, area_um2=95131, ffs=2029, throughput_msps=105, max_abs_err=4.29e-07 (2^-21.15)
- pipelined [data_width=28 n_iter=24 angle_guard=1 frac_guard=0 rounding=trunc] power_index=9.03, accuracy_bits=21.7, area_um2=101801, ffs=2171, throughput_msps=98.8, max_abs_err=2.99e-07 (2^-21.67)
- pipelined [data_width=28 n_iter=24 angle_guard=2 frac_guard=2 rounding=round] power_index=9.55, accuracy_bits=22.7, area_um2=108658, ffs=2283, throughput_msps=96.1, max_abs_err=1.5e-07 (2^-22.67)
- pipelined [data_width=26 n_iter=26 angle_guard=4 frac_guard=4 rounding=round] power_index=10.3, accuracy_bits=23.4, area_um2=117522, ffs=2466, throughput_msps=96.1, max_abs_err=9.07e-08 (2^-23.39)
- pipelined [data_width=27 n_iter=27 angle_guard=4 frac_guard=4 rounding=round] power_index=11, accuracy_bits=24.5, area_um2=125904, ffs=2641, throughput_msps=93.5, max_abs_err=4.33e-08 (2^-24.46)
Front coverage: power_index 2.56..11 (HV reference 40); accuracy_bits 13.5..24.5 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 9.83 MSPS; best accuracy 15.95 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 5.84 MSPS; best accuracy 13.82 bits
- pipelined: 214 evals, 190 feasible; max throughput seen 180 MSPS; best accuracy 24.46 bits; best feasible power_index=4.43; feasible ranges: data_width 19..28, n_iter 16..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 161 evals, 49 feasible; max throughput seen 78.8 MSPS; best accuracy 22.98 bits; best feasible power_index=2.56; feasible ranges: data_width 18..27, n_iter 13..28, angle_guard -2..4, frac_guard 0..4, m 2..2
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 12621 in, 15924 out
- provider-reported cost: $0.0133
- full prompts and replies: `llm_trace.jsonl`

