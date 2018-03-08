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

	@updateImagePatternSVG: (svgLayer) ->
		return if svgLayer.__constructor

		if not svgLayer.image
			svgLayer._elementImagePatternSVG?.innerHTML = ""
			return

		transform = ""

		if svgLayer.backgroundSize in ["fill", "fit", "contain", "cover"] and svgLayer.imageSize
			scaleX = 1
			scaleY = 1
			offsetX = 0
			offsetY = 0

			imageWidth = svgLayer.imageSize.width
			imageHeight = svgLayer.imageSize.height

			imageRatio = imageWidth / imageHeight
			realWidth = svgLayer.height * imageRatio
			realHeight = svgLayer.width / imageRatio
			scX = realWidth / svgLayer.width
			scY = realHeight / svgLayer.height

			fillBackground = svgLayer.backgroundSize in ["fill", "cover"]

			if fillBackground and scY > scX or not fillBackground and scY < scX
				scaleY = scY
				offsetY = (1 - scY) / 2
			else
				scaleX = scX
				offsetX = (1 - scX) / 2

			transform = """transform="translate(#{offsetX}, #{offsetY}) scale(#{scaleX}, #{scaleY})" """

		if not svgLayer._elementImagePatternSVG
			svgLayer._elementImagePatternSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			svgLayer._elementImagePatternSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg")
			svgLayer._elementImagePatternSVG.setAttribute("width", "100%")
			svgLayer._elementImagePatternSVG.setAttribute("height", "100%")
			svgLayer._element.appendChild svgLayer._elementImagePatternSVG

		id = "#{svgLayer.id}-image-pattern"
		svgLayer._elementImagePatternSVG.innerHTML = """
			<pattern id="#{id}" width="100%" height="100%" patternContentUnits="objectBoundingBox">
				<image width="1" height="1" xlink:href=#{svgLayer.image} preserveAspectRatio="none" #{transform} />
			</pattern>
		"""
		svgLayer.fill = "url(##{id})"

	@constructSVGElements: (root, elements, PathClass, GroupClass) ->

		targets = {}
		children = []

		if elements?
			for element in elements
				unless element instanceof SVGElement
					# Children can contain text nodes
					continue
				name = element.getAttribute("name")
				if not name?
					if element instanceof SVGGElement
						defsResult = @constructSVGElements(root, element.childNodes, PathClass, GroupClass)
						_.extend targets, defsResult.targets
						children = children.concat(defsResult.children)
						continue
					continue

				options = {}
				options.name = name
				options.parent = root

				if element instanceof SVGGElement
					group = new GroupClass(element, options)
					children.push(group)
					_.extend(targets, group.elements)
					if element.id? and element.id isnt ""
						targets[element.id] = group
					continue
				if element instanceof SVGPathElement or element instanceof SVGUseElement
					path = new PathClass(element, options)
					children.push(path)
					if path._path.id? and path._path.id isnt ""
						id = path._path.id
						targets[id] = path
					continue
		return {targets, children}

	@isPath: (path) ->
		path instanceof Framer.SVGPath
