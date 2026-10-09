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
`pipelined_m:data_width=26,n_iter=22,angle_guard=0,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1864 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 395 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 96 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.25 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.22e-07 (2^-20.05) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 15.5 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.31e-07 (2^-22.04) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.88 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

| tool | LUTs est → meas | FFs est → meas | Fmax MHz est → meas |
|---|---|---|---|
| measured (yosys+nextpnr-xilinx yosys 0.68 (git 38e001a6f) + nextpnr-xilinx 0.8.2-81-g1743d0f4) | 1864 → 1827 (-2.0%) | 396 → 392 (-0.9%) | 62 → 36 (-42.9%) |

Winner check (1 of 1 front designs have measurements): winner unchanged: the selected design is still the best measured front design (it is the only front design with measurements).

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=0,frac_guard=0,rounding=round,m=6` | 1864 | 395 | 62.5 | 6 | 4.25 | 9.22e-07 (2^-20.05) | 20.05 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The accuracy spec (max_abs_err <= 2^-20) forces roughly W >= 22 and N >= 20, and the 50 MSPS throughput constraint then eliminates the multi-cycle families: iterative needs N+3 ~ 23+ cycles (implying >1 GHz) and unrolled_k needs ceil(N/k)+3 cycles with k chained micro-rotations in one clock, which is very unlikely to reach the required clock on a 22+ bit datapath. Only pipelined and pipelined_m give 1 result/cycle, so Fmax >= 50 MHz is sufficient and the whole trade-off becomes area/power vs accuracy. Round 1 therefore maps both pipelined families broadly over data_width 22..28, n_iter 20..30, angle_guard -2..4, frac_guard 0..4 and both rounding modes, with pipelined_m additionally sweeping m = 2..8 (the main FF-saving knob), plus a 10% probe of unrolled_k at maximum k to confirm or refute its feasibility before later rounds concentrate the budget on the surviving front.*)
- `pipelined` (40 evals): data_width=22..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* One result/cycle means the 50 MSPS constraint only needs Fmax >= 50 MHz, which is easily met; this family is the baseline for the area/power front. W >= 22 and N >= 20 are the minimum plausible settings for max_abs_err <= 2^-20, and the guards/rounding sweep the accuracy-vs-area trade-off.
- `pipelined_m` (50 evals): data_width=22..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Also 1 result/cycle, but registering every m stages trades Fmax for fewer pipeline FFs, which is exactly the area objective here since only 50 MSPS is required. Sweeping m = 2..8 with the same accuracy box should reveal the low-area corner of the front.
- `unrolled_k` (10 evals): data_width=22..28, n_iter=20..24, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* Small probe at the highest k (6..8) and shortest N (20..24) to test the best-case throughput of ceil(N/k)+3 cycles; if even this corner cannot reach 50 MSPS at a realistic Fmax for a 22+ bit datapath, the family is confirmed infeasible and the budget stays on the pipelined families.

**Result (code):** 100 evaluations this round, 100 total; 55 feasible; hypervolume 8.351e+04 (n/a).

**LLM decision:** `map_front` — Round 1 yielded only a single feasible Pareto design (pipelined_m, luts_plus_ffs=2525, power_index=4.75), so the front spans 2525..2525 against an HV reference of 8000 and 4.75..4.75 against 20 — a tiny fraction of both objective ranges, leaving most of the trade-off curve unmapped. Both feasible families have wide feasible boxes (pipelined: 29 feasible, best 4018, data_width 26..28, n_iter 23..30; pipelined_m: 26 feasible, best 2525, data_width 24..28, n_iter 22..29, m 2..6), so there is clearly room to spread the front. The unexplored iterative family and the already-tried unrolled_k are throughput-limited (unrolled_k 0 feasible, max 6.52 MSPS), so neither can plausibly reach the 50 MSPS constraint and are not worth budget. Handing this round to code-driven NSGA-II coverage over the full ranges of pipelined and pipelined_m, seeded with the current front, is the best use of the remaining budget.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.351e+04 (gain this round: n/a (first round)).
Feasible designs: 55 of 100 evaluations (44 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 16% violate; best seen 264
- max_abs_err <= 9.53674e-07: 35% violate; best seen 3.6e-08 (2^-24.73)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=23 angle_guard=3 frac_guard=4 rounding=round m=6] luts_plus_ffs=2525, power_index=4.75, luts=2119, ffs=406, throughput_msps=59.9, max_abs_err=4.89e-07 (2^-20.96)
Front coverage: luts_plus_ffs 2525..2525 (HV reference 8000); power_index 4.75..4.75 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 20.92 bits
- pipelined: 40 evals, 29 feasible; max throughput seen 264 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=4018; feasible ranges: data_width 26..28, n_iter 23..30, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 50 evals, 26 feasible; max throughput seen 158 MSPS; best accuracy 24.73 bits; best feasible luts_plus_ffs=2525; feasible ranges: data_width 24..28, n_iter 22..29, angle_guard -1..4, frac_guard 0..4, m 2..6
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=23..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 118 feasible; hypervolume 9.041e+04 (+8.3%).

**LLM decision:** `map_front` — The feasible Pareto front currently contains a single design (pipelined_m, data_width=26, n_iter=22, angle_guard=0, frac_guard=0, rounding=round, m=6) at luts_plus_ffs=2260 and power_index=4.25, so front coverage is degenerate: luts_plus_ffs 2260..2260 against HV ref 8000 and power_index 4.25..4.25 against HV ref 20. Both objectives are essentially unmapped, and hypervolume can only improve by covering the rest of the trade-off curve. The two feasible families are pipelined (29/40 feasible, best luts_plus_ffs=4018, max throughput 264 MSPS) and pipelined_m (89/150 feasible, best luts_plus_ffs=2260, max throughput 158 MSPS); unrolled_k is infeasible (max throughput 6.52 MSPS < 50), and iterative is not worth spending budget on because its N+3 cycles/result at the N>=22 needed for 2^-20 accuracy implies well under 50 MSPS. Therefore this round should be spent mapping the whole front with NSGA-II over the full registry ranges of pipelined and pipelined_m, seeded with the current front, rather than refining a single-point front.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 9.041e+04 (gain this round: +8.3%).
Feasible designs: 118 of 200 evaluations (101 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 264
- max_abs_err <= 9.53674e-07: 30% violate; best seen 3.6e-08 (2^-24.73)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=0 frac_guard=0 rounding=round m=6] luts_plus_ffs=2260, power_index=4.25, luts=1864, ffs=395, throughput_msps=62.5, max_abs_err=9.22e-07 (2^-20.05)
Front coverage: luts_plus_ffs 2260..2260 (HV reference 8000); power_index 4.25..4.25 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 20.92 bits
- pipelined: 40 evals, 29 feasible; max throughput seen 264 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=4018; feasible ranges: data_width 26..28, n_iter 23..30, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 150 evals, 89 feasible; max throughput seen 158 MSPS; best accuracy 24.73 bits; best feasible luts_plus_ffs=2260; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..6
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 186 feasible; hypervolume 9.041e+04 (+0.0%).

**LLM decision:** `map_front` — The feasible Pareto front is a single point (pipelined_m, luts_plus_ffs=2260, power_index=4.25), covering only 2260..2260 of the area range (HV ref 8000) and 4.25..4.25 of the power range (HV ref 20). Hypervolume gain this round was +0.0%, so the current search has stagnated and the front is far too narrow to score well against the reference point. The remaining 100 evaluations are the reserved budget for mapping the front over the full ranges of the families on it. iterative cannot meet the 50 MSPS constraint (accuracy needs N>=20, so N+3>=23 cycles/result, requiring >1.15 GHz at 50 MSPS), and unrolled_k already produced 0 feasible designs (max throughput 6.52 MSPS). pipelined is feasible but dominated on area (best luts_plus_ffs=4018 vs 2260) and runs at a higher clock, so it is not on the front. Therefore the correct use of the final round is to run NSGA-II over the full pipelined_m ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, m 2..8), seeded with the current front, to map the whole trade-off curve and improve hypervolume.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 9.041e+04 (gain this round: +0.0%).
Feasible designs: 186 of 300 evaluations (160 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 264
- max_abs_err <= 9.53674e-07: 26% violate; best seen 2.62e-08 (2^-25.19)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=0 frac_guard=0 rounding=round m=6] luts_plus_ffs=2260, power_index=4.25, luts=1864, ffs=395, throughput_msps=62.5, max_abs_err=9.22e-07 (2^-20.05)
Front coverage: luts_plus_ffs 2260..2260 (HV reference 8000); power_index 4.25..4.25 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 20.92 bits
- pipelined: 40 evals, 29 feasible; max throughput seen 264 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=4018; feasible ranges: data_width 26..28, n_iter 23..30, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 250 evals, 157 feasible; max throughput seen 158 MSPS; best accuracy 25.19 bits; best feasible luts_plus_ffs=2260; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 254 feasible; hypervolume 9.041e+04 (+0.0%).

**LLM decision:** `stop` — Budget and round cap are both exhausted (400/400 evals, round 4 of 4) and the front did not improve this round (+0.0% HV), so no further exploration is possible. The spec is feasible, not infeasible: pipelined_m [data_width=26, n_iter=22, angle_guard=0, frac_guard=0, rounding=round, m=6] satisfies both constraints with luts_plus_ffs=2260, power_index=4.25, throughput_msps=62.5 (>= 50) and max_abs_err=9.22e-07 (2^-20.05, <= 9.53674e-07). It is also the selection-rule winner (min luts_plus_ffs) and sits far below both HV reference points (8000 area, 20 power), so the front is good enough to stop on. Note the front is a single point, but with zero remaining budget and no gain this round there is nothing further to map; the unrolled_k family was already shown infeasible on throughput (max 6.52 MSPS) and iterative was never needed since pipelined_m meets the spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 9.041e+04 (gain this round: +0.0%).
Feasible designs: 254 of 400 evaluations (212 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 264
- max_abs_err <= 9.53674e-07: 26% violate; best seen 2.42e-08 (2^-25.30)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=0 frac_guard=0 rounding=round m=6] luts_plus_ffs=2260, power_index=4.25, luts=1864, ffs=395, throughput_msps=62.5, max_abs_err=9.22e-07 (2^-20.05)
Front coverage: luts_plus_ffs 2260..2260 (HV reference 8000); power_index 4.25..4.25 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 20.92 bits
- pipelined: 40 evals, 29 feasible; max throughput seen 264 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=4018; feasible ranges: data_width 26..28, n_iter 23..30, angle_guard -1..4, frac_guard 0..4
- pipelined_m: 350 evals, 225 feasible; max throughput seen 158 MSPS; best accuracy 25.30 bits; best feasible luts_plus_ffs=2260; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 12337 in, 7985 out
- provider-reported cost: $0.0091
- full prompts and replies: `llm_trace.jsonl`

