import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  
  // GitHub Pages configuration
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: '/_nuxt/',
  },
  
  // Static site generation
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-lucide-icons",
    "@nuxt/ui",
    "nuxt-svgo",
  ],
  plugins: ["~/plugins/solana-wallets-vue", "~/plugins/vue-query"],
  css: ["assets/css/main.css"],
  
  vite: {
    // plugins: [tailwindcss()],
    server: {
      // Вариант 1: Отключить HMR полностью
      // hmr: false,
      
      // Вариант 2: Настроить debounce (задержка перед обновлением)
      watch: {
        // Задержка перед обновлением в миллисекундах (по умолчанию ~100ms)
        interval: 10000, // Увеличить до 500ms для уменьшения частоты обновлений
      },
      
      // Вариант 3: Отключить overlay с ошибками, но оставить HMR
      // hmr: {
      //   overlay: false,
      // },
    },
  },

  fonts: {
    families: [
      {
        name: "Tactic Sans",
        provider: "local",
        weights: ["100", "300", "400", "500", "700", "800", "900"],
      },
      {
        name: "Rajdhani",
        provider: "google",
        weights: ["100", "300", "400", "500", "700", "800", "900"],
      },
      {
        name: "Chakra Petch",
        provider: "google",
        weights: ["300", "400", "500", "600", "700"],
      },
    ],
  },

  runtimeConfig: {
    public: {
      rpcUrl: process.env.NUXT_PUBLIC_RPC_URL || "https://mainnet.helius-rpc.com/?api-key=c58a71ef-fe93-49e1-b969-dcf66b0d3cd2",
      commitment: process.env.NUXT_PUBLIC_COMMITMENT || "confirmed",
    },
  },
});
