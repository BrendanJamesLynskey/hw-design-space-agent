/**
 * /why: avoid premature optimisation. The Knuth quote and its context, the hill-climb against
 * exploration on the real grid, and why an agent is the place to explore. Server Component;
 * the prose is content/pages/why.mdx.
 */
import { MdxPage } from "@/lib/mdx/render";

import "katex/dist/katex.min.css";

export const metadata = {
  title: "Why: avoid premature optimisation",
  description:
    "Knuth's critical 3%, applied to hardware: polishing the default architecture against exploring first, on the real CORDIC design space.",
};

export default function WhyPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /why
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Why: avoid premature optimisation
      </h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Exploration finds the critical 3% worth optimising.
      </p>
      <div className="mt-6">
        <MdxPage slug="why" />
      </div>
    </article>
  );
}
