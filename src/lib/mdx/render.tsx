/**
 * Render one of the MDX pages in content/pages with the site's components, server-side.
 *
 * Maths: `remark-math` + `rehype-katex` render `$…$` / `$$…$$` to HTML on the server, so no
 * KaTeX JavaScript ships; `remark-gfm` adds Markdown tables. Copied from the companion sites'
 * chapter page.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { mdxComponents } from "./components";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/**
 * Display equations scroll sideways on a phone; a scrollable region must be reachable by
 * keyboard (axe: scrollable-region-focusable), so every `.katex-display` gets tabIndex 0.
 */
function rehypeFocusableMath() {
  const walk = (n: HastNode): void => {
    const cls = n.properties?.className;
    if (
      n.type === "element" &&
      Array.isArray(cls) &&
      cls.includes("katex-display")
    )
      n.properties = { ...n.properties, tabIndex: 0 };
    n.children?.forEach(walk);
  };
  return (tree: HastNode) => walk(tree);
}

export const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export async function readPage(slug: string): Promise<string> {
  return readFile(path.join(PAGES_DIR, `${slug}.mdx`), "utf-8");
}

export async function MdxPage({
  slug,
}: {
  slug: string;
}): Promise<JSX.Element> {
  const source = await readPage(slug);
  return (
    <div className="mdx-content">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex, rehypeFocusableMath],
          },
        }}
      />
    </div>
  );
}
