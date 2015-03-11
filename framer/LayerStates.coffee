{_} = require "./Underscore"

{Events} = require "./Events"
{BaseClass} = require "./BaseClass"
{Defaults} = require "./Defaults"

LayerStatesIgnoredKeys = ["ignoreEvents"]

# Animation events
Events.StateWillSwitch = "willSwitch"
Events.StateDidSwitch = "didSwitch"

class exports.LayerStates extends BaseClass

	constructor: (@layer) ->

		@_states = {}
		@_orderedStates = []

		@animationOptions = {}

		# Always add the default state as the current
		@add "default", @layer.properties

		@_currentState = "default"
		@_previousStates = []

		super

	add: (stateName, properties) ->

		# We also allow an object with states to be passed in
		# like: layer.states.add({stateA: {...}, stateB: {...}})
		if _.isObject stateName
			for k, v of stateName
				@add k, v
			return

		error = -> throw Error "Usage example: layer.states.add(\"someName\", {x:500})"
		error() if not _.isString stateName
		error() if not _.isObject properties

		# Add a state with a name and properties
		@_orderedStates.push stateName

		if properties['didEnter'] || properties['didExit']
			@on Events.StateDidSwitch, (oldState, newState) =>
				if newState == stateName
					properties['didEnter']?.call(@layer)
				if oldState == stateName
					properties['didExit']?.call(@layer)

		if properties['willEnter'] || properties['willExit']
			@on Events.StateWillSwitch, (oldState, newState) =>
				if newState == stateName
					properties['willEnter']?.call(@layer)
				if oldState == stateName
					properties['willExit']?.call(@layer)				

		@_states[stateName] = properties

	remove: (stateName) ->

		if not @_states.hasOwnProperty stateName
			return

		delete @_states[stateName]
		@_orderedStates = _.without @_orderedStates, stateName

	switch: (stateName, animationOptions, instant=false) ->

		# Switches to a specific state. If animationOptions are
		# given use those, otherwise the default options.

		# We actually do want to allow this. A state can be set to something
		# that does not equal the property values for that state.

		# if stateName is @_currentState
		# 	return

		if not @_states.hasOwnProperty(stateName)
			throw Error "No such state: '#{stateName}'"

		@emit(Events.StateWillSwitch, @_currentState, stateName, @)

		@_previousStates.push(@_currentState)
		@_currentState = stateName

		properties = {}
		animatingKeys = @animatingKeys()

		for propertyName, value of @_states[stateName]

			# Don't animate ignored properties
			if propertyName in LayerStatesIgnoredKeys
				continue

			if propertyName not in animatingKeys
				continue

			# Allow dynamic properties as functions
			value = value.call(@layer, @layer, stateName) if _.isFunction(value)

			# Set the new value 
			properties[propertyName] = value

		# If we are only transitioning to non-animatable (numeric) properties
		# we fallback to an instant switch
		animatablePropertyKeys = []

		for k, v of properties
			animatablePropertyKeys.push(k) if _.isNumber(v)

		if animatablePropertyKeys.length == 0
			instant = true

		if instant is true
			# We want to switch immediately without animation
			@layer.properties = properties
			@emit Events.StateDidSwitch, _.last(@_previousStates), stateName, @

		else
			# Start the animation and update the state when finished
			animationOptions ?= @animationOptions
			animationOptions.properties = properties

			@_animation?.stop()
			@_animation = @layer.animate animationOptions
			@_animation.on "stop", => 
				
				# Set all the values for keys that we couldn't animate
				for k, v of properties
					@layer[k] = v if not _.isNumber(v)

				@emit Events.StateDidSwitch, _.last(@_previousStates), stateName, @



	switchInstant: (stateName) ->
		@switch stateName, null, true

	@define "state", get: -> @_currentState
	@define "current", get: -> @_currentState

	states: ->
		# Return a list of all the possible states
		_.clone @_orderedStates

	animatingKeys: ->

		# Get a list of all the propeties controlled by states

		keys = []

		for stateName, state of @_states
			continue if stateName is "default"
			keys = _.union(keys, _.keys(state))

		keys

	previous: (states, animationOptions) ->
		# Go to previous state in list
		states ?= @states()
		@switch Utils.arrayPrev(states, @_currentState), animationOptions

	next:  ->
		# TODO: maybe add animationOptions
		states = Utils.arrayFromArguments arguments

		if not states.length
			states = @states()

		@switch Utils.arrayNext(states, @_currentState)


	last: (animationOptions) ->
		# Return to last state
		@switch _.last(@_previousStates), animationOptions

	emit: (args...) ->
		super
		# Also emit this to the layer with self as argument
		@layer.emit args...