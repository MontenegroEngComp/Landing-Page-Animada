import { defineConfig } from 'vite';

export default defineConfig({
  // Caminhos relativos para funcionar em qualquer subpasta (ex.: GitHub Pages)
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
