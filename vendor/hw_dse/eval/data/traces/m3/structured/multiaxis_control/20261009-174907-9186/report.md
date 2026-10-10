# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
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
`pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 847 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 274 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.35 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000225 (2^-12.12) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.68 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.4e-05 (2^-13.93) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.05 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.1 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 93.3 dBc, SNR 81.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=16,n_iter=15,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=15,angle_guard=4,frac_guard=4,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=4` | 847 | 274 | 93.6 | 6 | 1.35 | 0.000225 (2^-12.12) | 12.12 |
| 1 | `pipelined_m:data_width=16,n_iter=15,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 905 | 278 | 93.6 | 6 | 1.42 | 0.000203 (2^-12.27) | 12.27 |
| 2 | `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 896 | 301 | 93.6 | 6 | 1.44 | 0.000166 (2^-12.55) | 12.55 |
| 3 | `pipelined_m:data_width=18,n_iter=14,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 923 | 307 | 93.6 | 6 | 1.48 | 0.000151 (2^-12.69) | 12.69 |
| 4 | `pipelined_m:data_width=17,n_iter=15,angle_guard=4,frac_guard=4,rounding=trunc,m=4` | 1023 | 309 | 93.6 | 6 | 1.6 | 0.000101 (2^-13.27) | 13.27 |
| 5 | `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=4,rounding=trunc,m=3` | 1038 | 386 | 119.3 | 7 | 1.71 | 8.55e-05 (2^-13.51) | 13.51 |
| 6 | `pipelined_m:data_width=18,n_iter=15,angle_guard=4,frac_guard=4,rounding=round,m=4` | 1105 | 325 | 93.6 | 6 | 1.72 | 7.23e-05 (2^-13.76) | 13.76 |
| 7 | `pipelined_m:data_width=23,n_iter=15,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 1185 | 371 | 89.6 | 6 | 1.87 | 6.2e-05 (2^-13.98) | 13.98 |
| 8 | `pipelined_m:data_width=21,n_iter=16,angle_guard=0,frac_guard=0,rounding=round,m=3` | 1096 | 466 | 119.3 | 8 | 1.88 | 4.14e-05 (2^-14.56) | 14.56 |
| 9 | `pipelined_m:data_width=18,n_iter=18,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1243 | 377 | 93.6 | 7 | 1.95 | 3.49e-05 (2^-14.81) | 14.81 |
| 10 | `pipelined_m:data_width=21,n_iter=17,angle_guard=0,frac_guard=0,rounding=round,m=3` | 1169 | 466 | 119.3 | 8 | 1.97 | 2.7e-05 (2^-15.18) | 15.18 |
| 11 | `pipelined_m:data_width=18,n_iter=18,angle_guard=3,frac_guard=4,rounding=round,m=4` | 1315 | 393 | 93.6 | 7 | 2.06 | 2.42e-05 (2^-15.34) | 15.34 |
| 12 | `pipelined_m:data_width=18,n_iter=19,angle_guard=3,frac_guard=3,rounding=round,m=4` | 1352 | 385 | 93.6 | 7 | 2.09 | 2.16e-05 (2^-15.50) | 15.50 |
| 13 | `pipelined_m:data_width=18,n_iter=19,angle_guard=4,frac_guard=3,rounding=round,m=4` | 1371 | 390 | 93.6 | 7 | 2.12 | 1.91e-05 (2^-15.68) | 15.68 |
| 14 | `pipelined_m:data_width=24,n_iter=19,angle_guard=-2,frac_guard=1,rounding=round,m=4` | 1535 | 447 | 89.6 | 7 | 2.39 | 8.44e-06 (2^-16.86) | 16.86 |
| 15 | `pipelined_m:data_width=24,n_iter=20,angle_guard=-2,frac_guard=1,rounding=trunc,m=4` | 1567 | 445 | 89.6 | 7 | 2.42 | 7.23e-06 (2^-17.08) | 17.08 |
| 16 | `pipelined_m:data_width=24,n_iter=20,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 1647 | 463 | 89.6 | 7 | 2.54 | 3.57e-06 (2^-18.10) | 18.10 |
| 17 | `pipelined_m:data_width=24,n_iter=20,angle_guard=0,frac_guard=1,rounding=round,m=4` | 1658 | 457 | 89.6 | 7 | 2.55 | 3.53e-06 (2^-18.11) | 18.11 |
| 18 | `pipelined_m:data_width=25,n_iter=23,angle_guard=0,frac_guard=0,rounding=trunc,m=3` | 1883 | 712 | 114.5 | 10 | 3.12 | 1.65e-06 (2^-19.21) | 19.21 |
| 19 | `pipelined_m:data_width=26,n_iter=24,angle_guard=0,frac_guard=0,rounding=round,m=3` | 2041 | 739 | 114.5 | 10 | 3.35 | 6.15e-07 (2^-20.63) | 20.63 |
| 20 | `pipelined_m:data_width=26,n_iter=24,angle_guard=1,frac_guard=0,rounding=round,m=3` | 2065 | 747 | 110.0 | 10 | 3.38 | 4.29e-07 (2^-21.15) | 21.15 |
| 21 | `pipelined_m:data_width=27,n_iter=24,angle_guard=0,frac_guard=1,rounding=round,m=3` | 2219 | 781 | 110.0 | 10 | 3.61 | 3.47e-07 (2^-21.46) | 21.46 |
| 22 | `pipelined_m:data_width=28,n_iter=24,angle_guard=2,frac_guard=0,rounding=trunc,m=3` | 2235 | 807 | 110.0 | 10 | 3.66 | 2.61e-07 (2^-21.87) | 21.87 |
| 23 | `pipelined_m:data_width=28,n_iter=24,angle_guard=0,frac_guard=4,rounding=round,m=3` | 2439 | 850 | 105.9 | 10 | 3.96 | 2.07e-07 (2^-22.21) | 22.21 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are the burst requirement (32 results within 0.44 us => ~73 MSps effective during a tick) and max_abs_err <= 2^-12, with min luts_plus_ffs as the objective. Only the 1-result/cycle pipelined families give throughput = Fmax, so they clear the burst bound with large margin (utilisation ~16% at 200 MHz) and are the safe core of the front. iterative is excluded outright: N+3 cycles/result would need Fmax > 1 GHz to meet the burst, which is impossible here. unrolled_k is kept as a small probe because it is the only other family that could plausibly reach the throughput floor, but its burst margin is thin. data_width starts at 14 since the output LSB 2^-(W-2) must reach 2^-12; n_iter 10..20 covers convergence. Round 1 spends 50/35/15 across pipelined / pipelined_m / unrolled_k to map the area-accuracy trade-off broadly before narrowing.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* 1 result/cycle, so throughput_msps = Fmax and the 32-request burst finishes in ~32+latency cycles. This is the only family that comfortably clears both the 32 MSps throughput floor and the 0.44 us p99 batch bound (needs ~73 MSps effective during a burst) without relying on an optimistic L1 bound. data_width>=14 because LSB=2^-(W-2) must reach 2^-12; n_iter 10..20 covers the convergence needed for 12 accuracy bits. Primary family for the min-area / max-accuracy front.
- `pipelined_m` (35 evals): data_width=14..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Same 1 result/cycle throughput as pipelined (so it also clears the burst bound), but registering every m stages trades Fmax for fewer FFs. Since the objective is min luts_plus_ffs, this family is where the cheapest area points on the front are likely to live; m 2..8 spans the register-density trade-off.
- `unrolled_k` (15 evals): data_width=14..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* Small probe only. ceil(N/k)+3 cycles/result means the 32-request burst needs Fmax >= ~360 MHz at k=8 to hit 0.44 us, which is unlikely on Artix-7, so this family probably cannot meet the batch constraint. Kept at low share to confirm the boundary and to catch any low-area point that does clear the L1 bound.

**Result (code):** 100 evaluations this round, 100 total; 32 feasible; hypervolume 6759 (n/a).

**LLM decision:** `add_family` — The front is dominated by pipelined and pipelined_m, but the cheapest feasible design (1311 LUT+FF) sits at the accuracy floor (12.1 bits, barely above the 2^-12 constraint), and the selection rule is min luts_plus_ffs — so the low-area corner is where the win is, yet pipelined_m only reached 5 feasible designs in 35 evals with data_width capped at 16..17. The `iterative` family is unexplored and is the natural low-area candidate (shared datapath, no per-stage registers), so it may push luts_plus_ffs below 1311 while still meeting 32 MSPS (iterative at ~N+3 cycles/result can still exceed 32 MSPS at high Fmax). unrolled_k is already proven infeasible (0/15 feasible, max 12 MSPS), so I will not spend budget there. I'll explore iterative across its full ranges, plus a focused pipelined_m sweep around the cheap corner to densify the low-area end of the front.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6759 (gain this round: n/a (first round)).
Feasible designs: 32 of 100 evaluations (27 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 15% violate; best seen 273
- max_abs_err <= 0.000244141: 43% violate; best seen 2.02e-05 (2^-15.59)
- sys_p99_batch_us <= 0.44: 41% violate; best seen 0.154

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=1311, accuracy_bits=12.1, luts=841, ffs=470, throughput_msps=164, max_abs_err=0.000235 (2^-12.06), power_index=1.58
- pipelined_m [data_width=17 n_iter=14 angle_guard=4 frac_guard=4 rounding=trunc m=2] luts_plus_ffs=1471, accuracy_bits=12.6, luts=950, ffs=521, throughput_msps=164, max_abs_err=0.000162 (2^-12.59), power_index=1.77
- pipelined_m [data_width=16 n_iter=20 angle_guard=2 frac_guard=4 rounding=trunc m=4] luts_plus_ffs=1639, accuracy_bits=12.9, luts=1287, ffs=352, throughput_msps=93.6, max_abs_err=0.000127 (2^-12.95), power_index=1.97
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=1981, accuracy_bits=13.1, luts=979, ffs=1002, throughput_msps=264, max_abs_err=0.000112 (2^-13.13), power_index=2.38
- pipelined [data_width=16 n_iter=16 angle_guard=4 frac_guard=2 rounding=round] luts_plus_ffs=2030, accuracy_bits=13.2, luts=1019, ffs=1011, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=2.44
- pipelined_m [data_width=17 n_iter=20 angle_guard=2 frac_guard=4 rounding=trunc m=2] luts_plus_ffs=2059, accuracy_bits=13.8, luts=1347, ffs=712, throughput_msps=164, max_abs_err=7.18e-05 (2^-13.77), power_index=2.48
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=3 rounding=trunc] luts_plus_ffs=2310, accuracy_bits=14.3, luts=1143, ffs=1166, throughput_msps=257, max_abs_err=4.88e-05 (2^-14.32), power_index=2.78
- pipelined [data_width=20 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=2405, accuracy_bits=14.8, luts=1191, ffs=1215, throughput_msps=257, max_abs_err=3.59e-05 (2^-14.77), power_index=2.9
- pipelined [data_width=20 n_iter=16 angle_guard=4 frac_guard=4 rounding=trunc] luts_plus_ffs=2497, accuracy_bits=14.8, luts=1238, ffs=1259, throughput_msps=257, max_abs_err=3.48e-05 (2^-14.81), power_index=3.01
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=4 rounding=round] luts_plus_ffs=2599, accuracy_bits=15.6, luts=1310, ffs=1289, throughput_msps=257, max_abs_err=2.02e-05 (2^-15.59), power_index=3.13
Front coverage: luts_plus_ffs 1311..2599 (HV reference 4000); accuracy_bits 12.1..15.6 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.21 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 273 MSPS; best accuracy 15.59 bits; best feasible luts_plus_ffs=1891; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 35 evals, 5 feasible; max throughput seen 171 MSPS; best accuracy 15.09 bits; best feasible luts_plus_ffs=1311; feasible ranges: data_width 16..17, n_iter 14..20, angle_guard 2..4, frac_guard 1..4, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Add the unexplored iterative family to attack the min-luts_plus_ffs objective, and refine pipelined_m around its feasible low-area corner; skip unrolled_k which is already infeasible on throughput.*)
- `iterative` (60 evals): data_width=14..22, n_iter=12..24, angle_guard=0..4, frac_guard=1..4, rounding=trunc|round. *Why:* Unexplored family; shared datapath should give the lowest LUT+FF, and its throughput must be checked against the 32 MSPS floor.
- `pipelined_m` (40 evals): data_width=16..18, n_iter=14..20, angle_guard=2..4, frac_guard=1..4, rounding=trunc|round, m=2..4. *Why:* Densify the cheapest feasible corner (1311 LUT+FF at 12.1 bits) to find lower-area designs that still clear the 2^-12 error and 32 MSPS constraints.

**Result (code):** 100 evaluations this round, 200 total; 70 feasible; hypervolume 9250 (+36.9%).

**LLM decision:** `map_front` — The feasible front is entirely pipelined_m (43/75 feasible, best luts_plus_ffs=1122) with pipelined as the only other feasible family (27/50, best 1891) — iterative and unrolled_k are 0/75 feasible because their throughput caps at ~13 MSPS, far below the 32 MSPS constraint. The front covers only luts_plus_ffs 1122..1761 against an HV reference of 4000 and accuracy_bits 12.1..15.7, i.e. a narrow slice of both objective ranges, and data_width only 16..18 of the registry's 8..28. With 200 of 400 evals left and the front still gaining (+36.9% HV this round), the best use of this round is a code-driven NSGA-II coverage search over the full ranges of pipelined and pipelined_m, seeded with the current front, to fill in the low-area and high-accuracy ends before the reserved final mapping round.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9250 (gain this round: +36.9%).
Feasible designs: 70 of 200 evaluations (62 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 38% violate; best seen 273
- max_abs_err <= 0.000244141: 28% violate; best seen 2.72e-06 (2^-18.49)
- sys_p99_batch_us <= 0.44: 50% violate; best seen 0.154

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1122, accuracy_bits=12.1, luts=847, ffs=274, throughput_msps=93.6, max_abs_err=0.000225 (2^-12.12), power_index=1.35
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1196, accuracy_bits=12.6, luts=896, ffs=301, throughput_msps=93.6, max_abs_err=0.000166 (2^-12.55), power_index=1.44
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1230, accuracy_bits=12.7, luts=923, ffs=307, throughput_msps=93.6, max_abs_err=0.000151 (2^-12.69), power_index=1.48
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=1424, accuracy_bits=13.5, luts=1038, ffs=386, throughput_msps=119, max_abs_err=8.55e-05 (2^-13.51), power_index=1.71
- pipelined_m [data_width=18 n_iter=15 angle_guard=4 frac_guard=4 rounding=round m=4] luts_plus_ffs=1430, accuracy_bits=13.8, luts=1105, ffs=325, throughput_msps=93.6, max_abs_err=7.23e-05 (2^-13.76), power_index=1.72
- pipelined_m [data_width=18 n_iter=18 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1577, accuracy_bits=14.5, luts=1208, ffs=369, throughput_msps=93.6, max_abs_err=4.46e-05 (2^-14.45), power_index=1.9
- pipelined_m [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1621, accuracy_bits=14.8, luts=1243, ffs=377, throughput_msps=93.6, max_abs_err=3.49e-05 (2^-14.81), power_index=1.95
- pipelined_m [data_width=18 n_iter=18 angle_guard=3 frac_guard=4 rounding=round m=4] luts_plus_ffs=1709, accuracy_bits=15.3, luts=1315, ffs=393, throughput_msps=93.6, max_abs_err=2.42e-05 (2^-15.34), power_index=2.06
- pipelined_m [data_width=18 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1737, accuracy_bits=15.5, luts=1352, ffs=385, throughput_msps=93.6, max_abs_err=2.16e-05 (2^-15.50), power_index=2.09
- pipelined_m [data_width=18 n_iter=19 angle_guard=4 frac_guard=3 rounding=round m=4] luts_plus_ffs=1761, accuracy_bits=15.7, luts=1371, ffs=390, throughput_msps=93.6, max_abs_err=1.91e-05 (2^-15.68), power_index=2.12
Front coverage: luts_plus_ffs 1122..1761 (HV reference 4000); accuracy_bits 12.1..15.7 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 60 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 18.49 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.21 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 273 MSPS; best accuracy 15.59 bits; best feasible luts_plus_ffs=1891; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 75 evals, 43 feasible; max throughput seen 171 MSPS; best accuracy 15.68 bits; best feasible luts_plus_ffs=1122; feasible ranges: data_width 16..18, n_iter 14..20, angle_guard 2..4, frac_guard 1..4, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (12 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 91 feasible; hypervolume 1.757e+04 (+90.0%).

**LLM decision:** `map_front` — The feasible front is entirely pipelined_m (19 designs, 1122..3289 LUT+FF vs HV ref 4000; 12.1..22.2 accuracy bits vs ref 12), so the area axis is only covered to ~82% of the reference and the explored pipelined_m box (data_width 16..28, n_iter 14..28, m 2..4) leaves m 5..8, n_iter 29..30, data_width 8..15 and angle_guard -2 untested. The selection rule (min luts_plus_ffs) lands on the cheapest design (1122, 12.1 bits, 93.6 MSPS), which is exactly the corner most exposed to the L2 system re-selection: 32 requests at 93.6 MSPS plus ~6-cycle latency is close to the 0.44 us batch budget, while the only higher-throughput feasible family (pipelined, 273 MSPS) costs 1891 LUT+FF. With 160 of 400 evals left and one round remaining, the best use is the reserved coverage pass: NSGA-II over the full registry ranges of the front families (pipelined_m, plus pipelined as its m=1 limit), seeded with the current front, to densify the cheap end with throughput headroom and extend the high-accuracy tail toward the 4000 area reference.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.757e+04 (gain this round: +90.0%).
Feasible designs: 91 of 240 evaluations (79 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 31% violate; best seen 273
- max_abs_err <= 0.000244141: 26% violate; best seen 7.03e-08 (2^-23.76)
- sys_p99_batch_us <= 0.44: 48% violate; best seen 0.154

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1122, accuracy_bits=12.1, luts=847, ffs=274, throughput_msps=93.6, max_abs_err=0.000225 (2^-12.12), power_index=1.35
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1230, accuracy_bits=12.7, luts=923, ffs=307, throughput_msps=93.6, max_abs_err=0.000151 (2^-12.69), power_index=1.48
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=1424, accuracy_bits=13.5, luts=1038, ffs=386, throughput_msps=119, max_abs_err=8.55e-05 (2^-13.51), power_index=1.71
- pipelined_m [data_width=21 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1562, accuracy_bits=14.6, luts=1096, ffs=466, throughput_msps=119, max_abs_err=4.14e-05 (2^-14.56), power_index=1.88
- pipelined_m [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1635, accuracy_bits=15.2, luts=1169, ffs=466, throughput_msps=119, max_abs_err=2.7e-05 (2^-15.18), power_index=1.97
- pipelined_m [data_width=18 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1737, accuracy_bits=15.5, luts=1352, ffs=385, throughput_msps=93.6, max_abs_err=2.16e-05 (2^-15.50), power_index=2.09
- pipelined_m [data_width=21 n_iter=24 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=2285, accuracy_bits=15.8, luts=1678, ffs=607, throughput_msps=119, max_abs_err=1.79e-05 (2^-15.77), power_index=2.75
- pipelined_m [data_width=26 n_iter=24 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=2780, accuracy_bits=20.6, luts=2041, ffs=739, throughput_msps=114, max_abs_err=6.15e-07 (2^-20.63), power_index=3.35
- pipelined_m [data_width=27 n_iter=24 angle_guard=0 frac_guard=1 rounding=round m=3] luts_plus_ffs=3000, accuracy_bits=21.5, luts=2219, ffs=781, throughput_msps=110, max_abs_err=3.47e-07 (2^-21.46), power_index=3.61
- pipelined_m [data_width=28 n_iter=24 angle_guard=0 frac_guard=4 rounding=round m=3] luts_plus_ffs=3289, accuracy_bits=22.2, luts=2439, ffs=850, throughput_msps=106, max_abs_err=2.07e-07 (2^-22.21), power_index=3.96
Front coverage: luts_plus_ffs 1122..3289 (HV reference 4000); accuracy_bits 12.1..22.2 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 60 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 18.49 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.21 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 273 MSPS; best accuracy 15.59 bits; best feasible luts_plus_ffs=1891; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 115 evals, 64 feasible; max throughput seen 171 MSPS; best accuracy 23.76 bits; best feasible luts_plus_ffs=1122; feasible ranges: data_width 16..28, n_iter 14..28, angle_guard -1..4, frac_guard 0..4, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (19 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 141 feasible; hypervolume 1.89e+04 (+7.6%).

**LLM decision:** `stop` — This is the final round, and the front is feasible and healthy: 141 of 340 evaluations (125 unique) satisfy all three constraints, with best-seen values well inside them (throughput 273 >= 32 MSPS, max_abs_err 7.03e-08 <= 2.44e-04, sys_p99_batch_us 0.154 <= 0.44). The Pareto front spans luts_plus_ffs 1122..3289 against HV ref 4000 and accuracy_bits 12.1..22.2 against HV ref 12, giving HV 1.89e+04 with a +7.6% gain this round. All four families have been explored (none remaining), and the front is dominated by pipelined_m (114 feasible, best luts_plus_ffs=1122, best accuracy 23.76 bits) with pipelined contributing 27 feasible designs; iterative and unrolled_k are infeasible on throughput (max 12.9 and 12 MSPS), so no unexplored family can improve coverage. The selection rule (min luts_plus_ffs) is already served by the front's cheapest design (pipelined_m, data_width=16, n_iter=14, angle_guard=3, frac_guard=1, rounding=round, m=4 at luts_plus_ffs=1122, accuracy 12.1 bits, throughput 93.6 MSPS). No constraint is unreachable, so infeasible is not warranted; stopping is the correct terminal action.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.89e+04 (gain this round: +7.6%).
Feasible designs: 141 of 340 evaluations (125 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 22% violate; best seen 273
- max_abs_err <= 0.000244141: 24% violate; best seen 7.03e-08 (2^-23.76)
- sys_p99_batch_us <= 0.44: 44% violate; best seen 0.154

Pareto front (feasible, 24 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1122, accuracy_bits=12.1, luts=847, ffs=274, throughput_msps=93.6, max_abs_err=0.000225 (2^-12.12), power_index=1.35
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1230, accuracy_bits=12.7, luts=923, ffs=307, throughput_msps=93.6, max_abs_err=0.000151 (2^-12.69), power_index=1.48
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=1424, accuracy_bits=13.5, luts=1038, ffs=386, throughput_msps=119, max_abs_err=8.55e-05 (2^-13.51), power_index=1.71
- pipelined_m [data_width=21 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1562, accuracy_bits=14.6, luts=1096, ffs=466, throughput_msps=119, max_abs_err=4.14e-05 (2^-14.56), power_index=1.88
- pipelined_m [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1635, accuracy_bits=15.2, luts=1169, ffs=466, throughput_msps=119, max_abs_err=2.7e-05 (2^-15.18), power_index=1.97
- pipelined_m [data_width=18 n_iter=19 angle_guard=4 frac_guard=3 rounding=round m=4] luts_plus_ffs=1761, accuracy_bits=15.7, luts=1371, ffs=390, throughput_msps=93.6, max_abs_err=1.91e-05 (2^-15.68), power_index=2.12
- pipelined_m [data_width=24 n_iter=20 angle_guard=-2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=2012, accuracy_bits=17.1, luts=1567, ffs=445, throughput_msps=89.6, max_abs_err=7.23e-06 (2^-17.08), power_index=2.42
- pipelined_m [data_width=25 n_iter=23 angle_guard=0 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=2595, accuracy_bits=19.2, luts=1883, ffs=712, throughput_msps=114, max_abs_err=1.65e-06 (2^-19.21), power_index=3.12
- pipelined_m [data_width=26 n_iter=24 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=2812, accuracy_bits=21.2, luts=2065, ffs=747, throughput_msps=110, max_abs_err=4.29e-07 (2^-21.15), power_index=3.38
- pipelined_m [data_width=28 n_iter=24 angle_guard=0 frac_guard=4 rounding=round m=3] luts_plus_ffs=3289, accuracy_bits=22.2, luts=2439, ffs=850, throughput_msps=106, max_abs_err=2.07e-07 (2^-22.21), power_index=3.96
Front coverage: luts_plus_ffs 1122..3289 (HV reference 4000); accuracy_bits 12.1..22.2 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 60 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 18.49 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.21 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 273 MSPS; best accuracy 15.59 bits; best feasible luts_plus_ffs=1891; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 215 evals, 114 feasible; max throughput seen 171 MSPS; best accuracy 23.76 bits; best feasible luts_plus_ffs=1122; feasible ranges: data_width 15..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (24 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 164 feasible; hypervolume 1.89e+04 (+0.0%).

**No LLM call** (code's front-mapping round): This is the final round, and the front is feasible and healthy: 141 of 340 evaluations (125 unique) satisfy all three constraints, with best-seen values well inside them (throughput 273 >= 32 MSPS, max_abs_err 7.03e-08 <= 2.44e-04, sys_p99_batch_us 0.154 <= 0.44). The Pareto front spans luts_plus_ffs 1122..3289 against HV ref 4000 and accuracy_bits 12.1..22.2 against HV ref 12, giving HV 1.89e+04 with a +7.6% gain this round. All four families have been explored (none remaining), and the front is dominated by pipelined_m (114 feasible, best luts_plus_ffs=1122, best accuracy 23.76 bits) with pipelined contributing 27 feasible designs; iterative and unrolled_k are infeasible on throughput (max 12.9 and 12 MSPS), so no unexplored family can improve coverage. The selection rule (min luts_plus_ffs) is already served by the front's cheapest design (pipelined_m, data_width=16, n_iter=14, angle_guard=3, frac_guard=1, rounding=round, m=4 at luts_plus_ffs=1122, accuracy 12.1 bits, throughput 93.6 MSPS). No constraint is unreachable, so infeasible is not warranted; stopping is the correct terminal action.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.89e+04 (gain this round: +0.0%).
Feasible designs: 164 of 400 evaluations (145 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 19% violate; best seen 273
- max_abs_err <= 0.000244141: 22% violate; best seen 7.03e-08 (2^-23.76)
- sys_p99_batch_us <= 0.44: 46% violate; best seen 0.154

Pareto front (feasible, 24 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1122, accuracy_bits=12.1, luts=847, ffs=274, throughput_msps=93.6, max_abs_err=0.000225 (2^-12.12), power_index=1.35
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1230, accuracy_bits=12.7, luts=923, ffs=307, throughput_msps=93.6, max_abs_err=0.000151 (2^-12.69), power_index=1.48
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=1424, accuracy_bits=13.5, luts=1038, ffs=386, throughput_msps=119, max_abs_err=8.55e-05 (2^-13.51), power_index=1.71
- pipelined_m [data_width=21 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1562, accuracy_bits=14.6, luts=1096, ffs=466, throughput_msps=119, max_abs_err=4.14e-05 (2^-14.56), power_index=1.88
- pipelined_m [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1635, accuracy_bits=15.2, luts=1169, ffs=466, throughput_msps=119, max_abs_err=2.7e-05 (2^-15.18), power_index=1.97
- pipelined_m [data_width=18 n_iter=19 angle_guard=4 frac_guard=3 rounding=round m=4] luts_plus_ffs=1761, accuracy_bits=15.7, luts=1371, ffs=390, throughput_msps=93.6, max_abs_err=1.91e-05 (2^-15.68), power_index=2.12
- pipelined_m [data_width=24 n_iter=20 angle_guard=-2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=2012, accuracy_bits=17.1, luts=1567, ffs=445, throughput_msps=89.6, max_abs_err=7.23e-06 (2^-17.08), power_index=2.42
- pipelined_m [data_width=25 n_iter=23 angle_guard=0 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=2595, accuracy_bits=19.2, luts=1883, ffs=712, throughput_msps=114, max_abs_err=1.65e-06 (2^-19.21), power_index=3.12
- pipelined_m [data_width=26 n_iter=24 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=2812, accuracy_bits=21.2, luts=2065, ffs=747, throughput_msps=110, max_abs_err=4.29e-07 (2^-21.15), power_index=3.38
- pipelined_m [data_width=28 n_iter=24 angle_guard=0 frac_guard=4 rounding=round m=3] luts_plus_ffs=3289, accuracy_bits=22.2, luts=2439, ffs=850, throughput_msps=106, max_abs_err=2.07e-07 (2^-22.21), power_index=3.96
Front coverage: luts_plus_ffs 1122..3289 (HV reference 4000); accuracy_bits 12.1..22.2 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 60 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 18.49 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.21 bits
- pipelined: 50 evals, 27 feasible; max throughput seen 273 MSPS; best accuracy 15.59 bits; best feasible luts_plus_ffs=1891; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 275 evals, 137 feasible; max throughput seen 171 MSPS; best accuracy 23.76 bits; best feasible luts_plus_ffs=1122; feasible ranges: data_width 15..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 18611 in, 7189 out
- provider-reported cost: $0.0086
- full prompts and replies: `llm_trace.jsonl`

