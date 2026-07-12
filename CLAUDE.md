# CLAUDE.md — Microbia (digital Microbe Zoo)

> This file is the source of truth for the project. Read it fully before any build task.
> When something here conflicts with a prompt, ask before overriding.

## What we're building

A digital twin of the **Microbe Zoo**, the interactive installation created by the
**Centre for Microbial Interactions (CMI)** and the **SAW (Science Art Writing) Trust**
at Norwich Research Park. The physical version appeared at Norwich Science Festival
(Feb 2026) and the Royal Society Summer Science Exhibition, London (30 Jun–5 Jul 2026).

The web version is an **immersive, scroll-driven single-page journey**. The visitor is
"shrunk" to microscopic scale and taken on a guided tour through the habitats where
microbes live — soil, gut, waterways — ending at a mock café/gift shop, with a section
introducing the real scientists who act as "zookeepers".

Audience: **all ages, no science background assumed.** Tone: wonder + playfulness, not
a lecture. Think "nature documentary meets theme-park zoo", at the scale of the invisible.

## Non-negotiables

- **Factual accuracy.** Every science claim in the copy must come from the Content section
  below (sourced from the real installation). Do NOT invent research findings, scientist
  names, institutions, or statistics. If you need copy and the fact isn't here, write it
  generically or leave a `TODO(content)` marker — never fabricate.
- **British English** throughout (colour, behaviour, organisation, programme).
- **Accessible.** Respect `prefers-reduced-motion` (swap scroll animations for simple
  fades). Alt text on all meaningful visuals. Keyboard-navigable. Captions/toggle for any
  audio. Colour contrast AA minimum.
- **Credit the source** in the footer: "A fan-made digital tribute to the Microbe Zoo by
  the Centre for Microbial Interactions & SAW Trust, Norwich Research Park." Plus this repo's
  own product name (Microbia).

## Writing style for all copy

Plain, human prose. Mixed sentence lengths. No filler ("in today's fast-paced world",
"dive into", "unlock", "delve", "it's important to note"). No exclamation-mark spam. Warm
and curious, never salesy. Short paragraphs. When a fact is striking, state it plainly and
let it land.

## The journey (zones, in scroll order)

1. **Entrance — the Shrink Ray.** Hero. The visitor is shrunk down so they can finally see
   microbes: bacteria, viruses, fungi, algae. Sets the hook: everywhere on Earth has its own
   population of microbes; we usually can't see them, but they supply our food, keep us
   healthy, and shape the environment and climate. A "Begin the tour" / "Shrink me" entry.

2. **The Soil Tunnel.** A journey underground. Plants communicate with microbes to enlist
   their help accessing nutrients they need to grow and produce food. Research thread:
   **John Innes Centre** scientists study naturally occurring soil bacteria that protect
   plants against disease and promote growth — harnessing the soil microbiome could reduce
   environmentally harmful agrochemicals and cut greenhouse gases like N2O.

3. **The Gut Tunnel.** Follow the food into the human gut to meet the microbiome. Fibre and
   a diet rich in vegetables support this microbial population, which in turn keeps us
   healthy. Two research threads:
   - **Phages (Quadram Institute).** Researchers Revathy and Arezoo study bacteriophages —
     viruses that infect bacteria. There are more phages in the gut microbiome than bacteria.
     Can we harness the way they infect bacteria to combat antibiotic-resistant, disease-
     causing bacteria? A possible replacement for antibiotics.
   - **Gut–brain axis (UEA, Norwich Medical School).** Dr David Vazour found that subtle
     changes in the blood, caused by chemicals produced by gut bacteria, may reveal the
     earliest signs of cognitive decline — long before symptoms show. This could lead to a
     blood test to identify people at higher risk of dementia.

4. **The Waterways.** Dive into rivers and seas. Environmental challenges: sewage and runoff
   from landfill or agriculture, and how microbial research could help build a sustainable
   ecological balance. Research thread: **UEA** researchers found a common ocean alga
   produces an abundance of a compound called **DMSP** (dimethylsulfoniopropionate). It
   breaks down into a gas that creates the characteristic smell of the sea — and plays a
   vital role in balancing the planet's climate.

5. **The Café & Gift Shop.** A playful palate-cleanser. Many everyday foods and household
   products are made by microbes (bread, cheese, yoghurt, beer, etc.). End with a free
   downloadable "activity book" of at-home experiments (link/placeholder).

6. **Meet the Zookeepers.** The tour guides are real scientists from the Centre for Microbial
   Interactions. Beyond the threads above, include:
   - **The Sainsbury Laboratory** (Sophien Kamoun's group): developed sequencing technology
     "Field Pathogenomics" and a web platform "OpenWheatBlast" to combat wheat blast, a
     devastating fungal disease — helping farmers avoid crop losses and improving global
     biosecurity.
   - **Earlham Institute**: single-cell genomics to decode protists (a huge, poorly understood
     group of microbes found everywhere). Some cause disease, like *Plasmodium* (malaria).
     Others, like *Euglena*, can produce high-value compounds such as pharmaceuticals.
     Sequencing *Bodo* (closest free-living relative of the parasite behind sleeping sickness)
     revealed how these microbes evolved and interact with their environment.

## The microbe cast

Four groups, each with a distinct visual language:
- **Bacteria** — rod / sphere / spiral forms.
- **Viruses / bacteriophages** — geometric, "lunar-lander" phage silhouette.
- **Fungi** — branching threads (hyphae), spores.
- **Algae / protists** — flowing, organic, single-cell shapes.

Each species the visitor meets gets a **species card**: name, group, habitat zone, one-line
"what it does", and a "collect" action.

## Interaction ideas (build progressively — ship the journey first)

- **Shrink intro:** a scale/zoom transition on entry (CSS transform + GSAP), swapped for a
  fade under reduced-motion.
- **Scroll-driven tunnels:** GSAP ScrollTrigger reveals as you descend through each zone.
- **Species cards:** click a microbe → card opens.
- **Passport / "microbes collected":** a small persistent counter that fills as you explore
  the zones (in-memory React state only — NO localStorage).
- **Mini-games (v2, optional):** "feed the microbiome" (pick fibre-rich foods), "match the
  microbe to its habitat", "phage vs. resistant bacteria".
- **Soundscapes (v2):** one ambient loop per zone, muted by default with a clear toggle.

## Credits & sponsors (for the About/footer)

Created by the **Centre for Microbial Interactions** and the **SAW Trust**, with artist-led
organisation **originalprojects;** (Great Yarmouth). Founding sponsor: **John Innes
Foundation**. Funding: **Norwich Freemen's Charity**. Norwich Research Park partners: Anglia
Innovation Partnership, Earlham Institute, John Innes Centre, Norfolk & Norwich University
Hospitals, Quadram Institute, The Sainsbury Laboratory, University of East Anglia.

## Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (design tokens in `tailwind.config` + a `design-system.md` from the
  extraction step)
- **GSAP + ScrollTrigger** for the scroll journey
- **Framer Motion** for component-level micro-interactions
- **Howler.js** for zone soundscapes (v2)
- No backend. No database. Everything in-memory / static. **Never use localStorage or
  sessionStorage.**

## Structure (target)

```
src/
  main.tsx
  App.tsx
  design-system.md            # extracted tokens + rationale (Level 7 output)
  components/
    ShrinkIntro.tsx
    Zone.tsx                  # generic zone shell
    SpeciesCard.tsx
    Passport.tsx
    Zookeeper.tsx
    Footer.tsx
  zones/                      # per-zone content + config
  data/microbes.ts            # the cast + species cards (from Content above)
  hooks/
  assets/
```

## Deploy

Static build (`vite build`), deployed free via Vercel (primary), Cloudflare Pages, or GitHub
Pages. If GitHub Pages: set `base` in `vite.config` to `/<repo-name>/`.

## Definition of done for v1

The full six-zone scroll journey works end to end on desktop and mobile, reads accurately,
respects reduced-motion, is keyboard-navigable, and deploys to a live free URL. Games and
sound are v2.
