{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{EventEmitter} = require "./EventEmitter"

# Note: this is not an object because there should really only be one

AnimationLoopIndexKey = "_animationLoopIndex"

AnimationLoop = 

	debug: false

	_animators: []
	_running: false
	_frameCounter: 0
	_sessionTime: 0
	
	_start: ->

		if AnimationLoop._running
			return

		if not AnimationLoop._animators.length
			return

		AnimationLoop._running = true
		# AnimationLoop._time = Utils.getTime()
		AnimationLoop._timestamp = 0
		AnimationLoop._sessionTime = 0

		window.requestAnimationFrame AnimationLoop._tick

	_stop: ->
		console.log "AnimationLoop._stop"
		AnimationLoop._running = false

	_tick: (timestamp) ->

		if not AnimationLoop._animators.length
			return AnimationLoop._stop()

		# if AnimationLoop._sessionTime == 0
		# 	console.log "AnimationLoop._start"

		AnimationLoop._frameCounter++

		# delta = (timestamp - AnimationLoop._timestamp) / 1000
		# fps = 1 / delta

		# It seems that a fixed fps works better.
		

		fps = 60
		delta = 1/fps
		

		AnimationLoop._sessionTime += delta

		# console.debug [
		# 	"_tick #{AnimationLoop._frameCounter} ",
		# 	"#{Utils.round(delta, 5)}ms ",
		# 	"#{Utils.round(AnimationLoop._sessionTime, 5)}",
		# 	"animators:#{AnimationLoop._animators.length}"
		# ].join " "

		AnimationLoop._counter = 0

		index = 0

		for animator in AnimationLoop._animators

			index++

			if not animator
				continue

			AnimationLoop._counter++

			animator.emit("tick", animator.next(delta, fps))

			if animator.finished()
				animator.emit "tick", 1 # This makes sure we and at a perfect value
				animator.emit "end"
				animator.emit "stop"

				AnimationLoop._animators[index] = null

		# This means there were no animators anymore so we can safely exit
		# and reset the animators array.
		if AnimationLoop._counter is 0
			AnimationLoop._animators.length = 0

		window.requestAnimationFrame AnimationLoop._tick

		return # Important for performance

	add: (animator) ->

		if animator.hasOwnProperty AnimationLoopIndexKey
			return

		animator[AnimationLoopIndexKey] = AnimationLoop._animators.push animator
		animator.emit "start"

		Utils.domComplete ->
			AnimationLoop._start()

	remove: (animator) ->
		index = AnimationLoop._animators.indexOf(animator)
		AnimationLoop._animators[index] = null
		animator.emit "stop"

exports.AnimationLoop = AnimationLoop
