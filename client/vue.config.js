module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: '',
          changeOrigin: true
        },
      }
    }
  }