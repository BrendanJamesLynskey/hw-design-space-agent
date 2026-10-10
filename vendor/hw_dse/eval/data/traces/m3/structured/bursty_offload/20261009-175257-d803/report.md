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
`pipelined_m:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 631 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 141 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 67.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0581 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000803 (2^-10.28) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.58 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000238 (2^-12.04) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.95 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.3 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.3 dBc, SNR 69.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=0,rounding=round,m=6` | 0.1459 → 0.1953 | yes |
| `pipelined_m:data_width=15,n_iter=12,angle_guard=3,frac_guard=2,rounding=round,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=15,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=15,n_iter=13,angle_guard=1,frac_guard=2,rounding=trunc,m=6` | 0.1605 → 0.2099 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (38 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round,m=7` | 631 | 141 | 59.6 | 4 | 0.0581 | 0.000803 (2^-10.28) | 10.28 |
| 1 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=0,rounding=round,m=6` | 654 | 147 | 68.5 | 4 | 0.0603 | 0.000654 (2^-10.58) | 10.58 |
| 2 | `pipelined_m:data_width=15,n_iter=12,angle_guard=3,frac_guard=2,rounding=round,m=7` | 709 | 147 | 59.6 | 4 | 0.0644 | 0.000629 (2^-10.63) | 10.63 |
| 3 | `pipelined_m:data_width=15,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 759 | 141 | 52.7 | 4 | 0.0677 | 0.000567 (2^-10.78) | 10.78 |
| 4 | `pipelined_m:data_width=15,n_iter=13,angle_guard=1,frac_guard=2,rounding=trunc,m=6` | 713 | 199 | 68.5 | 5 | 0.0686 | 0.000528 (2^-10.89) | 10.89 |
| 5 | `pipelined_m:data_width=17,n_iter=13,angle_guard=1,frac_guard=2,rounding=trunc,m=8` | 789 | 157 | 50.3 | 4 | 0.0712 | 0.000309 (2^-11.66) | 11.66 |
| 6 | `pipelined_m:data_width=14,n_iter=14,angle_guard=4,frac_guard=4,rounding=round,m=7` | 857 | 145 | 59.6 | 4 | 0.0754 | 0.000284 (2^-11.78) | 11.78 |
| 7 | `pipelined_m:data_width=15,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=8` | 938 | 145 | 52.7 | 4 | 0.0815 | 0.000253 (2^-11.95) | 11.95 |
| 8 | `pipelined_m:data_width=20,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 916 | 184 | 50.3 | 4 | 0.0827 | 0.000248 (2^-11.98) | 11.98 |
| 9 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round,m=8` | 971 | 161 | 50.3 | 4 | 0.0852 | 0.000108 (2^-13.18) | 13.18 |
| 10 | `pipelined_m:data_width=20,n_iter=16,angle_guard=-1,frac_guard=2,rounding=trunc,m=8` | 1096 | 178 | 50.3 | 4 | 0.0958 | 6.6e-05 (2^-13.89) | 13.89 |
| 11 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=6` | 1118 | 235 | 65.4 | 5 | 0.102 | 5.96e-05 (2^-14.03) | 14.03 |
| 12 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=round,m=7` | 1135 | 246 | 56.8 | 5 | 0.104 | 3.32e-05 (2^-14.88) | 14.88 |
| 13 | `pipelined_m:data_width=20,n_iter=17,angle_guard=3,frac_guard=0,rounding=round,m=7` | 1169 | 252 | 54.3 | 5 | 0.107 | 2.95e-05 (2^-15.05) | 15.05 |
| 14 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc,m=7` | 1202 | 254 | 56.8 | 5 | 0.11 | 2.8e-05 (2^-15.12) | 15.12 |
| 15 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc,m=6` | 1202 | 254 | 65.4 | 5 | 0.11 | 2.8e-05 (2^-15.12) | 15.12 |
| 16 | `pipelined_m:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=6` | 1219 | 257 | 65.4 | 5 | 0.111 | 2.57e-05 (2^-15.25) | 15.25 |
| 17 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=round,m=7` | 1244 | 256 | 56.8 | 5 | 0.113 | 2.32e-05 (2^-15.40) | 15.40 |
| 18 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=2,rounding=round,m=8` | 1244 | 256 | 50.3 | 5 | 0.113 | 2.32e-05 (2^-15.40) | 15.40 |
| 19 | `pipelined_m:data_width=22,n_iter=17,angle_guard=3,frac_guard=0,rounding=trunc,m=4` | 1270 | 428 | 89.6 | 7 | 0.128 | 2.27e-05 (2^-15.43) | 15.43 |
| 20 | `pipelined_m:data_width=21,n_iter=18,angle_guard=4,frac_guard=3,rounding=trunc,m=8` | 1420 | 278 | 48.0 | 5 | 0.128 | 1.05e-05 (2^-16.54) | 16.54 |
| 21 | `pipelined_m:data_width=23,n_iter=19,angle_guard=0,frac_guard=3,rounding=trunc,m=8` | 1542 | 289 | 48.0 | 5 | 0.138 | 6.1e-06 (2^-17.32) | 17.32 |
| 22 | `pipelined_m:data_width=23,n_iter=20,angle_guard=0,frac_guard=3,rounding=trunc,m=8` | 1627 | 289 | 48.0 | 5 | 0.144 | 4.52e-06 (2^-17.76) | 17.76 |
| 23 | `pipelined_m:data_width=22,n_iter=20,angle_guard=2,frac_guard=1,rounding=round,m=6` | 1573 | 355 | 62.5 | 6 | 0.145 | 4.46e-06 (2^-17.77) | 17.77 |
| 24 | `pipelined_m:data_width=23,n_iter=19,angle_guard=3,frac_guard=3,rounding=round,m=8` | 1647 | 300 | 48.0 | 5 | 0.146 | 4.31e-06 (2^-17.82) | 17.82 |
| 25 | `pipelined_m:data_width=23,n_iter=20,angle_guard=1,frac_guard=4,rounding=trunc,m=8` | 1687 | 296 | 45.9 | 5 | 0.149 | 3.54e-06 (2^-18.11) | 18.11 |
| 26 | `pipelined_m:data_width=22,n_iter=21,angle_guard=3,frac_guard=3,rounding=trunc,m=6` | 1712 | 369 | 62.5 | 6 | 0.157 | 2.72e-06 (2^-18.49) | 18.49 |
| 27 | `pipelined_m:data_width=24,n_iter=20,angle_guard=3,frac_guard=1,rounding=round,m=5` | 1718 | 387 | 70.6 | 6 | 0.158 | 2.45e-06 (2^-18.64) | 18.64 |
| 28 | `pipelined_m:data_width=28,n_iter=21,angle_guard=-1,frac_guard=1,rounding=trunc,m=8` | 1923 | 333 | 45.9 | 5 | 0.17 | 1.1e-06 (2^-19.79) | 19.79 |
| 29 | `pipelined_m:data_width=23,n_iter=23,angle_guard=3,frac_guard=3,rounding=round,m=8` | 2001 | 300 | 48.0 | 5 | 0.173 | 8.54e-07 (2^-20.16) | 20.16 |
| 30 | `pipelined_m:data_width=26,n_iter=24,angle_guard=0,frac_guard=0,rounding=round,m=8` | 2041 | 310 | 48.0 | 5 | 0.177 | 6.15e-07 (2^-20.63) | 20.63 |
| 31 | `pipelined_m:data_width=25,n_iter=23,angle_guard=4,frac_guard=2,rounding=trunc,m=8` | 2069 | 319 | 45.9 | 5 | 0.18 | 5.71e-07 (2^-20.74) | 20.74 |
| 32 | `pipelined_m:data_width=26,n_iter=23,angle_guard=4,frac_guard=2,rounding=trunc,m=7` | 2138 | 424 | 52.0 | 6 | 0.193 | 4.07e-07 (2^-21.23) | 21.23 |
| 33 | `pipelined_m:data_width=26,n_iter=23,angle_guard=3,frac_guard=3,rounding=trunc,m=6` | 2161 | 426 | 59.9 | 6 | 0.195 | 3.59e-07 (2^-21.41) | 21.41 |
| 34 | `pipelined_m:data_width=26,n_iter=23,angle_guard=3,frac_guard=4,rounding=round,m=8` | 2262 | 337 | 45.9 | 5 | 0.196 | 3.12e-07 (2^-21.61) | 21.61 |
| 35 | `pipelined_m:data_width=27,n_iter=23,angle_guard=3,frac_guard=4,rounding=trunc,m=6` | 2277 | 446 | 57.5 | 6 | 0.205 | 2.82e-07 (2^-21.76) | 21.76 |
| 36 | `pipelined_m:data_width=28,n_iter=23,angle_guard=2,frac_guard=3,rounding=trunc,m=7` | 2277 | 450 | 49.9 | 6 | 0.205 | 2.72e-07 (2^-21.81) | 21.81 |
| 37 | `pipelined_m:data_width=27,n_iter=24,angle_guard=3,frac_guard=4,rounding=round,m=6` | 2437 | 448 | 57.5 | 6 | 0.217 | 1.53e-07 (2^-22.64) | 22.64 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraint is the system one: a burst of 8 requests 0 ns apart must finish inside 0.4 us, i.e. ~8 x (cycles/result)/Fmax <= 400 ns. Accuracy (max_abs_err <= 2^-10) forces N>=~11 and W>=~12, since accuracy_bits tracks N and the output LSB is 2^-(W-2). Together these rule out `iterative`: with N>=11 it needs N+3>=14 cycles/result, so 8 results cost >=112 cycles (>=450 ns even at 250 MHz) and it cannot pass. The three pipelined/unrolled families all deliver 1 result/cycle or better and can meet both constraints, so round 1 spends the whole 100-eval budget on them: unrolled_k (small k -> few LUTs, few registers) and pipelined_m (large m -> few registers) are the likely area winners, with pipelined as the high-area anchor. Ranges are kept near the feasibility boundary (W 11-16, N 10-16, small guards) to concentrate samples where the Pareto front should live; later rounds can widen W/N and the guard ranges once the front's location is known. Throughput_msps >= 2 is not a discriminator here (all three families clear it by orders of magnitude), so it is not used to shape the boxes.*)
- `unrolled_k` (40 evals): data_width=11..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..6. *Why:* Shares one k-wide datapath over ceil(N/k) cycles, so LUTs scale with k (not N) while registers stay ~one bank: the cheapest way to reach accuracy_bits>=10 (needs N>=~11, W>=~12) while still serving a burst of 8 fast enough (k>=3 keeps 8 results inside the 0.4us p99 budget at realistic Fmax).
- `pipelined_m` (35 evals): data_width=11..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* 1 result/cycle trivially satisfies the burst-latency and throughput constraints; large m collapses the N register banks down to ceil(N/m), so it is the low-FF counterpart to unrolled_k and should own the low-area end of the front at high accuracy.
- `pipelined` (25 evals): data_width=11..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Full one-register-per-iteration pipeline: highest Fmax and 1 result/cycle, but N register banks make it the area-expensive corner. Kept to anchor the high-Fmax/high-area end and to check whether its extra speed ever buys a feasible point the other families miss.

**Result (code):** 100 evaluations this round, 100 total; 35 feasible; hypervolume 4704 (n/a).

**LLM decision:** `add_family` — The front is entirely pipelined_m (7 designs, luts_plus_ffs 772..1160, accuracy 10.3..12.3 bits); pipelined is dominated (best feasible area 1483) and unrolled_k is 0/40 feasible. The one family never touched is iterative, and it is exactly the family that matters most for this spec: the selection rule is min luts_plus_ffs, and iterative's single shared datapath with barrel shifters is the most area-efficient architecture in the registry, so it is the most likely source of a design below the current 772. Its low throughput is not a blocker here: the throughput constraint is only 2 MSPS, and even N=30 at ~250 MHz gives ~7.6 MSPS, so the binding risks are max_abs_err (needs enough W/N) and sys_p99_latency (needs low N, since iterative is N+3 cycles/result). The high-accuracy extension of the front (the dominant HV region, since luts_plus_ffs only reaches 1160 vs the 3000 reference) is already covered by the reserved end-of-run mapping over the families on the front, so this discretionary round is best spent closing the unexplored-family gap rather than duplicating that mapping. If iterative lands on the front it will also be included in the reserved full-range mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 4704 (gain this round: n/a (first round)).
Feasible designs: 35 of 100 evaluations (25 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 42% violate; best seen 0.000192 (2^-12.35)
- sys_p99_latency_us <= 0.4: 40% violate; best seen 0.0696

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round m=7] luts_plus_ffs=772, accuracy_bits=10.3, luts=631, ffs=141, throughput_msps=59.6, max_abs_err=0.000803 (2^-10.28), power_index=0.0581
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=802, accuracy_bits=10.6, luts=654, ffs=147, throughput_msps=68.5, max_abs_err=0.000654 (2^-10.58), power_index=0.0603
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=856, accuracy_bits=10.6, luts=709, ffs=147, throughput_msps=59.6, max_abs_err=0.000629 (2^-10.63), power_index=0.0644
- pipelined_m [data_width=15 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=900, accuracy_bits=10.8, luts=759, ffs=141, throughput_msps=52.7, max_abs_err=0.000567 (2^-10.78), power_index=0.0677
- pipelined_m [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1049, accuracy_bits=11.4, luts=906, ffs=143, throughput_msps=52.7, max_abs_err=0.000374 (2^-11.39), power_index=0.079
- pipelined_m [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=8] luts_plus_ffs=1083, accuracy_bits=12, luts=938, ffs=145, throughput_msps=52.7, max_abs_err=0.000253 (2^-11.95), power_index=0.0815
- pipelined_m [data_width=15 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=1160, accuracy_bits=12.3, luts=954, ffs=207, throughput_msps=59.6, max_abs_err=0.000192 (2^-12.35), power_index=0.0873
Front coverage: luts_plus_ffs 772..1160 (HV reference 3000); accuracy_bits 10.3..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 40 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 12.26 bits
- pipelined: 25 evals, 10 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1483; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard 0..1, frac_guard 0..2
- pipelined_m: 35 evals, 25 feasible; max throughput seen 178 MSPS; best accuracy 12.35 bits; best feasible luts_plus_ffs=772; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard 0..3, frac_guard 0..3, m 6..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Explore the only unexplored family, focused on the area-optimal / low-latency region so it can compete with pipelined_m's 772 luts_plus_ffs while still meeting max_abs_err <= 2^-10 and sys_p99_latency <= 0.4 us.*)
- `iterative` (100 evals): data_width=12..20, n_iter=8..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* unexplored; shared datapath is the area-optimal family and the selection rule is min luts_plus_ffs

**Result (code):** 100 evaluations this round, 200 total; 35 feasible; hypervolume 4704 (+0.0%).

**LLM decision:** `map_front` — The feasible front is entirely pipelined_m and occupies only a small slice of the area objective: luts_plus_ffs 772..1160 against an HV reference of 3000, with data_width pinned to 15..16 (registry allows 8..28). Accuracy_bits 10.3..12.3 already clears the 2^-10 constraint with margin, so the unexplored upside is the high-area/high-accuracy region that the HV reference point rewards. Round 2 produced +0.0% HV gain, i.e. the local search has saturated the narrow region it was given, and 200 of 400 evals remain. The reserved budget is best spent letting NSGA-II map the whole front over the full ranges of the families that actually appear on it (pipelined_m, and pipelined as the only other family with any feasible designs), seeded with the current 7-design front. This should extend coverage toward larger data_width/n_iter and fill the 1160..3000 area gap rather than re-sampling the already-dense cheap corner.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4704 (gain this round: +0.0%).
Feasible designs: 35 of 200 evaluations (25 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 50% violate; best seen 3.49e-05 (2^-14.81)
- sys_p99_latency_us <= 0.4: 70% violate; best seen 0.0696

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round m=7] luts_plus_ffs=772, accuracy_bits=10.3, luts=631, ffs=141, throughput_msps=59.6, max_abs_err=0.000803 (2^-10.28), power_index=0.0581
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=802, accuracy_bits=10.6, luts=654, ffs=147, throughput_msps=68.5, max_abs_err=0.000654 (2^-10.58), power_index=0.0603
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=856, accuracy_bits=10.6, luts=709, ffs=147, throughput_msps=59.6, max_abs_err=0.000629 (2^-10.63), power_index=0.0644
- pipelined_m [data_width=15 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=900, accuracy_bits=10.8, luts=759, ffs=141, throughput_msps=52.7, max_abs_err=0.000567 (2^-10.78), power_index=0.0677
- pipelined_m [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1049, accuracy_bits=11.4, luts=906, ffs=143, throughput_msps=52.7, max_abs_err=0.000374 (2^-11.39), power_index=0.079
- pipelined_m [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=8] luts_plus_ffs=1083, accuracy_bits=12, luts=938, ffs=145, throughput_msps=52.7, max_abs_err=0.000253 (2^-11.95), power_index=0.0815
- pipelined_m [data_width=15 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=1160, accuracy_bits=12.3, luts=954, ffs=207, throughput_msps=59.6, max_abs_err=0.000192 (2^-12.35), power_index=0.0873
Front coverage: luts_plus_ffs 772..1160 (HV reference 3000); accuracy_bits 10.3..12.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 100 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 14.81 bits
- unrolled_k: 40 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 12.26 bits
- pipelined: 25 evals, 10 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1483; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard 0..1, frac_guard 0..2
- pipelined_m: 35 evals, 25 feasible; max throughput seen 178 MSPS; best accuracy 12.35 bits; best feasible luts_plus_ffs=772; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard 0..3, frac_guard 0..3, m 6..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (7 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 74 feasible; hypervolume 1.419e+04 (+201.6%).

**LLM decision:** `map_front` — The feasible front is entirely pipelined_m (64 of 74 feasible designs), spanning luts_plus_ffs 772..2885 against an HV reference of 3000 and accuracy_bits 10.3..22.6 against a reference of 10 — so the front is well inside both reference points and the hypervolume is still dominated by coverage gaps rather than by the corner the selection rule picks. The selection rule (min luts_plus_ffs) already sits at the cheap end (772), but the front's data_width only spans 15..27 of the registry's 8..28, and the cheap end is thin: only two designs below 1000 LUT+FF, both at data_width=15. The reserved budget (160 evals left) is best spent letting code run NSGA-II over the full pipelined_m ranges seeded with this front, to fill the low-area region (data_width 8..15) and the high-accuracy tail (data_width 27..28) and confirm whether pipelined (10 feasible, best 1483 LUT+FF) can contribute any cheaper point. Note the L1 system bound is optimistic: the cheapest designs pass sys_p99_latency_us at 0.0696 us vs the 0.4 us limit, so there is margin, but L2 re-selection may drop marginal ones — mapping the front broadly gives the L2 step more candidates to keep.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.419e+04 (gain this round: +201.6%).
Feasible designs: 74 of 240 evaluations (62 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 42% violate; best seen 1.53e-07 (2^-22.64)
- sys_p99_latency_us <= 0.4: 58% violate; best seen 0.0696

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round m=7] luts_plus_ffs=772, accuracy_bits=10.3, luts=631, ffs=141, throughput_msps=59.6, max_abs_err=0.000803 (2^-10.28), power_index=0.0581
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=856, accuracy_bits=10.6, luts=709, ffs=147, throughput_msps=59.6, max_abs_err=0.000629 (2^-10.63), power_index=0.0644
- pipelined_m [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=8] luts_plus_ffs=1083, accuracy_bits=12, luts=938, ffs=145, throughput_msps=52.7, max_abs_err=0.000253 (2^-11.95), power_index=0.0815
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1322, accuracy_bits=13.6, luts=1017, ffs=305, throughput_msps=93.6, max_abs_err=8.26e-05 (2^-13.56), power_index=0.0994
- pipelined_m [data_width=18 n_iter=19 angle_guard=2 frac_guard=2 rounding=trunc m=5] luts_plus_ffs=1560, accuracy_bits=14.2, luts=1257, ffs=303, throughput_msps=77, max_abs_err=5.33e-05 (2^-14.20), power_index=0.117
- pipelined_m [data_width=24 n_iter=17 angle_guard=-1 frac_guard=4 rounding=trunc m=6] luts_plus_ffs=1739, accuracy_bits=15.9, luts=1438, ffs=301, throughput_msps=59.9, max_abs_err=1.68e-05 (2^-15.86), power_index=0.131
- pipelined_m [data_width=22 n_iter=20 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=1928, accuracy_bits=17.8, luts=1573, ffs=355, throughput_msps=62.5, max_abs_err=4.46e-06 (2^-17.77), power_index=0.145
- pipelined_m [data_width=22 n_iter=21 angle_guard=3 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=2082, accuracy_bits=18.5, luts=1712, ffs=369, throughput_msps=62.5, max_abs_err=2.72e-06 (2^-18.49), power_index=0.157
- pipelined_m [data_width=26 n_iter=23 angle_guard=3 frac_guard=4 rounding=round m=8] luts_plus_ffs=2599, accuracy_bits=21.6, luts=2262, ffs=337, throughput_msps=45.9, max_abs_err=3.12e-07 (2^-21.61), power_index=0.196
- pipelined_m [data_width=27 n_iter=24 angle_guard=3 frac_guard=4 rounding=round m=6] luts_plus_ffs=2885, accuracy_bits=22.6, luts=2437, ffs=448, throughput_msps=57.5, max_abs_err=1.53e-07 (2^-22.64), power_index=0.217
Front coverage: luts_plus_ffs 772..2885 (HV reference 3000); accuracy_bits 10.3..22.6 (HV reference 10); data_width on the front 15..27 (registry 8..28).

Per family:
- iterative: 100 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 14.81 bits
- unrolled_k: 40 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 12.26 bits
- pipelined: 25 evals, 10 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1483; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard 0..1, frac_guard 0..2
- pipelined_m: 75 evals, 64 feasible; max throughput seen 178 MSPS; best accuracy 22.64 bits; best feasible luts_plus_ffs=772; feasible ranges: data_width 14..27, n_iter 12..29, angle_guard -1..4, frac_guard 0..4, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (22 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 165 feasible; hypervolume 1.555e+04 (+9.6%).

**LLM decision:** `stop` — Final round and the search has converged on a well-covered feasible front, so stopping is right. Evidence: 165 of 340 evaluations are feasible (146 unique) and the feasible Pareto front holds 34 designs spanning luts_plus_ffs 772..2885 against the HV reference 3000 (so the area axis is nearly fully covered) and accuracy_bits 10.3..22.6 against the HV reference 10, giving hypervolume 1.555e+04 with a +9.6% gain this round. All four registry families have already been explored (none left to add), and the two non-front families are unproductive here: iterative (100 evals, 0 feasible, max throughput 18 MSPS) and unrolled_k (40 evals, 0 feasible, max throughput 12.4 MSPS) cannot reach the 0.4 us p99 bound, while pipelined_m supplies 155 feasible designs. All three constraints are comfortably met by the front: throughput best 282 MSPS vs >=2 required (0% violate), max_abs_err best 1.53e-07 and the front's cheapest design 8.03e-04 vs <=9.77e-04 (2^-10), and sys_p99_latency_us best 0.0696 vs <=0.4. Under the selection rule (min luts_plus_ffs) the pick is pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round m=7] at luts_plus_ffs=772 (631 LUT, 141 FF), accuracy_bits=10.3 (max_abs_err=8.03e-04), throughput 59.6 MSPS, power_index 0.058 — feasible on every constraint with margin. With 60 evaluations unused but the final-round cap in force and no unexplored family or objective space left to widen meaningfully, further refinement risks only marginal HV change; stop.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.555e+04 (gain this round: +9.6%).
Feasible designs: 165 of 340 evaluations (146 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 32% violate; best seen 1.53e-07 (2^-22.64)
- sys_p99_latency_us <= 0.4: 41% violate; best seen 0.0696

Pareto front (feasible, 34 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round m=7] luts_plus_ffs=772, accuracy_bits=10.3, luts=631, ffs=141, throughput_msps=59.6, max_abs_err=0.000803 (2^-10.28), power_index=0.0581
- pipelined_m [data_width=15 n_iter=13 angle_guard=1 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=912, accuracy_bits=10.9, luts=713, ffs=199, throughput_msps=68.5, max_abs_err=0.000528 (2^-10.89), power_index=0.0686
- pipelined_m [data_width=20 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1099, accuracy_bits=12, luts=916, ffs=184, throughput_msps=50.3, max_abs_err=0.000248 (2^-11.98), power_index=0.0827
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=1381, accuracy_bits=14.9, luts=1135, ffs=246, throughput_msps=56.8, max_abs_err=3.32e-05 (2^-14.88), power_index=0.104
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=1476, accuracy_bits=15.2, luts=1219, ffs=257, throughput_msps=65.4, max_abs_err=2.57e-05 (2^-15.25), power_index=0.111
- pipelined_m [data_width=21 n_iter=18 angle_guard=4 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1699, accuracy_bits=16.5, luts=1420, ffs=278, throughput_msps=48, max_abs_err=1.05e-05 (2^-16.54), power_index=0.128
- pipelined_m [data_width=23 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=1947, accuracy_bits=17.8, luts=1647, ffs=300, throughput_msps=48, max_abs_err=4.31e-06 (2^-17.82), power_index=0.146
- pipelined_m [data_width=28 n_iter=21 angle_guard=-1 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=2256, accuracy_bits=19.8, luts=1923, ffs=333, throughput_msps=45.9, max_abs_err=1.1e-06 (2^-19.79), power_index=0.17
- pipelined_m [data_width=24 n_iter=23 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=2420, accuracy_bits=20.7, luts=2026, ffs=393, throughput_msps=52, max_abs_err=5.75e-07 (2^-20.73), power_index=0.182
- pipelined_m [data_width=27 n_iter=24 angle_guard=3 frac_guard=4 rounding=round m=6] luts_plus_ffs=2885, accuracy_bits=22.6, luts=2437, ffs=448, throughput_msps=57.5, max_abs_err=1.53e-07 (2^-22.64), power_index=0.217
Front coverage: luts_plus_ffs 772..2885 (HV reference 3000); accuracy_bits 10.3..22.6 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 100 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 14.81 bits
- unrolled_k: 40 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 12.26 bits
- pipelined: 25 evals, 10 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1483; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard 0..1, frac_guard 0..2
- pipelined_m: 175 evals, 155 feasible; max throughput seen 178 MSPS; best accuracy 22.64 bits; best feasible luts_plus_ffs=772; feasible ranges: data_width 14..28, n_iter 12..29, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (34 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 225 feasible; hypervolume 1.573e+04 (+1.2%).

**No LLM call** (code's front-mapping round): Final round and the search has converged on a well-covered feasible front, so stopping is right. Evidence: 165 of 340 evaluations are feasible (146 unique) and the feasible Pareto front holds 34 designs spanning luts_plus_ffs 772..2885 against the HV reference 3000 (so the area axis is nearly fully covered) and accuracy_bits 10.3..22.6 against the HV reference 10, giving hypervolume 1.555e+04 with a +9.6% gain this round. All four registry families have already been explored (none left to add), and the two non-front families are unproductive here: iterative (100 evals, 0 feasible, max throughput 18 MSPS) and unrolled_k (40 evals, 0 feasible, max throughput 12.4 MSPS) cannot reach the 0.4 us p99 bound, while pipelined_m supplies 155 feasible designs. All three constraints are comfortably met by the front: throughput best 282 MSPS vs >=2 required (0% violate), max_abs_err best 1.53e-07 and the front's cheapest design 8.03e-04 vs <=9.77e-04 (2^-10), and sys_p99_latency_us best 0.0696 vs <=0.4. Under the selection rule (min luts_plus_ffs) the pick is pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round m=7] at luts_plus_ffs=772 (631 LUT, 141 FF), accuracy_bits=10.3 (max_abs_err=8.03e-04), throughput 59.6 MSPS, power_index 0.058 — feasible on every constraint with margin. With 60 evaluations unused but the final-round cap in force and no unexplored family or objective space left to widen meaningfully, further refinement risks only marginal HV change; stop.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.573e+04 (gain this round: +1.2%).
Feasible designs: 225 of 400 evaluations (203 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 28% violate; best seen 1.53e-07 (2^-22.64)
- sys_p99_latency_us <= 0.4: 35% violate; best seen 0.0696

Pareto front (feasible, 38 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round m=7] luts_plus_ffs=772, accuracy_bits=10.3, luts=631, ffs=141, throughput_msps=59.6, max_abs_err=0.000803 (2^-10.28), power_index=0.0581
- pipelined_m [data_width=15 n_iter=13 angle_guard=1 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=912, accuracy_bits=10.9, luts=713, ffs=199, throughput_msps=68.5, max_abs_err=0.000528 (2^-10.89), power_index=0.0686
- pipelined_m [data_width=20 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1099, accuracy_bits=12, luts=916, ffs=184, throughput_msps=50.3, max_abs_err=0.000248 (2^-11.98), power_index=0.0827
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=1381, accuracy_bits=14.9, luts=1135, ffs=246, throughput_msps=56.8, max_abs_err=3.32e-05 (2^-14.88), power_index=0.104
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=1476, accuracy_bits=15.2, luts=1219, ffs=257, throughput_msps=65.4, max_abs_err=2.57e-05 (2^-15.25), power_index=0.111
- pipelined_m [data_width=23 n_iter=19 angle_guard=0 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1830, accuracy_bits=17.3, luts=1542, ffs=289, throughput_msps=48, max_abs_err=6.1e-06 (2^-17.32), power_index=0.138
- pipelined_m [data_width=23 n_iter=20 angle_guard=1 frac_guard=4 rounding=trunc m=8] luts_plus_ffs=1983, accuracy_bits=18.1, luts=1687, ffs=296, throughput_msps=45.9, max_abs_err=3.54e-06 (2^-18.11), power_index=0.149
- pipelined_m [data_width=23 n_iter=23 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=2301, accuracy_bits=20.2, luts=2001, ffs=300, throughput_msps=48, max_abs_err=8.54e-07 (2^-20.16), power_index=0.173
- pipelined_m [data_width=26 n_iter=23 angle_guard=3 frac_guard=3 rounding=trunc m=6] luts_plus_ffs=2587, accuracy_bits=21.4, luts=2161, ffs=426, throughput_msps=59.9, max_abs_err=3.59e-07 (2^-21.41), power_index=0.195
- pipelined_m [data_width=27 n_iter=24 angle_guard=3 frac_guard=4 rounding=round m=6] luts_plus_ffs=2885, accuracy_bits=22.6, luts=2437, ffs=448, throughput_msps=57.5, max_abs_err=1.53e-07 (2^-22.64), power_index=0.217
Front coverage: luts_plus_ffs 772..2885 (HV reference 3000); accuracy_bits 10.3..22.6 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 100 evals, 0 feasible; max throughput seen 18 MSPS; best accuracy 14.81 bits
- unrolled_k: 40 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 12.26 bits
- pipelined: 25 evals, 10 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1483; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard 0..1, frac_guard 0..2
- pipelined_m: 235 evals, 215 feasible; max throughput seen 178 MSPS; best accuracy 22.64 bits; best feasible luts_plus_ffs=772; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16866 in, 21065 out
- provider-reported cost: $0.0155
- full prompts and replies: `llm_trace.jsonl`

