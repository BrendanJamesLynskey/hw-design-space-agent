/**
 * /about: the author, as both a software developer and a hardware domain expert. Two columns,
 * each line linked to public evidence (every linked repository was read before it was linked,
 * and each line claims only what that repository shows). Then education and contact: GitHub
 * and LinkedIn only. Server Component, static.
 */
import Link from "next/link";

import { COMMIT, ev, site } from "@/lib/dse/data";
import { fmtInt } from "@/lib/format";
import {
  AGENT_REPO,
  CONTEXT_URL,
  GITHUB_URL,
  HARNESSES_URL,
  OWNER_GITHUB,
  OWNER_LINKEDIN,
  PROTOCOLS_URL,
  ownerRepo,
} from "@/lib/site";

export const metadata = {
  title: "About",
  description:
    "Brendan Lynskey: a software developer and a hardware engineer with more than 25 years in FPGA, SoC, power, signal integrity, PCB and DSP. The evidence, linked.",
};

const A =
  "focus-ring rounded text-accent underline underline-offset-2 dark:text-indigo-300";

type Item = {
  title: string;
  body: string;
  links: { href: string; label: string }[];
};

const SOFTWARE: Item[] = [
  {
    title: "LangGraph and LangChain agents",
    body: "This project: a LangGraph graph with Send fan-out, interrupt() for human approval, SQLite checkpointing and structured output whose schemas leave no field for a number. Also a LangGraph coding agent with sub-agents, MCP tools and a local Ollama provider.",
    links: [
      { href: AGENT_REPO, label: "HW_Design_Space_Agent" },
      {
        href: ownerRepo("Raschka_Coding_Agent_LangGraph"),
        label: "Raschka_Coding_Agent_LangGraph",
      },
    ],
  },
  {
    title: "Python simulators and models",
    body: "Deterministic, tested models that other code is checked against: the bit-exact CORDIC golden model and cost model here, an agent-loop simulator, and a SimPy discrete-event simulator of disaggregated LLM serving.",
    links: [
      { href: ownerRepo("Agent_Loop_Sim"), label: "Agent_Loop_Sim" },
      {
        href: ownerRepo("Disaggregated_Inference_Sim"),
        label: "Disaggregated_Inference_Sim",
      },
    ],
  },
  {
    title: "TypeScript and Next.js",
    body: "This site and a family of animated explainer sites, each driven by a TypeScript port that reproduces its Python reference exactly, rendered statically, with Web Workers for the heavy models.",
    links: [
      { href: HARNESSES_URL, label: "Agent Harnesses Explained" },
      { href: PROTOCOLS_URL, label: "Agent Protocols Explained" },
      { href: CONTEXT_URL, label: "Agent Context Explained" },
    ],
  },
  {
    title: "Testing and CI",
    body: "Parity tests between languages with no tolerance, frame tests on every animation, end-to-end tests at desktop and phone widths in light and dark mode, accessibility scans and Lighthouse budgets in CI; in the agent's CI, generated RTL checked against the golden model in two simulators, formal proofs, gate-level simulation and a synthesis smoke test.",
    links: [
      { href: `${GITHUB_URL}/actions`, label: "this site's CI" },
      { href: `${AGENT_REPO}/actions`, label: "the agent's CI" },
    ],
  },
  {
    title: "MCP",
    body: "Hands-on Model Context Protocol playgrounds: tools, resources and prompts servers behind a gateway and an SSE bridge, each with a web client.",
    links: [
      {
        href: ownerRepo("MCP_Gateway_Playground"),
        label: "MCP_Gateway_Playground",
      },
      {
        href: ownerRepo("MCP_Supergateway_Playground"),
        label: "MCP_Supergateway_Playground",
      },
    ],
  },
];

const HARDWARE: Item[] = [
  {
    title: "FPGA and RTL",
    body: "SystemVerilog and VHDL, Xilinx certified, UltraScale+. Public examples: the synthesisable CORDIC modules this project starts from, and this project's generator of verified SystemVerilog for four CORDIC architectures (synthesised with Yosys, nextpnr-xilinx and Vivado 2025.2); a parameterised AXI4 crossbar, a MESI cache controller, and an AHB-to-MII Ethernet MAC in VHDL with its testbench and verification plans.",
    links: [
      { href: ownerRepo("CORDIC"), label: "CORDIC" },
      { href: AGENT_REPO, label: "HW_Design_Space_Agent" },
      { href: ownerRepo("AXI4_Crossbar"), label: "AXI4_Crossbar" },
      {
        href: ownerRepo("Cache_Controller_MESI"),
        label: "Cache_Controller_MESI",
      },
      { href: ownerRepo("VHDL_example_code"), label: "VHDL_example_code" },
    ],
  },
  {
    title: "SoC and RISC-V",
    body: "A RISC-V SoC integrating a 5-stage RV32IMC CPU, an AXI4 crossbar, MMUs, a MESI cache, DMA, an IOMMU and a PLIC, each verified on its own first.",
    links: [{ href: ownerRepo("RISCV_SoC"), label: "RISCV_SoC" }],
  },
  {
    title: "Power: multiphase DC-DC and PDN",
    body: "Multiphase DC-DC conversion and power-delivery-network design. Public example: DC-DC converter control (PWM, PFM, hysteretic and constant on-time, with load-transient comparisons).",
    links: [
      {
        href: ownerRepo("DCDC_Control_Techniques"),
        label: "DCDC_Control_Techniques",
      },
    ],
  },
  {
    title: "Signal and power integrity, thermal",
    body: "Seventeen interactive decks on signal integrity and high-speed digital design in which every number is computed by a model and checked against published work.",
    links: [{ href: ownerRepo("Signal_Integrity"), label: "Signal_Integrity" }],
  },
  {
    title: "PCB: HDI, DDR, PCIe and MIPI",
    body: "High-density boards with DDR, PCIe and MIPI interfaces: schematic and layout practice, design for manufacture and board bring-up.",
    links: [],
  },
  {
    title: "DSP (MSc)",
    body: "Signal processing, the subject of an MSc. Public example: a collection of browser-based DSP, synthesis and analysis projects.",
    links: [{ href: ownerRepo("DSP_and_Music"), label: "DSP_and_Music" }],
  },
];

function Column({
  heading,
  items,
  id,
}: {
  heading: string;
  items: Item[];
  id: string;
}): JSX.Element {
  return (
    <section aria-labelledby={id} className="min-w-0">
      <h2 id={id} className="text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      <ul className="mt-4 space-y-5">
        {items.map((it) => (
          <li key={it.title}>
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              {it.body}
            </p>
            {it.links.length > 0 && (
              <p
                className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
                data-personal-projects
              >
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                  Personal projects:
                </span>
                {it.links.map((l) => (
                  <a key={l.href + l.label} href={l.href} className={A}>
                    {l.label}
                  </a>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AboutPage(): JSX.Element {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-indigo-300">
        /about
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Software and hardware
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-neutral-700 dark:text-neutral-300">
        I&apos;m Brendan Lynskey, a staff-level engineer with more than 25 years
        in hardware, and I write the software too. This project needs both: the
        agent, the tests and this site are software; knowing which architectures
        to offer the agent, what a cost model must count, and where a two-point
        calibration stops being trustworthy is hardware.
      </p>

      <p
        className="mt-6 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400"
        data-testid="personal-note"
      >
        Links go to my personal projects on GitHub (and the sites built from
        them).
      </p>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <Column heading="Software" items={SOFTWARE} id="software" />
        <Column heading="Hardware (25+ years)" items={HARDWARE} id="hardware" />
      </div>

      <section aria-labelledby="education" className="mt-12">
        <h2 id="education" className="text-xl font-semibold tracking-tight">
          Education
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-neutral-700 dark:text-neutral-300">
          <li>BEng Electronic Engineering</li>
          <li>MSc Music Technology (DSP)</li>
          <li>MSc Low Power Systems Integration</li>
          <li>Diploma in Mathematics</li>
        </ul>
      </section>

      <section aria-labelledby="contact" className="mt-12">
        <h2 id="contact" className="text-xl font-semibold tracking-tight">
          Contact
        </h2>
        <p className="mt-3 flex flex-wrap gap-4">
          <a href={OWNER_GITHUB} className={A}>
            GitHub: BrendanJamesLynskey
          </a>
          <a href={OWNER_LINKEDIN} className={A}>
            LinkedIn
          </a>
        </p>
      </section>

      <section aria-labelledby="record" className="mt-12">
        <h2 id="record" className="text-xl font-semibold tracking-tight">
          How it was built, and why
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-neutral-700 dark:text-neutral-300">
          The{" "}
          <Link href="/record" className={A}>
            project record
          </Link>{" "}
          is the engineering log: the principles every milestone follows, how
          the work is planned, done and independently verified with AI coding
          agents, every decision with its alternatives and reasons, what review
          found, and what is still missing.
        </p>
      </section>

      <section aria-labelledby="site" className="mt-12">
        <h2 id="site" className="text-xl font-semibold tracking-tight">
          About this site
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-neutral-700 dark:text-neutral-300">
          Every number here comes from{" "}
          <a href={AGENT_REPO} className={A}>
            HW_Design_Space_Agent
          </a>{" "}
          at commit {COMMIT} (
          {ev("m1").trace_runs + ev("m2").trace_runs + site.spend.m2.pilot_runs}{" "}
          recorded run traces: M1&apos;s {ev("m1").costs.runs} scored runs and
          one that crashed before scoring, M2&apos;s {ev("m2").costs.runs} runs
          and its {site.spend.m2.pilot_runs}-run pilot;{" "}
          {fmtInt(site.trace_calls)} LLM calls), vendored byte for byte with its
          hashes, or from the TypeScript ports of its golden model and cost
          model, which match the Python reference exactly. A Python script
          regenerates the site&apos;s data from the vendored files and checks
          every results row against the repository&apos;s own results table; the
          site&apos;s CI fails if anything drifts. Nothing calls a language
          model at runtime. The design and the animation framework come from the{" "}
          <a href={HARNESSES_URL} className={A}>
            agent sites
          </a>
          .{" "}
          <Link href="/" className={A}>
            Home
          </Link>{" "}
          ·{" "}
          <a href={GITHUB_URL} className={A}>
            source
          </a>
          .
        </p>
      </section>
    </main>
  );
}
