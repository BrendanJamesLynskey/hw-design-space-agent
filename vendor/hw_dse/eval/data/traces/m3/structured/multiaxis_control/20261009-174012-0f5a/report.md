# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 855 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 285 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.37 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000204 (2^-12.26) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.69 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.51e-05 (2^-14.15) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.81 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 94.9 dBc, SNR 82.2 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=2,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=17,n_iter=14,angle_guard=3,frac_guard=2,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=16,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 855 | 285 | 93.6 | 6 | 1.37 | 0.000204 (2^-12.26) | 12.26 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=2,rounding=round,m=4` | 890 | 287 | 93.6 | 6 | 1.42 | 0.000171 (2^-12.51) | 12.51 |
| 2 | `pipelined_m:data_width=17,n_iter=14,angle_guard=3,frac_guard=2,rounding=round,m=4` | 918 | 295 | 93.6 | 6 | 1.46 | 0.000152 (2^-12.68) | 12.68 |
| 3 | `pipelined_m:data_width=16,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=4` | 939 | 280 | 93.6 | 6 | 1.47 | 0.000128 (2^-12.93) | 12.93 |
| 4 | `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round,m=4` | 935 | 295 | 93.6 | 6 | 1.48 | 0.000119 (2^-13.04) | 13.04 |
| 5 | `pipelined_m:data_width=17,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=4` | 985 | 295 | 93.6 | 6 | 1.54 | 9.31e-05 (2^-13.39) | 13.39 |
| 6 | `pipelined_m:data_width=17,n_iter=15,angle_guard=3,frac_guard=3,rounding=round,m=4` | 1015 | 301 | 93.6 | 6 | 1.58 | 8.99e-05 (2^-13.44) | 13.44 |
| 7 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1037 | 291 | 93.6 | 6 | 1.6 | 8.59e-05 (2^-13.51) | 13.51 |
| 8 | `pipelined_m:data_width=17,n_iter=16,angle_guard=2,frac_guard=3,rounding=round,m=4` | 1069 | 297 | 93.6 | 6 | 1.64 | 8.09e-05 (2^-13.59) | 13.59 |
| 9 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc,m=4` | 1064 | 305 | 93.6 | 6 | 1.65 | 7.75e-05 (2^-13.65) | 13.65 |
| 10 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=3,rounding=round,m=4` | 1102 | 307 | 93.6 | 6 | 1.7 | 7.04e-05 (2^-13.79) | 13.79 |
| 11 | `pipelined_m:data_width=18,n_iter=17,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1101 | 365 | 93.6 | 7 | 1.77 | 6.92e-05 (2^-13.82) | 13.82 |
| 12 | `pipelined_m:data_width=18,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 1135 | 375 | 93.6 | 7 | 1.82 | 5.67e-05 (2^-14.11) | 14.11 |
| 13 | `pipelined_m:data_width=18,n_iter=17,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1173 | 377 | 93.6 | 7 | 1.87 | 3.68e-05 (2^-14.73) | 14.73 |
| 14 | `pipelined_m:data_width=23,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1334 | 375 | 89.6 | 6 | 2.06 | 3.09e-05 (2^-14.98) | 14.98 |
| 15 | `pipelined_m:data_width=23,n_iter=18,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1385 | 440 | 89.6 | 7 | 2.2 | 9.4e-06 (2^-16.70) | 16.70 |
| 16 | `pipelined_m:data_width=24,n_iter=18,angle_guard=4,frac_guard=0,rounding=round,m=4` | 1474 | 467 | 86.0 | 7 | 2.34 | 8.26e-06 (2^-16.88) | 16.88 |
| 17 | `pipelined_m:data_width=24,n_iter=20,angle_guard=4,frac_guard=0,rounding=round,m=4` | 1647 | 467 | 86.0 | 7 | 2.54 | 2.71e-06 (2^-18.49) | 18.49 |
| 18 | `pipelined_m:data_width=25,n_iter=20,angle_guard=1,frac_guard=3,rounding=trunc,m=4` | 1767 | 493 | 86.0 | 7 | 2.72 | 2.39e-06 (2^-18.67) | 18.67 |
| 19 | `pipelined_m:data_width=23,n_iter=22,angle_guard=3,frac_guard=1,rounding=round,m=4` | 1824 | 537 | 89.6 | 8 | 2.84 | 1.84e-06 (2^-19.05) | 19.05 |
| 20 | `pipelined_m:data_width=23,n_iter=22,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1846 | 541 | 89.6 | 8 | 2.87 | 1.68e-06 (2^-19.19) | 19.19 |
| 21 | `pipelined_m:data_width=23,n_iter=22,angle_guard=3,frac_guard=2,rounding=round,m=4` | 1868 | 547 | 89.6 | 8 | 2.91 | 1.55e-06 (2^-19.30) | 19.30 |
| 22 | `pipelined_m:data_width=26,n_iter=22,angle_guard=4,frac_guard=0,rounding=trunc,m=3` | 1953 | 771 | 110.0 | 10 | 3.28 | 1e-06 (2^-19.93) | 19.93 |
| 23 | `pipelined_m:data_width=28,n_iter=27,angle_guard=-2,frac_guard=3,rounding=round,m=3` | 2640 | 915 | 105.9 | 11 | 4.28 | 5.65e-07 (2^-20.76) | 20.76 |
| 24 | `pipelined_m:data_width=28,n_iter=27,angle_guard=2,frac_guard=1,rounding=round,m=3` | 2640 | 919 | 110.0 | 11 | 4.28 | 6.66e-08 (2^-23.84) | 23.84 |
| 25 | `pipelined_m:data_width=28,n_iter=27,angle_guard=2,frac_guard=3,rounding=trunc,m=3` | 2690 | 949 | 105.9 | 11 | 4.38 | 6.09e-08 (2^-23.97) | 23.97 |
| 26 | `pipelined_m:data_width=28,n_iter=27,angle_guard=2,frac_guard=3,rounding=round,m=3` | 2749 | 951 | 105.9 | 11 | 4.45 | 4.86e-08 (2^-24.29) | 24.29 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The batch deadline requires 32 results within 0.44 us, so a sustained rate of about 72 Msps or more is needed, and that points to one-result-per-cycle architectures. Accuracy of 2^-12 needs roughly 12-14 bit width and 11-14 iterations, so ranges are narrowed there to spend the budget on the area trade-off. Most of the budget goes to pipelined and pipelined_m, with a small probe of high-k unrolled to confirm whether it can compete.*)
- `pipelined` (45 evals): data_width=12..17, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Accepts one request per cycle, so throughput equals Fmax and the 32-request burst drains in about 32 cycles plus latency. This is the most plausible way to meet the throughput and p99 batch constraints. Ranges are narrowed around the minimum width and iterations needed for 2^-12 error.
- `pipelined_m` (44 evals): data_width=12..17, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering only every m stages saves flip-flops, which helps the LUTs+FFs objective. It still delivers one result per cycle, and there is likely Fmax headroom to meet the 0.44 us batch bound with small m.
- `unrolled_k` (11 evals): data_width=12..16, n_iter=10..15, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=5..8. *Why:* A small probe of the multi-cycle option. Large k brings it closest to the roughly 70+ results/us rate that the batch deadline needs, so this checks whether it can be feasible at lower area. Iterative is excluded because N+3 cycles per result cannot reach 32 Msps.

**Result (code):** 100 evaluations this round, 100 total; 28 feasible; hypervolume 5161 (n/a).

**LLM decision:** `refine` — The front is all pipelined_m (7 designs, luts_plus_ffs 1226..1520, accuracy 12.5..13.9 bits). Iterative and unrolled_k can't meet throughput_msps >= 32: unrolled_k peaked at 10.1 MSPS with 0 of 11 feasible, and iterative takes N+3 cycles per result, so it would be slower still. Only pipelined and pipelined_m can satisfy the 32-request batch within 0.44 us. Feasible designs cluster at data_width 16..17 and n_iter 14..16, and 72% of evaluations fail the error limit, so the accuracy edge is near data_width 15..16. I will refine around that region, probing slightly smaller widths and iteration counts for lower area and larger m for fewer FFs. Pipelined keeps a small share, since its best feasible area (1661) is worse than pipelined_m's 1226.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5161 (gain this round: n/a (first round)).
Feasible designs: 28 of 100 evaluations (19 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 11% violate; best seen 282
- max_abs_err <= 0.000244141: 72% violate; best seen 6.42e-05 (2^-13.93)
- sys_p99_batch_us <= 0.44: 11% violate; best seen 0.149

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1226, accuracy_bits=12.5, luts=956, ffs=270, throughput_msps=97.8, max_abs_err=0.000177 (2^-12.47), power_index=1.48
- pipelined_m [data_width=16 n_iter=16 angle_guard=3 frac_guard=1 rounding=round m=4] luts_plus_ffs=1246, accuracy_bits=12.5, luts=972, ffs=274, throughput_msps=93.6, max_abs_err=0.000169 (2^-12.53), power_index=1.5
- pipelined_m [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1284, accuracy_bits=13.1, luts=1003, ffs=280, throughput_msps=93.6, max_abs_err=0.000117 (2^-13.06), power_index=1.55
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1290, accuracy_bits=13.1, luts=1001, ffs=289, throughput_msps=93.6, max_abs_err=0.000116 (2^-13.08), power_index=1.55
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1327, accuracy_bits=13.5, luts=1037, ffs=291, throughput_msps=93.6, max_abs_err=8.59e-05 (2^-13.51), power_index=1.6
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=3 rounding=round m=4] luts_plus_ffs=1365, accuracy_bits=13.6, luts=1069, ffs=297, throughput_msps=93.6, max_abs_err=8.09e-05 (2^-13.59), power_index=1.64
- pipelined_m [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round m=3] luts_plus_ffs=1520, accuracy_bits=13.9, luts=1084, ffs=436, throughput_msps=119, max_abs_err=6.42e-05 (2^-13.93), power_index=1.83
Front coverage: luts_plus_ffs 1226..1520 (HV reference 4000); accuracy_bits 12.5..13.9 (HV reference 12); data_width on the front 16..17 (registry 8..28).

Per family:
- unrolled_k: 11 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 11.65 bits
- pipelined: 45 evals, 5 feasible; max throughput seen 282 MSPS; best accuracy 12.64 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard 1..2, frac_guard 0..3
- pipelined_m: 44 evals, 23 feasible; max throughput seen 178 MSPS; best accuracy 13.93 bits; best feasible luts_plus_ffs=1226; feasible ranges: data_width 16..17, n_iter 16..16, angle_guard 1..3, frac_guard 1..3, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the two throughput-capable pipelined families around the feasible accuracy boundary, with most of it on pipelined_m.*)
- `pipelined_m` (75 evals): data_width=14..18, n_iter=13..17, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..6. *Why:* All 7 front points come from this family. Probe smaller widths and n_iter for lower area, larger m for fewer FFs, and keep higher accuracy points for coverage.
- `pipelined` (25 evals): data_width=14..17, n_iter=13..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* It is the only other family that can meet throughput, and its fast clock leaves latency margin. It needs a small, focused check to see whether a lean config beats pipelined_m's area.

**Result (code):** 100 evaluations this round, 200 total; 78 feasible; hypervolume 7195 (+39.4%).

**LLM decision:** `refine` — The whole front (11 designs) is pipelined_m at m=4, with luts_plus_ffs 1219..1550 and 12.9..14.7 accuracy bits. unrolled_k is hopeless: 0 feasible, max 10.1 MSPS against the 32 MSPS requirement. Iterative needs N+3 cycles per result, so it can't reach 32 MSPS either and I won't spend budget on it. The cheapest feasible design sits at data_width 16, n_iter 15, and the feasible ranges only reach down to data_width 16 and n_iter 14. The error constraint (61% violating) is what bounds the low-area side, so the corner just below the current front is the unexplored area-reducing region: data_width 14..16, n_iter 12..16, small frac_guard. Larger m saves FFs, but m=4 at 93.6 MSPS already uses most of the 0.44 us batch budget (32 results plus latency), so I'll probe only m 3..5. Plain pipelined gets a small share, because its best feasible area is 1661, worse than pipelined_m.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7195 (gain this round: +39.4%).
Feasible designs: 78 of 200 evaluations (59 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 6% violate; best seen 282
- max_abs_err <= 0.000244141: 61% violate; best seen 3.68e-05 (2^-14.73)
- sys_p99_batch_us <= 0.44: 7% violate; best seen 0.149

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=16 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1219, accuracy_bits=12.9, luts=939, ffs=280, throughput_msps=93.6, max_abs_err=0.000128 (2^-12.93), power_index=1.47
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1229, accuracy_bits=13, luts=935, ffs=295, throughput_msps=93.6, max_abs_err=0.000119 (2^-13.04), power_index=1.48
- pipelined_m [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1284, accuracy_bits=13.1, luts=1003, ffs=280, throughput_msps=93.6, max_abs_err=0.000117 (2^-13.06), power_index=1.55
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1290, accuracy_bits=13.1, luts=1001, ffs=289, throughput_msps=93.6, max_abs_err=0.000116 (2^-13.08), power_index=1.55
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1327, accuracy_bits=13.5, luts=1037, ffs=291, throughput_msps=93.6, max_abs_err=8.59e-05 (2^-13.51), power_index=1.6
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1369, accuracy_bits=13.7, luts=1064, ffs=305, throughput_msps=93.6, max_abs_err=7.75e-05 (2^-13.65), power_index=1.65
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=round m=4] luts_plus_ffs=1409, accuracy_bits=13.8, luts=1102, ffs=307, throughput_msps=93.6, max_abs_err=7.04e-05 (2^-13.79), power_index=1.7
- pipelined_m [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1466, accuracy_bits=13.8, luts=1101, ffs=365, throughput_msps=93.6, max_abs_err=6.92e-05 (2^-13.82), power_index=1.77
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1510, accuracy_bits=14.1, luts=1135, ffs=375, throughput_msps=93.6, max_abs_err=5.67e-05 (2^-14.11), power_index=1.82
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1550, accuracy_bits=14.7, luts=1173, ffs=377, throughput_msps=93.6, max_abs_err=3.68e-05 (2^-14.73), power_index=1.87
Front coverage: luts_plus_ffs 1219..1550 (HV reference 4000); accuracy_bits 12.9..14.7 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 11 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 11.65 bits
- pipelined: 70 evals, 17 feasible; max throughput seen 282 MSPS; best accuracy 13.26 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard 1..3, frac_guard 0..3
- pipelined_m: 119 evals, 61 feasible; max throughput seen 178 MSPS; best accuracy 14.73 bits; best feasible luts_plus_ffs=1219; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard 0..3, frac_guard 0..3, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the pipelined_m low-area corner just below the current front to extend coverage toward lower luts_plus_ffs.*)
- `pipelined_m` (32 evals): data_width=14..17, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=round|trunc, m=3..5. *Why:* All front points come from this family; probe lower data_width and n_iter to cut LUTs+FFs while staying under 2^-12 error, with m near the 0.44 us batch limit.
- `pipelined` (8 evals): data_width=14..17, n_iter=12..16, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* Fully pipelined has the best latency and Fmax, so keep a small probe at the lower-width corner in case it becomes competitive there.

**Result (code):** 40 evaluations this round, 240 total; 100 feasible; hypervolume 7243 (+0.7%).

**LLM decision:** `stop` — This is the final round, so stop. The front has 14 feasible designs from pipelined_m, spanning luts_plus_ffs 1139..1550 and accuracy_bits 12.3..14.7. All designs meet the constraints: error is at most 2^-12.26, throughput is 93.6 MSPS against the 32 required, and sys_p99_batch_us is within 0.44. Hypervolume gain was only +0.7% last round, so the front is no longer improving. The cheapest design, pipelined_m W=17 N=14 trunc m=4 at 1139 LUTs+FFs, is the one the selection rule picks. unrolled_k had 0 feasible designs and peaked at 10.1 MSPS, so it cannot meet the 32 MSPS throughput constraint. The iterative family is slower still and would fail throughput and the batch deadline, so leaving it unexplored costs nothing.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7243 (gain this round: +0.7%).
Feasible designs: 100 of 240 evaluations (74 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 282
- max_abs_err <= 0.000244141: 57% violate; best seen 3.68e-05 (2^-14.73)
- sys_p99_batch_us <= 0.44: 7% violate; best seen 0.149

Pareto front (feasible, 14 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1139, accuracy_bits=12.3, luts=855, ffs=285, throughput_msps=93.6, max_abs_err=0.000204 (2^-12.26), power_index=1.37
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1177, accuracy_bits=12.5, luts=890, ffs=287, throughput_msps=93.6, max_abs_err=0.000171 (2^-12.51), power_index=1.42
- pipelined_m [data_width=16 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1219, accuracy_bits=12.9, luts=939, ffs=280, throughput_msps=93.6, max_abs_err=0.000128 (2^-12.93), power_index=1.47
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round m=4] luts_plus_ffs=1229, accuracy_bits=13, luts=935, ffs=295, throughput_msps=93.6, max_abs_err=0.000119 (2^-13.04), power_index=1.48
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1315, accuracy_bits=13.4, luts=1015, ffs=301, throughput_msps=93.6, max_abs_err=8.99e-05 (2^-13.44), power_index=1.58
- pipelined_m [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1327, accuracy_bits=13.5, luts=1037, ffs=291, throughput_msps=93.6, max_abs_err=8.59e-05 (2^-13.51), power_index=1.6
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1369, accuracy_bits=13.7, luts=1064, ffs=305, throughput_msps=93.6, max_abs_err=7.75e-05 (2^-13.65), power_index=1.65
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=round m=4] luts_plus_ffs=1409, accuracy_bits=13.8, luts=1102, ffs=307, throughput_msps=93.6, max_abs_err=7.04e-05 (2^-13.79), power_index=1.7
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1510, accuracy_bits=14.1, luts=1135, ffs=375, throughput_msps=93.6, max_abs_err=5.67e-05 (2^-14.11), power_index=1.82
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1550, accuracy_bits=14.7, luts=1173, ffs=377, throughput_msps=93.6, max_abs_err=3.68e-05 (2^-14.73), power_index=1.87
Front coverage: luts_plus_ffs 1139..1550 (HV reference 4000); accuracy_bits 12.3..14.7 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 11 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 11.65 bits
- pipelined: 78 evals, 19 feasible; max throughput seen 282 MSPS; best accuracy 13.26 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 151 evals, 81 feasible; max throughput seen 178 MSPS; best accuracy 14.73 bits; best feasible luts_plus_ffs=1139; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard 0..3, frac_guard 0..3, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (14 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 176 feasible; hypervolume 1.898e+04 (+162.1%).

**No LLM call** (code's front-mapping round): This is the final round, so stop. The front has 14 feasible designs from pipelined_m, spanning luts_plus_ffs 1139..1550 and accuracy_bits 12.3..14.7. All designs meet the constraints: error is at most 2^-12.26, throughput is 93.6 MSPS against the 32 required, and sys_p99_batch_us is within 0.44. Hypervolume gain was only +0.7% last round, so the front is no longer improving. The cheapest design, pipelined_m W=17 N=14 trunc m=4 at 1139 LUTs+FFs, is the one the selection rule picks. unrolled_k had 0 feasible designs and peaked at 10.1 MSPS, so it cannot meet the 32 MSPS throughput constraint. The iterative family is slower still and would fail throughput and the batch deadline, so leaving it unexplored costs nothing.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.898e+04 (gain this round: +162.1%).
Feasible designs: 176 of 400 evaluations (139 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 3% violate; best seen 282
- max_abs_err <= 0.000244141: 40% violate; best seen 4.86e-08 (2^-24.29)
- sys_p99_batch_us <= 0.44: 22% violate; best seen 0.149

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1139, accuracy_bits=12.3, luts=855, ffs=285, throughput_msps=93.6, max_abs_err=0.000204 (2^-12.26), power_index=1.37
- pipelined_m [data_width=16 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=4] luts_plus_ffs=1219, accuracy_bits=12.9, luts=939, ffs=280, throughput_msps=93.6, max_abs_err=0.000128 (2^-12.93), power_index=1.47
- pipelined_m [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=round m=4] luts_plus_ffs=1315, accuracy_bits=13.4, luts=1015, ffs=301, throughput_msps=93.6, max_abs_err=8.99e-05 (2^-13.44), power_index=1.58
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1369, accuracy_bits=13.7, luts=1064, ffs=305, throughput_msps=93.6, max_abs_err=7.75e-05 (2^-13.65), power_index=1.65
- pipelined_m [data_width=18 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1510, accuracy_bits=14.1, luts=1135, ffs=375, throughput_msps=93.6, max_abs_err=5.67e-05 (2^-14.11), power_index=1.82
- pipelined_m [data_width=23 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1709, accuracy_bits=15, luts=1334, ffs=375, throughput_msps=89.6, max_abs_err=3.09e-05 (2^-14.98), power_index=2.06
- pipelined_m [data_width=24 n_iter=20 angle_guard=4 frac_guard=0 rounding=round m=4] luts_plus_ffs=2114, accuracy_bits=18.5, luts=1647, ffs=467, throughput_msps=86, max_abs_err=2.71e-06 (2^-18.49), power_index=2.54
- pipelined_m [data_width=23 n_iter=22 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=2387, accuracy_bits=19.2, luts=1846, ffs=541, throughput_msps=89.6, max_abs_err=1.68e-06 (2^-19.19), power_index=2.87
- pipelined_m [data_width=28 n_iter=27 angle_guard=-2 frac_guard=3 rounding=round m=3] luts_plus_ffs=3555, accuracy_bits=20.8, luts=2640, ffs=915, throughput_msps=106, max_abs_err=5.65e-07 (2^-20.76), power_index=4.28
- pipelined_m [data_width=28 n_iter=27 angle_guard=2 frac_guard=3 rounding=round m=3] luts_plus_ffs=3701, accuracy_bits=24.3, luts=2749, ffs=951, throughput_msps=106, max_abs_err=4.86e-08 (2^-24.29), power_index=4.45
Front coverage: luts_plus_ffs 1139..3701 (HV reference 4000); accuracy_bits 12.3..24.3 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 11 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 11.65 bits
- pipelined: 78 evals, 19 feasible; max throughput seen 282 MSPS; best accuracy 13.26 bits; best feasible luts_plus_ffs=1661; feasible ranges: data_width 16..17, n_iter 14..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 311 evals, 157 feasible; max throughput seen 178 MSPS; best accuracy 24.29 bits; best feasible luts_plus_ffs=1139; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 23054 in, 5021 out
- provider-reported cost: $0.0963
- full prompts and replies: `llm_trace.jsonl`

