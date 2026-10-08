# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 300 of 400 budgeted, over 3 round(s).  
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
`pipelined_m:data_width=26,n_iter=22,angle_guard=2,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1908 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 404 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.35 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 6.89e-07 (2^-20.47) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.6 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.09e-07 (2^-22.19) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.51 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.5 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=2,frac_guard=0,rounding=round,m=6` | 1908 | 404 | 59.9 | 6 | 4.35 | 6.89e-07 (2^-20.47) | 20.47 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires max_abs_err <= 2^-20 (~9.54e-7) and throughput >= 50 MSPS while minimising LUT+FF and power. Accuracy forces n_iter >= 20 and data_width >= 22 (output LSB = 2^-(W-2)). The iterative family is excluded: even at N=20 it needs Fmax >= 50*(20+3) = 1150 MHz, far beyond Artix-7. The remaining families can meet throughput, but trade area against power. unrolled_k shares the datapath over multiple cycles, giving the smallest LUT+FF; its k must be large enough to reach 50 MSPS. pipelined_m and pipelined produce 1 result/cycle but have N stages, so area is larger; they may offer lower power at reduced clock. Budget is weighted toward unrolled_k because it is the most likely area winner, with smaller shares to test whether pipelined_m or pipelined can beat it on the power objective. All searches fix rounding=round because the error constraint is tight and rounding adds negligible area. angle_guard and frac_guard ranges allow the optimiser to trade extra bits for accuracy versus area. The first-round budget of 100 evals is split as 60 unrolled_k, 25 pipelined_m, 15 pipelined.*)
- `unrolled_k` (61 evals): data_width=22..26, n_iter=20..28, angle_guard=-2..4, frac_guard=0..4, rounding=round, k=4..8. *Why:* Most promising for minimising LUT+FF: the datapath is shared over ceil(N/k) cycles, so area scales roughly with k rather than N. Needs k large enough to reach 50 MSPS with achievable Fmax; searching k=4..8 finds the smallest k that just meets throughput. Fix rounding=round because the max_abs_err constraint is tight.
- `pipelined_m` (25 evals): data_width=22..26, n_iter=20..28, angle_guard=-2..4, frac_guard=0..4, rounding=round, m=2..6. *Why:* Offers 1 result/cycle but still has N combinational stages; area is larger than unrolled_k. However, fewer registers than full pipelined may reduce FFs and allow lower power at lower Fmax. m=2..6 tests the boundary where Fmax drops below 50 MSPS.
- `pipelined` (14 evals): data_width=22..26, n_iter=20..28, angle_guard=-2..4, frac_guard=0..4, rounding=round. *Why:* Reference architecture for 1 result/cycle. Expected to have the largest area due to per-stage registers, but included to map the throughput-area-power Pareto front and confirm whether any power saving justifies the area increase.

**Result (code):** 100 evaluations this round, 100 total; 19 feasible; hypervolume 8.215e+04 (n/a).

**LLM decision:** `refine` — Round 1 leaves a single feasible Pareto point, so the front is under-sampled. pipelined_m is the strongest family: 15 feasible designs, best luts_plus_ffs=2578, power_index=4.85, throughput=86 MSPS, max_abs_err=4.56e-07. pipelined is feasible but its best area is 4071, so it is dominated unless it offers lower power, which is unlikely with registers at every stage. unrolled_k produced 0 feasible designs and its best seen throughput is only 6.52 MSPS, far below the 50 MSPS constraint. iterative is not yet explored, but using the observed pipelined max throughput of 257 MSPS as an optimistic 1-result/cycle bound, an accuracy-required CORDIC would need N around 22+, giving N+3 >= 25 cycles and therefore well under 50 MSPS even at that optimistic Fmax. So adding iterative is unlikely to help and would waste budget. Refining pipelined_m around the feasible region is the best use of the next 100 evaluations.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.215e+04 (gain this round: n/a (first round)).
Feasible designs: 19 of 100 evaluations (17 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 61% violate; best seen 257
- max_abs_err <= 9.53674e-07: 58% violate; best seen 8.71e-08 (2^-23.45)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=4] luts_plus_ffs=2578, power_index=4.85, luts=1999, ffs=579, throughput_msps=86, max_abs_err=4.56e-07 (2^-21.06)

Per family:
- unrolled_k: 61 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 23.45 bits
- pipelined: 14 evals, 4 feasible; max throughput seen 257 MSPS; best accuracy 23.45 bits; best feasible luts_plus_ffs=4071; feasible ranges: data_width 25..26, n_iter 23..28, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 25 evals, 15 feasible; max throughput seen 158 MSPS; best accuracy 22.01 bits; best feasible luts_plus_ffs=2578; feasible ranges: data_width 23..26, n_iter 22..27, angle_guard 1..3, frac_guard 0..3, m 3..6
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Round 1 leaves a single feasible Pareto point, so the front is under-sampled. pipelined_m is the strongest family: 15 feasible designs, best luts_plus_ffs=2578, power_index=4.85, throughput=86 MSPS, max_abs_err=4.56e-07. pipelined is feasible but its best area is 4071, so it is dominated unless it offers lower power, which is unlikely with registers at every stage. unrolled_k produced 0 feasible designs and its best seen throughput is only 6.52 MSPS, far below the 50 MSPS constraint. iterative is not yet explored, but using the observed pipelined max throughput of 257 MSPS as an optimistic 1-result/cycle bound, an accuracy-required CORDIC would need N around 22+, giving N+3 >= 25 cycles and therefore well under 50 MSPS even at that optimistic Fmax. So adding iterative is unlikely to help and would waste budget. Refining pipelined_m around the feasible region is the best use of the next 100 evaluations.*)
- `pipelined_m` (100 evals): data_width=23..27, n_iter=21..24, angle_guard=1..3, frac_guard=0..2, rounding=trunc|round, m=4..6. *Why:* pipelined_m has 15 feasible designs and the only current Pareto point; best area 2578 LUT+FF, power 4.85, throughput 86 MSPS, error 2^-21.06. Explore lower n_iter / smaller area while staying above 50 MSPS and below 2^-20 error.

**Result (code):** 100 evaluations this round, 200 total; 89 feasible; hypervolume 8.903e+04 (+8.4%).

**LLM decision:** `refine` — The feasible front currently contains a single design: pipelined_m [d=26 n=22 ag=2 fg=0 round m=6] with luts_plus_ffs=2312, power_index=4.35, throughput=59.9 MSPS, max_abs_err=2^-20.47. It is barely feasible on both constraints (throughput >=50, err <=2^-20), so the front is thin and hypervolume is limited. The only families that can meet the 50 MSPS throughput constraint are pipelined and pipelined_m: unrolled_k maxed at 6.52 MSPS and iterative (1 micro-rotation/cycle) is strictly slower, so adding iterative would waste budget. Pipelined_m already dominates pipelined on area (best feasible 2312 vs 4071), so the search should concentrate on pipelined_m around the promising region, widening m to 8 and data_width down to 22 to find lower-area/lower-power points while compensating accuracy with n_iter, angle_guard and frac_guard. A small pipelined allocation is kept only as a sanity check for any low-n_iter area win.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.903e+04 (gain this round: +8.4%).
Feasible designs: 89 of 200 evaluations (67 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 30% violate; best seen 257
- max_abs_err <= 9.53674e-07: 44% violate; best seen 8.71e-08 (2^-23.45)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=2312, power_index=4.35, luts=1908, ffs=404, throughput_msps=59.9, max_abs_err=6.89e-07 (2^-20.47)

Per family:
- unrolled_k: 61 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 23.45 bits
- pipelined: 14 evals, 4 feasible; max throughput seen 257 MSPS; best accuracy 23.45 bits; best feasible luts_plus_ffs=4071; feasible ranges: data_width 25..26, n_iter 23..28, angle_guard 0..4, frac_guard 1..4
- pipelined_m: 125 evals, 85 feasible; max throughput seen 158 MSPS; best accuracy 22.43 bits; best feasible luts_plus_ffs=2312; feasible ranges: data_width 23..27, n_iter 22..27, angle_guard 1..3, frac_guard 0..3, m 3..6
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Focus 80% of the 100-eval round on pipelined_m around the only feasible front point, expanding m to 8 and data_width down to 22 to search for lower luts_plus_ffs and power_index. Keep 20% on pipelined to confirm it cannot beat pipelined_m on area. Skip iterative/unrolled_k because their throughput ceiling (<=6.52 MSPS seen) is far below the 50 MSPS constraint.*)
- `pipelined_m` (80 evals): data_width=22..27, n_iter=20..28, angle_guard=1..3, frac_guard=0..3, rounding=round, m=4..8. *Why:* Current best is pipelined_m; explore lower data_width (22-23) and higher m (7-8) for area/FF reduction, and lower n_iter (20-21) with more frac_guard/angle_guard to keep max_abs_err <= 2^-20.
- `pipelined` (20 evals): data_width=24..27, n_iter=22..28, angle_guard=1..3, frac_guard=0..3, rounding=round. *Why:* Sanity check: pipelined has higher area (best 4071) but could offer a different area/power trade-off at low n_iter; small allocation only.

**Result (code):** 100 evaluations this round, 300 total; 146 feasible; hypervolume 8.903e+04 (+0.0%).

**LLM decision:** `refine` — The feasible front is a single point (pipelined_m d=26 n=22 ag=2 fg=0 m=6: 2312 LUT+FF, power 4.35, 59.9 MSPS, err 6.89e-7 = 2^-20.47), and HV gained 0.0% last round, so the search is stuck on a thin boundary. The two unexplored/weak families cannot help: unrolled_k saw 0/61 feasible with max throughput 6.52 MSPS, and iterative (N+3 cycles/result) would need Fmax > 1 GHz at N>=22 to reach 50 MSPS, so both are throughput-infeasible. The only viable families are pipelined (20/34 feasible, best 4071 LUT+FF) and pipelined_m (126/205 feasible, best 2312 LUT+FF). The current point sits only ~20% above the 50 MSPS floor and ~0.5 bit above the 2^-20 error floor, so there is slack to trade: lower data_width / n_iter and higher frac_guard/angle_guard should cut area and power while staying feasible. Spend the remaining 100 evals refining that boundary region in both pipelined families.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 8.903e+04 (gain this round: +0.0%).
Feasible designs: 146 of 300 evaluations (109 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 24% violate; best seen 257
- max_abs_err <= 9.53674e-07: 41% violate; best seen 5.36e-08 (2^-24.15)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=2312, power_index=4.35, luts=1908, ffs=404, throughput_msps=59.9, max_abs_err=6.89e-07 (2^-20.47)

Per family:
- unrolled_k: 61 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 23.45 bits
- pipelined: 34 evals, 20 feasible; max throughput seen 257 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=4071; feasible ranges: data_width 25..27, n_iter 22..28, angle_guard 0..4, frac_guard 0..4
- pipelined_m: 205 evals, 126 feasible; max throughput seen 158 MSPS; best accuracy 23.19 bits; best feasible luts_plus_ffs=2312; feasible ranges: data_width 23..27, n_iter 22..28, angle_guard 1..3, frac_guard 0..3, m 3..7
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 7220 in, 25387 out
- provider-reported cost: $0.0259
- full prompts and replies: `llm_trace.jsonl`

