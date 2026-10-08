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
- `max_abs_err <= 0.000244141`: met by 55/100 evaluations; best value seen 5.46e-05 (2^-14.16)
- best throughput seen 272.9 MSPS (estimate); best accuracy 14.16 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS constraint needs one result per cycle at a Fmax of at least 400 MHz, so only pipelined and pipelined_m are plausible. Iterative and unrolled_k are excluded because they produce a result only every several cycles. The error bound of 2^-12 needs about 13+ bits of output and at least 12 iterations, so the ranges are narrow around that region to minimise LUTs. If the first round shows that no design reaches 400 MSPS, the spec may be infeasible and I will report that instead.*)
- `pipelined` (60 evals): data_width=13..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only 1 result/cycle families can reach 400 MSPS, since Fmax of an iterative design divided by multiple cycles per result would need an unrealistic clock. Full pipelining gives the shortest stage delay, so it is the most likely to hit 400 MHz. Ranges cover the minimum width and iterations for 2^-12 error, with moderate guard bits.
- `pipelined_m` (40 evals): data_width=13..18, n_iter=12..16, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages saves FFs and so LUTs plus FFs, but it lengthens the critical path. Small m might still reach 400 MHz, so it is worth testing whether it can undercut the fully pipelined design on LUTs.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The 400 MSPS throughput constraint is unreachable, so no design in the registry can meet both constraints. After 100 evaluations, 0 are feasible and 100% violate throughput. The best throughput seen is 273 MSPS (pipelined, W=18, N=14, no guard bits), which is 31.8% short. The best pipelined_m design reaches only 171 MSPS because it has fewer registers. Results per cycle are at most 1 for every family, so throughput can never exceed Fmax. Only the pipelined family delivers 1 result/cycle at full Fmax, and it is already capped near 264-273 MSPS. The iterative and unrolled_k families deliver one result every ceil(N/k)+3 cycles or more, so their throughput would be far below 273 MSPS. The 2^-12 error limit also forces data_width of about 15 or more, so the datapath cannot shrink enough to close a 32% Fmax gap. Accuracy is not the blocker: 55% of designs meet max_abs_err, and the best reaches 14.16 bits. Spending more evaluations would not change this, so I report infeasibility rather than propose a design that violates the throughput constraint.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 45% violate; best seen 5.46e-05 (2^-14.16)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000244 (2^-12.00); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=2 rounding=round]: throughput=264, max_abs_err=0.000109 (2^-13.16); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=0.00014 (2^-12.80); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=3 rounding=round]: throughput=264, max_abs_err=0.000153 (2^-12.67); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 60 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 13.60 bits
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 14.16 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7462 in, 1919 out
- provider-reported cost: $0.0341
- full prompts and replies: `llm_trace.jsonl`

