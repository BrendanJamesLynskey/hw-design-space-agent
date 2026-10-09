/**
 * /record: "Project record: how it was built and why". Rendered from the planner's project
 * record (content/record/project_record.md): the summary, the principles, how the work is done
 * (planner and executor sessions, verification gates), the decision log as a timeline, the
 * results, what review found, the known limitations and what comes next. Every number in it is
 * checked against the site's data, and so against the vendored repository, by
 * tests/unit/record.test.ts. Server Component, static.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { MdxTable } from "@/components/ui/MdxTable";
import { COMMIT, site } from "@/lib/dse/data";
import { deciders, parseRecord, type Decision } from "@/lib/record";
import { AGENT_REPO, agentFile } from "@/lib/site";

export const metadata = {
  title: "Project record",
  description:
    "How the HW Design-Space Agent was built and why: the principles, the planner-and-executor process with its verification gates, every decision with its alternatives and reasons, the results, what review found and what is still missing.",
};

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";

const BY_CLS: Record<string, string> = {
  owner:
    "border-purple-700 text-purple-800 dark:border-purple-300 dark:text-purple-300",
  planner: "border-sky-700 text-sky-800 dark:border-sky-400 dark:text-sky-300",
  executor:
    "border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-300",
};

/** Inline Markdown in a table cell: `code` and **bold** only. */
function Inline({ text }: { text: string }): JSX.Element {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") ? (
          <code
            key={i}
            className="rounded bg-neutral-100 px-1 font-mono text-[0.85em] dark:bg-neutral-800"
          >
            {p.slice(1, -1)}
          </code>
        ) : p.startsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function Timeline({ decisions }: { decisions: Decision[] }): JSX.Element {
  const dates = [...new Set(decisions.map((d) => d.date))];
  return (
    <ol
      className="relative mt-6 space-y-8 border-l-2 border-neutral-300 pl-6 dark:border-neutral-700"
      data-testid="decision-timeline"
      aria-label="Decision log, oldest first"
    >
      {dates.map((date) => (
        <li key={date} data-date={date}>
          <span
            aria-hidden="true"
            className="absolute left-[-0.55rem] mt-1 inline-block size-4 rounded-full border-2 border-accent bg-white dark:border-indigo-300 dark:bg-neutral-950"
          />
          <h3 className="font-mono text-sm font-semibold">{date}</h3>
          <ol className="mt-3 space-y-4">
            {decisions
              .filter((d) => d.date === date)
              .map((d) => (
                <li
                  key={d.decision}
                  data-decision
                  className="min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <p className="font-medium">
                    <Inline text={d.decision} />
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Decided by:
                    </span>
                    {deciders(d.by).map((w) => (
                      <span
                        key={w}
                        className={`rounded border px-1 font-mono text-[0.7rem] uppercase ${BY_CLS[w]}`}
                      >
                        {w}
                      </span>
                    ))}
                    <span className="text-neutral-600 dark:text-neutral-400">
                      ({d.by})
                    </span>
                  </p>
                  {d.alternatives && (
                    <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <span className="font-semibold">Instead of: </span>
                      <Inline text={d.alternatives} />
                    </p>
                  )}
                  {d.why && (
                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                      <span className="font-semibold">Why: </span>
                      <Inline text={d.why} />
                    </p>
                  )}
                </li>
              ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

function Markdown({ source }: { source: string }): JSX.Element {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={source}
        components={{ table: MdxTable }}
        options={{ mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}

export default function RecordPage(): JSX.Element {
  const rec = parseRecord(
    readFileSync(
      path.join(process.cwd(), "content", "record", "project_record.md"),
      "utf-8",
    ),
  );
  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /record
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Project record: how it was built and why
      </h1>
      <p className="mt-3 max-w-3xl text-neutral-700 dark:text-neutral-300">
        {rec.intro}
      </p>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        Last updated {rec.lastUpdated}. Checked against{" "}
        <a href={AGENT_REPO} className={A}>
          HW_Design_Space_Agent
        </a>{" "}
        at{" "}
        <a href={agentFile("README.md", site.vendored.commit)} className={A}>
          {COMMIT}
        </a>
        . All three repositories are MIT-licensed.
      </p>
      <nav aria-label="Sections" className="mt-6">
        <ol className="grid gap-1 text-sm sm:grid-cols-3">
          {rec.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={A}>
                {s.n}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {rec.sections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-h`}
          className="mt-12 scroll-mt-6"
        >
          <h2
            id={`${s.id}-h`}
            className="text-2xl font-semibold tracking-tight"
          >
            {s.n}. {s.title}
          </h2>
          {/decision log/i.test(s.title) ? (
            <>
              <p className="mt-3 max-w-3xl text-sm text-neutral-700 dark:text-neutral-300">
                Every decision that shaped the project, oldest first: what was
                decided, by whom, what it replaced, and why.
                &ldquo;Planner&rdquo; and &ldquo;executor&rdquo; are the AI
                coding-agent sessions described in section 4; the owner takes
                the decisions that are his.
              </p>
              <Timeline decisions={rec.decisions} />
            </>
          ) : (
            <Markdown source={s.body} />
          )}
        </section>
      ))}
      <p className="mt-12 text-sm text-neutral-600 dark:text-neutral-400">
        See the{" "}
        <Link href="/results" className={A}>
          results
        </Link>{" "}
        and the{" "}
        <Link href="/roadmap" className={A}>
          roadmap
        </Link>{" "}
        for the same story in numbers and milestones.
      </p>
    </article>
  );
}
