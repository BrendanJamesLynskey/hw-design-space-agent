"use client";

/**
 * Pick one of the 48 recorded runs (spec, model, seed) and load its file. Shared by the trace
 * replay and the Pareto replay. While a newly picked run loads, the previous one stays on
 * screen; the animation restarts when the new one arrives.
 */
import { useEffect, useState } from "react";

import { Segmented } from "@/components/ui/Controls";
import { SPEC_ORDER } from "@/lib/dse/data";
import { MODELS, findRun, type RunData } from "@/lib/dse/runs";

import { loadRun } from "./loadRun";

export type RunPick = { spec: string; model: string; seed: number };

export function useRun(
  initial: RunPick,
  specs: readonly string[] = SPEC_ORDER,
): {
  run: RunData | null;
  pick: RunPick;
  controls: JSX.Element;
} {
  const [pick, setPick] = useState<RunPick>(initial);
  const [run, setRun] = useState<RunData | null>(null);
  const id = findRun(pick.spec, pick.model, pick.seed)!.id;
  useEffect(() => {
    let live = true;
    void loadRun(id).then((r) => {
      if (live) setRun(r);
    });
    return () => {
      live = false;
    };
  }, [id]);
  const controls = (
    <>
      <Segmented
        label="Spec"
        value={pick.spec}
        options={specs.map((s) => ({ value: s, label: s }))}
        onChange={(spec) => setPick({ ...pick, spec })}
      />
      <Segmented
        label="Model"
        value={pick.model}
        options={MODELS.map((m) => ({ value: m.model, label: m.label }))}
        onChange={(model) => setPick({ ...pick, model })}
      />
      <Segmented
        label="Seed"
        value={String(pick.seed)}
        options={["0", "1", "2"].map((s) => ({ value: s, label: s }))}
        onChange={(s) => setPick({ ...pick, seed: Number(s) })}
      />
    </>
  );
  return { run, pick, controls };
}
