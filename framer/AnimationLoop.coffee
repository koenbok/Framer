{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{EventEmitter} = require "./EventEmitter"

if window.performance
	getTime = -> window.performance.now()
else
	getTime = -> Date.now()


class exports.AnimationLoop extends EventEmitter

	constructor: ->
		@_delta = 1/60

	start: =>
		
		animationLoop = @

		_timestamp = getTime()


		tick = (timestamp) ->

			window.requestAnimationFrame(tick)

			if animationLoop._delta
				delta = animationLoop._delta
			else
				timestamp = getTime()
				delta = (timestamp - _timestamp) / 1000
				_timestamp = timestamp

			animationLoop.emit("update", delta)
			animationLoop.emit("render", delta)

			_timestamp = timestamp

		window.requestAnimationFrame(tick)