# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
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
`pipelined_m:data_width=24,n_iter=23,angle_guard=3,frac_guard=2,rounding=trunc,m=4` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1976 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 565 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 86 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 86 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 8 | exact: schedule |
| latency_ns | 93 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.78 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 9.42e-07 (2^-20.02) | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 3.95 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.16e-07 (2^-22.14) | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 0.907 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20 | exact: bit-accurate model, dense (130707 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=24,n_iter=23,angle_guard=3,frac_guard=2,rounding=trunc,m=4` | 1976 | 565 | 86.0 | 8 | 4.78 | 9.42e-07 (2^-20.02) | 20.02 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint strongly favors 1-result/cycle families. pipelined and pipelined_m only need Fmax >= 50 MHz, while iterative would need Fmax >= (N+3)*50 MHz, i.e. over 1.1 GHz for N>=20, so it is excluded. unrolled_k is only marginally plausible: k=8 with N=20..24 gives 6 cycles/result and would need Fmax >= 300 MHz, so it receives a small probe budget. For accuracy <= 2^-20, W=22 is the practical minimum because W=21 rounded has no quantization margin; W=22..25 covers minimum area through modest margin. N=20..26 covers residual near the limit to safe margin. angle_guard -1..2 and frac_guard 0..2 test whether minimal guard bits can meet the error bound while preserving area. Rounding is included because it changes quantization error. Since the final selection minimises luts_plus_ffs, the ranges emphasise low W, low N, low guards, and larger m, while still leaving enough margin to find feasible Pareto points.*)
- `pipelined_m` (65 evals): data_width=22..25, n_iter=20..26, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* Primary family: 1 result/cycle, so the 50 MSPS constraint only requires Fmax >= 50 MHz. m=2..8 spans the main area/power trade-off: larger m reduces register count but increases combinational depth per stage. Accuracy ranges focus on the minimum plausible W (22) up to a small margin (25), N near the residual limit to margin, and small guard-bit ranges to find low-area feasible points.
- `pipelined` (25 evals): data_width=22..25, n_iter=20..26, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* m=1 fallback and Fmax upper bound. It has the shortest stage but more registers than pipelined_m, so it may be needed if pipelined_m with m>1 cannot reach 50 MSPS. It also helps bound the Pareto front for area and power.
- `unrolled_k` (10 evals): data_width=22..24, n_iter=20..24, angle_guard=0..1, frac_guard=0..1, rounding=trunc|round, k=8..8. *Why:* Small feasibility probe only. With k=8 and N=20..24, the schedule is 6 cycles/result, so meeting 50 MSPS would require Fmax >= 300 MHz. Lower k would require even higher Fmax, so k=8 is the only plausible setting. If the cost model shows insufficient Fmax, this family can be dropped in later rounds.

**Result (code):** 100 evaluations this round, 100 total; 6 feasible; hypervolume 7.642e+04 (n/a).

**LLM decision:** `refine` — Round 1 shows only pipelined and pipelined_m can meet the 50 MSPS constraint; unrolled_k reached at most 5.75 MSPS and iterative is the k=1 extreme, so it is not a promising throughput candidate. The best feasible area is pipelined_m at 2808 LUT+FF with power_index 5.28, in a narrow cluster around data_width 25, n_iter 23-24, angle_guard 1-2, frac_guard 1-2, and m 2-3. pipelined is feasible but much larger at 4492 LUT+FF, so it is worth a smaller search only to check for a power tradeoff. Narrow the search around the promising pipelined_m cluster while allowing data_width 24, lower guards, and rounding to expose lower-area or lower-power points.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 7.642e+04 (gain this round: n/a (first round)).
Feasible designs: 6 of 100 evaluations (6 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 33% violate; best seen 257
- max_abs_err <= 9.53674e-07: 93% violate; best seen 5.4e-07 (2^-20.82)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=25 n_iter=24 angle_guard=2 frac_guard=1 rounding=trunc m=3] luts_plus_ffs=2808, power_index=5.28, luts=2065, ffs=743, throughput_msps=110, max_abs_err=8.18e-07 (2^-20.22)

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 5.75 MSPS; best accuracy 19.12 bits
- pipelined: 25 evals, 1 feasible; max throughput seen 257 MSPS; best accuracy 20.50 bits; best feasible luts_plus_ffs=4492; feasible ranges: data_width 24..24, n_iter 26..26, angle_guard 2..2, frac_guard 2..2
- pipelined_m: 65 evals, 5 feasible; max throughput seen 158 MSPS; best accuracy 20.82 bits; best feasible luts_plus_ffs=2808; feasible ranges: data_width 25..25, n_iter 23..24, angle_guard 1..2, frac_guard 1..2, m 2..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus the remaining budget on the two families that can satisfy throughput, with most evaluations on pipelined_m because it has the best feasible area, and a smaller pipelined slice to capture any power tradeoff.*)
- `pipelined_m` (70 evals): data_width=24..25, n_iter=22..26, angle_guard=0..3, frac_guard=0..3, rounding=trunc|round, m=2..4. *Why:* This family produced the best feasible area and the only Pareto point; the observed feasible cluster is dw 25, N 23-24, ag 1-2, fg 1-2, m 2-3, so search slightly wider to test lower N/guards and m=4 for area/power improvements.
- `pipelined` (30 evals): data_width=24..25, n_iter=24..28, angle_guard=1..3, frac_guard=1..3, rounding=trunc|round. *Why:* This is the only other throughput-capable family; its feasible point is dw 24, N 26, ag 2, fg 2, so search nearby to determine whether it can be non-dominated on power despite higher area.

**Result (code):** 100 evaluations this round, 200 total; 71 feasible; hypervolume 8.31e+04 (+8.7%).

**LLM decision:** `stop` — [LLM failed to answer: openrouter:qwen/qwen3.8-27b failed to produce AnalysisDecision: LengthFinishReasonError: Could not parse response content as the length limit was reached - CompletionUsage(completion_tokens=16000, prompt_tokens=2705, total_tokens=18705, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=None, audio_tokens=0, reasoning_tokens=16000, rejected_prediction_tokens=None, text_tokens=None, image_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cache_write_tokens=0, cached_tokens=0, image_tokens=None, text_tokens=None, vi]
- **rule applied by code:** LLM produced no valid decision; treated as stop

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8.31e+04 (gain this round: +8.7%).
Feasible designs: 71 of 200 evaluations (48 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 16% violate; best seen 257
- max_abs_err <= 9.53674e-07: 64% violate; best seen 2.92e-07 (2^-21.71)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=24 n_iter=23 angle_guard=3 frac_guard=2 rounding=trunc m=4] luts_plus_ffs=2541, power_index=4.78, luts=1976, ffs=565, throughput_msps=86, max_abs_err=9.42e-07 (2^-20.02)

Per family:
- unrolled_k: 10 evals, 0 feasible; max throughput seen 5.75 MSPS; best accuracy 19.12 bits
- pipelined: 55 evals, 28 feasible; max throughput seen 257 MSPS; best accuracy 21.71 bits; best feasible luts_plus_ffs=4237; feasible ranges: data_width 24..25, n_iter 24..28, angle_guard 1..3, frac_guard 1..3
- pipelined_m: 135 evals, 43 feasible; max throughput seen 158 MSPS; best accuracy 21.68 bits; best feasible luts_plus_ffs=2541; feasible ranges: data_width 24..25, n_iter 22..26, angle_guard 1..3, frac_guard 1..3, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 2)
- tokens: 4144 in, 19595 out
- provider-reported cost: $0.0547
- full prompts and replies: `llm_trace.jsonl`

