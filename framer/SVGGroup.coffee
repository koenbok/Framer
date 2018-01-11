{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVG} = require "./SVG"
{SVGPath} = require "./SVGPath"

class SVGGroup extends Layer

	constructor: (group, options) ->
		@_element = group

		super (options)

		{children, targets} = SVG.constructSVGElements(group, SVGPath, SVGGroup)
		@_children = children
		@elements = targets

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
				return @[privateProp] if @[privateProp]?

				# When not set, try to reduce the value from our children:
				value = undefined
				for child in @_children
					childPropertyValue = child[propertyName]
					# The equality check is naive - needs more work when comparing Color instances, etc.:
					if value is undefined
						value = childPropertyValue
					else
						if childPropertyValue isnt value
							return @[privateProp]
				return value

			set: (value) ->
				value = converter(value) unless validator(value)
				if validator(value)
					@[privateProp] = value
				else
					@[privateProp] = null

				persistedValue = @[privateProp]

				for child in @_children
					child[propertyName] = persistedValue

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
