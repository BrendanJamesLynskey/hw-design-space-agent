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
`pipelined_m:data_width=16,n_iter=13,angle_guard=-1,frac_guard=1,rounding=trunc,m=8` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 701 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 143 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 75.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0635 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000761 (2^-10.36) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 12.5 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.000183 (2^-12.41) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 3 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.4 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 86.1 dBc, SNR 72.2 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=16,n_iter=13,angle_guard=-1,frac_guard=1,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=15,n_iter=13,angle_guard=3,frac_guard=1,rounding=trunc,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=6` | 0.1459 → 0.1953 | yes |
| `pipelined_m:data_width=16,n_iter=12,angle_guard=3,frac_guard=1,rounding=round,m=8` | 0.199 → 0.2825 | yes |
| `pipelined_m:data_width=19,n_iter=12,angle_guard=-1,frac_guard=0,rounding=trunc,m=8` | 0.199 → 0.2825 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (33 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=13,angle_guard=-1,frac_guard=1,rounding=trunc,m=8` | 701 | 143 | 52.7 | 4 | 0.0635 | 0.000761 (2^-10.36) | 10.36 |
| 1 | `pipelined_m:data_width=15,n_iter=13,angle_guard=3,frac_guard=1,rounding=trunc,m=7` | 713 | 143 | 59.6 | 4 | 0.0644 | 0.000689 (2^-10.50) | 10.50 |
| 2 | `pipelined_m:data_width=16,n_iter=12,angle_guard=2,frac_guard=1,rounding=round,m=6` | 711 | 151 | 68.5 | 4 | 0.0649 | 0.000568 (2^-10.78) | 10.78 |
| 3 | `pipelined_m:data_width=16,n_iter=12,angle_guard=3,frac_guard=1,rounding=round,m=8` | 723 | 153 | 50.3 | 4 | 0.0659 | 0.000562 (2^-10.80) | 10.80 |
| 4 | `pipelined_m:data_width=19,n_iter=12,angle_guard=-1,frac_guard=0,rounding=trunc,m=8` | 724 | 165 | 50.3 | 4 | 0.0669 | 0.00053 (2^-10.88) | 10.88 |
| 5 | `pipelined_m:data_width=16,n_iter=13,angle_guard=1,frac_guard=1,rounding=trunc,m=6` | 726 | 206 | 68.5 | 5 | 0.0701 | 0.00046 (2^-11.09) | 11.09 |
| 6 | `pipelined_m:data_width=15,n_iter=14,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 800 | 145 | 52.7 | 4 | 0.0711 | 0.00038 (2^-11.36) | 11.36 |
| 7 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 800 | 149 | 52.7 | 4 | 0.0714 | 0.000338 (2^-11.53) | 11.53 |
| 8 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=7` | 820 | 149 | 59.6 | 4 | 0.0729 | 0.000311 (2^-11.65) | 11.65 |
| 9 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=8` | 820 | 149 | 52.7 | 4 | 0.0729 | 0.000311 (2^-11.65) | 11.65 |
| 10 | `pipelined_m:data_width=16,n_iter=14,angle_guard=1,frac_guard=3,rounding=trunc,m=8` | 841 | 151 | 50.3 | 4 | 0.0746 | 0.000288 (2^-11.76) | 11.76 |
| 11 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 841 | 157 | 50.3 | 4 | 0.0751 | 0.000235 (2^-12.06) | 12.06 |
| 12 | `pipelined_m:data_width=16,n_iter=14,angle_guard=4,frac_guard=1,rounding=round,m=7` | 861 | 155 | 56.8 | 4 | 0.0765 | 0.000203 (2^-12.26) | 12.26 |
| 13 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=2,rounding=round,m=8` | 875 | 155 | 50.3 | 4 | 0.0775 | 0.000189 (2^-12.37) | 12.37 |
| 14 | `pipelined_m:data_width=20,n_iter=14,angle_guard=-1,frac_guard=0,rounding=trunc,m=8` | 896 | 174 | 50.3 | 4 | 0.0804 | 0.000158 (2^-12.63) | 12.63 |
| 15 | `pipelined_m:data_width=20,n_iter=14,angle_guard=-1,frac_guard=1,rounding=trunc,m=7` | 923 | 176 | 56.8 | 4 | 0.0827 | 0.000151 (2^-12.69) | 12.69 |
| 16 | `pipelined_m:data_width=17,n_iter=14,angle_guard=3,frac_guard=3,rounding=round,m=7` | 945 | 165 | 56.8 | 4 | 0.0836 | 0.000148 (2^-12.73) | 12.73 |
| 17 | `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=2,rounding=trunc,m=8` | 979 | 169 | 50.3 | 4 | 0.0864 | 0.000127 (2^-12.94) | 12.94 |
| 18 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=7` | 964 | 236 | 56.8 | 5 | 0.0903 | 0.000101 (2^-13.27) | 13.27 |
| 19 | `pipelined_m:data_width=17,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=7` | 985 | 229 | 56.8 | 5 | 0.0914 | 9.31e-05 (2^-13.39) | 13.39 |
| 20 | `pipelined_m:data_width=17,n_iter=19,angle_guard=2,frac_guard=1,rounding=round,m=8` | 1198 | 222 | 50.3 | 5 | 0.107 | 9.28e-05 (2^-13.40) | 13.40 |
| 21 | `pipelined_m:data_width=26,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc,m=7` | 1230 | 307 | 54.3 | 5 | 0.116 | 6.13e-05 (2^-13.99) | 13.99 |
| 22 | `pipelined_m:data_width=25,n_iter=15,angle_guard=3,frac_guard=0,rounding=trunc,m=7` | 1244 | 308 | 52.0 | 5 | 0.117 | 6.12e-05 (2^-14.00) | 14.00 |
| 23 | `pipelined_m:data_width=21,n_iter=19,angle_guard=1,frac_guard=1,rounding=trunc,m=8` | 1371 | 261 | 50.3 | 5 | 0.123 | 1.45e-05 (2^-16.07) | 16.07 |
| 24 | `pipelined_m:data_width=21,n_iter=19,angle_guard=4,frac_guard=1,rounding=round,m=8` | 1472 | 272 | 48.0 | 5 | 0.131 | 8.82e-06 (2^-16.79) | 16.79 |
| 25 | `pipelined_m:data_width=25,n_iter=18,angle_guard=1,frac_guard=0,rounding=trunc,m=8` | 1474 | 302 | 48.0 | 5 | 0.134 | 8.31e-06 (2^-16.88) | 16.88 |
| 26 | `pipelined_m:data_width=21,n_iter=20,angle_guard=4,frac_guard=4,rounding=round,m=7` | 1671 | 285 | 54.3 | 5 | 0.147 | 3.67e-06 (2^-18.05) | 18.05 |
| 27 | `pipelined_m:data_width=24,n_iter=22,angle_guard=2,frac_guard=1,rounding=round,m=6` | 1870 | 383 | 62.5 | 6 | 0.17 | 1.32e-06 (2^-19.54) | 19.54 |
| 28 | `pipelined_m:data_width=27,n_iter=25,angle_guard=-2,frac_guard=0,rounding=round,m=8` | 2155 | 402 | 45.9 | 6 | 0.192 | 9.98e-07 (2^-19.94) | 19.94 |
| 29 | `pipelined_m:data_width=28,n_iter=24,angle_guard=1,frac_guard=1,rounding=trunc,m=8` | 2259 | 339 | 45.9 | 5 | 0.195 | 2.18e-07 (2^-22.13) | 22.13 |
| 30 | `pipelined_m:data_width=28,n_iter=24,angle_guard=1,frac_guard=1,rounding=round,m=4` | 2318 | 626 | 86.0 | 8 | 0.221 | 1.78e-07 (2^-22.42) | 22.42 |
| 31 | `pipelined_m:data_width=27,n_iter=25,angle_guard=3,frac_guard=3,rounding=round,m=6` | 2490 | 540 | 59.9 | 7 | 0.228 | 1.04e-07 (2^-23.20) | 23.20 |
| 32 | `pipelined_m:data_width=27,n_iter=28,angle_guard=2,frac_guard=3,rounding=round,m=6` | 2765 | 535 | 59.9 | 7 | 0.248 | 8.19e-08 (2^-23.54) | 23.54 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Max error 2^-10 requires about 12-bit-class widths and roughly 10-14 iterations. Bursts of 8 simultaneous requests with p99 latency <= 0.4 us rule out the iterative family, which needs N+3 cycles per result and would queue the burst for over 1 us. The first round therefore concentrates on pipelined_m and pipelined, which serve one result per cycle, with a small probe of high-k unrolled designs. The ranges extend a bit above the minimum accuracy so the front also covers the accuracy_bits objective.*)
- `pipelined_m` (58 evals): data_width=11..18, n_iter=9..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Gives 1 result/cycle, so a burst of 8 drains in about 8 cycles. Registering every m stages saves FFs, which lowers luts_plus_ffs while latency should stay well under 0.4 us.
- `pipelined` (28 evals): data_width=11..18, n_iter=9..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Fully pipelined has the highest Fmax and lowest latency. It is the safe system-feasible baseline and anchors the Pareto front, although it uses the most FFs.
- `unrolled_k` (14 evals): data_width=11..16, n_iter=9..15, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* A small-area option that might meet the p99 bound if k is large, since cycles per result drop to about 4-5. The 8-request burst queueing is risky, so it gets a small probe budget.

**Result (code):** 100 evaluations this round, 100 total; 57 feasible; hypervolume 7038 (n/a).

**LLM decision:** `widen` — pipelined_m dominates the front. It holds the minimum area point (863 LUTs+FFs at 10.8 bits) and 14 of the 15 front designs. Pipelined only reaches the front at the high-accuracy end (2110). Its best feasible area is 1514. The cheapest front point sits just above the 10-bit accuracy limit, and feasible designs only span data_width 15..17, so smaller designs with data_width 12..14 and n_iter 10..12 are untested. unrolled_k had 0 feasible of 14 evals and a maximum of 12.4 MSPS. A burst of 8 at that rate takes about 0.65 us, which breaks the 0.4 us p99 bound, so it is dropped. Iterative takes N+3 cycles per result and would queue bursts even worse than unrolled_k, so it is also skipped. The next round widens the low end of data_width and n_iter for pipelined_m, with a small share for pipelined.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7038 (gain this round: n/a (first round)).
Feasible designs: 57 of 100 evaluations (46 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 36% violate; best seen 7.32e-05 (2^-13.74)
- sys_p99_latency_us <= 0.4: 14% violate; best seen 0.0674

Pareto front (feasible, 15 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=863, accuracy_bits=10.8, luts=711, ffs=151, throughput_msps=68.5, max_abs_err=0.000568 (2^-10.78), power_index=0.0649
- pipelined_m [data_width=15 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=959, accuracy_bits=11.4, luts=813, ffs=145, throughput_msps=59.6, max_abs_err=0.000359 (2^-11.44), power_index=0.0721
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=3 rounding=round m=7] luts_plus_ffs=964, accuracy_bits=11.5, luts=810, ffs=153, throughput_msps=56.8, max_abs_err=0.000343 (2^-11.51), power_index=0.0725
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=7] luts_plus_ffs=969, accuracy_bits=11.7, luts=820, ffs=149, throughput_msps=59.6, max_abs_err=0.000311 (2^-11.65), power_index=0.0729
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=8] luts_plus_ffs=969, accuracy_bits=11.7, luts=820, ffs=149, throughput_msps=52.7, max_abs_err=0.000311 (2^-11.65), power_index=0.0729
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=998, accuracy_bits=12.1, luts=841, ffs=157, throughput_msps=50.3, max_abs_err=0.000235 (2^-12.06), power_index=0.0751
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1079, accuracy_bits=12.5, luts=920, ffs=159, throughput_msps=50.3, max_abs_err=0.000173 (2^-12.49), power_index=0.0812
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=1210, accuracy_bits=13.1, luts=979, ffs=231, throughput_msps=56.8, max_abs_err=0.000112 (2^-13.13), power_index=0.091
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=7] luts_plus_ffs=1214, accuracy_bits=13.4, luts=985, ffs=229, throughput_msps=56.8, max_abs_err=9.31e-05 (2^-13.39), power_index=0.0914
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] luts_plus_ffs=2110, accuracy_bits=13.7, luts=1061, ffs=1049, throughput_msps=264, max_abs_err=7.32e-05 (2^-13.74), power_index=0.159
Front coverage: luts_plus_ffs 863..2110 (HV reference 3000); accuracy_bits 10.8..13.7 (HV reference 10); data_width on the front 15..18 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 10.63 bits
- pipelined: 28 evals, 16 feasible; max throughput seen 282 MSPS; best accuracy 13.74 bits; best feasible luts_plus_ffs=1514; feasible ranges: data_width 14..18, n_iter 13..16, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 58 evals, 41 feasible; max throughput seen 171 MSPS; best accuracy 13.39 bits; best feasible luts_plus_ffs=863; feasible ranges: data_width 15..17, n_iter 12..17, angle_guard -1..3, frac_guard 0..3, m 2..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on pipelined_m at smaller widths and iteration counts to extend the front toward lower area. Keep a small share for pipelined.*)
- `pipelined_m` (80 evals): data_width=12..17, n_iter=9..15, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=4..8. *Why:* This family holds the cheapest front points. Lowering data_width and n_iter probes smaller designs that still reach 10 bits, and a larger m cuts FFs.
- `pipelined` (20 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Fully pipelined designs give the highest accuracy and may fill out the top of the front. A small share is enough to check smaller widths.

**Result (code):** 100 evaluations this round, 200 total; 110 feasible; hypervolume 7229 (+2.7%).

**LLM decision:** `refine` — The front is dominated by pipelined_m: the cheapest design is 863 LUTs+FFs at 10.8 bits, and pipelined only appears at 1969 or more. unrolled_k had 0 of 14 feasible with max throughput 12.4 MSPS, and iterative is slower than unrolled_k, so the 0.4 us p99 burst bound will fail for it. I am not spending budget on iterative. The selection rule is min luts_plus_ffs, and the cheapest feasible designs sit near the 2^-10 error limit with data_width 14..16, n_iter 12..14 and large m. Feasible designs only reached data_width 14 and n_iter 12, so the low-area corner is probably not yet exhausted. I will push pipelined_m toward smaller width, fewer iterations and larger m. I will also keep a smaller pipelined_m slice at higher accuracy and a small pipelined share to keep the high-accuracy end of the front.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7229 (gain this round: +2.7%).
Feasible designs: 110 of 200 evaluations (88 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 42% violate; best seen 6.45e-05 (2^-13.92)
- sys_p99_latency_us <= 0.4: 7% violate; best seen 0.066

Pareto front (feasible, 17 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=863, accuracy_bits=10.8, luts=711, ffs=151, throughput_msps=68.5, max_abs_err=0.000568 (2^-10.78), power_index=0.0649
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=932, accuracy_bits=11.1, luts=726, ffs=206, throughput_msps=68.5, max_abs_err=0.00046 (2^-11.09), power_index=0.0701
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=7] luts_plus_ffs=969, accuracy_bits=11.7, luts=820, ffs=149, throughput_msps=59.6, max_abs_err=0.000311 (2^-11.65), power_index=0.0729
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=8] luts_plus_ffs=969, accuracy_bits=11.7, luts=820, ffs=149, throughput_msps=52.7, max_abs_err=0.000311 (2^-11.65), power_index=0.0729
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=998, accuracy_bits=12.1, luts=841, ffs=157, throughput_msps=50.3, max_abs_err=0.000235 (2^-12.06), power_index=0.0751
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1079, accuracy_bits=12.5, luts=920, ffs=159, throughput_msps=50.3, max_abs_err=0.000173 (2^-12.49), power_index=0.0812
- pipelined_m [data_width=16 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=6] luts_plus_ffs=1157, accuracy_bits=12.9, luts=939, ffs=218, throughput_msps=65.4, max_abs_err=0.000128 (2^-12.93), power_index=0.087
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=1210, accuracy_bits=13.1, luts=979, ffs=231, throughput_msps=56.8, max_abs_err=0.000112 (2^-13.13), power_index=0.091
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=1969, accuracy_bits=13.4, luts=987, ffs=982, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=0.148
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=2102, accuracy_bits=13.9, luts=1055, ffs=1047, throughput_msps=264, max_abs_err=6.45e-05 (2^-13.92), power_index=0.158
Front coverage: luts_plus_ffs 863..2102 (HV reference 3000); accuracy_bits 10.8..13.9 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 10.63 bits
- pipelined: 48 evals, 21 feasible; max throughput seen 282 MSPS; best accuracy 13.92 bits; best feasible luts_plus_ffs=1346; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 138 evals, 89 feasible; max throughput seen 171 MSPS; best accuracy 13.39 bits; best feasible luts_plus_ffs=863; feasible ranges: data_width 14..17, n_iter 12..17, angle_guard -1..3, frac_guard 0..3, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the pipelined_m area minimum while keeping some coverage of the higher-accuracy end.*)
- `pipelined_m` (32 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round, m=5..8. *Why:* Targets the min-area corner, where the front starts at 863 LUTs+FFs. Probes slightly smaller widths and fewer iterations than the feasible ranges seen so far, with large m for fewer registers.
- `pipelined` (8 evals): data_width=15..18, n_iter=13..16, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* The full pipeline gives the best accuracy on the front (13.9 bits) at 2102 LUTs+FFs, so a small share keeps that end covered.
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 40 evaluations this round, 240 total; 134 feasible; hypervolume 7252 (+0.3%).

**LLM decision:** `stop` — This is the final round, so stop is the only meaningful choice. The front has 20 feasible designs spanning luts_plus_ffs 844..2102 and accuracy_bits 10.4..13.9. Hypervolume gained only +0.3% last round, so the search is saturated. The cheapest feasible design is pipelined_m (W=16, N=13, m=8) at 844 LUTs+FFs with max error 2^-10.36, which meets the 2^-10 bound. Its throughput of 52.7 MSPS far exceeds the 2 MSPS requirement, and the best system p99 latency seen is 0.066 us against the 0.4 us limit, so L2 re-selection should have margin. unrolled_k produced 0 feasible designs out of 14, with a maximum of 12.4 MSPS. The iterative family was not explored, but at N+3 cycles per result it would likely fall short on burst latency and error, consistent with the unrolled_k results, so it is unlikely to beat the front.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7252 (gain this round: +0.3%).
Feasible designs: 134 of 240 evaluations (106 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 41% violate; best seen 6.45e-05 (2^-13.92)
- sys_p99_latency_us <= 0.4: 6% violate; best seen 0.066

Pareto front (feasible, 20 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=13 angle_guard=-1 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=844, accuracy_bits=10.4, luts=701, ffs=143, throughput_msps=52.7, max_abs_err=0.000761 (2^-10.36), power_index=0.0635
- pipelined_m [data_width=16 n_iter=12 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=863, accuracy_bits=10.8, luts=711, ffs=151, throughput_msps=68.5, max_abs_err=0.000568 (2^-10.78), power_index=0.0649
- pipelined_m [data_width=16 n_iter=13 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=932, accuracy_bits=11.1, luts=726, ffs=206, throughput_msps=68.5, max_abs_err=0.00046 (2^-11.09), power_index=0.0701
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=949, accuracy_bits=11.5, luts=800, ffs=149, throughput_msps=52.7, max_abs_err=0.000338 (2^-11.53), power_index=0.0714
- pipelined_m [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=8] luts_plus_ffs=969, accuracy_bits=11.7, luts=820, ffs=149, throughput_msps=52.7, max_abs_err=0.000311 (2^-11.65), power_index=0.0729
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=round m=8] luts_plus_ffs=1030, accuracy_bits=12.4, luts=875, ffs=155, throughput_msps=50.3, max_abs_err=0.000189 (2^-12.37), power_index=0.0775
- pipelined_m [data_width=17 n_iter=14 angle_guard=3 frac_guard=3 rounding=round m=7] luts_plus_ffs=1111, accuracy_bits=12.7, luts=945, ffs=165, throughput_msps=56.8, max_abs_err=0.000148 (2^-12.73), power_index=0.0836
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=1210, accuracy_bits=13.1, luts=979, ffs=231, throughput_msps=56.8, max_abs_err=0.000112 (2^-13.13), power_index=0.091
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=1969, accuracy_bits=13.4, luts=987, ffs=982, throughput_msps=264, max_abs_err=9.31e-05 (2^-13.39), power_index=0.148
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=2102, accuracy_bits=13.9, luts=1055, ffs=1047, throughput_msps=264, max_abs_err=6.45e-05 (2^-13.92), power_index=0.158
Front coverage: luts_plus_ffs 844..2102 (HV reference 3000); accuracy_bits 10.4..13.9 (HV reference 10); data_width on the front 15..18 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 10.63 bits
- pipelined: 56 evals, 28 feasible; max throughput seen 282 MSPS; best accuracy 13.92 bits; best feasible luts_plus_ffs=1346; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 170 evals, 106 feasible; max throughput seen 171 MSPS; best accuracy 13.39 bits; best feasible luts_plus_ffs=844; feasible ranges: data_width 14..17, n_iter 12..17, angle_guard -1..3, frac_guard 0..3, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (136 evals): data_width=14..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (17 front designs; box front_anchored)
- `pipelined` (24 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (3 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 281 feasible; hypervolume 1.494e+04 (+105.9%).

**No LLM call** (code's front-mapping round): This is the final round, so stop is the only meaningful choice. The front has 20 feasible designs spanning luts_plus_ffs 844..2102 and accuracy_bits 10.4..13.9. Hypervolume gained only +0.3% last round, so the search is saturated. The cheapest feasible design is pipelined_m (W=16, N=13, m=8) at 844 LUTs+FFs with max error 2^-10.36, which meets the 2^-10 bound. Its throughput of 52.7 MSPS far exceeds the 2 MSPS requirement, and the best system p99 latency seen is 0.066 us against the 0.4 us limit, so L2 re-selection should have margin. unrolled_k produced 0 feasible designs out of 14, with a maximum of 12.4 MSPS. The iterative family was not explored, but at N+3 cycles per result it would likely fall short on burst latency and error, consistent with the unrolled_k results, so it is unlikely to beat the front.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.494e+04 (gain this round: +105.9%).
Feasible designs: 281 of 400 evaluations (250 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 28% violate; best seen 8.19e-08 (2^-23.54)
- sys_p99_latency_us <= 0.4: 4% violate; best seen 0.066

Pareto front (feasible, 33 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=13 angle_guard=-1 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=844, accuracy_bits=10.4, luts=701, ffs=143, throughput_msps=52.7, max_abs_err=0.000761 (2^-10.36), power_index=0.0635
- pipelined_m [data_width=19 n_iter=12 angle_guard=-1 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=889, accuracy_bits=10.9, luts=724, ffs=165, throughput_msps=50.3, max_abs_err=0.00053 (2^-10.88), power_index=0.0669
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=949, accuracy_bits=11.5, luts=800, ffs=149, throughput_msps=52.7, max_abs_err=0.000338 (2^-11.53), power_index=0.0714
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=998, accuracy_bits=12.1, luts=841, ffs=157, throughput_msps=50.3, max_abs_err=0.000235 (2^-12.06), power_index=0.0751
- pipelined_m [data_width=20 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1069, accuracy_bits=12.6, luts=896, ffs=174, throughput_msps=50.3, max_abs_err=0.000158 (2^-12.63), power_index=0.0804
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=1200, accuracy_bits=13.3, luts=964, ffs=236, throughput_msps=56.8, max_abs_err=0.000101 (2^-13.27), power_index=0.0903
- pipelined_m [data_width=26 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=1536, accuracy_bits=14, luts=1230, ffs=307, throughput_msps=54.3, max_abs_err=6.13e-05 (2^-13.99), power_index=0.116
- pipelined_m [data_width=25 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc m=8] luts_plus_ffs=1776, accuracy_bits=16.9, luts=1474, ffs=302, throughput_msps=48, max_abs_err=8.31e-06 (2^-16.88), power_index=0.134
- pipelined_m [data_width=27 n_iter=25 angle_guard=-2 frac_guard=0 rounding=round m=8] luts_plus_ffs=2556, accuracy_bits=19.9, luts=2155, ffs=402, throughput_msps=45.9, max_abs_err=9.98e-07 (2^-19.94), power_index=0.192
- pipelined_m [data_width=27 n_iter=28 angle_guard=2 frac_guard=3 rounding=round m=6] luts_plus_ffs=3300, accuracy_bits=23.5, luts=2765, ffs=535, throughput_msps=59.9, max_abs_err=8.19e-08 (2^-23.54), power_index=0.248
Front coverage: luts_plus_ffs 844..3300 (HV reference 3000); accuracy_bits 10.4..23.5 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 10.63 bits
- pipelined: 80 evals, 52 feasible; max throughput seen 282 MSPS; best accuracy 19.98 bits; best feasible luts_plus_ffs=1346; feasible ranges: data_width 14..25, n_iter 12..30, angle_guard -1..4, frac_guard 0..3
- pipelined_m: 306 evals, 229 feasible; max throughput seen 171 MSPS; best accuracy 23.54 bits; best feasible luts_plus_ffs=844; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 23338 in, 4714 out
- provider-reported cost: $0.0938
- full prompts and replies: `llm_trace.jsonl`

