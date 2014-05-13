{exec} = require "child_process"

# TODO: We should have a real version schema
exports.getVersion = (callback) ->
	exec "git describe --always", (err, version) ->
		throw err if err
		callback version.replace "\n", ""

# exports.getVersion (version) ->
# 	console.log version