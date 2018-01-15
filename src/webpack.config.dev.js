import path from 'path';
import writeFilePlugin from 'write-file-webpack-plugin';
import glob from 'glob';
var pathRes = path.resolve(__dirname,'public/javascripts/mvc');
var buildEntries = glob.sync(`${pathRes}/*.js`);
console.log(buildEntries);
export default {

  devtool: 'inline-source-map',

  entry:
    buildEntries
  ,
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    publicPath: path.resolve(__dirname, 'public/javascripts'),
    filename: 'bundle.js'
  },
  plugins: [
    new writeFilePlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.css$/, loaders: ['style-loader','css-loader']}
    ]
  }
}
