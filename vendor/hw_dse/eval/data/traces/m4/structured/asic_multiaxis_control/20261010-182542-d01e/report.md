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
`pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=4,rounding=round` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 42399 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 11296 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 895 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 132 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 16 | exact: schedule |
| latency_ns | 121 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 2.39 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.00017 (2^-12.52) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 2.78 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 5.35e-05 (2^-14.19) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 0.877 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 12.5 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 16 cycles, a new input every 1 cycle(s). DDS tone from its exact outputs: SFDR 98.2 dBc, SNR 82.4 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

System: control loop: a tick every 1 us issues 32 requests at once (32 requests/us on average). Every L1-feasible design (177) was simulated at its estimated Fmax (SimPy); 166 pass. Top 5 by the selection rule, L1 bound → L2 simulated:

| design | sys_p99_batch_us <= 0.5 (bound → simulated) | passes |
|---|---|---|
| `pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=4,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 0.3738 → 0.3818 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=3,rounding=round` | 0.3475 → 0.355 | yes |
| `pipelined:data_width=19,n_iter=14,angle_guard=-1,frac_guard=3,rounding=trunc` | 0.3738 → 0.3818 | yes |
| `pipelined:data_width=17,n_iter=14,angle_guard=3,frac_guard=4,rounding=round` | 0.3607 → 0.3684 | yes |

winner unchanged: the L1 selection passes the simulated system constraints.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (28 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=16,n_iter=14,angle_guard=3,frac_guard=4,rounding=round` | 42399 | 895 | 132.4 | 16 | 2.39 | 0.00017 (2^-12.52) | 12.52 |
| 1 | `pipelined:data_width=19,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 42524 | 922 | 123.1 | 16 | 2.44 | 0.00014 (2^-12.80) | 12.80 |
| 2 | `pipelined:data_width=21,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 46351 | 1005 | 115.0 | 16 | 2.66 | 0.000126 (2^-12.95) | 12.95 |
| 3 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 47554 | 1024 | 127.5 | 17 | 2.72 | 7.77e-05 (2^-13.65) | 13.65 |
| 4 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=round` | 47884 | 1012 | 127.5 | 17 | 2.7 | 7.76e-05 (2^-13.65) | 13.65 |
| 5 | `pipelined:data_width=18,n_iter=15,angle_guard=3,frac_guard=3,rounding=round` | 48430 | 1022 | 127.5 | 17 | 2.73 | 7.32e-05 (2^-13.74) | 13.74 |
| 6 | `pipelined:data_width=19,n_iter=15,angle_guard=4,frac_guard=2,rounding=round` | 49939 | 1056 | 118.9 | 17 | 2.82 | 6.84e-05 (2^-13.84) | 13.84 |
| 7 | `pipelined:data_width=21,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 50814 | 1075 | 123.1 | 17 | 2.87 | 6.53e-05 (2^-13.90) | 13.90 |
| 8 | `pipelined:data_width=18,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 51287 | 1084 | 132.4 | 19 | 2.9 | 5.64e-05 (2^-14.11) | 14.11 |
| 9 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=1,rounding=round` | 52730 | 1115 | 123.1 | 18 | 2.98 | 3.91e-05 (2^-14.64) | 14.64 |
| 10 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 53678 | 1135 | 127.5 | 19 | 3.03 | 3.42e-05 (2^-14.83) | 14.83 |
| 11 | `pipelined:data_width=21,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 54310 | 1170 | 127.5 | 19 | 3.1 | 2.7e-05 (2^-15.18) | 15.18 |
| 12 | `pipelined:data_width=21,n_iter=17,angle_guard=2,frac_guard=1,rounding=trunc` | 57343 | 1233 | 118.9 | 19 | 3.27 | 2.27e-05 (2^-15.43) | 15.43 |
| 13 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 57680 | 1218 | 123.1 | 19 | 3.25 | 2.15e-05 (2^-15.51) | 15.51 |
| 14 | `pipelined:data_width=21,n_iter=17,angle_guard=1,frac_guard=3,rounding=round` | 60625 | 1277 | 115.0 | 19 | 3.41 | 2.07e-05 (2^-15.56) | 15.56 |
| 15 | `pipelined:data_width=22,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 60850 | 1285 | 115.0 | 19 | 3.43 | 1.67e-05 (2^-15.87) | 15.87 |
| 16 | `pipelined:data_width=22,n_iter=18,angle_guard=1,frac_guard=1,rounding=trunc` | 62478 | 1341 | 118.9 | 20 | 3.56 | 1.21e-05 (2^-16.34) | 16.34 |
| 17 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=1,rounding=trunc` | 66053 | 1416 | 118.9 | 21 | 3.76 | 8.63e-06 (2^-16.82) | 16.82 |
| 18 | `pipelined:data_width=21,n_iter=19,angle_guard=2,frac_guard=2,rounding=round` | 67082 | 1414 | 118.9 | 21 | 3.78 | 7.33e-06 (2^-17.06) | 17.06 |
| 19 | `pipelined:data_width=23,n_iter=20,angle_guard=0,frac_guard=0,rounding=trunc` | 69715 | 1494 | 118.9 | 22 | 3.97 | 7.02e-06 (2^-17.12) | 17.12 |
| 20 | `pipelined:data_width=21,n_iter=19,angle_guard=4,frac_guard=4,rounding=round` | 72156 | 1518 | 111.3 | 21 | 4.06 | 5.39e-06 (2^-17.50) | 17.50 |
| 21 | `pipelined:data_width=23,n_iter=20,angle_guard=4,frac_guard=0,rounding=round` | 73403 | 1573 | 104.7 | 22 | 4.18 | 3.56e-06 (2^-18.10) | 18.10 |
| 22 | `pipelined:data_width=24,n_iter=20,angle_guard=0,frac_guard=3,rounding=trunc` | 77752 | 1660 | 104.7 | 22 | 4.42 | 3.39e-06 (2^-18.17) | 18.17 |
| 23 | `pipelined:data_width=22,n_iter=20,angle_guard=3,frac_guard=4,rounding=round` | 77910 | 1638 | 107.9 | 22 | 4.38 | 2.9e-06 (2^-18.40) | 18.40 |
| 24 | `pipelined:data_width=24,n_iter=20,angle_guard=1,frac_guard=2,rounding=round` | 78187 | 1646 | 107.9 | 22 | 4.4 | 2.62e-06 (2^-18.54) | 18.54 |
| 25 | `pipelined:data_width=25,n_iter=20,angle_guard=0,frac_guard=2,rounding=trunc` | 78761 | 1683 | 104.7 | 22 | 4.48 | 2.57e-06 (2^-18.57) | 18.57 |
| 26 | `pipelined:data_width=24,n_iter=20,angle_guard=3,frac_guard=3,rounding=trunc` | 80518 | 1719 | 104.7 | 22 | 4.57 | 2.33e-06 (2^-18.71) | 18.71 |
| 27 | `pipelined:data_width=22,n_iter=22,angle_guard=3,frac_guard=3,rounding=round` | 83872 | 1764 | 111.3 | 24 | 4.72 | 1.77e-06 (2^-19.10) | 19.10 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding system constraint is the burst: 32 requests must land within 0.5us of the tick, i.e. ~64 results/us sustained, which is far above the nominal 32 results/us. That rules out `iterative` (throughput = Fmax/(N+3), and 12-bit accuracy forces N>=~13, giving at best ~25 results/us even at an implausible 400 MHz), so I spend nothing on it. Accuracy depends only on (W, N, angle_guard, frac_guard, rounding): the residual-angle term needs N>=~13 and the accumulated shift/quantisation term needs W+frac_guard>=~17, so I centre the boxes on W 14..22, N 12..20, frac_guard 0..3, angle_guard -2..3 and let the optimiser find the cheapest corner that still clears 2^-12. The three pipelined/unrolled families all deliver >=1 result/cycle and are the only ones that can plausibly satisfy the batch bound; the real trade-off to map is registers (area) versus Fmax, which is exactly what m and k control. Round 1 is deliberately broad on W/N/guards and narrow on m (2..6) and k (2..8), since the burst bound will cut the large-m/large-k end.*)
- `pipelined` (40 evals): data_width=14..22, n_iter=12..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result/cycle makes the 32-request burst trivially meet sys_p99_batch_us (needs only ~(N+33)/Fmax <= 0.5us, i.e. Fmax >= ~90-110 MHz, easy for a single micro-rotation stage in sky130). It is the reference area/accuracy trade-off: area grows with N register stages, so the interesting question is how small W and N can go while still reaching 12 accuracy bits.
- `pipelined_m` (40 evals): data_width=14..22, n_iter=12..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=2..6. *Why:* Same 1 result/cycle throughput but registers only every m stages, cutting pipeline FFs (the dominant area term) at the cost of Fmax. m=2..4 should still clear the burst bound while saving area; m>=6 likely drops below the ~64 results/us the 0.5us batch needs, so the front should show exactly where that cliff is.
- `unrolled_k` (20 evals): data_width=14..22, n_iter=12..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, k=2..8. *Why:* Middle ground: k micro-rotations/cycle with a shared datapath gives k/(ceil(N/k)+3) results/cycle, so large k can still reach the burst rate with fewer register banks than a fully pipelined chain. Worth a smaller share to check whether its shared-datapath area beats pipelined_m at equal accuracy.

**Result (code):** 100 evaluations this round, 100 total; 25 feasible; hypervolume 1.71e+05 (n/a).

**LLM decision:** `map_front` — Round-1 front is entirely pipelined (10 designs, area 47.2k–57.7k um², accuracy 12.4–15.5 bits) and covers only a small slice of the achievable objectives: the registry allows data_width up to 28 and n_iter up to 30 (≈20 accuracy bits) and the area HV reference is 100k, so both the high-accuracy end and the low-area end are unmapped. The other families cannot contribute: unrolled_k (0/20 feasible, max 5.13 MSPS) and pipelined_m (0/40 feasible, max 82.5 MSPS) fail the throughput/batch constraints — pipelined_m's m≥2 register spacing lowers Fmax so 32 requests cannot clear the 0.5 us batch bound — and iterative is structurally unable to meet sys_p99_batch_us (32 serialized N+3-cycle results, e.g. N=4 at ~300 MHz is already ~750 ns). With 300 evals left and the front confined to one family and a narrow band, the best use of this round is a seeded NSGA-II over pipelined's full parameter ranges to map the whole trade-off curve (both a cheaper-than-47k corner and the higher-accuracy extension), which is what the hypervolume score rewards.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.71e+05 (gain this round: n/a (first round)).
Feasible designs: 25 of 100 evaluations (19 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 29% violate; best seen 163
- max_abs_err <= 0.000244141: 44% violate; best seen 1.78e-05 (2^-15.77)
- sys_p99_batch_us <= 0.5: 60% violate; best seen 0.282

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=47204, accuracy_bits=12.4, ffs=1016, throughput_msps=143, max_abs_err=0.00019 (2^-12.36), power_index=2.7
- pipelined [data_width=17 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=48117, accuracy_bits=12.9, ffs=1018, throughput_msps=143, max_abs_err=0.000128 (2^-12.94), power_index=2.72
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=48897, accuracy_bits=13.4, ffs=1034, throughput_msps=138, max_abs_err=9.28e-05 (2^-13.40), power_index=2.76
- pipelined [data_width=18 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=50507, accuracy_bits=13.8, ffs=1068, throughput_msps=138, max_abs_err=6.89e-05 (2^-13.83), power_index=2.85
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=51287, accuracy_bits=14.1, ffs=1084, throughput_msps=132, max_abs_err=5.64e-05 (2^-14.11), power_index=2.9
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=52898, accuracy_bits=14.4, ffs=1118, throughput_msps=132, max_abs_err=4.63e-05 (2^-14.40), power_index=2.99
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=53678, accuracy_bits=14.8, ffs=1135, throughput_msps=128, max_abs_err=3.42e-05 (2^-14.83), power_index=3.03
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=54310, accuracy_bits=15.2, ffs=1170, throughput_msps=128, max_abs_err=2.7e-05 (2^-15.18), power_index=3.1
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=57343, accuracy_bits=15.4, ffs=1233, throughput_msps=119, max_abs_err=2.27e-05 (2^-15.43), power_index=3.27
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=57680, accuracy_bits=15.5, ffs=1218, throughput_msps=123, max_abs_err=2.15e-05 (2^-15.51), power_index=3.25
Front coverage: area_um2 47204..57680 (HV reference 100000); accuracy_bits 12.4..15.5 (HV reference 12); data_width on the front 17..21 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.13 MSPS; best accuracy 14.26 bits
- pipelined: 40 evals, 25 feasible; max throughput seen 163 MSPS; best accuracy 15.51 bits; best feasible area_um2=47204; feasible ranges: data_width 17..21, n_iter 17..19, angle_guard -2..3, frac_guard 0..3
- pipelined_m: 40 evals, 0 feasible; max throughput seen 82.5 MSPS; best accuracy 15.77 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=16..28, n_iter=15..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (10 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 96 feasible; hypervolume 2.729e+05 (+59.6%).

**LLM decision:** `map_front` — Round 2 leaves 200/400 evals and the front is entirely one family. Evidence: 96/200 feasible, all pipelined; unrolled_k (0/20) tops out at 5.13 MSPS and pipelined_m (0/40) at 82.5 MSPS but 0 feasible — its m>1 register spacing lengthens the combinational path, so Fmax (and hence sys_p99_batch) fails the 0.5 us burst bound. The only unexplored family, iterative, is bounded by throughput = Fmax/(N+3) <= ~28 MSPS even at N=4, below the 32 MSPS constraint, so add_family buys nothing. The front spans area 47204..83872 against an HV reference of 100000 and accuracy 12.4..19.1 bits against a reference of 12 (registry allows ~26 bits at data_width 28), i.e. the high-accuracy end and the low-area corner are both under-mapped, and only 24 designs cover it. With a full round of budget left, the right move is to let NSGA-II map the whole front over pipelined's full ranges seeded with the current front, which both fills the HV gaps and re-probes the tight min-area corner (data_width=17, accuracy 12.36 bits, only 0.36 bits above the 2^-12 limit).

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2.729e+05 (gain this round: +59.6%).
Feasible designs: 96 of 200 evaluations (72 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 14% violate; best seen 163
- max_abs_err <= 0.000244141: 25% violate; best seen 8.4e-08 (2^-23.51)
- sys_p99_batch_us <= 0.5: 42% violate; best seen 0.282

Pareto front (feasible, 24 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=17 n_iter=17 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=47204, accuracy_bits=12.4, ffs=1016, throughput_msps=143, max_abs_err=0.00019 (2^-12.36), power_index=2.7
- pipelined [data_width=19 n_iter=15 angle_guard=4 frac_guard=2 rounding=round] area_um2=49939, accuracy_bits=13.8, ffs=1056, throughput_msps=119, max_abs_err=6.84e-05 (2^-13.84), power_index=2.82
- pipelined [data_width=18 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=51287, accuracy_bits=14.1, ffs=1084, throughput_msps=132, max_abs_err=5.64e-05 (2^-14.11), power_index=2.9
- pipelined [data_width=21 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] area_um2=54310, accuracy_bits=15.2, ffs=1170, throughput_msps=128, max_abs_err=2.7e-05 (2^-15.18), power_index=3.1
- pipelined [data_width=21 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=57680, accuracy_bits=15.5, ffs=1218, throughput_msps=123, max_abs_err=2.15e-05 (2^-15.51), power_index=3.25
- pipelined [data_width=22 n_iter=17 angle_guard=3 frac_guard=4 rounding=round] area_um2=66048, accuracy_bits=15.9, ffs=1390, throughput_msps=108, max_abs_err=1.58e-05 (2^-15.95), power_index=3.72
- pipelined [data_width=23 n_iter=20 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=69715, accuracy_bits=17.1, ffs=1494, throughput_msps=119, max_abs_err=7.02e-06 (2^-17.12), power_index=3.97
- pipelined [data_width=24 n_iter=20 angle_guard=0 frac_guard=3 rounding=trunc] area_um2=77752, accuracy_bits=18.2, ffs=1660, throughput_msps=105, max_abs_err=3.39e-06 (2^-18.17), power_index=4.42
- pipelined [data_width=24 n_iter=20 angle_guard=1 frac_guard=2 rounding=round] area_um2=78187, accuracy_bits=18.5, ffs=1646, throughput_msps=108, max_abs_err=2.62e-06 (2^-18.54), power_index=4.4
- pipelined [data_width=22 n_iter=22 angle_guard=3 frac_guard=3 rounding=round] area_um2=83872, accuracy_bits=19.1, ffs=1764, throughput_msps=111, max_abs_err=1.77e-06 (2^-19.10), power_index=4.72
Front coverage: area_um2 47204..83872 (HV reference 100000); accuracy_bits 12.4..19.1 (HV reference 12); data_width on the front 17..25 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.13 MSPS; best accuracy 14.26 bits
- pipelined: 140 evals, 96 feasible; max throughput seen 163 MSPS; best accuracy 23.51 bits; best feasible area_um2=47204; feasible ranges: data_width 17..25, n_iter 15..29, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 82.5 MSPS; best accuracy 15.77 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=16..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (24 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 160 feasible; hypervolume 2.787e+05 (+2.1%).

**LLM decision:** `map_front` — The feasible front is 100% pipelined (25 designs, area 42399..83872 um^2, accuracy 12.5..19.1 bits), while the best accuracy seen anywhere is 23.51 bits and the HV reference accuracy is only 12 — so the high-accuracy end of the front is clearly under-mapped and each extra bit there adds a large HV rectangle (e.g. a ~90k um^2 / 22-bit design would contribute ~1e5 on its own vs the current 2.787e5 total). The low-area end is also near-binding: the cheapest design (42399 um^2) has only 12.5 bits against the 2^-12 = 0.000244141 limit, and data_width on the front starts at 16 while the registry allows 8, so the min-area corner (the selection rule's target) is not yet pinned down. The other families do not justify budget: unrolled_k is 0/20 feasible with max throughput 5.13 MSPS, pipelined_m is 0/40 feasible, and iterative is structurally capped at 1/(N+3) results/cycle (N>=4), i.e. a throughput ceiling of ~Fmax/7, below the 32 MSPS constraint. With 100 evals and one round left, the reserved coverage search over pipelined's full ranges (seeded with the front) is the best use of the budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 2.787e+05 (gain this round: +2.1%).
Feasible designs: 160 of 300 evaluations (126 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 10% violate; best seen 163
- max_abs_err <= 0.000244141: 21% violate; best seen 8.4e-08 (2^-23.51)
- sys_p99_batch_us <= 0.5: 35% violate; best seen 0.282

Pareto front (feasible, 25 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=3 frac_guard=4 rounding=round] area_um2=42399, accuracy_bits=12.5, ffs=895, throughput_msps=132, max_abs_err=0.00017 (2^-12.52), power_index=2.39
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] area_um2=47884, accuracy_bits=13.7, ffs=1012, throughput_msps=128, max_abs_err=7.76e-05 (2^-13.65), power_index=2.7
- pipelined [data_width=19 n_iter=15 angle_guard=4 frac_guard=2 rounding=round] area_um2=49939, accuracy_bits=13.8, ffs=1056, throughput_msps=119, max_abs_err=6.84e-05 (2^-13.84), power_index=2.82
- pipelined [data_width=19 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] area_um2=52898, accuracy_bits=14.4, ffs=1118, throughput_msps=132, max_abs_err=4.63e-05 (2^-14.40), power_index=2.99
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=57343, accuracy_bits=15.4, ffs=1233, throughput_msps=119, max_abs_err=2.27e-05 (2^-15.43), power_index=3.27
- pipelined [data_width=22 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc] area_um2=62478, accuracy_bits=16.3, ffs=1341, throughput_msps=119, max_abs_err=1.21e-05 (2^-16.34), power_index=3.56
- pipelined [data_width=23 n_iter=20 angle_guard=0 frac_guard=0 rounding=trunc] area_um2=69715, accuracy_bits=17.1, ffs=1494, throughput_msps=119, max_abs_err=7.02e-06 (2^-17.12), power_index=3.97
- pipelined [data_width=24 n_iter=20 angle_guard=0 frac_guard=3 rounding=trunc] area_um2=77752, accuracy_bits=18.2, ffs=1660, throughput_msps=105, max_abs_err=3.39e-06 (2^-18.17), power_index=4.42
- pipelined [data_width=24 n_iter=20 angle_guard=1 frac_guard=2 rounding=round] area_um2=78187, accuracy_bits=18.5, ffs=1646, throughput_msps=108, max_abs_err=2.62e-06 (2^-18.54), power_index=4.4
- pipelined [data_width=22 n_iter=22 angle_guard=3 frac_guard=3 rounding=round] area_um2=83872, accuracy_bits=19.1, ffs=1764, throughput_msps=111, max_abs_err=1.77e-06 (2^-19.10), power_index=4.72
Front coverage: area_um2 42399..83872 (HV reference 100000); accuracy_bits 12.5..19.1 (HV reference 12); data_width on the front 16..25 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.13 MSPS; best accuracy 14.26 bits
- pipelined: 240 evals, 160 feasible; max throughput seen 163 MSPS; best accuracy 23.51 bits; best feasible area_um2=42399; feasible ranges: data_width 16..25, n_iter 14..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 82.5 MSPS; best accuracy 15.77 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (25 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 225 feasible; hypervolume 2.812e+05 (+0.9%).

**LLM decision:** `stop` — Budget exhausted (400/400 evals, round 4 of 4) and the design space is feasible, so `stop` (not `infeasible`). Evidence: 225 of 400 evaluations are feasible (177 unique) and the front holds 28 designs, so every spec constraint is reachable — throughput best seen 163 MSPS vs >=32 required, best max_abs_err 2^-24.26 vs <=2^-12 required, best sys_p99_batch_us 0.282 vs <=0.5 required. The min-area selection rule is also satisfied: the front's cheapest design (pipelined data_width=16 n_iter=14 angle_guard=3 frac_guard=4 rounding=round, area_um2=42399, throughput 132 MSPS) still clears the accuracy floor at 12.5 bits > 12 (max_abs_err 1.7e-4 <= 2.44e-4). The front spans area_um2 42399..83872 against HV ref 100000 and accuracy_bits 12.5..19.1 against ref 12, giving HV 2.812e+05 with only +0.9% gain this round, i.e. converged. The unexplored `iterative` family and the 0-feasible `unrolled_k`/`pipelined_m` families cannot improve on this: unrolled_k peaked at 5.13 MSPS throughput (constraint is 32) and neither reached a feasible design across 60 combined evaluations. Hypervolume gain is marginal and no budget remains for mapping the front further, so the front is good enough to stop.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2.812e+05 (gain this round: +0.9%).
Feasible designs: 225 of 400 evaluations (177 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 32: 7% violate; best seen 163
- max_abs_err <= 0.000244141: 18% violate; best seen 4.98e-08 (2^-24.26)
- sys_p99_batch_us <= 0.5: 33% violate; best seen 0.282

Pareto front (feasible, 28 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- pipelined [data_width=16 n_iter=14 angle_guard=3 frac_guard=4 rounding=round] area_um2=42399, accuracy_bits=12.5, ffs=895, throughput_msps=132, max_abs_err=0.00017 (2^-12.52), power_index=2.39
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] area_um2=47554, accuracy_bits=13.7, ffs=1024, throughput_msps=128, max_abs_err=7.77e-05 (2^-13.65), power_index=2.72
- pipelined [data_width=19 n_iter=15 angle_guard=4 frac_guard=2 rounding=round] area_um2=49939, accuracy_bits=13.8, ffs=1056, throughput_msps=119, max_abs_err=6.84e-05 (2^-13.84), power_index=2.82
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] area_um2=52730, accuracy_bits=14.6, ffs=1115, throughput_msps=123, max_abs_err=3.91e-05 (2^-14.64), power_index=2.98
- pipelined [data_width=21 n_iter=17 angle_guard=2 frac_guard=1 rounding=trunc] area_um2=57343, accuracy_bits=15.4, ffs=1233, throughput_msps=119, max_abs_err=2.27e-05 (2^-15.43), power_index=3.27
- pipelined [data_width=22 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] area_um2=60850, accuracy_bits=15.9, ffs=1285, throughput_msps=115, max_abs_err=1.67e-05 (2^-15.87), power_index=3.43
- pipelined [data_width=21 n_iter=19 angle_guard=2 frac_guard=2 rounding=round] area_um2=67082, accuracy_bits=17.1, ffs=1414, throughput_msps=119, max_abs_err=7.33e-06 (2^-17.06), power_index=3.78
- pipelined [data_width=23 n_iter=20 angle_guard=4 frac_guard=0 rounding=round] area_um2=73403, accuracy_bits=18.1, ffs=1573, throughput_msps=105, max_abs_err=3.56e-06 (2^-18.10), power_index=4.18
- pipelined [data_width=24 n_iter=20 angle_guard=1 frac_guard=2 rounding=round] area_um2=78187, accuracy_bits=18.5, ffs=1646, throughput_msps=108, max_abs_err=2.62e-06 (2^-18.54), power_index=4.4
- pipelined [data_width=22 n_iter=22 angle_guard=3 frac_guard=3 rounding=round] area_um2=83872, accuracy_bits=19.1, ffs=1764, throughput_msps=111, max_abs_err=1.77e-06 (2^-19.10), power_index=4.72
Front coverage: area_um2 42399..83872 (HV reference 100000); accuracy_bits 12.5..19.1 (HV reference 12); data_width on the front 16..25 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.13 MSPS; best accuracy 14.26 bits
- pipelined: 340 evals, 225 feasible; max throughput seen 163 MSPS; best accuracy 24.26 bits; best feasible area_um2=42399; feasible ranges: data_width 16..28, n_iter 13..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 40 evals, 0 feasible; max throughput seen 82.5 MSPS; best accuracy 15.77 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 17796 in, 25916 out
- provider-reported cost: $0.0179
- full prompts and replies: `llm_trace.jsonl`

