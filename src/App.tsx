import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { PassportProvider } from './hooks/usePassport';
import { useReducedMotion } from './hooks/useReducedMotion';
import { ShrinkIntro } from './components/ShrinkIntro';
import { HabitatRoom } from './components/HabitatRoom';
import { Zookeeper } from './components/Zookeeper';
import { Passport } from './components/Passport';
import { ThemeToggle } from './components/ThemeToggle';
import { HabitatNav } from './components/HabitatNav';
import { ZONES } from './data/zones';

const TOTAL = ZONES.length + 1; // habitats + zookeepers

export default function App() {
  // -1 = the shrink-ray intro; 0..TOTAL-1 = the habitat rooms.
  const [index, setIndex] = useState(-1);

  const go = useCallback((i: number) => {
    if (i < 0 || i >= TOTAL) return;
    setIndex(i);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Arrow-key navigation between habitats.
  useEffect(() => {
    if (index < 0) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  return (
    <ThemeProvider>
      <PassportProvider>
        {index < 0 ? (
          <ShrinkIntro onEnter={() => go(0)} />
        ) : (
          <Tour index={index} go={go} />
        )}
      </PassportProvider>
    </ThemeProvider>
  );
}

function Tour({ index, go }: { index: number; go: (i: number) => void }) {
  const reduced = useReducedMotion();
  const isKeepers = index >= ZONES.length;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to the habitat
      </a>

      {/* Top HUD */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-[max(16px,4vw)] py-3">
        <button
          type="button"
          onClick={() => go(0)}
          className="rounded-pill bg-surface/85 px-4 py-2 font-pixel text-pixel-label text-ink-900 shadow-card backdrop-blur"
          aria-label="Microbia — back to the start of the tour"
        >
          MICROBIA
        </button>
        <div className="flex items-center gap-2">
          <Passport />
          <ThemeToggle />
        </div>
      </header>

      {/* The room */}
      <main id="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {isKeepers ? <Zookeeper /> : <HabitatRoom zone={ZONES[index]} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigator */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
        <HabitatNav index={index} onGo={go} />
      </div>
    </>
  );
}
