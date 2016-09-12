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

class exports.LayerStates
	constructor: (stateMachine) ->
		readOnlyProperty @, "initial", true, -> stateMachine.initial
		readOnlyProperty @, "previous", false, -> stateMachine.previous
		readOnlyProperty @, "current", false, -> stateMachine.current
		readOnlyProperty @, "previousName", false, -> stateMachine.previousName
		readOnlyProperty @, "currentName", false, -> stateMachine.currentName

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
