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
`pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=3,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 744 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 214 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 5 | exact: schedule |
| latency_ns | 53.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0721 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000556 (2^-10.81) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 4.55 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000203 (2^-12.27) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.66 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.8 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 5 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.0 dBc, SNR 70.8 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=3,rounding=round,m=4` | 0.1176 → 0.1412 | yes |
| `pipelined_m:data_width=15,n_iter=15,angle_guard=4,frac_guard=1,rounding=round,m=8` | 0.199 → 0.2825 | yes |
| `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 0.1226 → 0.1453 | yes |
| `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=0,rounding=round,m=4` | 0.1283 → 0.1519 | yes |
| `pipelined_m:data_width=14,n_iter=16,angle_guard=4,frac_guard=3,rounding=round,m=8` | 0.1896 → 0.2667 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (33 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=3,rounding=round,m=4` | 744 | 214 | 93.6 | 5 | 0.0721 | 0.000556 (2^-10.81) | 10.81 |
| 1 | `pipelined_m:data_width=15,n_iter=15,angle_guard=4,frac_guard=1,rounding=round,m=8` | 878 | 147 | 50.3 | 4 | 0.0771 | 0.000346 (2^-11.50) | 11.50 |
| 2 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 786 | 264 | 97.8 | 6 | 0.079 | 0.000344 (2^-11.50) | 11.50 |
| 3 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=0,rounding=round,m=4` | 786 | 266 | 93.6 | 6 | 0.0792 | 0.000294 (2^-11.73) | 11.73 |
| 4 | `pipelined_m:data_width=14,n_iter=16,angle_guard=4,frac_guard=3,rounding=round,m=8` | 952 | 143 | 52.7 | 4 | 0.0824 | 0.000248 (2^-11.98) | 11.98 |
| 5 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=4` | 847 | 274 | 93.6 | 6 | 0.0844 | 0.000225 (2^-12.12) | 12.12 |
| 6 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=3,rounding=trunc,m=4` | 868 | 285 | 93.6 | 6 | 0.0867 | 0.000209 (2^-12.23) | 12.23 |
| 7 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=6` | 1136 | 248 | 65.4 | 5 | 0.104 | 4.29e-05 (2^-14.51) | 14.51 |
| 8 | `pipelined_m:data_width=19,n_iter=19,angle_guard=3,frac_guard=1,rounding=round,m=8` | 1335 | 247 | 50.3 | 5 | 0.119 | 2.28e-05 (2^-15.42) | 15.42 |
| 9 | `pipelined_m:data_width=22,n_iter=19,angle_guard=-1,frac_guard=1,rounding=trunc,m=7` | 1390 | 266 | 54.3 | 5 | 0.125 | 1.52e-05 (2^-16.01) | 16.01 |
| 10 | `pipelined_m:data_width=24,n_iter=20,angle_guard=1,frac_guard=0,rounding=round,m=8` | 1587 | 291 | 48.0 | 5 | 0.141 | 3.1e-06 (2^-18.30) | 18.30 |
| 11 | `pipelined_m:data_width=24,n_iter=20,angle_guard=2,frac_guard=0,rounding=round,m=8` | 1607 | 294 | 48.0 | 5 | 0.143 | 2.84e-06 (2^-18.42) | 18.42 |
| 12 | `pipelined_m:data_width=26,n_iter=20,angle_guard=-1,frac_guard=1,rounding=trunc,m=8` | 1707 | 311 | 45.9 | 5 | 0.152 | 2.57e-06 (2^-18.57) | 18.57 |
| 13 | `pipelined_m:data_width=25,n_iter=20,angle_guard=1,frac_guard=2,rounding=trunc,m=8` | 1727 | 310 | 45.9 | 5 | 0.153 | 2.39e-06 (2^-18.67) | 18.67 |
| 14 | `pipelined_m:data_width=25,n_iter=20,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 1747 | 313 | 45.9 | 5 | 0.155 | 2.21e-06 (2^-18.79) | 18.79 |
| 15 | `pipelined_m:data_width=25,n_iter=20,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 1767 | 316 | 45.9 | 5 | 0.157 | 2.2e-06 (2^-18.79) | 18.79 |
| 16 | `pipelined_m:data_width=25,n_iter=20,angle_guard=4,frac_guard=2,rounding=trunc,m=8` | 1787 | 319 | 45.9 | 5 | 0.158 | 2.12e-06 (2^-18.85) | 18.85 |
| 17 | `pipelined_m:data_width=25,n_iter=20,angle_guard=4,frac_guard=4,rounding=trunc,m=8` | 1867 | 327 | 45.9 | 5 | 0.165 | 2.05e-06 (2^-18.90) | 18.90 |
| 18 | `pipelined_m:data_width=28,n_iter=20,angle_guard=1,frac_guard=2,rounding=trunc,m=8` | 1907 | 343 | 45.9 | 5 | 0.169 | 1.95e-06 (2^-18.97) | 18.97 |
| 19 | `pipelined_m:data_width=25,n_iter=22,angle_guard=4,frac_guard=0,rounding=round,m=6` | 1886 | 398 | 59.9 | 6 | 0.172 | 1.06e-06 (2^-19.85) | 19.85 |
| 20 | `pipelined_m:data_width=26,n_iter=23,angle_guard=3,frac_guard=0,rounding=trunc,m=8` | 2022 | 319 | 45.9 | 5 | 0.176 | 8.51e-07 (2^-20.16) | 20.16 |
| 21 | `pipelined_m:data_width=28,n_iter=23,angle_guard=0,frac_guard=0,rounding=round,m=8` | 2092 | 332 | 45.9 | 5 | 0.182 | 3.52e-07 (2^-21.44) | 21.44 |
| 22 | `pipelined_m:data_width=26,n_iter=23,angle_guard=3,frac_guard=2,rounding=round,m=8` | 2170 | 329 | 45.9 | 5 | 0.188 | 3.39e-07 (2^-21.49) | 21.49 |
| 23 | `pipelined_m:data_width=28,n_iter=23,angle_guard=0,frac_guard=3,rounding=trunc,m=8` | 2231 | 344 | 44.0 | 5 | 0.194 | 3.2e-07 (2^-21.58) | 21.58 |
| 24 | `pipelined_m:data_width=26,n_iter=23,angle_guard=3,frac_guard=4,rounding=round,m=8` | 2262 | 337 | 45.9 | 5 | 0.196 | 3.12e-07 (2^-21.61) | 21.61 |
| 25 | `pipelined_m:data_width=27,n_iter=23,angle_guard=3,frac_guard=4,rounding=trunc,m=6` | 2277 | 446 | 57.5 | 6 | 0.205 | 2.82e-07 (2^-21.76) | 21.76 |
| 26 | `pipelined_m:data_width=26,n_iter=24,angle_guard=2,frac_guard=4,rounding=round,m=6` | 2338 | 430 | 59.9 | 6 | 0.208 | 2.22e-07 (2^-22.10) | 22.10 |
| 27 | `pipelined_m:data_width=28,n_iter=24,angle_guard=1,frac_guard=4,rounding=round,m=8` | 2464 | 353 | 44.0 | 5 | 0.212 | 1.64e-07 (2^-22.54) | 22.54 |
| 28 | `pipelined_m:data_width=28,n_iter=25,angle_guard=4,frac_guard=1,rounding=round,m=8` | 2492 | 448 | 44.0 | 6 | 0.221 | 9.69e-08 (2^-23.30) | 23.30 |
| 29 | `pipelined_m:data_width=28,n_iter=28,angle_guard=1,frac_guard=1,rounding=round,m=8` | 2710 | 436 | 45.9 | 6 | 0.237 | 8.86e-08 (2^-23.43) | 23.43 |
| 30 | `pipelined_m:data_width=28,n_iter=28,angle_guard=1,frac_guard=3,rounding=round,m=5` | 2824 | 646 | 67.8 | 8 | 0.261 | 7.8e-08 (2^-23.61) | 23.61 |
| 31 | `pipelined_m:data_width=28,n_iter=28,angle_guard=2,frac_guard=3,rounding=round,m=3` | 2852 | 1051 | 105.9 | 12 | 0.294 | 4.38e-08 (2^-24.45) | 24.45 |
| 32 | `pipelined_m:data_width=28,n_iter=28,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2909 | 1069 | 105.9 | 12 | 0.299 | 4.07e-08 (2^-24.55) | 24.55 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec has a strict system-level latency constraint (p99 <= 0.4us) for bursts of 8 requests. This effectively requires a high throughput design that can process a burst quickly. 

1. **iterative** is excluded because it produces 1 result per N+3 cycles. For N=10, that's 13 cycles/result. A burst of 8 takes 8*13 = 104 cycles. Even at 100 MHz, that's 1.04us, which violates the 0.4us constraint. It is infeasible for this spec.

2. **pipelined** is the safest bet. It processes 1 result/cycle, so a burst of 8 takes 8 cycles. At 50 MHz, that's 0.16us, well within 0.4us. It has the highest area but guarantees the latency constraint. We allocate 50% of the budget here to map the accuracy/area trade-off thoroughly.

3. **pipelined_m** is a good middle ground. It can reduce area by sharing logic, but the critical path is longer. If it can still hit >20 MHz, it will be on the Pareto front with lower area than pipelined. We allocate 30% to explore this.

4. **unrolled_k** is the most area-efficient. It shares the datapath completely. The latency for a burst is 8 * ceil(N/k) cycles. With k=4, N=12, that's 24 cycles. At 50 MHz, that's 0.48us, which is close to the limit. At 100 MHz, it's 0.24us. This family could potentially offer the lowest area design that meets the constraints. We allocate 20% to explore this, focusing on higher k values to reduce burst latency.

The accuracy constraint (max_abs_err <= 2^-10) is easily met by all families with N>=10 and W>=12. The main trade-off is area vs. the ability to meet the latency constraint. The Pareto front will likely be dominated by pipelined (high area, low latency), pipelined_m (medium area, medium latency), and unrolled_k (low area, higher latency but potentially still feasible). The selection rule is min luts_plus_ffs, so we expect the final design to be from unrolled_k or pipelined_m if they meet the latency constraint.*)
- `pipelined` (50 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Pipelined is the only family that can plausibly meet the strict sys_p99_latency_us <= 0.4us constraint for bursts of 8. It has 1 result/cycle throughput, so a burst of 8 takes 8 cycles. To fit in 0.4us, Fmax must be >= 20 MHz. With N=10-14, the critical path is short enough to easily exceed 20 MHz (likely >100 MHz), making the latency constraint robust. It also meets throughput_msps >= 2 easily. This is the primary candidate for the final design.
- `pipelined_m` (30 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* Pipelined_m can reduce area (LUTs+FFs) compared to full pipelining by sharing datapath logic between stages, at the cost of a longer critical path. If the critical path remains short enough to hit >20 MHz (likely for N=10-14), it could offer a better area/accuracy trade-off on the Pareto front while still meeting the latency constraint. This explores the area-saving side of the trade-off.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..4. *Why:* Unrolled_k has a shared datapath (low area) but produces results every ceil(N/k) cycles. For a burst of 8, the latency is 8 * ceil(N/k) cycles. To meet 0.4us, we need Fmax * k / ceil(N/k) >= 20 MHz. With k=4 and N=12, this is 4/3 cycles/result, so Fmax >= 15 MHz. This is likely feasible and could yield the lowest area design that meets all constraints, potentially dominating the pipelined designs on the area objective.

**Result (code):** 100 evaluations this round, 100 total; 41 feasible; hypervolume 4420 (n/a).

**LLM decision:** `add_family` — The current front is dominated by pipelined_m (958-1153 LUTs+FFs) and one pipelined design (1716 LUTs+FFs). The `iterative` family has not been explored yet. Since `iterative` uses a shared datapath with barrel shifters and no pipeline registers (unlike pipelined_m which registers every m stages), it is likely to have a significantly lower area cost (LUTs+FFs) for the same accuracy, potentially pushing the Pareto front to the left (lower area) and increasing hypervolume. The `unrolled_k` family failed to meet throughput constraints (max 12.9 MSPS vs 2 required, but likely failed latency or other constraints in the 0 feasible count, though 12.9 >= 2, the 0 feasible suggests it failed the strict p99 latency or accuracy constraints in a way that pipelined_m didn't, or simply wasn't sampled well enough to find a feasible point). Given the budget of 300 evals remaining and the need to map the front, adding `iterative` is the highest-value move to explore the low-area corner of the trade-off space.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 4420 (gain this round: n/a (first round)).
Feasible designs: 41 of 100 evaluations (27 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 52% violate; best seen 0.000204 (2^-12.26)
- sys_p99_latency_us <= 0.4: 20% violate; best seen 0.0639

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=4 frac_guard=3 rounding=round m=4] luts_plus_ffs=958, accuracy_bits=10.8, luts=744, ffs=214, throughput_msps=93.6, max_abs_err=0.000556 (2^-10.81), power_index=0.0721
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1050, accuracy_bits=11.5, luts=786, ffs=264, throughput_msps=97.8, max_abs_err=0.000344 (2^-11.50), power_index=0.079
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1052, accuracy_bits=11.7, luts=786, ffs=266, throughput_msps=93.6, max_abs_err=0.000294 (2^-11.73), power_index=0.0792
- pipelined_m [data_width=15 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1113, accuracy_bits=11.8, luts=845, ffs=268, throughput_msps=97.8, max_abs_err=0.00029 (2^-11.75), power_index=0.0838
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1122, accuracy_bits=12.1, luts=847, ffs=274, throughput_msps=93.6, max_abs_err=0.000225 (2^-12.12), power_index=0.0844
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1153, accuracy_bits=12.2, luts=868, ffs=285, throughput_msps=93.6, max_abs_err=0.000209 (2^-12.23), power_index=0.0867
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=1716, accuracy_bits=12.3, luts=861, ffs=856, throughput_msps=273, max_abs_err=0.000204 (2^-12.26), power_index=0.129
Front coverage: luts_plus_ffs 958..1716 (HV reference 3000); accuracy_bits 10.8..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 11.28 bits
- pipelined: 50 evals, 24 feasible; max throughput seen 282 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=1303; feasible ranges: data_width 13..16, n_iter 12..14, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 30 evals, 17 feasible; max throughput seen 171 MSPS; best accuracy 12.23 bits; best feasible luts_plus_ffs=958; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..4, frac_guard 0..3, m 4..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The iterative family is the only one not yet explored. It typically has the lowest area cost due to shared datapath and lack of pipeline registers. Searching around the data_width and n_iter ranges that yielded feasible results in pipelined_m (15-16, 12-14) but slightly wider to catch any area/accuracy trade-offs specific to the iterative architecture.*)
- `iterative` (100 evals): data_width=14..18, n_iter=10..16, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Exploring the unexplored iterative family to find lower-area designs that meet the accuracy and latency constraints, potentially improving the hypervolume by covering the low LUTs+FFs region.

**Result (code):** 100 evaluations this round, 200 total; 41 feasible; hypervolume 4420 (+0.0%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` with `m=4`, which offers the best area efficiency (958 LUTs+FFs) while meeting the strict p99 latency constraint (0.0639 us << 0.4 us). The `iterative` and `unrolled_k` families are infeasible due to throughput/latency limits. The `pipelined` family is feasible but significantly larger (1716 vs 958). To maximize hypervolume and find the true minimum area design, we should focus the search on the `pipelined_m` family, specifically exploring `m=2` and `m=3` which might offer better area/latency trade-offs than `m=4` or `m=1` (full pipeline). We will narrow the parameter ranges to the proven feasible region: `data_width` 14-16, `n_iter` 12-14, `angle_guard` 0-3, `frac_guard` 0-2, and `m` 2-4. This focuses the remaining budget on refining the front in the most promising region.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4420 (gain this round: +0.0%).
Feasible designs: 41 of 200 evaluations (27 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 46% violate; best seen 0.000104 (2^-13.23)
- sys_p99_latency_us <= 0.4: 60% violate; best seen 0.0639

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=4 frac_guard=3 rounding=round m=4] luts_plus_ffs=958, accuracy_bits=10.8, luts=744, ffs=214, throughput_msps=93.6, max_abs_err=0.000556 (2^-10.81), power_index=0.0721
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1050, accuracy_bits=11.5, luts=786, ffs=264, throughput_msps=97.8, max_abs_err=0.000344 (2^-11.50), power_index=0.079
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1052, accuracy_bits=11.7, luts=786, ffs=266, throughput_msps=93.6, max_abs_err=0.000294 (2^-11.73), power_index=0.0792
- pipelined_m [data_width=15 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1113, accuracy_bits=11.8, luts=845, ffs=268, throughput_msps=97.8, max_abs_err=0.00029 (2^-11.75), power_index=0.0838
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1122, accuracy_bits=12.1, luts=847, ffs=274, throughput_msps=93.6, max_abs_err=0.000225 (2^-12.12), power_index=0.0844
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1153, accuracy_bits=12.2, luts=868, ffs=285, throughput_msps=93.6, max_abs_err=0.000209 (2^-12.23), power_index=0.0867
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=1716, accuracy_bits=12.3, luts=861, ffs=856, throughput_msps=273, max_abs_err=0.000204 (2^-12.26), power_index=0.129
Front coverage: luts_plus_ffs 958..1716 (HV reference 3000); accuracy_bits 10.8..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 100 evals, 0 feasible; max throughput seen 15.3 MSPS; best accuracy 13.23 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 11.28 bits
- pipelined: 50 evals, 24 feasible; max throughput seen 282 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=1303; feasible ranges: data_width 13..16, n_iter 12..14, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 30 evals, 17 feasible; max throughput seen 171 MSPS; best accuracy 12.23 bits; best feasible luts_plus_ffs=958; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..4, frac_guard 0..3, m 4..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (172 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (6 front designs; box front_anchored)
- `pipelined` (28 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 225 feasible; hypervolume 1.527e+04 (+245.5%).

**No LLM call** (code's front-mapping round): The current Pareto front is dominated by `pipelined_m` with `m=4`, which offers the best area efficiency (958 LUTs+FFs) while meeting the strict p99 latency constraint (0.0639 us << 0.4 us). The `iterative` and `unrolled_k` families are infeasible due to throughput/latency limits. The `pipelined` family is feasible but significantly larger (1716 vs 958). To maximize hypervolume and find the true minimum area design, we should focus the search on the `pipelined_m` family, specifically exploring `m=2` and `m=3` which might offer better area/latency trade-offs than `m=4` or `m=1` (full pipeline). We will narrow the parameter ranges to the proven feasible region: `data_width` 14-16, `n_iter` 12-14, `angle_guard` 0-3, `frac_guard` 0-2, and `m` 2-4. This focuses the remaining budget on refining the front in the most promising region.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.527e+04 (gain this round: +245.5%).
Feasible designs: 225 of 400 evaluations (196 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 27% violate; best seen 4.07e-08 (2^-24.55)
- sys_p99_latency_us <= 0.4: 30% violate; best seen 0.0639

Pareto front (feasible, 33 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=4 frac_guard=3 rounding=round m=4] luts_plus_ffs=958, accuracy_bits=10.8, luts=744, ffs=214, throughput_msps=93.6, max_abs_err=0.000556 (2^-10.81), power_index=0.0721
- pipelined_m [data_width=14 n_iter=16 angle_guard=4 frac_guard=3 rounding=round m=8] luts_plus_ffs=1095, accuracy_bits=12, luts=952, ffs=143, throughput_msps=52.7, max_abs_err=0.000248 (2^-11.98), power_index=0.0824
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=6] luts_plus_ffs=1384, accuracy_bits=14.5, luts=1136, ffs=248, throughput_msps=65.4, max_abs_err=4.29e-05 (2^-14.51), power_index=0.104
- pipelined_m [data_width=24 n_iter=20 angle_guard=2 frac_guard=0 rounding=round m=8] luts_plus_ffs=1901, accuracy_bits=18.4, luts=1607, ffs=294, throughput_msps=48, max_abs_err=2.84e-06 (2^-18.42), power_index=0.143
- pipelined_m [data_width=25 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=2060, accuracy_bits=18.8, luts=1747, ffs=313, throughput_msps=45.9, max_abs_err=2.21e-06 (2^-18.79), power_index=0.155
- pipelined_m [data_width=28 n_iter=20 angle_guard=1 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=2250, accuracy_bits=19, luts=1907, ffs=343, throughput_msps=45.9, max_abs_err=1.95e-06 (2^-18.97), power_index=0.169
- pipelined_m [data_width=28 n_iter=23 angle_guard=0 frac_guard=0 rounding=round m=8] luts_plus_ffs=2424, accuracy_bits=21.4, luts=2092, ffs=332, throughput_msps=45.9, max_abs_err=3.52e-07 (2^-21.44), power_index=0.182
- pipelined_m [data_width=27 n_iter=23 angle_guard=3 frac_guard=4 rounding=trunc m=6] luts_plus_ffs=2723, accuracy_bits=21.8, luts=2277, ffs=446, throughput_msps=57.5, max_abs_err=2.82e-07 (2^-21.76), power_index=0.205
- pipelined_m [data_width=28 n_iter=25 angle_guard=4 frac_guard=1 rounding=round m=8] luts_plus_ffs=2940, accuracy_bits=23.3, luts=2492, ffs=448, throughput_msps=44, max_abs_err=9.69e-08 (2^-23.30), power_index=0.221
- pipelined_m [data_width=28 n_iter=28 angle_guard=2 frac_guard=4 rounding=round m=3] luts_plus_ffs=3979, accuracy_bits=24.6, luts=2909, ffs=1069, throughput_msps=106, max_abs_err=4.07e-08 (2^-24.55), power_index=0.299
Front coverage: luts_plus_ffs 958..3979 (HV reference 3000); accuracy_bits 10.8..24.6 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 100 evals, 0 feasible; max throughput seen 15.3 MSPS; best accuracy 13.23 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 11.28 bits
- pipelined: 78 evals, 52 feasible; max throughput seen 282 MSPS; best accuracy 21.62 bits; best feasible luts_plus_ffs=1303; feasible ranges: data_width 13..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 202 evals, 173 feasible; max throughput seen 171 MSPS; best accuracy 24.55 bits; best feasible luts_plus_ffs=958; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 9339 in, 3049 out
- provider-reported cost: $0.0054
- full prompts and replies: `llm_trace.jsonl`

