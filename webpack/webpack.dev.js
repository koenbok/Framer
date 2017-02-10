path = require("path")
config = require("./webpack.base")()
HtmlWebpackPlugin = require("html-webpack-plugin")

config.entry = {
	app: path.join(__dirname, "../app"),
}
config.plugins.push(new HtmlWebpackPlugin())

module.exports = config
