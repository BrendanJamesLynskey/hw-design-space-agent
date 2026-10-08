"use client";

/**
 * The CORDIC micro-rotations, from the TS port of the bit-exact golden model (identical to
 * the Python reference on every register, tests/unit/cordic.test.ts). The vector (x, y)
 * rotates towards the input angle by ±atan(2^-i) per iteration; the residual angle z shrinks;
 * the error against the true cos and sin is shown per iteration. Width, iterations and the
 * input angle are parameters; the max error over all 2^W angles is recomputed exactly (in a
 * Web Worker) whenever W or N changes.
 */
import { useMemo, useState, type ReactNode } from "react";

import { AnimationPanel } from "@/components/anim/AnimationPanel";
import { useStepper } from "@/components/anim/useStepper";
import { Slider, Stat } from "@/components/ui/Controls";
import { useSvgFont } from "@/components/viz/useSvgFont";
import { rotationCaption } from "@/lib/dse/captions";
import {
  codeToRad,
  numerics,
  rotate,
  xyToReal,
  zToRad,
} from "@/lib/dse/cordic";
import { trim } from "@/lib/format";
import { OKABE_ITO } from "@/lib/viz/palette";

import { Prov } from "./Badges";
import { useAccuracy } from "./useAccuracy";

const S = 300; // circle panel size (viewBox units)
const R = 120;
const BW = 300; // error bars panel width

export function angleCode(degrees: number, W: number): number {
  const half = 2 ** (W - 1);
  return Math.max(
    -half,
    Math.min(half - 1, Math.round((degrees / 180) * half)),
  );
}

export default function CordicWidget({
  children,
}: {
  children?: ReactNode;
}): JSX.Element {
  const [W, setW] = useState(16);
  const [N, setN] = useState(14);
  const [angle, setAngle] = useState(130);
  const cfg = useMemo(() => numerics(W, N), [W, N]);
  const theta = angleCode(angle, W);
  const rot = useMemo(() => rotate(theta, cfg), [theta, cfg]);
  const stepper = useStepper(rot.states.length, {
    stepMs: 900,
    resetKey: `${W}|${N}|${angle}`,
  });
  const i = stepper.step;
  const s = rot.states[i]!;
  const font = useSvgFont(S + BW);
  const acc = useAccuracy(cfg);
  const [hover, setHover] = useState<string | null>(null);

  const th = codeToRad(theta, W);
  const x = xyToReal(s.x, cfg);
  const y = xyToReal(s.y, cfg);
  const z = zToRad(s.z, cfg.angleWidth);
  const lsb = 2 ** -(W - 2);
  const errs = rot.states.map((st) =>
    Math.max(
      Math.abs(xyToReal(st.x, cfg) - Math.cos(th)),
      Math.abs(xyToReal(st.y, cfg) - Math.sin(th)),
    ),
  );
  const cx = S / 2;
  const cy = S / 2;
  const px = (v: number) => cx + v * R;
  const py = (v: number) => cy - v * R;
  // error bars: log2 scale from 2^0 down to 2^-20
  const ex = (k: number) =>
    S + 24 + (k / Math.max(1, rot.states.length - 1)) * (BW - 40);
  const ey = (e: number) => {
    const b = Math.max(-20, Math.min(1, Math.log2(Math.max(e, 2 ** -20))));
    return 30 + ((1 - b) / 21) * (S - 70);
  };
  const hl = hover ?? (i === 0 ? "k" : "rot");

  return (
    <AnimationPanel
      title="CORDIC micro-rotations, bit for bit"
      summary={
        <>
          The TS port of the repo&apos;s bit-exact golden model, run on one
          input angle. Errors are exact.
        </>
      }
      stepper={stepper}
      stepLabel="iteration"
      countFrom={0}
      caption={rotationCaption(rot, cfg, i)}
      testId="cordic-widget"
      equation={children}
      hl={hl}
      onEquationHover={setHover}
      visual={
        <svg
          ref={font.ref}
          viewBox={`0 0 ${S + BW} ${S}`}
          className="w-full"
          role="img"
          aria-label={`Iteration ${i}: vector at ${trim((Math.atan2(y, x) * 180) / Math.PI, 4)} degrees, target ${angle} degrees`}
        >
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
          />
          <line
            x1={cx - R - 10}
            x2={cx + R + 10}
            y1={cy}
            y2={cy}
            stroke="currentColor"
            strokeOpacity={0.2}
          />
          <line
            x1={cx}
            x2={cx}
            y1={cy - R - 10}
            y2={cy + R + 10}
            stroke="currentColor"
            strokeOpacity={0.2}
          />
          <line
            data-mark="target"
            x1={cx}
            y1={cy}
            x2={px(Math.cos(th))}
            y2={py(Math.sin(th))}
            stroke={OKABE_ITO.green}
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          {rot.states.slice(0, i).map((st, k) => (
            <circle
              key={k}
              cx={px(xyToReal(st.x, cfg))}
              cy={py(xyToReal(st.y, cfg))}
              r={2.5}
              fill={OKABE_ITO.orange}
              opacity={0.5}
            />
          ))}
          <line
            data-mark="vector"
            x1={cx}
            y1={cy}
            x2={px(x)}
            y2={py(y)}
            stroke={OKABE_ITO.orange}
            strokeWidth={hl === "rot" || hl === "xy" ? 4 : 3}
          />
          <circle cx={px(x)} cy={py(y)} r={5} fill={OKABE_ITO.orange} />
          {/* residual angle z: an arc from the vector towards the target */}
          <path
            data-mark="residual"
            d={(() => {
              const a0 = Math.atan2(y, x);
              const a1 = a0 + z;
              const r = 40;
              const large = Math.abs(z) > Math.PI ? 1 : 0;
              const sweep = z > 0 ? 0 : 1;
              return `M ${cx + r * Math.cos(a0)} ${cy - r * Math.sin(a0)} A ${r} ${r} 0 ${large} ${sweep} ${cx + r * Math.cos(a1)} ${cy - r * Math.sin(a1)}`;
            })()}
            fill="none"
            stroke={OKABE_ITO.purple}
            strokeWidth={hl === "z" ? 4 : 2.5}
          />
          <text x={8} y={S - 10} fontSize={font.fs(12)} fill="currentColor">
            z = {trim((z * 180) / Math.PI, 4)}°
          </text>
          {/* per-iteration error */}
          <text x={S + 24} y={18} fontSize={font.fs(12)} fill="currentColor">
            error per iteration (log₂)
          </text>
          <line
            x1={S + 20}
            x2={S + BW - 10}
            y1={ey(lsb)}
            y2={ey(lsb)}
            stroke={OKABE_ITO.vermillion}
            strokeDasharray="4 3"
          />
          {!font.narrow && (
            <text
              x={S + BW - 10}
              y={ey(lsb) - 4}
              textAnchor="end"
              fontSize={font.fs(11)}
              fill="currentColor"
            >
              1 LSB
            </text>
          )}
          {errs.map((e, k) => (
            <rect
              key={k}
              data-mark="err"
              x={ex(k) - 3}
              y={ey(e)}
              width={6}
              height={S - 40 - ey(e)}
              fill={k === i ? OKABE_ITO.orange : "#a3a3a3"}
            />
          ))}
        </svg>
      }
      stats={
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            label="x → cos θ"
            value={`${trim(x, 6)}`}
            hint={`cos θ = ${trim(Math.cos(th), 6)}`}
          />
          <Stat
            label="y → sin θ"
            value={`${trim(y, 6)}`}
            hint={`sin θ = ${trim(Math.sin(th), 6)}`}
          />
          <Stat
            label="Error now"
            value={`${trim(errs[i]! / lsb)} LSB`}
            hint="this angle, exact"
          />
          <div data-testid="sweep-accuracy">
            <Stat
              label={`Max error, all ${2 ** W} angles`}
              value={acc ? `${trim(acc.maxAbsLsb)} LSB` : "computing…"}
              hint={
                acc
                  ? `${trim(acc.accuracyBits, 4)} accuracy bits · exact`
                  : "exact"
              }
            />
          </div>
        </div>
      }
      params={
        <>
          <Slider
            label="Data width W"
            value={W}
            min={8}
            max={16}
            onChange={setW}
            format={(v) => `${v} bits`}
          />
          <Slider
            label="Iterations N"
            value={N}
            min={4}
            max={24}
            onChange={setN}
          />
          <Slider
            label="Input angle"
            value={angle}
            min={-180}
            max={179}
            onChange={setAngle}
            format={(v) => `${v}° (code ${angleCode(v, W)})`}
          />
          <p className="self-end text-xs text-neutral-600 dark:text-neutral-400">
            Accuracy <Prov kind="exact" /> over every input code (W ≤ 16, as the
            repo sweeps it). The reference design is W=16, N=14.
          </p>
        </>
      }
    />
  );
}
