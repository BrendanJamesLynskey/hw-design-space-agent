# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec low_area_control: Field-oriented motor-control loop needing sin/cos of the rotor angle at >= 1 MSPS with max error <= 2^-10. Area is everything: minimise LUTs + FFs.
  constraint: throughput_msps >= 1
  constraint: max_abs_err <= 0.000976562
  objective: min luts_plus_ffs (HV ref 1500)
  objective: max accuracy_bits (HV ref 10)
  select: min luts_plus_ffs
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 161 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 93 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 13.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 75.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.143 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000835 (2^-10.23) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.84 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.00024 (2^-12.02) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.97 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.2 | exact: bit-accurate model, exhaustive (32768 angles) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (44 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` | 161 | 93 | 13.2 | 15 | 0.143 | 0.000835 (2^-10.23) | 10.23 |
| 1 | `iterative:data_width=15,n_iter=12,angle_guard=4,frac_guard=0,rounding=round` | 164 | 95 | 12.9 | 15 | 0.146 | 0.000807 (2^-10.27) | 10.27 |
| 2 | `iterative:data_width=14,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 170 | 92 | 11.0 | 18 | 0.177 | 0.000648 (2^-10.59) | 10.59 |
| 3 | `iterative:data_width=15,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.0 | 18 | 0.178 | 0.000599 (2^-10.71) | 10.71 |
| 4 | `iterative:data_width=15,n_iter=22,angle_guard=3,frac_guard=0,rounding=round` | 183 | 95 | 6.5 | 25 | 0.261 | 0.000546 (2^-10.84) | 10.84 |
| 5 | `iterative:data_width=17,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc` | 183 | 102 | 11.0 | 18 | 0.193 | 0.000307 (2^-11.67) | 11.67 |
| 6 | `iterative:data_width=16,n_iter=23,angle_guard=1,frac_guard=0,rounding=round` | 195 | 98 | 6.2 | 26 | 0.287 | 0.000301 (2^-11.70) | 11.70 |
| 7 | `iterative:data_width=17,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc` | 204 | 107 | 11.4 | 17 | 0.199 | 0.000178 (2^-12.46) | 12.46 |
| 8 | `iterative:data_width=17,n_iter=23,angle_guard=1,frac_guard=0,rounding=round` | 211 | 103 | 6.2 | 26 | 0.307 | 0.000149 (2^-12.71) | 12.71 |
| 9 | `iterative:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=trunc` | 206 | 112 | 10.8 | 18 | 0.215 | 0.000109 (2^-13.17) | 13.17 |
| 10 | `iterative:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 214 | 112 | 10.8 | 18 | 0.221 | 8.66e-05 (2^-13.50) | 13.50 |
| 11 | `iterative:data_width=18,n_iter=19,angle_guard=3,frac_guard=0,rounding=round` | 230 | 110 | 7.2 | 22 | 0.281 | 7.75e-05 (2^-13.65) | 13.65 |
| 12 | `iterative:data_width=18,n_iter=27,angle_guard=2,frac_guard=0,rounding=round` | 231 | 109 | 5.3 | 30 | 0.383 | 7.75e-05 (2^-13.65) | 13.65 |
| 13 | `iterative:data_width=21,n_iter=16,angle_guard=1,frac_guard=0,rounding=trunc` | 229 | 122 | 10.2 | 19 | 0.251 | 4.46e-05 (2^-14.45) | 14.45 |
| 14 | `iterative:data_width=22,n_iter=16,angle_guard=3,frac_guard=0,rounding=trunc` | 244 | 129 | 10.0 | 19 | 0.267 | 3.7e-05 (2^-14.72) | 14.72 |
| 15 | `iterative:data_width=19,n_iter=18,angle_guard=2,frac_guard=2,rounding=trunc` | 260 | 118 | 7.6 | 21 | 0.299 | 3.04e-05 (2^-15.00) | 15.00 |
| 16 | `iterative:data_width=20,n_iter=25,angle_guard=1,frac_guard=0,rounding=round` | 264 | 118 | 5.7 | 28 | 0.402 | 2.52e-05 (2^-15.28) | 15.28 |
| 17 | `iterative:data_width=20,n_iter=19,angle_guard=3,frac_guard=1,rounding=trunc` | 264 | 122 | 7.1 | 22 | 0.319 | 2.4e-05 (2^-15.35) | 15.35 |
| 18 | `iterative:data_width=21,n_iter=24,angle_guard=1,frac_guard=1,rounding=trunc` | 282 | 125 | 5.9 | 27 | 0.413 | 1.38e-05 (2^-16.15) | 16.15 |
| 19 | `iterative:data_width=21,n_iter=27,angle_guard=4,frac_guard=0,rounding=round` | 287 | 126 | 5.2 | 30 | 0.466 | 1.15e-05 (2^-16.41) | 16.41 |
| 20 | `iterative:data_width=20,n_iter=25,angle_guard=3,frac_guard=3,rounding=trunc` | 301 | 126 | 5.6 | 28 | 0.45 | 1e-05 (2^-16.61) | 16.61 |
| 21 | `iterative:data_width=21,n_iter=24,angle_guard=3,frac_guard=2,rounding=trunc` | 301 | 129 | 5.8 | 27 | 0.437 | 7.43e-06 (2^-17.04) | 17.04 |
| 22 | `iterative:data_width=23,n_iter=27,angle_guard=2,frac_guard=0,rounding=trunc` | 305 | 134 | 5.2 | 30 | 0.495 | 6.86e-06 (2^-17.15) | 17.15 |
| 23 | `iterative:data_width=23,n_iter=22,angle_guard=3,frac_guard=0,rounding=trunc` | 305 | 135 | 6.2 | 25 | 0.414 | 5.84e-06 (2^-17.39) | 17.39 |
| 24 | `iterative:data_width=22,n_iter=21,angle_guard=1,frac_guard=2,rounding=trunc` | 315 | 132 | 6.5 | 24 | 0.404 | 5.09e-06 (2^-17.58) | 17.58 |
| 25 | `iterative:data_width=23,n_iter=22,angle_guard=3,frac_guard=0,rounding=round` | 319 | 135 | 6.2 | 25 | 0.427 | 2.9e-06 (2^-18.39) | 18.39 |
| 26 | `iterative:data_width=23,n_iter=24,angle_guard=3,frac_guard=0,rounding=round` | 319 | 135 | 5.8 | 27 | 0.461 | 2.9e-06 (2^-18.39) | 18.39 |
| 27 | `iterative:data_width=24,n_iter=22,angle_guard=2,frac_guard=0,rounding=round` | 334 | 139 | 6.2 | 25 | 0.445 | 1.67e-06 (2^-19.19) | 19.19 |
| 28 | `iterative:data_width=25,n_iter=27,angle_guard=1,frac_guard=0,rounding=trunc` | 341 | 143 | 5.2 | 30 | 0.546 | 1.66e-06 (2^-19.20) | 19.20 |
| 29 | `iterative:data_width=25,n_iter=28,angle_guard=0,frac_guard=0,rounding=round` | 354 | 142 | 5.0 | 31 | 0.579 | 1.37e-06 (2^-19.48) | 19.48 |
| 30 | `iterative:data_width=25,n_iter=27,angle_guard=2,frac_guard=1,rounding=trunc` | 360 | 146 | 5.1 | 30 | 0.571 | 8.2e-07 (2^-20.22) | 20.22 |
| 31 | `iterative:data_width=26,n_iter=27,angle_guard=3,frac_guard=0,rounding=trunc` | 363 | 150 | 5.1 | 30 | 0.58 | 7.68e-07 (2^-20.31) | 20.31 |
| 32 | `iterative:data_width=27,n_iter=23,angle_guard=-1,frac_guard=0,rounding=trunc` | 368 | 151 | 5.9 | 26 | 0.508 | 7.4e-07 (2^-20.37) | 20.37 |
| 33 | `iterative:data_width=25,n_iter=27,angle_guard=1,frac_guard=2,rounding=trunc` | 375 | 147 | 5.1 | 30 | 0.59 | 6.82e-07 (2^-20.48) | 20.48 |
| 34 | `iterative:data_width=27,n_iter=23,angle_guard=3,frac_guard=0,rounding=trunc` | 375 | 155 | 5.9 | 26 | 0.519 | 5e-07 (2^-20.93) | 20.93 |
| 35 | `iterative:data_width=26,n_iter=27,angle_guard=4,frac_guard=0,rounding=round` | 380 | 151 | 5.1 | 30 | 0.6 | 3.6e-07 (2^-21.40) | 21.40 |
| 36 | `iterative:data_width=26,n_iter=24,angle_guard=3,frac_guard=2,rounding=trunc` | 389 | 154 | 5.7 | 27 | 0.552 | 3.21e-07 (2^-21.57) | 21.57 |
| 37 | `iterative:data_width=28,n_iter=28,angle_guard=1,frac_guard=0,rounding=trunc` | 398 | 158 | 4.9 | 31 | 0.649 | 2.4e-07 (2^-21.99) | 21.99 |
| 38 | `iterative:data_width=28,n_iter=28,angle_guard=1,frac_guard=0,rounding=round` | 413 | 158 | 4.9 | 31 | 0.666 | 1.32e-07 (2^-22.85) | 22.85 |
| 39 | `iterative:data_width=28,n_iter=27,angle_guard=3,frac_guard=1,rounding=trunc` | 419 | 162 | 5.0 | 30 | 0.656 | 1e-07 (2^-23.25) | 23.25 |
| 40 | `iterative:data_width=28,n_iter=27,angle_guard=4,frac_guard=1,rounding=trunc` | 420 | 163 | 5.0 | 30 | 0.659 | 9.79e-08 (2^-23.28) | 23.28 |
| 41 | `iterative:data_width=27,n_iter=30,angle_guard=4,frac_guard=4,rounding=trunc` | 461 | 164 | 4.6 | 33 | 0.776 | 5.53e-08 (2^-24.11) | 24.11 |
| 42 | `iterative:data_width=28,n_iter=30,angle_guard=3,frac_guard=4,rounding=trunc` | 479 | 168 | 4.6 | 33 | 0.804 | 3.39e-08 (2^-24.81) | 24.81 |
| 43 | `iterative:data_width=28,n_iter=30,angle_guard=4,frac_guard=4,rounding=trunc` | 481 | 169 | 4.6 | 33 | 0.808 | 2.61e-08 (2^-25.19) | 25.19 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec demands >=1 MSPS and max_abs_err <= 2^-10, with area (LUTs+FFs) as the primary objective. Accuracy depends only on data_width, n_iter, angle_guard, frac_guard and rounding, so all families can achieve the same accuracy for the same parameters. Throughput is easily met by the iterative family because Fmax/(N+3) >= 1 MHz for N up to 30. Therefore iterative is the most promising family for minimum area and should receive the majority of the budget. The ranges for data_width (10..20) and n_iter (8..20) bracket the feasible accuracy region (W>=12, N>=10) and extend beyond it to identify the constraint boundary and the full Pareto front. angle_guard and frac_guard are varied modestly to capture any area-accuracy trade-offs from internal precision. unrolled_k and pipelined_m are given smaller shares to confirm they are dominated for this low-throughput, low-area application, and to cover the front if they unexpectedly offer a better area-accuracy point.*)
- `iterative` (70 evals): data_width=10..20, n_iter=8..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Iterative is the lowest-area family: one shared datapath, no pipeline registers. It can easily meet the 1 MSPS throughput constraint because Fmax/(N+3) >= 1 MHz for N up to 30 at typical Artix-7 speeds. Accuracy needs W >= 12 and N >= 10 to reach max_abs_err <= 2^-10. The ranges cover the feasible region and extend slightly beyond to locate the Pareto front and constraint boundaries.
- `unrolled_k` (15 evals): data_width=10..20, n_iter=8..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, k=2..4. *Why:* Unrolled_k trades area for throughput by chaining k micro-rotations per cycle. Since the spec only needs 1 MSPS, iterative already satisfies throughput, so unrolled_k is likely dominated in area. A small budget checks whether any k gives a better area-accuracy trade-off than iterative, and helps map the front if it does.
- `pipelined_m` (15 evals): data_width=10..20, n_iter=8..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* Pipelined_m registers every m stages, giving 1 result/cycle with fewer registers than fully pipelined. It may offer higher Fmax and lower latency, but its area is likely higher than iterative. A small budget verifies whether it can compete on the area objective or contributes to the Pareto front at higher accuracy.

**Result (code):** 100 evaluations this round, 100 total; 55 feasible; hypervolume 6291 (n/a).

**LLM decision:** `widen` — Evidence: the only feasible Pareto points are 9 iterative designs with luts_plus_ffs 262..386 and accuracy_bits 10.6..15.3. Treating the HV reference as (area=1500, acc=10), the hypervolume is almost entirely the last segment: (1500-386)*(15.3-10) = ~5900 of the 6291 total; the low-area segments contribute <400. So HV is maximised by pushing accuracy higher at moderate area, and the current front covers only 10.6..15.3 of an achievable ~26 bits (W allows 8..28, only 14..20 was explored; n_iter only up to 20 of 30). pipelined is unnecessary: accuracy is family-independent and iterative has the smallest cost model, so unrolled_k/pipelined_m (best feasible areas 385 and 880) cannot be non-dominated for min luts_plus_ffs, and the spec's only other constraint (throughput >= 1) is met by every family with huge margin (best seen 171 MSPS). Hence: widen the parameter ranges toward the high-accuracy end rather than add a family, refine, or stop.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6291 (gain this round: n/a (first round)).
Feasible designs: 55 of 100 evaluations (52 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 45% violate; best seen 2.4e-05 (2^-15.35)

Pareto front (feasible, 9 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=262, accuracy_bits=10.6, luts=170, ffs=92, throughput_msps=11, max_abs_err=0.000648 (2^-10.59), power_index=0.177
- iterative [data_width=17 n_iter=12 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=281, accuracy_bits=10.8, luts=179, ffs=102, throughput_msps=13.2, max_abs_err=0.000568 (2^-10.78), power_index=0.158
- iterative [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=285, accuracy_bits=11.7, luts=183, ffs=102, throughput_msps=11, max_abs_err=0.000307 (2^-11.67), power_index=0.193
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=311, accuracy_bits=12.5, luts=204, ffs=107, throughput_msps=11.4, max_abs_err=0.000178 (2^-12.46), power_index=0.199
- iterative [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=318, accuracy_bits=13.2, luts=206, ffs=112, throughput_msps=10.8, max_abs_err=0.000109 (2^-13.17), power_index=0.215
- iterative [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=326, accuracy_bits=13.5, luts=214, ffs=112, throughput_msps=10.8, max_abs_err=8.66e-05 (2^-13.50), power_index=0.221
- iterative [data_width=19 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=356, accuracy_bits=14, luts=242, ffs=114, throughput_msps=7.57, max_abs_err=5.95e-05 (2^-14.04), power_index=0.281
- iterative [data_width=20 n_iter=18 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=377, accuracy_bits=14.7, luts=258, ffs=119, throughput_msps=7.57, max_abs_err=3.75e-05 (2^-14.70), power_index=0.298
- iterative [data_width=20 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc] luts_plus_ffs=386, accuracy_bits=15.3, luts=264, ffs=122, throughput_msps=7.09, max_abs_err=2.4e-05 (2^-15.35), power_index=0.319
Front coverage: luts_plus_ffs 262..386 (HV reference 1500); accuracy_bits 10.6..15.3 (HV reference 10); data_width on the front 14..20 (registry 8..28).

Per family:
- iterative: 70 evals, 42 feasible; max throughput seen 16.5 MSPS; best accuracy 15.35 bits; best feasible luts_plus_ffs=262; feasible ranges: data_width 14..20, n_iter 12..20, angle_guard -2..3, frac_guard 0..3
- unrolled_k: 15 evals, 8 feasible; max throughput seen 14 MSPS; best accuracy 13.80 bits; best feasible luts_plus_ffs=385; feasible ranges: data_width 15..19, n_iter 12..16, angle_guard -1..2, frac_guard 1..3, k 2..4
- pipelined_m: 15 evals, 5 feasible; max throughput seen 171 MSPS; best accuracy 12.61 bits; best feasible luts_plus_ffs=880; feasible ranges: data_width 15..17, n_iter 12..17, angle_guard 0..1, frac_guard 0..3, m 3..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Round-1 budget was spent with ranges that only reached data_width<=20 / n_iter<=20 (feasible ranges and front data_width 14..20), so the front stops at accuracy_bits=15.3 while the registry allows ~26 for W=28. HV is dominated by the top-accuracy point: with ref (1500,10) the last term (1500-386)*(15.3-10)=~5900 of the total 6291 comes from it, so every extra accuracy bit at area ~400-600 is worth ~1000 HV. Widening W and n_iter is therefore the highest-value move; keep the low-area corner (W>=14) so the min-luts_plus_ffs selection rule (currently 262 @ 10.6 bits) is not lost. Throughput stays well above the >=1 MSPS constraint (iterative at n_iter=30 is ~33 cycles => several MSPS), so no risk there.*)
- `iterative` (85 evals): data_width=14..28, n_iter=15..30, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* front is dominated by the high-accuracy end; iterative is the only family that can be non-dominated for min luts_plus_ffs
- `unrolled_k` (15 evals): data_width=14..24, n_iter=15..26, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round, k=2..6. *Why:* confirm no non-iterative family can buy accuracy more cheaply near the throughput constraint

**Result (code):** 100 evaluations this round, 200 total; 154 feasible; hypervolume 1.438e+04 (+128.5%).

**LLM decision:** `refine` — The decisive gap is at the area end, not the accuracy end, and not in a new family. (1) throughput_msps >= 1 is already met by every front design (iterative 4.8-11 MSPS), so pipelined/pipelined_m (1 result/cycle) buy nothing: their only feasible points start at luts_plus_ffs=880 (pipelined_m) and pipelined would be larger still for the same accuracy bits (accuracy depends only on W/N/guards/rounding), i.e. strictly area-dominated by the existing iteration points - skip add_family for pipelined. (2) The accuracy end is nearly saturated: best seen 23.51 bits at data_width=28 (registry max 28), only n_iter=29 of 30 used, and the 676-area point already carries ~79% of the hypervolume, so extra high-accuracy evals have little headroom. (3) The front's luts_plus_ffs range starts at 262 with data_width=14, but the error constraint (2^-10 = output LSB at W=12) plus rounding=round suggests feasible designs at W=12..13, which would be both the new min-area point (selection rule) and the low-area foot of the HV curve; 23% of evaluations currently violate max_abs_err, so refining near that boundary with both rounding choices and guard bits is where the next 100 evals pay off. Round 4's reserved full-range front mapping will then broaden the curve on the families actually on the front.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.438e+04 (gain this round: +128.5%).
Feasible designs: 154 of 200 evaluations (140 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 23% violate; best seen 8.36e-08 (2^-23.51)

Pareto front (feasible, 31 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=262, accuracy_bits=10.6, luts=170, ffs=92, throughput_msps=11, max_abs_err=0.000648 (2^-10.59), power_index=0.177
- iterative [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=285, accuracy_bits=11.7, luts=183, ffs=102, throughput_msps=11, max_abs_err=0.000307 (2^-11.67), power_index=0.193
- iterative [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=318, accuracy_bits=13.2, luts=206, ffs=112, throughput_msps=10.8, max_abs_err=0.000109 (2^-13.17), power_index=0.215
- iterative [data_width=17 n_iter=19 angle_guard=3 frac_guard=3 rounding=trunc] luts_plus_ffs=355, accuracy_bits=13.8, luts=244, ffs=111, throughput_msps=7.23, max_abs_err=6.97e-05 (2^-13.81), power_index=0.294
- iterative [data_width=19 n_iter=18 angle_guard=2 frac_guard=1 rounding=trunc] luts_plus_ffs=362, accuracy_bits=14.3, luts=246, ffs=116, throughput_msps=7.57, max_abs_err=4.83e-05 (2^-14.34), power_index=0.286
- iterative [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=430, accuracy_bits=15.4, luts=312, ffs=118, throughput_msps=7.57, max_abs_err=2.34e-05 (2^-15.38), power_index=0.34
- iterative [data_width=24 n_iter=27 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=460, accuracy_bits=18.2, luts=322, ffs=138, throughput_msps=5.2, max_abs_err=3.21e-06 (2^-18.25), power_index=0.519
- iterative [data_width=25 n_iter=27 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=484, accuracy_bits=19.2, luts=341, ffs=143, throughput_msps=5.2, max_abs_err=1.66e-06 (2^-19.20), power_index=0.546
- iterative [data_width=27 n_iter=23 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=535, accuracy_bits=21, luts=383, ffs=152, throughput_msps=5.89, max_abs_err=4.81e-07 (2^-20.99), power_index=0.524
- iterative [data_width=28 n_iter=29 angle_guard=1 frac_guard=2 rounding=round] luts_plus_ffs=676, accuracy_bits=23.5, luts=514, ffs=162, throughput_msps=4.79, max_abs_err=8.36e-08 (2^-23.51), power_index=0.814
Front coverage: luts_plus_ffs 262..676 (HV reference 1500); accuracy_bits 10.6..23.5 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 155 evals, 127 feasible; max throughput seen 16.5 MSPS; best accuracy 23.51 bits; best feasible luts_plus_ffs=262; feasible ranges: data_width 14..28, n_iter 12..29, angle_guard -2..3, frac_guard 0..3
- unrolled_k: 30 evals, 22 feasible; max throughput seen 14 MSPS; best accuracy 18.80 bits; best feasible luts_plus_ffs=385; feasible ranges: data_width 15..24, n_iter 12..26, angle_guard -1..2, frac_guard 0..3, k 2..6
- pipelined_m: 15 evals, 5 feasible; max throughput seen 171 MSPS; best accuracy 12.61 bits; best feasible luts_plus_ffs=880; feasible ranges: data_width 15..17, n_iter 12..17, angle_guard 0..1, frac_guard 0..3, m 3..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Map the low-area corner of the front, where the selection rule picks and where the front is currently empty.*)
- `iterative` (34 evals): data_width=11..15, n_iter=12..22, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Selection rule is min luts_plus_ffs and the front only starts at data_width=14; W=12..13 is unexplored and the 2^-10 error budget (output LSB 2^-(W-2)) leaves room for W=12 with rounding.
- `unrolled_k` (6 evals): data_width=11..15, n_iter=12..22, angle_guard=0..2, frac_guard=0..3, rounding=trunc|round, k=2..4. *Why:* Cheap cross-check that no unrolled_k design in the same low-area window beats iterative on luts_plus_ffs.

**Result (code):** 40 evaluations this round, 240 total; 177 feasible; hypervolume 1.438e+04 (+0.0%).

**LLM decision:** `stop` — Final round, and the front has stopped improving (HV gain +0.0% this round) while already covering the objectives well: 34 feasible designs spanning luts_plus_ffs 253..676 and accuracy_bits 10.2..23.5, with data_width 14..28 on the front. Both constraints are comfortably satisfiable — throughput best seen 171 MSPS vs >=1 required, and max_abs_err best 8.36e-08 vs <=2^-10 required — and the selection rule (min luts_plus_ffs) is already served by iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] at luts_plus_ffs=253, accuracy_bits=10.2, throughput 13.2 MSPS, which meets both constraints. The unexplored pipelined family would only add high-throughput points (pipelined_m already shows 171 MSPS at luts_plus_ffs>=880), which cannot beat the area-optimal corner this spec selects on, so further exploration has no expected value.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 1.438e+04 (gain this round: +0.0%).
Feasible designs: 177 of 240 evaluations (158 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 26% violate; best seen 8.36e-08 (2^-23.51)

Pareto front (feasible, 34 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=17 angle_guard=4 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=10.8, luts=183, ffs=96, throughput_msps=7.95, max_abs_err=0.000548 (2^-10.83), power_index=0.21
- iterative [data_width=16 n_iter=23 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=293, accuracy_bits=11.7, luts=195, ffs=98, throughput_msps=6.23, max_abs_err=0.000301 (2^-11.70), power_index=0.287
- iterative [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=326, accuracy_bits=13.5, luts=214, ffs=112, throughput_msps=10.8, max_abs_err=8.66e-05 (2^-13.50), power_index=0.221
- iterative [data_width=18 n_iter=19 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=357, accuracy_bits=14.2, luts=244, ffs=113, throughput_msps=7.23, max_abs_err=5.33e-05 (2^-14.20), power_index=0.295
- iterative [data_width=19 n_iter=18 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=378, accuracy_bits=15, luts=260, ffs=118, throughput_msps=7.57, max_abs_err=3.04e-05 (2^-15.00), power_index=0.299
- iterative [data_width=22 n_iter=21 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=447, accuracy_bits=17.6, luts=315, ffs=132, throughput_msps=6.5, max_abs_err=5.09e-06 (2^-17.58), power_index=0.404
- iterative [data_width=25 n_iter=27 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=484, accuracy_bits=19.2, luts=341, ffs=143, throughput_msps=5.2, max_abs_err=1.66e-06 (2^-19.20), power_index=0.546
- iterative [data_width=25 n_iter=27 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=523, accuracy_bits=20.5, luts=375, ffs=147, throughput_msps=5.11, max_abs_err=6.82e-07 (2^-20.48), power_index=0.59
- iterative [data_width=28 n_iter=29 angle_guard=1 frac_guard=2 rounding=round] luts_plus_ffs=676, accuracy_bits=23.5, luts=514, ffs=162, throughput_msps=4.79, max_abs_err=8.36e-08 (2^-23.51), power_index=0.814
Front coverage: luts_plus_ffs 253..676 (HV reference 1500); accuracy_bits 10.2..23.5 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 189 evals, 148 feasible; max throughput seen 16.5 MSPS; best accuracy 23.51 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..28, n_iter 12..29, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 36 evals, 24 feasible; max throughput seen 14 MSPS; best accuracy 18.80 bits; best feasible luts_plus_ffs=385; feasible ranges: data_width 14..24, n_iter 12..26, angle_guard -1..2, frac_guard 0..3, k 2..6
- pipelined_m: 15 evals, 5 feasible; max throughput seen 171 MSPS; best accuracy 12.61 bits; best feasible luts_plus_ffs=880; feasible ranges: data_width 15..17, n_iter 12..17, angle_guard 0..1, frac_guard 0..3, m 3..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (160 evals): data_width=13..28, n_iter=10..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (34 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 316 feasible; hypervolume 1.596e+04 (+11.0%).

**No LLM call** (code's front-mapping round): Final round, and the front has stopped improving (HV gain +0.0% this round) while already covering the objectives well: 34 feasible designs spanning luts_plus_ffs 253..676 and accuracy_bits 10.2..23.5, with data_width 14..28 on the front. Both constraints are comfortably satisfiable — throughput best seen 171 MSPS vs >=1 required, and max_abs_err best 8.36e-08 vs <=2^-10 required — and the selection rule (min luts_plus_ffs) is already served by iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] at luts_plus_ffs=253, accuracy_bits=10.2, throughput 13.2 MSPS, which meets both constraints. The unexplored pipelined family would only add high-throughput points (pipelined_m already shows 171 MSPS at luts_plus_ffs>=880), which cannot beat the area-optimal corner this spec selects on, so further exploration has no expected value.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.596e+04 (gain this round: +11.0%).
Feasible designs: 316 of 400 evaluations (281 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 21% violate; best seen 2.61e-08 (2^-25.19)

Pareto front (feasible, 44 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=17 n_iter=15 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=285, accuracy_bits=11.7, luts=183, ffs=102, throughput_msps=11, max_abs_err=0.000307 (2^-11.67), power_index=0.193
- iterative [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=326, accuracy_bits=13.5, luts=214, ffs=112, throughput_msps=10.8, max_abs_err=8.66e-05 (2^-13.50), power_index=0.221
- iterative [data_width=22 n_iter=16 angle_guard=3 frac_guard=0 rounding=trunc] luts_plus_ffs=373, accuracy_bits=14.7, luts=244, ffs=129, throughput_msps=9.97, max_abs_err=3.7e-05 (2^-14.72), power_index=0.267
- iterative [data_width=21 n_iter=27 angle_guard=4 frac_guard=0 rounding=round] luts_plus_ffs=413, accuracy_bits=16.4, luts=287, ffs=126, throughput_msps=5.2, max_abs_err=1.15e-05 (2^-16.41), power_index=0.466
- iterative [data_width=22 n_iter=21 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=447, accuracy_bits=17.6, luts=315, ffs=132, throughput_msps=6.5, max_abs_err=5.09e-06 (2^-17.58), power_index=0.404
- iterative [data_width=25 n_iter=28 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=496, accuracy_bits=19.5, luts=354, ffs=142, throughput_msps=5.03, max_abs_err=1.37e-06 (2^-19.48), power_index=0.579
- iterative [data_width=25 n_iter=27 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=523, accuracy_bits=20.5, luts=375, ffs=147, throughput_msps=5.11, max_abs_err=6.82e-07 (2^-20.48), power_index=0.59
- iterative [data_width=28 n_iter=28 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=571, accuracy_bits=22.9, luts=413, ffs=158, throughput_msps=4.94, max_abs_err=1.32e-07 (2^-22.85), power_index=0.666
- iterative [data_width=28 n_iter=30 angle_guard=4 frac_guard=4 rounding=trunc] luts_plus_ffs=651, accuracy_bits=25.2, luts=481, ffs=169, throughput_msps=4.56, max_abs_err=2.61e-08 (2^-25.19), power_index=0.808
Front coverage: luts_plus_ffs 253..651 (HV reference 1500); accuracy_bits 10.2..25.2 (HV reference 10); data_width on the front 14..28 (registry 8..28).

Per family:
- iterative: 349 evals, 287 feasible; max throughput seen 16.5 MSPS; best accuracy 25.19 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 13..28, n_iter 11..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 36 evals, 24 feasible; max throughput seen 14 MSPS; best accuracy 18.80 bits; best feasible luts_plus_ffs=385; feasible ranges: data_width 14..24, n_iter 12..26, angle_guard -1..2, frac_guard 0..3, k 2..6
- pipelined_m: 15 evals, 5 feasible; max throughput seen 171 MSPS; best accuracy 12.61 bits; best feasible luts_plus_ffs=880; feasible ranges: data_width 15..17, n_iter 12..17, angle_guard 0..1, frac_guard 0..3, m 3..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 11070 in, 17474 out
- provider-reported cost: $0.0180
- full prompts and replies: `llm_trace.jsonl`

