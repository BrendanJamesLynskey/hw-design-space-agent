# DSE run: asic_power_50msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=18,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round,m=3` — selection: auto (spec rule: min power_index)

| metric | value | provenance |
|---|---|---|
| area_um2 | 31386 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 8361 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 389 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 54.3 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 8 | exact: schedule |
| latency_ns | 147 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.01 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000192 (2^-12.35) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 12.6 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 4.31e-05 (2^-14.50) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 2.82 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.3 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 8 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 97.0 dBc, SNR 85.1 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (25 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=18,n_iter=16,angle_guard=-1,frac_guard=0,rounding=round,m=3` | 31386 | 389 | 54.3 | 8 | 2.01 | 0.000192 (2^-12.35) | 12.35 |
| 1 | `pipelined_m:data_width=16,n_iter=14,angle_guard=2,frac_guard=3,rounding=round,m=2` | 31778 | 461 | 75.4 | 9 | 2.22 | 0.000187 (2^-12.38) | 12.38 |
| 2 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=2,rounding=round,m=2` | 33951 | 495 | 72.3 | 9 | 2.37 | 0.000144 (2^-12.76) | 12.76 |
| 3 | `pipelined_m:data_width=18,n_iter=14,angle_guard=2,frac_guard=3,rounding=round,m=2` | 34877 | 506 | 69.4 | 9 | 2.43 | 0.000142 (2^-12.79) | 12.79 |
| 4 | `pipelined_m:data_width=19,n_iter=14,angle_guard=1,frac_guard=3,rounding=trunc,m=2` | 34927 | 520 | 66.8 | 9 | 2.47 | 0.000138 (2^-12.82) | 12.82 |
| 5 | `pipelined_m:data_width=19,n_iter=14,angle_guard=2,frac_guard=3,rounding=round,m=2` | 36427 | 529 | 66.8 | 9 | 2.54 | 0.000131 (2^-12.90) | 12.90 |
| 6 | `pipelined_m:data_width=20,n_iter=16,angle_guard=-2,frac_guard=0,rounding=round,m=2` | 36881 | 551 | 72.3 | 10 | 2.62 | 0.000101 (2^-13.28) | 13.28 |
| 7 | `pipelined_m:data_width=16,n_iter=16,angle_guard=4,frac_guard=4,rounding=round,m=2` | 38509 | 553 | 72.3 | 10 | 2.67 | 7.19e-05 (2^-13.76) | 13.76 |
| 8 | `pipelined_m:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=2` | 38925 | 564 | 72.3 | 10 | 2.72 | 5.25e-05 (2^-14.22) | 14.22 |
| 9 | `pipelined_m:data_width=19,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc,m=2` | 42745 | 628 | 72.3 | 11 | 3.01 | 4.91e-05 (2^-14.31) | 14.31 |
| 10 | `pipelined_m:data_width=19,n_iter=18,angle_guard=1,frac_guard=1,rounding=round,m=2` | 43760 | 630 | 72.3 | 11 | 3.04 | 3.87e-05 (2^-14.66) | 14.66 |
| 11 | `pipelined_m:data_width=20,n_iter=16,angle_guard=3,frac_guard=4,rounding=round,m=2` | 45025 | 647 | 62.0 | 10 | 3.12 | 3.31e-05 (2^-14.88) | 14.88 |
| 12 | `pipelined_m:data_width=19,n_iter=18,angle_guard=2,frac_guard=2,rounding=trunc,m=2` | 44594 | 653 | 69.4 | 11 | 3.13 | 3.04e-05 (2^-15.00) | 15.00 |
| 13 | `pipelined_m:data_width=19,n_iter=18,angle_guard=3,frac_guard=2,rounding=trunc,m=2` | 45225 | 662 | 66.8 | 11 | 3.17 | 2.81e-05 (2^-15.12) | 15.12 |
| 14 | `pipelined_m:data_width=21,n_iter=18,angle_guard=1,frac_guard=3,rounding=round,m=2` | 50170 | 719 | 62.0 | 11 | 3.48 | 1.31e-05 (2^-16.22) | 16.22 |
| 15 | `pipelined_m:data_width=21,n_iter=18,angle_guard=2,frac_guard=4,rounding=trunc,m=2` | 50902 | 741 | 59.9 | 11 | 3.56 | 1.11e-05 (2^-16.46) | 16.46 |
| 16 | `pipelined_m:data_width=24,n_iter=19,angle_guard=-2,frac_guard=1,rounding=trunc,m=2` | 54251 | 822 | 59.9 | 12 | 3.88 | 8.57e-06 (2^-16.83) | 16.83 |
| 17 | `pipelined_m:data_width=24,n_iter=19,angle_guard=0,frac_guard=4,rounding=round,m=2` | 60816 | 897 | 54.3 | 12 | 4.28 | 5.23e-06 (2^-17.54) | 17.54 |
| 18 | `pipelined_m:data_width=28,n_iter=22,angle_guard=-2,frac_guard=1,rounding=trunc,m=2` | 71450 | 1037 | 52.7 | 13 | 4.99 | 9.48e-07 (2^-20.01) | 20.01 |
| 19 | `pipelined_m:data_width=27,n_iter=24,angle_guard=3,frac_guard=0,rounding=trunc,m=2` | 78035 | 1127 | 51.2 | 14 | 5.43 | 4.11e-07 (2^-21.22) | 21.22 |
| 20 | `pipelined:data_width=25,n_iter=24,angle_guard=3,frac_guard=4,rounding=trunc` | 102563 | 2179 | 98.8 | 26 | 9.08 | 3.24e-07 (2^-21.56) | 21.56 |
| 21 | `pipelined:data_width=25,n_iter=25,angle_guard=4,frac_guard=3,rounding=round` | 107193 | 2251 | 98.8 | 27 | 9.41 | 2.16e-07 (2^-22.14) | 22.14 |
| 22 | `pipelined:data_width=26,n_iter=25,angle_guard=4,frac_guard=3,rounding=trunc` | 109349 | 2323 | 96.1 | 27 | 9.68 | 1.69e-07 (2^-22.50) | 22.50 |
| 23 | `pipelined:data_width=28,n_iter=26,angle_guard=1,frac_guard=0,rounding=round` | 110467 | 2352 | 98.8 | 28 | 9.79 | 1.47e-07 (2^-22.70) | 22.70 |
| 24 | `pipelined:data_width=28,n_iter=27,angle_guard=1,frac_guard=2,rounding=trunc` | 119640 | 2540 | 96.1 | 29 | 10.6 | 9.77e-08 (2^-23.29) | 23.29 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Throughput is the binding filter here: the spec demands 50 MSPS against a power reference computed at 100 MHz, and only the two pipelined families give 1 result/cycle unconditionally. iterative and unrolled_k trade cycle count against clock speed almost one-for-one, so they can only clear 50 MSPS with a short micro-rotation chain (small N) where accuracy is hardest to hold at 2^-12; I still fund them because if any such point exists it is the minimum-power winner, and if none exists the search will show it, which is itself a required outcome. Accuracy depends on (data_width, n_iter, angle_guard, frac_guard, rounding) identically in every family, so I hold those ranges constant across families (W 12..20, N 8..24, angle_guard -1..3, frac_guard 0..3, both roundings) to make cross-family comparison meaningful and to span from just-below to comfortably-above 2^-12 error; W below ~14 and N below ~12 are expected to miss 2^-12 but are cheap probes of the constraint boundary. All four ranges are inside the registry and otherwise unconstrained. Budget is skewed to pipelined_m (34%) because the m knob is the only lever that lowers Fmax, and therefore power, while still satisfying 1-result/cycle at >=50 MSPS - i.e. where the min-power corner selected by the spec most plausibly lives - with pipelined (26%) covering the high-accuracy end of the front, unrolled_k (24%) probing a distinct datapath-sharing point, and iterative (16%) reserved as the feasibility probe for the cheapest possible architecture.*)
- `pipelined_m` (34 evals): data_width=12..20, n_iter=8..24, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Registering every m stages keeps 1 result/cycle (so throughput = Fmax, trivially clearing 50 MSPS for any Fmax>=50 MHz) while cutting flip-flop count versus full pipelining; the clock period stretches with m, so a large m is the natural way to reach the minimum-power corner. Search the whole m range, but expect the useful region near the top where Fmax is dragged down toward the 50 MSPS floor.
- `pipelined` (26 evals): data_width=12..20, n_iter=8..24, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* The safest throughput family (1 result/cycle) and the most likely to sit at the high-accuracy end of the front; its per-stage registers make it expensive in power, which is exactly the trade-off we want mapped. Same accuracy knob ranges as the other families so the front is comparable across families.
- `unrolled_k` (24 evals): data_width=12..20, n_iter=8..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=2..8. *Why:* Shares the datapath but chains k micro-rotations per cycle; because both the cycle count (ceil(N/k)+3) and the clock period grow with k, its throughput is roughly flat in k and only clears 50 MSPS with a short iteration count. Give it a real share with small n_iter and the full k range, since if it can reach 50 MSPS at small N it is a serious low-power contender; n_iter capped at 20 to spend less time on designs that this family provably cannot clock fast enough.
- `iterative` (16 evals): data_width=12..20, n_iter=8..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Absolute minimum datapath (one shared micro-rotation, no unroll copies, no pipeline FFs) so it has by far the lowest per-cycle power and would be the cheapest feasible design if it could clock fast enough. Its throughput is only Fmax/(N+3), so I restrict it to small N and a modest eval share purely to check whether the 50 MSPS constraint is reachable at all; if not, it is the evidence for declaring that corner infeasible rather than guessing.

**Result (code):** 100 evaluations this round, 100 total; 32 feasible; hypervolume 146.2 (n/a).

**LLM decision:** `map_front` — Round 1 shows only pipelined and pipelined_m can meet the 50 MSPS constraint: iterative (0/16 feasible, max 14.6 MSPS) and unrolled_k (0/24 feasible, max 9.04 MSPS) are dead ends, so the front must be mapped over pipelined + pipelined_m. But the current front occupies only a small part of the achievable objective ranges: accuracy_bits spans just 12.4..16 while the registry allows far more (data_width to 28, n_iter to 30), and the sampled pipelined/pipelined_m designs only reached data_width=20, n_iter=23. This matters for hypervolume: with HV reference (power 40, accuracy 12) and front powers of only 2.2..5.9, every extra bit of accuracy added near the top of the front contributes ~(40-p)~34-38 to HV, whereas the entire low-accuracy band 12..12.4 (the only place power refinement acts) contributes only ~15. The cheapest large HV gains therefore come from extending the accuracy range, and NSGA-II over the full ranges of the two feasible families, seeded with the existing front, will both keep the low-power corner (for the min-power_index selection rule) and push accuracy upward. refine would chase the low-power corner where HV headroom is small; widen is subsumed by a seeded full-range map.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 146.2 (gain this round: n/a (first round)).
Feasible designs: 32 of 100 evaluations (31 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 55% violate; best seen 163
- max_abs_err <= 0.000244141: 50% violate; best seen 1.54e-05 (2^-15.99)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=16 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=2.22, accuracy_bits=12.4, area_um2=31778, ffs=461, throughput_msps=75.4, max_abs_err=0.000187 (2^-12.38)
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.37, accuracy_bits=12.8, area_um2=33951, ffs=495, throughput_msps=72.3, max_abs_err=0.000144 (2^-12.76)
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=2.43, accuracy_bits=12.8, area_um2=34877, ffs=506, throughput_msps=69.4, max_abs_err=0.000142 (2^-12.79)
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=3 rounding=trunc m=2] power_index=2.47, accuracy_bits=12.8, area_um2=34927, ffs=520, throughput_msps=66.8, max_abs_err=0.000138 (2^-12.82)
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=2.54, accuracy_bits=12.9, area_um2=36427, ffs=529, throughput_msps=66.8, max_abs_err=0.000131 (2^-12.90)
- pipelined_m [data_width=18 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=2.99, accuracy_bits=14.2, area_um2=42658, ffs=624, throughput_msps=72.3, max_abs_err=5.33e-05 (2^-14.20)
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=3.13, accuracy_bits=15, area_um2=44594, ffs=653, throughput_msps=69.4, max_abs_err=3.04e-05 (2^-15.00)
- pipelined_m [data_width=19 n_iter=18 angle_guard=3 frac_guard=2 rounding=trunc m=2] power_index=3.17, accuracy_bits=15.1, area_um2=45225, ffs=662, throughput_msps=66.8, max_abs_err=2.81e-05 (2^-15.12)
- pipelined_m [data_width=19 n_iter=21 angle_guard=2 frac_guard=3 rounding=trunc m=2] power_index=3.85, accuracy_bits=15.5, area_um2=54398, ffs=810, throughput_msps=66.8, max_abs_err=2.18e-05 (2^-15.49)
- pipelined [data_width=20 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc] power_index=5.93, accuracy_bits=16, area_um2=66775, ffs=1428, throughput_msps=123, max_abs_err=1.54e-05 (2^-15.99)
Front coverage: power_index 2.22..5.93 (HV reference 40); accuracy_bits 12.4..16 (HV reference 12); data_width on the front 16..20 (registry 8..28).

Per family:
- iterative: 16 evals, 0 feasible; max throughput seen 14.6 MSPS; best accuracy 11.45 bits
- unrolled_k: 24 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 13.47 bits
- pipelined: 26 evals, 16 feasible; max throughput seen 163 MSPS; best accuracy 15.99 bits; best feasible power_index=3.42; feasible ranges: data_width 17..20, n_iter 14..23, angle_guard -1..3, frac_guard 0..2
- pipelined_m: 34 evals, 16 feasible; max throughput seen 102 MSPS; best accuracy 15.60 bits; best feasible power_index=2.22; feasible ranges: data_width 16..19, n_iter 14..22, angle_guard 0..3, frac_guard 1..3, m 2..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (90 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (9 front designs; box front_anchored)
- `pipelined` (10 evals): data_width=19..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 64 feasible; hypervolume 310.2 (+112.2%).

**LLM decision:** `map_front` — Constraints are reachable — pipelined (26 feasible) and pipelined_m (38 feasible) both satisfy throughput>=50 and err<=2^-12, so this is not infeasible. iterative and unrolled_k are dead ends (0 feasible; max throughput 14.6 and 9.04 MSPS, far below 50) and should not be re-explored. The front is still only partially mapped: power_index spans 2.01..10.1 against an HV reference of 40 (≈20% of the range), and accuracy_bits tops out at 20.9 while the best accuracy seen anywhere is 24.54 (pipelined_m) — that 24.54 design is absent from the front, so the true feasible accuracy ceiling is unconfirmed. With 200 evals left and the front covering only a small part of the power objective's range, the highest-value use of this round is a full-range NSGA-II sweep over the two families actually on the front (pipelined, pipelined_m), seeded with the current 15-design front, to fill the visible gaps (e.g. the 13.2→15.0 accuracy jump between power 2.64 and 3.13) and to establish whether accuracy can be pushed past 20.9 at throughput>=50. This directly targets hypervolume coverage rather than only the min-power corner the selection rule will pick.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 310.2 (gain this round: +112.2%).
Feasible designs: 64 of 200 evaluations (61 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 60% violate; best seen 163
- max_abs_err <= 0.000244141: 30% violate; best seen 4.11e-08 (2^-24.54)

Pareto front (feasible, 15 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round m=3] power_index=2.01, accuracy_bits=12.3, area_um2=31386, ffs=389, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.37, accuracy_bits=12.8, area_um2=33951, ffs=495, throughput_msps=72.3, max_abs_err=0.000144 (2^-12.76)
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=2.43, accuracy_bits=12.8, area_um2=34877, ffs=506, throughput_msps=69.4, max_abs_err=0.000142 (2^-12.79)
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=2.54, accuracy_bits=12.9, area_um2=36427, ffs=529, throughput_msps=66.8, max_abs_err=0.000131 (2^-12.90)
- pipelined_m [data_width=16 n_iter=16 angle_guard=4 frac_guard=4 rounding=trunc m=2] power_index=2.64, accuracy_bits=13.2, area_um2=37648, ffs=551, throughput_msps=72.3, max_abs_err=0.000108 (2^-13.17)
- pipelined_m [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc m=2] power_index=3.13, accuracy_bits=15, area_um2=44594, ffs=653, throughput_msps=69.4, max_abs_err=3.04e-05 (2^-15.00)
- pipelined_m [data_width=19 n_iter=18 angle_guard=3 frac_guard=2 rounding=trunc m=2] power_index=3.17, accuracy_bits=15.1, area_um2=45225, ffs=662, throughput_msps=66.8, max_abs_err=2.81e-05 (2^-15.12)
- pipelined_m [data_width=21 n_iter=18 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=3.56, accuracy_bits=16.5, area_um2=50902, ffs=741, throughput_msps=59.9, max_abs_err=1.11e-05 (2^-16.46)
- pipelined_m [data_width=22 n_iter=27 angle_guard=4 frac_guard=2 rounding=round m=2] power_index=5.57, accuracy_bits=19.1, area_um2=80070, ffs=1156, throughput_msps=57.9, max_abs_err=1.83e-06 (2^-19.06)
- pipelined [data_width=25 n_iter=28 angle_guard=2 frac_guard=2 rounding=trunc] power_index=10.1, accuracy_bits=20.9, area_um2=113755, ffs=2415, throughput_msps=105, max_abs_err=5.15e-07 (2^-20.89)
Front coverage: power_index 2.01..10.1 (HV reference 40); accuracy_bits 12.3..20.9 (HV reference 12); data_width on the front 16..26 (registry 8..28).

Per family:
- iterative: 16 evals, 0 feasible; max throughput seen 14.6 MSPS; best accuracy 11.45 bits
- unrolled_k: 24 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 13.47 bits
- pipelined: 36 evals, 26 feasible; max throughput seen 163 MSPS; best accuracy 20.89 bits; best feasible power_index=3.42; feasible ranges: data_width 17..27, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 124 evals, 38 feasible; max throughput seen 102 MSPS; best accuracy 24.54 bits; best feasible power_index=2.01; feasible ranges: data_width 16..27, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (87 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (13 front designs; box front_anchored)
- `pipelined` (13 evals): data_width=24..28, n_iter=19..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (2 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 91 feasible; hypervolume 391.7 (+26.3%).

**LLM decision:** `map_front` — This is the last round (round 4 of at most 4, 100 of 400 evals left), which is exactly the reserved phase for mapping the front over the full parameter ranges of the families that actually appear on it. Evidence: iterative and unrolled_k are dead ends for this spec — 0/16 and 0/24 feasible, with best throughputs of only 14.6 and 9.04 MSPS against the >=50 MSPS constraint — so the front is carried entirely by pipelined (39 feasible, best power 3.42, up to 23.29 accuracy bits) and pipelined_m (52 feasible, best power 2.01, up to 24.54 accuracy bits). The feasible pipelined_m ranges are still narrow (m only 2..3, data_width 16..27, n_iter 14..30) while the registry allows m up to 8 and data_width down to 8, so the true front may extend beyond what we have sampled. The current front spans power_index 2.01..10.6 and accuracy_bits 12.3..23.3 with an HV reference of (40, 12); the +26.3% HV gain this round shows the curve is still being extended, so the remaining budget is best spent by NSGA-II over the full ranges of pipelined + pipelined_m, seeded with the 20-design front, rather than refining a locally-narrow region and risking leaving uncovered trade-off points. No next_plan is needed for a map_front decision.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 391.7 (gain this round: +26.3%).
Feasible designs: 91 of 300 evaluations (87 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 63% violate; best seen 163
- max_abs_err <= 0.000244141: 24% violate; best seen 4.11e-08 (2^-24.54)

Pareto front (feasible, 20 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round m=3] power_index=2.01, accuracy_bits=12.3, area_um2=31386, ffs=389, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=round m=2] power_index=2.37, accuracy_bits=12.8, area_um2=33951, ffs=495, throughput_msps=72.3, max_abs_err=0.000144 (2^-12.76)
- pipelined_m [data_width=19 n_iter=14 angle_guard=1 frac_guard=3 rounding=trunc m=2] power_index=2.47, accuracy_bits=12.8, area_um2=34927, ffs=520, throughput_msps=66.8, max_abs_err=0.000138 (2^-12.82)
- pipelined_m [data_width=20 n_iter=16 angle_guard=-2 frac_guard=0 rounding=round m=2] power_index=2.62, accuracy_bits=13.3, area_um2=36881, ffs=551, throughput_msps=72.3, max_abs_err=0.000101 (2^-13.28)
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=2.72, accuracy_bits=14.2, area_um2=38925, ffs=564, throughput_msps=72.3, max_abs_err=5.25e-05 (2^-14.22)
- pipelined_m [data_width=20 n_iter=16 angle_guard=3 frac_guard=4 rounding=round m=2] power_index=3.12, accuracy_bits=14.9, area_um2=45025, ffs=647, throughput_msps=62, max_abs_err=3.31e-05 (2^-14.88)
- pipelined_m [data_width=19 n_iter=18 angle_guard=3 frac_guard=2 rounding=trunc m=2] power_index=3.17, accuracy_bits=15.1, area_um2=45225, ffs=662, throughput_msps=66.8, max_abs_err=2.81e-05 (2^-15.12)
- pipelined_m [data_width=21 n_iter=18 angle_guard=2 frac_guard=4 rounding=trunc m=2] power_index=3.56, accuracy_bits=16.5, area_um2=50902, ffs=741, throughput_msps=59.9, max_abs_err=1.11e-05 (2^-16.46)
- pipelined_m [data_width=27 n_iter=24 angle_guard=3 frac_guard=0 rounding=trunc m=2] power_index=5.43, accuracy_bits=21.2, area_um2=78035, ffs=1127, throughput_msps=51.2, max_abs_err=4.11e-07 (2^-21.22)
- pipelined [data_width=28 n_iter=27 angle_guard=1 frac_guard=2 rounding=trunc] power_index=10.6, accuracy_bits=23.3, area_um2=119640, ffs=2540, throughput_msps=96.1, max_abs_err=9.77e-08 (2^-23.29)
Front coverage: power_index 2.01..10.6 (HV reference 40); accuracy_bits 12.3..23.3 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 16 evals, 0 feasible; max throughput seen 14.6 MSPS; best accuracy 11.45 bits
- unrolled_k: 24 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 13.47 bits
- pipelined: 49 evals, 39 feasible; max throughput seen 163 MSPS; best accuracy 23.29 bits; best feasible power_index=3.42; feasible ranges: data_width 17..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 211 evals, 52 feasible; max throughput seen 102 MSPS; best accuracy 24.54 bits; best feasible power_index=2.01; feasible ranges: data_width 16..27, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (90 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (18 front designs; box front_anchored)
- `pipelined` (10 evals): data_width=24..28, n_iter=22..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (2 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 123 feasible; hypervolume 394.9 (+0.8%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the feasible front is real and well covered, so `infeasible` is not warranted: 123 feasible designs (115 unique) exist, all constraints are satisfiable simultaneously (best throughput 163 MSPS vs >=50 required; best max_abs_err 4.11e-08 vs <=2.44e-04 required). The front spans power_index 2.01..10.6 against an HV reference of 40 and accuracy_bits 12.3..23.3 against a reference of 12, i.e. it already covers the useful part of both objective ranges, and this round's hypervolume gain was only +0.8% (394.9), indicating diminishing returns from further search. The selection rule (min power_index) is satisfied by pipelined_m [data_width=18 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round m=3] at power_index=2.01, accuracy_bits=12.3 (max_abs_err 1.92e-04 <= 2.44e-04) and throughput 54.3 MSPS >= 50. The two non-pipelined families are structurally unable to meet the throughput constraint (iterative max 14.6 MSPS, unrolled_k max 9.04 MSPS, 0 feasible each), so no unexplored family remains that could extend the front. Stopping is therefore the correct terminal decision.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 394.9 (gain this round: +0.8%).
Feasible designs: 123 of 400 evaluations (115 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 63% violate; best seen 163
- max_abs_err <= 0.000244141: 22% violate; best seen 4.11e-08 (2^-24.54)

Pareto front (feasible, 25 designs; showing up to 10), objectives: min power_index, max accuracy_bits
- pipelined_m [data_width=18 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round m=3] power_index=2.01, accuracy_bits=12.3, area_um2=31386, ffs=389, throughput_msps=54.3, max_abs_err=0.000192 (2^-12.35)
- pipelined_m [data_width=18 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=2.43, accuracy_bits=12.8, area_um2=34877, ffs=506, throughput_msps=69.4, max_abs_err=0.000142 (2^-12.79)
- pipelined_m [data_width=19 n_iter=14 angle_guard=2 frac_guard=3 rounding=round m=2] power_index=2.54, accuracy_bits=12.9, area_um2=36427, ffs=529, throughput_msps=66.8, max_abs_err=0.000131 (2^-12.90)
- pipelined_m [data_width=19 n_iter=16 angle_guard=1 frac_guard=1 rounding=round m=2] power_index=2.72, accuracy_bits=14.2, area_um2=38925, ffs=564, throughput_msps=72.3, max_abs_err=5.25e-05 (2^-14.22)
- pipelined_m [data_width=20 n_iter=16 angle_guard=3 frac_guard=4 rounding=round m=2] power_index=3.12, accuracy_bits=14.9, area_um2=45025, ffs=647, throughput_msps=62, max_abs_err=3.31e-05 (2^-14.88)
- pipelined_m [data_width=19 n_iter=18 angle_guard=3 frac_guard=2 rounding=trunc m=2] power_index=3.17, accuracy_bits=15.1, area_um2=45225, ffs=662, throughput_msps=66.8, max_abs_err=2.81e-05 (2^-15.12)
- pipelined_m [data_width=24 n_iter=19 angle_guard=-2 frac_guard=1 rounding=trunc m=2] power_index=3.88, accuracy_bits=16.8, area_um2=54251, ffs=822, throughput_msps=59.9, max_abs_err=8.57e-06 (2^-16.83)
- pipelined_m [data_width=27 n_iter=24 angle_guard=3 frac_guard=0 rounding=trunc m=2] power_index=5.43, accuracy_bits=21.2, area_um2=78035, ffs=1127, throughput_msps=51.2, max_abs_err=4.11e-07 (2^-21.22)
- pipelined [data_width=25 n_iter=25 angle_guard=4 frac_guard=3 rounding=round] power_index=9.41, accuracy_bits=22.1, area_um2=107193, ffs=2251, throughput_msps=98.8, max_abs_err=2.16e-07 (2^-22.14)
- pipelined [data_width=28 n_iter=27 angle_guard=1 frac_guard=2 rounding=trunc] power_index=10.6, accuracy_bits=23.3, area_um2=119640, ffs=2540, throughput_msps=96.1, max_abs_err=9.77e-08 (2^-23.29)
Front coverage: power_index 2.01..10.6 (HV reference 40); accuracy_bits 12.3..23.3 (HV reference 12); data_width on the front 16..28 (registry 8..28).

Per family:
- iterative: 16 evals, 0 feasible; max throughput seen 14.6 MSPS; best accuracy 11.45 bits
- unrolled_k: 24 evals, 0 feasible; max throughput seen 9.04 MSPS; best accuracy 13.47 bits
- pipelined: 59 evals, 49 feasible; max throughput seen 163 MSPS; best accuracy 23.29 bits; best feasible power_index=3.42; feasible ranges: data_width 17..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 301 evals, 74 feasible; max throughput seen 102 MSPS; best accuracy 24.54 bits; best feasible power_index=2.01; feasible ranges: data_width 15..28, n_iter 14..30, angle_guard -2..4, frac_guard 0..4, m 2..3
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 13235 in, 24168 out
- provider-reported cost: $0.0202
- full prompts and replies: `llm_trace.jsonl`

