/**
 * The cost and labour calculator (Results). Every agent figure is driven by the measured means
 * of the recorded runs (provider-reported cost per run, timed wall-clock per run, evaluations
 * per run, per model); everything about people (an hourly rate, the hours a manual study takes)
 * is entered by the reader, with no defaults. The output is a projection, and says so.
 */
import type { ModelCost } from "./data";

export type CalcInput = {
  specs: number;
  /** Runs per spec per model (the eval used 3 seeds). */
  runsPerSpec: number;
  /** Agents running at once. */
  parallel: number;
  models: string[];
  /** The reader's own figures; null until entered. */
  hourlyRate: number | null;
  hoursPerStudy: number | null;
};

export type CalcOutput = {
  runs: number;
  evaluations: number;
  llmUsd: number;
  usdPerDesign: number;
  /** Agent wall-clock, one run after another. */
  agentHoursSerial: number;
  /** The same runs spread over `parallel` agents (ideal split, no rate limits). */
  agentHoursParallel: number;
  /** Null until the reader enters both figures. */
  manualHours: number | null;
  manualUsd: number | null;
};

export function calculate(input: CalcInput, models: ModelCost[]): CalcOutput {
  const chosen = models.filter((m) => input.models.includes(m.model));
  const specs = Math.max(0, Math.floor(input.specs));
  const per = Math.max(0, Math.floor(input.runsPerSpec));
  const par = Math.max(1, Math.floor(input.parallel));
  const runsEach = specs * per;
  let usd = 0;
  let evals = 0;
  let seconds = 0;
  for (const m of chosen) {
    usd += runsEach * m.cost_per_run;
    evals += runsEach * (m.evals / m.runs);
    seconds += runsEach * m.wall_s_mean;
  }
  const manual =
    input.hoursPerStudy !== null && input.hoursPerStudy >= 0
      ? specs * input.hoursPerStudy
      : null;
  return {
    runs: runsEach * chosen.length,
    evaluations: evals,
    llmUsd: usd,
    usdPerDesign: evals > 0 ? usd / evals : 0,
    agentHoursSerial: seconds / 3600,
    agentHoursParallel: seconds / 3600 / par,
    manualHours: manual,
    manualUsd:
      manual !== null && input.hourlyRate !== null && input.hourlyRate >= 0
        ? manual * input.hourlyRate
        : null,
  };
}

/** Parse a number field: empty or invalid means "not entered". */
export function parseEntry(text: string): number | null {
  const t = text.trim();
  if (t === "") return null;
  const v = Number(t);
  return Number.isFinite(v) && v >= 0 ? v : null;
}
