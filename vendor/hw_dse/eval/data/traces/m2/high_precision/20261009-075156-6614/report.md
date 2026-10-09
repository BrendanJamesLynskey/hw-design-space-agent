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
`pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=trunc,m=6` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1953 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 391 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 62.5 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 96 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.41 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.48e-07 (2^-20.01) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.95 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.1e-07 (2^-22.18) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.76 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=25,n_iter=23,angle_guard=1,frac_guard=1,rounding=trunc,m=6` | 1953 | 391 | 62.5 | 6 | 4.41 | 9.48e-07 (2^-20.01) | 20.01 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *2^-20 max error needs output LSB about 2^-20 or finer with rounding, so data_width is at least 21 and likely 22 or more, and n_iter about 20 or more. Iterative needs about N+3 cycles per result, so 50 MSPS would need a clock above 1 GHz, and I exclude it. The pipelined families meet throughput easily, so most of the budget goes to pipelined_m, which can trade registers for area and power. The pipelined baseline gets a smaller share. The unrolled_k probe gets the smallest share and tests the high-k corner.*)
- `pipelined_m` (58 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* Delivers 1 result/cycle, so 50 MSPS only needs a 50 MHz clock. Registering every m stages cuts FFs and probably power, which suits the area and power objectives.
- `pipelined` (28 evals): data_width=21..26, n_iter=18..26, angle_guard=-1..3, frac_guard=0..4, rounding=trunc|round. *Why:* Fully pipelined baseline, which is the m=1 end of the pipelining trade-off. It anchors the front and shows whether per-stage registers are worth their area.
- `unrolled_k` (14 evals): data_width=21..25, n_iter=18..24, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round, k=6..8. *Why:* Small probe. With about 24 iterations, 50 MSPS needs high k so that ceil(N/k)+3 cycles stays short and the Fmax requirement stays low. If chained-stage timing rules this out, it can be dropped next round.

**Result (code):** 100 evaluations this round, 100 total; 38 feasible; hypervolume 8.818e+04 (n/a).

**LLM decision:** `refine` — The front has one design, pipelined_m at 2344 LUTs+FFs and power 4.41, with max error 9.48e-07, right at the 9.54e-07 limit. pipelined_m is the best family: 27 of 58 evals feasible, versus 11 of 28 for pipelined, whose best feasible area is 3967. unrolled_k gave 0 feasible in 14 evals, with max throughput 7.37 MSPS against the 50 MSPS requirement. Iterative has even fewer results per cycle, with N+3 cycles per result at N of about 22 or more, so it cannot reach 50 MSPS. I will drop both and concentrate on pipelined_m around its feasible region (data_width 24..25, n_iter 23..26, m up to 7), extending slightly downward in width, iterations and guard bits to cut area. I keep a small share for pipelined as a cross-check.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.818e+04 (gain this round: n/a (first round)).
Feasible designs: 38 of 100 evaluations (26 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 20% violate; best seen 257
- max_abs_err <= 9.53674e-07: 61% violate; best seen 2.62e-07 (2^-21.86)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2344, power_index=4.41, luts=1953, ffs=391, throughput_msps=62.5, max_abs_err=9.48e-07 (2^-20.01)
Front coverage: luts_plus_ffs 2344..2344 (HV reference 8000); power_index 4.41..4.41 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 7.37 MSPS; best accuracy 19.58 bits
- pipelined: 28 evals, 11 feasible; max throughput seen 257 MSPS; best accuracy 21.57 bits; best feasible luts_plus_ffs=3967; feasible ranges: data_width 25..26, n_iter 22..25, angle_guard 2..3, frac_guard 1..4
- pipelined_m: 58 evals, 27 feasible; max throughput seen 158 MSPS; best accuracy 21.86 bits; best feasible luts_plus_ffs=2344; feasible ranges: data_width 24..25, n_iter 23..26, angle_guard 1..3, frac_guard 1..3, m 2..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus the budget on the pipelined families, the only ones that can meet 50 MSPS at about 21-bit accuracy, and search the neighbourhood of the single front point in width, iterations, guard bits and m.*)
- `pipelined_m` (80 evals): data_width=22..26, n_iter=20..26, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=3..8. *Why:* This family holds the current front point and the best feasible area. Slightly lower width, iterations and guard bits, and larger m, may reduce LUTs, FFs and power while keeping error under 2^-20 and throughput at or above 50 MSPS.
- `pipelined` (20 evals): data_width=22..26, n_iter=20..26, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round. *Why:* It is the fastest family and its feasible region is known. A small share checks whether lower-width variants can reach the front.

**Result (code):** 100 evaluations this round, 200 total; 86 feasible; hypervolume 8.818e+04 (+0.0%).

**LLM decision:** `refine` — The front is a single design, pipelined_m at W=25, N=23, m=6, with 2344 LUTs+FFs and power 4.41. Hypervolume gained +0.0% this round, so the search is stalling around that point. Iterative and unrolled_k cannot meet 50 MSPS: unrolled_k peaked at 7.37 MSPS with 0 of 14 feasible, and iterative is slower still at N+3 cycles per result. Adding iterative would waste budget. The feasible region is narrow: pipelined_m has 73 feasible designs, all with data_width 24..26 and n_iter 22..26, and the 2^-20 error limit leaves little slack (best front point 2^-20.01). The remaining gains should come from trading guard bits, rounding and m against the error limit, so I will focus on pipelined_m with a small pipelined share.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.00% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.818e+04 (gain this round: +0.0%).
Feasible designs: 86 of 200 evaluations (67 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 12% violate; best seen 257
- max_abs_err <= 9.53674e-07: 55% violate; best seen 1.18e-07 (2^-23.01)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2344, power_index=4.41, luts=1953, ffs=391, throughput_msps=62.5, max_abs_err=9.48e-07 (2^-20.01)
Front coverage: luts_plus_ffs 2344..2344 (HV reference 8000); power_index 4.41..4.41 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 7.37 MSPS; best accuracy 19.58 bits
- pipelined: 48 evals, 13 feasible; max throughput seen 257 MSPS; best accuracy 22.01 bits; best feasible luts_plus_ffs=3967; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 2..3, frac_guard 1..4
- pipelined_m: 138 evals, 73 feasible; max throughput seen 158 MSPS; best accuracy 23.01 bits; best feasible luts_plus_ffs=2344; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 0..3, frac_guard 1..3, m 2..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined_m` (200 evals): data_width=24..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* code: map the front of pipelined_m (1 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 225 feasible; hypervolume 8.818e+04 (+0.0%).

**No LLM call** (code's front-mapping round): The front is a single design, pipelined_m at W=25, N=23, m=6, with 2344 LUTs+FFs and power 4.41. Hypervolume gained +0.0% this round, so the search is stalling around that point. Iterative and unrolled_k cannot meet 50 MSPS: unrolled_k peaked at 7.37 MSPS with 0 of 14 feasible, and iterative is slower still at N+3 cycles per result. Adding iterative would waste budget. The feasible region is narrow: pipelined_m has 73 feasible designs, all with data_width 24..26 and n_iter 22..26, and the 2^-20 error limit leaves little slack (best front point 2^-20.01). The remaining gains should come from trading guard bits, rounding and m against the error limit, so I will focus on pipelined_m with a small pipelined share.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 8.818e+04 (gain this round: +0.0%).
Feasible designs: 225 of 400 evaluations (191 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 12% violate; best seen 257
- max_abs_err <= 9.53674e-07: 39% violate; best seen 2.14e-08 (2^-25.48)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=23 angle_guard=1 frac_guard=1 rounding=trunc m=6] luts_plus_ffs=2344, power_index=4.41, luts=1953, ffs=391, throughput_msps=62.5, max_abs_err=9.48e-07 (2^-20.01)
Front coverage: luts_plus_ffs 2344..2344 (HV reference 8000); power_index 4.41..4.41 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 14 evals, 0 feasible; max throughput seen 7.37 MSPS; best accuracy 19.58 bits
- pipelined: 48 evals, 13 feasible; max throughput seen 257 MSPS; best accuracy 22.01 bits; best feasible luts_plus_ffs=3967; feasible ranges: data_width 24..26, n_iter 22..26, angle_guard 2..3, frac_guard 1..4
- pipelined_m: 338 evals, 212 feasible; max throughput seen 158 MSPS; best accuracy 25.48 bits; best feasible luts_plus_ffs=2344; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 12368 in, 4185 out
- provider-reported cost: $0.0666
- full prompts and replies: `llm_trace.jsonl`

