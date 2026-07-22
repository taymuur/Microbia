# Microbia

An interactive, Minecraft-styled journey into the microscopic world. The visitor is "shrunk"
to microbe scale and travels through a series of blocky habitats where microbes live (soil,
café, mouth, gut, poo, waterways), meeting scientifically accurate microbe characters they can
tap to learn about and collect, and finishing with the real scientists behind the research.

Inspired by the Microbe Zoo, created by the Centre for Microbial Interactions and the SAW
(Science, Art, Writing) Trust at Norwich Research Park. Built with Claude Cowork.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (design tokens in `src/index.css`, documented in `src/design-system.md`)
- three.js + react-three-fiber for the voxel 3D world
- Framer Motion for UI transitions, GSAP for the shrink intro
- Web Audio for procedural sound (no audio files)
- No backend, no database, no `localStorage` or `sessionStorage`; all state is in-memory

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck and production build
npm run preview  # preview the production build
```

## Structure

```
src/
  main.tsx, App.tsx
  index.css                 # design tokens and Minecraft GUI primitives
  components/               # ShrinkIntro, HabitatRoom, Habitat3D, SpeciesCard, MicrobeCritter, ...
  data/                     # microbes, zones, scientists (factual copy)
  hooks/                    # usePassport, useTheme, useSound, useReducedMotion
  lib/                      # habitat hue helpers
```

## Accessibility

Respects `prefers-reduced-motion` (the 3D world and animations freeze), keyboard navigable with
visible focus rings and arrow-key stage navigation, a skip link, AA colour contrast, and aria
labels on meaningful controls. British English throughout. Sound is muted by default.

## Status

Minecraft edition. Stage order: Soil, Café, Mouth, Gut, Poo, Waterways, then Meet the Scientists.
A single persistent three.js canvas renders a distinct voxel biome for each stage. Light (day) by
default with a dark (night) toggle, and a sound toggle for per-stage ambience.
