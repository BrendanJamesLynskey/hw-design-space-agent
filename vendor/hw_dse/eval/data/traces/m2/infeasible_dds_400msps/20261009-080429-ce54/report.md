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

- `throughput_msps >= 400`: met by 0/200 evaluations; best value seen 282
- `max_abs_err <= 0.000244141`: met by 107/200 evaluations; best value seen 2.48e-07 (2^-21.94)
- best throughput seen 281.9 MSPS (estimate); best accuracy 21.94 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=400 MSPS) is decisive: iterative needs Fmax >= 400*(N+3) MHz and unrolled_k needs >= 400*(ceil(N/k)+3) MHz, i.e. >1.6 GHz even in the best case (k=8, N=4), which no Artix-7 design will hit. So iterative and unrolled_k are dropped and the whole first-round budget goes to the two 1-result/cycle families. Accuracy (max_abs_err <= 2^-12) needs roughly W>=14-16 and N>=13-14 with some guard bits, so the boxes are centred there but widened (W 12..22, N 10..24) to let the search find the low-LUT corner and map the front; angle_guard/frac_guard 0..3 and both rounding modes are included because they are cheap accuracy levers. Round 1 is deliberately broad on the two feasible families so later rounds can narrow onto the front.*)
- `pipelined` (60 evals): data_width=12..22, n_iter=10..24, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only the pipelined families can reach 400 MSPS (1 result/cycle, so Fmax>=400 MHz is plausible on Artix-7); m=1 gives the highest Fmax and hence the widest feasible throughput margin. Ranges bracket the accuracy-feasible region: W>=12 for LSB near 2^-12, N>=10 for angle residual, guards>=0 for margin.
- `pipelined_m` (40 evals): data_width=12..22, n_iter=10..24, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..5. *Why:* Same 1 result/cycle throughput, but registering every m stages cuts FFs and latency; m=2..5 trades Fmax against area, which is exactly the LUT/FF-vs-throughput trade-off the Pareto front needs. m>5 risks dropping Fmax below 400 MHz.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `widen` — Throughput is the binding constraint: 100% of the 100 evaluations violate throughput_msps>=400, and the best any design reached was 282 MSPS (a ~30% shortfall), while accuracy is already comfortably met (best 16.95 bits vs the 12-bit requirement, and even the least-violating designs hit 12.8-16.0 bits). Since throughput = Fmax x results/cycle, only the 1-result/cycle families (pipelined, pipelined_m) can possibly reach 400 MSPS; iterative and unrolled_k are capped at <=0.25 results/cycle (ceil(N/k)+3 and N+3 cycles/result), so they would need >1600 MHz Fmax and are provably unable to satisfy the constraint. The explored pipelined designs cluster at data_width 16-21 with Fmax ~264-282 MHz, so the low-data_width / low-guard region (which should raise Fmax) was likely under-sampled. I will widen pipelined and pipelined_m over their full ranges to locate the true Fmax ceiling and confirm whether any accuracy-feasible point (data_width>=~16) can clear 400 MSPS.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 34% violate; best seen 7.89e-06 (2^-16.95)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=22 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=21 n_iter=21 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=1.55e-05 (2^-15.97); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=19 n_iter=21 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=2.02e-05 (2^-15.60); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=19 n_iter=21 angle_guard=0 frac_guard=2 rounding=trunc]: throughput=264, max_abs_err=5.67e-05 (2^-14.11); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=3 rounding=round]: throughput=264, max_abs_err=3.97e-05 (2^-14.62); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 60 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 16.95 bits
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.71 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Widen the two 1-result/cycle families over their full ranges to establish the achievable throughput ceiling; exclude iterative/unrolled_k because their <=0.25 results/cycle makes the 400 MSPS constraint unreachable regardless of Fmax.*)
- `pipelined` (75 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only 1-result/cycle family with the highest observed throughput (282 MSPS); full-range sweep of data_width and guards probes the Fmax ceiling and the accuracy/throughput trade-off.
- `pipelined_m` (25 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle; sweep m to check whether fewer pipeline registers can trade latency for a higher Fmax than the 171 MSPS seen so far.

**Result (code):** 100 evaluations this round, 200 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `infeasible` — The throughput constraint (>=400 MSPS) is unreachable by any family in the registry. Only pipelined and pipelined_m yield 1 result/cycle, so they alone could reach 400 MSPS, and only if Fmax >= 400 MHz; the best observed is 282 MSPS (pipelined, 135 evals) and 171 MSPS (pipelined_m, 65 evals). The remaining families are inherently multi-cycle: iterative needs N+3 >= 7 cycles and unrolled_k needs ceil(N/k)+3 >= 4 cycles even at N=4/k=8, so their throughput is Fmax divided by >=4, i.e. far below 400. Meanwhile the accuracy constraint (max_abs_err <= 2^-12) forces data_width >= ~14 because the output LSB is 2^-(W-2), and Fmax is essentially flat/slightly falling with width in the explored region (273-282 MSPS at W=16-21), so shrinking width cannot deliver the ~42% Fmax increase that 400 MSPS would require. Accuracy itself is easily met (best 2^-21.94), so the binding, unsatisfiable constraint is throughput.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 200 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 46% violate; best seen 2.48e-07 (2^-21.94)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=22 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=18 angle_guard=1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000149 (2^-12.71); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=20 angle_guard=0 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000244 (2^-12.00); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=21 n_iter=21 angle_guard=0 frac_guard=1 rounding=round]: throughput=264, max_abs_err=1.55e-05 (2^-15.97); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=19 n_iter=21 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=2.02e-05 (2^-15.60); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 135 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 21.94 bits
- pipelined_m: 65 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.71 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 8061 in, 11061 out
- provider-reported cost: $0.0078
- full prompts and replies: `llm_trace.jsonl`

