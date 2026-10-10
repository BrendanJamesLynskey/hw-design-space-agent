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
`pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 638 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 135 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 68.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 68.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 58.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
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
| `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=6` | 0.1459 → 0.1953 | yes |
| `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=14,n_iter=12,angle_guard=3,frac_guard=2,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=15,n_iter=12,angle_guard=3,frac_guard=3,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=14,n_iter=12,angle_guard=4,frac_guard=3,rounding=round,m=6` | 0.1459 → 0.1953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (43 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=6` | 638 | 135 | 68.5 | 4 | 0.0581 | 0.000976 (2^-10.00) | 10.00 |
| 1 | `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=7` | 638 | 135 | 59.6 | 4 | 0.0581 | 0.000976 (2^-10.00) | 10.00 |
| 2 | `pipelined_m:data_width=14,n_iter=12,angle_guard=3,frac_guard=2,rounding=round,m=7` | 672 | 139 | 59.6 | 4 | 0.0611 | 0.000724 (2^-10.43) | 10.43 |
| 3 | `pipelined_m:data_width=15,n_iter=12,angle_guard=3,frac_guard=3,rounding=trunc,m=8` | 701 | 147 | 52.7 | 4 | 0.0638 | 0.000635 (2^-10.62) | 10.62 |
| 4 | `pipelined_m:data_width=14,n_iter=12,angle_guard=4,frac_guard=3,rounding=round,m=6` | 707 | 143 | 68.5 | 4 | 0.064 | 0.000629 (2^-10.63) | 10.63 |
| 5 | `pipelined_m:data_width=14,n_iter=13,angle_guard=3,frac_guard=2,rounding=round,m=7` | 730 | 139 | 59.6 | 4 | 0.0654 | 0.00049 (2^-10.99) | 10.99 |
| 6 | `pipelined_m:data_width=15,n_iter=13,angle_guard=3,frac_guard=3,rounding=trunc,m=8` | 764 | 147 | 52.7 | 4 | 0.0686 | 0.000439 (2^-11.15) | 11.15 |
| 7 | `pipelined_m:data_width=15,n_iter=13,angle_guard=3,frac_guard=3,rounding=trunc,m=7` | 764 | 147 | 59.6 | 4 | 0.0686 | 0.000439 (2^-11.15) | 11.15 |
| 8 | `pipelined_m:data_width=15,n_iter=13,angle_guard=3,frac_guard=2,rounding=round,m=7` | 770 | 147 | 59.6 | 4 | 0.069 | 0.000385 (2^-11.34) | 11.34 |
| 9 | `pipelined_m:data_width=15,n_iter=13,angle_guard=2,frac_guard=3,rounding=round,m=8` | 783 | 147 | 52.7 | 4 | 0.07 | 0.000358 (2^-11.45) | 11.45 |
| 10 | `pipelined_m:data_width=15,n_iter=13,angle_guard=3,frac_guard=3,rounding=round,m=8` | 796 | 149 | 52.7 | 4 | 0.0711 | 0.000332 (2^-11.56) | 11.56 |
| 11 | `pipelined_m:data_width=15,n_iter=14,angle_guard=2,frac_guard=3,rounding=round,m=8` | 845 | 147 | 52.7 | 4 | 0.0747 | 0.00029 (2^-11.75) | 11.75 |
| 12 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 841 | 153 | 50.3 | 4 | 0.0748 | 0.000264 (2^-11.89) | 11.89 |
| 13 | `pipelined_m:data_width=16,n_iter=14,angle_guard=4,frac_guard=1,rounding=round,m=7` | 861 | 155 | 56.8 | 4 | 0.0765 | 0.000203 (2^-12.26) | 12.26 |
| 14 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=2,rounding=round,m=8` | 875 | 155 | 50.3 | 4 | 0.0775 | 0.000189 (2^-12.37) | 12.37 |
| 15 | `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=3,rounding=trunc,m=7` | 950 | 172 | 56.8 | 4 | 0.0844 | 0.000145 (2^-12.75) | 12.75 |
| 16 | `pipelined_m:data_width=21,n_iter=14,angle_guard=-1,frac_guard=1,rounding=trunc,m=6` | 964 | 255 | 65.4 | 5 | 0.0917 | 0.000133 (2^-12.88) | 12.88 |
| 17 | `pipelined_m:data_width=24,n_iter=14,angle_guard=-2,frac_guard=1,rounding=trunc,m=8` | 1074 | 206 | 48.0 | 4 | 0.0963 | 0.000124 (2^-12.98) | 12.98 |
| 18 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=7` | 1055 | 233 | 56.8 | 5 | 0.0969 | 6.45e-05 (2^-13.92) | 13.92 |
| 19 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=5` | 1048 | 307 | 77.0 | 6 | 0.102 | 6.44e-05 (2^-13.92) | 13.92 |
| 20 | `pipelined_m:data_width=19,n_iter=17,angle_guard=3,frac_guard=1,rounding=trunc,m=6` | 1152 | 245 | 65.4 | 5 | 0.105 | 4.85e-05 (2^-14.33) | 14.33 |
| 21 | `pipelined_m:data_width=21,n_iter=16,angle_guard=-1,frac_guard=2,rounding=trunc,m=6` | 1143 | 259 | 62.5 | 5 | 0.106 | 4.68e-05 (2^-14.38) | 14.38 |
| 22 | `pipelined_m:data_width=21,n_iter=17,angle_guard=3,frac_guard=1,rounding=round,m=7` | 1297 | 269 | 54.3 | 5 | 0.118 | 1.95e-05 (2^-15.64) | 15.64 |
| 23 | `pipelined_m:data_width=24,n_iter=17,angle_guard=2,frac_guard=0,rounding=trunc,m=8` | 1354 | 294 | 48.0 | 5 | 0.124 | 1.65e-05 (2^-15.88) | 15.88 |
| 24 | `pipelined_m:data_width=23,n_iter=17,angle_guard=3,frac_guard=1,rounding=round,m=5` | 1403 | 373 | 73.7 | 6 | 0.134 | 1.61e-05 (2^-15.92) | 15.92 |
| 25 | `pipelined_m:data_width=26,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc,m=6` | 1472 | 317 | 59.9 | 5 | 0.135 | 1.54e-05 (2^-15.99) | 15.99 |
| 26 | `pipelined_m:data_width=21,n_iter=21,angle_guard=1,frac_guard=1,rounding=trunc,m=6` | 1523 | 335 | 65.4 | 6 | 0.14 | 1.38e-05 (2^-16.15) | 16.15 |
| 27 | `pipelined_m:data_width=24,n_iter=20,angle_guard=-2,frac_guard=1,rounding=round,m=8` | 1618 | 288 | 48.0 | 5 | 0.143 | 7.33e-06 (2^-17.06) | 17.06 |
| 28 | `pipelined_m:data_width=24,n_iter=21,angle_guard=-1,frac_guard=0,rounding=trunc,m=7` | 1628 | 285 | 54.3 | 5 | 0.144 | 4.38e-06 (2^-17.80) | 17.80 |
| 29 | `pipelined_m:data_width=24,n_iter=20,angle_guard=1,frac_guard=0,rounding=trunc,m=6` | 1587 | 371 | 62.5 | 6 | 0.147 | 3.91e-06 (2^-17.96) | 17.96 |
| 30 | `pipelined_m:data_width=24,n_iter=20,angle_guard=2,frac_guard=1,rounding=round,m=6` | 1698 | 383 | 62.5 | 6 | 0.157 | 2.59e-06 (2^-18.56) | 18.56 |
| 31 | `pipelined_m:data_width=26,n_iter=20,angle_guard=2,frac_guard=1,rounding=trunc,m=7` | 1767 | 320 | 52.0 | 5 | 0.157 | 2.13e-06 (2^-18.84) | 18.84 |
| 32 | `pipelined_m:data_width=22,n_iter=21,angle_guard=4,frac_guard=3,rounding=round,m=6` | 1780 | 375 | 62.5 | 6 | 0.162 | 1.9e-06 (2^-19.01) | 19.01 |
| 33 | `pipelined_m:data_width=23,n_iter=22,angle_guard=3,frac_guard=3,rounding=round,m=4` | 1913 | 557 | 89.6 | 8 | 0.186 | 1.1e-06 (2^-19.79) | 19.79 |
| 34 | `pipelined_m:data_width=28,n_iter=24,angle_guard=-1,frac_guard=1,rounding=trunc,m=8` | 2211 | 333 | 45.9 | 5 | 0.191 | 3.05e-07 (2^-21.64) | 21.64 |
| 35 | `pipelined_m:data_width=28,n_iter=24,angle_guard=-1,frac_guard=3,rounding=trunc,m=7` | 2308 | 438 | 49.9 | 6 | 0.207 | 3.04e-07 (2^-21.65) | 21.65 |
| 36 | `pipelined_m:data_width=26,n_iter=24,angle_guard=4,frac_guard=4,rounding=trunc,m=7` | 2332 | 436 | 52.0 | 6 | 0.208 | 2.02e-07 (2^-22.24) | 22.24 |
| 37 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=3,rounding=round,m=6` | 2365 | 438 | 59.9 | 6 | 0.211 | 1.7e-07 (2^-22.49) | 22.49 |
| 38 | `pipelined_m:data_width=28,n_iter=25,angle_guard=3,frac_guard=1,rounding=trunc,m=6` | 2408 | 539 | 57.5 | 7 | 0.222 | 1.3e-07 (2^-22.88) | 22.88 |
| 39 | `pipelined_m:data_width=27,n_iter=25,angle_guard=3,frac_guard=3,rounding=trunc,m=6` | 2433 | 538 | 59.9 | 7 | 0.224 | 1.19e-07 (2^-23.01) | 23.01 |
| 40 | `pipelined_m:data_width=28,n_iter=25,angle_guard=3,frac_guard=4,rounding=round,m=6` | 2619 | 565 | 57.5 | 7 | 0.24 | 7.42e-08 (2^-23.68) | 23.68 |
| 41 | `pipelined_m:data_width=26,n_iter=30,angle_guard=4,frac_guard=4,rounding=round,m=6` | 2994 | 536 | 59.9 | 7 | 0.266 | 6.94e-08 (2^-23.78) | 23.78 |
| 42 | `pipelined_m:data_width=27,n_iter=29,angle_guard=3,frac_guard=4,rounding=round,m=4` | 2954 | 847 | 82.7 | 10 | 0.286 | 4.54e-08 (2^-24.39) | 24.39 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *An error of at most 2^-10 needs roughly 12-13 bit output and about 10-13 iterations, so ranges are centred there, extending to 16 bits for the accuracy objective. The 8-request zero-gap burst with a 0.4 us p99 bound penalises designs that take many cycles per result. Throughput of 2 Msps is easy, so the bound is on burst latency, not average rate. I put most of the budget on pipelined_m and unrolled_k, which could be both small and fast enough. Pipelined is a baseline, and iterative gets a small probe. Later rounds can narrow ranges once the first results show which families are feasible.*)
- `pipelined_m` (34 evals): data_width=11..16, n_iter=9..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Accepts one request per cycle, so a burst of 8 drains quickly. Registering only every m stages should cut FFs compared with a full pipeline, which helps the LUTs+FFs objective.
- `unrolled_k` (33 evals): data_width=11..16, n_iter=9..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..8. *Why:* Smaller area than a full pipeline, and a larger k shortens the per-result cycle count. It may still meet the 0.4 us p99 burst bound at moderate k, so it could be the cheapest feasible design.
- `pipelined` (22 evals): data_width=11..16, n_iter=9..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* This is the safest family for burst latency and throughput. It serves as the feasibility baseline and covers the high-accuracy end of the front.
- `iterative` (11 evals): data_width=11..14, n_iter=9..14, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* This is the smallest design, but N+3 cycles per result means a burst of 8 probably queues past 0.4 us. A small probe will confirm whether it fails at L1.

**Result (code):** 100 evaluations this round, 100 total; 28 feasible; hypervolume 4876 (n/a).

**LLM decision:** `refine` — Only pipelined_m (6 front designs) and pipelined (best feasible 1380) are feasible. Iterative and unrolled_k have 0 feasible designs in 44 evals, with max throughput 17 and 14 MSPS. Their multi-cycle issue likely queues the 8-request bursts past the 0.4 us p99 bound, so I drop them. The accuracy constraint (2^-10) rejected 65% of designs. The feasible pipelined_m designs cluster at data_width 14..16, n_iter 12..14, and the front's cheapest point (848) already sits just above 10 bits. I'll refine around that region: lower widths and iteration counts to push area down toward the 10-bit edge, and widths up to 20 to extend the high-accuracy end of the front. A small pipelined share stays as a check against pipelined_m. Larger m is favoured, since all front points use m 7..8.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 4876 (gain this round: n/a (first round)).
Feasible designs: 28 of 100 evaluations (24 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 65% violate; best seen 0.000189 (2^-12.37)
- sys_p99_latency_us <= 0.4: 44% violate; best seen 0.0603

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=848, accuracy_bits=10.6, luts=701, ffs=147, throughput_msps=52.7, max_abs_err=0.000635 (2^-10.62), power_index=0.0638
- pipelined_m [data_width=15 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=911, accuracy_bits=11.2, luts=764, ffs=147, throughput_msps=52.7, max_abs_err=0.000439 (2^-11.15), power_index=0.0686
- pipelined_m [data_width=15 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=911, accuracy_bits=11.2, luts=764, ffs=147, throughput_msps=59.6, max_abs_err=0.000439 (2^-11.15), power_index=0.0686
- pipelined_m [data_width=15 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=945, accuracy_bits=11.4, luts=800, ffs=145, throughput_msps=59.6, max_abs_err=0.00038 (2^-11.36), power_index=0.0711
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=994, accuracy_bits=11.9, luts=841, ffs=153, throughput_msps=50.3, max_abs_err=0.000264 (2^-11.89), power_index=0.0748
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=round m=8] luts_plus_ffs=1030, accuracy_bits=12.4, luts=875, ffs=155, throughput_msps=50.3, max_abs_err=0.000189 (2^-12.37), power_index=0.0775
Front coverage: luts_plus_ffs 848..1030 (HV reference 3000); accuracy_bits 10.6..12.4 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.9 MSPS; best accuracy 9.11 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.65 bits
- pipelined: 22 evals, 9 feasible; max throughput seen 282 MSPS; best accuracy 10.96 bits; best feasible luts_plus_ffs=1380; feasible ranges: data_width 13..15, n_iter 13..16, angle_guard 0..2, frac_guard 0..3
- pipelined_m: 34 evals, 19 feasible; max throughput seen 178 MSPS; best accuracy 12.37 bits; best feasible luts_plus_ffs=848; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard -1..3, frac_guard 0..3, m 2..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined_m, the only family on the front, and widen data_width/n_iter slightly to cover both low-area and high-accuracy ends.*)
- `pipelined_m` (80 evals): data_width=12..19, n_iter=10..17, angle_guard=0..4, frac_guard=0..3, rounding=trunc|round, m=5..8. *Why:* All 6 front points are pipelined_m with m 7..8; probe lower area near the 10-bit limit and extend toward higher accuracy.
- `pipelined` (20 evals): data_width=13..17, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* It is feasible but its best area is 1380, far above pipelined_m; a small share confirms it stays dominated.

**Result (code):** 100 evaluations this round, 200 total; 104 feasible; hypervolume 7941 (+62.8%).

**LLM decision:** `refine` — The front is all pipelined_m, 19 designs spanning 773..1413 LUT+FF and 10..14.1 accuracy bits. iterative (0/11 feasible, max 16.9 MSPS, 9.11 bits) and unrolled_k (0/33 feasible, max 14 MSPS) never produced a feasible design, so I drop them. The selection rule picks the minimum-area design, which sits at the 10-bit corner (773, data_width 14, n_iter 12, m 6). That corner is probably not minimal yet, since no feasible design has data_width below 13, so I will search narrowly below it with larger m, which saves FFs. The last round still gained +62.8% HV, and the front stops at 14.1 bits against a 3000 area reference. I will therefore also push the high-accuracy end with wider data_width and more iterations. Plain pipelined is a minor contender (best feasible 1380 vs 773), so it keeps only a small share.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7941 (gain this round: +62.8%).
Feasible designs: 104 of 200 evaluations (94 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 44% violate; best seen 5.66e-05 (2^-14.11)
- sys_p99_latency_us <= 0.4: 22% violate; best seen 0.0603

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=773, accuracy_bits=10, luts=638, ffs=135, throughput_msps=68.5, max_abs_err=0.000976 (2^-10.00), power_index=0.0581
- pipelined_m [data_width=14 n_iter=12 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=812, accuracy_bits=10.4, luts=672, ffs=139, throughput_msps=59.6, max_abs_err=0.000724 (2^-10.43), power_index=0.0611
- pipelined_m [data_width=14 n_iter=12 angle_guard=4 frac_guard=3 rounding=round m=6] luts_plus_ffs=850, accuracy_bits=10.6, luts=707, ffs=143, throughput_msps=68.5, max_abs_err=0.000629 (2^-10.63), power_index=0.064
- pipelined_m [data_width=15 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=911, accuracy_bits=11.2, luts=764, ffs=147, throughput_msps=52.7, max_abs_err=0.000439 (2^-11.15), power_index=0.0686
- pipelined_m [data_width=15 n_iter=13 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=918, accuracy_bits=11.3, luts=770, ffs=147, throughput_msps=59.6, max_abs_err=0.000385 (2^-11.34), power_index=0.069
- pipelined_m [data_width=14 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=8] luts_plus_ffs=985, accuracy_bits=11.4, luts=846, ffs=139, throughput_msps=52.7, max_abs_err=0.000376 (2^-11.38), power_index=0.0741
- pipelined_m [data_width=16 n_iter=14 angle_guard=4 frac_guard=1 rounding=round m=7] luts_plus_ffs=1016, accuracy_bits=12.3, luts=861, ffs=155, throughput_msps=56.8, max_abs_err=0.000203 (2^-12.26), power_index=0.0765
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=1122, accuracy_bits=12.8, luts=950, ffs=172, throughput_msps=56.8, max_abs_err=0.000145 (2^-12.75), power_index=0.0844
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1288, accuracy_bits=13.9, luts=1055, ffs=233, throughput_msps=56.8, max_abs_err=6.45e-05 (2^-13.92), power_index=0.0969
- pipelined_m [data_width=19 n_iter=17 angle_guard=0 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=1413, accuracy_bits=14.1, luts=1169, ffs=244, throughput_msps=65.4, max_abs_err=5.66e-05 (2^-14.11), power_index=0.106
Front coverage: luts_plus_ffs 773..1413 (HV reference 3000); accuracy_bits 10..14.1 (HV reference 10); data_width on the front 14..19 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.9 MSPS; best accuracy 9.11 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.65 bits
- pipelined: 42 evals, 26 feasible; max throughput seen 282 MSPS; best accuracy 12.38 bits; best feasible luts_plus_ffs=1380; feasible ranges: data_width 13..17, n_iter 12..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 114 evals, 78 feasible; max throughput seen 178 MSPS; best accuracy 14.11 bits; best feasible luts_plus_ffs=773; feasible ranges: data_width 13..19, n_iter 12..17, angle_guard -1..4, frac_guard 0..3, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Spend most of the budget on the min-area corner and the high-accuracy extension of pipelined_m, the only family on the front, and keep a small probe of pipelined.*)
- `pipelined_m` (30 evals): data_width=11..15, n_iter=10..14, angle_guard=-1..4, frac_guard=0..3, rounding=round|trunc, m=5..8. *Why:* Look for a lower-area design at the 10-bit corner that the selection rule picks. Feasible designs reach data_width 13 and the smallest front points use round with m 6-7, so this range goes just below that.
- `pipelined` (10 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round. *Why:* Keep a minor probe of the unregistered-m baseline (best feasible 1380 vs 773) in case small widths close the gap.
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 40 evaluations this round, 240 total; 116 feasible; hypervolume 7952 (+0.1%).

**LLM decision:** `stop` — This is the final round. The last round added only +0.1% hypervolume (7952), well under the 0.01 eps, so the front has converged. The front has 20 feasible designs, all pipelined_m, spanning luts_plus_ffs 773..1413 and accuracy_bits 10..14.1. The cheapest feasible design (773 LUTs+FFs, 10.0 bits, 68.5 MSPS) sits right at the 2^-10 error limit, so little room remains to cut area. Iterative and unrolled_k are infeasible: 0 feasible in 44 evals, with max throughput of only 16.9 and 14 MSPS, and their bursts of 8 queue against the 0.4 us p99 bound. Pipelined is dominated by pipelined_m, whose best feasible area is 1380 vs 773. The selection rule (min luts_plus_ffs) picks the 773 design, which has margin on throughput and p99 latency (best seen 0.06 us), so it should survive L2 simulation.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7952 (gain this round: +0.1%).
Feasible designs: 116 of 240 evaluations (104 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 49% violate; best seen 5.66e-05 (2^-14.11)
- sys_p99_latency_us <= 0.4: 18% violate; best seen 0.0603

Pareto front (feasible, 20 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=773, accuracy_bits=10, luts=638, ffs=135, throughput_msps=68.5, max_abs_err=0.000976 (2^-10.00), power_index=0.0581
- pipelined_m [data_width=14 n_iter=12 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=812, accuracy_bits=10.4, luts=672, ffs=139, throughput_msps=59.6, max_abs_err=0.000724 (2^-10.43), power_index=0.0611
- pipelined_m [data_width=14 n_iter=12 angle_guard=4 frac_guard=3 rounding=round m=6] luts_plus_ffs=850, accuracy_bits=10.6, luts=707, ffs=143, throughput_msps=68.5, max_abs_err=0.000629 (2^-10.63), power_index=0.064
- pipelined_m [data_width=15 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=911, accuracy_bits=11.2, luts=764, ffs=147, throughput_msps=52.7, max_abs_err=0.000439 (2^-11.15), power_index=0.0686
- pipelined_m [data_width=15 n_iter=13 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=918, accuracy_bits=11.3, luts=770, ffs=147, throughput_msps=59.6, max_abs_err=0.000385 (2^-11.34), power_index=0.069
- pipelined_m [data_width=15 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=8] luts_plus_ffs=992, accuracy_bits=11.8, luts=845, ffs=147, throughput_msps=52.7, max_abs_err=0.00029 (2^-11.75), power_index=0.0747
- pipelined_m [data_width=16 n_iter=14 angle_guard=4 frac_guard=1 rounding=round m=7] luts_plus_ffs=1016, accuracy_bits=12.3, luts=861, ffs=155, throughput_msps=56.8, max_abs_err=0.000203 (2^-12.26), power_index=0.0765
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=1122, accuracy_bits=12.8, luts=950, ffs=172, throughput_msps=56.8, max_abs_err=0.000145 (2^-12.75), power_index=0.0844
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1288, accuracy_bits=13.9, luts=1055, ffs=233, throughput_msps=56.8, max_abs_err=6.45e-05 (2^-13.92), power_index=0.0969
- pipelined_m [data_width=19 n_iter=17 angle_guard=0 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=1413, accuracy_bits=14.1, luts=1169, ffs=244, throughput_msps=65.4, max_abs_err=5.66e-05 (2^-14.11), power_index=0.106
Front coverage: luts_plus_ffs 773..1413 (HV reference 3000); accuracy_bits 10..14.1 (HV reference 10); data_width on the front 14..19 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.9 MSPS; best accuracy 9.11 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.65 bits
- pipelined: 52 evals, 27 feasible; max throughput seen 282 MSPS; best accuracy 12.38 bits; best feasible luts_plus_ffs=1380; feasible ranges: data_width 13..17, n_iter 12..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 144 evals, 89 feasible; max throughput seen 178 MSPS; best accuracy 14.11 bits; best feasible luts_plus_ffs=773; feasible ranges: data_width 13..19, n_iter 12..17, angle_guard -1..4, frac_guard 0..3, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=13..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (20 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 262 feasible; hypervolume 1.524e+04 (+91.6%).

**No LLM call** (code's front-mapping round): This is the final round. The last round added only +0.1% hypervolume (7952), well under the 0.01 eps, so the front has converged. The front has 20 feasible designs, all pipelined_m, spanning luts_plus_ffs 773..1413 and accuracy_bits 10..14.1. The cheapest feasible design (773 LUTs+FFs, 10.0 bits, 68.5 MSPS) sits right at the 2^-10 error limit, so little room remains to cut area. Iterative and unrolled_k are infeasible: 0 feasible in 44 evals, with max throughput of only 16.9 and 14 MSPS, and their bursts of 8 queue against the 0.4 us p99 bound. Pipelined is dominated by pipelined_m, whose best feasible area is 1380 vs 773. The selection rule (min luts_plus_ffs) picks the 773 design, which has margin on throughput and p99 latency (best seen 0.06 us), so it should survive L2 simulation.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.524e+04 (gain this round: +91.6%).
Feasible designs: 262 of 400 evaluations (245 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 33% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_latency_us <= 0.4: 11% violate; best seen 0.0603

Pareto front (feasible, 43 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=773, accuracy_bits=10, luts=638, ffs=135, throughput_msps=68.5, max_abs_err=0.000976 (2^-10.00), power_index=0.0581
- pipelined_m [data_width=14 n_iter=13 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=869, accuracy_bits=11, luts=730, ffs=139, throughput_msps=59.6, max_abs_err=0.00049 (2^-10.99), power_index=0.0654
- pipelined_m [data_width=15 n_iter=13 angle_guard=2 frac_guard=3 rounding=round m=8] luts_plus_ffs=930, accuracy_bits=11.4, luts=783, ffs=147, throughput_msps=52.7, max_abs_err=0.000358 (2^-11.45), power_index=0.07
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=round m=8] luts_plus_ffs=1030, accuracy_bits=12.4, luts=875, ffs=155, throughput_msps=50.3, max_abs_err=0.000189 (2^-12.37), power_index=0.0775
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=5] luts_plus_ffs=1355, accuracy_bits=13.9, luts=1048, ffs=307, throughput_msps=77, max_abs_err=6.44e-05 (2^-13.92), power_index=0.102
- pipelined_m [data_width=24 n_iter=17 angle_guard=2 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1648, accuracy_bits=15.9, luts=1354, ffs=294, throughput_msps=48, max_abs_err=1.65e-05 (2^-15.88), power_index=0.124
- pipelined_m [data_width=24 n_iter=21 angle_guard=-1 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=1913, accuracy_bits=17.8, luts=1628, ffs=285, throughput_msps=54.3, max_abs_err=4.38e-06 (2^-17.80), power_index=0.144
- pipelined_m [data_width=23 n_iter=22 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=2469, accuracy_bits=19.8, luts=1913, ffs=557, throughput_msps=89.6, max_abs_err=1.1e-06 (2^-19.79), power_index=0.186
- pipelined_m [data_width=27 n_iter=24 angle_guard=2 frac_guard=3 rounding=round m=6] luts_plus_ffs=2802, accuracy_bits=22.5, luts=2365, ffs=438, throughput_msps=59.9, max_abs_err=1.7e-07 (2^-22.49), power_index=0.211
- pipelined_m [data_width=27 n_iter=29 angle_guard=3 frac_guard=4 rounding=round m=4] luts_plus_ffs=3801, accuracy_bits=24.4, luts=2954, ffs=847, throughput_msps=82.7, max_abs_err=4.54e-08 (2^-24.39), power_index=0.286
Front coverage: luts_plus_ffs 773..3801 (HV reference 3000); accuracy_bits 10..24.4 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 16.9 MSPS; best accuracy 9.11 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 14 MSPS; best accuracy 11.65 bits
- pipelined: 52 evals, 27 feasible; max throughput seen 282 MSPS; best accuracy 12.38 bits; best feasible luts_plus_ffs=1380; feasible ranges: data_width 13..17, n_iter 12..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 304 evals, 235 feasible; max throughput seen 178 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=773; feasible ranges: data_width 13..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 23011 in, 4799 out
- provider-reported cost: $0.0940
- full prompts and replies: `llm_trace.jsonl`

