_ = require("lodash")
async = require("async")
gulp = require("gulp")
phantomjs = require("gulp-mocha-phantomjs")
webpack = require("webpack")
gulpWebpack = require("webpack-stream")
rename = require("gulp-rename")
template = require("gulp-template")
gutil = require("gulp-util")
plumber = require("gulp-plumber")
{exec} = require("child_process")

command = (cmd, cb) ->
	exec cmd, {cwd: __dirname}, (err, stdout, stderr) ->
		cb(null, stdout.split('\n').join(''))

CONFIG =
	module:
		loaders: [{test: /\.coffee$/, loader: "coffee-loader"}]
	resolve:
		extensions: ["", ".web.coffee", ".web.js", ".coffee", ".js"]
	cache: true
	devtool: "sourcemap"
	quiet: true

gulp.task "build-release", ["version"], ->

	config = _.extend CONFIG,
		entry: "./framer/Framer.coffee"
		output:
			filename: "framer.js"
			pathinfo: false

		# Uglify is disabled for now because it messes up the
		# source maps in Safari.
		plugins: [
			# new webpack.BannerPlugin("Framer", {}),
			# new webpack.optimize.DedupePlugin(),
			# new webpack.optimize.UglifyJsPlugin({
			# 	mangle: false,
			# 	compress: {warnings: false}
			# })
		]

	return gulp.src(config.entry)
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("build/"))

gulp.task "build-debug", ["version"], ->

	config = _.extend CONFIG,
		entry: "./framer/Framer.coffee"
		output:
			filename: "framer.debug.js"
			sourceMapFilename: "[file].map?hash=[hash]"
			pathinfo: true
		debug: true

	return gulp.src(config.entry)
		.pipe(plumber())
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("build/"))

gulp.task "build-test", ->

	config = _.extend CONFIG,
		entry: "./test/tests.coffee"
		output: {filename: "tests.js"}

	return gulp.src(config.entry)
		.pipe(plumber())
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("test/phantomjs/"))

gulp.task "test", ["build-debug", "build-test"], ->
	return gulp
		.src("test/phantomjs/index.html")
		.pipe(phantomjs({reporter:"dot", viewportSize: {
			width: 1024,
			height: 768
		}}))

gulp.task "watch", ->
	gulp.run "test", ->
		gulp.watch(["./*.coffee", "framer/**", "test/tests/**", "!Version.coffee"], ["test"])

gulp.task "watcher", ["version"], ->

	config = _.extend CONFIG,
		entry: "./framer/Framer.coffee"
		output:
			filename: "framer.debug.js"
			sourceMapFilename: "[file].map?hash=[hash]"
		debug: true
		watch: true

	return gulp.src(config.entry)
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("build/"))

gulp.task "version", (callback) ->

	async.series [
		(cb) -> command("git rev-parse --abbrev-ref HEAD", cb) # branch
		(cb) -> command("git describe --always --dirty", cb) # hash
		(cb) -> command("git rev-list --count HEAD", cb) # build
	], (err, results) ->			

		info = 
			branch: results[0]
			hash: results[1]
			build: results[2]
			date: Math.floor(Date.now() / 1000)

		# If we are on the wercker platform, we need to get the branch
		# name from the env variables and remove the dirty vrom version.
		if process.env.WERCKER_GIT_BRANCH
			info.branch = process.env.WERCKER_GIT_BRANCH
			info.hash = info.hash.replace("-dirty", "")

		gutil.log "Building ", gutil.colors.green("#{info.branch}/#{info.hash} @#{info.build}")
		 
		task = gulp.src("framer/Version.coffee.template")
			.pipe(template(info))
			.pipe(rename({
				basename: "Version",
				extname: ".coffee"
			}))
			.pipe(gulp.dest("build"))

		callback(null, task)

gulp.task "build-coverage", ->

	config = _.extend CONFIG,
		entry: "./build/instrumented/Framer.js"
		output:
			filename: "framer.debug.js"
		debug: true

	return gulp.src(config.entry)
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("build/"))

gulp.task "coverage", ["build-coverage", "build-test"], ->
	return gulp
		.src("test/phantomjs/index.html")
		.pipe(phantomjs(
			# reporter: "landing"
			phantomjs:
				hooks: "coverage-capture"
		))
		.on "finish", ->
			console.log "done"
