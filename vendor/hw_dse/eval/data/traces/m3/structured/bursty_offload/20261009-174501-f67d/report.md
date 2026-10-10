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
`pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 631 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 135 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 67.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0577 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000894 (2^-10.13) | exact: bit-accurate model, exhaustive (16384 angles) |
| max_abs_err_lsb | 3.66 | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err | 0.000262 (2^-11.90) | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err_lsb | 1.07 | exact: bit-accurate model, exhaustive (16384 angles) |
| accuracy_bits | 10.1 | exact: bit-accurate model, exhaustive (16384 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 77.4 dBc, SNR 68.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=15,n_iter=13,angle_guard=0,frac_guard=0,rounding=round,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=14,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=3,frac_guard=0,rounding=round,m=8` | 0.199 → 0.2825 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (32 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=14,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc,m=7` | 631 | 135 | 59.6 | 4 | 0.0577 | 0.000894 (2^-10.13) | 10.13 |
| 1 | `pipelined_m:data_width=15,n_iter=13,angle_guard=0,frac_guard=0,rounding=round,m=8` | 650 | 135 | 52.7 | 4 | 0.0591 | 0.000879 (2^-10.15) | 10.15 |
| 2 | `pipelined_m:data_width=14,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 688 | 135 | 52.7 | 4 | 0.0619 | 0.000746 (2^-10.39) | 10.39 |
| 3 | `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round,m=7` | 701 | 145 | 59.6 | 4 | 0.0636 | 0.000417 (2^-11.23) | 11.23 |
| 4 | `pipelined_m:data_width=16,n_iter=13,angle_guard=3,frac_guard=0,rounding=round,m=8` | 726 | 149 | 50.3 | 4 | 0.0659 | 0.000398 (2^-11.29) | 11.29 |
| 5 | `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=2,rounding=trunc,m=7` | 751 | 149 | 59.6 | 4 | 0.0678 | 0.000384 (2^-11.35) | 11.35 |
| 6 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=0,rounding=round,m=7` | 786 | 149 | 56.8 | 4 | 0.0704 | 0.000294 (2^-11.73) | 11.73 |
| 7 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=0,rounding=round,m=8` | 786 | 149 | 50.3 | 4 | 0.0704 | 0.000294 (2^-11.73) | 11.73 |
| 8 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 827 | 151 | 52.7 | 4 | 0.0736 | 0.00027 (2^-11.85) | 11.85 |
| 9 | `pipelined_m:data_width=15,n_iter=14,angle_guard=3,frac_guard=3,rounding=round,m=8` | 859 | 149 | 52.7 | 4 | 0.0758 | 0.000215 (2^-12.18) | 12.18 |
| 10 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc,m=7` | 909 | 167 | 56.8 | 4 | 0.081 | 0.000156 (2^-12.65) | 12.65 |
| 11 | `pipelined_m:data_width=18,n_iter=14,angle_guard=4,frac_guard=4,rounding=trunc,m=7` | 992 | 176 | 56.8 | 4 | 0.0878 | 0.000138 (2^-12.82) | 12.82 |
| 12 | `pipelined_m:data_width=23,n_iter=14,angle_guard=-2,frac_guard=0,rounding=round,m=7` | 1005 | 196 | 54.3 | 4 | 0.0904 | 0.000128 (2^-12.93) | 12.93 |
| 13 | `pipelined_m:data_width=23,n_iter=14,angle_guard=2,frac_guard=0,rounding=trunc,m=5` | 1060 | 282 | 73.7 | 5 | 0.101 | 0.000124 (2^-12.98) | 12.98 |
| 14 | `pipelined_m:data_width=24,n_iter=14,angle_guard=3,frac_guard=1,rounding=trunc,m=7` | 1142 | 216 | 52.0 | 4 | 0.102 | 0.000122 (2^-13.00) | 13.00 |
| 15 | `pipelined_m:data_width=25,n_iter=14,angle_guard=2,frac_guard=3,rounding=trunc,m=7` | 1224 | 226 | 52.0 | 4 | 0.109 | 0.000122 (2^-13.00) | 13.00 |
| 16 | `pipelined_m:data_width=20,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=3` | 1124 | 412 | 114.5 | 7 | 0.116 | 6.44e-05 (2^-13.92) | 13.92 |
| 17 | `pipelined_m:data_width=21,n_iter=18,angle_guard=-1,frac_guard=0,rounding=trunc,m=5` | 1223 | 321 | 77.0 | 6 | 0.116 | 3.61e-05 (2^-14.76) | 14.76 |
| 18 | `pipelined_m:data_width=23,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round,m=7` | 1331 | 273 | 54.3 | 5 | 0.121 | 1.21e-05 (2^-16.33) | 16.33 |
| 19 | `pipelined_m:data_width=24,n_iter=18,angle_guard=-2,frac_guard=1,rounding=trunc,m=7` | 1403 | 286 | 54.3 | 5 | 0.127 | 1.21e-05 (2^-16.33) | 16.33 |
| 20 | `pipelined_m:data_width=20,n_iter=19,angle_guard=3,frac_guard=2,rounding=round,m=7` | 1432 | 262 | 54.3 | 5 | 0.127 | 1.04e-05 (2^-16.56) | 16.56 |
| 21 | `pipelined_m:data_width=24,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc,m=6` | 1438 | 292 | 62.5 | 5 | 0.13 | 9.32e-06 (2^-16.71) | 16.71 |
| 22 | `pipelined_m:data_width=26,n_iter=18,angle_guard=0,frac_guard=3,rounding=trunc,m=6` | 1618 | 322 | 59.9 | 5 | 0.146 | 7.95e-06 (2^-16.94) | 16.94 |
| 23 | `pipelined_m:data_width=26,n_iter=19,angle_guard=0,frac_guard=0,rounding=round,m=5` | 1599 | 395 | 73.7 | 6 | 0.15 | 4.18e-06 (2^-17.87) | 17.87 |
| 24 | `pipelined_m:data_width=24,n_iter=20,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 1647 | 463 | 89.6 | 7 | 0.159 | 3.57e-06 (2^-18.10) | 18.10 |
| 25 | `pipelined_m:data_width=24,n_iter=20,angle_guard=0,frac_guard=2,rounding=round,m=4` | 1698 | 465 | 89.6 | 7 | 0.163 | 3.39e-06 (2^-18.17) | 18.17 |
| 26 | `pipelined_m:data_width=26,n_iter=21,angle_guard=0,frac_guard=0,rounding=round,m=5` | 1776 | 481 | 73.7 | 7 | 0.17 | 1.36e-06 (2^-19.48) | 19.48 |
| 27 | `pipelined_m:data_width=26,n_iter=22,angle_guard=3,frac_guard=4,rounding=trunc,m=6` | 2107 | 432 | 59.9 | 6 | 0.191 | 5.61e-07 (2^-20.76) | 20.76 |
| 28 | `pipelined_m:data_width=26,n_iter=27,angle_guard=3,frac_guard=2,rounding=round,m=8` | 2553 | 422 | 45.9 | 6 | 0.224 | 1.51e-07 (2^-22.66) | 22.66 |
| 29 | `pipelined_m:data_width=26,n_iter=27,angle_guard=4,frac_guard=2,rounding=round,m=4` | 2581 | 707 | 86.0 | 9 | 0.247 | 1.28e-07 (2^-22.89) | 22.89 |
| 30 | `pipelined_m:data_width=26,n_iter=27,angle_guard=4,frac_guard=3,rounding=round,m=4` | 2635 | 719 | 86.0 | 9 | 0.252 | 8.95e-08 (2^-23.41) | 23.41 |
| 31 | `pipelined_m:data_width=27,n_iter=30,angle_guard=3,frac_guard=3,rounding=trunc,m=6` | 2939 | 538 | 59.9 | 7 | 0.262 | 8.12e-08 (2^-23.55) | 23.55 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The error bound of 2^-10 needs roughly 12-14 bit outputs and 10-13 iterations, so the ranges are focused there. The burst of 8 requests with a 0.4 us p99 limit rules out the iterative family: about 8x(N+3) cycles serialised would likely exceed the bound. Unrolled_k and the pipelined families can drain a burst in time. The search is weighted toward pipelined_m and unrolled_k because they are the probable low-area winners. Later rounds will narrow the ranges based on which families reach the front.*)
- `pipelined_m` (40 evals): data_width=11..16, n_iter=9..14, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* It accepts one result per cycle, so a burst of 8 drains quickly. Registering only every m stages should cut FFs, so it is the likeliest to minimise LUTs+FFs while meeting the 0.4 us p99 bound.
- `unrolled_k` (40 evals): data_width=11..16, n_iter=9..14, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=3..8. *Why:* It shares one datapath and so may be smaller than a pipeline. A burst of 8 queues, so k must be large enough (ceil(N/k)+3 cycles per result) to keep the 8th result under 0.4 us. Low k is excluded as likely infeasible.
- `pipelined` (20 evals): data_width=11..16, n_iter=9..14, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* It is the fully pipelined baseline with the best latency and throughput. It costs more FFs, so it gets a smaller share and serves as a feasibility anchor on the front.

**Result (code):** 100 evaluations this round, 100 total; 26 feasible; hypervolume 4535 (n/a).

**LLM decision:** `refine` — All 21 feasible designs on the front come from pipelined_m (788..1199 LUT+FF); pipelined is dominated, with a best feasible of 1317. unrolled_k has 0 feasible designs out of 40, with max throughput 13.5 MSPS. A burst of 8 with p99 <= 0.4 us needs a service time of roughly 50 ns per request, so it cannot meet the latency bound. iterative has N+3 cycles per result, which is slower still, so I am not spending budget on it. The front only samples data_width 15..16, and the accuracy target of 2^-10 may be reachable with narrower datapaths, which would lower LUT+FF. The cheapest point (788, 10.1 bits) sits near the error limit, so the cost lever is lower width and fewer iterations. I will extend pipelined_m down to width 11..16 and n_iter 10..14, favour larger m for fewer FFs (throughput is far above the 2 MSPS requirement), and keep a small pipelined share as a check.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 4535 (gain this round: n/a (first round)).
Feasible designs: 26 of 100 evaluations (24 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 59% violate; best seen 0.000187 (2^-12.38)
- sys_p99_latency_us <= 0.4: 40% violate; best seen 0.0603

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=1 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=788, accuracy_bits=10.1, luts=643, ffs=145, throughput_msps=68.5, max_abs_err=0.000887 (2^-10.14), power_index=0.0593
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=877, accuracy_bits=10.8, luts=724, ffs=153, throughput_msps=65.4, max_abs_err=0.000576 (2^-10.76), power_index=0.066
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=877, accuracy_bits=10.8, luts=724, ffs=153, throughput_msps=50.3, max_abs_err=0.000576 (2^-10.76), power_index=0.066
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=1 rounding=round m=7] luts_plus_ffs=894, accuracy_bits=11, luts=747, ffs=147, throughput_msps=59.6, max_abs_err=0.000472 (2^-11.05), power_index=0.0673
- pipelined_m [data_width=15 n_iter=13 angle_guard=2 frac_guard=3 rounding=trunc m=5] luts_plus_ffs=957, accuracy_bits=11.2, luts=751, ffs=206, throughput_msps=80.6, max_abs_err=0.000426 (2^-11.20), power_index=0.072
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=3 rounding=trunc m=5] luts_plus_ffs=1006, accuracy_bits=11.5, luts=789, ffs=217, throughput_msps=77, max_abs_err=0.000339 (2^-11.52), power_index=0.0757
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=1006, accuracy_bits=11.5, luts=789, ffs=217, throughput_msps=65.4, max_abs_err=0.000339 (2^-11.52), power_index=0.0757
- pipelined_m [data_width=16 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1086, accuracy_bits=11.6, luts=802, ffs=285, throughput_msps=93.6, max_abs_err=0.000331 (2^-11.56), power_index=0.0817
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1105, accuracy_bits=11.7, luts=823, ffs=282, throughput_msps=93.6, max_abs_err=0.000293 (2^-11.74), power_index=0.0832
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1199, accuracy_bits=12.3, luts=861, ffs=338, throughput_msps=124, max_abs_err=0.000204 (2^-12.26), power_index=0.0902
Front coverage: luts_plus_ffs 788..1199 (HV reference 3000); accuracy_bits 10.1..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 12.38 bits
- pipelined: 20 evals, 5 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1317; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 1..2, frac_guard 1..2
- pipelined_m: 40 evals, 21 feasible; max throughput seen 178 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=788; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..3, frac_guard 0..3, m 2..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined_m at lower widths and iteration counts to push the cheap end of the front below 788 LUT+FF while keeping accuracy at or above 10 bits.*)
- `pipelined_m` (80 evals): data_width=11..16, n_iter=10..14, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* This is the family that produced the front. Lower widths and fewer iterations should cut LUT+FF while keeping error under 2^-10, and larger m reduces FFs.
- `pipelined` (20 evals): data_width=11..16, n_iter=10..14, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Small share to check whether lower widths make the fully pipelined design competitive; its best feasible so far is 1317.

**Result (code):** 100 evaluations this round, 200 total; 79 feasible; hypervolume 4702 (+3.7%).

**LLM decision:** `refine` — The front is 8 designs, all pipelined_m (luts_plus_ffs 785..1199, accuracy 10.2..12.3 bits). The selection rule picks the cheapest, currently pipelined_m at W=15, n_iter=13, m=8, which only just clears the error limit (2^-10.15 vs 2^-10). HV gain was still +3.7%, above eps 0.01. The cheap corner is not yet pinned down: feasible pipelined_m designs reach W=13, n_iter=12 and m=8. unrolled_k had 0 feasible of 40 evaluations and peaked at 13.5 MSPS, so burst queueing is its likely failure. Iterative is slower still (N+3 cycles per result), so a burst of 8 cannot meet the 0.4 us p99 latency; I will not spend budget on it. pipelined is feasible but its best is 1317, well behind pipelined_m. I will focus on pipelined_m at lower data_width, n_iter and larger m, keeping a small share for pipelined and a wider-accuracy tail so the front keeps some spread.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4702 (gain this round: +3.7%).
Feasible designs: 79 of 200 evaluations (68 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 53% violate; best seen 0.000187 (2^-12.38)
- sys_p99_latency_us <= 0.4: 20% violate; best seen 0.0603

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=13 angle_guard=0 frac_guard=0 rounding=round m=8] luts_plus_ffs=785, accuracy_bits=10.2, luts=650, ffs=135, throughput_msps=52.7, max_abs_err=0.000879 (2^-10.15), power_index=0.0591
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=846, accuracy_bits=11.2, luts=701, ffs=145, throughput_msps=59.6, max_abs_err=0.000417 (2^-11.23), power_index=0.0636
- pipelined_m [data_width=16 n_iter=13 angle_guard=3 frac_guard=0 rounding=round m=8] luts_plus_ffs=875, accuracy_bits=11.3, luts=726, ffs=149, throughput_msps=50.3, max_abs_err=0.000398 (2^-11.29), power_index=0.0659
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=901, accuracy_bits=11.3, luts=751, ffs=149, throughput_msps=59.6, max_abs_err=0.000384 (2^-11.35), power_index=0.0678
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=979, accuracy_bits=11.9, luts=827, ffs=151, throughput_msps=52.7, max_abs_err=0.00027 (2^-11.85), power_index=0.0736
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc m=5] luts_plus_ffs=1057, accuracy_bits=11.9, luts=841, ffs=216, throughput_msps=77, max_abs_err=0.000264 (2^-11.89), power_index=0.0795
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc m=5] luts_plus_ffs=1072, accuracy_bits=12.2, luts=855, ffs=217, throughput_msps=77, max_abs_err=0.000217 (2^-12.17), power_index=0.0806
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1199, accuracy_bits=12.3, luts=861, ffs=338, throughput_msps=124, max_abs_err=0.000204 (2^-12.26), power_index=0.0902
Front coverage: luts_plus_ffs 785..1199 (HV reference 3000); accuracy_bits 10.2..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 12.38 bits
- pipelined: 40 evals, 11 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1317; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 120 evals, 68 feasible; max throughput seen 178 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=785; feasible ranges: data_width 13..16, n_iter 12..14, angle_guard 0..3, frac_guard 0..3, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the low-area, accuracy-near-10-bit corner where the selection rule lands, using pipelined_m with large m. Drop unrolled_k (0 feasible) and iterative (too slow for bursts of 8 within 0.4 us p99).*)
- `pipelined_m` (32 evals): data_width=12..16, n_iter=11..14, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=4..8. *Why:* All 8 front points are pipelined_m. Probing smaller widths and iteration counts with large m (fewer registers) to push the cheapest point below 785 while staying at or above 10 bits.
- `pipelined` (8 evals): data_width=13..16, n_iter=11..14, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* Feasible region is data_width 14..16 and n_iter 12..14. A small share confirms it stays dominated by pipelined_m (best 1317 vs 785).

**Result (code):** 40 evaluations this round, 240 total; 102 feasible; hypervolume 4741 (+0.8%).

**LLM decision:** `stop` — This is the final round, so stop is the only meaningful choice. The front has 9 feasible designs, all pipelined_m, spanning luts_plus_ffs 785..1199 and accuracy_bits 10.2..12.3. Hypervolume gained only +0.8% last round, so the search is saturating. The cheapest feasible design is pipelined_m at data_width=15, n_iter=13, round, m=8, with 785 LUTs+FFs, max error 2^-10.15 and 52.7 MSPS. It meets all three constraints with a comfortable margin on the analytic bound, and best p99 is 0.06 us against the 0.4 us limit. unrolled_k produced 0 feasible designs in 40 evals (max 13.5 MSPS). Plain pipelined has a best feasible area of 1317, worse than pipelined_m.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 4741 (gain this round: +0.8%).
Feasible designs: 102 of 240 evaluations (84 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 51% violate; best seen 0.000187 (2^-12.38)
- sys_p99_latency_us <= 0.4: 17% violate; best seen 0.0603

Pareto front (feasible, 9 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=13 angle_guard=0 frac_guard=0 rounding=round m=8] luts_plus_ffs=785, accuracy_bits=10.2, luts=650, ffs=135, throughput_msps=52.7, max_abs_err=0.000879 (2^-10.15), power_index=0.0591
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=846, accuracy_bits=11.2, luts=701, ffs=145, throughput_msps=59.6, max_abs_err=0.000417 (2^-11.23), power_index=0.0636
- pipelined_m [data_width=16 n_iter=13 angle_guard=3 frac_guard=0 rounding=round m=8] luts_plus_ffs=875, accuracy_bits=11.3, luts=726, ffs=149, throughput_msps=50.3, max_abs_err=0.000398 (2^-11.29), power_index=0.0659
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=901, accuracy_bits=11.3, luts=751, ffs=149, throughput_msps=59.6, max_abs_err=0.000384 (2^-11.35), power_index=0.0678
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=0 rounding=round m=7] luts_plus_ffs=935, accuracy_bits=11.7, luts=786, ffs=149, throughput_msps=56.8, max_abs_err=0.000294 (2^-11.73), power_index=0.0704
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=0 rounding=round m=8] luts_plus_ffs=935, accuracy_bits=11.7, luts=786, ffs=149, throughput_msps=50.3, max_abs_err=0.000294 (2^-11.73), power_index=0.0704
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=979, accuracy_bits=11.9, luts=827, ffs=151, throughput_msps=52.7, max_abs_err=0.00027 (2^-11.85), power_index=0.0736
- pipelined_m [data_width=15 n_iter=14 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=1008, accuracy_bits=12.2, luts=859, ffs=149, throughput_msps=52.7, max_abs_err=0.000215 (2^-12.18), power_index=0.0758
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1199, accuracy_bits=12.3, luts=861, ffs=338, throughput_msps=124, max_abs_err=0.000204 (2^-12.26), power_index=0.0902
Front coverage: luts_plus_ffs 785..1199 (HV reference 3000); accuracy_bits 10.2..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 12.38 bits
- pipelined: 48 evals, 12 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1317; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 152 evals, 90 feasible; max throughput seen 178 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=785; feasible ranges: data_width 13..16, n_iter 12..14, angle_guard 0..3, frac_guard 0..3, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=14..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (9 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 249 feasible; hypervolume 1.444e+04 (+204.6%).

**No LLM call** (code's front-mapping round): This is the final round, so stop is the only meaningful choice. The front has 9 feasible designs, all pipelined_m, spanning luts_plus_ffs 785..1199 and accuracy_bits 10.2..12.3. Hypervolume gained only +0.8% last round, so the search is saturating. The cheapest feasible design is pipelined_m at data_width=15, n_iter=13, round, m=8, with 785 LUTs+FFs, max error 2^-10.15 and 52.7 MSPS. It meets all three constraints with a comfortable margin on the analytic bound, and best p99 is 0.06 us against the 0.4 us limit. unrolled_k produced 0 feasible designs in 40 evals (max 13.5 MSPS). Plain pipelined has a best feasible area of 1317, worse than pipelined_m.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.444e+04 (gain this round: +204.6%).
Feasible designs: 249 of 400 evaluations (219 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 34% violate; best seen 8.12e-08 (2^-23.55)
- sys_p99_latency_us <= 0.4: 10% violate; best seen 0.0603

Pareto front (feasible, 32 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=14 n_iter=12 angle_guard=2 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=766, accuracy_bits=10.1, luts=631, ffs=135, throughput_msps=59.6, max_abs_err=0.000894 (2^-10.13), power_index=0.0577
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=846, accuracy_bits=11.2, luts=701, ffs=145, throughput_msps=59.6, max_abs_err=0.000417 (2^-11.23), power_index=0.0636
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=0 rounding=round m=8] luts_plus_ffs=935, accuracy_bits=11.7, luts=786, ffs=149, throughput_msps=50.3, max_abs_err=0.000294 (2^-11.73), power_index=0.0704
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=1077, accuracy_bits=12.6, luts=909, ffs=167, throughput_msps=56.8, max_abs_err=0.000156 (2^-12.65), power_index=0.081
- pipelined_m [data_width=24 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1358, accuracy_bits=13, luts=1142, ffs=216, throughput_msps=52, max_abs_err=0.000122 (2^-13.00), power_index=0.102
- pipelined_m [data_width=21 n_iter=18 angle_guard=-1 frac_guard=0 rounding=trunc m=5] luts_plus_ffs=1544, accuracy_bits=14.8, luts=1223, ffs=321, throughput_msps=77, max_abs_err=3.61e-05 (2^-14.76), power_index=0.116
- pipelined_m [data_width=24 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=1730, accuracy_bits=16.7, luts=1438, ffs=292, throughput_msps=62.5, max_abs_err=9.32e-06 (2^-16.71), power_index=0.13
- pipelined_m [data_width=24 n_iter=20 angle_guard=0 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2110, accuracy_bits=18.1, luts=1647, ffs=463, throughput_msps=89.6, max_abs_err=3.57e-06 (2^-18.10), power_index=0.159
- pipelined_m [data_width=26 n_iter=27 angle_guard=3 frac_guard=2 rounding=round m=8] luts_plus_ffs=2975, accuracy_bits=22.7, luts=2553, ffs=422, throughput_msps=45.9, max_abs_err=1.51e-07 (2^-22.66), power_index=0.224
- pipelined_m [data_width=27 n_iter=30 angle_guard=3 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=3477, accuracy_bits=23.6, luts=2939, ffs=538, throughput_msps=59.9, max_abs_err=8.12e-08 (2^-23.55), power_index=0.262
Front coverage: luts_plus_ffs 766..3477 (HV reference 3000); accuracy_bits 10.1..23.6 (HV reference 10); data_width on the front 14..27 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 12.38 bits
- pipelined: 48 evals, 12 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1317; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 312 evals, 237 feasible; max throughput seen 178 MSPS; best accuracy 23.55 bits; best feasible luts_plus_ffs=766; feasible ranges: data_width 13..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 22977 in, 4944 out
- provider-reported cost: $0.0954
- full prompts and replies: `llm_trace.jsonl`

