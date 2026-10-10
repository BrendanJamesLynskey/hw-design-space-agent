# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`pipelined_m:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 827 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 282 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 97.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 61.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.34 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.0002 (2^-12.28) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.1 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.41e-05 (2^-14.17) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.55 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 95.0 dBc, SNR 82.4 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3679 → 0.378 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (35 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 827 | 282 | 97.8 | 6 | 1.34 | 0.0002 (2^-12.28) | 12.28 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 863 | 280 | 97.8 | 6 | 1.38 | 0.000192 (2^-12.35) | 12.35 |
| 2 | `pipelined_m:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 868 | 297 | 93.6 | 6 | 1.4 | 0.000164 (2^-12.57) | 12.57 |
| 3 | `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=trunc,m=4` | 882 | 301 | 93.6 | 6 | 1.42 | 0.000162 (2^-12.59) | 12.59 |
| 4 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=4` | 926 | 280 | 97.8 | 6 | 1.45 | 0.000158 (2^-12.63) | 12.63 |
| 5 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=2,rounding=round,m=4` | 934 | 301 | 93.6 | 6 | 1.49 | 0.000157 (2^-12.64) | 12.64 |
| 6 | `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 949 | 297 | 93.6 | 6 | 1.5 | 0.000118 (2^-13.05) | 13.05 |
| 7 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 964 | 303 | 93.6 | 6 | 1.52 | 0.000101 (2^-13.27) | 13.27 |
| 8 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 979 | 307 | 93.6 | 6 | 1.55 | 9.41e-05 (2^-13.38) | 13.38 |
| 9 | `pipelined_m:data_width=20,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 1008 | 317 | 93.6 | 6 | 1.6 | 7.97e-05 (2^-13.61) | 13.61 |
| 10 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1019 | 309 | 93.6 | 6 | 1.6 | 7.94e-05 (2^-13.62) | 13.62 |
| 11 | `pipelined_m:data_width=20,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1023 | 321 | 93.6 | 6 | 1.62 | 7.76e-05 (2^-13.65) | 13.65 |
| 12 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1048 | 307 | 93.6 | 6 | 1.63 | 6.44e-05 (2^-13.92) | 13.92 |
| 13 | `pipelined_m:data_width=20,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc,m=4` | 1064 | 315 | 93.6 | 6 | 1.66 | 6.04e-05 (2^-14.02) | 14.02 |
| 14 | `pipelined_m:data_width=20,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 1080 | 317 | 93.6 | 6 | 1.68 | 5.62e-05 (2^-14.12) | 14.12 |
| 15 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1080 | 319 | 93.6 | 6 | 1.68 | 4.12e-05 (2^-14.57) | 14.57 |
| 16 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1143 | 331 | 93.6 | 6 | 1.77 | 3.93e-05 (2^-14.63) | 14.63 |
| 17 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=4` | 1154 | 327 | 93.6 | 6 | 1.78 | 3.91e-05 (2^-14.64) | 14.64 |
| 18 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=4,rounding=round,m=4` | 1282 | 355 | 89.6 | 6 | 1.97 | 3.42e-05 (2^-14.84) | 14.84 |
| 19 | `pipelined_m:data_width=26,n_iter=16,angle_guard=0,frac_guard=2,rounding=round,m=4` | 1451 | 410 | 86.0 | 6 | 2.24 | 3.08e-05 (2^-14.99) | 14.99 |
| 20 | `pipelined_m:data_width=25,n_iter=16,angle_guard=3,frac_guard=4,rounding=round,m=4` | 1512 | 420 | 86.0 | 6 | 2.33 | 3.06e-05 (2^-15.00) | 15.00 |
| 21 | `pipelined_m:data_width=25,n_iter=16,angle_guard=4,frac_guard=4,rounding=round,m=4` | 1528 | 424 | 86.0 | 6 | 2.35 | 3.05e-05 (2^-15.00) | 15.00 |
| 22 | `pipelined_m:data_width=21,n_iter=19,angle_guard=3,frac_guard=4,rounding=trunc,m=4` | 1523 | 443 | 89.6 | 7 | 2.37 | 7.12e-06 (2^-17.10) | 17.10 |
| 23 | `pipelined_m:data_width=22,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc,m=3` | 1542 | 617 | 114.5 | 9 | 2.6 | 5.44e-06 (2^-17.49) | 17.49 |
| 24 | `pipelined_m:data_width=25,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc,m=4` | 1712 | 503 | 86.0 | 7 | 2.67 | 3.99e-06 (2^-17.93) | 17.93 |
| 25 | `pipelined_m:data_width=28,n_iter=20,angle_guard=-2,frac_guard=0,rounding=round,m=3` | 1767 | 685 | 110.0 | 9 | 2.95 | 2.26e-06 (2^-18.76) | 18.76 |
| 26 | `pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=0,rounding=round,m=3` | 1906 | 720 | 114.5 | 10 | 3.16 | 1.17e-06 (2^-19.70) | 19.70 |
| 27 | `pipelined_m:data_width=24,n_iter=24,angle_guard=4,frac_guard=1,rounding=round,m=3` | 2092 | 734 | 110.0 | 10 | 3.4 | 9.69e-07 (2^-19.98) | 19.98 |
| 28 | `pipelined_m:data_width=27,n_iter=23,angle_guard=2,frac_guard=0,rounding=round,m=3` | 2069 | 781 | 110.0 | 10 | 3.43 | 3.7e-07 (2^-21.37) | 21.37 |
| 29 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=0,rounding=round,m=3` | 2162 | 781 | 110.0 | 10 | 3.54 | 2.66e-07 (2^-21.84) | 21.84 |
| 30 | `pipelined_m:data_width=28,n_iter=24,angle_guard=0,frac_guard=2,rounding=round,m=3` | 2342 | 821 | 110.0 | 10 | 3.81 | 2.22e-07 (2^-22.11) | 22.11 |
| 31 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=4,rounding=trunc,m=3` | 2356 | 837 | 105.9 | 10 | 3.84 | 1.85e-07 (2^-22.36) | 22.36 |
| 32 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2413 | 839 | 105.9 | 10 | 3.92 | 1.68e-07 (2^-22.51) | 22.51 |
| 33 | `pipelined_m:data_width=27,n_iter=26,angle_guard=2,frac_guard=4,rounding=trunc,m=3` | 2561 | 936 | 105.9 | 11 | 4.21 | 1.13e-07 (2^-23.08) | 23.08 |
| 34 | `pipelined_m:data_width=27,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc,m=3` | 2793 | 1045 | 105.9 | 12 | 4.62 | 6.51e-08 (2^-23.87) | 23.87 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires 32 Msps throughput (1 result/cycle at 32 MHz or higher) and a tight p99_batch latency of 0.44us. This rules out iterative (too slow: N+3 cycles per result). The three 1-result/cycle families (pipelined, pipelined_m, unrolled_k) are candidates. pipelined_m is the most promising for area efficiency since it shares datapaths between m stages, but its latency (ceil(N/m)+2) depends on m. pipelined has the lowest latency but highest area. unrolled_k with high k can also achieve 1 result/cycle with shared datapath. Accuracy constraint (max_abs_err <= 2^-12) requires sufficient data_width and n_iter; ranges 14-20 and 12-16 should cover this. The budget is split to focus on pipelined_m (most likely to be on the Pareto front for area) and pipelined (for latency-critical cases), with unrolled_k as a secondary exploration. The 0.44us p99_batch constraint is the key differentiator: at 32 MHz, 1 cycle = 31.25ns, so 0.44us allows up to ~14 cycles of latency. All three families should be able to meet this, but the exact trade-off between area and latency needs to be mapped.*)
- `pipelined_m` (45 evals): data_width=14..20, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m offers 1 result/cycle throughput (satisfying 32 Msps) with lower area than fully pipelined by sharing datapaths between m stages. The m parameter (2-4) trades latency for area: smaller m means more registers but shorter latency, which is critical for the 0.44us p99_batch constraint. Data width 14-20 and n_iter 12-16 cover the accuracy requirement (max_abs_err <= 2^-12) while keeping area reasonable. The trade-off between m (area vs latency) and n_iter/data_width (accuracy vs area) is the key design space to explore.
- `pipelined` (35 evals): data_width=14..20, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined has the lowest latency (N+2 cycles) among 1-result/cycle families, which helps meet the tight 0.44us p99_batch constraint. It will likely have higher area than pipelined_m but may be necessary if pipelined_m's latency is too high. Same accuracy parameter ranges as pipelined_m since accuracy depends only on data_width, n_iter, angle_guard, frac_guard, and rounding.
- `unrolled_k` (20 evals): data_width=14..20, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k with high k (4-8) can achieve 1 result/cycle throughput with potentially lower area than pipelined families since it shares the datapath across k micro-rotations per cycle. However, latency is ceil(N/k)+3 cycles, which for N=12-16 and k=4-8 gives 4-7 cycles. This may or may not meet the 0.44us constraint depending on Fmax. Worth exploring as a potential area-efficient alternative.

**Result (code):** 100 evaluations this round, 100 total; 34 feasible; hypervolume 6186 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs, with the best area (1183 LUTs+FFs) at 12.4 accuracy bits. The `pipelined` family is significantly less efficient (best 1818 LUTs+FFs), and `unrolled_k` is infeasible for the throughput constraint (max 8.32 MSPS vs 32 required). The `iterative` family is also infeasible for throughput (1 result/cycle max ~273 MSPS is possible but latency/area trade-offs are poor compared to pipelined_m, and it hasn't been explored yet, but given `pipelined_m`'s dominance, it's unlikely to beat the current front significantly without specific tuning). The key insight is that `pipelined_m` with `m=3` or `m=4` offers the best area/accuracy trade-off. The current front covers accuracy bits 12.4 to 14.3. To improve hypervolume, we should focus on the region where `pipelined_m` is most efficient: `data_width` 17-20, `n_iter` 14-16, `angle_guard` 0-2, `frac_guard` 0-2, and `m` 3-4. We should narrow the search space to these ranges to allow Optuna to find better points on the front, particularly in the mid-range of accuracy bits where the current front might be sparse. We will exclude `pipelined` and `unrolled_k` from the next round as they are clearly inferior or infeasible. We will also exclude `iterative` as it is unlikely to beat `pipelined_m` in area for the same accuracy given the shared datapath overhead and lower throughput efficiency in this specific bursty system context (though `pipelined_m` is already 1 result/cycle).

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6186 (gain this round: n/a (first round)).
Feasible designs: 34 of 100 evaluations (28 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 273
- max_abs_err <= 0.000244141: 55% violate; best seen 4.88e-05 (2^-14.32)
- sys_p99_batch_us <= 0.44: 20% violate; best seen 0.161

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=1 rounding=round m=4] luts_plus_ffs=1183, accuracy_bits=12.4, luts=893, ffs=291, throughput_msps=93.6, max_abs_err=0.000179 (2^-12.45), power_index=1.42
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1229, accuracy_bits=12.6, luts=868, ffs=361, throughput_msps=119, max_abs_err=0.000164 (2^-12.57), power_index=1.48
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1265, accuracy_bits=12.6, luts=896, ffs=369, throughput_msps=119, max_abs_err=0.000158 (2^-12.63), power_index=1.52
- pipelined_m [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=1288, accuracy_bits=12.9, luts=941, ffs=347, throughput_msps=119, max_abs_err=0.00013 (2^-12.91), power_index=1.55
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1335, accuracy_bits=13.6, luts=964, ffs=371, throughput_msps=119, max_abs_err=8.33e-05 (2^-13.55), power_index=1.61
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1355, accuracy_bits=13.9, luts=1048, ffs=307, throughput_msps=93.6, max_abs_err=6.44e-05 (2^-13.92), power_index=1.63
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=3] luts_plus_ffs=1532, accuracy_bits=14.2, luts=1089, ffs=444, throughput_msps=119, max_abs_err=5.25e-05 (2^-14.22), power_index=1.84
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=2 rounding=round m=3] luts_plus_ffs=1574, accuracy_bits=14.3, luts=1120, ffs=454, throughput_msps=119, max_abs_err=5.03e-05 (2^-14.28), power_index=1.89
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=2] luts_plus_ffs=1720, accuracy_bits=14.3, luts=1122, ffs=597, throughput_msps=164, max_abs_err=5.03e-05 (2^-14.28), power_index=2.07
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=2 rounding=round m=2] luts_plus_ffs=1765, accuracy_bits=14.3, luts=1154, ffs=611, throughput_msps=164, max_abs_err=4.88e-05 (2^-14.32), power_index=2.12
Front coverage: luts_plus_ffs 1183..1765 (HV reference 4000); accuracy_bits 12.4..14.3 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.32 MSPS; best accuracy 13.73 bits
- pipelined: 35 evals, 4 feasible; max throughput seen 273 MSPS; best accuracy 12.80 bits; best feasible luts_plus_ffs=1818; feasible ranges: data_width 17..18, n_iter 15..15, angle_guard 0..0, frac_guard 1..2
- pipelined_m: 45 evals, 30 feasible; max throughput seen 164 MSPS; best accuracy 14.32 bits; best feasible luts_plus_ffs=1183; feasible ranges: data_width 17..20, n_iter 14..16, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Narrowing to `pipelined_m` with `m=3-4` and the observed feasible parameter ranges allows for a more focused search. The `pipelined` family is too area-inefficient, and `unrolled_k`/`iterative` are either infeasible or unlikely to improve the front. This should yield a denser and better Pareto front within the remaining budget.*)
- `pipelined_m` (100 evals): data_width=17..20, n_iter=14..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=3..4. *Why:* Focus exclusively on the dominant family `pipelined_m` in the region where it has already produced the best results (data_width 17-20, n_iter 14-16, m 3-4). This narrows the search space to allow deeper exploration of the trade-off curve between area and accuracy, aiming to improve hypervolume by finding better points in the mid-range of accuracy bits.

**Result (code):** 100 evaluations this round, 200 total; 131 feasible; hypervolume 7169 (+15.9%).

**LLM decision:** `refine` — The `pipelined_m` family dominates the current Pareto front (10 of 10 shown designs), achieving the best area (1110 LUTs+FFs) and a wide range of accuracy (12.3-14.6 bits). The `pipelined` family is significantly less efficient (best area 1818 vs 1110) and offers no advantage in this trade-off space. `unrolled_k` is infeasible due to throughput constraints (max 8.32 MSPS < 32 MSPS). The current front is concentrated in `data_width` 17-20 and `n_iter` 14-16. To maximize hypervolume and ensure the selection rule (min area) picks a robust design, I will refine the search to focus exclusively on `pipelined_m` with tighter ranges around the known optimal region, allowing the optimizer to find the absolute minimum area point that still meets the 2^-12 error constraint and system latency bounds.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7169 (gain this round: +15.9%).
Feasible designs: 131 of 200 evaluations (88 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 10% violate; best seen 273
- max_abs_err <= 0.000244141: 29% violate; best seen 3.91e-05 (2^-14.64)
- sys_p99_batch_us <= 0.44: 10% violate; best seen 0.161

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1110, accuracy_bits=12.3, luts=827, ffs=282, throughput_msps=97.8, max_abs_err=0.0002 (2^-12.28), power_index=1.34
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1165, accuracy_bits=12.6, luts=868, ffs=297, throughput_msps=93.6, max_abs_err=0.000164 (2^-12.57), power_index=1.4
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1207, accuracy_bits=12.6, luts=926, ffs=280, throughput_msps=97.8, max_abs_err=0.000158 (2^-12.63), power_index=1.45
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1269, accuracy_bits=13.2, luts=964, ffs=305, throughput_msps=93.6, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1325, accuracy_bits=13.6, luts=1008, ffs=317, throughput_msps=93.6, max_abs_err=7.97e-05 (2^-13.61), power_index=1.6
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1328, accuracy_bits=13.6, luts=1019, ffs=309, throughput_msps=93.6, max_abs_err=7.94e-05 (2^-13.62), power_index=1.6
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1355, accuracy_bits=13.9, luts=1048, ffs=307, throughput_msps=93.6, max_abs_err=6.44e-05 (2^-13.92), power_index=1.63
- pipelined_m [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1397, accuracy_bits=14.1, luts=1080, ffs=317, throughput_msps=93.6, max_abs_err=5.62e-05 (2^-14.12), power_index=1.68
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1399, accuracy_bits=14.6, luts=1080, ffs=319, throughput_msps=93.6, max_abs_err=4.12e-05 (2^-14.57), power_index=1.68
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1481, accuracy_bits=14.6, luts=1154, ffs=327, throughput_msps=93.6, max_abs_err=3.91e-05 (2^-14.64), power_index=1.78
Front coverage: luts_plus_ffs 1110..1481 (HV reference 4000); accuracy_bits 12.3..14.6 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.32 MSPS; best accuracy 13.73 bits
- pipelined: 35 evals, 4 feasible; max throughput seen 273 MSPS; best accuracy 12.80 bits; best feasible luts_plus_ffs=1818; feasible ranges: data_width 17..18, n_iter 15..15, angle_guard 0..0, frac_guard 1..2
- pipelined_m: 145 evals, 127 feasible; max throughput seen 164 MSPS; best accuracy 14.64 bits; best feasible luts_plus_ffs=1110; feasible ranges: data_width 17..20, n_iter 14..16, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate remaining budget on the winning family to polish the Pareto front and identify the minimum-area feasible design.*)
- `pipelined_m` (40 evals): data_width=16..19, n_iter=13..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Focus on the dominant family. Slightly widen data_width down to 16 and n_iter down to 13 to check if lower area is possible while maintaining accuracy >= 12 bits. Keep m=2..4 as m>4 likely increases latency or area without benefit.

**Result (code):** 40 evaluations this round, 240 total; 164 feasible; hypervolume 7172 (+0.0%).

**LLM decision:** `stop` — The front is feasible and well-mapped: 164 feasible designs with a best area of 1110 luts_plus_ffs (pipelined_m, data_width=18, n_iter=14, m=4) and accuracy up to 14.64 bits, comfortably exceeding the 12-bit accuracy constraint and the 32 MSPS throughput constraint. The system constraint (sys_p99_batch_us <= 0.44) is met by the best designs (best seen 0.161 us). The front spans a reasonable trade-off curve (1110-1481 area, 12.3-14.6 bits) with no significant improvement expected from further exploration. Since this is the final round, stopping is appropriate.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7172 (gain this round: +0.0%).
Feasible designs: 164 of 240 evaluations (112 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 273
- max_abs_err <= 0.000244141: 27% violate; best seen 3.91e-05 (2^-14.64)
- sys_p99_batch_us <= 0.44: 8% violate; best seen 0.161

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1110, accuracy_bits=12.3, luts=827, ffs=282, throughput_msps=97.8, max_abs_err=0.0002 (2^-12.28), power_index=1.34
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1165, accuracy_bits=12.6, luts=868, ffs=297, throughput_msps=93.6, max_abs_err=0.000164 (2^-12.57), power_index=1.4
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1207, accuracy_bits=12.6, luts=926, ffs=280, throughput_msps=97.8, max_abs_err=0.000158 (2^-12.63), power_index=1.45
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1246, accuracy_bits=13.1, luts=949, ffs=297, throughput_msps=93.6, max_abs_err=0.000118 (2^-13.05), power_index=1.5
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1286, accuracy_bits=13.4, luts=979, ffs=307, throughput_msps=93.6, max_abs_err=9.41e-05 (2^-13.38), power_index=1.55
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1325, accuracy_bits=13.6, luts=1008, ffs=317, throughput_msps=93.6, max_abs_err=7.97e-05 (2^-13.61), power_index=1.6
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1344, accuracy_bits=13.7, luts=1023, ffs=321, throughput_msps=93.6, max_abs_err=7.76e-05 (2^-13.65), power_index=1.62
- pipelined_m [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1379, accuracy_bits=14, luts=1064, ffs=315, throughput_msps=93.6, max_abs_err=6.04e-05 (2^-14.02), power_index=1.66
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1399, accuracy_bits=14.6, luts=1080, ffs=319, throughput_msps=93.6, max_abs_err=4.12e-05 (2^-14.57), power_index=1.68
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1481, accuracy_bits=14.6, luts=1154, ffs=327, throughput_msps=93.6, max_abs_err=3.91e-05 (2^-14.64), power_index=1.78
Front coverage: luts_plus_ffs 1110..1481 (HV reference 4000); accuracy_bits 12.3..14.6 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.32 MSPS; best accuracy 13.73 bits
- pipelined: 35 evals, 4 feasible; max throughput seen 273 MSPS; best accuracy 12.80 bits; best feasible luts_plus_ffs=1818; feasible ranges: data_width 17..18, n_iter 15..15, angle_guard 0..0, frac_guard 1..2
- pipelined_m: 185 evals, 160 feasible; max throughput seen 171 MSPS; best accuracy 14.64 bits; best feasible luts_plus_ffs=1110; feasible ranges: data_width 17..20, n_iter 14..16, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (18 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 286 feasible; hypervolume 1.971e+04 (+174.8%).

**No LLM call** (code's front-mapping round): The front is feasible and well-mapped: 164 feasible designs with a best area of 1110 luts_plus_ffs (pipelined_m, data_width=18, n_iter=14, m=4) and accuracy up to 14.64 bits, comfortably exceeding the 12-bit accuracy constraint and the 32 MSPS throughput constraint. The system constraint (sys_p99_batch_us <= 0.44) is met by the best designs (best seen 0.161 us). The front spans a reasonable trade-off curve (1110-1481 area, 12.3-14.6 bits) with no significant improvement expected from further exploration. Since this is the final round, stopping is appropriate.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.971e+04 (gain this round: +174.8%).
Feasible designs: 286 of 400 evaluations (226 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 273
- max_abs_err <= 0.000244141: 19% violate; best seen 6.51e-08 (2^-23.87)
- sys_p99_batch_us <= 0.44: 14% violate; best seen 0.161

Pareto front (feasible, 35 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1110, accuracy_bits=12.3, luts=827, ffs=282, throughput_msps=97.8, max_abs_err=0.0002 (2^-12.28), power_index=1.34
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1207, accuracy_bits=12.6, luts=926, ffs=280, throughput_msps=97.8, max_abs_err=0.000158 (2^-12.63), power_index=1.45
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1286, accuracy_bits=13.4, luts=979, ffs=307, throughput_msps=93.6, max_abs_err=9.41e-05 (2^-13.38), power_index=1.55
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1344, accuracy_bits=13.7, luts=1023, ffs=321, throughput_msps=93.6, max_abs_err=7.76e-05 (2^-13.65), power_index=1.62
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1399, accuracy_bits=14.6, luts=1080, ffs=319, throughput_msps=93.6, max_abs_err=4.12e-05 (2^-14.57), power_index=1.68
- pipelined_m [data_width=26 n_iter=16 angle_guard=0 frac_guard=2 rounding=round m=4] luts_plus_ffs=1861, accuracy_bits=15, luts=1451, ffs=410, throughput_msps=86, max_abs_err=3.08e-05 (2^-14.99), power_index=2.24
- pipelined_m [data_width=22 n_iter=19 angle_guard=3 frac_guard=3 rounding=trunc m=3] luts_plus_ffs=2159, accuracy_bits=17.5, luts=1542, ffs=617, throughput_msps=114, max_abs_err=5.44e-06 (2^-17.49), power_index=2.6
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=2627, accuracy_bits=19.7, luts=1906, ffs=720, throughput_msps=114, max_abs_err=1.17e-06 (2^-19.70), power_index=3.16
- pipelined_m [data_width=28 n_iter=24 angle_guard=0 frac_guard=2 rounding=round m=3] luts_plus_ffs=3164, accuracy_bits=22.1, luts=2342, ffs=821, throughput_msps=110, max_abs_err=2.22e-07 (2^-22.11), power_index=3.81
- pipelined_m [data_width=27 n_iter=28 angle_guard=3 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=3839, accuracy_bits=23.9, luts=2793, ffs=1045, throughput_msps=106, max_abs_err=6.51e-08 (2^-23.87), power_index=4.62
Front coverage: luts_plus_ffs 1110..3839 (HV reference 4000); accuracy_bits 12.3..23.9 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 8.32 MSPS; best accuracy 13.73 bits
- pipelined: 35 evals, 4 feasible; max throughput seen 273 MSPS; best accuracy 12.80 bits; best feasible luts_plus_ffs=1818; feasible ranges: data_width 17..18, n_iter 15..15, angle_guard 0..0, frac_guard 1..2
- pipelined_m: 345 evals, 282 feasible; max throughput seen 171 MSPS; best accuracy 23.87 bits; best feasible luts_plus_ffs=1110; feasible ranges: data_width 16..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 13631 in, 3304 out
- provider-reported cost: $0.0072
- full prompts and replies: `llm_trace.jsonl`

