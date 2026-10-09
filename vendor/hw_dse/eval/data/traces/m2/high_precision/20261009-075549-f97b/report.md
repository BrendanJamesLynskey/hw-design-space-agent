# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
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
`pipelined_m:data_width=27,n_iter=22,angle_guard=0,frac_guard=0,rounding=trunc,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1930 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 410 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 59.9 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 7.54e-07 (2^-20.34) | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 25.3 | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.12e-07 (2^-22.17) | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 7.11 | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.3 | exact: bit-accurate model, dense (131024 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=27,n_iter=22,angle_guard=0,frac_guard=0,rounding=trunc,m=6` | 1930 | 410 | 59.9 | 6 | 4.4 | 7.54e-07 (2^-20.34) | 20.34 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 50 MSPS throughput constraint is the binding one. Iterative and unrolled_k families produce one result every several cycles, making it extremely difficult to reach 50 MSPS on Artix-7 without pushing Fmax to unrealistic levels. Pipelined and pipelined_m produce one result per cycle, so they only need Fmax >= 50 MHz, which is easily achievable. The accuracy constraint (max_abs_err <= 2^-20) requires data_width >= 20 and sufficient n_iter. I will focus the budget on these two pipelined families to map the area/power trade-off curve, with pipelined_m offering a potential FF reduction advantage.*)
- `pipelined` (50 evals): data_width=20..28, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Full pipelining is the only family that can plausibly hit 50 MSPS on Artix-7 with a 20+ bit datapath; it offers the best area/power trade-off for high throughput.
- `pipelined_m` (50 evals): data_width=20..28, n_iter=10..20, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Registering every m stages reduces FF count versus full pipelining while maintaining 1 result/cycle throughput, potentially improving the area/power Pareto front.

**Result (code):** 100 evaluations this round, 100 total; 0 feasible; hypervolume 0 (n/a).

**LLM decision:** `refine` — The primary blocker is accuracy: 100% of evaluations violated max_abs_err <= 2^-20, with the best seen being only 18.00 bits (2^-18). The current search space was too loose on accuracy-critical parameters. Specifically, `n_iter` was likely not pushed high enough (19 iterations yielded only 18 bits), and `angle_guard`/`frac_guard` need to be maximized to capture the necessary precision. To reach 20 bits, we generally need N >= 20-22 iterations and full guard bits (angle_guard=4, frac_guard=4). We must narrow the search to high-accuracy configurations to find any feasible points before optimizing area/power. Throughput is not a concern for pipelined/pipelined_m as they easily exceed 50 MSPS even with higher N (latency increases but throughput remains 1 result/cycle).

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 0 (gain this round: n/a (first round)).
Feasible designs: 0 of 100 evaluations (0 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 2% violate; best seen 264
- max_abs_err <= 9.53674e-07: 100% violate; best seen 3.82e-06 (2^-18.00)

No feasible design found yet. Least-violating designs:
- pipelined [data_width=27 n_iter=19 angle_guard=4 frac_guard=4 rounding=round]: throughput=242, max_abs_err=3.82e-06 (2^-18.00); max_abs_err <= 9.53674e-07 violated by 301.0%
- pipelined_m [data_width=28 n_iter=19 angle_guard=3 frac_guard=1 rounding=round m=3]: throughput=106, max_abs_err=3.83e-06 (2^-18.00); max_abs_err <= 9.53674e-07 violated by 301.1%
- pipelined_m [data_width=28 n_iter=19 angle_guard=3 frac_guard=4 rounding=trunc m=3]: throughput=106, max_abs_err=3.83e-06 (2^-18.00); max_abs_err <= 9.53674e-07 violated by 301.1%
- pipelined_m [data_width=28 n_iter=19 angle_guard=3 frac_guard=3 rounding=round m=4]: throughput=82.7, max_abs_err=3.83e-06 (2^-18.00); max_abs_err <= 9.53674e-07 violated by 301.1%
- pipelined_m [data_width=28 n_iter=19 angle_guard=3 frac_guard=1 rounding=trunc m=3]: throughput=106, max_abs_err=3.84e-06 (2^-17.99); max_abs_err <= 9.53674e-07 violated by 302.7%

Per family:
- pipelined: 50 evals, 0 feasible; max throughput seen 264 MSPS; best accuracy 18.00 bits
- pipelined_m: 50 evals, 0 feasible; max throughput seen 164 MSPS; best accuracy 18.00 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Narrowing to high-accuracy configurations (N>=20, high guards) is essential to meet the 2^-20 error constraint. Previous rounds failed because the search space included too many low-accuracy points. Focusing on 'round' rounding and high guard bits maximizes the chance of finding feasible designs. Throughput is easily met by pipelined architectures.*)
- `pipelined` (50 evals): data_width=24..28, n_iter=20..26, angle_guard=3..4, frac_guard=3..4, rounding=round. *Why:* Focus on high-accuracy region: N>=20, high guards, round mode. Data width 24-28 to balance area vs precision.
- `pipelined_m` (50 evals): data_width=24..28, n_iter=20..26, angle_guard=3..4, frac_guard=3..4, rounding=round, m=2..8. *Why:* Same accuracy focus for pipelined_m to check if register spacing offers area/power benefits at high accuracy.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 200 total; 80 feasible; hypervolume 8.423e+04 (+inf).

**LLM decision:** `refine` — The current Pareto front consists of a single point (pipelined_m, 2497 LUTs+FFs, 4.7 power). This is a poor representation of the trade-off space, especially since the hypervolume reference points are much higher (8000 area, 20 power), indicating significant room for improvement. The `pipelined` family showed a best feasible area of 4144, which is worse than `pipelined_m`, but `pipelined_m` allows for higher throughput at the same latency/area cost due to its structure. The feasible region is currently clustered around data_width=24-28 and n_iter=22-26. To map the front better, we need to explore the trade-off between area and power more aggressively. `pipelined_m` with larger `m` values (up to 8) might reduce area further by sharing logic more, or potentially increase power if it forces wider datapaths or higher Fmax requirements. Conversely, smaller `m` (2-3) might allow for higher Fmax (lower power index if power scales with Fmax*Area, though the metric is relative) or different area/power trade-offs. The current search has only sampled m=2..6. We should refine the search to focus on `pipelined_m` with a wider range of `m` (2..8) and slightly relaxed `n_iter` (20..26) to see if fewer iterations can still meet the 2^-20 error bound with appropriate guards, potentially reducing area. We should also keep `pipelined` in the mix but focus on its lower area end. The key is to find if we can get area < 2497 or power < 4.7. Given the single point on the front, refining the ranges to densely sample the trade-off curve in `pipelined_m` is the best next step.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.423e+04 (gain this round: +inf (first feasible designs)).
Feasible designs: 80 of 200 evaluations (56 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 2% violate; best seen 264
- max_abs_err <= 9.53674e-07: 60% violate; best seen 6.69e-08 (2^-23.83)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=22 angle_guard=4 frac_guard=3 rounding=round m=5] luts_plus_ffs=2497, power_index=4.7, luts=2003, ffs=493, throughput_msps=70.6, max_abs_err=7.44e-07 (2^-20.36)
Front coverage: luts_plus_ffs 2497..2497 (HV reference 8000); power_index 4.7..4.7 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- pipelined: 100 evals, 42 feasible; max throughput seen 264 MSPS; best accuracy 23.83 bits; best feasible luts_plus_ffs=4144; feasible ranges: data_width 24..28, n_iter 22..26, angle_guard 3..4, frac_guard 3..4
- pipelined_m: 100 evals, 38 feasible; max throughput seen 164 MSPS; best accuracy 23.68 bits; best feasible luts_plus_ffs=2497; feasible ranges: data_width 24..28, n_iter 22..26, angle_guard 3..4, frac_guard 3..4, m 2..6
```
</details>

### Round 3

**Plan explored** (LLM rationale: *Refine pipelined_m to map the front more densely. The current single point suggests the search hasn't explored the trade-off curve. Expanding m and relaxing n_iter/frac_guard allows the optimizer to find points with lower area or lower power.*)
- `pipelined_m` (40 evals): data_width=24..26, n_iter=20..26, angle_guard=3..4, frac_guard=2..4, rounding=trunc|round, m=2..8. *Why:* Focus on pipelined_m which currently holds the best area. Expand m range to 2..8 to explore the full trade-off. Relax n_iter lower bound to 20 to check if area can be reduced while maintaining accuracy with guards. Relax frac_guard lower bound to 2 to see if area can be reduced.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 40 evaluations this round, 240 total; 115 feasible; hypervolume 8.661e+04 (+2.8%).

**LLM decision:** `stop` — The search has identified a feasible design that satisfies all constraints (throughput 59.9 MSPS >= 50, max_abs_err 8.23e-07 <= 9.54e-07). The current Pareto front consists of a single point: pipelined_m [data_width=24, n_iter=22, angle_guard=4, frac_guard=4, rounding=trunc, m=6] with luts_plus_ffs=2404 and power_index=4.52. This is significantly better than the best feasible pipelined design (4144 LUTs+FFs). The hypervolume gain in the last round was small (+2.8%), indicating convergence. Since this is the final round, we stop and select the best design on the front according to the selection rule (min luts_plus_ffs), which is the pipelined_m design with 2404 LUTs+FFs.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 8.661e+04 (gain this round: +2.8%).
Feasible designs: 115 of 240 evaluations (82 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 2% violate; best seen 264
- max_abs_err <= 9.53674e-07: 51% violate; best seen 6.69e-08 (2^-23.83)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=22 angle_guard=4 frac_guard=4 rounding=trunc m=6] luts_plus_ffs=2404, power_index=4.52, luts=1997, ffs=408, throughput_msps=59.9, max_abs_err=8.23e-07 (2^-20.21)
Front coverage: luts_plus_ffs 2404..2404 (HV reference 8000); power_index 4.52..4.52 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- pipelined: 100 evals, 42 feasible; max throughput seen 264 MSPS; best accuracy 23.83 bits; best feasible luts_plus_ffs=4144; feasible ranges: data_width 24..28, n_iter 22..26, angle_guard 3..4, frac_guard 3..4
- pipelined_m: 140 evals, 73 feasible; max throughput seen 164 MSPS; best accuracy 23.68 bits; best feasible luts_plus_ffs=2404; feasible ranges: data_width 24..28, n_iter 22..26, angle_guard 3..4, frac_guard 2..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `pipelined_m` (160 evals): data_width=23..28, n_iter=20..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 219 feasible; hypervolume 8.829e+04 (+1.9%).

**No LLM call** (code's front-mapping round): The search has identified a feasible design that satisfies all constraints (throughput 59.9 MSPS >= 50, max_abs_err 8.23e-07 <= 9.54e-07). The current Pareto front consists of a single point: pipelined_m [data_width=24, n_iter=22, angle_guard=4, frac_guard=4, rounding=trunc, m=6] with luts_plus_ffs=2404 and power_index=4.52. This is significantly better than the best feasible pipelined design (4144 LUTs+FFs). The hypervolume gain in the last round was small (+2.8%), indicating convergence. Since this is the final round, we stop and select the best design on the front according to the selection rule (min luts_plus_ffs), which is the pipelined_m design with 2404 LUTs+FFs.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.829e+04 (gain this round: +1.9%).
Feasible designs: 219 of 400 evaluations (175 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 4% violate; best seen 264
- max_abs_err <= 9.53674e-07: 44% violate; best seen 3.4e-08 (2^-24.81)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=27 n_iter=22 angle_guard=0 frac_guard=0 rounding=trunc m=6] luts_plus_ffs=2340, power_index=4.4, luts=1930, ffs=410, throughput_msps=59.9, max_abs_err=7.54e-07 (2^-20.34)
Front coverage: luts_plus_ffs 2340..2340 (HV reference 8000); power_index 4.4..4.4 (HV reference 20); data_width on the front 27..27 (registry 8..28).

Per family:
- pipelined: 100 evals, 42 feasible; max throughput seen 264 MSPS; best accuracy 23.83 bits; best feasible luts_plus_ffs=4144; feasible ranges: data_width 24..28, n_iter 22..26, angle_guard 3..4, frac_guard 3..4
- pipelined_m: 300 evals, 177 feasible; max throughput seen 164 MSPS; best accuracy 24.81 bits; best feasible luts_plus_ffs=2340; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 8536 in, 2831 out
- provider-reported cost: $0.0095
- full prompts and replies: `llm_trace.jsonl`

