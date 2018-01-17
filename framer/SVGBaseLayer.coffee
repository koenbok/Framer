{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"

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
			translate = @_element.transform.baseVal.getItem(0).matrix
			options.x ?= translate.e
			options.y ?= translate.f

		super(options)

		rect = @_element.getBoundingClientRect()
		@_width = rect.width * @context.pixelMultiplier
		@_height = rect.height * @context.pixelMultiplier
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

	resetViewbox: =>
		@_svg.setAttribute("viewBox", "0,0,#{@width},#{@height}")
		@_svg.removeAttribute("viewBox")
