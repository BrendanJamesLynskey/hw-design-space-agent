# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_power_50msps: A 50 MSPS sin/cos unit in sky130 standard cells for a battery-powered radio: max error <= 2^-12. Minimise the relative power index; accuracy is the trade-off.
  target: asic-sky130hd
  constraint: throughput_msps >= 50
  constraint: max_abs_err <= 0.000244141
  objective: min power_index (HV ref 40)
  objective: max accuracy_bits (HV ref 12)
  select: min power_index
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=15,n_iter=15,angle_guard=3,frac_guard=3,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 29584 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7881 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 325 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 129 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.78 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000188 (2^-12.38) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 1.54 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 4.93e-05 (2^-14.31) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 0.404 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 12.4 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.9 dBc, SNR 83.3 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (11 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=15,n_iter=15,angle_guard=3,frac_guard=3,rounding=round,m=3` | 29584 | 325 | 54.3 | 7 | 1.78 | 0.000188 (2^-12.38) | 12.38 |
| 1 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round,m=3` | 29502 | 340 | 51.9 | 7 | 1.81 | 0.000119 (2^-13.04) | 13.04 |
| 2 | `pipelined_m:data_width=16,n_iter=16,angle_guard=3,frac_guard=2,rounding=round,m=3` | 33101 | 395 | 51.9 | 8 | 2.07 | 0.000117 (2^-13.06) | 13.06 |
| 3 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=3` | 34363 | 413 | 51.9 | 8 | 2.16 | 8.41e-05 (2^-13.54) | 13.54 |
| 4 | `pipelined_m:data_width=18,n_iter=15,angle_guard=3,frac_guard=2,rounding=round,m=2` | 37632 | 568 | 69.4 | 10 | 2.69 | 8.22e-05 (2^-13.57) | 13.57 |
| 5 | `pipelined_m:data_width=20,n_iter=16,angle_guard=3,frac_guard=3,rounding=round,m=2` | 43953 | 633 | 64.3 | 10 | 3.05 | 3.35e-05 (2^-14.87) | 14.87 |
| 6 | `pipelined_m:data_width=26,n_iter=16,angle_guard=3,frac_guard=1,rounding=round,m=2` | 52420 | 759 | 52.7 | 10 | 3.65 | 3.06e-05 (2^-15.00) | 15.00 |
| 7 | `pipelined:data_width=20,n_iter=17,angle_guard=3,frac_guard=2,rounding=round` | 58321 | 1231 | 118.9 | 19 | 5.14 | 2.01e-05 (2^-15.61) | 15.61 |
| 8 | `pipelined_m:data_width=24,n_iter=25,angle_guard=2,frac_guard=0,rounding=round,m=2` | 73220 | 1082 | 57.9 | 15 | 5.17 | 1.57e-06 (2^-19.28) | 19.28 |
| 9 | `pipelined_m:data_width=25,n_iter=30,angle_guard=0,frac_guard=1,rounding=round,m=2` | 91504 | 1288 | 57.9 | 17 | 6.28 | 9.91e-07 (2^-19.94) | 19.94 |
| 10 | `pipelined_m:data_width=26,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc,m=2` | 95966 | 1365 | 51.2 | 16 | 6.62 | 1.37e-07 (2^-22.80) | 22.80 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *50 MSPS with error <= 2^-12 needs about 12-14 bits of accuracy. Power is the main objective, so small-area iterative and unrolled designs are the focus, with narrow widths and iteration counts near the accuracy limit. The accuracy_bits objective has a reference of 12, so it covers the region just above that threshold. Pipelined_m is a small hedge, and the fully pipelined family is skipped as likely power-hungry.*)
- `iterative` (51 evals): data_width=12..18, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest shared datapath and few FFs, so likely lowest power if Fmax is high enough for 50 MSPS with N+3 cycles per result; N near 12-16 meets 2^-12 error.
- `unrolled_k` (33 evals): data_width=12..18, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, k=2..4. *Why:* Chaining k rotations per cycle cuts cycles per result, relaxing the clock needed for 50 MSPS at a lower frequency, which may reduce power versus the plain iterative design.
- `pipelined_m` (16 evals): data_width=12..16, n_iter=11..15, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=3..8. *Why:* Gives one result per cycle so throughput is met at a modest clock, with fewer registers than a full pipeline; a hedge that probably costs more power.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `add_family` — No feasible design after 100 evals. Throughput is the binding constraint: 99% of evaluations violate it, and iterative and unrolled_k top out at 10.7 and 8.64 MSPS, far below 50. Only pipelined_m reached 51.2 MSPS, but its best accuracy was 10.39 bits, short of the 12-bit requirement. Accuracy is reachable, since iterative designs hit 12.3-13.4 bits with data_width ~15-17 and n_iter ~14. Pipelined families deliver one result per cycle, so they are the only way to meet 50 MSPS. The next round should use pipelined and pipelined_m with the accuracy-capable parameters (data_width 14-18, n_iter 13-16, some guard bits, round) and drop iterative and unrolled_k. Pipelined is unexplored, and a large m in pipelined_m may give a higher Fmax at lower power.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 99% violate; best seen 51.2
- max_abs_err <= 0.000244141: 72% violate; best seen 8.99e-05 (2^-13.44)

No feasible design found yet. Least-violating designs:
- iterative [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round]: throughput=7.7, max_abs_err=0.000192 (2^-12.35); throughput_msps >= 50 violated by 84.6%
- iterative [data_width=15 n_iter=14 angle_guard=3 frac_guard=3 rounding=round]: throughput=7.7, max_abs_err=0.000215 (2^-12.18); throughput_msps >= 50 violated by 84.6%
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=1 rounding=round]: throughput=7.42, max_abs_err=0.000191 (2^-12.36); throughput_msps >= 50 violated by 85.2%
- iterative [data_width=17 n_iter=14 angle_guard=1 frac_guard=2 rounding=round]: throughput=7.42, max_abs_err=0.000171 (2^-12.51); throughput_msps >= 50 violated by 85.2%
- iterative [data_width=17 n_iter=14 angle_guard=3 frac_guard=1 rounding=trunc]: throughput=7.17, max_abs_err=0.000231 (2^-12.08); throughput_msps >= 50 violated by 85.7%

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 13.44 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 13.06 bits
- pipelined_m: 16 evals, 0 feasible; max throughput seen 51.2 MSPS; best accuracy 10.39 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Throughput is the binding constraint and only pipelined styles can meet it. Accuracy near 12-13 bits needs width 14-18 and about 12-16 iterations, so the search should focus there with both pipelined families.*)
- `pipelined_m` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=0..3, frac_guard=1..3, rounding=round|trunc, m=2..4. *Why:* This family already reached 51.2 MSPS. Raising the width and iteration count to the accuracy-capable region seen in iterative should give feasible designs, and a small m keeps Fmax high enough for 50 MSPS.
- `pipelined` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=0..3, frac_guard=1..3, rounding=round|trunc. *Why:* It is unexplored and gives one result per cycle with the shortest stage delay, so it is the most likely to meet 50 MSPS; the ranges target the 2^-12 accuracy region.

**Result (code):** 100 evaluations this round, 200 total; 35 feasible; hypervolume 84.66 (+inf).

**LLM decision:** `refine` — Only pipelined and pipelined_m are feasible. Iterative and unrolled_k reach at most 10.7 MSPS, so they cannot meet the 50 MSPS floor and should be dropped. The lowest power on the front (1.78) comes from pipelined_m with m=3, and it already sits near the error limit (12.4 bits against the 12.0 requirement). The feasible region is narrow: data_width 15..18, n_iter 14..16, frac_guard 1..3. Power falls as m grows, but throughput was only 54 MSPS at m=3, so larger m may fall below 50. I will therefore concentrate on pipelined_m with m 3..5, smaller data_width and n_iter near the accuracy limit, and keep a small pipelined share for the high-accuracy end of the front. The front covers accuracy_bits 12.4..14.3 and power_index 1.78..4.49, so a later map_front round can fill in the rest.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 84.66 (gain this round: +inf (first feasible designs)).
Feasible designs: 35 of 200 evaluations (24 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 58% violate; best seen 163
- max_abs_err <= 0.000244141: 62% violate; best seen 4.52e-05 (2^-14.43)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=15 n_iter=15 angle_guard=3 frac_guard=3 rounding=round m=3] power_index=1.78, accuracy_bits=12.4, area_um2=29584, ffs=325, throughput_msps=54.3, max_abs_err=0.000188 (2^-12.38)
- pipelined_m [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.85, accuracy_bits=12.6, area_um2=29746, ffs=350, throughput_msps=51.9, max_abs_err=0.00016 (2^-12.61)
- pipelined_m [data_width=15 n_iter=16 angle_guard=3 frac_guard=3 rounding=round m=3] power_index=2.03, accuracy_bits=12.6, area_um2=32448, ffs=385, throughput_msps=54.3, max_abs_err=0.000158 (2^-12.63)
- pipelined_m [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=3] power_index=2.07, accuracy_bits=13.1, area_um2=33101, ffs=395, throughput_msps=51.9, max_abs_err=0.000117 (2^-13.06)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=2.54, accuracy_bits=13.3, area_um2=35546, ffs=539, throughput_msps=75.4, max_abs_err=0.000101 (2^-13.27)
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=2.69, accuracy_bits=13.6, area_um2=37632, ffs=568, throughput_msps=69.4, max_abs_err=8.22e-05 (2^-13.57)
- pipelined [data_width=17 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] power_index=4.29, accuracy_bits=13.6, area_um2=48740, ffs=1028, throughput_msps=132, max_abs_err=8.09e-05 (2^-13.59)
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] power_index=4.31, accuracy_bits=13.7, area_um2=48878, ffs=1032, throughput_msps=132, max_abs_err=7.47e-05 (2^-13.71)
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] power_index=4.49, accuracy_bits=14.3, area_um2=50989, ffs=1076, throughput_msps=128, max_abs_err=5.03e-05 (2^-14.28)
Front coverage: power_index 1.78..4.49 (HV reference 40); accuracy_bits 12.4..14.3 (HV reference 12); data_width on the front 15..18 (registry 8..28).

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 13.44 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 13.06 bits
- pipelined: 50 evals, 16 feasible; max throughput seen 163 MSPS; best accuracy 14.28 bits; best feasible power_index=3.77; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..3, frac_guard 1..3
- pipelined_m: 66 evals, 19 feasible; max throughput seen 91.1 MSPS; best accuracy 14.43 bits; best feasible power_index=1.78; feasible ranges: data_width 15..18, n_iter 14..16, angle_guard 1..3, frac_guard 1..3, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focus the budget on pipelined_m with larger m and slightly smaller widths and iteration counts, since that is where the power minimum lies. Keep a small pipelined share for coverage.*)
- `pipelined_m` (32 evals): data_width=13..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=round, m=2..5. *Why:* This family holds the lowest-power feasible designs. Probing m up to 5 and smaller widths and iteration counts tests whether power can fall further while still meeting 50 MSPS and 2^-12 error.
- `pipelined` (8 evals): data_width=14..18, n_iter=13..16, angle_guard=0..3, frac_guard=0..3, rounding=round. *Why:* Gives high-accuracy, higher-power points that extend the front, and checks whether smaller pipelined designs can get power below its current best feasible value of 3.77.

**Result (code):** 40 evaluations this round, 240 total; 53 feasible; hypervolume 85.01 (+0.4%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible are allowed. The constraints are clearly reachable: 8 feasible Pareto designs exist, 53 of 240 evaluations were feasible, and the best seen accuracy of 14.43 bits comfortably clears the 12-bit requirement. Hypervolume gain this round was only +0.4%, below the 1% epsilon, so the front has stalled. The selected design under the min power_index rule is pipelined_m (data_width=15, n_iter=15, angle_guard=3, frac_guard=3, round, m=3). It has power_index 1.78, 12.4 accuracy bits, 54.3 MSPS and max error 0.000188, so it meets both constraints. The front spans power 1.78..4.49 and accuracy 12.4..14.3 bits. Iterative and unrolled_k were never feasible, peaking at 10.7 and 8.64 MSPS against the 50 MSPS requirement.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 85.01 (gain this round: +0.4%).
Feasible designs: 53 of 240 evaluations (36 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 53% violate; best seen 163
- max_abs_err <= 0.000244141: 57% violate; best seen 4.52e-05 (2^-14.43)

Pareto front (feasible, 8 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=15 n_iter=15 angle_guard=3 frac_guard=3 rounding=round m=3] power_index=1.78, accuracy_bits=12.4, area_um2=29584, ffs=325, throughput_msps=54.3, max_abs_err=0.000188 (2^-12.38)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.81, accuracy_bits=13, area_um2=29502, ffs=340, throughput_msps=51.9, max_abs_err=0.000119 (2^-13.04)
- pipelined_m [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=3] power_index=2.07, accuracy_bits=13.1, area_um2=33101, ffs=395, throughput_msps=51.9, max_abs_err=0.000117 (2^-13.06)
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.16, accuracy_bits=13.5, area_um2=34363, ffs=413, throughput_msps=51.9, max_abs_err=8.41e-05 (2^-13.54)
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=2.69, accuracy_bits=13.6, area_um2=37632, ffs=568, throughput_msps=69.4, max_abs_err=8.22e-05 (2^-13.57)
- pipelined [data_width=17 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] power_index=4.29, accuracy_bits=13.6, area_um2=48740, ffs=1028, throughput_msps=132, max_abs_err=8.09e-05 (2^-13.59)
- pipelined [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] power_index=4.31, accuracy_bits=13.7, area_um2=48878, ffs=1032, throughput_msps=132, max_abs_err=7.47e-05 (2^-13.71)
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] power_index=4.49, accuracy_bits=14.3, area_um2=50989, ffs=1076, throughput_msps=128, max_abs_err=5.03e-05 (2^-14.28)
Front coverage: power_index 1.78..4.49 (HV reference 40); accuracy_bits 12.4..14.3 (HV reference 12); data_width on the front 15..18 (registry 8..28).

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 13.44 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 13.06 bits
- pipelined: 58 evals, 19 feasible; max throughput seen 163 MSPS; best accuracy 14.28 bits; best feasible power_index=3.75; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 0..3, frac_guard 1..3
- pipelined_m: 98 evals, 34 feasible; max throughput seen 91.1 MSPS; best accuracy 14.43 bits; best feasible power_index=1.78; feasible ranges: data_width 15..18, n_iter 14..16, angle_guard 0..3, frac_guard 0..3, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (100 evals): data_width=14..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (5 front designs; box front_anchored)
- `pipelined` (60 evals): data_width=16..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (3 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 151 feasible; hypervolume 379.4 (+346.3%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible are allowed. The constraints are clearly reachable: 8 feasible Pareto designs exist, 53 of 240 evaluations were feasible, and the best seen accuracy of 14.43 bits comfortably clears the 12-bit requirement. Hypervolume gain this round was only +0.4%, below the 1% epsilon, so the front has stalled. The selected design under the min power_index rule is pipelined_m (data_width=15, n_iter=15, angle_guard=3, frac_guard=3, round, m=3). It has power_index 1.78, 12.4 accuracy bits, 54.3 MSPS and max error 0.000188, so it meets both constraints. The front spans power 1.78..4.49 and accuracy 12.4..14.3 bits. Iterative and unrolled_k were never feasible, peaking at 10.7 and 8.64 MSPS against the 50 MSPS requirement.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 379.4 (gain this round: +346.3%).
Feasible designs: 151 of 400 evaluations (122 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 45% violate; best seen 163
- max_abs_err <= 0.000244141: 39% violate; best seen 1.37e-07 (2^-22.80)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=15 n_iter=15 angle_guard=3 frac_guard=3 rounding=round m=3] power_index=1.78, accuracy_bits=12.4, area_um2=29584, ffs=325, throughput_msps=54.3, max_abs_err=0.000188 (2^-12.38)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=3] power_index=1.81, accuracy_bits=13, area_um2=29502, ffs=340, throughput_msps=51.9, max_abs_err=0.000119 (2^-13.04)
- pipelined_m [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round m=3] power_index=2.07, accuracy_bits=13.1, area_um2=33101, ffs=395, throughput_msps=51.9, max_abs_err=0.000117 (2^-13.06)
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=2.16, accuracy_bits=13.5, area_um2=34363, ffs=413, throughput_msps=51.9, max_abs_err=8.41e-05 (2^-13.54)
- pipelined_m [data_width=18 n_iter=15 angle_guard=3 frac_guard=2 rounding=round m=2] power_index=2.69, accuracy_bits=13.6, area_um2=37632, ffs=568, throughput_msps=69.4, max_abs_err=8.22e-05 (2^-13.57)
- pipelined_m [data_width=26 n_iter=16 angle_guard=3 frac_guard=1 rounding=round m=2] power_index=3.65, accuracy_bits=15, area_um2=52420, ffs=759, throughput_msps=52.7, max_abs_err=3.06e-05 (2^-15.00)
- pipelined [data_width=20 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] power_index=5.14, accuracy_bits=15.6, area_um2=58321, ffs=1231, throughput_msps=119, max_abs_err=2.01e-05 (2^-15.61)
- pipelined_m [data_width=24 n_iter=25 angle_guard=2 frac_guard=0 rounding=round m=2] power_index=5.17, accuracy_bits=19.3, area_um2=73220, ffs=1082, throughput_msps=57.9, max_abs_err=1.57e-06 (2^-19.28)
- pipelined_m [data_width=25 n_iter=30 angle_guard=0 frac_guard=1 rounding=round m=2] power_index=6.28, accuracy_bits=19.9, area_um2=91504, ffs=1288, throughput_msps=57.9, max_abs_err=9.91e-07 (2^-19.94)
- pipelined_m [data_width=26 n_iter=28 angle_guard=3 frac_guard=4 rounding=trunc m=2] power_index=6.62, accuracy_bits=22.8, area_um2=95966, ffs=1365, throughput_msps=51.2, max_abs_err=1.37e-07 (2^-22.80)
Front coverage: power_index 1.78..6.62 (HV reference 40); accuracy_bits 12.4..22.8 (HV reference 12); data_width on the front 15..26 (registry 8..28).

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.7 MSPS; best accuracy 13.44 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.64 MSPS; best accuracy 13.06 bits
- pipelined: 118 evals, 75 feasible; max throughput seen 163 MSPS; best accuracy 22.41 bits; best feasible power_index=3.75; feasible ranges: data_width 16..27, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 198 evals, 76 feasible; max throughput seen 91.1 MSPS; best accuracy 22.80 bits; best feasible power_index=1.78; feasible ranges: data_width 15..26, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19221 in, 2871 out
- provider-reported cost: $0.0672
- full prompts and replies: `llm_trace.jsonl`

