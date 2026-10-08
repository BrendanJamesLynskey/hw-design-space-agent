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
`iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 161 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 93 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 13.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 15 | exact: schedule |
| latency_ns | 75.6 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.143 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000835 (2^-10.23) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.84 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.00024 (2^-12.02) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.97 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.2 | exact: bit-accurate model, exhaustive (32768 angles) |

## Pareto front (7 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` | 161 | 93 | 13.2 | 15 | 0.143 | 0.000835 (2^-10.23) | 10.23 |
| 1 | `iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 11.7 | 17 | 0.166 | 0.000632 (2^-10.63) | 10.63 |
| 2 | `iterative:data_width=15,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.7 | 17 | 0.168 | 0.000599 (2^-10.71) | 10.71 |
| 3 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 179 | 97 | 11.7 | 17 | 0.177 | 0.000342 (2^-11.51) | 11.51 |
| 4 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 11.7 | 17 | 0.178 | 0.000294 (2^-11.73) | 11.73 |
| 5 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=2,rounding=round` | 232 | 101 | 11.7 | 17 | 0.213 | 0.000279 (2^-11.81) | 11.81 |
| 6 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=2,rounding=round` | 234 | 102 | 11.7 | 17 | 0.215 | 0.000204 (2^-12.26) | 12.26 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Throughput >= 1 MSPS rules out iterative (1 result every N+3 cycles; even at 150 MHz, N=10 gives ~13.6 MSPS which is fine, but area is higher due to barrel shifters and FSM overhead vs pipelined). Actually iterative could work throughput-wise, but pipelined_m and unrolled_k are more area-efficient for 1/cycle or near-1/cycle operation. I excluded iterative because its shared datapath with barrel shifters typically has higher LUT count than the pipelined variants for equivalent accuracy, and the spec prioritizes area minimization. pipelined_m is the primary focus because it offers 1/cycle throughput with reduced FFs (register every m stages). unrolled_k is included as a strong area competitor since it uses a shared datapath with fewer registers. pipelined is included as a baseline to establish the Pareto front. Data width 12-16 and n_iter 10-14 are chosen to satisfy max_abs_err <= 2^-10 with margin while keeping area low. angle_guard 0-2 and frac_guard 0-2 provide enough precision without excessive width. Rounding is included as a choice since it affects accuracy at no significant area cost.*)
- `pipelined_m` (50 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Primary candidate. 1 result/cycle meets throughput. m>1 drastically cuts FFs vs full pipeline while keeping 1/cycle throughput. W=12-16 and N=10-14 should satisfy max_abs_err <= 2^-10 (0.000976562). Minimizes luts_plus_ffs.
- `pipelined` (25 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Baseline 1/cycle family. Higher FF count than pipelined_m due to full register depth, but useful to confirm the Pareto boundary and verify that pipelined_m dominates or is competitive in area.
- `unrolled_k` (25 evals): data_width=12..16, n_iter=10..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Secondary candidate. k=2-4 with N=10-14 gives ceil(N/k)+3 cycles/result. At Fmax ~100-150 MHz, throughput = Fmax/ceil(N/k). For N=12,k=4: 3 cycles/result -> ~33-50 MSPS, easily >= 1 MSPS. Lower FFs than pipelined families due to shared datapath. May offer lower luts_plus_ffs if Fmax is sufficient.

**Result (code):** 100 evaluations this round, 100 total; 37 feasible; hypervolume 1874 (n/a).

**LLM decision:** `refine` — The current front is dominated by `unrolled_k` designs (best area 363) which are significantly smaller than `pipelined_m` (830) and `pipelined` (1566). The `unrolled_k` family is the only one achieving the area target while meeting throughput. The `iterative` family is unexplored and, being the most area-efficient architecture (single datapath, no parallelism), is the most likely to beat the current 363 LUT+FFs. We must explore `iterative` to find the true Pareto minimum. We will also refine `unrolled_k` to focus on the high-accuracy/low-area corner (data_width 15-16, n_iter 12-14) to ensure we capture the best trade-off points before the budget runs out.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1874 (gain this round: n/a (first round)).
Feasible designs: 37 of 100 evaluations (30 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 63% violate; best seen 0.000279 (2^-11.81)

Pareto front (feasible, 3 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round k=3] luts_plus_ffs=363, accuracy_bits=10.2, luts=273, ffs=91, throughput_msps=13.5, max_abs_err=0.000835 (2^-10.23), power_index=0.0957
- unrolled_k [data_width=15 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=3] luts_plus_ffs=404, accuracy_bits=10.6, luts=313, ffs=91, throughput_msps=8.97, max_abs_err=0.000632 (2^-10.63), power_index=0.122
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=2 rounding=round k=3] luts_plus_ffs=503, accuracy_bits=11.8, luts=403, ffs=100, throughput_msps=8.97, max_abs_err=0.000279 (2^-11.81), power_index=0.151

Per family:
- unrolled_k: 25 evals, 12 feasible; max throughput seen 13.5 MSPS; best accuracy 11.81 bits; best feasible luts_plus_ffs=363; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2, k 2..4
- pipelined: 25 evals, 4 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1566; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard 0..2, frac_guard 2..2
- pipelined_m: 50 evals, 21 feasible; max throughput seen 178 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=830; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Prioritizing the unexplored `iterative` family to find the absolute minimum area, while refining `unrolled_k` to solidify the current front. Dropping `pipelined` and `pipelined_m` as they are clearly area-dominated by `unrolled_k` and likely `iterative`.*)
- `iterative` (60 evals): data_width=14..16, n_iter=12..14, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* Unexplored family with the lowest area potential. Focusing on the proven accuracy/width ranges from Round 1 to ensure feasibility and high accuracy.
- `unrolled_k` (40 evals): data_width=15..16, n_iter=12..14, angle_guard=0..2, frac_guard=0..2, rounding=round, k=2..4. *Why:* Refining the current best family to squeeze out any remaining area/accuracy improvements in the known feasible region.

**Result (code):** 100 evaluations this round, 200 total; 129 feasible; hypervolume 2746 (+46.6%).

**LLM decision:** `stop` — The Pareto front is well-established with 7 feasible designs. The iterative family dominates the area objective (best 253 LUTs+FFs) while meeting all constraints (throughput >= 1 MSPS, max_abs_err <= 2^-10). The pipelined_m family offers higher throughput (up to 178 MSPS) with moderate area (830 LUTs+FFs), but does not improve the area-accuracy trade-off significantly compared to iterative. No new families remain to explore, and further refinement would likely yield diminishing returns given the tight feasible ranges already identified (data_width 14-16, n_iter 12-14). The current front adequately maps the trade-off space for the spec's objectives.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 2746 (gain this round: +46.6%).
Feasible designs: 129 of 200 evaluations (88 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 36% violate; best seen 0.000204 (2^-12.26)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=11.7, max_abs_err=0.000632 (2^-10.63), power_index=0.166
- iterative [data_width=15 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=11.7, max_abs_err=0.000599 (2^-10.71), power_index=0.168
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.5, luts=179, ffs=97, throughput_msps=11.7, max_abs_err=0.000342 (2^-11.51), power_index=0.177
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.7, luts=181, ffs=98, throughput_msps=11.7, max_abs_err=0.000294 (2^-11.73), power_index=0.178
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=2 rounding=round] luts_plus_ffs=333, accuracy_bits=11.8, luts=232, ffs=101, throughput_msps=11.7, max_abs_err=0.000279 (2^-11.81), power_index=0.213
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.3, luts=234, ffs=102, throughput_msps=11.7, max_abs_err=0.000204 (2^-12.26), power_index=0.215

Per family:
- iterative: 60 evals, 54 feasible; max throughput seen 13.2 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2
- unrolled_k: 65 evals, 50 feasible; max throughput seen 13.5 MSPS; best accuracy 11.81 bits; best feasible luts_plus_ffs=336; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2, k 2..4
- pipelined: 25 evals, 4 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1566; feasible ranges: data_width 16..16, n_iter 13..14, angle_guard 0..2, frac_guard 2..2
- pipelined_m: 50 evals, 21 feasible; max throughput seen 178 MSPS; best accuracy 11.51 bits; best feasible luts_plus_ffs=830; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2, m 2..4
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7027 in, 2399 out
- provider-reported cost: $0.0071
- full prompts and replies: `llm_trace.jsonl`

