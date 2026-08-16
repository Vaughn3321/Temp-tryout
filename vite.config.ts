import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this project from /Temp-tryout/, not /. Local dev
  // and other hosts (Vercel, Netlify, ...) stay at / unless GITHUB_PAGES is set.
  base: process.env.GITHUB_PAGES ? '/Temp-tryout/' : '/',
  server: {
    host: true,
  },
})
