{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVG} = require "./SVG"
{SVGPath} = require "./SVGPath"

class SVGGroup extends Layer

	constructor: (group, options) ->
		@_element = group
		@_parent = options.parent
		delete options.parent

		super (options)

		{children, targets} = SVG.constructSVGElements(@, @_element.childNodes, SVGPath, SVGGroup)
		@_children = children
		@elements = targets
		for parent in @ancestors()
			if parent instanceof SVGLayer
				@_svg = parent.svg
				break

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

		privateProp = "_#{propertyName}"

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
			# No reduction from child members here; don't think we need it for gradients per se.
			@_gradient
		set: (value) ->
			if Gradient.isGradient(value)
				@_gradient = new Gradient(value)
			else if not value and Gradient.isGradientObject(@_gradient)
				@_gradient = null

			# Below method ends in @fill being set to a url, which is then in turn forwarded
			# to the group's children:
			SVG.updateGradientSVG(@)


exports.SVGGroup = SVGGroup
