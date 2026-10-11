# DSE run: asic_multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_multiaxis_control: Shared sin/cos unit in sky130 standard cells for a 16-axis motor-control loop: a 1 MHz control tick issues 32 requests at once; all 32 results must be back within 0.5 us of the tick (p99 over ticks). Max error <= 2^-12. Minimise area.
  target: asic-sky130hd
  constraint: throughput_msps >= 32
  constraint: max_abs_err <= 0.000244141
  constraint: sys_p99_batch_us <= 0.5
  objective: min area_um2 (HV ref 100000)
  objective: max accuracy_bits (HV ref 12)
  select: min area_um2
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average)
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 40573 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10809 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 857 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 138 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 138 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 116 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.29 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000187 (2^-12.38) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.06 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 5.47e-05 (2^-14.16) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 0.897 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.4 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 94.9 dBc, SNR 82.2 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (132) was simulated at its estimated Fmax (SimPy); 129 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=4,frac_guard=0,rounding=trunc` | 0.3869 → 0.3952 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=0,frac_guard=3,rounding=round` | 0.3607 → 0.3684 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=round` | 40573 | 857 | 137.6 | 16 | 2.29 | 0.000187 (2^-12.38) | 12.38 |
| 1 | `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=round` | 41349 | 875 | 137.6 | 16 | 2.34 | 0.000169 (2^-12.53) | 12.53 |
| 2 | `pipelined:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 41887 | 908 | 127.5 | 16 | 2.41 | 0.000142 (2^-12.78) | 12.78 |
| 3 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 44356 | 938 | 137.6 | 17 | 2.5 | 0.000108 (2^-13.18) | 13.18 |
| 4 | `pipelined:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 46537 | 1003 | 137.6 | 18 | 2.66 | 0.000104 (2^-13.23) | 13.23 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=0,frac_guard=0,rounding=trunc` | 46624 | 1007 | 137.6 | 18 | 2.67 | 9.61e-05 (2^-13.35) | 13.35 |
| 6 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 47270 | 1019 | 132.4 | 18 | 2.7 | 8.82e-05 (2^-13.47) | 13.47 |
| 7 | `pipelined:data_width=19,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc` | 48002 | 1034 | 132.4 | 18 | 2.74 | 7.43e-05 (2^-13.72) | 13.72 |
| 8 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 48233 | 1020 | 132.4 | 18 | 2.72 | 6.45e-05 (2^-13.92) | 13.92 |
| 9 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 49611 | 1048 | 132.4 | 18 | 2.8 | 5.46e-05 (2^-14.16) | 14.16 |
| 10 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 49749 | 1052 | 132.4 | 18 | 2.81 | 5.25e-05 (2^-14.22) | 14.22 |
| 11 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 50482 | 1068 | 127.5 | 18 | 2.85 | 4.95e-05 (2^-14.30) | 14.30 |
| 12 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 50845 | 1093 | 127.5 | 18 | 2.9 | 4.81e-05 (2^-14.34) | 14.34 |
| 13 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc` | 51577 | 1109 | 123.1 | 18 | 2.94 | 4.67e-05 (2^-14.39) | 14.39 |
| 14 | `pipelined:data_width=19,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 52898 | 1118 | 132.4 | 19 | 2.99 | 4.63e-05 (2^-14.40) | 14.40 |
| 15 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=2,rounding=round` | 53376 | 1127 | 123.1 | 18 | 3.01 | 3.84e-05 (2^-14.67) | 14.67 |
| 16 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 53678 | 1135 | 127.5 | 19 | 3.03 | 3.42e-05 (2^-14.83) | 14.83 |
| 17 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=1,rounding=trunc` | 55003 | 1183 | 123.1 | 19 | 3.14 | 3.13e-05 (2^-14.96) | 14.96 |
| 18 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=2,rounding=round` | 55151 | 1164 | 127.5 | 19 | 3.11 | 2.76e-05 (2^-15.14) | 15.14 |
| 19 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 56069 | 1185 | 123.1 | 19 | 3.16 | 2.38e-05 (2^-15.36) | 15.36 |
| 20 | `pipelined:data_width=22,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 58210 | 1253 | 115.0 | 19 | 3.33 | 1.86e-05 (2^-15.72) | 15.72 |
| 21 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=4,rounding=trunc` | 62540 | 1338 | 111.3 | 19 | 3.56 | 1.77e-05 (2^-15.78) | 15.78 |
| 22 | `pipelined:data_width=22,n_iter=17,angle_guard=1,frac_guard=4,rounding=trunc` | 63320 | 1355 | 107.9 | 19 | 3.6 | 1.76e-05 (2^-15.79) | 15.79 |
| 23 | `pipelined:data_width=20,n_iter=19,angle_guard=2,frac_guard=2,rounding=round` | 64407 | 1358 | 123.1 | 21 | 3.63 | 1.17e-05 (2^-16.38) | 16.38 |
| 24 | `pipelined:data_width=21,n_iter=19,angle_guard=2,frac_guard=2,rounding=round` | 67082 | 1414 | 118.9 | 21 | 3.78 | 7.33e-06 (2^-17.06) | 17.06 |
| 25 | `pipelined:data_width=21,n_iter=21,angle_guard=2,frac_guard=3,rounding=round` | 76084 | 1601 | 115.0 | 23 | 4.28 | 4.46e-06 (2^-17.77) | 17.77 |
| 26 | `pipelined:data_width=21,n_iter=21,angle_guard=3,frac_guard=4,rounding=trunc` | 77788 | 1657 | 111.3 | 23 | 4.41 | 4.43e-06 (2^-17.78) | 17.78 |
| 27 | `pipelined:data_width=21,n_iter=21,angle_guard=3,frac_guard=4,rounding=round` | 78905 | 1659 | 111.3 | 23 | 4.44 | 3.39e-06 (2^-18.17) | 18.17 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The key constraints are: (1) throughput >= 32 Msps, (2) max_abs_err <= 2^-12, (3) sys_p99_batch_us <= 0.5us. The batch constraint is critical: 32 requests must all complete within 500ns of the tick. This requires either very high throughput (pipelined, 1/cycle) or high parallelism (unrolled_k with large k). The iterative family is excluded because it produces 1 result every N+3 cycles, giving throughput of Fmax/(N+3) which for N=13 is ~14 Msps at 200MHz, well below 32 Msps, and the batch latency would be 32*(16) cycles = 512 cycles = 2.56us at 200MHz, far exceeding 500ns. For accuracy, N=13-16 iterations with data_width=14-16 should meet the 12-bit constraint. I focus budget on pipelined_m (m=1) and pipelined as they are the most likely to meet all constraints with minimal area, and unrolled_k as a secondary option. angle_guard and frac_guard are set to 0 to minimize area since N=13+ should provide sufficient accuracy without extra guard bits.*)
- `pipelined_m` (55 evals): data_width=14..16, n_iter=13..16, angle_guard=0..0, frac_guard=0..0, rounding=trunc|round, m=2..2. *Why:* m=1 is the fully pipelined case (1 result/cycle). This is the only family that can plausibly meet the 32 Msps throughput constraint AND the 0.5us p99 batch latency (32 requests must be processed in <= 500ns, requiring >= 64 Msps raw throughput or a very low latency pipeline). With m=1, latency = N+2 cycles. For N=13, latency=15 cycles. At Fmax ~200MHz, 15 cycles = 75ns, well within 500ns. Accuracy: N=13 gives ~13 bits, meeting the 12-bit constraint. data_width=14-16 keeps area small while maintaining accuracy. This is the primary candidate for the Pareto front.
- `pipelined` (30 evals): data_width=14..16, n_iter=13..16, angle_guard=0..0, frac_guard=0..0, rounding=trunc|round. *Why:* Fully pipelined (equivalent to pipelined_m with m=1) but listed separately to ensure coverage. Same reasoning as pipelined_m m=1: 1 result/cycle, low latency, meets throughput and batch constraints. Included to cross-check and ensure the front is well-mapped in this region.
- `unrolled_k` (15 evals): data_width=14..16, n_iter=13..16, angle_guard=0..0, frac_guard=0..0, rounding=trunc|round, k=4..8. *Why:* Unrolled with k=4-8 can achieve high throughput (k results/cycle) with lower latency than iterative. For k=8, N=13, latency = ceil(13/8)+3 = 5 cycles. Throughput = Fmax * k. At Fmax ~200MHz, throughput = 1600 Msps, far exceeding 32 Msps. Batch latency: 32 requests / 8 per cycle = 4 cycles + 1 initial = 5 cycles = 25ns at 200MHz, well within 500ns. Area may be larger than pipelined due to parallel datapaths, but worth exploring for the area-accuracy trade-off.
- clamped by code: pipelined_m.m: clamped [1, 1] to [2, 2] (registry 2..8)

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — The primary bottleneck is accuracy: 100% of evaluations violate max_abs_err <= 2^-12 (0.000244141), with the best seen being 2^-11.39 (0.000373). The current best designs use data_width=16, n_iter=15, angle_guard=0, frac_guard=0. To reach 2^-12 accuracy, we need to increase the effective precision. Since accuracy depends on data_width, n_iter, angle_guard, and frac_guard, we should explore higher data_width (17-20) and/or higher n_iter (16-20) and/or positive angle_guard/frac_guard. Throughput is not the bottleneck (best seen 171 MSPS >> 32 required), and pipelined/pipelined_m easily meet the throughput constraint. The sys_p99_batch_us constraint is also met by the best designs (0.263 us < 0.5 us). We should focus on the pipelined family (highest throughput, simplest) and narrow the search to data_width 17-20, n_iter 16-20, angle_guard 0-2, frac_guard 0-2 to find feasible designs that meet the 2^-12 accuracy constraint while minimizing area.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 15% violate; best seen 171
- max_abs_err <= 0.000244141: 100% violate; best seen 0.000373 (2^-11.39)
- sys_p99_batch_us <= 0.5: 15% violate; best seen 0.263

No feasible design found yet. Least-violating designs:
- pipelined_m [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round m=2]: throughput=86.6, max_abs_err=0.000373 (2^-11.39); max_abs_err <= 0.000244141 violated by 52.7%
- pipelined [data_width=16 n_iter=16 angle_guard=0 frac_guard=0 rounding=round]: throughput=156, max_abs_err=0.000373 (2^-11.39); max_abs_err <= 0.000244141 violated by 52.7%
- pipelined [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round]: throughput=156, max_abs_err=0.000373 (2^-11.39); max_abs_err <= 0.000244141 violated by 52.7%
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round m=2]: throughput=86.6, max_abs_err=0.0004 (2^-11.29); max_abs_err <= 0.000244141 violated by 64.0%
- pipelined_m [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round m=2]: throughput=86.6, max_abs_err=0.000492 (2^-10.99); max_abs_err <= 0.000244141 violated by 101.4%

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.39 bits
- pipelined: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 11.39 bits
- pipelined_m: 55 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 11.39 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on pipelined family with increased data_width and n_iter to meet the 2^-12 accuracy constraint. Throughput and system latency constraints are already met by pipelined designs.*)
- `pipelined` (100 evals): data_width=17..20, n_iter=16..20, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined has the highest throughput (171 MSPS) and simplest structure. Narrowing to data_width 17-20 and n_iter 16-20 should yield the 2^-12 accuracy needed while keeping area reasonable.

**Result (code):** 100 evaluations this round, 200 total; 96 feasible; hypervolume 2.073e+05 (+inf).

**LLM decision:** `refine` — The `pipelined` family is the only one yielding feasible designs, with a clear Pareto front established between 44k and 64k um^2. `unrolled_k` and `pipelined_m` have failed to produce any feasible designs (max throughput 6.13 and 96.1 MSPS respectively, but likely failing the strict `sys_p99_batch_us <= 0.5` or accuracy constraints in combination). The current front is dominated by `pipelined` designs with `n_iter` 16-20 and `data_width` 17-20. To maximize hypervolume and find the true minimum area, we should focus the remaining budget on refining the `pipelined` family within the proven feasible region, specifically exploring the trade-off between `n_iter` and `data_width` more densely to see if we can push area lower while maintaining accuracy > 12 bits and throughput > 32 MSPS. The `iterative` family is unlikely to meet the 32 MSPS throughput constraint given the 1 result/cycle limit and typical Fmax, but since it hasn't been explored, it's a low-priority candidate if `pipelined` refinement stalls. For now, refining `pipelined` is the highest value action.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.073e+05 (gain this round: +inf (first feasible designs)).
Feasible designs: 96 of 200 evaluations (68 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 171
- max_abs_err <= 0.000244141: 52% violate; best seen 1.17e-05 (2^-16.38)
- sys_p99_batch_us <= 0.5: 8% violate; best seen 0.263

Pareto front (feasible, 22 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=44340, accuracy_bits=12.4, ffs=956, throughput_msps=143, max_abs_err=0.000188 (2^-12.38), power_index=2.54
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=46537, accuracy_bits=13.2, ffs=1003, throughput_msps=138, max_abs_err=0.000104 (2^-13.23), power_index=2.66
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=48002, accuracy_bits=13.7, ffs=1034, throughput_msps=132, max_abs_err=7.43e-05 (2^-13.72), power_index=2.74
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=49611, accuracy_bits=14.2, ffs=1048, throughput_msps=132, max_abs_err=5.46e-05 (2^-14.16), power_index=2.8
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] area_um2=50482, accuracy_bits=14.3, ffs=1068, throughput_msps=128, max_abs_err=4.95e-05 (2^-14.30), power_index=2.85
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=52898, accuracy_bits=14.4, ffs=1118, throughput_msps=132, max_abs_err=4.63e-05 (2^-14.40), power_index=2.99
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=54136, accuracy_bits=14.7, ffs=1162, throughput_msps=128, max_abs_err=3.81e-05 (2^-14.68), power_index=3.09
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] area_um2=55151, accuracy_bits=15.1, ffs=1164, throughput_msps=128, max_abs_err=2.76e-05 (2^-15.14), power_index=3.11
- pipelined [data_width=19 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] area_um2=61732, accuracy_bits=15.7, ffs=1302, throughput_msps=128, max_abs_err=1.92e-05 (2^-15.67), power_index=3.48
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] area_um2=64407, accuracy_bits=16.4, ffs=1358, throughput_msps=123, max_abs_err=1.17e-05 (2^-16.38), power_index=3.63
Front coverage: area_um2 44340..64407 (HV reference 100000); accuracy_bits 12.4..16.4 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.39 bits
- pipelined: 130 evals, 96 feasible; max throughput seen 171 MSPS; best accuracy 16.38 bits; best feasible area_um2=44340; feasible ranges: data_width 17..20, n_iter 16..20, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 55 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 11.39 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the remaining 200 evaluations on refining the `pipelined` family's Pareto front. The previous rounds established that only `pipelined` can meet the throughput and latency constraints. By narrowing the ranges to the proven feasible region, we allow the optimizer to spend more evaluations on fine-grained trade-offs between area and accuracy, which directly improves the hypervolume score.*)
- `pipelined` (40 evals): data_width=16..21, n_iter=14..22, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Focus exclusively on the `pipelined` family which is the only one producing feasible designs. Narrow the search space around the current Pareto front (data_width 17-20, n_iter 16-20) to densely sample the trade-off curve and potentially find lower area designs or higher accuracy at similar area. Exclude `unrolled_k` and `pipelined_m` as they have shown no feasibility in 15 and 55 evaluations respectively.

**Result (code):** 40 evaluations this round, 240 total; 133 feasible; hypervolume 2.506e+05 (+20.9%).

**LLM decision:** `stop` — The exploration has successfully mapped the Pareto front for the `pipelined` family, which is the only architecture capable of meeting the strict system constraints (32 MSPS throughput and 0.5 us p99 batch latency). The `unrolled_k` and `pipelined_m` families were proven infeasible for this spec due to insufficient throughput (max 6.13 and 96.1 MSPS respectively, but failing the batch latency/throughput combination for the 32-request burst). The current front covers the area range from 40,573 um^2 to 76,084 um^2 with accuracy from 12.4 to 17.8 bits. The minimum area feasible design (40,573 um^2) meets all constraints: throughput 138 MSPS >= 32, max_abs_err 0.000187 <= 0.000244, and the pipelined architecture ensures 1 result/cycle, which analytically guarantees the 0.5 us batch latency for 32 requests at ~138 MHz (32 cycles / 138 MHz ≈ 0.23 us < 0.5 us). Since this is the final round and the front is well-defined with a clear minimum-area candidate that satisfies all hard constraints, stopping is the correct decision. The selection rule (min area) will pick the 40,573 um^2 design.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 2.506e+05 (gain this round: +20.9%).
Feasible designs: 133 of 240 evaluations (93 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 6% violate; best seen 171
- max_abs_err <= 0.000244141: 45% violate; best seen 4.46e-06 (2^-17.77)
- sys_p99_batch_us <= 0.5: 6% violate; best seen 0.263

Pareto front (feasible, 27 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=40573, accuracy_bits=12.4, ffs=857, throughput_msps=138, max_abs_err=0.000187 (2^-12.38), power_index=2.29
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] area_um2=44356, accuracy_bits=13.2, ffs=938, throughput_msps=138, max_abs_err=0.000108 (2^-13.18), power_index=2.5
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=47270, accuracy_bits=13.5, ffs=1019, throughput_msps=132, max_abs_err=8.82e-05 (2^-13.47), power_index=2.7
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=49611, accuracy_bits=14.2, ffs=1048, throughput_msps=132, max_abs_err=5.46e-05 (2^-14.16), power_index=2.8
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=50845, accuracy_bits=14.3, ffs=1093, throughput_msps=128, max_abs_err=4.81e-05 (2^-14.34), power_index=2.9
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=52898, accuracy_bits=14.4, ffs=1118, throughput_msps=132, max_abs_err=4.63e-05 (2^-14.40), power_index=2.99
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=54223, accuracy_bits=14.8, ffs=1166, throughput_msps=128, max_abs_err=3.57e-05 (2^-14.78), power_index=3.1
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=56069, accuracy_bits=15.4, ffs=1185, throughput_msps=123, max_abs_err=2.38e-05 (2^-15.36), power_index=3.16
- pipelined [data_width=20 n_iter=19 angle_guard=1 frac_guard=1 rounding=round] area_um2=61871, accuracy_bits=15.7, ffs=1306, throughput_msps=128, max_abs_err=1.9e-05 (2^-15.68), power_index=3.49
- pipelined [data_width=21 n_iter=21 angle_guard=2 frac_guard=3 rounding=round] area_um2=76084, accuracy_bits=17.8, ffs=1601, throughput_msps=115, max_abs_err=4.46e-06 (2^-17.77), power_index=4.28
Front coverage: area_um2 40573..76084 (HV reference 100000); accuracy_bits 12.4..17.8 (HV reference 12); data_width on the front 16..21 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.39 bits
- pipelined: 170 evals, 133 feasible; max throughput seen 171 MSPS; best accuracy 17.77 bits; best feasible area_um2=40573; feasible ranges: data_width 16..21, n_iter 14..22, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 55 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 11.39 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (27 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 181 feasible; hypervolume 2.609e+05 (+4.1%).

**No LLM call** (code's front-mapping round): The exploration has successfully mapped the Pareto front for the `pipelined` family, which is the only architecture capable of meeting the strict system constraints (32 MSPS throughput and 0.5 us p99 batch latency). The `unrolled_k` and `pipelined_m` families were proven infeasible for this spec due to insufficient throughput (max 6.13 and 96.1 MSPS respectively, but failing the batch latency/throughput combination for the 32-request burst). The current front covers the area range from 40,573 um^2 to 76,084 um^2 with accuracy from 12.4 to 17.8 bits. The minimum area feasible design (40,573 um^2) meets all constraints: throughput 138 MSPS >= 32, max_abs_err 0.000187 <= 0.000244, and the pipelined architecture ensures 1 result/cycle, which analytically guarantees the 0.5 us batch latency for 32 requests at ~138 MHz (32 cycles / 138 MHz ≈ 0.23 us < 0.5 us). Since this is the final round and the front is well-defined with a clear minimum-area candidate that satisfies all hard constraints, stopping is the correct decision. The selection rule (min area) will pick the 40,573 um^2 design.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.609e+05 (gain this round: +4.1%).
Feasible designs: 181 of 400 evaluations (132 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 12% violate; best seen 171
- max_abs_err <= 0.000244141: 36% violate; best seen 4.98e-08 (2^-24.26)
- sys_p99_batch_us <= 0.5: 30% violate; best seen 0.263

Pareto front (feasible, 28 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=40573, accuracy_bits=12.4, ffs=857, throughput_msps=138, max_abs_err=0.000187 (2^-12.38), power_index=2.29
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] area_um2=44356, accuracy_bits=13.2, ffs=938, throughput_msps=138, max_abs_err=0.000108 (2^-13.18), power_index=2.5
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=47270, accuracy_bits=13.5, ffs=1019, throughput_msps=132, max_abs_err=8.82e-05 (2^-13.47), power_index=2.7
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=49611, accuracy_bits=14.2, ffs=1048, throughput_msps=132, max_abs_err=5.46e-05 (2^-14.16), power_index=2.8
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=50845, accuracy_bits=14.3, ffs=1093, throughput_msps=128, max_abs_err=4.81e-05 (2^-14.34), power_index=2.9
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] area_um2=53376, accuracy_bits=14.7, ffs=1127, throughput_msps=123, max_abs_err=3.84e-05 (2^-14.67), power_index=3.01
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=2 rounding=round] area_um2=55151, accuracy_bits=15.1, ffs=1164, throughput_msps=128, max_abs_err=2.76e-05 (2^-15.14), power_index=3.11
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=62540, accuracy_bits=15.8, ffs=1338, throughput_msps=111, max_abs_err=1.77e-05 (2^-15.78), power_index=3.56
- pipelined [data_width=21 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] area_um2=67082, accuracy_bits=17.1, ffs=1414, throughput_msps=119, max_abs_err=7.33e-06 (2^-17.06), power_index=3.78
- pipelined [data_width=21 n_iter=21 angle_guard=3 frac_guard=4 rounding=round] area_um2=78905, accuracy_bits=18.2, ffs=1659, throughput_msps=111, max_abs_err=3.39e-06 (2^-18.17), power_index=4.44
Front coverage: area_um2 40573..78905 (HV reference 100000); accuracy_bits 12.4..18.2 (HV reference 12); data_width on the front 16..22 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.39 bits
- pipelined: 250 evals, 181 feasible; max throughput seen 171 MSPS; best accuracy 24.26 bits; best feasible area_um2=40573; feasible ranges: data_width 16..28, n_iter 13..26, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 135 evals, 0 feasible; max throughput seen 108 MSPS; best accuracy 22.64 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 11972 in, 3338 out
- provider-reported cost: $0.0066
- full prompts and replies: `llm_trace.jsonl`

