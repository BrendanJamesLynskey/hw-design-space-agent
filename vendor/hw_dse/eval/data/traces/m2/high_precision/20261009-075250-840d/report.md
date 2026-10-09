# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
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
`pipelined_m:data_width=25,n_iter=24,angle_guard=2,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 2017 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 389 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.53 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 8.15e-07 (2^-20.23) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.84 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 1.89e-07 (2^-22.33) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.59 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.2 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=25,n_iter=24,angle_guard=2,frac_guard=0,rounding=round,m=6` | 2017 | 389 | 59.9 | 6 | 4.53 | 8.15e-07 (2^-20.23) | 20.23 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec has two hard constraints: max_abs_err <= 2^-20 and throughput >= 50 MSPS. Throughput is the binding architectural filter: iterative and unrolled_k emit one result every several cycles, so their throughput = Fmax / (cycles_per_result). Even at a generous Fmax this makes >=50 MSPS very hard, and they also carry the same accuracy cost for less throughput, so they are poor candidates and I exclude them to concentrate the budget. pipelined and pipelined_m both give 1 result/cycle (throughput = Fmax), so the constraint reduces to Fmax >= 50 MHz, which is achievable if the per-stage logic is not too deep. Accuracy depends only on data_width, n_iter, angle_guard, frac_guard, rounding (identical bits across families), so I focus both families on the high-accuracy region (W>=22, N>=20) where the 2^-20 error bound is met, and leave angle_guard/frac_guard/rounding open to let Optuna find the cheapest guard/rounding combination that still satisfies the error bound. The two families are searched in parallel because pipelined (m=1) minimises FFs while pipelined_m (m>1) buys Fmax headroom at FF cost; together they span the area/power trade-off curve that the hypervolume rewards. Selection is min luts_plus_ffs, so the front's low-area end (likely pipelined or small-m pipelined_m) is what gets picked, but mapping both keeps the front complete. If the first round shows Fmax < 50 MHz across the board, I will narrow toward larger m / smaller n_iter in a follow-up round.*)
- `pipelined` (50 evals): data_width=22..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so throughput = Fmax(MHz). To hit >=50 MSPS we need Fmax >= 50 MHz, which the deep N+2 latency chain must sustain. This is the natural home for the high-accuracy (max_abs_err <= 2^-20) corner, and its area/power trade-off vs n_iter/guards is the main curve to map. Focused on the high-accuracy region (W>=22, N>=20) where the error constraint binds.
- `pipelined_m` (50 evals): data_width=22..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Same 1-result/cycle throughput as pipelined, but registering every m stages shortens the critical path (higher Fmax, easier to clear 50 MHz) at the cost of extra FFs. This is the key area-vs-power/Fmax trade-off for the high-accuracy corner and likely where the min-luts_plus_ffs selection point lives. m is the dominant knob, so it gets full range.

**Result (code):** 100 evaluations this round, 100 total; 71 feasible; hypervolume 8.53e+04 (n/a).

**LLM decision:** `add_family` — The current Pareto front is a single point (pipelined_m, 2455 LUTs+FFs) with very low throughput (52 MSPS), barely meeting the 50 MSPS constraint. The `pipelined` family achieved much higher throughput (up to 257 MSPS) but at a significantly higher area cost (best feasible 4071 LUTs+FFs). To properly map the trade-off between area and throughput/power, we need to explore the `unrolled_k` family. `unrolled_k` offers a middle ground: it can achieve higher throughput than `pipelined_m` (by chaining k rotations/cycle) while potentially using less area than fully pipelined designs (by sharing datapaths more aggressively than `pipelined`, though less than `iterative`). Specifically, `unrolled_k` with moderate k (e.g., 2-4) and high n_iter/data_width might find designs that are significantly smaller than the `pipelined` best (4071) while maintaining the required 50 MSPS throughput, potentially expanding the Pareto front towards lower area. The `iterative` family is likely too slow (1 result/cycle) to meet 50 MSPS unless Fmax is extremely high, which is unlikely given the area constraints, so `unrolled_k` is the more promising unexplored family for this spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.53e+04 (gain this round: n/a (first round)).
Feasible designs: 71 of 100 evaluations (59 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 5% violate; best seen 257
- max_abs_err <= 9.53674e-07: 26% violate; best seen 4.07e-08 (2^-24.55)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2455, power_index=4.62, luts=2045, ffs=410, throughput_msps=52, max_abs_err=5.25e-07 (2^-20.86)
Front coverage: luts_plus_ffs 2455..2455 (HV reference 8000); power_index 4.62..4.62 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- pipelined: 50 evals, 36 feasible; max throughput seen 257 MSPS; best accuracy 24.55 bits; best feasible luts_plus_ffs=4071; feasible ranges: data_width 25..28, n_iter 23..30, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 50 evals, 35 feasible; max throughput seen 153 MSPS; best accuracy 23.83 bits; best feasible luts_plus_ffs=2455; feasible ranges: data_width 24..27, n_iter 22..27, angle_guard 0..4, frac_guard 0..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Add unrolled_k family to explore the middle ground between pipelined_m (low area, low throughput) and pipelined (high throughput, high area). This should expand the Pareto front and potentially find designs with lower area than the current pipelined best while meeting the 50 MSPS constraint.*)
- `unrolled_k` (100 evals): data_width=24..28, n_iter=22..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, k=2..6. *Why:* Explore unrolled_k to find designs with better area/throughput trade-offs than pipelined_m (too slow) and pipelined (too large). Focus on k=2..6 to balance throughput and area.

**Result (code):** 100 evaluations this round, 200 total; 71 feasible; hypervolume 8.53e+04 (+0.0%).

**LLM decision:** `refine` — The current Pareto front consists of a single point (pipelined_m, 2455 LUTs+FFs, 4.62 power). The pipelined family achieved higher throughput (257 MSPS) but with significantly higher area (4071 LUTs+FFs). To maximize hypervolume, we need to explore the trade-off space between these two extremes. Specifically, we should investigate if pipelined_m can achieve higher throughput (lower latency/higher Fmax) by reducing 'm' or 'n_iter' while maintaining accuracy, or if pipelined can reduce area by lowering 'data_width' or 'n_iter' closer to the minimum required for accuracy (20 bits). The current front is too narrow (single point) to capture the full trade-off curve. We will refine the search ranges to focus on the boundary of feasibility for both families, specifically targeting the area where throughput is just above 50 MSPS to minimize area, and where area is minimized while maintaining throughput.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.53e+04 (gain this round: +0.0%).
Feasible designs: 71 of 200 evaluations (59 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 52% violate; best seen 257
- max_abs_err <= 9.53674e-07: 19% violate; best seen 2.41e-08 (2^-25.31)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2455, power_index=4.62, luts=2045, ffs=410, throughput_msps=52, max_abs_err=5.25e-07 (2^-20.86)
Front coverage: luts_plus_ffs 2455..2455 (HV reference 8000); power_index 4.62..4.62 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 7.17 MSPS; best accuracy 25.31 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 257 MSPS; best accuracy 24.55 bits; best feasible luts_plus_ffs=4071; feasible ranges: data_width 25..28, n_iter 23..30, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 50 evals, 35 feasible; max throughput seen 153 MSPS; best accuracy 23.83 bits; best feasible luts_plus_ffs=2455; feasible ranges: data_width 24..27, n_iter 22..27, angle_guard 0..4, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (200 evals): data_width=25..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 209 feasible; hypervolume 8.656e+04 (+1.5%).

**No LLM call** (code's front-mapping round): The current Pareto front consists of a single point (pipelined_m, 2455 LUTs+FFs, 4.62 power). The pipelined family achieved higher throughput (257 MSPS) but with significantly higher area (4071 LUTs+FFs). To maximize hypervolume, we need to explore the trade-off space between these two extremes. Specifically, we should investigate if pipelined_m can achieve higher throughput (lower latency/higher Fmax) by reducing 'm' or 'n_iter' while maintaining accuracy, or if pipelined can reduce area by lowering 'data_width' or 'n_iter' closer to the minimum required for accuracy (20 bits). The current front is too narrow (single point) to capture the full trade-off curve. We will refine the search ranges to focus on the boundary of feasibility for both families, specifically targeting the area where throughput is just above 50 MSPS to minimize area, and where area is minimized while maintaining throughput.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.656e+04 (gain this round: +1.5%).
Feasible designs: 209 of 400 evaluations (181 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 34% violate; best seen 257
- max_abs_err <= 9.53674e-07: 20% violate; best seen 2.41e-08 (2^-25.31)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=24 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=2406, power_index=4.53, luts=2017, ffs=389, throughput_msps=59.9, max_abs_err=8.15e-07 (2^-20.23)
Front coverage: luts_plus_ffs 2406..2406 (HV reference 8000); power_index 4.53..4.53 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 7.17 MSPS; best accuracy 25.31 bits
- pipelined: 50 evals, 36 feasible; max throughput seen 257 MSPS; best accuracy 24.55 bits; best feasible luts_plus_ffs=4071; feasible ranges: data_width 25..28, n_iter 23..30, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 250 evals, 173 feasible; max throughput seen 158 MSPS; best accuracy 24.93 bits; best feasible luts_plus_ffs=2406; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 5786 in, 2667 out
- provider-reported cost: $0.0076
- full prompts and replies: `llm_trace.jsonl`

