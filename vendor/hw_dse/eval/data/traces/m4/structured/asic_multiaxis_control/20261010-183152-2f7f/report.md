# DSE run: asic_multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 40611 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10819 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 881 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 128 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 128 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 125 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.33 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.00017 (2^-12.53) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.1 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.25e-05 (2^-14.22) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.44 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 96.6 dBc, SNR 82.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (87) was simulated at its estimated Fmax (SimPy); 85 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=20,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=16,n_iter=15,angle_guard=4,frac_guard=2,rounding=round` | 0.3551 → 0.3625 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=3,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=4,rounding=round` | 0.3607 → 0.3684 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (22 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 40611 | 881 | 127.5 | 16 | 2.33 | 0.00017 (2^-12.53) | 12.53 |
| 1 | `pipelined:data_width=20,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 43162 | 936 | 127.5 | 16 | 2.48 | 0.000137 (2^-12.83) | 12.83 |
| 2 | `pipelined:data_width=16,n_iter=15,angle_guard=4,frac_guard=2,rounding=round` | 43619 | 923 | 132.4 | 17 | 2.46 | 0.000135 (2^-12.86) | 12.86 |
| 3 | `pipelined:data_width=17,n_iter=15,angle_guard=4,frac_guard=1,rounding=round` | 44443 | 942 | 127.5 | 17 | 2.51 | 0.000126 (2^-12.95) | 12.95 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 44494 | 942 | 137.6 | 17 | 2.51 | 0.000101 (2^-13.27) | 13.27 |
| 5 | `pipelined:data_width=20,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc` | 44988 | 973 | 132.4 | 17 | 2.58 | 9.65e-05 (2^-13.34) | 13.34 |
| 6 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 45179 | 957 | 132.4 | 17 | 2.55 | 9.31e-05 (2^-13.39) | 13.39 |
| 7 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 47641 | 1028 | 127.5 | 17 | 2.73 | 7.76e-05 (2^-13.65) | 13.65 |
| 8 | `pipelined:data_width=20,n_iter=15,angle_guard=4,frac_guard=0,rounding=round` | 48414 | 1047 | 115.0 | 17 | 2.78 | 7e-05 (2^-13.80) | 13.80 |
| 9 | `pipelined:data_width=20,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc` | 50200 | 1081 | 127.5 | 18 | 2.87 | 5.62e-05 (2^-14.12) | 14.12 |
| 10 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 51998 | 1099 | 127.5 | 18 | 2.94 | 4.05e-05 (2^-14.59) | 14.59 |
| 11 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 53678 | 1135 | 127.5 | 19 | 3.03 | 3.42e-05 (2^-14.83) | 14.83 |
| 12 | `pipelined:data_width=18,n_iter=17,angle_guard=4,frac_guard=4,rounding=round` | 57264 | 1206 | 123.1 | 19 | 3.23 | 2.69e-05 (2^-15.18) | 15.18 |
| 13 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=trunc` | 58341 | 1253 | 123.1 | 20 | 3.33 | 2.4e-05 (2^-15.35) | 15.35 |
| 14 | `pipelined:data_width=22,n_iter=18,angle_guard=1,frac_guard=0,rounding=trunc` | 60910 | 1310 | 118.9 | 20 | 3.48 | 1.6e-05 (2^-15.93) | 15.93 |
| 15 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 61476 | 1315 | 118.9 | 20 | 3.5 | 1.59e-05 (2^-15.94) | 15.94 |
| 16 | `pipelined:data_width=20,n_iter=19,angle_guard=2,frac_guard=1,rounding=round` | 62745 | 1324 | 123.1 | 21 | 3.54 | 1.51e-05 (2^-16.01) | 16.01 |
| 17 | `pipelined:data_width=20,n_iter=18,angle_guard=4,frac_guard=3,rounding=trunc` | 63130 | 1351 | 115.0 | 20 | 3.59 | 1.43e-05 (2^-16.09) | 16.09 |
| 18 | `pipelined:data_width=23,n_iter=19,angle_guard=0,frac_guard=2,rounding=round` | 70683 | 1488 | 111.3 | 21 | 3.98 | 6.1e-06 (2^-17.32) | 17.32 |
| 19 | `pipelined:data_width=21,n_iter=20,angle_guard=3,frac_guard=3,rounding=trunc` | 72219 | 1542 | 115.0 | 22 | 4.1 | 5.52e-06 (2^-17.47) | 17.47 |
| 20 | `pipelined:data_width=25,n_iter=20,angle_guard=-2,frac_guard=2,rounding=trunc` | 76917 | 1644 | 104.7 | 22 | 4.37 | 4.39e-06 (2^-17.80) | 17.80 |
| 21 | `pipelined:data_width=23,n_iter=20,angle_guard=4,frac_guard=4,rounding=round` | 81649 | 1717 | 104.7 | 22 | 4.59 | 2.3e-06 (2^-18.73) | 18.73 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are the burst ones: a 1 MHz tick drops 32 requests at once and all must return within 0.5 us, i.e. ~64 results/us instantaneous plus pipeline latency. That rules out iterative (1 result per N+3 cycles) and makes unrolled_k marginal, so the budget goes to the 1-result/cycle families. Accuracy needs max_abs_err <= 2^-12, so W must be at least ~14 (output LSB 2^-(W-2)) with N >= ~12 micro-rotations and rounding; I search W 13..20 and N 10..20 with angle/frac guards to trace the area-vs-accuracy front. pipelined_m (m=2..8) is expected to dominate the min-area end because it trades Fmax for far fewer flip-flops while keeping 1 result/cycle, and pipelined (m=1) covers the high-Fmax/high-accuracy corner. Round 1 is deliberately broad; later rounds will narrow onto whichever m and W/N region actually forms the feasible front.*)
- `pipelined_m` (50 evals): data_width=13..20, n_iter=10..20, angle_guard=0..4, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Only 1-result/cycle families can drain a 32-request burst inside 0.5 us; registering every m stages keeps that rate while cutting FF count, so this family should own the minimum-area corner of the front. m=2..8 spans the area/Fmax trade-off, and W/N/guards span the accuracy axis.
- `pipelined` (40 evals): data_width=13..20, n_iter=10..20, angle_guard=0..4, frac_guard=0..3, rounding=trunc|round. *Why:* Fully pipelined (m=1) gives the highest Fmax at 1 result/cycle, so it is the safe corner for the batch-latency bound and for the highest accuracy_bits; it also anchors the front where pipelined_m's long combinational paths would drop Fmax below what the 0.5 us batch needs.
- `unrolled_k` (10 evals): data_width=13..18, n_iter=10..20, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round, k=6..8. *Why:* Small probe only: k chained micro-rotations/cycle shares one datapath across cycles (potentially smallest area), but ceil(N/k)+3 cycles/result means the 32-request burst needs roughly 300+ MHz, so it is likely infeasible for sys_p99_batch_us and deserves only enough budget to confirm the boundary.

**Result (code):** 100 evaluations this round, 100 total; 22 feasible; hypervolume 1.963e+05 (n/a).

**LLM decision:** `map_front` — Every feasible design so far is `pipelined` (22/22); `unrolled_k` and `pipelined_m` produced 0 feasible designs, and the unexplored `iterative` family is structurally unable to satisfy the binding system constraint (N+3 cycles/result cannot drain a 32-request burst within 0.5 us, nor reach the 32 MSPS floor). The front is therefore a single-family front, and it covers only a narrow slice of the area objective (43.2k..63.1k against the 100k HV reference) while already sitting well above the accuracy reference (12.8..16.1 bits vs ref 12, constraint 2^-12). That accuracy headroom means the min-area corner the selection rule picks (43162 um^2 @ 12.8 bits) is not yet pushed to its limit: lower n_iter / smaller data_width with just-enough accuracy should shrink area further, and the upper end can still extend accuracy. Rather than narrow prematurely, spend this round letting NSGA-II map the full `pipelined` parameter ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, both roundings) seeded with the current front, so the whole trade-off curve — especially the min-area corner that selection uses — is covered before the reserved mapping budget is spent.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.963e+05 (gain this round: n/a (first round)).
Feasible designs: 22 of 100 evaluations (17 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 21% violate; best seen 163
- max_abs_err <= 0.000244141: 41% violate; best seen 1.3e-05 (2^-16.24)
- sys_p99_batch_us <= 0.5: 56% violate; best seen 0.295

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=20 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=43162, accuracy_bits=12.8, ffs=936, throughput_msps=128, max_abs_err=0.000137 (2^-12.83), power_index=2.48
- pipelined [data_width=17 n_iter=15 angle_guard=4 frac_guard=1 rounding=round] area_um2=44443, accuracy_bits=13, ffs=942, throughput_msps=128, max_abs_err=0.000126 (2^-12.95), power_index=2.51
- pipelined [data_width=20 n_iter=15 angle_guard=4 frac_guard=0 rounding=round] area_um2=48414, accuracy_bits=13.8, ffs=1047, throughput_msps=115, max_abs_err=7e-05 (2^-13.80), power_index=2.78
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=50200, accuracy_bits=14.1, ffs=1081, throughput_msps=128, max_abs_err=5.62e-05 (2^-14.12), power_index=2.87
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] area_um2=51998, accuracy_bits=14.6, ffs=1099, throughput_msps=128, max_abs_err=4.05e-05 (2^-14.59), power_index=2.94
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=56687, accuracy_bits=14.7, ffs=1217, throughput_msps=128, max_abs_err=3.75e-05 (2^-14.70), power_index=3.23
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=58341, accuracy_bits=15.3, ffs=1253, throughput_msps=123, max_abs_err=2.4e-05 (2^-15.35), power_index=3.33
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=61476, accuracy_bits=15.9, ffs=1315, throughput_msps=119, max_abs_err=1.59e-05 (2^-15.94), power_index=3.5
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=1 rounding=round] area_um2=62745, accuracy_bits=16, ffs=1324, throughput_msps=123, max_abs_err=1.51e-05 (2^-16.01), power_index=3.54
- pipelined [data_width=20 n_iter=18 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=63130, accuracy_bits=16.1, ffs=1351, throughput_msps=115, max_abs_err=1.43e-05 (2^-16.09), power_index=3.59
Front coverage: area_um2 43162..63130 (HV reference 100000); accuracy_bits 12.8..16.1 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 4.65 MSPS; best accuracy 12.49 bits
- pipelined: 40 evals, 22 feasible; max throughput seen 163 MSPS; best accuracy 16.09 bits; best feasible area_um2=43162; feasible ranges: data_width 17..20, n_iter 14..19, angle_guard 0..4, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 86.6 MSPS; best accuracy 16.24 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (50 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (10 front designs; box front_anchored)
- `pipelined_m` (50 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 100 evaluations this round, 200 total; 51 feasible; hypervolume 2.379e+05 (+21.2%).

**LLM decision:** `refine` — Round 2: HV 2.379e5 (+21.2%), 51/200 feasible, front all pipelined. Constraints are met by pipelined (throughput best 163, err best 2^-24, batch best 0.295 us) but the feasible front covers accuracy 12.8..17.8 while the constraint only requires 12 bits and the HV accuracy reference is 12 - so the low-accuracy/low-area corner is the highest-value unmapped region and is also where the min-area selection rule points. unrolled_k (0 feasible, 4.65 MSPS) and iterative (1 result per N+3 cycles) cannot satisfy the 32-requests-in-0.5 us batch constraint; pipelined_m is 1 result/cycle so its 0/100 is likely a sampling miss worth a targeted probe for register-driven area savings. Refine pipelined around data_width 16..21 / n_iter 12..17 and progress the best designs to L2 in the system simulation.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.379e+05 (gain this round: +21.2%).
Feasible designs: 51 of 200 evaluations (43 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 163
- max_abs_err <= 0.000244141: 32% violate; best seen 5.42e-08 (2^-24.14)
- sys_p99_batch_us <= 0.5: 60% violate; best seen 0.295

Pareto front (feasible, 15 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=20 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] area_um2=43162, accuracy_bits=12.8, ffs=936, throughput_msps=128, max_abs_err=0.000137 (2^-12.83), power_index=2.48
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] area_um2=44494, accuracy_bits=13.3, ffs=942, throughput_msps=138, max_abs_err=0.000101 (2^-13.27), power_index=2.51
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=45179, accuracy_bits=13.4, ffs=957, throughput_msps=132, max_abs_err=9.31e-05 (2^-13.39), power_index=2.55
- pipelined [data_width=20 n_iter=15 angle_guard=4 frac_guard=0 rounding=round] area_um2=48414, accuracy_bits=13.8, ffs=1047, throughput_msps=115, max_abs_err=7e-05 (2^-13.80), power_index=2.78
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=50200, accuracy_bits=14.1, ffs=1081, throughput_msps=128, max_abs_err=5.62e-05 (2^-14.12), power_index=2.87
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=56687, accuracy_bits=14.7, ffs=1217, throughput_msps=128, max_abs_err=3.75e-05 (2^-14.70), power_index=3.23
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=58341, accuracy_bits=15.3, ffs=1253, throughput_msps=123, max_abs_err=2.4e-05 (2^-15.35), power_index=3.33
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=61476, accuracy_bits=15.9, ffs=1315, throughput_msps=119, max_abs_err=1.59e-05 (2^-15.94), power_index=3.5
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=1 rounding=round] area_um2=62745, accuracy_bits=16, ffs=1324, throughput_msps=123, max_abs_err=1.51e-05 (2^-16.01), power_index=3.54
- pipelined [data_width=25 n_iter=20 angle_guard=-2 frac_guard=2 rounding=trunc] area_um2=76917, accuracy_bits=17.8, ffs=1644, throughput_msps=105, max_abs_err=4.39e-06 (2^-17.80), power_index=4.37
Front coverage: area_um2 43162..76917 (HV reference 100000); accuracy_bits 12.8..17.8 (HV reference 12); data_width on the front 17..25 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 4.65 MSPS; best accuracy 12.49 bits
- pipelined: 90 evals, 51 feasible; max throughput seen 163 MSPS; best accuracy 23.84 bits; best feasible area_um2=43162; feasible ranges: data_width 17..28, n_iter 13..24, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 100 evals, 0 feasible; max throughput seen 123 MSPS; best accuracy 24.14 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Front is 100% pipelined and its cheap end sits at accuracy_bits 12.8 / area 43162, but the error constraint only needs 12 bits (HV accuracy ref = 12). The band accuracy 12.0-12.8 is completely unmapped and, at the current cheap-end area, is worth roughly +0.8 * (100000-43162) ~= 45k HV - about the size of the whole gain last round. That is also exactly where the selection rule (min area_um2) lands, so mapping it serves both HV and the final pick. Search the small-datapath / small-n_iter corner of pipelined (data_width 16..21, n_iter 12..17) which the current front (data_width 17..25, n_iter 13..24) only bounds, and re-probe pipelined_m's register-sharing inside that window since it can cut FFs/area at the same accuracy and same 1-result/cycle throughput. Skip iterative/unrolled_k: neither can move 32 results inside the 0.5 us batch bound.*)
- `pipelined` (65 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* only family that has produced a feasible front (51 feasible designs, min area 43162); keep it dominated so the front keeps growing
- `pipelined_m` (25 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* 1 result/cycle like pipelined but registers every m stages -> fewer FFs, potentially lower area_um2 at a given accuracy; 0/100 feasible so far, likely because wide random ranges missed the narrow Fmax/batch window, so re-probe inside the pipelined feasible window
- `iterative` (5 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* the tick issues 32 requests at once and needs all back in 0.5 us; iterative emits one result every N+3 cycles, so 32 results cost >=32*(N+3) cycles, far over the 0.5 us batch bound - cannot reach the constraint
- `unrolled_k` (5 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* 0/10 feasible, best throughput only 4.65 MSPS vs the 32 MSPS floor and the burst requirement

**Result (code):** 100 evaluations this round, 300 total; 82 feasible; hypervolume 2.46e+05 (+3.4%).

**LLM decision:** `map_front` — The feasible front is entirely `pipelined` (82/155 evals feasible); `iterative` (max 10.7 MSPS) and `unrolled_k` (max 8.12 MSPS) cannot reach the 32 MSPS throughput constraint, and `pipelined_m` has 0 feasible despite 123 MSPS max, so it is being killed by the sys_p99_batch_us <= 0.5 bound. The front spans area 40611..76917 against an HV reference of 100000 and accuracy 12.5..17.8 against a reference of 12, but the low-area corner is likely under-mapped: data_width 16 is in the feasible range yet the cheapest front point uses data_width 17, and the selection rule is min area_um2, so the region below 40611 is the most valuable uncovered part of the curve. With 100 evals left in the final round, the reserved budget is best spent on a code-driven NSGA-II coverage search over the full pipelined ranges seeded with the current front, rather than narrowing around a region that is already dense (gain this round was only +3.4%).

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 2.46e+05 (gain this round: +3.4%).
Feasible designs: 82 of 300 evaluations (67 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 17% violate; best seen 190
- max_abs_err <= 0.000244141: 39% violate; best seen 5.42e-08 (2^-24.14)
- sys_p99_batch_us <= 0.5: 52% violate; best seen 0.2

Pareto front (feasible, 18 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=40611, accuracy_bits=12.5, ffs=881, throughput_msps=128, max_abs_err=0.00017 (2^-12.53), power_index=2.33
- pipelined [data_width=17 n_iter=15 angle_guard=4 frac_guard=1 rounding=round] area_um2=44443, accuracy_bits=13, ffs=942, throughput_msps=128, max_abs_err=0.000126 (2^-12.95), power_index=2.51
- pipelined [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=44988, accuracy_bits=13.3, ffs=973, throughput_msps=132, max_abs_err=9.65e-05 (2^-13.34), power_index=2.58
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=47641, accuracy_bits=13.7, ffs=1028, throughput_msps=128, max_abs_err=7.76e-05 (2^-13.65), power_index=2.73
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=50200, accuracy_bits=14.1, ffs=1081, throughput_msps=128, max_abs_err=5.62e-05 (2^-14.12), power_index=2.87
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=1 rounding=round] area_um2=51998, accuracy_bits=14.6, ffs=1099, throughput_msps=128, max_abs_err=4.05e-05 (2^-14.59), power_index=2.94
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=58341, accuracy_bits=15.3, ffs=1253, throughput_msps=123, max_abs_err=2.4e-05 (2^-15.35), power_index=3.33
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=61476, accuracy_bits=15.9, ffs=1315, throughput_msps=119, max_abs_err=1.59e-05 (2^-15.94), power_index=3.5
- pipelined [data_width=20 n_iter=18 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=63130, accuracy_bits=16.1, ffs=1351, throughput_msps=115, max_abs_err=1.43e-05 (2^-16.09), power_index=3.59
- pipelined [data_width=25 n_iter=20 angle_guard=-2 frac_guard=2 rounding=trunc] area_um2=76917, accuracy_bits=17.8, ffs=1644, throughput_msps=105, max_abs_err=4.39e-06 (2^-17.80), power_index=4.37
Front coverage: area_um2 40611..76917 (HV reference 100000); accuracy_bits 12.5..17.8 (HV reference 12); data_width on the front 17..25 (registry 8..28).

Per family:
- iterative: 5 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 17.93 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 8.12 MSPS; best accuracy 16.04 bits
- pipelined: 155 evals, 82 feasible; max throughput seen 190 MSPS; best accuracy 23.84 bits; best feasible area_um2=40611; feasible ranges: data_width 16..28, n_iter 13..27, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 125 evals, 0 feasible; max throughput seen 123 MSPS; best accuracy 24.14 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (50 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (18 front designs; box front_anchored)
- `pipelined_m` (50 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 100 evaluations this round, 400 total; 107 feasible; hypervolume 2.661e+05 (+8.2%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), so no further exploration is possible. The run is not infeasible: 107 of 400 evaluations are feasible (87 unique) and the feasible Pareto front holds 22 designs, so all three constraints are simultaneously satisfiable — throughput_msps best seen 190 (>= 32), max_abs_err best seen 5.42e-08 (<= 2.44e-04), sys_p99_batch_us best seen 0.2 us (<= 0.5 us). The front is well covered on both objectives: area_um2 spans 40611..81649 against the HV reference 100000, and accuracy_bits spans 12.5..18.7 against the HV reference 12, with hypervolume still improving (+8.2% this round) rather than plateauing. All four registry families were explored; only pipelined produced feasible designs (iterative 0/5, unrolled_k 0/15, pipelined_m 0/175 feasible), which is consistent with the 32 requests/us burst requirement favouring a 1-result/cycle architecture. The selection rule (min area_um2) picks the pipelined data_width=18 n_iter=14 angle_guard=3 frac_guard=0 rounding=round design at area_um2=40611, accuracy_bits=12.5, max_abs_err=1.7e-04 (2^-12.53), throughput_msps=128 — it meets the error bound with margin and its 128 MSPS throughput is 4x the 32 MSPS requirement, giving headroom for the L2 system simulation to confirm the 0.5 us p99 batch bound. Stopping here leaves the best mapped front for the spec's selection rule.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.661e+05 (gain this round: +8.2%).
Feasible designs: 107 of 400 evaluations (87 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 18% violate; best seen 190
- max_abs_err <= 0.000244141: 35% violate; best seen 5.42e-08 (2^-24.14)
- sys_p99_batch_us <= 0.5: 56% violate; best seen 0.2

Pareto front (feasible, 22 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=40611, accuracy_bits=12.5, ffs=881, throughput_msps=128, max_abs_err=0.00017 (2^-12.53), power_index=2.33
- pipelined [data_width=16 n_iter=15 angle_guard=4 frac_guard=2 rounding=round] area_um2=43619, accuracy_bits=12.9, ffs=923, throughput_msps=132, max_abs_err=0.000135 (2^-12.86), power_index=2.46
- pipelined [data_width=20 n_iter=15 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=44988, accuracy_bits=13.3, ffs=973, throughput_msps=132, max_abs_err=9.65e-05 (2^-13.34), power_index=2.58
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=47641, accuracy_bits=13.7, ffs=1028, throughput_msps=128, max_abs_err=7.76e-05 (2^-13.65), power_index=2.73
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=50200, accuracy_bits=14.1, ffs=1081, throughput_msps=128, max_abs_err=5.62e-05 (2^-14.12), power_index=2.87
- pipelined [data_width=18 n_iter=17 angle_guard=4 frac_guard=4 rounding=round] area_um2=57264, accuracy_bits=15.2, ffs=1206, throughput_msps=123, max_abs_err=2.69e-05 (2^-15.18), power_index=3.23
- pipelined [data_width=22 n_iter=18 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=60910, accuracy_bits=15.9, ffs=1310, throughput_msps=119, max_abs_err=1.6e-05 (2^-15.93), power_index=3.48
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=1 rounding=round] area_um2=62745, accuracy_bits=16, ffs=1324, throughput_msps=123, max_abs_err=1.51e-05 (2^-16.01), power_index=3.54
- pipelined [data_width=21 n_iter=20 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=72219, accuracy_bits=17.5, ffs=1542, throughput_msps=115, max_abs_err=5.52e-06 (2^-17.47), power_index=4.1
- pipelined [data_width=23 n_iter=20 angle_guard=4 frac_guard=4 rounding=round] area_um2=81649, accuracy_bits=18.7, ffs=1717, throughput_msps=105, max_abs_err=2.3e-06 (2^-18.73), power_index=4.59
Front coverage: area_um2 40611..81649 (HV reference 100000); accuracy_bits 12.5..18.7 (HV reference 12); data_width on the front 16..25 (registry 8..28).

Per family:
- iterative: 5 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 17.93 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 8.12 MSPS; best accuracy 16.04 bits
- pipelined: 205 evals, 107 feasible; max throughput seen 190 MSPS; best accuracy 23.84 bits; best feasible area_um2=40611; feasible ranges: data_width 16..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 175 evals, 0 feasible; max throughput seen 123 MSPS; best accuracy 24.14 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16930 in, 15879 out
- provider-reported cost: $0.0142
- full prompts and replies: `llm_trace.jsonl`

