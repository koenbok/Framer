{_} = require "./Underscore"
		
class exports.LayerStates
	
	constructor: (@layer) ->
		
		@_states = {}
		
		@defaultAnimationOptions =
			curve: "spring(300,30,100)"
		
		# Always add the default state as the current
		@add "default", @layer.properties
	
	add: (stateName, properties) ->
		# Add a state with a name and properties
		@_states[stateName] = properties
	
	transform: (stateName, animationOptions) ->
		# Transform to a specific state. If animationOptions are
		# given use those, otherwise the default options.
		
		if not @_states.hasOwnProperty stateName
			throw Error "No such state: '#{stateName}'"
		
		animationOptions ?= @defaultAnimationOptions
		animationOptions.properties = {}
		
		for k, v of @_states[stateName]
			# Allow dynamic properties as functions
			v = v() if _.isFunction(v)
			animationOptions.properties[k] = v
			
		@layer.animate animationOptions
	
	states: ->
		# Return a list of all the possible states
		_.keys @_states