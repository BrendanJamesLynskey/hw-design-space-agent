# HW Design-Space Agent: project record

_A living record of what has been built, how, and why, published here as an engineering log. The planner session
updates it after every verified milestone; this copy is checked against the agent's repository at the commit this site
vendors, and where they differed the repository won._

**Last updated:** 2026-10-10 (M3 merged). **Repos:** `BrendanJamesLynskey/HW_Design_Space_Agent` (the agent),
`BrendanJamesLynskey/hw-design-space-agent` (the site), `BrendanJamesLynskey/CORDIC` (the reference RTL). All MIT.

---

## 1. Summary

The project is a **LangGraph agent for hardware design-space exploration**. Given a hardware spec (function,
throughput, accuracy, area/power budget), it explores architecture families and parameters and converges on a
Pareto-optimal design, going down a ladder of fidelity: spec → analytical model → system-level and cycle-level
simulation → RTL and verification → synthesis → back-annotation.

The first design space is a **CORDIC sin/cos unit on an Artix-7 FPGA**, chosen because it's small enough to search
exhaustively. That gives a true answer to score the agent against, which most agent demos lack.

Where it stands on 2026-10-10:

| milestone | status | headline |
|---|---|---|
| M1: spec intake + analytical exploration + eval | merged (0082ccd) | The agent picks the right design better than NSGA-II and random search, but maps the trade-off front worse. |
| Site, parts A–C2 | A–C1 live (ad6101a, 2026-10-09); C2 (this version) re-vendored at a92fe65 | 8 pages incl. this record at /record; L2 animated from real data; the A/B on the results page; every number traced to the vendored repo commit. |
| M2: RTL, verification, synthesis, gate level, back-annotation, whole-curve agent | merged (9060f8f) | The front-mapping gap is closed (0.96–1.09× NSGA-II hypervolume) and the agent still selects better in 8 of 9 model/spec cells. All 47 RTL configurations match the golden model in 2 simulators. |
| Vivado calibration anchors + L5 refit | merged (bbbf71e), verified before merge in three review rounds | 14 generated designs measured in Vivado 2025.2; no spec's winning design changes; M1 stays the default cost model, because the refit does no better out of sample. |
| M3: cycle-level and system-level simulation, campaign agent | merged (a92fe65), verified before merge in two review rounds | L2 (SimPy system + cycle-accurate models, 48/48 traces identical to RTL) finds a different winner on a system-constrained spec; the Deep Agents campaign layer gained nothing over the structured graph at 1.4–2.25× the cost, so it stays experimental. |
| M4: ASIC cost model, fleet, write-up | planned | |

## 2. Why this project

- **The idea.** Hardware architecture is trade-off exploration: area against throughput against accuracy against
  power. *An AI agent is the perfect environment for trade-off exploration*: it can read a spec, decide which
  families and ranges are worth searching, interpret results and decide what to do next, around the clock, while
  deterministic tools do the measuring. It's a way to **avoid premature optimisation**: explore first, then spend
  effort on the critical 3% that matters (after Knuth, "Premature optimization is the root of all evil", ACM
  Computing Surveys 6(4), 1974).
- **The showcase.** It demonstrates both production software practice (LangGraph, Python, TypeScript, tests, CI,
  eval harnesses, a deployed site) and deep hardware expertise (bit-exact models, RTL, formal verification,
  synthesis, calibration against real tool results).

## 3. Principles every milestone follows

1. **The LLM is never the optimiser and never produces a power/performance/area, accuracy or system-level number.** It does the
   architect's job: choose families and ranges, interpret summaries, decide to refine, widen, map the front, declare
   the spec infeasible, or stop. Code produces every number: a bit-exact model, cost models, Optuna NSGA-II,
   Pareto/hypervolume maths, simulators and synthesis tools.
2. **Every number carries its provenance:** _exact_ (bit-accurate simulation), _estimate_ (cost model, naming its
   calibration, or an L1 analytic bound), _measured (tool, version)_ or _simulated_ (the L2 system model, since M3).
3. **Scored against ground truth.** An exhaustive grid of 635,040 designs gives the true front and the true
   optimum per spec. The agent is compared with NSGA-II and random search at the same evaluation budget.
4. **Results come only from real LLM runs,** with model IDs, tokens and cost recorded. A scripted fake LLM is used
   only for tests, and the eval harness refuses it.
5. **Losses are reported first.** The site's Results page opens with where the agent lost.
6. **Reproducible.** Every run's trace is committed; the results file regenerates from the committed data with no
   diff; the site vendors the repo at a pinned commit, with hashes, and its TypeScript ports of the models match
   the Python fixtures exactly.

## 4. How the work is done

The project itself is built with AI coding agents (Claude Code), under a deliberate process:

- **A planner session** reads the state, makes or asks for decisions, writes self-contained briefs, and
  **independently verifies** each result before anything merges.
- **Executor sessions** do the work from a brief:
  - **cloud sessions** for milestones that need live LLM calls (an OpenRouter key held as an environment
    variable, never printed, logged, traced or committed);
  - **local sub-agents** for the site and for Vivado, which is installed locally.
  Executors open PRs; the planner merges after verification.
- **Verification gates before a merge:** CI green at the PR head; tests re-run locally; a scan of the full git
  history and every trace for key material; the results file regenerated with no diff; the traces' cost sum
  matched to the results; the key's usage checked against the spend cap; numbers in prose spot-checked against the
  data files; for M2, an independent code review posted on the PR and a Vivado spot-check.
- **Spend cap:** $5 of LLM usage per milestone.
- **Small machine discipline:** one heavy job at a time under a memory cap; heavy synthesis and evals run in the
  cloud where possible.

## 5. Decision log

| date | decision | by | alternatives considered | why |
|---|---|---|---|---|
| 2026-10-07 | Start the LangGraph portfolio with an upgrade of an existing coding agent (Ollama provider, bounded sub-agents, MCP tools). | owner | four other project ideas | Quickest visible win; done as v0.2.0. |
| 2026-10-07 | Live LLM work runs in cloud sessions through OpenRouter; models: an open-weights model (`qwen/qwen3.8-27b`), a frontier model (`anthropic/claude-sonnet-5.5`) and a cheap open-weights MoE (`deepseek/deepseek-v4.1-flash`). | planner, owner agreed | local inference (no GPU here); one provider per model | One API and one key; open vs frontier vs cheap is the comparison readers care about. |
| 2026-10-08 | A hardware design-space agent replaces the planned "RTL verification agent"; verification becomes its L3 stage. | owner | stand-alone verification agent | A bigger, more distinctive idea that still includes verification. |
| 2026-10-08 | The LLM never optimises or produces numbers; provenance labels on every number. | planner, owner agreed | let the LLM estimate PPA | LLM numbers can't be trusted or reproduced; the agent's value is in decisions. |
| 2026-10-08 | CORDIC sin/cos on Artix-7 as the first design space, using the owner's existing RTL and Vivado results as anchors. | planner | a larger accelerator | Exhaustively searchable, so the agent can be scored against the truth. |
| 2026-10-08 | Structured outputs via JSON schema, not forced tool calls. | M1 executor | forced `tool_choice` | One provider route for the frontier model rejected forced tool choice. |
| 2026-10-08 | Qwen run with reasoning off as well as on, and both recorded. | M1 executor | drop the model | With default reasoning it exhausted its token budget; reasoning off was about 15× faster by wall-clock and 8× cheaper. |
| 2026-10-08 | M1 merged with its honest finding: better selector, worse front-mapper. | planner | tune before publishing | The finding is the story; the site leads with it. |
| 2026-10-08 | The showcase site copies the house style of the owner's "explained" sites, but stays outside that family's switcher. Levels not yet built are shown ghosted with status badges; "24/7 fleet" claims are framed as what the architecture enables, with measured cost/time; the engineer-time calculator uses the reader's own numbers. | planner, owner agreed | animate the whole ladder now | The site may claim only what is true of the vendored commit. |
| 2026-10-08 | CORDIC repo relicensed MIT so its RTL can be vendored. | owner | clone at a pinned commit | Simpler, self-contained builds. |
| 2026-10-08 | Vivado anchors at 6 points (`unrolled_k` k=2/4, `pipelined_m` m=2/4, `pipelined` W=12/24), run locally after M2. | owner | anchors before M2 | Two of the families had no RTL until M2's generator existed. |
| 2026-10-08 | The agent must cover the whole trade-off curve, not just select. | owner | keep it as a selector | A hardware architect needs the front, not one point. |
| 2026-10-08 | 5 seeds per spec and model (up from 3). | owner | 3 seeds | Agent variance was high. |
| 2026-10-09 | M2's eval keeps M1's Vivado-anchored cost model as the default; the open-source synthesis refit is reported separately. | planner | recalibrate first | Keeps the ground truth fixed, so any change is the agent's, not the model's. |
| 2026-10-09 | If open-source place-and-route won't install, report resource counts with no Fmax rather than estimate timing. | planner | estimate timing | No invented numbers. (It did install, so it wasn't needed.) |
| 2026-10-09 | The whole-curve levers are tuned offline by replaying recorded M1 decisions, with one small live pilot before the full eval. | planner, M2 executor | tune on live runs | Cheap, repeatable, and it keeps the eval itself out of the tuning. |
| 2026-10-09 | M2 review: one comment-only review on the PR; the executor fixes its own branch. | planner | planner pushes fixes | Never two sessions pushing to one branch. |
| 2026-10-09 | Add a Deep Agents "campaign" layer in M3 over the existing graph, with an A/B against the structured graph, and cross-run memory. | owner, on the planner's recommendation | replace the graph with a free-form agent | The structured graph is what makes results reproducible and comparable; long-horizon campaigns and memory are where a free-form harness may earn its keep. Measuring it is the point. |
| 2026-10-09 | Vivado work split: the local machine produces measurement data only (one commit, reports with host names redacted); the cloud session does the refit, docs and PR. Post-synthesis numbers drive the refit; post-route numbers are reported alongside. | M2 executor, planner agreed | local session does everything | Keeps code changes in one place, and the data reproducible from committed reports. |
| 2026-10-09 | L5 refit (PR #4): keep M1 as the default cost model; post-route Vivado rows reported, not fitted; defer a per-family-class timing factor until the `high_precision` candidates are measured; run 6 more Vivado points to settle it. | cloud executor proposed, planner review agreed, owner yes to the extra run | adopt the refit or the class factor now | On the 14 Vivado points the refit's leave-one-out error is no better than the untouched M1 model's (LUT 15.4% vs 15.4%, Fmax 12.5% vs 11.7%), and the `high_precision` winner (m=6 vs m=8) hinged on a margin inside either model's error, so only a measurement could settle it. (Figures at the merged commit bbbf71e; the first review round quoted earlier, larger numbers.) |
| 2026-10-09 | After the second Vivado batch (PR #4, 51 fitted points): `high_precision` stays m=6; M1 stays the default cost model; the per-family-class timing factor is **deferred**, not rejected. | cloud executor, adjusted by the planner's review | adopt the class factor (better average out-of-sample Fmax error: 7.4% against 12.5% on Vivado points) | m=6 is feasible both after synthesis and after routing. The class factor would flip the refit's winner to m=8 on a point whose measured margin (0.24%) is inside every model's error, and post-route timing says m=8 is infeasible. Revisit it with more points near the boundary, and with m=8 synthesised at the real 20 ns constraint. |
| 2026-10-09 | This record is maintained and published on the site. | owner | | |
| 2026-10-09 | Site part C: replay a real M2 run (Sonnet / low_area_control / seed 2, which picked the worked-example design) as the home animation; never animate planned levels; publish this record at /record as a site copy whose numbers are unit-tested against the vendored data; the repo wins any disagreement. | executor proposed, planner verified | hand-drawn illustrative animation; link to an unpublished record | Every number on the site must trace to a commit; a tested copy turned up six stale figures in this record, now corrected. |
| 2026-10-09 | M3 system specs: L1 uses optimistic analytic bounds for system constraints, L2 simulates candidates; ground truth comes from the SimPy model itself (635,040 designs share only 1,092 latency/interval/Fmax combinations). | cloud executor | system metrics only at L2 (hides the winner from L1); a vectorised surrogate | Exact simulated ground truth at low cost. |
| 2026-10-09 | M3: the `map_front` blind-spot fix ships as a gated lever (`LEVERS_M3`), default only on system specs. | executor proposed; owner kept it off for the M2 specs | unconditional fix (dds HV 0.878 → 0.781); default everywhere | Keeps M2 results comparable; the offline `high_precision` gain (+8.0% → +4.0% regret) comes from a single run. |
| 2026-10-09 | M3 A/B scope: campaign arm on Qwen + DeepSeek for all specs, Sonnet on `multiaxis_control` only; the full Sonnet arm (~$6.9) is skipped. | executor (spend cap), owner confirmed | raise the key limit and run it | The two cheaper models showed no gain; little to learn for the money. |
| 2026-10-10 | M3 review B1: L2 checks every L1-feasible design, not just the front's top k; live runs re-scored offline rather than re-run. | planner review found it; executor fixed | extend the shortlist to 20 | On `multiaxis_control` the true winner (m=4) is dominated at L1 by m=5, so a front-only shortlist could never reach it. Simulation is cached, so checking all is cheap; L1 evaluations were unchanged, so no new spend. |
| 2026-10-10 | M3: numbers in the campaign LLM's free-text memory notes are masked before storage and before reaching the inner architect. | planner review found it; executor fixed | drop notes altogether | One note carried a mis-scaled error figure (~19% where the data implied +36%); the LLM must not originate numbers. |
| 2026-10-10 | Keep the campaign agent experimental (optional, off by default); rework only if the M4 fleet design needs it. | owner | invest in it in M4; drop it | No gain on HV or regret, higher cost, Qwen loops in 4/30 campaigns, memory showed no benefit. |

## 6. Results

### M1 (merged 0082ccd; 48 live runs, 3 seeds)

- **Selection regret** (how far the chosen design is from the true optimum on the spec's metric): the agent beat both
  baselines on every spec (best +1.6% / +3.1% / +1.6% against NSGA-II's +12.3% / +12.4% / +8.0%).
- **Hypervolume:** NSGA-II won on two of three specs (0.800 and 0.905, against the agents' 0.16–0.70). The agents
  dived at the spec's corner and a 1% hypervolume-gain stopping rule ended the run early.
- **Infeasible spec:** every model, on every seed, declared it infeasible and named throughput as the binding
  constraint (the true maximum is 291.5 MSPS against 400 asked for).
- **Cost:** $1.74 provider-reported; about $2.50 by the key's usage.

### M2 (merged 9060f8f; 60 live runs, 5 seeds)

- **L3 verification:** generated RTL for all four families matched the bit-exact golden model in 47 configurations ×
  2 simulators (Verilator and Icarus) with zero mismatches, exhaustive up to 16 bits. 7/7 formal proofs at 8 bits.
  22 gate-level simulations of the synthesised netlist, zero mismatches.
- **L4 synthesis:** 39 points through Yosys + nextpnr-xilinx, every one labelled with tool versions and command lines.
- **Hypervolume relative to NSGA-II:** 0.97–1.09 on the two specs where M1 lost (M1: 0.18–0.87).
- **Selection:** the agent still beat NSGA-II in 8 of 9 model/spec cells. It lost on Qwen `high_precision`
  (+17.5% ± 27.2 against +10.3%, one bad seed).
- **What it cost:** DeepSeek's selection got worse (2.2% → 7.6% and 1.6% → 5.1%), and the agent now always uses the
  full 400-evaluation budget, so M1's "fewer evaluations" advantage is gone.
- **Spend:** the key's usage rose by $1.66 between the before and after readings (provider-reported $1.67
  including the pilot; the two readings' timing cannot fully separate the pilot).

### M3 (merged a92fe65; structured arm 30 new runs, campaign arm 65 runs, 5 seeds)

- **L2 vs RTL:** the cycle-accurate model matched the RTL on 48/48 traces (28,424 clock edges, 8 designs × 3 seeds,
  Verilator and Icarus).
- **M2 comparability:** all 60 M2 runs replay identically under M3 code, down to byte-identical architect prompts,
  so the A/B reuses them.
- **System specs (ground truth simulated, exhaustive):** on `multiaxis_control` the system winner is `pipelined_m`
  m=4 (1,072 LUT+FF), where the MSPS-only view picks m=7 and even peak-rate sizing picks m=5. On `bursty_offload` the
  simulated winner differs from an average-rate view but equals peak-rate sizing, so L2 adds nothing there. A third
  spec (`dds_sfdr`) changes nothing and is kept as a negative result.
- **Structured agent on the system specs:** HV 0.84–0.87 against NSGA-II's 0.81–0.84; regret +3.2% to +15.8%
  against NSGA-II's +16.0% / +26.7%.
- **A/B, structured → campaign (pooled):** DeepSeek HV 0.905 → 0.893, regret +7.3% → +7.7%, cost 1.62×; Qwen HV
  0.872 → 0.819, regret +9.2% → +19.0%, cost 1.44×, 4/30 campaigns failed by looping; Sonnet (one spec) HV
  0.839 → 0.833, regret +3.2% → +5.7%, cost 2.25×. In 52 of 65 runs the campaign agent's plan came down to a
  single 400-evaluation call to the structured graph.
- **Memory on vs off (Qwen, 3 seeds):** no benefit; the run-to-run noise is as large as any effect.
- **Spend:** $3.58 by the key's usage (ledger $3.49), under the $5 cap; the before reading preceded the first run.

## 7. What review found (M2)

An independent review (no high-severity bugs; 3 medium, 5 low; [posted on the PR](https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent/pull/3#pullrequestreview-5468926172)) found:

- the final front-mapping round can exceed the spec's per-round and round-count limits (the 400 total is
  respected);
- the per-family recalibration overfits (leave-one-out error 12.9% against 9.0% in-sample on LUTs), and its unweighted fit
  lets 37 open-source points outvote the 2 Vivado anchors;
- a Vivado spot-check of the generated pipelined design: 720 LUT / 751 FF / 327.4 MHz against the reference RTL's
  745 / 784 / 272.9. Generated and reference RTL agree on area but not on timing, which the Vivado anchor work must
  account for;
- prose claims to correct: two marked wrong (the dense-sweep angle count above W = 16, and an `unrolled_k` conclusion
  drawn from one comparison) and three to soften.

All were fixed on the PR. M2 itself was merged before the planner's re-check of the fixes (a check after the merge found nothing wrong); from the Vivado refit on, every PR has been verified before merge.

## 7b. What review found (M3)

Two planner review rounds before merge, both posted on the PR
([round 1](https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent/pull/5#pullrequestreview-5475218098),
[round 2](https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent/pull/5#pullrequestreview-5478128383)).
Round 1: 1 blocking, 6 should-fix, 12 nits.

- **Blocking:** L2 shortlisted only from the L1 front, so it could not reach the `multiaxis_control` winner; its test
  passed only because it hand-built a front. Fixed (all L1-feasible designs), with a regression test on a real front.
- Campaign tests were skipped in CI (dependency missing); now required on Python 3.11+.
- Overclaims corrected: L2 did re-select in 4/65 campaign runs; the campaign's "whole ladder" mostly had no RTL or
  synthesis data; `bursty_offload`'s winner change holds only against an average-rate view.
- LLM-written memory notes carried self-computed numbers; now masked.
- The cost table compared different spec sets for Sonnet; fixed.

Round 2 found everything fixed and 2 optional nits, which the executor also fixed before merge.

## 8. Known limitations

- One design space so far (CORDIC); one FPGA family.
- The default cost model is still M1 (two Vivado anchors), by choice: the Vivado-weighted refit on 14 measured points
  did not predict unseen points better, so it is reported, not adopted. Its error is about 15% RMS on LUTs and 12% on
  Fmax.
- Vivado post-synthesis Fmax is the cost model's timing scale; routed Fmax is lower, by up to about a third on the
  short-path pipelined designs.
- The power figure is a relative index, not watts.
- Natural-language spec intake has only been tested with a scripted model.
- 5 seeds is still a small sample; some cells overlap within one standard deviation.
- The A/B is incomplete for the frontier model: Sonnet's campaign arm covers one spec.
- Wall-clock figures for the A/B were measured with 3–4 runs in parallel.
- System-level metrics come from a SimPy model, not from hardware: its interface contract is checked against the RTL
  cycle by cycle, but it runs each design at its estimated Fmax, and it aligns requests to the next clock edge with no
  synchroniser (a real clock-domain crossing would add about two cycles).
- Only one of the two evaluated system specs needs the system model (`multiaxis_control`, by a 1.5% margin); on
  `bursty_offload` a peak-rate throughput floor gives the same winner.

## 9. What's next

1. ~~M2~~ done (9060f8f); ~~Vivado anchors and the L5 refit~~ done (bbbf71e, PR #4): 14 generated designs in Vivado
   2025.2, no spec's winner changes, M1 stays the default cost model.
2. ~~Site part C1~~ live 2026-10-09 (ad6101a): L3, L4, gate level and L5 animated from real data; this record.
3. ~~M3~~ done (a92fe65): SimPy system-level and cycle-level simulation; the campaign agent and its A/B; cross-run memory.
4. Site part C2 (this version): L2 and the A/B on the showcase site; this record synced. Deploy pending.
5. M4: ASIC cost model (open PDK), a fleet of agents, L2→L1 feedback, more measured data (m=8 at 20 ns), the write-up.
