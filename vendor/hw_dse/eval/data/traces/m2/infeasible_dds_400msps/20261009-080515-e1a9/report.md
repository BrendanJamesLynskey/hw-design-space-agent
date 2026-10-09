# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
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

- `throughput_msps >= 400`: met by 0/200 evaluations; best value seen 292
- `max_abs_err <= 0.000244141`: met by 89/200 evaluations; best value seen 1.08e-05 (2^-16.50)
- best throughput seen 291.5 MSPS (estimate); best accuracy 16.50 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS constraint is the binding one. `iterative` is excluded outright: it yields 1 result per N+3 cycles, so it would need Fmax >= 400*(N+3) MHz (>= 2800 MHz even at N=4), which no Artix-7 fabric reaches. That leaves the three families whose schedule can approach 1 result/cycle. Accuracy (max_abs_err <= 2^-12) is family-independent and needs roughly W~16-18 with N~13-16, so data_width 14..22 and n_iter 10..18 bracket the feasible accuracy region without wasting budget on hopeless corners; angle_guard, frac_guard and rounding are searched over their full ranges since they are cheap accuracy levers that also shift LUT cost. Budget is weighted toward pipelined (most likely to clear Fmax) and unrolled_k (lowest LUT count, which is the selection objective), with pipelined_m kept as the register-lean variant. Round 1 is deliberately wide so later rounds can narrow onto whichever family actually produces feasible, low-LUT points.*)
- `pipelined` (35 evals): data_width=14..22, n_iter=10..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only family with a 1-result/cycle schedule and a single-adder critical path, so it is the most likely to clear the 400 MSPS wall; W and N ranges bracket the ~12-bit accuracy requirement while the guards/rounding are cheap accuracy knobs.
- `unrolled_k` (35 evals): data_width=14..22, n_iter=10..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=5..8. *Why:* Reuses a k-wide datapath instead of one adder per iteration, so it is the cheapest-LUT candidate; k>=5 is needed to keep results/cycle x Fmax above 400 MSPS, and the search must find the k where the chained-adder critical path still clocks fast enough.
- `pipelined_m` (30 evals): data_width=14..22, n_iter=10..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* Same 1-result/cycle throughput as pipelined but fewer registers; m is capped at 4 because m chained adders per stage is the main threat to reaching 400 MHz, and small m is the only regime that can plausibly satisfy the throughput constraint.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — Only pipelined/pipelined_m give 1 result/cycle, so throughput_msps == Fmax for them; iterative (N+3 cyc) and unrolled_k (ceil(N/k)+3 cyc) are far below (max 9.7 MSPS) and cannot reach 400. Within pipelined the evidence shows Fmax is driven mainly by n_iter, not data_width: dw=16,n_iter=15 -> 264 and dw=18,n_iter=15 -> 264 (flat in width), while dw=18,n_iter=14 -> 273 (higher at lower n_iter). Accuracy at dw=18,n_iter=14 is already 2^-12.28 (passes the 2^-12 bound), so the binding problem is purely Fmax. The current best (273) is 31.8% short of 400, so I need to probe the low-n_iter / low-data_width corner to establish whether the pipelined Fmax ceiling can ever reach 400 before concluding infeasible. pipelined_m is strictly worse (m>=2 lengthens the critical path; max seen 171), so I keep the budget on pipelined.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 39% violate; best seen 1.08e-05 (2^-16.50)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=0.00014 (2^-12.80); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=round]: throughput=264, max_abs_err=1.92e-05 (2^-15.67); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=4 rounding=round]: throughput=264, max_abs_err=0.00014 (2^-12.80); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=16 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc]: throughput=264, max_abs_err=0.000167 (2^-12.54); throughput_msps >= 400 violated by 33.9%

Per family:
- unrolled_k: 35 evals, 0 feasible; max throughput seen 9.7 MSPS; best accuracy 16.50 bits
- pipelined: 35 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 15.67 bits
- pipelined_m: 30 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.69 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the throughput corner: low n_iter (raises Fmax) with data_width/guards just large enough to hold max_abs_err <= 2^-12. If the fastest configs still fall short of 400 MSPS, the spec is infeasible for the whole registry.*)
- `pipelined` (70 evals): data_width=8..18, n_iter=10..16, angle_guard=0..4, frac_guard=0..4, rounding=round. *Why:* Push n_iter down (Fmax rises as n_iter falls) and sweep data_width downward to test whether the Fmax ceiling can exceed 400; keep rounding=round since it gave the best accuracy at fixed width.
- `pipelined_m` (30 evals): data_width=12..18, n_iter=10..16, angle_guard=0..3, frac_guard=0..3, rounding=round, m=2..3. *Why:* m=2/3 is the closest pipelined_m gets to pipelined's critical path; include as a sanity check that no register-placement variant beats pipelined's Fmax.

**Result (code):** 100 evaluations this round, 200 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `infeasible` — The unreachable constraint is throughput_msps >= 400. Throughput = (results/cycle) x Fmax, and in this registry results/cycle can never exceed 1: only pipelined and pipelined_m emit 1 result/cycle; unrolled_k emits 1/ceil(N/k) and iterative 1/(N+3). pipelined (a register after every micro-rotation) is therefore the Fmax ceiling of the whole registry, and its best observed throughput across 105 evaluations is 292 MSPS — the highest any design has achieved in 200 evals. pipelined_m reaches only 178 (coarser registers = less Fmax at the same 1/cycle), unrolled_k 9.7 (sub-1 result/cycle), and the unexplored iterative family is strictly worse (N+3 cycles/result, so even at Fmax=292 it would be ~15-25 MSPS at the N~13-15 needed for accuracy). 292 MSPS falls 27% short of the 400 MSPS floor and 100% of evaluations violated this constraint, so no amount of extra exploration can close a gap that is bounded by the registry's best family. The accuracy constraint is NOT the blocker: the model already achieves max_abs_err = 1.08e-05 (2^-16.50), far better than the required 2^-12, and even the accurate pipelined designs (e.g. dw=20/n_iter=18 at 2^-15.67, dw=18/n_iter=15 at 2^-12.80) top out at 264-273 MSPS. Adding the iterative family cannot help because it lowers results/cycle without raising Fmax above the pipelined ceiling. Hence the spec is infeasible: max_abs_err <= 2^-12 is easily satisfiable, but throughput_msps >= 400 is unreachable by every family in the registry.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 200 evaluations (0 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 292
- max_abs_err <= 0.000244141: 56% violate; best seen 1.08e-05 (2^-16.50)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=0.00014 (2^-12.80); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=round]: throughput=264, max_abs_err=1.92e-05 (2^-15.67); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=4 rounding=round]: throughput=264, max_abs_err=0.00014 (2^-12.80); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=16 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc]: throughput=264, max_abs_err=0.000167 (2^-12.54); throughput_msps >= 400 violated by 33.9%

Per family:
- unrolled_k: 35 evals, 0 feasible; max throughput seen 9.7 MSPS; best accuracy 16.50 bits
- pipelined: 105 evals, 0 feasible; max throughput seen 292 MSPS; best accuracy 15.67 bits
- pipelined_m: 60 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 15.69 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 6306 in, 12990 out
- provider-reported cost: $0.0132
- full prompts and replies: `llm_trace.jsonl`

