import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  server: {
    port: 3000, 
    strictPort: true, // Prevents auto-switching ports
    hmr: 
      // clientPort: 3000, // Forces WebSocket to use the same port
      false,
     
  },
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx"],  // Ensure JSX is recognized
  },
})
