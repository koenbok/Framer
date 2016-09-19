{_} = require "./Underscore"

{Events} = require "./Events"
{BaseClass} = require "./BaseClass"
{Defaults} = require "./Defaults"
{LayerStateMachine} = require "./LayerStateMachine"

LayerStatesIgnoredKeys = ["ignoreEvents"]

reservedStateError = (name) ->
	throw Error("The state '#{name}' is a reserved name.")

deprecatedWarning = (name, suggestion) ->
	message = "layer.states.#{name} is deprecated"
	message += ", use '#{suggestion}' instead." if suggestion?
	console.warn message

class LayerStates

	@defineReserved = (propertyName, descriptor) ->
		descriptor.configurable = true
		descriptor.enumerable ?= false
		descriptor.set ?= -> reservedStateError(propertyName)
		Object.defineProperty(@prototype, propertyName, descriptor)

	@defineReserved "previous", get: -> @machine.previousName
	@defineReserved "current", get: -> @machine.currentName

	# Not sure about these, maybe we should change it
	@defineReserved "previousName", get: -> @machine.previousName
	@defineReserved "currentName", get: -> @machine.currentName
	@defineReserved "_previousState", get: -> @[@machine.previous]
	@defineReserved "_currentState", get: -> @[@machine.current]

	capture = (name) ->
		@[name] = LayerStates.filterStateProperties(@machine.layer.props)

	@defineReserved "capture", get: -> capture

	constructor: (layer) ->

		_machine = new LayerStateMachine(layer, @)

		# A trick to include a reference to the state machine, without exposing
		# the key on the layer states object.

		Object.defineProperty @, "machine",
			enumerable: false
			configurable: false
			get: -> _machine
			set: -> reservedStateError("machine")

		@capture("default")

	@filterStateProperties: (properties) ->

		stateProperties = {}

		for k, v of properties
			
			if k in LayerStatesIgnoredKeys
				continue
			
			if Color.isValidColorProperty(k, v)
				stateProperties[k] = new Color(v)
				continue

			if @_isValidProperty(k, v)
				stateProperties[k] = v

		return stateProperties

	@_isValidProperty: (k, v) ->
		return true if _.isNumber(v)
		return true if _.isFunction(v)
		return true if _.isBoolean(v)
		return true if _.isString(v)
		return true if Color.isColorObject(v)
		return true if v is null
		return true if v?.constructor?.name is "Layer"
		return false

	#################################################################
	# Backwards compatibility

	methods =

		add: (states, object={}) ->
			deprecatedWarning("add", "layer.states = ")
			if _.isString(states)
				@[states] = object
			else
				@machine.layer.states = states

		remove: (stateName) ->
			deprecatedWarning("remove", "delete layer.states.a")
			delete @[stateName]

		switch:  (stateName, options) ->
			deprecatedWarning("switch", "layer.animate(\"state\")")
			@machine.switchTo(stateName, options)

		switchInstant: (stateName) ->
			deprecatedWarning("switchInstant", "layer.animate(\"state\", {instant: true})")
			@machine.switchTo(stateName, {instant: true})

		state: ->
			deprecatedWarning("state", "layer.states.currentName")
			@currentName

		all: ->
			deprecatedWarning("all", "layer.stateNames")
			@machine.stateNames

		stateNames: ->
			deprecatedWarning("stateNames", "layer.stateNames")
			@machine.stateNames

		states: ->
			deprecatedWarning("states", "layer.stateNames")
			@machine.stateNames

		animatingKeys: ->
			deprecatedWarning("animatingKeys")
			keys = []
			for name, state of @
				keys = _.union(keys, _.keys(state))
			return keys

		next: (options) ->
			deprecatedWarning("next", "layer.animateToNextState()")
			@machine.layer.animateToNextState(options)

		last: (options) ->
			deprecatedWarning("last")
			@machine.switchTo(@machine.previousName, options)

		on: (eventName, handler) ->
			@machine.on(eventName, handler)

	@defineReserved "add", get: -> methods.add
	@defineReserved "remove", get: -> methods.remove
	@defineReserved "switch", get: -> methods.switch
	@defineReserved "switchInstant", get: -> methods.switchInstant
	@defineReserved "animatingKeys", get: -> methods.animatingKeys
	@defineReserved "next", get: -> methods.next
	@defineReserved "last", get: -> methods.last
	@defineReserved "state", get: methods.state
	@defineReserved "all", get: methods.all
	@defineReserved "stateNames", get: methods.stateNames
	@defineReserved "states", get: methods.states
	@defineReserved "on", get: -> methods.on
	@defineReserved "animationOptions",
		get: -> @machine.layer.animationOptions
		set: (options) -> @machine.layer.animationOptions = options

exports.LayerStates = LayerStates
