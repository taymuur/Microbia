import { useSkin } from '../hooks/useSkin';

export function SkinToggle() {
  const { skin, toggle } = useSkin();
  const blocks = skin === 'blocks';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={blocks}
      aria-label={blocks ? 'Switch to the classic look' : 'Switch to the blocks look'}
      title={blocks ? 'Classic look' : 'Blocks look'}
      className="keep-round grid h-11 w-11 place-items-center rounded-pill border border-[var(--color-border)] bg-surface text-ink-900 shadow-card transition hover:scale-105 active:scale-95"
    >
      {blocks ? (
        // three soft circles = classic
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="8" cy="9" r="3.2" />
          <circle cx="16" cy="9" r="3.2" />
          <circle cx="12" cy="16" r="3.2" />
        </svg>
      ) : (
        // stacked cubes = blocks
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
          <rect x="4" y="10" width="7" height="7" />
          <rect x="13" y="10" width="7" height="7" />
          <rect x="8.5" y="3" width="7" height="7" />
        </svg>
      )}
    </button>
  );
}
