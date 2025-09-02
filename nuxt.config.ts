// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils',
    'vuetify-nuxt-module'
  ],
  runtimeConfig: {
    apiBase: '',
    oauth: {
      keycloak: {
        serverUrl: '',
        clientId: '',
        clientSecret: '',
        realm: ''
      }
    },
    public: {
      appBase: ''
    }
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              error: '#dc2626',
            },
          },
        }
      },
      icons: {
        defaultSet: 'fa'
      }
    }
  }
})
