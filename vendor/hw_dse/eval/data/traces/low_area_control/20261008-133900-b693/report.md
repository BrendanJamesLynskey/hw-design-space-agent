# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 100 of 400 budgeted, over 1 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec low_area_control: Field-oriented motor-control loop needing sin/cos of the rotor angle at >= 1 MSPS with max error <= 2^-10. Area is everything: minimise LUTs + FFs.
  constraint: throughput_msps >= 1
  constraint: max_abs_err <= 0.000976562
  objective: min luts_plus_ffs (HV ref 1500)
  objective: max accuracy_bits (HV ref 10)
  select: min luts_plus_ffs
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`iterative:data_width=15,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 166 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 91 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 10.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 19 | exact: schedule |
| latency_ns | 95.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.184 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.00081 (2^-10.27) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.64 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.00021 (2^-12.22) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.72 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.3 | exact: bit-accurate model, exhaustive (32768 angles) |

## Pareto front (5 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 166 | 91 | 10.4 | 19 | 0.184 | 0.00081 (2^-10.27) | 10.27 |
| 1 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 11.7 | 17 | 0.178 | 0.000294 (2^-11.73) | 11.73 |
| 2 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 221 | 97 | 10.4 | 19 | 0.227 | 0.000253 (2^-11.95) | 11.95 |
| 3 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=round` | 232 | 101 | 10.4 | 19 | 0.238 | 0.000214 (2^-12.19) | 12.19 |
| 4 | `unrolled_k:data_width=16,n_iter=16,angle_guard=2,frac_guard=1,rounding=round,k=7` | 674 | 98 | 7.0 | 6 | 0.174 | 0.000177 (2^-12.47) | 12.47 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Accuracy is family-independent, so the same accuracy-focused ranges are used to avoid spending budget rediscovering the same accuracy frontier. data_width 12..16: W=12 gives output LSB 2^-10, the constraint bound, and W=16 gives headroom for accuracy_bits above the HV reference. n_iter 10..16 spans low iteration counts for area up to higher counts for accuracy. angle_guard -1..2 and frac_guard 0..2 test area-saving narrowing against accuracy loss; both rounding modes are kept. iterative is given the largest share because its shared datapath and lack of per-stage pipeline registers make it the primary low-area candidate if the evaluated throughput meets 1 MSPS. unrolled_k is included to reduce cycles/result without a fully pipelined datapath. pipelined_m is included because it produces 1 result/cycle and is the most direct way to satisfy the throughput constraint while still exploring register-count trade-offs via m. pipelined is deferred because it is the most registered variant and is only needed if pipelined_m fails the throughput constraint.*)
- `iterative` (40 evals): data_width=12..16, n_iter=10..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Shared datapath and no per-stage pipeline registers make this the main candidate for minimum luts_plus_ffs. It is included even though throughput depends on N+3 cycles/result, because if the evaluated Fmax is sufficient it can dominate the area objective; if not, the infeasible points will guide later rounds.
- `unrolled_k` (30 evals): data_width=12..16, n_iter=10..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..8. *Why:* k=2..8 spans the trade-off between fewer cycles/result and extra unrolled logic. Small k preserves area; larger k can recover throughput if iterative or small-k designs do not meet the 1 MSPS constraint.
- `pipelined_m` (30 evals): data_width=12..16, n_iter=10..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..8. *Why:* 1 result/cycle directly addresses the throughput constraint. m=2..8 spans the register-count trade-off: larger m uses fewer pipeline registers and may reduce area, while smaller m may be needed if the longer combinational path limits Fmax.

**Result (code):** 100 evaluations this round, 100 total; 52 feasible; hypervolume 2859 (n/a).

**LLM decision:** `stop` — [LLM failed to answer: openrouter:qwen/qwen3.8-27b failed to produce AnalysisDecision: LengthFinishReasonError: Could not parse response content as the length limit was reached - CompletionUsage(completion_tokens=16000, prompt_tokens=3126, total_tokens=19126, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=None, audio_tokens=0, reasoning_tokens=16000, rejected_prediction_tokens=None, text_tokens=None, image_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cache_write_tokens=0, cached_tokens=0, image_tokens=None, text_tokens=None, vi]
- **rule applied by code:** LLM produced no valid decision; treated as stop

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2859 (gain this round: n/a (first round)).
Feasible designs: 52 of 100 evaluations (38 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 48% violate; best seen 0.000177 (2^-12.47)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=10.4, max_abs_err=0.00081 (2^-10.27), power_index=0.184
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.7, luts=181, ffs=98, throughput_msps=11.7, max_abs_err=0.000294 (2^-11.73), power_index=0.178
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=317, accuracy_bits=12, luts=221, ffs=97, throughput_msps=10.4, max_abs_err=0.000253 (2^-11.95), power_index=0.227
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=round] luts_plus_ffs=333, accuracy_bits=12.2, luts=232, ffs=101, throughput_msps=10.4, max_abs_err=0.000214 (2^-12.19), power_index=0.238
- unrolled_k [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round k=7] luts_plus_ffs=771, accuracy_bits=12.5, luts=674, ffs=98, throughput_msps=7, max_abs_err=0.000177 (2^-12.47), power_index=0.174

Per family:
- iterative: 40 evals, 15 feasible; max throughput seen 15.6 MSPS; best accuracy 12.19 bits; best feasible luts_plus_ffs=257; feasible ranges: data_width 15..16, n_iter 12..16, angle_guard 0..2, frac_guard 0..2
- unrolled_k: 30 evals, 20 feasible; max throughput seen 12 MSPS; best accuracy 12.47 bits; best feasible luts_plus_ffs=600; feasible ranges: data_width 15..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, k 6..8
- pipelined_m: 30 evals, 17 feasible; max throughput seen 171 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=798; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, m 2..7
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 2)
- tokens: 1440 in, 12179 out
- provider-reported cost: $0.0287
- full prompts and replies: `llm_trace.jsonl`

