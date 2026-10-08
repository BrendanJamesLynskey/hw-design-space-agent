# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
- `max_abs_err <= 0.000244141`: met by 59/100 evaluations; best value seen 1.5e-05 (2^-16.03)
- best throughput seen 272.9 MSPS (estimate); best accuracy 16.03 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS constraint forces one result per cycle, so iterative and unrolled_k would require implausibly high Fmax and are excluded. Pipelined_m is likely dominated by pipelined for LUTs and Fmax, so the first round focuses all budget on pipelined. The ranges target W 14-20, N 10-20, and guard/rounding trade-offs to find the narrow feasible window where accuracy meets 2^-12 and throughput meets 400 MHz; if none is feasible, later rounds can confirm infeasibility.*)
- `pipelined` (100 evals): data_width=14..20, n_iter=10..20, angle_guard=-2..3, frac_guard=0..4, rounding=trunc|round. *Why:* Only the one-result-per-cycle pipelined family can plausibly satisfy 400 MSPS; search the minimal width/iteration window that can meet 2^-12 while keeping Fmax high and LUTs low.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint is the blocker: 100% of the 100 pipelined evaluations violate throughput_msps >= 400, and the best observed throughput is 273 MSPS, 31.8% below the required 400 MSPS. Since pipelined has 1 result/cycle, this is also the observed Fmax ceiling for the fully pipelined single-lane family. Accuracy is not the blocker: 59% of evaluations meet max_abs_err <= 2^-12, and the best is 1.5e-05 (16.03 bits). The remaining families cannot close the throughput gap: pipelined_m also has 1 result/cycle but with m>1 rotations between registers, so it does not increase the results/cycle factor and is not a route to exceed the observed fully-pipelined 273 MSPS ceiling; iterative and unrolled_k are multi-cycle, with minimum 7 and 4 cycles/result respectively, so reaching 400 MSPS would require Fmax >= 2800 MHz or >= 1600 MHz, i.e. at least 10.3x or 5.9x the observed 273 MHz 1-result/cycle ceiling. Therefore throughput_msps >= 400 is unreachable in the registry while satisfying the error constraint, and the feasible set is empty.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined. Not yet explored: iterative, unrolled_k, pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 41% violate; best seen 1.5e-05 (2^-16.03)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000114 (2^-13.10); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=16 angle_guard=-1 frac_guard=0 rounding=trunc]: throughput=273, max_abs_err=0.000207 (2^-12.24); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000186 (2^-12.39); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=16 angle_guard=-1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000192 (2^-12.35); throughput_msps >= 400 violated by 31.8%

Per family:
- pipelined: 100 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 16.03 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 1)
- tokens: 3998 in, 23143 out
- provider-reported cost: $0.0515
- full prompts and replies: `llm_trace.jsonl`

