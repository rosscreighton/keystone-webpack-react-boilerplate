const merge = require('webpack-merge');
const shared = require('./webpack-shared.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(shared, {
  devtool: 'eval-source-map',
  watch: true,
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
});
