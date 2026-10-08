# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=28,n_iter=22,angle_guard=3,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 2063 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 436 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 57.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 57.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 104 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 5.3e-07 (2^-20.85) | exact: bit-accurate model, dense (131053 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 35.6 | exact: bit-accurate model, dense (131053 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 1.96e-07 (2^-22.28) | exact: bit-accurate model, dense (131053 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 13.1 | exact: bit-accurate model, dense (131053 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.8 | exact: bit-accurate model, dense (131053 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=28,n_iter=22,angle_guard=3,frac_guard=0,rounding=round,m=6` | 2063 | 436 | 57.5 | 6 | 4.7 | 5.3e-07 (2^-20.85) | 20.85 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The binding constraints are accuracy and throughput, and they pull in opposite directions. To hit max_abs_err <= 2^-20 the model needs data_width ~23-25 with n_iter ~22-26 plus guard bits (quoted LSB is 2^-(W-2), and the CORDIC residual alone is ~2^-N), so the accuracy window is narrow and roughly shared by every family - accuracy depends only on data_width/n_iter/guards/rounding, not on the family. Throughput >= 50 MSPS is therefore the family filter: iterative gives 1 result per N+3 (~25) cycles and would need ~1.3 GHz, so it is effectively infeasible; unrolled_k needs ~200-300 MHz at k=4..8; pipelined and pipelined_m give 1 result/cycle and clear 50 MSPS trivially. Since the area objective is min luts_plus_ffs, pipelined_m gets the largest share - large m cuts the per-stage FF cost while keeping the same LUT count, and memoryless 50 MSPS gives plenty of Fmax headroom to spend on that trade - with pipelined as the conservative anchor and unrolled_k as the high-upside/uncertain cheaper-datapath option. Round 1 is deliberately broad around the accuracy boundary (W 21..28, N 20..30) so the constraint face is located in one pass; later rounds should narrow W/N to the feasible edge and push m to the largest value that still clears 50 MSPS, then reallocate toward whichever of pipelined_m/unrolled_k proves feasible.*)
- `pipelined_m` (50 evals): data_width=21..28, n_iter=20..30, angle_guard=-1..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Primary contender for min luts_plus_ffs: 1 result/cycle means the throughput-50 MSPS floor only needs ~50 MHz, so the pipeline can be sparsely registered (large m) to strip FFs while LUTs stay fixed. m spans 2..8 to expose the exact FF/Fmax knee. Accuracy params (data_width 21..28, n_iter 20..30, angle_guard -1..4, frac_guard 0..4, rounding) are scanned around the 2^-20 boundary so the search finds the cheapest design that still passes.
- `unrolled_k` (25 evals): data_width=21..28, n_iter=20..30, angle_guard=-1..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* Shares one datapath across k micro-rotations, so LUTs and registration are far below a fully pipelined design; if its Fmax is high enough it wins the area objective outright. With the ~22-24 iterations accuracy demands, k=4..8 gives ceil(N/k)+3 = 5-8 cycles, i.e. it must reach ~200-300 MHz. The search is there to decide empirically whether that is achievable or whether throughput kills it.
- `pipelined` (20 evals): data_width=21..28, n_iter=20..30, angle_guard=-1..4, frac_guard=0..4, rounding=trunc|round. *Why:* Reference fully-registered pipeline: guaranteed 1 result/cycle and highest Fmax, so it is the safe feasibility anchor and bounds how much area pipelined_m can actually save. Same accuracy window; also calibrates the accuracy-parameter grid that is shared identically across all families.
- `iterative` (5 evals): data_width=21..28, n_iter=20..30, angle_guard=-1..4, frac_guard=0..4, rounding=trunc|round. *Why:* Smallest shared datapath, so it would be the area winner if throughput allowed. N+3 cycles/result at N~22-24 needs >1 GHz Fmax, which is almost certainly infeasible; a small share confirms this and pins the throughput boundary rather than spending real budget there.

**Result (code):** 100 evaluations this round, 100 total; 37 feasible; hypervolume 8.416e+04 (n/a).

**LLM decision:** `refine` — Round 1 shows only pipelined_m can currently satisfy both constraints with low area: its sole Pareto point is pipelined_m[W=28,N=22,A=3,F=0,round,m=6] at luts_plus_ffs=2499, power_index=4.7, throughput=57.5 MSPS, max_abs_err=2^-20.85. The pipelined family is feasible but its best area is 4464, while iterative and unrolled_k cannot reach 50 MSPS (max seen 6.66 and 6.52 MSPS). The front point sits only 7.5 MSPS above the throughput floor and has ~0.85 bits of accuracy margin, so there is room to trade throughput/accuracy for lower area. Refine around this region rather than widening or adding families.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.416e+04 (gain this round: n/a (first round)).
Feasible designs: 37 of 100 evaluations (36 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 35% violate; best seen 257
- max_abs_err <= 9.53674e-07: 40% violate; best seen 2.3e-08 (2^-25.37)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=28 n_iter=22 angle_guard=3 frac_guard=0 rounding=round m=6] luts_plus_ffs=2499, power_index=4.7, luts=2063, ffs=436, throughput_msps=57.5, max_abs_err=5.3e-07 (2^-20.85)

Per family:
- iterative: 5 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 25.37 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 23.55 bits
- pipelined: 20 evals, 10 feasible; max throughput seen 257 MSPS; best accuracy 23.68 bits; best feasible luts_plus_ffs=4464; feasible ranges: data_width 25..28, n_iter 25..28, angle_guard 1..4, frac_guard 1..3
- pipelined_m: 50 evals, 27 feasible; max throughput seen 153 MSPS; best accuracy 24.28 bits; best feasible luts_plus_ffs=2499; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus 80% of the next 100 evaluations on pipelined_m around the known feasible region, with a 20% control group on pipelined. Keep rounding=round, which is expected to help accuracy. The ranges are narrowed from the observed feasible ranges to spend budget where the Pareto front is likely to improve.*)
- `pipelined_m` (80 evals): data_width=25..28, n_iter=24..30, angle_guard=0..4, frac_guard=0..3, rounding=round, m=4..8. *Why:* Only family with a feasible Pareto point; explore lower area by reducing W, increasing m, and using the accuracy margin.
- `pipelined` (20 evals): data_width=25..28, n_iter=25..30, angle_guard=1..4, frac_guard=1..3, rounding=round. *Why:* Control group: pipelined is feasible but currently higher area; check whether a different accuracy/throughput trade-off can beat pipelined_m.

**Result (code):** 100 evaluations this round, 200 total; 127 feasible; hypervolume 8.416e+04 (+0.0%).

**LLM decision:** `refine` — Only 1 feasible Pareto design exists and hypervolume did not move in round 2 (+0.0%). The registry is fully explored, so the choice is refine vs widen vs stop. Evidence points to refine: pipelined_m dominates area (luts_plus_ffs 2499 vs pipelined's 4464) and hit the constraint with slack (57.5 MSPS vs 50; 2^-20.85 vs 2^-20). Its feasible ranges show unexploited room (m up to 7, data_width down to 25), while n_iter at 22 is the lowest feasible value so far. iterative and unrolled_k are structurally infeasible on throughput (max ~6.6 MSPS, 0/30 feasible) and pipelined's extra area makes it unlikely to win the min-luts_plus_ffs selection. Therefore spend the next ~100 evals tightening around low data_width / high m in pipelined_m, with a small pipelined side-arm to test the higher-throughput trade.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.416e+04 (gain this round: +0.0%).
Feasible designs: 127 of 200 evaluations (114 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 20% violate; best seen 257
- max_abs_err <= 9.53674e-07: 22% violate; best seen 2.3e-08 (2^-25.37)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=28 n_iter=22 angle_guard=3 frac_guard=0 rounding=round m=6] luts_plus_ffs=2499, power_index=4.7, luts=2063, ffs=436, throughput_msps=57.5, max_abs_err=5.3e-07 (2^-20.85)

Per family:
- iterative: 5 evals, 0 feasible; max throughput seen 6.66 MSPS; best accuracy 25.37 bits
- unrolled_k: 25 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 23.55 bits
- pipelined: 40 evals, 30 feasible; max throughput seen 257 MSPS; best accuracy 23.89 bits; best feasible luts_plus_ffs=4464; feasible ranges: data_width 25..28, n_iter 25..29, angle_guard 1..4, frac_guard 1..3
- pipelined_m: 130 evals, 97 feasible; max throughput seen 153 MSPS; best accuracy 24.63 bits; best feasible luts_plus_ffs=2499; feasible ranges: data_width 25..28, n_iter 22..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 5344 in, 10677 out
- provider-reported cost: $0.0107
- full prompts and replies: `llm_trace.jsonl`

