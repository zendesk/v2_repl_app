/* eslint-env node */
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    app: ['./src/javascripts/index.js', './src/stylesheets/app.scss']
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(handlebars|hd?bs)$/,
        loader: 'handlebars-loader',
        query: {
          extensions: ['handlebars', 'hdbs', 'hbs'],
          runtime: 'handlebars'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'postcss-loader'
        ]
      }
    ]
  },

  externals: {
    handlebars: 'Handlebars',
    jquery: 'jQuery',
    lodash: '_',
    moment: 'moment',
    zendesk_app_framework_sdk: 'ZAFClient'
  },

  plugins: [
    // Empties the dist folder
    new CleanWebpackPlugin(),

    // Copy over some files
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '../', flatten: true },
      { from: 'src/templates/*', to: '.', flatten: true },
      // zendesk chat image assets
      { from: 'src/images/logo-small.png', to: './chat', flatten: true },
      { from: 'src/images/logo.png', to: './chat', flatten: true },
      // zendesk support image assets
      { from: 'src/images/*', to: './support', flatten: true },
      // copy translations/en.json
      { from: 'src/translations', to: '../translations', flatten: true }
    ]),

    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ]
};
