# DSE run: bursty_offload

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
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
`pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=1,rounding=trunc,m=5` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 666 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 204 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 77 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 77 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 5 | exact: schedule |
| latency_ns | 65 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0654 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000813 (2^-10.26) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.66 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.00023 (2^-12.09) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.88 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.3 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 5 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.0 dBc, SNR 69.8 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=1,rounding=trunc,m=5` | 0.1429 → 0.183 | yes |
| `pipelined_m:data_width=14,n_iter=12,angle_guard=3,frac_guard=4,rounding=trunc,m=5` | 0.1365 → 0.172 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=2,rounding=trunc,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=3,rounding=trunc,m=7` | 0.1759 → 0.245 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=3,frac_guard=3,rounding=trunc,m=7` | 0.1759 → 0.245 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (33 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=12,angle_guard=4,frac_guard=1,rounding=trunc,m=5` | 666 | 204 | 77.0 | 5 | 0.0654 | 0.000813 (2^-10.26) | 10.26 |
| 1 | `pipelined_m:data_width=14,n_iter=12,angle_guard=3,frac_guard=4,rounding=trunc,m=5` | 689 | 202 | 80.6 | 5 | 0.067 | 0.000764 (2^-10.35) | 10.35 |
| 2 | `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=2,rounding=trunc,m=7` | 751 | 149 | 59.6 | 4 | 0.0678 | 0.000384 (2^-11.35) | 11.35 |
| 3 | `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=3,rounding=trunc,m=7` | 777 | 151 | 56.8 | 4 | 0.0698 | 0.00038 (2^-11.36) | 11.36 |
| 4 | `pipelined_m:data_width=16,n_iter=13,angle_guard=3,frac_guard=3,rounding=trunc,m=7` | 802 | 155 | 56.8 | 4 | 0.072 | 0.000331 (2^-11.56) | 11.56 |
| 5 | `pipelined_m:data_width=18,n_iter=13,angle_guard=1,frac_guard=3,rounding=round,m=8` | 890 | 169 | 50.3 | 4 | 0.0797 | 0.000272 (2^-11.84) | 11.84 |
| 6 | `pipelined_m:data_width=19,n_iter=13,angle_guard=1,frac_guard=2,rounding=round,m=8` | 905 | 176 | 50.3 | 4 | 0.0813 | 0.000258 (2^-11.92) | 11.92 |
| 7 | `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=0,rounding=round,m=8` | 920 | 165 | 50.3 | 4 | 0.0817 | 0.000132 (2^-12.89) | 12.89 |
| 8 | `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=5` | 920 | 227 | 77.0 | 5 | 0.0863 | 0.000109 (2^-13.17) | 13.17 |
| 9 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=4,rounding=round,m=8` | 1030 | 165 | 50.3 | 4 | 0.0899 | 9.56e-05 (2^-13.35) | 13.35 |
| 10 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=3,rounding=round,m=8` | 1032 | 169 | 50.3 | 4 | 0.0904 | 8.94e-05 (2^-13.45) | 13.45 |
| 11 | `pipelined_m:data_width=19,n_iter=15,angle_guard=4,frac_guard=0,rounding=round,m=6` | 994 | 244 | 62.5 | 5 | 0.0931 | 8.33e-05 (2^-13.55) | 13.55 |
| 12 | `pipelined_m:data_width=19,n_iter=15,angle_guard=3,frac_guard=3,rounding=trunc,m=8` | 1067 | 180 | 50.3 | 4 | 0.0938 | 7.13e-05 (2^-13.78) | 13.78 |
| 13 | `pipelined_m:data_width=19,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 1112 | 178 | 50.3 | 4 | 0.097 | 4.67e-05 (2^-14.39) | 14.39 |
| 14 | `pipelined_m:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=round,m=8` | 1134 | 174 | 50.3 | 4 | 0.0984 | 4.52e-05 (2^-14.43) | 14.43 |
| 15 | `pipelined_m:data_width=20,n_iter=16,angle_guard=3,frac_guard=1,rounding=trunc,m=8` | 1128 | 184 | 48.0 | 4 | 0.0986 | 4.27e-05 (2^-14.51) | 14.51 |
| 16 | `pipelined_m:data_width=19,n_iter=16,angle_guard=4,frac_guard=2,rounding=round,m=8` | 1168 | 182 | 48.0 | 4 | 0.101 | 3.9e-05 (2^-14.64) | 14.64 |
| 17 | `pipelined_m:data_width=19,n_iter=17,angle_guard=4,frac_guard=3,rounding=trunc,m=8` | 1236 | 256 | 48.0 | 5 | 0.112 | 2.82e-05 (2^-15.11) | 15.11 |
| 18 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=round,m=6` | 1301 | 255 | 65.4 | 5 | 0.117 | 1.89e-05 (2^-15.69) | 15.69 |
| 19 | `pipelined_m:data_width=19,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc,m=7` | 1371 | 253 | 56.8 | 5 | 0.122 | 1.86e-05 (2^-15.71) | 15.71 |
| 20 | `pipelined_m:data_width=22,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc,m=6` | 1367 | 275 | 62.5 | 5 | 0.124 | 1.15e-05 (2^-16.41) | 16.41 |
| 21 | `pipelined_m:data_width=22,n_iter=18,angle_guard=2,frac_guard=2,rounding=trunc,m=6` | 1403 | 279 | 62.5 | 5 | 0.127 | 1.01e-05 (2^-16.60) | 16.60 |
| 22 | `pipelined_m:data_width=24,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc,m=7` | 1456 | 295 | 54.3 | 5 | 0.132 | 8.44e-06 (2^-16.85) | 16.85 |
| 23 | `pipelined_m:data_width=26,n_iter=19,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 1674 | 320 | 45.9 | 5 | 0.15 | 3.98e-06 (2^-17.94) | 17.94 |
| 24 | `pipelined_m:data_width=26,n_iter=19,angle_guard=1,frac_guard=1,rounding=round,m=8` | 1710 | 319 | 45.9 | 5 | 0.153 | 3.98e-06 (2^-17.94) | 17.94 |
| 25 | `pipelined_m:data_width=24,n_iter=23,angle_guard=0,frac_guard=1,rounding=trunc,m=7` | 1860 | 373 | 54.3 | 6 | 0.168 | 2.44e-06 (2^-18.64) | 18.64 |
| 26 | `pipelined_m:data_width=26,n_iter=23,angle_guard=0,frac_guard=1,rounding=round,m=8` | 2054 | 316 | 45.9 | 5 | 0.178 | 7.43e-07 (2^-20.36) | 20.36 |
| 27 | `pipelined_m:data_width=26,n_iter=23,angle_guard=0,frac_guard=2,rounding=trunc,m=7` | 2045 | 408 | 52.0 | 6 | 0.185 | 7.26e-07 (2^-20.39) | 20.39 |
| 28 | `pipelined_m:data_width=27,n_iter=23,angle_guard=1,frac_guard=2,rounding=round,m=8` | 2195 | 334 | 45.9 | 5 | 0.19 | 3.2e-07 (2^-21.58) | 21.58 |
| 29 | `pipelined_m:data_width=27,n_iter=23,angle_guard=2,frac_guard=2,rounding=round,m=4` | 2218 | 621 | 86.0 | 8 | 0.214 | 2.94e-07 (2^-21.70) | 21.70 |
| 30 | `pipelined_m:data_width=28,n_iter=23,angle_guard=4,frac_guard=2,rounding=trunc,m=4` | 2277 | 652 | 82.7 | 8 | 0.22 | 2.7e-07 (2^-21.82) | 21.82 |
| 31 | `pipelined_m:data_width=28,n_iter=28,angle_guard=2,frac_guard=1,rounding=trunc,m=6` | 2680 | 534 | 59.9 | 7 | 0.242 | 1.02e-07 (2^-23.22) | 23.22 |
| 32 | `pipelined_m:data_width=28,n_iter=29,angle_guard=4,frac_guard=2,rounding=trunc,m=5` | 2897 | 652 | 67.8 | 8 | 0.267 | 6.03e-08 (2^-23.98) | 23.98 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraint is the bursty system p99 latency: 8 requests 0 ns apart must finish within 0.4 us, i.e. ~20 results/us during a burst. That rules out slow multi-cycle families and favours 1-result/cycle designs (pipelined, pipelined_m) and unrolled_k with large k; the plain throughput>=2 msps and 2^-10 accuracy constraints are easy and mainly set data_width>=~12 and n_iter>=~10. Since the objective is min luts_plus_ffs, I weight pipelined_m (fewer register banks) and unrolled_k (shared datapath) most, keep pipelined as the fast anchor, and give iterative a small share to check whether the low-area corner is feasible at all. Round 1 searches wide on data_width/n_iter/guards so later rounds can narrow onto the front.*)
- `pipelined_m` (40 evals): data_width=10..18, n_iter=8..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* 1 result/cycle gives huge margin on the bursty p99 latency (8 requests in ~8 cycles), while registering every m stages cuts the FF count versus a full pipeline; m trades Fmax/latency against area, which is exactly the min-luts_plus_ffs objective.
- `unrolled_k` (25 evals): data_width=10..18, n_iter=8..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* Shared datapath keeps FFs low (good for the area objective) and large k (6-8) gives ceil(N/k)+3 ~ 5 cycles/result, which can still drain an 8-request burst inside 0.4 us at realistic Fmax; k is the key area/latency knob.
- `pipelined` (25 evals): data_width=10..18, n_iter=8..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* The m=1 corner of the pipelined family: highest Fmax and shortest latency, so it anchors the fast/robust end of the front even if its FF count is larger than pipelined_m.
- `iterative` (10 evals): data_width=10..18, n_iter=8..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Smallest-area family, so worth probing the low-luts_plus_ffs corner, but N+3 cycles/result needs ~260 MHz to drain a burst in 0.4 us, so it is a long shot for the system constraint; small share only.

**Result (code):** 100 evaluations this round, 100 total; 26 feasible; hypervolume 5830 (n/a).

**LLM decision:** `refine` — Round 1 shows a clear picture: pipelined_m dominates the cheap end of the front (best luts_plus_ffs=947, 20/40 feasible) while pipelined covers the high-accuracy/high-throughput end (up to 13.26 bits, 292 MSPS). iterative and unrolled_k produced 0 feasible designs (max throughput 18 and 10.7 MSPS, below the 2 MSPS constraint only marginally but their p99 latency and area are poor), so they can be dropped. The front's accuracy range 11.3..13.3 bits is narrow relative to the 10-bit reference and the area range 947..2058 is far from the 3000 HV reference, so there is room to push both ends: cheaper pipelined_m designs (lower data_width/n_iter, higher m) and higher-accuracy pipelined designs. Refining around the observed feasible boxes should sharpen the front before a full map_front round.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5830 (gain this round: n/a (first round)).
Feasible designs: 26 of 100 evaluations (20 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 292
- max_abs_err <= 0.000976562: 62% violate; best seen 0.000102 (2^-13.26)
- sys_p99_latency_us <= 0.4: 35% violate; best seen 0.0583

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=947, accuracy_bits=11.3, luts=800, ffs=147, throughput_msps=59.6, max_abs_err=0.000391 (2^-11.32), power_index=0.0713
- pipelined_m [data_width=15 n_iter=14 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1098, accuracy_bits=11.9, luts=831, ffs=266, throughput_msps=97.8, max_abs_err=0.000263 (2^-11.89), power_index=0.0826
- pipelined_m [data_width=18 n_iter=14 angle_guard=4 frac_guard=2 rounding=round m=4] luts_plus_ffs=1287, accuracy_bits=12.8, luts=975, ffs=313, throughput_msps=93.6, max_abs_err=0.000136 (2^-12.85), power_index=0.0969
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] luts_plus_ffs=1972, accuracy_bits=12.9, luts=989, ffs=983, throughput_msps=273, max_abs_err=0.000128 (2^-12.94), power_index=0.148
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc] luts_plus_ffs=2058, accuracy_bits=13.3, luts=1017, ffs=1041, throughput_msps=264, max_abs_err=0.000102 (2^-13.26), power_index=0.155
Front coverage: luts_plus_ffs 947..2058 (HV reference 3000); accuracy_bits 11.3..13.3 (HV reference 10); data_width on the front 15..18 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 13.24 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 12.48 bits
- pipelined: 25 evals, 6 feasible; max throughput seen 292 MSPS; best accuracy 13.26 bits; best feasible luts_plus_ffs=1792; feasible ranges: data_width 15..17, n_iter 14..16, angle_guard 1..3, frac_guard 1..3
- pipelined_m: 40 evals, 20 feasible; max throughput seen 178 MSPS; best accuracy 12.85 bits; best feasible luts_plus_ffs=947; feasible ranges: data_width 14..18, n_iter 14..18, angle_guard 0..4, frac_guard 1..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus the remaining budget on the two families that produced all feasible designs, tightening around their observed feasible boxes while extending the accuracy end of pipelined and the cheap end of pipelined_m.*)
- `pipelined_m` (60 evals): data_width=13..19, n_iter=12..20, angle_guard=0..4, frac_guard=1..4, rounding=trunc|round, m=2..8. *Why:* Cheapest feasible designs live here (947 LUT+FF); widen m and data_width slightly to find cheaper and more accurate variants.
- `pipelined` (40 evals): data_width=15..20, n_iter=14..20, angle_guard=0..4, frac_guard=1..4, rounding=trunc|round. *Why:* Covers the high-accuracy end (13.26 bits, 292 MSPS); push data_width/n_iter up to extend accuracy_bits beyond 13.3.

**Result (code):** 100 evaluations this round, 200 total; 122 feasible; hypervolume 1.045e+04 (+79.2%).

**LLM decision:** `map_front` — The feasible front is entirely dominated by pipelined_m (15/15 designs), with pipelined only contributing the high-accuracy/high-area corner (2734 LUT+FF, 16 bits). The front spans luts_plus_ffs 901..2734 against an HV reference of 3000, and accuracy_bits 11.3..16 against a reference of 10 — so the accuracy axis is already well past its reference, but the area axis only reaches ~30% of the reference, meaning the low-area end of the curve is under-mapped. Feasible pipelined_m ranges observed (data_width 14..19, n_iter 12..20, angle_guard 0..4, frac_guard 1..4, m 2..8) are narrower than the registry, and the front's data_width only covers 16..20 of 8..28, so cheaper designs at lower data_width/n_iter are likely unexplored. With 200 evals left and a +79% HV gain this round, a code-driven NSGA-II coverage search over the full ranges of pipelined_m (and pipelined for the accuracy corner), seeded with the current front, is the best use of the remaining budget to fill the trade-off curve before selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.045e+04 (gain this round: +79.2%).
Feasible designs: 122 of 200 evaluations (107 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 292
- max_abs_err <= 0.000976562: 33% violate; best seen 1.51e-05 (2^-16.01)
- sys_p99_latency_us <= 0.4: 18% violate; best seen 0.0583

Pareto front (feasible, 15 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=901, accuracy_bits=11.3, luts=751, ffs=149, throughput_msps=59.6, max_abs_err=0.000384 (2^-11.35), power_index=0.0678
- pipelined_m [data_width=16 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=957, accuracy_bits=11.6, luts=802, ffs=155, throughput_msps=56.8, max_abs_err=0.000331 (2^-11.56), power_index=0.072
- pipelined_m [data_width=18 n_iter=13 angle_guard=1 frac_guard=3 rounding=round m=8] luts_plus_ffs=1060, accuracy_bits=11.8, luts=890, ffs=169, throughput_msps=50.3, max_abs_err=0.000272 (2^-11.84), power_index=0.0797
- pipelined_m [data_width=16 n_iter=15 angle_guard=4 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1107, accuracy_bits=12.7, luts=949, ffs=157, throughput_msps=50.3, max_abs_err=0.000147 (2^-12.73), power_index=0.0833
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=3 rounding=round m=8] luts_plus_ffs=1201, accuracy_bits=13.4, luts=1032, ffs=169, throughput_msps=50.3, max_abs_err=8.94e-05 (2^-13.45), power_index=0.0904
- pipelined_m [data_width=19 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1289, accuracy_bits=14.4, luts=1112, ffs=178, throughput_msps=50.3, max_abs_err=4.67e-05 (2^-14.39), power_index=0.097
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=1307, accuracy_bits=14.4, luts=1134, ffs=174, throughput_msps=50.3, max_abs_err=4.52e-05 (2^-14.43), power_index=0.0984
- pipelined_m [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1492, accuracy_bits=15.1, luts=1236, ffs=256, throughput_msps=48, max_abs_err=2.82e-05 (2^-15.11), power_index=0.112
- pipelined_m [data_width=19 n_iter=19 angle_guard=2 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=1602, accuracy_bits=15.4, luts=1352, ffs=250, throughput_msps=56.8, max_abs_err=2.28e-05 (2^-15.42), power_index=0.121
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=2734, accuracy_bits=16, luts=1375, ffs=1359, throughput_msps=264, max_abs_err=1.51e-05 (2^-16.01), power_index=0.206
Front coverage: luts_plus_ffs 901..2734 (HV reference 3000); accuracy_bits 11.3..16 (HV reference 10); data_width on the front 16..20 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 13.24 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 12.48 bits
- pipelined: 65 evals, 46 feasible; max throughput seen 292 MSPS; best accuracy 16.01 bits; best feasible luts_plus_ffs=1685; feasible ranges: data_width 15..20, n_iter 14..20, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 100 evals, 76 feasible; max throughput seen 178 MSPS; best accuracy 15.71 bits; best feasible luts_plus_ffs=901; feasible ranges: data_width 14..19, n_iter 12..20, angle_guard 0..4, frac_guard 1..4, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (35 evals): data_width=15..28, n_iter=11..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (14 front designs; box front_anchored)
- `pipelined` (5 evals): data_width=19..28, n_iter=17..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 159 feasible; hypervolume 1.465e+04 (+40.2%).

**LLM decision:** `refine` — The whole 23-design front is pipelined_m; iterative and unrolled_k are 0/10 and 0/25 feasible (the 8-request bursts pin sys_p99_latency, and only 1-result/cycle families drain them), and pipelined is Pareto-dominated by pipelined_m (its best feasible luts_plus_ffs is 1685 vs 901). So the only family worth spending the last round on is pipelined_m. Key evidence for direction: the front's leftmost/cheapest point is data_width=16, n_iter=13 at accuracy_bits=11.3 with 901 LUT+FF, yet the spec only needs accuracy_bits >= 10 (max_abs_err <= 2^-10). That ~1.3-bit of accuracy headroom at the minimum-area corner is exactly where cheaper designs (lower data_width, which sets the 2^-(W-2) output LSB, and lower n_iter) may still be feasible and would both extend the front leftwards and move the min-luts_plus_ffs selection. The other two constraints are loose by the numbers: throughput best seen 292 vs >=2 required, sys_p99 best 0.0583us vs <=0.4us required, so the practical trade is purely area vs accuracy near the 10-bit boundary. pipelined_m feasible range already includes n_iter 11 and data_width 14, so this region is reachable. The global front-mapping pass over the full ranges of the front's families is reserved for the end of the run and the front already spans luts_plus_ffs 901..3213 vs HV ref 3000 and 11.3..23.2 bits vs ref 10, so map_front would add little; the remaining gain is at the under-explored low-area corner, so refine there.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.465e+04 (gain this round: +40.2%).
Feasible designs: 159 of 240 evaluations (138 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 292
- max_abs_err <= 0.000976562: 29% violate; best seen 1.02e-07 (2^-23.22)
- sys_p99_latency_us <= 0.4: 15% violate; best seen 0.0583

Pareto front (feasible, 23 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=901, accuracy_bits=11.3, luts=751, ffs=149, throughput_msps=59.6, max_abs_err=0.000384 (2^-11.35), power_index=0.0678
- pipelined_m [data_width=16 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=957, accuracy_bits=11.6, luts=802, ffs=155, throughput_msps=56.8, max_abs_err=0.000331 (2^-11.56), power_index=0.072
- pipelined_m [data_width=16 n_iter=15 angle_guard=4 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1107, accuracy_bits=12.7, luts=949, ffs=157, throughput_msps=50.3, max_abs_err=0.000147 (2^-12.73), power_index=0.0833
- pipelined_m [data_width=19 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1247, accuracy_bits=13.8, luts=1067, ffs=180, throughput_msps=50.3, max_abs_err=7.13e-05 (2^-13.78), power_index=0.0938
- pipelined_m [data_width=19 n_iter=16 angle_guard=4 frac_guard=2 rounding=round m=8] luts_plus_ffs=1349, accuracy_bits=14.6, luts=1168, ffs=182, throughput_msps=48, max_abs_err=3.9e-05 (2^-14.64), power_index=0.101
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=1557, accuracy_bits=15.7, luts=1301, ffs=255, throughput_msps=65.4, max_abs_err=1.89e-05 (2^-15.69), power_index=0.117
- pipelined_m [data_width=22 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=1682, accuracy_bits=16.6, luts=1403, ffs=279, throughput_msps=62.5, max_abs_err=1.01e-05 (2^-16.60), power_index=0.127
- pipelined_m [data_width=26 n_iter=19 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1994, accuracy_bits=17.9, luts=1674, ffs=320, throughput_msps=45.9, max_abs_err=3.98e-06 (2^-17.94), power_index=0.15
- pipelined_m [data_width=26 n_iter=23 angle_guard=0 frac_guard=1 rounding=round m=8] luts_plus_ffs=2370, accuracy_bits=20.4, luts=2054, ffs=316, throughput_msps=45.9, max_abs_err=7.43e-07 (2^-20.36), power_index=0.178
- pipelined_m [data_width=28 n_iter=28 angle_guard=2 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=3213, accuracy_bits=23.2, luts=2680, ffs=534, throughput_msps=59.9, max_abs_err=1.02e-07 (2^-23.22), power_index=0.242
Front coverage: luts_plus_ffs 901..3213 (HV reference 3000); accuracy_bits 11.3..23.2 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 13.24 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 12.48 bits
- pipelined: 70 evals, 51 feasible; max throughput seen 292 MSPS; best accuracy 19.05 bits; best feasible luts_plus_ffs=1685; feasible ranges: data_width 15..26, n_iter 14..30, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 135 evals, 108 feasible; max throughput seen 178 MSPS; best accuracy 23.22 bits; best feasible luts_plus_ffs=901; feasible ranges: data_width 14..28, n_iter 11..29, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *See rationale field.*)
- `pipelined_m` (100 evals): data_width=12..19, n_iter=10..16, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Focus entirely on the cheap end of the only family on the front, to reach feasible designs with accuracy just above the 2^-10 constraint.

**Result (code):** 100 evaluations this round, 340 total; 227 feasible; hypervolume 1.471e+04 (+0.4%).

**LLM decision:** `stop` — Final round (4/4), 340/400 evals used, and the run is converged: HV 1.471e+04 with only +0.4% gain this round, so further search has diminishing returns. All four families have been explored (none left to add), so `add_family` is moot. The spec is NOT infeasible: 227 of 340 evaluations are feasible (202 unique), with 0% throughput violations (best 292 MSPS vs the 2 MSPS floor) and 10% sys_p99 violations against a best seen of 0.0583 us vs the 0.4 us bound — a wide margin, so the L1/L2 screening risk does not threaten the front. The 30% error violations are a selection pressure, not a barrier: the best design reaches 2^-23.22 error vs the 2^-10 requirement, and every design on the 27-point Pareto front is feasible and meets max_abs_err (cheapest front point 0.000813 <= 0.000976). The front spans luts_plus_ffs 870..3213 (HV ref 3000) and accuracy_bits 10.3..23.2 (HV ref 10), i.e. it covers both objectives from the cheapest to beyond the reference point, so the whole trade-off curve is already mapped. Under the spec's selection rule (min luts_plus_ffs) the pick is the pipelined_m design at data_width=15, n_iter=12, angle_guard=4, frac_guard=1, rounding=trunc, m=5 (luts_plus_ffs=870, luts=666, ffs=204, accuracy_bits=10.3, 77 MSPS, sys_p99 well inside bound). Stopping here rather than spending the last 60 evals on a front that is already covered.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.471e+04 (gain this round: +0.4%).
Feasible designs: 227 of 340 evaluations (202 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 292
- max_abs_err <= 0.000976562: 30% violate; best seen 1.02e-07 (2^-23.22)
- sys_p99_latency_us <= 0.4: 10% violate; best seen 0.0583

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=4 frac_guard=1 rounding=trunc m=5] luts_plus_ffs=870, accuracy_bits=10.3, luts=666, ffs=204, throughput_msps=77, max_abs_err=0.000813 (2^-10.26), power_index=0.0654
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=928, accuracy_bits=11.4, luts=777, ffs=151, throughput_msps=56.8, max_abs_err=0.00038 (2^-11.36), power_index=0.0698
- pipelined_m [data_width=19 n_iter=15 angle_guard=-1 frac_guard=0 rounding=round m=8] luts_plus_ffs=1085, accuracy_bits=12.9, luts=920, ffs=165, throughput_msps=50.3, max_abs_err=0.000132 (2^-12.89), power_index=0.0817
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=3 rounding=round m=8] luts_plus_ffs=1201, accuracy_bits=13.4, luts=1032, ffs=169, throughput_msps=50.3, max_abs_err=8.94e-05 (2^-13.45), power_index=0.0904
- pipelined_m [data_width=19 n_iter=16 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1289, accuracy_bits=14.4, luts=1112, ffs=178, throughput_msps=50.3, max_abs_err=4.67e-05 (2^-14.39), power_index=0.097
- pipelined_m [data_width=19 n_iter=16 angle_guard=4 frac_guard=2 rounding=round m=8] luts_plus_ffs=1349, accuracy_bits=14.6, luts=1168, ffs=182, throughput_msps=48, max_abs_err=3.9e-05 (2^-14.64), power_index=0.101
- pipelined_m [data_width=19 n_iter=19 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=1624, accuracy_bits=15.7, luts=1371, ffs=253, throughput_msps=56.8, max_abs_err=1.86e-05 (2^-15.71), power_index=0.122
- pipelined_m [data_width=24 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1751, accuracy_bits=16.9, luts=1456, ffs=295, throughput_msps=54.3, max_abs_err=8.44e-06 (2^-16.85), power_index=0.132
- pipelined_m [data_width=24 n_iter=23 angle_guard=0 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2233, accuracy_bits=18.6, luts=1860, ffs=373, throughput_msps=54.3, max_abs_err=2.44e-06 (2^-18.64), power_index=0.168
- pipelined_m [data_width=28 n_iter=28 angle_guard=2 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=3213, accuracy_bits=23.2, luts=2680, ffs=534, throughput_msps=59.9, max_abs_err=1.02e-07 (2^-23.22), power_index=0.242
Front coverage: luts_plus_ffs 870..3213 (HV reference 3000); accuracy_bits 10.3..23.2 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 13.24 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 12.48 bits
- pipelined: 70 evals, 51 feasible; max throughput seen 292 MSPS; best accuracy 19.05 bits; best feasible luts_plus_ffs=1685; feasible ranges: data_width 15..26, n_iter 14..30, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 235 evals, 176 feasible; max throughput seen 178 MSPS; best accuracy 23.22 bits; best feasible luts_plus_ffs=870; feasible ranges: data_width 13..28, n_iter 11..29, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=13..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (27 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 280 feasible; hypervolume 1.53e+04 (+4.0%).

**No LLM call** (code's front-mapping round): Final round (4/4), 340/400 evals used, and the run is converged: HV 1.471e+04 with only +0.4% gain this round, so further search has diminishing returns. All four families have been explored (none left to add), so `add_family` is moot. The spec is NOT infeasible: 227 of 340 evaluations are feasible (202 unique), with 0% throughput violations (best 292 MSPS vs the 2 MSPS floor) and 10% sys_p99 violations against a best seen of 0.0583 us vs the 0.4 us bound — a wide margin, so the L1/L2 screening risk does not threaten the front. The 30% error violations are a selection pressure, not a barrier: the best design reaches 2^-23.22 error vs the 2^-10 requirement, and every design on the 27-point Pareto front is feasible and meets max_abs_err (cheapest front point 0.000813 <= 0.000976). The front spans luts_plus_ffs 870..3213 (HV ref 3000) and accuracy_bits 10.3..23.2 (HV ref 10), i.e. it covers both objectives from the cheapest to beyond the reference point, so the whole trade-off curve is already mapped. Under the spec's selection rule (min luts_plus_ffs) the pick is the pipelined_m design at data_width=15, n_iter=12, angle_guard=4, frac_guard=1, rounding=trunc, m=5 (luts_plus_ffs=870, luts=666, ffs=204, accuracy_bits=10.3, 77 MSPS, sys_p99 well inside bound). Stopping here rather than spending the last 60 evals on a front that is already covered.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.53e+04 (gain this round: +4.0%).
Feasible designs: 280 of 400 evaluations (248 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 292
- max_abs_err <= 0.000976562: 27% violate; best seen 6.03e-08 (2^-23.98)
- sys_p99_latency_us <= 0.4: 9% violate; best seen 0.0583

Pareto front (feasible, 33 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=4 frac_guard=1 rounding=trunc m=5] luts_plus_ffs=870, accuracy_bits=10.3, luts=666, ffs=204, throughput_msps=77, max_abs_err=0.000813 (2^-10.26), power_index=0.0654
- pipelined_m [data_width=16 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=957, accuracy_bits=11.6, luts=802, ffs=155, throughput_msps=56.8, max_abs_err=0.000331 (2^-11.56), power_index=0.072
- pipelined_m [data_width=19 n_iter=15 angle_guard=-1 frac_guard=0 rounding=round m=8] luts_plus_ffs=1085, accuracy_bits=12.9, luts=920, ffs=165, throughput_msps=50.3, max_abs_err=0.000132 (2^-12.89), power_index=0.0817
- pipelined_m [data_width=19 n_iter=15 angle_guard=4 frac_guard=0 rounding=round m=6] luts_plus_ffs=1238, accuracy_bits=13.6, luts=994, ffs=244, throughput_msps=62.5, max_abs_err=8.33e-05 (2^-13.55), power_index=0.0931
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=1307, accuracy_bits=14.4, luts=1134, ffs=174, throughput_msps=50.3, max_abs_err=4.52e-05 (2^-14.43), power_index=0.0984
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=1557, accuracy_bits=15.7, luts=1301, ffs=255, throughput_msps=65.4, max_abs_err=1.89e-05 (2^-15.69), power_index=0.117
- pipelined_m [data_width=22 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=1682, accuracy_bits=16.6, luts=1403, ffs=279, throughput_msps=62.5, max_abs_err=1.01e-05 (2^-16.60), power_index=0.127
- pipelined_m [data_width=24 n_iter=23 angle_guard=0 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2233, accuracy_bits=18.6, luts=1860, ffs=373, throughput_msps=54.3, max_abs_err=2.44e-06 (2^-18.64), power_index=0.168
- pipelined_m [data_width=27 n_iter=23 angle_guard=1 frac_guard=2 rounding=round m=8] luts_plus_ffs=2529, accuracy_bits=21.6, luts=2195, ffs=334, throughput_msps=45.9, max_abs_err=3.2e-07 (2^-21.58), power_index=0.19
- pipelined_m [data_width=28 n_iter=29 angle_guard=4 frac_guard=2 rounding=trunc m=5] luts_plus_ffs=3549, accuracy_bits=24, luts=2897, ffs=652, throughput_msps=67.8, max_abs_err=6.03e-08 (2^-23.98), power_index=0.267
Front coverage: luts_plus_ffs 870..3549 (HV reference 3000); accuracy_bits 10.3..24 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 13.24 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 12.48 bits
- pipelined: 70 evals, 51 feasible; max throughput seen 292 MSPS; best accuracy 19.05 bits; best feasible luts_plus_ffs=1685; feasible ranges: data_width 15..26, n_iter 14..30, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 295 evals, 229 feasible; max throughput seen 178 MSPS; best accuracy 23.98 bits; best feasible luts_plus_ffs=870; feasible ranges: data_width 13..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 17890 in, 9726 out
- provider-reported cost: $0.0088
- full prompts and replies: `llm_trace.jsonl`

