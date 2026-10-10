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
| `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3679 → 0.378 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (25 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 800 | 272 | 97.8 | 6 | 1.29 | 0.000204 (2^-12.26) | 12.26 |
| 1 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=4` | 861 | 272 | 97.8 | 6 | 1.36 | 0.000168 (2^-12.54) | 12.54 |
| 2 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=4` | 906 | 295 | 93.6 | 6 | 1.45 | 0.00016 (2^-12.61) | 12.61 |
| 3 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=4` | 926 | 280 | 97.8 | 6 | 1.45 | 0.000158 (2^-12.63) | 12.63 |
| 4 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 935 | 293 | 93.6 | 6 | 1.48 | 0.000127 (2^-12.95) | 12.95 |
| 5 | `pipelined_m:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=3` | 920 | 354 | 119.3 | 7 | 1.53 | 0.000109 (2^-13.17) | 13.17 |
| 6 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1001 | 293 | 93.6 | 6 | 1.56 | 0.000104 (2^-13.23) | 13.23 |
| 7 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1017 | 297 | 93.6 | 6 | 1.58 | 8.82e-05 (2^-13.47) | 13.47 |
| 8 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1037 | 291 | 93.6 | 6 | 1.6 | 8.59e-05 (2^-13.51) | 13.51 |
| 9 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=4` | 1055 | 299 | 93.6 | 6 | 1.63 | 6.45e-05 (2^-13.92) | 13.92 |
| 10 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1086 | 305 | 93.6 | 6 | 1.67 | 5.46e-05 (2^-14.16) | 14.16 |
| 11 | `pipelined_m:data_width=22,n_iter=18,angle_guard=3,frac_guard=0,rounding=round,m=4` | 1349 | 428 | 89.6 | 7 | 2.14 | 1.1e-05 (2^-16.47) | 16.47 |
| 12 | `pipelined_m:data_width=24,n_iter=18,angle_guard=-1,frac_guard=1,rounding=trunc,m=3` | 1420 | 531 | 114.5 | 8 | 2.35 | 9.83e-06 (2^-16.63) | 16.63 |
| 13 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1547 | 434 | 89.6 | 7 | 2.38 | 5.54e-06 (2^-17.46) | 17.46 |
| 14 | `pipelined_m:data_width=21,n_iter=21,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1630 | 500 | 89.6 | 8 | 2.56 | 5.47e-06 (2^-17.48) | 17.48 |
| 15 | `pipelined_m:data_width=22,n_iter=21,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1632 | 504 | 89.6 | 8 | 2.57 | 4.62e-06 (2^-17.72) | 17.72 |
| 16 | `pipelined_m:data_width=23,n_iter=21,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 1649 | 602 | 114.5 | 9 | 2.71 | 3.47e-06 (2^-18.14) | 18.14 |
| 17 | `pipelined_m:data_width=23,n_iter=23,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 1860 | 698 | 114.5 | 10 | 3.08 | 2.86e-06 (2^-18.42) | 18.42 |
| 18 | `pipelined_m:data_width=25,n_iter=22,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 1908 | 751 | 110.0 | 10 | 3.2 | 1e-06 (2^-19.93) | 19.93 |
| 19 | `pipelined_m:data_width=24,n_iter=23,angle_guard=3,frac_guard=2,rounding=round,m=3` | 2026 | 741 | 110.0 | 10 | 3.33 | 5.75e-07 (2^-20.73) | 20.73 |
| 20 | `pipelined_m:data_width=24,n_iter=24,angle_guard=3,frac_guard=3,rounding=round,m=3` | 2164 | 755 | 110.0 | 10 | 3.51 | 4.66e-07 (2^-21.03) | 21.03 |
| 21 | `pipelined_m:data_width=28,n_iter=23,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 2208 | 829 | 105.9 | 10 | 3.66 | 3.01e-07 (2^-21.66) | 21.66 |
| 22 | `pipelined_m:data_width=27,n_iter=24,angle_guard=4,frac_guard=2,rounding=round,m=3` | 2365 | 827 | 105.9 | 10 | 3.84 | 1.63e-07 (2^-22.55) | 22.55 |
| 23 | `pipelined_m:data_width=28,n_iter=24,angle_guard=3,frac_guard=3,rounding=trunc,m=3` | 2405 | 858 | 105.9 | 10 | 3.93 | 1.45e-07 (2^-22.72) | 22.72 |
| 24 | `pipelined_m:data_width=28,n_iter=28,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 2708 | 1023 | 105.9 | 12 | 4.49 | 1e-07 (2^-23.25) | 23.25 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec has three hard constraints: throughput >=32 Msps, max_abs_err <=2^-12, and sys_p99_batch_us <=0.44us. The throughput constraint eliminates iterative (1 result per N+3 cycles, far too slow). Pipelined and pipelined_m are the primary candidates as they produce 1 result/cycle, easily meeting 32 Msps at reasonable Fmax. Unrolled_k is included as a secondary candidate since it may have lower LUT count (shared datapath) and can meet throughput with k>=4 at sufficient Fmax. The accuracy constraint (2^-12) requires n_iter >= ~12 and data_width >= ~14 to ensure quantization error doesn't dominate. I've set data_width=14..18 and n_iter=12..18 to cover the accuracy-feasible region while keeping area manageable. angle_guard and frac_guard are kept low (0..2) since they add area for marginal accuracy gains; the base n_iter and data_width should suffice for 2^-12. The batch latency constraint (0.44us) is easily met by all three families given their low cycle latencies. Budget allocation: 50% to pipelined (most likely to be on the Pareto front), 30% to pipelined_m (FF savings trade-off), 20% to unrolled_k (LUT savings trade-off). This focuses the budget where the area/accuracy trade-offs are most informative.*)
- `pipelined` (50 evals): data_width=14..18, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* The spec requires 32 results/us throughput and a 0.44us p99 batch latency for 32 simultaneous requests. Only a 1-result/cycle architecture can meet the throughput constraint (>=32 Msps). Pipelined is the canonical 1-result/cycle family. The batch latency constraint (0.44us) is tight: at Fmax, N+2 cycles must fit in 0.44us. For N=12..18, latency is 14..20 cycles. At ~150-200 MHz, 20 cycles = 100-133ns, well under 440ns. Accuracy: max_abs_err <= 2^-12 = 0.000244. CORDIC error is dominated by residual angle after N iterations (~2^-N) and quantization. With data_width=14-18 and n_iter=12-18, we should be able to meet 2^-12 accuracy. The trade-off is between n_iter (more = better accuracy, more area/latency) and data_width (more = better quantization, more area). angle_guard and frac_guard add area for marginal accuracy gains; keep them low to minimize area. This family is the primary candidate for the Pareto front.
- `pipelined_m` (30 evals): data_width=14..18, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Pipelined_m registers every m stages, reducing FF count compared to fully pipelined while maintaining 1-result/cycle throughput. This is a direct area trade-off: fewer pipeline registers = fewer FFs, but potentially lower Fmax due to longer combinational paths. For m=2..4, the latency is ceil(N/m)+2 cycles. With N=12..18 and m=2..4, latency ranges from ~5 to 11 cycles, well within the 0.44us budget. The accuracy is identical to pipelined for the same data_width/n_iter/guards/rounding, so the trade-off is purely area (LUTs+FFs) vs Fmax. This family likely produces designs with fewer FFs than pipelined, potentially dominating on the luts_plus_ffs objective if Fmax remains adequate. m=2..4 balances FF savings against timing closure risk.
- `unrolled_k` (20 evals): data_width=14..18, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Unrolled_k performs k micro-rotations per cycle. To achieve >=32 Msps throughput, we need results/cycle >= 32/Fmax. If Fmax ~150 MHz, we need >=0.214 results/cycle, i.e., one result every ~4.7 cycles. With k=4..8 and N=12..18, latency is ceil(N/k)+3 cycles. For k=8, N=16: ceil(16/8)+3 = 5 cycles. At 150 MHz, 5 cycles = 33ns, well under 440ns. Throughput: 1 result per 5 cycles at 150 MHz = 30 Msps, which is below 32. For k=8, N=12: ceil(12/8)+3 = 4+3=7 cycles... wait, ceil(12/8)=2, so 2+3=5 cycles. 150/5=30 Msps. Still below 32. For k=8, N=16: ceil(16/8)=2, 2+3=5 cycles, 30 Msps. Hmm, this may not meet the 32 Msps constraint unless Fmax is higher. But unrolled_k has a shared FSM and may have lower LUT count than pipelined for the same N. Worth exploring to see if it can meet throughput at higher Fmax or if it dominates on area. The k=4..8 range covers the throughput-feasible region.

**Result (code):** 100 evaluations this round, 100 total; 45 feasible; hypervolume 5839 (n/a).

**LLM decision:** `refine` — The front is dominated by pipelined_m designs with luts_plus_ffs between 1190 and 1391, which is significantly better than the best pipelined design (1796). The accuracy constraint (max_abs_err <= 2^-12) is met by all front designs, but there is room to explore higher accuracy (up to 14.2 bits seen) while keeping area low. The current front only covers data_width=18, but the feasible ranges for pipelined_m show data_width 16..18. I should narrow the search to focus on the promising region: data_width 16-18, n_iter 14-16, angle_guard 1-2, frac_guard 0-2, m 2-4 for pipelined_m, and also include pipelined with similar ranges to see if any pipelined designs can beat the pipelined_m area. The unrolled_k family is infeasible (max throughput 10.3 MSPS < 32), so it can be excluded. The iterative family has not been explored, but given that pipelined_m is already achieving 119 MSPS with low area, iterative (which has N+3 cycles/result) is unlikely to be competitive on throughput or area for this spec. I will focus the next round on refining the pipelined_m and pipelined ranges around the current front.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5839 (gain this round: n/a (first round)).
Feasible designs: 45 of 100 evaluations (37 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 273
- max_abs_err <= 0.000244141: 49% violate; best seen 5.46e-05 (2^-14.16)
- sys_p99_batch_us <= 0.44: 20% violate; best seen 0.161

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=1190, accuracy_bits=12, luts=841, ffs=349, throughput_msps=119, max_abs_err=0.00024 (2^-12.03), power_index=1.43
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1209, accuracy_bits=12.5, luts=855, ffs=354, throughput_msps=119, max_abs_err=0.00017 (2^-12.53), power_index=1.45
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1252, accuracy_bits=12.8, luts=947, ffs=305, throughput_msps=93.6, max_abs_err=0.000144 (2^-12.76), power_index=1.51
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1274, accuracy_bits=13.2, luts=920, ffs=354, throughput_msps=119, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1353, accuracy_bits=13.9, luts=1055, ffs=299, throughput_msps=93.6, max_abs_err=6.45e-05 (2^-13.92), power_index=1.63
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1391, accuracy_bits=14.2, luts=1086, ffs=305, throughput_msps=93.6, max_abs_err=5.46e-05 (2^-14.16), power_index=1.67
Front coverage: luts_plus_ffs 1190..1391 (HV reference 4000); accuracy_bits 12..14.2 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 12.76 bits
- pipelined: 50 evals, 28 feasible; max throughput seen 273 MSPS; best accuracy 14.11 bits; best feasible luts_plus_ffs=1796; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 30 evals, 17 feasible; max throughput seen 171 MSPS; best accuracy 14.16 bits; best feasible luts_plus_ffs=1190; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus 75% of the budget on pipelined_m (the dominant family on the front) and 25% on pipelined to confirm the trade-off. The ranges are narrowed to the feasible regions identified in round 1 to maximize the chance of finding better designs within the evaluation budget.*)
- `pipelined_m` (75 evals): data_width=16..18, n_iter=14..16, angle_guard=1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Pipelined_m dominates the front with luts_plus_ffs 1190-1391, much better than pipelined (1796). Narrowing to the feasible ranges found in round 1 (data_width 16-18, n_iter 14-16, angle_guard 1-2, frac_guard 0-2, m 2-4) focuses the search on the promising region.
- `pipelined` (25 evals): data_width=16..18, n_iter=14..16, angle_guard=1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined has higher throughput (273 MSPS) but higher area (1796). Including it with the same narrowed ranges allows the optimizer to confirm that pipelined_m is indeed superior on area, or to find any pipelined designs that might trade off area for accuracy.

**Result (code):** 100 evaluations this round, 200 total; 132 feasible; hypervolume 5898 (+1.0%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `luts_plus_ffs` between 1123 and 1391, which is significantly better than the best `pipelined` design (1768). The `unrolled_k` family is infeasible for throughput (max 10.3 MSPS < 32 MSPS required). The `iterative` family is also infeasible for throughput (1 result/cycle max ~100-200 MSPs depending on Fmax, but typically lower than pipelined for high accuracy, and specifically 1 result/cycle means latency is high, but more importantly, the throughput constraint is >= 32 MSPS. Iterative is 1 result per N+3 cycles. If N=14, that's 17 cycles. At 100 MHz, that's ~5.8 MSPS. This is far below 32 MSPS. So `iterative` is infeasible for throughput). Therefore, only `pipelined` and `pipelined_m` are viable. `pipelined_m` is clearly superior in area. The front currently spans `data_width` 17-18 and `n_iter` 14-16. To improve hypervolume, we should focus the search on the `pipelined_m` family within the known feasible region to find better trade-offs, potentially pushing `luts_plus_ffs` lower or `accuracy_bits` higher. The current best area is 1123 with 12.1 bits. We can try to reduce area further by lowering `data_width` to 16 (if accuracy allows) or optimizing `m` and `n_iter`. The feasible range for `pipelined_m` was data_width 16..18, n_iter 14..16, angle_guard 1..2, frac_guard 0..2, m 2..4. I will narrow the search to `pipelined_m` with these specific ranges to exhaustively map the front in this high-performing region.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 5898 (gain this round: +1.0%).
Feasible designs: 132 of 200 evaluations (90 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 10% violate; best seen 273
- max_abs_err <= 0.000244141: 31% violate; best seen 5.46e-05 (2^-14.16)
- sys_p99_batch_us <= 0.44: 10% violate; best seen 0.161

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1123, accuracy_bits=12.1, luts=841, ffs=282, throughput_msps=93.6, max_abs_err=0.000235 (2^-12.06), power_index=1.35
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1157, accuracy_bits=12.5, luts=868, ffs=289, throughput_msps=93.6, max_abs_err=0.000178 (2^-12.46), power_index=1.39
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1195, accuracy_bits=12.5, luts=904, ffs=291, throughput_msps=93.6, max_abs_err=0.000169 (2^-12.53), power_index=1.44
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1201, accuracy_bits=12.6, luts=906, ffs=295, throughput_msps=93.6, max_abs_err=0.00016 (2^-12.61), power_index=1.45
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1207, accuracy_bits=12.6, luts=926, ffs=280, throughput_msps=97.8, max_abs_err=0.000158 (2^-12.63), power_index=1.45
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1274, accuracy_bits=13.2, luts=920, ffs=354, throughput_msps=119, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1294, accuracy_bits=13.2, luts=1001, ffs=293, throughput_msps=93.6, max_abs_err=0.000104 (2^-13.23), power_index=1.56
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1313, accuracy_bits=13.5, luts=1017, ffs=297, throughput_msps=93.6, max_abs_err=8.82e-05 (2^-13.47), power_index=1.58
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1353, accuracy_bits=13.9, luts=1055, ffs=299, throughput_msps=93.6, max_abs_err=6.45e-05 (2^-13.92), power_index=1.63
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1391, accuracy_bits=14.2, luts=1086, ffs=305, throughput_msps=93.6, max_abs_err=5.46e-05 (2^-14.16), power_index=1.67
Front coverage: luts_plus_ffs 1123..1391 (HV reference 4000); accuracy_bits 12.1..14.2 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 12.76 bits
- pipelined: 75 evals, 50 feasible; max throughput seen 273 MSPS; best accuracy 14.11 bits; best feasible luts_plus_ffs=1768; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 105 evals, 82 feasible; max throughput seen 171 MSPS; best accuracy 14.16 bits; best feasible luts_plus_ffs=1123; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Narrowing to the feasible region of the best-performing family to maximize hypervolume gain within the remaining budget.*)
- `pipelined_m` (40 evals): data_width=16..18, n_iter=14..16, angle_guard=1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Focus on the dominant family `pipelined_m` within its proven feasible region to refine the Pareto front and potentially find lower area or higher accuracy designs.

**Result (code):** 40 evaluations this round, 240 total; 171 feasible; hypervolume 5927 (+0.5%).

**LLM decision:** `stop` — The exploration has successfully identified a feasible Pareto front dominated by the `pipelined_m` family, which satisfies all constraints including the strict system-level latency requirement (sys_p99_batch_us <= 0.44 us) and throughput (>= 32 MSPS). The best design achieves 1072 LUTs+FFs with 12.3 bits of accuracy, comfortably meeting the max_abs_err <= 2^-12 constraint. The front covers a reasonable range of the trade-off space (1072-1391 area, 12.3-14.2 accuracy bits), and the hypervolume gain in the final round was minimal (+0.5%), indicating convergence. The `unrolled_k` family was proven infeasible for the throughput constraint, and `iterative` was not explored but is unlikely to improve on the `pipelined_m` results given its lower throughput characteristics. The selection rule (min luts_plus_ffs) will pick the 1072-area design, which is well within the feasible region. No further exploration is warranted given the budget cap and diminishing returns.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 5927 (gain this round: +0.5%).
Feasible designs: 171 of 240 evaluations (113 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 273
- max_abs_err <= 0.000244141: 26% violate; best seen 5.46e-05 (2^-14.16)
- sys_p99_batch_us <= 0.44: 8% violate; best seen 0.161

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1072, accuracy_bits=12.3, luts=800, ffs=272, throughput_msps=97.8, max_abs_err=0.000204 (2^-12.26), power_index=1.29
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1133, accuracy_bits=12.5, luts=861, ffs=272, throughput_msps=97.8, max_abs_err=0.000168 (2^-12.54), power_index=1.36
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1201, accuracy_bits=12.6, luts=906, ffs=295, throughput_msps=93.6, max_abs_err=0.00016 (2^-12.61), power_index=1.45
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1207, accuracy_bits=12.6, luts=926, ffs=280, throughput_msps=97.8, max_abs_err=0.000158 (2^-12.63), power_index=1.45
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1227, accuracy_bits=12.9, luts=935, ffs=293, throughput_msps=93.6, max_abs_err=0.000127 (2^-12.95), power_index=1.48
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1294, accuracy_bits=13.2, luts=1001, ffs=293, throughput_msps=93.6, max_abs_err=0.000104 (2^-13.23), power_index=1.56
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1313, accuracy_bits=13.5, luts=1017, ffs=297, throughput_msps=93.6, max_abs_err=8.82e-05 (2^-13.47), power_index=1.58
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1327, accuracy_bits=13.5, luts=1037, ffs=291, throughput_msps=93.6, max_abs_err=8.59e-05 (2^-13.51), power_index=1.6
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1353, accuracy_bits=13.9, luts=1055, ffs=299, throughput_msps=93.6, max_abs_err=6.45e-05 (2^-13.92), power_index=1.63
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1391, accuracy_bits=14.2, luts=1086, ffs=305, throughput_msps=93.6, max_abs_err=5.46e-05 (2^-14.16), power_index=1.67
Front coverage: luts_plus_ffs 1072..1391 (HV reference 4000); accuracy_bits 12.3..14.2 (HV reference 12); data_width on the front 17..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 12.76 bits
- pipelined: 75 evals, 50 feasible; max throughput seen 273 MSPS; best accuracy 14.11 bits; best feasible luts_plus_ffs=1768; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 145 evals, 121 feasible; max throughput seen 171 MSPS; best accuracy 14.16 bits; best feasible luts_plus_ffs=1072; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (11 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 269 feasible; hypervolume 1.962e+04 (+231.0%).

**No LLM call** (code's front-mapping round): The exploration has successfully identified a feasible Pareto front dominated by the `pipelined_m` family, which satisfies all constraints including the strict system-level latency requirement (sys_p99_batch_us <= 0.44 us) and throughput (>= 32 MSPS). The best design achieves 1072 LUTs+FFs with 12.3 bits of accuracy, comfortably meeting the max_abs_err <= 2^-12 constraint. The front covers a reasonable range of the trade-off space (1072-1391 area, 12.3-14.2 accuracy bits), and the hypervolume gain in the final round was minimal (+0.5%), indicating convergence. The `unrolled_k` family was proven infeasible for the throughput constraint, and `iterative` was not explored but is unlikely to improve on the `pipelined_m` results given its lower throughput characteristics. The selection rule (min luts_plus_ffs) will pick the 1072-area design, which is well within the feasible region. No further exploration is warranted given the budget cap and diminishing returns.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.962e+04 (gain this round: +231.0%).
Feasible designs: 269 of 400 evaluations (198 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 273
- max_abs_err <= 0.000244141: 18% violate; best seen 3.07e-08 (2^-24.96)
- sys_p99_batch_us <= 0.44: 19% violate; best seen 0.161

Pareto front (feasible, 25 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1072, accuracy_bits=12.3, luts=800, ffs=272, throughput_msps=97.8, max_abs_err=0.000204 (2^-12.26), power_index=1.29
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1207, accuracy_bits=12.6, luts=926, ffs=280, throughput_msps=97.8, max_abs_err=0.000158 (2^-12.63), power_index=1.45
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1274, accuracy_bits=13.2, luts=920, ffs=354, throughput_msps=119, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1327, accuracy_bits=13.5, luts=1037, ffs=291, throughput_msps=93.6, max_abs_err=8.59e-05 (2^-13.51), power_index=1.6
- pipelined_m [data_width=22 n_iter=18 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1777, accuracy_bits=16.5, luts=1349, ffs=428, throughput_msps=89.6, max_abs_err=1.1e-05 (2^-16.47), power_index=2.14
- pipelined_m [data_width=22 n_iter=20 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1981, accuracy_bits=17.5, luts=1547, ffs=434, throughput_msps=89.6, max_abs_err=5.54e-06 (2^-17.46), power_index=2.38
- pipelined_m [data_width=23 n_iter=21 angle_guard=1 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=2251, accuracy_bits=18.1, luts=1649, ffs=602, throughput_msps=114, max_abs_err=3.47e-06 (2^-18.14), power_index=2.71
- pipelined_m [data_width=24 n_iter=23 angle_guard=3 frac_guard=2 rounding=round m=3] luts_plus_ffs=2767, accuracy_bits=20.7, luts=2026, ffs=741, throughput_msps=110, max_abs_err=5.75e-07 (2^-20.73), power_index=3.33
- pipelined_m [data_width=28 n_iter=23 angle_guard=3 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3037, accuracy_bits=21.7, luts=2208, ffs=829, throughput_msps=106, max_abs_err=3.01e-07 (2^-21.66), power_index=3.66
- pipelined_m [data_width=28 n_iter=28 angle_guard=3 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3731, accuracy_bits=23.3, luts=2708, ffs=1023, throughput_msps=106, max_abs_err=1e-07 (2^-23.25), power_index=4.49
Front coverage: luts_plus_ffs 1072..3731 (HV reference 4000); accuracy_bits 12.3..23.3 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 12.76 bits
- pipelined: 75 evals, 50 feasible; max throughput seen 273 MSPS; best accuracy 14.11 bits; best feasible luts_plus_ffs=1768; feasible ranges: data_width 16..18, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 305 evals, 219 feasible; max throughput seen 171 MSPS; best accuracy 24.96 bits; best feasible luts_plus_ffs=1072; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 12504 in, 4029 out
- provider-reported cost: $0.0105
- full prompts and replies: `llm_trace.jsonl`

