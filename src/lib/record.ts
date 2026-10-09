/**
 * The project record (content/record/project_record.md): the planner's engineering log of how
 * the project was built and why, published at /record. This splits it into its numbered
 * sections and turns the decision log's table into timeline entries; the rest of each section
 * is rendered as Markdown. tests/unit/record.test.ts checks the record's numbers against the
 * site's data, which is checked against the vendored repository.
 */
export type RecordSection = {
  /** "1" .. "9" */
  n: string;
  title: string;
  /** A URL fragment for the section. */
  id: string;
  body: string;
};

export type Decision = {
  date: string;
  decision: string;
  by: string;
  alternatives: string;
  why: string;
};

export type ProjectRecord = {
  title: string;
  /** The italic preamble under the title. */
  intro: string;
  lastUpdated: string;
  /** The "Repos:" part of the last-updated line. */
  repos: string;
  sections: RecordSection[];
  decisions: Decision[];
};

const slug = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Split one Markdown table row into its cells (no escaped pipes in the record). */
export function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

/** The decision log's rows, in order (the header and separator rows dropped). */
export function decisions(body: string): Decision[] {
  return body
    .split("\n")
    .filter((l) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(l))
    .map((l) => {
      const [date, decision, by, alternatives, why] = cells(l) as [
        string,
        string,
        string,
        string,
        string,
      ];
      return { date, decision, by, alternatives, why };
    });
}

export function parseRecord(md: string): ProjectRecord {
  const title = /^# (.+)$/m.exec(md)![1]!;
  const intro = /^[*_](A living record[\s\S]*?)[*_]$/m
    .exec(md)![1]!
    .replace(/\s+/g, " ");
  const updated =
    /^\*\*Last updated:\*\* (.+?)\. \*\*Repos:\*\* ([\s\S]+?)\n\n/m.exec(md)!;
  const parts = md.split(/^## (\d+)\. (.+)$/m);
  const sections: RecordSection[] = [];
  for (let i = 1; i < parts.length; i += 3) {
    const body = (parts[i + 2] ?? "").replace(/\n---\s*$/, "").trim();
    sections.push({
      n: parts[i]!,
      title: parts[i + 1]!,
      id: slug(parts[i + 1]!),
      body,
    });
  }
  const log = sections.find((s) => /decision log/i.test(s.title))!;
  return {
    title,
    intro,
    lastUpdated: updated[1]!,
    repos: updated[2]!.replace(/\s+/g, " ").trim(),
    sections,
    decisions: decisions(log.body),
  };
}

/** Who took a decision, as short tags: "owner", "planner", "executor". */
export function deciders(by: string): string[] {
  const out: string[] = [];
  if (/owner/.test(by)) out.push("owner");
  if (/planner/.test(by)) out.push("planner");
  if (/executor/.test(by)) out.push("executor");
  return out;
}
