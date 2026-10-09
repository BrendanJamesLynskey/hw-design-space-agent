# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=1,rounding=trunc,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1976 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 395 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.46 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 8.19e-07 (2^-20.22) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.87 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 1.9e-07 (2^-22.33) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.59 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.2 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=1,rounding=trunc,m=7` | 1976 | 395 | 52.0 | 6 | 4.46 | 8.19e-07 (2^-20.22) | 20.22 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *An error of at most 2^-20 forces roughly W>=22-23 and N around 20-24, so the ranges are centred there with some margin for guard bits. The iterative family is excluded because N+3 cycles per result would need an implausibly high clock for 50 MSPS. Most of the budget goes to pipelined_m and pipelined, which meet throughput easily, plus a small probe of unrolled_k. Later rounds will narrow the width, iteration and guard ranges around whichever family reaches the front.*)
- `pipelined_m` (58 evals): data_width=21..26, n_iter=19..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Gives 1 result/cycle, so 50 MSPS only needs a modest Fmax. Registering every m stages cuts FFs and likely power versus a full pipeline, which favours both objectives.
- `pipelined` (28 evals): data_width=21..26, n_iter=19..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* This is the m=1 reference point and a safe feasible baseline. It anchors the front and shows how much area the pipeline registers cost.
- `unrolled_k` (14 evals): data_width=21..26, n_iter=19..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* A small probe. With N about 22 and k up to 8 it needs about 6 cycles per result, so 50 MSPS needs a high Fmax. It could still win on area if the clock allows.

**Result (code):** 100 evaluations this round, 100 total; 30 feasible; hypervolume 8.666e+04 (n/a).

**LLM decision:** `refine` — The front has only one design (pipelined_m, 2403 LUTs+FFs, power 4.52), so it needs more coverage before code maps it. unrolled_k had 0 feasible of 14 evals and a best throughput of 6.55 MSPS, so I am dropping it. The iterative family needs N+3 cycles per result. At N of about 22 or more, meeting 50 MSPS would need Fmax of roughly 1.2 GHz, so I am not exploring it. pipelined_m gave the best area (2403 vs 4140 for pipelined), and its feasible region is data_width 26 and n_iter 23..26, with m up to 6 still reaching 59.9 MSPS. I will probe larger m (up to 8) and slightly smaller data_width and n_iter to cut area and power while keeping error at or below 2^-20. I will keep a small share for pipelined as a baseline.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.666e+04 (gain this round: n/a (first round)).
Feasible designs: 30 of 100 evaluations (26 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 22% violate; best seen 257
- max_abs_err <= 9.53674e-07: 66% violate; best seen 1.52e-07 (2^-22.65)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=2 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=2403, power_index=4.52, luts=1999, ffs=404, throughput_msps=59.9, max_abs_err=8.51e-07 (2^-20.16)
Front coverage: luts_plus_ffs 2403..2403 (HV reference 8000); power_index 4.52..4.52 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 6.55 MSPS; best accuracy 19.86 bits
- pipelined: 28 evals, 9 feasible; max throughput seen 257 MSPS; best accuracy 21.63 bits; best feasible luts_plus_ffs=4140; feasible ranges: data_width 24..26, n_iter 24..26, angle_guard 1..3, frac_guard 1..2
- pipelined_m: 58 evals, 21 feasible; max throughput seen 158 MSPS; best accuracy 22.65 bits; best feasible luts_plus_ffs=2403; feasible ranges: data_width 26..26, n_iter 23..26, angle_guard 0..3, frac_guard 0..4, m 2..6
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined_m with larger m and smaller word and iteration counts to push area and power down. Keep pipelined as a minor comparison and drop unrolled_k and iterative on throughput grounds.*)
- `pipelined_m` (80 evals): data_width=22..27, n_iter=20..26, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=4..8. *Why:* This is the only family with a feasible front point at the lowest area. Larger m and slightly smaller width or iteration count may lower area and power while staying above 50 MSPS and within the error limit.
- `pipelined` (20 evals): data_width=22..26, n_iter=20..26, angle_guard=0..3, frac_guard=0..2, rounding=trunc|round. *Why:* It has the highest throughput (257 MSPS) and gives a second trade-off point, with ranges narrowed to the feasible region seen so far.

**Result (code):** 100 evaluations this round, 200 total; 87 feasible; hypervolume 8.681e+04 (+0.2%).

**LLM decision:** `refine` — The front is a single design (pipelined_m, 2396 LUTs+FFs, power 4.51), and HV gain was only +0.2%, so the search is converging on a narrow feasible region. Feasible designs sit at data_width 24..27 and n_iter 22..26, because the 2^-20 error bound needs about 20.3 to 22.6 accuracy bits. Throughput is the binding limit for pipelined_m: the front point reaches 52 MSPS against the 50 floor, and larger m lowers Fmax. Iterative is not worth exploring. It needs N+3 cycles per result, which would require an Fmax above 1 GHz at N of about 22. unrolled_k reached at most 6.55 MSPS with 0 of 14 feasible. I will concentrate on pipelined_m and a smaller pipelined share, with tighter ranges on width, iterations and guard bits to find cheaper designs. Full-range mapping is left to the reserved code-driven search.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.18% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.681e+04 (gain this round: +0.2%).
Feasible designs: 87 of 200 evaluations (71 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 257
- max_abs_err <= 9.53674e-07: 52% violate; best seen 1.52e-07 (2^-22.65)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=2396, power_index=4.51, luts=1999, ffs=398, throughput_msps=52, max_abs_err=7.87e-07 (2^-20.28)
Front coverage: luts_plus_ffs 2396..2396 (HV reference 8000); power_index 4.51..4.51 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 6.55 MSPS; best accuracy 19.86 bits
- pipelined: 48 evals, 15 feasible; max throughput seen 257 MSPS; best accuracy 21.63 bits; best feasible luts_plus_ffs=4065; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 1..2
- pipelined_m: 138 evals, 72 feasible; max throughput seen 158 MSPS; best accuracy 22.65 bits; best feasible luts_plus_ffs=2396; feasible ranges: data_width 24..27, n_iter 22..26, angle_guard 0..3, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (200 evals): data_width=24..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 209 feasible; hypervolume 8.747e+04 (+0.8%).

**No LLM call** (code's front-mapping round): The front is a single design (pipelined_m, 2396 LUTs+FFs, power 4.51), and HV gain was only +0.2%, so the search is converging on a narrow feasible region. Feasible designs sit at data_width 24..27 and n_iter 22..26, because the 2^-20 error bound needs about 20.3 to 22.6 accuracy bits. Throughput is the binding limit for pipelined_m: the front point reaches 52 MSPS against the 50 floor, and larger m lowers Fmax. Iterative is not worth exploring. It needs N+3 cycles per result, which would require an Fmax above 1 GHz at N of about 22. unrolled_k reached at most 6.55 MSPS with 0 of 14 feasible. I will concentrate on pipelined_m and a smaller pipelined share, with tighter ranges on width, iterations and guard bits to find cheaper designs. Full-range mapping is left to the reserved code-driven search.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.747e+04 (gain this round: +0.8%).
Feasible designs: 209 of 400 evaluations (179 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 12% violate; best seen 257
- max_abs_err <= 9.53674e-07: 42% violate; best seen 2.83e-08 (2^-25.08)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2371, power_index=4.46, luts=1976, ffs=395, throughput_msps=52, max_abs_err=8.19e-07 (2^-20.22)
Front coverage: luts_plus_ffs 2371..2371 (HV reference 8000); power_index 4.46..4.46 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 6.55 MSPS; best accuracy 19.86 bits
- pipelined: 48 evals, 15 feasible; max throughput seen 257 MSPS; best accuracy 21.63 bits; best feasible luts_plus_ffs=4065; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 1..2
- pipelined_m: 338 evals, 194 feasible; max throughput seen 158 MSPS; best accuracy 25.08 bits; best feasible luts_plus_ffs=2371; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 12366 in, 4006 out
- provider-reported cost: $0.0648
- full prompts and replies: `llm_trace.jsonl`

