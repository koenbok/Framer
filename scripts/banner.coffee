{exec} = require "child_process"

exec "git describe --tags", (err, version) ->
	
	version = version.replace "\n", ""
	
	console.log "// Framer #{version} (c) 2013 Koen Bok"
	console.log "// https://github.com/koenbok/Framer\n"
	
	console.log "window.FramerVersion = \"#{version}\";\n\n"
