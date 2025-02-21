import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import autoprefixer from 'autoprefixer';
import faviconPlugin from "vite-plugin-favicon";



export default defineConfig({
  plugins: [eslint(), faviconPlugin('public/favicon.png')],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
});
