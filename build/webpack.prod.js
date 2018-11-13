const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      REMOTE_API: JSON.stringify('https://mp.chexiaoben.com'),
      OSS_URL: JSON.stringify('//afanticar-test.oss-cn-hangzhou.aliyuncs.com/'),
    }),
    new UglifyJsPlugin(),
  ],
});
