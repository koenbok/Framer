{_} = require "./Underscore"
{Color} = require "./Color"
{Layer, layerProperty, layerProxiedValue} = require "./Layer"
{SVG} = require "./SVG"
{SVGGroup} = require "./SVGGroup"
{SVGPath} = require "./SVGPath"
Utils = require "./Utils"

class exports.SVGLayer extends Layer

	@DenyCopyMessage: "SVGLayer doesn't support `copy` when the layer has one more children"

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
		if svg?
			{targets, children} = SVG.constructSVGElements(@, svg.childNodes, SVGPath, SVGGroup)
			@elements = targets
			@_children = children
		else
			@elements = []

		SVG.updateGradientSVG(@)

	@define "elements", @simpleProperty("elements", {})

	@define "fill", layerProperty(@, "fill", "fill", null, SVG.validFill, SVG.toFill)
	@define "stroke", layerProperty(@, "stroke", "stroke", null, SVG.validFill, SVG.toFill)
	@define "strokeWidthMultiplier", layerProperty(@, "strokeWidthMultiplier", null, null, _.isNumber)
	@define "strokeWidth", layerProperty(@, "strokeWidth", "strokeWidth", null, _.isNumber, null, {depends: ["strokeWidthMultiplier"]})
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
				idElements = value.querySelectorAll('[id]')
				for element in idElements
					existingElement = document.querySelector("[id='#{element.id}']")
					if existingElement?
						Utils.throwInStudioOrWarnInProduction(Layer.ExistingIdMessage("svg", element.id))
						return
				@_createHTMLElementIfNeeded()
				while @_elementHTML.firstChild
					@_elementHTML.removeChild(@_elementHTML.firstChild)
				if value.parentNode?
					value = value.cloneNode(true)
				@_elementHTML.appendChild(value)

	copy: ->
		layer = @copySingle()
		return layer

	copySingle: ->
		props = @props
		if props.html? and props.svg?
			delete props.svg
		ids = Utils.getIdAttributesFromString(props.html)
		html = props.html
		for id in ids
			uniqueId = Utils.getUniqueId(id)
			if id isnt uniqueId
				html = html.replace(///((id|xlink:href)=["'']\#?)#{id}(["'])///g, "$1#{uniqueId}$3")
				html = html.replace(///(["'']url\(\#)#{id}(\)["'])///g, "$1#{uniqueId}$2")
		props.html = html
		copy = new @constructor(props)
		copy.style = @style
		copy
