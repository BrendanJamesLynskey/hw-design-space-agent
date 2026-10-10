/**
 * Small labels used everywhere a number or a level appears:
 * - <Prov kind="exact|estimate|measured|simulated" />: the repo's provenance label for a number;
 * - <LevelBadge status="live|in progress|planned" />: a ladder level's milestone state.
 * Colour is never the only signal: each badge carries its word.
 */
import type { Prov as ProvKind } from "@/lib/dse/data";

const PROV: Record<ProvKind, { cls: string; title: string }> = {
  exact: {
    cls: "border-emerald-700 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300",
    title:
      "exact: computed by the bit-accurate golden model or read off the schedule",
  },
  estimate: {
    cls: "border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-300",
    title:
      "estimate: from the analytical cost model calibrated to two Vivado results",
  },
  measured: {
    cls: "border-sky-700 text-sky-800 dark:border-sky-400 dark:text-sky-300",
    title:
      "measured: recorded from real runs (provider-reported usage, timed wall-clock)",
  },
  simulated: {
    cls: "border-violet-700 text-violet-800 dark:border-violet-400 dark:text-violet-300",
    title:
      "simulated: the L2 SimPy system model (clocked at the design's estimated Fmax) or the golden-model DDS",
  },
};

export function Prov({ kind }: { kind: ProvKind }): JSX.Element {
  const p = PROV[kind];
  return (
    <span
      data-prov={kind}
      title={p.title}
      className={`ml-1 inline-block whitespace-nowrap rounded border px-1 align-middle font-mono text-[0.65rem] uppercase leading-4 tracking-wide ${p.cls}`}
    >
      {kind}
    </span>
  );
}

const LEVEL: Record<string, string> = {
  live: "border-emerald-700 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200",
  "in progress":
    "border-amber-700 bg-amber-50 text-amber-900 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-200",
  planned:
    "border-dashed border-neutral-500 text-neutral-700 dark:border-neutral-400 dark:text-neutral-300",
};

export function LevelBadge({
  status,
  milestone,
}: {
  status: string;
  milestone: string;
}): JSX.Element {
  return (
    <span
      data-badge={status}
      className={`inline-block whitespace-nowrap rounded border px-1.5 font-mono text-[0.7rem] leading-5 ${LEVEL[status] ?? LEVEL.planned}`}
    >
      {status === "live" ? `live (${milestone})` : `${status} (${milestone})`}
    </span>
  );
}
