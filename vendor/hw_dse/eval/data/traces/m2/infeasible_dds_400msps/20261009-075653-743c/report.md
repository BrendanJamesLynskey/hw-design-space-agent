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

- `throughput_msps >= 400`: met by 0/100 evaluations; best value seen 273
- `max_abs_err <= 0.000244141`: met by 90/100 evaluations; best value seen 1.21e-05 (2^-16.34)
- best throughput seen 272.9 MSPS (estimate); best accuracy 16.34 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS throughput constraint eliminates iterative and unrolled_k (which produce 1 result every k or N+3 cycles). Only pipelined and pipelined_m can meet the throughput requirement. I focus on these two families with W=16-24 (W=16 is the minimum for 12-bit accuracy) and N=12-18 to map the LUT-vs-accuracy Pareto front. Rounding is fixed to 'round' since truncation wastes accuracy budget. angle_guard and frac_guard are kept small (0-2) to minimize area while maintaining accuracy.*)
- `pipelined` (50 evals): data_width=16..24, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Only pipelined/pipelined_m can hit 400 MSPS; pipelined is the LUT-minimal 1-result/cycle family. W=16 is the minimum width for 12-bit accuracy, so I search W=16-24 to map the area-vs-accuracy trade-off, with N=12-18 to cover the accuracy constraint.
- `pipelined_m` (50 evals): data_width=16..24, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=round, m=2..4. *Why:* pipelined_m with m=2-4 reduces FF count vs full pipelined, potentially lowering the LUT+FF area proxy and improving Fmax, which helps the 400 MSPS constraint. Same W/N ranges as pipelined to compare area trade-offs.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint (>= 400 MSPS) is unreachable for any single-lane architecture in the registry. The pipelined family, which offers the highest throughput (1 result/cycle), achieved a maximum of 273 MSPS in Round 1. This is 31.8% below the required 400 MSPS. Since throughput is limited by the maximum clock frequency (Fmax) of the datapath, and the cost model estimates Fmax based on the logic depth and width, no parameter combination (data_width, n_iter, guards) can increase the results-per-cycle beyond 1 for a single-lane pipelined design. The iterative and unrolled_k families have lower throughput (1 result every k or N+3 cycles), making them even further from the 400 MSPS target. Therefore, no design in the registry can meet the throughput constraint.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 10% violate; best seen 1.21e-05 (2^-16.34)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=18 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=18 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=17 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=17 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=round]: throughput=264, max_abs_err=8.24e-05 (2^-13.57); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 16.34 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.92 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 4131 in, 1015 out
- provider-reported cost: $0.0035
- full prompts and replies: `llm_trace.jsonl`

