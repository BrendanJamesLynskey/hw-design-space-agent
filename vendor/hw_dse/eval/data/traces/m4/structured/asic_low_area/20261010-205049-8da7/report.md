# DSE run: asic_low_area

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
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
`iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 6860 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 1828 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 100 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 142 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 9.43 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 106 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.144 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000917 (2^-10.09) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 7.51 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000249 (2^-11.97) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 2.04 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.1 | exact: bit-accurate model, exhaustive (32768 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 15 cycles, a new input every 15 cycle(s). DDS tone from its exact outputs: SFDR 79.8 dBc, SNR 69.5 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

| tool | area µm² est → meas | FFs est → meas | Fmax MHz est → meas |
|---|---|---|---|
| measured (yosys+opensta yosys 0.33 + OpenSTA 3.1.0, sky130_fd_sc_hd, tt_025C_1v80) | 6860 → 7217 (+5.2%) | 100 → 107 (+7.5%) | 142 → 161 (+13.6%) |

Winner check (1 of 35 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on

## Pareto front (35 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=0,rounding=round` | 6860 | 100 | 9.4 | 15 | 0.144 | 0.000917 (2^-10.09) | 10.09 |
| 1 | `iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` | 6924 | 101 | 9.1 | 15 | 0.145 | 0.000835 (2^-10.23) | 10.23 |
| 2 | `iterative:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round` | 6987 | 102 | 8.7 | 15 | 0.147 | 0.000803 (2^-10.28) | 10.28 |
| 3 | `iterative:data_width=14,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 7125 | 100 | 7.9 | 18 | 0.175 | 0.000648 (2^-10.59) | 10.59 |
| 4 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 7142 | 101 | 7.2 | 19 | 0.186 | 0.000599 (2^-10.71) | 10.71 |
| 5 | `iterative:data_width=14,n_iter=13,angle_guard=3,frac_guard=3,rounding=trunc` | 7352 | 103 | 8.5 | 16 | 0.161 | 0.000556 (2^-10.81) | 10.81 |
| 6 | `iterative:data_width=16,n_iter=13,angle_guard=2,frac_guard=0,rounding=round` | 7376 | 106 | 8.2 | 16 | 0.164 | 0.00041 (2^-11.25) | 11.25 |
| 7 | `iterative:data_width=16,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 7431 | 104 | 7.4 | 19 | 0.193 | 0.000373 (2^-11.39) | 11.39 |
| 8 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 7509 | 106 | 7.3 | 18 | 0.186 | 0.000285 (2^-11.78) | 11.78 |
| 9 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 7886 | 107 | 6.9 | 19 | 0.202 | 0.000278 (2^-11.81) | 11.81 |
| 10 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=3,rounding=trunc` | 8166 | 112 | 7.0 | 18 | 0.198 | 0.000227 (2^-12.10) | 12.10 |
| 11 | `iterative:data_width=16,n_iter=15,angle_guard=3,frac_guard=3,rounding=trunc` | 8293 | 114 | 7.0 | 18 | 0.202 | 0.000152 (2^-12.68) | 12.68 |
| 12 | `iterative:data_width=16,n_iter=16,angle_guard=3,frac_guard=3,rounding=trunc` | 8366 | 114 | 6.6 | 19 | 0.214 | 0.000146 (2^-12.74) | 12.74 |
| 13 | `iterative:data_width=16,n_iter=22,angle_guard=3,frac_guard=3,rounding=trunc` | 8611 | 115 | 5.0 | 25 | 0.287 | 0.000142 (2^-12.78) | 12.78 |
| 14 | `iterative:data_width=20,n_iter=25,angle_guard=-1,frac_guard=0,rounding=trunc` | 9167 | 126 | 4.4 | 28 | 0.347 | 7.71e-05 (2^-13.66) | 13.66 |
| 15 | `iterative:data_width=17,n_iter=28,angle_guard=3,frac_guard=4,rounding=trunc` | 9493 | 123 | 3.8 | 31 | 0.385 | 6.92e-05 (2^-13.82) | 13.82 |
| 16 | `iterative:data_width=19,n_iter=16,angle_guard=2,frac_guard=4,rounding=trunc` | 9859 | 131 | 5.8 | 19 | 0.249 | 4.47e-05 (2^-14.45) | 14.45 |
| 17 | `iterative:data_width=19,n_iter=16,angle_guard=3,frac_guard=4,rounding=trunc` | 9922 | 132 | 5.8 | 19 | 0.251 | 4.04e-05 (2^-14.59) | 14.59 |
| 18 | `iterative:data_width=19,n_iter=16,angle_guard=4,frac_guard=4,rounding=trunc` | 9985 | 134 | 5.8 | 19 | 0.253 | 3.9e-05 (2^-14.64) | 14.64 |
| 19 | `iterative:data_width=20,n_iter=26,angle_guard=1,frac_guard=2,rounding=trunc` | 10094 | 132 | 3.9 | 29 | 0.386 | 1.79e-05 (2^-15.77) | 15.77 |
| 20 | `iterative:data_width=20,n_iter=22,angle_guard=3,frac_guard=2,rounding=trunc` | 10184 | 135 | 4.4 | 25 | 0.337 | 1.42e-05 (2^-16.10) | 16.10 |
| 21 | `iterative:data_width=20,n_iter=22,angle_guard=4,frac_guard=2,rounding=trunc` | 10247 | 136 | 4.3 | 25 | 0.34 | 1.38e-05 (2^-16.14) | 16.14 |
| 22 | `iterative:data_width=22,n_iter=20,angle_guard=4,frac_guard=0,rounding=trunc` | 10377 | 142 | 4.4 | 23 | 0.323 | 1.22e-05 (2^-16.32) | 16.32 |
| 23 | `iterative:data_width=22,n_iter=20,angle_guard=4,frac_guard=0,rounding=round` | 10607 | 142 | 4.4 | 23 | 0.326 | 5.81e-06 (2^-17.39) | 17.39 |
| 24 | `iterative:data_width=22,n_iter=20,angle_guard=4,frac_guard=2,rounding=trunc` | 11091 | 147 | 4.4 | 23 | 0.338 | 4.4e-06 (2^-17.79) | 17.79 |
| 25 | `iterative:data_width=24,n_iter=22,angle_guard=-1,frac_guard=0,rounding=trunc` | 11122 | 148 | 4.3 | 25 | 0.369 | 4.14e-06 (2^-17.88) | 17.88 |
| 26 | `iterative:data_width=25,n_iter=21,angle_guard=1,frac_guard=0,rounding=trunc` | 11664 | 155 | 4.2 | 24 | 0.372 | 2.11e-06 (2^-18.86) | 18.86 |
| 27 | `iterative:data_width=25,n_iter=28,angle_guard=1,frac_guard=0,rounding=trunc` | 11919 | 155 | 3.3 | 31 | 0.485 | 1.78e-06 (2^-19.10) | 19.10 |
| 28 | `iterative:data_width=25,n_iter=29,angle_guard=3,frac_guard=0,rounding=round` | 12386 | 158 | 3.0 | 32 | 0.514 | 7.53e-07 (2^-20.34) | 20.34 |
| 29 | `iterative:data_width=24,n_iter=29,angle_guard=3,frac_guard=3,rounding=trunc` | 12860 | 159 | 3.1 | 32 | 0.525 | 6.59e-07 (2^-20.53) | 20.53 |
| 30 | `iterative:data_width=24,n_iter=29,angle_guard=3,frac_guard=4,rounding=trunc` | 13326 | 161 | 3.0 | 32 | 0.537 | 4.95e-07 (2^-20.95) | 20.95 |
| 31 | `iterative:data_width=27,n_iter=29,angle_guard=3,frac_guard=0,rounding=round` | 13520 | 169 | 2.8 | 32 | 0.555 | 2.03e-07 (2^-22.23) | 22.23 |
| 32 | `iterative:data_width=27,n_iter=26,angle_guard=1,frac_guard=4,rounding=trunc` | 14702 | 175 | 3.0 | 29 | 0.533 | 1.6e-07 (2^-22.58) | 22.58 |
| 33 | `iterative:data_width=27,n_iter=27,angle_guard=4,frac_guard=4,rounding=trunc` | 14977 | 178 | 2.9 | 30 | 0.562 | 6.28e-08 (2^-23.92) | 23.92 |
| 34 | `iterative:data_width=27,n_iter=27,angle_guard=3,frac_guard=4,rounding=round` | 17474 | 177 | 2.9 | 30 | 0.605 | 5.51e-08 (2^-24.11) | 24.11 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The objective is minimum area under a loose throughput constraint (1 MSPS) and an error bound of 2^-10, so the iterative datapath is the most plausible winner. Most of the budget goes there, with a narrow width and iteration range around the accuracy threshold. Unrolled_k gets a small hedge share and pipelined a minimal probe. Later rounds will narrow ranges based on the results.*)
- `iterative` (72 evals): data_width=10..16, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Shared single datapath should give the smallest area. A throughput of 1 MSPS only needs a modest clock for N+3 cycles per result, so this is the main candidate. The ranges target 2^-10 accuracy (around 11-12 bit output) with minimal width.
- `unrolled_k` (21 evals): data_width=10..15, n_iter=8..15, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* A small k may reduce FSM and shift overhead and cycles, but it adds adders. This is a hedge in case the iterative family is not Fmax-limited, and it gives a few points for the front.
- `pipelined` (7 evals): data_width=10..14, n_iter=9..14, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined has one stage per iteration, so area is likely much larger. A small probe checks this cheaply and fills the front at the low-accuracy end.

**Result (code):** 100 evaluations this round, 100 total; 31 feasible; hypervolume 1.031e+05 (n/a).

**LLM decision:** `refine` — All 11 front designs are iterative. Iterative is the only family that reaches low area: its best feasible area is 6860 um2, versus 10381 for unrolled_k. Pipelined had 0 feasible designs out of 7, with a best accuracy of 8.56 bits. The throughput constraint is not binding, since iterative gets 6-9 MSPS against the 1 MSPS requirement, so the area objective decides the outcome. The front's smallest design (data_width=15, n_iter=12, rounding=round) sits only just inside the 2^-10 error limit (10.09 bits). The front spans data_width 15..16, while feasible designs were seen down to 13. Narrower widths with extra guard bits or rounding may be feasible and smaller. I will refine around iterative with data_width 11..16 and n_iter 10..16, and allow frac_guard up to 4 and angle_guard down to -1. unrolled_k gets a small share as a check. pipelined and pipelined_m are dropped: their registered stages should cost more area and the 1 MSPS target does not need them.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.031e+05 (gain this round: n/a (first round)).
Feasible designs: 31 of 100 evaluations (19 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 69% violate; best seen 0.000104 (2^-13.23)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] area_um2=6924, accuracy_bits=10.2, ffs=101, throughput_msps=9.07, max_abs_err=0.000835 (2^-10.23), power_index=0.145
- iterative [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round] area_um2=6987, accuracy_bits=10.3, ffs=102, throughput_msps=8.73, max_abs_err=0.000803 (2^-10.28), power_index=0.147
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=7142, accuracy_bits=10.7, ffs=101, throughput_msps=7.16, max_abs_err=0.000599 (2^-10.71), power_index=0.186
- iterative [data_width=16 n_iter=13 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=7775, accuracy_bits=11.4, ffs=111, throughput_msps=8.18, max_abs_err=0.000378 (2^-11.37), power_index=0.172
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7886, accuracy_bits=11.8, ffs=107, throughput_msps=6.89, max_abs_err=0.000278 (2^-11.81), power_index=0.202
- iterative [data_width=16 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8366, accuracy_bits=12.7, ffs=114, throughput_msps=6.64, max_abs_err=0.000146 (2^-12.74), power_index=0.214
- iterative [data_width=16 n_iter=16 angle_guard=3 frac_guard=2 rounding=round] area_um2=9569, accuracy_bits=13.1, ffs=112, throughput_msps=6.64, max_abs_err=0.000117 (2^-13.06), power_index=0.225
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] area_um2=9815, accuracy_bits=13.1, ffs=113, throughput_msps=6.64, max_abs_err=0.000114 (2^-13.09), power_index=0.229
- iterative [data_width=16 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=9878, accuracy_bits=13.2, ffs=114, throughput_msps=6.64, max_abs_err=0.000104 (2^-13.23), power_index=0.231
Front coverage: area_um2 6860..9878 (HV reference 40000); accuracy_bits 10.1..13.2 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 72 evals, 28 feasible; max throughput seen 16.1 MSPS; best accuracy 13.23 bits; best feasible area_um2=6860; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard 0..3, frac_guard 0..3
- unrolled_k: 21 evals, 3 feasible; max throughput seen 11.1 MSPS; best accuracy 10.67 bits; best feasible area_um2=10381; feasible ranges: data_width 13..14, n_iter 12..14, angle_guard 2..3, frac_guard 3..3, k 2..2
- pipelined: 7 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 8.56 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on small-width iterative variants to push the minimum-area end of the front below 6860 um2 while staying feasible.*)
- `iterative` (84 evals): data_width=11..16, n_iter=10..16, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* The best area and the whole front are iterative. Lower data_width with guard bits and rounding may cut area while staying within 2^-10 error.
- `unrolled_k` (16 evals): data_width=12..15, n_iter=10..14, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..3. *Why:* It was feasible only at k=2 with data_width 13..14, and its best area (10381 um2) is above the iterative front. A small share confirms it stays dominated.

**Result (code):** 100 evaluations this round, 200 total; 86 feasible; hypervolume 1.036e+05 (+0.5%).

**LLM decision:** `refine` — All 17 front designs are iterative, and the 6860 um2 minimum is iterative. unrolled_k is feasible but larger (best 10381 um2) and pipelined had 0 feasible designs. Pipelined_m adds pipeline registers and cannot beat a shared iterative datapath on area. Throughput is not binding, with iterative at 6.6-9.4 MSPS against the 1 MSPS requirement. Accuracy is the binding constraint, so the lowest-area region sits near the 2^-10 error limit, around 10.1 bits at data_width 15, n_iter 12. The round gain was only +0.5%. Feasible iterative designs cluster at data_width 13..16 and n_iter 12..16, so a tighter search there should find smaller-area points near the accuracy limit. It should also fill in the front between 10 and 13 bits.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.50% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.036e+05 (gain this round: +0.5%).
Feasible designs: 86 of 200 evaluations (59 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 57% violate; best seen 0.000104 (2^-13.23)

Pareto front (feasible, 17 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round] area_um2=6987, accuracy_bits=10.3, ffs=102, throughput_msps=8.73, max_abs_err=0.000803 (2^-10.28), power_index=0.147
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=7142, accuracy_bits=10.7, ffs=101, throughput_msps=7.16, max_abs_err=0.000599 (2^-10.71), power_index=0.186
- iterative [data_width=14 n_iter=13 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=7352, accuracy_bits=10.8, ffs=103, throughput_msps=8.5, max_abs_err=0.000556 (2^-10.81), power_index=0.161
- iterative [data_width=16 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] area_um2=7431, accuracy_bits=11.4, ffs=104, throughput_msps=7.45, max_abs_err=0.000373 (2^-11.39), power_index=0.193
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=7886, accuracy_bits=11.8, ffs=107, throughput_msps=6.89, max_abs_err=0.000278 (2^-11.81), power_index=0.202
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8293, accuracy_bits=12.7, ffs=114, throughput_msps=7.01, max_abs_err=0.000152 (2^-12.68), power_index=0.202
- iterative [data_width=16 n_iter=16 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8366, accuracy_bits=12.7, ffs=114, throughput_msps=6.64, max_abs_err=0.000146 (2^-12.74), power_index=0.214
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=round] area_um2=9793, accuracy_bits=13.1, ffs=114, throughput_msps=7.01, max_abs_err=0.000117 (2^-13.06), power_index=0.218
- iterative [data_width=16 n_iter=16 angle_guard=3 frac_guard=3 rounding=round] area_um2=9878, accuracy_bits=13.2, ffs=114, throughput_msps=6.64, max_abs_err=0.000104 (2^-13.23), power_index=0.231
Front coverage: area_um2 6860..9878 (HV reference 40000); accuracy_bits 10.1..13.2 (HV reference 10); data_width on the front 14..16 (registry 8..28).

Per family:
- iterative: 156 evals, 80 feasible; max throughput seen 16.1 MSPS; best accuracy 13.23 bits; best feasible area_um2=6860; feasible ranges: data_width 13..16, n_iter 12..16, angle_guard -1..3, frac_guard 0..4
- unrolled_k: 37 evals, 6 feasible; max throughput seen 11.1 MSPS; best accuracy 11.32 bits; best feasible area_um2=10381; feasible ranges: data_width 13..15, n_iter 12..14, angle_guard 1..3, frac_guard 2..4, k 2..3
- pipelined: 7 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 8.56 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `iterative` (200 evals): data_width=13..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (17 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 261 feasible; hypervolume 4.082e+05 (+294.1%).

**No LLM call** (code's front-mapping round): All 17 front designs are iterative, and the 6860 um2 minimum is iterative. unrolled_k is feasible but larger (best 10381 um2) and pipelined had 0 feasible designs. Pipelined_m adds pipeline registers and cannot beat a shared iterative datapath on area. Throughput is not binding, with iterative at 6.6-9.4 MSPS against the 1 MSPS requirement. Accuracy is the binding constraint, so the lowest-area region sits near the 2^-10 error limit, around 10.1 bits at data_width 15, n_iter 12. The round gain was only +0.5%. Feasible iterative designs cluster at data_width 13..16 and n_iter 12..16, so a tighter search there should find smaller-area points near the accuracy limit. It should also fill in the front between 10 and 13 bits.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 4.082e+05 (gain this round: +294.1%).
Feasible designs: 261 of 400 evaluations (218 unique).
Families explored so far: iterative, unrolled_k, pipelined. Not yet explored: pipelined_m.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 201
- max_abs_err <= 0.000976562: 35% violate; best seen 5.51e-08 (2^-24.11)

Pareto front (feasible, 35 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] area_um2=6860, accuracy_bits=10.1, ffs=100, throughput_msps=9.43, max_abs_err=0.000917 (2^-10.09), power_index=0.144
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] area_um2=7142, accuracy_bits=10.7, ffs=101, throughput_msps=7.16, max_abs_err=0.000599 (2^-10.71), power_index=0.186
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] area_um2=7509, accuracy_bits=11.8, ffs=106, throughput_msps=7.27, max_abs_err=0.000285 (2^-11.78), power_index=0.186
- iterative [data_width=16 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=8293, accuracy_bits=12.7, ffs=114, throughput_msps=7.01, max_abs_err=0.000152 (2^-12.68), power_index=0.202
- iterative [data_width=17 n_iter=28 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=9493, accuracy_bits=13.8, ffs=123, throughput_msps=3.8, max_abs_err=6.92e-05 (2^-13.82), power_index=0.385
- iterative [data_width=20 n_iter=26 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=10094, accuracy_bits=15.8, ffs=132, throughput_msps=3.93, max_abs_err=1.79e-05 (2^-15.77), power_index=0.386
- iterative [data_width=22 n_iter=20 angle_guard=4 frac_guard=0 rounding=round] area_um2=10607, accuracy_bits=17.4, ffs=142, throughput_msps=4.38, max_abs_err=5.81e-06 (2^-17.39), power_index=0.326
- iterative [data_width=25 n_iter=21 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=11664, accuracy_bits=18.9, ffs=155, throughput_msps=4.2, max_abs_err=2.11e-06 (2^-18.86), power_index=0.372
- iterative [data_width=24 n_iter=29 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=13326, accuracy_bits=20.9, ffs=161, throughput_msps=2.98, max_abs_err=4.95e-07 (2^-20.95), power_index=0.537
- iterative [data_width=27 n_iter=27 angle_guard=3 frac_guard=4 rounding=round] area_um2=17474, accuracy_bits=24.1, ffs=177, throughput_msps=2.94, max_abs_err=5.51e-08 (2^-24.11), power_index=0.605
Front coverage: area_um2 6860..17474 (HV reference 40000); accuracy_bits 10.1..24.1 (HV reference 10); data_width on the front 14..27 (registry 8..28).

Per family:
- iterative: 356 evals, 255 feasible; max throughput seen 16.1 MSPS; best accuracy 24.11 bits; best feasible area_um2=6860; feasible ranges: data_width 13..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 37 evals, 6 feasible; max throughput seen 11.1 MSPS; best accuracy 11.32 bits; best feasible area_um2=10381; feasible ranges: data_width 13..15, n_iter 12..14, angle_guard 1..3, frac_guard 2..4, k 2..3
- pipelined: 7 evals, 0 feasible; max throughput seen 201 MSPS; best accuracy 8.56 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 14467 in, 3036 out
- provider-reported cost: $0.0593
- full prompts and replies: `llm_trace.jsonl`

