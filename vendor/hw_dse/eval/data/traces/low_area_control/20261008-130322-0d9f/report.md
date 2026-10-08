# DSE run: low_area_control

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: anthropic/claude-sonnet-5.5.  
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

## Pareto front (13 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` | 161 | 93 | 13.2 | 15 | 0.143 | 0.000835 (2^-10.23) | 10.23 |
| 1 | `iterative:data_width=15,n_iter=12,angle_guard=3,frac_guard=0,rounding=round` | 162 | 94 | 13.2 | 15 | 0.145 | 0.000803 (2^-10.28) | 10.28 |
| 2 | `iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 11.7 | 17 | 0.166 | 0.000632 (2^-10.63) | 10.63 |
| 3 | `iterative:data_width=15,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.7 | 17 | 0.168 | 0.000599 (2^-10.71) | 10.71 |
| 4 | `iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=1,rounding=trunc` | 170 | 94 | 11.7 | 17 | 0.169 | 0.000594 (2^-10.72) | 10.72 |
| 5 | `iterative:data_width=15,n_iter=14,angle_guard=3,frac_guard=0,rounding=round` | 172 | 94 | 11.7 | 17 | 0.17 | 0.000546 (2^-10.84) | 10.84 |
| 6 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 178 | 96 | 11.7 | 17 | 0.175 | 0.0004 (2^-11.29) | 11.29 |
| 7 | `iterative:data_width=16,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 179 | 97 | 11.7 | 17 | 0.177 | 0.000342 (2^-11.51) | 11.51 |
| 8 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 11.0 | 18 | 0.189 | 0.000285 (2^-11.78) | 11.78 |
| 9 | `iterative:data_width=16,n_iter=14,angle_guard=3,frac_guard=2,rounding=trunc` | 195 | 103 | 11.4 | 17 | 0.19 | 0.000264 (2^-11.89) | 11.89 |
| 10 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 223 | 99 | 11.0 | 18 | 0.218 | 0.00025 (2^-11.97) | 11.97 |
| 11 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=2,rounding=round` | 232 | 101 | 11.0 | 18 | 0.226 | 0.000218 (2^-12.16) | 12.16 |
| 12 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 234 | 102 | 11.0 | 18 | 0.228 | 0.000176 (2^-12.48) | 12.48 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *Area is the only cost and throughput needs only 1 MSPS, so the serial iterative family should dominate. Most of the budget goes there, with narrow ranges around the minimum width and iteration count that can reach 2^-10 error, and a small share goes to low-k unrolled to confirm it does not win. The fully pipelined families are dropped because their per-stage registers and datapaths cost far more area than the throughput they add, which is unneeded here.*)
- `iterative` (84 evals): data_width=10..16, n_iter=8..16, angle_guard=-2..3, frac_guard=0..3, rounding=trunc|round. *Why:* Shared datapath is the smallest-area architecture. N+3 cycles per result at 100+ MHz easily gives >=1 MSPS, so throughput is not binding. The error bound of 2^-10 needs roughly 11-14 bit width and 10-14 iterations.
- `unrolled_k` (16 evals): data_width=10..15, n_iter=9..14, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, k=2..3. *Why:* Small k adds a little area and probably does not beat iterative on area, but it serves as a cheap check since throughput is not a constraint.

**Result (code):** 100 evaluations this round, 100 total; 43 feasible; hypervolume 3001 (n/a).

**LLM decision:** `refine` — Iterative dominates: 8 front designs all iterative, best feasible area 253 (LUT+FF) at 13.2 MSPS, far above the 1 MSPS requirement. unrolled_k is worse (best feasible 391) and pipelined/pipelined_m replicate a stage per micro-rotation or per m stages, which should cost more area. Since throughput has huge slack (0% violation), area is the only lever, so I will concentrate on iterative around the feasible region (data_width 13..16, n_iter 10..15, rounding round/trunc, frac_guard 0..2, angle_guard -1..3). Error is the binding constraint (57% violate), so the search should probe near the 2^-10 boundary. I will keep a small share for unrolled_k at low k as a check.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 3001 (gain this round: n/a (first round)).
Feasible designs: 43 of 100 evaluations (37 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 18
- max_abs_err <= 0.000976562: 57% violate; best seen 0.000176 (2^-12.48)

Pareto front (feasible, 8 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=11.7, max_abs_err=0.000632 (2^-10.63), power_index=0.166
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.5, luts=179, ffs=97, throughput_msps=11.7, max_abs_err=0.000342 (2^-11.51), power_index=0.177
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=280, accuracy_bits=11.6, luts=181, ffs=99, throughput_msps=11, max_abs_err=0.000323 (2^-11.60), power_index=0.19
- iterative [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc] luts_plus_ffs=298, accuracy_bits=11.9, luts=195, ffs=103, throughput_msps=11.4, max_abs_err=0.000264 (2^-11.89), power_index=0.19
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts_plus_ffs=322, accuracy_bits=12, luts=223, ffs=99, throughput_msps=11, max_abs_err=0.00025 (2^-11.97), power_index=0.218
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] luts_plus_ffs=333, accuracy_bits=12.2, luts=232, ffs=101, throughput_msps=11, max_abs_err=0.000218 (2^-12.16), power_index=0.226
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.5, luts=234, ffs=102, throughput_msps=11, max_abs_err=0.000176 (2^-12.48), power_index=0.228

Per family:
- iterative: 84 evals, 41 feasible; max throughput seen 18 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..16, n_iter 12..15, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 16 evals, 2 feasible; max throughput seen 14.5 MSPS; best accuracy 10.34 bits; best feasible luts_plus_ffs=391; feasible ranges: data_width 14..15, n_iter 12..12, angle_guard 1..1, frac_guard 1..2, k 3..3
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Concentrate the budget on the iterative family near the feasibility boundary, since area is the only objective that matters and throughput is not binding.*)
- `iterative` (80 evals): data_width=12..16, n_iter=10..15, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round. *Why:* All front points are iterative at W 15-16; probing W 12-16 with N 10-15 and low guard bits targets the minimum-area designs that still meet 2^-10 error, while keeping higher-accuracy points for the front.
- `unrolled_k` (20 evals): data_width=14..16, n_iter=11..14, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, k=2..3. *Why:* Only 2 of 16 evaluations were feasible and its best area of 391 is well above iterative; a small focused probe at low k confirms whether it can compete.

**Result (code):** 100 evaluations this round, 200 total; 97 feasible; hypervolume 3008 (+0.2%).

**LLM decision:** `refine` — Hypervolume gained only +0.2% this round, so the front is nearly converged. The iterative family dominates: best feasible luts_plus_ffs=253, versus 340 for unrolled_k. The throughput constraint is slack (best 18 MSPS against a 1 MSPS requirement), so the one-result-per-cycle families have no benefit and would only cost area. Unrolled_k adds datapath area without help from throughput, so it is not worth more budget. The feasible region is data_width 13..16, n_iter 12..15, angle_guard -1..3, frac_guard 0..3. The error limit 2^-10 is met only narrowly at the low-area end (10.2 bits at W=15, N=12). The next round should probe just below that corner (W=13..15, N=11..14, low frac_guard, round) to see whether a smaller feasible design exists, and keep the top of the accuracy range for the HV objective. Pipelined families are skipped because they are certain to be larger.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.25% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3008 (gain this round: +0.2%).
Feasible designs: 97 of 200 evaluations (77 unique).
Families explored so far: iterative, unrolled_k. Not yet explored: pipelined, pipelined_m.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 18
- max_abs_err <= 0.000976562: 52% violate; best seen 0.000176 (2^-12.48)

Pareto front (feasible, 13 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=12 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=256, accuracy_bits=10.3, luts=162, ffs=94, throughput_msps=13.2, max_abs_err=0.000803 (2^-10.28), power_index=0.145
- iterative [data_width=15 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=11.7, max_abs_err=0.000599 (2^-10.71), power_index=0.168
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=264, accuracy_bits=10.7, luts=170, ffs=94, throughput_msps=11.7, max_abs_err=0.000594 (2^-10.72), power_index=0.169
- iterative [data_width=15 n_iter=14 angle_guard=3 frac_guard=0 rounding=round] luts_plus_ffs=265, accuracy_bits=10.8, luts=172, ffs=94, throughput_msps=11.7, max_abs_err=0.000546 (2^-10.84), power_index=0.17
- iterative [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.5, luts=179, ffs=97, throughput_msps=11.7, max_abs_err=0.000342 (2^-11.51), power_index=0.177
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=11, max_abs_err=0.000285 (2^-11.78), power_index=0.189
- iterative [data_width=16 n_iter=14 angle_guard=3 frac_guard=2 rounding=trunc] luts_plus_ffs=298, accuracy_bits=11.9, luts=195, ffs=103, throughput_msps=11.4, max_abs_err=0.000264 (2^-11.89), power_index=0.19
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=2 rounding=round] luts_plus_ffs=333, accuracy_bits=12.2, luts=232, ffs=101, throughput_msps=11, max_abs_err=0.000218 (2^-12.16), power_index=0.226
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.5, luts=234, ffs=102, throughput_msps=11, max_abs_err=0.000176 (2^-12.48), power_index=0.228

Per family:
- iterative: 164 evals, 80 feasible; max throughput seen 18 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 13..16, n_iter 12..15, angle_guard -1..3, frac_guard 0..3
- unrolled_k: 36 evals, 17 feasible; max throughput seen 14.5 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=340; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard 0..2, frac_guard 0..2, k 2..3
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 13394 in, 2247 out
- provider-reported cost: $0.0493
- full prompts and replies: `llm_trace.jsonl`

