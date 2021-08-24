module.exports = {
  lintOnSave: false,

  transpileDependencies: [
    'vuetify',
    'quasar'
  ],

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
}
