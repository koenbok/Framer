path = require("path")
config = require("./webpack.base")()

config.entry = {
	app: path.join(__dirname, "../app"),
}
config.plugins.push(new HtmlWebpackPlugin())

module.exports = config
