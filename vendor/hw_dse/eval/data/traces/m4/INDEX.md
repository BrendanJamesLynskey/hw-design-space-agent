# M4 live run index

Each structured run directory holds `llm_trace.jsonl` (every LLM call; key-redacted in code and scanned again by `scripts/archive_traces_m4.py`), `report.md` and `evaluations.csv.gz`; a fleet run holds the same per member run, under `<member>-p<phase>/`. Summary JSONs: `eval/data/agent_m4/`, `fleet_m4/`, `m4_pilot/`. Provider-reported cost of these runs: $3.8366.

| run dir | model | arm | spec | seed | status | decisions | cost (USD) |
|---|---|---|---|---|---|---|---|
| `fleet/asic_multiaxis_control/seed0-20261010-205254` | `anthropic/claude-sonnet-5.5` | fleet | asic_multiaxis_control | 0 | stopped | add_family → stop → stop → widen → stop | 0.1453 |
| `fleet/asic_multiaxis_control/seed1-20261010-205347` | `anthropic/claude-sonnet-5.5` | fleet | asic_multiaxis_control | 1 | stopped | add_family → stop → stop → refine → stop | 0.1510 |
| `fleet/asic_multiaxis_control/seed2-20261010-205443` | `anthropic/claude-sonnet-5.5` | fleet | asic_multiaxis_control | 2 | stopped | add_family → stop → stop → refine → stop | 0.1473 |
| `fleet/asic_multiaxis_control/seed3-20261010-205536` | `anthropic/claude-sonnet-5.5` | fleet | asic_multiaxis_control | 3 | stopped | add_family → stop → stop → refine → stop | 0.1513 |
| `fleet/asic_multiaxis_control/seed4-20261010-205629` | `anthropic/claude-sonnet-5.5` | fleet | asic_multiaxis_control | 4 | stopped | add_family → stop → stop → refine → stop | 0.1491 |
| `fleet/asic_low_area/seed0-20261010-190806` | `deepseek/deepseek-v4.1-flash` | fleet | asic_low_area | 0 | stopped | stop → stop → map_front → map_front → stop | 0.0209 |
| `fleet/asic_low_area/seed1-20261010-191909` | `deepseek/deepseek-v4.1-flash` | fleet | asic_low_area | 1 | stopped | stop → stop → map_front → map_front → stop | 0.0147 |
| `fleet/asic_low_area/seed2-20261010-193152` | `deepseek/deepseek-v4.1-flash` | fleet | asic_low_area | 2 | stopped | stop → stop → map_front → refine → stop | 0.0241 |
| `fleet/asic_low_area/seed3-20261010-194351` | `deepseek/deepseek-v4.1-flash` | fleet | asic_low_area | 3 | stopped | stop → stop → map_front → refine → stop | 0.0170 |
| `fleet/asic_low_area/seed4-20261010-201442` | `deepseek/deepseek-v4.1-flash` | fleet | asic_low_area | 4 | stopped | stop → stop → refine → stop | 0.0217 |
| `fleet/asic_multiaxis_control/seed0-20261010-191303` | `deepseek/deepseek-v4.1-flash` | fleet | asic_multiaxis_control | 0 | stopped | add_family → stop → stop → map_front → map_front → stop | 0.0204 |
| `fleet/asic_multiaxis_control/seed1-20261010-192311` | `deepseek/deepseek-v4.1-flash` | fleet | asic_multiaxis_control | 1 | stopped | add_family → stop → stop → map_front → map_front → stop | 0.0374 |
| `fleet/asic_multiaxis_control/seed2-20261010-193605` | `deepseek/deepseek-v4.1-flash` | fleet | asic_multiaxis_control | 2 | stopped | add_family → stop → stop → widen → stop | 0.0416 |
| `fleet/asic_multiaxis_control/seed3-20261010-195059` | `deepseek/deepseek-v4.1-flash` | fleet | asic_multiaxis_control | 3 | stopped | add_family → stop → stop → map_front → map_front → stop | 0.0379 |
| `fleet/asic_multiaxis_control/seed4-20261010-203623` | `deepseek/deepseek-v4.1-flash` | fleet | asic_multiaxis_control | 4 | stopped | add_family → stop → stop → map_front → map_front → stop | 0.0437 |
| `fleet/asic_power_50msps/seed0-20261010-191032` | `deepseek/deepseek-v4.1-flash` | fleet | asic_power_50msps | 0 | stopped | add_family → stop → stop → map_front → refine → stop | 0.0245 |
| `fleet/asic_power_50msps/seed1-20261010-192042` | `deepseek/deepseek-v4.1-flash` | fleet | asic_power_50msps | 1 | stopped | add_family → stop → stop → map_front → map_front → stop | 0.0255 |
| `fleet/asic_power_50msps/seed2-20261010-193416` | `deepseek/deepseek-v4.1-flash` | fleet | asic_power_50msps | 2 | stopped | add_family → infeasible → stop → map_front → map_front → stop | 0.0180 |
| `fleet/asic_power_50msps/seed3-20261010-194547` | `deepseek/deepseek-v4.1-flash` | fleet | asic_power_50msps | 3 | stopped | add_family → stop → stop → map_front → widen → stop | 0.0291 |
| `fleet/asic_power_50msps/seed4-20261010-201713` | `deepseek/deepseek-v4.1-flash` | fleet | asic_power_50msps | 4 | stopped | add_family → stop → stop → stop | 0.0182 |
| `fleet/low_area_control/seed0-20261010-191505` | `deepseek/deepseek-v4.1-flash` | fleet | low_area_control | 0 | stopped | stop → stop → map_front → refine → stop | 0.0228 |
| `fleet/low_area_control/seed1-20261010-192721` | `deepseek/deepseek-v4.1-flash` | fleet | low_area_control | 1 | stopped | stop → stop → map_front → map_front → stop | 0.0175 |
| `fleet/low_area_control/seed2-20261010-193940` | `deepseek/deepseek-v4.1-flash` | fleet | low_area_control | 2 | stopped | stop → stop → map_front → map_front → stop | 0.0165 |
| `fleet/low_area_control/seed3-20261010-195419` | `deepseek/deepseek-v4.1-flash` | fleet | low_area_control | 3 | stopped | stop → stop → refine → stop | 0.0339 |
| `fleet/low_area_control/seed4-20261010-204002` | `deepseek/deepseek-v4.1-flash` | fleet | low_area_control | 4 | stopped | stop → stop → add_family → stop → stop | 0.0325 |
| `fleet/multiaxis_control/seed0-20261010-191715` | `deepseek/deepseek-v4.1-flash` | fleet | multiaxis_control | 0 | stopped | add_family → stop → stop → map_front → map_front → stop | 0.0251 |
| `fleet/multiaxis_control/seed1-20261010-192858` | `deepseek/deepseek-v4.1-flash` | fleet | multiaxis_control | 1 | stopped | add_family → stop → stop → map_front → map_front → stop | 0.0345 |
| `fleet/multiaxis_control/seed2-20261010-194136` | `deepseek/deepseek-v4.1-flash` | fleet | multiaxis_control | 2 | stopped | add_family → stop → stop → map_front → refine → stop | 0.0289 |
| `fleet/multiaxis_control/seed3-20261010-195726` | `deepseek/deepseek-v4.1-flash` | fleet | multiaxis_control | 3 | stopped | add_family → stop → stop → stop | 0.0152 |
| `fleet/multiaxis_control/seed4-20261010-204141` | `deepseek/deepseek-v4.1-flash` | fleet | multiaxis_control | 4 | stopped | add_family → infeasible → stop → map_front → map_front → stop | 0.0216 |
| `fleet/asic_low_area/seed0-20261010-165147` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_low_area | 0 | stopped | stop → stop → add_family → stop | 0.0139 |
| `fleet/asic_low_area/seed1-20261010-170025` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_low_area | 1 | stopped | stop → stop → stop → refine → stop | 0.0099 |
| `fleet/asic_low_area/seed2-20261010-171706` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_low_area | 2 | stopped | stop → stop → refine → stop | 0.0120 |
| `fleet/asic_low_area/seed3-20261010-172418` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_low_area | 3 | stopped | stop → stop → add_family → stop | 0.0100 |
| `fleet/asic_low_area/seed4-20261010-174900` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_low_area | 4 | stopped | stop → stop → refine → stop → stop | 0.0115 |
| `fleet/asic_multiaxis_control/seed0-20261010-165424` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_multiaxis_control | 0 | stopped | add_family → infeasible → stop → refine → stop | 0.0148 |
| `fleet/asic_multiaxis_control/seed1-20261010-170206` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_multiaxis_control | 1 | stopped | add_family → infeasible → stop → add_family → stop | 0.0140 |
| `fleet/asic_multiaxis_control/seed2-20261010-171944` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_multiaxis_control | 2 | stopped | add_family → infeasible → stop → add_family → stop | 0.0127 |
| `fleet/asic_multiaxis_control/seed3-20261010-173258` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_multiaxis_control | 3 | stopped | add_family → infeasible → refine → infeasible → add_family → infeasible → stop | 0.0198 |
| `fleet/asic_multiaxis_control/seed4-20261010-175114` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_multiaxis_control | 4 | stopped | add_family → infeasible → stop → add_family → stop | 0.0124 |
| `fleet/asic_power_50msps/seed0-20261010-165319` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_power_50msps | 0 | stopped | add_family → infeasible → stop → refine → stop | 0.0124 |
| `fleet/asic_power_50msps/seed1-20261010-170110` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_power_50msps | 1 | stopped | add_family → infeasible → stop → add_family → stop | 0.0129 |
| `fleet/asic_power_50msps/seed2-20261010-171830` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_power_50msps | 2 | stopped | add_family → infeasible → stop → refine → stop | 0.0121 |
| `fleet/asic_power_50msps/seed3-20261010-172519` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_power_50msps | 3 | stopped | add_family → infeasible → stop → refine → stop | 0.0135 |
| `fleet/asic_power_50msps/seed4-20261010-175012` | `qwen/qwen3.8-27b, reasoning off` | fleet | asic_power_50msps | 4 | stopped | add_family → infeasible → stop → refine → stop | 0.0148 |
| `fleet/low_area_control/seed0-20261010-165840` | `qwen/qwen3.8-27b, reasoning off` | fleet | low_area_control | 0 | stopped | stop → stop → add_family → stop | 0.0113 |
| `fleet/low_area_control/seed1-20261010-170324` | `qwen/qwen3.8-27b, reasoning off` | fleet | low_area_control | 1 | stopped | refine → stop → stop → stop → stop | 0.0128 |
| `fleet/low_area_control/seed2-20261010-172138` | `qwen/qwen3.8-27b, reasoning off` | fleet | low_area_control | 2 | stopped | stop → stop → add_family → stop | 0.0085 |
| `fleet/low_area_control/seed3-20261010-173522` | `qwen/qwen3.8-27b, reasoning off` | fleet | low_area_control | 3 | stopped | stop → stop → add_family → stop | 0.0087 |
| `fleet/low_area_control/seed4-20261010-175308` | `qwen/qwen3.8-27b, reasoning off` | fleet | low_area_control | 4 | stopped | stop → stop → refine → stop → stop | 0.0110 |
| `fleet/multiaxis_control/seed0-20261010-165920` | `qwen/qwen3.8-27b, reasoning off` | fleet | multiaxis_control | 0 | stopped | add_family → infeasible → stop → refine → stop | 0.0120 |
| `fleet/multiaxis_control/seed1-20261010-170858` | `qwen/qwen3.8-27b, reasoning off` | fleet | multiaxis_control | 1 | stopped | add_family → infeasible → stop → refine → stop | 0.0164 |
| `fleet/multiaxis_control/seed2-20261010-172302` | `qwen/qwen3.8-27b, reasoning off` | fleet | multiaxis_control | 2 | stopped | add_family → infeasible → stop → refine → stop | 0.0137 |
| `fleet/multiaxis_control/seed3-20261010-173620` | `qwen/qwen3.8-27b, reasoning off` | fleet | multiaxis_control | 3 | stopped | add_family → infeasible → stop → map_front → refine → stop | 0.0145 |
| `fleet/multiaxis_control/seed4-20261010-175431` | `qwen/qwen3.8-27b, reasoning off` | fleet | multiaxis_control | 4 | stopped | add_family → infeasible → stop → refine → stop | 0.0120 |
| `fleet_v2/asic_low_area/seed0-20261010-222943` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_low_area | 0 | stopped | stop → stop → add_family → stop | 0.0120 |
| `fleet_v2/asic_low_area/seed1-20261010-223749` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_low_area | 1 | stopped | stop → stop → add_family → stop | 0.0088 |
| `fleet_v2/asic_low_area/seed2-20261010-224936` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_low_area | 2 | stopped | stop → stop → add_family → stop | 0.0100 |
| `fleet_v2/asic_low_area/seed3-20261010-225548` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_low_area | 3 | stopped | stop → stop → refine → stop | 0.0116 |
| `fleet_v2/asic_low_area/seed4-20261010-230216` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_low_area | 4 | stopped | stop → stop → add_family → stop | 0.0109 |
| `fleet_v2/asic_multiaxis_control/seed0-20261010-223245` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_multiaxis_control | 0 | stopped | add_family → infeasible → stop → refine → stop | 0.0113 |
| `fleet_v2/asic_multiaxis_control/seed1-20261010-224200` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_multiaxis_control | 1 | stopped | add_family → infeasible → stop → refine → stop | 0.0137 |
| `fleet_v2/asic_multiaxis_control/seed2-20261010-225150` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_multiaxis_control | 2 | stopped | add_family → infeasible → stop → refine → stop | 0.0160 |
| `fleet_v2/asic_multiaxis_control/seed3-20261010-225837` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_multiaxis_control | 3 | stopped | add_family → infeasible → stop → refine → stop | 0.0178 |
| `fleet_v2/asic_multiaxis_control/seed4-20261010-230442` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_multiaxis_control | 4 | stopped | add_family → infeasible → stop → refine → stop | 0.0205 |
| `fleet_v2/asic_power_50msps/seed0-20261010-223058` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_power_50msps | 0 | stopped | add_family → infeasible → stop → add_family → stop | 0.0100 |
| `fleet_v2/asic_power_50msps/seed1-20261010-223924` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_power_50msps | 1 | stopped | add_family → infeasible → stop → refine → stop | 0.0100 |
| `fleet_v2/asic_power_50msps/seed2-20261010-225040` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_power_50msps | 2 | stopped | add_family → infeasible → stop → refine → stop | 0.0112 |
| `fleet_v2/asic_power_50msps/seed3-20261010-225652` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_power_50msps | 3 | stopped | add_family → infeasible → stop → refine → stop | 0.0113 |
| `fleet_v2/asic_power_50msps/seed4-20261010-230248` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | asic_power_50msps | 4 | stopped | add_family → infeasible → stop → refine → stop | 0.0124 |
| `fleet_v2/low_area_control/seed0-20261010-223440` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | low_area_control | 0 | stopped | stop → stop → refine → stop | 0.0086 |
| `fleet_v2/low_area_control/seed1-20261010-224512` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | low_area_control | 1 | stopped | stop → stop → add_family → stop | 0.0122 |
| `fleet_v2/low_area_control/seed2-20261010-225342` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | low_area_control | 2 | stopped | stop → stop → add_family → stop | 0.0102 |
| `fleet_v2/low_area_control/seed3-20261010-230027` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | low_area_control | 3 | stopped | stop → stop → add_family → stop | 0.0143 |
| `fleet_v2/low_area_control/seed4-20261010-230604` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | low_area_control | 4 | stopped | stop → stop → add_family → stop | 0.0132 |
| `fleet_v2/multiaxis_control/seed0-20261010-223637` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | multiaxis_control | 0 | stopped | add_family → infeasible → stop → refine → stop | 0.0157 |
| `fleet_v2/multiaxis_control/seed1-20261010-224721` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | multiaxis_control | 1 | stopped | add_family → infeasible → stop → refine → stop | 0.0177 |
| `fleet_v2/multiaxis_control/seed2-20261010-225426` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | multiaxis_control | 2 | stopped | add_family → infeasible → stop → refine → stop | 0.0187 |
| `fleet_v2/multiaxis_control/seed3-20261010-230103` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | multiaxis_control | 3 | stopped | add_family → infeasible → stop → add_family → stop | 0.0149 |
| `fleet_v2/multiaxis_control/seed4-20261010-230634` | `qwen/qwen3.8-27b, reasoning off` | fleet_v2 | multiaxis_control | 4 | stopped | add_family → infeasible → stop → refine → stop | 0.0143 |
| `pilot-fleet/asic_multiaxis_control/seed0-20261010-162544` | `qwen/qwen3.8-27b, reasoning off` | pilot-fleet | asic_multiaxis_control | 0 | stopped | add_family → infeasible → stop → refine → stop | 0.0158 |
| `single/low_area_control/20261010-183304-e012` | `deepseek/deepseek-v4.1-flash` | single | low_area_control | 0 | stopped | map_front → refine → map_front → stop | 0.0145 |
| `single/low_area_control/20261010-185017-2433` | `deepseek/deepseek-v4.1-flash` | single | low_area_control | 1 | stopped | map_front → map_front → map_front → stop | 0.0148 |
| `single/low_area_control/20261010-185625-b154` | `deepseek/deepseek-v4.1-flash` | single | low_area_control | 2 | stopped | widen → map_front → map_front → stop | 0.0181 |
| `single/low_area_control/20261010-190137-f50f` | `deepseek/deepseek-v4.1-flash` | single | low_area_control | 3 | stopped | map_front → refine → map_front → stop | 0.0109 |
| `single/low_area_control/20261010-190510-1aaf` | `deepseek/deepseek-v4.1-flash` | single | low_area_control | 4 | stopped | map_front → map_front → map_front → stop | 0.0103 |
| `single/multiaxis_control/20261010-183622-841c` | `deepseek/deepseek-v4.1-flash` | single | multiaxis_control | 0 | stopped | map_front → refine → refine → stop | 0.0251 |
| `single/multiaxis_control/20261010-185157-410e` | `deepseek/deepseek-v4.1-flash` | single | multiaxis_control | 1 | stopped | map_front → refine → add_family → stop | 0.0329 |
| `single/multiaxis_control/20261010-185957-8ab7` | `deepseek/deepseek-v4.1-flash` | single | multiaxis_control | 2 | stopped | map_front → refine → map_front → stop | 0.0148 |
| `single/multiaxis_control/20261010-190303-d81a` | `deepseek/deepseek-v4.1-flash` | single | multiaxis_control | 3 | stopped | map_front → refine → map_front → stop | 0.0185 |
| `single/multiaxis_control/20261010-190623-a27a` | `deepseek/deepseek-v4.1-flash` | single | multiaxis_control | 4 | stopped | map_front → refine → map_front → stop | 0.0119 |
| `single/low_area_control/20261010-164032-7e92` | `qwen/qwen3.8-27b, reasoning off` | single | low_area_control | 0 | stopped | add_family → add_family → stop | 0.0107 |
| `single/low_area_control/20261010-164546-ed47` | `qwen/qwen3.8-27b, reasoning off` | single | low_area_control | 1 | stopped | refine → refine → stop | 0.0086 |
| `single/low_area_control/20261010-164713-37c7` | `qwen/qwen3.8-27b, reasoning off` | single | low_area_control | 2 | stopped | refine → refine → stop | 0.0090 |
| `single/low_area_control/20261010-164904-99eb` | `qwen/qwen3.8-27b, reasoning off` | single | low_area_control | 3 | stopped | add_family → refine → stop | 0.0089 |
| `single/low_area_control/20261010-165015-353b` | `qwen/qwen3.8-27b, reasoning off` | single | low_area_control | 4 | stopped | refine → refine → stop | 0.0093 |
| `single/multiaxis_control/20261010-164106-ecb6` | `qwen/qwen3.8-27b, reasoning off` | single | multiaxis_control | 0 | stopped | refine → refine → stop | 0.0110 |
| `single/multiaxis_control/20261010-164642-9feb` | `qwen/qwen3.8-27b, reasoning off` | single | multiaxis_control | 1 | converged | add_family → refine | 0.0059 |
| `single/multiaxis_control/20261010-164824-ce98` | `qwen/qwen3.8-27b, reasoning off` | single | multiaxis_control | 2 | stopped | add_family → refine → stop | 0.0106 |
| `single/multiaxis_control/20261010-164947-b2b5` | `qwen/qwen3.8-27b, reasoning off` | single | multiaxis_control | 3 | stopped | refine → add_family → stop | 0.0079 |
| `single/multiaxis_control/20261010-165124-993e` | `qwen/qwen3.8-27b, reasoning off` | single | multiaxis_control | 4 | converged | add_family → refine | 0.0143 |
| `structured/asic_low_area/20261010-204414-0209` | `anthropic/claude-sonnet-5.5` | structured | asic_low_area | 0 | stopped | refine → refine → stop | 0.0657 |
| `structured/asic_low_area/20261010-204552-e0c6` | `anthropic/claude-sonnet-5.5` | structured | asic_low_area | 1 | stopped | refine → refine → stop | 0.0711 |
| `structured/asic_low_area/20261010-204733-4051` | `anthropic/claude-sonnet-5.5` | structured | asic_low_area | 2 | stopped | refine → refine → stop | 0.0649 |
| `structured/asic_low_area/20261010-204912-783e` | `anthropic/claude-sonnet-5.5` | structured | asic_low_area | 3 | stopped | refine → refine → stop | 0.0671 |
| `structured/asic_low_area/20261010-205049-8da7` | `anthropic/claude-sonnet-5.5` | structured | asic_low_area | 4 | converged | refine → refine | 0.0593 |
| `structured/asic_multiaxis_control/20261010-204507-de78` | `anthropic/claude-sonnet-5.5` | structured | asic_multiaxis_control | 0 | stopped | refine → refine → stop | 0.0915 |
| `structured/asic_multiaxis_control/20261010-204652-b15b` | `anthropic/claude-sonnet-5.5` | structured | asic_multiaxis_control | 1 | stopped | refine → refine → stop | 0.0921 |
| `structured/asic_multiaxis_control/20261010-204827-e9a0` | `anthropic/claude-sonnet-5.5` | structured | asic_multiaxis_control | 2 | stopped | refine → refine → stop | 0.0932 |
| `structured/asic_multiaxis_control/20261010-205003-7311` | `anthropic/claude-sonnet-5.5` | structured | asic_multiaxis_control | 3 | stopped | refine → refine → stop | 0.0961 |
| `structured/asic_multiaxis_control/20261010-205147-7b11` | `anthropic/claude-sonnet-5.5` | structured | asic_multiaxis_control | 4 | stopped | refine → refine → stop | 0.0924 |
| `structured/asic_power_50msps/20261010-204440-4900` | `anthropic/claude-sonnet-5.5` | structured | asic_power_50msps | 0 | stopped | add_family → refine → stop | 0.0676 |
| `structured/asic_power_50msps/20261010-204621-2391` | `anthropic/claude-sonnet-5.5` | structured | asic_power_50msps | 1 | stopped | refine → refine → stop | 0.0738 |
| `structured/asic_power_50msps/20261010-204757-01cf` | `anthropic/claude-sonnet-5.5` | structured | asic_power_50msps | 2 | stopped | add_family → refine → stop | 0.0708 |
| `structured/asic_power_50msps/20261010-204938-8f37` | `anthropic/claude-sonnet-5.5` | structured | asic_power_50msps | 3 | stopped | add_family → refine → stop | 0.0672 |
| `structured/asic_power_50msps/20261010-205117-e870` | `anthropic/claude-sonnet-5.5` | structured | asic_power_50msps | 4 | stopped | refine → refine → stop | 0.0732 |
| `structured/asic_low_area/20261010-180345-8218` | `deepseek/deepseek-v4.1-flash` | structured | asic_low_area | 0 | stopped | map_front → refine → map_front → stop | 0.0121 |
| `structured/asic_low_area/20261010-180949-c3ce` | `deepseek/deepseek-v4.1-flash` | structured | asic_low_area | 1 | stopped | refine → refine → stop | 0.0146 |
| `structured/asic_low_area/20261010-181544-6f7e` | `deepseek/deepseek-v4.1-flash` | structured | asic_low_area | 2 | converged | refine → refine | 0.0184 |
| `structured/asic_low_area/20261010-182131-50c5` | `deepseek/deepseek-v4.1-flash` | structured | asic_low_area | 3 | stopped | map_front → map_front → map_front → stop | 0.0137 |
| `structured/asic_low_area/20261010-182751-4ce1` | `deepseek/deepseek-v4.1-flash` | structured | asic_low_area | 4 | stopped | map_front → map_front → map_front → stop | 0.0204 |
| `structured/asic_multiaxis_control/20261010-180631-4a3b` | `deepseek/deepseek-v4.1-flash` | structured | asic_multiaxis_control | 0 | stopped | refine → map_front → map_front → stop | 0.0232 |
| `structured/asic_multiaxis_control/20261010-181404-a806` | `deepseek/deepseek-v4.1-flash` | structured | asic_multiaxis_control | 1 | stopped | map_front → map_front → map_front → stop | 0.0080 |
| `structured/asic_multiaxis_control/20261010-182015-c819` | `deepseek/deepseek-v4.1-flash` | structured | asic_multiaxis_control | 2 | stopped | map_front → map_front → map_front → stop | 0.0143 |
| `structured/asic_multiaxis_control/20261010-182542-d01e` | `deepseek/deepseek-v4.1-flash` | structured | asic_multiaxis_control | 3 | stopped | map_front → map_front → map_front → stop | 0.0179 |
| `structured/asic_multiaxis_control/20261010-183152-2f7f` | `deepseek/deepseek-v4.1-flash` | structured | asic_multiaxis_control | 4 | stopped | map_front → refine → map_front → stop | 0.0142 |
| `structured/asic_power_50msps/20261010-180445-13ec` | `deepseek/deepseek-v4.1-flash` | structured | asic_power_50msps | 0 | stopped | refine → map_front → map_front → stop | 0.0199 |
| `structured/asic_power_50msps/20261010-181205-9f88` | `deepseek/deepseek-v4.1-flash` | structured | asic_power_50msps | 1 | converged | map_front → refine → refine | 0.0179 |
| `structured/asic_power_50msps/20261010-181855-d43c` | `deepseek/deepseek-v4.1-flash` | structured | asic_power_50msps | 2 | stopped | map_front → map_front → map_front → stop | 0.0133 |
| `structured/asic_power_50msps/20261010-182302-b006` | `deepseek/deepseek-v4.1-flash` | structured | asic_power_50msps | 3 | stopped | map_front → refine → map_front → stop | 0.0176 |
| `structured/asic_power_50msps/20261010-182948-7b98` | `deepseek/deepseek-v4.1-flash` | structured | asic_power_50msps | 4 | stopped | map_front → map_front → map_front → stop | 0.0202 |
| `structured/asic_low_area/20261010-162733-a56c` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_low_area | 0 | stopped | add_family → refine → stop | 0.0128 |
| `structured/asic_low_area/20261010-163009-6e35` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_low_area | 1 | stopped | add_family → add_family → stop | 0.0099 |
| `structured/asic_low_area/20261010-163237-7d1d` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_low_area | 2 | stopped | refine → refine → stop | 0.0074 |
| `structured/asic_low_area/20261010-163548-2686` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_low_area | 3 | stopped | add_family → refine → stop | 0.0062 |
| `structured/asic_low_area/20261010-163807-403f` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_low_area | 4 | converged | add_family → refine | 0.0087 |
| `structured/asic_multiaxis_control/20261010-162846-b7f2` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_multiaxis_control | 0 | stopped | refine → refine → stop | 0.0068 |
| `structured/asic_multiaxis_control/20261010-163114-be20` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_multiaxis_control | 1 | stopped | refine → refine → stop | 0.0073 |
| `structured/asic_multiaxis_control/20261010-163439-9289` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_multiaxis_control | 2 | stopped | refine → refine → stop | 0.0079 |
| `structured/asic_multiaxis_control/20261010-163712-2769` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_multiaxis_control | 3 | stopped | refine → refine → stop | 0.0066 |
| `structured/asic_multiaxis_control/20261010-163936-63a6` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_multiaxis_control | 4 | stopped | refine → refine → stop | 0.0078 |
| `structured/asic_power_50msps/20261010-162803-a2ba` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_power_50msps | 0 | stopped | refine → refine → stop | 0.0101 |
| `structured/asic_power_50msps/20261010-163029-6d4b` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_power_50msps | 1 | converged | refine → refine | 0.0074 |
| `structured/asic_power_50msps/20261010-163339-41ce` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_power_50msps | 2 | stopped | refine → refine → stop | 0.0104 |
| `structured/asic_power_50msps/20261010-163633-8666` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_power_50msps | 3 | converged | refine → refine | 0.0110 |
| `structured/asic_power_50msps/20261010-163839-dc3a` | `qwen/qwen3.8-27b, reasoning off` | structured | asic_power_50msps | 4 | stopped | refine → refine → stop | 0.0090 |
