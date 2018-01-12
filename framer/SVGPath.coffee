{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"
{SVGBaseLayer} = require "./SVGBaseLayer"

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

		@_length = @_element.getTotalLength()
		rect = @_element.getBoundingClientRect()
		@_width = rect.width
		@_height = rect.height
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
