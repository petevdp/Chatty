const merge = require('webpack-merge');
const common = require('./webpack.client.common.js');
const webpack = require('webpack');
const path = require('path');
const { CLIENT } = require('../constants');

module.exports = merge(common, {
  entry: {
    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', path.join(CLIENT, 'index.js')],
  },
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});