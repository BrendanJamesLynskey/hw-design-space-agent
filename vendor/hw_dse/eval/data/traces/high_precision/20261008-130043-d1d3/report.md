# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
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
`pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1930 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 406 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.39 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.83e-07 (2^-20.28) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 13.1 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.13e-07 (2^-22.17) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 3.57 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=22,angle_guard=1,frac_guard=1,rounding=trunc,m=7` | 1930 | 406 | 52.0 | 6 | 4.39 | 7.83e-07 (2^-20.28) | 20.28 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Max error 2^-20 forces output LSB 2^-(W-2) to be at most about 2^-20, so W of roughly 21-26 with N of roughly 18-26 and some guard bits. Iterative and unrolled_k deliver one result per N/k+3 cycles, so at about 20+ iterations they are very unlikely to reach 50 MSPS and are excluded. Search effort goes to the two pipelined families, with most of the budget on pipelined_m because fewer registers should reduce both area and power. Later rounds will narrow W, N and guard bits to the minimum that still meets the accuracy constraint.*)
- `pipelined_m` (67 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Gives 1 result/cycle, so 50 MSPS only needs Fmax >= 50 MHz. Registering every m stages cuts FFs and likely power, which suits an area/power minimisation; a wide m range finds where Fmax stays above 50 MHz.
- `pipelined` (33 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* Fully pipelined (m=1) baseline that surely meets throughput. It acts as a reference for the pipelined_m trade-off and covers the high-Fmax end of the front.

**Result (code):** 100 evaluations this round, 100 total; 31 feasible; hypervolume 8.64e+04 (n/a).

**LLM decision:** `add_family` — The spec is feasible: 31 of 100 evaluations pass, but the front is a single point (pipelined_m, 2413 LUTs+FFs, power 4.54). The throughput floor is only 50 MSPS. That point already reaches 59.9 MSPS, so a multi-cycle design could also qualify and use less area. unrolled_k with large k and N≈22 needs ceil(22/k)+3 cycles per result, which may reach 50 MSPS if Fmax is high enough. Iterative needs N+3 cycles per result and likely misses 50 MSPS, but a small share of budget will test it. Accuracy needs about 20.0 bits; the feasible region sits at data_width 25..26, n_iter 22..26, so I keep those ranges and widen frac_guard and angle_guard slightly. Pipelined_m is kept at a reduced budget with a larger m, since area falls as m rises while the 50 MSPS floor still holds.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.64e+04 (gain this round: n/a (first round)).
Feasible designs: 31 of 100 evaluations (25 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 14% violate; best seen 264
- max_abs_err <= 9.53674e-07: 66% violate; best seen 2.27e-07 (2^-22.07)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=2 frac_guard=2 rounding=trunc m=6] luts_plus_ffs=2413, power_index=4.54, luts=1997, ffs=416, throughput_msps=59.9, max_abs_err=6.65e-07 (2^-20.52)

Per family:
- pipelined: 33 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 21.68 bits; best feasible luts_plus_ffs=4342; feasible ranges: data_width 24..26, n_iter 24..26, angle_guard 0..3, frac_guard 1..3
- pipelined_m: 67 evals, 26 feasible; max throughput seen 158 MSPS; best accuracy 22.07 bits; best feasible luts_plus_ffs=2413; feasible ranges: data_width 25..26, n_iter 22..26, angle_guard -1..3, frac_guard 1..4, m 3..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Explore the unexplored multi-cycle families while keeping pipelined_m focused on the feasible region. Drop plain pipelined, whose best area of 4342 is well above pipelined_m's 2413.*)
- `unrolled_k` (51 evals): data_width=22..26, n_iter=20..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* Not yet explored. High k cuts cycles per result toward the 50 MSPS floor with a single shared datapath, which could beat the pipelined area.
- `iterative` (12 evals): data_width=22..26, n_iter=20..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* Smallest area, but N+3 cycles per result probably cannot reach 50 MSPS. A small probe confirms or rules it out.
- `pipelined_m` (37 evals): data_width=22..26, n_iter=20..25, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* Holds the current best front point. Feasible m ranged 3..7, so searching larger m with slightly lower precision may cut area further.

**Result (code):** 100 evaluations this round, 200 total; 51 feasible; hypervolume 8.737e+04 (+1.1%).

**LLM decision:** `refine` — Only pipelined_m has a feasible front, with 46 feasible of 104 evals. It has a single Pareto point at luts_plus_ffs=2375, power 4.47. Iterative and unrolled_k are infeasible: they reach at most 6.55 MSPS against the 50 MSPS requirement, so they get no more budget. Pipelined is feasible but its best area of 4342 is far above 2375. Feasible designs sit in data_width 24..26 and n_iter 22..26. The best design has err 9.02e-07, close to the 9.54e-07 limit, so the error floor is near. Hypervolume gain is only +1.1%. The next round should concentrate on pipelined_m with narrow ranges, small frac_guard, trunc/round, and m 3..8 to cut registers and area, with a small pipelined share as a hedge.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.737e+04 (gain this round: +1.1%).
Feasible designs: 51 of 200 evaluations (37 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 42% violate; best seen 264
- max_abs_err <= 9.53674e-07: 58% violate; best seen 1.92e-07 (2^-22.31)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=1 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=2375, power_index=4.47, luts=1976, ffs=400, throughput_msps=52, max_abs_err=9.02e-07 (2^-20.08)

Per family:
- iterative: 12 evals, 0 feasible; max throughput seen 6.39 MSPS; best accuracy 21.46 bits
- unrolled_k: 51 evals, 0 feasible; max throughput seen 6.55 MSPS; best accuracy 22.28 bits
- pipelined: 33 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 21.68 bits; best feasible luts_plus_ffs=4342; feasible ranges: data_width 24..26, n_iter 24..26, angle_guard 0..3, frac_guard 1..3
- pipelined_m: 104 evals, 46 feasible; max throughput seen 158 MSPS; best accuracy 22.31 bits; best feasible luts_plus_ffs=2375; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard -1..3, frac_guard 0..4, m 3..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Concentrate the budget on the narrowed pipelined_m region near the accuracy boundary to find lower area and power points, and drop the families that cannot reach 50 MSPS.*)
- `pipelined_m` (80 evals): data_width=23..26, n_iter=20..25, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=3..8. *Why:* This is the only family with feasible designs and the best front. Fewer fractional guard bits and a larger m should reduce area and power while keeping error under 2^-20 and throughput above 50 MSPS.
- `pipelined` (20 evals): data_width=24..26, n_iter=22..25, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* A small hedge. Fully pipelined stages give high Fmax, but the best feasible area so far (4342) is well above pipelined_m.

**Result (code):** 100 evaluations this round, 300 total; 94 feasible; hypervolume 8.839e+04 (+1.2%).

**LLM decision:** `refine` — The front is a single design (pipelined_m, W=26, N=22, m=7, 2336 LUTs+FFs, power 4.39) and hypervolume is still gaining (+1.2%), so the search has not converged. Iterative and unrolled_k have 0 feasible designs out of 63 evals, with max throughput of only 6.55 MSPS against the 50 MSPS floor, so they should be dropped. Pipelined's best feasible area is 4111, well above pipelined_m's 2336, so it gets little budget. All feasible designs sit at data_width 24..26 and n_iter 22..26, and the accuracy limit of 2^-20 needs about 20 bits. Round 4 should concentrate on pipelined_m with a narrow range: data_width 22..26, n_iter 20..24, angle_guard -1..2, frac_guard 0..2, and m 5..8. A larger m means fewer registers and less area, but Fmax must stay at or above 50 MSPS (52 MSPS at m=7 is close to the limit). Both rounding modes stay open.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 8.839e+04 (gain this round: +1.2%).
Feasible designs: 94 of 300 evaluations (70 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 29% violate; best seen 264
- max_abs_err <= 9.53674e-07: 57% violate; best seen 1.92e-07 (2^-22.31)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2336, power_index=4.39, luts=1930, ffs=406, throughput_msps=52, max_abs_err=7.83e-07 (2^-20.28)

Per family:
- iterative: 12 evals, 0 feasible; max throughput seen 6.39 MSPS; best accuracy 21.46 bits
- unrolled_k: 51 evals, 0 feasible; max throughput seen 6.55 MSPS; best accuracy 22.28 bits
- pipelined: 53 evals, 11 feasible; max throughput seen 264 MSPS; best accuracy 21.68 bits; best feasible luts_plus_ffs=4111; feasible ranges: data_width 24..26, n_iter 23..26, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 184 evals, 83 feasible; max throughput seen 158 MSPS; best accuracy 22.31 bits; best feasible luts_plus_ffs=2336; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard -1..3, frac_guard 0..4, m 3..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *Concentrate the last 100 evals on the area-minimal corner of pipelined_m, with large m and minimal width, and drop the families that cannot reach 50 MSPS.*)
- `pipelined_m` (90 evals): data_width=22..26, n_iter=20..24, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=5..8. *Why:* All 83 feasible designs and the single front point come from this family. Larger m cuts registers and area, and the focus is on the data_width and n_iter edge where accuracy just meets 2^-20.
- `pipelined` (10 evals): data_width=23..26, n_iter=21..25, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* A small probe to confirm that fully pipelined designs (best 4111) cannot beat pipelined_m on area, using only the feasible region seen so far.

**Result (code):** 100 evaluations this round, 400 total; 120 feasible; hypervolume 8.839e+04 (+0.0%).

**LLM decision:** `stop` — The evaluation budget is exhausted (400 of 400 evals, round 4 of 4), and the last round gained +0.0% hypervolume, so the front has stopped improving. The constraints are reachable: 120 designs are feasible, and pipelined_m gives a feasible point with luts_plus_ffs=2336, power_index=4.39, 52 MSPS and max_abs_err 7.83e-07, which is inside the 9.54e-07 limit. iterative and unrolled_k never exceeded 6.55 MSPS, so they cannot meet the 50 MSPS requirement. Declaring infeasible would be wrong, and no further rounds are available. The design is selected by min luts_plus_ffs, which picks the single front point.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.839e+04 (gain this round: +0.0%).
Feasible designs: 120 of 400 evaluations (88 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 28% violate; best seen 264
- max_abs_err <= 9.53674e-07: 60% violate; best seen 1.92e-07 (2^-22.31)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=22 angle_guard=1 frac_guard=1 rounding=trunc m=7] luts_plus_ffs=2336, power_index=4.39, luts=1930, ffs=406, throughput_msps=52, max_abs_err=7.83e-07 (2^-20.28)

Per family:
- iterative: 12 evals, 0 feasible; max throughput seen 6.39 MSPS; best accuracy 21.46 bits
- unrolled_k: 51 evals, 0 feasible; max throughput seen 6.55 MSPS; best accuracy 22.28 bits
- pipelined: 63 evals, 13 feasible; max throughput seen 264 MSPS; best accuracy 21.68 bits; best feasible luts_plus_ffs=3839; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 274 evals, 107 feasible; max throughput seen 158 MSPS; best accuracy 22.31 bits; best feasible luts_plus_ffs=2336; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard -1..3, frac_guard 0..4, m 3..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 20369 in, 4286 out
- provider-reported cost: $0.0836
- full prompts and replies: `llm_trace.jsonl`

