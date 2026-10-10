# RUNBOOK.md — Deploying and checking the site

The site is static: no database, no secrets, no environment variables. A
deploy can't break a schema, but it can still break in ways CI doesn't
see, so every deploy follows the same three steps. They are adapted from
transformer-explainer's RUNBOOK §7.

## 1. Deploy from a clean export

The Vercel project (`hw-design-space-agent`) is not on Vercel's Git
integration. Deploy with the logged-in Vercel CLI from a clean export of
`HEAD`, so nothing untracked (caches, `node_modules`, local files) is
uploaded:

```bash
rm -rf /tmp/hdsa-deploy && mkdir /tmp/hdsa-deploy
git archive HEAD | tar -x -C /tmp/hdsa-deploy
cp -r .vercel /tmp/hdsa-deploy/
(cd /tmp/hdsa-deploy && vercel deploy --yes)          # preview
(cd /tmp/hdsa-deploy && vercel deploy --prod --yes)   # production
vercel ls hw-design-space-agent | head                   # newest must be ● Ready
```

Test a preview first. Previews are protected by Vercel Authentication; to
smoke-check one, create a protection-bypass token in the project settings
and pass it as `VERCEL_BYPASS` (never commit or print it).

## 2. Smoke-check

```bash
pnpm smoke https://hw-design-space-agent.vercel.app
# a protected preview:
VERCEL_BYPASS=… pnpm smoke https://<preview-url>
```

It fetches every page and fails on any non-200 (redirects included) or on a page
without the content that proves it rendered from the vendored data: the
vendored commit in the footer, the Knuth DOI on `/why`, the widget
placeholders. Then open the home page in a browser and press **Play**, step
and scrub; on `/case-study` change W and check the exact max error updates
(it runs in a Web Worker, which the smoke check can't see). With
reduce-motion set in the OS, nothing should play until you press Play.

**The first deploy goes to production automatically**: deploy only once the
site is presentable, and only with the owner's yes (planner's job).

## 3. Read the logs

```bash
vercel logs --environment production --since 15m --no-branch --expand
```

A static site should log almost nothing. On the Hobby plan the CLI only
reaches back about an hour; the dashboard's Logs view keeps more.

## Why e2e runs under `--no-experimental-require-module`

Plain Node 20.19+ / 22.12+ can `require()` an ES module; Vercel's function
loader can't. transformer-explainer shipped a comment renderer that passed
every local and CI test and returned 500 on Vercel for that reason
(2026-10-04). This site has no server functions, but CI runs the e2e
server under the flag anyway, so the class of bug can't arrive unnoticed if
one is added.

## Updating the vendored data (part C, after each milestone)

The data is vendored from
[HW_Design_Space_Agent](https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent) at a
pinned commit. To move to a newer one (it must be pushed first):

```bash
pnpm vendor:dse <commit>                    # copies the files, writes vendor/hw_dse/VENDORED.json
# pin the same commit in reference/requirements.txt, then
.venv/bin/pip install --force-reinstall -r reference/requirements.txt
.venv/bin/python scripts/export_dse.py      # the site's data and fixtures, from the reference
pnpm test && .venv/bin/python -m pytest -q tests/python
```

CI fails if the vendored files, the pinned reference and the exported data
disagree. The export also fails if any results row it produces is not in the
repo's `eval/results.md` verbatim, and the ladder badges follow the README's
roadmap table, so a milestone flips to live only when the README says done.

Then (part C1's checklist, 2026-10-09):

- new data files go into `scripts/vendor-dse.ts`'s list and, if they carry numbers the
  site shows, into `scripts/export_dse.py` / `scripts/export_ladder.py` with a check
  against the repo's own text;
- `src/app/roadmap/page.tsx` holds each milestone's words and pull requests (`ADDS`,
  `PLAN_NOTE`, `PRS`); the results.md link is `<RepoFile>` and follows the vendored commit;
- the project record (`/record`) renders `content/record/project_record.md`, a copy of the
  planner's record. Replace it with the planner's latest, then run
  `pnpm vitest run tests/unit/record.test.ts`: every number the record states is checked
  against the site's data, and the repository wins where they disagree (fix the copy and
  report the discrepancy). Prettier ignores the file so the planner's formatting stays.

Part C2 (M3, 2026-10-10) added:

- `scripts/export_m3.py` writes `src/data/m3.json` and asserts every M3 row of results.md
  verbatim. It also runs the reference itself: the `multiaxis_control` system replay (its p99s
  must equal the committed ground truth), the cycle-model waveforms (each of the 24 L2
  validation traces must take exactly the RTL log's edges, accepts and results) and the
  peak-rate view over the exhaustive grid (about 20 s for the grid). A fresh venv is needed
  after a re-pin: an editable install reports its commit as "?" and the export refuses it.
- a milestone's README status may carry a note ("done (see the A/B …)"): the export splits it
  into `status` and `note`, and only `status` drives the badges.
- the record may have lettered sections ("7b"); the parser accepts `## 7b. Title`.
- `pnpm animations <name> …` records only the clips named (the full set takes a while).
