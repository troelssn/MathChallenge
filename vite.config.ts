import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /MathChallenge/.
export default defineConfig({
  base: '/MathChallenge/',
  plugins: [react()],
})
