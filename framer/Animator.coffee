Utils = require "./Utils"

{Config} = require "./Config"

class exports.Animator

	"""
	The animator class is a very simple class that
		- Takes a set of input values at setup({input values})
		- Emits an output value for progress (0 -> 1) in value(progress)
	"""

	constructor: (options={}) ->
		@setup options

	setup: (options) ->
		throw Error "Not implemented"

	next: (delta) ->
		throw Error "Not implemented"

	finished: ->
		throw Error "Not implemented"

	values: (delta=1/60)->

		values = []

		while not @finished()
			values.push(@next(delta))

		return values


	# start: -> Framer.Loop.on("update", )
	# stop: -> AnimationLoop.remove @
