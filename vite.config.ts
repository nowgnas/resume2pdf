import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시: '/저장소이름/' 으로 변경
  // Vercel/Netlify 배포 시: '/' (기본값) 그대로 유지
  base: '/',
})
