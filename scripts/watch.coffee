watchr = require "watchr"
{spawn} = require "child_process"

paths = process.argv[2].split ","
command = process.argv[3]
commandArguments = process.argv[4..]

child = null

runCommand = ->

	if not command
		return console.log "Missing command"

	console.log "Running '#{command} #{process.argv[4..].join " "}'"

	child?.kill()
	child = spawn command, commandArguments

	child.stdout.on "data",  (data) -> process.stdout.write Buffer(data).toString()
	child.stdout.on "error", (data) -> process.stderr.write Buffer(data).toString()

	child.stderr.on "data",  (data) -> process.stdout.write Buffer(data).toString()
	child.stderr.on "error", (data) -> process.stderr.write Buffer(data).toString()


runCommand()

watchr.watch
	paths: paths
	catchupDelay: 100
	persistent: false
	ignoreHiddenFiles: true
	listeners:
		error: (err) -> console.log "an error occured:", err
		change: (changeType, filePath) ->
			if filePath.indexOf(".coffee") > -1
				console.log "Change: #{filePath}"
				runCommand()
