# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=3,rounding=trunc,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1999 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 393 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.07e-07 (2^-20.07) | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 3.8 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2e-07 (2^-22.26) | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 0.837 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.1 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=3,rounding=trunc,m=7` | 1999 | 393 | 52.0 | 6 | 4.5 | 9.07e-07 (2^-20.07) | 20.07 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Accuracy is family-independent and needs roughly W>=22 (output LSB 2^-(W-2)) plus N>=20 micro-rotations to push max_abs_err under 2^-20, so I search data_width 21..28 and n_iter 18..30 with the full guard/rounding space to let the search find the smallest feasible point (area is the primary objective). Throughput rules out `iterative` outright (N+3 ~ 25 cycles/result would need >1 GHz), so I spend nothing on it. The two pipelined families give 1 result/cycle and therefore meet 50 MSPS at any realistic Fmax; pipelined_m gets the largest share because its m parameter directly trades register count (FFs, hence luts_plus_ffs) against Fmax, which is the main axis of the area/power front. unrolled_k gets a small probe at k=6..8 to verify it cannot reach 50 MSPS. Round 1 is deliberately broad on W/N so later rounds can narrow onto the accuracy-feasible boundary and the m/Fmax trade-off.*)
- `pipelined_m` (45 evals): data_width=21..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* 1 result/cycle makes the 50 MSPS constraint easy (needs only Fmax>=50 MHz), and registering every m stages cuts the FF count that dominates luts_plus_ffs, so this is the most likely area/power winner; m trades register count against Fmax, which is exactly the front we need to map.
- `pipelined` (40 evals): data_width=21..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Full per-stage pipelining gives the highest Fmax at 1 result/cycle and is the reference point for the area/power front; it has the most FFs, so it anchors the high-area end of the trade-off curve against pipelined_m.
- `unrolled_k` (15 evals): data_width=21..28, n_iter=16..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* Small probe at the highest k only: with N~20-24 it needs ceil(N/k)+3 ~ 6 cycles/result, i.e. Fmax >= ~300 MHz, which is unlikely on Artix-7, but a few points confirm whether it can contribute to the front before we drop it.

**Result (code):** 100 evaluations this round, 100 total; 41 feasible; hypervolume 8.285e+04 (n/a).

**LLM decision:** `map_front` — The feasible Pareto front is a single point: pipelined_m [W=25 N=25 ag=2 fg=1 trunc m=7] at luts_plus_ffs=2550, power_index=4.8, throughput=52 MSPS, err=2^-20.24. It covers essentially none of either objective's range (luts_plus_ffs 2550..2550 vs HV ref 8000; power_index 4.8..4.8 vs ref 20), so HV=8.285e4 is just the single-point rectangle and there is no trade-off curve yet. Both families on the front (pipelined: 15 feasible, best area 3972; pipelined_m: 26 feasible, best area 2550) have wide feasible ranges (W 25..28, N 22..29, ag -1..4, fg 0..4, m 2..7) that are clearly under-sampled. The unrolled_k family is throughput-starved (max 6.52 MSPS, 0 feasible) and iterative is structurally worse (N+3 cycles/result, so >=50 MSPS would need N<=~7, far below the ~20-bit accuracy requirement), so neither belongs on the front. Handing this round to a seeded NSGA-II coverage search over the full ranges of pipelined and pipelined_m is the right way to spread the front across the area/power trade-off before the reserved final mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.285e+04 (gain this round: n/a (first round)).
Feasible designs: 41 of 100 evaluations (35 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 17% violate; best seen 264
- max_abs_err <= 9.53674e-07: 51% violate; best seen 4.86e-08 (2^-24.29)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=25 angle_guard=2 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2550, power_index=4.8, luts=2155, ffs=395, throughput_msps=52, max_abs_err=8.07e-07 (2^-20.24)
Front coverage: luts_plus_ffs 2550..2550 (HV reference 8000); power_index 4.8..4.8 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 21.90 bits
- pipelined: 40 evals, 15 feasible; max throughput seen 264 MSPS; best accuracy 24.29 bits; best feasible luts_plus_ffs=3972; feasible ranges: data_width 25..28, n_iter 22..28, angle_guard -1..2, frac_guard 0..4
- pipelined_m: 45 evals, 26 feasible; max throughput seen 153 MSPS; best accuracy 23.23 bits; best feasible luts_plus_ffs=2550; feasible ranges: data_width 25..28, n_iter 24..29, angle_guard 0..4, frac_guard 0..3, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=24..28, n_iter=23..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 119 feasible; hypervolume 8.692e+04 (+4.9%).

**LLM decision:** `map_front` — The feasible front is a single point: pipelined_m [W=24 N=23 ag=2 fg=3 trunc m=7] at luts_plus_ffs=2392, power_index=4.5. Coverage is therefore 2392..2392 against an HV reference of 8000, and 4.5..4.5 against a reference of 20 — a negligible fraction of both objective ranges, so hypervolume is being left on the table even though the selection-rule corner (min luts_plus_ffs) is already found. Only pipelined (15 feasible, up to 264 MSPS, best area 3972) and pipelined_m (104 feasible, best area 2392) can satisfy throughput >= 50 MSPS: unrolled_k saw 0 feasible with max 6.52 MSPS, and iterative's 1-result-per-(N+3)-cycles schedule would need Fmax well above 1 GHz for N~23, so neither belongs on the front. The right use of the remaining 200 evals is to let NSGA-II map the full registry ranges of pipelined and pipelined_m seeded with the current front, which both widens the trade-off curve and may find lower-area designs that still sit just under the 2^-20 error limit (the incumbent is at 2^-20.07, i.e. only marginally inside the constraint).

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.692e+04 (gain this round: +4.9%).
Feasible designs: 119 of 200 evaluations (102 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 12% violate; best seen 264
- max_abs_err <= 9.53674e-07: 34% violate; best seen 2.83e-08 (2^-25.08)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=2392, power_index=4.5, luts=1999, ffs=393, throughput_msps=52, max_abs_err=9.07e-07 (2^-20.07)
Front coverage: luts_plus_ffs 2392..2392 (HV reference 8000); power_index 4.5..4.5 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 21.90 bits
- pipelined: 40 evals, 15 feasible; max throughput seen 264 MSPS; best accuracy 24.29 bits; best feasible luts_plus_ffs=3972; feasible ranges: data_width 25..28, n_iter 22..28, angle_guard -1..2, frac_guard 0..4
- pipelined_m: 145 evals, 104 feasible; max throughput seen 153 MSPS; best accuracy 25.08 bits; best feasible luts_plus_ffs=2392; feasible ranges: data_width 24..28, n_iter 23..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=23..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 181 feasible; hypervolume 8.692e+04 (+0.0%).

**LLM decision:** `map_front` — The feasible front collapsed to a single design (pipelined_m, luts_plus_ffs=2392, power_index=4.5), so hypervolume gain is +0.0% and coverage is minimal against both references (2392 vs 8000; 4.5 vs 20). With 100 evals left in the final round, the reserved budget is best spent letting code map the whole trade-off curve over the full ranges of the families that actually reach the front (pipelined_m and pipelined), seeded with the current point. Adding the unexplored `iterative` family is not worthwhile: it yields one result per N+3 cycles, and the slowest already-explored family (unrolled_k) topped out at 6.52 MSPS with 0 feasible designs, so iterative cannot approach the 50 MSPS constraint. Refining around the single point would only deepen one corner rather than widen the front.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 8.692e+04 (gain this round: +0.0%).
Feasible designs: 181 of 300 evaluations (158 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 11% violate; best seen 264
- max_abs_err <= 9.53674e-07: 32% violate; best seen 2.83e-08 (2^-25.08)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=2392, power_index=4.5, luts=1999, ffs=393, throughput_msps=52, max_abs_err=9.07e-07 (2^-20.07)
Front coverage: luts_plus_ffs 2392..2392 (HV reference 8000); power_index 4.5..4.5 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 21.90 bits
- pipelined: 40 evals, 15 feasible; max throughput seen 264 MSPS; best accuracy 24.29 bits; best feasible luts_plus_ffs=3972; feasible ranges: data_width 25..28, n_iter 22..28, angle_guard -1..2, frac_guard 0..4
- pipelined_m: 245 evals, 166 feasible; max throughput seen 158 MSPS; best accuracy 25.08 bits; best feasible luts_plus_ffs=2392; feasible ranges: data_width 24..28, n_iter 23..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=23..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 237 feasible; hypervolume 8.692e+04 (+0.0%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4), and the last round produced zero hypervolume gain (+0.0%), so further search is not warranted. The spec is satisfiable: 237 of 400 evaluations are feasible, with 209 unique designs, and the Pareto front contains a valid design — pipelined_m [data_width=24, n_iter=23, angle_guard=2, frac_guard=3, rounding=trunc, m=7] at luts_plus_ffs=2392, power_index=4.5, throughput_msps=52 (>= 50) and max_abs_err=9.07e-07 (2^-20.07, within the 2^-20 bound). So `infeasible` is not justified. The front is narrow (single point, luts_plus_ffs 2392..2392, power_index 4.5..4.5) but it already sits far inside both HV reference points (8000 and 20), and the selection rule (min luts_plus_ffs) picks exactly this design. The unexplored `iterative` family cannot help: it yields one result every N+3 cycles, and the best throughput seen anywhere in the low-throughput direction (unrolled_k, 6.52 MSPS) is far below the 50 MSPS constraint, so iterative cannot produce a feasible point. Stopping with the current feasible front is the correct terminal action.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.692e+04 (gain this round: +0.0%).
Feasible designs: 237 of 400 evaluations (209 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 264
- max_abs_err <= 9.53674e-07: 31% violate; best seen 2.62e-08 (2^-25.19)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=3 rounding=trunc m=7] luts_plus_ffs=2392, power_index=4.5, luts=1999, ffs=393, throughput_msps=52, max_abs_err=9.07e-07 (2^-20.07)
Front coverage: luts_plus_ffs 2392..2392 (HV reference 8000); power_index 4.5..4.5 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- unrolled_k: 15 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 21.90 bits
- pipelined: 40 evals, 15 feasible; max throughput seen 264 MSPS; best accuracy 24.29 bits; best feasible luts_plus_ffs=3972; feasible ranges: data_width 25..28, n_iter 22..28, angle_guard -1..2, frac_guard 0..4
- pipelined_m: 345 evals, 222 feasible; max throughput seen 158 MSPS; best accuracy 25.19 bits; best feasible luts_plus_ffs=2392; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 12343 in, 6152 out
- provider-reported cost: $0.0072
- full prompts and replies: `llm_trace.jsonl`

