export default {
  head: {
    title: 'vue2-select',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap' },
    ]
  },

  css: [
    '~assets/scss/main.scss'
  ],

  styleResources: {
    scss: [
      '~/assets/scss/variables.scss',
      '~/assets/scss/mixins/index.scss',
      '~/assets/scss/vendors/smart-grid.scss'
    ]
  },

  plugins: [
  ],

  components: true,

  buildModules: [
  ],

  modules: [
    '@nuxtjs/style-resources'
  ],

  build: {
  }
}
