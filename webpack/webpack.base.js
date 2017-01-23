path = require("path")
webpack = require("webpack")
getRepoInfo = require("git-repo-info")

var GIT_INFO = getRepoInfo();
var BUILD_TYPE = process.env.BUILD_TYPE || "debug"

module.exports = function() {
	var config = {
		output: {
			path: path.join(__dirname, "build"),
			filename: "[name].js",
			publicPath: "/build/"
		},
		// devServer: {
		// 	inline: true
		// },
		// devtool: "source-map",
		devtool: "cheap-module-source-map",
		target: "web",
		externals: {
			"typescript": "ts",
			"fs": "fs",
			"module": "module"
		},
		module: {
			loaders: [
				{ test: /\.ts(x?)$/, loader: "ts-loader" },
				{ test: /\.json$/, loader: "json-loader" },
			]
		},
		resolve: {
			// modules: ["node_modules", path.resolve("./src")],
			extensions: [".js", ".json", ".ts", ".tsx"],
		},
		plugins: [
			// new webpack.DefinePlugin({
			// 	__BUILD_TYPE__: JSON.stringify(BUILD_TYPE),
			// 	__BUILD_VERSION__: JSON.stringify(`${GIT_INFO.branch}/${GIT_INFO.abbreviatedSha}`),
			// 	__BUILD_DATE__: JSON.stringify(new Date().toISOString()),
			// 	"process.env": {'NODE_ENV': JSON.stringify(BUILD_TYPE)},
			// }),
		],

	}

	if (BUILD_TYPE === "production") {

		config.devtool = "source-map"

		config.plugins.push(
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			})
		)

		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: true
				},
				mangle: false
			}),
			new webpack.optimize.DedupePlugin()
		)
	}

	return config
}