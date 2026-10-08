# DSE run: low_area_control

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: deepseek/deepseek-v4.1-flash.  
**Evaluations:** 300 of 400 budgeted, over 3 round(s).  
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

## Pareto front (16 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `iterative:data_width=15,n_iter=12,angle_guard=2,frac_guard=0,rounding=round` | 161 | 93 | 13.2 | 15 | 0.143 | 0.000835 (2^-10.23) | 10.23 |
| 1 | `iterative:data_width=15,n_iter=12,angle_guard=1,frac_guard=1,rounding=trunc` | 161 | 94 | 13.2 | 15 | 0.144 | 0.000833 (2^-10.23) | 10.23 |
| 2 | `iterative:data_width=14,n_iter=14,angle_guard=2,frac_guard=2,rounding=trunc` | 170 | 92 | 11.7 | 17 | 0.167 | 0.000716 (2^-10.45) | 10.45 |
| 3 | `iterative:data_width=14,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 170 | 92 | 10.4 | 19 | 0.187 | 0.000716 (2^-10.45) | 10.45 |
| 4 | `iterative:data_width=15,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 10.4 | 19 | 0.188 | 0.000599 (2^-10.71) | 10.71 |
| 5 | `iterative:data_width=15,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 170 | 93 | 11.0 | 18 | 0.178 | 0.000599 (2^-10.71) | 10.71 |
| 6 | `iterative:data_width=15,n_iter=15,angle_guard=1,frac_guard=1,rounding=trunc` | 170 | 94 | 11.0 | 18 | 0.179 | 0.000567 (2^-10.78) | 10.78 |
| 7 | `iterative:data_width=16,n_iter=14,angle_guard=0,frac_guard=0,rounding=round` | 178 | 96 | 11.7 | 17 | 0.175 | 0.0004 (2^-11.29) | 11.29 |
| 8 | `iterative:data_width=16,n_iter=15,angle_guard=0,frac_guard=1,rounding=trunc` | 180 | 98 | 11.0 | 18 | 0.188 | 0.000395 (2^-11.31) | 11.31 |
| 9 | `iterative:data_width=15,n_iter=15,angle_guard=2,frac_guard=2,rounding=trunc` | 181 | 97 | 11.0 | 18 | 0.188 | 0.000344 (2^-11.51) | 11.51 |
| 10 | `iterative:data_width=16,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 181 | 98 | 11.7 | 17 | 0.178 | 0.000294 (2^-11.73) | 11.73 |
| 11 | `iterative:data_width=16,n_iter=16,angle_guard=1,frac_guard=2,rounding=trunc` | 191 | 101 | 10.4 | 19 | 0.209 | 0.000237 (2^-12.04) | 12.04 |
| 12 | `iterative:data_width=16,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 193 | 102 | 10.4 | 19 | 0.211 | 0.000219 (2^-12.16) | 12.16 |
| 13 | `iterative:data_width=17,n_iter=14,angle_guard=2,frac_guard=0,rounding=round` | 193 | 103 | 11.4 | 17 | 0.189 | 0.000194 (2^-12.33) | 12.33 |
| 14 | `iterative:data_width=17,n_iter=16,angle_guard=2,frac_guard=2,rounding=trunc` | 204 | 107 | 10.2 | 19 | 0.222 | 0.000116 (2^-13.08) | 13.08 |
| 15 | `iterative:data_width=17,n_iter=19,angle_guard=2,frac_guard=1,rounding=round` | 262 | 106 | 7.2 | 22 | 0.304 | 9.28e-05 (2^-13.40) | 13.40 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The spec requires max_abs_err <= 2^-10 and throughput >= 1 MSPS, with area (LUTs+FFs) as the primary objective. Accuracy depends only on data_width, n_iter, angle_guard, frac_guard and rounding, so all families compute identical bits. The iterative family shares one datapath and therefore should be the smallest-area family for any accuracy; its throughput is Fmax/(N+3), which for N<=16 and Fmax~100 MHz is still >1 MSPS, so the throughput constraint is not binding. unrolled_k and pipelined_m replicate datapath resources and are expected to be dominated, but a small budget is allocated to confirm this and to catch any unexpected cost-model non-linearity. The parameter ranges focus on the constraint boundary: W=12..16 (output LSB 2^-10 to 2^-14), N=8..16 (angle error ~2^-N), angle_guard -2..2, frac_guard 0..2, and both rounding modes. This should reveal the minimal-area feasible design and the area/accuracy trade-off.*)
- `iterative` (70 evals): data_width=12..16, n_iter=8..16, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round. *Why:* Primary family. It shares a single datapath, so for any given accuracy it should have the lowest LUT+FF count. Its throughput is Fmax/(N+3); with N<=16 and Fmax around 100 MHz this is well above the 1 MSPS constraint, so throughput is not binding. The ranges bracket the accuracy constraint: W=12 gives LSB=2^-10, N=8..16 covers the angle-approximation error ~2^-N, and angle_guard/frac_guard explore the internal-precision vs area trade-off.
- `unrolled_k` (20 evals): data_width=12..16, n_iter=8..16, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, k=2..4. *Why:* Included to verify it is dominated by iterative. It replicates k micro-rotation datapaths, so area should be larger for the same accuracy. k=2..4 keeps the replication modest while testing whether any resource-sharing or scheduling effect could make it competitive. Small budget because the cost model strongly suggests it will not beat iterative on area.
- `pipelined_m` (10 evals): data_width=12..16, n_iter=8..16, angle_guard=-2..2, frac_guard=0..2, rounding=trunc|round, m=4..8. *Why:* Included as a sanity check. It still contains N micro-rotation units (just grouped into ceil(N/m) pipeline stages), so its area is expected to be much larger than iterative. m=4..8 reduces the number of pipeline registers, but the replicated arithmetic dominates. Very small budget to confirm it is dominated.

**Result (code):** 100 evaluations this round, 100 total; 31 feasible; hypervolume 2947 (n/a).

**LLM decision:** `add_family` — Round 1 covered iterative, unrolled_k and pipelined_m but left `pipelined` unexplored, so the registry is not yet fully mapped. The feasible front is entirely iterative (luts_plus_ffs 253-324, accuracy 10.2-12.4 bits), and unrolled_k/pipelined_m only produced feasible points at 508 and 840 luts_plus_ffs respectively - both far worse on the min-area objective. Since the spec selects on min luts_plus_ffs and the throughput constraint (>=1 MSPS) is already met with huge margin by every feasible design (best seen 97.8 MSPS, iterative front at 11-13 MSPS), the only reason to spend budget on `pipelined` is to confirm it cannot beat the iterative front on area, while simultaneously refining the iterative region that actually defines the front. Accuracy headroom exists (best feasible 2^-12.44 vs the 2^-10 constraint), so pushing n_iter/data_width slightly up in iterative may extend the accuracy end of the front at low area cost.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 2947 (gain this round: n/a (first round)).
Feasible designs: 31 of 100 evaluations (24 unique).
Families explored so far: iterative, unrolled_k, pipelined_m. Not yet explored: pipelined.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 97.8
- max_abs_err <= 0.000976562: 69% violate; best seen 0.00018 (2^-12.44)

Pareto front (feasible, 6 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=255, accuracy_bits=10.2, luts=161, ffs=94, throughput_msps=13.2, max_abs_err=0.000833 (2^-10.23), power_index=0.144
- iterative [data_width=15 n_iter=15 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=264, accuracy_bits=10.8, luts=170, ffs=94, throughput_msps=11, max_abs_err=0.000567 (2^-10.78), power_index=0.179
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=278, accuracy_bits=11.3, luts=180, ffs=98, throughput_msps=11, max_abs_err=0.000395 (2^-11.31), power_index=0.188
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=1 rounding=round] luts_plus_ffs=319, accuracy_bits=11.5, luts=221, ffs=98, throughput_msps=11, max_abs_err=0.000355 (2^-11.46), power_index=0.216
- iterative [data_width=16 n_iter=15 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=324, accuracy_bits=12.4, luts=225, ffs=100, throughput_msps=11, max_abs_err=0.00018 (2^-12.44), power_index=0.22

Per family:
- iterative: 70 evals, 28 feasible; max throughput seen 18 MSPS; best accuracy 12.44 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..16, n_iter 12..15, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 20 evals, 2 feasible; max throughput seen 14 MSPS; best accuracy 11.45 bits; best feasible luts_plus_ffs=508; feasible ranges: data_width 16..16, n_iter 13..13, angle_guard 1..1, frac_guard 1..2, k 4..4
- pipelined_m: 10 evals, 1 feasible; max throughput seen 97.8 MSPS; best accuracy 10.25 bits; best feasible luts_plus_ffs=840; feasible ranges: data_width 15..15, n_iter 13..13, angle_guard 0..0, frac_guard 2..2, m 7..7
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Keep the throughput constraint slack (all feasible designs are >=11 MSPS, far above 1 MSPS) and spend the round on (a) tightening the iterative region that owns the front and (b) sampling the one unexplored family. No widening of unrolled_k/pipelined_m is warranted: their best feasible luts_plus_ffs (508, 840) are ~2-3x the iterative front, so they cannot win the min-area selection.*)
- `iterative` (60 evals): data_width=14..17, n_iter=12..20, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* This is the only family currently on the front; refine around data_width 14-16 / n_iter 12-15 where feasible points cluster, extending n_iter to 20 to test whether accuracy can rise without a large area penalty.
- `pipelined` (40 evals): data_width=14..17, n_iter=12..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* Unexplored family; one registered stage per micro-rotation means high FF count, so it is expected to lose on luts_plus_ffs, but it must be sampled to close the registry and confirm the front is not missing a low-area pipelined point.

**Result (code):** 100 evaluations this round, 200 total; 118 feasible; hypervolume 4102 (+39.2%).

**LLM decision:** `refine` — All families explored (registry exhausted, so no add_family). Objective/selection is min area; throughput constraint is trivial (winner 13.2 MSPS vs >=1). iterative dominates area, so refine its low-area/accuracy boundary. eps 0.01 not met, HV still climbing (+39.2%), so not stopping.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 4102 (gain this round: +39.2%).
Feasible designs: 118 of 200 evaluations (93 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 41% violate; best seen 9.28e-05 (2^-13.40)

Pareto front (feasible, 14 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=15 n_iter=12 angle_guard=1 frac_guard=1 rounding=trunc] luts_plus_ffs=255, accuracy_bits=10.2, luts=161, ffs=94, throughput_msps=13.2, max_abs_err=0.000833 (2^-10.23), power_index=0.144
- iterative [data_width=14 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=262, accuracy_bits=10.4, luts=170, ffs=92, throughput_msps=10.4, max_abs_err=0.000716 (2^-10.45), power_index=0.187
- iterative [data_width=15 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=10.4, max_abs_err=0.000599 (2^-10.71), power_index=0.188
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=273, accuracy_bits=11.3, luts=178, ffs=96, throughput_msps=11.7, max_abs_err=0.0004 (2^-11.29), power_index=0.175
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=278, accuracy_bits=11.3, luts=180, ffs=98, throughput_msps=11, max_abs_err=0.000395 (2^-11.31), power_index=0.188
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.7, luts=181, ffs=98, throughput_msps=11.7, max_abs_err=0.000294 (2^-11.73), power_index=0.178
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=295, accuracy_bits=12.2, luts=193, ffs=102, throughput_msps=10.4, max_abs_err=0.000219 (2^-12.16), power_index=0.211
- iterative [data_width=17 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=311, accuracy_bits=13.1, luts=204, ffs=107, throughput_msps=10.2, max_abs_err=0.000116 (2^-13.08), power_index=0.222
- iterative [data_width=17 n_iter=19 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=368, accuracy_bits=13.4, luts=262, ffs=106, throughput_msps=7.23, max_abs_err=9.28e-05 (2^-13.40), power_index=0.304

Per family:
- iterative: 130 evals, 79 feasible; max throughput seen 18 MSPS; best accuracy 13.40 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..17, n_iter 12..20, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 20 evals, 2 feasible; max throughput seen 14 MSPS; best accuracy 11.45 bits; best feasible luts_plus_ffs=508; feasible ranges: data_width 16..16, n_iter 13..13, angle_guard 1..1, frac_guard 1..2, k 4..4
- pipelined: 40 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 12.80 bits; best feasible luts_plus_ffs=1473; feasible ranges: data_width 14..17, n_iter 12..18, angle_guard -1..2, frac_guard 1..2
- pipelined_m: 10 evals, 1 feasible; max throughput seen 97.8 MSPS; best accuracy 10.25 bits; best feasible luts_plus_ffs=840; feasible ranges: data_width 15..15, n_iter 13..13, angle_guard 0..0, frac_guard 2..2, m 7..7
```
</details>

### Round 3

**Plan explored** (LLM rationale: *All four families are already explored, so add_family is unavailable. The objective pair is (min luts_plus_ffs, max accuracy_bits) with selection = min luts_plus_ffs, and every feasible family clears the >=1 MSPS throughput constraint (winner already at 13.2 MSPS, best seen 273), so throughput is not worth budget. Area evidence is decisive: iterative's cheapest feasible design is 253 LUTs+FFs vs 508 (unrolled_k), 840 (pipelined_m) and 1473 (pipelined), and the pipelined families' best accuracy (12.80/10.25 bits) is already dominated by iterative (13.40 bits at 368). So the front is an iterative-only problem and the budget should be spent there. The accuracy constraint is the binding one (41% of evals violate; feasible data_width only 14..17) and the current min-area winner sits right on the edge (2^-10.23 vs <=2^-10), i.e. the true minimum-area feasible corner is not yet resolved - refining data_width 12..16 x n_iter 10..18 x guard range is the highest-value move and directly serves the min-luts_plus_ffs selection rule. The +39.2% HV gain with eps 0.01 unreached confirms refinement is still productive, so stop is premature.*)
- `iterative` (88 evals): data_width=12..16, n_iter=10..18, angle_guard=-1..2, frac_guard=0..2, rounding=trunc|round. *Why:* pin the true minimum-area feasible point
- `pipelined_m` (12 evals): data_width=14..16, n_iter=12..18, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round, m=4..8. *Why:* low-cadence check that no mid-area family can undercut iterative on luts_plus_ffs
- clamped by code: dropped duplicate family iterative

**Result (code):** 100 evaluations this round, 300 total; 184 feasible; hypervolume 4103 (+0.0%).

**LLM decision:** `refine` — All four families are already explored and the round-3 hypervolume gain is +0.0%, so the front is saturated — no new family or widening will help. The spec's selection rule is min luts_plus_ffs, and the current winner is iterative [W=15, N=12, ag=2, fg=0, round] at luts_plus_ffs=253 (10.2 bits, 13.2 MSPS), comfortably inside both constraints (throughput >= 1, err <= 2^-10). The only remaining upside is squeezing the area corner: the front shows W=14 costs 262 and W=15 costs 253, so area is dominated by data_width, and the feasible iterative range (W 14..17) suggests W=13 was never properly probed near the accuracy cliff. Spend the last ~100 evals densely around the low-area corner to confirm 253 is the true minimum (or find a smaller one) before stopping.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.02% < epsilon 1.00%
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 300 of 400.
Hypervolume of the feasible front: 4103 (gain this round: +0.0%).
Feasible designs: 184 of 300 evaluations (136 unique).
Families explored so far: iterative, unrolled_k, pipelined, pipelined_m. Not yet explored: none.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 1: 0% violate; best seen 273
- max_abs_err <= 0.000976562: 39% violate; best seen 9.28e-05 (2^-13.40)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts_plus_ffs, max accuracy_bits
- iterative [data_width=15 n_iter=12 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=253, accuracy_bits=10.2, luts=161, ffs=93, throughput_msps=13.2, max_abs_err=0.000835 (2^-10.23), power_index=0.143
- iterative [data_width=14 n_iter=14 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=262, accuracy_bits=10.4, luts=170, ffs=92, throughput_msps=11.7, max_abs_err=0.000716 (2^-10.45), power_index=0.167
- iterative [data_width=14 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=262, accuracy_bits=10.4, luts=170, ffs=92, throughput_msps=10.4, max_abs_err=0.000716 (2^-10.45), power_index=0.187
- iterative [data_width=15 n_iter=15 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=263, accuracy_bits=10.7, luts=170, ffs=93, throughput_msps=11, max_abs_err=0.000599 (2^-10.71), power_index=0.178
- iterative [data_width=16 n_iter=14 angle_guard=0 frac_guard=0 rounding=round] luts_plus_ffs=273, accuracy_bits=11.3, luts=178, ffs=96, throughput_msps=11.7, max_abs_err=0.0004 (2^-11.29), power_index=0.175
- iterative [data_width=16 n_iter=15 angle_guard=0 frac_guard=1 rounding=trunc] luts_plus_ffs=278, accuracy_bits=11.3, luts=180, ffs=98, throughput_msps=11, max_abs_err=0.000395 (2^-11.31), power_index=0.188
- iterative [data_width=16 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=279, accuracy_bits=11.7, luts=181, ffs=98, throughput_msps=11.7, max_abs_err=0.000294 (2^-11.73), power_index=0.178
- iterative [data_width=16 n_iter=16 angle_guard=2 frac_guard=2 rounding=trunc] luts_plus_ffs=295, accuracy_bits=12.2, luts=193, ffs=102, throughput_msps=10.4, max_abs_err=0.000219 (2^-12.16), power_index=0.211
- iterative [data_width=17 n_iter=14 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=296, accuracy_bits=12.3, luts=193, ffs=103, throughput_msps=11.4, max_abs_err=0.000194 (2^-12.33), power_index=0.189
- iterative [data_width=17 n_iter=19 angle_guard=2 frac_guard=1 rounding=round] luts_plus_ffs=368, accuracy_bits=13.4, luts=262, ffs=106, throughput_msps=7.23, max_abs_err=9.28e-05 (2^-13.40), power_index=0.304

Per family:
- iterative: 218 evals, 136 feasible; max throughput seen 18 MSPS; best accuracy 13.40 bits; best feasible luts_plus_ffs=253; feasible ranges: data_width 14..17, n_iter 12..20, angle_guard -1..2, frac_guard 0..2
- unrolled_k: 20 evals, 2 feasible; max throughput seen 14 MSPS; best accuracy 11.45 bits; best feasible luts_plus_ffs=508; feasible ranges: data_width 16..16, n_iter 13..13, angle_guard 1..1, frac_guard 1..2, k 4..4
- pipelined: 40 evals, 36 feasible; max throughput seen 273 MSPS; best accuracy 12.80 bits; best feasible luts_plus_ffs=1473; feasible ranges: data_width 14..17, n_iter 12..18, angle_guard -1..2, frac_guard 1..2
- pipelined_m: 22 evals, 10 feasible; max throughput seen 97.8 MSPS; best accuracy 12.86 bits; best feasible luts_plus_ffs=836; feasible ranges: data_width 15..16, n_iter 12..18, angle_guard -1..4, frac_guard 0..3, m 5..7
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 1)
- tokens: 9432 in, 16150 out
- provider-reported cost: $0.0196
- full prompts and replies: `llm_trace.jsonl`

