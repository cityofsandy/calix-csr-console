const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    inline: true,
    contentBase: path.join(__dirname, 'dist', '.'),
    // compress: true,
    port: 9000,
  },
});
