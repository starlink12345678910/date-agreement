import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// ⚠️ IMPORTANT for GitHub Pages:
// `base` MUST match your repository name so asset links resolve correctly.
// If your repo is github.com/<you>/date-agreement  ->  base = '/date-agreement/'
// If you rename the repo, change the value below to '/<your-repo-name>/'.
// For a custom domain or a <user>.github.io root repo, set base = '/'.
const REPO_NAME = 'date-agreement'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Приглашение на свидание',
        short_name: 'Свидание',
        description: 'Особое приглашение ❤️',
        lang: 'ru',
        theme_color: '#ff5d8f',
        background_color: '#fff6ec',
        display: 'standalone',
        orientation: 'portrait',
        // scope/start_url are resolved against `base` automatically
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: null,
      },
    }),
  ],
})
