/**
 * Load one recorded run's file on demand: one chunk per run, so a page carries only the run it
 * shows. (Outside src/lib: the bundler turns the template import into one loader per file.)
 */
import type { RunData } from "@/lib/dse/runs";

export async function loadRun(id: string): Promise<RunData> {
  const m = (await import(`@/data/runs/${id}.json`)) as { default: RunData };
  return m.default;
}
