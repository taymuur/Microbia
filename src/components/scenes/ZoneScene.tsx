import { GutCrossSection } from './GutCrossSection';

// Decorative, installation-inspired backdrops for each zone. Absolutely
// positioned behind content at low opacity (text keeps AA contrast), aria-hidden,
// and all motion is gated to motion-safe so reduced-motion stays still.
export function ZoneScene({ zone }: { zone: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {zone === 'soil' && <SoilScene />}
      {zone === 'gut' && <GutScene />}
      {zone === 'waterways' && <WaterScene />}
      {zone === 'cafe' && <CafeScene />}
    </div>
  );
}

/** Soil: descending roots with glowing bacterial nodules + hanging mycelium. */
function SoilScene() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.5]" preserveAspectRatio="xMidYMin slice" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="soilFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1206" stopOpacity="0.9" />
          <stop offset="1" stopColor="#05070f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#soilFade)" />
      {/* root system */}
      <g stroke="var(--biolum-lime)" strokeOpacity="0.35" fill="none" strokeWidth="2">
        <path d="M120 0 C 120 80, 90 120, 100 200 C 108 260, 80 300, 96 380" />
        <path d="M100 200 C 140 230, 150 280, 140 340" />
        <path d="M96 380 C 70 410, 60 460, 78 520" />
        <path d="M300 0 C 300 60, 330 110, 320 190 C 312 250, 340 300, 322 380 C 312 440, 330 500, 316 600" />
        <path d="M320 190 C 280 220, 268 270, 282 330" />
      </g>
      {/* glowing nodules (bacteria on roots) */}
      <g fill="var(--biolum-teal)">
        {[[100, 200], [140, 340], [96, 380], [322, 380], [282, 330], [316, 520]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 4 : 3} className="motion-safe:animate-pulse-glow" style={{ filter: 'drop-shadow(0 0 6px var(--biolum-teal))', animationDelay: `${i * 0.6}s` }} />
        ))}
      </g>
    </svg>
  );
}

/** Gut: the giant cross-section tunnel mouth glowing at the side, drifting microbes. */
function GutScene() {
  return (
    <>
      <div className="absolute -right-24 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 opacity-40 motion-safe:animate-[spin_120s_linear_infinite] sm:-right-16">
        <GutCrossSection className="h-full w-full" />
      </div>
      {/* soft fleshy top glow, like the lit tunnel ceiling */}
      <div
        className="absolute inset-x-0 top-0 h-48"
        style={{ background: 'radial-gradient(80% 100% at 50% 0%, rgba(255,79,216,0.18), transparent 70%)' }}
      />
    </>
  );
}

/** Waterways: layered waves, rising bubbles, caustic cyan shimmer. */
function WaterScene() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="xMidYMax slice" viewBox="0 0 400 600">
      <g fill="var(--biolum-cyan)">
        {[[60, 500], [120, 540], [200, 470], [260, 560], [330, 510], [90, 430], [300, 440]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fillOpacity="0.6" className="motion-safe:animate-drift" style={{ animationDelay: `${i * 0.9}s`, filter: 'drop-shadow(0 0 5px var(--biolum-cyan))' }} />
        ))}
      </g>
      <g fill="none" stroke="var(--biolum-cyan)" strokeOpacity="0.25" strokeWidth="2">
        <path d="M0 560 C 80 540, 120 580, 200 560 C 280 540, 320 580, 400 560" />
        <path d="M0 590 C 90 572, 130 606, 210 588 C 300 568, 330 604, 400 588" strokeOpacity="0.15" />
      </g>
    </svg>
  );
}

/** Café: warm amber ambience with a soft shelf of jars silhouette. */
function CafeScene() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(70% 50% at 80% 20%, rgba(255,179,71,0.12), transparent 65%)' }}
      />
      <svg className="absolute bottom-0 right-6 h-40 w-72 opacity-30" viewBox="0 0 288 160" fill="none" aria-hidden>
        <line x1="0" y1="150" x2="288" y2="150" stroke="var(--biolum-amber)" strokeOpacity="0.5" strokeWidth="2" />
        {/* fermenting jars */}
        {[20, 80, 140, 200, 250].map((x, i) => (
          <g key={x} stroke="var(--biolum-amber)" strokeOpacity="0.5" strokeWidth="2" fill="var(--biolum-amber)" fillOpacity="0.08">
            <rect x={x} y={110 - (i % 3) * 12} width="38" height={40 + (i % 3) * 12} rx="6" />
          </g>
        ))}
      </svg>
    </>
  );
}
