import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Treat .glb files as static assets so Vite won't try to parse them as JS
  assetsInclude: ['**/*.glb'],
})
