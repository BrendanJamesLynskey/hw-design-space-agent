/**
 * Server wrappers that hand the site data to the client widgets, for use in the MDX pages
 * (MDX passes no data of its own). Each animation's equation comes through as children.
 */
import type { ReactNode } from "react";

import { ev, site, why } from "@/lib/dse/data";
import { ladder } from "@/lib/dse/ladder";
import { m3 } from "@/lib/dse/m3";
import { m4 } from "@/lib/dse/m4";

import {
  AsicTargets,
  Calculator,
  DeadlineReplay,
  FleetRun,
  HeldOut,
  CycleRtl,
  DescentWidget,
  HighPrecisionStory,
  M1M2Shift,
  MeasuredScatter,
  CordicWidget,
  DatapathWidget,
  HillClimbWidget,
  HvRace,
  ParetoChart,
  ParetoReplay,
  SystemReplay,
  TraceReplay,
} from "./lazy";

export function WhyClimb({ children }: { children?: ReactNode }): JSX.Element {
  return (
    <HillClimbWidget climb={why.hill_climb} gt={site.ground_truth.dds_250msps!}>
      {children}
    </HillClimbWidget>
  );
}

export function CaseCordic({
  children,
}: {
  children?: ReactNode;
}): JSX.Element {
  return <CordicWidget>{children}</CordicWidget>;
}

export function CaseDatapath({
  children,
}: {
  children?: ReactNode;
}): JSX.Element {
  return <DatapathWidget>{children}</DatapathWidget>;
}

const FRONT_SPECS = ["dds_250msps", "low_area_control", "high_precision"];

export function CasePareto(): JSX.Element {
  return (
    <ParetoChart
      specs={Object.fromEntries(FRONT_SPECS.map((s) => [s, site.specs[s]!]))}
      truths={Object.fromEntries(
        FRONT_SPECS.map((s) => [s, site.ground_truth[s]!]),
      )}
      names={FRONT_SPECS}
    />
  );
}

export function HowTrace(): JSX.Element {
  return <TraceReplay />;
}

export function ResultsReplay(): JSX.Element {
  return <ParetoReplay />;
}

export function ResultsRace(): JSX.Element {
  return <HvRace />;
}

export function ResultsCalculator(): JSX.Element {
  return <Calculator models={ev("m2").costs.models} />;
}

/** One design down the ladder (How it works): the worked example and its family's proofs. */
export function HowDescent(): JSX.Element {
  return (
    <DescentWidget
      worked={ladder.worked}
      formal={ladder.formal.rows.filter(
        (r) => r.family === ladder.worked.family,
      )}
    />
  );
}

export function CaseScatter(): JSX.Element {
  return (
    <MeasuredScatter
      scatter={ladder.scatter}
      nFit={ladder.l5.vivado.n_fit_points}
    />
  );
}

export function CaseHighPrecision(): JSX.Element {
  return <HighPrecisionStory hp={ladder.high_precision} />;
}

export function ResultsShift(): JSX.Element {
  const labels = Object.fromEntries(
    ev("m2").costs.models.map((m) => [m.model, m.label]),
  );
  return <M1M2Shift glance={site.glance} labels={labels} />;
}

/** L2 in its system (How it works): multiaxis_control simulated for the three views' winners. */
export function HowSystem(): JSX.Element {
  return <SystemReplay rep={m3.system_replay} />;
}

/** The cycle model against the generated RTL (How it works). */
export function HowCycle(): JSX.Element {
  return <CycleRtl cycle={m3.cycle} />;
}

/** FPGA against ASIC on the three ASIC specs (How it works). */
export function HowAsic(): JSX.Element {
  return <AsicTargets specs={m4.ground_truth.specs} />;
}

/** The nine held-out sky130 designs, measured against the model (How it works). */
export function HowHeldOut(): JSX.Element {
  return <HeldOut held={m4.held_out} specs={m4.ground_truth.specs} />;
}

/** The asic_multiaxis_control winner at its estimated and its measured clock: M3's replay. */
export function HowDeadline(): JSX.Element {
  return <DeadlineReplay rep={m4.deadline} />;
}

/** One real fleet run, then the paired A/B (How it works). */
export function HowFleet(): JSX.Element {
  return <FleetRun run={m4.fleet_run} />;
}
