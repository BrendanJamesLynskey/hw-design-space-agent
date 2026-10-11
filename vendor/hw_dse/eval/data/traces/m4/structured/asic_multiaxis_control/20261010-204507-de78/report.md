# DSE run: asic_multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 37422 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 9970 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 812 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 112 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.15 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000204 (2^-12.26) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.67 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 6.07e-05 (2^-14.01) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.99 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 9 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 94.9 dBc, SNR 81.6 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (131) was simulated at its estimated Fmax (SimPy); 122 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=2` | 0.4951 → 0.5076 | no |
| `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=2` | 0.4951 → 0.5076 | no |
| `pipelined:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 0.3213 → 0.3282 | yes |
| `pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round` | 0.3213 → 0.3282 | yes |

**WINNER CHANGED AT L2**: the L1 selection pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=2 fails the simulated system constraints (sys_p99_batch_us <= 0.5 by 1.5%); the best design that passes is pipelined:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round (rank 3 of 131 L1-feasible designs by the selection rule).

## L5 back-annotation: measured vs estimate

| tool | area µm² est → meas | FFs est → meas | Fmax MHz est → meas |
|---|---|---|---|
| measured (yosys+opensta yosys 0.33 + OpenSTA 3.1.0, sky130_fd_sc_hd, tt_025C_1v80) | 37422 → 37823 (+1.1%) | 812 → 798 (-1.7%) | 143 → 119 (-16.8%) |

Winner check (1 of 35 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on

## Pareto front (35 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,m=2` | 29151 | 439 | 78.8 | 9 | 1.33 | 0.000204 (2^-12.26) | 12.26 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=2` | 30990 | 453 | 78.8 | 9 | 1.39 | 0.000192 (2^-12.35) | 12.35 |
| 2 | `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 40192 | 870 | 143.2 | 17 | 2.31 | 0.000168 (2^-12.54) | 12.54 |
| 3 | `pipelined:data_width=18,n_iter=14,angle_guard=1,frac_guard=1,rounding=round` | 41487 | 879 | 137.6 | 16 | 2.35 | 0.00016 (2^-12.61) | 12.61 |
| 4 | `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 42388 | 898 | 143.2 | 17 | 2.4 | 0.000158 (2^-12.63) | 12.63 |
| 5 | `pipelined:data_width=17,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 42962 | 928 | 143.2 | 18 | 2.46 | 0.000149 (2^-12.71) | 12.71 |
| 6 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 43073 | 912 | 137.6 | 17 | 2.43 | 0.00013 (2^-12.91) | 12.91 |
| 7 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 43531 | 940 | 137.6 | 17 | 2.49 | 0.000127 (2^-12.95) | 12.95 |
| 8 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` | 44813 | 965 | 132.4 | 17 | 2.56 | 0.000102 (2^-13.26) | 13.26 |
| 9 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round` | 47147 | 997 | 127.5 | 17 | 2.66 | 8.22e-05 (2^-13.57) | 13.57 |
| 10 | `pipelined:data_width=18,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 47915 | 1030 | 132.4 | 18 | 2.74 | 8.08e-05 (2^-13.60) | 13.60 |
| 11 | `pipelined:data_width=18,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 48851 | 1053 | 132.4 | 19 | 2.79 | 7.75e-05 (2^-13.65) | 13.65 |
| 12 | `pipelined:data_width=22,n_iter=15,angle_guard=-1,frac_guard=0,rounding=trunc` | 49099 | 1062 | 123.1 | 17 | 2.81 | 7.06e-05 (2^-13.79) | 13.79 |
| 13 | `pipelined:data_width=21,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round` | 50287 | 1085 | 127.5 | 18 | 2.88 | 4.91e-05 (2^-14.31) | 14.31 |
| 14 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 51665 | 1113 | 123.1 | 18 | 2.95 | 4.27e-05 (2^-14.51) | 14.51 |
| 15 | `pipelined:data_width=19,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 53465 | 1150 | 132.4 | 20 | 3.05 | 4.26e-05 (2^-14.52) | 14.52 |
| 16 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc` | 53688 | 1152 | 118.9 | 18 | 3.06 | 4.08e-05 (2^-14.58) | 14.58 |
| 17 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 54420 | 1168 | 118.9 | 18 | 3.1 | 3.71e-05 (2^-14.72) | 14.72 |
| 18 | `pipelined:data_width=20,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc` | 55153 | 1184 | 118.9 | 18 | 3.15 | 3.59e-05 (2^-14.77) | 14.77 |
| 19 | `pipelined:data_width=19,n_iter=17,angle_guard=4,frac_guard=1,rounding=round` | 55238 | 1168 | 118.9 | 19 | 3.12 | 3.33e-05 (2^-14.87) | 14.87 |
| 20 | `pipelined:data_width=23,n_iter=16,angle_guard=0,frac_guard=0,rounding=trunc` | 55414 | 1195 | 118.9 | 18 | 3.17 | 3.32e-05 (2^-14.88) | 14.88 |
| 21 | `pipelined:data_width=23,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 56147 | 1211 | 115.0 | 18 | 3.21 | 3.16e-05 (2^-14.95) | 14.95 |
| 22 | `pipelined:data_width=21,n_iter=17,angle_guard=4,frac_guard=0,rounding=trunc` | 57430 | 1237 | 111.3 | 19 | 3.28 | 3.12e-05 (2^-14.97) | 14.97 |
| 23 | `pipelined:data_width=19,n_iter=17,angle_guard=4,frac_guard=3,rounding=round` | 58183 | 1227 | 118.9 | 19 | 3.28 | 2.19e-05 (2^-15.48) | 15.48 |
| 24 | `pipelined:data_width=22,n_iter=17,angle_guard=4,frac_guard=1,rounding=trunc` | 61242 | 1316 | 107.9 | 19 | 3.5 | 1.83e-05 (2^-15.74) | 15.74 |
| 25 | `pipelined:data_width=20,n_iter=18,angle_guard=3,frac_guard=3,rounding=trunc` | 62303 | 1333 | 118.9 | 20 | 3.55 | 1.43e-05 (2^-16.10) | 16.10 |
| 26 | `pipelined:data_width=22,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc` | 64045 | 1372 | 115.0 | 20 | 3.65 | 1.1e-05 (2^-16.48) | 16.48 |
| 27 | `pipelined:data_width=20,n_iter=19,angle_guard=3,frac_guard=3,rounding=trunc` | 65878 | 1408 | 118.9 | 21 | 3.75 | 1.07e-05 (2^-16.51) | 16.51 |
| 28 | `pipelined:data_width=23,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc` | 66527 | 1426 | 111.3 | 20 | 3.79 | 9.56e-06 (2^-16.67) | 16.67 |
| 29 | `pipelined:data_width=22,n_iter=20,angle_guard=1,frac_guard=0,rounding=round` | 67871 | 1455 | 118.9 | 22 | 3.87 | 6.49e-06 (2^-17.23) | 17.23 |
| 30 | `pipelined:data_width=22,n_iter=19,angle_guard=2,frac_guard=3,rounding=trunc` | 70251 | 1501 | 111.3 | 21 | 3.99 | 6.24e-06 (2^-17.29) | 17.29 |
| 31 | `pipelined:data_width=22,n_iter=19,angle_guard=2,frac_guard=3,rounding=round` | 71419 | 1503 | 111.3 | 21 | 4.02 | 5.47e-06 (2^-17.48) | 17.48 |
| 32 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=3,rounding=trunc` | 74985 | 1601 | 111.3 | 22 | 4.26 | 3.59e-06 (2^-18.09) | 18.09 |
| 33 | `pipelined:data_width=25,n_iter=20,angle_guard=-1,frac_guard=1,rounding=round` | 77403 | 1630 | 107.9 | 22 | 4.36 | 3.39e-06 (2^-18.17) | 18.17 |
| 34 | `pipelined:data_width=21,n_iter=22,angle_guard=4,frac_guard=3,rounding=round` | 81788 | 1720 | 111.3 | 24 | 4.6 | 2.53e-06 (2^-18.59) | 18.59 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 32 results must complete within 0.5 us of the tick, and throughput must be at least 32 Msps. That points to 1 result/cycle designs, or heavily unrolled ones. Error of at most 2^-12 needs data_width of about 14 or more with n_iter of about 12 to 15 and some guard bits. I use ranges slightly wider than the minimum so the accuracy-bits objective gets front coverage. Most of the budget goes to pipelined_m, and unrolled_k is included to test whether it can be feasible. Later rounds will narrow the ranges around the cheapest feasible designs.*)
- `pipelined_m` (50 evals): data_width=13..20, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..6. *Why:* Fewer pipeline registers than a full pipeline means less area. The 1 result/cycle rate should still finish a 32-request burst within 0.5 us if Fmax is about 100 MHz or more, so this is the most likely area-minimal feasible family.
- `pipelined` (25 evals): data_width=13..20, n_iter=11..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* This is the highest-Fmax option at 1 result/cycle. It is a safe feasible baseline and anchors the high-accuracy end of the front, though it costs more registers.
- `unrolled_k` (25 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Large k cuts cycles per result to about 5, which could meet the burst deadline with less register area than a pipeline. It is a risky but plausible area winner, so it gets a modest share to test whether it is feasible. Iterative is skipped because N+3 cycles per result cannot reach 32 results/us at realistic Fmax.

**Result (code):** 100 evaluations this round, 100 total; 7 feasible; hypervolume 1.406e+05 (n/a).

**LLM decision:** `refine` — Only pipelined has feasible designs (7 of 25 evals; front area 45805..56736, 12.5..14.8 bits). unrolled_k reached at most 6.51 MSPS and has 0 feasible, so it cannot meet the 32 MSPS and 0.5 us batch constraints. Iterative produces a result only every N+3 cycles, so it is even slower and I am not exploring it. pipelined_m reached 82.5 MSPS but had 0 feasible in 50 evals, probably because a large m lowers Fmax and the 32-result batch then misses 0.5 us. Small m might fit and save registers, so I keep it at m=2..3. The front's cheapest point already meets 2^-12 with 0.5 bits to spare, so the lower-area region is unexplored. I will narrow to smaller data_width and n_iter around the feasible region and keep a share for pipelined_m with small m.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.406e+05 (gain this round: n/a (first round)).
Feasible designs: 7 of 100 evaluations (7 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 35% violate; best seen 163
- max_abs_err <= 0.000244141: 70% violate; best seen 3.35e-05 (2^-14.87)
- sys_p99_batch_us <= 0.5: 67% violate; best seen 0.263

Pareto front (feasible, 4 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=45805, accuracy_bits=12.5, ffs=987, throughput_msps=132, max_abs_err=0.00017 (2^-12.52), power_index=2.62
- pipelined [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=47362, accuracy_bits=13.5, ffs=1001, throughput_msps=138, max_abs_err=8.59e-05 (2^-13.51), power_index=2.67
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=round] area_um2=51265, accuracy_bits=14.3, ffs=1083, throughput_msps=128, max_abs_err=5.03e-05 (2^-14.28), power_index=2.89
- pipelined [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round] area_um2=56736, accuracy_bits=14.8, ffs=1197, throughput_msps=128, max_abs_err=3.49e-05 (2^-14.81), power_index=3.2
Front coverage: area_um2 45805..56736 (HV reference 100000); accuracy_bits 12.5..14.8 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 25 evals, 0 feasible; max throughput seen 6.51 MSPS; best accuracy 12.54 bits
- pipelined: 25 evals, 7 feasible; max throughput seen 163 MSPS; best accuracy 14.81 bits; best feasible area_um2=45805; feasible ranges: data_width 17..20, n_iter 16..18, angle_guard 0..3, frac_guard 1..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 82.5 MSPS; best accuracy 14.87 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined and low-m pipelined_m at lower widths and iteration counts, where area is lowest and accuracy is still at least 12 bits.*)
- `pipelined` (60 evals): data_width=13..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* The feasible region is data_width 17..20 and n_iter 16..18. Probing smaller widths and iteration counts looks for cheaper designs that still meet 2^-12.
- `pipelined_m` (40 evals): data_width=13..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round, m=2..3. *Why:* Small m keeps Fmax high enough for the 0.5 us batch bound and removes pipeline registers, which could lower area.

**Result (code):** 100 evaluations this round, 200 total; 38 feasible; hypervolume 1.503e+05 (+6.9%).

**LLM decision:** `refine` — Iterative is not worth exploring. It takes N+3 cycles per result, and unrolled_k already peaked at 6.51 MSPS with 0 feasible designs out of 25. Both fall well short of the 32 MSPS floor and the 32-results-in-0.5us batch bound. Only the pipelined families are feasible. The cheapest feasible design is pipelined_m at m=2 (29151 um2, 12.3 bits), and pipelined_m has only 7 feasible of 90 evaluations, all clustered at data_width 17, n_iter 14, m 2. The region around that corner is under-sampled, so I will refine it. I will test m 2..4 and slightly smaller width and iteration counts against the 2^-12 error limit and the batch-time bound. I will also keep a pipelined slice for the higher-accuracy end of the front (up to 14.8 bits).

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.503e+05 (gain this round: +6.9%).
Feasible designs: 38 of 200 evaluations (29 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 18% violate; best seen 171
- max_abs_err <= 0.000244141: 60% violate; best seen 3.35e-05 (2^-14.87)
- sys_p99_batch_us <= 0.5: 46% violate; best seen 0.263

Pareto front (feasible, 12 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=2] area_um2=29151, accuracy_bits=12.3, ffs=439, throughput_msps=78.8, max_abs_err=0.000204 (2^-12.26), power_index=1.33
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=2] area_um2=30990, accuracy_bits=12.3, ffs=453, throughput_msps=78.8, max_abs_err=0.000192 (2^-12.35), power_index=1.39
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=40192, accuracy_bits=12.5, ffs=870, throughput_msps=143, max_abs_err=0.000168 (2^-12.54), power_index=2.31
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=42962, accuracy_bits=12.7, ffs=928, throughput_msps=143, max_abs_err=0.000149 (2^-12.71), power_index=2.46
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=43073, accuracy_bits=12.9, ffs=912, throughput_msps=138, max_abs_err=0.00013 (2^-12.91), power_index=2.43
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=43531, accuracy_bits=12.9, ffs=940, throughput_msps=138, max_abs_err=0.000127 (2^-12.95), power_index=2.49
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=44813, accuracy_bits=13.3, ffs=965, throughput_msps=132, max_abs_err=0.000102 (2^-13.26), power_index=2.56
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=47915, accuracy_bits=13.6, ffs=1030, throughput_msps=132, max_abs_err=8.08e-05 (2^-13.60), power_index=2.74
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=round] area_um2=51265, accuracy_bits=14.3, ffs=1083, throughput_msps=128, max_abs_err=5.03e-05 (2^-14.28), power_index=2.89
- pipelined [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round] area_um2=56736, accuracy_bits=14.8, ffs=1197, throughput_msps=128, max_abs_err=3.49e-05 (2^-14.81), power_index=3.2
Front coverage: area_um2 29151..56736 (HV reference 100000); accuracy_bits 12.3..14.8 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 25 evals, 0 feasible; max throughput seen 6.51 MSPS; best accuracy 12.54 bits
- pipelined: 85 evals, 31 feasible; max throughput seen 171 MSPS; best accuracy 14.81 bits; best feasible area_um2=37422; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 90 evals, 7 feasible; max throughput seen 96.1 MSPS; best accuracy 14.87 bits; best feasible area_um2=29151; feasible ranges: data_width 17..17, n_iter 14..14, angle_guard 1..1, frac_guard 0..1, m 2..2
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the low-area pipelined_m corner and on m values beyond 2, while keeping a smaller pipelined slice for the high-accuracy end of the front.*)
- `pipelined_m` (27 evals): data_width=15..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=round|trunc, m=2..4. *Why:* The minimum-area design lives here. Fewer registers than fully pipelined cuts area, and the m=2 results suggest m=3..4 might cut it further if Fmax still meets the batch bound.
- `pipelined` (13 evals): data_width=16..20, n_iter=14..18, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* All 31 feasible pipelined designs sit in these ranges. This keeps the front covered at higher accuracy, where its designs reach 14.8 bits.

**Result (code):** 40 evaluations this round, 240 total; 47 feasible; hypervolume 1.514e+05 (+0.7%).

**LLM decision:** `stop` — This is the final round, so stop. The front is feasible and has 15 designs. It spans area 29151 to 56736 um2 and accuracy 12.3 to 14.8 bits, and the last round added only +0.7% hypervolume, which is below the 1% epsilon. The cheapest feasible design is pipelined_m (data_width=17, n_iter=14, m=2) at 29151 um2. It has 78.8 MSPS throughput and max error 2^-12.26, so it meets all three constraints in the L1 bound. The unrolled_k family had 0 feasible designs out of 25 evaluations, with a maximum throughput of 6.51 MSPS. That is far below the 32 MSPS requirement, so it cannot meet the batch deadline either. The iterative family was not explored. An N+3 cycle iterative design cannot be expected to pass either, because it accepts one request every several cycles and queues the 32-request burst, which the unrolled_k results already show.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.514e+05 (gain this round: +0.7%).
Feasible designs: 47 of 240 evaluations (38 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 15% violate; best seen 171
- max_abs_err <= 0.000244141: 58% violate; best seen 3.35e-05 (2^-14.87)
- sys_p99_batch_us <= 0.5: 48% violate; best seen 0.263

Pareto front (feasible, 15 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=2] area_um2=29151, accuracy_bits=12.3, ffs=439, throughput_msps=78.8, max_abs_err=0.000204 (2^-12.26), power_index=1.33
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=40192, accuracy_bits=12.5, ffs=870, throughput_msps=143, max_abs_err=0.000168 (2^-12.54), power_index=2.31
- pipelined [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round] area_um2=41487, accuracy_bits=12.6, ffs=879, throughput_msps=138, max_abs_err=0.00016 (2^-12.61), power_index=2.35
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=42962, accuracy_bits=12.7, ffs=928, throughput_msps=143, max_abs_err=0.000149 (2^-12.71), power_index=2.46
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=43073, accuracy_bits=12.9, ffs=912, throughput_msps=138, max_abs_err=0.00013 (2^-12.91), power_index=2.43
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=44813, accuracy_bits=13.3, ffs=965, throughput_msps=132, max_abs_err=0.000102 (2^-13.26), power_index=2.56
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] area_um2=47147, accuracy_bits=13.6, ffs=997, throughput_msps=128, max_abs_err=8.22e-05 (2^-13.57), power_index=2.66
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=48851, accuracy_bits=13.7, ffs=1053, throughput_msps=132, max_abs_err=7.75e-05 (2^-13.65), power_index=2.79
- pipelined [data_width=20 n_iter=16 angle_guard=0 frac_guard=1 rounding=round] area_um2=51265, accuracy_bits=14.3, ffs=1083, throughput_msps=128, max_abs_err=5.03e-05 (2^-14.28), power_index=2.89
- pipelined [data_width=18 n_iter=18 angle_guard=3 frac_guard=2 rounding=round] area_um2=56736, accuracy_bits=14.8, ffs=1197, throughput_msps=128, max_abs_err=3.49e-05 (2^-14.81), power_index=3.2
Front coverage: area_um2 29151..56736 (HV reference 100000); accuracy_bits 12.3..14.8 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- unrolled_k: 25 evals, 0 feasible; max throughput seen 6.51 MSPS; best accuracy 12.54 bits
- pipelined: 98 evals, 40 feasible; max throughput seen 171 MSPS; best accuracy 14.81 bits; best feasible area_um2=37422; feasible ranges: data_width 16..20, n_iter 14..18, angle_guard 0..3, frac_guard 0..2
- pipelined_m: 117 evals, 7 feasible; max throughput seen 96.1 MSPS; best accuracy 14.87 bits; best feasible area_um2=29151; feasible ranges: data_width 17..17, n_iter 14..14, angle_guard 1..1, frac_guard 0..1, m 2..2
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (22 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (2 front designs; box front_anchored)
- `pipelined` (138 evals): data_width=16..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (13 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 151 feasible; hypervolume 2.754e+05 (+82.0%).

**No LLM call** (code's front-mapping round): This is the final round, so stop. The front is feasible and has 15 designs. It spans area 29151 to 56736 um2 and accuracy 12.3 to 14.8 bits, and the last round added only +0.7% hypervolume, which is below the 1% epsilon. The cheapest feasible design is pipelined_m (data_width=17, n_iter=14, m=2) at 29151 um2. It has 78.8 MSPS throughput and max error 2^-12.26, so it meets all three constraints in the L1 bound. The unrolled_k family had 0 feasible designs out of 25 evaluations, with a maximum throughput of 6.51 MSPS. That is far below the 32 MSPS requirement, so it cannot meet the batch deadline either. The iterative family was not explored. An N+3 cycle iterative design cannot be expected to pass either, because it accepts one request every several cycles and queues the 32-request burst, which the unrolled_k results already show.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.754e+05 (gain this round: +82.0%).
Feasible designs: 151 of 400 evaluations (131 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 12% violate; best seen 171
- max_abs_err <= 0.000244141: 37% violate; best seen 1.77e-08 (2^-25.75)
- sys_p99_batch_us <= 0.5: 42% violate; best seen 0.263

Pareto front (feasible, 35 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=0 rounding=round m=2] area_um2=29151, accuracy_bits=12.3, ffs=439, throughput_msps=78.8, max_abs_err=0.000204 (2^-12.26), power_index=1.33
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] area_um2=42388, accuracy_bits=12.6, ffs=898, throughput_msps=143, max_abs_err=0.000158 (2^-12.63), power_index=2.4
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=44813, accuracy_bits=13.3, ffs=965, throughput_msps=132, max_abs_err=0.000102 (2^-13.26), power_index=2.56
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=48851, accuracy_bits=13.7, ffs=1053, throughput_msps=132, max_abs_err=7.75e-05 (2^-13.65), power_index=2.79
- pipelined [data_width=19 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] area_um2=53465, accuracy_bits=14.5, ffs=1150, throughput_msps=132, max_abs_err=4.26e-05 (2^-14.52), power_index=3.05
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=1 rounding=round] area_um2=55238, accuracy_bits=14.9, ffs=1168, throughput_msps=119, max_abs_err=3.33e-05 (2^-14.87), power_index=3.12
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=round] area_um2=58183, accuracy_bits=15.5, ffs=1227, throughput_msps=119, max_abs_err=2.19e-05 (2^-15.48), power_index=3.28
- pipelined [data_width=22 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=64045, accuracy_bits=16.5, ffs=1372, throughput_msps=115, max_abs_err=1.1e-05 (2^-16.48), power_index=3.65
- pipelined [data_width=22 n_iter=19 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=70251, accuracy_bits=17.3, ffs=1501, throughput_msps=111, max_abs_err=6.24e-06 (2^-17.29), power_index=3.99
- pipelined [data_width=21 n_iter=22 angle_guard=4 frac_guard=3 rounding=round] area_um2=81788, accuracy_bits=18.6, ffs=1720, throughput_msps=111, max_abs_err=2.53e-06 (2^-18.59), power_index=4.6
Front coverage: area_um2 29151..81788 (HV reference 100000); accuracy_bits 12.3..18.6 (HV reference 12); data_width on the front 17..25 (registry 8..28).

Per family:
- unrolled_k: 25 evals, 0 feasible; max throughput seen 6.51 MSPS; best accuracy 12.54 bits
- pipelined: 236 evals, 144 feasible; max throughput seen 171 MSPS; best accuracy 25.75 bits; best feasible area_um2=37422; feasible ranges: data_width 16..27, n_iter 14..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 139 evals, 7 feasible; max throughput seen 96.1 MSPS; best accuracy 24.67 bits; best feasible area_um2=29151; feasible ranges: data_width 17..17, n_iter 14..14, angle_guard 1..1, frac_guard 0..1, m 2..2
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 22498 in, 4652 out
- provider-reported cost: $0.0915
- full prompts and replies: `llm_trace.jsonl`

