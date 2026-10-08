# DSE run: infeasible_dds_400msps

**Verdict:** INFEASIBLE: the architect concluded no design in the registry meets the spec.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
- `max_abs_err <= 0.000244141`: met by 91/200 evaluations; best value seen 5.79e-06 (2^-17.40)
- best throughput seen 281.9 MSPS (estimate); best accuracy 17.40 bits (exact)

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=400 MSPS) is the binding architectural filter. iterative (N+3 cycles/result) and unrolled_k (ceil(N/k)+3 cycles/result) would need Fmax in the multi-GHz range even at the most aggressive settings (k=8, N=4 still costs 4 cycles/result), so they cannot meet 400 MSPS on an Artix-7 and are excluded rather than wasting budget. That leaves only the two 1-result/cycle families. The accuracy constraint (max_abs_err <= 2^-12) sets a floor of roughly W>=14 and N>=14 (output LSB 2^-(W-2), residual angle ~2^-N), so the interesting region is the low-W / low-N corner just above that floor, where LUTs are smallest. Ranges are therefore centred on W=13..20 and N=12..22 with the full guard/rounding space (cheap dimensions that can buy accuracy without extra iterations). Round 1 spends 100 evals split 55/45 between pipelined and pipelined_m; later rounds will narrow around the feasible boundary and reallocate toward whichever family shows the better LUT/accuracy trade. If round 1 shows no configuration reaching 400 MSPS, the correct outcome is infeasible, not a constraint-violating pick.*)
- `pipelined` (55 evals): data_width=13..20, n_iter=12..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only the 1-result/cycle families can plausibly reach 400 MSPS: throughput = Fmax x 1. Here every micro-rotation is its own registered stage with a CONSTANT shift (no barrel shifter), so the per-stage combinational path is just a narrow add/sub and Fmax should be highest of all families. It is the reference for 'can we hit 400 MSPS at all', and it fixes the accuracy floor (W, N) that the other family must also satisfy. data_width starts at 13 because output LSB = 2^-(W-2) and rounding gives ~0.5 LSB = 2^-(W-1), so W>=14 is needed for 2^-12 with margin; 13 is kept only to let the search prove the boundary. n_iter starts at 12 since residual angle ~2^-N must fall below the output LSB (N >~ W-1).
- `pipelined_m` (45 evals): data_width=13..20, n_iter=12..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..4. *Why:* Same 1-result/cycle throughput and identical bit-accurate accuracy, but registers every m stages so it trades Fmax against register count. m is capped at 4 because m>=5 chains 5+ adders per stage and is unlikely to hold 400 MHz; m=2..4 is the region where it might still clear the throughput constraint while using fewer pipeline registers than plain pipelined. Since the objective is min LUTs (not LUTs+FFs), this family is mainly here to check whether a coarser pipeline changes the LUT/accuracy Pareto shape, and to provide a fallback if plain pipelined's Fmax estimate lands just under 400.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — Throughput is the binding constraint, not accuracy. For `pipelined` (the only family with 1 result/cycle, so throughput_msps == fmax_mhz) the best throughput seen in 100 evals is 273 MSPS, and `pipelined_m` is worse (171). Every other family (iterative, unrolled_k) emits one result every several cycles, so its throughput is strictly below its own Fmax — it cannot beat pipelined. The 400 MSPS target therefore requires a pipelined Fmax >= 400 MHz, i.e. ~46% above the best observed. Crucially, Fmax is nearly flat in data_width in the data we have (273 MSPS at W=16 vs 264 MSPS at W=18-20), so the ceiling is not obviously reachable by shrinking the datapath — but we have not yet probed the smallest accuracy-feasible widths, which is exactly where the Fmax ceiling would show up. Accuracy is easy here (best seen 17.40 bits vs the 2^-12 = 12-bit requirement; the minimum width that can even represent 2^-12 with rounding is W~13), so the fastest accuracy-feasible pipelined design sits at the low end of data_width. One focused round on that corner will either find a >=400 MSPS design or establish the true Fmax ceiling and let us declare infeasible with evidence.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 273
- max_abs_err <= 0.000244141: 31% violate; best seen 5.79e-06 (2^-17.40)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=21 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000236 (2^-12.05); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=18 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=18 n_iter=15 angle_guard=2 frac_guard=2 rounding=round]: throughput=264, max_abs_err=8.26e-05 (2^-13.56); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=20 n_iter=20 angle_guard=0 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=3.54e-05 (2^-14.78); throughput_msps >= 400 violated by 33.9%
- pipelined [data_width=18 n_iter=21 angle_guard=-1 frac_guard=1 rounding=trunc]: throughput=264, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 33.9%

Per family:
- pipelined: 55 evals, 0 feasible; max throughput seen 273 MSPS; best accuracy 17.40 bits
- pipelined_m: 45 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 16.03 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus the remaining budget on the throughput corner: minimum data_width that still satisfies max_abs_err <= 2^-12, with rounding, to maximise Fmax. If the best throughput in this round stays well below 400 MSPS, the next decision is infeasible.*)
- `pipelined` (80 evals): data_width=12..16, n_iter=12..22, angle_guard=-1..2, frac_guard=0..2, rounding=round. *Why:* probe the Fmax ceiling at the smallest data_width that can still meet 2^-12 (W~13-14), plus a few sub-13 widths to map the ceiling even if accuracy fails
- `pipelined_m` (20 evals): data_width=12..16, n_iter=12..22, angle_guard=-1..2, frac_guard=0..2, rounding=round, m=2..4. *Why:* check whether coarser register placement (m=2..4) raises Fmax above the fully-pipelined case at small width

**Result (code):** 100 evaluations this round, 200 total; 0 feasible; hypervolume 0 (+0.0%).

**LLM decision:** `infeasible` — The binding constraint is throughput_msps >= 400. Throughput = Fmax x results/cycle, and only the pipelined family achieves 1 result/cycle (the maximum possible in the registry). Across 135 pipelined evaluations the best throughput observed is 282 MSPS - still 30% short of 400 - and the least-violating designs (all pipelined, data_width=16) sit at 273 MSPS. Every other family is strictly worse on this axis: pipelined_m (register every m stages) already drops to 178 MSPS, and iterative/unrolled_k emit only one result every (N+3) or ceil(N/k)+3 cycles, so their throughput is Fmax divided by several cycles and cannot exceed the pipelined ceiling. Since the highest-throughput family in the registry cannot reach 400 MSPS, no combination of family and parameters can satisfy the throughput constraint, and the accuracy constraint (best seen 2^-17.4, easily met) is irrelevant. The 400 MSPS single-lane target is unreachable on this Artix-7 cost model.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 0 (gain this round: +0.0%).
Feasible designs: 0 of 200 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 400: 100% violate; best seen 282
- max_abs_err <= 0.000244141: 55% violate; best seen 5.79e-06 (2^-17.40)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=16 n_iter=21 angle_guard=2 frac_guard=2 rounding=trunc]: throughput=273, max_abs_err=0.000236 (2^-12.05); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=18 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000209 (2^-12.22); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=20 angle_guard=2 frac_guard=2 rounding=round]: throughput=273, max_abs_err=0.000138 (2^-12.83); throughput_msps >= 400 violated by 31.8%
- pipelined [data_width=16 n_iter=18 angle_guard=2 frac_guard=1 rounding=round]: throughput=273, max_abs_err=0.000177 (2^-12.47); throughput_msps >= 400 violated by 31.8%

Per family:
- pipelined: 135 evals, 0 feasible; max throughput seen 282 MSPS; best accuracy 17.40 bits
- pipelined_m: 65 evals, 0 feasible; max throughput seen 178 MSPS; best accuracy 16.03 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 5354 in, 10507 out
- provider-reported cost: $0.0131
- full prompts and replies: `llm_trace.jsonl`

