const { merge } = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true, // minify CSS
            },
          }],
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // need this to get rid of react-dom and only keep react-dom-production
      // https://stackoverflow.com/questions/48176767/webpack-bundle-analyzer-shows-webpack-p-does-not-remove-development-dependency
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {},
      },
    }),
  ],
});
