path = require("path")
config = require("./webpack.base")()

config.entry = {
	tests: path.join(__dirname, "../mocha/index"),
}

module.exports = config
