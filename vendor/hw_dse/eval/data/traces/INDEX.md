# Eval run index

Each directory holds `llm_trace.jsonl` (every LLM call, key-redacted), `evaluations.csv.gz` and `report.md`, copied from the live eval runs' `runs/` output (pareto PNGs and SQLite checkpoints omitted). In the trace records, `usage`, `settings` and `parsed` are Python-repr strings; their `cost_usd` values sum to $1.7367, matching `eval/results.md`. Summary JSONs are committed in `eval/data/agent/`.

| run dir | model | reasoning | spec | seed | status | decisions |
|---|---|---|---|---|---|---|
| `dds_250msps/20261008-125907-49ff` | `qwen/qwen3.8-27b` | provider default | — | — | crashed (budget_share=0 validation error, before the fix in 3786d6e); not scored | — |
| `dds_250msps/20261008-125907-9473` | `deepseek/deepseek-v4.1-flash` | provider default | dds_250msps | 0 | stopped | refine → refine → refine → stop |
| `dds_250msps/20261008-125908-d3e9` | `anthropic/claude-sonnet-5.5` | provider default | dds_250msps | 0 | converged | refine → refine |
| `dds_250msps/20261008-125938-8763` | `anthropic/claude-sonnet-5.5` | provider default | dds_250msps | 1 | stopped | refine → refine → refine → stop |
| `dds_250msps/20261008-130010-c769` | `anthropic/claude-sonnet-5.5` | provider default | dds_250msps | 2 | stopped | refine → refine → refine → stop |
| `dds_250msps/20261008-130259-32ac` | `deepseek/deepseek-v4.1-flash` | provider default | dds_250msps | 1 | converged | refine → refine → refine |
| `dds_250msps/20261008-130442-c201` | `deepseek/deepseek-v4.1-flash` | provider default | dds_250msps | 2 | converged | refine → refine → refine |
| `dds_250msps/20261008-130854-a7dc` | `qwen/qwen3.8-27b` | provider default | dds_250msps | 0 | stopped | refine → refine → refine → stop |
| `dds_250msps/20261008-132417-d08c` | `qwen/qwen3.8-27b` | provider default | dds_250msps | 1 | stopped | refine → stop |
| `dds_250msps/20261008-133610-5c51` | `qwen/qwen3.8-27b` | provider default | dds_250msps | 2 | stopped | refine → widen → stop |
| `dds_250msps/20261008-143947-eb7e` | `qwen/qwen3.8-27b` | off | dds_250msps | 0 | converged | refine → refine → refine |
| `dds_250msps/20261008-144033-d8d5` | `qwen/qwen3.8-27b` | off | dds_250msps | 1 | stopped | refine → refine → stop |
| `dds_250msps/20261008-144117-a5b7` | `qwen/qwen3.8-27b` | off | dds_250msps | 2 | converged | refine → refine |
| `high_precision/20261008-130043-d1d3` | `anthropic/claude-sonnet-5.5` | provider default | high_precision | 0 | stopped | add_family → refine → refine → stop |
| `high_precision/20261008-130122-af40` | `anthropic/claude-sonnet-5.5` | provider default | high_precision | 1 | stopped | add_family → stop |
| `high_precision/20261008-130151-5bfe` | `anthropic/claude-sonnet-5.5` | provider default | high_precision | 2 | converged | refine → refine |
| `high_precision/20261008-130543-6398` | `deepseek/deepseek-v4.1-flash` | provider default | high_precision | 0 | converged | refine → refine |
| `high_precision/20261008-130636-e393` | `deepseek/deepseek-v4.1-flash` | provider default | high_precision | 1 | converged | refine → refine → refine |
| `high_precision/20261008-130845-dec9` | `deepseek/deepseek-v4.1-flash` | provider default | high_precision | 2 | converged | refine → refine |
| `high_precision/20261008-130854-1a5b` | `qwen/qwen3.8-27b` | provider default | high_precision | 0 | stopped | refine → stop |
| `high_precision/20261008-132338-7351` | `qwen/qwen3.8-27b` | provider default | high_precision | 1 | converged | refine → refine |
| `high_precision/20261008-133147-86b2` | `qwen/qwen3.8-27b` | provider default | high_precision | 2 | stopped | stop |
| `high_precision/20261008-143948-a8bd` | `qwen/qwen3.8-27b` | off | high_precision | 0 | converged | refine → refine → refine |
| `high_precision/20261008-144135-35b3` | `qwen/qwen3.8-27b` | off | high_precision | 1 | converged | refine → refine |
| `high_precision/20261008-144227-545b` | `qwen/qwen3.8-27b` | off | high_precision | 2 | converged | refine → refine |
| `infeasible_dds_400msps/20261008-130229-2502` | `anthropic/claude-sonnet-5.5` | provider default | infeasible_dds_400msps | 0 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-130247-b437` | `anthropic/claude-sonnet-5.5` | provider default | infeasible_dds_400msps | 1 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-130306-ecb2` | `anthropic/claude-sonnet-5.5` | provider default | infeasible_dds_400msps | 2 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-130854-a9b0` | `qwen/qwen3.8-27b` | provider default | infeasible_dds_400msps | 0 | infeasible | refine → infeasible |
| `infeasible_dds_400msps/20261008-130926-78ac` | `deepseek/deepseek-v4.1-flash` | provider default | infeasible_dds_400msps | 0 | infeasible | refine → infeasible |
| `infeasible_dds_400msps/20261008-131200-c572` | `deepseek/deepseek-v4.1-flash` | provider default | infeasible_dds_400msps | 1 | infeasible | add_family → refine → infeasible |
| `infeasible_dds_400msps/20261008-131248-e1ad` | `deepseek/deepseek-v4.1-flash` | provider default | infeasible_dds_400msps | 2 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-132157-9c57` | `qwen/qwen3.8-27b` | provider default | infeasible_dds_400msps | 1 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-133218-32c5` | `qwen/qwen3.8-27b` | provider default | infeasible_dds_400msps | 2 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-143948-c157` | `qwen/qwen3.8-27b` | off | infeasible_dds_400msps | 0 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-144006-4206` | `qwen/qwen3.8-27b` | off | infeasible_dds_400msps | 1 | infeasible | infeasible |
| `infeasible_dds_400msps/20261008-144030-b0d6` | `qwen/qwen3.8-27b` | off | infeasible_dds_400msps | 2 | infeasible | infeasible |
| `low_area_control/20261008-130322-0d9f` | `anthropic/claude-sonnet-5.5` | provider default | low_area_control | 0 | converged | refine → refine |
| `low_area_control/20261008-130343-f1ac` | `anthropic/claude-sonnet-5.5` | provider default | low_area_control | 1 | stopped | refine → refine → refine → stop |
| `low_area_control/20261008-130417-8845` | `anthropic/claude-sonnet-5.5` | provider default | low_area_control | 2 | converged | refine → refine |
| `low_area_control/20261008-130854-a026` | `qwen/qwen3.8-27b` | provider default | low_area_control | 0 | stopped | refine → stop |
| `low_area_control/20261008-131321-229a` | `deepseek/deepseek-v4.1-flash` | provider default | low_area_control | 0 | converged | add_family → refine → refine |
| `low_area_control/20261008-131630-bc18` | `deepseek/deepseek-v4.1-flash` | provider default | low_area_control | 1 | converged | refine → widen → refine |
| `low_area_control/20261008-131838-2512` | `deepseek/deepseek-v4.1-flash` | provider default | low_area_control | 2 | converged | refine → refine |
| `low_area_control/20261008-132859-b040` | `qwen/qwen3.8-27b` | provider default | low_area_control | 1 | stopped | stop |
| `low_area_control/20261008-133900-b693` | `qwen/qwen3.8-27b` | provider default | low_area_control | 2 | stopped | stop |
| `low_area_control/20261008-143947-0a8c` | `qwen/qwen3.8-27b` | off | low_area_control | 0 | stopped | refine → refine → refine → stop |
| `low_area_control/20261008-144056-2ab6` | `qwen/qwen3.8-27b` | off | low_area_control | 1 | stopped | refine → refine → refine → stop |
| `low_area_control/20261008-144158-572c` | `qwen/qwen3.8-27b` | off | low_area_control | 2 | stopped | refine → stop |
