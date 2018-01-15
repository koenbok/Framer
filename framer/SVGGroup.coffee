{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVG} = require "./SVG"

{SVGBaseLayer} = require "./SVGBaseLayer"
{SVGPath} = require "./SVGPath"

class SVGGroup extends SVGBaseLayer
	constructor: (group, options) ->
		options.element = group
		super(options)
		{children, targets} = SVG.constructSVGElements(@, @_element.childNodes, SVGPath, SVGGroup)
		@_children = children
		@elements = targets
		SVG.updateGradientSVG(@)

	@defineGroupProxyProp = (propertyName, validator, transformer) ->
		validator ?= SVG.validFill
		transformer ?= SVG.toFill

		privateProp = "_#{propertyName}"

		return @define propertyName,
			get: ->
				# If our value got set from the outside in, then that's the value that we return:
				return @[privateProp] if @[privateProp]?

				# When not set, try to reduce the value from our children:
				value = null
				for child in @_children
					childPropertyValue = child[propertyName]
					if value is null
						value = childPropertyValue
					else
						if not Utils.equal(childPropertyValue, value)
							# Stick to the internally set value; for the children
							# do not provide a homogeneous value:
							return @[privateProp] ? null

				# This child values are homogeneous; return their value as our value:
				return value

			set: (value) ->
				value = transformer(value) unless validator(value)
				if validator(value)
					@[privateProp] = value
				else
					@[privateProp] = null

				persistedValue = @[privateProp]

				for child in @_children
					child[propertyName] = persistedValue

	@defineGroupProxyProp "fill"
	@defineGroupProxyProp "stroke"
	@defineGroupProxyProp "strokeWidth", _.isNumber, parseInt
	@defineGroupProxyProp "strokeWidthMultiplier", _.isNumber, parseInt
	@defineGroupProxyProp "color", Color.validColorValue, Color.toColor

exports.SVGGroup = SVGGroup
