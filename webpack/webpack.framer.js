path = require("path")
config = require("./webpack.base")()

config.entry = {
	framer: path.join(__dirname, "../src/Framer"),
}

module.exports = config
