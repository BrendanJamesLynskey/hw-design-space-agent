/**
 * /case-study: the CORDIC sin/cos design space of milestone 1. The micro-rotations from the
 * bit-exact model, the families as datapaths from the cost model, and the true Pareto fronts.
 * Server Component; the prose is content/pages/case-study.mdx.
 */
import { MdxPage } from "@/lib/mdx/render";

import "katex/dist/katex.min.css";

export const metadata = {
  title: "Case study: CORDIC sin/cos",
  description:
    "The milestone 1 design space: CORDIC micro-rotations from the bit-exact golden model, the four architecture families as datapaths, and the true Pareto fronts.",
};

export default function CaseStudyPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /case-study
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Case study: CORDIC sin/cos
      </h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        The design space of milestone 1, from the repository&apos;s tested
        models.
      </p>
      <div className="mt-6">
        <MdxPage slug="case-study" />
      </div>
    </article>
  );
}
