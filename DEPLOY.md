# Deploying Microbia

The site is a static Vite build (`npm run build` → `dist/`). Two free options.

## Option A — GitHub Pages (automated, set up in this repo)

A workflow at `.github/workflows/deploy.yml` builds and publishes on every push to
`main` or the working branch, so changes go live automatically.

**One-time setup by the repo owner:**

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. If deploying from a non-default branch, allow it under
   **Settings → Environments → github-pages → Deployment branches** (add the working branch,
   or set to "All branches").
3. Push, or run the workflow from the **Actions** tab (`workflow_dispatch`).

Live URL: **https://taymuur.github.io/Microbia/**

The Pages base path (`/Microbia/`) is applied automatically in CI via the `GITHUB_PAGES`
env var (see `vite.config.ts`); local `npm run dev` stays at `/`.

> Note: GitHub Pages needs a **public** repo (or a paid plan for private). If the Actions
> run fails at the deploy step, check the two settings above first.

## Option B — Vercel (primary, per the brief)

1. Push the repo to GitHub.
2. On Vercel, **Add New → Project → Import** this repo.
3. Framework preset **Vite** is detected. Build command `npm run build`, output `dist`.
4. Deploy. Vercel gives a live URL and redeploys on every push (including PR previews).

No base-path change is needed for Vercel (it serves from `/`).

## Local preview of the production build

```bash
npm run build
npm run preview
```
