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
`pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 38698 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10310 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 840 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 121 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.22 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000192 (2^-12.35) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.28 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 6.01e-05 (2^-14.02) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.97 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 96.0 dBc, SNR 81.7 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (88) was simulated at its estimated Fmax (SimPy); 85 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=3,rounding=trunc` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=1,frac_guard=2,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=2,rounding=trunc` | 0.3475 → 0.355 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (27 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 38698 | 840 | 132.4 | 16 | 2.22 | 0.000192 (2^-12.35) | 12.35 |
| 1 | `pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 40611 | 881 | 127.5 | 16 | 2.33 | 0.00017 (2^-12.53) | 12.53 |
| 2 | `pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=1,rounding=trunc` | 41799 | 904 | 127.5 | 16 | 2.4 | 0.000166 (2^-12.55) | 12.55 |
| 3 | `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=2,rounding=round` | 41987 | 889 | 132.4 | 16 | 2.37 | 0.000152 (2^-12.68) | 12.68 |
| 4 | `pipelined:data_width=17,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 42962 | 928 | 143.2 | 18 | 2.46 | 0.000149 (2^-12.71) | 12.71 |
| 5 | `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=3,rounding=round` | 43175 | 912 | 132.4 | 16 | 2.44 | 0.000148 (2^-12.73) | 12.73 |
| 6 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 43618 | 944 | 127.5 | 17 | 2.5 | 0.000119 (2^-13.04) | 13.04 |
| 7 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 44216 | 955 | 132.4 | 17 | 2.53 | 0.000118 (2^-13.05) | 13.05 |
| 8 | `pipelined:data_width=16,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 45846 | 969 | 137.6 | 18 | 2.59 | 0.000117 (2^-13.06) | 13.06 |
| 9 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=1,rounding=round` | 45864 | 971 | 127.5 | 17 | 2.59 | 8.97e-05 (2^-13.44) | 13.44 |
| 10 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 45892 | 991 | 132.4 | 18 | 2.63 | 8.35e-05 (2^-13.55) | 13.55 |
| 11 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=round` | 47745 | 1008 | 127.5 | 17 | 2.69 | 8.08e-05 (2^-13.60) | 13.60 |
| 12 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 48095 | 1017 | 132.4 | 18 | 2.71 | 6.9e-05 (2^-13.82) | 13.82 |
| 13 | `pipelined:data_width=21,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 49099 | 1062 | 118.9 | 17 | 2.81 | 6.66e-05 (2^-13.87) | 13.87 |
| 14 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 49611 | 1048 | 132.4 | 18 | 2.8 | 5.46e-05 (2^-14.16) | 14.16 |
| 15 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc` | 50758 | 1089 | 127.5 | 18 | 2.89 | 5.44e-05 (2^-14.17) | 14.17 |
| 16 | `pipelined:data_width=18,n_iter=17,angle_guard=3,frac_guard=3,rounding=round` | 55012 | 1160 | 127.5 | 19 | 3.1 | 3.11e-05 (2^-14.97) | 14.97 |
| 17 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc` | 57948 | 1242 | 118.9 | 19 | 3.3 | 2.35e-05 (2^-15.38) | 15.38 |
| 18 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=3,rounding=trunc` | 60288 | 1292 | 115.0 | 19 | 3.43 | 1.85e-05 (2^-15.72) | 15.72 |
| 19 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=4,rounding=trunc` | 61760 | 1321 | 111.3 | 19 | 3.51 | 1.83e-05 (2^-15.74) | 15.74 |
| 20 | `pipelined:data_width=21,n_iter=17,angle_guard=4,frac_guard=3,rounding=trunc` | 61847 | 1325 | 111.3 | 19 | 3.52 | 1.79e-05 (2^-15.77) | 15.77 |
| 21 | `pipelined:data_width=24,n_iter=17,angle_guard=4,frac_guard=0,rounding=round` | 64449 | 1387 | 101.6 | 19 | 3.68 | 1.58e-05 (2^-15.95) | 15.95 |
| 22 | `pipelined:data_width=24,n_iter=18,angle_guard=0,frac_guard=0,rounding=trunc` | 65047 | 1398 | 115.0 | 20 | 3.71 | 9.68e-06 (2^-16.66) | 16.66 |
| 23 | `pipelined:data_width=24,n_iter=18,angle_guard=2,frac_guard=0,rounding=trunc` | 66701 | 1433 | 107.9 | 20 | 3.81 | 9.16e-06 (2^-16.74) | 16.74 |
| 24 | `pipelined:data_width=20,n_iter=20,angle_guard=4,frac_guard=4,rounding=round` | 73198 | 1540 | 115.0 | 22 | 4.12 | 5.46e-06 (2^-17.48) | 17.48 |
| 25 | `pipelined:data_width=23,n_iter=19,angle_guard=3,frac_guard=4,rounding=round` | 76631 | 1611 | 104.7 | 21 | 4.31 | 4.27e-06 (2^-17.84) | 17.84 |
| 26 | `pipelined:data_width=23,n_iter=20,angle_guard=4,frac_guard=4,rounding=trunc` | 80430 | 1715 | 104.7 | 22 | 4.57 | 2.46e-06 (2^-18.63) | 18.63 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The tick issues 32 requests at once and all results are due within 0.5 us. That means roughly 64+ results/us effective, which rules out the iterative family at N+3 cycles/result. The accuracy bound of 2^-12 needs about 13-14 fractional output bits, so data_width 12-18 and n_iter 10-18 with small guard bits cover the feasible region and the accuracy/area trade-off. Most of the budget goes to the pipelined families, with a small probe of unrolled_k.*)
- `pipelined_m` (40 evals): data_width=12..18, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registers only every m stages, so it uses fewer FFs and less area than a full pipeline. It still accepts 1 result/cycle, so the 32-request burst drains quickly. A small m keeps Fmax high and latency low.
- `pipelined` (40 evals): data_width=12..18, n_iter=10..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* 1 result/cycle at the highest Fmax; the burst takes about 32 plus N+2 cycles. It is the safest family for the 0.5 us batch bound, though it costs the most FFs.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* A cheap probe of whether a high-k shared datapath can get 32 results out in 0.5 us while saving area. It needs roughly 64+ Msps effective, so it is a long shot. The high-k range is the only place it could work.

**Result (code):** 100 evaluations this round, 100 total; 16 feasible; hypervolume 1.155e+05 (n/a).

**LLM decision:** `refine` — Only pipelined is feasible so far (16 of 40 evals). unrolled_k peaks at 7.15 MSPS and so cannot deliver 32 results in 0.5 us. iterative is even slower per result, so I am not spending budget on it. pipelined_m reached 96 MSPS and 14.29 accuracy bits but had 0 feasible designs, most likely from the batch-latency bound or the error limit. At small m it has fewer FFs than pipelined, so it could still lower area if it passes sys_p99_batch_us <= 0.5. The pipelined front sits at data_width 18, area 40.6k-50.8k, with feasible data_width 16..18 and n_iter 14..17. I will narrow to data_width 15..18 and n_iter 12..17 to look for smaller-area designs that still meet 2^-12, and test pipelined_m with m=2..4.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.155e+05 (gain this round: n/a (first round)).
Feasible designs: 16 of 100 evaluations (14 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 171
- max_abs_err <= 0.000244141: 70% violate; best seen 4.98e-05 (2^-14.29)
- sys_p99_batch_us <= 0.5: 56% violate; best seen 0.276

Pareto front (feasible, 6 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=40611, accuracy_bits=12.5, ffs=881, throughput_msps=128, max_abs_err=0.00017 (2^-12.53), power_index=2.33
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=41799, accuracy_bits=12.6, ffs=904, throughput_msps=128, max_abs_err=0.000166 (2^-12.55), power_index=2.4
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=42845, accuracy_bits=12.6, ffs=925, throughput_msps=138, max_abs_err=0.00016 (2^-12.61), power_index=2.45
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=46537, accuracy_bits=13.2, ffs=1003, throughput_msps=138, max_abs_err=0.000104 (2^-13.23), power_index=2.66
- pipelined [data_width=18 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=50507, accuracy_bits=13.8, ffs=1068, throughput_msps=138, max_abs_err=6.89e-05 (2^-13.83), power_index=2.85
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=50758, accuracy_bits=14.2, ffs=1089, throughput_msps=128, max_abs_err=5.44e-05 (2^-14.17), power_index=2.89
Front coverage: area_um2 40611..50758 (HV reference 100000); accuracy_bits 12.5..14.2 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.15 MSPS; best accuracy 10.48 bits
- pipelined: 40 evals, 16 feasible; max throughput seen 171 MSPS; best accuracy 14.17 bits; best feasible area_um2=40611; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 40 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 14.29 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the next round on the region where feasibility was found. Test whether pipelined_m with small m can beat the pipelined area.*)
- `pipelined` (58 evals): data_width=15..18, n_iter=12..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* This is the only family with feasible designs. Narrower, lower width and iteration counts target smaller area while keeping error below 2^-12.
- `pipelined_m` (42 evals): data_width=15..18, n_iter=12..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Fewer pipeline registers could cut area. Small m keeps the clock fast enough that 32 results plus latency fit inside 0.5 us.

**Result (code):** 100 evaluations this round, 200 total; 56 feasible; hypervolume 1.555e+05 (+34.7%).

**LLM decision:** `refine` — Every feasible design so far is pipelined (56 of 98 evals). The front spans area 40611..55012 um2 and accuracy 12.5..15 bits. The cheapest feasible point is 40611 um2 at 12.5 bits, which leaves headroom over the 12-bit floor, so lower-area designs near the error limit are worth probing. Iterative is not worth exploring: unrolled_k peaked at 7.15 MSPS against the 32 MSPS requirement, and iterative needs N+3 cycles per result, so it would be slower still. pipelined_m had 0 feasible designs in 82 evals, but it reached 96 MSPS and 14.37 bits. It probably fails on the sys_p99_batch bound or on throughput at large m, and a small m of 2-3 would save pipeline registers and area, so it gets a small share of the budget. Pipelined feasibility is concentrated at data_width 16..18 and n_iter 14..17, so I will narrow there, extending slightly lower in width and iterations to reach the 12-12.5 bit, lower-area corner.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.555e+05 (gain this round: +34.7%).
Feasible designs: 56 of 200 evaluations (46 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 10% violate; best seen 171
- max_abs_err <= 0.000244141: 52% violate; best seen 3.11e-05 (2^-14.97)
- sys_p99_batch_us <= 0.5: 48% violate; best seen 0.276

Pareto front (feasible, 14 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=40611, accuracy_bits=12.5, ffs=881, throughput_msps=128, max_abs_err=0.00017 (2^-12.53), power_index=2.33
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=41799, accuracy_bits=12.6, ffs=904, throughput_msps=128, max_abs_err=0.000166 (2^-12.55), power_index=2.4
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] area_um2=42962, accuracy_bits=12.7, ffs=928, throughput_msps=143, max_abs_err=0.000149 (2^-12.71), power_index=2.46
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] area_um2=43618, accuracy_bits=13, ffs=944, throughput_msps=128, max_abs_err=0.000119 (2^-13.04), power_index=2.5
- pipelined [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=45846, accuracy_bits=13.1, ffs=969, throughput_msps=138, max_abs_err=0.000117 (2^-13.06), power_index=2.59
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=45864, accuracy_bits=13.4, ffs=971, throughput_msps=128, max_abs_err=8.97e-05 (2^-13.44), power_index=2.59
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=47745, accuracy_bits=13.6, ffs=1008, throughput_msps=128, max_abs_err=8.08e-05 (2^-13.60), power_index=2.69
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=48430, accuracy_bits=13.7, ffs=1022, throughput_msps=128, max_abs_err=7.32e-05 (2^-13.74), power_index=2.73
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=50758, accuracy_bits=14.2, ffs=1089, throughput_msps=128, max_abs_err=5.44e-05 (2^-14.17), power_index=2.89
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] area_um2=55012, accuracy_bits=15, ffs=1160, throughput_msps=128, max_abs_err=3.11e-05 (2^-14.97), power_index=3.1
Front coverage: area_um2 40611..55012 (HV reference 100000); accuracy_bits 12.5..15 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.15 MSPS; best accuracy 10.48 bits
- pipelined: 98 evals, 56 feasible; max throughput seen 171 MSPS; best accuracy 14.97 bits; best feasible area_um2=40611; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 82 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 14.37 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the pipelined region that has proven feasible, extending slightly lower in width and iterations to reduce area toward the 12-bit accuracy floor, and test small-m pipelined_m once more.*)
- `pipelined` (30 evals): data_width=14..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=round|trunc. *Why:* All feasible designs come from this family; the search targets the lowest-area designs that still meet 2^-12 error, plus the nearby front.
- `pipelined_m` (10 evals): data_width=14..18, n_iter=12..17, angle_guard=0..3, frac_guard=0..3, rounding=round|trunc, m=2..3. *Why:* Small m reduces pipeline registers and may cut area while keeping throughput and the batch-latency bound, so one more try at feasibility is justified.

**Result (code):** 40 evaluations this round, 240 total; 73 feasible; hypervolume 1.565e+05 (+0.6%).

**LLM decision:** `stop` — This is the final round, so stop. The feasible front has 16 designs, all pipelined, spanning area 38698..55012 um2 and accuracy 12.3..15 bits. Round 3 added only +0.6% hypervolume, below the 1% eps, so the search has converged. The cheapest feasible design is pipelined W=17, N=14, angle_guard=3, frac_guard=0, round. It has max_abs_err 1.92e-4 (below 2.44e-4), throughput 132 MSPS (above 32) and area 38698 um2. unrolled_k reached only 7.15 MSPS and had 0 feasible designs. pipelined_m had 0 feasible designs. The iterative family was never explored, but it issues one result every N+3 cycles, so it cannot reach the 32 MSPS minimum or the 0.5 us batch bound for 32 simultaneous requests. unrolled_k, the closest related family, already showed this limit at 7.15 MSPS.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.565e+05 (gain this round: +0.6%).
Feasible designs: 73 of 240 evaluations (57 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 171
- max_abs_err <= 0.000244141: 52% violate; best seen 3.11e-05 (2^-14.97)
- sys_p99_batch_us <= 0.5: 43% violate; best seen 0.276

Pareto front (feasible, 16 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=38698, accuracy_bits=12.3, ffs=840, throughput_msps=132, max_abs_err=0.000192 (2^-12.35), power_index=2.22
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=41799, accuracy_bits=12.6, ffs=904, throughput_msps=128, max_abs_err=0.000166 (2^-12.55), power_index=2.4
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=2 rounding=round] area_um2=41987, accuracy_bits=12.7, ffs=889, throughput_msps=132, max_abs_err=0.000152 (2^-12.68), power_index=2.37
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=3 rounding=round] area_um2=43175, accuracy_bits=12.7, ffs=912, throughput_msps=132, max_abs_err=0.000148 (2^-12.73), power_index=2.44
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=44216, accuracy_bits=13.1, ffs=955, throughput_msps=132, max_abs_err=0.000118 (2^-13.05), power_index=2.53
- pipelined [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=45846, accuracy_bits=13.1, ffs=969, throughput_msps=138, max_abs_err=0.000117 (2^-13.06), power_index=2.59
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=45892, accuracy_bits=13.5, ffs=991, throughput_msps=132, max_abs_err=8.35e-05 (2^-13.55), power_index=2.63
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=48095, accuracy_bits=13.8, ffs=1017, throughput_msps=132, max_abs_err=6.9e-05 (2^-13.82), power_index=2.71
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=49611, accuracy_bits=14.2, ffs=1048, throughput_msps=132, max_abs_err=5.46e-05 (2^-14.16), power_index=2.8
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=3 rounding=round] area_um2=55012, accuracy_bits=15, ffs=1160, throughput_msps=128, max_abs_err=3.11e-05 (2^-14.97), power_index=3.1
Front coverage: area_um2 38698..55012 (HV reference 100000); accuracy_bits 12.3..15 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.15 MSPS; best accuracy 10.48 bits
- pipelined: 128 evals, 73 feasible; max throughput seen 171 MSPS; best accuracy 14.97 bits; best feasible area_um2=38698; feasible ranges: data_width 15..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 92 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 14.37 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (16 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 111 feasible; hypervolume 2.667e+05 (+70.4%).

**No LLM call** (code's front-mapping round): This is the final round, so stop. The feasible front has 16 designs, all pipelined, spanning area 38698..55012 um2 and accuracy 12.3..15 bits. Round 3 added only +0.6% hypervolume, below the 1% eps, so the search has converged. The cheapest feasible design is pipelined W=17, N=14, angle_guard=3, frac_guard=0, round. It has max_abs_err 1.92e-4 (below 2.44e-4), throughput 132 MSPS (above 32) and area 38698 um2. unrolled_k reached only 7.15 MSPS and had 0 feasible designs. pipelined_m had 0 feasible designs. The iterative family was never explored, but it issues one result every N+3 cycles, so it cannot reach the 32 MSPS minimum or the 0.5 us batch bound for 32 simultaneous requests. unrolled_k, the closest related family, already showed this limit at 7.15 MSPS.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.667e+05 (gain this round: +70.4%).
Feasible designs: 111 of 400 evaluations (88 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 16% violate; best seen 171
- max_abs_err <= 0.000244141: 42% violate; best seen 6.73e-08 (2^-23.82)
- sys_p99_batch_us <= 0.5: 53% violate; best seen 0.276

Pareto front (feasible, 27 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=38698, accuracy_bits=12.3, ffs=840, throughput_msps=132, max_abs_err=0.000192 (2^-12.35), power_index=2.22
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=2 rounding=round] area_um2=41987, accuracy_bits=12.7, ffs=889, throughput_msps=132, max_abs_err=0.000152 (2^-12.68), power_index=2.37
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] area_um2=43618, accuracy_bits=13, ffs=944, throughput_msps=128, max_abs_err=0.000119 (2^-13.04), power_index=2.5
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=45864, accuracy_bits=13.4, ffs=971, throughput_msps=128, max_abs_err=8.97e-05 (2^-13.44), power_index=2.59
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=48095, accuracy_bits=13.8, ffs=1017, throughput_msps=132, max_abs_err=6.9e-05 (2^-13.82), power_index=2.71
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=49611, accuracy_bits=14.2, ffs=1048, throughput_msps=132, max_abs_err=5.46e-05 (2^-14.16), power_index=2.8
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=57948, accuracy_bits=15.4, ffs=1242, throughput_msps=119, max_abs_err=2.35e-05 (2^-15.38), power_index=3.3
- pipelined [data_width=21 n_iter=17 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=61847, accuracy_bits=15.8, ffs=1325, throughput_msps=111, max_abs_err=1.79e-05 (2^-15.77), power_index=3.52
- pipelined [data_width=24 n_iter=18 angle_guard=2 frac_guard=0 rounding=trunc] area_um2=66701, accuracy_bits=16.7, ffs=1433, throughput_msps=108, max_abs_err=9.16e-06 (2^-16.74), power_index=3.81
- pipelined [data_width=23 n_iter=20 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=80430, accuracy_bits=18.6, ffs=1715, throughput_msps=105, max_abs_err=2.46e-06 (2^-18.63), power_index=4.57
Front coverage: area_um2 38698..80430 (HV reference 100000); accuracy_bits 12.3..18.6 (HV reference 12); data_width on the front 16..24 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 7.15 MSPS; best accuracy 10.48 bits
- pipelined: 208 evals, 111 feasible; max throughput seen 171 MSPS; best accuracy 21.89 bits; best feasible area_um2=38698; feasible ranges: data_width 15..27, n_iter 14..25, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 172 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 23.82 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 22560 in, 4730 out
- provider-reported cost: $0.0924
- full prompts and replies: `llm_trace.jsonl`

