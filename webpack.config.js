module.exports = {
  entry: {
    'vdom' : './src/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  devtool: 'source-map'
};
