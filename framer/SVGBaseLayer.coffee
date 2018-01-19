{LayerStyle} = require "./LayerStyle"
{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"

originTransform = (value, layer, name) ->
	sizeProp = undefined
	switch name
		when "originX" then sizeProp = "width"
		when "originY" then sizeProp = "height"
	return value unless sizeProp?
	layerSize = layer[sizeProp]
	parentSize = layer.parent[sizeProp]
	return value unless layerSize > 0 and parentSize > 0
	return (layerSize / parentSize) * value

class exports.SVGBaseLayer extends Layer
	# Overridden Layer properties

	@define "parent",
		enumerable: false
		exportable: false
		importable: false
		get: ->
			@_parent or null
	@define "html",	get: ->	@_element.outerHTML or ""


	@define "width", get: -> @_width
	@define "height", get: -> @_height
	@define "originX", layerProperty(@, "originX", "webkitTransformOrigin", 0.5, _.isNumber, originTransform)
	@define "originY", layerProperty(@, "originY", "webkitTransformOrigin", 0.5, _.isNumber, originTransform)

	# Disabled properties
	@undefine ["label", "blending", "image"]
	@undefine ["blur", "brightness", "saturate", "hueRotate", "contrast", "invert", "grayscale", "sepia"] # webkitFilter properties
	@undefine ["backgroundBlur", "backgroundBrightness", "backgroundSaturate", "backgroundHueRotate", "backgroundContrast", "backgroundInvert", "backgroundGrayscale", "backgroundSepia"] # webkitBackdropFilter properties
	for i in [0..8]
		do (i) =>
			@undefine "shadow#{i+1}"
	@undefine "shadows"
	@undefine ["borderRadius", "cornerRadius", "borderStyle"]
	@undefine ["constraintValues", "htmlIntrinsicSize"]

	# Aliassed helpers
	@alias = (propertyName, proxiedName) ->
		@define propertyName,
			get: ->
				@[proxiedName]
			set: (value) ->
				return if @__applyingDefaults
				@[proxiedName] = value

	@alias "borderColor", "stroke"
	@alias "strokeColor", "stroke"
	@alias "borderWidth", "strokeWidth"
	@alias "backgroundColor", "fill"

	# Overridden functions from Layer
	_insertElement: ->
	updateForSizeChange: ->
	updateForDevicePixelRatioChange: =>
		for cssProperty in ["width", "height", "webkitTransform"]
			@_element.style[cssProperty] = LayerStyle[cssProperty](@)
	copy: undefined
	copySingle: undefined
	addChild: undefined
	removeChild: undefined
	addSubLayer: undefined
	removeSubLayer: undefined
	bringToFront: undefined
	sendToBack: undefined
	placeBefore: undefined
	placeBehind: undefined

	@attributesFromElement: (attributes, element) ->
		options = {}
		for attribute in attributes
			key = _.camelCase attribute
			options[key] = element.getAttribute(attribute)
		return options

	constructor: (options) ->
		element = options.element
		@_element = element
		@_elementBorder = element
		@_elementHTML = element
		@_parent = options.parent
		delete options.parent
		delete options.element

		pathProperties = ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-dasharray", "stroke-dashoffset", "name", "opacity"]
		_.defaults options, @constructor.attributesFromElement(pathProperties, element)
		if @_element.transform.baseVal.numberOfItems > 0
			options.x ?= 0
			options.y ?= 0
			options.rotation ?= 0
			indicesToRemove = []
			pixelMultiplier = Framer?.CurrentContext.pixelMultiplier ? 1
			for i in [0...@_element.transform.baseVal.numberOfItems]
				transform = @_element.transform.baseVal.getItem(i)
				matrix = transform.matrix
				switch transform.type
					when 2 #SVG_TRANSFORM_TRANSLATE
						options.x += matrix.e / pixelMultiplier
						options.y += matrix.f / pixelMultiplier
						indicesToRemove.push(i)
					when 4 #SVG_TRANSFORM_ROTATE
						# We willingly ignore the translation from this matrix
						options.rotation += - (Math.atan2(matrix.c, matrix.d) / Math.PI) * 180
						indicesToRemove.push(i)

			for index in indicesToRemove.reverse()
				@_element.transform.baseVal.removeItem(index)

		@calculateSize()
		if @_parent instanceof SVGLayer
			@_stylesAppliedToParent = ["webkitTransform"]
			for prop in ["x", "y", "z", "scaleX", "scaleY", "scaleZ", "scale", "skewX", "skewY", "skew", "rotationX", "rotationY", "rotationZ", "force2d"]
				options[prop] ?= @_parent[prop]

		super(options)

		for parent in @ancestors()
			if parent instanceof SVGLayer
				@_svg = parent.svg
				break
		@resetViewbox()

		for prop in ["frame", "stroke", "strokeWidth", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeDasharray", "strokeDashoffset", "rotation", "scale"]
			@on "change:#{prop}", @resetViewbox

	@define "gradient",
		get: ->
			console.warn "The gradient property is currently not supported on shapes"
			return undefined
		set: (value) ->
			console.warn "The gradient property is currently not supported on shapes"

	elementInsertedIntoDocument: ->
		super
		@calculateSize()
		@recalculateOrigin()

	calculateSize: ->
		if Framer?.CurrentContext.elementInDOM
			rect = @_element.getBoundingClientRect()
			@_width = rect.width / @_parent.canvasScaleX()
			@_height = rect.height / @_parent.canvasScaleY()
		else
			# No use in calculating, so set width and height to 0
			@_width = 0
			@_height = 0

	recalculateOrigin: ->
		@_properties.originX = originTransform(@originX, @, "originX")
		@_properties.originY = originTransform(@originY, @, "originY")
		@_element.style.webkitTransformOrigin = LayerStyle.webkitTransformOrigin(@)

	resetViewbox: =>
		@_svg.setAttribute("viewBox", "0,0,#{@width},#{@height}")
		@_svg.removeAttribute("viewBox")
