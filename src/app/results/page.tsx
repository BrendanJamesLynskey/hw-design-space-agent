/**
 * /results: milestone 1's eval, honestly. Where the agent lost and where it won, the Pareto
 * replay of any recorded run, the hypervolume race, every spec's table with tokens and dollars,
 * the cost per model, and a cost and labour calculator driven by the measured runs. Server
 * Component; the prose is content/pages/results.mdx.
 */
import { MdxPage } from "@/lib/mdx/render";

export const metadata = {
  title: "Results",
  description:
    "Milestone 1's eval against NSGA-II and random search on the exhaustive ground truth: the agent is the better selector and NSGA-II the better front-mapper. Pareto replays, the hypervolume race, tokens and dollars per run, and a cost calculator.",
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
