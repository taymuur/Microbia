import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ZoneConfig } from '../data/zones';
import { microbesByZone, type Microbe, type ZoneId } from '../data/microbes';
import { usePassport } from '../hooks/usePassport';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MicrobeCritter } from './MicrobeCritter';
import { SpeciesCard } from './SpeciesCard';
import { hue, hueVars, hueWash } from '../lib/glow';

// The 3D scene (three.js) is heavy — load it lazily so the intro stays light.
const Habitat3D = lazy(() => import('./Habitat3D'));

// Scatter spots within the play area (percentages, responsive).
const SPOTS = [
  { top: '16%', left: '18%' },
  { top: '26%', left: '64%' },
  { top: '60%', left: '32%' },
  { top: '64%', left: '72%' },
];
const IDLES = ['bob', 'swim', 'wiggle', 'bob'] as const;

export function HabitatRoom({ zone }: { zone: ZoneConfig }) {
  const critters = microbesByZone(zone.id as ZoneId);
  const [open, setOpen] = useState<Microbe | null>(null);
  const { has } = usePassport();
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the habitat heading when the room changes (screen readers).
  useEffect(() => {
    headingRef.current?.focus();
  }, [zone.id]);

  const collectedHere = critters.filter((m) => has(m.id)).length;

  return (
    <section
      aria-labelledby={`${zone.id}-title`}
      className="relative min-h-[100dvh] w-full overflow-hidden"
      style={hueVars(zone.accent)}
    >
      <Suspense fallback={<div className="absolute inset-0" style={{ background: hueWash(zone.accent, 16) }} />}>
        <Habitat3D zone={String(zone.id)} />
      </Suspense>

      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-container gap-6 px-[max(20px,5vw)] pb-28 pt-24 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-center lg:gap-10">
        {/* Info panel */}
        <div className="rounded-xl border border-[var(--color-border)] bg-surface/85 p-6 shadow-card backdrop-blur-md">
          <p className="font-display text-sm font-bold uppercase tracking-wide" style={{ color: hue(zone.accent) }}>
            {zone.eyebrow}
          </p>
          <h2
            id={`${zone.id}-title`}
            ref={headingRef}
            tabIndex={-1}
            className="mt-1 font-display text-3xl font-bold text-ink-900 outline-none sm:text-4xl"
          >
            {zone.title}
          </h2>
          <p className="mt-3 text-lg text-ink-600">{zone.lede}</p>
          {zone.body.map((p, i) => (
            <p key={i} className="mt-3 text-ink-900">
              {p}
            </p>
          ))}

          {zone.research && (
            <details className="group mt-4 rounded-lg border border-[var(--color-border)] p-3">
              <summary
                className="cursor-pointer list-none font-display text-sm font-bold"
                style={{ color: hue(zone.accent) }}
              >
                <span className="group-open:hidden">▸ Show the real research →</span>
                <span className="hidden group-open:inline">▾ Research at Norwich Research Park</span>
              </summary>
              <p className="mt-2 text-sm text-ink-600">{zone.research}</p>
            </details>
          )}

          {zone.id === 'cafe' && (
            <a
              href="#"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              className="mt-4 inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-display font-bold text-white"
              style={{ background: hue('amber') }}
            >
              Download the activity book
              <span className="font-mono text-base opacity-80">(soon)</span>
            </a>
          )}

          <p className="mt-5 flex items-center gap-2 font-display text-sm font-semibold text-ink-600">
            <span aria-hidden>👉</span> Tap the microbes to meet and collect them
            <span className="ml-auto rounded-pill px-2.5 py-0.5 text-white" style={{ background: hue(zone.accent) }}>
              {collectedHere}/{critters.length}
            </span>
          </p>
        </div>

        {/* Play area — the critters live here */}
        <div className="relative min-h-[58vh] w-full lg:min-h-[70vh]" role="group" aria-label={`Microbes in ${zone.title}`}>
          {critters.map((m, i) => {
            const spot = critters.length === 1 ? { top: '38%', left: '40%' } : SPOTS[i % SPOTS.length];
            const collected = has(m.id);
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => setOpen(m)}
                aria-label={`Meet ${m.name}, a ${m.group.toLowerCase()}${collected ? ' (collected)' : ''}`}
                className="absolute flex w-28 flex-col items-center gap-1 rounded-xl p-2 sm:w-32"
                style={{ top: spot.top, left: spot.left }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reduced ? 0 : 0.15 + i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={reduced ? undefined : { scale: 1.08 }}
                whileTap={reduced ? undefined : { scale: 0.94 }}
              >
                <span
                  className="grid h-20 w-20 place-items-center rounded-full sm:h-24 sm:w-24"
                  style={{ background: hueWash(m.glow, 26), color: hue(m.glow), animationDelay: `${i * 0.4}s` }}
                >
                  <MicrobeCritter species={m.id} color={m.color} idle={IDLES[i % IDLES.length]} className="h-16 w-16 sm:h-20 sm:w-20" />
                </span>
                <span className="rounded-pill bg-surface px-3 py-1 font-display text-sm font-bold text-ink-900 shadow-card">
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
