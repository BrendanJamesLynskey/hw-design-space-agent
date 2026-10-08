/**
 * The Knuth quote, verbatim (US spelling, as published), with its source. The citation and the
 * DOI were checked at Crossref, and the wording against the paper (p. 268), on 2026-10-08.
 * Server Component.
 */
import { KNUTH_DOI } from "@/lib/site";

export function KnuthQuote(): JSX.Element {
  return (
    <figure data-testid="knuth" className="my-8">
      <blockquote className="border-l-4 border-emerald-600 pl-5 text-2xl font-semibold tracking-tight dark:border-emerald-400">
        &ldquo;Premature optimization is the root of all evil.&rdquo;
      </blockquote>
      <figcaption className="mt-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
        — Donald E. Knuth, &ldquo;Structured Programming with go to
        Statements&rdquo;, <cite>ACM Computing Surveys</cite> 6(4), 1974, pp.
        261–301 (quoted from p. 268).{" "}
        <a
          href={KNUTH_DOI}
          className="focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300"
        >
          doi:10.1145/356635.356640
        </a>
      </figcaption>
      <blockquote
        data-testid="knuth-context"
        className="mt-6 border-l-4 border-neutral-300 pl-5 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
      >
        &ldquo;We should forget about small efficiencies, say about 97% of the
        time: premature optimization is the root of all evil. Yet we should not
        pass up our opportunities in that critical 3%.&rdquo;
      </blockquote>
    </figure>
  );
}
