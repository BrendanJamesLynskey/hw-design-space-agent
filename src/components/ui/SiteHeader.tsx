/**
 * Site-wide header, in the agent sites' layout and classes. This site is a showcase, not one
 * of the *-explained family, so it carries no family switch: its own pages and the repository.
 */
import Link from "next/link";

import { AGENT_REPO } from "@/lib/site";

const NAV = [
  { href: "/why", label: "Why" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/case-study", label: "Case study" },
  { href: "/results", label: "Results" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader(): JSX.Element {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="focus-ring rounded font-mono text-sm font-medium tracking-tight"
        >
          hw-design-space-agent
        </Link>
        <nav
          aria-label="Site"
          className="flex flex-wrap items-center gap-1 text-sm sm:gap-3"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="focus-ring inline-flex min-h-11 items-center rounded px-2 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={AGENT_REPO}
            className="focus-ring inline-flex min-h-11 items-center rounded px-2 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
          >
            Repo
          </a>
        </nav>
      </div>
    </header>
  );
}
