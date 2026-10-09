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
- `max_abs_err <= 0.000244141`: met by 114/200 evaluations; best value seen 8.28e-08 (2^-23.53)
- best throughput seen 291.5 MSPS (estimate); best accuracy 23.53 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 400 MSPS single-lane constraint effectively eliminates iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result): even the best unrolled_k case would require an implausible Fmax far above Artix-7 clocks. Only pipelined and pipelined_m produce one result per cycle, so round 1 focuses entirely on them. Accuracy needs at least W>=14 (output LSB 2^-(W-2)) and enough iterations/guards to keep CORDIC angle and datapath error below 2^-12, so data_width 14..20, n_iter 10..20, full guard ranges and both rounding modes are searched. Pipelined gets the larger share because it is the most likely to clear the Fmax bar; pipelined_m is searched over m=2..8 to see whether a cheaper register schedule can still meet 400 MSPS and lower LUTs.*)
- `pipelined` (60 evals): data_width=14..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only pipelined and pipelined_m can plausibly reach 400 MSPS single-lane, since they emit 1 result/cycle. Pipelined (one register per micro-rotation) should give the highest Fmax, so it is the most likely family to satisfy the throughput constraint; the ranges cover the accuracy region (W>=14, N>=10) needed for max_abs_err <= 2^-12 while letting the search find the minimum-LUT corner.
- `pipelined_m` (40 evals): data_width=14..20, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* pipelined_m also gives 1 result/cycle and may reduce register/LUT cost by registering every m stages, which is attractive for the min-LUT objective. The risk is that larger m lowers Fmax below 400 MHz, so m is searched over 2..8 to find the largest m that still meets throughput while minimising area.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — ...

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 34% violate; best seen 1.42e-05 (2^-16.11)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=18 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=3.75e-05 (2^-14.70); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=19 angle_guard=-1 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=0.000194 (2^-12.33); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=8.26e-05 (2^-13.56); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=19 angle_guard=4 frac_guard=2 rounding=round]: throughput=264, max_abs_err=5.05e-05 (2^-14.27); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 60 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 16.11 bits
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.05 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *see below*)
- `pipelined` (100 evals): data_width=8..28, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* only family with 1 result/cycle; its Fmax IS the throughput ceiling

**Result (code):** 100 evaluations this round, 200 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `infeasible` — The binding constraint is throughput, and it is structurally unreachable in this registry. Pipelined is the only family that produces 1 result/cycle, so its throughput equals its Fmax; across 160 pipelined evaluations the best throughput seen is 292 MSPS, still 27% short of the 400 MSPS requirement, and the cost model caps Fmax there. Every other family has strictly fewer results/cycle: pipelined_m (1 result/cycle but registered every m stages) tops out at 171 MSPS, while iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) would need Fmax in the thousands of MHz to reach 400 MSPS (e.g. unrolled_k best case N=4,k=8 -> 4 cycles/result -> >1600 MHz). Accuracy is not the blocker: max_abs_err <= 2^-12 is comfortably met (best seen 2^-23.53), so the 100%-violated throughput constraint is the sole reason no design is feasible. No family in the registry can satisfy throughput_msps >= 400, so I declare the spec infeasible rather than settle for a violating design.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 200 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 292
- max_abs_err <= 0.000244141: 43% violate; best seen 8.28e-08 (2^-23.53)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=18 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=3.75e-05 (2^-14.70); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=19 angle_guard=-1 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=0.000194 (2^-12.33); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=8.26e-05 (2^-13.56); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=17 n_iter=19 angle_guard=4 frac_guard=2 rounding=round]: throughput=264, max_abs_err=5.05e-05 (2^-14.27); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 160 evals, 0 feasible; max throughput seen 292 MSPS; best accuracy 23.53 bits
- pipelined_m: 40 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.05 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7158 in, 8202 out
- provider-reported cost: $0.0073
- full prompts and replies: `llm_trace.jsonl`

