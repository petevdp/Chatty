const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const CLIENT_DIR = path.join(__dirname, '');

module.exports = {
  devtool: 'eval',
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './client/src/index.jsx'
  ],
  output: {
    path: path.join(CLIENT_DIR, 'dist'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(CLIENT_DIR, 'src')
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
  ]
};