const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
        ]
    },
    devServer: {
        port: 8086,
        historyApiFallback: {
            index: '/index.html'
        },
        proxy:[
            {
                context: ["/api"],
                target: "http://localhost:3000"
            }
        ]
    }
});
