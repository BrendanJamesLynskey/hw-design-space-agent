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
`pipelined_m:data_width=18,n_iter=15,angle_guard=0,frac_guard=3,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 979 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 301 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.54 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000134 (2^-12.86) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 8.81 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 3.11e-05 (2^-14.97) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 2.04 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.9 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 100.3 dBc, SNR 87.5 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=18,n_iter=15,angle_guard=0,frac_guard=3,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=20,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=4` | 0.4016 → 0.4126 | yes |
| `pipelined_m:data_width=20,n_iter=15,angle_guard=4,frac_guard=1,rounding=trunc,m=4` | 0.4016 → 0.4126 | yes |
| `pipelined_m:data_width=20,n_iter=16,angle_guard=4,frac_guard=1,rounding=round,m=4` | 0.4016 → 0.4126 | yes |
| `pipelined_m:data_width=20,n_iter=16,angle_guard=4,frac_guard=3,rounding=round,m=4` | 0.4016 → 0.4126 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (25 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=15,angle_guard=0,frac_guard=3,rounding=trunc,m=4` | 979 | 301 | 93.6 | 6 | 1.54 | 0.000134 (2^-12.86) | 12.86 |
| 1 | `pipelined_m:data_width=20,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=4` | 1020 | 331 | 89.6 | 6 | 1.63 | 0.000127 (2^-12.95) | 12.95 |
| 2 | `pipelined_m:data_width=20,n_iter=15,angle_guard=4,frac_guard=1,rounding=trunc,m=4` | 1067 | 333 | 89.6 | 6 | 1.69 | 7.32e-05 (2^-13.74) | 13.74 |
| 3 | `pipelined_m:data_width=20,n_iter=16,angle_guard=4,frac_guard=1,rounding=round,m=4` | 1185 | 335 | 89.6 | 6 | 1.83 | 3.77e-05 (2^-14.70) | 14.70 |
| 4 | `pipelined_m:data_width=20,n_iter=16,angle_guard=4,frac_guard=3,rounding=round,m=4` | 1249 | 347 | 89.6 | 6 | 1.92 | 3.34e-05 (2^-14.87) | 14.87 |
| 5 | `pipelined_m:data_width=20,n_iter=18,angle_guard=0,frac_guard=1,rounding=round,m=4` | 1266 | 388 | 93.6 | 7 | 1.99 | 3.08e-05 (2^-14.99) | 14.99 |
| 6 | `pipelined_m:data_width=22,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round,m=4` | 1277 | 408 | 93.6 | 7 | 2.03 | 1.85e-05 (2^-15.72) | 15.72 |
| 7 | `pipelined_m:data_width=22,n_iter=18,angle_guard=-1,frac_guard=1,rounding=round,m=4` | 1359 | 418 | 89.6 | 7 | 2.14 | 1.78e-05 (2^-15.77) | 15.77 |
| 8 | `pipelined_m:data_width=19,n_iter=19,angle_guard=3,frac_guard=3,rounding=round,m=4` | 1411 | 403 | 93.6 | 7 | 2.18 | 1.31e-05 (2^-16.22) | 16.22 |
| 9 | `pipelined_m:data_width=22,n_iter=18,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 1385 | 436 | 89.6 | 7 | 2.19 | 1.08e-05 (2^-16.50) | 16.50 |
| 10 | `pipelined_m:data_width=22,n_iter=19,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 1466 | 436 | 89.6 | 7 | 2.29 | 8.01e-06 (2^-16.93) | 16.93 |
| 11 | `pipelined_m:data_width=26,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1582 | 499 | 86.0 | 7 | 2.51 | 7.76e-06 (2^-16.98) | 16.98 |
| 12 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=1,rounding=round,m=3` | 1553 | 581 | 114.5 | 9 | 2.57 | 5.57e-06 (2^-17.45) | 17.45 |
| 13 | `pipelined_m:data_width=26,n_iter=20,angle_guard=3,frac_guard=1,rounding=trunc,m=4` | 1787 | 504 | 86.0 | 7 | 2.76 | 2.13e-06 (2^-18.84) | 18.84 |
| 14 | `pipelined_m:data_width=22,n_iter=22,angle_guard=4,frac_guard=2,rounding=round,m=4` | 1822 | 533 | 89.6 | 8 | 2.83 | 1.93e-06 (2^-18.98) | 18.98 |
| 15 | `pipelined_m:data_width=28,n_iter=20,angle_guard=3,frac_guard=2,rounding=round,m=3` | 2006 | 747 | 105.9 | 9 | 3.31 | 1.92e-06 (2^-18.99) | 18.99 |
| 16 | `pipelined_m:data_width=23,n_iter=22,angle_guard=2,frac_guard=2,rounding=round,m=2` | 1846 | 954 | 158.3 | 13 | 3.37 | 1.68e-06 (2^-19.19) | 19.19 |
| 17 | `pipelined_m:data_width=25,n_iter=26,angle_guard=1,frac_guard=0,rounding=round,m=4` | 2165 | 637 | 89.6 | 9 | 3.37 | 1.05e-06 (2^-19.86) | 19.86 |
| 18 | `pipelined_m:data_width=25,n_iter=24,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2263 | 787 | 110.0 | 10 | 3.67 | 3.58e-07 (2^-21.41) | 21.41 |
| 19 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2413 | 839 | 105.9 | 10 | 3.92 | 1.68e-07 (2^-22.51) | 22.51 |
| 20 | `pipelined_m:data_width=27,n_iter=27,angle_guard=2,frac_guard=1,rounding=round,m=3` | 2555 | 890 | 110.0 | 11 | 4.15 | 1.58e-07 (2^-22.59) | 22.59 |
| 21 | `pipelined_m:data_width=27,n_iter=26,angle_guard=1,frac_guard=4,rounding=round,m=3` | 2591 | 929 | 105.9 | 11 | 4.24 | 1.42e-07 (2^-22.75) | 22.75 |
| 22 | `pipelined_m:data_width=27,n_iter=26,angle_guard=3,frac_guard=4,rounding=round,m=3` | 2644 | 947 | 105.9 | 11 | 4.32 | 6.69e-08 (2^-23.83) | 23.83 |
| 23 | `pipelined_m:data_width=27,n_iter=26,angle_guard=4,frac_guard=4,rounding=round,m=3` | 2670 | 956 | 105.9 | 11 | 4.37 | 5.92e-08 (2^-24.01) | 24.01 |
| 24 | `pipelined_m:data_width=27,n_iter=29,angle_guard=3,frac_guard=4,rounding=round,m=3` | 2954 | 1047 | 105.9 | 12 | 4.82 | 4.54e-08 (2^-24.39) | 24.39 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The system constraint sys_p99_batch_us <= 0.44 for 32 simultaneous requests forces an effective throughput of at least 32/0.44us ≈ 72.7 Msps. Iterative and unrolled_k produce one result every several cycles, so they would need Fmax well above 300–1000 MHz to meet this batch deadline, which is not realistic on Artix-7. Therefore only the pipelined families (1 result/cycle) can plausibly satisfy the system constraint. Accuracy requires max_abs_err <= 2^-12, so data_width >= 14 and n_iter >= 10 are searched; the upper bounds allow the Pareto front to extend to higher accuracy. The two families are searched equally to map the area–accuracy trade-off, with pipelined_m expected to dominate on luts_plus_ffs if its Fmax remains sufficient.*)
- `pipelined` (50 evals): data_width=14..22, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Pipelined gives 1 result/cycle, so 32 requests complete in 32 cycles. The batch deadline of 0.44 us then only requires Fmax >= 72.7 MHz, which is easily met on Artix-7 for the accuracy range needed. This family is the baseline for area and should cover the low-area end of the Pareto front.
- `pipelined_m` (50 evals): data_width=14..22, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..5. *Why:* Pipelined_m also gives 1 result/cycle but registers only every m stages, reducing FF count and thus luts_plus_ffs. The trade-off is a longer combinational path and lower Fmax. m is limited to 2..5 so that Fmax stays comfortably above the ~73 MHz needed for the 0.44 us batch deadline. This family is the most promising for the area objective.

**Result (code):** 100 evaluations this round, 100 total; 65 feasible; hypervolume 1.265e+04 (n/a).

**LLM decision:** `add_family` — Round 1 mapped only pipelined/pipelined_m; the front's cheap corner sits at luts_plus_ffs=1351 (pipelined_m, m=4) and the objective is min luts_plus_ffs, so the biggest HV upside is a lower-area family. iterative and unrolled_k are unexplored and share datapath/FSM, so they can undercut the pipelined area at the low end. The binding risk is throughput>=32 MSPS: iterative needs fmax>=32*(N+3) (N>=13 for 12-bit accuracy => >500 MHz, likely infeasible), but unrolled_k with large k (ceil(N/k)+3 cycles) can plausibly clear 32 MSPS at N~14-16 while staying smaller than pipelined_m. Worth one round to test both before committing the reserved mapping budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.265e+04 (gain this round: n/a (first round)).
Feasible designs: 65 of 100 evaluations (58 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 273
- max_abs_err <= 0.000244141: 34% violate; best seen 5.95e-06 (2^-17.36)
- sys_p99_batch_us <= 0.44: 1% violate; best seen 0.154

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=20 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1351, accuracy_bits=12.9, luts=1020, ffs=331, throughput_msps=89.6, max_abs_err=0.000127 (2^-12.95), power_index=1.63
- pipelined_m [data_width=20 n_iter=15 angle_guard=4 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1400, accuracy_bits=13.7, luts=1067, ffs=333, throughput_msps=89.6, max_abs_err=7.32e-05 (2^-13.74), power_index=1.69
- pipelined_m [data_width=20 n_iter=16 angle_guard=4 frac_guard=1 rounding=round m=4] luts_plus_ffs=1520, accuracy_bits=14.7, luts=1185, ffs=335, throughput_msps=89.6, max_abs_err=3.77e-05 (2^-14.70), power_index=1.83
- pipelined_m [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=round m=4] luts_plus_ffs=1654, accuracy_bits=15, luts=1266, ffs=388, throughput_msps=93.6, max_abs_err=3.08e-05 (2^-14.99), power_index=1.99
- pipelined_m [data_width=22 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1685, accuracy_bits=15.7, luts=1277, ffs=408, throughput_msps=93.6, max_abs_err=1.85e-05 (2^-15.72), power_index=2.03
- pipelined_m [data_width=22 n_iter=18 angle_guard=-1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1777, accuracy_bits=15.8, luts=1359, ffs=418, throughput_msps=89.6, max_abs_err=1.78e-05 (2^-15.77), power_index=2.14
- pipelined_m [data_width=19 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1814, accuracy_bits=16.2, luts=1411, ffs=403, throughput_msps=93.6, max_abs_err=1.31e-05 (2^-16.22), power_index=2.18
- pipelined_m [data_width=22 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1902, accuracy_bits=16.9, luts=1466, ffs=436, throughput_msps=89.6, max_abs_err=8.01e-06 (2^-16.93), power_index=2.29
- pipelined_m [data_width=22 n_iter=19 angle_guard=3 frac_guard=1 rounding=round m=2] luts_plus_ffs=2343, accuracy_bits=17.4, luts=1512, ffs=831, throughput_msps=158, max_abs_err=5.96e-06 (2^-17.36), power_index=2.82
- pipelined_m [data_width=22 n_iter=19 angle_guard=4 frac_guard=1 rounding=round m=2] luts_plus_ffs=2373, accuracy_bits=17.4, luts=1531, ffs=841, throughput_msps=158, max_abs_err=5.95e-06 (2^-17.36), power_index=2.86
Front coverage: luts_plus_ffs 1351..2373 (HV reference 4000); accuracy_bits 12.9..17.4 (HV reference 12); data_width on the front 19..22 (registry 8..28).

Per family:
- pipelined: 50 evals, 31 feasible; max throughput seen 273 MSPS; best accuracy 17.31 bits; best feasible luts_plus_ffs=2030; feasible ranges: data_width 15..21, n_iter 16..19, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 50 evals, 34 feasible; max throughput seen 171 MSPS; best accuracy 17.36 bits; best feasible luts_plus_ffs=1351; feasible ranges: data_width 19..22, n_iter 14..19, angle_guard -1..4, frac_guard 0..4, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Seed NSGA-II with the current 12-design front so the new families are compared on the same objectives; keep the throughput constraint active so infeasible low-area points are pruned.*)
- `unrolled_k` (60 evals): data_width=15..24, n_iter=12..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* high k needed to hit 32 MSPS; test whether shared datapath beats pipelined_m area at equal accuracy
- `iterative` (40 evals): data_width=15..24, n_iter=12..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* confirm/deny the throughput bound analytically; if any point clears 32 MSPS it is the smallest-area candidate

**Result (code):** 100 evaluations this round, 200 total; 65 feasible; hypervolume 1.265e+04 (+0.0%).

**LLM decision:** `map_front` — Round 2 added +0.0% hypervolume (HV 1.265e4) with 200/400 evals used, so the search has saturated in the currently sampled region and needs a broader sweep rather than more of the same. The feasible front is entirely pipelined_m (12 designs, luts_plus_ffs 1351..2373, accuracy_bits 12.9..17.4), while pipelined is also feasible (31 designs, best luts_plus_ffs=2030) and iterative/unrolled_k are infeasible on throughput (max 12.9/11.6 MSPS vs the 32 MSPS constraint). The front's low-area corner sits at 1351 (accuracy 12.9, just above the 2^-12 error limit) and its high-accuracy corner at 17.4 bits, so both ends of the area/accuracy trade-off are under-covered relative to the HV reference (4000, 12). Spending this round on NSGA-II over the full ranges of the on-front family (pipelined_m, plus pipelined as a feasible alternative), seeded with the current front, is the best use of the remaining budget to extend coverage before the reserved end-of-run mapping and L2 system re-selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.265e+04 (gain this round: +0.0%).
Feasible designs: 65 of 200 evaluations (58 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 50% violate; best seen 273
- max_abs_err <= 0.000244141: 44% violate; best seen 3.91e-06 (2^-17.96)
- sys_p99_batch_us <= 0.44: 50% violate; best seen 0.154

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=20 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1351, accuracy_bits=12.9, luts=1020, ffs=331, throughput_msps=89.6, max_abs_err=0.000127 (2^-12.95), power_index=1.63
- pipelined_m [data_width=20 n_iter=15 angle_guard=4 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1400, accuracy_bits=13.7, luts=1067, ffs=333, throughput_msps=89.6, max_abs_err=7.32e-05 (2^-13.74), power_index=1.69
- pipelined_m [data_width=20 n_iter=16 angle_guard=4 frac_guard=1 rounding=round m=4] luts_plus_ffs=1520, accuracy_bits=14.7, luts=1185, ffs=335, throughput_msps=89.6, max_abs_err=3.77e-05 (2^-14.70), power_index=1.83
- pipelined_m [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=round m=4] luts_plus_ffs=1654, accuracy_bits=15, luts=1266, ffs=388, throughput_msps=93.6, max_abs_err=3.08e-05 (2^-14.99), power_index=1.99
- pipelined_m [data_width=22 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1685, accuracy_bits=15.7, luts=1277, ffs=408, throughput_msps=93.6, max_abs_err=1.85e-05 (2^-15.72), power_index=2.03
- pipelined_m [data_width=22 n_iter=18 angle_guard=-1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1777, accuracy_bits=15.8, luts=1359, ffs=418, throughput_msps=89.6, max_abs_err=1.78e-05 (2^-15.77), power_index=2.14
- pipelined_m [data_width=19 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1814, accuracy_bits=16.2, luts=1411, ffs=403, throughput_msps=93.6, max_abs_err=1.31e-05 (2^-16.22), power_index=2.18
- pipelined_m [data_width=22 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1902, accuracy_bits=16.9, luts=1466, ffs=436, throughput_msps=89.6, max_abs_err=8.01e-06 (2^-16.93), power_index=2.29
- pipelined_m [data_width=22 n_iter=19 angle_guard=3 frac_guard=1 rounding=round m=2] luts_plus_ffs=2343, accuracy_bits=17.4, luts=1512, ffs=831, throughput_msps=158, max_abs_err=5.96e-06 (2^-17.36), power_index=2.82
- pipelined_m [data_width=22 n_iter=19 angle_guard=4 frac_guard=1 rounding=round m=2] luts_plus_ffs=2373, accuracy_bits=17.4, luts=1531, ffs=841, throughput_msps=158, max_abs_err=5.95e-06 (2^-17.36), power_index=2.86
Front coverage: luts_plus_ffs 1351..2373 (HV reference 4000); accuracy_bits 12.9..17.4 (HV reference 12); data_width on the front 19..22 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 17.76 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 17.96 bits
- pipelined: 50 evals, 31 feasible; max throughput seen 273 MSPS; best accuracy 17.31 bits; best feasible luts_plus_ffs=2030; feasible ranges: data_width 15..21, n_iter 16..19, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 50 evals, 34 feasible; max throughput seen 171 MSPS; best accuracy 17.36 bits; best feasible luts_plus_ffs=1351; feasible ranges: data_width 19..22, n_iter 14..19, angle_guard -1..4, frac_guard 0..4, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=18..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (12 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 91 feasible; hypervolume 1.706e+04 (+34.9%).

**LLM decision:** `map_front` — All four registry families have now been explored, so there is nothing to add. iterative and unrolled_k are structurally infeasible here: 0 feasible designs each, with max throughput only 12.9 and 11.6 MSPS against the >=32 MSPS constraint, so they cannot appear on the front. The feasible front is entirely pipelined_m (19 designs), spanning luts_plus_ffs 1351..3550 against the HV reference 4000 and accuracy_bits 12.9..21 against reference 12, with the sys_p99_batch_us constraint comfortably met (best 0.154 us vs 0.44 us). That is a good but not yet fully dense coverage of the trade-off curve, and 160 of 400 evaluations remain with one round left. The right use of the final round is to let code run NSGA-II over the full ranges of the families actually on the front (pipelined_m, and pipelined which is feasible but currently dominated at best luts_plus_ffs=2030), seeded with the current front, to fill gaps between the 19 points and push the ends of the curve toward the reference point before selection picks min luts_plus_ffs.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.706e+04 (gain this round: +34.9%).
Feasible designs: 91 of 240 evaluations (84 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 42% violate; best seen 273
- max_abs_err <= 0.000244141: 37% violate; best seen 4.7e-07 (2^-21.02)
- sys_p99_batch_us <= 0.44: 47% violate; best seen 0.154

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=20 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1351, accuracy_bits=12.9, luts=1020, ffs=331, throughput_msps=89.6, max_abs_err=0.000127 (2^-12.95), power_index=1.63
- pipelined_m [data_width=20 n_iter=16 angle_guard=4 frac_guard=1 rounding=round m=4] luts_plus_ffs=1520, accuracy_bits=14.7, luts=1185, ffs=335, throughput_msps=89.6, max_abs_err=3.77e-05 (2^-14.70), power_index=1.83
- pipelined_m [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=round m=4] luts_plus_ffs=1654, accuracy_bits=15, luts=1266, ffs=388, throughput_msps=93.6, max_abs_err=3.08e-05 (2^-14.99), power_index=1.99
- pipelined_m [data_width=22 n_iter=18 angle_guard=-1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1777, accuracy_bits=15.8, luts=1359, ffs=418, throughput_msps=89.6, max_abs_err=1.78e-05 (2^-15.77), power_index=2.14
- pipelined_m [data_width=22 n_iter=18 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1820, accuracy_bits=16.5, luts=1385, ffs=436, throughput_msps=89.6, max_abs_err=1.08e-05 (2^-16.50), power_index=2.19
- pipelined_m [data_width=26 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=2081, accuracy_bits=17, luts=1582, ffs=499, throughput_msps=86, max_abs_err=7.76e-06 (2^-16.98), power_index=2.51
- pipelined_m [data_width=26 n_iter=20 angle_guard=3 frac_guard=1 rounding=round m=3] luts_plus_ffs=2530, accuracy_bits=18.9, luts=1842, ffs=688, throughput_msps=110, max_abs_err=2.01e-06 (2^-18.92), power_index=3.05
- pipelined_m [data_width=28 n_iter=20 angle_guard=3 frac_guard=2 rounding=round m=3] luts_plus_ffs=2753, accuracy_bits=19, luts=2006, ffs=747, throughput_msps=106, max_abs_err=1.92e-06 (2^-18.99), power_index=3.31
- pipelined_m [data_width=26 n_iter=26 angle_guard=0 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3111, accuracy_bits=20.6, luts=2271, ffs=840, throughput_msps=110, max_abs_err=6.24e-07 (2^-20.61), power_index=3.75
- pipelined_m [data_width=26 n_iter=29 angle_guard=2 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3550, accuracy_bits=21, luts=2602, ffs=948, throughput_msps=110, max_abs_err=4.7e-07 (2^-21.02), power_index=4.27
Front coverage: luts_plus_ffs 1351..3550 (HV reference 4000); accuracy_bits 12.9..21 (HV reference 12); data_width on the front 19..28 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 17.76 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 17.96 bits
- pipelined: 50 evals, 31 feasible; max throughput seen 273 MSPS; best accuracy 17.31 bits; best feasible luts_plus_ffs=2030; feasible ranges: data_width 15..21, n_iter 16..19, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 90 evals, 60 feasible; max throughput seen 171 MSPS; best accuracy 21.02 bits; best feasible luts_plus_ffs=1351; feasible ranges: data_width 19..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=18..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (19 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 163 feasible; hypervolume 1.938e+04 (+13.6%).

**LLM decision:** `stop` — Final round (340/400 evals used, round cap reached). The front is well mapped and feasible: 163 feasible designs (150 unique) across all four families, with hypervolume 1.938e+04 (+13.6% this round). All three constraints are comfortably reachable — throughput best 273 MSPS vs >=32, max_abs_err best 2^-24.39 vs <=2^-12, sys_p99_batch_us best 0.154 us vs <=0.44 us — so `infeasible` is not warranted. The front spans luts_plus_ffs 1351..4001 (HV ref 4000) and accuracy_bits 12.9..24.4 (HV ref 12), i.e. it covers both objective ranges rather than a single corner. The selection rule (min luts_plus_ffs) is served by pipelined_m [data_width=20 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] at luts_plus_ffs=1351, accuracy_bits=12.9 (max_abs_err 2^-12.95, still inside the 2^-12 limit) with 89.6 MSPS throughput. iterative and unrolled_k produced 0 feasible designs (max throughput 12.9 and 11.6 MSPS, far below 32), confirming pipelined_m is the right family; no unexplored family remains. Further search is unlikely to improve the front materially within the remaining budget, so stopping is appropriate.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.938e+04 (gain this round: +13.6%).
Feasible designs: 163 of 340 evaluations (150 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 29% violate; best seen 273
- max_abs_err <= 0.000244141: 29% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_batch_us <= 0.44: 41% violate; best seen 0.154

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=20 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1351, accuracy_bits=12.9, luts=1020, ffs=331, throughput_msps=89.6, max_abs_err=0.000127 (2^-12.95), power_index=1.63
- pipelined_m [data_width=20 n_iter=16 angle_guard=4 frac_guard=1 rounding=round m=4] luts_plus_ffs=1520, accuracy_bits=14.7, luts=1185, ffs=335, throughput_msps=89.6, max_abs_err=3.77e-05 (2^-14.70), power_index=1.83
- pipelined_m [data_width=22 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1685, accuracy_bits=15.7, luts=1277, ffs=408, throughput_msps=93.6, max_abs_err=1.85e-05 (2^-15.72), power_index=2.03
- pipelined_m [data_width=19 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1814, accuracy_bits=16.2, luts=1411, ffs=403, throughput_msps=93.6, max_abs_err=1.31e-05 (2^-16.22), power_index=2.18
- pipelined_m [data_width=22 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1902, accuracy_bits=16.9, luts=1466, ffs=436, throughput_msps=89.6, max_abs_err=8.01e-06 (2^-16.93), power_index=2.29
- pipelined_m [data_width=26 n_iter=20 angle_guard=3 frac_guard=1 rounding=round m=3] luts_plus_ffs=2530, accuracy_bits=18.9, luts=1842, ffs=688, throughput_msps=110, max_abs_err=2.01e-06 (2^-18.92), power_index=3.05
- pipelined_m [data_width=28 n_iter=20 angle_guard=3 frac_guard=2 rounding=round m=3] luts_plus_ffs=2753, accuracy_bits=19, luts=2006, ffs=747, throughput_msps=106, max_abs_err=1.92e-06 (2^-18.99), power_index=3.31
- pipelined_m [data_width=25 n_iter=24 angle_guard=2 frac_guard=4 rounding=round m=3] luts_plus_ffs=3050, accuracy_bits=21.4, luts=2263, ffs=787, throughput_msps=110, max_abs_err=3.58e-07 (2^-21.41), power_index=3.67
- pipelined_m [data_width=27 n_iter=26 angle_guard=3 frac_guard=4 rounding=round m=3] luts_plus_ffs=3591, accuracy_bits=23.8, luts=2644, ffs=947, throughput_msps=106, max_abs_err=6.69e-08 (2^-23.83), power_index=4.32
- pipelined_m [data_width=27 n_iter=29 angle_guard=3 frac_guard=4 rounding=round m=3] luts_plus_ffs=4001, accuracy_bits=24.4, luts=2954, ffs=1047, throughput_msps=106, max_abs_err=4.54e-08 (2^-24.39), power_index=4.82
Front coverage: luts_plus_ffs 1351..4001 (HV reference 4000); accuracy_bits 12.9..24.4 (HV reference 12); data_width on the front 19..28 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 17.76 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 17.96 bits
- pipelined: 50 evals, 31 feasible; max throughput seen 273 MSPS; best accuracy 17.31 bits; best feasible luts_plus_ffs=2030; feasible ranges: data_width 15..21, n_iter 16..19, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 190 evals, 132 feasible; max throughput seen 171 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=1351; feasible ranges: data_width 18..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=18..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (22 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 204 feasible; hypervolume 1.956e+04 (+0.9%).

**No LLM call** (code's front-mapping round): Final round (340/400 evals used, round cap reached). The front is well mapped and feasible: 163 feasible designs (150 unique) across all four families, with hypervolume 1.938e+04 (+13.6% this round). All three constraints are comfortably reachable — throughput best 273 MSPS vs >=32, max_abs_err best 2^-24.39 vs <=2^-12, sys_p99_batch_us best 0.154 us vs <=0.44 us — so `infeasible` is not warranted. The front spans luts_plus_ffs 1351..4001 (HV ref 4000) and accuracy_bits 12.9..24.4 (HV ref 12), i.e. it covers both objective ranges rather than a single corner. The selection rule (min luts_plus_ffs) is served by pipelined_m [data_width=20 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=4] at luts_plus_ffs=1351, accuracy_bits=12.9 (max_abs_err 2^-12.95, still inside the 2^-12 limit) with 89.6 MSPS throughput. iterative and unrolled_k produced 0 feasible designs (max throughput 12.9 and 11.6 MSPS, far below 32), confirming pipelined_m is the right family; no unexplored family remains. Further search is unlikely to improve the front materially within the remaining budget, so stopping is appropriate.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.956e+04 (gain this round: +0.9%).
Feasible designs: 204 of 400 evaluations (187 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 25% violate; best seen 273
- max_abs_err <= 0.000244141: 25% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_batch_us <= 0.44: 39% violate; best seen 0.154

Pareto front (feasible, 25 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=15 angle_guard=0 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1280, accuracy_bits=12.9, luts=979, ffs=301, throughput_msps=93.6, max_abs_err=0.000134 (2^-12.86), power_index=1.54
- pipelined_m [data_width=20 n_iter=16 angle_guard=4 frac_guard=1 rounding=round m=4] luts_plus_ffs=1520, accuracy_bits=14.7, luts=1185, ffs=335, throughput_msps=89.6, max_abs_err=3.77e-05 (2^-14.70), power_index=1.83
- pipelined_m [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=round m=4] luts_plus_ffs=1654, accuracy_bits=15, luts=1266, ffs=388, throughput_msps=93.6, max_abs_err=3.08e-05 (2^-14.99), power_index=1.99
- pipelined_m [data_width=19 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1814, accuracy_bits=16.2, luts=1411, ffs=403, throughput_msps=93.6, max_abs_err=1.31e-05 (2^-16.22), power_index=2.18
- pipelined_m [data_width=26 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=2081, accuracy_bits=17, luts=1582, ffs=499, throughput_msps=86, max_abs_err=7.76e-06 (2^-16.98), power_index=2.51
- pipelined_m [data_width=26 n_iter=20 angle_guard=3 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=2292, accuracy_bits=18.8, luts=1787, ffs=504, throughput_msps=86, max_abs_err=2.13e-06 (2^-18.84), power_index=2.76
- pipelined_m [data_width=23 n_iter=22 angle_guard=2 frac_guard=2 rounding=round m=2] luts_plus_ffs=2801, accuracy_bits=19.2, luts=1846, ffs=954, throughput_msps=158, max_abs_err=1.68e-06 (2^-19.19), power_index=3.37
- pipelined_m [data_width=27 n_iter=24 angle_guard=2 frac_guard=4 rounding=round m=3] luts_plus_ffs=3253, accuracy_bits=22.5, luts=2413, ffs=839, throughput_msps=106, max_abs_err=1.68e-07 (2^-22.51), power_index=3.92
- pipelined_m [data_width=27 n_iter=26 angle_guard=1 frac_guard=4 rounding=round m=3] luts_plus_ffs=3520, accuracy_bits=22.8, luts=2591, ffs=929, throughput_msps=106, max_abs_err=1.42e-07 (2^-22.75), power_index=4.24
- pipelined_m [data_width=27 n_iter=29 angle_guard=3 frac_guard=4 rounding=round m=3] luts_plus_ffs=4001, accuracy_bits=24.4, luts=2954, ffs=1047, throughput_msps=106, max_abs_err=4.54e-08 (2^-24.39), power_index=4.82
Front coverage: luts_plus_ffs 1280..4001 (HV reference 4000); accuracy_bits 12.9..24.4 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 12.9 MSPS; best accuracy 17.76 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 17.96 bits
- pipelined: 50 evals, 31 feasible; max throughput seen 273 MSPS; best accuracy 17.31 bits; best feasible luts_plus_ffs=2030; feasible ranges: data_width 15..21, n_iter 16..19, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 250 evals, 173 feasible; max throughput seen 171 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=1280; feasible ranges: data_width 18..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 15966 in, 11330 out
- provider-reported cost: $0.0167
- full prompts and replies: `llm_trace.jsonl`

