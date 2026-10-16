/**
 * This site's favicon glyph (src/app/icon.svg) and its card's graphic.
 * Glyph: the octagon of the site, the letter D, #a16207.
 */
import { site } from "@/lib/dse/data";

export function Glyph({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M9.5 0.5h13l9 9v13l-9 9h-13l-9-9v-13z" fill="#a16207" />
      <path
        d="M21.8 15.86Q21.8 19.41 19.79 21.21Q17.78 23 14.16 23H10.2V9H14.59Q16.78 9 18.4 9.78Q20.02 10.57 20.91 12.09Q21.8 13.61 21.8 15.86ZM18.73 15.94Q18.73 13.61 17.71 12.52Q16.69 11.43 14.75 11.43H13.16V20.55H14.43Q18.73 20.55 18.73 15.94Z"
        fill="#fff"
      />
    </svg>
  );
}

/**
 * The landing hero's ladder: one rung per level of the fidelity ladder (from spec intake down to
 * synthesis), live levels solid and planned ones outlined, with one spec's path descending them.
 * From the site's data at build time.
 */
export function Motif(): JSX.Element {
  const L = site.ladder;
  const step = 380 / L.length;
  const h = Math.min(30, step - 10);
  const pts = L.map(
    (_, i) => `${60 + i * (300 / (L.length - 1))},${20 + i * step + h / 2}`,
  ).join(" ");
  return (
    <svg width="440" height="420" viewBox="0 0 440 420">
      {L.map((lv, i) => (
        <rect
          key={lv.id}
          x={20 + i * (300 / (L.length - 1)) - 10}
          y={20 + i * step}
          width={120}
          height={h}
          rx={7}
          fill={lv.status === "live" ? "#a16207" : "#0b1020"}
          stroke="#f59e0b"
          strokeWidth={3}
        />
      ))}
      <polyline
        points={pts}
        fill="none"
        stroke="#fde68a"
        strokeWidth={5}
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
    </svg>
  );
}
