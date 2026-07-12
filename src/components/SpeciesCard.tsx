import { useState, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Microbe } from '../data/microbes';
import { usePassport } from '../hooks/usePassport';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MicrobeGlyph } from './MicrobeGlyph';
import { glowColor, glowVars } from '../lib/glow';

export function SpeciesCard({ microbe }: { microbe: Microbe }) {
  const [open, setOpen] = useState(false);
  const { has, collect } = usePassport();
  const reduced = useReducedMotion();
  const titleId = useId();
  const collected = has(microbe.id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-reveal
        style={glowVars(microbe.glow)}
        className="group relative flex w-full flex-col gap-3 rounded-lg border border-white/10 bg-[var(--glass-bg)] p-5 text-left backdrop-blur transition duration-[--dur-micro] ease-biolum hover:-translate-y-1 hover:border-transparent hover:shadow-glow-lg"
        aria-haspopup="dialog"
      >
        <div className="flex items-center justify-between">
          <span
            className="h-12 w-12 transition group-hover:scale-110"
            style={{ color: glowColor(microbe.glow) }}
          >
            <MicrobeGlyph group={microbe.group} className="h-12 w-12" />
          </span>
          {collected && (
            <span className="font-mono text-lg leading-none text-biolum-lime" aria-label="Collected">
              ✓ collected
            </span>
          )}
        </div>
        <div>
          <h4 className="font-display text-xl font-semibold text-ink-100">{microbe.name}</h4>
          <p className="font-mono text-lg leading-tight text-ink-500">
            {microbe.group} · {zoneLabel(microbe.zone)}
          </p>
        </div>
        <p className="text-sm text-ink-300">{microbe.tagline}</p>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={() => setOpen(false)}
            style={{ background: 'var(--scrim)' }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(e) => e.stopPropagation()}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={glowVars(microbe.glow, 0.35)}
              className="relative w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-surface p-6 shadow-glow-lg"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-2 text-ink-500 hover:text-ink-100"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              <span className="h-16 w-16" style={{ color: glowColor(microbe.glow) }}>
                <MicrobeGlyph group={microbe.group} className="h-16 w-16" />
              </span>

              <p className="mt-4 font-mono text-lg text-ink-500">Meet the microbe</p>
              <h3 id={titleId} className="font-display text-3xl font-bold text-ink-100 text-glow" style={glowVars(microbe.glow)}>
                {microbe.name}
              </h3>
              {microbe.meaning && (
                <p className="mt-1 font-mono text-lg italic text-ink-500">{microbe.meaning}</p>
              )}

              <div className="mt-3 inline-flex rounded-pill border border-white/10 px-3 py-1 font-mono text-base text-ink-300">
                {microbe.group} · {zoneLabel(microbe.zone)}
              </div>

              <p className="mt-4 leading-relaxed text-ink-100">{microbe.blurb}</p>

              <button
                type="button"
                onClick={() => collect(microbe.id)}
                disabled={collected}
                className="mt-6 w-full rounded-pill px-5 py-3 font-display font-semibold transition duration-[--dur-micro] ease-biolum disabled:opacity-60"
                style={
                  collected
                    ? { background: 'transparent', color: 'var(--biolum-lime)', border: '1px solid var(--biolum-lime)' }
                    : { background: 'var(--color-accent)', color: 'var(--color-on-accent)' }
                }
              >
                {collected ? '✓ In your passport' : 'Collect this microbe'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function zoneLabel(zone: Microbe['zone']): string {
  return { soil: 'Soil', gut: 'Gut', waterways: 'Waterways', cafe: 'Café' }[zone];
}
