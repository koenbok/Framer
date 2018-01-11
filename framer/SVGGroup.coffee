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
			@updateGradientSVG()

	updateGradientSVG: ->
		return if @__constructor
		if not Gradient.isGradient(@gradient)
			@_elementGradientSVG?.innerHTML = ""
			return

		if not @_elementGradientSVG
			@_elementGradientSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			@_element.appendChild @_elementGradientSVG

		id = "#{@id}-gradient"
		@_elementGradientSVG.innerHTML = """
			<linearGradient id='#{id}' gradientTransform='rotate(#{@gradient.angle - 90}, 0.5, 0.5)' >
				<stop offset="0" stop-color='##{@gradient.start.toHex()}' stop-opacity='#{@gradient.start.a}' />
				<stop offset="1" stop-color='##{@gradient.end.toHex()}' stop-opacity='#{@gradient.end.a}' />
			</linearGradient>
		"""
		@fill = "url(##{id})"

exports.SVGGroup = SVGGroup
