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
- `max_abs_err <= 0.000244141`: met by 63/100 evaluations; best value seen 3.11e-05 (2^-14.97)
- best throughput seen 272.9 MSPS (estimate); best accuracy 14.97 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint of 400 MSPS means one result per cycle is needed unless Fmax is very high. Iterative and unrolled_k deliver at most Fmax/(ceil(N/k)+3) results per cycle-group, which is far below 400 MSPS, so I exclude them from round 1. An error of 2^-12 needs roughly 13 or more bits of output width plus guard bits and about 12 or more iterations. Narrow ranges around these values concentrate the budget on the feasible region and on minimising LUTs. If round 1 shows that no design reaches 400 MSPS at the required accuracy, I will report infeasibility rather than relax the constraints.*)
- `pipelined` (50 evals): data_width=13..18, n_iter=12..18, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle, so throughput equals Fmax. Only this family and pipelined_m can plausibly reach 400 MSPS single-lane. Pipelined has the highest Fmax but the most registers and LUTs. Ranges are narrowed to the width and iteration counts needed for error <= 2^-12.
- `pipelined_m` (50 evals): data_width=13..18, n_iter=12..18, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Registering every m stages saves FFs, and possibly LUTs, relative to full pipelining. Fmax falls as m grows, so small m is the likely way to stay at or above 400 MSPS. Searching m = 2..4 maps the trade-off between area and the throughput constraint.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput >= 400 MSPS constraint is unreachable in the registry. After 100 evaluations, 100% violate it, and the best seen is 273 MSPS (pipelined, W=17), which is 31.8% short. Only pipelined and pipelined_m deliver 1 result/cycle, so throughput equals Fmax. pipelined_m registers every m stages, so it has a longer critical path and a lower Fmax. It peaked at 171 MSPS, well below pipelined. iterative and unrolled_k produce a result only every ceil(N/k)+3 cycles or more, so their throughput is Fmax divided by at least 4 and cannot exceed pipelined. Pipelined already has the shortest path (one micro-rotation per stage), and its best Fmax stays in the 264-273 range across the accuracy-feasible widths of 15-17 bits. The accuracy constraint is not the blocker: 63% of evaluations meet max_abs_err <= 2^-12, down to 2^-14.97. Because the 400 MSPS floor is not met by any family, I report infeasibility rather than returning a design that violates it.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 37% violate; best seen 3.11e-05 (2^-14.97)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=17 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=15 n_iter=14 angle_guard=3 frac_guard=3 rounding=round]: throughput=273, max_abs_err=0.000215 (2^-12.18); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=15 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000224 (2^-12.12); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=17 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000217 (2^-12.17); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=17 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=7.36e-05 (2^-13.73); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 14.97 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 13.92 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7466 in, 2042 out
- provider-reported cost: $0.0354
- full prompts and replies: `llm_trace.jsonl`

