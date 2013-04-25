watchr = require "watchr"
{spawn} = require "child_process"

path = process.argv[2]
cmd = process.argv[3]

child = null

console.log "Path: #{path}"
console.log "Command: #{cmd}"

watchr.watch
	paths: [path]
	listeners:
		error: (err) ->
			console.log "an error occured:", err

		change: (changeType, filePath) ->
			
			# console.log "a change event occured:", changeType, filePath
			# console.log filePath.indexOf ".coffee"
			
			if filePath.indexOf(".coffee") > -1
				
				console.log "Running '#{cmd} #{process.argv[4..].join " "}'"
				
				child?.kill()
				child = spawn cmd, process.argv[4..]
				
				child.stdout.on "data", (data) ->
					process.stdout.write Buffer(data).toString "utf8"
				
				child.stdout.on "error", (data) ->
					process.stderr.write Buffer(data).toString "utf8"
