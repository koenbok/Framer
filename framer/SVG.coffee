{_} = require "./Underscore"
{Color} = require "./Color"

class exports.SVG

	@validFill = (value) ->
		Color.validColorValue(value) or _.startsWith(value, "url(")

	@toFill = (value) ->
		if _.startsWith(value, "url(")
			return value
		else
			Color.toColor(value)

	@updateGradientSVG: (svgLayer) ->
		return if svgLayer.__constructor
		if not Gradient.isGradient(svgLayer.gradient)
			svgLayer._elementGradientSVG?.innerHTML = ""
			return

		if not svgLayer._elementGradientSVG
			svgLayer._elementGradientSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			svgLayer._element.appendChild svgLayer._elementGradientSVG

		id = "#{svgLayer.id}-gradient"
		svgLayer._elementGradientSVG.innerHTML = """
			<linearGradient id='#{id}' gradientTransform='rotate(#{svgLayer.gradient.angle - 90}, 0.5, 0.5)' >
				<stop offset="0" stop-color='##{svgLayer.gradient.start.toHex()}' stop-opacity='#{svgLayer.gradient.start.a}' />
				<stop offset="1" stop-color='##{svgLayer.gradient.end.toHex()}' stop-opacity='#{svgLayer.gradient.end.a}' />
			</linearGradient>
		"""
		svgLayer.fill = "url(##{id})"

	@constructSVGElements: (root, elements, PathClass, GroupClass) ->

		targets = {}
		children = []

		if elements?
			for element in elements

				isTarget = element.id?

				options = {}
				options.name = element.id if isTarget
				options.parent = root

				if element instanceof SVGGElement
					group = new GroupClass(element, options)
					children.push(group)
					_.extend(targets, group.elements)
					if isTarget then targets[element.id] = group
					continue
				if element instanceof SVGPathElement
					path = new PathClass(element, options)
					children.push(path)
					if isTarget then targets[element.id] = path
					continue
		return {targets, children}

	@isPath: (path) ->
		path instanceof Framer.SVGPath
