const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const webpack = require("webpack")
const path = require("path")

const DFXWebPackConfig = require("./dfx.webpack.config")

const envList = DFXWebPackConfig.initCanisterIds()

// add type definitions for webpack
/**
 * @type {import('webpack').Configuration}
 *
 */
const systemConfig = {
  name: "system",
  mode: "development",
  entry: "./frontend/system/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "out", "system"),
  },
  resolve: {
    modules: [path.resolve(__dirname, "frontend"), "node_modules"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
        baseUrl: path.resolve(__dirname, "frontend"),
      }),
    ],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.EnvironmentPlugin(envList),
    new HtmlWebpackPlugin({
      template: "public/index.html", // you might need to adjust this for multiple html files
      filename: "index.html", // output file for this HTML file
    }),
    process.env.NODE_ENV === "development" && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.[tj]s(\?.*)?$/i,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 250000,
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
          reuseExistingChunk: true,
          minChunks: 2,
          priority: -20,
        },
      },
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "out"),
    },
    compress: true,
    port: 3001,
    hot: true,
  },
}

// add type definitions for webpack
/**
 * @type {import('webpack').Configuration}
 *
 */
const walletConfig = {
  name: "wallet",
  mode: "development",
  entry: "./frontend/wallet/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "out", "wallet"),
  },
  resolve: {
    modules: [path.resolve(__dirname, "frontend"), "node_modules"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
        baseUrl: path.resolve(__dirname, "frontend"),
      }),
    ],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.EnvironmentPlugin(envList),
    new HtmlWebpackPlugin({
      template: "public/index.html", // you might need to adjust this for multiple html files
      filename: "index.html", // output file for this HTML file
    }),
    process.env.NODE_ENV === "development" && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.[tj]s(\?.*)?$/i,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 250000,
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
          reuseExistingChunk: true,
          minChunks: 2,
          priority: -20,
        },
      },
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "out"),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
}

// add type definitions for webpack
/**
 * @type {import('webpack').Configuration}
 *
 */
module.exports = [systemConfig, walletConfig]
