"use client";

/**
 * /adoption: one request through the proposed deployment, step by step (src/lib/adoption.ts).
 * Each box says in words whether it exists in the repository today, exists in part, or is a
 * proposal; the border style repeats it (solid / dashed), never colour alone. Wide screens get
 * a grid with edges from the graph to each part; phones get one column with a spine on the left.
 */
import { useMemo } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { useSvgFont } from "@/components/viz/useSvgFont";
import {
  EDGES,
  NODES,
  STATUS_TEXT,
  edgePoints,
  flowFrames,
  layout,
  travel,
} from "@/lib/adoption";
import { OKABE_ITO } from "@/lib/viz/palette";

export default function DeploymentFlow(): JSX.Element {
  const frames = useMemo(() => flowFrames(), []);
  const stepper = useStepper(frames.length, { stepMs: 3200 });
  const f = frames[stepper.step]!;
  // measure against the wide picture; switch to the phone layout below ~600 px
  const font = useSvgFont(680);
  const narrow = font.scale < 0.9;
  const L = layout(narrow);
  // phones: the one-column picture is drawn about 1:1, so plain sizes a notch up
  const k = (font.scale * 680) / L.width; // rendered px per unit of the picture drawn
  const fs = (u: number) =>
    narrow ? Math.max(u * 1.15, 11.2 / k) : font.fs(u);
  const on = new Set(f.active);
  // edge key -> travelled against its drawn direction?
  const lit = new Map(
    f.edges.map((e) => {
      const t = travel(e);
      return [t.key, t.reversed] as const;
    }),
  );

  return (
    <AnimationPanel
      title="One request through the proposed deployment"
      summary={
        <>
          Which parts exist in the repository today and which are proposals, as
          a request moves through them. An architecture, not a measurement.
        </>
      }
      stepper={stepper}
      stepLabel="step"
      caption={f.caption}
      testId="deploy-widget"
      visual={
        <div className="min-w-0">
          <svg
            ref={font.ref}
            viewBox={`0 0 ${L.width} ${L.height}`}
            className="mx-auto w-full"
            style={{ maxWidth: narrow ? 360 : undefined }}
            role="img"
            aria-label={`Deployment diagram, step ${stepper.step + 1} of ${frames.length}: ${f.active.join(", ")} active`}
            data-layout={narrow ? "narrow" : "wide"}
          >
            <defs>
              <marker
                id="deploy-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={OKABE_ITO.orange} />
              </marker>
            </defs>
            {EDGES.map((e) => {
              const key = `${e.from}>${e.to}`;
              const hot = lit.has(key);
              const a = L.boxes[e.from]!;
              const b = L.boxes[e.to]!;
              // the arrowhead sits where the request arrives
              const back = lit.get(key) === true;
              if (narrow) {
                // a spine on the left: from the source box's left edge to the target's
                const [src, dst] = back ? [b, a] : [a, b];
                const y1 = src.y + src.h / 2;
                const y2 = dst.y + dst.h / 2;
                return (
                  <path
                    key={key}
                    data-edge={key}
                    data-hot={hot ? "true" : "false"}
                    d={`M${src.x},${y1} H12 V${y2} H${dst.x}`}
                    fill="none"
                    stroke={hot ? OKABE_ITO.orange : "currentColor"}
                    strokeOpacity={hot ? 1 : 0.15}
                    strokeWidth={hot ? 2.5 : 1}
                    markerEnd={hot ? "url(#deploy-arrow)" : undefined}
                  />
                );
              }
              const p = edgePoints(a, b);
              return (
                <line
                  key={key}
                  data-edge={key}
                  data-hot={hot ? "true" : "false"}
                  {...p}
                  stroke={hot ? OKABE_ITO.orange : "currentColor"}
                  strokeOpacity={hot ? 1 : 0.25}
                  strokeWidth={hot ? 3 : 1.2}
                  markerEnd={hot && !back ? "url(#deploy-arrow)" : undefined}
                  markerStart={hot && back ? "url(#deploy-arrow)" : undefined}
                />
              );
            })}
            {NODES.map((n) => {
              const b = L.boxes[n.id]!;
              const active = on.has(n.id);
              const dashed = n.status === "proposal";
              return (
                <g
                  key={n.id}
                  data-node={n.id}
                  data-status={n.status}
                  data-active={active ? "true" : "false"}
                  opacity={active ? 1 : 0.35}
                >
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx={6}
                    fill={n.id === "graph" ? OKABE_ITO.blue : "none"}
                    fillOpacity={n.id === "graph" ? 0.15 : 1}
                    stroke="currentColor"
                    strokeWidth={active ? 2 : 1}
                    strokeDasharray={dashed ? "6 4" : undefined}
                  />
                  <text
                    x={b.x + 8}
                    y={b.y + 18}
                    fontSize={fs(12)}
                    fontWeight={600}
                    fill="currentColor"
                  >
                    {n.label}
                  </text>
                  <text
                    x={b.x + 8}
                    y={b.y + 34}
                    fontSize={fs(10)}
                    fill="currentColor"
                  >
                    {n.sub}
                  </text>
                  <text
                    x={b.x + b.w - 6}
                    y={b.y + b.h - 6}
                    textAnchor="end"
                    fontSize={fs(9)}
                    fontStyle="italic"
                    fill="currentColor"
                  >
                    {STATUS_TEXT[n.status]}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-[0.7rem] text-neutral-600 dark:text-neutral-400">
            Solid border: exists in the repository at the vendored commit
            (&ldquo;partly&rdquo;: a smaller form exists, the rest is proposed).
            Dashed border: a proposal, not built.
          </p>
        </div>
      }
    />
  );
}
