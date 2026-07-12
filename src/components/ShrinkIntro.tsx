import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ENTRANCE } from '../data/zones';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { GutCrossSection } from './scenes/GutCrossSection';

/**
 * Entrance "Shrink Ray". On "Shrink me", the hero scales/zooms toward the
 * visitor (a sense of being shrunk to microscopic scale), then reveals the
 * journey and scrolls to the first zone. Under reduced motion, a clean fade.
 */
export function ShrinkIntro({ onEnter }: { onEnter: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [entering, setEntering] = useState(false);

  const { contextSafe } = useGSAP({ scope: root });

  const shrink = contextSafe(() => {
    if (entering) return;
    setEntering(true);

    const finish = () => {
      onEnter();
      document.getElementById('soil')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    };

    if (reduced) {
      gsap.to(root.current, { opacity: 0, duration: 0.35, onComplete: finish });
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.to('[data-hero-content]', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' })
      .to('[data-hero-portal]', { scale: 18, duration: 1.0, ease: 'power3.in' }, '<0.1')
      .to(root.current, { opacity: 0, duration: 0.4 }, '-=0.35');
  });

  return (
    <div
      ref={root}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-[var(--gutter)] text-center"
      style={{
        backgroundImage:
          'radial-gradient(80% 60% at 50% 40%, rgba(47,230,168,0.10) 0%, transparent 55%), radial-gradient(60% 50% at 70% 80%, rgba(255,79,216,0.08) 0%, transparent 60%)',
      }}
    >
      {/* Drifting spore field (decorative, paused under reduced motion via CSS). */}
      <SporeField />

      {/* Tunnel mouth — the round cross-section opening you shrink into. */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-[38rem] w-[38rem] max-w-[130vw] opacity-30 motion-safe:animate-[spin_140s_linear_infinite]"
      >
        <GutCrossSection className="h-full w-full" hue="var(--biolum-teal)" />
      </div>

      {/* The shrink portal — scales up to swallow the viewport on enter. */}
      <div
        data-hero-portal
        aria-hidden
        className="pointer-events-none absolute h-40 w-40 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(47,230,168,0.35) 0%, rgba(56,225,255,0.12) 45%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />

      <div data-hero-content className="relative z-10 max-w-3xl">
        <p className="font-mono text-xl uppercase tracking-widest text-biolum-teal">
          {ENTRANCE.eyebrow}
        </p>
        <h1
          className="mt-4 font-pixel text-[clamp(1.75rem,7vw,3.5rem)] leading-tight text-ink-100 text-glow"
          style={{ ['--glow-hue' as string]: 'rgba(47,230,168,0.5)' }}
        >
          {ENTRANCE.title}
        </h1>
        <p className="mt-3 font-display text-xl text-ink-300">{ENTRANCE.subtitle}</p>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-100">{ENTRANCE.lede}</p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={shrink}
            className="rounded-pill bg-accent px-8 py-4 font-display text-lg font-bold text-[var(--color-on-accent)] shadow-glow-md transition duration-[--dur-micro] ease-biolum hover:shadow-glow-lg active:scale-[0.97]"
            style={{ ['--glow-hue' as string]: 'rgba(255,179,71,0.5)' }}
          >
            {ENTRANCE.cta}
          </button>
          <button
            type="button"
            onClick={shrink}
            className="font-mono text-lg text-ink-500 underline-offset-4 hover:text-ink-100 hover:underline"
          >
            {ENTRANCE.skip}
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-base text-ink-500" aria-hidden>
        scroll to descend ↓
      </div>
    </div>
  );
}

function SporeField() {
  const spores = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {spores.map((_, i) => {
        const size = 3 + (i % 4) * 2;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-biolum-cyan/40 motion-safe:animate-drift"
            style={{
              width: size,
              height: size,
              left: `${(i * 61) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 7) * 0.8}s`,
              boxShadow: '0 0 8px rgba(56,225,255,0.5)',
            }}
          />
        );
      })}
    </div>
  );
}
