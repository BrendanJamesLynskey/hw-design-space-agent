# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 877 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 285 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000191 (2^-12.36) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.25 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.39e-05 (2^-14.18) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.77 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.4 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.2 dBc, SNR 82.4 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=14,angle_guard=3,frac_guard=2,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=20,n_iter=15,angle_guard=-1,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=round,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (26 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=4` | 877 | 285 | 93.6 | 6 | 1.4 | 0.000191 (2^-12.36) | 12.36 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=3,frac_guard=2,rounding=round,m=4` | 918 | 295 | 93.6 | 6 | 1.46 | 0.000152 (2^-12.68) | 12.68 |
| 2 | `pipelined_m:data_width=18,n_iter=15,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 949 | 295 | 93.6 | 6 | 1.5 | 0.000145 (2^-12.75) | 12.75 |
| 3 | `pipelined_m:data_width=20,n_iter=15,angle_guard=-1,frac_guard=0,rounding=round,m=4` | 964 | 307 | 93.6 | 6 | 1.53 | 9.65e-05 (2^-13.34) | 13.34 |
| 4 | `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1063 | 319 | 93.6 | 6 | 1.66 | 7.18e-05 (2^-13.77) | 13.77 |
| 5 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1089 | 309 | 93.6 | 6 | 1.68 | 5.25e-05 (2^-14.22) | 14.22 |
| 6 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=3,rounding=round,m=4` | 1152 | 321 | 93.6 | 6 | 1.77 | 4.61e-05 (2^-14.40) | 14.40 |
| 7 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 1175 | 337 | 89.6 | 6 | 1.82 | 3.71e-05 (2^-14.72) | 14.72 |
| 8 | `pipelined_m:data_width=21,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 1222 | 351 | 89.6 | 6 | 1.89 | 3.33e-05 (2^-14.88) | 14.88 |
| 9 | `pipelined_m:data_width=21,n_iter=16,angle_guard=2,frac_guard=3,rounding=round,m=4` | 1267 | 353 | 89.6 | 6 | 1.95 | 3.3e-05 (2^-14.89) | 14.89 |
| 10 | `pipelined_m:data_width=21,n_iter=19,angle_guard=2,frac_guard=0,rounding=trunc,m=4` | 1352 | 406 | 89.6 | 7 | 2.12 | 2.36e-05 (2^-15.37) | 15.37 |
| 11 | `pipelined_m:data_width=18,n_iter=21,angle_guard=3,frac_guard=3,rounding=round,m=4` | 1497 | 456 | 93.6 | 8 | 2.35 | 2.32e-05 (2^-15.40) | 15.40 |
| 12 | `pipelined_m:data_width=22,n_iter=18,angle_guard=1,frac_guard=4,rounding=round,m=4` | 1503 | 452 | 89.6 | 7 | 2.35 | 9.72e-06 (2^-16.65) | 16.65 |
| 13 | `pipelined_m:data_width=23,n_iter=18,angle_guard=1,frac_guard=4,rounding=round,m=4` | 1558 | 469 | 86.0 | 7 | 2.44 | 8.74e-06 (2^-16.80) | 16.80 |
| 14 | `pipelined_m:data_width=22,n_iter=21,angle_guard=1,frac_guard=0,rounding=round,m=4` | 1544 | 492 | 89.6 | 8 | 2.45 | 6.76e-06 (2^-17.17) | 17.17 |
| 15 | `pipelined_m:data_width=22,n_iter=21,angle_guard=3,frac_guard=0,rounding=round,m=4` | 1586 | 504 | 89.6 | 8 | 2.52 | 5.23e-06 (2^-17.54) | 17.54 |
| 16 | `pipelined_m:data_width=22,n_iter=21,angle_guard=2,frac_guard=1,rounding=round,m=4` | 1653 | 511 | 89.6 | 8 | 2.6 | 3.51e-06 (2^-18.12) | 18.12 |
| 17 | `pipelined_m:data_width=23,n_iter=21,angle_guard=2,frac_guard=1,rounding=round,m=4` | 1719 | 531 | 89.6 | 8 | 2.71 | 2.63e-06 (2^-18.54) | 18.54 |
| 18 | `pipelined_m:data_width=25,n_iter=21,angle_guard=0,frac_guard=1,rounding=round,m=4` | 1807 | 559 | 89.6 | 8 | 2.85 | 1.61e-06 (2^-19.24) | 19.24 |
| 19 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1953 | 559 | 89.6 | 8 | 3.02 | 1.14e-06 (2^-19.74) | 19.74 |
| 20 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=2,rounding=round,m=4` | 2003 | 561 | 89.6 | 8 | 3.09 | 7.74e-07 (2^-20.30) | 20.30 |
| 21 | `pipelined_m:data_width=25,n_iter=22,angle_guard=4,frac_guard=2,rounding=round,m=2` | 2027 | 1047 | 152.6 | 13 | 3.7 | 6.63e-07 (2^-20.52) | 20.52 |
| 22 | `pipelined_m:data_width=25,n_iter=22,angle_guard=4,frac_guard=4,rounding=round,m=2` | 2116 | 1088 | 152.6 | 13 | 3.86 | 5.62e-07 (2^-20.76) | 20.76 |
| 23 | `pipelined_m:data_width=28,n_iter=24,angle_guard=2,frac_guard=0,rounding=round,m=2` | 2235 | 1182 | 152.6 | 14 | 4.11 | 1.98e-07 (2^-22.27) | 22.27 |
| 24 | `pipelined_m:data_width=28,n_iter=25,angle_guard=1,frac_guard=0,rounding=round,m=2` | 2307 | 1263 | 152.6 | 15 | 4.3 | 1.58e-07 (2^-22.59) | 22.59 |
| 25 | `pipelined:data_width=28,n_iter=24,angle_guard=2,frac_guard=3,rounding=trunc` | 2380 | 2385 | 242.0 | 26 | 5.74 | 1.53e-07 (2^-22.64) | 22.64 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are throughput >= 32 MSps and the 32-request burst finishing within 0.44 us of the tick. Only the 1-result/cycle families (pipelined, pipelined_m) can meet the burst bound at realistic Artix-7 clocks: iterative needs Fmax >= 32*(N+3)/0.44us ~ 500+ MHz to serialize a 32-request burst, and unrolled_k needs ~290+ MHz even at k=8, both implausible, so they are excluded rather than wasting budget. Accuracy (max_abs_err <= 2^-12) depends only on data_width/n_iter/angle_guard/frac_guard/rounding, so I sweep those jointly over a range wide enough to span 'just meets 2^-12' up to well beyond it (data_width 12..22, n_iter 8..24), which is exactly the axis of the max-accuracy_bits objective. The two families share identical accuracy behaviour, so the search is really mapping the area (luts_plus_ffs) vs accuracy_bits front: pipelined supplies the high-Fmax/low-latency end, pipelined_m the low-FF/min-area end via the m parameter. Round 1 spends the full 100 evals across these two families; later rounds will re-allocate toward whichever family populates the feasible front and toward the accuracy/area corners, with the reserved final mapping over the full ranges of the surviving families.*)
- `pipelined` (45 evals): data_width=12..22, n_iter=8..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* 1 result/cycle, so throughput >= 32 MSps is trivially met for any Fmax > 32 MHz. Batch of 32 finishes in (N+2+31) cycles; at N<=24 that is <=57 cycles, so even a modest Fmax clears the 0.44 us p99_batch bound. This is the family most likely to satisfy all three constraints, and its fully-registered datapath gives the highest Fmax (best latency_ns) at the cost of more FFs, so it anchors the low-latency / higher-area end of the front.
- `pipelined_m` (55 evals): data_width=12..22, n_iter=8..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Same 1 result/cycle throughput and same exact bit-accuracy as pipelined, but registers only every m stages: fewer FFs (lower luts_plus_ffs, the selection objective) and shorter latency ceil(N/m)+2, at the price of a longer combinational path (lower Fmax). Batch time (ceil(N/m)+2+31)/Fmax stays well under 0.44 us for the whole range, so this family is the prime candidate for the min-area corner and is where the area/Fmax trade-off actually lives; hence the larger share.

**Result (code):** 100 evaluations this round, 100 total; 42 feasible; hypervolume 1.043e+04 (n/a).

**LLM decision:** `add_family` — Round 1 only covered pipelined/pipelined_m. The front's cheap end is 1293 LUT+FF (accuracy 12.9 bits) and the selection rule is min luts_plus_ffs, so the highest-value unexplored direction is a family that shares datapath and could undercut 1293 while still meeting the constraints. iterative is almost certainly infeasible (N+3 cycles/result at N~14 needs >500 MHz to reach 32 MSPS, and 32 back-to-back results would blow the 0.44 us p99 batch), but unrolled_k with large k (ceil(N/k)+3 cycles) can plausibly hit >=32 MSPS and the batch bound with a shared datapath, potentially extending the front to lower area. All three constraints are currently satisfiable (best throughput 282, best err 2^-17.97, best batch 0.142 us), so this is exploration, not infeasibility.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.043e+04 (gain this round: n/a (first round)).
Feasible designs: 42 of 100 evaluations (34 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 0% violate; best seen 282
- max_abs_err <= 0.000244141: 41% violate; best seen 3.88e-06 (2^-17.97)
- sys_p99_batch_us <= 0.44: 28% violate; best seen 0.142

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=21 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1293, accuracy_bits=12.9, luts=964, ffs=329, throughput_msps=93.6, max_abs_err=0.000132 (2^-12.88), power_index=1.56
- pipelined_m [data_width=21 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1501, accuracy_bits=13, luts=1077, ffs=424, throughput_msps=114, max_abs_err=0.000123 (2^-12.99), power_index=1.81
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=4 rounding=trunc m=2] luts_plus_ffs=1592, accuracy_bits=13.3, luts=1008, ffs=583, throughput_msps=164, max_abs_err=0.000101 (2^-13.28), power_index=1.92
- pipelined_m [data_width=21 n_iter=19 angle_guard=2 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=1758, accuracy_bits=15.4, luts=1352, ffs=406, throughput_msps=89.6, max_abs_err=2.36e-05 (2^-15.37), power_index=2.12
- pipelined_m [data_width=21 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=2206, accuracy_bits=16.2, luts=1409, ffs=797, throughput_msps=158, max_abs_err=1.33e-05 (2^-16.20), power_index=2.66
- pipelined [data_width=21 n_iter=21 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=3238, accuracy_bits=17.4, luts=1630, ffs=1608, throughput_msps=257, max_abs_err=5.85e-06 (2^-17.38), power_index=3.9
Front coverage: luts_plus_ffs 1293..3238 (HV reference 4000); accuracy_bits 12.9..17.4 (HV reference 12); data_width on the front 17..21 (registry 8..28).

Per family:
- pipelined: 45 evals, 24 feasible; max throughput seen 282 MSPS; best accuracy 17.38 bits; best feasible luts_plus_ffs=2053; feasible ranges: data_width 16..21, n_iter 14..22, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 55 evals, 18 feasible; max throughput seen 171 MSPS; best accuracy 17.97 bits; best feasible luts_plus_ffs=1293; feasible ranges: data_width 17..21, n_iter 14..24, angle_guard -1..3, frac_guard 0..4, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *unrolled_k is the only unexplored family that can plausibly beat the current 1293 LUT+FF cheap corner while satisfying throughput>=32 MSPS and sys_p99_batch<=0.44 us; pipelined_m gets a small share to keep the known-good low-area region dense.*)
- `unrolled_k` (70 evals): data_width=16..22, n_iter=12..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* large k keeps ceil(N/k)+3 small enough for the 32 MSPS and 0.44 us batch constraints while sharing the datapath; low data_width/n_iter targets the cheap end of the front
- `pipelined_m` (30 evals): data_width=17..21, n_iter=14..20, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* seed/refine the current cheapest region (1293 LUT+FF, 12.9 bits) to densify the low-area end of the front

**Result (code):** 100 evaluations this round, 200 total; 71 feasible; hypervolume 1.106e+04 (+6.1%).

**LLM decision:** `refine` — unrolled_k is dead for this spec (0/70 feasible, max 9.97 MSPS) and iterative is strictly slower (1 micro-rotation/cycle, N+3 cycles/result), so it cannot reach the 32 MSPS floor either — no point spending budget on it. The front is carried by pipelined_m at the cheap end (1244 LUT+FF) and pipelined at the accurate end (3238, 17.4 bits). Two gaps matter: (1) the cheapest front designs run at only 93.6 MSPS, so a 32-request burst drains in ~0.34 us plus ~6 cycles of latency — right at the 0.44 us L1 bound, and the brief warns L1 is optimistic, so the min-area pick may be lost at L2; we need cheaper designs with more throughput margin (m=2/3). (2) accuracy on the front tops out at 17.4 bits while 17.97 was seen, and the area axis has room up to the 4000 HV reference, so higher-data_width pipelined designs can still add hypervolume. Refine both regions now; reserve the final round for map_front.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.106e+04 (gain this round: +6.1%).
Feasible designs: 71 of 200 evaluations (59 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 35% violate; best seen 282
- max_abs_err <= 0.000244141: 32% violate; best seen 3.88e-06 (2^-17.97)
- sys_p99_batch_us <= 0.44: 49% violate; best seen 0.142

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=15 angle_guard=0 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1244, accuracy_bits=12.8, luts=949, ffs=295, throughput_msps=93.6, max_abs_err=0.000145 (2^-12.75), power_index=1.5
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1276, accuracy_bits=12.8, luts=963, ffs=313, throughput_msps=93.6, max_abs_err=0.000136 (2^-12.84), power_index=1.54
- pipelined_m [data_width=18 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=4] luts_plus_ffs=1314, accuracy_bits=13, luts=1023, ffs=291, throughput_msps=93.6, max_abs_err=0.00012 (2^-13.03), power_index=1.58
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1382, accuracy_bits=13.8, luts=1063, ffs=319, throughput_msps=93.6, max_abs_err=7.18e-05 (2^-13.77), power_index=1.66
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1397, accuracy_bits=14.2, luts=1089, ffs=309, throughput_msps=93.6, max_abs_err=5.25e-05 (2^-14.22), power_index=1.68
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1512, accuracy_bits=14.7, luts=1175, ffs=337, throughput_msps=89.6, max_abs_err=3.71e-05 (2^-14.72), power_index=1.82
- pipelined_m [data_width=21 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1573, accuracy_bits=14.9, luts=1222, ffs=351, throughput_msps=89.6, max_abs_err=3.33e-05 (2^-14.88), power_index=1.89
- pipelined_m [data_width=21 n_iter=16 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1620, accuracy_bits=14.9, luts=1267, ffs=353, throughput_msps=89.6, max_abs_err=3.3e-05 (2^-14.89), power_index=1.95
- pipelined_m [data_width=21 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=2206, accuracy_bits=16.2, luts=1409, ffs=797, throughput_msps=158, max_abs_err=1.33e-05 (2^-16.20), power_index=2.66
- pipelined [data_width=21 n_iter=21 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=3238, accuracy_bits=17.4, luts=1630, ffs=1608, throughput_msps=257, max_abs_err=5.85e-06 (2^-17.38), power_index=3.9
Front coverage: luts_plus_ffs 1244..3238 (HV reference 4000); accuracy_bits 12.8..17.4 (HV reference 12); data_width on the front 18..21 (registry 8..28).

Per family:
- unrolled_k: 70 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 17.26 bits
- pipelined: 45 evals, 24 feasible; max throughput seen 282 MSPS; best accuracy 17.38 bits; best feasible luts_plus_ffs=2053; feasible ranges: data_width 16..21, n_iter 14..22, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 85 evals, 47 feasible; max throughput seen 171 MSPS; best accuracy 17.97 bits; best feasible luts_plus_ffs=1244; feasible ranges: data_width 17..21, n_iter 14..24, angle_guard -1..3, frac_guard 0..4, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine the two live families: cheap pipelined_m for the min-area selection rule, higher-throughput pipelined_m for L2 system margin, and wider pipelined for hypervolume coverage at the accurate end.*)
- `pipelined_m` (22 evals): data_width=17..20, n_iter=13..18, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=3..4. *Why:* Push the min-area corner below 1244 LUT+FF while staying above 12 accuracy bits; m=3/4 keeps FFs low.
- `pipelined` (18 evals): data_width=19..26, n_iter=18..28, angle_guard=-2..4, frac_guard=1..4, rounding=trunc|round. *Why:* Extend the accurate end past 17.4 bits toward the 17.97 best seen and the 4000-area HV reference; pipelined is 1 result/cycle so it keeps large throughput headroom.
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 40 evaluations this round, 240 total; 109 feasible; hypervolume 1.194e+04 (+8.0%).

**LLM decision:** `stop` — Final round: the front is feasible and still improving (+8.0% HV this round, 1.194e+04), with 18 feasible designs spanning luts_plus_ffs 1161..4642 (HV ref 4000) and accuracy_bits 12.4..19 (HV ref 12), so both objectives are covered well past their reference points. All three constraints are met with margin by the front: best throughput 282 MSPS vs >=32, best max_abs_err 1.96e-06 vs <=2.44e-04, best sys_p99_batch 0.142 us vs <=0.44 us. The selection rule (min luts_plus_ffs) picks pipelined_m [W=17 N=14 angle_guard=2 frac_guard=1 round m=4] at luts_plus_ffs=1161, accuracy_bits=12.4 (max_abs_err 1.91e-04, still under the 2^-12 limit), throughput 93.6 MSPS and sys_p99_batch well inside 0.44 us. The unexplored iterative family is irrelevant here: unrolled_k, the other multi-cycle family, produced 0 feasible designs (max 9.97 MSPS, far below the 32 MSPS constraint), so a 1-micro-rotation/cycle datapath cannot meet the throughput/batch requirement. No further exploration is warranted within the budget.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.194e+04 (gain this round: +8.0%).
Feasible designs: 109 of 240 evaluations (94 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 29% violate; best seen 282
- max_abs_err <= 0.000244141: 28% violate; best seen 1.96e-06 (2^-18.96)
- sys_p99_batch_us <= 0.44: 41% violate; best seen 0.142

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1161, accuracy_bits=12.4, luts=877, ffs=285, throughput_msps=93.6, max_abs_err=0.000191 (2^-12.36), power_index=1.4
- pipelined_m [data_width=18 n_iter=15 angle_guard=0 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1244, accuracy_bits=12.8, luts=949, ffs=295, throughput_msps=93.6, max_abs_err=0.000145 (2^-12.75), power_index=1.5
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1382, accuracy_bits=13.8, luts=1063, ffs=319, throughput_msps=93.6, max_abs_err=7.18e-05 (2^-13.77), power_index=1.66
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=3 rounding=round m=4] luts_plus_ffs=1473, accuracy_bits=14.4, luts=1152, ffs=321, throughput_msps=93.6, max_abs_err=4.61e-05 (2^-14.40), power_index=1.77
- pipelined_m [data_width=21 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1573, accuracy_bits=14.9, luts=1222, ffs=351, throughput_msps=89.6, max_abs_err=3.33e-05 (2^-14.88), power_index=1.89
- pipelined_m [data_width=21 n_iter=16 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1620, accuracy_bits=14.9, luts=1267, ffs=353, throughput_msps=89.6, max_abs_err=3.3e-05 (2^-14.89), power_index=1.95
- pipelined_m [data_width=21 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=2206, accuracy_bits=16.2, luts=1409, ffs=797, throughput_msps=158, max_abs_err=1.33e-05 (2^-16.20), power_index=2.66
- pipelined [data_width=21 n_iter=21 angle_guard=4 frac_guard=1 rounding=round] luts_plus_ffs=3238, accuracy_bits=17.4, luts=1630, ffs=1608, throughput_msps=257, max_abs_err=5.85e-06 (2^-17.38), power_index=3.9
- pipelined [data_width=21 n_iter=23 angle_guard=3 frac_guard=4 rounding=round] luts_plus_ffs=3770, accuracy_bits=18.4, luts=1904, ffs=1866, throughput_msps=257, max_abs_err=2.8e-06 (2^-18.45), power_index=4.54
- pipelined [data_width=25 n_iter=26 angle_guard=-1 frac_guard=4 rounding=trunc] luts_plus_ffs=4642, accuracy_bits=19, luts=2324, ffs=2319, throughput_msps=249, max_abs_err=1.96e-06 (2^-18.96), power_index=5.59
Front coverage: luts_plus_ffs 1161..4642 (HV reference 4000); accuracy_bits 12.4..19 (HV reference 12); data_width on the front 17..25 (registry 8..28).

Per family:
- unrolled_k: 70 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 17.26 bits
- pipelined: 63 evals, 42 feasible; max throughput seen 282 MSPS; best accuracy 18.96 bits; best feasible luts_plus_ffs=2053; feasible ranges: data_width 16..25, n_iter 14..27, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 107 evals, 67 feasible; max throughput seen 171 MSPS; best accuracy 17.97 bits; best feasible luts_plus_ffs=1161; feasible ranges: data_width 17..21, n_iter 14..24, angle_guard -1..3, frac_guard 0..4, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (107 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (12 front designs; box front_anchored)
- `pipelined` (53 evals): data_width=20..28, n_iter=16..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (6 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 228 feasible; hypervolume 1.901e+04 (+59.1%).

**No LLM call** (code's front-mapping round): Final round: the front is feasible and still improving (+8.0% HV this round, 1.194e+04), with 18 feasible designs spanning luts_plus_ffs 1161..4642 (HV ref 4000) and accuracy_bits 12.4..19 (HV ref 12), so both objectives are covered well past their reference points. All three constraints are met with margin by the front: best throughput 282 MSPS vs >=32, best max_abs_err 1.96e-06 vs <=2.44e-04, best sys_p99_batch 0.142 us vs <=0.44 us. The selection rule (min luts_plus_ffs) picks pipelined_m [W=17 N=14 angle_guard=2 frac_guard=1 round m=4] at luts_plus_ffs=1161, accuracy_bits=12.4 (max_abs_err 1.91e-04, still under the 2^-12 limit), throughput 93.6 MSPS and sys_p99_batch well inside 0.44 us. The unexplored iterative family is irrelevant here: unrolled_k, the other multi-cycle family, produced 0 feasible designs (max 9.97 MSPS, far below the 32 MSPS constraint), so a 1-micro-rotation/cycle datapath cannot meet the throughput/batch requirement. No further exploration is warranted within the budget.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.901e+04 (gain this round: +59.1%).
Feasible designs: 228 of 400 evaluations (202 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 18% violate; best seen 282
- max_abs_err <= 0.000244141: 19% violate; best seen 1.3e-07 (2^-22.87)
- sys_p99_batch_us <= 0.44: 34% violate; best seen 0.142

Pareto front (feasible, 26 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1161, accuracy_bits=12.4, luts=877, ffs=285, throughput_msps=93.6, max_abs_err=0.000191 (2^-12.36), power_index=1.4
- pipelined_m [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1271, accuracy_bits=13.3, luts=964, ffs=307, throughput_msps=93.6, max_abs_err=9.65e-05 (2^-13.34), power_index=1.53
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=3 rounding=round m=4] luts_plus_ffs=1473, accuracy_bits=14.4, luts=1152, ffs=321, throughput_msps=93.6, max_abs_err=4.61e-05 (2^-14.40), power_index=1.77
- pipelined_m [data_width=21 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1573, accuracy_bits=14.9, luts=1222, ffs=351, throughput_msps=89.6, max_abs_err=3.33e-05 (2^-14.88), power_index=1.89
- pipelined_m [data_width=18 n_iter=21 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1953, accuracy_bits=15.4, luts=1497, ffs=456, throughput_msps=93.6, max_abs_err=2.32e-05 (2^-15.40), power_index=2.35
- pipelined_m [data_width=22 n_iter=21 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=2036, accuracy_bits=17.2, luts=1544, ffs=492, throughput_msps=89.6, max_abs_err=6.76e-06 (2^-17.17), power_index=2.45
- pipelined_m [data_width=23 n_iter=21 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=2249, accuracy_bits=18.5, luts=1719, ffs=531, throughput_msps=89.6, max_abs_err=2.63e-06 (2^-18.54), power_index=2.71
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2512, accuracy_bits=19.7, luts=1953, ffs=559, throughput_msps=89.6, max_abs_err=1.14e-06 (2^-19.74), power_index=3.02
- pipelined_m [data_width=25 n_iter=22 angle_guard=4 frac_guard=4 rounding=round m=2] luts_plus_ffs=3204, accuracy_bits=20.8, luts=2116, ffs=1088, throughput_msps=153, max_abs_err=5.62e-07 (2^-20.76), power_index=3.86
- pipelined [data_width=28 n_iter=24 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=4766, accuracy_bits=22.6, luts=2380, ffs=2385, throughput_msps=242, max_abs_err=1.53e-07 (2^-22.64), power_index=5.74
Front coverage: luts_plus_ffs 1161..4766 (HV reference 4000); accuracy_bits 12.4..22.6 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- unrolled_k: 70 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 17.26 bits
- pipelined: 116 evals, 95 feasible; max throughput seen 282 MSPS; best accuracy 22.64 bits; best feasible luts_plus_ffs=2053; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 214 evals, 133 feasible; max throughput seen 171 MSPS; best accuracy 22.87 bits; best feasible luts_plus_ffs=1161; feasible ranges: data_width 17..28, n_iter 14..28, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 13807 in, 11584 out
- provider-reported cost: $0.0131
- full prompts and replies: `llm_trace.jsonl`

