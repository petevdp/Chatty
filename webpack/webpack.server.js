const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const { SRC, ROOT, DIST } = require('../constants')
module.exports = (env, argv) => {
  return ({
    entry: {
      server: path.join(SRC, 'server/server.js'),
    },
    output: {
      path: DIST,
      publicPath: '/',
      filename: '[name].js'
    },
    target: 'node',
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false,   // if you don't put this is, __dirname
      __filename: false,  // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
      rules: [
        {
          // Transpiles ES6-8 into ES5
          test: /\.js$/,
          exclude: [/node_modules/, /client/],
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
  });
}