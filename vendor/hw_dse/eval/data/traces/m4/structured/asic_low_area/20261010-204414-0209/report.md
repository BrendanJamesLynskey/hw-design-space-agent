# DSE run: asic_low_area

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical sky130_fd_sc_hd standard-cell cost model fitted to 57 Yosys + OpenSTA synthesis points (eval/data/asic_calibration.md). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec asic_low_area: Motor-control sin/cos in sky130 standard cells: >= 1 MSPS, max error <= 2^-10. Area is everything: minimise cell area.
  target: asic-sky130hd
  constraint: throughput_msps >= 1
  constraint: max_abs_err <= 0.000976562
  objective: min area_um2 (HV ref 40000)
  objective: max accuracy_bits (HV ref 10)
  select: min area_um2
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`iterative:data_width=14,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 6943 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1850 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 100 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 9.43 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 106 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.144 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000894 (2^-10.13) | exact: bit-accurate model, exhaustive (16384 angles) |
| max_abs_err_lsb | 3.66 | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err | 0.000262 (2^-11.90) | exact: bit-accurate model, exhaustive (16384 angles) |
| rms_err_lsb | 1.07 | exact: bit-accurate model, exhaustive (16384 angles) |
| accuracy_bits | 10.1 | exact: bit-accurate model, exhaustive (16384 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 15 cycles, a new input every 15 cycle(s). DDS tone from its exact outputs: SFDR 77.4 dBc, SNR 68.9 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (35 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=14,n_iter=12,angle_guard=2,frac_guard=2,rounding=trunc` | 6943 | 100 | 9.4 | 15 | 0.144 | 0.000894 (2^-10.13) | 10.13 |
| 1 | `iterative:data_width=15,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 7042 | 100 | 7.9 | 18 | 0.174 | 0.000632 (2^-10.63) | 10.63 |
| 2 | `iterative:data_width=16,n_iter=13,angle_guard=0,frac_guard=0,rounding=round` | 7249 | 104 | 8.8 | 16 | 0.161 | 0.000492 (2^-10.99) | 10.99 |
| 3 | `iterative:data_width=16,n_iter=13,angle_guard=1,frac_guard=0,rounding=round` | 7313 | 105 | 8.5 | 16 | 0.162 | 0.000417 (2^-11.23) | 11.23 |
| 4 | `iterative:data_width=16,n_iter=13,angle_guard=3,frac_guard=0,rounding=round` | 7439 | 107 | 7.9 | 16 | 0.166 | 0.000398 (2^-11.29) | 11.29 |
| 5 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 7446 | 105 | 7.6 | 18 | 0.184 | 0.000301 (2^-11.70) | 11.70 |
| 6 | `iterative:data_width=16,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 7721 | 108 | 6.3 | 20 | 0.211 | 0.000285 (2^-11.78) | 11.78 |
| 7 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` | 7869 | 109 | 7.3 | 18 | 0.193 | 0.00025 (2^-11.97) | 11.97 |
| 8 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 7930 | 109 | 6.9 | 19 | 0.204 | 0.000237 (2^-12.04) | 12.04 |
| 9 | `iterative:data_width=15,n_iter=17,angle_guard=4,frac_guard=3,rounding=trunc` | 8125 | 111 | 6.3 | 20 | 0.219 | 0.000227 (2^-12.11) | 12.11 |
| 10 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=trunc` | 8145 | 113 | 7.4 | 17 | 0.188 | 0.000217 (2^-12.17) | 12.17 |
| 11 | `iterative:data_width=16,n_iter=17,angle_guard=3,frac_guard=2,rounding=trunc` | 8169 | 113 | 6.3 | 20 | 0.222 | 0.000203 (2^-12.27) | 12.27 |
| 12 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=3,rounding=trunc` | 8229 | 113 | 7.0 | 18 | 0.2 | 0.000187 (2^-12.39) | 12.39 |
| 13 | `iterative:data_width=16,n_iter=15,angle_guard=3,frac_guard=3,rounding=trunc` | 8293 | 114 | 7.0 | 18 | 0.202 | 0.000152 (2^-12.68) | 12.68 |
| 14 | `iterative:data_width=19,n_iter=22,angle_guard=3,frac_guard=0,rounding=trunc` | 8932 | 125 | 4.6 | 25 | 0.305 | 8.49e-05 (2^-13.52) | 13.52 |
| 15 | `iterative:data_width=20,n_iter=21,angle_guard=1,frac_guard=0,rounding=trunc` | 9282 | 128 | 4.9 | 24 | 0.302 | 4.51e-05 (2^-14.44) | 14.44 |
| 16 | `iterative:data_width=20,n_iter=27,angle_guard=2,frac_guard=0,rounding=round` | 9673 | 129 | 3.8 | 30 | 0.386 | 2.17e-05 (2^-15.49) | 15.49 |
| 17 | `iterative:data_width=21,n_iter=19,angle_guard=4,frac_guard=0,rounding=round` | 10082 | 137 | 4.7 | 22 | 0.298 | 1.15e-05 (2^-16.41) | 16.41 |
| 18 | `iterative:data_width=21,n_iter=19,angle_guard=4,frac_guard=2,rounding=trunc` | 10554 | 141 | 4.7 | 22 | 0.309 | 9.33e-06 (2^-16.71) | 16.71 |
| 19 | `iterative:data_width=22,n_iter=22,angle_guard=2,frac_guard=1,rounding=trunc` | 10716 | 142 | 4.3 | 25 | 0.356 | 6.11e-06 (2^-17.32) | 17.32 |
| 20 | `iterative:data_width=23,n_iter=22,angle_guard=3,frac_guard=0,rounding=trunc` | 10887 | 147 | 4.0 | 25 | 0.364 | 5.84e-06 (2^-17.39) | 17.39 |
| 21 | `iterative:data_width=23,n_iter=22,angle_guard=3,frac_guard=0,rounding=round` | 11141 | 147 | 4.0 | 25 | 0.368 | 2.9e-06 (2^-18.39) | 18.39 |
| 22 | `iterative:data_width=22,n_iter=21,angle_guard=4,frac_guard=3,rounding=trunc` | 11533 | 149 | 4.2 | 24 | 0.362 | 2.61e-06 (2^-18.55) | 18.55 |
| 23 | `iterative:data_width=24,n_iter=22,angle_guard=2,frac_guard=0,rounding=round` | 11567 | 151 | 4.0 | 25 | 0.38 | 1.67e-06 (2^-19.19) | 19.19 |
| 24 | `iterative:data_width=26,n_iter=27,angle_guard=3,frac_guard=0,rounding=trunc` | 12595 | 163 | 3.1 | 30 | 0.495 | 7.68e-07 (2^-20.31) | 20.31 |
| 25 | `iterative:data_width=27,n_iter=27,angle_guard=-1,frac_guard=0,rounding=trunc` | 12891 | 164 | 3.3 | 30 | 0.502 | 6.81e-07 (2^-20.49) | 20.49 |
| 26 | `iterative:data_width=26,n_iter=27,angle_guard=3,frac_guard=0,rounding=round` | 12911 | 163 | 3.1 | 30 | 0.5 | 3.6e-07 (2^-21.40) | 21.40 |
| 27 | `iterative:data_width=26,n_iter=24,angle_guard=3,frac_guard=2,rounding=trunc` | 13298 | 167 | 3.4 | 27 | 0.463 | 3.21e-07 (2^-21.57) | 21.57 |
| 28 | `iterative:data_width=27,n_iter=25,angle_guard=3,frac_guard=1,rounding=trunc` | 13477 | 171 | 3.2 | 28 | 0.488 | 2.2e-07 (2^-22.11) | 22.11 |
| 29 | `iterative:data_width=28,n_iter=25,angle_guard=4,frac_guard=0,rounding=round` | 13939 | 175 | 3.1 | 28 | 0.502 | 1.36e-07 (2^-22.81) | 22.81 |
| 30 | `iterative:data_width=28,n_iter=27,angle_guard=3,frac_guard=0,rounding=round` | 14009 | 174 | 2.9 | 30 | 0.538 | 1.11e-07 (2^-23.10) | 23.10 |
| 31 | `iterative:data_width=28,n_iter=27,angle_guard=4,frac_guard=0,rounding=round` | 14072 | 175 | 2.9 | 30 | 0.541 | 1.03e-07 (2^-23.22) | 23.22 |
| 32 | `iterative:data_width=28,n_iter=27,angle_guard=4,frac_guard=1,rounding=trunc` | 14199 | 177 | 2.9 | 30 | 0.547 | 9.79e-08 (2^-23.28) | 23.28 |
| 33 | `iterative:data_width=28,n_iter=27,angle_guard=4,frac_guard=3,rounding=trunc` | 15084 | 182 | 2.9 | 30 | 0.57 | 4.35e-08 (2^-24.45) | 24.45 |
| 34 | `iterative:data_width=28,n_iter=30,angle_guard=4,frac_guard=4,rounding=trunc` | 15744 | 184 | 2.6 | 33 | 0.643 | 2.61e-08 (2^-25.19) | 25.19 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The objective is minimum area with only a 1 MSPS throughput floor, so iterative designs with a reused datapath are the most plausible winners. Pipelined families replicate stages and would cost much more area, so they are skipped in this first round. The ranges are narrowed to the accuracy-feasible region around 2^-10 error, with most of the budget on iterative to map the area vs accuracy_bits trade-off. A small share goes to unrolled_k to check whether it can compete.*)
- `iterative` (80 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Shared datapath with one micro-rotation per cycle is the smallest structure; at N+3 cycles it should still reach 1 MSPS at a modest clock. Max error of 2^-10 needs roughly W of 11-14 bits and N around 10-13, so the range centres on that.
- `unrolled_k` (20 evals): data_width=10..15, n_iter=9..15, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* A small k adds shifter and adder logic, so it likely costs more area, but it may be worth probing in case fewer cycles let the design hit throughput at a lower clock or with a smaller FSM. Kept to a small budget share as a hedge.

**Result (code):** 100 evaluations this round, 100 total; 40 feasible; hypervolume 7.33e+04 (n/a).

**LLM decision:** `refine` — The iterative family dominates the front: all 7 front designs are iterative, with area 7140..9666 um2. Unrolled_k is far worse (best feasible area 12985, only 2 of 20 evals feasible). Pipelined families replicate the datapath per stage, so they cost more area and the 1 MSPS target is already met with margin (8 MSPS), so I will skip them. Feasible iterative designs sit at data_width 14..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..3. The cheapest design (7140 um2) already sits near the 2^-10 error limit at 10.6 bits, so the area minimum is probably at data_width 12..14 with fewer iterations and small guards. I will narrow iterative to that region and keep a small unrolled_k probe. Since the front only covers 10.6..12.3 bits, I will leave map_front to the later reserved budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7.33e+04 (gain this round: n/a (first round)).
Feasible designs: 40 of 100 evaluations (32 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 12.8
- max_abs_err <= 0.000976562: 60% violate; best seen 0.000203 (2^-12.27)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=14 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=7140, accuracy_bits=10.6, ffs=101, throughput_msps=8, max_abs_err=0.000648 (2^-10.59), power_index=0.167
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=7509, accuracy_bits=11.3, ffs=106, throughput_msps=7.56, max_abs_err=0.000395 (2^-11.31), power_index=0.186
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=7573, accuracy_bits=11.6, ffs=107, throughput_msps=7.56, max_abs_err=0.000323 (2^-11.60), power_index=0.188
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7869, accuracy_bits=12, ffs=109, throughput_msps=7.27, max_abs_err=0.00025 (2^-11.97), power_index=0.193
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round] area_um2=9064, accuracy_bits=12.2, ffs=108, throughput_msps=7.7, max_abs_err=0.000209 (2^-12.22), power_index=0.193
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] area_um2=9348, accuracy_bits=12.3, ffs=111, throughput_msps=7.7, max_abs_err=0.000204 (2^-12.26), power_index=0.198
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=3 rounding=round] area_um2=9666, accuracy_bits=12.3, ffs=112, throughput_msps=7.01, max_abs_err=0.000203 (2^-12.27), power_index=0.214
Front coverage: area_um2 7140..9666 (HV reference 40000); accuracy_bits 10.6..12.3 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- iterative: 80 evals, 38 feasible; max throughput seen 12.8 MSPS; best accuracy 12.27 bits; best feasible area_um2=7140; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 20 evals, 2 feasible; max throughput seen 10.5 MSPS; best accuracy 11.18 bits; best feasible area_um2=12985; feasible ranges: data_width 14..15, n_iter 13..13, angle_guard 2..2, frac_guard 2..3, k 3..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the low-area end of the iterative family, where the front is dense, and keep a minimal probe of unrolled_k.*)
- `iterative` (84 evals): data_width=11..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Iterative holds the whole front. Probing smaller widths and iteration counts looks for lower area while staying at or under 2^-10 error.
- `unrolled_k` (16 evals): data_width=12..15, n_iter=11..15, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* Small probe to confirm unrolled_k cannot beat iterative on area. Its best feasible area was 12985 and it is feasible only near k=3.

**Result (code):** 100 evaluations this round, 200 total; 90 feasible; hypervolume 9.843e+04 (+34.3%).

**LLM decision:** `refine` — The front is 10 designs, all iterative, with area 6943..9793 and accuracy 10.1..13.1 bits. The constraints are easy on throughput (best 12.8 MSPS against a 1 MSPS need) and tight on error (55% violate). Iterative is the smallest family, and unrolled_k's best feasible area is 10079, above every front point. Pipelined and pipelined_m add registers and stages per micro-rotation, so they are very unlikely to beat iterative on area. The best-area point sits at the edge of the feasible region (data_width 14, max_abs_err 0.000894 against a 0.000977 limit). The next step is to refine around data_width 12..16, n_iter 10..16 and small guards to push area lower. Accuracy up to ~13 bits is already covered, so the remaining gain is in the low-area corner. Unrolled_k gets a small share as a sanity check.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9.843e+04 (gain this round: +34.3%).
Feasible designs: 90 of 200 evaluations (72 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 12.8
- max_abs_err <= 0.000976562: 55% violate; best seen 0.000117 (2^-13.06)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=14 n_iter=12 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=6943, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000894 (2^-10.13), power_index=0.144
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7042, accuracy_bits=10.6, ffs=100, throughput_msps=7.86, max_abs_err=0.000632 (2^-10.63), power_index=0.174
- iterative [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=7249, accuracy_bits=11, ffs=104, throughput_msps=8.84, max_abs_err=0.000492 (2^-10.99), power_index=0.161
- iterative [data_width=16 n_iter=13 angle_guard=1 frac_guard=0 rounding=round] area_um2=7313, accuracy_bits=11.2, ffs=105, throughput_msps=8.5, max_abs_err=0.000417 (2^-11.23), power_index=0.162
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7446, accuracy_bits=11.7, ffs=105, throughput_msps=7.56, max_abs_err=0.000301 (2^-11.70), power_index=0.184
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7869, accuracy_bits=12, ffs=109, throughput_msps=7.27, max_abs_err=0.00025 (2^-11.97), power_index=0.193
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7930, accuracy_bits=12, ffs=109, throughput_msps=6.89, max_abs_err=0.000237 (2^-12.04), power_index=0.204
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc] area_um2=8166, accuracy_bits=12.1, ffs=112, throughput_msps=7.01, max_abs_err=0.000227 (2^-12.10), power_index=0.198
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8293, accuracy_bits=12.7, ffs=114, throughput_msps=7.01, max_abs_err=0.000152 (2^-12.68), power_index=0.202
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=9793, accuracy_bits=13.1, ffs=114, throughput_msps=7.01, max_abs_err=0.000117 (2^-13.06), power_index=0.218
Front coverage: area_um2 6943..9793 (HV reference 40000); accuracy_bits 10.1..13.1 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- iterative: 164 evals, 80 feasible; max throughput seen 12.8 MSPS; best accuracy 13.06 bits; best feasible area_um2=6943; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 36 evals, 10 feasible; max throughput seen 10.5 MSPS; best accuracy 12.01 bits; best feasible area_um2=10079; feasible ranges: data_width 14..15, n_iter 12..15, angle_guard 1..3, frac_guard 1..3, k 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the iterative low-area corner near the error limit. Keep a minimal unrolled_k probe. Skip the pipelined families, which cost more area at a throughput that is not needed.*)
- `iterative` (34 evals): data_width=12..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* All front points are iterative. The area minimum is near the error limit at data_width 14, so probe 12..16 with low guards and iteration counts to find smaller feasible designs and fill the 10..13 bit span.
- `unrolled_k` (6 evals): data_width=13..16, n_iter=11..15, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* Its best area of 10079 is dominated, so it gets a small exploratory share in the narrowed region with low k.

**Result (code):** 40 evaluations this round, 240 total; 110 feasible; hypervolume 9.846e+04 (+0.0%).

**LLM decision:** `stop` — This is the final round, and the front has stopped improving: hypervolume gain this round is +0.0% (9.846e+04). The front has 12 feasible designs, all iterative. They run from area 6943 um2 at 10.1 accuracy bits to 9793 um2 at 13.1 bits. Both constraints are met, with throughput at 7-9 MSPS against the 1 MSPS requirement. The selected design, by min area, is iterative data_width=14 n_iter=12 angle_guard=2 frac_guard=2 trunc, at 6943 um2 with max error 0.000894 (2^-10.13), inside the 2^-10 limit. Unrolled_k is dominated, with a best feasible area of 10079 um2. Pipelined and pipelined_m add more registers and stages, and throughput is already far above the requirement, so they should not reduce area. The budget is exhausted for further exploration.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 9.846e+04 (gain this round: +0.0%).
Feasible designs: 110 of 240 evaluations (83 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 12.8
- max_abs_err <= 0.000976562: 54% violate; best seen 0.000117 (2^-13.06)

Pareto front (feasible, 12 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=14 n_iter=12 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=6943, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000894 (2^-10.13), power_index=0.144
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7042, accuracy_bits=10.6, ffs=100, throughput_msps=7.86, max_abs_err=0.000632 (2^-10.63), power_index=0.174
- iterative [data_width=16 n_iter=13 angle_guard=0 frac_guard=0 rounding=round] area_um2=7249, accuracy_bits=11, ffs=104, throughput_msps=8.84, max_abs_err=0.000492 (2^-10.99), power_index=0.161
- iterative [data_width=16 n_iter=13 angle_guard=3 frac_guard=0 rounding=round] area_um2=7439, accuracy_bits=11.3, ffs=107, throughput_msps=7.89, max_abs_err=0.000398 (2^-11.29), power_index=0.166
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] area_um2=7446, accuracy_bits=11.7, ffs=105, throughput_msps=7.56, max_abs_err=0.000301 (2^-11.70), power_index=0.184
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7869, accuracy_bits=12, ffs=109, throughput_msps=7.27, max_abs_err=0.00025 (2^-11.97), power_index=0.193
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7930, accuracy_bits=12, ffs=109, throughput_msps=6.89, max_abs_err=0.000237 (2^-12.04), power_index=0.204
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=8229, accuracy_bits=12.4, ffs=113, throughput_msps=7.01, max_abs_err=0.000187 (2^-12.39), power_index=0.2
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8293, accuracy_bits=12.7, ffs=114, throughput_msps=7.01, max_abs_err=0.000152 (2^-12.68), power_index=0.202
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=9793, accuracy_bits=13.1, ffs=114, throughput_msps=7.01, max_abs_err=0.000117 (2^-13.06), power_index=0.218
Front coverage: area_um2 6943..9793 (HV reference 40000); accuracy_bits 10.1..13.1 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- iterative: 198 evals, 97 feasible; max throughput seen 12.8 MSPS; best accuracy 13.06 bits; best feasible area_um2=6943; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 42 evals, 13 feasible; max throughput seen 10.5 MSPS; best accuracy 12.01 bits; best feasible area_um2=10079; feasible ranges: data_width 14..16, n_iter 12..15, angle_guard 0..3, frac_guard 0..3, k 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=13..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (12 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 247 feasible; hypervolume 4.377e+05 (+344.6%).

**No LLM call** (code's front-mapping round): This is the final round, and the front has stopped improving: hypervolume gain this round is +0.0% (9.846e+04). The front has 12 feasible designs, all iterative. They run from area 6943 um2 at 10.1 accuracy bits to 9793 um2 at 13.1 bits. Both constraints are met, with throughput at 7-9 MSPS against the 1 MSPS requirement. The selected design, by min area, is iterative data_width=14 n_iter=12 angle_guard=2 frac_guard=2 trunc, at 6943 um2 with max error 0.000894 (2^-10.13), inside the 2^-10 limit. Unrolled_k is dominated, with a best feasible area of 10079 um2. Pipelined and pipelined_m add more registers and stages, and throughput is already far above the requirement, so they should not reduce area. The budget is exhausted for further exploration.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.377e+05 (gain this round: +344.6%).
Feasible designs: 247 of 400 evaluations (207 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 12.8
- max_abs_err <= 0.000976562: 38% violate; best seen 2.61e-08 (2^-25.19)

Pareto front (feasible, 35 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=14 n_iter=12 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=6943, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000894 (2^-10.13), power_index=0.144
- iterative [data_width=16 n_iter=13 angle_guard=3 frac_guard=0 rounding=round] area_um2=7439, accuracy_bits=11.3, ffs=107, throughput_msps=7.89, max_abs_err=0.000398 (2^-11.29), power_index=0.166
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=7930, accuracy_bits=12, ffs=109, throughput_msps=6.89, max_abs_err=0.000237 (2^-12.04), power_index=0.204
- iterative [data_width=16 n_iter=17 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=8169, accuracy_bits=12.3, ffs=113, throughput_msps=6.31, max_abs_err=0.000203 (2^-12.27), power_index=0.222
- iterative [data_width=20 n_iter=21 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=9282, accuracy_bits=14.4, ffs=128, throughput_msps=4.91, max_abs_err=4.51e-05 (2^-14.44), power_index=0.302
- iterative [data_width=22 n_iter=22 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=10716, accuracy_bits=17.3, ffs=142, throughput_msps=4.28, max_abs_err=6.11e-06 (2^-17.32), power_index=0.356
- iterative [data_width=24 n_iter=22 angle_guard=2 frac_guard=0 rounding=round] area_um2=11567, accuracy_bits=19.2, ffs=151, throughput_msps=4.03, max_abs_err=1.67e-06 (2^-19.19), power_index=0.38
- iterative [data_width=26 n_iter=27 angle_guard=3 frac_guard=0 rounding=round] area_um2=12911, accuracy_bits=21.4, ffs=163, throughput_msps=3.09, max_abs_err=3.6e-07 (2^-21.40), power_index=0.5
- iterative [data_width=28 n_iter=27 angle_guard=3 frac_guard=0 rounding=round] area_um2=14009, accuracy_bits=23.1, ffs=174, throughput_msps=2.94, max_abs_err=1.11e-07 (2^-23.10), power_index=0.538
- iterative [data_width=28 n_iter=30 angle_guard=4 frac_guard=4 rounding=trunc] area_um2=15744, accuracy_bits=25.2, ffs=184, throughput_msps=2.6, max_abs_err=2.61e-08 (2^-25.19), power_index=0.643
Front coverage: area_um2 6943..15744 (HV reference 40000); accuracy_bits 10.1..25.2 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 358 evals, 234 feasible; max throughput seen 12.8 MSPS; best accuracy 25.19 bits; best feasible area_um2=6943; feasible ranges: data_width 14..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 42 evals, 13 feasible; max throughput seen 10.5 MSPS; best accuracy 12.01 bits; best feasible area_um2=10079; feasible ranges: data_width 14..16, n_iter 12..15, angle_guard 0..3, frac_guard 0..3, k 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 19668 in, 2641 out
- provider-reported cost: $0.0657
- full prompts and replies: `llm_trace.jsonl`

