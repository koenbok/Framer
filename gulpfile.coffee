_ = require("lodash")
gulp = require("gulp")
phantomjs = require("gulp-mocha-phantomjs")
webpack = require("webpack")
gulpWebpack = require("gulp-webpack")

CONFIG =
	module:
		loaders: [{test: /\.coffee$/, loader: "coffee-loader"}]
	resolve:
		extensions: ["", ".web.coffee", ".web.js", ".coffee", ".js"]
	"cache": true
	"devtool": "sourcemap"

gulp.task "build:release", ->

	config = _.extend CONFIG,
		"entry": "./framer/Framer.coffee"
		"output": {filename: "framer.js", pathinfo:true}
		"plugins": [
			new webpack.optimize.DedupePlugin(), 
			new webpack.optimize.UglifyJsPlugin()
		]

	return gulp.src(config.entry)
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("build/"))

gulp.task "build:debug", ->

	config = _.extend CONFIG,
		"entry": "./framer/Framer.coffee"
		"output": {filename: "framer.debug.js", pathinfo:true}
		"debug": true

	return gulp.src(config.entry)
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("build/"))

gulp.task "build:test", ->

	config = _.extend CONFIG,
		entry: "./test/tests.coffee"
		output: {filename: "tests.js"}
		
	return gulp.src(config.entry)
		.pipe(gulpWebpack(config))
		.pipe(gulp.dest("test/phantomjs/"))

gulp.task "test", ["build:debug", "build:test"], ->
	return gulp
		.src("test/phantomjs/index.html")
		.pipe(phantomjs({reporter: "landing"}))

gulp.task "watch", ->
	gulp.watch(["./*.coffee", "framer/**", "test/tests/**"], ["test"]);