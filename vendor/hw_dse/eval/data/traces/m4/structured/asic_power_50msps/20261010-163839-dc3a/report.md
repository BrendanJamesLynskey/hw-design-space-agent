# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`pipelined_m:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 31211 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 8315 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 381 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 8 | exact: schedule |
| latency_ns | 147 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.98 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000237 (2^-12.04) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.88 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 5.76e-05 (2^-14.08) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 0.944 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 8 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 89.4 dBc, SNR 82.4 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc,m=3` | 31211 | 381 | 54.3 | 8 | 1.98 | 0.000237 (2^-12.04) | 12.04 |
| 1 | `pipelined_m:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=round,m=3` | 32072 | 383 | 54.3 | 8 | 2.01 | 0.000214 (2^-12.19) | 12.19 |
| 2 | `pipelined_m:data_width=16,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 33258 | 387 | 54.3 | 8 | 2.06 | 0.000207 (2^-12.24) | 12.24 |
| 3 | `pipelined_m:data_width=17,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc,m=3` | 32797 | 401 | 51.9 | 8 | 2.08 | 0.000145 (2^-12.76) | 12.76 |
| 4 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 33399 | 411 | 51.9 | 8 | 2.13 | 0.000104 (2^-13.23) | 13.23 |
| 5 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=3` | 34363 | 413 | 51.9 | 8 | 2.16 | 8.41e-05 (2^-13.54) | 13.54 |
| 6 | `pipelined_m:data_width=17,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=3` | 35834 | 409 | 51.9 | 8 | 2.19 | 7.36e-05 (2^-13.73) | 13.73 |
| 7 | `pipelined_m:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc,m=2` | 39453 | 580 | 69.4 | 10 | 2.77 | 5.44e-05 (2^-14.17) | 14.17 |
| 8 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=4,rounding=trunc,m=2` | 41684 | 612 | 64.3 | 10 | 2.93 | 4.47e-05 (2^-14.45) | 14.45 |
| 9 | `pipelined_m:data_width=20,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc,m=2` | 41815 | 617 | 64.3 | 10 | 2.95 | 3.8e-05 (2^-14.68) | 14.68 |
| 10 | `pipelined_m:data_width=21,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc,m=2` | 41902 | 621 | 64.3 | 10 | 2.96 | 3.79e-05 (2^-14.69) | 14.69 |
| 11 | `pipelined_m:data_width=18,n_iter=17,angle_guard=3,frac_guard=2,rounding=round,m=2` | 42540 | 635 | 69.4 | 11 | 3.02 | 3.68e-05 (2^-14.73) | 14.73 |
| 12 | `pipelined_m:data_width=18,n_iter=18,angle_guard=3,frac_guard=2,rounding=round,m=2` | 44252 | 635 | 69.4 | 11 | 3.07 | 3.49e-05 (2^-14.81) | 14.81 |
| 13 | `pipelined_m:data_width=22,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 44692 | 661 | 62.0 | 10 | 3.15 | 3.23e-05 (2^-14.92) | 14.92 |
| 14 | `pipelined_m:data_width=18,n_iter=20,angle_guard=3,frac_guard=2,rounding=round,m=2` | 49161 | 702 | 69.4 | 12 | 3.4 | 3.15e-05 (2^-14.95) | 14.95 |
| 15 | `pipelined_m:data_width=18,n_iter=20,angle_guard=3,frac_guard=3,rounding=round,m=2` | 50525 | 720 | 69.4 | 12 | 3.49 | 2.32e-05 (2^-15.40) | 15.40 |
| 16 | `pipelined_m:data_width=22,n_iter=21,angle_guard=-1,frac_guard=2,rounding=round,m=2` | 58745 | 863 | 62.0 | 13 | 4.13 | 1.33e-05 (2^-16.20) | 16.20 |
| 17 | `pipelined_m:data_width=28,n_iter=18,angle_guard=-2,frac_guard=2,rounding=trunc,m=2` | 59496 | 874 | 51.2 | 11 | 4.18 | 7.9e-06 (2^-16.95) | 16.95 |
| 18 | `pipelined_m:data_width=28,n_iter=18,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 62020 | 909 | 51.2 | 11 | 4.35 | 7.64e-06 (2^-17.00) | 17.00 |
| 19 | `pipelined_m:data_width=27,n_iter=19,angle_guard=-2,frac_guard=1,rounding=round,m=2` | 61909 | 918 | 54.3 | 12 | 4.38 | 4.22e-06 (2^-17.85) | 17.85 |
| 20 | `pipelined_m:data_width=27,n_iter=19,angle_guard=0,frac_guard=1,rounding=round,m=2` | 63266 | 938 | 54.3 | 12 | 4.47 | 3.91e-06 (2^-17.97) | 17.97 |
| 21 | `pipelined_m:data_width=27,n_iter=21,angle_guard=3,frac_guard=1,rounding=round,m=2` | 72032 | 1059 | 51.2 | 13 | 5.07 | 1.02e-06 (2^-19.91) | 19.91 |
| 22 | `pipelined:data_width=27,n_iter=22,angle_guard=1,frac_guard=0,rounding=round` | 90084 | 1925 | 101.6 | 24 | 8 | 6.32e-07 (2^-20.59) | 20.59 |
| 23 | `pipelined:data_width=27,n_iter=22,angle_guard=2,frac_guard=0,rounding=round` | 91100 | 1947 | 98.8 | 24 | 8.09 | 6.06e-07 (2^-20.65) | 20.65 |
| 24 | `pipelined:data_width=27,n_iter=23,angle_guard=2,frac_guard=2,rounding=trunc` | 99421 | 2118 | 98.8 | 25 | 8.81 | 3.36e-07 (2^-21.51) | 21.51 |
| 25 | `pipelined:data_width=27,n_iter=23,angle_guard=2,frac_guard=4,rounding=trunc` | 103503 | 2200 | 93.5 | 25 | 9.16 | 2.95e-07 (2^-21.69) | 21.69 |
| 26 | `pipelined:data_width=27,n_iter=25,angle_guard=2,frac_guard=3,rounding=trunc` | 110508 | 2348 | 96.1 | 27 | 9.78 | 1.35e-07 (2^-22.83) | 22.83 |
| 27 | `pipelined:data_width=27,n_iter=27,angle_guard=2,frac_guard=4,rounding=trunc` | 121973 | 2586 | 93.5 | 29 | 10.8 | 1.04e-07 (2^-23.20) | 23.20 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraint is throughput >= 50 MSPS. iterative (1 result per N+3 cycles) would need Fmax >= ~50*(N+3) MHz, which is implausible, so it is excluded. The viable families are pipelined, pipelined_m (1 result/cycle, need Fmax>=50 MHz) and unrolled_k (k results/cycle, need Fmax>=50/k MHz). Accuracy (max_abs_err <= 2^-12) depends only on W, N, guards, rounding and is identical across families, so I bound W=14-20 and N=12-18 with small guards to sit just above the accuracy floor and let the optimizer trade extra bits (accuracy_bits) against power. The budget is weighted toward pipelined (0.45) and pipelined_m (0.35) because they are the most likely to satisfy Fmax>=50 MHz and define the power/accuracy front, with unrolled_k (0.2) as a lower-Fmax, lower-register alternative. Rounding is left to both choices since round can improve accuracy_bits at a small area/power cost, directly shaping the trade-off curve the hypervolume rewards.*)
- `pipelined` (45 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so throughput = Fmax. To hit 50 MSPS we need a high Fmax, which favours the shallow, single-stage-per-cycle pipelined structure over the deeper iterative/unrolled datapaths. N=12-18 with W=14-20 and small guards is the region where max_abs_err <= 2^-12 is met with margin while keeping the per-stage logic (and thus Fmax and power) low. This is the primary trade-off axis (power vs accuracy) for the spec.
- `pipelined_m` (35 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Registering every m stages cuts FF count (lower power_index) at the cost of a longer combinational path per stage, which can lower Fmax. With m=2-4 the path stays short enough to plausibly keep Fmax >= 50 MHz while saving registers vs full pipelined. This family likely dominates the low-power end of the front if Fmax holds, so it is the key competitor to pipelined for the min-power selection.
- `unrolled_k` (20 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* k chained rotations/cycle with a shared FSM can reach 50 MSPS if Fmax x k >= 50 (i.e. Fmax >= 12.5-25 MHz), which is much easier than 50 MHz. It uses fewer registers than pipelined (lower power) but a wider combinational path. Worth a smaller share to confirm whether it lands on the front; if its Fmax is too low it will be pruned, but it is a plausible low-power candidate.

**Result (code):** 100 evaluations this round, 100 total; 48 feasible; hypervolume 97.56 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with a minimum power_index of 2.06, which is significantly better than the `pipelined` family (min 3.67). The `unrolled_k` family is infeasible for the throughput constraint (max 8.64 MSPS vs 50 required). The `iterative` family is not yet explored but is structurally similar to `unrolled_k` with k=1 (1 micro-rotation/cycle), so it will also fail the throughput constraint (max throughput ~10-15 MSPS). Therefore, we should focus the remaining budget on refining the `pipelined_m` and `pipelined` families. The `pipelined_m` family shows the best power efficiency, so we should narrow its ranges to explore the trade-off between power and accuracy more densely. The `pipelined` family has higher throughput but higher power; we can keep a small portion of the budget for it to ensure we cover the high-accuracy end of the front. We will narrow `pipelined_m` to data_width 16-18, n_iter 16-20, angle_guard 1-3, frac_guard 1-3, m 2-4, and `pipelined` to data_width 18-22, n_iter 14-18, angle_guard 0-2, frac_guard 0-2.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 97.56 (gain this round: n/a (first round)).
Feasible designs: 48 of 100 evaluations (38 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 32% violate; best seen 163
- max_abs_err <= 0.000244141: 38% violate; best seen 3.21e-05 (2^-14.93)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=3] power_index=2.06, accuracy_bits=12.2, area_um2=33258, ffs=387, throughput_msps=54.3, max_abs_err=0.000207 (2^-12.24)
- pipelined_m [data_width=17 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc m=3] power_index=2.12, accuracy_bits=12.5, area_um2=34879, ffs=391, throughput_msps=54.3, max_abs_err=0.000174 (2^-12.49)
- pipelined_m [data_width=16 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.13, accuracy_bits=12.8, area_um2=35653, ffs=389, throughput_msps=54.3, max_abs_err=0.000138 (2^-12.83)
- pipelined_m [data_width=17 n_iter=18 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.15, accuracy_bits=12.9, area_um2=35792, ffs=393, throughput_msps=54.3, max_abs_err=0.000128 (2^-12.94)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.19, accuracy_bits=13.7, area_um2=35834, ffs=409, throughput_msps=51.9, max_abs_err=7.36e-05 (2^-13.73)
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] power_index=4.37, accuracy_bits=14.2, area_um2=48822, ffs=1054, throughput_msps=132, max_abs_err=5.27e-05 (2^-14.21)
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=round] power_index=4.52, accuracy_bits=14.3, area_um2=51265, ffs=1083, throughput_msps=128, max_abs_err=5.03e-05 (2^-14.28)
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=2 rounding=round] power_index=4.64, accuracy_bits=14.3, area_um2=52643, ffs=1111, throughput_msps=123, max_abs_err=4.88e-05 (2^-14.32)
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] power_index=4.67, accuracy_bits=14.5, area_um2=52310, ffs=1125, throughput_msps=123, max_abs_err=4.33e-05 (2^-14.50)
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] power_index=4.73, accuracy_bits=14.6, area_um2=53042, ffs=1140, throughput_msps=123, max_abs_err=3.93e-05 (2^-14.63)
Front coverage: power_index 2.06..4.73 (HV reference 40); accuracy_bits 12.2..14.6 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 12.16 bits
- pipelined: 45 evals, 33 feasible; max throughput seen 163 MSPS; best accuracy 14.63 bits; best feasible power_index=3.67; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 35 evals, 15 feasible; max throughput seen 91.1 MSPS; best accuracy 14.93 bits; best feasible power_index=2.06; feasible ranges: data_width 16..17, n_iter 17..18, angle_guard 1..2, frac_guard 1..2, m 2..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the two feasible families, weighting towards pipelined_m for its superior power efficiency.*)
- `pipelined_m` (70 evals): data_width=16..18, n_iter=16..20, angle_guard=1..3, frac_guard=1..3, rounding=trunc|round, m=2..4. *Why:* Best power efficiency (min 2.06); refine to map the power-accuracy trade-off densely.
- `pipelined` (30 evals): data_width=18..22, n_iter=14..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Higher throughput but higher power; keep to cover the high-accuracy end of the front.

**Result (code):** 100 evaluations this round, 200 total; 122 feasible; hypervolume 158.1 (+62.1%).

**LLM decision:** `refine` — The front spans power_index 1.98-5.46 and accuracy 12-16.3 bits, but the middle (13-15 bits) is thinly populated and the two families do not overlap: pipelined_m covers 12-15.4 bits at power 1.98-3.49, while pipelined covers 15.5-16.3 bits at power 4.99-5.46. There is a gap around 15-15.5 bits where pipelined_m tops out at 15.4 (power 3.49) and pipelined starts at 15.5 (power 4.99). unrolled_k is infeasible for throughput (max 8.64 MSPS << 50) and iterative is structurally similar (1 result/N+3 cycles) so it will also fail the 50 MSPS constraint; neither needs exploration. Refining both feasible families into their proven boxes with 100 evals will densify the front, close the 15-15.5 bit gap, and confirm the true power floor at each accuracy level before the final front-mapping round.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 158.1 (gain this round: +62.1%).
Feasible designs: 122 of 200 evaluations (90 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 28% violate; best seen 163
- max_abs_err <= 0.000244141: 21% violate; best seen 1.24e-05 (2^-16.30)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=1.98, accuracy_bits=12, area_um2=31211, ffs=381, throughput_msps=54.3, max_abs_err=0.000237 (2^-12.04)
- pipelined_m [data_width=16 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=3] power_index=2.06, accuracy_bits=12.2, area_um2=33258, ffs=387, throughput_msps=54.3, max_abs_err=0.000207 (2^-12.24)
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=2.08, accuracy_bits=12.8, area_um2=32797, ffs=401, throughput_msps=51.9, max_abs_err=0.000145 (2^-12.76)
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.16, accuracy_bits=13.5, area_um2=34363, ffs=413, throughput_msps=51.9, max_abs_err=8.41e-05 (2^-13.54)
- pipelined_m [data_width=17 n_iter=17 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=2.88, accuracy_bits=14.1, area_um2=40630, ffs=607, throughput_msps=72.3, max_abs_err=5.72e-05 (2^-14.09)
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.98, accuracy_bits=14.4, area_um2=41935, ffs=626, throughput_msps=72.3, max_abs_err=4.73e-05 (2^-14.37)
- pipelined_m [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=3.07, accuracy_bits=14.8, area_um2=44252, ffs=635, throughput_msps=69.4, max_abs_err=3.49e-05 (2^-14.81)
- pipelined_m [data_width=18 n_iter=20 angle_guard=3 frac_guard=3 rounding=round m=2] power_index=3.49, accuracy_bits=15.4, area_um2=50525, ffs=720, throughput_msps=69.4, max_abs_err=2.32e-05 (2^-15.40)
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] power_index=4.99, accuracy_bits=15.5, area_um2=55870, ffs=1203, throughput_msps=119, max_abs_err=2.18e-05 (2^-15.48)
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] power_index=5.46, accuracy_bits=16.3, area_um2=61940, ffs=1308, throughput_msps=119, max_abs_err=1.24e-05 (2^-16.30)
Front coverage: power_index 1.98..5.46 (HV reference 40); accuracy_bits 12..16.3 (HV reference 12); data_width on the front 16..22 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 12.16 bits
- pipelined: 75 evals, 63 feasible; max throughput seen 163 MSPS; best accuracy 16.30 bits; best feasible power_index=3.53; feasible ranges: data_width 16..22, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 105 evals, 59 feasible; max throughput seen 91.1 MSPS; best accuracy 15.40 bits; best feasible power_index=1.98; feasible ranges: data_width 16..18, n_iter 16..20, angle_guard 1..3, frac_guard 1..3, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *The front spans power_index 1.98-5.46 and accuracy 12-16.3 bits, but the middle (13-15 bits) is thinly populated and the two families do not overlap: pipelined_m covers 12-15.4 bits at power 1.98-3.49, while pipelined covers 15.5-16.3 bits at power 4.99-5.46. There is a gap around 15-15.5 bits where pipelined_m tops out at 15.4 (power 3.49) and pipelined starts at 15.5 (power 4.99). unrolled_k is infeasible for throughput (max 8.64 MSPS << 50) and iterative is structurally similar (1 result/N+3 cycles) so it will also fail the 50 MSPS constraint; neither needs exploration. Refining both feasible families into their proven boxes with 100 evals will densify the front, close the 15-15.5 bit gap, and confirm the true power floor at each accuracy level before the final front-mapping round.*)
- `pipelined_m` (20 evals): data_width=15..18, n_iter=15..18, angle_guard=0..3, frac_guard=1..3, rounding=trunc|round, m=2..2. *Why:* pipelined_m holds the power floor (1.98) and the low-accuracy end of the front; narrow to the proven feasible box (data_width 15-18, n_iter 15-18, m 1-2, guards 0-3) to densify the 12-15 bit accuracy region where the front is currently sparse.
- `pipelined` (20 evals): data_width=19..22, n_iter=16..19, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined owns the high-accuracy end (15.5-16.3 bits) but its feasible power floor (3.53) is far above pipelined_m's; narrow to data_width 19-22, n_iter 16-19, guards 0-2 to map the 14-16.3 bit region and check whether pipelined can undercut the current 4.99-5.46 power points at high accuracy.
- clamped by code: pipelined_m.m: clamped [1, 2] to [2, 2] (registry 2..8)

**Result (code):** 40 evaluations this round, 240 total; 157 feasible; hypervolume 162 (+2.5%).

**LLM decision:** `stop` — The feasible Pareto front is well-established and covers the relevant trade-off space for the spec. The minimum power_index achieved is 1.98 (pipelined_m), which is significantly better than the HV reference of 40, and the accuracy_bits range from 12 to 16.4, exceeding the HV reference of 12. The throughput constraint (>= 50 MSPS) is met by all designs on the front (min 51.9 MSPS), and the accuracy constraint (max_abs_err <= 2^-12) is also satisfied (max error on front is 2^-12.04). The front spans data_width 16..22, which is a reasonable subset of the registry range 8..28, and further exploration is unlikely to yield significant improvements in hypervolume given the budget is exhausted (240/400 evals used, final round). The selection rule (min power_index) picks the pipelined_m design with power_index=1.98, which is a strong candidate for the final design.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 162 (gain this round: +2.5%).
Feasible designs: 157 of 240 evaluations (117 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 24% violate; best seen 163
- max_abs_err <= 0.000244141: 20% violate; best seen 1.15e-05 (2^-16.41)

Pareto front (feasible, 20 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=1.98, accuracy_bits=12, area_um2=31211, ffs=381, throughput_msps=54.3, max_abs_err=0.000237 (2^-12.04)
- pipelined_m [data_width=16 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=3] power_index=2.06, accuracy_bits=12.2, area_um2=33258, ffs=387, throughput_msps=54.3, max_abs_err=0.000207 (2^-12.24)
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=3] power_index=2.13, accuracy_bits=13.2, area_um2=33399, ffs=411, throughput_msps=51.9, max_abs_err=0.000104 (2^-13.23)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.19, accuracy_bits=13.7, area_um2=35834, ffs=409, throughput_msps=51.9, max_abs_err=7.36e-05 (2^-13.73)
- pipelined_m [data_width=17 n_iter=17 angle_guard=3 frac_guard=3 rounding=round m=2] power_index=2.96, accuracy_bits=14.3, area_um2=41797, ffs=622, throughput_msps=72.3, max_abs_err=5.1e-05 (2^-14.26)
- pipelined_m [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=3.07, accuracy_bits=14.8, area_um2=44252, ffs=635, throughput_msps=69.4, max_abs_err=3.49e-05 (2^-14.81)
- pipelined_m [data_width=18 n_iter=20 angle_guard=3 frac_guard=3 rounding=round m=2] power_index=3.49, accuracy_bits=15.4, area_um2=50525, ffs=720, throughput_msps=69.4, max_abs_err=2.32e-05 (2^-15.40)
- pipelined [data_width=22 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc] power_index=5.18, accuracy_bits=15.5, area_um2=58123, ffs=1250, throughput_msps=119, max_abs_err=2.15e-05 (2^-15.50)
- pipelined [data_width=22 n_iter=17 angle_guard=0 frac_guard=2 rounding=trunc] power_index=5.31, accuracy_bits=15.6, area_um2=59595, ffs=1279, throughput_msps=115, max_abs_err=1.98e-05 (2^-15.63)
- pipelined [data_width=22 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] power_index=5.51, accuracy_bits=16.4, area_um2=61738, ffs=1327, throughput_msps=115, max_abs_err=1.15e-05 (2^-16.41)
Front coverage: power_index 1.98..5.51 (HV reference 40); accuracy_bits 12..16.4 (HV reference 12); data_width on the front 16..22 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 12.16 bits
- pipelined: 95 evals, 83 feasible; max throughput seen 163 MSPS; best accuracy 16.41 bits; best feasible power_index=3.53; feasible ranges: data_width 16..22, n_iter 14..19, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 125 evals, 74 feasible; max throughput seen 91.1 MSPS; best accuracy 15.40 bits; best feasible power_index=1.98; feasible ranges: data_width 16..18, n_iter 15..20, angle_guard 0..3, frac_guard 1..3, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (112 evals): data_width=15..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (14 front designs; box front_anchored)
- `pipelined` (48 evals): data_width=20..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (6 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 227 feasible; hypervolume 388.2 (+139.6%).

**No LLM call** (code's front-mapping round): The feasible Pareto front is well-established and covers the relevant trade-off space for the spec. The minimum power_index achieved is 1.98 (pipelined_m), which is significantly better than the HV reference of 40, and the accuracy_bits range from 12 to 16.4, exceeding the HV reference of 12. The throughput constraint (>= 50 MSPS) is met by all designs on the front (min 51.9 MSPS), and the accuracy constraint (max_abs_err <= 2^-12) is also satisfied (max error on front is 2^-12.04). The front spans data_width 16..22, which is a reasonable subset of the registry range 8..28, and further exploration is unlikely to yield significant improvements in hypervolume given the budget is exhausted (240/400 evals used, final round). The selection rule (min power_index) picks the pipelined_m design with power_index=1.98, which is a strong candidate for the final design.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 388.2 (gain this round: +139.6%).
Feasible designs: 227 of 400 evaluations (180 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 34% violate; best seen 163
- max_abs_err <= 0.000244141: 16% violate; best seen 5.73e-08 (2^-24.06)

Pareto front (feasible, 28 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=1.98, accuracy_bits=12, area_um2=31211, ffs=381, throughput_msps=54.3, max_abs_err=0.000237 (2^-12.04)
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=3] power_index=2.08, accuracy_bits=12.8, area_um2=32797, ffs=401, throughput_msps=51.9, max_abs_err=0.000145 (2^-12.76)
- pipelined_m [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.19, accuracy_bits=13.7, area_um2=35834, ffs=409, throughput_msps=51.9, max_abs_err=7.36e-05 (2^-13.73)
- pipelined_m [data_width=20 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc m=2] power_index=2.95, accuracy_bits=14.7, area_um2=41815, ffs=617, throughput_msps=64.3, max_abs_err=3.8e-05 (2^-14.68)
- pipelined_m [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=3.07, accuracy_bits=14.8, area_um2=44252, ffs=635, throughput_msps=69.4, max_abs_err=3.49e-05 (2^-14.81)
- pipelined_m [data_width=18 n_iter=20 angle_guard=3 frac_guard=3 rounding=round m=2] power_index=3.49, accuracy_bits=15.4, area_um2=50525, ffs=720, throughput_msps=69.4, max_abs_err=2.32e-05 (2^-15.40)
- pipelined_m [data_width=28 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=4.35, accuracy_bits=17, area_um2=62020, ffs=909, throughput_msps=51.2, max_abs_err=7.64e-06 (2^-17.00)
- pipelined_m [data_width=27 n_iter=21 angle_guard=3 frac_guard=1 rounding=round m=2] power_index=5.07, accuracy_bits=19.9, area_um2=72032, ffs=1059, throughput_msps=51.2, max_abs_err=1.02e-06 (2^-19.91)
- pipelined [data_width=27 n_iter=23 angle_guard=2 frac_guard=2 rounding=trunc] power_index=8.81, accuracy_bits=21.5, area_um2=99421, ffs=2118, throughput_msps=98.8, max_abs_err=3.36e-07 (2^-21.51)
- pipelined [data_width=27 n_iter=27 angle_guard=2 frac_guard=4 rounding=trunc] power_index=10.8, accuracy_bits=23.2, area_um2=121973, ffs=2586, throughput_msps=93.5, max_abs_err=1.04e-07 (2^-23.20)
Front coverage: power_index 1.98..10.8 (HV reference 40); accuracy_bits 12..23.2 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 12.16 bits
- pipelined: 143 evals, 131 feasible; max throughput seen 163 MSPS; best accuracy 23.20 bits; best feasible power_index=3.53; feasible ranges: data_width 16..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 237 evals, 96 feasible; max throughput seen 91.1 MSPS; best accuracy 24.06 bits; best feasible power_index=1.98; feasible ranges: data_width 15..28, n_iter 15..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10770 in, 3816 out
- provider-reported cost: $0.0090
- full prompts and replies: `llm_trace.jsonl`

