import type { MicrobeGroup } from '../data/microbes';

// Species-accurate microbe artwork, matched to the "Meet the Microbe" fact sheets:
// each microbe keeps its real structure (a twisted chain, a branched Y, a budding
// yeast, an icosahedral phage, the right flagella…) with a light friendly face for
// the kids' zoo. Body colour comes from `color`; extra features are drawn in.
type Species =
  | 'streptomyces' | 'pseudomonas' | 'rhizobia' | 'saccharomyces'
  | 'bifidobacterium' | 'ecoli' | 'bacteriophage' | 'euglena'
  | 'prymnesium' | 'shewanella';

// Fallback: a representative species per group (used by the intro floaters).
const GROUP_DEFAULT: Record<MicrobeGroup, Species> = {
  Bacteria: 'streptomyces',
  Virus: 'bacteriophage',
  Fungi: 'saccharomyces',
  'Algae / protist': 'euglena',
};

export function MicrobeCritter({
  species,
  group,
  color,
  className,
  idle = 'bob',
}: {
  species?: string;
  group?: MicrobeGroup;
  color?: string;
  className?: string;
  idle?: 'bob' | 'swim' | 'wiggle';
}) {
  const key = (species as Species) ?? (group ? GROUP_DEFAULT[group] : 'streptomyces');
  const Shape = SHAPES[key] ?? SHAPES.streptomyces;
  return (
    <span className={`inline-block ${className ?? ''}`} aria-hidden style={color ? { color } : undefined}>
      <span className={`block h-full w-full anim-${idle}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <Shape />
        </svg>
      </span>
    </span>
  );
}

const OUT = { stroke: 'rgba(0,0,0,0.30)', strokeWidth: 2.5 };
const WHITE = 'rgba(255,255,255,0.55)';

function Face({ cx, cy, s = 8, smile = true }: { cx: number; cy: number; s?: number; smile?: boolean }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className="anim-blink" style={{ transformOrigin: 'center' }}>
        <circle cx={-s} cy={0} r={s * 0.62} fill="#fff" />
        <circle cx={s} cy={0} r={s * 0.62} fill="#fff" />
        <circle cx={-s + 1} cy={1.4} r={s * 0.28} fill="#1a2338" />
        <circle cx={s + 1} cy={1.4} r={s * 0.28} fill="#1a2338" />
      </g>
      {smile && <path d={`M${-s * 0.7} ${s * 1.1} Q0 ${s * 1.9} ${s * 0.7} ${s * 1.1}`} fill="none" stroke="#1a2338" strokeWidth="2.2" strokeLinecap="round" />}
    </g>
  );
}

const flag = (d: string) => (
  <path d={d} fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
);

const SHAPES: Record<Species, () => JSX.Element> = {
  // Twisted chain of bead-like cells
  streptomyces: () => {
    const beads = [[28, 74], [39, 62], [50, 50], [61, 38], [72, 26]] as const;
    return (
      <g>
        {beads.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="11" fill="currentColor" {...OUT} />
        ))}
        {beads.map(([x, y], i) => <path key={`h${i}`} d={`M${x - 4} ${y - 5} q4 -3 8 0`} stroke={WHITE} strokeWidth="2.5" fill="none" strokeLinecap="round" />)}
        <Face cx={50} cy={50} s={6} />
      </g>
    );
  },

  // Rod with a tuft of polar flagella
  pseudomonas: () => (
    <g>
      {flag('M45 62 q-9 8 -5 16 q4 8 -3 14')}
      {flag('M50 63 q0 10 0 17 q0 9 0 14')}
      {flag('M55 62 q9 8 5 16 q-4 8 3 14')}
      <rect x="34" y="16" width="32" height="48" rx="16" fill="currentColor" {...OUT} />
      <ellipse cx="44" cy="30" rx="4" ry="9" fill={WHITE} />
      <g fill="rgba(0,0,0,0.18)">{[[44, 56], [52, 58], [58, 52]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" />)}</g>
      <Face cx={49} cy={38} s={7} />
    </g>
  ),

  // Rod with one or two polar flagella
  rhizobia: () => (
    <g>
      {flag('M46 66 q-8 8 -4 15 q3 7 -3 12')}
      {flag('M54 66 q8 7 4 14')}
      <rect x="35" y="18" width="30" height="48" rx="15" fill="currentColor" {...OUT} />
      <ellipse cx="45" cy="32" rx="4" ry="10" fill={WHITE} />
      <Face cx={50} cy={42} s={7} />
    </g>
  ),

  // Budding yeast: parent cell with buds
  saccharomyces: () => (
    <g>
      <circle cx="30" cy="30" r="9" fill="currentColor" {...OUT} />
      <circle cx="68" cy="38" r="13" fill="currentColor" {...OUT} />
      <circle cx="44" cy="58" r="24" fill="currentColor" {...OUT} />
      <g fill="rgba(255,255,255,0.5)">{[[36, 50], [50, 66], [54, 52], [66, 36]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" />)}</g>
      <ellipse cx="34" cy="48" rx="5" ry="9" fill={WHITE} />
      <Face cx={44} cy={60} s={8} />
    </g>
  ),

  // Branched Y / V shape
  bifidobacterium: () => (
    <g>
      <path d="M50 86 L50 52 M50 52 L30 24 M50 52 L72 26" fill="none" stroke="currentColor" strokeWidth="19" strokeLinecap="round" />
      <path d="M50 86 L50 52 M50 52 L30 24 M50 52 L72 26" fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="19" strokeLinecap="round" opacity="0.001" />
      <g fill="rgba(255,255,255,0.5)">{[[50, 74], [40, 40], [62, 38]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" />)}</g>
      <Face cx={50} cy={60} s={6} />
    </g>
  ),

  // Rod fringed with flagella all around (peritrichous)
  ecoli: () => (
    <g>
      <g>
        {['M28 40 q-10 -6 -16 -2', 'M26 52 q-12 0 -16 8', 'M30 62 q-8 8 -16 10', 'M72 40 q10 -6 16 -2', 'M74 52 q12 0 16 8', 'M70 62 q8 8 16 10', 'M50 66 q0 10 -6 16', 'M52 66 q4 10 10 14'].map((d, i) => <g key={i}>{flag(d)}</g>)}
      </g>
      <rect x="26" y="34" width="48" height="30" rx="15" fill="currentColor" {...OUT} />
      <ellipse cx="40" cy="45" rx="9" ry="4" fill={WHITE} />
      <Face cx={54} cy={50} s={7} />
    </g>
  ),

  // Icosahedral head + striped tail + spider legs
  bacteriophage: () => {
    const head = '31,21 50,10 69,21 69,43 50,54 31,43';
    return (
      <g>
        {/* legs */}
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M50 70 l-16 16 M50 70 l-7 20 M50 70 l7 20 M50 70 l16 16" />
        </g>
        {/* tail */}
        <rect x="45" y="52" width="10" height="18" fill="currentColor" {...OUT} />
        <g stroke="rgba(0,0,0,0.28)" strokeWidth="2"><line x1="45" y1="57" x2="55" y2="57" /><line x1="45" y1="62" x2="55" y2="62" /></g>
        {/* head */}
        <polygon points={head} fill="currentColor" {...OUT} strokeLinejoin="round" />
        <polygon points="31,21 50,10 50,32" fill="rgba(255,255,255,0.35)" />
        <polygon points="50,10 69,21 50,32" fill="rgba(255,255,255,0.18)" />
        <line x1="50" y1="10" x2="50" y2="54" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
        <line x1="31" y1="21" x2="69" y2="43" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        <Face cx={50} cy={30} s={5.5} smile={false} />
      </g>
    );
  },

  // Green spindle cell with a red eyespot + flagellum
  euglena: () => (
    <g>
      {flag('M50 14 q-8 -10 -3 -22')}
      <path d="M50 14 C 72 30, 70 66, 50 88 C 30 66, 28 30, 50 14 Z" fill="currentColor" {...OUT} strokeLinejoin="round" />
      <circle cx="43" cy="30" r="4.5" fill="#e2352f" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" />
      <g fill="rgba(255,255,255,0.45)">{[[55, 34], [58, 48], [54, 62], [46, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" />)}</g>
      <Face cx={51} cy={52} s={6} />
    </g>
  ),

  // Golden ovoid with two long flagella
  prymnesium: () => (
    <g>
      {flag('M47 32 q-12 -12 -8 -30')}
      {flag('M53 32 q12 -12 8 -30')}
      <line x1="50" y1="32" x2="50" y2="6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="50" cy="56" rx="20" ry="26" fill="currentColor" {...OUT} />
      <ellipse cx="42" cy="48" rx="5" ry="11" fill={WHITE} />
      <Face cx={50} cy={56} s={7} />
    </g>
  ),

  // Red rod with a single whip-like flagellum
  shewanella: () => (
    <g transform="rotate(-24 50 50)">
      {flag('M74 50 q11 -5 9 5 q-2 9 9 6 q6 -2 9 3')}
      <rect x="22" y="38" width="52" height="24" rx="12" fill="currentColor" {...OUT} />
      <g stroke={WHITE} strokeWidth="3" strokeLinecap="round"><line x1="34" y1="47" x2="46" y2="47" /><line x1="52" y1="47" x2="58" y2="47" /></g>
      <Face cx={44} cy={50} s={6.5} />
    </g>
  ),
};
