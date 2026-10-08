# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
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
`pipelined_m:data_width=26,n_iter=22,angle_guard=2,frac_guard=1,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1953 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 589 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 86 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 86 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 8 | exact: schedule |
| latency_ns | 93 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.78 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.61e-07 (2^-20.32) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 12.8 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.1e-07 (2^-22.18) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.52 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=2,frac_guard=1,rounding=trunc,m=4` | 1953 | 589 | 86.0 | 8 | 4.78 | 7.61e-07 (2^-20.32) | 20.32 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >= 50 MSPS throughput and max_abs_err <= 2^-20. The pipelined and pipelined_m families are the primary candidates because they provide 1 result/cycle, making it feasible to reach 50 MSPS at a reasonable Fmax (e.g., 50-100 MHz). The iterative family is excluded because its 1 result every N+3 cycles throughput is too low to meet 50 MSPS without unrealistic Fmax. The unrolled_k family is included with a small budget share to verify if high-k configurations can meet the throughput constraint, but it is unlikely to be competitive. The accuracy constraint (max_abs_err <= 2^-20) requires sufficient data_width and n_iter; we set ranges to W=22-26 and N=22-28 to ensure accuracy while allowing the optimizer to find the minimum area. angle_guard and frac_guard are kept low (0-2) to minimize area, as the base accuracy should suffice. The budget is allocated 45% to pipelined, 35% to pipelined_m, and 20% to unrolled_k, reflecting the likelihood of each family meeting the constraints and offering competitive area/power trade-offs.*)
- `pipelined` (45 evals): data_width=22..26, n_iter=22..28, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined is the only family that can plausibly meet the >= 50 MSPS throughput constraint with a reasonable Fmax, as it provides 1 result/cycle. The iterative and unrolled_k families have throughput < 1 result/cycle, making it extremely difficult to reach 50 MSPS without pushing Fmax to unrealistic levels. We focus on data_width 22-26 and n_iter 22-28 to satisfy the max_abs_err <= 2^-20 constraint while keeping area manageable. angle_guard and frac_guard are kept low to minimize area, as the base accuracy from W and N should suffice.
- `pipelined_m` (35 evals): data_width=22..26, n_iter=22..28, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Pipelined_m also provides 1 result/cycle throughput, satisfying the 50 MSPS constraint. By registering every m stages, it can reduce area (fewer FFs) and potentially improve Fmax compared to fully pipelined, at the cost of higher latency (which is not a constraint here). This family offers a direct trade-off space for area vs power/Fmax that is relevant to the objectives. We search m from 2 to 8 to explore the full range of pipeline depth trade-offs.
- `unrolled_k` (20 evals): data_width=22..26, n_iter=22..28, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Unrolled_k with high k (4-8) can approach 1 result/cycle throughput (e.g., k=8, N=24 gives 3 cycles/result, so ~0.33 results/cycle; this is still below 1, so it likely cannot meet 50 MSPS unless Fmax is very high). However, it is included with a smaller budget share to check if any configuration with very high Fmax and high k can meet the throughput constraint. If it cannot, the optimizer will quickly discard these points, and the budget is not wasted. The high k range is chosen to maximize throughput per cycle.

**Result (code):** 100 evaluations this round, 100 total; 46 feasible; hypervolume 8.307e+04 (n/a).

**LLM decision:** `refine` — The current front is dominated by a single `pipelined_m` design (2542 area). `pipelined` is significantly worse (3839 area) due to full register overhead. `unrolled_k` is infeasible for throughput (max 5.89 MSPS). `iterative` is also infeasible for throughput (max ~100 MSPS at 100MHz, but typically lower Fmax for wide data, and 1 result/cycle means throughput = Fmax, which is likely < 50 MSPS for W=26). The key to improving area is reducing `data_width` and `n_iter` while maintaining accuracy. The current best uses W=26, N=22. We should aggressively search for lower W and N combinations in `pipelined_m` and `pipelined` that still meet the 2^-20 error constraint. The error constraint is tight, so we need to ensure `n_iter` and `data_width` are sufficient. We will focus on `pipelined_m` with m=2..4 (to balance area and latency/throughput) and `pipelined` with lower W/N to see if we can beat 2542.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.307e+04 (gain this round: n/a (first round)).
Feasible designs: 46 of 100 evaluations (30 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 23% violate; best seen 264
- max_abs_err <= 9.53674e-07: 41% violate; best seen 2.45e-07 (2^-21.96)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=2542, power_index=4.78, luts=1953, ffs=589, throughput_msps=86, max_abs_err=7.61e-07 (2^-20.32)

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.89 MSPS; best accuracy 21.72 bits
- pipelined: 45 evals, 23 feasible; max throughput seen 264 MSPS; best accuracy 21.96 bits; best feasible luts_plus_ffs=3839; feasible ranges: data_width 24..26, n_iter 22..28, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 35 evals, 23 feasible; max throughput seen 158 MSPS; best accuracy 21.72 bits; best feasible luts_plus_ffs=2542; feasible ranges: data_width 26..26, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the most promising family (pipelined_m) and the next best (pipelined) with tighter ranges to find the minimum area design that meets the strict accuracy and throughput constraints.*)
- `pipelined_m` (60 evals): data_width=24..26, n_iter=20..24, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Current best is here. Narrowing W and N to find the minimum area design that meets accuracy. m=2..4 balances area and throughput.
- `pipelined` (40 evals): data_width=24..26, n_iter=20..24, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Check if a fully pipelined design with lower W/N can beat the pipelined_m area, though it is unlikely due to register overhead.

**Result (code):** 100 evaluations this round, 200 total; 85 feasible; hypervolume 8.307e+04 (+0.0%).

**LLM decision:** `refine` — The current Pareto front contains only one design (pipelined_m, 2542 luts_plus_ffs, 4.78 power_index). The `pipelined_m` family is clearly superior to `pipelined` (best area 2542 vs 3839) and `unrolled_k` (infeasible for throughput). The feasible region for `pipelined_m` is tightly clustered around data_width=25-26, n_iter=22-28, angle_guard=0-2, frac_guard=0-2, and m=2-7. Since we have 200 evaluations remaining, we should focus the search exclusively on `pipelined_m` with these narrowed ranges to maximize the density of evaluations in the promising region and potentially find a design with lower area or power. `iterative` is not viable for the 50 MSPS throughput constraint given its 1 result/cycle latency and typical Fmax limitations compared to the pipelined variants which already achieve 86-158 MSPS.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.307e+04 (gain this round: +0.0%).
Feasible designs: 85 of 200 evaluations (52 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 12% violate; best seen 264
- max_abs_err <= 9.53674e-07: 51% violate; best seen 2.45e-07 (2^-21.96)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=1 rounding=trunc m=4] luts_plus_ffs=2542, power_index=4.78, luts=1953, ffs=589, throughput_msps=86, max_abs_err=7.61e-07 (2^-20.32)

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.89 MSPS; best accuracy 21.72 bits
- pipelined: 85 evals, 27 feasible; max throughput seen 264 MSPS; best accuracy 21.96 bits; best feasible luts_plus_ffs=3839; feasible ranges: data_width 24..26, n_iter 22..28, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 95 evals, 58 feasible; max throughput seen 158 MSPS; best accuracy 21.72 bits; best feasible luts_plus_ffs=2542; feasible ranges: data_width 25..26, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 6078 in, 2826 out
- provider-reported cost: $0.0064
- full prompts and replies: `llm_trace.jsonl`

