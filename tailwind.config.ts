import type { Config } from 'tailwindcss';

/** Minecraft-edition tokens. Mirrors src/index.css. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: { 0: 'var(--paper-0)', 1: 'var(--paper-1)', 2: 'var(--paper-2)' },
        ink: { 900: 'var(--ink-900)', 600: 'var(--ink-600)', 400: 'var(--ink-400)' },
        c: {
          teal: 'var(--c-teal)',
          lime: 'var(--c-lime)',
          amber: 'var(--c-amber)',
          magenta: 'var(--c-magenta)',
          cyan: 'var(--c-cyan)',
          violet: 'var(--c-violet)',
        },
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        display: ['"Press Start 2P"', 'monospace'],
        body: ['VT323', 'monospace'],
        mono: ['VT323', 'monospace'],
      },
      fontSize: {
        'pixel-label': ['0.625rem', { lineHeight: '1.4' }],
      },
      // Minecraft has sharp corners; keep radii tiny.
      borderRadius: { none: '0', sm: '0', md: '2px', lg: '2px', xl: '2px', pill: '3px', full: '3px' },
      maxWidth: { container: '72rem' },
      boxShadow: { card: 'var(--card-shadow)' },
      transitionTimingFunction: {
        pop: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
