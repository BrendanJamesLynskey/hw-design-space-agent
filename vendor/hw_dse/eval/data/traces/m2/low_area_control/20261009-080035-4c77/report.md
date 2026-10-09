# DSE run: low_area_control

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 4 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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
`iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 168 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 92 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 198 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 11.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 17 | exact: schedule |
| latency_ns | 85.7 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 0.166 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000632 (2^-10.63) | exact: bit-accurate model, exhaustive (32768 angles) |
| max_abs_err_lsb | 5.18 | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err | 0.000164 (2^-12.58) | exact: bit-accurate model, exhaustive (32768 angles) |
| rms_err_lsb | 1.34 | exact: bit-accurate model, exhaustive (32768 angles) |
| accuracy_bits | 10.6 | exact: bit-accurate model, exhaustive (32768 angles) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (22 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=14,angle_guard=1,frac_guard=0,rounding=round` | 168 | 92 | 11.7 | 17 | 0.166 | 0.000632 (2^-10.63) | 10.63 |
| 1 | `iterative:data_width=16,n_iter=16,angle_guard=0,frac_guard=1,rounding=trunc` | 180 | 98 | 10.4 | 19 | 0.198 | 0.000375 (2^-11.38) | 11.38 |
| 2 | `iterative:data_width=16,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 181 | 99 | 11.0 | 18 | 0.19 | 0.000323 (2^-11.60) | 11.60 |
| 3 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 191 | 101 | 10.4 | 19 | 0.209 | 0.000237 (2^-12.04) | 12.04 |
| 4 | `iterative:data_width=17,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 191 | 102 | 10.4 | 19 | 0.209 | 0.000149 (2^-12.71) | 12.71 |
| 5 | `iterative:data_width=18,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 202 | 107 | 10.2 | 19 | 0.221 | 0.000108 (2^-13.18) | 13.18 |
| 6 | `iterative:data_width=18,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 226 | 108 | 7.9 | 20 | 0.251 | 9.26e-05 (2^-13.40) | 13.40 |
| 7 | `iterative:data_width=18,n_iter=16,angle_guard=2,frac_guard=3,rounding=trunc` | 225 | 114 | 10.2 | 19 | 0.243 | 5.94e-05 (2^-14.04) | 14.04 |
| 8 | `iterative:data_width=21,n_iter=23,angle_guard=1,frac_guard=0,rounding=trunc` | 266 | 123 | 6.1 | 26 | 0.381 | 2.39e-05 (2^-15.35) | 15.35 |
| 9 | `iterative:data_width=21,n_iter=23,angle_guard=0,frac_guard=1,rounding=trunc` | 280 | 124 | 6.1 | 26 | 0.395 | 1.69e-05 (2^-15.85) | 15.85 |
| 10 | `iterative:data_width=21,n_iter=28,angle_guard=4,frac_guard=0,rounding=round` | 287 | 126 | 5.0 | 31 | 0.482 | 1.15e-05 (2^-16.41) | 16.41 |
| 11 | `iterative:data_width=23,n_iter=29,angle_guard=1,frac_guard=0,rounding=trunc` | 303 | 133 | 4.9 | 32 | 0.525 | 8.17e-06 (2^-16.90) | 16.90 |
| 12 | `iterative:data_width=23,n_iter=28,angle_guard=0,frac_guard=1,rounding=trunc` | 318 | 134 | 5.0 | 31 | 0.528 | 5.1e-06 (2^-17.58) | 17.58 |
| 13 | `iterative:data_width=25,n_iter=20,angle_guard=2,frac_guard=0,rounding=trunc` | 328 | 144 | 6.7 | 23 | 0.408 | 2.75e-06 (2^-18.47) | 18.47 |
| 14 | `iterative:data_width=25,n_iter=20,angle_guard=2,frac_guard=0,rounding=round` | 340 | 144 | 6.7 | 23 | 0.419 | 2.41e-06 (2^-18.66) | 18.66 |
| 15 | `iterative:data_width=25,n_iter=30,angle_guard=4,frac_guard=0,rounding=round` | 363 | 146 | 4.6 | 33 | 0.632 | 7.53e-07 (2^-20.34) | 20.34 |
| 16 | `iterative:data_width=27,n_iter=29,angle_guard=1,frac_guard=0,rounding=trunc` | 380 | 153 | 4.8 | 32 | 0.642 | 4.41e-07 (2^-21.11) | 21.11 |
| 17 | `iterative:data_width=27,n_iter=23,angle_guard=3,frac_guard=0,rounding=round` | 388 | 155 | 5.9 | 26 | 0.532 | 3.7e-07 (2^-21.37) | 21.37 |
| 18 | `iterative:data_width=28,n_iter=25,angle_guard=1,frac_guard=0,rounding=trunc` | 398 | 158 | 5.5 | 28 | 0.586 | 2.55e-07 (2^-21.91) | 21.91 |
| 19 | `iterative:data_width=28,n_iter=27,angle_guard=1,frac_guard=0,rounding=round` | 413 | 158 | 5.1 | 30 | 0.645 | 1.32e-07 (2^-22.85) | 22.85 |
| 20 | `iterative:data_width=28,n_iter=28,angle_guard=2,frac_guard=3,rounding=trunc` | 451 | 165 | 4.9 | 31 | 0.719 | 5.37e-08 (2^-24.15) | 24.15 |
| 21 | `unrolled_k:data_width=28,n_iter=26,angle_guard=4,frac_guard=4,rounding=round,k=6` | 1179 | 167 | 4.2 | 8 | 0.405 | 4.18e-08 (2^-24.51) | 24.51 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=1 MSPS) rules out iterative (1 result per N+3 cycles) and unrolled_k with low k. pipelined and pipelined_m always meet it. unrolled_k with k>=4 is borderline and worth checking since it has the smallest area. Accuracy <=2^-10 requires roughly W>=12 and N>=10; I focus W in 12-16 and N in 10-14 to stay near the constraint boundary where area is minimized. angle_guard and frac_guard are kept small to reduce area. The budget is split to explore all three viable families, with emphasis on pipelined (guaranteed throughput) and pipelined_m (area savings via m).*)
- `pipelined` (40 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m meet the 1 MSPS throughput constraint; pipelined is the area-efficient baseline. W=12-16 and N=10-14 cover the accuracy requirement (<=2^-10) while keeping area low.
- `pipelined_m` (30 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* pipelined_m trades latency for area by registering every m stages; m=2-4 can significantly reduce FF count vs fully pipelined while still meeting 1 result/cycle throughput.
- `unrolled_k` (30 evals): data_width=12..16, n_iter=10..14, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, k=4..8. *Why:* unrolled_k with high k (4-8) can achieve 1 result/cycle throughput if Fmax is high enough; it has the smallest area (shared datapath, no pipeline registers) so it may dominate on luts_plus_ffs if the throughput constraint is met.

**Result (code):** 100 evaluations this round, 100 total; 48 feasible; hypervolume 2153 (n/a).

**LLM decision:** `refine` — The current Pareto front is dominated by `unrolled_k` (460 LUT+FF) and `pipelined_m` (988 LUT+FF), both significantly cheaper than `pipelined` (1321 LUT+FF). The `unrolled_k` family offers the best area efficiency while meeting the throughput constraint (10.3 MSPS > 1 MSPS). However, the accuracy constraint is tight: the best feasible design achieves 11.5 bits (error 2^-11.51), which is close to the limit (2^-10). To improve hypervolume, we need to explore the trade-off between area and accuracy more densely in the low-area region. The `unrolled_k` family with `k=4` and `data_width=16` is the current best. We should refine the search around this region to find if slightly different parameters (e.g., `angle_guard`, `frac_guard`, `rounding`) can push accuracy higher without increasing area too much, or if a smaller `data_width` (e.g., 14 or 15) can reduce area while still meeting the accuracy constraint. The `pipelined_m` family is also promising for higher throughput if needed, but for this spec (min area), `unrolled_k` is the primary candidate. We will focus the next round on `unrolled_k` and `pipelined_m` with narrowed ranges around the current best feasible points to map the front more accurately in the low-area, high-accuracy region.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2153 (gain this round: n/a (first round)).
Feasible designs: 48 of 100 evaluations (38 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 52% violate; best seen 0.000209 (2^-12.22)

Pareto front (feasible, 2 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=16 n_iter=14 angle_guard=1 frac_guard=0 rounding=round k=4] luts_plus_ffs=460, accuracy_bits=11.5, luts=365, ffs=95, throughput_msps=10.3, max_abs_err=0.000342 (2^-11.51), power_index=0.121
- unrolled_k [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round k=6] luts_plus_ffs=684, accuracy_bits=12.2, luts=586, ffs=98, throughput_msps=8.13, max_abs_err=0.000209 (2^-12.22), power_index=0.154
Front coverage: luts_plus_ffs 460..684 (HV reference 1500); accuracy_bits 11.5..12.2 (HV reference 10); data_width on the front 16..16 (registry 8..28).

Per family:
- unrolled_k: 30 evals, 10 feasible; max throughput seen 12.4 MSPS; best accuracy 12.22 bits; best feasible luts_plus_ffs=460; feasible ranges: data_width 14..16, n_iter 12..14, angle_guard -1..2, frac_guard 0..2, k 4..6
- pipelined: 40 evals, 23 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1321; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 30 evals, 15 feasible; max throughput seen 178 MSPS; best accuracy 11.85 bits; best feasible luts_plus_ffs=988; feasible ranges: data_width 14..16, n_iter 13..14, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus on the two most promising families for low area. Narrowing the parameter ranges around the current best feasible points will allow the optimizer to densely sample the trade-off curve in the region that matters for the hypervolume (low luts_plus_ffs, high accuracy_bits).*)
- `unrolled_k` (50 evals): data_width=14..16, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, k=2..6. *Why:* Primary low-area candidate. Narrowing data_width to 14-16 and n_iter to 12-16 focuses on the region where accuracy and area trade-off is most sensitive. k=2-6 allows exploring throughput/area balance.
- `pipelined_m` (50 evals): data_width=14..16, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Secondary candidate. pipelined_m offers higher throughput than unrolled_k with moderate area. Narrowing ranges to match the promising region of unrolled_k allows direct comparison of the area/accuracy trade-off.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 200 total; 130 feasible; hypervolume 3087 (+43.4%).

**LLM decision:** `add_family` — The current Pareto front is dominated by `unrolled_k` with a minimum area of 375 LUTs+FFs. However, the `iterative` family has not been explored yet. Given the objective is to minimize `luts_plus_ffs` and the constraint is only >= 1 MSPS (which `iterative` can easily meet with a high Fmax, as seen in `unrolled_k` reaching ~13 MSPS), `iterative` is the most likely candidate to beat the 375 area mark. It uses a single shared datapath and barrel shifters, which typically results in significantly lower LUT usage than the multi-stage or unrolled architectures, especially since we only need 10.5+ bits of accuracy (achievable with N=12-14 iterations). Exploring this family is essential to find the true minimum area design before mapping the final front.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 3087 (gain this round: +43.4%).
Feasible designs: 130 of 200 evaluations (102 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 35% violate; best seen 0.000134 (2^-12.86)

Pareto front (feasible, 5 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- unrolled_k [data_width=16 n_iter=16 angle_guard=-1 frac_guard=2 rounding=trunc k=2] luts_plus_ffs=375, accuracy_bits=10.5, luts=277, ffs=98, throughput_msps=9.58, max_abs_err=0.000681 (2^-10.52), power_index=0.155
- unrolled_k [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc k=2] luts_plus_ffs=383, accuracy_bits=12, luts=283, ffs=100, throughput_msps=9.58, max_abs_err=0.000237 (2^-12.04), power_index=0.158
- unrolled_k [data_width=16 n_iter=14 angle_guard=2 frac_guard=1 rounding=round k=3] luts_plus_ffs=491, accuracy_bits=12.2, luts=392, ffs=99, throughput_msps=8.97, max_abs_err=0.000209 (2^-12.22), power_index=0.148
- unrolled_k [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round k=3] luts_plus_ffs=515, accuracy_bits=12.5, luts=416, ffs=99, throughput_msps=7.97, max_abs_err=0.000177 (2^-12.47), power_index=0.174
- unrolled_k [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=round k=3] luts_plus_ffs=537, accuracy_bits=12.9, luts=436, ffs=101, throughput_msps=7.97, max_abs_err=0.000134 (2^-12.86), power_index=0.182
Front coverage: luts_plus_ffs 375..537 (HV reference 1500); accuracy_bits 10.5..12.9 (HV reference 10); data_width on the front 16..16 (registry 8..28).

Per family:
- unrolled_k: 80 evals, 52 feasible; max throughput seen 13.5 MSPS; best accuracy 12.86 bits; best feasible luts_plus_ffs=375; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, k 2..6
- pipelined: 40 evals, 23 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1321; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 80 evals, 55 feasible; max throughput seen 178 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=826; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 3

**Plan explored** (LLM rationale: *The 'iterative' family is the only one not yet explored and is structurally the most area-efficient for low-throughput requirements. By focusing the search on the parameter ranges that have already proven feasible for accuracy and throughput in other families, we maximize the chance of finding a design with luts_plus_ffs < 375.*)
- `iterative` (40 evals): data_width=14..16, n_iter=12..16, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Exploring the unexplored 'iterative' family to find lower area designs. Ranges are narrowed to the proven feasible region from other families (data_width 14-16, n_iter 12-16) to focus the 100 evaluations on the most promising configurations that meet the accuracy and throughput constraints.

**Result (code):** 40 evaluations this round, 240 total; 164 feasible; hypervolume 3337 (+8.1%).

**LLM decision:** `stop` — The feasible Pareto front is well-mapped and satisfies all constraints. The minimum area design (iterative, 260 LUTs+FFs) meets the throughput constraint (11.7 MSPS >= 1 MSPS) and accuracy constraint (10.6 bits >= 10 bits). The front covers the trade-off space effectively, with area ranging from 260 to 537 and accuracy from 10.6 to 12.9 bits. Since this is the final round and the front is stable with no significant improvements expected from further exploration, stopping is the appropriate decision.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 160 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 3337 (gain this round: +8.1%).
Feasible designs: 164 of 240 evaluations (126 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 32% violate; best seen 0.000134 (2^-12.86)

Pareto front (feasible, 7 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=11.7, max_abs_err=0.000632 (2^-10.63), power_index=0.166
- iterative [data_width=16 n_iter=16 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=278, accuracy_bits=11.4, luts=180, ffs=98, throughput_msps=10.4, max_abs_err=0.000375 (2^-11.38), power_index=0.198
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=280, accuracy_bits=11.6, luts=181, ffs=99, throughput_msps=11, max_abs_err=0.000323 (2^-11.60), power_index=0.19
- iterative [data_width=16 n_iter=16 angle_guard=1 frac_guard=2 rounding=trunc] luts_plus_ffs=292, accuracy_bits=12, luts=191, ffs=101, throughput_msps=10.4, max_abs_err=0.000237 (2^-12.04), power_index=0.209
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=336, accuracy_bits=12.3, luts=234, ffs=102, throughput_msps=11.7, max_abs_err=0.000204 (2^-12.26), power_index=0.215
- unrolled_k [data_width=16 n_iter=16 angle_guard=2 frac_guard=1 rounding=round k=3] luts_plus_ffs=515, accuracy_bits=12.5, luts=416, ffs=99, throughput_msps=7.97, max_abs_err=0.000177 (2^-12.47), power_index=0.174
- unrolled_k [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=round k=3] luts_plus_ffs=537, accuracy_bits=12.9, luts=436, ffs=101, throughput_msps=7.97, max_abs_err=0.000134 (2^-12.86), power_index=0.182
Front coverage: luts_plus_ffs 260..537 (HV reference 1500); accuracy_bits 10.6..12.9 (HV reference 10); data_width on the front 15..16 (registry 8..28).

Per family:
- iterative: 40 evals, 34 feasible; max throughput seen 13.2 MSPS; best accuracy 12.26 bits; best feasible luts_plus_ffs=260; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 80 evals, 52 feasible; max throughput seen 13.5 MSPS; best accuracy 12.86 bits; best feasible luts_plus_ffs=375; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, k 2..6
- pipelined: 40 evals, 23 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1321; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 80 evals, 55 feasible; max throughput seen 178 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=826; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 160 evaluations*)
- `iterative` (115 evals): data_width=14..28, n_iter=12..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of iterative (5 front designs; box front_anchored)
- `unrolled_k` (45 evals): data_width=15..28, n_iter=14..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, k=2..8. *Why:* code: map the front of unrolled_k (2 front designs; box front_anchored)

**Result (code):** 160 evaluations this round, 400 total; 315 feasible; hypervolume 1.506e+04 (+351.4%).

**No LLM call** (code's front-mapping round): The feasible Pareto front is well-mapped and satisfies all constraints. The minimum area design (iterative, 260 LUTs+FFs) meets the throughput constraint (11.7 MSPS >= 1 MSPS) and accuracy constraint (10.6 bits >= 10 bits). The front covers the trade-off space effectively, with area ranging from 260 to 537 and accuracy from 10.6 to 12.9 bits. Since this is the final round and the front is stable with no significant improvements expected from further exploration, stopping is the appropriate decision.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.506e+04 (gain this round: +351.4%).
Feasible designs: 315 of 400 evaluations (264 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 282
- max_abs_err <= 0.000976562: 21% violate; best seen 4.18e-08 (2^-24.51)

Pareto front (feasible, 22 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=14 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=260, accuracy_bits=10.6, luts=168, ffs=92, throughput_msps=11.7, max_abs_err=0.000632 (2^-10.63), power_index=0.166
- iterative [data_width=16 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=280, accuracy_bits=11.6, luts=181, ffs=99, throughput_msps=11, max_abs_err=0.000323 (2^-11.60), power_index=0.19
- iterative [data_width=18 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=309, accuracy_bits=13.2, luts=202, ffs=107, throughput_msps=10.2, max_abs_err=0.000108 (2^-13.18), power_index=0.221
- iterative [data_width=18 n_iter=16 angle_guard=2 frac_guard=3 rounding=trunc] luts_plus_ffs=339, accuracy_bits=14, luts=225, ffs=114, throughput_msps=10.2, max_abs_err=5.94e-05 (2^-14.04), power_index=0.243
- iterative [data_width=21 n_iter=23 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=404, accuracy_bits=15.8, luts=280, ffs=124, throughput_msps=6.11, max_abs_err=1.69e-05 (2^-15.85), power_index=0.395
- iterative [data_width=23 n_iter=28 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=452, accuracy_bits=17.6, luts=318, ffs=134, throughput_msps=5.03, max_abs_err=5.1e-06 (2^-17.58), power_index=0.528
- iterative [data_width=25 n_iter=20 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=484, accuracy_bits=18.7, luts=340, ffs=144, throughput_msps=6.66, max_abs_err=2.41e-06 (2^-18.66), power_index=0.419
- iterative [data_width=27 n_iter=29 angle_guard=1 frac_guard=0 rounding=trunc] luts_plus_ffs=534, accuracy_bits=21.1, luts=380, ffs=153, throughput_msps=4.79, max_abs_err=4.41e-07 (2^-21.11), power_index=0.642
- iterative [data_width=28 n_iter=27 angle_guard=1 frac_guard=0 rounding=round] luts_plus_ffs=571, accuracy_bits=22.9, luts=413, ffs=158, throughput_msps=5.11, max_abs_err=1.32e-07 (2^-22.85), power_index=0.645
- unrolled_k [data_width=28 n_iter=26 angle_guard=4 frac_guard=4 rounding=round k=6] luts_plus_ffs=1347, accuracy_bits=24.5, luts=1179, ffs=167, throughput_msps=4.15, max_abs_err=4.18e-08 (2^-24.51), power_index=0.405
Front coverage: luts_plus_ffs 260..1347 (HV reference 1500); accuracy_bits 10.6..24.5 (HV reference 10); data_width on the front 15..28 (registry 8..28).

Per family:
- iterative: 155 evals, 140 feasible; max throughput seen 13.2 MSPS; best accuracy 24.15 bits; best feasible luts_plus_ffs=260; feasible ranges: data_width 14..28, n_iter 12..30, angle_guard -2..4, frac_guard 0..4
- unrolled_k: 125 evals, 97 feasible; max throughput seen 13.5 MSPS; best accuracy 24.51 bits; best feasible luts_plus_ffs=375; feasible ranges: data_width 14..28, n_iter 12..27, angle_guard -2..4, frac_guard 0..4, k 2..8
- pipelined: 40 evals, 23 feasible; max throughput seen 282 MSPS; best accuracy 11.65 bits; best feasible luts_plus_ffs=1321; feasible ranges: data_width 15..16, n_iter 12..14, angle_guard -1..2, frac_guard 0..2
- pipelined_m: 80 evals, 55 feasible; max throughput seen 178 MSPS; best accuracy 12.48 bits; best feasible luts_plus_ffs=826; feasible ranges: data_width 14..16, n_iter 12..16, angle_guard -1..2, frac_guard 0..2, m 2..4
```
</details>

## LLM usage
- calls: 4 (failed/unparsed attempts: 0)
- tokens: 9821 in, 3082 out
- provider-reported cost: $0.0087
- full prompts and replies: `llm_trace.jsonl`

