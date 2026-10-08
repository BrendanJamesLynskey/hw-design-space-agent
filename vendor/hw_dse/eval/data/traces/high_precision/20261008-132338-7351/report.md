# DSE run: high_precision

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
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
`pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=2,rounding=round,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 2003 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 389 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 54.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 54.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 110 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.74e-07 (2^-20.30) | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 3.25 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 1.72e-07 (2^-22.47) | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 0.723 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=24,n_iter=23,angle_guard=2,frac_guard=2,rounding=round,m=7` | 2003 | 389 | 54.3 | 6 | 4.5 | 7.74e-07 (2^-20.30) | 20.30 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Round 1 uses 100 evaluations to establish feasibility and shape the Pareto front. The 2^-20 error target is tight, so data_width is focused near 22-24 and n_iter near 20-24, with modest angle/frac guards and both rounding modes to expose accuracy/area trade-offs. The throughput constraint favors one-result-per-cycle families; pipelined_m is the primary area/power trade-off via m, pipelined is the timing-margin fallback, and unrolled_k is kept only as a possible low-area multi-cycle candidate. iterative is omitted because its N+3 cycles/result schedule is unlikely to meet 50 MSPS for the N values needed by the accuracy constraint.*)
- `pipelined_m` (55 evals): data_width=22..24, n_iter=20..24, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* One result/cycle makes the 50 MSPS constraint depend mainly on Fmax, while m directly trades FFs/area against timing. This is the most likely place to find the minimum-area feasible point and the main area/power trade-off.
- `pipelined` (25 evals): data_width=22..24, n_iter=20..24, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Fully pipelined stages give the strongest timing margin if pipelined_m with larger m cannot reach 50 MSPS. It may be area-dominated, but it is needed to confirm feasibility and bound the front.
- `unrolled_k` (20 evals): data_width=22..24, n_iter=20..24, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=6..8. *Why:* A shared datapath may beat pipelined_m on area if its multi-cycle throughput still meets 50 MSPS. High k is needed to keep the result period short, so this is a smaller exploratory share.

**Result (code):** 100 evaluations this round, 100 total; 5 feasible; hypervolume 8.691e+04 (n/a).

**LLM decision:** `refine` — Only pipelined_m has found feasible points, and the sole Pareto point is very close to the accuracy limit (2^-20.30 vs 2^-20) while just meeting throughput (54.3 MSPS). The feasible evidence is concentrated at data_width=24, n_iter=23, angle_guard=2, frac_guard=2, rounding=round, m=5..7, with m=7 best on the current front. unrolled_k is not promising for this spec because its best observed throughput was only 6.74 MSPS, far below 50. iterative has not been explored, but it is 1 micro-rotation/cycle with N+3 latency, so with the accuracy-driven N region seen so far it is unlikely to be a throughput-competitive candidate; the higher-value use of the remaining budget is to refine the only feasible family and check whether lower-area/lower-power neighbors exist. Focus on reducing data_width, n_iter, guards, and increasing m toward 8, while keeping rounding=round and allowing n_iter=24 as a compensating case for lower width/guards.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.691e+04 (gain this round: n/a (first round)).
Feasible designs: 5 of 100 evaluations (2 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 21% violate; best seen 257
- max_abs_err <= 9.53674e-07: 95% violate; best seen 7.74e-07 (2^-20.30)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=round m=7] luts_plus_ffs=2393, power_index=4.5, luts=2003, ffs=389, throughput_msps=54.3, max_abs_err=7.74e-07 (2^-20.30)

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.74 MSPS; best accuracy 19.96 bits
- pipelined: 25 evals, 0 feasible; max throughput seen 257 MSPS; best accuracy 19.96 bits
- pipelined_m: 55 evals, 5 feasible; max throughput seen 164 MSPS; best accuracy 20.30 bits; best feasible luts_plus_ffs=2393; feasible ranges: data_width 24..24, n_iter 23..23, angle_guard 2..2, frac_guard 2..2, m 5..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine around the only feasible region rather than widening: 95% of round-1 evaluations violated accuracy, so the feasible region is narrow. The next round should test whether the current point can be improved on area/power by moving to W=23, N=22, lower guards, or m=8, while retaining enough accuracy margin.*)
- `pipelined_m` (90 evals): data_width=23..24, n_iter=22..24, angle_guard=0..2, frac_guard=0..2, rounding=round, m=7..8. *Why:* Search the immediate lower-area neighborhood of the only feasible Pareto point: W=23 may beat W=24 if accuracy still holds; N=22 may reduce area if feasible; angle_guard/frac_guard 0..1 may reduce area if accuracy still holds; m=8 may reduce area/power but must still meet throughput.
- `pipelined` (10 evals): data_width=24..24, n_iter=23..23, angle_guard=2..2, frac_guard=2..2, rounding=round. *Why:* Check whether the fully pipelined family can produce a feasible point with the same known-accurate settings; it has high observed throughput but is likely area/power dominated, so only a small allocation is justified.

**Result (code):** 100 evaluations this round, 200 total; 23 feasible; hypervolume 8.691e+04 (+0.0%).

**LLM decision:** `refine` — A feasible design exists, so this is not infeasible. The only non-dominated feasible point is pipelined_m [dw=24, N=23, ag=2, fg=2, m=7] with luts_plus_ffs=2393 and power_index=4.5, giving HV 8.691e4. Round 2 gave +0.0% HV, indicating the previous broader search stagnated. The feasible cluster is narrow: pipelined_m with data_width=24, n_iter=23..24, angle_guard=2, frac_guard=2, m=5..7; pipelined feasible points are dominated (best feasible luts_plus_ffs=3970), and unrolled_k has 0 feasible with max throughput 6.74 MSPS and best accuracy 19.96 bits. Iterative has no evidence of meeting 50 MSPS and would consume budget without a known throughput path. The most promising untested lever is m=8 in pipelined_m: it may reduce FFs/area while still meeting throughput_msps >= 50. Small adjacent variations in data_width, n_iter, and guards may also reveal lower-area feasible variants or confirm the accuracy boundary. With 200 evals remaining, focus the next 100 evals on this region rather than widening or adding families.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.691e+04 (gain this round: +0.0%).
Feasible designs: 23 of 200 evaluations (4 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 29% violate; best seen 257
- max_abs_err <= 9.53674e-07: 87% violate; best seen 7.24e-07 (2^-20.40)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=round m=7] luts_plus_ffs=2393, power_index=4.5, luts=2003, ffs=389, throughput_msps=54.3, max_abs_err=7.74e-07 (2^-20.30)

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 6.74 MSPS; best accuracy 19.96 bits
- pipelined: 35 evals, 10 feasible; max throughput seen 257 MSPS; best accuracy 20.30 bits; best feasible luts_plus_ffs=3970; feasible ranges: data_width 24..24, n_iter 23..23, angle_guard 2..2, frac_guard 2..2
- pipelined_m: 145 evals, 13 feasible; max throughput seen 164 MSPS; best accuracy 20.40 bits; best feasible luts_plus_ffs=2393; feasible ranges: data_width 24..24, n_iter 23..24, angle_guard 2..2, frac_guard 2..2, m 5..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 5535 in, 35054 out
- provider-reported cost: $0.0739
- full prompts and replies: `llm_trace.jsonl`

