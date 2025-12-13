import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/PE-Magic-Keyword/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  // 删除或简化 define 配置
  // Vite 会自动处理 import.meta.env.VITE_* 变量
})
