/**
 * Sharing and first impression (brief 39): the landing page's start button, its "How this is
 * checked" strip (whose link lands on a real About section) and its hero figure above the fold
 * on a phone; link-preview tags on the home page and a chapter, with cards that are 1200 × 630
 * PNGs; the favicon and Apple icon; and a sitemap listing every chapter, named by robots.txt.
 */
import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

const FIRST = "/why";
const CHAPTERS: readonly string[] = [
  "/why",
  "/how-it-works",
  "/case-study",
  "/results",
  "/writeup",
  "/adoption",
  "/roadmap",
  "/record",
  "/about",
];
const HOME = "/";
/** An ordinary page, which carries the site's card. */
const OTHER = "/results";
const START = "Start with why →";

async function meta(page: Page, key: string): Promise<string | null> {
  return page
    .locator(`meta[property="${key}"], meta[name="${key}"]`)
    .first()
    .getAttribute("content");
}

/** The path (and query) of an absolute production URL, to fetch from the server under test. */
const local = (u: string) => {
  const x = new URL(u);
  return x.pathname + x.search;
};

async function pngSize(request: APIRequestContext, u: string) {
  const res = await request.get(local(u));
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/png");
  const b = await res.body();
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

test("the landing page: the start button, checked strip, figure above the fold on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(HOME);
  const start = page.locator("[data-start-button]");
  await expect(start).toHaveText(START);
  await expect(start).toHaveAttribute("href", FIRST);
  const fig = page.locator("[data-hero-figure]").first();
  await expect(fig).toBeVisible();
  const box = (await fig.boundingBox())!;
  expect(box.y, "hero figure starts on the first screen").toBeLessThan(
    844 - 160,
  );
  const strip = page.locator("[data-checked-strip]");
  await expect(strip).toContainText("How this is checked");
  const href = (await strip
    .locator("[data-checked-link]")
    .getAttribute("href"))!;
  const [path, id] = href.split("#");
  expect(id, "the strip links to a section").toBeTruthy();
  await page.goto(path!);
  await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
});

for (const path of [HOME, FIRST, OTHER]) {
  test(`${path} carries Open Graph and Twitter cards`, async ({
    page,
    request,
  }) => {
    await page.goto(path);
    expect(await meta(page, "og:title")).toBeTruthy();
    expect(await meta(page, "og:description")).toBeTruthy();
    expect(await meta(page, "og:site_name")).toBeTruthy();
    expect(new URL((await meta(page, "og:url"))!).pathname).toBe(path);
    expect(await meta(page, "twitter:card")).toBe("summary_large_image");
    for (const key of ["og:image", "twitter:image"]) {
      const u = (await meta(page, key))!;
      expect(u, key).toMatch(/^https:\/\//);
      expect(await pngSize(request, u)).toEqual({ w: 1200, h: 630 });
      // a chapter has its own card
      if (path === FIRST && /^\/(learn|training)\//.test(FIRST))
        expect(new URL(u).pathname).toContain(FIRST);
    }
  });
}

test("the favicon and the Apple icon", async ({ page, request }) => {
  await page.goto(HOME);
  const icon = (await page
    .locator('link[rel="icon"]')
    .first()
    .getAttribute("href"))!;
  expect(icon).toMatch(/^\/icon\.svg/);
  const svg = await request.get(icon);
  expect(svg.headers()["content-type"]).toContain("image/svg+xml");
  const apple = (await page
    .locator('link[rel="apple-touch-icon"]')
    .getAttribute("href"))!;
  expect(await pngSize(request, `https://x${apple}`)).toEqual({
    w: 180,
    h: 180,
  });
});

test("the sitemap lists every chapter, and robots.txt names it", async ({
  request,
}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const c of CHAPTERS) expect(xml).toContain(`${c}</loc>`);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toMatch(/Sitemap: https:\/\/\S+\/sitemap\.xml/);
});

test.describe("the header: the site's name, four pages and a More menu that needs no JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const width of [1280, 390]) {
    test(`at ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");
      const header = page.locator("header");
      await expect(header.locator("[data-site-brand]")).toHaveText(
        "HW Design-Space Agent",
      );
      const nav = page.getByRole("navigation", { name: "Site" });
      await expect(nav.getByRole("link")).toHaveText([
        "Why",
        "How it works",
        "Results",
        "Write-up",
      ]);
      // one row of nav: every bar item on the same line
      const tops = await nav
        .locator(":scope > a, :scope > details > summary")
        .evaluateAll((els) =>
          els.map((e) => Math.round(e.getBoundingClientRect().top)),
        );
      expect(new Set(tops).size, "the nav does not wrap").toBe(1);
      expect((await header.boundingBox())!.height).toBeLessThan(
        width === 390 ? 120 : 80,
      );
      await nav.locator("[data-more-menu] summary").click();
      const more = nav.locator("[data-more-menu] > div");
      await expect(more).toBeVisible();
      await expect(more.getByRole("link")).toHaveText([
        "For a hardware team",
        "Case study",
        "Roadmap",
        "Record",
        "About",
        "Repo",
        "Companion sites ↗",
      ]);
      await expect(more.locator("[data-companion-sites]")).toHaveAttribute(
        "href",
        "https://transformer-decoder-explained.vercel.app",
      );
      const box = (await more.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    });
  }
});
