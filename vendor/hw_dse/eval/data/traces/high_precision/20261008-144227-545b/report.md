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
`pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=0,rounding=round,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1886 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 400 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.86e-07 (2^-20.28) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.2 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.11e-07 (2^-22.17) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.55 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=0,rounding=round,m=7` | 1886 | 400 | 52.0 | 6 | 4.3 | 7.86e-07 (2^-20.28) | 20.28 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires max_abs_err <= 2^-20 and throughput >= 50 MSPS. Accuracy depends on data_width, n_iter, angle_guard, frac_guard, and rounding. To achieve 2^-20 accuracy, data_width must be at least 22 (since output LSB is 2^-(W-2), so W=22 gives LSB=2^-20) and n_iter must be sufficient (typically N >= 20 for 20-bit accuracy). Pipelined and pipelined_m are the primary candidates because they guarantee 1 result/cycle, making it easy to meet the 50 MSPS throughput constraint with reasonable Fmax. Unrolled_k is a secondary candidate that may offer better area at the cost of higher latency. Iterative is included as a baseline but is unlikely to be competitive due to its long latency. The budget is allocated 40% to pipelined, 30% to pipelined_m, 20% to unrolled_k, and 10% to iterative, reflecting the likelihood of each family meeting the constraints and offering competitive trade-offs.*)
- `pipelined` (40 evals): data_width=22..26, n_iter=20..28, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined is the only family that guarantees 1 result/cycle throughput. To meet >=50 MSPS, Fmax must be >=50 MHz. With N=20-28 stages, the critical path is short per stage, making high Fmax plausible. Data width 22-26 and n_iter 20-28 are needed to achieve max_abs_err <= 2^-20 (9.53674e-07). This family is the primary candidate for meeting both constraints simultaneously.
- `pipelined_m` (30 evals): data_width=22..26, n_iter=20..28, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Pipelined_m also provides 1 result/cycle throughput but with fewer registers (every m stages), potentially reducing FF count and area compared to fully pipelined. The m parameter allows trading off latency for area. Same accuracy constraints apply, so data_width and n_iter ranges match pipelined. This family may offer better area/power trade-offs while maintaining throughput.
- `unrolled_k` (20 evals): data_width=22..26, n_iter=20..28, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Unrolled_k can achieve high throughput if Fmax is high enough. With k=4-8, latency is ceil(N/k)+3 cycles. For N=20-28 and k=4-8, latency is 5-10 cycles. To meet 50 MSPS, Fmax must be >=50*latency/1000 MHz = 0.25-0.5 MHz, which is easily met. However, the critical path includes k micro-rotations, which may limit Fmax. This family has lower area than pipelined (fewer registers) but may have lower Fmax. Worth exploring for area/power trade-offs.
- `iterative` (10 evals): data_width=22..26, n_iter=20..28, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Iterative has the smallest area but produces 1 result every N+3 cycles. For N=20-28, latency is 23-31 cycles. To meet 50 MSPS, Fmax must be >=50*31/1000 = 1.55 MHz minimum, up to 50*23/1000 = 1.15 MHz. This is easily met, but the throughput is limited by the long latency. This family is included as a baseline for area comparison, though it is unlikely to be optimal for the throughput constraint.

**Result (code):** 100 evaluations this round, 100 total; 27 feasible; hypervolume 8.903e+04 (n/a).

**LLM decision:** `refine` — The `pipelined_m` family is the only one yielding a competitive area (2312 vs 4117 for `pipelined`) while meeting the 50 MSPS throughput and 2^-20 accuracy constraints. The current Pareto front has only 1 point, indicating the search space is too broad or the optimizer hasn't converged on the trade-off between `m` (latency/area) and `n_iter` (accuracy). `iterative` and `unrolled_k` are infeasible for throughput. We should focus exclusively on `pipelined_m` and `pipelined` (as a fallback for higher throughput if area allows, though `pipelined_m` is clearly better for area). We will narrow the ranges around the known feasible region: `data_width` 25-26, `n_iter` 22-24 (to minimize area while keeping error < 2^-20), `angle_guard` 0-1, `frac_guard` 0-1, and `m` 4-8 (to explore the area/latency trade-off more densely).

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.903e+04 (gain this round: n/a (first round)).
Feasible designs: 27 of 100 evaluations (23 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 35% violate; best seen 257
- max_abs_err <= 9.53674e-07: 63% violate; best seen 1.81e-07 (2^-22.40)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=2312, power_index=4.35, luts=1908, ffs=404, throughput_msps=59.9, max_abs_err=6.89e-07 (2^-20.47)

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 6.78 MSPS; best accuracy 22.40 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 21.96 bits
- pipelined: 40 evals, 12 feasible; max throughput seen 257 MSPS; best accuracy 21.46 bits; best feasible luts_plus_ffs=4117; feasible ranges: data_width 25..26, n_iter 23..28, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 30 evals, 15 feasible; max throughput seen 158 MSPS; best accuracy 22.40 bits; best feasible luts_plus_ffs=2312; feasible ranges: data_width 25..26, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 6..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus budget on the two feasible families, prioritizing pipelined_m. Narrow parameter ranges to the feasible region identified in Round 1 to maximize the density of evaluations on the Pareto front.*)
- `pipelined_m` (80 evals): data_width=25..26, n_iter=22..24, angle_guard=0..1, frac_guard=0..1, rounding=round, m=4..8. *Why:* Best area/throughput trade-off. Narrowing n_iter and guards reduces area. Expanding m range allows finding the optimal pipeline depth for area minimization.
- `pipelined` (20 evals): data_width=25..26, n_iter=22..24, angle_guard=0..1, frac_guard=0..1, rounding=round. *Why:* Fallback to ensure we capture any potential high-throughput, low-area points that pipelined_m might miss due to its specific latency structure, though pipelined_m is currently superior.

**Result (code):** 100 evaluations this round, 200 total; 91 feasible; hypervolume 8.972e+04 (+0.8%).

**LLM decision:** `refine` — The current Pareto front consists of a single point (pipelined_m, 2286 LUTs+FFs, 4.3 power) which is significantly better than the best pipelined design (3751 LUTs+FFs). The `pipelined_m` family is clearly the dominant architecture for this spec, offering high throughput (52 MSPS) while minimizing area. The previous round explored a broad range (m=4..7, n_iter=22..28). To improve the hypervolume, we need to refine the search around the known optimum to find if a slightly different configuration (e.g., lower `n_iter` with higher `angle_guard`, or different `m`) can reduce area or power further while maintaining the strict accuracy constraint (2^-20). The accuracy constraint is tight (best seen 2^-22.40 vs limit 2^-20), so we have some headroom, but area is the primary objective. We will narrow the ranges to focus the remaining 200 evaluations on the most promising region of `pipelined_m` and a small subset of `pipelined` to ensure no better full-pipeline solution exists.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.78% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.972e+04 (gain this round: +0.8%).
Feasible designs: 91 of 200 evaluations (53 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 20% violate; best seen 257
- max_abs_err <= 9.53674e-07: 48% violate; best seen 1.81e-07 (2^-22.40)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=0 rounding=round m=7] luts_plus_ffs=2286, power_index=4.3, luts=1886, ffs=400, throughput_msps=52, max_abs_err=7.86e-07 (2^-20.28)

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 6.78 MSPS; best accuracy 22.40 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 21.96 bits
- pipelined: 60 evals, 25 feasible; max throughput seen 257 MSPS; best accuracy 21.46 bits; best feasible luts_plus_ffs=3751; feasible ranges: data_width 25..26, n_iter 22..28, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 110 evals, 66 feasible; max throughput seen 158 MSPS; best accuracy 22.40 bits; best feasible luts_plus_ffs=2286; feasible ranges: data_width 25..26, n_iter 22..28, angle_guard 0..2, frac_guard 0..2, m 4..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 5483 in, 3793 out
- provider-reported cost: $0.0091
- full prompts and replies: `llm_trace.jsonl`

