# Microbia — the digital Microbe Zoo

An immersive, scroll-driven journey into the microscopic world. The visitor is "shrunk"
to microbe scale and guided down through the habitats where microbes live — soil, gut,
waterways — ending at a mock café and a section introducing the real scientists who act
as zookeepers.

A fan-made digital tribute to the **Microbe Zoo** by the **Centre for Microbial Interactions**
and the **SAW Trust**, Norwich Research Park.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (tokens wired from [`src/design-system.md`](src/design-system.md))
- GSAP + ScrollTrigger (scroll journey) · Framer Motion (component motion)
- No backend, no database, no `localStorage`/`sessionStorage` — all state is in-memory.

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Structure

```
src/
  main.tsx, App.tsx
  design-system.md          # single source of truth for tokens
  index.css                 # token definitions + base styles
  components/               # ShrinkIntro, Zone, SpeciesCard, Passport, Zookeeper, Footer, MicrobeGlyph
  data/                     # microbes, zones, zookeepers (factual copy from CLAUDE.md)
  hooks/                    # usePassport, useReducedMotion, useScrollReveal
  lib/                      # glow helpers
```

## Accessibility

Respects `prefers-reduced-motion` (animations become fades), keyboard-navigable with visible
focus rings, a skip link, AA colour contrast, and alt/aria labels on meaningful visuals.
British English throughout.

## Status

v2 — bright, kid-first, "step inside" experience. The visitor is shrunk, then explores
full-screen habitat **rooms** (Soil → Café → Gut → Waterways → Meet the Zookeepers) via a bottom
navigator or arrow keys, meeting **animated microbe characters** they tap to collect into a
passport. Light by default with a **dark-mode toggle**. Soundscapes and mini-games are a later
pass (see `BUILD-PROMPTS.md`).