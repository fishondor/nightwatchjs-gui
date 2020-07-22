module.exports = {
  devServer: {
    port: 4200,
    proxy: 'http://localhost:8080'
  },
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.md$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },
}