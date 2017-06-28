{_} = require "./Underscore"

{Events} = require "./Events"
{BaseClass} = require "./BaseClass"
{Defaults} = require "./Defaults"
{LayerStateMachine} = require "./LayerStateMachine"

LayerStatesIgnoredKeys = ["ignoreEvents", "name", "id"]

reservedStateError = (name) ->
	throw Error("The state '#{name}' is a reserved name.")

deprecatedWarning = (name, suggestion) ->
	message = "layer.states.#{name} is deprecated"
	message += ", use '#{suggestion}' instead." if suggestion?
	console.warn message

namedState = (state, name) ->
	return _.extend({}, {name: name}, state)

class LayerStates

	@defineReserved = (propertyName, descriptor) ->
		descriptor.configurable = true
		descriptor.enumerable ?= false
		descriptor.set ?= -> reservedStateError(propertyName)
		Object.defineProperty(@prototype, propertyName, descriptor)

	@defineReserved "previous", get: -> namedState(@[@machine.previousName], @machine.previousName)
	@defineReserved "current", get: -> namedState(@[@machine.currentName], @machine.currentName)

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
			
			if Gradient.isGradient(v)
				stateProperties[k] = v
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
		return true if Gradient.isGradient(v)
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

		switch: (stateName, options) ->
			deprecatedWarning("switch", "layer.animate(\"state\")")
			@machine.switchTo(stateName, options)

		switchInstant: (stateName) ->
			deprecatedWarning("switchInstant", "layer.animate(\"state\", {instant: true})")
			@machine.switchTo(stateName, {instant: true})

		next: (options...) ->
			deprecatedWarning("next", "layer.stateCycle()")
			options = _.flatten(options)
			@machine.layer.stateCycle(options)

	@defineReserved "add", get: -> methods.add
	@defineReserved "remove", get: -> methods.remove
	@defineReserved "switch", get: -> methods.switch
	@defineReserved "switchInstant", get: -> methods.switchInstant
	@defineReserved "next", get: -> methods.next
	@defineReserved "animationOptions",
		get: -> @machine.layer.animationOptions
		set: (options) -> @machine.layer.animationOptions = options

exports.LayerStates = LayerStates
