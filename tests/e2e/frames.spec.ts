/**
 * Frame tests on the page (visual standard §4): set key frames of every animation and require
 * the caption on screen to be the caption built from the reference data (the recorded run, the
 * exported hill-climb, the Python fixtures of the golden model and the schedule).
 */
import { expect, test, type Locator } from "@playwright/test";

import infM1 from "../../src/data/runs/infeasible_dds_400msps__20261008-130229-2502.json";
import dsRun from "../../src/data/runs/m2__dds_250msps__20261009-074844-f588.json";
import infRun from "../../src/data/runs/m2__infeasible_dds_400msps__20261009-075413-77ab.json";
import heroRun from "../../src/data/runs/m2__low_area_control__20261009-075630-8e33.json";
import cordicFx from "../fixtures/cordic.json";

import {
  climbCaption,
  datapathCaption,
  descentCaption,
  heroCaption,
  hpCaption,
  raceCaption,
  replayCaption,
  rotationCaption,
  scatterCaption,
  shiftCaption,
  traceCaption,
} from "@/lib/dse/captions";
import { climbFrames } from "@/lib/dse/climb";
import { rotate, type Numerics } from "@/lib/dse/cordic";
import { ev, site, why } from "@/lib/dse/data";
import { datapathFrame } from "@/lib/dse/datapath";
import { arch } from "@/lib/dse/families";
import { heroFrames } from "@/lib/dse/hero";
import { ladder } from "@/lib/dse/ladder";
import {
  cycleCaption,
  cycleFrames,
  m3,
  sysCaption,
  sysFrames,
} from "@/lib/dse/m3";
import {
  descentFrames,
  hpFrames,
  scatterFrames,
  shiftFrames,
} from "@/lib/dse/m2frames";
import { races, raceSteps } from "@/lib/dse/race";
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
    await frame(
      fig,
      i,
      heroCaption(frames[i]!, site.hero, spec, site.ladder, ladder.worked),
    );
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

test("Pareto replay: captions from the recorded rounds, another run, and M1", async ({
  page,
}) => {
  await page.goto("/results");
  const fig = page.getByTestId("replay-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  for (const data of [dsRun, infRun, infM1]) {
    const run = data as unknown as RunData;
    if (run.milestone === "m1")
      await fig
        .getByRole("radio", { name: "M1 (3 seeds)", exact: true })
        .click();
    else if (run.spec !== "dds_250msps") {
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

test("hypervolume race: captions from the exported curves, M2 and M1", async ({
  page,
}) => {
  await page.goto("/results");
  const fig = page.getByTestId("race-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  for (const [ms, name] of [
    ["m2", "dds_250msps"],
    ["m2", "high_precision"],
    ["m1", "high_precision"],
  ] as const) {
    const spec = races[ms].specs[name]!;
    const key = (await fig.getAttribute("data-key")) ?? "";
    if (ms === "m1") {
      await fig
        .getByRole("radio", { name: "M1 (3 seeds)", exact: true })
        .click();
      await expect(fig).not.toHaveAttribute("data-key", key);
    } else if (name !== "dds_250msps") {
      await fig.getByRole("radio", { name, exact: true }).click();
      await expect(fig).not.toHaveAttribute("data-key", key);
    }
    const steps = raceSteps(spec);
    for (const i of keySteps(steps.length))
      await frame(fig, i, raceCaption(steps[i]!, spec, name, ms.toUpperCase()));
  }
});

test("one design down the ladder: captions from the worked example", async ({
  page,
}) => {
  await page.goto("/how-it-works");
  const fig = page.getByTestId("descent-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const w = ladder.worked;
  const proofs = ladder.formal.rows.filter((r) => r.family === w.family);
  const frames = descentFrames(w);
  for (const i of keySteps(frames.length))
    await frame(fig, i, descentCaption(frames[i]!, w, proofs));
});

test("measured against estimated: captions from the L5 report's points", async ({
  page,
}) => {
  await page.goto("/case-study");
  const fig = page.getByTestId("scatter-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const frames = scatterFrames();
  const n = ladder.l5.vivado.n_fit_points;
  for (const m of ["fmax", "luts"] as const) {
    if (m === "luts") {
      const key = (await fig.getAttribute("data-key")) ?? "";
      await fig.getByRole("radio", { name: "LUTs", exact: true }).click();
      await expect(fig).not.toHaveAttribute("data-key", key);
    }
    for (const i of keySteps(frames.length))
      await frame(fig, i, scatterCaption(frames[i]!, ladder.scatter, n, m));
  }
});

test("high_precision: captions from the Vivado measurements", async ({
  page,
}) => {
  await page.goto("/case-study");
  const fig = page.getByTestId("hp-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const frames = hpFrames();
  for (const i of keySteps(frames.length))
    await frame(fig, i, hpCaption(frames[i]!, ladder.high_precision));
  await expect(
    fig.locator('[data-view="post_route"] [data-m="8"]'),
  ).toHaveAttribute("data-meets", "false");
});

test("M1 → M2: captions from results.md's glance tables", async ({ page }) => {
  await page.goto("/results");
  const fig = page.getByTestId("shift-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const specs = ["dds_250msps", "low_area_control", "high_precision"];
  const frames = shiftFrames(specs);
  const labels = Object.fromEntries(
    ev("m2").costs.models.map((m) => [m.model, m.label]),
  );
  for (const metric of ["hv", "regret"] as const) {
    if (metric === "regret") {
      const key = (await fig.getAttribute("data-key")) ?? "";
      await fig
        .getByRole("radio", { name: "Selection regret", exact: true })
        .click();
      await expect(fig).not.toHaveAttribute("data-key", key);
    }
    for (const i of keySteps(frames.length))
      await frame(
        fig,
        i,
        shiftCaption(frames[i]!, site.glance, metric, labels),
      );
  }
});

test("multiaxis_control in its system: captions from the SimPy replay", async ({
  page,
}) => {
  await page.goto("/how-it-works");
  const fig = page.getByTestId("system-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const rep = m3.system_replay;
  const frames = sysFrames(rep);
  for (const i of keySteps(frames.length))
    await frame(fig, i, sysCaption(frames[i]!, rep));
  // 400 ns after the tick: m=4 has finished, m=5 and m=7 have not
  const at400 = frames.findIndex((f) => f.phase === "drain" && f.t === 400);
  await frame(fig, at400, sysCaption(frames[at400]!, rep));
  await expect(fig.locator('g[data-m="4"]')).toHaveAttribute(
    "data-complete",
    "true",
  );
  await expect(fig.locator('g[data-m="5"]')).toHaveAttribute(
    "data-complete",
    "false",
  );
  // the verdict: only m=4 meets the simulated deadline
  await frame(fig, frames.length - 1, sysCaption(frames.at(-1)!, rep));
  for (const [m, ok] of [
    ["4", "true"],
    ["5", "false"],
    ["7", "false"],
  ])
    await expect(fig.locator(`g[data-m="${m}"]`)).toHaveAttribute(
      "data-meets",
      ok!,
    );
});

test("the cycle model against the RTL: captions from the validation trace, both designs", async ({
  page,
}) => {
  await page.goto("/how-it-works");
  const fig = page.getByTestId("cycle-widget");
  await expect(fig).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const c = m3.cycle;
  for (const [k, w] of c.waves.entries()) {
    if (k > 0) {
      await fig.getByRole("radio", { name: /pipelined_m/ }).click();
      await expect(
        fig.getByRole("radio", { name: /pipelined_m/ }),
      ).toBeChecked();
    }
    const frames = cycleFrames(w);
    for (const i of keySteps(frames.length))
      await frame(fig, i, cycleCaption(frames[i]!, w, c));
  }
});
