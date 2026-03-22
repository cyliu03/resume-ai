import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // 支持 Vercel 部署
  base: '/',
  // 本地开发代理配置（解决 CORS 问题）
  server: {
    proxy: {
      // 阿里云 Coding Plan 代理
      '/api/coding-dashscope': {
        target: 'https://coding.dashscope.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coding-dashscope/, '/v1'),
      },
      // 阿里云通义千问代理
      '/api/dashscope': {
        target: 'https://dashscope.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dashscope/, '/compatible-mode/v1'),
      },
    },
  },
})