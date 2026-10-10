# DSE run: bursty_offload

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
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
`pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 631 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 199 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 5 | exact: schedule |
| latency_ns | 51.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0624 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000887 (2^-10.14) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 14.5 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.00023 (2^-12.08) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 3.77 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.1 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 5 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.9 dBc, SNR 69.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=17,n_iter=12,angle_guard=3,frac_guard=0,rounding=round,m=5` | 0.1429 → 0.183 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (30 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=4` | 631 | 199 | 97.8 | 5 | 0.0624 | 0.000887 (2^-10.14) | 10.14 |
| 1 | `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=4` | 643 | 202 | 97.8 | 5 | 0.0635 | 0.000661 (2^-10.56) | 10.56 |
| 2 | `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 666 | 206 | 97.8 | 5 | 0.0656 | 0.000649 (2^-10.59) | 10.59 |
| 3 | `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=1,rounding=round,m=4` | 700 | 208 | 97.8 | 5 | 0.0683 | 0.000624 (2^-10.65) | 10.65 |
| 4 | `pipelined_m:data_width=17,n_iter=12,angle_guard=3,frac_guard=0,rounding=round,m=5` | 701 | 219 | 77.0 | 5 | 0.0692 | 0.000548 (2^-10.83) | 10.83 |
| 5 | `pipelined_m:data_width=16,n_iter=13,angle_guard=0,frac_guard=0,rounding=round,m=4` | 688 | 254 | 97.8 | 6 | 0.0709 | 0.000492 (2^-10.99) | 10.99 |
| 6 | `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round,m=4` | 701 | 258 | 97.8 | 6 | 0.0721 | 0.000417 (2^-11.23) | 11.23 |
| 7 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 759 | 258 | 97.8 | 6 | 0.0765 | 0.000342 (2^-11.51) | 11.51 |
| 8 | `pipelined_m:data_width=19,n_iter=13,angle_guard=-1,frac_guard=3,rounding=trunc,m=8` | 865 | 172 | 50.3 | 4 | 0.078 | 0.000293 (2^-11.73) | 11.73 |
| 9 | `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc,m=8` | 920 | 165 | 50.3 | 4 | 0.0817 | 0.000152 (2^-12.68) | 12.68 |
| 10 | `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=2,rounding=trunc,m=8` | 979 | 169 | 50.3 | 4 | 0.0864 | 0.000127 (2^-12.94) | 12.94 |
| 11 | `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=3,rounding=trunc,m=8` | 1008 | 172 | 50.3 | 4 | 0.0888 | 0.000125 (2^-12.97) | 12.97 |
| 12 | `pipelined_m:data_width=20,n_iter=15,angle_guard=-1,frac_guard=2,rounding=round,m=7` | 1065 | 250 | 56.8 | 5 | 0.099 | 9.27e-05 (2^-13.40) | 13.40 |
| 13 | `pipelined_m:data_width=21,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 1159 | 190 | 48.0 | 4 | 0.101 | 3.79e-05 (2^-14.69) | 14.69 |
| 14 | `pipelined_m:data_width=22,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=6` | 1237 | 274 | 62.5 | 5 | 0.114 | 3.23e-05 (2^-14.92) | 14.92 |
| 15 | `pipelined_m:data_width=21,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc,m=7` | 1277 | 260 | 54.3 | 5 | 0.116 | 2.55e-05 (2^-15.26) | 15.26 |
| 16 | `pipelined_m:data_width=25,n_iter=18,angle_guard=1,frac_guard=0,rounding=trunc,m=8` | 1474 | 302 | 48.0 | 5 | 0.134 | 8.31e-06 (2^-16.88) | 16.88 |
| 17 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=1,rounding=round,m=8` | 1553 | 274 | 48.0 | 5 | 0.137 | 5.57e-06 (2^-17.45) | 17.45 |
| 18 | `pipelined_m:data_width=24,n_iter=20,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 1647 | 298 | 48.0 | 5 | 0.146 | 3e-06 (2^-18.35) | 18.35 |
| 19 | `pipelined_m:data_width=24,n_iter=20,angle_guard=4,frac_guard=1,rounding=round,m=8` | 1738 | 306 | 45.9 | 5 | 0.154 | 2.38e-06 (2^-18.68) | 18.68 |
| 20 | `pipelined_m:data_width=28,n_iter=20,angle_guard=2,frac_guard=0,rounding=round,m=7` | 1847 | 338 | 52.0 | 5 | 0.164 | 1.95e-06 (2^-18.97) | 18.97 |
| 21 | `pipelined_m:data_width=24,n_iter=22,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1820 | 549 | 89.6 | 8 | 0.178 | 1.76e-06 (2^-19.11) | 19.11 |
| 22 | `pipelined_m:data_width=24,n_iter=23,angle_guard=1,frac_guard=2,rounding=trunc,m=5` | 1929 | 468 | 73.7 | 7 | 0.18 | 1.34e-06 (2^-19.51) | 19.51 |
| 23 | `pipelined_m:data_width=28,n_iter=23,angle_guard=1,frac_guard=0,rounding=trunc,m=8` | 2115 | 335 | 45.9 | 5 | 0.184 | 4.04e-07 (2^-21.24) | 21.24 |
| 24 | `pipelined_m:data_width=28,n_iter=23,angle_guard=2,frac_guard=1,rounding=trunc,m=6` | 2184 | 438 | 59.9 | 6 | 0.197 | 3.03e-07 (2^-21.66) | 21.66 |
| 25 | `pipelined_m:data_width=28,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc,m=5` | 2211 | 521 | 70.6 | 7 | 0.205 | 2.99e-07 (2^-21.67) | 21.67 |
| 26 | `pipelined_m:data_width=28,n_iter=26,angle_guard=-1,frac_guard=0,rounding=round,m=6` | 2350 | 511 | 59.9 | 7 | 0.215 | 2.81e-07 (2^-21.76) | 21.76 |
| 27 | `pipelined_m:data_width=28,n_iter=26,angle_guard=-1,frac_guard=1,rounding=round,m=6` | 2462 | 521 | 59.9 | 7 | 0.224 | 2.51e-07 (2^-21.93) | 21.93 |
| 28 | `pipelined_m:data_width=26,n_iter=30,angle_guard=4,frac_guard=1,rounding=round,m=8` | 2810 | 420 | 45.9 | 6 | 0.243 | 2.42e-07 (2^-21.98) | 21.98 |
| 29 | `pipelined_m:data_width=28,n_iter=26,angle_guard=1,frac_guard=4,rounding=round,m=4` | 2672 | 757 | 82.7 | 9 | 0.258 | 9.68e-08 (2^-23.30) | 23.30 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires 2 Msps throughput and 0.4us p99 latency for bursty traffic, which strongly favors pipelined architectures that produce 1 result/cycle. Iterative CORDIC is excluded as it cannot meet the throughput constraint. We focus on data_width 12-16 and n_iter 10-14 to satisfy the max_abs_err <= 2^-10 constraint while minimizing area. Pipelined is given the largest budget share as it's the most likely to meet all constraints, followed by pipelined_m which may reduce FF count, and unrolled_k as a secondary option.*)
- `pipelined` (50 evals): data_width=12..16, n_iter=10..14, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round. *Why:* Pipelined CORDIC provides 1 result/cycle throughput, which is essential to meet the 2 Msps throughput constraint and the tight 0.4us p99 latency for bursty traffic. It offers the best area/latency trade-off for this spec. We focus on data_width 12-16 and n_iter 10-14 to satisfy max_abs_err <= 2^-10 while minimizing area.
- `pipelined_m` (30 evals): data_width=12..16, n_iter=10..14, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* Pipelined_m reduces register count compared to fully pipelined by registering every m stages, potentially lowering FF count while maintaining 1 result/cycle throughput. This could yield a better luts_plus_ffs objective while still meeting the throughput and latency constraints.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=10..14, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, k=2..4. *Why:* Unrolled_k can achieve higher throughput than iterative with less area than fully pipelined. With k=2-4, it may meet the 2 Msps constraint while using fewer resources than pipelined. However, latency may be higher than pipelined, so it's a secondary candidate.

**Result (code):** 100 evaluations this round, 100 total; 52 feasible; hypervolume 2936 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `luts_plus_ffs` between 885 and 1226. The `pipelined` family achieved a best feasible cost of 1250, which is worse than the best `pipelined_m` design (885), and `unrolled_k` failed to produce any feasible designs (likely due to throughput or latency constraints in the bursty scenario, or simply poor area efficiency for this spec). The `iterative` family is not yet explored, but given that `pipelined_m` with m=3 already achieves 124 MSPS throughput (well above the 2 MSPS requirement) and low latency, and has the best area efficiency so far, it is the strongest candidate. The `pipelined` family's feasible region (data_width 15-16, n_iter 12-14) overlaps significantly with `pipelined_m`, but `pipelined_m` offers better area/latency trade-offs via the `m` parameter. To maximize hypervolume and find the true minimum area design, we should focus the search on the `pipelined_m` family, specifically narrowing the ranges around the current best feasible points (data_width 14-16, n_iter 12-14, m 2-4) to explore the trade-off between area and accuracy more densely. We will exclude `pipelined` and `unrolled_k` from the next round as they are dominated or infeasible, and defer `iterative` as it is unlikely to beat the pipelined architectures in area for this throughput requirement.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2936 (gain this round: n/a (first round)).
Feasible designs: 52 of 100 evaluations (29 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 37% violate; best seen 0.000342 (2^-11.51)
- sys_p99_latency_us <= 0.4: 20% violate; best seen 0.0639

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=885, accuracy_bits=10.1, luts=631, ffs=254, throughput_msps=124, max_abs_err=0.000887 (2^-10.14), power_index=0.0666
- pipelined_m [data_width=14 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=972, accuracy_bits=10.2, luts=733, ffs=238, throughput_msps=97.8, max_abs_err=0.000827 (2^-10.24), power_index=0.0731
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=974, accuracy_bits=11, luts=713, ffs=260, throughput_msps=97.8, max_abs_err=0.000498 (2^-10.97), power_index=0.0733
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=1166, accuracy_bits=11.1, luts=726, ffs=440, throughput_msps=171, max_abs_err=0.00046 (2^-11.09), power_index=0.0877
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=1205, accuracy_bits=11.3, luts=772, ffs=433, throughput_msps=171, max_abs_err=0.000401 (2^-11.28), power_index=0.0907
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=1226, accuracy_bits=11.5, luts=786, ffs=440, throughput_msps=171, max_abs_err=0.000344 (2^-11.50), power_index=0.0922
Front coverage: luts_plus_ffs 885..1226 (HV reference 3000); accuracy_bits 10.1..11.5 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.51 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1
- pipelined_m: 30 evals, 16 feasible; max throughput seen 178 MSPS; best accuracy 11.50 bits; best feasible luts_plus_ffs=885; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the remaining budget on `pipelined_m` with narrowed ranges around the known feasible region to refine the Pareto front and identify the minimum area design that meets the accuracy and system latency constraints.*)
- `pipelined_m` (100 evals): data_width=14..16, n_iter=12..14, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* Focus on the family with the best feasible designs (lowest luts_plus_ffs) and narrow the parameter space to the region where feasible designs were found to maximize search efficiency and hypervolume gain.

**Result (code):** 100 evaluations this round, 200 total; 135 feasible; hypervolume 3397 (+15.7%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `data_width=16` and `n_iter` between 12 and 14. The `pipelined` family is significantly more expensive (best 1250 LUT+FF vs 830 for `pipelined_m`) and does not appear on the front. `unrolled_k` failed to meet throughput constraints. The `iterative` family is not yet explored, but given the strict latency constraint (p99 <= 0.4 us) and the bursty nature (8 requests at 0ns), `iterative` (N+3 cycles) will likely have high latency per request, making it difficult to clear a burst of 8 without significant queuing or high clock rates that might not compensate for the area penalty compared to pipelined variants. The current front covers the area/accuracy trade-off well within the `pipelined_m` family. To maximize hypervolume and find the true minimum area point, we should refine the search around the current best region (`pipelined_m`, `data_width` 14-16, `n_iter` 12-14, `m` 2-4) to ensure we haven't missed a slightly better configuration (e.g., `m=3` vs `m=4` trade-offs or specific `angle_guard`/`frac_guard` combinations) that might push the area lower or accuracy higher. We do not need to widen to `iterative` yet as it is likely infeasible or dominated for this specific bursty latency/area spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3397 (gain this round: +15.7%).
Feasible designs: 135 of 200 evaluations (69 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 27% violate; best seen 0.000311 (2^-11.65)
- sys_p99_latency_us <= 0.4: 10% violate; best seen 0.0639

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=830, accuracy_bits=10.1, luts=631, ffs=199, throughput_msps=97.8, max_abs_err=0.000887 (2^-10.14), power_index=0.0624
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=872, accuracy_bits=10.6, luts=666, ffs=206, throughput_msps=97.8, max_abs_err=0.000649 (2^-10.59), power_index=0.0656
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=908, accuracy_bits=10.6, luts=700, ffs=208, throughput_msps=97.8, max_abs_err=0.000624 (2^-10.65), power_index=0.0683
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=942, accuracy_bits=11, luts=688, ffs=254, throughput_msps=97.8, max_abs_err=0.000492 (2^-10.99), power_index=0.0709
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=959, accuracy_bits=11.2, luts=701, ffs=258, throughput_msps=97.8, max_abs_err=0.000417 (2^-11.23), power_index=0.0721
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1017, accuracy_bits=11.5, luts=759, ffs=258, throughput_msps=97.8, max_abs_err=0.000342 (2^-11.51), power_index=0.0765
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] luts_plus_ffs=1145, accuracy_bits=11.7, luts=820, ffs=325, throughput_msps=124, max_abs_err=0.000311 (2^-11.65), power_index=0.0861
Front coverage: luts_plus_ffs 830..1145 (HV reference 3000); accuracy_bits 10.1..11.7 (HV reference 10); data_width on the front 16..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.51 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1
- pipelined_m: 130 evals, 99 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=830; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine the promising `pipelined_m` region to maximize hypervolume and identify the optimal trade-off point.*)
- `pipelined_m` (40 evals): data_width=14..16, n_iter=12..14, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* Focus the remaining budget on the dominant family to refine the Pareto front and ensure the minimum area point is found.

**Result (code):** 40 evaluations this round, 240 total; 166 feasible; hypervolume 3416 (+0.6%).

**LLM decision:** `stop` — The feasible Pareto front is well-established and stable (HV gain +0.6% in the final round). The front spans the required accuracy range (10.1 to 11.7 bits, all meeting the <= 2^-10 constraint) with a clear area trade-off (830 to 1086 LUTs+FFs). The selection rule (min luts_plus_ffs) points to the pipelined_m design with 830 LUTs+FFs, which comfortably meets the throughput (97.8 MSPS >= 2) and accuracy (10.1 bits >= 10) constraints. The system constraint (sys_p99_latency_us <= 0.4) is also met by the best designs (best seen 0.0639 us). Since this is the final round, the exploration is complete and the front is ready for L2 simulation and final selection.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 3416 (gain this round: +0.6%).
Feasible designs: 166 of 240 evaluations (80 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 26% violate; best seen 0.000311 (2^-11.65)
- sys_p99_latency_us <= 0.4: 8% violate; best seen 0.0639

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=830, accuracy_bits=10.1, luts=631, ffs=199, throughput_msps=97.8, max_abs_err=0.000887 (2^-10.14), power_index=0.0624
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=845, accuracy_bits=10.6, luts=643, ffs=202, throughput_msps=97.8, max_abs_err=0.000661 (2^-10.56), power_index=0.0635
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=872, accuracy_bits=10.6, luts=666, ffs=206, throughput_msps=97.8, max_abs_err=0.000649 (2^-10.59), power_index=0.0656
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=908, accuracy_bits=10.6, luts=700, ffs=208, throughput_msps=97.8, max_abs_err=0.000624 (2^-10.65), power_index=0.0683
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=942, accuracy_bits=11, luts=688, ffs=254, throughput_msps=97.8, max_abs_err=0.000492 (2^-10.99), power_index=0.0709
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=959, accuracy_bits=11.2, luts=701, ffs=258, throughput_msps=97.8, max_abs_err=0.000417 (2^-11.23), power_index=0.0721
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1017, accuracy_bits=11.5, luts=759, ffs=258, throughput_msps=97.8, max_abs_err=0.000342 (2^-11.51), power_index=0.0765
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0817
Front coverage: luts_plus_ffs 830..1086 (HV reference 3000); accuracy_bits 10.1..11.7 (HV reference 10); data_width on the front 16..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.51 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1
- pipelined_m: 170 evals, 130 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=830; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=15..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (8 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 320 feasible; hypervolume 1.524e+04 (+346.1%).

**No LLM call** (code's front-mapping round): The feasible Pareto front is well-established and stable (HV gain +0.6% in the final round). The front spans the required accuracy range (10.1 to 11.7 bits, all meeting the <= 2^-10 constraint) with a clear area trade-off (830 to 1086 LUTs+FFs). The selection rule (min luts_plus_ffs) points to the pipelined_m design with 830 LUTs+FFs, which comfortably meets the throughput (97.8 MSPS >= 2) and accuracy (10.1 bits >= 10) constraints. The system constraint (sys_p99_latency_us <= 0.4) is also met by the best designs (best seen 0.0639 us). Since this is the final round, the exploration is complete and the front is ready for L2 simulation and final selection.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.524e+04 (gain this round: +346.1%).
Feasible designs: 320 of 400 evaluations (229 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 17% violate; best seen 9.68e-08 (2^-23.30)
- sys_p99_latency_us <= 0.4: 5% violate; best seen 0.0639

Pareto front (feasible, 30 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=830, accuracy_bits=10.1, luts=631, ffs=199, throughput_msps=97.8, max_abs_err=0.000887 (2^-10.14), power_index=0.0624
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=908, accuracy_bits=10.6, luts=700, ffs=208, throughput_msps=97.8, max_abs_err=0.000624 (2^-10.65), power_index=0.0683
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=959, accuracy_bits=11.2, luts=701, ffs=258, throughput_msps=97.8, max_abs_err=0.000417 (2^-11.23), power_index=0.0721
- pipelined_m [data_width=19 n_iter=15 angle_guard=-1 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1148, accuracy_bits=12.9, luts=979, ffs=169, throughput_msps=50.3, max_abs_err=0.000127 (2^-12.94), power_index=0.0864
- pipelined_m [data_width=21 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1349, accuracy_bits=14.7, luts=1159, ffs=190, throughput_msps=48, max_abs_err=3.79e-05 (2^-14.69), power_index=0.101
- pipelined_m [data_width=25 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1776, accuracy_bits=16.9, luts=1474, ffs=302, throughput_msps=48, max_abs_err=8.31e-06 (2^-16.88), power_index=0.134
- pipelined_m [data_width=24 n_iter=20 angle_guard=4 frac_guard=1 rounding=round m=8] luts_plus_ffs=2043, accuracy_bits=18.7, luts=1738, ffs=306, throughput_msps=45.9, max_abs_err=2.38e-06 (2^-18.68), power_index=0.154
- pipelined_m [data_width=28 n_iter=23 angle_guard=1 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=2450, accuracy_bits=21.2, luts=2115, ffs=335, throughput_msps=45.9, max_abs_err=4.04e-07 (2^-21.24), power_index=0.184
- pipelined_m [data_width=28 n_iter=26 angle_guard=-1 frac_guard=0 rounding=round m=6] luts_plus_ffs=2860, accuracy_bits=21.8, luts=2350, ffs=511, throughput_msps=59.9, max_abs_err=2.81e-07 (2^-21.76), power_index=0.215
- pipelined_m [data_width=28 n_iter=26 angle_guard=1 frac_guard=4 rounding=round m=4] luts_plus_ffs=3429, accuracy_bits=23.3, luts=2672, ffs=757, throughput_msps=82.7, max_abs_err=9.68e-08 (2^-23.30), power_index=0.258
Front coverage: luts_plus_ffs 830..3429 (HV reference 3000); accuracy_bits 10.1..23.3 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.51 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 282 MSPS; best accuracy 11.36 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..1, frac_guard 0..1
- pipelined_m: 330 evals, 284 feasible; max throughput seen 178 MSPS; best accuracy 23.30 bits; best feasible luts_plus_ffs=830; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 11938 in, 2954 out
- provider-reported cost: $0.0075
- full prompts and replies: `llm_trace.jsonl`

