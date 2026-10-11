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

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 9 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 94.8 dBc, SNR 80.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (126) was simulated at its estimated Fmax (SimPy); 123 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=15,n_iter=14,angle_guard=3,frac_guard=3,rounding=round,m=2` | 0.4951 → 0.5076 | no |
| `pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=4,rounding=trunc` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc` | 0.3417 → 0.3488 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=-1,frac_guard=3,rounding=round` | 0.3607 → 0.3684 | yes |

**WINNER CHANGED AT L2**: the L1 selection pipelined_m:data_width=15,n_iter=14,angle_guard=3,frac_guard=3,rounding=round,m=2 fails the simulated system constraints (sys_p99_batch_us <= 0.5 by 1.5%); the best design that passes is pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round (rank 2 of 126 L1-feasible designs by the selection rule).

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (23 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=14,angle_guard=3,frac_guard=3,rounding=round,m=2` | 30713 | 445 | 78.8 | 9 | 1.37 | 0.000215 (2^-12.18) | 12.18 |
| 1 | `pipelined:data_width=18,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 40611 | 881 | 127.5 | 16 | 2.33 | 0.00017 (2^-12.53) | 12.53 |
| 2 | `pipelined:data_width=18,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc` | 42845 | 925 | 137.6 | 17 | 2.45 | 0.00016 (2^-12.61) | 12.61 |
| 3 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=0,rounding=round` | 43618 | 944 | 127.5 | 17 | 2.5 | 0.000119 (2^-13.04) | 13.04 |
| 4 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=2,rounding=round` | 45777 | 967 | 132.4 | 17 | 2.58 | 9.56e-05 (2^-13.35) | 13.35 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc` | 47357 | 1022 | 132.4 | 18 | 2.71 | 8.56e-05 (2^-13.51) | 13.51 |
| 6 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 48095 | 1017 | 132.4 | 18 | 2.71 | 6.9e-05 (2^-13.82) | 13.82 |
| 7 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc` | 48735 | 1050 | 132.4 | 18 | 2.79 | 6.44e-05 (2^-13.92) | 13.92 |
| 8 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 50112 | 1078 | 127.5 | 18 | 2.86 | 5.43e-05 (2^-14.17) | 14.17 |
| 9 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=2,rounding=trunc` | 51577 | 1109 | 123.1 | 18 | 2.94 | 4.67e-05 (2^-14.39) | 14.39 |
| 10 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 51721 | 1091 | 127.5 | 18 | 2.92 | 4.52e-05 (2^-14.43) | 14.43 |
| 11 | `pipelined:data_width=19,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 53465 | 1150 | 132.4 | 20 | 3.05 | 4.26e-05 (2^-14.52) | 14.52 |
| 12 | `pipelined:data_width=22,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 56060 | 1207 | 115.0 | 18 | 3.2 | 3.32e-05 (2^-14.88) | 14.88 |
| 13 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 59407 | 1254 | 123.1 | 20 | 3.35 | 1.89e-05 (2^-15.69) | 15.69 |
| 14 | `pipelined:data_width=23,n_iter=18,angle_guard=1,frac_guard=0,rounding=trunc` | 63392 | 1363 | 115.0 | 20 | 3.62 | 1.11e-05 (2^-16.46) | 16.46 |
| 15 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=2,rounding=round` | 63507 | 1339 | 118.9 | 20 | 3.58 | 1.11e-05 (2^-16.46) | 16.46 |
| 16 | `pipelined:data_width=21,n_iter=19,angle_guard=2,frac_guard=3,rounding=trunc` | 67627 | 1445 | 115.0 | 21 | 3.85 | 8.4e-06 (2^-16.86) | 16.86 |
| 17 | `pipelined:data_width=21,n_iter=19,angle_guard=2,frac_guard=3,rounding=round` | 68744 | 1447 | 115.0 | 21 | 3.87 | 7.05e-06 (2^-17.11) | 17.11 |
| 18 | `pipelined:data_width=23,n_iter=19,angle_guard=1,frac_guard=1,rounding=round` | 69896 | 1474 | 115.0 | 21 | 3.94 | 5.75e-06 (2^-17.41) | 17.41 |
| 19 | `pipelined:data_width=24,n_iter=19,angle_guard=1,frac_guard=1,rounding=trunc` | 71301 | 1528 | 111.3 | 21 | 4.06 | 4.86e-06 (2^-17.65) | 17.65 |
| 20 | `pipelined:data_width=23,n_iter=19,angle_guard=2,frac_guard=3,rounding=round` | 74094 | 1559 | 107.9 | 21 | 4.17 | 4.51e-06 (2^-17.76) | 17.76 |
| 21 | `pipelined:data_width=23,n_iter=21,angle_guard=1,frac_guard=0,rounding=round` | 74260 | 1590 | 115.0 | 23 | 4.23 | 3.03e-06 (2^-18.33) | 18.33 |
| 22 | `pipelined:data_width=24,n_iter=20,angle_guard=1,frac_guard=2,rounding=trunc` | 76917 | 1644 | 107.9 | 22 | 4.37 | 2.81e-06 (2^-18.44) | 18.44 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The tick issues 32 requests that must all finish within 0.5 us, so the unit needs about 64 results/us effective. Iterative needs N+3 cycles per result, so 32 results take hundreds of cycles, and I expect it to fail the batch bound; I excluded it. Error <= 2^-12 needs roughly data_width 13-16 with 12-15 iterations, so I search a window around that, with some headroom for the accuracy_bits objective. Most budget goes to pipelined_m and pipelined, with a smaller probe of unrolled_k at high k. Later rounds can narrow on the families and widths that survive.*)
- `pipelined_m` (45 evals): data_width=12..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* One result per cycle with fewer registers than a full pipeline should give the smallest area. The m sweep trades registers against Fmax and latency to meet the 0.5 us batch bound.
- `pipelined` (33 evals): data_width=12..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* A fully registered pipeline has the highest Fmax and a simple 1-result/cycle batch. It gives the baseline for the batch latency (about N+2+31 cycles) and the upper end of the area range.
- `unrolled_k` (22 evals): data_width=12..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* A high k cuts cycles per result to about 4-6 and might meet the batch bound with less area than a pipeline. It is a risky probe, because the chained stages lower Fmax and the 32-request burst queues.

**Result (code):** 100 evaluations this round, 100 total; 17 feasible; hypervolume 1.266e+05 (n/a).

**LLM decision:** `refine` — Only pipelined has feasible designs (17 of 33 evals), and the whole front sits at data_width=18 with area 42248..51721. The cheapest design has 12.3 bits against the 12-bit requirement, so the error constraint is nearly binding. Smaller widths (13..17) and fewer iterations may still meet 2^-12 at lower area, and the selection rule is min area. unrolled_k found 0 feasible designs and reached only 8.39 MSPS, so it cannot meet throughput >= 32 or the 0.5 us batch bound. Iterative takes N+3 cycles per result, which is slower still, so I am not exploring it. pipelined_m got 0 feasible designs, topping out at 91 MSPS and no better accuracy than pipelined. A small-m variant might still save flip-flops and area, so I keep it with a small budget share.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.266e+05 (gain this round: n/a (first round)).
Feasible designs: 17 of 100 evaluations (13 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 38% violate; best seen 171
- max_abs_err <= 0.000244141: 57% violate; best seen 4.52e-05 (2^-14.43)
- sys_p99_batch_us <= 0.5: 63% violate; best seen 0.269

Pareto front (feasible, 6 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=42248, accuracy_bits=12.3, ffs=914, throughput_msps=138, max_abs_err=0.000194 (2^-12.33), power_index=2.42
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=3 rounding=round] area_um2=45139, accuracy_bits=12.9, ffs=954, throughput_msps=128, max_abs_err=0.000134 (2^-12.86), power_index=2.55
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=3 rounding=round] area_um2=46375, accuracy_bits=13, ffs=978, throughput_msps=128, max_abs_err=0.000125 (2^-12.97), power_index=2.61
- pipelined [data_width=18 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] area_um2=49631, accuracy_bits=13.7, ffs=1070, throughput_msps=128, max_abs_err=7.75e-05 (2^-13.65), power_index=2.84
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=50758, accuracy_bits=14.2, ffs=1089, throughput_msps=128, max_abs_err=5.44e-05 (2^-14.17), power_index=2.89
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=51721, accuracy_bits=14.4, ffs=1091, throughput_msps=128, max_abs_err=4.52e-05 (2^-14.43), power_index=2.92
Front coverage: area_um2 42248..51721 (HV reference 100000); accuracy_bits 12.3..14.4 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- unrolled_k: 22 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 12.68 bits
- pipelined: 33 evals, 17 feasible; max throughput seen 171 MSPS; best accuracy 14.43 bits; best feasible area_um2=42248; feasible ranges: data_width 18..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 45 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 14.43 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the pipelined region and test whether smaller data widths remain feasible. Keep a small-m pipelined_m probe as a possible area saver.*)
- `pipelined` (75 evals): data_width=13..18, n_iter=11..17, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* All feasible designs are here. Probe narrower data widths and fewer iterations to reduce area while staying within 2^-12 error.
- `pipelined_m` (25 evals): data_width=13..18, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Small m keeps Fmax high enough for the 32 results to return within 0.5 us. It also drops intermediate registers, which may reduce area. Earlier rounds likely used m values that were too large.

**Result (code):** 100 evaluations this round, 200 total; 46 feasible; hypervolume 1.329e+05 (+5.0%).

**LLM decision:** `refine` — The cheapest feasible design is pipelined_m (m=2, W=15, N=14) at 30713 um2 and 12.2 bits, but it is the only feasible point in 70 pipelined_m evaluations, so that region is barely sampled. Pipelined fills the rest of the front at W=18, 40611..51721 um2. unrolled_k had 0 feasible designs, with a best throughput of 8.39 MSPS against the 32 required, so the iterative family, being slower, cannot deliver 32 results within 0.5 us and I will skip it. I will concentrate on pipelined_m with small m and W 13..16, and on narrower pipelined designs at W 14..17. The aim is to push area below 30.7k while keeping accuracy at or above 12 bits and p99 batch time under 0.5 us.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.329e+05 (gain this round: +5.0%).
Feasible designs: 46 of 200 evaluations (29 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 19% violate; best seen 171
- max_abs_err <= 0.000244141: 64% violate; best seen 4.52e-05 (2^-14.43)
- sys_p99_batch_us <= 0.5: 39% violate; best seen 0.269

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined_m [data_width=15 n_iter=14 angle_guard=3 frac_guard=3 rounding=round m=2] area_um2=30713, accuracy_bits=12.2, ffs=445, throughput_msps=78.8, max_abs_err=0.000215 (2^-12.18), power_index=1.37
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=40611, accuracy_bits=12.5, ffs=881, throughput_msps=128, max_abs_err=0.00017 (2^-12.53), power_index=2.33
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=42845, accuracy_bits=12.6, ffs=925, throughput_msps=138, max_abs_err=0.00016 (2^-12.61), power_index=2.45
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] area_um2=43618, accuracy_bits=13, ffs=944, throughput_msps=128, max_abs_err=0.000119 (2^-13.04), power_index=2.5
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=45777, accuracy_bits=13.4, ffs=967, throughput_msps=132, max_abs_err=9.56e-05 (2^-13.35), power_index=2.58
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=48002, accuracy_bits=13.5, ffs=1034, throughput_msps=128, max_abs_err=8.72e-05 (2^-13.49), power_index=2.74
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=48430, accuracy_bits=13.7, ffs=1022, throughput_msps=128, max_abs_err=7.32e-05 (2^-13.74), power_index=2.73
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=round] area_um2=50256, accuracy_bits=13.8, ffs=1060, throughput_msps=128, max_abs_err=7.04e-05 (2^-13.79), power_index=2.83
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=50758, accuracy_bits=14.2, ffs=1089, throughput_msps=128, max_abs_err=5.44e-05 (2^-14.17), power_index=2.89
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=51721, accuracy_bits=14.4, ffs=1091, throughput_msps=128, max_abs_err=4.52e-05 (2^-14.43), power_index=2.92
Front coverage: area_um2 30713..51721 (HV reference 100000); accuracy_bits 12.2..14.4 (HV reference 12); data_width on the front 15..18 (registry 8..28).

Per family:
- unrolled_k: 22 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 12.68 bits
- pipelined: 108 evals, 45 feasible; max throughput seen 171 MSPS; best accuracy 14.43 bits; best feasible area_um2=40611; feasible ranges: data_width 16..18, n_iter 14..17, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 70 evals, 1 feasible; max throughput seen 91.1 MSPS; best accuracy 14.43 bits; best feasible area_um2=30713; feasible ranges: data_width 15..15, n_iter 14..14, angle_guard 3..3, frac_guard 3..3, m 2..2
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the low-area, low-m pipelined_m corner and on narrower pipelined designs, since the unrolled_k and iterative families cannot meet the 32-result burst deadline.*)
- `pipelined_m` (24 evals): data_width=13..16, n_iter=12..15, angle_guard=0..4, frac_guard=1..4, rounding=round|trunc, m=2..4. *Why:* The best area (30713) came from m=2, W=15, N=14. Smaller widths and iteration counts with m 2..4 may give lower area while still meeting the 2^-12 error and throughput limits.
- `pipelined` (16 evals): data_width=14..17, n_iter=13..16, angle_guard=0..4, frac_guard=0..4, rounding=round|trunc. *Why:* All feasible pipelined designs so far use W 16..18. Probing W 14..17 may fill the gap between 30k and 40k um2 and keep the accuracy end of the front.

**Result (code):** 40 evaluations this round, 240 total; 50 feasible; hypervolume 1.329e+05 (+0.0%).

**LLM decision:** `stop` — This is the final round, so the only valid choices are stop or infeasible. The constraints are feasible: 10 designs on the front meet throughput, error and the batch-latency bound. The front spans area 30713 to 51721 um2 and accuracy 12.2 to 14.4 bits. Hypervolume gained +0.0% in round 3, so it has plateaued. The cheapest feasible design is pipelined_m (data_width=15, n_iter=14, m=2) at 30713 um2 and 12.2 bits. It meets max error of 2^-12.18 and throughput of 78.8 MSPS. The best feasible pipelined design costs 40611 um2. Unrolled_k produced no feasible designs, with a best throughput of 8.39 MSPS, so it cannot meet the 32 MSPS and 0.5 us batch requirements. The iterative family was never explored, but it issues one result every N+3 cycles. It therefore cannot reach 32 MSPS at plausible clocks and is not a candidate.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.329e+05 (gain this round: +0.0%).
Feasible designs: 50 of 240 evaluations (33 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 16% violate; best seen 171
- max_abs_err <= 0.000244141: 65% violate; best seen 4.52e-05 (2^-14.43)
- sys_p99_batch_us <= 0.5: 41% violate; best seen 0.269

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined_m [data_width=15 n_iter=14 angle_guard=3 frac_guard=3 rounding=round m=2] area_um2=30713, accuracy_bits=12.2, ffs=445, throughput_msps=78.8, max_abs_err=0.000215 (2^-12.18), power_index=1.37
- pipelined [data_width=18 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=40611, accuracy_bits=12.5, ffs=881, throughput_msps=128, max_abs_err=0.00017 (2^-12.53), power_index=2.33
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=42845, accuracy_bits=12.6, ffs=925, throughput_msps=138, max_abs_err=0.00016 (2^-12.61), power_index=2.45
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=0 rounding=round] area_um2=43618, accuracy_bits=13, ffs=944, throughput_msps=128, max_abs_err=0.000119 (2^-13.04), power_index=2.5
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=45777, accuracy_bits=13.4, ffs=967, throughput_msps=132, max_abs_err=9.56e-05 (2^-13.35), power_index=2.58
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=48002, accuracy_bits=13.5, ffs=1034, throughput_msps=128, max_abs_err=8.72e-05 (2^-13.49), power_index=2.74
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=48430, accuracy_bits=13.7, ffs=1022, throughput_msps=128, max_abs_err=7.32e-05 (2^-13.74), power_index=2.73
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=round] area_um2=50256, accuracy_bits=13.8, ffs=1060, throughput_msps=128, max_abs_err=7.04e-05 (2^-13.79), power_index=2.83
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=50758, accuracy_bits=14.2, ffs=1089, throughput_msps=128, max_abs_err=5.44e-05 (2^-14.17), power_index=2.89
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=51721, accuracy_bits=14.4, ffs=1091, throughput_msps=128, max_abs_err=4.52e-05 (2^-14.43), power_index=2.92
Front coverage: area_um2 30713..51721 (HV reference 100000); accuracy_bits 12.2..14.4 (HV reference 12); data_width on the front 15..18 (registry 8..28).

Per family:
- unrolled_k: 22 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 12.68 bits
- pipelined: 124 evals, 49 feasible; max throughput seen 171 MSPS; best accuracy 14.43 bits; best feasible area_um2=40611; feasible ranges: data_width 15..18, n_iter 14..17, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 94 evals, 1 feasible; max throughput seen 91.1 MSPS; best accuracy 14.43 bits; best feasible area_um2=30713; feasible ranges: data_width 15..15, n_iter 14..14, angle_guard 3..3, frac_guard 3..3, m 2..2
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (16 evals): data_width=14..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)
- `pipelined` (144 evals): data_width=17..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (9 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 157 feasible; hypervolume 2.715e+05 (+104.2%).

**No LLM call** (code's front-mapping round): This is the final round, so the only valid choices are stop or infeasible. The constraints are feasible: 10 designs on the front meet throughput, error and the batch-latency bound. The front spans area 30713 to 51721 um2 and accuracy 12.2 to 14.4 bits. Hypervolume gained +0.0% in round 3, so it has plateaued. The cheapest feasible design is pipelined_m (data_width=15, n_iter=14, m=2) at 30713 um2 and 12.2 bits. It meets max error of 2^-12.18 and throughput of 78.8 MSPS. The best feasible pipelined design costs 40611 um2. Unrolled_k produced no feasible designs, with a best throughput of 8.39 MSPS, so it cannot meet the 32 MSPS and 0.5 us batch requirements. The iterative family was never explored, but it issues one result every N+3 cycles. It therefore cannot reach 32 MSPS at plausible clocks and is not a candidate.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.715e+05 (gain this round: +104.2%).
Feasible designs: 157 of 400 evaluations (126 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 11% violate; best seen 171
- max_abs_err <= 0.000244141: 41% violate; best seen 5.57e-08 (2^-24.10)
- sys_p99_batch_us <= 0.5: 37% violate; best seen 0.269

Pareto front (feasible, 23 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined_m [data_width=15 n_iter=14 angle_guard=3 frac_guard=3 rounding=round m=2] area_um2=30713, accuracy_bits=12.2, ffs=445, throughput_msps=78.8, max_abs_err=0.000215 (2^-12.18), power_index=1.37
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=42845, accuracy_bits=12.6, ffs=925, throughput_msps=138, max_abs_err=0.00016 (2^-12.61), power_index=2.45
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=47357, accuracy_bits=13.5, ffs=1022, throughput_msps=132, max_abs_err=8.56e-05 (2^-13.51), power_index=2.71
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=48735, accuracy_bits=13.9, ffs=1050, throughput_msps=132, max_abs_err=6.44e-05 (2^-13.92), power_index=2.79
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=51721, accuracy_bits=14.4, ffs=1091, throughput_msps=128, max_abs_err=4.52e-05 (2^-14.43), power_index=2.92
- pipelined [data_width=22 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=56060, accuracy_bits=14.9, ffs=1207, throughput_msps=115, max_abs_err=3.32e-05 (2^-14.88), power_index=3.2
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] area_um2=63507, accuracy_bits=16.5, ffs=1339, throughput_msps=119, max_abs_err=1.11e-05 (2^-16.46), power_index=3.58
- pipelined [data_width=21 n_iter=19 angle_guard=2 frac_guard=3 rounding=round] area_um2=68744, accuracy_bits=17.1, ffs=1447, throughput_msps=115, max_abs_err=7.05e-06 (2^-17.11), power_index=3.87
- pipelined [data_width=23 n_iter=19 angle_guard=2 frac_guard=3 rounding=round] area_um2=74094, accuracy_bits=17.8, ffs=1559, throughput_msps=108, max_abs_err=4.51e-06 (2^-17.76), power_index=4.17
- pipelined [data_width=24 n_iter=20 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=76917, accuracy_bits=18.4, ffs=1644, throughput_msps=108, max_abs_err=2.81e-06 (2^-18.44), power_index=4.37
Front coverage: area_um2 30713..76917 (HV reference 100000); accuracy_bits 12.2..18.4 (HV reference 12); data_width on the front 15..24 (registry 8..28).

Per family:
- unrolled_k: 22 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 12.68 bits
- pipelined: 268 evals, 156 feasible; max throughput seen 171 MSPS; best accuracy 24.10 bits; best feasible area_um2=40611; feasible ranges: data_width 15..28, n_iter 14..27, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 110 evals, 1 feasible; max throughput seen 91.1 MSPS; best accuracy 20.76 bits; best feasible area_um2=30713; feasible ranges: data_width 15..15, n_iter 14..14, angle_guard 3..3, frac_guard 3..3, m 2..2
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 22713 in, 4667 out
- provider-reported cost: $0.0921
- full prompts and replies: `llm_trace.jsonl`

