# DSE run: low_area_control

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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
`iterative:data_width=15,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 170 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 94 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 11 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 18 | exact: schedule |
| latency_ns | 90.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.179 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000567 (2^-10.78) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 4.65 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000144 (2^-12.76) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.18 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.8 | exact: bit-accurate model, exhaustive (32768 angles) |

## Pareto front (6 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 170 | 94 | 11.0 | 18 | 0.179 | 0.000567 (2^-10.78) | 10.78 |
| 1 | `iterative:data_width=15,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 180 | 96 | 10.4 | 19 | 0.197 | 0.000436 (2^-11.16) | 11.16 |
| 2 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 179 | 97 | 11.0 | 18 | 0.187 | 0.000301 (2^-11.70) | 11.70 |
| 3 | `iterative:data_width=16,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 10.4 | 19 | 0.199 | 0.000285 (2^-11.78) | 11.78 |
| 4 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=1,rounding=round` | 225 | 100 | 11.7 | 17 | 0.207 | 0.000209 (2^-12.22) | 12.22 |
| 5 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=3,rounding=round` | 242 | 103 | 10.8 | 18 | 0.234 | 0.000203 (2^-12.27) | 12.27 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The objective is minimum LUTs+FFs subject to throughput >= 1 MSPS and error <= 2^-10, with accuracy_bits as the second objective. The iterative family is the most area-efficient and should easily meet 1 MSPS, so most of the budget goes there. Pipelined families replicate stages and cost more area with throughput we do not need, so I leave them out for round one. Ranges are narrowed around the accuracy threshold: error <= 2^-10 needs about 10 bits of accuracy, so very small widths and very low iteration counts are excluded. I will tighten the ranges after seeing which designs are feasible.*)
- `iterative` (77 evals): data_width=10..16, n_iter=8..16, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Shared datapath is the smallest-area family, and N+3 cycles per result at a 100+ MHz clock still gives well over 1 MSPS. Error <= 2^-10 needs roughly 11-12 fractional bits plus guard, so data_width 10-16 and n_iter 8-16 cover the plausible area-minimal designs.
- `unrolled_k` (23 evals): data_width=10..15, n_iter=8..14, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, k=2..3. *Why:* Small k adds little area but cuts cycles per result. This is a hedge in case the iterative family falls short of the throughput constraint, and a check on whether the extra logic is ever worth it for area.

**Result (code):** 100 evaluations this round, 100 total; 35 feasible; hypervolume 2738 (n/a).

**LLM decision:** `refine` — Round 1 found a feasible front of 3 iterative designs. The smallest feasible area is 271 LUTs+FFs at data_width=14, n_iter=15, angle_guard=1, frac_guard=3, trunc, with 10.2 bits against the 10-bit requirement. Throughput is not binding: 0% violation, with iterative at about 11 MSPS against a 1 MSPS requirement. Accuracy is the binding constraint (65% violate). Unrolled_k is dominated, with a best of 411 versus 271 for iterative. Pipelined and pipelined_m use one stage per micro-rotation or per m rotations, so they should cost more area than a shared datapath, and throughput is already ample. I will concentrate the budget on iterative around the feasible region (data_width 11..16, n_iter 11..16, since error 2^-10 needs about 10 bits), including smaller widths with round and low frac_guard, which may shave area. A small share goes to unrolled_k and pipelined_m so the unexplored families get a sanity check.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2738 (gain this round: n/a (first round)).
Feasible designs: 35 of 100 evaluations (25 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 20.4
- max_abs_err <= 0.000976562: 65% violate; best seen 0.000203 (2^-12.27)

Pareto front (feasible, 3 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=14 n_iter=15 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=271, accuracy_bits=10.2, luts=178, ffs=93, throughput_msps=11, max_abs_err=0.000845 (2^-10.21), power_index=0.183
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.7, luts=179, ffs=97, throughput_msps=11, max_abs_err=0.000301 (2^-11.70), power_index=0.187
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=3 rounding=round] luts_plus_ffs=345, accuracy_bits=12.3, luts=242, ffs=103, throughput_msps=10.8, max_abs_err=0.000203 (2^-12.27), power_index=0.234

Per family:
- iterative: 77 evals, 28 feasible; max throughput seen 18.5 MSPS; best accuracy 12.27 bits; best feasible luts_plus_ffs=271; feasible ranges: data_width 14..16, n_iter 13..16, angle_guard 0..2, frac_guard 0..3
- unrolled_k: 23 evals, 7 feasible; max throughput seen 20.4 MSPS; best accuracy 11.28 bits; best feasible luts_plus_ffs=411; feasible ranges: data_width 14..15, n_iter 14..14, angle_guard 2..3, frac_guard 1..2, k 3..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the minimum-area iterative region, where the accuracy cliff sits near 10 bits, and make cheap checks of the other families.*)
- `iterative` (80 evals): data_width=11..16, n_iter=10..16, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round. *Why:* Iterative has the lowest area on the front. Smaller data_width and n_iter with round and low guard bits may still meet 2^-10 at less area.
- `pipelined_m` (10 evals): data_width=12..16, n_iter=11..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=6..8. *Why:* Check whether coarse register spacing with large m can compete on area. A small share is enough to confirm or dismiss it.
- `unrolled_k` (10 evals): data_width=12..16, n_iter=11..16, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..3. *Why:* Small k keeps area near iterative. A small share confirms whether it is dominated.

**Result (code):** 100 evaluations this round, 200 total; 71 feasible; hypervolume 2762 (+0.8%).

**LLM decision:** `refine` — Hypervolume gain was only +0.8% in round 2, so the front is near saturation. The spec is area-first, and the throughput constraint (>=1 MSPS) is met by every design (0% violate, iterative runs ~10-18 MSPS). The iterative family holds all 6 front points, with the best at 264 LUTs+FFs and 10.8 bits. Unrolled_k (best 383) and pipelined_m (best 800) are dominated on area. The pipelined family adds one stage per iteration, which is even larger than pipelined_m, so it is not worth exploring. The feasible region is narrow: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..3. The error constraint is violated by 64% of evaluations, so the budget is best spent inside this region, probing slightly lower data_width (13) and n_iter (11..13) to find a smaller design that still meets 2^-10. A small share goes to unrolled_k at k=2 as a sanity check.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.85% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2762 (gain this round: +0.8%).
Feasible designs: 71 of 200 evaluations (49 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 72
- max_abs_err <= 0.000976562: 64% violate; best seen 0.000203 (2^-12.27)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=264, accuracy_bits=10.8, luts=170, ffs=94, throughput_msps=11, max_abs_err=0.000567 (2^-10.78), power_index=0.179
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=275, accuracy_bits=11.2, luts=180, ffs=96, throughput_msps=10.4, max_abs_err=0.000436 (2^-11.16), power_index=0.197
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.7, luts=179, ffs=97, throughput_msps=11, max_abs_err=0.000301 (2^-11.70), power_index=0.187
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=10.4, max_abs_err=0.000285 (2^-11.78), power_index=0.199
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=324, accuracy_bits=12.2, luts=225, ffs=100, throughput_msps=11.7, max_abs_err=0.000209 (2^-12.22), power_index=0.207
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=3 rounding=round] luts_plus_ffs=345, accuracy_bits=12.3, luts=242, ffs=103, throughput_msps=10.8, max_abs_err=0.000203 (2^-12.27), power_index=0.234

Per family:
- iterative: 157 evals, 58 feasible; max throughput seen 18.5 MSPS; best accuracy 12.27 bits; best feasible luts_plus_ffs=264; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..3
- unrolled_k: 33 evals, 11 feasible; max throughput seen 20.4 MSPS; best accuracy 11.57 bits; best feasible luts_plus_ffs=383; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard 0..3, frac_guard 1..2, k 2..3
- pipelined_m: 10 evals, 2 feasible; max throughput seen 72 MSPS; best accuracy 11.73 bits; best feasible luts_plus_ffs=800; feasible ranges: data_width 16..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..1, m 6..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 12494 in, 2602 out
- provider-reported cost: $0.0510
- full prompts and replies: `llm_trace.jsonl`

