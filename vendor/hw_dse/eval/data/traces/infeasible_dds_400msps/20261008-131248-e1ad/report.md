# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 100 of 400 budgeted, over 1 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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
- `max_abs_err <= 0.000244141`: met by 56/100 evaluations; best value seen 1.31e-05 (2^-16.22)
- best throughput seen 272.9 MSPS (estimate); best accuracy 16.22 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=400 MSPS) is the binding one. iterative and unrolled_k produce one result every N+3 or ceil(N/k)+3 cycles, so meeting 400 MSPS would require fmax of many GHz (e.g. unrolled_k with N=4,k=8 still needs 4 cycles/result -> 1600 MHz), which is not achievable on Artix-7; they are excluded from round 1 rather than wasting budget. Only the pipelined families give 1 result/cycle, so throughput_msps = fmax_mhz and the problem becomes: close 400 MHz while keeping max_abs_err <= 2^-12 and minimising LUTs. Round 1 therefore searches pipelined (best timing, most likely feasible) and pipelined_m with small m (area reduction at some timing risk). Accuracy depends only on data_width, n_iter, angle_guard, frac_guard, rounding, so those ranges are shared and centred where 2^-12 is reachable; the search will reveal the true LUT/accuracy trade-off. Budget is split 60/40 toward the family most likely to be feasible, with the remainder probing the lower-area corner.*)
- `pipelined` (60 evals): data_width=12..20, n_iter=8..20, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only a fully pipelined datapath (1 result/cycle) can plausibly reach 400 MSPS: throughput_msps equals fmax_mhz, so the whole constraint reduces to closing timing at 400 MHz. One registered micro-rotation per stage keeps the combinational path short, which is the best chance of high fmax. data_width 12..20 spans the accuracy requirement (need >= ~2^-12) up to comfortable margin; n_iter 8..20 covers the rotation-count range where 2^-12 is reachable without wasting area; angle_guard/frac_guard 0..4 let the search trade guard bits for error; rounding both because round can buy accuracy at no LUT cost. This family carries the largest share because it is the most likely to be feasible and to define the low-LUT end of the front.
- `pipelined_m` (40 evals): data_width=12..20, n_iter=8..20, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* Same 1 result/cycle throughput as pipelined, but registering every m stages cuts FF count at the cost of a longer combinational path (lower fmax). m is capped at 4 because larger m almost certainly cannot close 400 MHz; m=2..4 probes whether a slightly coarser pipeline still meets timing while reducing area, which is exactly the LUT/FF trade-off the objective cares about. Accuracy parameters are identical to pipelined (same bit-accurate datapath), so this family explores the area side of the Pareto front rather than the accuracy side.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The binding constraint is throughput_msps >= 400, and it is architecturally unreachable in this registry. Throughput = Fmax x results/cycle, and the maximum results/cycle available is 1 (pipelined and pipelined_m). The pipelined family is therefore the highest-throughput family possible, yet across 60 evaluations it topped out at 273 MSPS (best of any design seen), i.e. ~32% short of 400. pipelined_m, the only other 1-result/cycle family, reached only 171 MSPS. The remaining unexplored families (iterative: N+3 cycles/result; unrolled_k: ceil(N/k)+3 cycles/result) all emit strictly fewer than one result per cycle, so for any achievable Fmax their throughput is strictly below the pipelined ceiling of 273 MSPS. No amount of re-parameterisation can lift a <1-result/cycle family above a 1-result/cycle family at the same clock, and the clock itself is already capped near 273 MHz by the cost model. The accuracy constraint is not the blocker: 56% of designs already meet max_abs_err <= 2^-12 (best 2^-16.22), so the failure is purely the throughput floor. Since the spec demands single-lane >= 400 MSPS and no family in the registry can supply it, the spec is infeasible; spending the remaining 300 evaluations on iterative/unrolled_k cannot change this and would only confirm a strictly lower throughput ceiling.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 44% violate; best seen 1.31e-05 (2^-16.22)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=18 n_iter=19 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=3.99e-05 (2^-14.61); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=19 n_iter=15 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=0.000102 (2^-13.26); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=4 rounding=round]: throughput=264, max_abs_err=5.86e-05 (2^-14.06); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=17 angle_guard=3 frac_guard=4 rounding=trunc]: throughput=264, max_abs_err=7.04e-05 (2^-13.79); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=19 angle_guard=0 frac_guard=2 rounding=round]: throughput=264, max_abs_err=0.000102 (2^-13.25); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 60 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 15.54 bits
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.22 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 3371 in, 3280 out
- provider-reported cost: $0.0042
- full prompts and replies: `llm_trace.jsonl`

