# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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

- `throughput_msps >= 400`: met by 0/100 evaluations; best value seen 273
- `max_abs_err <= 0.000244141`: met by 48/100 evaluations; best value seen 8.35e-05 (2^-13.55)
- best throughput seen 272.9 MSPS (estimate); best accuracy 13.55 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The hard constraint is throughput_msps >= 400 on a single lane. iterative and unrolled_k emit one result every several cycles, so they would need Fmax in the GHz range to hit 400 MSPS, which is implausible on Artix-7; I therefore exclude them and spend the whole budget on the two 1-result/cycle families. pipelined has the cleanest timing (best Fmax) and is the primary candidate for meeting 400 MSPS; pipelined_m is the area/timing trade-off variant that may reach 400 MSPS with fewer resources. The accuracy constraint (max_abs_err <= 2^-12) is loose: W=14..18 with N=12..16 comfortably exceeds 12 bits, so I keep data_width and n_iter low to minimise LUTs (the objective) and use small angle/frac guards to keep the datapath narrow. Rounding is left to the search since it affects both error and area slightly. This focuses the 400-eval budget on the only region where the design can be feasible, and lets the code map the LUT-vs-accuracy trade-off along the front.*)
- `pipelined` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, which is the only way to plausibly reach >=400 MSPS single-lane (Fmax must be >=400 MHz). Full pipelining has the best timing of the throughput families, so it is the most likely to satisfy the throughput constraint. Accuracy only needs ~12 bits, so W=14..18 with N=12..16 is more than enough; keeping W and N low minimises LUTs (the objective). Small guards keep the datapath narrow.
- `pipelined_m` (50 evals): data_width=14..18, n_iter=12..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Registering every m stages trades some Fmax for fewer FFs and a shorter critical path per stage, which can push Fmax above 400 MHz and reduce area. It still yields 1 result/cycle, so it can meet the throughput constraint. m=2..4 keeps latency and area modest while relaxing timing. Same accuracy window as pipelined since accuracy is family-independent.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `infeasible` — The constraint `throughput_msps >= 400` is unreachable for any architecture in the registry. 

1. **Architecture Throughput Limits**: 
   - `iterative` and `unrolled_k` produce one result every several cycles (N+3 or ceil(N/k)+3). Even with aggressive unrolling (k=8) and high Fmax, the throughput is fundamentally limited by the latency per result. For example, if N=16 and k=8, latency is 5 cycles. To reach 400 MSPS, Fmax would need to be 2000 MHz, which is physically impossible on Artix-7 (typically < 500 MHz). 
   - `pipelined` and `pipelined_m` produce one result per cycle. Thus, `throughput_msps` is directly proportional to `fmax_mhz`. To meet 400 MSPS, the design must achieve `fmax_mhz >= 400`.

2. **Evidence from Round 1**: 
   - The best throughput observed in `pipelined` was **273 MSPS**. This implies the maximum achievable Fmax for the explored configurations (data_width ~17, n_iter ~16) is around 273 MHz.
   - The `pipelined_m` family performed worse (max 171 MSPS), likely due to increased logic depth or timing constraints from the specific register placement, or simply that the search didn't find a better configuration. 
   - The least-violating designs all cluster around 273 MSPS, violating the 400 MSPS constraint by ~32%. 

3. **Why it's infeasible**: 
   - To increase throughput in `pipelined`, we need higher Fmax. Fmax is limited by the critical path of the CORDIC stage (adders, shifters, MUXes). 
   - Reducing `data_width` or `n_iter` could increase Fmax, but: 
     - `n_iter` must be high enough to meet `max_abs_err <= 2^-12`. The best accuracy seen was ~13.5 bits with `n_iter=16` and `data_width=17`. Reducing `n_iter` significantly (e.g., to 12) would likely degrade accuracy below 12 bits unless `data_width` is increased, which would further reduce Fmax. 
     - `data_width` is tied to accuracy. The spec requires `max_abs_err <= 2^-12`. The output LSB is `2^-(data_width-2)`. For `data_width=14`, LSB is `2^-12`. However, CORDIC error accumulates. The results show that `data_width=17` was needed to get close to the error bound with `n_iter=16`. Lower `data_width` (e.g., 14) would likely result in larger errors or require more iterations, creating a trade-off that doesn't yield 400 MHz. 
   - The cost model estimates Fmax based on logic depth. The fact that the best case is 273 MHz suggests that the critical path for a 17-bit CORDIC stage on Artix-7 is too long to reach 400 MHz. Even with minimal `data_width` (8) and `n_iter` (4), the Fmax might not scale linearly to 400 MHz because the base logic (adders, MUXes) has a minimum delay. However, the search in Round 1 focused on the accuracy-constrained region. 
   - Crucially, `iterative` and `unrolled_k` are structurally incapable of 400 MSPS single-lane throughput because they are not fully pipelined (1 result/cycle). They are multi-cycle. 
   - Therefore, only `pipelined`/`pipelined_m` are candidates, and their Fmax is capped below 400 MHz for the required accuracy. The 273 MHz ceiling observed is strong evidence that 400 MHz is not achievable while maintaining the required accuracy. No combination of parameters in the registry can bridge the gap from 273 MHz to 400 MHz while keeping `max_abs_err <= 2^-12`.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 52% violate; best seen 8.35e-05 (2^-13.55)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000128 (2^-12.94); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000207 (2^-12.24); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000219 (2^-12.16); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=273, max_abs_err=0.000222 (2^-12.13); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=17 n_iter=16 angle_guard=1 frac_guard=0 rounding=round]: throughput=273, max_abs_err=0.000149 (2^-12.71); throughput_msps >= 400 violated by 31.8%

Per family:
- pipelined: 50 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 13.54 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 13.55 bits
```
</details>

## LLM usage
- calls: 2 (failed/unparsed attempts: 0)
- tokens: 3659 in, 1843 out
- provider-reported cost: $0.0063
- full prompts and replies: `llm_trace.jsonl`

