/**
 * /how-it-works: the fidelity ladder with its badges, the design principle (the LLM never
 * produces a number), the LangGraph graph replayed from a recorded trace, verification at every
 * level, and the fleet. Server Component; the prose is content/pages/how-it-works.mdx.
 */
import { MdxPage } from "@/lib/mdx/render";

export const metadata = {
  title: "How it works",
  description:
    "The fidelity ladder, the rule that the LLM never produces a number, the LangGraph graph replayed from a recorded trace with its token and dollar counters, verification at every level, and a fleet of agents.",
};

export default function HowItWorksPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /how-it-works
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        How it works
      </h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        One spec, a ladder of models, an LLM that decides and code that
        measures.
      </p>
      <div className="mt-6">
        <MdxPage slug="how-it-works" />
      </div>
    </article>
  );
}
