{BaseClass} = require "./BaseClass"

class SVG
	@isSVG: (svg) ->
		svg instanceof SVGElement


class SVGGroup extends BaseClass
	@define "element", @simpleProperty("element", null)
	constructor: (group) ->
		super
		@element = group


class SVGPath extends BaseClass

	@define "length",
		get: ->
			@_length


	@define "start",
		get: ->
			@pointAtFraction(0)

	@define "end",
		get: ->
			@pointAtFraction(1)

	@define "element", @simpleProperty("element", null)

	constructor: (path) ->
		return null if not SVGPath.isPath(path)
		super
		if path instanceof SVGPath
			path = path.element
		@element = path
		@_length = @element.getTotalLength()

	pointAtFraction: (fraction) ->
		@element.getPointAtLength(@length * fraction)

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


exports.SVG = SVG
exports.SVGPath = SVGPath
exports.SVGGroup = SVGGroup
