import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On GitHub Pages the site is served from /<repo>/, so the CI build sets
// GITHUB_PAGES=true to switch the base path. Local dev and Vercel use '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/Microbia/' : '/',
});
