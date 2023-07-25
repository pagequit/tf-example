const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { name } = require("./package.json");

module.exports = {
    mode: "development",
    entry: {
        main: "./src/main.js",
    },
    devtool: "inline-source-map",
    devServer: {
        static: "./dist",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: name,
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
        publicPath: "/",
    },
};
