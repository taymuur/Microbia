// Habitat hue helpers. Hues resolve to CSS vars that shift per theme,
// so the same key looks vivid on light and glowing on dark.
export type GlowKey = 'teal' | 'lime' | 'amber' | 'magenta' | 'cyan' | 'violet';

export const hue = (k: GlowKey) => `var(--c-${k})`;

/** A translucent version of a hue (for glows, tints, borders). */
export const hueSoft = (k: GlowKey, pct = 45) =>
  `color-mix(in srgb, var(--c-${k}) ${pct}%, transparent)`;

/** A pastel wash of a hue over the page background (adapts to theme). */
export const hueWash = (k: GlowKey, pct = 16) =>
  `color-mix(in srgb, var(--c-${k}) ${pct}%, var(--color-bg))`;

/** Inline style exposing the active hue as --hue / --hue-soft for CSS use. */
export const hueVars = (k: GlowKey) =>
  ({ '--hue': `var(--c-${k})`, '--hue-soft': hueSoft(k) }) as React.CSSProperties;
