import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que el servidor sea accesible en red local/contenedores
    // Eliminamos 'port: 3000' fijo para que Vercel/Bolt asignen el puerto disponible automáticamente
  }
})