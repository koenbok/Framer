path = require("path")
fs = require("fs")

Webpack = require("webpack")
WebpackDevServer = require("webpack-dev-server")

config =
	entry: [
		path.resolve("framer", "Framer")
	]
	output:
		path: path.resolve(__dirname, "build")
		filename: "framer.js"
	debug: true
	devtool: "source-map"
	resolve:
		extensions: ["", ".coffee", ".js"]
	module: loaders: [
		{
			test: /\.coffee$/
			loader: "coffee-loader"
		}
	]
	devServer:
		headers:
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
			"Access-Control-Allow-Origin": "*"

# First we fire up Webpack an pass in the configuration we
# created
bundleStart = null
compiler = Webpack(config)

# We give notice in the terminal when it starts bundling and
# set the time it started
compiler.plugin "compile", ->
	console.log "Bundling..."
	bundleStart = Date.now()

# We also give notice when it is done compiling, including the
# time it took. Nice to have
compiler.plugin "done", ->
	console.log "Success #{Date.now() - bundleStart}ms"

bundler = new WebpackDevServer compiler,
	quiet: false
	noInfo: true
	stats: colors: true

# We fire up the development server and give notice in the terminal
# that we are starting the initial bundle
bundler.listen 8123, "localhost", ->
	console.log "Running at http://localhost:8123"
	console.log "Bundling project, please wait..."
