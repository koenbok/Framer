{_} = require "./Underscore"
{Color} = require "./Color"
{Layer, layerProperty, layerProxiedValue} = require "./Layer"
{SVG} = require "./SVG"
{SVGGroup} = require "./SVGGroup"
{SVGPath} = require "./SVGPath"

class exports.SVGLayer extends Layer

	constructor: (options={}) ->
		# Ugly: detect Vekter export with html intrinsic size
		if options.htmlIntrinsicSize? and options.backgroundColor?
			# Backwards compatibility for old Vekter exporter that would
			# set backgroundColor instead of color
			options.color ?= options.backgroundColor
			options.backgroundColor = null
		options.clip ?= false
		if options.svg? or options.html?
			options.backgroundColor ?= null
		super options

		svg = @svg
		if svg
			{targets, children} = SVG.constructSVGElements(svg, SVGPath, SVGGroup)
			@elements = targets
		else
			@elements = []

		SVG.updateGradientSVG(@)

	@define "elements", @simpleProperty("elements", {})

	@define "fill", layerProperty(@, "fill", "fill", null, SVG.validFill, SVG.toFill)
	@define "stroke", layerProperty(@, "stroke", "stroke", null, SVG.validFill, SVG.toFill)
	@define "strokeWidthMultiplier", @simpleProperty("strokeWidthMultiplier", 1)
	@define "strokeWidth", layerProperty(@, "strokeWidth", "strokeWidth", null, _.isNumber)
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
			SVG.updateGradientSVG(@)

	@define "svg",
		get: ->
			svgNode = _.first(@_elementHTML?.children)
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
			if @svg.children?.length isnt 1
				error = "SVGLayer.path can only be used on SVG's that have a single child"
				if Utils.isFramerStudio()
					throw new Error(error)
				else
					console.error(error)
			child = @svg.children[0]
			if not SVGPath.isPath(child)
				error = "SVGLayer.path can only be used on SVG's containing an SVGPathElement, not #{Utils.inspectObjectType(child)}"
				if Utils.isFramerStudio()
					throw new Error(error)
				else
					console.error(error)
			return child

	@define "pathStart",
		get: ->
			start = SVGPath.getStart(@path)
			return null if not start?
			point =
				x: @x + start.x
				y: @y + start.y
			return point
