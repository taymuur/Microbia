import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ZoneConfig } from '../data/zones';
import { microbesByZone, type Microbe, type ZoneId } from '../data/microbes';
import { usePassport } from '../hooks/usePassport';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSound } from '../hooks/useSound';
import { MicrobeCritter } from './MicrobeCritter';
import { SpeciesCard } from './SpeciesCard';
import { hueInk, hueVars } from '../lib/glow';

// Kept toward the edges so the 3D story stays visible in the middle.
const SPOTS = [
  { top: '3%', left: '4%' },
  { top: '7%', left: '70%' },
  { top: '62%', left: '1%' },
  { top: '66%', left: '73%' },
];
const IDLES = ['bob', 'swim', 'wiggle', 'bob'] as const;

/** Warm yellow bubble the microbes sit in, with a glassy highlight. */
const BUBBLE =
  'radial-gradient(circle at 32% 28%, #fff6cf 0%, #ffe07a 38%, #f5bd2e 72%, #e0a012 100%)';

export function HabitatRoom({ zone }: { zone: ZoneConfig }) {
  const critters = zone.hasSpecies ? microbesByZone(zone.id as ZoneId) : [];
  const [open, setOpen] = useState<Microbe | null>(null);
  const { has } = usePassport();
  const { blip } = useSound();
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [zone.id]);

  const collectedHere = critters.filter((m) => has(m.id)).length;

  return (
    <section aria-labelledby={`${zone.id}-title`} className="relative min-h-[100dvh] w-full" style={hueVars(zone.accent)}>
      <div className="mx-auto grid min-h-[100dvh] max-w-container gap-6 px-[max(20px,5vw)] pb-28 pt-24 lg:grid-cols-[minmax(0,27rem)_1fr] lg:items-center lg:gap-10">
        {/* Info panel. Kept near-opaque so copy stays readable over every scene. */}
        <div className="rounded-xl border-2 border-[var(--color-border)] bg-surface p-6 shadow-card">
          <p className="font-display text-sm font-bold uppercase tracking-wide" style={{ color: hueInk(zone.accent) }}>
            {zone.eyebrow}
          </p>
          <h2 id={`${zone.id}-title`} ref={headingRef} tabIndex={-1} className="mt-2 font-display text-3xl font-bold text-ink-900 outline-none sm:text-4xl">
            {zone.title}
          </h2>
          <p className="mt-3 text-lg text-ink-600">{zone.lede}</p>
          {zone.body.map((p, i) => (
            <p key={i} className="mt-3 text-ink-900">
              {p}
            </p>
          ))}

          {zone.research && (
            <details className="group mt-4 rounded-lg border border-[var(--color-border)] bg-paper-2 p-3">
              <summary className="cursor-pointer list-none font-display text-sm font-bold" style={{ color: hueInk(zone.accent) }}>
                <span className="group-open:hidden">▶ Show the research</span>
                <span className="hidden group-open:inline">▼ Research at Norwich Research Park</span>
              </summary>
              <p className="mt-2 text-sm text-ink-900">{zone.research}</p>
            </details>
          )}

          {zone.id === 'cafe' && (
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="mt-4 inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display font-bold text-white shadow-card"
              style={{ background: hueInk('amber') }}
            >
              Activity book (soon)
            </button>
          )}

          {zone.hasSpecies && (
            <p className="mt-5 flex items-center gap-2 font-display text-sm font-semibold text-ink-600">
              <span aria-hidden>👉</span> Tap the microbes to meet them
              <span className="keep-round ml-auto rounded-pill px-2.5 py-0.5 font-bold text-white" style={{ background: hueInk(zone.accent) }}>
                {collectedHere}/{critters.length}
              </span>
            </p>
          )}
        </div>

        {/* Play area: the microbes living in this stage. */}
        <div className="relative min-h-[56vh] w-full lg:min-h-[68vh]" role="group" aria-label={zone.title}>
          {critters.map((m, i) => {
            const spot = critters.length === 1 ? SPOTS[0] : SPOTS[i % SPOTS.length];
            const collected = has(m.id);
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => {
                  blip(m.id);
                  setOpen(m);
                }}
                aria-label={`Meet ${m.name}, a ${m.group.toLowerCase()}${collected ? ' (collected)' : ''}`}
                className="absolute flex w-28 flex-col items-center gap-2 p-1 sm:w-32"
                style={{ top: spot.top, left: spot.left }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reduced ? 0 : 0.15 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={reduced ? undefined : { scale: 1.08 }}
                whileTap={reduced ? undefined : { scale: 0.94 }}
              >
                <span
                  className="keep-round grid h-20 w-20 place-items-center rounded-full shadow-card ring-2 ring-white/70 sm:h-24 sm:w-24"
                  style={{ background: BUBBLE }}
                >
                  <MicrobeCritter species={m.id} color={m.color} idle={IDLES[i % IDLES.length]} className="h-14 w-14 sm:h-16 sm:w-16" />
                </span>
                <span className="rounded-pill border border-[var(--color-border)] bg-surface px-3 py-1 font-display text-sm font-bold text-ink-900 shadow-card">
                  {collected && <span aria-hidden>✓ </span>}
                  {m.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {open && <SpeciesCard microbe={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
