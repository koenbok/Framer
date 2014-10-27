{_} = require "./Underscore"
Utils = require "./Utils"
{Config} = require "./Config"
{EventEmitter} = require "./EventEmitter"

if window.performance
	getTime = -> window.performance.now()
else
	getTime = -> Date.now()


# Make the time ticks a "fixed" 1/60 of a second.
# Framer.Loop.delta = 1/60

# Include workaround for a WebKit2 browser bug
# Framer.Loop.raf = false

class exports.AnimationLoop extends EventEmitter

	constructor: ->
		
		# For now we set the delta to a fixed time because using performance.now plus
		# raf seems to cause weird issues.
		@delta = 1/60
		@raf = true

		# Workaraound for RAF bug on 10.10
		# https://bugs.webkit.org/show_bug.cgi?id=137599

		if Utils.webkitVersion() > 600 and Utils.isDesktop()
			@raf = false

		if Utils.webkitVersion() > 600 and Utils.isFramerStudio()
			@raf = false

	start: =>
		
		animationLoop = @
		_timestamp = getTime()

		update = ->

			if animationLoop.delta
				delta = animationLoop.delta
			else
				timestamp = getTime()
				delta = (timestamp - _timestamp) / 1000
				_timestamp = timestamp

			animationLoop.emit("update", delta)
			animationLoop.emit("render", delta)

		tick = (timestamp) ->

			if animationLoop.raf
				update()
				window.requestAnimationFrame(tick)
			else
				window.setTimeout ->
					update()
					window.requestAnimationFrame(tick)
				, 0

		tick()