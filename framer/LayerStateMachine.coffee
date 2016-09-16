# {_} = require "./Underscore"
#
# {Events} = require "./Events"
{BaseClass} = require "./BaseClass"
# {Defaults} = require "./Defaults"

{LayerStates} = require "./LayerStates"

class exports.LayerStateMachine extends BaseClass

	constructor: (layer) ->
		super
		@_layer = layer
		@properties = {}
		@initial = LayerStates.filterStateProperties(layer.props)
		@reset()

	@define "layer",
		get: -> @_layer

	@define "current",
		get: -> @states[@currentName]

	@define "currentName",
		get: -> @_currentName

	@define "previous",
		get: -> @states[@previousName]

	@define "previousName",
		get: -> _.last(@_previousNames)

	@define "stateNames",
		get: -> _.keys(@states)

	switchTo: (stateName, options={}) ->
		
		# Check if the state exists, if not this is a pretty serious error
		throw Error "No such state: '#{stateName}'" unless @states.hasOwnProperty(stateName)

		# Prep the properties and the options. The options come from the state, and can be overriden
		# with the function arguments here.
		properties = @states[stateName]
		options = _.defaults(properties.options, options) if properties.options

		stateNameA = @currentName
		stateNameB = stateName

		# Note: even if the state is the current state we still want to switch because some properties
		# might be different as they could be set by hand on the layer object.
		
		# Grab the animation and make state switching have the same events (start, stop, end)
		options.start = false
		animation = @layer.animate(properties, options)

		onStart = =>
			@emit(Events.StateSwitchStart, stateNameA, stateNameB, @)

		onStop = =>
			@_previousNames.push(stateNameA)
			@_currentName = stateNameB
			@emit(Events.StateSwitchStop, stateNameA, stateNameB, @)

		onEnd = =>
			instantProperties = _.difference(
				_.keys(properties), 
				_.keys(animation.properties))

			for k in instantProperties
				@layer[k] = properties[k]

			@emit(Events.StateSwitchEnd, stateNameA, stateNameB, @)

		animation.on(Events.AnimationStart, onStart)
		animation.on(Events.AnimationStop, onStop)
		animation.on(Events.AnimationEnd, onEnd)
		
		animation.start()

		return animation

	next: (states) ->
		if not states.length
			states = @stateNames
		Utils.arrayNext(states, @currentName)

	reset: ->
		@states = new LayerStates(@)
		@_previousNames = []
		@_currentName = _.first(@stateNames)

	emit: (args...) ->
			super
			# Also emit this to the layer with self as argument
			@_layer.emit args...
