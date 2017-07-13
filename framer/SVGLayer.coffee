{_} = require "./Underscore"
{Color} = require "./Color"
{Layer, layerProperty, layerProxiedValue} = require "./Layer"

validFill = (value) ->
	Color.validColorValue(value) or _.startsWith(value, "url(")

toFill = (value) ->
	if _.startsWith(value, "url(")
		return value
	else
		return Color.toColor(value)
class exports.SVGLayer extends Layer

	constructor: (options={}) ->
		if options.backgroundColor?
			# Backwards compatibility for old Vekter exporter
			options.color ?= options.backgroundColor
		super options
		@updateGradientSVG()

	@define "fill", layerProperty(@, "fill", "fill", null, validFill, toFill)
	@define "stroke", layerProperty(@, "stroke", "stroke", null, validFill, toFill)
	@define "color", layerProperty(@, "color", "color", null, Color.validColorValue, Color.toColor, null, ((layer, value) -> layer.fill = value), "_elementHTML", true)

	@define "gradient",
		get: ->
			return layerProxiedValue(@_gradient, @, "gradient") if Gradient.isGradientObject(@_gradient)
			return null
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
