import type { MicrobeGroup } from '../data/microbes';

// Friendly, animated microbe characters for a kids' science zoo. Each group
// keeps its own body language (rod / phage / mushroom / blob) but gets a face
// and a gentle idle animation. Body colour comes from `color` (a habitat hue).
export function MicrobeCritter({
  group,
  className,
  idle = 'bob',
}: {
  group: MicrobeGroup;
  className?: string;
  idle?: 'bob' | 'wiggle' | 'swim';
}) {
  const cls = `anim-${idle}`;
  return (
    <span className={`inline-block ${className ?? ''}`} aria-hidden>
      <span className={`block h-full w-full ${cls}`}>
        {group === 'Bacteria' && <Bacteria />}
        {group === 'Virus' && <Phage />}
        {group === 'Fungi' && <Fungi />}
        {group === 'Algae / protist' && <Alga />}
      </span>
    </span>
  );
}

const stroke = { stroke: 'rgba(0,0,0,0.28)', strokeWidth: 2.5 };

function Face({ cx = 0, cy = 0, spread = 9 }: { cx?: number; cy?: number; spread?: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className="motion-safe:[animation:blink_5s_ease-in-out_infinite]" style={{ transformOrigin: 'center' }}>
        <circle cx={-spread} cy={0} r="5.5" fill="#fff" />
        <circle cx={spread} cy={0} r="5.5" fill="#fff" />
        <circle cx={-spread + 1} cy={1.5} r="2.4" fill="#1a2338" />
        <circle cx={spread + 1} cy={1.5} r="2.4" fill="#1a2338" />
      </g>
      <path d={`M${-6} 9 Q0 15 6 9`} fill="none" stroke="#1a2338" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Bacteria() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      {/* wiggly flagellum */}
      <path d="M78 60 q10 4 8 14 q-2 8 8 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="anim-wiggle" style={{ transformOrigin: '78px 60px' }} />
      <rect x="16" y="30" width="66" height="42" rx="21" fill="currentColor" {...stroke} />
      {/* pili dots */}
      <g fill="#fff" opacity="0.5">
        <circle cx="34" cy="58" r="3" /><circle cx="52" cy="60" r="2.5" /><circle cx="66" cy="52" r="2.5" />
      </g>
      <Face cx={44} cy={48} />
    </svg>
  );
}

function Phage() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      {/* legs */}
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <path d="M40 74 l-12 16" /><path d="M50 78 l0 18" /><path d="M60 74 l12 16" />
      </g>
      <rect x="44" y="56" width="12" height="20" rx="3" fill="currentColor" {...stroke} />
      <polygon points="50,18 74,32 74,56 50,70 26,56 26,32" fill="currentColor" {...stroke} strokeLinejoin="round" />
      <Face cx={50} cy={42} />
    </svg>
  );
}

function Fungi() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <rect x="40" y="52" width="20" height="34" rx="9" fill="#f4e6cf" {...stroke} />
      <path d="M18 54 Q50 12 82 54 Z" fill="currentColor" {...stroke} strokeLinejoin="round" />
      <g fill="#fff" opacity="0.75">
        <circle cx="38" cy="42" r="4" /><circle cx="58" cy="38" r="5" /><circle cx="66" cy="50" r="3.5" />
      </g>
      <Face cx={50} cy={70} spread={7} />
    </svg>
  );
}

function Alga() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <path d="M70 24 q16 8 6 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="anim-wiggle" style={{ transformOrigin: '70px 24px' }} />
      <path d="M30 70 C 8 46 26 22 50 24 C 74 26 82 50 70 70 C 60 86 40 86 30 70 Z" fill="currentColor" {...stroke} strokeLinejoin="round" />
      <ellipse cx="42" cy="42" rx="5" ry="8" fill="#fff" opacity="0.4" />
      <Face cx={50} cy={54} />
    </svg>
  );
}
