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
`pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 631 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 195 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 5 | exact: schedule |
| latency_ns | 51.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0621 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000833 (2^-10.23) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.82 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000239 (2^-12.03) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.96 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.2 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 5 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.9 dBc, SNR 69.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.1124 → 0.1351 | yes |
| `pipelined_m:data_width=14,n_iter=13,angle_guard=3,frac_guard=3,rounding=round,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.1226 → 0.1453 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (32 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 631 | 195 | 97.8 | 5 | 0.0621 | 0.000833 (2^-10.23) | 10.23 |
| 1 | `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=round,m=4` | 631 | 199 | 97.8 | 5 | 0.0624 | 0.000712 (2^-10.46) | 10.46 |
| 2 | `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=4` | 643 | 202 | 97.8 | 5 | 0.0635 | 0.000661 (2^-10.56) | 10.56 |
| 3 | `pipelined_m:data_width=14,n_iter=13,angle_guard=3,frac_guard=3,rounding=round,m=8` | 756 | 141 | 52.7 | 4 | 0.0675 | 0.000455 (2^-11.10) | 11.10 |
| 4 | `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round,m=4` | 701 | 258 | 97.8 | 6 | 0.0721 | 0.000417 (2^-11.23) | 11.23 |
| 5 | `pipelined_m:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 745 | 254 | 97.8 | 6 | 0.0752 | 0.0004 (2^-11.29) | 11.29 |
| 6 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 759 | 258 | 97.8 | 6 | 0.0765 | 0.000342 (2^-11.51) | 11.51 |
| 7 | `pipelined_m:data_width=18,n_iter=13,angle_guard=3,frac_guard=4,rounding=trunc,m=8` | 903 | 174 | 50.3 | 4 | 0.081 | 0.000262 (2^-11.90) | 11.90 |
| 8 | `pipelined_m:data_width=18,n_iter=13,angle_guard=4,frac_guard=4,rounding=trunc,m=7` | 916 | 176 | 56.8 | 4 | 0.0821 | 0.000258 (2^-11.92) | 11.92 |
| 9 | `pipelined_m:data_width=23,n_iter=14,angle_guard=-2,frac_guard=0,rounding=round,m=7` | 1005 | 196 | 54.3 | 4 | 0.0904 | 0.000128 (2^-12.93) | 12.93 |
| 10 | `pipelined_m:data_width=25,n_iter=14,angle_guard=-1,frac_guard=0,rounding=trunc,m=5` | 1101 | 296 | 73.7 | 5 | 0.105 | 0.000123 (2^-12.99) | 12.99 |
| 11 | `pipelined_m:data_width=20,n_iter=17,angle_guard=-2,frac_guard=1,rounding=round,m=5` | 1160 | 311 | 77.0 | 6 | 0.111 | 9.14e-05 (2^-13.42) | 13.42 |
| 12 | `pipelined_m:data_width=23,n_iter=15,angle_guard=0,frac_guard=3,rounding=trunc,m=7` | 1200 | 289 | 54.3 | 5 | 0.112 | 6.21e-05 (2^-13.97) | 13.97 |
| 13 | `pipelined_m:data_width=21,n_iter=17,angle_guard=-1,frac_guard=3,rounding=trunc,m=5` | 1253 | 339 | 73.7 | 6 | 0.12 | 3.59e-05 (2^-14.77) | 14.77 |
| 14 | `pipelined_m:data_width=24,n_iter=17,angle_guard=-1,frac_guard=1,rounding=trunc,m=7` | 1337 | 289 | 54.3 | 5 | 0.122 | 1.7e-05 (2^-15.84) | 15.84 |
| 15 | `pipelined_m:data_width=24,n_iter=17,angle_guard=0,frac_guard=1,rounding=trunc,m=5` | 1354 | 373 | 73.7 | 6 | 0.13 | 1.66e-05 (2^-15.88) | 15.88 |
| 16 | `pipelined_m:data_width=26,n_iter=17,angle_guard=0,frac_guard=3,rounding=trunc,m=6` | 1523 | 322 | 59.9 | 5 | 0.139 | 1.56e-05 (2^-15.97) | 15.97 |
| 17 | `pipelined_m:data_width=23,n_iter=18,angle_guard=4,frac_guard=0,rounding=round,m=4` | 1420 | 450 | 86.0 | 7 | 0.141 | 9.29e-06 (2^-16.72) | 16.72 |
| 18 | `pipelined_m:data_width=25,n_iter=20,angle_guard=-2,frac_guard=0,rounding=trunc,m=5` | 1587 | 373 | 73.7 | 6 | 0.147 | 4.43e-06 (2^-17.78) | 17.78 |
| 19 | `pipelined_m:data_width=24,n_iter=20,angle_guard=2,frac_guard=0,rounding=round,m=5` | 1607 | 375 | 73.7 | 6 | 0.149 | 2.84e-06 (2^-18.42) | 18.42 |
| 20 | `pipelined_m:data_width=26,n_iter=20,angle_guard=0,frac_guard=0,rounding=round,m=5` | 1687 | 395 | 73.7 | 6 | 0.157 | 2.29e-06 (2^-18.73) | 18.73 |
| 21 | `pipelined_m:data_width=25,n_iter=20,angle_guard=4,frac_guard=4,rounding=trunc,m=5` | 1867 | 422 | 70.6 | 6 | 0.172 | 2.05e-06 (2^-18.90) | 18.90 |
| 22 | `pipelined_m:data_width=24,n_iter=22,angle_guard=2,frac_guard=3,rounding=round,m=5` | 1959 | 483 | 70.6 | 7 | 0.184 | 9.9e-07 (2^-19.95) | 19.95 |
| 23 | `pipelined_m:data_width=24,n_iter=25,angle_guard=2,frac_guard=3,rounding=round,m=5` | 2231 | 483 | 70.6 | 7 | 0.204 | 6.35e-07 (2^-20.59) | 20.59 |
| 24 | `pipelined_m:data_width=27,n_iter=22,angle_guard=3,frac_guard=0,rounding=round,m=3` | 1997 | 789 | 110.0 | 10 | 0.21 | 6.06e-07 (2^-20.65) | 20.65 |
| 25 | `pipelined_m:data_width=25,n_iter=22,angle_guard=4,frac_guard=4,rounding=round,m=3` | 2116 | 803 | 110.0 | 10 | 0.22 | 5.62e-07 (2^-20.76) | 20.76 |
| 26 | `pipelined_m:data_width=27,n_iter=22,angle_guard=3,frac_guard=4,rounding=trunc,m=3` | 2174 | 845 | 105.9 | 10 | 0.227 | 5.21e-07 (2^-20.87) | 20.87 |
| 27 | `pipelined_m:data_width=27,n_iter=25,angle_guard=0,frac_guard=2,rounding=round,m=4` | 2364 | 702 | 86.0 | 9 | 0.231 | 2.73e-07 (2^-21.80) | 21.80 |
| 28 | `pipelined_m:data_width=26,n_iter=26,angle_guard=4,frac_guard=2,rounding=trunc,m=4` | 2429 | 705 | 86.0 | 9 | 0.236 | 2.62e-07 (2^-21.86) | 21.86 |
| 29 | `pipelined_m:data_width=26,n_iter=26,angle_guard=4,frac_guard=2,rounding=round,m=4` | 2484 | 707 | 86.0 | 9 | 0.24 | 1.39e-07 (2^-22.78) | 22.78 |
| 30 | `pipelined_m:data_width=26,n_iter=26,angle_guard=4,frac_guard=4,rounding=trunc,m=4` | 2534 | 729 | 86.0 | 9 | 0.246 | 1.21e-07 (2^-22.98) | 22.98 |
| 31 | `pipelined_m:data_width=27,n_iter=26,angle_guard=4,frac_guard=2,rounding=round,m=4` | 2565 | 730 | 82.7 | 9 | 0.248 | 7.62e-08 (2^-23.65) | 23.65 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires 2 Msps throughput, max_abs_err <= 2^-10, and sys_p99_latency_us <= 0.4us for bursty requests. The pipelined family is prioritized (50%) because it guarantees 1 result/cycle, making it the most robust choice for meeting the bursty latency constraint. Pipelined_m (30%) is explored next as it can reduce FF count while maintaining 1 result/cycle throughput, potentially offering better area efficiency. Unrolled_k (20%) is included as a lower-cost alternative that may meet throughput at high Fmax, though its multi-cycle result latency makes it riskier for the bursty system constraint. The iterative family is excluded because its 1 result every N+3 cycles makes it unlikely to meet the 2 Msps throughput and bursty latency constraints. Parameter ranges are focused on n_iter=12-14 (sufficient for 2^-10 accuracy), data_width=14-16 (adequate precision), and small guard bits to minimize area while maintaining accuracy.*)
- `pipelined` (50 evals): data_width=14..16, n_iter=12..14, angle_guard=-1..1, frac_guard=0..1, rounding=trunc|round. *Why:* Pipelined CORDIC provides 1 result/cycle throughput, which is critical for meeting the bursty system latency constraint (p99 <= 0.4us) and the 2 Msps throughput constraint. With N+2 latency, keeping N small (12-14) minimizes latency while still achieving the required accuracy (max_abs_err <= 2^-10). The data_width of 14-16 with appropriate guards should provide sufficient accuracy. This family is the most likely to meet all system constraints.
- `pipelined_m` (30 evals): data_width=14..16, n_iter=12..14, angle_guard=-1..1, frac_guard=0..1, rounding=trunc|round, m=2..2. *Why:* Pipelined_m with m=2 registers every 2 stages, reducing FF count compared to fully pipelined while maintaining 1 result/cycle throughput. This could offer a better area trade-off (lower luts_plus_ffs) while still meeting the throughput and latency constraints. The reduced register count may allow for a higher Fmax, further improving system latency.
- `unrolled_k` (20 evals): data_width=14..16, n_iter=12..14, angle_guard=-1..1, frac_guard=0..1, rounding=trunc|round, k=2..4. *Why:* Unrolled_k with k=2-4 can achieve higher throughput than iterative while using fewer resources than fully pipelined. With k=4, it produces a result every ceil(N/4)+3 cycles, which for N=12-14 gives 6-7 cycles per result. At high Fmax, this may still meet the 2 Msps throughput constraint. The reduced pipeline depth may allow higher Fmax, potentially meeting the system latency constraint. This family offers a middle ground between area and performance.

**Result (code):** 100 evaluations this round, 100 total; 62 feasible; hypervolume 3065 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `m=2`, which are significantly cheaper (959 LUTs+FFs) than the `pipelined` counterparts (1637 LUTs+FFs) while maintaining comparable accuracy (10.1-11.5 bits vs 11.7 bits). The `unrolled_k` family failed to produce any feasible designs, likely due to throughput or latency constraints at the required accuracy. The `iterative` family has not been explored yet, but given that `pipelined_m` is already achieving the lowest area (959) and the `iterative` family typically has higher latency and lower throughput (1 result per N+3 cycles), it is unlikely to beat the `pipelined_m` designs on the primary objective (min luts_plus_ffs) unless it can achieve much higher accuracy with fewer resources, which is improbable given the shared datapath nature. The current front covers a narrow range of `data_width` (15-16) and `n_iter` (12-14). To improve the hypervolume and potentially find cheaper designs, we should refine the search around the best `pipelined_m` region. Specifically, we should explore `m=3` and `m=4` in `pipelined_m` to see if reducing the number of pipeline registers further reduces area while still meeting the latency constraint (sys_p99_latency_us <= 0.4 us). The current best `pipelined_m` has a latency of ~0.07 us, so there is significant headroom to increase `m` (which reduces FFs) without violating the system latency constraint. We will also slightly widen `data_width` to 14 to see if lower width can meet the accuracy constraint (max_abs_err <= 2^-10) with fewer LUTs, although the current best at width 15 is already very close to the limit. We will focus the next round on `pipelined_m` with `m` in [2, 4] and `data_width` in [14, 16], `n_iter` in [12, 14].

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3065 (gain this round: n/a (first round)).
Feasible designs: 62 of 100 evaluations (43 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 26% violate; best seen 0.000311 (2^-11.65)
- sys_p99_latency_us <= 0.4: 20% violate; best seen 0.0709

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=2] luts_plus_ffs=959, accuracy_bits=10.1, luts=608, ffs=351, throughput_msps=171, max_abs_err=0.000917 (2^-10.09), power_index=0.0722
- pipelined_m [data_width=16 n_iter=12 angle_guard=-1 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=1012, accuracy_bits=10.1, luts=643, ffs=369, throughput_msps=171, max_abs_err=0.000901 (2^-10.12), power_index=0.0761
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=2] luts_plus_ffs=1014, accuracy_bits=10.6, luts=643, ffs=371, throughput_msps=171, max_abs_err=0.000661 (2^-10.56), power_index=0.0763
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=2] luts_plus_ffs=1083, accuracy_bits=10.6, luts=700, ffs=383, throughput_msps=171, max_abs_err=0.000624 (2^-10.65), power_index=0.0815
- pipelined_m [data_width=15 n_iter=13 angle_guard=1 frac_guard=1 rounding=round m=2] luts_plus_ffs=1138, accuracy_bits=10.9, luts=720, ffs=419, throughput_msps=171, max_abs_err=0.000528 (2^-10.89), power_index=0.0856
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=2] luts_plus_ffs=1166, accuracy_bits=11.3, luts=745, ffs=421, throughput_msps=171, max_abs_err=0.0004 (2^-11.29), power_index=0.0877
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=2] luts_plus_ffs=1186, accuracy_bits=11.5, luts=759, ffs=428, throughput_msps=171, max_abs_err=0.000342 (2^-11.51), power_index=0.0893
- pipelined [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round] luts_plus_ffs=1637, accuracy_bits=11.7, luts=820, ffs=817, throughput_msps=273, max_abs_err=0.000311 (2^-11.65), power_index=0.123
Front coverage: luts_plus_ffs 959..1637 (HV reference 3000); accuracy_bits 10.1..11.7 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.28 bits
- pipelined: 50 evals, 38 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 30 evals, 24 feasible; max throughput seen 171 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=959; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1, m 2..2
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on pipelined_m with expanded m range to find cheaper designs.*)
- `pipelined_m` (100 evals): data_width=14..16, n_iter=12..14, angle_guard=-1..1, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* Refine around the best pipelined_m designs to explore higher m values (3, 4) which reduce FF count, potentially lowering luts_plus_ffs further while staying within the loose latency constraint.

**Result (code):** 100 evaluations this round, 200 total; 138 feasible; hypervolume 3402 (+11.0%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` with `m=4`, achieving a minimum area of 826 LUTs+FFs. The `unrolled_k` family is infeasible (0 feasible designs) due to throughput constraints (max 13.5 MSPS < 2 MSPS? No, 13.5 > 2, but likely latency or other constraints failed, or simply no feasible points found in the 20 evals). `pipelined` is feasible but has a higher minimum area (1250) compared to `pipelined_m` (826). The `iterative` family has not been explored yet. Given the budget (200/400 used) and the clear superiority of `pipelined_m` in the low-area region, we should refine the search around the best `pipelined_m` configurations to ensure we have mapped the front well in the low-area, high-accuracy region. We should also explore `iterative` briefly to see if it offers any area advantage, but given the throughput requirement (>= 2 MSPS) and the fact that `iterative` has N+3 latency and 1 result per N+3 cycles, its throughput is Fmax/(N+3). To get 2 MSPS, Fmax needs to be > 2*(N+3) MHz. For N=12, Fmax > 30 MHz. This is easily achievable. However, `iterative` uses a shared datapath which might be smaller than `pipelined_m`? Let's check. `pipelined_m` with m=4 has 4 stages of registers. `iterative` has 1 datapath. `iterative` might be smaller. We should add `iterative` to the exploration to check if it can beat 826 LUTs+FFs. But wait, the prompt says 'refine' or 'add_family'. If I add `iterative`, I might find a smaller design. Let's look at the constraints. `sys_p99_latency_us <= 0.4`. For `iterative`, latency is N+3 cycles. If Fmax is ~100 MHz, 1 cycle = 10 ns. N=12 -> 15 cycles -> 150 ns = 0.15 us. This is well within 0.4 us. So `iterative` is a strong candidate for low area. I should add `iterative` to the search. However, the current front is quite good. Let's refine `pipelined_m` and `pipelined` first to ensure we have the best possible points, and maybe add `iterative` in the next round if budget allows. Actually, with 200 evals left, I can afford to explore `iterative`. But the decision is single. 'add_family' seems appropriate to check if `iterative` is better. Or 'refine' to tighten the current best. Given that `pipelined_m` is already very good (826), and `iterative` is unexplored, there is a risk that `iterative` is much smaller (e.g., 500 LUTs+FFs). If I don't explore it, I might miss the true optimum. Therefore, `add_family` is the safer bet to ensure global optimality. Let's add `iterative`.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3402 (gain this round: +11.0%).
Feasible designs: 138 of 200 evaluations (83 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 25% violate; best seen 0.000311 (2^-11.65)
- sys_p99_latency_us <= 0.4: 10% violate; best seen 0.0709

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=826, accuracy_bits=10.2, luts=631, ffs=195, throughput_msps=97.8, max_abs_err=0.000833 (2^-10.23), power_index=0.0621
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=830, accuracy_bits=10.5, luts=631, ffs=199, throughput_msps=97.8, max_abs_err=0.000712 (2^-10.46), power_index=0.0624
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=845, accuracy_bits=10.6, luts=643, ffs=202, throughput_msps=97.8, max_abs_err=0.000661 (2^-10.56), power_index=0.0635
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=908, accuracy_bits=10.6, luts=700, ffs=208, throughput_msps=97.8, max_abs_err=0.000624 (2^-10.65), power_index=0.0683
- pipelined_m [data_width=15 n_iter=13 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=972, accuracy_bits=10.9, luts=720, ffs=252, throughput_msps=97.8, max_abs_err=0.000528 (2^-10.89), power_index=0.0731
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=974, accuracy_bits=11, luts=713, ffs=260, throughput_msps=97.8, max_abs_err=0.000498 (2^-10.97), power_index=0.0733
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=990, accuracy_bits=11.1, luts=726, ffs=264, throughput_msps=97.8, max_abs_err=0.00046 (2^-11.09), power_index=0.0745
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=999, accuracy_bits=11.3, luts=745, ffs=254, throughput_msps=97.8, max_abs_err=0.0004 (2^-11.29), power_index=0.0752
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1017, accuracy_bits=11.5, luts=759, ffs=258, throughput_msps=97.8, max_abs_err=0.000342 (2^-11.51), power_index=0.0765
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0817
Front coverage: luts_plus_ffs 826..1086 (HV reference 3000); accuracy_bits 10.2..11.7 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.28 bits
- pipelined: 50 evals, 38 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 130 evals, 100 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=826; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Explore iterative to check for area advantage; refine pipelined_m to solidify the current best front.*)
- `iterative` (20 evals): data_width=14..16, n_iter=12..14, angle_guard=-1..1, frac_guard=0..1, rounding=trunc|round. *Why:* Unexplored family; shared datapath may offer lower area than pipelined_m.
- `pipelined_m` (20 evals): data_width=15..16, n_iter=12..13, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, m=4..4. *Why:* Refine around the current best feasible region (m=4, dw=15-16, n=12-13) to ensure the front is well-mapped in the low-area corner.

**Result (code):** 40 evaluations this round, 240 total; 154 feasible; hypervolume 3416 (+0.4%).

**LLM decision:** `stop` — The Pareto front is well-established and feasible. The `pipelined_m` family dominates the front with a minimum `luts_plus_ffs` of 826, significantly better than `pipelined` (1250). All designs on the front satisfy the strict constraints: `max_abs_err` is between 0.000311 and 0.000833 (limit 0.000976562), `throughput_msps` is ~97.8 (limit 2), and the best `sys_p99_latency_us` seen is 0.0709 (limit 0.4). The front covers the accuracy range from 10.2 to 11.7 bits, providing a good trade-off curve for the selection rule (min `luts_plus_ffs`). Since this is the final round, we stop to allow the L2 simulation of the shortlist to proceed.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 3416 (gain this round: +0.4%).
Feasible designs: 154 of 240 evaluations (90 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 25% violate; best seen 0.000311 (2^-11.65)
- sys_p99_latency_us <= 0.4: 17% violate; best seen 0.0709

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=826, accuracy_bits=10.2, luts=631, ffs=195, throughput_msps=97.8, max_abs_err=0.000833 (2^-10.23), power_index=0.0621
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=830, accuracy_bits=10.5, luts=631, ffs=199, throughput_msps=97.8, max_abs_err=0.000712 (2^-10.46), power_index=0.0624
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=845, accuracy_bits=10.6, luts=643, ffs=202, throughput_msps=97.8, max_abs_err=0.000661 (2^-10.56), power_index=0.0635
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=908, accuracy_bits=10.6, luts=700, ffs=208, throughput_msps=97.8, max_abs_err=0.000624 (2^-10.65), power_index=0.0683
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=959, accuracy_bits=11.2, luts=701, ffs=258, throughput_msps=97.8, max_abs_err=0.000417 (2^-11.23), power_index=0.0721
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=999, accuracy_bits=11.3, luts=745, ffs=254, throughput_msps=97.8, max_abs_err=0.0004 (2^-11.29), power_index=0.0752
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1017, accuracy_bits=11.5, luts=759, ffs=258, throughput_msps=97.8, max_abs_err=0.000342 (2^-11.51), power_index=0.0765
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1086, accuracy_bits=11.7, luts=820, ffs=266, throughput_msps=97.8, max_abs_err=0.000311 (2^-11.65), power_index=0.0817
Front coverage: luts_plus_ffs 826..1086 (HV reference 3000); accuracy_bits 10.2..11.7 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 20 evals, 0 feasible; max throughput seen 13.2 MSPS; best accuracy 11.09 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.28 bits
- pipelined: 50 evals, 38 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 150 evals, 116 feasible; max throughput seen 178 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=826; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (8 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 297 feasible; hypervolume 1.391e+04 (+307.3%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established and feasible. The `pipelined_m` family dominates the front with a minimum `luts_plus_ffs` of 826, significantly better than `pipelined` (1250). All designs on the front satisfy the strict constraints: `max_abs_err` is between 0.000311 and 0.000833 (limit 0.000976562), `throughput_msps` is ~97.8 (limit 2), and the best `sys_p99_latency_us` seen is 0.0709 (limit 0.4). The front covers the accuracy range from 10.2 to 11.7 bits, providing a good trade-off curve for the selection rule (min `luts_plus_ffs`). Since this is the final round, we stop to allow the L2 simulation of the shortlist to proceed.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.391e+04 (gain this round: +307.3%).
Feasible designs: 297 of 400 evaluations (226 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 19% violate; best seen 7.62e-08 (2^-23.65)
- sys_p99_latency_us <= 0.4: 10% violate; best seen 0.0709

Pareto front (feasible, 32 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=826, accuracy_bits=10.2, luts=631, ffs=195, throughput_msps=97.8, max_abs_err=0.000833 (2^-10.23), power_index=0.0621
- pipelined_m [data_width=14 n_iter=13 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=897, accuracy_bits=11.1, luts=756, ffs=141, throughput_msps=52.7, max_abs_err=0.000455 (2^-11.10), power_index=0.0675
- pipelined_m [data_width=18 n_iter=13 angle_guard=3 frac_guard=4 rounding=trunc m=8] luts_plus_ffs=1077, accuracy_bits=11.9, luts=903, ffs=174, throughput_msps=50.3, max_abs_err=0.000262 (2^-11.90), power_index=0.081
- pipelined_m [data_width=25 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc m=5] luts_plus_ffs=1397, accuracy_bits=13, luts=1101, ffs=296, throughput_msps=73.7, max_abs_err=0.000123 (2^-12.99), power_index=0.105
- pipelined_m [data_width=24 n_iter=17 angle_guard=-1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1626, accuracy_bits=15.8, luts=1337, ffs=289, throughput_msps=54.3, max_abs_err=1.7e-05 (2^-15.84), power_index=0.122
- pipelined_m [data_width=23 n_iter=18 angle_guard=4 frac_guard=0 rounding=round m=4] luts_plus_ffs=1870, accuracy_bits=16.7, luts=1420, ffs=450, throughput_msps=86, max_abs_err=9.29e-06 (2^-16.72), power_index=0.141
- pipelined_m [data_width=25 n_iter=20 angle_guard=4 frac_guard=4 rounding=trunc m=5] luts_plus_ffs=2289, accuracy_bits=18.9, luts=1867, ffs=422, throughput_msps=70.6, max_abs_err=2.05e-06 (2^-18.90), power_index=0.172
- pipelined_m [data_width=27 n_iter=22 angle_guard=3 frac_guard=0 rounding=round m=3] luts_plus_ffs=2786, accuracy_bits=20.7, luts=1997, ffs=789, throughput_msps=110, max_abs_err=6.06e-07 (2^-20.65), power_index=0.21
- pipelined_m [data_width=26 n_iter=26 angle_guard=4 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=3134, accuracy_bits=21.9, luts=2429, ffs=705, throughput_msps=86, max_abs_err=2.62e-07 (2^-21.86), power_index=0.236
- pipelined_m [data_width=27 n_iter=26 angle_guard=4 frac_guard=2 rounding=round m=4] luts_plus_ffs=3295, accuracy_bits=23.6, luts=2565, ffs=730, throughput_msps=82.7, max_abs_err=7.62e-08 (2^-23.65), power_index=0.248
Front coverage: luts_plus_ffs 826..3295 (HV reference 3000); accuracy_bits 10.2..23.6 (HV reference 10); data_width on the front 14..27 (registry 8..28).

Per family:
- iterative: 20 evals, 0 feasible; max throughput seen 13.2 MSPS; best accuracy 11.09 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.28 bits
- pipelined: 50 evals, 38 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..1
- pipelined_m: 310 evals, 259 feasible; max throughput seen 178 MSPS; best accuracy 23.65 bits; best feasible luts_plus_ffs=826; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 12488 in, 4053 out
- provider-reported cost: $0.0093
- full prompts and replies: `llm_trace.jsonl`

