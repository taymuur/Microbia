import { usePassport } from '../hooks/usePassport';
import { TOTAL_MICROBES } from '../data/microbes';

/** "Microbes collected" counter, styled as an inventory slot. In-memory only. */
export function Passport() {
  const { count } = usePassport();
  return (
    <div
      className="mc-slot flex items-center gap-2 px-3 py-2"
      role="status"
      aria-live="polite"
      aria-label={`Microbes collected: ${count} of ${TOTAL_MICROBES}`}
    >
      <span aria-hidden className="text-xl">🔬</span>
      <span className="pixel-title text-[10px] text-ink-900">
        {count}
        <span className="text-ink-400">/{TOTAL_MICROBES}</span>
      </span>
    </div>
  );
}
