import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: "http://localhost:3000", // Firebase Hosting 的 URL
        secure: false, // Firebase Hosting 是 https，因此設為 true
        // target: "https://rossen-hua.onrender.com/", 
        // secure: true, // Firebase Hosting 是 https，因此設為 true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
