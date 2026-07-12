import { usePassport } from '../hooks/usePassport';
import { TOTAL_MICROBES } from '../data/microbes';

/** Fixed, subtle "microbes collected" counter. In-memory state only. */
export function Passport() {
  const { count } = usePassport();
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-pill border border-white/10 bg-[var(--glass-bg)] px-4 py-2 backdrop-blur"
      role="status"
      aria-live="polite"
      aria-label={`Microbes collected: ${count} of ${TOTAL_MICROBES}`}
    >
      <span
        className="h-2.5 w-2.5 rounded-full bg-biolum-teal"
        style={{ boxShadow: '0 0 10px var(--biolum-teal)' }}
        aria-hidden
      />
      <span className="font-pixel text-pixel-label text-ink-100">
        {count}<span className="text-ink-500">/{TOTAL_MICROBES}</span>
      </span>
      <span className="font-mono text-base text-ink-500" aria-hidden>
        collected
      </span>
    </div>
  );
}
