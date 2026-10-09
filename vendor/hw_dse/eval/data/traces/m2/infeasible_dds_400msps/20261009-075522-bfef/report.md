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
- `max_abs_err <= 0.000244141`: met by 28/100 evaluations; best value seen 5.03e-05 (2^-14.28)
- best throughput seen 281.9 MSPS (estimate); best accuracy 14.28 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Throughput >= 400 MSPS single-lane requires one result per cycle at Fmax >= 400 MHz. That rules out iterative and unrolled_k, which produce a result only every several cycles and would need an implausible clock. I therefore search only the two pipelined families. Accuracy must stay within 2^-12, so the ranges cover modest widths and iteration counts, which also keep LUTs low. The first round will show whether any design meets both constraints. If none reaches 400 MSPS, I will report the spec infeasible rather than relax a constraint.*)
- `pipelined` (58 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle, so throughput equals Fmax. Per-stage registers keep the critical path short, which gives the best chance of reaching 400 MSPS. The ranges target error <= 2^-12, which needs roughly 12-14 bit outputs and 12-16 iterations.
- `pipelined_m` (42 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages saves flip-flops and may cut LUTs, but it lengthens the combinational path and lowers Fmax. Small m keeps 400 MSPS possible, so this family is worth testing against the fully pipelined one.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — Throughput >= 400 MSPS is unreachable with the accuracy requirement. All 100 evaluations violate it, and the best seen is 282 MSPS, about 30% short. Only pipelined and pipelined_m produce one result per cycle, so only they can reach 400 MSPS. Pipelined has a register on every stage, so it has the highest Fmax of any family. Its best was 282 MSPS, and pipelined_m was lower at 178 MSPS because its stages are longer. Iterative and unrolled_k give fewer than one result per cycle, so they would need an Fmax well above 400 MHz and cannot do better. Fmax also falls as width grows: 273 MSPS at W=16 and 264 at W=18. The error limit of 2^-12 needs roughly W>=14-16, where the best designs already reach 2^-12.0 to 2^-13.4. At these widths Fmax stays near 265-282 MHz, so narrower words cannot meet 400 MSPS without breaking the error limit.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 72% violate; best seen 5.03e-05 (2^-14.28)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000237 (2^-12.04); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000241 (2^-12.02); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=264, max_abs_err=0.000156 (2^-12.65); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=264, max_abs_err=9.49e-05 (2^-13.36); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=15 angle_guard=3 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=0.000118 (2^-13.05); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 58 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 14.24 bits
- pipelined_m: 42 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 14.28 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7798 in, 1650 out
- provider-reported cost: $0.0321
- full prompts and replies: `llm_trace.jsonl`

