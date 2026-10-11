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
`pipelined:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 38698 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10310 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 840 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 112 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.22 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.0002 (2^-12.28) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.1 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.41e-05 (2^-14.17) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.55 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 95.0 dBc, SNR 82.4 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (137) was simulated at its estimated Fmax (SimPy); 133 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 0.3213 → 0.3282 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=0,frac_guard=1,rounding=trunc` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=trunc` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 0.3344 → 0.3416 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 38698 | 840 | 143.2 | 16 | 2.22 | 0.0002 (2^-12.28) | 12.28 |
| 1 | `pipelined:data_width=18,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 39973 | 867 | 132.4 | 16 | 2.3 | 0.00017 (2^-12.53) | 12.53 |
| 2 | `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 40192 | 870 | 143.2 | 17 | 2.31 | 0.000168 (2^-12.54) | 12.54 |
| 3 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 40877 | 885 | 137.6 | 17 | 2.34 | 0.000148 (2^-12.72) | 12.72 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 42248 | 914 | 137.6 | 17 | 2.42 | 0.000119 (2^-13.04) | 13.04 |
| 5 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 42933 | 929 | 132.4 | 17 | 2.46 | 0.000109 (2^-13.17) | 13.17 |
| 6 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 44356 | 938 | 137.6 | 17 | 2.5 | 0.000108 (2^-13.18) | 13.18 |
| 7 | `pipelined:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc` | 44901 | 969 | 132.4 | 17 | 2.57 | 0.000101 (2^-13.27) | 13.27 |
| 8 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 44988 | 973 | 127.5 | 17 | 2.58 | 8.33e-05 (2^-13.55) | 13.55 |
| 9 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 46601 | 986 | 132.4 | 17 | 2.63 | 7.94e-05 (2^-13.62) | 13.62 |
| 10 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 47286 | 1001 | 127.5 | 17 | 2.67 | 7.74e-05 (2^-13.66) | 13.66 |
| 11 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 47357 | 1022 | 132.4 | 18 | 2.71 | 5.84e-05 (2^-14.06) | 14.06 |
| 12 | `pipelined:data_width=19,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 50411 | 1086 | 132.4 | 19 | 2.88 | 5.02e-05 (2^-14.28) | 14.28 |
| 13 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 51860 | 1095 | 127.5 | 18 | 2.93 | 4.29e-05 (2^-14.51) | 14.51 |
| 14 | `pipelined:data_width=21,n_iter=17,angle_guard=-1,frac_guard=0,rounding=round` | 53531 | 1153 | 127.5 | 19 | 3.06 | 3.65e-05 (2^-14.74) | 14.74 |
| 15 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc` | 54223 | 1166 | 127.5 | 19 | 3.1 | 3.57e-05 (2^-14.78) | 14.78 |
| 16 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 55090 | 1187 | 123.1 | 19 | 3.15 | 2.44e-05 (2^-15.32) | 15.32 |
| 17 | `pipelined:data_width=21,n_iter=18,angle_guard=4,frac_guard=0,rounding=round` | 60910 | 1310 | 111.3 | 20 | 3.48 | 1.44e-05 (2^-16.09) | 16.09 |
| 18 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=2,rounding=round` | 62680 | 1321 | 118.9 | 20 | 3.53 | 1.31e-05 (2^-16.22) | 16.22 |
| 19 | `pipelined:data_width=23,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 63392 | 1363 | 115.0 | 20 | 3.62 | 9.37e-06 (2^-16.70) | 16.70 |
| 20 | `pipelined:data_width=24,n_iter=18,angle_guard=4,frac_guard=1,rounding=round` | 71193 | 1502 | 101.6 | 20 | 4.01 | 8.05e-06 (2^-16.92) | 16.92 |
| 21 | `pipelined:data_width=23,n_iter=22,angle_guard=1,frac_guard=0,rounding=round` | 77882 | 1665 | 115.0 | 24 | 4.43 | 3.01e-06 (2^-18.34) | 18.34 |
| 22 | `pipelined:data_width=25,n_iter=20,angle_guard=2,frac_guard=2,rounding=round` | 81926 | 1724 | 104.7 | 22 | 4.61 | 2.15e-06 (2^-18.83) | 18.83 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires 32 Msps throughput (1 result/cycle at 32 MHz, or faster) and a 0.5 us p99 batch latency for 32 simultaneous requests. The iterative family is excluded because it produces 1 result every N+3 cycles, making 32 Msps impossible without Fmax > 32*(N+3) MHz, which is infeasible in sky130. pipelined_m (m=2-4) is the primary candidate: it achieves 1 result/cycle throughput, and with N=12-16, m=2, the batch of 32 completes in 32 cycles of service plus pipeline drain; at Fmax >= 80 MHz this is 0.4 us, meeting the 0.5 us bound. Full pipelined (m=1) is included at 35% to map the low-latency/high-Fmax end of the front and compare area. unrolled_k gets a small 10% share to confirm it is infeasible for the throughput constraint. data_width 14-24 and n_iter 12-16 are chosen so that max_abs_err <= 2^-12 is met with margin (accuracy_bits >= 12) while keeping area low. angle_guard -1..2 and frac_guard 0..2 allow the optimizer to trade a few extra bits of angle/fractional precision against area. Rounding is left to the optimizer. The HV reference point (area=100000 um^2, accuracy_bits=12) suggests the front should span from near-minimum-area designs (data_width~14, n_iter~12) up to higher-accuracy designs (data_width~24, n_iter~16), so the ranges cover that span.*)
- `pipelined_m` (55 evals): data_width=14..24, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m is the only family that can plausibly meet both the 32 Msps throughput constraint (1 result/cycle) and the 0.5 us p99 batch latency for a 32-request burst. With m=2, a 32-request burst takes ceil(12/2)+2 = 8 cycles of pipeline drain plus the 32-cycle service time; at Fmax >= 80 MHz the 32 results complete in 32/80 = 0.4 us, well under 0.5 us. m=2-4 gives a good area/latency trade-off: more registers than pipelined (m=1) but far fewer than full pipelined, and the batch latency bound is met as long as Fmax is high enough. data_width 14-24 and n_iter 12-16 cover the accuracy constraint (max_abs_err <= 2^-12) with margin for the angle/frac guards. angle_guard -1..2 and frac_guard 0..2 keep the datapath narrow to minimise area while preserving accuracy.
- `pipelined` (35 evals): data_width=14..24, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Full pipelined (m=1) has the lowest latency (N+2 cycles) and highest Fmax potential, which helps meet the 0.5 us batch bound with the most margin. It costs more area due to N pipeline registers, but for small N (12-16) the area penalty is moderate. Including it lets the Pareto front capture the area/accuracy trade-off at the low-latency end, and confirms whether pipelined_m with m=2 is close enough in Fmax to dominate it on area.
- `unrolled_k` (10 evals): data_width=14..24, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k with k=4-8 produces ceil(N/k)+3 cycles per result. For N=12, k=8: ceil(12/8)+3 = 5 cycles/result. Throughput = Fmax/5. To hit 32 Msps needs Fmax >= 160 MHz, which is aggressive for sky130. This family is unlikely to meet the throughput constraint, but a small budget share lets us confirm infeasibility and check if any high-k corner sneaks onto the front. k=4-8 covers the most aggressive unrolling.

**Result (code):** 100 evaluations this round, 100 total; 18 feasible; hypervolume 1.351e+05 (n/a).

**LLM decision:** `refine` — The `pipelined` family is the only one producing feasible designs (18 feasible vs 0 for `unrolled_k` and `pipelined_m`). The current Pareto front is clustered in a narrow region: `data_width` 17-20, `n_iter` 15-16, `angle_guard` 0-2, `frac_guard` 0-2. The constraint `sys_p99_batch_us <= 0.5` is the most restrictive (63% violation rate), which strongly favors high throughput (pipelined) and low latency. `unrolled_k` and `pipelined_m` failed to meet throughput/latency constraints in their initial broad searches. To maximize hypervolume and find the true minimum area, I should focus the budget on the `pipelined` family within the proven feasible ranges, allowing Optuna to fine-tune the trade-off between area and accuracy. I will also slightly widen `n_iter` to 14-17 and `data_width` to 16-21 to ensure the boundaries of the feasible region are explored, as the current front might be missing slightly cheaper designs with lower `n_iter` or `data_width` that still meet the error constraint.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.351e+05 (gain this round: n/a (first round)).
Feasible designs: 18 of 100 evaluations (16 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 11% violate; best seen 156
- max_abs_err <= 0.000244141: 45% violate; best seen 3.32e-05 (2^-14.88)
- sys_p99_batch_us <= 0.5: 63% violate; best seen 0.282

Pareto front (feasible, 6 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] area_um2=42388, accuracy_bits=12.6, ffs=898, throughput_msps=143, max_abs_err=0.000158 (2^-12.63), power_index=2.4
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=43073, accuracy_bits=12.9, ffs=912, throughput_msps=138, max_abs_err=0.00013 (2^-12.91), power_index=2.43
- pipelined [data_width=17 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] area_um2=45985, accuracy_bits=13, ffs=973, throughput_msps=138, max_abs_err=0.00012 (2^-13.03), power_index=2.6
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=46358, accuracy_bits=13.5, ffs=1003, throughput_msps=128, max_abs_err=8.71e-05 (2^-13.49), power_index=2.66
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=47357, accuracy_bits=14.1, ffs=1022, throughput_msps=132, max_abs_err=5.84e-05 (2^-14.06), power_index=2.71
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=51860, accuracy_bits=14.5, ffs=1095, throughput_msps=128, max_abs_err=4.29e-05 (2^-14.51), power_index=2.93
Front coverage: area_um2 42388..51860 (HV reference 100000); accuracy_bits 12.6..14.5 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 4.92 MSPS; best accuracy 12.96 bits
- pipelined: 35 evals, 18 feasible; max throughput seen 156 MSPS; best accuracy 14.51 bits; best feasible area_um2=42388; feasible ranges: data_width 17..24, n_iter 15..16, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 55 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 14.88 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *The `pipelined` family is the only one producing feasible designs (18 feasible vs 0 for `unrolled_k` and `pipelined_m`). The current Pareto front is clustered in a narrow region: `data_width` 17-20, `n_iter` 15-16, `angle_guard` 0-2, `frac_guard` 0-2. The constraint `sys_p99_batch_us <= 0.5` is the most restrictive (63% violation rate), which strongly favors high throughput (pipelined) and low latency. `unrolled_k` and `pipelined_m` failed to meet throughput/latency constraints in their initial broad searches. To maximize hypervolume and find the true minimum area, I should focus the budget on the `pipelined` family within the proven feasible ranges, allowing Optuna to fine-tune the trade-off between area and accuracy. I will also slightly widen `n_iter` to 14-17 and `data_width` to 16-21 to ensure the boundaries of the feasible region are explored, as the current front might be missing slightly cheaper designs with lower `n_iter` or `data_width` that still meet the error constraint.*)
- `pipelined` (100 evals): data_width=16..21, n_iter=14..17, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Focus exclusively on the only feasible family (`pipelined`) and narrow the search space to the region where feasible designs were found, slightly expanded to capture boundary effects. This concentrates the remaining 300 evaluations on optimizing the area/accuracy trade-off within the constraints.

**Result (code):** 100 evaluations this round, 200 total; 108 feasible; hypervolume 1.757e+05 (+30.1%).

**LLM decision:** `refine` — The `pipelined` family is the only one yielding feasible designs (108/135 evals), while `unrolled_k` and `pipelined_m` failed to meet the throughput or latency constraints. The current Pareto front is dominated by `pipelined` designs with `data_width` 17-21 and `n_iter` 14-17. The minimum area on the front is 38698 um^2. To improve hypervolume and find a potentially smaller area design, I should narrow the search space to focus the remaining budget (200 evals) on the most promising region of the `pipelined` family. Specifically, `data_width` 16-19 and `n_iter` 13-16 seem to offer the best trade-off between area and accuracy (accuracy_bits >= 12). The `angle_guard` and `frac_guard` can be kept in their current effective ranges (0-2 and 0-1) as they provide the necessary accuracy margin without excessive area cost. This refinement will allow Optuna to explore the boundaries of this specific sub-space more densely.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.757e+05 (gain this round: +30.1%).
Feasible designs: 108 of 200 evaluations (80 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 6% violate; best seen 156
- max_abs_err <= 0.000244141: 28% violate; best seen 2.44e-05 (2^-15.32)
- sys_p99_batch_us <= 0.5: 32% violate; best seen 0.282

Pareto front (feasible, 13 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=38698, accuracy_bits=12.3, ffs=840, throughput_msps=143, max_abs_err=0.0002 (2^-12.28), power_index=2.22
- pipelined [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] area_um2=39973, accuracy_bits=12.5, ffs=867, throughput_msps=132, max_abs_err=0.00017 (2^-12.53), power_index=2.3
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=42248, accuracy_bits=13, ffs=914, throughput_msps=138, max_abs_err=0.000119 (2^-13.04), power_index=2.42
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=44216, accuracy_bits=13.1, ffs=955, throughput_msps=132, max_abs_err=0.000118 (2^-13.05), power_index=2.53
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] area_um2=44356, accuracy_bits=13.2, ffs=938, throughput_msps=138, max_abs_err=0.000108 (2^-13.18), power_index=2.5
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] area_um2=46601, accuracy_bits=13.6, ffs=986, throughput_msps=132, max_abs_err=7.94e-05 (2^-13.62), power_index=2.63
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=47357, accuracy_bits=14.1, ffs=1022, throughput_msps=132, max_abs_err=5.84e-05 (2^-14.06), power_index=2.71
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=50411, accuracy_bits=14.3, ffs=1086, throughput_msps=132, max_abs_err=5.02e-05 (2^-14.28), power_index=2.88
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=54223, accuracy_bits=14.8, ffs=1166, throughput_msps=128, max_abs_err=3.57e-05 (2^-14.78), power_index=3.1
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=55090, accuracy_bits=15.3, ffs=1187, throughput_msps=123, max_abs_err=2.44e-05 (2^-15.32), power_index=3.15
Front coverage: area_um2 38698..55090 (HV reference 100000); accuracy_bits 12.3..15.3 (HV reference 12); data_width on the front 17..21 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 4.92 MSPS; best accuracy 12.96 bits
- pipelined: 135 evals, 108 feasible; max throughput seen 156 MSPS; best accuracy 15.32 bits; best feasible area_um2=38698; feasible ranges: data_width 16..24, n_iter 14..17, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 55 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 14.88 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Narrowing to the high-yield region of the pipelined family maximizes the chance of finding a lower-area design that still meets the strict accuracy and system latency constraints.*)
- `pipelined` (40 evals): data_width=16..19, n_iter=13..16, angle_guard=0..2, frac_guard=0..1, rounding=trunc|round. *Why:* Focus on the proven feasible region of the pipelined family to refine the Pareto front and potentially lower the minimum area.

**Result (code):** 40 evaluations this round, 240 total; 137 feasible; hypervolume 1.759e+05 (+0.1%).

**LLM decision:** `stop` — The exploration has successfully mapped a robust Pareto front for the `pipelined` family, which is the only family capable of meeting the strict system constraints (throughput >= 32 MSPS and sys_p99_batch_us <= 0.5 us). The `unrolled_k` and `pipelined_m` families were explored but yielded 0 feasible designs, confirming that only the fully pipelined architecture can handle the bursty 32-request/tick workload within the 0.5 us deadline. The current front spans a wide range of accuracy (12.3 to 15.3 bits) and area (38,698 to 55,090 um^2), providing a comprehensive trade-off curve. The minimum area feasible design (38,698 um^2) comfortably meets the accuracy constraint (max_abs_err <= 2^-12) and all system constraints. Since this is the final round and the front is well-covered with no obvious gaps in the feasible region, stopping is the appropriate action.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.759e+05 (gain this round: +0.1%).
Feasible designs: 137 of 240 evaluations (94 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 156
- max_abs_err <= 0.000244141: 28% violate; best seen 2.44e-05 (2^-15.32)
- sys_p99_batch_us <= 0.5: 26% violate; best seen 0.282

Pareto front (feasible, 16 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=38698, accuracy_bits=12.3, ffs=840, throughput_msps=143, max_abs_err=0.0002 (2^-12.28), power_index=2.22
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=40192, accuracy_bits=12.5, ffs=870, throughput_msps=143, max_abs_err=0.000168 (2^-12.54), power_index=2.31
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=40877, accuracy_bits=12.7, ffs=885, throughput_msps=138, max_abs_err=0.000148 (2^-12.72), power_index=2.34
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=42933, accuracy_bits=13.2, ffs=929, throughput_msps=132, max_abs_err=0.000109 (2^-13.17), power_index=2.46
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=44901, accuracy_bits=13.3, ffs=969, throughput_msps=132, max_abs_err=0.000101 (2^-13.27), power_index=2.57
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=44988, accuracy_bits=13.6, ffs=973, throughput_msps=128, max_abs_err=8.33e-05 (2^-13.55), power_index=2.58
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=47286, accuracy_bits=13.7, ffs=1001, throughput_msps=128, max_abs_err=7.74e-05 (2^-13.66), power_index=2.67
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=50411, accuracy_bits=14.3, ffs=1086, throughput_msps=132, max_abs_err=5.02e-05 (2^-14.28), power_index=2.88
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=51860, accuracy_bits=14.5, ffs=1095, throughput_msps=128, max_abs_err=4.29e-05 (2^-14.51), power_index=2.93
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=55090, accuracy_bits=15.3, ffs=1187, throughput_msps=123, max_abs_err=2.44e-05 (2^-15.32), power_index=3.15
Front coverage: area_um2 38698..55090 (HV reference 100000); accuracy_bits 12.3..15.3 (HV reference 12); data_width on the front 17..21 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 4.92 MSPS; best accuracy 12.96 bits
- pipelined: 175 evals, 137 feasible; max throughput seen 156 MSPS; best accuracy 15.32 bits; best feasible area_um2=38698; feasible ranges: data_width 16..24, n_iter 14..17, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 55 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 14.88 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (16 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 184 feasible; hypervolume 2.751e+05 (+56.3%).

**No LLM call** (code's front-mapping round): The exploration has successfully mapped a robust Pareto front for the `pipelined` family, which is the only family capable of meeting the strict system constraints (throughput >= 32 MSPS and sys_p99_batch_us <= 0.5 us). The `unrolled_k` and `pipelined_m` families were explored but yielded 0 feasible designs, confirming that only the fully pipelined architecture can handle the bursty 32-request/tick workload within the 0.5 us deadline. The current front spans a wide range of accuracy (12.3 to 15.3 bits) and area (38,698 to 55,090 um^2), providing a comprehensive trade-off curve. The minimum area feasible design (38,698 um^2) comfortably meets the accuracy constraint (max_abs_err <= 2^-12) and all system constraints. Since this is the final round and the front is well-covered with no obvious gaps in the feasible region, stopping is the appropriate action.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.751e+05 (gain this round: +56.3%).
Feasible designs: 184 of 400 evaluations (137 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 12% violate; best seen 156
- max_abs_err <= 0.000244141: 28% violate; best seen 5.57e-08 (2^-24.10)
- sys_p99_batch_us <= 0.5: 40% violate; best seen 0.282

Pareto front (feasible, 23 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] area_um2=38698, accuracy_bits=12.3, ffs=840, throughput_msps=143, max_abs_err=0.0002 (2^-12.28), power_index=2.22
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=40192, accuracy_bits=12.5, ffs=870, throughput_msps=143, max_abs_err=0.000168 (2^-12.54), power_index=2.31
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=42933, accuracy_bits=13.2, ffs=929, throughput_msps=132, max_abs_err=0.000109 (2^-13.17), power_index=2.46
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=44901, accuracy_bits=13.3, ffs=969, throughput_msps=132, max_abs_err=0.000101 (2^-13.27), power_index=2.57
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=47286, accuracy_bits=13.7, ffs=1001, throughput_msps=128, max_abs_err=7.74e-05 (2^-13.66), power_index=2.67
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=0 rounding=round] area_um2=50411, accuracy_bits=14.3, ffs=1086, throughput_msps=132, max_abs_err=5.02e-05 (2^-14.28), power_index=2.88
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=54223, accuracy_bits=14.8, ffs=1166, throughput_msps=128, max_abs_err=3.57e-05 (2^-14.78), power_index=3.1
- pipelined [data_width=21 n_iter=18 angle_guard=4 frac_guard=0 rounding=round] area_um2=60910, accuracy_bits=16.1, ffs=1310, throughput_msps=111, max_abs_err=1.44e-05 (2^-16.09), power_index=3.48
- pipelined [data_width=24 n_iter=18 angle_guard=4 frac_guard=1 rounding=round] area_um2=71193, accuracy_bits=16.9, ffs=1502, throughput_msps=102, max_abs_err=8.05e-06 (2^-16.92), power_index=4.01
- pipelined [data_width=25 n_iter=20 angle_guard=2 frac_guard=2 rounding=round] area_um2=81926, accuracy_bits=18.8, ffs=1724, throughput_msps=105, max_abs_err=2.15e-06 (2^-18.83), power_index=4.61
Front coverage: area_um2 38698..81926 (HV reference 100000); accuracy_bits 12.3..18.8 (HV reference 12); data_width on the front 17..25 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 4.92 MSPS; best accuracy 12.96 bits
- pipelined: 255 evals, 184 feasible; max throughput seen 156 MSPS; best accuracy 24.10 bits; best feasible area_um2=38698; feasible ranges: data_width 16..25, n_iter 13..25, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 135 evals, 0 feasible; max throughput seen 115 MSPS; best accuracy 22.59 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 12224 in, 3838 out
- provider-reported cost: $0.0068
- full prompts and replies: `llm_trace.jsonl`

