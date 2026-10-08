# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
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
`iterative:data_width=16,n_iter=16,angle_guard=-1,frac_guard=1,rounding=trunc` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 178 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 97 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 10.4 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 19 | exact: schedule |
| latency_ns | 95.8 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.196 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.00073 (2^-10.42) | exact: bit-accurate model, exhaustive (65536 angles) |
| max_abs_err_lsb | 12 | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err | 0.000172 (2^-12.50) | exact: bit-accurate model, exhaustive (65536 angles) |
| rms_err_lsb | 2.83 | exact: bit-accurate model, exhaustive (65536 angles) |
| accuracy_bits | 10.4 | exact: bit-accurate model, exhaustive (65536 angles) |

## Pareto front (13 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=16,n_iter=16,angle_guard=-1,frac_guard=1,rounding=trunc` | 178 | 97 | 10.4 | 19 | 0.196 | 0.00073 (2^-10.42) | 10.42 |
| 1 | `iterative:data_width=16,n_iter=16,angle_guard=2,frac_guard=1,rounding=trunc` | 183 | 100 | 10.4 | 19 | 0.202 | 0.000325 (2^-11.59) | 11.59 |
| 2 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc` | 193 | 102 | 11.7 | 17 | 0.189 | 0.00027 (2^-11.85) | 11.85 |
| 3 | `iterative:data_width=17,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc` | 193 | 104 | 11.7 | 17 | 0.19 | 0.000248 (2^-11.98) | 11.98 |
| 4 | `iterative:data_width=17,n_iter=15,angle_guard=2,frac_guard=1,rounding=trunc` | 195 | 105 | 10.8 | 18 | 0.203 | 0.000174 (2^-12.49) | 12.49 |
| 5 | `iterative:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 204 | 107 | 10.2 | 19 | 0.222 | 0.000116 (2^-13.08) | 13.08 |
| 6 | `iterative:data_width=18,n_iter=16,angle_guard=0,frac_guard=2,rounding=trunc` | 212 | 110 | 10.2 | 19 | 0.23 | 0.000114 (2^-13.10) | 13.10 |
| 7 | `iterative:data_width=18,n_iter=16,angle_guard=0,frac_guard=3,rounding=trunc` | 222 | 112 | 10.2 | 19 | 0.239 | 0.00011 (2^-13.15) | 13.15 |
| 8 | `iterative:data_width=18,n_iter=16,angle_guard=1,frac_guard=3,rounding=trunc` | 224 | 113 | 10.2 | 19 | 0.241 | 7.75e-05 (2^-13.65) | 13.65 |
| 9 | `iterative:data_width=18,n_iter=16,angle_guard=2,frac_guard=4,rounding=trunc` | 235 | 116 | 10.2 | 19 | 0.251 | 5.8e-05 (2^-14.07) | 14.07 |
| 10 | `iterative:data_width=18,n_iter=17,angle_guard=2,frac_guard=4,rounding=trunc` | 272 | 117 | 7.9 | 20 | 0.293 | 4.94e-05 (2^-14.31) | 14.31 |
| 11 | `iterative:data_width=18,n_iter=25,angle_guard=2,frac_guard=3,rounding=round` | 316 | 115 | 5.7 | 28 | 0.454 | 3.58e-05 (2^-14.77) | 14.77 |
| 12 | `iterative:data_width=18,n_iter=25,angle_guard=4,frac_guard=3,rounding=round` | 319 | 117 | 5.7 | 28 | 0.46 | 1.82e-05 (2^-15.74) | 15.74 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Focus the first 100 evals on the low-area corner of the feasible region. All families compute identical bits for the same accuracy parameters, so use shared ranges near the 2^-10 constraint: W 12-18 (W=12 is the first width whose output LSB is 2^-10), N 10-18, small angle/frac guards, and both rounding modes. iterative and unrolled_k are included because they are the non-pipelined area candidates and may satisfy throughput if their estimated Fmax is sufficient. pipelined_m is included because it provides 1 result/cycle, making the throughput constraint easiest, and m allows FF/area trade-offs. pipelined is omitted in round 1 to keep budget on the more area-relevant families.*)
- `iterative` (34 evals): data_width=12..18, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* Lowest-area non-pipelined candidate; tests whether the shared-datapath iterative CORDIC can meet the error bound and 1 MSPS throughput with minimal W/N/guard bits.
- `unrolled_k` (33 evals): data_width=12..18, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* Non-pipelined candidate with k rotations/cycle; k 2-8 spans low-area unrolling to higher throughput margin, useful if iterative cannot meet throughput.
- `pipelined_m` (33 evals): data_width=12..18, n_iter=4..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=2..8. *Why:* 1 result/cycle candidate; m 2-8 spans register spacing for LUT+FF trade-off while keeping the throughput constraint easy to satisfy.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 66 feasible; hypervolume 6510 (n/a).

**LLM decision:** `refine` — The feasible front is currently all iterative and already satisfies throughput with margin (best feasible iterative throughput 12.9 MSPS vs 1 MSPS required). The area objective is best served by iterative: best feasible luts_plus_ffs=287, while unrolled_k best feasible is 448 and pipelined_m best feasible is 766. The main gap is between the 287/10.5-bit point and the 337/12.4-bit point, and there is also room to improve the area/accuracy tradeoff around W=16-18, N=12-26, ag=0-2, fg=1-4. pipelined is not promising for this low-area spec because the less-registered pipelined_m family already has best feasible area 766, far above the current iterative front, and accuracy is parameter-dependent rather than family-dependent; spending a full round on pipelined would likely not improve the area-dominated front.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 6510 (gain this round: n/a (first round)).
Feasible designs: 66 of 100 evaluations (58 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 34% violate; best seen 1.82e-05 (2^-15.74)

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=16 n_iter=12 angle_guard=0 frac_guard=3 rounding=trunc] luts_plus_ffs=287, accuracy_bits=10.5, luts=185, ffs=102, throughput_msps=12.9, max_abs_err=0.000703 (2^-10.47), power_index=0.162
- iterative [data_width=18 n_iter=25 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=337, accuracy_bits=12.4, luts=228, ffs=109, throughput_msps=5.68, max_abs_err=0.000182 (2^-12.43), power_index=0.355
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=4 rounding=trunc] luts_plus_ffs=348, accuracy_bits=13.7, luts=233, ffs=115, throughput_msps=10.2, max_abs_err=7.75e-05 (2^-13.65), power_index=0.249
- iterative [data_width=18 n_iter=25 angle_guard=1 frac_guard=1 rounding=round] luts_plus_ffs=393, accuracy_bits=13.8, luts=283, ffs=110, throughput_msps=5.68, max_abs_err=6.95e-05 (2^-13.81), power_index=0.413
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=4 rounding=round] luts_plus_ffs=394, accuracy_bits=13.9, luts=279, ffs=115, throughput_msps=10.2, max_abs_err=6.75e-05 (2^-13.85), power_index=0.281
- iterative [data_width=18 n_iter=25 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=395, accuracy_bits=14.3, luts=284, ffs=111, throughput_msps=5.68, max_abs_err=5.02e-05 (2^-14.28), power_index=0.416
- iterative [data_width=18 n_iter=25 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=431, accuracy_bits=14.8, luts=316, ffs=115, throughput_msps=5.68, max_abs_err=3.58e-05 (2^-14.77), power_index=0.454
- iterative [data_width=18 n_iter=25 angle_guard=4 frac_guard=3 rounding=round] luts_plus_ffs=436, accuracy_bits=15.7, luts=319, ffs=117, throughput_msps=5.68, max_abs_err=1.82e-05 (2^-15.74), power_index=0.46

Per family:
- iterative: 34 evals, 19 feasible; max throughput seen 19.4 MSPS; best accuracy 15.74 bits; best feasible luts_plus_ffs=287; feasible ranges: data_width 14..18, n_iter 12..26, angle_guard -2..4, frac_guard 1..4
- unrolled_k: 33 evals, 24 feasible; max throughput seen 12.9 MSPS; best accuracy 15.40 bits; best feasible luts_plus_ffs=448; feasible ranges: data_width 13..18, n_iter 12..24, angle_guard 0..3, frac_guard 0..4, k 2..8
- pipelined_m: 33 evals, 23 feasible; max throughput seen 171 MSPS; best accuracy 13.49 bits; best feasible luts_plus_ffs=766; feasible ranges: data_width 14..18, n_iter 12..22, angle_guard -1..2, frac_guard 0..4, m 2..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Refine iterative around the proven feasible and Pareto region to fill the area/accuracy gap and confirm the minimum-area feasible design. Do not add pipelined yet: pipelined_m, which has fewer pipeline registers than full pipelined, already has best feasible area 766, much worse than iterative's 287, so pipelined is unlikely to improve the low-area front and would consume budget better spent tightening the iterative front.*)
- `iterative` (100 evals): data_width=16..18, n_iter=12..26, angle_guard=-1..2, frac_guard=1..4, rounding=trunc|round. *Why:* Focus the remaining budget on the only family currently producing the Pareto front and the minimum-area feasible design. Keep W=16-18 to cover the best low-area point and the higher-accuracy W=18 points; keep N=12-26 because feasible iterative designs were found across that range and the current front uses both N=12 and N=25; restrict angle_guard to -1..2 because the useful front points use ag=0,1,2 and ag=4 only appears at higher area; keep frac_guard 1..4 because fg=1 gives the next-lowest-area point while fg=3/4 give the higher-accuracy points; keep both rounding modes because trunc gives the lowest-area points and round gives the best accuracy points.

**Result (code):** 100 evaluations this round, 200 total; 166 feasible; hypervolume 6661 (+2.3%).

**LLM decision:** `stop` — [LLM failed to answer: openrouter:qwen/qwen3.8-27b failed to produce AnalysisDecision: LengthFinishReasonError: Could not parse response content as the length limit was reached - CompletionUsage(completion_tokens=16000, prompt_tokens=2950, total_tokens=18950, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=None, audio_tokens=0, reasoning_tokens=16000, rejected_prediction_tokens=None, text_tokens=None, image_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cache_write_tokens=0, cached_tokens=0, image_tokens=None, text_tokens=None, vi]
- **rule applied by code:** LLM produced no valid decision; treated as stop

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 6661 (gain this round: +2.3%).
Feasible designs: 166 of 200 evaluations (140 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 171
- max_abs_err <= 0.000976562: 17% violate; best seen 1.82e-05 (2^-15.74)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=16 n_iter=16 angle_guard=-1 frac_guard=1 rounding=trunc] luts_plus_ffs=275, accuracy_bits=10.4, luts=178, ffs=97, throughput_msps=10.4, max_abs_err=0.00073 (2^-10.42), power_index=0.196
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=trunc] luts_plus_ffs=283, accuracy_bits=11.6, luts=183, ffs=100, throughput_msps=10.4, max_abs_err=0.000325 (2^-11.59), power_index=0.202
- iterative [data_width=17 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=297, accuracy_bits=12, luts=193, ffs=104, throughput_msps=11.7, max_abs_err=0.000248 (2^-11.98), power_index=0.19
- iterative [data_width=17 n_iter=15 angle_guard=2 frac_guard=1 rounding=trunc] luts_plus_ffs=300, accuracy_bits=12.5, luts=195, ffs=105, throughput_msps=10.8, max_abs_err=0.000174 (2^-12.49), power_index=0.203
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=311, accuracy_bits=13.1, luts=204, ffs=107, throughput_msps=10.2, max_abs_err=0.000116 (2^-13.08), power_index=0.222
- iterative [data_width=18 n_iter=16 angle_guard=0 frac_guard=3 rounding=trunc] luts_plus_ffs=334, accuracy_bits=13.1, luts=222, ffs=112, throughput_msps=10.2, max_abs_err=0.00011 (2^-13.15), power_index=0.239
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=3 rounding=trunc] luts_plus_ffs=337, accuracy_bits=13.7, luts=224, ffs=113, throughput_msps=10.2, max_abs_err=7.75e-05 (2^-13.65), power_index=0.241
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=4 rounding=trunc] luts_plus_ffs=351, accuracy_bits=14.1, luts=235, ffs=116, throughput_msps=10.2, max_abs_err=5.8e-05 (2^-14.07), power_index=0.251
- iterative [data_width=18 n_iter=25 angle_guard=2 frac_guard=3 rounding=round] luts_plus_ffs=431, accuracy_bits=14.8, luts=316, ffs=115, throughput_msps=5.68, max_abs_err=3.58e-05 (2^-14.77), power_index=0.454
- iterative [data_width=18 n_iter=25 angle_guard=4 frac_guard=3 rounding=round] luts_plus_ffs=436, accuracy_bits=15.7, luts=319, ffs=117, throughput_msps=5.68, max_abs_err=1.82e-05 (2^-15.74), power_index=0.46

Per family:
- iterative: 134 evals, 119 feasible; max throughput seen 19.4 MSPS; best accuracy 15.74 bits; best feasible luts_plus_ffs=275; feasible ranges: data_width 14..18, n_iter 12..26, angle_guard -2..4, frac_guard 1..4
- unrolled_k: 33 evals, 24 feasible; max throughput seen 12.9 MSPS; best accuracy 15.40 bits; best feasible luts_plus_ffs=448; feasible ranges: data_width 13..18, n_iter 12..24, angle_guard 0..3, frac_guard 0..4, k 2..8
- pipelined_m: 33 evals, 23 feasible; max throughput seen 171 MSPS; best accuracy 13.49 bits; best feasible luts_plus_ffs=766; feasible ranges: data_width 14..18, n_iter 12..22, angle_guard -1..2, frac_guard 0..4, m 2..8
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 2)
- tokens: 4264 in, 23014 out
- provider-reported cost: $0.0784
- full prompts and replies: `llm_trace.jsonl`

