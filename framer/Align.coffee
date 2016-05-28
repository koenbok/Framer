pixelRound = parseInt

center = (layer, property, offset=0) ->

	parent = Screen
	parent = layer.parent if layer.parent

	borderWidth = parent.borderWidth
	borderWidth ?= 0

	x = pixelRound((parent.width / 2) - (layer.width / 2) - borderWidth + offset)
	y = pixelRound((parent.height / 2) - (layer.height / 2) - borderWidth + offset)

	return x if property is "x"
	return y if property is "y"
	return {x:x, y:y} if property is "point"
	return 0

left = (layer, property, offset=0) ->
	throw Error "Align.left only works for x" unless property is "x"
	parent = Screen
	parent = layer.parent if layer.parent
	return pixelRound(0 + offset)

right = (layer, property, offset=0) ->
	throw Error "Align.right only works for x" unless property is "x"
	parent = Screen
	parent = layer.parent if layer.parent
	borderWidth = parent.borderWidth
	borderWidth ?= 0
	return pixelRound(parent.width - (2 * borderWidth) - layer.width + offset)

top = (layer, property, offset=0) ->
	throw Error "Align.top only works for y" unless property is "y"
	parent = Screen
	parent = layer.parent if layer.parent
	return pixelRound(0 + offset)

bottom = (layer, property, offset=0) ->
	throw Error "Align.bottom only works for y" unless property is "y"
	parent = Screen
	parent = layer.parent if layer.parent
	borderWidth = parent.borderWidth
	borderWidth ?= 0
	return pixelRound(parent.height - (2 * borderWidth) - layer.height + offset)

# Helper to see if we are dealing with a function or result of a function
wrapper = (f, name) ->
	align = (a, b) ->
		return ((l, p) -> f(l, p, a)) if not a? or _.isNumber(a)
		return f(a, b, 0)
	align.toInspect = ->
		return "Align.#{name}"
	return align

exports.Align =
	center: wrapper(center, "center")
	left: wrapper(left, "left")
	right: wrapper(right, "right")
	top: wrapper(top, "top")
	bottom: wrapper(bottom, "bottom")
