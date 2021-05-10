// this webpack configuration is only used for the playground test site with yarn start
const path = require('path')

module.exports = {
  entry: {
    bundle: './example/src/index.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'example/public')
  },

  devServer: {
    contentBase: './example/public',
    watchContentBase: true
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{ loader: 'babel-loader' }]
      }
    ]
  }
}