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
- `max_abs_err <= 0.000244141`: met by 9/100 evaluations; best value seen 0.000134 (2^-12.86)
- best throughput seen 272.9 MSPS (estimate); best accuracy 12.86 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >= 400 MSPS throughput and max error <= 2^-12, with LUT minimization as the primary objective. Only pipelined and pipelined_m families guarantee 1 result/cycle, making them the primary candidates for meeting the 400 MSPS constraint. Unrolled_k can also meet throughput with lower Fmax requirements (Fmax >= 400/k), so it's included as a secondary candidate. Data width is kept in 14-16 range to balance accuracy (need >= 12 bits) against LUT cost. n_iter is 12-16 to ensure sufficient accuracy while keeping area reasonable. Angle and frac guards are kept small (0-2) to minimize area. Iterative is excluded because it produces only 1 result every N+3 cycles, making it impossible to reach 400 MSPS without unrealistically high Fmax. Budget is allocated 50% to pipelined (most direct path to 400+ MHz), 30% to pipelined_m (potentially lower area with shorter critical paths), and 20% to unrolled_k (lower Fmax requirement but potentially higher LUTs).*)
- `pipelined` (50 evals): data_width=14..16, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Pipelined is the only family that guarantees 1 result/cycle throughput. To meet 400 MSPS, Fmax must be >= 400 MHz. On Artix-7, a fully pipelined CORDIC with moderate width (14-16) and moderate iterations (12-16) is the most likely candidate to hit 400+ MHz while keeping LUTs low. Accuracy constraint (<= 2^-12) requires sufficient n_iter and data_width; 14-16 bits with 12-16 iterations should comfortably exceed 12-bit accuracy.
- `pipelined_m` (30 evals): data_width=14..16, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Pipelined_m registers every m stages, reducing FF count and potentially improving Fmax compared to fully pipelined at the cost of higher latency. Since the spec only constrains throughput (not latency), this family can offer lower LUT+FF area while still achieving 1 result/cycle. With m=2-4, the critical path is shorter, making 400+ MHz more achievable with fewer resources. This is a strong candidate for minimizing LUTs while meeting throughput.
- `unrolled_k` (20 evals): data_width=14..16, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Unrolled_k performs k micro-rotations per cycle, so throughput = Fmax * k. To meet 400 MSPS, Fmax only needs to be >= 400/k MHz. With k=2-4, Fmax targets drop to 200-100 MHz, which is much easier to achieve on Artix-7. This allows wider data paths or more iterations for accuracy at lower clock speeds, potentially reducing LUTs. However, unrolled_k has a shared FSM and may have higher LUT count per rotation than pipelined variants, so it's a secondary candidate.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The constraint throughput_msps >= 400 is unreachable by any family in the registry. The `pipelined` family is the only architecture capable of 1 result/cycle throughput, yet its maximum observed throughput is 273 MSPS (a 31.8% deficit from the 400 MSPS requirement). This ceiling is determined by the Fmax of the critical path, which is constrained by the data width and iteration count required to meet the accuracy constraint (max_abs_err <= 2^-12). The `unrolled_k` and `pipelined_m` families have even lower maximum throughputs (13.5 and 171 MSPS respectively) due to their multi-cycle or multi-stage structures. Since the best-case pipelined design cannot reach 400 MSPS, no design in the registry can satisfy the spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 91% violate; best seen 0.000134 (2^-12.86)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000134 (2^-12.86); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000214 (2^-12.19); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000204 (2^-12.26); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000237 (2^-12.04); throughput_msps >= 400 violated by 31.8%

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 13.5 MSPS; best accuracy 12.26 bits
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 12.86 bits
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 11.83 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 3526 in, 1694 out
- provider-reported cost: $0.0034
- full prompts and replies: `llm_trace.jsonl`

