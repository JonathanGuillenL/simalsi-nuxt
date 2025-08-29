// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils',
    'nuxt-echarts',
  ],
  echarts: {
    renderer: 'canvas',
    charts: ['PieChart', 'BarChart', 'MapChart'],
    components: ['VisualMapComponent', 'GridComponent', 'TitleComponent', 'TooltipComponent', 'LegendComponent']
  }
})
