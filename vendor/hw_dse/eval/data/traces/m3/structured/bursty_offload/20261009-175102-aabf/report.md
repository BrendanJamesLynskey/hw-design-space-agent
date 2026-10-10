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
`pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 608 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 137 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 68.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 68.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 58.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0561 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000917 (2^-10.09) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 7.51 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000249 (2^-11.97) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 2.04 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.1 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.8 dBc, SNR 69.5 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=6` | 0.1459 → 0.1953 | yes |
| `pipelined_m:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=6` | 0.1459 → 0.1953 | yes |
| `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (46 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round,m=6` | 608 | 137 | 68.5 | 4 | 0.0561 | 0.000917 (2^-10.09) | 10.09 |
| 1 | `pipelined_m:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round,m=7` | 620 | 139 | 59.6 | 4 | 0.0571 | 0.000835 (2^-10.23) | 10.23 |
| 2 | `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=7` | 666 | 151 | 59.6 | 4 | 0.0615 | 0.000643 (2^-10.60) | 10.60 |
| 3 | `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=6` | 666 | 151 | 68.5 | 4 | 0.0615 | 0.000643 (2^-10.60) | 10.60 |
| 4 | `pipelined_m:data_width=17,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 666 | 151 | 52.7 | 4 | 0.0615 | 0.000643 (2^-10.60) | 10.60 |
| 5 | `pipelined_m:data_width=15,n_iter=12,angle_guard=2,frac_guard=3,rounding=round,m=7` | 721 | 147 | 59.6 | 4 | 0.0653 | 0.000602 (2^-10.70) | 10.70 |
| 6 | `pipelined_m:data_width=17,n_iter=12,angle_guard=4,frac_guard=0,rounding=round,m=8` | 712 | 159 | 50.3 | 4 | 0.0656 | 0.000556 (2^-10.81) | 10.81 |
| 7 | `pipelined_m:data_width=15,n_iter=13,angle_guard=1,frac_guard=2,rounding=round,m=8` | 745 | 143 | 52.7 | 4 | 0.0668 | 0.000478 (2^-11.03) | 11.03 |
| 8 | `pipelined_m:data_width=17,n_iter=13,angle_guard=-1,frac_guard=0,rounding=trunc,m=5` | 713 | 207 | 80.6 | 5 | 0.0692 | 0.000468 (2^-11.06) | 11.06 |
| 9 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=5` | 759 | 202 | 80.6 | 5 | 0.0723 | 0.000342 (2^-11.51) | 11.51 |
| 10 | `pipelined_m:data_width=18,n_iter=14,angle_guard=-1,frac_guard=0,rounding=trunc,m=8` | 813 | 157 | 52.7 | 4 | 0.073 | 0.000265 (2^-11.88) | 11.88 |
| 11 | `pipelined_m:data_width=19,n_iter=14,angle_guard=-1,frac_guard=0,rounding=trunc,m=8` | 855 | 165 | 50.3 | 4 | 0.0767 | 0.000193 (2^-12.34) | 12.34 |
| 12 | `pipelined_m:data_width=19,n_iter=14,angle_guard=4,frac_guard=1,rounding=trunc,m=7` | 950 | 178 | 54.3 | 4 | 0.0849 | 0.000143 (2^-12.77) | 12.77 |
| 13 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=3,rounding=round,m=8` | 975 | 172 | 50.3 | 4 | 0.0862 | 0.000142 (2^-12.79) | 12.79 |
| 14 | `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=2,rounding=trunc,m=8` | 979 | 169 | 50.3 | 4 | 0.0864 | 0.000127 (2^-12.94) | 12.94 |
| 15 | `pipelined_m:data_width=18,n_iter=15,angle_guard=0,frac_guard=2,rounding=round,m=8` | 987 | 165 | 50.3 | 4 | 0.0867 | 0.000123 (2^-12.99) | 12.99 |
| 16 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=0,rounding=trunc,m=8` | 1001 | 167 | 50.3 | 4 | 0.0879 | 9.61e-05 (2^-13.35) | 13.35 |
| 17 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=round,m=8` | 1002 | 167 | 50.3 | 4 | 0.088 | 9.56e-05 (2^-13.35) | 13.35 |
| 18 | `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=2,rounding=round,m=8` | 1017 | 169 | 50.3 | 4 | 0.0893 | 8.26e-05 (2^-13.56) | 13.56 |
| 19 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc,m=8` | 1033 | 169 | 50.3 | 4 | 0.0904 | 7.43e-05 (2^-13.72) | 13.72 |
| 20 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=2,rounding=trunc,m=8` | 1064 | 172 | 50.3 | 4 | 0.093 | 6.89e-05 (2^-13.83) | 13.83 |
| 21 | `pipelined_m:data_width=20,n_iter=16,angle_guard=-1,frac_guard=1,rounding=trunc,m=8` | 1064 | 176 | 50.3 | 4 | 0.0933 | 6.62e-05 (2^-13.88) | 13.88 |
| 22 | `pipelined_m:data_width=17,n_iter=16,angle_guard=3,frac_guard=3,rounding=round,m=8` | 1084 | 165 | 50.3 | 4 | 0.094 | 6.42e-05 (2^-13.93) | 13.93 |
| 23 | `pipelined_m:data_width=19,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 1112 | 178 | 50.3 | 4 | 0.097 | 4.67e-05 (2^-14.39) | 14.39 |
| 24 | `pipelined_m:data_width=20,n_iter=17,angle_guard=0,frac_guard=1,rounding=trunc,m=6` | 1152 | 247 | 65.4 | 5 | 0.105 | 4.37e-05 (2^-14.48) | 14.48 |
| 25 | `pipelined_m:data_width=19,n_iter=16,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1152 | 323 | 93.6 | 6 | 0.111 | 4.29e-05 (2^-14.51) | 14.51 |
| 26 | `pipelined_m:data_width=19,n_iter=16,angle_guard=3,frac_guard=3,rounding=round,m=5` | 1183 | 329 | 77.0 | 6 | 0.114 | 3.8e-05 (2^-14.68) | 14.68 |
| 27 | `pipelined_m:data_width=21,n_iter=17,angle_guard=3,frac_guard=0,rounding=round,m=4` | 1219 | 411 | 89.6 | 7 | 0.123 | 2.15e-05 (2^-15.50) | 15.50 |
| 28 | `pipelined_m:data_width=23,n_iter=17,angle_guard=-1,frac_guard=3,rounding=round,m=6` | 1403 | 288 | 62.5 | 5 | 0.127 | 1.98e-05 (2^-15.63) | 15.63 |
| 29 | `pipelined_m:data_width=25,n_iter=17,angle_guard=0,frac_guard=1,rounding=trunc,m=8` | 1405 | 303 | 48.0 | 5 | 0.128 | 1.58e-05 (2^-15.95) | 15.95 |
| 30 | `pipelined_m:data_width=21,n_iter=20,angle_guard=4,frac_guard=0,rounding=round,m=7` | 1467 | 266 | 54.3 | 5 | 0.13 | 1.15e-05 (2^-16.41) | 16.41 |
| 31 | `pipelined_m:data_width=21,n_iter=18,angle_guard=4,frac_guard=4,rounding=trunc,m=8` | 1456 | 282 | 48.0 | 5 | 0.131 | 1.01e-05 (2^-16.60) | 16.60 |
| 32 | `pipelined_m:data_width=25,n_iter=18,angle_guard=1,frac_guard=0,rounding=trunc,m=8` | 1474 | 302 | 48.0 | 5 | 0.134 | 8.31e-06 (2^-16.88) | 16.88 |
| 33 | `pipelined_m:data_width=21,n_iter=20,angle_guard=3,frac_guard=2,rounding=round,m=5` | 1571 | 351 | 73.7 | 6 | 0.145 | 5.13e-06 (2^-17.57) | 17.57 |
| 34 | `pipelined_m:data_width=23,n_iter=19,angle_guard=3,frac_guard=3,rounding=round,m=5` | 1647 | 385 | 73.7 | 6 | 0.153 | 4.31e-06 (2^-17.82) | 17.82 |
| 35 | `pipelined_m:data_width=26,n_iter=19,angle_guard=0,frac_guard=3,rounding=trunc,m=8` | 1712 | 322 | 45.9 | 5 | 0.153 | 4.21e-06 (2^-17.86) | 17.86 |
| 36 | `pipelined_m:data_width=25,n_iter=22,angle_guard=1,frac_guard=0,rounding=round,m=6` | 1820 | 385 | 62.5 | 6 | 0.166 | 1.41e-06 (2^-19.44) | 19.44 |
| 37 | `pipelined_m:data_width=24,n_iter=22,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1864 | 559 | 89.6 | 8 | 0.182 | 1.38e-06 (2^-19.47) | 19.47 |
| 38 | `pipelined_m:data_width=25,n_iter=24,angle_guard=0,frac_guard=2,rounding=trunc,m=5` | 2065 | 480 | 70.6 | 7 | 0.192 | 9.91e-07 (2^-19.94) | 19.94 |
| 39 | `pipelined_m:data_width=25,n_iter=24,angle_guard=4,frac_guard=2,rounding=trunc,m=7` | 2162 | 410 | 52.0 | 6 | 0.193 | 4.61e-07 (2^-21.05) | 21.05 |
| 40 | `pipelined_m:data_width=28,n_iter=24,angle_guard=4,frac_guard=0,rounding=round,m=8` | 2283 | 344 | 44.0 | 5 | 0.198 | 1.86e-07 (2^-22.36) | 22.36 |
| 41 | `pipelined_m:data_width=28,n_iter=24,angle_guard=1,frac_guard=3,rounding=round,m=5` | 2415 | 547 | 67.8 | 7 | 0.223 | 1.64e-07 (2^-22.54) | 22.54 |
| 42 | `pipelined_m:data_width=27,n_iter=27,angle_guard=4,frac_guard=1,rounding=round,m=8` | 2610 | 434 | 44.0 | 6 | 0.229 | 1.18e-07 (2^-23.02) | 23.02 |
| 43 | `pipelined_m:data_width=27,n_iter=28,angle_guard=4,frac_guard=3,rounding=trunc,m=8` | 2765 | 444 | 44.0 | 6 | 0.241 | 7.43e-08 (2^-23.68) | 23.68 |
| 44 | `pipelined_m:data_width=28,n_iter=28,angle_guard=4,frac_guard=3,rounding=trunc,m=8` | 2850 | 458 | 44.0 | 6 | 0.249 | 3.8e-08 (2^-24.65) | 24.65 |
| 45 | `pipelined_m:data_width=28,n_iter=27,angle_guard=4,frac_guard=4,rounding=round,m=7` | 2859 | 466 | 49.9 | 6 | 0.25 | 2.77e-08 (2^-25.10) | 25.10 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Accuracy needs accuracy_bits >= 10, i.e. max_abs_err <= 2^-10, so data_width must be at least ~12-13 with enough n_iter; I search W 11..16, N 8..18 and small guard ranges to cover the accuracy-feasible band without wasting budget on hopelessly coarse designs. The binding system constraint is the bursty p99 latency of 0.4 us: a burst of 8 requests must be drained in ~400 ns, which needs on the order of 20 results/us, so throughput-per-cycle matters more than raw Fmax. That makes unrolled_k (ceil(N/k)+3 cycles/result) the primary candidate and iterative the risky cheap corner, while pipelined_m covers the 1-result/cycle extreme. I omit the plain `pipelined` family because it is dominated by pipelined_m at m=2 (same 1 result/cycle, strictly more registers), so its budget is better spent on the other three. Round 1 is deliberately broad across families; later rounds will narrow W/N/k around whatever feasible front appears and spend the reserved budget mapping it over full ranges.*)
- `iterative` (23 evals): data_width=11..16, n_iter=8..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Smallest area family, so it is the natural anchor for the min-LUTs+FFs objective; but at N+3 cycles/result it can only drain an 8-request burst inside 0.4 us if N is small and Fmax high, so I want its front mapped to see how far the cheap corner reaches.
- `unrolled_k` (55 evals): data_width=11..16, n_iter=10..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..8. *Why:* The burst constraint (8 requests, p99 <= 0.4 us) needs roughly 20+ results/us, which iterative likely cannot reach; unrolled_k buys that throughput with k while keeping N large enough for 10-bit accuracy, so it is the most likely feasible-and-cheap region and gets the largest share.
- `pipelined_m` (22 evals): data_width=11..16, n_iter=10..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Guarantees 1 result/cycle so the burst latency bound is trivially met; it is the expensive end of the area trade-off, so a small share is enough to establish whether any low-N/low-W variant is competitive on LUTs+FFs.

**Result (code):** 100 evaluations this round, 100 total; 12 feasible; hypervolume 5299 (n/a).

**LLM decision:** `map_front` — Feasibility is gated entirely by sys_p99_latency_us <= 0.4: iterative (max 18.5 MSPS) and unrolled_k (max 12 MSPS) emit one result every several cycles and cannot drain an 8-request burst inside 0.4 us, so 0 of 78 of their evals are feasible; only the 1-result/cycle pipelined_m family passes, and with huge margin (best sys_p99 0.076 us vs the 0.4 us limit). The feasible front is therefore tiny: 3 designs, all data_width=16, spanning luts_plus_ffs 960..1327 (HV ref 3000) and accuracy_bits 11.5..12.8 (HV ref 10). data_width on the front is 16..16 against a registry range of 8..28, i.e. the front covers only a sliver of both objective ranges - exactly the map_front trigger. pipelined is the only unexplored family, but structurally it is pipelined_m with m=1 (a register after every micro-rotation): same datapath LUTs, strictly more FFs, and its only edge (shorter latency / higher Fmax) is not an objective here since throughput >= 2 is already met with ~40x margin - it is dominated by pipelined_m and would buy no front points. So spend this round mapping the front over the full pipelined_m ranges, seeded with the current front, to extend it toward cheaper (data_width 15) and more accurate (data_width 17+) designs.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5299 (gain this round: n/a (first round)).
Feasible designs: 12 of 100 evaluations (11 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 178
- max_abs_err <= 0.000976562: 60% violate; best seen 0.000138 (2^-12.83)
- sys_p99_latency_us <= 0.4: 78% violate; best seen 0.076

Pareto front (feasible, 3 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=5] luts_plus_ffs=960, accuracy_bits=11.5, luts=759, ffs=202, throughput_msps=80.6, max_abs_err=0.000342 (2^-11.51), power_index=0.0723
- pipelined_m [data_width=16 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1269, accuracy_bits=11.8, luts=949, ffs=320, throughput_msps=97.8, max_abs_err=0.000285 (2^-11.78), power_index=0.0955
- pipelined_m [data_width=16 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=5] luts_plus_ffs=1327, accuracy_bits=12.8, luts=1051, ffs=276, throughput_msps=80.6, max_abs_err=0.000138 (2^-12.83), power_index=0.0998
Front coverage: luts_plus_ffs 960..1327 (HV reference 3000); accuracy_bits 11.5..12.8 (HV reference 10); data_width on the front 16..16 (registry 8..28).

Per family:
- iterative: 23 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 11.85 bits
- unrolled_k: 55 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 11.70 bits
- pipelined_m: 22 evals, 12 feasible; max throughput seen 178 MSPS; best accuracy 12.83 bits; best feasible luts_plus_ffs=960; feasible ranges: data_width 15..16, n_iter 14..17, angle_guard -1..2, frac_guard 0..2, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (3 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 110 feasible; hypervolume 1.455e+04 (+174.6%).

**LLM decision:** `refine` — Only pipelined_m is feasible (110/110 feasible designs); iterative and unrolled_k are 0-feasible because their multi-cycle-per-result schedule cannot meet sys_p99_latency_us<=0.4 on 8-request bursts, and pipelined is just the m=1 special case of pipelined_m, so it adds no new region. The front already spans both HV references (luts_plus_ffs 759..3308 vs ref 3000; accuracy_bits 10.2..24.6 vs ref 10), so map_front is not indicated. The selection rule is min luts_plus_ffs and the cheapest feasible point (759, accuracy 10.2 bits) sits right at the 2^-10 error floor, so the highest-value remaining work is to search the low-area corner for a cheaper feasible design while keeping the accuracy floor satisfied.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.455e+04 (gain this round: +174.6%).
Feasible designs: 110 of 200 evaluations (100 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 178
- max_abs_err <= 0.000976562: 31% violate; best seen 3.8e-08 (2^-24.65)
- sys_p99_latency_us <= 0.4: 39% violate; best seen 0.076

Pareto front (feasible, 24 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round m=7] luts_plus_ffs=759, accuracy_bits=10.2, luts=620, ffs=139, throughput_msps=59.6, max_abs_err=0.000835 (2^-10.23), power_index=0.0571
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=5] luts_plus_ffs=960, accuracy_bits=11.5, luts=759, ffs=202, throughput_msps=80.6, max_abs_err=0.000342 (2^-11.51), power_index=0.0723
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=8] luts_plus_ffs=1146, accuracy_bits=12.8, luts=975, ffs=172, throughput_msps=50.3, max_abs_err=0.000142 (2^-12.79), power_index=0.0862
- pipelined_m [data_width=24 n_iter=14 angle_guard=4 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1344, accuracy_bits=13, luts=1129, ffs=216, throughput_msps=45.9, max_abs_err=0.000123 (2^-12.99), power_index=0.101
- pipelined_m [data_width=21 n_iter=17 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1630, accuracy_bits=15.5, luts=1219, ffs=411, throughput_msps=89.6, max_abs_err=2.15e-05 (2^-15.50), power_index=0.123
- pipelined_m [data_width=27 n_iter=17 angle_guard=-1 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1773, accuracy_bits=16, luts=1455, ffs=318, throughput_msps=59.9, max_abs_err=1.55e-05 (2^-15.98), power_index=0.133
- pipelined_m [data_width=23 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=5] luts_plus_ffs=2032, accuracy_bits=17.8, luts=1647, ffs=385, throughput_msps=73.7, max_abs_err=4.31e-06 (2^-17.82), power_index=0.153
- pipelined_m [data_width=27 n_iter=22 angle_guard=-2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=2624, accuracy_bits=19.6, luts=2019, ffs=605, throughput_msps=86, max_abs_err=1.24e-06 (2^-19.62), power_index=0.197
- pipelined_m [data_width=28 n_iter=24 angle_guard=1 frac_guard=3 rounding=round m=5] luts_plus_ffs=2962, accuracy_bits=22.5, luts=2415, ffs=547, throughput_msps=67.8, max_abs_err=1.64e-07 (2^-22.54), power_index=0.223
- pipelined_m [data_width=28 n_iter=28 angle_guard=4 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=3308, accuracy_bits=24.6, luts=2850, ffs=458, throughput_msps=44, max_abs_err=3.8e-08 (2^-24.65), power_index=0.249
Front coverage: luts_plus_ffs 759..3308 (HV reference 3000); accuracy_bits 10.2..24.6 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 23 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 11.85 bits
- unrolled_k: 55 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 11.70 bits
- pipelined_m: 122 evals, 110 feasible; max throughput seen 178 MSPS; best accuracy 24.65 bits; best feasible luts_plus_ffs=759; feasible ranges: data_width 15..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focus 70% of the round on the low-area corner where the selection rule lives, 30% on extending the accuracy tail.*)
- `pipelined_m` (100 evals): data_width=15..19, n_iter=12..18, angle_guard=-1..4, frac_guard=0..3, rounding=round|trunc, m=4..8. *Why:* cheapest feasible region; selection rule is min luts_plus_ffs and 759 is near the 2^-10 accuracy floor
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 100 evaluations this round, 300 total; 209 feasible; hypervolume 1.501e+04 (+3.1%).

**LLM decision:** `map_front` — The feasible front is entirely pipelined_m (39 designs, 209/222 feasible), and it already spans both objective ranges relative to the HV reference: luts_plus_ffs 745..3308 (ref 3000) and accuracy_bits 10.1..24.6 (ref 10). iterative and unrolled_k are structurally unable to pass the bursty p99<=0.4us constraint (max throughput 18.5 and 12 MSPS, 0 feasible) because they accept only one result every several cycles and queue the rest of an 8-request burst; pipelined is the same datapath as pipelined_m but registers every stage, so it can only add FFs and is dominated on the min-luts_plus_ffs objective. With one round (100 evals) left and the gain already tapering (+3.1%), the best use of the budget is to densely map the pipelined_m front over its full ranges (data_width 15..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8), seeded with the current front, to maximise hypervolume coverage rather than spend evals on a dominated family.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.501e+04 (gain this round: +3.1%).
Feasible designs: 209 of 300 evaluations (190 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 178
- max_abs_err <= 0.000976562: 21% violate; best seen 3.8e-08 (2^-24.65)
- sys_p99_latency_us <= 0.4: 26% violate; best seen 0.076

Pareto front (feasible, 39 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=6] luts_plus_ffs=745, accuracy_bits=10.1, luts=608, ffs=137, throughput_msps=68.5, max_abs_err=0.000917 (2^-10.09), power_index=0.0561
- pipelined_m [data_width=17 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=817, accuracy_bits=10.6, luts=666, ffs=151, throughput_msps=52.7, max_abs_err=0.000643 (2^-10.60), power_index=0.0615
- pipelined_m [data_width=17 n_iter=13 angle_guard=-1 frac_guard=0 rounding=trunc m=5] luts_plus_ffs=920, accuracy_bits=11.1, luts=713, ffs=207, throughput_msps=80.6, max_abs_err=0.000468 (2^-11.06), power_index=0.0692
- pipelined_m [data_width=18 n_iter=14 angle_guard=4 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1138, accuracy_bits=12.8, luts=964, ffs=174, throughput_msps=50.3, max_abs_err=0.000143 (2^-12.77), power_index=0.0856
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=8] luts_plus_ffs=1170, accuracy_bits=13.4, luts=1002, ffs=167, throughput_msps=50.3, max_abs_err=9.56e-05 (2^-13.35), power_index=0.088
- pipelined_m [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=1250, accuracy_bits=13.9, luts=1084, ffs=165, throughput_msps=50.3, max_abs_err=6.42e-05 (2^-13.93), power_index=0.094
- pipelined_m [data_width=21 n_iter=17 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1630, accuracy_bits=15.5, luts=1219, ffs=411, throughput_msps=89.6, max_abs_err=2.15e-05 (2^-15.50), power_index=0.123
- pipelined_m [data_width=23 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=5] luts_plus_ffs=2032, accuracy_bits=17.8, luts=1647, ffs=385, throughput_msps=73.7, max_abs_err=4.31e-06 (2^-17.82), power_index=0.153
- pipelined_m [data_width=28 n_iter=24 angle_guard=4 frac_guard=0 rounding=round m=8] luts_plus_ffs=2628, accuracy_bits=22.4, luts=2283, ffs=344, throughput_msps=44, max_abs_err=1.86e-07 (2^-22.36), power_index=0.198
- pipelined_m [data_width=28 n_iter=28 angle_guard=4 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=3308, accuracy_bits=24.6, luts=2850, ffs=458, throughput_msps=44, max_abs_err=3.8e-08 (2^-24.65), power_index=0.249
Front coverage: luts_plus_ffs 745..3308 (HV reference 3000); accuracy_bits 10.1..24.6 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 23 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 11.85 bits
- unrolled_k: 55 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 11.70 bits
- pipelined_m: 222 evals, 209 feasible; max throughput seen 178 MSPS; best accuracy 24.65 bits; best feasible luts_plus_ffs=745; feasible ranges: data_width 15..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (39 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 302 feasible; hypervolume 1.537e+04 (+2.4%).

**LLM decision:** `stop` — Budget exhausted (400/400 evals, round 4 of 4). The feasible front is well mapped: 302 feasible designs, 46 on the Pareto front spanning luts_plus_ffs 745..3325 and accuracy_bits 10.1..25.1, with hypervolume 1.537e+04 and only +2.4% gain this round (marginal). All constraints are comfortably met by the front: throughput best 178 MSPS vs >=2 required, max_abs_err best 2.77e-08 vs <=9.77e-04, sys_p99_latency best 0.076 us vs <=0.4 us. The selection rule (min luts_plus_ffs) is satisfied by the front's cheapest design, pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=6] at 745 LUT+FF with 10.1 accuracy bits and 0.000917 max error, which still meets the 2^-10 error bound. iterative and unrolled_k produced 0 feasible designs (max throughput 18.5 and 12 MSPS respectively, but no design met the combined constraints), so pipelined_m is the only viable family and it is fully covered. No further improvement is expected within budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.537e+04 (gain this round: +2.4%).
Feasible designs: 302 of 400 evaluations (276 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 178
- max_abs_err <= 0.000976562: 18% violate; best seen 2.77e-08 (2^-25.10)
- sys_p99_latency_us <= 0.4: 20% violate; best seen 0.076

Pareto front (feasible, 46 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round m=6] luts_plus_ffs=745, accuracy_bits=10.1, luts=608, ffs=137, throughput_msps=68.5, max_abs_err=0.000917 (2^-10.09), power_index=0.0561
- pipelined_m [data_width=15 n_iter=12 angle_guard=2 frac_guard=3 rounding=round m=7] luts_plus_ffs=868, accuracy_bits=10.7, luts=721, ffs=147, throughput_msps=59.6, max_abs_err=0.000602 (2^-10.70), power_index=0.0653
- pipelined_m [data_width=18 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=971, accuracy_bits=11.9, luts=813, ffs=157, throughput_msps=52.7, max_abs_err=0.000265 (2^-11.88), power_index=0.073
- pipelined_m [data_width=18 n_iter=15 angle_guard=0 frac_guard=2 rounding=round m=8] luts_plus_ffs=1153, accuracy_bits=13, luts=987, ffs=165, throughput_msps=50.3, max_abs_err=0.000123 (2^-12.99), power_index=0.0867
- pipelined_m [data_width=19 n_iter=16 angle_guard=0 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1236, accuracy_bits=13.8, luts=1064, ffs=172, throughput_msps=50.3, max_abs_err=6.89e-05 (2^-13.83), power_index=0.093
- pipelined_m [data_width=19 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1475, accuracy_bits=14.5, luts=1152, ffs=323, throughput_msps=93.6, max_abs_err=4.29e-05 (2^-14.51), power_index=0.111
- pipelined_m [data_width=21 n_iter=20 angle_guard=4 frac_guard=0 rounding=round m=7] luts_plus_ffs=1733, accuracy_bits=16.4, luts=1467, ffs=266, throughput_msps=54.3, max_abs_err=1.15e-05 (2^-16.41), power_index=0.13
- pipelined_m [data_width=26 n_iter=19 angle_guard=0 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=2034, accuracy_bits=17.9, luts=1712, ffs=322, throughput_msps=45.9, max_abs_err=4.21e-06 (2^-17.86), power_index=0.153
- pipelined_m [data_width=28 n_iter=24 angle_guard=4 frac_guard=0 rounding=round m=8] luts_plus_ffs=2628, accuracy_bits=22.4, luts=2283, ffs=344, throughput_msps=44, max_abs_err=1.86e-07 (2^-22.36), power_index=0.198
- pipelined_m [data_width=28 n_iter=27 angle_guard=4 frac_guard=4 rounding=round m=7] luts_plus_ffs=3325, accuracy_bits=25.1, luts=2859, ffs=466, throughput_msps=49.9, max_abs_err=2.77e-08 (2^-25.10), power_index=0.25
Front coverage: luts_plus_ffs 745..3325 (HV reference 3000); accuracy_bits 10.1..25.1 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 23 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 11.85 bits
- unrolled_k: 55 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 11.70 bits
- pipelined_m: 322 evals, 302 feasible; max throughput seen 178 MSPS; best accuracy 25.10 bits; best feasible luts_plus_ffs=745; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16503 in, 23032 out
- provider-reported cost: $0.0194
- full prompts and replies: `llm_trace.jsonl`

