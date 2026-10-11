/**
 * The repository's final write-up (vendor/hw_dse/docs/WRITEUP.md, vendored byte for byte),
 * split for the /writeup page: its title and opening, its "## " sections, and inside each
 * section the Markdown, the "<!-- facts: … -->" comments that name the fact behind every number
 * (the repository's tests/test_writeup.py binds each printed number to one of them, in order),
 * and the Mermaid flowchart, which the page draws as a diagram. The text itself is never edited:
 * the page renders it as plain Markdown (no MDX, no maths), so "$0.0090" stays a dollar amount.
 */
export type FlowNode = { id: string; lines: string[] };
export type FlowEdge = {
  from: string;
  to: string;
  dashed: boolean;
  label: string[];
};
export type Flow = { direction: string; nodes: FlowNode[]; edges: FlowEdge[] };

export type Block =
  | { kind: "md"; text: string }
  | { kind: "facts"; names: string[] }
  | { kind: "flow"; flow: Flow };

export type WriteupSection = { title: string; id: string; blocks: Block[] };

export type Writeup = {
  title: string;
  intro: Block[];
  sections: WriteupSection[];
};

export const slug = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const lines = (label: string): string[] =>
  label.split(/<br\s*\/?>/).map((x) => x.trim());

/** A Mermaid `flowchart` with `A["label"] --> B` and `A -. "label" .-> B` edges. */
export function parseFlow(src: string): Flow {
  const rows = src.split("\n").map((l) => l.trim());
  const direction = /^flowchart\s+(\w+)/.exec(rows[0] ?? "")?.[1] ?? "TD";
  const nodes: FlowNode[] = [];
  const add = (id: string, label?: string) => {
    const known = nodes.find((n) => n.id === id);
    if (known) {
      if (label) known.lines = lines(label);
      return;
    }
    nodes.push({ id, lines: label ? lines(label) : [id] });
  };
  const edges: FlowEdge[] = [];
  for (const row of rows.slice(1)) {
    for (const m of row.matchAll(/(\w+)\["([^"]*)"\]/g)) add(m[1]!, m[2]);
    const dashed = /^(\w+)\s*-\.\s*"([^"]*)"\s*\.->\s*(\w+)/.exec(row);
    if (dashed) {
      add(dashed[1]!);
      add(dashed[3]!);
      edges.push({
        from: dashed[1]!,
        to: dashed[3]!,
        dashed: true,
        label: lines(dashed[2]!),
      });
      continue;
    }
    const solid = /^(\w+)(?:\["[^"]*"\])?\s*-->\s*(\w+)/.exec(row);
    if (solid) {
      add(solid[1]!);
      add(solid[2]!);
      edges.push({ from: solid[1]!, to: solid[2]!, dashed: false, label: [] });
    }
  }
  return { direction, nodes, edges };
}

/** Markdown with its facts comments and Mermaid blocks taken out, in order. */
export function blocks(md: string): Block[] {
  const out: Block[] = [];
  const parts = md.split(/(<!--[\s\S]*?-->|```mermaid\n[\s\S]*?```)/);
  for (const p of parts) {
    if (!p.trim()) continue;
    if (p.startsWith("<!--")) {
      const m = /^<!--\s*facts:([\s\S]*?)-->$/.exec(p);
      if (m)
        out.push({ kind: "facts", names: m[1]!.split(/\s+/).filter(Boolean) });
    } else if (p.startsWith("```mermaid")) {
      out.push({
        kind: "flow",
        flow: parseFlow(p.replace(/^```mermaid\n/, "").replace(/```$/, "")),
      });
    } else out.push({ kind: "md", text: p.trim() });
  }
  return out;
}

export function parseWriteup(md: string): Writeup {
  const title = /^# (.+)$/m.exec(md)![1]!;
  const body = md.replace(/^# .+\n/m, "");
  const parts = body.split(/^## (.+)$/m);
  const sections: WriteupSection[] = [];
  for (let i = 1; i < parts.length; i += 2)
    sections.push({
      title: parts[i]!.trim(),
      id: slug(parts[i]!),
      blocks: blocks(parts[i + 1] ?? ""),
    });
  return { title, intro: blocks(parts[0] ?? ""), sections };
}

/** A fact's value as the page lists it: numbers to six significant figures. */
export function factValue(v: unknown): string {
  if (typeof v === "number")
    return Number.isInteger(v)
      ? v.toLocaleString("en-GB")
      : String(Number(v.toPrecision(6)));
  return String(v);
}
