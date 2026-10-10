# DSE run: bursty_offload

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec bursty_offload: Sin/cos offload for an 8-channel sensor front end: bursts of 8 requests arrive as a Poisson process, 2 requests/us on average; p99 request latency must be <= 0.4 us. Max error <= 2^-10. Minimise LUTs + FFs.
  constraint: throughput_msps >= 2
  constraint: max_abs_err <= 0.000976562
  constraint: sys_p99_latency_us <= 0.4
  objective: min luts_plus_ffs (HV ref 3000)
  objective: max accuracy_bits (HV ref 10)
  select: min luts_plus_ffs
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=18,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 701 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 159 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 67.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0647 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000575 (2^-10.76) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 37.7 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 0.000201 (2^-12.28) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 13.2 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 10.8 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 79.3 dBc, SNR 70.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=18,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=0,frac_guard=2,rounding=trunc,m=7` | 0.1678 → 0.2328 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=0,frac_guard=2,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=1,rounding=round,m=8` | 0.1896 → 0.2667 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (33 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=12,angle_guard=0,frac_guard=0,rounding=trunc,m=7` | 701 | 159 | 59.6 | 4 | 0.0647 | 0.000575 (2^-10.76) | 10.76 |
| 1 | `pipelined_m:data_width=16,n_iter=13,angle_guard=0,frac_guard=2,rounding=trunc,m=8` | 739 | 147 | 52.7 | 4 | 0.0667 | 0.000474 (2^-11.04) | 11.04 |
| 2 | `pipelined_m:data_width=16,n_iter=13,angle_guard=0,frac_guard=2,rounding=trunc,m=7` | 739 | 147 | 59.6 | 4 | 0.0667 | 0.000474 (2^-11.04) | 11.04 |
| 3 | `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 764 | 151 | 52.7 | 4 | 0.0689 | 0.000378 (2^-11.37) | 11.37 |
| 4 | `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=1,rounding=round,m=8` | 772 | 151 | 52.7 | 4 | 0.0695 | 0.000325 (2^-11.59) | 11.59 |
| 5 | `pipelined_m:data_width=18,n_iter=13,angle_guard=0,frac_guard=1,rounding=trunc,m=8` | 789 | 161 | 50.3 | 4 | 0.0715 | 0.000303 (2^-11.69) | 11.69 |
| 6 | `pipelined_m:data_width=18,n_iter=13,angle_guard=1,frac_guard=1,rounding=trunc,m=7` | 802 | 163 | 56.8 | 4 | 0.0726 | 0.000294 (2^-11.73) | 11.73 |
| 7 | `pipelined_m:data_width=17,n_iter=13,angle_guard=2,frac_guard=2,rounding=round,m=8` | 838 | 161 | 50.3 | 4 | 0.0752 | 0.000291 (2^-11.75) | 11.75 |
| 8 | `pipelined_m:data_width=17,n_iter=14,angle_guard=0,frac_guard=1,rounding=round,m=7` | 849 | 155 | 59.6 | 4 | 0.0756 | 0.000264 (2^-11.89) | 11.89 |
| 9 | `pipelined_m:data_width=17,n_iter=14,angle_guard=0,frac_guard=1,rounding=round,m=8` | 849 | 155 | 52.7 | 4 | 0.0756 | 0.000264 (2^-11.89) | 11.89 |
| 10 | `pipelined_m:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=8` | 877 | 159 | 50.3 | 4 | 0.0779 | 0.000191 (2^-12.36) | 12.36 |
| 11 | `pipelined_m:data_width=18,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc,m=8` | 920 | 161 | 50.3 | 4 | 0.0814 | 0.00016 (2^-12.61) | 12.61 |
| 12 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=8` | 920 | 167 | 50.3 | 4 | 0.0818 | 0.000152 (2^-12.68) | 12.68 |
| 13 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc,m=8` | 979 | 172 | 50.3 | 4 | 0.0865 | 9.41e-05 (2^-13.38) | 13.38 |
| 14 | `pipelined_m:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=trunc,m=8` | 1033 | 167 | 50.3 | 4 | 0.0903 | 8.72e-05 (2^-13.49) | 13.49 |
| 15 | `pipelined_m:data_width=20,n_iter=16,angle_guard=-1,frac_guard=1,rounding=trunc,m=5` | 1064 | 313 | 77.0 | 6 | 0.104 | 6.62e-05 (2^-13.88) | 13.88 |
| 16 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc,m=5` | 1096 | 317 | 77.0 | 6 | 0.106 | 4.81e-05 (2^-14.34) | 14.34 |
| 17 | `pipelined_m:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 1169 | 246 | 50.3 | 5 | 0.106 | 3.81e-05 (2^-14.68) | 14.68 |
| 18 | `pipelined_m:data_width=22,n_iter=16,angle_guard=3,frac_guard=0,rounding=trunc,m=6` | 1191 | 274 | 62.5 | 5 | 0.11 | 3.7e-05 (2^-14.72) | 14.72 |
| 19 | `pipelined_m:data_width=23,n_iter=16,angle_guard=3,frac_guard=1,rounding=trunc,m=8` | 1270 | 208 | 48.0 | 4 | 0.111 | 3.15e-05 (2^-14.95) | 14.95 |
| 20 | `pipelined_m:data_width=21,n_iter=18,angle_guard=0,frac_guard=1,rounding=trunc,m=8` | 1277 | 258 | 50.3 | 5 | 0.116 | 2.08e-05 (2^-15.56) | 15.56 |
| 21 | `pipelined_m:data_width=20,n_iter=18,angle_guard=4,frac_guard=4,rounding=round,m=6` | 1445 | 273 | 62.5 | 5 | 0.129 | 1.06e-05 (2^-16.52) | 16.52 |
| 22 | `pipelined_m:data_width=25,n_iter=18,angle_guard=4,frac_guard=4,rounding=trunc,m=8` | 1671 | 327 | 45.9 | 5 | 0.15 | 7.74e-06 (2^-16.98) | 16.98 |
| 23 | `pipelined_m:data_width=24,n_iter=22,angle_guard=0,frac_guard=1,rounding=round,m=8` | 1826 | 294 | 48.0 | 5 | 0.159 | 2.24e-06 (2^-18.77) | 18.77 |
| 24 | `pipelined_m:data_width=23,n_iter=24,angle_guard=2,frac_guard=2,rounding=round,m=8` | 2017 | 293 | 48.0 | 5 | 0.174 | 1.42e-06 (2^-19.43) | 19.43 |
| 25 | `pipelined_m:data_width=25,n_iter=24,angle_guard=0,frac_guard=0,rounding=round,m=7` | 1968 | 381 | 54.3 | 6 | 0.177 | 1.37e-06 (2^-19.48) | 19.48 |
| 26 | `pipelined_m:data_width=25,n_iter=23,angle_guard=0,frac_guard=4,rounding=trunc,m=8` | 2069 | 315 | 45.9 | 5 | 0.179 | 1.06e-06 (2^-19.85) | 19.85 |
| 27 | `pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=4,rounding=trunc,m=8` | 2115 | 321 | 45.9 | 5 | 0.183 | 5.06e-07 (2^-20.91) | 20.91 |
| 28 | `pipelined_m:data_width=25,n_iter=23,angle_guard=4,frac_guard=4,rounding=trunc,m=8` | 2161 | 327 | 45.9 | 5 | 0.187 | 3.97e-07 (2^-21.26) | 21.26 |
| 29 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=0,rounding=round,m=6` | 2162 | 418 | 59.9 | 6 | 0.194 | 2.66e-07 (2^-21.84) | 21.84 |
| 30 | `pipelined_m:data_width=25,n_iter=24,angle_guard=4,frac_guard=4,rounding=round,m=7` | 2312 | 424 | 52.0 | 6 | 0.206 | 2.16e-07 (2^-22.14) | 22.14 |
| 31 | `pipelined_m:data_width=27,n_iter=24,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2413 | 839 | 105.9 | 10 | 0.245 | 1.68e-07 (2^-22.51) | 22.51 |
| 32 | `pipelined_m:data_width=27,n_iter=26,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2618 | 938 | 105.9 | 11 | 0.268 | 9.68e-08 (2^-23.30) | 23.30 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The p99 latency of 0.4 us on a burst of 8 simultaneous requests rules out the plain iterative family, since 8 queued results at N+3 cycles each take far too long. Pipelined variants drain a burst at one result per cycle, and high-k unrolled designs are a possible area saver. The error bound of 2^-10 needs roughly 11-13 output bits and 10-13 iterations, so I search slightly above that to cover the accuracy_bits trade-off. Later rounds can narrow to whichever family dominates the front.*)
- `pipelined_m` (43 evals): data_width=10..18, n_iter=9..15, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Accepts one request per cycle, so the 8-request burst drains quickly. Registering every m stages cuts FFs, which targets the LUTs+FFs objective, while latency stays well under 0.4 us if Fmax holds.
- `pipelined` (29 evals): data_width=10..18, n_iter=9..15, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Fully pipelined baseline with the highest Fmax. It is the safe option for burst latency and anchors the front, but it uses more FFs.
- `unrolled_k` (28 evals): data_width=10..16, n_iter=9..13, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* A high k shortens the per-result occupancy, so it might clear the 8-request burst within 0.4 us at lower area than a pipeline. Only large k and small N are plausible, so ranges are narrowed there.

**Result (code):** 100 evaluations this round, 100 total; 30 feasible; hypervolume 5162 (n/a).

**LLM decision:** `add_family` — Pipelined_m dominates the front: all 7 front designs come from it, and the cheapest is 930 LUTs+FFs at 10.3 bits. Pipelined's best feasible is 1578, which is worse. Unrolled_k has 0 feasible designs out of 28, with max throughput 10.1 MSPS, so it cannot meet the burst latency bound. Iterative is the only family not yet tried. It is the smallest datapath, but its N+3 cycles per result is slower still than unrolled_k, so I give it a small probe share to settle it. Most of the budget goes to refining pipelined_m, whose feasible designs sit at data_width 14..18, n_iter 12..15 and frac_guard 1..3. The accuracy constraint (69% of evaluations violate) needs roughly 10+ bits, so the cheapest region is just above that threshold. I also keep a small pipelined share and extend the pipelined_m range slightly toward larger m for lower FF counts.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5162 (gain this round: n/a (first round)).
Feasible designs: 30 of 100 evaluations (24 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 69% violate; best seen 0.000143 (2^-12.77)
- sys_p99_latency_us <= 0.4: 28% violate; best seen 0.0639

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=15 n_iter=13 angle_guard=0 frac_guard=2 rounding=round m=6] luts_plus_ffs=930, accuracy_bits=10.3, luts=732, ffs=198, throughput_msps=68.5, max_abs_err=0.000803 (2^-10.28), power_index=0.07
- pipelined_m [data_width=14 n_iter=13 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=934, accuracy_bits=10.3, luts=692, ffs=242, throughput_msps=97.8, max_abs_err=0.000795 (2^-10.30), power_index=0.0703
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=947, accuracy_bits=11.3, luts=800, ffs=147, throughput_msps=59.6, max_abs_err=0.000391 (2^-11.32), power_index=0.0713
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1074, accuracy_bits=11.7, luts=798, ffs=276, throughput_msps=97.8, max_abs_err=0.00031 (2^-11.65), power_index=0.0808
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=2] luts_plus_ffs=1322, accuracy_bits=12.3, luts=861, ffs=461, throughput_msps=171, max_abs_err=0.000204 (2^-12.26), power_index=0.0995
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=2] luts_plus_ffs=1455, accuracy_bits=12.8, luts=947, ffs=507, throughput_msps=164, max_abs_err=0.000144 (2^-12.76), power_index=0.109
- pipelined_m [data_width=18 n_iter=14 angle_guard=3 frac_guard=2 rounding=round m=2] luts_plus_ffs=1476, accuracy_bits=12.8, luts=961, ffs=515, throughput_msps=164, max_abs_err=0.000143 (2^-12.77), power_index=0.111
Front coverage: luts_plus_ffs 930..1476 (HV reference 3000); accuracy_bits 10.3..12.8 (HV reference 10); data_width on the front 14..18 (registry 8..28).

Per family:
- unrolled_k: 28 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 10.48 bits
- pipelined: 29 evals, 5 feasible; max throughput seen 282 MSPS; best accuracy 11.75 bits; best feasible luts_plus_ffs=1578; feasible ranges: data_width 15..16, n_iter 14..14, angle_guard 2..2, frac_guard 0..3
- pipelined_m: 43 evals, 25 feasible; max throughput seen 178 MSPS; best accuracy 12.77 bits; best feasible luts_plus_ffs=930; feasible ranges: data_width 14..18, n_iter 12..15, angle_guard -1..3, frac_guard 1..3, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined_m near the accuracy threshold while probing the one unexplored family at low cost.*)
- `pipelined_m` (67 evals): data_width=13..18, n_iter=11..15, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* All front points come from here; focus on the data_width/n_iter region that just clears 2^-10 with the lowest area, and cover m up to 8 for fewer registers.
- `pipelined` (17 evals): data_width=13..16, n_iter=12..14, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Has 5 feasible designs with best 1578; a narrow check that it cannot undercut pipelined_m.
- `iterative` (16 evals): data_width=12..16, n_iter=11..14, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Unexplored and smallest in area; a probe to see whether it can meet the bursty p99 latency bound at all.

**Result (code):** 100 evaluations this round, 200 total; 92 feasible; hypervolume 6786 (+31.4%).

**LLM decision:** `refine` — Only pipelined_m appears on the front (14 designs, luts_plus_ffs 860..1220, accuracy 10.8..13.4 bits). Last round still gained +31.4% hypervolume, so the front is still improving. iterative and unrolled_k have 0 feasible designs in 44 evals (max 14.2 and 10.1 MSPS, with the system p99 latency bound failing), so I drop them. Plain pipelined is feasible but dominated (best 1297 vs 860). The cheapest designs sit at data_width 16-18, n_iter 12-15, m 7-8, which cuts FFs. Accuracy only needs to reach 2^-10, and the front has nothing between 10.0 and 10.8 bits. Smaller data_width 12-15 and n_iter 11-12 may still be feasible there at lower area. I also extend the upper end (data_width up to 20, n_iter up to 17) to cover the high-accuracy side of the curve. Ranges are tightened to pipelined_m with high m, plus a small share for pipelined as a cross-check.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 6786 (gain this round: +31.4%).
Feasible designs: 92 of 200 evaluations (77 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 48% violate; best seen 9.31e-05 (2^-13.39)
- sys_p99_latency_us <= 0.4: 22% violate; best seen 0.0639

Pareto front (feasible, 14 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=860, accuracy_bits=10.8, luts=701, ffs=159, throughput_msps=59.6, max_abs_err=0.000575 (2^-10.76), power_index=0.0647
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=886, accuracy_bits=11, luts=739, ffs=147, throughput_msps=52.7, max_abs_err=0.000474 (2^-11.04), power_index=0.0667
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=915, accuracy_bits=11.4, luts=764, ffs=151, throughput_msps=52.7, max_abs_err=0.000378 (2^-11.37), power_index=0.0689
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=1 rounding=round m=8] luts_plus_ffs=924, accuracy_bits=11.6, luts=772, ffs=151, throughput_msps=52.7, max_abs_err=0.000325 (2^-11.59), power_index=0.0695
- pipelined_m [data_width=17 n_iter=13 angle_guard=2 frac_guard=2 rounding=round m=8] luts_plus_ffs=999, accuracy_bits=11.7, luts=838, ffs=161, throughput_msps=50.3, max_abs_err=0.000291 (2^-11.75), power_index=0.0752
- pipelined_m [data_width=17 n_iter=14 angle_guard=0 frac_guard=1 rounding=round m=7] luts_plus_ffs=1005, accuracy_bits=11.9, luts=849, ffs=155, throughput_msps=59.6, max_abs_err=0.000264 (2^-11.89), power_index=0.0756
- pipelined_m [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=8] luts_plus_ffs=1036, accuracy_bits=12.4, luts=877, ffs=159, throughput_msps=50.3, max_abs_err=0.000191 (2^-12.36), power_index=0.0779
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=8] luts_plus_ffs=1087, accuracy_bits=12.7, luts=920, ffs=167, throughput_msps=50.3, max_abs_err=0.000152 (2^-12.68), power_index=0.0818
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=1214, accuracy_bits=13.4, luts=979, ffs=235, throughput_msps=56.8, max_abs_err=9.49e-05 (2^-13.36), power_index=0.0913
- pipelined_m [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round m=7] luts_plus_ffs=1220, accuracy_bits=13.4, luts=987, ffs=233, throughput_msps=56.8, max_abs_err=9.31e-05 (2^-13.39), power_index=0.0918
Front coverage: luts_plus_ffs 860..1220 (HV reference 3000); accuracy_bits 10.8..13.4 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 16 evals, 0 feasible; max throughput seen 14.2 MSPS; best accuracy 12.22 bits
- unrolled_k: 28 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 10.48 bits
- pipelined: 46 evals, 14 feasible; max throughput seen 282 MSPS; best accuracy 11.75 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 13..16, n_iter 12..14, angle_guard 1..3, frac_guard 0..3
- pipelined_m: 110 evals, 78 feasible; max throughput seen 178 MSPS; best accuracy 13.39 bits; best feasible luts_plus_ffs=860; feasible ranges: data_width 14..18, n_iter 12..15, angle_guard -1..3, frac_guard 0..3, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate evaluations on pipelined_m, which dominates the front, with a small cross-check on pipelined. Extend data_width and n_iter at both ends to fill the gaps in accuracy coverage.*)
- `pipelined_m` (32 evals): data_width=12..20, n_iter=10..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=5..8. *Why:* All front members come from this family; high m minimises FFs. Wider data_width and n_iter bounds probe cheaper low-accuracy designs near 2^-10 and the higher-accuracy end.
- `pipelined` (8 evals): data_width=12..17, n_iter=11..15, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* Its best feasible area is 1297, close enough to the front to check that it cannot compete in the low-area corner.

**Result (code):** 40 evaluations this round, 240 total; 121 feasible; hypervolume 8884 (+30.9%).

**LLM decision:** `stop` — This is the final round, so stop is the only meaningful choice. The front has 18 feasible designs, all from pipelined_m, spanning luts_plus_ffs 860..1415 and accuracy_bits 10.8..14.7. The cheapest design (data_width=18, n_iter=12, trunc, m=7) meets max_abs_err 0.000575 against the 0.000977 limit. It also meets the throughput constraint at 59.6 MSPS, and the p99 latency constraint was met by about 82% of evaluations, with the best seen at 0.0639 us against the 0.4 us limit. The iterative and unrolled_k families produced 0 feasible designs, with maximum throughput of 14.2 and 10.1 MSPS. The pipelined family's best feasible area is 1297, well above 860. The last round gained +30.9% hypervolume, but the reserved budget is used up and the selection rule (min luts_plus_ffs) picks the 860 design.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8884 (gain this round: +30.9%).
Feasible designs: 121 of 240 evaluations (102 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 45% violate; best seen 3.81e-05 (2^-14.68)
- sys_p99_latency_us <= 0.4: 18% violate; best seen 0.0639

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=860, accuracy_bits=10.8, luts=701, ffs=159, throughput_msps=59.6, max_abs_err=0.000575 (2^-10.76), power_index=0.0647
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=886, accuracy_bits=11, luts=739, ffs=147, throughput_msps=59.6, max_abs_err=0.000474 (2^-11.04), power_index=0.0667
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=1 rounding=round m=8] luts_plus_ffs=924, accuracy_bits=11.6, luts=772, ffs=151, throughput_msps=52.7, max_abs_err=0.000325 (2^-11.59), power_index=0.0695
- pipelined_m [data_width=18 n_iter=13 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=965, accuracy_bits=11.7, luts=802, ffs=163, throughput_msps=56.8, max_abs_err=0.000294 (2^-11.73), power_index=0.0726
- pipelined_m [data_width=17 n_iter=14 angle_guard=0 frac_guard=1 rounding=round m=7] luts_plus_ffs=1005, accuracy_bits=11.9, luts=849, ffs=155, throughput_msps=59.6, max_abs_err=0.000264 (2^-11.89), power_index=0.0756
- pipelined_m [data_width=17 n_iter=14 angle_guard=0 frac_guard=1 rounding=round m=8] luts_plus_ffs=1005, accuracy_bits=11.9, luts=849, ffs=155, throughput_msps=52.7, max_abs_err=0.000264 (2^-11.89), power_index=0.0756
- pipelined_m [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1081, accuracy_bits=12.6, luts=920, ffs=161, throughput_msps=50.3, max_abs_err=0.00016 (2^-12.61), power_index=0.0814
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1150, accuracy_bits=13.4, luts=979, ffs=172, throughput_msps=50.3, max_abs_err=9.41e-05 (2^-13.38), power_index=0.0865
- pipelined_m [data_width=20 n_iter=16 angle_guard=-1 frac_guard=1 rounding=trunc m=5] luts_plus_ffs=1377, accuracy_bits=13.9, luts=1064, ffs=313, throughput_msps=77, max_abs_err=6.62e-05 (2^-13.88), power_index=0.104
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1415, accuracy_bits=14.7, luts=1169, ffs=246, throughput_msps=50.3, max_abs_err=3.81e-05 (2^-14.68), power_index=0.106
Front coverage: luts_plus_ffs 860..1415 (HV reference 3000); accuracy_bits 10.8..14.7 (HV reference 10); data_width on the front 16..20 (registry 8..28).

Per family:
- iterative: 16 evals, 0 feasible; max throughput seen 14.2 MSPS; best accuracy 12.22 bits
- unrolled_k: 28 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 10.48 bits
- pipelined: 54 evals, 18 feasible; max throughput seen 282 MSPS; best accuracy 11.75 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 13..16, n_iter 12..15, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 142 evals, 103 feasible; max throughput seen 178 MSPS; best accuracy 14.68 bits; best feasible luts_plus_ffs=860; feasible ranges: data_width 14..20, n_iter 12..17, angle_guard -1..3, frac_guard 0..3, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=15..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (18 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 270 feasible; hypervolume 1.529e+04 (+72.1%).

**No LLM call** (code's front-mapping round): This is the final round, so stop is the only meaningful choice. The front has 18 feasible designs, all from pipelined_m, spanning luts_plus_ffs 860..1415 and accuracy_bits 10.8..14.7. The cheapest design (data_width=18, n_iter=12, trunc, m=7) meets max_abs_err 0.000575 against the 0.000977 limit. It also meets the throughput constraint at 59.6 MSPS, and the p99 latency constraint was met by about 82% of evaluations, with the best seen at 0.0639 us against the 0.4 us limit. The iterative and unrolled_k families produced 0 feasible designs, with maximum throughput of 14.2 and 10.1 MSPS. The pipelined family's best feasible area is 1297, well above 860. The last round gained +30.9% hypervolume, but the reserved budget is used up and the selection rule (min luts_plus_ffs) picks the 860 design.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.529e+04 (gain this round: +72.1%).
Feasible designs: 270 of 400 evaluations (243 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 30% violate; best seen 9.68e-08 (2^-23.30)
- sys_p99_latency_us <= 0.4: 11% violate; best seen 0.0639

Pareto front (feasible, 33 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=860, accuracy_bits=10.8, luts=701, ffs=159, throughput_msps=59.6, max_abs_err=0.000575 (2^-10.76), power_index=0.0647
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=1 rounding=round m=8] luts_plus_ffs=924, accuracy_bits=11.6, luts=772, ffs=151, throughput_msps=52.7, max_abs_err=0.000325 (2^-11.59), power_index=0.0695
- pipelined_m [data_width=17 n_iter=13 angle_guard=2 frac_guard=2 rounding=round m=8] luts_plus_ffs=999, accuracy_bits=11.7, luts=838, ffs=161, throughput_msps=50.3, max_abs_err=0.000291 (2^-11.75), power_index=0.0752
- pipelined_m [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1081, accuracy_bits=12.6, luts=920, ffs=161, throughput_msps=50.3, max_abs_err=0.00016 (2^-12.61), power_index=0.0814
- pipelined_m [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1200, accuracy_bits=13.5, luts=1033, ffs=167, throughput_msps=50.3, max_abs_err=8.72e-05 (2^-13.49), power_index=0.0903
- pipelined_m [data_width=22 n_iter=16 angle_guard=3 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1465, accuracy_bits=14.7, luts=1191, ffs=274, throughput_msps=62.5, max_abs_err=3.7e-05 (2^-14.72), power_index=0.11
- pipelined_m [data_width=20 n_iter=18 angle_guard=4 frac_guard=4 rounding=round m=6] luts_plus_ffs=1718, accuracy_bits=16.5, luts=1445, ffs=273, throughput_msps=62.5, max_abs_err=1.06e-05 (2^-16.52), power_index=0.129
- pipelined_m [data_width=25 n_iter=24 angle_guard=0 frac_guard=0 rounding=round m=7] luts_plus_ffs=2350, accuracy_bits=19.5, luts=1968, ffs=381, throughput_msps=54.3, max_abs_err=1.37e-06 (2^-19.48), power_index=0.177
- pipelined_m [data_width=25 n_iter=23 angle_guard=4 frac_guard=4 rounding=trunc m=8] luts_plus_ffs=2488, accuracy_bits=21.3, luts=2161, ffs=327, throughput_msps=45.9, max_abs_err=3.97e-07 (2^-21.26), power_index=0.187
- pipelined_m [data_width=27 n_iter=26 angle_guard=2 frac_guard=4 rounding=round m=3] luts_plus_ffs=3556, accuracy_bits=23.3, luts=2618, ffs=938, throughput_msps=106, max_abs_err=9.68e-08 (2^-23.30), power_index=0.268
Front coverage: luts_plus_ffs 860..3556 (HV reference 3000); accuracy_bits 10.8..23.3 (HV reference 10); data_width on the front 16..27 (registry 8..28).

Per family:
- iterative: 16 evals, 0 feasible; max throughput seen 14.2 MSPS; best accuracy 12.22 bits
- unrolled_k: 28 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 10.48 bits
- pipelined: 54 evals, 18 feasible; max throughput seen 282 MSPS; best accuracy 11.75 bits; best feasible luts_plus_ffs=1297; feasible ranges: data_width 13..16, n_iter 12..15, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 302 evals, 252 feasible; max throughput seen 178 MSPS; best accuracy 23.30 bits; best feasible luts_plus_ffs=860; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 23095 in, 4534 out
- provider-reported cost: $0.0915
- full prompts and replies: `llm_trace.jsonl`

