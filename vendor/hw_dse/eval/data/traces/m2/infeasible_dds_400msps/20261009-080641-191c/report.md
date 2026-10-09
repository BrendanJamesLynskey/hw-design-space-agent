# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
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

- `throughput_msps >= 400`: met by 0/200 evaluations; best value seen 282
- `max_abs_err <= 0.000244141`: met by 97/200 evaluations; best value seen 2.32e-05 (2^-15.40)
- best throughput seen 281.9 MSPS (estimate); best accuracy 15.40 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Only the pipelined families can plausibly meet the 400 MSPS single-lane throughput: iterative and unrolled_k need Fmax >= 400 * (cycles/result), which is well above 1 GHz for any allowed N and k. Accuracy requires max_abs_err <= 2^-12, so the output LSB must be at most 2^-11, implying data_width >= 13. The first round therefore searches pipelined and pipelined_m over data_width 13..18, n_iter 8..20, and the guard/rounding options to locate the minimal-LUT designs that satisfy both constraints and to start mapping the Pareto front. If no design meets the constraints, later rounds will confirm infeasibility.*)
- `pipelined` (70 evals): data_width=13..18, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Pipelined gives 1 result/cycle and the shortest combinational path per stage, so it has the best chance of reaching the 400 MSPS throughput constraint. The ranges cover the smallest data widths that can possibly meet 2^-12 accuracy (W>=13) and enough iterations/guards to find the minimal-LUT feasible designs.
- `pipelined_m` (30 evals): data_width=13..18, n_iter=8..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* Pipelined_m also gives 1 result/cycle but registers every m stages, which may reduce FF count and change the LUT/FF trade-off. We restrict m to 2..4 because larger m lengthens the combinational path and is less likely to meet 400 MSPS; this tests whether it can still be feasible while offering a different area point.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `add_family` — Only pipelined can plausibly reach 400 MSPS: it is the sole 1-result/cycle family, and its best observed throughput is 282 MSPS (at data_width 16-18), while pipelined_m tops out at 178 MSPS and iterative/unrolled_k are structurally capped at Fmax/(N+3) and Fmax/(ceil(N/k)+3) respectively (<= ~Fmax/4 even at k=8, N=4), so they cannot approach 400. Accuracy is not the blocker: 45% of designs already meet max_abs_err <= 2^-12, with best 2^-15.40, and the output-quantisation floor means data_width >= ~15-16 is required, which is exactly where the 282 MSPS was seen. Round 1 never probed the low-data_width corner of pipelined, so before declaring infeasible I need the Fmax-vs-data_width trend at the minimum accuracy-viable width, plus a cheap confirmation of the other families' throughput ceilings.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 45% violate; best seen 2.32e-05 (2^-15.40)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=19 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=3 rounding=trunc]: throughput=264, max_abs_err=8.39e-05 (2^-13.54); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=20 angle_guard=0 frac_guard=3 rounding=trunc]: throughput=264, max_abs_err=0.000217 (2^-12.17); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=14 angle_guard=2 frac_guard=1 rounding=round]: throughput=264, max_abs_err=0.000152 (2^-12.68); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=20 angle_guard=3 frac_guard=3 rounding=round]: throughput=264, max_abs_err=2.32e-05 (2^-15.40); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 70 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 15.40 bits
- pipelined_m: 30 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 14.33 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Spend this round on the throughput question, not the accuracy question: pipelined at low data_width to find its Fmax ceiling, and small probes of unrolled_k/iterative to record their multi-cycle throughput ceilings. If pipelined at the minimum accuracy-viable width still cannot reach 400 MSPS, the spec is infeasible and the remaining budget should be spent confirming that rather than mapping a front that cannot contain a feasible point.*)
- `pipelined` (67 evals): data_width=13..17, n_iter=12..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Probe the Fmax ceiling of the only 1-result/cycle family at the smallest data_width that can still hold 2^-12 accuracy (W~15-16), to see whether 400 MSPS is reachable at all.
- `unrolled_k` (22 evals): data_width=13..18, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* Unexplored family; confirm its throughput ceiling (ceil(N/k)+3 cycles/result, so <= Fmax/4) is far below 400 MSPS.
- `iterative` (11 evals): data_width=13..18, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Unexplored family; N+3 cycles/result makes >=400 MSPS structurally impossible, but a few evals document the ceiling for the infeasibility verdict.

**Result (code):** 100 evaluations this round, 200 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `infeasible` — ...

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 200 evaluations (0 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 52% violate; best seen 2.32e-05 (2^-15.40)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=19 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000192 (2^-12.35); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=15 n_iter=23 angle_guard=3 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000192 (2^-12.35); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=23 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=21 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 12.4 MSPS; best accuracy 12.45 bits
- unrolled_k: 22 evals, 0 feasible; max throughput seen 25.5 MSPS; best accuracy 13.48 bits
- pipelined: 137 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 15.40 bits
- pipelined_m: 30 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 14.33 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7212 in, 11395 out
- provider-reported cost: $0.0092
- full prompts and replies: `llm_trace.jsonl`

