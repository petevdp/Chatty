var path = require('path');
var webpack = require('webpack');

const CLIENT_DIR = path.join(__dirname, '');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    path.join(CLIENT_DIR, 'index.jsx')
  ],
  output: {
    path: path.join(CLIENT_DIR, 'dist'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: {
          loader: "babel-loader"
        },
        include: path.join(CLIENT_DIR, 'src')
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
};