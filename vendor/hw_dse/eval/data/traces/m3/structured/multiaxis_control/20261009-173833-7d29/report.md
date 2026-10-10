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
`pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=3` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 868 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 357 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 119 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 119 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 58.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.48 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000172 (2^-12.50) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.3 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.26e-05 (2^-14.21) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.45 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.3 dBc, SNR 82.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 0.3103 → 0.3186 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=21,n_iter=15,angle_guard=-2,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 0.3103 → 0.3186 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (30 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,m=3` | 868 | 357 | 119.3 | 7 | 1.48 | 0.000172 (2^-12.50) | 12.50 |
| 1 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc,m=4` | 949 | 301 | 93.6 | 6 | 1.5 | 0.000109 (2^-13.17) | 13.17 |
| 2 | `pipelined_m:data_width=21,n_iter=15,angle_guard=-2,frac_guard=0,rounding=round,m=4` | 994 | 317 | 93.6 | 6 | 1.58 | 9.08e-05 (2^-13.43) | 13.43 |
| 3 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 949 | 366 | 119.3 | 7 | 1.58 | 8.66e-05 (2^-13.50) | 13.50 |
| 4 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1008 | 313 | 93.6 | 6 | 1.59 | 8.04e-05 (2^-13.60) | 13.60 |
| 5 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=3,rounding=trunc,m=4` | 1038 | 319 | 93.6 | 6 | 1.63 | 7.96e-05 (2^-13.62) | 13.62 |
| 6 | `pipelined_m:data_width=21,n_iter=15,angle_guard=-1,frac_guard=1,rounding=trunc,m=3` | 1038 | 399 | 119.3 | 7 | 1.73 | 7.85e-05 (2^-13.64) | 13.64 |
| 7 | `pipelined_m:data_width=21,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc,m=3` | 1038 | 401 | 119.3 | 7 | 1.73 | 7.32e-05 (2^-13.74) | 13.74 |
| 8 | `pipelined_m:data_width=21,n_iter=15,angle_guard=1,frac_guard=3,rounding=trunc,m=4` | 1126 | 347 | 89.6 | 6 | 1.77 | 6.46e-05 (2^-13.92) | 13.92 |
| 9 | `pipelined_m:data_width=21,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 1141 | 351 | 89.6 | 6 | 1.8 | 6.38e-05 (2^-13.94) | 13.94 |
| 10 | `pipelined_m:data_width=20,n_iter=17,angle_guard=-1,frac_guard=1,rounding=trunc,m=4` | 1135 | 381 | 93.6 | 7 | 1.83 | 5.39e-05 (2^-14.18) | 14.18 |
| 11 | `pipelined_m:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1169 | 391 | 93.6 | 7 | 1.88 | 3.57e-05 (2^-14.78) | 14.78 |
| 12 | `pipelined_m:data_width=21,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round,m=4` | 1223 | 390 | 93.6 | 7 | 1.94 | 3.13e-05 (2^-14.97) | 14.97 |
| 13 | `pipelined_m:data_width=21,n_iter=18,angle_guard=1,frac_guard=0,rounding=round,m=4` | 1259 | 401 | 93.6 | 7 | 2 | 1.68e-05 (2^-15.87) | 15.87 |
| 14 | `pipelined_m:data_width=21,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1393 | 424 | 89.6 | 7 | 2.19 | 1.11e-05 (2^-16.46) | 16.46 |
| 15 | `pipelined_m:data_width=21,n_iter=19,angle_guard=2,frac_guard=1,rounding=round,m=4` | 1434 | 416 | 89.6 | 7 | 2.23 | 9.17e-06 (2^-16.74) | 16.74 |
| 16 | `pipelined_m:data_width=21,n_iter=19,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 1466 | 430 | 89.6 | 7 | 2.28 | 8.4e-06 (2^-16.86) | 16.86 |
| 17 | `pipelined_m:data_width=21,n_iter=19,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1472 | 424 | 89.6 | 7 | 2.28 | 7.33e-06 (2^-17.06) | 17.06 |
| 18 | `pipelined_m:data_width=21,n_iter=21,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1630 | 500 | 89.6 | 8 | 2.56 | 5.47e-06 (2^-17.48) | 17.48 |
| 19 | `pipelined_m:data_width=20,n_iter=21,angle_guard=3,frac_guard=4,rounding=round,m=4` | 1670 | 506 | 89.6 | 8 | 2.62 | 5.31e-06 (2^-17.52) | 17.52 |
| 20 | `pipelined_m:data_width=23,n_iter=20,angle_guard=0,frac_guard=2,rounding=round,m=3` | 1635 | 609 | 114.5 | 9 | 2.7 | 4.21e-06 (2^-17.86) | 17.86 |
| 21 | `pipelined_m:data_width=24,n_iter=20,angle_guard=3,frac_guard=0,rounding=round,m=3` | 1627 | 628 | 110.0 | 9 | 2.71 | 2.8e-06 (2^-18.44) | 18.44 |
| 22 | `pipelined_m:data_width=24,n_iter=21,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1826 | 561 | 89.6 | 8 | 2.87 | 1.49e-06 (2^-19.36) | 19.36 |
| 23 | `pipelined_m:data_width=24,n_iter=21,angle_guard=4,frac_guard=3,rounding=round,m=3` | 1910 | 673 | 110.0 | 9 | 3.11 | 1.22e-06 (2^-19.64) | 19.64 |
| 24 | `pipelined_m:data_width=28,n_iter=21,angle_guard=3,frac_guard=1,rounding=round,m=3` | 2066 | 734 | 105.9 | 9 | 3.37 | 9.79e-07 (2^-19.96) | 19.96 |
| 25 | `pipelined_m:data_width=24,n_iter=23,angle_guard=3,frac_guard=3,rounding=round,m=3` | 2073 | 755 | 110.0 | 10 | 3.4 | 5.25e-07 (2^-20.86) | 20.86 |
| 26 | `pipelined_m:data_width=28,n_iter=23,angle_guard=3,frac_guard=4,rounding=round,m=3` | 2406 | 874 | 105.9 | 10 | 3.95 | 2.52e-07 (2^-21.92) | 21.92 |
| 27 | `pipelined_m:data_width=27,n_iter=28,angle_guard=3,frac_guard=2,rounding=trunc,m=3` | 2680 | 1009 | 110.0 | 12 | 4.44 | 1.14e-07 (2^-23.06) | 23.06 |
| 28 | `pipelined_m:data_width=28,n_iter=28,angle_guard=3,frac_guard=1,rounding=trunc,m=3` | 2708 | 1023 | 105.9 | 12 | 4.49 | 1e-07 (2^-23.25) | 23.25 |
| 29 | `pipelined_m:data_width=28,n_iter=28,angle_guard=1,frac_guard=4,rounding=trunc,m=3` | 2822 | 1057 | 105.9 | 12 | 4.67 | 8.37e-08 (2^-23.51) | 23.51 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraint is the system batch deadline: a 1 MHz tick dumps 32 requests at once and the last result must be back within 0.44 us. That only works for families that retire ~1 result/cycle. pipelined needs N+2+31 = N+33 cycles and pipelined_m needs ceil(N/m)+2+31 = ceil(N/m)+33 cycles, both comfortably inside 0.44 us at realistic Fmax. iterative needs 32*(N+3) >= 224 cycles and unrolled_k needs >= 32*4 = 128 cycles (its floor is ceil(N/k)+3 = 4 cycles/result), i.e. >290 MHz to make the deadline - implausible, and the L1 bound is optimistic so a design that only just passes L1 will be lost at L2. So the Pareto front lives in pipelined / pipelined_m; unrolled_k gets a small probe to confirm it is off the front, and iterative is dropped. Accuracy (max_abs_err <= 2^-12) depends only on (data_width, n_iter, angle_guard, frac_guard, rounding), so the area/accuracy trade-off is driven by W and N: W=13 is right at the 2^-12 boundary (0.5 LSB = 2^-12) and W>=14 is safe, with N ~ W needed for the angle approximation. The objective min luts_plus_ffs favours pipelined_m with large m (fewer register stages => fewer FFs) but large m lengthens the combinational path and lowers Fmax, which eats the 0.44 us batch budget - so m is the key knob and pipelined (m=1) is the high-Fmax fallback. Round 1 is broad exploration; later rounds will narrow around the front and then re-map it over the full ranges of whichever families survive.*)
- `pipelined_m` (55 evals): data_width=13..20, n_iter=9..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Best area candidate: 1 result/cycle so it trivially meets throughput>=32 and the batch deadline (ceil(N/m)+33 cycles), while registering only every m stages cuts the FF count that dominates luts_plus_ffs. m is the main trade-off knob (area vs Fmax vs batch margin), so it gets the largest share and the full m range.
- `pipelined` (30 evals): data_width=13..20, n_iter=9..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* High-Fmax fallback and the reference point for the m trade-off: one register per micro-rotation gives the shortest combinational path, so it is the design that keeps the N+33-cycle batch time safely inside 0.44 us even at large N. It has more FFs than pipelined_m, so it should sit above it on the area axis - worth mapping to see where the batch constraint starts to bind.
- `unrolled_k` (15 evals): data_width=13..20, n_iter=9..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Small probe only. Its floor is 4 cycles/result (ceil(N/k)+3 with N<=k), so 32 results need >=128 cycles and it would need ~290 MHz to hit 0.44 us, and throughput = Fmax/(ceil(N/k)+3) is near the 32 MSps floor. It is the only other family with any chance of high throughput, so a few evals confirm whether it is off the front rather than assuming it.

**Result (code):** 100 evaluations this round, 100 total; 26 feasible; hypervolume 8185 (n/a).

**LLM decision:** `map_front` — Round 1 leaves a thin front: only 4 designs, all pipelined_m, spanning luts_plus_ffs 1491..1937 (HV ref 4000) and accuracy_bits 13.3..15.4 (HV ref 12) — a small slice of both objective ranges, so HV 8185 is far from covering the trade-off curve. The only families that produced feasible designs are pipelined (9 feasible, best accuracy 14.95) and pipelined_m (17 feasible, cheapest 1491); unrolled_k gave 0 feasible (max 12 MSPS) and iterative is structurally unable to meet the system constraint: at N+3 cycles/result a 32-request burst needs 32*(N+3) >= 224 cycles, i.e. ~0.9 us at any plausible Fmax, far over the 0.44 us p99_batch bound, and even the 32 MSPS throughput floor needs N+3 <= ~8. So there is no value in adding iterative. The right move is to let code map the whole front over the full ranges of pipelined and pipelined_m, seeded with the current front, to fill the curve and find cheaper / higher-margin points — important because the cheapest design (m=4, 93.6 MSPS) implies a ~0.42 us batch, only just inside the 0.44 us L1 bound, so L2 margin matters for the min-luts_plus_ffs selection rule.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8185 (gain this round: n/a (first round)).
Feasible designs: 26 of 100 evaluations (24 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 15% violate; best seen 273
- max_abs_err <= 0.000244141: 57% violate; best seen 2.32e-05 (2^-15.40)
- sys_p99_batch_us <= 0.44: 40% violate; best seen 0.15

Pareto front (feasible, 4 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=17 angle_guard=-1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1491, accuracy_bits=13.3, luts=1124, ffs=366, throughput_msps=93.6, max_abs_err=0.000101 (2^-13.28), power_index=1.79
- pipelined_m [data_width=20 n_iter=17 angle_guard=-1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1516, accuracy_bits=14.2, luts=1135, ffs=381, throughput_msps=93.6, max_abs_err=5.39e-05 (2^-14.18), power_index=1.83
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1560, accuracy_bits=14.8, luts=1169, ffs=391, throughput_msps=93.6, max_abs_err=3.57e-05 (2^-14.78), power_index=1.88
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=round m=2] luts_plus_ffs=1937, accuracy_bits=15.4, luts=1244, ffs=692, throughput_msps=164, max_abs_err=2.32e-05 (2^-15.40), power_index=2.33
Front coverage: luts_plus_ffs 1491..1937 (HV reference 4000); accuracy_bits 13.3..15.4 (HV reference 12); data_width on the front 19..20 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.40 bits
- pipelined: 30 evals, 9 feasible; max throughput seen 273 MSPS; best accuracy 14.95 bits; best feasible luts_plus_ffs=2063; feasible ranges: data_width 17..20, n_iter 17..20, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 55 evals, 17 feasible; max throughput seen 178 MSPS; best accuracy 15.40 bits; best feasible luts_plus_ffs=1491; feasible ranges: data_width 18..20, n_iter 17..19, angle_guard -1..2, frac_guard 1..3, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=18..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (4 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 80 feasible; hypervolume 1.735e+04 (+111.9%).

**LLM decision:** `refine` — Round 2 left the front well-covered in accuracy (12.9..23.1 bits, all above the 12-bit HV reference) but the low-area end is the weak spot: the cheapest feasible design is 1284 LUT+FF at accuracy 12.9 bits, i.e. there is an unexplored gap between the 2^-12 accuracy constraint and 12.9 bits where cheaper designs should exist. The area range 1284..3689 also stops short of the 4000 HV reference, so pushing the front leftward is the main HV lever. The binding constraint is sys_p99_batch_us (43% violate, best 0.15), and the cheapest pipelined_m points run at only 89-94 MSPS, so the low-area search must keep m=2 (higher-throughput) options alive to preserve L2 margin. unrolled_k (0/15 feasible, max 12 MSPS) and iterative (N+3 cycles/result) cannot reach the 32 MSPS throughput floor, so no new family is worth adding; the feasible ranges are already wide, so widening is not needed. Refine the low-area corner of pipelined_m/pipelined now, leaving the reserved budget for the final full-range front map.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.735e+04 (gain this round: +111.9%).
Feasible designs: 80 of 200 evaluations (76 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 273
- max_abs_err <= 0.000244141: 29% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_batch_us <= 0.44: 43% violate; best seen 0.15

Pareto front (feasible, 15 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=15 angle_guard=-1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1284, accuracy_bits=12.9, luts=979, ffs=305, throughput_msps=93.6, max_abs_err=0.000127 (2^-12.94), power_index=1.55
- pipelined_m [data_width=21 n_iter=15 angle_guard=-1 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1436, accuracy_bits=13.6, luts=1038, ffs=399, throughput_msps=119, max_abs_err=7.85e-05 (2^-13.64), power_index=1.73
- pipelined_m [data_width=20 n_iter=17 angle_guard=-1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1516, accuracy_bits=14.2, luts=1135, ffs=381, throughput_msps=93.6, max_abs_err=5.39e-05 (2^-14.18), power_index=1.83
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=2 rounding=round m=2] luts_plus_ffs=1937, accuracy_bits=15.4, luts=1244, ffs=692, throughput_msps=164, max_abs_err=2.32e-05 (2^-15.40), power_index=2.33
- pipelined_m [data_width=20 n_iter=21 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=2045, accuracy_bits=16.7, luts=1565, ffs=480, throughput_msps=93.6, max_abs_err=9.54e-06 (2^-16.68), power_index=2.46
- pipelined_m [data_width=20 n_iter=21 angle_guard=4 frac_guard=4 rounding=trunc m=4] luts_plus_ffs=2160, accuracy_bits=17.2, luts=1649, ffs=511, throughput_msps=89.6, max_abs_err=6.61e-06 (2^-17.21), power_index=2.6
- pipelined_m [data_width=20 n_iter=21 angle_guard=3 frac_guard=4 rounding=round m=4] luts_plus_ffs=2177, accuracy_bits=17.5, luts=1670, ffs=506, throughput_msps=89.6, max_abs_err=5.31e-06 (2^-17.52), power_index=2.62
- pipelined_m [data_width=24 n_iter=21 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=2387, accuracy_bits=19.4, luts=1826, ffs=561, throughput_msps=89.6, max_abs_err=1.49e-06 (2^-19.36), power_index=2.87
- pipelined_m [data_width=24 n_iter=21 angle_guard=4 frac_guard=3 rounding=round m=3] luts_plus_ffs=2583, accuracy_bits=19.6, luts=1910, ffs=673, throughput_msps=110, max_abs_err=1.22e-06 (2^-19.64), power_index=3.11
- pipelined_m [data_width=27 n_iter=28 angle_guard=3 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=3689, accuracy_bits=23.1, luts=2680, ffs=1009, throughput_msps=110, max_abs_err=1.14e-07 (2^-23.06), power_index=4.44
Front coverage: luts_plus_ffs 1284..3689 (HV reference 4000); accuracy_bits 12.9..23.1 (HV reference 12); data_width on the front 19..28 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.40 bits
- pipelined: 30 evals, 9 feasible; max throughput seen 273 MSPS; best accuracy 14.95 bits; best feasible luts_plus_ffs=2063; feasible ranges: data_width 17..20, n_iter 17..20, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 155 evals, 71 feasible; max throughput seen 178 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=1284; feasible ranges: data_width 18..28, n_iter 15..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Target cheaper designs near the accuracy constraint while keeping throughput/system margin.*)
- `pipelined_m` (70 evals): data_width=18..21, n_iter=14..19, angle_guard=-2..2, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Only family producing the cheap end of the front; search below data_width=19 / n_iter=15.
- `pipelined` (30 evals): data_width=17..20, n_iter=16..20, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* Second feasible family; its best feasible area (2063) is above the front but it may supply cheap high-throughput points.

**Result (code):** 100 evaluations this round, 300 total; 178 feasible; hypervolume 1.811e+04 (+4.4%).

**LLM decision:** `map_front` — All 23 front designs are pipelined_m, and the front's cost range (luts_plus_ffs 1225..3689 against HV ref 4000) is thin at the cheap end that the selection rule (min luts_plus_ffs) actually picks, while accuracy already spans 12.5..23.1 bits well past the 12-bit ref. pipelined is dominated (best feasible luts_plus_ffs=1966 vs 1225) and unrolled_k produced 0 feasible designs in 15 evals (max 12 MSPS), so neither deserves budget. iterative is structurally throughput-infeasible here: at N+3 cycles/result with registry n_iter>=4 it cannot reach the 32 MSPS constraint that pipelined_m clears at 89-178 MSPS. With only the final 100 evals left, the reserved coverage search is the right use: map the full pipelined_m ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, m 2..8) seeded with the current front, so the whole trade-off curve is covered before L2 re-selection among the cheapest designs.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.811e+04 (gain this round: +4.4%).
Feasible designs: 178 of 300 evaluations (161 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 273
- max_abs_err <= 0.000244141: 20% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_batch_us <= 0.44: 29% violate; best seen 0.15

Pareto front (feasible, 23 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1225, accuracy_bits=12.5, luts=868, ffs=357, throughput_msps=119, max_abs_err=0.000172 (2^-12.50), power_index=1.48
- pipelined_m [data_width=21 n_iter=15 angle_guard=-2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1310, accuracy_bits=13.4, luts=994, ffs=317, throughput_msps=93.6, max_abs_err=9.08e-05 (2^-13.43), power_index=1.58
- pipelined_m [data_width=21 n_iter=15 angle_guard=-1 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1436, accuracy_bits=13.6, luts=1038, ffs=399, throughput_msps=119, max_abs_err=7.85e-05 (2^-13.64), power_index=1.73
- pipelined_m [data_width=21 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1474, accuracy_bits=13.9, luts=1126, ffs=347, throughput_msps=89.6, max_abs_err=6.46e-05 (2^-13.92), power_index=1.77
- pipelined_m [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1560, accuracy_bits=14.8, luts=1169, ffs=391, throughput_msps=93.6, max_abs_err=3.57e-05 (2^-14.78), power_index=1.88
- pipelined_m [data_width=21 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1660, accuracy_bits=15.9, luts=1259, ffs=401, throughput_msps=93.6, max_abs_err=1.68e-05 (2^-15.87), power_index=2
- pipelined_m [data_width=21 n_iter=19 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1896, accuracy_bits=17.1, luts=1472, ffs=424, throughput_msps=89.6, max_abs_err=7.33e-06 (2^-17.06), power_index=2.28
- pipelined_m [data_width=20 n_iter=21 angle_guard=3 frac_guard=4 rounding=round m=4] luts_plus_ffs=2177, accuracy_bits=17.5, luts=1670, ffs=506, throughput_msps=89.6, max_abs_err=5.31e-06 (2^-17.52), power_index=2.62
- pipelined_m [data_width=24 n_iter=21 angle_guard=4 frac_guard=3 rounding=round m=3] luts_plus_ffs=2583, accuracy_bits=19.6, luts=1910, ffs=673, throughput_msps=110, max_abs_err=1.22e-06 (2^-19.64), power_index=3.11
- pipelined_m [data_width=27 n_iter=28 angle_guard=3 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=3689, accuracy_bits=23.1, luts=2680, ffs=1009, throughput_msps=110, max_abs_err=1.14e-07 (2^-23.06), power_index=4.44
Front coverage: luts_plus_ffs 1225..3689 (HV reference 4000); accuracy_bits 12.5..23.1 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.40 bits
- pipelined: 60 evals, 38 feasible; max throughput seen 273 MSPS; best accuracy 16.05 bits; best feasible luts_plus_ffs=1966; feasible ranges: data_width 17..20, n_iter 16..20, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 225 evals, 140 feasible; max throughput seen 178 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=1225; feasible ranges: data_width 18..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=17..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (23 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 229 feasible; hypervolume 1.942e+04 (+7.3%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), so no further search is possible. The front is feasible and healthy, so `infeasible` is not warranted: 229 of 400 evaluations are feasible (206 unique), all three constraints are met with margin (throughput best 273 MSPS vs >=32; max_abs_err best 2^-24.39 vs <=2^-12; sys_p99_batch_us best 0.15 us vs <=0.44 us), and the Pareto front spans luts_plus_ffs 1225..3879 against the HV reference 4000 and accuracy_bits 12.5..23.5 against the reference 12, giving hypervolume 1.942e+04 with a +7.3% gain this round. The selection rule (min luts_plus_ffs) is already served by the front's cheapest point, pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=3] at luts_plus_ffs=1225, accuracy_bits=12.5 (max_abs_err 1.72e-04, still under the 2.44e-04 limit) with 119 MSPS throughput. The only unexplored family, iterative, is dominated in principle here: it yields one result per N+3 cycles, and the unrolled_k family (same serial structure, k micro-rotations/cycle) already produced 0 feasible designs in 15 evals with max throughput 12 MSPS, far below the 32 MSPS constraint, so iterative cannot add feasible front coverage. Stopping is the correct terminal decision.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.942e+04 (gain this round: +7.3%).
Feasible designs: 229 of 400 evaluations (206 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 4% violate; best seen 273
- max_abs_err <= 0.000244141: 16% violate; best seen 4.54e-08 (2^-24.39)
- sys_p99_batch_us <= 0.44: 33% violate; best seen 0.15

Pareto front (feasible, 30 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1225, accuracy_bits=12.5, luts=868, ffs=357, throughput_msps=119, max_abs_err=0.000172 (2^-12.50), power_index=1.48
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1316, accuracy_bits=13.5, luts=949, ffs=366, throughput_msps=119, max_abs_err=8.66e-05 (2^-13.50), power_index=1.58
- pipelined_m [data_width=21 n_iter=15 angle_guard=-1 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1436, accuracy_bits=13.6, luts=1038, ffs=399, throughput_msps=119, max_abs_err=7.85e-05 (2^-13.64), power_index=1.73
- pipelined_m [data_width=20 n_iter=17 angle_guard=-1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1516, accuracy_bits=14.2, luts=1135, ffs=381, throughput_msps=93.6, max_abs_err=5.39e-05 (2^-14.18), power_index=1.83
- pipelined_m [data_width=21 n_iter=18 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1660, accuracy_bits=15.9, luts=1259, ffs=401, throughput_msps=93.6, max_abs_err=1.68e-05 (2^-15.87), power_index=2
- pipelined_m [data_width=21 n_iter=19 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1896, accuracy_bits=16.9, luts=1466, ffs=430, throughput_msps=89.6, max_abs_err=8.4e-06 (2^-16.86), power_index=2.28
- pipelined_m [data_width=20 n_iter=21 angle_guard=3 frac_guard=4 rounding=round m=4] luts_plus_ffs=2177, accuracy_bits=17.5, luts=1670, ffs=506, throughput_msps=89.6, max_abs_err=5.31e-06 (2^-17.52), power_index=2.62
- pipelined_m [data_width=24 n_iter=21 angle_guard=4 frac_guard=3 rounding=round m=3] luts_plus_ffs=2583, accuracy_bits=19.6, luts=1910, ffs=673, throughput_msps=110, max_abs_err=1.22e-06 (2^-19.64), power_index=3.11
- pipelined_m [data_width=28 n_iter=23 angle_guard=3 frac_guard=4 rounding=round m=3] luts_plus_ffs=3279, accuracy_bits=21.9, luts=2406, ffs=874, throughput_msps=106, max_abs_err=2.52e-07 (2^-21.92), power_index=3.95
- pipelined_m [data_width=28 n_iter=28 angle_guard=1 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=3879, accuracy_bits=23.5, luts=2822, ffs=1057, throughput_msps=106, max_abs_err=8.37e-08 (2^-23.51), power_index=4.67
Front coverage: luts_plus_ffs 1225..3879 (HV reference 4000); accuracy_bits 12.5..23.5 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 13.40 bits
- pipelined: 60 evals, 38 feasible; max throughput seen 273 MSPS; best accuracy 16.05 bits; best feasible luts_plus_ffs=1966; feasible ranges: data_width 17..20, n_iter 16..20, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 325 evals, 191 feasible; max throughput seen 178 MSPS; best accuracy 24.39 bits; best feasible luts_plus_ffs=1225; feasible ranges: data_width 17..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16235 in, 23972 out
- provider-reported cost: $0.0148
- full prompts and replies: `llm_trace.jsonl`

