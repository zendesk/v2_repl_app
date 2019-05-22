/* eslint-env node */

// var webpack = require('webpack');
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  progress: true,
  entry: {
    app: ['./src/javascripts/index.js', './src/stylesheets/app.scss']
  },
  output: {
    path: './dist/assets',
    filename: 'main.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      /*{
        test: /\.scss$/,
        loader: extractStyles.extract("style", ["css?sourceMap", "sass?sourceMap"])
      }
      ,*/
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(handlebars|hd?bs)$/,
        loader: 'handlebars-loader',
        query: {
          extensions: ['handlebars', 'hdbs', 'hbs'],
          runtime: 'handlebars'
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  externals: {
    handlebars: 'Handlebars',
    jquery: 'jQuery',
    lodash: '_',
    moment: 'moment',
    zendesk_app_framework_sdk: 'ZAFClient'
  },
  devtool: 'source-map',
  plugins: [
    // Empties the dist folder
    new CleanWebpackPlugin(['dist/*']),

    // Copy over some files
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '../', flatten: true },
      { from: 'src/images/*', to: '.', flatten: true },
      { from: 'src/templates/*', to: '.', flatten: true }
    ])
  ]
};
