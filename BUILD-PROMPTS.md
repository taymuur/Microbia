# BUILD-PROMPTS.md — running order for Claude Code (Fable 5)

Run these in order, one at a time. Commit to git between each step (`git add -A && git commit -m "..."`)
so you can roll back a bad pass. `CLAUDE.md` is loaded automatically each session — you don't
need to paste its content into prompts.

---

## Step 0 — Setup (do this yourself, outside Claude Code)

```bash
# create + clone the repo first (GitHub), then:
cd microbia
git init  # if not already
```

In Claude Code, select the model: **Fable 5** (via the model picker / `/model`).
Then install the design skills:

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

(The Anthropic frontend-design skill auto-invokes on frontend work; add it as a plugin too if
you want it explicit.)

---

## Step 1 — Design extraction (this is Level 7)

Pick ONE immersive reference site you love (browse awwwards.com / godly.website / land-book.com —
look for dark, scroll-driven, nature/organic). Then:

> Read CLAUDE.md so you understand the project. I'm doing a Level-7 design extraction.
> Reference site I admire: <PASTE URL>.
> Fetch it and extract a reusable **design blueprint** — don't clone it, learn from it.
> Produce `src/design-system.md` capturing: colour palette (with hex + roles), typography
> (display + body pairing, scale, weights), spacing system, the motion language (easing,
> durations, how reveals feel), and the overall mood in 3 sentences.
> Then adapt it to OUR brief: a dark, bioluminescent, "shrunk into the microscopic world"
> immersive zoo. Use the ui-ux-pro-max skill (`--design-system`) to sanity-check palette,
> font pairing and motion tier for an "immersive science / nature" product, and reconcile
> the two into one token set. Output design-system.md only — no app code yet.

Review `design-system.md`. Push back on anything generic before moving on.

---

## Step 2 — Scaffold

> Scaffold the project per CLAUDE.md's tech stack: Vite + React + TypeScript + Tailwind,
> GSAP + ScrollTrigger, Framer Motion. Wire Tailwind to the tokens in design-system.md.
> Create the folder structure from CLAUDE.md. Build a `data/microbes.ts` file populated with
> the microbe cast and species-card content from CLAUDE.md's Content section — accurate copy,
> British English, no invented facts. Add a minimal running App that renders a placeholder for
> each of the six zones in scroll order. Get `npm run dev` working. Don't style deeply yet.

---

## Step 3 — Shrink intro + scroll shell

> Build the Entrance "Shrink Ray" hero and the scroll shell that carries the visitor down
> through the zones. The intro should give a real sense of being shrunk to microscopic scale
> (scale/zoom transition, GSAP). Under `prefers-reduced-motion`, replace it with a clean fade.
> Add a fixed, subtle "microbes collected" passport counter (in-memory React state only, no
> localStorage). Make the whole thing feel like a single descending journey. Mobile first,
> then desktop.

---

## Step 4 — Build the zones (do these ONE AT A TIME)

Repeat this prompt for each zone: Soil → Gut → Waterways → Café & Gift Shop.

> Build the **<ZONE NAME>** zone using the content and research threads for it in CLAUDE.md.
> Give it its own distinct microbial environment (colour, texture, sound-ready). Use GSAP
> ScrollTrigger for the reveals; keep it accurate and readable. Include the species cards for
> the microbes that live here (clickable → card opens, "collect" increments the passport).
> Keep copy plain, British English, factual. Show me the zone before moving to the next.

For the Gut zone, remind it: two threads — **phages (Quadram, Revathy & Arezoo)** and the
**gut–brain / dementia blood-test work (Dr David Vazour, UEA)**.

---

## Step 5 — Meet the Zookeepers

> Build the "Meet the Zookeepers" section from CLAUDE.md: the real scientists and their work,
> including the Sainsbury Laboratory wheat-blast / Field Pathogenomics / OpenWheatBlast thread
> and the Earlham Institute protist single-cell genomics thread. Present each as a "zookeeper"
> profile tied to the zone their microbes live in. Then build the About/footer with the full
> credits and sponsors block from CLAUDE.md.

---

## Step 6 — Polish, accessibility, performance

> Full accessibility + polish pass. Verify: prefers-reduced-motion is honoured everywhere,
> keyboard navigation reaches every interactive element, alt text on meaningful visuals,
> AA contrast, focus states visible. Then a performance pass: lazy-load heavy zones, check the
> scroll journey stays smooth on mobile, no layout shift. Fix anything that reads as generic
> "AI template" using the frontend-design and ui-ux-pro-max skills. Give me a short report of
> what you changed.

---

## Step 7 — Deploy (free)

> Prepare for deployment. Create a production build and confirm it works. Write a short
> DEPLOY.md with exact steps for Vercel (primary), and note the Vite `base` tweak needed if I
> use GitHub Pages instead. Don't deploy for me — just get it build-ready and document it.

Then, yourself: push to GitHub → import the repo on Vercel → it gives you a live URL.

---

## v2 backlog (after v1 is live)

- Zone soundscapes with Howler (muted by default, clear toggle).
- Mini-games: "feed the microbiome", "match microbe to habitat", "phage vs. resistant bacteria".
- Generated/illustrated microbe art (OpenArt or SVG) to replace placeholders.
- Optional: pull live NRP/CMI news into a small "latest research" strip (Firecrawl).

## Tips

- One zone per prompt. Big "one-shot the whole app" prompts drift; small passes + commits win.
- If a pass goes wrong, `git reset --hard HEAD` and re-prompt more specifically.
- Ask Fable 5 to *show you the result and wait* before it barrels into the next section.
