/**
 * /results: the eval, honestly, milestone 2 first. M1 → M2 against NSGA-II, where it got worse
 * and where it held, the Pareto replay of any recorded run, the hypervolume race, every spec's
 * table with tokens and dollars, the cost per model and three ways of counting it, a cost and
 * labour calculator driven by the measured runs, and M1's results kept. Server Component; the
 * prose is content/pages/results.mdx.
 */
import { site } from "@/lib/dse/data";
import { MdxPage } from "@/lib/mdx/render";

export const metadata = {
  title: "Results",
  description: `The agent against NSGA-II and random search on the exhaustive ground truth, M1 to M2: the front-mapping gap closed (${site.glance.hv_ratio_m2[0]}–${site.glance.hv_ratio_m2[1]}× NSGA-II's hypervolume), the selection lead kept in ${site.glance.regret_beats_nsga2_m2} of ${site.glance.regret_cells} cells, and where it got worse. Pareto replays, the hypervolume race, tokens and dollars per run, and a cost calculator.`,
};

export default function ResultsPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-5xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /results
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Results</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        The agent against plain optimisers, scored against the exact answer.
      </p>
      <div className="mt-6">
        <MdxPage slug="results" />
      </div>
    </article>
  );
}
