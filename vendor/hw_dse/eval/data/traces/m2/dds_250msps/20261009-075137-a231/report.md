# DSE run: dds_250msps

**Verdict:** converged: hypervolume gain fell below epsilon.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 3 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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
`pipelined:data_width=18,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts)

| metric | value | provenance |
|---|---|---|
| luts | 954 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 985 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 273 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 273 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 18 | exact: schedule |
| latency_ns | 66 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 18.2 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 0.000121 (2^-13.02) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.9 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.65e-05 (2^-15.20) | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.74 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 13 | exact: bit-accurate model, dense (109112 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (31 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=18,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 954 | 985 | 272.9 | 18 | 18.2 | 0.000121 (2^-13.02) | 13.02 |
| 1 | `pipelined:data_width=19,n_iter=15,angle_guard=2,frac_guard=0,rounding=round` | 964 | 999 | 264.5 | 17 | 18.5 | 8.33e-05 (2^-13.55) | 13.55 |
| 2 | `pipelined:data_width=20,n_iter=15,angle_guard=0,frac_guard=0,rounding=round` | 979 | 1014 | 264.5 | 17 | 18.7 | 8.24e-05 (2^-13.57) | 13.57 |
| 3 | `pipelined:data_width=20,n_iter=15,angle_guard=1,frac_guard=0,rounding=round` | 994 | 1029 | 264.5 | 17 | 19 | 7.63e-05 (2^-13.68) | 13.68 |
| 4 | `pipelined:data_width=19,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1017 | 1049 | 264.5 | 18 | 19.4 | 5.84e-05 (2^-14.06) | 14.06 |
| 5 | `pipelined:data_width=20,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1048 | 1082 | 264.5 | 18 | 20 | 5.27e-05 (2^-14.21) | 14.21 |
| 6 | `pipelined:data_width=20,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1064 | 1098 | 264.5 | 18 | 20.3 | 4.64e-05 (2^-14.39) | 14.39 |
| 7 | `pipelined:data_width=20,n_iter=16,angle_guard=2,frac_guard=0,rounding=round` | 1080 | 1114 | 264.5 | 18 | 20.6 | 4.12e-05 (2^-14.57) | 14.57 |
| 8 | `pipelined:data_width=21,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1112 | 1146 | 264.5 | 18 | 21.2 | 3.91e-05 (2^-14.64) | 14.64 |
| 9 | `pipelined:data_width=22,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1143 | 1178 | 264.5 | 18 | 21.8 | 3.59e-05 (2^-14.77) | 14.77 |
| 10 | `pipelined:data_width=22,n_iter=16,angle_guard=1,frac_guard=0,rounding=round` | 1159 | 1195 | 256.5 | 18 | 22.1 | 3.42e-05 (2^-14.84) | 14.84 |
| 11 | `pipelined:data_width=23,n_iter=16,angle_guard=0,frac_guard=0,rounding=round` | 1191 | 1227 | 256.5 | 18 | 22.7 | 3.23e-05 (2^-14.92) | 14.92 |
| 12 | `pipelined:data_width=20,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 1205 | 1235 | 264.5 | 20 | 22.9 | 2.9e-05 (2^-15.07) | 15.07 |
| 13 | `pipelined:data_width=20,n_iter=17,angle_guard=1,frac_guard=1,rounding=round` | 1211 | 1199 | 264.5 | 19 | 22.7 | 2.58e-05 (2^-15.24) | 15.24 |
| 14 | `pipelined:data_width=22,n_iter=17,angle_guard=0,frac_guard=0,rounding=round` | 1219 | 1252 | 264.5 | 19 | 23.2 | 2.12e-05 (2^-15.52) | 15.52 |
| 15 | `pipelined:data_width=22,n_iter=17,angle_guard=1,frac_guard=0,rounding=round` | 1236 | 1269 | 256.5 | 19 | 23.6 | 1.95e-05 (2^-15.64) | 15.64 |
| 16 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=0,rounding=round` | 1259 | 1289 | 264.5 | 20 | 24 | 1.68e-05 (2^-15.87) | 15.87 |
| 17 | `pipelined:data_width=22,n_iter=18,angle_guard=0,frac_guard=0,rounding=round` | 1295 | 1326 | 264.5 | 20 | 24.6 | 1.45e-05 (2^-16.07) | 16.07 |
| 18 | `pipelined:data_width=21,n_iter=18,angle_guard=1,frac_guard=1,rounding=round` | 1339 | 1324 | 264.5 | 20 | 25 | 1.44e-05 (2^-16.08) | 16.08 |
| 19 | `pipelined:data_width=21,n_iter=19,angle_guard=2,frac_guard=0,rounding=round` | 1352 | 1380 | 256.5 | 21 | 25.7 | 1.21e-05 (2^-16.33) | 16.33 |
| 20 | `pipelined:data_width=22,n_iter=19,angle_guard=0,frac_guard=0,rounding=round` | 1371 | 1399 | 264.5 | 21 | 26.1 | 1.07e-05 (2^-16.51) | 16.51 |
| 21 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=0,rounding=round` | 1390 | 1419 | 256.5 | 21 | 26.4 | 8.35e-06 (2^-16.87) | 16.87 |
| 22 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=1,rounding=round` | 1474 | 1455 | 256.5 | 21 | 27.5 | 7.47e-06 (2^-17.03) | 17.03 |
| 23 | `pipelined:data_width=22,n_iter=19,angle_guard=1,frac_guard=2,rounding=round` | 1512 | 1489 | 256.5 | 21 | 28.2 | 6.44e-06 (2^-17.24) | 17.24 |
| 24 | `pipelined:data_width=23,n_iter=19,angle_guard=0,frac_guard=1,rounding=round` | 1514 | 1493 | 256.5 | 21 | 28.3 | 6.39e-06 (2^-17.25) | 17.25 |
| 25 | `pipelined:data_width=22,n_iter=19,angle_guard=2,frac_guard=2,rounding=round` | 1531 | 1508 | 256.5 | 21 | 28.6 | 6.07e-06 (2^-17.33) | 17.33 |
| 26 | `pipelined:data_width=26,n_iter=19,angle_guard=-1,frac_guard=0,rounding=round` | 1580 | 1610 | 256.5 | 21 | 30 | 4.36e-06 (2^-17.81) | 17.81 |
| 27 | `pipelined:data_width=26,n_iter=20,angle_guard=0,frac_guard=0,rounding=round` | 1687 | 1715 | 256.5 | 22 | 32 | 2.29e-06 (2^-18.73) | 18.73 |
| 28 | `pipelined:data_width=24,n_iter=22,angle_guard=0,frac_guard=1,rounding=round` | 1826 | 1796 | 256.5 | 24 | 34.1 | 2.24e-06 (2^-18.77) | 18.77 |
| 29 | `pipelined:data_width=24,n_iter=26,angle_guard=1,frac_guard=1,rounding=trunc` | 2139 | 2147 | 256.5 | 28 | 40.3 | 1.78e-06 (2^-19.10) | 19.10 |
| 30 | `pipelined:data_width=24,n_iter=29,angle_guard=2,frac_guard=1,rounding=round` | 2475 | 2426 | 256.5 | 31 | 46.1 | 1.08e-06 (2^-19.82) | 19.82 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=250 MSPS) requires 1 result/cycle, which eliminates iterative and unrolled_k families. Only pipelined and pipelined_m can satisfy this. The accuracy constraint (<=2^-13) requires sufficient n_iter and data_width. We focus on the pipelined families with data_width 16-24 and n_iter 14-20 to cover the accuracy-feasible region. Rounding is fixed to 'round' since truncation adds error and we need to meet the tight accuracy bound. The goal is to find the minimum-LUT design on the Pareto front that meets both constraints.*)
- `pipelined` (50 evals): data_width=16..24, n_iter=14..20, angle_guard=0..2, frac_guard=0..2, rounding=round. *Why:* The only family that can meet the >=250 MSPS throughput constraint (1 result/cycle). Fmax must be >=250MHz, so we need to find the minimum LUT configuration that maintains this speed while achieving <=2^-13 error.
- `pipelined_m` (50 evals): data_width=16..24, n_iter=14..20, angle_guard=0..2, frac_guard=0..2, rounding=round, m=2..4. *Why:* Also 1 result/cycle, so meets throughput. Registering every m stages reduces FF count vs fully pipelined, potentially allowing higher Fmax or lower area. m=2..4 balances latency vs area.

**Result (code):** 100 evaluations this round, 100 total; 37 feasible; hypervolume 1.293e+04 (n/a).

**LLM decision:** `refine` — The `pipelined` family is the only one currently meeting the throughput constraint (>= 250 MSPS), with a best observed throughput of 273 MSPS. The `pipelined_m` family failed completely (max 171 MSPS), likely due to the added latency/area overhead reducing Fmax or the specific parameter combinations explored not being optimal for high throughput. The current Pareto front for `pipelined` shows a clear trade-off: the lowest LUT count (979) is achieved at `data_width=20, n_iter=15`, which just meets the accuracy constraint (13.6 bits > 13 bits). To maximize hypervolume and find the true minimum LUT design, we should focus the search on the `pipelined` family in the region where throughput is guaranteed (data_width <= 22 seems to maintain >250 MSPS, while 24 drops to 257 which is still feasible but close) and accuracy is sufficient. We will narrow the ranges to focus on `data_width` 18-22, `n_iter` 14-18, and keep guards low to minimize area, as higher guards add LUTs without significantly improving accuracy beyond the requirement for the low-LUT corner.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 1.293e+04 (gain this round: n/a (first round)).
Feasible designs: 37 of 100 evaluations (31 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 50% violate; best seen 273
- max_abs_err <= 0.00012207: 27% violate; best seen 3.6e-06 (2^-18.08)

Pareto front (feasible, 16 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=20 n_iter=15 angle_guard=0 frac_guard=0 rounding=round] luts=979, accuracy_bits=13.6, ffs=1014, throughput_msps=264, max_abs_err=8.24e-05 (2^-13.57), power_index=18.7
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1080, accuracy_bits=14.6, ffs=1114, throughput_msps=264, max_abs_err=4.12e-05 (2^-14.57), power_index=20.6
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=1 rounding=round] luts=1154, accuracy_bits=14.6, ffs=1144, throughput_msps=264, max_abs_err=3.91e-05 (2^-14.64), power_index=21.6
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] luts=1211, accuracy_bits=15.2, ffs=1199, throughput_msps=264, max_abs_err=2.58e-05 (2^-15.24), power_index=22.7
- pipelined [data_width=22 n_iter=17 angle_guard=1 frac_guard=2 rounding=round] luts=1350, accuracy_bits=15.8, ffs=1332, throughput_msps=257, max_abs_err=1.73e-05 (2^-15.82), power_index=25.2
- pipelined [data_width=24 n_iter=17 angle_guard=2 frac_guard=0 rounding=round] luts=1354, accuracy_bits=15.9, ffs=1389, throughput_msps=257, max_abs_err=1.59e-05 (2^-15.94), power_index=25.8
- pipelined [data_width=22 n_iter=19 angle_guard=0 frac_guard=0 rounding=round] luts=1371, accuracy_bits=16.5, ffs=1399, throughput_msps=264, max_abs_err=1.07e-05 (2^-16.51), power_index=26.1
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=1 rounding=round] luts=1474, accuracy_bits=17, ffs=1455, throughput_msps=257, max_abs_err=7.47e-06 (2^-17.03), power_index=27.5
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=2 rounding=round] luts=1512, accuracy_bits=17.2, ffs=1489, throughput_msps=257, max_abs_err=6.44e-06 (2^-17.24), power_index=28.2
- pipelined [data_width=24 n_iter=19 angle_guard=1 frac_guard=1 rounding=round] luts=1592, accuracy_bits=17.7, ffs=1570, throughput_msps=257, max_abs_err=4.63e-06 (2^-17.72), power_index=29.7
Front coverage: luts 979..1592 (HV reference 4000); accuracy_bits 13.6..17.7 (HV reference 13); data_width on the front 20..24 (registry 8..28).

Per family:
- pipelined: 50 evals, 37 feasible; max throughput seen 273 MSPS; best accuracy 17.72 bits; best feasible luts=979; feasible ranges: data_width 17..24, n_iter 15..19, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 18.08 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Narrowing to the most promising region of the only feasible family to maximize hypervolume gain within the remaining budget.*)
- `pipelined` (100 evals): data_width=18..22, n_iter=14..18, angle_guard=0..1, frac_guard=0..1, rounding=round. *Why:* Focus on the feasible region of the pipelined family to refine the Pareto front, specifically targeting the low-LUT corner while ensuring throughput and accuracy constraints are met.

**Result (code):** 100 evaluations this round, 200 total; 130 feasible; hypervolume 1.305e+04 (+0.9%).

**LLM decision:** `refine` — The current Pareto front is dominated by the `pipelined` family, which is the only one meeting the throughput constraint (>= 250 MSPS). The `pipelined_m` family failed to produce any feasible designs (max throughput 171 MSPS), likely due to the latency/throughput trade-off or specific parameter constraints in the cost model. The `iterative` and `unrolled_k` families are not yet explored, but given that `pipelined` already achieves the minimum LUTs (954) and the required throughput, and considering the strict throughput constraint, it is highly probable that `iterative` (1 result per N+3 cycles) and `unrolled_k` (1 result per ceil(N/k)+3 cycles) will struggle to meet 250 MSPS without excessive resource usage or clock speed requirements that might not be met by the cost model. The current front covers LUTs from 954 to 1592 and accuracy from 13 to 17.7 bits. The selection rule is 'min luts', and the best design is at 954 LUTs with 13.02 bits accuracy. To improve the hypervolume and potentially find a design with slightly better accuracy at a similar LUT cost, or to confirm the lower bound of LUTs, we should refine the search around the current best region. Specifically, we should focus on `pipelined` with `data_width` 18-20, `n_iter` 15-17, `angle_guard` 0-1, and `frac_guard` 0-1. This region has shown the best LUT efficiency. We will not add new families yet as `pipelined` is clearly the most promising for this specific throughput-constrained spec.
- **rule applied by code:** 'refine' overridden to stop: HV gain 0.88% < epsilon 1.00%
- **rule applied by code:** code: before stopping (converged), one front-mapping round with the remaining 200 evaluations
- effective decision: `stop`

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 1.305e+04 (gain this round: +0.9%).
Feasible designs: 130 of 200 evaluations (73 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 25% violate; best seen 273
- max_abs_err <= 0.00012207: 17% violate; best seen 3.6e-06 (2^-18.08)

Pareto front (feasible, 26 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=954, accuracy_bits=13, ffs=985, throughput_msps=273, max_abs_err=0.000121 (2^-13.02), power_index=18.2
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=20 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1064, accuracy_bits=14.4, ffs=1098, throughput_msps=264, max_abs_err=4.64e-05 (2^-14.39), power_index=20.3
- pipelined [data_width=21 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1112, accuracy_bits=14.6, ffs=1146, throughput_msps=264, max_abs_err=3.91e-05 (2^-14.64), power_index=21.2
- pipelined [data_width=23 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=1191, accuracy_bits=14.9, ffs=1227, throughput_msps=257, max_abs_err=3.23e-05 (2^-14.92), power_index=22.7
- pipelined [data_width=22 n_iter=17 angle_guard=0 frac_guard=0 rounding=round] luts=1219, accuracy_bits=15.5, ffs=1252, throughput_msps=264, max_abs_err=2.12e-05 (2^-15.52), power_index=23.2
- pipelined [data_width=22 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] luts=1295, accuracy_bits=16.1, ffs=1326, throughput_msps=264, max_abs_err=1.45e-05 (2^-16.07), power_index=24.6
- pipelined [data_width=21 n_iter=18 angle_guard=2 frac_guard=1 rounding=round] luts=1357, accuracy_bits=16.3, ffs=1342, throughput_msps=257, max_abs_err=1.24e-05 (2^-16.30), power_index=25.4
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=1 rounding=round] luts=1474, accuracy_bits=17, ffs=1455, throughput_msps=257, max_abs_err=7.47e-06 (2^-17.03), power_index=27.5
- pipelined [data_width=24 n_iter=19 angle_guard=1 frac_guard=1 rounding=round] luts=1592, accuracy_bits=17.7, ffs=1570, throughput_msps=257, max_abs_err=4.63e-06 (2^-17.72), power_index=29.7
Front coverage: luts 954..1592 (HV reference 4000); accuracy_bits 13..17.7 (HV reference 13); data_width on the front 18..24 (registry 8..28).

Per family:
- pipelined: 150 evals, 130 feasible; max throughput seen 273 MSPS; best accuracy 17.72 bits; best feasible luts=954; feasible ranges: data_width 17..24, n_iter 15..19, angle_guard 0..2, frac_guard 0..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 18.08 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 200 evaluations*)
- `pipelined` (200 evals): data_width=17..28, n_iter=13..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (26 front designs; box front_anchored)

**Result (code):** 200 evaluations this round, 400 total; 256 feasible; hypervolume 1.721e+04 (+31.9%).

**No LLM call** (code's front-mapping round): The current Pareto front is dominated by the `pipelined` family, which is the only one meeting the throughput constraint (>= 250 MSPS). The `pipelined_m` family failed to produce any feasible designs (max throughput 171 MSPS), likely due to the latency/throughput trade-off or specific parameter constraints in the cost model. The `iterative` and `unrolled_k` families are not yet explored, but given that `pipelined` already achieves the minimum LUTs (954) and the required throughput, and considering the strict throughput constraint, it is highly probable that `iterative` (1 result per N+3 cycles) and `unrolled_k` (1 result per ceil(N/k)+3 cycles) will struggle to meet 250 MSPS without excessive resource usage or clock speed requirements that might not be met by the cost model. The current front covers LUTs from 954 to 1592 and accuracy from 13 to 17.7 bits. The selection rule is 'min luts', and the best design is at 954 LUTs with 13.02 bits accuracy. To improve the hypervolume and potentially find a design with slightly better accuracy at a similar LUT cost, or to confirm the lower bound of LUTs, we should refine the search around the current best region. Specifically, we should focus on `pipelined` with `data_width` 18-20, `n_iter` 15-17, `angle_guard` 0-1, and `frac_guard` 0-1. This region has shown the best LUT efficiency. We will not add new families yet as `pipelined` is clearly the most promising for this specific throughput-constrained spec.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 1.721e+04 (gain this round: +31.9%).
Feasible designs: 256 of 400 evaluations (174 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 250: 26% violate; best seen 273
- max_abs_err <= 0.00012207: 14% violate; best seen 1.58e-07 (2^-22.59)

Pareto front (feasible, 31 designs; showing up to 10), objectives: min luts, max accuracy_bits
- pipelined [data_width=18 n_iter=16 angle_guard=0 frac_guard=0 rounding=round] luts=954, accuracy_bits=13, ffs=985, throughput_msps=273, max_abs_err=0.000121 (2^-13.02), power_index=18.2
- pipelined [data_width=20 n_iter=15 angle_guard=1 frac_guard=0 rounding=round] luts=994, accuracy_bits=13.7, ffs=1029, throughput_msps=264, max_abs_err=7.63e-05 (2^-13.68), power_index=19
- pipelined [data_width=20 n_iter=16 angle_guard=2 frac_guard=0 rounding=round] luts=1080, accuracy_bits=14.6, ffs=1114, throughput_msps=264, max_abs_err=4.12e-05 (2^-14.57), power_index=20.6
- pipelined [data_width=22 n_iter=16 angle_guard=1 frac_guard=0 rounding=round] luts=1159, accuracy_bits=14.8, ffs=1195, throughput_msps=257, max_abs_err=3.42e-05 (2^-14.84), power_index=22.1
- pipelined [data_width=20 n_iter=17 angle_guard=1 frac_guard=1 rounding=round] luts=1211, accuracy_bits=15.2, ffs=1199, throughput_msps=264, max_abs_err=2.58e-05 (2^-15.24), power_index=22.7
- pipelined [data_width=22 n_iter=18 angle_guard=0 frac_guard=0 rounding=round] luts=1295, accuracy_bits=16.1, ffs=1326, throughput_msps=264, max_abs_err=1.45e-05 (2^-16.07), power_index=24.6
- pipelined [data_width=22 n_iter=19 angle_guard=0 frac_guard=0 rounding=round] luts=1371, accuracy_bits=16.5, ffs=1399, throughput_msps=264, max_abs_err=1.07e-05 (2^-16.51), power_index=26.1
- pipelined [data_width=22 n_iter=19 angle_guard=1 frac_guard=2 rounding=round] luts=1512, accuracy_bits=17.2, ffs=1489, throughput_msps=257, max_abs_err=6.44e-06 (2^-17.24), power_index=28.2
- pipelined [data_width=26 n_iter=20 angle_guard=0 frac_guard=0 rounding=round] luts=1687, accuracy_bits=18.7, ffs=1715, throughput_msps=257, max_abs_err=2.29e-06 (2^-18.73), power_index=32
- pipelined [data_width=24 n_iter=29 angle_guard=2 frac_guard=1 rounding=round] luts=2475, accuracy_bits=19.8, ffs=2426, throughput_msps=257, max_abs_err=1.08e-06 (2^-19.82), power_index=46.1
Front coverage: luts 954..2475 (HV reference 4000); accuracy_bits 13..19.8 (HV reference 13); data_width on the front 18..26 (registry 8..28).

Per family:
- pipelined: 350 evals, 256 feasible; max throughput seen 273 MSPS; best accuracy 22.59 bits; best feasible luts=954; feasible ranges: data_width 17..26, n_iter 15..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 171 MSPS; best accuracy 18.08 bits
```
</details>

## LLM usage
- calls: 3 (failed/unparsed attempts: 0)
- tokens: 7653 in, 2210 out
- provider-reported cost: $0.0064
- full prompts and replies: `llm_trace.jsonl`

