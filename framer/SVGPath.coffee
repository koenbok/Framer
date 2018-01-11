{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"

dashArrayTransform = (value) ->
	if _.isString value
		values = []
		if value.indexOf(",") isnt -1
			values = value.split(',')
		else
			values = value.split(" ")
		values = values.map((v) -> parseFloat(v.trim()))
		return values
	return value

class exports.SVGPath extends Layer
	# Overridden Layer properties

	@define "parent",
		enumerable: false
		exportable: false
		importable: false
		get: ->
			@_parent or null

	@define "html",
		get: ->
			@_element.outerHTML or ""
	
	# Disabled properties
	@undefine ["label", "blending", "image"]
	@undefine ["blur", "brightness", "saturate", "hueRotate", "contrast", "invert", "grayscale", "sepia"] # webkitFilter properties
	@undefine ["backgroundBlur","backgroundBrightness","backgroundSaturate","backgroundHueRotate","backgroundContrast","backgroundInvert","backgroundGrayscale","backgroundSepia"] # webkitBackdropFilter properties
	for i in [0..8]
		do (i) =>
			@undefine "shadow#{i+1}"
	@undefine "shadows"
	@undefine ["borderRadius", "cornerRadius", "borderStyle"]
	@undefine ["constraintValues", "htmlIntrinsicSize"]

	# Proxied helpers
	@proxy = (propertyName, proxiedName) ->
		@define propertyName,
			get: ->
				@[proxiedName]
			set: (value) ->
				return if @__applyingDefaults
				@[proxiedName] = value

	@proxy "borderColor", "stroke"
	@proxy "strokeColor", "stroke"
	@proxy "borderWidth", "strokeWidth"

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

	constructor: (path, options) ->
		return null if not SVGPath.isPath(path)
		if path instanceof SVGPath
			path = path.element
		@_element = path
		@_elementBorder = path
		@_elementHTML = path
		@_parent = options.parent
		delete options.parent
		pathProperties = ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-dasharray", "stroke-dashoffset"]
		_.defaults options, @constructor.attributesFromElement(pathProperties, @_element)
		super(options)
		@_length = @_element.getTotalLength()

		for parent in @ancestors()
			if parent instanceof SVGLayer
				@_svg = parent.svg
				break

		for prop in ["frame", "stroke", "strokeWidth", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeDasharray", "strokeDashoffset"]
			@on "change:#{prop}", @resetViewbox

	resetViewbox: =>
		@_svg.setAttribute("viewBox", "0,0,#{@width},#{@height}")
		@_svg.removeAttribute("viewBox")


	# Custom properties
	@define "fill", layerProperty(@, "fill", "fill", null, Color.validColorValue, Color.toColor)
	@define "stroke", layerProperty(@, "stroke", "stroke", null, Color.validColorValue, Color.toColor)
	@define "strokeWidth", layerProperty(@, "strokeWidth", "strokeWidth", null, _.isNumber, parseFloat)
	@define "strokeLinecap", layerProperty(@, "strokeLinecap", "strokeLinecap", null, _.isString)
	@define "strokeLinejoin", layerProperty(@, "strokeLinejoin", "strokeLinejoin", null, _.isString)
	@define "strokeMiterlimit", layerProperty(@, "strokeMiterlimit", "strokeMiterlimit", null, _.isNumber)
	@define "strokeOpacity", layerProperty(@, "strokeOpacity", "strokeOpacity", null, _.isNumber)
	@define "strokeDasharray", layerProperty(@, "strokeDasharray", "strokeDasharray", [], _.isArray, dashArrayTransform)
	@define "strokeDashoffset", layerProperty(@, "strokeDashoffset", "strokeDashoffset", null, _.isNumber, parseFloat)
	@define "strokeLength", layerProperty @, "strokeLength", null, null, _.isNumber, null, {}, (path, value) ->
		path._properties.strokeFraction = value / path.length
		if _.isEmpty path.strokeDasharray
			path.strokeDasharray = [path.length]
		path.strokeDashoffset = path.length - value
	@define "strokeFraction", layerProperty @, "strokeFraction", null, null, _.isNumber, null, {}, (path, value) ->
		path.strokeLength = path.length * value

	@define "length",
		get: ->
			@_length


	@define "start",
		get: ->
			@pointAtFraction(0)

	@define "end",
		get: ->
			@pointAtFraction(1)

	pointAtFraction: (fraction) ->
		@_element.getPointAtLength(@length * fraction)

	valueUpdater: (axis, target, offset) =>
		switch axis
			when "horizontal"
				offset -= @start.x
				return (key, value) =>
					target[key] = offset + @pointAtFraction(value).x
			when "vertical"
				offset -= @start.y
				return (key, value) =>
					target[key] = offset + @pointAtFraction(value).y
			when "angle"
				return (key, value, delta = 0) =>
					return if delta is 0
					fromPoint = @pointAtFraction(Math.max(value - delta, 0))
					toPoint = @pointAtFraction(Math.min(value + delta, 1))
					angle = Math.atan2(fromPoint.y - toPoint.y, fromPoint.x - toPoint.x) * 180 / Math.PI - 90
					target[key] = angle


	@isPath: (path) ->
		path instanceof SVGPathElement or path instanceof SVGPath

	@getStart: (path) ->
		@getPointAtFraction(path, 0)

	@getPointAtFraction: (path, fraction) ->
		return null if not @isPath(path)
		length = path.getTotalLength() * fraction
		path.getPointAtLength(length)

	@getEnd: (path) ->
		@getPointAtFraction(path, 1)
