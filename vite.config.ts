import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    watch: {}
  },
  server: {
    hmr: {
      host: "localhost",
      //port: 9000,
      protocol: "ws",
    },
  },
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Write',
      short_name: 'Write',
      description: '',
      theme_color: '#000000',
      background_color: '#000000',
      "icons": [
        {
            "src": "/favicon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable any"
        },
        {
            "src": "/favicon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
      ],
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      navigateFallbackDenylist: [/^\/login.*/, /^\/logout/],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: false,
      type: 'module',
    },
  })],
})