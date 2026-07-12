import type { Config } from 'tailwindcss';

/**
 * Tokens mirror src/design-system.md (the single source of truth).
 * Colours reference CSS custom properties defined in src/index.css so the
 * three-layer token system (primitive -> semantic -> component) stays intact.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          900: 'var(--abyss-900)',
          800: 'var(--abyss-800)',
          700: 'var(--abyss-700)',
          600: 'var(--abyss-600)',
          500: 'var(--abyss-500)',
        },
        biolum: {
          teal: 'var(--biolum-teal)',
          cyan: 'var(--biolum-cyan)',
          magenta: 'var(--biolum-magenta)',
          violet: 'var(--biolum-violet)',
          amber: 'var(--biolum-amber)',
          lime: 'var(--biolum-lime)',
        },
        ink: {
          100: 'var(--ink-100)',
          300: 'var(--ink-300)',
          500: 'var(--ink-500)',
          700: 'var(--ink-700)',
        },
        // semantic
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        display: ['"Exo 2"', 'system-ui', 'sans-serif'],
        body: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        mono: ['VT323', 'monospace'],
      },
      fontSize: {
        'pixel-label': ['0.625rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '22px',
        pill: '999px',
      },
      maxWidth: {
        container: '72rem',
      },
      boxShadow: {
        card: '0 8px 32px rgba(0,0,0,0.45)',
        'glow-sm': '0 0 12px var(--glow-hue)',
        'glow-md': '0 0 24px var(--glow-hue)',
        'glow-lg': '0 0 48px var(--glow-hue)',
      },
      transitionTimingFunction: {
        biolum: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'biolum-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-24px) translateX(12px)' },
        },
        pulse: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        'pulse-glow': 'pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
