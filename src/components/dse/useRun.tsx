"use client";

/**
 * Pick one of the recorded runs (milestone, spec, model, seed: 48 in M1, 60 in M2) and load its
 * file. Shared by the trace replay and the Pareto replay. While a newly picked run loads, the
 * previous one stays on screen; the animation restarts when the new one arrives. Switching
 * milestone keeps the spec, and keeps the model and seed where that milestone has them.
 */
import { useEffect, useState } from "react";

import { Segmented } from "@/components/ui/Controls";
import { MS_LABEL, SPEC_ORDER, type MsKey } from "@/lib/dse/data";
import {
  findRun,
  modelsOf,
  seedsOf,
  switchMilestone,
  type RunData,
  type RunPick,
} from "@/lib/dse/runs";

export type { RunPick };

import { loadRun } from "./loadRun";

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
  const id = findRun(pick.ms, pick.spec, pick.model, pick.seed)!.id;
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
        label="Milestone"
        value={pick.ms}
        options={(["m2", "m1"] as const).map((m) => ({
          value: m,
          label: `${MS_LABEL[m]} (${seedsOf(m).length} seeds)`,
        }))}
        onChange={(ms) => setPick(switchMilestone(pick, ms as MsKey))}
      />
      <Segmented
        label="Spec"
        value={pick.spec}
        options={specs.map((s) => ({ value: s, label: s }))}
        onChange={(spec) => setPick({ ...pick, spec })}
      />
      <Segmented
        label="Model"
        value={pick.model}
        options={modelsOf(pick.ms).map((m) => ({
          value: m.model,
          label: m.label,
        }))}
        onChange={(model) => setPick({ ...pick, model })}
      />
      <Segmented
        label="Seed"
        value={String(pick.seed)}
        options={seedsOf(pick.ms).map((s) => ({
          value: String(s),
          label: String(s),
        }))}
        onChange={(s) => setPick({ ...pick, seed: Number(s) })}
      />
    </>
  );
  return { run, pick, controls };
}
