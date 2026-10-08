# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 100 of 400 budgeted, over 1 round(s).  
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
`pipelined_m:data_width=26,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc,m=7` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 2065 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 400 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 52 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 6 | exact: schedule |
| latency_ns | 115 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 4.64 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 8.42e-07 (2^-20.18) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 14.1 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 1.7e-07 (2^-22.48) | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 2.86 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.2 | exact: bit-accurate model, dense (130961 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined_m:data_width=26,n_iter=24,angle_guard=1,frac_guard=0,rounding=trunc,m=7` | 2065 | 400 | 52.0 | 6 | 4.64 | 8.42e-07 (2^-20.18) | 20.18 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The error bound is tied to the output LSB 2^-(W-2), so the area-critical feasible region is around W=21-22 with enough n_iter and guard bits; W=21-26 is searched to find the smallest width that can satisfy 2^-20. For throughput, pipelined and pipelined_m produce one result per cycle and therefore only require Fmax >= 50 MHz, while unrolled_k requires Fmax >= 50*(ceil(N/k)+3) MHz, so higher k is needed to keep the cycle count low. iterative is excluded because its N+3 cycle interval makes the throughput requirement much more demanding for accuracy-relevant N. The budget is concentrated on pipelined_m, where m creates the main area/power versus timing tradeoff, with pipelined as a timing-margin baseline and unrolled_k as a lower-register alternative.*)
- `pipelined_m` (45 evals): data_width=21..26, n_iter=20..28, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round, m=2..8. *Why:* Most promising for minimizing luts_plus_ffs and power_index while still producing one result per cycle. The m parameter directly trades pipeline register count against combinational path length, so it is the main area/power versus timing tradeoff for the 50 MSPS constraint.
- `pipelined` (30 evals): data_width=21..26, n_iter=20..28, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round. *Why:* Fully registered one-result-per-cycle baseline. It has the shortest per-stage path and therefore the strongest throughput margin, but likely higher area and power. It is needed to establish the feasible region and the high-timing-margin end of the Pareto front.
- `unrolled_k` (25 evals): data_width=21..26, n_iter=20..28, angle_guard=-1..2, frac_guard=0..3, rounding=trunc|round, k=4..8. *Why:* Shared datapath with k rotations per cycle may reduce register count relative to pipelined families, but throughput becomes Fmax divided by ceil(N/k)+3. Searching k=4..8 focuses on enough rotations per cycle to keep the required Fmax manageable while exposing area/power tradeoffs not available in the pipelined families.

**Result (code):** 100 evaluations this round, 100 total; 43 feasible; hypervolume 8.504e+04 (n/a).

**LLM decision:** `stop` — [LLM failed to answer: openrouter:qwen/qwen3.8-27b failed to produce AnalysisDecision: LengthFinishReasonError: Could not parse response content as the length limit was reached - CompletionUsage(completion_tokens=16000, prompt_tokens=2141, total_tokens=18141, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=None, audio_tokens=0, reasoning_tokens=16001, rejected_prediction_tokens=None, text_tokens=None, image_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cache_write_tokens=0, cached_tokens=0, image_tokens=None, text_tokens=None, vi]
- **rule applied by code:** LLM produced no valid decision; treated as stop

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8.504e+04 (gain this round: n/a (first round)).
Feasible designs: 43 of 100 evaluations (23 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 25% violate; best seen 264
- max_abs_err <= 9.53674e-07: 49% violate; best seen 2.45e-07 (2^-21.96)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined_m [data_width=26 n_iter=24 angle_guard=1 frac_guard=0 rounding=trunc m=7] luts_plus_ffs=2465, power_index=4.64, luts=2065, ffs=400, throughput_msps=52, max_abs_err=8.42e-07 (2^-20.18)

Per family:
- unrolled_k: 25 evals, 0 feasible; max throughput seen 6.55 MSPS; best accuracy 21.96 bits
- pipelined: 30 evals, 20 feasible; max throughput seen 264 MSPS; best accuracy 21.86 bits; best feasible luts_plus_ffs=3971; feasible ranges: data_width 26..26, n_iter 22..26, angle_guard 1..2, frac_guard 0..3
- pipelined_m: 45 evals, 23 feasible; max throughput seen 153 MSPS; best accuracy 21.35 bits; best feasible luts_plus_ffs=2465; feasible ranges: data_width 25..26, n_iter 24..28, angle_guard 0..2, frac_guard 0..2, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 2)
- tokens: 3058 in, 19952 out
- provider-reported cost: $0.0235
- full prompts and replies: `llm_trace.jsonl`

