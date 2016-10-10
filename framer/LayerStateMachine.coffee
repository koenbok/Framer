{BaseClass} = require "./BaseClass"

class exports.LayerStateMachine extends BaseClass

	constructor: (@_layer, @_states) ->
		super

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
		get: -> _.last(@_previousNames) or "default"

	@define "stateNames",
		get: -> Object.keys(@states)

	@define "states",
		get: -> @_states

	switchInstant: (stateName) ->
		@switchTo(stateName, {instant: true})

	switchTo: (stateName, options={}) ->

		# Check if the state exists, if not this is a pretty serious error
		throw Error "No such state: '#{stateName}'" unless @states[stateName]

		# Prep the properties and the options. The options come from the state, and can be overriden
		# with the function arguments here.
		properties = _.clone(@states[stateName])
		options = _.defaults({}, options, properties.animationOptions) if properties.animationOptions
		delete properties.animationOptions

		stateNameA = @currentName
		stateNameB = stateName

		# Note: even if the state is the current state we still want to switch because some properties
		# might be different as they could be set by hand on the layer object.

		# Grab the animation and make state switching have the same events (start, stop, end)
		startAnimation = options.start ? true
		options.start = false
		animation = @layer.animate(properties, options)

		onStart = =>
			@emit(Events.StateSwitchStart, stateNameA, stateNameB, @)

		onStop = =>
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

		animation.start() if startAnimation

		@_previousNames.push(stateNameA)
		@_currentName = stateNameB

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
			delete @states[k] unless k is "default"

		@_previousNames = []
		@_currentName = "default"

	# _namedState: (name) ->
	# 	return _.extend(_.clone(@states[name]), {name: name})

	toInspect: (constructor) ->
		return "<#{@constructor.name} id:#{@id} layer:#{@layer.id} current:'#{@currentName}'>"
