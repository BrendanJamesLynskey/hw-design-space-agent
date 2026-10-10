# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec multiaxis_control: Shared sin/cos unit for a 16-axis motor-control loop: a 1 MHz control tick issues 32 requests at once (Park + inverse Park per axis); all 32 results must be back within 0.44 us of the tick (p99 over ticks). Max error <= 2^-12. Minimise LUTs + FFs.
  constraint: throughput_msps >= 32
  constraint: max_abs_err <= 0.000244141
  constraint: sys_p99_batch_us <= 0.44
  objective: min luts_plus_ffs (HV ref 4000)
  objective: max accuracy_bits (HV ref 12)
  select: min luts_plus_ffs
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average)
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 800 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 272 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 61.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.29 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000204 (2^-12.26) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.67 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 6.07e-05 (2^-14.01) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.99 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 94.9 dBc, SNR 81.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 800 | 272 | 97.8 | 6 | 1.29 | 0.000204 (2^-12.26) | 12.26 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 863 | 280 | 97.8 | 6 | 1.38 | 0.000192 (2^-12.35) | 12.35 |
| 2 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 868 | 293 | 93.6 | 6 | 1.4 | 0.000172 (2^-12.50) | 12.50 |
| 3 | `pipelined_m:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 868 | 297 | 93.6 | 6 | 1.4 | 0.000164 (2^-12.57) | 12.57 |
| 4 | `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 882 | 301 | 93.6 | 6 | 1.42 | 0.000145 (2^-12.76) | 12.76 |
| 5 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=0,rounding=round,m=4` | 935 | 297 | 93.6 | 6 | 1.48 | 0.000108 (2^-13.18) | 13.18 |
| 6 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 964 | 303 | 93.6 | 6 | 1.52 | 0.000101 (2^-13.27) | 13.27 |
| 7 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 994 | 309 | 93.6 | 6 | 1.57 | 9.73e-05 (2^-13.33) | 13.33 |
| 8 | `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 1008 | 309 | 93.6 | 6 | 1.59 | 8.58e-05 (2^-13.51) | 13.51 |
| 9 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1051 | 354 | 93.6 | 7 | 1.69 | 7.75e-05 (2^-13.65) | 13.65 |
| 10 | `pipelined_m:data_width=19,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1118 | 374 | 93.6 | 7 | 1.8 | 5.59e-05 (2^-14.13) | 14.13 |
| 11 | `pipelined_m:data_width=20,n_iter=16,angle_guard=0,frac_guard=0,rounding=round,m=3` | 1048 | 446 | 119.3 | 8 | 1.8 | 5.27e-05 (2^-14.21) | 14.21 |
| 12 | `pipelined_m:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1169 | 387 | 93.6 | 7 | 1.87 | 3.81e-05 (2^-14.68) | 14.68 |
| 13 | `pipelined_m:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1209 | 389 | 93.6 | 7 | 1.92 | 2.76e-05 (2^-15.14) | 15.14 |
| 14 | `pipelined_m:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1261 | 407 | 93.6 | 7 | 2.01 | 2.23e-05 (2^-15.45) | 15.45 |
| 15 | `pipelined_m:data_width=21,n_iter=19,angle_guard=3,frac_guard=4,rounding=trunc,m=4` | 1523 | 443 | 89.6 | 7 | 2.37 | 7.12e-06 (2^-17.10) | 17.10 |
| 16 | `pipelined_m:data_width=22,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc,m=3` | 1542 | 617 | 114.5 | 9 | 2.6 | 5.44e-06 (2^-17.49) | 17.49 |
| 17 | `pipelined_m:data_width=25,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc,m=4` | 1712 | 503 | 86.0 | 7 | 2.67 | 3.99e-06 (2^-17.93) | 17.93 |
| 18 | `pipelined_m:data_width=28,n_iter=20,angle_guard=-2,frac_guard=0,rounding=round,m=3` | 1767 | 685 | 110.0 | 9 | 2.95 | 2.26e-06 (2^-18.76) | 18.76 |
| 19 | `pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=0,rounding=round,m=3` | 1906 | 720 | 114.5 | 10 | 3.16 | 1.17e-06 (2^-19.70) | 19.70 |
| 20 | `pipelined_m:data_width=24,n_iter=24,angle_guard=4,frac_guard=1,rounding=round,m=3` | 2092 | 734 | 110.0 | 10 | 3.4 | 9.69e-07 (2^-19.98) | 19.98 |
| 21 | `pipelined_m:data_width=27,n_iter=23,angle_guard=2,frac_guard=0,rounding=round,m=3` | 2069 | 781 | 110.0 | 10 | 3.43 | 3.7e-07 (2^-21.37) | 21.37 |
| 22 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=0,rounding=round,m=3` | 2162 | 781 | 110.0 | 10 | 3.54 | 2.66e-07 (2^-21.84) | 21.84 |
| 23 | `pipelined_m:data_width=28,n_iter=24,angle_guard=0,frac_guard=2,rounding=round,m=3` | 2342 | 821 | 110.0 | 10 | 3.81 | 2.22e-07 (2^-22.11) | 22.11 |
| 24 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=4,rounding=trunc,m=3` | 2356 | 837 | 105.9 | 10 | 3.84 | 1.85e-07 (2^-22.36) | 22.36 |
| 25 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2413 | 839 | 105.9 | 10 | 3.92 | 1.68e-07 (2^-22.51) | 22.51 |
| 26 | `pipelined_m:data_width=27,n_iter=26,angle_guard=2,frac_guard=4,rounding=trunc,m=3` | 2561 | 936 | 105.9 | 11 | 4.21 | 1.13e-07 (2^-23.08) | 23.08 |
| 27 | `pipelined_m:data_width=27,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc,m=3` | 2793 | 1045 | 105.9 | 12 | 4.62 | 6.51e-08 (2^-23.87) | 23.87 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The batch deadline requires about 32 results in 0.44 us, roughly 73 results/us on average, plus pipeline latency. Iterative and unrolled_k designs need N/k+3 cycles per result, so they cannot meet throughput_msps >= 32 at plausible clocks, and I leave them out of this round. I search the two fully-pipelined families over the accuracy-feasible region (error <= 2^-12, which needs W of about 13 or more) and let NSGA-II trade area against accuracy. Later rounds can narrow the ranges on whichever family and parameters appear on the front.*)
- `pipelined` (50 evals): data_width=12..20, n_iter=9..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* It accepts one request per cycle, so all 32 results can drain quickly after the tick. The accuracy bound needs W of about 13 or more and N of about 10 or more, so the ranges are centred just above that, with some headroom to trace the accuracy_bits trade-off.
- `pipelined_m` (50 evals): data_width=12..20, n_iter=9..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every few stages removes flip-flops, which may lower LUTs + FFs, while still giving 1 result per cycle and fewer latency cycles. A small m should keep Fmax high enough for the 0.44 us batch window.

**Result (code):** 100 evaluations this round, 100 total; 55 feasible; hypervolume 8722 (n/a).

**LLM decision:** `refine` — The front is already good at the low-area end: pipelined_m reaches 1242 LUTs+FFs at 12.4 bits, and pipelined's best feasible is 1780. Constraints are not binding except accuracy (45% violate). Throughput and the batch bound have 0% violations, with best seen 282 MSPS and 0.15 us. Iterative and unrolled_k look unable to meet the throughput and batch constraints. The batch bound needs 32 results in 0.44 us (about 73 MSPS or more). Iterative takes N+3 cycles per result. Unrolled_k with k up to 8 still takes at least 5 cycles for N around 14-17, so at the Fmax these cost models give they fall short. I will not spend budget on them. The front only spans 1242..2012, and the 12..12.4 accuracy region near the reference is unexplored. The cheapest feasible designs sit at data_width 17-18, n_iter 14-17, small frac_guard, with m 3-4. I will probe smaller widths (15-18), n_iter 12-16 and larger m (3-6) to cut FFs. Throughput margin and batch latency have plenty of slack. I keep some pipelined budget at lower width as a check.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8722 (gain this round: n/a (first round)).
Feasible designs: 55 of 100 evaluations (41 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 45% violate; best seen 2.07e-05 (2^-15.56)
- sys_p99_batch_us <= 0.44: 0% violate; best seen 0.15

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1242, accuracy_bits=12.4, luts=882, ffs=360, throughput_msps=119, max_abs_err=0.000186 (2^-12.40), power_index=1.5
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=2 rounding=round m=3] luts_plus_ffs=1282, accuracy_bits=12.4, luts=920, ffs=362, throughput_msps=119, max_abs_err=0.000179 (2^-12.45), power_index=1.54
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1359, accuracy_bits=13, luts=954, ffs=406, throughput_msps=124, max_abs_err=0.000121 (2^-13.02), power_index=1.64
- pipelined_m [data_width=18 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1361, accuracy_bits=13.1, luts=1017, ffs=344, throughput_msps=97.8, max_abs_err=0.000114 (2^-13.10), power_index=1.64
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1405, accuracy_bits=13.7, luts=1051, ffs=354, throughput_msps=93.6, max_abs_err=7.75e-05 (2^-13.65), power_index=1.69
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1494, accuracy_bits=14.2, luts=1048, ffs=446, throughput_msps=119, max_abs_err=5.27e-05 (2^-14.21), power_index=1.8
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=2 rounding=round m=3] luts_plus_ffs=1622, accuracy_bits=14.3, luts=1154, ffs=468, throughput_msps=119, max_abs_err=4.88e-05 (2^-14.32), power_index=1.95
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=1624, accuracy_bits=14.6, luts=1154, ffs=470, throughput_msps=119, max_abs_err=3.91e-05 (2^-14.64), power_index=1.95
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=2] luts_plus_ffs=1819, accuracy_bits=15.1, luts=1152, ffs=667, throughput_msps=164, max_abs_err=2.85e-05 (2^-15.10), power_index=2.19
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round m=2] luts_plus_ffs=2012, accuracy_bits=15.6, luts=1295, ffs=717, throughput_msps=158, max_abs_err=2.07e-05 (2^-15.56), power_index=2.42
Front coverage: luts_plus_ffs 1242..2012 (HV reference 4000); accuracy_bits 12.4..15.6 (HV reference 12); data_width on the front 18..20 (registry 8..28).

Per family:
- pipelined: 50 evals, 24 feasible; max throughput seen 282 MSPS; best accuracy 15.28 bits; best feasible luts_plus_ffs=1780; feasible ranges: data_width 15..19, n_iter 15..17, angle_guard -1..3, frac_guard 1..3
- pipelined_m: 50 evals, 31 feasible; max throughput seen 178 MSPS; best accuracy 15.56 bits; best feasible luts_plus_ffs=1242; feasible ranges: data_width 17..20, n_iter 14..17, angle_guard -1..3, frac_guard 0..3, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the low-area, near-threshold accuracy region of the pipelined families; iterative and unrolled_k cannot sustain the required burst throughput.*)
- `pipelined_m` (75 evals): data_width=15..19, n_iter=12..17, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=3..6. *Why:* Best family on the front; try smaller widths, fewer iterations and larger m to lower LUTs+FFs while keeping error at or below 2^-12.
- `pipelined` (25 evals): data_width=14..18, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Its feasible region is at smaller widths; check whether trimmed parameters can beat the 1242 front corner.

**Result (code):** 100 evaluations this round, 200 total; 94 feasible; hypervolume 9001 (+3.2%).

**LLM decision:** `refine` — Iterative and unrolled_k cannot meet the batch constraint, so I'm not adding them. The 32 requests arrive at once and must all be back within 0.44 us, which needs roughly 73 results/us. A shared datapath that takes N+3 cycles per result, or ceil(N/k)+3 even at k=8, would queue the burst well past 0.44 us. Pipelined and pipelined_m already run at 94-282 MSPS against a 32 MSPS floor, and the best sys_p99_batch_us seen is 0.15. The front is concentrated in pipelined_m with m=4. Its feasible m range is only 2..4, which suggests larger m fails the batch bound. The cheapest design sits at the accuracy floor (1127 LUT+FF, 12 bits), and the error constraint violates 45% of evaluations, so the area/accuracy boundary lies around data_width 17-19 and n_iter 13-15. Hypervolume is still gaining (+3.2%), so I'm refining. The plan spends most of the budget on pipelined_m with m limited to 3..4 and slightly lower data_width and n_iter, and gives a small share to pipelined as a cross-check. High-accuracy points can still come from the 15+ bit designs already found and from the final full-range front mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9001 (gain this round: +3.2%).
Feasible designs: 94 of 200 evaluations (70 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 45% violate; best seen 2.07e-05 (2^-15.56)
- sys_p99_batch_us <= 0.44: 10% violate; best seen 0.15

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1127, accuracy_bits=12, luts=841, ffs=287, throughput_msps=93.6, max_abs_err=0.00024 (2^-12.03), power_index=1.36
- pipelined_m [data_width=19 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1147, accuracy_bits=12.3, luts=855, ffs=293, throughput_msps=93.6, max_abs_err=0.000193 (2^-12.34), power_index=1.38
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1161, accuracy_bits=12.5, luts=868, ffs=293, throughput_msps=93.6, max_abs_err=0.000172 (2^-12.50), power_index=1.4
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1183, accuracy_bits=12.6, luts=882, ffs=301, throughput_msps=93.6, max_abs_err=0.000162 (2^-12.59), power_index=1.42
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1231, accuracy_bits=13, luts=935, ffs=297, throughput_msps=93.6, max_abs_err=0.000119 (2^-13.04), power_index=1.48
- pipelined_m [data_width=18 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1361, accuracy_bits=13.1, luts=1017, ffs=344, throughput_msps=97.8, max_abs_err=0.000114 (2^-13.10), power_index=1.64
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1405, accuracy_bits=13.7, luts=1051, ffs=354, throughput_msps=93.6, max_abs_err=7.75e-05 (2^-13.65), power_index=1.69
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1556, accuracy_bits=14.7, luts=1169, ffs=387, throughput_msps=93.6, max_abs_err=3.81e-05 (2^-14.68), power_index=1.87
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1598, accuracy_bits=15.1, luts=1209, ffs=389, throughput_msps=93.6, max_abs_err=2.76e-05 (2^-15.14), power_index=1.92
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round m=2] luts_plus_ffs=2012, accuracy_bits=15.6, luts=1295, ffs=717, throughput_msps=158, max_abs_err=2.07e-05 (2^-15.56), power_index=2.42
Front coverage: luts_plus_ffs 1127..2012 (HV reference 4000); accuracy_bits 12..15.6 (HV reference 12); data_width on the front 18..20 (registry 8..28).

Per family:
- pipelined: 75 evals, 26 feasible; max throughput seen 282 MSPS; best accuracy 15.28 bits; best feasible luts_plus_ffs=1780; feasible ranges: data_width 15..19, n_iter 15..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 125 evals, 68 feasible; max throughput seen 178 MSPS; best accuracy 15.56 bits; best feasible luts_plus_ffs=1127; feasible ranges: data_width 17..20, n_iter 14..17, angle_guard -1..3, frac_guard 0..3, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate evaluations on the low-area end of the pipelined_m front, where the selection rule picks, while keeping a small pipelined share for coverage.*)
- `pipelined_m` (32 evals): data_width=16..20, n_iter=12..17, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=3..4. *Why:* Holds the whole front; m=3..4 is the area-cheap region that still meets the 0.44 us batch bound, and slightly lower data_width and n_iter probe cheaper designs near the 2^-12 error limit.
- `pipelined` (8 evals): data_width=15..19, n_iter=13..17, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Best feasible area is 1780 versus 1127 for pipelined_m, so it is unlikely to reach the low-area corner. A small share keeps its feasible region (data_width 15..19, n_iter 15..17) covered in case it fills gaps.

**Result (code):** 40 evaluations this round, 240 total; 118 feasible; hypervolume 9191 (+2.1%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is allowed. The constraints are clearly reachable: 118 of 240 evaluations are feasible, and the front has 16 designs. The cheapest feasible design is pipelined_m at 1072 LUTs+FFs, which gives 12.3 accuracy bits, 97.8 MSPS and a max error of 2^-12.26. That meets the throughput constraint of 32 and the error bound, and the p99 batch constraint is met by 91% of evaluations (best 0.15 us against the 0.44 us limit). The last round gained only +2.1% hypervolume, so improvement is tapering. The front spans 1072..2012 LUTs+FFs and 12.3..15.6 accuracy bits, which covers the accuracy axis well. Iterative and unrolled_k were never explored, but they are unlikely to help. They issue one result every several cycles, and 32 requests must finish within 0.44 us of the tick. Their sys_p99_batch_us would very likely fail that bound. The selection rule picks the minimum-area design, the 1072 pipelined_m point, which has margin on every constraint.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9191 (gain this round: +2.1%).
Feasible designs: 118 of 240 evaluations (92 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 44% violate; best seen 2.07e-05 (2^-15.56)
- sys_p99_batch_us <= 0.44: 9% violate; best seen 0.15

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1072, accuracy_bits=12.3, luts=800, ffs=272, throughput_msps=97.8, max_abs_err=0.000204 (2^-12.26), power_index=1.29
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1161, accuracy_bits=12.5, luts=868, ffs=293, throughput_msps=93.6, max_abs_err=0.000172 (2^-12.50), power_index=1.4
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1165, accuracy_bits=12.6, luts=868, ffs=297, throughput_msps=93.6, max_abs_err=0.000164 (2^-12.57), power_index=1.4
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1231, accuracy_bits=13.2, luts=935, ffs=297, throughput_msps=93.6, max_abs_err=0.000108 (2^-13.18), power_index=1.48
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1302, accuracy_bits=13.3, luts=994, ffs=309, throughput_msps=93.6, max_abs_err=9.73e-05 (2^-13.33), power_index=1.57
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1317, accuracy_bits=13.5, luts=1008, ffs=309, throughput_msps=93.6, max_abs_err=8.58e-05 (2^-13.51), power_index=1.59
- pipelined_m [data_width=19 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1492, accuracy_bits=14.1, luts=1118, ffs=374, throughput_msps=93.6, max_abs_err=5.59e-05 (2^-14.13), power_index=1.8
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1556, accuracy_bits=14.7, luts=1169, ffs=387, throughput_msps=93.6, max_abs_err=3.81e-05 (2^-14.68), power_index=1.87
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1598, accuracy_bits=15.1, luts=1209, ffs=389, throughput_msps=93.6, max_abs_err=2.76e-05 (2^-15.14), power_index=1.92
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round m=2] luts_plus_ffs=2012, accuracy_bits=15.6, luts=1295, ffs=717, throughput_msps=158, max_abs_err=2.07e-05 (2^-15.56), power_index=2.42
Front coverage: luts_plus_ffs 1072..2012 (HV reference 4000); accuracy_bits 12.3..15.6 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- pipelined: 83 evals, 27 feasible; max throughput seen 282 MSPS; best accuracy 15.28 bits; best feasible luts_plus_ffs=1780; feasible ranges: data_width 15..19, n_iter 15..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 157 evals, 91 feasible; max throughput seen 178 MSPS; best accuracy 15.56 bits; best feasible luts_plus_ffs=1072; feasible ranges: data_width 17..20, n_iter 14..17, angle_guard -2..3, frac_guard 0..3, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (16 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 240 feasible; hypervolume 1.979e+04 (+115.3%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is allowed. The constraints are clearly reachable: 118 of 240 evaluations are feasible, and the front has 16 designs. The cheapest feasible design is pipelined_m at 1072 LUTs+FFs, which gives 12.3 accuracy bits, 97.8 MSPS and a max error of 2^-12.26. That meets the throughput constraint of 32 and the error bound, and the p99 batch constraint is met by 91% of evaluations (best 0.15 us against the 0.44 us limit). The last round gained only +2.1% hypervolume, so improvement is tapering. The front spans 1072..2012 LUTs+FFs and 12.3..15.6 accuracy bits, which covers the accuracy axis well. Iterative and unrolled_k were never explored, but they are unlikely to help. They issue one result every several cycles, and 32 requests must finish within 0.44 us of the tick. Their sys_p99_batch_us would very likely fail that bound. The selection rule picks the minimum-area design, the 1072 pipelined_m point, which has margin on every constraint.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.979e+04 (gain this round: +115.3%).
Feasible designs: 240 of 400 evaluations (206 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 29% violate; best seen 6.51e-08 (2^-23.87)
- sys_p99_batch_us <= 0.44: 14% violate; best seen 0.15

Pareto front (feasible, 28 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1072, accuracy_bits=12.3, luts=800, ffs=272, throughput_msps=97.8, max_abs_err=0.000204 (2^-12.26), power_index=1.29
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1165, accuracy_bits=12.6, luts=868, ffs=297, throughput_msps=93.6, max_abs_err=0.000164 (2^-12.57), power_index=1.4
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1267, accuracy_bits=13.3, luts=964, ffs=303, throughput_msps=93.6, max_abs_err=0.000101 (2^-13.27), power_index=1.52
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1405, accuracy_bits=13.7, luts=1051, ffs=354, throughput_msps=93.6, max_abs_err=7.75e-05 (2^-13.65), power_index=1.69
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1556, accuracy_bits=14.7, luts=1169, ffs=387, throughput_msps=93.6, max_abs_err=3.81e-05 (2^-14.68), power_index=1.87
- pipelined_m [data_width=21 n_iter=19 angle_guard=3 frac_guard=4 rounding=trunc m=4] luts_plus_ffs=1966, accuracy_bits=17.1, luts=1523, ffs=443, throughput_msps=89.6, max_abs_err=7.12e-06 (2^-17.10), power_index=2.37
- pipelined_m [data_width=28 n_iter=20 angle_guard=-2 frac_guard=0 rounding=round m=3] luts_plus_ffs=2452, accuracy_bits=18.8, luts=1767, ffs=685, throughput_msps=110, max_abs_err=2.26e-06 (2^-18.76), power_index=2.95
- pipelined_m [data_width=27 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=2849, accuracy_bits=21.4, luts=2069, ffs=781, throughput_msps=110, max_abs_err=3.7e-07 (2^-21.37), power_index=3.43
- pipelined_m [data_width=27 n_iter=24 angle_guard=2 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=3194, accuracy_bits=22.4, luts=2356, ffs=837, throughput_msps=106, max_abs_err=1.85e-07 (2^-22.36), power_index=3.84
- pipelined_m [data_width=27 n_iter=28 angle_guard=3 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=3839, accuracy_bits=23.9, luts=2793, ffs=1045, throughput_msps=106, max_abs_err=6.51e-08 (2^-23.87), power_index=4.62
Front coverage: luts_plus_ffs 1072..3839 (HV reference 4000); accuracy_bits 12.3..23.9 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- pipelined: 83 evals, 27 feasible; max throughput seen 282 MSPS; best accuracy 15.28 bits; best feasible luts_plus_ffs=1780; feasible ranges: data_width 15..19, n_iter 15..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 317 evals, 213 feasible; max throughput seen 178 MSPS; best accuracy 23.87 bits; best feasible luts_plus_ffs=1072; feasible ranges: data_width 16..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 23254 in, 5033 out
- provider-reported cost: $0.0968
- full prompts and replies: `llm_trace.jsonl`

