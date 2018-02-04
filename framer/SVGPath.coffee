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
	return v

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
		dasharray = []
		if endLength is startLength
			if startLength isnt 0
				dasharray.push(0)
				dasharray.push(startLength)
			remaining = @length - endLength
			if remaining isnt 0
				dasharray.push(0)
				dasharray.push(remaining)
		else if endLength < startLength
			gap = startLength - endLength
			remaining = @length - startLength
			dasharray.push(endLength)
			dasharray.push(gap)
			if remaining isnt 0
				dasharray.push(remaining)
				dasharray.push(0)
		else
			length = endLength - startLength
			remaining = @length - endLength
			if startLength isnt 0
				dasharray.push(0)
				dasharray.push(startLength)
			if length isnt @length and (length isnt 0 or startLength is 0)
				dasharray.push(length)
				if length isnt remaining and remaining isnt 0
					dasharray.push(remaining)
		if @reversed
			if dasharray.length % 2 is 0
				dasharray.push(0)
			dasharray.reverse()
		@strokeDasharray = dasharray

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
		if strokeEnd > path.length
			strokeEnd -= path.length
		path._properties.strokeStart = strokeStart
		path._properties.strokeEnd = strokeEnd
		path._properties.strokeFraction = value / path.length
		path.updateStroke()

	@define "strokeFraction", layerProperty @, "strokeFraction", null, undefined, _.isNumber, ((value, path) -> Math.max(0, Math.min(value, 1))), {}, (path, value) ->
		path.strokeLength = path.length * value

	@define "strokeStart", layerProperty @, "strokeStart", null, undefined, _.isNumber, ((value, path) -> Math.max(0, Math.min(value, path.length))), {}, (path, value) ->
		strokeStart = value
		strokeEnd = path.strokeEnd ? path.strokeLength ? path.length
		if strokeEnd >= strokeStart
			path.strokeLength = strokeEnd - strokeStart
		else
			path.strokeLength = (path.length - strokeStart) + strokeEnd

	@define "strokeEnd", layerProperty @, "strokeEnd", null, undefined, _.isNumber, ((value, path) -> Math.max(0, Math.min(value, path.length))), {}, (path, value) ->
		strokeStart = path.strokeStart ? 0
		strokeEnd = value
		if strokeEnd >= strokeStart
			path.strokeLength = strokeEnd - strokeStart
		else
			path.strokeLength = (path.length - strokeStart) + strokeEnd

	@define "length", get: -> @_length

	@define "reversed", @simpleProperty("reversed", false)

	pointAtFraction: (fraction) ->
		if @reversed
			fraction = 1 - fraction
		@_path.getPointAtLength(@length * fraction)

	rotationAtFraction: (fraction, delta = 0.01) ->
		if @reversed
			fraction = 1 - fraction
		if delta <= 0
			delta = 0.01
		fromPoint = @pointAtFraction(Math.max(fraction - delta, 0))
		toPoint = @pointAtFraction(Math.min(fraction + delta, 1))
		angle = Math.atan2(fromPoint.y - toPoint.y, fromPoint.x - toPoint.x) * 180 / Math.PI - 90
		if @reversed
			angle = 360 - angle
		return angle

	start: (relativeToLayer = null) =>
		point = @pointAtFraction(0)
		point = @convertPointToLayer(point, relativeToLayer?.parent)
		point.rotation = @rotationAtFraction(0)
		return point

	end: (relativeToLayer = null) =>
		point = @pointAtFraction(0)
		point = @convertPointToLayer(point, relativeToLayer?.parent)
		point.rotation = @rotationAtFraction(1)
		return point


	valueUpdater: (axis, target, offset) =>
		switch axis
			when "horizontal"
				offset -= @pointAtFraction(0).x
				return (key, value) =>
					target[key] = offset + @pointAtFraction(value).x
			when "vertical"
				offset -= @pointAtFraction(0).y
				return (key, value) =>
					target[key] = offset + @pointAtFraction(value).y
			when "angle"
				offset -= @rotationAtFraction(0)
				return (key, value, delta = 0) =>
					return if delta is 0
					target[key] = offset + @rotationAtFraction(value, delta)
