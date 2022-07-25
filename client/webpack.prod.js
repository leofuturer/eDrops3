const { merge } = require('webpack-merge');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: [{
        //     loader: 'css-loader',
        //     options: {
        //       minimize: true, // minify CSS
        //     },
        //   }],
        // }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // need this to get rid of react-dom and only keep react-dom-production
      // https://stackoverflow.com/questions/48176767/webpack-bundle-analyzer-shows-webpack-p-does-not-remove-development-dependency
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
});
