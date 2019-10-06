const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  cache: false,
  mode: 'production',
  devtool: 'cheap-module-source-map',
  optimization: {
    runtimeChunk: 'single',
  },
});
