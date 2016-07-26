{_} = require "./Underscore"

{Events} = require "./Events"
{BaseClass} = require "./BaseClass"
{Defaults} = require "./Defaults"

LayerStatesIgnoredKeys = ["ignoreEvents"]

class exports.LayerStates extends BaseClass


	constructor: (layer,initial, states={}) ->
		@_previousStates = []
		for stateName,value of states
			@[stateName] = value
		@_layer = layer
		initial ?= layer.props
		@_currentName = 'initial'
		@_initial = LayerStates.filterStateProperties(initial)
		super

	@define "initial",
		enumerable: false
		exportable: false
		importable: false
		get: -> @_initial

	@define "current",
		enumerable: false
		exportable: false
		importable: false
		get: -> @[@_currentName]

	@define "currentName",
		enumerable: false
		exportable: false
		importable: false
		get: -> @_currentName

	emit: (args...) ->
		super
		# Also emit this to the layer with self as argument
		@_layer.emit args...

	@filterStateProperties = (properties) ->

		stateProperties = {}

		# TODO: Maybe we want to support advanced data structures like objects in the future too.
		for k, v of properties

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
