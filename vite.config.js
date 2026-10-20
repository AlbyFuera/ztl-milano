import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'ZTL Milano',
        short_name: 'ZTL Milano',
        description: 'Area C, Area B e ZTL di Milano: orari, mappa, multe e assistente.',
        lang: 'it',
        start_url: '/#/adesso',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f5f5f7',
        theme_color: '#f5f5f7',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Chiedi', url: '/#/chiedi', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Mappa', url: '/#/mappa', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,geojson,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\//,
            handler: 'CacheFirst',
            options: { cacheName: 'tiles', expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
      },
    }),
  ],
  test: { include: ['tests/unit/**/*.test.js'] },
});
