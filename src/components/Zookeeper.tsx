import { motion } from 'framer-motion';
import { ZOOKEEPERS } from '../data/zookeepers';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Footer } from './Footer';
import { hue, hueVars } from '../lib/glow';

/** Final stop: "Meet the Scientists", the real research groups. */
export function Zookeeper() {
  const reduced = useReducedMotion();
  return (
    <section aria-labelledby="keepers-title" className="relative min-h-[100dvh] w-full">
      <div className="mx-auto max-w-container px-[max(20px,5vw)] pb-28 pt-24">
        <div className="mc-panel p-6">
          <p className="pixel-title text-[10px]" style={{ color: hue('violet') }}>
            Meet the team
          </p>
          <h2 id="keepers-title" tabIndex={-1} className="pixel-title mt-3 text-2xl text-ink-900 outline-none sm:text-3xl">
            Meet the Scientists
          </h2>
          <p className="mt-4 text-2xl leading-tight text-ink-600">
            Your guides are real scientists from the Centre for Microbial Interactions at Norwich
            Research Park. Here is some of the work they do.
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {ZOOKEEPERS.map((z, i) => (
            <motion.li
              key={z.id}
              style={hueVars(z.accent)}
              className="mc-panel p-5"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: reduced ? 0 : (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mc-slot inline-block px-3 py-1 pixel-title text-[8px] text-white" style={{ background: hue(z.accent) }}>
                {z.zone}
              </span>
              <h3 className="pixel-title mt-3 text-sm text-ink-900">{z.institution}</h3>
              <p className="mt-3 text-xl leading-snug text-ink-600">{z.work}</p>
            </motion.li>
          ))}
        </ul>

        <p className="mc-panel mt-6 p-6 text-center text-2xl text-ink-900">
          That is the tour. You met the invisible neighbours who grow our food, keep us well, and
          keep the planet ticking.
        </p>
      </div>

      <Footer />
    </section>
  );
}
