# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
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
`pipelined_m:data_width=27,n_iter=22,angle_guard=-1,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1908 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 406 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.35 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.53e-07 (2^-20.00) | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 32 | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.22e-07 (2^-22.10) | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 7.45 | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20 | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=27,n_iter=22,angle_guard=-1,frac_guard=0,rounding=round,m=6` | 1908 | 406 | 59.9 | 6 | 4.35 | 9.53e-07 (2^-20.00) | 20.00 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 50 MSPS constraint is decisive: iterative needs N+3 cycles/result (at N~24 that is ~27 cycles, i.e. >1 GHz) and unrolled_k needs ceil(N/k)+3 cycles (>=6 cycles even at k=8, i.e. >=300 MHz for a 22-bit chained datapath), so neither can plausibly reach 50 MSPS on Artix-7. Only the pipelined families give 1 result/cycle and can meet throughput at modest Fmax. Accuracy (max_abs_err <= 2^-20) forces roughly W>=22 and N>=22, so round 1 concentrates both pipelined families on that boundary region, with small guard-bit ranges because guard bits widen the datapath and directly drive the area/power objectives. Round 1 is split evenly between the two families to see which one owns the low-area end of the front before spending later rounds refining and filling the curve.*)
- `pipelined` (50 evals): data_width=21..26, n_iter=20..30, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* One result/cycle makes the 50 MSPS constraint easy, so this family can actually be feasible; the box is centred on the accuracy boundary (W>=~22, N>=~22) where the area/power trade-off lives.
- `pipelined_m` (50 evals): data_width=21..26, n_iter=20..30, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Same 1 result/cycle throughput but fewer pipeline registers, so it should dominate the low-area end of the front; m trades register count against combinational depth, which is exactly the area/Fmax trade-off we need to map.

**Result (code):** 100 evaluations this round, 100 total; 37 feasible; hypervolume 8.576e+04 (n/a).

**LLM decision:** `add_family` — The feasible front is a single point (pipelined_m @ luts_plus_ffs=2437, power_index=4.58), covering only 2437..2437 of the HV reference 8000 and 4.58..4.58 of 20 — essentially zero coverage of both objective ranges, so the trade-off curve is unmapped. Only pipelined and pipelined_m have been sampled; iterative and unrolled_k are unexplored and could contribute lower-area points (unrolled_k shares its datapath, so it may use fewer registers than pipelined_m). Note that pipelined (1 result/cycle) tops out at 264 MSPS, i.e. max Fmax ~264 MHz, so iterative at the N~22 needed for 2^-20 accuracy (N+3~25 cycles) would land near ~10 MSPS — almost certainly infeasible on throughput, but worth a small confirming budget. I keep the accuracy-critical ranges tight (data_width>=24, n_iter>=20) and push unrolled_k toward high k to have any chance of clearing 50 MSPS.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.576e+04 (gain this round: n/a (first round)).
Feasible designs: 37 of 100 evaluations (30 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 4% violate; best seen 264
- max_abs_err <= 9.53674e-07: 62% violate; best seen 1.5e-07 (2^-22.66)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=3 rounding=round m=7] luts_plus_ffs=2437, power_index=4.58, luts=2027, ffs=410, throughput_msps=52, max_abs_err=6.62e-07 (2^-20.53)
Front coverage: luts_plus_ffs 2437..2437 (HV reference 8000); power_index 4.58..4.58 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- pipelined: 50 evals, 23 feasible; max throughput seen 264 MSPS; best accuracy 22.66 bits; best feasible luts_plus_ffs=3920; feasible ranges: data_width 24..26, n_iter 22..30, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 50 evals, 14 feasible; max throughput seen 158 MSPS; best accuracy 22.66 bits; best feasible luts_plus_ffs=2437; feasible ranges: data_width 25..26, n_iter 22..30, angle_guard 0..3, frac_guard 0..3, m 4..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Spend this round on the two unexplored families before the reserved front-mapping phase, since code will map the front families automatically later. Focus ranges on the accuracy-critical region (data_width>=24, n_iter>=20) and on high k for unrolled_k so any feasible throughput point can actually appear.*)
- `unrolled_k` (80 evals): data_width=24..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* Unexplored family with a shared datapath (potentially fewer FFs than pipelined_m); high k is required to keep ceil(N/k)+3 cycles low enough to approach 50 MSPS.
- `iterative` (20 evals): data_width=24..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Confirm/deny feasibility: with 1 micro-rotation/cycle and N~22 needed for 2^-20 accuracy, throughput is expected to fall far below 50 MSPS, but a small budget settles it rather than assuming.

**Result (code):** 100 evaluations this round, 200 total; 37 feasible; hypervolume 8.576e+04 (+0.0%).

**LLM decision:** `map_front` — The feasible Pareto front currently contains only a single design (pipelined_m, luts_plus_ffs=2437, power_index=4.58), covering a tiny fraction of both objective ranges (luts_plus_ffs 2437 vs HV ref 8000; power_index 4.58 vs HV ref 20). Hypervolume gain this round was 0.0%, indicating the search has collapsed to one point. All families have been explored, and the feasible ranges for pipelined_m and pipelined are known. To ensure no non-dominated designs (e.g., lower power_index at higher area) are missed, the reserved budget should be used to map the full front over the families that produced feasible designs (pipelined_m and pipelined), seeded with the current front.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.576e+04 (gain this round: +0.0%).
Feasible designs: 37 of 200 evaluations (30 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 52% violate; best seen 264
- max_abs_err <= 9.53674e-07: 42% violate; best seen 3.12e-08 (2^-24.93)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=22 angle_guard=2 frac_guard=3 rounding=round m=7] luts_plus_ffs=2437, power_index=4.58, luts=2027, ffs=410, throughput_msps=52, max_abs_err=6.62e-07 (2^-20.53)
Front coverage: luts_plus_ffs 2437..2437 (HV reference 8000); power_index 4.58..4.58 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- iterative: 20 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 23.89 bits
- unrolled_k: 80 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 24.93 bits
- pipelined: 50 evals, 23 feasible; max throughput seen 264 MSPS; best accuracy 22.66 bits; best feasible luts_plus_ffs=3920; feasible ranges: data_width 24..26, n_iter 22..30, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 50 evals, 14 feasible; max throughput seen 158 MSPS; best accuracy 22.66 bits; best feasible luts_plus_ffs=2437; feasible ranges: data_width 25..26, n_iter 22..30, angle_guard 0..3, frac_guard 0..3, m 4..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=24..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 60 feasible; hypervolume 8.898e+04 (+3.7%).

**LLM decision:** `map_front` — Round 3 leaves 160 of 400 evals and one round. The feasible Pareto front is a single point (pipelined_m W=27 N=22 ag=-1 fg=0 round m=6: 2314 LUT+FF, power 4.35, 59.9 MSPS, err 2^-20.00), so front coverage is degenerate: luts_plus_ffs spans 2314..2314 against HV ref 8000 and power_index 4.35..4.35 against ref 20. Hypervolume is only 8.898e+04 with a +3.7% gain, i.e. the curve is far from mapped. All four families have now been sampled; pipelined_m is the only family on the front and is the only one that reached the area corner (best feasible luts_plus_ffs=2314 vs pipelined 3920), while iterative/unrolled_k produced 0 feasible designs (max throughput 6.66/6.34 MSPS, far below the 50 MSPS constraint). The right use of the reserved budget is therefore to map the full pipelined_m ranges (data_width 8..28, n_iter 4..30, angle_guard -2..4, frac_guard 0..4, m 2..8) seeded with the current front, so the final selection (min luts_plus_ffs) is made from a properly covered trade-off curve rather than a single point.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8.898e+04 (gain this round: +3.7%).
Feasible designs: 60 of 240 evaluations (49 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 46% violate; best seen 264
- max_abs_err <= 9.53674e-07: 39% violate; best seen 3.12e-08 (2^-24.93)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=6] luts_plus_ffs=2314, power_index=4.35, luts=1908, ffs=406, throughput_msps=59.9, max_abs_err=9.53e-07 (2^-20.00)
Front coverage: luts_plus_ffs 2314..2314 (HV reference 8000); power_index 4.35..4.35 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- iterative: 20 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 23.89 bits
- unrolled_k: 80 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 24.93 bits
- pipelined: 50 evals, 23 feasible; max throughput seen 264 MSPS; best accuracy 22.66 bits; best feasible luts_plus_ffs=3920; feasible ranges: data_width 24..26, n_iter 22..30, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 90 evals, 37 feasible; max throughput seen 158 MSPS; best accuracy 24.67 bits; best feasible luts_plus_ffs=2314; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 3..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=26..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 128 feasible; hypervolume 8.898e+04 (+0.0%).

**LLM decision:** `stop` — Final round (4 of 4) and 340/400 evals used, with hypervolume gain +0.0% this round, so further exploration is not warranted. The spec is satisfiable: 128 of 340 evaluations are feasible, and the Pareto front contains pipelined_m [data_width=27, n_iter=22, angle_guard=-1, frac_guard=0, rounding=round, m=6] with luts_plus_ffs=2314, power_index=4.35, throughput_msps=59.9 (>= 50) and max_abs_err=9.53e-07 (2^-20.00, exactly at the 9.53674e-07 limit). This design is also the selection rule's pick (min luts_plus_ffs), and it dominates the best pipelined feasible design (luts_plus_ffs=3920). iterative and unrolled_k are structurally unable to meet the 50 MSPS constraint (max throughput seen 6.66 and 6.34 MSPS respectively), so the front is correctly confined to the pipelined families; no infeasibility applies.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 8.898e+04 (gain this round: +0.0%).
Feasible designs: 128 of 340 evaluations (112 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 36% violate; best seen 264
- max_abs_err <= 9.53674e-07: 34% violate; best seen 3.12e-08 (2^-24.93)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=6] luts_plus_ffs=2314, power_index=4.35, luts=1908, ffs=406, throughput_msps=59.9, max_abs_err=9.53e-07 (2^-20.00)
Front coverage: luts_plus_ffs 2314..2314 (HV reference 8000); power_index 4.35..4.35 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- iterative: 20 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 23.89 bits
- unrolled_k: 80 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 24.93 bits
- pipelined: 50 evals, 23 feasible; max throughput seen 264 MSPS; best accuracy 22.66 bits; best feasible luts_plus_ffs=3920; feasible ranges: data_width 24..26, n_iter 22..30, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 190 evals, 105 feasible; max throughput seen 158 MSPS; best accuracy 24.76 bits; best feasible luts_plus_ffs=2314; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=26..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 167 feasible; hypervolume 8.898e+04 (+0.0%).

**No LLM call** (code's front-mapping round): Final round (4 of 4) and 340/400 evals used, with hypervolume gain +0.0% this round, so further exploration is not warranted. The spec is satisfiable: 128 of 340 evaluations are feasible, and the Pareto front contains pipelined_m [data_width=27, n_iter=22, angle_guard=-1, frac_guard=0, rounding=round, m=6] with luts_plus_ffs=2314, power_index=4.35, throughput_msps=59.9 (>= 50) and max_abs_err=9.53e-07 (2^-20.00, exactly at the 9.53674e-07 limit). This design is also the selection rule's pick (min luts_plus_ffs), and it dominates the best pipelined feasible design (luts_plus_ffs=3920). iterative and unrolled_k are structurally unable to meet the 50 MSPS constraint (max throughput seen 6.66 and 6.34 MSPS respectively), so the front is correctly confined to the pipelined families; no infeasibility applies.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.898e+04 (gain this round: +0.0%).
Feasible designs: 167 of 400 evaluations (146 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 33% violate; best seen 264
- max_abs_err <= 9.53674e-07: 32% violate; best seen 3.12e-08 (2^-24.93)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=6] luts_plus_ffs=2314, power_index=4.35, luts=1908, ffs=406, throughput_msps=59.9, max_abs_err=9.53e-07 (2^-20.00)
Front coverage: luts_plus_ffs 2314..2314 (HV reference 8000); power_index 4.35..4.35 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- iterative: 20 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 23.89 bits
- unrolled_k: 80 evals, 0 feasible; max throughput seen 6.34 MSPS; best accuracy 24.93 bits
- pipelined: 50 evals, 23 feasible; max throughput seen 264 MSPS; best accuracy 22.66 bits; best feasible luts_plus_ffs=3920; feasible ranges: data_width 24..26, n_iter 22..30, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 250 evals, 144 feasible; max throughput seen 158 MSPS; best accuracy 24.76 bits; best feasible luts_plus_ffs=2314; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 12407 in, 19979 out
- provider-reported cost: $0.0175
- full prompts and replies: `llm_trace.jsonl`

