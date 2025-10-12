import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: 'index.html',
        services: 'services.html',
        about: 'about.html',
        locations: 'locations.html',
        contact: 'contact.html',
      },
      output: {
        manualChunks: {
          vendor: ['bootstrap'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  preview: {
    port: 3000,
  },
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default',
        }),
      ],
    },
  },
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'RGR Logistics Ltd - Logistics Expert',
          description: 'Professional bonded warehouse, depot, clearing and forwarding services. Recognized by Uganda Revenue Authority for excellence.',
        },
      },
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdnjs-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      manifest: {
        name: 'RGR Logistics Ltd',
        short_name: 'RGR Logistics',
        description: 'Professional logistics services in Uganda',
        theme_color: '#1e3c72',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/assets/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/assets/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/assets/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/assets/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/assets/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: '/assets/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/assets/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ['bootstrap'],
  },
});
