/* eslint quote-props: "off" */
const webpack = require('webpack');
const merge = require('webpack-merge');
const shared = require('./webpack-shared.config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
});

module.exports = merge(shared, {
  output: {
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[hash:8]',
                minimize: true,
              },
            },
            { loader: 'sass-loader' },
          ],
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new ManifestPlugin(),
    extractCSS,
    new UglifyJSPlugin(),
  ],
});
