# DSE run: asic_power_50msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
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
`pipelined_m:data_width=17,n_iter=17,angle_guard=0,frac_guard=0,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 31770 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 8464 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 376 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 57 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 57 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 8 | exact: schedule |
| latency_ns | 140 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.98 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000244 (2^-12.00) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.98 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.38e-05 (2^-14.18) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.76 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 8 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 95.7 dBc, SNR 83.5 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=17,angle_guard=0,frac_guard=0,rounding=round,m=3` | 31770 | 376 | 57.0 | 8 | 1.98 | 0.000244 (2^-12.00) | 12.00 |
| 1 | `pipelined_m:data_width=17,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 31813 | 391 | 54.3 | 8 | 2.02 | 0.000188 (2^-12.38) | 12.38 |
| 2 | `pipelined_m:data_width=16,n_iter=17,angle_guard=2,frac_guard=1,rounding=round,m=3` | 33084 | 379 | 54.3 | 8 | 2.03 | 0.000177 (2^-12.47) | 12.47 |
| 3 | `pipelined_m:data_width=18,n_iter=17,angle_guard=0,frac_guard=0,rounding=round,m=3` | 33433 | 395 | 54.3 | 8 | 2.08 | 0.000114 (2^-13.10) | 13.10 |
| 4 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=0,rounding=trunc,m=3` | 33486 | 415 | 51.9 | 8 | 2.14 | 9.61e-05 (2^-13.35) | 13.35 |
| 5 | `pipelined_m:data_width=20,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=2` | 37332 | 580 | 69.4 | 10 | 2.71 | 7.97e-05 (2^-13.61) | 13.61 |
| 6 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=round,m=2` | 38259 | 578 | 69.4 | 10 | 2.73 | 7.76e-05 (2^-13.65) | 13.65 |
| 7 | `pipelined_m:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round,m=2` | 39344 | 568 | 69.4 | 10 | 2.74 | 5.17e-05 (2^-14.24) | 14.24 |
| 8 | `pipelined_m:data_width=20,n_iter=16,angle_guard=0,frac_guard=1,rounding=round,m=2` | 40135 | 582 | 69.4 | 10 | 2.8 | 5.03e-05 (2^-14.28) | 14.28 |
| 9 | `pipelined_m:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 42831 | 653 | 69.4 | 11 | 3.08 | 3.81e-05 (2^-14.68) | 14.68 |
| 10 | `pipelined_m:data_width=24,n_iter=16,angle_guard=-2,frac_guard=1,rounding=round,m=2` | 46093 | 669 | 59.9 | 10 | 3.22 | 3.37e-05 (2^-14.86) | 14.86 |
| 11 | `pipelined_m:data_width=20,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc,m=2` | 45899 | 672 | 66.8 | 11 | 3.22 | 2.18e-05 (2^-15.49) | 15.49 |
| 12 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=round,m=2` | 46378 | 668 | 66.8 | 11 | 3.22 | 1.89e-05 (2^-15.69) | 15.69 |
| 13 | `pipelined_m:data_width=22,n_iter=19,angle_guard=-1,frac_guard=2,rounding=trunc,m=2` | 52085 | 787 | 62.0 | 12 | 3.72 | 1.52e-05 (2^-16.01) | 16.01 |
| 14 | `pipelined_m:data_width=25,n_iter=18,angle_guard=-1,frac_guard=1,rounding=trunc,m=2` | 53100 | 782 | 57.9 | 11 | 3.74 | 8.85e-06 (2^-16.79) | 16.79 |
| 15 | `pipelined_m:data_width=23,n_iter=19,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 52894 | 802 | 62.0 | 12 | 3.79 | 7.89e-06 (2^-16.95) | 16.95 |
| 16 | `pipelined_m:data_width=23,n_iter=19,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 56198 | 847 | 59.9 | 12 | 4.01 | 4.97e-06 (2^-17.62) | 17.62 |
| 17 | `pipelined_m:data_width=23,n_iter=19,angle_guard=2,frac_guard=2,rounding=round,m=2` | 57417 | 849 | 59.9 | 12 | 4.05 | 4.81e-06 (2^-17.67) | 17.67 |
| 18 | `pipelined_m:data_width=25,n_iter=20,angle_guard=-1,frac_guard=3,rounding=trunc,m=2` | 61831 | 899 | 54.3 | 12 | 4.32 | 3.27e-06 (2^-18.22) | 18.22 |
| 19 | `pipelined_m:data_width=24,n_iter=21,angle_guard=4,frac_guard=0,rounding=trunc,m=2` | 63010 | 945 | 54.3 | 13 | 4.48 | 3.19e-06 (2^-18.26) | 18.26 |
| 20 | `pipelined_m:data_width=27,n_iter=20,angle_guard=0,frac_guard=2,rounding=round,m=2` | 66904 | 956 | 52.7 | 12 | 4.63 | 2.05e-06 (2^-18.90) | 18.90 |
| 21 | `pipelined_m:data_width=24,n_iter=22,angle_guard=4,frac_guard=3,rounding=trunc,m=2` | 69634 | 1004 | 54.3 | 13 | 4.84 | 9.38e-07 (2^-20.02) | 20.02 |
| 22 | `pipelined_m:data_width=25,n_iter=22,angle_guard=2,frac_guard=3,rounding=trunc,m=2` | 70455 | 1017 | 54.3 | 13 | 4.9 | 7.28e-07 (2^-20.39) | 20.39 |
| 23 | `pipelined_m:data_width=24,n_iter=28,angle_guard=3,frac_guard=3,rounding=trunc,m=2` | 87958 | 1253 | 56.1 | 16 | 6.07 | 6.59e-07 (2^-20.53) | 20.53 |
| 24 | `pipelined_m:data_width=24,n_iter=28,angle_guard=4,frac_guard=3,rounding=trunc,m=2` | 88954 | 1266 | 54.3 | 16 | 6.14 | 5.9e-07 (2^-20.69) | 20.69 |
| 25 | `pipelined_m:data_width=24,n_iter=28,angle_guard=4,frac_guard=3,rounding=round,m=2` | 90224 | 1268 | 54.3 | 16 | 6.18 | 3.54e-07 (2^-21.43) | 21.43 |
| 26 | `pipelined_m:data_width=28,n_iter=29,angle_guard=1,frac_guard=1,rounding=round,m=2` | 100096 | 1441 | 52.7 | 17 | 6.95 | 8.86e-08 (2^-23.43) | 23.43 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 50 MSPS throughput constraint forces 1 result/cycle (pipelined or pipelined_m) or a high-Fmax unrolled_k; the iterative family (1 result every N+3 cycles) cannot plausibly reach 50 MSPS and is excluded. The accuracy constraint (max_abs_err <= 2^-12) is met by modest n_iter (~12-14) with rounding, so I bound data_width 14-20 and n_iter 12-18 to focus the search on the feasible region where the power/accuracy trade-off actually lives, rather than wasting budget on over-accurate or infeasible corners. I weight pipelined (0.5) and pipelined_m (0.3) as the primary throughput-capable families, and keep unrolled_k (0.2) as a power challenger. angle_guard 0-2 and frac_guard 0-2 keep the datapath narrow to minimise power while preserving accuracy headroom; rounding is left to the optimizer to find the trunc/round boundary. This spreads the 400-eval budget across the families most likely to populate the Pareto front.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so throughput = Fmax. To hit 50 MSPS the critical path must be short, which pushes toward moderate n_iter and small guards; this is the natural home of the low-power corner of the front.
- `pipelined_m` (30 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Registering every m stages shortens the per-stage critical path vs full pipelined (higher Fmax, easier to clear 50 MSPS) at the cost of fewer FFs and lower power; m=2..4 covers the sweet spot between latency and power.
- `unrolled_k` (20 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* k chained rotations/cycle can reach 50 MSPS with fewer FFs than pipelined (lower power) but a longer combinational path; worth probing to see if it undercuts pipelined_m on power while still meeting throughput.

**Result (code):** 100 evaluations this round, 100 total; 55 feasible; hypervolume 137.5 (n/a).

**LLM decision:** `refine` — unrolled_k is infeasible for throughput (max 8.53 MSPS << 50) and iterative is structurally similar (1 result per N+3 cycles), so neither can meet the 50 MSPS constraint; both are excluded. The front is entirely pipelined_m except for pipelined points that are dominated in power. The current front spans power_index 2.02..3.22 and accuracy_bits 12.4..15.7, but the low-power end (near 2.02) is sparse and the accuracy range above ~14.3 bits is only reached by higher-power designs. Narrowing to the proven feasible ranges (data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2, m 2..3) concentrates the 100-eval budget on the region that actually produces feasible, non-dominated points, letting NSGA-II refine the trade-off curve and push the minimum power_index lower while maintaining throughput >= 50 MSPS and max_abs_err <= 2^-12.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 137.5 (gain this round: n/a (first round)).
Feasible designs: 55 of 100 evaluations (41 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 28% violate; best seen 163
- max_abs_err <= 0.000244141: 30% violate; best seen 1.89e-05 (2^-15.69)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=3] power_index=2.02, accuracy_bits=12.4, area_um2=31813, ffs=391, throughput_msps=54.3, max_abs_err=0.000188 (2^-12.38)
- pipelined_m [data_width=16 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.03, accuracy_bits=12.5, area_um2=33084, ffs=379, throughput_msps=54.3, max_abs_err=0.000177 (2^-12.47)
- pipelined_m [data_width=17 n_iter=18 angle_guard=1 frac_guard=2 rounding=round m=3] power_index=2.21, accuracy_bits=13.1, area_um2=36879, ffs=403, throughput_msps=51.9, max_abs_err=0.000112 (2^-13.13)
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=2] power_index=2.71, accuracy_bits=13.6, area_um2=37332, ffs=580, throughput_msps=69.4, max_abs_err=7.97e-05 (2^-13.61)
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=1 rounding=round m=2] power_index=2.75, accuracy_bits=13.6, area_um2=38397, ffs=582, throughput_msps=69.4, max_abs_err=7.85e-05 (2^-13.64)
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc m=2] power_index=2.76, accuracy_bits=14.1, area_um2=39069, ffs=580, throughput_msps=69.4, max_abs_err=5.62e-05 (2^-14.12)
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=2] power_index=2.8, accuracy_bits=14.3, area_um2=40135, ffs=582, throughput_msps=69.4, max_abs_err=5.03e-05 (2^-14.28)
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=3.08, accuracy_bits=14.7, area_um2=42831, ffs=653, throughput_msps=69.4, max_abs_err=3.81e-05 (2^-14.68)
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=3.22, accuracy_bits=15.7, area_um2=46378, ffs=668, throughput_msps=66.8, max_abs_err=1.89e-05 (2^-15.69)
Front coverage: power_index 2.02..3.22 (HV reference 40); accuracy_bits 12.4..15.7 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.53 MSPS; best accuracy 15.40 bits
- pipelined: 50 evals, 41 feasible; max throughput seen 163 MSPS; best accuracy 15.38 bits; best feasible power_index=3.62; feasible ranges: data_width 17..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 30 evals, 14 feasible; max throughput seen 82.5 MSPS; best accuracy 15.69 bits; best feasible power_index=2.02; feasible ranges: data_width 16..20, n_iter 15..18, angle_guard 0..2, frac_guard 0..2, m 2..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *unrolled_k is infeasible for throughput (max 8.53 MSPS << 50) and iterative is structurally similar (1 result per N+3 cycles), so neither can meet the 50 MSPS constraint; both are excluded. The front is entirely pipelined_m except for pipelined points that are dominated in power. The current front spans power_index 2.02..3.22 and accuracy_bits 12.4..15.7, but the low-power end (near 2.02) is sparse and the accuracy range above ~14.3 bits is only reached by higher-power designs. Narrowing to the proven feasible ranges (data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2, m 2..3) concentrates the 100-eval budget on the region that actually produces feasible, non-dominated points, letting NSGA-II refine the trade-off curve and push the minimum power_index lower while maintaining throughput >= 50 MSPS and max_abs_err <= 2^-12.*)
- `pipelined_m` (50 evals): data_width=16..20, n_iter=14..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..3. *Why:* pipelined_m dominates the front (best power 2.02 vs 3.62 for pipelined) and has the lowest power at every accuracy point shown; focus budget here to push the low-power end and fill the accuracy gap.
- `pipelined` (50 evals): data_width=16..20, n_iter=14..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined is the only other family with feasible points; keep it in the search to confirm whether any pipelined point beats pipelined_m on the power/accuracy trade-off, but with a smaller share since its best feasible power (3.62) is already well above pipelined_m's best (2.02).

**Result (code):** 100 evaluations this round, 200 total; 131 feasible; hypervolume 137.6 (+0.1%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs, which achieve the lowest power index (1.98) and satisfy the 50 MSPS throughput constraint. The `unrolled_k` family is infeasible for this spec (max throughput 8.53 MSPS << 50 MSPS) and should be excluded. The `iterative` family is also infeasible for throughput (1 result per N+3 cycles, max ~10-20 MSPS at reasonable Fmax), so it should not be explored. The `pipelined` family is feasible but has a higher minimum power index (3.59) compared to `pipelined_m` (1.98), suggesting `pipelined_m` is the superior architecture for this power-constrained spec. The current front covers accuracy_bits 12..15.7, but the hypervolume gain in Round 2 was only +0.1%, indicating diminishing returns from broad exploration. The feasible region for `pipelined_m` is well-defined: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2, m 2..3. To maximize hypervolume, we should focus the remaining budget on refining the `pipelined_m` front within these tight ranges, specifically targeting the trade-off between power and accuracy. The selection rule is min power_index, so the corner at low power (high accuracy is secondary for selection but important for HV) is critical. The current best power design (1.98) has accuracy_bits=12, which is just at the constraint boundary. We need to ensure the front covers the full range of achievable accuracy for the lowest power designs. Refining `pipelined_m` in its feasible range will likely yield a denser and more accurate Pareto front, improving hypervolume.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.06% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 137.6 (gain this round: +0.1%).
Feasible designs: 131 of 200 evaluations (95 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 20% violate; best seen 163
- max_abs_err <= 0.000244141: 20% violate; best seen 1.89e-05 (2^-15.69)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=3] power_index=1.98, accuracy_bits=12, area_um2=31770, ffs=376, throughput_msps=57, max_abs_err=0.000244 (2^-12.00)
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=3] power_index=2.02, accuracy_bits=12.4, area_um2=31813, ffs=391, throughput_msps=54.3, max_abs_err=0.000188 (2^-12.38)
- pipelined_m [data_width=18 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=3] power_index=2.08, accuracy_bits=13.1, area_um2=33433, ffs=395, throughput_msps=54.3, max_abs_err=0.000114 (2^-13.10)
- pipelined_m [data_width=17 n_iter=17 angle_guard=1 frac_guard=2 rounding=round m=3] power_index=2.16, accuracy_bits=13.1, area_um2=35294, ffs=403, throughput_msps=51.9, max_abs_err=0.000112 (2^-13.13)
- pipelined_m [data_width=17 n_iter=18 angle_guard=1 frac_guard=2 rounding=round m=3] power_index=2.21, accuracy_bits=13.1, area_um2=36879, ffs=403, throughput_msps=51.9, max_abs_err=0.000112 (2^-13.13)
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=2.73, accuracy_bits=13.7, area_um2=38259, ffs=578, throughput_msps=69.4, max_abs_err=7.76e-05 (2^-13.65)
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc m=2] power_index=2.76, accuracy_bits=14.1, area_um2=39069, ffs=580, throughput_msps=69.4, max_abs_err=5.62e-05 (2^-14.12)
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=2] power_index=2.8, accuracy_bits=14.3, area_um2=40135, ffs=582, throughput_msps=69.4, max_abs_err=5.03e-05 (2^-14.28)
- pipelined_m [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=3.22, accuracy_bits=15.5, area_um2=45899, ffs=672, throughput_msps=66.8, max_abs_err=2.18e-05 (2^-15.49)
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=3.22, accuracy_bits=15.7, area_um2=46378, ffs=668, throughput_msps=66.8, max_abs_err=1.89e-05 (2^-15.69)
Front coverage: power_index 1.98..3.22 (HV reference 40); accuracy_bits 12..15.7 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.53 MSPS; best accuracy 15.40 bits
- pipelined: 100 evals, 84 feasible; max throughput seen 163 MSPS; best accuracy 15.38 bits; best feasible power_index=3.59; feasible ranges: data_width 17..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 80 evals, 47 feasible; max throughput seen 82.5 MSPS; best accuracy 15.69 bits; best feasible power_index=1.98; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (200 evals): data_width=15..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (13 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 205 feasible; hypervolume 406.6 (+195.5%).

**No LLM call** (code's front-mapping round): The current Pareto front is dominated by `pipelined_m` designs, which achieve the lowest power index (1.98) and satisfy the 50 MSPS throughput constraint. The `unrolled_k` family is infeasible for this spec (max throughput 8.53 MSPS << 50 MSPS) and should be excluded. The `iterative` family is also infeasible for throughput (1 result per N+3 cycles, max ~10-20 MSPS at reasonable Fmax), so it should not be explored. The `pipelined` family is feasible but has a higher minimum power index (3.59) compared to `pipelined_m` (1.98), suggesting `pipelined_m` is the superior architecture for this power-constrained spec. The current front covers accuracy_bits 12..15.7, but the hypervolume gain in Round 2 was only +0.1%, indicating diminishing returns from broad exploration. The feasible region for `pipelined_m` is well-defined: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2, m 2..3. To maximize hypervolume, we should focus the remaining budget on refining the `pipelined_m` front within these tight ranges, specifically targeting the trade-off between power and accuracy. The selection rule is min power_index, so the corner at low power (high accuracy is secondary for selection but important for HV) is critical. The current best power design (1.98) has accuracy_bits=12, which is just at the constraint boundary. We need to ensure the front covers the full range of achievable accuracy for the lowest power designs. Refining `pipelined_m` in its feasible range will likely yield a denser and more accurate Pareto front, improving hypervolume.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 406.6 (gain this round: +195.5%).
Feasible designs: 205 of 400 evaluations (158 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 40% violate; best seen 163
- max_abs_err <= 0.000244141: 15% violate; best seen 5.73e-08 (2^-24.06)

Pareto front (feasible, 27 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=3] power_index=1.98, accuracy_bits=12, area_um2=31770, ffs=376, throughput_msps=57, max_abs_err=0.000244 (2^-12.00)
- pipelined_m [data_width=18 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=3] power_index=2.08, accuracy_bits=13.1, area_um2=33433, ffs=395, throughput_msps=54.3, max_abs_err=0.000114 (2^-13.10)
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=2.73, accuracy_bits=13.7, area_um2=38259, ffs=578, throughput_msps=69.4, max_abs_err=7.76e-05 (2^-13.65)
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=3.08, accuracy_bits=14.7, area_um2=42831, ffs=653, throughput_msps=69.4, max_abs_err=3.81e-05 (2^-14.68)
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=3.22, accuracy_bits=15.7, area_um2=46378, ffs=668, throughput_msps=66.8, max_abs_err=1.89e-05 (2^-15.69)
- pipelined_m [data_width=25 n_iter=18 angle_guard=-1 frac_guard=1 rounding=trunc m=2] power_index=3.74, accuracy_bits=16.8, area_um2=53100, ffs=782, throughput_msps=57.9, max_abs_err=8.85e-06 (2^-16.79)
- pipelined_m [data_width=23 n_iter=19 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=4.05, accuracy_bits=17.7, area_um2=57417, ffs=849, throughput_msps=59.9, max_abs_err=4.81e-06 (2^-17.67)
- pipelined_m [data_width=27 n_iter=20 angle_guard=0 frac_guard=2 rounding=round m=2] power_index=4.63, accuracy_bits=18.9, area_um2=66904, ffs=956, throughput_msps=52.7, max_abs_err=2.05e-06 (2^-18.90)
- pipelined_m [data_width=24 n_iter=28 angle_guard=3 frac_guard=3 rounding=trunc m=2] power_index=6.07, accuracy_bits=20.5, area_um2=87958, ffs=1253, throughput_msps=56.1, max_abs_err=6.59e-07 (2^-20.53)
- pipelined_m [data_width=28 n_iter=29 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=6.95, accuracy_bits=23.4, area_um2=100096, ffs=1441, throughput_msps=52.7, max_abs_err=8.86e-08 (2^-23.43)
Front coverage: power_index 1.98..6.95 (HV reference 40); accuracy_bits 12..23.4 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.53 MSPS; best accuracy 15.40 bits
- pipelined: 100 evals, 84 feasible; max throughput seen 163 MSPS; best accuracy 15.38 bits; best feasible power_index=3.59; feasible ranges: data_width 17..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 280 evals, 121 feasible; max throughput seen 86.6 MSPS; best accuracy 24.06 bits; best feasible power_index=1.98; feasible ranges: data_width 15..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7589 in, 3147 out
- provider-reported cost: $0.0074
- full prompts and replies: `llm_trace.jsonl`

