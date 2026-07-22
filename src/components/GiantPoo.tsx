// The giant poo, a nod to the physical Microbe Zoo's toilet. A cheerful,
// tappable character in the gut, with a light (true, non-numeric) message.
export function GiantPoo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`h-full w-full overflow-visible ${className ?? ''}`} aria-hidden>
      <defs>
        <linearGradient id="poo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a2b" />
          <stop offset="1" stopColor="#5f3c18" />
        </linearGradient>
      </defs>
      {/* stacked swirl */}
      <path
        d="M50 20 C 60 20 64 30 60 36 C 72 34 80 44 74 54 C 86 54 90 68 80 74 C 84 84 72 92 50 92 C 28 92 16 84 20 74 C 10 68 14 54 26 54 C 20 44 28 34 40 36 C 36 30 40 20 50 20 Z"
        fill="url(#poo)"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* swirl highlights */}
      <path d="M38 40 q12 -6 24 0" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 58 q20 -8 40 0" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />
      {/* face */}
      <g className="anim-blink" style={{ transformOrigin: 'center' }}>
        <circle cx="42" cy="62" r="6" fill="#fff" />
        <circle cx="58" cy="62" r="6" fill="#fff" />
        <circle cx="43" cy="63.5" r="2.6" fill="#1a2338" />
        <circle cx="59" cy="63.5" r="2.6" fill="#1a2338" />
      </g>
      <path d="M43 74 Q50 82 57 74" fill="none" stroke="#1a2338" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
