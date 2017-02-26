path = require("path")
config = require("./webpack.base")()
HtmlWebpackPlugin = require("html-webpack-plugin")

config.entry = {
	tests: path.join(__dirname, "../mocha/index"),
}
config.plugins.push(new HtmlWebpackPlugin({
	showErrors: true
}))

config.plugins.push(new webpack.DefinePlugin({
	"process.env.TEST": JSON.stringify(true)
}))

module.exports = config
