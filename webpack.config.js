var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.js',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'server.js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
