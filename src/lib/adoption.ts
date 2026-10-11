/**
 * /adoption ("For a hardware team"): the proposed deployment as data, and the states of its
 * animation as pure functions. One request flows through the system step by step; each part is
 * marked as existing in the agent's repository today, existing in part, or a proposal, and each
 * step's caption says which. Nothing here is a measurement: it is an architecture, and the
 * page's other sections link every claim about the agent to its evidence.
 */

export type Status = "exists" | "partly" | "proposal";

export type DeployNode = {
  id: string;
  label: string;
  /** One short line under the label: what exists, what is proposed. */
  sub: string;
  status: Status;
};

export const NODES: DeployNode[] = [
  {
    id: "ci",
    label: "CI on a pull request",
    sub: "a spec change starts a run",
    status: "proposal",
  },
  {
    id: "general",
    label: "General-purpose agent",
    sub: "front end; calls run_dse (MCP)",
    status: "proposal",
  },
  {
    id: "graph",
    label: "DSE graph (LangGraph)",
    sub: "hw_dse; containerised by the farm",
    status: "partly",
  },
  {
    id: "human",
    label: "Engineer approves",
    sub: "interrupt() gates; web UI or chat",
    status: "partly",
  },
  {
    id: "llm",
    label: "LLM",
    sub: "on-prem open weights or an API",
    status: "partly",
  },
  {
    id: "models",
    label: "Models and checks (code)",
    sub: "golden, cost, cycle, system models",
    status: "exists",
  },
  {
    id: "farm",
    label: "EDA farm",
    sub: "Slurm/LSF jobs; licence server",
    status: "proposal",
  },
  {
    id: "state",
    label: "Checkpoints and Store",
    sub: "SQLite + memory today; Postgres",
    status: "partly",
  },
  {
    id: "audit",
    label: "Audit and budgets",
    sub: "traces, spend caps, a vault",
    status: "partly",
  },
];

export type Edge = { from: string; to: string };

export const EDGES: Edge[] = [
  { from: "ci", to: "graph" },
  { from: "general", to: "graph" },
  { from: "graph", to: "human" },
  { from: "graph", to: "llm" },
  { from: "graph", to: "models" },
  { from: "graph", to: "farm" },
  { from: "graph", to: "state" },
  { from: "graph", to: "audit" },
];

export type FlowStep = {
  /** Nodes lit at this step (the rest are dimmed but still drawn). */
  active: string[];
  /** Edges a request travels on at this step, "from>to". */
  edges: string[];
  caption: string;
};

/** One request, start to finish. The captions name what exists and what is proposed. */
export const FLOW: FlowStep[] = [
  {
    active: NODES.map((n) => n.id),
    edges: [],
    caption:
      "The proposed deployment. Solid boxes exist in the repository today, solid boxes marked 'partly' exist in a smaller form, and dashed boxes are proposals. Step through one request.",
  },
  {
    active: ["ci", "general", "graph"],
    edges: ["ci>graph", "general>graph"],
    caption:
      "A run starts from a spec. Proposed: a spec change on a pull request starts it in CI, or an engineer asks a general-purpose agent, which calls the graph as an MCP tool (run_dse). Today a run starts from the command line (hw-dse run).",
  },
  {
    active: ["graph", "human"],
    edges: ["graph>human"],
    caption:
      "L0: code validates the spec and pauses at an interrupt() gate until an engineer confirms it. The gate exists (answered in the command line); a web UI or chat front end is the proposal.",
  },
  {
    active: ["graph", "llm"],
    edges: ["graph>llm"],
    caption:
      "L1: the LLM picks families and parameter ranges and decides what to explore next. Its output schemas have no field for a number about a design. Proposed: an open-weights model on an on-prem server (an ollama provider exists in the code; the recorded runs used OpenRouter), or an enterprise API under the company's data terms.",
  },
  {
    active: ["graph", "models"],
    edges: ["graph>models"],
    caption:
      "Code scores every candidate: the golden model (exact), the cost models (estimate), the cycle and system models (simulated). This exists, with every number labelled.",
  },
  {
    active: ["graph", "farm"],
    edges: ["graph>farm"],
    caption:
      "Shortlisted designs go down the ladder: RTL simulation, synthesis, gate-level simulation. Proposed: as jobs on the farm's own scheduler, drawing licences from its licence server. Today they run on one machine (Verilator, Icarus, Yosys, nextpnr, OpenSTA, and Vivado locally).",
  },
  {
    active: ["graph", "state"],
    edges: ["graph>state"],
    caption:
      "Every step is checkpointed, so a paused or crashed run resumes (hw-dse resume, SQLite today), and a fleet shares a LangGraph Store (in memory today). Proposed: Postgres for both, so runs survive across machines.",
  },
  {
    active: ["graph", "human"],
    edges: ["graph>human"],
    caption:
      "The engineer picks the design off the front at the second interrupt() gate, seeing each number's provenance. The gate exists (answered in the command line); the web UI or chat is the proposal.",
  },
  {
    active: ["graph", "audit", "ci"],
    edges: ["graph>audit", "graph>ci"],
    caption:
      "The run ends. Every LLM call is already traced (keys redacted) and the eval harness stops before a spend cap. Proposed: the report posted on the pull request, secrets in a vault, model snapshots pinned and a reference set re-run each session to track provider drift.",
  },
];

/**
 * A step's edge "a>b" is travelled from a to b; the drawn edge is the one in EDGES joining them
 * (either way round). Returns its key in EDGES and whether it is travelled against its direction.
 */
export function travel(step: string): { key: string; reversed: boolean } {
  const [a, b] = step.split(">");
  if (EDGES.some((e) => e.from === a && e.to === b))
    return { key: step, reversed: false };
  if (EDGES.some((e) => e.from === b && e.to === a))
    return { key: `${b}>${a}`, reversed: true };
  throw new Error(`no edge joins ${a} and ${b}`);
}

export function flowFrames(): FlowStep[] {
  return FLOW;
}

export const STATUS_TEXT: Record<Status, string> = {
  exists: "exists",
  partly: "partly",
  proposal: "proposal",
};

/** The diagram's boxes: a two-column grid when wide, one column on a phone. */
export type Box = { id: string; x: number; y: number; w: number; h: number };

export function layout(narrow: boolean): {
  width: number;
  height: number;
  boxes: Record<string, Box>;
} {
  if (narrow) {
    const w = 274;
    const h = 56;
    const gap = 14;
    const order = [
      "ci",
      "general",
      "graph",
      "human",
      "llm",
      "models",
      "farm",
      "state",
      "audit",
    ];
    const boxes: Record<string, Box> = {};
    order.forEach((id, i) => {
      boxes[id] = { id, x: 22, y: 10 + i * (h + gap), w, h };
    });
    return { width: 300, height: 20 + order.length * (h + gap), boxes };
  }
  const w = 210;
  const h = 56;
  const at = (id: string, x: number, y: number): Box => ({ id, x, y, w, h });
  const boxes: Record<string, Box> = {
    ci: at("ci", 15, 20),
    audit: at("audit", 235, 20),
    general: at("general", 455, 20),
    human: at("human", 15, 150),
    graph: at("graph", 235, 150),
    llm: at("llm", 455, 150),
    models: at("models", 15, 280),
    farm: at("farm", 235, 280),
    state: at("state", 455, 280),
  };
  return { width: 680, height: 356, boxes };
}

/** Where an edge leaves and enters its boxes (centre to centre, clipped to the box edges). */
export function edgePoints(
  a: Box,
  b: Box,
): { x1: number; y1: number; x2: number; y2: number } {
  const ca = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  const cb = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const clip = (c: { x: number; y: number }, box: Box, to: typeof c) => {
    const dx = to.x - c.x;
    const dy = to.y - c.y;
    const sx = dx === 0 ? Infinity : box.w / 2 / Math.abs(dx);
    const sy = dy === 0 ? Infinity : box.h / 2 / Math.abs(dy);
    const s = Math.min(sx, sy);
    return { x: c.x + dx * s, y: c.y + dy * s };
  };
  const p = clip(ca, a, cb);
  const q = clip(cb, b, ca);
  return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
}

/** The write-up's own "What I would do next" list, read from the vendored file. */
export function nextSteps(md: string): string[] {
  const start = md.indexOf("## What I would do next");
  if (start < 0) return [];
  const rest = md.slice(start).split("\n").slice(1).join("\n");
  const end = rest.search(/^## /m);
  const body = (end < 0 ? rest : rest.slice(0, end)).replace(
    /<!--[\s\S]*?-->/g,
    "",
  );
  return body
    .split(/^\d+\.\s+/m)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}
