import { useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Microbe, ZoneId } from '../data/microbes';
import { usePassport } from '../hooks/usePassport';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSound } from '../hooks/useSound';
import { MicrobeCritter } from './MicrobeCritter';
import { hue, hueVars, hueWash } from '../lib/glow';

const ZONE_LABEL: Record<ZoneId, string> = {
  soil: 'Soil',
  cafe: 'Café',
  mouth: 'Mouth',
  gut: 'Gut',
  poo: 'Poo',
  waterways: 'Waterways',
};

/** Full "Meet the microbe" card, opened from a critter in a stage. */
export function SpeciesCard({ microbe, onClose }: { microbe: Microbe; onClose: () => void }) {
  const { has, collect } = usePassport();
  const { chime } = useSound();
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
          transition={{ duration: reduced ? 0 : 0.28, ease: [0.34, 1.56, 0.64, 1] }}
          style={hueVars(microbe.glow)}
          className="mc-panel relative w-full max-w-md p-6"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mc-slot absolute right-4 top-4 grid h-8 w-8 place-items-center text-ink-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="mc-slot mx-auto grid h-32 w-32 place-items-center" style={{ background: hueWash(microbe.glow, 22) }}>
            <MicrobeCritter species={microbe.id} color={microbe.color} className="h-24 w-24" idle="bob" />
          </div>

          <p className="mt-4 text-center text-xl text-ink-600">Meet the microbe</p>
          <h3 id={titleId} className="pixel-title mt-1 text-center text-lg text-ink-900">
            {microbe.name}
          </h3>
          {microbe.meaning && <p className="mt-2 text-center text-lg text-ink-600">{microbe.meaning}</p>}

          <div className="mt-3 flex justify-center">
            <span className="mc-slot px-3 py-1 pixel-title text-[8px] text-white" style={{ background: hue(microbe.glow) }}>
              {microbe.group} · {ZONE_LABEL[microbe.zone]}
            </span>
          </div>

          <p className="mt-4 text-xl leading-snug text-ink-900">{microbe.blurb}</p>

          <button
            type="button"
            onClick={() => {
              collect(microbe.id);
              chime();
            }}
            disabled={collected}
            className="mc-btn mt-6 w-full px-5 py-3 text-[10px]"
            style={collected ? { background: 'var(--mc-slot)' } : { background: hue(microbe.glow) }}
          >
            {collected ? '✓ Collected' : 'Collect'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
