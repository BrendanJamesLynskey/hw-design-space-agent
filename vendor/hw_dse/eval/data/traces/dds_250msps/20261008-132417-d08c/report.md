# DSE run: dds_250msps

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 200 of 400 budgeted, over 2 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; milestone 2 recalibrates against real synthesis). *measured*: none in M1. The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

## Spec
```
spec dds_250msps: NCO / DDS sin-cos generator for a digital up-converter. One sample per clock at >= 250 MSPS, max error <= 2^-13. Minimise LUTs.
  constraint: throughput_msps >= 250
  constraint: max_abs_err <= 0.00012207
  objective: min luts (HV ref 4000)
  objective: max accuracy_bits (HV ref 13)
  select: min luts
  budget: 400 evals, 100/round, <= 4 rounds, eps 0.01
```

## Selected design
`pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 905 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 938 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 264 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 64.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 17.3 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000119 (2^-13.04) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.79 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 3.06e-05 (2^-14.99) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 2.01 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## Pareto front (18 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 905 | 938 | 264.5 | 17 | 17.3 | 0.000119 (2^-13.04) | 13.04 |
| 1 | `pipelined:data_width=18,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 920 | 953 | 264.5 | 17 | 17.6 | 0.000109 (2^-13.17) | 13.17 |
| 2 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 949 | 984 | 264.5 | 17 | 18.2 | 8.66e-05 (2^-13.50) | 13.50 |
| 3 | `pipelined:data_width=18,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 985 | 1017 | 264.5 | 18 | 18.8 | 8.35e-05 (2^-13.55) | 13.55 |
| 4 | `pipelined:data_width=19,n_iter=15,angle_guard=1,frac_guard=2,rounding=trunc` | 1008 | 1036 | 264.5 | 17 | 19.2 | 8.04e-05 (2^-13.60) | 13.60 |
| 5 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1017 | 1049 | 264.5 | 18 | 19.4 | 5.84e-05 (2^-14.06) | 14.06 |
| 6 | `pipelined:data_width=19,n_iter=16,angle_guard=3,frac_guard=1,rounding=trunc` | 1080 | 1110 | 264.5 | 18 | 20.6 | 5.64e-05 (2^-14.11) | 14.11 |
| 7 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=1,rounding=round` | 1089 | 1080 | 264.5 | 18 | 20.4 | 5.25e-05 (2^-14.22) | 14.22 |
| 8 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 1096 | 1122 | 264.5 | 18 | 20.9 | 4.81e-05 (2^-14.34) | 14.34 |
| 9 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=0,rounding=round` | 1118 | 1149 | 264.5 | 19 | 21.3 | 4.23e-05 (2^-14.53) | 14.53 |
| 10 | `pipelined:data_width=19,n_iter=16,angle_guard=2,frac_guard=3,rounding=round` | 1168 | 1152 | 264.5 | 18 | 21.8 | 3.97e-05 (2^-14.62) | 14.62 |
| 11 | `pipelined:data_width=19,n_iter=17,angle_guard=2,frac_guard=1,rounding=round` | 1175 | 1164 | 264.5 | 19 | 22 | 3.42e-05 (2^-14.83) | 14.83 |
| 12 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=1,rounding=round` | 1192 | 1181 | 264.5 | 19 | 22.3 | 3.23e-05 (2^-14.92) | 14.92 |
| 13 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=2,rounding=round` | 1226 | 1212 | 264.5 | 19 | 22.9 | 2.76e-05 (2^-15.14) | 15.14 |
| 14 | `pipelined:data_width=19,n_iter=17,angle_guard=3,frac_guard=3,rounding=round` | 1259 | 1242 | 264.5 | 19 | 23.5 | 2.41e-05 (2^-15.34) | 15.34 |
| 15 | `pipelined:data_width=20,n_iter=18,angle_guard=1,frac_guard=2,rounding=trunc` | 1277 | 1299 | 264.5 | 20 | 24.2 | 2.18e-05 (2^-15.49) | 15.49 |
| 16 | `pipelined:data_width=19,n_iter=18,angle_guard=2,frac_guard=3,rounding=round` | 1317 | 1297 | 264.5 | 20 | 24.6 | 2.1e-05 (2^-15.54) | 15.54 |
| 17 | `pipelined:data_width=20,n_iter=18,angle_guard=2,frac_guard=3,rounding=trunc` | 1331 | 1350 | 256.5 | 20 | 25.2 | 1.59e-05 (2^-15.94) | 15.94 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *iterative and unrolled_k are excluded because their minimum result intervals are 7 and 4 cycles respectively, implying required Fmax of at least 1750 MHz and 1000 MHz for 250 MSPS, which is not plausible for Artix-7. The first round therefore spends the budget on 1-result/cycle families. pipelined gets the larger share because it is the most direct feasible family and contains the main LUT-vs-accuracy trade-off. Ranges start at W=14 because W=13 with rounding has an output quantization step too coarse for the 2^-13 error bound; W is capped near 20 to stay in the low-LUT region while still allowing accuracy_bits above the 13-bit reference. N is centered around the likely 12-20 region where CORDIC residual error crosses the 2^-13 constraint. angle_guard and frac_guard are kept narrow around low values to find the minimum-LUT feasible point while still sampling enough guard bits to map the accuracy objective.*)
- `pipelined` (50 evals): data_width=14..20, n_iter=12..20, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Only 1-result/cycle families can plausibly satisfy 250 MSPS on Artix-7; pipelined has the shortest per-stage path and is the primary place where LUTs trade against accuracy via W, N, guards, and rounding.
- `pipelined_m` (50 evals): data_width=14..19, n_iter=12..18, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round, m=2..6. *Why:* Also 1-result/cycle, but with a longer combinational path; a small share checks whether the cost model gives any LUT advantage or different feasible timing/accuracy points, while focusing m on values more likely to remain near the 250 MSPS constraint.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 30 feasible; hypervolume 8321 (n/a).

**LLM decision:** `refine` — Feasible designs exist, so the problem is not infeasible. The only family with feasible throughput is pipelined: the lowest-LUT feasible points are pipelined W=19,N=16,angle_guard=0,frac_guard=0,rounding=trunc at 1001 LUTs/13.3 bits/264 MSPS and W=18,N=15,angle_guard=1,frac_guard=2,rounding=round at 1002 LUTs/13.4 bits/264 MSPS. This identifies the promising region: W around 18-19, N around 15-16, small guards, and throughput above 250 MSPS. pipelined_m had 0 feasible designs and max throughput 171 MSPS, so it is not worth further budget. iterative and unrolled_k are not one-result-per-cycle families and have no feasible evidence; with the spec requiring one sample per clock at >=250 MSPS, the next round should tighten the only family that has already produced feasible low-LUT points. Include W=17 to test whether a lower-area width can still meet the 2^-13 error constraint, and keep N up to 18 to capture the accuracy tradeoff.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 8321 (gain this round: n/a (first round)).
Feasible designs: 30 of 100 evaluations (25 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 46% violate; best seen 1.59e-05 (2^-15.94)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=19 n_iter=16 angle_guard=0 frac_guard=0 rounding=trunc] luts=1001, accuracy_bits=13.3, ffs=1033, throughput_msps=264, max_abs_err=9.61e-05 (2^-13.35), power_index=19.1
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] luts=1002, accuracy_bits=13.4, ffs=993, throughput_msps=264, max_abs_err=9.56e-05 (2^-13.35), power_index=18.8
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] luts=1048, accuracy_bits=13.7, ffs=1038, throughput_msps=264, max_abs_err=7.76e-05 (2^-13.65), power_index=19.6
- pipelined [data_width=19 n_iter=15 angle_guard=2 frac_guard=3 rounding=trunc] luts=1053, accuracy_bits=13.7, ffs=1078, throughput_msps=264, max_abs_err=7.62e-05 (2^-13.68), power_index=20
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=3 rounding=round] luts=1078, accuracy_bits=13.7, ffs=1064, throughput_msps=264, max_abs_err=7.5e-05 (2^-13.70), power_index=20.1
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1128, accuracy_bits=14.4, ffs=1150, throughput_msps=264, max_abs_err=4.57e-05 (2^-14.42), power_index=21.4
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=3 rounding=round] luts=1168, accuracy_bits=14.6, ffs=1152, throughput_msps=264, max_abs_err=3.97e-05 (2^-14.62), power_index=21.8
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts=1175, accuracy_bits=14.7, ffs=1199, throughput_msps=257, max_abs_err=3.71e-05 (2^-14.72), power_index=22.3
- pipelined [data_width=19 n_iter=18 angle_guard=2 frac_guard=3 rounding=round] luts=1317, accuracy_bits=15.5, ffs=1297, throughput_msps=264, max_abs_err=2.1e-05 (2^-15.54), power_index=24.6
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] luts=1331, accuracy_bits=15.9, ffs=1350, throughput_msps=257, max_abs_err=1.59e-05 (2^-15.94), power_index=25.2

Per family:
- pipelined: 50 evals, 30 feasible; max throughput seen 273 MSPS; best accuracy 15.94 bits; best feasible luts=1001; feasible ranges: data_width 18..20, n_iter 15..19, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.00 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Feasible designs exist, so the problem is not infeasible. The only family with feasible throughput is pipelined: the lowest-LUT feasible points are pipelined W=19,N=16,angle_guard=0,frac_guard=0,rounding=trunc at 1001 LUTs/13.3 bits/264 MSPS and W=18,N=15,angle_guard=1,frac_guard=2,rounding=round at 1002 LUTs/13.4 bits/264 MSPS. This identifies the promising region: W around 18-19, N around 15-16, small guards, and throughput above 250 MSPS. pipelined_m had 0 feasible designs and max throughput 171 MSPS, so it is not worth further budget. iterative and unrolled_k are not one-result-per-cycle families and have no feasible evidence; with the spec requiring one sample per clock at >=250 MSPS, the next round should tighten the only family that has already produced feasible low-LUT points. Include W=17 to test whether a lower-area width can still meet the 2^-13 error constraint, and keep N up to 18 to capture the accuracy tradeoff.*)
- `pipelined` (100 evals): data_width=17..19, n_iter=15..18, angle_guard=-1..3, frac_guard=0..3, rounding=trunc|round. *Why:* Focus the remaining 100 evals on the pipelined low-LUT feasible cluster, with W=17 included to search for a lower-LUT feasible point below the current best 1001 LUTs.

**Result (code):** 100 evaluations this round, 200 total; 111 feasible; hypervolume 8449 (+1.5%).

**LLM decision:** `stop` — [LLM failed to answer: openrouter:qwen/qwen3.8-27b failed to produce AnalysisDecision: LengthFinishReasonError: Could not parse response content as the length limit was reached - CompletionUsage(completion_tokens=16000, prompt_tokens=2721, total_tokens=18721, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=None, audio_tokens=0, reasoning_tokens=16001, rejected_prediction_tokens=None, text_tokens=None, image_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cache_write_tokens=0, cached_tokens=1344, image_tokens=None, text_tokens=None,]
- **rule applied by code:** LLM produced no valid decision; treated as stop

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 8449 (gain this round: +1.5%).
Feasible designs: 111 of 200 evaluations (76 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 273
- max_abs_err <= 0.00012207: 32% violate; best seen 1.59e-05 (2^-15.94)

Pareto front (feasible, 18 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=905, accuracy_bits=13, ffs=938, throughput_msps=264, max_abs_err=0.000119 (2^-13.04), power_index=17.3
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=949, accuracy_bits=13.5, ffs=984, throughput_msps=264, max_abs_err=8.66e-05 (2^-13.50), power_index=18.2
- pipelined [data_width=19 n_iter=15 angle_guard=1 frac_guard=2 rounding=trunc] luts=1008, accuracy_bits=13.6, ffs=1036, throughput_msps=264, max_abs_err=8.04e-05 (2^-13.60), power_index=19.2
- pipelined [data_width=19 n_iter=16 angle_guard=3 frac_guard=1 rounding=trunc] luts=1080, accuracy_bits=14.1, ffs=1110, throughput_msps=264, max_abs_err=5.64e-05 (2^-14.11), power_index=20.6
- pipelined [data_width=19 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts=1096, accuracy_bits=14.3, ffs=1122, throughput_msps=264, max_abs_err=4.81e-05 (2^-14.34), power_index=20.9
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=0 rounding=round] luts=1118, accuracy_bits=14.5, ffs=1149, throughput_msps=264, max_abs_err=4.23e-05 (2^-14.53), power_index=21.3
- pipelined [data_width=19 n_iter=17 angle_guard=2 frac_guard=1 rounding=round] luts=1175, accuracy_bits=14.8, ffs=1164, throughput_msps=264, max_abs_err=3.42e-05 (2^-14.83), power_index=22
- pipelined [data_width=19 n_iter=17 angle_guard=3 frac_guard=2 rounding=round] luts=1226, accuracy_bits=15.1, ffs=1212, throughput_msps=264, max_abs_err=2.76e-05 (2^-15.14), power_index=22.9
- pipelined [data_width=20 n_iter=18 angle_guard=1 frac_guard=2 rounding=trunc] luts=1277, accuracy_bits=15.5, ffs=1299, throughput_msps=264, max_abs_err=2.18e-05 (2^-15.49), power_index=24.2
- pipelined [data_width=20 n_iter=18 angle_guard=2 frac_guard=3 rounding=trunc] luts=1331, accuracy_bits=15.9, ffs=1350, throughput_msps=257, max_abs_err=1.59e-05 (2^-15.94), power_index=25.2

Per family:
- pipelined: 150 evals, 111 feasible; max throughput seen 273 MSPS; best accuracy 15.94 bits; best feasible luts=905; feasible ranges: data_width 17..20, n_iter 15..19, angle_guard -1..3, frac_guard 0..3
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 15.00 bits
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 2)
- tokens: 4233 in, 24285 out
- provider-reported cost: $0.0532
- full prompts and replies: `llm_trace.jsonl`

