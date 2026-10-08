# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
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

- `throughput_msps >= 400`: met by 0/200 evaluations; best value seen 282
- `max_abs_err <= 0.000244141`: met by 32/200 evaluations; best value seen 0.000118 (2^-13.05)
- best throughput seen 281.9 MSPS (estimate); best accuracy 13.05 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard throughput constraint makes one-result-per-cycle architectures the only plausible first-round candidates; iterative and unrolled_k would require a clock scaled by their multi-cycle latency and are therefore not worth budget now. The accuracy constraint pushes the search toward data_width at least 14 and n_iter in the low-to-mid teens, with guards near zero for LUT minimization and some positive guard headroom for the accuracy objective. Most budget goes to pipelined because it has the shortest per-stage path and is the strongest candidate for 400 MSPS. A smaller slice of pipelined_m checks whether register reduction yields a useful LUT/accuracy trade-off. If the first round shows no pipelined point meeting throughput, the next decision should be infeasible rather than expanding into multi-cycle families.*)
- `pipelined` (75 evals): data_width=14..18, n_iter=10..16, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* One result/cycle and one registered stage per rotation is the most plausible way to satisfy a 400 MSPS single-lane throughput constraint. The ranges focus on the lowest-LUT region that can plausibly meet max_abs_err <= 2^-12: data_width starts at 14 because the output has W-2 fractional bits, n_iter probes the boundary below and around the accuracy requirement, and small angle/frac guards are included to find the minimum-LUT feasible point while still allowing some accuracy headroom.
- `pipelined_m` (25 evals): data_width=14..18, n_iter=10..16, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Also one result/cycle, so it remains a plausible throughput candidate. Small m values keep the combinational path shorter than larger m values, while still testing whether reduced register density changes LUTs or timing enough to create a non-dominated point. Larger m is deferred because it is less likely to help the LUT objective and may hurt the throughput constraint.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — Round 1 found no feasible design. Pipelined is the only 1-result/cycle family and its best throughput is 273 MSPS, 31.8% below the 400 MSPS constraint, while accuracy is already achievable (best 13.05 bits; several least-violating designs meet max_abs_err <= 2^-12). pipelined_m is worse at 171 MSPS. The next round should focus pipelined on lower data_width, lower n_iter, and minimal guards to test whether the throughput gap can be closed while keeping error <= 2^-12; iterative/unrolled_k are deprioritized because their schedules produce one result every several cycles.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 72% violate; best seen 0.000118 (2^-13.05)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000237 (2^-12.04); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000145 (2^-12.75); throughput_msps >= 400 violated by 31.8%

Per family:
- pipelined: 75 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 13.05 bits
- pipelined_m: 25 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 12.64 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the 100-evaluation round on the only plausible 1-result/cycle family, narrowing to the low-width/low-iteration corner that can still satisfy the 2^-12 error bound.*)
- `pipelined` (100 evals): data_width=14..16, n_iter=10..16, angle_guard=-1..2, frac_guard=0..1, rounding=round|trunc. *Why:* Target the throughput bottleneck: smaller W/N and guards should raise Fmax, while W>=14 and N>=10 with rounding are the likely minimum accuracy region for <=2^-12.

**Result (code):** 100 evaluations this round, 200 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `infeasible` — The throughput constraint is unreachable. The only 1-result/cycle families are pipelined and pipelined_m; after 200 evaluations their best throughputs are 282 MSPS and 171 MSPS, and 100% of all evaluations violate throughput_msps >= 400. Accuracy is not the blocker: 16% of evaluations meet max_abs_err <= 2^-12, with best 2^-13.05, but the least-violating accurate designs are only 273 MSPS. The unexplored families are structurally slower: iterative has at least N+3 = 7 cycles/result and unrolled_k has at least ceil(N/k)+3 = 4 cycles/result, so they would require Fmax >= 2800 MHz or >= 1600 MHz to reach 400 MSPS, far above the fastest observed 282 MSPS. Therefore no registry design can satisfy both constraints.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 200 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 84% violate; best seen 0.000118 (2^-13.05)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000237 (2^-12.04); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=14 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.28); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=15 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000145 (2^-12.75); throughput_msps >= 400 violated by 31.8%

Per family:
- pipelined: 175 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 13.05 bits
- pipelined_m: 25 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 12.64 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 1)
- tokens: 6351 in, 30754 out
- provider-reported cost: $0.0729
- full prompts and replies: `llm_trace.jsonl`

