# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec multiaxis_control: Shared sin/cos unit for a 16-axis motor-control loop: a 1 MHz control tick issues 32 requests at once (Park + inverse Park per axis); all 32 results must be back within 0.44 us of the tick (p99 over ticks). Max error <= 2^-12. Minimise LUTs + FFs.
  constraint: throughput_msps >= 32
  constraint: max_abs_err <= 0.000244141
  constraint: sys_p99_batch_us <= 0.44
  objective: min luts_plus_ffs (HV ref 4000)
  objective: max accuracy_bits (HV ref 12)
  select: min luts_plus_ffs
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average)
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 834 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 270 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 61.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.33 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000209 (2^-12.22) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.43 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.44e-05 (2^-13.92) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.06 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.2 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 93.3 dBc, SNR 81.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (29 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` | 834 | 270 | 97.8 | 6 | 1.33 | 0.000209 (2^-12.22) | 12.22 |
| 1 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=round,m=4` | 861 | 276 | 97.8 | 6 | 1.37 | 0.000204 (2^-12.26) | 12.26 |
| 2 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 863 | 280 | 97.8 | 6 | 1.38 | 0.000192 (2^-12.35) | 12.35 |
| 3 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 855 | 291 | 93.6 | 6 | 1.38 | 0.00017 (2^-12.53) | 12.53 |
| 4 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 882 | 297 | 93.6 | 6 | 1.42 | 0.000166 (2^-12.55) | 12.55 |
| 5 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 909 | 303 | 93.6 | 6 | 1.46 | 0.000156 (2^-12.65) | 12.65 |
| 6 | `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 909 | 307 | 93.6 | 6 | 1.46 | 0.000148 (2^-12.72) | 12.72 |
| 7 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 935 | 289 | 93.6 | 6 | 1.47 | 0.000143 (2^-12.77) | 12.77 |
| 8 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=4` | 941 | 285 | 93.6 | 6 | 1.48 | 0.00013 (2^-12.91) | 12.91 |
| 9 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=4` | 949 | 301 | 93.6 | 6 | 1.5 | 8.66e-05 (2^-13.50) | 13.50 |
| 10 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round,m=4` | 985 | 291 | 93.6 | 6 | 1.54 | 8.35e-05 (2^-13.55) | 13.55 |
| 11 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1008 | 313 | 93.6 | 6 | 1.59 | 8.04e-05 (2^-13.60) | 13.60 |
| 12 | `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1023 | 317 | 93.6 | 6 | 1.61 | 7.77e-05 (2^-13.65) | 13.65 |
| 13 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1048 | 307 | 93.6 | 6 | 1.63 | 6.44e-05 (2^-13.92) | 13.92 |
| 14 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1086 | 305 | 93.6 | 6 | 1.67 | 5.46e-05 (2^-14.16) | 14.16 |
| 15 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1089 | 309 | 93.6 | 6 | 1.68 | 5.25e-05 (2^-14.22) | 14.22 |
| 16 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1096 | 317 | 93.6 | 6 | 1.7 | 4.81e-05 (2^-14.34) | 14.34 |
| 17 | `pipelined_m:data_width=19,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 1112 | 321 | 93.6 | 6 | 1.72 | 4.67e-05 (2^-14.39) | 14.39 |
| 18 | `pipelined_m:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1169 | 387 | 93.6 | 7 | 1.87 | 3.81e-05 (2^-14.68) | 14.68 |
| 19 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc,m=3` | 1259 | 468 | 119.3 | 8 | 2.08 | 2.4e-05 (2^-15.35) | 15.35 |
| 20 | `pipelined_m:data_width=21,n_iter=21,angle_guard=3,frac_guard=0,rounding=round,m=4` | 1523 | 484 | 89.6 | 8 | 2.42 | 1.15e-05 (2^-16.41) | 16.41 |
| 21 | `pipelined_m:data_width=22,n_iter=21,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1565 | 498 | 89.6 | 8 | 2.48 | 5.49e-06 (2^-17.47) | 17.47 |
| 22 | `pipelined_m:data_width=22,n_iter=21,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1632 | 504 | 89.6 | 8 | 2.57 | 4.62e-06 (2^-17.72) | 17.72 |
| 23 | `pipelined_m:data_width=22,n_iter=21,angle_guard=1,frac_guard=4,rounding=round,m=4` | 1759 | 535 | 89.6 | 8 | 2.76 | 3.73e-06 (2^-18.03) | 18.03 |
| 24 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1906 | 549 | 89.6 | 8 | 2.96 | 1.76e-06 (2^-19.11) | 19.11 |
| 25 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1953 | 559 | 89.6 | 8 | 3.02 | 1.14e-06 (2^-19.74) | 19.74 |
| 26 | `pipelined_m:data_width=28,n_iter=23,angle_guard=-2,frac_guard=3,rounding=trunc,m=3` | 2184 | 817 | 105.9 | 10 | 3.61 | 6.95e-07 (2^-20.46) | 20.46 |
| 27 | `pipelined_m:data_width=28,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc,m=2` | 2307 | 1263 | 152.6 | 15 | 4.3 | 2.55e-07 (2^-21.91) | 21.91 |
| 28 | `pipelined_m:data_width=27,n_iter=27,angle_guard=2,frac_guard=3,rounding=round,m=3` | 2665 | 922 | 110.0 | 11 | 4.32 | 9.01e-08 (2^-23.40) | 23.40 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires a shared sin/cos unit for a 16-axis motor control loop with a 1MHz tick issuing 32 requests at once. All 32 results must return within 0.44us. This implies a high throughput requirement (32 Msps) and low latency for the burst. The 'iterative' and 'unrolled_k' families produce one result every several cycles, which would cause the 32-request burst to take many cycles to clear, likely violating the 0.44us batch latency constraint (e.g., iterative at 100MHz takes ~30 cycles for one result, so 32 results would take ~960 cycles = 9.6us, far exceeding 0.44us). Therefore, we must use 'pipelined' or 'pipelined_m' which provide 1 result/cycle. We allocate 50% of the budget to each to explore the area/latency trade-off. We constrain data_width and n_iter to the minimum values that satisfy max_abs_err <= 2^-12 (approx 0.000244) to minimize area, as 'min luts_plus_ffs' is the selection objective. We expect data_width ~14-16 and n_iter ~12-14 to be sufficient for 12-bit accuracy.*)
- `pipelined` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* The system requires 32 results within 0.44us of a 1us tick. Only pipelined/pipelined_m architectures provide 1 result/cycle throughput, which is necessary to clear a 32-deep burst quickly. Pipelined is the baseline for this high-throughput requirement. We restrict data_width to 14-18 and n_iter to 12-16 to satisfy the max_abs_err <= 2^-12 constraint while keeping area low. We focus on the lower end of these ranges to minimize luts_plus_ffs, which is the primary selection objective.
- `pipelined_m` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Pipelined_m offers a trade-off between area and latency/throughput. By registering every m stages, it can potentially reduce area (fewer FFs) compared to fully pipelined while still maintaining 1 result/cycle throughput. This is critical for the 32-request burst. We search m=2..4 to find the sweet spot where area is minimized without violating the 0.44us batch latency constraint. The same accuracy constraints (data_width, n_iter) apply as with pipelined.

**Result (code):** 100 evaluations this round, 100 total; 62 feasible; hypervolume 4529 (n/a).

**LLM decision:** `add_family` — Round 1 found a feasible front with best luts_plus_ffs=1145 (pipelined_m, 12.03 bits accuracy). The front is narrow in data_width (all 18) and accuracy (12-13.7 bits). unrolled_k has not been explored and may offer better area efficiency by using fewer pipeline registers while maintaining high throughput (k rotations/cycle). The current pipelined_m designs use m=2-4, but unrolled_k with k=2-8 might achieve similar throughput with less area overhead. Also refining pipelined_m around the current best region will help map the front more completely. The accuracy constraint (max_abs_err <= 2^-12) is tight - 38% of evals violated it - so we need to ensure sufficient n_iter and guard bits. The throughput constraint (>=32 MSPS) is easily met by all pipelined families, so area is the binding constraint.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 4529 (gain this round: n/a (first round)).
Feasible designs: 62 of 100 evaluations (39 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 273
- max_abs_err <= 0.000244141: 38% violate; best seen 7.47e-05 (2^-13.71)
- sys_p99_batch_us <= 0.44: 0% violate; best seen 0.161

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1145, accuracy_bits=12, luts=855, ffs=291, throughput_msps=93.6, max_abs_err=0.00024 (2^-12.03), power_index=1.38
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1212, accuracy_bits=12.6, luts=909, ffs=303, throughput_msps=93.6, max_abs_err=0.000156 (2^-12.65), power_index=1.46
- pipelined_m [data_width=18 n_iter=15 angle_guard=0 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1244, accuracy_bits=12.8, luts=949, ffs=295, throughput_msps=93.6, max_abs_err=0.000145 (2^-12.75), power_index=1.5
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1349, accuracy_bits=13.4, luts=979, ffs=370, throughput_msps=119, max_abs_err=9.49e-05 (2^-13.36), power_index=1.62
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=round m=2] luts_plus_ffs=1638, accuracy_bits=13.7, luts=1071, ffs=567, throughput_msps=164, max_abs_err=7.47e-05 (2^-13.71), power_index=1.97
Front coverage: luts_plus_ffs 1145..1638 (HV reference 4000); accuracy_bits 12..13.7 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 13.25 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 26 feasible; max throughput seen 171 MSPS; best accuracy 13.71 bits; best feasible luts_plus_ffs=1145; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Round 1 found a feasible front with best luts_plus_ffs=1145 (pipelined_m, 12.03 bits accuracy). The front is narrow in data_width (all 18) and accuracy (12-13.7 bits). unrolled_k has not been explored and may offer better area efficiency by using fewer pipeline registers while maintaining high throughput (k rotations/cycle). The current pipelined_m designs use m=2-4, but unrolled_k with k=2-8 might achieve similar throughput with less area overhead. Also refining pipelined_m around the current best region will help map the front more completely. The accuracy constraint (max_abs_err <= 2^-12) is tight - 38% of evals violated it - so we need to ensure sufficient n_iter and guard bits. The throughput constraint (>=32 MSPS) is easily met by all pipelined families, so area is the binding constraint.*)
- `unrolled_k` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..8. *Why:* unrolled_k can achieve high throughput with fewer FFs than pipelined_m by chaining k rotations per cycle without full pipeline registers. This may yield lower luts_plus_ffs for the same accuracy/throughput, potentially beating the current best of 1145.
- `pipelined_m` (50 evals): data_width=16..18, n_iter=14..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Refine the existing pipelined_m front around the current best designs (data_width 16-18, n_iter 14-16) to fill in the accuracy vs area trade-off curve more densely, especially in the 12-13.5 accuracy_bits range where the front is sparse.

**Result (code):** 100 evaluations this round, 200 total; 99 feasible; hypervolume 5913 (+30.5%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `m=4`, `data_width` 16-18, and `n_iter` 14-16. The `unrolled_k` family is infeasible (max throughput 13.5 MSPS < 32 MSPS constraint). The `pipelined` family is feasible but significantly larger (best 1661 LUTs+FFs vs 1104 for `pipelined_m`). The `iterative` family is not yet explored, but given its 1 result/cycle latency structure (N+3 cycles), it is highly likely to fail the throughput constraint (32 MSPS) unless N is very small, which would violate accuracy. More importantly, the `pipelined_m` family with `m=4` is clearly the most efficient. The current front covers `luts_plus_ffs` 1104..1391 and `accuracy_bits` 12.2..14.2. The accuracy constraint is `max_abs_err <= 2^-12` (approx 12 bits), and the front already extends to 14.2 bits, providing a good trade-off curve. The area constraint is the primary objective for selection (`min luts_plus_ffs`), and the best design is 1104. To improve hypervolume and ensure the front is well-mapped, we should focus the search on the `pipelined_m` family with `m=4` (which appears optimal for area) and slightly widen the `n_iter` and `data_width` ranges to see if we can find designs with lower area or higher accuracy within the same area budget. Specifically, `n_iter=14` with `data_width=16` gives the lowest area (1104) but only 12.2 bits accuracy. `n_iter=16` with `data_width=18` gives 14.2 bits but higher area (1391). There might be a sweet spot in between or with different `angle_guard`/`frac_guard` combinations that yields better accuracy for the same area or lower area for the same accuracy. We will refine the search to `pipelined_m` with `m=4`, `data_width` 16-19, `n_iter` 14-17, `angle_guard` 1-3, `frac_guard` 0-2, and `rounding` round/trunc.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 5913 (gain this round: +30.5%).
Feasible designs: 99 of 200 evaluations (65 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 25% violate; best seen 273
- max_abs_err <= 0.000244141: 48% violate; best seen 5.46e-05 (2^-14.16)
- sys_p99_batch_us <= 0.44: 25% violate; best seen 0.161

Pareto front (feasible, 9 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=1.33
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1144, accuracy_bits=12.3, luts=863, ffs=280, throughput_msps=97.8, max_abs_err=0.000192 (2^-12.35), power_index=1.38
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1145, accuracy_bits=12.5, luts=855, ffs=291, throughput_msps=93.6, max_abs_err=0.00017 (2^-12.53), power_index=1.38
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1179, accuracy_bits=12.6, luts=882, ffs=297, throughput_msps=93.6, max_abs_err=0.000166 (2^-12.55), power_index=1.42
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1212, accuracy_bits=12.6, luts=909, ffs=303, throughput_msps=93.6, max_abs_err=0.000156 (2^-12.65), power_index=1.46
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1219, accuracy_bits=12.7, luts=920, ffs=299, throughput_msps=93.6, max_abs_err=0.000152 (2^-12.68), power_index=1.47
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.9, luts=941, ffs=285, throughput_msps=93.6, max_abs_err=0.00013 (2^-12.91), power_index=1.48
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1276, accuracy_bits=13.5, luts=985, ffs=291, throughput_msps=93.6, max_abs_err=8.35e-05 (2^-13.55), power_index=1.54
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1391, accuracy_bits=14.2, luts=1086, ffs=305, throughput_msps=93.6, max_abs_err=5.46e-05 (2^-14.16), power_index=1.67
Front coverage: luts_plus_ffs 1104..1391 (HV reference 4000); accuracy_bits 12.2..14.2 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 50 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 13.60 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 13.25 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 100 evals, 63 feasible; max throughput seen 171 MSPS; best accuracy 14.16 bits; best feasible luts_plus_ffs=1104; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine search to pipelined_m m=4 to map the front more densely in the promising region.*)
- `pipelined_m` (40 evals): data_width=16..19, n_iter=14..17, angle_guard=1..3, frac_guard=0..2, rounding=trunc|round, m=4..4. *Why:* Focus on the most efficient family and parameter region identified so far.

**Result (code):** 40 evaluations this round, 240 total; 137 feasible; hypervolume 7253 (+22.7%).

**LLM decision:** `stop` — The Pareto front is well-established and feasible. The minimum area design (pipelined_m, 1104 LUTs+FFs) meets all constraints: throughput 97.8 MSPS >= 32, max_abs_err 2^-12.22 <= 2^-12, and sys_p99_batch_us is comfortably within the 0.44 us bound (best seen 0.161 us). The front covers a reasonable range of accuracy (12.2 to 14.7 bits) and area (1104 to 1556). Since this is the final round, we stop and let the system simulation (L2) validate the top designs from this front.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7253 (gain this round: +22.7%).
Feasible designs: 137 of 240 evaluations (96 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 21% violate; best seen 273
- max_abs_err <= 0.000244141: 40% violate; best seen 3.81e-05 (2^-14.68)
- sys_p99_batch_us <= 0.44: 21% violate; best seen 0.161

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=1.33
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1144, accuracy_bits=12.3, luts=863, ffs=280, throughput_msps=97.8, max_abs_err=0.000192 (2^-12.35), power_index=1.38
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1179, accuracy_bits=12.6, luts=882, ffs=297, throughput_msps=93.6, max_abs_err=0.000166 (2^-12.55), power_index=1.42
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1216, accuracy_bits=12.7, luts=909, ffs=307, throughput_msps=93.6, max_abs_err=0.000148 (2^-12.72), power_index=1.46
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.9, luts=941, ffs=285, throughput_msps=93.6, max_abs_err=0.00013 (2^-12.91), power_index=1.48
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1276, accuracy_bits=13.5, luts=985, ffs=291, throughput_msps=93.6, max_abs_err=8.35e-05 (2^-13.55), power_index=1.54
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1340, accuracy_bits=13.7, luts=1023, ffs=317, throughput_msps=93.6, max_abs_err=7.77e-05 (2^-13.65), power_index=1.61
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1391, accuracy_bits=14.2, luts=1086, ffs=305, throughput_msps=93.6, max_abs_err=5.46e-05 (2^-14.16), power_index=1.67
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1413, accuracy_bits=14.3, luts=1096, ffs=317, throughput_msps=93.6, max_abs_err=4.81e-05 (2^-14.34), power_index=1.7
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1556, accuracy_bits=14.7, luts=1169, ffs=387, throughput_msps=93.6, max_abs_err=3.81e-05 (2^-14.68), power_index=1.87
Front coverage: luts_plus_ffs 1104..1556 (HV reference 4000); accuracy_bits 12.2..14.7 (HV reference 12); data_width on the front 16..19 (registry 8..28).

Per family:
- unrolled_k: 50 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 13.60 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 13.25 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 140 evals, 101 feasible; max throughput seen 171 MSPS; best accuracy 14.68 bits; best feasible luts_plus_ffs=1104; feasible ranges: data_width 16..19, n_iter 14..17, angle_guard 0..3, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (19 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 234 feasible; hypervolume 1.85e+04 (+155.0%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established and feasible. The minimum area design (pipelined_m, 1104 LUTs+FFs) meets all constraints: throughput 97.8 MSPS >= 32, max_abs_err 2^-12.22 <= 2^-12, and sys_p99_batch_us is comfortably within the 0.44 us bound (best seen 0.161 us). The front covers a reasonable range of accuracy (12.2 to 14.7 bits) and area (1104 to 1556). Since this is the final round, we stop and let the system simulation (L2) validate the top designs from this front.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.85e+04 (gain this round: +155.0%).
Feasible designs: 234 of 400 evaluations (184 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 12% violate; best seen 273
- max_abs_err <= 0.000244141: 28% violate; best seen 9.01e-08 (2^-23.40)
- sys_p99_batch_us <= 0.44: 26% violate; best seen 0.161

Pareto front (feasible, 29 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=1.33
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1145, accuracy_bits=12.5, luts=855, ffs=291, throughput_msps=93.6, max_abs_err=0.00017 (2^-12.53), power_index=1.38
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1216, accuracy_bits=12.7, luts=909, ffs=307, throughput_msps=93.6, max_abs_err=0.000148 (2^-12.72), power_index=1.46
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1250, accuracy_bits=13.5, luts=949, ffs=301, throughput_msps=93.6, max_abs_err=8.66e-05 (2^-13.50), power_index=1.5
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1340, accuracy_bits=13.7, luts=1023, ffs=317, throughput_msps=93.6, max_abs_err=7.77e-05 (2^-13.65), power_index=1.61
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1413, accuracy_bits=14.3, luts=1096, ffs=317, throughput_msps=93.6, max_abs_err=4.81e-05 (2^-14.34), power_index=1.7
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1727, accuracy_bits=15.3, luts=1259, ffs=468, throughput_msps=119, max_abs_err=2.4e-05 (2^-15.35), power_index=2.08
- pipelined_m [data_width=22 n_iter=21 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=2137, accuracy_bits=17.7, luts=1632, ffs=504, throughput_msps=89.6, max_abs_err=4.62e-06 (2^-17.72), power_index=2.57
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2512, accuracy_bits=19.7, luts=1953, ffs=559, throughput_msps=89.6, max_abs_err=1.14e-06 (2^-19.74), power_index=3.02
- pipelined_m [data_width=27 n_iter=27 angle_guard=2 frac_guard=3 rounding=round m=3] luts_plus_ffs=3587, accuracy_bits=23.4, luts=2665, ffs=922, throughput_msps=110, max_abs_err=9.01e-08 (2^-23.40), power_index=4.32
Front coverage: luts_plus_ffs 1104..3587 (HV reference 4000); accuracy_bits 12.2..23.4 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 50 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 13.60 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 13.25 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 300 evals, 198 feasible; max throughput seen 171 MSPS; best accuracy 23.40 bits; best feasible luts_plus_ffs=1104; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 12262 in, 3411 out
- provider-reported cost: $0.0070
- full prompts and replies: `llm_trace.jsonl`

