import { ZOOKEEPERS } from '../data/zookeepers';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { glowColor, glowVars } from '../lib/glow';

/** "Meet the Zookeepers" — the real research groups behind the Microbe Zoo. */
export function Zookeeper() {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="keepers"
      aria-labelledby="keepers-title"
      className="border-t border-white/5 px-[var(--gutter)] py-24 sm:py-32"
      style={{
        backgroundImage:
          'radial-gradient(120% 60% at 50% 0%, rgba(155,123,255,0.10) 0%, transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-container">
        <p data-reveal className="font-mono text-xl uppercase tracking-wide text-biolum-violet">
          Zone 05 — the zookeepers
        </p>
        <h2 id="keepers-title" data-reveal className="mt-2 font-display text-4xl font-bold text-ink-100 text-glow sm:text-5xl" style={glowVars('violet')}>
          Meet the Zookeepers
        </h2>
        <p data-reveal className="mt-4 max-w-2xl text-xl text-ink-300">
          Your tour guides are real scientists from the Centre for Microbial Interactions at
          Norwich Research Park. Here is some of the work they do.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {ZOOKEEPERS.map((z) => (
            <li
              key={z.id}
              data-reveal
              style={glowVars(z.accent, 0.35)}
              className="rounded-lg border border-white/10 bg-[var(--glass-bg)] p-6 backdrop-blur transition duration-[--dur-micro] ease-biolum hover:border-transparent hover:shadow-glow-md"
            >
              <p className="font-mono text-lg" style={{ color: glowColor(z.accent) }}>
                {z.zone}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-ink-100">
                {z.institution}
              </h3>
              <p className="mt-3 text-ink-300">{z.work}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
