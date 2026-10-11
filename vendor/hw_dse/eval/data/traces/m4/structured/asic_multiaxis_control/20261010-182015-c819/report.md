# DSE run: asic_multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined:data_width=17,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 41436 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 11039 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 879 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 128 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 128 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 125 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.34 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000185 (2^-12.40) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.06 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.36e-05 (2^-14.19) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.76 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.4 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 96.6 dBc, SNR 82.4 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (183) was simulated at its estimated Fmax (SimPy); 173 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=17,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=20,n_iter=14,angle_guard=-1,frac_guard=1,rounding=trunc` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=18,n_iter=14,angle_guard=-1,frac_guard=4,rounding=round` | 0.3738 → 0.3818 | yes |
| `pipelined:data_width=20,n_iter=14,angle_guard=-1,frac_guard=1,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 0.3551 → 0.3625 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (31 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=17,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` | 41436 | 879 | 127.5 | 16 | 2.34 | 0.000185 (2^-12.40) | 12.40 |
| 1 | `pipelined:data_width=20,n_iter=14,angle_guard=-1,frac_guard=1,rounding=trunc` | 43075 | 932 | 127.5 | 16 | 2.47 | 0.000151 (2^-12.69) | 12.69 |
| 2 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 44303 | 959 | 132.4 | 17 | 2.54 | 8.66e-05 (2^-13.50) | 13.50 |
| 3 | `pipelined:data_width=17,n_iter=15,angle_guard=4,frac_guard=3,rounding=round` | 47009 | 993 | 127.5 | 17 | 2.65 | 8.45e-05 (2^-13.53) | 13.53 |
| 4 | `pipelined:data_width=20,n_iter=15,angle_guard=0,frac_guard=2,rounding=round` | 49305 | 1041 | 123.1 | 17 | 2.78 | 7.53e-05 (2^-13.70) | 13.70 |
| 5 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 50025 | 1074 | 127.5 | 18 | 2.85 | 5.94e-05 (2^-14.04) | 14.04 |
| 6 | `pipelined:data_width=21,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 51019 | 1101 | 127.5 | 18 | 2.92 | 4.14e-05 (2^-14.56) | 14.56 |
| 7 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=trunc` | 54223 | 1166 | 127.5 | 19 | 3.1 | 3.57e-05 (2^-14.78) | 14.78 |
| 8 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=1,rounding=trunc` | 55003 | 1183 | 123.1 | 19 | 3.14 | 3.13e-05 (2^-14.96) | 14.96 |
| 9 | `pipelined:data_width=19,n_iter=17,angle_guard=4,frac_guard=3,rounding=trunc` | 57168 | 1225 | 118.9 | 19 | 3.26 | 2.82e-05 (2^-15.11) | 15.11 |
| 10 | `pipelined:data_width=21,n_iter=17,angle_guard=3,frac_guard=1,rounding=trunc` | 58123 | 1250 | 115.0 | 19 | 3.32 | 2.32e-05 (2^-15.40) | 15.40 |
| 11 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=2,rounding=trunc` | 58815 | 1262 | 118.9 | 19 | 3.35 | 1.95e-05 (2^-15.65) | 15.65 |
| 12 | `pipelined:data_width=22,n_iter=17,angle_guard=2,frac_guard=1,rounding=trunc` | 59682 | 1283 | 115.0 | 19 | 3.41 | 1.83e-05 (2^-15.74) | 15.74 |
| 13 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc` | 59996 | 1288 | 123.1 | 20 | 3.42 | 1.73e-05 (2^-15.82) | 15.82 |
| 14 | `pipelined:data_width=22,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 60910 | 1310 | 118.9 | 20 | 3.48 | 1.21e-05 (2^-16.34) | 16.34 |
| 15 | `pipelined:data_width=21,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 63958 | 1369 | 115.0 | 20 | 3.64 | 1.12e-05 (2^-16.44) | 16.44 |
| 16 | `pipelined:data_width=22,n_iter=18,angle_guard=3,frac_guard=1,rounding=round` | 65300 | 1378 | 111.3 | 20 | 3.68 | 9.77e-06 (2^-16.64) | 16.64 |
| 17 | `pipelined:data_width=23,n_iter=19,angle_guard=0,frac_guard=0,rounding=trunc` | 66140 | 1420 | 118.9 | 21 | 3.77 | 8.46e-06 (2^-16.85) | 16.85 |
| 18 | `pipelined:data_width=25,n_iter=18,angle_guard=0,frac_guard=0,rounding=trunc` | 67528 | 1451 | 111.3 | 20 | 3.85 | 8.4e-06 (2^-16.86) | 16.86 |
| 19 | `pipelined:data_width=23,n_iter=19,angle_guard=0,frac_guard=1,rounding=trunc` | 67802 | 1453 | 115.0 | 21 | 3.86 | 6.97e-06 (2^-17.13) | 17.13 |
| 20 | `pipelined:data_width=22,n_iter=20,angle_guard=1,frac_guard=0,rounding=round` | 67871 | 1455 | 118.9 | 22 | 3.87 | 6.49e-06 (2^-17.23) | 17.23 |
| 21 | `pipelined:data_width=21,n_iter=19,angle_guard=3,frac_guard=2,rounding=round` | 67957 | 1432 | 115.0 | 21 | 3.83 | 6.17e-06 (2^-17.31) | 17.31 |
| 22 | `pipelined:data_width=23,n_iter=19,angle_guard=1,frac_guard=1,rounding=trunc` | 68677 | 1472 | 115.0 | 21 | 3.91 | 6.08e-06 (2^-17.33) | 17.33 |
| 23 | `pipelined:data_width=23,n_iter=19,angle_guard=1,frac_guard=1,rounding=round` | 69896 | 1474 | 115.0 | 21 | 3.94 | 5.75e-06 (2^-17.41) | 17.41 |
| 24 | `pipelined:data_width=23,n_iter=19,angle_guard=1,frac_guard=2,rounding=trunc` | 70339 | 1505 | 111.3 | 21 | 4 | 5.75e-06 (2^-17.41) | 17.41 |
| 25 | `pipelined:data_width=23,n_iter=19,angle_guard=2,frac_guard=2,rounding=round` | 72432 | 1526 | 111.3 | 21 | 4.08 | 4.81e-06 (2^-17.67) | 17.67 |
| 26 | `pipelined:data_width=26,n_iter=19,angle_guard=0,frac_guard=1,rounding=trunc` | 75674 | 1621 | 104.7 | 21 | 4.31 | 4.2e-06 (2^-17.86) | 17.86 |
| 27 | `pipelined:data_width=23,n_iter=21,angle_guard=1,frac_guard=1,rounding=trunc` | 76111 | 1627 | 115.0 | 23 | 4.33 | 3.47e-06 (2^-18.14) | 18.14 |
| 28 | `pipelined:data_width=25,n_iter=21,angle_guard=-1,frac_guard=0,rounding=round` | 78137 | 1672 | 111.3 | 23 | 4.45 | 2.56e-06 (2^-18.58) | 18.58 |
| 29 | `pipelined:data_width=23,n_iter=22,angle_guard=1,frac_guard=2,rounding=round` | 82994 | 1746 | 111.3 | 24 | 4.67 | 2.53e-06 (2^-18.59) | 18.59 |
| 30 | `pipelined:data_width=23,n_iter=22,angle_guard=2,frac_guard=2,rounding=round` | 84011 | 1768 | 111.3 | 24 | 4.73 | 1.68e-06 (2^-19.19) | 19.19 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraint is the system one: a 1 MHz tick dumps 32 requests that must all return within 0.5 us, i.e. roughly 64 results/us during the burst, and the L1 bound is optimistic so real margin is needed. That rules out iterative (N+3 cycles/result) and makes unrolled_k marginal, while pipelined and pipelined_m both sustain 1 result/cycle. Accuracy (max_abs_err <= 2^-12) needs roughly W>=14 and N>=13, so I search data_width 12-20 and n_iter 10-20 to bracket the feasible accuracy boundary, with full guard-bit and rounding ranges since they trade area against error. Round 1 maps all three plausible families broadly; later rounds will narrow onto the area-vs-accuracy front and the m/k throughput boundary.*)
- `pipelined_m` (45 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Delivers 1 result/cycle (so it can drain a 32-request burst in ~32 cycles) while registering only every m stages, which cuts pipeline FFs by up to ~N/m versus full pipelining. Since area is the objective, this is the most likely min-area winner; m is the key knob trading Fmax (burst-drain time) against register count.
- `pipelined` (35 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* One register per micro-rotation gives the shortest critical path and hence the highest Fmax, which is the safest way to satisfy the 0.5 us p99 batch bound even under the pessimistic L2 simulation. It anchors the high-throughput end of the front and provides the reference area cost of full pipelining.
- `unrolled_k` (20 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* Reuses only k micro-rotation units over ceil(N/k) cycles, so it can be much smaller than a full pipeline; with large k it may still drain 32 requests inside 0.5 us. It sits right at the feasibility boundary of the batch constraint, so a modest share probes whether a lower-area corner exists.

**Result (code):** 100 evaluations this round, 100 total; 9 feasible; hypervolume 1.907e+05 (n/a).

**LLM decision:** `map_front` — All 5 feasible front designs are `pipelined` with data_width=20, so the front covers only data_width 20..20 of the registry's 8..28 range — the low-area corner is unmapped. Since the objective and selection rule are both min area_um2, and the cheapest front point (49618 um2) sits at accuracy_bits=13, only ~1 bit above the 2^-12 constraint, smaller data_width (e.g. 18-19) plausibly trades accuracy for a large area reduction and would extend the front leftward. The throughput constraint (>=32 MSPS) is comfortably met by pipelined (115-171 MSPS); the binding constraint is sys_p99_batch_us (65% violate), which structurally favours 1-result/cycle families, so the front should stay in pipelined/pipelined_m. `iterative` (unexplored) needs N+3 cycles/result, i.e. ~544 cycles to drain a 32-request tick, which cannot fit 0.5 us at any plausible Fmax — not worth a dedicated round. `unrolled_k` and `pipelined_m` produced 0 feasible in 65 evals. Let code spend this round mapping the full ranges of the on-front family (pipelined, seeded with the current front) so the whole area/accuracy trade-off, especially the low-area/low-W end, is covered before the reserved final mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.907e+05 (gain this round: n/a (first round)).
Feasible designs: 9 of 100 evaluations (6 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 49% violate; best seen 171
- max_abs_err <= 0.000244141: 58% violate; best seen 9.46e-06 (2^-16.69)
- sys_p99_batch_us <= 0.5: 65% violate; best seen 0.257

Pareto front (feasible, 5 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=20 n_iter=14 angle_guard=2 frac_guard=4 rounding=round] area_um2=49618, accuracy_bits=13, ffs=1046, throughput_msps=115, max_abs_err=0.000126 (2^-12.96), power_index=2.8
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] area_um2=60974, accuracy_bits=16, ffs=1286, throughput_msps=123, max_abs_err=1.51e-05 (2^-16.01), power_index=3.44
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=4 rounding=round] area_um2=64109, accuracy_bits=16.2, ffs=1349, throughput_msps=115, max_abs_err=1.32e-05 (2^-16.21), power_index=3.61
- pipelined [data_width=20 n_iter=18 angle_guard=4 frac_guard=4 rounding=round] area_um2=65763, accuracy_bits=16.5, ffs=1384, throughput_msps=115, max_abs_err=1.06e-05 (2^-16.52), power_index=3.7
- pipelined [data_width=20 n_iter=19 angle_guard=2 frac_guard=4 rounding=round] area_um2=67731, accuracy_bits=16.7, ffs=1425, throughput_msps=115, max_abs_err=9.46e-06 (2^-16.69), power_index=3.81
Front coverage: area_um2 49618..67731 (HV reference 100000); accuracy_bits 13..16.7 (HV reference 12); data_width on the front 20..20 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 15.88 bits
- pipelined: 35 evals, 9 feasible; max throughput seen 171 MSPS; best accuracy 16.69 bits; best feasible area_um2=49618; feasible ranges: data_width 20..20, n_iter 14..19, angle_guard -2..4, frac_guard 2..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 15.49 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=19..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (5 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 80 feasible; hypervolume 2.739e+05 (+43.7%).

**LLM decision:** `map_front` — Feasibility is pinned almost entirely to one family, so the right use of this round is to fill out that family's whole trade-off curve rather than add families that the numbers say cannot work.

Evidence:
- Only `pipelined` produced feasible designs (80/135 evals; feasible data_width 19..27, n_iter 13..25, angle_guard -2..4, frac_guard 0..4). `unrolled_k` is 0/20 with max throughput seen 6.13 MSPS and `pipelined_m` is 0/45. The request stream is a 32-wide burst every 1 us, so any family that emits <1 result/cycle (iterative = 1 result per N+3 cycles, and accuracy needs N>=~13 => <= Fmax/16) cannot reach the hard `throughput_msps >= 32` even before accuracy; adding `iterative` would burn budget on a provably unreachable constraint.
- The front only covers accuracy_bits 12.9..19.2, while `pipelined` itself has reached 22.72 bits feasibly with data_width up to 27, and the front's max area (84011) is short of the HV area reference (100000). So the Pareto curve is truncated at the high-accuracy end and the hypervolume box is not being filled - exactly the condition map_front targets.
- HV is still improving strongly (+43.7% this round), i.e. the front is not saturated, and the accuracy/area endpoints (12.9..19.2 / 45499..84011) indicate room to extend both directions.

Action: spend round 3 running NSGA-II over the full `pipelined` ranges (the only family on the front), seeded with the current 20-design front, so the trade-off curve is mapped end-to-end. This also leaves round 4 available for a final refine or check on any residual gap.

Note for the final pick: the selection rule is min area_um2, but the cheapest front points must still clear sys_p99_batch_us after L2 simulation - the L1 screen is optimistic, so keeping a populated curve (rather than only the extreme low-area corner) preserves robust candidates if the cheapest ones fail at L2.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.739e+05 (gain this round: +43.7%).
Feasible designs: 80 of 200 evaluations (63 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 24% violate; best seen 171
- max_abs_err <= 0.000244141: 32% violate; best seen 1.45e-07 (2^-22.72)
- sys_p99_batch_us <= 0.5: 44% violate; best seen 0.257

Pareto front (feasible, 20 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=19 n_iter=15 angle_guard=-1 frac_guard=2 rounding=trunc] area_um2=45499, accuracy_bits=12.9, ffs=980, throughput_msps=128, max_abs_err=0.000127 (2^-12.94), power_index=2.6
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=2 rounding=round] area_um2=49305, accuracy_bits=13.7, ffs=1041, throughput_msps=123, max_abs_err=7.53e-05 (2^-13.70), power_index=2.78
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=52898, accuracy_bits=14.4, ffs=1118, throughput_msps=132, max_abs_err=4.63e-05 (2^-14.40), power_index=2.99
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=57168, accuracy_bits=15.1, ffs=1225, throughput_msps=119, max_abs_err=2.82e-05 (2^-15.11), power_index=3.26
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=58815, accuracy_bits=15.6, ffs=1262, throughput_msps=119, max_abs_err=1.95e-05 (2^-15.65), power_index=3.35
- pipelined [data_width=20 n_iter=18 angle_guard=4 frac_guard=4 rounding=round] area_um2=65763, accuracy_bits=16.5, ffs=1384, throughput_msps=115, max_abs_err=1.06e-05 (2^-16.52), power_index=3.7
- pipelined [data_width=23 n_iter=19 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=67802, accuracy_bits=17.1, ffs=1453, throughput_msps=115, max_abs_err=6.97e-06 (2^-17.13), power_index=3.86
- pipelined [data_width=23 n_iter=19 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=70339, accuracy_bits=17.4, ffs=1505, throughput_msps=111, max_abs_err=5.75e-06 (2^-17.41), power_index=4
- pipelined [data_width=23 n_iter=21 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=76111, accuracy_bits=18.1, ffs=1627, throughput_msps=115, max_abs_err=3.47e-06 (2^-18.14), power_index=4.33
- pipelined [data_width=23 n_iter=22 angle_guard=2 frac_guard=2 rounding=round] area_um2=84011, accuracy_bits=19.2, ffs=1768, throughput_msps=111, max_abs_err=1.68e-06 (2^-19.19), power_index=4.73
Front coverage: area_um2 45499..84011 (HV reference 100000); accuracy_bits 12.9..19.2 (HV reference 12); data_width on the front 19..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 15.88 bits
- pipelined: 135 evals, 80 feasible; max throughput seen 171 MSPS; best accuracy 22.72 bits; best feasible area_um2=45499; feasible ranges: data_width 19..27, n_iter 13..25, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 15.49 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=18..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (20 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 149 feasible; hypervolume 2.814e+05 (+2.7%).

**LLM decision:** `map_front` — The feasible front is entirely pipelined (23 designs), while unrolled_k and pipelined_m produced 0 feasible designs in 65 combined evals and iterative is untried but structurally slower (1 micro-rotation/cycle, N+3 cycles/result) than unrolled_k, whose best throughput was only 6.13 MSPS — so iterative cannot plausibly reach the 32 MSPS / 0.5 us batch constraints and is not worth a family slot. The front's accuracy tops out at 19.2 bits although feasible designs reach 23.06 bits, and its area spans 43777..84011 against an HV reference of 100000, so the curve is only partially mapped on the accuracy axis. With exactly 100 of 400 evals (one round) left, this is the reserved coverage phase: let NSGA-II map the full pipelined ranges seeded with the current front to extend the high-accuracy end and confirm the low-area corner (data_width=18, area 43777) is truly minimal. Note the L1 sys_p99_batch_us bound is optimistic; the cheapest front design runs at 123 MSPS (32 cycles ≈ 0.26 us vs the 0.5 us limit), so L2 re-selection should still have margin, but the mapping should keep batch-latency headroom in view.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 2.814e+05 (gain this round: +2.7%).
Feasible designs: 149 of 300 evaluations (123 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 16% violate; best seen 171
- max_abs_err <= 0.000244141: 22% violate; best seen 1.14e-07 (2^-23.06)
- sys_p99_batch_us <= 0.5: 39% violate; best seen 0.257

Pareto front (feasible, 23 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=14 angle_guard=-1 frac_guard=4 rounding=round] area_um2=43777, accuracy_bits=12, ffs=922, throughput_msps=123, max_abs_err=0.00024 (2^-12.03), power_index=2.47
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=2 rounding=round] area_um2=49305, accuracy_bits=13.7, ffs=1041, throughput_msps=123, max_abs_err=7.53e-05 (2^-13.70), power_index=2.78
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=54223, accuracy_bits=14.8, ffs=1166, throughput_msps=128, max_abs_err=3.57e-05 (2^-14.78), power_index=3.1
- pipelined [data_width=19 n_iter=17 angle_guard=4 frac_guard=3 rounding=trunc] area_um2=57168, accuracy_bits=15.1, ffs=1225, throughput_msps=119, max_abs_err=2.82e-05 (2^-15.11), power_index=3.26
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] area_um2=60974, accuracy_bits=16, ffs=1286, throughput_msps=123, max_abs_err=1.51e-05 (2^-16.01), power_index=3.44
- pipelined [data_width=22 n_iter=18 angle_guard=3 frac_guard=1 rounding=round] area_um2=65300, accuracy_bits=16.6, ffs=1378, throughput_msps=111, max_abs_err=9.77e-06 (2^-16.64), power_index=3.68
- pipelined [data_width=23 n_iter=19 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=67802, accuracy_bits=17.1, ffs=1453, throughput_msps=115, max_abs_err=6.97e-06 (2^-17.13), power_index=3.86
- pipelined [data_width=23 n_iter=19 angle_guard=1 frac_guard=2 rounding=trunc] area_um2=70339, accuracy_bits=17.4, ffs=1505, throughput_msps=111, max_abs_err=5.75e-06 (2^-17.41), power_index=4
- pipelined [data_width=25 n_iter=21 angle_guard=-1 frac_guard=0 rounding=round] area_um2=78137, accuracy_bits=18.6, ffs=1672, throughput_msps=111, max_abs_err=2.56e-06 (2^-18.58), power_index=4.45
- pipelined [data_width=23 n_iter=22 angle_guard=2 frac_guard=2 rounding=round] area_um2=84011, accuracy_bits=19.2, ffs=1768, throughput_msps=111, max_abs_err=1.68e-06 (2^-19.19), power_index=4.73
Front coverage: area_um2 43777..84011 (HV reference 100000); accuracy_bits 12..19.2 (HV reference 12); data_width on the front 18..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 15.88 bits
- pipelined: 235 evals, 149 feasible; max throughput seen 171 MSPS; best accuracy 23.06 bits; best feasible area_um2=43777; feasible ranges: data_width 18..27, n_iter 13..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 15.49 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=17..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (23 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 218 feasible; hypervolume 2.852e+05 (+1.3%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the run has converged on a feasible, well-covered front rather than an infeasible spec. All three constraints are demonstrably reachable: throughput best seen 171 MSPS vs >=32, max_abs_err best 1.14e-07 (2^-23.06) vs <=2.44e-04, sys_p99_batch_us best 0.257 vs <=0.5, with 218/400 evaluations feasible (183 unique) and 31 designs on the Pareto front. The front spans area_um2 41436..84011 against the HV reference 100000 and accuracy_bits 12.4..19.2 against the reference 12, i.e. it already covers both objective ranges, and this round's hypervolume gain was only +1.3% (2.852e+05), indicating diminishing returns. The selection rule (min area_um2) is satisfied by pipelined [data_width=17 n_iter=14 angle_guard=4 frac_guard=1 rounding=round] at 41436 um^2 with 12.4 accuracy bits, which clears the 2^-12 error limit with margin. unrolled_k and pipelined_m produced 0 feasible designs (max throughput 6.13 and 66.8 MSPS respectively, but no design meeting all constraints), and the unexplored iterative family is strictly slower per result than the pipelined family that dominates the front, so it cannot improve the min-area corner. No further exploration is warranted; the remaining risk is the L2 system re-selection on the shortlist, which code handles after selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.852e+05 (gain this round: +1.3%).
Feasible designs: 218 of 400 evaluations (183 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 12% violate; best seen 171
- max_abs_err <= 0.000244141: 19% violate; best seen 1.14e-07 (2^-23.06)
- sys_p99_batch_us <= 0.5: 35% violate; best seen 0.257

Pareto front (feasible, 31 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=14 angle_guard=4 frac_guard=1 rounding=round] area_um2=41436, accuracy_bits=12.4, ffs=879, throughput_msps=128, max_abs_err=0.000185 (2^-12.40), power_index=2.34
- pipelined [data_width=17 n_iter=15 angle_guard=4 frac_guard=3 rounding=round] area_um2=47009, accuracy_bits=13.5, ffs=993, throughput_msps=128, max_abs_err=8.45e-05 (2^-13.53), power_index=2.65
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=54223, accuracy_bits=14.8, ffs=1166, throughput_msps=128, max_abs_err=3.57e-05 (2^-14.78), power_index=3.1
- pipelined [data_width=21 n_iter=17 angle_guard=3 frac_guard=1 rounding=trunc] area_um2=58123, accuracy_bits=15.4, ffs=1250, throughput_msps=115, max_abs_err=2.32e-05 (2^-15.40), power_index=3.32
- pipelined [data_width=21 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=59996, accuracy_bits=15.8, ffs=1288, throughput_msps=123, max_abs_err=1.73e-05 (2^-15.82), power_index=3.42
- pipelined [data_width=23 n_iter=19 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=66140, accuracy_bits=16.9, ffs=1420, throughput_msps=119, max_abs_err=8.46e-06 (2^-16.85), power_index=3.77
- pipelined [data_width=22 n_iter=20 angle_guard=1 frac_guard=0 rounding=round] area_um2=67871, accuracy_bits=17.2, ffs=1455, throughput_msps=119, max_abs_err=6.49e-06 (2^-17.23), power_index=3.87
- pipelined [data_width=23 n_iter=19 angle_guard=1 frac_guard=1 rounding=round] area_um2=69896, accuracy_bits=17.4, ffs=1474, throughput_msps=115, max_abs_err=5.75e-06 (2^-17.41), power_index=3.94
- pipelined [data_width=23 n_iter=21 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=76111, accuracy_bits=18.1, ffs=1627, throughput_msps=115, max_abs_err=3.47e-06 (2^-18.14), power_index=4.33
- pipelined [data_width=23 n_iter=22 angle_guard=2 frac_guard=2 rounding=round] area_um2=84011, accuracy_bits=19.2, ffs=1768, throughput_msps=111, max_abs_err=1.68e-06 (2^-19.19), power_index=4.73
Front coverage: area_um2 41436..84011 (HV reference 100000); accuracy_bits 12.4..19.2 (HV reference 12); data_width on the front 17..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.13 MSPS; best accuracy 15.88 bits
- pipelined: 335 evals, 218 feasible; max throughput seen 171 MSPS; best accuracy 23.06 bits; best feasible area_um2=41436; feasible ranges: data_width 17..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 45 evals, 0 feasible; max throughput seen 66.8 MSPS; best accuracy 15.49 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16478 in, 16499 out
- provider-reported cost: $0.0143
- full prompts and replies: `llm_trace.jsonl`

