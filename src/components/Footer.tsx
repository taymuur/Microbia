export function Footer() {
  return (
    <footer className="mt-10 rounded-xl border border-[var(--color-border)] bg-surface px-[max(20px,5vw)] py-12 shadow-card">
      <div className="mx-auto max-w-container">
        <p className="font-pixel text-pixel-label text-ink-900">MICROBIA</p>
        <p className="mt-4 max-w-2xl text-ink-600">
          Inspired by the Microbe Zoo, created by the Centre for Microbial Interactions and the SAW
          (Science, Art, Writing) Trust at Norwich Research Park.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 text-sm text-ink-600 sm:grid-cols-2">
          <div>
            <h3 className="font-display font-bold text-ink-900">Created by</h3>
            <p className="mt-1">
              The Centre for Microbial Interactions and the SAW Trust, with artist-led organisation
              originalprojects; (Great Yarmouth).
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
          Microbia is an educational tribute inspired by the Microbe Zoo. All research described
          belongs to the institutions credited above. Built with Claude Cowork.
        </p>
      </div>
    </footer>
  );
}
