const path = require('path');
const webpack = require('webpack');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const {
  ROOT,
  SRC,
  DIST,
  CLIENT,
} = require('../constants')

module.exports = {
  entry: {
    main: path.join(CLIENT, 'index.js'),
  },
  output: {
    path: DIST,
    filename: 'bundle.js',
    publicPath: '/',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        include: CLIENT,
        exclude: /node-modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(CLIENT, 'index.html'),
      filename: 'index.html',
      excludeChunks: ['server']
    })
  ]
};
