{exec} = require "child_process"

exports.getVersion = (callback) ->
	exec "git describe --tags", (err, version) ->
		callback version.replace "\n", ""

exports.getVersion (version) ->
	console.log version