# DSE run: multiaxis_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec multiaxis_control: Shared sin/cos unit for a 16-axis motor-control loop: a 1 MHz control tick issues 32 requests at once (Park + inverse Park per axis); all 32 results must be back within 0.44 us of the tick (p99 over ticks). Max error <= 2^-12. Minimise LUTs + FFs.
  constraint: throughput_msps >= 32
  constraint: max_abs_err <= 0.000244141
  constraint: sys_p99_batch_us <= 0.44
  objective: min luts_plus_ffs (HV ref 4000)
  objective: max accuracy_bits (HV ref 12)
  select: min luts_plus_ffs
  system (simulated at L2 for the shortlist; screened at L1 by an analytic bound): control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average)
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 920 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 285 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 93.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 64.1 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 1.45 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000175 (2^-12.48) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 5.74 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 3.67e-05 (2^-14.74) | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.2 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 12.5 | exact: bit-accurate model, dense (91168 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 6 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 95.6 dBc, SNR 86.0 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Shortlist: the front's top 5 by the selection rule, simulated at their estimated Fmax (SimPy). L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.44 (bound → simulated) | passes |
|---|---|---|
| `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=4` | 0.3848 → 0.3953 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=round,m=3` | 0.3103 → 0.3186 | yes |
| `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=3,rounding=round,m=3` | 0.3103 → 0.3186 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (29 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=17,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 920 | 285 | 93.6 | 6 | 1.45 | 0.000175 (2^-12.48) | 12.48 |
| 1 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1001 | 293 | 93.6 | 6 | 1.56 | 0.000104 (2^-13.23) | 13.23 |
| 2 | `pipelined_m:data_width=18,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,m=4` | 1039 | 295 | 93.6 | 6 | 1.61 | 8.41e-05 (2^-13.54) | 13.54 |
| 3 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=round,m=3` | 1048 | 384 | 119.3 | 7 | 1.72 | 7.76e-05 (2^-13.65) | 13.65 |
| 4 | `pipelined_m:data_width=19,n_iter=15,angle_guard=1,frac_guard=3,rounding=round,m=3` | 1078 | 392 | 119.3 | 7 | 1.77 | 7.5e-05 (2^-13.70) | 13.70 |
| 5 | `pipelined_m:data_width=20,n_iter=15,angle_guard=2,frac_guard=3,rounding=round,m=4` | 1139 | 339 | 89.6 | 6 | 1.78 | 6.44e-05 (2^-13.92) | 13.92 |
| 6 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1143 | 335 | 93.6 | 6 | 1.78 | 3.85e-05 (2^-14.67) | 14.67 |
| 7 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1175 | 341 | 89.6 | 6 | 1.82 | 3.61e-05 (2^-14.76) | 14.76 |
| 8 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc,m=4` | 1207 | 347 | 89.6 | 6 | 1.87 | 3.48e-05 (2^-14.81) | 14.81 |
| 9 | `pipelined_m:data_width=21,n_iter=16,angle_guard=1,frac_guard=2,rounding=round,m=4` | 1219 | 343 | 89.6 | 6 | 1.88 | 3.44e-05 (2^-14.83) | 14.83 |
| 10 | `pipelined_m:data_width=22,n_iter=17,angle_guard=-2,frac_guard=0,rounding=round,m=4` | 1185 | 403 | 93.6 | 7 | 1.91 | 3.36e-05 (2^-14.86) | 14.86 |
| 11 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1223 | 388 | 93.6 | 7 | 1.94 | 2.42e-05 (2^-15.34) | 15.34 |
| 12 | `pipelined_m:data_width=21,n_iter=18,angle_guard=2,frac_guard=0,rounding=round,m=4` | 1277 | 406 | 89.6 | 7 | 2.03 | 1.59e-05 (2^-15.94) | 15.94 |
| 13 | `pipelined_m:data_width=20,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1337 | 407 | 93.6 | 7 | 2.1 | 1.51e-05 (2^-16.01) | 16.01 |
| 14 | `pipelined_m:data_width=21,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1393 | 424 | 89.6 | 7 | 2.19 | 1.11e-05 (2^-16.46) | 16.46 |
| 15 | `pipelined_m:data_width=22,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1385 | 434 | 89.6 | 7 | 2.19 | 1.1e-05 (2^-16.48) | 16.48 |
| 16 | `pipelined_m:data_width=23,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc,m=4` | 1403 | 443 | 89.6 | 7 | 2.22 | 9.89e-06 (2^-16.63) | 16.63 |
| 17 | `pipelined_m:data_width=22,n_iter=18,angle_guard=2,frac_guard=2,rounding=round,m=4` | 1449 | 441 | 89.6 | 7 | 2.27 | 9.56e-06 (2^-16.67) | 16.67 |
| 18 | `pipelined_m:data_width=22,n_iter=19,angle_guard=1,frac_guard=2,rounding=trunc,m=4` | 1466 | 434 | 89.6 | 7 | 2.29 | 7.45e-06 (2^-17.04) | 17.04 |
| 19 | `pipelined_m:data_width=22,n_iter=19,angle_guard=1,frac_guard=3,rounding=round,m=4` | 1550 | 444 | 89.6 | 7 | 2.4 | 6.39e-06 (2^-17.25) | 17.25 |
| 20 | `pipelined_m:data_width=23,n_iter=19,angle_guard=2,frac_guard=3,rounding=trunc,m=4` | 1580 | 464 | 89.6 | 7 | 2.46 | 4.84e-06 (2^-17.66) | 17.66 |
| 21 | `pipelined_m:data_width=23,n_iter=21,angle_guard=1,frac_guard=3,rounding=trunc,m=4` | 1733 | 543 | 89.6 | 8 | 2.74 | 2.69e-06 (2^-18.51) | 18.51 |
| 22 | `pipelined_m:data_width=26,n_iter=21,angle_guard=0,frac_guard=0,rounding=round,m=4` | 1776 | 567 | 89.6 | 8 | 2.82 | 1.36e-06 (2^-19.48) | 19.48 |
| 23 | `pipelined_m:data_width=26,n_iter=22,angle_guard=4,frac_guard=0,rounding=trunc,m=3` | 1953 | 771 | 110.0 | 10 | 3.28 | 1e-06 (2^-19.93) | 19.93 |
| 24 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=3,rounding=round,m=3` | 2050 | 747 | 110.0 | 10 | 3.37 | 7.74e-07 (2^-20.30) | 20.30 |
| 25 | `pipelined_m:data_width=28,n_iter=24,angle_guard=0,frac_guard=0,rounding=trunc,m=3` | 2187 | 791 | 110.0 | 10 | 3.58 | 3.04e-07 (2^-21.65) | 21.65 |
| 26 | `pipelined_m:data_width=26,n_iter=25,angle_guard=1,frac_guard=4,rounding=trunc,m=3` | 2357 | 898 | 110.0 | 11 | 3.92 | 2.98e-07 (2^-21.68) | 21.68 |
| 27 | `pipelined_m:data_width=28,n_iter=24,angle_guard=3,frac_guard=3,rounding=trunc,m=3` | 2405 | 858 | 105.9 | 10 | 3.93 | 1.45e-07 (2^-22.72) | 22.72 |
| 28 | `pipelined_m:data_width=28,n_iter=26,angle_guard=1,frac_guard=1,rounding=trunc,m=2` | 2455 | 1287 | 152.6 | 15 | 4.5 | 1.35e-07 (2^-22.82) | 22.82 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraint is the system batch bound: a 1 MHz tick issues 32 requests at once and all 32 results must return within 0.44 us (sys_p99_batch_us <= 0.44). That requires ~1 result/cycle at a high enough Fmax, so only the pipelined and pipelined_m families can plausibly qualify; iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) cannot deliver 32 results in 0.44 us at achievable clock rates. The plain throughput constraint (>=32 MSps) and the accuracy constraint (max_abs_err <= 2^-12) are much looser and are handled by the shared accuracy parameters (data_width, n_iter, angle_guard, frac_guard, rounding), which are identical across families. The real trade-off is area (luts_plus_ffs, the selection objective) versus Fmax/batch margin: pipelined maximises Fmax but pays N register stages, while pipelined_m cuts FFs by registering every m stages at the cost of a longer combinational path. Round 1 therefore concentrates budget on pipelined_m (most likely to hold the min-area feasible design) and pipelined (Fmax ceiling / accuracy corner), with a small probe of unrolled_k to confirm infeasibility. Ranges are centred on the accuracy-feasible region (W ~ 12-20, N ~ 10-20) rather than the full 8..28 / 4..30, since very small W/N cannot reach 12 bits and very large W/N only add area; later rounds can widen ranges once the feasible front is located.*)
- `pipelined` (35 evals): data_width=12..20, n_iter=10..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only 1-result/cycle families can plausibly satisfy the batch constraint (32 simultaneous requests back within 0.44 us). Pipelined gives the highest Fmax (one micro-rotation per registered stage) and therefore the most batch-latency margin, at the cost of N register stages (highest FF count). It anchors the high-Fmax / high-area corner of the front and the accuracy corner (N and W drive max_abs_err <= 2^-12).
- `pipelined_m` (50 evals): data_width=12..20, n_iter=10..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..6. *Why:* Same 1-result/cycle throughput as pipelined but registers only every m stages, cutting FF count by roughly a factor m. This is exactly the area-vs-Fmax trade-off the objective (min luts_plus_ffs) and the batch constraint (sys_p99_batch_us <= 0.44) pull against each other: larger m shrinks area but lengthens the combinational path and lowers Fmax. m is capped at 6 because beyond that the batch bound is likely to fail; m=2..6 should bracket the feasible region. Largest share because this family most likely contains the min-area winner.
- `unrolled_k` (15 evals): data_width=12..20, n_iter=10..20, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Produces one result every ceil(N/k)+3 cycles, so 32 requests need 32*(ceil(N/k)+3) cycles; even at k=8 this is far more cycles than 0.44 us allows at any realistic Artix-7 Fmax, so it is expected to be infeasible for the batch constraint. Small share kept only to confirm this empirically and to check whether a high-k variant could ever contribute to the front; if it produces no feasible points the budget shifts to the pipelined families in later rounds.

**Result (code):** 100 evaluations this round, 100 total; 21 feasible; hypervolume 7180 (n/a).

**LLM decision:** `map_front` — The feasible front is only 3 designs, all pipelined_m, all at data_width=19, spanning luts_plus_ffs 1489..1905 against an HV reference of 4000 and accuracy_bits 13.3..15.2 against a reference of 12. That is a very thin slice of both objective ranges (data_width on the front is a single value, 19, out of the registry's 8..28), so hypervolume is being left on the table at the cheap-area end and the front is not yet mapped. The evidence says the true front is wider: pipelined is feasible at data_width 16..18 (16 feasible evals, best luts_plus_ffs=1717) while pipelined_m is feasible at 19 (best 1489), i.e. the two families trade off across data_width and register density, and the current 3-point front is just the pipelined_m corner. iterative is not worth a family slot: it yields 1 result per N+3 cycles, and reaching the 2^-12 error bound needs roughly N>=14, giving well under 32 MSPS (unrolled_k, the faster of the two serial families, already capped at 10.3 MSPS and 0 feasible), so it cannot meet the throughput_msps>=32 constraint. Therefore spend this round mapping the front over the full ranges of the families that are actually feasible (pipelined and pipelined_m), seeded with the current front, rather than refining a 3-point corner or adding a family that the throughput constraint rules out.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7180 (gain this round: n/a (first round)).
Feasible designs: 21 of 100 evaluations (15 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 15% violate; best seen 282
- max_abs_err <= 0.000244141: 50% violate; best seen 2.28e-05 (2^-15.42)
- sys_p99_batch_us <= 0.44: 50% violate; best seen 0.149

Pareto front (feasible, 3 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=19 n_iter=16 angle_guard=-1 frac_guard=1 rounding=round m=3] luts_plus_ffs=1489, accuracy_bits=13.3, luts=1057, ffs=432, throughput_msps=119, max_abs_err=0.000101 (2^-13.28), power_index=1.79
- pipelined_m [data_width=19 n_iter=20 angle_guard=2 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=1863, accuracy_bits=14.3, luts=1347, ffs=517, throughput_msps=119, max_abs_err=4.83e-05 (2^-14.34), power_index=2.24
- pipelined_m [data_width=19 n_iter=20 angle_guard=2 frac_guard=1 rounding=round m=3] luts_plus_ffs=1905, accuracy_bits=15.2, luts=1387, ffs=519, throughput_msps=119, max_abs_err=2.75e-05 (2^-15.15), power_index=2.29
Front coverage: luts_plus_ffs 1489..1905 (HV reference 4000); accuracy_bits 13.3..15.2 (HV reference 12); data_width on the front 19..19 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.93 bits
- pipelined: 35 evals, 16 feasible; max throughput seen 282 MSPS; best accuracy 14.14 bits; best feasible luts_plus_ffs=1717; feasible ranges: data_width 16..18, n_iter 14..20, angle_guard -1..3, frac_guard 0..2
- pipelined_m: 50 evals, 5 feasible; max throughput seen 178 MSPS; best accuracy 15.42 bits; best feasible luts_plus_ffs=1489; feasible ranges: data_width 19..19, n_iter 16..20, angle_guard -1..2, frac_guard 1..1, m 2..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=18..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (3 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 100 feasible; hypervolume 1.898e+04 (+164.3%).

**LLM decision:** `refine` — The feasible front is entirely `pipelined_m` (16 designs), spanning luts_plus_ffs 1395..3262 against HV ref 4000 and accuracy_bits 12.9..22.7 against ref 12 — good coverage, but the selection rule is min luts_plus_ffs, so the decisive region is the low-area corner, which is currently a single point at 1395 (data_width=22, n_iter=14, angle_guard=-2, frac_guard=3, trunc, m=4) sitting only 0.9 bits above the 2^-12 error limit. There is clear room to push that corner lower and to fill the 1395→1486 gap. `pipelined` is also feasible (best luts_plus_ffs=1717, throughput up to 282 MSPS) but contributes nothing to the front yet, so its low-area corner is worth probing. `unrolled_k` is 0/15 feasible (max 10.3 MSPS) and `iterative` is strictly slower (1 result per N+3 cycles vs k per cycle), so it cannot reach throughput>=32 nor the 0.44us/32-request burst bound — adding it would waste budget. Accuracy headroom exists (best seen 24.15 bits vs front max 22.7), so keep a few higher-n_iter/higher-width points to extend the upper end. Reserve the final round for map_front over the full pipelined_m/pipelined ranges.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.898e+04 (gain this round: +164.3%).
Feasible designs: 100 of 200 evaluations (87 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 8% violate; best seen 282
- max_abs_err <= 0.000244141: 25% violate; best seen 5.36e-08 (2^-24.15)
- sys_p99_batch_us <= 0.44: 36% violate; best seen 0.149

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=22 n_iter=14 angle_guard=-2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=1395, accuracy_bits=12.9, luts=1046, ffs=349, throughput_msps=89.6, max_abs_err=0.000132 (2^-12.89), power_index=1.68
- pipelined_m [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=round m=3] luts_plus_ffs=1486, accuracy_bits=13.1, luts=1080, ffs=406, throughput_msps=124, max_abs_err=0.000114 (2^-13.10), power_index=1.79
- pipelined_m [data_width=19 n_iter=16 angle_guard=-1 frac_guard=1 rounding=round m=3] luts_plus_ffs=1489, accuracy_bits=13.3, luts=1057, ffs=432, throughput_msps=119, max_abs_err=0.000101 (2^-13.28), power_index=1.79
- pipelined_m [data_width=18 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc m=3] luts_plus_ffs=1671, accuracy_bits=14.5, luts=1223, ffs=448, throughput_msps=119, max_abs_err=4.39e-05 (2^-14.48), power_index=2.01
- pipelined_m [data_width=22 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1818, accuracy_bits=16.5, luts=1385, ffs=434, throughput_msps=89.6, max_abs_err=1.1e-05 (2^-16.48), power_index=2.19
- pipelined_m [data_width=22 n_iter=19 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1900, accuracy_bits=17, luts=1466, ffs=434, throughput_msps=89.6, max_abs_err=7.45e-06 (2^-17.04), power_index=2.29
- pipelined_m [data_width=26 n_iter=19 angle_guard=3 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=2290, accuracy_bits=18, luts=1769, ffs=521, throughput_msps=86, max_abs_err=3.88e-06 (2^-17.98), power_index=2.76
- pipelined_m [data_width=24 n_iter=23 angle_guard=1 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=2773, accuracy_bits=19.7, luts=2022, ffs=751, throughput_msps=110, max_abs_err=1.21e-06 (2^-19.66), power_index=3.34
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=3 rounding=round m=3] luts_plus_ffs=2796, accuracy_bits=20.3, luts=2050, ffs=747, throughput_msps=110, max_abs_err=7.74e-07 (2^-20.30), power_index=3.37
- pipelined_m [data_width=28 n_iter=24 angle_guard=3 frac_guard=3 rounding=trunc m=3] luts_plus_ffs=3262, accuracy_bits=22.7, luts=2405, ffs=858, throughput_msps=106, max_abs_err=1.45e-07 (2^-22.72), power_index=3.93
Front coverage: luts_plus_ffs 1395..3262 (HV reference 4000); accuracy_bits 12.9..22.7 (HV reference 12); data_width on the front 18..28 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.93 bits
- pipelined: 35 evals, 16 feasible; max throughput seen 282 MSPS; best accuracy 14.14 bits; best feasible luts_plus_ffs=1717; feasible ranges: data_width 16..18, n_iter 14..20, angle_guard -1..3, frac_guard 0..2
- pipelined_m: 150 evals, 84 feasible; max throughput seen 178 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=1395; feasible ranges: data_width 18..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *narrow to the low-area half of the explored ranges (front data_width 18..28, n_iter 14..29) where the selection rule lands, while keeping enough spread to extend accuracy toward the 24-bit best seen*)
- `pipelined_m` (70 evals): data_width=16..24, n_iter=12..22, angle_guard=-2..2, frac_guard=0..3, rounding=trunc|round, m=3..5. *Why:* dominant family; concentrate on the low-area corner (selection rule) and the 1395-1700 gap, with a few higher-n_iter points for the upper front
- `pipelined` (30 evals): data_width=14..20, n_iter=12..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* feasible (best 1717) and highest throughput seen (282 MSPS); its low-area corner may beat pipelined_m on luts_plus_ffs

**Result (code):** 100 evaluations this round, 300 total; 171 feasible; hypervolume 1.988e+04 (+4.8%).

**LLM decision:** `map_front` — The feasible front is essentially all pipelined_m (136/220 feasible vs pipelined 35/65, unrolled_k 0/15), and it is well covered in accuracy (12.5..22.7 bits, HV ref 12) but not in area: cheapest feasible luts_plus_ffs=1204 against an HV reference of 4000, and that cheapest design sits right on the accuracy constraint (12.5 bits vs the 2^-12 = 12-bit requirement, max_abs_err 1.75e-4 vs 2.44e-4). That leaves an unexplored region of cheaper-but-just-accurate-enough designs that would both extend the front leftward (raising hypervolume) and matter for the min-luts_plus_ffs selection rule. Adding the untried iterative family is pointless: it is strictly slower than unrolled_k (N+3 cycles/result), which already produced 0 feasible designs and only 10.3 MSPS against the 32 MSPS / 0.44 us batch constraints. With 100 evals and one round left, the reserved budget is best spent letting code map the whole front over the full ranges of pipelined and pipelined_m, seeded with the current front, to fill the low-area end and confirm the trade-off curve.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 1.988e+04 (gain this round: +4.8%).
Feasible designs: 171 of 300 evaluations (148 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 5% violate; best seen 282
- max_abs_err <= 0.000244141: 23% violate; best seen 5.36e-08 (2^-24.15)
- sys_p99_batch_us <= 0.44: 28% violate; best seen 0.149

Pareto front (feasible, 27 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1204, accuracy_bits=12.5, luts=920, ffs=285, throughput_msps=93.6, max_abs_err=0.000175 (2^-12.48), power_index=1.45
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=3] luts_plus_ffs=1433, accuracy_bits=13.7, luts=1048, ffs=384, throughput_msps=119, max_abs_err=7.76e-05 (2^-13.65), power_index=1.72
- pipelined_m [data_width=21 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1478, accuracy_bits=14.7, luts=1143, ffs=335, throughput_msps=93.6, max_abs_err=3.85e-05 (2^-14.67), power_index=1.78
- pipelined_m [data_width=21 n_iter=16 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1562, accuracy_bits=14.8, luts=1219, ffs=343, throughput_msps=89.6, max_abs_err=3.44e-05 (2^-14.83), power_index=1.88
- pipelined_m [data_width=21 n_iter=18 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1683, accuracy_bits=15.9, luts=1277, ffs=406, throughput_msps=89.6, max_abs_err=1.59e-05 (2^-15.94), power_index=2.03
- pipelined_m [data_width=21 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1817, accuracy_bits=16.5, luts=1393, ffs=424, throughput_msps=89.6, max_abs_err=1.11e-05 (2^-16.46), power_index=2.19
- pipelined_m [data_width=22 n_iter=18 angle_guard=2 frac_guard=2 rounding=round m=4] luts_plus_ffs=1890, accuracy_bits=16.7, luts=1449, ffs=441, throughput_msps=89.6, max_abs_err=9.56e-06 (2^-16.67), power_index=2.27
- pipelined_m [data_width=23 n_iter=19 angle_guard=2 frac_guard=3 rounding=trunc m=4] luts_plus_ffs=2044, accuracy_bits=17.7, luts=1580, ffs=464, throughput_msps=89.6, max_abs_err=4.84e-06 (2^-17.66), power_index=2.46
- pipelined_m [data_width=24 n_iter=23 angle_guard=1 frac_guard=4 rounding=trunc m=3] luts_plus_ffs=2773, accuracy_bits=19.7, luts=2022, ffs=751, throughput_msps=110, max_abs_err=1.21e-06 (2^-19.66), power_index=3.34
- pipelined_m [data_width=28 n_iter=24 angle_guard=3 frac_guard=3 rounding=trunc m=3] luts_plus_ffs=3262, accuracy_bits=22.7, luts=2405, ffs=858, throughput_msps=106, max_abs_err=1.45e-07 (2^-22.72), power_index=3.93
Front coverage: luts_plus_ffs 1204..3262 (HV reference 4000); accuracy_bits 12.5..22.7 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.93 bits
- pipelined: 65 evals, 35 feasible; max throughput seen 282 MSPS; best accuracy 14.77 bits; best feasible luts_plus_ffs=1717; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 220 evals, 136 feasible; max throughput seen 178 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=1204; feasible ranges: data_width 17..28, n_iter 14..29, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (27 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 226 feasible; hypervolume 1.994e+04 (+0.3%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the front is genuinely feasible rather than empty: 226 of 400 evaluations satisfy all three constraints, with margin on each (throughput best 282 MSPS vs >=32; max_abs_err best 2^-24.15 vs <=2^-12; sys_p99_batch best 0.149 us vs <=0.44 us). The feasible Pareto front spans luts_plus_ffs 1204..3743 against an HV reference of 4000 and accuracy_bits 12.5..22.8 against an HV reference of 12, i.e. it covers essentially the whole objective box, and the last round added only +0.3% hypervolume, so further search is not buying coverage. The selection rule (min luts_plus_ffs) is already served by the front's cheapest point, pipelined_m [W=17, N=15, angle_guard=1, frac_guard=2, trunc, m=4] at luts_plus_ffs=1204 with accuracy_bits=12.5 (max_abs_err 2^-12.48, still inside the 2^-12 error limit) and throughput 93.6 MSPS. The only unexplored family, iterative, is structurally unable to compete here: it yields one result per N+3 cycles, and the explored unrolled_k family (also multi-cycle) produced 0 feasible designs out of 15 with max throughput 10.3 MSPS, far below the 32 MSPS constraint. Note for the L2 stage: the cheapest front points pass the sys_p99_batch L1 bound with margin (0.149 us vs 0.44 us), so they are not borderline candidates likely to be lost to burst queueing. No constraint is unreachable, so infeasible is not warranted; stopping is correct.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.994e+04 (gain this round: +0.3%).
Feasible designs: 226 of 400 evaluations (198 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 4% violate; best seen 282
- max_abs_err <= 0.000244141: 20% violate; best seen 5.36e-08 (2^-24.15)
- sys_p99_batch_us <= 0.44: 29% violate; best seen 0.149

Pareto front (feasible, 29 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- pipelined_m [data_width=17 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=1204, accuracy_bits=12.5, luts=920, ffs=285, throughput_msps=93.6, max_abs_err=0.000175 (2^-12.48), power_index=1.45
- pipelined_m [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=round m=3] luts_plus_ffs=1433, accuracy_bits=13.7, luts=1048, ffs=384, throughput_msps=119, max_abs_err=7.76e-05 (2^-13.65), power_index=1.72
- pipelined_m [data_width=21 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1478, accuracy_bits=14.7, luts=1143, ffs=335, throughput_msps=93.6, max_abs_err=3.85e-05 (2^-14.67), power_index=1.78
- pipelined_m [data_width=21 n_iter=16 angle_guard=1 frac_guard=2 rounding=round m=4] luts_plus_ffs=1562, accuracy_bits=14.8, luts=1219, ffs=343, throughput_msps=89.6, max_abs_err=3.44e-05 (2^-14.83), power_index=1.88
- pipelined_m [data_width=21 n_iter=18 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=1683, accuracy_bits=15.9, luts=1277, ffs=406, throughput_msps=89.6, max_abs_err=1.59e-05 (2^-15.94), power_index=2.03
- pipelined_m [data_width=23 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=1845, accuracy_bits=16.6, luts=1403, ffs=443, throughput_msps=89.6, max_abs_err=9.89e-06 (2^-16.63), power_index=2.22
- pipelined_m [data_width=22 n_iter=19 angle_guard=1 frac_guard=3 rounding=round m=4] luts_plus_ffs=1994, accuracy_bits=17.3, luts=1550, ffs=444, throughput_msps=89.6, max_abs_err=6.39e-06 (2^-17.25), power_index=2.4
- pipelined_m [data_width=26 n_iter=21 angle_guard=0 frac_guard=0 rounding=round m=4] luts_plus_ffs=2343, accuracy_bits=19.5, luts=1776, ffs=567, throughput_msps=89.6, max_abs_err=1.36e-06 (2^-19.48), power_index=2.82
- pipelined_m [data_width=28 n_iter=24 angle_guard=0 frac_guard=0 rounding=trunc m=3] luts_plus_ffs=2978, accuracy_bits=21.6, luts=2187, ffs=791, throughput_msps=110, max_abs_err=3.04e-07 (2^-21.65), power_index=3.58
- pipelined_m [data_width=28 n_iter=26 angle_guard=1 frac_guard=1 rounding=trunc m=2] luts_plus_ffs=3743, accuracy_bits=22.8, luts=2455, ffs=1287, throughput_msps=153, max_abs_err=1.35e-07 (2^-22.82), power_index=4.5
Front coverage: luts_plus_ffs 1204..3743 (HV reference 4000); accuracy_bits 12.5..22.8 (HV reference 12); data_width on the front 17..28 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 13.93 bits
- pipelined: 65 evals, 35 feasible; max throughput seen 282 MSPS; best accuracy 14.77 bits; best feasible luts_plus_ffs=1717; feasible ranges: data_width 16..20, n_iter 14..20, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 320 evals, 191 feasible; max throughput seen 178 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=1204; feasible ranges: data_width 17..28, n_iter 13..29, angle_guard -2..4, frac_guard 0..4, m 2..4
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 16157 in, 14867 out
- provider-reported cost: $0.0166
- full prompts and replies: `llm_trace.jsonl`

