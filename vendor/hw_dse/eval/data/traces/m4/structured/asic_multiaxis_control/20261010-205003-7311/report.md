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

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (57) was simulated at its estimated Fmax (SimPy); 54 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round` | 0.3213 → 0.3282 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=round` | 0.3344 → 0.3416 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=1,rounding=round` | 0.3475 → 0.355 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (19 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 38698 | 840 | 132.4 | 16 | 2.22 | 0.000192 (2^-12.35) | 12.35 |
| 1 | `pipelined:data_width=17,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 40161 | 851 | 137.6 | 16 | 2.27 | 0.000191 (2^-12.36) | 12.36 |
| 2 | `pipelined:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=round` | 40573 | 857 | 137.6 | 16 | 2.29 | 0.000187 (2^-12.38) | 12.38 |
| 3 | `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=1,rounding=round` | 40799 | 865 | 132.4 | 16 | 2.31 | 0.000185 (2^-12.40) | 12.40 |
| 4 | `pipelined:data_width=16,n_iter=15,angle_guard=3,frac_guard=1,rounding=round` | 41651 | 883 | 137.6 | 17 | 2.36 | 0.000174 (2^-12.49) | 12.49 |
| 5 | `pipelined:data_width=19,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 41887 | 908 | 127.5 | 16 | 2.41 | 0.000142 (2^-12.78) | 12.78 |
| 6 | `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=2,rounding=round` | 43671 | 923 | 137.6 | 17 | 2.47 | 0.00014 (2^-12.80) | 12.80 |
| 7 | `pipelined:data_width=17,n_iter=15,angle_guard=1,frac_guard=3,rounding=round` | 44954 | 949 | 132.4 | 17 | 2.53 | 0.000134 (2^-12.86) | 12.86 |
| 8 | `pipelined:data_width=17,n_iter=15,angle_guard=2,frac_guard=3,rounding=round` | 45639 | 963 | 132.4 | 17 | 2.57 | 9.76e-05 (2^-13.32) | 13.32 |
| 9 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 53678 | 1135 | 127.5 | 19 | 3.03 | 3.42e-05 (2^-14.83) | 14.83 |
| 10 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=4,rounding=trunc` | 57081 | 1221 | 118.9 | 19 | 3.25 | 2.94e-05 (2^-15.05) | 15.05 |
| 11 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=4,rounding=trunc` | 57861 | 1238 | 118.9 | 19 | 3.29 | 2.62e-05 (2^-15.22) | 15.22 |
| 12 | `pipelined:data_width=22,n_iter=17,angle_guard=2,frac_guard=0,rounding=round` | 58210 | 1253 | 115.0 | 19 | 3.33 | 1.86e-05 (2^-15.72) | 15.72 |
| 13 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=4,rounding=trunc` | 62540 | 1338 | 111.3 | 19 | 3.56 | 1.77e-05 (2^-15.78) | 15.78 |
| 14 | `pipelined:data_width=22,n_iter=17,angle_guard=1,frac_guard=4,rounding=trunc` | 63320 | 1355 | 107.9 | 19 | 3.6 | 1.76e-05 (2^-15.79) | 15.79 |
| 15 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=4,rounding=trunc` | 64697 | 1382 | 111.3 | 20 | 3.68 | 1.35e-05 (2^-16.18) | 16.18 |
| 16 | `pipelined:data_width=25,n_iter=18,angle_guard=3,frac_guard=0,rounding=trunc` | 70010 | 1504 | 101.6 | 20 | 4 | 8.31e-06 (2^-16.88) | 16.88 |
| 17 | `pipelined:data_width=21,n_iter=21,angle_guard=3,frac_guard=4,rounding=trunc` | 77788 | 1657 | 111.3 | 23 | 4.41 | 4.43e-06 (2^-17.78) | 17.78 |
| 18 | `pipelined:data_width=21,n_iter=21,angle_guard=3,frac_guard=4,rounding=round` | 78905 | 1659 | 111.3 | 23 | 4.44 | 3.39e-06 (2^-18.17) | 18.17 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 32-results-in-0.5-us burst requirement and throughput of at least 32 MSPS rule out the iterative family, at N+3 cycles per result. The error bound of 2^-12 needs roughly 15-17 bit width and 12-15 iterations, so ranges are centred there, with some room for accuracy-bits trade-offs. Most of the budget goes to pipelined_m, which should give the smallest area while meeting the burst deadline. Pipelined anchors the front, and a small unrolled_k probe tests whether a shared datapath can reach feasibility. Later rounds will narrow the ranges based on which families survive the constraints.*)
- `pipelined_m` (63 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Accepts 1 result/cycle, so the 32-request burst finishes in latency+31 cycles, and the 0.5 us window needs only a modest Fmax. Registering every m stages cuts FFs and area compared with full pipelining, so this is the likely area minimum.
- `pipelined` (25 evals): data_width=13..18, n_iter=11..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* This is the high-Fmax, one-result-per-cycle baseline and is the safest family for the burst constraint. It anchors the front, and its area is the reference against which pipelined_m is judged.
- `unrolled_k` (12 evals): data_width=13..17, n_iter=11..14, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=5..8. *Why:* A shared datapath is much smaller, but 32 results at ceil(N/k)+3 cycles each is very tight against 0.5 us and the throughput of at least 32 MSPS. Only large k with small N has any chance, so it gets a small probe to confirm whether it is feasible.

**Result (code):** 100 evaluations this round, 100 total; 2 feasible; hypervolume 2.744e+04 (n/a).

**LLM decision:** `refine` — Only 2 of 100 evaluations were feasible, giving one front point: pipelined at W=16, N=15, area 42249, 12.5 bits. Iterative and unrolled_k cannot meet the burst deadline. unrolled_k reached at most 5.79 MSPS against the 32 MSPS constraint across 12 evals with 0 feasible. Iterative takes N+3 cycles per result, so 32 results would need far more than a feasible clock inside 0.5 us. Only the pipelined families issue one result per cycle, and a pipelined design needs about 32+N+2 cycles for the batch, which fits at the Fmax values seen (best p99 batch 0.257 us). The accuracy constraint was the main blocker, violated by 82% of evaluations, so I will focus on the accuracy-feasible region: data_width around 13-17, n_iter 11-16, with guard bits. pipelined_m had 0 feasible in 63 evals but reached 13.09 bits and 96 MSPS, so its failures were probably accuracy or batch timing. Its larger m values remove pipeline registers and may cut area below 42249. I will keep both families and tighten m to 2-5 to keep Fmax adequate.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2.744e+04 (gain this round: n/a (first round)).
Feasible designs: 2 of 100 evaluations (1 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 36% violate; best seen 171
- max_abs_err <= 0.000244141: 82% violate; best seen 0.000114 (2^-13.09)
- sys_p99_batch_us <= 0.5: 71% violate; best seen 0.257

Pareto front (feasible, 1 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] area_um2=42249, accuracy_bits=12.5, ffs=894, throughput_msps=143, max_abs_err=0.000176 (2^-12.48), power_index=2.39
Front coverage: area_um2 42249..42249 (HV reference 100000); accuracy_bits 12.5..12.5 (HV reference 12); data_width on the front 16..16 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 5.79 MSPS; best accuracy 10.37 bits
- pipelined: 25 evals, 2 feasible; max throughput seen 171 MSPS; best accuracy 12.48 bits; best feasible area_um2=42249; feasible ranges: data_width 16..16, n_iter 15..15, angle_guard 2..2, frac_guard 2..2
- pipelined_m: 63 evals, 0 feasible; max throughput seen 96.1 MSPS; best accuracy 13.09 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the pipelined families in the narrow W and N window where 2^-12 accuracy is reachable, and look for area reductions from fewer registers and smaller widths.*)
- `pipelined` (40 evals): data_width=13..17, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* This is the only family with a feasible design. Smaller W and N around the 12.5-bit point should lower area while keeping error at or below 2^-12.
- `pipelined_m` (60 evals): data_width=13..17, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..5. *Why:* It reached 13.09 bits and 96 MSPS, and registering every m stages cuts FFs and area. Capping m at 5 keeps Fmax high enough for the 0.5 us batch bound.

**Result (code):** 100 evaluations this round, 200 total; 18 feasible; hypervolume 7.499e+04 (+173.3%).

**LLM decision:** `refine` — The front has 8 designs, all pipelined, with area 40573..45639 and accuracy 12.4..13.3 bits. Feasible pipelined designs sit in a narrow region: data_width 15..17, n_iter 14..16, angle_guard 0..3, frac_guard 1..3. Only about 24% of evaluations meet the error bound, so the budget should concentrate there. Unrolled_k reached at most 5.79 MSPS against the 32 MSPS requirement, with 0 feasible designs in 12 evals. Iterative is slower still: it needs N+3 cycles per result, and the spec needs all 32 results within 0.5 us. I am skipping it as hopeless rather than spending budget on it. Pipelined_m found 0 feasible designs in 123 evals, but its best accuracy is 13.82 bits and its throughput reaches 102 MSPS. Small m (2-3) keeps Fmax high while removing registers, which could lower area. I will test pipelined_m in the same narrow region with small m. I will also probe pipelined at slightly lower widths and iteration counts, since smaller designs near the 2^-12 error limit would lower area.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7.499e+04 (gain this round: +173.3%).
Feasible designs: 18 of 200 evaluations (14 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 20% violate; best seen 171
- max_abs_err <= 0.000244141: 76% violate; best seen 6.9e-05 (2^-13.82)
- sys_p99_batch_us <= 0.5: 62% violate; best seen 0.257

Pareto front (feasible, 8 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=40573, accuracy_bits=12.4, ffs=857, throughput_msps=138, max_abs_err=0.000187 (2^-12.38), power_index=2.29
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=1 rounding=round] area_um2=40799, accuracy_bits=12.4, ffs=865, throughput_msps=132, max_abs_err=0.000185 (2^-12.40), power_index=2.31
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=41651, accuracy_bits=12.5, ffs=883, throughput_msps=138, max_abs_err=0.000174 (2^-12.49), power_index=2.36
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] area_um2=42388, accuracy_bits=12.6, ffs=898, throughput_msps=143, max_abs_err=0.000158 (2^-12.63), power_index=2.4
- pipelined [data_width=17 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=42537, accuracy_bits=12.6, ffs=899, throughput_msps=132, max_abs_err=0.000157 (2^-12.64), power_index=2.4
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=43532, accuracy_bits=12.7, ffs=919, throughput_msps=138, max_abs_err=0.000153 (2^-12.67), power_index=2.46
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=3 rounding=round] area_um2=44954, accuracy_bits=12.9, ffs=949, throughput_msps=132, max_abs_err=0.000134 (2^-12.86), power_index=2.53
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=45639, accuracy_bits=13.3, ffs=963, throughput_msps=132, max_abs_err=9.76e-05 (2^-13.32), power_index=2.57
Front coverage: area_um2 40573..45639 (HV reference 100000); accuracy_bits 12.4..13.3 (HV reference 12); data_width on the front 16..17 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 5.79 MSPS; best accuracy 10.37 bits
- pipelined: 65 evals, 18 feasible; max throughput seen 171 MSPS; best accuracy 13.32 bits; best feasible area_um2=40573; feasible ranges: data_width 15..17, n_iter 14..16, angle_guard 0..3, frac_guard 1..3
- pipelined_m: 123 evals, 0 feasible; max throughput seen 102 MSPS; best accuracy 13.82 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the narrow feasible region of pipelined, and test whether register-sparse pipelined_m with small m can beat its area.*)
- `pipelined` (27 evals): data_width=14..17, n_iter=12..16, angle_guard=-1..3, frac_guard=0..3, rounding=round. *Why:* All 8 front designs are pipelined; probing slightly smaller width, iteration and guard-bit values near the 2^-12 error edge could cut area below 40573.
- `pipelined_m` (13 evals): data_width=14..17, n_iter=13..16, angle_guard=0..3, frac_guard=1..3, rounding=round, m=2..3. *Why:* Small m should keep Fmax and batch latency within bounds while using fewer pipeline registers; the earlier 0 feasible came from broad ranges, so this narrower test is cheap.

**Result (code):** 40 evaluations this round, 240 total; 27 feasible; hypervolume 7.582e+04 (+1.1%).

**LLM decision:** `stop` — This is the final round, so stop. The front has 11 feasible designs, all pipelined, covering area 38698..45639 um2 and accuracy 12.3..13.3 bits. Hypervolume is 7.582e+04 and gained only +1.1% last round, so it is close to converging. The cheapest feasible design is pipelined data_width=17, n_iter=14, angle_guard=3, frac_guard=0, round, at 38698 um2. Its throughput of 132 MSPS clears the 32 MSPS requirement, and its max error of 0.000192 meets the 2^-12 bound. Unrolled_k reached only 5.79 MSPS with 0 feasible designs, so it cannot meet the 0.5 us batch deadline. Pipelined_m has 0 feasible designs in 136 evaluations. The iterative family was not explored, but at N+3 cycles per result it would be even slower than unrolled_k, and 32 results in 0.5 us need at least 64 MSPS, so it cannot meet the batch constraint. The remaining 160 evaluations are covered by the reserved code-driven front mapping.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 7.582e+04 (gain this round: +1.1%).
Feasible designs: 27 of 240 evaluations (18 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 16% violate; best seen 171
- max_abs_err <= 0.000244141: 75% violate; best seen 6.9e-05 (2^-13.82)
- sys_p99_batch_us <= 0.5: 56% violate; best seen 0.257

Pareto front (feasible, 11 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=38698, accuracy_bits=12.3, ffs=840, throughput_msps=132, max_abs_err=0.000192 (2^-12.35), power_index=2.22
- pipelined [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round] area_um2=40161, accuracy_bits=12.4, ffs=851, throughput_msps=138, max_abs_err=0.000191 (2^-12.36), power_index=2.27
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=40573, accuracy_bits=12.4, ffs=857, throughput_msps=138, max_abs_err=0.000187 (2^-12.38), power_index=2.29
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=1 rounding=round] area_um2=40799, accuracy_bits=12.4, ffs=865, throughput_msps=132, max_abs_err=0.000185 (2^-12.40), power_index=2.31
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=41651, accuracy_bits=12.5, ffs=883, throughput_msps=138, max_abs_err=0.000174 (2^-12.49), power_index=2.36
- pipelined [data_width=17 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=42537, accuracy_bits=12.6, ffs=899, throughput_msps=132, max_abs_err=0.000157 (2^-12.64), power_index=2.4
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=43532, accuracy_bits=12.7, ffs=919, throughput_msps=138, max_abs_err=0.000153 (2^-12.67), power_index=2.46
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=43671, accuracy_bits=12.8, ffs=923, throughput_msps=138, max_abs_err=0.00014 (2^-12.80), power_index=2.47
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=3 rounding=round] area_um2=44954, accuracy_bits=12.9, ffs=949, throughput_msps=132, max_abs_err=0.000134 (2^-12.86), power_index=2.53
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=45639, accuracy_bits=13.3, ffs=963, throughput_msps=132, max_abs_err=9.76e-05 (2^-13.32), power_index=2.57
Front coverage: area_um2 38698..45639 (HV reference 100000); accuracy_bits 12.3..13.3 (HV reference 12); data_width on the front 16..17 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 5.79 MSPS; best accuracy 10.37 bits
- pipelined: 92 evals, 27 feasible; max throughput seen 171 MSPS; best accuracy 13.32 bits; best feasible area_um2=38698; feasible ranges: data_width 15..17, n_iter 14..16, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 136 evals, 0 feasible; max throughput seen 102 MSPS; best accuracy 13.82 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined` (80 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (11 front designs; box front_anchored)
- `pipelined_m` (80 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 160 evaluations this round, 400 total; 75 feasible; hypervolume 2.49e+05 (+228.4%).

**No LLM call** (code's front-mapping round): This is the final round, so stop. The front has 11 feasible designs, all pipelined, covering area 38698..45639 um2 and accuracy 12.3..13.3 bits. Hypervolume is 7.582e+04 and gained only +1.1% last round, so it is close to converging. The cheapest feasible design is pipelined data_width=17, n_iter=14, angle_guard=3, frac_guard=0, round, at 38698 um2. Its throughput of 132 MSPS clears the 32 MSPS requirement, and its max error of 0.000192 meets the 2^-12 bound. Unrolled_k reached only 5.79 MSPS with 0 feasible designs, so it cannot meet the 0.5 us batch deadline. Pipelined_m has 0 feasible designs in 136 evaluations. The iterative family was not explored, but at N+3 cycles per result it would be even slower than unrolled_k, and 32 results in 0.5 us need at least 64 MSPS, so it cannot meet the batch constraint. The remaining 160 evaluations are covered by the reserved code-driven front mapping.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.49e+05 (gain this round: +228.4%).
Feasible designs: 75 of 400 evaluations (57 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 18% violate; best seen 171
- max_abs_err <= 0.000244141: 54% violate; best seen 4.98e-08 (2^-24.26)
- sys_p99_batch_us <= 0.5: 60% violate; best seen 0.257

Pareto front (feasible, 19 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] area_um2=38698, accuracy_bits=12.3, ffs=840, throughput_msps=132, max_abs_err=0.000192 (2^-12.35), power_index=2.22
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round] area_um2=40573, accuracy_bits=12.4, ffs=857, throughput_msps=138, max_abs_err=0.000187 (2^-12.38), power_index=2.29
- pipelined [data_width=16 n_iter=15 angle_guard=3 frac_guard=1 rounding=round] area_um2=41651, accuracy_bits=12.5, ffs=883, throughput_msps=138, max_abs_err=0.000174 (2^-12.49), power_index=2.36
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=43671, accuracy_bits=12.8, ffs=923, throughput_msps=138, max_abs_err=0.00014 (2^-12.80), power_index=2.47
- pipelined [data_width=17 n_iter=15 angle_guard=2 frac_guard=3 rounding=round] area_um2=45639, accuracy_bits=13.3, ffs=963, throughput_msps=132, max_abs_err=9.76e-05 (2^-13.32), power_index=2.57
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=4 rounding=trunc] area_um2=57081, accuracy_bits=15.1, ffs=1221, throughput_msps=119, max_abs_err=2.94e-05 (2^-15.05), power_index=3.25
- pipelined [data_width=22 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] area_um2=58210, accuracy_bits=15.7, ffs=1253, throughput_msps=115, max_abs_err=1.86e-05 (2^-15.72), power_index=3.33
- pipelined [data_width=22 n_iter=17 angle_guard=1 frac_guard=4 rounding=trunc] area_um2=63320, accuracy_bits=15.8, ffs=1355, throughput_msps=108, max_abs_err=1.76e-05 (2^-15.79), power_index=3.6
- pipelined [data_width=25 n_iter=18 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=70010, accuracy_bits=16.9, ffs=1504, throughput_msps=102, max_abs_err=8.31e-06 (2^-16.88), power_index=4
- pipelined [data_width=21 n_iter=21 angle_guard=3 frac_guard=4 rounding=round] area_um2=78905, accuracy_bits=18.2, ffs=1659, throughput_msps=111, max_abs_err=3.39e-06 (2^-18.17), power_index=4.44
Front coverage: area_um2 38698..78905 (HV reference 100000); accuracy_bits 12.3..18.2 (HV reference 12); data_width on the front 16..25 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 5.79 MSPS; best accuracy 10.37 bits
- pipelined: 172 evals, 75 feasible; max throughput seen 171 MSPS; best accuracy 24.26 bits; best feasible area_um2=38698; feasible ranges: data_width 15..28, n_iter 13..26, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 216 evals, 0 feasible; max throughput seen 108 MSPS; best accuracy 22.64 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 21792 in, 5254 out
- provider-reported cost: $0.0961
- full prompts and replies: `llm_trace.jsonl`

