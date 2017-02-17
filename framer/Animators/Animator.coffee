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

	values: (delta=1/60, limit=100) ->
		values = []
		for i in [0..limit]
			values.push(@next(delta))
			if @finished()
				break
		return values
