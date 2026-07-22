import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { PassportProvider } from './hooks/usePassport';
import { SoundProvider, useSound } from './hooks/useSound';
import { useReducedMotion } from './hooks/useReducedMotion';
import { ShrinkIntro } from './components/ShrinkIntro';
import { HabitatRoom } from './components/HabitatRoom';
import { Zookeeper } from './components/Zookeeper';
import { Passport } from './components/Passport';
import { ThemeToggle } from './components/ThemeToggle';
import { SoundToggle } from './components/SoundToggle';
import { HabitatNav } from './components/HabitatNav';
import { ZONES } from './data/zones';

// One persistent 3D canvas for the whole tour (loaded lazily). Keeping a single
// WebGL context means every stage renders its own biome reliably.
const Habitat3D = lazy(() => import('./components/Habitat3D'));

const TOTAL = ZONES.length + 1; // stages + scientists

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <PassportProvider>
          <Experience />
        </PassportProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

function Experience() {
  const [index, setIndex] = useState(-1); // -1 = shrink intro
  const { setZone } = useSound();

  const go = useCallback((i: number) => {
    if (i < 0 || i >= TOTAL) return;
    setIndex(i);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (index < 0) return setZone('intro');
    setZone(index >= ZONES.length ? 'keepers' : (ZONES[index].id as 'soil'));
  }, [index, setZone]);

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

  return index < 0 ? <ShrinkIntro onEnter={() => go(0)} /> : <Tour index={index} go={go} />;
}

function Tour({ index, go }: { index: number; go: (i: number) => void }) {
  const reduced = useReducedMotion();
  const isKeepers = index >= ZONES.length;
  const zoneId = isKeepers ? 'keepers' : String(ZONES[index].id);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to the stage
      </a>

      {/* Persistent voxel world behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'var(--color-bg)' }}>
        <Suspense fallback={null}>
          <Habitat3D zone={zoneId} />
        </Suspense>
      </div>

      {/* Top HUD */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-[max(16px,4vw)] py-3">
        <button
          type="button"
          onClick={() => go(0)}
          className="mc-btn px-4 py-2 text-[10px]"
          aria-label="Microbia, back to the start"
        >
          MICROBIA
        </button>
        <div className="flex items-center gap-2">
          <Passport />
          <SoundToggle />
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {isKeepers ? <Zookeeper /> : <HabitatRoom zone={ZONES[index]} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
        <HabitatNav index={index} onGo={go} />
      </div>
    </>
  );
}
