import { usePassport } from '../hooks/usePassport';
import { TOTAL_MICROBES } from '../data/microbes';

/** "Microbes collected" counter. In-memory only. */
export function Passport() {
  const { count } = usePassport();
  return (
    <div
      className="flex items-center gap-2 rounded-pill border border-[var(--color-border)] bg-surface px-4 py-2 shadow-card"
      role="status"
      aria-live="polite"
      aria-label={`Microbes collected: ${count} of ${TOTAL_MICROBES}`}
    >
      <span aria-hidden className="text-lg">🔬</span>
      <span className="font-pixel text-pixel-label text-ink-900">
        {count}
        <span className="text-ink-400">/{TOTAL_MICROBES}</span>
      </span>
      <span className="hidden font-display text-sm font-semibold text-ink-600 sm:inline" aria-hidden>
        collected
      </span>
    </div>
  );
}
