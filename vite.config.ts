import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode, command, isPreview }) => {
  const pages = mode === 'pages'
  const base = pages ? '/construction-estimate-frontend/' : '/'

  return {
    base,
    server: {
      host: '0.0.0.0',
      port: 3000,
      https: command === 'serve' && !isPreview ? {
        key: readFileSync(new URL('./certs/cert.key', import.meta.url)),
        cert: readFileSync(new URL('./certs/cert.crt', import.meta.url)),
      } : undefined,
      fs: { deny: ['.env', '.env.*', '*.{crt,pem,key}', '**/.git/**', '**/certs/**'] },
      proxy: {
        '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
        '/minio': {
          target: 'http://127.0.0.1:9000',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/minio/, ''),
        },
      },
    },
    preview: { host: 'localhost', proxy: {} },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: 'Справочник строительных работ',
          lang: 'ru',
          short_name: 'Справочник',
          start_url: base,
          scope: base,
          display: 'standalone',
          orientation: 'portrait-primary',
          background_color: '#F1F2F3',
          theme_color: '#38393D',
          icons: [192, 512].map(size => ({
            src: `logo${size}.png`, sizes: `${size}x${size}`, type: 'image/png',
          })),
        },
        workbox: {
          globPatterns: ['**/*.{html,js,css,png,jpg,svg,mp4}'],
          navigateFallbackDenylist: [/^\/api\//, /^\/minio\//],
        },
      }),
    ],
  }
})
