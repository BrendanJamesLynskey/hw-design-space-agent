/**
 * Site-wide footer: where every number comes from (the vendored commit), and the owner's
 * public profiles. Server Component.
 */
import { COMMIT, site } from "@/lib/dse/data";
import {
  AGENT_REPO,
  GITHUB_URL,
  OWNER_GITHUB,
  OWNER_LINKEDIN,
} from "@/lib/site";

const A =
  "focus-ring rounded underline decoration-neutral-400 underline-offset-2 hover:decoration-accent";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs text-neutral-600 sm:px-6 dark:text-neutral-400">
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
