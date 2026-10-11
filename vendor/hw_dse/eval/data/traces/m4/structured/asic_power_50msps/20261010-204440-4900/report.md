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
`pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 27791 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 7404 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 326 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 51.9 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 7 | exact: schedule |
| latency_ns | 135 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 1.73 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000225 (2^-12.12) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 3.68 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 6.4e-05 (2^-13.93) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.05 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.1 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 7 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 93.3 dBc, SNR 81.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (13 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=16,n_iter=14,angle_guard=3,frac_guard=1,rounding=round,m=3` | 27791 | 326 | 51.9 | 7 | 1.73 | 0.000225 (2^-12.12) | 12.12 |
| 1 | `pipelined_m:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=round,m=3` | 28327 | 333 | 54.3 | 7 | 1.76 | 0.000192 (2^-12.35) | 12.35 |
| 2 | `pipelined_m:data_width=18,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,m=3` | 31356 | 350 | 51.9 | 7 | 1.9 | 0.000101 (2^-13.27) | 13.27 |
| 3 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=2` | 37156 | 539 | 75.4 | 10 | 2.59 | 8.41e-05 (2^-13.54) | 13.54 |
| 4 | `pipelined_m:data_width=23,n_iter=15,angle_guard=1,frac_guard=3,rounding=trunc,m=2` | 44828 | 692 | 57.9 | 10 | 3.24 | 6.19e-05 (2^-13.98) | 13.98 |
| 5 | `pipelined_m:data_width=23,n_iter=15,angle_guard=1,frac_guard=3,rounding=round,m=2` | 46047 | 694 | 57.9 | 10 | 3.29 | 6.15e-05 (2^-13.99) | 13.99 |
| 6 | `pipelined_m:data_width=22,n_iter=20,angle_guard=0,frac_guard=2,rounding=round,m=2` | 55874 | 798 | 62.0 | 12 | 3.86 | 7.68e-06 (2^-16.99) | 16.99 |
| 7 | `pipelined_m:data_width=22,n_iter=20,angle_guard=1,frac_guard=4,rounding=round,m=2` | 59305 | 844 | 57.9 | 12 | 4.09 | 4.39e-06 (2^-17.80) | 17.80 |
| 8 | `pipelined_m:data_width=23,n_iter=21,angle_guard=4,frac_guard=2,rounding=round,m=2` | 64849 | 952 | 56.1 | 13 | 4.56 | 1.64e-06 (2^-19.21) | 19.21 |
| 9 | `pipelined_m:data_width=23,n_iter=24,angle_guard=2,frac_guard=2,rounding=round,m=2` | 71346 | 1011 | 59.9 | 14 | 4.91 | 1.42e-06 (2^-19.43) | 19.43 |
| 10 | `pipelined_m:data_width=23,n_iter=24,angle_guard=4,frac_guard=3,rounding=round,m=2` | 74701 | 1056 | 56.1 | 14 | 5.14 | 6.14e-07 (2^-20.64) | 20.64 |
| 11 | `pipelined:data_width=25,n_iter=29,angle_guard=2,frac_guard=4,rounding=round` | 124439 | 2609 | 98.8 | 31 | 10.9 | 2.77e-07 (2^-21.78) | 21.78 |
| 12 | `pipelined:data_width=25,n_iter=29,angle_guard=4,frac_guard=4,rounding=round` | 127136 | 2666 | 98.8 | 31 | 11.2 | 1.39e-07 (2^-22.78) | 22.78 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Error <= 2^-12 means about 12+ accuracy bits, so the ranges cover data_width 12-18 and n_iter 11-18, with guard bits varied to trade accuracy against power. The objective is power, so the lean iterative and unrolled families get most of the budget, since they have the least hardware. A small slice goes to pipelined_m to see whether a low clock with one result per cycle wins on power. Fully pipelined is skipped because its many registers are likely to cost more power. Later rounds will narrow ranges based on which families land on the front.*)
- `iterative` (51 evals): data_width=12..18, n_iter=11..18, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Shared single datapath has the fewest gates and lowest switching activity; it needs Fmax x 1/(N+3) >= 50 MSPS, which may be reachable at a high clock with N around 12-16. Ranges target the 2^-12 error limit with a margin of a few bits.
- `unrolled_k` (33 evals): data_width=12..18, n_iter=11..18, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, k=2..4. *Why:* If the iterative family falls short of 50 MSPS, chaining 2-4 rotations per cycle raises throughput at a modest area and power increase, giving a fallback that still meets the constraint.
- `pipelined_m` (16 evals): data_width=12..18, n_iter=11..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* Producing one result per cycle means the clock can be as low as 50 MHz, which could cut power. A coarse register spacing keeps FF count down. This is a probe to check whether it can compete.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `add_family` — No feasible design after 100 evals. Throughput is the binding constraint: 98% of designs violate it. Iterative and unrolled_k peak at about 10 and 8 MSPS, so they cannot reach 50 MSPS. Only pipelined_m reached 57 MSPS, and only 16 evals went there. Accuracy is not the problem: 37% of designs meet 2^-12 and the best seen is 14.57 bits. The pipelined family has not been tried and produces one result per cycle, so it should meet 50 MSPS if Fmax is at least 50 MHz. Next round focuses on pipelined and pipelined_m with enough n_iter and width for 12+ accuracy bits. Width is kept modest and n_iter at 13-16 to keep power low, and m is allowed to range over larger values to cut registers.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 98% violate; best seen 57
- max_abs_err <= 0.000244141: 63% violate; best seen 4.11e-05 (2^-14.57)

No feasible design found yet. Least-violating designs:
- pipelined_m [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round m=5]: throughput=35.2, max_abs_err=0.000301 (2^-11.70); throughput_msps >= 50 violated by 29.6%; max_abs_err <= 0.000244141 violated by 23.4%
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc m=7]: throughput=23.1, max_abs_err=0.000217 (2^-12.17); throughput_msps >= 50 violated by 53.7%
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round]: throughput=7.7, max_abs_err=0.000204 (2^-12.26); throughput_msps >= 50 violated by 84.6%
- iterative [data_width=18 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc]: throughput=7.42, max_abs_err=0.000172 (2^-12.50); throughput_msps >= 50 violated by 85.2%
- iterative [data_width=18 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=7.42, max_abs_err=0.000205 (2^-12.25); throughput_msps >= 50 violated by 85.2%

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 14.57 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.14 MSPS; best accuracy 14.16 bits
- pipelined_m: 16 evals, 0 feasible; max throughput seen 57 MSPS; best accuracy 12.17 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the two families that can reach 50 MSPS, with width and iteration ranges around the region where max error is at or below 2^-12.*)
- `pipelined` (34 evals): data_width=13..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Unexplored family with 1 result/cycle; the best accuracy-feasible widths and iteration counts from round 1 should meet 50 MSPS if Fmax allows.
- `pipelined_m` (66 evals): data_width=13..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..5. *Why:* Only family to exceed 50 MSPS (57 seen). Small m should give a higher Fmax; the 35 MSPS result at m=5 suggests m of 2-4 is the better region for throughput, while fewer registers lower power.

**Result (code):** 100 evaluations this round, 200 total; 23 feasible; hypervolume 41.63 (+inf).

**LLM decision:** `refine` — Only pipelined_m is feasible (23 of 82 evals). Iterative and unrolled_k top out at 10.1 and 8.14 MSPS, far below the 50 MSPS constraint. Pipelined reaches 171 MSPS but its best accuracy is 11.97 bits, short of the 12-bit error limit. The front has 4 designs spanning power 1.73..2.1 and accuracy 12.1..13.1, and the feasible region is tight: data_width 16..18, n_iter 14..16, m 2..3. The selection rule picks min power, so I will spend one more round on the low-power corner. That means slightly narrower or smaller data_width and n_iter, with m up to 4 to test whether fewer pipeline registers lowers power while Fmax stays above 50 MSPS. Mixed frac_guard and angle_guard values should also fill in the accuracy range. After this round, map_front can cover the rest of the curve.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 41.63 (gain this round: +inf (first feasible designs)).
Feasible designs: 23 of 200 evaluations (15 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 60% violate; best seen 171
- max_abs_err <= 0.000244141: 62% violate; best seen 4.11e-05 (2^-14.57)

Pareto front (feasible, 4 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=3] power_index=1.73, accuracy_bits=12.1, area_um2=27791, ffs=326, throughput_msps=51.9, max_abs_err=0.000225 (2^-12.12)
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.76, accuracy_bits=12.3, area_um2=28327, ffs=333, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=round m=3] power_index=2.04, accuracy_bits=12.9, area_um2=32587, ffs=389, throughput_msps=54.3, max_abs_err=0.000134 (2^-12.86)
- pipelined_m [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=round m=3] power_index=2.1, accuracy_bits=13.1, area_um2=33571, ffs=399, throughput_msps=51.9, max_abs_err=0.000114 (2^-13.09)
Front coverage: power_index 1.73..2.1 (HV reference 40); accuracy_bits 12.1..13.1 (HV reference 12); data_width on the front 16..17 (registry 8..28).

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 14.57 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.14 MSPS; best accuracy 14.16 bits
- pipelined: 34 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 11.97 bits
- pipelined_m: 82 evals, 23 feasible; max throughput seen 86.6 MSPS; best accuracy 14.04 bits; best feasible power_index=1.73; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 1..3, frac_guard 0..3, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the one family that is feasible and probe its lower-power neighbourhood. Keep a small probe of pipelined with higher accuracy settings.*)
- `pipelined_m` (32 evals): data_width=14..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=round, m=2..4. *Why:* The only family with feasible designs. Narrowing around the feasible region and allowing m=4 and smaller widths probes lower power at 50+ MSPS.
- `pipelined` (8 evals): data_width=15..18, n_iter=13..16, angle_guard=1..3, frac_guard=1..3, rounding=round. *Why:* Fully pipelined meets throughput easily, so with round and higher guard bits it may reach 12+ bits and could be competitive on power.

**Result (code):** 40 evaluations this round, 240 total; 30 feasible; hypervolume 84.82 (+103.7%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible are valid. Feasible designs exist, so infeasible does not apply. The front has 5 feasible designs, all pipelined_m except one pipelined. Power_index runs 1.73..4.49 and accuracy_bits 12.1..14.3. The front's minimum-power point (pipelined_m, W=16, N=14, m=3) has 12.1 bits and 51.9 MSPS, which meets both constraints (err 0.000225 <= 0.000244, throughput >= 50). The iterative and unrolled_k families reached at most 10.1 and 8.14 MSPS, so they cannot meet the 50 MSPS constraint. The selection rule (min power_index) picks the 1.73 design. I therefore stop and select it.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 84.82 (gain this round: +103.7%).
Feasible designs: 30 of 240 evaluations (21 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 57% violate; best seen 171
- max_abs_err <= 0.000244141: 65% violate; best seen 4.11e-05 (2^-14.57)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=3] power_index=1.73, accuracy_bits=12.1, area_um2=27791, ffs=326, throughput_msps=51.9, max_abs_err=0.000225 (2^-12.12)
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.76, accuracy_bits=12.3, area_um2=28327, ffs=333, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.9, accuracy_bits=13.3, area_um2=31356, ffs=350, throughput_msps=51.9, max_abs_err=0.000101 (2^-13.27)
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=2.59, accuracy_bits=13.5, area_um2=37156, ffs=539, throughput_msps=75.4, max_abs_err=8.41e-05 (2^-13.54)
- pipelined [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] power_index=4.49, accuracy_bits=14.3, area_um2=50989, ffs=1076, throughput_msps=128, max_abs_err=5.03e-05 (2^-14.28)
Front coverage: power_index 1.73..4.49 (HV reference 40); accuracy_bits 12.1..14.3 (HV reference 12); data_width on the front 16..18 (registry 8..28).

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 14.57 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.14 MSPS; best accuracy 14.16 bits
- pipelined: 42 evals, 4 feasible; max throughput seen 171 MSPS; best accuracy 14.28 bits; best feasible power_index=3.58; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 2..3, frac_guard 1..3
- pipelined_m: 114 evals, 26 feasible; max throughput seen 86.6 MSPS; best accuracy 14.43 bits; best feasible power_index=1.73; feasible ranges: data_width 16..18, n_iter 14..16, angle_guard 1..3, frac_guard 0..3, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (128 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (4 front designs; box front_anchored)
- `pipelined` (32 evals): data_width=17..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 85 feasible; hypervolume 374.4 (+341.5%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible are valid. Feasible designs exist, so infeasible does not apply. The front has 5 feasible designs, all pipelined_m except one pipelined. Power_index runs 1.73..4.49 and accuracy_bits 12.1..14.3. The front's minimum-power point (pipelined_m, W=16, N=14, m=3) has 12.1 bits and 51.9 MSPS, which meets both constraints (err 0.000225 <= 0.000244, throughput >= 50). The iterative and unrolled_k families reached at most 10.1 and 8.14 MSPS, so they cannot meet the 50 MSPS constraint. The selection rule (min power_index) picks the 1.73 design. I therefore stop and select it.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 374.4 (gain this round: +341.5%).
Feasible designs: 85 of 400 evaluations (64 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 60% violate; best seen 171
- max_abs_err <= 0.000244141: 43% violate; best seen 5.53e-08 (2^-24.11)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=3 frac_guard=1 rounding=round m=3] power_index=1.73, accuracy_bits=12.1, area_um2=27791, ffs=326, throughput_msps=51.9, max_abs_err=0.000225 (2^-12.12)
- pipelined_m [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round m=3] power_index=1.76, accuracy_bits=12.3, area_um2=28327, ffs=333, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=18 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=2.59, accuracy_bits=13.5, area_um2=37156, ffs=539, throughput_msps=75.4, max_abs_err=8.41e-05 (2^-13.54)
- pipelined_m [data_width=23 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc m=2] power_index=3.24, accuracy_bits=14, area_um2=44828, ffs=692, throughput_msps=57.9, max_abs_err=6.19e-05 (2^-13.98)
- pipelined_m [data_width=23 n_iter=15 angle_guard=1 frac_guard=3 rounding=round m=2] power_index=3.29, accuracy_bits=14, area_um2=46047, ffs=694, throughput_msps=57.9, max_abs_err=6.15e-05 (2^-13.99)
- pipelined_m [data_width=22 n_iter=20 angle_guard=1 frac_guard=4 rounding=round m=2] power_index=4.09, accuracy_bits=17.8, area_um2=59305, ffs=844, throughput_msps=57.9, max_abs_err=4.39e-06 (2^-17.80)
- pipelined_m [data_width=23 n_iter=21 angle_guard=4 frac_guard=2 rounding=round m=2] power_index=4.56, accuracy_bits=19.2, area_um2=64849, ffs=952, throughput_msps=56.1, max_abs_err=1.64e-06 (2^-19.21)
- pipelined_m [data_width=23 n_iter=24 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=4.91, accuracy_bits=19.4, area_um2=71346, ffs=1011, throughput_msps=59.9, max_abs_err=1.42e-06 (2^-19.43)
- pipelined [data_width=25 n_iter=29 angle_guard=2 frac_guard=4 rounding=round] power_index=10.9, accuracy_bits=21.8, area_um2=124439, ffs=2609, throughput_msps=98.8, max_abs_err=2.77e-07 (2^-21.78)
- pipelined [data_width=25 n_iter=29 angle_guard=4 frac_guard=4 rounding=round] power_index=11.2, accuracy_bits=22.8, area_um2=127136, ffs=2666, throughput_msps=98.8, max_abs_err=1.39e-07 (2^-22.78)
Front coverage: power_index 1.73..11.2 (HV reference 40); accuracy_bits 12.1..22.8 (HV reference 12); data_width on the front 16..25 (registry 8..28).

Per family:
- iterative: 51 evals, 0 feasible; max throughput seen 10.1 MSPS; best accuracy 14.57 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 8.14 MSPS; best accuracy 14.16 bits
- pipelined: 74 evals, 36 feasible; max throughput seen 171 MSPS; best accuracy 22.78 bits; best feasible power_index=3.58; feasible ranges: data_width 16..28, n_iter 14..30, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 242 evals, 49 feasible; max throughput seen 86.6 MSPS; best accuracy 24.11 bits; best feasible power_index=1.73; feasible ranges: data_width 16..23, n_iter 14..24, angle_guard -1..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 18323 in, 3094 out
- provider-reported cost: $0.0676
- full prompts and replies: `llm_trace.jsonl`

