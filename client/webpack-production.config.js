/* eslint quote-props: "off" */
const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack-shared.config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(shared, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new UglifyJSPlugin(),
  ],
});