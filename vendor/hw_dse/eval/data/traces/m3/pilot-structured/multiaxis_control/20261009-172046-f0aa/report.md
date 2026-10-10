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
`pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 882 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 301 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.42 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000145 (2^-12.76) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 18.9 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.05e-05 (2^-14.27) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 6.62 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.8 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 96.0 dBc, SNR 83.0 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=20,n_iter=15,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (30 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 882 | 301 | 93.6 | 6 | 1.42 | 0.000145 (2^-12.76) | 12.76 |
| 1 | `pipelined_m:data_width=19,n_iter=15,angle_guard=0,frac_guard=0,rounding=round,m=4` | 935 | 297 | 93.6 | 6 | 1.48 | 0.000108 (2^-13.18) | 13.18 |
| 2 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=4` | 949 | 301 | 93.6 | 6 | 1.5 | 8.66e-05 (2^-13.50) | 13.50 |
| 3 | `pipelined_m:data_width=20,n_iter=15,angle_guard=0,frac_guard=0,rounding=round,m=4` | 979 | 311 | 93.6 | 6 | 1.55 | 8.24e-05 (2^-13.57) | 13.57 |
| 4 | `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1023 | 317 | 93.6 | 6 | 1.61 | 7.77e-05 (2^-13.65) | 13.65 |
| 5 | `pipelined_m:data_width=20,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1023 | 321 | 93.6 | 6 | 1.62 | 7.76e-05 (2^-13.65) | 13.65 |
| 6 | `pipelined_m:data_width=20,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 994 | 383 | 119.3 | 7 | 1.66 | 7.63e-05 (2^-13.68) | 13.68 |
| 7 | `pipelined_m:data_width=20,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1053 | 327 | 93.6 | 6 | 1.66 | 7.38e-05 (2^-13.73) | 13.73 |
| 8 | `pipelined_m:data_width=21,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1067 | 335 | 93.6 | 6 | 1.69 | 6.67e-05 (2^-13.87) | 13.87 |
| 9 | `pipelined_m:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,m=3` | 1055 | 430 | 119.3 | 8 | 1.79 | 6.45e-05 (2^-13.92) | 13.92 |
| 10 | `pipelined_m:data_width=19,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc,m=4` | 1170 | 369 | 93.6 | 7 | 1.85 | 5.95e-05 (2^-14.04) | 14.04 |
| 11 | `pipelined_m:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1169 | 387 | 93.6 | 7 | 1.87 | 3.81e-05 (2^-14.68) | 14.68 |
| 12 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1211 | 393 | 93.6 | 7 | 1.93 | 2.58e-05 (2^-15.24) | 15.24 |
| 13 | `pipelined_m:data_width=20,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=3` | 1219 | 478 | 119.3 | 8 | 2.04 | 2.57e-05 (2^-15.25) | 15.25 |
| 14 | `pipelined_m:data_width=20,n_iter=17,angle_guard=2,frac_guard=1,rounding=round,m=3` | 1228 | 470 | 119.3 | 8 | 2.04 | 2.38e-05 (2^-15.36) | 15.36 |
| 15 | `pipelined_m:data_width=21,n_iter=17,angle_guard=1,frac_guard=3,rounding=trunc,m=4` | 1287 | 425 | 89.6 | 7 | 2.06 | 2.07e-05 (2^-15.56) | 15.56 |
| 16 | `pipelined_m:data_width=23,n_iter=17,angle_guard=3,frac_guard=0,rounding=trunc,m=4` | 1320 | 445 | 89.6 | 7 | 2.12 | 1.81e-05 (2^-15.75) | 15.75 |
| 17 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 1507 | 579 | 114.5 | 9 | 2.51 | 6.93e-06 (2^-17.14) | 17.14 |
| 18 | `pipelined_m:data_width=21,n_iter=21,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1630 | 500 | 89.6 | 8 | 2.56 | 5.47e-06 (2^-17.48) | 17.48 |
| 19 | `pipelined_m:data_width=23,n_iter=21,angle_guard=0,frac_guard=1,rounding=trunc,m=3` | 1628 | 595 | 114.5 | 9 | 2.68 | 4.61e-06 (2^-17.73) | 17.73 |
| 20 | `pipelined_m:data_width=23,n_iter=21,angle_guard=0,frac_guard=2,rounding=round,m=4` | 1719 | 529 | 89.6 | 8 | 2.71 | 3.77e-06 (2^-18.02) | 18.02 |
| 21 | `pipelined_m:data_width=23,n_iter=21,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 1649 | 602 | 114.5 | 9 | 2.71 | 3.47e-06 (2^-18.14) | 18.14 |
| 22 | `pipelined_m:data_width=23,n_iter=22,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1780 | 525 | 89.6 | 8 | 2.77 | 2.54e-06 (2^-18.58) | 18.58 |
| 23 | `pipelined_m:data_width=25,n_iter=20,angle_guard=0,frac_guard=1,rounding=round,m=3` | 1720 | 644 | 114.5 | 9 | 2.84 | 2.49e-06 (2^-18.61) | 18.61 |
| 24 | `pipelined_m:data_width=24,n_iter=21,angle_guard=0,frac_guard=2,rounding=round,m=3` | 1784 | 633 | 114.5 | 9 | 2.91 | 2.44e-06 (2^-18.65) | 18.65 |
| 25 | `pipelined_m:data_width=23,n_iter=23,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1955 | 547 | 89.6 | 8 | 3.01 | 1.18e-06 (2^-19.69) | 19.69 |
| 26 | `pipelined_m:data_width=28,n_iter=23,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 2208 | 829 | 105.9 | 10 | 3.66 | 3.01e-07 (2^-21.66) | 21.66 |
| 27 | `pipelined_m:data_width=27,n_iter=24,angle_guard=4,frac_guard=2,rounding=round,m=3` | 2365 | 827 | 105.9 | 10 | 3.84 | 1.63e-07 (2^-22.55) | 22.55 |
| 28 | `pipelined_m:data_width=27,n_iter=28,angle_guard=4,frac_guard=2,rounding=trunc,m=3` | 2708 | 1019 | 105.9 | 12 | 4.49 | 1.15e-07 (2^-23.05) | 23.05 |
| 29 | `pipelined_m:data_width=28,n_iter=28,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 2708 | 1023 | 105.9 | 12 | 4.49 | 1e-07 (2^-23.25) | 23.25 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec is throughput- and latency-dominated: a 1MHz tick fires 32 requests at once and all must return within 0.44us, with max error <= 2^-12. Only the 1-result/cycle families (pipelined, pipelined_m) can reliably clear the 32 req/us burst and the tight p99 batch bound, so they get the bulk of the budget (0.5 + 0.3). pipelined is the latency/Fmax-safe anchor; pipelined_m is the area-reduction lever since the objective is min luts_plus_ffs. unrolled_k is included at a small share (0.2) as a low-area probe with high k, since it may produce the cheapest feasible point but risks the batch bound. Ranges are centered on data_width 14-20 and n_iter 12-20 to bracket the 2^-12 accuracy requirement while exposing the area-vs-accuracy_bits trade-off that the hypervolume rewards; angle_guard and frac_guard are kept narrow to focus budget on the dominant knobs. iterative is excluded because its 1 micro-rotation/cycle throughput cannot meet the 32 req/us burst.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..20, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, which is required to clear the 32 req/us burst and the 0.44us p99 batch bound. Pipelined has the lowest latency (N+2) and best Fmax headroom, so it is the strongest candidate for the throughput/batch constraints; data_width 14-20 and n_iter 12-20 bracket the 2^-12 accuracy requirement while leaving room to trade area vs accuracy_bits.
- `pipelined_m` (30 evals): data_width=14..20, n_iter=12..20, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m also gives 1 result/cycle but with fewer registers (every m stages), so it can beat pipelined on luts_plus_ffs at the cost of higher latency (ceil(N/m)+2). Since the objective is min area and the batch bound is tight, this family is the main area-reduction lever on the same throughput-feasible region; m=2-4 keeps latency low enough to stay under 0.44us.
- `unrolled_k` (20 evals): data_width=14..20, n_iter=12..20, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k with large k (4-8) can approach 1 result/cycle throughput and is the cheapest area family (shared datapath, no per-stage registers). It is a plausible low-area point on the front if its Fmax and batch latency clear the bounds; kept at a smaller share because its multi-cycle result spacing risks the 0.44us p99 batch constraint, so it is a secondary probe rather than the main search.

**Result (code):** 100 evaluations this round, 100 total; 58 feasible; hypervolume 8628 (n/a).

**LLM decision:** `refine` — The current front is entirely composed of pipelined_m and pipelined designs, with pipelined_m offering the best area (1183 LUTs+FFs). unrolled_k is infeasible due to throughput limits (max 10.3 MSPS < 32 MSPS required). iterative is likely to have similar throughput issues to unrolled_k or worse area, so it is not worth exploring given the budget. The current front covers accuracy 12.8-15.4 bits and area 1183-1698. The selection rule is min area, so the top candidate is the 1183 design. However, to maximize hypervolume, we should refine the ranges around the known feasible region (data_width 18-20, n_iter 14-18) to find if there are better area/accuracy trade-offs, particularly pushing area lower or accuracy higher within the same area budget. The sys_p99_batch constraint is met by all current front designs (best 0.161 us, limit 0.44 us), so throughput is not a bottleneck for the current candidates. Refining the ranges will help map the front more densely in the promising region.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8628 (gain this round: n/a (first round)).
Feasible designs: 58 of 100 evaluations (51 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 273
- max_abs_err <= 0.000244141: 35% violate; best seen 2.38e-05 (2^-15.36)
- sys_p99_batch_us <= 0.44: 20% violate; best seen 0.161

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1183, accuracy_bits=12.8, luts=882, ffs=301, throughput_msps=93.6, max_abs_err=0.000145 (2^-12.76), power_index=1.42
- pipelined_m [data_width=19 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=1296, accuracy_bits=13, luts=935, ffs=361, throughput_msps=119, max_abs_err=0.000119 (2^-13.04), power_index=1.56
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1303, accuracy_bits=13.4, luts=1002, ffs=301, throughput_msps=93.6, max_abs_err=9.56e-05 (2^-13.35), power_index=1.57
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1316, accuracy_bits=13.5, luts=949, ffs=366, throughput_msps=119, max_abs_err=8.66e-05 (2^-13.50), power_index=1.58
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1391, accuracy_bits=13.6, luts=1008, ffs=382, throughput_msps=119, max_abs_err=8.04e-05 (2^-13.60), power_index=1.67
- pipelined_m [data_width=19 n_iter=17 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1576, accuracy_bits=14.6, luts=1192, ffs=384, throughput_msps=93.6, max_abs_err=3.97e-05 (2^-14.62), power_index=1.9
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1604, accuracy_bits=15.2, luts=1211, ffs=393, throughput_msps=93.6, max_abs_err=2.58e-05 (2^-15.24), power_index=1.93
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=1698, accuracy_bits=15.4, luts=1228, ffs=470, throughput_msps=119, max_abs_err=2.38e-05 (2^-15.36), power_index=2.04
Front coverage: luts_plus_ffs 1183..1698 (HV reference 4000); accuracy_bits 12.8..15.4 (HV reference 12); data_width on the front 18..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.11 bits
- pipelined: 50 evals, 35 feasible; max throughput seen 273 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=1768; feasible ranges: data_width 17..20, n_iter 14..20, angle_guard -2..2, frac_guard 0..2
- pipelined_m: 30 evals, 23 feasible; max throughput seen 171 MSPS; best accuracy 15.36 bits; best feasible luts_plus_ffs=1183; feasible ranges: data_width 17..20, n_iter 14..18, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The current front is entirely composed of pipelined_m and pipelined designs, with pipelined_m offering the best area (1183 LUTs+FFs). unrolled_k is infeasible due to throughput limits (max 10.3 MSPS < 32 MSPS required). iterative is likely to have similar throughput issues to unrolled_k or worse area, so it is not worth exploring given the budget. The current front covers accuracy 12.8-15.4 bits and area 1183-1698. The selection rule is min area, so the top candidate is the 1183 design. However, to maximize hypervolume, we should refine the ranges around the known feasible region (data_width 18-20, n_iter 14-18) to find if there are better area/accuracy trade-offs, particularly pushing area lower or accuracy higher within the same area budget. The sys_p99_batch constraint is met by all current front designs (best 0.161 us, limit 0.44 us), so throughput is not a bottleneck for the current candidates. Refining the ranges will help map the front more densely in the promising region.*)
- `pipelined_m` (50 evals): data_width=18..20, n_iter=14..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m dominates the current front (best area 1183 vs 1768 for pipelined). Focusing here to push the area down and accuracy up.
- `pipelined` (50 evals): data_width=18..20, n_iter=14..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined provides the highest throughput (up to 273 MSPS) which is a strong buffer for the sys_p99_batch constraint. Keeping it in the mix ensures we cover the high-throughput end of the front.

**Result (code):** 100 evaluations this round, 200 total; 156 feasible; hypervolume 8754 (+1.5%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `m=4` and `m=3`, achieving the minimum area (1183 LUTs+FFs) and best accuracy (15.4 bits). The `unrolled_k` family is infeasible for the throughput constraint (max 10.3 MSPS < 32 MSPS required), so it can be discarded. The `pipelined` family (fully registered) is more expensive (best 1768 LUTs+FFs) than `pipelined_m` (best 1183), suggesting that partial pipelining (`m=3,4`) is the optimal architecture for this area-constrained problem. The `iterative` family is not yet explored, but given that `unrolled_k` (which shares the iterative datapath structure but with higher throughput) already fails the throughput constraint, and `iterative` has even lower throughput (1 result per N+3 cycles), it is highly likely to be infeasible for the 32 MSPS requirement unless N is very small, which would compromise accuracy. However, to be rigorous and ensure we haven't missed a low-area corner, we should briefly check `iterative` or focus on refining the `pipelined_m` ranges. Given the budget (200/400 used) and the clear dominance of `pipelined_m`, the best use of the next round is to refine the `pipelined_m` ranges to densely map the front between 1183 and 1741 LUTs+FFs, and to check if `iterative` can offer any area advantage at the cost of throughput (though it will likely fail the 32 MSPs constraint). Actually, looking at the constraints, `throughput_msps >= 32` is a hard constraint. `iterative` with N=14 takes 17 cycles. If Fmax is ~100MHz, throughput is ~5.8 MSPs, which is far below 32. Even with high Fmax, it's unlikely to reach 32 MSPs without massive parallelism which isn't in the `iterative` model. Thus `iterative` is likely infeasible. The focus should be on `pipelined_m`. The current front covers 1183-1741 area. The reference point is 4000 area, so we are well within the interesting region. We should narrow the `pipelined_m` ranges to focus on the best trade-offs: `data_width` 18-20, `n_iter` 14-18, `angle_guard` 0-2, `frac_guard` 0-2, `m` 3-4. This will allow Optuna to find more points on the front, potentially improving hypervolume.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8754 (gain this round: +1.5%).
Feasible designs: 156 of 200 evaluations (127 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 10% violate; best seen 273
- max_abs_err <= 0.000244141: 18% violate; best seen 2.34e-05 (2^-15.38)
- sys_p99_batch_us <= 0.44: 10% violate; best seen 0.161

Pareto front (feasible, 15 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1183, accuracy_bits=12.8, luts=882, ffs=301, throughput_msps=93.6, max_abs_err=0.000145 (2^-12.76), power_index=1.42
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1269, accuracy_bits=13.2, luts=964, ffs=305, throughput_msps=93.6, max_abs_err=0.000109 (2^-13.17), power_index=1.53
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1303, accuracy_bits=13.4, luts=1002, ffs=301, throughput_msps=93.6, max_abs_err=9.56e-05 (2^-13.35), power_index=1.57
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1308, accuracy_bits=13.5, luts=994, ffs=315, throughput_msps=93.6, max_abs_err=8.71e-05 (2^-13.49), power_index=1.57
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1316, accuracy_bits=13.5, luts=949, ffs=366, throughput_msps=119, max_abs_err=8.66e-05 (2^-13.50), power_index=1.58
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1377, accuracy_bits=13.7, luts=994, ffs=383, throughput_msps=119, max_abs_err=7.63e-05 (2^-13.68), power_index=1.66
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=1485, accuracy_bits=13.9, luts=1055, ffs=430, throughput_msps=119, max_abs_err=6.45e-05 (2^-13.92), power_index=1.79
- pipelined_m [data_width=19 n_iter=17 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1576, accuracy_bits=14.6, luts=1192, ffs=384, throughput_msps=93.6, max_abs_err=3.97e-05 (2^-14.62), power_index=1.9
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1604, accuracy_bits=15.2, luts=1211, ffs=393, throughput_msps=93.6, max_abs_err=2.58e-05 (2^-15.24), power_index=1.93
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1741, accuracy_bits=15.4, luts=1281, ffs=460, throughput_msps=119, max_abs_err=2.34e-05 (2^-15.38), power_index=2.1
Front coverage: luts_plus_ffs 1183..1741 (HV reference 4000); accuracy_bits 12.8..15.4 (HV reference 12); data_width on the front 18..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.11 bits
- pipelined: 100 evals, 84 feasible; max throughput seen 273 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=1768; feasible ranges: data_width 17..20, n_iter 14..20, angle_guard -2..2, frac_guard 0..2
- pipelined_m: 80 evals, 72 feasible; max throughput seen 171 MSPS; best accuracy 15.38 bits; best feasible luts_plus_ffs=1183; feasible ranges: data_width 17..20, n_iter 14..18, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine pipelined_m ranges to densely map the Pareto front in the high-performing region.*)
- `pipelined_m` (40 evals): data_width=18..20, n_iter=14..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=3..4. *Why:* Focus on the dominant family with the best area/accuracy trade-off. Narrow ranges to densely map the Pareto front in the region of interest (1183-1741 LUTs+FFs).

**Result (code):** 40 evaluations this round, 240 total; 196 feasible; hypervolume 8804 (+0.6%).

**LLM decision:** `stop` — The front is feasible and well-mapped: 15 designs span luts_plus_ffs 1183..1741 and accuracy_bits 12.8..15.4, all satisfying throughput >= 32 MSPS, max_abs_err <= 2^-12, and sys_p99_batch_us <= 0.44 us. The best area design (pipelined_m, 1183 LUTs+FFs) meets all constraints with 12.8 bits accuracy. Hypervolume gain in round 3 was only +0.6%, indicating the front is saturated. unrolled_k is infeasible (max throughput 10.3 MSPS < 32), and iterative is not needed since pipelined_m already dominates the area-accuracy trade-off. The selection rule (min luts_plus_ffs) will pick the 1183 design, which is robustly feasible.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8804 (gain this round: +0.6%).
Feasible designs: 196 of 240 evaluations (155 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 273
- max_abs_err <= 0.000244141: 15% violate; best seen 2.34e-05 (2^-15.38)
- sys_p99_batch_us <= 0.44: 8% violate; best seen 0.161

Pareto front (feasible, 15 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1183, accuracy_bits=12.8, luts=882, ffs=301, throughput_msps=93.6, max_abs_err=0.000145 (2^-12.76), power_index=1.42
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1250, accuracy_bits=13.5, luts=949, ffs=301, throughput_msps=93.6, max_abs_err=8.66e-05 (2^-13.50), power_index=1.5
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1290, accuracy_bits=13.6, luts=979, ffs=311, throughput_msps=93.6, max_abs_err=8.24e-05 (2^-13.57), power_index=1.55
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1344, accuracy_bits=13.7, luts=1023, ffs=321, throughput_msps=93.6, max_abs_err=7.76e-05 (2^-13.65), power_index=1.62
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1377, accuracy_bits=13.7, luts=994, ffs=383, throughput_msps=119, max_abs_err=7.63e-05 (2^-13.68), power_index=1.66
- pipelined_m [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=1485, accuracy_bits=13.9, luts=1055, ffs=430, throughput_msps=119, max_abs_err=6.45e-05 (2^-13.92), power_index=1.79
- pipelined_m [data_width=19 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1539, accuracy_bits=14, luts=1170, ffs=369, throughput_msps=93.6, max_abs_err=5.95e-05 (2^-14.04), power_index=1.85
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1604, accuracy_bits=15.2, luts=1211, ffs=393, throughput_msps=93.6, max_abs_err=2.58e-05 (2^-15.24), power_index=1.93
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1697, accuracy_bits=15.2, luts=1219, ffs=478, throughput_msps=119, max_abs_err=2.57e-05 (2^-15.25), power_index=2.04
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1741, accuracy_bits=15.4, luts=1281, ffs=460, throughput_msps=119, max_abs_err=2.34e-05 (2^-15.38), power_index=2.1
Front coverage: luts_plus_ffs 1183..1741 (HV reference 4000); accuracy_bits 12.8..15.4 (HV reference 12); data_width on the front 18..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.11 bits
- pipelined: 100 evals, 84 feasible; max throughput seen 273 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=1768; feasible ranges: data_width 17..20, n_iter 14..20, angle_guard -2..2, frac_guard 0..2
- pipelined_m: 120 evals, 112 feasible; max throughput seen 171 MSPS; best accuracy 15.38 bits; best feasible luts_plus_ffs=1183; feasible ranges: data_width 17..20, n_iter 14..18, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=17..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (15 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 298 feasible; hypervolume 1.933e+04 (+119.5%).

**No LLM call** (code's front-mapping round): The front is feasible and well-mapped: 15 designs span luts_plus_ffs 1183..1741 and accuracy_bits 12.8..15.4, all satisfying throughput >= 32 MSPS, max_abs_err <= 2^-12, and sys_p99_batch_us <= 0.44 us. The best area design (pipelined_m, 1183 LUTs+FFs) meets all constraints with 12.8 bits accuracy. Hypervolume gain in round 3 was only +0.6%, indicating the front is saturated. unrolled_k is infeasible (max throughput 10.3 MSPS < 32), and iterative is not needed since pipelined_m already dominates the area-accuracy trade-off. The selection rule (min luts_plus_ffs) will pick the 1183 design, which is robustly feasible.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.933e+04 (gain this round: +119.5%).
Feasible designs: 298 of 400 evaluations (245 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 273
- max_abs_err <= 0.000244141: 11% violate; best seen 3.07e-08 (2^-24.96)
- sys_p99_batch_us <= 0.44: 18% violate; best seen 0.161

Pareto front (feasible, 30 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1183, accuracy_bits=12.8, luts=882, ffs=301, throughput_msps=93.6, max_abs_err=0.000145 (2^-12.76), power_index=1.42
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1290, accuracy_bits=13.6, luts=979, ffs=311, throughput_msps=93.6, max_abs_err=8.24e-05 (2^-13.57), power_index=1.55
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1377, accuracy_bits=13.7, luts=994, ffs=383, throughput_msps=119, max_abs_err=7.63e-05 (2^-13.68), power_index=1.66
- pipelined_m [data_width=19 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1539, accuracy_bits=14, luts=1170, ffs=369, throughput_msps=93.6, max_abs_err=5.95e-05 (2^-14.04), power_index=1.85
- pipelined_m [data_width=20 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1697, accuracy_bits=15.2, luts=1219, ffs=478, throughput_msps=119, max_abs_err=2.57e-05 (2^-15.25), power_index=2.04
- pipelined_m [data_width=23 n_iter=17 angle_guard=3 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1765, accuracy_bits=15.7, luts=1320, ffs=445, throughput_msps=89.6, max_abs_err=1.81e-05 (2^-15.75), power_index=2.12
- pipelined_m [data_width=23 n_iter=21 angle_guard=0 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=2223, accuracy_bits=17.7, luts=1628, ffs=595, throughput_msps=114, max_abs_err=4.61e-06 (2^-17.73), power_index=2.68
- pipelined_m [data_width=25 n_iter=20 angle_guard=0 frac_guard=1 rounding=round m=3] luts_plus_ffs=2363, accuracy_bits=18.6, luts=1720, ffs=644, throughput_msps=114, max_abs_err=2.49e-06 (2^-18.61), power_index=2.84
- pipelined_m [data_width=28 n_iter=23 angle_guard=3 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3037, accuracy_bits=21.7, luts=2208, ffs=829, throughput_msps=106, max_abs_err=3.01e-07 (2^-21.66), power_index=3.66
- pipelined_m [data_width=28 n_iter=28 angle_guard=3 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=3731, accuracy_bits=23.3, luts=2708, ffs=1023, throughput_msps=106, max_abs_err=1e-07 (2^-23.25), power_index=4.49
Front coverage: luts_plus_ffs 1183..3731 (HV reference 4000); accuracy_bits 12.8..23.3 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.11 bits
- pipelined: 100 evals, 84 feasible; max throughput seen 273 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=1768; feasible ranges: data_width 17..20, n_iter 14..20, angle_guard -2..2, frac_guard 0..2
- pipelined_m: 280 evals, 214 feasible; max throughput seen 171 MSPS; best accuracy 24.96 bits; best feasible luts_plus_ffs=1183; feasible ranges: data_width 17..28, n_iter 13..29, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 1)
- tokens: 13511 in, 3869 out
- provider-reported cost: $0.0095
- full prompts and replies: `llm_trace.jsonl`

