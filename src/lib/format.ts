/**
 * Number formatting for the captions and readouts (as on the companion sites: up to three
 * significant figures, en-GB grouping).
 */

/** Up to `digits` significant figures, without trailing zeros. */
export function trim(v: number, digits = 3): string {
  if (v === 0) return "0";
  const s = Number(v.toPrecision(digits));
  return s.toLocaleString("en-GB", { maximumFractionDigits: 6 });
}

/** A duration given in milliseconds. */
export function fmtMs(ms: number): string {
  if (ms === 0) return "0 s";
  if (Math.abs(ms) >= 60_000) {
    const m = Math.floor(ms / 60_000);
    const s = Math.round((ms - m * 60_000) / 1000);
    return s === 60 ? `${m + 1} min 0 s` : `${m} min ${s} s`;
  }
  if (Math.abs(ms) >= 1000) return `${trim(ms / 1000)} s`;
  return `${trim(ms)} ms`;
}

/** US dollars: cents and above to the cent, smaller amounts to three significant figures. */
export function fmtUsd(usd: number): string {
  if (usd === 0) return "$0";
  if (Math.abs(usd) >= 0.1) return `$${usd.toFixed(2)}`;
  return `$${trim(usd, 3)}`;
}

/** A token count, grouped (12,345 tokens). */
export function fmtTokens(n: number): string {
  return `${Math.round(n).toLocaleString("en-GB")} tokens`;
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-GB");
}

export function pct(f: number, digits = 0): string {
  return `${(f * 100).toFixed(digits)}%`;
}

/** Shorten a string for a caption, on a word boundary where possible. */
export function clip(s: string, n = 48): string {
  const one = s.replace(/\s+/g, " ").trim();
  if (one.length <= n) return one;
  const cut = one.slice(0, n - 1);
  const sp = cut.lastIndexOf(" ");
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut) + "…";
}

/** A signed percentage, e.g. "+3.4%". */
export function signedPct(f: number, digits = 1): string {
  const v = (f * 100).toFixed(digits);
  return f >= 0 ? `+${v}%` : `${v}%`;
}

/** A power of two for an error bound: 2^-13. */
export function pow2(err: number, digits = 2): string {
  return `2^${Number(Math.log2(err).toFixed(digits))}`;
}

/** Name a design point compactly: "pipelined_m W=26 N=22 m=7". */
export function designName(
  family: string,
  p: Record<string, number | string>,
): string {
  const parts = [`W=${p.data_width}`, `N=${p.n_iter}`];
  if (p.k !== undefined) parts.push(`k=${p.k}`);
  if (p.m !== undefined) parts.push(`m=${p.m}`);
  return `${family} ${parts.join(" ")}`;
}
