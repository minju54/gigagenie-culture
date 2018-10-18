// 내가 만듬
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                  loaders: {
                    // 'scss': 'vue-style-loader!css-loader!sass-loader',
                    // 'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                  },
                  // other vue-loader options go here
                //   sourceMap: false
                }
            },
            {
                test: /\.js$/,
                include: path.join(__dirname),
                exclude: /(node_modules)|(dist)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]?[hash]'
                }
            },
            
        ]
    },
    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    }
};