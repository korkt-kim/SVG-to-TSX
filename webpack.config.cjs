/* eslint-disable @typescript-eslint/no-var-requires */

const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",

  // Disable cache in development to ensure fresh builds
  cache: false,

  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    ui: "./src/ui.tsx",
    code: "./src/code.ts",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      { test: /\.(png|jpg|gif|webp|svg)$/, use: [{ loader: "url-loader" }] },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    fallback: {
      process: require.resolve("process/browser"),
      assert: require.resolve("assert/"),
      stream: require.resolve("stream-browserify"),
      string_decoder: require.resolve("string_decoder/"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url/"),
      buffer: require.resolve("buffer/"),
      path: require.resolve("path-browserify"),
      fs: false,
    },
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/ui.html",
      filename: "ui.html",
      chunks: ["ui"],
      cache: false,
      inject: "body",
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/ui.html$/],
    }),
  ],
});
