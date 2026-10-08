# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
- `max_abs_err <= 0.000244141`: met by 46/100 evaluations; best value seen 5.03e-05 (2^-14.28)
- best throughput seen 272.9 MSPS (estimate); best accuracy 14.28 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraints are throughput >= 400 MSPS and max error <= 2^-12. Only pipelined and pipelined_m can plausibly deliver one result per cycle at a 400 MHz clock; iterative is excluded because it needs N+3 cycles per result. The accuracy limit needs about 13+ bits of width with roughly 12-16 iterations and some guard bits, so ranges are narrowed to that region to focus the budget on minimal-LUT feasible designs. Most of the budget goes to the two pipelined families and a small probe goes to unrolled_k. If round 1 shows no design meets 400 MSPS together with the error bound, I will declare the spec infeasible instead of relaxing a constraint.*)
- `pipelined` (55 evals): data_width=13..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Pipelined produces 1 result/cycle, so 400 MSPS needs only Fmax >= 400 MHz. Fully registered stages are the most likely to reach that clock. Width starts at 13 so the error bound of 2^-12 is reachable (output LSB must be well below 2^-12), and stops at 18 to keep LUTs low.
- `pipelined_m` (36 evals): data_width=13..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages cuts FFs, which may lower the area proxy, but chained stages may drop Fmax below 400 MHz. A small m keeps this feasible and tests the LUT/Fmax tradeoff.
- `unrolled_k` (9 evals): data_width=13..16, n_iter=12..15, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=6..8. *Why:* Even with k=8 and ~15 iterations, this takes about 5 cycles per result, so 400 MSPS looks unreachable. A small probe confirms this and checks whether the family can be excluded.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput >= 400 MSPS constraint is unreachable. 100% of the 100 evaluations violate it, and the best seen is 273 MSPS, from the pipelined family. Pipelined already delivers the maximum of one result per cycle, so throughput equals Fmax. The least-violating designs span data_width 16-17, n_iter 14-16 and different guard bits, yet all sit at the same 273 MSPS. That points to a per-stage Fmax ceiling that these parameters do not move. pipelined_m, which puts more logic between registers, is slower at 171 MSPS. unrolled_k reaches only 9.76 MSPS. iterative issues at most one result per N+3 cycles, so it can only be slower. The accuracy constraint is not the blocker: 46% of designs meet max_abs_err <= 2^-12, and the best reaches 2^-14.28. No family in the registry can combine 400 MSPS with 2^-12 accuracy, and any design that met accuracy would still violate throughput by about 32%. I am therefore not settling for a violating design.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 54% violate; best seen 5.03e-05 (2^-14.28)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000222 (2^-12.13); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000204 (2^-12.26); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000188 (2^-12.38); throughput_msps >= 400 violated by 31.8%

Per family:
- unrolled_k: 9 evals, 0 feasible; max throughput seen 9.76 MSPS; best accuracy 11.08 bits
- pipelined: 55 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 14.28 bits
- pipelined_m: 36 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 12.79 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7516 in, 2078 out
- provider-reported cost: $0.0358
- full prompts and replies: `llm_trace.jsonl`

