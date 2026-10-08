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
- `max_abs_err <= 0.000244141`: met by 89/100 evaluations; best value seen 9.56e-06 (2^-16.67)
- best throughput seen 272.9 MSPS (estimate); best accuracy 16.67 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >= 400 MSPS throughput, which rules out iterative and unrolled_k (unless k is very high and Fmax is very high, but pipelined is more reliable). Pipelined and pipelined_m are the primary candidates. We focus on data_width 16-24 and n_iter 12-18 to balance accuracy (max_abs_err <= 2^-12) and area. Rounding is fixed to 'round' to maximize accuracy. We allocate budget to pipelined (50%), pipelined_m (30%), and unrolled_k (20%) to explore the Pareto front for LUT minimization.*)
- `pipelined` (50 evals): data_width=16..24, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Only pipelined/pipelined_m can meet the 400 MSPS throughput constraint. Pipelined is the primary candidate for minimizing LUTs while maintaining high Fmax. Rounding is fixed to 'round' to maximize accuracy_bits for the given width/iteration count.
- `pipelined_m` (30 evals): data_width=16..24, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=round, m=2..4. *Why:* Pipelined_m reduces FF count by registering every m stages, potentially allowing higher Fmax or lower area than full pipelined. It is the second-best candidate for meeting throughput while optimizing LUTs.
- `unrolled_k` (20 evals): data_width=16..24, n_iter=12..18, angle_guard=0..2, frac_guard=0..2, rounding=round, k=4..8. *Why:* Unrolled_k with high k (4-8) can achieve high throughput if Fmax is sufficient. It uses a shared datapath, which may have different LUT characteristics than pipelined. Included to check if it offers a better LUT trade-off than pipelined.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput constraint is unreachable by any family in the registry. The pipelined family, which produces one result per cycle, achieved a maximum throughput of only 273 MSPS across 50 evaluations, falling short of the 400 MSPS requirement by 31.8%. The unrolled_k and pipelined_m families, which produce fewer than one result per cycle, achieved even lower maximum throughputs (9.97 and 164 MSPS respectively). Since the pipelined family represents the maximum possible throughput for a given Fmax and it cannot meet the 400 MSPS constraint, no design in the registry can satisfy the spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 11% violate; best seen 9.56e-06 (2^-16.67)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000176 (2^-12.48); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000207 (2^-12.24); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000244 (2^-12.00); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=17 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000244 (2^-12.00); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=21 n_iter=16 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=4e-05 (2^-14.61); throughput_msps >= 400 violated by 33.9%

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 9.97 MSPS; best accuracy 16.62 bits
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 16.67 bits
- pipelined_m: 30 evals, 0 feasible; max throughput seen 164 MSPS; best accuracy 16.64 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 4663 in, 1260 out
- provider-reported cost: $0.0030
- full prompts and replies: `llm_trace.jsonl`

