# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 300 of 400 budgeted, over 3 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec high_precision: Coherent demodulator for a precision instrument: max error <= 2^-20 at >= 50 MSPS. Minimise area (LUTs + FFs) and the relative power index.
  constraint: throughput_msps >= 50
  constraint: max_abs_err <= 9.53674e-07
  objective: min luts_plus_ffs (HV ref 8000)
  objective: min power_index (HV ref 20)
  select: min luts_plus_ffs
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=0,rounding=round,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1886 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 573 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 86 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 86 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 8 | exact: schedule |
| latency_ns | 93 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.63 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.86e-07 (2^-20.28) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.2 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.11e-07 (2^-22.17) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.55 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=0,rounding=round,m=4` | 1886 | 573 | 86.0 | 8 | 4.63 | 7.86e-07 (2^-20.28) | 20.28 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires high precision (2^-20 error) and high throughput (>=50 MSPS). Pipelined and pipelined_m are the most reliable for throughput, so they get the largest budget shares. Unrolled_k is included as a secondary option since it can also meet throughput with potentially different area characteristics. Iterative is excluded because its 1 result every N+3 cycles makes it very hard to reach 50 MSPS without extremely high Fmax, which is unlikely. Data width is set to 22-28 to ensure accuracy, n_iter 20-30 for sufficient precision, and guards are kept modest to control area.*)
- `pipelined` (45 evals): data_width=22..28, n_iter=20..30, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined is the only family that guarantees 1 result/cycle, making it the safest bet for the >=50 MSPS throughput constraint. It allows us to explore the trade-off between area (LUTs+FFs) and power while strictly meeting the accuracy requirement (2^-20) by adjusting data_width and n_iter.
- `pipelined_m` (35 evals): data_width=22..28, n_iter=20..30, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Pipelined_m offers a potential area/power advantage over fully pipelined by reducing the number of pipeline registers (FFs) while maintaining 1 result/cycle throughput. This is a key trade-off space for minimizing luts_plus_ffs and power_index.
- `unrolled_k` (20 evals): data_width=22..28, n_iter=20..30, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Unrolled_k can achieve high throughput (1 result every ceil(N/k)+3 cycles) with potentially lower area than pipelined designs if k is large enough. With k=8 and N=30, latency is ~7 cycles, which at high Fmax could meet 50 MSPS. This family explores a different area/throughput trade-off.

**Result (code):** 100 evaluations this round, 100 total; 49 feasible; hypervolume 8.062e+04 (n/a).

**LLM decision:** `refine` — The `iterative` and `unrolled_k` families are effectively ruled out for this spec: `unrolled_k` maxed out at 6.34 MSPS (far below the 50 MSPS constraint), and `iterative` would be even slower (1 result per N+3 cycles). The feasible region is confined to `pipelined` and `pipelined_m`. 

Current best is `pipelined_m` (2639 LUTs+FFs, 4.96 power) vs `pipelined` (3879 LUTs+FFs). `pipelined_m` is superior in area and likely power due to reduced register count, while still meeting throughput (86 MSPS > 50 MSPS). 

To improve the hypervolume, we need to push the Pareto front towards lower area/power. The current feasible ranges for `pipelined_m` are data_width 25..28, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 2..4. 

1. **data_width**: The best design uses 27. We know accuracy is tight (need <= 2^-20). Lowering data_width to 25 or 26 might save area but risks accuracy. We should focus the search on 26..27 to see if 26 can meet accuracy with optimal n_iter/guards, or if 27 is the minimum. 
2. **n_iter**: Best is 23. Higher n_iter increases accuracy but also area/latency. Lower n_iter (22) might be feasible if guards are increased, but guards increase area too. We should narrow n_iter to 22..24 to find the sweet spot. 
3. **angle_guard/frac_guard**: Best uses angle_guard=1, frac_guard=0. These add area. We should explore if angle_guard=0 is feasible with n_iter=23/24, or if frac_guard=1 allows lower n_iter. 
4. **m**: Best is m=4. m=2 or 3 might offer better Fmax (higher throughput) or different area/power trade-offs. We should keep m in 2..4. 

We will refine the `pipelined_m` search to focus on the most promising corner: data_width 26..27, n_iter 22..24, angle_guard 0..1, frac_guard 0..1, m 2..4. We will also keep a small portion of the budget for `pipelined` to ensure we haven't missed a better area/power trade-off there, but `pipelined_m` is clearly the leader. 

Actually, looking at the budget: 100 evals left per round, 3 rounds left. We have 300 evals remaining. 

Let's refine `pipelined_m` heavily and drop `pipelined` if it's not competitive. The best `pipelined` is 3879, best `pipelined_m` is 2639. `pipelined_m` is 32% smaller. It is unlikely `pipelined` will beat this. I will focus 90% of the next round on `pipelined_m` and 10% on `pipelined` just to be safe, or perhaps just `pipelined_m` if I'm confident. Given the strict area objective, `pipelined_m` is the clear winner. I will allocate all next round to `pipelined_m` with narrowed ranges.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.062e+04 (gain this round: n/a (first round)).
Feasible designs: 49 of 100 evaluations (46 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 20% violate; best seen 264
- max_abs_err <= 9.53674e-07: 41% violate; best seen 7.93e-08 (2^-23.59)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=23 angle_guard=1 frac_guard=0 rounding=trunc m=4] luts_plus_ffs=2639, power_index=4.96, luts=2045, ffs=593, throughput_msps=86, max_abs_err=5.21e-07 (2^-20.87)

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 21.67 bits
- pipelined: 45 evals, 25 feasible; max throughput seen 264 MSPS; best accuracy 23.51 bits; best feasible luts_plus_ffs=3879; feasible ranges: data_width 25..28, n_iter 23..30, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 35 evals, 24 feasible; max throughput seen 158 MSPS; best accuracy 23.59 bits; best feasible luts_plus_ffs=2639; feasible ranges: data_width 25..28, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate all remaining budget on the `pipelined_m` family which has already demonstrated superior area efficiency (2639 vs 3879) compared to `pipelined`. The narrowed ranges target the specific region where the current best design (27-bit, 23-iter, ag=1, fg=0, m=4) resides, allowing Optuna to explore adjacent points (e.g., 26-bit, 22-iter, ag=0) that might offer further area/power reductions while maintaining the strict accuracy and throughput constraints.*)
- `pipelined_m` (100 evals): data_width=26..27, n_iter=22..24, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, m=2..4. *Why:* Focus on the best-performing family. Narrow data_width to 26-27 to test if 26-bit precision is sufficient (saving area). Narrow n_iter to 22-24 to find the minimum iterations needed for 2^-20 error. Narrow guards to 0-1 to minimize area overhead. Keep m 2-4 to explore latency/throughput/area trade-offs.

**Result (code):** 100 evaluations this round, 200 total; 140 feasible; hypervolume 8.519e+04 (+5.7%).

**LLM decision:** `refine` — The current Pareto front is dominated by a single `pipelined_m` design (2459 LUTs+FFs, 4.63 power). The `pipelined` family has a higher best feasible area (3879) and is thus dominated. The `unrolled_k` family is infeasible for throughput (max 6.34 MSPS < 50). The `iterative` family is also infeasible for throughput (1 result per N+3 cycles, max ~20-30 MSPS at high Fmax, likely < 50 MSPS). Therefore, we should focus exclusively on `pipelined_m`. The current feasible region for `pipelined_m` is data_width 25..28, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 2..4. To minimize area and power, we should narrow the search to the most efficient configurations. `m=4` yielded the best design, so we should focus on `m=4` and potentially `m=3`. We should also narrow `data_width` to 25..26 (since 26 was best and 25 might be feasible with higher n_iter) and `n_iter` to 22..24 (since 22 was best and higher n_iter increases area). `angle_guard` and `frac_guard` should be kept low (0..1) to minimize area, as the accuracy constraint (2^-20) is met with margin at these settings.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.519e+04 (gain this round: +5.7%).
Feasible designs: 140 of 200 evaluations (95 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 10% violate; best seen 264
- max_abs_err <= 9.53674e-07: 25% violate; best seen 7.93e-08 (2^-23.59)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=2459, power_index=4.63, luts=1886, ffs=573, throughput_msps=86, max_abs_err=7.86e-07 (2^-20.28)

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 21.67 bits
- pipelined: 45 evals, 25 feasible; max throughput seen 264 MSPS; best accuracy 23.51 bits; best feasible luts_plus_ffs=3879; feasible ranges: data_width 25..28, n_iter 23..30, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 135 evals, 115 feasible; max throughput seen 158 MSPS; best accuracy 23.59 bits; best feasible luts_plus_ffs=2459; feasible ranges: data_width 25..28, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Narrowing the search space to the most promising `pipelined_m` configurations to maximize hypervolume gain within the remaining budget.*)
- `pipelined_m` (100 evals): data_width=25..26, n_iter=22..24, angle_guard=0..1, frac_guard=0..1, rounding=round, m=3..4. *Why:* Focus on the most efficient `pipelined_m` configurations that met the constraints in Round 2, narrowing ranges to reduce area and power.

**Result (code):** 100 evaluations this round, 300 total; 200 feasible; hypervolume 8.519e+04 (+0.0%).

**LLM decision:** `refine` — The `pipelined_m` family is the clear winner, with a best feasible area of 2459 LUTs+FFs, significantly better than `pipelined` (3879). The `unrolled_k` family is infeasible for throughput (max 6.34 MSPS). The current front is a single point, and the hypervolume gain was 0% in the last round, suggesting the search has converged to a local optimum or the ranges are too broad. We have 100 evaluations left. We should aggressively refine the `pipelined_m` search space around the current best (data_width=26, n_iter=22, m=4) to see if we can squeeze out more area savings or power improvements, and also check the `pipelined` family in a tighter box to ensure we haven't missed a better trade-off. The `iterative` family is likely too slow for the 50 MSPS constraint given the `unrolled_k` results, so we will ignore it.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 8.519e+04 (gain this round: +0.0%).
Feasible designs: 200 of 300 evaluations (106 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 7% violate; best seen 264
- max_abs_err <= 9.53674e-07: 30% violate; best seen 7.93e-08 (2^-23.59)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=0 rounding=round m=4] luts_plus_ffs=2459, power_index=4.63, luts=1886, ffs=573, throughput_msps=86, max_abs_err=7.86e-07 (2^-20.28)

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 21.67 bits
- pipelined: 45 evals, 25 feasible; max throughput seen 264 MSPS; best accuracy 23.51 bits; best feasible luts_plus_ffs=3879; feasible ranges: data_width 25..28, n_iter 23..30, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 235 evals, 175 feasible; max throughput seen 158 MSPS; best accuracy 23.59 bits; best feasible luts_plus_ffs=2459; feasible ranges: data_width 25..28, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 8084 in, 4232 out
- provider-reported cost: $0.0124
- full prompts and replies: `llm_trace.jsonl`

