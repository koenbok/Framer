{_} = require "./Underscore"
{Color} = require "./Color"
{Layer, layerProperty, layerProxiedValue} = require "./Layer"
{SVG, SVGPath} = require "./SVG"

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
		options.clip ?= false
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

	@define "path",
		get: ->
			if @svg.children.length isnt 1
				throw new Error("SVGLayer.path can only be used on SVG's that have a single child")
			child = @svg.children[0]
			if not SVGPath.isPath(child)
				throw new Error("SVGLayer.path can only be used on SVG's containing an SVGPathElement, not #{Utils.inspectObjectType(child)}")
			return child

	@define "pathStart",
		get: ->
			start = SVGPath.getStart(@path)
			return null if not start?
			point =
				x: @x + start.x
				y: @y + start.y
			return point

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
