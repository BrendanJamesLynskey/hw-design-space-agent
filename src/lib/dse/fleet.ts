/**
 * The eval's runs as a fleet: how many ran at once (from their measured start times and
 * wall-clock).
 */
import type { RunIndex } from "./data";

/** The most runs in flight at any moment. */
export function maxConcurrent(runs: RunIndex[]): number {
  const ev = runs
    .flatMap((r) => [
      [r.start_s, 1],
      [r.start_s + r.wall_s, -1],
    ])
    .sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!);
  let n = 0;
  let max = 0;
  for (const [, d] of ev) {
    n += d!;
    max = Math.max(max, n);
  }
  return max;
}

/** The end of the last run, in seconds after the first started. */
export function fleetSpan(runs: RunIndex[]): number {
  return Math.max(...runs.map((r) => r.start_s + r.wall_s));
}
