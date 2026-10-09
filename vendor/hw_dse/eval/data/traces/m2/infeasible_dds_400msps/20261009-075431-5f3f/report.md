# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
- `max_abs_err <= 0.000244141`: met by 39/100 evaluations; best value seen 6.42e-05 (2^-13.93)
- best throughput seen 281.9 MSPS (estimate); best accuracy 13.93 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Only the pipelined families can give 1 result/cycle, so they are the only candidates for 400 MSPS. The iterative and unrolled_k families produce one result every several cycles, so their throughput would have to be several times their Fmax, which is implausible at 400 MSPS; they are excluded. Accuracy depends only on width, iterations, guard bits and rounding, so the ranges aim just above the 2^-12 error bound to minimise LUTs. This first round also checks whether any design meets both the throughput and error constraints. If none does, the spec may be infeasible and the next round should confirm that before settling.*)
- `pipelined` (58 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result per cycle makes throughput equal Fmax, so 400 MSPS is plausible only if the clock can reach 400 MHz. Per-micro-rotation registers give the shortest critical path. The ranges target error <= 2^-12, which needs about 12-14 fractional bits and roughly 12-14 iterations.
- `pipelined_m` (42 evals): data_width=12..18, n_iter=10..16, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=2..3. *Why:* Registering every 2-3 stages saves FFs and thus area, and may still keep Fmax at or above 400 MHz. Larger m is unlikely to reach 400 MSPS, so m is limited to 2-3 as a test of the throughput boundary.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The throughput_msps >= 400 constraint is unreachable. All 100 evaluations violate it, and the best seen is 282 MSPS. The least-violating designs that also meet the error limit (W=16-17) reach only 264-273 MSPS, which is 32-34% short. Fmax falls as data_width rises, and meeting max_abs_err <= 2^-12 needs data_width of roughly 14 or more, so narrowing the datapath cannot close that gap. pipelined_m is slower still, at 178 MSPS at best. iterative and unrolled_k deliver less than one result per cycle, so reaching 400 MSPS would need an Fmax above 1200 MHz, far beyond the 264-282 MHz of pipelined designs. No registry family can meet both constraints, so I am not settling for a design that violates throughput.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 61% violate; best seen 6.42e-05 (2^-13.93)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000176 (2^-12.48); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=15 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.00018 (2^-12.44); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000214 (2^-12.19); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=3 frac_guard=3 rounding=round]: throughput=264, max_abs_err=6.42e-05 (2^-13.93); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=3 rounding=round]: throughput=264, max_abs_err=0.000104 (2^-13.23); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 58 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 13.93 bits
- pipelined_m: 42 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 12.55 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 7788 in, 1785 out
- provider-reported cost: $0.0334
- full prompts and replies: `llm_trace.jsonl`

