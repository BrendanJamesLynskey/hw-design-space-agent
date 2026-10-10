# DSE run: bursty_offload

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 764 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 151 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 4 | exact: schedule |
| latency_ns | 75.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.0689 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000378 (2^-11.37) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 6.19 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.000108 (2^-13.18) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.77 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 11.4 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 4 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 83.8 dBc, SNR 76.3 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: bursty requests: bursts of 8 (0 ns apart) arriving as a Poisson process, 2 requests/us on average. Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_latency_us <= 0.4 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 0.1896 → 0.2667 | yes |
| `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=5` | 0.1365 → 0.172 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc,m=5` | 0.1429 → 0.183 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 0.199 → 0.2825 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 0.199 → 0.2825 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=13,angle_guard=2,frac_guard=2,rounding=trunc,m=8` | 764 | 151 | 52.7 | 4 | 0.0689 | 0.000378 (2^-11.37) | 11.37 |
| 1 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round,m=5` | 834 | 211 | 80.6 | 5 | 0.0786 | 0.000209 (2^-12.22) | 12.22 |
| 2 | `pipelined_m:data_width=19,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc,m=5` | 920 | 229 | 77.0 | 5 | 0.0864 | 0.000152 (2^-12.68) | 12.68 |
| 3 | `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 994 | 169 | 50.3 | 4 | 0.0875 | 9.41e-05 (2^-13.38) | 13.38 |
| 4 | `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc,m=8` | 994 | 174 | 50.3 | 4 | 0.0878 | 9.41e-05 (2^-13.38) | 13.38 |
| 5 | `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc,m=8` | 1053 | 178 | 50.3 | 4 | 0.0926 | 7.62e-05 (2^-13.68) | 13.68 |
| 6 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=1,rounding=round,m=8` | 1073 | 172 | 50.3 | 4 | 0.0936 | 7.36e-05 (2^-13.73) | 13.73 |
| 7 | `pipelined_m:data_width=20,n_iter=15,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 1082 | 186 | 48.0 | 4 | 0.0954 | 6.78e-05 (2^-13.85) | 13.85 |
| 8 | `pipelined_m:data_width=19,n_iter=17,angle_guard=3,frac_guard=1,rounding=trunc,m=8` | 1152 | 245 | 50.3 | 5 | 0.105 | 4.85e-05 (2^-14.33) | 14.33 |
| 9 | `pipelined_m:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round,m=8` | 1175 | 244 | 50.3 | 5 | 0.107 | 3.42e-05 (2^-14.83) | 14.83 |
| 10 | `pipelined_m:data_width=20,n_iter=17,angle_guard=3,frac_guard=0,rounding=round,m=8` | 1169 | 252 | 48.0 | 5 | 0.107 | 2.95e-05 (2^-15.05) | 15.05 |
| 11 | `pipelined_m:data_width=22,n_iter=18,angle_guard=-1,frac_guard=0,rounding=round,m=7` | 1277 | 262 | 56.8 | 5 | 0.116 | 1.85e-05 (2^-15.72) | 15.72 |
| 12 | `pipelined_m:data_width=22,n_iter=18,angle_guard=1,frac_guard=0,rounding=trunc,m=6` | 1313 | 268 | 62.5 | 5 | 0.119 | 1.6e-05 (2^-15.93) | 15.93 |
| 13 | `pipelined_m:data_width=20,n_iter=19,angle_guard=3,frac_guard=1,rounding=round,m=8` | 1394 | 258 | 48.0 | 5 | 0.124 | 1.31e-05 (2^-16.22) | 16.22 |
| 14 | `pipelined_m:data_width=20,n_iter=19,angle_guard=3,frac_guard=3,rounding=round,m=8` | 1470 | 266 | 48.0 | 5 | 0.131 | 8.96e-06 (2^-16.77) | 16.77 |
| 15 | `pipelined_m:data_width=24,n_iter=18,angle_guard=1,frac_guard=4,rounding=round,m=8` | 1614 | 309 | 45.9 | 5 | 0.145 | 8e-06 (2^-16.93) | 16.93 |
| 16 | `pipelined_m:data_width=24,n_iter=19,angle_guard=-1,frac_guard=2,rounding=trunc,m=4` | 1542 | 458 | 89.6 | 7 | 0.15 | 6.17e-06 (2^-17.31) | 17.31 |
| 17 | `pipelined_m:data_width=24,n_iter=19,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 1561 | 463 | 89.6 | 7 | 0.152 | 5.47e-06 (2^-17.48) | 17.48 |
| 18 | `pipelined_m:data_width=26,n_iter=20,angle_guard=-2,frac_guard=0,rounding=trunc,m=5` | 1647 | 387 | 73.7 | 6 | 0.153 | 3.27e-06 (2^-18.22) | 18.22 |
| 19 | `pipelined_m:data_width=21,n_iter=22,angle_guard=3,frac_guard=4,rounding=round,m=8` | 1820 | 281 | 48.0 | 5 | 0.158 | 2.8e-06 (2^-18.45) | 18.45 |
| 20 | `pipelined_m:data_width=27,n_iter=20,angle_guard=0,frac_guard=0,rounding=round,m=5` | 1747 | 410 | 70.6 | 6 | 0.162 | 2.1e-06 (2^-18.86) | 18.86 |
| 21 | `pipelined_m:data_width=24,n_iter=22,angle_guard=3,frac_guard=2,rounding=trunc,m=8` | 1886 | 305 | 45.9 | 5 | 0.165 | 1.14e-06 (2^-19.75) | 19.75 |
| 22 | `pipelined_m:data_width=22,n_iter=24,angle_guard=4,frac_guard=4,rounding=round,m=8` | 2087 | 296 | 48.0 | 5 | 0.179 | 9.85e-07 (2^-19.95) | 19.95 |
| 23 | `pipelined_m:data_width=28,n_iter=22,angle_guard=3,frac_guard=0,rounding=trunc,m=4` | 2063 | 626 | 82.7 | 8 | 0.202 | 5.91e-07 (2^-20.69) | 20.69 |
| 24 | `pipelined_m:data_width=25,n_iter=24,angle_guard=3,frac_guard=4,rounding=round,m=7` | 2288 | 420 | 52.0 | 6 | 0.204 | 2.44e-07 (2^-21.97) | 21.97 |
| 25 | `pipelined_m:data_width=27,n_iter=26,angle_guard=3,frac_guard=3,rounding=trunc,m=8` | 2534 | 440 | 45.9 | 6 | 0.224 | 9.63e-08 (2^-23.31) | 23.31 |
| 26 | `pipelined_m:data_width=27,n_iter=26,angle_guard=4,frac_guard=2,rounding=round,m=4` | 2565 | 730 | 82.7 | 9 | 0.248 | 7.62e-08 (2^-23.65) | 23.65 |
| 27 | `pipelined_m:data_width=27,n_iter=26,angle_guard=4,frac_guard=3,rounding=round,m=4` | 2618 | 743 | 82.7 | 9 | 0.253 | 6.37e-08 (2^-23.91) | 23.91 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are accuracy (max_abs_err <= 2^-10, which needs roughly N>=11-13 and W>=12) and the system p99 latency of 0.4 us for bursts of 8 requests arriving 0 ns apart. Draining 8 requests in under 400 ns needs either 1 result/cycle (pipelined, pipelined_m) or a large unroll factor (unrolled_k with k near 8), so those three families get most of the budget; iterative is probed only to check the low-area corner. data_width 10..24 and n_iter 8..20 bracket the accuracy-feasible region without wasting evaluations on clearly infeasible low widths, and the guard/rounding parameters are left at full range because they trade accuracy against area at fixed W and N. Round 1 is deliberately broad so later rounds can narrow onto the families and parameter bands that actually populate the front.*)
- `pipelined_m` (35 evals): data_width=10..24, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* 1 result/cycle gives the throughput needed to drain an 8-request burst inside the 0.4 us p99 budget, and large m cuts the per-stage register count, which is the main lever on the luts_plus_ffs objective.
- `unrolled_k` (35 evals): data_width=10..24, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* Shared datapath with k chained micro-rotations/cycle should be the cheapest way to reach the ~20 Msps burst-drain rate; large k is the candidate low-area corner of the front, so it needs a wide k sweep.
- `pipelined` (20 evals): data_width=10..24, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Fully registered pipeline is the highest-Fmax, lowest-latency option and anchors the fast end of the front; it is the m=1 reference against which pipelined_m area savings are measured.
- `iterative` (10 evals): data_width=10..24, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Smallest-area family, so it would dominate the luts_plus_ffs objective if it could meet the burst latency; a small probe is enough to confirm whether N+3 cycles/result can ever drain a burst of 8 within 0.4 us.

**Result (code):** 100 evaluations this round, 100 total; 41 feasible; hypervolume 1.063e+04 (n/a).

**LLM decision:** `refine` — Round 1 front spans luts_plus_ffs 1275..3067 and accuracy 13.5..17.4, but data_width only 20..23 of the registry's 8..28 and the cheapest point (1275) sits well above the HV reference of 3000's useful range; the selection rule (min luts_plus_ffs) and HV both reward extending the cheap end, which the loose max_abs_err<=2^-10 (best 2^-17.4) leaves room for. pipelined_m is 29/35 feasible down to W=16, m 2..6, so concentrating budget at lower data_width/n_iter should find cheaper feasible points; pipelined (12/20 feasible) keeps the accuracy ceiling. iterative and unrolled_k are 0/45 feasible and skipped.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.063e+04 (gain this round: n/a (first round)).
Feasible designs: 41 of 100 evaluations (40 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 32% violate; best seen 5.75e-06 (2^-17.41)
- sys_p99_latency_us <= 0.4: 45% violate; best seen 0.0586

Pareto front (feasible, 10 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=20 n_iter=15 angle_guard=3 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1275, accuracy_bits=13.5, luts=1023, ffs=252, throughput_msps=62.5, max_abs_err=8.43e-05 (2^-13.53), power_index=0.096
- pipelined_m [data_width=22 n_iter=17 angle_guard=-2 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1445, accuracy_bits=14.7, luts=1185, ffs=259, throughput_msps=65.4, max_abs_err=3.67e-05 (2^-14.73), power_index=0.109
- pipelined_m [data_width=22 n_iter=17 angle_guard=-2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=1520, accuracy_bits=14.9, luts=1253, ffs=267, throughput_msps=62.5, max_abs_err=3.38e-05 (2^-14.85), power_index=0.114
- pipelined_m [data_width=22 n_iter=17 angle_guard=3 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1544, accuracy_bits=15.4, luts=1270, ffs=274, throughput_msps=62.5, max_abs_err=2.27e-05 (2^-15.43), power_index=0.116
- pipelined_m [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1581, accuracy_bits=15.9, luts=1313, ffs=268, throughput_msps=62.5, max_abs_err=1.6e-05 (2^-15.93), power_index=0.119
- pipelined_m [data_width=20 n_iter=18 angle_guard=3 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=1889, accuracy_bits=16.2, luts=1385, ffs=504, throughput_msps=114, max_abs_err=1.31e-05 (2^-16.22), power_index=0.142
- pipelined_m [data_width=23 n_iter=18 angle_guard=3 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=2111, accuracy_bits=16.9, luts=1546, ffs=565, throughput_msps=110, max_abs_err=8.31e-06 (2^-16.88), power_index=0.159
- pipelined_m [data_width=23 n_iter=18 angle_guard=3 frac_guard=3 rounding=round m=3] luts_plus_ffs=2115, accuracy_bits=16.9, luts=1558, ffs=557, throughput_msps=114, max_abs_err=8.13e-06 (2^-16.91), power_index=0.159
- pipelined_m [data_width=23 n_iter=18 angle_guard=4 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=2135, accuracy_bits=16.9, luts=1564, ffs=571, throughput_msps=110, max_abs_err=8.08e-06 (2^-16.92), power_index=0.161
- pipelined [data_width=23 n_iter=19 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=3067, accuracy_bits=17.4, luts=1523, ffs=1545, throughput_msps=257, max_abs_err=5.75e-06 (2^-17.41), power_index=0.231
Front coverage: luts_plus_ffs 1275..3067 (HV reference 3000); accuracy_bits 13.5..17.4 (HV reference 10); data_width on the front 20..23 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 35 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 16.20 bits
- pipelined: 20 evals, 12 feasible; max throughput seen 282 MSPS; best accuracy 17.41 bits; best feasible luts_plus_ffs=1513; feasible ranges: data_width 18..24, n_iter 13..19, angle_guard -2..2, frac_guard 0..2
- pipelined_m: 35 evals, 29 feasible; max throughput seen 178 MSPS; best accuracy 16.92 bits; best feasible luts_plus_ffs=1275; feasible ranges: data_width 16..24, n_iter 12..18, angle_guard -2..4, frac_guard 0..4, m 2..6
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Front is dominated by cheap pipelined_m points (1275..2135 LUT+FF) plus one pipelined at the accurate, large end. Coverage is thin where it matters most: HV ref for luts_plus_ffs is 3000 and selection is min luts_plus_ffs, yet no design below 1275 was found, and data_width on the front is only 20..23 although pipelined_m was feasible down to W=16. Accuracy required is only 2^-10 while the cheapest front point already achieves 2^-13.5, so there is slack to trade accuracy for area at low W. iterative/unrolled_k gave 0/45 feasible (best throughput 10.5-18.5 MSPS, p99 bound missed) so they get no budget. Refining low-W/low-N pipelined_m should both lower the selection objective and widen HV at the cheap corner, while a small pipelined slice preserves headroom at the accurate corner before the reserved full-range front map in a later round.*)
- `pipelined_m` (70 evals): data_width=13..22, n_iter=12..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Only 29/35 feasible and cheapest front point is W=20/N=15. Feasible range already reaches W=16; push W down to 13-19 and N down to 12 to find sub-1275 luts_plus_ffs designs that still clear 2^-10 (accuracy needed is only ~10 bits vs 13.5 seen at W=20/N=15). p99/throughput are non-binding here (front shows 0.0586 us best vs 0.4 limit).
- `pipelined` (30 evals): data_width=18..26, n_iter=14..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Pipelined holds the accuracy ceiling (17.4 bits at 3067 LUT+FF) and is 12/20 feasible. Keep it to extend the top of the accuracy axis toward 2^-18..2^-20 (registry allows W up to 28) so the front is not capped at 17.4, while the bulk of the budget pushes the cheap end.

**Result (code):** 100 evaluations this round, 200 total; 136 feasible; hypervolume 1.236e+04 (+16.3%).

**LLM decision:** `refine` — Only pipelined and pipelined_m are viable: iterative (10 evals) and unrolled_k (35 evals) have 0 feasible designs — their throughput is fine (18.5 / 10.5 MSPS ≥ 2) but multi-cycle-per-result scheduling blows the sys_p99_latency ≤ 0.4 us bound, so they cannot be on the front. The front's 10 lowest-area designs jump straight from pipelined_m at 1736 (16.8 bits) to pipelined at 3281 (17.8 bits) — a real hole between ~1800 and ~3200 luts_plus_ffs. Worse, the pipelined high-accuracy points (3281, 3442) sit beyond the HV reference of 3000, so they add zero hypervolume; the entire HV-relevant region is area < 3000, where the best accuracy on the front is only 16.8 bits at 1736. So the two things that buy HV are (a) filling the 1736→3000 gap with higher-accuracy pipelined_m designs and (b) pushing the left edge below 921. This is a refine, not a map_front: the front already spans the reference point on both objectives (area 921..3442 vs ref 3000, accuracy 10.9..18.7 vs ref 10), so full-range mapping is not indicated yet.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.236e+04 (gain this round: +16.3%).
Feasible designs: 136 of 200 evaluations (126 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 18% violate; best seen 2.39e-06 (2^-18.67)
- sys_p99_latency_us <= 0.4: 22% violate; best seen 0.0586

Pareto front (feasible, 20 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=12 angle_guard=3 frac_guard=1 rounding=round m=6] luts_plus_ffs=921, accuracy_bits=10.9, luts=760, ffs=161, throughput_msps=65.4, max_abs_err=0.000522 (2^-10.90), power_index=0.0693
- pipelined_m [data_width=20 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=5] luts_plus_ffs=1013, accuracy_bits=11, luts=770, ffs=243, throughput_msps=77, max_abs_err=0.0005 (2^-10.97), power_index=0.0762
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1163, accuracy_bits=13.4, luts=994, ffs=169, throughput_msps=50.3, max_abs_err=9.41e-05 (2^-13.38), power_index=0.0875
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc m=8] luts_plus_ffs=1230, accuracy_bits=13.7, luts=1053, ffs=178, throughput_msps=50.3, max_abs_err=7.62e-05 (2^-13.68), power_index=0.0926
- pipelined_m [data_width=20 n_iter=15 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1268, accuracy_bits=13.8, luts=1082, ffs=186, throughput_msps=48, max_abs_err=6.78e-05 (2^-13.85), power_index=0.0954
- pipelined_m [data_width=19 n_iter=17 angle_guard=3 frac_guard=1 rounding=round m=8] luts_plus_ffs=1439, accuracy_bits=14.9, luts=1192, ffs=247, throughput_msps=50.3, max_abs_err=3.23e-05 (2^-14.92), power_index=0.108
- pipelined_m [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1581, accuracy_bits=15.9, luts=1313, ffs=268, throughput_msps=62.5, max_abs_err=1.6e-05 (2^-15.93), power_index=0.119
- pipelined_m [data_width=20 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=8] luts_plus_ffs=1736, accuracy_bits=16.8, luts=1470, ffs=266, throughput_msps=48, max_abs_err=8.96e-06 (2^-16.77), power_index=0.131
- pipelined [data_width=24 n_iter=21 angle_guard=-1 frac_guard=0 rounding=trunc] luts_plus_ffs=3281, accuracy_bits=17.8, luts=1628, ffs=1653, throughput_msps=257, max_abs_err=4.38e-06 (2^-17.80), power_index=0.247
- pipelined [data_width=23 n_iter=21 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=3442, accuracy_bits=18.7, luts=1712, ffs=1729, throughput_msps=257, max_abs_err=2.39e-06 (2^-18.67), power_index=0.259
Front coverage: luts_plus_ffs 921..3442 (HV reference 3000); accuracy_bits 10.9..18.7 (HV reference 10); data_width on the front 17..24 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 35 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 16.20 bits
- pipelined: 50 evals, 42 feasible; max throughput seen 282 MSPS; best accuracy 18.67 bits; best feasible luts_plus_ffs=1513; feasible ranges: data_width 18..26, n_iter 13..22, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 105 evals, 94 feasible; max throughput seen 178 MSPS; best accuracy 17.67 bits; best feasible luts_plus_ffs=921; feasible ranges: data_width 15..24, n_iter 12..19, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Fill the mid-area gap and extend the cheap edge, both with pipelined_m (the only family that reaches low area), plus a low-area pipelined probe.*)
- `pipelined_m` (29 evals): data_width=19..25, n_iter=16..26, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* fill the 1736..3000 HV gap with higher accuracy
- `pipelined` (11 evals): data_width=18..22, n_iter=13..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* probe whether a lower-area pipelined point can bridge the gap from the high-accuracy side
- clamped by code: dropped duplicate family pipelined_m

**Result (code):** 40 evaluations this round, 240 total; 176 feasible; hypervolume 1.462e+04 (+18.3%).

**LLM decision:** `stop` — Feasible designs exist and the front is already well populated: 176/240 evaluations feasible, 21 designs on the Pareto front, hypervolume 1.462e+04 with +18.3% gain this round. All hard constraints are met by feasible designs: throughput best 282 MSPS vs >=2, max_abs_err best 2.44e-07 vs <=0.000976562, sys_p99_latency_us best 0.0586 us vs <=0.4 us. The front spans luts_plus_ffs 921..2707 and accuracy_bits 10.9..22, so it covers both objectives rather than only one corner. The selection rule min luts_plus_ffs is satisfied by pipelined_m [data_width=17 n_iter=12 angle_guard=3 frac_guard=1 rounding=round m=6] at luts_plus_ffs=921, accuracy_bits=10.9, max_abs_err=0.000522, throughput_msps=65.4. Since this is the final round and no constraint is unreachable, the correct decision is stop rather than infeasible.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.462e+04 (gain this round: +18.3%).
Feasible designs: 176 of 240 evaluations (158 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 15% violate; best seen 2.44e-07 (2^-21.97)
- sys_p99_latency_us <= 0.4: 19% violate; best seen 0.0586

Pareto front (feasible, 21 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=12 angle_guard=3 frac_guard=1 rounding=round m=6] luts_plus_ffs=921, accuracy_bits=10.9, luts=760, ffs=161, throughput_msps=65.4, max_abs_err=0.000522 (2^-10.90), power_index=0.0693
- pipelined_m [data_width=20 n_iter=12 angle_guard=0 frac_guard=0 rounding=trunc m=5] luts_plus_ffs=1013, accuracy_bits=11, luts=770, ffs=243, throughput_msps=77, max_abs_err=0.0005 (2^-10.97), power_index=0.0762
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1163, accuracy_bits=13.4, luts=994, ffs=169, throughput_msps=50.3, max_abs_err=9.41e-05 (2^-13.38), power_index=0.0875
- pipelined_m [data_width=19 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=8] luts_plus_ffs=1244, accuracy_bits=13.7, luts=1073, ffs=172, throughput_msps=50.3, max_abs_err=7.36e-05 (2^-13.73), power_index=0.0936
- pipelined_m [data_width=19 n_iter=17 angle_guard=3 frac_guard=1 rounding=trunc m=8] luts_plus_ffs=1397, accuracy_bits=14.3, luts=1152, ffs=245, throughput_msps=50.3, max_abs_err=4.85e-05 (2^-14.33), power_index=0.105
- pipelined_m [data_width=20 n_iter=17 angle_guard=3 frac_guard=0 rounding=round m=8] luts_plus_ffs=1421, accuracy_bits=15, luts=1169, ffs=252, throughput_msps=48, max_abs_err=2.95e-05 (2^-15.05), power_index=0.107
- pipelined_m [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1581, accuracy_bits=15.9, luts=1313, ffs=268, throughput_msps=62.5, max_abs_err=1.6e-05 (2^-15.93), power_index=0.119
- pipelined_m [data_width=24 n_iter=18 angle_guard=1 frac_guard=4 rounding=round m=8] luts_plus_ffs=1923, accuracy_bits=16.9, luts=1614, ffs=309, throughput_msps=45.9, max_abs_err=8e-06 (2^-16.93), power_index=0.145
- pipelined_m [data_width=21 n_iter=22 angle_guard=3 frac_guard=4 rounding=round m=8] luts_plus_ffs=2101, accuracy_bits=18.4, luts=1820, ffs=281, throughput_msps=48, max_abs_err=2.8e-06 (2^-18.45), power_index=0.158
- pipelined_m [data_width=25 n_iter=24 angle_guard=3 frac_guard=4 rounding=round m=7] luts_plus_ffs=2707, accuracy_bits=22, luts=2288, ffs=420, throughput_msps=52, max_abs_err=2.44e-07 (2^-21.97), power_index=0.204
Front coverage: luts_plus_ffs 921..2707 (HV reference 3000); accuracy_bits 10.9..22 (HV reference 10); data_width on the front 17..25 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 35 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 16.20 bits
- pipelined: 61 evals, 53 feasible; max throughput seen 282 MSPS; best accuracy 18.67 bits; best feasible luts_plus_ffs=1513; feasible ranges: data_width 18..26, n_iter 13..22, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 134 evals, 123 feasible; max throughput seen 178 MSPS; best accuracy 21.97 bits; best feasible luts_plus_ffs=921; feasible ranges: data_width 15..25, n_iter 12..26, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=16..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (21 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 326 feasible; hypervolume 1.522e+04 (+4.1%).

**No LLM call** (code's front-mapping round): Feasible designs exist and the front is already well populated: 176/240 evaluations feasible, 21 designs on the Pareto front, hypervolume 1.462e+04 with +18.3% gain this round. All hard constraints are met by feasible designs: throughput best 282 MSPS vs >=2, max_abs_err best 2.44e-07 vs <=0.000976562, sys_p99_latency_us best 0.0586 us vs <=0.4 us. The front spans luts_plus_ffs 921..2707 and accuracy_bits 10.9..22, so it covers both objectives rather than only one corner. The selection rule min luts_plus_ffs is satisfied by pipelined_m [data_width=17 n_iter=12 angle_guard=3 frac_guard=1 rounding=round m=6] at luts_plus_ffs=921, accuracy_bits=10.9, max_abs_err=0.000522, throughput_msps=65.4. Since this is the final round and no constraint is unreachable, the correct decision is stop rather than infeasible.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.522e+04 (gain this round: +4.1%).
Feasible designs: 326 of 400 evaluations (301 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 2: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 12% violate; best seen 6.37e-08 (2^-23.91)
- sys_p99_latency_us <= 0.4: 11% violate; best seen 0.0586

Pareto front (feasible, 28 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=915, accuracy_bits=11.4, luts=764, ffs=151, throughput_msps=52.7, max_abs_err=0.000378 (2^-11.37), power_index=0.0689
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=1163, accuracy_bits=13.4, luts=994, ffs=169, throughput_msps=50.3, max_abs_err=9.41e-05 (2^-13.38), power_index=0.0875
- pipelined_m [data_width=19 n_iter=16 angle_guard=0 frac_guard=1 rounding=round m=8] luts_plus_ffs=1244, accuracy_bits=13.7, luts=1073, ffs=172, throughput_msps=50.3, max_abs_err=7.36e-05 (2^-13.73), power_index=0.0936
- pipelined_m [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round m=8] luts_plus_ffs=1419, accuracy_bits=14.8, luts=1175, ffs=244, throughput_msps=50.3, max_abs_err=3.42e-05 (2^-14.83), power_index=0.107
- pipelined_m [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=1581, accuracy_bits=15.9, luts=1313, ffs=268, throughput_msps=62.5, max_abs_err=1.6e-05 (2^-15.93), power_index=0.119
- pipelined_m [data_width=24 n_iter=18 angle_guard=1 frac_guard=4 rounding=round m=8] luts_plus_ffs=1923, accuracy_bits=16.9, luts=1614, ffs=309, throughput_msps=45.9, max_abs_err=8e-06 (2^-16.93), power_index=0.145
- pipelined_m [data_width=26 n_iter=20 angle_guard=-2 frac_guard=0 rounding=trunc m=5] luts_plus_ffs=2034, accuracy_bits=18.2, luts=1647, ffs=387, throughput_msps=73.7, max_abs_err=3.27e-06 (2^-18.22), power_index=0.153
- pipelined_m [data_width=24 n_iter=22 angle_guard=3 frac_guard=2 rounding=trunc m=8] luts_plus_ffs=2191, accuracy_bits=19.7, luts=1886, ffs=305, throughput_msps=45.9, max_abs_err=1.14e-06 (2^-19.75), power_index=0.165
- pipelined_m [data_width=25 n_iter=24 angle_guard=3 frac_guard=4 rounding=round m=7] luts_plus_ffs=2707, accuracy_bits=22, luts=2288, ffs=420, throughput_msps=52, max_abs_err=2.44e-07 (2^-21.97), power_index=0.204
- pipelined_m [data_width=27 n_iter=26 angle_guard=4 frac_guard=3 rounding=round m=4] luts_plus_ffs=3360, accuracy_bits=23.9, luts=2618, ffs=743, throughput_msps=82.7, max_abs_err=6.37e-08 (2^-23.91), power_index=0.253
Front coverage: luts_plus_ffs 915..3360 (HV reference 3000); accuracy_bits 11.4..23.9 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 18.5 MSPS; best accuracy 13.01 bits
- unrolled_k: 35 evals, 0 feasible; max throughput seen 10.5 MSPS; best accuracy 16.20 bits
- pipelined: 61 evals, 53 feasible; max throughput seen 282 MSPS; best accuracy 18.67 bits; best feasible luts_plus_ffs=1513; feasible ranges: data_width 18..26, n_iter 13..22, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 294 evals, 273 feasible; max throughput seen 178 MSPS; best accuracy 23.91 bits; best feasible luts_plus_ffs=915; feasible ranges: data_width 15..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 1)
- tokens: 13105 in, 14130 out
- provider-reported cost: $0.0099
- full prompts and replies: `llm_trace.jsonl`

