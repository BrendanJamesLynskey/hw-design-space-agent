# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=2,rounding=trunc,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1975 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 412 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.49 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.29e-07 (2^-20.39) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 12.2 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.04e-07 (2^-22.23) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.42 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.4 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=2,rounding=trunc,m=6` | 1975 | 412 | 59.9 | 6 | 4.49 | 7.29e-07 (2^-20.39) | 20.39 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires >= 50 MSPS throughput and max_abs_err <= 2^-20. The error constraint implies data_width >= 22 (since output LSB is 2^-(W-2), and we need error < 2^-20, so W-2 >= 20 => W >= 22). n_iter must be sufficient to achieve 2^-20 accuracy; typically N >= 20 is needed for 20-bit accuracy in CORDIC. Pipelined and pipelined_m are the primary candidates because they guarantee 1 result/cycle, making it easiest to meet the 50 MSPS constraint (just need Fmax >= 50 MHz). Unrolled_k is a secondary candidate that might offer lower area if Fmax is high enough. Iterative is likely infeasible for the throughput constraint but included with minimal budget to confirm. The budget is allocated 40% to pipelined (most likely to be on the Pareto front), 30% to pipelined_m (area/Fmax trade-off), 20% to unrolled_k (potential area savings), and 10% to iterative (confirm infeasibility). All families share the same accuracy parameters, so the search focuses on the structural parameters that affect area, power, and Fmax.*)
- `pipelined` (40 evals): data_width=22..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Pipelined is the only family that guarantees 1 result/cycle throughput. To meet >= 50 MSPS, Fmax must be >= 50 MHz. Pipelined has the best Fmax potential due to short critical paths (1 micro-rotation per stage). It is the primary candidate for meeting the throughput constraint while allowing area/power optimization via n_iter and guard bits.
- `pipelined_m` (30 evals): data_width=22..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Pipelined_m offers a trade-off between area (fewer registers than full pipelined) and Fmax (longer critical paths than full pipelined). It still produces 1 result/cycle. If full pipelined is too area-heavy or if Fmax is sufficient with fewer registers, this family may offer a better area/power point on the Pareto front.
- `unrolled_k` (20 evals): data_width=22..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* Unrolled_k can achieve high throughput if Fmax is high enough (throughput = Fmax * k / N). For N=20-30 and k=2-8, results/cycle ranges from ~0.67 to 1.5. If Fmax is > 50 MHz, this can meet the 50 MSPS constraint with potentially lower area than pipelined (shared datapath, fewer registers). Worth exploring to see if it lands on the Pareto front.
- `iterative` (10 evals): data_width=22..28, n_iter=20..30, angle_guard=0..4, frac_guard=0..4, rounding=trunc|round. *Why:* Iterative has the lowest area and power but produces 1 result every N+3 cycles. To meet 50 MSPS, Fmax would need to be > 50*(N+3) MHz, which is likely infeasible for N=20-30 (would need > 1150 MHz). Included with small budget to confirm infeasibility or find unexpected high-Fmax corner cases.

**Result (code):** 100 evaluations this round, 100 total; 44 feasible; hypervolume 8.595e+04 (n/a).

**LLM decision:** `refine` — The current Pareto front is degenerate, containing only two designs with identical area (2430) and power (4.57) from the `pipelined_m` family. The `pipelined` family, while feasible, is significantly larger (best 3840 vs 2430) and likely higher power. The `iterative` and `unrolled_k` families are infeasible due to throughput constraints. To improve hypervolume, we must explore the trade-off space within `pipelined_m` more effectively. The current front is stuck at `data_width=26`. We should narrow the search to `pipelined_m` and `pipelined` (the only feasible families) and specifically explore lower `data_width` values (23-25) in `pipelined` and `pipelined_m` to see if we can reduce area below 2430 while maintaining the accuracy constraint (max_abs_err <= 2^-20). The `pipelined` family has a wider feasible range for `data_width` (23-28) compared to `pipelined_m` (26-28), suggesting `pipelined` might offer smaller area solutions at the cost of higher power/area than the current `pipelined_m` best, or potentially better area if `m` optimization in `pipelined_m` isn't fully exploited at lower widths. However, since `pipelined_m` is currently the only one on the front, we should focus on expanding the `pipelined_m` search to lower `data_width` if possible, or accept `pipelined` as a second point on the front if it offers a different trade-off. Given `pipelined_m`'s best feasible `data_width` is 26, and `pipelined`'s is 23, we should search `pipelined` for low-area designs and `pipelined_m` for low-power designs to populate the front.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.595e+04 (gain this round: n/a (first round)).
Feasible designs: 44 of 100 evaluations (39 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 39% violate; best seen 257
- max_abs_err <= 9.53674e-07: 33% violate; best seen 2.3e-08 (2^-25.37)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=3 frac_guard=0 rounding=round m=6] luts_plus_ffs=2430, power_index=4.57, luts=2022, ffs=408, throughput_msps=59.9, max_abs_err=4.88e-07 (2^-20.97)
- pipelined_m [data_width=26 n_iter=23 angle_guard=3 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=2430, power_index=4.57, luts=2022, ffs=408, throughput_msps=59.9, max_abs_err=8.51e-07 (2^-20.16)
Front coverage: luts_plus_ffs 2430..2430 (HV reference 8000); power_index 4.57..4.57 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 25.37 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.67 MSPS; best accuracy 23.70 bits
- pipelined: 40 evals, 27 feasible; max throughput seen 257 MSPS; best accuracy 23.54 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard 1..4, frac_guard 0..4
- pipelined_m: 30 evals, 17 feasible; max throughput seen 158 MSPS; best accuracy 24.56 bits; best feasible luts_plus_ffs=2430; feasible ranges: data_width 26..28, n_iter 22..30, angle_guard 0..4, frac_guard 0..4, m 5..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the two feasible families. Explore lower data_width in both to find smaller area designs. Vary m in pipelined_m to optimize power/area trade-off.*)
- `pipelined_m` (50 evals): data_width=24..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Current best family. Need to explore lower data_width (24-25) to see if area can be reduced below 2430, and vary m to find power/area trade-offs.
- `pipelined` (50 evals): data_width=23..26, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Feasible at lower data_width (23). May provide a second point on the Pareto front with different area/power characteristics, potentially lower area if n_iter is optimized.

**Result (code):** 100 evaluations this round, 200 total; 104 feasible; hypervolume 8.595e+04 (+0.0%).

**LLM decision:** `map_front` — The current front is degenerate (only 2 designs, both identical in area/power), indicating the search has not yet explored the trade-off curve. `pipelined_m` is the only family meeting the throughput constraint with a reasonable area (2430 vs 3840 for `pipelined`), and `pipelined` offers higher throughput potential. Since the front covers only a tiny slice of the objective space (luts_plus_ffs 2430..2430 vs ref 8000), a code-driven NSGA-II search over the full feasible ranges of `pipelined` and `pipelined_m` is required to map the true Pareto front and maximize hypervolume before the final selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.595e+04 (gain this round: +0.0%).
Feasible designs: 104 of 200 evaluations (86 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 20% violate; best seen 257
- max_abs_err <= 9.53674e-07: 36% violate; best seen 2.3e-08 (2^-25.37)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=3 frac_guard=0 rounding=round m=6] luts_plus_ffs=2430, power_index=4.57, luts=2022, ffs=408, throughput_msps=59.9, max_abs_err=4.88e-07 (2^-20.97)
- pipelined_m [data_width=26 n_iter=23 angle_guard=3 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=2430, power_index=4.57, luts=2022, ffs=408, throughput_msps=59.9, max_abs_err=8.51e-07 (2^-20.16)
Front coverage: luts_plus_ffs 2430..2430 (HV reference 8000); power_index 4.57..4.57 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 25.37 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.67 MSPS; best accuracy 23.70 bits
- pipelined: 90 evals, 57 feasible; max throughput seen 257 MSPS; best accuracy 23.54 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard 1..4, frac_guard 0..4
- pipelined_m: 80 evals, 47 feasible; max throughput seen 158 MSPS; best accuracy 25.08 bits; best feasible luts_plus_ffs=2430; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard 0..4, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined_m` (40 evals): data_width=25..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (2 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 139 feasible; hypervolume 8.66e+04 (+0.8%).

**LLM decision:** `map_front` — The Pareto front currently consists of a single point (pipelined_m, luts_plus_ffs=2405, power_index=4.52). While this point is feasible and significantly better than the best pipelined design (3840), the front does not cover the trade-off space. The hypervolume is low (8.66e+04) relative to the reference point (8000, 20), indicating that we are missing designs that might offer a better balance of area and power, or potentially lower area at the cost of higher power (or vice versa). 

Evidence:
1. `pipelined_m` has 82 feasible designs, with a best area of 2405. The feasible ranges are data_width 24..28, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7.
2. `pipelined` has 57 feasible designs, with a best area of 3840. It is strictly dominated by the current best `pipelined_m` in area, but might offer different power characteristics or latency trade-offs that contribute to hypervolume if the power index is lower for some configurations (though typically pipelined_m is more efficient).
3. The current front only shows one point. To maximize hypervolume, we need to explore the full range of `pipelined_m` (and potentially `pipelined` if it offers non-dominated points in power) to find the curve of optimal trade-offs between `luts_plus_ffs` and `power_index`.
4. We have 160 evaluations remaining (400 - 240). One round of 100 evaluations is sufficient to map the front for `pipelined_m` over its feasible ranges, which will likely reveal a curve of non-dominated points.

Therefore, `map_front` is the correct decision to let the code spend the next round mapping the full front for the families on it (primarily `pipelined_m`, and `pipelined` if it contributes to the front).

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8.66e+04 (gain this round: +0.8%).
Feasible designs: 139 of 240 evaluations (116 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 18% violate; best seen 257
- max_abs_err <= 9.53674e-07: 31% violate; best seen 2.3e-08 (2^-25.37)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=23 angle_guard=-1 frac_guard=0 rounding=round m=6] luts_plus_ffs=2405, power_index=4.52, luts=1999, ffs=406, throughput_msps=59.9, max_abs_err=7.31e-07 (2^-20.38)
Front coverage: luts_plus_ffs 2405..2405 (HV reference 8000); power_index 4.52..4.52 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 25.37 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.67 MSPS; best accuracy 23.70 bits
- pipelined: 90 evals, 57 feasible; max throughput seen 257 MSPS; best accuracy 23.54 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard 1..4, frac_guard 0..4
- pipelined_m: 120 evals, 82 feasible; max throughput seen 158 MSPS; best accuracy 25.08 bits; best feasible luts_plus_ffs=2405; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=26..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 209 feasible; hypervolume 8.708e+04 (+0.5%).

**LLM decision:** `stop` — The budget and round limits have been reached (340/400 evals, Round 4/4). The feasible Pareto front is established with a single design: pipelined_m [data_width=26, n_iter=22, angle_guard=1, frac_guard=2, rounding=trunc, m=6] with luts_plus_ffs=2386 and power_index=4.49. This design satisfies all constraints: throughput_msps=59.9 (>= 50) and max_abs_err=7.29e-07 (<= 9.53674e-07). The hypervolume has stabilized (gain +0.5% in the final round), indicating convergence. The selection rule (min luts_plus_ffs) picks this design, which is also the best feasible point found across 209 feasible evaluations. No further exploration is possible or necessary.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 8.708e+04 (gain this round: +0.5%).
Feasible designs: 209 of 340 evaluations (179 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 18% violate; best seen 257
- max_abs_err <= 9.53674e-07: 26% violate; best seen 2.3e-08 (2^-25.37)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=2386, power_index=4.49, luts=1975, ffs=412, throughput_msps=59.9, max_abs_err=7.29e-07 (2^-20.39)
Front coverage: luts_plus_ffs 2386..2386 (HV reference 8000); power_index 4.49..4.49 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 25.37 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.67 MSPS; best accuracy 23.70 bits
- pipelined: 90 evals, 57 feasible; max throughput seen 257 MSPS; best accuracy 23.54 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard 1..4, frac_guard 0..4
- pipelined_m: 220 evals, 152 feasible; max throughput seen 158 MSPS; best accuracy 25.08 bits; best feasible luts_plus_ffs=2386; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined_m` (60 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 256 feasible; hypervolume 8.708e+04 (+0.0%).

**No LLM call** (code's front-mapping round): The budget and round limits have been reached (340/400 evals, Round 4/4). The feasible Pareto front is established with a single design: pipelined_m [data_width=26, n_iter=22, angle_guard=1, frac_guard=2, rounding=trunc, m=6] with luts_plus_ffs=2386 and power_index=4.49. This design satisfies all constraints: throughput_msps=59.9 (>= 50) and max_abs_err=7.29e-07 (<= 9.53674e-07). The hypervolume has stabilized (gain +0.5% in the final round), indicating convergence. The selection rule (min luts_plus_ffs) picks this design, which is also the best feasible point found across 209 feasible evaluations. No further exploration is possible or necessary.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.708e+04 (gain this round: +0.0%).
Feasible designs: 256 of 400 evaluations (221 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 17% violate; best seen 257
- max_abs_err <= 9.53674e-07: 23% violate; best seen 2.3e-08 (2^-25.37)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=2386, power_index=4.49, luts=1975, ffs=412, throughput_msps=59.9, max_abs_err=7.29e-07 (2^-20.39)
Front coverage: luts_plus_ffs 2386..2386 (HV reference 8000); power_index 4.49..4.49 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- iterative: 10 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 25.37 bits
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.67 MSPS; best accuracy 23.70 bits
- pipelined: 90 evals, 57 feasible; max throughput seen 257 MSPS; best accuracy 23.54 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard 1..4, frac_guard 0..4
- pipelined_m: 280 evals, 199 feasible; max throughput seen 158 MSPS; best accuracy 25.08 bits; best feasible luts_plus_ffs=2386; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 11287 in, 3872 out
- provider-reported cost: $0.0073
- full prompts and replies: `llm_trace.jsonl`

