const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './app/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        SENTRY_PUBLIC_DSN: JSON.stringify("https://00a502ca99b5403e8813bdae38a78df3@sentry.io/1253637")
      },
    }),
    // Remove this line to troubleshoot in production
    new webpack.optimize.UglifyJsPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      test: /\.css$/,
      loader: 'style!css!postcss',
    }],
  },
};
