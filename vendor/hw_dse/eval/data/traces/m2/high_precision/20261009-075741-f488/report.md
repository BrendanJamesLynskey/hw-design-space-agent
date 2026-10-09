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
`pipelined_m:data_width=27,n_iter=22,angle_guard=-1,frac_guard=0,rounding=round,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1908 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 406 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
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
| 0 | `pipelined_m:data_width=27,n_iter=22,angle_guard=-1,frac_guard=0,rounding=round,m=7` | 1908 | 406 | 52.0 | 6 | 4.35 | 9.53e-07 (2^-20.00) | 20.00 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 2^-20 (9.54e-7) error ceiling forces roughly W>=22 and N>=22, and the 50 MSPS throughput floor rules out iterative and unrolled_k: at N>=22 they need ceil(N/k)+3 or N+3 cycles/result, i.e. >300 MHz to >1 GHz, which is not plausible for 22-28 bit CORDIC datapaths on Artix-7. Pipelined and pipelined_m both sustain 1 result/cycle and are therefore the only families that can plausibly satisfy both constraints, so the whole first-round budget goes to them. pipelined_m gets the larger share because its m parameter directly attacks the area objective (FFs) while the loose 50 MSPS bound leaves room to trade Fmax away; pipelined is kept as the high-Fmax baseline. The parameter boxes are deliberately wide around the expected feasibility boundary (W 20..28, N 18..30, guards full range) so NSGA-II can find both the minimum-area feasible corner and the shape of the front.*)
- `pipelined` (40 evals): data_width=20..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Baseline 1-result/cycle family: full per-stage pipelining gives the highest Fmax, which is the safe fallback if pipelined_m's longer combinational paths cannot hold 50 MSPS. Ranges span the accuracy boundary (W~22, N~22) so the search can locate the minimum-area feasible corner.
- `pipelined_m` (60 evals): data_width=20..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Still 1 result/cycle, but registering every m stages collapses the FF count (the dominant term in luts_plus_ffs for a deep pipeline) at the cost of a longer combinational path. Since the throughput floor is only 50 MSPS, large m is likely the area-optimal region; m=2..8 maps that Fmax/area trade-off.

**Result (code):** 100 evaluations this round, 100 total; 50 feasible; hypervolume 8.708e+04 (n/a).

**LLM decision:** `add_family` — The feasible front is a single point (pipelined_m W=26 N=22 ag=1 fg=2 trunc m=6: luts_plus_ffs=2386, power_index=4.49), so HV is just one rectangle (5614 x 15.51 = 8.71e4) and covers almost none of either objective's range. Only pipelined/pipelined_m have been tried; the two unexplored families (iterative, unrolled_k) share a datapath and could plausibly reach lower luts_plus_ffs than 2386 while still clearing the 50 MSPS bar (best throughput seen is 264 MSPS, so there is headroom). Bringing them in is the highest-value way to extend the front before spending the reserved budget on full-range mapping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.708e+04 (gain this round: n/a (first round)).
Feasible designs: 50 of 100 evaluations (42 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 12% violate; best seen 264
- max_abs_err <= 9.53674e-07: 42% violate; best seen 9.31e-08 (2^-23.36)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=2386, power_index=4.49, luts=1975, ffs=412, throughput_msps=59.9, max_abs_err=7.29e-07 (2^-20.39)
Front coverage: luts_plus_ffs 2386..2386 (HV reference 8000); power_index 4.49..4.49 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- pipelined: 40 evals, 26 feasible; max throughput seen 264 MSPS; best accuracy 22.86 bits; best feasible luts_plus_ffs=4289; feasible ranges: data_width 26..28, n_iter 24..29, angle_guard 0..2, frac_guard 0..4
- pipelined_m: 60 evals, 24 feasible; max throughput seen 158 MSPS; best accuracy 23.36 bits; best feasible luts_plus_ffs=2386; feasible ranges: data_width 24..27, n_iter 22..30, angle_guard 0..4, frac_guard 0..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Probe both unexplored families across the accuracy-feasible width/iteration region; keep the pipelined_m point as seed. If neither clears 50 MSPS, next round map the front over pipelined/pipelined_m full ranges.*)
- `unrolled_k` (60 evals): data_width=24..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* ceil(N/k)+3 cycles/result; with k=6..8 and N~22-26 this is ~6-7 cycles, so needs Fmax>~350 MHz to hit 50 MSPS. Shared datapath should cut FFs vs pipelined_m.
- `iterative` (40 evals): data_width=24..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Smallest datapath (1 micro-rotation/cycle, barrel shifters); N+3 cycles/result means it likely cannot reach 50 MSPS, but worth a cheap probe to confirm feasibility and to bound the area floor.

**Result (code):** 100 evaluations this round, 200 total; 50 feasible; hypervolume 8.708e+04 (+0.0%).

**LLM decision:** `map_front` — The feasible Pareto front contains only a single design (pipelined_m, luts_plus_ffs=2386, power_index=4.49), so it covers a tiny fraction of both objective ranges (2386..2386 vs HV ref 8000; 4.49..4.49 vs HV ref 20). Hypervolume gain this round was +0.0%, but the front has not yet been mapped over the full ranges of the families that produced it (pipelined and pipelined_m). All families have been explored, so add_family is not applicable; widening/refining around a single point is unlikely to help. The reserved budget should be spent mapping the front over the full ranges of the families on it to confirm whether any additional non-dominated feasible designs exist.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.708e+04 (gain this round: +0.0%).
Feasible designs: 50 of 200 evaluations (42 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 56% violate; best seen 264
- max_abs_err <= 9.53674e-07: 29% violate; best seen 2.08e-08 (2^-25.52)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=2386, power_index=4.49, luts=1975, ffs=412, throughput_msps=59.9, max_abs_err=7.29e-07 (2^-20.39)
Front coverage: luts_plus_ffs 2386..2386 (HV reference 8000); power_index 4.49..4.49 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 6.27 MSPS; best accuracy 25.52 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 6.47 MSPS; best accuracy 24.59 bits
- pipelined: 40 evals, 26 feasible; max throughput seen 264 MSPS; best accuracy 22.86 bits; best feasible luts_plus_ffs=4289; feasible ranges: data_width 26..28, n_iter 24..29, angle_guard 0..2, frac_guard 0..4
- pipelined_m: 60 evals, 24 feasible; max throughput seen 158 MSPS; best accuracy 23.36 bits; best feasible luts_plus_ffs=2386; feasible ranges: data_width 24..27, n_iter 22..30, angle_guard 0..4, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 81 feasible; hypervolume 8.898e+04 (+2.2%).

**LLM decision:** `map_front` — The feasible front is a single point (pipelined_m [W=27 N=22 ag=-1 fg=0 round m=7]: luts_plus_ffs=2314, power_index=4.35), so it covers essentially none of either objective's range (luts_plus_ffs 2314..2314 vs HV ref 8000; power_index 4.35..4.35 vs ref 20) and the +2.2% HV gain is coming from a corner, not the curve. Both constraints are clearly reachable — throughput best seen 264 MSPS (pipelined) and accuracy best seen 2^-25.52 — and pipelined_m alone has 55 feasible designs spanning data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7, with pipelined also feasible (26 designs, best luts_plus_ffs=4289). With 160 of 400 evals left in the final round, the right move is to hand the round to a code-driven NSGA-II coverage search over the full ranges of the front families (pipelined_m, and pipelined as a secondary contributor), seeded with the current front, to map the whole area/power trade-off curve rather than refine a single point.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8.898e+04 (gain this round: +2.2%).
Feasible designs: 81 of 240 evaluations (70 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 48% violate; best seen 264
- max_abs_err <= 9.53674e-07: 28% violate; best seen 2.08e-08 (2^-25.52)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=7] luts_plus_ffs=2314, power_index=4.35, luts=1908, ffs=406, throughput_msps=52, max_abs_err=9.53e-07 (2^-20.00)
Front coverage: luts_plus_ffs 2314..2314 (HV reference 8000); power_index 4.35..4.35 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 6.27 MSPS; best accuracy 25.52 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 6.47 MSPS; best accuracy 24.59 bits
- pipelined: 40 evals, 26 feasible; max throughput seen 264 MSPS; best accuracy 22.86 bits; best feasible luts_plus_ffs=4289; feasible ranges: data_width 26..28, n_iter 24..29, angle_guard 0..2, frac_guard 0..4
- pipelined_m: 100 evals, 55 feasible; max throughput seen 158 MSPS; best accuracy 24.34 bits; best feasible luts_plus_ffs=2314; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=26..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 159 feasible; hypervolume 8.898e+04 (+0.0%).

**LLM decision:** `stop` — The spec is satisfiable: pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=7] meets both constraints (throughput 52 MSPS >= 50, max_abs_err 9.53e-07 = 2^-20.00 <= 9.53674e-07) at luts_plus_ffs=2314 and power_index=4.35, so `infeasible` is ruled out. This is the final round (round cap reached, 340/400 evals) and the hypervolume gain this round was +0.0%, so further exploration is not warranted; the selection rule (min luts_plus_ffs) picks the single front design, which is well inside the HV reference box (2314 vs 8000 area, 4.35 vs 20 power). Note the front is thin (1 design, data_width 27 only) and the accuracy margin is exactly at the 2^-20 bound, but with no budget/rounds left there is nothing more to map.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 8.898e+04 (gain this round: +0.0%).
Feasible designs: 159 of 340 evaluations (140 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 38% violate; best seen 264
- max_abs_err <= 9.53674e-07: 22% violate; best seen 2.08e-08 (2^-25.52)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=7] luts_plus_ffs=2314, power_index=4.35, luts=1908, ffs=406, throughput_msps=52, max_abs_err=9.53e-07 (2^-20.00)
Front coverage: luts_plus_ffs 2314..2314 (HV reference 8000); power_index 4.35..4.35 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 6.27 MSPS; best accuracy 25.52 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 6.47 MSPS; best accuracy 24.59 bits
- pipelined: 40 evals, 26 feasible; max throughput seen 264 MSPS; best accuracy 22.86 bits; best feasible luts_plus_ffs=4289; feasible ranges: data_width 26..28, n_iter 24..29, angle_guard 0..2, frac_guard 0..4
- pipelined_m: 200 evals, 133 feasible; max throughput seen 158 MSPS; best accuracy 24.51 bits; best feasible luts_plus_ffs=2314; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=26..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 211 feasible; hypervolume 8.898e+04 (+0.0%).

**No LLM call** (code's front-mapping round): The spec is satisfiable: pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=7] meets both constraints (throughput 52 MSPS >= 50, max_abs_err 9.53e-07 = 2^-20.00 <= 9.53674e-07) at luts_plus_ffs=2314 and power_index=4.35, so `infeasible` is ruled out. This is the final round (round cap reached, 340/400 evals) and the hypervolume gain this round was +0.0%, so further exploration is not warranted; the selection rule (min luts_plus_ffs) picks the single front design, which is well inside the HV reference box (2314 vs 8000 area, 4.35 vs 20 power). Note the front is thin (1 design, data_width 27 only) and the accuracy margin is exactly at the 2^-20 bound, but with no budget/rounds left there is nothing more to map.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.898e+04 (gain this round: +0.0%).
Feasible designs: 211 of 400 evaluations (180 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 34% violate; best seen 264
- max_abs_err <= 9.53674e-07: 20% violate; best seen 1.77e-08 (2^-25.75)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=-1 frac_guard=0 rounding=round m=7] luts_plus_ffs=2314, power_index=4.35, luts=1908, ffs=406, throughput_msps=52, max_abs_err=9.53e-07 (2^-20.00)
Front coverage: luts_plus_ffs 2314..2314 (HV reference 8000); power_index 4.35..4.35 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- iterative: 40 evals, 0 feasible; max throughput seen 6.27 MSPS; best accuracy 25.52 bits
- unrolled_k: 60 evals, 0 feasible; max throughput seen 6.47 MSPS; best accuracy 24.59 bits
- pipelined: 40 evals, 26 feasible; max throughput seen 264 MSPS; best accuracy 22.86 bits; best feasible luts_plus_ffs=4289; feasible ranges: data_width 26..28, n_iter 24..29, angle_guard 0..2, frac_guard 0..4
- pipelined_m: 260 evals, 185 feasible; max throughput seen 158 MSPS; best accuracy 25.75 bits; best feasible luts_plus_ffs=2314; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 12397 in, 10784 out
- provider-reported cost: $0.0086
- full prompts and replies: `llm_trace.jsonl`

