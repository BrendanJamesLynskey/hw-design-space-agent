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
`pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 28695 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7645 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 344 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 135 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.8 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000178 (2^-12.46) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 5.84 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.42e-05 (2^-14.17) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.77 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 96.1 dBc, SNR 82.3 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (18 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 28695 | 344 | 51.9 | 7 | 1.8 | 0.000178 (2^-12.46) | 12.46 |
| 1 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=3` | 33239 | 399 | 51.9 | 8 | 2.09 | 0.00012 (2^-13.03) | 13.03 |
| 2 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=3` | 34224 | 409 | 51.9 | 8 | 2.15 | 8.59e-05 (2^-13.51) | 13.51 |
| 3 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round,m=2` | 36838 | 549 | 72.3 | 10 | 2.61 | 5.84e-05 (2^-14.06) | 14.06 |
| 4 | `pipelined_m:data_width=20,n_iter=16,angle_guard=1,frac_guard=0,rounding=round,m=2` | 38555 | 574 | 69.4 | 10 | 2.73 | 4.64e-05 (2^-14.39) | 14.39 |
| 5 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc,m=2` | 40185 | 596 | 66.8 | 10 | 2.84 | 4.27e-05 (2^-14.51) | 14.51 |
| 6 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 41257 | 610 | 66.8 | 10 | 2.91 | 3.93e-05 (2^-14.63) | 14.63 |
| 7 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=2` | 42323 | 612 | 66.8 | 10 | 2.95 | 3.61e-05 (2^-14.76) | 14.76 |
| 8 | `pipelined_m:data_width=20,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=2` | 43463 | 641 | 69.4 | 11 | 3.06 | 2.9e-05 (2^-15.07) | 15.07 |
| 9 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc,m=2` | 44085 | 672 | 66.8 | 11 | 3.17 | 2.8e-05 (2^-15.12) | 15.12 |
| 10 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc,m=2` | 45312 | 666 | 66.8 | 11 | 3.18 | 2.4e-05 (2^-15.35) | 15.35 |
| 11 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=2` | 47596 | 683 | 66.8 | 11 | 3.3 | 1.51e-05 (2^-16.01) | 16.01 |
| 12 | `pipelined_m:data_width=20,n_iter=19,angle_guard=2,frac_guard=2,rounding=round,m=2` | 51029 | 755 | 66.8 | 12 | 3.6 | 1.17e-05 (2^-16.38) | 16.38 |
| 13 | `pipelined_m:data_width=23,n_iter=20,angle_guard=1,frac_guard=3,rounding=trunc,m=2` | 58928 | 855 | 57.9 | 12 | 4.11 | 3.64e-06 (2^-18.07) | 18.07 |
| 14 | `pipelined_m:data_width=27,n_iter=21,angle_guard=-1,frac_guard=2,rounding=round,m=2` | 70486 | 1035 | 52.7 | 13 | 4.95 | 1.38e-06 (2^-19.47) | 19.47 |
| 15 | `pipelined_m:data_width=27,n_iter=21,angle_guard=3,frac_guard=1,rounding=round,m=2` | 72032 | 1059 | 51.2 | 13 | 5.07 | 1.02e-06 (2^-19.91) | 19.91 |
| 16 | `pipelined:data_width=26,n_iter=23,angle_guard=3,frac_guard=0,rounding=trunc` | 93211 | 1990 | 98.8 | 25 | 8.28 | 8.51e-07 (2^-20.16) | 20.16 |
| 17 | `pipelined:data_width=25,n_iter=23,angle_guard=3,frac_guard=3,rounding=round` | 97463 | 2048 | 101.6 | 25 | 8.56 | 3.65e-07 (2^-21.38) | 21.38 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraint is throughput_msps >= 50, which forces 1-result/cycle architectures (pipelined, pipelined_m) or a high-Fmax unrolled_k. The iterative family is excluded: at 1 result every N+3 cycles it cannot reach 50 MSPS with a realistic Fmax, so it would only waste budget. Accuracy (max_abs_err <= 2^-12) is met by N roughly 12-16 with modest guards, so I bound n_iter to 12-20 and data_width to 14-22 (below 14 the output LSB is too coarse to reach 2^-12; above 22 accuracy is already saturated and area/power grow). angle_guard 0-2 and frac_guard 0-2 cover the small guard-bit trade-offs that shift accuracy without large cost. Rounding is left to both choices since it is a cheap accuracy lever. Budget is weighted toward pipelined_m (0.35) and pipelined (0.45) because they are the reliable throughput-meeting families and where the min-power selection corner will live, with unrolled_k (0.2) to capture the low-FF alternative and broaden the front. This first round maps the feasible region; later rounds can refine the front and confirm the min-power point.*)
- `pipelined` (45 evals): data_width=14..22, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so throughput = Fmax. To hit 50 MSPS the critical path must be short; a full N-stage pipeline with N~12-16 keeps each stage to a single micro-rotation (shortest path, highest Fmax) while N is large enough for max_abs_err <= 2^-12. This is the natural home of the min-power corner of the front.
- `pipelined_m` (35 evals): data_width=14..22, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Same 1-result/cycle throughput but fewer registers (every m stages) -> lower FF count and lower power_index at the cost of a longer per-stage path. m=2..4 is the sweet spot: m=1 is just pipelined, m>4 risks Fmax dropping below 50 MHz. This family likely owns the low-power end of the Pareto front, so it gets the largest share.
- `unrolled_k` (20 evals): data_width=14..22, n_iter=12..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* k chained rotations/cycle with a shared FSM gives results every ceil(N/k)+3 cycles. With k=2..4 and N~12-16, throughput = Fmax/(ceil(N/k)+3) can still clear 50 MSPS if Fmax is high, and it uses far fewer FFs than the pipelined families, so it can reach the min-power corner. It also spans a different latency/throughput trade-off, useful for covering the front. k kept <=4 so the chained path stays short enough for Fmax.

**Result (code):** 100 evaluations this round, 100 total; 47 feasible; hypervolume 191.8 (n/a).

**LLM decision:** `refine` — The current front is dominated by pipelined_m (power_index 2.11-3.6) and pipelined (power_index 5.91-6.06). pipelined_m is clearly superior for the power objective, but its throughput is capped around 75-86 MSPS, whereas pipelined reaches 115-163 MSPS. The constraint is throughput >= 50 MSPS, which both meet, but the power objective favors pipelined_m. However, pipelined_m's best power is 2.11 at 75.4 MSPS, while pipelined's best feasible power is 3.93. The front shows a gap: pipelined_m covers low power but lower throughput, pipelined covers high throughput but higher power. To map the front better, I should refine pipelined_m to explore if higher throughput (closer to 100+ MSPS) is possible with m=2 or m=3, and refine pipelined to find lower power points. Also, unrolled_k had 0 feasible designs (max throughput 5.98 MSPS), so it's useless for this spec. iterative is not yet explored but likely has even lower throughput than unrolled_k (1 result per N+3 cycles), so it's probably infeasible for 50 MSPS. I'll focus on refining pipelined_m and pipelined to tighten the trade-off curve.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 191.8 (gain this round: n/a (first round)).
Feasible designs: 47 of 100 evaluations (40 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 28% violate; best seen 163
- max_abs_err <= 0.000244141: 35% violate; best seen 6.44e-06 (2^-17.24)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=2.11, accuracy_bits=12.3, area_um2=29636, ffs=446, throughput_msps=75.4, max_abs_err=0.000194 (2^-12.33)
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=2.23, accuracy_bits=12.5, area_um2=31916, ffs=465, throughput_msps=75.4, max_abs_err=0.000171 (2^-12.51)
- pipelined_m [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=2.54, accuracy_bits=13.2, area_um2=36460, ffs=527, throughput_msps=75.4, max_abs_err=0.000109 (2^-13.16)
- pipelined_m [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=2.87, accuracy_bits=14.5, area_um2=40699, ffs=602, throughput_msps=66.8, max_abs_err=4.33e-05 (2^-14.50)
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=2.91, accuracy_bits=14.6, area_um2=41257, ffs=610, throughput_msps=66.8, max_abs_err=3.93e-05 (2^-14.63)
- pipelined_m [data_width=20 n_iter=19 angle_guard=0 frac_guard=0 rounding=round m=2] power_index=3.29, accuracy_bits=14.9, area_um2=45981, ffs=698, throughput_msps=72.3, max_abs_err=3.25e-05 (2^-14.91)
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=3.3, accuracy_bits=16, area_um2=47596, ffs=683, throughput_msps=66.8, max_abs_err=1.51e-05 (2^-16.01)
- pipelined_m [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=3.6, accuracy_bits=16.4, area_um2=51029, ffs=755, throughput_msps=66.8, max_abs_err=1.17e-05 (2^-16.38)
- pipelined [data_width=21 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] power_index=5.91, accuracy_bits=17.1, area_um2=67082, ffs=1414, throughput_msps=119, max_abs_err=7.33e-06 (2^-17.06)
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=2 rounding=round] power_index=6.06, accuracy_bits=17.2, area_um2=68883, ffs=1451, throughput_msps=115, max_abs_err=6.44e-06 (2^-17.24)
Front coverage: power_index 2.11..6.06 (HV reference 40); accuracy_bits 12.3..17.2 (HV reference 12); data_width on the front 17..22 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.98 MSPS; best accuracy 15.88 bits
- pipelined: 45 evals, 25 feasible; max throughput seen 163 MSPS; best accuracy 17.24 bits; best feasible power_index=3.93; feasible ranges: data_width 18..22, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 35 evals, 22 feasible; max throughput seen 86.6 MSPS; best accuracy 16.38 bits; best feasible power_index=2.11; feasible ranges: data_width 17..20, n_iter 14..19, angle_guard 0..2, frac_guard 0..2, m 2..2
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine pipelined_m and pipelined to tighten the Pareto front. pipelined_m dominates on power, pipelined on throughput. Explore m=3 in pipelined_m to see if it helps. unrolled_k and iterative are infeasible for 50 MSPS throughput.*)
- `pipelined_m` (60 evals): data_width=17..20, n_iter=14..19, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..3. *Why:* pipelined_m has the best power_index (2.11) and meets throughput. Explore m=3 to see if it improves throughput or power, and narrow ranges around the feasible region to find better trade-offs.
- `pipelined` (40 evals): data_width=18..22, n_iter=15..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined has higher throughput (115-163 MSPS) but higher power. Refine to find lower power points that still meet throughput >= 50 MSPS, potentially filling the gap between pipelined_m and pipelined on the front.

**Result (code):** 100 evaluations this round, 200 total; 128 feasible; hypervolume 192.8 (+0.5%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with power_index as low as 2.09, which is significantly better than the `pipelined` family's best of 3.93. The `unrolled_k` family is infeasible for the 50 MSPS throughput constraint (max 5.98 MSPS). The `iterative` family is not yet explored but is structurally similar to `unrolled_k` with k=1, so it will likely also fail the throughput constraint (1 result every N+3 cycles, where N>=4 implies at least 7 cycles/result; even at high Fmax, throughput is likely < 50 MSPS unless Fmax is extremely high, but `unrolled_k` with k=2..8 already failed, suggesting the datapath latency/critical path limits Fmax or throughput is simply too low for the 50 MSPS target in this library). Therefore, `iterative` is unlikely to contribute to the feasible front. The `pipelined_m` family is clearly the most power-efficient feasible option. The current front covers power_index 2.09..6.06 and accuracy_bits 13..17.2. The HV reference is power 40, accuracy 12. The front is already well within the reference box. To maximize hypervolume, we should focus the remaining budget on densely mapping the `pipelined_m` family, which holds the best power points, and potentially the low-power end of `pipelined` if it offers better accuracy at comparable power (though `pipelined_m` seems superior). The `pipelined` family's best power is 3.93, which is worse than `pipelined_m`'s 2.09, and its accuracy advantage (17.2 vs 16.4) comes at a high power cost. The trade-off curve is likely dominated by `pipelined_m`. I will refine the search to focus exclusively on `pipelined_m` with slightly wider ranges to ensure we capture the full extent of the feasible trade-off, particularly checking if higher `n_iter` or `data_width` in `pipelined_m` can push accuracy higher without excessive power penalty, or if lower `m` (m=2) with different guards yields better power/accuracy points. The current `pipelined_m` feasible ranges are data_width 17..20, n_iter 14..19, angle_guard 0..2, frac_guard 0..2, m 2..3. I will widen `n_iter` slightly to 20 and `data_width` to 21 to see if the front extends, and keep `m` at 2..3.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.50% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 192.8 (gain this round: +0.5%).
Feasible designs: 128 of 200 evaluations (101 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 21% violate; best seen 163
- max_abs_err <= 0.000244141: 20% violate; best seen 6.44e-06 (2^-17.24)

Pareto front (feasible, 15 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.09, accuracy_bits=13, area_um2=33239, ffs=399, throughput_msps=51.9, max_abs_err=0.00012 (2^-13.03)
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.61, accuracy_bits=14.1, area_um2=36838, ffs=549, throughput_msps=72.3, max_abs_err=5.84e-05 (2^-14.06)
- pipelined_m [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.73, accuracy_bits=14.4, area_um2=38555, ffs=574, throughput_msps=69.4, max_abs_err=4.64e-05 (2^-14.39)
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=2.91, accuracy_bits=14.6, area_um2=41257, ffs=610, throughput_msps=66.8, max_abs_err=3.93e-05 (2^-14.63)
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.95, accuracy_bits=14.8, area_um2=42323, ffs=612, throughput_msps=66.8, max_abs_err=3.61e-05 (2^-14.76)
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=3.17, accuracy_bits=15.1, area_um2=44085, ffs=672, throughput_msps=66.8, max_abs_err=2.8e-05 (2^-15.12)
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=2] power_index=3.18, accuracy_bits=15.3, area_um2=45312, ffs=666, throughput_msps=66.8, max_abs_err=2.4e-05 (2^-15.35)
- pipelined_m [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=3.6, accuracy_bits=16.4, area_um2=51029, ffs=755, throughput_msps=66.8, max_abs_err=1.17e-05 (2^-16.38)
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=0 rounding=round] power_index=5.74, accuracy_bits=16.9, area_um2=64391, ffs=1382, throughput_msps=119, max_abs_err=8.35e-06 (2^-16.87)
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=2 rounding=round] power_index=6.06, accuracy_bits=17.2, area_um2=68883, ffs=1451, throughput_msps=115, max_abs_err=6.44e-06 (2^-17.24)
Front coverage: power_index 2.09..6.06 (HV reference 40); accuracy_bits 13..17.2 (HV reference 12); data_width on the front 17..22 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.98 MSPS; best accuracy 15.88 bits
- pipelined: 85 evals, 65 feasible; max throughput seen 163 MSPS; best accuracy 17.24 bits; best feasible power_index=3.93; feasible ranges: data_width 18..22, n_iter 15..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 95 evals, 63 feasible; max throughput seen 86.6 MSPS; best accuracy 16.38 bits; best feasible power_index=2.09; feasible ranges: data_width 17..20, n_iter 14..19, angle_guard 0..2, frac_guard 0..2, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (12 front designs; box front_anchored)
- `pipelined` (40 evals): data_width=20..28, n_iter=17..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (3 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 210 feasible; hypervolume 334.9 (+73.7%).

**No LLM call** (code's front-mapping round): The current Pareto front is dominated by `pipelined_m` designs with power_index as low as 2.09, which is significantly better than the `pipelined` family's best of 3.93. The `unrolled_k` family is infeasible for the 50 MSPS throughput constraint (max 5.98 MSPS). The `iterative` family is not yet explored but is structurally similar to `unrolled_k` with k=1, so it will likely also fail the throughput constraint (1 result every N+3 cycles, where N>=4 implies at least 7 cycles/result; even at high Fmax, throughput is likely < 50 MSPS unless Fmax is extremely high, but `unrolled_k` with k=2..8 already failed, suggesting the datapath latency/critical path limits Fmax or throughput is simply too low for the 50 MSPS target in this library). Therefore, `iterative` is unlikely to contribute to the feasible front. The `pipelined_m` family is clearly the most power-efficient feasible option. The current front covers power_index 2.09..6.06 and accuracy_bits 13..17.2. The HV reference is power 40, accuracy 12. The front is already well within the reference box. To maximize hypervolume, we should focus the remaining budget on densely mapping the `pipelined_m` family, which holds the best power points, and potentially the low-power end of `pipelined` if it offers better accuracy at comparable power (though `pipelined_m` seems superior). The `pipelined` family's best power is 3.93, which is worse than `pipelined_m`'s 2.09, and its accuracy advantage (17.2 vs 16.4) comes at a high power cost. The trade-off curve is likely dominated by `pipelined_m`. I will refine the search to focus exclusively on `pipelined_m` with slightly wider ranges to ensure we capture the full extent of the feasible trade-off, particularly checking if higher `n_iter` or `data_width` in `pipelined_m` can push accuracy higher without excessive power penalty, or if lower `m` (m=2) with different guards yields better power/accuracy points. The current `pipelined_m` feasible ranges are data_width 17..20, n_iter 14..19, angle_guard 0..2, frac_guard 0..2, m 2..3. I will widen `n_iter` slightly to 20 and `data_width` to 21 to see if the front extends, and keep `m` at 2..3.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 334.9 (gain this round: +73.7%).
Feasible designs: 210 of 400 evaluations (177 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 39% violate; best seen 163
- max_abs_err <= 0.000244141: 12% violate; best seen 4.62e-08 (2^-24.37)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=3] power_index=1.8, accuracy_bits=12.5, area_um2=28695, ffs=344, throughput_msps=51.9, max_abs_err=0.000178 (2^-12.46)
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.15, accuracy_bits=13.5, area_um2=34224, ffs=409, throughput_msps=51.9, max_abs_err=8.59e-05 (2^-13.51)
- pipelined_m [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=2.73, accuracy_bits=14.4, area_um2=38555, ffs=574, throughput_msps=69.4, max_abs_err=4.64e-05 (2^-14.39)
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=2.91, accuracy_bits=14.6, area_um2=41257, ffs=610, throughput_msps=66.8, max_abs_err=3.93e-05 (2^-14.63)
- pipelined_m [data_width=20 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=3.06, accuracy_bits=15.1, area_um2=43463, ffs=641, throughput_msps=69.4, max_abs_err=2.9e-05 (2^-15.07)
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc m=2] power_index=3.17, accuracy_bits=15.1, area_um2=44085, ffs=672, throughput_msps=66.8, max_abs_err=2.8e-05 (2^-15.12)
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=3.3, accuracy_bits=16, area_um2=47596, ffs=683, throughput_msps=66.8, max_abs_err=1.51e-05 (2^-16.01)
- pipelined_m [data_width=23 n_iter=20 angle_guard=1 frac_guard=3 rounding=trunc m=2] power_index=4.11, accuracy_bits=18.1, area_um2=58928, ffs=855, throughput_msps=57.9, max_abs_err=3.64e-06 (2^-18.07)
- pipelined_m [data_width=27 n_iter=21 angle_guard=3 frac_guard=1 rounding=round m=2] power_index=5.07, accuracy_bits=19.9, area_um2=72032, ffs=1059, throughput_msps=51.2, max_abs_err=1.02e-06 (2^-19.91)
- pipelined [data_width=25 n_iter=23 angle_guard=3 frac_guard=3 rounding=round] power_index=8.56, accuracy_bits=21.4, area_um2=97463, ffs=2048, throughput_msps=102, max_abs_err=3.65e-07 (2^-21.38)
Front coverage: power_index 1.8..8.56 (HV reference 40); accuracy_bits 12.5..21.4 (HV reference 12); data_width on the front 17..27 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.98 MSPS; best accuracy 15.88 bits
- pipelined: 125 evals, 105 feasible; max throughput seen 163 MSPS; best accuracy 21.38 bits; best feasible power_index=3.93; feasible ranges: data_width 18..28, n_iter 15..30, angle_guard -2..3, frac_guard 0..4
- pipelined_m: 255 evals, 105 feasible; max throughput seen 86.6 MSPS; best accuracy 24.37 bits; best feasible power_index=1.8; feasible ranges: data_width 17..27, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7663 in, 3004 out
- provider-reported cost: $0.0110
- full prompts and replies: `llm_trace.jsonl`

