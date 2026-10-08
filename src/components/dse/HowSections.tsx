/**
 * How it works: the ladder with its badges and checks, the provenance labels, and the system
 * prompt's division of labour, quoted from the recorded traces. Server Components; every value
 * comes from src/data/site.json.
 */
import { COMMIT, site } from "@/lib/dse/data";
import { agentFile } from "@/lib/site";

import { LevelBadge, Prov } from "./Badges";

const TH =
  "border-b border-neutral-300 px-2 py-1.5 text-left align-bottom font-semibold dark:border-neutral-700";
const TD =
  "border-b border-neutral-200 px-2 py-1.5 align-top dark:border-neutral-800";
const A =
  "focus-ring rounded underline decoration-accent/40 underline-offset-4 hover:decoration-accent";

export function LadderTable({
  column = "ppa",
}: {
  /** "ppa": what each level offers; "check": how each level is verified. */
  column?: "ppa" | "check";
}): JSX.Element {
  return (
    <div
      role="region"
      aria-label={
        column === "ppa" ? "The fidelity ladder" : "Verification at every level"
      }
      tabIndex={0}
      className="focus-ring relative my-4 max-w-full overflow-x-auto rounded"
    >
      <table
        className="w-full min-w-[36rem] text-sm"
        data-testid={`ladder-${column}`}
      >
        <thead>
          <tr>
            <th className={TH}>Level</th>
            <th className={TH}>Status</th>
            <th className={TH}>
              {column === "ppa" ? "What it does" : "Verification"}
            </th>
            <th className={TH}>
              {column === "ppa" ? "PPA it offers" : "Milestone"}
            </th>
          </tr>
        </thead>
        <tbody>
          {site.ladder.map((l) => (
            <tr
              key={l.id}
              data-level={l.id}
              className={
                l.status === "live"
                  ? ""
                  : "text-neutral-600 dark:text-neutral-400"
              }
            >
              <td className={TD}>
                <span className="font-mono">{l.id}</span> {l.name}
                {l.plan_only && (
                  <span className="block text-xs">
                    project plan, not yet in the README
                  </span>
                )}
              </td>
              <td className={TD}>
                <LevelBadge status={l.status} milestone={l.milestone} />
              </td>
              <td className={TD}>{column === "ppa" ? l.what : l.check}</td>
              <td className={TD}>{column === "ppa" ? l.ppa : l.milestone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
        Badges follow the roadmap in the repository&apos;s{" "}
        <a href={agentFile("README.md", site.vendored.commit)} className={A}>
          README at {COMMIT}
        </a>
        . Only live levels are ever animated as having run.
      </p>
    </div>
  );
}

export function ProvenanceKey(): JSX.Element {
  return (
    <dl className="my-4 grid gap-3 sm:grid-cols-3" data-testid="provenance-key">
      <div className="rounded border border-neutral-200 p-3 dark:border-neutral-800">
        <dt>
          <Prov kind="exact" />
        </dt>
        <dd className="mt-1 text-sm">
          Computed by the bit-accurate golden model (accuracy, error) or read
          off the schedule (latency in cycles). The golden model is bit-exact
          against the reference RTL.
        </dd>
      </div>
      <div className="rounded border border-neutral-200 p-3 dark:border-neutral-800">
        <dt>
          <Prov kind="estimate" />
        </dt>
        <dd className="mt-1 text-sm">
          From the analytical Artix-7 cost model calibrated to two Vivado
          results (LUTs, flip-flops, Fmax, throughput, power index). Milestone 2
          replaces them with synthesis.
        </dd>
      </div>
      <div className="rounded border border-neutral-200 p-3 dark:border-neutral-800">
        <dt>
          <Prov kind="measured" />
        </dt>
        <dd className="mt-1 text-sm">
          Recorded from real runs: the provider-reported tokens and cost of each
          LLM call, and the wall-clock the eval harness timed. In M1, no PPA
          number is measured.
        </dd>
      </div>
    </dl>
  );
}

export function DivisionOfLabour(): JSX.Element {
  return (
    <figure className="my-6" data-testid="division-of-labour">
      <blockquote className="whitespace-pre-line rounded border-l-4 border-accent bg-neutral-50 px-4 py-3 font-mono text-xs leading-relaxed dark:border-indigo-300 dark:bg-neutral-900">
        {`Division of labour (strict):\n${site.division_of_labour}`}
      </blockquote>
      <figcaption className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
        From the system prompt every one of the {site.trace_calls} recorded LLM
        calls was sent (
        <a
          href={agentFile("src/hw_dse/agent/prompts.py", site.vendored.commit)}
          className={A}
        >
          prompts.py
        </a>
        ).
      </figcaption>
    </figure>
  );
}
