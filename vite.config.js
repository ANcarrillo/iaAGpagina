import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy: el navegador llama a localhost:5173/api/...
// Vite reenvía server-to-server a giecom.com.co/HorarioGenetico/api/...
// → el navegador nunca ve una petición cross-origin → sin CORS
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://giecom.com.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => '/HorarioGenetico' + path,
      },
    },
  },
})
