/**
 * Site-wide constants: this site's URL, the repository it showcases, the owner's public
 * profiles, and the related sites.
 */

/** This site (production). */
export const SITE_URL = "https://hw-design-space-agent.vercel.app";

/** The project this site presents. */
export const AGENT_REPO =
  "https://github.com/BrendanJamesLynskey/HW_Design_Space_Agent";
/** This site's own repository. */
export const GITHUB_URL =
  "https://github.com/BrendanJamesLynskey/hw-design-space-agent";

export const OWNER_GITHUB = "https://github.com/BrendanJamesLynskey";
export const OWNER_LINKEDIN =
  "https://www.linkedin.com/in/brendan-lynskey-a891705";

/** The agent sites this one sits next to (Related links). */
export const HARNESSES_URL = "https://agent-harnesses-explained.vercel.app";
export const PROTOCOLS_URL = "https://agent-protocols-explained.vercel.app";
export const CONTEXT_URL = "https://agent-context-explained.vercel.app";
export const LLMS_HUB = "https://github.com/BrendanJamesLynskey/LLMs";

/** A file in the agent's repository at a commit. */
export function agentFile(path: string, commit: string): string {
  return `${AGENT_REPO}/blob/${commit}/${path}`;
}

/** A repository of the owner's on GitHub. */
export function ownerRepo(name: string): string {
  return `${OWNER_GITHUB}/${name}`;
}

/** The Knuth paper (verified at Crossref: ACM Computing Surveys 6(4), 261–301, Dec 1974). */
export const KNUTH_DOI = "https://doi.org/10.1145/356635.356640";
