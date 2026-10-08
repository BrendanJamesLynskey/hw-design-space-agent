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
- `max_abs_err <= 0.000244141`: met by 41/100 evaluations; best value seen 5.46e-05 (2^-14.16)
- best throughput seen 272.9 MSPS (estimate); best accuracy 14.16 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS throughput constraint is the binding one. Only pipelined and pipelined_m architectures produce 1 result per cycle, making them the only plausible candidates to meet throughput at reasonable Fmax. Iterative (1 result every N+3 cycles) and unrolled_k (1 result every ceil(N/k)+3 cycles) would need Fmax > 1 GHz to reach 400 MSPS, which is unrealistic for Artix-7. I focus 80% of the budget on pipelined and pipelined_m, which are the only families that can plausibly satisfy throughput. The accuracy constraint (max_abs_err <= 2^-12) is easily met with W=14-18 and N=12-16, so the main trade-off is LUTs vs. accuracy margin. I narrow data_width to 14-18 (W=14 gives ~12-bit accuracy with N=12, W=18 gives more margin) and n_iter to 12-16 to balance accuracy and area. I include unrolled_k with a small share to verify it cannot meet throughput, but expect it to be infeasible. The min-LUT objective will be dominated by the pipelined family with the smallest W and N that still meets accuracy.*)
- `pipelined` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, which is mandatory to reach 400 MSPS on a single lane. Pipelined is the canonical high-throughput CORDIC; with W=14-18 and N=12-16 it should easily clear the 2^-12 error bound while keeping LUTs low. This is the primary candidate for the min-LUT objective.
- `pipelined_m` (30 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Also 1 result/cycle, so throughput constraint is met. Registering every m stages reduces FF count and may lower LUTs slightly due to shorter combinational paths, potentially improving Fmax and thus throughput margin. Worth exploring to see if it beats plain pipelined on LUTs while maintaining accuracy.
- `unrolled_k` (20 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* Unrolled_k with k=4-8 can achieve 1 result every 2-4 cycles. At Fmax ~200-300 MHz, throughput would be 50-150 MSPS, which is below 400 MSPS. However, if Fmax is very high (>500 MHz) or k is large enough, it might just barely meet the constraint. Including it with a small budget share to check if any corner case meets throughput while offering lower LUTs than pipelined.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint (>= 400 MSPS) is unreachable for any single-lane architecture in the registry. The `pipelined` family, which provides 1 result/cycle, achieved a maximum throughput of only 273 MSPS in 50 evaluations. This implies a maximum Fmax of ~273 MHz for the configurations explored (e.g., data_width=16/17, n_iter=16). To reach 400 MSPS, the Fmax would need to be ~400 MHz. However, the `pipelined` architecture with N=16 iterations and W=16/17 bits is already limited to ~273 MHz by the critical path of the CORDIC micro-rotation (adders/shifters). Reducing `n_iter` to increase Fmax would violate the accuracy constraint (max_abs_err <= 2^-12), as the best accuracy seen with N=16 was ~12-14 bits, and lower N yields significantly higher error. The `unrolled_k` and `pipelined_m` families have lower throughput (10.3 and 171 MSPS respectively) because they do not achieve 1 result/cycle at the same Fmax or have higher latency/area penalties that do not compensate for the throughput loss in a single-lane context. Since the best single-lane throughput (273 MSPS) is 31.8% below the requirement, and no architectural variant in the registry can produce >1 result/cycle without violating the single-lane constraint or exceeding the Fmax limit for the required accuracy, the spec is infeasible.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 59% violate; best seen 5.46e-05 (2^-14.16)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000222 (2^-12.13); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000207 (2^-12.24); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000134 (2^-12.86); throughput_msps >= 400 violated by 31.8%

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 10.3 MSPS; best accuracy 12.54 bits
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 14.16 bits
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 13.39 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 3526 in, 1588 out
- provider-reported cost: $0.0037
- full prompts and replies: `llm_trace.jsonl`

