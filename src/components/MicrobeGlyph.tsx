import type { MicrobeGroup } from '../data/microbes';

// One distinct visual language per microbe group (per CLAUDE.md):
// Bacteria = rod/sphere/spiral · Virus = geometric phage · Fungi = hyphae/spores
// Algae/protist = flowing single-cell blob. Decorative — parent supplies the label.
export function MicrobeGlyph({
  group,
  className,
}: {
  group: MicrobeGroup;
  className?: string;
}) {
  const common = {
    className,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  switch (group) {
    case 'Bacteria':
      // rod + spiral flagellum
      return (
        <svg {...common}>
          <rect x="14" y="22" width="30" height="20" rx="10" />
          <circle cx="23" cy="32" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="34" cy="30" r="2" fill="currentColor" stroke="none" />
          <path d="M44 32c4 0 4-6 8-6s4 6 8 6" />
        </svg>
      );
    case 'Virus':
      // bacteriophage "lunar lander"
      return (
        <svg {...common}>
          <polygon points="32,10 42,17 42,29 32,36 22,29 22,17" />
          <rect x="29" y="36" width="6" height="12" />
          <path d="M26 48l-6 8M32 48v10M38 48l6 8" />
        </svg>
      );
    case 'Fungi':
      // branching hyphae + spores
      return (
        <svg {...common}>
          <path d="M32 56V30M32 40l-10-8M32 44l10-9M32 34l-7-9M32 34l7-8" />
          <circle cx="18" cy="30" r="3" />
          <circle cx="46" cy="34" r="3" />
          <circle cx="24" cy="22" r="2.5" />
          <circle cx="40" cy="24" r="2.5" />
        </svg>
      );
    case 'Algae / protist':
      // flowing single cell with flagellum
      return (
        <svg {...common}>
          <path d="M22 40c-6-10 2-22 12-22s14 10 10 20-24 14-22 2z" />
          <circle cx="28" cy="30" r="3" fill="currentColor" stroke="none" />
          <path d="M44 22c6-4 10-2 14-8" />
        </svg>
      );
  }
}
