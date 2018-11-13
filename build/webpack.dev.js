const webpack = require('webpack');

const merge = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      REMOTE_API: JSON.stringify('https://mp.chexiaoben.com'),
      OSS_URL: JSON.stringify('//afanticar-test.oss-cn-hangzhou.aliyuncs.com/'),
    }),
  ],
  devServer: {
    port: 8080,
    proxy: {
      '/api': 'http://47.99.34.127:30192',
    }
  }
});
