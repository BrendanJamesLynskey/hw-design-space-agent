# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
- `max_abs_err <= 0.000244141`: met by 44/100 evaluations; best value seen 1.5e-05 (2^-16.03)
- best throughput seen 281.9 MSPS (estimate); best accuracy 16.03 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS single-lane constraint rules out iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 >= 4 cycles/result): both would need Fmax of 1600-2800 MHz, impossible on Artix-7. Only pipelined and pipelined_m produce 1 result/cycle, so the first round spends the whole budget there. Accuracy needs max_abs_err <= 2^-12, i.e. roughly W >= 14 with rounding plus enough iterations for CORDIC convergence, so the search boxes are centred just above that threshold (W 12-20, N 10-22) to expose the min-LUT corner while still covering higher-accuracy points. angle_guard/frac_guard/rounding are left at full registry range because they trade accuracy against LUTs and the model must decide that. Pipelined gets the larger share because its one-micro-rotation-per-stage structure gives the highest Fmax and is the most likely to satisfy the throughput constraint at minimum LUTs.*)
- `pipelined` (60 evals): data_width=12..20, n_iter=10..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only a 1-result/cycle family can reach 400 MSPS on Artix-7, and pipelined has the shortest combinational path (one micro-rotation per stage) so it has the best chance of Fmax >= 400 MHz. Ranges bracket the accuracy threshold (W ~ 14-16, N ~ 14-16) so the low-LUT corner of the front is reachable while still allowing higher-accuracy points.
- `pipelined_m` (40 evals): data_width=12..20, n_iter=10..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* Also 1 result/cycle, so it can meet 400 MSPS if Fmax stays high enough with m=2-3; it uses fewer pipeline registers than pipelined and may offer a different LUT/FF balance. Keeping m small (2-4) preserves Fmax, since larger m lengthens the combinational path.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — Throughput is the binding constraint and it is structurally unreachable in this registry. Only pipelined and pipelined_m deliver 1 result/cycle, so their throughput equals Fmax; pipelined tops out at 282 MSPS and pipelined_m at 178, while iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) are strictly worse. The 2^-12 accuracy requirement forces data_width >= ~15 (output LSB is 2^-(W-2), so W=14 already quantises at ~2^-12), which blocks shrinking the datapath enough to lift Fmax by the ~42% needed to reach 400 MSPS. Indeed the best pipelined design (W=16, n_iter=17, angle_guard=2, frac_guard=2) already meets accuracy at 12.83 bits with headroom, yet reaches only 273-282 MSPS - accuracy has margin, throughput does not. No family can close the 31.8% throughput gap, so no design in the registry satisfies both constraints.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 56% violate; best seen 1.5e-05 (2^-16.03)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=17 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000203 (2^-12.27); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=19 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=22 angle_guard=1 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.0002 (2^-12.29); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=18 angle_guard=3 frac_guard=2 rounding=round]: throughput=264, max_abs_err=0.000112 (2^-13.12); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 60 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 16.03 bits
- pipelined_m: 40 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 15.49 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 5049 in, 8197 out
- provider-reported cost: $0.0056
- full prompts and replies: `llm_trace.jsonl`

