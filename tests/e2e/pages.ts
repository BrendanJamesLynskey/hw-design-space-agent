/** The pages and animations every e2e spec walks. */
export const PAGES = ["/", "/why", "/case-study", "/about"] as const;

export const ANIMATIONS = [
  ["/", "hero-widget"],
  ["/why", "climb-widget"],
  ["/case-study", "cordic-widget"],
  ["/case-study", "datapath-widget"],
] as const;

/** Widgets load after the page: allow for a slow runner. */
export const WIDGET_TIMEOUT = 30_000;
