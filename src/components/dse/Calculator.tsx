"use client";

/**
 * The cost and labour calculator. The agent side runs on the measured means of the recorded
 * runs, per model; the people side (an hourly rate, the hours a manual study takes) is the
 * reader's own and starts empty. The result is a projection and is labelled as one.
 */
import { useId, useState } from "react";

import { calculate, parseEntry } from "@/lib/dse/calc";
import { runDate, type ModelCost } from "@/lib/dse/data";
import { fmtInt, fmtUsd, trim } from "@/lib/format";

import { Prov } from "./Badges";

const INPUT =
  "focus-ring h-11 w-full min-w-0 rounded border border-neutral-300 bg-white px-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-950";

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  testId,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  testId: string;
}): JSX.Element {
  const id = useId();
  return (
    <div className="min-w-0 text-sm">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <input
        id={id}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT} mt-1`}
        data-testid={testId}
      />
      {hint && (
        <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
          {hint}
        </p>
      )}
    </div>
  );
}

const hours = (h: number) =>
  h >= 48
    ? `${trim(h / 24)} days`
    : h >= 1
      ? `${trim(h)} h`
      : `${trim(h * 60)} min`;

export default function Calculator({
  models,
}: {
  models: ModelCost[];
}): JSX.Element {
  const [specs, setSpecs] = useState("10");
  const [runs, setRuns] = useState("5");
  const [parallel, setParallel] = useState("4");
  const [chosen, setChosen] = useState<string[]>([models[0]!.model]);
  const [rate, setRate] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const out = calculate(
    {
      specs: parseEntry(specs) ?? 0,
      runsPerSpec: parseEntry(runs) ?? 0,
      parallel: parseEntry(parallel) ?? 1,
      models: chosen,
      hourlyRate: parseEntry(rate),
      hoursPerStudy: parseEntry(studyHours),
    },
    models,
  );
  return (
    <section
      data-testid="calculator"
      aria-label="Cost and labour calculator"
      className="my-8 min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Interactive · projection from measured means
      </p>
      <p className="mt-1 font-semibold">Cost and labour calculator</p>
      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
        The agent side uses each model&apos;s measured mean cost, wall-clock and
        evaluations per run in the M2 eval (OpenRouter, runs of {runDate("m2")}
        ). The people side is yours: enter your own rate and how long a manual
        trade-off study takes you. Nothing is filled in for you.
      </p>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
        <Field
          label="Specs to explore"
          value={specs}
          onChange={setSpecs}
          testId="calc-specs"
        />
        <Field
          label="Runs per spec, per model"
          hint="the M2 eval used 5 seeds"
          value={runs}
          onChange={setRuns}
          testId="calc-runs"
        />
        <Field
          label="Agents running at once"
          value={parallel}
          onChange={setParallel}
          testId="calc-parallel"
        />
      </div>
      <fieldset className="mt-3 min-w-0">
        <legend className="text-sm font-medium">Models</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {models.map((m) => {
            const on = chosen.includes(m.model);
            return (
              <label
                key={m.model}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded border px-2 text-xs focus-within:ring-2 focus-within:ring-accent ${on ? "border-accent bg-white dark:border-indigo-300 dark:bg-neutral-950" : "border-neutral-300 dark:border-neutral-700"}`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    setChosen(
                      on
                        ? chosen.filter((x) => x !== m.model)
                        : [...chosen, m.model],
                    )
                  }
                  className="size-4 accent-indigo-600"
                />
                <span>
                  {m.label}{" "}
                  <span className="font-mono text-neutral-600 dark:text-neutral-400">
                    {fmtUsd(m.cost_per_run)}/run
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
        <Field
          label="Your hourly rate (any currency)"
          value={rate}
          onChange={setRate}
          placeholder="enter your own"
          testId="calc-rate"
        />
        <Field
          label="Your hours per manual study, per spec"
          value={studyHours}
          onChange={setStudyHours}
          placeholder="enter your own"
          testId="calc-hours"
        />
      </div>
      <div
        className="mt-4 rounded bg-white p-3 text-sm ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800"
        aria-live="polite"
        data-testid="calc-out"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-amber-800 dark:text-amber-300">
          Projection
        </p>
        <ul className="mt-1 space-y-1">
          <li>
            {fmtInt(out.runs)} agent runs, about {fmtInt(out.evaluations)}{" "}
            designs evaluated by code.
          </li>
          <li data-testid="calc-llm">
            LLM cost: <strong>{fmtUsd(out.llmUsd)}</strong> (
            {out.evaluations > 0 ? `$${out.usdPerDesign.toPrecision(2)}` : "$0"}{" "}
            per evaluated design)
            <Prov kind="measured" /> means, provider-reported per run.
          </li>
          <li data-testid="calc-time">
            Agent wall-clock: {hours(out.agentHoursSerial)} one after another,{" "}
            <strong>{hours(out.agentHoursParallel)}</strong> spread over the
            agents running at once (an ideal split, ignoring rate limits).
          </li>
          <li data-testid="calc-manual">
            {out.manualHours === null
              ? "Your manual estimate: enter your hours per study to compare."
              : out.manualUsd === null
                ? `Your manual estimate: ${hours(out.manualHours)} of your time; enter your rate to price it.`
                : `Your manual estimate: ${hours(out.manualHours)} of your time, ${trim(out.manualUsd, 4)} at your rate (same currency), against ${fmtUsd(out.llmUsd)} of LLM usage.`}
          </li>
        </ul>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          Not counted: the compute for the evaluations themselves, the
          engineer&apos;s time to write a spec and review the result, and the
          lower levels: an M2 run explores at L1, and synthesising or simulating
          a design at L3–L5 costs far more per design than the L1 models (the
          repository&apos;s 39-point open-source synthesis sweep takes about 10
          minutes on 4 cores).
        </p>
      </div>
    </section>
  );
}
