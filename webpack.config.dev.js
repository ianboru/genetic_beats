const path = require("path");
const webpack = require("webpack");
const LiveReloadPlugin = require("webpack-livereload-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");


module.exports = {
  entry: ["./app/index"],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "app-dev.js",
    publicPath: "/static/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      }, {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      }, {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new ErrorOverlayPlugin(),
    new LiveReloadPlugin(),
  ],
  devtool: "cheap-module-source-map",
};
