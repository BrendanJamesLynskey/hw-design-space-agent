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
`pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=1,rounding=trunc,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1976 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 395 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.46 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 8.19e-07 (2^-20.22) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 6.87 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 1.9e-07 (2^-22.33) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.59 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.2 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=1,rounding=trunc,m=6` | 1976 | 395 | 59.9 | 6 | 4.46 | 8.19e-07 (2^-20.22) | 20.22 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec demands max_abs_err <= 2^-20 and >=50 MSPS. Accuracy requires W >= 22 and N >= 20. Throughput rules out iterative (needs Fmax >= 50*(N+3) > 1 GHz) and unrolled_k with small k. Pipelined and pipelined_m give 1 result/cycle, so they only need Fmax >= 50 MHz. Unrolled_k with k=4..8 might meet throughput if Fmax is high enough and could reduce area by sharing the datapath. We allocate 50% to pipelined_m (best area/power trade-off via m), 20% to pipelined (m=1 baseline), and 30% to unrolled_k (alternative area-efficient if timing allows). Ranges cover the likely feasible region: W 22-28, N 18-30, guards -2..4, both rounding modes, m 2-8, k 4-8. First round uses 100 evals, allocated proportionally (50/20/30).*)
- `pipelined_m` (50 evals): data_width=22..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Most promising for minimising area: m>1 reduces FFs by registering every m stages while still achieving 1 result/cycle. m=2..8 explores the trade-off between Fmax (must stay >=50 MHz) and area/power.
- `pipelined` (20 evals): data_width=22..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Baseline 1 result/cycle with maximum Fmax; useful to compare area against pipelined_m and to ensure feasibility if m>1 fails timing.
- `unrolled_k` (30 evals): data_width=22..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=4..8. *Why:* High k (4..8) can meet >=50 MSPS if Fmax is high enough; shares datapath across cycles, potentially lower LUTs/FFs than fully pipelined. Explores an alternative area-efficient architecture.

**Result (code):** 100 evaluations this round, 100 total; 29 feasible; hypervolume 8.747e+04 (n/a).

**LLM decision:** `refine` — Density, not breadth, is the problem: the feasible front has exactly 1 design (pipelined_m W=25/N=23/ag=2/fg=1/m=6, luts_plus_ffs=2371, power_index=4.46, 59.9 MSPS, err 2^-20.22). unrolled_k reached only 7.79 MSPS max over 30 evals and best accuracy 22.18 bits, so it is throughput-limited and cannot help; iterative (1 micro-rotation/cycle, N+3 cycles/result) is strictly slower than unrolled_k and is therefore provably infeasible on the 50 MSPS constraint, so add_family would only burn budget. That leaves pipelined_m (23/50 feasible, area 2371) and pipelined (6/20 feasible, area 4061) as the only productive families, with pipelined_m dominating on the min-luts_plus_ffs selection rule. I therefore refine inside their observed feasible boxes to (a) test whether shaving data_width (23-24) with more n_iter beats 2371 area while keeping err <= 2^-20, and (b) populate the area vs power_index tradeoff (m 3..8, guards -1..3) so the HV at ref (8000,20) is covered by more than one point. Throughput margin (best seen 158-257 MSPS vs 50 required) means the search can safely trade Fmax/power for area near the 50 MSPS edge.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.747e+04 (gain this round: n/a (first round)).
Feasible designs: 29 of 100 evaluations (24 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 37% violate; best seen 257
- max_abs_err <= 9.53674e-07: 53% violate; best seen 4.86e-08 (2^-24.29)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2371, power_index=4.46, luts=1976, ffs=395, throughput_msps=59.9, max_abs_err=8.19e-07 (2^-20.22)

Per family:
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 22.18 bits
- pipelined: 20 evals, 6 feasible; max throughput seen 257 MSPS; best accuracy 24.29 bits; best feasible luts_plus_ffs=4061; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 50 evals, 23 feasible; max throughput seen 158 MSPS; best accuracy 23.97 bits; best feasible luts_plus_ffs=2371; feasible ranges: data_width 24..28, n_iter 23..30, angle_guard -1..3, frac_guard 0..3, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *only 1 non-dominated point exists, so the front needs density, not breadth*)
- `pipelined_m` (65 evals): data_width=23..27, n_iter=23..30, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* m-distance
- `pipelined` (35 evals): data_width=24..28, n_iter=24..30, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* m-distance

**Result (code):** 100 evaluations this round, 200 total; 100 feasible; hypervolume 8.747e+04 (+0.0%).

**LLM decision:** `refine` — Round 2 added no hypervolume (+0.0%) and the feasible front is a single point: pipelined_m [W=25, N=23, ag=2, fg=1, trunc, m=6] at luts_plus_ffs=2371, power_index=4.46, throughput=59.9 MSPS, max_abs_err=8.19e-07 (2^-20.22). That point sits right on the accuracy constraint (limit 2^-20 = 9.53674e-07), so there is accuracy headroom to trade for area/power, and the feasible ranges reported for pipelined_m (data_width 24..28, n_iter 23..30, angle_guard -1..3, frac_guard 0..3, m 2..7) show the current front uses the *low* end of data_width and n_iter — i.e. the promising region is under-sampled, not exhausted. HV is entirely determined by this one point (5629 x 15.54 = 8.75e4), so any feasible design with lower luts_plus_ffs or power_index directly raises HV. pipelined is dominated (best feasible area 4061 vs 2371), and iterative/unrolled_k cannot reach the 50 MSPS constraint (unrolled_k max throughput seen 7.79 MSPS; iterative is strictly slower at N+3 cycles/result), so adding families would waste budget. Refine around the low-area/low-power corner instead.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.747e+04 (gain this round: +0.0%).
Feasible designs: 100 of 200 evaluations (77 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 20% violate; best seen 257
- max_abs_err <= 9.53674e-07: 40% violate; best seen 4.86e-08 (2^-24.29)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2371, power_index=4.46, luts=1976, ffs=395, throughput_msps=59.9, max_abs_err=8.19e-07 (2^-20.22)

Per family:
- unrolled_k: 30 evals, 0 feasible; max throughput seen 7.79 MSPS; best accuracy 22.18 bits
- pipelined: 55 evals, 35 feasible; max throughput seen 257 MSPS; best accuracy 24.29 bits; best feasible luts_plus_ffs=4061; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard 0..3, frac_guard 0..3
- pipelined_m: 115 evals, 65 feasible; max throughput seen 158 MSPS; best accuracy 23.97 bits; best feasible luts_plus_ffs=2371; feasible ranges: data_width 24..28, n_iter 23..30, angle_guard -1..3, frac_guard 0..3, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 5283 in, 11806 out
- provider-reported cost: $0.0141
- full prompts and replies: `llm_trace.jsonl`

