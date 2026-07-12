export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--color-bg-deep)] px-[var(--gutter)] py-16">
      <div className="mx-auto max-w-container">
        <p className="font-pixel text-pixel-label text-biolum-teal">MICROBIA</p>
        <p className="mt-4 max-w-2xl text-ink-300">
          A fan-made digital tribute to the Microbe Zoo by the Centre for Microbial Interactions &amp;
          SAW Trust, Norwich Research Park.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 text-sm text-ink-500 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-base uppercase tracking-wide text-ink-300">Created by</h3>
            <p className="mt-2">
              The Centre for Microbial Interactions and the SAW (Science, Art, Writing) Trust, with
              artist-led organisation originalprojects; (Great Yarmouth).
            </p>
          </div>
          <div>
            <h3 className="font-mono text-base uppercase tracking-wide text-ink-300">
              Sponsors &amp; funding
            </h3>
            <p className="mt-2">
              Founding sponsor: John Innes Foundation. Funding: Norwich Freemen’s Charity.
            </p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="font-mono text-base uppercase tracking-wide text-ink-300">
              Norwich Research Park partners
            </h3>
            <p className="mt-2">
              Anglia Innovation Partnership · Earlham Institute · John Innes Centre · Norfolk &amp;
              Norwich University Hospitals · Quadram Institute · The Sainsbury Laboratory ·
              University of East Anglia.
            </p>
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-700">
          Microbia is an independent fan project and is not officially affiliated with the named
          organisations. All research described belongs to the institutions credited above.
        </p>
      </div>
    </footer>
  );
}
