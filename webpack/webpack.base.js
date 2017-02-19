path = require("path")
webpack = require("webpack")
getRepoInfo = require("git-repo-info")
UglifyJsPlugin = require("webpack-uglify-harmony")
Visualizer = require("webpack-visualizer-plugin")

var GIT_INFO = getRepoInfo();
var BUILD_TYPE = process.env.BUILD_TYPE || "debug"
var VISUALIZE = process.env.VISUALIZE || false

console.log("BUILD_TYPE:", BUILD_TYPE)

module.exports = function() {
	var config = {
		output: {
			path: path.join(__dirname, "..", "build"),
			filename: "[name].js",
		},
		devtool: "source-map",
		target: "web",
		stats: "errors-only",
		module: {
			loaders: [
				{ test: /\.ts(x?)$/, loader: "ts-loader", exclude: /__tests__/ },
				{ test: /\.json$/, loader: "json-loader" }
			]
		},
		// externals: {typescript: "ts"},
		// devServer: {inline: true},
		resolve: {
			modules: ["node_modules", path.resolve("./src")],
			extensions: [".js", ".json", ".ts", ".tsx"],
		},
		performance: {
			hints: false
		},
		node: {
			fs: "empty",
			module: "empty"
		},
		plugins: [
			new webpack.DefinePlugin({
				__BUILD_TYPE__: JSON.stringify(BUILD_TYPE),
				__BUILD_VERSION__: JSON.stringify(`${GIT_INFO.branch}/${GIT_INFO.abbreviatedSha}`),
				__BUILD_DATE__: JSON.stringify(new Date().toISOString()),
				"process.env.NODE_ENV": JSON.stringify(BUILD_TYPE)
			})
		]
	}

	if (BUILD_TYPE === "production") {
		config.devtool = "source-map"
		config.plugins.push(
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			}),
			new UglifyJsPlugin({
				compress: {
					warnings: false,
					screw_ie8: true,
					conditionals: true,
					unused: true,
					comparisons: true,
					sequences: true,
					dead_code: true,
					evaluate: true,
					if_return: true,
					join_vars: true,
				},
				output: {
					comments: false,
				},
				mangle: false,
				sourceMap: true
			})
		)
	}

	if (VISUALIZE) {
		console.log("*** Visualizing")
		config.plugins.push(new Visualizer())
	}

	return config
}

