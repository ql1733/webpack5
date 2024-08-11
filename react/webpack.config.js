// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV == 'production';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
module.exports = () => {
    return {
        entry: {
            index: {
                import: "./src/index.tsx",
                dependOn: "shared"
            },
            about: {
                import: "./src/about.tsx",
                dependOn: "shared"
            },
            shared: ["react", "react-dom"]
        },
        output: {
            chunkFilename: isProduction ? '[name].[chunkhash:8].chunk.js' :
            '[name].chunk.js',
            filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
            clean: true
        },
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                    ]
                },
                {
                    test: /\.less$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        "less-loader",
                    ]
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(woff|woff2|eot|ttf|gotf)$/i,
                    type: "asset/resource",
                }
            ]
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, 'src/')
            },
            extensions: [".js", ".jsx", ".tsx", ".less", ".css"],
        },
        devServer: {
            open: true,
            port: 8089,
        },
        mode: isProduction ? 'production' : 'development',
        plugins: [
            new HtmlWebpackPlugin({ 
                filename: "index.html",
                template: 'index.html',
                chunks: ["shared","index"],
            }),
            new HtmlWebpackPlugin({ 
                filename: "about.html",
                template: 'index.html',
                chunks: ["shared","about"],
            }),
            isProduction ? new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css',
                chunkFilename: '[name].[contenthash:8].chunk.css',
              }) : null
        ].filter(Boolean)
    };
};