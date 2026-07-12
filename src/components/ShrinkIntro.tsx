import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ENTRANCE } from '../data/zones';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { GutCrossSection } from './scenes/GutCrossSection';
import { MicrobeCritter } from './MicrobeCritter';
import type { MicrobeGroup } from '../data/microbes';

const FLOATERS: { group: MicrobeGroup; hue: string; top: string; left: string; idle: 'bob' | 'swim' | 'wiggle' }[] = [
  { group: 'Bacteria', hue: 'var(--c-teal)', top: '18%', left: '12%', idle: 'bob' },
  { group: 'Virus', hue: 'var(--c-violet)', top: '24%', left: '80%', idle: 'wiggle' },
  { group: 'Fungi', hue: 'var(--c-amber)', top: '70%', left: '16%', idle: 'bob' },
  { group: 'Algae / protist', hue: 'var(--c-cyan)', top: '68%', left: '82%', idle: 'swim' },
];

/**
 * Entrance "Shrink Ray". On "Shrink me!", a portal zooms toward the visitor
 * (a sense of being shrunk to microscopic scale), then hands off to the tour.
 * Under reduced motion, a clean fade instead.
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
      .to('[data-hero-content]', { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' })
      .to('[data-floater]', { opacity: 0, scale: 0.4, duration: 0.3 }, '<')
      .to('[data-hero-portal]', { scale: 26, duration: 0.9, ease: 'power3.in' }, '<0.05')
      .to(root.current, { opacity: 0, duration: 0.4 }, '-=0.4');
  });

  return (
    <div
      ref={root}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        backgroundImage:
          'radial-gradient(70% 55% at 50% 42%, color-mix(in srgb, var(--c-teal) 16%, var(--color-bg)), transparent 60%), radial-gradient(55% 45% at 78% 82%, color-mix(in srgb, var(--c-magenta) 14%, transparent), transparent 62%)',
      }}
    >
      {/* Tunnel-mouth ring you shrink into */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-[34rem] w-[34rem] max-w-[130vw] opacity-40 motion-safe:[animation:spin_150s_linear_infinite]"
      >
        <GutCrossSection className="h-full w-full" hue="var(--c-teal)" />
      </div>

      {/* Friendly floating microbes */}
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          data-floater
          aria-hidden
          className="pointer-events-none absolute h-16 w-16 sm:h-20 sm:w-20"
          style={{ top: f.top, left: f.left, color: f.hue, animationDelay: `${i * 0.5}s` }}
        >
          <MicrobeCritter group={f.group} idle={f.idle} className="h-full w-full" />
        </span>
      ))}

      {/* The shrink portal */}
      <div
        data-hero-portal
        aria-hidden
        className="pointer-events-none absolute h-32 w-32 rounded-full"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--c-teal) 55%, transparent), transparent 70%)' }}
      />

      <div data-hero-content className="relative z-10 max-w-2xl">
        <p className="font-display text-base font-bold uppercase tracking-widest" style={{ color: 'var(--c-teal)' }}>
          {ENTRANCE.eyebrow}
        </p>
        <h1 className="mt-4 font-pixel text-[clamp(1.6rem,7vw,3.25rem)] leading-tight text-ink-900">
          {ENTRANCE.title}
        </h1>
        <p className="mt-3 font-display text-xl font-semibold text-ink-600">{ENTRANCE.subtitle}</p>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-900">{ENTRANCE.lede}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={shrink}
            className="rounded-pill px-8 py-4 font-display text-lg font-bold text-white shadow-card transition duration-200 ease-pop hover:scale-105 active:scale-95"
            style={{ background: 'var(--c-teal)' }}
          >
            {ENTRANCE.cta}
          </button>
          <button
            type="button"
            onClick={shrink}
            className="font-display font-semibold text-ink-600 underline-offset-4 hover:text-ink-900 hover:underline"
          >
            {ENTRANCE.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
