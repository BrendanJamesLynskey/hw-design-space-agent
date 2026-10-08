# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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
`pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=0,rounding=round,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1929 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 389 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.36 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 8.71e-07 (2^-20.13) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.31 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.04e-07 (2^-22.23) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.71 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.1 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (2 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=0,rounding=round,m=6` | 1929 | 389 | 59.9 | 6 | 4.36 | 8.71e-07 (2^-20.13) | 20.13 |
| 1 | `pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=0,rounding=round,m=7` | 1929 | 389 | 52.0 | 6 | 4.36 | 8.71e-07 (2^-20.13) | 20.13 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *An error of at most 2^-20 needs an output LSB of about 2^-20 or finer, so data_width should be roughly 21-26 with n_iter around 20-26 and some guard bits. The range is kept slightly wider so the search can find the cheapest width, iteration count and guard combination that still passes. Throughput of at least 50 MSPS with N of about 22 or more rules out iterative: it takes N+3 cycles per result and would need a very high Fmax. unrolled_k is also unlikely to reach 50 MSPS, because chaining up to 8 stages should lower Fmax while still leaving several cycles per result. I will skip both for now and spend the budget on the two pipelined families. If pipelined_m turns out to be infeasible or dominated, later rounds can revisit this.*)
- `pipelined_m` (67 evals): data_width=20..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Registering every m stages should cut FFs and may lower power while still giving 1 result/cycle. If Fmax stays above 50 MHz, this is the most likely family to minimise area and power, so it gets the largest share.
- `pipelined` (33 evals): data_width=20..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* This is the guaranteed 1 result/cycle baseline and anchors the front at the pipelined end (m=1 equivalent). It shows what per-stage registering costs in area and power compared with pipelined_m.

**Result (code):** 100 evaluations this round, 100 total; 48 feasible; hypervolume 8.885e+04 (n/a).

**LLM decision:** `add_family` — Round 1 found one Pareto design (pipelined_m, W=25, N=23, m=6) at 2319 LUTs+FFs and power 4.36, so the constraints are reachable (48/100 feasible). The front is a single point, so the area/power trade-off is barely mapped. iterative and unrolled_k are unexplored and are the natural low-area candidates. Their throughput is Fmax/(N+3), so reaching 50 MSPS is doubtful at N~22 but unrolled_k with large k might get close. Spending part of the budget on them tests this cheaply. The rest goes to refining the pipelined_m region the feasible designs cluster in (W 24..26, N 21..24, angle_guard 1..3, frac_guard 0..2, large m). Accuracy needs about W>=24 and N>=21, so the search is narrowed there to avoid wasting evaluations on infeasible accuracy.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.885e+04 (gain this round: n/a (first round)).
Feasible designs: 48 of 100 evaluations (30 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 6% violate; best seen 264
- max_abs_err <= 9.53674e-07: 51% violate; best seen 3.21e-07 (2^-21.57)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=2319, power_index=4.36, luts=1929, ffs=389, throughput_msps=59.9, max_abs_err=8.71e-07 (2^-20.13)

Per family:
- pipelined: 33 evals, 16 feasible; max throughput seen 264 MSPS; best accuracy 21.57 bits; best feasible luts_plus_ffs=3921; feasible ranges: data_width 25..26, n_iter 22..26, angle_guard 1..3, frac_guard 1..4
- pipelined_m: 67 evals, 32 feasible; max throughput seen 158 MSPS; best accuracy 21.41 bits; best feasible luts_plus_ffs=2319; feasible ranges: data_width 25..26, n_iter 22..24, angle_guard 2..3, frac_guard 0..4, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Probe the unexplored shared-datapath families while concentrating most of the budget on the accuracy-feasible region (W 24..26, N 21..24, round) where pipelined_m already found a feasible front point.*)
- `pipelined_m` (45 evals): data_width=24..26, n_iter=21..24, angle_guard=1..3, frac_guard=0..2, rounding=round, m=4..8. *Why:* Holds the only front point. Narrowing around it with larger m and small frac_guard should cut registers (FFs) and power while keeping error <= 2^-20.
- `unrolled_k` (33 evals): data_width=24..26, n_iter=21..24, angle_guard=1..3, frac_guard=0..2, rounding=round, k=4..8. *Why:* Shared datapath with large k gives fewer cycles per result, so it may reach 50 MSPS at much lower area than a full pipeline. Untested.
- `iterative` (11 evals): data_width=24..26, n_iter=21..24, angle_guard=1..3, frac_guard=0..2, rounding=round. *Why:* Smallest area, but N+3 cycles/result probably misses 50 MSPS. A small probe confirms whether it is feasible.
- `pipelined` (11 evals): data_width=24..26, n_iter=21..24, angle_guard=1..3, frac_guard=0..2, rounding=round. *Why:* Best feasible area was 3921, well above pipelined_m, so only a small share is kept to maintain coverage.

**Result (code):** 100 evaluations this round, 200 total; 83 feasible; hypervolume 8.885e+04 (+0.0%).

**LLM decision:** `stop` — The hypervolume gain this round was +0.0%, below the 0.01 eps, so the front has converged. The best feasible point, pipelined_m with data_width=25, n_iter=23, angle_guard=2, frac_guard=0, rounding=round and m=6 or 7, has luts_plus_ffs=2319 and power_index=4.36. Its error of 8.71e-07 (2^-20.13) just meets the 2^-20 limit, and its throughput of 52-59.9 MSPS meets the 50 MSPS floor. The m=7 variant already sits close to the throughput limit at 52 MSPS, and m=8 would likely fall below it. Iterative and unrolled_k are ruled out because their best throughput is about 6.5 MSPS, far under 50. Plain pipelined is feasible but its best area is 3840, worse than pipelined_m. The feasible ranges are already tightly clustered (data_width 24..26, n_iter 22..24), so more evaluations are unlikely to move the front, and I would keep the 2319 design.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.885e+04 (gain this round: +0.0%).
Feasible designs: 83 of 200 evaluations (58 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 26% violate; best seen 264
- max_abs_err <= 9.53674e-07: 46% violate; best seen 2.33e-07 (2^-22.04)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=6] luts_plus_ffs=2319, power_index=4.36, luts=1929, ffs=389, throughput_msps=59.9, max_abs_err=8.71e-07 (2^-20.13)
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=7] luts_plus_ffs=2319, power_index=4.36, luts=1929, ffs=389, throughput_msps=52, max_abs_err=8.71e-07 (2^-20.13)

Per family:
- iterative: 11 evals, 0 feasible; max throughput seen 6.39 MSPS; best accuracy 21.16 bits
- unrolled_k: 33 evals, 0 feasible; max throughput seen 6.52 MSPS; best accuracy 22.04 bits
- pipelined: 44 evals, 20 feasible; max throughput seen 264 MSPS; best accuracy 21.57 bits; best feasible luts_plus_ffs=3840; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 1..3, frac_guard 1..4
- pipelined_m: 112 evals, 63 feasible; max throughput seen 158 MSPS; best accuracy 22.04 bits; best feasible luts_plus_ffs=2319; feasible ranges: data_width 24..26, n_iter 22..24, angle_guard 1..3, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 11769 in, 3210 out
- provider-reported cost: $0.0556
- full prompts and replies: `llm_trace.jsonl`

