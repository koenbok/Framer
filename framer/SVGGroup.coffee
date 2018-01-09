{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVG} = require "./SVG"

class SVGGroup extends Layer

	constructor: (group, options) ->
		@_element = group
		super (options)

	_insertElement: ->

	@defineGroupProxyProp = (propertyName, validator, converter, toStyle) ->
		validator ?= SVG.validFill
		converter ?= SVG.toFill
		toStyle ?= (value) -> value.toRgbString()
		privateProp = "_" + propertyName

		return @define propertyName,
			get: ->
				return @[privateProp]

			set: (value) ->
				value = converter(value) unless validator(value)
				if validator(value)
					@[privateProp] = value
				else
					@[privateProp] = null

				persistedValue = @[privateProp]
				elements = @_element?.querySelectorAll("[id]") or []
				for element in elements
					if (persistedValue is null)
						delete element.style[propertyName]
					else
						element.style[propertyName] = toStyle(persistedValue)

	@defineGroupProxyProp "fill"
	@defineGroupProxyProp "stroke"
	# Unclear what "strokeWidthMultiplier" should do. It's present on SVGLayer, but it
	# doesn't seem to do anything. Omitting it here for now.
	@defineGroupProxyProp "strokeWidth", _.isNumber, parseInt, (value) -> value.toString()
	@defineGroupProxyProp "color", Color.validColorValue, Color.toColor

exports.SVGGroup = SVGGroup
