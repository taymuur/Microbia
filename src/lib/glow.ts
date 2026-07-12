// Maps a glow key to its CSS colour variable and a translucent glow shadow.
export type GlowKey = 'teal' | 'cyan' | 'magenta' | 'violet' | 'amber' | 'lime';

const RGB: Record<GlowKey, string> = {
  teal: '47, 230, 168',
  cyan: '56, 225, 255',
  magenta: '255, 79, 216',
  violet: '155, 123, 255',
  amber: '255, 179, 71',
  lime: '139, 224, 74',
};

export const glowColor = (k: GlowKey) => `var(--biolum-${k})`;
export const glowHue = (k: GlowKey, alpha = 0.45) => `rgba(${RGB[k]}, ${alpha})`;

/** Inline style setting the --glow-hue custom prop (used by shadow utilities). */
export const glowVars = (k: GlowKey, alpha = 0.45) =>
  ({ '--glow-hue': glowHue(k, alpha) }) as React.CSSProperties;
