export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-paper-2 px-[max(20px,5vw)] py-14">
      <div className="mx-auto max-w-container">
        <p className="font-pixel text-pixel-label" style={{ color: 'var(--c-teal)' }}>
          MICROBIA
        </p>
        <p className="mt-4 max-w-2xl text-ink-600">
          A fan-made digital tribute to the Microbe Zoo by the Centre for Microbial Interactions &amp;
          SAW Trust, Norwich Research Park.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 text-sm text-ink-600 sm:grid-cols-2">
          <div>
            <h3 className="font-display font-bold text-ink-900">Created by</h3>
            <p className="mt-1">
              The Centre for Microbial Interactions and the SAW (Science, Art, Writing) Trust, with
              artist-led organisation originalprojects; (Great Yarmouth).
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-ink-900">Sponsors &amp; funding</h3>
            <p className="mt-1">
              Founding sponsor: John Innes Foundation. Funding: Norwich Freemen’s Charity.
            </p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="font-display font-bold text-ink-900">Norwich Research Park partners</h3>
            <p className="mt-1">
              Anglia Innovation Partnership · Earlham Institute · John Innes Centre · Norfolk &amp;
              Norwich University Hospitals · Quadram Institute · The Sainsbury Laboratory · University
              of East Anglia.
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink-400">
          Microbia is an independent fan project and is not officially affiliated with the named
          organisations. All research described belongs to the institutions credited above.
        </p>
      </div>
    </footer>
  );
}
