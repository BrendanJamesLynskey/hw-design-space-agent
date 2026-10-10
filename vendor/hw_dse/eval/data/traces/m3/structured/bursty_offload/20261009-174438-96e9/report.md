# DSE run: bursty_offload

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec bursty_offload: Sin/cos offload for an 8-channel sensor front end: bursts of 8 requests arrive as a Poisson process, 2 requests/us on average; p99 request latency must be <= 0.4 us. Max error <= 2^-10. Minimise LUTs + FFs.
  constraint: throughput_msps >= 2
  constraint: max_abs_err <= 0.000976562
  constraint: sys_p99_latency_us <= 0.4
  objective: min luts_plus_ffs (HV ref 3000)
  objective: max accuracy_bits (HV ref 10)
  select: min luts_plus_ffs
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=0,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 643 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 200 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 5 | exact: schedule |
| latency_ns | 53.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0634 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000807 (2^-10.27) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.61 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000238 (2^-12.04) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.95 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.3 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 5 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.0 dBc, SNR 69.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=0,rounding=round,m=4` | 0.1176 → 0.1412 | yes |
| `pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=3,rounding=trunc,m=5` | 0.1365 → 0.172 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=5` | 0.1365 → 0.172 | yes |
| `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=5` | 0.1365 → 0.172 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=-2,frac_guard=1,rounding=round,m=7` | 0.1759 → 0.245 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (29 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=0,rounding=round,m=4` | 643 | 200 | 93.6 | 5 | 0.0634 | 0.000807 (2^-10.27) | 10.27 |
| 1 | `pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=3,rounding=trunc,m=5` | 678 | 203 | 80.6 | 5 | 0.0662 | 0.000748 (2^-10.39) | 10.39 |
| 2 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=5` | 701 | 213 | 80.6 | 5 | 0.0687 | 0.000597 (2^-10.71) | 10.71 |
| 3 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=5` | 759 | 202 | 80.6 | 5 | 0.0723 | 0.000342 (2^-11.51) | 11.51 |
| 4 | `pipelined_m:data_width=19,n_iter=14,angle_guard=-2,frac_guard=1,rounding=round,m=7` | 908 | 167 | 56.8 | 4 | 0.0809 | 0.000241 (2^-12.02) | 12.02 |
| 5 | `pipelined_m:data_width=16,n_iter=14,angle_guard=4,frac_guard=4,rounding=round,m=8` | 943 | 161 | 50.3 | 4 | 0.0831 | 0.000161 (2^-12.60) | 12.60 |
| 6 | `pipelined_m:data_width=16,n_iter=15,angle_guard=2,frac_guard=4,rounding=round,m=8` | 983 | 157 | 50.3 | 4 | 0.0858 | 0.00014 (2^-12.80) | 12.80 |
| 7 | `pipelined_m:data_width=20,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc,m=8` | 978 | 182 | 50.3 | 4 | 0.0872 | 0.000132 (2^-12.88) | 12.88 |
| 8 | `pipelined_m:data_width=18,n_iter=16,angle_guard=0,frac_guard=2,rounding=trunc,m=8` | 1017 | 163 | 50.3 | 4 | 0.0888 | 0.000114 (2^-13.10) | 13.10 |
| 9 | `pipelined_m:data_width=20,n_iter=15,angle_guard=0,frac_guard=2,rounding=trunc,m=8` | 1038 | 180 | 50.3 | 4 | 0.0916 | 7.88e-05 (2^-13.63) | 13.63 |
| 10 | `pipelined_m:data_width=20,n_iter=15,angle_guard=0,frac_guard=4,rounding=trunc,m=8` | 1097 | 184 | 48.0 | 4 | 0.0963 | 7.62e-05 (2^-13.68) | 13.68 |
| 11 | `pipelined_m:data_width=19,n_iter=17,angle_guard=1,frac_guard=0,rounding=round,m=7` | 1084 | 235 | 56.8 | 5 | 0.0993 | 5.02e-05 (2^-14.28) | 14.28 |
| 12 | `pipelined_m:data_width=19,n_iter=16,angle_guard=4,frac_guard=4,rounding=trunc,m=8` | 1191 | 184 | 48.0 | 4 | 0.103 | 3.9e-05 (2^-14.64) | 14.64 |
| 13 | `pipelined_m:data_width=20,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc,m=8` | 1241 | 250 | 50.3 | 5 | 0.112 | 2.8e-05 (2^-15.12) | 15.12 |
| 14 | `pipelined_m:data_width=20,n_iter=18,angle_guard=1,frac_guard=3,rounding=trunc,m=8` | 1313 | 258 | 48.0 | 5 | 0.118 | 2.04e-05 (2^-15.58) | 15.58 |
| 15 | `pipelined_m:data_width=27,n_iter=17,angle_guard=-2,frac_guard=0,rounding=round,m=7` | 1438 | 315 | 52.0 | 5 | 0.132 | 1.56e-05 (2^-15.97) | 15.97 |
| 16 | `pipelined_m:data_width=25,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc,m=8` | 1510 | 306 | 48.0 | 5 | 0.137 | 8.05e-06 (2^-16.92) | 16.92 |
| 17 | `pipelined_m:data_width=24,n_iter=19,angle_guard=1,frac_guard=1,rounding=trunc,m=6` | 1542 | 377 | 62.5 | 6 | 0.144 | 4.86e-06 (2^-17.65) | 17.65 |
| 18 | `pipelined_m:data_width=25,n_iter=19,angle_guard=4,frac_guard=3,rounding=round,m=8` | 1784 | 325 | 45.9 | 5 | 0.159 | 3.9e-06 (2^-17.97) | 17.97 |
| 19 | `pipelined_m:data_width=26,n_iter=21,angle_guard=-2,frac_guard=2,rounding=round,m=8` | 1873 | 314 | 45.9 | 5 | 0.164 | 2.32e-06 (2^-18.72) | 18.72 |
| 20 | `pipelined_m:data_width=25,n_iter=21,angle_guard=4,frac_guard=2,rounding=trunc,m=8` | 1881 | 319 | 45.9 | 5 | 0.165 | 1.2e-06 (2^-19.67) | 19.67 |
| 21 | `pipelined_m:data_width=26,n_iter=21,angle_guard=1,frac_guard=2,rounding=trunc,m=8` | 1881 | 321 | 45.9 | 5 | 0.166 | 1.16e-06 (2^-19.72) | 19.72 |
| 22 | `pipelined_m:data_width=25,n_iter=21,angle_guard=4,frac_guard=2,rounding=round,m=8` | 1934 | 321 | 45.9 | 5 | 0.17 | 1.11e-06 (2^-19.78) | 19.78 |
| 23 | `pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=round,m=5` | 2005 | 479 | 73.7 | 7 | 0.187 | 7.53e-07 (2^-20.34) | 20.34 |
| 24 | `pipelined_m:data_width=27,n_iter=24,angle_guard=-1,frac_guard=1,rounding=trunc,m=7` | 2138 | 412 | 52.0 | 6 | 0.192 | 6.51e-07 (2^-20.55) | 20.55 |
| 25 | `pipelined_m:data_width=26,n_iter=23,angle_guard=2,frac_guard=3,rounding=trunc,m=5` | 2138 | 516 | 70.6 | 7 | 0.2 | 3.78e-07 (2^-21.34) | 21.34 |
| 26 | `pipelined_m:data_width=28,n_iter=26,angle_guard=2,frac_guard=1,rounding=trunc,m=7` | 2482 | 438 | 52.0 | 6 | 0.22 | 1.13e-07 (2^-23.08) | 23.08 |
| 27 | `pipelined_m:data_width=28,n_iter=26,angle_guard=2,frac_guard=3,rounding=trunc,m=8` | 2587 | 450 | 44.0 | 6 | 0.228 | 7.02e-08 (2^-23.76) | 23.76 |
| 28 | `pipelined_m:data_width=28,n_iter=26,angle_guard=4,frac_guard=2,rounding=round,m=6` | 2646 | 554 | 57.5 | 7 | 0.241 | 5.42e-08 (2^-24.14) | 24.14 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>= 2 Msps) eliminates iterative and unrolled_k families since they produce < 1 result/cycle. Only pipelined and pipelined_m can meet this. The p99 latency constraint (0.4 us) with bursts of 8 arriving Poisson at 2 req/us is the critical system constraint: pipelined_m with larger m has higher latency per result, which may violate p99 when a burst of 8 hits a busy pipeline. I split the budget: 40% on tight pipelined boxes (low area, meeting accuracy), 30% on pipelined_m (area reduction via m=2-4), and 30% on wider pipelined boxes to map the accuracy frontier for hypervolume. Rounding is fixed to 'round' since truncation wastes accuracy bits and the spec requires max_abs_err <= 2^-10.*)
- `pipelined` (58 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Throughput >= 2 Msps requires 1 result/cycle, so only pipelined families are viable. This box targets the accuracy constraint (max_abs_err <= 2^-10) with minimal area; n_iter=10-14 and data_width=12-16 should satisfy the error bound while keeping LUT+FF low.
- `pipelined_m` (42 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=round, m=2..4. *Why:* pipelined_m with m=2-4 reduces FF count vs full pipelined while maintaining 1 result/cycle throughput. This trades latency (ceil(N/m)+2) for area, which is the primary objective. The p99 latency constraint (0.4 us) must be checked against the bursty arrival pattern.
- clamped by code: dropped duplicate family pipelined

**Result (code):** 100 evaluations this round, 100 total; 49 feasible; hypervolume 4333 (n/a).

**LLM decision:** `add_family` — The current front is dominated by pipelined_m with best area 944 (data_width=15, n_iter=14, m=4). pipelined is strictly worse on area (best 1350). unrolled_k has not been explored and could offer area savings through shared datapath with k=2..4 micro-rotations per cycle. The accuracy constraint (max_abs_err <= 2^-10) is met by all front designs (10.3-12.3 bits), so area is the binding objective. Exploring unrolled_k with moderate k (2-4) and n_iter 12-16 should reveal whether it can beat 944 LUTs+FFs while maintaining throughput >= 2 MSPS and sys_p99_latency <= 0.4us. The p99 latency constraint is easily met (best seen 0.0639us), so the main risk is throughput, but unrolled_k with k=2-4 should still achieve >2 MSPS at reasonable Fmax.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 4333 (gain this round: n/a (first round)).
Feasible designs: 49 of 100 evaluations (32 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 51% violate; best seen 0.000204 (2^-12.26)
- sys_p99_latency_us <= 0.4: 0% violate; best seen 0.0639

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=944, accuracy_bits=10.3, luts=704, ffs=240, throughput_msps=97.8, max_abs_err=0.00081 (2^-10.27), power_index=0.071
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=988, accuracy_bits=10.3, luts=692, ffs=296, throughput_msps=124, max_abs_err=0.000795 (2^-10.30), power_index=0.0743
- pipelined_m [data_width=14 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=989, accuracy_bits=10.4, luts=747, ffs=242, throughput_msps=97.8, max_abs_err=0.000717 (2^-10.45), power_index=0.0744
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1021, accuracy_bits=10.7, luts=718, ffs=304, throughput_msps=124, max_abs_err=0.000581 (2^-10.75), power_index=0.0768
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1073, accuracy_bits=11.5, luts=759, ffs=315, throughput_msps=124, max_abs_err=0.000342 (2^-11.51), power_index=0.0808
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] luts_plus_ffs=1145, accuracy_bits=11.7, luts=820, ffs=325, throughput_msps=124, max_abs_err=0.000311 (2^-11.65), power_index=0.0861
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1199, accuracy_bits=12.3, luts=861, ffs=338, throughput_msps=124, max_abs_err=0.000204 (2^-12.26), power_index=0.0902
Front coverage: luts_plus_ffs 944..1199 (HV reference 3000); accuracy_bits 10.3..12.3 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- pipelined: 58 evals, 33 feasible; max throughput seen 282 MSPS; best accuracy 12.22 bits; best feasible luts_plus_ffs=1350; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 42 evals, 16 feasible; max throughput seen 178 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=944; feasible ranges: data_width 14..16, n_iter 13..14, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The current front is dominated by pipelined_m with best area 944 (data_width=15, n_iter=14, m=4). pipelined is strictly worse on area (best 1350). unrolled_k has not been explored and could offer area savings through shared datapath with k=2..4 micro-rotations per cycle. The accuracy constraint (max_abs_err <= 2^-10) is met by all front designs (10.3-12.3 bits), so area is the binding objective. Exploring unrolled_k with moderate k (2-4) and n_iter 12-16 should reveal whether it can beat 944 LUTs+FFs while maintaining throughput >= 2 MSPS and sys_p99_latency <= 0.4us. The p99 latency constraint is easily met (best seen 0.0639us), so the main risk is throughput, but unrolled_k with k=2-4 should still achieve >2 MSPS at reasonable Fmax.*)
- `unrolled_k` (100 evals): data_width=12..16, n_iter=12..16, angle_guard=-1..2, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* pipelined_m dominates on area (944 vs 1350) but unrolled_k with k=2..4 could offer lower area at similar accuracy by sharing datapath across fewer cycles, potentially beating 944 LUTs+FFs while maintaining throughput >= 2 MSPS and p99 latency <= 0.4us. The current front only covers pipelined/pipelined_m; unrolled_k is unexplored and may shift the Pareto front toward lower area.

**Result (code):** 100 evaluations this round, 200 total; 49 feasible; hypervolume 4333 (+0.0%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `luts_plus_ffs` between 944 and 1199, which is significantly better than the best `pipelined` design (1350). The `unrolled_k` family yielded 0 feasible designs, likely due to throughput or latency constraints in the bursty scenario. The `iterative` family is not yet explored, but given that `pipelined_m` is already achieving very low area (944) and high throughput (>97 MSPS), it is unlikely to beat the current front significantly on the primary objective (min luts_plus_ffs) while maintaining the strict p99 latency constraint. The front currently covers accuracy_bits from 10.3 to 12.3. The constraint is max_abs_err <= 2^-10 (0.000976562), which corresponds to accuracy_bits >= 10. The current front satisfies this. To improve the hypervolume and find potentially cheaper designs, we should focus the search on the `pipelined_m` family in the region where it has already proven feasible and efficient. Specifically, we should narrow the ranges around the best-performing parameters: data_width 14-16, n_iter 13-14, angle_guard 0-2, frac_guard 0-2, and m 2-4. This will allow the optimizer to explore the trade-off space more densely in the promising region, potentially finding designs with lower area or better accuracy within the same area budget.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4333 (gain this round: +0.0%).
Feasible designs: 49 of 200 evaluations (32 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 42% violate; best seen 0.000134 (2^-12.86)
- sys_p99_latency_us <= 0.4: 50% violate; best seen 0.0639

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=944, accuracy_bits=10.3, luts=704, ffs=240, throughput_msps=97.8, max_abs_err=0.00081 (2^-10.27), power_index=0.071
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=988, accuracy_bits=10.3, luts=692, ffs=296, throughput_msps=124, max_abs_err=0.000795 (2^-10.30), power_index=0.0743
- pipelined_m [data_width=14 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=989, accuracy_bits=10.4, luts=747, ffs=242, throughput_msps=97.8, max_abs_err=0.000717 (2^-10.45), power_index=0.0744
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1021, accuracy_bits=10.7, luts=718, ffs=304, throughput_msps=124, max_abs_err=0.000581 (2^-10.75), power_index=0.0768
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1073, accuracy_bits=11.5, luts=759, ffs=315, throughput_msps=124, max_abs_err=0.000342 (2^-11.51), power_index=0.0808
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] luts_plus_ffs=1145, accuracy_bits=11.7, luts=820, ffs=325, throughput_msps=124, max_abs_err=0.000311 (2^-11.65), power_index=0.0861
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1199, accuracy_bits=12.3, luts=861, ffs=338, throughput_msps=124, max_abs_err=0.000204 (2^-12.26), power_index=0.0902
Front coverage: luts_plus_ffs 944..1199 (HV reference 3000); accuracy_bits 10.3..12.3 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 12.86 bits
- pipelined: 58 evals, 33 feasible; max throughput seen 282 MSPS; best accuracy 12.22 bits; best feasible luts_plus_ffs=1350; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 42 evals, 16 feasible; max throughput seen 178 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=944; feasible ranges: data_width 14..16, n_iter 13..14, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (200 evals): data_width=13..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (7 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 236 feasible; hypervolume 1.508e+04 (+248.0%).

**No LLM call** (code's front-mapping round): The current Pareto front is dominated by `pipelined_m` designs with `luts_plus_ffs` between 944 and 1199, which is significantly better than the best `pipelined` design (1350). The `unrolled_k` family yielded 0 feasible designs, likely due to throughput or latency constraints in the bursty scenario. The `iterative` family is not yet explored, but given that `pipelined_m` is already achieving very low area (944) and high throughput (>97 MSPS), it is unlikely to beat the current front significantly on the primary objective (min luts_plus_ffs) while maintaining the strict p99 latency constraint. The front currently covers accuracy_bits from 10.3 to 12.3. The constraint is max_abs_err <= 2^-10 (0.000976562), which corresponds to accuracy_bits >= 10. The current front satisfies this. To improve the hypervolume and find potentially cheaper designs, we should focus the search on the `pipelined_m` family in the region where it has already proven feasible and efficient. Specifically, we should narrow the ranges around the best-performing parameters: data_width 14-16, n_iter 13-14, angle_guard 0-2, frac_guard 0-2, and m 2-4. This will allow the optimizer to explore the trade-off space more densely in the promising region, potentially finding designs with lower area or better accuracy within the same area budget.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.508e+04 (gain this round: +248.0%).
Feasible designs: 236 of 400 evaluations (206 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 24% violate; best seen 5.42e-08 (2^-24.14)
- sys_p99_latency_us <= 0.4: 25% violate; best seen 0.0639

Pareto front (feasible, 29 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=4 frac_guard=0 rounding=round m=4] luts_plus_ffs=843, accuracy_bits=10.3, luts=643, ffs=200, throughput_msps=93.6, max_abs_err=0.000807 (2^-10.27), power_index=0.0634
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=5] luts_plus_ffs=960, accuracy_bits=11.5, luts=759, ffs=202, throughput_msps=80.6, max_abs_err=0.000342 (2^-11.51), power_index=0.0723
- pipelined_m [data_width=16 n_iter=15 angle_guard=2 frac_guard=4 rounding=round m=8] luts_plus_ffs=1141, accuracy_bits=12.8, luts=983, ffs=157, throughput_msps=50.3, max_abs_err=0.00014 (2^-12.80), power_index=0.0858
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1218, accuracy_bits=13.6, luts=1038, ffs=180, throughput_msps=50.3, max_abs_err=7.88e-05 (2^-13.63), power_index=0.0916
- pipelined_m [data_width=19 n_iter=16 angle_guard=4 frac_guard=4 rounding=trunc m=8] luts_plus_ffs=1374, accuracy_bits=14.6, luts=1191, ffs=184, throughput_msps=48, max_abs_err=3.9e-05 (2^-14.64), power_index=0.103
- pipelined_m [data_width=25 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1816, accuracy_bits=16.9, luts=1510, ffs=306, throughput_msps=48, max_abs_err=8.05e-06 (2^-16.92), power_index=0.137
- pipelined_m [data_width=26 n_iter=21 angle_guard=-2 frac_guard=2 rounding=round m=8] luts_plus_ffs=2186, accuracy_bits=18.7, luts=1873, ffs=314, throughput_msps=45.9, max_abs_err=2.32e-06 (2^-18.72), power_index=0.164
- pipelined_m [data_width=25 n_iter=21 angle_guard=4 frac_guard=2 rounding=round m=8] luts_plus_ffs=2254, accuracy_bits=19.8, luts=1934, ffs=321, throughput_msps=45.9, max_abs_err=1.11e-06 (2^-19.78), power_index=0.17
- pipelined_m [data_width=26 n_iter=23 angle_guard=2 frac_guard=3 rounding=trunc m=5] luts_plus_ffs=2654, accuracy_bits=21.3, luts=2138, ffs=516, throughput_msps=70.6, max_abs_err=3.78e-07 (2^-21.34), power_index=0.2
- pipelined_m [data_width=28 n_iter=26 angle_guard=4 frac_guard=2 rounding=round m=6] luts_plus_ffs=3200, accuracy_bits=24.1, luts=2646, ffs=554, throughput_msps=57.5, max_abs_err=5.42e-08 (2^-24.14), power_index=0.241
Front coverage: luts_plus_ffs 843..3200 (HV reference 3000); accuracy_bits 10.3..24.1 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 12.86 bits
- pipelined: 58 evals, 33 feasible; max throughput seen 282 MSPS; best accuracy 12.22 bits; best feasible luts_plus_ffs=1350; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 242 evals, 203 feasible; max throughput seen 178 MSPS; best accuracy 24.14 bits; best feasible luts_plus_ffs=843; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 9013 in, 2821 out
- provider-reported cost: $0.0066
- full prompts and replies: `llm_trace.jsonl`

