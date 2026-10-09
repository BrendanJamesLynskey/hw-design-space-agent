/** The pages and animations every e2e spec walks. */
export const PAGES = [
  "/",
  "/why",
  "/how-it-works",
  "/case-study",
  "/results",
  "/roadmap",
  "/record",
  "/about",
] as const;

export const ANIMATIONS = [
  ["/", "hero-widget"],
  ["/why", "climb-widget"],
  ["/case-study", "cordic-widget"],
  ["/case-study", "datapath-widget"],
  ["/how-it-works", "trace-widget"],
  ["/results", "replay-widget"],
  ["/results", "race-widget"],
  ["/how-it-works", "descent-widget"],
  ["/case-study", "scatter-widget"],
  ["/case-study", "hp-widget"],
  ["/results", "shift-widget"],
] as const;

/** Widgets load after the page: allow for a slow runner. */
export const WIDGET_TIMEOUT = 30_000;
