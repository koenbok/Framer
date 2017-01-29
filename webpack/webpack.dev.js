path = require("path")
config = require("./webpack.base")()

config.entry = {
	app: path.join(__dirname, "../app"),
}

module.exports = config
