# DSE run: bursty_offload

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 638 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 135 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 67.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0581 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000976 (2^-10.00) | exact: bit-accurate model, exhaustive (16384 angles) |
| max_abs_err_lsb | 4 | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err | 0.000264 (2^-11.89) | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err_lsb | 1.08 | exact: bit-accurate model, exhaustive (16384 angles) |
| accuracy_bits | 10 | exact: bit-accurate model, exhaustive (16384 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.8 dBc, SNR 68.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=6` | 0.1459 → 0.1953 | yes |
| `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=17,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=8` | 0.1896 → 0.2667 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (37 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=7` | 638 | 135 | 59.6 | 4 | 0.0581 | 0.000976 (2^-10.00) | 10.00 |
| 1 | `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 631 | 143 | 52.7 | 4 | 0.0583 | 0.000887 (2^-10.14) | 10.14 |
| 2 | `pipelined_m:data_width=16,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=6` | 643 | 145 | 68.5 | 4 | 0.0593 | 0.000661 (2^-10.56) | 10.56 |
| 3 | `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 666 | 151 | 52.7 | 4 | 0.0615 | 0.000643 (2^-10.60) | 10.60 |
| 4 | `pipelined_m:data_width=17,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=8` | 678 | 153 | 52.7 | 4 | 0.0625 | 0.000568 (2^-10.78) | 10.78 |
| 5 | `pipelined_m:data_width=18,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=7` | 712 | 161 | 56.8 | 4 | 0.0657 | 0.000522 (2^-10.90) | 10.90 |
| 6 | `pipelined_m:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=8` | 745 | 143 | 52.7 | 4 | 0.0668 | 0.0004 (2^-11.29) | 11.29 |
| 7 | `pipelined_m:data_width=17,n_iter=13,angle_guard=0,frac_guard=1,rounding=trunc,m=8` | 751 | 153 | 52.7 | 4 | 0.0681 | 0.000395 (2^-11.30) | 11.30 |
| 8 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=7` | 772 | 147 | 59.6 | 4 | 0.0692 | 0.000294 (2^-11.73) | 11.73 |
| 9 | `pipelined_m:data_width=17,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc,m=8` | 813 | 153 | 52.7 | 4 | 0.0727 | 0.00028 (2^-11.80) | 11.80 |
| 10 | `pipelined_m:data_width=17,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc,m=7` | 813 | 153 | 59.6 | 4 | 0.0727 | 0.00028 (2^-11.80) | 11.80 |
| 11 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=7` | 834 | 151 | 59.6 | 4 | 0.0741 | 0.000209 (2^-12.22) | 12.22 |
| 12 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=7` | 841 | 161 | 56.8 | 4 | 0.0754 | 0.000175 (2^-12.48) | 12.48 |
| 13 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=7` | 855 | 163 | 56.8 | 4 | 0.0766 | 0.00017 (2^-12.53) | 12.53 |
| 14 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc,m=8` | 896 | 165 | 50.3 | 4 | 0.0798 | 0.000163 (2^-12.58) | 12.58 |
| 15 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=7` | 906 | 165 | 56.8 | 4 | 0.0806 | 0.00016 (2^-12.61) | 12.61 |
| 16 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=7` | 876 | 216 | 56.8 | 5 | 0.0821 | 0.000148 (2^-12.72) | 12.72 |
| 17 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=8` | 941 | 159 | 50.3 | 4 | 0.0828 | 0.00013 (2^-12.91) | 12.91 |
| 18 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round,m=8` | 971 | 161 | 50.3 | 4 | 0.0852 | 0.000108 (2^-13.18) | 13.18 |
| 19 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=7` | 1037 | 226 | 56.8 | 5 | 0.095 | 8.59e-05 (2^-13.51) | 13.51 |
| 20 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=6` | 1055 | 233 | 65.4 | 5 | 0.0969 | 6.45e-05 (2^-13.92) | 13.92 |
| 21 | `pipelined_m:data_width=18,n_iter=17,angle_guard=1,frac_guard=2,rounding=round,m=8` | 1139 | 234 | 50.3 | 5 | 0.103 | 5.95e-05 (2^-14.04) | 14.04 |
| 22 | `pipelined_m:data_width=20,n_iter=17,angle_guard=3,frac_guard=1,rounding=trunc,m=7` | 1202 | 256 | 54.3 | 5 | 0.11 | 3.13e-05 (2^-14.96) | 14.96 |
| 23 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=4,rounding=trunc,m=6` | 1270 | 262 | 62.5 | 5 | 0.115 | 2.56e-05 (2^-15.25) | 15.25 |
| 24 | `pipelined_m:data_width=22,n_iter=18,angle_guard=0,frac_guard=2,rounding=round,m=6` | 1413 | 275 | 62.5 | 5 | 0.127 | 1.25e-05 (2^-16.28) | 16.28 |
| 25 | `pipelined_m:data_width=22,n_iter=18,angle_guard=3,frac_guard=2,rounding=round,m=6` | 1467 | 285 | 62.5 | 5 | 0.132 | 8.89e-06 (2^-16.78) | 16.78 |
| 26 | `pipelined_m:data_width=22,n_iter=18,angle_guard=3,frac_guard=4,rounding=round,m=6` | 1538 | 293 | 62.5 | 5 | 0.138 | 8.25e-06 (2^-16.89) | 16.89 |
| 27 | `pipelined_m:data_width=25,n_iter=18,angle_guard=3,frac_guard=1,rounding=round,m=6` | 1599 | 314 | 59.9 | 5 | 0.144 | 7.83e-06 (2^-16.96) | 16.96 |
| 28 | `pipelined_m:data_width=25,n_iter=19,angle_guard=0,frac_guard=1,rounding=trunc,m=6` | 1580 | 387 | 62.5 | 6 | 0.148 | 4.5e-06 (2^-17.76) | 17.76 |
| 29 | `pipelined_m:data_width=26,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc,m=5` | 1599 | 395 | 73.7 | 6 | 0.15 | 4.32e-06 (2^-17.82) | 17.82 |
| 30 | `pipelined_m:data_width=27,n_iter=19,angle_guard=-1,frac_guard=2,rounding=round,m=7` | 1769 | 328 | 52.0 | 5 | 0.158 | 4.13e-06 (2^-17.88) | 17.88 |
| 31 | `pipelined_m:data_width=27,n_iter=19,angle_guard=4,frac_guard=4,rounding=trunc,m=7` | 1883 | 349 | 49.9 | 5 | 0.168 | 3.84e-06 (2^-17.99) | 17.99 |
| 32 | `pipelined_m:data_width=25,n_iter=22,angle_guard=2,frac_guard=1,rounding=round,m=6` | 1939 | 398 | 59.9 | 6 | 0.176 | 8.1e-07 (2^-20.23) | 20.23 |
| 33 | `pipelined_m:data_width=27,n_iter=22,angle_guard=2,frac_guard=2,rounding=round,m=7` | 2120 | 432 | 52.0 | 6 | 0.192 | 5.33e-07 (2^-20.84) | 20.84 |
| 34 | `pipelined_m:data_width=27,n_iter=27,angle_guard=1,frac_guard=0,rounding=round,m=7` | 2416 | 414 | 52.0 | 6 | 0.213 | 2.33e-07 (2^-22.03) | 22.03 |
| 35 | `pipelined_m:data_width=27,n_iter=28,angle_guard=1,frac_guard=4,rounding=round,m=5` | 2793 | 636 | 67.8 | 8 | 0.258 | 1.31e-07 (2^-22.86) | 22.86 |
| 36 | `pipelined_m:data_width=27,n_iter=29,angle_guard=3,frac_guard=4,rounding=round,m=5` | 2954 | 648 | 67.8 | 8 | 0.271 | 4.54e-08 (2^-24.39) | 24.39 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Accuracy (max_abs_err<=2^-10, i.e. accuracy_bits>=10) is family-independent and needs roughly data_width>=12 with n_iter>=12, so I search W 10..18 and N 8..20 to bracket the accuracy boundary and let the optimiser find the cheapest (W,N,angle_guard,frac_guard,rounding) that clears it; angle_guard -2..2 and frac_guard 0..2 cover the precision knobs that trade area for error. The binding system constraint is p99 latency over 8-deep bursts, which favours 1-result/cycle families (pipelined, pipelined_m) and high-k unrolled_k, so they get the bulk of the budget; iterative gets a small share only to test whether its much lower area can survive the burst-drain bound. Throughput>=2 Msps is trivially met by every family, so it does not drive the split. Round 1 is deliberately broad to locate the feasible region and the shape of the area/accuracy front; later rounds will narrow around the boundary and spend the reserved budget mapping the front over the full ranges of the families that survive.*)
- `iterative` (15 evals): data_width=10..18, n_iter=8..20, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* Cheapest area per result (shared datapath, no per-stage registers) so it is the likely min-luts_plus_ffs corner if it can pass the system bound; but N+3 cycles/result makes an 8-deep burst drain slowly, so give it a small share to probe whether any (small N, high Fmax) point clears p99<=0.4us at L1.
- `unrolled_k` (30 evals): data_width=10..18, n_iter=8..20, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, k=2..8. *Why:* k chained micro-rotations/cycle cuts burst-drain time to ceil(N/k)+3 cycles while keeping a shared datapath, so it can plausibly satisfy the bursty p99 bound at lower area than a full pipeline; k is the key knob trading Fmax/area against drain rate.
- `pipelined` (25 evals): data_width=10..18, n_iter=8..20, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* 1 result/cycle drains an 8-request burst in ~8 cycles, so it is the safest family for the p99 latency constraint; it costs the most FFs, so it anchors the high-area end of the front and gives a reliable feasible fallback.
- `pipelined_m` (30 evals): data_width=10..18, n_iter=8..20, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Still 1 result/cycle (so it meets the bursty p99 bound) but registers only every m stages, cutting FFs versus the full pipeline; m trades Fmax/latency against area and is the most likely family to hold the low-area end of the feasible front.

**Result (code):** 100 evaluations this round, 100 total; 34 feasible; hypervolume 6467 (n/a).

**LLM decision:** `map_front` — Round 1 shows a clear winner family: pipelined_m dominates the front (all 4 Pareto designs, best luts_plus_ffs=935, best accuracy 13.35 bits), while iterative and unrolled_k produced 0 feasible designs (max throughput 14.5/14 MSPS, far below the 2 MSPS constraint's needs under bursty p99 latency) and pipelined's best feasible area is 1604 vs 935. The front is narrow: data_width only 17..18 (registry 8..28), m only 7, n_iter 13..17, and the objective range luts_plus_ffs 935..1295 is a small slice of the HV reference 3000. With 300 evals left and 3 rounds, the best use of this round is a code-driven NSGA-II coverage search over the full parameter ranges of pipelined_m (and pipelined as the secondary feasible family), seeded with the current front, to map the whole trade-off curve before refining.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6467 (gain this round: n/a (first round)).
Feasible designs: 34 of 100 evaluations (26 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 47% violate; best seen 9.61e-05 (2^-13.35)
- sys_p99_latency_us <= 0.4: 45% violate; best seen 0.0568

Pareto front (feasible, 4 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=-2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=935, accuracy_bits=10.6, luts=786, ffs=149, throughput_msps=59.6, max_abs_err=0.00065 (2^-10.59), power_index=0.0704
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=1002, accuracy_bits=12, luts=841, ffs=161, throughput_msps=56.8, max_abs_err=0.00024 (2^-12.03), power_index=0.0754
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=7] luts_plus_ffs=1072, accuracy_bits=12.6, luts=906, ffs=165, throughput_msps=56.8, max_abs_err=0.00016 (2^-12.61), power_index=0.0806
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1295, accuracy_bits=13.3, luts=1067, ffs=228, throughput_msps=56.8, max_abs_err=9.61e-05 (2^-13.35), power_index=0.0975
Front coverage: luts_plus_ffs 935..1295 (HV reference 3000); accuracy_bits 10.6..13.3 (HV reference 10); data_width on the front 17..18 (registry 8..28).

Per family:
- iterative: 15 evals, 0 feasible; max throughput seen 14.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 13.27 bits
- pipelined: 25 evals, 15 feasible; max throughput seen 282 MSPS; best accuracy 12.16 bits; best feasible luts_plus_ffs=1604; feasible ranges: data_width 14..17, n_iter 15..19, angle_guard -2..1, frac_guard 0..2
- pipelined_m: 30 evals, 19 feasible; max throughput seen 178 MSPS; best accuracy 13.35 bits; best feasible luts_plus_ffs=935; feasible ranges: data_width 16..18, n_iter 13..17, angle_guard -2..2, frac_guard 0..2, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (4 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 133 feasible; hypervolume 1.464e+04 (+126.4%).

**LLM decision:** `refine` — The feasible front is now entirely pipelined_m: iterative and unrolled_k produced 0 feasible designs (max throughput 14.5/14 MSPS, below the 2 MSPS floor is not the issue but they never met the sys/accuracy combo), and pipelined's best feasible luts_plus_ffs=1604 is dominated by pipelined_m's 935. HV jumped +126% to 1.464e4, but the front is thin exactly where it matters: (a) the selection-relevant low-cost end has only one design below 1072, and the cheapest (935 LUT+FF, acc 10.6 bits) sits just 0.6 bits above the 2^-10 constraint, so a cluster of cheap, robust designs is needed before L2 re-selection; (b) the HV-heavy region near the reference x=3000 is sparse — the 2336->2830 segment alone carries ~5.0e3 of the HV and the 2830->3000 segment ~2.0e3, while the 3601/24.4-bit design falls outside the ref box and contributes nothing. HV-driven NSGA-II systematically under-explores the low-cost/low-accuracy corner because it adds almost no area, so I refine both corners explicitly this round and leave the reserved map_front coverage pass for round 4.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.464e+04 (gain this round: +126.4%).
Feasible designs: 133 of 200 evaluations (122 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 24% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_latency_us <= 0.4: 22% violate; best seen 0.0568

Pareto front (feasible, 20 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=-2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=935, accuracy_bits=10.6, luts=786, ffs=149, throughput_msps=59.6, max_abs_err=0.00065 (2^-10.59), power_index=0.0704
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=7] luts_plus_ffs=1072, accuracy_bits=12.6, luts=906, ffs=165, throughput_msps=56.8, max_abs_err=0.00016 (2^-12.61), power_index=0.0806
- pipelined_m [data_width=20 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1299, accuracy_bits=13.9, luts=1112, ffs=188, throughput_msps=48, max_abs_err=6.57e-05 (2^-13.89), power_index=0.0978
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=4 rounding=trunc m=6] luts_plus_ffs=1532, accuracy_bits=15.3, luts=1270, ffs=262, throughput_msps=62.5, max_abs_err=2.56e-05 (2^-15.25), power_index=0.115
- pipelined_m [data_width=22 n_iter=18 angle_guard=3 frac_guard=2 rounding=round m=6] luts_plus_ffs=1751, accuracy_bits=16.8, luts=1467, ffs=285, throughput_msps=62.5, max_abs_err=8.89e-06 (2^-16.78), power_index=0.132
- pipelined_m [data_width=25 n_iter=19 angle_guard=0 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=1967, accuracy_bits=17.8, luts=1580, ffs=387, throughput_msps=62.5, max_abs_err=4.5e-06 (2^-17.76), power_index=0.148
- pipelined_m [data_width=27 n_iter=19 angle_guard=-1 frac_guard=2 rounding=round m=7] luts_plus_ffs=2097, accuracy_bits=17.9, luts=1769, ffs=328, throughput_msps=52, max_abs_err=4.13e-06 (2^-17.88), power_index=0.158
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=2336, accuracy_bits=20.2, luts=1939, ffs=398, throughput_msps=59.9, max_abs_err=8.1e-07 (2^-20.23), power_index=0.176
- pipelined_m [data_width=27 n_iter=27 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=2830, accuracy_bits=22, luts=2416, ffs=414, throughput_msps=52, max_abs_err=2.33e-07 (2^-22.03), power_index=0.213
- pipelined_m [data_width=27 n_iter=29 angle_guard=3 frac_guard=4 rounding=round m=5] luts_plus_ffs=3601, accuracy_bits=24.4, luts=2954, ffs=648, throughput_msps=67.8, max_abs_err=4.54e-08 (2^-24.39), power_index=0.271
Front coverage: luts_plus_ffs 935..3601 (HV reference 3000); accuracy_bits 10.6..24.4 (HV reference 10); data_width on the front 17..27 (registry 8..28).

Per family:
- iterative: 15 evals, 0 feasible; max throughput seen 14.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 13.27 bits
- pipelined: 25 evals, 15 feasible; max throughput seen 282 MSPS; best accuracy 12.16 bits; best feasible luts_plus_ffs=1604; feasible ranges: data_width 14..17, n_iter 15..19, angle_guard -2..1, frac_guard 0..2
- pipelined_m: 130 evals, 118 feasible; max throughput seen 178 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=935; feasible ranges: data_width 16..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Two disjoint pipelined_m boxes: the low-cost corner for the min-luts_plus_ffs selection rule and L2 robustness, and the high-accuracy corner for hypervolume near the reference point.*)
- `pipelined_m` (100 evals): data_width=14..18, n_iter=12..18, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=4..8. *Why:* Selection is min luts_plus_ffs, and the only sub-1072 design (935, acc 10.6 bits) has just 0.6 bits of margin over the 2^-10 constraint; pipelined_m's feasible data_width range starts at 16 but pipelined reached 14, so cheaper W=14..16 variants with enough n_iter/guards may exist and would both lower the selected cost and thicken the L2-robust cheap cluster.
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 100 evaluations this round, 300 total; 220 feasible; hypervolume 1.496e+04 (+2.2%).

**LLM decision:** `refine` — The front is entirely pipelined_m and is mature (230 evals, 205 feasible; HV gain down to +2.2%), and it already spans luts_plus_ffs 790..3601 (HV ref 3000) and 10.1..24.4 accuracy bits (ref 10) — both objective ranges are well covered, so map_front and widen are not indicated, and iterative/unrolled_k never produced a feasible point (0/15, 0/30). The remaining leverage is the low-area corner where the selection rule (min luts_plus_ffs) points: the cheapest point is 790 L+FF with m=8, and the neighbouring 860 L+FF m=4 point shows smaller m trades ~70 L+FF for ~2x Fmax (97.8 vs 52.7 MSPS) and hence much more sys_p99 margin — worth probing because the notes warn that a cheap design only just passing the L1 bound can be lost at L2. So I spend ~70% of the last round refining pipelined_m with large m (m 6..8, W 14..17, N 11..17, guards -1..2) to push below 790 while keeping latency headroom, and ~30% on the mid-accuracy band (W 18..22, N 14..20, m 4..8) to keep the interior of the curve covered. pipelined is left out: its best feasible area (1604 L+FF) is already dominated by pipelined_m, and its fixed N+2 latency is worse for bursts.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.496e+04 (gain this round: +2.2%).
Feasible designs: 220 of 300 evaluations (198 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 20% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_latency_us <= 0.4: 15% violate; best seen 0.0568

Pareto front (feasible, 32 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=0 frac_guard=1 rounding=round m=8] luts_plus_ffs=790, accuracy_bits=10.1, luts=651, ffs=139, throughput_msps=52.7, max_abs_err=0.000939 (2^-10.06), power_index=0.0595
- pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=860, accuracy_bits=10.3, luts=663, ffs=197, throughput_msps=97.8, max_abs_err=0.000773 (2^-10.34), power_index=0.0647
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=1002, accuracy_bits=12.5, luts=841, ffs=161, throughput_msps=56.8, max_abs_err=0.000175 (2^-12.48), power_index=0.0754
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=7] luts_plus_ffs=1072, accuracy_bits=12.6, luts=906, ffs=165, throughput_msps=56.8, max_abs_err=0.00016 (2^-12.61), power_index=0.0806
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=2 rounding=round m=6] luts_plus_ffs=1286, accuracy_bits=13.3, luts=1055, ffs=231, throughput_msps=65.4, max_abs_err=0.000102 (2^-13.25), power_index=0.0967
- pipelined_m [data_width=20 n_iter=17 angle_guard=3 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1459, accuracy_bits=15, luts=1202, ffs=256, throughput_msps=54.3, max_abs_err=3.13e-05 (2^-14.96), power_index=0.11
- pipelined_m [data_width=22 n_iter=18 angle_guard=3 frac_guard=4 rounding=round m=6] luts_plus_ffs=1831, accuracy_bits=16.9, luts=1538, ffs=293, throughput_msps=62.5, max_abs_err=8.25e-06 (2^-16.89), power_index=0.138
- pipelined_m [data_width=26 n_iter=19 angle_guard=0 frac_guard=0 rounding=trunc m=5] luts_plus_ffs=1994, accuracy_bits=17.8, luts=1599, ffs=395, throughput_msps=73.7, max_abs_err=4.32e-06 (2^-17.82), power_index=0.15
- pipelined_m [data_width=27 n_iter=22 angle_guard=2 frac_guard=2 rounding=round m=7] luts_plus_ffs=2552, accuracy_bits=20.8, luts=2120, ffs=432, throughput_msps=52, max_abs_err=5.33e-07 (2^-20.84), power_index=0.192
- pipelined_m [data_width=27 n_iter=29 angle_guard=3 frac_guard=4 rounding=round m=5] luts_plus_ffs=3601, accuracy_bits=24.4, luts=2954, ffs=648, throughput_msps=67.8, max_abs_err=4.54e-08 (2^-24.39), power_index=0.271
Front coverage: luts_plus_ffs 790..3601 (HV reference 3000); accuracy_bits 10.1..24.4 (HV reference 10); data_width on the front 15..27 (registry 8..28).

Per family:
- iterative: 15 evals, 0 feasible; max throughput seen 14.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 13.27 bits
- pipelined: 25 evals, 15 feasible; max throughput seen 282 MSPS; best accuracy 12.16 bits; best feasible luts_plus_ffs=1604; feasible ranges: data_width 14..17, n_iter 15..19, angle_guard -2..1, frac_guard 0..2
- pipelined_m: 230 evals, 205 feasible; max throughput seen 178 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=790; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: **)
- `pipelined_m` (100 evals): data_width=14..17, n_iter=11..17, angle_guard=-1..2, frac_guard=0..2, rounding=round|trunc, m=6..8. *Why:* chase even lower area and lower sys_p99 latency with a large m
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 100 evaluations this round, 400 total; 313 feasible; hypervolume 1.503e+04 (+0.5%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the front is feasible and still improving only marginally (+0.5% HV this round), so further search is not warranted. Evidence: 313 of 400 evaluations are feasible (269 unique) and the feasible Pareto front has 37 designs spanning luts_plus_ffs 773..3601 and accuracy_bits 10..24.4, i.e. it already covers the HV reference box (area ref 3000, accuracy ref 10) on both axes. All three constraints are comfortably met by the front's best designs: throughput_msps best 282 vs >=2 required (0% violations), max_abs_err best 4.54e-08 vs <=9.77e-04 (17% violations overall, but the front's cheapest point already sits exactly at 2^-10.00), and sys_p99_latency_us best 0.0568 us vs <=0.4 us (11% violations overall). The selection rule (min luts_plus_ffs) is served by pipelined_m [data_width=14 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=7] at luts_plus_ffs=773, accuracy_bits=10, throughput 59.6 MSPS, which satisfies every constraint with margin on throughput and latency. All four registry families were explored (iterative and unrolled_k produced 0 feasible designs, max throughput 14.5 and 14 MSPS respectively, so they cannot meet the 2 MSPS-plus-bursty system requirement), and no unexplored family remains, so there is nothing left to add or widen. Hence stop rather than infeasible.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.503e+04 (gain this round: +0.5%).
Feasible designs: 313 of 400 evaluations (269 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 17% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_latency_us <= 0.4: 11% violate; best seen 0.0568

Pareto front (feasible, 37 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=773, accuracy_bits=10, luts=638, ffs=135, throughput_msps=59.6, max_abs_err=0.000976 (2^-10.00), power_index=0.0581
- pipelined_m [data_width=17 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=8] luts_plus_ffs=831, accuracy_bits=10.8, luts=678, ffs=153, throughput_msps=52.7, max_abs_err=0.000568 (2^-10.78), power_index=0.0625
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=7] luts_plus_ffs=920, accuracy_bits=11.7, luts=772, ffs=147, throughput_msps=59.6, max_abs_err=0.000294 (2^-11.73), power_index=0.0692
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=1002, accuracy_bits=12.5, luts=841, ffs=161, throughput_msps=56.8, max_abs_err=0.000175 (2^-12.48), power_index=0.0754
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=7] luts_plus_ffs=1092, accuracy_bits=12.7, luts=876, ffs=216, throughput_msps=56.8, max_abs_err=0.000148 (2^-12.72), power_index=0.0821
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=1288, accuracy_bits=13.9, luts=1055, ffs=233, throughput_msps=65.4, max_abs_err=6.45e-05 (2^-13.92), power_index=0.0969
- pipelined_m [data_width=22 n_iter=18 angle_guard=0 frac_guard=2 rounding=round m=6] luts_plus_ffs=1689, accuracy_bits=16.3, luts=1413, ffs=275, throughput_msps=62.5, max_abs_err=1.25e-05 (2^-16.28), power_index=0.127
- pipelined_m [data_width=25 n_iter=19 angle_guard=0 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=1967, accuracy_bits=17.8, luts=1580, ffs=387, throughput_msps=62.5, max_abs_err=4.5e-06 (2^-17.76), power_index=0.148
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=2336, accuracy_bits=20.2, luts=1939, ffs=398, throughput_msps=59.9, max_abs_err=8.1e-07 (2^-20.23), power_index=0.176
- pipelined_m [data_width=27 n_iter=29 angle_guard=3 frac_guard=4 rounding=round m=5] luts_plus_ffs=3601, accuracy_bits=24.4, luts=2954, ffs=648, throughput_msps=67.8, max_abs_err=4.54e-08 (2^-24.39), power_index=0.271
Front coverage: luts_plus_ffs 773..3601 (HV reference 3000); accuracy_bits 10..24.4 (HV reference 10); data_width on the front 14..27 (registry 8..28).

Per family:
- iterative: 15 evals, 0 feasible; max throughput seen 14.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 30 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 13.27 bits
- pipelined: 25 evals, 15 feasible; max throughput seen 282 MSPS; best accuracy 12.16 bits; best feasible luts_plus_ffs=1604; feasible ranges: data_width 14..17, n_iter 15..19, angle_guard -2..1, frac_guard 0..2
- pipelined_m: 330 evals, 298 feasible; max throughput seen 178 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=773; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 17824 in, 19896 out
- provider-reported cost: $0.0160
- full prompts and replies: `llm_trace.jsonl`

