import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true, // Ensures Vite does not auto-switch ports
    hmr: {
      overlay: true, // Enables hot reload errors in the browser
    },
  },
  plugins: [react(),tailwindcss()],
  resolve: {
    extensions: [".js", ".jsx"], // Ensures JSX is recognized
  },
});

