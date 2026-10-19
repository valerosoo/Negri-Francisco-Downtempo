import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // VenueMap se carga con React.lazy (pesa ~1MB por three.js). Sin esto,
  // la primera vez que el navegador lo pide en dev, Vite recién ahí
  // descubre y optimiza three/@react-three/*, y la recarga automática que
  // dispara ese proceso puede dejar un instante con dos copias de React
  // cargadas ("Invalid hook call"). Precompilándolas desde el arranque se
  // evita ese hueco.
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
})
