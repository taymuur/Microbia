import { ZONES } from '../data/zones';
import { hue } from '../lib/glow';

// Bottom navigator, styled as a hotbar: travel prev/next or jump to any stage.
export function HabitatNav({ index, onGo }: { index: number; onGo: (i: number) => void }) {
  const total = ZONES.length + 1; // + scientists
  const stops = [...ZONES.map((z) => ({ label: z.short, accent: z.accent })), { label: 'Team', accent: 'violet' as const }];

  return (
    <nav aria-label="Stages" className="mc-panel pointer-events-auto flex items-center gap-1 p-1.5">
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
                className="mc-slot px-2.5 py-1.5"
                style={active ? { background: hue(s.accent) } : undefined}
              >
                <span className="pixel-title text-[8px]" style={{ color: active ? '#fff' : 'var(--ink-600)' }}>
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
      aria-label={dir === 'prev' ? 'Previous stage' : 'Next stage'}
      className="mc-slot grid h-9 w-9 place-items-center text-ink-900 disabled:opacity-30"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dir === 'prev' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
