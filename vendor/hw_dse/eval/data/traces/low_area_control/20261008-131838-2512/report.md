# DSE run: low_area_control

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
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
`iterative:data_width=15,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 166 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 91 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 11.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 85.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.164 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.00081 (2^-10.27) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 6.64 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.00021 (2^-12.22) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.72 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.3 | exact: bit-accurate model, exhaustive (32768 angles) |

## Pareto front (11 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 166 | 91 | 11.7 | 17 | 0.164 | 0.00081 (2^-10.27) | 10.27 |
| 1 | `iterative:data_width=15,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 166 | 91 | 10.4 | 19 | 0.184 | 0.00081 (2^-10.27) | 10.27 |
| 2 | `iterative:data_width=15,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 10.4 | 19 | 0.186 | 0.000632 (2^-10.63) | 10.63 |
| 3 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 10.4 | 19 | 0.188 | 0.000599 (2^-10.71) | 10.71 |
| 4 | `iterative:data_width=15,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.7 | 17 | 0.168 | 0.000599 (2^-10.71) | 10.71 |
| 5 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 179 | 97 | 11.0 | 18 | 0.187 | 0.000301 (2^-11.70) | 11.70 |
| 6 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 11.0 | 18 | 0.189 | 0.000285 (2^-11.78) | 11.78 |
| 7 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=2,rounding=round` | 221 | 97 | 10.4 | 19 | 0.227 | 0.000253 (2^-11.95) | 11.95 |
| 8 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=1,rounding=round` | 223 | 99 | 11.0 | 18 | 0.218 | 0.00025 (2^-11.97) | 11.97 |
| 9 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=1,rounding=round` | 225 | 100 | 11.0 | 18 | 0.22 | 0.00018 (2^-12.44) | 12.44 |
| 10 | `iterative:data_width=16,n_iter=15,angle_guard=2,frac_guard=2,rounding=round` | 234 | 102 | 11.0 | 18 | 0.228 | 0.000176 (2^-12.48) | 12.48 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec prioritises area (min luts_plus_ffs) with a modest accuracy requirement (max_abs_err <= 2^-10) and low throughput (>=1 MSPS). All families can plausibly meet the throughput constraint given their cycle counts, so the search should focus on the area-accuracy trade-off. Iterative shares a single datapath and has the lowest register count, making it the most promising for minimal area; it receives the majority of the budget. Unrolled_k and pipelined_m are included with moderate k/m to verify whether their different scheduling/register trade-offs can yield lower area for the same accuracy, and to map the Pareto front. The parameter ranges are chosen to cover the accuracy threshold and a few bits beyond (data_width 11–16, n_iter 8–20), avoiding wasteful exploration of very high precision that would only increase area. Guards and rounding are varied because they affect both accuracy and area. The first round will use 100 evaluations, allocated by the shares above (70/15/15).*)
- `iterative` (70 evals): data_width=11..16, n_iter=8..20, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round. *Why:* Primary candidate for minimum area: shared datapath and few registers. Ranges span the accuracy threshold (2^-10) and a few bits beyond, so the search can locate the smallest feasible design and map the area-accuracy Pareto front. Guards and rounding are included because they trade area for accuracy.
- `unrolled_k` (15 evals): data_width=11..16, n_iter=8..20, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Small k (2–4) may reduce cycle count and improve Fmax with modest area overhead. Included to check whether it can beat iterative on area for the same accuracy, and to enrich the Pareto front. Throughput is already easily met, so area remains the deciding factor.
- `pipelined_m` (15 evals): data_width=11..16, n_iter=8..20, angle_guard=-1..3, frac_guard=0..2, rounding=trunc|round, m=4..8. *Why:* Registers every m stages (m=4–8) reduce FF count versus full pipelining while keeping 1 result/cycle. Included to see if this scheduling can compete with iterative on area for the same accuracy, especially if iterative Fmax is low. Full pipelined (m=1) is omitted because it likely costs more area without helping the area objective.

**Result (code):** 100 evaluations this round, 100 total; 43 feasible; hypervolume 2997 (n/a).

**LLM decision:** `refine` — The spec selects min luts_plus_ffs, and the current front is dominated by the iterative family: the smallest feasible design is iterative [W=15, N=18, ag=1, fg=1, trunc] at luts_plus_ffs=275 with accuracy 10.4 bits, comfortably above the 2^-10 (10-bit) floor and 7.7 MSPS (>>1 MSPS). Throughput is a non-binding constraint (best seen 97.8 MSPS), so we can trade cycles for area: lower data_width shrinks LUTs, and extra n_iter/guards buy back the accuracy needed to stay >=10 bits. Round 1 only reached data_width 14..16 for iterative, so the low-width corner is under-explored. Pipelined/pipelined_m are 1-result/cycle and already cost 920+ luts_plus_ffs (pipelined_m best feasible), so they cannot beat 275 on the min-area objective and would not extend the HV front leftward; pipelined is left for a small confirmation sample only.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2997 (gain this round: n/a (first round)).
Feasible designs: 43 of 100 evaluations (33 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 97.8
- max_abs_err <= 0.000976562: 57% violate; best seen 0.000176 (2^-12.48)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=18 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=275, accuracy_bits=10.4, luts=180, ffs=95, throughput_msps=7.71, max_abs_err=0.000716 (2^-10.45), power_index=0.217
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=276, accuracy_bits=11.7, luts=179, ffs=97, throughput_msps=11, max_abs_err=0.000301 (2^-11.70), power_index=0.187
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=11, max_abs_err=0.000285 (2^-11.78), power_index=0.189
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=317, accuracy_bits=12, luts=221, ffs=97, throughput_msps=10.4, max_abs_err=0.000253 (2^-11.95), power_index=0.227
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts_plus_ffs=322, accuracy_bits=12, luts=223, ffs=99, throughput_msps=11, max_abs_err=0.00025 (2^-11.97), power_index=0.218
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=324, accuracy_bits=12.4, luts=225, ffs=100, throughput_msps=11, max_abs_err=0.00018 (2^-12.44), power_index=0.22
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.5, luts=234, ffs=102, throughput_msps=11, max_abs_err=0.000176 (2^-12.48), power_index=0.228

Per family:
- iterative: 70 evals, 29 feasible; max throughput seen 18.5 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=275; feasible ranges: data_width 14..16, n_iter 12..19, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 15 evals, 8 feasible; max throughput seen 15.8 MSPS; best accuracy 11.56 bits; best feasible luts_plus_ffs=384; feasible ranges: data_width 15..16, n_iter 12..20, angle_guard 0..3, frac_guard 0..2, k 3..4
- pipelined_m: 15 evals, 6 feasible; max throughput seen 97.8 MSPS; best accuracy 12.37 bits; best feasible luts_plus_ffs=920; feasible ranges: data_width 14..16, n_iter 14..20, angle_guard 0..3, frac_guard 0..2, m 4..8
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus budget on the low-data_width iterative corner to minimise luts_plus_ffs subject to accuracy_bits >= 10; keep a small allocation to close out the pipelined family and re-check unrolled_k.*)
- `iterative` (75 evals): data_width=13..15, n_iter=14..22, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Push data_width down to 13-14 while raising n_iter to recover >=10 accuracy bits; this is the only direction that can lower luts_plus_ffs below 275.
- `pipelined` (15 evals): data_width=13..16, n_iter=14..20, angle_guard=0..2, frac_guard=0..1, rounding=round. *Why:* Only unexplored family; small sample to confirm it is area-dominated and cannot improve the min-area front.
- `unrolled_k` (10 evals): data_width=14..15, n_iter=14..20, angle_guard=0..2, frac_guard=0..1, rounding=round, k=2..4. *Why:* Best feasible unrolled_k is 384 luts_plus_ffs, already above iterative; small sample to check whether a low-k/low-width point can approach 275.

**Result (code):** 100 evaluations this round, 200 total; 97 feasible; hypervolume 3008 (+0.4%).

**LLM decision:** `refine` — The spec's selection rule is min luts_plus_ffs, and the binding constraint is accuracy (52% of evals violate max_abs_err <= 2^-10), not throughput (0% violate; every feasible design is >= 10 MSPS vs the 1 MSPS floor, so throughput is non-binding). The accuracy side of the front is clearly saturated - the round-2 hypervolume gain was only +0.4% and best accuracy (12.48 bits) sits far to the right of the selected point. The only figure that actually decides the final design is the area corner: iterative [dw=15 n_iter=14 angle_guard=0 frac_guard=0 round] at luts_plus_ffs=257, 11.7 MSPS, 10.27 bits - only ~0.27 bits of margin over the 2^-10 limit. That corner is where remaining budget should go. Two concrete holes to probe: (1) data_width=14 is inside the reported iterative feasible range but has not reached the front, so a dw=14 config with one guard bit may undercut 257 LUTs+FFs; (2) every front entry uses rounding=round, so trunc (which the registry allows and which typically trims the output/shift rounding logic) has not been tested for area at this error margin. unrolled_k (best 345) and pipelined/pipelined_m (>=920) are strictly worse on the selection objective and need no further budget.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.39% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3008 (gain this round: +0.4%).
Feasible designs: 97 of 200 evaluations (74 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 52% violate; best seen 0.000176 (2^-12.48)

Pareto front (feasible, 11 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=11.7, max_abs_err=0.00081 (2^-10.27), power_index=0.164
- iterative [data_width=15 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=257, accuracy_bits=10.3, luts=166, ffs=91, throughput_msps=10.4, max_abs_err=0.00081 (2^-10.27), power_index=0.184
- iterative [data_width=15 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=10.4, max_abs_err=0.000632 (2^-10.63), power_index=0.186
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=10.4, max_abs_err=0.000599 (2^-10.71), power_index=0.188
- iterative [data_width=15 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=11.7, max_abs_err=0.000599 (2^-10.71), power_index=0.168
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.8, luts=181, ffs=98, throughput_msps=11, max_abs_err=0.000285 (2^-11.78), power_index=0.189
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=317, accuracy_bits=12, luts=221, ffs=97, throughput_msps=10.4, max_abs_err=0.000253 (2^-11.95), power_index=0.227
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=round] luts_plus_ffs=322, accuracy_bits=12, luts=223, ffs=99, throughput_msps=11, max_abs_err=0.00025 (2^-11.97), power_index=0.218
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=324, accuracy_bits=12.4, luts=225, ffs=100, throughput_msps=11, max_abs_err=0.00018 (2^-12.44), power_index=0.22
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.5, luts=234, ffs=102, throughput_msps=11, max_abs_err=0.000176 (2^-12.48), power_index=0.228

Per family:
- iterative: 145 evals, 66 feasible; max throughput seen 18.5 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=257; feasible ranges: data_width 14..16, n_iter 12..22, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 25 evals, 14 feasible; max throughput seen 15.8 MSPS; best accuracy 11.56 bits; best feasible luts_plus_ffs=345; feasible ranges: data_width 14..16, n_iter 12..20, angle_guard 0..3, frac_guard 0..2, k 2..4
- pipelined: 15 evals, 11 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1522; feasible ranges: data_width 15..16, n_iter 14..19, angle_guard 0..2, frac_guard 0..1
- pipelined_m: 15 evals, 6 feasible; max throughput seen 97.8 MSPS; best accuracy 12.37 bits; best feasible luts_plus_ffs=920; feasible ranges: data_width 14..16, n_iter 14..20, angle_guard 0..3, frac_guard 0..2, m 4..8
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 6679 in, 10006 out
- provider-reported cost: $0.0136
- full prompts and replies: `llm_trace.jsonl`

