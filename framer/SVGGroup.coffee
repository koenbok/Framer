{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVG} = require "./SVG"

class SVGGroup extends Layer

	constructor: (group, options) ->
		@_element = group
		super (options)
		SVG.updateGradientSVG(@)

	_insertElement: ->

	@defineGroupProxyProp = (propertyName, validator, converter, toStyle) ->
		validator ?= SVG.validFill
		converter ?= SVG.toFill

		toStyle ?= (value) ->
			if value instanceof Color
				value.toRgbString()
			else
				value

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
	@defineGroupProxyProp "strokeWidth", _.isNumber, parseInt, Object.prototype.toString
	@defineGroupProxyProp "strokeWidthMultiplier", _.isNumber, parseInt, Object.prototype.toString
	@defineGroupProxyProp "color", Color.validColorValue, Color.toColor

	@define "gradient",
		get: ->
			@_gradient
		set: (value) -> # Copy semantics!
			if Gradient.isGradient(value)
				@_gradient = new Gradient(value)
			else if not value and Gradient.isGradientObject(@_gradient)
				@_gradient = null
			SVG.updateGradientSVG(@)



exports.SVGGroup = SVGGroup
