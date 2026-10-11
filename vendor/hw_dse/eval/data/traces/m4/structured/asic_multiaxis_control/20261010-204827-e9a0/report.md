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
`pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 38197 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 10176 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 810 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 143 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 112 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.16 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000209 (2^-12.22) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.43 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.44e-05 (2^-13.92) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.06 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.2 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 93.3 dBc, SNR 81.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (72) was simulated at its estimated Fmax (SimPy); 68 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 0.3213 → 0.3282 | yes |
| `pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=-2,frac_guard=1,rounding=trunc` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=1,rounding=round` | 0.3475 → 0.355 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (24 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 38197 | 810 | 143.2 | 16 | 2.16 | 0.000209 (2^-12.22) | 12.22 |
| 1 | `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 40161 | 851 | 137.6 | 16 | 2.27 | 0.000191 (2^-12.36) | 12.36 |
| 2 | `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=1,rounding=round` | 40799 | 865 | 132.4 | 16 | 2.31 | 0.000185 (2^-12.40) | 12.40 |
| 3 | `pipelined:data_width=16,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 40966 | 868 | 143.2 | 17 | 2.32 | 0.00018 (2^-12.44) | 12.44 |
| 4 | `pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=3,rounding=round` | 41211 | 871 | 137.6 | 16 | 2.33 | 0.000171 (2^-12.51) | 12.51 |
| 5 | `pipelined:data_width=19,n_iter=14,angle_guard=1,frac_guard=0,rounding=trunc` | 41249 | 895 | 132.4 | 16 | 2.37 | 0.000162 (2^-12.59) | 12.59 |
| 6 | `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=2,rounding=round` | 41987 | 889 | 132.4 | 16 | 2.37 | 0.000152 (2^-12.68) | 12.68 |
| 7 | `pipelined:data_width=16,n_iter=15,angle_guard=3,frac_guard=2,rounding=round` | 42934 | 908 | 137.6 | 17 | 2.43 | 0.000128 (2^-12.93) | 12.93 |
| 8 | `pipelined:data_width=17,n_iter=15,angle_guard=3,frac_guard=1,rounding=round` | 43758 | 927 | 132.4 | 17 | 2.47 | 0.000124 (2^-12.98) | 12.98 |
| 9 | `pipelined:data_width=16,n_iter=15,angle_guard=3,frac_guard=3,rounding=round` | 44217 | 934 | 137.6 | 17 | 2.49 | 0.000117 (2^-13.06) | 13.06 |
| 10 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 45179 | 957 | 132.4 | 17 | 2.55 | 9.31e-05 (2^-13.39) | 13.39 |
| 11 | `pipelined:data_width=17,n_iter=15,angle_guard=3,frac_guard=3,rounding=round` | 46324 | 978 | 132.4 | 17 | 2.61 | 8.99e-05 (2^-13.44) | 13.44 |
| 12 | `pipelined:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 47362 | 1001 | 137.6 | 18 | 2.67 | 8.59e-05 (2^-13.51) | 13.51 |
| 13 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=3,rounding=round` | 47745 | 1008 | 127.5 | 17 | 2.69 | 8.08e-05 (2^-13.60) | 13.60 |
| 14 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=round` | 48966 | 1036 | 127.5 | 18 | 2.77 | 6.51e-05 (2^-13.91) | 13.91 |
| 15 | `pipelined:data_width=17,n_iter=16,angle_guard=3,frac_guard=3,rounding=round` | 49473 | 1044 | 132.4 | 18 | 2.79 | 6.42e-05 (2^-13.93) | 13.93 |
| 16 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 50343 | 1064 | 127.5 | 18 | 2.84 | 5.17e-05 (2^-14.24) | 14.24 |
| 17 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 53678 | 1135 | 127.5 | 19 | 3.03 | 3.42e-05 (2^-14.83) | 14.83 |
| 18 | `pipelined:data_width=19,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 56874 | 1201 | 127.5 | 20 | 3.21 | 3.09e-05 (2^-14.98) | 14.98 |
| 19 | `pipelined:data_width=20,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc` | 57514 | 1235 | 127.5 | 20 | 3.28 | 2.8e-05 (2^-15.12) | 15.12 |
| 20 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 58429 | 1256 | 123.1 | 20 | 3.34 | 1.68e-05 (2^-15.87) | 15.87 |
| 21 | `pipelined:data_width=27,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 69908 | 1504 | 98.8 | 19 | 3.99 | 1.53e-05 (2^-15.99) | 15.99 |
| 22 | `pipelined:data_width=27,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc` | 70601 | 1517 | 101.6 | 19 | 4.03 | 1.53e-05 (2^-16.00) | 16.00 |
| 23 | `pipelined:data_width=21,n_iter=25,angle_guard=2,frac_guard=1,rounding=round` | 86303 | 1817 | 118.9 | 27 | 4.86 | 6.89e-06 (2^-17.15) | 17.15 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The deadline needs all 32 results within 0.5 us, so the unit must sustain about 64 results/us. Iterative designs take N+3 cycles per result and cannot do this, so I drop that family. Accuracy of 2^-12 needs roughly 13 or more bits, so W is about 12-18 and N about 11-16, with guard bits and rounding left free to trade area against error. Most of the budget goes to pipelined_m and pipelined. unrolled_k with large k gets a small probe to confirm it is infeasible.*)
- `pipelined_m` (55 evals): data_width=12..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Accepts one request per cycle, so the 32-request burst drains in about 32 cycles plus latency. Registering only every m stages saves flip-flops, so this is the most likely area minimiser.
- `pipelined` (36 evals): data_width=12..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* It has the highest Fmax and the lowest burst latency at one result per cycle. It is the safe feasible baseline and anchors the high-accuracy end of the front.
- `unrolled_k` (9 evals): data_width=12..16, n_iter=11..15, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=5..8. *Why:* A small probe of the only multi-cycle family that could plausibly meet the burst deadline. Large k gives about 5 cycles per result, but it needs a very high clock to drain 32 results in 0.5 us.

**Result (code):** 100 evaluations this round, 100 total; 2 feasible; hypervolume 8.338e+04 (n/a).

**LLM decision:** `refine` — Only 2 of 100 evaluations were feasible (1 unique design): pipelined at data_width 18, n_iter 15, giving 47745 um2 and 13.6 bits. Accuracy is the main blocker, since 89% of evaluations violate max_abs_err <= 2^-12. Unrolled_k peaked at 6.13 MSPS, far below the 32 MSPS floor. Iterative is even slower per result (N+3 cycles), so it cannot meet the throughput and 0.5 us batch constraints, and I am not adding it. pipelined_m reached 78.8 MSPS but only 12.74 bits, with 0 feasible designs, so it is close and may be smaller than pipelined. Best sys_p99_batch_us seen was 0.257, so latency is not the obstacle. The next round should search narrowly around the accuracy threshold of about 12 to 14 bits, using moderate width, enough iterations and guard bits, rounding, and small m. The goal is to cut area below 47745 while staying feasible.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.338e+04 (gain this round: n/a (first round)).
Feasible designs: 2 of 100 evaluations (1 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 43% violate; best seen 171
- max_abs_err <= 0.000244141: 89% violate; best seen 8.08e-05 (2^-13.60)
- sys_p99_batch_us <= 0.5: 63% violate; best seen 0.257

Pareto front (feasible, 1 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=47745, accuracy_bits=13.6, ffs=1008, throughput_msps=128, max_abs_err=8.08e-05 (2^-13.60), power_index=2.69
Front coverage: area_um2 47745..47745 (HV reference 100000); accuracy_bits 13.6..13.6 (HV reference 12); data_width on the front 18..18 (registry 8..28).

Per family:
- unrolled_k: 9 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.65 bits
- pipelined: 36 evals, 2 feasible; max throughput seen 171 MSPS; best accuracy 13.60 bits; best feasible area_um2=47745; feasible ranges: data_width 18..18, n_iter 15..15, angle_guard 2..2, frac_guard 3..3
- pipelined_m: 55 evals, 0 feasible; max throughput seen 78.8 MSPS; best accuracy 12.74 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the pipelined families in the accuracy-feasible width and iteration region, since the other families fail on throughput.*)
- `pipelined` (40 evals): data_width=13..18, n_iter=11..16, angle_guard=0..3, frac_guard=1..4, rounding=round|trunc. *Why:* The only family with feasible designs so far. A smaller width and fewer iterations may keep error at or below 2^-12 while cutting area below 47745.
- `pipelined_m` (60 evals): data_width=13..18, n_iter=11..16, angle_guard=0..3, frac_guard=1..4, rounding=round|trunc, m=2..4. *Why:* Fewer pipeline registers should lower area. A small m keeps Fmax high enough for throughput of at least 32 MSPS and the 0.5 us batch bound, and the accuracy range now targets the 12 to 14 bit region.

**Result (code):** 100 evaluations this round, 200 total; 24 feasible; hypervolume 1.228e+05 (+47.3%).

**LLM decision:** `refine` — Only pipelined is feasible so far (24 of 76 evals). Its front runs 38.8k to 50.3k um2 and reaches 12.1 to 14.2 accuracy bits, and the best design sits right at the 2^-12 error limit. Since the selection rule is min area, the useful gain is below 38.8k, so I will probe smaller widths, fewer iterations and less guard. unrolled_k is dead: 0 feasible and max 6.13 MSPS against the 32 MSPS requirement. I am also skipping iterative, which at N+3 cycles per result cannot get 32 results back in 0.5 us. pipelined_m has 0 feasible in 115 evals, but it reached 13.6 accuracy bits and 91 MSPS, and it has fewer FFs. It was probably sampled in poor regions, so I will give it a small, focused share at small m and the accuracy-feasible widths and iteration counts.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.228e+05 (gain this round: +47.3%).
Feasible designs: 24 of 200 evaluations (20 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 22% violate; best seen 171
- max_abs_err <= 0.000244141: 71% violate; best seen 5.17e-05 (2^-14.24)
- sys_p99_batch_us <= 0.5: 58% violate; best seen 0.257

Pareto front (feasible, 13 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round] area_um2=38834, accuracy_bits=12.1, ffs=824, throughput_msps=138, max_abs_err=0.000225 (2^-12.12), power_index=2.2
- pipelined [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round] area_um2=40161, accuracy_bits=12.4, ffs=851, throughput_msps=138, max_abs_err=0.000191 (2^-12.36), power_index=2.27
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=2 rounding=round] area_um2=41987, accuracy_bits=12.7, ffs=889, throughput_msps=132, max_abs_err=0.000152 (2^-12.68), power_index=2.37
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=2 rounding=round] area_um2=42934, accuracy_bits=12.9, ffs=908, throughput_msps=138, max_abs_err=0.000128 (2^-12.93), power_index=2.43
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=43758, accuracy_bits=13, ffs=927, throughput_msps=132, max_abs_err=0.000124 (2^-12.98), power_index=2.47
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=4 rounding=round] area_um2=46922, accuracy_bits=13.4, ffs=989, throughput_msps=128, max_abs_err=9.56e-05 (2^-13.35), power_index=2.64
- pipelined [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] area_um2=47362, accuracy_bits=13.5, ffs=1001, throughput_msps=138, max_abs_err=8.59e-05 (2^-13.51), power_index=2.67
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=47745, accuracy_bits=13.6, ffs=1008, throughput_msps=128, max_abs_err=8.08e-05 (2^-13.60), power_index=2.69
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=49473, accuracy_bits=13.9, ffs=1044, throughput_msps=132, max_abs_err=6.42e-05 (2^-13.93), power_index=2.79
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=50343, accuracy_bits=14.2, ffs=1064, throughput_msps=128, max_abs_err=5.17e-05 (2^-14.24), power_index=2.84
Front coverage: area_um2 38834..50343 (HV reference 100000); accuracy_bits 12.1..14.2 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 9 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.65 bits
- pipelined: 76 evals, 24 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits; best feasible area_um2=38834; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 2..3, frac_guard 1..4
- pipelined_m: 115 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 13.60 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the pipelined region near the error limit and probe smaller designs. Give pipelined_m a limited, targeted test.*)
- `pipelined` (30 evals): data_width=14..17, n_iter=12..15, angle_guard=0..3, frac_guard=0..3, rounding=round. *Why:* The feasible region is at data_width 16 to 18 and n_iter 14 to 16. Extending down to smaller width, fewer iterations and less guard should find cheaper designs near the 2^-12 limit.
- `pipelined_m` (10 evals): data_width=15..18, n_iter=13..16, angle_guard=1..3, frac_guard=1..3, rounding=round, m=2..3. *Why:* It may save FFs and area, but it has 0 feasible so far. A small m keeps Fmax and batch latency acceptable, and the accuracy-feasible width and iteration ranges address its earlier failures.

**Result (code):** 40 evaluations this round, 240 total; 37 feasible; hypervolume 1.234e+05 (+0.5%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is allowed. Feasible designs exist, so infeasible does not apply. The pipelined family has 37 feasible evaluations out of 106 and a 16-design front. It covers area 38197..50343 um2 and accuracy 12.2..14.2 bits. Hypervolume gained only +0.5% in round 3, which is below the 0.01 eps. The cheapest feasible design is pipelined W=16, N=14, angle_guard=2, frac_guard=1, round, with area 38197 um2, error 2.09e-4 (2^-12.22) and throughput 143 MSPS. It meets all three constraints, with error just under the 2^-12 limit. unrolled_k reached at most 6.13 MSPS with 0 feasible, and pipelined_m reached at most 91.1 MSPS with 0 feasible, so neither can beat pipelined on this spec. The code-driven mapping reserved before the run ends will refine the front further.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.234e+05 (gain this round: +0.5%).
Feasible designs: 37 of 240 evaluations (27 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 18% violate; best seen 171
- max_abs_err <= 0.000244141: 69% violate; best seen 5.17e-05 (2^-14.24)
- sys_p99_batch_us <= 0.5: 52% violate; best seen 0.257

Pareto front (feasible, 16 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round] area_um2=38197, accuracy_bits=12.2, ffs=810, throughput_msps=143, max_abs_err=0.000209 (2^-12.22), power_index=2.16
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=1 rounding=round] area_um2=40799, accuracy_bits=12.4, ffs=865, throughput_msps=132, max_abs_err=0.000185 (2^-12.40), power_index=2.31
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=40966, accuracy_bits=12.4, ffs=868, throughput_msps=143, max_abs_err=0.00018 (2^-12.44), power_index=2.32
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=2 rounding=round] area_um2=41987, accuracy_bits=12.7, ffs=889, throughput_msps=132, max_abs_err=0.000152 (2^-12.68), power_index=2.37
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=43758, accuracy_bits=13, ffs=927, throughput_msps=132, max_abs_err=0.000124 (2^-12.98), power_index=2.47
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=44217, accuracy_bits=13.1, ffs=934, throughput_msps=138, max_abs_err=0.000117 (2^-13.06), power_index=2.49
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=46324, accuracy_bits=13.4, ffs=978, throughput_msps=132, max_abs_err=8.99e-05 (2^-13.44), power_index=2.61
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=47745, accuracy_bits=13.6, ffs=1008, throughput_msps=128, max_abs_err=8.08e-05 (2^-13.60), power_index=2.69
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=1 rounding=round] area_um2=48966, accuracy_bits=13.9, ffs=1036, throughput_msps=128, max_abs_err=6.51e-05 (2^-13.91), power_index=2.77
- pipelined [data_width=18 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=50343, accuracy_bits=14.2, ffs=1064, throughput_msps=128, max_abs_err=5.17e-05 (2^-14.24), power_index=2.84
Front coverage: area_um2 38197..50343 (HV reference 100000); accuracy_bits 12.2..14.2 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 9 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.65 bits
- pipelined: 106 evals, 37 feasible; max throughput seen 171 MSPS; best accuracy 14.24 bits; best feasible area_um2=38197; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 1..3, frac_guard 1..4
- pipelined_m: 125 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 13.91 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (16 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 91 feasible; hypervolume 2.141e+05 (+73.5%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is allowed. Feasible designs exist, so infeasible does not apply. The pipelined family has 37 feasible evaluations out of 106 and a 16-design front. It covers area 38197..50343 um2 and accuracy 12.2..14.2 bits. Hypervolume gained only +0.5% in round 3, which is below the 0.01 eps. The cheapest feasible design is pipelined W=16, N=14, angle_guard=2, frac_guard=1, round, with area 38197 um2, error 2.09e-4 (2^-12.22) and throughput 143 MSPS. It meets all three constraints, with error just under the 2^-12 limit. unrolled_k reached at most 6.13 MSPS with 0 feasible, and pipelined_m reached at most 91.1 MSPS with 0 feasible, so neither can beat pipelined on this spec. The code-driven mapping reserved before the run ends will refine the front further.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.141e+05 (gain this round: +73.5%).
Feasible designs: 91 of 400 evaluations (72 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 25% violate; best seen 171
- max_abs_err <= 0.000244141: 52% violate; best seen 6.51e-08 (2^-23.87)
- sys_p99_batch_us <= 0.5: 54% violate; best seen 0.257

Pareto front (feasible, 24 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round] area_um2=38197, accuracy_bits=12.2, ffs=810, throughput_msps=143, max_abs_err=0.000209 (2^-12.22), power_index=2.16
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=40966, accuracy_bits=12.4, ffs=868, throughput_msps=143, max_abs_err=0.00018 (2^-12.44), power_index=2.32
- pipelined [data_width=19 n_iter=14 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=41249, accuracy_bits=12.6, ffs=895, throughput_msps=132, max_abs_err=0.000162 (2^-12.59), power_index=2.37
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=43758, accuracy_bits=13, ffs=927, throughput_msps=132, max_abs_err=0.000124 (2^-12.98), power_index=2.47
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] area_um2=45179, accuracy_bits=13.4, ffs=957, throughput_msps=132, max_abs_err=9.31e-05 (2^-13.39), power_index=2.55
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=47745, accuracy_bits=13.6, ffs=1008, throughput_msps=128, max_abs_err=8.08e-05 (2^-13.60), power_index=2.69
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=49473, accuracy_bits=13.9, ffs=1044, throughput_msps=132, max_abs_err=6.42e-05 (2^-13.93), power_index=2.79
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=56874, accuracy_bits=15, ffs=1201, throughput_msps=128, max_abs_err=3.09e-05 (2^-14.98), power_index=3.21
- pipelined [data_width=21 n_iter=18 angle_guard=1 frac_guard=0 rounding=round] area_um2=58429, accuracy_bits=15.9, ffs=1256, throughput_msps=123, max_abs_err=1.68e-05 (2^-15.87), power_index=3.34
- pipelined [data_width=21 n_iter=25 angle_guard=2 frac_guard=1 rounding=round] area_um2=86303, accuracy_bits=17.1, ffs=1817, throughput_msps=119, max_abs_err=6.89e-06 (2^-17.15), power_index=4.86
Front coverage: area_um2 38197..86303 (HV reference 100000); accuracy_bits 12.2..17.1 (HV reference 12); data_width on the front 16..27 (registry 8..28).

Per family:
- unrolled_k: 9 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 11.65 bits
- pipelined: 186 evals, 91 feasible; max throughput seen 171 MSPS; best accuracy 21.88 bits; best feasible area_um2=38197; feasible ranges: data_width 15..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 205 evals, 0 feasible; max throughput seen 102 MSPS; best accuracy 23.87 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 22026 in, 4911 out
- provider-reported cost: $0.0932
- full prompts and replies: `llm_trace.jsonl`

