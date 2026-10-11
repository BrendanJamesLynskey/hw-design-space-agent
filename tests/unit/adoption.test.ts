/**
 * /adoption: the deployment animation's frames and layouts, the write-up's next steps as the
 * page reads them, and the page's claims: every value it quotes resolves, every repository
 * anchor it links exists in the vendored README, and the numbers it states match the data.
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  EDGES,
  FLOW,
  NODES,
  edgePoints,
  flowFrames,
  layout,
  nextSteps,
  travel,
} from "@/lib/adoption";
import { lookup } from "@/lib/dse/values";

const PAGE = readFileSync("src/app/adoption/page.tsx", "utf-8");
const README = readFileSync("vendor/hw_dse/README.md", "utf-8");
const WRITEUP = readFileSync("vendor/hw_dse/docs/WRITEUP.md", "utf-8");
const FACTS = JSON.parse(
  readFileSync("vendor/hw_dse/docs/writeup_facts.json", "utf-8"),
) as Record<string, number>;

const ids = new Set(NODES.map((n) => n.id));

describe("the deployment animation", () => {
  const frames = flowFrames();

  it("walks one request: overview, start, both gates, the LLM, code, the farm, state, the end", () => {
    expect(frames.length).toBe(9);
    expect(frames[0]!.active).toEqual(NODES.map((n) => n.id));
    expect(frames[0]!.edges).toEqual([]);
    for (const f of frames) {
      for (const a of f.active) expect(ids.has(a), a).toBe(true);
      for (const e of f.edges) expect(() => travel(e), e).not.toThrow();
    }
  });

  it("key frames: the captions say what exists and what is proposed", () => {
    expect(frames[0]!.caption).toContain("dashed boxes are proposals");
    expect(frames[2]!.caption).toContain("interrupt() gate");
    expect(frames[3]!.caption).toContain(
      "Its output schemas have no field for a number about a design",
    );
    expect(frames[3]!.caption).toContain("the recorded runs used OpenRouter");
    expect(frames[4]!.caption).toContain("This exists");
    expect(frames[5]!.caption).toContain("Proposed: as jobs on the farm");
    expect(frames[8]!.caption).toContain("keys redacted");
    // every frame that lights a part other than the graph that is not wholly built says so
    for (const f of FLOW.slice(1)) {
      const proposals = f.active.filter(
        (a) =>
          a !== "graph" && NODES.find((n) => n.id === a)!.status !== "exists",
      );
      if (proposals.length)
        expect(f.caption, f.caption).toMatch(/[Pp]ropos|exists \(/);
    }
  });

  it("the parts that are proposals are the ones the repository does not have", () => {
    const st = Object.fromEntries(NODES.map((n) => [n.id, n.status]));
    expect(st.models).toBe("exists");
    expect(st.ci).toBe("proposal");
    expect(st.general).toBe("proposal");
    expect(st.farm).toBe("proposal");
    for (const p of ["graph", "human", "llm", "state", "audit"])
      expect(st[p], p).toBe("partly");
  });

  for (const narrow of [false, true])
    it(`${narrow ? "phone" : "wide"} layout: every box inside the picture, none overlapping`, () => {
      const L = layout(narrow);
      const boxes = Object.values(L.boxes);
      expect(boxes.map((b) => b.id).sort()).toEqual([...ids].sort());
      for (const b of boxes) {
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.y).toBeGreaterThanOrEqual(0);
        expect(b.x + b.w).toBeLessThanOrEqual(L.width);
        expect(b.y + b.h).toBeLessThanOrEqual(L.height);
      }
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i]!;
          const b = boxes[j]!;
          const apart =
            a.x + a.w <= b.x ||
            b.x + b.w <= a.x ||
            a.y + a.h <= b.y ||
            b.y + b.h <= a.y;
          expect(apart, `${a.id} / ${b.id}`).toBe(true);
        }
    });

  it("edges are travelled either way: the report goes back to the pull request", () => {
    expect(travel("ci>graph")).toEqual({ key: "ci>graph", reversed: false });
    expect(travel("graph>ci")).toEqual({ key: "ci>graph", reversed: true });
    expect(frames[8]!.edges).toContain("graph>ci");
    expect(() => travel("ci>farm")).toThrow("no edge joins ci and farm");
  });

  it("wide edges start and end on their boxes' borders", () => {
    const L = layout(false);
    for (const e of EDGES) {
      const a = L.boxes[e.from]!;
      const b = L.boxes[e.to]!;
      const p = edgePoints(a, b);
      const onBorder = (x: number, y: number, bx: typeof a) =>
        (Math.abs(x - bx.x) < 1e-6 ||
          Math.abs(x - bx.x - bx.w) < 1e-6 ||
          Math.abs(y - bx.y) < 1e-6 ||
          Math.abs(y - bx.y - bx.h) < 1e-6) &&
        x >= bx.x - 1e-6 &&
        x <= bx.x + bx.w + 1e-6 &&
        y >= bx.y - 1e-6 &&
        y <= bx.y + bx.h + 1e-6;
      expect(onBorder(p.x1, p.y1, a), `${e.from} start`).toBe(true);
      expect(onBorder(p.x2, p.y2, b), `${e.to} end`).toBe(true);
    }
    // a vertical edge clips to top and bottom
    expect(
      edgePoints(
        { id: "a", x: 0, y: 0, w: 10, h: 10 },
        { id: "b", x: 0, y: 20, w: 10, h: 10 },
      ),
    ).toEqual({ x1: 5, y1: 10, x2: 5, y2: 20 });
  });
});

describe("the page's sources", () => {
  it("reads the write-up's own next steps (five, the Vivado item rewritten after the runs)", () => {
    const s = nextSteps(WRITEUP);
    expect(s).toHaveLength(5);
    expect(s[0]).toMatch(/^A routed timing scale and real switching activity/);
    expect(s[0]).toContain("The local Vivado runs are done");
    expect(s[1]).toMatch(/^Place and route on sky130/);
    expect(s[4]).toContain("provider drift");
    expect(s.join(" ")).not.toContain("<!--");
    expect(nextSteps("no such section")).toEqual([]);
  });

  it("every value it quotes resolves", () => {
    const keys = [...PAGE.matchAll(/V_\("([^"]+)"/g)].map((m) => m[1]!);
    expect(keys.length).toBeGreaterThan(15);
    for (const k of keys) expect(() => lookup(k), k).not.toThrow();
    const facts = [...PAGE.matchAll(/f1\("([^"]+)"\)/g)].map((m) => m[1]!);
    expect(facts.length).toBe(4);
    for (const f of facts) expect(typeof FACTS[f], f).toBe("number");
  });

  it("every README anchor it links is a heading of the vendored README", () => {
    const slug = (h: string) =>
      h
        .toLowerCase()
        .replace(/[^\w\- ]/g, "")
        .replace(/ /g, "-");
    const heads = new Set(
      [...README.matchAll(/^#{1,6} (.+)$/gm)].map((m) => slug(m[1]!)),
    );
    const anchors = [...PAGE.matchAll(/to="README\.md#([^"]+)"/g)].map(
      (m) => m[1]!,
    );
    expect(anchors.length).toBeGreaterThanOrEqual(3);
    for (const a of anchors) expect(heads.has(a), a).toBe(true);
  });

  it("its numbers: Qwen with reasoning off against NSGA-II (M2), the drift, the model errors", () => {
    expect(lookup("m2.dds_250msps.qwen_off_regret")).toBeLessThan(
      lookup("m2.dds_250msps.nsga2_regret") as number,
    );
    expect(lookup("m2.low_area_control.qwen_off_regret")).toBeLessThan(
      lookup("m2.low_area_control.nsga2_regret") as number,
    );
    // and the loss the page states
    expect(lookup("m2.high_precision.qwen_off_regret")).toBeGreaterThan(
      lookup("m2.high_precision.nsga2_regret") as number,
    );
    expect(FACTS["fpga.fmax_err_vs_vivado_max"]).toBe(17);
    expect(FACTS["asic.ho.fmax_err_max"]).toBe(39.6);
    expect(FACTS["drift.qwen.low_area.m2_regret"]).toBe(3.7);
    expect(FACTS["drift.qwen.low_area.m4_regret"]!.toFixed(1)).toBe("22.8");
    expect(README).toContain(
      "**The LLM is never the optimiser and never produces a PPA, accuracy or system-level number.**",
    );
    expect(README.replace(/\s+/g, " ")).toContain(
      "and no field where a number about a design could go",
    );
    expect(README).toContain(
      "extras: openai, anthropic, gemini, ollama, campaign",
    );
  });

  it("is public-safe: no email address, no mailto", () => {
    expect(PAGE).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/);
    expect(PAGE).not.toContain("mailto:");
  });
});
