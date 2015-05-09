var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	entry: './index.js',
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
		]
	},
	output: {
		path: '.',
		filename: 'bundle.js'
	},
	plugins: [new HtmlWebpackPlugin({title: 'Band Stars Data'})]
}