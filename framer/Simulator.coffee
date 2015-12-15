Utils = require "./Utils"

{_} = require "./Underscore"
{Config} = require "./Config"
{BaseClass} = require "./BaseClass"

class exports.Simulator extends BaseClass

	"""
	The simulator class runs a physics simulation based on a set of input values 
	at setup({input values}), and emits an output state {x, v}
	"""
	
	@define "state",
		get: -> _.clone(@_state)
		set: (state) -> @_state = _.clone(state)

	constructor: (options={}) ->
		@_state = {x:0, v:0}
		@options = null
		@setup(options)

	setup: (options) -> 
		throw Error "Not implemented"
	
	next: (delta) -> 
		throw Error "Not implemented"
	
	finished: -> 
		throw Error "Not implemented"
