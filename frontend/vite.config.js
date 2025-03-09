import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true, // Ensures Vite does not auto-switch ports
    hmr: {
      overlay: true, // Enables hot reload errors in the browser
    },
  },
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx"], // Ensures JSX is recognized
  },
  css: {
    postcss: "./postcss.config.js", // Ensures Tailwind is correctly loaded
  },
});

