/**
 * Site-wide footer: where every number comes from (the vendored commit), and the owner's
 * public profiles. Server Component.
 */
import { COMMIT, site } from "@/lib/dse/data";
import {
  AGENT_REPO,
  CONTEXT_URL,
  GITHUB_URL,
  HARNESSES_URL,
  LLMS_HUB,
  OWNER_GITHUB,
  OWNER_LINKEDIN,
  PROTOCOLS_URL,
} from "@/lib/site";

const RELATED = [
  { href: HARNESSES_URL, label: "Agent Harnesses Explained" },
  { href: PROTOCOLS_URL, label: "Agent Protocols Explained" },
  { href: CONTEXT_URL, label: "Agent Context Explained" },
  { href: LLMS_HUB, label: "LLMs hub" },
] as const;

const A =
  "focus-ring rounded underline decoration-neutral-400 underline-offset-2 hover:decoration-accent";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs text-neutral-600 sm:px-6 dark:text-neutral-400">
        <nav aria-label="Related" data-testid="related">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            Related:
          </span>{" "}
          {RELATED.map((r, i) => (
            <span key={r.href}>
              {i > 0 && " · "}
              <a href={r.href} className={A}>
                {r.label}
              </a>
            </span>
          ))}
        </nav>
        <p>
          Every number on this site comes from{" "}
          <a href={`${AGENT_REPO}/tree/${site.vendored.commit}`} className={A}>
            HW_Design_Space_Agent @ {COMMIT}
          </a>
          , vendored with its hashes, or from the TypeScript ports of its
          models, which match the Python reference exactly. Site source:{" "}
          <a href={GITHUB_URL} className={A}>
            hw-design-space-agent
          </a>{" "}
          (MIT).
        </p>
        <p>
          Brendan Lynskey ·{" "}
          <a href={OWNER_GITHUB} className={A}>
            GitHub
          </a>{" "}
          ·{" "}
          <a href={OWNER_LINKEDIN} className={A}>
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
}
