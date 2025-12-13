import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 必须与你的仓库名称完全一致，前后都要有斜杠
  base: '/PE-Magic-Keyword/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  // 移除 define 部分，因为 GitHub Actions 中的 env 只要以 VITE_ 开头
  // Vite 在构建时会自动注入到 import.meta.env 中
})
