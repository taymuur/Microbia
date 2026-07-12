import type { ZoneConfig } from '../data/zones';
import { microbesByZone, type ZoneId } from '../data/microbes';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SpeciesCard } from './SpeciesCard';
import { glowColor, glowHue, glowVars } from '../lib/glow';

export function Zone({ zone }: { zone: ZoneConfig }) {
  const ref = useScrollReveal<HTMLElement>();
  const species = zone.hasSpecies ? microbesByZone(zone.id as ZoneId) : [];

  return (
    <section
      ref={ref}
      id={String(zone.id)}
      aria-labelledby={`${zone.id}-title`}
      className="relative border-t border-white/5 px-[var(--gutter)] py-24 sm:py-32"
      style={{
        ...glowVars(zone.accent),
        // faint habitat wash from the top, in the zone's hue
        backgroundImage: `radial-gradient(120% 60% at 50% 0%, ${glowHue(zone.accent, 0.1)} 0%, transparent 60%)`,
      }}
    >
      <div className="mx-auto max-w-container">
        <header className="max-w-2xl">
          <p
            data-reveal
            className="font-mono text-xl uppercase tracking-wide"
            style={{ color: glowColor(zone.accent) }}
          >
            {zone.eyebrow}
          </p>
          <h2
            id={`${zone.id}-title`}
            data-reveal
            className="mt-2 font-display text-4xl font-bold text-ink-100 text-glow sm:text-5xl"
          >
            {zone.title}
          </h2>
          <p data-reveal className="mt-4 text-xl text-ink-300">
            {zone.lede}
          </p>
          {zone.body.map((p, i) => (
            <p data-reveal key={i} className="mt-4 text-ink-100">
              {p}
            </p>
          ))}
          {zone.research && (
            <p
              data-reveal
              className="mt-6 border-l-2 pl-4 text-sm text-ink-500"
              style={{ borderColor: glowColor(zone.accent) }}
            >
              <span className="font-mono text-base uppercase tracking-wide" style={{ color: glowColor(zone.accent) }}>
                Research at Norwich Research Park —{' '}
              </span>
              {zone.research}
            </p>
          )}
        </header>

        {species.length > 0 && (
          <div className="mt-12">
            <p data-reveal className="mb-4 font-mono text-lg text-ink-500">
              Species you can meet here — tap to open, then collect:
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {species.map((m) => (
                <li key={m.id}>
                  <SpeciesCard microbe={m} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {zone.id === 'cafe' && (
          <a
            data-reveal
            href="#"
            aria-disabled="true"
            onClick={(e) => e.preventDefault()}
            className="mt-10 inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-3 font-display font-semibold text-[var(--color-on-accent)] shadow-glow-md"
            style={glowVars('amber')}
          >
            Download the activity book
            <span className="font-mono text-base opacity-70">(coming soon)</span>
          </a>
        )}
      </div>
    </section>
  );
}
