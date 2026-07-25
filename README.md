# Microbia

An interactive journey into the microscopic world. The visitor is "shrunk" to microbe scale
and travels through a series of habitats where microbes live (soil, café, mouth, gut, poo,
waterways), meeting scientifically accurate microbe characters they can tap to learn about and
collect, and finishing with the real scientists behind the research.

Two looks are built in and switchable at any time: a bright **Classic** look and a blocky
**Blocks** (Minecraft-style) look. Both keep the sound and the same content.

Inspired by the Microbe Zoo, created by the Centre for Microbial Interactions and the SAW
(Science, Art, Writing) Trust at Norwich Research Park. Built with Claude Cowork.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (design tokens in `src/index.css`)
- three.js + react-three-fiber for the 3D world (bubble scenes for Classic, voxel scenes for Blocks)
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

## Accessibility

Respects `prefers-reduced-motion` (the 3D world and animations freeze), keyboard navigable with
visible focus rings and arrow-key stage navigation, a skip link, AA colour contrast, and aria
labels on meaningful controls. British English throughout. Sound is muted by default.

## Status

Stage order: Soil, Café, Mouth, Gut, Poo, Waterways, then Meet the Scientists. A single persistent
three.js canvas renders a distinct scene per stage. Toggles for look (Classic / Blocks), sound,
and light / dark.
