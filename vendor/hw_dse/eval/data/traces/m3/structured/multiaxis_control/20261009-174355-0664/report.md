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
`pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 855 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 291 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.38 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.00017 (2^-12.53) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.1 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.25e-05 (2^-14.22) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.44 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 96.1 dBc, SNR 82.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=20,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=20,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 0.3848 → 0.3953 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 855 | 291 | 93.6 | 6 | 1.38 | 0.00017 (2^-12.53) | 12.53 |
| 1 | `pipelined_m:data_width=19,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 868 | 297 | 93.6 | 6 | 1.4 | 0.000164 (2^-12.57) | 12.57 |
| 2 | `pipelined_m:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=round,m=4` | 896 | 305 | 93.6 | 6 | 1.44 | 0.000142 (2^-12.78) | 12.78 |
| 3 | `pipelined_m:data_width=20,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,m=4` | 909 | 311 | 93.6 | 6 | 1.47 | 0.000138 (2^-12.82) | 12.82 |
| 4 | `pipelined_m:data_width=20,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=4` | 923 | 315 | 93.6 | 6 | 1.49 | 0.000137 (2^-12.83) | 12.83 |
| 5 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 905 | 349 | 119.3 | 7 | 1.51 | 0.000119 (2^-13.04) | 13.04 |
| 6 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=0,rounding=round,m=4` | 969 | 287 | 93.6 | 6 | 1.51 | 0.000108 (2^-13.18) | 13.18 |
| 7 | `pipelined_m:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=round,m=4` | 964 | 305 | 93.6 | 6 | 1.53 | 8.33e-05 (2^-13.55) | 13.55 |
| 8 | `pipelined_m:data_width=19,n_iter=16,angle_guard=0,frac_guard=0,rounding=round,m=4` | 1001 | 297 | 93.6 | 6 | 1.56 | 7.72e-05 (2^-13.66) | 13.66 |
| 9 | `pipelined_m:data_width=19,n_iter=16,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1033 | 305 | 93.6 | 6 | 1.61 | 5.75e-05 (2^-14.09) | 14.09 |
| 10 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1080 | 319 | 93.6 | 6 | 1.68 | 4.12e-05 (2^-14.57) | 14.57 |
| 11 | `pipelined_m:data_width=20,n_iter=16,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1185 | 333 | 93.6 | 6 | 1.83 | 3.61e-05 (2^-14.76) | 14.76 |
| 12 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1259 | 397 | 93.6 | 7 | 1.99 | 2.4e-05 (2^-15.35) | 15.35 |
| 13 | `pipelined_m:data_width=20,n_iter=19,angle_guard=4,frac_guard=0,rounding=round,m=4` | 1333 | 399 | 89.6 | 7 | 2.08 | 2.17e-05 (2^-15.49) | 15.49 |
| 14 | `pipelined_m:data_width=23,n_iter=17,angle_guard=0,frac_guard=2,rounding=trunc,m=3` | 1337 | 527 | 114.5 | 8 | 2.24 | 1.73e-05 (2^-15.82) | 15.82 |
| 15 | `pipelined_m:data_width=21,n_iter=20,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1467 | 414 | 89.6 | 7 | 2.26 | 1.31e-05 (2^-16.21) | 16.21 |
| 16 | `pipelined_m:data_width=21,n_iter=20,angle_guard=3,frac_guard=0,rounding=round,m=3` | 1447 | 558 | 114.5 | 9 | 2.41 | 1.15e-05 (2^-16.41) | 16.41 |
| 17 | `pipelined_m:data_width=22,n_iter=19,angle_guard=2,frac_guard=4,rounding=round,m=4` | 1607 | 457 | 89.6 | 7 | 2.48 | 5.47e-06 (2^-17.48) | 17.48 |
| 18 | `pipelined_m:data_width=27,n_iter=19,angle_guard=-2,frac_guard=0,rounding=round,m=4` | 1618 | 488 | 86.0 | 7 | 2.53 | 4.26e-06 (2^-17.84) | 17.84 |
| 19 | `pipelined_m:data_width=25,n_iter=20,angle_guard=0,frac_guard=2,rounding=trunc,m=4` | 1707 | 480 | 86.0 | 7 | 2.63 | 2.57e-06 (2^-18.57) | 18.57 |
| 20 | `pipelined_m:data_width=25,n_iter=20,angle_guard=0,frac_guard=2,rounding=round,m=4` | 1760 | 482 | 86.0 | 7 | 2.7 | 2.56e-06 (2^-18.57) | 18.57 |
| 21 | `pipelined_m:data_width=28,n_iter=20,angle_guard=-1,frac_guard=2,rounding=trunc,m=4` | 1867 | 527 | 86.0 | 7 | 2.88 | 2.04e-06 (2^-18.91) | 18.91 |
| 22 | `pipelined_m:data_width=28,n_iter=20,angle_guard=2,frac_guard=2,rounding=trunc,m=4` | 1927 | 542 | 86.0 | 7 | 2.97 | 1.93e-06 (2^-18.99) | 18.99 |
| 23 | `pipelined_m:data_width=27,n_iter=22,angle_guard=2,frac_guard=4,rounding=round,m=3` | 2209 | 839 | 105.9 | 10 | 3.67 | 5.26e-07 (2^-20.86) | 20.86 |
| 24 | `pipelined_m:data_width=28,n_iter=23,angle_guard=3,frac_guard=4,rounding=trunc,m=3` | 2347 | 872 | 105.9 | 10 | 3.87 | 2.59e-07 (2^-21.88) | 21.88 |
| 25 | `pipelined_m:data_width=25,n_iter=26,angle_guard=3,frac_guard=4,rounding=trunc,m=2` | 2429 | 1262 | 152.6 | 15 | 4.44 | 2.56e-07 (2^-21.90) | 21.90 |
| 26 | `pipelined_m:data_width=28,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc,m=3` | 2879 | 1078 | 105.9 | 12 | 4.76 | 3.75e-08 (2^-24.67) | 24.67 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The dominant constraint is the system batch latency: 32 requests must all complete within 0.44us of a 1us tick. This requires sustained throughput of 32 Msps AND low per-burst latency. Only pipelined and pipelined_m architectures produce 1 result/cycle, making them the only viable families. iterative and unrolled_k produce 1 result every several cycles, so 32 sequential results would take 32*(N+3) or 32*ceil(N/k)+3 cycles, which at any realistic Fmax exceeds 440ns. I therefore focus 80% of the budget on pipelined (45%) and pipelined_m (35%), which are the only families that can plausibly meet all constraints. pipelined_m is particularly interesting because it reduces FF count (the area objective) by registering every m stages while maintaining 1 result/cycle throughput. The accuracy constraint (max_abs_err <= 2^-12) requires n_iter >= ~12-14 and data_width >= 14, so I bound those ranges accordingly. I include unrolled_k with a small 20% share to confirm it is infeasible for the batch latency constraint, which will help the Pareto front mapping exclude it. The accuracy_bits objective (max, ref 12) and luts_plus_ffs objective (min, ref 4000) create a trade-off: more iterations and wider data paths improve accuracy but increase area. The Pareto front will lie along this trade-off, with pipelined_m likely dominating pipelined on the area side for equivalent accuracy.*)
- `pipelined` (45 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* The system issues 32 requests per 1us tick and requires all 32 back within 0.44us. A pipelined CORDIC with 1 result/cycle throughput is the only architecture that can sustain 32 Msps while keeping latency low enough to meet the tight 0.44us batch deadline. Iterative/unrolled_k would take N+3 or ceil(N/k)+3 cycles per result, meaning 32 sequential results would take 32*(N+3) cycles, far exceeding 0.44us at any realistic Fmax. Pipelined gives 1 result/cycle, so 32 results take 32 cycles + N+2 latency. At ~200MHz, 32 cycles = 160ns, plus latency ~15 cycles = 75ns, total ~235ns < 440ns. This is the only viable family for the throughput and batch latency constraints. Accuracy constraint max_abs_err <= 2^-12 = 0.000244 requires n_iter >= ~12-14 with data_width >= 14. I focus n_iter 12-18 and data_width 14-20 to find the minimal-area design that meets accuracy.
- `pipelined_m` (35 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m registers every m stages, reducing FF count compared to full pipelined while maintaining 1 result/cycle throughput. This is the key trade-off: fewer FFs (lower area) at the cost of slightly higher latency (ceil(N/m)+2 vs N+2). Since the objective is min luts_plus_ffs, pipelined_m with m=2-4 could significantly reduce FF count while still meeting the 0.44us batch deadline. For N=14, m=2: latency = 7+2 = 9 cycles vs 16 for full pipelined. At 200MHz, 32 results + 9 cycle latency = 41 cycles = 205ns < 440ns. This family likely contains the area-optimal designs on the Pareto front.
- `unrolled_k` (20 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k with high k (4-8) processes multiple micro-rotations per cycle, reducing the number of cycles per result. With k=8 and N=14, ceil(14/8)+3 = 5 cycles/result. 32 results would take 32*5 = 160 cycles. At 200MHz that's 800ns, which exceeds 440ns. Even at 400MHz it's 400ns, borderline. This family is unlikely to meet the batch latency constraint for 32 sequential results, but I include it with a small budget to confirm infeasibility and check if any high-k, low-N configuration could work. The throughput constraint (>=32 Msps) requires Fmax * (1/cycles_per_result) >= 32, so cycles_per_result <= Fmax/32. At 200MHz, cycles_per_result <= 6.25, so k must be high enough that ceil(N/k)+3 <= 6, meaning N/k <= 3, so k >= N/3. For N=12, k>=4. This is a tight constraint and likely infeasible for the batch deadline, but worth a small check.

**Result (code):** 100 evaluations this round, 100 total; 62 feasible; hypervolume 8584 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `m=4` and `m=3`, achieving a minimum `luts_plus_ffs` of 1216. The `pipelined` family is strictly worse in area (best 1740) for similar accuracy, and `unrolled_k` failed to meet throughput constraints. The `iterative` family is not yet explored, but given the strict throughput requirement (>= 32 MSPS) and the burst nature of the system (32 requests/tick), `iterative` (1 result/cycle latency N+3) would likely require a very high Fmax or parallel instances to meet the 32 MSPS average throughput, likely resulting in higher area than the pipelined variants which already achieve 93-119 MSPS. The current front covers `luts_plus_ffs` 1216-1656 and `accuracy_bits` 12.7-15.3. The selection rule is `min luts_plus_ffs`, so the design at 1216 is the primary candidate. However, to ensure we haven't missed a lower-area design with slightly different parameters (e.g., `m=2` or different `angle_guard`/`frac_guard` combinations that might reduce LUTs at the cost of FFs or vice versa, potentially lowering the sum), we should refine the search around the current best region. Specifically, `pipelined_m` with `m=4` and `data_width=19` seems optimal. We will narrow the ranges for `pipelined_m` to focus on the high-efficiency region: `data_width` 18-20, `n_iter` 13-16, `angle_guard` 0-2, `frac_guard` 0-2, `m` 3-4. We will also include `pipelined` in the search but with tighter bounds to confirm it cannot beat 1216, though evidence suggests it cannot. We will not add `iterative` as it is unlikely to be competitive on area for this throughput.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8584 (gain this round: n/a (first round)).
Feasible designs: 62 of 100 evaluations (55 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 273
- max_abs_err <= 0.000244141: 36% violate; best seen 2.4e-05 (2^-15.35)
- sys_p99_batch_us <= 0.44: 20% violate; best seen 0.161

Pareto front (feasible, 12 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1216, accuracy_bits=12.7, luts=909, ffs=307, throughput_msps=93.6, max_abs_err=0.000148 (2^-12.72), power_index=1.46
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=1 rounding=round m=4] luts_plus_ffs=1276, accuracy_bits=12.8, luts=963, ffs=313, throughput_msps=93.6, max_abs_err=0.000136 (2^-12.84), power_index=1.54
- pipelined_m [data_width=20 n_iter=14 angle_guard=0 frac_guard=2 rounding=round m=4] luts_plus_ffs=1331, accuracy_bits=12.9, luts=1006, ffs=325, throughput_msps=93.6, max_abs_err=0.000134 (2^-12.86), power_index=1.6
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1340, accuracy_bits=13.7, luts=1023, ffs=317, throughput_msps=93.6, max_abs_err=7.77e-05 (2^-13.65), power_index=1.61
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1344, accuracy_bits=13.7, luts=1023, ffs=321, throughput_msps=93.6, max_abs_err=7.76e-05 (2^-13.65), power_index=1.62
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1363, accuracy_bits=13.7, luts=1048, ffs=315, throughput_msps=93.6, max_abs_err=7.76e-05 (2^-13.65), power_index=1.64
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=2 rounding=round m=4] luts_plus_ffs=1405, accuracy_bits=13.7, luts=1080, ffs=325, throughput_msps=93.6, max_abs_err=7.53e-05 (2^-13.70), power_index=1.69
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1554, accuracy_bits=14.3, luts=1096, ffs=458, throughput_msps=119, max_abs_err=4.81e-05 (2^-14.34), power_index=1.87
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1596, accuracy_bits=14.5, luts=1136, ffs=460, throughput_msps=119, max_abs_err=4.29e-05 (2^-14.51), power_index=1.92
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1656, accuracy_bits=15.3, luts=1259, ffs=397, throughput_msps=93.6, max_abs_err=2.4e-05 (2^-15.35), power_index=1.99
Front coverage: luts_plus_ffs 1216..1656 (HV reference 4000); accuracy_bits 12.7..15.3 (HV reference 12); data_width on the front 19..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.16 bits
- pipelined: 45 evals, 34 feasible; max throughput seen 273 MSPS; best accuracy 14.63 bits; best feasible luts_plus_ffs=1740; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 35 evals, 28 feasible; max throughput seen 171 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=1216; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 1..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine search around the current best pipelined_m designs to ensure the global minimum for luts_plus_ffs is found within the feasible accuracy and throughput constraints.*)
- `pipelined_m` (50 evals): data_width=18..20, n_iter=13..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=3..4. *Why:* Focus on the region producing the best area (1216) to see if any lower area exists with slight parameter tweaks.
- `pipelined` (50 evals): data_width=18..20, n_iter=13..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Confirm that fully pipelined designs cannot beat the pipelined_m area, though evidence suggests they are ~500 LUTs+FFs worse.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 200 total; 147 feasible; hypervolume 8750 (+1.9%).

**LLM decision:** `refine` — The current Pareto front is dominated by `pipelined_m` designs with `m=4` and `data_width` 18-20. The `unrolled_k` family is infeasible (max throughput 12 MSPS < 32 MSPS constraint). The `pipelined` family has a higher minimum area (1740) than `pipelined_m` (1145), so it is unlikely to improve the primary objective (min luts_plus_ffs) significantly, though it offers higher throughput. The `iterative` family is not yet explored, but its throughput is typically 1 result per N+3 cycles. For N=14, that's 17 cycles/result. At a reasonable Fmax (e.g., 100-200 MHz), throughput would be ~6-12 MSPS, which is far below the 32 MSPS constraint. Thus, `iterative` is likely infeasible for this spec. The `pipelined_m` family with `m=2` or `m=3` might offer a trade-off between area and throughput/latency, but the current front already shows `m=4` is the most area-efficient. To maximize hypervolume and find the true minimum area design, I should refine the search around the best `pipelined_m` region: `data_width` 17-20, `n_iter` 13-16, `angle_guard` 0-2, `frac_guard` 0-2, `m` 3-4. This focuses the budget on the most promising area of the design space.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8750 (gain this round: +1.9%).
Feasible designs: 147 of 200 evaluations (114 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 10% violate; best seen 273
- max_abs_err <= 0.000244141: 26% violate; best seen 2.4e-05 (2^-15.35)
- sys_p99_batch_us <= 0.44: 10% violate; best seen 0.161

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1145, accuracy_bits=12.5, luts=855, ffs=291, throughput_msps=93.6, max_abs_err=0.00017 (2^-12.53), power_index=1.38
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1200, accuracy_bits=12.8, luts=896, ffs=305, throughput_msps=93.6, max_abs_err=0.000142 (2^-12.78), power_index=1.44
- pipelined_m [data_width=20 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1325, accuracy_bits=13.6, luts=1008, ffs=317, throughput_msps=93.6, max_abs_err=7.97e-05 (2^-13.61), power_index=1.6
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1340, accuracy_bits=13.7, luts=1023, ffs=317, throughput_msps=93.6, max_abs_err=7.77e-05 (2^-13.65), power_index=1.61
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1344, accuracy_bits=13.7, luts=1023, ffs=321, throughput_msps=93.6, max_abs_err=7.76e-05 (2^-13.65), power_index=1.62
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1380, accuracy_bits=13.7, luts=1053, ffs=327, throughput_msps=93.6, max_abs_err=7.38e-05 (2^-13.73), power_index=1.66
- pipelined_m [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=4] luts_plus_ffs=1388, accuracy_bits=13.8, luts=1065, ffs=323, throughput_msps=93.6, max_abs_err=7.02e-05 (2^-13.80), power_index=1.67
- pipelined_m [data_width=20 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1398, accuracy_bits=13.8, luts=1067, ffs=331, throughput_msps=93.6, max_abs_err=6.78e-05 (2^-13.85), power_index=1.68
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=3] luts_plus_ffs=1596, accuracy_bits=14.5, luts=1136, ffs=460, throughput_msps=119, max_abs_err=4.29e-05 (2^-14.51), power_index=1.92
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1656, accuracy_bits=15.3, luts=1259, ffs=397, throughput_msps=93.6, max_abs_err=2.4e-05 (2^-15.35), power_index=1.99
Front coverage: luts_plus_ffs 1145..1656 (HV reference 4000); accuracy_bits 12.5..15.3 (HV reference 12); data_width on the front 18..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.16 bits
- pipelined: 95 evals, 81 feasible; max throughput seen 273 MSPS; best accuracy 14.63 bits; best feasible luts_plus_ffs=1740; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 85 evals, 66 feasible; max throughput seen 171 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=1145; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine search to the promising pipelined_m region to minimize luts_plus_ffs and maximize accuracy_bits within the constraints.*)
- `pipelined_m` (40 evals): data_width=17..20, n_iter=13..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=3..4. *Why:* Focus on the most area-efficient family and parameter region identified in Round 2.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 40 evaluations this round, 240 total; 180 feasible; hypervolume 8867 (+1.3%).

**LLM decision:** `stop` — The feasible Pareto front is well-established and robust. The `pipelined_m` family dominates the trade-off space, achieving the minimum area (1145 LUTs+FFs) while comfortably satisfying the strict system constraint (sys_p99_batch_us <= 0.44 us) with a best observed value of 0.161 us. The front spans a useful range of accuracy (12.5 to 15.3 bits) against area, and the hypervolume has stabilized (only +1.3% gain in the final round). Since this is the final round, we stop exploration and proceed to L2 simulation of the shortlist to finalize the design selection based on the 'min luts_plus_ffs' rule.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8867 (gain this round: +1.3%).
Feasible designs: 180 of 240 evaluations (140 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 273
- max_abs_err <= 0.000244141: 24% violate; best seen 2.4e-05 (2^-15.35)
- sys_p99_batch_us <= 0.44: 8% violate; best seen 0.161

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1145, accuracy_bits=12.5, luts=855, ffs=291, throughput_msps=93.6, max_abs_err=0.00017 (2^-12.53), power_index=1.38
- pipelined_m [data_width=19 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1165, accuracy_bits=12.6, luts=868, ffs=297, throughput_msps=93.6, max_abs_err=0.000164 (2^-12.57), power_index=1.4
- pipelined_m [data_width=20 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1220, accuracy_bits=12.8, luts=909, ffs=311, throughput_msps=93.6, max_abs_err=0.000138 (2^-12.82), power_index=1.47
- pipelined_m [data_width=20 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1238, accuracy_bits=12.8, luts=923, ffs=315, throughput_msps=93.6, max_abs_err=0.000137 (2^-12.83), power_index=1.49
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] luts_plus_ffs=1254, accuracy_bits=13, luts=905, ffs=349, throughput_msps=119, max_abs_err=0.000119 (2^-13.04), power_index=1.51
- pipelined_m [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1269, accuracy_bits=13.6, luts=964, ffs=305, throughput_msps=93.6, max_abs_err=8.33e-05 (2^-13.55), power_index=1.53
- pipelined_m [data_width=19 n_iter=16 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1298, accuracy_bits=13.7, luts=1001, ffs=297, throughput_msps=93.6, max_abs_err=7.72e-05 (2^-13.66), power_index=1.56
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1337, accuracy_bits=14.1, luts=1033, ffs=305, throughput_msps=93.6, max_abs_err=5.75e-05 (2^-14.09), power_index=1.61
- pipelined_m [data_width=20 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1518, accuracy_bits=14.8, luts=1185, ffs=333, throughput_msps=93.6, max_abs_err=3.61e-05 (2^-14.76), power_index=1.83
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1656, accuracy_bits=15.3, luts=1259, ffs=397, throughput_msps=93.6, max_abs_err=2.4e-05 (2^-15.35), power_index=1.99
Front coverage: luts_plus_ffs 1145..1656 (HV reference 4000); accuracy_bits 12.5..15.3 (HV reference 12); data_width on the front 18..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.16 bits
- pipelined: 95 evals, 81 feasible; max throughput seen 273 MSPS; best accuracy 14.63 bits; best feasible luts_plus_ffs=1740; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 125 evals, 99 feasible; max throughput seen 171 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=1145; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=17..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (13 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 279 feasible; hypervolume 1.856e+04 (+109.4%).

**No LLM call** (code's front-mapping round): The feasible Pareto front is well-established and robust. The `pipelined_m` family dominates the trade-off space, achieving the minimum area (1145 LUTs+FFs) while comfortably satisfying the strict system constraint (sys_p99_batch_us <= 0.44 us) with a best observed value of 0.161 us. The front spans a useful range of accuracy (12.5 to 15.3 bits) against area, and the hypervolume has stabilized (only +1.3% gain in the final round). Since this is the final round, we stop exploration and proceed to L2 simulation of the shortlist to finalize the design selection based on the 'min luts_plus_ffs' rule.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.856e+04 (gain this round: +109.4%).
Feasible designs: 279 of 400 evaluations (235 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 273
- max_abs_err <= 0.000244141: 20% violate; best seen 2.86e-08 (2^-25.06)
- sys_p99_batch_us <= 0.44: 16% violate; best seen 0.161

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1145, accuracy_bits=12.5, luts=855, ffs=291, throughput_msps=93.6, max_abs_err=0.00017 (2^-12.53), power_index=1.38
- pipelined_m [data_width=20 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=1220, accuracy_bits=12.8, luts=909, ffs=311, throughput_msps=93.6, max_abs_err=0.000138 (2^-12.82), power_index=1.47
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=1256, accuracy_bits=13.2, luts=969, ffs=287, throughput_msps=93.6, max_abs_err=0.000108 (2^-13.18), power_index=1.51
- pipelined_m [data_width=19 n_iter=16 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1337, accuracy_bits=14.1, luts=1033, ffs=305, throughput_msps=93.6, max_abs_err=5.75e-05 (2^-14.09), power_index=1.61
- pipelined_m [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1656, accuracy_bits=15.3, luts=1259, ffs=397, throughput_msps=93.6, max_abs_err=2.4e-05 (2^-15.35), power_index=1.99
- pipelined_m [data_width=23 n_iter=17 angle_guard=0 frac_guard=2 rounding=trunc m=3] luts_plus_ffs=1864, accuracy_bits=15.8, luts=1337, ffs=527, throughput_msps=114, max_abs_err=1.73e-05 (2^-15.82), power_index=2.24
- pipelined_m [data_width=22 n_iter=19 angle_guard=2 frac_guard=4 rounding=round m=4] luts_plus_ffs=2064, accuracy_bits=17.5, luts=1607, ffs=457, throughput_msps=89.6, max_abs_err=5.47e-06 (2^-17.48), power_index=2.48
- pipelined_m [data_width=25 n_iter=20 angle_guard=0 frac_guard=2 rounding=round m=4] luts_plus_ffs=2242, accuracy_bits=18.6, luts=1760, ffs=482, throughput_msps=86, max_abs_err=2.56e-06 (2^-18.57), power_index=2.7
- pipelined_m [data_width=27 n_iter=22 angle_guard=2 frac_guard=4 rounding=round m=3] luts_plus_ffs=3048, accuracy_bits=20.9, luts=2209, ffs=839, throughput_msps=106, max_abs_err=5.26e-07 (2^-20.86), power_index=3.67
- pipelined_m [data_width=28 n_iter=28 angle_guard=3 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=3956, accuracy_bits=24.7, luts=2879, ffs=1078, throughput_msps=106, max_abs_err=3.75e-08 (2^-24.67), power_index=4.76
Front coverage: luts_plus_ffs 1145..3956 (HV reference 4000); accuracy_bits 12.5..24.7 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 12 MSPS; best accuracy 12.16 bits
- pipelined: 95 evals, 81 feasible; max throughput seen 273 MSPS; best accuracy 14.63 bits; best feasible luts_plus_ffs=1740; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 285 evals, 198 feasible; max throughput seen 171 MSPS; best accuracy 25.06 bits; best feasible luts_plus_ffs=1145; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 12915 in, 3812 out
- provider-reported cost: $0.0089
- full prompts and replies: `llm_trace.jsonl`

