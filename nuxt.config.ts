// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts'],
  fonts: {
    families: [
      {
        name: 'Poppins',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
      },
    ],
  },
  nitro: {
    externals: {
      inline: ['@prisma/client'],
    },
  },
  alias: {
    '@': fileURLToPath(new URL('./server', import.meta.url)),
  },
})