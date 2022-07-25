const { merge } = require('webpack-merge');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.base.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: ['style-loader', 'css-loader', 'postcss-loader']
        // }),
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    port: 8086,
    historyApiFallback: {
      index: '/index.html',
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    ],
  },
});
