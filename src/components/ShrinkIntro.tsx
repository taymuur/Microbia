import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ENTRANCE } from '../data/zones';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MicrobeCritter } from './MicrobeCritter';

const FLOATERS = [
  { species: 'streptomyces', color: '#3aa0d8', top: '16%', left: '12%', idle: 'bob' as const },
  { species: 'bacteriophage', color: '#ec3f8f', top: '20%', left: '80%', idle: 'wiggle' as const },
  { species: 'saccharomyces', color: '#ef8a3a', top: '68%', left: '16%', idle: 'bob' as const },
  { species: 'euglena', color: '#7cbf3f', top: '66%', left: '82%', idle: 'swim' as const },
];

/**
 * Entrance shrink ray, styled as a Minecraft title screen. On "Shrink me" a
 * portal zooms toward the visitor, then hands off to the tour. Under reduced
 * motion, a clean fade instead.
 */
export function ShrinkIntro({ onEnter }: { onEnter: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [entering, setEntering] = useState(false);
  const { contextSafe } = useGSAP({ scope: root });

  const shrink = contextSafe(() => {
    if (entering) return;
    setEntering(true);
    if (reduced) {
      gsap.to(root.current, { opacity: 0, duration: 0.3, onComplete: onEnter });
      return;
    }
    gsap
      .timeline({ onComplete: onEnter })
      .to('[data-hero-content]', { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in' })
      .to('[data-floater]', { opacity: 0, scale: 0.4, duration: 0.3 }, '<')
      .to('[data-portal]', { scale: 30, duration: 0.9, ease: 'power3.in' }, '<0.05')
      .to(root.current, { opacity: 0, duration: 0.4 }, '-=0.4');
  });

  return (
    <div
      ref={root}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: 'linear-gradient(180deg, var(--mc-sky) 0%, color-mix(in srgb, var(--mc-sky) 70%, #ffffff) 60%, var(--c-lime) 100%)' }}
    >
      {/* blocky ground strip */}
      <div className="absolute inset-x-0 bottom-0 h-24" aria-hidden style={{ background: 'var(--c-lime)', boxShadow: 'inset 0 6px 0 rgba(255,255,255,0.25), inset 0 -40px 0 rgba(0,0,0,0.12)' }} />

      {FLOATERS.map((f, i) => (
        <span key={i} data-floater aria-hidden className="mc-slot absolute grid h-16 w-16 place-items-center sm:h-20 sm:w-20" style={{ top: f.top, left: f.left, color: f.color }}>
          <MicrobeCritter species={f.species} color={f.color} idle={f.idle} className="h-12 w-12 sm:h-14 sm:w-14" />
        </span>
      ))}

      <div data-portal aria-hidden className="pointer-events-none absolute h-24 w-24" style={{ background: 'var(--c-teal)', boxShadow: '0 0 0 6px rgba(255,255,255,0.5)' }} />

      <div data-hero-content className="mc-panel relative z-10 max-w-2xl p-8">
        <p className="text-xl text-ink-600">{ENTRANCE.eyebrow}</p>
        <h1 className="pixel-title mt-4 text-[clamp(1.4rem,6vw,2.75rem)] text-ink-900">{ENTRANCE.title}</h1>
        <p className="mt-3 text-2xl text-ink-600">{ENTRANCE.subtitle}</p>
        <p className="mx-auto mt-5 max-w-xl text-xl leading-snug text-ink-900">{ENTRANCE.lede}</p>

        <div className="mt-7 flex flex-col items-center gap-3">
          <button type="button" onClick={shrink} className="mc-btn px-8 py-4 text-sm" style={{ background: 'var(--c-lime)' }}>
            {ENTRANCE.cta}
          </button>
          <button type="button" onClick={shrink} className="text-xl text-ink-600 underline-offset-4 hover:text-ink-900 hover:underline">
            {ENTRANCE.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
