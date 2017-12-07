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
		# Ugly: detect Vekter export with html intrinsic size
		if options.htmlIntrinsicSize? and options.backgroundColor?
			# Backwards compatibility for old Vekter exporter that would
			# set backgroundColor instead of color
			options.color ?= options.backgroundColor
			options.backgroundColor = null
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

	@define "svg",
		get: ->
			svgNode = _.first(@_elementHTML.children)
			if svgNode instanceof SVGElement
				return svgNode
			else
				return null
		set: (value) ->
			if typeof value is "string"
				@html = value
			else if value instanceof SVGElement
				@_createHTMLElementIfNeeded()
				while @_elementHTML.firstChild
					@_elementHTML.removeChild(@_elementHTML.firstChild)
				if value.parentNode?
					value = value.cloneNode(true)
				@_elementHTML.appendChild(value)

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
