import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Inline (empty) PostCSS config so Vite never loads a leftover
// postcss.config.js / tailwind.config.js from the old site.
export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [] } },
});
