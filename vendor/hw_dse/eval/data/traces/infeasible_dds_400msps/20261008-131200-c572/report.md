# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 300 of 400 budgeted, over 3 round(s).  
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

- `throughput_msps >= 400`: met by 0/300 evaluations; best value seen 282
- `max_abs_err <= 0.000244141`: met by 188/300 evaluations; best value seen 1.79e-05 (2^-15.77)
- best throughput seen 281.9 MSPS (estimate); best accuracy 15.77 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Throughput rules out two families analytically. `iterative` needs N+3 cycles/result, so even at N=4 it would need Fmax ~2.8 GHz to hit 400 MSPS; `unrolled_k` needs ceil(N/k)+3 cycles/result, so its best case (k=8, N=4) is 4 cycles/result and would need ~1.6 GHz. Neither is reachable on Artix-7, so spending budget there cannot produce a feasible point. Only `pipelined` and `pipelined_m` deliver 1 result/cycle and therefore only need Fmax >= 400 MHz, which is the real feasibility question. Both are searched because they share the same accuracy surface (identical bit behaviour) but differ in the Fmax-vs-area trade-off: `pipelined` maximises Fmax headroom, `pipelined_m` can trade Fmax for fewer registers/LUTs. The accuracy constraint max_abs_err <= 2^-12 fixes the useful region: output LSB is 2^-(W-2), so W >= 14 is the minimum for the output quantiser alone, and CORDIC angle-approximation error needs roughly N >= 13; the ranges (W 12..20, N 10..20) bracket that boundary so the search can find the smallest W/N that still satisfies the error bound, which is exactly what min-LUTs wants. angle_guard and frac_guard are swept because they buy accuracy cheaply in LUTs and may let a smaller W/N pass. Round 1 is 100 evals split 55/45; later rounds will reallocate toward whichever family shows feasible points and toward the low-LUT edge of the front.*)
- `pipelined` (55 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only the fully pipelined family gives 1 result/cycle with the shortest combinational path per stage, so it is the most likely to clear the 400 MSPS throughput floor on Artix-7. It is also the natural accuracy reference: all families compute identical bits, so this search pins down the (data_width, n_iter, angle_guard, frac_guard, rounding) combinations that reach max_abs_err <= 2^-12, which the other families can then reuse. Its cost is extra FFs, but the objective is min LUTs, so it stays competitive.
- `pipelined_m` (45 evals): data_width=12..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle, so it can meet 400 MSPS if its longer combinational path still closes timing. Registering every m stages cuts FFs and may cut LUTs (fewer pipeline registers/muxing), which directly serves the min-LUTs objective. The m sweep is the key trade-off axis: small m for Fmax headroom, large m for area. Searching it in parallel with the fully pipelined family lets the Pareto front capture both the timing-feasible and the area-lean ends.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `add_family` — Every design evaluated so far is throughput-starved, not accuracy-starved: 100% of evaluations violate throughput>=400 while the best accuracy already reaches 2^-15.25 (well inside the 2^-12 limit). The two families tried are both 1-result/cycle (pipelined) or worse (pipelined_m), and their best observed throughputs are 282 and 171 MSPS, i.e. the cost model simply does not clock these datapaths at 400 MHz. Raising Fmax alone cannot close a 31.8% gap. The unexplored `unrolled_k` family is the only registry entry whose results/cycle can exceed 1 (k/(ceil(N/k)+3), e.g. k=8,N=16 -> 1.6 results/cycle), so it can reach 400 MSPS at a lower Fmax. `iterative` is 1/(N+3) results/cycle and cannot help. Accuracy is family-independent, so the already-validated accuracy region (data_width~17-18, n_iter~14-18, round) transfers directly.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 41% violate; best seen 2.57e-05 (2^-15.25)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=18 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000244 (2^-12.00); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000114 (2^-13.10); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000186 (2^-12.39); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=trunc]: throughput=273, max_abs_err=0.000182 (2^-12.43); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%

Per family:
- pipelined: 55 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 14.78 bits
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.25 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus the round on unrolled_k (high k) since it is the only family that can exceed 1 result/cycle; retain a thin pipelined slice as a control. If unrolled_k at k=8 still cannot reach 400 MSPS, the throughput constraint is likely unreachable in the registry.*)
- `unrolled_k` (80 evals): data_width=16..20, n_iter=12..20, angle_guard=-1..2, frac_guard=0..2, rounding=round|trunc, k=6..8. *Why:* k in 6..8 maximises results/cycle; n_iter 12..20 and data_width 16..20 bracket the accuracy-feasible region already observed (2^-12.3 at W=18,N=14; 2^-13.1 at W=18,N=18).
- `pipelined` (20 evals): data_width=16..19, n_iter=12..18, angle_guard=-1..1, frac_guard=0..1, rounding=round. *Why:* Keep a small control sample on the current best-throughput family to confirm whether any pipelined point can approach 400 MSPS and to anchor the Pareto front if unrolled_k under-delivers on Fmax.

**Result (code):** 100 evaluations this round, 200 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `refine` — Every feasible candidate must satisfy throughput_msps >= 400, and for the pipelined family throughput == Fmax (1 result/cycle). The best throughput seen anywhere is 282 MSPS (pipelined), i.e. the binding constraint is Fmax, not the schedule. Accuracy is already reachable: pipelined [W=17,N=18,ag=0,fg=0,round] hits max_abs_err = 2^-12.00 exactly, and W=18/N=18 gives 2^-13.10, so the accuracy constraint is not the blocker. Since Fmax in a pipelined CORDIC is set by the per-stage adder/shifter width, the unexplored lever is *small* data_width combined with *large* n_iter (accuracy is recovered by more micro-rotations, not by wider datapath). The previous pipelined sweep evidently concentrated on W>=17; we must probe W=13..18 to see whether Fmax can be pushed from 282 toward 400 while keeping max_abs_err <= 2^-12. iterative is not useful here (N+3 cycles/result cannot reach 400 MSPS) and pipelined_m is strictly worse for Fmax (best 171 MSPS), so the budget should stay on pipelined.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 200 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 34% violate; best seen 1.79e-05 (2^-15.77)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=18 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000244 (2^-12.00); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000114 (2^-13.10); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000186 (2^-12.39); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=trunc]: throughput=273, max_abs_err=0.000182 (2^-12.43); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%

Per family:
- unrolled_k: 80 evals, 0 feasible; max throughput seen 8.13 MSPS; best accuracy 15.77 bits
- pipelined: 75 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 14.78 bits
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.25 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the remaining ~200 evals on the small-data_width / high-n_iter corner of the pipelined family, which is the only region where Fmax (== throughput) can plausibly cross 400 MSPS while max_abs_err stays <= 2^-12. If no design in this corner reaches 400 MSPS, the throughput constraint is unreachable in the registry and the next decision should be infeasible.*)
- `pipelined` (80 evals): data_width=13..18, n_iter=18..30, angle_guard=-1..3, frac_guard=0..3, rounding=round. *Why:* small W for max Fmax, large N to hold 12-bit accuracy; round to shave ~0.5 LSB
- `pipelined_m` (20 evals): data_width=13..16, n_iter=18..30, angle_guard=-1..3, frac_guard=0..3, rounding=round, m=2..2. *Why:* m=2 is the only pipelined_m setting that could plausibly approach the pipelined Fmax; check as a fallback

**Result (code):** 100 evaluations this round, 300 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `infeasible` — The binding constraint is throughput_msps >= 400, and it is unreachable in this registry. Throughput = Fmax x results/cycle, and the fastest family available (pipelined) already emits 1 result/cycle, so its throughput equals its Fmax. Across 155 pipelined evaluations the best throughput ever seen is 282 MSPS - a 30% shortfall against the 400 MSPS target - and no other family can beat that: pipelined_m (1 result/cycle, longer critical path) tops out at 178 MSPS and unrolled_k (1 result per k cycles) at 8.13 MSPS. Since no family in the registry can produce more than one result per cycle, 282 MSPS is a hard ceiling on achievable throughput, and the 400 MSPS requirement cannot be met by any parameter combination. The accuracy constraint is not the blocker: max_abs_err <= 2^-12 is already satisfied (best seen 2^-15.77, and even the least-violating pipelined designs hit 2^-12.00 to 2^-13.10), so relaxing accuracy would not help. The two constraints are mutually exclusive here: meeting 2^-12 accuracy forces data_width >= ~14 (output LSB = 2^-(W-2)), which keeps Fmax in the ~270-282 MHz band, while any data_width small enough to raise Fmax toward 400 MHz would violate the error bound. With 0 of 300 evaluations feasible and the throughput ceiling 30% below spec, no design in the registry can satisfy the spec, so the correct decision is infeasible rather than spending the remaining budget on a front that cannot exist.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 300 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 37% violate; best seen 1.79e-05 (2^-15.77)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=18 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000244 (2^-12.00); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000114 (2^-13.10); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=-1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000186 (2^-12.39); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=18 angle_guard=0 frac_guard=0 rounding=trunc]: throughput=273, max_abs_err=0.000182 (2^-12.43); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%

Per family:
- unrolled_k: 80 evals, 0 feasible; max throughput seen 8.13 MSPS; best accuracy 15.77 bits
- pipelined: 155 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 15.33 bits
- pipelined_m: 65 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 15.25 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 7395 in, 9519 out
- provider-reported cost: $0.0125
- full prompts and replies: `llm_trace.jsonl`

