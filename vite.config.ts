import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If deploying to GitHub Pages instead of Vercel, set base to '/Microbia/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
