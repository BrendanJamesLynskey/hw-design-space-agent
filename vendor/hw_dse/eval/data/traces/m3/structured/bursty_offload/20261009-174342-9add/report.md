# DSE run: bursty_offload

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined_m:data_width=14,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 688 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 135 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 75.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0619 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000746 (2^-10.39) | exact: bit-accurate model, exhaustive (16384 angles) |
| max_abs_err_lsb | 3.05 | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err | 0.000195 (2^-12.32) | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err_lsb | 0.8 | exact: bit-accurate model, exhaustive (16384 angles) |
| accuracy_bits | 10.4 | exact: bit-accurate model, exhaustive (16384 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 77.3 dBc, SNR 71.3 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=14,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=1,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=6` | 0.1459 → 0.1953 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=round,m=6` | 0.1459 → 0.1953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (43 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=14,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 688 | 135 | 52.7 | 4 | 0.0619 | 0.000746 (2^-10.39) | 10.39 |
| 1 | `pipelined_m:data_width=16,n_iter=12,angle_guard=0,frac_guard=1,rounding=round,m=7` | 688 | 147 | 59.6 | 4 | 0.0628 | 0.000703 (2^-10.47) | 10.47 |
| 2 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=6` | 701 | 151 | 68.5 | 4 | 0.0641 | 0.000597 (2^-10.71) | 10.71 |
| 3 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=7` | 701 | 151 | 59.6 | 4 | 0.0641 | 0.000597 (2^-10.71) | 10.71 |
| 4 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=round,m=6` | 734 | 153 | 68.5 | 4 | 0.0668 | 0.000548 (2^-10.83) | 10.83 |
| 5 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=round,m=8` | 734 | 153 | 52.7 | 4 | 0.0668 | 0.000548 (2^-10.83) | 10.83 |
| 6 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=2,rounding=round,m=7` | 734 | 153 | 59.6 | 4 | 0.0668 | 0.000548 (2^-10.83) | 10.83 |
| 7 | `pipelined_m:data_width=16,n_iter=12,angle_guard=4,frac_guard=3,rounding=round,m=7` | 781 | 159 | 56.8 | 4 | 0.0707 | 0.000531 (2^-10.88) | 10.88 |
| 8 | `pipelined_m:data_width=19,n_iter=13,angle_guard=-1,frac_guard=0,rounding=round,m=7` | 789 | 165 | 56.8 | 4 | 0.0718 | 0.000296 (2^-11.72) | 11.72 |
| 9 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=7` | 877 | 159 | 56.8 | 4 | 0.0779 | 0.000191 (2^-12.36) | 12.36 |
| 10 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=round,m=7` | 904 | 161 | 56.8 | 4 | 0.0802 | 0.000169 (2^-12.53) | 12.53 |
| 11 | `pipelined_m:data_width=19,n_iter=14,angle_guard=3,frac_guard=2,rounding=trunc,m=7` | 964 | 178 | 56.8 | 4 | 0.0859 | 0.000136 (2^-12.85) | 12.85 |
| 12 | `pipelined_m:data_width=19,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=8` | 977 | 178 | 50.3 | 4 | 0.0868 | 0.000132 (2^-12.88) | 12.88 |
| 13 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=7` | 941 | 222 | 56.8 | 5 | 0.0875 | 0.00013 (2^-12.91) | 12.91 |
| 14 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round,m=6` | 971 | 226 | 65.4 | 5 | 0.09 | 0.000108 (2^-13.18) | 13.18 |
| 15 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=6` | 1037 | 226 | 65.4 | 5 | 0.095 | 8.59e-05 (2^-13.51) | 13.51 |
| 16 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=7` | 1037 | 226 | 56.8 | 5 | 0.095 | 8.59e-05 (2^-13.51) | 13.51 |
| 17 | `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=3,rounding=round,m=8` | 1093 | 180 | 50.3 | 4 | 0.0957 | 7.02e-05 (2^-13.80) | 13.80 |
| 18 | `pipelined_m:data_width=19,n_iter=15,angle_guard=3,frac_guard=3,rounding=round,m=8` | 1107 | 182 | 50.3 | 4 | 0.097 | 6.68e-05 (2^-13.87) | 13.87 |
| 19 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=3,rounding=round,m=8` | 1152 | 178 | 50.3 | 4 | 0.1 | 4.61e-05 (2^-14.40) | 14.40 |
| 20 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=4,rounding=round,m=8` | 1199 | 182 | 48.0 | 4 | 0.104 | 4.03e-05 (2^-14.60) | 14.60 |
| 21 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=round,m=7` | 1135 | 246 | 56.8 | 5 | 0.104 | 3.32e-05 (2^-14.88) | 14.88 |
| 22 | `pipelined_m:data_width=22,n_iter=17,angle_guard=1,frac_guard=0,rounding=round,m=7` | 1236 | 268 | 54.3 | 5 | 0.113 | 1.95e-05 (2^-15.64) | 15.64 |
| 23 | `pipelined_m:data_width=22,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=7` | 1367 | 281 | 54.3 | 5 | 0.124 | 1.67e-05 (2^-15.87) | 15.87 |
| 24 | `pipelined_m:data_width=22,n_iter=19,angle_guard=0,frac_guard=3,rounding=trunc,m=8` | 1485 | 277 | 48.0 | 5 | 0.133 | 9.29e-06 (2^-16.72) | 16.72 |
| 25 | `pipelined_m:data_width=22,n_iter=20,angle_guard=0,frac_guard=3,rounding=trunc,m=8` | 1567 | 277 | 48.0 | 5 | 0.139 | 7.95e-06 (2^-16.94) | 16.94 |
| 26 | `pipelined_m:data_width=22,n_iter=20,angle_guard=0,frac_guard=3,rounding=round,m=8` | 1613 | 279 | 48.0 | 5 | 0.142 | 7.68e-06 (2^-16.99) | 16.99 |
| 27 | `pipelined_m:data_width=22,n_iter=20,angle_guard=0,frac_guard=3,rounding=round,m=7` | 1613 | 279 | 54.3 | 5 | 0.142 | 7.68e-06 (2^-16.99) | 16.99 |
| 28 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=3,rounding=round,m=7` | 1633 | 282 | 54.3 | 5 | 0.144 | 4.49e-06 (2^-17.77) | 17.77 |
| 29 | `pipelined_m:data_width=25,n_iter=20,angle_guard=-2,frac_guard=1,rounding=round,m=8` | 1680 | 299 | 48.0 | 5 | 0.149 | 4.28e-06 (2^-17.84) | 17.84 |
| 30 | `pipelined_m:data_width=26,n_iter=19,angle_guard=1,frac_guard=0,rounding=round,m=6` | 1618 | 400 | 59.9 | 6 | 0.152 | 3.96e-06 (2^-17.94) | 17.94 |
| 31 | `pipelined_m:data_width=26,n_iter=21,angle_guard=1,frac_guard=1,rounding=trunc,m=8` | 1839 | 317 | 45.9 | 5 | 0.162 | 1.23e-06 (2^-19.63) | 19.63 |
| 32 | `pipelined_m:data_width=26,n_iter=21,angle_guard=2,frac_guard=1,rounding=round,m=8` | 1915 | 322 | 45.9 | 5 | 0.168 | 1.12e-06 (2^-19.76) | 19.76 |
| 33 | `pipelined_m:data_width=26,n_iter=21,angle_guard=2,frac_guard=3,rounding=round,m=7` | 1999 | 330 | 52.0 | 5 | 0.175 | 1.04e-06 (2^-19.88) | 19.88 |
| 34 | `pipelined_m:data_width=27,n_iter=21,angle_guard=4,frac_guard=1,rounding=round,m=8` | 2022 | 339 | 44.0 | 5 | 0.178 | 1.01e-06 (2^-19.92) | 19.92 |
| 35 | `pipelined_m:data_width=25,n_iter=23,angle_guard=3,frac_guard=1,rounding=round,m=8` | 2052 | 314 | 45.9 | 5 | 0.178 | 5.46e-07 (2^-20.80) | 20.80 |
| 36 | `pipelined_m:data_width=26,n_iter=23,angle_guard=1,frac_guard=3,rounding=round,m=8` | 2170 | 327 | 45.9 | 5 | 0.188 | 4.26e-07 (2^-21.16) | 21.16 |
| 37 | `pipelined_m:data_width=27,n_iter=23,angle_guard=1,frac_guard=3,rounding=trunc,m=8` | 2184 | 336 | 45.9 | 5 | 0.19 | 3.37e-07 (2^-21.50) | 21.50 |
| 38 | `pipelined_m:data_width=26,n_iter=24,angle_guard=2,frac_guard=3,rounding=round,m=7` | 2290 | 424 | 52.0 | 6 | 0.204 | 2.18e-07 (2^-22.13) | 22.13 |
| 39 | `pipelined_m:data_width=28,n_iter=27,angle_guard=0,frac_guard=1,rounding=round,m=6` | 2585 | 526 | 59.9 | 7 | 0.234 | 1.51e-07 (2^-22.66) | 22.66 |
| 40 | `pipelined_m:data_width=28,n_iter=27,angle_guard=2,frac_guard=1,rounding=trunc,m=5` | 2581 | 630 | 70.6 | 8 | 0.242 | 1.02e-07 (2^-23.22) | 23.22 |
| 41 | `pipelined_m:data_width=28,n_iter=27,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 2608 | 732 | 82.7 | 9 | 0.251 | 1e-07 (2^-23.25) | 23.25 |
| 42 | `pipelined_m:data_width=28,n_iter=27,angle_guard=2,frac_guard=3,rounding=trunc,m=3` | 2690 | 949 | 105.9 | 11 | 0.274 | 6.09e-08 (2^-23.97) | 23.97 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Max error <= 2^-10 needs data_width of about 11 or more and about 10 or more iterations, so the ranges sit around that region and extend upward to cover the accuracy_bits trade-off. The p99 latency of 0.4 us on bursts of 8 means the unit must accept a request every few cycles or less. That favours unrolled_k with large k and the pipelined families, while iterative is only a cheap probe. Later rounds will narrow the ranges to whichever families produce feasible Pareto points.*)
- `unrolled_k` (34 evals): data_width=11..18, n_iter=9..16, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round, k=3..8. *Why:* Shared datapath with k chained rotations cuts cycles per result, so a burst of 8 can drain within 0.4 us while area stays below a full pipeline. Larger k is needed because k=2 leaves too many cycles per result.
- `pipelined_m` (33 evals): data_width=11..18, n_iter=9..16, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Registering every m stages saves FFs compared with a full pipeline and still gives one result per cycle, so bursts do not queue. It is a likely area-minimal family when the latency bound is tight.
- `pipelined` (22 evals): data_width=11..18, n_iter=9..16, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round. *Why:* Full pipeline is the reference for the latency and throughput bounds and gives the highest Fmax. It is probably larger in area, but it is worth checking against pipelined_m.
- `iterative` (11 evals): data_width=11..16, n_iter=9..14, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest area, but N+3 cycles per result likely makes a burst of 8 miss the 0.4 us p99 bound. A small share tests this, and the family can be dropped in later rounds if it is infeasible.

**Result (code):** 100 evaluations this round, 100 total; 31 feasible; hypervolume 5868 (n/a).

**LLM decision:** `refine` — Iterative (0/11 feasible, max 16.5 MSPS) and unrolled_k (0/34 feasible, max 13.5 MSPS) cannot meet the p99 latency bound of 0.4 us for bursts of 8. All 6 front designs are pipelined_m, and pipelined is dominated (best feasible 1534 vs 1020). The front sits at data_width 16..17, but accuracy 2^-10 needs only about 10 bits. Narrower widths (about 12..16) with fewer iterations and a larger m (fewer registers) were probably under-sampled and could cut LUTs+FFs below 1020. Accuracy runs up to 13 bits at the high-area end. So I will concentrate on pipelined_m in the low-area region, probing slightly wider data_width, n_iter and m ranges, and keep a small pipelined share as a check.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5868 (gain this round: n/a (first round)).
Feasible designs: 31 of 100 evaluations (25 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 45% violate; best seen 0.00012 (2^-13.03)
- sys_p99_latency_us <= 0.4: 45% violate; best seen 0.066

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1020, accuracy_bits=10.6, luts=875, ffs=145, throughput_msps=52.7, max_abs_err=0.000643 (2^-10.60), power_index=0.0767
- pipelined_m [data_width=16 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1036, accuracy_bits=11.4, luts=890, ffs=145, throughput_msps=52.7, max_abs_err=0.000375 (2^-11.38), power_index=0.0779
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1036, accuracy_bits=12.4, luts=877, ffs=159, throughput_msps=56.8, max_abs_err=0.000191 (2^-12.36), power_index=0.0779
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1125, accuracy_bits=12.5, luts=905, ffs=220, throughput_msps=56.8, max_abs_err=0.000174 (2^-12.49), power_index=0.0846
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1163, accuracy_bits=12.9, luts=941, ffs=222, throughput_msps=56.8, max_abs_err=0.00013 (2^-12.91), power_index=0.0875
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1227, accuracy_bits=13, luts=1005, ffs=222, throughput_msps=56.8, max_abs_err=0.00012 (2^-13.03), power_index=0.0923
Front coverage: luts_plus_ffs 1020..1227 (HV reference 3000); accuracy_bits 10.6..13 (HV reference 10); data_width on the front 16..17 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.5 MSPS; best accuracy 12.38 bits
- unrolled_k: 34 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.76 bits
- pipelined: 22 evals, 11 feasible; max throughput seen 282 MSPS; best accuracy 12.65 bits; best feasible luts_plus_ffs=1534; feasible ranges: data_width 15..18, n_iter 13..15, angle_guard 0..2, frac_guard 1..2
- pipelined_m: 33 evals, 20 feasible; max throughput seen 178 MSPS; best accuracy 13.03 bits; best feasible luts_plus_ffs=1020; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard -1..2, frac_guard 0..2, m 7..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the low-area, narrower-datapath region of pipelined_m, where the front's cheapest end (1020 LUTs+FFs at W=16) may still be improvable. Drop the families that fail throughput and latency.*)
- `pipelined_m` (80 evals): data_width=12..17, n_iter=10..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=5..8. *Why:* All front points come from this family. Lower width, fewer iterations and larger m are the likely directions for lower area while still meeting 2^-10 error.
- `pipelined` (20 evals): data_width=12..16, n_iter=10..15, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Feasible at 11/22 but dominated so far; a small check at lower widths confirms it cannot beat pipelined_m.

**Result (code):** 100 evaluations this round, 200 total; 82 feasible; hypervolume 6313 (+7.6%).

**LLM decision:** `refine` — The front has 11 designs, all pipelined_m, and the last round gained +7.6% HV. Iterative and unrolled_k have 0 feasible designs in 45 evaluations, with throughput capped at 16.5 and 13.5 MSPS. They fail the p99 <= 0.4 us bound for bursts of 8, so I am dropping them. Pipelined has 17 feasible designs, and its best (1250 LUTs+FFs) is dominated by pipelined_m (823). The selection rule picks the minimum area, which is the 823 corner (data_width 14, n_iter 13, m=8, 10.4 bits). The feasible region is still only partly mapped: the data_width 13..14 and n_iter 11..13 corner has not been probed, and the 13.2-bit end of the front has no data beyond data_width 17. Most of the budget goes to pipelined_m, with ranges that extend slightly past the observed feasible ones in both directions. Pipelined keeps a small share as a cross-check, and the remaining budget stays for code's final front-mapping pass.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 6313 (gain this round: +7.6%).
Feasible designs: 82 of 200 evaluations (68 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 47% violate; best seen 0.000108 (2^-13.18)
- sys_p99_latency_us <= 0.4: 22% violate; best seen 0.0639

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=823, accuracy_bits=10.4, luts=688, ffs=135, throughput_msps=52.7, max_abs_err=0.000746 (2^-10.39), power_index=0.0619
- pipelined_m [data_width=16 n_iter=12 angle_guard=0 frac_guard=1 rounding=round m=7] luts_plus_ffs=835, accuracy_bits=10.5, luts=688, ffs=147, throughput_msps=59.6, max_abs_err=0.000703 (2^-10.47), power_index=0.0628
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=852, accuracy_bits=10.7, luts=701, ffs=151, throughput_msps=68.5, max_abs_err=0.000597 (2^-10.71), power_index=0.0641
- pipelined_m [data_width=15 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=973, accuracy_bits=11.3, luts=831, ffs=141, throughput_msps=52.7, max_abs_err=0.000393 (2^-11.31), power_index=0.0732
- pipelined_m [data_width=17 n_iter=13 angle_guard=0 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=995, accuracy_bits=11.4, luts=777, ffs=218, throughput_msps=65.4, max_abs_err=0.000381 (2^-11.36), power_index=0.0748
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1036, accuracy_bits=12.4, luts=877, ffs=159, throughput_msps=56.8, max_abs_err=0.000191 (2^-12.36), power_index=0.0779
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1125, accuracy_bits=12.5, luts=905, ffs=220, throughput_msps=56.8, max_abs_err=0.000174 (2^-12.49), power_index=0.0846
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=5] luts_plus_ffs=1159, accuracy_bits=12.8, luts=935, ffs=224, throughput_msps=77, max_abs_err=0.000143 (2^-12.77), power_index=0.0872
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1163, accuracy_bits=12.9, luts=941, ffs=222, throughput_msps=56.8, max_abs_err=0.00013 (2^-12.91), power_index=0.0875
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=6] luts_plus_ffs=1197, accuracy_bits=13.2, luts=971, ffs=226, throughput_msps=65.4, max_abs_err=0.000108 (2^-13.18), power_index=0.09
Front coverage: luts_plus_ffs 823..1197 (HV reference 3000); accuracy_bits 10.4..13.2 (HV reference 10); data_width on the front 14..17 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.5 MSPS; best accuracy 12.38 bits
- unrolled_k: 34 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.76 bits
- pipelined: 42 evals, 17 feasible; max throughput seen 282 MSPS; best accuracy 12.65 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 15..18, n_iter 12..15, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 113 evals, 65 feasible; max throughput seen 178 MSPS; best accuracy 13.18 bits; best feasible luts_plus_ffs=823; feasible ranges: data_width 14..17, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, m 5..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on pipelined_m around and slightly beyond its feasible region to lower the minimum area and extend accuracy.*)
- `pipelined_m` (32 evals): data_width=13..19, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=4..8. *Why:* Every front point comes from this family. These ranges probe the low-area corner (width 13..14, fewer iterations, large m) and extend the high-accuracy end beyond 13.2 bits.
- `pipelined` (8 evals): data_width=13..18, n_iter=11..15, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Its best feasible area (1250) is dominated by pipelined_m, so it keeps only a small share as a cross-check at the low-area corner.

**Result (code):** 40 evaluations this round, 240 total; 115 feasible; hypervolume 7545 (+19.5%).

**LLM decision:** `stop` — This is the final round, so stop. The front has 20 feasible designs, all pipelined_m, spanning luts_plus_ffs 823..1289 and accuracy_bits 10.4..13.9. The feasible hypervolume is 7545, and round 3 added +19.5%. The cheapest design (pipelined_m, W=14, N=13, m=8, 823 LUTs+FFs) meets the error bound at 2^-10.39 with throughput of 52.7 MSPS against the 2 MSPS requirement. The iterative and unrolled_k families produced no feasible designs, since their best throughput is 16.5 and 13.5 MSPS and they are infeasible on the system latency bound. Pipelined's best feasible area is 1250, well above pipelined_m's 823. The selection rule picks the minimum-area design, and the low-area end of the front sits just above the accuracy limit of 10 bits (10.4). That leaves little room for further area reduction.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7545 (gain this round: +19.5%).
Feasible designs: 115 of 240 evaluations (100 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 42% violate; best seen 6.68e-05 (2^-13.87)
- sys_p99_latency_us <= 0.4: 19% violate; best seen 0.0639

Pareto front (feasible, 20 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=823, accuracy_bits=10.4, luts=688, ffs=135, throughput_msps=52.7, max_abs_err=0.000746 (2^-10.39), power_index=0.0619
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=852, accuracy_bits=10.7, luts=701, ffs=151, throughput_msps=68.5, max_abs_err=0.000597 (2^-10.71), power_index=0.0641
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=2 rounding=round m=6] luts_plus_ffs=888, accuracy_bits=10.8, luts=734, ffs=153, throughput_msps=68.5, max_abs_err=0.000548 (2^-10.83), power_index=0.0668
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=2 rounding=round m=7] luts_plus_ffs=888, accuracy_bits=10.8, luts=734, ffs=153, throughput_msps=59.6, max_abs_err=0.000548 (2^-10.83), power_index=0.0668
- pipelined_m [data_width=15 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=973, accuracy_bits=11.3, luts=831, ffs=141, throughput_msps=52.7, max_abs_err=0.000393 (2^-11.31), power_index=0.0732
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=7] luts_plus_ffs=1066, accuracy_bits=12.5, luts=904, ffs=161, throughput_msps=56.8, max_abs_err=0.000169 (2^-12.53), power_index=0.0802
- pipelined_m [data_width=19 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=8] luts_plus_ffs=1154, accuracy_bits=12.9, luts=977, ffs=178, throughput_msps=50.3, max_abs_err=0.000132 (2^-12.88), power_index=0.0868
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=6] luts_plus_ffs=1197, accuracy_bits=13.2, luts=971, ffs=226, throughput_msps=65.4, max_abs_err=0.000108 (2^-13.18), power_index=0.09
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=7] luts_plus_ffs=1263, accuracy_bits=13.5, luts=1037, ffs=226, throughput_msps=56.8, max_abs_err=8.59e-05 (2^-13.51), power_index=0.095
- pipelined_m [data_width=19 n_iter=15 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=1289, accuracy_bits=13.9, luts=1107, ffs=182, throughput_msps=50.3, max_abs_err=6.68e-05 (2^-13.87), power_index=0.097
Front coverage: luts_plus_ffs 823..1289 (HV reference 3000); accuracy_bits 10.4..13.9 (HV reference 10); data_width on the front 14..19 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.5 MSPS; best accuracy 12.38 bits
- unrolled_k: 34 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.76 bits
- pipelined: 50 evals, 22 feasible; max throughput seen 282 MSPS; best accuracy 12.65 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 14..18, n_iter 12..15, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 145 evals, 93 feasible; max throughput seen 178 MSPS; best accuracy 13.87 bits; best feasible luts_plus_ffs=823; feasible ranges: data_width 14..19, n_iter 12..17, angle_guard -1..3, frac_guard 0..3, m 4..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=13..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (20 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 256 feasible; hypervolume 1.579e+04 (+109.2%).

**No LLM call** (code's front-mapping round): This is the final round, so stop. The front has 20 feasible designs, all pipelined_m, spanning luts_plus_ffs 823..1289 and accuracy_bits 10.4..13.9. The feasible hypervolume is 7545, and round 3 added +19.5%. The cheapest design (pipelined_m, W=14, N=13, m=8, 823 LUTs+FFs) meets the error bound at 2^-10.39 with throughput of 52.7 MSPS against the 2 MSPS requirement. The iterative and unrolled_k families produced no feasible designs, since their best throughput is 16.5 and 13.5 MSPS and they are infeasible on the system latency bound. Pipelined's best feasible area is 1250, well above pipelined_m's 823. The selection rule picks the minimum-area design, and the low-area end of the front sits just above the accuracy limit of 10 bits (10.4). That leaves little room for further area reduction.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.579e+04 (gain this round: +109.2%).
Feasible designs: 256 of 400 evaluations (231 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 30% violate; best seen 6.09e-08 (2^-23.97)
- sys_p99_latency_us <= 0.4: 11% violate; best seen 0.0639

Pareto front (feasible, 43 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=823, accuracy_bits=10.4, luts=688, ffs=135, throughput_msps=52.7, max_abs_err=0.000746 (2^-10.39), power_index=0.0619
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=2 rounding=round m=8] luts_plus_ffs=888, accuracy_bits=10.8, luts=734, ffs=153, throughput_msps=52.7, max_abs_err=0.000548 (2^-10.83), power_index=0.0668
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1036, accuracy_bits=12.4, luts=877, ffs=159, throughput_msps=56.8, max_abs_err=0.000191 (2^-12.36), power_index=0.0779
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=6] luts_plus_ffs=1197, accuracy_bits=13.2, luts=971, ffs=226, throughput_msps=65.4, max_abs_err=0.000108 (2^-13.18), power_index=0.09
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=3 rounding=round m=8] luts_plus_ffs=1329, accuracy_bits=14.4, luts=1152, ffs=178, throughput_msps=50.3, max_abs_err=4.61e-05 (2^-14.40), power_index=0.1
- pipelined_m [data_width=22 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=7] luts_plus_ffs=1648, accuracy_bits=15.9, luts=1367, ffs=281, throughput_msps=54.3, max_abs_err=1.67e-05 (2^-15.87), power_index=0.124
- pipelined_m [data_width=22 n_iter=20 angle_guard=1 frac_guard=3 rounding=round m=7] luts_plus_ffs=1916, accuracy_bits=17.8, luts=1633, ffs=282, throughput_msps=54.3, max_abs_err=4.49e-06 (2^-17.77), power_index=0.144
- pipelined_m [data_width=26 n_iter=21 angle_guard=2 frac_guard=3 rounding=round m=7] luts_plus_ffs=2329, accuracy_bits=19.9, luts=1999, ffs=330, throughput_msps=52, max_abs_err=1.04e-06 (2^-19.88), power_index=0.175
- pipelined_m [data_width=27 n_iter=23 angle_guard=1 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=2520, accuracy_bits=21.5, luts=2184, ffs=336, throughput_msps=45.9, max_abs_err=3.37e-07 (2^-21.50), power_index=0.19
- pipelined_m [data_width=28 n_iter=27 angle_guard=2 frac_guard=3 rounding=trunc m=3] luts_plus_ffs=3640, accuracy_bits=24, luts=2690, ffs=949, throughput_msps=106, max_abs_err=6.09e-08 (2^-23.97), power_index=0.274
Front coverage: luts_plus_ffs 823..3640 (HV reference 3000); accuracy_bits 10.4..24 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.5 MSPS; best accuracy 12.38 bits
- unrolled_k: 34 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 11.76 bits
- pipelined: 50 evals, 22 feasible; max throughput seen 282 MSPS; best accuracy 12.65 bits; best feasible luts_plus_ffs=1250; feasible ranges: data_width 14..18, n_iter 12..15, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 305 evals, 234 feasible; max throughput seen 178 MSPS; best accuracy 23.97 bits; best feasible luts_plus_ffs=823; feasible ranges: data_width 13..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 23024 in, 4528 out
- provider-reported cost: $0.0913
- full prompts and replies: `llm_trace.jsonl`

