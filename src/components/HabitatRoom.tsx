import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ZoneConfig } from '../data/zones';
import { microbesByZone, type Microbe, type ZoneId } from '../data/microbes';
import { usePassport } from '../hooks/usePassport';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSound } from '../hooks/useSound';
import { MicrobeCritter } from './MicrobeCritter';
import { GiantPoo } from './GiantPoo';
import { SpeciesCard } from './SpeciesCard';
import { hue, hueVars } from '../lib/glow';

const SPOTS = [
  { top: '14%', left: '16%' },
  { top: '24%', left: '62%' },
  { top: '58%', left: '30%' },
  { top: '62%', left: '70%' },
];
const IDLES = ['bob', 'swim', 'wiggle', 'bob'] as const;

export function HabitatRoom({ zone }: { zone: ZoneConfig }) {
  const critters = zone.hasSpecies ? microbesByZone(zone.id as ZoneId) : [];
  const [open, setOpen] = useState<Microbe | null>(null);
  const [pooTalk, setPooTalk] = useState(false);
  const { has } = usePassport();
  const { blip } = useSound();
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [zone.id]);

  const collectedHere = critters.filter((m) => has(m.id)).length;

  return (
    <section
      aria-labelledby={`${zone.id}-title`}
      className="relative min-h-[100dvh] w-full"
      style={hueVars(zone.accent)}
    >
      <div className="mx-auto grid min-h-[100dvh] max-w-container gap-6 px-[max(20px,5vw)] pb-28 pt-24 lg:grid-cols-[minmax(0,27rem)_1fr] lg:items-center lg:gap-10">
        {/* Info panel */}
        <div className="mc-panel p-6">
          <p className="pixel-title text-[10px]" style={{ color: hue(zone.accent) }}>
            {zone.eyebrow}
          </p>
          <h2
            id={`${zone.id}-title`}
            ref={headingRef}
            tabIndex={-1}
            className="pixel-title mt-3 text-xl text-ink-900 outline-none sm:text-2xl"
          >
            {zone.title}
          </h2>
          <p className="mt-4 text-2xl leading-tight text-ink-600">{zone.lede}</p>
          {zone.body.map((p, i) => (
            <p key={i} className="mt-3 text-xl text-ink-900">
              {p}
            </p>
          ))}

          {zone.research && (
            <details className="group mt-4 mc-slot p-3">
              <summary className="cursor-pointer list-none pixel-title text-[9px]" style={{ color: hue(zone.accent) }}>
                <span className="group-open:hidden">▶ SHOW THE RESEARCH</span>
                <span className="hidden group-open:inline">▼ RESEARCH AT NORWICH RESEARCH PARK</span>
              </summary>
              <p className="mt-3 text-lg text-ink-900">{zone.research}</p>
            </details>
          )}

          {zone.id === 'cafe' && (
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="mc-btn mt-4 px-5 py-3 text-[10px]"
              style={{ background: hue('amber') }}
            >
              Activity book (soon)
            </button>
          )}

          {zone.hasSpecies ? (
            <p className="mt-5 flex items-center gap-2 text-xl text-ink-600">
              <span aria-hidden>👉</span> Tap the microbes to meet them
              <span className="mc-slot ml-auto px-2.5 py-0.5 text-ink-900">
                {collectedHere}/{critters.length}
              </span>
            </p>
          ) : (
            <p className="mt-5 text-xl text-ink-600">
              {zone.id === 'poo' ? 'Give the poo a tap.' : 'Just passing through on the way inside.'}
            </p>
          )}
        </div>

        {/* Play area */}
        <div className="relative min-h-[56vh] w-full lg:min-h-[68vh]" role="group" aria-label={`${zone.title}`}>
          {critters.map((m, i) => {
            const spot = critters.length === 1 ? { top: '36%', left: '38%' } : SPOTS[i % SPOTS.length];
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
                <span className="mc-slot grid h-20 w-20 place-items-center sm:h-24 sm:w-24" style={{ color: hue(m.glow) }}>
                  <MicrobeCritter species={m.id} color={m.color} idle={IDLES[i % IDLES.length]} className="h-14 w-14 sm:h-16 sm:w-16" />
                </span>
                <span className="mc-panel px-2 py-1 text-center text-lg leading-none text-ink-900">
                  {collected && <span aria-hidden>✓ </span>}
                  {m.name}
                </span>
              </motion.button>
            );
          })}

          {zone.id === 'poo' && (
            <motion.button
              type="button"
              onClick={() => {
                blip('poo');
                setPooTalk((v) => !v);
              }}
              aria-label="The giant poo, tap for a fun fact"
              className="absolute left-1/2 top-1/2 flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={reduced ? undefined : { scale: 1.05 }}
              whileTap={reduced ? undefined : { scale: 0.95 }}
            >
              {pooTalk && (
                <span className="mc-panel mb-1 max-w-[15rem] px-3 py-2 text-center text-lg text-ink-900">
                  Fun fact: a big part of poo is living microbes.
                </span>
              )}
              <span className="h-32 w-32 anim-bob sm:h-40 sm:w-40">
                <GiantPoo />
              </span>
              <span className="mc-panel px-3 py-1 text-lg text-ink-900">Giant Poo</span>
            </motion.button>
          )}

          {zone.id === 'mouth' && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-7xl" aria-hidden>👄</span>
              <p className="mc-panel mt-4 px-4 py-2 text-lg text-ink-900">The way into the gut.</p>
            </div>
          )}
        </div>
      </div>

      {open && <SpeciesCard microbe={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
