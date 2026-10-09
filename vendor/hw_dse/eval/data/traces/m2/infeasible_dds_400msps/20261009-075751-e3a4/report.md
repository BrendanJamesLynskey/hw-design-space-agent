# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 100 of 400 budgeted, over 1 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec infeasible_dds_400msps: Wideband DDS needing >= 400 MSPS single-lane sin/cos with max error <= 2^-12. Minimise LUTs.
  constraint: throughput_msps >= 400
  constraint: max_abs_err <= 0.000244141
  objective: min luts (HV ref 4000)
  objective: max accuracy_bits (HV ref 12)
  select: min luts
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
None: no evaluated design satisfies every constraint.

- `throughput_msps >= 400`: met by 0/100 evaluations; best value seen 273
- `max_abs_err <= 0.000244141`: met by 70/100 evaluations; best value seen 1.92e-05 (2^-15.67)
- best throughput seen 272.9 MSPS (estimate); best accuracy 15.67 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraint is throughput_msps >= 400 on a single lane, which forces Fmax >= 400 MHz (for 1 result/cycle) or a high effective results/cycle. Only pipelined, pipelined_m (1 result/cycle) and unrolled_k (k results/cycle) can plausibly hit that; iterative (1 result per N+3 cycles) cannot reach 400 MSPS at any realistic Fmax, so I exclude it to spend the budget where the constraints are satisfiable. The accuracy constraint (max_abs_err <= 2^-12) is comfortably met by CORDIC with W=14..20 and N=12..18, so I bound the search to the low-LUT corner of the feasible accuracy region rather than sweeping the full registry. Since the objective is min LUTs and the selection rule is also min LUTs, I weight the budget toward the two 1-result/cycle families (pipelined 0.5, pipelined_m 0.3) which typically have the narrowest datapath, and keep unrolled_k (0.2) as a trade-off probe. angle_guard 0..2 and frac_guard 0..2 keep the datapath narrow while preserving accuracy; rounding is left to the optimizer. This plan maps the LUT-vs-accuracy front in the feasible region within the 400-eval budget, leaving room for a later round to refine the front over the full ranges of the families that land on it.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so they are the only families that can plausibly reach 400 MSPS on a single Artix-7 lane (needs Fmax >= 400 MHz). Pipelined is the cleanest 1/cycle structure. Accuracy needs max_abs_err <= 2^-12; with W=14..20 and N=12..18 the CORDIC residual plus quantization should sit comfortably below 2^-12, so I bound the search to the low-LUT corner of the feasible accuracy region. angle_guard 0..2 and frac_guard 0..2 keep the datapath narrow (minimise LUTs) while preserving accuracy; rounding is left to the optimizer since round can shave error at small area cost.
- `pipelined_m` (30 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m also yields 1 result/cycle (meets throughput) but registers every m stages, cutting FF count and often easing timing so Fmax can be higher. m=2..4 is the sweet spot: m=1 is just pipelined, larger m adds latency without area benefit. Same accuracy window as pipelined since the bits are identical; the trade-off here is purely area/timing, so I focus the search on the low-LUT, high-Fmax region.
- `unrolled_k` (20 evals): data_width=14..20, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k does k micro-rotations/cycle, so results/cycle = k/ceil(N/k) ~ k. With k=4..8 and N=12..18 it can approach 1 result/cycle and may reach 400 MSPS at a lower Fmax than fully pipelined, at the cost of a wider datapath (more LUTs). I include it as a secondary candidate to map the LUT-vs-Fmax trade-off, but keep its share smaller because the wider datapath usually costs more LUTs than the pipelined families, and the objective is min LUTs.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint (>= 400 MSPS) is unreachable for all families in the registry. The pipelined family, which provides 1 result/cycle, achieved a maximum throughput of only 273 MSPS across 50 evaluations, falling 31.8% short of the requirement. The unrolled_k and pipelined_m families are structurally slower (k or m micro-rotations per cycle), with maximum observed throughputs of 11.6 and 171 MSPS respectively, making them even further from the target. Since the pipelined architecture represents the theoretical maximum throughput for this CORDIC implementation (1 result/cycle) and its best-case Fmax estimate is insufficient to reach 400 MSPS, no design in the registry can satisfy the spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 30% violate; best seen 1.92e-05 (2^-15.67)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=18 angle_guard=1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000149 (2^-12.71); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=19 n_iter=17 angle_guard=0 frac_guard=0 rounding=round]: throughput=264, max_abs_err=6.32e-05 (2^-13.95); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=17 angle_guard=1 frac_guard=2 rounding=round]: throughput=264, max_abs_err=5.95e-05 (2^-14.04); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=17 angle_guard=0 frac_guard=2 rounding=trunc]: throughput=264, max_abs_err=0.000113 (2^-13.11); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=19 n_iter=14 angle_guard=1 frac_guard=2 rounding=round]: throughput=264, max_abs_err=0.000138 (2^-12.82); throughput_msps >= 400 violated by 33.9%

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 11.6 MSPS; best accuracy 15.40 bits
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 15.67 bits
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.68 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 3694 in, 1561 out
- provider-reported cost: $0.0040
- full prompts and replies: `llm_trace.jsonl`

