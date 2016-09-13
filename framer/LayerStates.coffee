{_} = require "./Underscore"

{Events} = require "./Events"
{BaseClass} = require "./BaseClass"
{Defaults} = require "./Defaults"

LayerStatesIgnoredKeys = ["ignoreEvents"]

readOnlyProperty = (object, name, enumerable, getter) ->
	Object.defineProperty object, name,
		configurable: true
		enumerable: enumerable
		get: getter
		set: ->
			throw new Error "You can't override special state '#{name}'"

deprecatedProperty = (object, name, replacementSuggestion, stateMachine, getter, setter=null) ->
	Object.defineProperty object, name,
		configurable: true
		enumerable: false
		get: ->
			if stateMachine.properties[name]?
				return stateMachine.properties[name]
			message = "states.#{name} is deprecated"
			if replacementSuggestion?
				message += ", use '#{replacementSuggestion}' instead."
			console.warn message
			getter(stateMachine._layer)
		set: (value) ->
			if setter?
				console.warn "states.#{name} a reserved state name and might not work as expected"
				setter(stateMachine._layer, value)
			else
				console.warn "states.#{name} is a deprecated method, using it as a state name may cause unexpected behaviour in old projects"
				stateMachine.properties[name] = value

class exports.LayerStates
	constructor: (stateMachine) ->
		readOnlyProperty @, "initial", true, -> stateMachine.initial
		readOnlyProperty @, "previous", false, -> stateMachine.previous
		readOnlyProperty @, "current", false, -> stateMachine.current
		readOnlyProperty @, "previousName", false, -> stateMachine.previousName
		readOnlyProperty @, "currentName", false, -> stateMachine.currentName

		## Deprecated methods
		deprecatedProperty @, "add", "layer.states = ", stateMachine, (layer) ->
			(states) ->
				layer.states = states
		deprecatedProperty @, "remove", "delete layer.states.a", stateMachine, (layer) ->
			(stateName) ->
				delete layer.states[stateName]
		deprecatedProperty @, "switch", "layer.animate \"a\"", stateMachine, (layer) ->
			(stateName) ->
				layer.animate stateName
		deprecatedProperty @, "switchInstant", "layer.switchInstant \"a\"", stateMachine, (layer) ->
			(stateName) ->
				layer.switchInstant stateName
		deprecatedProperty @, "all", "layer.stateNames", stateMachine, (layer) ->
			layer.stateNames
		deprecatedProperty @, "states", "layer.stateNames", stateMachine, (layer) ->
			layer.stateNames
		deprecatedProperty @, "next", "layer.animateToNextState", stateMachine, (layer) ->
			(options) ->
				layer.animateToNextState(options)
		deprecatedProperty @, "last", null, stateMachine, (layer) ->
			(options) ->
				last = _.last(stateMachine._previousNames)
				layer.animate(last, options)
		deprecatedProperty @, "animationOptions", null, stateMachine
		, (layer) ->
				layer.options
		, (layer, value) ->
				layer.options = value
		deprecatedProperty @, "animatingKeys", null, stateMachine, (layer) ->
			->
				keys = []
				for name, state of layer.states
					keys = _.union(keys, _.keys(state))
				keys

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
