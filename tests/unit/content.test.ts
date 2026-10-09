/**
 * Every number the pages print with <V of="…" /> exists: a missing name would fail the
 * production build's prerender, so catch it here first.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { VALUES } from "@/lib/dse/values";

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

describe("quoted values", () => {
  it("every <V of> name in the pages exists", () => {
    const src = [...files("content/pages"), ...files("src/app")].filter((f) =>
      /\.(mdx|tsx)$/.test(f),
    );
    const names = new Set<string>();
    for (const f of src)
      for (const m of readFileSync(f, "utf-8").matchAll(/of="([^"]+)"/g))
        names.add(m[1]!);
    expect(names.size).toBeGreaterThan(50);
    for (const n of names) expect(VALUES[n], n).toBeDefined();
  });
});
