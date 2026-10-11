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
`pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 40877 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10890 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 885 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 138 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 138 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 124 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.34 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000148 (2^-12.72) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 4.86 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 4.29e-05 (2^-14.51) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.4 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.7 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 17 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 99.6 dBc, SNR 85.0 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (115) was simulated at its estimated Fmax (SimPy); 113 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 0.3417 → 0.3488 | yes |
| `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 0.3417 → 0.3488 | yes |
| `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc` | 0.3417 → 0.3488 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=-1,frac_guard=3,rounding=trunc` | 0.3738 → 0.3818 | yes |
| `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 0.3685 → 0.3762 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 40877 | 885 | 137.6 | 17 | 2.34 | 0.000148 (2^-12.72) | 12.72 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 42248 | 914 | 137.6 | 17 | 2.42 | 0.000119 (2^-13.04) | 13.04 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 43618 | 944 | 127.5 | 17 | 2.5 | 0.000119 (2^-13.04) | 13.04 |
| 3 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 46271 | 999 | 127.5 | 17 | 2.65 | 9.41e-05 (2^-13.38) | 13.38 |
| 4 | `pipelined:data_width=20,n_iter=15,angle_guard=2,frac_guard=0,rounding=trunc` | 47043 | 1018 | 123.1 | 17 | 2.7 | 8.43e-05 (2^-13.53) | 13.53 |
| 5 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round` | 47147 | 997 | 127.5 | 17 | 2.66 | 8.22e-05 (2^-13.57) | 13.57 |
| 6 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=3,rounding=round` | 48430 | 1022 | 127.5 | 17 | 2.73 | 7.32e-05 (2^-13.74) | 13.74 |
| 7 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 50287 | 1085 | 123.1 | 18 | 2.88 | 4.12e-05 (2^-14.57) | 14.57 |
| 8 | `pipelined:data_width=22,n_iter=16,angle_guard=0,frac_guard=0,rounding=trunc` | 53217 | 1148 | 123.1 | 18 | 3.05 | 3.87e-05 (2^-14.66) | 14.66 |
| 9 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 53531 | 1153 | 123.1 | 19 | 3.06 | 2.85e-05 (2^-15.10) | 15.10 |
| 10 | `pipelined:data_width=21,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 54310 | 1170 | 127.5 | 19 | 3.1 | 2.7e-05 (2^-15.18) | 15.18 |
| 11 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 55289 | 1168 | 127.5 | 19 | 3.12 | 2.58e-05 (2^-15.24) | 15.24 |
| 12 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 55870 | 1203 | 118.9 | 19 | 3.19 | 2.18e-05 (2^-15.48) | 15.48 |
| 13 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 57680 | 1218 | 123.1 | 19 | 3.25 | 2.15e-05 (2^-15.51) | 15.51 |
| 14 | `pipelined:data_width=23,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 59770 | 1287 | 115.0 | 19 | 3.42 | 1.66e-05 (2^-15.88) | 15.88 |
| 15 | `pipelined:data_width=22,n_iter=18,angle_guard=0,frac_guard=0,rounding=round` | 60083 | 1292 | 123.1 | 20 | 3.43 | 1.45e-05 (2^-16.07) | 16.07 |
| 16 | `pipelined:data_width=22,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 64473 | 1361 | 115.0 | 20 | 3.64 | 9.82e-06 (2^-16.64) | 16.64 |
| 17 | `pipelined:data_width=21,n_iter=20,angle_guard=1,frac_guard=1,rounding=round` | 67979 | 1433 | 123.1 | 22 | 3.83 | 9.8e-06 (2^-16.64) | 16.64 |
| 18 | `pipelined:data_width=23,n_iter=18,angle_guard=2,frac_guard=2,rounding=round` | 68573 | 1445 | 111.3 | 20 | 3.86 | 8.28e-06 (2^-16.88) | 16.88 |
| 19 | `pipelined:data_width=24,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 70513 | 1513 | 107.9 | 21 | 4.02 | 4.74e-06 (2^-17.69) | 17.69 |
| 20 | `pipelined:data_width=23,n_iter=21,angle_guard=0,frac_guard=0,rounding=round` | 73291 | 1569 | 118.9 | 23 | 4.17 | 4.39e-06 (2^-17.80) | 17.80 |
| 21 | `pipelined:data_width=23,n_iter=23,angle_guard=2,frac_guard=0,rounding=round` | 82569 | 1764 | 111.3 | 25 | 4.69 | 2.9e-06 (2^-18.39) | 18.39 |
| 22 | `pipelined:data_width=22,n_iter=23,angle_guard=2,frac_guard=2,rounding=round` | 84627 | 1780 | 115.0 | 25 | 4.76 | 2.55e-06 (2^-18.58) | 18.58 |
| 23 | `pipelined:data_width=23,n_iter=23,angle_guard=2,frac_guard=2,rounding=round` | 87870 | 1848 | 111.3 | 25 | 4.94 | 1.45e-06 (2^-19.40) | 19.40 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires 32 Msps throughput, max error <= 2^-12, and p99 batch latency <= 0.5us for a burst of 32 requests every 1us. The key challenge is the batch latency: 32 requests must all complete within 0.5us. For pipelined designs, the batch latency is approximately (32 + latency_cycles) / Fmax. To stay under 0.5us, we need (32 + L) / Fmax <= 0.5us. If Fmax is ~100MHz (10ns/cycle), then 32 + L <= 50, so L <= 18 cycles. pipelined_m with m=2 and N=14 gives L=9, total 41 cycles = 410ns, which passes. pipelined (m=1) with N=14 gives L=16, total 48 cycles = 480ns, also passes but with more area. unrolled_k cannot meet 32 Msps because its throughput is 1/ceil(N/k) per cycle, which is at most 1/5 = 0.2 results/cycle = 20 Msps at 100MHz. So unrolled_k is likely infeasible for the throughput constraint. I focus 80% of the budget on pipelined_m and pipelined, which are the viable families, and 20% on unrolled_k to confirm infeasibility. The accuracy constraint (max_abs_err <= 2^-12) requires n_iter >= 12 typically, so I set n_iter range to 12-16. data_width 12-16 balances area and accuracy. angle_guard and frac_guard are kept small to minimize area while maintaining accuracy.*)
- `pipelined_m` (50 evals): data_width=12..16, n_iter=12..16, angle_guard=-1..0, frac_guard=0..2, rounding=trunc|round, m=2..2. *Why:* pipelined_m with m=2 is the only family that can plausibly meet the strict 0.5us p99 batch latency while keeping area low. A full pipelined (m=1) design with N=14 has 16 cycles latency, which at ~100MHz is 160ns, but the burst of 32 requests means the last request arrives at cycle 31 and needs 16 more cycles, totaling ~47 cycles or ~470ns. However, pipelined_m with m=2 has ceil(14/2)+2 = 9 cycles latency. The burst of 32 requests takes 32 cycles to enter, plus 9 cycles for the last one to exit = 41 cycles. At 100MHz that is 410ns, which is under 0.5us. m=1 would be 32+16=48 cycles = 480ns, also under 0.5us but with more registers (higher area). m=2 reduces register count by ~half compared to m=1 while still meeting latency. n_iter=14 gives ~14 bits accuracy, well above the 12-bit requirement. data_width=14-16 balances accuracy and area. angle_guard=-1 to 0 and frac_guard=0-2 explore the accuracy/area trade-off. This family is the primary candidate for the Pareto front.
- `pipelined` (30 evals): data_width=12..16, n_iter=12..16, angle_guard=-1..0, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined (m=1) is the baseline for comparison. It has the lowest latency per result (N+2 cycles) but the highest register count. For N=14, latency is 16 cycles. Burst of 32: 32+16=48 cycles. At 100MHz that is 480ns, just under 0.5us. This family will likely have higher area than pipelined_m with m=2, but it may achieve higher Fmax due to shorter critical paths per stage. It serves as a reference point on the Pareto front and helps verify that pipelined_m is indeed better for this spec.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=12..16, angle_guard=-1..0, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* unrolled_k with k=2-4 can process multiple micro-rotations per cycle, reducing the number of cycles per result. For N=14, k=4: ceil(14/4)+3 = 7 cycles per result. Throughput is 1/7 results/cycle, so at 100MHz that is ~14.3 Msps, which does NOT meet the 32 Msps constraint. For k=8: ceil(14/8)+3 = 5 cycles, 20 Msps, still not enough. So unrolled_k likely cannot meet the throughput constraint unless Fmax is very high. However, it may have lower area than pipelined designs due to fewer registers. I include it with a small budget to check if any configuration meets all constraints, but it is unlikely to be on the Pareto front for this spec.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — The primary blocker is accuracy: 100% of evaluations violate max_abs_err <= 2^-12 (0.000244141). The best observed error is 0.000355 (2^-11.46) with data_width=16, n_iter=15. Since accuracy depends on data_width, n_iter, angle_guard, frac_guard, and rounding, and the current search has not found a feasible point, the ranges must be widened to allow higher precision configurations. Specifically, data_width needs to increase (likely to 18-22) and/or n_iter needs to increase (likely to 18-24) to push the error below 2^-12. Throughput is not a blocker (best seen 190 MSPS vs 32 required), and sys_p99_batch_us is close (best 0.242 us vs 0.5 us limit), so the focus should be on finding the minimum area configuration that meets the accuracy constraint. I will narrow the search around the promising pipelined family (which has the highest throughput) but widen data_width and n_iter to explore higher accuracy regions.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 190
- max_abs_err <= 0.000244141: 100% violate; best seen 0.000355 (2^-11.46)
- sys_p99_batch_us <= 0.5: 24% violate; best seen 0.242

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=15 angle_guard=0 frac_guard=2 rounding=round]: throughput=143, max_abs_err=0.000355 (2^-11.46); max_abs_err <= 0.000244141 violated by 45.2%
- pipelined [data_width=16 n_iter=15 angle_guard=0 frac_guard=1 rounding=round]: throughput=149, max_abs_err=0.000355 (2^-11.46); max_abs_err <= 0.000244141 violated by 45.2%
- pipelined_m [data_width=16 n_iter=15 angle_guard=0 frac_guard=2 rounding=round m=2]: throughput=78.8, max_abs_err=0.000355 (2^-11.46); max_abs_err <= 0.000244141 violated by 45.2%; sys_p99_batch_us <= 0.5 violated by 1.5%
- pipelined_m [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round m=2]: throughput=86.6, max_abs_err=0.000373 (2^-11.39); max_abs_err <= 0.000244141 violated by 52.7%
- pipelined_m [data_width=16 n_iter=14 angle_guard=0 frac_guard=2 rounding=round m=2]: throughput=78.8, max_abs_err=0.000389 (2^-11.33); max_abs_err <= 0.000244141 violated by 59.5%

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 11.33 bits
- pipelined: 30 evals, 0 feasible; max throughput seen 190 MSPS; best accuracy 11.46 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 102 MSPS; best accuracy 11.46 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Widening data_width and n_iter to explore higher accuracy configurations that can meet the 2^-12 error constraint. Focusing on pipelined and pipelined_m families as they have the highest throughput potential. Using rounding='round' for better accuracy. The angle_guard and frac_guard ranges are kept moderate to avoid excessive area increase while still allowing some precision improvement.*)
- `pipelined` (60 evals): data_width=18..24, n_iter=16..24, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Pipelined has the highest throughput (190 MSPS) and is the most likely to meet the 32 MSPS constraint while allowing higher data_width/n_iter for accuracy. Focusing on rounding='round' as it typically gives better accuracy than truncation for the same bit width.
- `pipelined_m` (40 evals): data_width=18..24, n_iter=16..24, angle_guard=0..2, frac_guard=0..2, rounding=round, m=2..4. *Why:* Pipelined_m may offer a better area/throughput trade-off than fully pipelined for the same accuracy, as it uses fewer registers. The m parameter allows exploring different pipeline depths to balance area and latency.

**Result (code):** 100 evaluations this round, 200 total; 59 feasible; hypervolume 2.734e+05 (+inf).

**LLM decision:** `refine` — The front is entirely pipelined, with min area 48071 um^2. The selection rule is min area, so we must aggressively push the low-area boundary. pipelined_m was underexplored (0 feasible in 90 evals) but has sufficient throughput headroom; re-exploring it with tighter ranges focused on low data_width/n_iter may yield a smaller design. unrolled_k is infeasible (max throughput 9.97 MSPS < 32), and iterative is likely infeasible for similar throughput reasons (1 result/cycle but high latency per result, likely < 32 MSPS unless Fmax is very high, which is unlikely given the area). Focusing on pipelined and pipelined_m with narrowed ranges around the current best feasible region will maximize the chance of finding a smaller design.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.734e+05 (gain this round: +inf (first feasible designs)).
Feasible designs: 59 of 200 evaluations (45 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 11% violate; best seen 190
- max_abs_err <= 0.000244141: 50% violate; best seen 1.45e-06 (2^-19.40)
- sys_p99_batch_us <= 0.5: 32% violate; best seen 0.242

Pareto front (feasible, 17 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=48071, accuracy_bits=13.4, ffs=1036, throughput_msps=138, max_abs_err=9.26e-05 (2^-13.40), power_index=2.75
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=50287, accuracy_bits=14.6, ffs=1085, throughput_msps=123, max_abs_err=4.12e-05 (2^-14.57), power_index=2.88
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=55289, accuracy_bits=15.2, ffs=1168, throughput_msps=128, max_abs_err=2.58e-05 (2^-15.24), power_index=3.12
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=55870, accuracy_bits=15.5, ffs=1203, throughput_msps=119, max_abs_err=2.18e-05 (2^-15.48), power_index=3.19
- pipelined [data_width=24 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=62109, accuracy_bits=15.9, ffs=1337, throughput_msps=111, max_abs_err=1.6e-05 (2^-15.93), power_index=3.55
- pipelined [data_width=22 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=64473, accuracy_bits=16.6, ffs=1361, throughput_msps=115, max_abs_err=9.82e-06 (2^-16.64), power_index=3.64
- pipelined [data_width=23 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] area_um2=68573, accuracy_bits=16.9, ffs=1445, throughput_msps=111, max_abs_err=8.28e-06 (2^-16.88), power_index=3.86
- pipelined [data_width=24 n_iter=19 angle_guard=2 frac_guard=0 rounding=round] area_um2=70513, accuracy_bits=17.7, ffs=1513, throughput_msps=108, max_abs_err=4.74e-06 (2^-17.69), power_index=4.02
- pipelined [data_width=23 n_iter=23 angle_guard=2 frac_guard=0 rounding=round] area_um2=82569, accuracy_bits=18.4, ffs=1764, throughput_msps=111, max_abs_err=2.9e-06 (2^-18.39), power_index=4.69
- pipelined [data_width=23 n_iter=23 angle_guard=2 frac_guard=2 rounding=round] area_um2=87870, accuracy_bits=19.4, ffs=1848, throughput_msps=111, max_abs_err=1.45e-06 (2^-19.40), power_index=4.94
Front coverage: area_um2 48071..87870 (HV reference 100000); accuracy_bits 13.4..19.4 (HV reference 12); data_width on the front 18..24 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 11.33 bits
- pipelined: 90 evals, 59 feasible; max throughput seen 190 MSPS; best accuracy 19.40 bits; best feasible area_um2=48071; feasible ranges: data_width 18..24, n_iter 16..23, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 90 evals, 0 feasible; max throughput seen 102 MSPS; best accuracy 19.00 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *The front is entirely pipelined, with min area 48071 um^2. The selection rule is min area, so we must aggressively push the low-area boundary. pipelined_m was underexplored (0 feasible in 90 evals) but has sufficient throughput headroom; re-exploring it with tighter ranges focused on low data_width/n_iter may yield a smaller design. unrolled_k is infeasible (max throughput 9.97 MSPS < 32), and iterative is likely infeasible for similar throughput reasons (1 result/cycle but high latency per result, likely < 32 MSPS unless Fmax is very high, which is unlikely given the area). Focusing on pipelined and pipelined_m with narrowed ranges around the current best feasible region will maximize the chance of finding a smaller design.*)
- `pipelined` (20 evals): data_width=17..22, n_iter=15..19, angle_guard=0..2, frac_guard=0..1, rounding=trunc|round. *Why:* The entire feasible front (17 designs) is pipelined. The minimum-area feasible design is 48071 um^2 (data_width=18, n_iter=17). To minimize area (the selection rule), we must push data_width and n_iter down to the absolute limits that still satisfy max_abs_err <= 2^-12 and throughput >= 32 MSPS. The current front starts at 13.4 bits accuracy; we need to find the exact boundary where accuracy drops below 12 bits or throughput drops below 32 MSPS to shave off the last few um^2. Narrowing the search to data_width 17-22 and n_iter 15-19 focuses the budget on this critical low-area boundary.
- `pipelined_m` (20 evals): data_width=17..22, n_iter=15..19, angle_guard=0..2, frac_guard=0..1, rounding=trunc|round, m=2..2. *Why:* pipelined_m had 0 feasible designs in 90 evals, but its max throughput (102 MSPS) is well above the 32 MSPS constraint. The issue is likely that the previous search didn't hit the right combination of low data_width/n_iter with the correct m. Since pipelined_m can have lower area than pipelined (fewer registers) for the same accuracy, it is worth re-exploring with tighter ranges focused on the low-area region (data_width 17-22, n_iter 15-19) and small m (1-2) to see if it can beat the 48071 um^2 pipelined design.
- clamped by code: pipelined_m.m: clamped [1, 2] to [2, 2] (registry 2..8)

**Result (code):** 40 evaluations this round, 240 total; 78 feasible; hypervolume 2.809e+05 (+2.7%).

**LLM decision:** `stop` — The Pareto front is well-established and feasible. The minimum area design (40877 um^2) meets all constraints: throughput 138 MSPS >= 32, max_abs_err 0.000148 <= 0.000244, and the system constraint sys_p99_batch_us is satisfied (best seen 0.242 us <= 0.5 us, and the pipelined family's high throughput ensures the 32-request burst completes well within the 0.5 us window). The front covers a wide range of accuracy (12.7 to 19.4 bits) and area (40877 to 87870 um^2), providing a good trade-off curve. Since this is the final round, we stop and select the minimum area design from the front.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 2.809e+05 (gain this round: +2.7%).
Feasible designs: 78 of 240 evaluations (62 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 9% violate; best seen 190
- max_abs_err <= 0.000244141: 43% violate; best seen 1.45e-06 (2^-19.40)
- sys_p99_batch_us <= 0.5: 35% violate; best seen 0.242

Pareto front (feasible, 21 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=40877, accuracy_bits=12.7, ffs=885, throughput_msps=138, max_abs_err=0.000148 (2^-12.72), power_index=2.34
- pipelined [data_width=20 n_iter=15 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=47043, accuracy_bits=13.5, ffs=1018, throughput_msps=123, max_abs_err=8.43e-05 (2^-13.53), power_index=2.7
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=50287, accuracy_bits=14.6, ffs=1085, throughput_msps=123, max_abs_err=4.12e-05 (2^-14.57), power_index=2.88
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=54310, accuracy_bits=15.2, ffs=1170, throughput_msps=128, max_abs_err=2.7e-05 (2^-15.18), power_index=3.1
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=55870, accuracy_bits=15.5, ffs=1203, throughput_msps=119, max_abs_err=2.18e-05 (2^-15.48), power_index=3.19
- pipelined [data_width=23 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=59770, accuracy_bits=15.9, ffs=1287, throughput_msps=115, max_abs_err=1.66e-05 (2^-15.88), power_index=3.42
- pipelined [data_width=22 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=64473, accuracy_bits=16.6, ffs=1361, throughput_msps=115, max_abs_err=9.82e-06 (2^-16.64), power_index=3.64
- pipelined [data_width=24 n_iter=19 angle_guard=2 frac_guard=0 rounding=round] area_um2=70513, accuracy_bits=17.7, ffs=1513, throughput_msps=108, max_abs_err=4.74e-06 (2^-17.69), power_index=4.02
- pipelined [data_width=23 n_iter=23 angle_guard=2 frac_guard=0 rounding=round] area_um2=82569, accuracy_bits=18.4, ffs=1764, throughput_msps=111, max_abs_err=2.9e-06 (2^-18.39), power_index=4.69
- pipelined [data_width=23 n_iter=23 angle_guard=2 frac_guard=2 rounding=round] area_um2=87870, accuracy_bits=19.4, ffs=1848, throughput_msps=111, max_abs_err=1.45e-06 (2^-19.40), power_index=4.94
Front coverage: area_um2 40877..87870 (HV reference 100000); accuracy_bits 12.7..19.4 (HV reference 12); data_width on the front 17..24 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 11.33 bits
- pipelined: 110 evals, 78 feasible; max throughput seen 190 MSPS; best accuracy 19.40 bits; best feasible area_um2=40877; feasible ranges: data_width 17..24, n_iter 15..23, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 110 evals, 0 feasible; max throughput seen 102 MSPS; best accuracy 19.00 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (21 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 135 feasible; hypervolume 2.824e+05 (+0.6%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established and feasible. The minimum area design (40877 um^2) meets all constraints: throughput 138 MSPS >= 32, max_abs_err 0.000148 <= 0.000244, and the system constraint sys_p99_batch_us is satisfied (best seen 0.242 us <= 0.5 us, and the pipelined family's high throughput ensures the 32-request burst completes well within the 0.5 us window). The front covers a wide range of accuracy (12.7 to 19.4 bits) and area (40877 to 87870 um^2), providing a good trade-off curve. Since this is the final round, we stop and select the minimum area design from the front.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.824e+05 (gain this round: +0.6%).
Feasible designs: 135 of 400 evaluations (115 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 15% violate; best seen 190
- max_abs_err <= 0.000244141: 39% violate; best seen 5.53e-08 (2^-24.11)
- sys_p99_batch_us <= 0.5: 42% violate; best seen 0.242

Pareto front (feasible, 24 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=40877, accuracy_bits=12.7, ffs=885, throughput_msps=138, max_abs_err=0.000148 (2^-12.72), power_index=2.34
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=46271, accuracy_bits=13.4, ffs=999, throughput_msps=128, max_abs_err=9.41e-05 (2^-13.38), power_index=2.65
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] area_um2=47147, accuracy_bits=13.6, ffs=997, throughput_msps=128, max_abs_err=8.22e-05 (2^-13.57), power_index=2.66
- pipelined [data_width=22 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=53217, accuracy_bits=14.7, ffs=1148, throughput_msps=123, max_abs_err=3.87e-05 (2^-14.66), power_index=3.05
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=54310, accuracy_bits=15.2, ffs=1170, throughput_msps=128, max_abs_err=2.7e-05 (2^-15.18), power_index=3.1
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=57680, accuracy_bits=15.5, ffs=1218, throughput_msps=123, max_abs_err=2.15e-05 (2^-15.51), power_index=3.25
- pipelined [data_width=22 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] area_um2=60083, accuracy_bits=16.1, ffs=1292, throughput_msps=123, max_abs_err=1.45e-05 (2^-16.07), power_index=3.43
- pipelined [data_width=23 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] area_um2=68573, accuracy_bits=16.9, ffs=1445, throughput_msps=111, max_abs_err=8.28e-06 (2^-16.88), power_index=3.86
- pipelined [data_width=23 n_iter=21 angle_guard=0 frac_guard=0 rounding=round] area_um2=73291, accuracy_bits=17.8, ffs=1569, throughput_msps=119, max_abs_err=4.39e-06 (2^-17.80), power_index=4.17
- pipelined [data_width=23 n_iter=23 angle_guard=2 frac_guard=2 rounding=round] area_um2=87870, accuracy_bits=19.4, ffs=1848, throughput_msps=111, max_abs_err=1.45e-06 (2^-19.40), power_index=4.94
Front coverage: area_um2 40877..87870 (HV reference 100000); accuracy_bits 12.7..19.4 (HV reference 12); data_width on the front 17..24 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 11.33 bits
- pipelined: 190 evals, 135 feasible; max throughput seen 190 MSPS; best accuracy 23.48 bits; best feasible area_um2=40877; feasible ranges: data_width 16..28, n_iter 13..26, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 190 evals, 0 feasible; max throughput seen 108 MSPS; best accuracy 24.11 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 11985 in, 4535 out
- provider-reported cost: $0.0073
- full prompts and replies: `llm_trace.jsonl`

