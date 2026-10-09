# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec high_precision: Coherent demodulator for a precision instrument: max error <= 2^-20 at >= 50 MSPS. Minimise area (LUTs + FFs) and the relative power index.
  constraint: throughput_msps >= 50
  constraint: max_abs_err <= 9.53674e-07
  objective: min luts_plus_ffs (HV ref 8000)
  objective: min power_index (HV ref 20)
  select: min luts_plus_ffs
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1930 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 406 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.39 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.83e-07 (2^-20.28) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.1 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.13e-07 (2^-22.17) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.57 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc,m=6` | 1930 | 406 | 59.9 | 6 | 4.39 | 7.83e-07 (2^-20.28) | 20.28 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Max error 2^-20 forces roughly W>=22 and about 20-24 iterations, so the accuracy parameters are narrowed to that region. Iterative is excluded because N+3 cycles per result cannot plausibly reach 50 MSPS. Most of the budget goes to pipelined_m, which should reduce area and power while meeting throughput. Plain pipelined is the reference and unrolled_k with large k is a feasibility probe. Later rounds can narrow onto the best W, N and guard bits.*)
- `pipelined_m` (58 evals): data_width=21..26, n_iter=19..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Gives 1 result/cycle, so 50 MSPS is easy even at a modest Fmax. Registering every m stages should cut FFs, which are the dominant area term for deep pipelines. Wide m range lets the search find the area/power sweet spot.
- `pipelined` (28 evals): data_width=21..26, n_iter=19..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* Fully pipelined baseline with 1 result/cycle. It is the m=1 reference point for pipelined_m and is likely area-heavy, but it is cheap to check.
- `unrolled_k` (14 evals): data_width=21..25, n_iter=19..25, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=5..8. *Why:* Small area, but at about 25 iterations it needs a high k and a high Fmax to reach 50 MSPS. Large k is the only chance of feasibility, so this is a probe with a small budget.

**Result (code):** 100 evaluations this round, 100 total; 23 feasible; hypervolume 8.577e+04 (n/a).

**LLM decision:** `refine` — Only pipelined_m (19 of 58 evals feasible) and pipelined (4 of 28) reach the constraints. unrolled_k is 0 of 14 feasible, with max throughput 7.79 MSPS against the 50 MSPS floor. Iterative needs N+3 cycles per result, so it cannot reach 50 MSPS at N around 24, and I will not spend budget on it. The front is just two designs with identical objectives (2437 LUTs+FFs, power 4.58), both pipelined_m at data_width 26, n_iter 24 and max error 9.44e-07, right at the 2^-20 limit. Feasible designs cluster at data_width 24..26 and n_iter 24..26. I will probe a bit below that, with rounding allowed to be 'round', where a smaller width or fewer iterations might still meet the error limit at lower area. The next plan covers m up to 8 for fewer registers and keeps a small pipelined share as a comparison.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.577e+04 (gain this round: n/a (first round)).
Feasible designs: 23 of 100 evaluations (21 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 21% violate; best seen 264
- max_abs_err <= 9.53674e-07: 73% violate; best seen 2.16e-07 (2^-22.14)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=24 angle_guard=0 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=2437, power_index=4.58, luts=2041, ffs=395, throughput_msps=62.5, max_abs_err=9.44e-07 (2^-20.02)
- pipelined_m [data_width=26 n_iter=24 angle_guard=0 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=2437, power_index=4.58, luts=2041, ffs=395, throughput_msps=54.3, max_abs_err=9.44e-07 (2^-20.02)
Front coverage: luts_plus_ffs 2437..2437 (HV reference 8000); power_index 4.58..4.58 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 19.69 bits
- pipelined: 28 evals, 4 feasible; max throughput seen 264 MSPS; best accuracy 22.14 bits; best feasible luts_plus_ffs=4342; feasible ranges: data_width 24..26, n_iter 24..26, angle_guard 0..3, frac_guard 2..3
- pipelined_m: 58 evals, 19 feasible; max throughput seen 158 MSPS; best accuracy 22.12 bits; best feasible luts_plus_ffs=2437; feasible ranges: data_width 25..26, n_iter 24..25, angle_guard -1..3, frac_guard 0..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the narrow region where accuracy near 2^-20 and 50 MSPS are both met, and look for lower-area designs and a wider front there.*)
- `pipelined_m` (80 evals): data_width=22..26, n_iter=20..26, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* Best family so far (best feasible area 2437). Probing smaller width and fewer iterations, with round, and larger m for lower area and power while keeping throughput at or above 50 MSPS.
- `pipelined` (20 evals): data_width=22..26, n_iter=20..26, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Fully pipelined is feasible (best area 4342, throughput up to 264 MSPS). It is kept as a small-share comparison across the same reduced-width region.

**Result (code):** 100 evaluations this round, 200 total; 53 feasible; hypervolume 8.838e+04 (+3.0%).

**LLM decision:** `refine` — The front has only one design (pipelined_m, W=25, N=22, m=6, 2336 LUTs+FFs, power 4.39), so the trade-off curve is barely mapped. The feasible region is narrow: every feasible design has data_width 24..26 and n_iter 22..26, and 72% of evaluations fail the 2^-20 error limit. Iterative and unrolled_k cannot reach 50 MSPS. unrolled_k peaked at 7.79 MSPS with 0 feasible, and iterative uses the same one-result-per-several-cycles scheme, so I will not spend budget on it. pipelined_m is the best feasible family (2336 vs 3925 for pipelined) and its best design is at m=6 with throughput 59.9, close to the 50 MSPS limit. The next round concentrates on pipelined_m near that region, pushing data_width and n_iter slightly lower and m higher to cut area and power. A smaller share goes to pipelined as a cross-check.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.838e+04 (gain this round: +3.0%).
Feasible designs: 53 of 200 evaluations (48 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 16% violate; best seen 264
- max_abs_err <= 9.53674e-07: 72% violate; best seen 1.92e-07 (2^-22.31)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=2336, power_index=4.39, luts=1939, ffs=398, throughput_msps=59.9, max_abs_err=8.1e-07 (2^-20.23)
Front coverage: luts_plus_ffs 2336..2336 (HV reference 8000); power_index 4.39..4.39 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 19.69 bits
- pipelined: 48 evals, 15 feasible; max throughput seen 264 MSPS; best accuracy 22.14 bits; best feasible luts_plus_ffs=3925; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 138 evals, 38 feasible; max throughput seen 158 MSPS; best accuracy 22.31 bits; best feasible luts_plus_ffs=2336; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard -1..3, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate on the narrow feasible region of pipelined_m, where the front starts, and extend toward cheaper designs (lower width, N and guard bits, higher m). Keep a small pipelined share as a cross-check.*)
- `pipelined_m` (32 evals): data_width=22..26, n_iter=19..25, angle_guard=-1..3, frac_guard=0..3, rounding=round|trunc, m=3..8. *Why:* Best family so far. This range probes smaller widths and iteration counts and larger m to trade Fmax margin (59.9 vs the 50 limit) for lower area and power.
- `pipelined` (8 evals): data_width=23..26, n_iter=20..25, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round. *Why:* It is feasible with high throughput (up to 264 MSPS) but larger in area, so it gets a small share to check whether it can reach the low-power end of the front.

**Result (code):** 40 evaluations this round, 240 total; 67 feasible; hypervolume 8.838e+04 (+0.0%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible is available. The constraints are met: the front has one feasible design (pipelined_m, W=25, N=22, m=6) at 2336 LUTs+FFs and power index 4.39, with throughput 59.9 MSPS and max error 8.1e-07, inside the 9.54e-07 limit. Hypervolume gained +0.0% this round, so the search has stopped improving. unrolled_k reached only 7.79 MSPS with 0 feasible designs, and pipelined's best feasible area (3925) is well above pipelined_m's. Iterative is unexplored, but its N+3 cycles/result makes 50 MSPS very unlikely at the 20+ iterations needed for 2^-20 accuracy. The result is therefore not infeasible, and the design to select is the minimum-area one.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8.838e+04 (gain this round: +0.0%).
Feasible designs: 67 of 240 evaluations (58 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 15% violate; best seen 264
- max_abs_err <= 9.53674e-07: 69% violate; best seen 1.92e-07 (2^-22.31)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=1 rounding=round m=6] luts_plus_ffs=2336, power_index=4.39, luts=1939, ffs=398, throughput_msps=59.9, max_abs_err=8.1e-07 (2^-20.23)
Front coverage: luts_plus_ffs 2336..2336 (HV reference 8000); power_index 4.39..4.39 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 19.69 bits
- pipelined: 56 evals, 17 feasible; max throughput seen 264 MSPS; best accuracy 22.14 bits; best feasible luts_plus_ffs=3925; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 170 evals, 50 feasible; max throughput seen 158 MSPS; best accuracy 22.31 bits; best feasible luts_plus_ffs=2336; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard -1..3, frac_guard 0..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=24..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 180 feasible; hypervolume 8.839e+04 (+0.0%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible is available. The constraints are met: the front has one feasible design (pipelined_m, W=25, N=22, m=6) at 2336 LUTs+FFs and power index 4.39, with throughput 59.9 MSPS and max error 8.1e-07, inside the 9.54e-07 limit. Hypervolume gained +0.0% this round, so the search has stopped improving. unrolled_k reached only 7.79 MSPS with 0 feasible designs, and pipelined's best feasible area (3925) is well above pipelined_m's. Iterative is unexplored, but its N+3 cycles/result makes 50 MSPS very unlikely at the 20+ iterations needed for 2^-20 accuracy. The result is therefore not infeasible, and the design to select is the minimum-area one.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.839e+04 (gain this round: +0.0%).
Feasible designs: 180 of 400 evaluations (161 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 13% violate; best seen 264
- max_abs_err <= 9.53674e-07: 50% violate; best seen 2.61e-08 (2^-25.19)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2336, power_index=4.39, luts=1930, ffs=406, throughput_msps=59.9, max_abs_err=7.83e-07 (2^-20.28)
Front coverage: luts_plus_ffs 2336..2336 (HV reference 8000); power_index 4.39..4.39 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 19.69 bits
- pipelined: 56 evals, 17 feasible; max throughput seen 264 MSPS; best accuracy 22.14 bits; best feasible luts_plus_ffs=3925; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 330 evals, 163 feasible; max throughput seen 158 MSPS; best accuracy 25.19 bits; best feasible luts_plus_ffs=2336; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 17122 in, 4395 out
- provider-reported cost: $0.0782
- full prompts and replies: `llm_trace.jsonl`

