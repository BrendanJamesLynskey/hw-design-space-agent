/**
 * Frame tests on the page (visual standard §4): set key frames of every animation and require
 * the caption on screen to be the caption built from the reference data (the recorded run, the
 * exported hill-climb, the Python fixtures of the golden model and the schedule).
 */
import { expect, test, type Locator } from "@playwright/test";

import dsRun from "../../src/data/runs/dds_250msps__20261008-125907-9473.json";
import heroRun from "../../src/data/runs/high_precision__20261008-130043-d1d3.json";
import infRun from "../../src/data/runs/infeasible_dds_400msps__20261008-130229-2502.json";
import cordicFx from "../fixtures/cordic.json";

import {
  climbCaption,
  datapathCaption,
  heroCaption,
  raceCaption,
  replayCaption,
  rotationCaption,
  traceCaption,
} from "@/lib/dse/captions";
import { climbFrames } from "@/lib/dse/climb";
import { rotate, type Numerics } from "@/lib/dse/cordic";
import { site, why } from "@/lib/dse/data";
import { datapathFrame } from "@/lib/dse/datapath";
import { arch } from "@/lib/dse/families";
import { heroFrames } from "@/lib/dse/hero";
import { race, raceSteps } from "@/lib/dse/race";
import { replayFrames } from "@/lib/dse/replay";
import type { RunData } from "@/lib/dse/runs";
import { traceFrames } from "@/lib/dse/trace";

import { WIDGET_TIMEOUT } from "./pages";

test.use({ contextOptions: { reducedMotion: "reduce" } });

async function frame(fig: Locator, i: number, want: string): Promise<void> {
  await fig.getByTestId("scrub").fill(String(i));
  await expect(fig).toHaveAttribute("data-step", String(i));
  await expect(fig.getByTestId("caption")).toHaveText(want);
}

const keySteps = (n: number) => [...new Set([0, 1, Math.floor(n / 2), n - 1])];

test("hero: captions from the recorded run", async ({ page }) => {
  await page.goto("/");
  const fig = page.getByTestId("hero-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const frames = heroFrames(site.hero, site.ladder);
  const spec = site.specs[site.hero.spec]!;
  for (const i of keySteps(frames.length))
    await frame(fig, i, heroCaption(frames[i]!, site.hero, spec, site.ladder));
});

test("why: captions from the exported hill-climb", async ({ page }) => {
  await page.goto("/why");
  const fig = page.getByTestId("climb-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const frames = climbFrames(why.hill_climb);
  for (const i of keySteps(frames.length))
    await frame(
      fig,
      i,
      climbCaption(frames[i]!, why.hill_climb, site.ground_truth.dds_250msps!),
    );
});

test("cordic: captions from the Python reference's registers", async ({
  page,
}) => {
  await page.goto("/case-study");
  const fig = page.getByTestId("cordic-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  // the default parameters: the reference design, input 130 degrees (code 23666)
  const ref = cordicFx.configs[0]!;
  const c: Numerics = {
    dataWidth: 16,
    nIter: 14,
    angleWidth: 16,
    fracGuard: 0,
    rounding: "trunc",
  };
  const r = rotate(23666, c);
  expect(r.cos).toBe(ref.cos[ref.codes.indexOf(23666)] ?? r.cos);
  for (const i of keySteps(r.states.length))
    await frame(fig, i, rotationCaption(r, c, i));
  // the exhaustive accuracy of the reference design (exact), from the worker
  await expect(fig.getByTestId("sweep-accuracy")).toContainText(
    `${Number(ref.accuracy!.max_abs_lsb.toPrecision(3))} LSB`,
  );
});

test("datapath: captions from the schedule, per family", async ({ page }) => {
  await page.goto("/case-study");
  const fig = page.getByTestId("datapath-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  for (const family of ["iterative", "pipelined"] as const) {
    const before = (await fig.getAttribute("data-key")) ?? "";
    if (family !== "iterative") {
      await fig.getByRole("radio", { name: family, exact: true }).click();
      await expect(fig).not.toHaveAttribute("data-key", before);
    }
    const a = arch(family, {
      data_width: 16,
      n_iter: 14,
      angle_guard: 0,
      frac_guard: 0,
      rounding: "trunc",
    });
    const n = Number(await fig.getByTestId("scrub").getAttribute("max")) + 1;
    for (const i of keySteps(n))
      await frame(fig, i, datapathCaption(datapathFrame(a, i), a, family));
  }
});

test("trace replay: captions from the hero run's recorded trace", async ({
  page,
}) => {
  await page.goto("/how-it-works");
  const fig = page.getByTestId("trace-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const run = heroRun as unknown as RunData;
  const frames = traceFrames(run);
  await expect(fig).toHaveAttribute("data-key", `${run.id}|${frames.length}`);
  const spec = site.specs[run.spec]!;
  for (const i of keySteps(frames.length))
    await frame(fig, i, traceCaption(frames[i]!, run, spec));
});

test("Pareto replay: captions from the recorded rounds, and another run", async ({
  page,
}) => {
  await page.goto("/results");
  const fig = page.getByTestId("replay-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  for (const data of [dsRun, infRun]) {
    const run = data as unknown as RunData;
    if (run.spec !== "dds_250msps") {
      await fig.getByRole("radio", { name: run.spec, exact: true }).click();
      await fig.getByRole("radio", { name: run.label, exact: true }).click();
    }
    const frames = replayFrames(run);
    await expect(fig).toHaveAttribute("data-key", `${run.id}|${frames.length}`);
    const gt = site.ground_truth[run.spec]!;
    for (const i of keySteps(frames.length))
      await frame(fig, i, replayCaption(frames[i]!, run, gt));
  }
});

test("hypervolume race: captions from the exported curves", async ({
  page,
}) => {
  await page.goto("/results");
  const fig = page.getByTestId("race-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  for (const name of ["dds_250msps", "high_precision"]) {
    const spec = race.specs[name]!;
    if (name !== "dds_250msps") {
      const key = (await fig.getAttribute("data-key")) ?? "";
      await fig.getByRole("radio", { name, exact: true }).click();
      await expect(fig).not.toHaveAttribute("data-key", key);
    }
    const steps = raceSteps(spec);
    for (const i of keySteps(steps.length))
      await frame(fig, i, raceCaption(steps[i]!, spec, name));
  }
});
