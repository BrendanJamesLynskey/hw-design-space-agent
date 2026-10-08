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
- `max_abs_err <= 0.000244141`: met by 19/100 evaluations; best value seen 6.2e-05 (2^-13.98)
- best throughput seen 272.9 MSPS (estimate); best accuracy 13.98 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Only pipelined and pipelined_m can plausibly meet 400 MSPS on a single lane: they produce one result per cycle, so the constraint reduces to Fmax >= 400 MHz. Iterative and unrolled_k need at least 7 and 4 cycles/result respectively, which would require Fmax far above 400 MHz to reach 400 MSPS. The error bound is around 12-bit accuracy, so the search starts at the minimum plausible data_width and enough n_iter, while keeping guards low to probe the low-LUT edge and moderate to capture accuracy improvements.*)
- `pipelined` (50 evals): data_width=13..18, n_iter=12..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Full pipeline is the most plausible family for 400 MSPS because it produces one result per cycle and has the shortest per-stage path. The range starts at the minimum plausible width for a 2^-12 error bound, probes the low-LUT edge with negative angle guard and truncation, and extends width/iterations/guards enough to capture the LUT-vs-accuracy trade-off.
- `pipelined_m` (50 evals): data_width=13..16, n_iter=12..18, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=2..3. *Why:* Pipelined_m also gives one result per cycle and may offer a different area/timing trade-off with fewer registers. Small m is kept because larger m lengthens the combinational path and is less likely to sustain 400 MSPS; the narrower range focuses the smaller budget on low-LUT candidates.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint is unreachable. Round 1 evaluated 100 designs in the only 1-result/cycle families, pipelined and pipelined_m, and found 0 feasible designs. The best throughput was 273 MSPS for pipelined and 178 MSPS for pipelined_m, so the best 1-result/cycle design is still 31.8% below the required 400 MSPS. Accuracy is not the blocker: the best observed max_abs_err is 6.2e-05, i.e. 13.98 accuracy bits, which satisfies max_abs_err <= 2^-12. The remaining registry families are structurally multi-cycle: iterative has N+3 cycles/result, minimum 7, and unrolled_k has ceil(N/k)+3 cycles/result, minimum 4. Therefore they issue less than one result per cycle and would require Fmax >= 400*4 = 1600 MHz even in the best unrolled_k case, or >= 2800 MHz for iterative, to meet 400 MSPS. No computed design in the 1-result/cycle families reaches 400 MHz, and the observed best is 273 MHz, so no family in the registry can satisfy throughput_msps >= 400 while meeting the accuracy constraint.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 81% violate; best seen 6.2e-05 (2^-13.98)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=20 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000222 (2^-12.13); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=20 angle_guard=0 frac_guard=2 rounding=round]: throughput=264, max_abs_err=0.000204 (2^-12.26); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=20 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=7.61e-05 (2^-13.68); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=20 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=264, max_abs_err=0.000113 (2^-13.11); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 13.98 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 12.47 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 1)
- tokens: 3562 in, 18477 out
- provider-reported cost: $0.0511
- full prompts and replies: `llm_trace.jsonl`

