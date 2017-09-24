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
        bypass(req, res, proxyOptions) {
          if (req.path === '/') {
            return false;
          }
          return req.path;
        },
      },
    },
  },
  devtool: 'eval-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
});
