{BaseClass} = require "./BaseClass"
{LayerStyle} = require "./LayerStyle"
{Layer, layerProperty} = require "./Layer"
{Color} = require "./Color"


class SVG
	@isSVG: (svg) ->
		svg instanceof SVGElement


class SVGGroup extends Layer
	constructor: (group, options) ->
		@_element = group
		super (options)

	_insertElement: ->


dashArrayTransform = (value) ->
	if _.isString value
		values = []
		if value.indexOf(",") isnt -1
			values = value.split(',')
		else
			values = value.split(" ")
		values = values.map((v) -> parseInt(v.trim()))
		return values
	return value




class SVGPath extends Layer
	@define "fill", layerProperty(@, "fill", "fill", null, Color.validColorValue, Color.toColor)
	@define "stroke", layerProperty(@, "stroke", "stroke", null, Color.validColorValue, Color.toColor)
	@define "strokeWidth", layerProperty(@, "strokeWidth", "strokeWidth", null, _.isNumber)
	@define "strokeDashoffset", layerProperty(@, "strokeDashoffset", "strokeDashoffset", null, _.isNumber)
	@define "strokeDasharray", layerProperty(@, "strokeDasharray", "strokeDasharray", [], _.isArray, dashArrayTransform)

	@define "length",
		get: ->
			@_length


	@define "start",
		get: ->
			@pointAtFraction(0)

	@define "end",
		get: ->
			@pointAtFraction(1)


	constructor: (path, options) ->
		return null if not SVGPath.isPath(path)
		if path instanceof SVGPath
			path = path.element
		@_element = path
		super(options)
		@_length = @_element.getTotalLength()

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

	_insertElement: ->

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


exports.SVG = SVG
exports.SVGPath = SVGPath
exports.SVGGroup = SVGGroup
