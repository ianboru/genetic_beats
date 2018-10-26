const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [ './app/index' ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    }, {
      test: /\.css$/,
      include: [
        path.join(__dirname, 'app'),
      ],
      loader: 'style!css!postcss',
    }],
  },
};
