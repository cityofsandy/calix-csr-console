const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    clientLogLevel: 'trace',
    historyApiFallback: true,
    inline: true,
    contentBase: path.join(__dirname, 'dist', '.'),
    // compress: true,
    port: 9000,
    proxy: {
      '/calixCloud': {
        target: 'https://gcs.calix.com:8444/api',
        pathRewrite: { '^/calixCloud': '' },
        changeOrigin: false,
        secure: false,
      },
      '/calixCms': {
        target: 'http://example.com',
        pathRewrite: (urlPath) => { 
          return urlPath.replace(/calixCms\/(http|https):\/\/(.*?)\//g, '');
        },
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        router: (req) => {
          return req.path.match(/(http|https):\/\/(.*?)\//g, '')[0];
        },
      },
      '/calixSmx': {
        target: 'http://example.com',
        pathRewrite: (urlPath) => { 
          return urlPath.replace(/calixSmx\/(http|https):\/\/(.*?)\//g, '');
        },
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        router: (req) => {
          return req.path.match(/(http|https):\/\/(.*?)\//g, '')[0];
        },
      },
    },
  },
});
