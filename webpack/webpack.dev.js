path = require("path")
config = require("./webpack.base")()

config.entry = {
	framer: path.join(__dirname, "../src/Framer"),
	app: path.join(__dirname, "../app"),
}

module.exports = config
