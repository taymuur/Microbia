import { useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Microbe } from '../data/microbes';
import { usePassport } from '../hooks/usePassport';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MicrobeCritter } from './MicrobeCritter';
import { hue, hueVars, hueWash } from '../lib/glow';

const ZONE_LABEL: Record<Microbe['zone'], string> = {
  soil: 'Soil',
  gut: 'Gut',
  waterways: 'Waterways',
  cafe: 'Café',
};

/** Full "Meet the microbe" card, opened from a critter in a habitat. */
export function SpeciesCard({ microbe, onClose }: { microbe: Microbe; onClose: () => void }) {
  const { has, collect } = usePassport();
  const reduced = useReducedMotion();
  const titleId = useId();
  const collected = has(microbe.id);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
        onClick={onClose}
        style={{ background: 'var(--scrim)' }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: reduced ? 0 : 0.32, ease: [0.34, 1.56, 0.64, 1] }}
          style={hueVars(microbe.glow)}
          className="relative w-full max-w-md overflow-hidden rounded-xl border-2 bg-surface shadow-card"
        >
          <div className="absolute inset-x-0 top-0 h-3" style={{ background: hue(microbe.glow) }} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-5 grid h-9 w-9 place-items-center rounded-pill bg-paper-2 text-ink-600 hover:text-ink-900"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 pt-8">
            <div
              className="mx-auto grid h-32 w-32 place-items-center rounded-full"
              style={{ background: hueWash(microbe.glow, 30), color: hue(microbe.glow) }}
            >
              <MicrobeCritter group={microbe.group} className="h-24 w-24" idle="bob" />
            </div>

            <p className="mt-4 text-center font-mono text-lg text-ink-600">Meet the microbe</p>
            <h3 id={titleId} className="text-center font-display text-3xl font-bold text-ink-900">
              {microbe.name}
            </h3>
            {microbe.meaning && (
              <p className="mt-1 text-center font-mono text-lg text-ink-600">{microbe.meaning}</p>
            )}

            <div className="mt-3 flex justify-center">
              <span
                className="rounded-pill px-3 py-1 font-display text-sm font-semibold text-white"
                style={{ background: hue(microbe.glow) }}
              >
                {microbe.group} · {ZONE_LABEL[microbe.zone]}
              </span>
            </div>

            <p className="mt-4 text-ink-900">{microbe.blurb}</p>

            <button
              type="button"
              onClick={() => collect(microbe.id)}
              disabled={collected}
              className="mt-6 w-full rounded-pill px-5 py-3 font-display text-lg font-bold transition duration-200 ease-pop enabled:hover:scale-[1.02] enabled:active:scale-95"
              style={
                collected
                  ? { background: 'var(--paper-2)', color: 'var(--ink-600)' }
                  : { background: hue(microbe.glow), color: '#fff' }
              }
            >
              {collected ? '✓ Collected!' : 'Collect this microbe'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
