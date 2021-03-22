const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const COMMIT_SHA = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0,8) : "dev";

module.exports = {
    entry: './src/app.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: `bundle-[name]-${COMMIT_SHA}-[hash].js`
    },
    resolve:   {
        alias : {
            page      : path.resolve(__dirname, 'src/page'),
            component : path.resolve(__dirname, 'src/component'),
            router    : path.resolve(__dirname, 'src/router')
        }
    },
    module: {
        rules: [
            // use babel-loader for React files
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
                }
            },
            {
                test: /\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            //favicon: './favicon.ico'
        }),
        // Separate the css files and name the output file as styles.css
        new ExtractTextPlugin({
            filename:  (getPath) => {
              return getPath(`styles-${COMMIT_SHA}-[hash].css`);
            },
        }),
        new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename: `js/base-${COMMIT_SHA}-[hash].js`
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new LodashModuleReplacementPlugin,

        // Add this to see bundle size
        // new BundleAnalyzerPlugin(), 
    ],
};
