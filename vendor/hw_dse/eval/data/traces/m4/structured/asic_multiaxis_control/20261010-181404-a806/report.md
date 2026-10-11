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
`pipelined:data_width=19,n_iter=14,angle_guard=-2,frac_guard=1,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 41539 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 11066 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 879 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 121 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.35 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.000241 (2^-12.02) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 31.6 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 5.91e-05 (2^-14.05) | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 7.75 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12 | exact: bit-accurate model, dense (119307 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 97.0 dBc, SNR 81.8 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (126) was simulated at its estimated Fmax (SimPy); 122 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=19,n_iter=14,angle_guard=-2,frac_guard=1,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=-2,frac_guard=2,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 0.3607 → 0.3684 | yes |
| `pipelined:data_width=19,n_iter=15,angle_guard=-2,frac_guard=1,rounding=round` | 0.3551 → 0.3625 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` | 0.3869 → 0.3952 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=19,n_iter=14,angle_guard=-2,frac_guard=1,rounding=round` | 41539 | 879 | 132.4 | 16 | 2.35 | 0.000241 (2^-12.02) | 12.02 |
| 1 | `pipelined:data_width=19,n_iter=14,angle_guard=-2,frac_guard=2,rounding=round` | 42727 | 903 | 127.5 | 16 | 2.41 | 0.000233 (2^-12.07) | 12.07 |
| 2 | `pipelined:data_width=19,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 44090 | 934 | 127.5 | 16 | 2.49 | 0.000136 (2^-12.84) | 12.84 |
| 3 | `pipelined:data_width=19,n_iter=14,angle_guard=4,frac_guard=1,rounding=round` | 45365 | 962 | 118.9 | 16 | 2.57 | 0.000132 (2^-12.88) | 12.88 |
| 4 | `pipelined:data_width=19,n_iter=15,angle_guard=0,frac_guard=1,rounding=round` | 45915 | 971 | 132.4 | 17 | 2.59 | 0.000102 (2^-13.26) | 13.26 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc` | 47357 | 1022 | 132.4 | 18 | 2.71 | 8.56e-05 (2^-13.51) | 13.51 |
| 6 | `pipelined:data_width=19,n_iter=15,angle_guard=4,frac_guard=1,rounding=round` | 48656 | 1030 | 118.9 | 17 | 2.75 | 7.38e-05 (2^-13.73) | 13.73 |
| 7 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=1,rounding=round` | 48966 | 1036 | 127.5 | 18 | 2.77 | 6.51e-05 (2^-13.91) | 13.91 |
| 8 | `pipelined:data_width=18,n_iter=16,angle_guard=3,frac_guard=2,rounding=round` | 50343 | 1064 | 127.5 | 18 | 2.84 | 5.17e-05 (2^-14.24) | 14.24 |
| 9 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 51971 | 1120 | 123.1 | 19 | 2.97 | 4.23e-05 (2^-14.53) | 14.53 |
| 10 | `pipelined:data_width=22,n_iter=16,angle_guard=-1,frac_guard=1,rounding=trunc` | 53862 | 1160 | 118.9 | 18 | 3.08 | 3.88e-05 (2^-14.66) | 14.66 |
| 11 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=0,rounding=trunc` | 55090 | 1187 | 123.1 | 19 | 3.15 | 3.12e-05 (2^-14.97) | 14.97 |
| 12 | `pipelined:data_width=19,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 56874 | 1201 | 127.5 | 20 | 3.21 | 3.09e-05 (2^-14.98) | 14.98 |
| 13 | `pipelined:data_width=20,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc` | 57514 | 1235 | 127.5 | 20 | 3.28 | 2.8e-05 (2^-15.12) | 15.12 |
| 14 | `pipelined:data_width=19,n_iter=18,angle_guard=3,frac_guard=1,rounding=round` | 57701 | 1219 | 123.1 | 20 | 3.26 | 2.57e-05 (2^-15.25) | 15.25 |
| 15 | `pipelined:data_width=20,n_iter=17,angle_guard=2,frac_guard=3,rounding=round` | 59014 | 1244 | 118.9 | 19 | 3.32 | 2.07e-05 (2^-15.56) | 15.56 |
| 16 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=1,rounding=round` | 59407 | 1254 | 123.1 | 20 | 3.35 | 1.89e-05 (2^-15.69) | 15.69 |
| 17 | `pipelined:data_width=20,n_iter=18,angle_guard=3,frac_guard=1,rounding=round` | 60234 | 1272 | 118.9 | 20 | 3.4 | 1.69e-05 (2^-15.85) | 15.85 |
| 18 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 61476 | 1315 | 118.9 | 20 | 3.5 | 1.59e-05 (2^-15.94) | 15.94 |
| 19 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=3,rounding=round` | 62542 | 1317 | 118.9 | 20 | 3.52 | 1.32e-05 (2^-16.21) | 16.21 |
| 20 | `pipelined:data_width=20,n_iter=18,angle_guard=3,frac_guard=4,rounding=trunc` | 63870 | 1365 | 115.0 | 20 | 3.63 | 1.31e-05 (2^-16.22) | 16.22 |
| 21 | `pipelined:data_width=22,n_iter=18,angle_guard=0,frac_guard=2,rounding=round` | 64386 | 1357 | 115.0 | 20 | 3.63 | 1.25e-05 (2^-16.28) | 16.28 |
| 22 | `pipelined:data_width=21,n_iter=18,angle_guard=3,frac_guard=3,rounding=trunc` | 64785 | 1386 | 115.0 | 20 | 3.69 | 1.08e-05 (2^-16.50) | 16.50 |
| 23 | `pipelined:data_width=23,n_iter=18,angle_guard=3,frac_guard=2,rounding=trunc` | 68181 | 1461 | 107.9 | 20 | 3.88 | 8.56e-06 (2^-16.83) | 16.83 |
| 24 | `pipelined:data_width=23,n_iter=19,angle_guard=3,frac_guard=0,rounding=trunc` | 68764 | 1476 | 107.9 | 21 | 3.92 | 7.63e-06 (2^-17.00) | 17.00 |
| 25 | `pipelined:data_width=23,n_iter=19,angle_guard=3,frac_guard=1,rounding=trunc` | 70426 | 1509 | 107.9 | 21 | 4.01 | 5.7e-06 (2^-17.42) | 17.42 |
| 26 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=3,rounding=trunc` | 74985 | 1601 | 111.3 | 22 | 4.26 | 3.59e-06 (2^-18.09) | 18.09 |
| 27 | `pipelined:data_width=26,n_iter=21,angle_guard=-2,frac_guard=0,rounding=round` | 80076 | 1714 | 107.9 | 23 | 4.56 | 2.38e-06 (2^-18.68) | 18.68 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec is a bursty control loop: 32 requests every 1 us must all return within 0.5 us, so the effective sustained rate is ~64 msps even though the stated floor is 32 msps, and the L1 system bound is optimistic so I want margin. That rules out anything with many cycles/result: iterative (N+3) and unrolled_k (ceil(N/k)+3) are marginal-to-hopeless, while pipelined and pipelined_m give 1 result/cycle and short latency. Area is the selection objective, so the real trade-off is pipelined (more FFs, higher Fmax) vs pipelined_m (fewer FFs, lower Fmax) — I weight those two heavily and sweep m, W and N around the 12-bit accuracy boundary (W>=14, N>=12) to locate the cheapest design that still clears accuracy and the burst. unrolled_k and iterative get small shares to check whether a cheaper non-1-result/cycle design can survive the system bound and to anchor the low-area end of the Pareto front.*)
- `pipelined` (40 evals): data_width=12..20, n_iter=8..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result/cycle with a register per micro-rotation is the only family that plausibly clears both the 32 msps throughput floor and the 32-requests-in-0.5us burst (needs ~64 msps sustained), and its short N+2 latency keeps the batch bound comfortable; search W/N around the 12-bit accuracy boundary to find the min-area corner.
- `pipelined_m` (35 evals): data_width=12..20, n_iter=8..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle so it can meet the burst, but registering every m stages trades Fmax for far fewer flip-flops; m is the key knob for the min-area objective, so sweep the whole 2..8 range against W and N.
- `unrolled_k` (15 evals): data_width=12..20, n_iter=8..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Multi-rotation/cycle with a shared datapath is the area-efficient middle ground; large k may reach the 32 msps floor, but ceil(N/k)+3 cycles/result makes the 0.5us burst bound doubtful, so keep the share modest and let the search tell us if it survives.
- `iterative` (10 evals): data_width=12..20, n_iter=8..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Smallest-area family and would dominate the objective if feasible, but N+3 cycles/result makes 32 msps (let alone the burst) very unlikely; a small share confirms or refutes it cheaply and anchors the low-area end of the front.

**Result (code):** 100 evaluations this round, 100 total; 26 feasible; hypervolume 1.816e+05 (n/a).

**LLM decision:** `map_front` — Only `pipelined` is feasible (26/40 evals; every other family 0 feasible), and the feasible front is a narrow band: data_width 17..20 out of the registry's 8..28, area 49329..61476, accuracy 12.2..15.9 bits. The binding constraints are throughput>=32 MSPS and sys_p99_batch_us<=0.5us, which only the 1-result/cycle pipelined family satisfies (iterative/unrolled_k top out at 8-11 MSPS; pipelined_m at 91 MSPS but 0 feasible). Because the front occupies only a small slice of the data_width range and the accuracy objective already sits well above its HV reference (12), the highest-value move is to let NSGA-II map the full pipelined (and pipelined_m) parameter space seeded with this front, rather than refining a region that is already dense. This should extend the front toward lower area (smaller data_width that still clears 2^-12) and confirm whether pipelined_m can be made feasible, improving hypervolume coverage before the reserved end-of-run mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.816e+05 (gain this round: n/a (first round)).
Feasible designs: 26 of 100 evaluations (21 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 32% violate; best seen 190
- max_abs_err <= 0.000244141: 45% violate; best seen 1.59e-05 (2^-15.94)
- sys_p99_batch_us <= 0.5: 58% violate; best seen 0.245

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=18 n_iter=18 angle_guard=-1 frac_guard=0 rounding=trunc] area_um2=49329, accuracy_bits=12.2, ffs=1062, throughput_msps=143, max_abs_err=0.00021 (2^-12.22), power_index=2.82
- pipelined [data_width=17 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=50069, accuracy_bits=12.5, ffs=1076, throughput_msps=143, max_abs_err=0.000174 (2^-12.49), power_index=2.86
- pipelined [data_width=19 n_iter=17 angle_guard=-1 frac_guard=1 rounding=round] area_um2=51338, accuracy_bits=13.3, ffs=1084, throughput_msps=132, max_abs_err=0.000101 (2^-13.28), power_index=2.9
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] area_um2=51971, accuracy_bits=14.5, ffs=1120, throughput_msps=123, max_abs_err=4.23e-05 (2^-14.53), power_index=2.97
- pipelined [data_width=18 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] area_um2=55909, accuracy_bits=14.7, ffs=1180, throughput_msps=132, max_abs_err=3.81e-05 (2^-14.68), power_index=3.15
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] area_um2=56687, accuracy_bits=14.7, ffs=1217, throughput_msps=128, max_abs_err=3.75e-05 (2^-14.70), power_index=3.23
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=56874, accuracy_bits=15, ffs=1201, throughput_msps=128, max_abs_err=3.09e-05 (2^-14.98), power_index=3.21
- pipelined [data_width=19 n_iter=18 angle_guard=3 frac_guard=1 rounding=round] area_um2=57701, accuracy_bits=15.2, ffs=1219, throughput_msps=123, max_abs_err=2.57e-05 (2^-15.25), power_index=3.26
- pipelined [data_width=20 n_iter=18 angle_guard=3 frac_guard=1 rounding=round] area_um2=60234, accuracy_bits=15.9, ffs=1272, throughput_msps=119, max_abs_err=1.69e-05 (2^-15.85), power_index=3.4
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=61476, accuracy_bits=15.9, ffs=1315, throughput_msps=119, max_abs_err=1.59e-05 (2^-15.94), power_index=3.5
Front coverage: area_um2 49329..61476 (HV reference 100000); accuracy_bits 12.2..15.9 (HV reference 12); data_width on the front 17..20 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.30 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 14.53 bits
- pipelined: 40 evals, 26 feasible; max throughput seen 190 MSPS; best accuracy 15.94 bits; best feasible area_um2=49329; feasible ranges: data_width 17..20, n_iter 17..20, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 35 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 15.39 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (50 evals): data_width=16..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (10 front designs; box front_anchored)
- `pipelined_m` (50 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 100 evaluations this round, 200 total; 64 feasible; hypervolume 2.445e+05 (+34.7%).

**LLM decision:** `map_front` — The feasible front is entirely the `pipelined` family (64 of 90 pipelined evals feasible; iterative/unrolled_k/pipelined_m all 0 feasible, capped at 11/8.4/91 MSPS or failing the batch bound), and it covers only part of the accuracy objective: accuracy_bits 13.5..17.8 on the front versus 23.75 bits achieved by some evaluated design, and max area 75412 versus the 100000 HV reference. With 200 of 400 evals left and the HV still gaining (+34.7% this round), the best use of the remaining budget is a code-driven coverage search over the full pipelined ranges (data_width 16..28, n_iter 16..27, angle_guard -2..3, frac_guard 0..4, both roundings) seeded with the current front, so the whole area/accuracy trade-off curve is mapped before the min-area selection rule picks the winner. No new family is worth adding since none of the other three produced a single feasible design.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.445e+05 (gain this round: +34.7%).
Feasible designs: 64 of 200 evaluations (52 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 26% violate; best seen 190
- max_abs_err <= 0.000244141: 42% violate; best seen 7.07e-08 (2^-23.75)
- sys_p99_batch_us <= 0.5: 58% violate; best seen 0.245

Pareto front (feasible, 15 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=47357, accuracy_bits=13.5, ffs=1022, throughput_msps=132, max_abs_err=8.56e-05 (2^-13.51), power_index=2.71
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] area_um2=51971, accuracy_bits=14.5, ffs=1120, throughput_msps=123, max_abs_err=4.23e-05 (2^-14.53), power_index=2.97
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=55090, accuracy_bits=15, ffs=1187, throughput_msps=123, max_abs_err=3.12e-05 (2^-14.97), power_index=3.15
- pipelined [data_width=19 n_iter=18 angle_guard=3 frac_guard=1 rounding=round] area_um2=57701, accuracy_bits=15.2, ffs=1219, throughput_msps=123, max_abs_err=2.57e-05 (2^-15.25), power_index=3.26
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] area_um2=59014, accuracy_bits=15.6, ffs=1244, throughput_msps=119, max_abs_err=2.07e-05 (2^-15.56), power_index=3.32
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=61476, accuracy_bits=15.9, ffs=1315, throughput_msps=119, max_abs_err=1.59e-05 (2^-15.94), power_index=3.5
- pipelined [data_width=20 n_iter=18 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=63870, accuracy_bits=16.2, ffs=1365, throughput_msps=115, max_abs_err=1.31e-05 (2^-16.22), power_index=3.63
- pipelined [data_width=23 n_iter=18 angle_guard=3 frac_guard=2 rounding=trunc] area_um2=68181, accuracy_bits=16.8, ffs=1461, throughput_msps=108, max_abs_err=8.56e-06 (2^-16.83), power_index=3.88
- pipelined [data_width=23 n_iter=19 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=68764, accuracy_bits=17, ffs=1476, throughput_msps=108, max_abs_err=7.63e-06 (2^-17.00), power_index=3.92
- pipelined [data_width=23 n_iter=19 angle_guard=3 frac_guard=4 rounding=trunc] area_um2=75412, accuracy_bits=17.8, ffs=1609, throughput_msps=105, max_abs_err=4.49e-06 (2^-17.76), power_index=4.28
Front coverage: area_um2 47357..75412 (HV reference 100000); accuracy_bits 13.5..17.8 (HV reference 12); data_width on the front 19..23 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.30 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 14.53 bits
- pipelined: 90 evals, 64 feasible; max throughput seen 190 MSPS; best accuracy 23.75 bits; best feasible area_um2=47357; feasible ranges: data_width 16..28, n_iter 16..27, angle_guard -2..3, frac_guard 0..4
- pipelined_m: 85 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 17.86 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (50 evals): data_width=18..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (15 front designs; box front_anchored)
- `pipelined_m` (50 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 100 evaluations this round, 300 total; 104 feasible; hypervolume 2.689e+05 (+10.0%).

**LLM decision:** `map_front` — Round 3 of 4, 300/400 evals used, so this is the last exploration round and the reserved front-mapping budget should be spent now. Evidence: (1) the feasible front is 100% `pipelined` (104/140 feasible; iterative, unrolled_k and pipelined_m are 0/10, 0/15, 0/135 feasible), so the front lives in exactly one family and its full ranges can be mapped directly. (2) The front is not covering the objective ranges: area spans 41539..80076 against an HV reference of 100000 (a ~20k um^2 gap that can still add hypervolume), and accuracy spans 12..18.7 bits while the pipelined family has already demonstrated 23.75 bits, so the high-accuracy end of the trade-off is unmapped. (3) The min-area corner is fragile for the selection rule: the cheapest design (41539 um^2) sits at max_abs_err=0.000241 vs the 0.000244141 limit (only 0.02 bits of margin), and the spec warns that cheapest designs which only just pass the L1 sys_p99_batch_us bound (best seen 0.245 us vs 0.5 us) can be lost at L2 re-selection. A seeded NSGA-II sweep over the full pipelined ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, rounding trunc|round) both fills the area/accuracy gaps for hypervolume and densifies the cheap end of the front so L2 re-selection has robust alternatives to the marginal 41539 um^2 point. No next_plan needed for map_front.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 2.689e+05 (gain this round: +10.0%).
Feasible designs: 104 of 300 evaluations (88 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 23% violate; best seen 190
- max_abs_err <= 0.000244141: 37% violate; best seen 7.07e-08 (2^-23.75)
- sys_p99_batch_us <= 0.5: 59% violate; best seen 0.245

Pareto front (feasible, 24 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=19 n_iter=14 angle_guard=-2 frac_guard=1 rounding=round] area_um2=41539, accuracy_bits=12, ffs=879, throughput_msps=132, max_abs_err=0.000241 (2^-12.02), power_index=2.35
- pipelined [data_width=19 n_iter=14 angle_guard=4 frac_guard=1 rounding=round] area_um2=45365, accuracy_bits=12.9, ffs=962, throughput_msps=119, max_abs_err=0.000132 (2^-12.88), power_index=2.57
- pipelined [data_width=19 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=47357, accuracy_bits=13.5, ffs=1022, throughput_msps=132, max_abs_err=8.56e-05 (2^-13.51), power_index=2.71
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] area_um2=51971, accuracy_bits=14.5, ffs=1120, throughput_msps=123, max_abs_err=4.23e-05 (2^-14.53), power_index=2.97
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=0 rounding=trunc] area_um2=55090, accuracy_bits=15, ffs=1187, throughput_msps=123, max_abs_err=3.12e-05 (2^-14.97), power_index=3.15
- pipelined [data_width=19 n_iter=18 angle_guard=3 frac_guard=1 rounding=round] area_um2=57701, accuracy_bits=15.2, ffs=1219, throughput_msps=123, max_abs_err=2.57e-05 (2^-15.25), power_index=3.26
- pipelined [data_width=20 n_iter=18 angle_guard=3 frac_guard=1 rounding=round] area_um2=60234, accuracy_bits=15.9, ffs=1272, throughput_msps=119, max_abs_err=1.69e-05 (2^-15.85), power_index=3.4
- pipelined [data_width=21 n_iter=18 angle_guard=3 frac_guard=3 rounding=trunc] area_um2=64785, accuracy_bits=16.5, ffs=1386, throughput_msps=115, max_abs_err=1.08e-05 (2^-16.50), power_index=3.69
- pipelined [data_width=23 n_iter=19 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=68764, accuracy_bits=17, ffs=1476, throughput_msps=108, max_abs_err=7.63e-06 (2^-17.00), power_index=3.92
- pipelined [data_width=26 n_iter=21 angle_guard=-2 frac_guard=0 rounding=round] area_um2=80076, accuracy_bits=18.7, ffs=1714, throughput_msps=108, max_abs_err=2.38e-06 (2^-18.68), power_index=4.56
Front coverage: area_um2 41539..80076 (HV reference 100000); accuracy_bits 12..18.7 (HV reference 12); data_width on the front 19..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.30 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 14.53 bits
- pipelined: 140 evals, 104 feasible; max throughput seen 190 MSPS; best accuracy 23.75 bits; best feasible area_um2=41539; feasible ranges: data_width 16..28, n_iter 14..27, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 135 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 20.63 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (50 evals): data_width=18..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (24 front designs; box front_anchored)
- `pipelined_m` (50 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: pipelined_m was explored but found nothing feasible; full-box share (M3 lever)

**Result (code):** 100 evaluations this round, 400 total; 145 feasible; hypervolume 2.705e+05 (+0.6%).

**LLM decision:** `stop` — Final round (4/4) and full budget (400/400 evals) are exhausted, so only stop/infeasible apply. Infeasible is ruled out: 145 of 400 evaluations are feasible and the front has 28 designs, with every constraint demonstrably reachable — throughput best seen 190 MSPS (>=32), max_abs_err best 7.07e-08 (<=2^-12), sys_p99_batch_us best 0.245 (<=0.5). The selection rule (min area_um2) is satisfiable on the front by pipelined [data_width=19 n_iter=14 angle_guard=-2 frac_guard=1 rounding=round] at area_um2=41539, accuracy_bits=12.02 (max_abs_err=2.41e-04, just inside the 2^-12 bound), throughput 132 MSPS. The front spans area 41539..80076 um2 and accuracy 12..18.7 bits, i.e. it already covers the useful trade-off region against the HV reference (100000, 12), and this round's hypervolume gain was only +0.6%, indicating diminishing returns. All four families were explored; iterative, unrolled_k and pipelined_m produced zero feasible designs (their throughput ceilings of 11, 8.4 and 91 MSPS respectively cannot service the 32-request burst within 0.5 us), so no unexplored family remains to add. Stopping is therefore the correct terminal action.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.705e+05 (gain this round: +0.6%).
Feasible designs: 145 of 400 evaluations (126 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 26% violate; best seen 190
- max_abs_err <= 0.000244141: 37% violate; best seen 7.07e-08 (2^-23.75)
- sys_p99_batch_us <= 0.5: 57% violate; best seen 0.245

Pareto front (feasible, 28 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=19 n_iter=14 angle_guard=-2 frac_guard=1 rounding=round] area_um2=41539, accuracy_bits=12, ffs=879, throughput_msps=132, max_abs_err=0.000241 (2^-12.02), power_index=2.35
- pipelined [data_width=19 n_iter=14 angle_guard=4 frac_guard=1 rounding=round] area_um2=45365, accuracy_bits=12.9, ffs=962, throughput_msps=119, max_abs_err=0.000132 (2^-12.88), power_index=2.57
- pipelined [data_width=19 n_iter=15 angle_guard=4 frac_guard=1 rounding=round] area_um2=48656, accuracy_bits=13.7, ffs=1030, throughput_msps=119, max_abs_err=7.38e-05 (2^-13.73), power_index=2.75
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] area_um2=51971, accuracy_bits=14.5, ffs=1120, throughput_msps=123, max_abs_err=4.23e-05 (2^-14.53), power_index=2.97
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] area_um2=56874, accuracy_bits=15, ffs=1201, throughput_msps=128, max_abs_err=3.09e-05 (2^-14.98), power_index=3.21
- pipelined [data_width=20 n_iter=17 angle_guard=2 frac_guard=3 rounding=round] area_um2=59014, accuracy_bits=15.6, ffs=1244, throughput_msps=119, max_abs_err=2.07e-05 (2^-15.56), power_index=3.32
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] area_um2=61476, accuracy_bits=15.9, ffs=1315, throughput_msps=119, max_abs_err=1.59e-05 (2^-15.94), power_index=3.5
- pipelined [data_width=22 n_iter=18 angle_guard=0 frac_guard=2 rounding=round] area_um2=64386, accuracy_bits=16.3, ffs=1357, throughput_msps=115, max_abs_err=1.25e-05 (2^-16.28), power_index=3.63
- pipelined [data_width=23 n_iter=19 angle_guard=3 frac_guard=0 rounding=trunc] area_um2=68764, accuracy_bits=17, ffs=1476, throughput_msps=108, max_abs_err=7.63e-06 (2^-17.00), power_index=3.92
- pipelined [data_width=26 n_iter=21 angle_guard=-2 frac_guard=0 rounding=round] area_um2=80076, accuracy_bits=18.7, ffs=1714, throughput_msps=108, max_abs_err=2.38e-06 (2^-18.68), power_index=4.56
Front coverage: area_um2 41539..80076 (HV reference 100000); accuracy_bits 12..18.7 (HV reference 12); data_width on the front 18..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 11 MSPS; best accuracy 14.30 bits
- unrolled_k: 15 evals, 0 feasible; max throughput seen 8.39 MSPS; best accuracy 14.53 bits
- pipelined: 190 evals, 145 feasible; max throughput seen 190 MSPS; best accuracy 23.75 bits; best feasible area_um2=41539; feasible ranges: data_width 16..28, n_iter 13..27, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 185 evals, 0 feasible; max throughput seen 91.1 MSPS; best accuracy 21.85 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16976 in, 9912 out
- provider-reported cost: $0.0080
- full prompts and replies: `llm_trace.jsonl`

