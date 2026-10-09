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
- `max_abs_err <= 0.000244141`: met by 36/100 evaluations; best value seen 8.26e-05 (2^-13.56)
- best throughput seen 281.9 MSPS (estimate); best accuracy 13.56 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS single-lane requirement means one result per cycle at Fmax of at least 400 MHz, so pipelined and pipelined_m are the only plausible families. Max error of 2^-12 needs roughly 12-14 output bits and 12-14 iterations, so ranges concentrate there with some headroom. Most of the budget goes to the pipelined families to see whether any design meets 400 MSPS at all. A small iterative probe checks that the multi-cycle families are infeasible. If no design passes both constraints after this round, I will consider declaring infeasible.*)
- `pipelined` (51 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Pipelined gives 1 result/cycle, so throughput equals Fmax. Fully registered stages are the most likely way to reach 400 MSPS. Ranges target about 12+ bits of accuracy at the lowest width and iteration count.
- `pipelined_m` (37 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages saves flip-flops and may cut LUTs, but long combinational paths between registers could still allow 400 MHz. Small m keeps that plausible.
- `iterative` (12 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Small probe to confirm that multi-cycle designs cannot reach 400 MSPS. It produces a result every N+3 cycles, so the throughput constraint should rule it out, which supports an infeasibility call if nothing else passes.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The 400 MSPS constraint is unreachable. All 100 evaluations violate it, and the best throughput seen is 282 MSPS. That figure comes from the pipelined family, which already delivers the maximum of one result per cycle, so throughput there equals Fmax. Pipelined throughput falls slowly as width grows (273 MSPS at W=17, 264 at W=18). The 282 MSPS best was found across 51 evaluations spanning the width range. Reaching 400 MSPS would need a much faster Fmax than any width produced, and the accuracy limit of 2^-12 already forces W of roughly 14 or more. pipelined_m adds logic between registers and peaked at 178 MSPS. iterative peaked at 15.3 MSPS. unrolled_k yields fewer than one result per cycle (ceil(N/k)+3 cycles each), so its throughput is below Fmax and cannot exceed pipelined. No family in the registry can meet both constraints, so spending the remaining budget would not produce a feasible design.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: iterative, pipelined, pipelined_m. Not yet explored: unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 64% violate; best seen 8.26e-05 (2^-13.56)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000188 (2^-12.38); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000214 (2^-12.19); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=0.000127 (2^-12.95); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=3 rounding=round]: throughput=264, max_abs_err=8.94e-05 (2^-13.45); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=14 angle_guard=2 frac_guard=0 rounding=round]: throughput=264, max_abs_err=0.00017 (2^-12.53); throughput_msps >= 400 violated by 33.9%

Per family:
- iterative: 12 evals, 0 feasible; max throughput seen 15.3 MSPS; best accuracy 11.09 bits
- pipelined: 51 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 13.56 bits
- pipelined_m: 37 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 12.86 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7839 in, 2020 out
- provider-reported cost: $0.0359
- full prompts and replies: `llm_trace.jsonl`

