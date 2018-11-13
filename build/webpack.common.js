const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const utils = require('./utils')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const PROJECT_DIR = utils.PROJECT_DIR

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: utils.entry,
  output: {
    path: `${PROJECT_DIR}/dist`,
    filename: utils.isProd ? './js/[name].[contenthash:8].js' : './js/[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    minimize: false
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            ["env", {
              "targets": {
                "browsers": ["last 15 versions", "safari >= 4", "not ie < 9", "iOS >= 7"]
              }
            }],
          ],
        }
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: utils.isProd ? 'assert/img/[name].[hash:8].[ext]' : 'assert/img/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: utils.isProd ? 'assert/fonts/[name].[hash:8].[ext]' : 'assert/fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: `${PROJECT_DIR}/build/postcss.config.js`
              }
            }
          },
          'resolve-url-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          attrs: ['img:src'],
          interpolate: 'require',
          publicPath: './',
          root: true
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: PROJECT_DIR,
      verbose: true,
      dry: false
    }),
    new MiniCssExtractPlugin({
      filename: utils.isProd ? "./css/[name].[contenthash:8].css" : "./css/[name].css",
    }),
    ...utils.htmlPluginArr
  ],
}