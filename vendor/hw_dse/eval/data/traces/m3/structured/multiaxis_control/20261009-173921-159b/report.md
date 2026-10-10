# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 813 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 276 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.31 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000194 (2^-12.33) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.36 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 6.02e-05 (2^-14.02) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.97 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.3 dBc, SNR 81.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=16,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=5` | 0.4342 → 0.4465 | no |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=16,angle_guard=3,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 813 | 276 | 93.6 | 6 | 1.31 | 0.000194 (2^-12.33) | 12.33 |
| 1 | `pipelined_m:data_width=16,n_iter=15,angle_guard=2,frac_guard=1,rounding=round,m=5` | 895 | 211 | 80.6 | 5 | 1.33 | 0.00018 (2^-12.44) | 12.44 |
| 2 | `pipelined_m:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=trunc,m=4` | 896 | 305 | 93.6 | 6 | 1.44 | 0.000163 (2^-12.58) | 12.58 |
| 3 | `pipelined_m:data_width=17,n_iter=16,angle_guard=3,frac_guard=0,rounding=round,m=4` | 954 | 280 | 93.6 | 6 | 1.49 | 0.000146 (2^-12.74) | 12.74 |
| 4 | `pipelined_m:data_width=19,n_iter=14,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 978 | 323 | 93.6 | 6 | 1.57 | 0.000136 (2^-12.84) | 12.84 |
| 5 | `pipelined_m:data_width=17,n_iter=16,angle_guard=3,frac_guard=1,rounding=round,m=4` | 1021 | 289 | 93.6 | 6 | 1.58 | 9.87e-05 (2^-13.31) | 13.31 |
| 6 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=3` | 1039 | 424 | 119.3 | 8 | 1.76 | 8.41e-05 (2^-13.54) | 13.54 |
| 7 | `pipelined_m:data_width=18,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc,m=3` | 1101 | 432 | 119.3 | 8 | 1.85 | 6.92e-05 (2^-13.82) | 13.82 |
| 8 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 1118 | 438 | 119.3 | 8 | 1.87 | 5.96e-05 (2^-14.03) | 14.03 |
| 9 | `pipelined_m:data_width=18,n_iter=17,angle_guard=2,frac_guard=2,rounding=round,m=3` | 1156 | 440 | 119.3 | 8 | 1.92 | 4.73e-05 (2^-14.37) | 14.37 |
| 10 | `pipelined_m:data_width=19,n_iter=18,angle_guard=2,frac_guard=3,rounding=round,m=4` | 1317 | 398 | 93.6 | 7 | 2.06 | 2.1e-05 (2^-15.54) | 15.54 |
| 11 | `pipelined_m:data_width=22,n_iter=18,angle_guard=3,frac_guard=3,rounding=round,m=4` | 1503 | 454 | 89.6 | 7 | 2.36 | 8.49e-06 (2^-16.85) | 16.85 |
| 12 | `pipelined_m:data_width=27,n_iter=18,angle_guard=-1,frac_guard=2,rounding=trunc,m=4` | 1618 | 510 | 86.0 | 7 | 2.56 | 7.98e-06 (2^-16.94) | 16.94 |
| 13 | `pipelined_m:data_width=25,n_iter=19,angle_guard=-1,frac_guard=0,rounding=round,m=3` | 1523 | 623 | 114.5 | 9 | 2.58 | 5.17e-06 (2^-17.56) | 17.56 |
| 14 | `pipelined_m:data_width=22,n_iter=21,angle_guard=1,frac_guard=2,rounding=round,m=4` | 1674 | 515 | 89.6 | 8 | 2.63 | 4.39e-06 (2^-17.80) | 17.80 |
| 15 | `pipelined_m:data_width=22,n_iter=21,angle_guard=1,frac_guard=3,rounding=round,m=4` | 1717 | 525 | 89.6 | 8 | 2.7 | 4.01e-06 (2^-17.93) | 17.93 |
| 16 | `pipelined_m:data_width=22,n_iter=21,angle_guard=4,frac_guard=3,rounding=trunc,m=4` | 1733 | 541 | 89.6 | 8 | 2.74 | 2.61e-06 (2^-18.55) | 18.55 |
| 17 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1953 | 559 | 89.6 | 8 | 3.02 | 1.14e-06 (2^-19.74) | 19.74 |
| 18 | `pipelined_m:data_width=27,n_iter=24,angle_guard=0,frac_guard=0,rounding=round,m=3` | 2114 | 765 | 110.0 | 10 | 3.46 | 3.79e-07 (2^-21.33) | 21.33 |
| 19 | `pipelined_m:data_width=28,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc,m=3` | 2211 | 799 | 110.0 | 10 | 3.62 | 2.99e-07 (2^-21.67) | 21.67 |
| 20 | `pipelined_m:data_width=27,n_iter=26,angle_guard=0,frac_guard=2,rounding=round,m=3` | 2459 | 888 | 110.0 | 11 | 4.03 | 2.57e-07 (2^-21.89) | 21.89 |
| 21 | `pipelined_m:data_width=28,n_iter=24,angle_guard=0,frac_guard=2,rounding=round,m=2` | 2342 | 1205 | 152.6 | 14 | 4.27 | 2.22e-07 (2^-22.11) | 22.11 |
| 22 | `pipelined_m:data_width=28,n_iter=25,angle_guard=4,frac_guard=0,rounding=trunc,m=2` | 2383 | 1303 | 147.4 | 15 | 4.44 | 2.16e-07 (2^-22.14) | 22.14 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *All 32 results must be back within 0.44 us, and the throughput constraint is 32 results/us. Iterative and unrolled_k designs take several cycles per result, so a 32-request burst would need well over 100 cycles and would queue past the deadline. I excluded them for now. That leaves the pipelined families, which accept one request per cycle. The 2^-12 error bound suggests data_width around 12-16 and n_iter around 12-14. The ranges extend to 20 and 18 so the accuracy_bits objective is covered above the 12 reference. Most of the budget goes to pipelined_m, since sharing registers is the main lever for LUTs+FFs. Later rounds can narrow m, n_iter and the guard bits once the first results show where the front sits.*)
- `pipelined_m` (60 evals): data_width=12..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Registering every m stages cuts FFs, which is what the area objective rewards. With one result per cycle, a 32-request burst needs only latency + 31 cycles, so a lower Fmax from chained stages may still meet 0.44 us. Searching the full m range lets the search find where timing breaks.
- `pipelined` (40 evals): data_width=12..20, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* This is the safe baseline for the burst deadline, with 1 result/cycle and the highest Fmax. It anchors the front and is the fallback if pipelined_m at high m fails the batch bound.

**Result (code):** 100 evaluations this round, 100 total; 25 feasible; hypervolume 6885 (n/a).

**LLM decision:** `refine` — Only pipelined and pipelined_m are feasible so far. Iterative and unrolled_k are skipped on the schedule alone: 32 results must be back within 0.44 us, and iterative takes N+3 cycles per result while unrolled_k takes ceil(N/k)+3. That cannot meet throughput_msps >= 32 or the batch bound, and the 282 MSPS best seen shows only fully pipelined structures clear them. The cheapest front point is pipelined_m m=4 at luts_plus_ffs=1310. It is the only pipelined_m configuration out of 60 evaluations that passed (4 feasible, all with m=4). Its Fmax of 93.6 MHz leaves little headroom on sys_p99_batch_us, so smaller m is the likelier feasible direction. Pipelined has the next-best points at 1989 and above. The front spans only 13.3..15.3 accuracy bits, and the constraint needs just 12. So the cheaper area end is unexplored. Next round targets smaller data_width (14..18), n_iter 12..17, and m 2..4 for pipelined_m, with a smaller share kept for pipelined.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6885 (gain this round: n/a (first round)).
Feasible designs: 25 of 100 evaluations (17 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 42% violate; best seen 2.43e-05 (2^-15.33)
- sys_p99_batch_us <= 0.44: 47% violate; best seen 0.159

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=16 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1310, accuracy_bits=13.3, luts=1021, ffs=289, throughput_msps=93.6, max_abs_err=9.87e-05 (2^-13.31), power_index=1.58
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=1989, accuracy_bits=13.3, luts=1000, ffs=989, throughput_msps=264, max_abs_err=9.76e-05 (2^-13.32), power_index=2.39
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] luts_plus_ffs=1999, accuracy_bits=13.4, luts=1002, ffs=997, throughput_msps=264, max_abs_err=8.97e-05 (2^-13.44), power_index=2.41
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=2061, accuracy_bits=13.7, luts=1034, ffs=1027, throughput_msps=264, max_abs_err=7.74e-05 (2^-13.66), power_index=2.48
- pipelined [data_width=19 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] luts_plus_ffs=2091, accuracy_bits=13.7, luts=1048, ffs=1042, throughput_msps=264, max_abs_err=7.28e-05 (2^-13.75), power_index=2.52
- pipelined [data_width=20 n_iter=16 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=2226, accuracy_bits=14.5, luts=1096, ffs=1130, throughput_msps=257, max_abs_err=4.33e-05 (2^-14.50), power_index=2.68
- pipelined [data_width=20 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] luts_plus_ffs=2286, accuracy_bits=14.5, luts=1128, ffs=1158, throughput_msps=257, max_abs_err=4.27e-05 (2^-14.51), power_index=2.75
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=2374, accuracy_bits=14.7, luts=1175, ffs=1199, throughput_msps=257, max_abs_err=3.71e-05 (2^-14.72), power_index=2.86
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=2404, accuracy_bits=14.8, luts=1188, ffs=1217, throughput_msps=264, max_abs_err=3.54e-05 (2^-14.79), power_index=2.89
- pipelined [data_width=20 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=2513, accuracy_bits=15.3, luts=1241, ffs=1271, throughput_msps=257, max_abs_err=2.54e-05 (2^-15.26), power_index=3.02
Front coverage: luts_plus_ffs 1310..2513 (HV reference 4000); accuracy_bits 13.3..15.3 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- pipelined: 40 evals, 21 feasible; max throughput seen 282 MSPS; best accuracy 15.26 bits; best feasible luts_plus_ffs=1903; feasible ranges: data_width 17..20, n_iter 15..18, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 60 evals, 4 feasible; max throughput seen 171 MSPS; best accuracy 15.33 bits; best feasible luts_plus_ffs=1310; feasible ranges: data_width 17..17, n_iter 16..16, angle_guard 3..3, frac_guard 1..1, m 4..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the low-area, moderate-accuracy region, where pipelined_m with small m is the most promising, and keep pipelined as a comparison.*)
- `pipelined_m` (67 evals): data_width=14..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..2, rounding=round|trunc, m=2..4. *Why:* Best front point is pipelined_m m=4 (1310). Smaller m and narrower width/iteration counts should give cheaper feasible designs, and smaller m raises Fmax for the batch bound.
- `pipelined` (33 evals): data_width=14..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..2, rounding=round|trunc. *Why:* All pipelined feasible designs sit at width 17..20 and n_iter 15..18; probing lower widths and iteration counts could find cheaper feasible points and cover the low-area end of the front.

**Result (code):** 100 evaluations this round, 200 total; 75 feasible; hypervolume 7641 (+11.0%).

**LLM decision:** `map_front` — The front (14 designs) already spans accuracy 12.3..15.3 bits against a reference of 12, and luts_plus_ffs 1090..2513 against a reference of 4000. Hypervolume rose 11% last round, so a code-driven NSGA-II pass seeded with the front should fill the curve between the pipelined_m (1090..1556) and pipelined (2226..2513) clusters. I am not adding iterative or unrolled_k. The control tick needs 32 results within 0.44 us and throughput of at least 32 MSPS. Those families accept one request every N+3 or ceil(N/k)+3 cycles, with N at least 14 for 2^-12 accuracy. Even at k=8 that is about 5 cycles per result, which is roughly 20 MSPS at pipelined_m clocks, short of 32 MSPS. They would also queue the 32-request burst and miss the batch bound. The pipelined families already meet both constraints, with 0% throughput violations and a best sys_p99_batch of 0.159 us. Both pipelined families are on the front, so mapping over their full ranges is the best use of the budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7641 (gain this round: +11.0%).
Feasible designs: 75 of 200 evaluations (54 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 46% violate; best seen 2.43e-05 (2^-15.33)
- sys_p99_batch_us <= 0.44: 24% violate; best seen 0.159

Pareto front (feasible, 14 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1090, accuracy_bits=12.3, luts=813, ffs=276, throughput_msps=93.6, max_abs_err=0.000194 (2^-12.33), power_index=1.31
- pipelined_m [data_width=17 n_iter=14 angle_guard=3 frac_guard=0 rounding=round m=3] luts_plus_ffs=1169, accuracy_bits=12.3, luts=827, ffs=342, throughput_msps=119, max_abs_err=0.000192 (2^-12.35), power_index=1.41
- pipelined_m [data_width=17 n_iter=16 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1234, accuracy_bits=12.7, luts=954, ffs=280, throughput_msps=93.6, max_abs_err=0.000146 (2^-12.74), power_index=1.49
- pipelined_m [data_width=17 n_iter=16 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1310, accuracy_bits=13.3, luts=1021, ffs=289, throughput_msps=93.6, max_abs_err=9.87e-05 (2^-13.31), power_index=1.58
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1533, accuracy_bits=13.8, luts=1101, ffs=432, throughput_msps=119, max_abs_err=6.92e-05 (2^-13.82), power_index=1.85
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1556, accuracy_bits=14, luts=1118, ffs=438, throughput_msps=119, max_abs_err=5.96e-05 (2^-14.03), power_index=1.87
- pipelined [data_width=20 n_iter=16 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=2226, accuracy_bits=14.5, luts=1096, ffs=1130, throughput_msps=257, max_abs_err=4.33e-05 (2^-14.50), power_index=2.68
- pipelined [data_width=20 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] luts_plus_ffs=2286, accuracy_bits=14.5, luts=1128, ffs=1158, throughput_msps=257, max_abs_err=4.27e-05 (2^-14.51), power_index=2.75
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=2404, accuracy_bits=14.8, luts=1188, ffs=1217, throughput_msps=264, max_abs_err=3.54e-05 (2^-14.79), power_index=2.89
- pipelined [data_width=20 n_iter=18 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=2513, accuracy_bits=15.3, luts=1241, ffs=1271, throughput_msps=257, max_abs_err=2.54e-05 (2^-15.26), power_index=3.02
Front coverage: luts_plus_ffs 1090..2513 (HV reference 4000); accuracy_bits 12.3..15.3 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- pipelined: 73 evals, 28 feasible; max throughput seen 282 MSPS; best accuracy 15.26 bits; best feasible luts_plus_ffs=1903; feasible ranges: data_width 16..20, n_iter 15..18, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 127 evals, 47 feasible; max throughput seen 178 MSPS; best accuracy 15.33 bits; best feasible luts_plus_ffs=1090; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard 0..3, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (26 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (9 front designs; box front_anchored)
- `pipelined` (14 evals): data_width=19..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (5 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 104 feasible; hypervolume 1.532e+04 (+100.5%).

**LLM decision:** `map_front` — Pipelined_m holds nearly the whole front: 1090 to 3050 LUTs+FFs and 12.3 to 20.9 accuracy bits, with the cheapest design at 1090. Pipelined is also on the feasible set but is worse on cost, with a best of 1903. The front has only 12 designs, and the last round gained +100.5% hypervolume, so coverage is still improving. There is a visible gap between about 14.0 and 16.9 bits. Iterative and unrolled_k are unlikely to help. They issue one result every several cycles, so serving 32 simultaneous requests inside 0.44 us would need very high clock rates, and they would struggle with throughput_msps >= 32. The pipelined families already clear both constraints with margin (throughput best 282, sys_p99_batch best 0.159). The remaining budget is best spent on NSGA-II over the full pipelined and pipelined_m ranges, seeded with the front, to fill the trade-off curve.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.532e+04 (gain this round: +100.5%).
Feasible designs: 104 of 240 evaluations (82 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 39% violate; best seen 5.1e-07 (2^-20.90)
- sys_p99_batch_us <= 0.44: 24% violate; best seen 0.159

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1090, accuracy_bits=12.3, luts=813, ffs=276, throughput_msps=93.6, max_abs_err=0.000194 (2^-12.33), power_index=1.31
- pipelined_m [data_width=16 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=5] luts_plus_ffs=1105, accuracy_bits=12.4, luts=895, ffs=211, throughput_msps=80.6, max_abs_err=0.00018 (2^-12.44), power_index=1.33
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=3] luts_plus_ffs=1209, accuracy_bits=12.5, luts=855, ffs=354, throughput_msps=119, max_abs_err=0.00017 (2^-12.53), power_index=1.45
- pipelined_m [data_width=17 n_iter=16 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1310, accuracy_bits=13.3, luts=1021, ffs=289, throughput_msps=93.6, max_abs_err=9.87e-05 (2^-13.31), power_index=1.58
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=3] luts_plus_ffs=1463, accuracy_bits=13.5, luts=1039, ffs=424, throughput_msps=119, max_abs_err=8.41e-05 (2^-13.54), power_index=1.76
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1533, accuracy_bits=13.8, luts=1101, ffs=432, throughput_msps=119, max_abs_err=6.92e-05 (2^-13.82), power_index=1.85
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1556, accuracy_bits=14, luts=1118, ffs=438, throughput_msps=119, max_abs_err=5.96e-05 (2^-14.03), power_index=1.87
- pipelined_m [data_width=27 n_iter=18 angle_guard=-1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2127, accuracy_bits=16.9, luts=1618, ffs=510, throughput_msps=86, max_abs_err=7.98e-06 (2^-16.94), power_index=2.56
- pipelined_m [data_width=25 n_iter=22 angle_guard=4 frac_guard=4 rounding=round m=3] luts_plus_ffs=2919, accuracy_bits=20.8, luts=2116, ffs=803, throughput_msps=110, max_abs_err=5.62e-07 (2^-20.76), power_index=3.51
- pipelined_m [data_width=27 n_iter=22 angle_guard=4 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=3050, accuracy_bits=20.9, luts=2196, ffs=854, throughput_msps=106, max_abs_err=5.1e-07 (2^-20.90), power_index=3.67
Front coverage: luts_plus_ffs 1090..3050 (HV reference 4000); accuracy_bits 12.3..20.9 (HV reference 12); data_width on the front 16..27 (registry 8..28).

Per family:
- pipelined: 87 evals, 42 feasible; max throughput seen 282 MSPS; best accuracy 20.66 bits; best feasible luts_plus_ffs=1903; feasible ranges: data_width 16..26, n_iter 14..29, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 153 evals, 62 feasible; max throughput seen 178 MSPS; best accuracy 20.90 bits; best feasible luts_plus_ffs=1090; feasible ranges: data_width 16..27, n_iter 14..27, angle_guard -2..4, frac_guard 0..4, m 2..5
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (12 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 165 feasible; hypervolume 1.869e+04 (+22.0%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible are valid. The constraints are clearly reachable: 165 of 340 evaluations are feasible, with 21 designs on the front. The cheapest feasible design is pipelined_m at luts_plus_ffs=1090, accuracy 12.3 bits, throughput 93.6 MSPS (constraint is 32) and max error 0.000194 (limit 0.000244). The front covers luts_plus_ffs 1090..3685 and accuracy_bits 12.3..22.1, so it spans a wide trade-off curve. The last round still gained 22% hypervolume, but the budget is nearly spent (340 of 400) and the selection rule picks the minimum-area corner, which has already been found. I did not explore iterative or unrolled_k. They issue a result only every several cycles, so a 32-request burst would queue and likely miss the 0.44 us p99 batch bound, and the pipelined_m front already meets it with a best observed value of 0.159 us.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 1.869e+04 (gain this round: +22.0%).
Feasible designs: 165 of 340 evaluations (133 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 31% violate; best seen 2.16e-07 (2^-22.14)
- sys_p99_batch_us <= 0.44: 27% violate; best seen 0.159

Pareto front (feasible, 21 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1090, accuracy_bits=12.3, luts=813, ffs=276, throughput_msps=93.6, max_abs_err=0.000194 (2^-12.33), power_index=1.31
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1200, accuracy_bits=12.6, luts=896, ffs=305, throughput_msps=93.6, max_abs_err=0.000163 (2^-12.58), power_index=1.44
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1301, accuracy_bits=12.8, luts=978, ffs=323, throughput_msps=93.6, max_abs_err=0.000136 (2^-12.84), power_index=1.57
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1533, accuracy_bits=13.8, luts=1101, ffs=432, throughput_msps=119, max_abs_err=6.92e-05 (2^-13.82), power_index=1.85
- pipelined_m [data_width=18 n_iter=17 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1596, accuracy_bits=14.4, luts=1156, ffs=440, throughput_msps=119, max_abs_err=4.73e-05 (2^-14.37), power_index=1.92
- pipelined_m [data_width=22 n_iter=18 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1957, accuracy_bits=16.8, luts=1503, ffs=454, throughput_msps=89.6, max_abs_err=8.49e-06 (2^-16.85), power_index=2.36
- pipelined_m [data_width=22 n_iter=21 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=2189, accuracy_bits=17.8, luts=1674, ffs=515, throughput_msps=89.6, max_abs_err=4.39e-06 (2^-17.80), power_index=2.63
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2512, accuracy_bits=19.7, luts=1953, ffs=559, throughput_msps=89.6, max_abs_err=1.14e-06 (2^-19.74), power_index=3.02
- pipelined_m [data_width=28 n_iter=24 angle_guard=1 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=3010, accuracy_bits=21.7, luts=2211, ffs=799, throughput_msps=110, max_abs_err=2.99e-07 (2^-21.67), power_index=3.62
- pipelined_m [data_width=28 n_iter=25 angle_guard=4 frac_guard=0 rounding=trunc m=2] luts_plus_ffs=3685, accuracy_bits=22.1, luts=2383, ffs=1303, throughput_msps=147, max_abs_err=2.16e-07 (2^-22.14), power_index=4.44
Front coverage: luts_plus_ffs 1090..3685 (HV reference 4000); accuracy_bits 12.3..22.1 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- pipelined: 87 evals, 42 feasible; max throughput seen 282 MSPS; best accuracy 20.66 bits; best feasible luts_plus_ffs=1903; feasible ranges: data_width 16..26, n_iter 14..29, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 253 evals, 123 feasible; max throughput seen 178 MSPS; best accuracy 22.14 bits; best feasible luts_plus_ffs=1090; feasible ranges: data_width 15..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..5
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (21 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 197 feasible; hypervolume 1.88e+04 (+0.6%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible are valid. The constraints are clearly reachable: 165 of 340 evaluations are feasible, with 21 designs on the front. The cheapest feasible design is pipelined_m at luts_plus_ffs=1090, accuracy 12.3 bits, throughput 93.6 MSPS (constraint is 32) and max error 0.000194 (limit 0.000244). The front covers luts_plus_ffs 1090..3685 and accuracy_bits 12.3..22.1, so it spans a wide trade-off curve. The last round still gained 22% hypervolume, but the budget is nearly spent (340 of 400) and the selection rule picks the minimum-area corner, which has already been found. I did not explore iterative or unrolled_k. They issue a result only every several cycles, so a 32-request burst would queue and likely miss the 0.44 us p99 batch bound, and the pipelined_m front already meets it with a best observed value of 0.159 us.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.88e+04 (gain this round: +0.6%).
Feasible designs: 197 of 400 evaluations (161 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 28% violate; best seen 8.92e-08 (2^-23.42)
- sys_p99_batch_us <= 0.44: 29% violate; best seen 0.159

Pareto front (feasible, 23 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1090, accuracy_bits=12.3, luts=813, ffs=276, throughput_msps=93.6, max_abs_err=0.000194 (2^-12.33), power_index=1.31
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1200, accuracy_bits=12.6, luts=896, ffs=305, throughput_msps=93.6, max_abs_err=0.000163 (2^-12.58), power_index=1.44
- pipelined_m [data_width=17 n_iter=16 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1310, accuracy_bits=13.3, luts=1021, ffs=289, throughput_msps=93.6, max_abs_err=9.87e-05 (2^-13.31), power_index=1.58
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1533, accuracy_bits=13.8, luts=1101, ffs=432, throughput_msps=119, max_abs_err=6.92e-05 (2^-13.82), power_index=1.85
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1715, accuracy_bits=15.5, luts=1317, ffs=398, throughput_msps=93.6, max_abs_err=2.1e-05 (2^-15.54), power_index=2.06
- pipelined_m [data_width=27 n_iter=18 angle_guard=-1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2127, accuracy_bits=16.9, luts=1618, ffs=510, throughput_msps=86, max_abs_err=7.98e-06 (2^-16.94), power_index=2.56
- pipelined_m [data_width=22 n_iter=21 angle_guard=1 frac_guard=3 rounding=round m=4] luts_plus_ffs=2241, accuracy_bits=17.9, luts=1717, ffs=525, throughput_msps=89.6, max_abs_err=4.01e-06 (2^-17.93), power_index=2.7
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2512, accuracy_bits=19.7, luts=1953, ffs=559, throughput_msps=89.6, max_abs_err=1.14e-06 (2^-19.74), power_index=3.02
- pipelined_m [data_width=27 n_iter=26 angle_guard=0 frac_guard=2 rounding=round m=3] luts_plus_ffs=3347, accuracy_bits=21.9, luts=2459, ffs=888, throughput_msps=110, max_abs_err=2.57e-07 (2^-21.89), power_index=4.03
- pipelined_m [data_width=28 n_iter=25 angle_guard=4 frac_guard=0 rounding=trunc m=2] luts_plus_ffs=3685, accuracy_bits=22.1, luts=2383, ffs=1303, throughput_msps=147, max_abs_err=2.16e-07 (2^-22.14), power_index=4.44
Front coverage: luts_plus_ffs 1090..3685 (HV reference 4000); accuracy_bits 12.3..22.1 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- pipelined: 87 evals, 42 feasible; max throughput seen 282 MSPS; best accuracy 20.66 bits; best feasible luts_plus_ffs=1903; feasible ranges: data_width 16..26, n_iter 14..29, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 313 evals, 155 feasible; max throughput seen 178 MSPS; best accuracy 23.42 bits; best feasible luts_plus_ffs=1090; feasible ranges: data_width 15..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..5
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 29640 in, 5412 out
- provider-reported cost: $0.1134
- full prompts and replies: `llm_trace.jsonl`

