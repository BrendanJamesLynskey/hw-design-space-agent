# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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
`pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1930 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 406 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.39 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.83e-07 (2^-20.28) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.1 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.13e-07 (2^-22.17) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.57 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc,m=7` | 1930 | 406 | 52.0 | 6 | 4.39 | 7.83e-07 (2^-20.28) | 20.28 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *An error of 2^-20 or less needs an output LSB below that, so data_width is about 21 or more, with enough iterations (about 19 or more) and guard bits to keep error under the bound. At that precision the iterative and unrolled_k families take roughly N/k+3 or more cycles per result. That is almost certainly too few results per cycle to reach 50 MSPS at any plausible Fmax, so I am leaving them out of round 1 and can revisit if the data contradicts this. The budget goes to the pipelined families, which give 1 result/cycle and need only about 50 MHz. The search is for the cheapest bit-width, iteration and guard-bit combination that just meets the accuracy bound, with pipeline register spacing (m) trading FFs and power against Fmax. Later rounds should narrow these ranges around the accuracy boundary.*)
- `pipelined_m` (67 evals): data_width=21..26, n_iter=19..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Gives 1 result/cycle, so 50 MSPS only needs a modest Fmax. Registering every m stages should cut FFs and power versus a full pipeline, while the m=2..8 range still leaves Fmax to be traded off.
- `pipelined` (33 evals): data_width=21..26, n_iter=19..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* This is the m=1 baseline, which meets the throughput constraint by construction. It anchors the front and shows how much area the m>1 variants save.

**Result (code):** 100 evaluations this round, 100 total; 34 feasible; hypervolume 8.839e+04 (n/a).

**LLM decision:** `refine` — Only pipelined_m has a competitive feasible front. Its best feasible area is 2336 (the sole Pareto point, m=7, 52 MSPS, error 2^-20.28), against 4624 for pipelined. The throughput margin is thin at 52 against a 50 MSPS floor, so m should stay high but not go past what Fmax allows. Accuracy is the binding constraint, with 65% of evaluations violating it. Feasible points so far sit at data_width 24..26 and n_iter 22..26, but data_width 21..23 with rounding=round was barely sampled, and smaller widths would cut both area and power. I am not adding iterative or unrolled_k. They deliver one result every N/k+3 cycles or more, and N must be about 20 or more for 2^-20 accuracy. Meeting 50 MSPS would then need an Fmax the pipelined_m results (158 MSPS best) suggest is out of reach. Pipelined stays in at a small share as a cross-check at the higher-throughput end. The next round narrows to the feasible region, extends data_width and n_iter downward, and adds the rounding choice and m 4..8.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.839e+04 (gain this round: n/a (first round)).
Feasible designs: 34 of 100 evaluations (21 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 1% violate; best seen 257
- max_abs_err <= 9.53674e-07: 65% violate; best seen 1.89e-07 (2^-22.33)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2336, power_index=4.39, luts=1930, ffs=406, throughput_msps=52, max_abs_err=7.83e-07 (2^-20.28)

Per family:
- pipelined: 33 evals, 6 feasible; max throughput seen 257 MSPS; best accuracy 22.33 bits; best feasible luts_plus_ffs=4624; feasible ranges: data_width 26..26, n_iter 24..25, angle_guard 2..3, frac_guard 4..4
- pipelined_m: 67 evals, 28 feasible; max throughput seen 158 MSPS; best accuracy 22.31 bits; best feasible luts_plus_ffs=2336; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 0..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on pipelined_m around the accuracy boundary (about 2^-20), extend the width and iteration ranges downward, and explore rounding and larger m.*)
- `pipelined_m` (80 evals): data_width=21..26, n_iter=19..25, angle_guard=0..3, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* Holds the only front point. Probes smaller data_width and n_iter, rounding=round, and larger m to cut area and power while staying above 50 MSPS and 2^-20 error.
- `pipelined` (20 evals): data_width=22..26, n_iter=20..25, angle_guard=0..3, frac_guard=0..4, rounding=trunc|round. *Why:* A small share to check whether a lean pipelined design with round and lower width can compete on area, given 6 feasible points and a best area of 4624 in round 1.

**Result (code):** 100 evaluations this round, 200 total; 63 feasible; hypervolume 8.839e+04 (+0.0%).

**LLM decision:** `refine` — The hypervolume gain was +0.0% and the front is a single point (pipelined_m, W=26, N=22, m=7, 2336 LUTs+FFs, power 4.39, 52 MSPS). Only about 32% of evaluations met the error bound, and all feasible ones sit in data_width 24..26 and n_iter 22..26. iterative and unrolled_k look unable to reach 50 MSPS. Meeting 2^-20 needs n_iter of about 22 or more, so iterative needs at least 25 cycles per result, which means Fmax of at least 1250 MHz. The best Fmax implied by the summary is 264 MSPS. unrolled_k with k=8 still needs about 6 cycles per result, which means roughly 300 MHz with 8 chained stages, which looks out of reach. So I will not spend budget on those families. The remaining gain is in pipelined_m with larger m, which uses fewer registers but approaches the 50 MSPS limit (the front point is at 52). I will concentrate there, probing slightly smaller widths and guard bits, with a small share for pipelined as a comparison.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.839e+04 (gain this round: +0.0%).
Feasible designs: 63 of 200 evaluations (49 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 2% violate; best seen 264
- max_abs_err <= 9.53674e-07: 68% violate; best seen 1.67e-07 (2^-22.51)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2336, power_index=4.39, luts=1930, ffs=406, throughput_msps=52, max_abs_err=7.83e-07 (2^-20.28)

Per family:
- pipelined: 53 evals, 12 feasible; max throughput seen 264 MSPS; best accuracy 22.33 bits; best feasible luts_plus_ffs=3846; feasible ranges: data_width 24..26, n_iter 22..25, angle_guard 1..3, frac_guard 1..4
- pipelined_m: 147 evals, 51 feasible; max throughput seen 158 MSPS; best accuracy 22.51 bits; best feasible luts_plus_ffs=2336; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 11559 in, 4427 out
- provider-reported cost: $0.0674
- full prompts and replies: `llm_trace.jsonl`

