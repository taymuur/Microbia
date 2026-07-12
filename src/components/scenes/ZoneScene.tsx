import { GutCrossSection } from './GutCrossSection';

// Full-bleed animated backdrops — the inside of each habitat. Decorative
// (aria-hidden); all motion is motion-safe so reduced-motion stays calm.
export function ZoneScene({ zone }: { zone: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {zone === 'soil' && <SoilScene />}
      {zone === 'cafe' && <CafeScene />}
      {zone === 'gut' && <GutScene />}
      {zone === 'waterways' && <WaterScene />}
    </div>
  );
}

function SoilScene() {
  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 600">
      {/* sky-to-earth */}
      <rect width="400" height="600" fill="color-mix(in srgb, var(--c-lime) 10%, var(--color-bg))" />
      <path d="M0 150 H400 V600 H0 Z" fill="color-mix(in srgb, var(--c-amber) 22%, var(--color-bg))" />
      <path d="M0 150 Q200 120 400 150 V180 Q200 150 0 180 Z" fill="color-mix(in srgb, var(--c-lime) 40%, var(--color-bg))" />
      {/* roots */}
      <g stroke="color-mix(in srgb, var(--c-amber) 55%, #6b3f16)" fill="none" strokeWidth="5" strokeLinecap="round" className="motion-safe:[animation:sway_9s_ease-in-out_infinite]" style={{ transformOrigin: '120px 150px' }}>
        <path d="M120 150 C120 240 90 300 108 420 C118 480 96 540 110 600" />
        <path d="M108 420 C150 440 168 500 156 560" />
        <path d="M300 150 C300 230 330 300 314 420 C304 500 326 560 310 600" />
      </g>
      {/* glowing nodules */}
      <g>
        {[[108, 420], [156, 560], [314, 420], [300, 300]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" fill="var(--c-teal)" className="motion-safe:[animation:bob_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.5}s`, transformOrigin: `${x}px ${y}px` }} />
        ))}
      </g>
    </svg>
  );
}

function CafeScene() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--c-amber) 16%, var(--color-bg))' }} />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" viewBox="0 0 400 600">
        {/* shelves */}
        <g stroke="color-mix(in srgb, var(--c-amber) 60%, #6b3f16)" strokeWidth="6">
          <line x1="0" y1="180" x2="400" y2="180" /><line x1="0" y1="320" x2="400" y2="320" />
        </g>
        {/* jars on shelves */}
        <g fill="color-mix(in srgb, var(--c-amber) 45%, var(--color-bg))" stroke="color-mix(in srgb, var(--c-amber) 60%, #6b3f16)" strokeWidth="3">
          {[40, 110, 250, 320].map((x, i) => (
            <rect key={x} x={x} y={130 - (i % 2) * 8} width="44" height={48 + (i % 2) * 8} rx="8" />
          ))}
          {[70, 300].map((x) => <rect key={x} x={x} y="270" width="44" height="48" rx="8" />)}
        </g>
        {/* cup + steam */}
        <path d="M170 540 h60 v26 a30 30 0 0 1 -60 0 Z" fill="color-mix(in srgb, var(--c-amber) 40%, var(--color-bg))" stroke="color-mix(in srgb, var(--c-amber) 60%, #6b3f16)" strokeWidth="3" />
        <g stroke="var(--c-teal)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6">
          {[185, 200, 215].map((x, i) => (
            <path key={x} d={`M${x} 520 q8 -14 0 -28 q-8 -14 0 -28`} className="motion-safe:[animation:rise_3.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.6}s` }} />
          ))}
        </g>
      </svg>
    </div>
  );
}

function GutScene() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--c-magenta) 14%, var(--color-bg))' }} />
      {/* tunnel walls */}
      <div className="absolute inset-x-0 top-0 h-40" style={{ background: 'radial-gradient(90% 100% at 50% 0, color-mix(in srgb, var(--c-magenta) 40%, transparent), transparent 70%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'radial-gradient(90% 100% at 50% 100%, color-mix(in srgb, var(--c-magenta) 40%, transparent), transparent 70%)' }} />
      <div className="absolute -right-24 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 opacity-60 motion-safe:[animation:spin_120s_linear_infinite] sm:-right-10">
        <GutCrossSection className="h-full w-full" hue="var(--c-magenta)" />
      </div>
    </>
  );
}

function WaterScene() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--c-cyan) 14%, var(--color-bg)), color-mix(in srgb, var(--c-cyan) 30%, var(--color-bg)))' }} />
      {/* sun rays */}
      <div className="absolute inset-x-0 top-0 h-64 opacity-40" style={{ background: 'conic-gradient(from 200deg at 50% -10%, transparent, color-mix(in srgb, var(--c-cyan) 35%, transparent), transparent 40%)' }} />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" viewBox="0 0 400 600">
        {/* bubbles */}
        <g fill="var(--c-cyan)">
          {[[60, 560], [130, 520], [210, 580], [280, 540], [340, 560], [100, 480], [300, 470]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4 + (i % 3) * 2} opacity="0.6" className="motion-safe:[animation:rise_6s_linear_infinite]" style={{ animationDelay: `${i * 0.8}s`, transformOrigin: `${x}px ${y}px` }} />
          ))}
        </g>
        {/* waves */}
        <g fill="none" stroke="var(--c-cyan)" strokeWidth="3" opacity="0.4">
          <path d="M0 590 C80 572 130 606 210 588 C300 568 330 604 400 588" />
        </g>
      </svg>
    </div>
  );
}
