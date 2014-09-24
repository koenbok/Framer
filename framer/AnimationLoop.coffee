{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{EventEmitter} = require "./EventEmitter"

class exports.AnimationLoop extends EventEmitter

	start: ->
		window.requestAnimationFrame(@tick)

	tick: (timestamp) =>

		@start()

		# if @_timestamp
		# 	delta = (timestamp - @_timestamp) / 1000
		# else
		# 	delta = 1/60

		delta = 1/60

		# console.log "tick", @_events?.update?.length

		@emit("update", delta)
		@emit("render", delta)

		@_timestamp = timestamp