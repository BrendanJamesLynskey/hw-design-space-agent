# DSE run: asic_low_area

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`unrolled_k:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,k=2` — selection: auto (spec rule: min area_um2)

| metric | value | provenance |
|---|---|---|
| area_um2 | 9431 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| gate_eq | 2512 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| ffs | 103 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| fmax_mhz | 77.8 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| throughput_msps | 7.78 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| latency_cycles | 10 | exact: schedule |
| latency_ns | 129 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| power_index | 0.113 | estimate: cost_asic (sky130hd-tt_025C_1v80-yosys0.33-opensta-v1, 57 measured points) |
| max_abs_err | 0.0004 (2^-11.29) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 6.56 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.000102 (2^-13.26) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 1.67 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 11.3 | exact: bit-accurate model, exhaustive (65536 angles) |

## L2: cycle-level contract and system simulation

Interface contract of the L1 selection (cycle model, checked against the RTL cycle for cycle): latency 10 cycles, a new input every 10 cycle(s). DDS tone from its exact outputs: SFDR 90.8 dBc, SNR 77.5 dB (*simulated (hw_dse.l2.dds l2-v1: golden-model DDS, 32-bit phase accumulator, coherent 16384-point FFT, tone bin 1297)*).

No system scenario in this spec: the spec has no system scenario: nothing to re-select.

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `asic_synthesis.csv`, `asic_validation.csv`; nothing to compare.
- ASIC target: no refit calibration to re-explore under; a flagged winner change is reported, not acted on
- no measured data for the selected design; nothing to compare

## Pareto front (18 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | area µm² † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `unrolled_k:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,k=2` | 9431 | 103 | 7.8 | 10 | 0.113 | 0.0004 (2^-11.29) | 11.29 |
| 1 | `unrolled_k:data_width=16,n_iter=15,angle_guard=0,frac_guard=0,rounding=round,k=2` | 9503 | 103 | 7.1 | 11 | 0.125 | 0.000373 (2^-11.39) | 11.39 |
| 2 | `unrolled_k:data_width=16,n_iter=16,angle_guard=1,frac_guard=0,rounding=round,k=2` | 9669 | 104 | 6.8 | 11 | 0.126 | 0.000301 (2^-11.70) | 11.70 |
| 3 | `unrolled_k:data_width=17,n_iter=14,angle_guard=0,frac_guard=0,rounding=round,k=2` | 9935 | 108 | 7.4 | 10 | 0.119 | 0.000301 (2^-11.70) | 11.70 |
| 4 | `unrolled_k:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc,k=2` | 10259 | 108 | 6.5 | 11 | 0.133 | 0.000237 (2^-12.04) | 12.04 |
| 5 | `unrolled_k:data_width=18,n_iter=22,angle_guard=-1,frac_guard=2,rounding=trunc,k=2` | 11497 | 118 | 4.7 | 14 | 0.187 | 0.000204 (2^-12.26) | 12.26 |
| 6 | `unrolled_k:data_width=17,n_iter=15,angle_guard=1,frac_guard=1,rounding=round,k=2` | 11906 | 112 | 6.5 | 11 | 0.145 | 0.000158 (2^-12.63) | 12.63 |
| 7 | `unrolled_k:data_width=17,n_iter=16,angle_guard=1,frac_guard=1,rounding=round,k=2` | 11991 | 112 | 6.5 | 11 | 0.146 | 0.000128 (2^-12.94) | 12.94 |
| 8 | `unrolled_k:data_width=20,n_iter=21,angle_guard=2,frac_guard=0,rounding=round,k=2` | 12315 | 128 | 4.4 | 14 | 0.201 | 2.17e-05 (2^-15.49) | 15.49 |
| 9 | `unrolled_k:data_width=20,n_iter=21,angle_guard=2,frac_guard=3,rounding=round,k=2` | 15299 | 135 | 4.2 | 14 | 0.231 | 8.02e-06 (2^-16.93) | 16.93 |
| 10 | `unrolled_k:data_width=26,n_iter=27,angle_guard=0,frac_guard=0,rounding=trunc,k=2` | 15809 | 159 | 3.2 | 17 | 0.308 | 1e-06 (2^-19.93) | 19.93 |
| 11 | `unrolled_k:data_width=26,n_iter=23,angle_guard=2,frac_guard=2,rounding=trunc,k=2` | 16730 | 165 | 3.4 | 15 | 0.286 | 4.26e-07 (2^-21.16) | 21.16 |
| 12 | `unrolled_k:data_width=28,n_iter=27,angle_guard=0,frac_guard=0,rounding=round,k=2` | 17436 | 170 | 3.0 | 17 | 0.335 | 1.65e-07 (2^-22.53) | 22.53 |
| 13 | `unrolled_k:data_width=27,n_iter=29,angle_guard=1,frac_guard=2,rounding=round,k=2` | 20284 | 170 | 2.7 | 18 | 0.385 | 1.48e-07 (2^-22.69) | 22.69 |
| 14 | `unrolled_k:data_width=28,n_iter=28,angle_guard=3,frac_guard=1,rounding=trunc,k=4` | 25724 | 174 | 2.4 | 10 | 0.248 | 1e-07 (2^-23.25) | 23.25 |
| 15 | `unrolled_k:data_width=28,n_iter=28,angle_guard=1,frac_guard=1,rounding=round,k=4` | 27967 | 172 | 2.5 | 10 | 0.26 | 8.86e-08 (2^-23.43) | 23.43 |
| 16 | `unrolled_k:data_width=27,n_iter=28,angle_guard=4,frac_guard=2,rounding=round,k=4` | 28216 | 172 | 2.4 | 10 | 0.262 | 6.42e-08 (2^-23.89) | 23.89 |
| 17 | `unrolled_k:data_width=28,n_iter=29,angle_guard=2,frac_guard=4,rounding=round,k=4` | 30278 | 179 | 2.1 | 11 | 0.306 | 4.07e-08 (2^-24.55) | 24.55 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >=1 MSPS throughput and max_abs_err <= 2^-10, with area minimization as the primary objective. The iterative family is excluded because it produces only 1 result every N+3 cycles, making it very hard to reach 1 MSPS without extremely high Fmax, and it will likely be dominated on area by pipelined variants. The three pipelined/unrolled families are the viable candidates. pipelined_m is the most promising because it balances FF count (area) against throughput by registering every m stages. unrolled_k is a strong alternative that may use fewer FFs than pipelined_m for the same accuracy. pipelined is included as a reference to map the full Pareto front. Parameter ranges are focused: data_width 12-16 and n_iter 10-14 should be sufficient to meet the 2^-10 accuracy constraint (accuracy_bits >= 10) while keeping area low. angle_guard and frac_guard are kept minimal to reduce datapath width. The budget is split to explore the trade-offs between these families, with emphasis on pipelined_m and unrolled_k where the area/throughput/accuracy balance is most favorable.*)
- `pipelined_m` (34 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* pipelined_m is the primary candidate for meeting >=1 MSPS with minimal area. By registering every m stages (m=2..4), it reduces FF count significantly compared to fully pipelined (m=1) while still achieving 1 result/cycle throughput. The key trade-off is between n_iter (accuracy) and m (area/FFs). With data_width 12-16 and n_iter 10-14, we can achieve max_abs_err <= 2^-10 (0.000976562) while keeping area low. angle_guard -2..0 and frac_guard 0..1 minimize datapath width without sacrificing accuracy. This family offers the best area/throughput/accuracy balance for this spec.
- `unrolled_k` (33 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round, k=2..4. *Why:* unrolled_k with k=2..4 can achieve 1 result/cycle throughput if Fmax is high enough (ceil(N/k)+3 cycles per result, so for N=12, k=4, that's 6 cycles/result; at 100+ MHz this gives >=1 MSPS). It uses a shared datapath with fewer FFs than pipelined_m for the same accuracy, potentially yielding lower area. The trade-off is that higher k increases combinational depth, which may reduce Fmax. Worth exploring to see if it beats pipelined_m on area while meeting throughput.
- `pipelined` (33 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..0, frac_guard=0..1, rounding=trunc|round. *Why:* Fully pipelined (m=1) guarantees 1 result/cycle with the highest Fmax potential (shortest combinational path per stage), but has the most FFs. Including it as a reference point helps map the Pareto front: if pipelined_m with m=2..4 meets throughput at lower area, pipelined will be dominated. If pipelined_m fails on throughput, pipelined may be the only viable pipelined option. Worth a small share to establish the area/throughput boundary.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 45 feasible; hypervolume 3.49e+04 (n/a).

**LLM decision:** `refine` — The `unrolled_k` family dominates the Pareto front with a best area of 13322 um^2, significantly lower than `pipelined_m` (19260 um^2) and `pipelined` (29711 um^2). The current front is clustered in a narrow region (data_width 15-16, n_iter 13-14, k=4). To maximize hypervolume and find the true minimum area, we need to explore the trade-off between `n_iter` (which drives accuracy) and `data_width`/`k` (which drive area) more aggressively. Specifically, we should test if lower `n_iter` (e.g., 10-12) can still meet the 2^-10 error constraint with `rounding=round` and slightly higher `data_width`, or if higher `k` (5-8) reduces area by shortening the critical path or reducing FSM overhead, even if it increases logic depth. We will focus the search on `unrolled_k` with a wider range for `n_iter` and `k` to map the area-accuracy trade-off curve more completely.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3.49e+04 (gain this round: n/a (first round)).
Feasible designs: 45 of 100 evaluations (24 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 190
- max_abs_err <= 0.000976562: 55% violate; best seen 0.000389 (2^-11.33)

Pareto front (feasible, 4 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- unrolled_k [data_width=15 n_iter=14 angle_guard=0 frac_guard=1 rounding=trunc k=4] area_um2=13322, accuracy_bits=10.1, ffs=98, throughput_msps=5.84, max_abs_err=0.000921 (2^-10.08), power_index=0.0933
- unrolled_k [data_width=16 n_iter=14 angle_guard=-1 frac_guard=0 rounding=trunc k=4] area_um2=13366, accuracy_bits=10.2, ffs=101, throughput_msps=5.84, max_abs_err=0.000865 (2^-10.18), power_index=0.0943
- unrolled_k [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=4] area_um2=13675, accuracy_bits=11.3, ffs=102, throughput_msps=5.84, max_abs_err=0.0004 (2^-11.29), power_index=0.096
- unrolled_k [data_width=16 n_iter=14 angle_guard=0 frac_guard=1 rounding=round k=4] area_um2=15503, accuracy_bits=11.3, ffs=104, throughput_msps=5.58, max_abs_err=0.000389 (2^-11.33), power_index=0.104
Front coverage: area_um2 13322..15503 (HV reference 40000); accuracy_bits 10.1..11.3 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- unrolled_k: 33 evals, 14 feasible; max throughput seen 11.2 MSPS; best accuracy 11.33 bits; best feasible area_um2=13322; feasible ranges: data_width 15..16, n_iter 13..14, angle_guard -1..0, frac_guard 0..1, k 4..4
- pipelined: 33 evals, 15 feasible; max throughput seen 190 MSPS; best accuracy 11.28 bits; best feasible area_um2=29711; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..0, frac_guard 0..1
- pipelined_m: 34 evals, 16 feasible; max throughput seen 96.1 MSPS; best accuracy 10.47 bits; best feasible area_um2=19260; feasible ranges: data_width 16..16, n_iter 12..12, angle_guard -1..0, frac_guard 0..1, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus 100% of the budget on `unrolled_k` as it is the clear area winner. Widen `k` and `n_iter` to explore the full trade-off space for this family.*)
- `unrolled_k` (100 evals): data_width=14..18, n_iter=10..16, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, k=2..8. *Why:* Expand search around the current best (13322 um^2) to find lower area designs. Testing k>4 may reduce area via shorter latency/FSM, while n_iter<14 with rounding might maintain accuracy at lower cost. data_width 14-18 covers the sensitivity of the error bound.

**Result (code):** 100 evaluations this round, 200 total; 121 feasible; hypervolume 9.962e+04 (+185.4%).

**LLM decision:** `refine` — The current Pareto front is dominated by `unrolled_k` designs, which offer the best area (starting at 9746 um^2) and sufficient throughput (5-7 MSPS) to meet the >= 1 MSPS constraint. The `pipelined` and `pipelined_m` families are significantly larger (19k-29k um^2) and thus irrelevant for the 'min area' objective, though they provide higher throughput which is not a bottleneck here. The `iterative` family has not been explored yet, but given that `unrolled_k` with k=2 already achieves ~7 MSPS with low area, `iterative` (1 result/cycle) will likely be larger or slower for the same accuracy. The most promising region is `unrolled_k` with `data_width` 16-17, `n_iter` 13-16, `angle_guard` 1, `frac_guard` 0-2, and `k` 2-3. I will refine the search to focus on this high-yield region to maximize hypervolume within the remaining budget, specifically targeting the trade-off between area and accuracy bits in the 11-13 bit range.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9.962e+04 (gain this round: +185.4%).
Feasible designs: 121 of 200 evaluations (90 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 190
- max_abs_err <= 0.000976562: 40% violate; best seen 8.08e-05 (2^-13.60)

Pareto front (feasible, 10 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc k=2] area_um2=9746, accuracy_bits=11.5, ffs=106, throughput_msps=7.45, max_abs_err=0.000344 (2^-11.50), power_index=0.116
- unrolled_k [data_width=17 n_iter=13 angle_guard=1 frac_guard=0 rounding=round k=2] area_um2=9943, accuracy_bits=11.6, ffs=109, throughput_msps=7.14, max_abs_err=0.000326 (2^-11.58), power_index=0.119
- unrolled_k [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=trunc k=2] area_um2=10028, accuracy_bits=11.7, ffs=109, throughput_msps=6.49, max_abs_err=0.000307 (2^-11.67), power_index=0.132
- unrolled_k [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=2] area_um2=10259, accuracy_bits=12, ffs=108, throughput_msps=6.49, max_abs_err=0.000237 (2^-12.04), power_index=0.133
- unrolled_k [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=round k=2] area_um2=11759, accuracy_bits=12.2, ffs=108, throughput_msps=6.49, max_abs_err=0.000214 (2^-12.19), power_index=0.142
- unrolled_k [data_width=18 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=3] area_um2=12971, accuracy_bits=12.5, ffs=115, throughput_msps=5.89, max_abs_err=0.000175 (2^-12.48), power_index=0.112
- unrolled_k [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round k=3] area_um2=14303, accuracy_bits=12.6, ffs=112, throughput_msps=6.14, max_abs_err=0.000158 (2^-12.63), power_index=0.117
- unrolled_k [data_width=18 n_iter=14 angle_guard=1 frac_guard=2 rounding=round k=3] area_um2=15320, accuracy_bits=12.6, ffs=119, throughput_msps=5.66, max_abs_err=0.000157 (2^-12.64), power_index=0.125
- unrolled_k [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round k=3] area_um2=15454, accuracy_bits=13.4, ffs=119, throughput_msps=5.66, max_abs_err=9.56e-05 (2^-13.35), power_index=0.126
- unrolled_k [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=6] area_um2=21600, accuracy_bits=13.6, ffs=118, throughput_msps=3.89, max_abs_err=8.08e-05 (2^-13.60), power_index=0.116
Front coverage: area_um2 9746..21600 (HV reference 40000); accuracy_bits 11.5..13.6 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 133 evals, 90 feasible; max throughput seen 11.2 MSPS; best accuracy 13.60 bits; best feasible area_um2=9746; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard -1..1, frac_guard 0..2, k 2..8
- pipelined: 33 evals, 15 feasible; max throughput seen 190 MSPS; best accuracy 11.28 bits; best feasible area_um2=29711; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..0, frac_guard 0..1
- pipelined_m: 34 evals, 16 feasible; max throughput seen 96.1 MSPS; best accuracy 10.47 bits; best feasible area_um2=19260; feasible ranges: data_width 16..16, n_iter 12..12, angle_guard -1..0, frac_guard 0..1, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate remaining budget on the dominant family's sweet spot to improve hypervolume.*)
- `unrolled_k` (40 evals): data_width=16..17, n_iter=13..16, angle_guard=0..1, frac_guard=0..2, rounding=trunc|round, k=2..3. *Why:* Focus on the proven low-area, high-accuracy region of unrolled_k to refine the Pareto front.

**Result (code):** 40 evaluations this round, 240 total; 161 feasible; hypervolume 1.025e+05 (+2.9%).

**LLM decision:** `stop` — The Pareto front is well-established and feasible. The minimum area design (unrolled_k, 9431 um^2) meets all constraints: throughput 7.78 MSPS >= 1 MSPS and max_abs_err 0.0004 <= 0.000976562. The front covers a reasonable range of accuracy (11.3 to 13.6 bits) and area (9431 to 21600 um^2). Since this is the final round, we stop. The selection rule (min area) picks the unrolled_k design with data_width=16, n_iter=14, angle_guard=0, frac_guard=0, rounding=round, k=2.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.025e+05 (gain this round: +2.9%).
Feasible designs: 161 of 240 evaluations (113 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 190
- max_abs_err <= 0.000976562: 33% violate; best seen 8.08e-05 (2^-13.60)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- unrolled_k [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=2] area_um2=9431, accuracy_bits=11.3, ffs=103, throughput_msps=7.78, max_abs_err=0.0004 (2^-11.29), power_index=0.113
- unrolled_k [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round k=2] area_um2=9503, accuracy_bits=11.4, ffs=103, throughput_msps=7.07, max_abs_err=0.000373 (2^-11.39), power_index=0.125
- unrolled_k [data_width=16 n_iter=16 angle_guard=1 frac_guard=0 rounding=round k=2] area_um2=9669, accuracy_bits=11.7, ffs=104, throughput_msps=6.77, max_abs_err=0.000301 (2^-11.70), power_index=0.126
- unrolled_k [data_width=17 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=2] area_um2=9935, accuracy_bits=11.7, ffs=108, throughput_msps=7.45, max_abs_err=0.000301 (2^-11.70), power_index=0.119
- unrolled_k [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=2] area_um2=10259, accuracy_bits=12, ffs=108, throughput_msps=6.49, max_abs_err=0.000237 (2^-12.04), power_index=0.133
- unrolled_k [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round k=2] area_um2=11906, accuracy_bits=12.6, ffs=112, throughput_msps=6.49, max_abs_err=0.000158 (2^-12.63), power_index=0.145
- unrolled_k [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round k=2] area_um2=11991, accuracy_bits=12.9, ffs=112, throughput_msps=6.49, max_abs_err=0.000128 (2^-12.94), power_index=0.146
- unrolled_k [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=round k=2] area_um2=12371, accuracy_bits=13.2, ffs=114, throughput_msps=6.24, max_abs_err=0.000109 (2^-13.16), power_index=0.15
- unrolled_k [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round k=3] area_um2=15454, accuracy_bits=13.4, ffs=119, throughput_msps=5.66, max_abs_err=9.56e-05 (2^-13.35), power_index=0.126
- unrolled_k [data_width=18 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=6] area_um2=21600, accuracy_bits=13.6, ffs=118, throughput_msps=3.89, max_abs_err=8.08e-05 (2^-13.60), power_index=0.116
Front coverage: area_um2 9431..21600 (HV reference 40000); accuracy_bits 11.3..13.6 (HV reference 10); data_width on the front 16..18 (registry 8..28).

Per family:
- unrolled_k: 173 evals, 130 feasible; max throughput seen 11.2 MSPS; best accuracy 13.60 bits; best feasible area_um2=9431; feasible ranges: data_width 14..18, n_iter 12..16, angle_guard -1..1, frac_guard 0..2, k 2..8
- pipelined: 33 evals, 15 feasible; max throughput seen 190 MSPS; best accuracy 11.28 bits; best feasible area_um2=29711; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..0, frac_guard 0..1
- pipelined_m: 34 evals, 16 feasible; max throughput seen 96.1 MSPS; best accuracy 10.47 bits; best feasible area_um2=19260; feasible ranges: data_width 16..16, n_iter 12..12, angle_guard -1..0, frac_guard 0..1, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `unrolled_k` (160 evals): data_width=15..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* code: map the front of unrolled_k (11 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 314 feasible; hypervolume 3.508e+05 (+242.1%).

**No LLM call** (code's front-mapping round): The Pareto front is well-established and feasible. The minimum area design (unrolled_k, 9431 um^2) meets all constraints: throughput 7.78 MSPS >= 1 MSPS and max_abs_err 0.0004 <= 0.000976562. The front covers a reasonable range of accuracy (11.3 to 13.6 bits) and area (9431 to 21600 um^2). Since this is the final round, we stop. The selection rule (min area) picks the unrolled_k design with data_width=16, n_iter=14, angle_guard=0, frac_guard=0, rounding=round, k=2.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 3.508e+05 (gain this round: +242.1%).
Feasible designs: 314 of 400 evaluations (256 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: area/gate equivalents/FFs/Fmax/throughput/power are cost-model ESTIMATES (sky130 standard cells, calibrated on Yosys + OpenSTA synthesis); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 190
- max_abs_err <= 0.000976562: 22% violate; best seen 4.07e-08 (2^-24.55)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min area_um2, max accuracy_bits
- unrolled_k [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round k=2] area_um2=9431, accuracy_bits=11.3, ffs=103, throughput_msps=7.78, max_abs_err=0.0004 (2^-11.29), power_index=0.113
- unrolled_k [data_width=16 n_iter=16 angle_guard=1 frac_guard=0 rounding=round k=2] area_um2=9669, accuracy_bits=11.7, ffs=104, throughput_msps=6.77, max_abs_err=0.000301 (2^-11.70), power_index=0.126
- unrolled_k [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=2] area_um2=10259, accuracy_bits=12, ffs=108, throughput_msps=6.49, max_abs_err=0.000237 (2^-12.04), power_index=0.133
- unrolled_k [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round k=2] area_um2=11906, accuracy_bits=12.6, ffs=112, throughput_msps=6.49, max_abs_err=0.000158 (2^-12.63), power_index=0.145
- unrolled_k [data_width=20 n_iter=21 angle_guard=2 frac_guard=0 rounding=round k=2] area_um2=12315, accuracy_bits=15.5, ffs=128, throughput_msps=4.39, max_abs_err=2.17e-05 (2^-15.49), power_index=0.201
- unrolled_k [data_width=20 n_iter=21 angle_guard=2 frac_guard=3 rounding=round k=2] area_um2=15299, accuracy_bits=16.9, ffs=135, throughput_msps=4.24, max_abs_err=8.02e-06 (2^-16.93), power_index=0.231
- unrolled_k [data_width=26 n_iter=23 angle_guard=2 frac_guard=2 rounding=trunc k=2] area_um2=16730, accuracy_bits=21.2, ffs=165, throughput_msps=3.38, max_abs_err=4.26e-07 (2^-21.16), power_index=0.286
- unrolled_k [data_width=27 n_iter=29 angle_guard=1 frac_guard=2 rounding=round k=2] area_um2=20284, accuracy_bits=22.7, ffs=170, throughput_msps=2.74, max_abs_err=1.48e-07 (2^-22.69), power_index=0.385
- unrolled_k [data_width=28 n_iter=28 angle_guard=1 frac_guard=1 rounding=round k=4] area_um2=27967, accuracy_bits=23.4, ffs=172, throughput_msps=2.55, max_abs_err=8.86e-08 (2^-23.43), power_index=0.26
- unrolled_k [data_width=28 n_iter=29 angle_guard=2 frac_guard=4 rounding=round k=4] area_um2=30278, accuracy_bits=24.6, ffs=179, throughput_msps=2.13, max_abs_err=4.07e-08 (2^-24.55), power_index=0.306
Front coverage: area_um2 9431..30278 (HV reference 40000); accuracy_bits 11.3..24.6 (HV reference 10); data_width on the front 16..28 (registry 8..28).

Per family:
- unrolled_k: 333 evals, 283 feasible; max throughput seen 11.2 MSPS; best accuracy 24.55 bits; best feasible area_um2=9431; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4, k 2..8
- pipelined: 33 evals, 15 feasible; max throughput seen 190 MSPS; best accuracy 11.28 bits; best feasible area_um2=29711; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..0, frac_guard 0..1
- pipelined_m: 34 evals, 16 feasible; max throughput seen 96.1 MSPS; best accuracy 10.47 bits; best feasible area_um2=19260; feasible ranges: data_width 16..16, n_iter 12..12, angle_guard -1..0, frac_guard 0..1, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 10370 in, 3088 out
- provider-reported cost: $0.0074
- full prompts and replies: `llm_trace.jsonl`

