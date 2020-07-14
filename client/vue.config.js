module.exports = {
  devServer: {
    port: 4200,
    proxy: 'http://localhost:8080'
  },
  "transpileDependencies": [
    "vuetify"
  ]
}