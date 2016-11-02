_ = require("lodash")
async = require("async")
gulp = require("gulp")
phantomjs = require("gulp-mocha-phantomjs")
webpack = require("webpack")
rename = require("gulp-rename")
template = require("gulp-template")
gutil = require("gulp-util")
{exec} = require("child_process")
coffeelint = require('gulp-coffeelint')

DEBUG_TARGET = process.env.TARGET ? "extras/Studio.framer"

################################################################################
# Base webpack config

WEBPACK =
	entry: "./framer/Framer.coffee"
	module:
		loaders: [{test: /\.coffee$/, loader: "coffee-loader"}]
	resolve:
		extensions: ["", ".web.coffee", ".web.js", ".coffee", ".js"]
	devtool: "sourcemap"
	cache: true
	quiet: true

################################################################################
# Gulp tasks

gulp.task "watch", ["test"], ->
	gulp.watch(["./*.coffee", "framer/**", "test/tests/**", "!Version.coffee"], ["test"])

gulp.task "test", ["webpack:tests", "lint"], ->
	return gulp
		.src("test/phantomjs/index.html")
		.pipe(phantomjs({
			reporter:"dot",
			viewportSize: {width: 1024, height: 768},
			useColors: true,
			loadImages: false
		}))

gulp.task 'lint', ->
	gulp.src(["./framer/**","!./framer/Version.coffee.template","./test/tests/**","./test/tests.coffee","./gulpfile.coffee","scripts/site.coffee"])
		.pipe(coffeelint())
		.pipe(coffeelint.reporter())

gulp.task "version", (callback) ->
	versionInfo (info) ->

		# If we are on the wercker platform, we need to get the branch
		# name from the env variables and remove the dirty from version.
		if process.env.WERCKER_GIT_BRANCH
			info.branch = process.env.WERCKER_GIT_BRANCH
			info.hash = info.hash.replace("-dirty", "")

		log "version", "#{info.branch}/#{info.hash} @#{info.build}"

		task = gulp.src("framer/Version.coffee.template")
			.pipe(template(info))
			.pipe(rename({
				basename: "Version",
				extname: ".coffee"
			}))
			.pipe(gulp.dest("build"))

		callback(null, task)

################################################################################
# Webpack tasks

gulp.task "webpack:debug", ["version"], (callback) ->

	config = _.extend WEBPACK,
		debug: true
		output:
			filename: "build/framer.debug.js"
			sourceMapFilename: "[file].map?hash=[hash]"

	webpackDev "webpack:debug", config, ->
		command "cp build/framer.debug.* '#{DEBUG_TARGET}/framer/'"
		callback()

gulp.task "webpack:release", ["version"], (callback) ->

	config = _.extend WEBPACK,
		output:
			filename: "build/framer.js"
			sourceMapFilename: "[file].map"
			pathinfo: false
		plugins: [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				mangle: false
				compress: {warnings: true}
			})
		]

	webpackDev("webpack:release", config, callback)

gulp.task "webpack:tests", ["webpack:debug"], (callback) ->

	config = _.extend WEBPACK,
		entry: "./test/tests.coffee"
		output:
			filename: "test/phantomjs/tests.js"
	debug: true

	webpackDev("webpack:tests", config, callback)


################################################################################
# Utilities

log = (task, args...) ->
	gutil.log "[#{gutil.colors.yellow(task)}]", args...

command = (cmd, cb) ->
	exec cmd, {cwd: __dirname}, (err, stdout, stderr) ->
		cb?(null, stdout.split("\n").join(""))

webpackDev = (name, config, callback) ->
	webpackDev._instances ?= {}
	webpackDev._instances[name] ?= webpack(_.clone(config))
	webpackBuilder = webpackDev._instances[name]
	webpackBuilder.run (err, stats) ->
		throw new gutil.PluginError("#{name}", err) if (err)
		log name, gutil.colors.green("All ok")
		callback()

versionInfo = (callback) ->
	async.series [
		(cb) -> command("git rev-parse --abbrev-ref HEAD", cb) # branch
		(cb) -> command("git describe --always --dirty", cb) # hash
		(cb) -> command("git rev-list --count HEAD", cb) # build
	], (err, results) ->
		callback
			branch: results[0]
			hash: results[1]
			build: results[2]
			date: Math.floor(Date.now() / 1000)
