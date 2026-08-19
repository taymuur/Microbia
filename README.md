# Microbia

An interactive journey into the microscopic world. The visitor is "shrunk" to microbe scale
and travels through a series of habitats where microbes live (soil, café, mouth, gut, poo,
waterways), meeting scientifically accurate microbe characters they can tap to learn about and
collect, and finishing with the real scientists behind the research.

Two entirely separate 3D builds of the same journey are switchable at any time:

- **Realistic**: smooth, curved and textured, with everything in motion.
- **Blocks**: the same journey rebuilt out of cubes, Minecraft style.

Both keep the sound and the same content, and every scene fills the whole screen.

Inspired by the Microbe Zoo, created by the Centre for Microbial Interactions and the SAW
(Science, Art, Writing) Trust at Norwich Research Park.

Created by Taimur Shahzad Gill, built using Claude Fable 5 (Cowork).

## Stack

- Vite + React + TypeScript
- Tailwind CSS (design tokens in `src/index.css`)
- three.js + react-three-fiber for the 3D world, with two separate scene sets
  (`components/scenes/RealScenes.tsx` and `components/scenes/BlockScenes.tsx`)
- Procedural geometry and canvas textures (`lib/three-helpers.ts`); no image assets
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

Stage order: Soil, Café, Mouth, Gut, Poo, Waterways, then Meet the Scientists.

Each stage is a full-screen 3D scene following the food's journey: crops growing with roots
reaching down through the soil; a customer buying food at a café counter under a chalk menu
board; teeth, tongue and a mouthful travelling down a real throat passage; chewed food tumbling
through a villi-lined gut; a tiled bathroom with the toilet; and a sewer outfall emptying into a
lake. The realistic set uses lathe, tube and rounded geometry with procedural textures; the
Blocks set rebuilds every scene from cubes with pixelated textures. Toggles for look, sound and
light / dark.
