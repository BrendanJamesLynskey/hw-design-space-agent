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
`pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 834 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 270 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 61.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.33 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000209 (2^-12.22) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.43 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.44e-05 (2^-13.92) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.06 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.2 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 93.3 dBc, SNR 81.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` | 834 | 270 | 97.8 | 6 | 1.33 | 0.000209 (2^-12.22) | 12.22 |
| 1 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=4` | 876 | 276 | 93.6 | 6 | 1.39 | 0.000148 (2^-12.72) | 12.72 |
| 2 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 935 | 289 | 93.6 | 6 | 1.47 | 0.000143 (2^-12.77) | 12.77 |
| 3 | `pipelined_m:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=4` | 941 | 285 | 93.6 | 6 | 1.48 | 0.00013 (2^-12.91) | 12.91 |
| 4 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 964 | 303 | 93.6 | 6 | 1.52 | 0.000101 (2^-13.27) | 13.27 |
| 5 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 994 | 309 | 93.6 | 6 | 1.57 | 9.73e-05 (2^-13.33) | 13.33 |
| 6 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1017 | 297 | 93.6 | 6 | 1.58 | 8.82e-05 (2^-13.47) | 13.47 |
| 7 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round,m=4` | 1017 | 301 | 93.6 | 6 | 1.59 | 5.84e-05 (2^-14.06) | 14.06 |
| 8 | `pipelined_m:data_width=20,n_iter=16,angle_guard=0,frac_guard=0,rounding=round,m=4` | 1048 | 311 | 93.6 | 6 | 1.64 | 5.27e-05 (2^-14.21) | 14.21 |
| 9 | `pipelined_m:data_width=20,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1096 | 321 | 93.6 | 6 | 1.71 | 4.71e-05 (2^-14.37) | 14.37 |
| 10 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1112 | 325 | 93.6 | 6 | 1.73 | 4.27e-05 (2^-14.51) | 14.51 |
| 11 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1143 | 331 | 93.6 | 6 | 1.77 | 3.93e-05 (2^-14.63) | 14.63 |
| 12 | `pipelined_m:data_width=19,n_iter=16,angle_guard=4,frac_guard=2,rounding=round,m=4` | 1168 | 327 | 89.6 | 6 | 1.8 | 3.9e-05 (2^-14.64) | 14.64 |
| 13 | `pipelined_m:data_width=20,n_iter=17,angle_guard=2,frac_guard=3,rounding=round,m=4` | 1295 | 415 | 89.6 | 7 | 2.06 | 2.07e-05 (2^-15.56) | 15.56 |
| 14 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=3` | 1337 | 480 | 119.3 | 8 | 2.19 | 1.51e-05 (2^-16.01) | 16.01 |
| 15 | `pipelined_m:data_width=20,n_iter=19,angle_guard=2,frac_guard=4,rounding=round,m=4` | 1489 | 423 | 89.6 | 7 | 2.3 | 9.46e-06 (2^-16.69) | 16.69 |
| 16 | `pipelined_m:data_width=24,n_iter=20,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 1647 | 463 | 89.6 | 7 | 2.54 | 3.57e-06 (2^-18.10) | 18.10 |
| 17 | `pipelined_m:data_width=24,n_iter=20,angle_guard=0,frac_guard=2,rounding=round,m=4` | 1698 | 465 | 89.6 | 7 | 2.6 | 3.39e-06 (2^-18.17) | 18.17 |
| 18 | `pipelined_m:data_width=28,n_iter=20,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1927 | 542 | 86.0 | 7 | 2.97 | 1.93e-06 (2^-18.99) | 18.99 |
| 19 | `pipelined_m:data_width=27,n_iter=22,angle_guard=3,frac_guard=0,rounding=trunc,m=3` | 1997 | 789 | 110.0 | 10 | 3.35 | 7.09e-07 (2^-20.43) | 20.43 |
| 20 | `pipelined_m:data_width=27,n_iter=22,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2209 | 839 | 105.9 | 10 | 3.67 | 5.26e-07 (2^-20.86) | 20.86 |
| 21 | `pipelined_m:data_width=27,n_iter=23,angle_guard=3,frac_guard=4,rounding=trunc,m=3` | 2277 | 845 | 105.9 | 10 | 3.76 | 2.82e-07 (2^-21.76) | 21.76 |
| 22 | `pipelined_m:data_width=25,n_iter=28,angle_guard=3,frac_guard=4,rounding=round,m=3` | 2675 | 983 | 110.0 | 12 | 4.4 | 1.96e-07 (2^-22.29) | 22.29 |
| 23 | `pipelined_m:data_width=28,n_iter=30,angle_guard=4,frac_guard=4,rounding=trunc,m=3` | 3122 | 1088 | 105.9 | 12 | 5.07 | 2.61e-08 (2^-25.19) | 25.19 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 32 requests arrive at once and all results must be back within 0.44 us. The iterative and unrolled_k families accept one request every N/k+3 cycles or slower, so 32 requests would queue far beyond 0.44 us; I am leaving them out of round 1. That leaves the two one-result-per-cycle families, pipelined and pipelined_m. Max error <= 2^-12 means output LSB and CORDIC iterations must reach about 12+ bits. So I search data_width 13..20 and n_iter 11..18, which covers the minimum-area corner and some higher-accuracy points for the accuracy_bits objective. Guard-bit and rounding choices are left open for the optimizer to find the cheapest configuration that meets the error bound. Later rounds can narrow the ranges around the front found here.*)
- `pipelined_m` (58 evals): data_width=13..20, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Registers every m stages cut FFs, which should lower LUTs+FFs. It still issues one result per cycle, so 32 results take about 32 cycles plus a short latency, which the 0.44 us batch bound allows if Fmax holds up. The m range is searched in full to find where Fmax starts to break the bound.
- `pipelined` (42 evals): data_width=13..20, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* This is the m=1 baseline with the highest Fmax and one result per cycle. It is the safest family for the batch-latency constraint and anchors the front, but it has the most FFs.

**Result (code):** 100 evaluations this round, 100 total; 48 feasible; hypervolume 1.001e+04 (n/a).

**LLM decision:** `add_family` — The front spans luts_plus_ffs 1288..1817 and accuracy_bits 12.8..16, and only pipelined and pipelined_m have been tried. Every pipelined_m front point sits at m=3..4 with data_width 19..20, so m 5..8 is untested. Smaller data_width and n_iter 12..15 would be cheaper while still meeting max_abs_err <= 2^-12, since the accuracy constraint is violated by 38% of evaluations. Unrolled_k is the one family left that could be smaller, so it deserves a probe. The 32 MSPS throughput and 0.44 us batch bounds make it doubtful, because ceil(N/k)+3 cycles per result at the Fmax of a deep chain may fall short. Iterative needs N+3 cycles per result, which at N>=12 cannot reach 32 MSPS, so I skip it. Most of the budget goes to pipelined_m, where the cheapest points are.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.001e+04 (gain this round: n/a (first round)).
Feasible designs: 48 of 100 evaluations (40 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 273
- max_abs_err <= 0.000244141: 38% violate; best seen 1.51e-05 (2^-16.01)
- sys_p99_batch_us <= 0.44: 19% violate; best seen 0.163

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=20 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1288, accuracy_bits=12.8, luts=909, ffs=378, throughput_msps=119, max_abs_err=0.000138 (2^-12.82), power_index=1.55
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1302, accuracy_bits=13.3, luts=994, ffs=309, throughput_msps=93.6, max_abs_err=9.73e-05 (2^-13.33), power_index=1.57
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1335, accuracy_bits=13.6, luts=964, ffs=371, throughput_msps=119, max_abs_err=8.33e-05 (2^-13.55), power_index=1.61
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1359, accuracy_bits=14.2, luts=1048, ffs=311, throughput_msps=93.6, max_abs_err=5.27e-05 (2^-14.21), power_index=1.64
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1710, accuracy_bits=15.6, luts=1295, ffs=415, throughput_msps=89.6, max_abs_err=2.07e-05 (2^-15.56), power_index=2.06
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1817, accuracy_bits=16, luts=1337, ffs=480, throughput_msps=119, max_abs_err=1.51e-05 (2^-16.01), power_index=2.19
Front coverage: luts_plus_ffs 1288..1817 (HV reference 4000); accuracy_bits 12.8..16 (HV reference 12); data_width on the front 19..20 (registry 8..28).

Per family:
- pipelined: 42 evals, 23 feasible; max throughput seen 273 MSPS; best accuracy 14.77 bits; best feasible luts_plus_ffs=1689; feasible ranges: data_width 17..20, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 58 evals, 25 feasible; max throughput seen 171 MSPS; best accuracy 16.01 bits; best feasible luts_plus_ffs=1288; feasible ranges: data_width 17..20, n_iter 14..18, angle_guard -1..3, frac_guard 0..3, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined_m at lower width and larger m, probe unrolled_k cheaply, and keep a small pipelined share.*)
- `pipelined_m` (60 evals): data_width=14..20, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=round|trunc, m=3..8. *Why:* All six front points are pipelined_m with m 3..4; larger m saves FFs, and lower data_width/n_iter near the 2^-12 limit should cut LUTs.
- `unrolled_k` (20 evals): data_width=13..20, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Probe whether a shared multi-rotation datapath can meet 32 MSPS and the 0.44 us batch bound at lower area than the pipelines; high k keeps cycles per result lowest.
- `pipelined` (20 evals): data_width=14..19, n_iter=12..15, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Fully pipelined best is 1689 versus 1288 for pipelined_m; a smaller-width check keeps it as a comparison on the front.

**Result (code):** 100 evaluations this round, 200 total; 89 feasible; hypervolume 1.029e+04 (+2.7%).

**LLM decision:** `refine` — The only feasible families are pipelined_m (best feasible luts_plus_ffs 1104, 59 of 118 evals feasible) and pipelined (best 1689). unrolled_k had 0 feasible designs, with a maximum of 11.6 MSPS against the 32 MSPS requirement. Iterative is even slower (N+3 cycles per result), so it cannot return 32 results within 0.44 us and is not worth the budget. The front still gained 2.7% in round 2 and the cheapest point sits at 12.2 bits, close to the constraint edge. The area-minimising selection rule favours that low-width, low-iteration corner, so I will refine there: pipelined_m with data_width 14..18, n_iter 12..16 and m 3..6, since larger m cuts FFs while the batch time still has margin. I will keep a small share for pipelined as a check.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.029e+04 (gain this round: +2.7%).
Feasible designs: 89 of 200 evaluations (73 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 10% violate; best seen 273
- max_abs_err <= 0.000244141: 42% violate; best seen 1.51e-05 (2^-16.01)
- sys_p99_batch_us <= 0.44: 26% violate; best seen 0.163

Pareto front (feasible, 14 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=1.33
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1152, accuracy_bits=12.7, luts=876, ffs=276, throughput_msps=93.6, max_abs_err=0.000148 (2^-12.72), power_index=1.39
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.9, luts=941, ffs=285, throughput_msps=93.6, max_abs_err=0.00013 (2^-12.91), power_index=1.48
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1267, accuracy_bits=13.3, luts=964, ffs=303, throughput_msps=93.6, max_abs_err=0.000101 (2^-13.27), power_index=1.52
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1313, accuracy_bits=13.5, luts=1017, ffs=297, throughput_msps=93.6, max_abs_err=8.82e-05 (2^-13.47), power_index=1.58
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1318, accuracy_bits=14.1, luts=1017, ffs=301, throughput_msps=93.6, max_abs_err=5.84e-05 (2^-14.06), power_index=1.59
- pipelined_m [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1417, accuracy_bits=14.4, luts=1096, ffs=321, throughput_msps=93.6, max_abs_err=4.71e-05 (2^-14.37), power_index=1.71
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1437, accuracy_bits=14.5, luts=1112, ffs=325, throughput_msps=93.6, max_abs_err=4.27e-05 (2^-14.51), power_index=1.73
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1710, accuracy_bits=15.6, luts=1295, ffs=415, throughput_msps=89.6, max_abs_err=2.07e-05 (2^-15.56), power_index=2.06
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1817, accuracy_bits=16, luts=1337, ffs=480, throughput_msps=119, max_abs_err=1.51e-05 (2^-16.01), power_index=2.19
Front coverage: luts_plus_ffs 1104..1817 (HV reference 4000); accuracy_bits 12.2..16 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 14.28 bits
- pipelined: 62 evals, 30 feasible; max throughput seen 273 MSPS; best accuracy 14.77 bits; best feasible luts_plus_ffs=1689; feasible ranges: data_width 17..20, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 118 evals, 59 feasible; max throughput seen 171 MSPS; best accuracy 16.01 bits; best feasible luts_plus_ffs=1104; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard -1..3, frac_guard 0..3, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the low-area, 12 to 14 bit region where the selection rule picks, while widening m to find FF savings that stay within the 0.44 us batch bound.*)
- `pipelined_m` (32 evals): data_width=14..19, n_iter=12..17, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round, m=3..6. *Why:* All of the best front points are pipelined_m. Probing smaller width and iteration counts and larger m targets lower area near the 2^-12 error limit.
- `pipelined` (8 evals): data_width=14..18, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Check whether a fully pipelined design with a small width can undercut pipelined_m at about 12 bits.

**Result (code):** 40 evaluations this round, 240 total; 93 feasible; hypervolume 1.029e+04 (+0.0%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is allowed. The constraints are clearly reachable: the front has 14 feasible designs, and pipelined_m at data_width=16, n_iter=14, m=4 gives luts_plus_ffs=1104 with 12.2 accuracy bits, 97.8 MSPS and max error 2^-12.22. The last round added +0.0% hypervolume, so the search has stalled. The front spans 1104..1817 LUT+FF and 12.2..16 accuracy bits, with the cheapest design at the 12-bit accuracy floor. Unrolled_k gave 0 feasible designs, topping out at 11.6 MSPS, so it can't meet the 32 MSPS throughput constraint. The unexplored iterative family issues one result every N+3 cycles, so it should be even slower than unrolled_k and cannot reach the 32 results needed within 0.44 us. Selecting the minimum luts_plus_ffs design from the front gives the 1104 design for L2 system validation.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.029e+04 (gain this round: +0.0%).
Feasible designs: 93 of 240 evaluations (77 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 273
- max_abs_err <= 0.000244141: 47% violate; best seen 1.51e-05 (2^-16.01)
- sys_p99_batch_us <= 0.44: 28% violate; best seen 0.163

Pareto front (feasible, 14 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=1.33
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1152, accuracy_bits=12.7, luts=876, ffs=276, throughput_msps=93.6, max_abs_err=0.000148 (2^-12.72), power_index=1.39
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.9, luts=941, ffs=285, throughput_msps=93.6, max_abs_err=0.00013 (2^-12.91), power_index=1.48
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1267, accuracy_bits=13.3, luts=964, ffs=303, throughput_msps=93.6, max_abs_err=0.000101 (2^-13.27), power_index=1.52
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1313, accuracy_bits=13.5, luts=1017, ffs=297, throughput_msps=93.6, max_abs_err=8.82e-05 (2^-13.47), power_index=1.58
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1318, accuracy_bits=14.1, luts=1017, ffs=301, throughput_msps=93.6, max_abs_err=5.84e-05 (2^-14.06), power_index=1.59
- pipelined_m [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1417, accuracy_bits=14.4, luts=1096, ffs=321, throughput_msps=93.6, max_abs_err=4.71e-05 (2^-14.37), power_index=1.71
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1437, accuracy_bits=14.5, luts=1112, ffs=325, throughput_msps=93.6, max_abs_err=4.27e-05 (2^-14.51), power_index=1.73
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1710, accuracy_bits=15.6, luts=1295, ffs=415, throughput_msps=89.6, max_abs_err=2.07e-05 (2^-15.56), power_index=2.06
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1817, accuracy_bits=16, luts=1337, ffs=480, throughput_msps=119, max_abs_err=1.51e-05 (2^-16.01), power_index=2.19
Front coverage: luts_plus_ffs 1104..1817 (HV reference 4000); accuracy_bits 12.2..16 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 14.28 bits
- pipelined: 70 evals, 30 feasible; max throughput seen 273 MSPS; best accuracy 14.77 bits; best feasible luts_plus_ffs=1689; feasible ranges: data_width 17..20, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 150 evals, 63 feasible; max throughput seen 171 MSPS; best accuracy 16.01 bits; best feasible luts_plus_ffs=1104; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard -1..3, frac_guard 0..3, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (14 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 173 feasible; hypervolume 1.887e+04 (+83.5%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is allowed. The constraints are clearly reachable: the front has 14 feasible designs, and pipelined_m at data_width=16, n_iter=14, m=4 gives luts_plus_ffs=1104 with 12.2 accuracy bits, 97.8 MSPS and max error 2^-12.22. The last round added +0.0% hypervolume, so the search has stalled. The front spans 1104..1817 LUT+FF and 12.2..16 accuracy bits, with the cheapest design at the 12-bit accuracy floor. Unrolled_k gave 0 feasible designs, topping out at 11.6 MSPS, so it can't meet the 32 MSPS throughput constraint. The unexplored iterative family issues one result every N+3 cycles, so it should be even slower than unrolled_k and cannot reach the 32 results needed within 0.44 us. Selecting the minimum luts_plus_ffs design from the front gives the 1104 design for L2 system validation.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.887e+04 (gain this round: +83.5%).
Feasible designs: 173 of 400 evaluations (150 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 273
- max_abs_err <= 0.000244141: 38% violate; best seen 2.61e-08 (2^-25.19)
- sys_p99_batch_us <= 0.44: 29% violate; best seen 0.163

Pareto front (feasible, 24 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1104, accuracy_bits=12.2, luts=834, ffs=270, throughput_msps=97.8, max_abs_err=0.000209 (2^-12.22), power_index=1.33
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.9, luts=941, ffs=285, throughput_msps=93.6, max_abs_err=0.00013 (2^-12.91), power_index=1.48
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1302, accuracy_bits=13.3, luts=994, ffs=309, throughput_msps=93.6, max_abs_err=9.73e-05 (2^-13.33), power_index=1.57
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1359, accuracy_bits=14.2, luts=1048, ffs=311, throughput_msps=93.6, max_abs_err=5.27e-05 (2^-14.21), power_index=1.64
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1437, accuracy_bits=14.5, luts=1112, ffs=325, throughput_msps=93.6, max_abs_err=4.27e-05 (2^-14.51), power_index=1.73
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1710, accuracy_bits=15.6, luts=1295, ffs=415, throughput_msps=89.6, max_abs_err=2.07e-05 (2^-15.56), power_index=2.06
- pipelined_m [data_width=20 n_iter=19 angle_guard=2 frac_guard=4 rounding=round m=4] luts_plus_ffs=1912, accuracy_bits=16.7, luts=1489, ffs=423, throughput_msps=89.6, max_abs_err=9.46e-06 (2^-16.69), power_index=2.3
- pipelined_m [data_width=28 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2469, accuracy_bits=19, luts=1927, ffs=542, throughput_msps=86, max_abs_err=1.93e-06 (2^-18.99), power_index=2.97
- pipelined_m [data_width=27 n_iter=22 angle_guard=2 frac_guard=4 rounding=round m=3] luts_plus_ffs=3048, accuracy_bits=20.9, luts=2209, ffs=839, throughput_msps=106, max_abs_err=5.26e-07 (2^-20.86), power_index=3.67
- pipelined_m [data_width=28 n_iter=30 angle_guard=4 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=4210, accuracy_bits=25.2, luts=3122, ffs=1088, throughput_msps=106, max_abs_err=2.61e-08 (2^-25.19), power_index=5.07
Front coverage: luts_plus_ffs 1104..4210 (HV reference 4000); accuracy_bits 12.2..25.2 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 14.28 bits
- pipelined: 70 evals, 30 feasible; max throughput seen 273 MSPS; best accuracy 14.77 bits; best feasible luts_plus_ffs=1689; feasible ranges: data_width 17..20, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 310 evals, 143 feasible; max throughput seen 171 MSPS; best accuracy 25.19 bits; best feasible luts_plus_ffs=1104; feasible ranges: data_width 15..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 22881 in, 4872 out
- provider-reported cost: $0.0945
- full prompts and replies: `llm_trace.jsonl`

