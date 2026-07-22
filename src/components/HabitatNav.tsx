import { ZONES } from '../data/zones';
import { hue } from '../lib/glow';

// Bottom navigator: travel prev/next, or jump straight to any habitat.
// Total stops = habitats + the zookeepers room (last).
export function HabitatNav({
  index,
  onGo,
}: {
  index: number;
  onGo: (i: number) => void;
}) {
  const total = ZONES.length + 1; // + zookeepers
  const stops = [...ZONES.map((z) => ({ label: z.short, accent: z.accent })), { label: 'Keepers', accent: 'violet' as const }];

  return (
    <nav
      aria-label="Habitats"
      className="pointer-events-auto flex items-center gap-2 rounded-pill border border-[var(--color-border)] bg-surface px-2 py-2 shadow-card"
    >
      <NavArrow dir="prev" disabled={index === 0} onClick={() => onGo(index - 1)} />
      <ul className="flex items-center gap-1">
        {stops.map((s, i) => {
          const active = i === index;
          return (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => onGo(i)}
                aria-label={`Go to ${s.label}`}
                aria-current={active ? 'true' : undefined}
                className="grid place-items-center rounded-pill px-2 py-1 transition"
                style={active ? { background: hue(s.accent), color: '#fff' } : undefined}
              >
                <span className={`font-display text-sm font-semibold ${active ? '' : 'text-ink-600'}`}>
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <NavArrow dir="next" disabled={index === total - 1} onClick={() => onGo(index + 1)} />
    </nav>
  );
}

function NavArrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous habitat' : 'Next habitat'}
      className="grid h-9 w-9 place-items-center rounded-pill bg-paper-2 text-ink-900 transition enabled:hover:scale-110 disabled:opacity-30"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dir === 'prev' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
