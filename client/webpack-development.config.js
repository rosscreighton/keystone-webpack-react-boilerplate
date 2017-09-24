const merge = require('webpack-merge');
const shared = require('./webpack-shared.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(shared, {
  output: {
    filename: '[name].js',
  },
  devServer: {
    port: 4000,
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        bypass(req) {
          const isWebpackAsset = req.path.search(/\.js/) > -1;
          const isKeystoneRequest = req.path.search(/keystone/) > -1;

          if (isWebpackAsset && !isKeystoneRequest) {
            // if this req is meant for devServer, fufill it
            return req.path;
          }
          // else, let the req fall through to backend
          return false;
        },
      },
    },
  },
  devtool: 'eval-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
});
