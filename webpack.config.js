const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './source/main',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './source'),
        publicPath: '/source',
        library: 'home'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader',
                options: { presets: ['es2015'] },
            }],
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]

};