{BaseClass} = require "./BaseClass"

class exports.LayerStateMachine extends BaseClass

	constructor: (@_layer, @_states) ->
		super

		@initial = @_states.constructor.filterStateProperties(@_layer.props)
		@reset()

	@define "layer",
		get: -> @_layer

	@define "current",
		get: -> @currentName

	@define "previous",
		get: -> @previousName


	@define "currentName",
		get: -> @_currentName

	@define "previousName",
		get: -> _.last(@_previousNames)

	@define "stateNames",
		get: -> k for k of @_states

	@define "states",
		get: -> @_states

	switchTo: (stateName, options={}) ->
		
		# Check if the state exists, if not this is a pretty serious error
		throw Error "No such state: '#{stateName}'" unless @states[stateName]

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

	emit: (args...) ->
		super
		# Also emit this to the layer with self as argument
		@_layer.emit args...

	reset: ->

		for k in _.keys(@states)
			delete @states[k]

		@_previousNames = []
		@_currentName = "default"

	# _namedState: (name) ->
	# 	return _.extend(_.clone(@states[name]), {name: name})

	toInspect: (constructor) ->
		return "<#{@constructor.name} id:#{@id} layer:#{@layer.id} current:'#{@currentName}'>"
