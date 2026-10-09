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

- `throughput_msps >= 400`: met by 0/100 evaluations; best value seen 282
- `max_abs_err <= 0.000244141`: met by 60/100 evaluations; best value seen 1.92e-05 (2^-15.67)
- best throughput seen 281.9 MSPS (estimate); best accuracy 15.67 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=400 MSPS single-lane) rules out iterative and unrolled_k, which emit one result every several cycles and cannot reach 400 MSPS on a single lane at realistic Fmax. So I focus the entire budget on the two 1-result/cycle families: pipelined and pipelined_m. The accuracy constraint (max_abs_err <= 2^-12) is met by N~12-18 with W~14-20; I keep angle_guard and frac_guard small to minimise LUTs (the objective) while rounding is left to the search since it affects error at no LUT cost. I split the budget roughly evenly between the two families: pipelined is the baseline 1/cycle design, and pipelined_m is where LUT reduction is most likely (shorter segments, higher Fmax, fewer combinational LUTs) while still satisfying throughput. This covers the main trade-off axis (LUTs vs accuracy/throughput) for the feasible families. If neither family can satisfy both constraints, I will report infeasible rather than accept a violating design.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..18, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, which is mandatory for >=400 MSPS on a single lane (iterative/unrolled_k are structurally too slow). Full pipelining is the cleanest 1/cycle option; N~12-18 with W~14-20 is the region where max_abs_err can reach <=2^-12 while keeping LUTs low. angle_guard/frac_guard kept small to limit LUTs.
- `pipelined_m` (50 evals): data_width=14..20, n_iter=12..18, angle_guard=-1..1, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle, so it can meet the throughput constraint. Registering every m stages trades latency/FFs against LUTs and timing; with m>1 the datapath segments are shorter, which can raise Fmax and lower LUTs at the cost of more FFs. Since the objective is min LUTs and throughput is the binding constraint, pipelined_m is a strong candidate to beat full pipelined on LUTs while still hitting 400 MSPS.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint (>= 400 MSPS) is unreachable by any family in the registry. The pipelined family, which is the only architecture capable of 1 result/cycle, achieved a maximum throughput of 282 MSPS in Round 1. Since the other 100% of evaluations in this family also failed to meet the 400 MSPS target, and the remaining families (iterative, unrolled_k) are inherently slower (producing 1 result every k or N+3 cycles), it is mathematically impossible for them to reach 400 MSPS on a single lane. The best accuracy seen was 15.67 bits, which meets the error constraint, but the throughput ceiling of the fastest available architecture (282 MSPS) is well below the 400 MSPS requirement.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 40% violate; best seen 1.92e-05 (2^-15.67)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=18 n_iter=18 angle_guard=-1 frac_guard=0 rounding=trunc]: throughput=273, max_abs_err=0.00021 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000186 (2^-12.39); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000237 (2^-12.04); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=17 angle_guard=-1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000186 (2^-12.39); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=264, max_abs_err=4.33e-05 (2^-14.50); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 50 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 14.93 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.67 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 4378 in, 1063 out
- provider-reported cost: $0.0043
- full prompts and replies: `llm_trace.jsonl`

