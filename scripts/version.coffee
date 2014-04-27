{exec} = require "child_process"

exports.getVersion = (callback) ->
	exec "git describe --tags --always", (err, version) ->
		throw err if err
		callback version.replace "\n", ""

exports.getVersion (version) ->
	console.log version