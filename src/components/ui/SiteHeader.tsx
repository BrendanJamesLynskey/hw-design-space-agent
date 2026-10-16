/**
 * Site-wide header, in the agent sites' layout and classes. This site is a showcase, not one
 * of the *-explained family, so it carries no family switch; it names itself as the family's
 * headers do, keeps four pages in the bar and the rest under "More" (a native <details>, so it
 * works with no JavaScript), and links to the companion sites from there.
 */
import Link from "next/link";

import { AGENT_REPO, COMPANION_URL } from "@/lib/site";

const NAV = [
  { href: "/why", label: "Why" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/results", label: "Results" },
  { href: "/writeup", label: "Write-up" },
] as const;

const MORE = [
  { href: "/adoption", label: "For a hardware team" },
  { href: "/case-study", label: "Case study" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/record", label: "Record" },
  { href: "/about", label: "About" },
] as const;

const ITEM =
  "focus-ring inline-flex min-h-11 items-center rounded px-2 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white";
const MENU_ITEM =
  "focus-ring flex min-h-11 items-center rounded-md px-3 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white";

export function SiteHeader(): JSX.Element {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-6">
        <Link
          href="/"
          data-site-brand
          className="focus-ring whitespace-nowrap rounded text-sm font-medium tracking-tight"
        >
          HW Design-Space Agent
        </Link>
        <nav
          aria-label="Site"
          className="flex flex-nowrap items-center text-sm sm:gap-2"
        >
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={ITEM}>
              {n.label}
            </Link>
          ))}
          <details className="group relative" data-more-menu>
            <summary className="focus-ring inline-flex min-h-11 cursor-pointer list-none items-center rounded px-2 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white [&::-webkit-details-marker]:hidden">
              More{" "}
              <span aria-hidden className="ml-1 text-xs">
                ▾
              </span>
            </summary>
            <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
              {MORE.map((n) => (
                <Link key={n.href} href={n.href} className={MENU_ITEM}>
                  {n.label}
                </Link>
              ))}
              <a href={AGENT_REPO} className={MENU_ITEM}>
                Repo
              </a>
              <a
                href={COMPANION_URL}
                data-companion-sites
                className={`${MENU_ITEM} border-t border-neutral-200 dark:border-neutral-800`}
              >
                Companion sites ↗
              </a>
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
