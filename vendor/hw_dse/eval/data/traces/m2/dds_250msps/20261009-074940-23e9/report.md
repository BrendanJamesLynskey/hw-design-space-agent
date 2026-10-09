# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec dds_250msps: NCO / DDS sin-cos generator for a digital up-converter. One sample per clock at >= 250 MSPS, max error <= 2^-13. Minimise LUTs.
  constraint: throughput_msps >= 250
  constraint: max_abs_err <= 0.00012207
  objective: min luts (HV ref 4000)
  objective: max accuracy_bits (HV ref 13)
  select: min luts
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined:data_width=19,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 935 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 969 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 17.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000108 (2^-13.18) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 14.1 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.75e-05 (2^-15.15) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.6 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13.2 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (31 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=19,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 935 | 969 | 264.5 | 17 | 17.9 | 0.000108 (2^-13.18) | 13.18 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 964 | 999 | 264.5 | 17 | 18.5 | 8.33e-05 (2^-13.55) | 13.55 |
| 2 | `pipelined:data_width=19,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 979 | 1014 | 264.5 | 17 | 18.7 | 8.25e-05 (2^-13.57) | 13.57 |
| 3 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 994 | 1029 | 264.5 | 17 | 19 | 7.63e-05 (2^-13.68) | 13.68 |
| 4 | `pipelined:data_width=20,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 1033 | 1065 | 264.5 | 18 | 19.7 | 6.98e-05 (2^-13.81) | 13.81 |
| 5 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 1048 | 1073 | 264.5 | 18 | 20 | 6.86e-05 (2^-13.83) | 13.83 |
| 6 | `pipelined:data_width=19,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 1067 | 1098 | 264.5 | 19 | 20.4 | 6.32e-05 (2^-13.95) | 13.95 |
| 7 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=trunc` | 1080 | 1114 | 264.5 | 18 | 20.6 | 5.76e-05 (2^-14.08) | 14.08 |
| 8 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 1086 | 1076 | 264.5 | 18 | 20.3 | 5.46e-05 (2^-14.16) | 14.16 |
| 9 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 1096 | 1126 | 264.5 | 18 | 20.9 | 4.71e-05 (2^-14.37) | 14.37 |
| 10 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 1112 | 1142 | 264.5 | 18 | 21.2 | 4.27e-05 (2^-14.51) | 14.51 |
| 11 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1135 | 1166 | 264.5 | 19 | 21.6 | 3.32e-05 (2^-14.88) | 14.88 |
| 12 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 1152 | 1183 | 264.5 | 19 | 22 | 2.85e-05 (2^-15.10) | 15.10 |
| 13 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 1209 | 1195 | 264.5 | 19 | 22.6 | 2.76e-05 (2^-15.14) | 15.14 |
| 14 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=0,rounding=round` | 1223 | 1253 | 264.5 | 20 | 23.3 | 2.42e-05 (2^-15.34) | 15.34 |
| 15 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 1228 | 1216 | 264.5 | 19 | 23 | 2.38e-05 (2^-15.36) | 15.36 |
| 16 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 1261 | 1246 | 264.5 | 19 | 23.6 | 2.23e-05 (2^-15.45) | 15.45 |
| 17 | `pipelined:data_width=20,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc` | 1277 | 1299 | 264.5 | 20 | 24.2 | 2.18e-05 (2^-15.49) | 15.49 |
| 18 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc` | 1287 | 1313 | 256.5 | 19 | 24.4 | 1.97e-05 (2^-15.63) | 15.63 |
| 19 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=2,rounding=trunc` | 1295 | 1318 | 264.5 | 20 | 24.6 | 1.92e-05 (2^-15.67) | 15.67 |
| 20 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 1301 | 1287 | 264.5 | 20 | 24.3 | 1.89e-05 (2^-15.69) | 15.69 |
| 21 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=2,rounding=round` | 1337 | 1320 | 264.5 | 20 | 25 | 1.51e-05 (2^-16.01) | 16.01 |
| 22 | `pipelined:data_width=22,n_iter=18,angle_guard=3,frac_guard=0,rounding=round` | 1349 | 1380 | 256.5 | 20 | 25.7 | 1.1e-05 (2^-16.47) | 16.47 |
| 23 | `pipelined:data_width=21,n_iter=19,angle_guard=2,frac_guard=3,rounding=trunc` | 1466 | 1483 | 256.5 | 21 | 27.7 | 8.4e-06 (2^-16.86) | 16.86 |
| 24 | `pipelined:data_width=25,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 1474 | 1507 | 256.5 | 20 | 28 | 8.18e-06 (2^-16.90) | 16.90 |
| 25 | `pipelined:data_width=21,n_iter=20,angle_guard=1,frac_guard=2,rounding=round` | 1531 | 1507 | 256.5 | 22 | 28.6 | 8.09e-06 (2^-16.91) | 16.91 |
| 26 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=1,rounding=round` | 1593 | 1572 | 256.5 | 22 | 29.8 | 4.05e-06 (2^-17.91) | 17.91 |
| 27 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=2,rounding=round` | 1633 | 1608 | 256.5 | 22 | 30.5 | 3.33e-06 (2^-18.20) | 18.20 |
| 28 | `pipelined:data_width=23,n_iter=24,angle_guard=2,frac_guard=1,rounding=round` | 1968 | 1935 | 256.5 | 26 | 36.7 | 1.94e-06 (2^-18.98) | 18.98 |
| 29 | `pipelined:data_width=25,n_iter=24,angle_guard=-1,frac_guard=1,rounding=round` | 2045 | 2008 | 256.5 | 26 | 38.1 | 1.85e-06 (2^-19.05) | 19.05 |
| 30 | `pipelined:data_width=25,n_iter=26,angle_guard=1,frac_guard=0,rounding=round` | 2165 | 2177 | 256.5 | 28 | 40.8 | 1.05e-06 (2^-19.86) | 19.86 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=250 MSPS, 1 sample/clock) eliminates iterative (N+3 cycles/result) and makes unrolled_k marginal (ceil(N/k)+3 cycles/result; even with k=8, N=12 gives 5 cycles/result, requiring >1250 MHz Fmax which is unrealistic on Artix-7). Pipelined and pipelined_m are the only viable families for throughput. I allocate 50% to pipelined (the primary area/accuracy trade-off family) and 30% to pipelined_m (which can reduce area via fewer registers). 20% goes to unrolled_k to confirm infeasibility. Parameter ranges focus on data_width 14-20 and n_iter 12-18 where accuracy_bits crosses the 13-bit threshold (max_abs_err <= 2^-13 = 0.00012207). angle_guard and frac_guard ranges are kept tight to explore the accuracy/area trade-off efficiently. Rounding is included as a choice since it affects accuracy at no significant area cost.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined and pipelined_m can meet the >=250 MSPS throughput constraint (1 result/cycle). Pipelined is the baseline for area/accuracy trade-off. data_width 14-20 and n_iter 12-18 cover the range where accuracy_bits crosses the 13-bit threshold while keeping LUTs low. angle_guard -1..2 and frac_guard 0..2 explore the accuracy/area trade-off without excessive width.
- `pipelined_m` (30 evals): data_width=14..20, n_iter=12..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m registers every m stages, reducing FF count and potentially LUTs (smaller datapath segments) while still achieving 1 result/cycle throughput. m=2..4 is a reasonable range: m=2 halves register count vs full pipeline, m=4 quarters it. Same accuracy parameters as pipelined since accuracy is identical across families for the same core params.
- `unrolled_k` (20 evals): data_width=14..20, n_iter=12..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k with k=4..8 can achieve 1 result/cycle if ceil(N/k)+3 <= 1, which is impossible. Wait: ceil(N/k)+3 cycles/result. For N=12, k=8: ceil(12/8)+3 = 2+3 = 5 cycles. This cannot meet 250 MSPS at reasonable Fmax. However, if Fmax is very high (e.g., 1250 MHz), 5 cycles/result gives 250 MSPS. This is unlikely on Artix-7. Including it with small budget to confirm infeasibility or find edge cases. Actually, even at 500 MHz, 5 cycles = 100 MSPS < 250. So unrolled_k is likely infeasible for throughput. Keeping small share to verify.

**Result (code):** 100 evaluations this round, 100 total; 30 feasible; hypervolume 6854 (n/a).

**LLM decision:** `refine` — The `pipelined` family is the only one meeting the throughput constraint (>= 250 MSPS), while `unrolled_k` (max 11.6 MSPS) and `pipelined_m` (max 171 MSPS) are infeasible. The current Pareto front is dominated by `pipelined` designs with `data_width` 18-20 and `n_iter` 15-18. The best LUT count is 949 at 13.2 accuracy bits. To improve hypervolume, we need to explore the trade-off between LUTs and accuracy more densely. Specifically, we should narrow the search to `pipelined` with `data_width` 18-20, `n_iter` 14-19, `angle_guard` 0-2, and `frac_guard` 0-2 to find better LUT/accuracy trade-offs. The `iterative` family is not worth exploring as it will likely have low throughput similar to `unrolled_k`.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6854 (gain this round: n/a (first round)).
Feasible designs: 30 of 100 evaluations (23 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 45% violate; best seen 2.34e-05 (2^-15.38)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] luts=949, accuracy_bits=13.2, ffs=984, throughput_msps=264, max_abs_err=0.000109 (2^-13.17), power_index=18.2
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts=964, accuracy_bits=13.6, ffs=999, throughput_msps=264, max_abs_err=8.33e-05 (2^-13.55), power_index=18.5
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=1008, accuracy_bits=13.6, ffs=1036, throughput_msps=264, max_abs_err=8.04e-05 (2^-13.60), power_index=19.2
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] luts=1095, accuracy_bits=13.8, ffs=1084, throughput_msps=264, max_abs_err=6.89e-05 (2^-13.82), power_index=20.5
- pipelined [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] luts=1139, accuracy_bits=14, ffs=1126, throughput_msps=264, max_abs_err=5.95e-05 (2^-14.04), power_index=21.3
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc] luts=1152, accuracy_bits=14.4, ffs=1175, throughput_msps=264, max_abs_err=4.75e-05 (2^-14.36), power_index=21.9
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts=1170, accuracy_bits=14.7, ffs=1199, throughput_msps=264, max_abs_err=3.86e-05 (2^-14.66), power_index=22.3
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1209, accuracy_bits=15.1, ffs=1195, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.6
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] luts=1281, accuracy_bits=15.4, ffs=1265, throughput_msps=264, max_abs_err=2.34e-05 (2^-15.38), power_index=23.9
Front coverage: luts 949..1281 (HV reference 4000); accuracy_bits 13.2..15.4 (HV reference 13); data_width on the front 18..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 14.83 bits
- pipelined: 50 evals, 30 feasible; max throughput seen 273 MSPS; best accuracy 15.38 bits; best feasible luts=949; feasible ranges: data_width 18..20, n_iter 15..18, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.68 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Narrowing to the promising region of the pipelined family to maximize hypervolume within the remaining budget.*)
- `pipelined` (100 evals): data_width=18..20, n_iter=14..19, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Focus on the only feasible family to refine the Pareto front in the LUT/accuracy trade-off space.

**Result (code):** 100 evaluations this round, 200 total; 110 feasible; hypervolume 8650 (+26.2%).

**LLM decision:** `refine` — The `pipelined` family is the only one meeting the throughput constraint (>= 250 MSPS), while `unrolled_k` and `pipelined_m` failed significantly (max 11.6 and 171 MSPS respectively). The current Pareto front is dominated by `pipelined` designs with `data_width` 18-20 and `n_iter` 15-19. The best LUT count is 935 with 13.2 bits accuracy. To improve hypervolume, we need to explore if lower LUTs are possible with slightly different parameters or if higher accuracy can be achieved without excessive LUT increase. The current ranges for `pipelined` are already narrow (data_width 18-20, n_iter 15-19). I will refine by slightly widening `data_width` to 17-21 to check if W=17 can meet accuracy with more iterations, or if W=21 offers better LUT/accuracy trade-offs, and keep `n_iter` 14-20 to explore the boundary of the accuracy constraint. I will also include `angle_guard` -1 to 2 and `frac_guard` 0 to 2 as seen in feasible designs.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8650 (gain this round: +26.2%).
Feasible designs: 110 of 200 evaluations (71 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 273
- max_abs_err <= 0.00012207: 32% violate; best seen 1.51e-05 (2^-16.01)

Pareto front (feasible, 19 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts=935, accuracy_bits=13.2, ffs=969, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=17.9
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts=1048, accuracy_bits=13.8, ffs=1073, throughput_msps=264, max_abs_err=6.86e-05 (2^-13.83), power_index=20
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] luts=1080, accuracy_bits=14.1, ffs=1114, throughput_msps=264, max_abs_err=5.76e-05 (2^-14.08), power_index=20.6
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] luts=1096, accuracy_bits=14.4, ffs=1126, throughput_msps=264, max_abs_err=4.71e-05 (2^-14.37), power_index=20.9
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts=1143, accuracy_bits=14.6, ffs=1170, throughput_msps=264, max_abs_err=3.93e-05 (2^-14.63), power_index=21.8
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1209, accuracy_bits=15.1, ffs=1195, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.6
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] luts=1259, accuracy_bits=15.3, ffs=1285, throughput_msps=264, max_abs_err=2.4e-05 (2^-15.35), power_index=23.9
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc] luts=1295, accuracy_bits=15.7, ffs=1318, throughput_msps=264, max_abs_err=1.92e-05 (2^-15.67), power_index=24.6
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] luts=1337, accuracy_bits=16, ffs=1320, throughput_msps=264, max_abs_err=1.51e-05 (2^-16.01), power_index=25
Front coverage: luts 935..1337 (HV reference 4000); accuracy_bits 13.2..16 (HV reference 13); data_width on the front 18..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 14.83 bits
- pipelined: 150 evals, 110 feasible; max throughput seen 273 MSPS; best accuracy 16.01 bits; best feasible luts=935; feasible ranges: data_width 18..20, n_iter 15..19, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.68 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Only pipelined meets throughput. Refine its parameter space to better map the Pareto front.*)
- `pipelined` (40 evals): data_width=17..21, n_iter=14..20, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Focus exclusively on the only feasible family. Slightly widen data_width and n_iter to explore the boundaries of the LUT/accuracy trade-off more thoroughly.

**Result (code):** 40 evaluations this round, 240 total; 140 feasible; hypervolume 9175 (+6.1%).

**LLM decision:** `stop` — The spec is feasible: the pipelined family yields 140 feasible designs, with the best LUT count of 935 (pipelined, data_width=19, n_iter=15) meeting the throughput constraint (264 MSPS >= 250) and the accuracy constraint (max_abs_err=0.000108 <= 0.00012207). The Pareto front spans 935..1390 LUTs and 13.2..16.2 accuracy bits, covering the trade-off curve well. unrolled_k and pipelined_m cannot meet the 250 MSPS throughput constraint (max 11.6 and 171 MSPS respectively), so they are correctly excluded from the front. Since this is the final round and the front is well-mapped with a clear minimum-LUT design, stopping is appropriate.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9175 (gain this round: +6.1%).
Feasible designs: 140 of 240 evaluations (88 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 21% violate; best seen 273
- max_abs_err <= 0.00012207: 31% violate; best seen 1.31e-05 (2^-16.21)

Pareto front (feasible, 20 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts=935, accuracy_bits=13.2, ffs=969, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=17.9
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts=1048, accuracy_bits=13.8, ffs=1073, throughput_msps=264, max_abs_err=6.86e-05 (2^-13.83), power_index=20
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] luts=1080, accuracy_bits=14.1, ffs=1114, throughput_msps=264, max_abs_err=5.76e-05 (2^-14.08), power_index=20.6
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] luts=1096, accuracy_bits=14.4, ffs=1126, throughput_msps=264, max_abs_err=4.71e-05 (2^-14.37), power_index=20.9
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1152, accuracy_bits=15.1, ffs=1183, throughput_msps=264, max_abs_err=2.85e-05 (2^-15.10), power_index=22
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=0 rounding=round] luts=1223, accuracy_bits=15.3, ffs=1253, throughput_msps=264, max_abs_err=2.42e-05 (2^-15.34), power_index=23.3
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc] luts=1277, accuracy_bits=15.5, ffs=1299, throughput_msps=264, max_abs_err=2.18e-05 (2^-15.49), power_index=24.2
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] luts=1301, accuracy_bits=15.7, ffs=1287, throughput_msps=264, max_abs_err=1.89e-05 (2^-15.69), power_index=24.3
- pipelined [data_width=21 n_iter=19 angle_guard=2 frac_guard=1 rounding=trunc] luts=1390, accuracy_bits=16.2, ffs=1415, throughput_msps=257, max_abs_err=1.31e-05 (2^-16.21), power_index=26.4
Front coverage: luts 935..1390 (HV reference 4000); accuracy_bits 13.2..16.2 (HV reference 13); data_width on the front 18..21 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 14.83 bits
- pipelined: 190 evals, 140 feasible; max throughput seen 273 MSPS; best accuracy 16.21 bits; best feasible luts=935; feasible ranges: data_width 18..21, n_iter 15..20, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.68 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (160 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (20 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 242 feasible; hypervolume 1.728e+04 (+88.3%).

**No LLM call** (code's front-mapping round): The spec is feasible: the pipelined family yields 140 feasible designs, with the best LUT count of 935 (pipelined, data_width=19, n_iter=15) meeting the throughput constraint (264 MSPS >= 250) and the accuracy constraint (max_abs_err=0.000108 <= 0.00012207). The Pareto front spans 935..1390 LUTs and 13.2..16.2 accuracy bits, covering the trade-off curve well. unrolled_k and pipelined_m cannot meet the 250 MSPS throughput constraint (max 11.6 and 171 MSPS respectively), so they are correctly excluded from the front. Since this is the final round and the front is well-mapped with a clear minimum-LUT design, stopping is appropriate.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.728e+04 (gain this round: +88.3%).
Feasible designs: 242 of 400 evaluations (173 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 22% violate; best seen 273
- max_abs_err <= 0.00012207: 24% violate; best seen 8.54e-08 (2^-23.48)

Pareto front (feasible, 31 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts=935, accuracy_bits=13.2, ffs=969, throughput_msps=264, max_abs_err=0.000108 (2^-13.18), power_index=17.9
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=trunc] luts=1080, accuracy_bits=14.1, ffs=1114, throughput_msps=264, max_abs_err=5.76e-05 (2^-14.08), power_index=20.6
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts=1112, accuracy_bits=14.5, ffs=1142, throughput_msps=264, max_abs_err=4.27e-05 (2^-14.51), power_index=21.2
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] luts=1209, accuracy_bits=15.1, ffs=1195, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.6
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc] luts=1277, accuracy_bits=15.5, ffs=1299, throughput_msps=264, max_abs_err=2.18e-05 (2^-15.49), power_index=24.2
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] luts=1301, accuracy_bits=15.7, ffs=1287, throughput_msps=264, max_abs_err=1.89e-05 (2^-15.69), power_index=24.3
- pipelined [data_width=21 n_iter=19 angle_guard=2 frac_guard=3 rounding=trunc] luts=1466, accuracy_bits=16.9, ffs=1483, throughput_msps=257, max_abs_err=8.4e-06 (2^-16.86), power_index=27.7
- pipelined [data_width=22 n_iter=20 angle_guard=3 frac_guard=2 rounding=round] luts=1633, accuracy_bits=18.2, ffs=1608, throughput_msps=257, max_abs_err=3.33e-06 (2^-18.20), power_index=30.5
- pipelined [data_width=25 n_iter=26 angle_guard=1 frac_guard=0 rounding=round] luts=2165, accuracy_bits=19.9, ffs=2177, throughput_msps=257, max_abs_err=1.05e-06 (2^-19.86), power_index=40.8
Front coverage: luts 935..2165 (HV reference 4000); accuracy_bits 13.2..19.9 (HV reference 13); data_width on the front 18..25 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 14.83 bits
- pipelined: 350 evals, 242 feasible; max throughput seen 273 MSPS; best accuracy 23.48 bits; best feasible luts=935; feasible ranges: data_width 17..25, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.68 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10808 in, 2899 out
- provider-reported cost: $0.0072
- full prompts and replies: `llm_trace.jsonl`

