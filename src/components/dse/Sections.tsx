/**
 * Server wrappers that hand the site data to the client widgets, for use in the MDX pages
 * (MDX passes no data of its own). Each animation's equation comes through as children.
 */
import type { ReactNode } from "react";

import { site, why } from "@/lib/dse/data";

import {
  Calculator,
  CordicWidget,
  DatapathWidget,
  HillClimbWidget,
  HvRace,
  ParetoChart,
  ParetoReplay,
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
  return <Calculator models={site.costs.models} />;
}
