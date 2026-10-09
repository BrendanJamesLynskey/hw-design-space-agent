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
- `max_abs_err <= 0.000244141`: met by 59/100 evaluations; best value seen 2.42e-05 (2^-15.34)
- best throughput seen 281.9 MSPS (estimate); best accuracy 15.34 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraint is throughput_msps >= 400. iterative and unrolled_k emit one result every several cycles, so their throughput is Fmax/ceil(N/k) or Fmax/(N+3), which cannot reach 400 MSPS on Artix-7 (Fmax is far below the ~1.2-4 GHz that would be required). They are therefore infeasible for this spec and excluded. Only pipelined and pipelined_m produce 1 result/cycle, so throughput = Fmax and the constraint reduces to Fmax >= 400 MHz. That forces a shallow pipeline (N ~ 12-18) and moderate data width (14-20). The accuracy constraint max_abs_err <= 2^-12 is met by N ~ 12-14 with W ~ 14-16, so I bound n_iter and data_width to the region where both constraints are simultaneously satisfiable, and keep angle_guard/frac_guard/rounding in their low-cost ranges to expose the LUT-vs-accuracy trade-off. The two families are searched with equal weight because pipelined_m can trade a slightly longer per-stage path for fewer registers and potentially fewer LUTs, which is exactly where the min-LUTs objective and the hypervolume front live. The reserved front-mapping pass will then sweep these ranges fully.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..18, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so throughput_msps = Fmax. To hit >=400 MSPS we need Fmax >= 400 MHz, which is only plausible with a modest stage count (N ~ 12-18) and moderate width. Accuracy <= 2^-12 needs N ~ 12-14 with W ~ 14-16; this range covers the accuracy/area trade-off that the front lives on.
- `pipelined_m` (50 evals): data_width=14..20, n_iter=12..18, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Same 1-result/cycle throughput as pipelined, but fewer registers (every m stages) can reduce FFs and sometimes LUTs at the cost of a longer combinational path per stage. With m=2..4 the per-stage path stays short enough to plausibly reach 400 MHz while saving area vs fully pipelined, so it can dominate on the min-LUTs objective.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint (>= 400 MSPS) is unreachable by any family in the registry. The pipelined family, which produces 1 result/cycle, achieved a maximum throughput of only 282 MSPS in 50 evaluations, falling short by 30%. The pipelined_m family, which produces 1 result/cycle but with reduced register density, achieved a maximum of only 171 MSPS. The iterative and unrolled_k families produce fewer than 1 result/cycle (1/k or 1), so their throughput is strictly lower than the pipelined family's maximum for any given data width and n_iter. Since the pipelined family is the theoretical maximum throughput architecture in the registry and it cannot reach 400 MSPS, no design in the registry can satisfy the spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 41% violate; best seen 2.42e-05 (2^-15.34)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=17 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000219 (2^-12.16); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000207 (2^-12.24); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=7.36e-05 (2^-13.73); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 50 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 15.14 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.34 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 4377 in, 1091 out
- provider-reported cost: $0.0045
- full prompts and replies: `llm_trace.jsonl`

