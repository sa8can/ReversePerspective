/* eslint-disable no-undef */
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.ts',
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    publicPath: '/script/',
    path: path.join(__dirname, 'public', 'script'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
};
