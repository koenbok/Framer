{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVGBaseLayer} = require "./SVGBaseLayer"
{SVG} = require "./SVG"

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

class exports.SVGPath extends SVGBaseLayer
	constructor: (path, options) ->
		if path instanceof SVGPath
			path = path.element

		options.element = path
		super(options)

		if path instanceof SVGPathElement
			@_path = path
		else if path instanceof SVGUseElement
			link = path.getAttribute("xlink:href").replace("#", '')
			@_path = @_svg.getElementById(link)
		@_length = @_path.getTotalLength()

	# Custom properties
	@define "fill", layerProperty(@, "fill", "fill", null, SVG.validFill, SVG.toFill)
	@define "stroke", layerProperty(@, "stroke", "stroke", null, SVG.validFill, SVG.toFill)
	@define "strokeWidth", layerProperty(@, "strokeWidth", "strokeWidth", null, _.isNumber, parseFloat)
	@define "strokeLinecap", layerProperty(@, "strokeLinecap", "strokeLinecap", null, _.isString)
	@define "strokeLinejoin", layerProperty(@, "strokeLinejoin", "strokeLinejoin", null, _.isString)
	@define "strokeMiterlimit", layerProperty(@, "strokeMiterlimit", "strokeMiterlimit", null, _.isNumber, parseFloat)
	@define "strokeOpacity", layerProperty(@, "strokeOpacity", "strokeOpacity", null, _.isNumber, parseFloat)
	@define "strokeDasharray", layerProperty(@, "strokeDasharray", "strokeDasharray", [], _.isArray, dashArrayTransform)
	@define "strokeDashoffset", layerProperty(@, "strokeDashoffset", "strokeDashoffset", null, _.isNumber, parseFloat)
	@define "strokeLength", layerProperty @, "strokeLength", null, undefined, _.isNumber, null, {}, (path, value) ->
		path._properties.strokeFraction = value / path.length
		if _.isEmpty path.strokeDasharray
			path.strokeDasharray = [path.length]
		path.strokeDashoffset = path.length - value
	@define "strokeFraction", layerProperty @, "strokeFraction", null, undefined, _.isNumber, null, {}, (path, value) ->
		path.strokeLength = path.length * value

	@define "length", get: -> @_length
	@define "start", get: -> @pointAtFraction(0)
	@define "end", get: -> @pointAtFraction(1)

	pointAtFraction: (fraction) ->
		@_path.getPointAtLength(@length * fraction)

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
