import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/Karak-OS/",   // <--- ADD THIS LINE
  plugins: [react()],
})
