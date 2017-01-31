path = require("path")
config = require("./webpack.base")()

config.entry = {
	perf: path.join(__dirname, "../perf/index"),
}

module.exports = config
