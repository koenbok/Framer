{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{EventEmitter} = require "./EventEmitter"

class exports.AnimationLoop extends EventEmitter

	start: =>
		
		animationLoop = @

		_timestamp = null


		tick = (timestamp) ->

			window.requestAnimationFrame(tick)

			# if _timestamp
			# 	delta = (timestamp - _timestamp) / 1000
			# else
			# 	delta = 1/60

			delta = 1/60

			animationLoop.emit("update", delta)
			animationLoop.emit("render", delta)

			_timestamp = timestamp

		window.requestAnimationFrame(tick)