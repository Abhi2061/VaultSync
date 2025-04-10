import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'VaultSync',
        short_name: 'VaultSync',
        description: 'Secure password manager',
        theme_color: '#0d1117',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'VaultSync_logo.png',
            sizes: '395x395',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
