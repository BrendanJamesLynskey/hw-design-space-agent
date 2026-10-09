# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=0,rounding=round,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1929 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 389 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.36 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 8.71e-07 (2^-20.13) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.31 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.04e-07 (2^-22.23) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.71 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.1 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=25,n_iter=23,angle_guard=2,frac_guard=0,rounding=round,m=7` | 1929 | 389 | 52.0 | 6 | 4.36 | 8.71e-07 (2^-20.13) | 20.13 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The 50 MSPS throughput constraint eliminates iterative (N+3 cycles per result) and makes unrolled_k marginal, so the first round concentrates on pipelined and pipelined_m, which produce 1 result/cycle. Accuracy <= 2^-20 requires high data_width and n_iter, so wide ranges are searched to locate the feasible boundary. pipelined_m gets the largest share because its m parameter directly trades register count (area/power) against combinational depth (Fmax), which is exactly the trade-off the spec rewards; pipelined anchors the high-Fmax corner; unrolled_k is probed with high k to confirm whether it can meet the throughput constraint at all.*)
- `pipelined_m` (50 evals): data_width=20..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Produces 1 result/cycle so it can meet 50 MSPS, and its m parameter directly trades register count (area/power) against combinational depth (Fmax). This is the most likely family to populate the area/power Pareto front, so it gets the largest share.
- `pipelined` (30 evals): data_width=20..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* 1 result/cycle guarantees the 50 MSPS constraint and gives the highest-Fmax corner of the front (one register per micro-rotation). Needed to anchor the high-throughput end of the trade-off curve.
- `unrolled_k` (20 evals): data_width=20..28, n_iter=18..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=6..8. *Why:* Only unrolled_k with large k has a chance of reaching 50 MSPS (ceil(N/k)+3 cycles), and if it does it may offer a lower-area point than pipelined. Probing k=6..8 confirms whether this family is feasible or should be dropped.

**Result (code):** 100 evaluations this round, 100 total; 22 feasible; hypervolume 7.427e+04 (n/a).

**LLM decision:** `map_front` — The feasible Pareto front contains only a single design (pipelined_m, luts_plus_ffs=2896, power_index=5.45), so hypervolume (7.427e+04) is far below what the reference point (8000, 20) allows. The pipelined_m family already shows wide feasible ranges (data_width 24..28, n_iter 25..30, angle_guard 0..3, frac_guard 2..4, m 3..7) with 17 feasible designs, yet only one is non-dominated — strong evidence that the front is under-sampled. The unexplored iterative family cannot meet the 50 MSPS throughput constraint because its throughput is Fmax/(N+3) and N must be large (≈26) for the required 2^-20 accuracy, making it infeasible. Therefore the best use of this round is to map the full pipelined_m front (and include pipelined as a secondary family) with NSGA-II seeded by the current front, covering the whole area–power trade-off curve before refining or stopping.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7.427e+04 (gain this round: n/a (first round)).
Feasible designs: 22 of 100 evaluations (17 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 28% violate; best seen 264
- max_abs_err <= 9.53674e-07: 73% violate; best seen 7.43e-08 (2^-23.68)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=26 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2896, power_index=5.45, luts=2244, ffs=652, throughput_msps=86, max_abs_err=9.12e-07 (2^-20.06)
Front coverage: luts_plus_ffs 2896..2896 (HV reference 8000); power_index 5.45..5.45 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.75 MSPS; best accuracy 19.99 bits
- pipelined: 30 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 22.18 bits; best feasible luts_plus_ffs=4005; feasible ranges: data_width 25..26, n_iter 22..27, angle_guard 3..3, frac_guard 0..3
- pipelined_m: 50 evals, 17 feasible; max throughput seen 158 MSPS; best accuracy 23.68 bits; best feasible luts_plus_ffs=2896; feasible ranges: data_width 24..28, n_iter 25..30, angle_guard 0..3, frac_guard 2..4, m 3..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=23..28, n_iter=24..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 200 total; 94 feasible; hypervolume 7.843e+04 (+5.6%).

**LLM decision:** `map_front` — The feasible Pareto front is a single point: pipelined_m [W=26 N=25 ag=3 fg=2 trunc m=7] at luts_plus_ffs=2726, power_index=5.13, even though 83 unique feasible designs exist (89 feasible pipelined_m evals). Coverage is therefore minimal on both objectives (2726..2726 vs HV ref 8000; 5.13..5.13 vs ref 20), so HV is being earned by one corner rather than the trade-off curve. The registry's other families cannot help: unrolled_k topped out at 5.75 MSPS and iterative (1 result per N+3 cycles) would need Fmax in the hundreds of MHz to GHz to reach 50 MSPS, so both are throughput-infeasible. The right move is to spend this round letting code map the whole front with NSGA-II over the full ranges of the families that actually appear on it (pipelined_m, plus pipelined which reached 264 MSPS and 4005 luts_plus_ffs), seeded with the current front, to spread coverage across the luts_plus_ffs/power trade-off before the final selection.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 7.843e+04 (gain this round: +5.6%).
Feasible designs: 94 of 200 evaluations (83 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 19% violate; best seen 264
- max_abs_err <= 9.53674e-07: 46% violate; best seen 4.04e-08 (2^-24.56)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=25 angle_guard=3 frac_guard=2 rounding=trunc m=7] luts_plus_ffs=2726, power_index=5.13, luts=2307, ffs=420, throughput_msps=52, max_abs_err=2.63e-07 (2^-21.86)
Front coverage: luts_plus_ffs 2726..2726 (HV reference 8000); power_index 5.13..5.13 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.75 MSPS; best accuracy 19.99 bits
- pipelined: 30 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 22.18 bits; best feasible luts_plus_ffs=4005; feasible ranges: data_width 25..26, n_iter 22..27, angle_guard 3..3, frac_guard 0..3
- pipelined_m: 150 evals, 89 feasible; max throughput seen 158 MSPS; best accuracy 24.56 bits; best feasible luts_plus_ffs=2726; feasible ranges: data_width 23..28, n_iter 24..30, angle_guard -1..4, frac_guard 0..4, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=25..28, n_iter=23..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 300 total; 174 feasible; hypervolume 8.666e+04 (+10.5%).

**LLM decision:** `map_front` — The feasible front is a single point (pipelined_m data_width=26 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=7, luts_plus_ffs=2403, power_index=4.52), so it covers only 2403..2403 of the 8000 area reference and 4.52..4.52 of the 20 power reference — hypervolume is far from saturated and the trade-off curve is essentially unmapped. pipelined_m is clearly the productive family (169/250 feasible, best accuracy 24.56 bits, best feasible area 2403) and pipelined also yields feasible points (best 4005), while unrolled_k is hopeless (0/20 feasible, max 5.75 MSPS). With 100 evals left in the final round, the best use is a code-driven NSGA-II coverage search over the full parameter ranges of the families on the front, seeded with the current front, to spread the front across the whole area/power trade-off before the selection rule picks min luts_plus_ffs.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 8.666e+04 (gain this round: +10.5%).
Feasible designs: 174 of 300 evaluations (144 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 16% violate; best seen 264
- max_abs_err <= 9.53674e-07: 35% violate; best seen 4.04e-08 (2^-24.56)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=7] luts_plus_ffs=2403, power_index=4.52, luts=1999, ffs=404, throughput_msps=52, max_abs_err=4.56e-07 (2^-21.06)
Front coverage: luts_plus_ffs 2403..2403 (HV reference 8000); power_index 4.52..4.52 (HV reference 20); data_width on the front 26..26 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.75 MSPS; best accuracy 19.99 bits
- pipelined: 30 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 22.18 bits; best feasible luts_plus_ffs=4005; feasible ranges: data_width 25..26, n_iter 22..27, angle_guard 3..3, frac_guard 0..3
- pipelined_m: 250 evals, 169 feasible; max throughput seen 158 MSPS; best accuracy 24.56 bits; best feasible luts_plus_ffs=2403; feasible ranges: data_width 23..28, n_iter 23..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined_m` (100 evals): data_width=25..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 400 total; 254 feasible; hypervolume 8.885e+04 (+2.5%).

**LLM decision:** `stop` — Final round: budget is fully spent (400/400 evals, round 4 of 4), so no further searching is possible. `infeasible` is ruled out by direct evidence: the front contains a feasible design — pipelined_m [W=25 n_iter=23 angle_guard=2 frac_guard=0 round m=7] with throughput 52 MSPS (>= 50) and max_abs_err 8.71e-07 (<= 9.53674e-07), at luts_plus_ffs=2319 / power_index=4.36. The registry can therefore meet the spec. The run has also converged: the feasible front collapsed to a single point (luts_plus_ffs 2319..2319, power_index 4.36..4.36), and the last round's hypervolume gain was only +2.5%. The binding tension is visible in the numbers: the accuracy constraint forces data_width>=25 (best feasible accuracy 2^-24.81 was seen, but the feasible front sits at 2^-20.13, only marginally inside the 2^-20 bound), which is why unrolled_k (0 feasible, max 5.75 MSPS) and most pipelined points fall outside throughput or accuracy; pipelined_m with larger m is the only shape that satisfies both within this area budget. The single front member already satisfies the selection rule (min luts_plus_ffs), so stopping leaves the best available answer.

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.885e+04 (gain this round: +2.5%).
Feasible designs: 254 of 400 evaluations (215 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 13% violate; best seen 264
- max_abs_err <= 9.53674e-07: 31% violate; best seen 3.4e-08 (2^-24.81)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=2 frac_guard=0 rounding=round m=7] luts_plus_ffs=2319, power_index=4.36, luts=1929, ffs=389, throughput_msps=52, max_abs_err=8.71e-07 (2^-20.13)
Front coverage: luts_plus_ffs 2319..2319 (HV reference 8000); power_index 4.36..4.36 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 20 evals, 0 feasible; max throughput seen 5.75 MSPS; best accuracy 19.99 bits
- pipelined: 30 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 22.18 bits; best feasible luts_plus_ffs=4005; feasible ranges: data_width 25..26, n_iter 22..27, angle_guard 3..3, frac_guard 0..3
- pipelined_m: 350 evals, 249 feasible; max throughput seen 158 MSPS; best accuracy 24.81 bits; best feasible luts_plus_ffs=2319; feasible ranges: data_width 23..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 12329 in, 9390 out
- provider-reported cost: $0.0090
- full prompts and replies: `llm_trace.jsonl`

