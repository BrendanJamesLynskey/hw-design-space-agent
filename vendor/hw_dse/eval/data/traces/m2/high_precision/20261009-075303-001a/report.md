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
`pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=trunc,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1953 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 391 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 96 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.41 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.48e-07 (2^-20.01) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.95 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.1e-07 (2^-22.18) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.76 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (2 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=trunc,m=7` | 1953 | 391 | 54.3 | 6 | 4.41 | 9.48e-07 (2^-20.01) | 20.01 |
| 1 | `pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=trunc,m=6` | 1953 | 391 | 62.5 | 6 | 4.41 | 9.48e-07 (2^-20.01) | 20.01 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *An error of 2^-20 or less needs an output LSB below that, so W is about 22-24 plus guard bits, and N is about 20. Iterative takes at least N+3 cycles per result, so 50 MSPS would need an implausibly high clock; I excluded it. The first round therefore concentrates on pipelined_m and pipelined, which can produce 1 result/cycle. It adds a small unrolled_k probe. Ranges are narrowed around the accuracy-feasible region to save budget for the area/power trade-off. Later rounds will shrink W, N and the guard bits toward the accuracy boundary.*)
- `pipelined_m` (51 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Registering only every m stages can cut flip-flops (and likely power) while still giving 1 result/cycle. The Fmax this leaves for 50 MSPS is unknown, so m is searched over its full range.
- `pipelined` (37 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* This is the safe 1 result/cycle baseline for reaching 50 MSPS, so it is a reference point on the area/power front.
- `unrolled_k` (12 evals): data_width=21..25, n_iter=18..24, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* Small probe of the smallest-area option. N of about 20 gives at least 6 cycles/result even at k=8, so meeting 50 MSPS needs a high Fmax, and it may well prove infeasible.

**Result (code):** 100 evaluations this round, 100 total; 18 feasible; hypervolume 8.611e+04 (n/a).

**LLM decision:** `refine` — The front has a single design (pipelined_m, area 2424, power 4.56), so coverage is thin and a focused refinement should widen it before the reserved map_front step. Iterative is not worth exploring: it needs N+3 cycles per result, and unrolled_k already peaked at 6.52 MSPS with 0 feasible designs, so both are far below the 50 MSPS floor. The feasible designs are all pipelined_m (data_width 24..26, n_iter 23..26, m 3..6) and pipelined (data_width 25, n_iter 23..24). Accuracy is the binding constraint, since 80% of evaluations violate it and the best seen is 2^-21.5, which leaves some slack. I will therefore probe slightly smaller data_width and n_iter, and use rounding and guard bits to trade area against error. Most of the budget goes to pipelined_m, which has the best area, with a smaller share for pipelined as a comparison. unrolled_k is dropped.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.611e+04 (gain this round: n/a (first round)).
Feasible designs: 18 of 100 evaluations (13 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 22% violate; best seen 264
- max_abs_err <= 9.53674e-07: 80% violate; best seen 3.37e-07 (2^-21.50)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=2424, power_index=4.56, luts=2022, ffs=402, throughput_msps=59.9, max_abs_err=6.35e-07 (2^-20.59)
Front coverage: luts_plus_ffs 2424..2424 (HV reference 8000); power_index 4.56..4.56 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 18.41 bits
- pipelined: 37 evals, 8 feasible; max throughput seen 264 MSPS; best accuracy 20.51 bits; best feasible luts_plus_ffs=3976; feasible ranges: data_width 25..25, n_iter 23..24, angle_guard 1..1, frac_guard 1..4
- pipelined_m: 51 evals, 10 feasible; max throughput seen 158 MSPS; best accuracy 21.50 bits; best feasible luts_plus_ffs=2424; feasible ranges: data_width 24..26, n_iter 23..26, angle_guard 0..2, frac_guard 2..4, m 3..6
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on pipelined_m with a slightly lower-width region and a full rounding and m search, keeping pipelined as a secondary option.*)
- `pipelined_m` (75 evals): data_width=21..26, n_iter=20..26, angle_guard=0..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* It holds the only front point and the best feasible area (2424). Probing smaller data_width, n_iter and guard bits, plus rounding and a wider m range, may cut area and power while keeping error under 2^-20.
- `pipelined` (25 evals): data_width=21..26, n_iter=20..26, angle_guard=0..3, frac_guard=0..4, rounding=trunc|round. *Why:* It is feasible and reaches high throughput (264 MSPS), but its best area is 3976. A smaller share still checks whether lower-width, rounded configurations can compete.

**Result (code):** 100 evaluations this round, 200 total; 64 feasible; hypervolume 8.702e+04 (+1.1%).

**LLM decision:** `refine` — The front has a single design: pipelined_m at W=26, N=22, m=7, with 2388 LUTs+FFs and power index 4.49. Both objectives are barely mapped, so there is room to move. Iterative should not be added, because unrolled_k reached only 6.52 MSPS with 0 of 12 feasible, and iterative is slower still, so the 50 MSPS constraint rules it out. Pipelined_m dominates: 54 of 126 evals are feasible and its best area is 2388, against 3976 for pipelined. Feasible designs sit at data_width 24..26 and n_iter 22..26. Accuracy is the binding constraint (64% of evals violate it). The best seen is 2^-22.76, so there may be headroom to trim width and iterations, and the 7.61e-07 error is close to the 9.54e-07 limit. Throughput is also tight at 52 MSPS, so m is limited at the high end. Next round narrows pipelined_m to the feasible region and probes smaller W and N and the full m range. A small share goes to pipelined as a check on the area/power trade-off.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.702e+04 (gain this round: +1.1%).
Feasible designs: 64 of 200 evaluations (51 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 264
- max_abs_err <= 9.53674e-07: 64% violate; best seen 1.41e-07 (2^-22.76)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=3 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2388, power_index=4.49, luts=1975, ffs=414, throughput_msps=52, max_abs_err=7.61e-07 (2^-20.32)
Front coverage: luts_plus_ffs 2388..2388 (HV reference 8000); power_index 4.49..4.49 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 18.41 bits
- pipelined: 62 evals, 10 feasible; max throughput seen 264 MSPS; best accuracy 21.50 bits; best feasible luts_plus_ffs=3976; feasible ranges: data_width 25..26, n_iter 23..24, angle_guard 1..1, frac_guard 1..4
- pipelined_m: 126 evals, 54 feasible; max throughput seen 158 MSPS; best accuracy 22.76 bits; best feasible luts_plus_ffs=2388; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 1..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate evaluations on pipelined_m near the accuracy boundary to push area and power down, and keep a small pipelined probe.*)
- `pipelined_m` (32 evals): data_width=22..26, n_iter=19..25, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* Best family so far; trim width, iterations and guard bits toward the accuracy limit and probe m for the area/throughput trade-off.
- `pipelined` (8 evals): data_width=23..26, n_iter=20..25, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* Keeps a small probe of the fully pipelined family near its feasible region (W 25..26, N 23..24) in case lower-width points reach the front.

**Result (code):** 40 evaluations this round, 240 total; 79 feasible; hypervolume 8.818e+04 (+1.3%).

**LLM decision:** `stop` — This is the final round, so only stop or infeasible are valid. Feasible designs exist, so infeasible does not apply. The front has 2 designs, both pipelined_m at data_width 25, n_iter 23, angle_guard 1, frac_guard 1, trunc, with m=6 and m=7. Both give luts_plus_ffs=2344 and power_index=4.41, with max_abs_err 9.48e-07, just inside the 9.54e-07 limit, and throughput of 54.3 and 62.5 MSPS, above the 50 MSPS limit. Hypervolume gain last round was only +1.3%, close to the 0.01 epsilon, so the search is converging. Pipelined_m also beats pipelined (best feasible 3976 vs 2344). Unrolled_k reached at most 6.52 MSPS with 0 feasible designs, so it cannot meet the throughput constraint. The selection rule (min luts_plus_ffs) picks 2344.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8.818e+04 (gain this round: +1.3%).
Feasible designs: 79 of 240 evaluations (63 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 264
- max_abs_err <= 9.53674e-07: 62% violate; best seen 1.41e-07 (2^-22.76)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2344, power_index=4.41, luts=1953, ffs=391, throughput_msps=54.3, max_abs_err=9.48e-07 (2^-20.01)
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2344, power_index=4.41, luts=1953, ffs=391, throughput_msps=62.5, max_abs_err=9.48e-07 (2^-20.01)
Front coverage: luts_plus_ffs 2344..2344 (HV reference 8000); power_index 4.41..4.41 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 18.41 bits
- pipelined: 70 evals, 11 feasible; max throughput seen 264 MSPS; best accuracy 21.50 bits; best feasible luts_plus_ffs=3976; feasible ranges: data_width 25..26, n_iter 22..24, angle_guard 1..3, frac_guard 1..4
- pipelined_m: 158 evals, 68 feasible; max throughput seen 158 MSPS; best accuracy 22.76 bits; best feasible luts_plus_ffs=2344; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 1..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=24..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (2 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 194 feasible; hypervolume 8.818e+04 (+0.0%).

**No LLM call** (code's front-mapping round): This is the final round, so only stop or infeasible are valid. Feasible designs exist, so infeasible does not apply. The front has 2 designs, both pipelined_m at data_width 25, n_iter 23, angle_guard 1, frac_guard 1, trunc, with m=6 and m=7. Both give luts_plus_ffs=2344 and power_index=4.41, with max_abs_err 9.48e-07, just inside the 9.54e-07 limit, and throughput of 54.3 and 62.5 MSPS, above the 50 MSPS limit. Hypervolume gain last round was only +1.3%, close to the 0.01 epsilon, so the search is converging. Pipelined_m also beats pipelined (best feasible 3976 vs 2344). Unrolled_k reached at most 6.52 MSPS with 0 feasible designs, so it cannot meet the throughput constraint. The selection rule (min luts_plus_ffs) picks 2344.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.818e+04 (gain this round: +0.0%).
Feasible designs: 194 of 400 evaluations (164 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 11% violate; best seen 264
- max_abs_err <= 9.53674e-07: 47% violate; best seen 3.4e-08 (2^-24.81)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2344, power_index=4.41, luts=1953, ffs=391, throughput_msps=54.3, max_abs_err=9.48e-07 (2^-20.01)
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2344, power_index=4.41, luts=1953, ffs=391, throughput_msps=62.5, max_abs_err=9.48e-07 (2^-20.01)
Front coverage: luts_plus_ffs 2344..2344 (HV reference 8000); power_index 4.41..4.41 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 12 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 18.41 bits
- pipelined: 70 evals, 11 feasible; max throughput seen 264 MSPS; best accuracy 21.50 bits; best feasible luts_plus_ffs=3976; feasible ranges: data_width 25..26, n_iter 22..24, angle_guard 1..3, frac_guard 1..4
- pipelined_m: 318 evals, 183 feasible; max throughput seen 158 MSPS; best accuracy 24.81 bits; best feasible luts_plus_ffs=2344; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 17124 in, 4534 out
- provider-reported cost: $0.0796
- full prompts and replies: `llm_trace.jsonl`

