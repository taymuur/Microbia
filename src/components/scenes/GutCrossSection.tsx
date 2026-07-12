// The Microbe Zoo's signature image: the round anatomical cross-section that
// forms the tunnel mouth — concentric tissue rings around a folded, petal-like
// lumen (the villi). Stylised in our bioluminescent palette, not a photo.
export function GutCrossSection({
  className,
  hue = 'var(--biolum-magenta)',
  lobes = 7,
}: {
  className?: string;
  hue?: string;
  lobes?: number;
}) {
  const petals = Array.from({ length: lobes }, (_, i) => (i * 360) / lobes);
  return (
    <svg
      className={className}
      viewBox="-100 -100 200 200"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* concentric tissue rings */}
      <circle r="96" stroke={hue} strokeOpacity="0.25" strokeWidth="6" />
      <circle r="86" stroke="var(--biolum-violet)" strokeOpacity="0.18" strokeWidth="2" />
      {/* speckled submucosa */}
      <circle r="78" stroke={hue} strokeOpacity="0.5" strokeWidth="3" strokeDasharray="2 7" />
      <circle r="70" stroke={hue} strokeOpacity="0.6" strokeWidth="10" />
      <circle r="60" stroke="var(--biolum-magenta)" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="1 6" />

      {/* the folded lumen — petal-shaped villi around the centre */}
      <g>
        {petals.map((deg) => (
          <path
            key={deg}
            d="M0 -58 C 20 -46, 22 -18, 0 -6 C -22 -18, -20 -46, 0 -58 Z"
            fill={hue}
            fillOpacity="0.22"
            stroke={hue}
            strokeOpacity="0.5"
            strokeWidth="2"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="7" fill={hue} fillOpacity="0.5" />
      </g>
    </svg>
  );
}
