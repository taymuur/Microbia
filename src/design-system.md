# Microbia — Design System

> Level‑7 design extraction and reconciled token set for the digital Microbe Zoo.
> This is the single source of truth for colour, type, spacing and motion. No app code yet —
> everything below is tokens + rationale. When a build prompt conflicts with this file, ask first.

British English throughout. Everything here respects the non‑negotiables in `CLAUDE.md`:
accessibility (WCAG AA, reduced‑motion, keyboard), factual restraint in copy, and crediting
the real Microbe Zoo.

---

## 0. Revision — v2: bright, kid‑first, "step inside" (current)

The original system below was **dark‑first bioluminescent**. On request, the product pivoted to
suit its actual audience — children / STEM outreach — so the **live tokens now differ** from
§4 in three ways. The live source of truth for tokens is `src/index.css`; this section records
the deltas and why.

1. **Light by default, dark as a toggle.** The palette is now bright and friendly by default,
   with the full dark theme kept as an opt‑in `[data-theme="dark"]` toggle (in‑memory only, no
   storage). The six habitat hues (`--c-teal / lime / amber / magenta / cyan / violet`) shift
   between vivid‑on‑light and glowing‑on‑dark, so every component adapts automatically. Each hue
   still maps to a microbe group and a habitat, exactly as designed in §4.1 — only the surface
   values flipped.
2. **Typography leans playful.** Display is now **Fredoka** (rounded, friendly) with **Press
   Start 2P** kept for the wordmark/HUD accent and **Nunito Sans** for body — same reasoning as
   §4.2 (pixel as a fun accent, a genuinely readable reading face), tuned warmer for kids.
3. **Interaction model: enter each habitat, don't scroll past it.** Instead of one long scroll,
   the visitor is "shrunk", then **steps inside** full‑screen habitat rooms (Soil → Café → Gut →
   Waterways → Zookeepers) via a bottom navigator, meeting **animated microbe characters** they
   tap to collect. The immersive scenery (soil roots, the gut cross‑section tunnel, waterways,
   café) and the passport carry over.

4. **Species‑accurate artwork + a 3D immersive background.** Each microbe is now drawn to match
   its real structure from the "Meet the Microbe" fact sheets (Streptomyces' twisted bead chain,
   Bifidobacterium's branched Y, the icosahedral phage, budding yeast, the correct flagella, the
   Euglena eyespot…) in its authentic fact‑sheet colour. The static SVG habitat backdrops were
   replaced by a real **three.js / react‑three‑fiber** depth‑field: dozens of translucent cells
   drift in 3D, the field **parallaxes toward the pointer**, and the gut is a receding tunnel of
   rings. It is theme‑aware, **frozen under reduced motion**, and **lazy‑loaded** so the intro
   stays light.

5. **Per‑habitat 3D scenes, sound, order & the giant poo.** Each habitat now has a
   *structurally distinct* 3D scene (soil = falling grains past descending roots; gut = a
   receding tunnel; waterways = bubbles rising to a rippling surface; café = warm foam and big
   soft bubbles), not just a recolour. **Procedural sound** (Web Audio, no files) adds a per‑
   habitat ambient bed and a "pop" per microbe / chime on collect — muted by default with a clear
   toggle. Order is now **Soil → Gut → Waterways → Café (the gift‑shop exit) → Zookeepers**, and
   the gut features a tappable **giant poo**, a nod to the physical installation's toilet.

Everything else — spacing, motion easings/durations, reduced‑motion handling, accessibility, the
hue‑per‑group mapping — is unchanged from below.

---

## 1. How this was built

Two inputs were reconciled into one token set:

1. **Reference blueprint** — the two sites the brief admires, studied for their *approach*, not
   cloned: the Gut Zoomer / *Vibrant Wellness* immersive body‑journey, and *GoodBelly's* playful
   probiotic brand.
2. **A skill sanity‑check** — the `ui-ux-pro-max` engine run in `--design-system` mode against
   the query *"immersive science education museum interactive nature zoo dark bioluminescent"*,
   with the motion dial high. It confirmed the pattern and style and proposed a palette, font
   pairing and motion tier, which were then adapted to our dark, bioluminescent brief.

The reconciliation is recorded in §6 so future changes know what was kept, overridden, and why.

---

## 2. Reference blueprint (extracted, not copied)

### Gut Zoomer / Vibrant Wellness — *the structure*
- **Palette:** disciplined and narrow — essentially two blues, light `#8EBEF9` and deep
  `#0774C4`, over lots of negative space and depth. Restraint is the lesson: one colour family,
  many values.
- **Type:** clean, technical sans; generous sizes; data and labels feel clinical and precise.
- **Spacing / layout:** full‑bleed, cinematic. One continuous scroll *journey* through the body's
  systems rather than a stack of marketing sections.
- **Motion:** WebGL / Three.js / GSAP. Scroll *is* the narrative — reveals are tied to scroll
  position, with 3D depth and "unusual navigation". Storytelling over UI chrome.
- **Distinctive because:** it treats a health test as a guided expedition. That maps almost
  one‑to‑one onto our soil → gut → waterways tunnels.

**We take:** the continuous scroll‑journey spine, palette discipline (few hues, many values),
and depth/atmosphere. **We leave:** the clinical light‑blue mood and the heavy 3D dependency.

### GoodBelly — *the warmth*
- **Palette:** bright, friendly, high‑energy; not afraid of colour.
- **Type:** rounded, playful, approachable — reads as "fun", never a lecture.
- **Layout:** illustration‑led; information served in **bite‑sized morsels**, not walls of text.
- **Mood:** "make caring for your belly fun, delicious and effortless." Human and unintimidating.
- **Distinctive because:** it makes microbiology *likeable* for a general audience.

**We take:** the playful warmth, illustration‑forward feel, and bite‑sized content chunks (our
species cards). **We leave:** the fully‑lit, sugary consumer‑brand brightness.

### Reconciled reference mood
Gut Zoomer gives us the **immersive journey and restraint**; GoodBelly gives us the **warmth and
play**. Our brief pushes both into the **dark**: a bioluminescent night‑dive rather than a
clinical scan or a bright shop.

---

## 3. Mood — in three sentences

You've been shrunk below the visible world, and the only light down here is the light the
microbes make themselves — cool teal and cyan, a flush of gut‑tunnel magenta, the violet glow of a
phage. It should feel like a night dive into a living, breathing zoo: dark and quiet at the edges,
then a species drifts into focus and *glows*. Wonder first, playfulness close behind, never a
lecture — a nature documentary shot at the scale of the invisible.

---

## 4. The reconciled token set

Three layers, per the design‑system method: **primitive** (raw values) → **semantic** (roles) →
**component**. Build against the semantic and component layers, never raw hex.

### 4.1 Colour

The real Microbe Zoo brand (from the "Meet the Microbe" fact sheets) is **teal + dark‑teal +
amber + green**. Our palette is that brand seen *at night*: the same teal and amber, turned into
bioluminescence over a deep indigo‑black. Pure `#000000` is avoided (OLED smear, and it kills the
sense of depth); the darkest surface is a very dark blue.

Each glow hue also does double duty as the identity colour for one microbe group, so the four
groups in the cast read as four kinds of light.

#### Primitive — abyss (backgrounds & surfaces, deep → raised)
| Token | Hex | Use |
|-------|-----|-----|
| `--abyss-900` | `#05070F` | Deepest void; page base behind everything |
| `--abyss-800` | `#0A0E1A` | Default page background |
| `--abyss-700` | `#121829` | Card / panel surface |
| `--abyss-600` | `#1A2138` | Raised surface, hover fill, glass base |
| `--abyss-500` | `#273150` | Hairline‑lifted borders, inactive controls |

#### Primitive — bioluminescence (the glow palette)
| Token | Hex | Glow (for shadows/borders) | Microbe group |
|-------|-----|-----|-----|
| `--biolum-teal` | `#2FE6A8` | `rgba(47,230,168,.45)` | **Bacteria** (signature / soil) |
| `--biolum-cyan` | `#38E1FF` | `rgba(56,225,255,.45)` | **Algae / protists** (waterways) |
| `--biolum-magenta` | `#FF4FD8` | `rgba(255,79,216,.45)` | **Gut** habitat lighting |
| `--biolum-violet` | `#9B7BFF` | `rgba(155,123,255,.45)` | **Viruses / phages** |
| `--biolum-amber` | `#FFB347` | `rgba(255,179,71,.45)`  | **Fungi** + warm CTA / café |
| `--biolum-lime` | `#8BE04A` | `rgba(139,224,74,.40)`  | Living/organic accent, "collect" success |

#### Primitive — ink (text on dark)
| Token | Hex | Contrast on `--abyss-800` |
|-------|-----|-----|
| `--ink-100` | `#EAF2FF` | 17.1:1 — primary text |
| `--ink-300` | `#B7C4DE` | 11.0:1 — strong secondary |
| `--ink-500` | `#8DA0C4` | 7.3:1 — muted / captions (comfortably ≥ AA body) |
| `--ink-700` | `#5A6B8C` | 3.6:1 — disabled / faint labels only (never body) |
| `--ink-on-glow` | `#05070F` | dark ink for text on bright bioluminescent fills |

#### Semantic
```css
:root {
  /* surfaces */
  --color-bg:            var(--abyss-800);
  --color-bg-deep:       var(--abyss-900);
  --color-surface:       var(--abyss-700);
  --color-surface-raised:var(--abyss-600);
  --color-border:        rgba(255,255,255,0.08);
  --color-border-glow:   var(--biolum-teal);   /* used at low alpha for lit edges */

  /* text */
  --color-fg:            var(--ink-100);
  --color-fg-muted:      var(--ink-500);
  --color-fg-disabled:   var(--ink-700);
  --color-on-accent:     var(--ink-on-glow);

  /* brand roles */
  --color-primary:       var(--biolum-teal);   /* signature glow, primary UI */
  --color-secondary:     var(--biolum-cyan);
  --color-accent:        var(--biolum-amber);  /* CTAs: "Shrink me", "Collect", café */
  --color-success:       var(--biolum-lime);
  --color-destructive:   #FF5C6C;
  --color-ring:          var(--biolum-teal);   /* focus ring */

  /* zone accents — one hue per journey zone */
  --zone-entrance:  var(--biolum-teal);
  --zone-soil:      var(--biolum-lime);
  --zone-gut:       var(--biolum-magenta);
  --zone-waterways: var(--biolum-cyan);
  --zone-cafe:      var(--biolum-amber);
  --zone-keepers:   var(--biolum-violet);
}
```

**Colour rules**
- Neon hues are **light, not text**: use them for glow, borders, large display, UI glyphs (≥3:1)
  and interactive highlights. All reading copy uses `--color-fg` / `--color-fg-muted`.
- Functional colour is never colour‑alone: pair success/error/zone with an icon or label
  (`color-not-decorative-only`).
- Each zone tints its section (border‑glow, headline, particles) with its zone accent so the
  visitor always knows which habitat they're in — but the base stays `--color-bg` for continuity.
- Light mode is **out of scope**: this product is dark‑primary by design (Immersive pattern).

### 4.2 Typography

The brief asks for a **pixel** flavour; `CLAUDE.md` demands plain, readable, all‑ages prose. Both
are honoured by giving pixel a **specific job** (the arcade/shrink‑ray HUD voice) and keeping all
long‑form reading in a genuine text face. The skill offered *Press Start 2P + VT323* (pixel) and
*Exo + Roboto Mono* (science); we use pieces of both rather than either wholesale.

| Role | Font | Weight(s) | Where |
|------|------|-----------|-------|
| **Pixel display** | **Press Start 2P** | 400 | Hero wordmark, zone numbers, "SHRINK ME", passport counter, "SPECIMEN COLLECTED" ticker. Tiny doses only. |
| **Display / subhead** | **Exo 2** | 500–700 | Zone titles, species names, scientist names. Science‑futuristic, carries the research tone. |
| **Body** | **Nunito Sans** | 400 / 600 | All paragraphs, card descriptions, captions. Warm, rounded, highly legible for all ages. |
| **Terminal / mono** | **VT323** | 400 | Species‑card metadata (group · habitat · "what it does"), HUD labels, small system text. Pixel flavour where it stays readable. |

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Exo+2:wght@500;600;700&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=VT323&display=swap');

:root {
  --font-pixel:   'Press Start 2P', monospace;   /* never for body — wide, low legibility */
  --font-display: 'Exo 2', system-ui, sans-serif;
  --font-body:    'Nunito Sans', system-ui, sans-serif;
  --font-mono:    'VT323', monospace;
}
```

**Type scale** (rem, base 16px, ~1.25 major‑third for display; body stays a comfortable measure)
| Token | Size | Line‑height | Typical use |
|-------|------|-------------|-------------|
| `--text-pixel-hero` | clamp(1.75rem, 6vw, 3.5rem) | 1.3 | Hero pixel wordmark (Press Start 2P runs large/wide — size down, never up) |
| `--text-pixel-label`| 0.625rem (10px) | 1.4 | HUD/counter pixel labels; letter‑spacing 0 |
| `--text-display-xl` | clamp(2rem, 5vw, 3.25rem) | 1.1 | Zone titles (Exo 2) |
| `--text-display-lg` | 1.75rem | 1.15 | Section headings |
| `--text-display-md` | 1.25rem | 1.25 | Species / scientist names |
| `--text-body-lg` | 1.125rem | 1.6 | Lead paragraphs |
| `--text-body` | 1rem (16px min) | 1.6 | Default body |
| `--text-body-sm` | 0.875rem | 1.55 | Captions, footnotes |
| `--text-mono` | 1rem (VT323 reads small — keep ≥16px) | 1.4 | Card meta, terminal labels |

**Type rules**
- Body ≥ 16px, line‑height 1.5–1.75, measure 60–75ch desktop / 35–60ch mobile.
- Weight carries hierarchy: display 600–700, body 400, labels 600.
- Pixel and terminal faces are decorative voices — keep them to short strings; never set a
  paragraph in Press Start 2P or VT323.
- `font-display: swap`; preload only Nunito Sans (the reading face). Pixel/display fonts load
  non‑blocking.

### 4.3 Spacing

4px base unit, 8px rhythm — a single scale for padding, gaps and section spacing.

```css
:root {
  --space-0: 0;      --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;   --space-5: 24px;  --space-6: 32px;  --space-7: 48px;
  --space-8: 64px;   --space-9: 96px;  --space-10:128px;
  /* radii */
  --radius-sm: 8px;  --radius-md: 14px; --radius-lg: 22px; --radius-pill: 999px;
  /* layout */
  --container-max: 72rem;        /* ~1152px reading/content cap */
  --gutter: clamp(16px, 5vw, 48px);
}
```
- **Vertical rhythm tiers:** inline 8/16, component 16/24, section 64/96/128. Full‑height zones use
  `min-height: 100dvh` (not `100vh`).
- **Breakpoints:** 375 / 768 / 1024 / 1440. Mobile‑first; no horizontal scroll; never disable zoom.
- Cards and glass panels: `--radius-lg`; buttons/pills: `--radius-pill`; species‑card tags:
  `--radius-sm`.

### 4.4 Depth, glow & effects

The "bioluminescent" look lives in shadows and borders, not fills.
```css
:root {
  --glow-sm: 0 0 12px var(--biolum-teal-glow);
  --glow-md: 0 0 24px var(--biolum-teal-glow);
  --glow-lg: 0 0 48px var(--biolum-teal-glow);      /* swap the hue per zone/microbe */
  --shadow-card: 0 8px 32px rgba(0,0,0,0.45);
  --glass-bg: rgba(18,24,41,0.55);                  /* --abyss-700 @ 55% */
  --glass-blur: blur(16px) saturate(140%);
  --scrim: rgba(5,7,15,0.6);                        /* modal/card backdrop, 60% */
}
```
- Interactive/lit elements carry a coloured glow in their zone/microbe hue; resting elements do not
  (glow signals "alive / interactive").
- Glassmorphism for HUD, passport and species cards (frosted `--glass-bg` + `--glass-blur`), used to
  indicate a floating layer above the scene — not as blanket decoration.
- Ambient particle/spore fields are low‑opacity and slow; they must never sit behind text at a
  contrast‑reducing opacity.

### 4.5 Component tokens (starter)

```css
:root {
  /* primary button — e.g. "Shrink me", "Collect" */
  --btn-primary-bg: var(--color-accent);
  --btn-primary-fg: var(--color-on-accent);
  --btn-primary-glow: var(--glow-md);          /* amber glow */
  --btn-primary-bg-hover: #FFC46B;
  --btn-primary-scale-press: 0.97;

  /* ghost/secondary button */
  --btn-ghost-fg: var(--color-fg);
  --btn-ghost-border: var(--color-border);
  --btn-ghost-border-hover: var(--color-primary);

  /* species card */
  --card-bg: var(--glass-bg);
  --card-border: 1px solid var(--color-border);
  --card-radius: var(--radius-lg);
  --card-glow-hover: var(--glow-lg);           /* recolour to the microbe's group hue */
  --card-meta-font: var(--font-mono);
  --card-title-font: var(--font-display);

  /* passport / HUD counter */
  --hud-font: var(--font-pixel);
  --hud-fg: var(--biolum-teal);
  --hud-bg: var(--glass-bg);

  /* focus ring — accessibility, always visible */
  --focus-ring: 0 0 0 3px var(--color-ring);
}
```

Component state pattern:
| Property | Default | Hover | Active/Press | Disabled |
|----------|---------|-------|--------------|----------|
| Primary bg | `--color-accent` | `--btn-primary-bg-hover` | same + scale 0.97 | `--abyss-600` |
| Primary fg | `--color-on-accent` | `--color-on-accent` | `--color-on-accent` | `--ink-700` |
| Glow | `--glow-md` | `--glow-lg` | `--glow-sm` | none |
| Focus | — | — | — | `--focus-ring` on keyboard focus (all states) |

---

## 5. Motion language

Confirmed tier from the skill: **Complex** (immersive) with a global rhythm. Motion is meaning,
never decoration; one to two key elements move per view.

### 5.1 Tokens
```css
:root {
  --ease-biolum: cubic-bezier(0.16, 1, 0.3, 1);  /* expo.out — the house easing */
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);  /* exits */
  --dur-micro:   180ms;   /* hovers, taps, toggles (150–300ms) */
  --dur-reveal:  520ms;   /* section/element reveals (≤ ~600ms) */
  --dur-exit:    340ms;   /* ~65% of reveal — exits feel snappier */
  --dur-shrink:  800ms;   /* the signature shrink transition */
  --spring: { damping: 20, stiffness: 90 };       /* Framer Motion modals/cards */
}
```

### 5.2 Tiers (how reveals *feel*)
1. **Ambient (always on):** slow drifting spores/particles and gentle glow pulses. Barely‑there,
   loops, no scroll dependency. This is the "living zoo" heartbeat.
2. **Shrink (signature, entrance only):** the visitor is "shrunk" — a scale/zoom transition
   (`scale` + blur pull) on entry, `--dur-shrink`, `--ease-biolum`. Under reduced‑motion this
   becomes a simple cross‑fade.
3. **Reveal (per zone, scroll‑driven):** GSAP ScrollTrigger. Descend a tunnel → layers parallax and
   headlines/cards stagger in. Scrub‑tied where it reads as travel; `toggleActions:
   'play none none reverse'` for enter‑reveals. **Pin at most 1–2 zones** — over‑pinning fights
   mobile scroll. Stagger children 0.06–0.08s, max ~8 at a time.
4. **Micro (interaction):** hover glow bloom, press scale 0.97→1.0, card open (scale+fade from its
   trigger for spatial context), passport counter tick. All `--dur-micro`, `--ease-biolum`.

### 5.3 Rules
- `transform`/`opacity` only — never animate width/height/top/left (no CLS, 60fps).
- Enter with ease‑out (`--ease-biolum`), exit with ease‑in, exits ~65% of enter duration.
- Every animation must be interruptible; never block input during motion.
- Headline character‑splits (SplitText) are optional flourish only — SplitText is a paid GSAP
  plugin, so **ship a plain fade fallback** and never split more than a short headline.
- Recalc `ScrollTrigger.refresh()` after images/fonts load; scope triggers to their section.

### 5.4 Reduced motion (required)
`@media (prefers-reduced-motion: reduce)`:
- Shrink transition → cross‑fade. Scroll‑scrub reveals → static, or a short opacity fade on enter.
- Ambient particles paused (or removed). Parallax disabled. No auto‑playing loops.
- Nothing that conveys information may depend on motion; content is fully readable at rest.

---

## 6. Reconciliation log (skill ↔ brief)

What the `ui-ux-pro-max --design-system` engine returned, and what we did with it:

| Dimension | Skill said | Decision |
|-----------|-----------|----------|
| **Pattern** | Immersive / Interactive Experience — dark bg, highlight interactive, guided tour, skip option, CTA after completion | **Kept wholesale.** It's our scroll journey. Adds the requirement for a **skip/"jump to zone"** affordance and a CTA after the tour. |
| **Style** | Modern Dark (Cinema Mobile) — cinematic, ambient light, glassmorphism, glow, blur, atmospheric; *avoid pure `#000`* | **Kept.** Drives §4.4. Honoured the `#000` warning (`--abyss-900` = `#05070F`). |
| **Palette** | A *light* science‑green scheme (`#15803D` on `#F0FDF4`) | **Overridden.** Our brief is dark‑bioluminescent, so the green became `--biolum-teal` (kept as signature, and it echoes the real Microbe Zoo teal), the background flipped to `--abyss` indigo‑black, and cyan/magenta/violet/amber glows were added from the installation's actual lighting and the four microbe groups. Amber CTA (`#D97706`→`#FFB347`) retained from the skill's accent. |
| **Typography** | *Exo + Roboto Mono* (science) as default; *Press Start 2P + VT323* (pixel) available | **Blended.** Exo 2 kept as display/subhead; pixel promoted to the HUD/hero voice per the user's "something like pixel"; Nunito Sans added for genuinely readable body (accessibility + `CLAUDE.md` prose mandate); VT323 kept for small terminal labels. |
| **Motion** | Complex tier — expo.out, Flip page transitions 500–800ms, spring modals, scrub reveals, scale‑press 0.97 | **Kept**, mapped to §5. The 500–800ms Flip window became our `--dur-shrink` (800ms) signature. Added mandatory reduced‑motion fallbacks. |
| **Anti‑patterns** | Cluttered layout; no offline access; emoji‑as‑icons; removing focus rings; neon accents unchecked for contrast | **Adopted as guardrails:** SVG icons only; visible focus ring always; neon = light/large only, never body text; bite‑sized content (GoodBelly) to avoid clutter. |

---

## 7. Accessibility & QA checklist (per token set)

- [ ] Body text ≥ 16px, contrast ≥ 4.5:1 (`--ink-100`/`--ink-500` on `--abyss` verified AA).
- [ ] Neon hues used only for large text/UI glyphs (≥3:1), glow, and decoration — never body copy.
- [ ] Every focusable element shows `--focus-ring`; keyboard order matches visual order.
- [ ] `prefers-reduced-motion` fully implemented (§5.4); content readable with motion off.
- [ ] Colour never the sole signal (zone/success/error also carry icon or label).
- [ ] Alt text on all meaningful visuals; captions/toggle for any audio (v2 soundscapes muted by default).
- [ ] Responsive at 375 / 768 / 1024 / 1440; no horizontal scroll; zoom not disabled.
- [ ] Icons are SVG (Lucide/Heroicons), consistent stroke, no emoji.
- [ ] British English in all copy (colour, behaviour, programme).
- [ ] No `localStorage`/`sessionStorage`; passport counter is in‑memory React state only.

---

*Fonts: Press Start 2P, Exo 2, Nunito Sans, VT323 (Google Fonts, open licence). Palette and motion
adapted from the ui‑ux‑pro‑max design‑system engine and the referenced Gut Zoomer / GoodBelly
blueprints. A fan‑made tribute to the Microbe Zoo by the Centre for Microbial Interactions & SAW
Trust, Norwich Research Park.*
