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
`pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 841 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 287 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.36 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.00024 (2^-12.03) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 15.7 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.81e-05 (2^-14.07) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.81 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.4 dBc, SNR 81.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=0,rounding=trunc,m=4` | 841 | 287 | 93.6 | 6 | 1.36 | 0.00024 (2^-12.03) | 12.03 |
| 1 | `pipelined_m:data_width=18,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 855 | 289 | 93.6 | 6 | 1.38 | 0.000205 (2^-12.25) | 12.25 |
| 2 | `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 896 | 301 | 93.6 | 6 | 1.44 | 0.000166 (2^-12.55) | 12.55 |
| 3 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 906 | 295 | 93.6 | 6 | 1.45 | 0.00016 (2^-12.61) | 12.61 |
| 4 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=0,rounding=round,m=4` | 938 | 276 | 93.6 | 6 | 1.46 | 0.000139 (2^-12.81) | 12.81 |
| 5 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=4` | 941 | 285 | 93.6 | 6 | 1.48 | 0.00013 (2^-12.91) | 12.91 |
| 6 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 964 | 295 | 93.6 | 6 | 1.52 | 0.000117 (2^-13.06) | 13.06 |
| 7 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=3,rounding=round,m=4` | 1000 | 297 | 93.6 | 6 | 1.56 | 9.76e-05 (2^-13.32) | 13.32 |
| 8 | `pipelined_m:data_width=20,n_iter=15,angle_guard=3,frac_guard=0,rounding=trunc,m=4` | 1023 | 323 | 89.6 | 6 | 1.62 | 8.43e-05 (2^-13.53) | 13.53 |
| 9 | `pipelined_m:data_width=21,n_iter=15,angle_guard=-1,frac_guard=1,rounding=trunc,m=4` | 1038 | 327 | 93.6 | 6 | 1.64 | 7.85e-05 (2^-13.64) | 13.64 |
| 10 | `pipelined_m:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1102 | 309 | 93.6 | 6 | 1.7 | 5.17e-05 (2^-14.24) | 14.24 |
| 11 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=round,m=2` | 1118 | 589 | 164.4 | 10 | 2.05 | 5.03e-05 (2^-14.28) | 14.28 |
| 12 | `pipelined_m:data_width=25,n_iter=17,angle_guard=-2,frac_guard=1,rounding=trunc,m=3` | 1371 | 545 | 114.5 | 8 | 2.31 | 1.67e-05 (2^-15.87) | 15.87 |
| 13 | `pipelined_m:data_width=24,n_iter=18,angle_guard=-1,frac_guard=1,rounding=trunc,m=3` | 1420 | 531 | 114.5 | 8 | 2.35 | 9.83e-06 (2^-16.63) | 16.63 |
| 14 | `pipelined_m:data_width=21,n_iter=21,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1630 | 500 | 89.6 | 8 | 2.56 | 5.47e-06 (2^-17.48) | 17.48 |
| 15 | `pipelined_m:data_width=23,n_iter=21,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 1628 | 517 | 89.6 | 8 | 2.58 | 4.61e-06 (2^-17.73) | 17.73 |
| 16 | `pipelined_m:data_width=26,n_iter=21,angle_guard=0,frac_guard=2,rounding=trunc,m=3` | 1860 | 677 | 110.0 | 9 | 3.05 | 1.44e-06 (2^-19.40) | 19.40 |
| 17 | `pipelined_m:data_width=26,n_iter=21,angle_guard=0,frac_guard=1,rounding=round,m=3` | 1873 | 667 | 110.0 | 9 | 3.06 | 1.41e-06 (2^-19.44) | 19.44 |
| 18 | `pipelined_m:data_width=26,n_iter=21,angle_guard=1,frac_guard=1,rounding=round,m=3` | 1894 | 674 | 110.0 | 9 | 3.09 | 1.16e-06 (2^-19.72) | 19.72 |
| 19 | `pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 2022 | 757 | 110.0 | 10 | 3.34 | 6.35e-07 (2^-20.59) | 20.59 |
| 20 | `pipelined_m:data_width=28,n_iter=23,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 2208 | 829 | 105.9 | 10 | 3.66 | 3.01e-07 (2^-21.66) | 21.66 |
| 21 | `pipelined_m:data_width=26,n_iter=28,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 2566 | 967 | 110.0 | 12 | 4.25 | 2.9e-07 (2^-21.72) | 21.72 |
| 22 | `pipelined_m:data_width=26,n_iter=24,angle_guard=4,frac_guard=3,rounding=round,m=2` | 2338 | 1199 | 152.6 | 14 | 4.26 | 1.77e-07 (2^-22.43) | 22.43 |
| 23 | `pipelined_m:data_width=28,n_iter=28,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 2708 | 1023 | 105.9 | 12 | 4.49 | 1e-07 (2^-23.25) | 23.25 |
| 24 | `pipelined_m:data_width=28,n_iter=28,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 2737 | 1031 | 110.0 | 12 | 4.54 | 7.27e-08 (2^-23.71) | 23.71 |
| 25 | `pipelined_m:data_width=27,n_iter=30,angle_guard=3,frac_guard=2,rounding=round,m=3` | 2935 | 1011 | 110.0 | 12 | 4.75 | 6.73e-08 (2^-23.82) | 23.82 |
| 26 | `pipelined_m:data_width=28,n_iter=30,angle_guard=3,frac_guard=2,rounding=round,m=3` | 3028 | 1043 | 105.9 | 12 | 4.9 | 3.6e-08 (2^-24.73) | 24.73 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Throughput must be at least 32 results/us. Iterative and unrolled_k designs emit one result every several cycles, so they would need very high clocks and would also queue the 32-request burst. I am excluding them for now. The accuracy limit of 2^-12 implies roughly W 13-16 and N 12-14, so the first round searches a window around that with some headroom for the accuracy_bits objective. The two pipelined families split the budget evenly, and later rounds can narrow once the area and batch-latency trade-off shows which one wins.*)
- `pipelined` (50 evals): data_width=12..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle gives 32 results in about 32 cycles plus latency, so throughput >= 32 MSPS and the 0.44 us batch bound are plausible. The ranges sit around the 2^-12 error limit and extend slightly above it to cover the accuracy_bits objective.
- `pipelined_m` (50 evals): data_width=12..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages removes pipeline FFs, which lowers LUTs+FFs. It also cuts latency cycles, which helps the batch deadline. A small m keeps Fmax high enough for 32 results inside 0.44 us.

**Result (code):** 100 evaluations this round, 100 total; 45 feasible; hypervolume 5437 (n/a).

**LLM decision:** `refine` — The front is led by pipelined_m (1214 LUTs+FFs at 12.8 bits) and pipelined (2090 to 2269 at 13.6 to 14.3 bits). Throughput and sys_p99_batch_us are not binding (0% violate, best 0.158 us against a 0.44 us bound). The binding constraint is accuracy, with 55% violating max_abs_err. Feasible designs cluster at data_width 16..18, n_iter 14..17 and angle_guard -1..3. pipelined_m is the cheapest, and its feasible m is only 2..4, so larger m may cut FFs further; I will test m up to 8. Accuracy at the cheap end (12.8 bits) is already near the 12-bit floor, so the remaining gains are in area. I will narrow to data_width 14..18 and n_iter 12..17. iterative and unrolled_k are unexplored, but they accept one result every several cycles. The batch bound needs 32 results within 0.44 us, which favours one result per cycle. I give unrolled_k a small share with high k to check this, and drop iterative.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5437 (gain this round: n/a (first round)).
Feasible designs: 45 of 100 evaluations (33 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 55% violate; best seen 4.98e-05 (2^-14.29)
- sys_p99_batch_us <= 0.44: 0% violate; best seen 0.158

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1214, accuracy_bits=12.8, luts=938, ffs=276, throughput_msps=93.6, max_abs_err=0.000139 (2^-12.81), power_index=1.46
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.9, luts=941, ffs=285, throughput_msps=93.6, max_abs_err=0.00013 (2^-12.91), power_index=1.48
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1259, accuracy_bits=13.1, luts=964, ffs=295, throughput_msps=93.6, max_abs_err=0.000117 (2^-13.06), power_index=1.52
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1297, accuracy_bits=13.3, luts=1000, ffs=297, throughput_msps=93.6, max_abs_err=9.76e-05 (2^-13.32), power_index=1.56
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=2090, accuracy_bits=13.6, luts=1033, ffs=1057, throughput_msps=264, max_abs_err=8.08e-05 (2^-13.60), power_index=2.52
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=2122, accuracy_bits=13.8, luts=1048, ffs=1073, throughput_msps=264, max_abs_err=6.86e-05 (2^-13.83), power_index=2.55
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=2214, accuracy_bits=14.2, luts=1096, ffs=1118, throughput_msps=264, max_abs_err=5.44e-05 (2^-14.17), power_index=2.66
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts_plus_ffs=2269, accuracy_bits=14.3, luts=1139, ffs=1130, throughput_msps=264, max_abs_err=4.98e-05 (2^-14.29), power_index=2.73
Front coverage: luts_plus_ffs 1214..2269 (HV reference 4000); accuracy_bits 12.8..14.3 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- pipelined: 50 evals, 25 feasible; max throughput seen 282 MSPS; best accuracy 14.29 bits; best feasible luts_plus_ffs=1716; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 20 feasible; max throughput seen 178 MSPS; best accuracy 13.32 bits; best feasible luts_plus_ffs=1214; feasible ranges: data_width 16..17, n_iter 15..16, angle_guard 1..3, frac_guard 0..3, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined_m with a wider m range and a narrower width range, keep pipelined for the high-accuracy end, and probe unrolled_k cheaply.*)
- `pipelined_m` (55 evals): data_width=14..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Holds the cheapest front points; larger m and slightly narrower widths may reduce FFs while staying under 2^-12 error.
- `pipelined` (27 evals): data_width=15..18, n_iter=13..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Supplies the high-accuracy end of the front (up to 14.3 bits) and its best feasible area is 1716.
- `unrolled_k` (18 evals): data_width=14..18, n_iter=12..17, angle_guard=-2..4, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Small probe of the unexplored family at high k, to see whether it can meet the 32 MSPS and 0.44 us batch bounds at lower area.

**Result (code):** 100 evaluations this round, 200 total; 80 feasible; hypervolume 6169 (+13.5%).

**LLM decision:** `refine` — The front is dominated by pipelined_m, which holds 9 of the 11 points, and its cheapest point is 1127 LUTs+FFs at 12.0 bits. Plain pipelined has a best feasible area of 1716 and is dominated except at its 2269 corner. unrolled_k had 0 feasible designs (max 10.3 MSPS against the required 32), and iterative has the same one-result-every-several-cycles limit, so it cannot meet the throughput constraint and is not worth a budget share. Feasible pipelined_m designs only appear for m 2..4, data_width 16..18 and n_iter 14..17. Half of all evaluations violate the error bound, so the search should stay inside that region. The best 12-bit point already uses m=4 at 93.6 MSPS, so m=5 is a cheap probe of whether fewer registers still meet the 0.44 us batch bound. I will focus on data_width 15..18, n_iter 13..17 and frac_guard 0..3, probing for cheaper designs near the 2^-12 error edge and denser coverage up to about 14 bits. I will keep a small share for pipelined as a cross-check.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 6169 (gain this round: +13.5%).
Feasible designs: 80 of 200 evaluations (61 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 9% violate; best seen 282
- max_abs_err <= 0.000244141: 50% violate; best seen 4.98e-05 (2^-14.29)
- sys_p99_batch_us <= 0.44: 21% violate; best seen 0.158

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1127, accuracy_bits=12, luts=841, ffs=287, throughput_msps=93.6, max_abs_err=0.00024 (2^-12.03), power_index=1.36
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1143, accuracy_bits=12.3, luts=855, ffs=289, throughput_msps=93.6, max_abs_err=0.000205 (2^-12.25), power_index=1.38
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1196, accuracy_bits=12.6, luts=896, ffs=301, throughput_msps=93.6, max_abs_err=0.000166 (2^-12.55), power_index=1.44
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1201, accuracy_bits=12.6, luts=906, ffs=295, throughput_msps=93.6, max_abs_err=0.00016 (2^-12.61), power_index=1.45
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1214, accuracy_bits=12.8, luts=938, ffs=276, throughput_msps=93.6, max_abs_err=0.000139 (2^-12.81), power_index=1.46
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1259, accuracy_bits=13.1, luts=964, ffs=295, throughput_msps=93.6, max_abs_err=0.000117 (2^-13.06), power_index=1.52
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1297, accuracy_bits=13.3, luts=1000, ffs=297, throughput_msps=93.6, max_abs_err=9.76e-05 (2^-13.32), power_index=1.56
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1411, accuracy_bits=14.2, luts=1102, ffs=309, throughput_msps=93.6, max_abs_err=5.17e-05 (2^-14.24), power_index=1.7
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round m=2] luts_plus_ffs=1707, accuracy_bits=14.3, luts=1118, ffs=589, throughput_msps=164, max_abs_err=5.03e-05 (2^-14.28), power_index=2.05
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts_plus_ffs=2269, accuracy_bits=14.3, luts=1139, ffs=1130, throughput_msps=264, max_abs_err=4.98e-05 (2^-14.29), power_index=2.73
Front coverage: luts_plus_ffs 1127..2269 (HV reference 4000); accuracy_bits 12..14.3 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- unrolled_k: 18 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.66 bits
- pipelined: 77 evals, 46 feasible; max throughput seen 282 MSPS; best accuracy 14.29 bits; best feasible luts_plus_ffs=1716; feasible ranges: data_width 15..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 105 evals, 34 feasible; max throughput seen 178 MSPS; best accuracy 14.28 bits; best feasible luts_plus_ffs=1127; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard 0..3, frac_guard 0..3, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the pipelined_m region where feasible designs cluster and probe m=5 and smaller widths for lower area. Skip iterative and unrolled_k, which cannot reach 32 MSPS.*)
- `pipelined_m` (32 evals): data_width=15..18, n_iter=13..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=3..5. *Why:* Holds nearly all of the front; m 3..5 probes the area-saving edge of the latency bound, and a slightly lower data_width and n_iter probe cheaper designs near 12 bits.
- `pipelined` (8 evals): data_width=15..18, n_iter=13..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Feasible in 46 of 77 evals and sets the high-accuracy, high-throughput corner; a small share checks for dominating points.

**Result (code):** 40 evaluations this round, 240 total; 101 feasible; hypervolume 6169 (+0.0%).

**LLM decision:** `stop` — This is the final round, so stop is the only meaningful choice. The front has 11 feasible designs spanning luts_plus_ffs 1127..2269 and accuracy_bits 12..14.3, and hypervolume gain this round was +0.0%, so it has converged. The cheapest feasible design is pipelined_m with data_width=18, n_iter=14, m=4. It reaches 93.6 MSPS against the 32 MSPS requirement, has max_abs_err 0.00024 (2^-12.03) against a 0.000244 limit, and has the lowest area at 1127. The unrolled_k family produced 0 feasible designs out of 18, with a maximum of 10.3 MSPS, so it cannot meet the 32 MSPS throughput or the batch-latency requirement. The pipelined family's best feasible area is 1716, well above pipelined_m. The iterative family was not explored. At N+3 cycles per result it will have even lower throughput than unrolled_k, so it is very unlikely to meet the 32 MSPS and 0.44 us batch constraints. One caveat is that the selected design has very little accuracy margin (2^-12.03 versus the 2^-12 limit), but the next-cheapest front points (1143 and 1201) offer margin if it fails at L2.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 6169 (gain this round: +0.0%).
Feasible designs: 101 of 240 evaluations (72 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 282
- max_abs_err <= 0.000244141: 49% violate; best seen 4.98e-05 (2^-14.29)
- sys_p99_batch_us <= 0.44: 19% violate; best seen 0.158

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1127, accuracy_bits=12, luts=841, ffs=287, throughput_msps=93.6, max_abs_err=0.00024 (2^-12.03), power_index=1.36
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1143, accuracy_bits=12.3, luts=855, ffs=289, throughput_msps=93.6, max_abs_err=0.000205 (2^-12.25), power_index=1.38
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1196, accuracy_bits=12.6, luts=896, ffs=301, throughput_msps=93.6, max_abs_err=0.000166 (2^-12.55), power_index=1.44
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1201, accuracy_bits=12.6, luts=906, ffs=295, throughput_msps=93.6, max_abs_err=0.00016 (2^-12.61), power_index=1.45
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1214, accuracy_bits=12.8, luts=938, ffs=276, throughput_msps=93.6, max_abs_err=0.000139 (2^-12.81), power_index=1.46
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1259, accuracy_bits=13.1, luts=964, ffs=295, throughput_msps=93.6, max_abs_err=0.000117 (2^-13.06), power_index=1.52
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1297, accuracy_bits=13.3, luts=1000, ffs=297, throughput_msps=93.6, max_abs_err=9.76e-05 (2^-13.32), power_index=1.56
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1411, accuracy_bits=14.2, luts=1102, ffs=309, throughput_msps=93.6, max_abs_err=5.17e-05 (2^-14.24), power_index=1.7
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round m=2] luts_plus_ffs=1707, accuracy_bits=14.3, luts=1118, ffs=589, throughput_msps=164, max_abs_err=5.03e-05 (2^-14.28), power_index=2.05
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=1 rounding=round] luts_plus_ffs=2269, accuracy_bits=14.3, luts=1139, ffs=1130, throughput_msps=264, max_abs_err=4.98e-05 (2^-14.29), power_index=2.73
Front coverage: luts_plus_ffs 1127..2269 (HV reference 4000); accuracy_bits 12..14.3 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- unrolled_k: 18 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.66 bits
- pipelined: 85 evals, 48 feasible; max throughput seen 282 MSPS; best accuracy 14.29 bits; best feasible luts_plus_ffs=1716; feasible ranges: data_width 15..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 137 evals, 53 feasible; max throughput seen 178 MSPS; best accuracy 14.28 bits; best feasible luts_plus_ffs=1127; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard 0..3, frac_guard 0..3, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (146 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (10 front designs; box front_anchored)
- `pipelined` (14 evals): data_width=17..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 197 feasible; hypervolume 1.878e+04 (+204.4%).

**No LLM call** (code's front-mapping round): This is the final round, so stop is the only meaningful choice. The front has 11 feasible designs spanning luts_plus_ffs 1127..2269 and accuracy_bits 12..14.3, and hypervolume gain this round was +0.0%, so it has converged. The cheapest feasible design is pipelined_m with data_width=18, n_iter=14, m=4. It reaches 93.6 MSPS against the 32 MSPS requirement, has max_abs_err 0.00024 (2^-12.03) against a 0.000244 limit, and has the lowest area at 1127. The unrolled_k family produced 0 feasible designs out of 18, with a maximum of 10.3 MSPS, so it cannot meet the 32 MSPS throughput or the batch-latency requirement. The pipelined family's best feasible area is 1716, well above pipelined_m. The iterative family was not explored. At N+3 cycles per result it will have even lower throughput than unrolled_k, so it is very unlikely to meet the 32 MSPS and 0.44 us batch constraints. One caveat is that the selected design has very little accuracy margin (2^-12.03 versus the 2^-12 limit), but the next-cheapest front points (1143 and 1201) offer margin if it fails at L2.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.878e+04 (gain this round: +204.4%).
Feasible designs: 197 of 400 evaluations (160 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 4% violate; best seen 282
- max_abs_err <= 0.000244141: 32% violate; best seen 3.6e-08 (2^-24.73)
- sys_p99_batch_us <= 0.44: 26% violate; best seen 0.158

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1127, accuracy_bits=12, luts=841, ffs=287, throughput_msps=93.6, max_abs_err=0.00024 (2^-12.03), power_index=1.36
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1201, accuracy_bits=12.6, luts=906, ffs=295, throughput_msps=93.6, max_abs_err=0.00016 (2^-12.61), power_index=1.45
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1259, accuracy_bits=13.1, luts=964, ffs=295, throughput_msps=93.6, max_abs_err=0.000117 (2^-13.06), power_index=1.52
- pipelined_m [data_width=21 n_iter=15 angle_guard=-1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1365, accuracy_bits=13.6, luts=1038, ffs=327, throughput_msps=93.6, max_abs_err=7.85e-05 (2^-13.64), power_index=1.64
- pipelined_m [data_width=25 n_iter=17 angle_guard=-2 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1916, accuracy_bits=15.9, luts=1371, ffs=545, throughput_msps=114, max_abs_err=1.67e-05 (2^-15.87), power_index=2.31
- pipelined_m [data_width=21 n_iter=21 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=2131, accuracy_bits=17.5, luts=1630, ffs=500, throughput_msps=89.6, max_abs_err=5.47e-06 (2^-17.48), power_index=2.56
- pipelined_m [data_width=26 n_iter=21 angle_guard=0 frac_guard=1 rounding=round m=3] luts_plus_ffs=2539, accuracy_bits=19.4, luts=1873, ffs=667, throughput_msps=110, max_abs_err=1.41e-06 (2^-19.44), power_index=3.06
- pipelined_m [data_width=28 n_iter=23 angle_guard=3 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3037, accuracy_bits=21.7, luts=2208, ffs=829, throughput_msps=106, max_abs_err=3.01e-07 (2^-21.66), power_index=3.66
- pipelined_m [data_width=28 n_iter=28 angle_guard=3 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3731, accuracy_bits=23.3, luts=2708, ffs=1023, throughput_msps=106, max_abs_err=1e-07 (2^-23.25), power_index=4.49
- pipelined_m [data_width=28 n_iter=30 angle_guard=3 frac_guard=2 rounding=round m=3] luts_plus_ffs=4072, accuracy_bits=24.7, luts=3028, ffs=1043, throughput_msps=106, max_abs_err=3.6e-08 (2^-24.73), power_index=4.9
Front coverage: luts_plus_ffs 1127..4072 (HV reference 4000); accuracy_bits 12..24.7 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- unrolled_k: 18 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.66 bits
- pipelined: 99 evals, 62 feasible; max throughput seen 282 MSPS; best accuracy 22.78 bits; best feasible luts_plus_ffs=1716; feasible ranges: data_width 15..28, n_iter 14..30, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 283 evals, 135 feasible; max throughput seen 178 MSPS; best accuracy 24.73 bits; best feasible luts_plus_ffs=1127; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..3, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 23081 in, 5065 out
- provider-reported cost: $0.0968
- full prompts and replies: `llm_trace.jsonl`

