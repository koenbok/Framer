fs  = require "fs"
zlib = require "zlib"
{join, extname}  = require "path"
{exec} = require "child_process"

_ = require "lodash"
knox = require "knox"
mime = require "mime"
mustache = require "mustache"

Config =
	bucket: "builds.framerjs.com"
	region: "us-east-1"
	input: "extras/builds.framerjs.com"
	output: "build/builds.framerjs.com"
	maxAge: 60*60*24 # One day
	gzipExtensions: [".js", ".html", ".css", ".map"]
	startAt: "2e97990"

client = knox.createClient
	key: process.env.AWS_ACCESS_KEY_ID
	secret: process.env.AWS_SECRET_ACCESS_KEY
	bucket: Config.bucket


###############################################################
# Parse the command line
main = ->

	COMMANDS =
		"upload": -> uploadDir Config.output
		"build": -> build()

	command = process.argv[2]

	console.log "Command: #{command}"

	if not COMMANDS.hasOwnProperty command
		throw Error "No command available: #{command}"
	else
		COMMANDS[command]()


###############################################################
# Methods

build = ->

	# Render the html file
	indexData = fs.readFileSync "#{Config.input}/index.html", "utf8"

	# Build up a context
	context = commits: []

	exec "git log --pretty=format:\"%h\t%an\t%ad\t%s\" --first-parent master", (err, output) ->
		throw err if err

		start = false

		for line in output.split "\n"
			fields = line.split "\t"

			if fields[0] is Config.startAt
				start = true

			if start is false
				context.commits.push
					hash: fields[0]
					author: fields[1]
					date: fields[2]
					message: fields[3]

		indexOutput = mustache.render indexData, context

		fs.writeFileSync "#{Config.output}/index.html", indexOutput

uploadFile = (path, remotePath="") ->

	console.log "Upload #{path} -> #{remotePath}"

	buffer = fs.readFileSync path
	headers =
		"Content-Type": mime.lookup path
		"Cache-Control": "max-age=#{Config.maxAge}, public"
		"x-amz-acl": "public-read"

	upload = ->
		client.putBuffer buffer, remotePath, headers, (err, response) ->
			throw err if err

	if extname(remotePath) in Config.gzipExtensions
		zlib.gzip buffer, (err, data) ->
			buffer = new Buffer data
			headers["Content-Encoding"] = "gzip"
			upload()

	else
		upload()

uploadDir = (path, remotePath="") ->

	for fileName in fs.readdirSync path

		continue if fileName[0] is "."

		filePath = join(path, fileName)

		if fs.statSync(filePath).isDirectory()
			uploadDir filePath, join(remotePath, fileName)
		else
			uploadFile filePath, join(remotePath, fileName)


main()
