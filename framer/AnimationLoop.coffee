{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{EventEmitter} = require "./EventEmitter"

requestAnimationFrame =  window.requestAnimationFrame
requestAnimationFrame ?= window.webkitRequestAnimationFrame
requestAnimationFrame ?= (f) -> Utils.delay 1/60, f

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
		AnimationLoop._time = Utils.getTime()
		AnimationLoop._sessionTime = 0

		requestAnimationFrame AnimationLoop._tick

	_stop: ->
		console.debug "AnimationLoop._stop"
		AnimationLoop._running = false


	_tick: ->

		if not AnimationLoop._animators.length
			return AnimationLoop._stop()

		if AnimationLoop._sessionTime == 0
			console.debug "AnimationLoop._start"


		AnimationLoop._frameCounter++
		
		time  = Utils.getTime()
		delta = time - AnimationLoop._time

		AnimationLoop._sessionTime += delta

		# console.debug [
		# 	"_tick #{AnimationLoop._frameCounter} ",
		# 	"#{Utils.round(delta, 5)}ms ",
		# 	"#{Utils.round(AnimationLoop._sessionTime, 5)}",
		# 	"animators:#{AnimationLoop._animators.length}"
		# ].join " "

		removeAnimators = []

		for animator in AnimationLoop._animators

			animator.emit "tick", animator.next(delta)

			if animator.finished()
				animator.emit "tick", 1 # This makes sure we and at a perfect value
				removeAnimators.push animator

		AnimationLoop._time = time

		requestAnimationFrame AnimationLoop._tick

		for animator in removeAnimators
			AnimationLoop.remove animator
			animator.emit "end"

		return # Important for performance

	add: (animator) ->

		if animator.hasOwnProperty AnimationLoopIndexKey
			return

		animator[AnimationLoopIndexKey] = AnimationLoop._animators.push animator
		animator.emit "start"
		AnimationLoop._start()

	remove: (animator) ->
		AnimationLoop._animators.splice animator[AnimationLoop._animators], 1
		animator.emit "stop"

exports.AnimationLoop = AnimationLoop
