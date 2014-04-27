{exec} = require "child_process"
{getVersion} = require "./version"

getVersion (version) ->
	
	console.log "// Framer #{version} (c) 2013 Koen Bok"
	console.log "// https://github.com/koenbok/Framer\n"
	
	console.log "window.FramerVersion = \"#{version}\";\n\n"
