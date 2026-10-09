# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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

- `throughput_msps >= 400`: met by 0/100 evaluations; best value seen 282
- `max_abs_err <= 0.000244141`: met by 21/100 evaluations; best value seen 8.99e-05 (2^-13.44)
- best throughput seen 281.9 MSPS (estimate); best accuracy 13.44 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraint is 400 MSPS of single-lane throughput, which requires 1 result/cycle at Fmax >= 400 MHz, so only the pipelined and pipelined_m families can plausibly satisfy it. Iterative and unrolled_k deliver one result every several cycles and would need an unrealistic clock, so unrolled_k is omitted and iterative gets only a small probe. Accuracy of 2^-12 needs roughly 12+ output bits with a few guard bits and about 12-14 iterations. The ranges therefore focus on data_width 12-18 and n_iter 10-16. If round 1 shows no design reaching 400 MSPS, the spec is infeasible and I will report that rather than settle for a design that violates the constraints.*)
- `pipelined` (51 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle, so throughput equals Fmax. The 400 MSPS constraint depends on whether Fmax reaches 400 MHz, and the pipelined family has the shortest stage depth. Ranges cover widths near the 2^-12 error target (about 12-bit accuracy) with modest guard bits to minimise LUTs.
- `pipelined_m` (37 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages saves FFs, which lowers area, but may cut Fmax. Small m keeps the clock plausibly near 400 MHz, so this family is worth testing against the constraint.
- `iterative` (12 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Iterative designs deliver less than 1 result/cycle, so reaching 400 MSPS is almost certainly impossible. This small probe confirms infeasibility before the budget is committed elsewhere.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput >= 400 MSPS constraint is unreachable. All 100 evaluations violate it, and the best value seen anywhere is 282 MSPS, from the pipelined family. That family gives one result per cycle with a register on every stage, so it is the best a family can do on throughput. The designs that meet the accuracy limit sit at 264-273 MSPS, which is a 32-34% shortfall. pipelined_m peaked at 178 MSPS, since fewer registers lower Fmax. iterative peaked at 15.6 MSPS. unrolled_k is unexplored, but it still produces less than one result per cycle, so its throughput is below its own Fmax, which is already capped near 282 MHz for this datapath. Narrowing the width to raise Fmax would break the accuracy limit of 2^-12, which already needs roughly 15-17 bit data widths and 14-15 iterations. A further 42% gain over the best Fmax is not plausible from parameter tuning, so spending more budget would not produce a feasible design.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: iterative, pipelined, pipelined_m. Not yet explored: unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 79% violate; best seen 8.99e-05 (2^-13.44)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000192 (2^-12.35); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=15 n_iter=15 angle_guard=3 frac_guard=3 rounding=round]: throughput=273, max_abs_err=0.000188 (2^-12.38); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000158 (2^-12.63); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=15 n_iter=14 angle_guard=3 frac_guard=3 rounding=round]: throughput=273, max_abs_err=0.000215 (2^-12.18); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=15 angle_guard=3 frac_guard=1 rounding=round]: throughput=264, max_abs_err=0.000124 (2^-12.98); throughput_msps >= 400 violated by 33.9%

Per family:
- iterative: 12 evals, 0 feasible; max throughput seen 15.6 MSPS; best accuracy 10.50 bits
- pipelined: 51 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 13.44 bits
- pipelined_m: 37 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 12.74 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7833 in, 1981 out
- provider-reported cost: $0.0355
- full prompts and replies: `llm_trace.jsonl`

