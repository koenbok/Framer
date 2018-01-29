{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVGBaseLayer} = require "./SVGBaseLayer"
{SVG} = require "./SVG"

dasharrayTransform = (value) ->
	if _.isString value
		values = []
		if value.indexOf(",") isnt -1
			values = value.split(',')
		else
			values = value.split(" ")
		values = values.map((v) -> v.trim())
						.filter((v) -> v.length > 0)
						.map((v) -> parseFloat(v))
		return values
	return value

dashoffsetTransform = (value) ->
	v = parseFloat(value)
	if isNaN(v)
		return null
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
			link = path.getAttribute("xlink:href")
			@_path = @_svg.querySelector(link)
		@_length = @_path.getTotalLength()

	updateStroke: ->
		startLength = @strokeStart ? 0
		endLength = @strokeEnd ? @length
		# print startLength, endLength
		if endLength < startLength
			gap = startLength - endLength
			@strokeDasharray = [endLength, gap, @length - startLength, 0]
		else
			length = endLength - startLength
			@strokeDasharray = [0, startLength, length, @length - endLength]
		print @strokeDasharray

	# Custom properties
	@define "fill", layerProperty(@, "fill", "fill", null, SVG.validFill, SVG.toFill)
	@define "stroke", layerProperty(@, "stroke", "stroke", null, SVG.validFill, SVG.toFill)
	@define "strokeWidth", layerProperty(@, "strokeWidth", "strokeWidth", null, _.isNumber, parseFloat)
	@define "strokeLinecap", layerProperty(@, "strokeLinecap", "strokeLinecap", null, _.isString)
	@define "strokeLinejoin", layerProperty(@, "strokeLinejoin", "strokeLinejoin", null, _.isString)
	@define "strokeMiterlimit", layerProperty(@, "strokeMiterlimit", "strokeMiterlimit", null, _.isNumber, parseFloat)
	@define "strokeOpacity", layerProperty(@, "strokeOpacity", "strokeOpacity", null, _.isNumber, parseFloat)
	@define "strokeDasharray", layerProperty(@, "strokeDasharray", "strokeDasharray", [], _.isArray, dasharrayTransform)
	@define "strokeDashoffset", layerProperty(@, "strokeDashoffset", "strokeDashoffset", null, _.isNumber, dashoffsetTransform)
	@define "strokeLength", layerProperty @, "strokeLength", null, undefined, _.isNumber, ((value, path) -> Math.max(0, Math.min(value, path.length))), {}, (path, value) ->
		strokeStart = path.strokeStart ? 0
		strokeEnd = strokeStart + value
		path._properties.strokeEnd = strokeEnd
		path._properties.strokeFraction = value / path.length
		path.updateStroke()

	@define "strokeFraction", layerProperty @, "strokeFraction", null, undefined, _.isNumber, ((value, path) -> Math.max(0, Math.min(value, 1))), {}, (path, value) ->
		path.strokeLength = path.length * value

	@define "strokeStart", layerProperty @, "strokeStart", null, undefined, _.isNumber, ((value, path) -> Math.max(0, Math.min(value, path.length))), {}, (path, value) ->
		strokeEnd = path.strokeEnd ? @length
		path._properties.strokeLength = Math.abs(strokeEnd - path.strokeStart)
		path.updateStroke()

	@define "strokeEnd", layerProperty @, "strokeEnd", null, undefined, _.isNumber, ((value, path) -> Math.max(0, Math.min(value, path.length))), {}, (path, value) ->
		strokeStart = path.strokeStart ? 0
		path._properties.strokeLength = Math.abs(path.strokeEnd - strokeStart)
		path.updateStroke()

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
