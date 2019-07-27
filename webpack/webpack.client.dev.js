const merge = require('webpack-merge');
const common = require('./webpack.client.common.js');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});