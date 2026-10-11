/**
 * /writeup: the repository's final technical report (docs/WRITEUP.md at the vendored commit),
 * rendered as it is. The text is the repository's, vendored byte for byte; this page only lays
 * it out: plain Markdown (no MDX and no maths, so dollar amounts stay dollar amounts), the
 * ladder's Mermaid flowchart drawn as a diagram, and each section's "facts" comment shown as the
 * list of named facts its numbers are bound to (values from docs/writeup_facts.json, which the
 * repository's tests regenerate from the committed data). Server Component, static.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";
import remarkGfm from "remark-gfm";

import { MdxTable } from "@/components/ui/MdxTable";
import { COMMIT, site } from "@/lib/dse/data";
import { AGENT_REPO, agentFile } from "@/lib/site";
import { factValue, parseWriteup, type Block, type Flow } from "@/lib/writeup";

export const metadata = {
  title: "Write-up",
  description:
    "The project's closing report on all four milestones, from the repository: the question, the ladder, what each milestone found (losses first), the A/Bs together, the limitations and what comes next. Every number in it is bound to a named fact computed from the committed data.",
};

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";

const V = path.join(process.cwd(), "vendor", "hw_dse", "docs");

/**
 * The write-up's tables keep identifiers whole: a spec name such as asic_low_area in the first
 * column would otherwise break one character at a time at 390 px (inline code may break
 * anywhere in prose). The table scrolls sideways in its focusable region instead.
 */
function WriteupTable(props: ComponentProps<"table">): JSX.Element {
  return <MdxTable {...props} className="writeup-table" />;
}

function Markdown({ source }: { source: string }): JSX.Element {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={source}
        components={{ table: WriteupTable }}
        options={{ mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}

/** The ladder flowchart: the rungs top to bottom, then the feedback edges. */
function FlowDiagram({ flow }: { flow: Flow }): JSX.Element {
  const solid = flow.edges.filter((e) => !e.dashed);
  const order = flow.nodes.map((n) => n.id);
  const dashed = flow.edges.filter((e) => e.dashed);
  const name = (id: string) => flow.nodes.find((n) => n.id === id)!.lines[0]!;
  return (
    <figure
      className="my-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
      data-testid="writeup-flow"
    >
      <ol className="mx-auto max-w-md" aria-label="The ladder, top to bottom">
        {order.map((id, i) => {
          const n = flow.nodes.find((x) => x.id === id)!;
          const next = solid.some((e) => e.from === id);
          return (
            <li key={id} data-node={id} className="flex flex-col items-center">
              <div className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-center text-sm dark:border-neutral-700 dark:bg-neutral-950">
                <div className="font-semibold">{n.lines[0]}</div>
                {n.lines.slice(1).map((l) => (
                  <div
                    key={l}
                    className="text-xs text-neutral-600 dark:text-neutral-400"
                  >
                    {l}
                  </div>
                ))}
              </div>
              {next && i < order.length - 1 && (
                <span aria-hidden="true" className="my-0.5 text-neutral-500">
                  ↓
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {dashed.length > 0 && (
        <ul className="mx-auto mt-3 max-w-md space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
          {dashed.map((e) => (
            <li
              key={`${e.from}-${e.to}`}
              className="rounded border border-dashed border-neutral-400 px-2 py-1"
            >
              ↺ {name(e.from).split(" ")[0]} → {name(e.to).split(" ")[0]}:{" "}
              {e.label.join(", ")}
            </li>
          ))}
        </ul>
      )}
      <figcaption className="mt-3 text-center text-xs text-neutral-600 dark:text-neutral-400">
        Drawn from the write-up&apos;s Mermaid source.
      </figcaption>
    </figure>
  );
}

function Facts({
  names,
  facts,
}: {
  names: string[];
  facts: Record<string, unknown>;
}): JSX.Element {
  return (
    <details className="my-3 rounded border border-neutral-200 px-3 py-2 text-xs dark:border-neutral-800">
      <summary className="focus-ring cursor-pointer rounded text-neutral-700 dark:text-neutral-300">
        The {names.length} named facts behind this section&apos;s numbers, in
        reading order
      </summary>
      <ul className="mt-2 grid gap-x-4 gap-y-0.5 sm:grid-cols-2">
        {names.map((n, i) => (
          <li key={`${n}-${i}`} className="min-w-0 break-words font-mono">
            {n} = {n in facts ? factValue(facts[n]) : "—"}
          </li>
        ))}
      </ul>
    </details>
  );
}

function Blocks({
  blocks,
  facts,
}: {
  blocks: Block[];
  facts: Record<string, unknown>;
}): JSX.Element {
  return (
    <>
      {blocks.map((b, i) =>
        b.kind === "md" ? (
          <Markdown key={i} source={b.text} />
        ) : b.kind === "facts" ? (
          <Facts key={i} names={b.names} facts={facts} />
        ) : (
          <FlowDiagram key={i} flow={b.flow} />
        ),
      )}
    </>
  );
}

export default function WriteupPage(): JSX.Element {
  const w = parseWriteup(readFileSync(path.join(V, "WRITEUP.md"), "utf-8"));
  const facts = JSON.parse(
    readFileSync(path.join(V, "writeup_facts.json"), "utf-8"),
  ) as Record<string, unknown>;
  const commit = site.vendored.commit;
  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /writeup
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{w.title}</h1>
      <p className="mt-3 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
        The repository&apos;s own closing report, rendered unedited from{" "}
        <a href={agentFile("docs/WRITEUP.md", commit)} className={A}>
          docs/WRITEUP.md at {COMMIT}
        </a>{" "}
        of{" "}
        <a href={AGENT_REPO} className={A}>
          HW_Design_Space_Agent
        </a>
        . Each section&apos;s numbers are bound to named facts (open the list
        under its heading), which the repository computes from its committed
        data and checks number by number.
      </p>
      <nav aria-label="Sections" className="mt-6">
        <ol className="grid gap-1 text-sm sm:grid-cols-3">
          {w.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={A}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-6">
        <Blocks blocks={w.intro} facts={facts} />
      </div>
      {w.sections.map((s) => (
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
            {s.title}
          </h2>
          <Blocks blocks={s.blocks} facts={facts} />
        </section>
      ))}
      <p className="mt-12 text-sm text-neutral-600 dark:text-neutral-400">
        The same results with their tables and animations are on the{" "}
        <Link href="/results" className={A}>
          results
        </Link>{" "}
        and{" "}
        <Link href="/how-it-works" className={A}>
          how it works
        </Link>{" "}
        pages; how the project was run is in the{" "}
        <Link href="/record" className={A}>
          project record
        </Link>
        .
      </p>
    </article>
  );
}
