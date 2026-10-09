/**
 * <RepoFile path="eval/results.md">eval/results.md</RepoFile>: a link to a file of the agent's
 * repository at the vendored commit, so the prose never hard-codes a commit. Server Component.
 */
import type { ReactNode } from "react";

import { site } from "@/lib/dse/data";
import { agentFile } from "@/lib/site";

export function RepoFile({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <a href={agentFile(path, site.vendored.commit)} data-repo-file={path}>
      {children}
    </a>
  );
}
