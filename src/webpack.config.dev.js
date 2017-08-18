import path from 'path';

export default {

  devtool: 'inline-source-map',

  entry: [
    path.resolve(__dirname, 'public/javascripts/index.js')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    publicPath: path.resolve(__dirname, 'public/javascripts'),
    filename: 'bundle.js'
  },
  plugins: [],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.css$/, loaders: ['style-loader','css-loader']}
    ]
  }
}
