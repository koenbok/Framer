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
		@add "default", @layer.props

		@_currentState = "default"
		@_previousStates = []

		super

	add: (stateName, properties) ->

		# We also allow an object with states to be passed in
		# like: layer.states.add({stateA: {...}, stateB: {...}})
		if _.isObject(stateName)
			for k, v of stateName
				@add(k, v)
			return

		error = -> throw Error "Usage example: layer.states.add(\"someName\", {x:500})"
		error() if not _.isString stateName
		error() if not _.isObject properties

		# Add a state with a name and properties
		@_orderedStates.push stateName
		@_states[stateName] = LayerStates.filterStateProperties(properties)

	remove: (stateName) ->

		if not @_states.hasOwnProperty stateName
			return

		delete @_states[stateName]
		@_orderedStates = _.without @_orderedStates, stateName

	switch: (stateName, animationOptions, instant=false) ->

		# Switches to a specific state. If animationOptions are
		# given use those, otherwise the default options.

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
			if _.isFunction(value)
				value = value.call(@layer, @layer, propertyName, stateName)
			
			# Set the new value
			properties[propertyName] = value

		# If we are only transitioning to non-animatable (numeric) properties
		# we fallback to an instant switch
		animatablePropertyKeys = []

		for k, v of properties

			# We can animate numbers
			if _.isNumber(v)
				animatablePropertyKeys.push(k)
			
			# We can animate colors
			else if Color.isColorObject(v)
				animatablePropertyKeys.push(k)

		# If we don't have any animatable properties, we always switch instant
		if animatablePropertyKeys.length == 0
			instant = true

		if instant
			@layer.props = properties
			@emit(Events.StateDidSwitch, _.last(@_previousStates), @_currentState, @)
			return

		# If there are, we start the animation here
		animationOptions ?= @animationOptions

		@_animation?.stop()
		@_animation = @layer.animateTo(properties,animationOptions)

		# Once the animation is done, we set all the keys that we could not animate
		@_animation.once "stop", =>

			for k, v of properties
				# @layer[k] = v if v not in animatablePropertyKeys
				@layer[k] = v unless _.isNumber(v) or Color.isColorObject(v)

			# If we changed the state, we send the event that we did
			if _.last(@_previousStates) isnt stateName
				@emit(Events.StateDidSwitch, _.last(@_previousStates), @_currentState, @)


	switchInstant: (stateName) ->
		@switch(stateName, null, true)

	@define "state", get: -> @_currentState
	@define "current", get: -> @_currentState
	@define "all", get: -> _.clone(@_orderedStates)

	states: ->
		# Return a list of all the possible states
		_.clone @_orderedStates

	animatingKeys: ->

		# Get a list of all the properties controlled by states

		keys = []

		for stateName, state of @_states
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

	@filterStateProperties = (properties) ->

		stateProperties = {}

		# TODO: Maybe we want to support advanced data structures like objects in the future too.
		for k, v of properties

			if @_isValidColor(k, v)
				stateProperties[k] = new Color(v)
				continue

			if @_isValidProperty(k, v)
				stateProperties[k] = v

		return stateProperties

	@_isValidColor: (k, v) ->

		# We check if the property name ends with color, because we don't want
		# to convert every string that looks like a Color, like the html property containing "add"
		if _.endsWith(k.toLowerCase(), "color") and _.isString(v) and Color.isColorString(v)
			return true

		return false

	@_isValidProperty: (k, v) ->
		return true if _.isNumber(v)
		return true if _.isFunction(v)
		return true if _.isBoolean(v)
		return true if _.isString(v)
		return true if Color.isColorObject(v)
		return true if v is null
		return true if v?.constructor?.name is "Layer"
		return false
