# DSE run: high_precision

**Verdict:** converged: the architect stopped exploring.  
**Architect (LLM):** openrouter: qwen/qwen3.8-27b.  
**Evaluations:** 400 of 400 budgeted, over 5 round(s).  
**Spec intake:** provided as a validated Spec; confirmed before exploration.

> Provenance key. *exact*: bit-accurate golden model over the stated angle sweep, or the cycle schedule. *estimate*: analytical Artix-7 cost model calibrated to two Vivado anchor points (weak calibration; see the L5 refit in eval/data/). *measured*: real synthesis / place-and-route results, named by tool and version (back-annotation section). The LLM produced no numbers in this report; its plans and reasoning are quoted as text.

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
`pipelined:data_width=25,n_iter=23,angle_guard=2,frac_guard=0,rounding=round` — selection: auto (spec rule: min luts_plus_ffs)

| metric | value | provenance |
|---|---|---|
| luts | 1929 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| ffs | 1949 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| fmax_mhz | 249 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| throughput_msps | 249 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| latency_cycles | 25 | exact: schedule |
| latency_ns | 100 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| power_index | 7.29 | estimate: cost_fpga (artix7-xc7a35t-vivado2025.2-2anchor-v1, 2 anchors) |
| max_abs_err | 8.71e-07 (2^-20.13) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| max_abs_err_lsb | 7.31 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err | 2.04e-07 (2^-22.23) | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| rms_err_lsb | 1.71 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |
| accuracy_bits | 20.1 | exact: bit-accurate model, dense (130882 angles: 65536 strided + 65536 random, seed 20260401+W) |

## L5 back-annotation: measured vs estimate

No measured data for the selected design in `l4_synthesis.csv`; nothing to compare.
- no measured data for the selected design; nothing to compare

## Pareto front (1 feasible non-dominated designs)

Columns marked † are *estimates* (cost model); ‡ are *exact* (golden model / schedule).

| # | design | LUTs † | FFs † | MSPS † | latency cyc ‡ | power idx † | max err ‡ | acc. bits ‡ |
|---|---|---|---|---|---|---|---|---|
| 0 | `pipelined:data_width=25,n_iter=23,angle_guard=2,frac_guard=0,rounding=round` | 1929 | 1949 | 249.0 | 25 | 7.29 | 8.71e-07 (2^-20.13) | 20.13 |

![Pareto plot](pareto.png)

## Rounds: what the architect proposed, saw and decided
### Round 1

**Plan explored** (LLM rationale: *The throughput constraint (>=50 MSPS) requires 1 result/cycle, which only pipelined and pipelined_m provide (iterative and unrolled_k produce 1 result every N or ceil(N/k) cycles, so their throughput is Fmax/N which would need Fmax > 50*N MHz, implausible). The accuracy constraint max_abs_err <= 2^-20 requires sufficient data_width and n_iter; W=20-24 with N=20-26 should cover this. I focus the entire budget on these two families since they are the only feasible ones. pipelined gives the baseline area/power; pipelined_m explores the FF-reduction trade-off. The reserved front-mapping phase will sweep these ranges to map the Pareto front well. I allocate budget 50/50 between the two families to cover both the fully-pipelined and partially-pipelined trade-offs.*)
- `pipelined` (50 evals): data_width=20..24, n_iter=20..26, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round. *Why:* Only pipelined/pipelined_m give 1 result/cycle, so throughput = Fmax. At W=20-24 and N=20-26 the Fmax should comfortably exceed 50 MHz, meeting the 50 MSPS constraint while max_abs_err <= 2^-20 is achievable. This is the primary area/power trade-off family.
- `pipelined_m` (50 evals): data_width=20..24, n_iter=20..26, angle_guard=0..2, frac_guard=0..2, rounding=trunc|round, m=2..4. *Why:* Registering every m stages reduces FF count vs fully pipelined, potentially lowering luts_plus_ffs and power_index while still giving 1 result/cycle. m=2-4 keeps latency reasonable and Fmax high enough for 50 MSPS. Directly competes with pipelined on the area/power objectives.
- clamped by code: budget shares were all zero; split equally

**Result (code):** 100 evaluations this round, 100 total; 5 feasible; hypervolume 5.052e+04 (n/a).

**LLM decision:** `add_family` — The current feasible front is a single point (3970 LUTs+FFs, 7.47 power) from the `pipelined` family. The `pipelined_m` family failed to find any feasible designs in 50 evaluations, likely because the throughput constraint (>= 50 MSPS) is hard to meet with the latency/area trade-offs of partial pipelining at the required accuracy (20+ bits). The `iterative` and `unrolled_k` families have not been explored. While `iterative` is unlikely to meet the 50 MSPS throughput constraint due to its low throughput (1 result per N+3 cycles), `unrolled_k` offers a middle ground: it can achieve higher throughput than `iterative` by chaining k rotations per cycle, potentially meeting the 50 MSPS constraint with lower area/power than the fully `pipelined` design. Specifically, `unrolled_k` with a moderate k (e.g., 2-4) and sufficient n_iter/data_width might find a design with lower luts_plus_ffs than 3970 while still meeting the accuracy and throughput constraints. Exploring `unrolled_k` is the most logical next step to expand the Pareto front and potentially find a better area/power trade-off.

<details><summary>Summary the LLM was shown</summary>

```
Round 1 of at most 4 complete. Evaluations used: 100 of 400.
Hypervolume of the feasible front: 5.052e+04 (gain this round: n/a (first round)).
Feasible designs: 5 of 100 evaluations (2 unique).
Families explored so far: pipelined, pipelined_m. Not yet explored: iterative, unrolled_k.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 0% violate; best seen 264
- max_abs_err <= 9.53674e-07: 95% violate; best seen 6.77e-07 (2^-20.50)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=3970, power_index=7.47, luts=2003, ffs=1966, throughput_msps=257, max_abs_err=7.74e-07 (2^-20.30)
Front coverage: luts_plus_ffs 3970..3970 (HV reference 8000); power_index 7.47..7.47 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- pipelined: 50 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 20.50 bits; best feasible luts_plus_ffs=3970; feasible ranges: data_width 24..24, n_iter 23..25, angle_guard 2..2, frac_guard 2..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 164 MSPS; best accuracy 19.74 bits
```
</details>

### Round 2

**Plan explored** (LLM rationale: *Focus entirely on unrolled_k in this round to determine if it can produce feasible designs with better area/power characteristics than the current pipelined design. If unrolled_k yields feasible designs, they will be added to the Pareto front, potentially improving the hypervolume. If not, we can then consider refining the pipelined ranges or declaring infeasibility for other families.*)
- `unrolled_k` (100 evals): data_width=22..26, n_iter=20..26, angle_guard=1..3, frac_guard=1..3, rounding=trunc|round, k=2..6. *Why:* Explore unrolled_k to find designs with lower area/power than the current pipelined front while meeting the 50 MSPS throughput and 2^-20 accuracy constraints. The ranges are centered around the known feasible region (data_width ~24, n_iter ~23) but allow for some variation to find better trade-offs. k is set to 2-6 to balance throughput and area.

**Result (code):** 100 evaluations this round, 200 total; 5 feasible; hypervolume 5.052e+04 (+0.0%).

**LLM decision:** `map_front` — The current Pareto front consists of a single point (pipelined, 3970 luts_plus_ffs, 7.47 power_index). The hypervolume gain in Round 2 was 0.0%, indicating stagnation. The `pipelined` family is the only one that has found feasible designs, and its feasible region is tightly clustered around data_width=24, n_iter=23-25, angle_guard=2, frac_guard=2. `unrolled_k` and `pipelined_m` failed to meet the throughput constraint (max 7.72 and 164 MSPS respectively, though 164 is feasible, it failed accuracy). `iterative` is not yet explored but is known to have low throughput (1 result per N+3 cycles), making it highly unlikely to meet the 50 MSPS constraint without extremely high Fmax, which is constrained by the logic depth of the iterative loop. Since `pipelined` is the only viable family and the front is a single point, we should use the remaining budget to map the full Pareto front within the `pipelined` family to see if there are trade-offs between area and power that were missed by the initial search. This will maximize hypervolume by covering the trade-off curve rather than just the single corner found so far.

<details><summary>Summary the LLM was shown</summary>

```
Round 2 of at most 4 complete. Evaluations used: 200 of 400.
Hypervolume of the feasible front: 5.052e+04 (gain this round: +0.0%).
Feasible designs: 5 of 200 evaluations (2 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 50% violate; best seen 264
- max_abs_err <= 9.53674e-07: 68% violate; best seen 1.52e-07 (2^-22.65)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=3970, power_index=7.47, luts=2003, ffs=1966, throughput_msps=257, max_abs_err=7.74e-07 (2^-20.30)
Front coverage: luts_plus_ffs 3970..3970 (HV reference 8000); power_index 7.47..7.47 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 7.72 MSPS; best accuracy 22.65 bits
- pipelined: 50 evals, 5 feasible; max throughput seen 264 MSPS; best accuracy 20.50 bits; best feasible luts_plus_ffs=3970; feasible ranges: data_width 24..24, n_iter 23..25, angle_guard 2..2, frac_guard 2..2
- pipelined_m: 50 evals, 0 feasible; max throughput seen 164 MSPS; best accuracy 19.74 bits
```
</details>

### Round 3

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 40 evaluations*)
- `pipelined` (40 evals): data_width=23..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 40 evaluations this round, 240 total; 31 feasible; hypervolume 5.052e+04 (+0.0%).

**LLM decision:** `map_front` — The current Pareto front consists of a single design (pipelined, 3970 LUTs+FFs, 7.47 power_index). The hypervolume gain in Round 3 was 0.0%, indicating the search has stagnated around this specific point. The `pipelined` family is the only one yielding feasible results (31 feasible out of 90 evals), while `unrolled_k` and `pipelined_m` failed to meet the throughput or accuracy constraints in their explored ranges. Since the front covers only a tiny slice of the objective space (luts_plus_ffs 3970..3970 vs ref 8000; power 7.47..7.47 vs ref 20), we need to map the full trade-off curve. The `pipelined` family has a wide feasible range (data_width 24..28, n_iter 23..30, angle_guard -2..4, frac_guard 1..4). By invoking `map_front`, we allow the code to use the remaining budget (160 evals) to run NSGA-II over the full feasible ranges of the `pipelined` family. This will reveal if there are designs with lower area/power that were missed by the previous local searches, or confirm that the current design is indeed the optimal corner. We do not need to add `iterative` because it has a throughput of 1 result per N+3 cycles, which makes it impossible to reach 50 MSPS at reasonable Fmax without extremely high clock speeds that would likely violate area/power or be physically unrealistic compared to the pipelined solution which already achieves 257 MSPS. `unrolled_k` and `pipelined_m` have already shown poor feasibility in their initial explorations, and `pipelined` is clearly the dominant family for this spec.

<details><summary>Summary the LLM was shown</summary>

```
Round 3 of at most 4 complete. Evaluations used: 240 of 400.
Hypervolume of the feasible front: 5.052e+04 (gain this round: +0.0%).
Feasible designs: 31 of 240 evaluations (17 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 42% violate; best seen 264
- max_abs_err <= 9.53674e-07: 62% violate; best seen 4.04e-08 (2^-24.56)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined [data_width=24 n_iter=23 angle_guard=2 frac_guard=2 rounding=round] luts_plus_ffs=3970, power_index=7.47, luts=2003, ffs=1966, throughput_msps=257, max_abs_err=7.74e-07 (2^-20.30)
Front coverage: luts_plus_ffs 3970..3970 (HV reference 8000); power_index 7.47..7.47 (HV reference 20); data_width on the front 24..24 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 7.72 MSPS; best accuracy 22.65 bits
- pipelined: 90 evals, 31 feasible; max throughput seen 264 MSPS; best accuracy 24.56 bits; best feasible luts_plus_ffs=3970; feasible ranges: data_width 24..28, n_iter 23..30, angle_guard -2..4, frac_guard 1..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 164 MSPS; best accuracy 19.74 bits
```
</details>

### Round 4

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 100 evaluations*)
- `pipelined` (100 evals): data_width=23..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 100 evaluations this round, 340 total; 87 feasible; hypervolume 5.236e+04 (+3.7%).

**LLM decision:** `stop` — The search has reached the round and budget limits (Round 4/4, 340/400 evals). The feasible Pareto front contains a single design: a pipelined CORDIC with data_width=25, n_iter=23, angle_guard=2, frac_guard=0, and rounding=round. This design satisfies all constraints: throughput is 249 MSPS (>= 50) and max_abs_err is 8.71e-07 (<= 9.53674e-07). It minimizes the primary objective luts_plus_ffs at 3879 and has a power_index of 7.29. Other families (unrolled_k, pipelined_m) failed to produce feasible designs within their evaluated ranges, primarily due to insufficient throughput or accuracy. Since this is the final round, the exploration concludes with this single-point front.
- **rule applied by code:** code: before stopping (stopped), one front-mapping round with the remaining 60 evaluations

<details><summary>Summary the LLM was shown</summary>

```
Round 4 of at most 4 complete. Evaluations used: 340 of 400.
Hypervolume of the feasible front: 5.236e+04 (gain this round: +3.7%).
Feasible designs: 87 of 340 evaluations (65 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 29% violate; best seen 264
- max_abs_err <= 9.53674e-07: 57% violate; best seen 3.12e-08 (2^-24.93)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined [data_width=25 n_iter=23 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=3879, power_index=7.29, luts=1929, ffs=1949, throughput_msps=249, max_abs_err=8.71e-07 (2^-20.13)
Front coverage: luts_plus_ffs 3879..3879 (HV reference 8000); power_index 7.29..7.29 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 7.72 MSPS; best accuracy 22.65 bits
- pipelined: 190 evals, 87 feasible; max throughput seen 264 MSPS; best accuracy 24.93 bits; best feasible luts_plus_ffs=3879; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 164 MSPS; best accuracy 19.74 bits
```
</details>

### Round 5

**Plan explored** (LLM rationale: *code-driven front-mapping round: NSGA-II over the front families' front_anchored ranges with 60 evaluations*)
- `pipelined` (60 evals): data_width=24..28, n_iter=21..30, angle_guard=-2..4, frac_guard=0..4, rounding=trunc|round. *Why:* code: map the front of pipelined (1 front designs; box front_anchored)

**Result (code):** 60 evaluations this round, 400 total; 130 feasible; hypervolume 5.236e+04 (+0.0%).

**No LLM call** (code's front-mapping round): The search has reached the round and budget limits (Round 4/4, 340/400 evals). The feasible Pareto front contains a single design: a pipelined CORDIC with data_width=25, n_iter=23, angle_guard=2, frac_guard=0, and rounding=round. This design satisfies all constraints: throughput is 249 MSPS (>= 50) and max_abs_err is 8.71e-07 (<= 9.53674e-07). It minimizes the primary objective luts_plus_ffs at 3879 and has a power_index of 7.29. Other families (unrolled_k, pipelined_m) failed to produce feasible designs within their evaluated ranges, primarily due to insufficient throughput or accuracy. Since this is the final round, the exploration concludes with this single-point front.
- **rule applied by code:** code: front-mapping round complete; stopping as decided before it

<details><summary>Summary the LLM was shown</summary>

```
Round 5 of at most 4 complete. Evaluations used: 400 of 400.
Hypervolume of the feasible front: 5.236e+04 (gain this round: +0.0%).
Feasible designs: 130 of 400 evaluations (94 unique).
Families explored so far: unrolled_k, pipelined, pipelined_m. Not yet explored: iterative.
Provenance: LUTs/FFs/Fmax/throughput/power are cost-model ESTIMATES (Artix-7, 2-anchor calibration); errors/accuracy bits are EXACT (bit-accurate model).

Constraints (fraction of evaluations violating; best value any design achieved):
- throughput_msps >= 50: 25% violate; best seen 264
- max_abs_err <= 9.53674e-07: 53% violate; best seen 3e-08 (2^-24.99)

Pareto front (feasible, 1 designs; showing up to 10), objectives: min luts_plus_ffs, min power_index
- pipelined [data_width=25 n_iter=23 angle_guard=2 frac_guard=0 rounding=round] luts_plus_ffs=3879, power_index=7.29, luts=1929, ffs=1949, throughput_msps=249, max_abs_err=8.71e-07 (2^-20.13)
Front coverage: luts_plus_ffs 3879..3879 (HV reference 8000); power_index 7.29..7.29 (HV reference 20); data_width on the front 25..25 (registry 8..28).

Per family:
- unrolled_k: 100 evals, 0 feasible; max throughput seen 7.72 MSPS; best accuracy 22.65 bits
- pipelined: 250 evals, 130 feasible; max throughput seen 264 MSPS; best accuracy 24.99 bits; best feasible luts_plus_ffs=3879; feasible ranges: data_width 24..28, n_iter 22..30, angle_guard -2..4, frac_guard 0..4
- pipelined_m: 50 evals, 0 feasible; max throughput seen 164 MSPS; best accuracy 19.74 bits
```
</details>

## LLM usage
- calls: 5 (failed/unparsed attempts: 0)
- tokens: 9951 in, 2524 out
- provider-reported cost: $0.0075
- full prompts and replies: `llm_trace.jsonl`

