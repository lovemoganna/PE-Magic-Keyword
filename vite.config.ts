import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/PE-Magic-Keyword/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // 添加源码映射便于调试
  },
  server: {
    port: 3000,
  },
  define: {
    // 确保环境变量正确传递
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || ''),
  }
})
