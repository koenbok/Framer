Utils = require "./Utils"

{Config} = require "./Config"
{EventEmitter} = require "./EventEmitter"
{AnimationLoop} = require "./AnimationLoop"

class exports.Animator extends EventEmitter

	"""
	The animator class is a very simple class that
		- Takes a set of input values at setup({input values})
		- Emits an output value for progress (0 -> 1) in value(progress)
	"""
	
	constructor: (options={}) ->
		@setup options

	setup: (options) ->
		throw "Not implemented"

	next: (delta) ->
		throw "Not implemented"

	finished: ->
		throw "Not implemented"

	start: -> AnimationLoop.add @
	stop: -> AnimationLoop.remove @
