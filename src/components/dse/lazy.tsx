"use client";

/**
 * Code-split client widgets: each loads its own chunk after the page shell, so pages stay
 * light (the companion sites' pattern). Each animation takes its equation as server-rendered
 * children.
 */
import dynamic from "next/dynamic";

function Placeholder({ what }: { what: string }): JSX.Element {
  return (
    <p
      data-pending-widget
      className="my-8 min-h-96 text-sm text-neutral-600 dark:text-neutral-400"
    >
      Loading the {what}…
    </p>
  );
}

const loading = (what: string) =>
  function Loading(): JSX.Element {
    return <Placeholder what={what} />;
  };

export const LadderHero = dynamic(() => import("./LadderHero"), {
  ssr: false,
  loading: loading("animation"),
});
export const HillClimbWidget = dynamic(() => import("./HillClimbWidget"), {
  ssr: false,
  loading: loading("animation"),
});
export const CordicWidget = dynamic(() => import("./CordicWidget"), {
  ssr: false,
  loading: loading("animation"),
});
export const DatapathWidget = dynamic(() => import("./DatapathWidget"), {
  ssr: false,
  loading: loading("animation"),
});
export const ParetoChart = dynamic(() => import("./ParetoChart"), {
  ssr: false,
  loading: loading("chart"),
});
export const TraceReplay = dynamic(() => import("./TraceReplay"), {
  ssr: false,
  loading: loading("animation"),
});
export const ParetoReplay = dynamic(() => import("./ParetoReplay"), {
  ssr: false,
  loading: loading("animation"),
});
export const HvRace = dynamic(() => import("./HvRace"), {
  ssr: false,
  loading: loading("animation"),
});
export const Calculator = dynamic(() => import("./Calculator"), {
  ssr: false,
  loading: loading("calculator"),
});
export const DescentWidget = dynamic(() => import("./DescentWidget"), {
  ssr: false,
  loading: loading("animation"),
});
export const MeasuredScatter = dynamic(() => import("./MeasuredScatter"), {
  ssr: false,
  loading: loading("animation"),
});
export const HighPrecisionStory = dynamic(
  () => import("./HighPrecisionStory"),
  { ssr: false, loading: loading("animation") },
);
export const M1M2Shift = dynamic(() => import("./M1M2Shift"), {
  ssr: false,
  loading: loading("animation"),
});
