# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
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
`pipelined_m:data_width=26,n_iter=22,angle_guard=3,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1930 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 408 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 6.69e-07 (2^-20.51) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 11.2 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.08e-07 (2^-22.19) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.5 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.5 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=3,frac_guard=0,rounding=round,m=6` | 1930 | 408 | 59.9 | 6 | 4.4 | 6.69e-07 (2^-20.51) | 20.51 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *An error of 2^-20 forces roughly W>=21-22 with enough iterations and guard bits, so the first round restricts accuracy-related parameters to that region. The 50 MSPS constraint probably rules out the iterative family, so I omit it and rely on the first round's results to confirm. The main budget goes to the one-result-per-cycle pipelined families, where area and power trade off against m, guard bits and rounding. A small share goes to high-k unrolled as a hedge.*)
- `pipelined_m` (51 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* It gives 1 result per cycle, so throughput only needs Fmax >= 50 MHz. Registering every m stages should cut FFs, which may help both area and power, so m is searched across its full range.
- `pipelined` (31 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..4, frac_guard=0..4, rounding=trunc|round. *Why:* It is the baseline fully pipelined design and the m=1 reference point. It is a plausible candidate for the front and calibrates how much pipelined_m's coarser registering saves.
- `unrolled_k` (18 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..4, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* A high k shortens the cycles per result, so it might reach 50 MSPS with less area than a full pipeline. The long combinational chain may limit Fmax, so it is a hedge with a modest budget and only high k.

**Result (code):** 100 evaluations this round, 100 total; 17 feasible; hypervolume 8.834e+04 (n/a).

**LLM decision:** `refine` — The front has a single design (pipelined_m, W=26, N=22, m=6; 2338 LUTs+FFs, power 4.4), so the next round should concentrate where feasible points exist. Only 17 of 100 evaluations were feasible. 77% violate the error limit and 19% violate throughput. Feasible points all have data_width 25..26 and n_iter 22..26, and come only from pipelined and pipelined_m. unrolled_k had 0 feasible, with max throughput 7.79 MSPS against the 50 MSPS requirement. Iterative produces one result every N+3 cycles, which is slower still, so I will not spend budget on it. I am narrowing to the pipelined families around the feasible region. I am keeping some slack on data_width, n_iter and the guard bits to look for cheaper designs just inside the 2^-20 error limit. pipelined_m gets most of the budget because it has the best area and the most feasible points. The m range stays broad because 4..7 were feasible and larger m might trade area for Fmax.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.834e+04 (gain this round: n/a (first round)).
Feasible designs: 17 of 100 evaluations (13 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 19% violate; best seen 257
- max_abs_err <= 9.53674e-07: 77% violate; best seen 1.65e-07 (2^-22.53)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=3 frac_guard=0 rounding=round m=6] luts_plus_ffs=2338, power_index=4.4, luts=1930, ffs=408, throughput_msps=59.9, max_abs_err=6.69e-07 (2^-20.51)
Front coverage: luts_plus_ffs 2338..2338 (HV reference 8000); power_index 4.4..4.4 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 18 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 21.21 bits
- pipelined: 31 evals, 5 feasible; max throughput seen 257 MSPS; best accuracy 22.53 bits; best feasible luts_plus_ffs=4580; feasible ranges: data_width 26..26, n_iter 24..24, angle_guard 2..4, frac_guard 3..4
- pipelined_m: 51 evals, 12 feasible; max throughput seen 153 MSPS; best accuracy 21.40 bits; best feasible luts_plus_ffs=2338; feasible ranges: data_width 25..26, n_iter 22..26, angle_guard 1..4, frac_guard 0..4, m 4..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate on the pipelined families that meet both constraints, with pipelined_m weighted higher, and explore the guard-bit, rounding and m trade-offs to lower area and power at the 2^-20 error limit.*)
- `pipelined_m` (75 evals): data_width=23..27, n_iter=20..26, angle_guard=0..4, frac_guard=0..3, rounding=round|trunc, m=3..8. *Why:* Best feasible area (2338) and most feasible points; the ranges bracket the feasible region of W 25..26, N 22..26, m 4..7 with some margin.
- `pipelined` (25 evals): data_width=24..27, n_iter=21..26, angle_guard=1..4, frac_guard=0..4, rounding=round|trunc. *Why:* Gives 257 MSPS and 5 feasible designs, but its best area (4580) is much worse than pipelined_m's. It is kept at low share for coverage of the front.

**Result (code):** 100 evaluations this round, 200 total; 84 feasible; hypervolume 8.834e+04 (+0.0%).

**LLM decision:** `refine` — The front is one design, pipelined_m (W=26, N=22, m=6) at 2338 LUTs+FFs and power 4.4, and the hypervolume gain this round was +0.0%. Throughput of 59.9 MSPS is close to the 50 MSPS limit. Iterative and unrolled_k cannot meet the constraints. Unrolled_k had 0 feasible designs out of 18 and a best throughput of 7.79 MSPS, and the iterative family needs N+3 cycles per result with N of at least about 20, so it would need an Fmax far above what the model shows. Pipelined_m has the lowest area (2338 versus 3840 for pipelined) and the most feasible designs (62 of 126). Feasible accuracy needs data_width 23..27 and n_iter 22..26. I will focus the budget on pipelined_m around that region. I will push m higher, since the best design uses m=6 and fewer registers should cut both area and power while Fmax stays above 50 MSPS. I will also try lower frac_guard and angle_guard, and keep a small share on pipelined as a check.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.834e+04 (gain this round: +0.0%).
Feasible designs: 84 of 200 evaluations (70 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 10% violate; best seen 257
- max_abs_err <= 9.53674e-07: 55% violate; best seen 7.62e-08 (2^-23.65)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=3 frac_guard=0 rounding=round m=6] luts_plus_ffs=2338, power_index=4.4, luts=1930, ffs=408, throughput_msps=59.9, max_abs_err=6.69e-07 (2^-20.51)
Front coverage: luts_plus_ffs 2338..2338 (HV reference 8000); power_index 4.4..4.4 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 18 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 21.21 bits
- pipelined: 56 evals, 22 feasible; max throughput seen 257 MSPS; best accuracy 22.58 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 24..27, n_iter 22..25, angle_guard 2..4, frac_guard 1..4
- pipelined_m: 126 evals, 62 feasible; max throughput seen 153 MSPS; best accuracy 23.65 bits; best feasible luts_plus_ffs=2338; feasible ranges: data_width 23..27, n_iter 22..26, angle_guard 1..4, frac_guard 0..4, m 3..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (200 evals): data_width=25..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 223 feasible; hypervolume 8.834e+04 (+0.0%).

**No LLM call** (code's front-mapping round): The front is one design, pipelined_m (W=26, N=22, m=6) at 2338 LUTs+FFs and power 4.4, and the hypervolume gain this round was +0.0%. Throughput of 59.9 MSPS is close to the 50 MSPS limit. Iterative and unrolled_k cannot meet the constraints. Unrolled_k had 0 feasible designs out of 18 and a best throughput of 7.79 MSPS, and the iterative family needs N+3 cycles per result with N of at least about 20, so it would need an Fmax far above what the model shows. Pipelined_m has the lowest area (2338 versus 3840 for pipelined) and the most feasible designs (62 of 126). Feasible accuracy needs data_width 23..27 and n_iter 22..26. I will focus the budget on pipelined_m around that region. I will push m higher, since the best design uses m=6 and fewer registers should cut both area and power while Fmax stays above 50 MSPS. I will also try lower frac_guard and angle_guard, and keep a small share on pipelined as a check.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.834e+04 (gain this round: +0.0%).
Feasible designs: 223 of 400 evaluations (194 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 12% violate; best seen 257
- max_abs_err <= 9.53674e-07: 38% violate; best seen 3.42e-08 (2^-24.80)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=3 frac_guard=0 rounding=round m=6] luts_plus_ffs=2338, power_index=4.4, luts=1930, ffs=408, throughput_msps=59.9, max_abs_err=6.69e-07 (2^-20.51)
Front coverage: luts_plus_ffs 2338..2338 (HV reference 8000); power_index 4.4..4.4 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 18 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 21.21 bits
- pipelined: 56 evals, 22 feasible; max throughput seen 257 MSPS; best accuracy 22.58 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 24..27, n_iter 22..25, angle_guard 2..4, frac_guard 1..4
- pipelined_m: 326 evals, 201 feasible; max throughput seen 153 MSPS; best accuracy 24.80 bits; best feasible luts_plus_ffs=2338; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 12364 in, 3979 out
- provider-reported cost: $0.0645
- full prompts and replies: `llm_trace.jsonl`

