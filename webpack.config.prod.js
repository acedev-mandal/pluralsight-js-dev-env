import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
// import ExtractTextPlugin from 'extract-text-webpack-plugin'; // extract-text-webpack-plugin doesn't work with webpack 4 above

export default {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        vendor: path.resolve(__dirname, 'src/vendor'),
        main: path.resolve(__dirname, 'src/index')
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false // set to false if you want CSS source maps
                    }
                }
            })
        ],
        // Minify JS
        minimize: true,
        // Create a separate bundle of vendor
        // libraries so that they're cached separately.
        splitChunks: {
            name: 'vendor'
        }
    },
    plugins: [
        // Generate an external css file with a hash in the filename
        // new ExtractTextPlugin('[name].[contenthash].css'), // extract-text-webpack-plugin doesn't work with webpack 4 above
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css"
        }),

        // Hash the files using MD5 so that their names change when the content changes.
        new WebpackMd5Hash(),

        new webpack.LoaderOptionsPlugin({
            debug: true,
            noInfo: false,
        }),
        // Create HTML file that includes reference to bundled JS.
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true,
            // Properties you define here are available in index.html
            // using htmlWebpackPlugin.options.varName
            trackJSToken: 'e3a98b08caaa466db5868806a67486d8'
        })
        // Eliminate duplicate packages when  generating bundle
        // new webpack.optimize.DedupePlugin(), // plugin removed
        // Minify JS
        // new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] },
            // { test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap') } // extract-text-webpack-plugin doesn't work with webpack 4 above
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }
        ]
    }
}
