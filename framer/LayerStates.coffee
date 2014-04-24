{_} = require "./Underscore"

{EventEmitter} = require "./EventEmitter"

class exports.LayerStates extends EventEmitter
	
	constructor: (@layer) ->
		
		@_states = {}
		@_orderedStates = []
		
		@defaultAnimationOptions =
			curve: "spring"
		
		# Always add the default state as the current
		@add "default", @layer.properties

		@_currentState = "default"
		@_previousStates = []
	
	add: (stateName, properties) ->
		# Add a state with a name and properties
		@_orderedStates.push stateName
		@_states[stateName] = properties

	remove: (stateName) ->
		
		if not @_states.hasOwnProperty stateName
			return
		
		delete @_states[stateName]
		@_orderedStates = _.without @_orderedStates, stateName
	
	switch: (stateName, animationOptions) ->
		
		# Switches to a specific state. If animationOptions are
		# given use those, otherwise the default options.
		
		if stateName is @_currentState
			return

		if not @_states.hasOwnProperty stateName
			throw Error "No such state: '#{stateName}'"
		
		@emit "willSwitch", @_currentState, stateName, @

		@_previousStates.push @_currentState
		@_currentState = stateName

		animationOptions ?= @defaultAnimationOptions
		animationOptions.properties = {}
		
		for k, v of @_states[stateName]
			# Allow dynamic properties as functions
			v = v() if _.isFunction(v)
			animationOptions.properties[k] = v
			
		animation = @layer.animate animationOptions

		animation.on "stop", =>
			@emit "didSwitch", _.last @_previousStates, stateName, @
	
	states: ->
		# Return a list of all the possible states
		@_orderedStates

	previous: (states, animationOptions) ->
		# Go to previous state in list
		states ?= @states()
		@switch Utils.arrayPrev(states, @_currentState), animationOptions

	next: (states, animationOptions) ->
		# Go to next state in list
		states ?= @states()
		@switch Utils.arrayNext(states, @_currentState), animationOptions


	last: (animationOptions) ->
		# Return to last state
		@switch _.last(@_previousStates), animationOptions

