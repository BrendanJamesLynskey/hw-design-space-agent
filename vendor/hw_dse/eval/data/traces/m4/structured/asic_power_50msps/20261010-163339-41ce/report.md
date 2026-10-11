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
`pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 27791 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7404 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 326 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 135 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.73 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000225 (2^-12.12) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.68 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.4e-05 (2^-13.93) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.05 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.1 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 93.3 dBc, SNR 81.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=3` | 27791 | 326 | 51.9 | 7 | 1.73 | 0.000225 (2^-12.12) | 12.12 |
| 1 | `pipelined_m:data_width=18,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc,m=3` | 28341 | 343 | 51.9 | 7 | 1.79 | 0.000205 (2^-12.25) | 12.25 |
| 2 | `pipelined_m:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=trunc,m=3` | 28870 | 352 | 51.9 | 7 | 1.83 | 0.000172 (2^-12.50) | 12.50 |
| 3 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=3` | 33239 | 399 | 51.9 | 8 | 2.09 | 0.00012 (2^-13.03) | 13.03 |
| 4 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 33312 | 407 | 51.9 | 8 | 2.11 | 0.000116 (2^-13.08) | 13.08 |
| 5 | `pipelined_m:data_width=18,n_iter=17,angle_guard=1,frac_guard=0,rounding=round,m=3` | 33973 | 401 | 51.9 | 8 | 2.12 | 9.26e-05 (2^-13.40) | 13.40 |
| 6 | `pipelined_m:data_width=18,n_iter=17,angle_guard=1,frac_guard=1,rounding=round,m=3` | 35972 | 413 | 51.9 | 8 | 2.21 | 6.89e-05 (2^-13.83) | 13.83 |
| 7 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=2` | 37714 | 547 | 72.3 | 10 | 2.63 | 6.45e-05 (2^-13.92) | 13.92 |
| 8 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=2` | 38786 | 560 | 72.3 | 10 | 2.7 | 5.46e-05 (2^-14.16) | 14.16 |
| 9 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=2` | 40555 | 586 | 69.4 | 10 | 2.82 | 4.29e-05 (2^-14.51) | 14.51 |
| 10 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=3,rounding=round,m=2` | 41627 | 600 | 66.8 | 10 | 2.89 | 3.97e-05 (2^-14.62) | 14.62 |
| 11 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=2` | 42323 | 612 | 66.8 | 10 | 2.95 | 3.61e-05 (2^-14.76) | 14.76 |
| 12 | `pipelined_m:data_width=19,n_iter=18,angle_guard=2,frac_guard=1,rounding=round,m=2` | 44391 | 639 | 69.4 | 11 | 3.08 | 3.09e-05 (2^-14.98) | 14.98 |
| 13 | `pipelined_m:data_width=19,n_iter=18,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 44594 | 653 | 69.4 | 11 | 3.13 | 3.04e-05 (2^-15.00) | 15.00 |
| 14 | `pipelined_m:data_width=19,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=2` | 45609 | 655 | 69.4 | 11 | 3.16 | 2.34e-05 (2^-15.38) | 15.38 |
| 15 | `pipelined_m:data_width=20,n_iter=18,angle_guard=3,frac_guard=2,rounding=trunc,m=2` | 47161 | 690 | 64.3 | 11 | 3.31 | 1.8e-05 (2^-15.76) | 15.76 |
| 16 | `pipelined_m:data_width=23,n_iter=18,angle_guard=-2,frac_guard=0,rounding=round,m=2` | 47379 | 700 | 64.3 | 11 | 3.34 | 1.73e-05 (2^-15.82) | 15.82 |
| 17 | `pipelined_m:data_width=20,n_iter=18,angle_guard=3,frac_guard=2,rounding=round,m=2` | 48227 | 692 | 64.3 | 11 | 3.34 | 1.42e-05 (2^-16.11) | 16.11 |
| 18 | `pipelined_m:data_width=24,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=2` | 51208 | 755 | 59.9 | 11 | 3.61 | 8.41e-06 (2^-16.86) | 16.86 |
| 19 | `pipelined_m:data_width=23,n_iter=18,angle_guard=2,frac_guard=3,rounding=round,m=2` | 54776 | 785 | 57.9 | 11 | 3.79 | 8.11e-06 (2^-16.91) | 16.91 |
| 20 | `pipelined_m:data_width=28,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=2` | 58953 | 869 | 52.7 | 11 | 4.15 | 7.66e-06 (2^-17.00) | 17.00 |
| 21 | `pipelined_m:data_width=20,n_iter=21,angle_guard=3,frac_guard=4,rounding=round,m=2` | 59971 | 877 | 62.0 | 13 | 4.2 | 5.31e-06 (2^-17.52) | 17.52 |
| 22 | `pipelined_m:data_width=23,n_iter=21,angle_guard=4,frac_guard=1,rounding=round,m=2` | 63390 | 932 | 56.1 | 13 | 4.46 | 2.13e-06 (2^-18.84) | 18.84 |
| 23 | `pipelined_m:data_width=27,n_iter=20,angle_guard=2,frac_guard=0,rounding=round,m=2` | 64160 | 938 | 52.7 | 12 | 4.5 | 1.99e-06 (2^-18.94) | 18.94 |
| 24 | `pipelined_m:data_width=23,n_iter=22,angle_guard=4,frac_guard=2,rounding=round,m=2` | 66970 | 952 | 56.1 | 13 | 4.62 | 1.25e-06 (2^-19.61) | 19.61 |
| 25 | `pipelined_m:data_width=26,n_iter=21,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 69019 | 1031 | 54.3 | 13 | 4.9 | 1.14e-06 (2^-19.74) | 19.74 |
| 26 | `pipelined_m:data_width=28,n_iter=27,angle_guard=1,frac_guard=0,rounding=round,m=2` | 89921 | 1321 | 52.7 | 16 | 6.32 | 1.32e-07 (2^-22.85) | 22.85 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraint is throughput_msps >= 50, which is the binding filter. iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) only meet it by running at a high Fmax, which raises power_index; pipelined and pipelined_m give 1 result/cycle and are the natural throughput-safe families. pipelined_m is the most promising because its m parameter trades FF/area (and thus power) against latency while preserving identical bit-accuracy, so it spans the power-vs-accuracy trade-off the hypervolume rewards. I therefore weight pipelined_m (0.45) and pipelined (0.35) heavily, and keep unrolled_k (0.20) as a probe for any low-cycle/high-k point that might undercut them. Accuracy is the trade-off objective, so I center data_width (14..18) and n_iter (12..16) around the 2^-12 error target with enough range to map both the minimum-power feasible point and the higher-accuracy end of the front. angle_guard and frac_guard are kept low (0..2) since they add area/power without helping the throughput constraint, and rounding is left to the search. This allocation spends the budget where the feasible trade-offs actually are, leaving the reserved front-mapping pass to refine the full ranges of whichever families land on the Pareto front.*)
- `pipelined_m` (45 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* The 50 MSPS throughput constraint rules out iterative/unrolled_k (they emit one result every several cycles, so they need Fmax >> 50 MHz, inflating power). pipelined_m is the key family: it gives 1 result/cycle like pipelined, but by registering every m stages it cuts FF count and area (hence power_index) while keeping the same bit-accurate result. m is the main power/area lever, so I sweep it fully (2..8). data_width 14..18 and n_iter 12..16 bracket the accuracy target (max_abs_err <= 2^-12) with headroom to map the power-vs-accuracy trade-off; angle_guard/frac_guard kept small to avoid area bloat. This is where the interesting Pareto trade-off lives.
- `pipelined` (35 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* The full pipelined family (m=1) is the throughput-safe baseline and the upper bound on FF/area/power for a given accuracy. Including it anchors the high-accuracy/high-power end of the front and lets the hypervolume capture the full trade-off curve, not just the m>1 corner. Same accuracy-relevant ranges as pipelined_m so the two families are directly comparable on the accuracy axis.
- `unrolled_k` (20 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..8. *Why:* unrolled_k emits one result every ceil(N/k)+3 cycles, so it needs Fmax >= 50*(ceil(N/k)+3) MHz to hit 50 MSPS. For small k (large cycle count) this forces a high Fmax and high power, but for large k (few cycles) the required Fmax drops and it can be competitive on power with a smaller datapath. I include it with a modest share to check whether any (k, n_iter) combination lands on the front; if it cannot meet throughput at acceptable power it will simply fall off the Pareto front.

**Result (code):** 100 evaluations this round, 100 total; 12 feasible; hypervolume 78.53 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined` designs with high power indices (3.82-4.37), while the single `pipelined_m` design achieves a significantly lower power index (2.22) but with lower accuracy (12.5 bits). The `pipelined_m` family is the most promising for the primary objective (min power_index) because it reduces register count compared to fully pipelined designs, but it has only been explored in a very narrow region (data_width=18, n_iter=14, m=2). The `unrolled_k` family is infeasible for the throughput constraint (max 7.45 MSPS < 50 MSPS), so it can be ignored. To improve the hypervolume, we need to explore the `pipelined_m` family more broadly to find designs that maintain the low power advantage while increasing accuracy (by increasing n_iter or data_width) or to find even lower power designs (by adjusting m or guards). The `pipelined` family should also be refined to see if lower power is possible with different parameters, but `pipelined_m` is the key to beating the current best power index of 2.22. We will focus the next round on `pipelined_m` with wider ranges for n_iter and m, and slightly wider data_width, while keeping `pipelined` in a narrower range around its current best to ensure we don't miss any low-power variants there.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 78.53 (gain this round: n/a (first round)).
Feasible designs: 12 of 100 evaluations (9 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 63% violate; best seen 163
- max_abs_err <= 0.000244141: 59% violate; best seen 5.46e-05 (2^-14.16)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=2.22, accuracy_bits=12.5, area_um2=31135, ffs=469, throughput_msps=72.3, max_abs_err=0.00017 (2^-12.53)
- pipelined [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] power_index=3.82, accuracy_bits=12.8, area_um2=43313, ffs=916, throughput_msps=132, max_abs_err=0.000144 (2^-12.76)
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] power_index=3.85, accuracy_bits=13.2, area_um2=42933, ffs=929, throughput_msps=132, max_abs_err=0.000109 (2^-13.17)
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] power_index=4.04, accuracy_bits=13.4, area_um2=45777, ffs=967, throughput_msps=132, max_abs_err=9.56e-05 (2^-13.35)
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] power_index=4.1, accuracy_bits=13.6, area_um2=46462, ffs=982, throughput_msps=132, max_abs_err=8.26e-05 (2^-13.56)
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] power_index=4.37, accuracy_bits=14.2, area_um2=49611, ffs=1048, throughput_msps=132, max_abs_err=5.46e-05 (2^-14.16)
Front coverage: power_index 2.22..4.37 (HV reference 40); accuracy_bits 12.5..14.2 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.45 MSPS; best accuracy 12.94 bits
- pipelined: 35 evals, 11 feasible; max throughput seen 163 MSPS; best accuracy 14.16 bits; best feasible power_index=3.82; feasible ranges: data_width 18..18, n_iter 14..16, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 45 evals, 1 feasible; max throughput seen 72.3 MSPS; best accuracy 13.55 bits; best feasible power_index=2.22; feasible ranges: data_width 18..18, n_iter 14..14, angle_guard 2..2, frac_guard 0..0, m 2..2
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus 70% of the budget on pipelined_m to exploit its low power advantage and map the accuracy-power trade-off. Keep 30% on pipelined to ensure the front is well-covered in the higher throughput region, in case pipelined_m cannot meet the accuracy constraint at low power.*)
- `pipelined_m` (70 evals): data_width=16..20, n_iter=12..18, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round, m=2..6. *Why:* pipelined_m showed the best power_index (2.22) in Round 1. It was only explored at a single point (dw=18, n=14, m=2). Widening n_iter and m allows exploring the trade-off between accuracy and power/throughput. Higher m reduces registers (lower power) but may impact Fmax/throughput. Higher n_iter increases accuracy. This family is the most likely to yield the minimum power_index feasible design.
- `pipelined` (30 evals): data_width=16..20, n_iter=12..16, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined has higher power than pipelined_m in the current front, but it offers higher throughput (132 MSPS vs 72.3 MSPS for the best pipelined_m). We keep a smaller share to ensure we capture any potential low-power pipelined designs that might have been missed, particularly with lower n_iter or different guard bits, although pipelined_m is the primary focus for power minimization.

**Result (code):** 100 evaluations this round, 200 total; 31 feasible; hypervolume 101.9 (+29.7%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `m=3` and `data_width` 16-19, achieving the lowest power index (1.73) while meeting the 50 MSPS throughput constraint. The `pipelined` family offers higher throughput (up to 163 MSPS) but at a significantly higher power cost (min 3.82), placing it far from the optimal trade-off for this battery-powered spec. `unrolled_k` is infeasible for throughput. The `iterative` family is not yet explored, but given the strict 50 MSPS constraint, it is highly likely to be infeasible or dominated by `pipelined_m` (which already achieves 51.9 MSPS with lower power than any `pipelined` design). To maximize hypervolume, we should focus the remaining budget on refining the `pipelined_m` front, specifically exploring the boundary between `m=2` and `m=3` and slightly wider `data_width`/`n_iter` combinations to push accuracy higher without excessive power penalty, and potentially checking if `iterative` can offer a low-power corner if it can meet throughput (though unlikely). However, since `pipelined_m` is clearly the winner, refining its ranges is the most efficient use of the next 100 evals.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 101.9 (gain this round: +29.7%).
Feasible designs: 31 of 200 evaluations (25 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 53% violate; best seen 163
- max_abs_err <= 0.000244141: 52% violate; best seen 2.01e-05 (2^-15.61)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=3] power_index=1.73, accuracy_bits=12.1, area_um2=27791, ffs=326, throughput_msps=51.9, max_abs_err=0.000225 (2^-12.12)
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc m=3] power_index=1.79, accuracy_bits=12.3, area_um2=28341, ffs=343, throughput_msps=51.9, max_abs_err=0.000205 (2^-12.25)
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=trunc m=3] power_index=1.83, accuracy_bits=12.5, area_um2=28870, ffs=352, throughput_msps=51.9, max_abs_err=0.000172 (2^-12.50)
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=2.12, accuracy_bits=13.4, area_um2=33973, ffs=401, throughput_msps=51.9, max_abs_err=9.26e-05 (2^-13.40)
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.21, accuracy_bits=13.8, area_um2=35972, ffs=413, throughput_msps=51.9, max_abs_err=6.89e-05 (2^-13.83)
- pipelined_m [data_width=19 n_iter=17 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=3.07, accuracy_bits=14.6, area_um2=43240, ffs=646, throughput_msps=69.4, max_abs_err=3.97e-05 (2^-14.62)
- pipelined [data_width=20 n_iter=16 angle_guard=3 frac_guard=1 rounding=round] power_index=4.72, accuracy_bits=14.7, area_um2=53463, ffs=1131, throughput_msps=119, max_abs_err=3.73e-05 (2^-14.71)
Front coverage: power_index 1.73..4.72 (HV reference 40); accuracy_bits 12.1..14.7 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.45 MSPS; best accuracy 12.94 bits
- pipelined: 65 evals, 18 feasible; max throughput seen 163 MSPS; best accuracy 14.71 bits; best feasible power_index=3.82; feasible ranges: data_width 18..20, n_iter 14..16, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 115 evals, 13 feasible; max throughput seen 86.6 MSPS; best accuracy 15.61 bits; best feasible power_index=1.73; feasible ranges: data_width 16..19, n_iter 14..18, angle_guard 0..3, frac_guard 0..2, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focus 80% on refining the winning pipelined_m family to maximize hypervolume along the accuracy-power curve, and 20% to verify if iterative is a viable low-power alternative.*)
- `pipelined_m` (32 evals): data_width=16..20, n_iter=14..18, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round, m=2..3. *Why:* Refine the dominant family to fill gaps in the accuracy-power trade-off, especially around m=2 vs m=3 and higher data_width for better accuracy bits.
- `iterative` (8 evals): data_width=16..20, n_iter=14..18, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* Quick check if iterative can meet 50 MSPS with lower power than pipelined_m (unlikely, but low cost to verify).

**Result (code):** 40 evaluations this round, 240 total; 53 feasible; hypervolume 153.5 (+50.7%).

**LLM decision:** `stop` — The Pareto front is well-mapped and feasible. The `pipelined_m` family dominates the trade-off space, achieving the minimum power index of 1.73 (at 12.1 accuracy bits) and extending to 16.1 accuracy bits with a power index of 3.34, all while satisfying the 50 MSPS throughput constraint (throughputs range from 51.9 to 64.3 MSPS on the front). The `pipelined` family offers higher throughput (up to 163 MSPS) but at a higher power cost (min 3.82), making it non-Pareto optimal for the power-accuracy trade-off. `iterative` and `unrolled_k` are infeasible due to insufficient throughput. With 240/400 evaluations used and this being the final round, the current front provides a comprehensive view of the feasible design space for the selection rule (min power_index).
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 153.5 (gain this round: +50.7%).
Feasible designs: 53 of 240 evaluations (45 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 51% violate; best seen 163
- max_abs_err <= 0.000244141: 44% violate; best seen 1.42e-05 (2^-16.11)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=3] power_index=1.73, accuracy_bits=12.1, area_um2=27791, ffs=326, throughput_msps=51.9, max_abs_err=0.000225 (2^-12.12)
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=trunc m=3] power_index=1.83, accuracy_bits=12.5, area_um2=28870, ffs=352, throughput_msps=51.9, max_abs_err=0.000172 (2^-12.50)
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.09, accuracy_bits=13, area_um2=33239, ffs=399, throughput_msps=51.9, max_abs_err=0.00012 (2^-13.03)
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=2.12, accuracy_bits=13.4, area_um2=33973, ffs=401, throughput_msps=51.9, max_abs_err=9.26e-05 (2^-13.40)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=2.63, accuracy_bits=13.9, area_um2=37714, ffs=547, throughput_msps=72.3, max_abs_err=6.45e-05 (2^-13.92)
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.7, accuracy_bits=14.2, area_um2=38786, ffs=560, throughput_msps=72.3, max_abs_err=5.46e-05 (2^-14.16)
- pipelined_m [data_width=19 n_iter=17 angle_guard=1 frac_guard=2 rounding=round m=2] power_index=3.07, accuracy_bits=14.6, area_um2=43240, ffs=646, throughput_msps=69.4, max_abs_err=3.97e-05 (2^-14.62)
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=3.13, accuracy_bits=15, area_um2=44594, ffs=653, throughput_msps=69.4, max_abs_err=3.04e-05 (2^-15.00)
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=3.16, accuracy_bits=15.4, area_um2=45609, ffs=655, throughput_msps=69.4, max_abs_err=2.34e-05 (2^-15.38)
- pipelined_m [data_width=20 n_iter=18 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=3.34, accuracy_bits=16.1, area_um2=48227, ffs=692, throughput_msps=64.3, max_abs_err=1.42e-05 (2^-16.11)
Front coverage: power_index 1.73..3.34 (HV reference 40); accuracy_bits 12.1..16.1 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- iterative: 8 evals, 0 feasible; max throughput seen 6.8 MSPS; best accuracy 15.25 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.45 MSPS; best accuracy 12.94 bits
- pipelined: 65 evals, 18 feasible; max throughput seen 163 MSPS; best accuracy 14.71 bits; best feasible power_index=3.82; feasible ranges: data_width 18..20, n_iter 14..16, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 147 evals, 35 feasible; max throughput seen 86.6 MSPS; best accuracy 16.11 bits; best feasible power_index=1.73; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..3, frac_guard 0..2, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (16 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 100 feasible; hypervolume 388.2 (+152.9%).

**No LLM call** (code's front-mapping round): The Pareto front is well-mapped and feasible. The `pipelined_m` family dominates the trade-off space, achieving the minimum power index of 1.73 (at 12.1 accuracy bits) and extending to 16.1 accuracy bits with a power index of 3.34, all while satisfying the 50 MSPS throughput constraint (throughputs range from 51.9 to 64.3 MSPS on the front). The `pipelined` family offers higher throughput (up to 163 MSPS) but at a higher power cost (min 3.82), making it non-Pareto optimal for the power-accuracy trade-off. `iterative` and `unrolled_k` are infeasible due to insufficient throughput. With 240/400 evaluations used and this being the final round, the current front provides a comprehensive view of the feasible design space for the selection rule (min power_index).
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 388.2 (gain this round: +152.9%).
Feasible designs: 100 of 400 evaluations (85 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 58% violate; best seen 163
- max_abs_err <= 0.000244141: 33% violate; best seen 6.09e-08 (2^-23.97)

Pareto front (feasible, 27 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=3] power_index=1.73, accuracy_bits=12.1, area_um2=27791, ffs=326, throughput_msps=51.9, max_abs_err=0.000225 (2^-12.12)
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=3] power_index=2.09, accuracy_bits=13, area_um2=33239, ffs=399, throughput_msps=51.9, max_abs_err=0.00012 (2^-13.03)
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.21, accuracy_bits=13.8, area_um2=35972, ffs=413, throughput_msps=51.9, max_abs_err=6.89e-05 (2^-13.83)
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.82, accuracy_bits=14.5, area_um2=40555, ffs=586, throughput_msps=69.4, max_abs_err=4.29e-05 (2^-14.51)
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=1 rounding=round m=2] power_index=3.08, accuracy_bits=15, area_um2=44391, ffs=639, throughput_msps=69.4, max_abs_err=3.09e-05 (2^-14.98)
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=3.16, accuracy_bits=15.4, area_um2=45609, ffs=655, throughput_msps=69.4, max_abs_err=2.34e-05 (2^-15.38)
- pipelined_m [data_width=20 n_iter=18 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=3.34, accuracy_bits=16.1, area_um2=48227, ffs=692, throughput_msps=64.3, max_abs_err=1.42e-05 (2^-16.11)
- pipelined_m [data_width=28 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=4.15, accuracy_bits=17, area_um2=58953, ffs=869, throughput_msps=52.7, max_abs_err=7.66e-06 (2^-17.00)
- pipelined_m [data_width=27 n_iter=20 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=4.5, accuracy_bits=18.9, area_um2=64160, ffs=938, throughput_msps=52.7, max_abs_err=1.99e-06 (2^-18.94)
- pipelined_m [data_width=28 n_iter=27 angle_guard=1 frac_guard=0 rounding=round m=2] power_index=6.32, accuracy_bits=22.9, area_um2=89921, ffs=1321, throughput_msps=52.7, max_abs_err=1.32e-07 (2^-22.85)
Front coverage: power_index 1.73..6.32 (HV reference 40); accuracy_bits 12.1..22.9 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 8 evals, 0 feasible; max throughput seen 6.8 MSPS; best accuracy 15.25 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.45 MSPS; best accuracy 12.94 bits
- pipelined: 65 evals, 18 feasible; max throughput seen 163 MSPS; best accuracy 14.71 bits; best feasible power_index=3.82; feasible ranges: data_width 18..20, n_iter 14..16, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 307 evals, 82 feasible; max throughput seen 86.6 MSPS; best accuracy 23.97 bits; best feasible power_index=1.73; feasible ranges: data_width 15..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10140 in, 3796 out
- provider-reported cost: $0.0104
- full prompts and replies: `llm_trace.jsonl`

