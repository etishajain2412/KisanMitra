import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    port: 3000, 
    strictPort: true, // Prevents auto-switching ports
    hmr: 
      // clientPort: 3000, // Forces WebSocket to use the same port
      false,
     
  },
<<<<<<< HEAD
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx"],  // Ensure JSX is recognized
  },
=======
  plugins: [react(), tailwindcss(),],
>>>>>>> bb017d1b60595cc9d457ee8d65a9ec0c611ed127
})
