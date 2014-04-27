fs = require "fs"
path = require "path"

AWS = require "aws-sdk"

BUCKET_NAME = "builds.framerjs.com"
ACCESS_KEY  = process.env.ACCESS_KEY
SECRET_KEY  = process.env.SECRET_KEY

# For dev purposes only
AWS.config.update
  accessKeyId: ACCESS_KEY
  secretAccessKey: SECRET_KEY

handleError = (err) ->
	throw err if err

uploadFile = (path, key) ->

	console.log "Uploading #{path} -> #{key}"

	fs.readFile path, (err, data) ->
		handleError err

		s3 = new AWS.S3()
		
		request = s3.client.putObject
			Bucket: BUCKET_NAME
			Key: key
			Body: new Buffer(data, "binary")
			ACL: "public-read"
		, (err, data) -> 
			handleError err

uploadPath = (entryPath, subPath="", prefix="") ->

	for fileName in fs.readdirSync path.join(entryPath, subPath)
		
		filePath = path.join(entryPath, subPath, fileName)

		if fs.lstatSync(filePath).isDirectory()
			uploadPath entryPath, path.join(entryPath, subPath)
		else
			uploadFile filePath, path.join(prefix, subPath, fileName)

main = ->
	
	if (!ACCESS_KEY or !SECRET_KEY)
		console.log "Missing ACCESS_KEY or SECRET_KEY in enviroment"
		return

	uploadPath "build", "", "latest"

	{getVersion} = require "./version"

	getVersion (version) ->
		uploadPath "build", "", version

main()