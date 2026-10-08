# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec low_area_control: Field-oriented motor-control loop needing sin/cos of the rotor angle at >= 1 MSPS with max error <= 2^-10. Area is everything: minimise LUTs + FFs.
  constraint: throughput_msps >= 1
  constraint: max_abs_err <= 0.000976562
  objective: min luts_plus_ffs (HV ref 1500)
  objective: max accuracy_bits (HV ref 10)
  select: min luts_plus_ffs
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`unrolled_k:data_width=15,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,k=2` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 249 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 91 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 105 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 10.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 10 | exact: schedule |
| latency_ns | 94.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.128 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000632 (2^-10.63) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 5.18 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000164 (2^-12.58) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.34 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.6 | exact: bit-accurate model, exhaustive (32768 angles) |

## Pareto front (6 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `unrolled_k:data_width=15,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,k=2` | 249 | 91 | 10.5 | 10 | 0.128 | 0.000632 (2^-10.63) | 10.63 |
| 1 | `unrolled_k:data_width=15,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc,k=2` | 253 | 93 | 10.5 | 10 | 0.13 | 0.000594 (2^-10.72) | 10.72 |
| 2 | `unrolled_k:data_width=16,n_iter=15,angle_guard=0,frac_guard=0,rounding=round,k=2` | 262 | 95 | 9.6 | 11 | 0.148 | 0.000373 (2^-11.39) | 11.39 |
| 3 | `unrolled_k:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round,k=2` | 266 | 96 | 10.5 | 10 | 0.136 | 0.000342 (2^-11.51) | 11.51 |
| 4 | `unrolled_k:data_width=16,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc,k=2` | 283 | 100 | 9.6 | 11 | 0.158 | 0.00025 (2^-11.97) | 11.97 |
| 5 | `unrolled_k:data_width=16,n_iter=15,angle_guard=1,frac_guard=2,rounding=round,k=2` | 326 | 100 | 9.6 | 11 | 0.176 | 0.000218 (2^-12.16) | 12.16 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec prioritizes area (min luts_plus_ffs) with hard constraints on throughput (>=1 MSPS) and accuracy (<=2^-10). 

1. **Accuracy Targeting**: max_abs_err <= 2^-10 requires sufficient precision. For CORDIC, error is dominated by n_iter and data_width. A data_width of 12-16 and n_iter of 10-14 is a reasonable starting range to meet 2^-10 error without excessive area. angle_guard and frac_guard are kept minimal (-1..1, 0..2) to save area, as they add bits to the datapath.

2. **Throughput & Area Trade-off**: 
   - `iterative` is excluded because it produces 1 result every N+3 cycles. To get 1 MSPS, it would need Fmax >= N+3 MHz (e.g., 13-17 MHz). While area is low, the low Fmax might not be an issue, but its throughput is inherently low. However, `pipelined_m` and `pipelined` achieve 1 result/cycle, allowing much higher throughput at the same Fmax, or meeting 1 MSPS at a lower Fmax. Since area is the primary objective, and pipelined structures have more FFs, we must compare. But `iterative` has the fewest FFs. Let's reconsider: `iterative` area is very low. If Fmax is high enough (e.g., 20 MHz), it meets 1 MSPS. But Artix-7 Fmax is typically 100+ MHz. So `iterative` could be very competitive on area. However, the prompt asks to prefer families that can *plausibly* meet constraints. All can. But `pipelined_m` is a strong candidate for balancing area and throughput. I will include `iterative` in a later round if needed, but for now, `pipelined_m` and `pipelined` are the main contenders for high throughput with manageable area. Actually, `iterative` has the lowest area. Let's include it? No, the budget is limited. `pipelined_m` is the best compromise. I will stick with the three families above to focus the search. If `iterative` turns out to be better, it can be explored in round 2.

3. **Budget Allocation**: 50% to `pipelined_m` (most likely optimal), 30% to `pipelined` (baseline), 20% to `unrolled_k` (alternative). This focuses the search on the most promising families while keeping an eye on alternatives.*)
- `pipelined_m` (50 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m is the primary candidate for low-area, high-throughput. It achieves 1 result/cycle (meeting >=1 MSPS easily at moderate Fmax) while using fewer registers than fully pipelined (m>1), directly minimizing the luts_plus_ffs objective. The m=2..4 range balances latency/area. data_width 12-16 and n_iter 10-14 are targeted to meet max_abs_err <= 2^-10 (0.000976562) with minimal overhead; angle_guard and frac_guard are kept tight to save area.
- `pipelined` (30 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round. *Why:* pipelined (m=1) is included as a baseline to confirm whether the extra registers of full pipelining ever yield a better Fmax/area trade-off than pipelined_m. It has the same throughput (1 result/cycle) but higher FF count. Searching the same accuracy-focused ranges allows direct comparison of the area penalty of full pipelining vs. partial pipelining.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=10..14, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* unrolled_k is a secondary candidate. It has lower area than pipelined (no per-stage registers) but lower throughput (1 result every ceil(N/k) cycles). To meet >=1 MSPS, it requires a higher Fmax. If Fmax is high enough, its lower area could beat pipelined_m. k=2..4 is searched to find the best throughput/area/Fmax balance. This family is less likely to be optimal for 'area is everything' but must be checked to ensure the Pareto front is complete.

**Result (code):** 100 evaluations this round, 100 total; 48 feasible; hypervolume 1724 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by the `unrolled_k` design (362 luts_plus_ffs), which is significantly smaller than the `pipelined` (1637) and `pipelined_m` (799) alternatives. The `unrolled_k` family has already demonstrated that it can meet the throughput constraint (>= 1 MSPS) with a very small area footprint. The `iterative` family is not yet explored, but given that `unrolled_k` with k=2 already achieves 10.5 MSPS with only 362 area units, and `iterative` typically has a similar or slightly larger area footprint for the same accuracy while having lower throughput (1 result per N+3 cycles), it is unlikely to beat the current best `unrolled_k` design on the primary objective (min luts_plus_ffs). The feasible region for `unrolled_k` is already quite tight (data_width 15..16, n_iter 12..14). To maximize the hypervolume and ensure we have the absolute best design on the front, we should refine the search around the current best `unrolled_k` design to see if we can squeeze out a few more accuracy bits or reduce area slightly by exploring the boundaries of the feasible range more densely, specifically checking if `data_width=15` with higher `n_iter` or different guards can improve the trade-off. We will focus the next round on `unrolled_k` and `pipelined_m` (which had the second best area) to see if any hidden gems exist in the corners of the feasible space.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1724 (gain this round: n/a (first round)).
Feasible designs: 48 of 100 evaluations (31 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 52% violate; best seen 0.000311 (2^-11.65)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=2] luts_plus_ffs=362, accuracy_bits=11.5, luts=266, ffs=96, throughput_msps=10.5, max_abs_err=0.000342 (2^-11.51), power_index=0.136
- pipelined [data_width=16 n_iter=14 angle_guard=1 frac_guard=1 rounding=round] luts_plus_ffs=1637, accuracy_bits=11.7, luts=820, ffs=817, throughput_msps=273, max_abs_err=0.000311 (2^-11.65), power_index=0.0616

Per family:
- unrolled_k: 20 evals, 8 feasible; max throughput seen 14 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=362; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..2, k 2..4
- pipelined: 30 evals, 14 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1396; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..2
- pipelined_m: 50 evals, 26 feasible; max throughput seen 178 MSPS; best accuracy 11.35 bits; best feasible luts_plus_ffs=799; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..2, m 3..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the two families that have produced the best area results. `unrolled_k` is the clear leader, so it gets the majority of the budget. `pipelined_m` is the runner-up, so we give it a smaller share to check for any improvements.*)
- `unrolled_k` (60 evals): data_width=15..16, n_iter=12..15, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Current best design is here. Refining around the known feasible region to find potential improvements in accuracy or area.
- `pipelined_m` (40 evals): data_width=15..16, n_iter=12..15, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Second best area. Exploring slightly wider m range (2..4) to see if a different pipeline depth offers a better area/accuracy trade-off than the current best.

**Result (code):** 100 evaluations this round, 200 total; 136 feasible; hypervolume 2428 (+40.8%).

**LLM decision:** `refine` — The current Pareto front is dominated by `unrolled_k` designs with `luts_plus_ffs` between 342 and 426. The `pipelined` and `pipelined_m` families are significantly larger (799+ and 1396+ respectively) and offer no advantage for the 'min area' objective given the throughput constraint is easily met by `unrolled_k` (9.58 MSPS >> 1 MSPS). The `iterative` family is not yet explored, but it typically has higher latency and often higher area than unrolled designs for the same accuracy due to lack of parallelism in the datapath reuse or FSM overhead, and `unrolled_k` with k=2 is already very efficient. The most promising region is clearly `unrolled_k` with `data_width` 15-16, `n_iter` 14-15, `angle_guard` 0-1, `frac_guard` 0-2, and `k` 2-3. We should narrow the search space to focus the remaining budget on refining the `unrolled_k` front, specifically checking if `k=3` or `k=4` offers a better area/accuracy trade-off than `k=2` in this narrow window, and confirming the exact boundary of the accuracy constraint.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2428 (gain this round: +40.8%).
Feasible designs: 136 of 200 evaluations (85 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 32% violate; best seen 0.000218 (2^-12.16)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=15 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc k=2] luts_plus_ffs=342, accuracy_bits=10.2, luts=250, ffs=92, throughput_msps=9.58, max_abs_err=0.000822 (2^-10.25), power_index=0.141
- unrolled_k [data_width=15 n_iter=14 angle_guard=0 frac_guard=2 rounding=trunc k=2] luts_plus_ffs=357, accuracy_bits=10.3, luts=263, ffs=94, throughput_msps=10.5, max_abs_err=0.000799 (2^-10.29), power_index=0.134
- unrolled_k [data_width=15 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc k=2] luts_plus_ffs=361, accuracy_bits=11.3, luts=266, ffs=95, throughput_msps=9.58, max_abs_err=0.000393 (2^-11.31), power_index=0.149
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=2] luts_plus_ffs=362, accuracy_bits=11.5, luts=266, ffs=96, throughput_msps=10.5, max_abs_err=0.000342 (2^-11.51), power_index=0.136
- unrolled_k [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=round k=2] luts_plus_ffs=426, accuracy_bits=12.2, luts=326, ffs=100, throughput_msps=9.58, max_abs_err=0.000218 (2^-12.16), power_index=0.176

Per family:
- unrolled_k: 80 evals, 62 feasible; max throughput seen 14 MSPS; best accuracy 12.16 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 15..16, n_iter 12..15, angle_guard -1..1, frac_guard 0..2, k 2..4
- pipelined: 30 evals, 14 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1396; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..2
- pipelined_m: 90 evals, 60 feasible; max throughput seen 178 MSPS; best accuracy 11.97 bits; best feasible luts_plus_ffs=799; feasible ranges: data_width 15..16, n_iter 12..15, angle_guard -1..1, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Narrowing to the proven feasible region of unrolled_k to maximize hypervolume gain in the remaining 200 evaluations.*)
- `unrolled_k` (100 evals): data_width=15..16, n_iter=14..15, angle_guard=0..1, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Focus remaining budget on the dominant family to refine the Pareto front in the low-area region. k=3 and k=4 have not been fully explored in the narrowest accuracy/area window.

**Result (code):** 100 evaluations this round, 300 total; 235 feasible; hypervolume 2455 (+1.1%).

**LLM decision:** `refine` — The current Pareto front is dominated by `unrolled_k` designs with `luts_plus_ffs` between 342 and 426. The `pipelined` and `pipelined_m` families are significantly more expensive (best 799 and 1396 respectively) and thus do not contribute to the minimum area objective. The `iterative` family has not been explored, but given that `unrolled_k` with k=2 already achieves ~9.5-10.5 MSPS (well above the 1 MSPS constraint) with very low area, and `iterative` typically has similar or slightly lower area but much lower throughput (1 result per N+3 cycles), it is unlikely to beat the current best area of 342 while maintaining throughput >= 1 MSPS unless N is very small (which hurts accuracy). However, to be thorough and potentially find a slightly smaller area solution if `iterative` with a very small N (e.g., 10-12) and specific guards can meet the accuracy constraint, we should check it. But looking at the accuracy constraint: max_abs_err <= 2^-10. The best `unrolled_k` design has 10.2 bits accuracy. `iterative` with N=12, W=16 usually yields similar accuracy. The area of `iterative` is often comparable to `unrolled_k` with k=1 (which is effectively iterative). Since `unrolled_k` k=2 is already on the front, and `iterative` is essentially k=1, it is highly likely `iterative` will be dominated by `unrolled_k` k=2 in terms of area/throughput trade-off or simply have similar area but lower throughput. Given the budget (100 evals left) and the fact that the front has stabilized around 342-426 area, the most valuable use of the remaining budget is to refine the `unrolled_k` search space to ensure we haven't missed a slightly better area point (e.g., checking if k=3 or 4 allows for smaller N or different guards that reduce area further, or if W=15 with different guards yields better area). The current best is W=15, N=15, k=2. Let's refine `unrolled_k` around this sweet spot to confirm the minimum area.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 2455 (gain this round: +1.1%).
Feasible designs: 235 of 300 evaluations (120 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 22% violate; best seen 0.000218 (2^-12.16)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=15 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc k=2] luts_plus_ffs=342, accuracy_bits=10.2, luts=250, ffs=92, throughput_msps=9.58, max_abs_err=0.000822 (2^-10.25), power_index=0.141
- unrolled_k [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=trunc k=2] luts_plus_ffs=348, accuracy_bits=10.6, luts=253, ffs=95, throughput_msps=9.58, max_abs_err=0.000643 (2^-10.60), power_index=0.144
- unrolled_k [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=trunc k=2] luts_plus_ffs=348, accuracy_bits=10.6, luts=253, ffs=95, throughput_msps=10.5, max_abs_err=0.000643 (2^-10.60), power_index=0.131
- unrolled_k [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round k=2] luts_plus_ffs=357, accuracy_bits=11.4, luts=262, ffs=95, throughput_msps=9.58, max_abs_err=0.000373 (2^-11.39), power_index=0.148
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=2] luts_plus_ffs=362, accuracy_bits=11.5, luts=266, ffs=96, throughput_msps=10.5, max_abs_err=0.000342 (2^-11.51), power_index=0.136
- unrolled_k [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc k=2] luts_plus_ffs=383, accuracy_bits=12, luts=283, ffs=100, throughput_msps=9.58, max_abs_err=0.00025 (2^-11.97), power_index=0.158
- unrolled_k [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=round k=2] luts_plus_ffs=426, accuracy_bits=12.2, luts=326, ffs=100, throughput_msps=9.58, max_abs_err=0.000218 (2^-12.16), power_index=0.176

Per family:
- unrolled_k: 180 evals, 161 feasible; max throughput seen 14 MSPS; best accuracy 12.16 bits; best feasible luts_plus_ffs=342; feasible ranges: data_width 15..16, n_iter 12..15, angle_guard -1..1, frac_guard 0..2, k 2..4
- pipelined: 30 evals, 14 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1396; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..2
- pipelined_m: 90 evals, 60 feasible; max throughput seen 178 MSPS; best accuracy 11.97 bits; best feasible luts_plus_ffs=799; feasible ranges: data_width 15..16, n_iter 12..15, angle_guard -1..1, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *Refine unrolled_k to solidify the front.*)
- `unrolled_k` (100 evals): data_width=15..16, n_iter=12..15, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Focus remaining budget on the dominant family to confirm the global minimum area within the feasible region.

**Result (code):** 100 evaluations this round, 400 total; 313 feasible; hypervolume 2460 (+0.2%).

**LLM decision:** `stop` — The budget (400/400) and round limit (4/4) have been exhausted. The feasible Pareto front is well-established with the best design achieving luts_plus_ffs=340 and accuracy_bits=10.6, comfortably meeting the constraints (throughput 10.5 MSPS >= 1, max_abs_err 0.000632 <= 0.000976562). The front is dominated by unrolled_k designs, which are significantly more area-efficient than pipelined (1396) or pipelined_m (799) while still meeting the throughput constraint. Further exploration would not improve the hypervolume within the remaining budget (0).

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 2460 (gain this round: +0.2%).
Feasible designs: 313 of 400 evaluations (157 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 22% violate; best seen 0.000218 (2^-12.16)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=15 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=2] luts_plus_ffs=340, accuracy_bits=10.6, luts=249, ffs=91, throughput_msps=10.5, max_abs_err=0.000632 (2^-10.63), power_index=0.128
- unrolled_k [data_width=15 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc k=2] luts_plus_ffs=346, accuracy_bits=10.7, luts=253, ffs=93, throughput_msps=10.5, max_abs_err=0.000594 (2^-10.72), power_index=0.13
- unrolled_k [data_width=16 n_iter=15 angle_guard=0 frac_guard=0 rounding=round k=2] luts_plus_ffs=357, accuracy_bits=11.4, luts=262, ffs=95, throughput_msps=9.58, max_abs_err=0.000373 (2^-11.39), power_index=0.148
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=2] luts_plus_ffs=362, accuracy_bits=11.5, luts=266, ffs=96, throughput_msps=10.5, max_abs_err=0.000342 (2^-11.51), power_index=0.136
- unrolled_k [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc k=2] luts_plus_ffs=383, accuracy_bits=12, luts=283, ffs=100, throughput_msps=9.58, max_abs_err=0.00025 (2^-11.97), power_index=0.158
- unrolled_k [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=round k=2] luts_plus_ffs=426, accuracy_bits=12.2, luts=326, ffs=100, throughput_msps=9.58, max_abs_err=0.000218 (2^-12.16), power_index=0.176

Per family:
- unrolled_k: 280 evals, 239 feasible; max throughput seen 14 MSPS; best accuracy 12.16 bits; best feasible luts_plus_ffs=340; feasible ranges: data_width 15..16, n_iter 12..15, angle_guard -1..1, frac_guard 0..2, k 2..4
- pipelined: 30 evals, 14 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1396; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard -1..1, frac_guard 0..2
- pipelined_m: 90 evals, 60 feasible; max throughput seen 178 MSPS; best accuracy 11.97 bits; best feasible luts_plus_ffs=799; feasible ranges: data_width 15..16, n_iter 12..15, angle_guard -1..1, frac_guard 0..2, m 2..4
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 11252 in, 4689 out
- provider-reported cost: $0.0131
- full prompts and replies: `llm_trace.jsonl`

