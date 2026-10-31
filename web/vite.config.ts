import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // O Three.js sozinho passa de 700 kB e não tem como dividir; o limite
    // fica logo acima dele, para avisar se outro pedaço crescer demais.
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        // As bibliotecas em pedaços próprios, que mudam pouco e ficam no cache
        // entre um deploy e outro.
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\\/]three[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|zustand)[\\/]/ },
          ],
        },
      },
    },
  },
})
