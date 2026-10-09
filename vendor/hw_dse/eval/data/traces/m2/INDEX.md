# M2 eval run index

Each directory holds `llm_trace.jsonl` (every LLM call, key-redacted in code and scanned again by `scripts/archive_traces.py`), `evaluations.csv.gz` and `report.md`, copied from the live M2 runs' `runs/` output (PNG plots and SQLite checkpoints omitted). Summary JSONs are in `eval/data/agent_m2/` (and `agent_m2_pilot/` for the pilot). Provider-reported cost of these runs: $1.6654.

| run dir | model | kind | spec | seed | status | LLM decisions | front-mapping rounds | cost (USD) |
|---|---|---|---|---|---|---|---|---|
| `pilot/dds_250msps/20261009-074313-3d22` | `qwen/qwen3.8-27b, reasoning off` | pilot | dds_250msps | 0 | stopped | refine → refine → stop | 1 | 0.0079 |
| `pilot/low_area_control/20261009-074351-1871` | `qwen/qwen3.8-27b, reasoning off` | pilot | low_area_control | 0 | stopped | refine → map_front → map_front → stop | 2 | 0.0087 |
| `dds_250msps/20261009-074844-813b` | `anthropic/claude-sonnet-5.5` | eval | dds_250msps | 0 | stopped | refine → refine → stop | 1 | 0.0680 |
| `dds_250msps/20261009-074915-c477` | `anthropic/claude-sonnet-5.5` | eval | dds_250msps | 1 | stopped | refine → refine → stop | 1 | 0.0770 |
| `dds_250msps/20261009-074949-b300` | `anthropic/claude-sonnet-5.5` | eval | dds_250msps | 2 | stopped | refine → refine → stop | 1 | 0.0683 |
| `dds_250msps/20261009-075018-f938` | `anthropic/claude-sonnet-5.5` | eval | dds_250msps | 3 | stopped | refine → refine → stop | 1 | 0.0706 |
| `dds_250msps/20261009-075047-6ec6` | `anthropic/claude-sonnet-5.5` | eval | dds_250msps | 4 | stopped | refine → map_front → refine → stop | 2 | 0.0874 |
| `high_precision/20261009-075121-d836` | `anthropic/claude-sonnet-5.5` | eval | high_precision | 0 | stopped | refine → refine → stop | 1 | 0.0782 |
| `high_precision/20261009-075156-6614` | `anthropic/claude-sonnet-5.5` | eval | high_precision | 1 | converged | refine → refine | 1 | 0.0666 |
| `high_precision/20261009-075230-cff1` | `anthropic/claude-sonnet-5.5` | eval | high_precision | 2 | converged | refine → refine | 1 | 0.0645 |
| `high_precision/20261009-075303-001a` | `anthropic/claude-sonnet-5.5` | eval | high_precision | 3 | stopped | refine → refine → stop | 1 | 0.0796 |
| `high_precision/20261009-075340-7b1e` | `anthropic/claude-sonnet-5.5` | eval | high_precision | 4 | converged | refine → refine | 1 | 0.0648 |
| `infeasible_dds_400msps/20261009-075413-77ab` | `anthropic/claude-sonnet-5.5` | eval | infeasible_dds_400msps | 0 | infeasible | infeasible | 0 | 0.0359 |
| `infeasible_dds_400msps/20261009-075431-5f3f` | `anthropic/claude-sonnet-5.5` | eval | infeasible_dds_400msps | 1 | infeasible | infeasible | 0 | 0.0334 |
| `infeasible_dds_400msps/20261009-075448-e0b5` | `anthropic/claude-sonnet-5.5` | eval | infeasible_dds_400msps | 2 | infeasible | infeasible | 0 | 0.0339 |
| `infeasible_dds_400msps/20261009-075505-1245` | `anthropic/claude-sonnet-5.5` | eval | infeasible_dds_400msps | 3 | infeasible | infeasible | 0 | 0.0355 |
| `infeasible_dds_400msps/20261009-075522-bfef` | `anthropic/claude-sonnet-5.5` | eval | infeasible_dds_400msps | 4 | infeasible | infeasible | 0 | 0.0321 |
| `low_area_control/20261009-075538-feca` | `anthropic/claude-sonnet-5.5` | eval | low_area_control | 0 | stopped | refine → map_front → map_front → stop | 3 | 0.0776 |
| `low_area_control/20261009-075604-a7b0` | `anthropic/claude-sonnet-5.5` | eval | low_area_control | 1 | stopped | refine → refine → stop | 1 | 0.0688 |
| `low_area_control/20261009-075630-8e33` | `anthropic/claude-sonnet-5.5` | eval | low_area_control | 2 | stopped | refine → map_front → map_front → stop | 3 | 0.0779 |
| `low_area_control/20261009-075659-ee90` | `anthropic/claude-sonnet-5.5` | eval | low_area_control | 3 | stopped | refine → map_front → refine → stop | 2 | 0.0873 |
| `low_area_control/20261009-075733-42cd` | `anthropic/claude-sonnet-5.5` | eval | low_area_control | 4 | stopped | refine → refine → stop | 1 | 0.0675 |
| `dds_250msps/20261009-074844-f588` | `deepseek/deepseek-v4.1-flash` | eval | dds_250msps | 0 | stopped | map_front → map_front → map_front → stop | 3 | 0.0113 |
| `dds_250msps/20261009-074922-af83` | `deepseek/deepseek-v4.1-flash` | eval | dds_250msps | 1 | converged | widen → add_family | 1 | 0.0091 |
| `dds_250msps/20261009-075257-5f7a` | `deepseek/deepseek-v4.1-flash` | eval | dds_250msps | 2 | stopped | map_front → map_front → map_front → stop | 3 | 0.0141 |
| `dds_250msps/20261009-075414-d190` | `deepseek/deepseek-v4.1-flash` | eval | dds_250msps | 3 | stopped | map_front → refine → map_front → stop | 2 | 0.0129 |
| `dds_250msps/20261009-075512-0590` | `deepseek/deepseek-v4.1-flash` | eval | dds_250msps | 4 | stopped | map_front → refine → map_front → stop | 2 | 0.0112 |
| `high_precision/20261009-075741-f488` | `deepseek/deepseek-v4.1-flash` | eval | high_precision | 0 | stopped | add_family → map_front → map_front → stop | 3 | 0.0086 |
| `high_precision/20261009-075902-bdaf` | `deepseek/deepseek-v4.1-flash` | eval | high_precision | 1 | stopped | map_front → map_front → map_front → stop | 3 | 0.0091 |
| `high_precision/20261009-075948-3b43` | `deepseek/deepseek-v4.1-flash` | eval | high_precision | 2 | stopped | map_front → map_front → map_front → stop | 3 | 0.0072 |
| `high_precision/20261009-080025-0602` | `deepseek/deepseek-v4.1-flash` | eval | high_precision | 3 | stopped | map_front → map_front → map_front → stop | 3 | 0.0090 |
| `high_precision/20261009-080149-93b8` | `deepseek/deepseek-v4.1-flash` | eval | high_precision | 4 | stopped | add_family → map_front → map_front → stop | 3 | 0.0175 |
| `infeasible_dds_400msps/20261009-080352-d021` | `deepseek/deepseek-v4.1-flash` | eval | infeasible_dds_400msps | 0 | infeasible | refine → infeasible | 0 | 0.0073 |
| `infeasible_dds_400msps/20261009-080429-ce54` | `deepseek/deepseek-v4.1-flash` | eval | infeasible_dds_400msps | 1 | infeasible | widen → infeasible | 0 | 0.0078 |
| `infeasible_dds_400msps/20261009-080515-e1a9` | `deepseek/deepseek-v4.1-flash` | eval | infeasible_dds_400msps | 2 | infeasible | refine → infeasible | 0 | 0.0132 |
| `infeasible_dds_400msps/20261009-080606-9d81` | `deepseek/deepseek-v4.1-flash` | eval | infeasible_dds_400msps | 3 | infeasible | infeasible | 0 | 0.0056 |
| `infeasible_dds_400msps/20261009-080641-191c` | `deepseek/deepseek-v4.1-flash` | eval | infeasible_dds_400msps | 4 | infeasible | add_family → infeasible | 0 | 0.0092 |
| `low_area_control/20261009-080733-cb48` | `deepseek/deepseek-v4.1-flash` | eval | low_area_control | 0 | stopped | widen → refine → stop | 1 | 0.0180 |
| `low_area_control/20261009-081007-464d` | `deepseek/deepseek-v4.1-flash` | eval | low_area_control | 1 | stopped | add_family → map_front → refine → stop | 2 | 0.0243 |
| `low_area_control/20261009-081319-e153` | `deepseek/deepseek-v4.1-flash` | eval | low_area_control | 2 | stopped | widen → map_front → map_front → stop | 3 | 0.0105 |
| `low_area_control/20261009-081554-092c` | `deepseek/deepseek-v4.1-flash` | eval | low_area_control | 3 | stopped | add_family → map_front → map_front → stop | 3 | 0.0122 |
| `low_area_control/20261009-081715-7e7c` | `deepseek/deepseek-v4.1-flash` | eval | low_area_control | 4 | stopped | map_front → map_front → map_front → stop | 3 | 0.0105 |
| `dds_250msps/20261009-074844-a961` | `qwen/qwen3.8-27b, reasoning off` | eval | dds_250msps | 0 | stopped | refine → map_front → map_front → stop | 3 | 0.0078 |
| `dds_250msps/20261009-074940-23e9` | `qwen/qwen3.8-27b, reasoning off` | eval | dds_250msps | 1 | stopped | refine → refine → stop | 1 | 0.0072 |
| `dds_250msps/20261009-075033-3532` | `qwen/qwen3.8-27b, reasoning off` | eval | dds_250msps | 2 | stopped | refine → map_front → map_front → stop | 3 | 0.0077 |
| `dds_250msps/20261009-075137-a231` | `qwen/qwen3.8-27b, reasoning off` | eval | dds_250msps | 3 | converged | refine → refine | 1 | 0.0064 |
| `dds_250msps/20261009-075209-a61c` | `qwen/qwen3.8-27b, reasoning off` | eval | dds_250msps | 4 | converged | add_family → refine | 1 | 0.0077 |
| `high_precision/20261009-075250-840d` | `qwen/qwen3.8-27b, reasoning off` | eval | high_precision | 0 | converged | add_family → refine | 1 | 0.0076 |
| `high_precision/20261009-075330-3c63` | `qwen/qwen3.8-27b, reasoning off` | eval | high_precision | 1 | stopped | add_family → map_front → map_front → stop | 3 | 0.0075 |
| `high_precision/20261009-075421-94f3` | `qwen/qwen3.8-27b, reasoning off` | eval | high_precision | 2 | stopped | refine → map_front → map_front → stop | 3 | 0.0073 |
| `high_precision/20261009-075549-f97b` | `qwen/qwen3.8-27b, reasoning off` | eval | high_precision | 3 | stopped | refine → refine → stop | 1 | 0.0095 |
| `high_precision/20261009-075618-1287` | `qwen/qwen3.8-27b, reasoning off` | eval | high_precision | 4 | stopped | refine → map_front → map_front → stop | 3 | 0.0072 |
| `infeasible_dds_400msps/20261009-075653-743c` | `qwen/qwen3.8-27b, reasoning off` | eval | infeasible_dds_400msps | 0 | infeasible | infeasible | 0 | 0.0035 |
| `infeasible_dds_400msps/20261009-075751-e3a4` | `qwen/qwen3.8-27b, reasoning off` | eval | infeasible_dds_400msps | 1 | infeasible | infeasible | 0 | 0.0040 |
| `infeasible_dds_400msps/20261009-075816-5d8c` | `qwen/qwen3.8-27b, reasoning off` | eval | infeasible_dds_400msps | 2 | infeasible | infeasible | 0 | 0.0063 |
| `infeasible_dds_400msps/20261009-075848-a08d` | `qwen/qwen3.8-27b, reasoning off` | eval | infeasible_dds_400msps | 3 | infeasible | infeasible | 0 | 0.0045 |
| `infeasible_dds_400msps/20261009-075906-b56e` | `qwen/qwen3.8-27b, reasoning off` | eval | infeasible_dds_400msps | 4 | infeasible | infeasible | 0 | 0.0043 |
| `low_area_control/20261009-075918-8a05` | `qwen/qwen3.8-27b, reasoning off` | eval | low_area_control | 0 | stopped | refine → map_front → map_front → stop | 3 | 0.0076 |
| `low_area_control/20261009-080035-4c77` | `qwen/qwen3.8-27b, reasoning off` | eval | low_area_control | 1 | stopped | refine → add_family → stop | 1 | 0.0087 |
| `low_area_control/20261009-080112-fd09` | `qwen/qwen3.8-27b, reasoning off` | eval | low_area_control | 2 | stopped | refine → refine → stop | 1 | 0.0097 |
| `low_area_control/20261009-080242-43fb` | `qwen/qwen3.8-27b, reasoning off` | eval | low_area_control | 3 | stopped | refine → map_front → refine → stop | 2 | 0.0115 |
| `low_area_control/20261009-080349-4582` | `qwen/qwen3.8-27b, reasoning off` | eval | low_area_control | 4 | stopped | refine → refine → stop | 1 | 0.0092 |
