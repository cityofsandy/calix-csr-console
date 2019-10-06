const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      // Load a custom template (lodash by default)
      template: './build/templates/html/fmsIndex.html',
    }),
    new CopyPlugin([
      { from: 'src/assets', to: 'assets' },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            url: false,
          },
        }],
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            url: false,
          },
        }, {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path.resolve(__dirname, 'node_modules'),
            ],
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
