/* eslint-env node */
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
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
        loader: 'handlebars-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'sass-loader',
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
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist']
    }),

    // Copy over some files
    new CopyWebpackPlugin({
      patterns: [
        {from: 'src/manifest.json', to: '../'},
        {from: 'src/templates/*', to: '.'},
        // zendesk chat image assets
        {from: 'src/images/chat/*', to: './chat'},
        // zendesk sell image assets
        {from: 'src/images/sell/*', to: './sell'},
        {from: 'src/images/sell/icon.svg', to: './sell/icon_top_bar.svg'},
        // zendesk support marketplace assets
        {from: 'src/images/support/*.png', to: './support'},
        // zendesk support icons
        {from: 'src/images/support/icon.svg', to: './support/icon_nav_bar.svg'},
        {from: 'src/images/support/icon.svg', to: './support/icon_top_bar.svg'},
        {from: 'src/images/support/icon.svg', to: './support/icon_ticket_editor.svg'},
        // copy translations/en.json
        {from: 'src/translations/en.json', to: '../translations/en.json'}
      ]
    }),

    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ]
}
