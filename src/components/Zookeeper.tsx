import { motion } from 'framer-motion';
import { ZOOKEEPERS } from '../data/zookeepers';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Footer } from './Footer';
import { hue, hueVars, hueWash } from '../lib/glow';

/** Final stop: "Meet the Zookeepers" — the real research groups. */
export function Zookeeper() {
  const reduced = useReducedMotion();
  return (
    <section
      aria-labelledby="keepers-title"
      className="relative min-h-[100dvh] w-full"
      style={{ background: 'color-mix(in srgb, var(--c-violet) 10%, var(--color-bg))' }}
    >
      <div className="mx-auto max-w-container px-[max(20px,5vw)] pb-28 pt-24">
        <p className="font-display text-sm font-bold uppercase tracking-wide" style={{ color: hue('violet') }}>
          The zookeepers
        </p>
        <h2 id="keepers-title" tabIndex={-1} className="mt-1 font-display text-4xl font-bold text-ink-900 outline-none sm:text-5xl">
          Meet the Zookeepers
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-600">
          Your tour guides are real scientists from the Centre for Microbial Interactions at Norwich
          Research Park. Here is some of the work they do.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {ZOOKEEPERS.map((z, i) => (
            <motion.li
              key={z.id}
              style={hueVars(z.accent)}
              className="rounded-xl border border-[var(--color-border)] bg-surface p-6 shadow-card"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: reduced ? 0 : (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="inline-block rounded-pill px-3 py-1 font-display text-sm font-bold text-white"
                style={{ background: hue(z.accent) }}
              >
                {z.zone}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-ink-900">{z.institution}</h3>
              <p className="mt-2 text-ink-600">{z.work}</p>
              <div
                className="mt-4 h-1.5 w-16 rounded-pill"
                style={{ background: hueWash(z.accent, 60) }}
                aria-hidden
              />
            </motion.li>
          ))}
        </ul>

        <p className="mt-10 rounded-xl bg-surface p-6 text-center font-display text-lg font-semibold text-ink-900 shadow-card">
          That's the tour! You met the invisible neighbours who grow our food, keep us well, and
          keep the planet ticking. 🔬
        </p>
      </div>

      <Footer />
    </section>
  );
}
