/**
 * Records the README's animated GIFs (and WebM videos) of the hero
 * animations. Manual run, output committed; a heavy job, so run it alone:
 *
 *   pnpm build && pnpm start   # in another shell
 *   pnpm animations            # writes docs/media/*.gif and *.webm
 *
 * Every frame is a model state set by the animation's scrub bar (reduced
 * motion, so nothing plays by itself), screenshotted, then joined by
 * ffmpeg: the recordings are reproducible frame for frame. Needs ffmpeg on
 * the PATH.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { chromium } from "@playwright/test";

const OUT = path.join(process.cwd(), "docs", "media");
const BASE = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";

type Clip = {
  name: string;
  path: string;
  widget: string;
  /** frames per second of the output */
  fps: number;
  /** a radio to press first (a parameter), if any */
  radio?: string;
};

const CLIPS: Clip[] = [
  { name: "one-spec-every-level", path: "/", widget: "hero-widget", fps: 1.5 },
  { name: "hill-climb", path: "/why", widget: "climb-widget", fps: 1.5 },
  {
    name: "trace-replay",
    path: "/how-it-works",
    widget: "trace-widget",
    fps: 1,
  },
  { name: "cordic", path: "/case-study", widget: "cordic-widget", fps: 3 },
  {
    name: "datapath",
    path: "/case-study",
    widget: "datapath-widget",
    fps: 4,
    radio: "pipelined",
  },
  {
    name: "pareto-replay",
    path: "/results",
    widget: "replay-widget",
    fps: 0.75,
  },
  { name: "hv-race", path: "/results", widget: "race-widget", fps: 8 },
  {
    name: "design-down-the-ladder",
    path: "/how-it-works",
    widget: "descent-widget",
    fps: 0.75,
  },
  {
    name: "measured-vs-estimate",
    path: "/case-study",
    widget: "scatter-widget",
    fps: 0.75,
  },
  {
    name: "high-precision",
    path: "/case-study",
    widget: "hp-widget",
    fps: 0.75,
  },
  { name: "m1-to-m2", path: "/results", widget: "shift-widget", fps: 0.75 },
];

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  for (const c of CLIPS) {
    const dir = mkdtempSync(path.join(tmpdir(), `hdsa-${c.name}-`));
    await page.goto(BASE + c.path, { waitUntil: "networkidle" });
    const fig = page.getByTestId(c.widget);
    await fig.waitFor({ timeout: 30_000 });
    // the replays load their recorded run after the widget mounts
    await page.waitForFunction(
      (id) =>
        !(
          document
            .querySelector(`[data-testid="${id}"]`)
            ?.getAttribute("data-key") ?? "loading"
        ).startsWith("loading"),
      c.widget,
    );
    if (c.radio) {
      const key = await fig.getAttribute("data-key");
      await fig.getByRole("radio", { name: c.radio, exact: true }).click();
      await fig
        .page()
        .waitForFunction(
          ([id, k]) =>
            document
              .querySelector(`[data-testid="${id}"]`)
              ?.getAttribute("data-key") !== k,
          [c.widget, key] as const,
        );
    }
    const scrub = fig.getByTestId("scrub");
    const max = Number(await scrub.getAttribute("max"));
    const visual = fig.getByTestId("visual");
    // the visual's height changes with the step (captions, quotes): measure the tallest, then
    // capture every step at that one size, so the GIF's frames all have the same dimensions
    let box = { x: 0, y: 0, width: 0, height: 0 };
    for (let s = 0; s <= max; s++) {
      await scrub.fill(String(s));
      const b = await visual.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.x + window.scrollX,
          y: r.y + window.scrollY,
          width: r.width,
          height: r.height,
        };
      });
      if (s === 0) box = b;
      box.height = Math.max(box.height, b.height);
    }
    for (let s = 0; s <= max; s++) {
      await scrub.fill(String(s));
      await page.screenshot({
        path: path.join(dir, `f${String(s).padStart(4, "0")}.png`),
        fullPage: true,
        clip: box,
      });
    }
    const input = path.join(dir, "f%04d.png");
    const gif = path.join(OUT, `${c.name}.gif`);
    const webm = path.join(OUT, `${c.name}.webm`);
    // even dimensions for the video encoder; a shared palette for the GIF
    const scale = "scale=560:-2:flags=lanczos";
    execFileSync("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-framerate",
      String(c.fps),
      "-i",
      input,
      "-vf",
      `${scale},split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=none`,
      "-loop",
      "0",
      gif,
    ]);
    execFileSync("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-framerate",
      String(c.fps),
      "-i",
      input,
      "-vf",
      scale,
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "40",
      "-pix_fmt",
      "yuv420p",
      webm,
    ]);
    rmSync(dir, { recursive: true, force: true });
    console.log(
      `wrote ${path.relative(process.cwd(), gif)} and .webm (${max + 1} frames)`,
    );
  }
  await browser.close();
}

void main();
