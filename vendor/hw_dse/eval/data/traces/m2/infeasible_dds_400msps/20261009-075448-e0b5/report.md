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
- `max_abs_err <= 0.000244141`: met by 39/100 evaluations; best value seen 5.46e-05 (2^-14.16)
- best throughput seen 281.9 MSPS (estimate); best accuracy 14.16 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS constraint needs a result every cycle at about 400 MHz or more, since the iterative and unrolled_k families produce one result per several cycles and are unlikely to meet it. I am therefore searching only pipelined and pipelined_m. An error of 2^-12 needs roughly 12 to 14 bits of accuracy, so width and iteration ranges are centred on 12 to 18 bits and 10 to 16 iterations. Searching the guard-bit and rounding choices should expose the trade-off between LUTs and accuracy_bits. If round 1 shows that neither family reaches 400 MSPS, the next step is to declare infeasible.*)
- `pipelined` (58 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle, so throughput equals Fmax. It is the most plausible family to reach 400 MSPS, and the fine-grained stages should give the best Fmax. The ranges target an error of 2^-12 or less with minimal width and iteration count to keep LUTs low.
- `pipelined_m` (42 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages may save FFs and LUTs while still producing one result per cycle. Fmax may or may not stay at or above 400 MHz, so a small m keeps this feasible and it is worth testing.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput >= 400 MSPS constraint is unreachable. All 100 evaluations violate it, and the best seen is 282 MSPS. That figure comes from pipelined designs sampled across the registry's width range, so narrower datapaths do not reach 400 either. The accuracy constraint also forces data_width of about 14 or more, where Fmax is lower still: the least-violating designs at W=16-18 reach only 264-273 MSPS. pipelined_m is slower, with a maximum of 178 MSPS, because it puts more logic between registers. iterative and unrolled_k deliver at most one result per cycle in the best case, and in practice N/k+3 cycles per result. Their throughput is therefore Fmax divided by several cycles, well below pipelined's 1 result/cycle. Since the fully pipelined family is the throughput ceiling and tops out at 282 MSPS, no registry design can meet 400 MSPS together with an error of 2^-12 or better. I am declaring infeasible rather than returning a constraint-violating design.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 61% violate; best seen 5.46e-05 (2^-14.16)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000214 (2^-12.19); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000237 (2^-12.04); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000204 (2^-12.26); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=2 frac_guard=3 rounding=trunc]: throughput=264, max_abs_err=0.000147 (2^-12.74); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=3 rounding=round]: throughput=264, max_abs_err=0.000114 (2^-13.09); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 58 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 14.16 bits
- pipelined_m: 42 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 14.16 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7790 in, 1830 out
- provider-reported cost: $0.0339
- full prompts and replies: `llm_trace.jsonl`

