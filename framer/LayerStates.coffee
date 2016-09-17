{_} = require "./Underscore"

{Events} = require "./Events"
{BaseClass} = require "./BaseClass"
{Defaults} = require "./Defaults"
{LayerStateMachine} = require "./LayerStateMachine"

LayerStatesIgnoredKeys = ["ignoreEvents"]

# readOnlyProperty = (object, name, enumerable, getter) ->
# 	Object.defineProperty object, name,
# 		configurable: true
# 		enumerable: enumerable
# 		get: getter
# 		set: ->
# 			throw new Error "You can't override special state '#{name}'."

# deprecatedProperty = (object, name, replacementSuggestion, stateMachine, getter, setter=null) ->

# 	Object.defineProperty object, name,
# 		configurable: true
# 		enumerable: false
# 		get: ->
# 			if stateMachine.properties[name]?
# 				return stateMachine.properties[name]
# 			message = "layer.states.#{name} is deprecated"
# 			if replacementSuggestion?
# 				message += ", use '#{replacementSuggestion}' instead."
# 			# console.warn message
# 			getter(stateMachine._layer)
# 		set: (value) ->
# 			if setter?
# 				# console.warn "layer.states.#{name} a reserved state name and might not work as expected."
# 				setter(stateMachine._layer, value)
# 			else
# 				# console.warn "layer.states.#{name} is a deprecated method, using it as a state name may cause unexpected behaviour in old projects."
# 				stateMachine.properties[name] = value

reservedStateError = (name) ->
	throw Error("The state '#{name}' is a reserved name.")

class LayerStates

	@defineReserved = (propertyName, descriptor) ->
		descriptor.configurable = true
		descriptor.enumerable ?= false
		descriptor.set = -> reservedStateError(propertyName)
		Object.defineProperty(@prototype, propertyName, descriptor)

	@defineReserved "initial", get: -> @machine.initial
	@defineReserved "previous", get: -> @machine.previousName
	@defineReserved "current", get: -> @machine.currentName

	# Not sure about these, maybe we should change it
	@defineReserved "previousName", get: -> @machine.previousName
	@defineReserved "currentName", get: -> @machine.currentName
	@defineReserved "_previousState", get: -> @[@machine.previous]
	@defineReserved "_currentState", get: -> @[@machine.current]

	# Backwards compatibility, we now prefer 'initial'
	@defineReserved "default", {enumerable: true, get: -> @initial}

	constructor: (layer) ->

		_machine = new LayerStateMachine(layer, @)

		# A trick to include a reference to the state machine, without exposing
		# the key on the layer states object.

		Object.defineProperty @, "machine",
			enumerable: false
			configurable: false
			get: -> _machine
			set: -> reservedStateError("machine")

	@filterStateProperties: (properties) ->

		stateProperties = {}

		# TODO: Maybe we want to support advanced data structures like objects in the future too.
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

# class DeprecatedLayerStates

# 	constructor: (stateMachine) ->

# 		## Deprecated methods
# 		deprecatedProperty @, "add", "layer.states = ", stateMachine, (layer) ->
# 			(states, object={}) ->
# 				if _.isString states
# 					stateName = states
# 					layer.states[stateName] = object
# 				else
# 					layer.states = states
# 		deprecatedProperty @, "remove", "delete layer.states.a", stateMachine, (layer) ->
# 			(stateName) ->
# 				delete layer.states[stateName]
# 		deprecatedProperty @, "switch", "layer.animate \"a\"", stateMachine, (layer) ->
# 			(stateName) ->
# 				layer.animate stateName
# 		deprecatedProperty @, "switchInstant", "layer.switchInstant \"a\"", stateMachine, (layer) ->
# 			(stateName) ->
# 				layer.switchInstant stateName
# 		deprecatedProperty @, "state", "layer.states.currentName", stateMachine, (layer) ->
# 			layer.states.currentName
# 		deprecatedProperty @, "all", "layer.stateNames", stateMachine, (layer) ->
# 			layer.stateNames
# 		deprecatedProperty @, "states", "layer.stateNames", stateMachine, (layer) ->
# 			layer.stateNames
# 		deprecatedProperty @, "next", "layer.animateToNextState", stateMachine, (layer) ->
# 			(options) ->
# 				layer.animateToNextState(options)
# 		deprecatedProperty @, "last", null, stateMachine, (layer) ->
# 			(options) ->
# 				last = _.last(stateMachine._previousNames)
# 				layer.animate(last, options)
# 		deprecatedProperty @, "animationOptions", null, stateMachine
# 		, (layer) ->
# 				layer.animationOptions
# 		, (layer, value) ->
# 				layer.animationOptions = value
# 		deprecatedProperty @, "animatingKeys", null, stateMachine, (layer) ->
# 			->
# 				keys = []
# 				for name, state of layer.states
# 					keys = _.union(keys, _.keys(state))
# 				keys
# 		deprecatedProperty @, "on", "layer.on", stateMachine, (layer) ->
# 			(name, handler) ->
# 				layer.on(name, handler)

exports.LayerStates = LayerStates
