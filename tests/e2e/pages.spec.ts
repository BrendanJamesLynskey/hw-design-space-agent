/**
 * Every page renders at desktop and phone widths, in light and dark mode, with no page errors,
 * no console errors and no horizontal overflow; and the honesty rules hold on the page.
 */
import { expect, test, type Page } from "@playwright/test";

import { PAGES, WIDGET_TIMEOUT } from "./pages";

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return errors;
}

for (const scheme of ["light", "dark"] as const) {
  for (const width of [1280, 390]) {
    test.describe(`${scheme} @ ${width}px`, () => {
      test.use({ colorScheme: scheme, viewport: { width, height: 900 } });
      for (const path of PAGES) {
        test(`${path} renders cleanly`, async ({ page }) => {
          const errors = collectErrors(page);
          const res = await page.goto(path);
          expect(res?.status()).toBe(200);
          await expect(page.locator("h1").first()).toBeVisible();
          await expect(page.locator("[data-pending-widget]")).toHaveCount(0, {
            timeout: WIDGET_TIMEOUT,
          });
          const overflow = await page.evaluate(() => {
            const el = document.scrollingElement!;
            return el.scrollWidth - el.clientWidth;
          });
          expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(0);
          const bg = await page.evaluate(
            () => getComputedStyle(document.body).backgroundColor,
          );
          expect(bg).toBe(
            scheme === "dark" ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)",
          );
          expect(errors).toEqual([]);
        });
      }
    });
  }
}

const LIVE = ["L0", "L1", "SYS", "L2", "L3", "L4", "GL", "L5"];

test("every ladder level carries a badge; M1–M3's levels are live, the hero skips SYS and L2", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.getByTestId("hero-widget");
  await expect(hero).toBeVisible({ timeout: WIDGET_TIMEOUT });
  const levels = hero.locator("li[data-level]");
  await expect(levels).toHaveCount(8);
  for (const li of await levels.all()) {
    const id = await li.getAttribute("data-level");
    const badge = li.locator("[data-badge]");
    await expect(badge).toHaveCount(1);
    await expect(badge).toHaveAttribute(
      "data-badge",
      LIVE.includes(id!) ? "live" : "planned",
    );
  }
  // the spec card never sits on a planned level, or on a level this run did not use
  const scrub = hero.getByTestId("scrub");
  const max = Number(await scrub.getAttribute("max"));
  for (let i = 0; i <= max; i++) {
    await scrub.fill(String(i));
    const here = hero.locator('li[data-here="true"]');
    await expect(here).toHaveAttribute("data-status", "live");
    expect(["SYS", "L2"]).not.toContain(await here.getAttribute("data-level"));
  }
  await expect(hero.locator("[data-skipped]")).toHaveCount(2);
});

test("the required wording and the Knuth quote", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toContainText(
    "An AI agent is the perfect environment for trade-off exploration.",
  );
  await expect(page.locator("main")).toContainText(
    "Avoid premature optimisation.",
  );
  await page.goto("/why");
  await expect(page.getByTestId("knuth")).toContainText(
    "“Premature optimization is the root of all evil.”",
  );
  await expect(page.getByTestId("knuth")).toContainText("Donald E. Knuth");
  await expect(page.getByTestId("knuth-context")).toContainText(
    "say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.",
  );
  await expect(
    page.getByRole("link", { name: "doi:10.1145/356635.356640" }),
  ).toHaveAttribute("href", "https://doi.org/10.1145/356635.356640");
});

test("no email address anywhere; contact is GitHub and LinkedIn", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/why",
    "/case-study",
    "/results",
    "/record",
    "/about",
  ]) {
    await page.goto(path);
    const html = await page.content();
    expect(html).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/);
    expect(html).not.toContain("mailto:");
  }
  await page.goto("/about");
  await expect(
    page.getByRole("link", { name: "LinkedIn" }).first(),
  ).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/brendan-lynskey-a891705",
  );
});

test("the Pareto chart reads out any point on the front", async ({ page }) => {
  await page.goto("/case-study");
  const chart = page.getByTestId("pareto-chart");
  await expect(chart).toBeVisible({ timeout: WIDGET_TIMEOUT });
  await expect(chart.getByTestId("pareto-readout")).toContainText(
    "the spec's choice",
  );
  await chart.getByTestId("pareto-slider").fill("3");
  await expect(chart.getByTestId("pareto-readout")).not.toContainText(
    "the spec's choice",
  );
  await chart.getByRole("radio", { name: "low_area_control" }).click();
  await expect(chart.getByTestId("pareto-readout")).toContainText("iterative");
  await chart.locator("[data-point='100']").hover();
  await expect(chart.getByText("design 101/")).toBeVisible();
});

test("about: personal projects only, no interview repos, the education list", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(page.getByTestId("personal-note")).toContainText(
    "Links go to my personal projects on GitHub",
  );
  const html = await page.content();
  expect(html).not.toContain("Interview_");
  expect(html).not.toContain("Embedded systems and Linux");
  // every row of evidence links is labelled as personal projects
  for (const row of await page.locator("[data-personal-projects]").all())
    await expect(row).toContainText("Personal projects:");
  const edu = page.locator("section[aria-labelledby='education'] li");
  await expect(edu).toHaveText([
    "BEng Electronic Engineering",
    "MSc Music Technology (DSP)",
    "MSc Low Power Systems Integration",
    "Diploma in Mathematics",
  ]);
});

test("the record: ten sections (7b: M3's review), the decision log as a timeline, linked from nav and About", async ({
  page,
}) => {
  await page.goto("/record");
  await expect(page.locator("h1")).toHaveText(
    "Project record: how it was built and why",
  );
  await expect(
    page.locator("main section[id], article section[id]"),
  ).toHaveCount(10);
  const tl = page.getByTestId("decision-timeline");
  await expect(tl.locator("[data-decision]")).not.toHaveCount(0);
  const dates = await tl
    .locator("li[data-date]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-date")));
  expect([...dates].sort()).toEqual(dates);
  await page.goto("/about");
  await expect(
    page.getByRole("link", { name: "project record" }),
  ).toHaveAttribute("href", "/record");
  await expect(
    page
      .getByRole("navigation", { name: "Site" })
      .getByRole("link", { name: "Record" }),
  ).toHaveAttribute("href", "/record");
});

test("the roadmap: M1, M2 (with the Vivado follow-up) and M3 done, M4 planned with no results", async ({
  page,
}) => {
  await page.goto("/roadmap");
  for (const [m, s] of [
    ["M1", "done"],
    ["M2", "done"],
    ["M3", "done"],
    ["M4", "planned"],
  ] as const)
    await expect(page.locator(`li[data-milestone="${m}"]`)).toHaveAttribute(
      "data-status",
      s,
    );
  const m2 = page.locator('li[data-milestone="M2"]');
  await expect(m2).toContainText("Vivado 2025.2 on 14 generated designs");
  await expect(m2.getByRole("link", { name: /#4/ })).toHaveAttribute(
    "href",
    "https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent/pull/4",
  );
  const m3 = page.locator('li[data-milestone="M3"]');
  await expect(m3).toContainText("Deep Agents");
  await expect(m3).toContainText("experimental");
  await expect(m3.getByRole("link", { name: /#5/ })).toHaveAttribute(
    "href",
    "https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent/pull/5",
  );
  const m4 = page.locator('li[data-milestone="M4"]');
  await expect(m4).toContainText("ASIC");
  await expect(m4).toContainText("no results yet");
  await expect(m4).toContainText("No pull request yet.");
});

test("results lead with M3, its losses first, then M1 → M2; results.md at the vendored commit", async ({
  page,
}) => {
  await page.goto("/results");
  const h2 = await page.locator("article h2").allTextContents();
  expect(h2[0]).toBe("Milestone 3 at a glance");
  expect(h2[1]).toBe("The A/B: structured graph against the campaign agent");
  expect(h2[2]).toBe("Memory on vs off");
  const m12 = h2.indexOf("M1 → M2");
  expect(m12).toBeGreaterThan(2);
  expect(h2[m12 + 1]).toBe("Where it got worse");
  await expect(page.locator("article")).toContainText(
    "The Sonnet campaign arm covers one spec, `multiaxis_control`, by the owner's choice".replace(
      /`/g,
      "",
    ),
  );
  await expect(page.getByTestId("ab-table")).toBeVisible();
  await expect(
    page.locator("a[data-repo-file='eval/results.md']"),
  ).toHaveAttribute("href", /\/blob\/[0-9a-f]{40}\/eval\/results\.md$/);
});
